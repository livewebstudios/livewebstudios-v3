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
