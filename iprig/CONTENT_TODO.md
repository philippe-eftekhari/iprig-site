# À demander à Kevan

Liste des éléments manquants pour finaliser `iprig.fr`.
Le site fonctionne déjà sans eux : les zones concernées sont soit masquées,
soit remplacées par un repli soigné. Rien n'a été inventé.

Cocher au fur et à mesure. **État au 01/09/2026 (V4.1).**

> **Réglé en V4.1 — ne plus redemander :** l'orthographe *Alain Coppolani* et
> *Albert Kandemir*, leurs deux biographies, la biographie et le portrait de
> *Balkissou Hayatou*, et l'URL *Apple Podcasts*. Tout est intégré et vérifié.

---

## Bloquant — à avoir avant la mise en ligne

- [ ] **Validation de la biographie de Kevan Gafaïti**
      Relire et valider chaque intitulé : fonctions, établissements, doctorat,
      sujet de thèse, les trois Master 2.
      *Rien n'a été ajouté au-delà du brief, mais tout doit être confirmé.*

- [ ] **Validation du prix — mention tarifaire opposable**
      Le site affiche « 29 € / mois ». Il ne dit plus rien d'autre sur le
      tarif : la formulation « 28,80 € + TVA applicable, soit environ 29 € par
      mois », affichée jusqu'à la V2, a été retirée le 25/08/2026 parce
      qu'elle était mathématiquement fausse — 28,80 € majorés de la TVA ne
      font pas 29 €.
      **Question à poser mot pour mot :** le membre paie-t-il 29 € TTC ?
      28,80 € HT ? Et si les deux chiffres coexistent, quel est le rapport
      exact entre eux (TVA applicable ou non, commission Patreon) ?
      *La réponse se pose dans `src/data/site.ts → offer.priceDetail`, et dans
      la réponse « Combien coûte l'IPRIG ? » de `src/data/faq.ts`.*

- [ ] **Validation de l'URL Patreon**
      Confirmer que `patreon.com/KevanExplique` est bien la page d'adhésion à
      utiliser pour tous les boutons du site.

- [ ] **Informations légales**
      Nom de l'éditeur, forme juridique (association, société, auto-entreprise…),
      adresse du siège, numéro SIRET ou RCS, nom du directeur de la publication,
      et numéro de TVA le cas échéant.
      *Sans elles, « Mentions légales » et « Politique de confidentialité »
      restent incomplètes et non indexées.*

- [ ] **Durée de conservation des données de formulaire**
      La politique de confidentialité emploie aujourd'hui une formulation
      prudente et vraie : « pendant la durée nécessaire au traitement de la
      demande et au suivi correspondant ». Combien de temps exactement ?

- [ ] **Relecture juridique de la politique de confidentialité**
      Le site collecte désormais des données via deux formulaires. La page a
      été réécrite en conséquence, mais elle n'a pas été relue par un juriste.

- [ ] **Année de création de l'IPRIG**
      Pour le copyright du pied de page.

---

## Identité visuelle

- [x] **Logo IPRIG** — reçu le 31/08/2026, intégré : en-tête, tiroir mobile,
      pied de page, favicons. ✅
- [x] **Favicon** — dérivé du logo, en 32 / 180 / 192 / 512 px. ✅
- [x] **Accroche** — « Votre partenaire pour votre carrière en géopolitique »,
      validée en V4 (sans point final). ✅

- [ ] **Visuel de partage social** *(1200 × 630 px)*
      Ce qui s'affiche quand on partage le lien sur Instagram, LinkedIn ou
      WhatsApp. *En attendant : un visuel typographique, antérieur au logo.
      À recomposer avec le logo réel — voir V4_HANDOFF.md, pistes V4.1.*

---

## Photographies

- [x] **Photographies de Kevan Gafaïti** — 19 photographies reçues le
      30/08/2026. Cinq retenues et intégrées ; le détail de la sélection et
      des non-retenues est dans `V4_HANDOFF.md`. ✅
- [x] **Portrait d'Alain Coppolani** — reçu, intégré. ✅
- [x] **Portrait d'Albert Kandemir** — reçu, intégré. ✅
- [x] **Portrait de Balkissou Hayatou** — reçu le 31/08/2026, intégré. ✅

> ⚠ **Droits d'usage.** Chaque photo doit être libre d'utilisation pour le
> site. Pour celles où apparaissent des étudiants ou des tiers — visites
> d'ambassade, salles de cours — leur accord est nécessaire. Aucune photo n'a
> été récupérée ailleurs, aucune n'a été générée.

- [ ] **Confirmer les droits sur les photographies de groupe**
      Aucune photographie où des étudiants sont reconnaissables n'a été
      publiée en V4, précisément pour cette raison. À rouvrir si l'on veut
      employer `Kevan-07`, `Kevan-10` ou `Kevan-11`.

---

## Contenu

- [ ] **Programme annuel définitif**
      La liste des séances, avec pour chacune : un intitulé, une phrase de
      description, et sa catégorie (Méthodologie / Professionnel / Parcours /
      Réseau).
      *En attendant : les quatre séances validées lors du brief V4, présentées
      comme des exemples.*

- [x] **Biographie d'Alain Coppolani** — reçue le 01/09/2026, intégrée. ✅
- [x] **Biographie d'Albert Kandemir** — reçue le 01/09/2026, intégrée. ✅
- [x] **Biographie de Balkissou Hayatou** — reçue le 31/08/2026, intégrée. ✅
      *La version affichée est une version courte : à 487 signes, sa vignette
      pesait le triple de celle de Kevan Gafaïti. La version source complète
      est conservée mot pour mot en commentaire dans `src/data/certificats.ts`
      — rien n'est perdu, et c'est là qu'il faut aller la rechercher.*

- [ ] **Créneaux horaires des certificats**
      La page indique qu'ils seront communiqués ultérieurement en tenant
      compte des disponibilités des inscrits. Dès qu'ils sont arrêtés, les
      ajouter dans `src/data/certificats.ts`.

- [ ] **Modalités précises de l'examen terminal**
      Seul le **principe** de l'examen terminal est écrit sur le site.
      Ni format, ni durée, ni note minimale, ni coefficient, ni rattrapage :
      **rien de tout cela ne doit être ajouté avant validation.**

- [ ] **3 à 6 témoignages d'étudiants réels**
      Pour chacun : prénom, formation suivie, année, le texte du témoignage,
      et **l'accord écrit de la personne** pour la publication.
      *La section n'apparaît pas du tout tant qu'aucun témoignage réel n'est
      fourni — aucun faux témoignage n'a été écrit.*

- [ ] **Questions fréquentes à compléter**
      Huit questions sont en ligne. Y en a-t-il d'autres qui reviennent
      souvent de la part des étudiants ?

---

## Contacts et réseaux

Le site **ne publie aucune adresse e-mail**. La page Contact porte un
formulaire dont la destination vit dans la configuration serveur, hors dépôt.
Il n'y a donc plus d'adresse à afficher, et plus rien à récolter.

- [x] Instagram — `instagram.com/kevanexplique` ✅
- [x] YouTube ✅
- [x] TikTok ✅
- [x] Twitch ✅
- [x] LinkedIn ✅
- [x] Spotify ✅
- [x] **Apple Podcasts** — URL reçue le 01/09/2026, intégrée. ✅
      *Les sept plateformes sont désormais en ligne. Plus aucune mention
      « lien à venir » nulle part.*

- [ ] **Compte Instagram ou LinkedIn propre à l'IPRIG**
      L'IPRIG a-t-il ses propres comptes, ou utilise-t-il ceux de
      KevanExplique ? Si ce sont les mêmes, il suffit de le dire.

> ⚠ Le chiffre « ≈ 75 000 abonnés », affiché jusqu'en V3.1, a été **retiré**.
> Il n'avait jamais été vérifié et une audience évolue en permanence.
> Pour le réafficher, il faut une mesure datée — et accepter qu'elle vieillisse.

---

## Mise en ligne

- [ ] **Souscrire un plan d'hébergement Hostinger et y rattacher `iprig.fr`**
      Au 25/08/2026, le domaine était encore sur le parking DNS : il n'existe
      aucun endroit où déposer le site. Voir `DEPLOY_HOSTINGER.md`.

- [ ] **Renseigner la configuration des formulaires sur le serveur**
      Adresse de destination, sel de la limitation de débit, dossier des
      données. Procédure complète dans `.env.example`.
      **À ne jamais écrire dans le dépôt, ni envoyer par message.**

- [ ] **Tester les formulaires une fois en ligne**
      Ils n'ont jamais été exécutés : aucun interpréteur PHP n'existe sur la
      machine de développement. Procédure de test en cinq points dans
      `V4_HANDOFF.md`, section 12.

- [ ] **Accès Hostinger** — à transmettre par un canal sécurisé,
      **jamais par e-mail ou message**, et jamais enregistré dans le dépôt.

---

## Plus tard

- [ ] **Site de l'IRIG** — l'URL, une fois en ligne, pour ajouter un lien
      depuis la page du fondateur.

- [ ] **Passage des certificats de la préinscription à l'inscription**
      Quand les modalités définitives seront arrêtées. Le champ
      `registrationStatus` de `src/data/certificats.ts` est prévu pour cela.
      *La question du paiement se posera alors, et elle est hors périmètre V4.*
