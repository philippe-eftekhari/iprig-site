# IPRIG V4.2 — dossier de reprise

Document de passation du site `iprig.fr`, à jour de la **version 4.2**.
Écrit pour quelqu'un qui reprend le projet sans avoir suivi le chantier.

**Aucun mot de passe, aucune clé, aucune adresse e-mail réelle ne figure dans
ce fichier ni dans le dépôt.**

---

## 0. Ce que la V4.2 a changé

La V4.2 est la **dernière passe de contenu avant mise en ligne**. Comme la
V4.1, elle ne redessine rien : aucune page n'a été recomposée, aucun composant
ajouté, aucune dépendance introduite. Le hero, le rythme des sections, la
section « Le fondateur », la section « À qui s'adresse l'IPRIG » et toute la
page `/programme` sont **inchangés** — vérifié, pas supposé (voir § 15).

| Ce qui a changé | Détail |
|---|---|
| **Cinquième enseignant** | **Valentin Blondiau** rejoint le catalogue avec sa biographie, son portrait et un certificat, « Introduction à la Communication de crise ». Le catalogue passe de **10 à 11 certificats**, les enseignants de **4 à 5**. Sa biographie a été réécrite par le client le 02/09 : elle raconte son parcours et ne cite plus le titre de sa thèse. |
| **Ordre des enseignants** | Arrêté par le client : Kevan Gafaïti, Albert Kandemir, Valentin Blondiau, Balkissou Hayatou, Alain Coppolani. Le catalogue et le formulaire de préinscription suivent le même ordre. |
| **Kevan Gafaïti est docteur** | « Doctorant en science politique et relations internationales » devient **« Docteur en sciences politiques et relations internationales »**. Le titre de thèse abrégé laisse la place au titre complet, affiché en italique. |
| **Légende de la section fondateur** | « Kevan Gafaïti en colloque » devient « **Kevan Gafaïti** ». Le client a signalé que la mention du colloque n'était pas vérifiée ; l'`alt` perd le même qualificatif et garde ce que l'image montre — une prise de parole au micro. C'est la SEULE modification apportée à cette section. |
| **Photographie du premier écran** | La photographie assise du plateau de l'Académie (`Kevan-17`) laisse la place à une situation de prise de parole (`Kevan-01`) : debout, costume noir, chemise bleue. Plus dynamique, et l'enseignement s'y lit sans légende. |
| **Photographie de l'aperçu du programme** | `Kevan-01` étant montée au hero, cet emplacement reçoit `Kevan-10` — un salon d'apparat, des étudiants, un cadre institutionnel. Le rythme visuel de l'accueil devient : Kevan → contexte → Kevan. |
| **Cadrage de Kevan sur `/certificats`** | Même photographie, fenêtre 4:5 ancrée en bas et resserrée : le mur au-dessus de la tête disparaît presque, la main, le poignet et la montre occupent le bas du cadre. |
| **Section « L'institut »** | Trois formulations remplacées mot pour mot : « un choix » au lieu de « une orientation » ; l'accompagnement repose sur « une immersion pratique dans le champ géopolitique » ; l'Institut « s'adresse notamment aux étudiants de licence ». |
| **Casse des sept axes** | C'est le premier mot qui porte la majuscule, et lui seul : « Des événements », et non « des Événements ». |
| **Favicon** | `favicon.svg` — le losange laiton dessiné pour la V3.1 — a été **supprimé**. Il n'était plus référencé depuis la V4.0 mais partait encore dans le paquet. Les onglets lisent les PNG dérivés du logo officiel. |
| **Destination des formulaires** | Arrêtée par le client. Elle n'est écrite nulle part dans le dépôt — public — ni dans le site construit : rien n'a changé à l'architecture. |
| **Contrôles de QA** | Gardes ajoutées sur les trois formulations de l'institut, la casse des sept axes, le statut doctoral de Kevan, l'ordre des cinq enseignants, le certificat de Valentin. Totaux portés à 5 enseignants et 11 certificats. |

### Ce que la V4.2 n'a PAS touché

- la section **« Le fondateur »** — comparée au pixel : elle occupe la même
  position, à 0,04 % de pixels près (bruit d'anticrénelage) ;
- la section **« À qui s'adresse l'institut »** ;
- toute la page **`/programme`** — hauteur identique aux neuf formats ;
- les **tarifs** : 100 / 175 / 250 / 330 €. Onze certificats au catalogue ne
  veut pas dire qu'une tranche « 5 certificats » existe. Elle n'existe pas ;
- les **modalités** des certificats : février – avril 2027, dix séances d'une
  heure, à distance, examen terminal. Rien de plus n'est écrit.

---

## 0 bis. Ce que la V4.1 avait changé

*Conservé pour mémoire.* La V4.1 est une **passe corrective**, pas une
nouvelle version du site. Aucune
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
| `Kevan-01.JPG` | `kevan/hero-enseignement.jpg` | **Hero de l'accueil (V4.2)** | Debout, costume noir et chemise bleue, en train de parler : le geste d'enseignement se lit sans légende. Fenêtre 3/4 alignée sur le bas de l'image — le vide de tableau blanc au-dessus de la tête disparaît et le sujet remonte dans le cadre. |
| `Kevan-02.JPG` | `kevan/fondateur.jpg` | Section fondateur, accueil | Prise de parole en colloque. Seule photographie où le visage reste lisible dans une colonne de 490 px. Recadrée 4:5 sur le visage. |
| `Kevan-04.JPG` | `kevan/portrait.jpg` | `/kevan-gafaiti` | Vrai portrait, cadrage buste, fond sobre. |
| `Kevan-10.jpg` | `kevan/evenement-institutionnel.jpg` | **Aperçu du programme, accueil (V4.2)** | Salon d'apparat, étudiants assis, drapeaux : la salle et le public plutôt qu'un troisième portrait. C'est ce qui empêche l'accueil d'enchaîner trois fois le même visage. ⚠ Première photographie du site où des tiers apparaissent — voir `CONTENT_TODO.md`. |
| `Kevan-16.jpg` | `kevan/orientation.jpg` | `/programme` | Salle pleine, programme d'orientation projeté — exactement ce que fait l'IPRIG. |
| `Kevan-04.JPG` | `teachers/kevan-gafaiti.jpg` | Vignette `/certificats` | Même photographie que sa page, recadrée au format des vignettes. **V4.2 : fenêtre déclarée** — `anchor: 'bottom'` la fait descendre jusqu'au dernier pixel de la photo, `widthFrac: 0.87` la resserre en largeur, ce qui la raccourcit d'autant et laisse **59 px** de mur au-dessus du crâne au lieu de 266. Réglage calculé sur la source, pas tâtonné : haut des cheveux à y = 500, main à y ≈ 1550, image finie à 1616. En dessous de 0,86 le crâne est rogné. ⚠ **La photographie s'arrête aux mains** : aucun réglage ne fera apparaître davantage du corps, seule une autre source le pourrait. |
| `alain-coppolani.jpeg` | `teachers/alain-coppolani.jpg` | Vignette `/certificats` | Portrait fourni. |
| `albert-kandemir.jpeg` | `teachers/albert-kandemir.jpg` | Vignette `/certificats` | Portrait fourni. |
| `Balkissou-Hayatou.jpg` | `teachers/balkissou-hayatou.jpg` | Vignette `/certificats` | Portrait fourni le 31/08/2026. Même cadrage 4:5 que les autres. |
| `Valentin-Blondiau.jpg` | `teachers/valentin-blondiau.jpg` | Vignette `/certificats` | Portrait fourni le 01/09/2026. **Master de 640 × 800 et non 1600 × 2000** : la source ne fait que 400 × 400 px, et agrandir au-delà de la taille réellement affichée ne fabrique aucun détail. Une source plus définie remplacerait ce réglage d'une ligne. |
| `iprig-logo-cercle.png` | `brand/iprig-mark.png` + favicons | En-tête, pied de page, onglet | Détouré en rond, fond rendu transparent : la même image tient sur papier et sur marine. |
| `iprig-logo-complet.png` | `brand/iprig-logo-complet.png` | — | Conservé pour un usage futur (image de partage, documents). |

### Photographies NON retenues

| Source | Raison |
|---|---|
| `Kevan-03.png`, `Kevan-05.jpg` | Captures verticales 9:16 issues de vidéo. Utilisables, mais aucun emplacement du site n'a ce format. |
| `Kevan-06`, `Kevan-09`, `Kevan-14`, `Kevan-18` | Bonnes images de contexte, mais le sujet y est de dos ou de trois quarts éloigné. |
| `Kevan-08` | Amphithéâtre plein, excellente image de salle — mais **la personne qui parle n'est pas Kevan Gafaïti**, et une banderole IRIG y est lisible. Employée sur le site de l'IPRIG, elle laisserait croire à une séance de l'IPRIG animée par un tiers. Écartée pour cette raison, pas pour sa qualité. |
| `Kevan-17` | Plateau de l'Académie diplomatique et consulaire, assis. **Portait le hero jusqu'à la V4.1** ; retirée en V4.2 à la demande du client, qui la trouvait statique. Son master a été supprimé de `src/assets/`. La source, elle, est intacte : la réemployer ne demande qu'une entrée dans `prepare-assets.mjs`. |
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

Tout est dans `src/data/certificats.ts` : **onze certificats, cinq
enseignants**, quatre modalités, quatre tarifs, la validation, les textes de
préinscription.

**L'ordre des deux tableaux est signifiant.** `teachers` donne l'ordre des
vignettes ; `certificates` donne celui du formulaire de préinscription, et il
doit suivre le premier — Kevan (2), Albert (4), Valentin (1), Balkissou (2),
Alain (2). Insérer un certificat au mauvais endroit désaligne le formulaire de
la page sans qu'aucun total ne bouge : c'est le seul piège de ce fichier.

| Enseignant | Certificats |
|---|---|
| Kevan Gafaïti | Iran · golfe Persique |
| Albert Kandemir | Turquie · Caucase · Asie centrale · concept de puissance |
| **Valentin Blondiau** | **Communication de crise** |
| Balkissou Hayatou | Afrique de l'Ouest · Afrique centrale |
| Alain Coppolani | Afghanistan · finance islamique |

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

Voir `.env.example` pour le détail de chaque clé, et `DEPLOY_HOSTINGER.md`
§ B5–B6 pour la procédure pas-à-pas. En résumé, sur le serveur :

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

C'est toujours vrai en V4.2. La revue statique est passée : `MAIL_TO` est bien
lu depuis `config.php`, transmis à `mail()` comme destinataire, et l'adresse
n'apparaît nulle part dans le site construit. Mais **une revue statique n'est
pas un e-mail reçu** : tant que le premier envoi réel n'a pas abouti, l'état
des formulaires reste NON TESTÉ, pas « probablement bon ».

L'adresse de destination a été arrêtée par le client le 01/09/2026. **Elle
n'est écrite nulle part dans ce dépôt** : il est public, une adresse
versionnée est récoltée par les robots, et elle resterait dans l'historique
Git même effacée ensuite. Elle vit dans le brief, et sur le serveur dans
`config.php`. Elle n'est ni dans le HTML, ni dans le JavaScript, ni dans le
paquet de déploiement — `scripts/package-release.mjs` refuse l'archive si une
adresse non tolérée y apparaît.

À faire au premier déploiement, dans cet ordre :

1. envoyer le formulaire de contact avec une adresse réelle → vérifier la
   réception, et vérifier que `messages.csv` contient une ligne ;
2. envoyer une préinscription avec **deux** certificats cochés, dont
   « Introduction à la Communication de crise » → vérifier l'e-mail, puis
   ouvrir `preinscriptions.csv` et contrôler les six colonnes (horodatage,
   nom, e-mail, certificats, message, statut `Nouveau`). Le certificat de
   Valentin Blondiau est le plus récent : c'est celui qui prouve que la
   validation serveur lit bien le catalogue à jour ;
3. **supprimer ces deux lignes de test** ;
4. tenter six envois d'affilée → le sixième doit être refusé (limitation de
   débit) ;
5. vérifier depuis un navigateur que `https://iprig.fr/api/config.php` et
   `https://iprig.fr/api/_lib.php` répondent **403**.

Ne pas déclarer les formulaires validés avant d'avoir fait ces cinq points.

> Ces cinq points sont repris, détaillés et resitués dans leur procédure
> complète en **`DEPLOY_HOSTINGER.md` § Phase C**. L'audit de préparation qui
> les précède — cartographie public/privé, chemins, endpoints, paquet — est
> dans **`RELEASE_PHASE_A.md`**.

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

Le 01/09/2026, en V4.2 :

- **Valentin Blondiau** : nom, biographie, titre de thèse, portrait, et son
  certificat « Introduction à la Communication de crise » ;
- l'**ordre définitif des cinq enseignants** ;
- le **statut de docteur** de Kevan Gafaïti et le **titre complet** de sa
  thèse ;
- les **trois formulations** de la section « L'institut » ;
- la **casse des sept axes** ;
- l'**adresse de destination des formulaires**.

⚠ Trois graphies apparues dans des retours intermédiaires n'ont **jamais** été
publiées et ne doivent pas l'être : « Balkisu Ayatu », « Alan Kopelany »,
« Albert Kondemir ». `qa-content.mjs` échoue si l'une d'elles revient.

---

## 14. Pistes pour la suite

- Bandeau photographique pleine largeur, pour employer enfin `Kevan-12.jpg`.
  **Toujours l'asset recommandé** : ni la V4.1 ni la V4.2 n'ont créé de section
  pour lui, et c'était le bon arbitrage — une section inventée pour caser une
  image est une section de trop. `Kevan-12` est aussi le repli tout trouvé si
  les droits sur `Kevan-10` ne sont pas acquis : aucun tiers n'y figure.
- Portrait de Valentin Blondiau en meilleure définition. Le fichier actuel fait
  400 × 400 px ; sa vignette est un cran moins nette que les quatre autres.
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
node scripts/qa-screenshots.mjs http://localhost:4322 v4.3   # archive une campagne
```

⚠ **Passer le port réellement annoncé par `npm run preview`.** Un `astro dev`
déjà lancé garde le 4321 et la prévisualisation part sur 4322 ; les scripts de
QA détectent le serveur de développement et s'arrêtent plutôt que de mesurer
la mauvaise chose.

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

### V4.1 → V4.2 : ce que les mesures disent

`screenshots/v4.2/` archive la campagne complète — 8 pages × 9 formats,
`report.json` compris. Toutes les variations de hauteur s'expliquent, et
aucune n'est un accident :

| Page | Δ hauteur | Explication |
|---|---|---|
| `/programme`, `/contact`, les deux pages légales, `/404` | **0 px aux 9 formats** | Elles n'ont pas été touchées. |
| `/` | **0 px** en 1440, 1366 et 1920 ; −26 à −77 px sur les formats à une colonne | La section « L'institut » est en deux colonnes sur grand écran et sa hauteur est fixée par la colonne des sept axes, pas par le manifeste : raccourcir le paragraphe du public ne déplace donc rien. Sur téléphone et tablette, où tout s'empile, les textes plus courts se voient. |
| `/certificats` | **+352 px** sur grand écran, jusqu'à +674 px en 320 | La vignette de Valentin Blondiau. Sur écran étroit sa biographie se replie sur davantage de lignes : c'est la variation de hauteur assumée. |
| `/kevan-gafaiti` | **+45 px** | Le titre complet de la thèse, sur trois à cinq lignes selon le format. |

`hasOverflow`, `notRevealed`, `noAlt`, `headingJumps`, `smallTargets` et
`unsafeLinks` valent **0 partout**, aux 72 combinaisons.

La section « Le fondateur » de l'accueil a été comparée au pixel entre les deux
campagnes, sur une fenêtre de 1440 × 900 : **meilleur alignement à 0 px de
décalage**, 552 pixels sur 1 296 000 s'écartant de plus de 6/255, écart maximal
15/255. C'est du bruit d'anticrénelage. La section n'a pas bougé.
