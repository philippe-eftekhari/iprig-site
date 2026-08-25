# iprig.fr — contexte projet

Site officiel de l'**IPRIG**, Institut de préparation aux relations
internationales et à la géopolitique. Voir `../CLAUDE.md` pour les règles de
l'écosystème.

## Rôle du site

Vitrine officielle, présentation institutionnelle et **outil de conversion**.
Le parcours visé : réseaux sociaux → `iprig.fr` → Patreon → abonnement.

Le site ne remplace pas Patreon. Il ne gère **ni compte, ni paiement, ni
contenu réservé, ni base de données membres**. Tout cela reste sur Patreon.

## Public

Étudiants de licence et de master en relations internationales, science
politique et géopolitique ; personnes visant ces secteurs. Secondairement :
lycéens et grand public intéressé. Ton mature, universitaire, professionnel —
jamais infantilisant, jamais jargon marketing.

## Stack

Astro 7 + TypeScript strict, `output: 'static'`.
Pas de React, pas de framework CSS, pas de CMS, pas de base de données,
pas d'API, pas de i18n. Trois `<script>` natifs au total (menu mobile,
état de l'en-tête, révélation au scroll).

```bash
npm run dev      # développement
npm run build    # astro check + build → dist/
npm run preview  # sert dist/ localement
npm run og       # régénère public/og-image.png
```

## Où vit quoi

| Besoin | Fichier |
|---|---|
| Nom, slogan, description, SEO, prix, Patreon, chiffres, contacts, mentions légales | `src/data/site.ts` |
| Menu et ancres | `src/data/navigation.ts` |
| Section « L'institut » et ses sept apports | `src/data/institut.ts` |
| Volets, séances, étapes d'adhésion | `src/data/programme.ts` |
| Biographie, formation, Kevan Explique, IRIG | `src/data/kevan.ts` |
| Questions fréquentes | `src/data/faq.ts` |
| Témoignages | `src/data/temoignages.ts` |
| Couleurs, typographie, espacements, motion | `src/styles/global.css` |

**Aucune de ces valeurs ne doit être dupliquée dans un composant.**
Si une chaîne apparaît deux fois dans le code, elle doit remonter dans
`src/data/`.

## Règles de contenu

Reprendre `content-integrity` intégralement. En résumé :

- Ne rien inventer : témoignages, chiffres, diplômes, postes, publications,
  partenaires, événements, certifications, e-mails, comptes sociaux.
- Un champ `null` dans `src/data/` **masque** proprement l'élément. Ne jamais
  le remplacer par une valeur plausible.
- Les manques se marquent `TODO CLIENT` avec la question précise à poser, et
  se reportent dans `CONTENT_TODO.md`.
- L'IPRIG ne délivre ni diplôme ni certification reconnue par l'État.
- Les événements sont des opportunités, jamais des garanties.

## Direction artistique

Institut académique contemporain / revue internationale — pas startup.

- **Couleurs** : bleu profond (`--color-navy`), vert institutionnel
  (`--color-forest`), papier chaud (`--color-paper`), laiton discret
  (`--color-accent`). Toutes en tokens CSS.
- **Typographie** : Newsreader (serif éditoriale) pour les titres,
  Instrument Sans pour le corps. Self-hébergées, sous-ensemble latin.
- **Interdits** : dégradés violets, glassmorphism, cartes arrondies partout,
  emojis décoratifs, grosses ombres, carrousels, animations permanentes,
  illustrations technologiques génériques.
- **Rythme** : alternance papier / papier alterné / sections sombres. Filets
  fins plutôt que boîtes. Les numéros et chiffres romains structurent la page.
## Langage motion (V2, confirmé en V3)

**Quatre comportements, pas un de plus.** Définis dans la section 7 de
`global.css`, pilotés par un unique `IntersectionObserver` (BaseLayout).

| Attribut | Geste | Employé sur |
|---|---|---|
| `data-motion="title"` | le titre monte derrière un masque | grands titres de section uniquement |
| `data-motion="rule"` | le filet se trace de gauche à droite | filets structurants (masthead, affiche) |
| `data-motion="media"` | volet + léger recentrage d'échelle | emplacements photo |
| `data-motion="soft"` | apparition en opacité, sans déplacement | éléments du hero |

Règles :

- **Les paragraphes courants ne s'animent pas.** Les listes ne s'animent pas
  élément par élément. Une seule animation focale par moment de lecture.
- `data-motion-now` révèle dès le chargement, en séquence — réservé à la
  chorégraphie d'ouverture du hero (~1,2 s au total).
- `data-motion-delay="120"` décale une révélation.
- Un titre en `data-motion="title"` doit envelopper son texte dans
  `<span class="motion-inner">`.

⚠ **Ne jamais poser `data-motion="media"` sur l'élément masqué lui-même.**
Un élément entièrement caché par `clip-path` a une aire d'intersection nulle :
l'observateur ne le voit jamais entrer dans le viewport et il reste invisible
pour toujours. Le masque va sur un descendant `.motion-clip`.

Le contrôle `notRevealed` de `qa-screenshots.mjs` garde cette règle : il doit
toujours renvoyer 0.

### Deux courbes, deux durées — et rien d'autre

| Token | Rôle |
|---|---|
| `--ease-ui` (150 ms / 280 ms) | réactions d'interface : survol, focus, filet qui se trace sous un lien, flèche de CTA, accordéon, tiroir |
| `--ease-editorial` (620 → 880 ms) | révélations de lecture : les quatre gestes ci-dessus, plus la légende d'un emplacement photo |

Toute nouvelle transition doit se ranger dans l'une des deux. Ajouter une
troisième courbe ou une troisième durée d'interface demande une raison écrite.

## Longueur de ligne — le piège du `ch`

`1ch` vaut la largeur du chiffre « 0 », pas celle d'un caractère moyen. Avec
Instrument Sans, `1ch` ≈ **1,4 caractère français** : une contrainte écrite
`62ch` laisse passer 85 à 95 caractères par ligne.

Deux mesures seulement, dans `global.css` :

- `--measure` (48ch) — petits corps : notes, résumés, réponses de la FAQ ;
- `--measure-wide` (52ch) — corps de lecture, à partir de `--text-md`.

**Ne pas écrire de largeur de lecture en `ch` ailleurs.** Les autres valeurs en
`ch` du projet contraignent des titres ou des étiquettes, pas de la lecture
suivie : elles restent telles quelles.

## Typographie française

Le contenu emploie les espaces insécables réglementaires, et il doit continuer
à le faire :

- **U+00A0** (insécable) avant `:` et avant une unité — `29 €`, `75 000` ;
- **U+202F** (fine insécable) avant `;` `!` `?` `»` et après `«`.

Les deux polices embarquées rendent correctement U+202F (mesuré : exactement
la moitié d'une espace ordinaire). Dans le balisage `.astro`, l'entité
`&#8239;` est plus lisible qu'un caractère invisible.

La règle est **gardée par un test** : `qa-functional.mjs` parcourt le texte
visible des six pages et échoue à la première espace ordinaire trouvée devant
`: ; ? !`, `»` ou `€`. Ne pas la contourner — corriger la chaîne dans
`src/data/`.

```bash
npm run qa:tests   # 84 tests, dont la garde typographique
```

Les métadonnées (`description`, Open Graph) sont volontairement **hors
contrôle** : elles ne sont pas mises en page par le site, et les moteurs de
recherche les recomposent.

## Hauteur d'écran, pas seulement largeur

Deux règles du site regardent la **hauteur** du viewport, pas sa largeur :

- `--text-display` — le wordmark du masthead. Deux valeurs : celle du
  téléphone et de la tablette (`min(26vw, 32vh)`, plafond `18rem`), et celle
  du bureau à partir de 62rem (`min(26vw, 29vh)`, plafond `16.5rem`). Le terme
  de largeur est identique dans les deux, pour que le passage à 62rem soit
  continu. Ne pas retoucher la valeur mobile : le mot doit y tenir la ligne
  entière.
- `@media (min-width: 62rem) and (max-height: 50rem)` — **un seul seuil pour
  tout le site** : il resserre la respiration du hero et désactive les colonnes
  `sticky` plus hautes que l'écran. Ne pas en introduire un second.

Contrôler toute modification de composition en **1366 × 768** avant 1440 × 900 :
c'est le format qui révèle les défauts de hauteur.

## Le masque des titres rogne au bord de la boîte de padding

`data-motion="title"` cache le titre derrière `overflow: clip`. Le bord du
masque suit **l'interlignage**, pas les glyphes. Avec un interlignage normal
(1,04 à 1,15 sur les titres de section), la boîte couvre largement les
capitales. Sous ~0,9, elle passe dessous et **ampute les empattements
supérieurs** — c'est arrivé au masthead (`line-height: 0.82`), qui perdait
19 px de glyphes une fois l'animation terminée.

Le correctif est **local** (`.hero__mark`), et doit le rester : une marge haute
de `0.07em` sur le masque, annulée par une marge négative de même valeur pour
que rien ne bouge. Tout nouveau titre animé sous 0,9 d'interlignage demande le
même contrôle.

```bash
node scripts/hero-shots.mjs <sous-dossier>   # hero aux 5 formats + mesures
```

`mark-<format>.png` donne le gros plan du masthead : c'est là qu'un rognage se
voit. Comparer avec le dossier précédent avant de conclure.

## Rythme de la page d'accueil

Ce n'est pas qu'une alternance de fonds : **la densité varie aussi**. C'est ce
qui empêche la page de se lire comme une suite de composants.

| Section | Fond | Densité | Composition |
|---|---|---|---|
| Hero | papier | aérée | masthead pleine largeur + article 58/42 |
| Institut | papier alt | dense | manifeste 5 / sommaire numéroté 7 |
| Expérience | marine | aérée | quatre chapitres numérotés, le 1ᵉʳ plus grand |
| Séances | papier | dense | en-tête 7/4 + liste 7/4 avec photo fixe |
| Bandeau CTA | vert | **compacte** | une seule ligne horizontale |
| Fondateur | papier alt | aérée | photo 40 / texte 60 |
| Repères | papier | très aérée | un chiffre dominant, deux secondaires |
| Questions | papier alt | dense | accordéon `<details>` |
| Affiche CTA | marine | **immersive** | affiche typographique, prix géant |

Quatre rythmes verticaux : `--section-compact`, `--section-y`,
`--section-y-lg`, `--section-immersive`.

**Les surtitres dorés sont rares** — trois sur la page d'accueil, pas neuf.
Certaines sections ouvrent directement sur un titre, un chiffre ou rien.

## Emplacements photo

`MediaSlot.astro` gère les deux états. Sans `src`, un **fallback éditorial
différent par emplacement** (`hero`, `founder`, `programme`, `events`) tient la
place : aucun motif ne se répète d'une section à l'autre.

- `mobileRatio` : sur téléphone, un format vertical mange l'écran — les
  emplacements passent en horizontal.
- `showPendingMediaLabels` (`src/data/site.ts`) : passer à `false` avant
  production retire toutes les mentions « photographie à venir » sans décaler
  la mise en page.

## QA

Avant toute livraison, exécuter le skill **`iprig-quality-gate`**.

```bash
npm run build                                    # doit passer sans erreur
npm run preview
node scripts/qa-screenshots.mjs http://localhost:4321
```

Le script produit `screenshots/` (7 pages × 3 formats) et un rapport
automatique : débordement horizontal, erreurs console, requêtes en échec,
nombre de `h1`, sauts de titres, `alt` manquants, `rel="noopener"`, cibles
tactiles. **Regarder les captures**, pas seulement le rapport.

## Déploiement

Hostinger, statique, `dist/` → `public_html/`. Voir `DEPLOY_HOSTINGER.md`.
Le `.htaccess` livré est dans `public/`. Aucun identifiant dans le dépôt.
