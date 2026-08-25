/**
 * Découpe une bande d'une capture pleine page pour l'inspecter en taille réelle.
 *   node scripts/crop.mjs <fichier.png> <top> <height> [sortie.png]
 */
import sharp from 'sharp';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const [file, top, height, out] = process.argv.slice(2);
const src = resolve(here, '../screenshots', file);
const dest = resolve(here, '../screenshots', out ?? '_crop.png');

const meta = await sharp(src).metadata();
const t = Math.max(0, Number(top));
const h = Math.min(Number(height), meta.height - t);

await sharp(src)
  .extract({ left: 0, top: t, width: meta.width, height: h })
  .toFile(dest);

console.log(`${file} [${t} → ${t + h}] sur ${meta.height} px → ${dest}`);
