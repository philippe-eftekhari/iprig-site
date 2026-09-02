---
name: iprig-quality-gate
description: Audit qualité complet du site iprig.fr avant toute livraison ou mise en ligne — marque, conversion, intégrité du contenu, UX mobile, accessibilité, performance et SEO. À utiliser après chaque modification significative du site IPRIG, et systématiquement avant un déploiement chez Hostinger.
---

# IPRIG Quality Gate

Le site engage la crédibilité académique d'une personne réelle. Une erreur de
contenu y coûte plus cher qu'un défaut d'alignement.

## When to use

- Avant toute mise en ligne ou mise à jour de `iprig.fr`.
- Après l'ajout d'une section, d'une page ou d'un contenu fourni par le client.
- Après l'intégration des photos, du logo, du programme définitif ou des
  témoignages.
- En audit ponctuel, quand on veut savoir où en est le site.

## When NOT to use

- Pour un autre projet de l'écosystème (IRIG, revue) : ce skill est spécifique
  à l'IPRIG.
- Pendant l'exploration ou le prototypage d'une idée non destinée à être
  livrée.

## Comment procéder

Exécuter les sept blocs ci-dessous **dans l'ordre**. Le bloc CONTENU est
bloquant : un seul manquement y interdit la mise en ligne, quel que soit le
reste. Terminer par un rapport listant, pour chaque bloc, ce qui passe et ce
qui ne passe pas.

Outils utiles s'ils sont disponibles : `npm run build` (le build doit passer),
`node scripts/qa-screenshots.mjs` (captures + contrôles automatiques),
`fixing-accessibility`, `fixing-motion-performance`, `responsive-web-qa`,
`technical-seo`, `web-performance`, `content-integrity`.

---

## 1. CONTENU — bloquant

Le point le plus important. Vérifier ligne à ligne.

- [ ] Aucun **témoignage** inventé. `src/data/temoignages.ts` ne contient que
      des témoignages réellement transmis, ou reste vide (la section disparaît
      alors automatiquement).
- [ ] Aucun **chiffre** non validé. Tous les chiffres viennent de
      `src/data/site.ts` (`stats`, `communitySize`) et portent leur
      `TODO CLIENT` tant qu'ils ne sont pas confirmés.
- [ ] Aucun **taux de réussite**, nombre d'admissions ou note de satisfaction :
      ces données n'ont jamais été communiquées.
- [ ] Aucune **publication, distinction, poste ou établissement** ajouté à la
      biographie de Kevan Gafaïti au-delà de ce que contient
      `src/data/kevan.ts`.
- [ ] Aucun **événement daté ou nommé** présenté comme confirmé. Les événements
      sont décrits comme des opportunités communiquées aux membres, jamais
      comme des garanties.
- [ ] Aucune **certification** présentée comme disponible.
      `certificatsDisponibles` reste `false` tant que l'offre n'existe pas et
      que son statut exact n'est pas validé.
- [ ] Aucune **adresse e-mail, URL de compte social ou coordonnée** inventée.
      Les champs `null` doivent le rester tant que le client n'a rien fourni.
- [ ] Aucun **logo ou nom de partenaire** affiché sans autorisation d'usage.
- [ ] Aucune **photo** de Kevan Gafaïti dont les droits ne sont pas établis, et
      aucune image générée le représentant.
- [ ] Le **programme** est signalé comme indicatif tant que
      `programmeIsProvisional` vaut `true`.
- [ ] Le **JSON-LD** (`src/components/Seo.astro`) ne déclare que des
      informations réelles et visibles sur la page. Aucun `AggregateRating`,
      `Review`, `Course`, prix promotionnel, adresse ou identifiant légal
      inventé.
- [ ] Chaque zone incomplète porte un `TODO CLIENT` explicite et lisible.
- [ ] `CONTENT_TODO.md` est à jour et reflète l'état réel des manques.

---

## 2. MARQUE

- [ ] « IPRIG » correctement écrit partout, en majuscules.
- [ ] **Aucune confusion IPRIG / IRIG.** Les deux sigles ne diffèrent que d'une
      lettre : relire chaque occurrence. L'IPRIG prépare, l'IRIG cherche.
- [ ] « Kevan Gafaïti » : un seul « n », tréma sur le « i ».
- [ ] « KevanExplique » orthographié tel quel.
- [ ] Identité **bleu profond / vert institutionnel** cohérente ; les couleurs
      viennent toutes des tokens de `src/styles/global.css`, aucune valeur
      hexadécimale isolée dans un composant.
- [ ] Rendu **institutionnel et éditorial**, pas startup SaaS : pas de grands
      dégradés violets, pas de glassmorphism, pas de cartes arrondies partout,
      pas d'emojis décoratifs, pas d'illustrations technologiques génériques,
      pas de grosses ombres portées.
- [ ] Typographie : serif éditoriale pour les titres, sans-serif pour le corps.
      Aucune des polices par défaut des générateurs (Inter, Roboto, Poppins,
      Montserrat, Arial).
- [ ] Le wordmark temporaire a l'air intentionnel. S'il a été remplacé, le
      logo définitif est bien en place dans `src/assets/brand/`.

---

## 3. CONVERSION

- [ ] Le CTA **« Rejoindre l'IPRIG »** est visible dans l'en-tête sur desktop
      et sur mobile dès que la largeur le permet.
- [ ] Un premier bloc de conversion fort arrive **tôt**, dès que le visiteur a
      compris ce qu'est l'IPRIG, ce qu'il apporte et comment il fonctionne.
- [ ] Un second bloc de conversion clôt la page.
- [ ] **Tous** les CTA principaux pointent vers `offer.patreonUrl` — aucune URL
      Patreon écrite en dur ailleurs que dans `src/data/site.ts`.
- [ ] Tous les liens externes portent `target="_blank"` **et**
      `rel="noopener noreferrer"`, avec une mention « nouvelle fenêtre » pour
      les lecteurs d'écran.
- [ ] Le **prix** (29 € / mois) est visible sans avoir à chercher, dès le hero.
- [ ] **« Sans engagement »** est explicite, et expliqué au moins une fois.
- [ ] La proposition de valeur est compréhensible en moins de cinq secondes en
      haut de page.
- [ ] Une seule formulation de CTA principal — pas dix variantes.

---

## 3 bis. MOTION ET COMPOSITION — anti-gabarit

Un système de design qui devient visible produit un sentiment de « généré ».
Ces points sont ceux qui, en V1, faisaient encore template.

- [ ] **Quatre comportements de motion, pas plus** : `title`, `rule`, `media`,
      `soft`. Aucun cinquième geste, aucune librairie d'animation.
- [ ] **Les paragraphes courants ne s'animent pas.** Les listes ne s'animent
      pas élément par élément. Pas de `stagger` sur la FAQ, les séances, les
      chiffres ou les apports.
- [ ] Une quinzaine d'éléments animés sur la page d'accueil, pas quarante.
- [ ] ⚠ **Aucun `data-motion="media"` posé sur l'élément masqué lui-même.**
      Un élément entièrement caché par `clip-path` a une aire d'intersection
      nulle : l'observateur ne le détecte jamais et le contenu reste invisible
      définitivement. Le masque va sur un descendant `.motion-clip`.
      Le contrôle `notRevealed` de `qa-screenshots.mjs` doit renvoyer 0 sur
      les 7 pages × 6 formats.
- [ ] **Densités variables** : au moins trois des quatre rythmes verticaux
      (`--section-compact`, `--section-y`, `--section-y-lg`,
      `--section-immersive`) sont employés sur la page d'accueil.
- [ ] **Surtitres dorés rares** — trois au maximum sur la page d'accueil.
      Certaines sections doivent ouvrir sur un titre seul, un chiffre, ou rien.
- [ ] **Aucune symétrie systématique** : pas de 50/50 ni de trois colonnes
      égales par défaut. Les rapports employés sont 5/7, 7/4, 40/60, 58/42,
      6/3/3.
- [ ] **Les deux blocs de conversion ne se ressemblent pas** : le bandeau
      intermédiaire est compact et horizontal, l'affiche de clôture est vaste
      et typographique. Jamais deux panneaux tarifaires identiques.
- [ ] **Fallbacks photo distincts** : `hero`, `founder`, `programme`,
      `events` ont chacun leur composition. Un même motif répété quatre fois
      signale immédiatement un système génératif.
- [ ] Aucune carte à fond + bordure + rayon là où un filet suffirait.

---

## 4. UX

- [ ] Le mobile est **aussi soigné** que le desktop, pas une version réduite.
- [ ] Navigation simple : six entrées maximum, CTA compris.
- [ ] Menu mobile : ouverture, fermeture, `Échap`, piège de focus, restitution
      du focus, verrouillage du défilement de la page.
- [ ] Hiérarchie de lecture cohérente d'une section à l'autre.
- [ ] Longueur de page raisonnable ; aucune section répétitive ou décorative
      sans fonction.
- [ ] Rien ne dépend uniquement du survol.

---

## 5. ACCESSIBILITÉ — objectif WCAG 2.2 AA

- [ ] HTML sémantique : `header`, `nav`, `main`, `section`, `footer`.
- [ ] Un **seul `h1` par page**, hiérarchie `h2`/`h3` continue, sans saut.
- [ ] Skip link fonctionnel en début de page.
- [ ] Navigation clavier complète, focus toujours visible.
- [ ] Contrastes : texte ≥ 4,5:1 ; bordures d'éléments interactifs ≥ 3:1
      (utiliser `--border-control` / `--border-control-on-dark`).
- [ ] Toute image porte un `alt` ; les SVG décoratifs sont `aria-hidden`.
- [ ] Boutons et liens correctement distingués (`<a>` pour naviguer,
      `<button>` pour agir).
- [ ] Cibles tactiles ≥ 24 px, hors liens intégrés à une phrase.
- [ ] `prefers-reduced-motion` respecté : aucune animation ne subsiste.
- [ ] Le site reste lisible et utilisable sans JavaScript.

---

## 6. PERFORMANCE

- [ ] `output: 'static'` ; le build produit bien un `dist/` autonome.
- [ ] JavaScript minimal : aucune directive `client:*` non justifiée, aucune
      librairie d'animation ou de composants ajoutée sans nécessité.
- [ ] Polices self-hébergées, sous-ensemble latin, préchargées, `font-display:
      swap`.
- [ ] Images : formats modernes, dimensions déclarées, `loading="lazy"` sous la
      ligne de flottaison, image du hero prioritaire.
- [ ] Animations uniquement sur `opacity` et `transform` ; aucun calcul de
      position pendant le défilement.
- [ ] Aucun script marketing, analytics ou tracker.

---

## 7. SEO

- [ ] `<title>` et meta description propres à chaque page.
- [ ] `<link rel="canonical">` correct sur chaque page.
- [ ] Open Graph complet, avec une image **PNG** (les réseaux sociaux
      n'affichent pas les SVG) en 1200 × 630.
- [ ] `robots.txt` et `sitemap-index.xml` générés et cohérents ; les pages
      légales incomplètes sont en `noindex` et hors sitemap.
- [ ] URLs lisibles et stables.
- [ ] Structured data honnête (voir bloc CONTENU).
- [ ] Aucun bourrage de mots-clés.

---

## Vérification finale

```bash
npm run build
```

Le build doit passer **sans erreur ni avertissement**. Puis :

```bash
npm run preview
node scripts/qa-screenshots.mjs http://localhost:4321
```

Regarder réellement les captures produites dans `screenshots/` — un rapport
vert ne remplace pas un coup d'œil. Chercher : débordement horizontal, texte
coupé, espacements incohérents, CTA peu visible, placeholders mal
proportionnés, contrastes faibles, sections trop répétitives.

## Résultat attendu

Un rapport bloc par bloc — ce qui passe, ce qui ne passe pas, et pour chaque
manquement le fichier et la ligne concernés. Tant que le bloc CONTENU n'est pas
intégralement vert, le site ne part pas en production.
