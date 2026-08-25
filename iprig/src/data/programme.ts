/**
 * ============================================================================
 *  PROGRAMME ET EXPÉRIENCE IPRIG
 * ============================================================================
 *  Deux blocs indépendants :
 *   1. `volets`   — les quatre formes que prend l’accompagnement (stable).
 *   2. `sessions` — le calendrier de séances (change chaque année).
 *
 *  Pour mettre à jour le programme, il suffit de réécrire le tableau
 *  `sessions` ci-dessous. Aucune page n’a besoin d’être retouchée.
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*  1. LES QUATRE VOLETS DE L’EXPÉRIENCE                                      */
/* -------------------------------------------------------------------------- */

export type Volet = {
  id: string;
  /** Numéro éditorial affiché en chiffre romain. */
  numeral: string;
  title: string;
  lede: string;
  points: string[];
};

export const volets: Volet[] = [
  {
    id: 'sessions',
    numeral: 'I',
    title: 'Sessions',
    lede: "Des séances régulières consacrées à la méthodologie universitaire et à la construction du parcours étudiant.",
    points: [
      'Méthodologie des exercices attendus dans le supérieur',
      'Préparation des échéances et des examens',
      'Construction du dossier et des candidatures',
      'Échanges directs et questions ouvertes',
    ],
  },
  {
    id: 'evenements',
    numeral: 'II',
    title: 'Événements',
    lede: "Des opportunités communiquées aux membres tout au long de l’année : conférences, rencontres, visites.",
    points: [
      'Conférences et colloques',
      'Rencontres avec des intervenants du secteur',
      'Visites et événements institutionnels',
      'Information transmise en priorité aux membres',
    ],
  },
  {
    id: 'immersion',
    numeral: 'III',
    title: 'Immersion',
    lede: "Une mise en contact progressive avec le milieu académique, diplomatique et institutionnel des relations internationales.",
    points: [
      'Découverte des métiers et des trajectoires réelles',
      'Repères sur les institutions et les milieux professionnels',
      "Compréhension des codes du secteur",
      'Réseau construit au fil des rencontres',
    ],
  },
  {
    id: 'rediffusions',
    numeral: 'IV',
    title: 'Rediffusions',
    lede: "Les contenus réservés aux membres restent accessibles : une séance manquée peut être rattrapée.",
    points: [
      'Sessions accessibles en rediffusion',
      'Contenus réservés aux membres',
      'Consultation à votre rythme',
      "Accès depuis l’espace membre Patreon",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  2. LES SESSIONS                                                           */
/* -------------------------------------------------------------------------- */

export type Session = {
  /** Intitulé de la séance. */
  title: string;
  /** Une phrase sur ce que la séance apporte concrètement. */
  summary: string;
  /** Famille de séance, utilisée comme étiquette éditoriale. */
  category: 'Méthodologie' | 'Parcours' | 'Orientation';
};

/**
 * TODO CLIENT : remplacer par le programme IPRIG 2026-2027 définitif.
 *
 * Les intitulés ci-dessous reprennent des exemples de séances évoqués lors du
 * brief. Ils sont affichés à titre indicatif et le site le signale
 * explicitement au visiteur (voir `programmeIsProvisional`).
 */
export const programmeIsProvisional = true;

export const programmeNote =
  "Les séances ci-dessous illustrent le type d’accompagnement proposé. Le programme complet de l’année est communiqué aux membres.";

export const sessions: Session[] = [
  {
    title: 'Méthodologie des exercices universitaires',
    summary:
      "Dissertation, commentaire, note de synthèse : les attentes réelles des correcteurs et la manière d’y répondre.",
    category: 'Méthodologie',
  },
  {
    title: 'Réussir un partiel le jour J',
    summary:
      "Gestion du temps, lecture du sujet, construction rapide d’un plan tenable et relecture efficace.",
    category: 'Méthodologie',
  },
  {
    title: 'Renforcer et valoriser ses centres d’intérêt en relations internationales',
    summary:
      'Transformer une curiosité personnelle en compétence lisible sur un dossier et en sujet de discussion en entretien.',
    category: 'Parcours',
  },
  {
    title: 'Préparer efficacement son dossier',
    summary:
      'Structurer une candidature, hiérarchiser ses expériences et écrire une lettre qui tient debout.',
    category: 'Parcours',
  },
  {
    title: 'Réfléchir et préparer une césure',
    summary:
      'Évaluer la pertinence d’une année de césure, en définir le contenu et anticiper le retour en formation.',
    category: 'Orientation',
  },
  {
    title: 'Méthodes et conseils pour construire son parcours',
    summary:
      "Choisir ses spécialisations, articuler licence, master et expériences, arbitrer entre les voies possibles.",
    category: 'Orientation',
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

export const fonctionnement: Etape[] = [
  {
    step: '01',
    title: 'Vous rejoignez',
    text: "L’adhésion se fait sur Patreon, qui gère l’abonnement et les paiements. Aucun compte à créer sur ce site.",
  },
  {
    step: '02',
    title: 'Vous devenez membre',
    text: "Vous intégrez la communauté IPRIG et recevez les communications sur les séances et les opportunités à venir.",
  },
  {
    step: '03',
    title: 'Vous participez',
    text: "Vous suivez les sessions, accédez aux contenus réservés et aux rediffusions, et profitez des événements proposés.",
  },
];

/* -------------------------------------------------------------------------- */
/*  4. CERTIFICATS — NON DISPONIBLES                                          */
/* -------------------------------------------------------------------------- */

/**
 * Des formations spécialisées sont envisagées à partir de 2027.
 * Elles ne font PAS partie de l’offre actuelle et ne doivent jamais être
 * présentées comme disponibles, ni comme une certification reconnue.
 *
 * Passer à `true` uniquement lorsque l’offre existe réellement ET que son
 * statut exact (certifiante ou non) a été validé par le client.
 */
export const certificatsDisponibles = false;
