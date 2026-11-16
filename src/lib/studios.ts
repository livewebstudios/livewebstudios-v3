/**
 * studios.ts: the five studios and every nav list that hangs off them.
 *
 * One source for the studio strip, the per-studio nav, the Services mega menu
 * and the home hero cards (Jon 2026-11-16, five-studio navigation). Hrefs are
 * site-root keys with no leading slash ("ai/services.html"); the component
 * that renders them adds relPrefix(), so every link stays relative per the
 * LWS path rule. A full https:// URL is passed through untouched.
 */

export type StudioKey = "lws" | "band" | "ai" | "lwp" | "ns";

export interface Studio {
  key: StudioKey;
  /** Strip label at desktop width. */
  name: string;
  /** Strip label under 980px. */
  short: string;
  /** Studio home. */
  href: string;
}

/* Live Web Photos moves in during session 5 of the handoff. Until its pages
   exist in src/pages, every Live Web Photos link falls back to the address it
   has today on livewebphotos.com, so no build of this branch ships a link to
   a page that is not there. The glob is resolved at build time: the day
   live-web-photos.astro lands, every link below flips to the new address with
   no edit here. */
const lwpLive =
  Object.keys(import.meta.glob("../pages/live-web-photos.astro")).length > 0;
const LWP_OLD = "https://livewebphotos.com/";
const lwp = (next: string, old: string) => (lwpLive ? next : `${LWP_OLD}${old}`);

export const studios: Studio[] = [
  { key: "lws", name: "Live Web Studios", short: "Live Web", href: "index.html" },
  { key: "band", name: "Live Band Web Studios", short: "Live Band", href: "live-band-web-studios.html" },
  { key: "ai", name: "LiveAiStudios", short: "LiveAi", href: "ai.html" },
  { key: "lwp", name: "Live Web Photos", short: "Photos", href: lwp("live-web-photos.html", "") },
  { key: "ns", name: "Namesake", short: "Namesake", href: "namesake.html" },
];

export const studioByKey = (key: StudioKey) =>
  studios.find((s) => s.key === key) as Studio;

/* Strict prefixes on purpose. A bare includes("/ai") also catches
   /services/ai-platform, and includes("/namesake") would catch any blog post
   with the word in its slug. */
const section = (name: string) => new RegExp(`^/${name}(\\.html|/|$)`);
const isBand = section("live-band-web-studios");
const isAi = section("ai");
const isLwp = section("live-web-photos");
const isNs = section("namesake");

export function studioFromPath(pathname: string): StudioKey {
  if (isBand.test(pathname)) return "band";
  if (isAi.test(pathname)) return "ai";
  if (isLwp.test(pathname)) return "lwp";
  if (isNs.test(pathname)) return "ns";
  return "lws";
}

/** Resolve a studios.ts href against a page's relPrefix. A full URL, an
    on-page "#anchor" and an href a page has already made relative ("../x")
    pass through untouched. */
export const link = (rel: string, href: string) =>
  /^(https?:\/\/|#|\.\.?\/)/.test(href) ? href : `${rel}${href}`;

/* ---- Per-studio nav -------------------------------------------------- */

export interface NavItem {
  label: string;
  href: string;
  /** Opens a small dropdown of [label, href] rows under the item. */
  children?: [string, string][];
}

export interface StudioNav {
  /** aria-label for the <nav>. */
  label: string;
  logo: { src: string; alt: string; width: number; height: number };
  links: NavItem[];
  cta: { label: string; href: string };
}

/* The parent links. Rendered as the main nav on Live Web Studios pages, as
   the compact panel under the Live Web Studios strip tab on a sub-site, and
   as the boxed group at the foot of a sub-site's mobile sheet. */
export const lwsLinks: NavItem[] = [
  { label: "Work", href: "work.html" },
  { label: "Services", href: "services.html" },
  { label: "About", href: "about.html" },
  { label: "Contact", href: "contact.html" },
];

export const aboutRows = [
  { title: "Our Story", sub: "23 years in, just getting started", href: "about.html" },
  { title: "Blog", sub: "Web design, AI, SEO, and tangents", href: "blog.html" },
  { title: "FAQ", sub: "Straight answers, no sales pitch", href: "faq.html" },
];

const caseStudies: [string, string][] = [
  ["Virtual Staging", lwp("live-web-photos/case-studies/real-estate.html", "case-studies/real-estate.html")],
  ["Product Photos", lwp("live-web-photos/case-studies/ecommerce.html", "case-studies/ecommerce.html")],
  ["Architectural", lwp("live-web-photos/case-studies/architecture.html", "case-studies/architecture.html")],
  ["Interior Design", lwp("live-web-photos/case-studies/interior-design.html", "case-studies/interior-design.html")],
  ["Floral & Specialty", lwp("live-web-photos/case-studies/floral.html", "case-studies/floral.html")],
];

const bandForms: [string, string][] = [
  ["Band Bio Form", "live-band-web-studios/forms/band-bio-form.html"],
  ["Band Member Bio Form", "live-band-web-studios/forms/band-member-bio-form.html"],
  ["Music Photo Form", "live-band-web-studios/forms/music-photo-form.html"],
  ["Music Photo Instructions", "live-band-web-studios/forms/how-to-photograph-yourself-for-ai.html"],
];

export const studioNav: Record<StudioKey, StudioNav> = {
  lws: {
    label: "Primary",
    logo: { src: "images/logoRGB.png", alt: "Live Web Studios", width: 800, height: 245 },
    links: lwsLinks,
    cta: { label: "Let's Talk", href: "contact.html" },
  },
  /* Order and labels match the live site. "Forms" stays a real link and also
     opens a dropdown of the four form pages. */
  band: {
    label: "Live Band Web Studios",
    logo: { src: "images/logo-live-band-gold.png", alt: "Live Band Web Studios", width: 681, height: 300 },
    links: [
      { label: "Home", href: "live-band-web-studios.html" },
      { label: "Pricing", href: "live-band-web-studios/pricing.html" },
      { label: "Forms", href: "live-band-web-studios/forms.html", children: bandForms },
      { label: "Personal Sites", href: "live-band-web-studios/personal-sites.html" },
      { label: "Portfolio", href: "live-band-web-studios/portfolio.html" },
      { label: "Blog", href: "live-band-web-studios/blog.html" },
    ],
    cta: { label: "Let's Talk", href: "contact.html" },
  },
  ai: {
    label: "LiveAiStudios",
    logo: { src: "images/studios/live-ai-studios.png", alt: "LiveAiStudios", width: 480, height: 56 },
    links: [
      { label: "Home", href: "ai.html" },
      { label: "Services", href: "ai/services.html" },
      { label: "Proof", href: "ai/proof.html" },
      { label: "How It Works", href: "ai/how-it-works.html" },
      /* Also lights up on every /ai/blog/<slug> article. */
      { label: "Insights", href: "ai/blog.html" },
    ],
    cta: { label: "Start With AI", href: "ai/start.html" },
  },
  lwp: {
    label: "Live Web Photos",
    logo: { src: "images/lwp-logo-magenta.png", alt: "Live Web Photos", width: 849, height: 160 },
    links: [
      { label: "Services", href: lwp("live-web-photos/services.html", "services.html") },
      { label: "AI Portraits", href: lwp("live-web-photos/ai-portraits.html", "professional-portfolio.html") },
      {
        label: "Case Studies",
        href: lwp("live-web-photos/case-studies.html", "case-studies.html"),
        children: caseStudies,
      },
      { label: "Pricing", href: lwp("live-web-photos/pricing.html", "pricing.html") },
      /* Session 5 files the nine photo posts under one category of the main
         blog; this link goes to that category page. */
      { label: "Blog", href: lwp("blog/category/photos-images.html", "blog.html") },
      { label: "About", href: lwp("live-web-photos/about.html", "about.html") },
    ],
    cta: { label: "Get a Free Sample", href: lwp("live-web-photos/contact.html", "contact.html") },
  },
  ns: {
    label: "Namesake",
    logo: { src: "images/studios/namesake-logo-horizontal-dark.svg", alt: "Namesake", width: 1710, height: 400 },
    links: [
      { label: "Overview", href: "namesake.html" },
      { label: "How It Works", href: "namesake/how-it-works.html" },
      { label: "Start", href: "namesake/start.html" },
    ],
    cta: { label: "Start Yours", href: "namesake/start.html" },
  },
};

/* ---- Services mega menu ---------------------------------------------- */

export interface ServicePane {
  key: StudioKey;
  /** Left-rail row. Clicking it goes to the studio home. */
  rail: string;
  cols: { heading: string; links: [string, string][] }[];
}

/* Cross-listing is deliberate (Jon 2026-11-16): AI Platform sits under Web
   Services and AI, AI Image under Photo/Image and AI. One page each, two menu
   entries. */
export const servicePanes: ServicePane[] = [
  {
    key: "lws",
    rail: "Web Services",
    cols: [
      {
        heading: "Build",
        links: [
          ["Website Design", "services/website-design.html"],
          ["E-Commerce", "services/ecommerce.html"],
          ["Hosting", "services/hosting.html"],
          ["Maintenance Plans", "services/maintenance-plans.html"],
          ["SEO & Marketing", "services/seo.html"],
          ["AI Platform", "services/ai-platform.html"],
        ],
      },
      {
        heading: "Brand",
        links: [
          ["Branding", "services/branding.html"],
          ["Logo Design", "services/logo-design.html"],
          ["Custom Styles & Cards", "services/custom-styles-and-carousel-cards.html"],
          ["Consulting", "services/consulting.html"],
        ],
      },
      { heading: "Legal", links: [["Expert Witness", "services/expert-witness.html"]] },
    ],
  },
  {
    key: "band",
    rail: "Band/Musician Services",
    cols: [
      {
        heading: "Band sites",
        links: [
          ["Live Band Home", "live-band-web-studios.html"],
          ["Pricing", "live-band-web-studios/pricing.html"],
          ["Personal Sites", "live-band-web-studios/personal-sites.html"],
          ["Portfolio", "live-band-web-studios/portfolio.html"],
        ],
      },
      { heading: "Forms", links: bandForms },
      { heading: "Read", links: [["Live Band Blog", "live-band-web-studios/blog.html"]] },
    ],
  },
  {
    key: "ai",
    rail: "AI Workflow/Automation Services",
    cols: [
      {
        heading: "Services",
        links: [
          ["Office Automation", "ai/services.html#automation"],
          ["AI Content in Your Voice", "ai/services.html#content"],
          ["AI Video & Photos", "ai/services.html#media"],
          ["Monthly Search Reports", "ai/services.html#reporting"],
        ],
      },
      {
        /* Three of these moved under /ai on 2026-11-16 (handoff section 4).
           AI Platform and AI Image stay under /services, cross-listed. */
        heading: "More AI services",
        links: [
          ["AI Platform", "services/ai-platform.html"],
          ["AI Business Services", "ai/business-services.html"],
          ["AI Workflow", "ai/workflow.html"],
          ["AI Image", "services/ai-image.html"],
          ["Email Writing", "ai/email-writing.html"],
        ],
      },
      {
        heading: "LiveAiStudios",
        links: [
          ["Home", "ai.html"],
          ["Proof", "ai/proof.html"],
          ["How It Works", "ai/how-it-works.html"],
          ["Insights", "ai/blog.html"],
          ["Start With AI", "ai/start.html"],
        ],
      },
    ],
  },
  {
    key: "lwp",
    rail: "Photo/Image Services",
    cols: [
      {
        heading: "Services",
        links: [
          ["Services", lwp("live-web-photos/services.html", "services.html")],
          ["AI Portraits", lwp("live-web-photos/ai-portraits.html", "professional-portfolio.html")],
          ["AI Image", "services/ai-image.html"],
          ["Pricing", lwp("live-web-photos/pricing.html", "pricing.html")],
        ],
      },
      { heading: "Case studies", links: caseStudies },
      {
        heading: "Live Web Photos",
        links: [
          ["Home", lwp("live-web-photos.html", "")],
          ["About", lwp("live-web-photos/about.html", "about.html")],
          ["Get a Free Sample", lwp("live-web-photos/contact.html", "contact.html")],
        ],
      },
    ],
  },
  {
    key: "ns",
    rail: "Personal Site Services",
    cols: [
      {
        heading: "Namesake",
        links: [
          ["Overview", "namesake.html"],
          ["How It Works", "namesake/how-it-works.html"],
          ["Start Yours", "namesake/start.html"],
        ],
      },
    ],
  },
];

/* ---- Ticker ----------------------------------------------------------- */

export interface TickerItem {
  label: string;
  /** A site-root key like the rest of this file, or anything link() passes
      through: a full URL, an on-page "#anchor", a page-relative "../x". */
  href: string;
}

/* What the ticker at the foot of the hero rotates (Jon 2026-11-16, handoff
   section 2). One list per studio: Marquee.astro picks the list for the page
   it is on, so the studio home, its blog, About, Contact and FAQ all run the
   same one. A service page and an industry page pass their own list instead.

   Every item is a link. An item with no page of its own goes to the nearest
   real page or to the section that covers it, never to an invented address. */
const BAND = "live-band-web-studios.html";

export const tickerItems: Record<StudioKey, TickerItem[]> = {
  lws: [
    { label: "Website Design", href: "services/website-design.html" },
    { label: "E-Commerce", href: "services/ecommerce.html" },
    { label: "Hosting", href: "services/hosting.html" },
    { label: "Maintenance Plans", href: "services/maintenance-plans.html" },
    { label: "SEO & Marketing", href: "services/seo.html" },
    { label: "Branding", href: "services/branding.html" },
    { label: "Logo Design", href: "services/logo-design.html" },
    /* A LiveAiStudios page since 2026-11-16 (handoff section 4). */
    { label: "AI Workflow", href: "ai/workflow.html" },
    { label: "Consulting", href: "services/consulting.html" },
    { label: "Expert Witness", href: "services/expert-witness.html" },
  ],
  /* None of the first seven has a page of its own. They are what the "What We
     Build" cards on the Live Band home cover (#kit): Full Band Sites lists gig
     pages, galleries, video and set lists, and the EPK card lists the tech
     rider and the stage plot. The last two follow the hero's own links. */
  band: [
    { label: "Gig Pages", href: `${BAND}#kit` },
    { label: "Galleries", href: `${BAND}#kit` },
    { label: "Video", href: `${BAND}#kit` },
    { label: "Set Lists", href: `${BAND}#kit` },
    { label: "EPK Pages", href: `${BAND}#kit` },
    { label: "Tech Rider", href: `${BAND}#kit` },
    { label: "Stage Plot", href: `${BAND}#kit` },
    { label: "SEO Built In", href: `${BAND}#seo` },
    { label: "You Can Edit It", href: "live-band-web-studios/pricing.html" },
  ],
  ai: [
    { label: "Office Automation", href: "ai/services.html#automation" },
    { label: "AI Content in Your Voice", href: "ai/services.html#content" },
    { label: "AI Video & Photos", href: "ai/services.html#media" },
    { label: "Monthly Search Reports", href: "ai/services.html#reporting" },
    /* AI Workflow moved under /ai on 2026-11-16. AI Platform did not: it
       stays a Live Web Studios page and is cross-listed here. */
    { label: "AI Workflow", href: "ai/workflow.html" },
    { label: "AI Platform", href: "services/ai-platform.html" },
  ],
  /* Defined now, rendered from session 5 on, when the Live Web Photos pages
     land. Until then these resolve to livewebphotos.com like the nav does. */
  lwp: [
    ...caseStudies.map(([label, href]) => ({ label, href })),
    { label: "AI Portraits", href: lwp("live-web-photos/ai-portraits.html", "professional-portfolio.html") },
  ],
  /* The four kinds of people are named in the Namesake home hero and have no
     page each, so they go to the studio home. "Built Around You" lands on the
     process section, whose heading says the same thing. */
  ns: [
    { label: "Executives", href: "namesake.html" },
    { label: "Founders", href: "namesake.html" },
    { label: "Attorneys", href: "namesake.html" },
    { label: "Performers", href: "namesake.html" },
    { label: "Built Around You", href: "namesake.html#work" },
    { label: "Not a Template", href: "namesake.html" },
  ],
};

/* Service pages: the ticker lists what the service includes, read from the
   page's own feature array, and each item jumps to its row. IncludedList
   stamps the matching id on the row when it is given `anchors`. */
const slug = (s: string) =>
  s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const featureAnchor = (title: string) => `inc-${slug(title)}`;

export const tickerFromFeatures = (features: { title: string }[]): TickerItem[] =>
  features.map((f) => ({ label: f.title, href: `#${featureAnchor(f.title)}` }));

/* ---- Home hero cards ------------------------------------------------- */

export const studioCards: { key: StudioKey; label: string; desc: string }[] = [
  { key: "band", label: "Musicians / Bands", desc: "What a band site includes and how it gets built." },
  { key: "ai", label: "AI + Automation", desc: "AI builds and automation for larger businesses." },
  { key: "lwp", label: "AI Photos", desc: "AI image enhancement." },
  { key: "ns", label: "Personal Sites", desc: "A sharp personal site for solo professionals." },
];
