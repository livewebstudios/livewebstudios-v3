/**
 * Gold Rack meter and knob geometry (2026-11-15). Ported from the kit's
 * build_kit.py so the Astro components draw exactly what the kit drew.
 * dbToDeg must stay identical to the copy in src/scripts/lbws-motion.js:
 * the server-rendered needle has to sit where the script expects it.
 */
export const VU_PIVOT = { x: 110, y: 132 };

/** dB to needle angle. -20 dB = -50deg (rest), 0 dB = 18.57deg, +3 dB = 50deg. */
export function dbToDeg(db: number): number {
  const lin = (d: number) => 10 ** (d / 20);
  const n = (lin(db) - lin(-20)) / (lin(3) - lin(-20));
  return -50 + Math.max(-0.04, Math.min(1.04, n)) * 100;
}

/** Point on a circle around the meter pivot, 0deg = straight up. */
export function pol(deg: number, r: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [VU_PIVOT.x + r * Math.cos(a), VU_PIVOT.y + r * Math.sin(a)];
}

export function arc(a0: number, a1: number, r: number): string {
  const [x0, y0] = pol(a0, r);
  const [x1, y1] = pol(a1, r);
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

/** Short unique id for SVG gradient ids, which must not repeat on a page. */
export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
