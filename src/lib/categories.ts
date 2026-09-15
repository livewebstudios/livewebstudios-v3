/**
 * Blog categories. One category per post, seven in total, each with its own
 * archive page at /blog/category/<slug>. Tags stay as metadata only: with 67
 * posts most tags carry one or two, and thin archive pages hurt more than they
 * help, so they get no pages of their own.
 *
 * The order here is the order chips render in. Keep `name` matching the
 * `category:` string in frontmatter exactly.
 */
export type Category = {
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
    name: "Web Design",
    short: "Web Design",
    slug: "web-design",
    blurb: "What makes a site work, and what makes one quietly fail.",
    metaTitle: "Web Design Articles | Live Web Studios",
    metaDescription:
      "Web design writing from Jon Wolf at Live Web Studios: layout, colour, responsive design, UX, and the details that separate a site that works from one that just exists.",
  },
  {
    name: "SEO & Local Search",
    short: "SEO",
    slug: "seo-local-search",
    blurb: "Getting found by the people who are already looking for you.",
    metaTitle: "SEO & Local Search Articles | Live Web Studios",
    metaDescription:
      "Plain-English SEO and local search writing for small business owners: Google Business Profile, Search Console, rankings, and what SEO should actually cost.",
  },
  {
    name: "AI & Automation",
    short: "AI",
    slug: "ai-automation",
    blurb: "What AI actually does for a small business, minus the hype.",
    metaTitle: "AI & Automation Articles | Live Web Studios",
    metaDescription:
      "Honest writing on AI for small business: AI-built websites, custom web apps, what the tools can and cannot do, and where a real person still beats a model.",
  },
  {
    name: "Hosting & Performance",
    short: "Hosting",
    slug: "hosting-performance",
    blurb: "Speed, uptime, security. The parts nobody notices until they break.",
    metaTitle: "Hosting & Performance Articles | Live Web Studios",
    metaDescription:
      "Web hosting and site performance explained without the jargon: page speed, bounce rate, security, uptime, and the real cost of hosting that has gone stale.",
  },
  {
    name: "WordPress & Migration",
    short: "WordPress",
    slug: "wordpress-migration",
    blurb: "Why we left, how a move works, and what it costs to stay put.",
    metaTitle: "WordPress & Migration Articles | Live Web Studios",
    metaDescription:
      "Why Live Web Studios moved off WordPress, what a site migration actually involves, and how to tell whether your current platform is holding you back.",
  },
  {
    name: "Running a Business Online",
    short: "Business",
    slug: "business-online",
    blurb: "The website as a business asset, not a brochure.",
    metaTitle: "Running a Business Online | Live Web Studios",
    metaDescription:
      "Practical writing for owners: why your business needs a site, choosing a domain, blogging, analytics, reporting, and getting real value out of what you already have.",
  },
  {
    name: "LWS News",
    short: "News",
    slug: "lws-news",
    blurb: "What we are building, and what is changing around here.",
    metaTitle: "Live Web Studios News",
    metaDescription:
      "Announcements and behind-the-scenes notes from Live Web Studios: new work, how we build, and where the studio is heading.",
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
