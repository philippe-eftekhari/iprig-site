/**
 * Capture rapide d'une zone d'une page, pour itérer sur une composition.
 *
 *   node scripts/shot.mjs <chemin> <largeur> <hauteurDeCapture> <sortie.png> [scrollY]
 *
 * Exemple : node scripts/shot.mjs / 1440 1000 hero.png 0
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../screenshots/wip');
mkdirSync(outDir, { recursive: true });

const [path = '/', w = '1440', h = '1000', out = 'shot.png', scrollY = '0'] =
  process.argv.slice(2);

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
});

await page.goto('http://localhost:4321' + path, { waitUntil: 'networkidle' });

if (Number(scrollY) > 0) {
  // Défilement progressif pour laisser les révélations se déclencher.
  await page.evaluate(async (target) => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < target; y += step) {
      window.scrollTo(0, y);
      await wait(120);
    }
    window.scrollTo(0, target);
    await wait(700);
  }, Number(scrollY));
} else {
  await page.waitForTimeout(1800); // laisse la chorégraphie d'ouverture finir
}

await page.screenshot({ path: resolve(outDir, out) });
console.log(`${path} @ ${w}px, scrollY=${scrollY} → screenshots/wip/${out}`);
await browser.close();
