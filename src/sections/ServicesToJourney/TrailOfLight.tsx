import { useEffect, useRef } from "react";
import type { ReactElement } from "react";

/*
 * TrailOfLight: scroll-driven comet transition between the black
 * Services section (#010101) and the Journey section, whose top edge
 * is #111111 (the first stop of its 180deg gradient to #0E1626).
 *
 * At progress 0 the canvas is flat #010101; the comet head fades in over
 * p in [0, 0.03] and rests near the bottom center like a lantern just
 * lit. As progress
 * rises the point climbs with an easeOutCubic profile, leaving a
 * luminous fading trail behind it, a faint echo trail offset to one
 * side, sparse sparkle flecks drifting near the trail, and a subtle
 * vertical light column washing the comet's path. Near the top the
 * point blooms into a soft lantern blue glow that expands and settles
 * into an exact clone of Journey's Lantern A (same stops, radius, and
 * joint-relative center), and the whole canvas crossfades #010101 to
 * #111111 so that at progress 1 the frame is pixel identical to the
 * Journey section's top edge and the sticky hand-off is invisible.
 *
 * Pure function of the `progress` prop (0..1). No timers, no rAF loop,
 * no wall clock inside: the only phase motion comes from progress
 * itself, so scrolling back reverses every frame exactly. The parent
 * owns pinning, positioning, and the reduced-motion gate; this
 * component renders only the canvas.
 */

export type TLBreakpoint = "mobile" | "tablet" | "desktop";

export interface TLParams {
  dprCap: number;
  trailScale: number;
  /* Lantern-A clone geometry for the seamless joint. lanternR is the CSS
     farthest-corner radius (divSize/2)*sqrt(2). lanternCX is the lantern
     center x as a fraction of viewport width. lanternCYK is the lantern
     center y as a fraction of the Journey section height, above the joint
     (negative). The joint is the canvas bottom edge = Journey top edge. */
  lanternR: number;
  lanternCX: number;
  lanternCYK: number;
}

export interface TrailOfLightProps {
  progress: number;
}

export function getBreakpoint(width: number): TLBreakpoint {
  if (width <= 720) return "mobile";
  if (width <= 1100) return "tablet";
  return "desktop";
}

export function getTrailParams(bp: TLBreakpoint): TLParams {
  switch (bp) {
    case "mobile":
      return { dprCap: 1.25, trailScale: 0.3, lanternR: 350 * Math.SQRT2, lanternCX: -0.2, lanternCYK: -0.04 };
    case "tablet":
      return { dprCap: 1.5, trailScale: 0.34, lanternR: 350 * Math.SQRT2, lanternCX: -0.2, lanternCYK: -0.04 };
    case "desktop":
      return { dprCap: 2, trailScale: 0.38, lanternR: 550 * Math.SQRT2, lanternCX: -0.08, lanternCYK: -0.06 };
  }
}

/* ---------------- math helpers (pure, deterministic) ---------------- */

const TAU = Math.PI * 2;

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

const smoothstep = (a: number, b: number, x: number): number => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - clamp01(t), 3);

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------- state ---------------- */

interface SparkleSeed {
  dx: number;
  dyFrac: number;
  phase: number;
}

interface TLState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  params: TLParams;
  sparkles: SparkleSeed[];
  journeyH: number;
}

function createTLState(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): TLState {
  const rng = mulberry32(20261030);
  const sparkles: SparkleSeed[] = [];
  for (let i = 0; i < 6; i++) {
    sparkles.push({
      dx: (rng() - 0.5) * 0.14,
      dyFrac: 0.15 + rng() * 0.55,
      phase: rng() * TAU,
    });
  }
  return {
    canvas,
    ctx,
    w: 0,
    h: 0,
    params: getTrailParams("desktop"),
    sparkles,
    journeyH: 4000,
  };
}

function resizeTLState(st: TLState): void {
  const w = st.canvas.clientWidth;
  const h = st.canvas.clientHeight;
  if (w < 1 || h < 1) return;
  st.w = w;
  st.h = h;
  /* Breakpoint from the viewport, not the canvas width: the wrap is
     2px wider than the viewport, so getBreakpoint(w) disagreed with
     the CSS media queries in a 2px band at 720/1100. */
  st.params = getTrailParams(getBreakpoint(window.innerWidth));
  const dpr = Math.min(window.devicePixelRatio || 1, st.params.dprCap);
  st.canvas.width = Math.round(w * dpr);
  st.canvas.height = Math.round(h * dpr);
  st.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/* ---------------- layers ---------------- */

/* Perf gate: the echo trail and sparkles are skipped on large canvases
 * so desktop 1080p stays cheap while phones keep the full detail. */
const PERF_PIXEL_GATE = 1300000;

function cometPos(
  st: TLState,
  p: number
): { x: number; y: number; arrived: number } {
  /* The comet travels during the first 82% of progress and then rests
     at the top while the bloom phase plays, so its position is a pure
     function of progress and scroll back is exact. */
  const pe = Math.min(p, 0.82);
  const q = clamp01(pe / 0.82);
  const e = easeOutCubic(q);
  const yStart = st.h * 0.92;
  const yEnd = st.h * 0.16;
  const x = st.w / 2 + Math.sin(pe * Math.PI) * st.w * 0.015;
  const y = yStart - e * (yStart - yEnd);
  return { x, y, arrived: smoothstep(0.82, 1.0, p) };
}

function drawBackground(ctx: CanvasRenderingContext2D, st: TLState, p: number): void {
  /* Crossfade #010101 to #111111 across p 0.55 to 1.0: the Journey
     section's own top edge is #111111, so at p=1 the seam vanishes. */
  const t = smoothstep(0.55, 1.0, p);
  const c = Math.round(1 + 16 * t);
  ctx.fillStyle = "rgb(" + c + "," + c + "," + c + ")";
  ctx.fillRect(0, 0, st.w, st.h);
}

function drawColumn(
  ctx: CanvasRenderingContext2D,
  st: TLState,
  p: number,
  x: number
): void {
  /* A very subtle vertical light column behind the comet while it
     climbs, fading in after the start and out before the bloom. */
  const a =
    0.1 * smoothstep(0.35, 0.5, p) * (1 - smoothstep(0.78, 0.92, p));
  if (a < 0.004) return;
  const colW = st.w * 0.05;
  const g = ctx.createLinearGradient(x - colW, 0, x + colW, 0);
  g.addColorStop(0, "rgba(91,155,255,0)");
  g.addColorStop(0.5, "rgba(91,155,255," + a.toFixed(3) + ")");
  g.addColorStop(1, "rgba(91,155,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(x - colW, 0, colW * 2, st.h);
}

function drawTrail(
  ctx: CanvasRenderingContext2D,
  st: TLState,
  p: number,
  x: number,
  y: number,
  xOff: number,
  alphaMul: number
): void {
  /* A fading ribbon of past positions below the comet head, drawn as
     discrete circles with shrinking radius and fading alpha. Trail
     length scales with min(viewportHeight, 700) and fades out as the
     bloom takes over. */
  const trailFade = 1 - smoothstep(0.85, 1.0, p);
  if (trailFade < 0.01) return;
  const headIn = clamp01(p / 0.03);
  const base = 0.5 * headIn * trailFade * alphaMul;
  if (base < 0.004) return;
  const maxTrail = Math.min(st.h, 700) * st.params.trailScale;
  const n = 14;
  const yStart = st.h * 0.92;
  const headR = 4;
  for (let j = 1; j <= n; j++) {
    const frac = j / n;
    const yy = y + (maxTrail / n) * j;
    if (yy > yStart + 4) break;
    const a = base * Math.pow(1 - frac, 1.8);
    if (a < 0.004) continue;
    const r = headR * (1 - 0.65 * frac);
    ctx.fillStyle = "rgba(120,170,255," + a.toFixed(3) + ")";
    ctx.beginPath();
    ctx.arc(x + xOff, yy, r, 0, TAU);
    ctx.fill();
  }
}

function drawHead(
  ctx: CanvasRenderingContext2D,
  p: number,
  x: number,
  y: number,
  arrived: number
): void {
  /* Bright core with layered glow; swells slightly as the bloom
     arrives, then fades so the frame ends on flat #111111. */
  const alpha = clamp01(p / 0.03) * (1 - smoothstep(0.9, 1.0, p));
  if (alpha < 0.004) return;
  const swell = 1 + arrived * 1.6;
  const headR = 4 * swell;
  const outerR = headR * 6;
  const go = ctx.createRadialGradient(x, y, 0, x, y, outerR);
  go.addColorStop(0, "rgba(91,155,255," + (0.35 * alpha).toFixed(3) + ")");
  go.addColorStop(1, "rgba(91,155,255,0)");
  ctx.fillStyle = go;
  ctx.beginPath();
  ctx.arc(x, y, outerR, 0, TAU);
  ctx.fill();
  const gm = ctx.createRadialGradient(x, y, 0, x, y, headR * 2.6);
  gm.addColorStop(0, "rgba(160,195,255," + (0.85 * alpha).toFixed(3) + ")");
  gm.addColorStop(1, "rgba(160,195,255,0)");
  ctx.fillStyle = gm;
  ctx.beginPath();
  ctx.arc(x, y, headR * 2.6, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255," + alpha.toFixed(3) + ")";
  ctx.beginPath();
  ctx.arc(x, y, headR * 0.9, 0, TAU);
  ctx.fill();
}

function drawSparkles(
  ctx: CanvasRenderingContext2D,
  st: TLState,
  p: number,
  x: number,
  y: number
): void {
  /* A few flecks drifting near the trail, visible only mid journey.
     Their drift phase comes from progress, not wall time, so the
     frame is a pure function of p. */
  if (st.w * st.h > PERF_PIXEL_GATE) return;
  const env = smoothstep(0.25, 0.4, p) * (1 - smoothstep(0.7, 0.85, p));
  if (env < 0.01) return;
  for (const s of st.sparkles) {
    const sx = x + s.dx * st.w + Math.sin(p * TAU * 2 + s.phase) * 6;
    const sy = y + s.dyFrac * Math.min(st.h, 700) * st.params.trailScale;
    if (sy > st.h * 0.96) continue;
    const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(p * TAU * 4 + s.phase * 3));
    const a = env * tw * 0.15;
    if (a < 0.01) continue;
    ctx.fillStyle = "rgba(180,205,255," + a.toFixed(3) + ")";
    ctx.beginPath();
    ctx.arc(sx, sy, 1.2, 0, TAU);
    ctx.fill();
  }
}

function drawBloom(
  ctx: CanvasRenderingContext2D,
  st: TLState,
  p: number,
  x: number,
  y: number
): void {
  /* Bloom morphs into a clone of Journey's Lantern A so the section joint
   * is invisible: at b=1 the gradient stops, radius, and center relative
   * to the joint (canvas bottom = Journey top) match the lantern exactly.
   * Float-safe: b is clamped, easeOutCubic uses an integer exponent, all
   * stop offsets stay ordered in [0,1], all alphas stay in range. */
  if (p < 0.82) return;
  const b = clamp01((p - 0.82) / 0.18);
  const e = easeOutCubic(b);
  const prm = st.params;
  const r = 24 + e * (prm.lanternR - 24);
  const cx = x + e * (prm.lanternCX * st.w - x);
  const cy = y + e * (st.h + prm.lanternCYK * st.journeyH - y);
  const cr = Math.round(91 - 83 * e);
  const cg = Math.round(155 - 66 * e);
  const cb = Math.round(255 - 43 * e);
  const a0 = 0.55 - 0.15 * e;
  const off1 = 0.4 - 0.1 * e;
  const a1 = a0 * (0.25 + 0.3 * e);
  const tEnd = 1 - 0.45 * e;
  const col = (a: number): string =>
    "rgba(" + cr + "," + cg + "," + cb + "," + a.toFixed(3) + ")";
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, col(a0));
  g.addColorStop(off1, col(a1));
  g.addColorStop(tEnd, col(0));
  g.addColorStop(1, col(0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TAU);
  ctx.fill();
}

function renderFrame(st: TLState, p: number): void {
  const ctx = st.ctx;
  ctx.clearRect(0, 0, st.w, st.h);
  drawBackground(ctx, st, p);
  const { x, y, arrived } = cometPos(st, p);
  drawColumn(ctx, st, p, x);
  const small = st.w * st.h > PERF_PIXEL_GATE;
  drawTrail(ctx, st, p, x, y, 0, 1);
  if (!small) drawTrail(ctx, st, p, x, y, st.w * 0.006, 0.4);
  drawHead(ctx, p, x, y, arrived);
  drawSparkles(ctx, st, p, x, y);
  drawBloom(ctx, st, p, x, y);
}

/* ---------------- component ---------------- */

export function TrailOfLight(props: TrailOfLightProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stRef = useRef<TLState | null>(null);
  const propsRef = useRef(props);
  propsRef.current = props;
  const visRef = useRef(true);
  const lastKeyRef = useRef("");

  const drawNow = (): void => {
    const st = stRef.current;
    if (!st || !visRef.current || st.w < 1) return;
    const p = clamp01(propsRef.current.progress);
    const key = p.toFixed(5) + "|" + st.w + "x" + st.h;
    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;
    renderFrame(st, p);
  };

  useEffect(() => {
    drawNow();
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const st = createTLState(canvas, ctx);
    stRef.current = st;
    const measureJourney = (): void => {
      const el = document.getElementById("manifesto");
      const h = el ? el.getBoundingClientRect().height : 0;
      st.journeyH = h > 0 ? Math.round(h) : 4000;
    };
    const applySize = (): void => {
      resizeTLState(st);
      measureJourney();
      lastKeyRef.current = "";
      drawNow();
    };
    const ro = new ResizeObserver(applySize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      (entries) => {
        visRef.current = entries.some((e) => e.isIntersecting);
        if (visRef.current) {
          measureJourney();
          lastKeyRef.current = "";
          drawNow();
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);
    applySize();
    return () => {
      ro.disconnect();
      io.disconnect();
      stRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
