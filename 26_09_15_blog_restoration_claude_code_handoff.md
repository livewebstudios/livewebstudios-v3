# HANDOFF: Restore the 42 lost blog posts
## Live Web Studios v3 | written 2026-09-15 | for a fresh Claude Code session

**Read this whole file before touching anything.** Everything needed to do the job
is already staged in `_restore/`. Nothing here blocks the v3 DNS cutover; this is a
separate project that can run before or after launch.

---

## 1. WHAT HAPPENED

When livewebstudios.com left WordPress, 42 blog posts were dropped. They are not on
the live site: all 42 dated URLs 301 to `/blog`, which is why the archive looks thin.
The redirect rules still name every one of them, in `public/_redirects` lines 130-172.

**Nothing was lost in the v3 rebuild.** All 22 posts from the current live site are in
v3 already, plus three more. This job is only about the 42 older ones.

### The sources, and which one wins

| Source | Posts | What you get |
|---|---|---|
| `_restore/wp-posts.json` | **33** | Full body text, real titles, real slugs, real dates. **Already extracted.** |
| Wayback Machine | **9** | Must be scraped; full body text confirmed present |
| Google Drive | 0 | Checked. Nothing. Do not go looking again. |

### Two copies exist. Know which one to reach for.

`~/Desktop/livewebs_wrdplws.sql` is the original 22 MB WordPress dump. It briefly went
missing during the 2026-09-15 session and was restored, so confirm it is there before
relying on it.

**You should not normally need it.** All 33 posts were already extracted into
`_restore/wp-posts.json`, which is committed, safe, and contains post content only.
Work from the JSON.

Only go back to the SQL if you need something the extraction did not capture, for
example featured-image references in `UZl3t99E_postmeta` (`_thumbnail_id`) or category
and tag assignments in `UZl3t99E_terms` / `UZl3t99E_term_relationships`. If you do,
read it in place and see the hard rule below.

**Do not re-run `extract-wp-posts.py` straight over `wp-posts.json`.** If the SQL is
missing or moved, the parser will happily write an empty result and destroy the only
convenient copy of the content. Write to a new filename and diff first.

### HARD RULE: the SQL dump never enters the repo

Full scan of the 22 MB file: **544 unique email addresses across 477 INSERT statements,
plus 2 WordPress password hashes.** This is a dump of the database that was
compromised. Where they sit:

| Table | Unique addresses | What it actually is |
|---|---|---|
| `gf_entry_meta` | **254** | **Gravity Forms submissions. Real people who filled in a contact form.** The genuinely sensitive one. |
| `posts` | 184 | Addresses inside page and post bodies, including spam-injected content |
| `postmeta` | 161 | Plugin settings, form notification targets, SEO fields |
| `wflogins` | 20 | **Wordfence login-attempt log. This is the record of the attack.** |
| `wffilemods` / `wfknownfilelist` | 16 | False positives from filenames (`...@latin.php`) |
| `oses_emails` | 3 | Sent-mail log, much smaller than first estimated |
| `users` / `usermeta` | 2 | The two WordPress accounts, matching the two password hashes |

Domain mix confirms a large share is bot noise rather than customers: `@wefwef.com`,
`@wef.com`, `@mail.ru`, `@yandex.com`, `@o5o5.ru`, `@2p-mail.com`, `@test.com` all
appear in volume. But `@gmail.com` (374 occurrences), `@hotmail.com`, `@outlook.com`
and `@yahoo.com` are real inquiries, and `gf_entry_meta` is real submitted data
regardless.

`.gitignore` blocks `_restore/*.sql` as a standing guard. Read it in place on the
Desktop. Never copy it into the project, never paste its contents into a commit, never
upload it anywhere, and never hand it to a tool that transmits file contents off the
machine.

`wp-posts.json` itself is clean, and this was checked rather than assumed: 33 rows,
all `post_type: post` and `post_status: publish`, and **zero email addresses of any
kind in any of the 33 bodies.** No users, no form entries, no Wordfence logs. Safe to
commit.

---

## 2. WHAT IS ALREADY STAGED

Everything in `_restore/` (committed, safe, no personal data):

| File | What it is |
|---|---|
| `extract-wp-posts.py` | Working parser. Walks the SQL VALUES list honouring quotes and backslash escapes. Run it and it re-emits `wp-posts.json`. |
| `wp-posts.json` | **The 33 posts, already extracted.** Full content, titles, slugs, dates. This is your input; you do not need to re-run the parser unless you want to. |
| `wayback-only.json` | The 9 posts that need scraping, with date, slug and the exact dated URL. |
| `dated-urls.txt` | All 42 as `old-dated-URL <TAB> slug`. This is the map for rewiring `_redirects`. |

To fetch a Wayback post, get its timestamp from the CDX API then request the `id_`
(raw, un-rewritten) capture:

```
http://web.archive.org/cdx/search/cdx?url=livewebstudios.com/2025/02/28/the-2025-state-of-the-website-report/&output=text&fl=timestamp&filter=statuscode:200&limit=1
http://web.archive.org/web/<TIMESTAMP>id_/https://livewebstudios.com/2025/02/28/the-2025-state-of-the-website-report/
```

Wayback rate-limits hard. Sleep 3-5 seconds between requests or you get 429s.

---

## 3. THE FULL INVENTORY, WITH TRIAGE

Jon's instruction: **rewrite the ones with dated content, keep the rest, do not lose
any of them.** Word counts are from the actual extracted body.

### Tier A: rewrite, content is genuinely dated (9 posts)

| Date | Words | Slug | Why |
|---|---|---|---|
| 2023-04-12 | 1070 | `chatgpt-interviews-jon-wolf` | ChatGPT-era framing. **Longest post in the archive and the most distinctive.** Worth real effort. |
| 2023-04-12 | 378 | `how-chatgpt-is-changing-web-design` | 2023 AI framing, superseded by the v3 AI pages |
| 2023-05-01 | 269 | `is-search-engine-optimization-seo-dead-in-2023-short-answer-no` | Year is in the slug and the title |
| 2023-05-03 | 361 | `how-can-chatgpt-help-my-business-any-type-of-business` | 2023 AI framing |
| 2023-05-03 | 217 | `i-asked-chatgpt-if-a-bowl-of-chili-can-help-my-business` | 2023 AI framing, but the premise is good and very Jon |
| 2022-12-28 | 448 | `how-to-create-a-professional-website-on-a-budget` | WordPress-centric + builder comparison |
| 2022-12-28 | 371 | `the-advantages-of-using-a-website-builder` | Builder comparison, contradicts current positioning |
| 2015-07-08 | 633 | `web-design-basics-2` | WordPress-centric, 11 years old |
| 2023-04-18 | 91 | `new-animated-logo-for-our-company-how-we-can-help-you` | 91 words. Too thin to publish. Expand or drop. |

**Note on the ChatGPT posts:** they are not worthless, they are *early*. Jon was
writing about AI in April 2023. Reframing them as "here is what I said then, here is
what actually happened" is stronger than pretending they are new, and it keeps the
original date honest. Recommend that angle.

### Tier B: light edit, evergreen but thin (22 posts)

All the 2022-12-26 to 2022-12-29 batch plus the early ones. 210-430 words each,
generic web-design advice, no dated references. They read like filler because they
were published 18 at a time over four days.

```
5-reasons-your-business-needs-a-professional-website        330w
the-importance-of-mobile-friendly-website-design            250w
how-to-choose-the-right-web-hosting-provider-for-your-business 389w
the-benefits-of-responsive-web-design                       309w
why-your-small-business-needs-a-website                     352w
the-essential-elements-of-a-successful-website              398w
web-design-tips-for-a-better-user-experience                430w
the-role-of-search-engine-optimization-seo-in-web-design    371w
5-common-web-design-mistakes-to-avoid                       307w
the-benefits-of-custom-web-design-for-your-business         312w
the-benefits-of-a-content-management-system-cms-for-your-website 335w
how-to-choose-the-best-domain-name-for-your-website         364w
the-importance-of-a-strong-web-presence-for-your-business   278w
web-design-best-practices-for-e-commerce-websites           373w
the-benefits-of-having-a-blog-on-your-website               353w
the-importance-of-website-security-and-how-to-protect-your-site 380w
the-role-of-social-media-in-web-design-and-marketing        210w
is-color-important-2                                        286w
5-crucial-things-your-website-might-be-missing              233w
getting-the-most-value-out-of-your-website                  350w
website-hosting-basics-for-non-techies                      369w
you-really-dont-have-a-google-business-account-yet          259w
```

**DECIDED by Jon, 2026-09-15: run every one of them through `/jonvoice`.**

Not consolidated, not restored as-is. All 22 keep their own URL and their own original
date, and each body goes through the `/jonvoice` skill so it stops reading like the
generic filler it currently is. The facts in them are fine; the voice is not.

Apply the same pass to Tier A and Tier C bodies after their rewrite, so all 42 come
out in one consistent voice rather than three.

### Tier C: the 9 Wayback-only posts (scrape first, then triage)

| Date | Slug |
|---|---|
| 2024-02-22 | `celebrating-20-years-of-innovation-unveiling-our-new-website-and-a-special-gift-for-you` |
| 2024-03-05 | `elevate-your-brand-unleash-the-power-of-modern-design-and-digital-innovation` |
| 2024-03-26 | `elevate-your-brand-with-a-second-website` |
| 2024-12-07 | `how-seo-services-can-help-your-business-grow` |
| 2025-01-17 | `how-business-owners-can-profit-from-seo-driven-traffic` |
| 2025-02-28 | `the-2025-state-of-the-website-report` |
| 2025-04-04 | `what-we-do-for-our-hosting-customers` |
| 2026-01-24 | `new-for-2025-custom-web-apps-smart-business-tools-built-just-for-you` |
| 2026-01-27 | `how-americans-are-integrating-ai-into-the-workplace` |

`the-2025-state-of-the-website-report` is verified recoverable with full body text; it
was the test case. `new-for-2025-...` has a stale year in the slug and will need the
Tier A treatment.

---

## 4. DATES: KEEP THEM, AND KNOW WHICH ONE IS RIGHT

Jon asked to "predate them correctly." Two traps.

**Trap 1: the old dated URLs lie.** The WordPress permalinks were renumbered at some
point. `web-design-basics-2` and `is-color-important-2` sit at `/2022/03/20/` and
`/2022/04/20/` in the URL, but their real `post_date` in the database is
**2015-07-08**. `5-crucial-things-your-website-might-be-missing` is **2016-03-28**, not
2022. **The `post_date` in `wp-posts.json` is the truth. The URL is not.**

**Trap 2: the `-2` slug suffix.** `web-design-basics-2` and `is-color-important-2`
carry a WordPress duplicate-slug suffix. Drop it for the new canonical slug
(`web-design-basics`, `is-color-important`) and redirect the old dated URL to the
clean one.

**Rule:** `date:` in frontmatter is the original `post_date`. If a post is rewritten,
the original date still stands and you add a line in the body saying when and why it
was updated. Do not republish a 2015 post as 2026. Google notices, and it is dishonest.

---

## 5. CONTENT SHAPE: WHAT YOU ARE CONVERTING

- **8 posts carry Divi shortcodes** (`et_pb_text`, `et_pb_section`, `et_pb_row`,
  `et_pb_column`, `et_pb_video`). Strip them completely. They are layout scaffolding,
  not content. Two also carry `et_pb_video` which means a video was embedded; check
  what it pointed at before deleting.
- **22 of the 33 have zero inline images.** Only 13 `<img>` tags exist across the whole
  set, and their `src` values point at WordPress upload paths that no longer resolve.
- Bodies are WordPress-flavoured HTML. Convert to clean markdown. Keep real headings,
  lists and links; drop inline styles, `<div>` wrappers and empty `<p>`s.
- **Every internal link in a converted body must be relative** (`../services/seo`,
  `../blog/some-post`) per the path rule in `~/.claude/CLAUDE.md`. Do not carry over
  absolute `https://livewebstudios.com/...` links from WordPress.

### Target frontmatter

Match the existing collection exactly. Schema is in `src/content.config.ts`. Filename
is `src/content/blog/YYYY-MM-DD-slug.md` and the route strips the date prefix, so
`2023-05-28-nobody-likes-a-slow-website.md` serves at `/blog/nobody-likes-a-slow-website`.

```yaml
---
title: "Nobody Likes a Slow Website"
date: 2023-05-28
description: "One or two sentences. Under 155 characters. This is the grey line Google prints under the link, so write it like a search result, not like a summary."
image: "/images/blog/nobody-likes-a-slow-website.jpg"
tags: ["hosting", "performance"]
draft: false
---
```

`image` stays root-relative in frontmatter (Decap stores it that way);
`blog/[slug].astro` strips the leading slash and emits a relative path. Do not
"fix" it to relative in the frontmatter or you break the Decap editor.

---

## 6. IMAGES: 42 REAL PHOTOGRAPHS, NOT AI

Jon was explicit: **real photos, nothing that looks AI-generated.** This is the
biggest single chunk of work in the project.

### Specification

- **1376 x 768** (16:9). This matches the existing 20 blog heroes exactly, so the
  restored posts sit in the same grid with no layout drift.
- **JPEG, quality 82, progressive.** The current library was just recompressed to
  this standard; match it or the new ones will be the heaviest files on the site.
- Target **under 250 KB each**. The existing heroes land around 150-200 KB.
- Save to `public/images/blog/<slug>.jpg`.
- **Every one needs real alt text** describing the photograph, not repeating the
  post title. The current blog heroes use the title as alt, which is a miss worth not
  repeating.

### Sourcing, in order of preference

1. **Jon's own photographs.** He is a photographer and runs Live Web Photos. Desk
   shots, screens, client sites in the wild, North Jersey streets and storefronts.
   This is the only option that is genuinely his and it makes the archive feel like
   one body of work. Ask him what he already has before sourcing anything else.
2. **Unsplash / Pexels**, filtered hard for photographs that do not read as stock:
   no handshakes, no smiling teams at laptops, no glowing blue circuit-board
   abstractions, no "businessman touching a floating interface." Prefer real desks,
   real hands, real streets, real machinery, real paper.
3. **Do not generate them.** The instruction was explicit. Generated images are the
   exact thing Jon has flagged as an AI tell elsewhere, and 42 of them at once would
   be obvious.

### Practical note

42 images is a lot of decisions. Suggest batching by theme: the 22 Tier B posts split
into maybe 6 visual families (hosting, speed, SEO, design, security, e-commerce), and
a family can share a visual language without sharing a file. Tier A posts get
individual attention because they are the ones worth reading.

---

## 7. REWIRING THE REDIRECTS

This is the step that turns 42 dead redirects into 42 live pages. `public/_redirects`
lines 130-172 currently look like:

```
/2023/05/28/nobody-likes-a-slow-website/     /blog     301
```

Each becomes:

```
/2023/05/28/nobody-likes-a-slow-website/     /blog/nobody-likes-a-slow-website     301
```

`_restore/dated-urls.txt` is the map: old dated URL, tab, slug.

**Three cautions:**

- The **dated URL keeps its original wrong date** (`/2022/03/20/web-design-basics-2/`)
  because that is what is indexed and bookmarked. Only the target changes.
- Lines 176+ hold **undated duplicates** of the same slugs
  (`/new-animated-logo-for-our-company-how-we-can-help-you/`). Retarget those too or
  you get a redirect chain, which the current audit is clean of and should stay clean of.
- **Netlify applies the first matching rule.** These sit below the v3 canonical block.
  Do not reorder them.

---

## 8. VERIFICATION: DO NOT SKIP

Run all of these before declaring done. The v3 launch audit is currently clean on
every one of them and it has to stay that way.

```bash
npm run build                    # expect 79 + N pages, no warnings
```

1. **Link check.** Currently **0 broken out of 6,868** local refs. Must stay 0.
2. **Redirect graph.** Currently **135 rules, no loops, no chains, no dead targets.**
   After rewiring, re-check that every new target actually resolves to a built page.
3. **Live sitemap parity.** Currently **66/66, zero misses.** Restoring posts only
   adds URLs, so this must stay 66/66.
4. **Single H1 per page.** Every restored post must have exactly one.
5. **Em dash scan.** Zero in visible copy across the whole site right now. WordPress
   content is full of them, so **this is the check most likely to fail.** Replace with
   ellipsis for a pause, a new sentence for a pivot, a comma for an appositive.
6. **Banned phrases.** Zero right now, including in titles and meta. Watch for
   "Submit", "Click Here", bare "Learn More" in old WordPress copy.
7. **Path rule.** No `href="/"` or `src="/"` in any converted body, and no absolute
   `https://livewebstudios.com/...` internal links.
8. **Titles under 60 chars, descriptions under 155.** Several of these slugs are very
   long, so the titles will need separate short SEO versions.
9. **Image dimensions and weight.** 1376x768, under 250 KB, real alt text.
10. **Schema.** `blog/[slug].astro` already emits BlogPosting with `image`,
    `dateModified`, `mainEntityOfPage` and publisher logo. Restored posts inherit it
    for free. Just confirm `image` resolves for each.

---

## 9. SUGGESTED SESSION SPLIT

The 6-task-per-session cap in `~/.claude/CLAUDE.md` applies. This does not fit in one
session. Suggested order:

| Session | Scope |
|---|---|
| **1** | Scrape the 9 Wayback posts into JSON. Convert all 42 to markdown with correct dates, Divi stripped, links relativised. **No images yet, no rewriting yet.** Set `draft: true` on all of them so nothing publishes early. |
| **2** | Rewire `_redirects`. Run the full verification list. Confirm build is clean with 42 drafts present. |
| **3** | Tier A rewrites (9 posts), `/jonvoice` pass. |
| **4** | Tier B `/jonvoice` pass (22 posts), assuming Jon picks option 2 in section 3. |
| **5** | Images. Probably two sessions on its own. |
| **6** | Flip `draft: false`, final verification, submit updated sitemap to Search Console. |

Keeping everything `draft: true` until the end means you can commit and deploy at any
point without publishing half-finished work.

---

## 10. FIRST THING TO DO IN THE NEW SESSION

Ask Jon the three open questions before writing any code:

1. **Tier B: restore as-is, `/jonvoice` pass, or consolidate?** (Section 3. Recommend
   the `/jonvoice` pass.)
2. **`new-animated-logo-for-our-company-how-we-can-help-you` is 91 words.** Expand it
   or let it stay redirecting to `/blog`?
3. **Images: what does he already have?** Before anyone opens Unsplash.

Then read `_restore/wp-posts.json` and start. The data is all there.

---

*Live Web Studios, Est. 2004 | livewebstudios.com | jonwolf@livewebstudios.com*
