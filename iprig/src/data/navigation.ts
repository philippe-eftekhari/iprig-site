/**
 * Navigation du site — source unique.
 * Modifier ici change simultanément le menu desktop, le menu mobile et le footer.
 *
 * Garder ce menu court : six entrées maximum, CTA compris.
 */

export type NavItem = {
  label: string;
  /** Ancre (`#section`) sur la page d’accueil, ou chemin absolu (`/programme`). */
  href: string;
  /** Description affichée uniquement dans le menu mobile. */
  description?: string;
};

/** Navigation principale, dans l’ordre d’apparition sur la landing page. */
export const mainNav: NavItem[] = [
  {
    label: "L’institut",
    href: '/#institut',
    description: "Ce qu’est l’IPRIG et ce qu’il apporte",
  },
  {
    label: 'Programme',
    href: '/programme',
    description: 'Sessions, événements, immersion, rediffusions',
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
