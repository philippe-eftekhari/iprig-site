/**
 * ============================================================================
 *  FORMULAIRES — comportement côté navigateur
 * ============================================================================
 *      node scripts/qa-forms.mjs [baseUrl]
 *
 *  ⚠ PÉRIMÈTRE. Ce script teste le CLIENT : validation, pot de miel,
 *  protection contre le double envoi, gestion des réponses, accessibilité de
 *  la zone d'état. Les réponses du serveur sont SIMULÉES (`page.route`), car
 *  `astro preview` ne sait pas exécuter PHP.
 *
 *  Les points d'entrée PHP (`public/api/*.php`) ne sont donc PAS couverts ici.
 *  Ils doivent être testés une fois sur l'hébergement, selon la procédure de
 *  `V4_HANDOFF.md`. Ne pas déclarer les formulaires « validés » sur la seule
 *  foi de ce script.
 * ============================================================================
 */
import { chromium } from 'playwright-core';

const BASE = process.argv[2] ?? 'http://localhost:4321';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const results = [];
const check = (name, ok, detail = '') =>
  results.push({ name, ok, detail: ok ? '' : String(detail) });


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

/**
 * Simule le point d'entrée PHP. `reponse` décrit ce que le serveur renvoie ;
 * `recues` collecte les soumissions pour les inspecter ensuite.
 */
/**
 * Lit un corps `multipart/form-data`.
 *
 * `fetch` avec un `FormData` envoie du multipart, pas de l'URL-encodé : on ne
 * peut donc pas chercher « email=... » dans la chaîne brute. Cette fonction
 * rend un objet { champ: [valeurs] } — un tableau, parce qu'une sélection
 * multiple envoie plusieurs fois le même nom.
 */
const champsDe = (corps) => {
  const out = {};
  for (const bloc of corps.split(/-{2,}[A-Za-z0-9]+/)) {
    const m = /name="([^"]+)"\r?\n\r?\n([\s\S]*?)\r?\n?$/.exec(bloc.trim() ? bloc : '');
    if (!m) continue;
    (out[m[1]] ??= []).push(m[2]);
  }
  return out;
};

const simuler = async (page, motif, reponse, recues) => {
  await page.route(motif, async (route) => {
    const req = route.request();
    recues.push(req.postData() ?? '');
    if (reponse.reseau) return route.abort('failed');
    await route.fulfill({
      status: reponse.status,
      contentType: reponse.html ? 'text/html' : 'application/json',
      body: reponse.html ?? JSON.stringify(reponse.body),
    });
  });
};

/* ======================================================= 1. STRUCTURE === */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const [chemin, id, action] of [
    ['/contact', 'contact', '/api/contact.php'],
    ['/certificats', 'preinscription-form', '/api/preinscription.php'],
  ]) {
    await page.goto(BASE + chemin, { waitUntil: 'networkidle' });

    const info = await page.evaluate((formId) => {
      const f = document.getElementById(formId);
      if (!f) return null;
      const piege = f.querySelector('input[name="website"]');
      /* On mesure le CONTENEUR, pas le champ : c'est lui qui est réduit à
         1 × 1 et découpé au `clip-path`. Le champ garde sa boîte de mise en
         page naturelle à l'intérieur, tout en étant invisible à l'écran. */
      const r = piege?.closest('.form__trap')?.getBoundingClientRect();
      const labels = [...f.querySelectorAll('input:not([type=hidden]), textarea')]
        .filter((el) => el.name !== 'website')
        .map((el) => ({
          name: el.name,
          etiquete:
            !!document.querySelector(`label[for="${el.id}"]`) ||
            !!el.closest('label'),
        }));
      const statut = f.querySelector('.form__status');
      return {
        method: f.getAttribute('method'),
        action: f.getAttribute('action'),
        piegeExiste: !!piege,
        piegeInvisible: !!r && (r.width <= 1 || r.height <= 1),
        piegeMasqueAuxLecteurs: !!piege?.closest('[aria-hidden="true"]'),
        piegeHorsTabulation: piege?.getAttribute('tabindex') === '-1',
        champsSansEtiquette: labels.filter((l) => !l.etiquete).map((l) => l.name),
        statutLive: statut?.getAttribute('aria-live'),
        statutRole: statut?.getAttribute('role'),
        statutVide: (statut?.textContent ?? '').trim() === '',
        horodatage: f.querySelector('[data-timestamp]')?.value ?? '',
      };
    }, id);

    check(`${chemin} — formulaire présent`, info !== null);
    if (!info) continue;

    check(`${chemin} — méthode POST`, info.method === 'post', info.method);
    check(`${chemin} — action ${action}`, info.action === action, info.action);
    check(`${chemin} — pot de miel présent`, info.piegeExiste);
    check(`${chemin} — pot de miel invisible`, info.piegeInvisible);
    check(`${chemin} — pot de miel masqué aux lecteurs d’écran`, info.piegeMasqueAuxLecteurs);
    check(`${chemin} — pot de miel hors tabulation`, info.piegeHorsTabulation);
    check(
      `${chemin} — tous les champs sont étiquetés`,
      info.champsSansEtiquette.length === 0,
      info.champsSansEtiquette.join(', '),
    );
    check(`${chemin} — zone d’état aria-live`, info.statutLive === 'polite');
    check(`${chemin} — zone d’état role=status`, info.statutRole === 'status');
    check(
      `${chemin} — zone d’état vide au chargement`,
      info.statutVide,
      'une région live déjà remplie n’annonce pas son changement',
    );
    check(
      `${chemin} — horodatage posé au chargement`,
      /^\d{10}$/.test(info.horodatage),
      info.horodatage,
    );
  }

  await page.close();
}

/* ====================================== 2. VALIDATION CÔTÉ CLIENT ====== */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const recues = [];
  await simuler(page, '**/api/contact.php', { status: 200, body: { ok: true } }, recues);

  await page.goto(BASE + '/contact', { waitUntil: 'networkidle' });

  /* a) tout vide → rien ne part */
  await page.click('#contact [data-submit]');
  await page.waitForTimeout(250);
  check('Contact — champs vides : aucun envoi', recues.length === 0, recues.length);

  /* b) e-mail invalide → rien ne part */
  await page.fill('#contact-email', 'pas-une-adresse');
  await page.fill('#contact-objet', 'Essai');
  await page.fill('#contact-message', 'Un message assez long pour passer.');
  await page.click('#contact [data-submit]');
  await page.waitForTimeout(250);
  check('Contact — e-mail invalide : aucun envoi', recues.length === 0, recues.length);

  /* c) message trop court → rien ne part (minlength) */
  await page.fill('#contact-email', 'essai@exemple.fr');
  await page.fill('#contact-message', 'court');
  await page.click('#contact [data-submit]');
  await page.waitForTimeout(250);
  check('Contact — message trop court : aucun envoi', recues.length === 0, recues.length);

  /* d) objet vide → rien ne part */
  await page.fill('#contact-message', 'Un message assez long pour passer.');
  await page.fill('#contact-objet', '');
  await page.click('#contact [data-submit]');
  await page.waitForTimeout(250);
  check('Contact — objet vide : aucun envoi', recues.length === 0, recues.length);

  /* e) charge utile valide → un envoi, et un seul */
  await page.fill('#contact-objet', 'Une question sur le programme');
  await page.click('#contact [data-submit]');
  await page.waitForTimeout(400);
  check('Contact — charge utile valide : envoi effectué', recues.length === 1, recues.length);

  const envoye = champsDe(recues[0] ?? '');
  check(
    'Contact — l’e-mail est transmis',
    envoye.email?.[0] === 'essai@exemple.fr',
    JSON.stringify(envoye.email),
  );
  check(
    'Contact — l’objet est transmis',
    envoye.objet?.[0] === 'Une question sur le programme',
    JSON.stringify(envoye.objet),
  );
  check(
    'Contact — le pot de miel part vide',
    envoye.website?.[0] === '',
    JSON.stringify(envoye.website),
  );
  check(
    'Contact — l’horodatage est transmis',
    /^\d{10}$/.test(envoye._t?.[0] ?? ''),
    JSON.stringify(envoye._t),
  );

  /* f) succès : message affiché, formulaire masqué, focus déplacé */
  const apres = await page.evaluate(() => {
    const s = document.querySelector('#contact .form__status');
    return {
      texte: s?.textContent?.trim() ?? '',
      classe: s?.className ?? '',
      focus: document.activeElement === s,
      champsMasques:
        getComputedStyle(document.querySelector('#contact .form__fields')).display ===
        'none',
    };
  });
  check(
    'Contact — message de succès affiché',
    apres.texte === 'Votre message a bien été envoyé.',
    apres.texte,
  );
  check('Contact — état visuel « succès »', apres.classe.includes('form__status--ok'));
  check('Contact — le focus va sur le message', apres.focus);
  check('Contact — le formulaire est masqué après envoi', apres.champsMasques);

  /* g) double envoi impossible : le bouton a disparu avec le formulaire */
  await page.evaluate(() => {
    document.querySelector('#contact [data-submit]')?.click();
  });
  await page.waitForTimeout(250);
  check('Contact — pas de second envoi après succès', recues.length === 1, recues.length);

  await page.close();
}

/* ============================================ 3. ERREURS SERVEUR ======= */
{
  /* a) 500 avec message : le message du serveur est affiché tel quel */
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const recues = [];
  await simuler(
    page,
    '**/api/contact.php',
    { status: 500, body: { ok: false, message: 'L’envoi a échoué. Merci de réessayer dans un instant.' } },
    recues,
  );
  await page.goto(BASE + '/contact', { waitUntil: 'networkidle' });
  await page.fill('#contact-email', 'essai@exemple.fr');
  await page.fill('#contact-objet', 'Essai');
  await page.fill('#contact-message', 'Un message assez long pour passer.');
  await page.click('#contact [data-submit]');
  await page.waitForTimeout(400);

  const etat = await page.evaluate(() => {
    const s = document.querySelector('#contact .form__status');
    const b = document.querySelector('#contact [data-submit]');
    return {
      texte: s?.textContent?.trim() ?? '',
      erreur: (s?.className ?? '').includes('form__status--error'),
      boutonRendu: b instanceof HTMLButtonElement ? !b.disabled : false,
      libelle: document.querySelector('#contact [data-submit-label]')?.textContent ?? '',
      champsVisibles:
        getComputedStyle(document.querySelector('#contact .form__fields')).display !==
        'none',
    };
  });
  check('Contact — erreur serveur : message affiché', etat.texte.length > 0, etat.texte);
  check('Contact — erreur serveur : état visuel « erreur »', etat.erreur);
  check('Contact — erreur serveur : le bouton redevient actif', etat.boutonRendu);
  check('Contact — erreur serveur : libellé restauré', etat.libelle === 'Envoyer', etat.libelle);
  check('Contact — erreur serveur : le formulaire reste utilisable', etat.champsVisibles);

  /* b) réponse non-JSON (PHP absent, page d'erreur de l'hébergeur) */
  await page.unroute('**/api/contact.php');
  await simuler(page, '**/api/contact.php', { status: 404, html: '<h1>404</h1>' }, recues);
  await page.click('#contact [data-submit]');
  await page.waitForTimeout(400);
  const nonJson = await page.evaluate(
    () => document.querySelector('#contact .form__status')?.textContent?.trim() ?? '',
  );
  check('Contact — réponse non-JSON : message d’erreur honnête', nonJson.length > 0, nonJson);

  /* c) réseau coupé */
  await page.unroute('**/api/contact.php');
  await simuler(page, '**/api/contact.php', { reseau: true }, recues);
  await page.click('#contact [data-submit]');
  await page.waitForTimeout(500);
  const coupe = await page.evaluate(
    () => document.querySelector('#contact .form__status')?.textContent?.trim() ?? '',
  );
  check('Contact — réseau coupé : message d’erreur affiché', coupe.includes('échoué'), coupe);

  await page.close();
}

/* ======================================== 4. PRÉINSCRIPTION ============ */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const recues = [];
  await simuler(
    page,
    '**/api/preinscription.php',
    { status: 200, body: { ok: true } },
    recues,
  );
  await page.goto(BASE + '/certificats', { waitUntil: 'networkidle' });

  const cases = await page.$$('#preinscription-form input[name="certificats[]"]');
  check('Préinscription — cases à cocher présentes', cases.length === 11, cases.length);

  /* a) nom vide */
  await page.click('#preinscription-form [data-submit]');
  await page.waitForTimeout(250);
  check('Préinscription — nom vide : aucun envoi', recues.length === 0, recues.length);

  /* b) nom + e-mail valides, aucun certificat coché */
  await page.fill('#preinscription-form-nom', 'Prénom Nom');
  await page.fill('#preinscription-form-email', 'essai@exemple.fr');
  await page.click('#preinscription-form [data-submit]');
  await page.waitForTimeout(300);
  const sansCertificat = await page.evaluate(() => {
    const s = document.querySelector('#preinscription-form .form__status');
    return {
      texte: s?.textContent?.trim() ?? '',
      focusSurCase:
        document.activeElement?.getAttribute('name') === 'certificats[]',
    };
  });
  check('Préinscription — aucun certificat : aucun envoi', recues.length === 0, recues.length);
  check(
    'Préinscription — aucun certificat : message explicite',
    sansCertificat.texte.includes('au moins un certificat'),
    sansCertificat.texte,
  );
  check(
    'Préinscription — aucun certificat : focus sur la première case',
    sansCertificat.focusSurCase,
  );

  /* c) e-mail invalide */
  await page.check('#preinscription-form-geopolitique-iran');
  await page.fill('#preinscription-form-email', 'pas-une-adresse');
  await page.click('#preinscription-form [data-submit]');
  await page.waitForTimeout(250);
  check('Préinscription — e-mail invalide : aucun envoi', recues.length === 0, recues.length);

  /* d) un seul certificat */
  await page.fill('#preinscription-form-email', 'essai@exemple.fr');
  await page.click('#preinscription-form [data-submit]');
  await page.waitForTimeout(400);
  check('Préinscription — un certificat : envoi effectué', recues.length === 1, recues.length);
  const un = champsDe(recues[0] ?? '');
  check(
    'Préinscription — le certificat coché est transmis',
    JSON.stringify(un['certificats[]']) === JSON.stringify(['geopolitique-iran']),
    JSON.stringify(un['certificats[]']),
  );
  check(
    'Préinscription — le nom est transmis',
    un.nom?.[0] === 'Prénom Nom',
    JSON.stringify(un.nom),
  );
  check(
    'Préinscription — message de succès sans le mot « confirmée »',
    await page.evaluate(() => {
      const t =
        document.querySelector('#preinscription-form .form__status')?.textContent ?? '';
      return t.includes('demande de préinscription a bien été envoyée') && !/confirm/i.test(t);
    }),
  );

  /* e) plusieurs certificats, sur une page rechargée */
  await page.goto(BASE + '/certificats', { waitUntil: 'networkidle' });
  recues.length = 0;
  await page.fill('#preinscription-form-nom', 'Prénom Nom');
  await page.fill('#preinscription-form-email', 'essai@exemple.fr');
  await page.check('#preinscription-form-geopolitique-iran');
  await page.check('#preinscription-form-geopolitique-turquie');
  await page.check('#preinscription-form-finance-islamique');
  await page.fill('#preinscription-form-message', 'Message facultatif rempli.');
  await page.click('#preinscription-form [data-submit]');
  await page.waitForTimeout(400);
  check('Préinscription — plusieurs certificats : envoi effectué', recues.length === 1);
  const trois = champsDe(recues[0] ?? '');
  const choisis = trois['certificats[]'] ?? [];
  check(
    'Préinscription — les trois certificats sont transmis',
    choisis.length === 3,
    JSON.stringify(choisis),
  );
  check(
    'Préinscription — ce sont bien les trois cochés',
    ['geopolitique-iran', 'finance-islamique', 'geopolitique-turquie'].every((id) =>
      choisis.includes(id),
    ),
    JSON.stringify(choisis),
  );
  check(
    'Préinscription — le message facultatif est transmis',
    trois.message?.[0] === 'Message facultatif rempli.',
    JSON.stringify(trois.message),
  );

  await page.close();
}

/* ============================================ 5. SANS JAVASCRIPT ======= */
{
  const contexte = await browser.newContext({ javaScriptEnabled: false });
  const page = await contexte.newPage();

  for (const [chemin, id, action] of [
    ['/contact', 'contact', '/api/contact.php'],
    ['/certificats', 'preinscription-form', '/api/preinscription.php'],
  ]) {
    await page.goto(BASE + chemin, { waitUntil: 'domcontentloaded' });
    const f = await page.evaluate((formId) => {
      const el = document.getElementById(formId);
      return el
        ? {
            action: el.getAttribute('action'),
            method: el.getAttribute('method'),
            champs: [...el.querySelectorAll('[name]')].map((e) => e.getAttribute('name')),
          }
        : null;
    }, id);
    check(`${chemin} — sans JS : le formulaire reste un vrai <form>`, f !== null);
    check(`${chemin} — sans JS : action serveur`, f?.action === action, f?.action);
    check(`${chemin} — sans JS : méthode POST`, f?.method === 'post');
    check(
      `${chemin} — sans JS : l’horodatage part vide (contrôle serveur ignoré)`,
      await page.evaluate(
        (formId) =>
          document.querySelector(`#${formId} [data-timestamp]`)?.value === '',
        id,
      ),
    );
  }
  await contexte.close();
}

await browser.close();

/* ==================================================== RÉSULTATS ======= */
const echecs = results.filter((r) => !r.ok);
for (const r of results) {
  console.log(`  ${r.ok ? 'OK  ' : 'ÉCHEC'} ${r.name}${r.detail ? '  → ' + r.detail : ''}`);
}
console.log(
  `\n${results.length} contrôles — ${results.length - echecs.length} réussis, ${echecs.length} échoués`,
);
console.log(
  'Rappel : les points d’entrée PHP ne sont PAS couverts ici. Voir V4_HANDOFF.md.',
);
process.exit(echecs.length === 0 ? 0 : 1);
