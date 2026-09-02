# Écosystème numérique Kevan Gafaïti

Ce dépôt regroupe les sites de l'écosystème Kevan Gafaïti. Chaque projet est
autonome : on n'ajoute pas de couche partagée tant que deux projets n'en ont pas
réellement besoin.

## Les trois entités

| Sigle | Nom complet | Nature | État |
|---|---|---|---|
| **IPRIG** | Institut de préparation aux relations internationales et à la géopolitique | Prépa / accompagnement d'étudiants | **En cours — priorité actuelle** (`iprig/`, domaine `iprig.fr`) |
| **IRIG** | Institut des relations internationales et géopolitiques | Centre de recherche / think tank, présidé et fondé par Kevan Gafaïti | Site à construire plus tard |
| Revue | (nom à définir) | Revue en ligne de relations internationales et de géopolitique | Projet long terme |

Les trois se renverront progressivement du trafic — l'IPRIG donne accès à des
événements de l'écosystème, les chercheurs de l'IRIG alimenteront la revue.
**Ne pas sur-architecturer l'IPRIG en prévision de cela.** La V1 doit rester
indépendante, légère et facile à maintenir.

## Règles permanentes

**IPRIG ≠ IRIG.** Deux entités distinctes, deux sigles à une lettre près.
L'IPRIG prépare des étudiants ; l'IRIG fait de la recherche. Ne jamais les
confondre, ne jamais présenter l'un comme l'autre, ne jamais fusionner leurs
contenus.

**Orthographe.** « Kevan Gafaïti » — un seul « n », tréma sur le « i ».
La marque de création de contenu s'écrit « Kevan Explique ».

**Ne rien inventer.** Ces sites engagent la crédibilité académique d'une
personne réelle. Aucun témoignage, chiffre, diplôme, poste, publication,
partenaire, événement, certification ou coordonnée ne doit être fabriqué —
pas même « en attendant », pas même « pour voir le rendu ». Une information
manquante se marque `TODO CLIENT` ou fait disparaître la section concernée.
Voir le skill `content-integrity`.

**Pas de certification implicite.** L'IPRIG ne délivre ni diplôme ni
certification reconnue par l'État. Aucune formulation ne doit le laisser
entendre. Des formations spécialisées sont envisagées à partir de 2027 : elles
ne seront présentées que lorsqu'elles existeront réellement.

## Philosophie de développement

- La solution la plus simple qui atteint l'objectif.
- Statique par défaut. Pas de base de données, pas de CMS, pas d'API, pas de
  comptes utilisateurs tant qu'un besoin réel n'est pas démontré.
- Le contenu susceptible de changer vit dans des fichiers de données
  centralisés, jamais écrit en dur dans les composants.
- Accessibilité et performance ne sont pas des options : elles font partie de
  la définition de « terminé ».

## Déploiement

Hébergement **Hostinger**, statique, dossier `public_html`.
Aucun identifiant Hostinger, FTP ou SSH ne doit jamais être écrit dans ce
dépôt, dans un script ou dans un fichier de configuration versionné.

## Structure

```
kevan-gafaiti-digital/
├── CLAUDE.md                    ce fichier
├── docs/ecosystem-context.md    contexte détaillé des trois projets
├── .claude/skills/
│   └── iprig-quality-gate/      audit qualité du site IPRIG
└── iprig/                       site iprig.fr (Astro + TypeScript)
    ├── CLAUDE.md                règles propres au projet IPRIG
    ├── README.md                installation et où modifier quoi
    ├── CONTENT_TODO.md          ce que Kevan doit encore fournir
    ├── DEPLOY_HOSTINGER.md      phases B et C de la mise en ligne, retour arrière
    └── RELEASE_PHASE_A.md       audit de préparation du paquet Hostinger
```
