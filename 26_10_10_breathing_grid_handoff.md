# Claude Code Handoff: The Breathing Grid

## What it is

`src/components/BreathingGrid.astro` is a reusable section background. It's an equilateral dot lattice that breathes in a slow wave. Every 6.5 seconds an accent pulse ripples out and traces the three ››› chevrons. Dots near the cursor glow. It's plain canvas: no library, no video file, about 4 KB.

**Live now on:**
- `/ai/start` hero
- `/ai/how-it-works` hero (replaced the old "lines" video)

The usage rule is in `AGENTS.md` (which `CLAUDE.md` points to), so Claude Code loads it automatically.

---

## How Jon uses it

Say any of these in Claude Code:

> Use the breathing grid for this section.

> Use the breathing grid behind the FAQ on /ai/proof, centered chevrons.

> Breathing grid on the services band, no chevrons, strong scrim.

---

## What Claude Code does

1. Import the component in the page frontmatter (fix the `../` depth for the page's folder):
   `import BreathingGrid from "../components/BreathingGrid.astro";`
2. Add `has-bgrid` to the section's class list.
3. Put `<BreathingGrid />` in as the section's first child, before `.wrap`.
4. If the section already has a background (`AiVideoBg`, `VideoBg`, `PhotoBg`, a canvas), remove it along with its `has-videobg` or `has-photobg` class. A section gets one background.
5. Check that it renders: the `[data-bgrid]` canvas has a size and there's no Vite error overlay.
6. Add a line to DECISIONS.md.

```astro
<section class="sec-pad has-bgrid">
  <BreathingGrid chevrons="center" quiet="none" />
  <div class="wrap">...</div>
</section>
```

---

## Props

| Prop | Values | Default | When to change it |
|---|---|---|---|
| `chevrons` | `right` · `center` · `none` | `right` | `center` for centered copy. `none` for busy or text-heavy bands. |
| `quiet` | `left` · `right` · `none` | `left` | The side the copy sits on. Dots fade toward that side. |
| `density` | `sparse` · `normal` · `dense` | `normal` | `sparse` behind long text. |
| `scrim` | `none` · `soft` · `strong` | `soft` | `strong` behind forms or long paragraphs. |
| `interactive` | `true` · `false` | `true` | `false` on short bands. |
| `cycle` | seconds | `6.5` | Rarely changed. |

**Colour is automatic.** It uses `--bgrid-accent` if the section sets one. Otherwise it's orange (`--ai`) inside `.theme-live-ai` and cyan (`--cyan`) everywhere else. To force a colour on one section, set it in that section's stylesheet:

```css
.my-section{--bgrid-accent:#E8650A}
```

---

## Built in

- Visitors whose device asks for reduced motion get one still frame, caught mid-pulse.
- It pauses when the section scrolls off screen or the tab is hidden.
- Pixel density is capped at 1.5×.
- It's `aria-hidden`, has pointer-events off, and causes no layout shift.

## Rules

- No more than two breathing grids on one page.
- Never put it on a section that also has a video.
- Never add JavaScript to drive it. The component handles everything.

---

## Also done tonight (2026-10-10)

- **`/ai` hero:** now the Firefly Meadow loop (`public/videos/ai/ai-hero*`). The old files are in `_restore/26_10_10_ai-hero-prev/`.
- **`Base.astro`:** new optional `ogTitle` and `ogDescription` props. Every other page is unchanged.
- **Parked loops** (encoded, not yet live), in `Claude outputs/26_10_10_hero_loops/`:
  - `ai-services.*` (Main Street v2). The bookstore sign is AI gibberish ("ARCHITECTURE CHURNY"); fix it in post before it goes live.
  - `ai-how.*` (Night Shift)
  - `ai-dawn.*` (dawn workshop)
- **Nothing is committed.** Another Claude session was editing `src/pages/ai/start.astro` at the same time. Review the whole page before you commit.
