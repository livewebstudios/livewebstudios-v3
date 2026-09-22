/**
 * navIcons — the one glyph set every nav dropdown draws from.
 *
 * Jon 2026-09-14: "put icons in all drop downs menus." The Studios panel had
 * its own private ICONS map; Services, Industries and About had none. Rather
 * than copy that map into Nav.astro and let the two drift, it lives here and
 * both components import it.
 *
 * House rules for anything added below:
 *   - 24x24 grid, stroke only (the consumer supplies fill="none",
 *     stroke="currentColor", stroke-width 1.6, round caps and joins).
 *   - No detail finer than ~2px on the grid. These render at 18px against a
 *     dark panel, and anything smaller collapses into a smudge.
 *   - Inline SVG, not the PNG set in public/images/icons, for the same reason.
 */
export const ICONS: Record<string, string> = {
  /* ---- Studios panel ---- */
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
  tag: '<path d="M3 12.5V4.5A1.5 1.5 0 0 1 4.5 3h8L21 11.5 13.5 19 3 12.5Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="1"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1"/>',
  star: '<path d="M12 2.8l2.7 5.9 6.4.7-4.8 4.3 1.3 6.3L12 16.9 6.4 20l1.3-6.3-4.8-4.3 6.4-.7Z"/>',
  route: '<circle cx="5.5" cy="5.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/><path d="M5.5 8v5a4 4 0 0 0 4 4h6.5"/>',
  play: '<circle cx="12" cy="12" r="9.2"/><path d="M10 8.4l6 3.6-6 3.6Z"/>',
  photos: '<rect x="6" y="3" width="15" height="15" rx="2"/><path d="M3 7v12a2 2 0 0 0 2 2h12"/><circle cx="11" cy="8" r="1.5"/><path d="M6.6 15l3.4-3 3 2.6L17 11l4 4"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',

  /* ---- Services ---- */
  monitor: '<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  cart: '<circle cx="9.2" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h2.6l2.4 11.2h11l2-7.7H6.4"/>',
  server: '<rect x="3" y="4" width="18" height="6.5" rx="1.5"/><rect x="3" y="13.5" width="18" height="6.5" rx="1.5"/><circle cx="7" cy="7.25" r=".9"/><circle cx="7" cy="16.75" r=".9"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.7 5.3 17 7M7 17l-1.7 1.7M18.7 18.7 17 17M7 7 5.3 5.3"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.2 15.2 21 21"/><path d="M7.8 11.6l1.9-2.2 1.8 1.6 2.4-3"/>',
  bot: '<rect x="4" y="7.5" width="16" height="12" rx="3"/><path d="M12 3.8v3.7"/><circle cx="12" cy="2.8" r="1.1"/><circle cx="9" cy="12.8" r=".9"/><circle cx="15" cy="12.8" r=".9"/><path d="M9.6 16.2h4.8"/>',
  image: '<rect x="2.5" y="4" width="19" height="16" rx="2"/><circle cx="8" cy="9.5" r="1.6"/><path d="M3 17l5-4.5 4 3.5 3.5-3L21 17"/>',
  compass: '<circle cx="12" cy="12" r="9.2"/><path d="M15.6 8.4 13.8 13.8 8.4 15.6 10.2 10.2Z"/>',
  pen: '<path d="M12 2.5 6.2 14.2h11.6L12 2.5Z"/><path d="M9.6 14.2h4.8l-2.4 7-2.4-7Z"/><circle cx="12" cy="11.4" r="1.1"/>',
  cards: '<rect x="2.5" y="6" width="13" height="15" rx="2"/><path d="M7 3h11a3 3 0 0 1 3 3v11"/>',
  chat: '<path d="M20.6 12.6a7.6 7.6 0 0 1-8.3 7.6L6 21.8l1.4-4.3A7.6 7.6 0 1 1 20.6 12.6Z"/><path d="M9 11h6M9 14.2h4"/>',
  mail: '<rect x="2.6" y="4.8" width="18.8" height="14.4" rx="2"/><path d="M3.4 6.6 12 13.2l8.6-6.6"/>',

  /* ---- Industries ---- */
  cross: '<circle cx="12" cy="12" r="9.2"/><path d="M12 7.6v8.8M7.6 12h8.8"/>',
  scales: '<path d="M12 3.2v17.6M7 20.8h10"/><path d="M12 6.4 5 8M12 6.4 19 8"/><path d="M2.6 14.2 5 8l2.4 6.2a2.6 2.6 0 0 1-4.8 0Z"/><path d="M16.6 14.2 19 8l2.4 6.2a2.6 2.6 0 0 1-4.8 0Z"/>',
  bank: '<path d="M3 9.6 12 4l9 5.6"/><path d="M5.4 9.6v8.2M10 9.6v8.2M14 9.6v8.2M18.6 9.6v8.2"/><path d="M3 20.4h18"/>',
  hardhat: '<path d="M3.6 17.2a8.4 8.4 0 0 1 16.8 0Z"/><path d="M9.4 8.8V4.8a1.4 1.4 0 0 1 1.4-1.4h2.4a1.4 1.4 0 0 1 1.4 1.4v4"/><path d="M2.6 17.2h18.8"/>',
  towers: '<rect x="3.4" y="7" width="7.6" height="13.6" rx="1"/><rect x="13" y="3.4" width="7.6" height="17.2" rx="1"/><path d="M6 10.4h2.4M6 13.8h2.4M6 17.2h2.4M15.6 6.8H18M15.6 10.2H18M15.6 13.6H18M15.6 17H18"/>',
  factory: '<path d="M2.8 20.6h18.4"/><path d="M2.8 20.6V10.6l5.6 3.4v-3.4l5.6 3.4V6h7.2v14.6"/>',
  tooth: '<path d="M17.6 3.6c-1.9-1-3.4-.4-4.5.2a2.4 2.4 0 0 1-2.2 0c-1.1-.6-2.6-1.2-4.5-.2C3.6 5.2 3.4 9 4.6 12.2c.7 1.8 1 3.8 1.2 5.6.2 1.6.4 2.8 1.5 2.8 1.3 0 1.6-1.6 2-3.8.3-1.6.7-3.2 1.7-3.2s1.4 1.6 1.7 3.2c.4 2.2.7 3.8 2 3.8 1.1 0 1.3-1.2 1.5-2.8.2-1.8.5-3.8 1.2-5.6 1.2-3.2 1-7-1.8-8.6Z"/>',
  heart: '<path d="M12 20.4 4.3 12.7a4.9 4.9 0 0 1 6.9-6.9l.8.8.8-.8a4.9 4.9 0 0 1 6.9 6.9L12 20.4Z"/>',
  briefcase: '<rect x="2.6" y="7.2" width="18.8" height="13" rx="2"/><path d="M8.4 7.2V5.4a2 2 0 0 1 2-2h3.2a2 2 0 0 1 2 2v1.8"/><path d="M2.6 12.6h18.8"/>',
  shield: '<path d="M12 2.8 4.4 6v6c0 4.6 3.2 8 7.6 9.2 4.4-1.2 7.6-4.6 7.6-9.2V6L12 2.8Z"/><path d="M9 12.2l2.2 2.2 4-4.2"/>',

  /* ---- About ---- */
  book: '<path d="M4 4.4A2 2 0 0 1 6 2.4h13v17.2H6a2 2 0 0 0-2 2Z"/><path d="M4 19.6a2 2 0 0 1 2-2h13"/>',
  help: '<circle cx="12" cy="12" r="9.2"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.8-.9 1.4v.5"/><circle cx="12" cy="17" r=".9"/>',
};
