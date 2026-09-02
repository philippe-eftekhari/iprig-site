/**
 * ============================================================================
 *  CERTIFICATS DE GÉOPOLITIQUE — SOURCE UNIQUE
 * ============================================================================
 *  Le catalogue, les enseignants, les modalités, les tarifs et les modalités
 *  de validation vivent ICI, et nulle part ailleurs. La page /certificats et
 *  le formulaire de préinscription lisent tous les deux ce fichier : la liste
 *  déroulante du formulaire ne peut donc pas diverger du catalogue affiché.
 *
 *  ---------------------------------------------------------------------------
 *  CE QU’IL NE FAUT PAS ÉCRIRE ICI
 *  ---------------------------------------------------------------------------
 *  — aucune modalité d’examen (format, durée, note minimale, coefficient,
 *    QCM, oral, dissertation, rattrapage) : le client n’a validé QUE le
 *    principe d’un examen terminal ;
 *  — aucun créneau horaire : ils ne sont pas arrêtés ;
 *  — aucune biographie d’enseignant non fournie : `shortBio` reste `null` ;
 *  — aucun portrait non validé : `photo` reste `null` et la vignette bascule
 *    sur son repli typographique.
 *
 *  En V4, les certificats sont en PRÉINSCRIPTION UNIQUEMENT : aucun paiement,
 *  aucun panier, aucun bouton « Acheter » ne doit apparaître sur ce site.
 * ============================================================================
 */
/* -------------------------------------------------------------------------- */
/*  1. EN-TÊTE DE PAGE                                                        */
/* -------------------------------------------------------------------------- */

export const certificatsPage = {
  eyebrow: 'Certificats',
  title: 'Les certificats de géopolitique de l’IPRIG',
  /** Accroche. Sans point final. */
  tagline:
    'Développez une première expertise en relations internationales et en géopolitique',
  intro:
    "À compter de février 2027, l’IPRIG propose des certificats semestriels d’introduction à la géopolitique, consacrés à différentes régions du monde et à plusieurs grandes thématiques des relations internationales. Entièrement dispensés à distance, ils permettent d’acquérir en dix séances les connaissances fondamentales nécessaires à la compréhension d’un espace géopolitique ou d’une discipline.",
};

/** Pourquoi suivre un certificat. */
export const certificatsPurpose = {
  title: 'Construire les premières bases d’une expertise',
  body: "Les certificats ont pour objectif de fournir les premières clés nécessaires à la compréhension des dynamiques géopolitiques, politiques, juridiques, sociales et internationales propres à chaque espace ou thématique étudié. Ils constituent une première approche structurée permettant de renforcer ses connaissances et de commencer à bâtir une expertise dans le domaine choisi.",
};

/* -------------------------------------------------------------------------- */
/*  2. ENSEIGNANTS                                                            */
/* -------------------------------------------------------------------------- */

export type Teacher = {
  id: string;
  name: string;
  /**
   * Nom du fichier de portrait dans `src/assets/teachers/`, SANS extension.
   * `TeacherCard` le résout lui-même : ce fichier de données reste ainsi du
   * texte pur, importable aussi bien par Astro que par le point d’entrée
   * JSON qui alimente la validation serveur du formulaire.
   *
   * Format attendu : 4:5, 1200 × 1500 minimum, 1600 × 2000 recommandé.
   *
   * `null` tant qu’aucun portrait validé n’est disponible : la vignette
   * affiche alors les initiales dans un cadre sobre. Ne jamais générer un
   * portrait, ni en récupérer un sur Internet.
   */
  photo: string | null;
  /**
   * Biographie d’une à deux phrases. `null` tant que le client ne l’a pas
   * fournie : la vignette n’affiche alors que le nom et les certificats.
   */
  shortBio: string | null;
};

/**
 * ============================================================================
 *  CINQ ENSEIGNANTS — ORDRE ET ORTHOGRAPHES ARRÊTÉS EN V4.2
 * ============================================================================
 *  L’ORDRE de ce tableau est celui de la page : Kevan, Albert, Valentin,
 *  Balkissou, Alain. Il a été fixé par le client et ne doit pas être
 *  réarrangé — ni ici, ni dans le catalogue plus bas, qui le suit.
 *
 *  Les graphies ci-dessous sont celles confirmées par le client. Elles closent
 *  les hésitations des briefs successifs, qui ont écrit tour à tour
 *  « Alain Kopolani », « Alain Kopolani », « Alan Kopelany », « Albert
 *  Kondemir » et « Balkisu Ayatu » :
 *
 *      Alain Coppolani   (et non « Kopolani », ni « Kopelany », ni « Alan »)
 *      Albert Kandemir   (et non « Kondemir »)
 *      Balkissou Hayatou (et non « Balkisu Ayatu ») — prénom puis nom
 *      Valentin Blondiau
 *
 *  Ces anciennes graphies ne doivent plus réapparaître nulle part :
 *  `qa-content.mjs` échoue si l’une d’elles revient dans le site construit.
 *
 *  ---------------------------------------------------------------------------
 *  ⚠ « Keyvan » N’EST PAS « Kevan Gafaïti »
 *  ---------------------------------------------------------------------------
 *  Ce sont DEUX PERSONNES DIFFÉRENTES. Une consigne de nettoyage portant sur
 *  « Keyvan » ne concerne jamais Kevan Gafaïti, fondateur de l’IPRIG, qui doit
 *  rester présent ici, sur la page d’accueil, sur `/kevan-gafaiti`, dans le
 *  bloc KevanExplique et dans le bloc IRIG. Ne jamais le supprimer, ne jamais
 *  transformer automatiquement l’un en l’autre.
 *
 *  Les cinq enseignants ont un portrait réel et une biographie fournie par le
 *  client : plus aucun `null` dans ce tableau. Le repli typographique de
 *  `TeacherCard` reste néanmoins en place pour un enseignant qui viendrait
 *  s’ajouter sans portrait.
 * ============================================================================
 */
export const teachers: Teacher[] = [
  {
    id: 'kevan-gafaiti',
    name: 'Kevan Gafaïti',
    // Même photographie que la page /kevan-gafaiti, recadrée au format des
    // vignettes. Ici, le fondateur est un enseignant parmi les autres : sa
    // vignette doit se composer exactement comme les leurs.
    photo: 'kevan-gafaiti',
    shortBio:
      "Enseignant-chercheur en relations internationales, spécialiste de la géopolitique du Moyen-Orient et de la politique étrangère de l’Iran. Fondateur de l’IPRIG.",
  },
  {
    id: 'albert-kandemir',
    name: 'Albert Kandemir',
    photo: 'albert-kandemir',
    // Biographie fournie et validée par le client le 01/09/2026.
    shortBio:
      "Albert Kandemir finalise une thèse de doctorat en science politique consacrée à la trajectoire de la puissance turque au Centre Thucydide de l’Université Paris-Panthéon-Assas. Il enseigne les relations internationales à l’Université Paris-Panthéon-Assas et à Sciences Po Paris.",
  },
  {
    id: 'valentin-blondiau',
    name: 'Valentin Blondiau',
    /*
     * Portrait fourni par le client le 01/09/2026. Il est carré et de faible
     * définition (400 × 400) : `scripts/prepare-assets.mjs` en tire un master
     * de 640 × 800, exactement la plus grande taille que la vignette affiche.
     * TODO CLIENT : une source plus définie rendrait cette vignette aussi
     * nette que les quatre autres. Rien d’autre ne serait à changer.
     */
    photo: 'valentin-blondiau',
    /*
     * Biographie réécrite par le client le 02/09/2026, en remplacement de la
     * version du 01/09 qui citait le titre de thèse in extenso. Le titre n’est
     * plus affiché : c’est un choix éditorial du client, pas un oubli — ne pas
     * le réintroduire. La fiche raconte désormais le parcours plutôt que
     * l’intitulé académique, et se lit en deux phrases au lieu de trois.
     *
     * L’écriture inclusive « dirigeant·es » est celle du client : point médian,
     * sans second point. Ne pas l’« harmoniser ».
     */
    shortBio:
      "Valentin Blondiau a travaillé pendant cinq ans dans la communication des organisations avant de s’orienter vers la recherche dans le cadre d’une thèse en sciences de l’information et de la communication. Ce changement de perspective lui permet aujourd’hui d’étudier les impacts des crises internationales sur les discours, les postures et le rôle des dirigeant·es économiques.",
  },
  {
    id: 'balkissou-hayatou',
    name: 'Balkissou Hayatou',
    photo: 'balkissou-hayatou',
    /*
     * VERSION PUBLIQUE, VOLONTAIREMENT PLUS COURTE QUE LA SOURCE.
     *
     * La biographie complète transmise par le client est conservée ci-dessous,
     * mot pour mot, comme référence éditoriale. Elle n’est pas affichée : à
     * cette longueur, sa vignette pesait visuellement deux fois celle des
     * trois autres enseignants. La version courte dit la même chose, sans
     * réduire la police, sans tronquer et sans « Lire plus ».
     *
     *   « Balkissou Hayatou est docteure en science politique de l’Université
     *   de Poitiers. Spécialiste de l’Afrique et des transformations du
     *   système multilatéral, ses travaux portent sur la politique étrangère,
     *   la diplomatie, la géopolitique de l’Afrique subsaharienne notamment
     *   celle du golfe de Guinée regroupant l’Afrique centrale et de l’Ouest,
     *   ainsi que la gouvernance mondiale et les Nations Unies. En parallèle
     *   de ses activités de recherche, elle exerce des missions de conseil au
     *   sein du cabinet Hbalconsulting où elle accompagne des acteurs
     *   institutionnels et des organisations dans l’analyse de leurs enjeux
     *   stratégiques, géopolitiques et internationaux. »
     *
     * ⚠ « docteure », au féminin. Ne pas « corriger » en « docteur ».
     */
    shortBio:
      "Balkissou Hayatou est docteure en science politique de l’Université de Poitiers. Spécialiste de l’Afrique et du multilatéralisme, ses travaux portent notamment sur la politique étrangère, la diplomatie et la géopolitique du golfe de Guinée. Elle exerce également des missions de conseil au sein du cabinet Hbalconsulting.",
  },
  {
    id: 'alain-coppolani',
    name: 'Alain Coppolani',
    photo: 'alain-coppolani',
    // Biographie fournie et validée par le client le 01/09/2026.
    shortBio:
      "Alain Coppolani est docteur en Économie et Sociétés et consultant en finance islamique. Il est également Certified Shari’ah Auditor and Advisor (CSAA) auprès de l’AAOIFI. Sa thèse de doctorat porte sur l’évolution du système financier en Afghanistan et sa transformation vers un modèle conforme aux principes de la finance islamique.",
  },
];

/** Chapô de la section « enseignants ». */
export const teachersHeading = {
  title: 'Des enseignements dispensés par des spécialistes',
  body: "Chaque certificat est assuré par un spécialiste du domaine enseigné, docteur ou en voie de le devenir dans son champ de spécialisation. Les enseignants de l’IPRIG disposent également d’une solide expérience de l’enseignement et interviennent régulièrement dans des conférences et colloques en France et à l’international. Ils mobilisent leur expertise académique et leur expérience pédagogique afin de transmettre des connaissances accessibles, structurées et directement mobilisables.",
};

/* -------------------------------------------------------------------------- */
/*  3. CATALOGUE                                                              */
/* -------------------------------------------------------------------------- */
/*
 *  ⚠ L’ORDRE DE CE TABLEAU EST CELUI DU FORMULAIRE.
 *  `certificatesOf()` et `openCertificates` le conservent tel quel : les cases
 *  à cocher de la préinscription apparaissent donc dans cet ordre, qui doit
 *  rester celui des enseignants — Kevan, Albert, Valentin, Balkissou, Alain.
 *  Insérer un certificat ailleurs qu’au bon endroit désaligne le formulaire de
 *  la page sans qu’aucun test ne s’en plaigne.
 */

export type Certificate = {
  id: string;
  title: string;
  teacherId: string;
  /** Période de la session. */
  startPeriod: string;
  sessionCount: number;
  /** Durée d’une séance. */
  duration: string;
  remote: boolean;
  replay: boolean;
  /**
   * `preinscription` en V4. Passera à `inscription` lorsque les modalités
   * définitives d’inscription seront arrêtées — pas avant.
   */
  registrationStatus: 'preinscription' | 'inscription' | 'closed';
};

/** Valeurs communes à tous les certificats de la première session. */
const SESSION_2027 = {
  startPeriod: 'Février – avril 2027',
  sessionCount: 10,
  duration: 'une heure',
  remote: true,
  replay: true,
  registrationStatus: 'preinscription',
} as const;

export const certificates: Certificate[] = [
  {
    id: 'geopolitique-iran',
    title: 'Introduction à la géopolitique de l’Iran',
    teacherId: 'kevan-gafaiti',
    ...SESSION_2027,
  },
  {
    id: 'geopolitique-golfe-persique',
    title: 'Introduction à la géopolitique du golfe Persique',
    teacherId: 'kevan-gafaiti',
    ...SESSION_2027,
  },
  {
    id: 'geopolitique-turquie',
    title: 'Introduction à la géopolitique de la Turquie',
    teacherId: 'albert-kandemir',
    ...SESSION_2027,
  },
  {
    id: 'geopolitique-caucase',
    title: 'Introduction à la géopolitique du Caucase',
    teacherId: 'albert-kandemir',
    ...SESSION_2027,
  },
  {
    id: 'geopolitique-asie-centrale',
    title: 'Introduction à la géopolitique de l’Asie centrale',
    teacherId: 'albert-kandemir',
    ...SESSION_2027,
  },
  {
    id: 'concept-de-puissance',
    title: 'Introduction au concept de puissance en relations internationales',
    teacherId: 'albert-kandemir',
    ...SESSION_2027,
  },
  {
    id: 'communication-de-crise',
    title: 'Introduction à la Communication de crise',
    teacherId: 'valentin-blondiau',
    ...SESSION_2027,
  },
  {
    id: 'geopolitique-afrique-ouest',
    title: 'Introduction à la géopolitique de l’Afrique de l’Ouest',
    teacherId: 'balkissou-hayatou',
    ...SESSION_2027,
  },
  {
    id: 'geopolitique-afrique-centrale',
    title: 'Introduction à la géopolitique de l’Afrique centrale',
    teacherId: 'balkissou-hayatou',
    ...SESSION_2027,
  },
  {
    id: 'geopolitique-afghanistan',
    title: 'Introduction à la géopolitique de l’Afghanistan',
    teacherId: 'alain-coppolani',
    ...SESSION_2027,
  },
  {
    id: 'finance-islamique',
    title: 'Introduction à la finance islamique',
    teacherId: 'alain-coppolani',
    ...SESSION_2027,
  },
];

/** Les certificats d’un enseignant, dans l’ordre du catalogue. */
export const certificatesOf = (teacherId: string) =>
  certificates.filter((c) => c.teacherId === teacherId);

/** L’enseignant d’un certificat. */
export const teacherOf = (certificate: Certificate) =>
  teachers.find((t) => t.id === certificate.teacherId);

/** Certificats ouverts à la préinscription — alimente le formulaire. */
export const openCertificates = certificates.filter(
  (c) => c.registrationStatus === 'preinscription',
);

/* -------------------------------------------------------------------------- */
/*  4. MODALITÉS                                                              */
/* -------------------------------------------------------------------------- */

export type Modalite = { label: string; detail: string };

export const modalites: Modalite[] = [
  {
    label: '100 % à distance',
    detail: 'Tous les enseignements sont dispensés en distanciel.',
  },
  {
    label: '10 séances d’une heure',
    detail:
      'Chaque certificat comprend dix séances, à raison d’environ une séance par semaine.',
  },
  {
    label: 'Février – avril 2027',
    detail:
      'Les enseignements de la première session se déroulent pendant les mois de février, mars et avril 2027.',
  },
  {
    label: 'Direct + rediffusion illimitée',
    detail:
      'Les séances sont dispensées en direct et restent ensuite accessibles en rediffusion de manière illimitée via Patreon.',
  },
];

/** Précision affichée sous les modalités. */
export const modalitesNote =
  "Le créneau hebdomadaire précis de chaque certificat sera communiqué ultérieurement en tenant compte, dans la mesure du possible, des disponibilités des personnes inscrites.";

/* -------------------------------------------------------------------------- */
/*  5. TARIFS                                                                 */
/* -------------------------------------------------------------------------- */

export type Tarif = { count: number; label: string; price: string };

/**
 * ⚠ Aucun paiement n’est possible sur ce site en V4 : ces tarifs sont
 * affichés à titre d’information, jamais associés à un bouton d’achat.
 */
export const tarifs: Tarif[] = [
  { count: 1, label: '1 certificat', price: '100 €' },
  { count: 2, label: '2 certificats', price: '175 €' },
  { count: 3, label: '3 certificats', price: '250 €' },
  { count: 4, label: '4 certificats', price: '330 €' },
];

export const tarifsNote =
  "Les tarifs dégressifs permettent de composer librement son parcours en choisissant plusieurs certificats parmi l’ensemble du catalogue proposé.";

/* -------------------------------------------------------------------------- */
/*  6. VALIDATION                                                             */
/* -------------------------------------------------------------------------- */

/**
 * ⚠ SEUL LE PRINCIPE DE L’EXAMEN TERMINAL EST VALIDÉ.
 * Ne jamais compléter ce texte par un format, une durée, une note minimale,
 * un coefficient ou une session de rattrapage : rien de tout cela n’existe
 * encore.
 */
export const validation = {
  title: 'Validation du certificat',
  body: "À l’issue de la formation, la validation du certificat repose sur un examen terminal. Sous réserve de la réussite à cet examen, une attestation nominative de réussite au certificat est délivrée par l’IPRIG. Elle permet de valoriser sur un CV le suivi et la validation d’un enseignement spécialisé dans la discipline concernée.",
  disclaimer:
    "Les certificats de l’IPRIG ne constituent pas des diplômes ou certifications professionnelles reconnus par l’État et ne se substituent pas à une formation universitaire diplômante.",
};

/* -------------------------------------------------------------------------- */
/*  7. PRÉINSCRIPTION                                                         */
/* -------------------------------------------------------------------------- */

export const preinscription = {
  title: 'Se préinscrire à un certificat',
  body: "Les préinscriptions aux certificats débutant en février 2027 sont ouvertes. Vous pouvez indiquer le ou les certificats qui vous intéressent afin d’être recontacté et de recevoir les informations relatives aux horaires et aux modalités définitives d’inscription.",
  cta: 'Se préinscrire',
  submit: 'Envoyer ma demande',
  /**
   * ⚠ Formulation volontaire : une préinscription est ENVOYÉE, jamais
   * confirmée. Ne pas écrire « votre inscription est confirmée ».
   */
  success: 'Votre demande de préinscription a bien été envoyée.',
};

/** Affiche de clôture de la page. */
export const certificatsCta = {
  title: 'Développez votre expertise en géopolitique',
  cta: 'Se préinscrire aux certificats',
};
