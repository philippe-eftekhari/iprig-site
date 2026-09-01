<?php
/**
 * ============================================================================
 *  POST /api/contact.php — formulaire « Écrire à l'IPRIG »
 * ============================================================================
 *  Champs attendus : email, objet, message (+ pot de miel `website` et
 *  horodatage `_t`, tous deux invisibles).
 *
 *  Le message part par e-mail vers l'adresse configurée côté serveur, et une
 *  copie est inscrite dans le tableau privé — un envoi d'e-mail peut échouer
 *  silencieusement chez un hébergeur mutualisé, et un message perdu est un
 *  visiteur perdu.
 * ============================================================================
 */

declare(strict_types=1);

require __DIR__ . '/_lib.php';

const RETOUR = '/contact';

iprig_guard(RETOUR);

/* ------------------------------------------------------------ Validation --- */

$erreurs = [];

$email = iprig_email('email');
if ($email === null) {
    $erreurs[] = 'une adresse e-mail valide';
}

$objet = iprig_line('objet', 150);
if ($objet === '') {
    $erreurs[] = 'un objet';
}

$message = iprig_text('message', 5000);
if (mb_strlen($message) < 10) {
    $erreurs[] = 'un message d’au moins dix caractères';
}

if ($erreurs !== []) {
    iprig_respond(
        422,
        false,
        'Merci d’indiquer ' . implode(', ', $erreurs) . '.',
        RETOUR
    );
}

/* ------------------------------------------------------------- Traitement --- */

$horodatage = iprig_now();

$corps = <<<TEXTE
Nouveau message envoyé depuis le formulaire de contact de iprig.fr.

Date     : {$horodatage}
E-mail   : {$email}
Objet    : {$objet}

Message
-------
{$message}
TEXTE;

$envoye = iprig_send_mail('[IPRIG] Nouveau message de contact', $corps, $email);

/* Copie dans le tableau privé — filet de sécurité si l'e-mail n'est pas parti.
   Désactivable par `LOG_MESSAGES => false` dans config.php ; la politique de
   confidentialité doit alors être mise à jour en conséquence. */
$journalise = true;
if (iprig_setting('LOG_MESSAGES', true)) {
    $journalise = iprig_append_row(
        'messages.csv',
        ['Horodatage', 'E-mail', 'Objet', 'Message', 'Statut'],
        [$horodatage, $email, $objet, $message, $envoye ? 'Envoyé' : 'E-mail en échec']
    );
}

iprig_forward([
    'type' => 'contact',
    'horodatage' => $horodatage,
    'email' => $email,
    'objet' => $objet,
    'message' => $message,
]);

/* Si NI l'e-mail NI l'enregistrement n'ont abouti, la demande est perdue :
   il faut le dire au visiteur plutôt que d'afficher une confirmation fausse. */
if (!$envoye && !$journalise) {
    error_log('IPRIG : contact — e-mail ET enregistrement en échec.');
    iprig_respond(
        500,
        false,
        'L’envoi a échoué. Merci de réessayer dans un instant.',
        RETOUR
    );
}

iprig_respond(200, true, 'Votre message a bien été envoyé.', RETOUR);
