/**
 * ============================================================================
 *  PRÉPARATION DES MASTERS WEB — photographies et logo
 * ============================================================================
 *  Les fichiers ORIGINAUX ne sont jamais modifiés ni déplacés. Ce script les
 *  lit dans un dossier extérieur au dépôt et écrit des « masters web » dans
 *  `src/assets/` : redimensionnés, réorientés selon l'EXIF, compressés
 *  raisonnablement, mais sans aucune retouche esthétique — pas de filtre,
 *  pas de saturation, pas de vignettage, pas de correction de visage.
 *
 *  Astro se charge ensuite du reste au build : `<Image>` produit les formats
 *  modernes, les tailles multiples et les attributs `srcset` / `sizes`.
 *
 *      node scripts/prepare-assets.mjs ["chemin/vers/le/dossier/source"]
 *
 *  Relancer uniquement si une photo source change ou si une nouvelle photo
 *  validée par le client est ajoutée à la sélection ci-dessous.
 * ============================================================================
 */
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

/** Dossier des originaux — HORS du dépôt, jamais écrit. */
const SRC =
  process.argv[2] ??
  resolve(root, '../../Photo Kevan');

/** Côté le plus long des masters web. Au-delà, Astro n'en tire rien. */
const MAX = 2200;
const QUALITY = 82;

/**
 * Sélection éditoriale. Chaque entrée dit POURQUOI la photo est retenue :
 * c'est ce commentaire qui évite qu'une photo se retrouve un jour au mauvais
 * endroit. Les photos non listées ici ne sont pas intégrées au site.
 */
const PHOTOS = [
  {
    from: 'Kevan-17.jpg',
    to: 'kevan/hero-academie.jpg',
    /* Recadrage : la photographie d'origine laisse un tiers de plafond
       technique au-dessus du sujet. Dans le hero, le cadre 3/4 est haut et la
       ligne de flottaison en coupe la moitié : sans recadrage, le premier
       écran ne montrait que des poutres. On retire le quart supérieur — le
       sujet et les deux panneaux remontent au tiers haut du cadre. */
    crop: { top: 0.25, aspect: 3 / 4 },
    why: "Hero. Plateau de l'Académie diplomatique et consulaire : le registre est nommé dans l'image même, pas seulement dans la légende.",
  },
  {
    from: 'Kevan-02.JPG',
    to: 'kevan/fondateur.jpg',
    /* Source 3/2 horizontale, emplacement 4/5 vertical : le recadrage est fait
       ici plutôt que par `object-fit`, pour placer la fenêtre sur le visage
       et non au centre géométrique de l'image. */
    crop: { top: 0, aspect: 4 / 5, centerX: 0.43 },
    why: "Section fondateur de l'accueil. Prise de parole en colloque, visage lisible même dans une colonne de 490 px : c'est la seule photographie où le fondateur est reconnaissable à cette taille.",
  },
  {
    from: 'Kevan-04.JPG',
    to: 'kevan/portrait.jpg',
    why: 'Page /kevan-gafaiti. Vrai portrait, cadrage buste, fond sobre, format vertical.',
  },
  {
    from: 'Kevan-01.JPG',
    to: 'kevan/enseignement.jpg',
    why: "Aperçu du programme. Situation d'enseignement, format vertical.",
  },
  {
    from: 'Kevan-16.jpg',
    to: 'kevan/orientation.jpg',
    why: "Page /programme. Salle pleine, programme d'orientation projeté : exactement ce que fait l'IPRIG.",
  },
];

/**
 * Portraits des enseignants des certificats.
 * Format 4:5 imposé — c'est le ratio de la vignette `TeacherCard`.
 * Les portraits manquants restent `null` dans `src/data/certificats.ts` :
 * la vignette bascule alors sur son repli typographique.
 */
const TEACHERS = [
  /* Même source que le portrait de /kevan-gafaiti, recadré au 4:5 des
     vignettes : sur la page /certificats, le fondateur est un enseignant
     parmi les autres et sa vignette doit se composer comme les leurs. */
  { from: 'Kevan-04.JPG', to: 'teachers/kevan-gafaiti.jpg' },
  { from: 'alain-coppolani.jpeg', to: 'teachers/alain-coppolani.jpg' },
  { from: 'albert-kandemir.jpeg', to: 'teachers/albert-kandemir.jpg' },
  { from: 'Balkissou-Hayatou.jpg', to: 'teachers/balkissou-hayatou.jpg' },
];

/* -------------------------------------------------------------------------- */

const ensure = (file) => mkdirSync(dirname(file), { recursive: true });

/** `.rotate()` sans argument applique l'orientation EXIF puis l'efface. */
const base = (file) => sharp(file).rotate();

let done = 0;
let missing = 0;

const note = (ok, label) => {
  if (ok) done += 1;
  else missing += 1;
  console.log(`${ok ? '  ok ' : ' MANQUE '} ${label}`);
};

/* --------------------------------------------------------------- Photos --- */
for (const p of PHOTOS) {
  const from = join(SRC, p.from);
  const to = resolve(root, 'src/assets', p.to);
  if (!existsSync(from)) {
    note(false, `${p.from} introuvable`);
    continue;
  }
  ensure(to);

  let pipe = base(from);

  /* Recadrage éditorial, exprimé en fractions de l'image d'origine plutôt
     qu'en pixels : la consigne reste lisible et survit à un changement de
     définition du fichier source. La fenêtre est centrée horizontalement. */
  if (p.crop) {
    const meta = await base(from).metadata();
    const W = meta.width ?? 0;
    const H = meta.height ?? 0;
    const top = Math.round(H * (p.crop.top ?? 0));
    let height = H - top;
    let width = Math.round(height * (p.crop.aspect ?? W / H));
    if (width > W) {
      width = W;
      height = Math.round(width / (p.crop.aspect ?? W / H));
    }
    /* `centerX` déplace la fenêtre horizontalement, en fraction de la largeur
       d'origine. Par défaut elle est centrée ; on la décale quand le sujet ne
       l'est pas. La fenêtre est bornée pour ne jamais dépasser l'image. */
    const cx = (p.crop.centerX ?? 0.5) * W;
    const left = Math.max(0, Math.min(W - width, Math.round(cx - width / 2)));
    pipe = pipe.extract({ left, top, width, height });
  }

  const info = await pipe
    .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(to);
  note(true, `${p.to} — ${info.width}×${info.height}, ${Math.round(info.size / 1024)} Ko`);
}

/* ------------------------------------------------------------ Enseignants --- */
for (const t of TEACHERS) {
  const from = join(SRC, t.from);
  const to = resolve(root, 'src/assets', t.to);
  if (!existsSync(from)) {
    note(false, `${t.from} introuvable`);
    continue;
  }
  ensure(to);
  /* Cadrage 4:5 centré sur le visage : `attention` place la fenêtre sur la
     zone la plus saillante de l'image, ce qui suffit pour un portrait
     d'identité. Aucun traitement colorimétrique. */
  const info = await base(from)
    .resize({ width: 1600, height: 2000, fit: 'cover', position: sharp.strategy.attention })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(to);
  note(true, `${t.to} — ${info.width}×${info.height}, ${Math.round(info.size / 1024)} Ko`);
}

/* ------------------------------------------------------------------ Logo --- */
{
  const from = join(SRC, 'iprig-logo-cercle.png');
  if (!existsSync(from)) {
    note(false, 'iprig-logo-cercle.png introuvable');
  } else {
    /* Le logo fourni est posé sur un blanc cassé OPAQUE, pas sur de la
       transparence : posé tel quel sur le pied de page marine, il afficherait
       un carré blanc autour du rond. `trim` ramène le cadre au rond, puis un
       masque circulaire rend les coins transparents. La marque peut alors
       vivre indifféremment sur papier et sur fond sombre. */
    const SIZE = 512;
    const mask = Buffer.from(
      `<svg width="${SIZE}" height="${SIZE}"><circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2 - 1}" fill="#fff"/></svg>`,
    );

    const mark = resolve(root, 'src/assets/brand/iprig-mark.png');
    ensure(mark);
    const info = await base(from)
      .trim({ threshold: 12 })
      .resize({ width: SIZE, height: SIZE, fit: 'contain', background: '#ffffff' })
      .composite([{ input: mask, blend: 'dest-in' }])
      .png({ compressionLevel: 9 })
      .toFile(mark);
    note(true, `brand/iprig-mark.png — ${info.width}×${info.height}, ${Math.round(info.size / 1024)} Ko`);

    /* Favicons et icône iOS : mêmes pixels, tailles imposées par les OS.
       L'icône iOS reste opaque — le système la pose sur l'écran d'accueil
       sans fond, et un rond transparent y apparaîtrait sur du noir. */
    for (const [size, name, opaque] of [
      [32, 'favicon-32.png', false],
      [192, 'favicon-192.png', false],
      [180, 'apple-touch-icon.png', true],
      [512, 'favicon-512.png', false],
    ]) {
      const out = resolve(root, 'public', name);
      let pipe = sharp(mark).resize(size, size, { fit: 'contain', background: '#00000000' });
      if (opaque) pipe = pipe.flatten({ background: '#ffffff' });
      const i = await pipe.png({ compressionLevel: 9 }).toFile(out);
      note(true, `public/${name} — ${i.width}×${i.height}, ${Math.round(i.size / 1024)} Ko`);
    }
  }
}

/* ------------------------------------------------------- Logo complet (OG) --- */
{
  const from = join(SRC, 'iprig-logo-complet.png');
  const to = resolve(root, 'src/assets/brand/iprig-logo-complet.png');
  if (!existsSync(from)) {
    note(false, 'iprig-logo-complet.png introuvable');
  } else {
    ensure(to);
    const info = await base(from)
      .trim({ threshold: 12 })
      .resize({ width: 900, withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(to);
    note(true, `brand/iprig-logo-complet.png — ${info.width}×${info.height}, ${Math.round(info.size / 1024)} Ko`);
  }
}

console.log(`\n${done} fichier(s) écrit(s), ${missing} source(s) manquante(s).`);
if (missing > 0) process.exitCode = 1;
