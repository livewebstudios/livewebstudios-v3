#!/usr/bin/env python3
"""ai-fallback-loops.py: procedural stand-in loops for the four /ai video slots.

Pure Python (no numpy, no canvas): draws flat violet particles and lines on
the --ai-ink ground frame by frame, pipes raw RGB into ffmpeg, then hands the
5 s forward pass to ai-video-transcode.sh, which makes the 10 s palindrome.
Flat colour only, no gradients, per the sub-brand rule.

    python3 scripts/ai-fallback-loops.py            # all four
    python3 scripts/ai-fallback-loops.py ai-hero    # one
"""
import math, os, random, subprocess, sys, tempfile

W, H, FPS, SECS = 1600, 900, 24, 5
N = FPS * SECS
BG = (14, 11, 26)          # --ai-ink #0E0B1A
VIOLET = (167, 139, 250)   # --ai #A78BFA
SLATE = (94, 107, 126)     # --muted-2
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def mix(c, a):
    return bytes(round(BG[i] + (c[i] - BG[i]) * a) for i in range(3))


def blank():
    return bytearray(bytes(BG) * (W * H))


def rect(buf, x, y, w, h, col):
    x, y = int(x), int(y)
    if x >= W or y >= H or x + w <= 0 or y + h <= 0:
        return
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(W, x + w), min(H, y + h)
    row = col * (x1 - x0)
    for yy in range(y0, y1):
        o = (yy * W + x0) * 3
        buf[o:o + len(row)] = row


def line(buf, x0, y0, x1, y1, col):
    steps = int(max(abs(x1 - x0), abs(y1 - y0))) or 1
    for s in range(0, steps + 1, 2):
        t = s / steps
        rect(buf, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, 1, 1, col)


def hero(rng):
    # Loose constellation: slow drift, slow push from centre, faint links.
    pts = [(rng.uniform(0, W), rng.uniform(0, H), rng.uniform(-10, 10),
            rng.uniform(-6, 6), rng.choice([2, 2, 3, 4]), rng.uniform(.35, 1))
           for _ in range(150)]
    link = mix(VIOLET, .16)
    for f in range(N):
        t = f / N
        z = 1 + .035 * t
        buf = blank()
        cur = [((x + vx * t * SECS - W / 2) * z + W / 2,
                (y + vy * t * SECS - H / 2) * z + H / 2, s, a)
               for x, y, vx, vy, s, a in pts]
        for i in range(0, len(cur), 3):
            x, y, _, _ = cur[i]
            for j in range(i + 3, min(i + 24, len(cur)), 3):
                x2, y2, _, _ = cur[j]
                if (x - x2) ** 2 + (y - y2) ** 2 < 150 ** 2:
                    line(buf, x, y, x2, y2, link)
        for x, y, s, a in cur:
            rect(buf, x, y, s, s, mix(VIOLET, a))
        yield buf


def services(rng):
    # Brushed-metal hairlines drifting sideways, violet glints tracing them.
    rows = [(rng.randrange(H), rng.uniform(.06, .22), rng.randrange(80, 900),
             rng.uniform(0, W)) for _ in range(90)]
    glints = [(rng.choice(rows), rng.uniform(0, W), rng.uniform(40, 160),
               rng.randrange(30, 120)) for _ in range(16)]
    for f in range(N):
        t = f / N
        buf = blank()
        for y, a, ln, x in rows:
            rect(buf, (x + 40 * t) % (W + ln) - ln, y, ln, 1, mix(SLATE, a))
        for (y, _, _, _), x, v, ln in glints:
            rect(buf, (x + v * t * SECS) % (W + ln) - ln, y - 1, ln, 2, mix(VIOLET, .85))
        yield buf


def proof(rng):
    # Data in motion: particles streaming one way, depth sets speed + streak.
    parts = []
    for _ in range(240):
        d = rng.uniform(.2, 1)
        parts.append((rng.uniform(0, W), rng.uniform(0, H), 30 + 170 * d,
                      max(2, int(3 * d)), d, rng.random() < .22))
    for f in range(N):
        t = f / N
        buf = blank()
        for x, y, v, s, d, white in parts:
            px = (x + v * t * SECS) % W
            col = mix((243, 247, 250) if white else VIOLET, .25 + .7 * d)
            rect(buf, px - int(v * .12), y, int(v * .12) + s, s if d < .6 else 2, col)
        yield buf


def how(rng):
    # Topographic contours slowly redrawing: stacked sine lines phase-shifting.
    lines = [(80 + i * 62, rng.uniform(18, 46), rng.uniform(.002, .006),
              rng.uniform(0, 6.3), rng.uniform(.3, 1.0)) for i in range(13)]
    for f in range(N):
        t = f / N
        buf = blank()
        for k, (y0, amp, fr, ph, a) in enumerate(lines):
            col = mix(VIOLET if k % 3 == 0 else SLATE, a if k % 3 == 0 else a * .5)
            drawn = int(W * (.55 + .45 * t)) if k % 4 == 1 else W
            for x in range(0, drawn, 2):
                y = y0 + amp * math.sin(x * fr + ph + t * 1.1) + 14 * math.sin(x * .0011 + k)
                rect(buf, x, y, 2, 2, col)
        yield buf


SLOTS = {"ai-hero": hero, "ai-services": services, "ai-proof": proof, "ai-how": how}


def render(name):
    rng = random.Random(name)
    raw = os.path.join(tempfile.gettempdir(), f"{name}-raw.mp4")
    ff = subprocess.Popen(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "rawvideo",
         "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", raw],
        stdin=subprocess.PIPE)
    for frame in SLOTS[name](rng):
        ff.stdin.write(frame)
    ff.stdin.close()
    ff.wait()
    subprocess.run([os.path.join(ROOT, "scripts", "ai-video-transcode.sh"), raw, name], check=True)
    os.remove(raw)


if __name__ == "__main__":
    for n in sys.argv[1:] or SLOTS:
        render(n)
