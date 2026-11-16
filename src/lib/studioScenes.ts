/**
 * studioScenes.ts: the five after-hours studio photos that replace the
 * abstract video loops on Live Web Studios pages (Jon 2026-11-16, five-studio
 * navigation, handoff section 3).
 *
 *   desk    was bg-looping-waves       home hero, insurance, real estate, ...
 *   rack    was bg-blue-fog            dental, financial, nonprofit, footer
 *   keys    was bg-corner              section bands and form pages
 *   proofs  was bg-orange-beam-noaudio blog, B2B, branding, AI service heroes
 *   room    was bg-color-tv            about, healthcare, manufacturing
 *
 * A scene is live the moment its file exists in public/images/bg/. Until
 * then StudioBg.astro keeps the loop that scene replaces, so no build ships a
 * hero with a missing image. The check runs at build time, the same way
 * studios.ts decides whether the Live Web Photos pages are in yet.
 *
 * To add or replace a photo:
 *   node scripts/bg-prep.mjs <raw.png> <scene>
 * which writes lws-bg-<scene>.jpg (1600px cap, quality 82, no metadata) and
 * the 800px phone version beside it.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

export type Scene = "desk" | "rack" | "keys" | "proofs" | "room";

/** The loop each scene replaces, as a filename in public/video-bg/. */
const loops: Record<Scene, string> = {
  desk: "bg-looping-waves.mp4",
  rack: "bg-blue-fog.mp4",
  keys: "bg-corner.mp4",
  proofs: "bg-orange-beam-noaudio.mp4",
  room: "bg-color-tv.mp4",
};

/* Where the light sits in each photo, as an object-position. Every Live Web
   Studios hero holds its copy on the left, so a crop on a narrow screen should
   keep the lit side of the frame, not the dark side. */
const focus: Record<Scene, string> = {
  desk: "72% 50%",
  rack: "70% 50%",
  keys: "76% 62%",
  proofs: "68% 50%",
  room: "66% 50%",
};

/** The photo as PhotoBg and Base's preloadHero want it (a path under
    public/images/), or undefined while the file is not there yet. */
export const scenePhoto = (scene: Scene): string | undefined =>
  existsSync(join("public", "images", "bg", `lws-bg-${scene}.jpg`))
    ? `bg/lws-bg-${scene}.jpg`
    : undefined;

export const sceneLoop = (scene: Scene): string => loops[scene];
export const sceneFocus = (scene: Scene): string => focus[scene];
