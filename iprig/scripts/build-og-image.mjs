/**
 * Génère l'image de partage social `public/og-image.png` (1200 × 630).
 *
 * Pourquoi un script plutôt qu'un simple SVG : Facebook, LinkedIn et X ne
 * savent pas afficher un SVG comme image de partage. Il faut un PNG.
 *
 * À relancer uniquement si l'identité change :
 *     node scripts/build-og-image.mjs
 *
 * TODO CLIENT : remplacer par un visuel définitif lorsque le logo et les
 * photos seront disponibles. Déposer alors le fichier en `public/og-image.png`
 * (1200 × 630) — aucune autre modification n'est nécessaire.
 */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../public/og-image.png');

const NAVY = '#071d30';
const PAPER = '#f6f3ed';
const BRASS = '#d8b67c';
const FOREST = '#7fb09c';
const LINE = '#9fb6c6';

/** Les polices du site ne sont pas installées sur la machine de build :
 *  on utilise leurs équivalents système, déjà présents dans la pile CSS. */
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Segoe UI', Helvetica, Arial, sans-serif";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M30 0H0v30" fill="none" stroke="${LINE}" stroke-width="0.6" opacity="0.13"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="${NAVY}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <!-- Motif de méridiens, à droite -->
  <g fill="none" stroke="${LINE}" stroke-width="1" opacity="0.3" transform="translate(985, 315)">
    <circle r="120"/><circle r="190"/><circle r="260"/>
    <ellipse rx="70" ry="260"/><ellipse rx="150" ry="260"/>
    <path d="M-260 0H260"/>
  </g>
  <g transform="translate(985, 315)">
    <circle r="5" fill="${BRASS}"/>
    <path d="M0 0 L118 -74" stroke="${BRASS}" stroke-width="1.6"/>
    <rect x="112" y="-80" width="12" height="12" fill="${BRASS}"/>
  </g>

  <!-- Filet supérieur -->
  <rect x="80" y="78" width="1040" height="1" fill="${LINE}" opacity="0.28"/>

  <!-- Marque -->
  <g transform="translate(80, 132)">
    <rect x="0" y="-14" width="14" height="14" fill="${BRASS}" transform="rotate(45 7 -7)"/>
    <text x="32" y="0" font-family="${SANS}" font-size="19" font-weight="600"
          letter-spacing="3.4" fill="${BRASS}">INSTITUT DE PRÉPARATION</text>
  </g>

  <!-- Wordmark -->
  <text x="76" y="330" font-family="${SERIF}" font-size="176" font-weight="500"
        letter-spacing="4" fill="${PAPER}">IPRIG</text>

  <!-- Dénomination -->
  <text x="80" y="392" font-family="${SERIF}" font-size="31" fill="${LINE}">
    Relations internationales et géopolitique
  </text>

  <!-- Filet -->
  <rect x="80" y="436" width="470" height="1" fill="${LINE}" opacity="0.4"/>

  <!-- Promesse -->
  <text x="80" y="492" font-family="${SERIF}" font-size="34" font-style="italic" fill="${FOREST}">
    Votre partenaire pour votre carrière
  </text>
  <text x="80" y="534" font-family="${SERIF}" font-size="34" font-style="italic" fill="${FOREST}">
    en géopolitique.
  </text>

  <!-- Bandeau bas -->
  <rect x="80" y="566" width="1040" height="1" fill="${LINE}" opacity="0.28"/>
  <text x="80" y="600" font-family="${SANS}" font-size="20" font-weight="600"
        letter-spacing="1.6" fill="${PAPER}">29 € / mois</text>
  <text x="222" y="600" font-family="${SANS}" font-size="20"
        letter-spacing="1.6" fill="${LINE}">Sans engagement</text>
  <text x="1120" y="600" font-family="${SANS}" font-size="20"
        letter-spacing="1.6" fill="${LINE}" text-anchor="end">iprig.fr</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
writeFileSync(out, png);
console.log(`og-image.png généré — ${(png.length / 1024).toFixed(1)} Ko → ${out}`);
