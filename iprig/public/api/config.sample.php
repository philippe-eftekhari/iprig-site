<?php
/**
 * ============================================================================
 *  MODÈLE DE CONFIGURATION SERVEUR — À COPIER, PAS À MODIFIER
 * ============================================================================
 *  Ce fichier est versionné et ne contient AUCUN secret.
 *
 *  Sur le serveur :
 *      cp config.sample.php config.php
 *      puis renseigner config.php et le laisser hors du dépôt.
 *
 *  `config.php` est ignoré par Git (voir .gitignore) et refusé par le
 *  .htaccess de ce dossier. Ne jamais le commiter, ne jamais coller son
 *  contenu dans un ticket, un message ou une capture d'écran.
 * ============================================================================
 */

return [
    /* ---------------------------------------------------------------- E-MAIL */

    /**
     * Boîte qui reçoit les messages de contact et les préinscriptions.
     * ⚠ Cette adresse ne doit apparaître NULLE PART ailleurs : ni dans le
     * HTML, ni dans le JavaScript, ni dans un fichier versionné.
     */
    'MAIL_TO' => 'REMPLACER@example.com',

    /**
     * Expéditeur technique. DOIT appartenir au domaine du site, sinon SPF et
     * DKIM échouent et les messages partent en indésirable.
     *
     * Laissée vide ou invalide, cette valeur est ignorée et remplacée par
     * `no-reply@iprig.fr` (constante `MAIL_FROM_DEFAUT` de `_lib.php`) : un
     * oubli ici ne casse donc pas silencieusement tous les envois.
     */
    'MAIL_FROM' => 'no-reply@iprig.fr',

    /* --------------------------------------------------------- ENREGISTREMENT */

    /**
     * Dossier des tableaux privés (`preinscriptions.csv`, `messages.csv`).
     *
     * ⚠ IL DOIT ÊTRE HORS DE `public_html`. Placé dedans, le fichier des
     * préinscriptions serait téléchargeable par quiconque devine son nom.
     *
     * ⚠ CHEMIN ABSOLU UNIQUEMENT (`/home/uXXXXXXX/domains/iprig.fr/iprig-data`).
     * Un chemin relatif serait résolu contre le dossier de travail du
     * processus PHP, que l'hébergeur choisit : il est donc ignoré, avec une
     * ligne dans le journal PHP, et le défaut ci-dessous reprend la main.
     *
     * Laisser vide pour utiliser le défaut : le dossier `iprig-data` situé
     * juste au-dessus de la racine web. C'est le réglage recommandé — il est
     * correct sur les deux dispositions Hostinger (domaine principal et
     * domaine additionnel) sans rien avoir à saisir.
     */
    'STORAGE_DIR' => '',

    /**
     * Conserver une copie des messages de contact dans `messages.csv`.
     *
     * `true` par défaut : chez un hébergeur mutualisé, un envoi d'e-mail peut
     * échouer sans prévenir, et un message perdu est un visiteur perdu.
     *
     * Passer à `false` supprime cette copie — la politique de confidentialité
     * doit alors être mise à jour, elle mentionne aujourd'hui cette copie.
     */
    'LOG_MESSAGES' => true,

    /* ------------------------------------------------------- RELAIS EXTERNE */

    /**
     * Recopie facultative de chaque demande vers un service externe :
     * n8n, Zapier, Make, ou un script Google Apps Script publié en application
     * web qui écrit dans un Google Sheets.
     *
     * C'est le SEUL chemin admis vers un Google Sheets : l'URL du script reste
     * ici, côté serveur. Aucun identifiant Google ne doit jamais se trouver
     * dans le navigateur.
     *
     * Laisser vide désactive complètement le relais — les formulaires
     * fonctionnent normalement sans lui.
     */
    'WEBHOOK_URL' => '',

    /* ------------------------------------------------- LIMITATION DE DÉBIT */

    /** Nombre maximal d'envois par appareil et par fenêtre. 0 désactive. */
    'RATE_LIMIT_MAX' => 5,

    /** Durée de la fenêtre, en secondes. */
    'RATE_LIMIT_WINDOW' => 600,

    /**
     * Sel de l'empreinte d'adresse IP utilisée par la limitation de débit.
     * Mettre n'importe quelle chaîne longue et aléatoire. L'adresse IP
     * elle-même n'est jamais écrite sur le disque : seule une empreinte salée
     * et tronquée sert de nom de fichier temporaire.
     */
    'RATE_LIMIT_SALT' => 'REMPLACER-PAR-UNE-CHAINE-ALEATOIRE-LONGUE',

    /* ------------------------------------------------------------- DIVERS */

    /** Fuseau des horodatages inscrits dans les tableaux. */
    'TIMEZONE' => 'Europe/Paris',
];
