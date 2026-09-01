/**
 * Captures d'écran de contrôle + audit automatique.
 *
 * Utilise Chrome déjà installé sur la machine via playwright-core :
 * aucun navigateur n'est téléchargé.
 *
 *   node scripts/qa-screenshots.mjs [baseUrl]
 *
 * Produit :
 *   screenshots/<page>-<viewport>.png       captures pleine page
 *   screenshots/report.json                  résultats des vérifications
 *
 * Vérifie automatiquement, sur chaque page et chaque format :
 *   — débordement horizontal ;
 *   — erreurs console ;
 *   — requêtes en échec ;
 *   — nombre de <h1> ;
 *   — hiérarchie des titres ;
 *   — images sans alt ;
 *   — liens externes sans rel="noopener" ;
 *   — cibles tactiles trop petites.
 */
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

const BASE = process.argv[2] ?? 'http://localhost:4321';
/** Sous-dossier optionnel : permet d'archiver une version (`v1`, `v2`…). */
const SUBDIR = process.argv[3] ?? '';

const outDir = resolve(here, '../screenshots', SUBDIR);
mkdirSync(outDir, { recursive: true });

const PAGES = [
  { name: 'accueil', path: '/' },
  { name: 'programme', path: '/programme' },
  { name: 'certificats', path: '/certificats' },
  { name: 'kevan-gafaiti', path: '/kevan-gafaiti' },
  { name: 'contact', path: '/contact' },
  { name: 'mentions-legales', path: '/mentions-legales' },
  { name: 'politique-confidentialite', path: '/politique-confidentialite' },
  { name: '404', path: '/cette-page-nexiste-pas' },
];

const VIEWPORTS = [
  { name: 'mobile-320', width: 320, height: 720 },
  // 360 et 430 ajoutés en V4.1 : le premier est la largeur Android la plus
  // répandue, le second celle des grands iPhone. Entre 320 et 390, ils
  // encadrent le point où les vignettes d'enseignants passent en colonne.
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  // Format le plus répandu sur ordinateur portable, et le plus révélateur :
  // c'est un écran LARGE mais PEU HAUT. Une composition éditoriale qui tient
  // en 1440 × 900 peut y perdre son premier écran.
  { name: 'laptop-1366', width: 1366, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'wide-1920', width: 1920, height: 1080 },
];

/** Formats capturés en image (les autres sont seulement audités). */
const SHOOT = new Set([
  'mobile-390',
  'tablet-768',
  'laptop-1366',
  'desktop-1440',
  'wide-1920',
]);

/** Pages dont le PREMIER ÉCRAN est capturé à part, sans défilement.
    C'est le contrôle qui compte pour le hero : ce que l'on voit sans agir. */
const FOLD = new Set(['accueil', 'programme', 'kevan-gafaiti']);

const CHROME =
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const report = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    locale: 'fr-FR',
  });

  for (const p of PAGES) {
    const page = await context.newPage();
    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text());
    });
    page.on('requestfailed', (r) =>
      failedRequests.push(`${r.url()} — ${r.failure()?.errorText}`),
    );
    page.on('response', (r) => {
      if (r.status() >= 400 && !p.path.includes('nexiste'))
        failedRequests.push(`${r.status()} ${r.url()}`);
    });

    await page.goto(BASE + p.path, { waitUntil: 'networkidle' });

    // Défilement progressif pour laisser l'IntersectionObserver se déclencher
    // section par section — exactement ce que fait un vrai visiteur.
    await page.evaluate(async () => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const stepSize = Math.round(window.innerHeight * 0.6);
      for (let y = 0; y < document.body.scrollHeight; y += stepSize) {
        window.scrollTo(0, y);
        await wait(140);
      }
      window.scrollTo(0, document.body.scrollHeight);
      await wait(600);
      window.scrollTo(0, 0);
      await wait(200);
    });

    // Combien d'éléments ne se sont pas révélés ? (0 attendu)
    const notRevealed = await page.evaluate(
      () => document.querySelectorAll('[data-motion]:not(.is-in)').length,
    );

    const audit = await page.evaluate(() => {
      const doc = document.documentElement;

      /* --- débordement horizontal : quels éléments dépassent ? --- */
      const overflowing = [];
      if (doc.scrollWidth > doc.clientWidth + 1) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0) continue;
          if (r.right > doc.clientWidth + 1 || r.left < -1) {
            overflowing.push(
              `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} → ${Math.round(r.left)}…${Math.round(r.right)}`,
            );
          }
          if (overflowing.length > 6) break;
        }
      }

      /* --- hiérarchie des titres --- */
      const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(
        (h) => ({ level: Number(h.tagName[1]), text: h.textContent.trim().slice(0, 60) }),
      );
      const jumps = [];
      let prev = 0;
      for (const h of headings) {
        if (prev && h.level > prev + 1)
          jumps.push(`h${prev} → h${h.level} : « ${h.text} »`);
        prev = h.level;
      }

      /* --- images sans alt --- */
      const noAlt = [...document.querySelectorAll('img')]
        .filter((i) => !i.hasAttribute('alt'))
        .map((i) => i.src);

      /* --- liens externes non sécurisés --- */
      const unsafeLinks = [...document.querySelectorAll('a[target="_blank"]')]
        .filter((a) => !(a.rel || '').includes('noopener'))
        .map((a) => a.href);

      /* --- cibles tactiles < 24 px (WCAG 2.2 AA, critère 2.5.8) ---
         Le critère prévoit une exception « inline » : un lien inséré dans une
         phrase, dont la taille est contrainte par l'interlignage du texte
         environnant, est conforme. On exclut donc ces liens-là. */
      const isInlineInSentence = (el) => {
        if (el.tagName !== 'A') return false;
        const parent = el.parentElement;
        if (!parent) return false;
        if (!/^(P|LI|DD|SPAN|EM|STRONG)$/.test(parent.tagName)) return false;
        // Le parent contient du texte autre que le lien lui-même.
        return parent.textContent.trim().length > el.textContent.trim().length;
      };

      const smallTargets = [];
      for (const el of document.querySelectorAll(
        'a[href], button, summary, input, select',
      )) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (isInlineInSentence(el)) continue;
        if (r.height < 24 || r.width < 24) {
          smallTargets.push(
            `${el.tagName.toLowerCase()} « ${(el.textContent || '').trim().slice(0, 32)} » ${Math.round(r.width)}×${Math.round(r.height)}`,
          );
        }
      }

      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        pageHeight: document.body.scrollHeight,
        overflowing,
        h1Count: document.querySelectorAll('h1').length,
        h1Text: document.querySelector('h1')?.textContent.trim().slice(0, 80) ?? null,
        headingJumps: jumps,
        noAlt,
        unsafeLinks,
        smallTargets,
        title: document.title,
        metaDescription:
          document.querySelector('meta[name="description"]')?.content ?? null,
        canonical:
          document.querySelector('link[rel="canonical"]')?.href ?? null,
      };
    });

    if (SHOOT.has(vp.name)) {
      await page.screenshot({
        path: resolve(outDir, `${p.name}-${vp.name}.png`),
        fullPage: true,
      });

      if (FOLD.has(p.name)) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(150);
        await page.screenshot({
          path: resolve(outDir, `fold-${p.name}-${vp.name}.png`),
          fullPage: false,
        });
      }
    }

    report.push({
      page: p.name,
      path: p.path,
      viewport: vp.name,
      hasOverflow: audit.scrollWidth > audit.clientWidth + 1,
      notRevealed,
      ...audit,
      // La page 404 renvoie volontairement un statut 404 : le navigateur
      // le signale dans la console, ce n'est pas une anomalie.
      consoleErrors: p.name === '404' ? [] : consoleErrors,
      failedRequests,
    });

    await page.close();
  }

  await context.close();
}

await browser.close();
writeFileSync(resolve(outDir, 'report.json'), JSON.stringify(report, null, 2));

/* ------------------------------------------------------------- Résumé --- */
const problems = [];
for (const r of report) {
  const tag = `${r.page} @ ${r.viewport}`;
  if (r.hasOverflow)
    problems.push(`DÉBORDEMENT  ${tag} (${r.scrollWidth} > ${r.clientWidth}) ${r.overflowing.join(' | ')}`);
  if (r.h1Count !== 1) problems.push(`H1 = ${r.h1Count}  ${tag}`);
  if (r.headingJumps.length) problems.push(`TITRES  ${tag} : ${r.headingJumps.join(' ; ')}`);
  if (r.noAlt.length) problems.push(`ALT MANQUANT  ${tag} : ${r.noAlt.join(', ')}`);
  if (r.unsafeLinks.length) problems.push(`REL NOOPENER  ${tag} : ${r.unsafeLinks.join(', ')}`);
  if (r.smallTargets.length) problems.push(`CIBLE < 24px  ${tag} : ${r.smallTargets.join(' | ')}`);
  if (r.notRevealed) problems.push(`NON RÉVÉLÉ  ${tag} : ${r.notRevealed} bloc(s) restés invisibles`);
  if (r.consoleErrors.length) problems.push(`CONSOLE  ${tag} : ${r.consoleErrors.join(' | ')}`);
  if (r.failedRequests.length) problems.push(`RÉSEAU  ${tag} : ${r.failedRequests.join(' | ')}`);
}

console.log(`\n${report.length} contrôles (${PAGES.length} pages × ${VIEWPORTS.length} formats)`);
if (problems.length === 0) {
  console.log('Aucun problème détecté.');
} else {
  console.log(`\n${problems.length} point(s) à examiner :\n`);
  for (const p of [...new Set(problems)]) console.log('  - ' + p);
}

console.log('\nHauteurs de page (desktop-1440) :');
for (const r of report.filter((r) => r.viewport === 'desktop-1440'))
  console.log(`  ${r.page.padEnd(26)} ${r.pageHeight} px`);
