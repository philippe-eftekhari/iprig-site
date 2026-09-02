# Mettre `iprig.fr` en ligne chez Hostinger — V4.1

Procédure opérationnelle. Trois phases :

| Phase | Objet | Où |
|---|---|---|
| **A** | fabriquer et vérifier le paquet | en local — **faite**, voir `RELEASE_PHASE_A.md` |
| **B** | souscrire, téléverser, configurer | hPanel + Gestionnaire de fichiers |
| **C** | tester en production, puis livrer | navigateur, boîte e-mail |

Compter **45 à 60 minutes** la première fois — dont une bonne moitié à attendre
le certificat SSL. Moins de 10 minutes pour une mise à jour ultérieure.

> ### ⚠ Le site n'est plus purement statique depuis la V4
>
> Les versions précédentes de ce document affirmaient « ni PHP, ni base de
> données ». **C'est faux depuis la V4.** Le site porte deux formulaires qui
> envoient des e-mails et écrivent des données personnelles dans des fichiers
> CSV. Il faut donc, en plus du dépôt des fichiers :
>
> - **PHP 8.1 ou supérieur actif** sur le compte ;
> - un fichier `config.php` **créé à la main sur le serveur** ;
> - un dossier de données **hors de la racine web**.
>
> Sauter l'une de ces trois étapes ne casse pas l'affichage du site : les pages
> s'affichent normalement, mais tout envoi de formulaire échoue.

> ### ⚠ Aucun identifiant dans le dépôt
>
> Aucun mot de passe, clé SSH, identifiant FTP ou adresse de destination ne doit
> être écrit dans un fichier du projet, dans un script, dans un message ou dans
> une capture d'écran. Ils restent dans votre gestionnaire de mots de passe.
> `.gitignore` exclut déjà `.env`, `dist/`, `release/`, `api/config.php`, les
> `*.csv` et les clés.

---

# Ce qui est prêt

| | |
|---|---|
| Paquet | `release/iprig-v4.2.0-public_html.zip` — 82 fichiers, 2 774 Kio |
| Inventaire | `release/MANIFEST.txt` — SHA-256 de chaque fichier |
| Garde-fou données | `release/private/htaccess-pour-iprig-data.txt` |
| Contrôles | `astro check` 0/0/0 · CRC OK · chemins POSIX · aucune fuite d'adresse |

⚠ **Un seul paquet est déployable : celui qui se trouve dans `release/`.**
`release-archive/` et `iprig-production.zip` ne contiennent que des versions
périmées, conservées pour trace — voir `release-archive/LISEZ-MOI.md`. Déployer
l'ancien paquet 4.1.0 remettrait en ligne quatre enseignants, dix certificats
et un fondateur présenté comme doctorant.

Régénérer le paquet à tout moment :

```bash
npm run release
```

Le script refuse de produire l'archive si quoi que ce soit manque ou si un
fichier interdit s'y trouve — voir `RELEASE_PHASE_A.md` § 7.

> ### ⚠ `iprig-production.zip` est périmé
>
> Le fichier `iprig/iprig-production.zip` date du 25/08/2026 : c'est une archive
> **V3.1**, antérieure aux formulaires et aux certificats. **Ne jamais la
> téléverser.** La supprimer ou la renommer maintenant évite une confusion en
> phase B. La seule archive valide est celle de `release/`.

---

# PHASE B — Mise en place

## B0. État constaté au 25/08/2026 — à revérifier

| Élément | État constaté |
|---|---|
| `iprig.fr` | enregistré chez Hostinger, actif jusqu'au 07/08/2027 |
| Serveurs de noms | `ns1/ns2.dns-parking.com` — **parking** |
| Enregistrement A | `2.57.91.91` — nœud de parking |
| Enregistrements MX | **aucun** — pas de messagerie, rien à casser |
| Plan d'hébergement | **aucun** |

Tant qu'aucun plan n'est souscrit et que `iprig.fr` ne lui est pas rattaché, **il
n'y a nulle part où déposer les fichiers.** Revérifier ce tableau avant de
continuer : s'il est toujours à jour, commencer par B1.

## B1. Souscrire le plan

Le site a besoin de :

1. **Apache ou LiteSpeed lisant `.htaccess`** — présent sur toutes les formules
   mutualisées Hostinger. Non négociable : 7 pages sur 8 en dépendent ;
2. **PHP 8.1+ avec `mail()` actif** — présent sur toutes les formules ;
3. **SSL gratuit** — idem ;
4. **accès SSH** — confortable, pas indispensable. À vérifier sur la fiche du
   plan. Sans SSH, tout se fait au Gestionnaire de fichiers.

> ⚠ À la souscription, Hostinger propose d'installer WordPress ou de lancer son
> créateur de site. **Refuser les deux** : ils écrivent dans `public_html` et
> entrent en conflit avec les fichiers du site.

Rattacher ensuite `iprig.fr` au plan, et **noter le chemin réel** de la racine
web — il diffère selon que le domaine est principal ou additionnel :

```
domaine principal    /home/uXXXXXXX/public_html/
domaine additionnel  /home/uXXXXXXX/domains/iprig.fr/public_html/
```

Ce chemin sert à toutes les étapes suivantes. Les deux fonctionnent sans rien
modifier dans le code.

## B2. Vérifier PHP

hPanel → **Avancé** → **Configuration PHP**.

- [ ] version **8.1 ou supérieure** ;
- [ ] `mail()` non désactivée (absente de `disable_functions`).

Si `mail()` est bloquée, ce n'est pas rédhibitoire : les demandes continuent
d'être enregistrées dans les CSV. Mais il faudra le savoir avant les tests C.

## B3. Sauvegarder l'existant

**Uniquement si `public_html` contient déjà un site.** Première mise en ligne :
passer à B4.

1. hPanel → **Fichiers** → **Gestionnaire de fichiers** → ouvrir `public_html`
2. Tout sélectionner → clic droit → **Compresser** → `backup_AAAA-MM-JJ.zip`
3. **Télécharger l'archive sur votre ordinateur**, puis la supprimer du serveur

Ne jamais vider `public_html` sans avoir cette sauvegarde en local :
l'opération est irréversible sur un mutualisé.

## B4. Téléverser le site

1. hPanel → Gestionnaire de fichiers → ouvrir **`public_html`**
2. **Envoyer** → `release/iprig-v4.2.0-public_html.zip`  *(et non un paquet de `release-archive/`)*
3. Clic droit sur l'archive → **Extraire** → *dans le dossier courant*
4. **Supprimer l'archive** du serveur une fois extraite

`index.html` doit se retrouver **directement** dans `public_html/`, pas dans un
sous-dossier. C'est la cause n° 1 de page blanche.

L'archive est fabriquée avec des séparateurs POSIX et des permissions Unix
`0644` : l'extraction côté serveur produit l'arborescence correcte sans
retouche.

### Par FTP plutôt qu'au Gestionnaire de fichiers

Identifiants dans hPanel → **Fichiers** → **Comptes FTP**. Glisser le contenu de
`dist/` vers `public_html/`.

> ⚠ Activer **Serveur → Forcer l'affichage des fichiers cachés** dans FileZilla.
> Sans cela, **`.htaccess` et `api/.htaccess` ne partent pas** — et le site
> renvoie 404 sur toutes les pages sauf l'accueil.

### Vérifier ce qui est arrivé

- [ ] `public_html/index.html` existe
- [ ] `public_html/.htaccess` existe *(fichier masqué — activer l'affichage)*
- [ ] `public_html/_astro/` contient 52 fichiers
- [ ] `public_html/fonts/` contient 5 fichiers
- [ ] `public_html/api/` contient 6 fichiers, dont `api/.htaccess`
- [ ] aucun `.env`, aucun `.git`, aucun `.csv`, aucune archive

En cas de doute sur un fichier, `release/MANIFEST.txt` donne sa taille exacte et
son empreinte SHA-256.

### Fichiers Hostinger préexistants

Un `default.php` ou une page « Coming soon » peut être supprimé. Ne pas toucher
au reste sans l'avoir examiné.

## B5. Créer `config.php` — les deux seules valeurs à saisir

**C'est l'étape que rien ne remplace.** Sans elle, les formulaires échouent.

En SSH :

```bash
cd ~/domains/iprig.fr/public_html/api     # ou ~/public_html/api
cp config.sample.php config.php
nano config.php
chmod 600 config.php
```

Sans SSH : dans le Gestionnaire de fichiers, ouvrir `public_html/api`, copier
`config.sample.php`, renommer la copie en `config.php`, l'éditer.

Deux valeurs, pas davantage :

| Clé | Valeur à mettre |
|---|---|
| `MAIL_TO` | l'adresse qui reçoit les messages et les préinscriptions |
| `RATE_LIMIT_SALT` | une longue chaîne aléatoire — `openssl rand -hex 32`, ou tout générateur de mot de passe |

Tout le reste garde sa valeur livrée. En particulier **laisser `STORAGE_DIR`
vide** : le défaut place les données au bon endroit, hors de la racine web, sur
les deux dispositions Hostinger.

> ⚠ `MAIL_TO` ne doit apparaître nulle part ailleurs : ni dans le HTML, ni dans
> le JavaScript, ni dans un fichier versionné, ni dans une capture d'écran.
> `RATE_LIMIT_SALT` se génère **une fois** et ne se change plus.

## B6. Créer le dossier de données

```bash
mkdir -p ~/domains/iprig.fr/iprig-data          # ou ~/iprig-data
chmod 700 ~/domains/iprig.fr/iprig-data
```

⚠ **Un cran AU-DESSUS de `public_html`, jamais dedans.** Placé dedans,
`preinscriptions.csv` serait téléchargeable par quiconque devine son nom.

Y déposer ensuite le garde-fou : le contenu de
`release/private/htaccess-pour-iprig-data.txt`, dans un fichier nommé
`.htaccess`. PHP sait l'écrire lui-même au premier envoi, mais le déposer
maintenant protège dès la première seconde.

## B7. Activer HTTPS

1. hPanel → **Sécurité** → **SSL** → installer le certificat gratuit sur
   `iprig.fr` **et** `www.iprig.fr`
2. Activer **Forcer HTTPS**

Compter quelques minutes. Le `.htaccess` livré force également HTTPS : les deux
mécanismes visent la même cible et se complètent sans conflit.

## B8. Canonicalisation — ne pas doubler la règle

La version canonique est **`https://iprig.fr`, sans `www`**, ce que le code
affirme partout (balises `canonical`, `og:url`, sitemap).

La redirection `www` → non-`www` est **déjà dans le `.htaccess` livré**.

> ⚠ Si hPanel propose sa propre redirection `www`, **ne pas l'activer**. Deux
> règles concurrentes produisent au mieux un saut de redirection superflu, au
> pire une boucle. Une seule des deux, et c'est celle du `.htaccess`.

Pour basculer un jour sur `www.iprig.fr` comme adresse principale, il faudrait
inverser la règle du `.htaccess` **et** modifier `site.url` dans
`src/data/site.ts` **et** `SITE` dans `astro.config.mjs`, puis reconstruire. Les
trois doivent toujours dire la même chose.

## B9. Ne pas toucher aux MX

> ⚠ **Ne jamais modifier les enregistrements MX.** Ils gèrent la messagerie du
> domaine. Si une modification DNS paraît nécessaire, noter d'abord tous les
> enregistrements existants avant de changer quoi que ce soit.

Créer en revanche la boîte ou l'alias `no-reply@iprig.fr` (l'expéditeur
technique), et vérifier que **SPF et DKIM** sont publiés pour le domaine — sans
eux, les messages du site partent en indésirable.

---

# PHASE C — Tests de production

À faire **dans l'ordre**. Ne rien déclarer terminé avant C3.

## C1. Adresses et redirections

| Adresse | Résultat attendu |
|---|---|
| `https://iprig.fr` | page d'accueil |
| `http://iprig.fr` | **301** vers `https://iprig.fr` |
| `https://www.iprig.fr` | **301** vers `https://iprig.fr` |
| `https://iprig.fr/programme` | page programme |
| `https://iprig.fr/certificats` | page certificats |
| `https://iprig.fr/kevan-gafaiti` | page fondateur |
| `https://iprig.fr/contact` | page contact |
| `https://iprig.fr/mentions-legales` | page mentions légales |
| `https://iprig.fr/politique-confidentialite` | page confidentialité |
| `https://iprig.fr/nimportequoi` | page 404 du site, **avec un vrai code 404** |
| `https://iprig.fr/robots.txt` | texte |
| `https://iprig.fr/sitemap-index.xml` | XML |
| `https://iprig.fr/api/certificats.json` | JSON, **11 certificats, 5 enseignants** |

Sur chaque page : **recharger avec F5**, puis coller l'URL dans un onglet neuf.
Les deux doivent fonctionner. Si une page marche au clic mais pas au
rafraîchissement, `.htaccess` n'est pas lu — voir *En cas de problème*.

Le code 404 se vérifie en F12 → onglet **Réseau** → recharger → statut de la
première ligne. Il doit dire **404**, pas 200.

## C2. Fichiers sensibles — doivent être refusés

| Adresse | Attendu |
|---|---|
| `https://iprig.fr/api/config.php` | **403** |
| `https://iprig.fr/api/_lib.php` | **403** |
| `https://iprig.fr/api/config.sample.php` | **403** |
| `https://iprig.fr/api/` | **403**, aucun listing |
| `https://iprig.fr/iprig-data/preinscriptions.csv` | **404** — hors racine web |

> Si `config.php` répond **200 et affiche son contenu**, l'adresse de destination
> et le sel sont exposés : **arrêter immédiatement**, corriger `api/.htaccess`,
> puis régénérer `RATE_LIMIT_SALT`.

## C3. Les cinq tests PHP

Les endpoints PHP **n'ont jamais été exécutés** — aucun runtime PHP n'existait
sur la machine de développement. Ces cinq tests sont leur première exécution
réelle. **Ne pas déclarer les formulaires validés avant de les avoir tous
passés.**

1. **Contact.** Envoyer le formulaire de `/contact` avec une adresse réelle.
   → l'e-mail arrive dans la boîte `MAIL_TO`
   → `iprig-data/messages.csv` contient une ligne, accents corrects
   → répondre à l'e-mail part bien vers l'adresse du visiteur (`Reply-To`)

2. **Préinscription.** Envoyer `/certificats#preinscription` avec **deux**
   certificats cochés.
   → l'e-mail arrive, les deux intitulés y figurent
   → `iprig-data/preinscriptions.csv` a ses **6 colonnes** : horodatage, nom,
     e-mail, certificats, message, statut `Nouveau`
   → ouvrir le CSV dans Excel : les accents s'affichent (BOM UTF-8)

3. **Supprimer les deux lignes de test** des deux CSV.

4. **Limitation de débit.** Six envois d'affilée : le sixième doit être refusé
   avec un **429** et un message parlant de délai.

5. **Sans JavaScript.** Désactiver JS dans le navigateur, envoyer le formulaire
   de contact : une page de confirmation HTML doit s'afficher. Le site reste
   utilisable sans JavaScript.

**Si un e-mail n'arrive pas mais que la ligne CSV est là** : `mail()` est bloquée
ou les messages partent en indésirable. Vérifier SPF/DKIM et les indésirables.
Aucune demande n'est perdue le temps du diagnostic — c'est précisément le rôle de
la copie CSV.

## C4. Mobile, sur un vrai téléphone

- [ ] hero lisible, prix visible sans zoomer
- [ ] menu hamburger s'ouvre et se ferme
- [ ] boutons « Rejoindre l'IPRIG » ouvrent Patreon
- [ ] aucun défilement horizontal
- [ ] FAQ s'ouvre et se ferme
- [ ] formulaire de préinscription : cases cochables, envoi possible

## C5. Finitions

- [ ] Console (F12) : aucune erreur, aucun contenu mixte
- [ ] Réseau : aucune police ni image en 404
- [ ] Cadenas HTTPS valide
- [ ] Partager le lien sur WhatsApp ou LinkedIn : l'aperçu affiche le visuel
      IPRIG et le bon titre
- [ ] Lighthouse **sur l'adresse en ligne**, pas en local
- [ ] Soumettre `https://iprig.fr/sitemap-index.xml` à
      [Google Search Console](https://search.google.com/search-console)
- [ ] Conserver la sauvegarde précédente quelques jours

---

# Retour arrière

## Le site est cassé après une mise à jour

1. Gestionnaire de fichiers → `public_html` → tout sélectionner → **Supprimer**
2. Téléverser `backup_AAAA-MM-JJ.zip` (étape B3) → **Extraire** → supprimer le zip
3. Vérifier `https://iprig.fr` et une page profonde, par exemple `/programme`

**`api/config.php` et `iprig-data/` ne sont dans aucune sauvegarde de
`public_html`** — le premier parce qu'on ne sauvegarde pas un secret dans une
archive téléchargeable, le second parce qu'il est ailleurs. Ils survivent donc à
un retour arrière : rien à refaire côté configuration ni côté données.

Sauf si l'on a supprimé `public_html` **avec** `config.php` dedans : reprendre
alors l'étape **B5** seule. `RATE_LIMIT_SALT` peut reprendre sa valeur
précédente, ou une nouvelle — cela ne remet à zéro que les compteurs de débit.

## C'est la première mise en ligne et elle échoue

Il n'y a rien à restaurer : rien n'était en ligne. Vider `public_html`,
recommencer à **B4**. `iprig-data/` peut rester : il ne gêne pas, et un CSV déjà
créé conserve ses lignes.

## Revenir à une version antérieure du site

Chaque paquet est nommé par sa version (`iprig-v4.2.0-public_html.zip`) et
accompagné de son `MANIFEST.txt`. Conserver le dernier paquet mis en ligne
**hors du serveur** : c'est lui, et non `dist/`, qui permet de remettre
exactement ce qui tournait.

Pour reconstruire une version antérieure depuis le dépôt :

```bash
git checkout <commit>
npm ci
npm run release
```

⚠ `iprig/iprig-production.zip` (25/08/2026) **n'est pas** un point de retour :
c'est une V3.1 sans formulaires ni certificats.

---

# Mettre à jour le site plus tard

```bash
npm run release
```

Puis refaire **B3** (sauvegarde), **B4** (téléversement), **C1** et **C2**.
Les étapes B5 à B9 — configuration, données, SSL, domaine — ne se font
**qu'une seule fois**.

> ⚠ Ne jamais écraser `api/config.php` en téléversant : il n'est pas dans
> l'archive, mais une extraction « tout remplacer » sur un dossier `api/`
> préexistant ne doit pas le supprimer. Le vérifier après chaque mise à jour.

Si l'ancienne version s'affiche encore : `Ctrl` + `F5`, puis vider le cache dans
hPanel.

---

# En cas de problème

| Symptôme | Cause la plus fréquente |
|---|---|
| Page blanche | les fichiers sont dans un sous-dossier de `public_html` au lieu de sa racine |
| **404 sur toutes les pages sauf l'accueil** | **`.htaccess` absent** — fichier masqué non transféré |
| 404 au rafraîchissement seulement | `.htaccess` présent mais non lu — `AllowOverride` restreint, ouvrir un ticket Hostinger |
| **Erreur 500 sur tout le site** | une directive du `.htaccess` est refusée. Commenter `Options -Indexes` (les deux fichiers), recharger. Si cela repart, c'est `AllowOverride Options` qui manque |
| Site sans style | `_astro/` non transféré |
| Polices non chargées | `fonts/` non transféré |
| Formulaire : « L'envoi a échoué » | `config.php` absent ou `MAIL_TO` invalide |
| Formulaire OK mais aucun e-mail | `mail()` bloquée, ou SPF/DKIM absents — vérifier le CSV, la ligne doit y être |
| CSV jamais créé | `iprig-data/` non créé, ou non inscriptible — voir le journal PHP dans hPanel |
| Accents cassés dans Excel | le fichier a été réenregistré sans son BOM UTF-8 |
| `config.php` téléchargeable | `api/.htaccess` non transféré → **régénérer le sel après correction** |
| Boucle de redirection | redirection `www` activée **à la fois** dans hPanel et dans `.htaccess` |
| SSL indisponible | DNS pas encore propagé — attendre, puis réémettre |
| Ancienne version affichée | cache navigateur ou cache Hostinger |
| **E-mails du domaine coupés** | des MX ont été modifiés — **les restaurer immédiatement** |

---

# Après la mise en ligne

- Faire relire `/politique-confidentialite` par un juriste. Deux points restent
  à compléter par le client : l'identité du responsable de traitement et la
  durée exacte de conservation.
- Mettre à jour cette page si un jour `LOG_MESSAGES` passe à `false`, si un
  `WEBHOOK_URL` est configuré, ou si un outil de mesure d'audience est ajouté.
- Compléter les mentions légales : elles sont en `noindex` et hors sitemap tant
  que `legal.editor` vaut `null` dans `src/data/site.ts`. Les renseigner les
  réintègre automatiquement.
- Relever les CSV régulièrement, et mettre à jour la colonne `Statut` à la main.
- Reste en attente client : voir `CONTENT_TODO.md`.
