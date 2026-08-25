# V2_HANDOFF — reprise du projet IPRIG

> ## ⚠ Ce document décrit l'état de la V2. Une passe V3 a été appliquée depuis.
>
> Il reste la meilleure description du **projet, de ses intentions et de ses
> pièges** — c'est pour cela qu'on le garde. Mais quelques valeurs précises
> qu'il cite ont changé le 25/08/2026 :
>
> | § | Ce que dit ce document | État réel |
> |---|---|---|
> | 4 | `--text-display: clamp(5rem, 26vw, 18rem)` | `clamp(5rem, min(26vw, 32vh), 18rem)` — sensible à la hauteur d'écran |
> | 4 | `--color-accent-ink: #8c6626` | `#805d23` — la valeur V2 tombait à 4,33:1 sur le papier alterné, sous le seuil AA |
> | 4 | `--color-navy-700`, `--shadow-sm`, `--shadow-md`, `--dur-slow`, `--space-12`, `--radius-md`, `--ease-in-out` | supprimés : déclarés, jamais employés |
> | 7 | « Courbe unique `--ease-editorial` » | deux courbes nommées : `--ease-ui` et `--ease-editorial` ; `--dur` est passé de 380 à 280 ms |
> | 12 | 83 tests fonctionnels | **84** — une garde typographique a été ajoutée |
> | 16 | « 28,80 € + TVA applicable, soit environ 29 € par mois » | **retiré du site** : formule incohérente. Voir `CONTENT_TODO.md` |
> | 17 | `screenshots/v1/`, `screenshots/v2/` | + `screenshots/v3-before/` et `screenshots/v3/`, en 5 formats |
> | 19 | notes d'autoévaluation V2 | voir `V3_VISUAL_REVIEW.md` |
>
> **À lire en priorité pour reprendre le travail :**
> `iprig/CLAUDE.md` (règles projet, à jour) · `V3_AUDIT.md` (ce qui a été
> diagnostiqué) · `V3_VISUAL_REVIEW.md` (ce qui a changé, page par page).
>
> ---
>
> Document de passation. Il contient tout ce qu'il faut pour reprendre le site
> `iprig.fr` sans avoir lu les sessions précédentes.
> **État à la fin de la V2 : build vert, site complet, non déployé.**
>
> À lire aussi : `CLAUDE.md` (écosystème), `iprig/CLAUDE.md` (règles projet),
> `iprig/CONTENT_TODO.md` (ce que le client doit fournir),
> `iprig/DEPLOY_HOSTINGER.md` (mise en ligne).

---

## 1. Contexte

**Kevan Gafaïti** — orthographe exacte, un seul « n », tréma sur le « i » —
est enseignant à Sciences Po Paris et président-fondateur de l'IRIG. Il diffuse
aussi des analyses sous la marque **Kevan Explique**.

Son écosystème numérique comprendra trois entités :

| Sigle | Nature | État |
|---|---|---|
| **IPRIG** | Institut de préparation aux relations internationales et à la géopolitique — prépa / accompagnement d'étudiants | **Seul projet en cours.** Domaine `iprig.fr`, dossier `iprig/` |
| **IRIG** | Institut des relations internationales et géopolitiques — centre de recherche | Site à construire plus tard. **Ne pas commencer.** |
| Revue | Revue en ligne de géopolitique | Projet long terme. **Ne pas commencer.** |

⚠ **IPRIG ≠ IRIG.** Une lettre d'écart, deux entités distinctes : l'IPRIG
prépare des étudiants, l'IRIG fait de la recherche. Ne jamais les confondre ni
fusionner leurs contenus.

---

## 2. Objectif du site

Vitrine officielle et **outil de conversion**. Parcours visé :

```
réseaux sociaux / conférences / bouche-à-oreille
        ↓
     iprig.fr    (comprendre → être rassuré → se projeter)
        ↓
     Patreon     (abonnement)
```

Le site **ne remplace pas Patreon** : ni compte, ni paiement, ni contenu
réservé, ni base de données membres. Tout cela reste sur Patreon.

**Offre** : une seule formule, 29 € / mois, sans engagement.
**Public** : étudiants de licence et master en RI, science politique,
géopolitique. Secondairement lycéens et grand public. Ton mature et
universitaire — jamais infantilisant, jamais jargon marketing.

Trafic attendu majoritairement **mobile** (Instagram, TikTok, LinkedIn).

---

## 3. Stack et décisions techniques

- **Astro 7 + TypeScript strict**, `output: 'static'`, `build.format: 'file'`
  (URLs sans `.html`, réécriture Apache dans `public/.htaccess`).
- **Pas de** React, framework CSS, CMS, base de données, API, i18n, analytics,
  cookie, formulaire.
- **Trois `<script>` natifs au total** : menu mobile, état de l'en-tête,
  révélations motion. **1,9 Ko de JS livré**, un seul fichier.
- Polices **self-hébergées** dans `public/fonts/`, sous-ensemble latin,
  `font-display: swap`, préchargées.
- `playwright-core` en devDependency : pilote le Chrome déjà installé sur la
  machine, **aucun navigateur téléchargé**.

```
dependencies    astro ^7.2.6 · @astrojs/check · @astrojs/sitemap
                @fontsource-variable/newsreader · @fontsource-variable/instrument-sans
                typescript
devDependencies playwright-core
```

### Commandes

```bash
npm install
npm run dev       # développement
npm run build     # astro check && astro build → dist/
npm run preview   # sert dist/ sur :4321
npm run qa        # tests fonctionnels + responsive + performance
npm run og        # régénère public/og-image.png
```

Un lanceur double-clic existe : `Lancer le site IPRIG.bat` (racine).
Il est en **ASCII pur avec fins de ligne CRLF** — `cmd.exe` refuse les fins de
ligne Unix, et les accents deviennent illisibles selon la page de codes.
Ne pas le réécrire avec l'outil Write sans reconvertir.

---

## 4. Design system

Tout est en tokens CSS dans `src/styles/global.css` (section 2).
**Aucune valeur hexadécimale isolée dans un composant** — une seule exception
documentée : `<meta name="theme-color">` dans `BaseLayout.astro`, qu'une balise
meta ne peut pas lire depuis une variable CSS.

### Palette

| Token | Valeur | Rôle |
|---|---|---|
| `--color-paper` | `#f6f3ed` | fond principal, papier chaud |
| `--color-paper-2` | `#efeae0` | fond alterné |
| `--color-paper-3` | `#e5dfd2` | fond du fallback « events » |
| `--color-ink` | `#14191b` | texte principal |
| `--color-ink-soft` | `#3a4447` | texte secondaire |
| `--color-muted` | `#5e6a6e` | légendes — AA sur papier (4,99:1) |
| `--color-navy` | `#0d2e4a` | bleu profond : titres, liens, CTA |
| `--color-navy-deep` | `#071d30` | fond des sections sombres |
| `--color-forest` | `#1c4438` | vert institutionnel |
| `--color-forest-deep` | `#12312a` | fond du bandeau CTA |
| `--color-forest-bright` | `#7fb09c` | vert lisible sur fond sombre |
| `--color-accent` | `#b58a4a` | laiton : filets, repères |
| `--color-accent-ink` | `#8c6626` | laiton assombri — AA en texte sur papier |
| `--color-accent-bright` | `#d8b67c` | laiton clair sur fond sombre |
| `--color-navy-line` | `#9fb6c6` | trait clair sur marine |
| `--border-control` | navy 60 % | bordure d'élément interactif, ≥ 3:1 |
| `--border-control-on-dark` | on-dark 40 % | idem sur fond sombre |

Ni bleu « logiciel d'entreprise », ni vert « appli écolo ».
**Ne pas transformer le site en noir/blanc générique.**

### Typographie

- **Newsreader** (serif éditoriale, SIL OFL) — titres, chiffres, citations.
- **Instrument Sans** (SIL OFL) — corps, interface, surtitres.
- Interdites : Inter, Roboto, Poppins, Montserrat, Arial en police principale.
- `--text-display: clamp(5rem, 26vw, 18rem)` — le wordmark du masthead, réglé
  pour occuper ~78 % de la largeur du conteneur à toutes les tailles.

### Rythme vertical — quatre densités

```
--section-compact    clamp(2.5rem, 6vw, 5rem)      bandeau, une ligne
--section-y          clamp(3.25rem, 8vw, 7rem)     section ordinaire
--section-y-lg       clamp(4rem, 11vw, 10rem)      section de lecture
--section-immersive  clamp(4.75rem, 13vw, 12rem)   ouverture / clôture
```

Les bornes basses sont volontairement serrées : sur téléphone, un blanc de
88 px se traverse au doigt sans rien apprendre.

### Autres partis pris

- Rayons quasi nuls (`--radius-sm: 2px`). **Pas de cartes arrondies partout.**
- Ombres quasi absentes. Les **filets fins** sont le motif de marque.
- Rapports asymétriques : 5/7, 7/4, 40/60, 58/42, 6/3/3.
  **Aucun 50/50, aucune grille de trois colonnes égales.**

---

## 5. Structure de la page d'accueil

Neuf sections. Ce n'est pas qu'une alternance de fonds : **la densité varie
aussi**. C'est ce qui empêche la page de se lire comme une suite de composants.

| # | Section | Composant | Fond | Densité | Composition |
|---|---|---|---|---|---|
| 1 | Hero | `Hero.astro` | papier | aérée | masthead pleine largeur + article 58/42 |
| 2 | L'institut | `SectionInstitut.astro` | papier alt | dense | manifeste 5 / sommaire numéroté 7 |
| 3 | Expérience | `SectionExperience.astro` | marine | aérée | 4 chapitres numérotés, le 1ᵉʳ plus grand |
| 4 | Séances | `SectionProgramme.astro` | papier | dense | en-tête 7/4 + liste 7/4 + photo fixe |
| 5 | **CTA n° 1** | `CtaBand.astro` | vert | **compacte** | une seule ligne horizontale |
| 6 | Fondateur | `SectionFondateur.astro` | papier alt | aérée | photo 40 / texte 60 |
| 7 | Repères | `SectionStats.astro` | papier | très aérée | 1 chiffre dominant + 2 secondaires |
| 8 | Témoignages | `SectionTemoignages.astro` | — | — | **masquée** (tableau vide) |
| 9 | Questions | `SectionFaq.astro` | papier alt | dense | accordéon `<details>` natif |
| 10 | **CTA final** | `CtaPoster.astro` | marine | **immersive** | affiche typographique, prix géant |

Le pied de page (`Footer.astro`) est marine et prolonge l'affiche de clôture :
`main > .section--dark:last-child` réduit son padding bas pour éviter un grand
vide entre deux blocs de même couleur.

**Surtitres dorés : 3 sur la page d'accueil** (hero, institut, fondateur).
En V1 il y en avait 9 — l'enchaînement rendait la recette visible.
Certaines sections ouvrent directement sur un titre, un chiffre, ou rien.

---

## 6. Décisions importantes prises entre V1 et V2

La V1 était techniquement solide mais **trop cohérente** : la même grammaire
(surtitre → titre serif → paragraphe → filet → grille) revenait à chaque
section, et presque tout faisait le même `fade-up`. Un système de design qui
devient visible produit un sentiment de « généré ».

| Sujet | V1 | V2 | Pourquoi |
|---|---|---|---|
| Hero | texte + image en colonne droite | **masthead** pleine largeur puis article 58/42 | fait basculer la page du côté de la revue |
| Wordmark | `clamp(3.5rem, 13vw, 10rem)` | `clamp(5rem, 26vw, 18rem)` | c'est le geste d'identité principal |
| Expérience | grille 2 × 2 | **4 chapitres numérotés**, 1ᵉʳ en ouverture | une grille de 4 cases lisait comme des fonctionnalités |
| Séances (accueil) | 6 séances | **4** + lien vers `/programme` | accueil = synthèse, `/programme` = intégralité |
| CTA n° 1 | panneau tarifaire sombre | **bandeau horizontal compact** | les deux CTA partageaient le même patron |
| CTA final | même panneau tarifaire | **affiche typographique**, « 29 € » à 192 px | le prix devient composition, pas étiquette |
| Repères | 3 colonnes égales | **6/3/3**, un dominant | trois colonnes égales ne disaient rien |
| Contact | 3 cartes | **annuaire** : intitulé / information / action | c'était la page la plus proche d'un template |
| Placeholders | **même globe partout** | **4 fallbacks distincts** | la répétition signalait un système génératif |
| Encarts | fond + bordure + rayon | **filet + liste** | moins de cartes, plus d'éditorial |
| Motion | un `fade-up` universel, ~40 éléments | **4 gestes**, 10 éléments au scroll | moins d'animations, plus intentionnelles |
| Progression | dégradé tricolore | **une seule couleur**, laiton | un repère de lecture, pas une barre de chargement |
| En-tête sticky | `backdrop-filter: blur(10px)` | **fond opaque** | le flou imposait un recalcul de composition à chaque frame |

### Ce qui a été délibérément conservé

Stack, architecture, composants Astro, Newsreader + Instrument Sans, palette,
IPRIG géant, en-tête sticky, CTA, menu mobile, progression de lecture,
structure `01 / titre / description / catégorie` des séances, accordéon FAQ
natif, tout le contenu, toutes les données centralisées, toute
l'accessibilité.

---

## 7. Système motion

**Quatre comportements, pas un de plus.** Définis en section 7 de
`global.css`, pilotés par un unique `IntersectionObserver` dans
`BaseLayout.astro` qui se désabonne après le premier passage.

| Attribut | Geste | Durée | Employé sur |
|---|---|---|---|
| `data-motion="title"` | le titre monte derrière un masque | 780 ms | grands titres de section uniquement |
| `data-motion="rule"` | le filet se trace de gauche à droite | 620 ms | filets structurants |
| `data-motion="media"` | volet + recentrage d'échelle 1.02 → 1 | 880 ms | emplacements photo |
| `data-motion="soft"` | opacité seule, sans déplacement | 640 ms | éléments du hero |

Courbe unique : `--ease-editorial: cubic-bezier(0.16, 1, 0.3, 1)`. Pas de rebond.

### Règles

- **Les paragraphes courants ne s'animent pas.** Les listes ne s'animent pas
  élément par élément. Pas de stagger sur la FAQ, les séances, les chiffres,
  les apports.
- Une seule animation focale par moment de lecture.
- `data-motion-now` révèle dès le chargement — réservé à la chorégraphie
  d'ouverture du hero (surtitre → wordmark → filet → dénomination → promesse
  → média → action, ~1,2 s au total, page utilisable pendant).
- `data-motion-delay="120"` décale une révélation.
- Un titre en `data-motion="title"` doit envelopper son texte dans
  `<span class="motion-inner">`.

### Compte actuel

```
index.html          18 éléments (dont 8 pour la chorégraphie du hero)
programme.html       3
kevan-gafaiti.html   3
contact.html         0    (page d'annuaire : rien à animer)
404.html             0
```

### Interdits

Aucune animation permanente, blob, particule, mouse-follow, curseur
personnalisé, parallax, smooth-scroll, GSAP, compteur numérique, spring SaaS.
Aucune dépendance d'animation.

`prefers-reduced-motion` désactive tout et affiche tout immédiatement.
Sans JavaScript, tout est visible (`.no-js`).

---

## 8. Composants

```
Arrow.astro               flèche décorative des CTA (aria-hidden)
CtaBand.astro             CTA intermédiaire — bandeau compact horizontal
CtaPoster.astro           CTA de clôture — affiche typographique (aussi sur les pages secondaires)
Fonctionnement.astro      les 3 étapes de l'adhésion
Footer.astro              pied de page ; masque les liens dont l'URL est null
Header.astro              en-tête sticky, nav, tiroir mobile, progression de lecture
Hero.astro                masthead + article
MediaSlot.astro           emplacement photo (voir § 9)
PageHeader.astro          en-tête des pages secondaires
SectionExperience.astro   4 chapitres numérotés
SectionFaq.astro          accordéon <details name="faq"> natif
SectionFondateur.astro    Kevan Gafaïti + Kevan Explique
SectionInstitut.astro     manifeste + sommaire numéroté 01–07
SectionProgramme.astro    aperçu de 4 séances + lien + fonctionnement
SectionStats.astro        repères chiffrés asymétriques
SectionTemoignages.astro  ne rend RIEN tant que le tableau est vide
Seo.astro                 metadata + JSON-LD
SessionsList.astro        liste des séances, prop `limit`
Wordmark.astro            wordmark typographique IPRIG (remplacer par le logo)
```

`CtaSection.astro` et `MediaPlaceholder.astro` de la V1 **ont été supprimés** —
ne pas les recréer.

---

## 9. MediaSlot et placeholders

`MediaSlot.astro` gère les deux états d'un emplacement photographique.

### Props

```ts
src?: ImageMetadata      // image importée ; si absente → fallback éditorial
alt?: string
ratio?: 'portrait' | 'landscape' | 'square' | 'tall' | 'wide'
mobileRatio?: …          // format sous 48rem
fallback?: 'hero' | 'founder' | 'programme' | 'events'
caption?: string
objectPosition?: string
priority?: boolean       // eager + fetchpriority high
motionDelay?: number
motionNow?: boolean
```

### Intégrer une vraie photo

```astro
---
import portrait from '../assets/kevan/portrait.jpg';
---
<MediaSlot src={portrait} fallback="founder" ratio="portrait" alt="Kevan Gafaïti" />
```

Le fallback disparaît seul. Astro gère redimensionnement, AVIF/WebP et lazy.

### Les quatre fallbacks

Chacun a **sa propre composition** — aucun motif ne se répète :

| Fallback | Composition | Employé sur |
|---|---|---|
| `hero` | repère de cadrage : cadre intérieur + lignes de tiers + repère laiton, sur marine | hero |
| `founder` | initiales « KG » en contour + ligne de sol, sur marine | fondateur (accueil + page) |
| `programme` | « 01 » en contour + « SESSIONS », sur vert profond | aperçu des séances |
| `events` | deux surfaces décalées + repère, sur papier foncé | `/programme` |

### Avant la mise en production

Dans `src/data/site.ts`, passer **`showPendingMediaLabels` à `false`**.
Toutes les mentions « photographie à venir » disparaissent d'un coup, sans
décaler la mise en page.

---

## 10. Contenu centralisé

Tout ce qui peut changer vit dans `src/data/`. **Aucune de ces valeurs n'est
dupliquée dans un composant.** Si une chaîne apparaît deux fois dans le code,
elle doit remonter ici.

| Fichier | Contenu |
|---|---|
| `site.ts` | nom, slogan, intro, SEO, **prix**, **URL Patreon**, libellés de CTA, chiffres, `communitySize`, contacts, réseaux, mentions légales, `showPendingMediaLabels` |
| `navigation.ts` | menu principal, pied de page, ancres |
| `institut.ts` | manifeste, publics, les 7 apports |
| `programme.ts` | 4 volets, séances, `programmeIsProvisional`, fonctionnement, `certificatsDisponibles` |
| `kevan.ts` | biographie, fonctions, formation, Kevan Explique, IRIG |
| `faq.ts` | 8 questions |
| `temoignages.ts` | tableau **vide** — la section disparaît |

### Le mécanisme `null`

Un champ `null` **masque proprement** l'élément partout où il apparaît.
C'est le garde-fou central du projet.

```ts
contact.email                  null   // TODO CLIENT
socialsIprig.Instagram         null   // TODO CLIENT
socialsIprig.LinkedIn          null   // TODO CLIENT
socialsKevanExplique.Instagram 'https://www.instagram.com/kevanexplique/'  ✅ fourni
socialsKevanExplique.TikTok    null   // TODO CLIENT
socialsKevanExplique.YouTube   null   // TODO CLIENT
socialsKevanExplique.Podcast   null   // TODO CLIENT
legal.editor / address / siret / publicationDirector  null   // TODO CLIENT
irig.url                       null   // TODO CLIENT
```

⚠ **Ne jamais remplacer un `null` par une valeur plausible.**
Un lien mort ou un compte inexistant décrédibilise immédiatement le site.

Tant qu'aucune URL Kevan Explique n'est fournie hors Instagram, seul Instagram
s'affiche en lien ; les autres plateformes sont citées en toutes lettres
(« Présent sur Instagram, TikTok, YouTube, Podcast. »).

---

## 11. Pages secondaires

| URL | Fichier | État |
|---|---|---|
| `/` | `pages/index.astro` | complète |
| `/programme` | `pages/programme.astro` | complète — **conserve les 6 séances** |
| `/kevan-gafaiti` | `pages/kevan-gafaiti.astro` | complète — biographie développée |
| `/contact` | `pages/contact.astro` | annuaire éditorial, **sans formulaire** |
| `/mentions-legales` | `pages/mentions-legales.astro` | **squelette**, `noindex`, hors sitemap |
| `/politique-confidentialite` | `pages/politique-confidentialite.astro` | **squelette**, `noindex`, hors sitemap |
| 404 | `pages/404.astro` | complète, vraie 404 HTTP |

Les deux pages légales passeront automatiquement en `index` dès que
`legal.editor` cessera d'être `null`.

---

## 12. Résultats QA V2

Serveur de production requis (`npm run preview`), jamais le mode dev.

### Build

```
astro check : 0 erreur, 0 warning, 0 hint  (35 fichiers)
astro build : 7 pages, dist/ = 540 Ko
```

### Tests fonctionnels — `npm run qa:tests`

**83 / 83.** Liens Patreon (URL unique, HTTPS, `noopener noreferrer`), liens
internes, ancres, menu mobile (clic, clavier, Échap, piège de focus, restitution,
verrouillage du défilement, `inert` sur l'arrière-plan), FAQ (clic + clavier),
skip link, barre de progression (0 % / ~50 % / 100 % + `ScrollTimeline` CSS),
métadonnées des 6 pages, JSON-LD, robots, sitemap, site sans JavaScript.

### Responsive et accessibilité — `npm run qa:screens`

**42 / 42** (7 pages × 6 formats : 320, 390, 768, 1024, 1440, 1920).
Aucun débordement horizontal, un seul `h1` par page, aucun saut de titre,
aucun `alt` manquant, aucune cible < 24 px, aucune erreur console,
`notRevealed = 0` partout.

### Longueur de la page d'accueil

| | V1 | V2 | |
|---|---|---|---|
| mobile 390 | 14 601 px | 11 811 px | **−19,1 %** |
| tablette 768 | 12 543 px | 11 662 px | −7,0 % |
| desktop 1440 | 10 144 px | 10 017 px | −1,3 % |

Obtenu sans retirer aucun contenu : formats d'image adaptatifs, rythme vertical
resserré, 4 séances sur l'accueil au lieu de 6 (les 2 autres sont sur
`/programme`).

### Performance — `npm run qa:perf`

| | V1 | V2 |
|---|---|---|
| JavaScript | 1,9 Ko | **1,9 Ko** |
| Accueil | 9 req · 243,6 Ko | 9 req · 247,7 Ko |
| Chargement accueil | 111 ms | 108 ms |
| `/contact` | 122,4 Ko | 126,4 Ko |

+4 Ko de CSS non compressé pour les nouvelles compositions. Zéro dépendance
ajoutée.

### Accessibilité

Objectif WCAG 2.2 AA tenu. HTML sémantique, skip link, navigation clavier
complète, focus visible, contrastes texte ≥ 4,5:1 et bordures interactives
≥ 3:1 (`--border-control`), `prefers-reduced-motion` respecté, site utilisable
sans JavaScript.

---

## 13. Bugs déjà corrigés — ne pas les réintroduire

1. **`clip-path` sur l'élément observé** *(V2, sérieux)*
   Un élément entièrement masqué par `clip-path` a une aire d'intersection
   nulle : l'`IntersectionObserver` ne le voit jamais entrer dans le viewport
   et le contenu reste invisible **définitivement**. Deux photos étaient
   perdues. Le masque va sur un descendant `.motion-clip`, jamais sur
   l'élément porteur de `data-motion`.
   → gardé par le contrôle `notRevealed` de `qa-screenshots.mjs`.

2. **`animation-timeline` replié dans le raccourci `animation`** *(V1)*
   Le minifieur CSS fusionnait `animation-timeline` dans `animation:` ;
   Chrome rejette la déclaration entière et la barre de progression restait
   figée à zéro. La timeline est déclarée dans une **règle séparée à sélecteur
   plus spécifique** (`.header .header__progress-bar`).
   → gardé par 4 tests fonctionnels.

3. **Spécificité du scoping Astro** *(V2)*
   Astro ajoute `[data-astro-cid-…]` à chaque partie du sélecteur :
   `.parent > *` devient plus spécifique que `.enfant`. Deux règles de
   `CtaBand.astro` ne s'appliquaient pas (prix sur deux lignes, bouton coupé).
   Corrigé par des sélecteurs enfants explicites (`.band__inner > .band__price`).

4. **`will-change` sur ~40 éléments** *(V1)* — promouvait autant de couches dès
   le chargement. Supprimé.

5. **`backdrop-filter` sur en-tête sticky** *(V1)* — recalcul de composition à
   chaque frame de défilement pour un gain visuel nul sur fond papier presque
   opaque. Remplacé par un fond opaque.

6. **Cibles tactiles < 24 px** *(V1)* — les liens de réseaux sociaux
   autonomes. Classe `.link-list` (`min-block-size: 1.5rem`).

7. **Fins de ligne du `.bat`** — `cmd.exe` exige CRLF et refuse l'UTF-8 selon
   la page de codes. Le fichier est en ASCII pur + CRLF.

---

## 14. À ne surtout pas régresser

**Contenu — bloquant**

- Aucun témoignage, chiffre, diplôme, poste, publication, partenaire,
  événement, certification, e-mail ou compte social **inventé**.
- `temoignages` reste vide tant qu'aucun témoignage réel n'est fourni.
- `certificatsDisponibles` reste `false`.
- `programmeIsProvisional` reste `true` tant que le programme définitif
  n'est pas reçu.
- Le JSON-LD ne déclare **ni note, ni avis, ni prix, ni adresse**.
- L'IPRIG ne délivre **ni diplôme ni certification reconnue par l'État** —
  c'est écrit dans la FAQ, les mentions légales et `/programme`.
- Les événements sont des **opportunités**, jamais des garanties.

**Technique**

- JS ≤ 2 Ko, aucune directive `client:*`, aucune dépendance d'animation.
- URL Patreon **uniquement** dans `site.ts`.
- Tous les liens externes en `target="_blank"` + `rel="noopener noreferrer"`
  + mention « nouvelle fenêtre » pour les lecteurs d'écran.
- `notRevealed = 0` sur les 42 contrôles.
- 83 tests fonctionnels au vert.

**Direction artistique**

- Quatre gestes de motion, pas cinq.
- Trois surtitres dorés maximum sur l'accueil.
- Au moins trois des quatre rythmes verticaux employés.
- Les deux CTA ne se ressemblent pas (compact horizontal vs affiche immersive).
- Quatre fallbacks photo distincts.
- Pas de carte fond + bordure + rayon là où un filet suffit.
- Pas de symétrie systématique.

Le skill **`iprig-quality-gate`** (`.claude/skills/iprig-quality-gate/SKILL.md`)
vérifie tout cela bloc par bloc. **À exécuter avant toute livraison.**

---

## 15. Éléments encore manquants du client

Liste complète et à jour dans `iprig/CONTENT_TODO.md`. En résumé :

**Bloquant avant mise en ligne**
- Validation de la biographie et des intitulés académiques de Kevan Gafaïti.
- Validation des chiffres (« plusieurs centaines », « ≈ 40 », « ≈ 50 »).
- **Validation de la formulation du prix** (voir § 16).
- Confirmation de l'URL Patreon.
- Informations légales : éditeur, forme juridique, adresse, SIRET/RCS,
  directeur de la publication.
- Année de création de l'IPRIG (copyright du pied de page).

**Identité**
- Logo IPRIG définitif (SVG) → `src/assets/brand/`, puis suivre les
  instructions en tête de `Wordmark.astro`.
- Favicon dérivé du logo.
- Slogan définitif (le slogan actuel est provisoire).

**Photographies** — droits d'usage à confirmer pour chacune
- Portrait professionnel de Kevan Gafaïti (vertical).
- Photo de session IPRIG.
- 2 à 4 photos de conférences ou d'événements (horizontal).
- Visuel de partage social 1200 × 630 (optionnel).

**Contenu**
- Programme 2026-2027 définitif → `programme.ts`, puis
  `programmeIsProvisional = false`.
- 3 à 6 témoignages réels avec accord écrit → `temoignages.ts`.

**Contacts**
- E-mail officiel IPRIG.
- Instagram et LinkedIn IPRIG — **l'IPRIG a-t-il ses propres comptes, ou
  utilise-t-il ceux de Kevan Explique ?** Question ouverte.
- TikTok, YouTube, podcast Kevan Explique.
- Vérification de `communitySize` (« ≈ 75 000 », donnée volatile).

**Plus tard**
- URL du site de l'IRIG.
- Formations spécialisées 2027 : préciser leur **statut exact** (certifiantes
  ou non). Distinction juridiquement importante.
- Accès Hostinger, par canal sécurisé, **jamais dans le dépôt**.

---

## 16. Formulation du prix — à revérifier

Le site affiche **29 € / mois** et précise, dans `offer.priceDetail` :

> « 28,80 € + TVA applicable, soit environ 29 € par mois. »

Cette formulation est **une interprétation** du brief initial, qui indiquait
« 28,80 € / mois, soit environ 29 € TTC / mois pour l'utilisateur ».

⚠ Le rapport exact entre 28,80 € et 29 € (HT/TTC, TVA applicable ou non,
commission Patreon) **n'a jamais été confirmé par le client**.
À faire valider mot pour mot avant la mise en ligne — c'est une mention
tarifaire opposable.

Un seul endroit à modifier : `site.ts` → `offer.priceDetail`.
Les valeurs affichées viennent de `offer.priceDisplay` (« 29 € ») et
`offer.pricePeriod` (« / mois »), reprises partout automatiquement.

---

## 17. Captures disponibles

Mêmes pages, mêmes formats, directement comparables.

```
iprig/screenshots/v1/    30 fichiers  — état avant la passe V2
iprig/screenshots/v2/    30 fichiers  — état actuel
```

Contenu de chaque dossier :

- pleine page, 7 pages × 3 formats (mobile 390, tablette 768, desktop 1440) ;
- `header-{desktop,mobile}-{haut,clair,sombre,bas}.png` — en-tête sticky à
  quatre positions de défilement, barre de progression comprise ;
- `drawer-mobile.png` — tiroir mobile ouvert ;
- `report.json` — résultat détaillé des 42 contrôles.

Régénérer : `npm run preview` puis
`node scripts/qa-screenshots.mjs http://localhost:4321 v3`.

---

## 18. Outillage QA

```
scripts/qa-functional.mjs    83 tests — liens, menu, FAQ, motion, SEO, no-JS
scripts/qa-screenshots.mjs   captures + 42 contrôles ; 2ᵉ arg = sous-dossier
scripts/qa-perf.mjs          poids, requêtes, JS, temps de chargement
scripts/qa-header.mjs        en-tête sticky à 4 positions + tiroir
scripts/qa-rhythm.mjs        hauteur de chaque section (arbitrages de longueur)
scripts/shot.mjs             capture ponctuelle d'une zone (itération)
scripts/crop.mjs             découpe une bande d'une capture pleine page
scripts/build-og-image.mjs   régénère public/og-image.png via sharp
```

Tous pilotent le Chrome installé à
`C:\Program Files\Google\Chrome\Application\chrome.exe`.
Sous Git Bash, préfixer par `MSYS_NO_PATHCONV=1` si un argument commence par
`/` — sinon le shell le convertit en chemin Windows.

---

## 19. État exact à la fin de la V2

- **Build vert** : 0 erreur, 0 warning, 0 hint. 7 pages, `dist/` = 540 Ko.
- **83 / 83** tests fonctionnels, **42 / 42** contrôles responsive et a11y.
- **Quality gate IPRIG vert** sur les 7 blocs.
- Site **non déployé**. `dist/` est prêt à copier dans `public_html/`.
  `.htaccess` livré dans `public/` (HTTPS forcé, canonique sans `www`, URLs
  propres, 404, compression, cache, en-têtes de sécurité).
- Aucun identifiant Hostinger nulle part. `.gitignore` en place.
- Serveur de preview **arrêté**.
- Le projet n'est **pas un dépôt Git** à ce stade.

### Notes V2 (autoévaluation, pour situer la reprise)

| | V1 | V2 |
|---|---|---|
| Contenu | 9,2 | 9,2 |
| Conversion | 8,7 | 9,0 |
| Typographie | 8,7 | 9,3 |
| UX mobile | 8,0 | 8,8 |
| Direction artistique | 7,7 | 9,0 |
| Originalité | 7,2 | 8,7 |
| Motion | 5,8 | 8,4 |
| Réduction effet « IA » | 7,0 | 8,6 |
| Accessibilité | 9,0 | 9,1 |
| **Global** | **8,2** | **8,9** |

### Ce qui plafonne aujourd'hui la note

1. **Les photographies.** Le levier décisif manque. Kevan en conférence, une
   salle de séance : cela transformera le hero et la section fondateur bien
   plus que n'importe quel réglage de grille. La structure les attend —
   elle ne peut pas les remplacer.
2. **Le logo.** Le wordmark typographique tient très bien lieu de logo, mais
   il reste un wordmark.
3. **Le programme définitif.** Les séances actuelles sont indicatives et le
   site le dit ; un vrai calendrier rendrait la section `/programme`
   nettement plus convaincante.

**Aucune de ces trois choses ne dépend du code.**
