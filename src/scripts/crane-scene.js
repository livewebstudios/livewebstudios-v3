/**
 * Crane hologram: live three.js hero background (construction theme).
 * Wireframe tower crane lifting an I-beam over a steel frame, in the site
 * cyan, with bloom. Same scene as public/video-bg/bg-crane-holo.mp4, but
 * rendered live so it stays sharp on any screen and reframes per aspect:
 * the crane sits on the right on wide heroes and slides into view on phones.
 *
 * Cost control: DPR capped at 2 (full Retina, lines stay crisp), paused whenever the hero is off-screen or
 * the tab is hidden, and prefers-reduced-motion gets one still frame.
 */
import * as THREE from "three";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const LOOP = 12; // seconds; every motion is periodic on this
const TAU = Math.PI * 2;
const C_MAIN = new THREE.Color(0x33a6f7), C_HOT = new THREE.Color(0x6cc4ff), C_DIM = new THREE.Color(0x0c4270);

class Bag {
  constructor() { this.p = []; }
  seg(a, b) { this.p.push(a[0], a[1], a[2], b[0], b[1], b[2]); }
  poly(pts) { for (let i = 0; i < pts.length; i++) this.seg(pts[i], pts[(i + 1) % pts.length]); }
}
function box(bag, x0, y0, z0, x1, y1, z1, cross = false) {
  const v = [[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]];
  bag.poly([v[0], v[1], v[2], v[3]]); bag.poly([v[4], v[5], v[6], v[7]]);
  for (let i = 0; i < 4; i++) bag.seg(v[i], v[i + 4]);
  if (cross) { bag.seg(v[0], v[5]); bag.seg(v[1], v[4]); bag.seg(v[3], v[6]); bag.seg(v[2], v[7]); }
}

export function mountCrane(canvas) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "low-power" }); }
  catch { return; } // no WebGL: the poster behind the canvas stays
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.005);
  const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.5, 600);

  // ---- materials ----
  const mats = [];
  const mat = (color, width, opacity = 1) => {
    const m = new LineMaterial({ color, linewidth: width, transparent: true, opacity,
      depthWrite: false, blending: THREE.AdditiveBlending, fog: true });
    m.userData.w = width; mats.push(m); return m;
  };
  const lines = (bag, m, parent = scene) => {
    const g = new LineSegmentsGeometry(); g.setPositions(bag.p);
    const o = new LineSegments2(g, m); parent.add(o); return o;
  };
  const glassMat = new THREE.MeshBasicMaterial({ color: C_MAIN, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: true });
  const glass = (x0, y0, z0, x1, y1, z1, parent = scene) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), glassMat);
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); parent.add(m); return m;
  };

  // ---- tower crane ----
  const chord = new Bag(), lace = new Bag(), fine = new Bag();
  const MH = 44, HW = 1.1, SEG = 2.4;
  const mc = [[-HW, -HW], [HW, -HW], [HW, HW], [-HW, HW]];
  for (const [x, z] of mc) chord.seg([x, 0, z], [x, MH, z]);
  for (let y = 0, i = 0; y < MH - 0.01; y += SEG, i++) {
    const y1 = Math.min(y + SEG, MH);
    for (let k = 0; k < 4; k++) {
      const a = mc[k], b = mc[(k + 1) % 4];
      lace.seg([a[0], y1, a[1]], [b[0], y1, b[1]]);
      if ((i + k) % 2) lace.seg([a[0], y, a[1]], [b[0], y1, b[1]]); else lace.seg([b[0], y, b[1]], [a[0], y1, a[1]]);
    }
  }
  box(chord, -1.6, MH, -1.6, 1.6, MH + 1.4, 1.6, true);          // slewing ring
  box(lace, 1.6, MH - 0.6, 0.4, 3.8, MH + 1.8, 2.6);              // cab
  glass(1.6, MH - 0.6, 0.4, 3.8, MH + 1.8, 2.6);
  const JY = MH + 1.4, AY = JY + 10;                               // cat head
  const ap = [[-0.45, AY, -0.45], [0.45, AY, -0.45], [0.45, AY, 0.45], [-0.45, AY, 0.45]];
  const base = [[-1.2, JY, -1.2], [1.2, JY, -1.2], [1.2, JY, 1.2], [-1.2, JY, 1.2]];
  const lerp3 = (a, b, f) => a.map((v, j) => v + (b[j] - v) * f);
  for (let k = 0; k < 4; k++) chord.seg(base[k], ap[k]);
  chord.poly(ap);
  for (let t = 1; t < 5; t++) {
    const ring = base.map((b, k) => lerp3(b, ap[k], t / 5)); lace.poly(ring);
    if (t % 2) for (let k = 0; k < 4; k++) lace.seg(ring[k], lerp3(base[(k + 1) % 4], ap[(k + 1) % 4], (t + 1) / 5));
  }
  const JL = 52, JH = 2.2;                                         // jib, toward -x
  const jibAt = (x) => { const taper = 1 - Math.max(0, (-x - JL * 0.75) / (JL * 0.25)) * 0.55;
    return [[x, JY, -1.0], [x, JY, 1.0], [x, JY + JH * taper, 0]]; };
  for (let x = 0, i = 0; x > -JL + 0.01; x -= SEG, i++) {
    const a = jibAt(x), b = jibAt(Math.max(x - SEG, -JL));
    for (let k = 0; k < 3; k++) {
      chord.seg(a[k], b[k]); lace.seg(b[k], b[(k + 1) % 3]);
      if ((i + k) % 2) lace.seg(a[k], b[(k + 1) % 3]); else lace.seg(a[(k + 1) % 3], b[k]);
    }
  }
  lace.poly(jibAt(0)); lace.poly(jibAt(-JL));
  const CJ = 16;                                                   // counter-jib
  for (let x = 0, i = 0; x < CJ - 0.01; x += SEG, i++) {
    const x1 = Math.min(x + SEG, CJ);
    chord.seg([x, JY, -1.2], [x1, JY, -1.2]); chord.seg([x, JY, 1.2], [x1, JY, 1.2]);
    lace.seg([x1, JY, -1.2], [x1, JY, 1.2]);
    lace.seg(i % 2 ? [x, JY, -1.2] : [x, JY, 1.2], i % 2 ? [x1, JY, 1.2] : [x1, JY, -1.2]);
    fine.seg([x, JY + 1.1, -1.2], [x1, JY + 1.1, -1.2]); fine.seg([x, JY + 1.1, 1.2], [x1, JY + 1.1, 1.2]);
    fine.seg([x1, JY, -1.2], [x1, JY + 1.1, -1.2]); fine.seg([x1, JY, 1.2], [x1, JY + 1.1, 1.2]);
  }
  for (let k = 0; k < 4; k++) {
    const x0 = 10.4 + k * 1.35;
    box(chord, x0, JY - 3.2, -1.4, x0 + 1.2, JY, 1.4); box(fine, x0 + 0.2, JY - 3.0, -1.2, x0 + 1.0, JY - 0.2, 1.2);
  }
  glass(10.4, JY - 3.2, -1.4, 15.8, JY, 1.4);
  for (const x of [-16, -34]) fine.seg([0, AY, 0], [x, JY + JH, 0]);   // pendant ties
  fine.seg([0, AY, -0.3], [CJ, JY, -1.2]); fine.seg([0, AY, 0.3], [CJ, JY, 1.2]);
  lines(chord, mat(C_MAIN, 1.2, 1.0));
  lines(lace, mat(C_MAIN, 0.7, 0.85));
  lines(fine, mat(C_MAIN, 0.55, 0.65));

  // ---- trolley, hook block, I-beam: static geometry moved by transforms ----
  const trolley = new THREE.Group(); scene.add(trolley);
  const tb = new Bag(); box(tb, -0.9, -0.7, -1.0, 0.9, 0, 1.0, true); lines(tb, mat(C_HOT, 0.8, 0.9), trolley);
  const hookG = new THREE.Group(); scene.add(hookG);
  const hb = new Bag(); box(hb, -0.5, 0, -0.35, 0.5, 0.9, 0.35, true); lines(hb, mat(C_HOT, 0.85, 0.95), hookG);
  const beamG = new THREE.Group(); scene.add(beamG);
  const BL = 13, w = 0.55, h = 0.75, tf = 0.12, tw = 0.07;
  const PROF = [[-w,-h],[w,-h],[w,-h+tf],[tw,-h+tf],[tw,h-tf],[w,h-tf],[w,h],[-w,h],[-w,h-tf],[-tw,h-tf],[-tw,-h+tf],[-w,-h+tf]];
  const bb = new Bag(), rb = new Bag();
  for (const x of [-BL / 2, BL / 2]) bb.poly(PROF.map(([pz, py]) => [x, py, pz]));
  for (const [pz, py] of PROF) bb.seg([-BL / 2, py, pz], [BL / 2, py, pz]);
  for (let x = -BL / 2 + 1.3; x < BL / 2; x += 1.3) rb.seg([x, -0.63, 0], [x, 0.63, 0]);
  lines(bb, mat(C_MAIN, 1.1, 1.0), beamG); lines(rb, mat(C_MAIN, 0.6, 0.7), beamG);
  beamG.add(new THREE.Mesh(new THREE.BoxGeometry(BL, 1.5, 1.1), glassMat));
  // ropes + slings: 6 segments, positions rewritten each frame
  const ropeGeo = new LineSegmentsGeometry(); const ropePos = new Float32Array(6 * 6);
  ropeGeo.setPositions(ropePos);
  const ropes = new LineSegments2(ropeGeo, mat(C_HOT, 0.85, 0.95)); ropes.frustumCulled = false; scene.add(ropes);

  // ---- building frame ----
  const bC = new Bag(), bL = new Bag(), bF = new Bag();
  const XS = [-15, -9, -3, 3, 9, 15], ZS = [5, 11, 17], FL = 4.2, NF = 6;
  const colTop = (xi, zi) => ((xi >= 4 && zi === 0) || xi === 5 ? NF - 1 : NF);   // unfinished corner
  for (let xi = 0; xi < XS.length; xi++) for (let zi = 0; zi < ZS.length; zi++) {
    const x = XS[xi], z = ZS[zi], top = colTop(xi, zi) * FL + (colTop(xi, zi) === NF ? 1.6 : 0);
    bC.seg([x - 0.22, 0, z], [x - 0.22, top, z]); bC.seg([x + 0.22, 0, z], [x + 0.22, top, z]);
  }
  for (let f = 1; f <= NF; f++) {
    const y = f * FL;
    for (let zi = 0; zi < ZS.length; zi++) for (let xi = 0; xi < XS.length - 1; xi++) {
      if (f > colTop(xi, zi) || f > colTop(xi + 1, zi)) continue;
      bC.seg([XS[xi], y, ZS[zi]], [XS[xi + 1], y, ZS[zi]]); bF.seg([XS[xi], y - 0.5, ZS[zi]], [XS[xi + 1], y - 0.5, ZS[zi]]);
      if ((xi + f) % 3 === 0 && zi !== 1) {
        bL.seg([XS[xi], y - FL, ZS[zi]], [XS[xi + 1], y, ZS[zi]]); bL.seg([XS[xi + 1], y - FL, ZS[zi]], [XS[xi], y, ZS[zi]]);
      }
    }
    for (let xi = 0; xi < XS.length; xi++) for (let zi = 0; zi < ZS.length - 1; zi++) {
      if (f > colTop(xi, zi) || f > colTop(xi, zi + 1)) continue;
      bC.seg([XS[xi], y, ZS[zi]], [XS[xi], y, ZS[zi + 1]]);
      const x2 = xi < XS.length - 1 && f <= colTop(xi + 1, zi) ? XS[xi + 1] : XS[xi];
      for (let s = 1; s < 4; s++) bF.seg([XS[xi], y, ZS[zi] + s * 1.5], [x2, y, ZS[zi] + s * 1.5]);
    }
  }
  lines(bC, mat(C_MAIN, 1.0, 1.0)); lines(bL, mat(C_MAIN, 0.55, 0.6)); lines(bF, mat(C_MAIN, 0.45, 0.45));
  for (let f = 1; f <= NF - 1; f++) {
    const s = new THREE.Mesh(new THREE.PlaneGeometry(30, 12), glassMat);
    s.rotation.x = -Math.PI / 2; s.position.set(0, f * FL, 11); scene.add(s);
  }

  // ---- ground grid ----
  const grid = new Bag();
  for (let i = -120; i <= 120; i += 4) { grid.seg([i, 0, -120], [i, 0, 120]); grid.seg([-120, 0, i], [120, 0, i]); }
  lines(grid, mat(C_DIM, 0.6, 0.8));

  // ---- particles + pulses ----
  const dot = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.3, "rgba(255,255,255,.5)"); r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
  })();
  const NP = 900, pPos = new Float32Array(NP * 3), pBase = [];
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < NP; i++) pBase.push([-70 + rnd() * 110, rnd() * 60, -40 + rnd() * 80, 1 + Math.floor(rnd() * 2), rnd() * TAU]);
  const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: C_MAIN, size: 0.25, map: dot, transparent: true,
    opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, fog: true }));
  pts.frustumCulled = false; scene.add(pts);

  const plen = (p) => { const L = [0]; for (let i = 1; i < p.length; i++) L.push(L[i - 1] + Math.hypot(...p[i].map((v, j) => v - p[i - 1][j]))); return L; };
  const along = (p, L, u) => {
    const d = u * L[L.length - 1]; let i = 1; while (i < L.length - 1 && L[i] < d) i++;
    return lerp3(p[i - 1], p[i], (d - L[i - 1]) / (L[i] - L[i - 1]));
  };
  const paths = [
    [[HW, 0, HW], [HW, MH, HW], [0, JY + JH, 0], [-JL, JY + JH * 0.45, 0]],
    [[-HW, 0, -HW], [-HW, MH, -HW], [0, JY, -1], [CJ, JY, -1.2]],
    [[-15, 0, 17], [-15, 4 * FL, 17], [15, 4 * FL, 17]],
  ].map((p, i) => [p, plen(p), [5, 3, 3][i]]);
  const NPU = paths.reduce((a, p) => a + p[2], 0) * 6, puPos = new Float32Array(NPU * 3);
  const puGeo = new THREE.BufferGeometry(); puGeo.setAttribute("position", new THREE.BufferAttribute(puPos, 3));
  const pulses = new THREE.Points(puGeo, new THREE.PointsMaterial({ color: C_HOT, size: 0.9, map: dot, transparent: true,
    depthWrite: false, blending: THREE.AdditiveBlending, fog: true }));
  pulses.frustumCulled = false; scene.add(pulses);

  // ---- post ----
  // Multisampled target: the composer's default target has no MSAA, which
  // left the thin truss lines jagged once bloom was in the chain.
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { samples: 4, type: THREE.HalfFloatType }));
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.45, 0.04, 0.72);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // ---- sizing + per-aspect framing ----
  // The video was framed at 16:9; the desktop hero shows its middle band.
  // Holding the horizontal FOV constant reproduces that framing on wide
  // heroes. Narrower than 16:9, the look-at point slides toward the crane
  // so the mast and beam stay in frame on phones.
  const HFOV = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(19)) * (16 / 9));
  let aspect = 16 / 9, lookX = -40;
  function resize() {
    const r = canvas.getBoundingClientRect();
    const cw = Math.max(1, Math.round(r.width)), ch = Math.max(1, Math.round(r.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr); renderer.setSize(cw, ch, false);
    composer.setPixelRatio(dpr); composer.setSize(cw, ch);
    for (const m of mats) { m.resolution.set(cw * dpr, ch * dpr); m.linewidth = m.userData.w * 1.0 * dpr; }
    aspect = cw / ch; camera.aspect = aspect;
    if (aspect >= 16 / 9) {
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(HFOV / 2) / aspect)); lookX = -40;
    } else {
      const f = THREE.MathUtils.clamp((16 / 9 - aspect) / (16 / 9 - 0.5), 0, 1);
      camera.fov = 38 + 10 * f; lookX = -40 + 38 * f;
    }
    camera.updateProjectionMatrix();
  }

  function frame(t) {
    const u = (t % LOOP) / LOOP, wv = TAU * u;
    const th = -0.62 + 0.05 * Math.sin(wv), R = 130;
    camera.position.set(Math.sin(th) * R - 10, 14 + 1.4 * Math.sin(wv + 1.2), Math.cos(th) * R);
    camera.lookAt(lookX + 1.2 * Math.cos(wv), 27, 2);
    const tx = -24 + 3.5 * Math.sin(wv), rope = 17 + 2.2 * Math.sin(wv - 0.9);
    trolley.position.set(tx, JY, 0);
    const sway = 0.035 * Math.sin(2 * wv + 0.4), swayZ = 0.025 * Math.cos(wv);
    const hook = [tx + Math.sin(sway) * rope, JY - 0.7 - Math.cos(sway) * rope, Math.sin(swayZ) * rope];
    hookG.position.set(hook[0], hook[1], hook[2]);
    const yaw = 0.55 + 0.35 * Math.sin(wv + 0.3), cy = Math.cos(yaw), sy = Math.sin(yaw);
    const bc = [hook[0], hook[1] - 5.2, hook[2]];
    beamG.position.set(bc[0], bc[1], bc[2]); beamG.rotation.set(0, yaw, 0);
    const P = (lx, ly, lz) => [bc[0] + lx * cy + lz * sy, bc[1] + ly, bc[2] - lx * sy + lz * cy];
    const segs = [
      [[tx - 0.3, JY - 0.7, 0], [hook[0] - 0.3, hook[1] + 0.9, hook[2]]],
      [[tx + 0.3, JY - 0.7, 0], [hook[0] + 0.3, hook[1] + 0.9, hook[2]]],
      ...[[-5.2, -0.4], [-5.2, 0.4], [5.2, -0.4], [5.2, 0.4]].map((s) => [hook, P(s[0], 0.75, s[1])]),
    ];
    segs.forEach(([a, b], i) => ropePos.set([...a, ...b], i * 6));
    ropeGeo.setPositions(ropePos);
    for (let i = 0; i < NP; i++) {
      const [x, y, z, k, ph] = pBase[i];
      pPos[i * 3] = x + 0.8 * Math.sin(wv * k + ph); pPos[i * 3 + 1] = (y + 60 * k * u) % 60; pPos[i * 3 + 2] = z + 0.8 * Math.cos(wv + ph);
    }
    pGeo.attributes.position.needsUpdate = true;
    let n = 0;
    for (const [p, L, cnt] of paths) for (let j = 0; j < cnt; j++) for (let c = 0; c < 6; c++) {
      const v = along(p, L, (((u * 2 + j / cnt - c * 0.004) % 1) + 1) % 1);
      puPos[n++] = v[0]; puPos[n++] = v[1]; puPos[n++] = v[2];
    }
    puGeo.attributes.position.needsUpdate = true;
    composer.render();
  }

  resize();
  new ResizeObserver(() => { resize(); if (!running) frame(still); }).observe(canvas);
  const still = 6;
  let running = false, visible = false, raf = 0, clock = 0, last = 0;
  const loop = (now) => {
    clock += Math.min(0.1, (now - last) / 1000); last = now;
    frame(clock); raf = requestAnimationFrame(loop);
  };
  const sync = () => {
    const want = visible && !document.hidden && !reduce;
    if (want && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
    else if (!want && running) { running = false; cancelAnimationFrame(raf); }
  };
  frame(still); clock = still;
  canvas.classList.add("is-live");
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }).observe(canvas);
  document.addEventListener("visibilitychange", sync);
}
