import { useEffect, useRef } from "react";
import type { ReactElement } from "react";

/*
 * QuoteInkTransition: scroll-driven dot-field inversion between the white
 * Quote section and the black Services section (#010101).
 *
 * The Quote ambient dot field grows, darkens, and densifies until the
 * screen is fully black: pitch 14 to 11px, radius 0.7 to ~9px, alpha
 * 0.30 to 1.0. Per-dot radius follows a deterministic noise field so
 * the swell travels in organic waves instead of uniformly; at max
 * radius neighboring dots overlap and merge. A global fill floor
 * (smoothstep 0.72 to 1.0) guarantees flat #010101 at progress 1.
 * At progress 0 the field matches Quote's dot field exactly (0.7px
 * at 0.30 alpha, 14px pitch), so there is no jump at the handoff.
 *
 * Pure function of the `progress` prop (0..1). No timers, no rAF loop,
 * no wall-clock time inside: scrolling back reverses every frame exactly.
 * The parent owns pinning, positioning, and the reduced-motion gate; this
 * component renders only the canvas, transparent where dots are sparse.
 */

export type QITBreakpoint = "mobile" | "tablet" | "desktop";

export interface QITParams {
  dprCap: number;
}

export interface QuoteInkTransitionProps {
  progress: number;
}

export function getBreakpoint(width: number): QITBreakpoint {
  if (width <= 720) return "mobile";
  if (width <= 1100) return "tablet";
  return "desktop";
}

export function getTransitionParams(bp: QITBreakpoint): QITParams {
  switch (bp) {
    case "mobile":
      return { dprCap: 1.25 };
    case "tablet":
      return { dprCap: 1.5 };
    case "desktop":
      return { dprCap: 2 };
  }
}

/* ---------------- math helpers (pure, deterministic) ---------------- */

const TAU = Math.PI * 2;

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

const smoothstep = (a: number, b: number, x: number): number => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const smootherstep = (a: number, b: number, x: number): number => {
  const t = clamp01((x - a) / (b - a));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

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

/* Shared deterministic noise field, also drives the per-dot swell waves. */
const field = (x: number, seed: number): number =>
  Math.sin(x * 0.011 + seed) * 0.55 +
  Math.sin(x * 0.023 + seed * 1.7) * 0.3 +
  Math.sin(x * 0.047 + seed * 2.3) * 0.15;

/* ---------------- state ---------------- */

interface QITState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  params: QITParams;
  fieldSeed: number;
  buckets: BucketArrays[];
}

function createQITState(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): QITState {
  const rng = mulberry32(20261029);
  return {
    canvas,
    ctx,
    w: 0,
    h: 0,
    params: getTransitionParams("desktop"),
    fieldSeed: rng() * 10,
    buckets: makeBuckets(),
  };
}

function resizeQITState(st: QITState): void {
  const w = st.canvas.clientWidth;
  const h = st.canvas.clientHeight;
  if (w < 1 || h < 1) return;
  st.w = w;
  st.h = h;
  /* Breakpoint from the viewport, not the canvas width: the wrap is
     2px wider than the viewport, so getBreakpoint(w) disagreed with
     the CSS media queries in a 2px band at 720/1100. Dot layout
     still uses the canvas size above. */
  st.params = getTransitionParams(getBreakpoint(window.innerWidth));
  const dpr = Math.min(window.devicePixelRatio || 1, st.params.dprCap);
  st.canvas.width = Math.round(w * dpr);
  st.canvas.height = Math.round(h * dpr);
  st.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/* ---------------- layers ---------------- */

/* Reused alpha buckets: parallel arrays so frames allocate nothing. */
interface BucketArrays {
  xs: number[];
  ys: number[];
  rs: number[];
}

function makeBuckets(): BucketArrays[] {
  const out: BucketArrays[] = [];
  for (let b = 0; b <= 24; b++) out.push({ xs: [], ys: [], rs: [] });
  return out;
}

function drawDots(st: QITState, p: number): void {
  const ctx = st.ctx;
  const inv = smootherstep(0, 0.85, p);
  const pitch = 14 - 3 * inv;
  const baseR = 0.7 + 8.3 * inv;
  const baseA = 0.3 + 0.7 * smootherstep(0, 0.8, p);
  /* Organic swell: per-dot radius rides a noise wave whose phase drifts
   * with progress, so dots swell in traveling waves, not uniformly.
   * varAmp is 0 at p=0, so the field matches Quote byte-identical. */
  const varAmp = smootherstep(0.05, 0.5, p);
  const buckets = st.buckets;
  for (let b = 0; b <= 24; b++) {
    buckets[b].xs.length = 0;
    buckets[b].ys.length = 0;
    buckets[b].rs.length = 0;
  }
  const addDot = (x: number, y: number, r: number, a: number): void => {
    if (r < 0.25 || a < 0.004) return;
    const bk = buckets[Math.min(24, Math.round(a * 24))];
    bk.xs.push(x);
    bk.ys.push(y);
    bk.rs.push(r);
  };
  const waveR = (x: number, y: number): number => {
    const wave = 0.5 + 0.5 * field(x * 0.8 + y * 0.55, st.fieldSeed + p * 3.0);
    return baseR * (1 + (wave - 0.5) * 1.2 * varAmp);
  };
  const cols = Math.ceil(st.w / pitch);
  const rows = Math.ceil(st.h / pitch);
  const baseCount = (cols + 1) * (rows + 1);
  for (let j = 0; j <= rows; j++) {
    const y = (j + 0.5) * pitch;
    for (let i = 0; i <= cols; i++) {
      const x = (i + 0.5) * pitch;
      addDot(x, y, waveR(x, y), baseA);
    }
  }
  /* Offset echo layer: Quote half-pitch geometry, alpha ramps in over
   * p 0..0.15 so p=0 matches Quote byte-identical, then follows a
   * progress-driven pulse (no wall-clock, scroll-back stays exact).
   * Perf gate: skip the echo layer when the base layer already
   * exceeds ~14000 dots (1920x1080 reaches ~24.5k total), gated on
   * the computed base count rather than the breakpoint so behavior
   * below the threshold is identical everywhere. */
  const pulse = 0.5 + 0.5 * Math.sin(TAU * p);
  const offA = baseA * 0.25 * pulse * clamp01(p / 0.15);
  if (offA >= 0.004 && baseCount <= 14000) {
    const pitch2 = pitch * 1.6;
    const off = pitch / 2;
    const cols2 = Math.ceil(st.w / pitch2);
    const rows2 = Math.ceil(st.h / pitch2);
    for (let j = 0; j <= rows2; j++) {
      const y = (j + 0.5) * pitch2 + off;
      for (let i = 0; i <= cols2; i++) {
        const x = (i + 0.5) * pitch2 + off;
        addDot(x, y, waveR(x, y), offA);
      }
    }
  }
  for (let b = 0; b <= 24; b++) {
    const bk = buckets[b];
    const n = bk.xs.length;
    if (n === 0) continue;
    ctx.fillStyle = "rgba(1, 1, 1, " + (b / 24).toFixed(3) + ")";
    ctx.beginPath();
    for (let k = 0; k < n; k++) {
      ctx.moveTo(bk.xs[k] + bk.rs[k], bk.ys[k]);
      ctx.arc(bk.xs[k], bk.ys[k], bk.rs[k], 0, TAU);
    }
    ctx.fill();
  }
}

function renderFrame(st: QITState, p: number): void {
  const ctx = st.ctx;
  ctx.clearRect(0, 0, st.w, st.h);
  /* Global fill floor: guarantees pixel-perfect flat #010101 at p=1,
   * so Services' black continues with an invisible seam. */
  const F = smoothstep(0.72, 1.0, p);
  if (F < 0.999) {
    drawDots(st, p);
  }
  if (F >= 0.999) {
    ctx.fillStyle = "#010101";
    ctx.fillRect(0, 0, st.w, st.h);
  } else if (F > 0.001) {
    ctx.fillStyle = "rgba(1, 1, 1, " + F.toFixed(3) + ")";
    ctx.fillRect(0, 0, st.w, st.h);
  }
}

/* ---------------- component ---------------- */

export function QuoteInkTransition(props: QuoteInkTransitionProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stRef = useRef<QITState | null>(null);
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
    const st = createQITState(canvas, ctx);
    stRef.current = st;
    const applySize = (): void => {
      resizeQITState(st);
      lastKeyRef.current = "";
      drawNow();
    };
    const ro = new ResizeObserver(applySize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      (entries) => {
        visRef.current = entries.some((e) => e.isIntersecting);
        if (visRef.current) {
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
