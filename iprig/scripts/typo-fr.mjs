/**
 * ============================================================================
 *  ESPACES INSÉCABLES FRANÇAISES — normalisation des fichiers de contenu
 * ============================================================================
 *  Une espace ordinaire devant `: ; ? !` ou `»` est sécable : la ponctuation
 *  peut se retrouver seule en début de ligne, et « 29 € » peut se couper entre
 *  le nombre et le symbole. Ce script remplace ces espaces par les insécables
 *  réglementaires :
 *
 *      U+00A0  insécable       avant `:` et avant une unité (« 29 € »)
 *      U+202F  fine insécable  avant `;` `?` `!` `»` et après `«`
 *
 *  Il n’agit QUE dans les chaînes de caractères : le code et les commentaires
 *  sont laissés intacts. Un automate à états suit les guillemets, les gabarits
 *  et les deux formes de commentaire — c’est suffisant pour des fichiers de
 *  données, qui ne contiennent ni littéral d’expression régulière ni JSX.
 *
 *      node scripts/typo-fr.mjs [--check] <fichier> [fichier…]
 *
 *  `--check` n’écrit rien et sort en erreur si une correction est nécessaire :
 *  c’est la forme à utiliser dans un contrôle qualité.
 *
 *  La règle est aussi gardée à l’exécution par `qa-functional.mjs`, qui
 *  inspecte le texte visible des pages construites.
 * ============================================================================
 */
import { readFileSync, writeFileSync } from 'node:fs';

const NBSP = ' ';
const FINE = ' ';

/** Remplacements appliqués au contenu d’une chaîne. */
const fixSegment = (s) =>
  s
    // Espace ordinaire avant une ponctuation haute ou une unité.
    .replace(/ +([;?!»€])/g, (_, p) => (p === '€' ? NBSP : FINE) + p)
    // Avant `:` — mais pas dans une URL (`https://`), déjà sans espace.
    .replace(/ +:/g, NBSP + ':')
    // Après un guillemet ouvrant.
    .replace(/« +/g, '«' + FINE);

/**
 * Parcourt le fichier caractère par caractère et n’applique `fixSegment`
 * qu’aux littéraux de chaîne.
 */
function normalise(src) {
  let out = '';
  let i = 0;
  const n = src.length;

  while (i < n) {
    const c = src[i];
    const next = src[i + 1];

    // Commentaire de ligne
    if (c === '/' && next === '/') {
      const end = src.indexOf('\n', i);
      const stop = end === -1 ? n : end;
      out += src.slice(i, stop);
      i = stop;
      continue;
    }

    // Commentaire de bloc
    if (c === '/' && next === '*') {
      const end = src.indexOf('*/', i + 2);
      const stop = end === -1 ? n : end + 2;
      out += src.slice(i, stop);
      i = stop;
      continue;
    }

    // Chaîne : simple, double ou gabarit
    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      let j = i + 1;
      let body = '';
      while (j < n) {
        if (src[j] === '\\') {
          body += src.slice(j, j + 2);
          j += 2;
          continue;
        }
        if (src[j] === quote) break;
        // Un gabarit peut contenir du code : on ne touche pas aux interpolations.
        if (quote === '`' && src[j] === '$' && src[j + 1] === '{') {
          let depth = 1;
          let k = j + 2;
          while (k < n && depth > 0) {
            if (src[k] === '{') depth += 1;
            else if (src[k] === '}') depth -= 1;
            k += 1;
          }
          body += src.slice(j, k);
          j = k;
          continue;
        }
        body += src[j];
        j += 1;
      }
      // Les interpolations sont recollées telles quelles.
      out +=
        quote +
        body
          .split(/(\$\{[\s\S]*?\})/)
          .map((part, idx) => (idx % 2 === 1 ? part : fixSegment(part)))
          .join('') +
        (j < n ? quote : '');
      i = j + 1;
      continue;
    }

    out += c;
    i += 1;
  }

  return out;
}

const args = process.argv.slice(2);
const check = args.includes('--check');
const files = args.filter((a) => a !== '--check');

if (files.length === 0) {
  console.error('usage : node scripts/typo-fr.mjs [--check] <fichier…>');
  process.exit(2);
}

let changed = 0;
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const out = normalise(src);
  if (out === src) continue;
  changed += 1;
  if (check) {
    console.log(`  à corriger : ${file}`);
  } else {
    writeFileSync(file, out, 'utf8');
    console.log(`  corrigé    : ${file}`);
  }
}

if (changed === 0) console.log('  typographie française : rien à corriger');
if (check && changed > 0) process.exitCode = 1;
