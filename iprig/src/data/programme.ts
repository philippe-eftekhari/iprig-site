/**
 * ============================================================================
 *  PROGRAMME ET EXPÉRIENCE IPRIG — SOURCE UNIQUE
 * ============================================================================
 *  Trois blocs indépendants :
 *   1. `volets`         — les quatre formes que prend l’accompagnement.
 *   2. `sessions`       — les exemples de séances.
 *   3. `fonctionnement` — le parcours du membre.
 *
 *  Ces trois blocs alimentent SIMULTANÉMENT la page d’accueil et la page
 *  /programme. Aucune de ces phrases ne doit être recopiée dans un composant :
 *  les deux pages ne peuvent pas diverger.
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*  1. LES QUATRE FORMES D’ACCOMPAGNEMENT                                     */
/* -------------------------------------------------------------------------- */

export type Volet = {
  id: string;
  /** Numéro éditorial affiché dans la marge. */
  numeral: string;
  title: string;
  lede: string;
  /** Puces courtes, sans point final. */
  points: string[];
};

/** Chapô commun aux deux pages qui présentent les volets. */
export const voletsHeading = {
  title: 'Quatre formes d’accompagnement, une seule adhésion',
  lede: "L’IPRIG ne se résume pas à un calendrier de séances. L’adhésion donne accès à un ensemble cohérent : travailler ses méthodes, rencontrer des milieux, saisir les occasions qui se présentent et revenir sur ce qui a été dit.",
  /** Variante utilisée en tête de la page /programme. */
  programmeLede:
    "L’adhésion donne accès à quatre volets complémentaires. Ils fonctionnent ensemble : les séances donnent les méthodes, les événements ouvrent le milieu professionnel, les rediffusions permettent de revenir sur ce qui a été dit.",
};

/** Ordre validé par le client : Événements, Immersion, Sessions, Rediffusion. */
export const volets: Volet[] = [
  {
    id: 'evenements',
    numeral: '1',
    title: 'Événements',
    lede: "Des opportunités communiquées aux membres chaque semaine : rencontres, visites, séminaires professionnels, conférences et colloques.",
    points: [
      'Conférences et colloques',
      'Visites d’ambassades et événements institutionnels',
      'Rencontres avec des intervenants du secteur',
      'Informations transmises en exclusivité aux membres',
    ],
  },
  {
    id: 'immersion',
    numeral: '2',
    title: 'Immersion',
    lede: "Une mise en contact progressive avec le milieu professionnel, diplomatique et institutionnel des relations internationales.",
    points: [
      'Découverte des métiers et des trajectoires réelles',
      'Compréhension des codes du secteur',
      'Repères sur le milieu institutionnel et professionnel',
      'Réseau construit au fil des rencontres',
    ],
  },
  {
    id: 'sessions',
    numeral: '3',
    title: 'Sessions',
    lede: "Des sessions régulières consacrées à la méthodologie universitaire, à la construction du profil professionnel et à l’acquisition des réflexes du secteur.",
    points: [
      'Méthodologie des exercices attendus dans le supérieur',
      'Construction des dossiers de candidature et préparation des échéances',
      'Acquisition des réflexes professionnels du secteur',
      'Compréhension des codes du monde professionnel et échanges directs',
    ],
  },
  {
    id: 'rediffusion',
    numeral: '4',
    title: 'Rediffusion',
    lede: "Les contenus réservés aux membres restent accessibles indéfiniment. Une séance manquée peut ainsi être rattrapée.",
    points: [
      'Sessions accessibles en rediffusion',
      'Consultation à votre rythme',
      'Contenus réservés aux membres',
      'Accès depuis l’espace prévu à cet effet',
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  2. LES SÉANCES                                                            */
/* -------------------------------------------------------------------------- */

export type Session = {
  /** Intitulé de la séance. */
  title: string;
  /** Ce que la séance apporte concrètement. Sans point final. */
  summary: string;
  /** Famille de séance, utilisée comme étiquette éditoriale. Sans point final. */
  category: 'Méthodologie' | 'Professionnel' | 'Parcours' | 'Réseau';
};

/** Chapô commun aux deux pages qui présentent les séances. */
export const sessionsHeading = {
  title: 'Des séances qui répondent à des questions concrètes',
  lede: "Méthodologie universitaire, construction du parcours, acquisition des compétences professionnelles. Chaque séance traite d’un sujet précis et laisse la place aux questions des membres.",
  /** Variante utilisée sur la page /programme. Sans point final. */
  programmeTitle: 'Des sujets précis traités en profondeur',
  programmeLede:
    'Chaque séance part d’une difficulté réelle rencontrée par les étudiants et se termine par un temps de questions',
};

/**
 * TODO CLIENT : le programme annuel définitif n’a pas encore été communiqué.
 * Les quatre séances ci-dessous ont été validées par le client comme exemples
 * représentatifs et sont présentées comme telles — pas comme un calendrier.
 * Les remplacer par le programme complet dès qu’il sera fourni.
 */
export const sessions: Session[] = [
  {
    title: 'Méthodologie des exercices universitaires',
    category: 'Méthodologie',
    summary:
      "Dissertation, commentaire, note de synthèse : les attentes réelles des correcteurs et la manière d’y répondre",
  },
  {
    title: 'Comment réussir un entretien d’embauche ?',
    category: 'Professionnel',
    summary:
      'Préparation du dossier, compréhension des codes professionnels et formation à l’échange direct',
  },
  {
    title:
      'Renforcer et valoriser ses centres d’intérêt en relations internationales',
    category: 'Parcours',
    summary:
      'Transformer une curiosité personnelle en compétences valorisantes et lisibles sur un dossier et en sujets de discussion lors d’un entretien',
  },
  {
    title: 'Construire son réseau en relations internationales',
    category: 'Réseau',
    summary:
      'Repérer les rencontres pertinentes, apprendre à interagir avec les professionnels du secteur et valoriser ses connaissances lors des échanges',
  },
];

/* -------------------------------------------------------------------------- */
/*  3. FONCTIONNEMENT (parcours du membre)                                    */
/* -------------------------------------------------------------------------- */

export type Etape = {
  step: string;
  title: string;
  text: string;
};

/** Chapô de la section « Rejoindre, en pratique ». */
export const fonctionnementIntro =
  "L’adhésion s’effectue sur Patreon, qui gère l’abonnement et les paiements. Aucun compte n’est créé sur ce site.";

export const fonctionnement: Etape[] = [
  {
    step: '1',
    title: 'Vous rejoignez',
    text: "L’adhésion se fait sur Patreon, qui gère l’abonnement et les paiements. Aucun compte à créer sur ce site.",
  },
  {
    step: '2',
    title: 'Vous devenez membre',
    text: "Vous intégrez la communauté IPRIG et recevez les communications sur les séances et les opportunités à venir",
  },
  {
    step: '3',
    title: 'Vous participez',
    text: "Vous suivez les sessions, accédez aux contenus réservés et aux rediffusions, et profitez des événements proposés.",
  },
];
