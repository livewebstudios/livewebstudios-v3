import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * ShaderHero — the ONE systemized hero-background island for the LWS system.
 * Runs the SDF glowing-frame "portal" shader (ported verbatim from the
 * reference mockup); the tuned frame cyan is lifted to a `u_accent` uniform
 * so the same component drives every brand:
 *   - Live Web Studios (homepage) → cyan  #38BDF8
 *   - Live Band Web Studios       → amber  #FCD34D  (Phase 2 pages)
 *
 * The perspective-grid shader (Live Band sub-brand) returns in Phase 2 as a
 * `variant` prop on this same island when that page is built.
 */

interface Props {
  /** Accent hex, e.g. "#38BDF8" (cyan) or "#FCD34D" (amber). */
  accent?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export default function ShaderHero({ accent = "#38BDF8" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) {
      canvas.style.display = "none";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const start = performance.now();

    const [ar, ag, ab] = hexToRgb(accent);

    // Portal SDF glowing-frame shader — ported verbatim from the reference
    // mockup. Only change: the tuned frame cyan is sourced from u_accent so
    // the same island drives cyan (LWS) and amber (Live Band, Phase 2).
    const frag = `
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform vec3 u_accent;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
float sdRoundBox(vec2 p, vec2 b, float r){
  vec2 q = abs(p) - b + r;
  return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r;
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res)/u_res.y;
  float aspect = u_res.x/u_res.y;
  vec2 par = u_mouse*0.05;              // pointer parallax
  vec2 p = uv - par;
  p.y -= 0.015;
  float breathe = 0.85 + 0.15*sin(u_time*0.7);

  vec2 hs = vec2(0.44,0.28);
  hs *= clamp(aspect/1.5, 0.5, 1.0);    // keep frame on-screen when narrow
  float r = 0.03;
  float d  = sdRoundBox(p, hs, r);
  float ad = abs(d);

  vec3 cyan = u_accent;                                   // was vec3(0.26,0.78,0.99)
  vec3 col  = vec3(0.015,0.023,0.038);
  col += vec3(0.02,0.05,0.08)*exp(-length(uv)*1.6)*0.5;   // room ambient

  float outer = exp(-ad*7.0)*breathe;                     // atmospheric bloom
  float core  = smoothstep(0.013,0.0,ad)*1.35*breathe;    // bright edge
  col += cyan*(outer*0.55 + core);

  float innerGlow = (d<0.0) ? exp(d*4.5)*0.5*breathe : 0.0; // light spill inside
  col += cyan*innerGlow*0.4;

  float ang = atan(p.y, p.x);                              // subtle energy pulse
  float pulse = smoothstep(0.028,0.0,ad)*(0.5+0.5*sin(ang*3.0 - u_time*1.1))*0.22;
  col += cyan*pulse;

  float horizon = -0.34 - par.y;                           // floor reflection
  if(uv.y < horizon){
    vec2 pr = vec2(p.x, 2.0*horizon - p.y);
    float dr = abs(sdRoundBox(pr, hs, r));
    float refl = exp(-dr*9.0)*0.35*breathe;
    float fade = smoothstep(horizon, horizon-0.55, uv.y);
    col += cyan*refl*fade*0.6;
  }

  col += (hash(gl_FragCoord.xy + u_time)*2.0-1.0)*0.012;   // dither vs banding
  col *= smoothstep(1.35,0.35,length(uv));                 // vignette
  gl_FragColor = vec4(col,1.0);
}
`;

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        u_res: { value: new THREE.Vector2() },
        u_time: { value: 0 },
        u_mouse: { value: new THREE.Vector2(0, 0) },
        u_accent: { value: new THREE.Vector3(ar, ag, ab) },
      },
      vertexShader: "void main(){ gl_Position = vec4(position,1.0); }",
      fragmentShader: frag,
    });
    const geo = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    function resize() {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      renderer.setSize(w, h, false);
      mat.uniforms.u_res.value.set(
        w * renderer.getPixelRatio(),
        h * renderer.getPixelRatio(),
      );
    }
    function onMove(e: MouseEvent) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    resize();

    let raf = 0;
    function animate() {
      raf = requestAnimationFrame(animate);
      target.x += (mouse.x - target.x) * 0.04;
      target.y += (mouse.y - target.y) * 0.04;
      mat.uniforms.u_mouse.value.set(target.x, target.y);
      if (!reduce) mat.uniforms.u_time.value = (performance.now() - start) / 1000;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, [accent]);

  return (
    <>
      <div className="hero-fallback" />
      <canvas ref={canvasRef} className="hero-canvas" />
    </>
  );
}
