# Live AI Studios: The /ai/ Sub-Brand. Blueprint + Claude Code Handoff, 2026-09-25

Paste the **PROMPT** block (Section 8) into Claude Code from the v3 repo root. Sections 1 to 7 are the
blueprint that produced it. Claude Code reads the whole file, so leave it intact.

Repo (this Mac): `~/Desktop/local_files/website-clients/livewebstudios-v3`
Stack: Astro 7 + React islands + Decap CMS, `build: { format: 'file', inlineStylesheets: 'always' }`, output `dist/`, Netlify.
Section root: `https://livewebstudios.com/ai/`
Future domain: `liveaistudios.com` 301s into `/ai/` (Section 9). Architecture is extraction-ready: if the brand earns its own domain later, `/ai/*` maps 1:1 to `liveaistudios.com/*` with 301s and nothing is lost.
Run: `claude --dangerously-skip-permissions` from the repo root.

---

## 1. What this is

Live AI Studios is the fourth brand in the family: livewebstudios.com, livewebphotos.com,
livebandwebstudios.com, and now `/ai/`. It sells the thing the other three already prove: an AI-staffed
studio. Design, development, content, automation, and media are functions staffed by AI and directed by
a human principal. The studio's own structure is the product demo.

**Tagline, locked, verbatim, in the hero:**

> We run our business on AI. Want proof? You're looking at it.

**Positioning rules (hard constraints, enforced by a scan in Session 6):**

1. **"We", always.** Never "one-man shop", never "solo", never "just me", never a headcount. Never
   imply human employees either. The studio is AI-staffed, human-directed. Full stop.
2. **The numbers are proof of the model, not of hustle.** 1,258 projects in seven months. 13,317
   exchanges. 472 files shipped. 43 active clients. 14 full AI-built site rebuilds. Use them as
   evidence the system works, never as a workload confession.
3. **No unearned claims.** Every service named must trace to real shipped work (Section 5 maps them).
   No invented case studies, no fabricated testimonials, no "trusted by" strips.

---

## 2. Brand

### Name
**Live AI Studios.** Wordmark set in the same family voice as Live Web Studios. In running copy:
"Live AI Studios" first mention, "the studio" or "we" after.

### Logo
Four original concepts are on the design board from tonight's session (Claude Design, 2026-09-25).
All four keep the LWS DNA: hard-edged geometric monogram in a square field, one flat brand color,
no gradients. Jon picks the winner; Claude Code builds the final SVG from the chosen spec below.
**Default if Jon does not mark a winner: Concept 1.**

| # | Concept | Spec |
|---|---|---|
| 1 | **Node Monogram** | The LWS-style angular square frame, but the interior letterforms are "AI" cut in the same bevel-notch style as the LW mark. One violet node dot at the letter junction, the only circle in the mark. |
| 2 | **Pulse Frame** | Square frame with the LWS corner cut, interior holds a horizontal pulse/waveform line that spells a subtle "AI" in its peaks. Reads as signal, not medical. |
| 3 | **Split Field** | The square divided by one diagonal (echoing the LWS corner slash). Upper field solid violet with a knocked-out "A", lower field dark with an outlined "I". |
| 4 | **Stacked Wordmark** | No pictorial mark. "LIVE AI STUDIOS" stacked in the LWS heavy grotesque, "AI" alone in violet, a thin square keyline around the "AI" only. Quietest and most extraction-ready. |

Deliverables per the chosen concept: `public/images/ai/logo-live-ai.svg` (full lockup, mark + wordmark),
`logo-live-ai-mark.svg` (mark only, square, favicon-ready), both with `currentColor`-safe dark and light
variants baked as `<style>` media in one file or as `-light` twins.

### Color
The LWS services mega-nav already assigns **violet `#A78BFA`** to the AI column. The sub-brand adopts
and owns it. Violet sits opposite-adjacent to the LWS cyan `#38BDF8` on the wheel: clearly a sibling,
never a clash, and it does not collide with LBWS amber or Namesake brass.

Tokens (add to `global.css`, scoped semantics like the existing `--band` and `--brass`):

```css
--ai:        #A78BFA;  /* primary accent, chips, active states, links */
--ai-deep:   #7C5CE0;  /* hover, borders, icon strokes */
--ai-glow:   rgba(167, 139, 250, 0.14);  /* section glows, card halos */
--ai-ink:    #0E0B1A;  /* section-alt background, near-black with violet cast */
```

**Anti-slop guardrail, non-negotiable:** violet is used FLAT. No purple gradients, ever, anywhere.
No purple-to-pink, no purple-to-blue, no glassy purple orbs, no 3D blobs. The accent appears as solid
fills, hairlines, text color, and node dots. The motion layer (Section 4) carries the atmosphere;
the color stays disciplined.

### Type
No new fonts. The section uses the v3 site's existing type stack and scale. Differentiation comes from
the accent, the motion system, and the illustration language, not from a new typeface. (Keeps the
extraction story clean too: the future standalone site inherits a proven system.)

### Backgrounds
Dark, always. Base is the v3 dark ground; alternating sections may use `--ai-ink` for the violet-cast
near-black. No light sections in this sub-brand.

---

## 3. Site map and sub-nav

Seven pages plus the blog. URLs are flat and extraction-ready.

| URL | Page | Job |
|---|---|---|
| `/ai` | **Home** | The flagship. Tagline hero, the numbers band, the model, services teaser, proof teaser, CTA |
| `/ai/services` | **Services** | Six evidence-backed offers (Section 5), each a card + detail block |
| `/ai/proof` | **Proof** | The showcase: site rebuilds, published tools, the content pipeline, the automation work |
| `/ai/how-it-works` | **How It Works** | The AI-staffed model explained: functions, direction, approvals, what stays human |
| `/ai/blog` | **Insights** | Third blog. Index of the 20 launch articles (Section 6) |
| `/ai/blog/[slug]` | Article pages | Decap-managed collection, same pattern as the main blog |
| `/ai/start` | **Start** | Intake: short pitch + Formspree form. The only conversion page |

### Sub-nav (the LBWS pattern, exactly)
Main LWS nav stays on top on every page, ALL CAPS, untouched. Directly under it, sticky at
`top: var(--nav-h)`, the Live AI Studios sub-bar renders on every `/ai*` page:

- Brand link left: the Live AI mark + "LIVE AI STUDIOS" wordmark (`logo-live-ai.svg`)
- Links: **Home · Services · Proof · How It Works · Insights**
- Right: ghost CTA button **"Start with AI"** → `/ai/start` (the Namesake "Start Yours" pattern)
- Active state: `is-active` + `aria-current="page"`, styled with `--ai` and the existing 2px bottom
  rule. Home active only on `/ai` itself.
- Mobile ≤900px: sticky, wraps to two rows max, no horizontal scroll.

This reuses the `.subnav` machinery Nav.astro already has for LBWS and Namesake. New `aiLinks` array,
new `.theme-live-ai` wrapper class on the pages, zero new nav systems.

---

## 4. Motion system (the thing that makes this section feel different)

Jon's call: movement on these pages. Subtle animated mp4 section backgrounds, mixed professionally with
hi-res lifelike imagery. The recipe is the proven Küche pipeline.

### The four loops
Higgsfield renders, 10s, 1080p, **no text, no logos, no faces, no readable UI** in frame. Jon generates
these (prompts below), Claude Code wires them with fallbacks so the build never blocks on them.

| File | Where | Prompt direction |
|---|---|---|
| `ai-hero.mp4` | `/ai` hero | Near-black field, slow-drifting violet light filaments forming a loose constellation, shallow depth, cinematic grain, glacially slow camera push |
| `ai-services.mp4` | Services section band | Extreme macro of dark brushed metal and glass edges, faint violet glints tracing along edges, very slow lateral drift |
| `ai-proof.mp4` | Proof page hero | Dark particles of light streaming in one direction like data in motion, out of focus, violet and white, slow |
| `ai-how.mp4` | How It Works hero | Dark topographic contour lines slowly redrawing themselves, thin violet strokes on near-black |

### Transcode recipe (per loop, the Küche numbers)
Palindrome loop (forward + reverse concat) so the seam disappears, `libx264 crf 28`, scaled to 1600px
wide, audio stripped, `movflags +faststart`. Plus a 720p mobile source and a poster JPG (first frame,
q82). Target: **every loop under 4 MB desktop, under 1.5 MB mobile. Total motion weight on any single
page under 8 MB.**

### Rules
- One `<video>` playing at a time. Offscreen videos pause via IntersectionObserver.
- `autoplay muted loop playsinline preload="none"` + `poster`. The poster IS the layout; zero CLS.
- `prefers-reduced-motion: reduce` → posters only, videos never load.
- Every video sits under the existing `.videobg__scrim`; text contrast is checked against the scrim,
  not the poster.
- Until Jon's renders land, Claude Code ships a **procedural fallback loop** per slot (canvas-generated
  drifting violet particles rendered to mp4 via ffmpeg, the Küche trick, ~400 KB) so the section is
  reviewable immediately.

### Micro-motion
GSAP is already in the toolchain from Targeteers-style builds, but v3 core stays dependency-clean:
use CSS-only reveals (opacity + 12px translate, 500ms, `cubic-bezier(0.4, 0, 0.2, 1)`) triggered by
IntersectionObserver, staggered 60ms per card. Numbers in the stats band count up once on first view
(vanilla JS, respects reduced-motion by rendering final values immediately).

### Imagery
Alongside the loops: hi-res photographic stills (Higgsfield, lifelike, no faces unless licensed) for
split sections, treated with the standard image pass (max 1600px, JPG q82, metadata stripped, width +
height + lazy + async on every img).

---

## 5. Services (each traces to shipped work; the proof page cross-links)

| Service | Evidence behind it |
|---|---|
| **AI-Built Websites** | 14 full rebuilds: Targeteers, Küche+Cucina, Legacy TCP, Winslow Eagles, Valley Tent, Community Church GR, Manual Therapy, Mianne Benchwork, D&J Power Washing, Level Set, Mosaic, Live Web Photos, VÖID, LWS v3 itself |
| **Workflow & Office Automation** | Hosting-renewal invoice automation (Zoho + Apps Script, 15 .gs files), monthly reporting pipeline, weekly member-list automation, FB/IG posting automation, email triage |
| **AI Content Engines** | Newsletter engine, social calendars, a weekly comic strip pipeline (script → art → publish, 13 strips), three blogs |
| **Generative Media** | Hero films (Higgsfield), animation, 3D character work, hundreds of photo manipulations and composites |
| **AI Reporting & SEO Intelligence** | DataForSEO pipeline, Search Console audits, schema work, client report templates |
| **AI Readiness Consulting** | Legal AI consulting engagement, Cognitivology, workflow assessments |

Six cards on `/ai/services`, each: icon (24×24, stroke 1.6, violet), name, two-sentence plain-English
description, "what we shipped" line linking into `/ai/proof`, and one CTA to `/ai/start`.

---

## 6. The third blog: Live AI Insights (20 launch articles)

New Decap-managed collection, completely parallel to the main blog and the LBWS content. Clients never
touch it; Jon manages it at `/admin/` like the rest.

- Collection: `src/content/ai-blog/`, Decap collection label **"AI Insights"**
- Index: `/ai/blog` in the sub-brand shell, card grid, newest first
- Articles: `/ai/blog/[slug]`, BlogPosting JSON-LD, 900–1,200 words each, written to the LWS voice
  rules (Section 8 carries them), search-intent titles aimed at small-business owners
- **Every article gets its own art.** Ten get complex original SVG illustrations (built in-repo,
  dark ground, flat violet + restrained neutrals, geometric-editorial style, no purple gradients).
  Ten get photographic heroes (Higgsfield, prompts listed in the article table; styled placeholder
  ships until Jon drops the files under the exact filenames).

| # | Slug | Title | Art |
|---|---|---|---|
| 1 | `what-is-an-ai-staffed-studio` | What Is an AI-Staffed Studio? | Illustration |
| 2 | `1258-projects-in-seven-months` | We Ran 1,258 AI Projects in Seven Months. Here Is What Held Up. | Illustration (data-viz style) |
| 3 | `ai-for-the-trades` | AI for the Trades: What a Plumber Actually Needs | Photo |
| 4 | `hacked-wordpress-to-ai-rebuild` | How We Rebuilt a Hacked WordPress Site Without WordPress | Photo |
| 5 | `what-ai-website-design-costs` | What AI Website Design Costs in 2026 | Illustration |
| 6 | `the-invoice-that-sends-itself` | The Invoice That Sends Itself: Office Automation for Small Business | Illustration |
| 7 | `ai-content-without-the-slop` | AI Content Without the Slop | Illustration |
| 8 | `hero-videos-from-a-prompt` | Hero Videos From a Text Prompt: Generative Media for Real Businesses | Photo |
| 9 | `seo-in-the-assistant-era` | Your Google Ranking and AI Answers: SEO in the Assistant Era | Illustration |
| 10 | `should-your-law-firm-use-ai` | Should Your Law Firm Use AI? A Straight Answer | Photo |
| 11 | `the-report-nobody-has-to-write` | The Monthly Report Nobody Has to Write | Illustration |
| 12 | `an-ai-build-start-to-finish` | From Sketch to Site: An AI Build, Start to Finish | Photo |
| 13 | `what-ai-cannot-do` | What AI Can't Do (And Why That's the Point) | Illustration |
| 14 | `front-office-automation-your-voice` | Automating Your Front Office Without Losing Your Voice | Photo |
| 15 | `ai-photo-work-the-truth` | AI Photo Work: Headshots, Products, and the Truth About Editing | Photo |
| 16 | `content-pipelines-that-run-themselves` | A Comic Strip Every Week: Content Pipelines That Run Themselves | Illustration |
| 17 | `small-business-ai-readiness-check` | Small Business AI Readiness: A 10-Point Check | Illustration |
| 18 | `the-newsletter-engine` | The Newsletter Engine: Email That Almost Writes Itself | Photo |
| 19 | `wordpress-to-ai-built-migration` | WordPress to AI-Built: What Migration Actually Involves | Photo |
| 20 | `ai-consultant-vs-ai-agency` | Hiring an AI Consultant vs. Hiring a Studio That Runs on AI | Illustration |

Photo prompts for #3, 4, 8, 10, 12, 14, 15, 18, 19 ride inside each article's frontmatter as an
`imagePrompt` comment block so they travel with the post; Jon batch-generates in Higgsfield and drops
files at `public/images/ai/blog/{slug}.jpg`.

---

## 7. Schema, SEO, wiring

- `/ai` hub: `Organization` node, name "Live AI Studios", `parentOrganization` the Live Web Studios
  `LocalBusiness` (same values index.astro emits), `url` `https://livewebstudios.com/ai`, `brand` of LWS.
- `/ai/services`: one `Service` node per offer, `provider` → the Live AI Studios Organization `@id`.
- Blog: `Blog` node on the index, `BlogPosting` per article (the existing blog pattern).
- Every page: unique title + meta description, canonical, OG image (`images/og/ai.jpg` from the hero
  poster), GA4 inherited from Base, sitemap inclusion (no filter changes needed except excluding
  nothing; `/ai/start` thank-you if built gets excluded like the others).
- Main nav: the services mega AI column (`#A78BFA`) gains "Live AI Studios" as its first link → `ai`.
- Footer: the family line gains the fourth member. Services column gains "AI Studio".
- `_redirects` additions, above wildcards: `/liveai → /ai 301`, `/ai/ → /ai 301`, `/ai.html → /ai 301`.
- liveaistudios.com domain wiring is Jon-side, Section 9. Nothing in-repo depends on it.

---

## 8. PROMPT (paste into Claude Code)

```
You are building the Live AI Studios sub-brand section of the Live Web Studios v3 site (Astro 7, React
islands, Decap CMS, Netlify): the /ai section, seven pages plus a 20-article blog collection. Work
autonomously. Do not stop to ask questions except for the stop conditions at the bottom. Log every
judgment call in DECISIONS.md at the repo root as one line: date, decision, why.

## Context (carry forward)
- Repo root is the current directory: livewebstudios-v3. If `git status` is dirty, stop and report.
- Astro config: build.format = 'file', inlineStylesheets = 'always'. Pages build to flat .html files.
- LWS PATH RULE: every href and src inside src/ MUST be relative, built with
  relPrefix(Astro.url.pathname) from src/lib/relPrefix.ts. Never a root-relative "/images/..." or
  "/ai/..." link in a component or page. Absolute https:// links to other domains stay absolute.
  Frontmatter image paths are the other exception (Decap writes root-relative; templates strip).
- Nav text is Title Case. Main nav renders on every page; the sub-brand bar sits under it, never
  replaces it. Reuse the existing .subnav machinery in src/components/Nav.astro (the LBWS/Namesake
  pattern): sticky at top: var(--nav-h), is-active + aria-current, mobile wrap, no new nav system.
- One H1 per page. Semantic HTML5. Meta, OG, canonical, JSON-LD on every page via Base.astro props.
- Writing rules: NO em dashes anywhere, use commas, periods, or colons. Never write "learn more",
  "click here", "submit", "don't hesitate to reach out", "schedule a free consultation". Button
  labels from the approved set: "Start with AI", "Let's talk.", "Reach out.", "Read it."
- No new dependencies. No Tailwind. No inline styles. CSS custom properties only. JS as progressive
  enhancement only.
- Read src/pages/services/seo.astro, src/components/Nav.astro, src/layouts/Base.astro,
  src/styles/global.css, and one existing blog [slug] template end to end before writing anything.
- Only make the changes requested below. Do not refactor, rename, or restyle anything else.

## THREE HARD CONSTRAINTS

### 1. "We", never solo
Live AI Studios is an AI-staffed studio directed by a human principal. The copy says "we". It NEVER
says or implies one-man shop, solo, freelancer, "just me", a headcount, or human employees. The
numbers (1,258 projects in seven months, 13,317 exchanges, 472 files shipped, 43 active clients, 14
full AI-built rebuilds) are proof the MODEL works. If you feel the urge to humanize with smallness,
the answer is more specificity about the system, not a confession.

### 2. The tagline is locked
The /ai hero headline block carries, verbatim: "We run our business on AI. Want proof? You're looking
at it." Do not soften, rearrange, or "improve" it.

### 3. Flat violet, no gradient slop
The accent tokens are --ai #A78BFA, --ai-deep #7C5CE0, --ai-glow rgba(167,139,250,0.14), --ai-ink
#0E0B1A. Violet appears ONLY as flat fills, hairlines, text, strokes, and node dots. Zero purple
gradients. Zero glassy orbs. Zero 3D blobs. Backgrounds stay dark on every page in this section.

## Session 0: Git and tokens
1. git status (must be clean), note the branch, work on it.
2. Add the four --ai tokens to src/styles/global.css next to the existing --band/--brass section
   tokens. Add a .theme-live-ai scope class following the .theme-live-band pattern.
3. Commit "Live AI Studios: tokens".
✅ Output: branch, the token block as written.

## Session 1: Logo and sub-nav
A. Logo. Build public/images/ai/logo-live-ai.svg (mark + LIVE AI STUDIOS wordmark lockup) and
   logo-live-ai-mark.svg (mark only, square). The mark: [JON: PASTE WINNING CONCEPT # HERE, default
   Concept 1] per the spec table in Section 2 of this handoff. Same angular, hard-edged, flat
   geometric language as images/logo-live-band.png's sibling marks: square field, corner cut, bevel
   notches, ONE flat violet #A78BFA, dark-safe. No gradients, no strokes thinner than 1.5 at 24px.
   Hand-author the SVG with clean paths; viewBox square; test rendering at 24, 48, and 160px.
B. Sub-nav. In src/components/Nav.astro add aiLinks and render the sub-bar on every /ai* page:
   brand link (logo-live-ai.svg) left, then Home -> ai.html, Services -> ai/services.html,
   Proof -> ai/proof.html, How It Works -> ai/how-it-works.html, Insights -> ai/blog.html,
   ghost CTA right "Start with AI" -> ai/start.html (the Namesake Start Yours pattern).
   Active state: is-active + aria-current, --ai accent, the existing 2px bottom rule. Home active
   only on the section index. Insights also active on /ai/blog/* article pages.
   Mobile <=900px: sticky under the header, wraps to max two rows, no horizontal page scroll.
   Verify the sticky offset with the scripted check: at 1280 and 375, after scrolling 1500px,
   subnav.getBoundingClientRect().top === header height.
✅ Output: the two SVG files, the aiLinks array, sticky check results.

## Session 2: Motion plumbing
A. Create src/components/AiVideoBg.astro (or extend the existing VideoBg if it cleanly accepts
   these props; prefer reuse, log the choice): renders <video autoplay muted loop playsinline
   preload="none" poster=...> with a 1600px desktop source, 720p mobile source via media queries or
   JS source swap, .videobg__scrim over it, and the poster reserving layout (zero CLS).
B. IntersectionObserver controller (one small vanilla JS module, progressive enhancement): plays a
   video only while its section is on screen, pauses otherwise, never more than one playing. Under
   prefers-reduced-motion: reduce, never attach sources; posters only.
C. Procedural fallback loops. Generate four mp4s with ffmpeg (canvas-free: use lavfi or a tiny
   node canvas script piped to ffmpeg): slow-drifting flat-violet particles/lines on near-black,
   10s palindrome, crf 28, ~400 KB each. Save as public/videos/ai/ai-hero.mp4, ai-services.mp4,
   ai-proof.mp4, ai-how.mp4 plus -720 mobile twins and poster JPGs. Jon's Higgsfield renders will
   later replace these AT THE SAME FILENAMES; write scripts/ai-video-transcode.sh that takes a raw
   render and emits the palindrome desktop, mobile, and poster set (the Kuche recipe: concat
   forward+reverse, libx264 crf 28, scale 1600 / 1280, -an, +faststart, poster q82).
D. Reveal system: CSS-only entrance reveals (opacity + 12px translateY, 500ms,
   cubic-bezier(0.4,0,0.2,1)), IntersectionObserver adds .is-in, 60ms stagger on card grids,
   reduced-motion renders everything visible immediately. Count-up for the stats band: vanilla JS,
   runs once, reduced-motion shows final values instantly.
✅ Output: component name(s), the four fallback loop sizes, the transcode script.

## Session 3: The seven pages
Structure template: src/pages/services/seo.astro (Base, Nav, Footer, page-head page-head--glass
has-videobg, sec-pad, grid-svc, card, glass-inner card-pad, split, portrait, frame-lines), all
wrapped in .theme-live-ai. Every page: unique title + meta description + canonical
(https://livewebstudios.com/ai/...), OG image images/og/ai.jpg (build it from the hero poster,
1200x630), JSON-LD per the schema block below, GA4 via Base.

1. src/pages/ai.astro (Home). Hero on ai-hero.mp4: eyebrow LIVE AI STUDIOS, H1 the locked tagline,
   lede one sentence naming what the studio is, buttons "Start with AI" (solid --ai, ink text) and
   "See the proof" ghost. Then: the numbers band (five stats, count-up): 1,258 projects. 7 months.
   472 files shipped. 43 active clients. 14 sites rebuilt end to end. Then: The Model (three cards:
   AI-staffed functions, human direction, your business plugged in). Then: services teaser (six
   compact cards linking to /ai/services). Then: proof teaser (three highlights linking to
   /ai/proof). Then: latest Insights (three newest articles). Closing CTA band.
2. src/pages/ai/services.astro. Six services, each a card + a short detail block, copy grounded in
   the evidence table in Section 5 of this handoff: AI-Built Websites, Workflow & Office
   Automation, AI Content Engines, Generative Media, AI Reporting & SEO Intelligence, AI Readiness
   Consulting. Icons 24x24 stroke 1.6 currentColor in the existing nav-ico style. Each card ends
   with one line pointing at the matching proof and one CTA to /ai/start. Section band uses
   ai-services.mp4.
3. src/pages/ai/proof.astro. Hero on ai-proof.mp4. Three proof families with real named work only:
   Rebuilt end to end (the 14 sites, grid of name + industry + one-line result, link where live),
   Systems that run themselves (invoice automation, reporting pipeline, comic pipeline, newsletter
   engine), Media made from prompts (hero films, photo work, animation). No client-confidential
   detail, no invented metrics. Where a number exists in this handoff, use it; where it does not,
   describe the work without inventing one.
4. src/pages/ai/how-it-works.astro. Hero on ai-how.mp4. The model in five steps (ol of cards,
   step-num style in --ai): Listen (what your business actually does), Map (where AI earns its
   keep), Build (the systems, the site, the content), Direct (human judgment on every output),
   Run (it keeps working; we keep watch). Then a straight section: What stays human. Then FAQ
   (details/summary accordion, reuse the existing faq-item pattern, 6 questions: what does it
   cost, do you replace my staff, what tools do you use, how fast, what about my data, where do
   we start). FAQPage JSON-LD verbatim-matched.
5. src/pages/ai/start.astro. Short page: eyebrow, H1 "Start with AI.", three-sentence pitch,
   Formspree form (name, business, email, phone optional, "what should run itself?" textarea),
   action placeholder https://formspree.io/f/REPLACE_ME with a TODO comment, _next
   https://livewebstudios.com/ai/thank-you. Build ai/thank-you.astro, noindex, excluded from
   sitemap like the existing thank-you pages.
6. src/pages/ai/blog.astro. Insights index in the sub-brand shell: card grid, image/illustration
   top, title, date, one-line description, newest first, from the ai-blog collection.
7. src/pages/ai/blog/[slug].astro. Article template cloned from the existing blog [slug] pattern,
   restyled minimally with the --ai accent, BlogPosting JSON-LD, prev/next within the collection.
✅ Output: the seven files, each page's title and description as written.

## Session 4: The 20 articles and their art
A. Decap. In public/admin/config.yml add an "AI Insights" collection targeting
   src/content/ai-blog/, same field shape as the main blog collection (title, date, description,
   image, tags, draft). Do not touch the existing collections.
B. Content collection config: register ai-blog in src/content/config.ts mirroring blog.
C. Write the 20 articles from the table in Section 6 of this handoff: 900 to 1200 words each,
   filenames YYYY-MM-DD-slug.md dated newest-first across the last 20 weeks (one per week, newest
   2026-09-24, working backwards), description = a real 150-160 char meta, tags from a small
   controlled set (websites, automation, content, media, seo, consulting). Voice: plain, direct,
   first-person plural, small-business reader, zero hype, zero slop phrases, the kill-list applies
   inside every article. Each article: H2/H3 structure, one internal link to a relevant /ai page
   and one to another article, a closing line pointing at /ai/start (varied wording, never
   "schedule a free consultation").
   Commit in batches of five so a failure never loses more than four articles.
D. Ten SVG illustrations (articles marked Illustration in the table): hand-authored, 1600x900
   viewBox, dark ground #0E0B1A, flat --ai violet + two neutrals max, geometric-editorial style
   (grids, nodes, angular cuts, the brand's corner-slash motif recurring), no gradients, no text
   inside the art, each visually distinct and matched to its article's idea. Save
   public/images/ai/blog/{slug}.svg, reference from frontmatter.
E. Ten photo posts: frontmatter image points at /images/ai/blog/{slug}.jpg. Ship a styled
   placeholder at each path (solid --ai-ink JPG 1600x900 with a subtle flat violet corner-slash,
   generated via sharp or ffmpeg, no text) so nothing 404s. Write the ten Higgsfield prompts into
   an HTML comment block at the top of each of those articles (photorealistic, no faces, no
   logos, no readable text, dark and cinematic, subject matched to the article) and also
   consolidated into HIGGSFIELD_PROMPTS_AI_BLOG.md at the repo root for Jon.
✅ Output: 20 filenames with dates, the 10 SVGs, the prompts file.

## Session 5: Wiring and schema
A. Main nav mega: in .mega--services the AI column (#A78BFA) gains "Live AI Studios" as its FIRST
   link -> ai, existing links follow. Same svc-link markup, mark icon from logo-live-ai-mark
   redrawn as a 24x24 stroke icon (do not embed the filled logo in the mega).
B. Footer: family line gains Live AI Studios -> ai. Services column gains "AI Studio" -> ai after
   the last current entry.
C. Schema. /ai: Organization "Live AI Studios", @id https://livewebstudios.com/ai#org, url
   https://livewebstudios.com/ai, parentOrganization the same LocalBusiness object index.astro
   emits (Live Web Studios, 732-801-9611, jonwolf@livewebstudios.com, 446 Saddle River Rd., Unit
   2, Saddle Brook, NJ 07663, US), logo the absolute URL of logo-live-ai-mark.svg. /ai/services:
   six Service nodes, provider {"@id": the org @id}. /ai/how-it-works: FAQPage. Blog index: Blog
   node. Articles: BlogPosting (the existing pattern). No default WebPage node where a specific
   node set is passed.
D. _redirects, above wildcards: /liveai -> /ai 301, /ai/ -> /ai 301, /ai.html -> /ai 301.
E. Sitemap: confirm all /ai pages and the 20 articles appear in dist/sitemap-0.xml; /ai/thank-you
   excluded (extend the existing filter).
F. Internal links in: one contextual sentence + link to /ai from each of src/pages/index.astro,
   src/pages/about.astro, src/pages/services/index.astro, in the site's third-person voice,
   varied anchors ("the AI studio", "Live AI Studios", "AI-powered builds"). No link lists.
✅ Output: the mega/footer diffs, the JSON-LD as built, the three sentences from F.

## Session 6: QA and push
1. Run /polish, /colorize, /layout, /animate if the commands exist, scoped to the files this
   handoff created or edited. Note missing commands in DECISIONS.md and continue.
2. KILL-LIST SCAN on new and edited files: the em dash character, "learn more", "click here",
   "Submit", "don't hesitate", "free consultation". Zero hits. Fix in source.
3. POSITIONING SCAN on every new page and article: grep for "one-man", "one man", "solo",
   "freelancer", "just me", "myself", "single person", "small team", "our team of". Zero hits.
   The copy says "we" and "the studio" without headcount or human-staff implications. Also
   confirm the hero tagline appears verbatim in dist/ai.html.
4. GRADIENT SCAN: grep new CSS for "linear-gradient" and "radial-gradient" containing any of
   #A78BFA, #7C5CE0, 167, 139, 250. Zero hits (the scrim's existing neutral gradient is exempt).
5. Single H1 per page across every new dist/ai*.html and article. Exactly one each.
6. Link check on every new page: every href and src resolves in dist/ (or is absolute https).
   Zero broken.
7. Contrast: hero text over each scrimmed poster clears 4.5:1 at 1280 and 375. Deepen the scrim
   on .theme-live-ai only if needed, reusing the existing scrim token.
8. CLS: load dist/ai.html mobile-emulated; the video posters must reserve layout; CLS under 0.1.
9. Motion: with prefers-reduced-motion emulated, confirm no video source is attached and reveals
   render immediately.
10. Confirm G-SW3VF5PBDT in every new built page, sitemap contents per Session 5E, and the Decap
    config parses (npx decap-server if available, else YAML-validate).
11. Update SESSION_SUMMARY.md with a dated block. git add -A, commit "Live AI Studios: /ai
    sub-brand, seven pages, 20-article Insights blog", push origin main.

## Stop conditions (the only three)
- git status is dirty at start, or a tracked file would be permanently deleted. Report and wait.
- A credential or secret is required beyond the Formspree placeholder already handled. Say what
  and wait.
- The .subnav machinery in Nav.astro turns out not to support a third sub-brand without
  structural surgery. Describe the conflict and wait rather than rebuilding the nav.
Everything else: decide, log it in DECISIONS.md, keep going.
```

🎯 Target: Claude Code · 💡 Seven sessions, zero new dependencies, fallback loops so the build never
waits on Higgsfield, filename-stable video and photo slots so Jon's renders drop straight in, and
three scans (kill-list, positioning, gradient) guarding the three ways this section could go wrong.

---

## 9. After Claude Code finishes (Jon)

1. **Pick the logo.** The four concepts are on the design board. Paste the winning number into the
   Session 1A slot before running, or let it default to Concept 1 and iterate after.
2. **Formspree.** Create the `/ai/start` form, drop the ID into `src/pages/ai/start.astro`
   (grep for `REPLACE_ME`), redeploy. Send a test.
3. **Higgsfield renders.** Generate the four loops from the Section 4 prompts and the ten blog photos
   from `HIGGSFIELD_PROMPTS_AI_BLOG.md`. Run each loop through `scripts/ai-video-transcode.sh`, drop
   everything at the exact filenames, redeploy. The fallbacks disappear automatically.
4. **Smoke test** on the netlify.app URL: `/ai` (sub-nav sticks flush, tagline verbatim, stats count
   up once), `/ai/services`, `/ai/proof`, `/ai/how-it-works` (FAQ opens), `/ai/blog` + two articles
   (one SVG, one photo), `/ai/start` (form posts, thank-you lands), reduced-motion check in DevTools.
5. **Decap:** log in at `/admin/`, confirm the AI Insights collection lists 20 posts and saves an edit.
6. **liveaistudios.com:** point DNS at Netlify (A `75.2.60.5`, `www` CNAME to the site), add it as a
   domain alias, then one `_redirects` line: `https://liveaistudios.com/* https://livewebstudios.com/ai/:splat 301!`
   (and the www twin). The domain now feeds the section; the extraction ramp stays open.
7. **GSC:** re-submit the sitemap; watch Coverage as 27 new URLs index.
8. **Voice pass:** run `/jonvoice` on any article that reads stiff, telling it the "we, never solo"
   rule first so it does not normalize the positioning away.

---

## 10. Decisions Claude Code will make on its own (override now if you disagree)

| Item | Default in the prompt |
|---|---|
| Section root URL | `/ai` (short, extraction maps 1:1 to liveaistudios.com) |
| Accent | Flat violet `#A78BFA`, inherited from the mega-nav AI column. No gradients, enforced by scan |
| Logo | Concept 1 (Node Monogram) unless Jon pastes another number into Session 1A |
| Sub-nav labels | Home, Services, Proof, How It Works, Insights + "Start with AI" ghost CTA |
| Blog name | "Insights" in the nav, "AI Insights" in Decap |
| Article dating | One per week backwards from 2026-09-24, so the index looks lived-in at launch |
| Video fallbacks | Procedural violet-particle loops at the final filenames until Higgsfield renders land |
| Fonts | The v3 stack unchanged; differentiation via accent, motion, illustration |
| Stats in the numbers band | 1,258 · 7 months · 472 files · 43 clients · 14 rebuilds |
| Form | Formspree placeholder `REPLACE_ME`, Jon supplies the real ID post-build |

---

## 11. Not in this handoff (separate sessions)

- **The Higgsfield generation session itself.** Four loops + ten photos + the OG suite; batch it in
  one sitting with the prompts files.
- **Case-study deep pages.** `/ai/proof` links out at launch; individual case-study pages
  (Targeteers, Küche, the comic pipeline) are a strong phase two, each one a `/ai/proof/[slug]`.
- **The liveaistudios.com standalone extraction.** Only if the consulting revenue earns it; the URL
  map and the self-contained design tokens make it a 301 exercise, not a rebuild.
- **A lead magnet on `/ai/start`.** The AI Readiness 10-Point Check (article #17) as a scored
  interactive tool is the obvious candidate. Namesake-preview energy, separate handoff.
- **Productizing the offers.** The services page describes capabilities; named packages with pricing
  come after the first consulting engagements shape them.
