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

// TODO(Jon): replace with the real site key from Cloudflare > Turnstile.
// This is Cloudflare's public TEST key: it always passes, and the real secret
// key rejects its tokens, so it can never let a signup through in production.
export const TURNSTILE_SITE_KEY = "1x00000000000000000000AA";

// Relative to the page, per the LWS path rule. Pass the page's relPrefix.
export const subscribeAction = (rel: string) => `${rel}.netlify/functions/subscribe`;
