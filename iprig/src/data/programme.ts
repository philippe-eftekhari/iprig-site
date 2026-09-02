/**
 * ============================================================================
 *  PROGRAMME ET EXPÉRIENCE IPRIG — SOURCE UNIQUE
 * ============================================================================
 *  Trois blocs indépendants :
 *   1. `volets`         — les quatre formes que prend l’accompagnement.
 *   2. `sessions`       — le programme des séances 2026-2027.
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
/*  2. LES SÉANCES — PROGRAMME 2026-2027                                      */
/* -------------------------------------------------------------------------- */

/**
 * Programme des séances IPRIG KevanExplique 2026-2027, communiqué par le
 * client. Il remplace les quatre séances d’exemple qui tenaient la place
 * depuis la V2 : le calendrier existe désormais réellement.
 *
 * Quinze séances en deux semestres — six au premier, neuf au second. Les
 * dates du premier semestre sont arrêtées ; celles du second ne le sont pas.
 */
export type Session = {
  /** Semestre d’appartenance. */
  semester: 1 | 2;
  /** Numéro de la séance dans le programme complet, de 1 à 15. */
  number: number;
  /**
   * Date affichée, telle qu’elle se lit — « Dimanche 11 octobre 2026 ».
   *
   * `null` tant que la date n’est pas arrêtée : la liste affiche alors
   * `DATE_A_VENIR`, et le semestre porte sa note d’attente.
   *
   * ⚠ Ne jamais y écrire une date plausible « en attendant ». Le jour où le
   * client communique une date, on remplace ce seul `null` — rien d’autre
   * n’est à toucher : totaux, notes et compteurs s’en déduisent.
   */
  date: string | null;
  /** Intitulé exact communiqué par le client. */
  title: string;
};

/**
 * Formulation UNIQUE d’une date non arrêtée, écrite ici et nulle part
 * ailleurs. Ni « à définir », ni « prochainement », ni « bientôt » : une
 * seule chaîne, pour que la substitution reste triviale.
 */
export const DATE_A_VENIR = 'Date à venir';

/** Chapô commun aux deux pages qui présentent les séances. */
export const sessionsHeading = {
  title: 'Des séances qui répondent à des questions concrètes',
  lede: "Méthodologie universitaire, construction du parcours, acquisition des compétences professionnelles. Chaque séance traite d’un sujet précis et laisse la place aux questions des membres.",
  /** Surtitre de la section des séances, page /programme. */
  programmeEyebrow: 'Programme IPRIG',
  /** Titre de la même section. Le millésime y est nommé une seule fois. */
  programmeTitle: 'Le programme des séances 2026-2027',
  programmeLede:
    'Chaque séance part d’une difficulté réelle rencontrée par les étudiants et se termine par un temps de questions',
};

export const sessions: Session[] = [
  /* ------------------------------------------- Semestre 1 — dates arrêtées */
  {
    semester: 1,
    number: 1,
    date: 'Dimanche 11 octobre 2026',
    title: 'Réussir son année universitaire',
  },
  {
    semester: 1,
    number: 2,
    date: 'Dimanche 25 octobre 2026',
    title: 'Maîtriser les exercices universitaires',
  },
  {
    semester: 1,
    number: 3,
    date: 'Dimanche 8 novembre 2026',
    title: 'Construire son parcours géopolitique',
  },
  {
    semester: 1,
    number: 4,
    date: 'Dimanche 22 novembre 2026',
    title: 'Cartographier les métiers en relations internationales',
  },
  {
    semester: 1,
    number: 5,
    date: 'Dimanche 6 décembre 2026',
    title: 'Préparer et réussir ses examens',
  },
  {
    semester: 1,
    number: 6,
    date: 'Dimanche 20 décembre 2026',
    title: 'Session Bilan et échanges',
  },

  /* -------------------------------------- Semestre 2 — dates non arrêtées */
  {
    semester: 2,
    number: 7,
    date: null,
    title: 'Développer sa culture générale internationale',
  },
  {
    semester: 2,
    number: 8,
    date: null,
    title: 'Se préparer aux concours de la haute fonction publique',
  },
  {
    semester: 2,
    number: 9,
    date: null,
    title: 'Préparer son CV et sa lettre de motivation',
  },
  {
    semester: 2,
    number: 10,
    date: null,
    title: 'Réussir ses candidatures universitaires et ses admissions',
  },
  {
    semester: 2,
    number: 11,
    date: null,
    title: 'Construire son projet professionnel',
  },
  {
    semester: 2,
    number: 12,
    date: null,
    title: 'Trouver un stage ou un poste en relations internationales',
  },
  {
    semester: 2,
    number: 13,
    date: null,
    title: 'Réussir son entretien d’embauche et ses expériences professionnelles',
  },
  {
    semester: 2,
    number: 14,
    date: null,
    title: 'Construire et développer son réseau professionnel',
  },
  {
    semester: 2,
    number: 15,
    date: null,
    title: 'Session Bilan et échanges',
  },
];

/* ----------------------------------------------------------- Les semestres */

export type Semestre = {
  numero: 1 | 2;
  /** Titre affiché en tête du bloc. */
  label: string;
  sessions: Session[];
};

const seancesDu = (n: 1 | 2) => sessions.filter((s) => s.semester === n);

/**
 * Regroupement affiché par `SessionsList`. Les séances ne sont pas recopiées :
 * elles se déduisent de `sessions`. Les totaux annoncés ne peuvent donc pas
 * mentir, et déplacer une séance d’un semestre à l’autre suffit à tout mettre
 * à jour.
 */
export const semestres: Semestre[] = [
  { numero: 1, label: 'Semestre 1', sessions: seancesDu(1) },
  { numero: 2, label: 'Semestre 2', sessions: seancesDu(2) },
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
