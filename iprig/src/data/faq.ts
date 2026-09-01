/**
 * ============================================================================
 *  FOIRE AUX QUESTIONS — SOURCE UNIQUE
 * ============================================================================
 *  Ce tableau alimente EXACTEMENT les deux endroits où la FAQ apparaît :
 *  la section « Questions » de la page d’accueil et son ancre `/#faq`.
 *  Il ne doit exister aucune seconde version de ces réponses ailleurs.
 *
 *  Règle de rédaction : répondre précisément, sans promettre ce qui ne peut
 *  pas être garanti. Une réponse prudente vaut mieux qu’une réclamation.
 * ============================================================================
 */

export type FaqItem = {
  question: string;
  /** Chaque entrée du tableau devient un paragraphe. */
  answer: string[];
};

/** Titre et chapô de la section, communs à tous les emplacements. */
export const faqHeading = {
  title: 'Les réponses aux questions que vous vous posez',
  /** Sans point final : c’est un sous-texte, pas un paragraphe. */
  lede: 'Une réponse manque ? La page Contact indique par où passer',
};

export const faq: FaqItem[] = [
  {
    question: "À qui s’adresse l’IPRIG ?",
    answer: [
      "Notamment aux étudiants de licence et de master en relations internationales, sciences politiques et géopolitique, ainsi qu’à celles et ceux qui souhaitent s’orienter vers ces secteurs.",
    ],
  },
  {
    question: "Combien coûte l’IPRIG ?",
    answer: [
      "L’adhésion revient à 29 € par mois. Le paiement est géré par Patreon, il n’y a rien à régler sur ce site.",
      "Il n’existe qu’une seule formule : celle-ci donne accès à l’intégralité de la prépa.",
    ],
  },
  {
    question: 'Y a-t-il un engagement ?',
    answer: [
      "Non. Vous rejoignez l’IPRIG quand vous le souhaitez, vous restez le temps que vous voulez et vous vous désabonnez quand vous le décidez directement depuis votre compte Patreon.",
    ],
  },
  {
    question: "Comment rejoindre l’IPRIG ?",
    answer: [
      "L’adhésion se fait sur Patreon. Il n’y a aucun paiement sur ce site. Vous vous abonnez, vous intégrez la communauté et recevez les communications réservées aux membres.",
    ],
  },
  {
    question: 'Où sont disponibles les contenus ?',
    answer: [
      "Les contenus réservés aux membres sont accessibles depuis votre espace Patreon et peuvent notamment y être consultés en rediffusion. Une séance manquée n’est pas une séance perdue.",
    ],
  },
  {
    question: 'Comment suis-je informé des événements ?',
    answer: [
      "Les opportunités sont communiquées aux membres au fur et à mesure qu’elles se présentent, via les canaux réservés à la communauté.",
    ],
  },
  {
    question: 'Des événements sont-ils proposés chaque semaine ?',
    answer: [
      "Oui. Chaque semaine, différents événements et opportunités sont proposés ou communiqués aux membres de l’IPRIG.",
    ],
  },
  {
    question: "L’IPRIG délivre-t-il un diplôme ou une certification ?",
    answer: [
      "Non. L’IPRIG est une structure d’accompagnement et de préparation. Il ne délivre ni diplôme ni certification reconnue par l’État et ne se substitue pas à une formation universitaire.",
    ],
  },
];
