# DECISIONS.md

Judgment calls made while finishing LWS v3. One line each: date, decision, why.

## 2026-09-11, Session 0
- 2026-09-11 | Merged `merge/lens-refraction-to-main` into `main` with zero conflicts | Clean three-way merge, no resolution needed, so the "resolve in favor of lens-refraction" rule never fired.
- 2026-09-11 | Left the main nav in Title Case | The global LWS rule says nav text is ALL CAPS, but the handoff states Title Case (Jon 2026-08-15) and the scope lock forbids changes not explicitly requested. Session 1 only specifies sub-nav labels. Flagged for Jon to settle separately.
- 2026-09-11 | Kept the handoff markdown file untracked at the repo root | It is a working document, not site source.

## 2026-09-11, Session 1
- 2026-09-11 | Set `--nav-h: 85px` in global.css `:root` rather than per breakpoint | Measured header.nav at both 1280 and 375: it is 85px at each (`.nav-in` 84px from mosa-skin.css line 262, which overrides global.css's 72px, plus the 1px border-bottom). No breakpoint split needed.
- 2026-09-11 | Widened the `[data-dd]` toggle query from `header.querySelectorAll` to `document.querySelectorAll` | The sub-brand bar renders outside `<header>`, so the existing handler could not see it. One-word change reuses the single toggle system instead of adding a second.
- 2026-09-11 | Sub-nav accent driven by a `.subnav--{ctx}` modifier setting `--sub-accent` | Cleaner than sibling-combinator selectors off the brand element, and keeps amber/brass to the existing palette tokens.
- 2026-09-11 | Overrode the global `@media (max-width:900px) .mega{position:static;visibility:visible}` rule for `.subnav-drop` only | That rule exists so mega panels render inline inside the burger menu. The sub-nav has no burger, so it pinned the Forms panel open and pushed the bar to 309px tall. Scoped override keeps it absolute and closed until tapped; bar is now 117px at 375.

## 2026-09-11, Session 2
- 2026-09-11 | Used the real publish dates for the three "orphan" posts instead of the handoff's placeholders | The handoff said they carry no publish date. They do: each one's `.article-meta` block states it. ai-didnt-replace-us = March 12 2026, what-should-seo-cost = February 18 2026, why-we-left-wordpress = April 7 2026. Real dates beat placeholders, so filenames are 2026-03-12-, 2026-02-18-, 2026-04-07-.
- 2026-09-11 | Dated lets-talk-about-styles 2026-08-10, not the handoff's 2026-09-12 | The stated reason for 09-12 was "what the live blog index shows", but the post does not appear in `build/blog/index.html` at all. The page's own JSON-LD (`datePublished":"2026-08-10"`) and its visible byline (August 10, 2026) agree on August 10.
- 2026-09-11 | Post titles taken from each file's `<title>` minus the " | Live Web Studios" suffix | Per the handoff, and it reproduces the live `<title>` exactly, since `[slug].astro` re-appends the suffix. The live `<h1>` is longer on some posts (e.g. "AI Didn't Replace Our Agency. It Made Us Better at It.") so the H1 is now the shorter form.
- 2026-09-11 | Dropped the decorative Clutch rating badge image from the three converted posts | It is site chrome, not article content, and it was being picked up as the frontmatter hero image. The real hero (servicesindustries/blog3-5.webp) is used instead.
- 2026-09-11 | New posts use root-relative body links (/services/..., /contact, /blog/...) with no .html suffix | Matches the root-relative form Session 2D produces for blog links. The 21 pre-existing posts keep their absolute https://livewebstudios.com/services/*.html links, which the handoff did not ask to change.
- 2026-09-11 | 34 `post.html?post=` links replaced across 18 files, not the 5 the audit predicted | Every dated post cross-links its siblings. All 34 targets resolve to real slugs.
- 2026-09-11 | Client form pages build to forms/dumpster-diaper.html and forms/manual-therapy.html, not folder/index.html | `build.format: 'file'` flattens a folder index.astro. Netlify serves /forms/dumpster-diaper from it; the trailing-slash form gets a redirect rule in Session 3.
- 2026-09-11 | Removed the ?sent=1 success banner and its script from contact.astro | The handoff allows removal when nothing depends on it, and nothing did once `_next` moved to /thank-you.
- 2026-09-11 | The Dumpster Diaper form markup is carried over verbatim (132 fields) with the live CSS scoped under .discovery-wrap | The live stylesheet's token names are remapped to v3 palette tokens in one block at the top, so no ported rule needed editing and no field name= attribute changed.
