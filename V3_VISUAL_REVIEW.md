# V3_VISUAL_REVIEW — ce qui a changé, page par page

> Comparaison directe V2 → V3.
> Captures : `iprig/screenshots/v3-before/` (état V2, cinq formats) et
> `iprig/screenshots/v3/` (état V3, mêmes pages, mêmes formats).
> Les fichiers `fold-*.png` montrent le **premier écran** — ce qu'on voit en
> arrivant, sans défiler. Ce sont eux qu'il faut regarder en premier.
>
> Diagnostic complet : `V3_AUDIT.md`.

---

## Page d'accueil

### Ce qui a réellement gagné

**Le premier écran sur ordinateur portable.**
C'était le seul vrai défaut de composition de la V2, et il ne se voyait qu'en
1366 × 768 — un format que les captures V2 n'avaient jamais produit.

| | V2 | V3 |
|---|---|---|
| Wordmark IPRIG | 288 px | 246 px (−14,6 %) |
| Bas des boutons d'action | y = 916 | y = 780 |
| Ligne de flottaison | 768 | 768 |
| Résultat | **CTA 96 px sous l'écran** | **CTA visible, libellé entièrement lisible** |

Le masthead reste le geste dominant : il occupe encore près des deux tiers de
la largeur et la moitié de la hauteur visible. Il a simplement cessé d'ignorer
la hauteur de l'écran.
→ `fold-accueil-laptop-1366.png`, avant et après.

**En 1440 × 900, en 1920 × 1080 et sur MacBook 1512 × 982 : strictement rien
n'a bougé.** Vérifié au pixel — position et taille identiques de chaque bloc du
hero. Le coefficient de la nouvelle règle a été choisi pour cela.

**La ponctuation française.** 55 occurrences de texte visible employaient une
espace ordinaire devant `:` `;` `?` ou `€`. Elles sont toutes passées en
insécable. Le plus visible : « Prêt à commencer ? » en serif de 68 px, où
l'espace avant le point d'interrogation est passé de 15 à 7 px. Le plus utile :
« 29 € » ne peut plus se couper entre le nombre et le symbole.
Un test de non-régression garde désormais la règle.

**Les numéros ont trouvé leur ligne de base.** `01…07` et `I…IV` étaient
descendus à la main (`padding-block-start: 0.1em`, `0.15em`) dans des grilles
alignées sur le haut des boîtes ; ils flottaient 6 à 8 px sous leur titre.
Ils partagent maintenant sa ligne de base, par alignement de grille — c'est-à-
dire correctement à toutes les tailles d'écran, et avec deux déclarations en
moins.
→ `accueil-wide-1920.png`, sections « L'institut » et « L'expérience ».

**Le bandeau vert tient enfin sa hauteur.** Les filets verticaux couraient sur
73 px dans un bandeau de 235 px ; ils courent maintenant d'un bord à l'autre.
Le bandeau fait exactement la même hauteur qu'en V2 — c'est sa structure qui a
changé, pas sa densité.

**Les longueurs de ligne.** Les blocs de lecture tournaient entre 79 et
124 caractères par ligne, faute d'avoir mesuré ce que valait réellement `1ch`
avec ces polices. Ils sont revenus entre 63 et 76.

Mesuré au navigateur, ligne la plus longue de chaque bloc :

| Bloc | V2 | V3 |
|---|---|---|
| Réponses de la FAQ | 95 car. | **69** |
| Résumés de séance | 89 car. | **71** |
| Texte des sept apports | 79 car. | **76** |

Les blocs déjà confortables n'ont pas bougé : chapô des chapitres 56,
présentation de l'institut 61, texte des canaux de contact 67, chapô des
volets 74.

**Les repères chiffrés.** Les deux chiffres secondaires portaient le même bleu
profond que le chiffre dominant. Ils sont passés en encre douce : le bleu
redevient le signal du seul chiffre qui compte. La respiration basse de la
section, qui laissait croire qu'il manquait quelque chose sous les trois
chiffres, est resserrée — le changement de fond de la section suivante suffit
à la refermer.

**La mention tarifaire.** « 28,80 € + TVA applicable, soit environ 29 € par
mois » disparaît des quatre pages où elle figurait : elle était fausse. Le
site n'énonce plus que ce qui est certain. La question exacte à poser au
client est écrite dans `CONTENT_TODO.md` et dans `site.ts`.

**Le losange du hero sur téléphone.** Sous 410 px, il ouvrait une ligne au lieu
de séparer deux blocs : il devenait une puce décorative. Il ne s'affiche plus
que là où il sépare réellement quelque chose.

**Le CTA du bandeau sur téléphone** prend toute la largeur, comme celui du hero
et celui du tiroir. Trois CTA principaux, un seul geste au pouce.

### Ce qui est inchangé volontairement

- **Le masthead au-delà de 900 px de hauteur d'écran.** Aucune raison d'y
  toucher : il fonctionne.
- **La composition des grands titres.** « Une préparation, / pas une
  bibliothèque / de vidéos » : les retours à la ligne semblent voulus. Rien à
  gagner à les rejouer.
- **Le rythme des fonds et des densités.** Neuf sections, quatre densités,
  trois surtitres dorés. Le test « squint » distingue encore nettement
  ouverture, argument, expérience, programme, conversion, portrait, preuve,
  questions, clôture.
- **Le langage motion.** Quatre gestes, 18 éléments animés sur l'accueil.
  Aucun ajout.
- **L'affiche de clôture.** Le « 29 € » à 192 px, le filet, la relation avec
  « sans engagement » : rien à reprendre. Seule la mention tarifaire du bas a
  changé de texte.
- **La section fondateur.** Elle attend une photographie, pas des réglages.
- **`Fonctionnement`, les trois étapes en trois colonnes égales.** C'est une
  séquence de trois étapes de poids égal : ici la symétrie est le sens.
- **Le voile de couleur du hero.** Seul dégradé du site, hérité de la V2,
  imperceptible sauf sur fond uni — il empêche le papier d'être parfaitement
  plat. Conservé.

### Ce qui attend encore les assets

- Le hero : l'emplacement photo tient 463 px de large sur 647 de haut à
  droite du texte. Tant qu'il est vide, c'est un rectangle marine — et aucun
  réglage de grille n'y changera rien.
- La section fondateur : le vide sous la colonne de texte se comblera avec le
  portrait réel, dont la hauteur rejoindra celle de la colonne de gauche.
- Le wordmark typographique tient lieu de logo. Il tient bien. Il reste un
  wordmark.

---

## `/programme`

### Ce qui a réellement gagné

- **La mention légale de bas de page** (« L'IPRIG ne délivre ni diplôme… »)
  courait sur **91 caractères par ligne** en corps 13 px. Elle est revenue à
  **70**.
- Les résumés de séance suivent la même mesure que sur l'accueil.
- **« Programme » s'allume dans la navigation.** Le filet laiton du survol,
  simplement déjà tracé, plus `aria-current="page"` pour les lecteurs d'écran.
- Sur tablette (768 px), l'emplacement photo des séances passe de 320 × 400 à
  **480 × 270** : il devient horizontal et accompagne la liste, au lieu de
  flotter en colonne étroite à gauche d'un vide. Même correction sur le hero
  (512 × 288) et sur le portrait du fondateur (480 × 360). La page d'accueil y
  gagne **321 px de moins à faire défiler** (−2,8 %).

### Ce qui est inchangé volontairement

- La structure en quatre volets numérotés `I…IV`, l'avertissement « programme
  indicatif », le placeholder « events », l'affiche de clôture.
- La page reste un **sommaire académique**, pas une page spectaculaire. C'est
  ce qu'elle doit être.

### Ce qui attend encore les assets

Le programme 2026-2027 définitif. Les six séances actuelles sont indicatives
et le site le dit — mais un vrai calendrier rendrait la page bien plus
convaincante que n'importe quel réglage.

---

## `/kevan-gafaiti`

### Ce qui a réellement gagné

- **La biographie** passait à 85 caractères par ligne, la note sur l'IRIG à
  **124** — elle n'avait aucune largeur de lecture. Elles sont revenues à 76
  et 63. Le résumé de thèse passe de 81 à 71.
- Le seuil « écran peu haut » qui désactive la colonne fixe était réglé à
  52rem ici et 50rem ailleurs. Un seul seuil désormais, pour tout le site.
- « Kevan Gafaïti » s'allume dans la navigation.
- « Thèse : … », « structures distinctes : … » : insécables en place.

### Ce qui est inchangé volontairement

La hiérarchie de la page — colonne de repères à gauche, portrait éditorial à
droite. Elle évite l'effet CV sans transformer les informations académiques en
profil LinkedIn. Le doctorat, les Master 2, la recherche, Kevan Explique et
l'IRIG gardent leur ordre et leur traitement.

---

## `/contact`

### Ce qui a réellement gagné

- « Contact » s'allume dans la navigation.
- Le lien d'action de chaque canal partage désormais **exactement** la même
  courbe que les autres filets qui se tracent au survol (en-tête, lien
  programme). Trois endroits, un seul geste, une seule courbe.
- L'accroche « … ou l'adhésion ? Voici par où passer. » a son espace fine.

### Ce qui est inchangé volontairement

L'annuaire éditorial — intitulé / information / action, séparés par des filets.
C'était la plus grosse réussite de la V2 sur cette page. On n'y touche pas.

### Ce qui attend encore les assets

L'adresse e-mail officielle et les comptes Instagram / LinkedIn de l'IPRIG.
Tant qu'ils sont `null`, deux colonnes du pied de page restent presque vides —
ce n'est pas un défaut de mise en page, c'est une donnée manquante.

---

## Pages légales et 404

Inchangées, sauf : insécables, largeurs de lecture, et couleur du laiton en
texte. Elles restent `noindex` et hors sitemap tant que `legal.editor` est
`null`.

---

## Ce qui a été exploré et volontairement écarté

Le brief demandait d'explorer ces pistes. Les avoir écartées est une décision,
pas un oubli.

**En-tête plus compact après défilement.**
L'en-tête est `position: sticky` : il occupe toujours sa place en tête de flux,
même lorsqu'il est « collé ». Réduire sa hauteur de 8 px décale donc tout le
document de 8 px — un saut de contenu au moment exact où l'utilisateur
commence à défiler, et une oscillation à la frontière de déclenchement. Le
seul moyen propre serait de passer l'en-tête en `position: fixed`, ce qui
demanderait de compenser sa hauteur ailleurs. Le gain — quelques pixels — ne
vaut pas ce risque.

**Filet qui se trace à l'arrivée de chaque chapitre (section « L'expérience »).**
Techniquement gratuit : le geste `rule` existe déjà. Mais cela ferait passer la
section d'une animation focale à cinq, et transformerait une suite de chapitres
en liste qui se déroule — exactement la « répétition d'animations » que l'audit
anti-IA cherche à éliminer. La règle « les listes ne s'animent pas élément par
élément » vaut plus que l'effet.

**État actif sur les ancres de la page d'accueil.**
Deux des cinq entrées du menu seulement sont des ancres (`/#institut`,
`/#faq`). Un scroll-spy n'aurait allumé qu'elles, au hasard du défilement, en
laissant les trois autres éteintes : un signal qui ressemble à un bug. La barre
de progression répond déjà à « où suis-je » sur la page d'accueil. Le marquage
de page courante est réservé aux vraies pages — et ne coûte pas un octet de
JavaScript.

**Resserrement supplémentaire de la section « Repères ».**
La respiration très large de cette section fait partie de la variation de
densité construite en V2. Seule la respiration basse a été réduite ; la haute
reste intacte.

**Grille de trois colonnes égales de `Fonctionnement`.**
Signalée par l'audit anti-IA, conservée après examen : trois étapes successives
de poids identique. Y introduire une asymétrie contredirait le contenu.

---

## Contrôles

| | V2 | V3 |
|---|---|---|
| `astro check` | 0 / 0 / 0 | **0 / 0 / 0** |
| Tests fonctionnels | 83 / 83 | **84 / 84** (+1 garde typographique) |
| Contrôles responsive & a11y | 42 / 42 (3 formats capturés) | **49 / 49** (5 formats capturés) |
| Contrastes (21 couples) | 19 conformes, **2 sous le seuil** | **21 / 21** |
| JavaScript livré | 1,9 Ko | **1,9 Ko** |
| Accueil | 9 req · 247,7 Ko | 9 req · 248,8 Ko |
| `/programme` | 145,5 Ko | **145,3 Ko** |
| `/kevan-gafaiti` | 138,4 Ko | **138,3 Ko** |
| `/contact` | 126,4 Ko | **126,1 Ko** |
| `dist/` | 540 Ko | **540 Ko** |

Trois pages sur quatre sont plus légères qu'en V2 : le CSS mort retiré a payé
les règles ajoutées. Seule la page d'accueil gagne 1,1 Ko — la règle de hauteur
du hero et les filets du bandeau.
