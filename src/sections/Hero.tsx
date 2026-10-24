/**
 * Hero, Onlines style (research/03-onlines-layout.md section 5).
 *
 * One giant word only: "daivanlabs." in Inter 700, framed by a dashed
 * selection box with 6 small square handles, on a faint graph-paper grid.
 * Exactly like the reference: no CTA button, no subline, no image inside
 * the hero. The word is the visual. The identity claim lives in the quote
 * section that follows, not here.
 *
 * Entrance sequence (Onlines feel: calm, editorial, no bounce):
 *   1. Graph grid fades in (0s, 0.8s, matching the measured reference)
 *   2. Giant word fades and rises 24px (0.15s, 0.9s)
 *   3. Dashed selection box fades in (0.5s delay, 1s ease-in-out),
 *      matching the reference frame fade. It stays pointer-dead until
 *      the fade completes, then lands in its selected/active state.
 *   4. 6 handles pop in with a stagger (0.95s + 0.07s each, 0.35s)
 *   5. Mono label fades in last (1.35s, 0.7s)
 *
 * Drag (fine pointers only):
 *   Once active, the frame + word move as one object under the
 *   pointer. The offset is clamped against the hero stage rect, so
 *   the box can never leave the stage. The 6 handles stay visual
 *   only (no resize). Drag starts only when the device reports
 *   hover:hover and pointer:fine, and never from a touch pointer, so
 *   page scroll is never hijacked on touch devices. With
 *   prefers-reduced-motion the fade is skipped and the frame is
 *   active immediately; drag itself is user-driven, so it stays
 *   available.
 *
 * The visible state is triggered once by a local IntersectionObserver
 * (hero is at the top, so this fires on mount in practice). With
 * prefers-reduced-motion the content is shown immediately with no
 * animation, and the observer is skipped.
 *
 * Deliberate deviations from the reference, for accessibility:
 * - No nowrap trap: the word may wrap on narrow screens.
 * - No scroll lock. The cursor stays standard until the frame is
 *   active; after that it is `move` on the frame, but only on
 *   hover-capable fine-pointer devices.
 * - All values are inline, so this file works standalone even while the
 *   shared token file is being rewritten by a parallel agent.
 */

import { useEffect, useRef, useState } from "react";
import FaersCard from "../components/hero-collage/FaersCard";
import DockingCard from "../components/hero-collage/DockingCard";
import GutAxisCard from "../components/hero-collage/GutAxisCard";
import ReviewCard from "../components/hero-collage/ReviewCard";
import PosterCard from "../components/hero-collage/PosterCard";
import AwardsCard from "../components/hero-collage/AwardsCard";
import StrokeCard from "../components/hero-collage/StrokeCard";
import DnaHelix from "../components/hero-collage/DnaHelix";
import SearchWindow from "../components/hero-v8/SearchWindow";
import PosterWindow from "../components/hero-v8/PosterWindow";
import MicroscopeCard from "../components/hero-v8/MicroscopeCard";
import DeskCard from "../components/hero-v8/DeskCard";
import NotifyBubble from "../components/hero-v8/NotifyBubble";
import DbLogoFloat from "../components/hero-v8/DbLogoFloat";
import DbLogoRow from "../components/hero-v8/DbLogoRow";
import Stickers from "../components/hero-v8/Stickers";

const INK = "#010101";
const GRID_LINE = "rgba(18, 18, 19, 0.06)";
const DASH = "rgba(18, 18, 19, 0.2)";
const HANDLE_BORDER = "#98989c";
const MICRO_GREY = "rgba(66, 66, 66, 0.6)";

const DISPLAY_FONT =
  "'Inter Display', Inter, Arial, sans-serif";
const MONO_FONT =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/* 6 handles: 4 corners + left and right side midpoints. */
const HANDLES: Array<React.CSSProperties> = [
  { top: -5, left: -5 },
  { top: -5, right: -5 },
  { top: "50%", left: -5, transform: "translateY(-50%)" },
  { top: "50%", right: -5, transform: "translateY(-50%)" },
  { bottom: -5, left: -5 },
  { bottom: -5, right: -5 },
];

const HANDLE_STAGGER_START = 0.95;
const HANDLE_STAGGER_STEP = 0.07;

/* Ambient hero diorama (decorative only, never content):
 * 4 cursor chips with topic/project labels only (never person
 * names or invented team members), and 3 floating pills that
 * repeat real site facts already shown elsewhere on the site.
 * Chips drift on slow closed loops driven per frame by
 * requestAnimationFrame (no CSS transition on their transform, as
 * in the reference), and converge toward the nearest edge of the
 * giant word while it is hovered, easing back when the pointer
 * leaves. The chip layer sits above the word/frame layer so chips
 * stay visible while converged; it never intercepts pointer events
 * (pointer-events none everywhere), and it is hidden on touch
 * devices, below 900px (pills), and under prefers-reduced-motion.
 * Anchors are fractions of the stage size; radii and durations are
 * the deep-analysis spec ranges (docs/deep/01-hero-cursors.md). */
const CURSOR_CHIPS: Array<{
  label: string;
  color: string;
  anchorX: number;
  anchorY: number;
  radius: number;
  duration: number;
  phase: number;
}> = [
  { label: "FAERS", color: "#0859D4", anchorX: 0.04, anchorY: 0.16, radius: 40, duration: 18, phase: 0 },
  { label: "StrokeSense", color: "#177245", anchorX: 0.96, anchorY: 0.2, radius: 56, duration: 22, phase: 0.3 },
  { label: "Code for Cure", color: "#A63A2E", anchorX: 0.05, anchorY: 0.82, radius: 32, duration: 16, phase: 0.55 },
  { label: "Seoul 2026", color: "#7A5A00", anchorX: 0.95, anchorY: 0.76, radius: 48, duration: 24, phase: 0.8 },
];

const FACT_PILLS: Array<{
  text: string;
  style: React.CSSProperties;
  duration: number;
  delay: number;
}> = [
  {
    text: "Hypertension Seoul 2026",
    style: { top: "30%", right: "10%" },
    duration: 10,
    delay: 0.5,
  },
  {
    text: "Code for Cure",
    style: { bottom: "30%", right: "14%" },
    duration: 8,
    delay: 1.2,
  },
  {
    text: "FAERS N = 6,601",
    style: { top: "64%", left: "7%" },
    duration: 12,
    delay: 0,
  },
];

/* Hero collage (decorative only, never content): 19 items, 18 visible
 * on desktop. The 8 v7 cards keep their positions; 6 v8 mockups join
 * them (2 windows, 2 photos, 1 bubble, 1 sticker row); the v9 dark
 * database card is gone, replaced in v10 by 4 free-floating database
 * logo tiles (1 visible at 720-1400px, PubMed only, all heights;
 * 4 above 1400px at viewport heights above 750px: PubMed,
 * Cochrane, Elsevier, Scopus; 3 above 1400px on viewports at or
 * below 750px height, where Cochrane hides via hide-750) plus 1
 * mobile-only logo row. All
 * positions sit in the top and bottom bands of the hero, and never
 * over the centered label or the word center point. The faint helix
 * motif may tuck under the frame edge on mid-height stages, and the
 * tall poster window tucks further on short stages, but neither
 * covers the word itself (the frame paints above the collage, and
 * the helix hides entirely on short stages). The layer sits between
 * the grid and the word/frame (z-index 0 vs frame 1, diorama 2), is
 * pointer-dead so drag still works, and is aria-hidden. Float lives
 * on the outer item wrapper (translateY only, desynced 9-16s); tilt
 * lives on an inner wrapper per docs/hero-v8/02-visual-system.md
 * (stylesheet classes only, so the mobile stack can zero them).
 * DOM order is paint order inside the layer: cards first, windows
 * above cards, stickers last and topmost. On narrow screens the layer
 * drops into a static stack below the word showing only FaersCard,
 * NotifyBubble, and DbLogoRow, in that order, tilts zeroed and
 * floats off. */
/* Free-floating database logo tiles (v10): DbLogoFloat takes a brand
   prop, but COLLAGE_ITEMS renders <item.Card /> with no props, so
   each brand gets a thin module-level wrapper here (never inline in
   the render loop, so the tiles never remount on re-render). */
const DbPubmedFloat = () => <DbLogoFloat brand="pubmed" />;
const DbElsevierFloat = () => <DbLogoFloat brand="elsevier" />;
const DbScopusFloat = () => <DbLogoFloat brand="scopus" />;
const DbCochraneFloat = () => <DbLogoFloat brand="cochrane" />;
const COLLAGE_ITEMS: Array<{
  id: string;
  Card: React.ComponentType;
  style: React.CSSProperties;
  floatDuration: number;
  floatDelay: number;
  hideClass: string;
  tiltClass: string;
}> = [
  { id: "docking", Card: DockingCard, style: { left: "2.5%", top: "3%" }, floatDuration: 11, floatDelay: 0.4, hideClass: "mv-collage-mobile-hide", tiltClass: "mv-tilt-card-a" },
  { id: "helix", Card: DnaHelix, style: { left: "27%", top: "2%", width: 100 }, floatDuration: 14, floatDelay: 1.1, hideClass: "mv-collage-hide-mid mv-collage-mobile-hide mv-collage-hide-short", tiltClass: "" },
  { id: "review", Card: ReviewCard, style: { right: "27%", top: "3%" }, floatDuration: 9, floatDelay: 0.8, hideClass: "mv-collage-mobile-hide mv-collage-hide-1000", tiltClass: "mv-tilt-card-b" },
  { id: "poster", Card: PosterCard, style: { right: "2.5%", top: "2%" }, floatDuration: 13, floatDelay: 0.2, hideClass: "mv-collage-mobile-hide mv-collage-hide-min-1400", tiltClass: "mv-tilt-card-c" },
  { id: "faers", Card: FaersCard, style: { left: "2.5%", bottom: "4%" }, floatDuration: 12, floatDelay: 1.4, hideClass: "", tiltClass: "mv-tilt-card-b" },
  { id: "gutaxis", Card: GutAxisCard, style: { left: "25%", bottom: "3%", width: 230 }, floatDuration: 16, floatDelay: 0.6, hideClass: "mv-collage-mobile-hide mv-collage-hide-1400", tiltClass: "mv-tilt-card-a" },
  { id: "awards", Card: AwardsCard, style: { right: "25%", bottom: "4%" }, floatDuration: 15, floatDelay: 0.3, hideClass: "mv-collage-hide-mid mv-collage-mobile-hide mv-collage-hide-min-1400", tiltClass: "mv-tilt-card-c" },
  { id: "stroke", Card: StrokeCard, style: { right: "2.5%", bottom: "5%" }, floatDuration: 9, floatDelay: 1.6, hideClass: "mv-collage-mobile-hide", tiltClass: "mv-tilt-card-b" },
  { id: "search", Card: SearchWindow, style: { left: "36%", top: "2%" }, floatDuration: 12, floatDelay: 0.6, hideClass: "mv-collage-hide-1400", tiltClass: "mv-tilt-window-b" },
  { id: "posterwindow", Card: PosterWindow, style: { right: "2.5%", top: "11%" }, floatDuration: 14, floatDelay: 1.2, hideClass: "mv-collage-hide-1400", tiltClass: "mv-tilt-window-a" },
  { id: "microscope", Card: MicroscopeCard, style: { left: "2.5%", bottom: "39%", width: 210 }, floatDuration: 13, floatDelay: 0.9, hideClass: "mv-collage-hide-mid", tiltClass: "mv-tilt-card-c" },
  { id: "desk", Card: DeskCard, style: { left: "53%", bottom: "3%" }, floatDuration: 11, floatDelay: 1.5, hideClass: "mv-collage-hide-1400", tiltClass: "mv-tilt-card-c" },
  { id: "notify", Card: NotifyBubble, style: { left: "2.5%", bottom: "25%" }, floatDuration: 9, floatDelay: 1.1, hideClass: "mv-collage-hide-720-1160", tiltClass: "mv-tilt-sticker-b" },
  { id: "db-pubmed", Card: DbPubmedFloat, style: { left: "43%", bottom: "5%" }, floatDuration: 13, floatDelay: 0.5, hideClass: "mv-collage-mobile-hide", tiltClass: "mv-tilt-card-b" },
  { id: "db-elsevier", Card: DbElsevierFloat, style: { left: "70%", bottom: "5%" }, floatDuration: 11, floatDelay: 1.3, hideClass: "mv-collage-mobile-hide mv-collage-hide-1400", tiltClass: "mv-tilt-card-a" },
  { id: "db-scopus", Card: DbScopusFloat, style: { left: "20%", top: "3%" }, floatDuration: 15, floatDelay: 0.9, hideClass: "mv-collage-mobile-hide mv-collage-hide-1400", tiltClass: "mv-tilt-card-c" },
  /* Cochrane lockup is portrait (361x466), so its tile is 69x82.
     It stacks under Scopus in the same left column (left 20%):
     Scopus tile is 100 wide, Cochrane 69 wide, both left-anchored,
     so the column reads aligned. Top 15% puts Cochrane 24px-plus
     below the Scopus tile at rest at taller stages (34px at stage
     700, 46px at stage 800) with at least 10px even at worst float
     phase (tilt-adjusted). The tile clears the helix
     box by 29px and helix ink by 47px at the tightest width
     (1401px), clears the docking card by 15px there (near-miss,
     full clearance above about 1470px), and stays at least 64px
     clear of glyphs even at float peaks (frame clearance at least
     36px at peaks) at every shown stage, per visual re-QA 05
     recomputed from source; the earlier comment figures were
     conservative in the same direction.
     It hides on viewports at or below 750px height (hide-750),
     because below stage 651 the Scopus gap would close and the
     tile would graze glyphs; the plain hide-short threshold
     (700px) is not enough for this taller tile. Tilt card-d
     (+1deg) alternates with Scopus card-c (-1deg) above it.
     Earlier slots failed and were rejected: left 29% sat inside
     the helix box covering about 85% of helix ink, and left 66%
     sat inside the review card span (right 27%). */
  { id: "db-cochrane", Card: DbCochraneFloat, style: { left: "20%", top: "15%" }, floatDuration: 14, floatDelay: 2.1, hideClass: "mv-collage-mobile-hide mv-collage-hide-1400 mv-collage-hide-750", tiltClass: "mv-tilt-card-d" },
  { id: "db-row", Card: DbLogoRow, style: {}, floatDuration: 12, floatDelay: 0, hideClass: "mv-collage-hide-min-720", tiltClass: "" },
  { id: "stickers", Card: Stickers, style: { left: "2.5%", top: "32%" }, floatDuration: 12, floatDelay: 1.8, hideClass: "mv-collage-hide-mid", tiltClass: "mv-tilt-sticker-b" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const collageRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const wordRef = useRef<HTMLHeadingElement | null>(null);
  const chipRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const wordHoveredRef = useRef(false);
  const [visible, setVisible] = useState(false);
  /* Selected/active state: lands only once the 1s frame fade ends. */
  const [frameActive, setFrameActive] = useState(false);
  const [wordHovered, setWordHovered] = useState(false);
  /* Drag gate: hover-capable fine-pointer devices only. */
  const [canDrag, setCanDrag] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startOffsetX: number;
    startOffsetY: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia === "undefined"
    ) {
      return;
    }
    setCanDrag(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
  }, []);

  /* The rAF loop reads hover through a ref so the frame callback
     never goes stale when React state changes. */
  useEffect(() => {
    wordHoveredRef.current = wordHovered;
  }, [wordHovered]);

  /* Cursor drift + converge loop. Runs only on hover-capable
     fine-pointer devices without reduced motion (the chips are
     display:none otherwise, so this is belt and braces). Positions
     are written straight to each chip's transform every frame; no
     React state changes per frame. The loop pauses its DOM writes
     while the hero is offscreen; rAF itself pauses when the tab is
     hidden. Scroll modulates the loop phase by up to a quarter loop
     (forward on scroll down, back on scroll up). */
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const section = sectionRef.current;
    const word = wordRef.current;
    if (!section || !word) return;
    const blends = CURSOR_CHIPS.map(() => 0);
    let raf = 0;
    let last = performance.now();
    const start = last;
    const clamp = (v: number, lo: number, hi: number) =>
      Math.min(hi, Math.max(lo, v));
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const stageRect = section.getBoundingClientRect();
      if (
        stageRect.bottom < 0 ||
        stageRect.top > window.innerHeight ||
        stageRect.width === 0
      ) {
        return;
      }
      const elapsed = (now - start) / 1000;
      const scrollPhase = clamp(
        -stageRect.top / Math.max(1, stageRect.height),
        0,
        1,
      ) * 0.25;
      const wordRect = word.getBoundingClientRect();
      const wordLeft = wordRect.left - stageRect.left - 20;
      const wordRight = wordRect.right - stageRect.left + 20;
      const wordTop = wordRect.top - stageRect.top - 20;
      const wordBottom = wordRect.bottom - stageRect.top + 20;
      const hovering = wordHoveredRef.current;
      CURSOR_CHIPS.forEach((chip, i) => {
        const el = chipRefs.current[i];
        if (!el) return;
        const chipW0 = el.offsetWidth;
        const anchorX =
          chip.anchorX > 0.5
            ? chip.anchorX * stageRect.width - chipW0
            : chip.anchorX * stageRect.width;
        const anchorY = chip.anchorY * stageRect.height;
        const angle =
          2 * Math.PI * (elapsed / chip.duration + chip.phase + scrollPhase);
        const driftX = chip.radius * Math.cos(angle);
        const driftY = chip.radius * 0.7 * Math.sin(angle);
        const chipW = el.offsetWidth;
        const chipH = el.offsetHeight;
        /* Nearest point on the expanded word rect to the chip's
           drifting center; if the center is already inside, push to
           the nearest edge instead of collapsing onto the word. */
        const cx = anchorX + chipW / 2 + driftX;
        const cy = anchorY + chipH / 2 + driftY;
        let nx = clamp(cx, wordLeft, wordRight);
        let ny = clamp(cy, wordTop, wordBottom);
        if (cx > wordLeft && cx < wordRight && cy > wordTop && cy < wordBottom) {
          const dLeft = cx - wordLeft;
          const dRight = wordRight - cx;
          const dTop = cy - wordTop;
          const dBottom = wordBottom - cy;
          const min = Math.min(dLeft, dRight, dTop, dBottom);
          if (min === dLeft) nx = wordLeft;
          else if (min === dRight) nx = wordRight;
          else if (min === dTop) ny = wordTop;
          else ny = wordBottom;
        }
        const convergeX = nx - chipW / 2 - anchorX;
        const convergeY = ny - chipH / 2 - anchorY;
        const target = hovering ? 1 : 0;
        blends[i] += (target - blends[i]) * (1 - Math.exp(-dt / 0.3));
        const b = blends[i];
        const eased = b * b * (3 - 2 * b);
        const fx = driftX + (convergeX - driftX) * eased;
        const fy = driftY + (convergeY - driftY) * eased;
        el.style.transform = `translate(${fx.toFixed(1)}px, ${fy.toFixed(1)}px)`;
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Collage pointer parallax (collage layer only, mouse devices
     only): rAF-throttled mousemove translates the whole collage
     layer plus/minus 8px from the pointer's offset from stage
     center. The layer is pointer-dead, so this never interferes
     with drag. Off on touch (no hover+fine pointer) and under
     prefers-reduced-motion. Transform is written straight to the
     layer; no React state changes per frame. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const section = sectionRef.current;
    const layer = collageRef.current;
    if (!section || !layer) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let raf = 0;
    let pending = false;
    let px = 0;
    let py = 0;
    const apply = () => {
      pending = false;
      layer.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)`;
    };
    const onMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      px = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
      py = ((event.clientY - rect.top) / rect.height - 0.5) * 16;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(apply);
      }
    };
    const onLeave = () => {
      px = 0;
      py = 0;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(apply);
      }
    };
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* The frame fade is 1s at a 0.5s delay, so the active state lands
     1500ms after the entrance starts. Reduced motion skips the fade,
     so the frame is active at once. */
  useEffect(() => {
    if (!visible) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setFrameActive(true);
      return;
    }
    const timer = window.setTimeout(() => setFrameActive(true), 1500);
    return () => window.clearTimeout(timer);
  }, [visible]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!frameActive || !canDrag) return;
    /* Touch pointers never start a drag, on any device. */
    if (event.pointerType === "touch") return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const frame = frameRef.current;
    const stage = sectionRef.current;
    if (!frame || !stage) return;
    const frameRect = frame.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    /* Base position without the current transform, so the clamp is
       computed against the frame's resting box, not its dragged box. */
    const baseLeft = frameRect.left - offset.x;
    const baseTop = frameRect.top - offset.y;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y,
      minX: stageRect.left - baseLeft,
      maxX: stageRect.right - (baseLeft + frameRect.width),
      minY: stageRect.top - baseTop,
      maxY: stageRect.bottom - (baseTop + frameRect.height),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const clamp = (value: number, low: number, high: number) =>
      Math.min(high, Math.max(low, value));
    setOffset({
      x: clamp(
        drag.startOffsetX + event.clientX - drag.startX,
        drag.minX,
        drag.maxX,
      ),
      y: clamp(
        drag.startOffsetY + event.clientY - drag.startY,
        drag.minY,
        drag.maxY,
      ),
    });
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
  };

  return (
    <section
      ref={sectionRef}
      aria-label="DaivanLabs"
      className={visible ? "mv-hero is-visible" : "mv-hero"}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: 550,
        height: "calc(100dvh - 100px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        padding: "80px 24px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .mv-hero .mv-grid {
          opacity: 0;
          transition: opacity 0.8s ease-out 0s;
        }
        .mv-hero.is-visible .mv-grid {
          opacity: 1;
        }
        /* Slow ambient grid pan: one tile (40px) over 24s, easing
           in and out and alternating back, so the grid never
           visibly jumps. Background-position only, no layout cost. */
        .mv-hero.is-visible .mv-grid {
          animation: mv-grid-pan 24s ease-in-out infinite alternate;
        }
        @keyframes mv-grid-pan {
          from { background-position: 0 0; }
          to { background-position: 40px 40px; }
        }
        .mv-hero .mv-word {
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s,
            transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s;
        }
        .mv-hero.is-visible .mv-word {
          opacity: 1;
          transform: none;
        }
        .mv-hero .mv-frame-border {
          opacity: 0;
          transition: opacity 1s ease-in-out 0.5s;
        }
        .mv-hero.is-visible .mv-frame-border {
          opacity: 1;
        }
        .mv-hero .mv-frame-border.is-word-hovered,
        .mv-hero .mv-handle.is-word-hovered {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .mv-hero .mv-handle {
          opacity: 0;
          scale: 0.4;
          transition:
            opacity 0.35s ease,
            scale 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .mv-hero.is-visible .mv-handle {
          opacity: 1;
          scale: 1;
        }
        .mv-hero .mv-label {
          opacity: 0;
          transition: opacity 0.7s ease 1.35s;
        }
        .mv-hero.is-visible .mv-label {
          opacity: 1;
        }
        /* Ambient diorama layer: above the grid and above the
           word/frame layer, so converging chips stay visible. It
           never intercepts pointer events, so drag still works. */
        .mv-diorama {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          overflow: hidden;
        }
        .mv-diorama-chip {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 6px;
          pointer-events: none;
        }
        .mv-diorama-pill {
          position: absolute;
          pointer-events: none;
          white-space: nowrap;
        }
        @keyframes mv-float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        @keyframes mv-diorama-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (hover: none) {
          .mv-diorama {
            display: none;
          }
        }
        @media (max-width: 900px) {
          .mv-diorama-pill {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .mv-hero .mv-grid,
          .mv-hero .mv-word,
          .mv-hero .mv-frame-border,
          .mv-hero .mv-handle,
          .mv-hero .mv-label {
            opacity: 1 !important;
            transform: none !important;
            scale: 1 !important;
            transition: none !important;
            animation: none !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .mv-diorama {
            display: none;
          }
        }
        /* Hero collage layer: between the grid and the word/frame
           (z-index 0 vs frame 1, diorama 2), pointer-dead so drag
           still works, fades in late like the diorama. Float
           animation lives on each item wrapper (translateY only),
           parallax transform lives on the layer, so the two never
           fight. Items are positioned with left/right/top/bottom
           only, never transform, so the float keyframes are free. */
        .mv-collage {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          animation: mv-collage-in 0.8s ease 2.2s both;
        }
        .mv-collage-item {
          position: absolute;
          pointer-events: none;
        }
        .mv-collage-float {
          animation: mv-collage-float 12s ease-in-out infinite alternate;
        }
        @keyframes mv-collage-float {
          from { transform: translateY(0); }
          to { transform: translateY(-8px); }
        }
        @keyframes mv-collage-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        /* v8 tilt classes (docs/hero-v8/02-visual-system.md section 4):
           static transforms on the inner wrapper only. The float
           keyframes own the outer wrapper's transform, so the two
           never fight. No animation is ever attached to a tilt
           class, and no wrapper carries box-shadow (card roots own
           their shadows). */
        .mv-tilt-card-a { transform: rotate(-3deg); }
        .mv-tilt-card-b { transform: rotate(2deg); }
        .mv-tilt-card-c { transform: rotate(-1deg); }
        .mv-tilt-card-d { transform: rotate(1deg); }
        .mv-tilt-card-e { transform: rotate(3deg); }
        .mv-tilt-window-a { transform: rotate(0deg); }
        .mv-tilt-window-b { transform: rotate(1deg); }
        .mv-tilt-window-c { transform: rotate(2deg); }
        .mv-tilt-chip { transform: rotate(0deg); }
        .mv-tilt-sticker-a { transform: rotate(-5deg); }
        .mv-tilt-sticker-b { transform: rotate(4deg); }
        @media (max-width: 1160px) {
          .mv-collage-hide-mid {
            display: none;
          }
        }
        @media (max-width: 1400px) {
          .mv-collage-hide-1400 {
            display: none;
          }
        }
        @media (min-width: 720px) and (max-width: 1400px) {
          .mv-collage-hide-720-1400 {
            display: none;
          }
        }
        @media (min-width: 1400px) {
          .mv-collage-hide-min-1400 {
            display: none;
          }
        }
        @media (min-width: 720px) {
          .mv-collage-hide-min-720 {
            display: none;
          }
        }
        @media (min-width: 720px) and (max-width: 1160px) {
          .mv-collage-hide-720-1160 {
            display: none;
          }
        }
        @media (max-width: 1000px) {
          .mv-collage-hide-1000 {
            display: none;
          }
        }
        @media (max-height: 700px) {
          .mv-collage-hide-short {
            display: none;
          }
        }
        @media (max-height: 750px) {
          .mv-collage-hide-750 {
            display: none;
          }
        }
        @media (max-width: 719px) {
          .mv-hero {
            height: auto !important;
          }
          .mv-collage {
            position: static;
            inset: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            width: 100%;
            overflow: visible;
          }
          .mv-collage-item {
            position: static;
            max-width: 100%;
          }
          .mv-collage-float {
            animation: none;
          }
          .mv-tilt-card-a, .mv-tilt-card-b, .mv-tilt-card-c,
          .mv-tilt-card-d, .mv-tilt-card-e, .mv-tilt-window-a,
          .mv-tilt-window-b, .mv-tilt-window-c, .mv-tilt-chip,
          .mv-tilt-sticker-a, .mv-tilt-sticker-b {
            transform: none;
          }
          .mv-collage-mobile-hide {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .mv-collage {
            animation: none;
          }
          .mv-collage-float {
            animation: none;
          }
        }
      `}</style>
      <div
        aria-hidden="true"
        className="mv-grid"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden="true"
        className="mv-diorama"
        style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}
      >
        {CURSOR_CHIPS.map((chip, chipIndex) => (
          <span
            key={chip.label}
            ref={(el) => {
              chipRefs.current[chipIndex] = el;
            }}
            className="mv-diorama-chip"
            style={{
              /* Right-anchored chips hang from the right edge so
                 they are never clipped by the stage edge. */
              ...(chip.anchorX > 0.5
                ? { right: `${(1 - chip.anchorX) * 100}%` }
                : { left: `${chip.anchorX * 100}%` }),
              top: `${chip.anchorY * 100}%`,
              pointerEvents: "none",
              /* Transform is written per frame by the rAF loop;
                 only the entrance fade is a CSS animation. */
              animation: "mv-diorama-in 0.8s ease 2.2s both",
            }}
          >
            <svg
              width="14"
              height="17"
              viewBox="0 0 14 18"
              aria-hidden="true"
              style={{ display: "block", flexShrink: 0 }}
            >
              <path
                d="M1 1 L1 16 L4.8 12.2 L7 16.8 L9.2 15.4 L7.2 11.2 L13 11.2 Z"
                fill={chip.color}
                stroke="#ffffff"
                strokeWidth="0.75"
              />
            </svg>
            <span
              style={{
                fontFamily: MONO_FONT,
                fontSize: 11,
                letterSpacing: "0.04em",
                color: "#1D1D1F",
                background: "#ffffff",
                border: "1px solid #E0E0E0",
                borderRadius: 999,
                padding: "3px 8px",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(1, 1, 1, 0.06)",
              }}
            >
              {chip.label}
            </span>
          </span>
        ))}
        {FACT_PILLS.map((pill) => (
          <span
            key={pill.text}
            className="mv-diorama-pill"
            style={{
              ...pill.style,
              pointerEvents: "none",
              fontFamily: MONO_FONT,
              fontSize: 11,
              letterSpacing: "0.04em",
              color: "rgba(66, 66, 66, 0.75)",
              background: "#ffffff",
              border: "1px solid #E0E0E0",
              borderRadius: 999,
              padding: "5px 10px",
              boxShadow: "0 2px 8px rgba(1, 1, 1, 0.06)",
              animation: `mv-float ${pill.duration}s ease-in-out ${pill.delay}s infinite, mv-diorama-in 0.8s ease 2.4s both`,
            }}
          >
            {pill.text}
          </span>
        ))}
      </div>
      <p
        className="mv-label"
        style={{
          position: "relative",
          zIndex: 1,
          margin: "0 0 32px",
          fontFamily: MONO_FONT,
          fontSize: 12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: MICRO_GREY,
        }}
      >
        Portfolio - Est. 2025
      </p>
      <div
        ref={frameRef}
        className={frameActive ? "mv-frame is-active" : "mv-frame"}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          position: "relative",
          zIndex: 1,
          display: "inline-block",
          maxWidth: 1160,
          width: "100%",
          padding: "28px 32px",
          boxSizing: "border-box",
          textAlign: "center",
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          cursor:
            frameActive && canDrag
              ? dragging
                ? "grabbing"
                : "move"
              : undefined,
          /* Text selection is disabled on the box itself only, and
             only once it is draggable. The label and page stay
             selectable. */
          userSelect: frameActive && canDrag ? "none" : undefined,
        }}
      >
        <div
          aria-hidden="true"
          className={
            wordHovered ? "mv-frame-border is-word-hovered" : "mv-frame-border"
          }
          style={{
            position: "absolute",
            inset: 0,
            border: `1px dashed ${DASH}`,
            /* Pointer-dead until the fade completes and the
               selected/active state lands. Events on the border
               bubble to the wrapper drag handlers. */
            pointerEvents: frameActive ? "auto" : "none",
          }}
        />
        {HANDLES.map((position, index) => (
          <span
            key={index}
            aria-hidden="true"
            className={
              wordHovered ? "mv-handle is-word-hovered" : "mv-handle"
            }
            style={{
              position: "absolute",
              width: 10,
              height: 10,
              background: "#ffffff",
              border: `1px solid ${HANDLE_BORDER}`,
              boxSizing: "border-box",
              transitionDelay: `${HANDLE_STAGGER_START + index * HANDLE_STAGGER_STEP}s`,
              ...position,
            }}
          />
        ))}
        <h1
          ref={wordRef}
          className="mv-word"
          onMouseEnter={() => setWordHovered(true)}
          onMouseLeave={() => setWordHovered(false)}
          style={{
            position: "relative",
            margin: 0,
            fontFamily: DISPLAY_FONT,
            fontWeight: 700,
            fontSize: "clamp(72px, 16vw, 180px)",
            lineHeight: 0.95,
            letterSpacing: "-1.8px",
            color: INK,
            overflowWrap: "break-word",
          }}
        >
          daivanlabs.
        </h1>
      </div>
      <div
        ref={collageRef}
        aria-hidden="true"
        className="mv-collage"
      >
        {COLLAGE_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`mv-collage-item mv-collage-float ${item.hideClass}`.trim()}
            style={{
              ...item.style,
              pointerEvents: "none",
              animationDuration: `${item.floatDuration}s`,
              animationDelay: `${item.floatDelay}s`,
            }}
          >
            <div className={item.tiltClass}>
              <item.Card />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
