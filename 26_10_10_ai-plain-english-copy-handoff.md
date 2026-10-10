# Live AI Studios /ai pages: Plain-English Copy Pass, Handoff Spec

Jon approved a copy pass on 2026-10-10 to strip insider and technical language out of the Live AI Studios pages so a small business owner (plumber, architect, contractor) can read them cold. Every change is listed below as exact current text and exact new text. Apply them verbatim. Do not rewrite anything that is not listed.

## Scope

**Edit these files only:**

- `src/pages/ai.astro` (AI Home)
- `src/pages/ai/services.astro`
- `src/pages/ai/proof.astro`
- `src/pages/ai/how-it-works.astro`
- `src/lib/aiStudio.ts` (the SERVICES, REBUILDS, SYSTEMS and MEDIA arrays. This copy feeds /ai, /ai/services and /ai/proof)

**Do not touch (Jon's explicit instruction):**

- `src/pages/ai/start.astro` (Start with AI)
- `src/pages/ai/blog.astro`, `src/pages/ai/blog/[slug].astro`, `src/content/ai-blog/*` (Insights)
- The "Insights" section on `ai.astro` (it renders post titles and descriptions from the blog collection; leave it alone)
- Page `<Base title=...>` and `description=...` meta tags on every page. They keep their SEO keywords.
- The `id` field of every SERVICES entry. Anchors such as `#websites` and `#reporting` must not change.
- The `body` field in REBUILDS. `/work` (src/pages/work.astro) renders it. Only the `line` field changes.

**House rules (from CLAUDE.md / prior handoffs):**

- No em dashes in client-facing copy.
- Positioning rule for /ai: always "we". Never a headcount, never a smallness confession, never implied human employees.
- Log the change as one dated line at the bottom of DECISIONS.md.
- Do not commit. Ask Jon first.

## 1. `src/lib/aiStudio.ts`

### SERVICES

**websites**
- blurb, current: `We design and build custom websites with AI doing the production and human direction on every call. No templates. No plugins to patch.`
- blurb, new: `We design and build custom websites with AI doing the production work and a person making every call. No templates. No plugins, no constant security updates.`
- detail, current: `Design comps, copy, code, images and search setup all come out of the same system, so a full rebuild moves in weeks, not seasons. Every page is static and fast. It's yours, and it stays editable after launch.`
- detail, new: `Design, writing, images and Google setup all come out of one process, so a full rebuild moves in weeks, not seasons. Every page loads fast. It's yours, and it stays editable after launch.`
- shipped: no change.

**automation**
- name: `Workflow & Office Automation` → `Office Automation`
- blurb: change only the last sentence. `Invoices, reports, member lists and inbox triage, done the same way every time.` → `Invoices, reports, member lists and inbox sorting, done the same way every time.`
- detail: no change.
- shipped, current: `Hosting-renewal invoicing on Zoho and 15 Apps Script files, plus reporting, member-list and posting automations.`
- shipped, new: `Automatic renewal invoices and reminders, plus monthly reports, member lists and social posts.`

**content**
- name: `AI Content Engines` → `AI Content in Your Voice`
- blurb, current: `We build pipelines that turn one idea into a steady run of posts and emails in your voice. You approve; the engine publishes.`
- blurb, new: `We set up a system that turns one idea into a steady run of posts and emails in your voice. You approve; it publishes.`
- detail: change only the middle sentence. `Drafts and scheduling run on rails.` → `Drafting and scheduling happen automatically.`
- shipped: no change.

**media**
- name: `Generative Media` → `AI Video & Photos`
- blurb, current: `We make hero films and photo composites from a written brief. Footage that fits your brand, no shoot day.`
- blurb, new: `We make website videos and edited photos from a written description. Footage that fits your brand, no shoot day.`
- detail, current: `Every clip is graded and compressed for the web, so it loads fast and loops clean. Every still is retouched by a human eye before it ships.`
- detail, new: `Every clip is color-corrected and sized for the web, so it loads fast and loops smoothly. Every still is retouched by a human eye before it goes live.`
- shipped, current: `Hero films, animation, 3D character work and hundreds of photo composites.`
- shipped, new: `Website videos, animation, 3D characters and hundreds of edited photos.`

**reporting**
- name: `AI Reporting & SEO Intelligence` → `Monthly Search Reports`
- blurb: no change.
- detail, current: `Rankings and Search Console data land in one place and get read against last month. You get what moved and what happens next.`
- detail, new: `Your Google rankings and traffic land in one place and get compared with last month. You get what moved and what happens next.`
- shipped, current: `A DataForSEO pipeline, Search Console audits, schema work and client report templates.`
- shipped, new: `Automated ranking reports, Google health checks and client report templates.`

**consulting**
- name, blurb, detail: no change.
- shipped, current: `A legal-sector AI engagement and workflow assessments for working businesses.`
- shipped, new: `AI guidance for a law firm, plus workflow reviews for working businesses.`

The name changes flow automatically into the /ai Home services teaser and the Service JSON-LD on /ai/services. Nothing else in the site imports SERVICES (checked: only ai.astro and ai/services.astro).

### REBUILDS

- Jon Wolf Studios `line`, current: `The founder's own site, built on the studio's follow-spot animation engine.`
- new: `The founder's own site, with a spotlight effect that follows your cursor.`
- Leave its `body` alone (/work uses it).

### SYSTEMS

- Item 1, `Hosting-renewal invoicing`, body current: `Renewals come due and invoices go out through Zoho, reminders on schedule. Fifteen Apps Script files carry the logic; a human reads the exceptions.`
- body new: `Renewals come due and invoices go out on their own, with reminders on schedule. A person only steps in when something looks off.`
- Item 4, name: `Monthly reporting pipeline` → `Monthly reports`. Body unchanged.

### MEDIA

- `Hero films` → name `Website videos`; body new: `Background videos made from a written description, then sized to load fast on a phone. This page is running one.`
- `Photo work` body new: `Hundreds of edited and combined photos. Product shots and staging that would have needed a shoot, finished by a human eye.`
- `Animation and 3D` body new: `Animated characters and motion graphics for brands that want to move, built without a production crew.`

## 2. `src/pages/ai.astro` (AI Home)

**Hero lede** (`.page-lede`). The H1 tagline is locked, do not touch it.
- current: `Live AI Studios is an AI-staffed studio: design, development, content, automation and media run by AI, directed by a human on every call.`
- new: `We use AI to build websites, write content, make videos and take busywork off your plate. A real person checks every piece before it reaches you.`

**The Model intro paragraph**
- `Take away the direction and you get slop.` → `Take away the direction and you get generic junk.`

**`model` array, item 01**
- title: `AI-staffed functions` → `AI does the heavy lifting`
- body, new: `Websites, writing, automation and video are all produced by AI, following written rules for how each job gets done.`
- points: no change.

**`model` array, item 02**
- body, current: `A human principal sets the brief and signs off on every output before it reaches you. AI does the work. Judgment stays human.`
- body, new: `A person sets the goal and approves every piece before you see it. AI does the work. Judgment stays human.`

**`servicePoints` object** (replace the whole object; keep the comment above it):

```ts
const servicePoints: Record<string, string[]> = {
  websites: ["Fast, secure, and yours to edit after launch", "12 full rebuilds, this site included"],
  automation: ["A short note when something needs a human", "Invoices and reminders that send on their own"],
  content: ["Your voice written down first, from your own words", "A newsletter, three blogs and a weekly comic strip"],
  media: ["Color-corrected and sized to load fast on a phone", "Website videos and hundreds of edited photos"],
  reporting: ["What moved this month, and what happens next", "Monthly search reports, written in plain English"],
  consulting: ["A short list of moves, in the order they pay off", "AI guidance for a law firm"],
};
```

**`proof` array**
- Item 2 points: `Zoho invoices and reminders on schedule` → `Invoices and reminders that go out on time, automatically`
- Item 3 title: `Media made from prompts` → `Videos and photos made with AI`
- Item 3 body, new: `Website videos and hundreds of edited photos, made from a written description and finished by a human eye.`
- Item 3 points: `This page's hero film is one of them` → `This page's background video is one of them`

## 3. `src/pages/ai/services.astro`

- The label `What we shipped` appears twice (card grid and detail blocks). Change both to `Work we've delivered`.
- Everything else on this page comes from aiStudio.ts (section 1).

## 4. `src/pages/ai/proof.astro`

**Hero lede**
- current: `1,258 projects and 13,317 exchanges in seven months. This is the work that came out the other end, by name.`
- new: `1,258 projects in seven months. Here's what came out of them, by name.`

**Rebuilt section head**
- h2 current: `{REBUILDS.length} sites, built by the system end to end.`
- h2 new: `{REBUILDS.length} websites, built start to finish with AI.`
- p current: `Every one directed by a human and signed off page by page. Different industries, one way of working.`
- p new: `A person reviewed and approved every page. Different industries, one way of working.`

**Media section head**
- eyebrow: `MEDIA MADE FROM PROMPTS` → `VIDEO AND PHOTOS, MADE WITH AI`
- h2: `Footage and imagery, written first.` → `Described in words. Delivered as video.`

Leave the eyebrow `REBUILT END TO END`, the Systems head and the close CTA as they are.

## 5. `src/pages/ai/how-it-works.astro`

**Hero lede**
- current: `An AI-staffed studio is not a chatbot bolted onto an agency. It's a working system with a human at the wheel. Here's how it runs.`
- new: `This isn't a chatbot bolted onto a web agency. AI does the work, and a person steers every step. Here's how it runs.`

**`steps` array, item 04 "Direct"**
- body current: `Human judgment on every output. Nothing reaches your customers until a person has read it and signed off.`
- body new: `A person checks everything. Nothing reaches your customers until it has been read and signed off.`

**`faq` array, "What tools do you use?"**
- answer, current: `Current AI models for writing and code, generative video tools for media, and proven plumbing underneath: Google Apps Script, Zoho, DataForSEO, Search Console, GitHub and Netlify. Where your business already runs on a tool, we build on it instead of replacing it.`
- answer, new: `The best current AI for writing, code and video, connected to dependable business tools behind the scenes. If you already use something like QuickBooks or Google Workspace, we build on it instead of replacing it.`
- The FAQPage JSON-LD is generated from the same array, so it updates on its own.

## DECISIONS.md line

Append:

```
- 2026-10-10: Plain-English copy pass on /ai, /ai/services, /ai/proof and /ai/how-it-works (plus SERVICES/REBUILDS/SYSTEMS/MEDIA in aiStudio.ts): insider terms (AI-staffed, human principal, shipped, pipeline, engine, static, hero films, composites, prompts, Zoho, Apps Script, DataForSEO, Search Console, slop) swapped for owner-readable copy. Service names now Office Automation, AI Content in Your Voice, AI Video & Photos, Monthly Search Reports (ids unchanged). "What we shipped" label is now "Work we've delivered". /ai/start, Insights and page meta tags untouched by Jon's instruction.
```

## Verify

1. `astro dev --background` if it isn't running. Load localhost:4321/ai.html, /ai/services.html, /ai/proof.html, /ai/how-it-works.html. No Vite error overlay.
2. Check each page at 1400px and 375px: no horizontal scroll, and the longer service names ("AI Content in Your Voice") don't break the card or teaser row layout.
3. Click the `How it works ↓` buttons on /ai/services and the services teaser rows on /ai. Anchors must still land on #websites, #automation, #content, #media, #reporting, #consulting.
4. Em dash check on the five edited files: `grep -n "—" src/pages/ai.astro src/pages/ai/services.astro src/pages/ai/proof.astro src/pages/ai/how-it-works.astro src/lib/aiStudio.ts`. Expect no new hits in copy (code comments are fine).
5. Leftover check, report only and change nothing: `grep -nE "AI-staffed|shipped|pipeline|Apps Script|DataForSEO|composite|slop" src/pages/ai.astro src/pages/ai/services.astro src/pages/ai/proof.astro src/pages/ai/how-it-works.astro`. Anything left in meta tags or code comments is expected.
6. Confirm `git diff --stat` touches only the five files above plus DECISIONS.md. Nothing in start.astro, blog.astro or src/content/ai-blog.

## Still open (ask Jon, don't act)

1. The Mosaic Collaborative card on /ai/proof (and /work) links to `https://mosaic-staging.netlify.app/`, a staging URL. Does it have a live domain yet?
2. Page meta titles and descriptions still use "AI-Staffed", "content engines" and "generative media" for SEO. Should they match the new plain wording?
3. Commit when Jon says so. The working tree may also hold other uncommitted work.
