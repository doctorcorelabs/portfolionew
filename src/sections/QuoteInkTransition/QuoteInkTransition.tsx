import { useEffect, useRef } from "react";
import type { ReactElement } from "react";

/*
 * QuoteInkTransition: scroll-driven canvas metamorphosis between the white
 * Quote section and the black Services section (#010101).
 *
 * Fuses two ideas into one read: the Quote ambient dot field inverts
 * (dots grow, darken, densify) while an organic ink-bleed with a noisy
 * edge spreads from the remembered V6 ring position and swallows the white.
 * A shared deterministic noise field shapes the ink edge and makes dots
 * swell just ahead of the front, so the field appears to sense the ink.
 *
 * Pure function of the `progress` prop (0..1). No timers, no rAF loop,
 * no wall-clock time inside: scrolling back reverses every frame exactly.
 * The parent owns pinning, positioning, and the reduced-motion gate; this
 * component renders only the canvas, transparent where not yet inked.
 *
 * Reconciliation notes (SPEC read first, VISUAL second, task brief final):
 * - Breakpoint bands and dot budgets follow SPEC (mobile <=720,
 *   tablet 721-1100, desktop >1100). DPR caps follow the task brief:
 *   2 desktop, 1.5 tablet, 1.25 mobile.
 * - Phase A dot inversion follows SPEC numbers (0.7 to 2.2px, alpha
 *   0.30 to 0.88, pitch tightening, offset grid at 1.6x pitch). The
 *   offset pulse is progress-driven, not wall-clock, so scroll-back
 *   stays exact; at p=0 its alpha is 0, matching Quote byte-identical.
 * - The ink edge, blob noise, tendrils, droplets, soft band, and fill
 *   floor follow VISUAL; the blob and front windows follow SPEC
 *   (vignette 0.30-0.60, blob 0.36-0.62 to 38vmin, front 0.45-1.0).
 * - No blue rim on the front edge (VISUAL anti-pattern wins over the
 *   SPEC optional rim). The only blue is the seed spark for p < 0.10.
 * - No second fine-grid densification layer; mobile conveys density
 *   through the swell alone, per VISUAL rationale.
 */

export type QITBreakpoint = "mobile" | "tablet" | "desktop";

export interface QITParams {
  dprCap: number;
  pitchK: number;
  swellBand: number;
  swellBonus: number;
  octaves: number;
  noiseA0: number;
  tendrils: number;
  droplets: number;
  bandBase: number;
  maskDiv: number;
}

export interface QuoteInkTransitionProps {
  progress: number;
  seedX: number | null;
  seedY: number | null;
}

export function getBreakpoint(width: number): QITBreakpoint {
  if (width <= 720) return "mobile";
  if (width <= 1100) return "tablet";
  return "desktop";
}

export function getTransitionParams(bp: QITBreakpoint): QITParams {
  switch (bp) {
    case "mobile":
      return {
        dprCap: 1.25, pitchK: 3, swellBand: 140, swellBonus: 1.6,
        octaves: 2, noiseA0: 0.2, tendrils: 3, droplets: 3,
        bandBase: 44, maskDiv: 4,
      };
    case "tablet":
      return {
        dprCap: 1.5, pitchK: 2.5, swellBand: 160, swellBonus: 1.8,
        octaves: 3, noiseA0: 0.17, tendrils: 4, droplets: 4,
        bandBase: 56, maskDiv: 3,
      };
    case "desktop":
      return {
        dprCap: 2, pitchK: 2, swellBand: 180, swellBonus: 2.0,
        octaves: 4, noiseA0: 0.16, tendrils: 5, droplets: 6,
        bandBase: 64, maskDiv: 3,
      };
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

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInQuad = (t: number): number => t * t;
const easeInOutSine = (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2;

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

/* Shared noise field: shapes the front edge, the blob edge, and the dot
 * swell, which is what makes the two phases read as one event. */
const field = (x: number, seed: number): number =>
  Math.sin(x * 0.011 + seed) * 0.55 +
  Math.sin(x * 0.023 + seed * 1.7) * 0.3 +
  Math.sin(x * 0.047 + seed * 2.3) * 0.15;

/* ---------------- state ---------------- */

interface TendrilDef {
  theta: number;
  sigma: number;
}

interface DropletDef {
  theta: number;
  distFactor: number;
  spawnP: number;
  maxR: number;
  catchP: number;
}

interface QITState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  bp: QITBreakpoint;
  params: QITParams;
  mask: HTMLCanvasElement;
  mctx: CanvasRenderingContext2D;
  mw: number;
  mh: number;
  mscale: number;
  binArr: Uint16Array;
  distArr: Float32Array;
  rowYArr: Float32Array;
  img: ImageData | null;
  seedX: number;
  seedY: number;
  fieldSeed: number;
  phases: number[];
  tendrils: TendrilDef[];
  droplets: DropletDef[];
  bandLUT: Float32Array;
  buckets: BucketArrays[];
  colF: Float32Array;
  colG: Float32Array;
  colMw: number;
}

interface FrameVals {
  p: number;
  R: number;
  blobOn: boolean;
  frontMeanY: number;
  amp: number;
  lobeH: number;
  band: number;
  F: number;
  rLUT: Float32Array | null;
}

function createQITState(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): QITState {
  const rng = mulberry32(20261029);
  const mask = document.createElement("canvas");
  const mctx = mask.getContext("2d");
  if (!mctx) throw new Error("QuoteInkTransition: 2d context unavailable");
  const phases: number[] = [];
  for (let k = 0; k < 4; k++) phases.push(rng() * TAU);
  const tendrils: TendrilDef[] = [];
  for (let k = 0; k < 5; k++) {
    tendrils.push({ theta: rng() * TAU, sigma: 0.25 + rng() * 0.2 });
  }
  const droplets: DropletDef[] = [];
  for (let k = 0; k < 6; k++) {
    droplets.push({
      theta: rng() * TAU,
      distFactor: 1.08 + rng() * 0.27,
      spawnP: 0.3 + rng() * 0.25,
      maxR: 14 + rng() * 20,
      catchP: 0.96,
    });
  }
  const bandLUT = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    const tb = Math.pow(t, 1.6);
    const s = tb * tb * (3 - 2 * tb);
    bandLUT[i] = 1 - s;
  }
  return {
    canvas,
    ctx,
    w: 0,
    h: 0,
    bp: "desktop",
    params: getTransitionParams("desktop"),
    mask,
    mctx,
    mw: 0,
    mh: 0,
    mscale: 3,
    binArr: new Uint16Array(0),
    distArr: new Float32Array(0),
    rowYArr: new Float32Array(0),
    img: null,
    seedX: 0,
    seedY: 0,
    fieldSeed: rng() * 10,
    phases,
    tendrils,
    droplets,
    bandLUT,
    buckets: makeBuckets(),
    colF: new Float32Array(0),
    colG: new Float32Array(0),
    colMw: 0,
  };
}

/* Star-shaped blob edge: radius as a function of angle around the seed.
 * Layered sine noise plus tendril lobes that outrun the main front. */
function blobRadiusAt(theta: number, p: number, R: number, st: QITState): number {
  const oct = st.params.octaves;
  const a0 = st.params.noiseA0;
  const g = smootherstep(0.36, 0.62, p);
  const boost = g < 0.2 ? 1.6 : 1.6 - 0.6 * clamp01((g - 0.2) / 0.13);
  let n = 0;
  for (let k = 1; k <= oct; k++) {
    const f = 3 * Math.pow(2, k - 1);
    const amp = k === 1 ? a0 * boost : a0 / Math.pow(2, k - 1);
    n += amp * Math.sin(f * theta + st.phases[k - 1] + p * (0.6 / k));
  }
  let t = 0;
  const tEnv = easeInOutSine(g);
  const tn = st.params.tendrils;
  for (let i = 0; i < tn; i++) {
    const td = st.tendrils[i];
    const dth = Math.atan2(Math.sin(theta - td.theta), Math.cos(theta - td.theta));
    const q = dth / td.sigma;
    t += 0.22 * Math.exp(-q * q) * tEnv;
  }
  return R * (1 + n + t);
}

/* Main front edge height at horizontal x (SPEC): organic wobble plus a
 * seed lobe that reaches upward first from the remembered V6 spot. */
function frontEdgeAt(x: number, p: number, st: QITState): number {
  const sF = smootherstep(0.45, 1.0, p);
  const frontMeanY = st.h * (1.08 - 1.16 * sF);
  const amp = 12 + 24 * sF;
  const lobeH = 0.22 * st.h * smootherstep(0.45, 0.7, p);
  const gx = (x - st.seedX) / (0.12 * st.w);
  return frontMeanY + field(x, st.fieldSeed) * amp - lobeH * Math.exp(-gx * gx);
}

function frameVals(st: QITState, p: number): FrameVals {
  const vmin = Math.min(st.w, st.h);
  const R = 38 * (vmin / 100) * smootherstep(0.36, 0.62, p);
  const blobOn = R > 0.5;
  const sF = smootherstep(0.45, 1.0, p);
  const rLUT = blobOn ? new Float32Array(720) : null;
  if (rLUT) {
    for (let b = 0; b < 720; b++) {
      rLUT[b] = blobRadiusAt((b / 720) * TAU, p, R, st);
    }
  }
  return {
    p,
    R,
    blobOn,
    frontMeanY: st.h * (1.08 - 1.16 * sF),
    amp: 12 + 24 * sF,
    lobeH: 0.22 * st.h * smootherstep(0.45, 0.7, p),
    band: st.params.bandBase + 0.02 * R,
    F: smoothstep(0.72, 1.0, p),
    rLUT,
  };
}

/* Signed distance to the nearest ink (negative = inside). Shared by the
 * mask pass and the dot swell/absorption so they agree exactly. */
function dInkAt(x: number, y: number, f: FrameVals, st: QITState): number {
  let dist = Infinity;
  if (f.blobOn) {
    let th = Math.atan2(y - st.seedY, x - st.seedX);
    if (th < 0) th += TAU;
    const bin = Math.min(719, ((th / TAU) * 720) | 0);
    const dx = x - st.seedX;
    const dy = y - st.seedY;
    const lut = f.rLUT;
    dist = Math.sqrt(dx * dx + dy * dy) - (lut ? lut[bin] : 0);
  }
  const gx = (x - st.seedX) / (0.12 * st.w);
  const dF = y - (f.frontMeanY + field(x, st.fieldSeed) * f.amp - f.lobeH * Math.exp(-gx * gx));
  return dF < dist ? dF : dist;
}

/* Droplet visibility envelope: grows in, holds, then shrinks to zero
 * once the advancing ink reaches it (reabsorbed, not popped). */
function dropletEnv(dr: DropletDef, f: FrameVals): number {
  if (f.R < 8) return 0;
  const grow = easeOutCubic(clamp01((f.p - dr.spawnP) / 0.1));
  const shrink = 1 - easeInQuad(clamp01((f.p - dr.catchP) / 0.06));
  return grow * shrink;
}

/* Precompute, per droplet, the progress at which ink first touches it.
 * Deterministic per mount/resize; keeps every frame a pure function of p. */
function scanDroplets(st: QITState): void {
  const vmin = Math.min(st.w, st.h);
  for (const dr of st.droplets) {
    dr.catchP = 0.96;
    for (let p = dr.spawnP; p <= 1.0001; p += 0.004) {
      const R = 38 * (vmin / 100) * smootherstep(0.36, 0.62, p);
      if (R < 8) continue;
      const posDist = dr.distFactor * R;
      const cx = st.seedX + Math.cos(dr.theta) * posDist;
      const cy = st.seedY + Math.sin(dr.theta) * posDist;
      const growR = dr.maxR * easeOutCubic(clamp01((p - dr.spawnP) / 0.1));
      const dB = posDist - blobRadiusAt(dr.theta, p, R, st);
      const dF = cy - frontEdgeAt(cx, p, st);
      if (Math.min(dB, dF) < growR) {
        dr.catchP = p;
        break;
      }
    }
  }
}

function computeMaskGeometry(st: QITState): void {
  const ms = st.mscale;
  const n = st.mw * st.mh;
  st.binArr = new Uint16Array(n);
  st.distArr = new Float32Array(n);
  st.rowYArr = new Float32Array(st.mh);
  for (let my = 0; my < st.mh; my++) {
    const y = (my + 0.5) * ms;
    st.rowYArr[my] = y;
    for (let mx = 0; mx < st.mw; mx++) {
      const x = (mx + 0.5) * ms;
      const dx = x - st.seedX;
      const dy = y - st.seedY;
      const i = my * st.mw + mx;
      st.distArr[i] = Math.sqrt(dx * dx + dy * dy);
      let th = Math.atan2(dy, dx);
      if (th < 0) th += TAU;
      st.binArr[i] = Math.min(719, ((th / TAU) * 720) | 0);
    }
  }
}

/* Seed can arrive after mount (parent stashes it when Quote hits p=1),
 * so seed changes are applied live: geometry and droplet catch points
 * are recomputed, everything stays a pure function of the inputs. */
function updateSeed(st: QITState, sx: number, sy: number): void {
  st.seedX = sx;
  st.seedY = sy;
  computeMaskGeometry(st);
  scanDroplets(st);
}

function resizeQITState(
  st: QITState,
  seedXprop: number | null,
  seedYprop: number | null
): void {
  const w = st.canvas.clientWidth;
  const h = st.canvas.clientHeight;
  if (w < 1 || h < 1) return;
  st.w = w;
  st.h = h;
  st.bp = getBreakpoint(w);
  st.params = getTransitionParams(st.bp);
  const dpr = Math.min(window.devicePixelRatio || 1, st.params.dprCap);
  st.canvas.width = Math.round(w * dpr);
  st.canvas.height = Math.round(h * dpr);
  st.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const ms = st.params.maskDiv;
  st.mscale = ms;
  st.mw = Math.max(1, Math.ceil(w / ms));
  st.mh = Math.max(1, Math.ceil(h / ms));
  st.mask.width = st.mw;
  st.mask.height = st.mh;
  st.img = st.mctx.createImageData(st.mw, st.mh);
  const sx = seedXprop === null || seedXprop === undefined ? 0.5 * w : seedXprop;
  const sy = seedYprop === null || seedYprop === undefined ? 0.62 * h : seedYprop;
  updateSeed(st, sx, sy);
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

function drawDots(st: QITState, f: FrameVals): void {
  const ctx = st.ctx;
  const p = f.p;
  const prm = st.params;
  const inv = smootherstep(0, 0.55, p);
  const pitch = 14 - prm.pitchK * inv;
  const baseR = 0.7 + 1.5 * inv;
  const baseA = Math.min(0.88, 0.3 + 0.58 * inv);
  const inkActive = p > 0.3;
  const swellOn = p > 0.32;
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
  const cols = Math.ceil(st.w / pitch);
  const rows = Math.ceil(st.h / pitch);
  for (let j = 0; j <= rows; j++) {
    const y = (j + 0.5) * pitch;
    for (let i = 0; i <= cols; i++) {
      const x = (i + 0.5) * pitch;
      let r = baseR;
      let a = baseA;
      if (inkActive) {
        const dist = dInkAt(x, y, f, st);
        if (dist < -f.band / 2) continue;
        if (swellOn && dist > 0 && dist < prm.swellBand) {
          const q = dist / prm.swellBand;
          const sw = Math.exp(-q * q * 3) * (0.75 + 0.5 * field(x, st.fieldSeed));
          r += prm.swellBonus * sw;
          a = Math.min(0.95, a + 0.3 * sw);
        }
      }
      addDot(x, y, r, a);
    }
  }
  /* Offset echo layer: Quote half-pitch geometry, alpha ramps in over
   * p 0..0.15 so p=0 matches Quote byte-identical, then follows a
   * progress-driven pulse (no wall-clock, scroll-back stays exact). */
  const pulse = 0.5 + 0.5 * Math.sin(TAU * p);
  const offA = baseA * 0.25 * pulse * clamp01(p / 0.15);
  if (offA >= 0.004) {
    const pitch2 = pitch * 1.6;
    const off = pitch / 2;
    const cols2 = Math.ceil(st.w / pitch2);
    const rows2 = Math.ceil(st.h / pitch2);
    for (let j = 0; j <= rows2; j++) {
      const y = (j + 0.5) * pitch2 + off;
      for (let i = 0; i <= cols2; i++) {
        const x = (i + 0.5) * pitch2 + off;
        if (inkActive && dInkAt(x, y, f, st) < -f.band / 2) continue;
        addDot(x, y, baseR, offA);
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

function drawVignette(st: QITState, f: FrameVals): void {
  const vmin = Math.min(st.w, st.h);
  const rr = 18 * (vmin / 100) * smootherstep(0.3, 0.42, f.p);
  const va = 0.32 * (1 - smootherstep(0.42, 0.6, f.p));
  if (rr < 0.5 || va < 0.004) return;
  const ctx = st.ctx;
  const g = ctx.createRadialGradient(st.seedX, st.seedY, 0, st.seedX, st.seedY, rr);
  g.addColorStop(0, "rgba(1, 1, 1, " + va.toFixed(3) + ")");
  g.addColorStop(1, "rgba(1, 1, 1, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(st.seedX - rr, st.seedY - rr, rr * 2, rr * 2);
}

/* The last blue spark at the seed: one breath, then gone. The only
 * blue in the transition; the ink that follows is always #010101. */
function drawSpark(st: QITState, f: FrameVals): void {
  if (f.p >= 0.1) return;
  const a = smoothstep(0.0, 0.03, f.p) * (1 - smoothstep(0.03, 0.1, f.p));
  if (a < 0.004) return;
  const r = 10 + 4 * easeOutCubic(clamp01(f.p / 0.06));
  const ctx = st.ctx;
  ctx.fillStyle = "rgba(8, 89, 212, " + a.toFixed(3) + ")";
  ctx.beginPath();
  ctx.arc(st.seedX, st.seedY, r, 0, TAU);
  ctx.fill();
}

function drawInkMask(st: QITState, f: FrameVals): void {
  const ctx = st.ctx;
  if (f.F >= 0.999) {
    ctx.fillStyle = "#010101";
    ctx.fillRect(0, 0, st.w, st.h);
    return;
  }
  let possible =
    f.F > 0.001 || f.blobOn || f.frontMeanY - f.amp - f.lobeH < st.h;
  if (!possible) {
    const n = st.params.droplets;
    for (let k = 0; k < n; k++) {
      if (dropletEnv(st.droplets[k], f) > 0.003) {
        possible = true;
        break;
      }
    }
  }
  const mctx = st.mctx;
  if (!possible) {
    mctx.clearRect(0, 0, st.mw, st.mh);
    return;
  }
  const img = st.img;
  if (!img) return;
  const data = img.data;
  const mw = st.mw;
  const mh = st.mh;
  const ms = st.mscale;
  if (st.colMw !== mw) {
    st.colF = new Float32Array(mw);
    st.colG = new Float32Array(mw);
    st.colMw = mw;
  }
  const colF = st.colF;
  const colG = st.colG;
  for (let mx = 0; mx < mw; mx++) {
    const x = (mx + 0.5) * ms;
    colF[mx] = field(x, st.fieldSeed);
    const gx = (x - st.seedX) / (0.12 * st.w);
    colG[mx] = Math.exp(-gx * gx);
  }
  const halfBand = f.band / 2;
  const F = f.F;
  const lut = st.bandLUT;
  let o = 0;
  for (let my = 0; my < mh; my++) {
    const y = st.rowYArr[my];
    const rowBase = my * mw;
    for (let mx = 0; mx < mw; mx++, o += 4) {
      const i = rowBase + mx;
      let dist = Infinity;
      if (f.blobOn && f.rLUT) dist = st.distArr[i] - f.rLUT[st.binArr[i]];
      const dF = y - (f.frontMeanY + colF[mx] * f.amp - f.lobeH * colG[mx]);
      if (dF < dist) dist = dF;
      let a: number;
      if (dist >= halfBand) {
        a = 0;
      } else {
        let t = (dist + halfBand) / f.band;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        a = lut[(t * 255) | 0];
      }
      if (F > a) a = F;
      data[o] = 1;
      data[o + 1] = 1;
      data[o + 2] = 1;
      data[o + 3] = (a * 255) | 0;
    }
  }
  mctx.putImageData(img, 0, 0);
  const nd = st.params.droplets;
  for (let k = 0; k < nd; k++) {
    const dr = st.droplets[k];
    const env = dropletEnv(dr, f);
    if (env < 0.003) continue;
    const posDist = dr.distFactor * f.R;
    const cx = (st.seedX + Math.cos(dr.theta) * posDist) / ms;
    const cy = (st.seedY + Math.sin(dr.theta) * posDist) / ms;
    const rm = (dr.maxR * env) / ms;
    const outer = rm + f.band / ms;
    if (outer < 0.5) continue;
    const aStr = env.toFixed(3);
    const g = mctx.createRadialGradient(cx, cy, 0, cx, cy, outer);
    g.addColorStop(0, "rgba(1, 1, 1, " + aStr + ")");
    const inner = rm / outer;
    if (inner < 0.999) g.addColorStop(inner, "rgba(1, 1, 1, " + aStr + ")");
    g.addColorStop(1, "rgba(1, 1, 1, 0)");
    mctx.fillStyle = g;
    mctx.fillRect(cx - outer, cy - outer, outer * 2, outer * 2);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(st.mask, 0, 0, mw, mh, 0, 0, st.w, st.h);
}

function renderFrame(st: QITState, p: number): void {
  const ctx = st.ctx;
  ctx.clearRect(0, 0, st.w, st.h);
  const f = frameVals(st, p);
  if (f.F < 0.999) {
    drawDots(st, f);
    drawVignette(st, f);
    drawSpark(st, f);
  }
  drawInkMask(st, f);
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
    const pr = propsRef.current;
    const sx =
      pr.seedX === null || pr.seedX === undefined ? 0.5 * st.w : pr.seedX;
    const sy =
      pr.seedY === null || pr.seedY === undefined ? 0.62 * st.h : pr.seedY;
    if (sx !== st.seedX || sy !== st.seedY) {
      updateSeed(st, sx, sy);
      lastKeyRef.current = "";
    }
    const p = clamp01(pr.progress);
    const key =
      p.toFixed(5) + "|" + st.w + "x" + st.h + "|" + sx + ":" + sy;
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
      const pr = propsRef.current;
      resizeQITState(st, pr.seedX, pr.seedY);
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
