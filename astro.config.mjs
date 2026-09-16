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
  integrations: [stripHtmlComments(), react(), sitemap({
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

/**
 * Source comments are for whoever edits these files, not for whoever views the
 * page. The launch audit (2026-09-16) found 103 em dashes shipped inside HTML
 * comments across 27 pages, several of them build notes narrating edits
 * ("<!-- em-dash: ... -> comma -->"). Zero were visible copy, so no rule was
 * broken, but developer commentary has no reason to reach a client's browser.
 *
 * Strips only HTML comments, and only from the built output:
 *   - conditional comments (<!--[if ...]>) are preserved, since removing one
 *     changes behaviour rather than just stripping a note
 *   - comments inside <script> and <style> are left alone, because "<!--" in
 *     JS or CSS is code, not markup, and cutting it would break the file
 */
function stripHtmlComments() {
  return {
    name: 'lws-strip-html-comments',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const { readdirSync, statSync, readFileSync, writeFileSync } = await import('node:fs');
        const { join } = await import('node:path');
        const files = [];
        (function walk(d) {
          for (const e of readdirSync(d)) {
            const p = join(d, e);
            if (statSync(p).isDirectory()) walk(p);
            else if (e.endsWith('.html')) files.push(p);
          }
        })(dir.pathname);

        let removed = 0;
        for (const f of files) {
          const html = readFileSync(f, 'utf8');
          // Protect script/style bodies, strip comments, then restore them.
          const parked = [];
          let out = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, (m) => {
            parked.push(m);
            return `\u0000LWS${parked.length - 1}\u0000`;
          });
          out = out.replace(/<!--[\s\S]*?-->/g, (m) => {
            if (/^<!--\[if/i.test(m)) return m; // conditional comment
            removed++;
            return '';
          });
          out = out.replace(/\u0000LWS(\d+)\u0000/g, (_, i) => parked[Number(i)]);
          if (out !== html) writeFileSync(f, out);
        }
        logger.info(`stripped ${removed} HTML comment(s) from ${files.length} page(s)`);
      },
    },
  };
}
