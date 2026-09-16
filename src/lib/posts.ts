/**
 * posts — the single query behind every blog page, on both blogs.
 *
 * Three rules live here so no page can forget one of them:
 *
 *   1. Drafts never render.
 *   2. A post only renders on its own blog (`audience`).
 *   3. A post dated later than build time never renders ANYWHERE: not on an
 *      index, not on an archive, not in related posts, and not as a page of
 *      its own. Because getStaticPaths uses this too, a future post generates
 *      no HTML, which is also what keeps it out of the sitemap: the sitemap
 *      integration can only list pages that exist.
 *
 * Rule 3 is what makes the drip schedule work. Posts are written now, dated
 * forward, and committed; the daily scheduled build (.github/workflows/
 * scheduled-publish.yml) is what brings each one online on its own morning.
 */
import { existsSync } from "node:fs";
import { getCollection, type CollectionEntry } from "astro:content";
import type { Audience } from "./categories";

export type Post = CollectionEntry<"blog">;

/**
 * Milliseconds for sorting. A date that failed to parse would make every
 * comparison against it NaN, which in a sort comparator does not throw: it
 * quietly scrambles the order of the whole index. So floor it to 0 (the post
 * sorts last, where a dateless post belongs) and say so at build time.
 */
export function safeTime(date: Date | undefined, id = "unknown"): number {
  const t = date instanceof Date ? date.valueOf() : NaN;
  if (Number.isNaN(t)) {
    console.warn(
      `[posts] "${id}" has a missing or invalid date. Sorting it to the end ` +
        `(0). Fix the date: in its frontmatter.`,
    );
    return 0;
  }
  return t;
}

/** Published means "dated at or before the moment this build started". */
export function isPublished(post: Post, now = Date.now()): boolean {
  return safeTime(post.data.date, post.id) <= now;
}

/** Strip the YYYY-MM-DD- filename prefix. The URL slug is what is left. */
export const slugOf = (post: Post): string =>
  post.id.replace(/^\d{4}-\d{2}-\d{2}-/, "");

/**
 * Every post that belongs on one blog right now, newest first.
 * Pass { includeFuture: true } only for a diagnostic; no page should.
 */
export async function getPosts(
  audience: Audience,
  opts: { includeFuture?: boolean } = {},
): Promise<Post[]> {
  const now = Date.now();
  const all = await getCollection(
    "blog",
    ({ data }) => !data.draft && data.audience === audience,
  );
  return all
    .filter((p) => opts.includeFuture || isPublished(p, now))
    .sort((a, b) => {
      const byDate = safeTime(b.data.date, b.id) - safeTime(a.data.date, a.id);
      if (byDate !== 0) return byDate;
      /* Same timestamp: fall back to the hand-set running order, lowest
         first, so a whole series released on one morning still reads in the
         order it was written. LAST keeps posts without the field behind the
         ones that have it, and keeps the subtraction finite. */
      return sortKey(a) - sortKey(b);
    });
}

/** sortOrder, or a value that parks an unordered post at the back. */
const LAST = Number.MAX_SAFE_INTEGER;
const sortKey = (post: Post): number => post.data.sortOrder ?? LAST;

/**
 * Hero art for a musician post. Jon generates the finals in Higgsfield as the
 * schedule rolls on, so this resolves in three steps:
 *
 *   1. an explicit `image:` in the frontmatter, if there is one
 *   2. public/images/band/blog/<slug>.webp, if that file has landed
 *   3. the typographic placeholder for the post's first category
 *
 * Step 2 is what makes adding art a drag-and-drop job: drop the file in with
 * the right name and the next build picks it up, no frontmatter edit. The
 * existsSync is a build-time check on a static site, so it costs nothing at
 * run time. Returns the root-relative form the templates expect; they strip
 * the leading slash per the LWS path rule.
 */
export function bandImage(
  post: Post,
  categorySlugs: readonly string[],
): string {
  const own = post.data.image ?? post.data.thumbnail;
  if (own) return own;

  const slug = slugOf(post);
  if (existsSync(`public/images/band/blog/${slug}.webp`)) {
    return `/images/band/blog/${slug}.webp`;
  }

  const first = categorySlugs[0];
  return first ? `/images/band/blog/category-${first}.webp` : "";
}
