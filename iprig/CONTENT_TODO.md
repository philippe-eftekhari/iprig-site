# À demander à Kevan

Liste des éléments manquants pour finaliser `iprig.fr`.
Le site fonctionne déjà sans eux : les zones concernées sont soit masquées,
soit remplacées par un repli soigné. Rien n'a été inventé.

Cocher au fur et à mesure. **État au 01/09/2026 (V4.2).**

> **Réglé en V4.1 — ne plus redemander :** l'orthographe *Alain Coppolani* et
> *Albert Kandemir*, leurs deux biographies, la biographie et le portrait de
> *Balkissou Hayatou*, et l'URL *Apple Podcasts*. Tout est intégré et vérifié.

> **Réglé en V4.2 — ne plus redemander :** *Valentin Blondiau* (nom, biographie,
> titre de thèse, portrait, certificat « Introduction à la Communication de
> crise »), l'ordre des cinq enseignants, la casse des sept axes, les trois
> formulations de la section « L'institut », le statut de **docteur** de Kevan
> Gafaïti et le titre complet de sa thèse, et l'adresse de destination des
> formulaires. Tout est intégré et vérifié.

---

## Bloquant — à avoir avant la mise en ligne

- [ ] **Validation de la biographie de Kevan Gafaïti**
      Relire et valider chaque intitulé : fonctions, établissements et les
      trois Master 2.
      *Rien n'a été ajouté au-delà du brief, mais tout doit être confirmé.*
      **Le doctorat, lui, est réglé** : la V4.2 a intégré la qualification
      « Docteur en sciences politiques et relations internationales » et le
      titre complet de la thèse, tous deux fournis le 01/09/2026.

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
- [x] **Favicon** — dérivé du logo officiel, en 32 / 180 / 192 / 512 px. ✅
      *V4.2 : `favicon.svg`, le losange dessiné de la V3.1, a été supprimé du
      dépôt et interdit dans le paquet de déploiement. Un navigateur garde les
      favicons longtemps — contrôler l'onglet en navigation privée après la
      mise en ligne, sinon c'est le cache que l'on regarde.*
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
- [x] **Portrait de Valentin Blondiau** — reçu le 01/09/2026, intégré. ✅
      *Réserve technique, non bloquante : la source fait 400 × 400 px, la plus
      faible du lot. Sa vignette est donc légèrement moins nette que les quatre
      autres. Une source de 1200 × 1500 ou plus la rendrait identique — une
      seule ligne à changer dans `scripts/prepare-assets.mjs`.*

> ⚠ **Droits d'usage.** Chaque photo doit être libre d'utilisation pour le
> site. Pour celles où apparaissent des étudiants ou des tiers — visites
> d'ambassade, salles de cours — leur accord est nécessaire. Aucune photo n'a
> été récupérée ailleurs, aucune n'a été générée.

- [ ] **⚠ Confirmer les droits sur `Kevan-10` — DÉSORMAIS PUBLIÉE**
      La V4.2 emploie `Kevan-10` sur la page d'accueil, à l'aperçu du
      programme : un salon d'apparat où des étudiants sont assis, vus
      majoritairement de dos. Le client a explicitement demandé une image de
      salle plutôt qu'un troisième portrait de Kevan Gafaïti.
      **C'est la première photographie du site où des tiers apparaissent.**
      Aucun visage n'est au premier plan et aucun n'est nommé, mais quelques
      personnes restent identifiables sur le bord gauche du cadre.
      **Question à poser :** l'accord des personnes présentes est-il acquis
      pour une publication sur `iprig.fr` ?
      *Si la réponse est non, le remplacement le plus proche est `Kevan-12`
      (escalier d'honneur, drapeaux européen et français, aucun tiers) — une
      seule ligne à changer dans `scripts/prepare-assets.mjs`.*
      Les autres photographies de groupe (`Kevan-07`, `Kevan-08`, `Kevan-11`)
      ne sont toujours pas publiées.

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
- [x] **Biographie de Valentin Blondiau** — reçue le 01/09/2026, **réécrite
      par le client le 02/09/2026**, intégrée. ✅
      *La version en ligne raconte son parcours — cinq ans en communication
      des organisations, puis la recherche — et ne cite plus le titre de sa
      thèse. C'est un choix éditorial du client, pas un oubli : ne pas le
      réintroduire.*
- [x] **Biographie de Balkissou Hayatou** — reçue le 31/08/2026, intégrée. ✅
      *La version affichée est une version courte : à 487 signes, sa vignette
      pesait le triple de celle de Kevan Gafaïti. La version source complète
      est conservée mot pour mot en commentaire dans `src/data/certificats.ts`
      — rien n'est perdu, et c'est là qu'il faut aller la rechercher.*

- [ ] **Légende de la photographie du fondateur**
      La légende disait « Kevan Gafaïti en colloque » ; le client a signalé
      que la mention n'était pas vérifiée. Elle est devenue « Kevan Gafaïti »,
      formulation neutre et vraie. **Question à poser :** s'agit-il d'un
      colloque, d'une conférence, d'une table ronde ? Et faut-il nommer
      l'événement ? Sans réponse, la légende neutre reste correcte.

- [ ] **Calendrier du certificat de Valentin Blondiau**
      « Introduction à la Communication de crise » est affiché avec les mêmes
      modalités que les dix autres — février à avril 2027, dix séances d'une
      heure, à distance. Confirmer que c'est bien le cas, ou fournir le sien.
      *Rien n'a été inventé : le certificat hérite simplement des modalités
      communes déclarées dans `src/data/certificats.ts`.*

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
      *L'adresse de destination est arrêtée depuis le 01/09/2026, mais elle
      n'est écrite nulle part dans le dépôt : celui-ci est public, une adresse
      versionnée est récoltée par les robots, et elle resterait dans
      l'historique Git même effacée ensuite. La reprendre du brief au moment
      de renseigner `config.php`.*
      **Le sel de la limitation de débit ne doit pas non plus être écrit dans
      le dépôt, ni envoyé par message.**

- [ ] **Tester les formulaires une fois en ligne — TOUJOURS NON TESTÉ**
      Ils n'ont jamais été exécutés : aucun interpréteur PHP n'existe sur la
      machine de développement, et le domaine n'a pas encore d'hébergement.
      La revue statique est passée à chaque version, mais **une revue statique
      n'est pas un e-mail reçu**. Procédure de test en cinq points dans
      `V4_HANDOFF.md`, section 12.
      À vérifier au premier déploiement :
      - contact → un e-mail arrive bien à l'adresse de destination ;
      - préinscription → un e-mail arrive, et la ligne est écrite dans
        `preinscriptions.csv` avec ses six colonnes ;
      - un certificat de Valentin Blondiau est accepté par la validation
        serveur comme les dix autres.

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
