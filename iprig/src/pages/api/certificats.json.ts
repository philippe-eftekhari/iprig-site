/**
 * ============================================================================
 *  /api/certificats.json — catalogue lisible par le serveur
 * ============================================================================
 *  Astro produit ce fichier au build à partir de `src/data/certificats.ts`.
 *  Il n'a qu'un seul usage : permettre à `public/api/preinscription.php` de
 *  vérifier que les certificats reçus du formulaire existent réellement.
 *
 *  Pourquoi passer par un fichier plutôt que recopier la liste en PHP :
 *  une liste recopiée diverge. Ici, ajouter un certificat dans le fichier de
 *  données met à jour d'un seul coup la page, les cases du formulaire ET la
 *  validation serveur — il n'existe aucun endroit où les oublier.
 *
 *  Le contenu n'est pas confidentiel : c'est exactement ce que la page
 *  /certificats affiche déjà.
 * ============================================================================
 */
import type { APIRoute } from 'astro';
import { certificates, teachers } from '../../data/certificats';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      certificates: certificates.map((c) => ({
        id: c.id,
        title: c.title,
        teacher: teachers.find((t) => t.id === c.teacherId)?.name ?? null,
        registrationStatus: c.registrationStatus,
      })),
    }),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    },
  );
