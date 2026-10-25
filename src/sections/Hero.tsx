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
import DnaHelix from "../components/hero-collage/DnaHelix";
import SearchWindow from "../components/hero-v8/SearchWindow";
import PosterWindow from "../components/hero-v8/PosterWindow";
import MicroscopeCard from "../components/hero-v8/MicroscopeCard";
import DeskCard from "../components/hero-v8/DeskCard";
import NotifyBubble from "../components/hero-v8/NotifyBubble";
import DbLogoFloat from "../components/hero-v8/DbLogoFloat";
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
  { label: "FAERS", color: "#0859D4", anchorX: 0.195, anchorY: 0.30, radius: 20, duration: 18, phase: 0 }, // anchorX 0.195, not 0.15: at 0.15 the word-hover converged chip lands on MicroscopeCard (top about 296 at 1440/H800); 0.195 parks it 13px past the card's right edge while keeping 15px drift clearance to the helix box
  { label: "StrokeSense", color: "#177245", anchorX: 0.55, anchorY: 0.33, radius: 20, duration: 22, phase: 0.3 },
  { label: "Code for Cure", color: "#A63A2E", anchorX: 0.30, anchorY: 0.695, radius: 20, duration: 16, phase: 0.55 },
  { label: "Seoul 2026", color: "#7A5A00", anchorX: 0.80, anchorY: 0.695, radius: 20, duration: 24, phase: 0.8 },
];

const FACT_PILLS: Array<{
  text: string;
  style: React.CSSProperties;
  duration: number;
  delay: number;
  cls?: string;
}> = [
  {
    /* Seoul pill at left 59% (de-overlap): reducing left fails
       (stickers at S=900 share top 32% and span to x 407, while
       helix/search/label at S=800 forbid x 388-806), so the pill
       sits right of the label instead: 43.9px label gap and
       83.4px posterwindow gap at 1440, 11.1px worst-phase
       vertical gap to review at S=800. Top stays 32%. */
    text: "Hypertension Seoul 2026",
    style: { left: "59%", top: "32%" },
    duration: 10,
    delay: 0.5,
  },
  {
    text: "Code for Cure",
    style: { bottom: "30%", right: "14%" },
    duration: 8,
    delay: 1.2,
    cls: "mv-diorama-pill-cfc",
  },
  {
    text: "FAERS N = 6,601",
    style: { top: "62%", left: "7%" },
    duration: 12,
    delay: 0,
    cls: "mv-diorama-pill-faers",
  },
];

/* Hero collage (decorative only, never content): 22 items, 18 visible
 * on desktop. The 8 v7 cards keep their positions; 6 v8 mockups join
 * them (2 windows, 2 photos, 1 bubble, 1 sticker row); the v9 dark
 * database card is gone, replaced in v10 by 4 free-floating database
 * logo tiles (1 visible at 720-1400px, PubMed only, all heights;
 * 4 above 1400px at viewport heights above 750px: PubMed,
 * Cochrane, Elsevier, Scopus; 3 above 1400px on viewports at or
 * below 750px height, where Cochrane hides via hide-750) plus 4
 * mobile-only single logo tiles interleaved in the stack (see the
 * static-stack paragraph below). All
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
 * drops into a static stack below the word showing, in order,
 * PubMed, FaersCard, Elsevier, NotifyBubble, Scopus, Cochrane
 * (the four logos are mobile-only single tiles, hide-min-720, so
 * the desktop floats are untouched and no logo appears twice),
 * tilts zeroed and floats off. */
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
  { id: "helix", Card: DnaHelix, style: { left: "27%", top: "2%", width: 100 }, floatDuration: 14, floatDelay: 1.1, hideClass: "mv-collage-hide-mid mv-collage-mobile-hide mv-collage-hide-750", tiltClass: "" },
  { id: "review", Card: ReviewCard, style: { right: "29%", top: "3%" }, floatDuration: 9, floatDelay: 0.8, hideClass: "mv-collage-mobile-hide mv-collage-hide-1000 mv-collage-review", tiltClass: "mv-tilt-card-b" },
  { id: "poster", Card: PosterCard, style: { right: "2.5%", top: "2%" }, floatDuration: 13, floatDelay: 0.2, hideClass: "mv-collage-mobile-hide mv-collage-hide-min-1400 mv-collage-poster", tiltClass: "mv-tilt-card-c" },
  /* Mobile-only logo scatter (responsive fix): single PubMed tile
     opens the mobile stack, so the logos spread through the hero
     instead of piling in one row at the bottom. Hidden at 720px
     and above, so desktop is untouched. */
  { id: "m-pubmed", Card: DbPubmedFloat, style: {}, floatDuration: 12, floatDelay: 0, hideClass: "mv-collage-hide-min-720", tiltClass: "" },
  { id: "faers", Card: FaersCard, style: { left: "2.5%", bottom: "2%" }, floatDuration: 12, floatDelay: 1.4, hideClass: "", tiltClass: "mv-tilt-card-b" },
  { id: "m-elsevier", Card: DbElsevierFloat, style: {}, floatDuration: 12, floatDelay: 0, hideClass: "mv-collage-hide-min-720", tiltClass: "" },
  { id: "gutaxis", Card: GutAxisCard, style: { left: "25%", bottom: "3%", width: 230 }, floatDuration: 16, floatDelay: 0.6, hideClass: "mv-collage-mobile-hide mv-collage-hide-1400 mv-mini-exclude", tiltClass: "mv-tilt-card-a" },
  { id: "awards", Card: AwardsCard, style: { right: "27%", bottom: "4%" }, floatDuration: 15, floatDelay: 0.3, hideClass: "mv-collage-hide-mid mv-collage-mobile-hide mv-collage-hide-min-1400 mv-collage-show-tablet-awards", tiltClass: "mv-tilt-card-c" },
  { id: "search", Card: SearchWindow, style: { left: "36%", top: "2%" }, floatDuration: 12, floatDelay: 0.6, hideClass: "mv-collage-hide-1400 mv-mini-exclude", tiltClass: "mv-tilt-window-b" },
  { id: "posterwindow", Card: PosterWindow, style: { right: "2.5%", top: "11%" }, floatDuration: 14, floatDelay: 1.2, hideClass: "mv-collage-hide-1400 mv-mini-exclude mv-collage-show-tablet-pw", tiltClass: "mv-tilt-window-a" },
  { id: "microscope", Card: MicroscopeCard, style: { left: "2.5%", bottom: "39%", width: 210 }, floatDuration: 13, floatDelay: 0.9, hideClass: "mv-collage-hide-1300 mv-collage-hide-microscope-800", tiltClass: "mv-tilt-card-c" },
  { id: "desk", Card: DeskCard, style: { left: "53%", bottom: "3%" }, floatDuration: 11, floatDelay: 1.5, hideClass: "mv-collage-hide-1400 mv-mini-exclude", tiltClass: "mv-tilt-card-c" },
  { id: "notify", Card: NotifyBubble, style: { left: "2.5%", bottom: "28%" }, floatDuration: 9, floatDelay: 1.1, hideClass: "mv-collage-hide-720-1160 mv-collage-hide-notify-850 mv-collage-show-tablet-notify", tiltClass: "mv-tilt-sticker-b" },
  /* Mobile-only logo scatter, continued: Scopus then Cochrane
     close the mobile stack, preserving the desktop pairing
     (Cochrane under Scopus) with the tall portrait tile last. */
  { id: "m-scopus", Card: DbScopusFloat, style: {}, floatDuration: 12, floatDelay: 0, hideClass: "mv-collage-hide-min-720", tiltClass: "" },
  { id: "m-cochrane", Card: DbCochraneFloat, style: {}, floatDuration: 12, floatDelay: 0, hideClass: "mv-collage-hide-min-720", tiltClass: "" },
  { id: "db-pubmed", Card: DbPubmedFloat, style: { left: "43%", bottom: "5%" }, floatDuration: 13, floatDelay: 0.5, hideClass: "mv-collage-mobile-hide", tiltClass: "mv-tilt-card-b" },
  { id: "db-elsevier", Card: DbElsevierFloat, style: { left: "70%", bottom: "5%" }, floatDuration: 11, floatDelay: 1.3, hideClass: "mv-collage-mobile-hide mv-collage-hide-1400 mv-collage-show-laptop", tiltClass: "mv-tilt-card-a" },
  { id: "db-scopus", Card: DbScopusFloat, style: { left: "20%", top: "3%" }, floatDuration: 15, floatDelay: 0.9, hideClass: "mv-collage-mobile-hide mv-collage-hide-1400 mv-collage-show-laptop", tiltClass: "mv-tilt-card-c" },
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
     sat inside the review card span (right 29%). Laptop
     overrides (rearrangement): 1161-1300 stacks Cochrane at
     62%/2% above Scopus 62%/19%, because review-new (left 36%)
     occupies the old 40% column; 1301-1400 uses 21%/15%
     (stylesheet, min-height 801px). */
  { id: "db-cochrane", Card: DbCochraneFloat, style: { left: "20%", top: "15%" }, floatDuration: 14, floatDelay: 2.1, hideClass: "mv-collage-mobile-hide mv-collage-hide-1400 mv-collage-hide-750 mv-collage-show-laptop-cochrane", tiltClass: "mv-tilt-card-d" },
  { id: "stickers", Card: Stickers, style: { left: "2.5%", top: "32%" }, floatDuration: 12, floatDelay: 1.8, hideClass: "mv-collage-hide-1300 mv-collage-hide-stickers-950 mv-collage-show-tablet-stickers", tiltClass: "mv-tilt-sticker-b" },
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

  /* Phone zoom-out miniature (mobile-mirror task): below a 720px
     layout width the hero renders as a frozen 1161-1400
     tall-stage miniature (1160x980 design stage, equivalent to
     VH 1080, all gates open) scaled to the section width. The
     scale is JS-measured from section clientWidth so it is
     continuous with viewport width (320 -> ~0.276, 390 -> ~0.336,
     719 -> ~0.620); the section height is set from the same
     value via --mv-mini-h, and .mv-hero-mini is the single
     source of truth for the miniature styles (see the
     stylesheet). ResizeObserver fires on mount and on every
     resize, so the 719/720 seam is explicit: null at 720px and
     above (normal float layout), a number below. */
  const MINI_STAGE_W = 1160;
  const MINI_STAGE_H = 980;
  const [miniScale, setMiniScale] = useState<number | null>(() =>
    typeof window !== "undefined" && window.innerWidth < 720
      ? window.innerWidth / MINI_STAGE_W
      : null,
  );
  useEffect(() => {
    const section = sectionRef.current;
    if (
      !section ||
      typeof window === "undefined" ||
      typeof ResizeObserver === "undefined"
    ) {
      return;
    }
    const update = () => {
      const w = section.clientWidth;
      setMiniScale(w > 0 && w < 720 ? w / MINI_STAGE_W : null);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(section);
    return () => observer.disconnect();
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
    /* Rearrangement companion: the Seoul chip's laptop anchor
       (poster move). In the 1161-1400px band the poster moves to
       the bottom-right, and the Seoul chip at its 0.80 anchor
       would sit on the poster's top corner for the whole drift
       loop at short heights, so in that band only the chip's
       drift center moves to 0.70 (the stylesheet moves its base
       to right:30% by the same media query, so base and JS
       anchor always agree). Above 1400px the chip must stay at
       0.80: at 0.70 it would collide with the desk card
       (above-1400 only). matchMedia is used, not innerWidth, so
       the JS band is the identical media-query evaluation as
       the CSS rule, scrollbar included. At or below 1160px the
       diorama is hidden, so the band check is moot there. */
    const seoulLaptopMql = window.matchMedia(
      "(min-width: 1161px) and (max-width: 1400px)",
    );
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
        const effAnchorX =
          chip.label === "Seoul 2026" && seoulLaptopMql.matches
            ? 0.70
            : chip.anchorX;
        const anchorX =
          effAnchorX > 0.5
            ? effAnchorX * stageRect.width - chipW0
            : effAnchorX * stageRect.width;
        /* Rearrangement companion: at laptop widths the
           StrokeSense chip drops from the 0.33 lane to 0.45 so
           it clears the review card's new top-center-left home
           (left 36%, top 2%), which it would otherwise overlap
           at short stages. The stylesheet moves the chip's base
           top to 45% in the same band; window.innerWidth (not
           stageRect.width) is used here so the JS lane matches
           the CSS media query exactly. Above 1400px the 0.33
           lane stays, because 0.45 would touch review-OLD at
           VH 650 worst-phase. At or below 1160px the diorama
           is hidden, so the band check is moot there. */
        const effAnchorY =
          chip.label === "StrokeSense" &&
          window.innerWidth > 1160 &&
          window.innerWidth <= 1400
            ? 0.45
            : chip.anchorY;
        const anchorY = effAnchorY * stageRect.height;
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
      className={`${visible ? "mv-hero is-visible" : "mv-hero"}${miniScale !== null ? " mv-hero-mini" : ""}`}
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
        ...(miniScale !== null
          ? ({ "--mv-mini-h": `${(MINI_STAGE_H * miniScale).toFixed(1)}px` } as React.CSSProperties)
          : {}),
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
        /* Tablet diorama hide (de-overlap): on mouse/trackpad
           iPads the chips rest on cards by anchor geometry at
           every tablet width, so the layer hides at 1160px and
           below. Touch iPads already hide it via hover:none
           above; desktop above 1160px is untouched. */
        @media (max-width: 1160px) {
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
        /* Narrow-desktop tuck guard (desktop R1): microscope and
           stickers sit mostly behind the giant word at 1180-1280px,
           so they hide at 1300px and below and return at 1301px
           and above, where glyph overlap is 35% or less. */
        @media (max-width: 1300px) {
          .mv-collage-hide-1300 {
            display: none;
          }
        }
        @media (max-width: 1400px) {
          .mv-collage-hide-1400 {
            display: none;
          }
        }
        /* Laptop logo show rules: Scopus and Elsevier return at
           720-1400px widths via the double-class selector, which
           beats the single-class hide-1400 rule regardless of
           order. Cochrane has its own height-scoped rule so the
           hide-750 gate still hides it at VH 750 or below. */
        @media (min-width: 720px) and (max-width: 740px) and (min-height: 751px) {
          .mv-collage-show-laptop.mv-collage-hide-1400 {
            display: block;
          }
        }
        @media (min-width: 741px) and (max-width: 1400px) {
          .mv-collage-show-laptop.mv-collage-hide-1400 {
            display: block;
          }
        }
        @media (min-width: 720px) and (max-width: 1300px) and (min-height: 751px) {
          .mv-collage-show-laptop-cochrane.mv-collage-hide-1400 {
            display: block;
          }
        }
        @media (min-width: 1301px) and (max-width: 1400px) and (min-height: 801px) {
          .mv-collage-show-laptop-cochrane.mv-collage-hide-1400 {
            display: block;
          }
        }
        /* Laptop logo positions (rearrangement): 1161-1300px and
           1301-1400px bands. These only reposition tiles that
           F3's show-rules already reveal; they write no display
           rule, so hide-750 and the 1400px gates still govern
           visibility. Positions are inline, hence !important.
           Scopus and Elsevier share .mv-collage-show-laptop, so
           they are told apart by their tilt child (Scopus:
           card-c, Elsevier: card-a). Rearrangement change: the
           old 40% column is dead because review-new (left 36%,
           top 2%) occupies it, so in 1161-1300px Cochrane and
           Scopus stack in a 62% column (Cochrane top 2%,
           Scopus top 19%, the balanced optimum between
           Cochrane bottom and the Seoul pill top: worst gaps
           2.0px stack-internal and 2.6px Scopus-pill at stage
           550 only, 7px-plus at VH 680, 15px-plus above VH
           751; Scopus stays at 19% when Cochrane hides, no
           collapse). In 1301-1400px Cochrane keeps 21%/15%
           (clear of review-new) and Scopus alone takes 62%/2%
           (the old 36% slot collided with review-new and the
           24% alternative collided with the helix box). The
           1301-1400 Cochrane block is min-height 801px scoped:
           the slot overlaps the FAERS chip drift box by 6px at
           stage 600 (VH 700), so the new position applies only at
           stage 701 and above; below that the tile falls back to
           its inline position when shown. */
        @media (min-width: 1161px) and (max-width: 1300px) {
          .mv-collage-show-laptop-cochrane {
            left: 62% !important;
            top: 2% !important;
          }
          .mv-collage-show-laptop:has(> .mv-tilt-card-c) {
            left: 62% !important;
            top: 19% !important;
          }
          .mv-collage-show-laptop:has(> .mv-tilt-card-a) {
            left: 27% !important;
            bottom: 5% !important;
          }
        }
        /* B1 gate DELETED (rearrangement): the old 17.5% Scopus
           slot between Cochrane bottom and label top is gone,
           replaced by the 62%/19% stack slot, which has no
           short-stage label squeeze (Scopus clears the label
           in x by 41px-plus at every height). Scopus therefore
           stays visible at ALL heights in 1161-1300px; no
           display rule hides it here anymore. */
        @media (min-width: 1301px) and (max-width: 1400px) {
          .mv-collage-show-laptop:has(> .mv-tilt-card-c) {
            left: 62% !important;
            top: 2% !important;
          }
          .mv-collage-show-laptop:has(> .mv-tilt-card-a) {
            left: 30% !important;
            bottom: 5% !important;
          }
        }
        @media (min-width: 1301px) and (max-width: 1400px) and (min-height: 801px) {
          .mv-collage-show-laptop-cochrane {
            left: 21% !important;
            top: 15% !important;
          }
        }
        /* Laptop logo bands (F1 positions only): Scopus, Cochrane
           and Elsevier repositioned at 720-1160px widths. Display
           is owned by F3's show-rules above; these blocks only
           override inline left/top (hence !important) and never
           set display. Scopus and Elsevier share the show-laptop
           marker, so they are told apart with :has() on the tilt
           child class (Scopus tilt-card-c, Elsevier tilt-card-a),
           which is unique among show-laptop tiles. Elsevier needs
           bottom:auto wherever top is set, or its inline bottom
           would stretch the tile. Band 1 is height-scoped
           (min-height 751px) per brief. */
        @media (min-width: 720px) and (max-width: 740px) and (min-height: 751px) {
          .mv-collage-show-laptop.mv-collage-hide-1400:has(> .mv-tilt-card-c) {
            left: 41% !important;
            top: 4.3% !important;
          }
          .mv-collage-show-laptop-cochrane.mv-collage-hide-1400 {
            left: 41% !important;
            top: 14.3% !important;
          }
          .mv-collage-show-laptop.mv-collage-hide-1400:has(> .mv-tilt-card-a) {
            left: 41% !important;
            top: 28.6% !important;
            bottom: auto !important;
          }
        }
        @media (min-width: 741px) and (max-width: 1000px) {
          .mv-collage-show-laptop.mv-collage-hide-1400:has(> .mv-tilt-card-c) {
            left: 36% !important;
            top: 4.3% !important;
          }
          .mv-collage-show-laptop-cochrane.mv-collage-hide-1400 {
            left: 51% !important;
            top: 4.3% !important;
          }
          .mv-collage-show-laptop.mv-collage-hide-1400:has(> .mv-tilt-card-a) {
            left: 36% !important;
            top: 16.5% !important;
            bottom: auto !important;
          }
        }
        @media (min-width: 1001px) and (max-width: 1023px) {
          .mv-collage-show-laptop.mv-collage-hide-1400:has(> .mv-tilt-card-c) {
            left: 27% !important;
            top: 4.3% !important;
          }
          .mv-collage-show-laptop-cochrane.mv-collage-hide-1400 {
            left: 38% !important;
            top: 4.3% !important;
          }
          .mv-collage-show-laptop.mv-collage-hide-1400:has(> .mv-tilt-card-a) {
            left: 27% !important;
            top: 18.6% !important;
            bottom: auto !important;
          }
        }
        @media (min-width: 1024px) and (max-width: 1160px) {
          .mv-collage-show-laptop.mv-collage-hide-1400:has(> .mv-tilt-card-c) {
            left: 28% !important;
            top: 3% !important;
          }
          .mv-collage-show-laptop-cochrane.mv-collage-hide-1400 {
            left: 28% !important;
            top: 15% !important;
          }
          .mv-collage-show-laptop.mv-collage-hide-1400:has(> .mv-tilt-card-a) {
            left: 30% !important;
            bottom: 5% !important;
          }
        }
        @media (min-width: 720px) and (max-width: 1400px) {
          .mv-collage-hide-720-1400 {
            display: none;
          }
        }
        @media (min-width: 1401px) {
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
        /* De-overlap height gates (float layout only): each rule
           is scoped to min-width 720px so the mobile static stack
           is untouched. Without that scope, the notify gate would
           hide NotifyBubble from the mobile stack on phones with
           viewport height at or below 850px, breaking the required
           six-item stack. Notify hides below 850px viewport
           height: with the landed bottom 28% move the notify/faers
           gap is already worst-phase positive at 850, so the
           transition is clean, and below 850 the hide gives
           strict zero overlap where worst-phase overlap would
           otherwise persist to 835. Stickers hide below 950px:
           this kills stickers/microscope and stickers/helix at
           short stages, and above 950 their gaps are wide (53.2px
           rest at stage 980). Microscope hides below 800px: this
           kills the residual docking/microscope worst-phase graze
           (at most 6px) at 768. Tablet sets are unchanged:
           notify, stickers, and microscope are already hidden at
           tablet widths by hide-720-1160 and hide-1300, so these
           gates are moot there. Logo visibility counts are
           unaffected: no logo tile carries any of these classes. */
        /* Notify gate raised 850 -> 881 (2026-10-25, desktop B1 fix):
           FaersCard true height is 180px (label wraps to 2 lines), so
           notify vs faers overlapped worst-phase up to 7.7px at VH 851.
           Class name keeps the old 850 for churn safety; the threshold
           below is what matters. Tablet show-rules (min-height 882px)
           still win above 881, so tablet behavior is unchanged. */
        @media (min-width: 720px) and (max-height: 881px) {
          .mv-collage-hide-notify-850 {
            display: none;
          }
        }
        @media (min-width: 720px) and (max-height: 950px) {
          .mv-collage-hide-stickers-950 {
            display: none;
          }
        }
        @media (min-width: 720px) and (max-height: 800px) {
          .mv-collage-hide-microscope-800 {
            display: none;
          }
        }
        /* FAERS pill height gate (cursor follow-up): no top value
           clears microscope, notify, and the word at every height
           (the stage-800 window is empty once tilt is counted, and
           the short-stage windows demand 0.658 or higher), so the
           pill hides at viewport heights 1090px and below, just
           above the word worst-phase zero (1087.5) and the notify
           worst-phase zero (1016). Above 1090 only sub-3px float
           transients remain. Scoped like the sibling gates; the
           mobile stack has no pills, and logo counts are untouched. */
        @media (min-width: 720px) and (max-height: 1090px) {
          .mv-diorama-pill-faers {
            display: none;
          }
        }
        /* Tablet review/poster graze (de-overlap): review right
           29% to 31% at 1160px and below ONLY, as a width-scoped
           override, NOT a base change. Desktop keeps right 29%
           to protect the 18.6px review/search gap at 1440px.
           !important is required because the item right is
           inline. mv-collage-review is a positioning hook, not
           a hide rule; it rides in the hideClass field because
           that field is the only per-item class hook the render
           provides. At 1024px the tilt-adjusted gap goes from
           6px to about 26px; at 1160px from 42px to about 65px.
           Below 720px review is hidden by mobile-hide, so the
           override cannot leak into the mobile stack. */
        @media (max-width: 1160px) {
          .mv-collage-review {
            right: 31% !important;
          }
        }
        /* Rearrangement (review move + StrokeSense companion):
           review takes a new top-center-left home: left 36% top
           2% at 1161-1400px at all heights (the StrokeSense chip
           drops to the 0.45 lane in the same band so it clears
           the moved card), and left 44% top 2% at 1024-1160px but
           only at viewport heights 850px and above (below that
           the label binds, so review keeps its old right-31%
           fallback; above 1400px and at or below 1000px width
           review is unchanged). right:auto cancels the inline
           right 29% (and the 31% rule above in the tablet band);
           !important is required because the item position is
           inline. The chip rule moves only the StrokeSense
           chip's base top to 45% in 1161-1400px; the rAF tick
           uses the same 0.45 anchor in that band so drift and
           converge stay consistent. Both blocks are width-scoped
           so nothing leaks into the mobile stack. */
        @media (min-width: 1161px) and (max-width: 1400px) {
          .mv-collage-review {
            left: 36% !important;
            right: auto !important;
            top: 2% !important;
          }
          .mv-diorama-chip[data-chip="StrokeSense"] {
            top: 45% !important;
          }
        }
        @media (min-width: 1024px) and (max-width: 1160px) and (min-height: 850px) {
          .mv-collage-review {
            left: 44% !important;
            right: auto !important;
            top: 2% !important;
          }
        }
        /* Rearrangement (poster move + pointer-layer companions):
           poster takes the freed bottom-right slot (right 2.5%,
           bottom 2%). At 1161-1400px it moves at all heights; the
           Seoul chip (anchor 0.80 to 0.70, base right 30% below)
           and the Code for Cure pill (bottom 30% to 45% below)
           move in the same band so the pointer layer stays clear
           of the moved card. At 1024-1160px poster moves only at
           viewport heights 810px and above, and at 720-1000px
           only at 790px and above; below those heights it keeps
           the verified top-right slot (frame/glyph crossings
           bind there, and the diorama is hidden at 1160px and
           below so no chip/pill companion is needed in those
           bands). The 1001-1023px strip keeps top-right (no
           band claims it). Above 1400px poster stays hidden
           (hide-min-1400): PosterWindow already shows the same
           poster content there. !important is required because
           the item top is inline; right stays 2.5% inline.
           mv-collage-poster is a positioning hook, not a hide
           rule; it rides in the hideClass field like
           mv-collage-review. Below 720px poster is hidden by
           mobile-hide, so these min-width-720px rules cannot
           leak into the mobile stack. */
        @media (min-width: 1161px) and (max-width: 1400px) {
          .mv-collage-poster {
            top: auto !important;
            bottom: 2% !important;
          }
        }
        @media (min-width: 1024px) and (max-width: 1160px) and (min-height: 810px) {
          .mv-collage-poster {
            top: auto !important;
            bottom: 2% !important;
          }
        }
        @media (min-width: 720px) and (max-width: 1000px) and (min-height: 790px) {
          .mv-collage-poster {
            top: auto !important;
            bottom: 2% !important;
          }
        }
        /* Seoul chip laptop base (poster companion): moves the
           chip's CSS base from right:20% to right:30% in the
           laptop band only, matching the JS anchor 0.70 in the
           same band (see the cursor effect). Above 1400px the
           base stays right:20% (anchor 0.80), clear of the desk
           card. The data-chip hook rides the render like the
           sibling StrokeSense rule. !important is required
           because the chip base right is inline. */
        @media (min-width: 1161px) and (max-width: 1400px) {
          .mv-diorama-chip[data-chip="Seoul 2026"] {
            right: 30% !important;
          }
        }
        /* Code for Cure pill laptop position (poster companion):
           bottom 30% to 45% in the laptop band only, so the pill
           clears the poster's new bottom-right slot at every
           stage (pill bottom 0.55S vs poster top 0.98S-212 worst:
           clear for all S >= 550). Above 1400px the pill stays
           at bottom 30% (status quo). !important is required
           because the pill bottom is inline. */
        @media (min-width: 1161px) and (max-width: 1400px) {
          .mv-diorama-pill-cfc {
            bottom: 45% !important;
          }
        }
        /* Tablet native mirror (768/1024 bands): stickers, notify,
           posterwindow at 0.90, and awards return at tablet widths.
           Every rule is band-split (741-1000, 1024-1160) so the
           1001-1023px strip keeps its old review+poster layout
           and the 720-740px PubMed-only state is untouched. All
           six height gates keep their shipped thresholds (notify
           882 tablet / 850 desktop hide, stickers 950, posterwindow 790/810 matching the
           poster gates). Double-class show selectors beat the
           single-class hide rules regardless of order. Awards
           stays at scale 1.00 in both states (the brief suggested
           0.90 with poster-new); the R29% shift measures clean
           (4.3px worst gap at 1024x810) and keeps the card
           readable. Desk stays hidden: desk+awards collide (both
           bottom-anchored at 1024) and no clean joint rule
           measures out, so awards takes priority. */
        @media (min-width: 741px) and (max-width: 1000px) and (min-height: 951px) {
          .mv-collage-show-tablet-stickers.mv-collage-hide-1300 {
            display: block;
          }
        }
        @media (min-width: 1024px) and (max-width: 1160px) and (min-height: 951px) {
          .mv-collage-show-tablet-stickers.mv-collage-hide-1300 {
            display: block;
          }
        }
        @media (min-width: 741px) and (max-width: 1000px) and (min-height: 882px) {
          .mv-collage-show-tablet-notify.mv-collage-hide-720-1160 {
            display: block;
          }
        }
        @media (min-width: 1024px) and (max-width: 1160px) and (min-height: 882px) {
          .mv-collage-show-tablet-notify.mv-collage-hide-720-1160 {
            display: block;
          }
        }
        @media (min-width: 741px) and (max-width: 1000px) and (min-height: 790px) {
          .mv-collage-show-tablet-pw.mv-collage-hide-1400 {
            display: block;
          }
          .mv-collage-show-tablet-pw > .mv-tilt-window-a {
            transform: rotate(0deg) scale(0.9);
            transform-origin: center;
          }
        }
        @media (min-width: 1024px) and (max-width: 1160px) and (min-height: 810px) {
          .mv-collage-show-tablet-pw.mv-collage-hide-1400 {
            display: block;
          }
          .mv-collage-show-tablet-pw > .mv-tilt-window-a {
            transform: rotate(0deg) scale(0.9);
            transform-origin: center;
          }
        }
        @media (min-width: 1024px) and (max-width: 1160px) and (max-height: 809px) {
          .mv-collage-show-tablet-awards.mv-collage-hide-mid {
            display: block;
          }
        }
        @media (min-width: 1024px) and (max-width: 1160px) and (min-height: 810px) {
          .mv-collage-show-tablet-awards.mv-collage-hide-mid {
            display: block;
          }
          .mv-collage-show-tablet-awards {
            right: 29% !important;
          }
        }
        /* Tablet diorama: the container returns in the two pill
           bands only (768-1000, 1024-1160). Chips stay hidden in
           both bands (touch iPads via hover:none, mouse iPads via
           the 1160px hide; this block revives only the container
           and the two pills, never a chip). The Code for Cure
           pill returns at bottom 30% with right 40% (768-1000) /
           30% (1024-1160) instead of the brief's right 14%,
           which collides with poster-new at short stages; the
           Seoul pill stays hidden (pill-none below, no show
           rule). The FAERS pill keeps its shipped VH above 1090
           gate. The 741-767px range keeps the pill hidden: at
           right 40% it would graze notify below 768px. */
        @media (min-width: 768px) and (max-width: 1000px) {
          .mv-diorama {
            display: block;
          }
          .mv-diorama-chip {
            display: none;
          }
          .mv-diorama-pill {
            display: none;
          }
          .mv-diorama-pill.mv-diorama-pill-cfc {
            display: block;
            right: 40% !important;
          }
        }
        @media (min-width: 1024px) and (max-width: 1160px) {
          .mv-diorama {
            display: block;
          }
          .mv-diorama-chip {
            display: none;
          }
          .mv-diorama-pill {
            display: none;
          }
          .mv-diorama-pill.mv-diorama-pill-cfc {
            display: block;
            right: 30% !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1000px) and (min-height: 1091px) {
          .mv-diorama-pill.mv-diorama-pill-faers {
            display: block;
          }
        }
        @media (min-width: 1024px) and (max-width: 1160px) and (min-height: 1091px) {
          .mv-diorama-pill.mv-diorama-pill-faers {
            display: block;
          }
        }
        /* Reduced-motion guard: the tablet block above would
           otherwise resurrect the diorama for reduced-motion
           users (the earlier guard sits before it in source
           order). This repeats the existing desktop behavior
           for every width. */
        @media (prefers-reduced-motion: reduce) {
          .mv-diorama {
            display: none;
          }
        }
        /* Giant-word lockup below the fit boundary (responsive
           fix): the full word fits on one line only at 904px and
           above (0.896V - 18 <= V - 112), so below 904px the word
           is capped at 64-72px and breaks at the <wbr/> between
           "daivan" and "labs." instead of mid-word: two lines
           on narrow phones, one line once the viewport is wide
           enough for "daivanlabs." at 72px. The 903px threshold keeps this rule exactly
           inert at 904px and above (inline clamp, 180px cap, and
           frame fit unchanged there). !important is required
           because the h1 font size is set inline. */
        @media (max-width: 903px) {
          .mv-word {
            font-size: clamp(64px, 18vw, 72px) !important;
          }
        }
        /* 100svh fallback for older browsers: a browser without
           dvh support ignores the second line and keeps svh.
           The mobile block below still wins at 719px and below
           (height auto), since it comes later at equal
           importance. */
        .mv-hero {
          height: calc(100svh - 100px) !important;
          height: calc(100dvh - 100px) !important;
        }
        @media (max-width: 719px) {
          .mv-hero {
            height: auto !important;
          }
          /* Mobile frame breathing room: 8px extra per side so
             the dashed border does not read as sitting on the
             screen edge. Side padding drops 32px to 24px to
             compensate, so frame content stays V - 112 exactly
             as the word lockup math assumes ("daivan" at 64px
             needs 200px; at 320px content is 208px, slack 8px).
             Without the padding compensation the content would
             shrink to V - 128 (192px at 320px) and the word
             would break mid-word again. */
          .mv-frame {
            width: calc(100% - 16px) !important;
            margin: 0 auto;
            padding: 28px 24px !important;
          }
          .mv-collage {
            position: static;
            inset: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            width: 100%;
            overflow: visible;
            margin-top: 16px;
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
        /* Phone zoom-out miniature (mobile-mirror task): below a
           720px layout width the hero renders as a frozen
           1161-1400 tall-stage miniature on a 1160x980 design
           stage (equivalent to VH 1080, all gates open) scaled
           to the section width by the JS-measured transform
           scale on .mv-mini. .mv-hero-mini is the single
           source of truth (JS gates on section clientWidth),
           so these rules are class-scoped, not media-scoped:
           that keeps the 719/720 seam explicit and
           self-consistent even where a scrollbar makes
           clientWidth and the CSS viewport differ by a few px.
           .mv-mini is display:contents at desktop/tablet, so
           the wrapper is layout-neutral there: label/frame stay
           flex items of the section and the collage keeps the
           section as its containing block. Frozen anchors:
           review 36%/2%, poster bottom-right, Scopus/Cochrane
           62% stack, Elsevier 27%/bottom 5%. Wide-band items
           (search, posterwindow, gutaxis, desk) are excluded
           via .mv-mini-exclude and the m-* twins via
           hide-min-720, so no logo appears twice. Chips/pills
           stay hidden (existing diorama rules untouched).
           Float and tilt are restored (the 719px block zeroes
           them for the old stack); the reduced-motion override
           at the end re-kills them when requested. */
        .mv-mini {
          display: contents;
        }
        .mv-hero.mv-hero-mini {
          height: var(--mv-mini-h) !important;
          min-height: var(--mv-mini-h) !important;
          padding: 0 !important;
          display: block !important;
        }
        .mv-hero-mini .mv-mini {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 1160px;
          height: 980px;
          padding: 80px 24px;
          box-sizing: border-box;
        }
        .mv-hero-mini .mv-frame {
          width: 100% !important;
          padding: 28px 32px !important;
          margin: 0 !important;
        }
        .mv-hero-mini .mv-word {
          font-size: 180px !important;
        }
        .mv-hero-mini .mv-collage {
          position: absolute !important;
          inset: 0 !important;
          display: block !important;
          overflow: hidden !important;
          margin-top: 0 !important;
        }
        .mv-hero-mini .mv-collage-item {
          position: absolute !important;
          max-width: none !important;
          display: block !important;
        }
        .mv-hero-mini .mv-collage-float {
          animation: mv-collage-float 12s ease-in-out infinite alternate;
        }
        .mv-hero-mini .mv-tilt-card-a { transform: rotate(-3deg); }
        .mv-hero-mini .mv-tilt-card-b { transform: rotate(2deg); }
        .mv-hero-mini .mv-tilt-card-c { transform: rotate(-1deg); }
        .mv-hero-mini .mv-tilt-card-d { transform: rotate(1deg); }
        .mv-hero-mini .mv-tilt-card-e { transform: rotate(3deg); }
        .mv-hero-mini .mv-tilt-window-a { transform: rotate(0deg); }
        .mv-hero-mini .mv-tilt-window-b { transform: rotate(1deg); }
        .mv-hero-mini .mv-tilt-window-c { transform: rotate(2deg); }
        .mv-hero-mini .mv-tilt-chip { transform: rotate(0deg); }
        .mv-hero-mini .mv-tilt-sticker-a { transform: rotate(-5deg); }
        .mv-hero-mini .mv-tilt-sticker-b { transform: rotate(4deg); }
        .mv-hero-mini .mv-collage-review {
          left: 36% !important;
          right: auto !important;
          top: 2% !important;
        }
        .mv-hero-mini .mv-collage-poster {
          top: auto !important;
          bottom: 2% !important;
        }
        .mv-hero-mini .mv-collage-show-laptop:has(> .mv-tilt-card-a) {
          left: 27% !important;
          bottom: 5% !important;
        }
        .mv-hero-mini .mv-collage-show-laptop:has(> .mv-tilt-card-c) {
          left: 62% !important;
          top: 19% !important;
        }
        .mv-hero-mini .mv-collage-show-laptop-cochrane {
          left: 62% !important;
          top: 2% !important;
        }
        /* Excludes come AFTER the show-all item rule above
           (same specificity, later wins): wide-band items and
           the mobile-stack twins never render in the miniature. */
        .mv-hero-mini .mv-mini-exclude {
          display: none !important;
        }
        .mv-hero-mini .mv-collage-hide-min-720 {
          display: none !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .mv-hero-mini .mv-collage {
            animation: none !important;
          }
          .mv-hero-mini .mv-collage-float {
            animation: none !important;
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
            data-chip={chip.label}
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
            className={`mv-diorama-pill${pill.cls ? ` ${pill.cls}` : ""}`}
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
      {/* Phone zoom-out miniature wrapper: display:contents at
          desktop/tablet (layout-neutral), the 1160x980 design
          stage below 720px (see the miniature stylesheet). */}
      <div
        className="mv-mini"
        style={
          miniScale !== null
            ? { transform: `scale(${miniScale})`, transformOrigin: "top left" }
            : undefined
        }
      >
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
          daivan<wbr />labs.
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
      </div>
    </section>
  );
}
