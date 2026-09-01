# Mettre `iprig.fr` en ligne chez Hostinger

---

## État au 25 août 2026 — déploiement bloqué en amont

**Le domaine existe, l'hébergement Web n'existe pas encore.** Constaté le
25/08/2026, à revérifier avant toute reprise.

| Élément | État |
|---|---|
| `iprig.fr` | enregistré chez Hostinger, actif jusqu'au 07/08/2027, renouvellement automatique |
| Serveurs de noms | `ns1.dns-parking.com` / `ns2.dns-parking.com` — système de **parking** Hostinger |
| Enregistrement A | `2.57.91.91`, `Server: hcdn` — nœud de parking |
| Page servie | « Parked Domain name on Hostinger DNS system » |
| Enregistrements MX | **aucun** — pas de messagerie sur le domaine, rien à casser côté e-mail |
| Plan d'hébergement | **aucun** — hPanel → *Sites web* ne propose que l'achat d'un plan |

Tant qu'aucun plan d'hébergement n'est souscrit et que `iprig.fr` ne lui est pas
rattaché, **il n'y a nulle part où déposer `dist/`**. Aucune autre étape de ce
document ne peut aboutir.

### Ce qui est déjà prêt

- Build V3.1 validé : `astro check` 0/0/0, 84/84 tests fonctionnels,
  49/49 contrôles responsive et accessibilité sur 7 formats, 0 erreur console,
  0 requête en échec.
- `iprig-production.zip` — archive de secours du **contenu** de `dist/`
  (29 fichiers, `.htaccess` inclus, chemins POSIX). Ignorée par Git.
  Ne sert que si le plan retenu n'offre pas d'accès SSH.
- Paire de clés de déploiement `~/.ssh/iprig_hostinger` — **hors du dépôt**.
  Seule la clé publique `~/.ssh/iprig_hostinger.pub` se colle dans
  hPanel → *Avancé* → *Accès SSH* → *Gérer les clés SSH*.

### Critères de choix du plan

Le site est **statique** : 7 pages HTML, 540 Ko, ni PHP, ni base de données,
ni Node. Les seuls besoins réels sont :

1. Apache ou LiteSpeed lisant `.htaccess` — présent sur toutes les formules
   mutualisées Hostinger ;
2. certificat SSL gratuit — idem ;
3. **accès SSH** — pas garanti sur les formules d'entrée de gamme.
   À vérifier sur la fiche du plan avant achat. Sans SSH, le déploiement
   passe par le ZIP et le Gestionnaire de fichiers (étape 4 ci-dessous) :
   cela fonctionne, mais chaque mise à jour redevient manuelle.

⚠ À la souscription, Hostinger propose d'installer WordPress ou de lancer son
créateur de site. **Refuser les deux** : ils écrivent dans `public_html` et
entreraient en conflit avec le build Astro.

---


Le site est **statique** : ni base de données, ni PHP, ni serveur Node.
On construit un dossier de fichiers, on le copie sur l'hébergement, c'est tout.

Compter 30 à 45 minutes la première fois, moins de 10 minutes pour une mise
à jour.

---

## ⚠ Avant de commencer

**Aucun identifiant Hostinger, FTP ou SSH ne doit être écrit dans ce dépôt**,
ni dans un fichier, ni dans un script, ni dans un message. Les mots de passe
restent dans votre gestionnaire de mots de passe.

Le fichier `.gitignore` exclut déjà `.env`, `dist/` et les clés.

---

## 1. Construire le site

Dans un terminal, dans le dossier `iprig/` :

```bash
npm run build
```

Le build doit se terminer **sans erreur**. S'il y a une erreur, on la corrige
avant d'aller plus loin — on ne déploie jamais un build cassé.

Le résultat est le dossier **`dist/`**.

## 2. Vérifier le dossier `dist/`

```bash
npm run preview
```

Ouvrir l'adresse affichée et vérifier rapidement :

- [ ] la page d'accueil s'affiche correctement ;
- [ ] les polices et les couleurs sont bonnes ;
- [ ] le menu mobile s'ouvre (réduire la fenêtre) ;
- [ ] les boutons « Rejoindre l'IPRIG » pointent bien vers Patreon ;
- [ ] `/programme`, `/kevan-gafaiti`, `/contact` répondent ;
- [ ] une adresse inexistante affiche bien la page 404 du site.

Vérifier aussi que `dist/` contient bien :

```
dist/
├── index.html
├── programme.html
├── kevan-gafaiti.html
├── contact.html
├── mentions-legales.html
├── politique-confidentialite.html
├── 404.html
├── .htaccess          ← important, voir plus bas
├── robots.txt
├── sitemap-index.xml
├── sitemap-0.xml
├── favicon.svg
├── og-image.png
├── apple-touch-icon.png
├── fonts/
└── _astro/            ← CSS et JS
```

> **Le fichier `.htaccess` est masqué.** Sous Windows, activer « Éléments
> masqués » dans l'onglet Affichage de l'Explorateur pour le voir. Il est
> indispensable : c'est lui qui gère le HTTPS, les URL sans `.html` et la
> page 404.

Vérifier enfin qu'il n'y a **aucun** fichier `.env`, dossier `.git`,
sauvegarde ou clé dans `dist/`.

---

## 3. Sauvegarder la version précédente

**À faire uniquement si un site est déjà en ligne.** Pour une première mise en
ligne, passer à l'étape suivante.

1. hPanel → **Fichiers** → **Gestionnaire de fichiers**
2. Ouvrir `public_html`
3. Tout sélectionner → clic droit → **Compresser** → nommer
   `backup_AAAA-MM-JJ.zip`
4. **Télécharger l'archive sur votre ordinateur**, puis la supprimer du serveur

Ne jamais vider `public_html` sans avoir cette sauvegarde : l'opération est
irréversible sur un hébergement mutualisé.

---

## 4. Envoyer les fichiers

Le domaine `iprig.fr` étant déjà chez Hostinger, il est normalement déjà
rattaché à un dossier. **Vérifier lequel** avant de copier :

- domaine principal → `/home/<utilisateur>/public_html/`
- domaine additionnel → `/home/<utilisateur>/domains/iprig.fr/public_html/`

### Méthode simple — Gestionnaire de fichiers

1. Sur votre ordinateur, **entrer dans `dist/`**, tout sélectionner
   (y compris `.htaccess`), et créer une archive `site.zip`.
   ⚠ On compresse **le contenu** de `dist/`, pas le dossier `dist` lui-même.
2. hPanel → Gestionnaire de fichiers → ouvrir `public_html`
3. Bouton **Envoyer** → choisir `site.zip`
4. Clic droit sur `site.zip` → **Extraire** → dans le dossier courant
5. **Supprimer `site.zip`** du serveur une fois l'extraction faite

`index.html` doit se retrouver **directement** dans `public_html/`, pas dans un
sous-dossier. C'est la cause n°1 de page blanche.

### Méthode alternative — FTP

Identifiants dans hPanel → **Fichiers** → **Comptes FTP**.
Avec FileZilla, glisser le **contenu** de `dist/` vers `public_html/`.
Vérifier que FileZilla affiche les fichiers cachés
(Serveur → *Forcer l'affichage des fichiers cachés*), sinon `.htaccess` ne
sera pas transféré.

### Fichiers Hostinger déjà présents

Si `public_html` contient `default.php`, une page « Coming soon » ou un
`cgi-bin`, on peut supprimer `default.php` et la page d'attente. Ne pas
toucher au reste sans l'avoir examiné.

---

## 5. Domaine

Le domaine étant acheté chez Hostinger, il est déjà rattaché : **il n'y a
normalement rien à faire côté DNS**.

Vérifier simplement dans hPanel → **Domaines** que `iprig.fr` pointe bien vers
le bon dossier, et que `www.iprig.fr` est également configuré.

> ⚠ **Ne jamais modifier les enregistrements MX.** Ils gèrent les e-mails du
> domaine : les toucher coupe la messagerie. Si une modification DNS semble
> nécessaire, noter d'abord les enregistrements actuels avant tout changement.

---

## 6. Activer HTTPS

1. hPanel → **Sécurité** → **SSL**
2. Installer le certificat gratuit (Let's Encrypt) sur `iprig.fr`
3. Activer **Forcer HTTPS**

Compter quelques minutes. Le `.htaccess` livré force également la redirection
vers HTTPS, donc les deux mécanismes se complètent.

Vérifier ensuite qu'un cadenas s'affiche dans le navigateur et qu'il n'y a pas
d'avertissement de « contenu mixte » dans la console (F12).

---

## 7. Redirections et page 404

Tout est déjà dans le `.htaccess` livré avec le site :

- redirection permanente vers **HTTPS** ;
- redirection de `www.iprig.fr` vers **`iprig.fr`** (version canonique) ;
- URL propres : `/programme` sert `programme.html` ;
- page 404 : `ErrorDocument 404 /404.html` ;
- compression, cache et en-têtes de sécurité.

> Si vous préférez `www.iprig.fr` comme adresse principale, il faut **inverser
> la règle** dans le `.htaccess` **et** modifier `site.url` dans
> `src/data/site.ts` ainsi que `SITE` dans `astro.config.mjs`, puis rebuilder.
> Les deux doivent toujours dire la même chose.

---

## 8. Tester les adresses

Vérifier chacune de ces adresses dans le navigateur :

| Adresse | Résultat attendu |
|---|---|
| `https://iprig.fr` | page d'accueil |
| `http://iprig.fr` | redirige vers `https://iprig.fr` |
| `https://www.iprig.fr` | redirige vers `https://iprig.fr` |
| `https://iprig.fr/programme` | page programme |
| `https://iprig.fr/kevan-gafaiti` | page fondateur |
| `https://iprig.fr/contact` | page contact |
| `https://iprig.fr/mentions-legales` | page mentions légales |
| `https://iprig.fr/politique-confidentialite` | page confidentialité |
| `https://iprig.fr/nimportequoi` | **page 404 du site** |
| `https://iprig.fr/robots.txt` | fichier texte |
| `https://iprig.fr/sitemap-index.xml` | fichier XML |

La page 404 doit renvoyer un vrai code HTTP 404, pas un 200. Pour le vérifier :
F12 → onglet **Réseau** → recharger → regarder le statut de la première ligne.

---

## 9. Tester sur mobile

Ouvrir `https://iprig.fr` **sur un vrai téléphone**, pas seulement en mode
responsive du navigateur :

- [ ] le hero est lisible, le prix est visible sans zoomer ;
- [ ] le menu hamburger s'ouvre et se ferme ;
- [ ] les boutons « Rejoindre l'IPRIG » ouvrent bien Patreon ;
- [ ] aucun défilement horizontal ;
- [ ] la FAQ s'ouvre et se ferme.

---

## 10. Vérifications finales

- [ ] Console du navigateur (F12) : aucune erreur, aucun contenu mixte
- [ ] Onglet Réseau : aucune police ni image en 404
- [ ] Cadenas HTTPS valide
- [ ] Partager le lien dans une conversation WhatsApp ou LinkedIn : l'aperçu
      affiche bien le visuel IPRIG et le bon titre
- [ ] Lancer un test Lighthouse **sur l'adresse en ligne**, pas en local
- [ ] Soumettre `https://iprig.fr/sitemap-index.xml` dans
      [Google Search Console](https://search.google.com/search-console)
- [ ] Conserver la sauvegarde de la version précédente quelques jours

---

## Mettre à jour le site plus tard

```bash
npm run build
```

Puis refaire les étapes **3** (sauvegarde), **4** (envoi) et **8** (tests).
Les étapes domaine, SSL et redirections ne sont à faire qu'une seule fois.

Si l'ancienne version s'affiche encore : vider le cache du navigateur
(`Ctrl` + `F5`) et, si besoin, le cache dans hPanel.

---

## En cas de problème

| Symptôme | Cause la plus fréquente |
|---|---|
| Page blanche | les fichiers sont dans un sous-dossier de `public_html` au lieu de sa racine |
| Le site s'affiche sans style | le dossier `_astro/` n'a pas été transféré |
| Les polices ne chargent pas | le dossier `fonts/` n'a pas été transféré |
| 404 sur toutes les pages sauf l'accueil | le `.htaccess` est absent (fichier masqué non transféré) |
| SSL indisponible | DNS pas encore propagé — attendre, puis réémettre le certificat |
| Ancienne version affichée | cache navigateur ou cache Hostinger |
| E-mails du domaine coupés | des enregistrements MX ont été modifiés — les restaurer immédiatement |
