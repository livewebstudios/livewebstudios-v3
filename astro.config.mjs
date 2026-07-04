// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://livewebstudios.com',
  // Flat .html files at root (e.g. /work.html) so relative asset paths
  // (images/logoRGB.png) resolve from every page per the LWS path rule.
  // Netlify serves these at clean /work URLs.
  build: { format: 'file' },
  integrations: [react(), sitemap()]
});
