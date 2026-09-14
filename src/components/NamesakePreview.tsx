import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/namesake-preview.css";
import {
  GeneratedPage,
  STYLES,
  type StyleKey,
} from "./namesake-styles/index";

/**
 * Namesake live preview generator.
 *
 * Two inputs, no configurator: a name field and four style chips. Something
 * is on screen before the visitor types (the placeholder name in the default
 * style), every keystroke re-renders, every chip re-skins. Clicking the frame
 * opens it full size.
 *
 * PATH RULE: this component never writes an absolute asset URL. The page
 * hands it `base` (its own relPrefix) and every font URL is built from that,
 * which is also why the faces are registered through the FontFace API instead
 * of a url() in the stylesheet: a url() in a stylesheet that Astro inlines
 * into every page would resolve against whichever page it landed in.
 */

interface Props {
  /** relPrefix(Astro.url.pathname) from the page. "" at root, "../" one deep. */
  base: string;
}

/* family, file, weight, style. Names are prefixed so they cannot collide
   with anything the host page loads. */
const FACES: ReadonlyArray<readonly [string, string, string, string]> = [
  ["NSP Cormorant", "cormorant-garamond-600.woff2", "600", "normal"],
  ["NSP Instrument", "instrument-sans-400.woff2", "400", "normal"],
  ["NSP Instrument", "instrument-sans-500.woff2", "500", "normal"],
  ["NSP Anton", "anton-400.woff2", "400", "normal"],
  ["NSP Caslon", "libre-caslon-display-400.woff2", "400", "normal"],
  ["NSP Lora", "lora-400.woff2", "400", "normal"],
  ["NSP Lora", "lora-400-italic.woff2", "400", "italic"],
  ["NSP DM Serif", "dm-serif-display-400.woff2", "400", "normal"],
  ["NSP Manrope", "manrope-400.woff2", "400", "normal"],
  ["NSP Manrope", "manrope-600.woff2", "600", "normal"],
] as const;

const PAGE_W = 1440;
const MAX_NAME = 40;
const STORE_NAME = "nsp:name";
const STORE_STYLE = "nsp:style";

/* ---------- name derivation ---------- */

export function cleanName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").slice(0, MAX_NAME);
}

export function toInitials(name: string): string {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
  return letters || "YN";
}

export function toFirstLast(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return slug || "yourname";
}

/* sessionStorage is a nice-to-have: a reload should not blank the demo. It
   throws in private mode and when site data is blocked, so it never gets to
   take the island down with it. */
function readStore(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStore(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export default function NamesakePreview({ base }: Props) {
  const [raw, setRaw] = useState("");
  const [style, setStyle] = useState<StyleKey>("quiet");
  const [fontsReady, setFontsReady] = useState(false);

  const frameRef = useRef<HTMLButtonElement | null>(null);
  const scalerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const name = cleanName(raw) || "Your Name";
  const initials = toInitials(cleanName(raw));
  const firstLast = toFirstLast(cleanName(raw));

  /* ---------- restore the last session ---------- */
  useEffect(() => {
    const savedName = readStore(STORE_NAME);
    if (savedName) setRaw(savedName);
    const savedStyle = readStore(STORE_STYLE);
    if (savedStyle && STYLES.some((s) => s.key === savedStyle)) {
      setStyle(savedStyle as StyleKey);
    }
  }, []);

  /* ---------- focus the field, on desktop only ----------
     A touch device would answer an autofocus by throwing up the software
     keyboard over the very thing the visitor came to look at, so the test is
     for a coarse pointer with no hover rather than for a screen width. */
  useEffect(() => {
    const coarse =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (!coarse) inputRef.current?.focus({ preventScroll: true });
  }, []);

  /* ---------- fonts ---------- */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (typeof document === "undefined" || !("fonts" in document)) {
        setFontsReady(true);
        return;
      }
      await Promise.all(
        FACES.map(async ([family, file, weight, fstyle]) => {
          try {
            const face = new FontFace(family, `url(${base}fonts/namesake/${file})`, {
              weight,
              style: fstyle,
              display: "block",
            });
            await face.load();
            document.fonts.add(face);
          } catch (err) {
            /* One missing face must not cost the whole preview: the style
               falls back to its stack and the other three still render. */
            console.error(`Namesake preview: could not load ${file}`, err);
          }
        })
      );
      try {
        await document.fonts.ready;
      } catch {
        /* ignore */
      }
      if (!cancelled) setFontsReady(true);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [base]);

  /* ---------- scale the 1440px page down to the frame ---------- */
  useEffect(() => {
    const frame = frameRef.current;
    const scaler = scalerRef.current;
    if (!frame || !scaler) return;

    /* The one runtime value that cannot live in the stylesheet. Written as a
       custom property rather than a transform so the CSS still owns what the
       property is used for. */
    const apply = () => {
      const w = frame.clientWidth;
      if (w > 0) scaler.style.setProperty("--nsp-scale", String(w / PAGE_W));
    };

    apply();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", apply);
      return () => window.removeEventListener("resize", apply);
    }
    const ro = new ResizeObserver(apply);
    ro.observe(frame);
    return () => ro.disconnect();
  }, []);

  /* ---------- persist ---------- */
  const onName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw(e.target.value);
    writeStore(STORE_NAME, e.target.value);
  }, []);

  const pickStyle = useCallback((key: StyleKey) => {
    setStyle(key);
    writeStore(STORE_STYLE, key);
  }, []);

  /* Arrow keys move selection inside the radio group, per the ARIA pattern. */
  const onChipKey = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
      const back = e.key === "ArrowLeft" || e.key === "ArrowUp";
      const fwd = e.key === "ArrowRight" || e.key === "ArrowDown";
      if (!back && !fwd) return;
      e.preventDefault();
      const next = (i + (fwd ? 1 : -1) + STYLES.length) % STYLES.length;
      pickStyle(STYLES[next].key);
      chipRefs.current[next]?.focus();
    },
    [pickStyle]
  );

  const openFull = useCallback(() => {
    /* Session 2 wires the modal here. */
  }, []);

  return (
    <div className="nsp-root">
      <div className="nsp-controls">
        <label className="nsp-label" htmlFor="nsp-name">
          Type your name to preview it
        </label>
        <input
          id="nsp-name"
          className="nsp-input"
          ref={inputRef}
          type="text"
          value={raw}
          onChange={onName}
          maxLength={MAX_NAME}
          placeholder="Type your name"
          aria-label="Your name"
          autoComplete="name"
          spellCheck={false}
        />

        <div className="nsp-chips" role="radiogroup" aria-label="Preview style">
          {STYLES.map((s, i) => {
            const on = s.key === style;
            return (
              <button
                key={s.key}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                data-style={s.key}
                className="nsp-chip"
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                onClick={() => pickStyle(s.key)}
                onKeyDown={(e) => onChipKey(e, i)}
              >
                <span className="nsp-chip-name">{s.label}</span>
                <span className="nsp-chip-row">
                  <span className="nsp-dots" aria-hidden="true">
                    <span className="nsp-dot" />
                    <span className="nsp-dot" />
                    <span className="nsp-dot" />
                  </span>
                  <span className="nsp-chip-sample">{s.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="nsp-stage">
        <button
          type="button"
          className="nsp-frame"
          ref={frameRef}
          onClick={openFull}
          aria-label="See it full size"
        >
          <div
            className={`nsp-scaler${fontsReady ? " is-ready" : ""}`}
            ref={scalerRef}
          >
            <GeneratedPage
              style={style}
              name={name}
              initials={initials}
              firstLast={firstLast}
            />
          </div>
        </button>

        <p className="nsp-caption">Live preview. Tap it to see it full size.</p>

        <button type="button" className="btn btn-ghost nsp-open" onClick={openFull}>
          See it full size.
        </button>
      </div>
    </div>
  );
}
