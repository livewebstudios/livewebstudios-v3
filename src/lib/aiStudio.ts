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
  { n: 12, label: "Sites rebuilt end to end" },
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
      "We design and build custom websites with AI doing the production work and a person making every call. No templates. No plugins, no constant security updates.",
    detail:
      "Design, writing, images and Google setup all come out of one process, so a full rebuild moves in weeks, not seasons. Every page loads fast. It's yours, and it stays editable after launch.",
    shipped: "12 full rebuilds, from an electrical contractor to a kitchen showroom to this site.",
    proof: "rebuilt",
  },
  {
    id: "automation",
    name: "Office Automation",
    icon: "route",
    blurb:
      "We find the repetitive office work that eats your week and hand it to a system that runs on schedule. Invoices, reports, member lists and inbox sorting, done the same way every time.",
    detail:
      "We map the job as it really runs, including the exceptions, then build it on the tools you already pay for. You get a quiet system and a short note when something needs a human.",
    shipped: "Automatic renewal invoices and reminders, plus monthly reports, member lists and social posts.",
    proof: "systems",
  },
  {
    id: "content",
    name: "AI Content in Your Voice",
    icon: "pen",
    blurb:
      "We set up a system that turns one idea into a steady run of posts and emails in your voice. You approve; it publishes.",
    detail:
      "The voice is written down first, from your own words, so the output sounds like the business and not like a machine. Drafting and scheduling happen automatically. Approval stays with you.",
    shipped: "A newsletter engine, social calendars, three blogs and a weekly comic strip, 13 strips in.",
    proof: "systems",
  },
  {
    id: "media",
    name: "AI Video & Photos",
    icon: "image",
    blurb:
      "We make website videos and edited photos from a written description. Footage that fits your brand, no shoot day.",
    detail:
      "Every clip is color-corrected and sized for the web, so it loads fast and loops smoothly. Every still is retouched by a human eye before it goes live.",
    shipped: "Website videos, animation, 3D characters and hundreds of edited photos.",
    proof: "media",
  },
  {
    id: "reporting",
    name: "Monthly Search Reports",
    icon: "search",
    blurb:
      "We pull your search data and write the report in plain English. Every month, without anyone assembling spreadsheets.",
    detail:
      "Your Google rankings and traffic land in one place and get compared with last month. You get what moved and what happens next.",
    shipped: "Automated ranking reports, Google health checks and client report templates.",
    proof: "systems",
  },
  {
    id: "consulting",
    name: "AI Readiness Consulting",
    icon: "compass",
    blurb:
      "We look at how your business actually runs and tell you where AI earns its keep and where it does not. Straight answers, then a plan you can act on.",
    detail:
      "Useful for firms with rules to follow and data to protect. We assess the workflow and name the risks. Then you get a short list of moves, in the order they pay off.",
    shipped: "AI guidance for a law firm, plus workflow reviews for working businesses.",
    proof: "advice",
  },
];

/* The portfolio: one list shared by /work and /ai/proof so the two pages
   never drift. Thumbnails are 800x500 homepage screenshots at
   images/portfolio/{img}.jpg. `line` is the short card copy on /ai/proof,
   `body` the longer card copy on /work. No href = this site (links home). */
export const REBUILDS: { name: string; industry: string; img: string; line: string; body: string; href?: string }[] = [
  { name: "Mike DiNinno Electric", industry: "Electrical Contractor", img: "mikedininnoelectric", href: "https://mikedininnoelectric.com/",
    line: "A veteran-owned Clifton electrician with 30+ years of work, built to turn searches into calls.",
    body: "A veteran-owned, licensed electrical contractor in Clifton, NJ with 30+ years of residential, commercial, and industrial work, panel upgrades, generators, and 24/7 emergency service." },
  { name: "B-Line Counseling", industry: "Mental Health Services", img: "blinecounseling", href: "https://b-linecounseling.com/",
    line: "Family-focused counseling in Teaneck, with in-community services for youth across New Jersey.",
    body: "A family-focused mental health practice in Teaneck, NJ delivering Intensive In-Community, Behavioral Assistant, and Mentor services, plus assessments for youth and families statewide." },
  { name: "Level Set", industry: "Corporate Training", img: "levelset", href: "https://levelsetmethod.com/",
    line: "A six-module professional program, presented to the companies that buy it.",
    body: "A six-module, four-hour corporate fluency program for employers and universities, built by a 25-year HR executive and an Emmy-winning style authority to help new hires succeed and stay." },
  { name: "The Mosaic Collaborative", industry: "Business Consulting", img: "mosaic", href: "https://mosaic-staging.netlify.app/",
    line: "Strategy and leadership consulting for companies at inflection points.",
    body: "A strategy, leadership, and organizational consulting firm helping small and mid-sized companies through critical inflection points, from stalled growth to leadership alignment." },
  { name: "Küche+Cucina", industry: "Luxury Kitchen Showroom", img: "kuchecucina", href: "https://www.kuche-cucina.com/",
    line: "Custom kitchens, European cabinetry, closets and baths, with a hero film to match.",
    body: "A kitchen and fine interiors showroom: custom kitchens, European cabinetry, closets, and baths, presented with a hero film that sells the craft before a word is read." },
  { name: "Mianne Benchwork", industry: "Hobby Manufacturing", img: "miannebenchwork", href: "https://miannebenchwork.com/",
    line: "A national maker's catalogue, rebuilt to sell the product line.",
    body: "A national maker of model railroad benchwork, the fast track to layout construction. Rebuilt so the full catalogue sells itself, kit by kit." },
  { name: "Same Day Logistics", industry: "Logistics", img: "samedaylogistics", href: "https://samedaylogistics.com/",
    line: "A nationwide 24/7 courier, from medical delivery to airfreight, headquartered in NJ.",
    body: "A nationwide 24/7 courier and logistics company headquartered in NJ, offering local courier, medical delivery, airfreight, and specialized logistics services." },
  { name: "The British Invasion Years", industry: "Tribute Band", img: "britishinvasionyears", href: "https://britishinvasionyears.com/",
    line: "A '60s British Invasion concert show, with tour dates, video and booking in one place.",
    body: "A live '60s British Invasion concert show touring theaters coast to coast, tour dates, video, and booking for the band fronted by LWS's own Jon Wolf." },
  { name: "Live Web Photos", industry: "AI Image Services", img: "livewebphotos", href: "https://livewebphotos.com/",
    line: "The studio's image division. Staging and retouching at scale.",
    body: "The AI image-enhancement division of Live Web Studios, virtual staging, product retouching, and architectural visualization delivered at scale in about 48 hours." },
  { name: "Jon Wolf Studios", industry: "Personal Site", img: "jonwolfstudios", href: "https://jonwolfstudios.com/",
    line: "The founder's own site, with a spotlight effect that follows your cursor.",
    body: "The personal site of LWS founder Jon Wolf, North Jersey keyboardist, guitarist, web developer, and AI workflow consultant, built on our follow-spot animation engine." },
  { name: "VÖID", industry: "Concept Store", img: "void", href: "https://v-id.netlify.app/",
    line: "Astounding objects that do nothing at all, sold with a straight face.",
    body: "A tongue-in-cheek concept store selling astounding objects that do nothing at all, certified by the VÖID Code Authority and shipped across the void for free." },
  { name: "Live Web Studios", industry: "Web Studio", img: "livewebstudios",
    line: "The parent site you are standing on, rebuilt end to end the same way.",
    body: "The site you are on. The Live Web Studios parent site, rebuilt end to end on the same system we use for every client." },
];

/* Systems that run themselves. */
export const SYSTEMS = [
  { name: "Hosting-renewal invoicing", body: "Renewals come due and invoices go out on their own, with reminders on schedule. A person only steps in when something looks off." },
  { name: "Invoicing", body: "Finished work turns into an invoice built from the job record and sent in your name. No end-of-month pile to assemble by hand." },
  { name: "Billing", body: "Recurring charges run on schedule, payments land against the right client, and anything late gets a polite nudge before anyone has to chase it." },
  { name: "Monthly reports", body: "Search and site data get compared with last month and written up in plain English. Ready to review, not ready to assemble." },
  { name: "Social posting automation", body: "Facebook and Instagram posts scheduled from an approved calendar, so the feed keeps moving on busy weeks." },
  { name: "The newsletter engine", body: "Stories in, a finished issue out, written in the sender's voice and queued for approval before it goes anywhere." },
];

/* Media made from prompts. */
export const MEDIA = [
  { name: "Website videos", body: "Background videos made from a written description, then sized to load fast on a phone. This page is running one." },
  { name: "Photo work", body: "Hundreds of edited and combined photos. Product shots and staging that would have needed a shoot, finished by a human eye." },
  { name: "Animation and 3D", body: "Animated characters and motion graphics for brands that want to move, built without a production crew." },
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
