/**
 * Capture l'en-tête sticky à différentes positions de défilement,
 * pour vérifier son rendu au-dessus des sections claires et sombres,
 * ainsi que la barre de progression de lecture.
 *
 *   node scripts/qa-header.mjs [baseUrl]
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../screenshots');
mkdirSync(outDir, { recursive: true });

const BASE = process.argv[2] ?? 'http://localhost:4321';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

for (const vp of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  // Positions choisies pour tomber sur une section claire puis une sombre.
  const positions = [
    { name: 'haut', y: 0 },
    { name: 'clair', y: 1600 },
    { name: 'sombre', y: 3200 },
    { name: 'bas', y: 9000 },
  ];

  for (const pos of positions) {
    await page.evaluate((y) => window.scrollTo(0, y), pos.y);
    await page.waitForTimeout(500);
    await page.screenshot({
      path: resolve(outDir, `header-${vp.name}-${pos.name}.png`),
      clip: { x: 0, y: 0, width: vp.width, height: 120 },
    });
  }

  // État de la barre de progression en bas de page
  const progress = await page.evaluate(() => {
    const bar = document.querySelector('.header__progress-bar');
    if (!bar) return null;
    const t = getComputedStyle(bar).transform;
    return { transform: t, width: bar.getBoundingClientRect().width };
  });
  console.log(`${vp.name} — barre de progression en bas de page :`, JSON.stringify(progress));

  await page.close();
}

// Le tiroir mobile ouvert
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.locator('#menu-toggle').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: resolve(outDir, 'drawer-mobile.png') });
  console.log('tiroir mobile capturé');
  await page.close();
}

await browser.close();
