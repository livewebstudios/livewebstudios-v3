// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://livewebstudios.com',
  // Flat .html files at root (e.g. /work.html) so relative asset paths
  // (images/logoRGB.png) resolve from every page per the LWS path rule.
  // Netlify serves these at clean /work URLs. inlineStylesheets 'always'
  // keeps CSS inside each page: no /_astro/*.css root-relative <link>s,
  // which would break the path rule on a host move.
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [react(), sitemap({
    // Keep noindex pages (form destinations, client guide) out of the sitemap
    // so it never contradicts their robots meta.
    filter: (page) =>
      !page.includes('/thank-you') &&
      !page.includes('/decap') &&
      !page.includes('/admin') &&
      !page.includes('/forms/') &&
      !page.includes('/hlink') &&
      !page.includes('/404'),
  })]
});
