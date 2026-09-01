/**
 * ============================================================================
 *  SECTION « L’INSTITUT » — présentation et raisons de rejoindre
 * ============================================================================
 *  Le client considère « présentation de la prépa » et « pourquoi rejoindre »
 *  comme une seule rubrique. Elle est donc traitée ici d’un seul tenant.
 *
 *  Cette source alimente à la fois la section d’accueil `#institut` et toute
 *  reprise ultérieure : aucune de ces phrases ne doit être recopiée ailleurs.
 * ============================================================================
 */

/** Chapô éditorial de la section. */
export const institut = {
  eyebrow: "L’institut",
  title: 'Une préparation pour vous accompagner pas à pas',
  lede: "L’IPRIG accompagne celles et ceux qui veulent faire des relations internationales et de la géopolitique autre chose qu’un centre d’intérêt : une orientation, un parcours, un métier.",
  body: [
    "L’accompagnement repose sur des sessions régulières, un suivi des questions de chacun et des opportunités transmises aux membres tout au long de l’année. L’objectif n’est pas d’accumuler des heures de contenu, mais de transmettre des méthodes de travail, des repères sur le milieu et un cadre pour avancer.",
    "L’Institut s’adresse d’abord aux étudiants de licence et de master en relations internationales, en sciences politiques, ainsi qu’à celles et ceux qui souhaitent s’orienter vers ces secteurs. Les lycéens qui réfléchissent à leurs études et les personnes engagées dans une reconversion y trouvent également leur place.",
  ],
};

/** À qui s’adresse l’institut — affiché en encart. Pas de point final. */
export const publics: string[] = [
  'Étudiants en licence et en master',
  'Relations internationales, sciences politiques, géopolitique',
  'Futurs candidats à une orientation dans ces secteurs',
  'Lycéens qui construisent leur projet d’études',
];

/* -------------------------------------------------------------------------- */
/*  LES SEPT AXES DE L’INSTITUT                                               */
/* -------------------------------------------------------------------------- */

export type Apport = {
  /** Numéro éditorial, affiché en gros dans la colonne de gauche. */
  index: string;
  title: string;
  text: string;
};

/**
 * Présentés comme un sommaire de revue, pas comme une grille de cartes.
 * L’ordre est celui validé par le client et ne doit pas être réarrangé.
 *
 * Capitalisation : le mot clé prend la majuscule, l’article non
 * (« un Réseau », « des Événements »).
 */
export const apports: Apport[] = [
  {
    index: '1',
    title: 'un Réseau',
    text: "Les membres construisent progressivement leur réseau dans les milieux liés aux relations internationales et à la géopolitique, au fil des sessions et des rencontres.",
  },
  {
    index: '2',
    title: 'des Événements',
    text: "Conférences, visites, rencontres et événements institutionnels sont communiqués aux membres au fur et à mesure qu’ils se présentent.",
  },
  {
    index: '3',
    title: 'une Immersion',
    text: "Comprendre de l’intérieur le milieu professionnel et institutionnel que l’on vise change la façon de construire ses études et ses candidatures.",
  },
  {
    index: '4',
    title: 'un Accompagnement',
    text: "Un cadre et un suivi, plutôt qu’une ressource de plus à consulter seul.",
  },
  {
    index: '5',
    title: 'des Connaissances',
    text: "Approfondir sa culture des relations internationales et de la géopolitique au-delà de ce qu’un programme universitaire permet de couvrir.",
  },
  {
    index: '6',
    title: 'une Méthodologie',
    text: "Les exercices du supérieur obéissent à des règles précises. Les maîtriser vaut souvent plus que de connaître un sujet de plus.",
  },
  {
    index: '7',
    title: 'des Réflexes',
    text: "Choisir une spécialisation, arbitrer entre deux voies, préparer un entretien : autant de décisions qui gagnent à être prises avec des repères.",
  },
];
