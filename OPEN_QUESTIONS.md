# OPEN QUESTIONS — LWS v3 Sessions 2C / 2D / 2E

Logged by the unattended 2C→2D→2E run for Jon to resolve. Nothing here
blocked a whole session; each item is a decision that is genuinely Jon's
to make (brand voice, which real clients to feature, template parity, or
a cross-session gap). Grouped by session.

---

## SESSION 2C — Namesake

### 2C-1 · Accent color (RESOLVED from codebase, confirm or override)
The brief said to pick a third accent (cyan = LWS, amber = Live Band) and
flag it. Before inventing one I checked the codebase per instructions and
found the accent was **already implied**: `global.css` defines
`--brass:#C9A55A;  /* Namesake (ink + brass) */`, and `StudiosPanel.astro`
already themes the Namesake mega-card with brass. So I used **brass
`#C9A55A`**, not a new color.

- Contrast of `#C9A55A` on the `#05070B` base = **~8.6:1** (passes WCAG AA
  for normal text, AAA for large). Light-brass variant `#E3CB8B` used for
  eyebrow/accent text sits even higher.
- **Question for Jon:** Confirm brass `#C9A55A` is the intended Namesake
  accent, or override. If you want it pushed more "deep violet / premium
  jewel" instead of warm gold, say so and I'll re-theme (it's a
  4-variable change on the `.theme-namesake` wrapper in `namesake.astro`).

### 2C-2 · Copy is structural, not final
All Namesake page copy is premium-leaning placeholder written to survive a
later `/jonvoice` pass. Positioning (personal-brand sites for solo pros:
attorneys going solo, performers, consultants, founders) is per the brief.
Confirm the audience framing and the "A Studio of Live Web Studios"
sub-brand descriptor before launch.

### 2C-3 · Cross-session gap: Session 2B (Live Band) is NOT built — ✅ RESOLVED
**RESOLVED in Session 2B (commit `01bdb80`).** `src/pages/live-band.astro`
now exists and builds to `/live-band.html`. The `Nav`/`Footer`/
`StudiosPanel` links to `live-band.html` resolve 200 with no redirect hop
(verified in-browser, not just by grep). The amber portal hero uses
`ShaderHero accent="#FCD34D"` re-themed via a `.theme-live-band` wrapper
(same scoping pattern as `.theme-namesake`). Amber contrast verified at
runtime: 16.19:1 (clears AAA), no adjustment needed.

Original flag (kept for the record): the 2C/2D/2E brief said 2B "should
already be done in this same run"; it was not (baseline was `75b65c5`), so
the links 404'd until this session closed the gap.

### 2B-1 · Slug naming: /live-band vs /live-band-web-studios — ✅ RESOLVED
**RESOLVED (commit `40bcbe6`). Jon chose `/live-band-web-studios` as
canonical, reversing the Phase 2 §3 lock.**

Background: Session 2B originally built the page at `/live-band` because the
**locked** `_redirects` (Phase 2 §3, "finalized 2026-07-04") made
`/live-band` canonical and 301'd the long slug into it, and every internal
link pointed to `live-band.html`. That was flagged here as an open question.

Resolution applied:
- Page renamed `live-band.astro` → `live-band-web-studios.astro`
  (`/live-band-web-studios.html`; old `/live-band.html` no longer built).
- `_redirects` rule reversed to `/live-band → /live-band-web-studios 301`,
  with an audit-trail comment noting the reversal overrides the prior lock.
- All internal links (mega-panel, footer ×2, about trio) and the page's
  canonical + og:url now point to `/live-band-web-studios`; sitemap
  regenerates to match.
- **Note:** the `/live-band → /live-band-web-studios` 301 is a Netlify
  runtime redirect; `astro preview` doesn't process `_redirects`, so the old
  path 404s locally (expected). The redirect can only be confirmed on a
  Netlify deploy. The rule is present and correct in `public/_redirects`.

---

## SESSION 2D — Remaining Tier A pages

### 2D-1 · /work — which real clients to feature (Jon's call)
Per the brief, `/work` ships with **6 clearly-marked placeholder entries**
("Placeholder Project 01–06"), NOT real client names. `clients.md` holds
35+ real clients (B-Line Counseling, BP Electric, Brian Halligan Law, …),
but choosing which to feature publicly is your decision.
- **Question for Jon:** Which clients (and which of their live URLs /
  screenshots) go in the portfolio? Once you pick, the grid in
  `src/pages/work.astro` swaps in directly (the `projects` array).

### 2D-2 · /contact — Formspree endpoint is a placeholder
The form posts to `https://formspree.io/f/YOUR_FORM_ID`. Swap for the
real LWS Formspree form ID before launch. Pattern is per
`specs/boilerplate-design.md`: `_next` absolute redirect
(`https://livewebstudios.com/contact?sent=1`, which triggers the on-page
"Message sent" banner) + `_gotcha` honeypot. `_subject` is set.
- **Question for Jon:** Provide the Formspree form ID (or confirm you
  want a dedicated `/thanks` page instead of the `?sent=1` banner).

### 2D-3 · /about — placeholder facts to confirm
Marked in-source with `<!-- PLACEHOLDER: confirm with Jon -->`:
- **"35+ Active Clients"** — from the brief; confirm exact number.
- **"200+ Sites Shipped"** — carried over from the homepage telemetry;
  confirm it's accurate for the about-page stat.
- **Business hours** — currently "By appointment. I answer fast." Confirm
  or replace with real hours.
All about copy is structure-first and will go through a `/jonvoice` pass.

### 2D-4 · Dangling nav link: /services is not built
The top nav (`Nav.astro`) links `services.html`, but no services page
exists (it's outside the 2C/2D/2E scope). Same for the footer's town /
industry SEO landing pages (`web-design-*.html`, `*-websites.html`) and
the other sub-brand doorways (`live-web-photos.html`,
`live-ai-studios.html`). These 404 until built.
- **Question for Jon:** Schedule a session for `/services` + the footer
  SEO landing pages, or remove `SERVICES` from the top nav until it's
  ready? (Flagging, not touching the shared Nav without your call.)

---

## SESSION 2E — Decap CMS blog

### 2E-1 · Master login template ships a forbidden caret version (upstream bug)
The branded login master
(`livewebstudios/claude-global-config/index.html`) loads Decap via
`decap-cms@^3.0.0` — a **caret range**, which `specs/cms-decap.md` HARD
RULE explicitly forbids ("the caret is what silently pulls a broken
release" that crashes the image widget). So I made **two** changes to the
template, not one: (1) the `<title>`, and (2) pinned `@3.1.2`. The brief
said "only the `<title>` changes," but the version-pin hard rule wins.
- **Action for Jon:** Fix the master template in the global-config repo so
  it pins `@3.1.2` too. Every site cloned from it currently inherits the
  caret bug.

### 2E-2 · Netlify dashboard steps I can't do from code
These are on you (Netlify UI), and the CMS won't work until they're done:
1. Connect the repo to Netlify for auto-deploy on `main`.
2. Enable **Netlify Identity** (invite-only, not open signup).
3. Enable **Git Gateway**.
4. Invite yourself/the client from Identity.
The Netlify Identity widget is already on the homepage so invite links
resolve once Identity is enabled.

### 2E-3 · No GitHub Action was created (correct per spec)
Deliverable 4 said "if this requires a GitHub Action, use the heredoc
pattern." It does **not**: the file collection writes
`public/posts/index.json` directly and Netlify redeploys in ~30s. Per the
spec, folder collections + Actions are "fragile… skip it entirely." So
there is no Action and no `[skip ci]` anywhere. `posts/index.json` is
seeded with 3 starter posts (clearly starter content, edit/delete from
`/admin/`).

### 2E-4 · Media path trade-off (thumbnails)
`config.yml` sets `public_folder: "images/uploads"` (relative) to honor
the LWS path rule, instead of the spec sample's root-relative
`/images/uploads`. Live render is correct and path-compliant, and the
renderer strips any leading slash defensively. Possible minor side effect:
Decap's **in-editor** image preview for optional thumbnails may not
resolve in the admin UI (cosmetic, admin-only). Flag if you'd rather have
editor previews and accept root-relative stored refs.

### 2E-5 · Blog SEO is deliberately deferred
Blog cards render client-side from JSON (the standing LWS pattern), so
individual posts aren't crawlable as separate URLs and there are no
per-post pages or JSON-LD yet. That's per the brief (SEO/schema held for
Session 2F). Confirm you want post detail pages + Article schema in 2F.

### 2E-6 · GA4 still a placeholder
Every page (via `Base.astro`) ships the GA4 snippet with
`G-XXXXXXXXXX`. Swap in the real Measurement ID before launch. (Same
placeholder noted for all Phase 2 pages.)
