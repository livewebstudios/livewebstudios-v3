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

### 2C-3 · Cross-session gap: Session 2B (Live Band) is NOT built
The 2C/2D/2E brief states 2B "should already be done in this same run —
verify it's committed before starting 2C." It is **not**: the last commit
is `75b65c5` (Phase 1 + 2A), and `src/pages/live-band.astro` does not
exist. However, `Nav`/`Footer`/`StudiosPanel` all link to `live-band.html`.
- **Impact:** those links currently 404 until 2B is built. This did not
  block 2C (Namesake is independent), so per the run's stop-and-flag rule
  I proceeded and logged it here.
- **Question for Jon:** Do you want 2B (Live Band Web Studios) built in a
  follow-up session, or was it done elsewhere and just not merged into
  this working tree?

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

_(populated during 2E)_
