## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Section backgrounds: "the breathing grid"

When Jon says **"use the breathing grid for this section"** (or "breathing grid", "the grid background", "the dot grid"), he means `src/components/BreathingGrid.astro`. Do exactly this and nothing more:

1. Import it in the page frontmatter: `import BreathingGrid from "../components/BreathingGrid.astro";` (fix the `../` depth for the page's folder).
2. Add `has-bgrid` to the target `<section>`'s class list.
3. Put `<BreathingGrid />` as the **first child** of that section, before its `.wrap`.
4. If the section already has a background layer (`<AiVideoBg>`, `<VideoBg>`, `<PhotoBg>`, a canvas), **replace** it: remove that component and its `has-videobg` / `has-photobg` class. One background per section.
5. Check it renders: the canvas inside `[data-bgrid]` has non-zero size and there is no Vite error overlay.

Props (all optional; the defaults are right for a left-aligned hero):

| Prop | Values | Default | Use when |
|---|---|---|---|
| `chevrons` | `"right"` `"center"` `"none"` | `"right"` | `"center"` for centered copy; `"none"` for busy or text-heavy sections |
| `quiet` | `"left"` `"right"` `"none"` | `"left"` | the side that holds the copy; dots fade toward it |
| `density` | `"sparse"` `"normal"` `"dense"` | `"normal"` | `"sparse"` behind long text |
| `scrim` | `"none"` `"soft"` `"strong"` | `"soft"` | `"strong"` behind forms or long paragraphs |
| `interactive` | boolean | `true` | `false` for short bands where cursor glow distracts |
| `cycle` | seconds between pulses | `6.5` | rarely changed |

Colour is automatic: `--bgrid-accent` if a section sets it, otherwise Live AI orange (`--ai`) inside `.theme-live-ai`, otherwise the sitewide `--cyan`. Never hard-code a colour in the component call.

Rules: no more than **two** breathing grids per page; don't put it behind a section that already has a video; it already handles reduced motion, offscreen pause and DPR, so add no extra JS. Log each use in DECISIONS.md.
