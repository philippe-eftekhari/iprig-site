/**
 * ============================================================================
 *  KEVAN GAFAÏTI — fondateur de l’IPRIG
 * ============================================================================
 *  ⚠ TODO CLIENT : validation finale de la biographie et des intitulés
 *  académiques avant la mise en production.
 *
 *  Tout ce qui figure ici provient du brief client. Ne rien ajouter :
 *  aucun titre, poste, publication, distinction ou établissement
 *  supplémentaire ne doit être inventé.
 *
 *  Orthographe à respecter partout : « Kevan Gafaïti » (avec le tréma),
 *  et « KevanExplique » en un seul mot pour la marque de création de contenu.
 * ============================================================================
 */

export const kevan = {
  name: 'Kevan Gafaïti',

  /** Fonction principale affichée sous le nom. */
  role: "Fondateur de l’IPRIG",

  /** Fonctions secondaires, affichées en liste. Ordre validé par le client. */
  titles: [
    'Enseignant à Sciences Po Paris',
    "Président-fondateur de l’IRIG (Institut des Relations Internationales et de Géopolitique)",
  ],

  /** Accroche courte, utilisée sur la landing page. */
  lede: "Enseignant et chercheur en relations internationales, Kevan Gafaïti consacre ses travaux à la géopolitique du Moyen-Orient, avec une expertise particulière sur l’Iran et sa politique étrangère.",

  /** Variante de l’accroche pour l’en-tête de /kevan-gafaiti. Sans point final. */
  pageLede:
    "Enseignant-chercheur en relations internationales, Kevan Gafaïti consacre ses travaux à la géopolitique du Moyen-Orient, avec une expertise particulière sur l’Iran et sa politique étrangère",

  /** Biographie développée — utilisée sur la page /kevan-gafaiti. */
  bio: [
    "Kevan Gafaïti enseigne à Sciences Po Paris. Il a également enseigné à l’Université Paris-Panthéon-Assas et à l’INALCO, ainsi que, précédemment, à l’Université Paris 1 Panthéon-Sorbonne.",
    "Il a créé l’IPRIG, Institut de Préparation aux Relations Internationales et à la Géopolitique, et il est président-fondateur de l’IRIG, Institut des Relations Internationales et de Géopolitique.",
    "Il intervient dans des conférences et des colloques en France et à l’international.",
  ],

  /** Travaux — formulation validée par le client. */
  works:
    "Ses travaux, articles et ouvrages portent sur les relations internationales, la géopolitique et la politique étrangère iranienne.",

  /** Établissements d’enseignement mentionnés par le client. */
  institutions: [
    'Sciences Po Paris',
    'Université Paris-Panthéon-Assas',
    'INALCO',
    'Université Paris 1 Panthéon-Sorbonne (précédemment)',
  ],

  /** Parcours académique. */
  academic: {
    doctorate: {
      label: 'Doctorant en science politique et relations internationales',
      institution: 'Université Paris-Panthéon-Assas',
      /** Sujet tel que décrit par le client. */
      subject:
        "La France face à la politique étrangère de l’Iran (1995-2022)",
    },
    /** TODO CLIENT : confirmer les intitulés exacts des trois Master 2. */
    masters: {
      count: 3,
      label: 'Trois Master 2',
      fields: ['Droit', 'Histoire', 'Relations internationales'],
    },
  },

  /** Domaines de recherche. Sans point final. */
  researchAreas: [
    'Géopolitique du Moyen-Orient',
    'Politique étrangère de l’Iran',
    'Relations internationales',
  ],
};

/* -------------------------------------------------------------------------- */
/*  KEVANEXPLIQUE                                                             */
/* -------------------------------------------------------------------------- */

/**
 * ⚠ Aucun nombre d’abonnés n’est affiché. Le chiffre communiqué en V3
 * (≈ 75 000) n’a jamais été vérifié et une audience évolue en permanence :
 * l’afficher exposerait le site à une information fausse dès le lendemain.
 * Ne pas le réintroduire sans mesure datée et validée par le client.
 */
export const kevanExplique = {
  /** En un seul mot, partout. */
  name: 'KevanExplique',

  /** Présentation sur la page d’accueil. */
  lede: "Dans le prolongement de son engagement en faveur de la transmission du savoir et de la vulgarisation des connaissances en relations internationales et en géopolitique, Kevan Gafaïti développe également une activité de création de contenu avec KevanExplique.",

  /** Présentation sur la page /kevan-gafaiti. */
  pageLede:
    "En parallèle de ses activités d’enseignement et de recherche, Kevan Gafaïti diffuse des analyses de géopolitique et de relations internationales auprès d’une large audience sur les réseaux sociaux et en podcast.",

  /** Présentation sur la page /contact. Sans point final. */
  contactLede:
    'Les analyses de géopolitique et de relations internationales publiées en accès libre',
};

/* -------------------------------------------------------------------------- */
/*  L’ÉCOSYSTÈME — IRIG                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Mention sobre de l’IRIG sur le site IPRIG.
 * ⚠ IPRIG et IRIG sont deux entités distinctes :
 *   — IPRIG : la préparation, objet de ce site ;
 *   — IRIG  : l’institut de recherche, qui aura son propre site.
 * Ne jamais confondre les deux sigles, ni mettre « Géopolitique » au pluriel.
 */
export const irig = {
  name: 'IRIG',
  fullName: 'Institut des Relations Internationales et de Géopolitique',
  /** Titre complet affiché en tête de la section. */
  heading: 'IRIG – Institut des Relations Internationales et de Géopolitique',
  description:
    "Centre de recherche fondé et présidé par Kevan Gafaïti, consacré à l’étude des relations internationales. L’IRIG et l’IPRIG sont deux structures distinctes : l’IRIG est un centre de recherche, l’IPRIG est une structure de préparation et d’accompagnement.",
  /** TODO CLIENT : URL du site de l’IRIG lorsqu’il sera en ligne. */
  url: null as string | null,
};
