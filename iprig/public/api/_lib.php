<?php
/**
 * ============================================================================
 *  IPRIG — socle commun des deux points d'entrée de formulaire
 * ============================================================================
 *  Le site est STATIQUE. Ces deux fichiers PHP sont les seules parties
 *  exécutées sur le serveur : ils reçoivent un formulaire, le valident, en
 *  envoient le contenu par e-mail et l'inscrivent dans un tableau privé.
 *
 *  ---------------------------------------------------------------------------
 *  CE QUI N'EST JAMAIS EXPOSÉ AU NAVIGATEUR
 *  ---------------------------------------------------------------------------
 *  — l'adresse de destination : elle vit dans `config.php`, hors dépôt, et
 *    n'apparaît ni dans le HTML, ni dans le JavaScript, ni dans une réponse ;
 *  — le chemin du tableau privé ;
 *  — le détail des erreurs serveur : le visiteur reçoit un message générique,
 *    la cause exacte part dans le journal PHP.
 *
 *  ---------------------------------------------------------------------------
 *  DONNÉES PERSONNELLES
 *  ---------------------------------------------------------------------------
 *  On n'enregistre QUE ce que le visiteur a saisi, plus l'horodatage. Ni
 *  adresse IP, ni user-agent, ni empreinte, ni cookie. La limitation de débit
 *  utilise une empreinte tronquée et salée de l'adresse IP, écrite dans un
 *  fichier éphémère purgé automatiquement — l'adresse elle-même n'est jamais
 *  écrite sur le disque.
 * ============================================================================
 */

declare(strict_types=1);

/* -------------------------------------------------------------------------- */
/*  CONFIGURATION                                                             */
/* -------------------------------------------------------------------------- */

/**
 * `config.php` n'est PAS versionné : il est créé sur le serveur à partir de
 * `config.sample.php`. Voir `.env.example` et `V4_HANDOFF.md`.
 */
function iprig_config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $path = __DIR__ . '/config.php';
    if (!is_file($path)) {
        error_log('IPRIG : config.php absent — copier config.sample.php et le renseigner.');
        $config = [];
        return $config;
    }

    $loaded = require $path;
    $config = is_array($loaded) ? $loaded : [];
    return $config;
}

function iprig_setting(string $key, $default = null)
{
    $config = iprig_config();
    return array_key_exists($key, $config) ? $config[$key] : $default;
}

/* -------------------------------------------------------------------------- */
/*  RÉPONSES                                                                  */
/* -------------------------------------------------------------------------- */

/** Le formulaire a-t-il été envoyé par `fetch` plutôt que par le navigateur ? */
function iprig_wants_json(): bool
{
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $requested = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';
    return str_contains($accept, 'application/json') || $requested === 'fetch';
}

/**
 * Termine la requête.
 *
 * Deux formes de réponse pour un seul point d'entrée : JSON quand le
 * formulaire a été soumis en JavaScript, page HTML minimale quand il a été
 * soumis nativement. Le site reste donc utilisable sans JavaScript.
 */
function iprig_respond(int $status, bool $ok, string $message, string $backTo = '/'): void
{
    http_response_code($status);

    if (iprig_wants_json()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
        exit;
    }

    header('Content-Type: text/html; charset=utf-8');
    $titre = $ok ? 'Message envoyé' : 'Envoi impossible';
    $safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    $safeBack = htmlspecialchars($backTo, ENT_QUOTES, 'UTF-8');

    echo <<<HTML
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>{$titre} — IPRIG</title>
<style>
  :root { color-scheme: light; }
  body {
    margin: 0; min-height: 100vh;
    display: grid; place-items: center;
    padding: 2rem;
    background: #f6f3ed; color: #14191b;
    font: 400 1.0625rem/1.6 'Instrument Sans', 'Segoe UI', system-ui, sans-serif;
  }
  main { max-width: 34rem; }
  h1 {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 2rem; font-weight: 500; line-height: 1.15;
    letter-spacing: -0.02em; color: #0d2e4a; margin: 0 0 1rem;
  }
  p { margin: 0 0 2rem; color: #3a4447; }
  a {
    display: inline-block; padding: 0.85rem 1.5rem;
    background: #0d2e4a; color: #f6f3ed;
    text-decoration: none; letter-spacing: 0.02em;
  }
  a:hover { background: #1c4438; }
</style>
</head>
<body>
  <main>
    <h1>{$titre}</h1>
    <p>{$safeMessage}</p>
    <a href="{$safeBack}">Retour au site</a>
  </main>
</body>
</html>
HTML;
    exit;
}

/* -------------------------------------------------------------------------- */
/*  GARDES D'ENTRÉE                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Contrôles communs à tous les formulaires, dans l'ordre du moins coûteux au
 * plus coûteux.
 */
function iprig_guard(string $backTo): void
{
    // 1. Méthode
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        iprig_respond(405, false, 'Méthode non autorisée.', $backTo);
    }

    // 2. Taille : une soumission normale pèse quelques kilo-octets.
    $length = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($length > 64 * 1024) {
        iprig_respond(413, false, 'Message trop volumineux.', $backTo);
    }

    // 3. Origine : quand le navigateur l'annonce, elle doit être la nôtre.
    //    Absente (certains clients), on laisse passer — la garde suivante
    //    (pot de miel + limitation de débit) prend le relais.
    $host = $_SERVER['HTTP_HOST'] ?? '';
    $source = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
    if ($source !== '' && $host !== '') {
        $sourceHost = parse_url($source, PHP_URL_HOST) ?: '';
        /* `preg_replace` et non `ltrim` : `ltrim($h, 'www.')` retire
           N'IMPORTE lequel des caracteres de la liste en tete, et
           transformerait « web.iprig.fr » en « eb.iprig.fr ». */
        $strip = static fn (string $h): string => (string) preg_replace('/^www\./i', '', $h);
        if (strcasecmp($strip($sourceHost), $strip($host)) !== 0) {
            iprig_respond(403, false, 'Requête refusée.', $backTo);
        }
    }

    // 4. Pot de miel : champ invisible, vide chez un humain, rempli par un
    //    robot qui remplit tout ce qu'il trouve. On répond « envoyé » sans
    //    rien envoyer : inutile de renseigner le robot sur la détection.
    if (trim((string) ($_POST['website'] ?? '')) !== '') {
        iprig_respond(200, true, 'Votre message a bien été envoyé.', $backTo);
    }

    // 5. Délai de remplissage. `_t` est posé par le JavaScript au chargement
    //    de la page ; absent (navigation sans JavaScript), on ne teste rien.
    $t = (int) ($_POST['_t'] ?? 0);
    if ($t > 0 && (time() - $t) < 2) {
        iprig_respond(200, true, 'Votre message a bien été envoyé.', $backTo);
    }

    // 6. Limitation de débit
    iprig_rate_limit($backTo);
}

/**
 * Limitation de débit par empreinte d'adresse IP.
 *
 * L'adresse n'est jamais écrite : seule une empreinte SHA-256 salée, tronquée
 * à 16 caractères, sert de nom de fichier. Le fichier ne contient qu'un
 * compteur et un horodatage, et les fichiers périmés sont supprimés à chaque
 * passage. Rien de tout cela ne permet de remonter à une personne.
 */
function iprig_rate_limit(string $backTo): void
{
    $max = (int) iprig_setting('RATE_LIMIT_MAX', 5);
    $window = (int) iprig_setting('RATE_LIMIT_WINDOW', 600);
    if ($max <= 0) {
        return;
    }

    $dir = iprig_storage_dir() . '/rate';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return; // Pas de stockage : on ne bloque pas un visiteur légitime.
    }

    // Purge : au plus une fois par tranche de fenêtre, pas à chaque requête.
    foreach (glob($dir . '/*.txt') ?: [] as $old) {
        if (@filemtime($old) < time() - $window) {
            @unlink($old);
        }
    }

    $salt = (string) iprig_setting('RATE_LIMIT_SALT', 'iprig');
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $file = $dir . '/' . substr(hash('sha256', $salt . $ip), 0, 16) . '.txt';

    $count = is_file($file) ? (int) @file_get_contents($file) : 0;
    if ($count >= $max) {
        iprig_respond(
            429,
            false,
            'Trop de demandes envoyées depuis cet appareil. Merci de réessayer dans quelques minutes.',
            $backTo
        );
    }
    @file_put_contents($file, (string) ($count + 1), LOCK_EX);
}

/* -------------------------------------------------------------------------- */
/*  NETTOYAGE ET VALIDATION                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Champ sur une seule ligne.
 *
 * Les retours chariot sont retirés AVANT toute autre chose : c'est par eux
 * qu'on injecte des en-têtes dans un e-mail (`Bcc:`, `Content-Type:`…).
 */
function iprig_line(string $key, int $max): string
{
    $value = (string) ($_POST[$key] ?? '');
    $value = str_replace(["\r", "\n", "\0"], ' ', $value);
    $value = preg_replace('/\s+/u', ' ', $value) ?? '';
    return mb_substr(trim($value), 0, $max);
}

/** Champ multiligne : les retours à la ligne sont conservés, pas les nuls. */
function iprig_text(string $key, int $max): string
{
    $value = (string) ($_POST[$key] ?? '');
    $value = str_replace(["\r\n", "\r", "\0"], ["\n", "\n", ''], $value);
    $value = preg_replace('/\n{3,}/', "\n\n", $value) ?? '';
    return mb_substr(trim($value), 0, $max);
}

/** Adresse valide, sans retour chariot, de longueur raisonnable. */
function iprig_email(string $key): ?string
{
    $value = iprig_line($key, 254);
    if ($value === '' || !filter_var($value, FILTER_VALIDATE_EMAIL)) {
        return null;
    }
    return $value;
}

/* -------------------------------------------------------------------------- */
/*  STOCKAGE PRIVÉ                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Dossier des données, HORS de `public_html`.
 *
 * Le placer dans `public_html` rendrait le tableau des préinscriptions
 * téléchargeable par quiconque devine son nom. Le défaut remonte donc d'un
 * cran au-dessus de la racine web.
 */
function iprig_storage_dir(): string
{
    $configured = (string) iprig_setting('STORAGE_DIR', '');
    if ($configured !== '') {
        return rtrim($configured, '/\\');
    }
    return dirname(__DIR__, 2) . '/iprig-data';
}

/**
 * Ajoute une ligne au tableau privé (CSV, UTF-8 avec BOM).
 *
 * Le CSV est le format le plus exportable qui soit : il s'ouvre dans Excel,
 * Numbers, LibreOffice et s'importe dans Google Sheets sans conversion. Le
 * BOM évite qu'Excel n'affiche « Ã© » à la place de « é ».
 *
 * Le fichier est verrouillé pendant l'écriture : deux envois simultanés ne
 * peuvent pas produire une ligne tronquée.
 *
 * @return bool `false` si l'écriture a échoué — l'appelant décide alors si
 *              la demande doit être considérée comme perdue.
 */
function iprig_append_row(string $file, array $headers, array $row): bool
{
    $dir = iprig_storage_dir();
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        error_log('IPRIG : impossible de créer le dossier de données ' . $dir);
        return false;
    }

    // Ceinture et bretelles : si le dossier se retrouvait un jour sous la
    // racine web, ce .htaccess en interdirait la lecture.
    $guard = $dir . '/.htaccess';
    if (!is_file($guard)) {
        @file_put_contents($guard, "Require all denied\nOptions -Indexes\n");
    }

    $path = $dir . '/' . $file;
    $new = !is_file($path);

    $handle = @fopen($path, 'ab');
    if ($handle === false) {
        error_log('IPRIG : impossible d’ouvrir ' . $path);
        return false;
    }

    if (flock($handle, LOCK_EX)) {
        if ($new) {
            fwrite($handle, "\xEF\xBB\xBF"); // BOM UTF-8
            fputcsv($handle, $headers, ',', '"', '');
        }
        /* Echappement VIDE, et non la barre oblique inverse historique de
           PHP : c'est la seule valeur conforme au RFC 4180. Avec le defaut,
           une valeur qui contient une barre oblique inverse ressort corrompue
           dans le tableur. Le parametre est passe explicitement, PHP 8.4
           depreciant son omission. */
        fputcsv($handle, $row, ',', '"', '');
        fflush($handle);
        flock($handle, LOCK_UN);
    }
    fclose($handle);
    @chmod($path, 0600);

    return true;
}

/* -------------------------------------------------------------------------- */
/*  ENVOI                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Envoie le message à la boîte de l'IPRIG.
 *
 * L'expéditeur est TOUJOURS une adresse du domaine : mettre l'adresse du
 * visiteur en `From:` ferait échouer SPF et DKIM, et le message finirait en
 * indésirable. C'est `Reply-To:` qui porte l'adresse du visiteur — répondre
 * depuis la boîte fonctionne donc normalement.
 */
function iprig_send_mail(string $subject, string $body, ?string $replyTo = null): bool
{
    $to = (string) iprig_setting('MAIL_TO', '');
    if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
        error_log('IPRIG : MAIL_TO absent ou invalide dans config.php.');
        return false;
    }

    $host = $_SERVER['HTTP_HOST'] ?? 'iprig.fr';
    $from = (string) iprig_setting('MAIL_FROM', 'no-reply@' . preg_replace('/^www\./', '', $host));

    $headers = [
        'From: IPRIG <' . $from . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'X-Mailer: iprig.fr',
    ];

    // `Reply-To` n'est ajouté qu'après validation stricte : c'est le seul
    // en-tête qui contienne une donnée venue du visiteur.
    if ($replyTo !== null && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
        $headers[] = 'Reply-To: ' . $replyTo;
    }

    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

    return @mail($to, $encodedSubject, $body, implode("\r\n", $headers), '-f' . $from);
}

/* -------------------------------------------------------------------------- */
/*  RELAIS FACULTATIF                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Recopie la demande vers un service externe (n8n, Zapier, Google Apps
 * Script…) si — et seulement si — une URL a été configurée sur le serveur.
 *
 * C'est le chemin prévu pour alimenter un Google Sheets sans jamais placer
 * d'identifiant Google dans le navigateur : le secret reste dans l'URL du
 * script, côté serveur. Non configuré, cette fonction ne fait rien et
 * n'empêche jamais l'envoi de l'e-mail.
 */
function iprig_forward(array $payload): void
{
    $url = (string) iprig_setting('WEBHOOK_URL', '');
    if ($url === '' || !filter_var($url, FILTER_VALIDATE_URL)) {
        return;
    }
    if (!function_exists('curl_init')) {
        return;
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 5,
        CURLOPT_CONNECTTIMEOUT => 3,
    ]);
    $ok = curl_exec($ch);
    if ($ok === false) {
        error_log('IPRIG : relais webhook en échec — ' . curl_error($ch));
    }
    curl_close($ch);
}

/** Horodatage ISO 8601, dans le fuseau configuré. */
function iprig_now(): string
{
    $tz = (string) iprig_setting('TIMEZONE', 'Europe/Paris');
    try {
        return (new DateTimeImmutable('now', new DateTimeZone($tz)))->format('Y-m-d H:i:s');
    } catch (Throwable $e) {
        /* `Throwable` et non `Exception` : depuis PHP 8.3, un fuseau invalide
           leve `DateInvalidTimeZoneException`, qui descend de `Error`. */
        return gmdate('Y-m-d H:i:s') . ' UTC';
    }
}
