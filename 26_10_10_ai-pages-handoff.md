# Live AI Studios /ai pages: Handoff Spec

Point-in-time snapshot from the 2026-10-10 session that hit the 6-task limit. It covers what changed on /ai/how-it-works, /ai/start and the main nav, what is still open, and the conventions the next session must follow. Every change below is also logged in DECISIONS.md. Nothing from this session is committed yet; it all sits in the working tree on `main` alongside earlier uncommitted work.

## Project basics

- Astro site. Dev server runs in background: `astro dev --background` (status / stop / logs subcommands). Local URL: http://localhost:4321
- Images are referenced through `relPrefix`: `const rel = relPrefix(Astro.url.pathname);` then ``src={`${rel}images/...`}``. Never a root-relative `/images/...`.
- /ai pages wrap `<main class="theme-live-ai">` and import `src/styles/ai.css`. Orange accent is `--ai` (#E8650A), soft orange `--ai-soft`.
- Log every decision as a dated line at the bottom of DECISIONS.md.
- Breathing grid rules live in the project CLAUDE.md (max two per page, one background per section, log each use).

## Done this session

### /ai/how-it-works
- Closing CTA ("Listening comes first. Tell us about the business.") switched to the `cta cta--art ai-close` layout: photo left, eyebrow + h2 + two buttons right. Image: `public/images/ai/ai-how-listening.jpg` (legal pad of call notes, phone on a call).

### /ai/start (src/pages/ai/start.astro)
- Deleted sections: "How this works" (3 steps) and "What stays with you", plus their `.start-steps` and `.start-trust` CSS.
- Hero: Main Street drone loop via `<AiVideoBg name="ai-how" scrim="hero" />`, section class `has-videobg`. Same files as the how-it-works hero.
- Form section: `has-bgrid` + `<BreathingGrid chevrons="none" quiet="none" density="sparse" scrim="strong" />`.
- Form markup rewired to the `.start-*` classes in ai.css (it had been rendering generic `.form-row/.field` markup, which looked broken).
- Removed fields: "What kind of business?" (and the `industries` array), "What do you run the business on?", the chore free-text textarea and its help line, the "Where the week goes" heading and its divider.
- Chore question is now 8 checkbox chips from the `chores` array: Invoicing, Chasing late payments, Answering inquiries and email, Scheduling and reminders, Quotes and estimates, Following up after a job, Social posts and marketing, Data entry and paperwork. The submit script joins ticked values into one comma-separated `chore` field before posting to Formspree.
- Each multiple-choice question (chores, invoice timing, AI use) is its own card (`.start-choice`: padded, bordered, 4.5% white fill; legend floated so it sits inside the card). "If so, what for?" (`#start-ai-detail`, class `start-detail`) moved inside the AI card; the script still shows it only when an AI answer other than "Not yet" is picked.
- Field contrast raised: inputs 10% white fill, warm borders via `.start-form{--line-field:rgba(246,160,102,.42)}`, chips 7% fill.
- Question labels and legends are the logo blue `#00A8D7` (sampled from logoRGB.png; no token matches, `--cyan` is lighter). "Required" tags stay orange mono; "About you" heading stays white.
- Form note under the panel is centred.
- "Rather just talk?" section: photo left (`public/images/ai/ai-start-phone.jpg`, worn desk phone), copy right, via `.start-call__grid` / `.start-call__art` / `.start-call__copy`. Stacks under 900px.

### Main nav (sitewide)
- `Nav.astro` adds `nav--has-sub` to `header.nav` when a sub-brand bar exists (Band, AI, Namesake). `mosa-skin.css` gives that header a 12% white wash (raised from 5%, which was invisible) over its existing dark background so the two stacked bars read as separate. Pages without a sub-bar are unchanged. Tune via the `.12` in that rule.

## Image pipeline (for any new still life)

- Higgsfield `generate_image`, model `gpt_image_2_5`, aspect `4:5`, count 2. Output is 896x1120 PNG.
- House style prompt: moody editorial still life, dark wooden desk at night, single warm brass lamp upper left, amber and orange tones, speckled ceramic mug, orange pen, shallow depth of field, 35mm grain, photorealistic, no legible words, no people, no logos.
- Convert with `sips -s format jpeg -s formatOptions 82` into `public/images/ai/`. Save the raw PNGs to Desktop as `26_10_10_lais_<page>_<section>_raw.png` plus `_alt_raw.png` for the unused variant.
- Display class: `ai-close__img` (4:5, bordered, rounded), with explicit `width="896" height="1120" loading="lazy" decoding="async"`.

## Still open (waiting on Jon)

1. Cards: built as one card per question. If Jon meant one card per answer option, rework `.start-chip` instead.
2. Chore question label still says "the one chore" but allows multiple ticks. Suggest "Which chores would you hand off tomorrow if you could?" Jon's copy, so ask before changing.
3. Optional "Something else" chip with a short text box for the chore question (there is no free-text chore answer any more).
4. Orange "Required" tags beside blue labels: offer to make them blue if the mix bothers him.
5. Alternate renders on Desktop if he prefers them: `26_10_10_lais_how_close_listening_alt_raw.png`, `26_10_10_lais_start_call_phone_alt_raw.png`.
6. Nothing is committed. Ask before committing; the working tree also holds earlier uncommitted work (portfolio images, ai videos, many pages).

## Verify after any change

- Load the page at localhost:4321, confirm no Vite error overlay, check 1400px and 375px widths with no horizontal scroll.
- Lazy images and `.reveal` fades need a beat before screenshots, or sections look blank.
- Path grep: no `src="/` or `href="/` in edited files. No em dashes in client-facing copy.
