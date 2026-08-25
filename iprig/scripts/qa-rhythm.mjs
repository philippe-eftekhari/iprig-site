/**
 * Mesure la hauteur de chaque section de la page d'accueil.
 * Sert à décider où gagner de la longueur sans retirer d'information.
 *
 *   node scripts/qa-rhythm.mjs [largeur]
 */
import { chromium } from 'playwright-core';

const W = Number(process.argv[2] ?? 390);
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: W, height: 900 } });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });

const rows = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('main > section, main > *')) {
    const r = el.getBoundingClientRect();
    if (r.height < 5) continue;
    const cs = getComputedStyle(el);
    out.push({
      nom: (el.className || el.tagName).toString().split(' ')[0] || el.tagName,
      h: Math.round(r.height),
      padT: cs.paddingBlockStart,
      padB: cs.paddingBlockEnd,
    });
  }
  return { rows: out, total: document.body.scrollHeight };
});

console.log(`Largeur ${W} px — total ${rows.total} px\n`);
for (const r of rows.rows) {
  const pct = ((r.h / rows.total) * 100).toFixed(1);
  console.log(
    `  ${r.nom.padEnd(14)} ${String(r.h).padStart(5)} px  ${pct.padStart(5)} %   padding ${r.padT} / ${r.padB}`,
  );
}

await browser.close();
