/**
 * ============================================================================
 *  IPRIG — CONTENU CENTRALISÉ
 * ============================================================================
 *  C’est LE fichier à modifier pour changer les textes, le prix et les liens
 *  du site. Aucune de ces valeurs n’est écrite en dur ailleurs.
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

  /**
   * Dénomination complète. Utilisée dans le hero, le footer et le JSON-LD.
   * Capitalisation validée par le client : Institut, Préparation, Relations,
   * Internationales, Géopolitique.
   */
  fullName:
    'Institut de Préparation aux Relations Internationales et à la Géopolitique',

  /** URL canonique de production. Doit rester synchronisée avec astro.config.mjs. */
  url: 'https://iprig.fr',

  /** Langue du site. */
  lang: 'fr',

  /** Accroche affichée sous le nom dans le hero. Sans point final. */
  tagline: 'Votre partenaire pour votre carrière en géopolitique',

  /**
   * Phrase de présentation courte (hero + meta description de base).
   * Doit rester factuelle : ce que fait l’IPRIG, pour qui.
   */
  intro:
    "L’IPRIG accompagne les étudiants et les jeunes professionnels en relations internationales et géopolitique : sessions de méthodologie et de suivi, conférences, séminaires professionnels, visites d’institutions, immersion dans le milieu professionnel et accès à un réseau dédié.",

  /** Métadonnées SEO par défaut (surchargeables page par page). */
  seo: {
    defaultTitle:
      'IPRIG – Préparation Relations internationales et géopolitique',
    titleTemplate: '%s | IPRIG',
    description:
      "L’IPRIG accompagne les étudiants et les jeunes professionnels en relations internationales et géopolitique : sessions de méthodologie, événements, immersion dans le milieu professionnel et réseau dédié.",
    /**
     * Image de partage social (1200 × 630).
     * Générée par `npm run og` ; le PNG est obligatoire, les réseaux sociaux
     * n’affichent pas les SVG.
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
   * Précision affichée en petit sous le tarif, sur l’affiche de clôture.
   *
   * ⚠ TODO CLIENT — MENTION TARIFAIRE OPPOSABLE, À VALIDER MOT POUR MOT.
   *
   * La V2 affichait ici « 28,80 € + TVA applicable, soit environ 29 € par
   * mois ». Cette phrase est mathématiquement incohérente. Le rapport exact
   * entre 28,80 € et 29 € (HT / TTC, TVA applicable ou non, commission
   * Patreon) n’a jamais été confirmé par le client.
   *
   * En attendant cette confirmation, on n’énonce que ce qui est certain :
   * le montant payé par le visiteur et l’endroit où il est prélevé.
   */
  priceDetail:
    "Abonnement mensuel géré par Patreon · Aucun paiement n’est effectué sur ce site",

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
/*  3. AFFICHAGE DES EMPLACEMENTS PHOTO                                       */
/* -------------------------------------------------------------------------- */

/**
 * Affiche la mention « photographie à venir » sous les emplacements d’image
 * encore vides. Depuis la V4, tous les emplacements du site portent une
 * photographie réelle : la mention n’a plus lieu d’être.
 *
 * Repasser à `true` seulement si un nouvel emplacement vide est ajouté et
 * qu’on souhaite le signaler pendant la phase de préparation.
 */
export const showPendingMediaLabels = false;

/* -------------------------------------------------------------------------- */
/*  4. LIENS SOCIAUX — SOURCE UNIQUE                                          */
/* -------------------------------------------------------------------------- */

/**
 * Identifiants de plateforme. Chaque `id` a une icône correspondante dans
 * `src/components/SocialLinks.astro` : ajouter une plateforme ici suppose
 * d’y ajouter son icône.
 */
export type SocialId =
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'twitch'
  | 'linkedin'
  | 'spotify'
  | 'applePodcasts';

export type SocialLink = {
  id: SocialId;
  label: string;
  /** `null` = URL non fournie : le lien est automatiquement masqué. */
  url: string | null;
};

/**
 * Comptes de la marque KevanExplique — URL fournies et vérifiées par le client.
 *
 * Depuis la V4.1, les **sept** plateformes sont en ligne : l’adresse Apple
 * Podcasts, seule manquante en V4.0, a été communiquée le 01/09/2026.
 * `pendingSocialLinks` est donc vide, et les blocs qui l’affichent ne rendent
 * plus rien — le mécanisme reste en place pour une plateforme future.
 *
 * ⚠ Ne JAMAIS écrire `href="#"` ni inventer une adresse : une plateforme sans
 * URL reste `null` et disparaît du site.
 *
 * Les adresses Spotify et LinkedIn sont conservées sous leur forme canonique :
 * même émission et même profil que les liens transmis par le client, sans les
 * paramètres de session (`?si=`, `&nd=`) ni les accents non encodés.
 */
export const socialLinks: SocialLink[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/kevanexplique/',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    url: 'https://www.youtube.com/channel/UCPwkkIM9F2RaG37pobWw9Wg',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    url: 'https://www.tiktok.com/@kevanexplique',
  },
  {
    id: 'twitch',
    label: 'Twitch',
    url: 'https://www.twitch.tv/kevanexplique',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/kevan-gafa%C3%AFti-3137927b/',
  },
  {
    id: 'spotify',
    label: 'Spotify',
    url: 'https://open.spotify.com/show/0346qxV2YP22NpjPkdXclj',
  },
  {
    id: 'applePodcasts',
    label: 'Apple Podcasts',
    url: 'https://podcasts.apple.com/podcast/id6801282142',
  },
];

/** Uniquement les plateformes réellement en ligne. */
export const activeSocialLinks = socialLinks.filter((s) => s.url !== null);

/** Plateformes annoncées mais dont l’adresse manque encore. */
export const pendingSocialLinks = socialLinks.filter((s) => s.url === null);

/* -------------------------------------------------------------------------- */
/*  4 bis. LIENS SOCIAUX DE L’IPRIG — À NE PAS CONFONDRE AVEC LES PRÉCÉDENTS   */
/* -------------------------------------------------------------------------- */

/**
 * Comptes officiels de l’INSTITUT, ouverts par le client et communiqués le
 * 02/09/2026 (V4.3.1).
 *
 * ⚠ Deux identités distinctes, deux listes distinctes. `socialLinks`
 * ci-dessus, ce sont les comptes de la marque de contenu KevanExplique ;
 * ici, ce sont ceux de l’IPRIG. Instagram et LinkedIn existent des deux
 * côtés avec des adresses différentes : ne jamais fusionner les deux
 * listes, ne jamais remplacer une URL de l’une par une URL de l’autre.
 *
 * L’adresse Instagram est sous sa forme CANONIQUE, comme les liens Spotify
 * et LinkedIn de KevanExplique plus haut. Le client avait d’abord transmis
 * une adresse de partage portant un paramètre de session (`?igsi=…`) ; il a
 * demandé sa forme canonique le 02/09/2026. Même compte, même destination,
 * sans le jeton de session — qui n’a rien à faire dans un lien publié.
 */
export const iprigSocialLinks: SocialLink[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/iprig.officiel/',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/company/iprig',
  },
];

/** Comptes de l’IPRIG réellement en ligne — seuls ceux-là sont rendus. */
export const activeIprigSocialLinks = iprigSocialLinks.filter((s) => s.url !== null);

/**
 * Invitation placée DEVANT le nom de la plateforme dans la section
 * « L’institut » : « Suivre l’IPRIG sur Instagram ».
 *
 * Formulation arrêtée par le client en V4.3.2, à reprendre mot pour mot :
 * ni « Suivez-nous », ni « Nos réseaux sociaux », ni « Instagram IPRIG ».
 * Le sigle reste en capitales, les noms de plateformes gardent leur casse
 * propre — « Instagram », « LinkedIn ».
 *
 * Le pied de page, lui, n’utilise PAS cette invitation : dans une colonne
 * intitulée « Rejoindre », le nom de la plateforme seul suffit.
 */
export const iprigSocialInvite = 'Suivre l’IPRIG sur';

/* -------------------------------------------------------------------------- */
/*  5. CONTACT                                                                */
/* -------------------------------------------------------------------------- */

/**
 * ⚠ AUCUNE ADRESSE E-MAIL N’EST PUBLIÉE SUR CE SITE.
 *
 * Les messages du formulaire de contact et les demandes de préinscription
 * partent vers une boîte dont l’adresse vit UNIQUEMENT côté serveur
 * (`public/api/config.php`, hors dépôt — voir `.env.example`). Elle n’apparaît
 * ni dans le HTML, ni dans le JavaScript, ni dans un attribut de données.
 *
 * Ne jamais réintroduire d’adresse ici : elle serait immédiatement récoltée.
 */
export const contact = {
  /** Point d’entrée des deux formulaires. */
  endpoints: {
    message: '/api/contact.php',
    preinscription: '/api/preinscription.php',
  },
  /** Délai indicatif de réponse, volontairement prudent. */
  responseNote:
    "Les demandes sont traitées dès que possible. Aucune réponse automatique n’est envoyée.",
} as const;

/* -------------------------------------------------------------------------- */
/*  6. MENTIONS LÉGALES                                                       */
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
