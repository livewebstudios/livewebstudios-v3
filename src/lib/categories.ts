/**
 * Blog categories. Each gets its own archive page, and tags stay as metadata
 * only: with 67 posts most tags carry one or two, and thin archive pages hurt
 * more than they help, so they get no pages of their own.
 *
 * Jon 2026-09-15: twelve now, split by `audience`. The seven business ones
 * build at /blog/category/<slug>; the five musician ones at
 * /live-band-web-studios/blog/category/<slug>. Slugs are unique across both
 * sets, so bySlug stays a flat lookup.
 *
 * The order here is the order chips render in. Keep `name` matching the
 * `categories:` string in frontmatter exactly.
 */
export type Audience = "business" | "musicians";

export type Category = {
  /** Which blog this category belongs to. "business" = /blog (Live Web
      Studios), "musicians" = /live-band-web-studios/blog. */
  audience: Audience;
  /** Full name. The archive page's H1 and its <title>, so it stays descriptive. */
  name: string;
  /** Chip label. Short on purpose: the eight full names measured 1365px against
      1150px of usable row, so they wrapped to two rows and pushed the bar under
      the fold. Short nouns also scan faster in a chooser. */
  short: string;
  slug: string;
  blurb: string;
  metaTitle: string;
  metaDescription: string;
};

export const CATEGORIES: Category[] = [
  {
    audience: "business",
    name: "Web Design",
    short: "Web Design",
    slug: "web-design",
    blurb: "What makes a site work, and what makes one quietly fail.",
    metaTitle: "Web Design Articles | Live Web Studios",
    metaDescription:
      "Web design writing from Jon Wolf: layout, colour, responsive design, UX, and the details that separate a site that works from one that just exists.",
  },
  {
    audience: "business",
    name: "SEO & Local Search",
    short: "SEO",
    slug: "seo-local-search",
    blurb: "Getting found by the people who are already looking for you.",
    metaTitle: "SEO & Local Search Articles | Live Web Studios",
    metaDescription:
      "Plain-English SEO and local search writing for small business owners: Google Business Profile, Search Console, rankings, and what SEO should actually cost.",
  },
  {
    audience: "business",
    name: "AI & Automation",
    short: "AI",
    slug: "ai-automation",
    blurb: "What AI actually does for a small business, minus the hype.",
    metaTitle: "AI & Automation Articles | Live Web Studios",
    metaDescription:
      "Honest writing on AI for small business: AI-built websites, custom web apps, what the tools can and cannot do, and where a real person still beats a model.",
  },
  {
    audience: "business",
    name: "Hosting & Performance",
    short: "Hosting",
    slug: "hosting-performance",
    blurb: "Speed, uptime, security. The parts nobody notices until they break.",
    metaTitle: "Hosting & Performance Articles | Live Web Studios",
    metaDescription:
      "Web hosting and site performance explained without the jargon: page speed, bounce rate, security, uptime, and the real cost of hosting that has gone stale.",
  },
  {
    audience: "business",
    name: "WordPress & Migration",
    short: "WordPress",
    slug: "wordpress-migration",
    blurb: "Why we left, how a move works, and what it costs to stay put.",
    metaTitle: "WordPress & Migration Articles | Live Web Studios",
    metaDescription:
      "Why Live Web Studios moved off WordPress, what a site migration actually involves, and how to tell whether your current platform is holding you back.",
  },
  {
    audience: "business",
    name: "Running a Business Online",
    short: "Business",
    slug: "business-online",
    blurb: "The website as a business asset, not a brochure.",
    metaTitle: "Running a Business Online | Live Web Studios",
    metaDescription:
      "Practical writing for owners: why you need a site, choosing a domain, blogging, analytics, and getting real value out of what you already have.",
  },
  {
    audience: "business",
    name: "LWS News",
    short: "News",
    slug: "lws-news",
    blurb: "What we are building, and what is changing around here.",
    metaTitle: "Live Web Studios News",
    metaDescription:
      "Announcements and behind-the-scenes notes from Live Web Studios: new work, how we build, and where the studio is heading.",
  },
  /* ---- Live Band Web Studios (Jon 2026-09-15) ----------------------------
     Five categories for the musician-marketing blog at
     /live-band-web-studios/blog. Same shape as the LWS seven so one component
     renders both chip bars; `audience` is the only thing that separates them.
     Chip labels are short for the same reason they are short above: the row
     has to fit on one line at 1440 and stay scannable at 375. */
  {
    audience: "musicians",
    name: "Getting the Gig",
    short: "Getting the Gig",
    slug: "getting-the-gig",
    blurb:
      "Booking live work, pitching venues, and building the relationships that keep a calendar full.",
    metaTitle: "Getting the Gig | Live Band Web Studios Blog",
    metaDescription:
      "Booking live work, pitching venues, and building the relationships that keep a calendar full.",
  },
  {
    audience: "musicians",
    name: "Your Digital Footprint",
    short: "Digital Footprint",
    slug: "digital-footprint",
    blurb: "Websites and EPKs that help people find you and hire you.",
    metaTitle: "Your Digital Footprint | Live Band Web Studios Blog",
    metaDescription:
      "Websites and EPKs that help people find you and hire you.",
  },
  {
    audience: "musicians",
    name: "Social That Fills Rooms",
    short: "Social",
    slug: "social-that-fills-rooms",
    blurb:
      "Facebook and Instagram patterns that get people out to the show.",
    metaTitle: "Social That Fills Rooms | Live Band Web Studios Blog",
    metaDescription:
      "Facebook and Instagram patterns that get people out to the show.",
  },
  {
    audience: "musicians",
    name: "The Email List",
    short: "Email List",
    slug: "the-email-list",
    blurb: "The one audience no algorithm can take away from you.",
    metaTitle: "The Email List | Live Band Web Studios Blog",
    metaDescription:
      "The one audience no algorithm can take away from you.",
  },
  {
    audience: "musicians",
    name: "Working Smarter: AI and Real Numbers",
    short: "AI & Numbers",
    slug: "working-smarter",
    blurb:
      "AI research, monthly reports, and a marketing routine that fits around a gigging schedule.",
    metaTitle:
      "Working Smarter: AI and Real Numbers | Live Band Web Studios",
    metaDescription:
      "AI research, monthly reports, and a marketing routine that fits around a gigging schedule.",
  },
];

export const bySlug = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug);

export const byName = (name: string | undefined) =>
  CATEGORIES.find((c) => c.name === name);

/** Frontmatter categories -> Category objects, in CATEGORIES order so the
    labels always read in the same sequence rather than authoring order. */
export const resolve = (names: readonly string[] | undefined): Category[] =>
  CATEGORIES.filter((c) => (names ?? []).includes(c.name));

/** True when the post carries this category, primary or otherwise. */
export const has = (names: readonly string[] | undefined, name: string) =>
  (names ?? []).includes(name);

/** Categories for one blog. The chip bars and archive builders key off this. */
export const byAudience = (audience: Audience): Category[] =>
  CATEGORIES.filter((c) => c.audience === audience);
