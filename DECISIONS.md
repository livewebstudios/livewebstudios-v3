# DECISIONS

One line per judgment call: date, decision, why.

## 2026-09-14 — Namesake live preview generator

- 2026-09-14 | Committed the pending Session 5/6 working tree as its own commit (677f721) before starting, rather than stashing or building on a dirty tree. | The handoff's first stop condition is a dirty `git status`. Jon answered "your choice". Committing is non-destructive, preserves the work, and keeps the Namesake diff isolated.
- 2026-09-14 | Chip chrome and modal accent use the existing global `--brass` (#C9A55A) token. | The handoff says "the --brass rule the sub-nav already uses for is-active". That rule is `.subnav--namesake { --sub-accent: var(--brass) }` with `box-shadow: inset 0 -2px 0`. Reused verbatim, no new colors. Note the page's own `.theme-namesake` block separately overrides `--cyan` to a near-identical brass, so the two agree on screen.
- 2026-09-14 | All ten woff2 faces downloaded cleanly from google-webfonts-helper, latin subset. No fallbacks needed. | Sources and OFL licensing recorded in public/fonts/namesake/LICENSES.txt.

## 2026-09-14 - side requests during the Namesake run

- 2026-09-14 | Curtain reveal on the home page holds 1s after `.in` before the panels travel, via a new `--curtain-hold` token on `.curtain-stage`. | Jon: "delay this, its open before i scroll down, just a few seconds", then "split the delay, its too slow, cut it in half". The shared `.reveal` observer fires when the stage's TOP edge crosses 92% of the viewport, so the 1.5s open finished before the section was looked at. Held as a token rather than retuning the observer, which every other `.reveal` on the site depends on. Measured 1121ms from `.in` to panel travel.
- 2026-09-14 | Live Band card CTAs moved from `.btn-ghost` to `.btn-primary` and restate `background: var(--cyan)` / `color: var(--on-accent)`. | Jon: "make these buttons yellow branded color background with dark text (reverse)". Both colors have to be restated because mosa-skin.css re-skins `.btn-primary` site-wide to flat white and lands after global.css, so the `.theme-live-band` amber never reached the button on its own. Values still come from the theme's own tokens, so no fourth yellow enters the palette. Contrast 12.73:1.
- 2026-09-14 | Added `white-space: normal` to `.card-cta`. | `.btn` is `white-space: nowrap`, which pushed the longest label 9px past its card at 1280. Pre-existing, invisible on a ghost button, obvious under a solid fill.

## 2026-09-14 - Namesake Session 1

- 2026-09-14 | Island root is `display: contents` so one mount point supplies two grid items (`.nsp-controls` under the headline on the left, `.nsp-stage` spanning both rows on the right). | The handoff wants the card and the preview in different hero columns, which would otherwise need two islands and a shared store for one piece of state.
- 2026-09-14 | The hero grid places those two with DESCENDANT selectors, not child selectors. | `display: contents` removes `.nsp-root`'s box from layout but leaves it in the DOM tree, so it is still the direct child and `>` matches nothing. Written with `>` the rules silently no-op and all three items auto-place into the wrong cells. Cost one debugging round; noted here so it is not reintroduced.
- 2026-09-14 | Name font size is four bands per style on `data-nsp-len`, measured from the LONGEST RENDERED LINE rather than the whole string. | bold and warm set a name on two lines, so "Maximilian Featherstonehaugh III" must size off "Featherstonehaugh III" (21) and not 32. Verified across 4 styles x 4 names: zero text overflow.
- 2026-09-14 | The bold marquee derives its repeat count from name length instead of using a fixed one. | A fixed 8 repeats cannot do both jobs: it covers only 620 of the 1440 for "Al" (row reads half empty) and builds 5292px of clipped layout for a 32-character name. Now 3 to 19 repeats, every name covering the full width.
- 2026-09-14 | `.nsp-page` sets its own `text-align` and the four page bodies are `height: 100%`. | The live frame is a `<button>`, which the UA stylesheet centres, and the body elements were auto-height so their `flex: 1` middles had no free space to absorb. Both had to be fixed for the three renders (frame, modal, export host) to agree, which Session 2 depends on.
- 2026-09-14 | Scale is written as `--nsp-scale` through `element.style.setProperty`, the island's only style attribute. | Container width over 1440 is a runtime number that cannot live in a stylesheet. Passing it as a custom property keeps the CSS owning what it is used for. Frame height is reserved by `aspect-ratio: 16/10` rather than a measured pixel height, so nothing shifts before the fonts resolve.
- 2026-09-14 | Chip swatches and per-chip display faces are CSS rules keyed off `data-style`, not inline custom properties. | Keeps the no-inline-styles rule intact with 12 swatches and 4 type samples.
