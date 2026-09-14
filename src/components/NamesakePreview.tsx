import { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
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
 * opens it full size with a Save PNG button.
 *
 * PATH RULE: this component never writes an absolute asset URL. The page
 * hands it `base` (its own relPrefix) and every font URL is built from that.
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
const PAGE_H = 900;
const MAX_NAME = 40;
const STORE_NAME = "nsp:name";
const STORE_STYLE = "nsp:style";
const FONT_STYLE_ID = "nsp-font-faces";

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

/** GA4, when it is there. Never throws, never blocks the save. */
function track(event: string, params: Record<string, unknown>): void {
  try {
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof g === "function") g("event", event, params);
  } catch {
    /* ignore */
  }
}

/**
 * A generated page scaled to fill whatever box it is dropped into.
 *
 * It measures ITSELF: .nsp-scaler is position:absolute/inset:0, so its own
 * clientWidth is the host's content width, which means the live frame and
 * the modal can share this without either one passing a ref down.
 */
function ScaledPage(props: {
  style: StyleKey;
  name: string;
  initials: string;
  firstLast: string;
  ready: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* The one runtime value that cannot live in the stylesheet. Written as a
       custom property rather than a transform so the CSS still owns what the
       property is used for. */
    const apply = () => {
      const w = el.clientWidth;
      if (w > 0) el.style.setProperty("--nsp-scale", String(w / PAGE_W));
    };

    apply();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", apply);
      return () => window.removeEventListener("resize", apply);
    }
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      className={`nsp-scaler${props.ready ? " is-ready" : ""}`}
      ref={ref}
    >
      <GeneratedPage
        style={props.style}
        name={props.name}
        initials={props.initials}
        firstLast={props.firstLast}
      />
    </div>
  );
}

export default function NamesakePreview({ base }: Props) {
  const [raw, setRaw] = useState("");
  const [style, setStyle] = useState<StyleKey>("quiet");
  const [fontsReady, setFontsReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveLabel, setSaveLabel] = useState("Save PNG");

  const frameRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const saveRef = useRef<HTMLButtonElement | null>(null);
  const exportRef = useRef<HTMLDivElement | null>(null);
  const returnToRef = useRef<HTMLElement | null>(null);
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const typed = cleanName(raw);
  const name = typed || "Your Name";
  const initials = toInitials(typed);
  const firstLast = toFirstLast(typed);

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

  /* ---------- fonts ----------
     Two routes to the same ten files, because they answer two different
     questions and neither one answers both:

     1. FontFace API. Registers the faces for rendering and, unlike a
        stylesheet, takes its URL from `base` at runtime, which is what keeps
        the path rule intact through Astro's inlined CSS.

     2. A runtime <style> element carrying the same @font-face rules.
        html-to-image builds its embedded font CSS by walking
        document.styleSheets. Faces added through the FontFace API are not in
        there, so without this the PNG falls back to Times while the modal
        on screen looks right. Same URLs, so the browser serves both from one
        fetch. Session 2D of the handoff anticipated exactly this. */
  useEffect(() => {
    let cancelled = false;

    if (!document.getElementById(FONT_STYLE_ID)) {
      const el = document.createElement("style");
      el.id = FONT_STYLE_ID;
      el.textContent = FACES.map(
        ([family, file, weight, fstyle]) =>
          `@font-face{font-family:"${family}";src:url("${base}fonts/namesake/${file}") format("woff2");font-weight:${weight};font-style:${fstyle};font-display:block;}`
      ).join("\n");
      document.head.appendChild(el);
    }

    async function load() {
      if (typeof document === "undefined" || !("fonts" in document)) {
        setFontsReady(true);
        return;
      }
      await Promise.all(
        FACES.map(async ([family, file, weight, fstyle]) => {
          try {
            const face = new FontFace(
              family,
              `url(${base}fonts/namesake/${file})`,
              { weight, style: fstyle, display: "block" }
            );
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

  /* ---------- keep the intake form's hidden fields current ----------
     The form lives in the Astro page, not in this island, so this reaches
     out by name. Absent fields are simply not written to. */
  useEffect(() => {
    const set = (field: string, value: string) => {
      const el = document.querySelector<HTMLInputElement>(
        `input[name="${field}"]`
      );
      if (el) el.value = value;
    };
    set("preview_style", style);
    set("preview_name", typed);
  }, [style, typed]);

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

  /* ---------- modal ---------- */

  const openFull = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      returnToRef.current = e.currentTarget as HTMLElement;
      setOpen(true);
      track("namesake_preview_open", { style });
    },
    [style]
  );

  const closeFull = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  /* Drive the native dialog from state so Escape, the Close button and a
     backdrop click all land in one place. */
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;

    if (open && !dlg.open) {
      dlg.showModal();
      document.body.classList.add("nsp-scroll-lock");
      saveRef.current?.focus();
    } else if (!open && dlg.open) {
      dlg.close();
    }
  }, [open]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;

    const onClose = () => {
      setOpen(false);
      setSaveLabel("Save PNG");
      document.body.classList.remove("nsp-scroll-lock");
      returnToRef.current?.focus();
    };
    /* The dialog fills its own backdrop area, so a click that lands on the
       dialog element itself rather than on its content is a backdrop click. */
    const onClick = (ev: MouseEvent) => {
      if (ev.target === dlg) dlg.close();
    };

    /* Escape is native dialog behaviour, but only when the browser raises its
       own `cancel`. Embedded and automated contexts do not always get there,
       and a modal you cannot dismiss from the keyboard is not a small bug, so
       the close is made explicit rather than inherited. Closing an already
       closed dialog is a no-op, so this is safe alongside the native path. */
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        ev.preventDefault();
        dlg.close();
      }
    };

    dlg.addEventListener("close", onClose);
    dlg.addEventListener("click", onClick);
    dlg.addEventListener("keydown", onKeyDown);
    return () => {
      dlg.removeEventListener("close", onClose);
      dlg.removeEventListener("click", onClick);
      dlg.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  /* ---------- Save PNG ---------- */

  const savePng = useCallback(async () => {
    const node = exportRef.current;
    if (!node || saving) return;

    setSaving(true);
    setSaveLabel("Saving...");
    let url: string | null = null;

    try {
      /* The export instance is unscaled and on screen (off to the side, not
         display:none), so its layout and fonts are fully resolved. Waiting
         on fonts.ready again here covers a save fired before the first load
         settled. */
      try {
        await document.fonts.ready;
      } catch {
        /* ignore */
      }

      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
        width: PAGE_W,
        height: PAGE_H,
      });

      const blob = await (await fetch(dataUrl)).blob();
      url = URL.createObjectURL(blob);

      /* iOS Safari advertises the download attribute and then ignores it, so
         it gets the new-tab route and an instruction instead of a silent
         no-op. */
      const iOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

      if (iOS) {
        window.open(url, "_blank");
        setSaveLabel("Opened. Long-press to save.");
        window.setTimeout(() => setSaveLabel("Save PNG"), 2000);
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = `namesake-${firstLast}-${style}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setSaveLabel("Save PNG");
      }

      track("namesake_preview_save", { style, name_length: typed.length });
    } catch (err) {
      console.error("Namesake preview: PNG export failed", err);
      setSaveLabel("Could not save. Try again.");
      window.setTimeout(() => setSaveLabel("Save PNG"), 3000);
    } finally {
      setSaving(false);
      if (url) window.setTimeout(() => URL.revokeObjectURL(url as string), 10000);
    }
  }, [firstLast, style, typed.length, saving]);

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
          <ScaledPage
            style={style}
            name={name}
            initials={initials}
            firstLast={firstLast}
            ready={fontsReady}
          />
        </button>

        <p className="nsp-caption">Live preview. Tap it to see it full size.</p>

        <button type="button" className="btn btn-ghost nsp-open" onClick={openFull}>
          See it full size.
        </button>
      </div>

      <dialog className="nsp-modal" ref={dialogRef} aria-label="Your site, full size">
        <div className="nsp-modal-frame">
          <ScaledPage
            style={style}
            name={name}
            initials={initials}
            firstLast={firstLast}
            ready={fontsReady}
          />
        </div>

        <div className="nsp-modal-actions">
          <button
            type="button"
            className="btn nsp-save"
            ref={saveRef}
            onClick={savePng}
            disabled={saving}
          >
            {saveLabel}
          </button>
          <button type="button" className="btn btn-ghost" onClick={closeFull}>
            Close
          </button>
        </div>

        <p className="nsp-modal-note">
          Want the real one? <a href="#start-form">Tell Jon which style you liked.</a>
        </p>

        {/* The PNG is rendered from this one: same component, unscaled, at a
            true 1440x900 so the export is not a scaled-up thumbnail. It is
            off to the side rather than display:none, because a hidden
            subtree has no resolved layout for html-to-image to walk. */}
        {open && (
          <div className="nsp-export-host" aria-hidden="true">
            <div ref={exportRef}>
              <GeneratedPage
                style={style}
                name={name}
                initials={initials}
                firstLast={firstLast}
              />
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
