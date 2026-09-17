# Live Band Web Studios blog: the thirty posts

Source spec: `~/Desktop/26_09_15_lbws-music-blog-and-crossover-handoff.md`
(sections 8 and 10 carry the voice rules and the per-article briefs).

The musician blog runs on the same content collection and the same templates as
the LWS blog. `audience: musicians` is the only thing that routes a post to
`/live-band-web-studios/blog` instead of `/blog`.

Thirty posts, all of them live at launch, spaced a week apart. Jon 2026-09-15:
the original plan dripped them out in batches of five between September and
December. That was dropped in favour of publishing the whole library at once,
so the series is dated backwards from launch day: #30 carries 2026-09-15 and
each earlier post steps back one Tuesday, putting #01 on 2026-02-24. Every date
is in the past, so all thirty render on the first build and the index reads as
a weekly cadence rather than thirty posts stamped with one morning.

Each post also carries `sortOrder:` 1 to 30, the order the series was written
in. With the dates spread out it never comes into play, and it stays as the
record of the intended reading order and as a tiebreak if two posts ever share
a timestamp.

The drip machinery is still in the codebase and still works. The future-date
filter in `src/lib/posts.ts` and the daily build in
`.github/workflows/scheduled-publish.yml` are both untouched, so a future post
written next year will hold itself back and publish on its own morning. Nothing
in the Live Band series depends on that any more.

---

## How a post gets published

1. Write the file as `src/content/blog/YYYY-MM-DD-<slug>.md`. The date prefix in
   the filename sets the URL slug (the prefix is stripped) and should match the
   `date:` in the frontmatter.
2. Frontmatter shape:

   ```yaml
   ---
   title: The Post Title
   audience: musicians
   categories: ["Getting the Gig"]        # exact name, see the five below
   date: 2026-03-31T06:00:00-04:00        # 06:00 America/New_York
   sortOrder: 6                           # reading order, and a same-date tiebreak
   description: "150 characters max. This is the Google snippet."
   imageAlt: A real description of the art, written from the direction in §8
   ---
   ```

   No `slug:` field: the filename is the slug. No `image:` field either, unless
   Jon has a specific file in mind. `bandImage()` in `src/lib/posts.ts` looks for
   `public/images/band/blog/<slug>.webp` on disk and falls back to the category
   placeholder, so dropping the art in later is a rename-and-commit job with no
   frontmatter edit.
3. The index sorts by date, newest first, then breaks ties on `sortOrder`,
   lowest first. A post without the field sorts behind the ones that have it.
   Because the Live Band dates are a week apart, the index runs newest first:
   the hub (#30) sits at the top and #01 at the bottom.
4. Commit and push. A post dated at or before the build renders immediately.

Get the offset right for the date. US Eastern is `-05:00` before Sunday 8 March
2026 and after Sunday 1 November 2026, and `-04:00` in between. Two posts in the
series, #01 and #07, sit in the winter half and carry `-05:00`.

The workflow cron is `30 11 * * *` (11:30 UTC), which lands after the 06:00 ET
stamp in both halves of the year, so it never needs a seasonal edit.

## The five categories

Use the full name in `categories:`, exactly as written here.

| Name in frontmatter | URL slug |
|---|---|
| `Getting the Gig` | `getting-the-gig` |
| `Your Digital Footprint` | `digital-footprint` |
| `Social That Fills Rooms` | `social-that-fills-rooms` |
| `The Email List` | `the-email-list` |
| `Working Smarter: AI and Real Numbers` | `working-smarter` |

A musician category on a business post (or the reverse) fails the build with a
named error. That is deliberate.

## Standing rules for every post

Read section 8 of the handoff in full. The short version:

- **Zero em dashes.** Period, comma, or an ellipsis. Never a spaced hyphen.
  This file holds itself to the same rule.
- 700 to 1,000 words. The hub post (#30) is 1,200 to 1,500.
- First person, Jon. A working musician who is also a 20-plus-year web guy.
  Experienced, never cocky. Grateful, and generous with what he learned.
  The site chrome around the posts (Day Job, Stage Door, Post CTA, author box)
  is third person.
- Open in the middle of a real situation. The answer to the title lands inside
  the first 150 words.
- Title Case H2 every 150 to 200 words. A skimmer reading only the H2s should
  get the argument.
- Vary sentence length hard. A fragment in the opening. Never three medium
  sentences in a row. No tidy triads.
- Casual transitions or none. "And." "But." "So." Never "Furthermore."
- No "While X, Y" and no "Not only... but also".
- Never invent an event, a venue, a crowd size, or a person. Never invent a
  statistic. Prefer no numbers at all; anything that is not common sense gets a
  `<!-- VERIFY -->` beside it. Where a real Jon story would help, leave one
  `<!-- JON: real story here? -->` comment.
- Name The British Invasion Years only in the author box, never in a body.
- Instruments appear as roles: guitarists, drummers, keyboard players, vocalists.
- **Out completely:** gear, instrument technique, recording, mixing, production,
  streaming services, music theory, lessons.
- Banned: utilize, leverage, synergy, solutions, comprehensive, seamless,
  cutting-edge, best-in-class, game-changing, delve, dive deep, robust,
  streamlined, elevate, unlock, journey, in today's digital landscape,
  passionate about music, musical journey, sonic, unforgettable experience,
  bring the house down, high-octane, high-energy, take your band to the next
  level.
- Templates, sample emails and example prompts go in a `<blockquote>`.
  Checklists can be a `<ul>`. Everything else is prose.
- **Link freely, 1 to 2 per post.** Every post is live, so any post may link any
  other. Use a plain relative href
  (`[text](what-venue-bookers-look-at-first.html)`). The hub is the exception:
  it links all 29. Jon 2026-09-15: this replaces the old backwards-only rule,
  which existed purely because of the drip schedule.
- Do not write a closing CTA paragraph. The Post CTA component follows the body.

Before finishing: `grep -rn "—" src/content/blog/<files>` must be empty,
`npm run build` must pass, and every in-body link must resolve.

---

## The library

All thirty are written and dated one week apart, ending on launch day. The
groupings below are the batches they were written in, kept because the Links
column is a useful map of how the posts reference each other.

### Launch pillars

| # | Published | Post | Slug | Category |
|---|---|---|---|---|
| 01 | Tue 24 Feb 2026 | What Venue Bookers Actually Look At First | `what-venue-bookers-look-at-first` | Getting the Gig |
| 07 | Tue 03 Mar 2026 | Why a Facebook Page Isn't a Website | `why-a-facebook-page-isnt-a-band-website` | Your Digital Footprint |
| 13 | Tue 10 Mar 2026 | The Four-Post Pattern That Sells a Show | `four-post-pattern-to-promote-a-gig` | Social That Fills Rooms |
| 19 | Tue 17 Mar 2026 | Your Email List Will Outlast Every Algorithm | `why-bands-need-an-email-list` | The Email List |
| 25 | Tue 24 Mar 2026 | Using AI to Research Venues and Talent Buyers in Your Region | `use-ai-to-research-venues-for-gigs` | Working Smarter |

### Batch 2

| # | Published | Post | Slug | Category | Links |
|---|---|---|---|---|---|
| 02 | Tue 31 Mar 2026 | The Sub List: How Musicians Get Called for Work They Never Applied For | `how-musicians-get-called-for-sub-work` | Getting the Gig | 01, 10 |
| 08 | Tue 07 Apr 2026 | What Belongs in an EPK Today (and What Bookers Skip) | `what-belongs-in-a-band-epk` | Your Digital Footprint | 01, 07 |
| 14 | Tue 14 Apr 2026 | Instagram Reels for Bands: 15 Seconds From the Stage | `instagram-reels-for-bands` | Social That Fills Rooms | 13 |
| 20 | Tue 21 Apr 2026 | Getting Signups at the Gig | `get-email-signups-at-gigs` | The Email List | 19 |
| 26 | Tue 28 Apr 2026 | Letting AI Draft Your Bio and Pitch Emails Without Sounding Like a Robot | `ai-band-bio-and-pitch-emails` | Working Smarter: AI and Real Numbers | 25, 08 |

### Batch 3

| # | Published | Post | Slug | Category | Links |
|---|---|---|---|---|---|
| 03 | Tue 05 May 2026 | Pitching a Venue Cold Without Sounding Like Spam | `how-to-pitch-a-venue-cold` | Getting the Gig | 01, 08 |
| 09 | Tue 12 May 2026 | Showing Up When Someone Searches "Wedding Band Near Me" | `local-seo-for-bands` | Your Digital Footprint | 07, 01 |
| 15 | Tue 19 May 2026 | Tag the Venue. Tag the Other Band. | `cross-promotion-for-bands` | Social That Fills Rooms | 13, 14 |
| 21 | Tue 26 May 2026 | The Monthly Band Newsletter That People Actually Open | `monthly-band-newsletter-template` | The Email List | 19, 20 |
| 27 | Tue 02 Jun 2026 | The Monthly Website Report: What Your Numbers Say About Your Audience | `monthly-website-report-for-bands` | Working Smarter: AI and Real Numbers | 09, 11 |

### Batch 4

| # | Published | Post | Slug | Category | Links |
|---|---|---|---|---|---|
| 04 | Tue 09 Jun 2026 | The Follow-Up That Gets You Rebooked | `follow-up-after-a-gig-to-get-rebooked` | Getting the Gig | 13, 29 |
| 10 | Tue 16 Jun 2026 | The Freelance Musician's Website | `website-for-freelance-musicians` | Your Digital Footprint | 02, 07 |
| 16 | Tue 23 Jun 2026 | A Month of Band Posts in One Afternoon | `batch-schedule-band-social-media` | Social That Fills Rooms | 13, 15 |
| 22 | Tue 30 Jun 2026 | Two Lists: Fans and Bookers | `separate-email-lists-fans-bookers` | The Email List | 19, 21 |
| 28 | Tue 07 Jul 2026 | Which Posts Actually Worked? Reading Facebook and Instagram Insights | `facebook-instagram-insights-for-bands` | Working Smarter: AI and Real Numbers | 13, 27 |

### Batch 5

| # | Published | Post | Slug | Category | Links |
|---|---|---|---|---|---|
| 05 | Tue 14 Jul 2026 | Your Best Marketing Happens at Load-Out | `musician-networking-at-load-out` | Getting the Gig | 04, 15 |
| 11 | Tue 21 Jul 2026 | Your Gig Calendar Is the Most Important Page on Your Site | `band-gig-calendar-page` | Your Digital Footprint | 01, 07 |
| 17 | Tue 28 Jul 2026 | What to Post When There's No Gig This Week | `what-bands-should-post-between-gigs` | Social That Fills Rooms | 13, 16 |
| 23 | Tue 04 Aug 2026 | Subject Lines for Musicians | `email-subject-lines-for-musicians` | The Email List | 21, 22 |
| 29 | Tue 11 Aug 2026 | A Simple Booking Pipeline | `simple-booking-pipeline-for-bands` | Working Smarter: AI and Real Numbers | 04, 25 |

### Batch 6

| # | Published | Post | Slug | Category | Links |
|---|---|---|---|---|---|
| 06 | Tue 18 Aug 2026 | Private Events and Corporate Work: Where Cover Bands Find Steady Income | `how-cover-bands-book-private-events` | Getting the Gig | 09, 24 |
| 12 | Tue 25 Aug 2026 | One Great Live Clip Beats Twenty Okay Ones | `choosing-the-best-live-video-for-your-band` | Your Digital Footprint | 01, 08 |
| 18 | Tue 01 Sep 2026 | Facebook Events vs. Regular Posts: What Gets People Out of the House | `facebook-events-vs-posts-for-gigs` | Social That Fills Rooms | 13, 15 |
| 24 | Tue 08 Sep 2026 | What to Send the Week After a Great Private Event | `follow-up-after-wedding-or-private-event` | The Email List | 06, 04 |
| 30 | Tue 15 Sep 2026 | The Two-Hours-a-Week Marketing System for Working Musicians (hub) | `marketing-system-for-working-musicians` | Working Smarter: AI and Real Numbers | all 29 |

#30 is the hub: 1,200 to 1,500 words, and its "The Full Library" section links
all 29 other posts grouped under H3s for the five category names, each group a
`<ul>`.

#29's brief also lists #03. It holds at two links per the standing rule, and
the related-posts component makes that connection anyway.

---

## Status

All thirty posts are written and dated weekly from Tue 24 Feb 2026 to Tue 15
Sep 2026, so the whole library goes live on the first build. Nothing has been
committed or pushed: Jon reviews first.

Art is in as well. Thirty post heroes, the five category fallbacks, the LBWS
blog hero and the Day Job strip image all live under `public/images/band/`.

Infrastructure from the original session 1 is unchanged: the schema `audience`
field, the LBWS blog index / category / post routes, chip bars and bridge chips,
Stage Door and Day Job strips, the author box, the Post CTA, footer bridge
lines, the arrow system, the LWS nav dropdown arrow fix, and the contact
`?source=live-band` tagging.

## Still on Jon's plate

- Review, commit and push. That is the whole launch now.
- Answer the five `<!-- JON: real story here? -->` comments and confirm the
  nine `<!-- VERIFY -->` claims.
- Create the Netlify build hook (Site configuration → Build & deploy → Build
  hooks) and add its URL as the GitHub repo secret `NETLIFY_BUILD_HOOK`. No
  longer urgent, since nothing is on a drip, but the workflow fails without it
  and it is what any future scheduled post will need.
- Mailchimp tags or segments for `musicians` and `business`.
- Social and newsletter posts promoting the series.
