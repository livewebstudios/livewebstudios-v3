# Namesake Preview Generator. Claude Code Handoff, 2026-09-14

Paste the **PROMPT** block (Section 2) into Claude Code from the v3 repo root. Section 1 is the brief that produced it; leave it in the file, Claude Code reads the whole thing.

Repo (this Mac): `~/Desktop/local_files/website-clients/livewebstudios-v3`
Page: `src/pages/namesake/start.astro` (builds to `dist/namesake/start.html`)
Stack: Astro 7 + React islands, `build: { format: 'file', inlineStylesheets: 'always' }`, Netlify.
Run: `claude --dangerously-skip-permissions` from the repo root.

---

## 1. Brief

### What this is
The Namesake Start page currently has a name field that echoes into big display type and a Formspree intake form (`mlgkoqjl`). That stays. On top of it we add a show-off toy: type your name, tap a style, and a full home-page hero renders in your name, right there in the hero. One more tap opens it full size with a Save PNG button.

It is a demo, not a configurator. Nothing about it should feel like a form.

### The rules
1. **Two inputs total.** A name field and four style chips. No profession picker, no color picker, no font picker, no "next" button.
2. **Zero clicks to see something.** The preview is on screen before the visitor types anything (rendered with the placeholder name "Your Name" in the default style). Every keystroke updates it live. Every chip tap re-skins it instantly.
3. **One click to the payoff.** Clicking the preview, or the single "See it full size" button, opens a modal with the page at full size and a **Save PNG** button. That is the whole flow.
4. Everything below the hero (the "This is just a taste" line is fine to keep inside the card, the intake form further down stays exactly as it is).

### The four styles (locked, do not add a fifth)

| Key | Name on chip | Display font | Body font | Palette | Layout of the generated home page |
|---|---|---|---|---|---|
| `quiet` | Quiet Editorial | Cormorant Garamond 600 | Instrument Sans | paper `#F4F1EA`, ink `#1B1A17`, olive `#5E6B4A`, rule `#D9D4C7` | Left-aligned. Small caps wordmark top-left, three tiny nav words top-right. Name in large serif, lowercase tagline under it, thin rule, one ghost button. Bottom strip: three short text columns. Lots of air. |
| `bold` | Bold Display | Anton | Instrument Sans | black `#0B0B0B`, white `#FFFFFF`, acid `#E8FF47` | Name fills the full width in ALL CAPS, two lines if needed, tight leading. Tagline in mono-ish small caps above it. One solid acid button. Bottom: a marquee-style row of the name repeated in outline text. Loud, poster-like. |
| `classical` | Classical | Libre Caslon Display | Lora | navy `#0F1B2D`, cream `#F1EADB`, brass `#C9A45C` | Centered. Monogram (initials) inside a thin brass circle at the top, name in caps with wide tracking under it, italic tagline, hairline rules left and right. Bottom: a single centered italic pull-quote in cream. Law firm, executive, old money. |
| `warm` | Warm Boutique | DM Serif Display | Manrope | terracotta `#B5573A`, blush `#F3E3DA`, cocoa `#3E2A22`, cream `#FBF6F1` | Two-column. Left: name on two lines, friendly tagline, rounded solid button. Right: a large rounded-rectangle "photo" block filled with a soft terracotta-to-blush gradient (no image, no face). Bottom: pill tags. Soft corners everywhere, 24px radius. |

Default style: `quiet`.

### Copy inside the generated pages (fixed per style, name and initials are the only variables)
- quiet: wordmark `{name}` in small caps; nav `Work` `Writing` `Contact`; tagline `Selected work, writing, and a way to reach me.`; button `Reach out.`; bottom columns `Work` / `Writing` / `About` each with one 8-word line of neutral filler you write (no lorem ipsum).
- bold: eyebrow `PORTFOLIO. PRESS. CONTACT.`; name; button `Let's talk.`; marquee row `{NAME} · {NAME} · {NAME} · ...` in outline text.
- classical: monogram `{initials}`; name in caps; tagline `Reputation, considered.`; hairlines; pull-quote `"The work speaks. This is where it is heard."`; small line under it `{firstlast}.com`.
- warm: name; tagline `Hello. Here is what I do, and how to reach me.`; button `Say hello.`; tags `Work` `Story` `Press` `Contact`.

`{name}` is the typed name trimmed and title-cased as typed (do not force case beyond what the style needs). `{initials}` is the first letter of each word, max three. `{firstlast}` is the name lowercased with spaces and punctuation stripped. Empty field shows `Your Name` / `YN` / `yourname`.

Kill-list applies inside the generated pages too: no em dashes, no "learn more", "click here", "submit", "schedule a free consultation".

### Export
- PNG at 2880 x 1800 (a 1440 x 900 page at 2x). Filename `namesake-{firstlast}-{style}.png`.
- The PNG must be pixel-identical to what the modal shows. Fonts must be embedded, which is why the fonts are self-hosted (below), not loaded from Google.
- One allowed dependency: `html-to-image` (pin the current stable version). Nothing else new in package.json.

---

## 2. PROMPT (paste into Claude Code)

```
You are adding a live preview generator to the Namesake Start page of the Live Web Studios v3 site (Astro 7, React islands, Netlify). Work autonomously. Do not stop to ask questions except for the stop conditions at the bottom. Log every judgment call in DECISIONS.md at the repo root (create it if missing) as one line each: date, decision, why.

## Context (carry forward)
- Repo root is the current directory. Work on whatever branch is checked out. If `git status` shows uncommitted changes, stop and report them before touching anything.
- Astro config: build.format = 'file', inlineStylesheets = 'always'. Pages build to flat .html files.
- LWS PATH RULE: every href and src inside src/ MUST be relative, built with relPrefix(Astro.url.pathname) from src/lib/relPrefix.ts. Never write a root-relative "/fonts/..." or "/images/..." path in a component or page. For the island, the page passes base={relPrefix(Astro.url.pathname)} as a prop and the island builds every asset URL from that prop.
- One H1 per page. The page already has an H1 ("Start with your name."). Do not add another anywhere, including inside the generated preview (use div/span with classes for the preview typography; the preview is decorative markup, not document structure).
- Writing rules: no em dashes anywhere (commas, periods, colons). Never write "learn more", "click here", "submit", "don't hesitate to reach out", "schedule a free consultation".
- No inline styles. CSS custom properties for every color, font and radius. No Tailwind. No new dependencies except the one named in Session 1.
- Only make the changes requested below. Do not refactor, rename, or restyle anything else on the page or the site. Do not touch the Formspree intake form on this page except for the two hidden fields named in Session 2.
- Read src/pages/namesake/start.astro, src/components/Nav.astro, src/layouts/Base.astro and src/styles/global.css before writing anything, so the island reuses the existing Namesake tokens (--brass etc.) for its own chrome and only introduces new tokens for the four generated styles.

## Session 1: Fonts, island scaffold, four styles
A. Fonts. Download woff2 files (latin subset only) for: Cormorant Garamond 600, Instrument Sans 400 and 500, Anton 400, Libre Caslon Display 400, Lora 400 and 400 italic, DM Serif Display 400, Manrope 400 and 600. Use google-webfonts-helper (https://gwfh.mranftl.com/api/fonts/{family}?subsets=latin) or fetch the css2 endpoint with a modern user agent and follow the woff2 URLs. Save to public/fonts/namesake/ with clean lowercase filenames. Record the exact source URLs and licenses (all are OFL) in public/fonts/namesake/LICENSES.txt. If a download fails, log it in DECISIONS.md, choose the closest OFL alternative from the same family (serif for serif, grotesk for grotesk), and continue.

B. Island. Create src/components/NamesakePreview.tsx (React, client:load). Props: base: string. It renders:
   1. A name input: type="text", autoFocus on desktop only (not on touch, it pops the keyboard), maxLength 40, placeholder "Type your name", aria-label "Your name", spellCheck false. Reuse the existing input styling on the page; the current big display echo of the name ("YOUR NAME" in the screenshot) is replaced by the live preview, so remove that echo element from start.astro and let the island own that region of the card.
   2. Four style chips directly under the input as a radio group (role="radiogroup", each chip role="radio" with aria-checked, arrow keys move selection). Each chip shows: the style name, three 10px color dots from that style's palette, and the style name rendered in that style's display font at 13px. Chip height 44px minimum (touch). Selected chip gets the --brass 2px rule the sub-nav already uses for is-active. No new colors for the chip chrome.
   3. The live preview: a 16:10 frame that renders the generated home page for the current style and name at a fixed internal size of 1440 x 900 and scales it to fit its container with transform: scale() (measure the container with ResizeObserver, scale = containerWidth / 1440, set the frame height to 900 * scale). The frame has a 1px hairline border and 12px radius, sits in the right two-thirds of the hero on desktop (where the light streaks are now), and stacks under the card at max-width 900px. It is a button (role="button", tabIndex 0, aria-label "See it full size") that opens the modal from Session 2. Add a small caption under it: "Live preview. Tap it to see it full size."
   4. One button under the caption, ghost style matching the existing "Start Yours" ghost button: "See it full size."

C. Fonts loading. In the island, register every face with the FontFace API using `${base}fonts/namesake/<file>` and add them to document.fonts on mount. Await document.fonts.ready before the first preview paint (show the frame at opacity 0 until ready, then fade in over 200ms) and again before every export. Never reference the fonts from a stylesheet url() so the PATH RULE holds.

D. The four generated pages. Implement as four small React components inside NamesakePreview.tsx (or a sibling file src/components/namesake-styles/*.tsx), each receiving { name, initials, firstLast } and rendering a full 1440 x 900 page exactly as specified in Section 1 of this handoff (layout, fonts, palette, copy). Every color and font goes through CSS custom properties scoped on the page root element: [data-nsp-style="quiet"] { --nsp-bg: ...; --nsp-fg: ...; --nsp-accent: ...; --nsp-display: ...; --nsp-body: ...; --nsp-radius: ... }. Styles live in src/styles/namesake-preview.css, imported by the island, every selector prefixed .nsp- so nothing leaks. Name sizing: the name must never overflow. Compute font-size for the name from its length with clamp() bands (1 to 8 chars, 9 to 14, 15 to 22, 23 to 40) per style, and allow two lines where the style permits (bold, warm). Test with "Al", "Jon Wolf", "Rosalind Cohen", "Maximilian Featherstonehaugh III".

E. Name handling. name = input value trimmed, internal whitespace collapsed to one space, max 40 chars. Empty string renders "Your Name". initials = first letter of each word, uppercase, max three. firstLast = name lowercased with everything except a-z and 0-9 stripped; empty becomes "yourname". Debounce nothing; every keystroke re-renders (it is cheap). Persist the last name and style to sessionStorage so a reload does not blank the demo; wrap reads and writes in try/catch.

F. Wire it in. In src/pages/namesake/start.astro replace the current name field and big display echo inside the hero card with <NamesakePreview client:load base={relPrefix(Astro.url.pathname)} /> and move the preview frame region into the hero's right column (add a two-column grid on the hero section if there is not one; the card keeps its current width, the preview takes the rest). Keep the eyebrow, the H1, and the "This is just a taste. Yours will be one of a kind." line. Keep everything below the hero untouched.

Build. Open dist/namesake/start.html in a headless browser at 1280 and 375. Confirm: the preview is visible before typing (shows "Your Name" in Quiet Editorial), typing updates it on every keystroke, each chip re-skins it, no layout shift on the card, no horizontal scroll at 375, all four fonts render (check document.fonts.check() for each face after ready).
✅ Output: the four style components, the font file list, and the four screenshots (one per style, name "Jon Wolf") at 1280.

## Session 2: Modal, Save PNG, form hookup
A. Install html-to-image (pinned to the current stable release). No other dependency.

B. Modal. Use a native <dialog> element. Opens from the preview frame click and from the "See it full size." button. Contents: the same generated page component at 1440 x 900, scaled to fit min(92vw, 92vh * 1.6) wide, centered, 12px radius, hairline border; under it a row with two buttons: "Save PNG" (solid, --brass background, ink text) and "Close" (ghost). Escape closes, backdrop click closes, focus goes to Save PNG on open and returns to the trigger on close. Backdrop: the existing glass token background at 85% with the page's blur. Body scroll locked while open. On mobile (max-width 900px) the modal is full-bleed with 16px gutters and the buttons stack full width.

C. Save PNG. Render a hidden, unscaled 1440 x 900 instance of the current page component (position fixed, off-screen, not display:none, so fonts and layout resolve) and export it with html-to-image toPng at pixelRatio 2, cacheBust true, after awaiting document.fonts.ready. Filename namesake-{firstLast}-{style}.png. Trigger the download with an <a download> and an object URL; revoke the URL after. If the download attribute is unsupported (iOS Safari), open the blob in a new tab instead and change the button label for two seconds to "Opened. Long-press to save." The button shows "Saving..." while exporting and is disabled during export. If export throws, log it to console.error and show "Could not save. Try again." for three seconds.

D. Verify the export. In the headless browser, click Save PNG for each of the four styles with the name "Rosalind Cohen", capture the blob, and confirm: dimensions exactly 2880 x 1800, file size above 100 KB, and the name text is present by comparing against a screenshot of the modal (fonts identical, not a fallback serif). If a font falls back in the PNG but not in the modal, the fix is in the font embedding path (html-to-image needs the @font-face rules visible in a stylesheet: if the FontFace-API route defeats its font collection, add a runtime <style> element with @font-face rules whose src is the same ${base}fonts/... URL, injected once on mount, and log the decision). Do not ship until the four PNGs match the four modal screenshots.

E. GA4. If window.gtag exists, fire gtag('event', 'namesake_preview_save', { style, name_length }) on a successful save and gtag('event', 'namesake_preview_open', { style }) on modal open. Guard both calls; never throw if gtag is absent.

F. Form hookup. In the existing Formspree intake form on this page add two hidden inputs, name="preview_style" and name="preview_name", and have the island keep them updated (querySelector by name on every change; if the fields are absent, do nothing). Add one line inside the modal under the buttons: "Want the real one? Tell Jon which style you liked." linking to the form's id on this page (add id="start-form" to the form element if it has none). That is the only change to the form.

Build. Repeat the Session 1 checks plus the modal at 1280 and 375. Keyboard-only run: Tab to the input, type, arrow through chips, Tab to the frame, Enter opens the modal, Tab reaches Save PNG then Close, Escape closes and focus returns to the frame.
✅ Output: the four exported PNGs (name "Rosalind Cohen") saved to a scratch folder outside the repo, their dimensions, and the keyboard-run result.

## Session 3: QA and push
1. Run the QA passes in order if the commands exist in this environment: /polish, /colorize, /layout, /animate. Scope them to src/pages/namesake/start.astro, src/components/NamesakePreview.tsx (and the styles folder), and src/styles/namesake-preview.css only. If a command does not exist, note it in DECISIONS.md and continue.
2. Kill-list scan on dist/namesake/start.html visible text and on every string literal in the island: em dashes, "learn more", "click here", "submit". Fix in source.
3. Single H1 check on dist/namesake/start.html: exactly one <h1.
4. PATH RULE check: grep src/components/NamesakePreview.tsx, the styles folder, and src/styles/namesake-preview.css for `"/fonts`, `'/fonts`, `url(/`, `"/images`. Zero hits.
5. Lighthouse (or the equivalent in this environment) on dist/namesake/start.html mobile: no accessibility errors from the new markup, CLS under 0.1 (the preview frame must reserve its height before fonts load). Report the numbers.
6. Update SESSION_SUMMARY.md with a dated block for this run.
7. git add -A && git commit -m "Namesake: live preview generator with Save PNG" && git push origin <current branch>.
✅ Output: every file created or changed, the push result, the Lighthouse numbers, and anything you could not resolve.

## Stop conditions (the only ones)
- `git status` is dirty before you start. Report and wait.
- A file would be permanently deleted (git rm or rm of a tracked file). Show the list and wait.
- A credential is required. Say what and wait.
Everything else: decide, log it in DECISIONS.md, keep going.
```

🎯 Target: Claude Code · 💡 Three sessions, one new dependency, self-hosted fonts so the PNG matches the screen, a hard scope lock on the rest of the page, and an export that is verified against the modal before push.

---

## 3. After Claude Code finishes (Jon)

1. Open the Netlify deploy preview at `/namesake/start`. Type your own name. Tap all four chips. Save a PNG of each and open them: fonts should match the screen exactly. If any PNG shows Times or Arial, the font embedding failed and Session 2D was skipped; send it back.
2. Try it on your phone. The keyboard should not pop on load. The modal should be full-width. Save PNG on iOS opens the image in a new tab; long-press to save is expected.
3. Send one intake form through with a style selected and confirm `preview_style` and `preview_name` show up in the Formspree submission.
4. Take the four "Jon Wolf" screenshots from Session 1 and drop them on the Namesake overview page later as the "four directions" strip. Separate session.

---

## 4. Decisions Claude Code will make on its own (override now if you disagree)

| Item | Default in the prompt |
|---|---|
| Default style | Quiet Editorial |
| Placeholder name before typing | "Your Name" |
| Export size | 2880 x 1800 (1440 x 900 at 2x) |
| Export library | html-to-image, the only new dependency |
| Fonts | Self-hosted woff2 in `public/fonts/namesake/`, loaded via FontFace API |
| Name length cap | 40 characters |
| Branch | Whatever is checked out; pushed to the same branch |
| Autofocus | Desktop only |

---

## 5. Not in this handoff

- Domain availability check (RDAP via a Netlify function). Worth doing later; it turns the toy into a lead magnet. Kept out to keep this at two inputs.
- A profession picker that changes the tagline. Same reason.
- Emailing the PNG to the visitor. Formspree file fields can carry it; separate session if the demo earns it.
- Using the four style screenshots on `/namesake` overview and in the "How It Works" page.
