import re, json, sys, collections

F = "/Users/jonwolf/Desktop/livewebs_wrdplws.sql"
s = open(F, encoding="utf-8", errors="ignore").read()

COLS = ["ID","post_author","post_date","post_date_gmt","post_content","post_title",
        "post_excerpt","post_status","comment_status","ping_status","post_password",
        "post_name","to_ping","pinged","post_modified","post_modified_gmt",
        "post_content_filtered","post_parent","guid","menu_order","post_type",
        "post_mime_type","comment_count"]

def parse_values(text, start):
    """Walk a MySQL VALUES list from `start`, honouring quotes and backslash escapes."""
    rows, i, n = [], start, len(text)
    while i < n:
        while i < n and text[i] in " \t\r\n,":
            i += 1
        if i >= n or text[i] == ';':
            break
        if text[i] != '(':
            break
        i += 1
        row, buf, inq, esc = [], [], False, False
        while i < n:
            c = text[i]
            if inq:
                if esc:
                    buf.append({'n':'\n','t':'\t','r':'\r','0':'\0'}.get(c, c)); esc = False
                elif c == '\\': esc = True
                elif c == "'": inq = False
                else: buf.append(c)
            else:
                if c == "'":
                    inq = True
                elif c == ',':
                    row.append(''.join(buf)); buf = []
                elif c == ')':
                    row.append(''.join(buf)); i += 1; break
                elif c not in ' \t\r\n':
                    buf.append(c)
            i += 1
        rows.append(row)
    return rows

start = s.find("INSERT INTO `UZl3t99E_posts`")
all_rows = []
while start != -1:
    vi = s.index("VALUES", start) + len("VALUES")
    all_rows += parse_values(s, vi)
    start = s.find("INSERT INTO `UZl3t99E_posts`", vi)

posts = []
for r in all_rows:
    if len(r) != len(COLS):
        continue
    d = dict(zip(COLS, r))
    posts.append(d)

print("total rows parsed:", len(posts))
types = collections.Counter((p["post_type"], p["post_status"]) for p in posts)
for k, v in types.most_common(20):
    print(f"  {k[0]:20s} {k[1]:12s} {v}")

blog = [p for p in posts if p["post_type"] == "post" and p["post_status"] == "publish"]
blog.sort(key=lambda p: p["post_date"])
print("\nPUBLISHED BLOG POSTS:", len(blog))
for p in blog:
    words = len(re.sub(r"<[^>]+>", " ", p["post_content"]).split())
    print(f"  {p['post_date'][:10]}  {words:5d}w  {p['post_name'][:58]}")
    print(f"      {p['post_title'][:90]}")

json.dump(blog, open("/private/tmp/claude-501/-Users-jonwolf-Desktop-local-files-website-clients-livewebstudios-v3/f711b358-8d15-431f-8af3-a94284851adc/scratchpad/wp-posts.json","w"))
