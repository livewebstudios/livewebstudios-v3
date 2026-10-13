/**
 * Newsletter signup config, shared by /newsletter and the site-wide footer.
 * Both forms post to netlify/functions/subscribe.mjs, which checks the
 * Cloudflare Turnstile token and then adds the contact to Mailchimp as
 * pending (double opt-in). No Mailchimp URL or ID ever reaches the page:
 * bots were posting straight to the old list-manage.com action (2026-10-13).
 *
 * The site key is public by design (Cloudflare shows it in every page that
 * uses Turnstile). The secret key lives only in Netlify env vars.
 */

// Cloudflare > Turnstile > "LWS newsletter forms" (Managed, livewebstudios.com).
// Only that hostname is allowed, so the widget fails on localhost and Netlify
// previews. For local testing swap in Cloudflare's test key
// 1x00000000000000000000AA, and never commit it.
export const TURNSTILE_SITE_KEY = "0x4AAAAAAFV_26xn9TVWVxER";

// Relative to the page, per the LWS path rule. Pass the page's relPrefix.
export const subscribeAction = (rel: string) => `${rel}.netlify/functions/subscribe`;
