# À demander à Kevan

Liste des éléments manquants pour finaliser `iprig.fr`.
Le site fonctionne déjà sans eux : les zones concernées sont soit masquées,
soit remplacées par un placeholder soigné. Rien n'a été inventé.

Cocher au fur et à mesure.

---

## Bloquant — à avoir avant la mise en ligne

- [ ] **Validation de la biographie**
      Relire la présentation de Kevan Gafaïti et valider chaque intitulé :
      fonctions, établissements, doctorat, sujet de thèse, les trois Master 2.
      *Rien n'a été ajouté au-delà du brief, mais tout doit être confirmé.*

- [ ] **Validation des chiffres**
      « Plusieurs centaines d'étudiants accompagnés », « ≈ 40 séances par an »,
      « ≈ 50 événements organisés l'année précédente ».
      Confirmer, corriger, ou demander à en retirer.

- [ ] **Validation du prix — mention tarifaire opposable, PRIORITAIRE**
      Le site affiche « 29 € / mois ». Il ne dit plus rien d'autre sur le
      tarif : la formulation « 28,80 € + TVA applicable, soit environ 29 € par
      mois », affichée jusqu'à la V2, a été retirée le 25/08/2026 parce
      qu'elle était mathématiquement fausse — 28,80 € majorés de la TVA ne
      font pas 29 €.
      **Question à poser à Kevan, mot pour mot :** le membre paie-t-il 29 €
      TTC ? 28,80 € HT ? Et si les deux chiffres coexistent, quel est le
      rapport exact entre eux (TVA applicable ou non, commission Patreon) ?
      La réponse se pose dans `src/data/site.ts → offer.priceDetail`, et dans
      la réponse « Combien coûte l'IPRIG ? » de `src/data/faq.ts`.

- [ ] **Validation de l'URL Patreon**
      Confirmer que `patreon.com/KevanExplique` est bien la page d'adhésion à
      utiliser pour tous les boutons du site.

- [ ] **Informations légales**
      Nom de l'éditeur, forme juridique (association, société, auto-entreprise…),
      adresse du siège, numéro SIRET ou RCS, nom du directeur de la publication,
      et numéro de TVA le cas échéant.
      *Sans ces informations, les pages « Mentions légales » et « Politique de
      confidentialité » restent incomplètes et non indexées.*

- [ ] **Année de création de l'IPRIG**
      Pour le copyright du pied de page.

---

## Identité visuelle

- [ ] **Logo IPRIG définitif**
      De préférence en SVG. Prévoir aussi une version claire pour les fonds
      sombres si le logo est monochrome.
      *En attendant : un logo typographique temporaire, composé en serif.*

- [ ] **Favicon**
      Peut être dérivé du logo. *En attendant : une icône provisoire.*

- [ ] **Slogan définitif**
      Le site affiche pour l'instant « Votre partenaire pour votre carrière en
      géopolitique. », signalé comme provisoire.

---

## Photographies

Chaque emplacement affiche aujourd'hui une composition abstraite avec une
légende indiquant ce qui est attendu. Formats souhaités entre parenthèses.

- [ ] **Portrait principal de Kevan Gafaïti** *(vertical, cadrage buste)*
      Utilisé dans le hero de la page d'accueil et sur `/kevan-gafaiti`.

- [ ] **Photo de session IPRIG** *(vertical)*
      Salle, écran, échanges avec les étudiants.

- [ ] **Photos de conférences ou d'événements** *(horizontal — 2 à 4 suffisent)*
      Interventions, colloques, rencontres.

- [ ] **Photo d'ambiance étudiants** *(horizontal, optionnel)*

> ⚠ **Droits d'usage.** Chaque photo doit être libre d'utilisation pour le
> site. Pour les photos où apparaissent des étudiants ou des tiers, leur accord
> est nécessaire. Aucune photo n'a été récupérée ailleurs.

- [ ] **Visuel de partage social** *(1200 × 630 px, optionnel)*
      Ce qui s'affiche quand on partage le lien sur Instagram, LinkedIn ou
      WhatsApp. *En attendant : un visuel typographique IPRIG a été créé.*

---

## Contenu

- [ ] **Programme 2026-2027 définitif**
      La liste des séances, avec pour chacune : un intitulé, une phrase de
      description, et sa catégorie (Méthodologie / Parcours / Orientation).
      *En attendant : six séances données à titre indicatif, avec un encadré
      qui prévient explicitement le visiteur.*

- [ ] **3 à 6 témoignages d'étudiants réels**
      Pour chacun : prénom, formation suivie, année, le texte du témoignage,
      et **l'accord écrit de la personne** pour la publication.
      Une photo est possible mais pas nécessaire.
      *La section n'apparaît pas du tout tant qu'aucun témoignage réel n'est
      fourni — aucun faux témoignage n'a été écrit.*

- [ ] **Questions fréquentes à compléter**
      Huit questions sont déjà en ligne. Y a-t-il d'autres questions qui
      reviennent souvent de la part des étudiants ?

---

## Contacts et réseaux

- [ ] **Adresse e-mail officielle de l'IPRIG**
      *En attendant : la page contact renvoie vers Patreon. Aucune adresse n'a
      été inventée.*

- [x] **Instagram Kevan Explique** — `instagram.com/kevanexplique` ✅ en ligne
- [ ] **Compte Instagram IPRIG** — l'IPRIG a-t-il son propre compte Instagram,
      ou utilise-t-il celui de Kevan Explique ? Si c'est le même, le dire :
      il sera repris dans la colonne « Contact » du pied de page.
- [ ] **Compte LinkedIn IPRIG** — URL exacte, si la page existe
- [ ] **TikTok Kevan Explique** — URL exacte
- [ ] **Chaîne YouTube Kevan Explique** — URL exacte
- [ ] **Podcast** — URL exacte et plateforme

> Tant que TikTok, YouTube et le podcast n'ont pas d'URL, seul Instagram
> apparaît comme lien. Les autres s'ajouteront automatiquement à côté dès que
> leurs adresses seront renseignées.

- [ ] **Taille actuelle de la communauté Kevan Explique**
      Le site affiche « ≈ 75 000 », chiffre indiqué lors du brief.
      À vérifier avant la mise en ligne — ce nombre évolue vite.

> ⚠ Si un compte n'existe pas, il suffit de le dire : il disparaîtra
> proprement du site. Aucune URL n'a été devinée.

---

## Plus tard

- [ ] **Site de l'IRIG** — l'URL, une fois le site en ligne, pour ajouter un
      lien depuis la page du fondateur.

- [ ] **Formations spécialisées 2027**
      Géopolitique de l'Iran, de la Turquie, de l'Afghanistan, finance
      islamique… Elles ne sont **pas** annoncées sur le site actuel.
      Quand elles existeront, préciser leur statut exact : s'agit-il de
      certifications reconnues, ou de formations non certifiantes ?
      *Cette distinction est juridiquement importante.*

- [ ] **Accès Hostinger** — pour la mise en ligne.
      À transmettre par un canal sécurisé, **jamais par e-mail ou message**,
      et jamais enregistré dans le code du site.
