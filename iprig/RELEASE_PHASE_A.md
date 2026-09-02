# IPRIG V4.1 — Phase A : préparation de la release Hostinger

> ## ⚠ DOCUMENT HISTORIQUE — le paquet décrit ici est PÉRIMÉ
>
> Cet audit porte sur la **V4.1**, et ses mesures sont conservées telles
> qu'elles ont été relevées. Le paquet qu'il décrit,
> `iprig-v4.1.0-public_html.zip`, **ne doit pas être déployé** : la V4.2 l'a
> remplacé par `iprig-v4.2.0-public_html.zip` (82 fichiers, 2 774 Kio,
> 5 enseignants, 11 certificats).
>
> **Ce qui reste valable :** la cartographie public/privé, les chemins, les
> règles de sécurité du paquet, le `.htaccess` et le fonctionnement du script
> `scripts/package-release.mjs`. La V4.2 les réemploie sans les modifier —
> à une exception près, documentée ici : `favicon.svg` est passé de la liste
> des fichiers REQUIS à celle des fichiers INTERDITS.
>
> **Ce qui ne l'est plus :** les totaux (10 certificats / 4 enseignants), le
> nombre de fichiers (81), le poids (2 666 Kio) et les empreintes SHA-256.
> Pour l'inventaire courant, lire `release/MANIFEST.txt`.

Audit et fabrication du paquet de déploiement, **exécutés en local uniquement**.
Rien n'a été mis en ligne, aucune connexion Hostinger n'a été ouverte, aucun DNS
touché, aucun secret créé.

| | |
|---|---|
| Base de départ | V4.1, commit `7e77990`, arbre de travail propre |
| Build | `astro check` **0 erreur / 0 avertissement / 0 indication**, 8 pages, 81 fichiers |
| Paquet produit | `release/iprig-v4.1.0-public_html.zip` — 2 666 Kio, CRC vérifié |
| Modifications applicatives | **3**, toutes justifiées par le déploiement ou la sécurité (§ 9) |
| Modifications éditoriales | **aucune** — textes, tarifs, enseignants, certificats intacts |
| État des endpoints PHP | **NON TESTÉS** — inchangé, aucun runtime PHP disponible (§ 10) |

---

## 1. Cartographie PUBLIC / PRIVÉ

Le site est statique. Trois fichiers PHP seulement s'exécutent côté serveur.
La ligne de partage est nette : **ce qui contient un secret ou une donnée
personnelle ne descend jamais dans la racine web.**

### PUBLIC — `public_html/`, servi par Apache/LiteSpeed

| Chemin | Nature | Lisible par le visiteur ? |
|---|---|---|
| `index.html` … `404.html` | 8 pages statiques | oui |
| `_astro/` | 11 CSS, 2 JS, 39 WebP, empreintés | oui |
| `fonts/` | 3 `.woff2` + 2 licences | oui |
| `favicon*`, `apple-touch-icon.png`, `og-image.png` | icônes et image de partage | oui |
| `robots.txt`, `sitemap-index.xml`, `sitemap-0.xml` | indexation | oui |
| `.htaccess` | HTTPS, canonique, URL propres, 404, cache, sécurité | non (Apache le refuse) |
| `api/contact.php` | endpoint formulaire contact | **exécuté**, jamais servi |
| `api/preinscription.php` | endpoint formulaire préinscription | **exécuté**, jamais servi |
| `api/certificats.json` | catalogue, lu par PHP **et** joignable en HTTP | oui (aucune donnée sensible) |
| `api/_lib.php` | socle commun | **non** — refusé par `api/.htaccess` |
| `api/config.sample.php` | modèle vide de tout secret | **non** — refusé par `api/.htaccess` |

### PRIVÉ — au-dessus de `public_html/`, jamais servi

| Chemin | Nature | Créé par |
|---|---|---|
| `public_html/api/config.php` | **secrets** : adresse de destination, sel | l'exploitant, à la main |
| `<parent>/iprig-data/preinscriptions.csv` | **données personnelles** | PHP, au premier envoi |
| `<parent>/iprig-data/messages.csv` | **données personnelles** | PHP, au premier envoi |
| `<parent>/iprig-data/rate/*.txt` | compteurs éphémères, aucune IP | PHP |
| `<parent>/iprig-data/.htaccess` | garde-fou | PHP, ou déposé à la main |

`config.php` est le seul fichier secret qui vive **dans** `public_html`. Il y est
obligé : `_lib.php` le charge par `__DIR__ . '/config.php'`. Il est protégé par
deux verrous indépendants — `api/.htaccess` le refuse, et PHP l'exécute au lieu
de le servir. Le premier suffit même si PHP était désactivé sur le compte.

### Jamais téléversé

`src/`, `scripts/`, `node_modules/`, `.git/`, `.astro/`, `screenshots/`,
`public/` (le dossier source), `*.md`, `package.json`, `package-lock.json`,
`tsconfig.json`, `astro.config.mjs`, `.env*`, `preview.log`, `*.csv`, `*.zip`.

Ce n'est pas une consigne, c'est une **vérification** : `scripts/package-release.mjs`
refuse de produire l'archive si l'un de ces motifs apparaît dans `dist/` (§ 7).

---

## 2. Les trois points d'entrée PHP

### `POST /api/contact.php`

| | |
|---|---|
| Source | `public/api/contact.php` → `dist/api/contact.php` |
| Formulaire | `/contact`, `<form action="/api/contact.php" method="post">` |
| Méthode | `POST` seulement — tout le reste répond **405** |
| Entrées | `email` (≤ 254), `objet` (≤ 150), `message` (10–5 000), `website` (pot de miel), `_t` (horodatage) |
| Validation | e-mail via `FILTER_VALIDATE_EMAIL` ; objet non vide ; message ≥ 10 signes ; CR/LF retirés de tout champ sur une ligne |
| Pot de miel | `website` non vide → **200 « envoyé »** sans rien envoyer |
| Horodatage | envoi < 2 s après chargement → **200 « envoyé »** sans rien envoyer |
| Limitation de débit | 5 envois / 600 s / empreinte salée d'IP → **429** |
| Destination | `MAIL_TO` de `config.php` ; `Reply-To` = adresse du visiteur, après validation |
| Dépendances | `_lib.php`, `config.php` |
| Fichiers privés | `<STORAGE_DIR>/messages.csv` (si `LOG_MESSAGES`), `<STORAGE_DIR>/rate/` |
| Sortie | JSON `{ok, message}` si `Accept: application/json` ou `X-Requested-With: fetch` ; sinon page HTML `noindex` |
| Codes | **200** succès · **403** origine étrangère · **405** méthode · **413** > 64 Kio · **422** validation · **429** débit · **500** e-mail *et* CSV en échec |

### `POST /api/preinscription.php`

| | |
|---|---|
| Source | `public/api/preinscription.php` → `dist/api/preinscription.php` |
| Formulaire | `/certificats#preinscription` |
| Entrées | `nom` (2–120), `email`, `certificats[]` (1–20), `message` (facultatif, ≤ 3 000), `website`, `_t` |
| Validation | identifiants confrontés à `api/certificats.json` — la **même** source que les cases à cocher ; forme imposée `^[a-z0-9-]{3,64}$` |
| Repli | catalogue illisible → validation de forme seule, ligne à vérifier à la main (une candidature ne se perd pas sur un fichier manquant) |
| Gardes | identiques à contact |
| Fichiers privés | `<STORAGE_DIR>/preinscriptions.csv` — 6 colonnes, statut initial `Nouveau` |
| Codes | identiques à contact |
| ⚠ | **aucun paiement** — préinscription seule, ni panier ni Stripe |

### `GET /api/certificats.json`

Produit au build par `src/pages/api/certificats.json.ts`. Sortie statique, aucun
PHP. Contrôlé : **10 certificats, 4 enseignants**, et les 10 identifiants
correspondent exactement aux 10 `value=` des cases de `certificats.html`.

**Comportement inchangé.** Aucune validation, aucun code HTTP, aucun message n'a
été modifié.

---

## 3. Audit des chemins — verdict : portable

Tout usage du système de fichiers dans les trois PHP, sans exception :

| Fichier | Ligne | Expression | Résout vers |
|---|---|---|---|
| `_lib.php` | 55 | `__DIR__ . '/config.php'` | `<racine web>/api/config.php` |
| `_lib.php` | 318 | `dirname(__DIR__, 2) . '/iprig-data'` | **un cran au-dessus** de la racine web |
| `contact.php` | 18 | `require __DIR__ . '/_lib.php'` | voisin |
| `preinscription.php` | 27 | `require __DIR__ . '/_lib.php'` | voisin |
| `preinscription.php` | 51 | `__DIR__ . '/certificats.json'` | voisin |

**Aucun chemin absolu. Aucun `../` littéral. Aucun `getcwd()`, aucun
`DOCUMENT_ROOT`.** Tout est ancré sur `__DIR__`, c'est-à-dire sur l'emplacement
réel du script au moment de l'exécution.

Conséquence : la même archive fonctionne sur les deux dispositions Hostinger,
sans rien modifier.

```
domaine principal                        domaine additionnel
/home/uXXXXXXX/                          /home/uXXXXXXX/domains/iprig.fr/
├── public_html/api/  ← __DIR__          ├── public_html/api/  ← __DIR__
└── iprig-data/       ← données          └── iprig-data/       ← données
```

Dans les deux cas `iprig-data` tombe **hors** de `public_html`. C'est
l'objectif, et il est atteint par construction plutôt que par configuration.

Aucun chemin `C:\Users\...`, aucun chemin de développement, aucune dépendance à
`node_modules` ou au dépôt n'est requis en production. Vérifié aussi côté
frontend : `dist/` ne contient **aucune** occurrence de `localhost`, `127.0.0.1`,
`:4321`, `C:\Users` ou `/home/`.

### La seule faille de portabilité trouvée — corrigée

`STORAGE_DIR`, s'il était renseigné avec un chemin **relatif**, était utilisé
tel quel. PHP l'aurait alors résolu contre le dossier de travail du processus —
choisi par l'hébergeur, pas par nous. Selon la configuration LiteSpeed,
`iprig-data` pouvait ainsi atterrir **dans** `public_html`, rendant
`preinscriptions.csv` téléchargeable.

Corrigé : un `STORAGE_DIR` non absolu est ignoré, avec une ligne dans le journal
PHP, et le défaut — sûr par construction — reprend la main. Voir § 9.

---

## 4. Routes et rafraîchissement direct

`astro.config.mjs` fixe `build.format: 'file'`. Astro produit donc
`programme.html`, et non `programme/index.html`.

| URL | Fichier servi | Mécanisme |
|---|---|---|
| `/` | `index.html` | `DirectoryIndex`, natif |
| `/programme` | `programme.html` | **RewriteRule — requis** |
| `/certificats` | `certificats.html` | **RewriteRule — requis** |
| `/kevan-gafaiti` | `kevan-gafaiti.html` | **RewriteRule — requis** |
| `/contact` | `contact.html` | **RewriteRule — requis** |
| `/mentions-legales` | `mentions-legales.html` | **RewriteRule — requis** |
| `/politique-confidentialite` | `politique-confidentialite.html` | **RewriteRule — requis** |
| `/404` | `404.html` | **RewriteRule — requis** |
| `/api/certificats.json`, `/robots.txt`, `/sitemap-*.xml`, images, polices | eux-mêmes | fichier direct |

> ### ⚠ `.htaccess` n'est pas une option, c'est une pièce du site
>
> **7 pages sur 8 ne sont joignables que par la règle de réécriture.** Sans
> `.htaccess`, seule la page d'accueil répond ; tout le reste renvoie 404, y
> compris au rafraîchissement et à l'accès direct. C'est un fichier masqué :
> c'est la panne n° 1 de ce déploiement.

La règle en place est la plus économique possible — trois conditions, aucune
liste de routes à maintenir :

```apache
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ /$1.html [L]
```

Elle ne se déclenche que si le fichier demandé n'existe pas **et** que son
équivalent `.html` existe. Une nouvelle page ajoutée plus tard fonctionne sans
toucher au `.htaccess`. Rien à ajouter ; rien à retirer.

`ErrorDocument 404 /404.html` : sous-requête interne, donc `THE_REQUEST` reste la
demande d'origine — la règle qui retire `.html` ne s'y applique pas, et il n'y a
**pas de boucle de redirection**. Le vrai code 404 est conservé.

---

## 5. HTTPS et canonicalisation — déjà cohérents

Le domaine cible `https://iprig.fr` est écrit à **deux** endroits, et à deux
seulement :

| Emplacement | Valeur |
|---|---|
| `astro.config.mjs` → `SITE` | `https://iprig.fr` |
| `src/data/site.ts` → `site.url` | `https://iprig.fr` |

Tout le reste en découle au build. Vérifié sur le paquet produit :

- 8 balises `<link rel="canonical">` — toutes en `https://iprig.fr/…` ;
- 8 balises `og:url` — idem ;
- `og:image` → `https://iprig.fr/og-image.png` ;
- `sitemap-0.xml` → 5 URL, les deux pages légales exclues ;
- `robots.txt` → `Sitemap: https://iprig.fr/sitemap-index.xml`.

**Aucune URL de développement ni valeur provisoire.** Rien à corriger ici.

### www vs non-www — recommandation

**Retenir `https://iprig.fr` sans `www`**, ce que le code affirme déjà partout.
`https://www.iprig.fr` doit rediriger en **301** vers la version sans `www`.

La règle est déjà dans `.htaccess` :

```apache
RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [L,R=301]
```

> ### ⚠ Ne pas doubler la règle
>
> Si hPanel propose une redirection `www` → non-`www`, **n'en activer qu'une
> seule des deux**. Deux règles concurrentes produisent au mieux un saut de
> redirection supplémentaire, au pire une boucle. La règle `.htaccess` livrée
> suffit : ne rien activer côté panneau.
>
> Le forçage HTTPS, en revanche, peut cohabiter : les deux redirigent vers la
> même cible, sans conflit. C'est même souhaitable — le panneau agit avant PHP.

Détail mesuré, sans gravité : `http://www.iprig.fr/x` fait **deux** sauts
(HTTPS d'abord, puis `www`) au lieu d'un. Corriger imposerait de fusionner deux
règles aujourd'hui lisibles et sûres, pour un gain nul en pratique. Laissé tel
quel, sciemment.

---

## 6. Structure Hostinger retenue

```
/home/uXXXXXXX/domains/iprig.fr/          ← ou /home/uXXXXXXX/ (domaine principal)
│
├── public_html/                          ← contenu de l'archive, extrait ICI
│   ├── .htaccess                         ⚠ masqué — indispensable
│   ├── index.html  programme.html  certificats.html  kevan-gafaiti.html
│   ├── contact.html  mentions-legales.html  politique-confidentialite.html
│   ├── 404.html
│   ├── robots.txt  sitemap-index.xml  sitemap-0.xml
│   ├── favicon.svg  favicon-32/192/512.png  apple-touch-icon.png  og-image.png
│   ├── _astro/                           52 fichiers empreintés
│   ├── fonts/                            5 fichiers
│   └── api/
│       ├── .htaccess                     refuse tout sauf les 3 fichiers utiles
│       ├── contact.php  preinscription.php     ← exécutés
│       ├── _lib.php                            ← refusé en HTTP
│       ├── certificats.json                    ← lu par PHP et servi
│       ├── config.sample.php                   ← modèle, refusé en HTTP
│       └── config.php                    ⚠ À CRÉER — hors archive, hors dépôt
│
└── iprig-data/                           ⚠ À CRÉER — hors racine web
    ├── .htaccess                         Require all denied
    ├── preinscriptions.csv               créé au premier envoi
    ├── messages.csv                       créé au premier envoi
    └── rate/                              compteurs éphémères
```

Cette disposition n'est pas un modèle plaqué : elle est **celle que le code
suppose déjà**. `dirname(__DIR__, 2)` place `iprig-data` exactement là, sans
qu'aucun chemin n'ait à être saisi.

---

## 7. Le paquet, et comment il est vérifié

```bash
npm run release          # build + vérification + archive
npm run release:only     # archive seule, si dist/ est déjà à jour
```

Produit dans `release/` — dossier **ignoré par Git** :

| Fichier | Rôle |
|---|---|
| `iprig-v4.1.0-public_html.zip` | 81 fichiers, 2 666 Kio, à extraire à la racine de `public_html` |
| `MANIFEST.txt` | inventaire exact, SHA-256 et taille de chaque fichier |
| `private/htaccess-pour-iprig-data.txt` | garde-fou à déposer dans `iprig-data/` |

Le script **refuse de produire l'archive** — il ne l'écrit pas du tout — si :

- l'un des **20 fichiers requis** manque (`.htaccess`, les 8 pages, les 3 PHP,
  le catalogue, les sitemaps…) ;
- un motif interdit apparaît : `.env`, `.git`, `node_modules`, `src`, `scripts`,
  `screenshots`, `config.php`, `*.csv`, `*.md`, `*.zip`, `*.log`, `*.key`,
  `*.pem`, `package.json`, `astro.config.*` ;
- une **adresse e-mail non tolérée** apparaît dans un fichier texte — trois
  seulement passent, toutes publiques : `prenom.nom@exemple.fr` (exemple des
  champs), `no-reply@iprig.fr` (expéditeur technique), `remplacer@example.com`
  (marqueur du modèle). Une vraie adresse de destination laissée dans
  `config.sample.php` fait donc échouer le paquet ;
- un fichier PHP commence par un **BOM UTF-8** — il produirait une sortie avant
  `header()` et casserait toutes les réponses JSON des formulaires.

Le passage est en outre normalisé : tous les fichiers texte et les `.htaccess`
sont réécrits en **LF**, et l'archive est fabriquée à la main pour garantir des
séparateurs **POSIX** et des permissions Unix `0644` — un ZIP Windows produit des
noms de fichiers à antislash à l'extraction côté serveur.

### Contrôles passés sur le paquet livré

| Contrôle | Résultat |
|---|---|
| `astro check` | 0 erreur, 0 avertissement, 0 indication (42 fichiers) |
| Build | 8 pages, aucune erreur |
| Intégrité CRC de l'archive | **OK** |
| Séparateurs de chemin | POSIX uniquement, aucun antislash |
| Chemins absolus ou `..` dans l'archive | aucun |
| Fidélité à `dist/` | 81/81 fichiers identiques au SHA-256 près |
| BOM en tête des PHP | aucun |
| `?>` de fin et espaces traînants | aucun |
| Fuite d'adresse e-mail | aucune |
| URL de développement dans `dist/` | aucune |
| Rendu du build (accueil + certificats) | conforme, **0 erreur console, 0 requête en échec** |

---

## 8. Le modèle de configuration

`public_html/api/config.sample.php` **est** le template demandé, et il ne
contient aucun secret. Il est versionné ; sa copie renseignée, `config.php`, ne
l'est jamais (`.gitignore`, `api/.htaccess`).

| Clé | Valeur livrée | À renseigner |
|---|---|---|
| `MAIL_TO` | `REMPLACER@example.com` | **oui** — adresse de destination |
| `MAIL_FROM` | `no-reply@iprig.fr` | non, sauf autre boîte technique |
| `STORAGE_DIR` | `''` | **non** — vide = défaut sûr, recommandé |
| `LOG_MESSAGES` | `true` | non |
| `WEBHOOK_URL` | `''` | non — facultatif |
| `RATE_LIMIT_MAX` / `_WINDOW` | `5` / `600` | non |
| `RATE_LIMIT_SALT` | `REMPLACER-PAR-UNE-CHAINE-ALEATOIRE-LONGUE` | **oui** — `openssl rand -hex 32` |
| `TIMEZONE` | `Europe/Paris` | non |

**Deux valeurs à saisir, pas davantage.** Aucune n'a été créée ici : ni adresse,
ni sel, ni webhook. C'est à l'exploitant de les produire, sur le serveur, en
phase B.

Tant que `config.php` n'existe pas, les pages s'affichent normalement et un envoi
de formulaire échoue **avec un message honnête**. Rien ne se perd en silence.

---

## 9. Les trois modifications applicatives

Aucune autre ligne de code applicatif n'a été touchée. Ni texte, ni tarif, ni
enseignant, ni certificat, ni composant, ni style, ni dépendance.

### 9.1 `STORAGE_DIR` relatif — portabilité

`_lib.php`, `iprig_storage_dir()`. Un chemin relatif était accepté et résolu
contre un dossier de travail que l'hébergeur choisit : les données personnelles
pouvaient atterrir dans `public_html`. Un chemin non absolu est désormais
ignoré — journal PHP, puis repli sur le défaut sûr. Ajout de
`iprig_is_absolute_path()` (POSIX, Windows, UNC).

**Aucun changement dans le cas nominal** : `STORAGE_DIR` est vide par défaut et
le reste.

### 9.2 Expéditeur dérivé de l'en-tête `Host` — sécurité

`_lib.php`, `iprig_send_mail()`. L'expéditeur se construisait à partir de
`$_SERVER['HTTP_HOST']` — une valeur **fournie par le client** — et se retrouvait
dans l'en-tête `From:` et dans l'enveloppe `-f`. Par ailleurs, un `MAIL_FROM`
vide ou mal saisi dans `config.php` — oubli d'exploitant très plausible —
cassait silencieusement **tous** les envois.

Désormais : `MAIL_FROM` est validé ; vide ou invalide, il retombe sur la
constante littérale `MAIL_FROM_DEFAUT = 'no-reply@iprig.fr'`. L'en-tête `Host`
n'intervient plus jamais dans un e-mail.

### 9.3 `package.json` : version `1.0.0` → `4.1.0`

L'archive s'appelait `iprig-v1.0.0-public_html.zip` alors qu'elle contient la
V4.1. Une release qui ne dit pas sa version rend le retour arrière (§ phase C)
impossible à conduire. Métadonnée seule, aucun effet sur le build.

### Ce qui a été vu et volontairement **non** corrigé

Ni l'un ni l'autre ne relève du déploiement ou de la sécurité Hostinger.

- **`iprig_rate_limit()` purge à chaque requête**, alors que le commentaire
  annonce « au plus une fois par fenêtre ». Écart commentaire/code, sans effet
  pratique — le dossier ne contient qu'une poignée de fichiers.
- **Le compteur de débit s'incrémente aussi sur les échecs de validation (422)**,
  donc cinq fautes de frappe verrouillent l'appareil pendant dix minutes. Point
  de confort, à arbitrer après observation du trafic réel.

### Hygiène, hors code applicatif

- `public/api/_lib.php` était en **CRLF** dans la copie de travail alors que le
  dépôt le stocke en LF. Normalisé — **contenu inchangé, même empreinte blob
  Git**, aucun diff. Le fichier téléversé sera identique à la version versionnée.
- `release/` ajouté au `.gitignore` : un paquet de déploiement se régénère, il
  ne se versionne pas.
- `.claude/launch.json` : ajout d'une configuration `iprig-release-check` sur le
  port 4399, pour contrôler un build sans entrer en conflit avec un serveur de
  développement déjà lancé sur 4321.

---

## 10. Ce qui reste NON TESTÉ

**Les trois endpoints PHP n'ont jamais été exécutés.** Aucun interpréteur PHP
n'existe sur la machine de développement — vérifié : ni sur le `PATH`, ni dans
XAMPP, Laragon, WAMP, ni sous WSL. Le code a été relu ligne à ligne, les chemins
audités, la structure vérifiée ; **il n'a pas tourné.**

Cette sémantique est **inchangée depuis la V4.1** et le restera jusqu'aux tests
de la phase C, décrits dans `DEPLOY_HOSTINGER.md` § Phase C. Ne déclarer les
formulaires validés qu'après ces tests, sur le serveur, avec de vraies adresses.

Ne sont pas non plus vérifiables en local :

- l'application effective des règles `.htaccess` par LiteSpeed ;
- la disponibilité et le comportement de `mail()` sur le compte Hostinger ;
- les droits d'écriture réels sur `iprig-data` ;
- le certificat SSL et la redirection HTTPS ;
- l'acceptation de la directive `Options -Indexes` (cause classique de 500 sur
  mutualisé si `AllowOverride` est restreint — diagnostic prévu en phase B).

---

## 11. Suite

| Phase | Contenu | Document |
|---|---|---|
| **B** | souscription, téléversement, `config.php`, `iprig-data`, SSL | `DEPLOY_HOSTINGER.md` § Phase B |
| **C** | tests de production, dont les 5 tests PHP, et retour arrière | `DEPLOY_HOSTINGER.md` § Phase C et § Retour arrière |

Rappels avant la phase B :

- `iprig/iprig-production.zip` (25/08/2026) est une archive **V3.1 périmée**,
  antérieure aux formulaires. **Ne jamais la téléverser.** La supprimer ou la
  renommer évite toute confusion — elle n'a aucune valeur de retour arrière
  puisque rien n'est en ligne.
- Le contenu en attente client n'a pas bougé : voir `CONTENT_TODO.md`. Aucun
  élément manquant n'a été inventé pour les besoins du déploiement.
