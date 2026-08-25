# V3_AUDIT — état de la V2 avant la passe de finition

> Audit mené avant toute modification de code.
> Build V2 rejoué : **0 erreur, 0 warning, 0 hint**. QA : **83/83** fonctionnels,
> **49/49** contrôles responsive (7 pages × 7 formats — deux formats ajoutés
> pour cette passe). Perf : **JS 1,9 Ko**, accueil 9 req / 247,7 Ko.
>
> Captures de référence : `iprig/screenshots/v3-before/`
> (390×844, 768×1024, **1366×768**, 1440×900, 1920×1080, plus les captures
> « premier écran » `fold-*.png`).

---

## Méthode

Deux ajouts d'outillage, non visibles sur le site :

1. **format 1366 × 768 ajouté** à `qa-screenshots.mjs`. C'est le format le plus
   répandu sur ordinateur portable, et le plus révélateur : large mais **peu
   haut**. La V2 n'était contrôlée qu'en 1024×768 (audit sans capture) et
   1440×900.
2. **captures « premier écran »** (`fold-*.png`) : viewport seul, sans
   défilement. Les captures pleine page ne disent rien de ce qu'on voit
   réellement en arrivant — et elles déforment les éléments `sticky`.

Mesures géométriques prises au navigateur (position réelle de chaque bloc du
hero, hauteur de chaque section, longueur de ligne réelle en caractères).

---

## À conserver absolument

Ces éléments sont au niveau attendu. Toute modification serait une régression.

| Élément | Pourquoi il ne faut pas y toucher |
|---|---|
| **Le masthead IPRIG** | C'est le geste d'identité. Il fait basculer la page du côté de la revue. Seul son **dimensionnement** doit devenir sensible à la hauteur d'écran — pas son principe, pas son échelle sur grand écran. |
| **Hero mobile (390)** | IPRIG → dénomination → promesse → intro → CTA → prix : tout tient dans le premier écran. Exactement l'ordre visé. Rien à faire. |
| **Hero 1920 et 1440** | Composition complète et équilibrée. Le bord droit du wordmark tombe naturellement à quelques pixels de la colonne photo — alignement heureux à préserver. |
| **Rythme des fonds et des densités** | papier / papier alt / marine / papier / **vert compact** / papier alt / papier / papier alt / **marine immersif**. Le test « squint » distingue nettement ouverture, argument, expérience, programme, conversion, portrait, preuve, questions, clôture. |
| **Les deux CTA opposés** | bandeau compact horizontal vs affiche typographique. Ils ne se ressemblent pas. C'est l'un des meilleurs partis pris de la V2. |
| **Composition des grands titres** | « Une préparation, / pas une bibliothèque / de vidéos » : les retours à la ligne semblent voulus. `text-wrap: balance` est déjà en place sur tous les titres, `pretty` sur le corps. |
| **Le langage motion** | Quatre gestes, une courbe, 18 éléments sur l'accueil. Aucun ajout justifiable. |
| **MediaSlot** | `src`, `alt`, `ratio`, `mobileRatio`, `objectPosition`, `priority`, `caption` : le contrat d'intégration des vraies photos est complet. Rien à préparer de plus. |
| **Les quatre fallbacks** | Distincts, sobres, et destinés à disparaître. Ne pas les embellir. |
| **Le mécanisme `null`** | Garde-fou central du projet. Intact. |
| **Accessibilité** | Skip link, piège de focus, `inert`, `aria-expanded`, accordéon natif, `prefers-reduced-motion`, site utilisable sans JS. Rien à corriger. |

---

## À améliorer

Classé par gain réel, pas par ordre d'apparition.

### 1. Le premier écran en 1366 × 768 — le seul vrai défaut de composition

Mesures sur `/`, viewport 1366 × 768 :

| Bloc | Position | Visible ? |
|---|---|---|
| masthead IPRIG | 176 → 453 | oui |
| dénomination | 442 → 498 | oui |
| promesse (slogan) | 538 → 677 | oui |
| texte d'introduction | 701 → 824 | **coupé au milieu** |
| **boutons d'action** | **864 → 916** | **non — 96 px sous la ligne de flottaison** |
| prix / sans engagement | 948 → 1012 | non |

Cause : `--text-display: clamp(5rem, 26vw, 18rem)` ne connaît que la **largeur**.
Un écran large mais peu haut reçoit donc le wordmark à sa taille maximale
(288 px, soit 276 px de hauteur de bloc), au-dessus d'espacements calibrés pour
des écrans de 900 px et plus.

En 1440 × 900 — le format sur lequel la V2 a été validée — les boutons
affleurent la ligne de flottaison : c'est correct. En 1920 et sur tablette et
mobile, tout est visible. **Le défaut est spécifique aux écrans peu hauts.**

### 2. Typographie française : aucune espace insécable sur tout le site

Comptage sur `src/data/*.ts` : **0 U+00A0, 0 U+202F**. Chaque `:` `;` `?` `»`
et chaque `29 €` est précédé d'une espace ordinaire, sécable.

Conséquences réelles :
- « 29 » et « € » peuvent se séparer en fin de ligne ;
- un `:` ou un `?` peut ouvrir une ligne ;
- l'espace avant le « ? » de « Prêt à commencer ? » — composé en serif de 45 à
  68 px — est visiblement trop large : une espace ordinaire y fait 15 px.

Vérifié au navigateur : **U+00A0 et U+202F sont tous deux rendus correctement**
par Newsreader et Instrument Sans (U+202F mesure exactement la moitié d'une
espace ordinaire — pas de glyphe de substitution). Le sous-ensemble latin
embarqué couvre `U+2000-206F`.

C'est le genre de détail qui ne se remarque jamais quand il est fait, et qui se
sent toujours quand il ne l'est pas.

### 3. Longueur de ligne : `62ch` vaut en réalité ~81 caractères

Mesure sur `/kevan-gafaiti`, 1366 px : la ligne la plus longue de la biographie
fait **81 caractères** pour une contrainte annoncée de `62ch`. L'unité `ch`
vaut la largeur du « 0 », plus large que la lettre bas-de-casse moyenne : le
rapport réel est d'environ **1 ch → 1,3 caractère** avec ces deux polices.

Blocs concernés (au-dessus de la fourchette 50–75) :

| Bloc | Contrainte | Caractères réels |
|---|---|---|
| `.prose` (biographie, réponses) | 62ch | ~81 |
| `.qa__answer` | 62ch | ~78 |
| `.session__summary` | 62ch | ~78 |
| `.disclaimer` (`/programme`) | **aucune** | **~91** |
| `.irig__note` (`/kevan-gafaiti`) | **aucune** | ~85 |

Les autres largeurs (`46ch`, `52ch`, `54ch`, `34ch`…) tombent dans la
fourchette et ne doivent pas bouger.

### 4. Les numéros ne partagent pas de ligne de base avec leur titre

`01…07` (L'institut) et `I…IV` (L'expérience) sont descendus **à la main** par
`padding-block-start: 0.1em` et `0.15em`, dans une grille alignée sur le haut
des boîtes. Résultat : le numéro flotte 6 à 8 px sous le titre au lieu de
partager sa ligne de base.

La liste des séances, elle, fait déjà les choses correctement
(`align-items: baseline` au-delà de 48rem). Le motif n'est donc pas cohérent
avec lui-même — alors que les numéros sont censés être **le** langage
graphique de l'IPRIG.

### 5. Le bandeau vert : les filets verticaux ne tiennent pas la hauteur

Le commentaire du composant annonce que les filets « courent sur toute la
hauteur du bandeau ». En réalité ils courent sur la hauteur du **contenu** :
73 px dans un bandeau de 235 px. Ils se lisent comme trois petits traits
hésitants plutôt que comme la structure du bandeau.

### 6. Formulation du prix — mathématiquement incohérente

> « 28,80 € + TVA applicable, soit environ 29 € par mois. »

28,80 € + TVA ≠ 29 €. Cette phrase est publiée sur **quatre pages** (affiche de
clôture) et reformulée dans la FAQ. C'est une mention tarifaire opposable.
Le rapport exact entre 28,80 € et 29 € n'a jamais été confirmé par le client
(cf. V2_HANDOFF § 16).

### 7. L'en-tête ne dit jamais où l'on se trouve

Sur `/programme`, `/kevan-gafaiti` et `/contact`, rien dans la navigation ne
signale la page courante. Aucun `aria-current` non plus — les lecteurs d'écran
sont dans la même situation.

### 8. La photographie du hero entre 768 et 992 px

`mobileRatio` bascule à 48rem, mais la mise en page reste **sur une seule
colonne jusqu'à 62rem**. Entre les deux, l'emplacement photo redevient un
format vertical de 336 px de large collé à gauche d'une colonne de 700 à
950 px : un bloc étroit et haut, orphelin. Le format « mobile » existe
précisément pour les mises en page à une colonne — sa borne est mal placée.

### 9. Le losange du hero se retrouve seul en début de ligne sur mobile

Sous ~410 px, le bandeau prix passe sur deux lignes et le losange doré, qui
devait *séparer* le prix des conditions, devient une puce décorative flottant
dans la marge gauche. Le commentaire du code annonce précisément ce qu'il faut
éviter ; l'implémentation ne le garantit pas.

### 10. Code mort et incohérences de tokens

| Élément | État |
|---|---|
| `--color-navy-700`, `--shadow-sm`, `--shadow-md`, `--dur-slow`, `--space-12`, `--radius-md`, `--ease-in-out` | déclarés, **0 usage** — reliquats V1 |
| `.rule` / `.section--dark .rule` | **0 usage** (aucun `<hr class="rule">` dans le site) |
| `abbr[title]` | **0 usage** (aucun `<abbr>`) |
| `landingSections` (`navigation.ts`) | exporté, documenté « observées par la navigation active », **jamais importé** |
| seuil « écran peu haut » | `max-height: 50rem` dans SectionInstitut, `52rem` dans `/kevan-gafaiti` — deux valeurs pour la même intention |
| `--ease-out` / `--ease-editorial` | deux courbes très proches, dont une porte un nom générique : le système à deux courbes n'est pas lisible dans les noms |
| commentaire de `--color-paper-3` | annonce « filets et séparateurs » ; le token sert de **fond** au fallback « events » |

---

## À tester

Points relevés mais dont l'amélioration n'est **pas acquise**. À trancher sur
capture, pas sur principe.

| Piste | Risque identifié |
|---|---|
| **En-tête plus compact après défilement** (§ 18) | L'en-tête est `sticky` : il occupe toujours sa place en tête de flux. Réduire sa hauteur **décale tout le document** de la même valeur — soit un saut de contenu au moment précis où l'utilisateur commence à défiler, et une oscillation à la frontière. À vérifier, probablement à écarter. |
| **Repères : hiérarchie des trois chiffres** | Le dominant et les secondaires sont alignés par le **haut** (écart de 2 px entre les hauteurs de capitale) — ce n'est donc pas un défaut d'alignement. Reste la question du silence des secondaires, aujourd'hui de la même couleur que le dominant. |
| **Bandeau : CTA pleine largeur sur mobile** | Le hero passe déjà ses deux boutons en pleine largeur sur mobile ; le bandeau non. Incohérence réelle, mais un bouton pleine largeur peut faire basculer le bandeau du côté « formulaire ». |
| **Section Repères très aérée** (618 px pour 220 px de contenu en 1920) | C'est le rythme « très aéré » voulu par la V2. Le resserrer aplatirait la variation de densité. |

---

## À ne pas toucher

- **La palette.** Aucun problème de contraste relevé : `--color-muted` 4,99:1,
  bordures interactives ≥ 3:1, textes clairs sur marine et sur vert conformes.
  Rien à gagner en la déplaçant.
- **Les polices.** Newsreader + Instrument Sans, self-hébergées, sous-ensemble
  latin, préchargées. Aucune troisième police, aucune graisse supplémentaire.
- **L'architecture.** Aucune page à créer, aucun composant à découper.
- **Le contenu.** Rien à réécrire. Seule exception : la formulation du prix,
  qui est un problème de justesse, pas de style.
- **Les placeholders.** Ils disparaîtront. Ne pas y investir.
- **La section Kevan (accueil et page).** Elle attend une photographie, pas des
  réglages. Le vide sous la colonne de texte se comblera avec le portrait réel.
- **`Fonctionnement` (3 étapes en 3 colonnes).** C'est une séquence de trois
  étapes de poids égal : la symétrie y est le sens, pas un défaut.
- **Le scroll natif, le JS, l'absence de dépendances.**

---

## Ce qui plafonne toujours la note, et qui ne dépend pas du code

Inchangé depuis la V2, et confirmé par cet audit :

1. **Les photographies.** Le hero, la section fondateur et la page programme
   sont construits autour d'emplacements qui attendent une image réelle.
2. **Le logo définitif.**
3. **Le programme 2026-2027 définitif.**

Aucune finition typographique ne remplacera ces trois éléments.
