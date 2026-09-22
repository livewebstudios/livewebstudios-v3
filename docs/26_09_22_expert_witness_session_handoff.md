# Expert Witness Build + Site Fixes: Session Handoff

Point-in-time snapshot of the Claude Code session of 2026-09-22 on
`livewebstudios-v3`. Covers the new `/services/expert-witness` page built from
`docs/expertwitness/26_09_22_lws_expert_witness_claude_code_handoff.md`, plus
six unrelated fixes Jon asked for mid-session. Everything below is done and
verified unless it sits under "Not done".

**Nothing has been committed.** HEAD is still `89f6a1c`. See "Git state".

---

## 1. What was built

### /services/expert-witness (new)

`src/pages/services/expert-witness.astro`. Structure copied from
`services/seo.astro`. Copy ported verbatim from the content file at
`docs/expertwitness/26_09_22_lws_expert_witness_page_content.html`.

Eight sections in order: hero, marquee, practice areas (6 cards), qualification
split, engagement (5 numbered steps), billing split, background trio, FAQ, CTA.

**The hard content constraint still applies to any future edit.** Jon has no
prior expert witness testimony history. The page must never claim or imply
prior testimony, retentions, case counts, courtroom experience, client results,
endorsements or testimonials. No social proof section, no logo strip, no stats
band. If the page looks like it needs credibility, the answer is more
specificity about method, not more claims. There is a grep for this in the QA
block below and a comment block at the top of the page file saying the same.

### Wiring

| Where | What |
|---|---|
| `src/components/Nav.astro` | New 4th services mega column, label LEGAL, colour `#C9A55A`, reusing the existing `scales` NavIcon |
| `src/components/Footer.astro` | "Expert Witness" in the Services column, after Branding |
| `src/pages/services.astro` | New LEGAL group with one card |
| `public/_redirects` | 3 rules at lines 28-30, above every wildcard |
| `src/pages/industries/law-firm.astro` | One in-body link, anchor "expert witness work" |
| `src/pages/services/seo.astro` | One in-body link, anchor "digital expert witness services" |
| `src/pages/about.astro` | One in-body link, anchor "expert witness engagements" |
| `src/styles/global.css` | `.steps` / `.step-num`, and `.studios--svc{position:static}` |

### Schema

Page passes a `jsonld` array of two nodes: `Service` (serviceType "Expert
Witness", full LocalBusiness provider, areaServed NJ + US) and `FAQPage` (all
six Q&A). Both render off the same `faqs` array in frontmatter, which is what
keeps the question strings character-identical between the visible HTML and the
JSON-LD. Google drops the rich result when they drift, so do not split them.
Base emits no default WebPage node when `jsonld` is passed, so nothing is
duplicated.

---

## 2. The six side fixes

1. **`.gitignore`** — added `docs/expertwitness/` and `Claude outputs/`. They
   were untracked but NOT ignored, so the `git add -A` that Session 5 of the
   original handoff calls for would have swept both in.
2. **Band pricing copy** (`live-band-web-studios/pricing.astro`) — the
   hand-built-site bullet reworded, and "Custom logo" added as the first item
   under "Does not include:".
3. **FAQ opacity** (`src/pages/faq.astro`) — cards were `rgba(7,11,20,.52)` over
   the bright `faq-mov.mp4`. Now `.88`. The real bug was `.faq-item.is-open`
   REPLACING the dark panel with a 5% cyan wash, so an opened answer sat on bare
   video. The cyan now layers over the dark ground instead of replacing it.
4. **Band SEO cards** (`src/components/BandSeoCards.astro`) — base
   `.glass-inner` is `rgba(11,18,32,.5)`, tuned for the dark main site. Over the
   band pages' amber stage wash the copy read through onto lit gold. Overridden
   to `rgba(9,14,26,.9)` scoped to `.lbs-card` only, with a no-backdrop-filter
   fallback. Shared component, so this also fixed the band home, forms,
   personal-sites and portfolio pages.
5. **Services dropdown closing early** — see "Gotchas" #2.
6. **Receiver CTAs** — new `src/components/ReceiverCta.astro`, used by both
   pricing CTAs. McIntosh-style panel: brushed alloy end caps, black glass face,
   recessed blue VU meter, engraved label plate. Needle rests at `-46deg` and
   swings to a per-button `--peak` on hover AND keyboard focus. Basic peaks at
   `18deg`, Touring/Pro at `46deg` and into the red. Easing overshoots and
   settles like a real moving-coil needle. Gradient ids are randomised per
   instance, because two meters sharing an id would both resolve `url(#...)` to
   the first one's lamp. Reduced-motion parks the needle mid-scale. Both still
   plain `<a href="../contact.html">`.

---

## 3. Images

All generated with Higgsfield `cinematic_studio_2_5`. House style is the one
`industry-law-firm.jpg` set: glowing cyan wireframe hologram of a literal
object on a dark reflective floor.

| File | Use |
|---|---|
| `expert-witness-hero.jpg` | Hero. Scales of justice weighing a browser window against case documents. 1600x679 |
| `og-expert-witness.jpg` | OG card, 1200x630, cropped from the hero frame |
| `expert-witness-evidence.jpg` | Qualification split, 1080x1440 |
| `expert-witness-forensics.jpg` | Billing split, 1600x900 |
| `expert-witness-area-*.jpg` (6) | Practice area card banners, 900x604 |
| `expert-witness-step-*.jpg` (5) | Engagement step card banners, 900x604 |

All card art is 608K total. Every prompt carried "no text, no lettering, no
numbers, no logos, no people" because the first evidence photo came back with
garbled pseudo-lettering on the binder spines (fixed by cropping to 1080x1440).

**OG filename is deliberate.** The original spec said
`images/og/expert-witness.jpg`, but `Base.astro` only emits
`og:image:width`/`height` for files matching `images/og-*.jpg`. Following the
spec literally would have silently dropped those tags. Do not rename it.

### Higgsfield API, hard-won

- The whole payload nests under a single `params` object:
  `generate_image({params: {model, prompt, aspect_ratio, resolution}})`.
- Top-level arrays get stringified by the tool interface, so
  `generate_image_batch` (wants a top-level `requests` array) and `jobs_wait`
  (wants `jobs`) are both unusable. Fire individual `generate_image` calls.
- Poll with `job_display({id})`. `show_generations` returns ~90KB and spills to
  a file.
- Starter plan caps at **4 concurrent jobs**. Queue in waves.

---

## 4. Gotchas that cost real time

**1. The Astro dev server serves stale CSS.** This happened twice, and both
times the built output was correct all along. Symptom: computed styles in the
browser do not match the source, edits appear to have no effect. A hard reload
and a cache-busting query string are both insufficient. The fix:

```bash
astro dev stop && rm -rf node_modules/.vite .astro/.vite
```

then restart. Before chasing any layout bug, run `npx astro build` and grep
`dist/` for the rule. If it is in `dist/` the source is fine and the dev server
is lying.

**2. The services mega panel.** Adding the 4th column needed the panel widened
720 -> 900px (four columns wrap "AI Business Services" and "Custom Styles &
Cards" below 840). But `.mega` is centred on its trigger (`left:50%` +
`translateX(-50%)` in global.css), so every extra 100px of panel hangs another
50px off the LEFT of the viewport. It ran 63px off-screen at 1100.

Fixed by giving the wrapper `studios--svc` and `position:static`, which anchors
the panel to `header.nav` instead of the trigger. That is the same trick
`.studios--dir` already uses for the wide directory panel. **That rule must live
in `global.css`, not in Nav.astro's scoped block**, because
`.studios{position:relative}` is declared in global.css and wins on source
order over a component style.

That fix then opened a 13px dead strip between the trigger's bottom edge and the
panel's top (top:100% now measures from the header, not the trigger), so the
hover dropped mid-travel. Fixed with `margin-top:-29px; padding-top:45px` on
`.mega--services`: the negative margin pulls the hover box up to overlap the
trigger by 8px, the padding holds the visible panel where it was. Below 980px
the panel drops to 560px and 2 columns so its left edge clears the viewport.

**3. Astro scoped styles do not cross into components.** The hero foot markup is
hand-rolled on the expert-witness page rather than using `HeroActions`, because
that component hardcodes its own button pair and link row. `.hero-foot`,
`.hero-links` and `.hero-links-sep` are scoped inside `HeroActions.astro`, so
only `.hero-btns` (which is global) reached the page. Those rules are now
duplicated in the page's scoped block. Keep the two in sync if HeroActions'
hero foot is ever retuned.

---

## 5. Verification state

Build clean, 148 pages. On the new page: exactly one `<h1>`; claim scan 0 hits;
kill-list 0 hits in copy; 11 card images all with real alt text, width/height
and `loading="lazy"`; JSON-LD parses with both nodes and zero FAQ questions
missing from the visible HTML; page present in `dist/sitemap-0.xml`; GA4
`G-SW3VF5PBDT` present; `og:image:width`/`height` emitting. Link check across 8
pages: 442 internal refs, 0 broken. Card art holds 3:2 at 1280 and 375 with no
horizontal scroll. Nav panel verified at 1280 / 1100 / 960: 4 columns down to
980 then 2, no label wrapping, panel fully on-screen, 8px hover overlap.

Em dash scan: the only hits in the rendered page are inside JS comments in
`Base.astro`'s reveal script, present on every page including untouched ones.
The ban excludes code.

---

## 6. Not done

1. **`docs/DECISIONS.md` was never updated.** The original handoff said to log
   every judgment call there. The decisions are in section 7 below; they need
   writing into that file.
2. **`docs/SESSION_SUMMARY.md` was never updated.** Session 5 of the original
   handoff asked for a dated block.
3. **Nothing committed or pushed.** See section 8.
4. **The CV and rate sheet** the page promises do not exist. The page says a
   full CV goes out with the engagement letter and the rate sheet goes out the
   same day. Both need building before this goes live. The CV needs an honest
   testimony-history section reading "none to date".
5. **`26_09_22_lws_email_writing_service_page_handoff.md`** appeared untracked
   at the repo root during this session. Not started.

---

## 7. Decisions made, for DECISIONS.md

- `2026-09-22` OG card named `og-expert-witness.jpg` not `og/expert-witness.jpg`.
  Why: `Base.astro`'s `ogIsCard` regex only matches `images/og-*.jpg`, so the
  spec's path would have dropped the og:image dimension tags.
- `2026-09-22` LEGAL is its own 4th nav column, not a 4th BRAND link. Why: the
  expert witness practice sells to attorneys, not to the small businesses the
  other twelve links serve. Under BRAND it reads as a design service.
- `2026-09-22` Services mega panel widened 720 -> 900 and anchored to the header.
  Why: see Gotchas #2.
- `2026-09-22` Page keeps "Twenty-Two Years" (correct from 2004).
  `about.astro` and `seo.astro` both say 23. **Unresolved, Jon's call.** The
  other two pages were left untouched.
- `2026-09-22` Hero uses a still `PhotoBg`, not `VideoBg`, and scrim `hero` not
  `strong`. Why: every other service page runs video; legal buyers read. Scrim
  lightened so the hologram reads, since the copy sits in its own glass panel.
- `2026-09-22` FAQ accordion markup, styles and script duplicated from
  `faq.astro` rather than extracted to a shared component. Why: that page keeps
  its pattern page-scoped, and extracting it would have meant refactoring a
  working page. Heading level differs (h3 here, h2 there). Keep in sync.
- `2026-09-22` Band card opacity overridden scoped to `.lbs-card`, not on the
  global `.glass-inner`. Why: `.glass-inner` is correct for the dark main site;
  only the amber band pages needed it.

---

## 8. Git state

HEAD is `89f6a1c`. Nothing from this session is committed.

**Three files were already staged before this session started and are not
mine:** `src/components/CrookedSign.astro` (new), `src/components/Footer.astro`,
`src/components/HeroActions.astro`. That is the finished crooked gold
"Musicians/Bands... click here" sign feature. `Footer.astro` shows `MM` because
that staged work plus my unstaged Services-column line are both present. They
are separable. Confirm with Jon before committing his staged work alongside the
expert witness build.

**One finding in that staged work:** `CrookedSign.astro` line 28 renders "click
here", which the global kill-list bans outright, and it renders on all 148 pages
via the Footer. Left alone because it is clearly a deliberate design choice and
it is Jon's uncommitted work. "Musicians/Bands -> this way" would clear the rule.

New untracked files to add: `src/pages/services/expert-witness.astro`,
`src/components/ReceiverCta.astro`, and 15 JPGs under `public/images/`
(`expert-witness-*` and `og-expert-witness.jpg`).

Modified: `.gitignore`, `public/_redirects`, `src/components/BandSeoCards.astro`,
`src/components/Nav.astro`, `src/pages/about.astro`, `src/pages/faq.astro`,
`src/pages/industries/law-firm.astro`,
`src/pages/live-band-web-studios/pricing.astro`, `src/pages/services.astro`,
`src/pages/services/seo.astro`, `src/styles/global.css`.

---

## 9. Commands

```bash
cd ~/Desktop/local_files/website-clients/livewebstudios-v3
npx astro build
```

Dev server runs on port 4323 via the `astro-dev` entry in `.claude/launch.json`.
Start it with the preview tooling, not Bash. Local URL:
`http://localhost:4323/services/expert-witness`.

Claim scan, run this before shipping any edit to the page:

```bash
grep -oiE "testified|testimony experience|cases won|clients say|trusted by|years of testimony|retained by over|track record" dist/services/expert-witness.html
```
