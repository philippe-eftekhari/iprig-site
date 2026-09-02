/**
 * ============================================================================
 *  IPRIG — fabrication du paquet de déploiement Hostinger
 * ============================================================================
 *  Transforme `dist/` en une release vérifiée, prête à être téléversée :
 *
 *      release/iprig-<version>-public_html.zip   contenu de public_html/
 *      release/private/                          ce qui va AU-DESSUS de la racine web
 *      release/MANIFEST.txt                      inventaire exact + empreintes
 *
 *  Le script REFUSE de produire une archive si `dist/` est incomplet ou s'il
 *  contient quoi que ce soit qui n'a rien à faire sur un serveur public. Un
 *  paquet qui sort d'ici est un paquet dont le contenu a été contrôlé.
 *
 *      node scripts/package-release.mjs        # ou : npm run release
 *
 *  ⚠ Ce script ne se connecte à rien. Il ne téléverse rien, ne lit aucun
 *    identifiant, n'écrit aucun secret. Il fabrique un fichier, c'est tout.
 * ============================================================================
 */
import {
  readdirSync, readFileSync, writeFileSync, statSync,
  mkdirSync, rmSync, existsSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { deflateRawSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, relative, posix } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const projet = resolve(here, '..');
const dist = join(projet, 'dist');
const sortie = join(projet, 'release');

const version = JSON.parse(readFileSync(join(projet, 'package.json'), 'utf8')).version;
const nomArchive = `iprig-v${version}-public_html.zip`;

/* -------------------------------------------------------------------------- */
/*  CE QUI DOIT ÊTRE LÀ, ET CE QUI NE DOIT PAS Y ÊTRE                         */
/* -------------------------------------------------------------------------- */

/** Sans l'un de ces fichiers, le site est cassé en ligne. */
const REQUIS = [
  '.htaccess',
  'index.html',
  'programme.html',
  'certificats.html',
  'kevan-gafaiti.html',
  'contact.html',
  'mentions-legales.html',
  'politique-confidentialite.html',
  '404.html',
  'robots.txt',
  'sitemap-index.xml',
  'sitemap-0.xml',
  /* V4.2 — `favicon.svg` a disparu de cette liste. C'était le symbole dessiné
     de la V3.1 (cercle et losange laiton), resté dans le paquet alors que les
     onglets lisent les PNG produits à partir du logo officiel depuis la V4.0.
     Il est désormais interdit, pas seulement facultatif : voir INTERDITS. */
  'favicon-32.png',
  'favicon-192.png',
  'apple-touch-icon.png',
  'og-image.png',
  'api/.htaccess',
  'api/_lib.php',
  'api/contact.php',
  'api/preinscription.php',
  'api/config.sample.php',
  'api/certificats.json',
];

/**
 * Rien de tout cela ne doit atteindre un serveur public : code source,
 * documentation interne, secrets, données personnelles, sauvegardes.
 * La liste est volontairement plus large que ce qu'Astro peut produire —
 * elle protège aussi contre une copie manuelle malencontreuse dans `dist/`.
 */
const INTERDITS = [
  /(^|\/)\.env($|\.)/i,
  /(^|\/)\.git(\/|$)/i,
  /(^|\/)node_modules(\/|$)/i,
  /(^|\/)src(\/|$)/i,
  /(^|\/)scripts(\/|$)/i,
  /(^|\/)screenshots(\/|$)/i,
  /(^|\/)api\/config\.php$/i,   // le fichier RENSEIGNÉ, pas le modèle
  /* V4.2 — l'ancien favicon dessiné ne doit plus jamais repartir en ligne.
     Le régénérer par mégarde ferait échouer le paquet, pas passer un onglet
     au losange laiton sans que personne ne le remarque. */
  /(^|\/)favicon\.svg$/i,
  /\.(csv|md|zip|log|bak|sql|pem|key|ini)$/i,
  /(^|\/)package(-lock)?\.json$/i,
  /(^|\/)tsconfig\.json$/i,
  /(^|\/)astro\.config\./i,
];

/** Fichiers texte : normalisés en LF avant archivage. */
const TEXTE = /\.(html|css|js|mjs|json|xml|txt|php|svg|map)$/i;
const EST_HTACCESS = (p) => posix.basename(p) === '.htaccess';

/* -------------------------------------------------------------------------- */
/*  INVENTAIRE                                                                */
/* -------------------------------------------------------------------------- */

function lister(racine, base = racine) {
  const out = [];
  for (const entree of readdirSync(racine, { withFileTypes: true })) {
    const chemin = join(racine, entree.name);
    if (entree.isDirectory()) out.push(...lister(chemin, base));
    else if (entree.isFile()) out.push(relative(base, chemin).split('\\').join('/'));
  }
  return out.sort();
}

if (!existsSync(dist)) {
  console.error('✗ `dist/` est absent. Lancer `npm run build` d’abord.');
  process.exit(1);
}

const fichiers = lister(dist);
const erreurs = [];

for (const requis of REQUIS) {
  if (!fichiers.includes(requis)) erreurs.push(`fichier requis absent : ${requis}`);
}
for (const f of fichiers) {
  const motif = INTERDITS.find((r) => r.test(f));
  if (motif) erreurs.push(`fichier interdit dans le paquet : ${f}  (${motif})`);
}

/* Contrôle de fuite : aucune adresse e-mail réelle ne doit sortir d'ici.
   Trois adresses seulement sont tolérées, et elles sont toutes publiques :
   l'exemple affiché dans les champs de formulaire, l'expéditeur technique du
   domaine, et le marqueur du modèle de configuration. `config.sample.php`
   reste donc bien analysé — une vraie adresse de destination laissée dedans
   par mégarde ferait échouer le paquet, ce qui est exactement le but. */
const TOLEREES = new Set([
  'prenom.nom@exemple.fr',
  'no-reply@iprig.fr',
  'remplacer@example.com',
]);
for (const f of fichiers) {
  if (!TEXTE.test(f)) continue;
  const texte = readFileSync(join(dist, f), 'utf8');
  for (const adresse of texte.match(/[\w.%+-]+@[\w.-]+\.[a-z]{2,}/gi) ?? []) {
    if (!TOLEREES.has(adresse.toLowerCase())) {
      erreurs.push(`adresse e-mail dans le paquet : ${adresse}  (${f})`);
    }
  }
}

/* Un BOM en tête d'un fichier PHP produit une sortie AVANT `header()` :
   toutes les réponses JSON des formulaires seraient cassées. */
for (const f of fichiers.filter((x) => x.endsWith('.php'))) {
  const brut = readFileSync(join(dist, f));
  if (brut[0] === 0xef && brut[1] === 0xbb && brut[2] === 0xbf) {
    erreurs.push(`BOM UTF-8 en tête de ${f} — casse les en-têtes HTTP`);
  }
}

if (erreurs.length) {
  console.error('\n✗ Paquet REFUSÉ :\n');
  for (const e of erreurs) console.error(`   · ${e}`);
  console.error('\nAucune archive n’a été écrite.\n');
  process.exit(1);
}

/* -------------------------------------------------------------------------- */
/*  ÉCRITURE DU ZIP                                                           */
/* -------------------------------------------------------------------------- */

const TABLE_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = TABLE_CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Date/heure au format MS-DOS, tel que l'exige l'en-tête ZIP. */
function dosDate(d) {
  const annee = Math.max(1980, d.getFullYear());
  return {
    heure: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
    date: ((annee - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  };
}

/**
 * Archive ZIP minimale, écrite à la main.
 *
 * Pourquoi pas `Compress-Archive` ni une dépendance : il faut des séparateurs
 * POSIX (`/`) et des permissions Unix dans les en-têtes, faute de quoi
 * l'extraction côté Hostinger produit des noms de fichiers à antislash. Le
 * format ZIP tient en cinquante lignes, ce n'est pas la peine d'installer un
 * paquet pour cela.
 */
function ecrireZip(entrees) {
  const locaux = [];
  const centraux = [];
  let position = 0;

  for (const { nom, contenu, mtime } of entrees) {
    const compresse = deflateRawSync(contenu, { level: 9 });
    const { heure, date } = dosDate(mtime);
    const crc = crc32(contenu);
    const nomBuf = Buffer.from(nom, 'utf8');

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);      // version minimale
    local.writeUInt16LE(0x0800, 6);  // noms en UTF-8
    local.writeUInt16LE(8, 8);       // deflate
    local.writeUInt16LE(heure, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compresse.length, 18);
    local.writeUInt32LE(contenu.length, 22);
    local.writeUInt16LE(nomBuf.length, 26);
    locaux.push(local, nomBuf, compresse);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE((3 << 8) | 20, 4); // créé sous Unix : les modes comptent
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(heure, 12);
    central.writeUInt16LE(date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(compresse.length, 20);
    central.writeUInt32LE(contenu.length, 24);
    central.writeUInt16LE(nomBuf.length, 28);
    central.writeUInt32LE((0o100644 << 16) >>> 0, 38); // fichier ordinaire, 0644
    central.writeUInt32LE(position, 42);
    centraux.push(central, nomBuf);

    position += 30 + nomBuf.length + compresse.length;
  }

  const cd = Buffer.concat(centraux);
  const fin = Buffer.alloc(22);
  fin.writeUInt32LE(0x06054b50, 0);
  fin.writeUInt16LE(entrees.length, 8);
  fin.writeUInt16LE(entrees.length, 10);
  fin.writeUInt32LE(cd.length, 12);
  fin.writeUInt32LE(position, 16);

  return Buffer.concat([...locaux, cd, fin]);
}

/* -------------------------------------------------------------------------- */
/*  PRODUCTION                                                                */
/* -------------------------------------------------------------------------- */

rmSync(sortie, { recursive: true, force: true });
mkdirSync(join(sortie, 'private'), { recursive: true });

const entrees = [];
const lignesManifeste = [];
let octets = 0;

for (const nom of fichiers) {
  const chemin = join(dist, nom);
  let contenu = readFileSync(chemin);

  // Fins de ligne : LF partout. Un `.htaccess` en CRLF passe sur Apache mais
  // pas sur toutes les piles LiteSpeed ; autant ne pas prendre le risque.
  if (TEXTE.test(nom) || EST_HTACCESS(nom)) {
    contenu = Buffer.from(contenu.toString('utf8').replace(/\r\n/g, '\n'), 'utf8');
  }

  entrees.push({ nom, contenu, mtime: statSync(chemin).mtime });
  octets += contenu.length;
  lignesManifeste.push(
    `${createHash('sha256').update(contenu).digest('hex')}  ${String(contenu.length).padStart(8)}  ${nom}`
  );
}

writeFileSync(join(sortie, nomArchive), ecrireZip(entrees));

/* Le garde-fou du dossier privé. `_lib.php` sait l'écrire lui-même, mais le
   livrer permet de le déposer AVANT le premier envoi de formulaire. */
writeFileSync(
  join(sortie, 'private', 'htaccess-pour-iprig-data.txt'),
  'Require all denied\nOptions -Indexes\n'
);

const zipOctets = statSync(join(sortie, nomArchive)).size;

writeFileSync(
  join(sortie, 'MANIFEST.txt'),
  [
    '='.repeat(78),
    ` IPRIG v${version} — paquet de déploiement Hostinger`,
    '='.repeat(78),
    '',
    ` Archive        : ${nomArchive}`,
    ` Destination    : contenu de public_html/  (extraire À LA RACINE)`,
    ` Fichiers       : ${fichiers.length}`,
    ` Poids décompressé : ${(octets / 1024).toFixed(0)} Kio`,
    ` Poids archive     : ${(zipOctets / 1024).toFixed(0)} Kio`,
    '',
    ' À CRÉER À LA MAIN SUR LE SERVEUR, ET ABSENTS DE CETTE ARCHIVE :',
    '   public_html/api/config.php      copie renseignée de config.sample.php',
    '   <au-dessus de public_html>/iprig-data/   dossier des tableaux privés',
    '',
    '-'.repeat(78),
    ' SHA-256                                                            octets  fichier',
    '-'.repeat(78),
    ...lignesManifeste,
    '',
  ].join('\n')
);

console.log(`✓ ${nomArchive} — ${fichiers.length} fichiers, ${(zipOctets / 1024).toFixed(0)} Kio`);
console.log(`  release/MANIFEST.txt — inventaire et empreintes SHA-256`);
console.log(`  release/private/ — le garde-fou du dossier de données`);
