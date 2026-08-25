/**
 * ============================================================================
 *  TÉMOIGNAGES
 * ============================================================================
 *  ⚠ RÈGLE ABSOLUE : aucun témoignage inventé, jamais — pas même « pour voir
 *  le rendu ». Un faux témoignage signé d’un prénom plausible finit en
 *  production et engage la crédibilité de l’institut.
 *
 *  Tant que ce tableau est vide, la section « Témoignages » n’apparaît pas
 *  sur le site. Elle s’affiche automatiquement dès qu’un témoignage réel est
 *  ajouté ici — aucune modification de code n’est nécessaire.
 *
 *  TODO CLIENT : 3 à 6 témoignages réels d’étudiants, avec leur accord écrit
 *  pour la publication (prénom, formation, année).
 * ============================================================================
 */

export type Temoignage = {
  /** Prénom seul, ou prénom + initiale. */
  prenom: string;
  /** Formation suivie au moment du témoignage. */
  formation: string;
  /** Année de la promotion ou de l’accompagnement. */
  annee: string;
  /** Le témoignage, tel qu’il a été transmis. Ne pas le réécrire. */
  texte: string;
  /**
   * Chemin d’une photo dans `src/assets/images/`, ou `null`.
   * Une photo n’est jamais obligatoire.
   */
  photo?: string | null;
};

/**
 * Ajouter ici les témoignages réels reçus. Exemple de format à respecter :
 *
 *   {
 *     prenom: 'Prénom',
 *     formation: 'Master 1 Relations internationales',
 *     annee: '2026',
 *     texte: 'Le texte exact transmis par l’étudiant.',
 *     photo: null,
 *   },
 */
export const temoignages: Temoignage[] = [];

/** La section ne s’affiche que s’il existe au moins un témoignage réel. */
export const hasTemoignages = temoignages.length > 0;
