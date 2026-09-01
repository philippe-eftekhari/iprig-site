# IPRIG V4.1 — dossier de reprise

Document de passation du site `iprig.fr`, à jour de la **version 4.1**.
Écrit pour quelqu'un qui reprend le projet sans avoir suivi le chantier.

**Aucun mot de passe, aucune clé, aucune adresse e-mail réelle ne figure dans
ce fichier ni dans le dépôt.**

---

## 0. Ce que la V4.1 a changé

La V4.1 est une **passe corrective**, pas une nouvelle version du site. Aucune
page n'a été redessinée, aucun composant ajouté, aucune dépendance introduite.
Le hero, le rythme des pages, les trois filets de « Rejoindre, en pratique »,
les quatre séances et le pied de page sont **inchangés** — vérifié par
comparaison de captures V4.0 / V4.1 (voir § 15).

| Ce qui a changé | Détail |
|---|---|
| **Orthographe des enseignants** | « Alain Kopolani » → **Alain Coppolani** ; « Albert Kondemir » → **Albert Kandemir**. Graphies confirmées par le client. |
| **Biographies** | Celles d'Alain Coppolani et d'Albert Kandemir, fournies le 01/09/2026, sont intégrées. Les quatre enseignants ont désormais une biographie. |
| **Biographie de Balkissou Hayatou** | Version publique raccourcie (487 → 321 signes) pour équilibrer les quatre vignettes. La version source complète est conservée mot pour mot en commentaire dans `src/data/certificats.ts`. |
| **Apple Podcasts** | URL fournie le 01/09/2026 et intégrée. Sept plateformes en ligne, plus aucune « en attente ». |
| **Césure française** | `hyphenate-limit-chars` resserré de `6 3 3` à `10 4 4` : un mot de moins de dix lettres n'est plus jamais coupé. |
| **Élision des `alt`** | « Portrait **d'**Alain Coppolani » au lieu de « Portrait de Alain Coppolani ». |
| **Contrôles de QA** | Gardes ajoutées sur les graphies, le nombre d'enseignants et de certificats, l'équilibre des biographies, les sept plateformes. Deux formats mobiles ajoutés (360, 430). |

**⚠ « Keyvan » et « Kevan Gafaïti » sont deux personnes différentes.** Une
consigne portant sur « Keyvan » ne concerne jamais Kevan Gafaïti, fondateur de
l'IPRIG : il reste enseignant des certificats, présent sur l'accueil, sur sa
page, dans le bloc KevanExplique et dans le bloc IRIG. Ne jamais le retirer,
ne jamais transformer automatiquement l'un en l'autre.

---

## 1. Ce qu'est la V4

La V3.1 était un site de présentation. La V4 est le même site — même
identité, même direction artistique, même rythme — mais **il agit** :

- il porte deux formulaires qui envoient réellement quelque chose ;
- il présente une offre nouvelle, les certificats de géopolitique ;
- il montre de vraies photographies au lieu d'emplacements dessinés ;
- il n'affiche plus aucun chiffre invérifiable.

Ce n'est pas une refonte. Les composants, les tokens, la grille, les gestes
de motion et le langage éditorial de la V3.1 sont inchangés.

---

## 2. Routes

| Route | Fichier | Indexée |
|---|---|---|
| `/` | `src/pages/index.astro` | oui |
| `/programme` | `src/pages/programme.astro` | oui |
| `/certificats` | `src/pages/certificats.astro` | **oui — nouvelle** |
| `/kevan-gafaiti` | `src/pages/kevan-gafaiti.astro` | oui |
| `/contact` | `src/pages/contact.astro` | oui |
| `/mentions-legales` | `src/pages/mentions-legales.astro` | non (incomplète) |
| `/politique-confidentialite` | `src/pages/politique-confidentialite.astro` | non (incomplète) |
| `/404` | `src/pages/404.astro` | non |
| `/api/certificats.json` | `src/pages/api/certificats.json.ts` | non listée |

Les deux pages légales sont exclues du sitemap et portent `noindex` **tant que
`legal.editor` vaut `null`** dans `src/data/site.ts`. Renseigner l'éditeur les
réintègre automatiquement.

---

## 3. Où vit quoi

| Besoin | Fichier |
|---|---|
| Nom, accroche, SEO, prix, Patreon, **liens sociaux**, points d'entrée des formulaires, mentions légales | `src/data/site.ts` |
| Menu et ancres | `src/data/navigation.ts` |
| Section « L'institut » et ses **sept axes** | `src/data/institut.ts` |
| **Quatre volets**, **quatre séances**, étapes d'adhésion | `src/data/programme.ts` |
| Biographie, formation, KevanExplique, IRIG | `src/data/kevan.ts` |
| Questions fréquentes | `src/data/faq.ts` |
| **Catalogue, enseignants, modalités, tarifs, validation, préinscription** | `src/data/certificats.ts` |
| Couleurs, typographie, espacements, champs de formulaire, motion | `src/styles/global.css` |

**Aucune de ces valeurs n'est dupliquée dans un composant.** Les blocs présents
sur deux pages (les quatre volets, les quatre séances, la FAQ) lisent la même
source : `scripts/qa-content.mjs` le vérifie à chaque passage.

---

## 4. Photographies

Les originaux vivent **hors du dépôt**, dans `../../Photo Kevan`. Ils ne sont
jamais modifiés. `scripts/prepare-assets.mjs` en produit des masters web dans
`src/assets/`, qu'Astro décline ensuite au build (WebP, tailles multiples,
`srcset`, `lazy` hors premier écran).

```bash
npm run assets      # relancer après tout ajout ou changement de source
```

Aucune retouche esthétique n'est appliquée : pas de filtre, pas de saturation,
pas de vignettage, aucune modification de visage. Le script ne fait que
réorienter selon l'EXIF, recadrer là où c'est déclaré, redimensionner et
compresser.

### Photographies retenues

| Source | Master | Emplacement | Pourquoi |
|---|---|---|---|
| `Kevan-17.jpg` | `kevan/hero-academie.jpg` | Hero de l'accueil | Plateau de l'Académie diplomatique et consulaire : le registre est nommé dans l'image même. Recadrée (quart supérieur retiré) pour que le sujet passe au-dessus de la ligne de flottaison sur un portable 1366 × 768. |
| `Kevan-02.JPG` | `kevan/fondateur.jpg` | Section fondateur, accueil | Prise de parole en colloque. Seule photographie où le visage reste lisible dans une colonne de 490 px. Recadrée 4:5 sur le visage. |
| `Kevan-04.JPG` | `kevan/portrait.jpg` | `/kevan-gafaiti` | Vrai portrait, cadrage buste, fond sobre. |
| `Kevan-01.JPG` | `kevan/enseignement.jpg` | Aperçu du programme, accueil | Situation d'enseignement, format vertical. |
| `Kevan-16.jpg` | `kevan/orientation.jpg` | `/programme` | Salle pleine, programme d'orientation projeté — exactement ce que fait l'IPRIG. |
| `Kevan-04.JPG` | `teachers/kevan-gafaiti.jpg` | Vignette `/certificats` | Même photographie que sa page, recadrée au format des vignettes. |
| `alain-coppolani.jpeg` | `teachers/alain-coppolani.jpg` | Vignette `/certificats` | Portrait fourni. |
| `albert-kandemir.jpeg` | `teachers/albert-kandemir.jpg` | Vignette `/certificats` | Portrait fourni. |
| `Balkissou-Hayatou.jpg` | `teachers/balkissou-hayatou.jpg` | Vignette `/certificats` | Portrait fourni le 31/08/2026. Même cadrage 4:5 que les autres. |
| `iprig-logo-cercle.png` | `brand/iprig-mark.png` + favicons | En-tête, pied de page, onglet | Détouré en rond, fond rendu transparent : la même image tient sur papier et sur marine. |
| `iprig-logo-complet.png` | `brand/iprig-logo-complet.png` | — | Conservé pour un usage futur (image de partage, documents). |

### Photographies NON retenues

| Source | Raison |
|---|---|
| `Kevan-03.png`, `Kevan-05.jpg` | Captures verticales 9:16 issues de vidéo. Utilisables, mais aucun emplacement du site n'a ce format. |
| `Kevan-06`, `Kevan-09`, `Kevan-14`, `Kevan-18` | Bonnes images de contexte, mais le sujet y est de dos ou de trois quarts éloigné. |
| `Kevan-07`, `Kevan-10`, `Kevan-11` | Groupes et visites d'ambassade. Excellentes pour un futur bandeau pleine largeur ; aucun emplacement actuel ne leur convient. |
| `Kevan-08`, `Kevan-13` | Conférences. Redondantes avec `Kevan-02`, moins nettes sur le visage. |
| `Kevan-12.jpg` | Escalier d'honneur, drapeaux européen et français. **La plus belle image du lot**, mais le sujet y est trop petit pour les colonnes disponibles (490 px). À reprendre dès qu'un bandeau pleine largeur existera. |
| `Kevan-15.JPG` | Capture d'écran : bandes noires et barre système iOS. Proscrite en l'état. |
| `Kevan-19.jpeg` | Portrait LinkedIn carré, 500 × 500. Trop faible pour autre chose qu'une vignette. |

### Ajouter une photographie d'enseignant

1. déposer le fichier dans `../../Photo Kevan` ;
2. l'ajouter au tableau `TEACHERS` de `scripts/prepare-assets.mjs` ;
3. `npm run assets` ;
4. renseigner `photo: '<nom-du-fichier-sans-extension>'` dans
   `src/data/certificats.ts`.

Format attendu : **4:5, 1600 × 2000**. Sans photographie, la vignette affiche
les initiales dans un cadre de même format — la page ne bouge pas d'un pixel
quand le portrait arrive.

---

## 5. Certificats

Tout est dans `src/data/certificats.ts` : dix certificats, quatre enseignants,
quatre modalités, quatre tarifs, la validation, les textes de préinscription.

**En V4, la préinscription est le seul acte possible.** Aucun paiement, aucun
panier, aucun bouton « Acheter », aucun Stripe. Les tarifs (100 / 175 / 250 /
330 €) sont affichés à titre d'information ; la page dit explicitement
qu'aucun paiement n'est effectué sur le site.

**La validation repose sur un examen terminal, et rien de plus n'est écrit.**
Ni format, ni durée, ni note minimale, ni coefficient, ni rattrapage : ces
modalités n'existent pas encore. Ne pas les inventer.

Le même fichier alimente trois choses qui ne peuvent donc pas diverger :
la page, les cases du formulaire, et `/api/certificats.json` — lu par PHP pour
valider les certificats reçus.

---

## 6. Liens sociaux

Source unique : `socialLinks` dans `src/data/site.ts`. Une plateforme dont
l'URL vaut `null` **n'est jamais rendue comme un lien** ; elle apparaît en
toutes lettres sur la page Contact, suivie de « lien à venir ».

**Depuis la V4.1, les sept plateformes sont en ligne** : plus aucune n'est en
attente, le mécanisme de repli ne rend donc plus rien. Il reste en place pour
une plateforme future.

| Plateforme | État |
|---|---|
| Instagram | en ligne |
| YouTube | en ligne |
| TikTok | en ligne |
| Twitch | en ligne |
| LinkedIn | en ligne |
| Spotify | en ligne |
| **Apple Podcasts** | **en ligne — URL fournie le 01/09/2026** |

Chaque plateforme a son glyphe dans `SocialLinks.astro` ; celui d'Apple
Podcasts a été dessiné à la main sur la même grille 24 × 24 que les autres,
en `currentColor`, sans dépendance ajoutée.

Les adresses Spotify et LinkedIn sont stockées sous leur forme canonique :
même émission et même profil que les liens transmis par le client, sans les
paramètres de session (`?si=`, `&nd=`) ni les accents non encodés.

Ne jamais écrire `href="#"`.

**Composition.** Le bloc KevanExplique est une liste `flex` qui passe à la
ligne : à 1440 px elle se répartit 6 + 1, à 1024 px 4 + 3. Aucun débordement,
aucune troncature, cibles tactiles conformes à tous les formats testés. Si
l'on souhaitait un jour éviter la dernière ligne à un seul élément, le levier
serait l'écart horizontal du bloc — c'est un geste de design, pas un correctif.

---

## 7. Formulaires

Deux formulaires, une seule coque (`src/components/Form.astro`) :

| | Contact | Préinscription |
|---|---|---|
| Page | `/contact` | `/certificats#preinscription` |
| Champs | email, objet, message | nom, email, certificats (multiple), message facultatif |
| Point d'entrée | `public/api/contact.php` | `public/api/preinscription.php` |
| Effet | e-mail + copie CSV | e-mail + **ligne dans le tableau privé** |

**Sans JavaScript, les deux fonctionnent** : ce sont de vrais
`<form method="post">`, et PHP répond alors par une page de confirmation.

Gardes en place : pot de miel invisible, horodatage anti-envoi-instantané,
contrôle d'origine, limite de taille, limitation de débit, validation stricte
côté serveur, en-têtes d'e-mail non injectables (`Reply-To` seul porte une
donnée du visiteur, après validation).

### L'adresse de destination n'est pas dans le dépôt

Elle vit dans `public_html/api/config.php`, créé sur le serveur à partir de
`config.sample.php`. Elle n'apparaît ni dans le HTML, ni dans le JavaScript,
ni dans une réponse. `scripts/qa-content.mjs` échoue si une adresse e-mail
réapparaît dans le site construit.

---

## 8. Tableau privé des préinscriptions

**Technologie retenue : fichier CSV écrit par PHP, hors de `public_html`.**

Pourquoi : c'est la seule solution qui soit à la fois privée, sans identifiant
externe, exportable telle quelle (Excel, Numbers, Google Sheets) et
maintenable sans dépendance. Elle fonctionne le jour où l'hébergement est
souscrit, sans rien d'autre à configurer.

```
<STORAGE_DIR>/preinscriptions.csv
   Horodatage · Nom et prénom · E-mail · Certificats · Message · Statut

<STORAGE_DIR>/messages.csv
   Horodatage · E-mail · Objet · Message · Statut

<STORAGE_DIR>/rate/
   Compteurs éphémères de la limitation de débit. Aucune adresse IP.
```

Statut initial d'une préinscription : `Nouveau`. Il se met à jour à la main
dans le tableur.

CSV en UTF-8 **avec BOM** : Excel affiche correctement les accents.

### Vers Google Sheets, plus tard

Renseigner `WEBHOOK_URL` dans `config.php` : chaque demande est alors recopiée
en JSON vers l'URL indiquée (n8n, Make, ou un Google Apps Script publié en
application web). **Le secret reste côté serveur ; aucun identifiant Google ne
doit jamais atteindre le navigateur.** Vide, le relais est désactivé et les
formulaires fonctionnent normalement.

---

## 9. Configuration restante

Voir `.env.example` — procédure complète. En résumé, sur le serveur :

```bash
cd ~/domains/iprig.fr/public_html/api
cp config.sample.php config.php   # puis renseigner MAIL_TO, RATE_LIMIT_SALT
chmod 600 config.php
mkdir -p ~/domains/iprig.fr/iprig-data && chmod 700 ~/domains/iprig.fr/iprig-data
```

Tant que `config.php` n'existe pas, les pages s'affichent normalement mais un
envoi de formulaire échoue **avec un message honnête** : rien n'est perdu
silencieusement.

---

## 10. Confidentialité

`/politique-confidentialite` a changé de nature : la V3.1 affirmait « aucun
formulaire, aucune donnée personnelle ». C'est faux depuis la V4. La page dit
maintenant exactement ce que chaque formulaire collecte, pourquoi, qui y
accède et comment exercer ses droits.

Elle doit être **mise à jour** si :

- un outil de mesure d'audience est ajouté ;
- une lettre d'information est mise en place ;
- `LOG_MESSAGES` passe à `false` (la copie des messages n'existerait plus) ;
- un `WEBHOOK_URL` est configuré (un destinataire de plus à citer).

**Recommandation : faire relire cette page par un juriste avant la mise en
ligne définitive.** Deux points restent à compléter par le client : l'identité
du responsable de traitement, et la durée exacte de conservation — la page
emploie aujourd'hui une formulation prudente et vraie plutôt qu'un délai
inventé.

---

## 11. Construire et contrôler

```bash
npm run build      # astro check + build → dist/
npm run preview    # sert dist/  ⚠ note le port annoncé
npm run qa         # fonctionnel + contenu + formulaires + responsive + perf
```

⚠ **`astro dev` et `astro preview` visent tous deux le port 4321.** Un serveur
de développement déjà lancé garde le port, et la prévisualisation part sur
4322. Les scripts de QA refusent désormais de s'exécuter contre un serveur de
développement — ils le détectent et s'arrêtent. Toujours passer le port réel :

```bash
node scripts/qa-content.mjs http://localhost:4322
```

| Script | Ce qu'il contrôle |
|---|---|
| `qa-functional.mjs` | liens, menu mobile, FAQ, métadonnées, sitemap, typographie française |
| `qa-content.mjs` | formulations proscrites, source unique, catalogue, **fuite d'adresse e-mail** |
| `qa-forms.mjs` | validation, pot de miel, double envoi, erreurs serveur, sans-JS |
| `qa-screenshots.mjs` | 8 pages × 9 formats : débordement, console, `alt`, titres, cibles tactiles |
| `qa-perf.mjs` | poids, requêtes, temps de chargement |
| `typo-fr.mjs` | espaces insécables dans `src/data/` |

---

## 12. Ce qui n'a PAS été testé

**Les points d'entrée PHP.** Aucun interpréteur PHP n'est disponible sur la
machine de développement, et le domaine n'a pas encore d'hébergement. Le code
a été relu ligne à ligne, mais **il n'a jamais été exécuté**.

À faire au premier déploiement, dans cet ordre :

1. envoyer le formulaire de contact avec une adresse réelle → vérifier la
   réception, et vérifier que `messages.csv` contient une ligne ;
2. envoyer une préinscription avec **deux** certificats cochés → vérifier
   l'e-mail, puis ouvrir `preinscriptions.csv` et contrôler les six colonnes
   (horodatage, nom, e-mail, certificats, message, statut `Nouveau`) ;
3. **supprimer ces deux lignes de test** ;
4. tenter six envois d'affilée → le sixième doit être refusé (limitation de
   débit) ;
5. vérifier depuis un navigateur que `https://iprig.fr/api/config.php` et
   `https://iprig.fr/api/_lib.php` répondent **403**.

Ne pas déclarer les formulaires validés avant d'avoir fait ces cinq points.

---

## 13. En attente du client

- [ ] Programme annuel définitif (les quatre séances affichées sont des
      exemples validés, pas un calendrier).
- [ ] Créneaux horaires des certificats.
- [ ] Modalités précises de l'examen terminal — format, durée, note minimale,
      rattrapage. Seul le **principe** est écrit sur le site.
- [ ] Mention tarifaire opposable — voir `CONTENT_TODO.md`, question à poser
      mot pour mot.
- [ ] Informations légales complètes.
- [ ] Durée de conservation des données.
- [ ] URL du site de l'IRIG, lorsqu'il existera.

### Reçu et intégré — ne plus redemander

Le 31/08/2026 : photographie **et** biographie de **Balkissou Hayatou**. Son
nom, initialement noté « Balkisu Ayatu », a été corrigé par le client.

Le 01/09/2026, en V4.1 :

- l'orthographe **Alain Coppolani** et **Albert Kandemir**, qui tranche
  définitivement l'hésitation avec les graphies du brief V4 ;
- la **biographie d'Alain Coppolani** ;
- la **biographie d'Albert Kandemir** ;
- l'**URL Apple Podcasts**.

Leurs portraits avaient déjà été fournis et intégrés en V4.0.

---

## 14. Pistes pour la suite

- Bandeau photographique pleine largeur, pour employer enfin `Kevan-12.jpg`.
  **Toujours l'asset recommandé** : la V4.1 n'a créé aucune section pour lui,
  et c'était le bon arbitrage — une section inventée pour caser une image est
  une section de trop.
- Image de partage social composée avec le logo réel. `public/og-image.png`
  est aujourd'hui une composition typographique **propre et conforme à
  l'identité V4** (marine, Newsreader, losange laiton, filets) : ce n'est ni
  un gabarit provisoire ni un reliquat de V3. La V4.1 ne l'a donc pas touchée.
  Le seul gain possible serait d'y composer le logo circulaire réel.
- Programme annuel réel en remplacement des quatre séances d'exemple.
- Page IRIG, ou lien sortant une fois le site en ligne.
- Espace de suivi des préinscriptions plus confortable qu'un CSV, si le volume
  le justifie — pas avant.
- Certificats : passage de la préinscription à l'inscription, une fois les
  modalités arrêtées. Le champ `registrationStatus` est prévu pour cela.

---

## 15. Captures de référence

`screenshots/` archive une campagne par version. `v4/` et `v4.1/` permettent la
comparaison directe qui a servi à vérifier que la V4.1 n'a rien déplacé.

```bash
node scripts/qa-screenshots.mjs http://localhost:4321 v4.2   # archive une campagne
```

**⚠ Un diff pixel de page ENTIÈRE n'est pas exploitable sur ce site.** Les
révélations au scroll (`data-motion`) sont capturées dans un état intermédiaire
qui dépend du moment de la capture : deux campagnes du **même code** diffèrent
d'environ 2 % des pixels. Mesuré, pas supposé.

Ce qui est exploitable :

| Signal | Fiabilité |
|---|---|
| Captures `fold-*` (premier écran, révélation terminée) | déterministe |
| Hauteur totale de page | déterministe |
| Recadrage d'une zone précise, lu à l'œil | déterministe |

C'est ainsi que le hero a été déclaré inchangé en V4.1 : `fold-accueil` est
**identique au pixel** en 390 et en 1366, et ne s'écarte en 1440 que de
161 pixels dispersés à ≤ 2/255 — du bruit d'anticrénelage, invisible.

Les hauteurs de page ont augmenté de **56 px** partout : c'est exactement la
ligne « Apple Podcasts » ajoutée au pied de page. `/contact` n'a pris que
23 px, parce qu'elle a simultanément perdu la mention « Apple Podcasts —
lien à venir ».
