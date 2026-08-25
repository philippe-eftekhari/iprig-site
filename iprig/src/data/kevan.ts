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
 *  Orthographe à respecter partout : « Kevan Gafaïti » (avec le tréma).
 * ============================================================================
 */

export const kevan = {
  name: 'Kevan Gafaïti',

  /** Fonction principale affichée sous le nom. */
  role: "Fondateur de l’IPRIG",

  /** Fonctions secondaires, affichées en liste. */
  titles: [
    'Enseignant à Sciences Po Paris',
    "Président-fondateur de l’IRIG, Institut des relations internationales et géopolitiques",
  ],

  /** Accroche courte, utilisée sur la landing page. */
  lede: "Enseignant et chercheur en relations internationales, Kevan Gafaïti consacre ses travaux à la géopolitique du Moyen-Orient, avec une expertise particulière sur l’Iran et sa stratégie d’influence.",

  /** Biographie développée — utilisée sur la page /kevan-gafaiti. */
  bio: [
    "Kevan Gafaïti enseigne à Sciences Po Paris. Il a également enseigné dans plusieurs autres établissements, parmi lesquels l’Université Paris-Panthéon-Assas, la Sorbonne et l’INALCO.",
    "Il est président-fondateur de l’IRIG, Institut des relations internationales et géopolitiques, et intervient dans des conférences et colloques en France et à l’étranger.",
    "Ses travaux, articles et ouvrages portent sur les relations internationales et la géopolitique, avec une attention particulière à la région du Moyen-Orient et à la stratégie d’influence iranienne.",
  ],

  /** Établissements d’enseignement mentionnés par le client. */
  institutions: [
    'Sciences Po Paris',
    'Université Paris-Panthéon-Assas',
    'Sorbonne',
    'INALCO',
  ],

  /** Parcours académique. */
  academic: {
    doctorate: {
      label: 'Doctorat en science politique et relations internationales',
      institution: 'Université Paris-Panthéon-Assas',
      /** Sujet tel que décrit par le client. */
      subject:
        "La France face à la politique étrangère de l’Iran, 1995-2022 : rivalités d’influence au Moyen-Orient, programme nucléaire iranien et sécurité dans le Golfe persique.",
    },
    /** TODO CLIENT : confirmer les intitulés exacts des trois Master 2. */
    masters: {
      count: 3,
      label: 'Trois Master 2',
      fields: ['Droit', 'Histoire', 'Relations internationales'],
    },
  },

  /** Domaines de recherche. */
  researchAreas: [
    'Géopolitique du Moyen-Orient',
    "Stratégie d’influence de l’Iran",
    'Relations internationales',
    'Sécurité dans le Golfe persique',
  ],
};

/* -------------------------------------------------------------------------- */
/*  KEVAN EXPLIQUE                                                            */
/* -------------------------------------------------------------------------- */

export const kevanExplique = {
  name: 'Kevan Explique',
  lede: "En parallèle de ses activités d’enseignement et de recherche, Kevan Gafaïti diffuse des analyses de géopolitique et de relations internationales auprès d’une audience large, sur les réseaux sociaux et en podcast.",
  /**
   * Plateformes citées par le client. Les URL sont centralisées dans
   * `site.ts` (`socialsKevanExplique`) et restent `null` tant qu’elles ne sont
   * pas fournies : aucune plateforme n’est affichée comme un lien mort.
   */
  platforms: ['Instagram', 'TikTok', 'YouTube', 'Podcast'],
};

/* -------------------------------------------------------------------------- */
/*  L’ÉCOSYSTÈME                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Mention sobre de l’IRIG sur le site IPRIG.
 * ⚠ IPRIG et IRIG sont deux entités distinctes :
 *   — IPRIG : la préparation, objet de ce site ;
 *   — IRIG  : l’institut de recherche, qui aura son propre site.
 * Ne jamais confondre les deux sigles.
 */
export const irig = {
  name: 'IRIG',
  fullName: 'Institut des relations internationales et géopolitiques',
  description:
    "Centre de recherche présidé et fondé par Kevan Gafaïti, consacré à l’étude des relations internationales et de la géopolitique.",
  /** TODO CLIENT : URL du site de l’IRIG lorsqu’il sera en ligne. */
  url: null as string | null,
};
