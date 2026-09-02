# Site IPRIG — `iprig.fr`

Site officiel de l'Institut de préparation aux relations internationales et à
la géopolitique.

Ce guide est écrit pour être utilisable **sans être développeur**. Il explique
comment lancer le site et, surtout, **où modifier chaque contenu**.

---

## Le plus simple : double-cliquer

Dans le dossier parent `Kevan-Gafaiti-Digital`, il y a un fichier :

**`Lancer le site IPRIG.bat`**

Double-cliquer dessus suffit. Il installe ce qu'il faut à la première
utilisation, démarre le site et l'ouvre dans le navigateur. Une fenêtre noire
reste ouverte : appuyer sur une touche dedans arrête le site proprement.

Tant que cette fenêtre est ouverte, chaque modification d'un fichier s'affiche
toute seule dans le navigateur, sans recharger la page.

> Ce fichier doit rester à côté du dossier `iprig` — c'est ainsi qu'il le
> trouve. Ne pas le déplacer ailleurs.

---

## En ligne de commande

Il faut avoir [Node.js](https://nodejs.org) installé (version 22 ou plus).
Ouvrir un terminal dans le dossier `iprig/`, puis :

### 1. Installer (une seule fois)

```bash
npm install
```

### 2. Développer

```bash
npm run dev
```

Le site s'ouvre sur `http://localhost:4321`. Chaque modification enregistrée
s'affiche immédiatement, sans avoir à recharger.

### 3. Construire la version finale

```bash
npm run build
```

Produit le dossier `dist/` — c'est **ce dossier** qui part en ligne.
Si le build affiche une erreur, elle doit être corrigée avant de déployer.

### 4. Vérifier la version finale avant mise en ligne

```bash
npm run preview
```

Sert le contenu de `dist/` exactement comme le fera l'hébergeur.

### 5. Fabriquer le paquet à mettre en ligne

```bash
npm run release
```

Construit le site **et** vérifie son contenu, puis écrit dans `release/` :

- `iprig-v<version>-public_html.zip` — à extraire à la racine de `public_html` ;
- `MANIFEST.txt` — inventaire exact, avec la taille et l'empreinte SHA-256 de
  chaque fichier ;
- `private/` — le garde-fou du dossier de données privé.

Le script **refuse d'écrire l'archive** si un fichier requis manque, si un
fichier qui n'a rien à faire sur un serveur public s'y trouve (`src/`, `.env`,
`config.php`, un `.csv`, un `.md`…), si une adresse e-mail non tolérée y
apparaît, ou si un fichier PHP porte un BOM UTF-8.

La suite — souscription, téléversement, configuration serveur, tests de
production et retour arrière — est dans **`DEPLOY_HOSTINGER.md`**.

> ⚠ Le site n'est plus purement statique depuis la V4 : deux formulaires sont
> servis par des fichiers PHP. Le déploiement demande donc, en plus des
> fichiers, un `config.php` créé sur le serveur et un dossier de données placé
> **hors de la racine web**.

---

## Où modifier quoi

Tous les textes et réglages sont regroupés dans **`src/data/`**.
Il n'y a jamais besoin d'aller chercher dans les composants.

### Les textes principaux, le prix, Patreon, les chiffres

**Fichier : `src/data/site.ts`**

| Ce que vous voulez changer | Ligne à chercher |
|---|---|
| Le slogan | `tagline:` |
| La phrase de présentation | `intro:` |
| Le titre et la description Google | `seo:` |
| **Le lien Patreon** | `patreonUrl:` |
| **Le prix affiché** | `priceDisplay:` et `priceDetail:` |
| Le texte des boutons | `ctaPrimary:` |
| Les chiffres (étudiants, séances, événements) | `stats:` |
| Le nombre d'abonnés Kevan Explique | `communitySize:` |
| L'adresse e-mail | `contact.email` |
| Instagram / LinkedIn IPRIG | `socialsIprig` |
| Comptes Kevan Explique | `socialsKevanExplique` |
| Mentions légales | `legal` |

> **Important — les champs `null`**
> Un champ qui vaut `null` (e-mail, réseau social, information légale) fait
> **disparaître proprement** l'élément du site. C'est voulu : mieux vaut ne
> rien afficher qu'un lien mort ou une information inventée.
> Dès que vous remplacez un `null` par une vraie valeur, l'élément apparaît
> automatiquement partout où il doit apparaître.

### Le menu

**Fichier : `src/data/navigation.ts`** — ajouter, retirer ou réordonner une
entrée met à jour d'un coup le menu desktop, le menu mobile et le pied de page.

### Le programme et les séances

**Fichier : `src/data/programme.ts`**

- `volets` — les quatre formes d'accompagnement (Sessions, Événements,
  Immersion, Rediffusions).
- `sessions` — **le programme des séances 2026-2027**, quinze entrées :
  semestre, numéro, date et intitulé. La page d'accueil en montre les quatre
  premières, la page `/programme` les affiche toutes, regroupées par semestre.
  Les totaux et le décompte du lien de l'accueil se calculent : rien à
  retoucher ailleurs quand une séance est ajoutée ou déplacée.
- **Ajouter une date du second semestre** : remplacer le `date: null` de la
  séance concernée par la date, dans la même forme que celles du premier
  semestre — `'Dimanche 11 octobre 2026'`. Rien d'autre. Tant qu'un `null`
  subsiste, la séance affiche « Date à venir » et le semestre porte sa note
  d'attente ; les deux disparaissent d'eux-mêmes une fois toutes les dates
  renseignées.
- `fonctionnement` — les trois étapes de l'adhésion.

### La présentation de Kevan

**Fichier : `src/data/kevan.ts`** — fonctions, biographie, établissements,
formation, domaines de recherche, Kevan Explique, IRIG.

### Les questions fréquentes

**Fichier : `src/data/faq.ts`** — ajouter une question, c'est ajouter un bloc
`{ question: …, answer: [ … ] }`. Chaque élément de `answer` devient un
paragraphe.

### Les témoignages

**Fichier : `src/data/temoignages.ts`**

La section témoignages **n'apparaît pas** tant que ce fichier est vide.
Dès que vous ajoutez un témoignage réel, elle apparaît toute seule :

```ts
export const temoignages: Temoignage[] = [
  {
    prenom: 'Prénom',
    formation: 'Master 1 Relations internationales',
    annee: '2026',
    texte: 'Le texte exact transmis par l’étudiant.',
    photo: null,
  },
];
```

⚠ **Ne jamais inventer de témoignage**, même « pour voir le rendu ».

---

## Le logo

Aujourd'hui, le site affiche un logo typographique temporaire : le mot
**IPRIG** composé en serif, précédé d'un petit losange laiton.

Quand le logo définitif arrivera :

1. déposer le fichier dans `src/assets/brand/iprig-logo.svg` ;
2. ouvrir `src/components/Wordmark.astro` ;
3. suivre les instructions en commentaire en haut du fichier.

Le logo est utilisé dans l'en-tête, le pied de page et le menu mobile : le
changer à un seul endroit suffit.

Le favicon (petite icône dans l'onglet) n'est pas un fichier à éditer : il
est **dérivé du logo officiel** par `npm run assets`, qui écrit
`public/favicon-32.png`, `favicon-192.png`, `favicon-512.png` et
`apple-touch-icon.png`. Changer le logo change donc le favicon, sans rien
faire de plus.

⚠ `public/favicon.svg` — le losange dessiné des premières versions — a été
supprimé en V4.2 et ne doit pas être recréé : `npm run release` refuse
désormais tout paquet qui en contiendrait un.

---

## Les photos

Aujourd'hui, chaque emplacement photo affiche une composition provisoire qui
lui est **propre** — repère de cadrage pour le hero, initiales pour le
portrait, composition typographique pour les séances, surfaces géométriques
pour les événements. Aucun motif ne se répète d'une section à l'autre, et la
mise en page est déjà jugeable.

**Où déposer les photos :**

| Dossier | Contenu attendu |
|---|---|
| `src/assets/kevan/` | portraits de Kevan Gafaïti |
| `src/assets/events/` | conférences, rencontres, événements |
| `src/assets/images/` | sessions, étudiants, ambiance |
| `src/assets/brand/` | logo et éléments d'identité |

**Comment ajouter une vraie photo** — il suffit de la passer au composant
`MediaSlot`, qui gère déjà tout le reste (cadre, format, légende, animation).

Ouvrir le fichier où se trouve l'emplacement, par exemple
`src/components/SectionFondateur.astro`, et ajouter deux lignes :

```astro
---
import portrait from '../assets/kevan/portrait.jpg';   // ← 1. importer
---

<MediaSlot
  src={portrait}                                        // ← 2. passer la photo
  fallback="founder"
  ratio="portrait"
  alt="Kevan Gafaïti"
  caption="Portrait de Kevan Gafaïti"
/>
```

Le fallback disparaît tout seul. Astro s'occupe du redimensionnement, des
formats modernes (AVIF/WebP) et du chargement différé.

> **Avant la mise en ligne**
> Dans `src/data/site.ts`, passer `showPendingMediaLabels` à `false`.
> Toutes les mentions « photographie à venir » disparaissent d'un coup, sans
> décaler la mise en page.

**L'image de partage** (celle qui s'affiche quand on partage le lien sur
Instagram, LinkedIn ou WhatsApp) est `public/og-image.png`. Elle est générée
par `npm run og`. Pour la remplacer par un visuel définitif, il suffit de
déposer un PNG de 1200 × 630 px à cet emplacement.

---

## Les pages

| Adresse | Fichier |
|---|---|
| `/` | `src/pages/index.astro` |
| `/programme` | `src/pages/programme.astro` |
| `/kevan-gafaiti` | `src/pages/kevan-gafaiti.astro` |
| `/contact` | `src/pages/contact.astro` |
| `/mentions-legales` | `src/pages/mentions-legales.astro` |
| `/politique-confidentialite` | `src/pages/politique-confidentialite.astro` |
| page d'erreur 404 | `src/pages/404.astro` |

---

## Les couleurs et la typographie

**Fichier : `src/styles/global.css`**, tout en haut, dans le bloc `:root`.

Les couleurs sont des variables réutilisées partout — changer
`--color-navy` change la couleur dans tout le site, d'un coup.

Les polices sont **Newsreader** (serif, pour les titres) et
**Instrument Sans** (pour le texte courant). Elles sont hébergées avec le site
dans `public/fonts/` — aucune requête vers Google Fonts, aucun cookie tiers.

---

## Vérifier le site

Lancer d'abord la version finale dans un terminal :

```bash
npm run preview
```

Puis, **dans un second terminal** :

```bash
npm run qa
```

Cela lance les trois contrôles automatiques (ils pilotent le Chrome déjà
installé sur la machine, aucun téléchargement) :

| Commande | Ce qu'elle vérifie |
|---|---|
| `npm run qa:tests` | 81 tests : liens Patreon, liens internes, ancres, menu mobile au clavier, Échap, FAQ, skip link, barre de progression, métadonnées, sitemap, JSON-LD, site sans JavaScript |
| `npm run qa:screens` | captures pleine page de 7 pages en 6 formats dans `screenshots/`, plus débordement horizontal, erreurs console, `alt` manquants, hiérarchie des titres, cibles tactiles |
| `npm run qa:perf` | poids réel des pages, nombre de requêtes, poids du JavaScript, temps de chargement |
| `npm run qa:header` | rendu de l'en-tête à différentes positions de défilement, et menu mobile ouvert |

⚠ **Regarder les captures** dans `screenshots/`, pas seulement le rapport :
un test vert ne garantit pas qu'une composition est réussie.

---

## Mise en ligne

Voir **`DEPLOY_HOSTINGER.md`** — procédure complète, étape par étape.

---

## Ce qu'il reste à fournir

Voir **`CONTENT_TODO.md`** — la liste des éléments à demander à Kevan.

---

## Notes techniques

- **Astro 7 + TypeScript**, génération statique, aucun serveur nécessaire.
- **Presque aucun JavaScript** : trois petits scripts natifs (menu mobile,
  en-tête, apparition des sections). Le site reste lisible sans JavaScript.
- **Aucun cookie, aucun tracker, aucun analytics** — donc aucune bannière de
  consentement à gérer.
- **Aucun formulaire** : le site ne collecte aucune donnée personnelle.
- Accessibilité visée : WCAG 2.2 niveau AA.
