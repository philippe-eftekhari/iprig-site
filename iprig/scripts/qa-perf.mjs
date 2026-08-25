/**
 * Mesure du poids réel et des temps de chargement.
 *
 *   node scripts/qa-perf.mjs [baseUrl]
 *
 * À lancer sur le serveur de production (`npm run preview`), jamais en dev :
 * le mode développement n'est ni minifié ni représentatif.
 */
import { chromium } from 'playwright-core';

const BASE = process.argv[2] ?? 'http://localhost:4321';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const PAGES = ['/', '/programme', '/kevan-gafaiti', '/contact'];
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

for (const vp of VIEWPORTS) {
  console.log(`\n=== ${vp.name} (${vp.width} × ${vp.height}) ===`);

  for (const path of PAGES) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    const requests = [];
    page.on('response', async (r) => {
      try {
        const body = await r.body();
        requests.push({ type: r.request().resourceType(), size: body.length });
      } catch {
        /* réponse sans corps */
      }
    });

    await page.goto(BASE + path, { waitUntil: 'load' });

    const perf = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      return {
        dcl: Math.round(nav.domContentLoadedEventEnd),
        load: Math.round(nav.loadEventEnd),
        fcp: fcp ? Math.round(fcp.startTime) : null,
      };
    });

    const total = requests.reduce((a, r) => a + r.size, 0);
    const byType = {};
    for (const r of requests) byType[r.type] = (byType[r.type] ?? 0) + r.size;
    const js = byType.script ?? 0;

    console.log(
      `  ${path.padEnd(16)} ${String(requests.length).padStart(2)} req · ` +
        `${(total / 1024).toFixed(1).padStart(6)} Ko · ` +
        `JS ${(js / 1024).toFixed(1)} Ko · ` +
        `FCP ${perf.fcp} ms · load ${perf.load} ms`,
    );
    console.log(
      '                   ' +
        Object.entries(byType)
          .sort((a, b) => b[1] - a[1])
          .map(([k, v]) => `${k} ${(v / 1024).toFixed(1)}`)
          .join(' · '),
    );

    await page.close();
  }
}

await browser.close();
