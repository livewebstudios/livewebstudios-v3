# LWS v3: /services/email-writing page + nav item. Claude Code Handoff, 2026-09-22

Paste the **PROMPT** block (Section 3) into Claude Code from the v3 repo root. Sections 1 and 2 are the audit and the copy deck the prompt refers to; leave them intact, Claude Code reads the whole file.

Repo: `~/Desktop/local_files/website-clients/livewebstudios-v3` (branch `main`, clean at `89f6a1c`)
Stack: Astro 7 + React islands + Decap CMS, `build.format = 'file'`, output `dist/`, Netlify.
Everything this page needs is in this file. No external source material, no dependency on any folder outside this repo.

---

## 1. Audit: where this page slots in (verified 2026-09-22)

### What exists now
| | |
|---|---|
| Service pages | 14 in `src/pages/services/` |
| Nav mega columns | BUILD (5), AI (4), BRAND (4), LEGAL (1) in `src/components/Nav.astro` lines ~33-80 |
| Services hub | `src/pages/services.astro`, 5 labeled groups, `ServiceCard` component |
| Footer | 7 hand-picked service links, `src/components/Footer.astro` lines ~45-51 |
| Newest page pattern | `src/pages/services/expert-witness.astro` (added today). Richest structure: PhotoBg hero, practice areas, numbered steps, FAQ, CTA. |
| Simpler pattern | `src/pages/services/ai-workflow.astro`. Hero, six Glass cards, CTA. |
| Icon set | `src/lib/navIcons.ts`, 30 glyphs. **No envelope/mail glyph exists.** One gets added. |

### The three decisions this page needs, already made
1. **Slug**: `/services/email-writing` (matches the folder Jon created).
2. **Nav home**: the **AI** column, as its fifth link. It is an AI voice-system build, not a copywriting retainer, and the AI column is where a prospect looking for that will look. It does not need its own column the way Expert Witness did, because it sells to the same small businesses the rest of the AI column sells to.
3. **Page pattern**: `expert-witness.astro`. This page needs the voice examples rendered as real before/after blocks, which the six-card grid in `ai-workflow.astro` cannot carry.

### No pricing on this page
Pricing pages were dropped from v3 on purpose (commit `c37ecfc`). This page ends at a conversation, same as the other thirteen.

### One thing Jon has to clear before launch
The copy deck in Section 2 draws its examples from real LWS situations but names no client. If Jon wants a named example (the Clifton welding shop, the hacked church site), that is his call and his permission to get. Ship it anonymous, swap in names later if he wants them.

---

## 2. Copy deck (use verbatim, this is the page)

### Hero
- Eyebrow: `EMAIL WRITING`
- H1: `I Do Not Write Emails Anymore. <em>Neither Should You</em>.`
- Lede: `I built myself a set of email voices. One for chasing money, one for saying no, one for bad news. I tell the machine which voice and what happened, and the email comes out sounding like me on a good day. I will build you the same thing.`

### Section: THE PROBLEM
H2: `The Email You Are Avoiding Is Costing You Money`

Three short paragraphs, no list:

> Every small business owner has a folder of emails they have not sent. The invoice that is forty days out. The client who keeps adding one more thing. The job that slipped and somebody has to be told.

> They do not go unsent because they are hard to write. They go unsent because writing them badly has a cost, so you wait until you have the energy to write them well. That energy shows up on a Tuesday afternoon roughly once a month.

> A voice system removes the energy from the equation. The hard part, deciding what tone this particular email needs, gets decided once. After that you are describing a situation, not composing a letter.

### Section: THE SIX VOICES
H2: `Six Voices, Built Once, Used Forever`
Eyebrow: `WHAT YOU GET`

Six Glass cards. Each has a title, a one-line job description, and a short before/after pair. The "before" is what people actually send. The "after" is what the voice produces. Keep both short enough to read at a glance.

**1. The Nudge** · `Getting paid without torching the relationship.`
- Before: "Hi, just following up on invoice 1042, please let me know. Thanks!"
- After: "Ken, invoice 1042 went out on the 3rd and it is sitting at 41 days. I am going to assume it got buried rather than ignored. Can you get it into this week's run? If something is holding it up on your end, tell me and we will work it out."

**2. The Line** · `Saying no to "can you just" without losing the client.`
- Before: "Sure, I can probably squeeze that in!"
- After: "That is a real piece of work, not a tweak, so I do not want to bolt it onto this build and have it come out half considered. Let me price it as its own thing. If the number works we do it next, and if it does not, nothing is lost."

**3. The Straight Answer** · `Bad news, delivered before they find out on their own.`
- Before: "Unfortunately there have been some unforeseen delays..."
- After: "The site is going to miss Friday. The host moved a setting on their end and it took two days to find. New date is Wednesday the 14th, and I am not going to move it again. Here is what is already done."

**4. The Handoff** · `Referral intros that actually get replied to.`
- Before: "Hi both, connecting you two! I will let you take it from here."
- After: "Dana, this is Mike. He runs the plumbing outfit I mentioned at breakfast, and he is about four months from needing exactly the thing you do. Mike, Dana is the one I send people to when the books stop making sense. You two should talk, I am stepping out of the thread."

**5. The Second Ask** · `Proposal sent, then silence. Day five.`
- Before: "Just wanted to bump this to the top of your inbox!"
- After: "You have had the proposal a week, which usually means one of three things: the number is wrong, the timing is wrong, or it fell off the desk. Any of those is fine, I just want to know which one so I know whether to hold the slot."

**6. The Opener** · `First contact that does not read like a template.`
- Before: "I hope this email finds you well! I came across your website and..."
- After: "Your contact form has been broken since at least June. I filled it out twice from two different browsers and nothing came back. I am a web guy in Saddle Brook, so I notice this stuff. Whether or not you ever hire me, get that fixed, because you are losing calls."

### Section: HOW IT RUNS
H2: `Four Steps, About Two Weeks`
Eyebrow: `THE BUILD`

Numbered steps, same component pattern as the five stages on `expert-witness.astro`:

1. **I read your sent folder.** Two hundred emails you actually wrote, not a questionnaire about how you think you write. The voice comes out of the evidence.
2. **We pick the six.** Every business has different emails it dreads. A contractor needs a change-order voice. A therapist needs a boundary voice. Yours will not be my six.
3. **I build and you break them.** You get the voices loaded and ready. You run real situations through them for a week and tell me where they sound wrong. They get tuned until they do not.
4. **You keep them.** They live in your tool, not mine. No subscription to me, no rewriting them next quarter, nothing to renew. If your business changes enough that the voices stop fitting, you call me.

### Section: WHO THIS IS FOR
H2: `Worth It If You Recognize Yourself Here`
Eyebrow: `FIT`

Four short cards, no before/after:
- **You write the same email forty times a year** and start from nothing every time.
- **You have an unsent folder.** The hard emails wait for a good day and the good day is expensive.
- **Somebody else answers your email** and it does not sound like you, so clients can tell which ones you wrote.
- **You already use AI for email** and it keeps producing something polite, padded, and not yours.

### Section: FAQ
H2: `What People Ask`
Eyebrow: `QUESTIONS`

Same `faqs` array + FAQPage-free pattern as expert-witness (the site already has one FAQPage node on `/faq`, do not add a second).

1. **Does this mean AI writes my emails?** It means AI writes the first draft in a voice built from your own sent mail. You read it, you change what you want, you send it. Nothing goes out that you did not look at.
2. **Will people know?** They will know it sounds like you, because it does. The voices are built from how you already write, which is the entire point of reading your sent folder instead of handing you a template.
3. **What tool does this run in?** Whatever you already use. If you use nothing yet, I will set you up on one and show you how it works. There is nothing proprietary here that only I can service.
4. **What if I hate one of the voices?** That is what the break-it week is for. They get tuned until they sound right or that voice gets scrapped and replaced with one you will actually use.
5. **Can you just write my emails instead?** Sometimes, for a specific thing, yes. But it is the worse deal. Paying me per email means you are still waiting on me at 9pm when the invoice needs chasing.

### CTA
H2: `Tell me which email you are avoiding.`
Body: `That is usually the first voice we build.`
Buttons: `Let's talk. →` to contact, `732.801.9611` as the tel ghost button.

### Meta
- Title: `Email Writing & AI Voice Systems | Live Web Studios`
- Description: `Custom AI email voices built from your own sent mail. Six voices for the emails you dread: invoices, scope, bad news, follow-up. Built once, yours to keep. Saddle Brook NJ.`
- Canonical: `https://livewebstudios.com/services/email-writing`

---

## 3. PROMPT (paste into Claude Code)

```
You are adding one new service page to the Live Web Studios v3 site (Astro 7, React islands, Netlify) and wiring it into the nav, the services hub, and the footer. The copy is written for you in Section 2 of 26_09_22_lws_email_writing_service_page_handoff.md at the repo root. Read that file first, in full. Work autonomously. Do not stop to ask questions except for the two stop conditions at the bottom. Log every judgment call in DECISIONS.md at the repo root as one line each: date, decision, why.

## Context (carry forward)
- Repo root is the current directory. Branch main, working tree clean.
- Astro config: build.format = 'file', inlineStylesheets = 'always'. Pages build to flat .html files.
- LWS PATH RULE: every href and src inside src/ MUST be relative, built with relPrefix(Astro.url.pathname) from src/lib/relPrefix.ts. Never write a root-relative "/images/..." or "/services/..." link in a component or page.
- Nav text is Title Case. One H1 per page. Semantic HTML5. Meta, OG, canonical, JSON-LD on every page via Base.astro props.
- WRITING RULES, hard: no em dashes anywhere, use commas, periods, or colons. Never write "learn more", "click here", "submit", "don't hesitate to reach out", "schedule a free consultation". Button labels: "Send", "Let's talk.", "Reach out.", "Call me."
- Do not add dependencies. No Tailwind, no inline styles, CSS custom properties only, JS only as progressive enhancement.
- Only make the changes listed below. Do not refactor, rename, or restyle anything else. Do not touch the other 14 service pages except where step 3 says to.
- NEVER modify anything under ../livewebstudios. Read from it freely.

## Step 1: The page
Create src/pages/services/email-writing.astro.

Mirror the STRUCTURE of src/pages/services/expert-witness.astro exactly: same imports, same const arrays pattern (areas/steps/faqs), same CANONICAL and DESCRIPTION consts, same pageSchema array shape, same section markup (page-head with a background, sec-pad sections alternating is-alt and has-scan, Glass variant="inner" cards, sec-head with eyebrow + h2, CTA in a Glass innerClass="cta"). Do not invent new section classes or new components.

Fill it with the copy deck from Section 2 of the handoff, verbatim. The six voices are the "areas" array equivalent, each carrying title, job line, before, and after. Render before/after as two short blocks inside each Glass card, the "before" visually de-emphasized (reuse an existing muted/secondary text token from src/styles/global.css, do not invent a color). If no suitable token exists, use the same treatment .card-points already gets and log it in DECISIONS.md.

Hero background: use VideoBg with src="jon-webdesk.mp4" and scrim="hero" (it already ships a matching poster in public/video-bg/, and a desk shot is the right read for this page). If that clip has no poster, fall back to PhotoBg with an existing image and log the swap.

Schema: two nodes in pageSchema, WebPage and Service, copied structurally from expert-witness.astro with this page's name, description, and url. areaServed "US", provider the same LocalBusiness block (name Live Web Studios, url https://livewebstudios.com, telephone 732-801-9611, email jonwolf@livewebstudios.com). Do NOT add a FAQPage node, /faq already owns the only one on the site.

Headings: exactly one h1. Every section gets a real h2. The six voice cards and the four fit cards are h3s.

## Step 2: Nav
File: src/components/Nav.astro only, plus src/lib/navIcons.ts.

A. Add an envelope glyph to src/lib/navIcons.ts under the key "mail". Match the existing glyphs exactly: same viewBox, same stroke width, same fill/stroke convention, same path style as the neighboring icons. A simple rectangle-plus-flap envelope. Do not import an icon library.

B. In the svcCols array, add to the AI column as its FIFTH and last link:
   ["Email Writing", "services/email-writing.html", "mail"]
   Leave the AI column's label and color (#A78BFA) alone. Do not reorder the other four.

C. Confirm the AI column still lays out correctly at 1280px and 375px with five links where it had four. If the mega panel's column height rule assumes four, adjust only that rule and log it.

## Step 3: Hub and footer
A. src/pages/services.astro: add a card to the "AI & AUTOMATION" group, last position:
   { ico: "✉", title: "Email Writing & Voice Systems", tag: "NEW", body: "Six AI email voices built from your own sent mail. The invoice chase, the scope decline, the bad news. Yours to keep.", href: "services/email-writing.html" }
   Use the same ServiceCard props the other cards in that group use (bg={cardArt}, art="metal").

B. src/components/Footer.astro: add ["Email Writing", "services/email-writing.html"] to the services link array, after "Expert Witness". If that puts the column at an awkward length, do not rebalance the other columns, just add it and note the count in DECISIONS.md.

## Step 4: Build and verify
1. npm run build. Must pass.
2. Confirm dist/services/email-writing.html exists.
3. Confirm the new page appears in dist/sitemap-0.xml (the @astrojs/sitemap filter in astro.config.mjs excludes /forms/, /hlink/, thank-you, and /admin, so a new /services/ page should be picked up automatically. If it is not, find out why and fix the filter, do not hand-add the URL).
4. Kill-list scan on the new page and on every file you edited: grep dist/services/email-writing.html for the em dash character, and for "learn more", "click here", "submit", "free consultation", case-insensitive, in visible text. Zero hits. Fix in source, never in dist.
5. Single H1: grep -c "<h1" dist/services/email-writing.html must return 1.
6. Link check: every href and src in dist/services/email-writing.html that is relative must resolve to a real file in dist/. Zero broken. Check the new nav link from three different depths: dist/index.html, dist/services.html, dist/services/seo.html, dist/live-band-web-studios/forms.html. The relPrefix depth must be right on all four.
7. Confirm G-SW3VF5PBDT is present in dist/services/email-writing.html.
8. Confirm the JSON-LD on the new page parses as valid JSON (pipe it through node -e or python -m json.tool).
9. git add -A && git commit -m "Add /services/email-writing page, nav, hub and footer links". Do NOT push. Jon reviews first.

✅ Output: the file list, the nav array as it now reads, the kill-list scan result, the link check result, and anything you had to decide.

## Stop conditions (the only two)
- A file would be permanently deleted (git rm or rm of a tracked file). Show the list and wait.
- A credential or secret is required. Say what is needed and wait.
Everything else: decide, log it in DECISIONS.md, keep going.
```

🎯 Target: Claude Code · 💡 Copy written in full so nothing gets invented in Jon's voice by a machine at 3am, structure pinned to the newest page on the site so it does not drift from the design system, kill-list scan as the pass gate, and no push until Jon looks at it.

Run from the v3 repo root with `claude --dangerously-skip-permissions`.

---

## 4. Decisions baked in (override now if you disagree)

| Item | Default |
|---|---|
| Slug | `/services/email-writing` |
| Nav column | AI, fifth link, after AI Image |
| Icon | new `mail` glyph added to navIcons.ts |
| Page pattern | `expert-witness.astro`, the richest one |
| Hero background | `jon-webdesk.mp4` |
| Pricing | none, consistent with the other 13 |
| FAQ schema | none, `/faq` keeps the only FAQPage node |
| Client names in examples | none. All six examples are anonymized |
| Push | no. Commit only, Jon reviews |

---

## 5. After Claude Code finishes (Jon)

1. Read the six voice examples out loud. They are written from your real situations, but they are my guess at your cadence. Anything that sounds like a web guy imitating you, mark it and run `/jonvoice` on that block.
2. Decide on the Opener example. "Your contact form has been broken since at least June" is the strongest of the six and also the one that reads as a little aggressive on a public page. It stays or it softens, your call.
3. Check the AI column at mobile width with five links.
4. Push when you like it. Netlify builds from `main`.
5. After launch: this page is the natural first proof for the AI consulting arm. The six voices are a productized offer with a fixed scope and no recurring obligation, which is the easiest kind to sell to the plumbers and contractors already on your books.

---

## 6. Not in this handoff

- The actual voice-building service delivery: what tool the client ends up in, what you hand them at the end, what you charge. That is a business decision, not a page.
- Your own six voices as working assets. The page sells a system you have not built as a real thing yet. If you want them built as a Claude skill you can trigger by name, that is a separate session and a good one.
