/**
 * ============================================================================
 *  FOIRE AUX QUESTIONS
 * ============================================================================
 *  Ajouter, retirer ou réordonner une question ici suffit : la page se met
 *  à jour automatiquement.
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

export const faq: FaqItem[] = [
  {
    question: "À qui s’adresse l’IPRIG ?",
    answer: [
      "Principalement aux étudiants de licence et de master en relations internationales, en science politique et en géopolitique, ainsi qu’à celles et ceux qui souhaitent s’orienter vers ces secteurs.",
      "Les lycéens qui réfléchissent à leurs études et les personnes fortement intéressées par ces sujets y trouvent également leur place. Aucun prérequis n’est exigé.",
    ],
  },
  {
    question: "Combien coûte l’IPRIG ?",
    answer: [
      // TODO CLIENT : formulation tarifaire à valider — voir `offer.priceDetail`
      // dans site.ts. On n'énonce ici que le montant payé par le membre.
      "L’adhésion revient à 29 € par mois. Le paiement est géré par Patreon ; il n’y a rien à régler sur ce site.",
      "Il n’existe qu’une seule formule : tous les membres ont accès à la même chose.",
    ],
  },
  {
    question: 'Y a-t-il un engagement ?',
    answer: [
      "Non. Vous rejoignez l’IPRIG quand vous le souhaitez, vous restez le temps que vous voulez, et vous vous désabonnez quand vous le décidez, directement depuis votre compte Patreon.",
    ],
  },
  {
    question: "Comment rejoindre l’IPRIG ?",
    answer: [
      "L’adhésion se fait sur Patreon, qui gère l’abonnement et les paiements. Il n’y a aucun compte à créer sur ce site.",
      "Une fois abonné, vous intégrez la communauté et recevez les communications réservées aux membres.",
    ],
  },
  {
    question: 'Où sont disponibles les contenus ?',
    answer: [
      "Les contenus réservés aux membres sont accessibles depuis votre espace Patreon. Les sessions peuvent notamment y être consultées en rediffusion : une séance manquée n’est pas une séance perdue.",
    ],
  },
  {
    question: 'Comment suis-je informé des événements ?',
    answer: [
      "Les opportunités et les événements sont communiqués aux membres au fur et à mesure qu’ils se présentent, via les canaux réservés à la communauté.",
    ],
  },
  {
    question: 'Les événements sont-ils toujours garantis ?',
    answer: [
      "Non, et il est plus honnête de le dire. Les événements dépendent des institutions, des intervenants et des créneaux disponibles : ils sont proposés lorsqu’ils se présentent, sans qu’aucun événement particulier puisse être promis à l’avance.",
      "L’accompagnement, les sessions et les rediffusions, eux, constituent le socle permanent de l’adhésion.",
    ],
  },
  {
    question: "L’IPRIG délivre-t-il un diplôme ou une certification ?",
    answer: [
      "Non. L’IPRIG est une structure d’accompagnement et de préparation. Elle ne délivre ni diplôme, ni certification reconnue par l’État, et ne se substitue pas à une formation universitaire.",
    ],
  },
];
