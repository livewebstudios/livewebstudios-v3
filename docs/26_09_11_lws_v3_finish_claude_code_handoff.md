# LWS v3: Finish and Launch. Claude Code Handoff, 2026-09-11

Paste the **PROMPT** block (Section 2) into Claude Code from the repo root. Everything above it is the audit that produced it; Claude Code reads the whole file anyway, so leave it intact.

Repo (this Mac): `~/Desktop/local_files/website-clients/livewebstudios-v3`
Live-site source of truth: `~/Desktop/local_files/website-clients/livewebstudios/build`
Stack: Astro 7.0.6 + React islands + Decap CMS, `build: { format: 'file', inlineStylesheets: 'always' }`, output `dist/`, Netlify.

---

## 1. Audit findings (what is actually wrong, verified 2026-09-11)

### Git state, read this first
| | |
|---|---|
| Local branch | `merge/lens-refraction-to-main` at `5063c74` |
| `origin/main` | `eba5b11`, **10 commits behind local**, and this is what Netlify deploys |
| Local `main` | `c37ecfc`, stale (3 behind origin) |
| Working tree | clean |

Nothing built on the local branch is live on livewebstudios-v3.netlify.app until it is merged to `main` and pushed. Session 0 below handles that.

### Sub-menus (Jon's ask #1)
A sub-nav **already exists** in `src/components/Nav.astro` (lines ~219-241, `.subnav`, `data-subnav`) and renders on every `/live-band-web-studios*` and `/namesake*` page. It is not finished:

| Problem | Evidence |
|---|---|
| Sticks 13px too high | `.subnav { top: 72px }` but the main header measures **85px** at 1280 wide. The bar slides under the header on scroll. |
| Wrong items, wrong order (LBWS) | v3: Portfolio, Pricing, Personal Sites, Forms. Live: **Home, Pricing, Forms ▾, Personal Sites, Portfolio** |
| No Forms dropdown | Live has a hover/tap dropdown under Forms: Band Bio Form, Band Member Bio Form, Music Photo Form, Music Photo Instructions |
| No active state | Live marks the current page with `.active` |
| Namesake missing Overview | Live: Overview, How It Works, Start. v3: How It Works, Start (+ "Start Yours" ghost button, keep it) |
| Music Photo Instructions page missing | `/live-band-web-studios/forms/how-to-photograph-yourself-for-ai` is not built in v3 |

### Page parity, live vs v3
Every URL in the live `sitemap.xml` (66 URLs) resolves in v3 **except** these:

| Live URL | v3 status | Action |
|---|---|---|
| `/blog/lets-talk-about-styles` | missing (HTML post on live, not in content collection) | Convert to markdown post |
| `/blog/ai-didnt-replace-us` | missing (orphan HTML post, has canonical) | Convert to markdown post |
| `/blog/what-should-seo-cost` | missing (orphan HTML post) | Convert to markdown post |
| `/blog/why-we-left-wordpress` | missing (orphan HTML post) | Convert to markdown post |
| `/live-band-web-studios/forms/how-to-photograph-yourself-for-ai` | missing | Port page |
| `/forms/dumpster-diaper/` + `/forms/dumpster-diaper/thank-you` | missing (client questionnaire, noindex, Formspree `xbdenrdb`) | Port, noindex |
| `/forms/manual-therapy/` (+ 7 step images) | missing (client guide, noindex) | Port, noindex |
| `/hlink/` (logofaceFINAL.png, verifiedsecured.jpg) | missing. **The Decap admin login hotlinks these from livewebstudios.com/hlink/**; after DNS cutover the admin logo breaks unless they exist | Copy to `public/hlink/` |
| `/pricing/design-pricing`, `/hosting-pricing`, `/seo-pricing`, `/seo-marketing-pricing` | dropped on purpose (commit `c37ecfc` "drop main-site pricing") | 301 to the matching service page |
| `/portfolio` | 301 to `/work` already in `_redirects` | none |
| `robots.txt` | **missing from `public/`** | Port |
| `google3643688bb9fb1a45.html` | **missing from `public/`** (GSC verification) | Port |
| `sitemap.xml` | Astro emits `sitemap-index.xml` + `sitemap-0.xml`. Live robots and GSC point at `/sitemap.xml` | Rewrite `/sitemap.xml` to `/sitemap-index.xml` and update robots |
| `_redirects` | v3 has 2 rules. Live has ~150 (WordPress-era URLs from the Wayback crawl) | Merge the full live file, drop the `post.html?post=` rewrites |
| `netlify.toml` | missing (http to https force, `X-Robots-Tag` on `/forms/*`) | Port |
| JSON-LD | live: 61 pages carry schema. v3: only blog posts and FAQ | Add schema to every page (project rule) |

Blog content: the 21 markdown posts in `src/content/blog` are the **v3 versions** (edited 2026-08-27 to remove links to the dropped pricing pages). Keep them. Five of them still contain `https://livewebstudios.com/post.html?post=YYYY-MM-DD-slug` links that must become `/blog/slug`.

### IDs (all pulled from the live build, no guessing)
| What | Value | Where it goes |
|---|---|---|
| GA4 | `G-SW3VF5PBDT` | `src/layouts/Base.astro` (currently `G-XXXXXXXXXX`) |
| GSC | file verification `google3643688bb9fb1a45.html` | `public/` |
| Formspree, contact | `mbdqyrwg` | `src/pages/contact.astro` (already correct) |
| Formspree, Namesake start | `mlgkoqjl` | `namesake/start.astro` (already correct) |
| Formspree, Band Bio | `mbdbvoar` | already correct |
| Formspree, Band Member Bio | `mojbzzak` | already correct |
| Formspree, Music Photo | `mvznpvnq` | already correct |
| Formspree, Dumpster Diaper questionnaire | `xbdenrdb` | new `/forms/dumpster-diaper/` page |
| Mailchimp newsletter | `livewebstudios.us18.list-manage.com/subscribe/post?u=612de0c3a91b0bcc090cd2337&id=30b288c666&f_id=00d229e7f0`, tag `2524065` | `newsletter.astro` (already correct) |

Contact form difference: live posts `_next` to `/thank-you.html`; v3 uses `/contact?sent=1` with an on-page banner. Both work. The prompt below switches v3 to the live behavior (`/thank-you`) for parity since `thank-you.astro` already exists.

---

## 2. PROMPT (paste into Claude Code)

```
You are finishing the Live Web Studios v3 site (Astro 7, React islands, Decap CMS, Netlify). The design and layout are done. Your job is parity, plumbing, and launch readiness. Work autonomously. Do not stop to ask questions except for the two stop conditions at the bottom. Log every judgment call in DECISIONS.md at the repo root (create it) as one line each: date, decision, why.

## Context (carry forward)
- Repo root is the current directory. Source of truth for the current live site is ../livewebstudios/build (static HTML, same parent folder). Read from it freely. NEVER modify anything under ../livewebstudios.
- Astro config: build.format = 'file', inlineStylesheets = 'always'. Pages build to flat .html files; Netlify serves them clean.
- LWS PATH RULE: every href and src inside src/ MUST be relative, built with relPrefix(Astro.url.pathname) from src/lib/relPrefix.ts. Never write a root-relative "/images/..." or "/blog/..." link in a component or page. Frontmatter image paths are the one exception (Decap writes root-relative; templates strip the slash).
- Nav text is Title Case (Jon 2026-08-15). Main nav renders on every page; sub-brand bars sit under it, never replace it.
- One H1 per page. Semantic HTML5. Meta, OG, canonical on every page via Base.astro props.
- Writing rules for any copy you touch: no em dashes anywhere (use commas, periods, or colons). Never write "learn more", "click here", "submit", "don't hesitate to reach out", "schedule a free consultation". Button labels: "Send", "Let's talk.", "Reach out."
- Do not add dependencies. Do not add Tailwind, no inline styles, CSS custom properties only, JS only as progressive enhancement.
- Only make changes directly requested below. Do not refactor, rename, or restyle anything else. Do not add extra files, abstractions, or features.

## Session 0: Git
1. Run: git status, git branch -a -v, git log origin/main..HEAD --oneline. Confirm the working tree is clean and you are on merge/lens-refraction-to-main.
2. git checkout main && git pull origin main && git merge merge/lens-refraction-to-main. If the merge conflicts, resolve in favor of merge/lens-refraction-to-main for every conflicted file and log it in DECISIONS.md.
3. npm install && npm run build. The build MUST pass before continuing. Fix build errors only; do not touch content.
4. Commit: "Merge lens-refraction work into main". Do NOT push yet.
5. Do all remaining work on main. Commit after every session with the session name as the message.
✅ Output: branch, commit hash, page count from the build.

## Session 1: Sticky sub-menus (Live Band Web Studios + Namesake)
File: src/components/Nav.astro only (plus a token in src/styles/global.css if needed).

A. Sticky offset bug. .subnav uses top: 72px but the rendered header is 85px tall at desktop width, so the bar slides under the header on scroll. Fix: expose the header height as a CSS custom property --nav-h set on :root (measure it: it is the rendered height of header.nav at 1280px and at 375px; if the header height differs by breakpoint, set --nav-h per breakpoint in the same media queries the header uses). Set .subnav { top: var(--nav-h) }. Verify with a scripted check after build: scroll to 1500px and confirm subnav.getBoundingClientRect().top === header.getBoundingClientRect().height on /live-band-web-studios.html and /namesake.html. Do the same at mobile width (375px) where .subnav-in wraps: it must still sit flush under the header, never overlap it, never leave a gap.

B. Live Band Web Studios items. Replace bandLinks with this exact order and labels, matching ../livewebstudios/build/live-band-web-studios/index.html lines 37-56:
   1. Home  -> live-band-web-studios.html
   2. Pricing -> live-band-web-studios/pricing.html
   3. Forms -> live-band-web-studios/forms.html, with a dropdown containing, in order:
      - Band Bio Form -> live-band-web-studios/forms/band-bio-form.html
      - Band Member Bio Form -> live-band-web-studios/forms/band-member-bio-form.html
      - Music Photo Form -> live-band-web-studios/forms/music-photo-form.html
      - Music Photo Instructions -> live-band-web-studios/forms/how-to-photograph-yourself-for-ai.html (built in Session 2)
   4. Personal Sites -> live-band-web-studios/personal-sites.html
   5. Portfolio -> live-band-web-studios/portfolio.html
   Keep the LBWS logo (images/logo-live-band.png) as the brand link on the left.
   The Forms dropdown: hover-open on desktop via CSS, tap-open on touch via the same [data-dd] toggle pattern the main nav already uses (reuse that JS, do not write a second toggle system). "Forms" itself stays a real link. Dropdown panel uses the existing glass tokens (same background/blur/border as .mega). Keyboard: the caret button carries aria-expanded and aria-controls like the main nav toggles.

C. Namesake items. Replace namesakeLinks with: Overview -> namesake.html, How It Works -> namesake/how-it-works.html, Start -> namesake/start.html. Keep the "Start Yours" ghost CTA on the right.

D. Active state. Add class="is-active" (and aria-current="page") to the sub-nav link whose target matches the current page. Match on the built filename: compare Astro.url.pathname (with or without .html, with or without a trailing slash) to the link's href resolved from the site root. Home/Overview is active only on the section index page. A dropdown child being active also marks its parent "Forms" as is-active. Style is-active with the section accent (amber --band token for LBWS, brass --brass for Namesake) and a 2px bottom rule; do not invent new colors.

E. Mobile (max-width 900px). The sub-nav stays sticky under the header. Links wrap on one or two rows; the Forms dropdown becomes tap-to-open. Nothing horizontally scrolls the page.

Build. Run the scripted sticky check from A on both sections at 1280 and 375. Confirm every sub-nav href resolves to a real file in dist/ (grep the hrefs, stat the files).
✅ Output: the final bandLinks and namesakeLinks arrays, the measured header heights, and the check results.

## Session 2: Missing pages and content
A. Music Photo Instructions. Create src/pages/live-band-web-studios/forms/how-to-photograph-yourself-for-ai.astro. Port every word of the body content from ../livewebstudios/build/live-band-web-studios/forms/how-to-photograph-yourself-for-ai.html into the v3 page pattern (copy the structure of forms/music-photo-form.astro: Base, Nav, Footer, Glass, .theme-live-band wrapper, page-head with VideoBg). Title, meta description, H1 identical to live. Canonical https://livewebstudios.com/live-band-web-studios/forms/how-to-photograph-yourself-for-ai. Any image it references must be copied into public/images/ if not already present.

B. forms.astro. On src/pages/live-band-web-studios/forms.astro the three form cards exist; add a fourth card for Music Photo Instructions using the same card component and CTA pattern, and change the lede sentence "All three forms" to "All four forms" only if it is still accurate after your edit (it is: three forms plus one instructions page, so change it to "Every form here goes directly to Jon Wolf...").

C. Four HTML blog posts to markdown. Convert these live HTML posts into src/content/blog/*.md with Decap-compatible frontmatter (title, date, description, image, tags, draft: false). Body: clean markdown, headings preserved (H2/H3 only; the H1 is the title), links preserved, images preserved as root-relative /images/... paths (copy any missing images from ../livewebstudios/build/images into public/images at the same sub-path; the nine style-*.jpg files live under images/blog/styles/). Filenames are dated so the [slug].astro prefix-strip yields the exact live slug:
   - ../livewebstudios/build/blog/lets-talk-about-styles.html -> 2026-09-12-lets-talk-about-styles.md (date 2026-09-12 as the live blog index shows it, description from the live meta description)
   - ../livewebstudios/build/blog/ai-didnt-replace-us.html -> 2026-04-24-ai-didnt-replace-us.md
   - ../livewebstudios/build/blog/what-should-seo-cost.html -> 2026-04-17-what-should-seo-cost.md
   - ../livewebstudios/build/blog/why-we-left-wordpress.html -> 2026-04-10-why-we-left-wordpress.md
   For the last three the live HTML carries no publish date; the dates above are placeholders that sort them below the dated series. Log that in DECISIONS.md. Take title, description, and image from each file's <title>, meta description, and first content image. Any link inside them to /pricing/* becomes the matching /services/* page (seo-pricing -> services/seo, hosting-pricing -> services/hosting, design-pricing -> services/website-design, seo-marketing-pricing -> services/seo).

D. Fix internal links inside the existing 21 markdown posts. Replace every https://livewebstudios.com/post.html?post=YYYY-MM-DD-slug with /blog/slug (strip the date prefix). Also replace any remaining absolute https://livewebstudios.com/blog/... with /blog/.... Touch nothing else in those files.

E. Client pages (noindex). Create:
   - src/pages/forms/dumpster-diaper/index.astro and thank-you.astro, ported word for word from ../livewebstudios/build/forms/dumpster-diaper/. Formspree action https://formspree.io/f/xbdenrdb, _next https://livewebstudios.com/forms/dumpster-diaper/thank-you. Pass noindex to Base.
   - src/pages/forms/manual-therapy/index.astro ported from ../livewebstudios/build/forms/manual-therapy/index.html; copy its images/step-1.png ... step-7.png to public/forms/manual-therapy/images/. Pass noindex to Base.
   These pages get the main Nav and Footer, no sub-nav.

F. Hotlink assets. Copy ../livewebstudios/build/hlink/ (index.html, logofaceFINAL.png, verifiedsecured.jpg) to public/hlink/. The Decap login page loads its logo from livewebstudios.com/hlink/; this keeps it working after DNS cutover.

G. Contact form parity. In src/pages/contact.astro change _next to https://livewebstudios.com/thank-you (the existing thank-you.astro page). Remove the ?sent=1 banner logic only if nothing else depends on it; otherwise leave the banner code inert.

Build. Confirm dist/ now contains: blog/lets-talk-about-styles.html, blog/ai-didnt-replace-us.html, blog/what-should-seo-cost.html, blog/why-we-left-wordpress.html, live-band-web-studios/forms/how-to-photograph-yourself-for-ai.html, forms/dumpster-diaper/index.html, forms/dumpster-diaper/thank-you.html, forms/manual-therapy/index.html, hlink/logofaceFINAL.png.
✅ Output: list of files created, images copied, and the count of post.html links replaced.

## Session 3: IDs, robots, sitemap, redirects, 404
A. GA4. In src/layouts/Base.astro replace both occurrences of G-XXXXXXXXXX with G-SW3VF5PBDT. Remove the "placeholder" comment. Grep the whole src/ and public/ tree for G-XXXXXXXXXX afterwards; it must return nothing.

B. GSC. Copy ../livewebstudios/build/google3643688bb9fb1a45.html to public/google3643688bb9fb1a45.html unchanged.

C. robots.txt. Copy ../livewebstudios/build/robots.txt to public/robots.txt, then: remove the "Disallow: /post.html" block and its comment (no post.html in v3), keep the WordPress-path and /admin/ and /.netlify/ blocks, add "Disallow: /forms/" and "Disallow: /hlink/", set the date line to today, and keep "Sitemap: https://livewebstudios.com/sitemap.xml".

D. sitemap.xml. Keep @astrojs/sitemap. Extend its filter in astro.config.mjs to also exclude /forms/, /hlink/, /namesake/thank-you, and /admin. In public/_redirects add a 200 rewrite so the URL Google already has keeps working: "/sitemap.xml  /sitemap-index.xml  200". After build, confirm sitemap-0.xml lists every URL from ../livewebstudios/build/sitemap.xml except /portfolio (which 301s to /work) and the four /pricing/* pages, and that no thank-you, decap, forms, hlink, or 404 URL appears.

E. _redirects. Rebuild public/_redirects as: (1) the two existing v3 rules (/live-band -> /live-band-web-studios 301, /portfolio -> /work 301), (2) the sitemap rewrite from D, (3) these four: /pricing/design-pricing -> /services/website-design 301, /pricing/hosting-pricing -> /services/hosting 301, /pricing/seo-pricing -> /services/seo 301, /pricing/seo-marketing-pricing -> /services/seo 301 (add trailing-slash and .html variants of each), (4) every rule from ../livewebstudios/build/_redirects EXCEPT the "BLOG POST CLEAN URLs -> QUERY STRING REWRITES (200)" section (Astro builds real pages there now) and the legacy self-redirect lines at the bottom (/about -> /about etc., they loop). Keep the www-to-apex 301! rule and the /index.html rule. Keep the section comments. Netlify processes rules top to bottom; specific rules go above wildcard rules.

F. netlify.toml. Create it at the repo root by copying ../livewebstudios/build/netlify.toml (http->https force for apex and www, X-Robots-Tag noindex,nofollow header on /forms/*). Add a second [[headers]] block applying the same X-Robots-Tag to /hlink/*. Add a [build] block: command = "npm run build", publish = "dist".

G. 404. src/pages/404.astro exists and builds to dist/404.html, which Netlify serves automatically. Make its content match the live 404 (../livewebstudios/build/404.html): H1 "Page Not Found.", the "What you can do next" block with links to Contact, Work (live says portfolio; v3 canonical is work), and Blog, plus the main nav and footer. Keep it noindex. Verify by opening dist/404.html.

H. JSON-LD. Every page must carry schema (project rule; live has it on 61 pages). Add an optional jsonld prop to Base.astro that, when passed, renders a <script type="application/ld+json"> in <head>. Then: index.astro gets LocalBusiness exactly as live has it: name "Live Web Studios", url "https://livewebstudios.com", telephone "732-801-9611", email "jonwolf@livewebstudios.com", address {streetAddress "446 Saddle River Rd., Unit 2", addressLocality "Saddle Brook", addressRegion "NJ", postalCode "07663", addressCountry "US"}, areaServed "US", foundingDate "2004", plus founder {Person, name "Jon Wolf"}. Every other page gets WebPage with name, description, url (from the same props Base already receives, so implement it once in Base as the default when no jsonld prop is passed). The 13 services pages additionally get a Service node (name = page title, provider = Live Web Studios, areaServed US). Blog posts already have BlogPosting; faq already has FAQPage; do not duplicate those.

Build. Then run a parity script: for every <loc> in ../livewebstudios/build/sitemap.xml, compute the expected dist path (strip domain, /blog/ -> blog.html, trailing slash -> index.html, else add .html) and assert the file exists, EXCEPT /portfolio and /pricing/*. Print any misses. Zero misses required.
✅ Output: parity script result, the final _redirects line count, and the sitemap URL count.

## Session 4: QA and push
1. Run the four QA passes in order if the commands exist in this environment: /polish, /colorize, /layout, /animate. If a command does not exist, note it in DECISIONS.md and continue.
2. Kill-list scan: grep the built dist/ for em dashes (the character —) inside visible text of pages you created or edited in Sessions 1-3, and the phrases "learn more", "click here", "submit". Fix in source, not in dist. Pre-existing pages you did not touch: report the count, do not edit.
3. Single H1 check: for every dist/**/*.html, count <h1; every page must be exactly 1.
4. Link check: extract every href and src from dist/**/*.html that is relative or root-relative; resolve against the file's own location; assert the target exists in dist/. Zero broken.
5. Confirm G-SW3VF5PBDT appears in every dist/**/*.html and G-XXXXXXXXXX in none.
6. Update SESSION_SUMMARY.md with a dated block for this run and clear the resolved items from OPEN_QUESTIONS.md (2D-2 Formspree, 2E-6 GA4, 2D-4 services are resolved).
7. git add -A && git commit, then git push origin main. Netlify builds from main.
✅ Output: full summary of every file created or changed, the push result, and the open items list below with anything you could not resolve.

## Stop conditions (the only two)
- A file would be permanently deleted (git rm or rm of a tracked file). Show the list and wait.
- A credential or secret is required (Netlify token, Formspree account, GA property access). Say what is needed and wait.
Everything else: decide, log it in DECISIONS.md, keep going.
```

🎯 Target: Claude Code · 💡 Sequenced as five sessions inside one prompt with zero-stop autonomy, a hard scope lock (never touch `../livewebstudios`), verified IDs and paths baked in so nothing gets guessed, and a scripted parity check against the live sitemap as the pass/fail gate.

Run from the v3 repo root with `claude --dangerously-skip-permissions` per your usual. The build folder of the old site must sit at `../livewebstudios/build` relative to the repo (it does on this Mac).

---

## 3. After Claude Code finishes (Jon, Netlify dashboard + DNS)

1. Netlify: confirm the site deploys from `main`, build command `npm run build`, publish `dist`. Check the deploy log shows the merged commit.
2. Netlify Identity: enable (invite only), enable Git Gateway, invite jonwolf@livewebstudios.com. Log in at `/admin/` and confirm the blog collection loads the 25 posts.
3. Smoke test on the netlify.app URL: `/live-band-web-studios` (sub-nav sticks flush under the header, Forms dropdown opens, Home is active), `/namesake` (Overview active), `/blog/lets-talk-about-styles`, `/live-band-web-studios/forms/how-to-photograph-yourself-for-ai`, `/forms/dumpster-diaper/`, `/hlink/logofaceFINAL.png`, `/robots.txt`, `/sitemap.xml`, `/google3643688bb9fb1a45.html`, any junk URL for the 404.
4. Add `livewebstudios.com` as the custom domain on the v3 Netlify site (remove it from the old site first or Netlify refuses).
5. DNS: apex A record to `75.2.60.5`, `www` CNAME to `livewebstudios-v3.netlify.app`. Wait for the Netlify SSL certificate to provision.
6. GSC: nothing to re-verify (same file). Re-submit `https://livewebstudios.com/sitemap.xml`. Watch Coverage for 404s over the first two weeks; anything that shows up gets a `_redirects` line.
7. GA4: same property, same ID, no change. Confirm real-time hits after cutover.
8. Formspree: no change, same six forms. Send one test through the contact form and one through a Live Band form.

---

## 4. Decisions Claude Code will make on its own (override now if you disagree)

| Item | Default in the prompt |
|---|---|
| Publish dates for the three orphan HTML posts (ai-didnt-replace-us, what-should-seo-cost, why-we-left-wordpress) | 2026-04-24, 04-17, 04-10 (undated on live; sorts them to the bottom) |
| `lets-talk-about-styles` date | 2026-09-12 (what the live blog index shows; its JSON-LD said 2026-08-10) |
| Contact form success | `/thank-you` page (live behavior) instead of the `?sent=1` banner |
| `/pricing/*` | 301 to the matching service page (the pages were dropped in `c37ecfc`) |
| 404 "Browse the portfolio" link | points to `/work` |
| Merge conflicts in Session 0 | resolved in favor of the lens-refraction branch |

---

## 5. Not in this handoff (separate sessions)

- Voice pass on the ported copy (`/jonvoice`), if the four blog posts or the Music Photo Instructions page read stiff after conversion.
- `/work` real-client population (was placeholder-flagged in OPEN_QUESTIONS 2D-1; grep found no placeholders left, confirm visually).
- Upstream fix in `claude-global-config` so the Decap login template pins `decap-cms@3.1.2` instead of `^3.0.0`.
