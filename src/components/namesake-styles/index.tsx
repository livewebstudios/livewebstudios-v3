/**
 * The four generated home pages for the Namesake preview.
 *
 * Each one renders a complete 1440x900 page for a typed name. They are
 * DECORATIVE markup, not document structure: no headings, no landmarks, no
 * links. The real page already owns its single H1 and the preview must not
 * add a second, so every line of type here is a div or a span carrying a
 * class. The frame that holds them is what carries the accessible name.
 *
 * Layout, palette and copy are fixed per style. The only variables are the
 * name and the two things derived from it, which is the whole point of the
 * demo: two inputs, no configurator.
 *
 * All colour, font and radius values live in src/styles/namesake-preview.css
 * under [data-nsp-style="..."]. Nothing is styled here.
 */

export type StyleKey = "quiet" | "bold" | "classical" | "warm";

export interface PageProps {
  /** Trimmed, whitespace-collapsed, capped at 40. "Your Name" when empty. */
  name: string;
  /** First letter of each word, uppercase, max three. "YN" when empty. */
  initials: string;
  /** Lowercased, everything but a-z0-9 stripped. "yourname" when empty. */
  firstLast: string;
}

/**
 * Break a name for the two styles that set it on two lines. First word on
 * line one, everything else on line two, which is what reads as a name
 * rather than an arbitrary wrap. A single word stays on one line.
 */
export function twoLines(name: string): string[] {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length < 2) return [name];
  return [parts[0], parts.slice(1).join(" ")];
}

/**
 * Length band for the name, 0 to 3, measured on the LONGEST line rather than
 * the whole string so the two-line styles are not punished for a long full
 * name. The CSS turns this into a font size per style.
 */
export function lengthBand(lines: string[]): 0 | 1 | 2 | 3 {
  const longest = lines.reduce((m, l) => Math.max(m, l.length), 0);
  if (longest <= 8) return 0;
  if (longest <= 14) return 1;
  if (longest <= 22) return 2;
  return 3;
}

/** The lines a given style will actually render, for band measurement. */
export function linesFor(style: StyleKey, name: string): string[] {
  return style === "bold" || style === "warm" ? twoLines(name) : [name];
}

/* ---------------- quiet: Quiet Editorial ---------------- */

function QuietPage({ name }: PageProps) {
  return (
    <div className="nsp-q">
      <div className="nsp-q-top">
        <span className="nsp-q-mark">{name}</span>
        <span className="nsp-q-nav">
          <span>Work</span>
          <span>Writing</span>
          <span>Contact</span>
        </span>
      </div>

      <div className="nsp-q-mid">
        <span className="nsp-q-name">{name}</span>
        <span className="nsp-q-tag">
          Selected work, writing, and a way to reach me.
        </span>
        <span className="nsp-q-rule" />
        <span className="nsp-q-btn">Reach out.</span>
      </div>

      <div className="nsp-q-foot">
        <div className="nsp-q-col">
          <span className="nsp-q-ch">Work</span>
          <span className="nsp-q-cp">
            Selected projects, and a short note on each.
          </span>
        </div>
        <div className="nsp-q-col">
          <span className="nsp-q-ch">Writing</span>
          <span className="nsp-q-cp">
            Essays, field notes, and the occasional longer piece.
          </span>
        </div>
        <div className="nsp-q-col">
          <span className="nsp-q-ch">About</span>
          <span className="nsp-q-cp">
            A short history, and what I am building.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- bold: Bold Display ---------------- */

function BoldPage({ name }: PageProps) {
  const lines = twoLines(name);
  const shout = name.toUpperCase();

  /* The marquee has to RUN OFF the right edge at any name length, so the
     repeat count is derived rather than fixed. A fixed count cannot do both
     jobs: 8 repeats of "AL" covers 620 of the 1440 and the row reads as
     half empty, while 8 of "MAXIMILIAN FEATHERSTONEHAUGH III" builds 5300px
     of clipped layout for nothing.

     MARQUEE_PX is the row's font-size, 0.42 its rough cap-width ratio in
     Anton, 34 the gap plus separator. Three is the floor so even a very long
     name still reads as a repeating run. */
  const MARQUEE_PX = 58;
  const perRepeat = Math.max(1, shout.length) * 0.42 * MARQUEE_PX + 34;
  const repeats = Array.from(
    { length: Math.max(3, Math.ceil(1560 / perRepeat)) },
    (_, i) => i
  );

  return (
    <div className="nsp-b">
      <span className="nsp-b-eyebrow">PORTFOLIO. PRESS. CONTACT.</span>

      <div className="nsp-b-mid">
        <span className="nsp-b-name">
          {lines.map((line, i) => (
            <span className="nsp-b-line" key={i}>
              {line}
            </span>
          ))}
        </span>
        <span className="nsp-b-btn">Let's talk.</span>
      </div>

      <div className="nsp-b-marquee" aria-hidden="true">
        {repeats.map((i) => (
          <span key={i}>
            {shout}
            <span className="nsp-b-sep"> &middot; </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- classical: Classical ---------------- */

function ClassicalPage({ name, initials, firstLast }: PageProps) {
  return (
    <div className="nsp-c">
      <span className="nsp-c-monogram">{initials}</span>

      <div className="nsp-c-mid">
        <span className="nsp-c-name">{name}</span>
        <span className="nsp-c-tagwrap">
          <span className="nsp-c-hair" />
          <span className="nsp-c-tag">Reputation, considered.</span>
          <span className="nsp-c-hair" />
        </span>
      </div>

      <div className="nsp-c-foot">
        <span className="nsp-c-quote">
          &ldquo;The work speaks. This is where it is heard.&rdquo;
        </span>
        <span className="nsp-c-domain">{firstLast}.com</span>
      </div>
    </div>
  );
}

/* ---------------- warm: Warm Boutique ---------------- */

function WarmPage({ name }: PageProps) {
  const lines = twoLines(name);

  return (
    <div className="nsp-w">
      <div className="nsp-w-left">
        <span className="nsp-w-name">
          {lines.map((line, i) => (
            <span className="nsp-w-line" key={i}>
              {line}
            </span>
          ))}
        </span>
        <span className="nsp-w-tag">
          Hello. Here is what I do, and how to reach me.
        </span>
        <span className="nsp-w-btn">Say hello.</span>
      </div>

      {/* A stand-in for a portrait: a gradient block, never a face. */}
      <div className="nsp-w-art" aria-hidden="true" />

      <div className="nsp-w-foot">
        {["Work", "Story", "Press", "Contact"].map((t) => (
          <span className="nsp-w-pill" key={t}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- the registry ---------------- */

export interface StyleDef {
  key: StyleKey;
  /** Label on the chip. */
  label: string;
  Page: (props: PageProps) => JSX.Element;
}

export const STYLES: StyleDef[] = [
  { key: "quiet", label: "Quiet Editorial", Page: QuietPage },
  { key: "bold", label: "Bold Display", Page: BoldPage },
  { key: "classical", label: "Classical", Page: ClassicalPage },
  { key: "warm", label: "Warm Boutique", Page: WarmPage },
];

/**
 * One generated page, wrapped in the element that carries its style tokens
 * and its length band. Used by the live frame, the modal, and the off-screen
 * export instance, so all three are guaranteed to be the same render.
 */
export function GeneratedPage({
  style,
  name,
  initials,
  firstLast,
}: { style: StyleKey } & PageProps) {
  const def = STYLES.find((s) => s.key === style) ?? STYLES[0];
  const band = lengthBand(linesFor(def.key, name));
  const { Page } = def;

  return (
    <div className="nsp-page" data-nsp-style={def.key} data-nsp-len={band}>
      <Page name={name} initials={initials} firstLast={firstLast} />
    </div>
  );
}
