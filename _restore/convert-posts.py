#!/usr/bin/env python3
"""
Convert the restored WordPress bodies into Astro blog markdown.

Reads  _restore/wp-posts.json      (33 posts, extracted from the WP dump)
       _restore/wayback-posts.json (9 posts, scraped from the Wayback Machine)
Writes src/content/blog/YYYY-MM-DD-slug.md

Everything is written draft: true. No images, no rewriting. Divi shortcodes are
stripped, WordPress HTML becomes clean markdown, and internal links are made
relative per the LWS path rule.

Run from the project root:  python3 _restore/convert-posts.py
"""

import html as htmlmod
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTDIR = os.path.join(ROOT, "src", "content", "blog")

# WordPress duplicate-slug suffixes to drop for the new canonical slug.
SLUG_FIX = {
    "web-design-basics-2": "web-design-basics",
    "is-color-important-2": "is-color-important",
}

# Internal WordPress URLs -> relative site paths. The site builds flat .html
# files, and every subpage links as ../foo.html, so a post at /blog/<slug>
# resolves ../contact.html to /contact.html. Never root-relative.
INTERNAL = re.compile(r"^https?://(?:www\.)?livewebstudios\.com/?(.*)$", re.I)

# Old WordPress paths are resolved through public/_redirects, which is already
# the authoritative map from the old site to v3. Chains are followed so a body
# link never lands on a redirect.
def load_redirects():
    m = {}
    path = os.path.join(ROOT, "public", "_redirects")
    if not os.path.exists(path):
        return m
    for line in open(path):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split()
        if len(parts) >= 2 and parts[0].startswith("/") and parts[1].startswith("/"):
            m[parts[0].rstrip("/").lower() or "/"] = parts[1]
    return m


REDIRECTS = load_redirects()

# Slugs of the 42 posts being restored, so a body link to one of them points at
# the new /blog/<slug> home rather than at the old flat permalink.
def load_restored_slugs():
    out = set()
    for p in json.load(open(os.path.join(ROOT, "_restore", "wp-posts.json"))):
        out.add(SLUG_FIX.get(p["post_name"], p["post_name"]))
        out.add(p["post_name"])
    wb = os.path.join(ROOT, "_restore", "wayback-posts.json")
    if os.path.exists(wb):
        for p in json.load(open(wb)):
            out.add(p["slug"])
    return out

# Marks a real block boundary (<p>, heading, list, div). A bare newline is a
# soft wrap that WordPress rendered as <br>, and is treated differently.
HARD = "\n\x02\n"
BREAK = object()  # hard block boundary marker inside the line list

RESTORED_SLUGS = load_restored_slugs()

notes = []


def note(slug, msg):
    notes.append("%-55s %s" % (slug, msg))


def relativise(url, slug):
    """Turn an absolute livewebstudios.com URL into a relative one."""
    url = url.strip()
    # ?utm_source=chatgpt.com on a citation is a visible AI tell in the address
    # bar. The parameter is attribution only, so dropping it changes nothing
    # about where the link goes.
    cleaned = re.sub(r"[?&]utm_source=chatgpt\.com\b", "", url)
    if cleaned != url:
        note(slug, "stripped utm_source=chatgpt.com from %s" % url)
        url = cleaned
    m = INTERNAL.match(url)
    if not m:
        if url.startswith("/"):
            note(slug, "root-relative link made relative: %s" % url)
            return "../" + url.lstrip("/")
        return url
    path = "/" + m.group(1).strip("/")
    # A link to one of the 42 restored posts wins over _redirects, which still
    # sends every one of those old permalinks to /blog.
    first = path.strip("/")
    if first in RESTORED_SLUGS:
        rel = "../blog/%s.html" % SLUG_FIX.get(first, first)
        note(slug, "internal link relativised to a restored post: %s -> %s" % (url, rel))
        return rel
    target, seen = path, set()
    while True:
        key = target.rstrip("/").lower() or "/"
        if key in REDIRECTS and key not in seen:
            seen.add(key)
            target = REDIRECTS[key]
            continue
        break
    bare = target.strip("/")
    if not bare:
        rel = "../index.html"
    elif bare in RESTORED_SLUGS:
        rel = "../blog/%s.html" % SLUG_FIX.get(bare, bare)
    elif bare.endswith(".html"):
        rel = "../" + bare
    else:
        rel = "../%s.html" % bare
    if target != path:
        note(slug, "internal link relativised via _redirects: %s -> %s -> %s" % (url, target, rel))
    else:
        note(slug, "internal link relativised: %s -> %s" % (url, rel))
    return rel


DIVI_VIDEO = re.compile(r"\[et_pb_video[^\]]*\bsrc=\"([^\"]+)\"", re.I)
DIVI_ANY = re.compile(r"\[/?et_pb_[a-z_]*[^\]]*\]", re.I)


def strip_divi(text, slug):
    for src in DIVI_VIDEO.findall(text):
        note(slug, "DIVI VIDEO dropped, src was: %s" % src)
    return DIVI_ANY.sub(HARD, text)


IMG = re.compile(r"<img\b[^>]*>", re.I)
ATTR = re.compile(r'(\w+)="([^"]*)"')


def drop_images(text, slug):
    def repl(m):
        attrs = dict(ATTR.findall(m.group(0)))
        note(slug, "IMG dropped: src=%s alt=%r" % (attrs.get("src", "?"), attrs.get("alt", "")))
        return ""
    return IMG.sub(repl, text)


LINK = re.compile(r'<a\b[^>]*?href="([^"]*)"[^>]*>(.*?)</a>', re.I | re.S)


def convert_links(text, slug):
    def repl(m):
        href, label = m.group(1), m.group(2)
        label = re.sub(r"<[^>]+>", "", label).strip()
        if href.strip() in ("", "#"):
            note(slug, "DEAD LINK, href was empty or '#': %r needs a real target" % label)
        return "[%s](%s)" % (label, relativise(href, slug))
    return LINK.sub(repl, text)


def _emph(marker):
    """Convert one paired emphasis tag, moving any whitespace outside the
    markers. Markdown will not close an emphasis run that ends on a space."""
    def repl(m):
        inner = m.group(2)
        core = inner.strip()
        if not core:
            return " "
        lead = " " if inner[:1].isspace() else ""
        trail = " " if inner[-1:].isspace() else ""
        return "%s%s%s%s%s" % (lead, marker, core, marker, trail)
    return repl


def convert_inline(text):
    for tags, marker in ((r"strong|b", "**"), (r"em|i", "*")):
        for _ in range(4):  # a few passes unwind simple nesting
            text, n = re.subn(r"<(%s)\b[^>]*>(.*?)</\1\s*>" % tags,
                              _emph(marker), text, flags=re.I | re.S)
            if not n:
                break
    # Anything left unpaired is stray markup, not emphasis.
    text = re.sub(r"</?(?:strong|b|em|i)\b[^>]*>", "", text, flags=re.I)
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    return text


def convert_lists(text):
    def do_list(m):
        kind, body = m.group(1).lower(), m.group(2)
        items = re.findall(r"<li\b[^>]*>(.*?)</li>", body, re.I | re.S)
        out, n = [], 0
        for it in items:
            it = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", it)).strip()
            if not it:
                continue
            n += 1
            out.append(("%d. " % n if kind == "ol" else "- ") + it)
        return HARD + "\x00LIST\x00".join(out) + HARD
    return re.sub(r"<(ul|ol)\b[^>]*>(.*?)</\1>", do_list, text, flags=re.I | re.S)


def convert_blocks(text):
    # Body headings start at h2; the page template already renders the title as
    # the single h1, so any h1 in the body is demoted.
    for tag, hashes in (("h1", "##"), ("h2", "##"), ("h3", "###"),
                        ("h4", "####"), ("h5", "#####"), ("h6", "######")):
        text = re.sub(r"<%s\b[^>]*>(.*?)</%s>" % (tag, tag),
                      lambda m, h=hashes: HARD + "%s %s" % (h, re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m.group(1))).strip()) + HARD,
                      text, flags=re.I | re.S)
    text = re.sub(r"<blockquote\b[^>]*>(.*?)</blockquote>",
                  lambda m: HARD + "\n".join("> " + l.strip() for l in
                                               re.sub(r"<[^>]+>", "", m.group(1)).strip().splitlines() if l.strip()) + HARD,
                  text, flags=re.I | re.S)
    text = re.sub(r"</?p\b[^>]*>", HARD, text, flags=re.I)
    return text


def to_markdown(raw, slug):
    text = raw.replace("\r\n", "\n").replace("\r", "\n")
    text = strip_divi(text, slug)
    text = drop_images(text, slug)
    text = convert_links(text, slug)
    text = convert_lists(text)
    text = convert_blocks(text)
    text = convert_inline(text)
    # Unwrap every remaining structural tag; nothing left carries content.
    text = re.sub(r"</?(?:div|span|article|section|figure|figcaption|header|footer|main|table|tbody|tr|td|th)\b[^>]*>", HARD, text, flags=re.I)
    text = re.sub(r"<[^>]+>", "", text)
    text = htmlmod.unescape(text)
    text = text.replace(" ", " ")

    # WordPress wpautop treated a lone newline as a line break. Markdown eats
    # those, so every line becomes its own block and list items rejoin.
    ENDS = re.compile(r"[.!?:;\u201d\"\)\u2019]\**$")
    # A fragment ending on one of these was wrapped mid-sentence, whatever the
    # next line's capitalisation. A trailing comma counts too.
    DANGLES = re.compile(
        r"(?:,|\b(?:and|or|but|so|to|with|for|of|in|on|at|by|from|into|than|"
        r"then|that|as|the|an?|our|your|their|its|we|you|is|are|was|were|be|"
        r"been|can|will|also|develop|build|help|offer|provide|include)\s*\**)$",
        re.I)

    def is_soft_wrap(prev, line):
        """True when the newline between these two fell inside one sentence."""
        if ENDS.search(prev):
            return False
        # Emphasis markers are not part of the word, so look past them.
        first = re.sub(r"^[*_]+", "", line)[:1]
        return first.islower() or first in "(" or bool(DANGLES.search(prev))
    lines = []
    for block in text.split("\x02"):
        # Inside one block, a bare newline was a <br>. If the fragment before it
        # has no terminal punctuation the sentence was soft-wrapped, so rejoin;
        # otherwise it was a deliberate line break and becomes its own line.
        for line in block.split("\n"):
            line = re.sub(r"[ \t]+", " ", line).strip()
            if not line or line in ("&nbsp;", "*", "**"):
                continue
            prev = lines[-1] if lines else None
            if (prev and prev is not BREAK
                    and not prev.startswith(("#", "-", ">"))
                    and not re.match(r"^\d+\. ", prev)
                    and not line.startswith(("#", "-", ">"))
                    and not re.match(r"^\d+\. ", line)
                    and is_soft_wrap(prev, line)):
                lines[-1] = prev + " " + line
            else:
                lines.append(line)
        lines.append(BREAK)
    lines = [l for l in lines if l is not BREAK]
    out = []
    for line in lines:
        if "\x00LIST\x00" in line:
            out.extend(line.split("\x00LIST\x00"))
            out.append("")
        elif line.startswith("- ") or re.match(r"^\d+\. ", line) or line.startswith("> "):
            if out and (out[-1].startswith("- ") or re.match(r"^\d+\. ", out[-1]) or out[-1].startswith("> ")):
                out.append(line)
            else:
                out.append("")
                out.append(line)
        else:
            out.append("")
            out.append(line)
    md = "\n".join(out)
    # Tidy: list items adjacent, everything else separated by one blank line.
    md = re.sub(r"[ \t]+\n", "\n", md)
    md = re.sub(r"\n{3,}", "\n\n", md).strip()
    md = re.sub(r"(?m)^(- |\d+\. |> )(.*)\n\n(?=(- |\d+\. |> ))", r"\1\2\n", md)
    while True:
        new = re.sub(r"(?m)^((?:- |\d+\. |> ).*)\n\n((?:- |\d+\. |> ))", r"\1\n\2", md)
        if new == md:
            break
        md = new
    return md.strip() + "\n"


# Em dash is banned in public copy (global LWS rule). Every one gets replaced.
# Default is a comma, which is always safe; anything that reads better as a
# pivot into a new sentence goes here explicitly, reviewed by eye.
EM_DASH_FIX = {
    "online presence\u2014prioritize speed": "online presence. Prioritize speed",
    # A comma here would read as if "you" were an item in the list.
    "everything for you\u2014domain, email, SSL, and CMS":
        "everything for you: domain, email, SSL, and CMS",
}


# Forbidden copy phrases (global LWS rule). Fixed in place, one reviewed
# replacement per occurrence, so nothing is silently reworded. Anything the
# rule says to delete outright is deleted.
BANNED_FIX = [
    # "Don't hesitate to reach out" -> delete the sentence entirely.
    ("If you\u2019re interested in learning more or have any questions, please "
     "don\u2019t hesitate to reach out. We\u2019re excited to help you take the next "
     "step in your digital journey while enjoying incredible savings.",
     "We\u2019re excited to help you take the next step in your digital journey "
     "while enjoying incredible savings. Reach out."),
    # "click here" as a link label -> put the link on what it actually does.
    ("simply [[click here](../contact.html)] and fill out the form with your "
     "email address.",
     "simply [fill out the form](../contact.html) with your email address."),
]

BANNED_SCAN = ["click here", "don\u2019t hesitate to reach out",
               "don't hesitate to reach out", "Click Here"]


def fix_banned(md, slug):
    for old, new in BANNED_FIX:
        if old in md:
            md = md.replace(old, new)
            note(slug, "banned phrase fixed: %s" % old[:60].replace("\n", " "))
    low = md.lower()
    for b in BANNED_SCAN:
        if b.lower() in low:
            note(slug, "BANNED PHRASE STILL PRESENT, needs a human: %r" % b)
    return md


def kill_em_dashes(md, slug):
    for old, new in EM_DASH_FIX.items():
        if old in md:
            md = md.replace(old, new)
            note(slug, "em dash replaced with a new sentence: %r" % new)
    while "\u2014" in md:
        i = md.index("\u2014")
        note(slug, "em dash replaced with a comma: %r" % md[max(0, i - 30):i + 30])
        md = md[:i].rstrip() + ", " + md[i + 1:].lstrip()
    return md


def normalise_headings(md, slug):
    """The page template owns the single h1, so body headings must start at h2
    and step one level at a time. WordPress bodies skip levels freely."""
    levels = sorted({len(m.group(1)) for m in re.finditer(r"(?m)^(#{1,6}) ", md)})
    if not levels:
        return md
    mapping = {lv: min(6, i + 2) for i, lv in enumerate(levels)}
    if all(k == v for k, v in mapping.items()):
        return md
    note(slug, "heading levels normalised: %s" % " ".join(
        "h%d->h%d" % (k, v) for k, v in sorted(mapping.items()) if k != v))
    return re.sub(r"(?m)^(#{1,6}) ",
                  lambda m: "#" * mapping[len(m.group(1))] + " ", md)


SENT = re.compile(r"(?<=[.!?])\s+")


def make_description(md, title, slug):
    """Derive a meta description from the opening prose. Placeholder quality:
    these want a human pass in the rewrite session."""
    body = []
    for l in md.splitlines():
        l = l.strip()
        if not l or l.startswith(("#", ">")):
            continue
        l = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", l)
        l = re.sub(r"[*_]{1,2}", "", l)
        l = re.sub(r"^(?:[-*]|\d+[.)])\s+", "", l).strip()
        # A short line with no terminal punctuation is a run-in heading, not
        # prose. It makes a useless meta description, so skip past it.
        if len(l) < 60 and not re.search(r"[.!?]$", l):
            continue
        body.append(l)
    plain = re.sub(r"\s+", " ", " ".join(body)).strip()
    if not plain:
        note(slug, "EMPTY BODY, no description derived")
        return title
    out = ""
    for s in SENT.split(plain):
        s = s.strip()
        if not s:
            continue
        cand = (out + " " + s).strip() if out else s
        if len(cand) > 154:
            break
        out = cand
    if not out:
        out = plain[:151].rsplit(" ", 1)[0] + "..."
    if len(out) > 154:
        out = out[:151].rsplit(" ", 1)[0] + "..."
    note(slug, "description derived (%d chars), needs a human pass" % len(out))
    return out


def yaml_str(s):
    return '"%s"' % s.replace("\\", "\\\\").replace('"', '\\"')


def write_post(slug, date, title, body_html):
    slug = SLUG_FIX.get(slug, slug)
    md = normalise_headings(
        fix_banned(kill_em_dashes(to_markdown(body_html, slug), slug), slug), slug)
    title = kill_em_dashes(title, slug)
    desc = make_description(md, title, slug)
    if len(title) > 60:
        note(slug, "TITLE %d chars, over the 60-char SEO limit" % len(title))
    fm = [
        "---",
        "title: %s" % yaml_str(title),
        "date: %s" % date,
        "description: %s" % yaml_str(desc),
        "draft: true",
        "---",
        "",
    ]
    path = os.path.join(OUTDIR, "%s-%s.md" % (date, slug))
    with open(path, "w") as f:
        f.write("\n".join(fm) + "\n" + md)
    return path, len(md.split())


def main():
    written = []
    wp = json.load(open(os.path.join(ROOT, "_restore", "wp-posts.json")))
    for p in wp:
        # post_date is the truth; the old dated permalinks are wrong.
        date = p["post_date"].split(" ")[0]
        title = htmlmod.unescape(p["post_title"]).strip()
        written.append(write_post(p["post_name"], date, title, p["post_content"]))

    wbpath = os.path.join(ROOT, "_restore", "wayback-posts.json")
    if os.path.exists(wbpath):
        for p in json.load(open(wbpath)):
            written.append(write_post(p["slug"], p["date"], p["title"], p["content"]))
    else:
        sys.stderr.write("WARNING: wayback-posts.json missing, only the 33 converted\n")

    for path, words in written:
        print("%5dw  %s" % (words, os.path.basename(path)))
    print("\n%d posts written\n" % len(written))
    print("--- NOTES ---")
    for n in notes:
        print(n)


if __name__ == "__main__":
    main()
