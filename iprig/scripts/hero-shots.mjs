/**
 * Captures du HERO — premier viewport uniquement, sans défilement.
 *
 *   node scripts/hero-shots.mjs <sous-dossier> [baseUrl]
 *
 * Produit `screenshots/<sous-dossier>/hero-<format>.png` pour les cinq
 * formats de contrôle, plus un gros plan du masthead à chaque format
 * (`mark-<format>.png`) : c'est lui qui sert à juger l'échelle et le
 * clipping des glyphes.
 *
 * Écrit aussi `mesures.json` : taille de police du wordmark, position de
 * chaque bloc du hero, et position de la ligne de flottaison. Comparer des
 * chiffres est plus sûr que comparer des impressions.
 */
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const SUBDIR = process.argv[2];
const BASE = process.argv[3] ?? 'http://localhost:4321';

if (!SUBDIR) {
  console.error('Usage : node scripts/hero-shots.mjs <sous-dossier> [baseUrl]');
  process.exit(1);
}

const outDir = resolve(here, '../screenshots', SUBDIR);
mkdirSync(outDir, { recursive: true });

const VIEWPORTS = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'laptop-1366', width: 1366, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'macbook-1512', width: 1512, height: 982 },
  { name: 'wide-1920', width: 1920, height: 1080 },
];

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const mesures = [];

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    locale: 'fr-FR',
  });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  // Laisse la chorégraphie d'ouverture se terminer (~1,2 s).
  await page.waitForTimeout(2000);

  const m = await page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {
        top: Math.round(b.top + scrollY),
        bottom: Math.round(b.bottom + scrollY),
        left: Math.round(b.left),
        right: Math.round(b.right),
        w: Math.round(b.width),
        h: Math.round(b.height),
      };
    };
    const mark = document.querySelector('.hero__mark');
    return {
      vw: innerWidth,
      vh: innerHeight,
      fontSize: mark ? parseFloat(getComputedStyle(mark).fontSize) : null,
      mark: box('.hero__mark'),
      inner: box('.hero__mark .motion-inner'),
      rule: box('.hero__rule'),
      full: box('.hero__full'),
      tagline: box('.hero__tagline'),
      intro: box('.hero__intro'),
      actions: box('.hero__actions'),
      meta: box('.hero__meta'),
      docHeight: document.body.scrollHeight,
    };
  });
  mesures.push({ viewport: vp.name, ...m });

  await page.screenshot({ path: resolve(outDir, `hero-${vp.name}.png`) });

  // Gros plan du masthead : la boîte du wordmark, élargie de 40 px de chaque
  // côté, pour voir si un empattement touche le bord du masque.
  if (m.mark) {
    const pad = 40;
    await page.screenshot({
      path: resolve(outDir, `mark-${vp.name}.png`),
      clip: {
        x: Math.max(0, m.mark.left - pad),
        y: Math.max(0, m.mark.top - pad),
        width: Math.min(vp.width - Math.max(0, m.mark.left - pad), m.mark.w + pad * 2),
        height: Math.min(vp.height - Math.max(0, m.mark.top - pad), m.mark.h + pad * 2),
      },
    });
  }

  await page.close();
}

await browser.close();
writeFileSync(resolve(outDir, 'mesures.json'), JSON.stringify(mesures, null, 2));

console.log(`\nHero — ${SUBDIR}\n`);
console.log(
  'format'.padEnd(14) +
    'police'.padStart(8) +
    'wordmark'.padStart(11) +
    'largeur'.padStart(9) +
    'bas CTA'.padStart(9) +
    'flott.'.padStart(8) +
    '  CTA visible ?',
);
for (const m of mesures) {
  const visible = m.actions ? (m.actions.top < m.vh ? (m.actions.bottom <= m.vh ? 'entier' : 'partiel') : 'NON') : '—';
  console.log(
    m.viewport.padEnd(14) +
      `${m.fontSize?.toFixed(1)}px`.padStart(8) +
      `${m.mark?.h}px`.padStart(11) +
      `${m.mark?.w}px`.padStart(9) +
      `${m.actions?.bottom}`.padStart(9) +
      `${m.vh}`.padStart(8) +
      '  ' + visible,
  );
}
