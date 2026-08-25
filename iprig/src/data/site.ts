/**
 * ============================================================================
 *  IPRIG — CONTENU CENTRALISÉ
 * ============================================================================
 *  C’est LE fichier à modifier pour changer les textes, le prix, les liens
 *  et les chiffres du site. Aucune de ces valeurs n’est écrite en dur ailleurs.
 *
 *  Les marqueurs `TODO CLIENT` signalent une information à faire valider ou
 *  à fournir par Kevan avant la mise en ligne. Voir CONTENT_TODO.md.
 *
 *  RÈGLE ABSOLUE : ne jamais remplacer un `null` par une valeur inventée.
 *  Un champ `null` masque proprement l’élément concerné sur le site.
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*  1. IDENTITÉ                                                               */
/* -------------------------------------------------------------------------- */

export const site = {
  /** Sigle affiché partout (wordmark, navigation, footer). */
  name: 'IPRIG',

  /** Dénomination complète. Utilisée dans le hero, le footer et le JSON-LD. */
  fullName:
    'Institut de préparation aux relations internationales et à la géopolitique',

  /** URL canonique de production. Doit rester synchronisée avec astro.config.mjs. */
  url: 'https://iprig.fr',

  /** Langue du site. */
  lang: 'fr',

  /**
   * Slogan affiché sous le nom dans le hero.
   * TODO CLIENT : slogan définitif — celui-ci est provisoire.
   */
  tagline: 'Votre partenaire pour votre carrière en géopolitique.',

  /**
   * Phrase de présentation courte (hero + meta description de base).
   * Doit rester factuelle : ce que fait l’IPRIG, pour qui.
   */
  intro:
    "L’IPRIG accompagne les étudiants et les passionnés de relations internationales et de géopolitique : sessions de méthodologie, événements, immersion dans le milieu professionnel et accès à un réseau dédié.",

  /** Métadonnées SEO par défaut (surchargeables page par page). */
  seo: {
    defaultTitle:
      'IPRIG | Préparation aux relations internationales et à la géopolitique',
    titleTemplate: '%s | IPRIG',
    description:
      "L’IPRIG accompagne étudiants et passionnés de relations internationales et de géopolitique à travers des sessions, des événements, des conseils et un réseau dédié.",
    /**
     * Image de partage social (1200 × 630).
     * Générée par `npm run og` ; le PNG est obligatoire, les réseaux sociaux
     * n’affichent pas les SVG.
     * TODO CLIENT : remplacer par un visuel définitif une fois le logo et les
     * photos disponibles — déposer le fichier en `public/og-image.png`.
     */
    ogImage: '/og-image.png',
    ogImageType: 'image/png',
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  2. OFFRE ET CONVERSION                                                    */
/* -------------------------------------------------------------------------- */

export const offer = {
  /**
   * Destination de TOUS les boutons d’inscription du site.
   * Une seule ligne à changer si l’adresse Patreon évolue.
   */
  patreonUrl: 'https://www.patreon.com/KevanExplique',

  /** Prix affiché au visiteur, arrondi. */
  priceDisplay: '29 €',
  pricePeriod: '/ mois',

  /**
   * Précision affichée en petit sous le tarif, sur l'affiche de clôture.
   *
   * ⚠ TODO CLIENT — MENTION TARIFAIRE OPPOSABLE, À VALIDER MOT POUR MOT.
   *
   * La V2 affichait ici « 28,80 € + TVA applicable, soit environ 29 € par
   * mois ». Cette phrase est mathématiquement incohérente : 28,80 € majorés
   * de la TVA ne font pas 29 €. Le rapport exact entre 28,80 € et 29 €
   * (HT / TTC, TVA applicable ou non, commission Patreon) n'a jamais été
   * confirmé par le client.
   *
   * En attendant cette confirmation, on n'énonce que ce qui est certain :
   * le montant payé par le visiteur et l'endroit où il est prélevé. Dès que
   * la formulation exacte sera validée, elle se substitue ici et nulle part
   * ailleurs — le reste du site lit `priceDisplay` et `pricePeriod`.
   */
  priceDetail:
    "Abonnement mensuel géré par Patreon. Aucun paiement n'est effectué sur ce site.",

  /** Argument d’engagement — repris tel quel partout. */
  commitment: 'Sans engagement',
  commitmentDetail:
    "Vous rejoignez l’IPRIG quand vous le souhaitez, vous restez le temps que vous voulez, vous vous désabonnez quand vous le décidez.",

  /**
   * Libellés de boutons. Ne pas multiplier les formulations :
   * le CTA principal reste identique sur tout le site.
   */
  ctaPrimary: "Rejoindre l’IPRIG",
  ctaPrimaryLong: "Rejoindre l’IPRIG sur Patreon",
  ctaSecondary: 'Découvrir la prépa',
  ctaProgramme: 'Voir le programme',
} as const;

/* -------------------------------------------------------------------------- */
/*  3. CHIFFRES                                                               */
/* -------------------------------------------------------------------------- */

export type Stat = {
  value: string;
  label: string;
  note?: string;
};

/**
 * TODO CLIENT : valider ces chiffres avant la mise en production.
 * Retirer une entrée de ce tableau la fait disparaître du site sans rien casser.
 * Ne jamais ajouter de taux de réussite, de nombre d’admissions ou de note
 * de satisfaction : ces données n’ont pas été communiquées.
 */
export const stats: Stat[] = [
  {
    value: 'Plusieurs centaines',
    label: "d’étudiants accompagnés",
  },
  {
    value: '≈ 40',
    label: 'séances par an',
  },
  {
    value: '≈ 50',
    label: 'événements organisés',
    note: "au cours de l’année précédente",
  },
];

/* -------------------------------------------------------------------------- */
/*  3 bis. AFFICHAGE DES EMPLACEMENTS PHOTO                                   */
/* -------------------------------------------------------------------------- */

/**
 * Affiche la mention « photographie à venir » sous les emplacements d'image
 * encore vides.
 *
 * Passer à `false` juste avant la mise en production : les mentions
 * disparaissent partout, sans aucun changement de mise en page.
 */
export const showPendingMediaLabels = true;

/**
 * Taille de la communauté Kevan Explique, tous réseaux confondus.
 * TODO CLIENT : vérifier le nombre actuel avant la mise en ligne.
 * Passer à `null` pour masquer entièrement la mention.
 */
export const communitySize: string | null = '≈ 75 000';
export const communitySizeLabel = 'personnes suivent Kevan Explique';

/* -------------------------------------------------------------------------- */
/*  4. CONTACT ET RÉSEAUX                                                     */
/* -------------------------------------------------------------------------- */

export type ExternalLink = {
  label: string;
  /** `null` = lien non fourni : il est automatiquement masqué sur le site. */
  url: string | null;
  /** Précision affichée sous le lien sur la page contact. */
  hint?: string;
};

/**
 * TODO CLIENT : fournir les adresses réelles.
 * Ne JAMAIS inventer une adresse e-mail ni une URL de compte social :
 * un lien mort ou un compte inexistant décrédibilise immédiatement le site.
 */
export const contact = {
  /** Adresse e-mail officielle de l’IPRIG. `null` tant qu’elle n’est pas confirmée. */
  email: null as string | null, // TODO CLIENT : e-mail officiel IPRIG

  /** Canal de contact disponible aujourd’hui, en attendant l’e-mail officiel. */
  fallbackNote:
    "En attendant la mise en place d’une adresse dédiée, les échanges avec l’IPRIG passent par Patreon.",
};

/** Comptes officiels de l’IPRIG. */
export const socialsIprig: ExternalLink[] = [
  { label: 'Instagram', url: null }, // TODO CLIENT : URL Instagram IPRIG
  { label: 'LinkedIn', url: null }, // TODO CLIENT : URL LinkedIn IPRIG
];

/** Comptes de la marque Kevan Explique. */
export const socialsKevanExplique: ExternalLink[] = [
  { label: 'Instagram', url: 'https://www.instagram.com/kevanexplique/' },
  { label: 'TikTok', url: null }, // TODO CLIENT : URL TikTok Kevan Explique
  { label: 'YouTube', url: null }, // TODO CLIENT : URL YouTube Kevan Explique
  { label: 'Podcast', url: null }, // TODO CLIENT : URL du podcast
];

/** Vrai si au moins un lien social réel est renseigné. */
export const hasAnySocial = [...socialsIprig, ...socialsKevanExplique].some(
  (s) => s.url !== null,
);

/* -------------------------------------------------------------------------- */
/*  5. MENTIONS LÉGALES                                                       */
/* -------------------------------------------------------------------------- */

/**
 * TODO CLIENT : informations légales complètes (éditeur, statut juridique,
 * adresse, directeur de publication, hébergeur). Tant que ces champs sont
 * `null`, les pages légales affichent une mention « en cours de finalisation »
 * plutôt qu’une information inventée.
 */
export const legal = {
  editor: null as string | null,
  legalForm: null as string | null,
  address: null as string | null,
  publicationDirector: null as string | null,
  siret: null as string | null,
  /** Hébergeur : connu, puisque le déploiement est prévu chez Hostinger. */
  host: {
    name: 'Hostinger International Ltd.',
    address: '61 Lordou Vironos Street, 6023 Larnaca, Chypre',
    url: 'https://www.hostinger.fr',
  },
  /** Année affichée dans le copyright du footer. */
  copyrightYear: 2026,
};
