/**
 * Content collections. Blog posts live in src/content/blog as markdown with
 * Decap-compatible frontmatter. Two field shapes exist in the wild:
 *   hand-authored:  description + image
 *   Decap-authored: excerpt + thumbnail
 * The schema accepts both; pages normalize via post.data.description ??
 * post.data.excerpt (and image ?? thumbnail).
 *
 * Jon 2026-09-15: one collection now feeds TWO blogs. `audience` splits them:
 * "business" posts render on /blog (Live Web Studios), "musicians" posts on
 * /live-band-web-studios/blog. One pipeline, one post template, two skins.
 * Every post that predates the split omits the field and defaults to
 * "business", so the LWS index count is untouched by construction.
 */
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/* Keep these lists in step with CATEGORIES in src/lib/categories.ts. Split by
   audience so a musician category can never land on a business post, and the
   reverse: a mismatch fails the build rather than producing a post that never
   appears on any archive page. */
const LWS_NAMES = [
  "Web Design",
  "SEO & Local Search",
  "AI & Automation",
  "Hosting & Performance",
  "WordPress & Migration",
  "Running a Business Online",
  "LWS News",
];

const LBWS_NAMES = [
  "Getting the Gig",
  "Your Digital Footprint",
  "Social That Fills Rooms",
  "The Email List",
  "Working Smarter: AI and Real Numbers",
];

const CATEGORY = z.enum([
  /* Live Web Studios */
  "Web Design",
  "SEO & Local Search",
  "AI & Automation",
  "Hosting & Performance",
  "WordPress & Migration",
  "Running a Business Online",
  "LWS News",
  /* Live Band Web Studios */
  "Getting the Gig",
  "Your Digital Footprint",
  "Social That Fills Rooms",
  "The Email List",
  "Working Smarter: AI and Real Numbers",
]);

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z
    .object({
      title: z.string(),
      /* Search-results title, when the written headline is too long for one.
         Google cuts a <title> around 60 characters, so a 78-character headline
         gets truncated mid-phrase in the result. This lets the two differ: the
         H1 on the page stays the headline Jon wrote, and only the <title> tag
         is shortened. Omit it and the title is used for both, which is the
         case for the 68 posts whose headline already fits. */
      seoTitle: z.string().optional(),
      date: z.coerce.date(),
      description: z.string().optional(),
      excerpt: z.string().optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      thumbnail: z.string().optional(),
      tags: z.array(z.string()).default([]),
      /* Which blog this post belongs to. Absent means "business", which is
         every post written before the 2026-09-15 split. */
      audience: z.enum(["business", "musicians"]).default("business"),
      /* Manual running order inside one publish date. The Live Band series
         shipped all thirty posts on one morning, so `date` cannot order them;
         this carries the reading order the series was written in, 1 first.
         Optional, because a post that is alone on its date does not need it. */
      sortOrder: z.number().int().positive().optional(),
      /* One or more of the categories in src/lib/categories.ts. Enumerated so a
         typo fails the build instead of quietly producing a post that never
         appears on any archive page.

         Jon 2026-09-15: "a list of the 1, 2 or 3 etc categories each post
         belongs to." A single string is still accepted and normalised to a
         one-item array, so hand-edited or older frontmatter keeps working. */
      categories: z
        .union([CATEGORY, z.array(CATEGORY).min(1)])
        .transform((v) => (Array.isArray(v) ? v : [v]))
        .optional(),
      draft: z.boolean().default(false),
    })
    .superRefine((data, ctx) => {
      const allowed = data.audience === "musicians" ? LBWS_NAMES : LWS_NAMES;
      for (const c of data.categories ?? []) {
        if (!allowed.includes(c)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["categories"],
            message:
              `"${c}" is not a ${data.audience} category. ` +
              `Allowed for audience "${data.audience}": ${allowed.join(", ")}.`,
          });
        }
      }
    }),
});

export const collections = { blog };
