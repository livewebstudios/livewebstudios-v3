# LWS v3: Session Handoff, 2026-09-02

Point-in-time snapshot of the `feat/hero-video-and-card-art` branch. One commit is
pushed; a second, larger body of work is finished and verified but **uncommitted**.
This document covers what landed, what is still open, and the environment traps that
cost real time this session so the next session does not rediscover them.

Repo: `C:\Users\drfre\Desktop\local_project\clients\livewebstudios-v3`
Astro 7, `build: { format: 'file', inlineStylesheets: 'always' }`, output to `dist/`.

---

## Git state

| | |
|---|---|
| Working branch | `feat/hero-video-and-card-art` |
| Pushed commit | `caa7fd5` |
| `origin/main` | `c37ecfc`, **untouched** |
| Uncommitted files | **34** |

Jon pulled `main` on his MacBook and saw nothing, because the work is on the branch.
To pick it up:

```bash
git fetch origin && git checkout feat/hero-video-and-card-art
```

Jon was offered a fast-forward merge into `main` and has not answered. Do not merge
without asking.

### Abandoned parallel branch

`origin/feat/lens-refraction` (`942fbaf`) is a **separate, divergent** implementation of
the card scan effect, built on the MacBook. It holds the SVG band overlay, `--scan-y`,
`--scan-violet`, `--scan-amber`, gutter masking on `.scan-bar`, and the 9s/0.3s timing.

Jon's spec for the current scan work referenced symbols from that branch that did not
exist here. He was shown the fork and chose: **build on `feat/hero-video-and-card-art`,
port the controller across, abandon `feat/lens-refraction`.** The `--scan-y` controller
and 9s/0.3s timing were ported. `--scan-violet` and `--scan-amber` were deliberately
not.

Do not merge `feat/lens-refraction`. It conflicts heavily in `ScanLines.astro` and
`ServiceCard.astro`, and its approach was explicitly replaced.

---

## What is in the pushed commit (`caa7fd5`)

- Hero video scrim lightened, `.hero::before` fade start moved 55% to 72%
- Hero link row boxed
- Home service cards moved to carbon art via a new `art="metal"` ServiceCard variant
- `favicxon.png` set as the favicon
- Three video-bg CTA sections boxed (blog, blog post, faq)
- A canvas-based per-frame lens band, **since reverted, see below**

---

## What is uncommitted (34 files)

All of it builds clean (72 pages) and was verified in the browser.

### 1. Scan band: canvas lens reverted, replaced with proximity reaction

Jon's instruction: *"Revert the in-card refraction entirely. The card reacts, the line
does not distort."*

Deleted: the `<canvas class="card-lens">`, all per-frame band geometry, the dispersion
fringes, the caustic glow.

`ScanLines.astro` now runs one rAF loop publishing `--scan-y` on the section, sweep
9000ms + 300ms dark gap, and per card:

```
d = clamp(1 - |scanY - c| / (h * 0.75), 0, 1)     c = card centre, h = card height
```

Cards receive `--d`, `--rim-t`, `--rim-b`. `ServiceCard.astro` reacts through
`border-top-color` / `border-bottom-color` (`color-mix` toward `--scan-cyan`, opacity
`d * 0.8`) and a `box-shadow` whose blur and spread scale with `d` (max 8px / 2px,
`--scan-cyan-deep` at 25%).

Rim leads on the approaching edge: `0.5 ± 0.5 * sgn` split, so the top border carries
it above centre and the bottom below, without either dropping out as the line crosses.

`--scan-cyan: #35c8ff` and `--scan-cyan-deep: #0099cc` were **added** to `global.css`;
they did not exist on this branch.

Measured off live canvas pixels before the revert (kept for reference):

| u | thickness | bow | peak alpha |
|---|---|---|---|
| -0.8 | 36px | -30 up | 0.53 |
| 0.0 | 88px | 0 straight | 1.00 |
| +0.8 | 36px | +30 down | 0.53 |

### 2. ScanLines rolled out to 35 sections across 24 files

Every card-grid section on the services and industries pages now carries
`<ScanLines />` + `has-scan`.

`.has-scan` CSS was **promoted from two page-local `<style>` blocks**
(`index.astro`, `services.astro`) into `global.css`. It was duplicated and scoped, so it
would not have worked on any other page.

**Applied additively.** 20 of those 35 sections already had a `VideoBg`. ScanLines is
inserted *after* VideoBg in the DOM so the bar and grid read over the video (both paint
at `z-index: 0`, DOM order decides). Jon said the scan line "should be the bg" of those
sections, which may mean the videos should come out. **This is unresolved, see Open
Questions.**

Scoped to services + industries only. `grid-svc` also appears on live-band (7),
namesake (4), ecosystem (3), and about's "Four Reasons", all deliberately left alone.

### 3. Hero glass panel on 28 pages

`.page-head--glass` added to work, about, contact, services + all 13 service pages,
industries + all 10 industry pages. Rule lives in `mosa-skin.css`, matching the
"Every site we launch" panel: `blur(30px) saturate(210%) brightness(1.2) contrast(1.12)`
over `rgb(var(--mosa-fg-rgb)/.05)`, 20% white border, `var(--r-lg)` radius.

**18 other `page-head` heroes deliberately left plain**: blog, blog post, faq, namesake
x3, live-band x7, ecosystem x2, newsletter, thank-you, 404. Identical markup, one word
from inclusion. Jon named specific groups and the change was held to them.

### 4. jon-desk.jpg as section background

Home "I'm a web guy." and About "Two Decades. One Conviction." First built as a framed
image on the right; Jon then asked for it as the section background instead, so the
framed version and its `.portrait--photo` CSS were removed entirely.

`.sec-photobg` in `global.css`. The image URL is set **per page** as an inline
`--sec-photo` on the section, not in the stylesheet:

```html
<section class="sec-pad is-alt sec-photobg" style="--sec-photo:url('images/jon-desk.jpg')">
```

Reason: stylesheets are inlined into every page at every depth, so a `url()` written in
the CSS would resolve against whichever page it landed in and break on nested ones.
This keeps each page's own relative path correct, per the LWS path rule.

Scrim is a horizontal ramp (95% black under the copy, opening to 38% right) because the
photo is dark left and carries Jon and the monitor on the right. Under 900px it goes
flat at 88%, since the copy sits over the whole frame when stacked.

**On About this required reordering the columns.** The glass block was first (left); the
copy was moved above it so the photo lands right.

### 5. Home CTA merged

"Ready to talk about your site?" section deleted (0 occurrences in built HTML). Its
`Let's Talk →` / `732.801.9611` pair moved inside the "Every site we launch" panel.
`id="contact"` moved with the buttons. Added
`.feature .hero-btns{justify-content:center}` so they centre with that panel instead of
inheriting the global `flex-start`.

### 6. Metal card text bubbles made opaque

Jon: *"no transparency at all."* `.card--art-metal` h3/p bubbles went from
`rgba(5,7,11,.78)` + `blur(10px)` to solid `rgb(5,7,11)`, blur off. The carbon weave was
reading through the titles. **Metal only**, so `/services` cloud cards keep translucent
bubbles.

---

## Do this first

`public/images/jon-desk.jpg` is **modified in the working tree**. Jon replaced the file
on disk after it was committed:

| | committed (`caa7fd5`) | working copy |
|---|---|---|
| size | 375,920 bytes | 200,663 bytes |
| dimensions | 1768 x 1000 | 1768 x 1000 |

Dimensions match, so the `.sec-photobg` scrim ramp still holds. The working copy is the
one Jon wants. It must go into the next commit.

---

## Open questions, all waiting on Jon

1. **Drop the videos on the 20 scan sections that have both?** He said the scan line
   "should be the bg" of card sections. Additive was chosen as the reversible reading.
   One line in the rollout script either way.
2. **Extend the hero glass to the remaining 18 `page-head` heroes?**
3. **Extend ScanLines to the live-band / namesake / ecosystem / about card grids?**
4. **Merge the branch into `main`?** He was pulling `main` on the MacBook and getting
   nothing. Fast-forward, no conflicts.
5. `work.astro:68` heading left unboxed on purpose during the CTA-box pass. It is a
   section head followed by the work-card grid, and boxing it would wrap the grid.

## Known issues, not addressed

- **`bg-blue-fog.mp4` is stretched.** Carries `pasp 16:15` and matching SPS SAR, so it is
  coded 1920x1080 but signalled to display at 2048x1080: stretched 6.7% horizontally and
  resampled every frame. Footer background on **every page**, plus the hero on
  financial-services and nonprofit. Pure metadata bug, fixable without re-encoding.
- **`bg-corner.mp4` has no color tags at all.** No `colr` box, no `video_signal_type` in
  the SPS VUI, so Chrome and a native player may pick different YUV to RGB matrices.
  Hero on 404, blog, work, dental, law-firm, forms; default section bg on a dozen more.
- **The rim reaction only fires on home and `/services`.** Those use `ServiceCard`
  (`.card--bg`), which the proximity code targets. Industry and service-detail pages use
  plain `.card` markup, so they get the bar and CRT grid but no rim brightening or lift.
- **`#lws-glass-line` in `Base.astro:86` is dead.** Nothing references it since the canvas
  band was removed. Left in place because removing it was not requested.
- **`.scan-lines` CRT texture is 2% alpha** and effectively invisible on a near-black
  ground. Original behaviour, not a regression. Jon said "still not seeing scan lines"
  more than once; the bar and rim do work, but this texture does not read.
- **`.card--bg` carries `transition: border-color 0.3s`**, so the rim lags the sweep by
  0.3s. Works, but it also makes `getComputedStyle` reads stale, which cost real
  debugging time.

---

## Environment traps, all hit this session

**The Browser pane is unreliable for anything animated or below the fold.**

- `requestAnimationFrame` does not tick (measured: 0 ticks in 500ms)
- `IntersectionObserver` callbacks never fire, so lazy `VideoBg` never attaches its `src`
- Screenshots return **solid black at any `scrollY > 0`**

Workarounds that do work:

```js
// force a lazy video to load
const v = document.querySelector('.videobg__v');
v.setAttribute('src', v.dataset.src); v.load();

// stop a running rAF loop so a frame can be pinned
window.requestAnimationFrame = function () { return 0; };

// bring a below-fold section to the top so the pane can capture it
let n = section.previousElementSibling;
while (n) { n.style.display = 'none'; n = n.previousElementSibling; }
document.querySelectorAll('header.nav').forEach(e => e.style.display = 'none');
scrollTo(0, 0);
```

**The dev server serves stale CSS after a component rewrite.** Symptom: new JS runs but
old styles apply (e.g. `.scan-bar` still animating `top` with `animation-name: scanDown`
instead of using `transform: translate3d(0, var(--scan-y), 0)`). A hard reload is not
enough. Fix:

```bash
rm -rf node_modules/.vite .astro/cache
```

then stop and restart the dev server.

**The Bash tool mangles backslashes**, even inside a quoted heredoc: `\\` collapses to
`\`, which breaks any regex with escapes. Two scripted edits failed on this. Write
scripts with the Write tool instead, and prefer plain string matching (`indexOf` /
`lastIndexOf`) over regex.

**Source files are CRLF.** Node edit scripts must detect and preserve the line ending:

```js
const nl = src.indexOf("\r\n") >= 0 ? "\r\n" : "\n";
```

**Anchor scripted edits on unique text, not on the first match of a structural
selector.** A first attempt anchored on the first `has-videobg` in each file and hit the
page-head hero instead of the target CTA section.

**`astro dev` refuses to start if one is already running** ("Another astro dev server is
already running"). Check before starting.

---

## Verification commands

```bash
npm run build
```

```bash
grep -rlo 'class="page-head page-head--glass has-videobg"' dist --include=*.html | wc -l
```

Expect 28.

```bash
grep -rn 'src="/\|href="/' src/pages/ src/components/
```

Path rule: must return nothing. All internal asset references stay relative.
`<link rel="canonical">` is the only place an absolute internal URL is correct.

---

## Reference

A full forensic report on the hero video diagnosis (the elimination table, the overlay
stack diagram, the file specs, the two video asset bugs) is published at:

https://claude.ai/code/artifact/746d7fe5-bc4c-4923-a7ad-2b2823bcf5d4
