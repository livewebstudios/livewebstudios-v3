/**
 * seoTitle — build a <title> that survives Google's truncation.
 *
 * Google cuts the title in a search result at roughly 60 characters (really
 * ~580px, but 60 is the working number). Past that it either clips mid-word or
 * rewrites the title itself, and neither is a result Jon chose.
 *
 * The launch audit (2026-09-15) found 46 titles over the limit, 43 of them blog
 * posts. The cause was mostly not the headlines: only 29 of the 97 posts are
 * over 60 on their own. The other 42 were pushed over by the brand suffix that
 * every post appends unconditionally, which costs 21 characters on the LWS blog
 * and 24 on the Live Band one.
 *
 * So the suffix becomes conditional. The brand is worth having when it fits,
 * because it is the thing a reader recognises in a list of ten blue links. It
 * is not worth having at the cost of truncating the headline that explains what
 * the page is, and it is already in the domain shown above the title either
 * way. For the 29 headlines still too long by themselves, `seoTitle:` in the
 * frontmatter carries a shorter version and the page H1 keeps the full one.
 */

/** Google's practical cutoff. */
export const TITLE_MAX = 60;

/**
 * `title | brand` when the whole thing fits, otherwise `title` on its own.
 * Never returns a truncated string: a title cut by us would read exactly as
 * badly as one cut by Google, and this way the headline always arrives whole.
 */
export function withBrand(title: string, brand: string): string {
  const full = `${title} | ${brand}`;
  return full.length <= TITLE_MAX ? full : title;
}
