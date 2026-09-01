<?php
/**
 * ============================================================================
 *  POST /api/preinscription.php — préinscription aux certificats
 * ============================================================================
 *  Champs attendus : nom, email, certificats[] (au moins un), message
 *  facultatif (+ pot de miel `website` et horodatage `_t`, invisibles).
 *
 *  Chaque demande valide fait DEUX choses, comme convenu avec le client :
 *
 *    1. un e-mail part vers la boîte de l'IPRIG ;
 *    2. une ligne est ajoutée au tableau privé `preinscriptions.csv`,
 *       hors de la racine web.
 *
 *  Si l'une des deux échoue, la demande n'est pas perdue pour autant — mais
 *  si les DEUX échouent, le visiteur est prévenu. On ne lui affiche jamais
 *  une confirmation qui ne correspond à rien.
 *
 *  ⚠ AUCUN PAIEMENT. La V4 n'ouvre que la préinscription : ni panier, ni
 *  Stripe, ni bouton « Acheter ». Le message de confirmation dit « demande
 *  de préinscription envoyée », jamais « inscription confirmée ».
 * ============================================================================
 */

declare(strict_types=1);

require __DIR__ . '/_lib.php';

const RETOUR = '/certificats';

/** Nombre de certificats au catalogue : au-delà, la soumission est aberrante. */
const MAX_CERTIFICATS = 20;

iprig_guard(RETOUR);

/* ------------------------------------------------------------- Catalogue --- */

/**
 * Le catalogue est produit au build par Astro depuis `src/data/certificats.ts`
 * (voir `src/pages/api/certificats.json.ts`). On valide donc les certificats
 * reçus contre la MÊME source que celle qui a dessiné les cases à cocher.
 *
 * Si le fichier manque (build partiel, transfert incomplet), on se rabat sur
 * une validation de forme : mieux vaut accepter une demande à vérifier à la
 * main que perdre un candidat.
 *
 * @return array<string,string>|null id => intitulé, ou `null` si indisponible
 */
function iprig_catalogue(): ?array
{
    $path = __DIR__ . '/certificats.json';
    if (!is_file($path)) {
        error_log('IPRIG : certificats.json absent — validation de forme seule.');
        return null;
    }

    $data = json_decode((string) @file_get_contents($path), true);
    if (!is_array($data) || !isset($data['certificates']) || !is_array($data['certificates'])) {
        error_log('IPRIG : certificats.json illisible.');
        return null;
    }

    $catalogue = [];
    foreach ($data['certificates'] as $c) {
        if (isset($c['id'], $c['title']) && is_string($c['id']) && is_string($c['title'])) {
            $catalogue[$c['id']] = $c['title'];
        }
    }
    return $catalogue === [] ? null : $catalogue;
}

/* ------------------------------------------------------------ Validation --- */

$erreurs = [];

$nom = iprig_line('nom', 120);
if (mb_strlen($nom) < 2) {
    $erreurs[] = 'vos nom et prénom';
}

$email = iprig_email('email');
if ($email === null) {
    $erreurs[] = 'une adresse e-mail valide';
}

/* Sélection multiple : le navigateur envoie `certificats[]`. */
$recus = $_POST['certificats'] ?? [];
if (is_string($recus)) {
    $recus = [$recus];
}
if (!is_array($recus)) {
    $recus = [];
}
$recus = array_slice($recus, 0, MAX_CERTIFICATS);

$catalogue = iprig_catalogue();
$choisis = [];

foreach ($recus as $id) {
    if (!is_string($id)) {
        continue;
    }
    $id = trim($id);
    // Forme : un identifiant de certificat est un slug, rien d'autre.
    if (!preg_match('/^[a-z0-9-]{3,64}$/', $id)) {
        continue;
    }
    if ($catalogue !== null) {
        if (isset($catalogue[$id])) {
            $choisis[$id] = $catalogue[$id];
        }
        continue;
    }
    // Catalogue indisponible : on garde l'identifiant, à vérifier à la main.
    $choisis[$id] = $id;
}

if ($choisis === []) {
    $erreurs[] = 'au moins un certificat';
}

$message = iprig_text('message', 3000); // Facultatif.

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
$liste = implode("\n  · ", array_values($choisis));
$listeCsv = implode(' | ', array_values($choisis));
$messageAffiche = $message === '' ? '(aucun)' : $message;

$corps = <<<TEXTE
Nouvelle demande de préinscription à un certificat de géopolitique.

Date     : {$horodatage}
Nom      : {$nom}
E-mail   : {$email}

Certificats souhaités
  · {$liste}

Message
-------
{$messageAffiche}

--
Cette demande a également été enregistrée dans le tableau des préinscriptions.
TEXTE;

$envoye = iprig_send_mail('[IPRIG] Nouvelle préinscription certificat', $corps, $email);

/* Le tableau privé. Colonnes convenues avec le client : horodatage, nom,
   e-mail, certificats, message, statut. Le statut initial est « Nouveau » ;
   il se met à jour à la main, dans le tableur. */
$enregistre = iprig_append_row(
    'preinscriptions.csv',
    ['Horodatage', 'Nom et prénom', 'E-mail', 'Certificats', 'Message', 'Statut'],
    [$horodatage, $nom, $email, $listeCsv, $message, 'Nouveau']
);

iprig_forward([
    'type' => 'preinscription',
    'horodatage' => $horodatage,
    'nom' => $nom,
    'email' => $email,
    'certificats' => array_values($choisis),
    'message' => $message,
    'statut' => 'Nouveau',
]);

if (!$envoye && !$enregistre) {
    error_log('IPRIG : préinscription — e-mail ET enregistrement en échec.');
    iprig_respond(
        500,
        false,
        'L’envoi a échoué. Merci de réessayer dans un instant.',
        RETOUR
    );
}

iprig_respond(200, true, 'Votre demande de préinscription a bien été envoyée.', RETOUR);
