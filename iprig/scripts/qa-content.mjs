/**
 * ============================================================================
 *  COHÉRENCE DE CONTENU — contrôle du site construit
 * ============================================================================
 *      node scripts/qa-content.mjs [baseUrl]
 *
 *  Ce script ne juge pas la mise en page : il vérifie que le TEXTE publié dit
 *  la même chose partout, et qu'aucune formulation retirée en V4 n'est
 *  revenue par une porte dérobée.
 *
 *  Trois familles de contrôles :
 *
 *   1. FORMULATIONS PROSCRITES — chiffres jamais vérifiés, anciennes
 *      formulations, numérotation « 01 », marque écrite en deux mots.
 *      Un site institutionnel qui réaffiche « ≈ 75 000 abonnés » deux versions
 *      après l'avoir retiré perd exactement ce qu'il essayait de gagner.
 *
 *   2. SOURCE UNIQUE — les blocs présents sur deux pages (quatre volets,
 *      quatre séances) doivent y être identiques au caractère près. C'est ce
 *      qui garantit que `src/data/` est bien la seule source.
 *
 *   3. FUITE D'ADRESSE — aucune adresse e-mail ne doit apparaître dans le
 *      HTML, le JavaScript ou le JSON servis. La destination des formulaires
 *      vit côté serveur ; si elle réapparaît ici, elle sera récoltée.
 * ============================================================================
 */
import { chromium } from 'playwright-core';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, extname } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] ?? 'http://localhost:4321';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const results = [];
const check = (name, ok, detail = '') =>
  results.push({ name, ok, detail: ok ? '' : String(detail) });

const PAGES = [
  '/',
  '/programme',
  '/certificats',
  '/kevan-gafaiti',
  '/contact',
  '/mentions-legales',
  '/politique-confidentialite',
];


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
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

/** Texte visible d'une page, espaces normalisés. */
const texteDe = async (chemin) => {
  await page.goto(BASE + chemin, { waitUntil: 'networkidle' });
  /* ⚠ On normalise UNIQUEMENT les blancs ASCII. `\s` en JavaScript englobe
     U+00A0 et U+202F : normaliser avec `\s` effacerait précisément les
     espaces insécables que d'autres contrôles cherchent à vérifier. */
  return page.evaluate(() =>
    (document.body.innerText || '')
      .replace(new RegExp("[ \\t\\n\\r\\f\\v]+", "g"), " ")
      .trim(),
  );
};

const textes = {};
for (const p of PAGES) textes[p] = await texteDe(p);
const tout = Object.entries(textes);

/* ==================================== 1. FORMULATIONS PROSCRITES ======= */
{
  /**
   * Chaque entrée : [ce qu'on cherche, pourquoi c'est proscrit].
   * Une expression régulière permet de viser la faute sans attraper les
   * formulations légitimes voisines.
   */
  const INTERDITS = [
    [/Kevan Explique/, 'la marque s’écrit « KevanExplique », en un seul mot'],
    [/75\u00a0?000|75 000/, 'nombre d’abonnés jamais vérifié — retiré en V4'],
    [/stratégies? d’influence/, 'remplacé par « politique étrangère »'],
    [/relations étrangères/, 'formulation fautive'],
    [/passionnés de relations/, 'le hero parle des jeunes professionnels'],
    [/Les événements sont-ils toujours garantis/, 'question retirée de la FAQ'],
    [
      /Institut des Relations Internationales et de Géopolitiques/,
      '« Géopolitique » reste au singulier',
    ],
    [/plusieurs centaines d’étudiants/i, 'repère chiffré non vérifié'],
    [/≈\s*40 séances|≈\s*50 événements/, 'repères chiffrés non vérifiés'],
    /* V4.2 — Kevan Gafaïti a soutenu sa thèse : il est DOCTEUR. Le décrire
       encore comme doctorant serait faux, pas seulement démodé. Le motif ne
       vise que le masculin singulier au présent : il n'attrape ni « docteur »,
       ni la mention d'un autre enseignant en cours de thèse. */
    [/\bDoctorants?\b/i, 'V4.2 : Kevan Gafaïti est docteur, plus doctorant'],
    /* Ancien titre abrégé de la thèse, remplacé par le titre complet. */
    [/politique étrangère de l’Iran \(1995-2022\)/,
     'V4.2 : le titre complet de la thèse a remplacé la forme abrégée'],
  ];

  for (const [motif, raison] of INTERDITS) {
    const trouve = tout.filter(([, t]) => motif.test(t)).map(([p]) => p);
    check(
      `Absent du site : ${motif.source.slice(0, 44)}`,
      trouve.length === 0,
      `${trouve.join(', ')} — ${raison}`,
    );
  }

  /* Numérotation éditoriale : « 1 » et non « 01 ». On ne cherche un « 01 »
     que là où il est isolé, pour ne pas attraper une date ou un tarif. */
  const zeros = tout.filter(([, t]) => /(^|\s)0[1-9](\s|$)/.test(t)).map(([p]) => p);
  check('Aucune numérotation « 01 » visible', zeros.length === 0, zeros.join(', '));
}

/* ==================================== 2. SOURCE UNIQUE ================= */
{
  const accueil = textes['/'];
  const programme = textes['/programme'];
  const certificats = textes['/certificats'];

  /* Les quatre volets, dans l'ordre validé. */
  const VOLETS = ['Événements', 'Immersion', 'Sessions', 'Rediffusion'];
  const ordreDe = (t) =>
    VOLETS.map((v) => t.indexOf(v)).every((i, k, a) => i >= 0 && (k === 0 || i > a[k - 1]));
  check('Accueil : quatre volets dans le bon ordre', ordreDe(accueil));
  check('Programme : quatre volets dans le bon ordre', ordreDe(programme));

  /* ------------------------------------------------------------------ *
   *  LE PROGRAMME 2026-2027 — quinze séances, deux semestres            *
   * ------------------------------------------------------------------ *
   *  Il a remplacé en V4.3 les quatre séances d'exemple de la V2. Les
   *  contrôles portent sur la STRUCTURE — combien de séances, dans quel
   *  semestre, avec quelle date — autant que sur les intitulés : un
   *  programme qui perd une séance en cours de route ne se voit pas à
   *  l'œil nu.
   *
   *  ⚠ Les dates du second semestre ne sont pas arrêtées. Le jour où le
   *  client les communiquera, le contrôle « Date à venir » devra être
   *  ajusté — jamais supprimé pour obtenir un PASS.
   * ------------------------------------------------------------------ */
  await page.goto(BASE + '/programme', { waitUntil: 'networkidle' });

  const seances = await page.$$eval('.session', (els) =>
    els.map((e) => ({
      num: e.querySelector('.session__num')?.textContent?.trim() ?? '',
      date: e.querySelector('.session__date')?.textContent?.trim() ?? '',
      titre: e.querySelector('.session__title')?.textContent?.trim() ?? '',
    })),
  );
  const blocsSemestre = await page.$$eval('.semestre', (els) =>
    els
      .filter((e) => e.querySelector('.semestre__title'))
      .map((e) => ({
        label: e.querySelector('.semestre__title').textContent.trim(),
        meta: e.querySelector('.semestre__meta')?.textContent?.trim() ?? '',
        seances: e.querySelectorAll('.session').length,
      })),
  );

  check('Programme : 15 séances', seances.length === 15, seances.length);
  check(
    'Programme : deux semestres, 6 puis 9 séances',
    blocsSemestre.length === 2 &&
      blocsSemestre[0].label === 'Semestre 1' &&
      blocsSemestre[0].seances === 6 &&
      blocsSemestre[1].label === 'Semestre 2' &&
      blocsSemestre[1].seances === 9,
    JSON.stringify(blocsSemestre),
  );
  /* Le compteur annoncé est déduit de la liste : s'il s'en écarte, c'est
     qu'il a été écrit en dur quelque part. */
  check(
    'Programme : les compteurs annoncés suivent les séances',
    blocsSemestre.every((s) => s.meta === `${s.seances} séances`),
    blocsSemestre.map((s) => s.meta).join(' | '),
  );
  check(
    'Programme : numérotation continue de 1 à 15',
    seances.length === 15 && seances.every((s, i) => s.num === String(i + 1)),
    seances.map((s) => s.num).join(','),
  );

  /* Les six dates du premier semestre, au caractère près. Elles ont été
     vérifiées : ce sont bien six dimanches. */
  const S1_DATES = [
    'Dimanche 11 octobre 2026',
    'Dimanche 25 octobre 2026',
    'Dimanche 8 novembre 2026',
    'Dimanche 22 novembre 2026',
    'Dimanche 6 décembre 2026',
    'Dimanche 20 décembre 2026',
  ];
  check(
    'Programme : les six dates du premier semestre',
    S1_DATES.every((d, i) => seances[i]?.date === d),
    seances
      .slice(0, 6)
      .map((s) => s.date)
      .join(' | '),
  );

  /* Les neuf du second : une seule formulation, et pas une variante. */
  const enAttente = seances.slice(6).map((s) => s.date);
  check(
    'Programme : les neuf séances du second semestre affichent « Date à venir »',
    enAttente.length === 9 && enAttente.every((d) => d === 'Date à venir'),
    enAttente.join(' | '),
  );
  check(
    'Programme : aucune autre formulation d’attente',
    !/À définir|Prochainement|\bTBC\b|Bientôt|Date non communiquée/i.test(programme),
  );

  /* Les quinze intitulés, tels que communiqués par le client, dans l'ordre. */
  const INTITULES = [
    'Réussir son année universitaire',
    'Maîtriser les exercices universitaires',
    'Construire son parcours géopolitique',
    'Cartographier les métiers en relations internationales',
    'Préparer et réussir ses examens',
    'Session Bilan et échanges',
    'Développer sa culture générale internationale',
    'Se préparer aux concours de la haute fonction publique',
    'Préparer son CV et sa lettre de motivation',
    'Réussir ses candidatures universitaires et ses admissions',
    'Construire son projet professionnel',
    'Trouver un stage ou un poste en relations internationales',
    'Réussir son entretien d’embauche et ses expériences professionnelles',
    'Construire et développer son réseau professionnel',
    'Session Bilan et échanges',
  ];
  check(
    'Programme : les quinze intitulés exacts, dans l’ordre',
    INTITULES.every((t, i) => seances[i]?.titre === t),
    seances
      .map((s, i) => (s.titre === INTITULES[i] ? '' : `${i + 1} : ${s.titre}`))
      .filter(Boolean)
      .join(' | '),
  );

  /* Coquille du brief client, corrigée à l'intégration. Cette garde existe
     pour qu'elle ne soit jamais publiée. */
  check(
    'Programme : la coquille « aux les concours » est absente',
    !/aux les concours/i.test(programme),
  );

  /* L'extrait de la page d'accueil sort de la MÊME source : les quatre
     premières séances, et un décompte du reste qui se calcule. */
  check(
    'Accueil : les quatre premières séances du programme',
    INTITULES.slice(0, 4).every((t) => accueil.includes(t)),
    INTITULES.slice(0, 4)
      .filter((t) => !accueil.includes(t))
      .join(' | '),
  );
  check(
    'Accueil : le lien annonce les onze séances restantes',
    accueil.includes('11 autres séances'),
  );

  /* Les quatre séances d'exemple de la V2 ont disparu : les laisser à côté
     du programme réel afficherait deux calendriers concurrents. */
  const EXEMPLES_V2 = [
    'Méthodologie des exercices universitaires',
    'Comment réussir un entretien d’embauche',
    'Renforcer et valoriser ses centres d’intérêt en relations internationales',
    'Construire son réseau en relations internationales',
  ];
  const restants = EXEMPLES_V2.filter(
    (s) => accueil.includes(s) || programme.includes(s),
  );
  check(
    'Les quatre séances d’exemple de la V2 ont disparu',
    restants.length === 0,
    restants.join(' | '),
  );

  /* Le hero dit bien « étudiants et les jeunes professionnels ». */
  check(
    'Hero : étudiants et jeunes professionnels',
    accueil.includes('les étudiants et les jeunes professionnels'),
  );

  /* ------------------------------------------------------------------ *
   *  SECTION « L'INSTITUT » — trois formulations arrêtées en V4.2        *
   * ------------------------------------------------------------------ *
   *  Elles ont été dictées mot pour mot par le client. Une reformulation
   *  « qui dit la même chose » n'est pas acceptable ici : c'est le texte
   *  exact qu'il a validé.
   * ------------------------------------------------------------------ */
  check(
    'Institut : « un choix, un parcours, un métier »',
    accueil.includes('un choix, un parcours, un métier'),
  );
  check(
    'Institut : l’ancien « une orientation, un parcours » a disparu',
    !accueil.includes('une orientation, un parcours'),
  );
  check(
    'Institut : accompagnement — immersion pratique',
    accueil.includes(
      'des sessions régulières, une immersion pratique dans le champ géopolitique et des opportunités transmises aux membres tout au long de l’année',
    ),
  );
  check(
    'Institut : public — « s’adresse notamment aux étudiants de licence »',
    accueil.includes(
      'L’Institut s’adresse notamment aux étudiants de licence ainsi qu’à celles et ceux qui souhaitent s’orienter vers ces secteurs.',
    ),
  );

  /* ------------------------------------------------------------------ *
   *  LES SEPT AXES — casse arrêtée en V4.2                              *
   * ------------------------------------------------------------------ *
   *  Le premier mot porte la majuscule, et lui seul. La V4.1 capitalisait
   *  le mot clé (« un Réseau », « des Événements ») ; le client a tranché
   *  dans l'autre sens. Les deux listes sont contrôlées : celle qui doit
   *  être là, et celle qui ne doit plus l'être.
   * ------------------------------------------------------------------ */
  const AXES = [
    'Réseau',
    'Des événements',
    'Une immersion',
    'Un accompagnement',
    'Des connaissances',
    'Une méthodologie',
    'Des réflexes',
  ];
  const axesAbsents = AXES.filter((a) => !accueil.includes(a));
  check('Sept axes : la casse V4.2', axesAbsents.length === 0, axesAbsents.join(' | '));

  const AXES_V41 = [
    'un Réseau',
    'des Événements',
    'une Immersion',
    'un Accompagnement',
    'des Connaissances',
    'une Méthodologie',
    'des Réflexes',
  ];
  const axesAnciens = AXES_V41.filter((a) => accueil.includes(a));
  check(
    'Sept axes : plus aucune casse V4.1',
    axesAnciens.length === 0,
    axesAnciens.join(' | '),
  );

  /* ------------------------------------------------------------------ *
   *  KEVAN GAFAÏTI — docteur depuis la V4.2                             *
   * ------------------------------------------------------------------ */
  const kevanPage = textes['/kevan-gafaiti'];
  check(
    'Kevan Gafaïti : « Docteur en sciences politiques et relations internationales »',
    kevanPage.includes('Docteur en sciences politiques et relations internationales'),
  );
  check(
    'Kevan Gafaïti : titre de thèse complet',
    kevanPage.includes(
      'La France face à la politique étrangère de l’Iran, 1995-2022 : rivalité d’influence au Moyen-Orient, programme nucléaire iranien et sécurité dans le golfe Persique',
    ),
  );

  /* Prix mensuel et tarifs des certificats. */
  check('Tarif mensuel 29 € présent', /29\u00a0€/.test(accueil));
  for (const t of ['100', '175', '250', '330']) {
    check(
      `Tarif certificat ${t} € présent`,
      new RegExp(`${t}\u00a0€`).test(certificats),
    );
  }

  /* Dates, validation, absence de paiement. */
  check('Certificats : février – avril 2027', certificats.includes('Février – avril 2027'));
  check('Certificats : examen terminal', certificats.includes('examen terminal'));
  check(
    'Certificats : préinscription uniquement',
    /Aucun paiement n’est effectué sur ce site/.test(certificats) &&
      !/\bAcheter\b|Ajouter au panier|Payer maintenant/.test(certificats),
  );
  check(
    'Certificats : avertissement « ni diplôme ni certification »',
    certificats.includes('ne constituent pas des diplômes'),
  );

  /* Catalogue affiché == catalogue servi au serveur. */
  const json = await (await page.request.get(BASE + '/api/certificats.json')).json();
  const idsJson = json.certificates.map((c) => c.id);
  check('Catalogue JSON : 11 certificats', idsJson.length === 11, idsJson.length);
  const titresManquants = json.certificates
    .filter((c) => !certificats.includes(c.title))
    .map((c) => c.title);
  check(
    'Chaque certificat du JSON est affiché sur la page',
    titresManquants.length === 0,
    titresManquants.join(' | '),
  );

  /* Les cases du formulaire proposent exactement le catalogue. */
  await page.goto(BASE + '/certificats', { waitUntil: 'networkidle' });
  const valeurs = await page.$$eval('input[name="certificats[]"]', (els) =>
    els.map((e) => e.value),
  );
  check(
    'Formulaire : une case par certificat du catalogue',
    valeurs.length === idsJson.length && valeurs.every((v) => idsJson.includes(v)),
    `${valeurs.length} cases / ${idsJson.length} certificats`,
  );

  /* ------------------------------------------------------------------ *
   *  ENSEIGNANTS — graphies arrêtées en V4.1                            *
   * ------------------------------------------------------------------ *
   *  Les quatre noms ci-dessous font foi. Les anciennes graphies
   *  « Alain Kopolani », « Albert Kondemir » et « Balkisu Ayatu » ne
   *  doivent réapparaître ni sur la page, ni dans le JSON servi au PHP.
   *
   *  ⚠ « Keyvan » et « Kevan Gafaïti » sont DEUX PERSONNES DIFFÉRENTES :
   *  aucun contrôle ici ne doit conduire à retirer Kevan Gafaïti.
   * ------------------------------------------------------------------ */
  const ENSEIGNANTS = [
    'Kevan Gafaïti',
    'Albert Kandemir',
    'Valentin Blondiau',
    'Balkissou Hayatou',
    'Alain Coppolani',
  ];
  for (const n of ENSEIGNANTS) {
    check(`Enseignant affiché : ${n}`, certificats.includes(n));
  }

  /* L'ORDRE compte : c'est celui arrêté par le client en V4.2, et le
     formulaire de préinscription le suit. Un enseignant déplacé sans que
     le catalogue suive désaligne les deux sans qu'aucun total ne bouge. */
  const positions = ENSEIGNANTS.map((n) => certificats.indexOf(n));
  check(
    'Enseignants dans l’ordre V4.2 : Kevan, Albert, Valentin, Balkissou, Alain',
    positions.every((i, k) => i >= 0 && (k === 0 || i > positions[k - 1])),
    positions.join(' < '),
  );

  /* `Kopelany` et `Alan` sont des graphies apparues dans un retour client
     intermédiaire de la V4.2. Elles n'ont jamais été publiées ; cette garde
     est là pour qu'elles ne le soient jamais. */
  const OBSOLETES = /Kopolani|Kopelany|Kondemir|Balkisu|Ayatu|\bAlan\b/;
  check('Aucune ancienne graphie sur /certificats', !OBSOLETES.test(certificats));
  check(
    'Aucune ancienne graphie dans /api/certificats.json',
    !OBSOLETES.test(JSON.stringify(json)),
  );

  /* Le JSON servi au PHP porte les cinq enseignants, correctement écrits et
     dans l'ordre du catalogue. */
  const profs = [...new Set(json.certificates.map((c) => c.teacher))];
  check('Catalogue JSON : 5 enseignants', profs.length === 5, profs.join(' | '));
  check(
    'Catalogue JSON : les cinq noms attendus',
    ENSEIGNANTS.every((n) => profs.includes(n)),
    profs.join(' | '),
  );
  check(
    'Catalogue JSON : enseignants dans l’ordre V4.2',
    profs.join(' | ') === ENSEIGNANTS.join(' | '),
    profs.join(' | '),
  );

  /* V4.2 — Valentin Blondiau et son unique certificat. */
  const certifsValentin = json.certificates
    .filter((c) => c.teacher === 'Valentin Blondiau')
    .map((c) => c.title);
  check(
    'Valentin Blondiau : un certificat, « Introduction à la Communication de crise »',
    certifsValentin.length === 1 &&
      certifsValentin[0] === 'Introduction à la Communication de crise',
    certifsValentin.join(' | '),
  );
  /* La biographie du 02/09/2026 ne cite plus le titre de thèse : le client
     l'a retiré volontairement. On contrôle donc la formulation retenue, et
     l'absence de l'ancienne — une biographie qui traîne est un contenu faux. */
  check(
    'Valentin Blondiau : biographie du 02/09/2026',
    certificats.includes(
      'Valentin Blondiau a travaillé pendant cinq ans dans la communication des organisations',
    ) && certificats.includes('le rôle des dirigeant·es économiques'),
  );
  check(
    'Valentin Blondiau : l’ancienne biographie a disparu',
    !certificats.includes('renouvellement de la figuration des dirigeant'),
  );

  /* Kevan Gafaïti reste enseignant, avec ses deux certificats. */
  const certifsKevan = json.certificates
    .filter((c) => c.teacher === 'Kevan Gafaïti')
    .map((c) => c.title);
  check(
    'Kevan Gafaïti : ses deux certificats sont au catalogue',
    certifsKevan.length === 2 &&
      certifsKevan.some((t) => t.includes('de l’Iran')) &&
      certifsKevan.some((t) => t.includes('du golfe Persique')),
    certifsKevan.join(' | '),
  );

  /* Chaque vignette d'enseignant porte une photographie ou des initiales,
     jamais une image cassée. */
  const vignettes = await page.$$eval('.teacher', (cards) =>
    cards.map((c) => ({
      nom: c.querySelector('.teacher__name')?.textContent?.trim() ?? '?',
      img: !!c.querySelector('img'),
      alt: c.querySelector('img')?.getAttribute('alt') ?? '',
      bio: (c.querySelector('.teacher__bio')?.textContent ?? '').trim().length,
      initiales: !!c.querySelector('.teacher__initials'),
    })),
  );
  check('Page /certificats : 5 vignettes d’enseignant', vignettes.length === 5, vignettes.length);
  check(
    'Chaque vignette d’enseignant a une photo ou des initiales',
    vignettes.length > 0 && vignettes.every((v) => v.img || v.initiales),
    JSON.stringify(vignettes),
  );

  /* Depuis la V4.2 : les CINQ enseignants ont un portrait réel ET une
     biographie. Le repli typographique de `TeacherCard` reste en place pour
     un enseignant qui arriverait sans portrait, mais il ne sert plus. */
  check(
    'Les cinq enseignants ont une photographie réelle',
    vignettes.every((v) => v.img),
    JSON.stringify(vignettes.filter((v) => !v.img)),
  );
  check(
    'Les cinq enseignants ont une biographie',
    vignettes.every((v) => v.bio > 0),
    JSON.stringify(vignettes.map((v) => [v.nom, v.bio])),
  );
  check(
    'Aucun ancien nom dans les alt des portraits',
    vignettes.every((v) => !OBSOLETES.test(v.alt)),
    vignettes.map((v) => v.alt).join(' | '),
  );

  /* Équilibre des vignettes : aucune biographie ne doit peser plusieurs fois
     celle des autres — c'est le défaut corrigé en V4.1 sur Balkissou Hayatou,
     dont la version longue faisait 487 signes contre 159 à Kevan Gafaïti.

     Le seuil est calibré sur des mesures, pas choisi pour passer au vert :

       V4.0  159 / 0 / 487 / 0       → rapport 3,06  (échoue, c'est voulu)
       V4.1  159 / 333 / 321 / 277   → rapport 2,09  (passe)
       V4.2  159 / 277 / 395 / 321 / 333 → rapport 2,48  (passe)

     V4.2 : le seuil passe de 2,5 à 2,8. La biographie de Valentin Blondiau
     est la plus longue du lot (395 signes) parce qu'elle cite in extenso un
     titre de thèse de 143 signes — fourni par le client, à ne pas abréger.
     Elle tenait de justesse sous 2,5 ; un seuil qu'un seul caractère fait
     basculer ne contrôle plus rien, il fait du bruit. 2,8 laisse la variation
     de hauteur que le client accepte explicitement, tout en rattrapant encore
     la dérive de la V4.0 (3,06). Ne pas le relever davantage sans mesure. */
  const bios = vignettes.map((v) => v.bio).filter(Boolean);
  const rapport = Math.max(...bios) / Math.min(...bios);
  check(
    'Biographies d’enseignants de longueurs comparables',
    bios.length > 0 && rapport <= 2.8,
    `min ${Math.min(...bios)} / max ${Math.max(...bios)} signes — rapport ${rapport.toFixed(2)}`,
  );
  check(
    'Balkissou Hayatou : « docteure » au féminin',
    /Balkissou Hayatou est docteure/.test(certificats),
  );

  /* FAQ : les huit questions validées. */
  const QUESTIONS = [
    'À qui s’adresse l’IPRIG',
    'Combien coûte l’IPRIG',
    'Y a-t-il un engagement',
    'Comment rejoindre l’IPRIG',
    'Où sont disponibles les contenus',
    'Comment suis-je informé des événements',
    'Des événements sont-ils proposés chaque semaine',
    'L’IPRIG délivre-t-il un diplôme ou une certification',
  ];
  const manquantes = QUESTIONS.filter((q) => !accueil.includes(q));
  check('FAQ : les huit questions validées', manquantes.length === 0, manquantes.join(' | '));

  /* ------------------------------------------------------------------ *
   *  LIENS SOCIAUX — les SEPT plateformes depuis la V4.1                *
   * ------------------------------------------------------------------ *
   *  Apple Podcasts a rejoint les six autres le 01/09/2026. Plus aucune
   *  plateforme n'est « en attente » : la mention « lien à venir » ne
   *  doit plus apparaître nulle part, et aucun `href="#"` non plus.
   * ------------------------------------------------------------------ */
  const PLATEFORMES = [
    'instagram.com/kevanexplique',
    'youtube.com/channel/UCPwkkIM9F2RaG37pobWw9Wg',
    'tiktok.com/@kevanexplique',
    'twitch.tv/kevanexplique',
    'linkedin.com/in/kevan-gafa',
    'open.spotify.com/show/0346qxV2YP22NpjPkdXclj',
    'podcasts.apple.com/podcast/id6801282142',
  ];

  for (const url of ['/kevan-gafaiti', '/contact']) {
    await page.goto(BASE + url, { waitUntil: 'networkidle' });
    const hrefs = await page.$$eval('.socials__link', (els) =>
      els.map((e) => e.getAttribute('href') ?? ''),
    );
    /* Ces pages portent DEUX blocs sociaux : celui de la page et celui du
       pied de page. Le compte attendu est donc un multiple de sept, pas
       sept — chaque bloc doit être complet. */
    const absentes = PLATEFORMES.filter((p) => !hrefs.some((h) => h.includes(p)));
    check(
      `${url} : les sept plateformes sont des liens réels`,
      hrefs.length > 0 && hrefs.length % 7 === 0 && absentes.length === 0,
      `${hrefs.length} liens — manquantes : ${absentes.join(', ') || 'aucune'}`,
    );
    check(
      `${url} : aucun href="#"`,
      hrefs.every((h) => h !== '#' && h !== ''),
      hrefs.join(' | '),
    );

    const texte = await page.evaluate(() => document.body.innerText);
    check(`${url} : plus aucune mention « lien à venir »`, !texte.includes('lien à venir'));
    check(
      `${url} : Apple Podcasts nommé`,
      (await page.$$eval('.socials__link', (els) => els.map((e) => e.textContent ?? ''))).some(
        (t) => t.includes('Apple Podcasts'),
      ),
    );
  }

  /* Le pied de page porte lui aussi la liste complète. */
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const piedHrefs = await page.$$eval('.footer .socials__link', (els) =>
    els.map((e) => e.getAttribute('href') ?? ''),
  );
  check(
    'Pied de page : les sept plateformes',
    piedHrefs.length === 7 &&
      piedHrefs.some((h) => h.includes('podcasts.apple.com/podcast/id6801282142')),
    piedHrefs.join(' | '),
  );
}

/* ==================================== 3. FUITE D'ADRESSE ============== */
{
  /* Contrôle sur le SITE SERVI, et pas seulement sur les sources : une
     adresse peut apparaître dans un fichier généré. */
  const dist = resolve(here, '../dist');
  const EXT = new Set(['.html', '.js', '.json', '.css', '.xml', '.txt', '.svg']);
  const ADRESSE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
  /* Les adresses de démonstration des champs de saisie sont volontaires :
     ce sont des exemples, pas des boîtes réelles. */
  const AUTORISEES = /^(prenom\.nom@exemple\.fr)$/;

  const fuites = [];
  const parcourir = (dir) => {
    for (const nom of readdirSync(dir)) {
      const chemin = join(dir, nom);
      if (statSync(chemin).isDirectory()) {
        parcourir(chemin);
        continue;
      }
      if (!EXT.has(extname(nom))) continue;
      const contenu = readFileSync(chemin, 'utf8');
      for (const trouvee of contenu.match(ADRESSE) ?? []) {
        if (!AUTORISEES.test(trouvee)) {
          fuites.push(`${chemin.replace(dist, 'dist')} → ${trouvee}`);
        }
      }
    }
  };
  parcourir(dist);

  check(
    'Aucune adresse e-mail dans le site servi',
    fuites.length === 0,
    [...new Set(fuites)].slice(0, 5).join(' | '),
  );

  /* Le fichier de configuration serveur ne doit jamais partir dans dist/
     autrement que sous sa forme d'exemple, vide de tout secret. */
  const modele = readFileSync(resolve(dist, 'api/config.sample.php'), 'utf8');
  /* Le modèle DOIT rester un modèle : des marqueurs à remplacer, et aucune
     boîte réelle. `no-reply@iprig.fr` y figure légitimement — c'est un
     expéditeur technique documenté, pas une destination. */
  check(
    'config.sample.php ne contient aucun secret',
    modele.includes('REMPLACER') &&
      !/@(gmail|outlook|yahoo|hotmail|proton)\./i.test(modele),
  );
}

await browser.close();

/* ==================================== RÉSULTATS ======================= */
const echecs = results.filter((r) => !r.ok);
for (const r of results) {
  console.log(`  ${r.ok ? 'OK  ' : 'ÉCHEC'} ${r.name}${r.detail ? '  → ' + r.detail : ''}`);
}
console.log(
  `\n${results.length} contrôles — ${results.length - echecs.length} réussis, ${echecs.length} échoués`,
);
process.exit(echecs.length === 0 ? 0 : 1);
