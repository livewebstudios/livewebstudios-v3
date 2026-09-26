# Email Writing Page: Session Handoff

Point-in-time snapshot of the Claude Code session of 2026-09-22 on
`livewebstudios-v3`, picking up from
[26_09_22_expert_witness_session_handoff.md](26_09_22_expert_witness_session_handoff.md).
Covers the new `/services/email-writing` page and the design iterations Jon
drove on it live, plus two fixes that reach outside the page.

**Everything through the initial build is committed at `c362f63`. Everything
after that is uncommitted.** See "Git state".

---

## 1. What shipped, and where it landed

### /services/email-writing (new, committed in `c362f63`)

`src/pages/services/email-writing.astro`. Structure mirrored from
`services/expert-witness.astro`. Copy from Section 2 of
`26_09_22_lws_email_writing_service_page_handoff.md` at the repo root.

Six sections, in order: hero, THE PROBLEM, THE SIX VOICES, HOW IT RUNS, FAQ,
CTA. There is no FAQPage node: `/faq` owns the only one on the site, and a
second would compete with it for the same rich result. The `faqs` array feeds
the visible accordion and nothing else.

### Wiring (committed in `c362f63`)

| Where | What |
|---|---|
| `src/lib/navIcons.ts` | New `mail` glyph (envelope, 24x24 stroke, house rules) |
| `src/components/Nav.astro` | Fifth link in the AI services column, `#A78BFA` |
| `src/pages/services.astro` | Card in the AI & AUTOMATION group |
| `src/components/Footer.astro` | Services column, after Expert Witness (column is now 9 links) |

### Everything after `c362f63` is UNCOMMITTED

Jon iterated live. In order:

1. **Hero lede reframed.** "One for chasing money, one for saying no, one for
   bad news" became "One for proposals, one for checking in on an invoice, one
   for making an introduction." His note: "chasing money" is a bad connotation
   and the line led on the negative.
2. **Six voice examples cut to roughly half length.** The deck's `after` blocks
   ran three and four sentences, which defeats a card meant to be scanned.
3. **Four build steps got card art** and the row went 4-up (`.em-steps`), since
   four cards in the base 3-up `.grid-svc` stranded one alone on a second row.
4. **THE PROBLEM became a `.copy-points` bullet list**, 150 words down to 97.
5. **CTA got art** via the existing `.cta--art` two-column pattern.
6. **Ambient background**: `bg-blue-fog.mp4` behind THE SIX VOICES only.
7. **The FIT section ("Worth It If You Recognize Yourself Here") was cut**,
   along with its `fit` array. It restated THE PROBLEM.
8. **Six voice glyphs added**, head-in-profile with a per-voice emission.
9. **Icons, then titles, went brass.** See the colour note below.
10. **Card header flipped**: title hard left, glyph hard right.
11. **Envelope drift background** behind the two flat-black bands.
12. **Meta pass** on this page and on expert-witness.
13. **`.cta h2` line-height fixed in `global.css`.** Sitewide.

---

## 2. Two things that reach OUTSIDE this page

**`src/styles/global.css`, `.cta h2` now declares `line-height:1.12`.**
It never had one, so it inherited the BODY leading of 1.6 while every other
display heading on the site runs 1.12. Invisible for as long as the rule has
existed, because a CTA heading that fits on one line shows no symptom. The
two-line one on this page pulled 46px of dead air between the lines. **This
touches all 27 pages that use a `.cta` panel.** Single-line CTAs on /services
and /about were checked after: ratio 1.12, still inside the panel, no overflow.

**`src/pages/services/expert-witness.astro` description trimmed 190 -> 152.**
Google truncates around 155-160, so its "Plaintiff or defense" tail never
appeared in results. The phrase "website accessibility expert witness" is the
one worth ranking for and was kept intact at the front.

---

## 3. Colour, and the trap under it

The voice glyphs and the voice card titles are `var(--brass)` (#C9A55A), and
the FAQ envelope drift follows them. Jon landed there after rejecting an AI
violet pass. Brass is right here because **the page already ran it**:
`.step-num` on the four build cards is `var(--brass)`, so gold reads as one
deliberate accent down the page. `--amber` means Live Band Web Studios
site-wide and `--cat-gold` means a blog category, so neither was available.

**THE TRAP, and it will bite again.** `mosa-skin.css` lines 63-66 redefine the
four ink tokens as white-alpha:

```
--ink-soft : rgb(255 255 255)
--ink      : rgb(255 255 255 / .85)
--muted    : rgb(255 255 255 / .74)
--muted-2  : rgb(255 255 255 / .58)
```

The hex values in `global.css`'s `:root` are NOT what ships. A first pass here
picked `--muted` over `--muted-2` for the de-emphasised "before" text on a
contrast calculation done against the `:root` hexes, and that calculation was
wrong. Measured against the rendered card ground (which composites to
rgb(3,3,3)): `--muted-2` is 6.9:1 and `--ink` is 14.6:1. **Measure against the
skin, never against `:root`.**

---

## 4. Gotchas that cost real time

**1. The Astro dev server serves stale CSS. Third time this has bitten.**
Symptom: computed styles in the browser do not match source, new scoped rules
are simply absent from the served stylesheet. Confirm by grepping `dist/` for
the rule; if it is there, the source is fine and the dev server is lying.

There is a second half to this that cost a round trip: **the fix command must
run from the project directory.** Run from `~` it installs a stray global
astro, reports "No dev server is running", and clears nothing.

```bash
cd ~/Desktop/local_files/website-clients/livewebstudios-v3 && npx astro dev stop && rm -rf node_modules/.vite .astro/.vite
```

The reliable alternative, and what this session used: the `dist-preview` entry
already in `.claude/launch.json` serves the built output on **8901**. Port 4323
may belong to another session, in which case `preview_stop` cannot stop it.

**2. Four separate ways to mis-grep the built HTML.** All of these produced a
false "it is missing" during this session:
- The minifier rewrites `:nth-child(1)` to `:first-child`.
- It adds the scope attribute to child selectors too, so
  `.em-drift svg:nth-child(2)` ships as
  `.em-drift[data-astro-cid-x] svg[data-astro-cid-x]:nth-child(2)`.
- Astro emits `class` AFTER `style` and `href`, so any regex assuming
  `<a class="..."` first will match nothing.
- `grep -c` counts LINES, and built HTML is one long line, so it reports 1 for
  44 occurrences.

**3. The Browser pane stops compositing when it is hidden**, and every
screenshot comes back solid black with no error until a batch surfaces
"the Browser pane is not displayed". DOM measurement via `javascript_tool` is
authoritative and kept working throughout. Do not chase a rendering bug that is
actually a capture failure.

**4. `Base.astro`'s `ogIsCard` regex is `/\/images\/og-[a-z-]+\.jpg$/`.**
An OG image not matching that silently drops the `og:image:width` and `height`
tags. Same trap the expert-witness build hit. The card here is
`images/og-email-writing.jpg`, which matches. Do not rename it.

**5. Higgsfield `generate_image` failed twice** on the wide OG card, credits
refunded automatically both times. Rather than spend a third, the card was
cropped from the 1024x688 original still in the session scratchpad: crop to
1024x538 for the 1.905 ratio, then up to 1200x630. That is a 1.17x scale
instead of the 1.33x that cropping the shipped 900px version would have needed.

---

## 5. Tuned values, so nobody re-derives them

| Thing | Value | Why |
|---|---|---|
| Envelope drift opacity | `0.22` desktop, `0.17` under 900px | 0.05 then 0.13 were both effectively invisible: brass at 5% over the page ground composites to about rgb(15,15,15) against rgb(5,7,11), ten steps out of 255. Jon asked three times whether it was rendering. It was. |
| Envelope stroke | `1.7` | At 24 to 72px, 1.4 hid them as much as the opacity did |
| Envelope count / timing | 8 per field, 61 to 107s, three drift tracks | No two durations share a common multiple, so the field never visibly resynchronises |
| Envelope placement | under 22% or over 80% horizontally | Weighted into the gutters, away from the 780px accordion column. NOT guaranteed: percentages against a fixed max-width column means which ones clear it moves with viewport. The accordion panels are opaque, so any that drift behind one are covered. |
| Step grid | 4 / 2 / 1 at 1180 and 900 | The 900px rule restates the collapse because the scoped selector outranks global's `.grid-svc` |
| `.em-prose` | `max-width: 680px` | No standalone prose class exists; `.copy` only gets its type treatment inside `.split` |

---

## 6. Verification state

Build clean, 149 pages. On the new page: exactly one `<h1>`; 89 relative refs,
0 broken, 0 root-relative; JSON-LD parses as `WebPage` + `Service` with no
FAQPage; the JSON-LD description matches the meta description exactly; page in
`dist/sitemap-0.xml`; GA4 `G-SW3VF5PBDT` present; `og:image:width`/`height`
emitting off the new card. No horizontal scroll at 375. relPrefix depth correct
from all four test depths (`index`, `services`, `services/seo`,
`live-band-web-studios/forms`).

**Kill-list**: zero page-origin hits. Two hits exist on the built page and are
sitewide footer chrome, identical on untouched pages:
- `click here` is `CrookedSign.astro` line 28, Jon's own deliberate design copy,
  flagged for his decision since the expert-witness session and still open.
- `submit` is `type="submit"` on the newsletter button, whose visible label is
  "Subscribe". A required HTML attribute, not visible text.

**Em dash**: 2 on the page, identical count on `dist/index.html`. Both are
inside `Base.astro`'s reveal-script JS comments (lines 192, 241). The ban
excludes code.

---

## 7. Decisions

All logged in [DECISIONS.md](DECISIONS.md) under the 2026-09-22 headings. That
file is the authority; this section is not a duplicate of it.

---

## 8. Not done

1. **Nothing since `c362f63` is committed.** See section 9.
2. **The Opener voice example** still reads aggressive for a public page
   ("Your contact form has been broken since June"). The original content
   handoff flagged it as Jon's call. Still his call.
3. **The forms page CTAs.** A pass putting the `ReceiverCta` meter buttons on
   `/live-band-web-studios/forms` and the band home page was built and then
   **reverted in full** at Jon's direction ("the buttons are too big, turn them
   back to gold"). All three files are back at `HEAD` with zero diff. The band
   home is gold again; the forms page came back to its original white/ghost
   `.btn` pair, which is what it was, not gold. If Jon wants those gold it is
   one class: `class={f.primary ? "btn btn-primary card-cta" : "btn btn-ghost"}`.
4. **`ReceiverCta` button/modal mode was reverted with it.** If the meters are
   ever wanted on modal triggers again, the approach that worked was an optional
   `modal` prop plus a dynamic `Tag` (`button` when set, `a` otherwise), with UA
   button styles reset on `.rcta`. The modal binder is the attribute selector
   `[data-modal-open]` and prefixes `modal-`, so dropping `.btn` breaks nothing.
5. **Carried over from the expert-witness session, still open:** the CV and rate
   sheet that `/services/expert-witness` promises do not exist. The CV needs an
   honest testimony-history section reading "none to date".
6. **`26_09_22_lws_email_writing_service_page_handoff.md` is still at the repo
   root**, untracked and now spent. It was committed in `c362f63`. Worth moving
   under `docs/` with the others.

---

## 9. Git state

HEAD is `c362f63`. The working tree carries the whole post-build iteration:

```
 M docs/DECISIONS.md
 M src/pages/services/email-writing.astro      (+430 -70)
 M src/pages/services/expert-witness.astro     (description only)
 M src/styles/global.css                       (.cta h2 line-height, SITEWIDE)
?? public/images/email-cta-draft.jpg
?? public/images/email-step-1-sent.jpg
?? public/images/email-step-2-pick.jpg
?? public/images/email-step-3-build.jpg
?? public/images/email-step-4-keep.jpg
?? public/images/og-email-writing.jpg          (440K for the six)
```

Nothing pushed. `c362f63` itself is local only and is wider than its subject
line: it swept in the whole expert-witness build and Jon's CrookedSign feature,
because `Nav.astro`, `services.astro` and `Footer.astro` each carried changes
from both and `Footer.astro` imports `CrookedSign.astro`. Its body spells this
out. `git reset --soft HEAD~1` if a different split is ever wanted.

Suggested commit for the outstanding work:

```bash
git add -A && git commit -m "Email writing page: art, gold voice icons, envelope drift, meta and OG card; fix .cta h2 leading; trim expert-witness description"
```

---

## 10. Commands

```bash
cd ~/Desktop/local_files/website-clients/livewebstudios-v3
npm run build
```

Preview the BUILT output (reliable, and what this session used):
`dist-preview` in `.claude/launch.json`, port **8901**, via the preview tooling
rather than Bash. The `astro-dev` entry on 4323 may belong to another session.

Standard checks for any edit to this page:

```bash
grep -c "<h1" dist/services/email-writing.html                                  # must be 1
grep -oiE "learn more|click here|submit|free consultation" dist/services/email-writing.html
python3 -c "import json,re;h=open('dist/services/email-writing.html').read();print([n['@type'] for n in json.loads(re.search(r'ld\+json[^>]*>(.*?)</script>',h,re.S).group(1))])"
```
