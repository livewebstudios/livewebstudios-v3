/**
 * Newsletter signup: browser form -> Turnstile check -> Mailchimp (pending).
 *
 * Built 2026-10-13 after bots signed real people's work emails up through the
 * old form, which posted straight to Mailchimp's list-manage.com URL. That URL
 * and the list IDs now live only here, and the API key only in Netlify env.
 *
 * Env (Netlify > Site configuration > Environment variables):
 *   TURNSTILE_SECRET_KEY  Cloudflare Turnstile secret for livewebstudios.com
 *   MAILCHIMP_API_KEY     Mailchimp key, "LWS site form" (ends in -us18)
 *
 * Responses: JSON when the page's script asks for it (Accept: application/json),
 * otherwise a 303 to the thank-you page so a plain form POST still lands.
 * Mailchimp error text is logged, never sent to the browser.
 */
import { createHash } from "node:crypto";

const LIST_ID = "30b288c666";
const TAG = "Website Entries"; // was hidden field tags=2524065 on the old form
const THANKS_PATH = "/newsletter/thanks";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const GENERIC_ERROR =
  "That didn't go through on our end. Try again in a minute, or email jonwolf@livewebstudios.com.";

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
  }

  const wantsJson = (req.headers.get("accept") || "").includes("application/json");
  const reply = (status, message) => {
    if (wantsJson) {
      return Response.json(status < 400 ? { ok: true } : { ok: false, message }, { status });
    }
    if (status < 400) {
      return new Response(null, {
        status: 303,
        headers: { Location: new URL(THANKS_PATH, req.url).href },
      });
    }
    return new Response(`${message}\n`, {
      status,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  };

  let fields;
  try {
    fields = await readBody(req);
  } catch {
    return reply(400, "We couldn't read that form. Try again.");
  }

  // Honeypot: a person never sees this field. Look like success, do nothing.
  if (fields.website) return reply(200);

  const email = fields.EMAIL.trim().toLowerCase();
  const fname = fields.FNAME.trim().slice(0, 50);
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return reply(400, "That email address doesn't look right. Check it and try again.");
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const mailchimpKey = process.env.MAILCHIMP_API_KEY;
  if (!turnstileSecret || !mailchimpKey) {
    console.error("subscribe: TURNSTILE_SECRET_KEY or MAILCHIMP_API_KEY is not set");
    return reply(500, GENERIC_ERROR);
  }

  // 1. Turnstile. A missing token fails here too, which is the point: a bot
  //    posting straight to this function never ran the widget.
  const ip = req.headers.get("x-nf-client-connection-ip") || context?.ip || "";
  const human = await verifyTurnstile(turnstileSecret, fields.token, ip);
  if (!human) return reply(400, "We couldn't confirm you're a person. Reload the page and try again.");

  // 2. Mailchimp upsert. status_if_new: an existing subscriber stays
  //    subscribed, a new address waits for the confirmation click.
  const dc = mailchimpKey.split("-")[1] || "us18";
  const hash = createHash("md5").update(email).digest("hex");
  const member = `https://${dc}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${hash}`;
  const auth = { Authorization: `Basic ${Buffer.from(`lws:${mailchimpKey}`).toString("base64")}` };

  const body = { email_address: email, status_if_new: "pending" };
  // Only send FNAME when given, so a returning subscriber who leaves it blank
  // (the footer form has no name field) keeps the name already on file.
  if (fname) body.merge_fields = { FNAME: fname };

  const put = await mailchimp(member, "PUT", auth, body);
  if (!put.ok) return reply(502, GENERIC_ERROR);

  // Someone who unsubscribed and signs up again gets a fresh confirmation
  // email. PUT alone leaves them unsubscribed and they would hear nothing.
  if (put.data.status === "unsubscribed") {
    const patch = await mailchimp(member, "PATCH", auth, { status: "pending" });
    if (!patch.ok) return reply(502, GENERIC_ERROR);
  }

  // 3. Tag. The contact is already in, so a tag failure is logged, not shown.
  await mailchimp(`${member}/tags`, "POST", auth, { tags: [{ name: TAG, status: "active" }] });

  return reply(200);
};

async function readBody(req) {
  const type = req.headers.get("content-type") || "";
  const raw = type.includes("application/json")
    ? await req.json()
    : Object.fromEntries(await req.formData());
  const str = (v) => (typeof v === "string" ? v : "");
  return {
    EMAIL: str(raw.EMAIL),
    FNAME: str(raw.FNAME),
    website: str(raw.website),
    token: str(raw["cf-turnstile-response"]),
  };
}

async function verifyTurnstile(secret, token, ip) {
  if (!token) return false;
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const out = await res.json();
    if (!out.success) console.warn("subscribe: turnstile rejected", out["error-codes"]);
    return out.success === true;
  } catch (err) {
    console.error("subscribe: turnstile request failed", err);
    return false;
  }
}

async function mailchimp(url, method, auth, body) {
  try {
    const res = await fetch(url, {
      method,
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = res.status === 204 ? {} : await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error(`subscribe: mailchimp ${method} ${res.status}`, data.title, data.detail);
    }
    return { ok: res.ok, data };
  } catch (err) {
    console.error(`subscribe: mailchimp ${method} request failed`, err);
    return { ok: false, data: {} };
  }
}
