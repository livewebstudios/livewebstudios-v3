/**
 * imageSize — the intrinsic pixel size of a file in public/, read at build time.
 *
 * Why this exists: an <img> with no width/height gives the browser no aspect
 * ratio, so the row collapses to zero height until the bytes land and then
 * shoves everything below it down the page. That is Cumulative Layout Shift,
 * and it is a Core Web Vitals metric Google grades the site on. The launch
 * audit (2026-09-15) counted 139 images without dimensions.
 *
 * Why it reads the file instead of taking hand-typed numbers: 139 pairs typed
 * by hand is 139 chances to be wrong, and a WRONG width/height is worse than
 * none. It reserves the wrong box, so the shift still happens and the image
 * renders distorted until CSS corrects it. Reading the header cannot disagree
 * with the file.
 *
 * This is a static site, so every call happens during `astro build` and none
 * at run time. Results are memoized per build. Only the first few dozen bytes
 * of each file are parsed, not the whole image.
 *
 * Pair the attributes with `height: auto` in CSS (every caller here already
 * has it, via `.post-hero-img img`, `.card-media img` and friends), so the
 * attributes supply the ratio and CSS still owns the rendered size.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface Dim {
  width: number;
  height: number;
}

const PUBLIC = "public";
const cache = new Map<string, Dim | undefined>();

/** PNG: IHDR is always the first chunk, width/height at bytes 16..24. */
function png(b: Buffer): Dim | undefined {
  if (b.length < 24) return undefined;
  if (b.readUInt32BE(0) !== 0x89504e47) return undefined;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

/**
 * JPEG: walk the marker segments to the start-of-frame (SOF0-SOF15, minus the
 * four that are not frame headers) and read the dimensions out of it. There is
 * no fixed offset, because the number and size of the preceding APPn/DQT/DRI
 * segments varies per encoder.
 */
function jpeg(b: Buffer): Dim | undefined {
  if (b.length < 4 || b.readUInt16BE(0) !== 0xffd8) return undefined;
  let i = 2;
  while (i < b.length - 9) {
    if (b[i] !== 0xff) {
      i++; // resync over padding
      continue;
    }
    const marker = b[i + 1];
    /* Standalone markers carry no length payload. */
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    const len = b.readUInt16BE(i + 2);
    /* SOF0..SOF15, excluding DHT (c4), JPGA (c8) and DAC (cc). */
    const isSOF =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSOF) {
      return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return undefined;
}

/** WebP: three sub-formats (lossy, lossless, extended), each storing size differently. */
function webp(b: Buffer): Dim | undefined {
  if (b.length < 30) return undefined;
  if (b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP") {
    return undefined;
  }
  const chunk = b.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    /* Lossy: 14-bit dimensions after the 3-byte start code. */
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    /* Lossless: 14 bits each, packed across four bytes after the 0x2f signature. */
    const n = b.readUInt32LE(21);
    return { width: (n & 0x3fff) + 1, height: ((n >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X") {
    /* Extended: 24-bit canvas size minus one, little-endian. */
    const w = b[24] | (b[25] << 8) | (b[26] << 16);
    const h = b[27] | (b[28] << 8) | (b[29] << 16);
    return { width: w + 1, height: h + 1 };
  }
  return undefined;
}

/**
 * The intrinsic size of `src`, or undefined if the file is missing or is a
 * format with no fixed pixel size (SVG). Accepts the root-relative form stored
 * in frontmatter ("/images/blog/foo.jpg") and the bare form ("images/...").
 * Undefined is a usable answer: callers spread it, so the attributes are simply
 * omitted and the markup is exactly what it was before.
 */
export function imageSize(src: string): Dim | undefined {
  if (!src) return undefined;
  /* Strip any ../ prefix a template already applied, plus the leading slash. */
  const key = src.replace(/^(\.\.\/)+/, "").replace(/^\//, "");
  if (cache.has(key)) return cache.get(key);

  let dim: Dim | undefined;
  try {
    const head = readFileSync(join(PUBLIC, key)).subarray(0, 64 * 1024);
    dim = png(head) ?? jpeg(head) ?? webp(head);
    if (!dim || !dim.width || !dim.height) dim = undefined;
  } catch {
    /* Missing file: leave the attributes off rather than failing the build.
       A broken src is a separate problem and shows up as a 404 in the audit. */
    dim = undefined;
  }
  cache.set(key, dim);
  return dim;
}
