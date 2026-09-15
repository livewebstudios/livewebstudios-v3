#!/usr/bin/env python3
"""
Pull title and post body out of the Wayback captures of the 9 posts that were
never in the WordPress dump, and write _restore/wayback-posts.json in the same
shape convert-posts.py expects from wp-posts.json.

Usage:  python3 _restore/extract-wayback.py <dir-of-scraped-html>
"""
import html as htmlmod
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "_restore", "_wayback-html")

CLEAN = re.compile(r"(?is)<(script|style|noscript)\b.*?</\1>")
DIV = re.compile(r"(?is)<div\b[^>]*>|</div\s*>")


def post_body(html):
    """The Divi theme-builder wraps the post in .et_pb_post_content. Walk the
    div nesting from that opening tag to its matching close."""
    m = re.search(r'<div[^>]*class="[^"]*et_pb_post_content[^"]*"[^>]*>', html, re.I)
    if not m:
        return None
    depth, pos = 1, m.end()
    for d in DIV.finditer(html, m.end()):
        depth += -1 if d.group(0).startswith("</") else 1
        if depth == 0:
            return html[pos:d.start()]
    return None


def main():
    meta = json.load(open(os.path.join(ROOT, "_restore", "wayback-only.json")))
    out, missing = [], []
    for p in meta:
        path = os.path.join(SRC, p["slug"] + ".html")
        if not os.path.exists(path):
            missing.append(p["slug"])
            continue
        html = CLEAN.sub("", open(path).read())
        body = post_body(html)
        t = re.search(r'<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>(.*?)</h1>', html, re.I | re.S)
        if not t:
            t = re.search(r"<title>(.*?)</title>", html, re.I | re.S)
        title = htmlmod.unescape(re.sub(r"<[^>]+>", "", t.group(1))).strip() if t else ""
        title = re.sub(r"\s*[-|]\s*Live Web Studios\s*$", "", title).strip()
        if not body or len(re.sub(r"<[^>]+>", "", body).strip()) < 120:
            missing.append(p["slug"] + " (no usable body)")
            continue
        out.append({"slug": p["slug"], "date": p["date"], "url": p["url"],
                    "title": title, "content": body.strip()})
        print("%-88s %5d chars  %s" % (p["slug"][:88],
              len(re.sub(r"<[^>]+>", "", body)), title))

    dest = os.path.join(ROOT, "_restore", "wayback-posts.json")
    json.dump(out, open(dest, "w"), indent=2)
    print("\n%d of 9 extracted -> %s" % (len(out), dest))
    if missing:
        print("MISSING: " + ", ".join(missing))


if __name__ == "__main__":
    main()
