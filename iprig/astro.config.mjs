// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL canonique du site. Sert au sitemap, aux balises <link rel="canonical">
// et aux metadonnees Open Graph (URL absolues obligatoires).
const SITE = 'https://iprig.fr';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // Genere /programme.html plutot que /programme/index.html :
    // plus simple a servir sur un hebergement mutualise Apache/LiteSpeed.
    format: 'file',
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/mentions-legales') &&
        !page.includes('/politique-confidentialite'),
    }),
  ],
  vite: {
    build: {
      // Les polices sont deja dans public/ ; on garde les assets versionnes.
      assetsInlineLimit: 1024,
    },
  },
});
