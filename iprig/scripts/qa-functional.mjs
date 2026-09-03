/**
 * Tests fonctionnels du site.
 *
 *   node scripts/qa-functional.mjs [baseUrl]
 *
 * Couvre : liens internes, liens Patreon, menu mobile (souris + clavier +
 * Échap + piège de focus), accordéon FAQ, skip link, métadonnées,
 * prefers-reduced-motion, et fonctionnement sans JavaScript.
 */
import { chromium } from 'playwright-core';

const BASE = process.argv[2] ?? 'http://localhost:4321';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PATREON = 'https://www.patreon.com/IPRIG';

/* V4.3.3 — l’adhésion a changé de compte Patreon. L’ancienne adresse ne
   répond plus : un seul bouton oublié enverrait un visiteur sur une page
   « introuvable ». On la traque donc par son identifiant, sans casse, pour
   attraper aussi bien un href qu’un `preconnect` ou un JSON-LD.

   ⚠ Ne vise QUE le compte Patreon. Les comptes sociaux KevanExplique
   (instagram.com/kevanexplique, tiktok, twitch…) sont ceux de la marque de
   contenu : ils restent en place et ne sont pas concernés. */
const PATREON_ANCIEN = /patreon\.com\/kevanexplique/i;

/** Les sept pages publiques du site, dans l’ordre du plan. */
const PAGES_PUBLIQUES = [
  '/',
  '/programme',
  '/certificats',
  '/kevan-gafaiti',
  '/contact',
  '/mentions-legales',
  '/politique-confidentialite',
];

const results = [];
const check = (name, ok, detail = '') =>
  results.push({ name, ok, detail: ok ? '' : detail });


/* --------------------------------------------------------------- GARDE ---
   Ces controles doivent porter sur le SITE CONSTRUIT (`astro preview`), pas
   sur le serveur de developpement.

   Le piege est reel : `astro dev` et `astro preview` visent tous deux le port
   4321, et un `astro dev` deja lance le garde. Les pages se ressemblent, mais
   le serveur de developpement injecte le client Vite et la barre d'outils
   Astro — soit plusieurs centaines de kilo-octets de JavaScript qui
   n'existent pas en production, une barre visible sur chaque capture, et pas
   de fichiers `sitemap-*.xml`. Une QA passee la-dessus ne mesure pas le site
   livre.

   On refuse donc de continuer plutot que de produire un rapport faux. */
{
  const html = await (await fetch(BASE + '/')).text();
  if (/@vite\/client|astro-dev-toolbar/.test(html)) {
    console.error(
      `\n  ARRET : ${BASE} est un serveur de DEVELOPPEMENT, pas le site construit.\n` +
        '  Lancer `npm run build` puis `npm run preview`, et relancer la QA sur\n' +
        "  le port annonce par la prevision (un `astro dev` deja lance occupe 4321).\n",
    );
    process.exit(2);
  }
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

/* ========================================================== 1. LIENS ==== */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  const links = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')].map((a) => ({
      href: a.getAttribute('href'),
      abs: a.href,
      target: a.target,
      rel: a.rel,
      text: (a.textContent || '').trim().slice(0, 40),
    })),
  );

  // Tous les liens Patreon pointent vers la même URL, centralisée.
  const patreon = links.filter((l) => l.abs.includes('patreon.com'));
  check('Liens Patreon présents', patreon.length >= 3, `${patreon.length} trouvés`);
  check(
    'Tous les liens Patreon pointent vers la bonne URL',
    patreon.every((l) => l.abs === PATREON),
    patreon.map((l) => l.abs).join(' | '),
  );
  check(
    'Liens externes sécurisés (noopener + noreferrer)',
    patreon.every((l) => l.rel.includes('noopener') && l.rel.includes('noreferrer')),
    patreon.map((l) => l.rel).join(' | '),
  );

  /* Les seuls domaines externes admis sont ceux des comptes réellement
     fournis par le client (src/data/site.ts). Tout autre domaine signale
     un lien inventé ou oublié. */
  const DOMAINES_AUTORISES = [
    'patreon.com',
    'instagram.com',
    'tiktok.com',
    'youtube.com',
    'linkedin.com',
    'twitch.tv',
    'open.spotify.com',
    'podcasts.apple.com', // ajouté en V4.1 : URL fournie le 01/09/2026
  ];

  const externes = links.filter((l) => /^https?:\/\//.test(l.href ?? ''));
  const inattendus = externes.filter(
    (l) => !DOMAINES_AUTORISES.some((d) => new URL(l.abs).hostname.endsWith(d)),
  );
  check(
    'Aucun domaine externe non prévu sur l’accueil',
    inattendus.length === 0,
    inattendus.map((l) => l.abs).join(' | '),
  );

  const nonHttps = externes.filter((l) => !l.abs.startsWith('https://'));
  check(
    'Tous les liens externes sont en HTTPS',
    nonHttps.length === 0,
    nonHttps.map((l) => l.abs).join(' | '),
  );

  const nonSecurises = externes.filter(
    (l) => !l.rel.includes('noopener') || !l.rel.includes('noreferrer'),
  );
  check(
    'Tous les liens externes portent noopener + noreferrer',
    nonSecurises.length === 0,
    nonSecurises.map((l) => `${l.abs} (rel="${l.rel}")`).join(' | '),
  );

  // Chaque lien interne répond.
  const internes = [
    ...new Set(
      links
        .map((l) => l.href)
        .filter((h) => h && h.startsWith('/') && !h.startsWith('//')),
    ),
  ];
  const casses = [];
  for (const href of internes) {
    const r = await page.request.get(BASE + href);
    if (!r.ok()) casses.push(`${href} → ${r.status()}`);
  }
  check('Tous les liens internes répondent', casses.length === 0, casses.join(' | '));

  /* Chaque ancre DE CETTE PAGE existe.
     Une ancre vers une AUTRE page (`/certificats#preinscription`) ne peut pas
     être vérifiée ici : la cible n'est pas dans ce document. Ces liens sont
     couverts par le contrôle « tous les liens internes répondent » ci-dessus,
     et par le contrôle inter-pages qui suit. */
  const ancres = [
    ...new Set(
      links
        .map((l) => l.href)
        .filter((h) => h && (h.startsWith('#') || h.startsWith('/#'))),
    ),
  ]
    .map((h) => h.split('#')[1])
    .filter(Boolean);
  const ancresManquantes = await page.evaluate(
    (ids) => ids.filter((id) => !document.getElementById(id)),
    ancres,
  );
  check(
    'Toutes les ancres existent',
    ancresManquantes.length === 0,
    ancresManquantes.join(', '),
  );

  await page.close();
}

/* ======================================== 1 bis. PATREON PARTOUT ====
   La section 1 ne regarde que l’accueil. Le CTA Patreon, lui, est repris
   par le header, le pied de page et l’affiche de clôture : il apparaît donc
   sur les sept pages. Un changement d’adresse doit être vérifié sur toutes,
   sans quoi une page oubliée continue d’envoyer vers un compte mort. */
{
  const page = await browser.newPage();
  const mauvais = [];
  const residus = [];
  let total = 0;

  for (const chemin of PAGES_PUBLIQUES) {
    const reponse = await page.goto(BASE + chemin, { waitUntil: 'domcontentloaded' });

    const liens = await page.evaluate(() =>
      [...document.querySelectorAll('a[href*="patreon.com"]')].map((a) => a.href),
    );
    total += liens.length;
    for (const href of liens) if (href !== PATREON) mauvais.push(`${chemin} → ${href}`);

    // Le HTML brut, pas seulement les ancres : `preconnect`, JSON-LD et
    // métadonnées passeraient sinon entre les mailles.
    if (PATREON_ANCIEN.test(await reponse.text())) residus.push(chemin);
  }

  check('Un CTA Patreon sur chacune des sept pages', total >= PAGES_PUBLIQUES.length, `${total} liens`);
  check('Tous les CTA Patreon pointent vers le compte IPRIG', mauvais.length === 0, mauvais.join(' | '));
  check("Plus aucune trace de l'ancien compte Patreon", residus.length === 0, residus.join(' | '));

  await page.close();
}

/* =================================================== 2. MENU MOBILE ==== */
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  const toggle = page.locator('#menu-toggle');
  const drawer = page.locator('#mobile-menu');

  check('Menu fermé au chargement', await drawer.isHidden());
  check(
    'aria-expanded = false au départ',
    (await toggle.getAttribute('aria-expanded')) === 'false',
  );
  check(
    'aria-controls pointe vers le tiroir',
    (await toggle.getAttribute('aria-controls')) === 'mobile-menu',
  );

  // Ouverture
  await toggle.click();
  await page.waitForTimeout(200);
  check('Le menu s’ouvre au clic', await drawer.isVisible());
  check(
    'aria-expanded = true une fois ouvert',
    (await toggle.getAttribute('aria-expanded')) === 'true',
  );
  check(
    'Le focus part sur le bouton de fermeture',
    await page.evaluate(() => document.activeElement?.id === 'menu-close'),
  );
  check(
    'Le défilement de la page est verrouillé',
    await page.evaluate(() => document.body.style.overflow === 'hidden'),
  );

  // Piège de focus : Tab en boucle ne sort jamais du tiroir
  let sorti = false;
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    const dedans = await page.evaluate(() =>
      document.getElementById('mobile-menu')?.contains(document.activeElement),
    );
    if (!dedans) {
      sorti = true;
      break;
    }
  }
  check('Le focus reste piégé dans le menu ouvert', !sorti);

  // Shift+Tab remonte aussi sans sortir
  let sortiArriere = false;
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Shift+Tab');
    const dedans = await page.evaluate(() =>
      document.getElementById('mobile-menu')?.contains(document.activeElement),
    );
    if (!dedans) {
      sortiArriere = true;
      break;
    }
  }
  check('Le focus reste piégé en Maj+Tab', !sortiArriere);

  // Échap ferme et rend le focus
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  check('Échap ferme le menu', await drawer.isHidden());
  check(
    'Le focus revient sur le bouton d’ouverture',
    await page.evaluate(() => document.activeElement?.id === 'menu-toggle'),
  );
  check(
    'Le défilement est rendu',
    await page.evaluate(() => document.body.style.overflow === ''),
  );

  // Ouverture au clavier (Entrée) puis clic sur une ancre
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  check('Le menu s’ouvre au clavier', await drawer.isVisible());

  await page.locator('#mobile-menu a[href="/#faq"]').click();
  await page.waitForTimeout(300);
  check('Un lien d’ancre ferme le menu', await drawer.isHidden());

  await page.close();
}

/* ========================================================= 3. FAQ ==== */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  const nb = await page.locator('.qa').count();
  check('La FAQ contient des questions', nb >= 5, `${nb} questions`);

  const ferme = await page.evaluate(
    () => document.querySelectorAll('.qa[open]').length,
  );
  check('Toutes les questions sont fermées au départ', ferme === 0);

  const premiere = page.locator('.qa').first();
  await premiere.locator('summary').click();
  await page.waitForTimeout(350);
  check('Une question s’ouvre au clic', await premiere.evaluate((e) => e.open));
  check(
    'La réponse est visible',
    await premiere.locator('.qa__answer p').first().isVisible(),
  );

  // Ouverture au clavier
  await page.locator('.qa').nth(1).locator('summary').focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(350);
  check(
    'Une question s’ouvre au clavier',
    await page.locator('.qa').nth(1).evaluate((e) => e.open),
  );

  await page.close();
}

/* ============================ 4. PROGRESSION DE LECTURE ==== */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  const lire = () =>
    page.evaluate(() => {
      const bar = document.querySelector('.header__progress-bar');
      if (!bar) return null;
      const m = new DOMMatrixReadOnly(getComputedStyle(bar).transform);
      const anim = bar.getAnimations()[0];
      return {
        scaleX: m.a,
        timeline: anim?.timeline?.constructor?.name ?? null,
        sda: CSS.supports('animation-timeline: scroll()'),
      };
    });

  const haut = await lire();
  check('Barre de progression à zéro en haut de page', haut !== null && haut.scaleX < 0.05, JSON.stringify(haut));

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(400);
  const milieu = await lire();
  check(
    'Barre de progression à mi-page (~50 %)',
    milieu.scaleX > 0.35 && milieu.scaleX < 0.65,
    `scaleX=${milieu.scaleX?.toFixed(3)}`,
  );

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  const bas = await lire();
  check(
    'Barre de progression pleine en bas de page',
    bas.scaleX > 0.95,
    `scaleX=${bas.scaleX?.toFixed(3)}`,
  );

  // Le chemin CSS (hors thread principal) doit être celui qui s'applique
  // quand le navigateur le supporte — sinon le repli JS tourne pour rien.
  if (haut.sda) {
    check(
      'La progression utilise bien un ScrollTimeline CSS',
      milieu.timeline === 'ScrollTimeline',
      String(milieu.timeline),
    );
  }

  await page.close();
}

/* =================================================== 5. SKIP LINK ==== */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  await page.keyboard.press('Tab');
  await page.waitForTimeout(300); // laisse la transition d'apparition se terminer
  const skip = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      classe: el.className,
      href: el.getAttribute('href'),
      visible: r.top >= 0 && r.height > 0,
    };
  });
  check(
    'Le premier Tab atteint le skip link',
    skip?.classe?.includes('skip-link'),
    JSON.stringify(skip),
  );
  check('Le skip link devient visible au focus', skip?.visible === true);
  check('Le skip link cible #contenu', skip?.href === '#contenu');

  await page.close();
}

/* ======================================= 6. REDUCED MOTION / NO-JS ==== */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  const invisibles = await page.evaluate(
    () =>
      [...document.querySelectorAll('[data-reveal]')].filter(
        (el) => getComputedStyle(el).opacity !== '1',
      ).length,
  );
  check(
    'En mouvement réduit, tout le contenu est visible immédiatement',
    invisibles === 0,
    `${invisibles} bloc(s) transparents`,
  );

  const anime = await page.evaluate(
    () =>
      [...document.querySelectorAll('[data-reveal]')].filter((el) => {
        const d = getComputedStyle(el).transitionDuration;
        return d !== '0s' && parseFloat(d) > 0.05;
      }).length,
  );
  check('En mouvement réduit, aucune transition longue', anime === 0, `${anime}`);
  await ctx.close();
}

{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });

  const texte = (await page.locator('main').innerText()).length;
  check('Sans JavaScript, le contenu reste lisible', texte > 3000, `${texte} caractères`);

  const ctaVisible = await page
    .locator(`a[href="${PATREON}"]`)
    .first()
    .isVisible();
  check('Sans JavaScript, le CTA Patreon reste visible', ctaVisible);
  await ctx.close();
}

/* ================================================= 7. MÉTADONNÉES ==== */
{
  const PAGES = [
    { path: '/', canonical: 'https://iprig.fr/', noindex: false },
    { path: '/programme', canonical: 'https://iprig.fr/programme', noindex: false },
    {
      path: '/kevan-gafaiti',
      canonical: 'https://iprig.fr/kevan-gafaiti',
      noindex: false,
    },
    { path: '/contact', canonical: 'https://iprig.fr/contact', noindex: false },
    {
      path: '/mentions-legales',
      canonical: 'https://iprig.fr/mentions-legales',
      noindex: true,
    },
    {
      path: '/politique-confidentialite',
      canonical: 'https://iprig.fr/politique-confidentialite',
      noindex: true,
    },
  ];

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const titres = new Set();

  for (const p of PAGES) {
    await page.goto(BASE + p.path, { waitUntil: 'domcontentloaded' });
    const meta = await page.evaluate(() => ({
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content ?? null,
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
      robots: document.querySelector('meta[name="robots"]')?.content ?? null,
      ogImage: document.querySelector('meta[property="og:image"]')?.content ?? null,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content ?? null,
      lang: document.documentElement.lang,
    }));

    titres.add(meta.title);
    check(`${p.path} — titre présent`, !!meta.title && meta.title.length > 10, meta.title);
    check(
      `${p.path} — description présente`,
      !!meta.desc && meta.desc.length > 50,
      String(meta.desc),
    );
    check(`${p.path} — canonical correct`, meta.canonical === p.canonical, String(meta.canonical));
    check(
      `${p.path} — indexation ${p.noindex ? 'bloquée' : 'autorisée'}`,
      p.noindex ? meta.robots?.includes('noindex') : !meta.robots,
      String(meta.robots),
    );
    check(
      `${p.path} — image de partage en PNG`,
      meta.ogImage === 'https://iprig.fr/og-image.png',
      String(meta.ogImage),
    );
    check(`${p.path} — lang="fr"`, meta.lang === 'fr', meta.lang);
  }

  check('Chaque page a un titre distinct', titres.size === PAGES.length, `${titres.size}/${PAGES.length}`);

  // JSON-LD sur l'accueil
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const jsonld = await page.evaluate(() => {
    const el = document.querySelector('script[type="application/ld+json"]');
    if (!el) return null;
    try {
      return JSON.parse(el.textContent ?? '');
    } catch {
      return 'INVALIDE';
    }
  });
  check('JSON-LD présent et valide', jsonld && jsonld !== 'INVALIDE');
  if (jsonld && jsonld !== 'INVALIDE') {
    const types = jsonld['@graph'].map((n) => n['@type']);
    check(
      'JSON-LD : Organization, WebSite, Person',
      ['Organization', 'WebSite', 'Person'].every((t) => types.includes(t)),
      types.join(', '),
    );
    const brut = JSON.stringify(jsonld);
    check(
      'JSON-LD sans note, avis ni prix inventés',
      !/aggregateRating|review|ratingValue|priceCurrency|offers/i.test(brut),
    );
  }

  // robots.txt et sitemap
  const robots = await page.request.get(BASE + '/robots.txt');
  check('robots.txt accessible', robots.ok());
  const robotsTxt = await robots.text();
  check(
    'robots.txt référence le sitemap',
    robotsTxt.includes('sitemap-index.xml'),
    robotsTxt.slice(0, 80),
  );

  /* Le sitemap est lu par HTTP quand c'est possible, sur le disque sinon.
     `astro preview` le sert normalement ; c'est le serveur de DÉVELOPPEMENT
     qui n'a pas de `sitemap-*.xml` à servir, puisque le fichier est produit
     au build. Le repli sur le disque garde donc le contrôle utile même si
     quelqu'un lance ce script au mauvais endroit — mais la garde en tête de
     fichier devrait l'avoir arrêté avant. Ce qui compte est le CONTENU du
     sitemap, identique dans les deux cas. */
  const sitemapHttp = await page.request.get(BASE + '/sitemap-0.xml');
  let xml = '';
  let source = 'HTTP';
  if (sitemapHttp.ok()) {
    xml = await sitemapHttp.text();
  } else {
    source = 'dist/';
    const { readFileSync, existsSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, resolve } = await import('node:path');
    const disque = resolve(
      dirname(fileURLToPath(import.meta.url)),
      '../dist/sitemap-0.xml',
    );
    if (existsSync(disque)) xml = readFileSync(disque, 'utf8');
  }
  check('sitemap présent (' + source + ')', xml.includes('<urlset'), xml.slice(0, 80));
  check(
    'sitemap : /certificats référencée',
    xml.includes('https://iprig.fr/certificats'),
  );
  check(
    'Les pages légales incomplètes sont hors sitemap',
    !xml.includes('mentions-legales') && !xml.includes('politique-confidentialite'),
  );
  check('Le sitemap utilise le bon domaine', xml.includes('https://iprig.fr/'));

  await page.close();
}

/* ============================================ TYPOGRAPHIE FRANÇAISE ==
   Une espace ordinaire devant `: ; ? !` ou `»` est sécable : la ponctuation
   peut ouvrir une ligne, et « 29 € » peut se couper entre le nombre et le
   symbole. Le texte visible du site doit donc n'employer que des espaces
   insécables à ces endroits (U+00A0 avant `:` et les unités, U+202F fine
   devant `; ? !` et `»`).

   On ne contrôle QUE le texte visible : les métadonnées sont laissées
   telles quelles, les moteurs de recherche remettent en forme. */
{
  const page = await browser.newPage();
  const fautes = [];

  for (const chemin of PAGES_PUBLIQUES) {
    await page.goto(BASE + chemin, { waitUntil: 'domcontentloaded' });
    const trouvees = await page.evaluate(() => {
      const out = [];
      const marcheur = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      // Espace ordinaire, tabulation ou retour à la ligne suivi d'une
      // ponctuation haute ou d'une unité : c'est exactement ce qu'il ne faut
      // pas. Les insécables U+00A0 et U+202F ne font pas partie de la classe.
      const motif = /[ \t\n\r]([:;?!»€])/;
      for (let n = marcheur.nextNode(); n; n = marcheur.nextNode()) {
        if (n.parentElement?.closest('script, style')) continue;
        const t = n.textContent ?? '';
        const m = motif.exec(t);
        if (m) out.push(t.trim().replace(/\s+/g, ' ').slice(0, 60));
      }
      return out;
    });
    for (const t of trouvees) fautes.push(chemin + ' — « ' + t + ' »');
  }

  check(
    'Espaces insécables devant la ponctuation haute et les unités',
    fautes.length === 0,
    fautes.slice(0, 3).join(' | '),
  );

  await page.close();
}

await browser.close();

/* ==================================================== RÉSULTATS ==== */
const echecs = results.filter((r) => !r.ok);
console.log(`\n${results.length} tests — ${results.length - echecs.length} réussis, ${echecs.length} échoués\n`);
for (const r of results) {
  console.log(`  ${r.ok ? 'OK  ' : 'ÉCHEC'} ${r.name}${r.detail ? '  → ' + r.detail : ''}`);
}
process.exitCode = echecs.length > 0 ? 1 : 0;
