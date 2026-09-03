# Contexte de l'écosystème

Document de référence sur les trois projets, leur rôle et leurs relations.
Il complète `CLAUDE.md`, qui n'en garde que les règles opérationnelles.

---

## 1. IPRIG — priorité actuelle

**Institut de préparation aux relations internationales et à la géopolitique**
Domaine : `iprig.fr` — site construit dans `iprig/`.

### Ce que c'est

Une structure d'accompagnement destinée principalement aux étudiants intéressés
par les relations internationales, la science politique et la géopolitique, et
par les carrières qui s'y rattachent.

### Public

- **Principal** : étudiants de licence et de master en relations
  internationales, science politique, géopolitique ; personnes souhaitant
  s'orienter professionnellement vers ces secteurs.
- **Secondaire** : lycéens qui réfléchissent à leurs études ; grand public
  fortement intéressé par ces sujets.

Le ton reste mature, universitaire et professionnel. Ne jamais infantiliser.

### Ce que l'adhésion apporte

Réseau · événements · immersion dans le milieu · connaissances · méthodologie ·
réflexes de construction de parcours · accompagnement suivi.

L'IPRIG est davantage qu'une bibliothèque de vidéos — c'est le message central
du site.

### Modèle économique

L'adhésion passe **entièrement par Patreon** : `patreon.com/IPRIG`.
Tarif : 28,80 € + TVA, soit environ 29 € par mois. Une seule formule.
Aucun engagement de durée.

Le site `iprig.fr` **ne remplace pas Patreon**. Il est la vitrine officielle,
la présentation institutionnelle et l'outil de conversion. Il ne gère ni
comptes, ni paiements, ni contenus réservés.

Parcours visé :

```
réseaux sociaux / conférences / bouche-à-oreille
        ↓
     iprig.fr    (comprendre → être rassuré → se projeter)
        ↓
     Patreon     (abonnement)
```

### Ce qui n'existe pas encore

Programme définitif 2026-2027, témoignages réels, photos, logo, slogan
définitif, e-mail officiel, comptes sociaux IPRIG, informations légales.
Recensé dans `iprig/CONTENT_TODO.md`.

---

## 2. IRIG — à construire plus tard

**Institut des relations internationales et géopolitiques**

Centre de recherche / think tank présidé et fondé par Kevan Gafaïti.
Son site présentera l'institut, ses recherches, ses publications, ses
chercheurs, ses événements, les possibilités de soutien et les contacts.

**À ne pas construire tant que l'IPRIG n'est pas livré et en ligne.**

⚠ IPRIG et IRIG sont deux entités distinctes. Un site ne doit jamais reprendre
les contenus de l'autre, et le site IPRIG se contente d'une mention sobre de
l'IRIG dans la présentation du fondateur.

---

## 3. La revue — projet long terme

Revue en ligne consacrée aux relations internationales et à la géopolitique,
alimentée notamment par les contributions de chercheurs associés à l'IRIG.

Contenus envisagés à terme : articles, dossiers, cartes, contenus éditoriaux,
lettre d'information, comptes lecteurs, abonnements, contenus premium.

Référence qualitative de très long terme : le niveau éditorial et visuel de
médias comme *Le Grand Continent* — sans jamais reproduire leur identité.

**À ne pas construire maintenant.**

---

## Synergies prévues

| De | Vers | Nature |
|---|---|---|
| IPRIG | IRIG | accès privilégié à certains événements de l'écosystème |
| IRIG | Revue | les chercheurs publient dans la revue |
| Revue | IPRIG / IRIG | visibilité et audience supplémentaires |

Ces liens se construiront progressivement. **Aucune infrastructure partagée ne
doit être créée à l'avance pour les anticiper.**

---

## Kevan Gafaïti

Informations fournies par le client, **à faire valider avant toute mise en
production** (voir `iprig/src/data/kevan.ts`) :

- enseignant à Sciences Po Paris ;
- président-fondateur de l'IRIG ;
- a enseigné notamment à Sciences Po Paris, à l'Université
  Paris-Panthéon-Assas, à la Sorbonne et à l'INALCO ;
- interventions en conférences et colloques, en France et à l'étranger ;
- auteur de travaux, articles et ouvrages ;
- doctorat en science politique / relations internationales
  (Université Paris-Panthéon-Assas), sur la France face à la politique
  étrangère de l'Iran, 1995-2022 ;
- trois Master 2, dans des domaines liés au droit, à l'histoire et aux
  relations internationales ;
- recherche centrée sur la géopolitique du Moyen-Orient, en particulier
  l'Iran et sa stratégie d'influence.

**KevanExplique** : marque de diffusion sur Instagram, TikTok, YouTube et en
podcast. Communauté d'environ 75 000 personnes indiquée au moment du brief —
donnée volatile, centralisée dans `iprig/src/data/site.ts` (`communitySize`)
et à vérifier avant chaque mise en ligne.
