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
  lede: "L’IPRIG accompagne celles et ceux qui veulent faire des relations internationales et de la géopolitique autre chose qu’un centre d’intérêt : un choix, un parcours, un métier.",
  body: [
    "L’accompagnement repose sur des sessions régulières, une immersion pratique dans le champ géopolitique et des opportunités transmises aux membres tout au long de l’année. L’objectif n’est pas d’accumuler des heures de contenu, mais de transmettre des méthodes de travail, des repères sur le milieu et un cadre pour avancer.",
    "L’Institut s’adresse notamment aux étudiants de licence ainsi qu’à celles et ceux qui souhaitent s’orienter vers ces secteurs. Les lycéens qui réfléchissent à leurs études et les personnes engagées dans une reconversion y trouvent également leur place.",
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
 * Capitalisation — ARRÊTÉE EN V4.2, ne plus la rouvrir : c’est le PREMIER
 * mot qui porte la majuscule, et lui seul — « Des événements », et non
 * « des Événements ». La V4.1 capitalisait le mot clé et laissait
 * l’article en bas de casse ; le client a tranché dans l’autre sens.
 *
 * L’axe 1 fait EXCEPTION à cette règle — arrêté EN V4.3.1 : le client a
 * tranché pour « Un Réseau », avec la majuscule sur les DEUX mots. C’est la
 * formulation transmise, reprise mot pour mot : ni « Réseau » seul (V4.2),
 * ni « Un réseau ». La casse exacte est contrôlée par qa-content.mjs.
 */
export const apports: Apport[] = [
  {
    index: '1',
    title: 'Un Réseau',
    text: "Les membres construisent progressivement leur réseau dans les milieux liés aux relations internationales et à la géopolitique, au fil des sessions et des rencontres.",
  },
  {
    index: '2',
    title: 'Des événements',
    text: "Conférences, visites, rencontres et événements institutionnels sont communiqués aux membres au fur et à mesure qu’ils se présentent.",
  },
  {
    index: '3',
    title: 'Une immersion',
    text: "Comprendre de l’intérieur le milieu professionnel et institutionnel que l’on vise change la façon de construire ses études et ses candidatures.",
  },
  {
    index: '4',
    title: 'Un accompagnement',
    text: "Un cadre et un suivi, plutôt qu’une ressource de plus à consulter seul.",
  },
  {
    index: '5',
    title: 'Des connaissances',
    text: "Approfondir sa culture des relations internationales et de la géopolitique au-delà de ce qu’un programme universitaire permet de couvrir.",
  },
  {
    index: '6',
    title: 'Une méthodologie',
    text: "Les exercices du supérieur obéissent à des règles précises. Les maîtriser vaut souvent plus que de connaître un sujet de plus.",
  },
  {
    index: '7',
    title: 'Des réflexes',
    text: "Choisir une spécialisation, arbitrer entre deux voies, préparer un entretien : autant de décisions qui gagnent à être prises avec des repères.",
  },
];
