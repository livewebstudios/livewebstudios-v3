/**
 * aiStudio: the shared facts behind the Live AI Studios (/ai) section.
 *
 * Every number and every named piece of work on the /ai pages comes from
 * here, and everything here traces to shipped work (handoff Section 5). No
 * invented metrics: where the work has a number it is used, where it does not
 * the work is described without one.
 *
 * One module so the home teaser, the services page, the proof page and the
 * schema can never disagree with each other.
 */
import { getCollection, type CollectionEntry } from "astro:content";

export type AiPost = CollectionEntry<"ai-blog">;

export const SITE = "https://livewebstudios.com";
export const ORG_ID = `${SITE}/ai#org`;

/* The numbers band. Order is the handoff's; `n` counts up on first view. */
export const STATS = [
  { n: 1258, label: "Projects run" },
  { n: 7, label: "Months" },
  { n: 472, label: "Files shipped" },
  { n: 43, label: "Active clients" },
  { n: 14, label: "Sites rebuilt end to end" },
];

export type AiService = {
  id: string;
  name: string;
  icon: string; // key in src/lib/navIcons.ts
  blurb: string;
  detail: string;
  shipped: string;
  proof: string; // anchor on /ai/proof
};

export const SERVICES: AiService[] = [
  {
    id: "websites",
    name: "AI-Built Websites",
    icon: "monitor",
    blurb:
      "We design and build custom websites with AI doing the production and human direction on every call. No templates, no page builders, no plugins to patch.",
    detail:
      "Design comps, copy, code, images and search setup all come out of the same system, so a full rebuild moves in weeks, not seasons. Every page is static, fast and yours, and the content stays editable after launch.",
    shipped: "14 full rebuilds, from an archery pro shop to a kitchen showroom to this site.",
    proof: "rebuilt",
  },
  {
    id: "automation",
    name: "Workflow & Office Automation",
    icon: "route",
    blurb:
      "We find the repetitive office work that eats your week and hand it to a system that runs on schedule. Invoices, reports, member lists and inbox triage, done the same way every time.",
    detail:
      "We map the job as it really runs, including the exceptions, then build it on the tools you already pay for. You get a quiet system and a short note when something needs a human.",
    shipped: "Hosting-renewal invoicing on Zoho and 15 Apps Script files, plus reporting, member-list and posting automations.",
    proof: "systems",
  },
  {
    id: "content",
    name: "AI Content Engines",
    icon: "pen",
    blurb:
      "We build pipelines that turn one idea into a steady run of posts, emails and articles in your voice. You approve; the engine publishes.",
    detail:
      "The voice is written down first, from your own words, so the output sounds like the business and not like a machine. Calendars, drafts and scheduling run on rails; approval stays with you.",
    shipped: "A newsletter engine, social calendars, three blogs and a weekly comic strip, 13 strips in.",
    proof: "systems",
  },
  {
    id: "media",
    name: "Generative Media",
    icon: "image",
    blurb:
      "We make hero films, animation and photo composites from a written brief. Footage and imagery that fit your brand without a shoot day.",
    detail:
      "Every clip is rendered, graded and compressed for the web, so it loads fast and loops clean. Every still is retouched by a human eye before it ships.",
    shipped: "Hero films, animation, 3D character work and hundreds of photo composites.",
    proof: "media",
  },
  {
    id: "reporting",
    name: "AI Reporting & SEO Intelligence",
    icon: "search",
    blurb:
      "We pull your search data, audit what is working and write the report in plain English. Every month, without anyone assembling spreadsheets.",
    detail:
      "Rankings, Search Console data and site health land in one place, get read against last month, and come back as what moved, what it means and what happens next.",
    shipped: "A DataForSEO pipeline, Search Console audits, schema work and client report templates.",
    proof: "systems",
  },
  {
    id: "consulting",
    name: "AI Readiness Consulting",
    icon: "compass",
    blurb:
      "We look at how your business actually runs and tell you where AI earns its keep and where it does not. Straight answers, then a plan you can act on.",
    detail:
      "Useful for firms with rules to follow and data to protect. We assess the workflow, name the risks, and hand back a short list of moves in the order they pay off.",
    shipped: "A legal-sector AI engagement and workflow assessments for working businesses.",
    proof: "advice",
  },
];

/* Rebuilt end to end: the 14. Industry and the one-liner come from each
   site's own published description; links only where the site is live. */
export const REBUILDS: { name: string; industry: string; line: string; href?: string }[] = [
  { name: "Targeteers Archery", industry: "Archery pro shop & range", line: "A family pro shop and 11-lane indoor range, rebuilt around lessons, leagues and camp.", href: "https://targeteersarchery.com/" },
  { name: "Küche+Cucina", industry: "Luxury kitchen showroom", line: "Custom kitchens, European cabinetry, closets and baths, with a hero film to match.", href: "https://www.kuche-cucina.com/" },
  { name: "Legacy TCP", industry: "Financial & legal services", line: "Planning, legal, insurance and tax under one roof, explained in one site.", href: "https://legacytcp.com/" },
  { name: "Winslow", industry: "Tribute band", line: "An Eagles tribute act: tour dates, performance info and booking.", href: "https://winsloweaglestribute.com/" },
  { name: "Valley Tent", industry: "Event rental", line: "Tents, glassware, linens and tableware for weddings and events.", href: "https://valleytent.com/" },
  { name: "Community Church GR", industry: "Church", line: "A congregation's front door: services, groups and how to visit.", href: "https://communitychurchgr.com/" },
  { name: "Manual Therapy Consultants", industry: "Physical therapy practice", line: "A clinical practice site with intake forms that feed the office.", href: "https://manualtherapyconsultants.com/" },
  { name: "Mianne Benchwork", industry: "Hobby manufacturing", line: "A national maker's catalogue, rebuilt to sell the product line.", href: "https://miannebenchwork.com/" },
  { name: "D&J Power Washing", industry: "Exterior cleaning", line: "A local service business, built to turn searches into calls.", href: "https://djpowerwashing.net/" },
  { name: "Level Set", industry: "Corporate training", line: "A six-module professional program, presented to the companies that buy it.", href: "https://levelsetmethod.com/" },
  { name: "The Mosaic Collaborative", industry: "Leadership consulting", line: "Strategy and leadership consulting for companies at inflection points.", href: "https://mosaiccollaborative.com/" },
  { name: "Live Web Photos", industry: "AI image services", line: "The studio's image division: staging, retouching and visualization.", href: "https://livewebphotos.com/" },
  { name: "VÖID", industry: "Concept store", line: "Astounding objects that do nothing at all, sold with a straight face." },
  { name: "Live Web Studios", industry: "Web studio", line: "The parent site you are standing on, rebuilt end to end the same way." },
];

/* Systems that run themselves. */
export const SYSTEMS = [
  { name: "Hosting-renewal invoicing", body: "Renewals come due, invoices go out through Zoho, reminders follow on schedule. Fifteen Apps Script files carry the logic; a human reads the exceptions." },
  { name: "Monthly reporting pipeline", body: "Search and site data get pulled, compared with last month and written up as a plain-English report, ready for review instead of ready to assemble." },
  { name: "Weekly member-list automation", body: "A membership roster that updates itself every week, so nobody reconciles a spreadsheet by hand on a Friday." },
  { name: "Social posting automation", body: "Facebook and Instagram posts scheduled from an approved calendar, so the feed keeps moving on busy weeks." },
  { name: "The comic strip pipeline", body: "Script, art, publish: a weekly strip produced end to end by the system. Thirteen strips and counting." },
  { name: "The newsletter engine", body: "Stories in, a finished issue out, written in the sender's voice and queued for approval before it goes anywhere." },
];

/* Media made from prompts. */
export const MEDIA = [
  { name: "Hero films", body: "Looping section films rendered from a text brief, then graded, looped and compressed so they load fast on a phone. This page is running one." },
  { name: "Photo work", body: "Hundreds of manipulations and composites: product shots, staging and scenes that would have needed a shoot, finished by a human eye." },
  { name: "Animation and 3D", body: "Character work and motion pieces for brands that want to move, built without a production crew." },
];

/* Organization node for the /ai hub, and the parent it hangs from (the same
   LocalBusiness values index.astro emits). Service nodes point back at
   ORG_ID. The logo is the parent mark until the Live AI mark exists (the
   logo work was deferred, Jon 2026-09-26). */
export const PARENT_ORG = {
  "@type": "LocalBusiness",
  name: "Live Web Studios",
  url: SITE,
  telephone: "732-801-9611",
  email: "jonwolf@livewebstudios.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "446 Saddle River Rd., Unit 2",
    addressLocality: "Saddle Brook",
    addressRegion: "NJ",
    postalCode: "07663",
    addressCountry: "US",
  },
};

export const ORG = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Live AI Studios",
  url: `${SITE}/ai`,
  description:
    "Live AI Studios is an AI-staffed studio directed by a human principal: websites, automation, content engines, generative media, reporting and AI readiness consulting.",
  logo: `${SITE}/images/logoRGB.png`,
  brand: { "@type": "Brand", name: "Live Web Studios" },
  parentOrganization: PARENT_ORG,
};

/** Published Live AI Insights posts, newest first. Same rules as posts.ts:
    drafts never render, and nothing dated after the build renders anywhere. */
export async function getAiPosts(): Promise<AiPost[]> {
  const now = Date.now();
  const all = await getCollection("ai-blog", ({ data }) => !data.draft);
  return all
    .filter((p) => p.data.date.valueOf() <= now)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const aiSlug = (p: AiPost) => p.id.replace(/^\d{4}-\d{2}-\d{2}-/, "");

export const aiDate = (d: Date, month: "short" | "long" = "short") =>
  d.toLocaleDateString("en-US", { year: "numeric", month, day: "numeric", timeZone: "UTC" });
