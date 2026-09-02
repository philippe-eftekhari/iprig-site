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
 * Format des vignettes d'enseignant, imposé par `TeacherCard.astro`
 * (`aspect-ratio: 4 / 5`). Écrit ici une seule fois : le master, la fenêtre de
 * recadrage et la vignette affichée ne peuvent donc pas diverger.
 */
const RATIO_VIGNETTE_W = 4;
const RATIO_VIGNETTE_H = 5;

/**
 * Sélection éditoriale. Chaque entrée dit POURQUOI la photo est retenue :
 * c'est ce commentaire qui évite qu'une photo se retrouve un jour au mauvais
 * endroit. Les photos non listées ici ne sont pas intégrées au site.
 */
const PHOTOS = [
  {
    from: 'Kevan-01.JPG',
    to: 'kevan/hero-enseignement.jpg',
    /* V4.2 — CETTE PHOTOGRAPHIE A REMPLACÉ `hero-academie.jpg` (Kevan-17).
       Le client a écarté l'image assise du plateau de l'Académie pour le
       premier écran : il la trouvait statique. Celle-ci le montre debout, en
       train de parler, mains ouvertes, devant un tableau — la transmission
       est lisible dans l'image même, sans légende.

       Recadrage : la source est en 2/3, le cadre du hero en 3/4. On aligne la
       fenêtre sur le BAS de l'image, ce qui retire le vide de tableau blanc
       au-dessus de la tête. Le sujet remonte donc dans le cadre, et la ligne
       de flottaison d'un portable 1366 × 768 le coupe sous les mains plutôt
       qu'au niveau du visage. Le master sort déjà au format du cadre bureau :
       aucun rognage, aucun décalage de mise en page à l'affichage. */
    crop: { aspect: 3 / 4, anchor: 'bottom' },
    why: "Hero. Debout, costume noir et chemise bleue, en situation de prise de parole : le geste d'enseignement est immédiatement lisible.",
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
    from: 'Kevan-10.jpg',
    to: 'kevan/evenement-institutionnel.jpg',
    /* V4.2 — REMPLACE `enseignement.jpg` (Kevan-01) à l'aperçu du programme,
       puisque cette dernière est montée au hero et ne doit pas être montrée
       deux fois sur la même page.

       Choix guidé par le rythme demandé : hero (Kevan) → CONTEXTE → fondateur
       (Kevan). Trois portraits d'affilée aplatissaient la page ; une salle
       d'étudiants entre les deux la raconte. Aucun visage n'est au premier
       plan, aucune marque tierce n'est lisible.

       La fenêtre 4/5 dispose de 6 % de jeu vertical seulement : on la centre. */
    crop: { aspect: 4 / 5 },
    /* C'est la photographie la plus coûteuse du site : parquet, lustre à
       pampilles, chaises à motif — du détail haute fréquence partout, que le
       WebP ne sait pas compresser. Mesuré, à largeur d'affichage égale :

         Kevan-01 (mur blanc)  1080w  22 Ko · 1440w  32 Ko
         Kevan-10, q82 / 2200  1080w 174 Ko · 1440w 273 Ko
         Kevan-10, q78 / 1600  1080w ~160 Ko · 1440w ~220 Ko

       Descendre la qualité du master ne rend presque rien (le poids vient de
       la scène, pas de l'encodage) ; borner le côté long à 1600 px rend 20 %
       sur la plus grande variante, sans rien perdre à l'affichage : la plus
       large que le site demande fait 1440 px. On prend les 20 %, on assume le
       reste. L'image est chargée en `lazy`, sous la ligne de flottaison : le
       poids initial de la page d'accueil, lui, ne bouge pas. */
    maxSide: 1600,
    quality: 78,
    why: "Aperçu du programme sur l'accueil. Étudiants réunis dans un salon d'apparat lors d'un événement institutionnel : la salle, le public et le cadre, plutôt qu'un portrait de plus.",
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
     parmi les autres et sa vignette doit se composer comme les leurs.

     V4.2 — CADRAGE DÉCLARÉ, et non plus laissé à l'automatisme.

     La photographie source fait 1080 × 1616 après rotation EXIF, soit du 2:3,
     alors que la vignette est en 4:5. Il faut donc retirer de la hauteur, et
     la question est seulement : où ? L'automatisme la prenait en bas, ce qui
     laissait un pan de mur au-dessus de la tête et coupait le sujet à hauteur
     de poitrine.

     `anchor: 'bottom'` garde le bas de l'image jusqu'au tout dernier pixel —
     c'est là que se trouvent les mains, le poignet et la montre. Attention :
     il n'y a rien en dessous. La photographie s'arrête aux mains ; aucun
     réglage ne fera apparaître davantage du corps.

     `widthFrac` resserre la fenêtre en largeur, ce qui la raccourcit
     d'autant : ancrée en bas, elle retire alors davantage de mur en haut.
     Le réglage est CALCULÉ, pas tâtonné — relevé sur la source : le haut des
     cheveux est à y = 500, la main à y ≈ 1550, l'image finit à 1616.

         0,92  ->  haut à y = 373, soit 127 px au-dessus du crâne (11 %)
         0,89  ->  haut à y = 415, soit  85 px (7 %)
         0,87  ->  haut à y = 441, soit  59 px (5 %)   <- retenu
         0,80  ->  haut à y = 536 : le crâne est ROGNÉ

     À 0,87 le mur au-dessus de la tête ne pèse plus rien et la main, le
     poignet et la montre occupent le bas du cadre. `centerX` compense le
     décalage latéral que ce resserrement induit.

     Aucun autre paramètre ne change : même source, même format, même
     compression, et l'original n'est pas touché. */
  {
    from: 'Kevan-04.JPG',
    to: 'teachers/kevan-gafaiti.jpg',
    crop: { widthFrac: 0.87, anchor: 'bottom', centerX: 0.50 },
  },
  { from: 'alain-coppolani.jpeg', to: 'teachers/alain-coppolani.jpg' },
  { from: 'albert-kandemir.jpeg', to: 'teachers/albert-kandemir.jpg' },
  {
    from: 'Valentin-Blondiau.jpg',
    to: 'teachers/valentin-blondiau.jpg',
    /* Portrait fourni par le client le 01/09/2026. Il est carré et ne fait
       que 400 × 400 : c'est la définition la plus faible du lot. On sort donc
       un master de 640 × 800 — exactement la plus grande largeur que
       `TeacherCard` demande (`widths={[320, 480, 640]}`) — plutôt que le
       1600 × 2000 des autres. Agrandir au-delà de ce qui sera affiché ne
       fabrique aucun détail : cela ne produirait qu'un fichier lourd et flou.

       TODO CLIENT : une source plus définie (1200 × 1500 ou davantage) rendrait
       la vignette aussi nette que les quatre autres. Une seule ligne à changer
       ici le jour où elle arrive. */
    size: { width: 640, height: 800 },
  },
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
    /* ⚠ `.metadata()` décrit le fichier TEL QU'IL EST ÉCRIT, pas tel qu'il
       s'affiche : une photo prise à la verticale s'y déclare 1616 × 1080 alors
       que le lecteur la fait pivoter à 1080 × 1616. `.rotate()` applique cette
       rotation en amont de `.extract()` — les deux doivent donc parler des
       mêmes dimensions, sans quoi la fenêtre de recadrage tombe à côté du
       sujet, voire hors de l'image et sharp échoue.

       On corrige la mesure plutôt que de décoder l'image une seconde fois :
       passer par `toBuffer()` ré-encoderait le JPEG avant le redimensionnement
       et ajouterait une génération de pertes à toutes les photographies, y
       compris celles qu'on ne touche pas. */
    const meta = await sharp(from).metadata();
    const pivote = (meta.orientation ?? 1) >= 5;
    const W = (pivote ? meta.height : meta.width) ?? 0;
    const H = (pivote ? meta.width : meta.height) ?? 0;
    const aspect = p.crop.aspect ?? W / H;

    /* La plus grande fenêtre du format demandé qui tienne dans l'image —
       ou, si `top` est déclaré, tout ce qui se trouve sous cette ligne. */
    let height = H - Math.round(H * (p.crop.top ?? 0));
    let width = Math.round(height * aspect);
    if (width > W) {
      width = W;
      height = Math.round(width / aspect);
    }

    /* Placement vertical. `top` fixe la ligne haute explicitement ; `anchor`
       dit simplement de quel côté prendre le jeu restant. « bottom » retire
       donc le haut de l'image — c'est ainsi qu'on remonte un sujet dans son
       cadre sans toucher au fichier d'origine. */
    const jeu = H - height;
    const ANCRES = { top: 0, center: 0.5, bottom: 1 };
    const top =
      p.crop.top !== undefined
        ? Math.min(jeu, Math.round(H * p.crop.top))
        : Math.round(jeu * (ANCRES[p.crop.anchor ?? 'center'] ?? 0.5));

    /* `centerX` déplace la fenêtre horizontalement, en fraction de la largeur
       d'origine. Par défaut elle est centrée ; on la décale quand le sujet ne
       l'est pas. La fenêtre est bornée pour ne jamais dépasser l'image. */
    const cx = (p.crop.centerX ?? 0.5) * W;
    const left = Math.max(0, Math.min(W - width, Math.round(cx - width / 2)));
    pipe = pipe.extract({ left, top, width, height });
  }

  /* `maxSide` et `quality` ne sont renseignés que pour une photographie qui
     coûte anormalement cher à encoder. Le défaut convient partout ailleurs. */
  const cote = p.maxSide ?? MAX;
  const info = await pipe
    .resize({ width: cote, height: cote, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: p.quality ?? QUALITY, mozjpeg: true })
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

  let pipe = base(from);

  /* Cadrage 4:5. Par défaut `attention` place la fenêtre sur la zone la plus
     saillante de l'image, ce qui suffit pour un portrait d'identité. Une
     entrée peut aussi DÉCLARER sa fenêtre, quand l'automatisme cadre mal :
     on l'extrait alors avant le redimensionnement, exactement comme pour les
     photographies plus haut. Aucun traitement colorimétrique dans les deux cas.

     `size` n'est renseigné que pour une source trop petite pour le master
     habituel : mieux vaut un fichier net à la taille réellement affichée
     qu'un fichier agrandi qui n'ajoute aucun détail. */
  if (t.crop) {
    /* Même précaution que pour les photographies : `.metadata()` décrit le
       fichier tel qu'il est écrit, `.rotate()` ce qui sera affiché. */
    const meta = await sharp(from).metadata();
    const pivote = (meta.orientation ?? 1) >= 5;
    const W = (pivote ? meta.height : meta.width) ?? 0;
    const H = (pivote ? meta.width : meta.height) ?? 0;

    /* La fenêtre est toujours au format de la vignette. La resserrer en
       largeur la raccourcit d'autant : c'est le seul moyen de retirer plus de
       hauteur d'un côté sans en rendre de l'autre. */
    let width = Math.round(W * (t.crop.widthFrac ?? 1));
    let height = Math.round(width * (RATIO_VIGNETTE_H / RATIO_VIGNETTE_W));
    if (height > H) {
      height = H;
      width = Math.round(height * (RATIO_VIGNETTE_W / RATIO_VIGNETTE_H));
    }

    const ANCRES = { top: 0, center: 0.5, bottom: 1 };
    const top = Math.round((H - height) * (ANCRES[t.crop.anchor ?? 'center'] ?? 0.5));
    const cx = (t.crop.centerX ?? 0.5) * W;
    const left = Math.max(0, Math.min(W - width, Math.round(cx - width / 2)));
    pipe = pipe.extract({ left, top, width, height });
  }

  const { width: W, height: H } = t.size ?? {
    width: RATIO_VIGNETTE_W * 400,
    height: RATIO_VIGNETTE_H * 400,
  };
  const info = await pipe
    .resize({
      width: W,
      height: H,
      fit: 'cover',
      position: t.position ?? sharp.strategy.attention,
    })
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
