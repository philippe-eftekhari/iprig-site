/**
 * Navigation du site — source unique.
 * Modifier ici change simultanément le menu desktop, le menu mobile, le pied
 * de page et la liste de secours de la page 404.
 *
 * L’ordre ci-dessous est celui validé par le client en V4 : il suit le
 * parcours de lecture (ce qu’est l’IPRIG → ce qu’il propose → les certificats
 * → qui l’anime → les questions → écrire).
 */

export type NavItem = {
  label: string;
  /** Ancre (`#section`) sur la page d’accueil, ou chemin absolu (`/programme`). */
  href: string;
  /** Description affichée uniquement dans le menu mobile. */
  description?: string;
};

/** Navigation principale, dans l’ordre validé. */
export const mainNav: NavItem[] = [
  {
    label: 'Institut',
    href: '/#institut',
    description: "Ce qu’est l’IPRIG et ce qu’il apporte",
  },
  {
    label: 'Programme',
    href: '/programme',
    description: 'Événements, immersion, sessions, rediffusion',
  },
  {
    label: 'Certificats',
    href: '/certificats',
    description: 'Certificats semestriels de géopolitique',
  },
  {
    label: 'Kevan Gafaïti',
    href: '/kevan-gafaiti',
    description: "Le fondateur de l’IPRIG",
  },
  {
    label: 'Questions',
    href: '/#faq',
    description: 'Tarif, engagement, fonctionnement',
  },
  {
    label: 'Contact',
    href: '/contact',
    description: "Écrire à l’IPRIG",
  },
];

/** Liens institutionnels du pied de page. */
export const footerNav: NavItem[] = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Politique de confidentialité', href: '/politique-confidentialite' },
];
