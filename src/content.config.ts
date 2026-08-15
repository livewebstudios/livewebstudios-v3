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
    category: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
