/**
 * Content collections. Blog posts live in src/content/blog as markdown with
 * Decap-compatible frontmatter. Two field shapes exist in the wild:
 *   hand-authored:  description + image
 *   Decap-authored: excerpt + thumbnail
 * The schema accepts both; pages normalize via post.data.description ??
 * post.data.excerpt (and image ?? thumbnail).
 */
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/* Keep this list in step with CATEGORIES in src/lib/categories.ts. */
const CATEGORY = z.enum([
  "Web Design",
  "SEO & Local Search",
  "AI & Automation",
  "Hosting & Performance",
  "WordPress & Migration",
  "Running a Business Online",
  "LWS News",
]);

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    thumbnail: z.string().optional(),
    tags: z.array(z.string()).default([]),
    /* One or more of the seven in src/lib/categories.ts. Enumerated so a typo
       fails the build instead of quietly producing a post that never appears
       on any archive page.

       Jon 2026-09-15: "a list of the 1, 2 or 3 etc categories each post
       belongs to." A single string is still accepted and normalised to a
       one-item array, so hand-edited or older frontmatter keeps working. */
    categories: z
      .union([CATEGORY, z.array(CATEGORY).min(1)])
      .transform((v) => (Array.isArray(v) ? v : [v]))
      .optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
