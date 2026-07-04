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

_(populated during 2D)_

---

## SESSION 2E — Decap CMS blog

_(populated during 2E)_
