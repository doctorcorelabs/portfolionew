/**
 * Manifesto: replaced by the JOURNEY visualization (user request,
 * 24 Oct 2026). The generic 4-step method explainer is gone; this
 * section now shows the recorded journey as a dashed route with
 * year stations, built from docs/journey/01-spine.md (every station
 * is a recorded fact, nothing invented, nothing backfilled).
 *
 * Layout: dark #111 section. On desktop the route is horizontal:
 * a dashed line draws left to right on reveal, year stations sit
 * alternating above and below it, and each station node pops with
 * the overshoot curve. Award and presentation clusters render as
 * small blue dots with a visible count label (dots are decorative;
 * the count label carries the information, so nothing is
 * hover-dependent). Since the 28 Oct 2026 overview revision, dots
 * also carry a short visible label each, so the per-year
 * achievements read without hovering. Since the 29 Oct 2026
 * bead-expand round (docs/journey-bead-expand/01-spec.md), the 2024
 * and 2025 award lists open from a glowing bead with an inline
 * expanding card; the other stations keep their labeled dots. On mobile (1100px and below) the route becomes
 * a vertical dashed line on the left with stations stacked beside
 * it.
 *
 * Colour rule (learned this round): the global stylesheet forces
 * dark #1D1D1F on all h1-h6, which beats section inheritance. EVERY
 * heading and text element here carries an explicit light colour in
 * its own style (#FAFAFA headings, #D8D8D8 body, #98989C mono
 * labels). Never rely on inherited colour on dark.
 *
 * Motion (self-contained, no shared motion file):
 * - A tiny local IntersectionObserver adds mvM-in to the section
 *   once it enters the viewport, then unobserves. Elements are only
 *   hidden after the effect arms the section (mvM-armed), so content
 *   never stays invisible if the observer cannot run.
 * - Dashed route draws on SCROLL, not on a timer: a rAF-throttled
 *   passive scroll listener maps section scroll progress (0 to 1,
 *   from the section bounding rect) to the route line scale, the
 *   same value for the desktop horizontal line and the mobile
 *   vertical segments (via --journey-progress). Station nodes pop
 *   with cubic-bezier(0.34, 1.56, 0.64, 1), staggered 150ms; station
 *   content fades up with the same stagger.
 * - Active station: the station nearest the viewport center gets a
 *   soft pulsing box-shadow ring (2s ease-in-out infinite).
 * - The header block (kicker, heading, intro) sits in a sec-slide
 *   from-right wrapper (CSS owned by section-slide.css); it slides
 *   in when the section enters view.
 * - The blue drift blob from v4 was retired by the Three Lanterns
 *   spec (docs/journey-three-lanterns/01-spec.md): three
 *   section-level lanterns now light the navy gradient base.
 * - Balanced package (28 Oct 2026, docs/journey-balanced-package/
 *   01-spec.md): Contour Drift rings behind the wells, one
 *   line-drawn Instrument per station after its dotCount, and a
 *   Step Forward wrapper that leans the active station's reading
 *   content toward the route.
 * - prefers-reduced-motion: full static route, no draw animation,
 *   no pops, no pulse, slide static, no scroll listener.
 *   Touch: no hover-dependent content, no scroll hijack, no drag.
 */

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Fragment } from "react";
import { BeadExpand } from "./journey/BeadExpand";

const DISPLAY =
  "Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const PAPER = "#FAFAFA";
const BODY = "#D8D8D8";
const LABEL = "#98989C";
const BLUE = "#0859D4";

/* Bead position parameter (spec 2.1): five station windows derived
   from scroll progress. Inside window k the bead travels from node
   k - 1 to node k during the first half, then dwells on node k. */
function beadStateFromProgress(p: number): {
  beadIndex: number;
  arrivalIdx: number;
} {
  const w = p * 5;
  const k = Math.min(4, Math.floor(w));
  const l = w - k;
  const from = k === 0 ? 0 : k - 1;
  const frac = l < 0.5 ? 1 - Math.pow(1 - l * 2, 3) : 1;
  return {
    beadIndex: from + frac * (k - from),
    arrivalIdx: l >= 0.5 ? k : Math.max(0, k - 1),
  };
}

/* Station seal (spec 3): 28x28 thin-outline line art beside the year
   numeral. Closed shapes fill blue when active; open shapes stay
   unfilled and bump stroke-width instead. */
function JourneySeal({ index, active }: { index: number; active: boolean }) {
  const stroke = active ? BLUE : "rgba(255, 255, 255, 0.6)";
  const isOpen = index === 0 || index === 1;
  const closedFill = active ? BLUE : "none";
  const accentStroke = active ? PAPER : undefined;
  return (
    <span
      aria-hidden="true"
      className={active ? "journey-seal journey-seal-active" : "journey-seal"}
    >
      <svg
        width={28}
        height={28}
        viewBox="0 0 28 28"
        aria-hidden="true"
        style={{
          display: "block",
          stroke,
          strokeWidth: active && isOpen ? 2 : 1.5,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "none",
        }}
      >
        {index === 0 && <path d="M6 24 V6 H22 V24" fill="none" />}
        {index === 1 && <path d="M4 24 H10 V18 H16 V12 H22 V6" fill="none" />}
        {index === 2 && (
          <>
            <circle
              className="seal-closed"
              cx={14}
              cy={14}
              r={9}
              style={{ fill: closedFill }}
            />
            <ellipse
              className="seal-ellipse"
              cx={14}
              cy={14}
              rx={9}
              ry={3.5}
              style={{ fill: "none", stroke: accentStroke }}
            />
          </>
        )}
        {index === 3 && (
          <>
            <path
              className="seal-closed"
              d="M4 24 L14 6 L24 24 Z"
              style={{ fill: closedFill }}
            />
            <rect
              className="seal-apex"
              x={11}
              y={3}
              width={6}
              height={6}
              style={{ fill: "none", stroke: accentStroke }}
            />
          </>
        )}
        {index === 4 && (
          <>
            <rect
              className="seal-closed"
              x={4}
              y={10}
              width={12}
              height={12}
              style={{ fill: closedFill }}
            />
            <rect x={12} y={4} width={12} height={12} fill="none" />
          </>
        )}
      </svg>
    </span>
  );
}

/* Station instrument (balanced-package spec 3): 72x72 thin-outline
   line art in its own block after the dotCount. One blue accent per
   asset, lit only when active; draw-on runs once per activation and
   deactivation fades back to a fully drawn outline, never erased. */
function JourneyInstrument({
  index,
  active,
}: {
  index: number;
  active: boolean;
}) {
  const stroke = active ? PAPER : "rgba(255, 255, 255, 0.7)";
  const accent = active ? BLUE : undefined;
  return (
    <span
      aria-hidden="true"
      className={
        active
          ? "journey-instrument journey-instrument-active"
          : "journey-instrument"
      }
    >
      <svg
        width={72}
        height={72}
        viewBox="0 0 72 72"
        aria-hidden="true"
        style={{
          display: "block",
          stroke,
          strokeWidth: 1.5,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "none",
        }}
      >
        {index === 0 && (
          <>
            <path d="M36 14 V54" pathLength={100} style={{ stroke: accent }} />
            <path
              d="M36 18 C28 12 18 12 10 16 V50 C18 46 28 46 36 52"
              pathLength={100}
            />
            <path
              d="M36 18 C44 12 54 12 62 16 V50 C54 46 44 46 36 52"
              pathLength={100}
            />
          </>
        )}
        {index === 1 && (
          <>
            <path
              d="M36 6 L52 38 C52 52 46 62 36 62 C26 62 20 52 20 38 Z"
              pathLength={100}
            />
            <path d="M36 20 V44" pathLength={100} style={{ stroke: accent }} />
            <path d="M8 28 H16" pathLength={100} />
            <path d="M6 40 H14" pathLength={100} />
            <path d="M8 52 H16" pathLength={100} />
          </>
        )}
        {index === 2 && (
          <>
            <circle cx={36} cy={36} r={22} pathLength={100} />
            <ellipse
              cx={36}
              cy={36}
              rx={30}
              ry={10}
              pathLength={100}
              style={{ stroke: accent }}
            />
            <ellipse cx={36} cy={36} rx={10} ry={30} pathLength={100} />
            <path d="M36 14 C48 24 48 48 36 58" pathLength={100} />
          </>
        )}
        {index === 3 && (
          <>
            <path
              d="M30 8 H42 V26 L58 56 Q60 62 54 62 H18 Q12 62 14 56 L30 26 Z"
              pathLength={100}
            />
            <circle cx={28} cy={48} r={2.5} pathLength={100} />
            <circle cx={44} cy={42} r={2.5} pathLength={100} />
            <circle
              cx={36}
              cy={54}
              r={3}
              pathLength={100}
              style={{
                fill: active ? BLUE : "none",
                stroke: active ? BLUE : "rgba(255, 255, 255, 0.7)",
              }}
            />
          </>
        )}
        {index === 4 && (
          <>
            <path d="M12 8 H48 L62 18 V62 H12 Z" pathLength={100} />
            <path d="M48 8 V18 H62" pathLength={100} style={{ stroke: accent }} />
            <path d="M20 30 H54" pathLength={100} />
            <path d="M20 40 H54" pathLength={100} />
          </>
        )}
      </svg>
    </span>
  );
}

type Station = {
  year: string;
  title: string;
  detail: string;
  dots: string[];
  dotCount: string | null;
};

const STATIONS: Station[] = [
  {
    year: "2022",
    title: "Medicine begins",
    detail: "Medical school begins at Universitas Islam Indonesia.",
    dots: [
      "Bachelor of Medicine, Faculty of Medicine, UII",
      "GPA 3.90 out of 4.0",
    ],
    dotCount: null,
  },
  {
    year: "2023",
    title: "Scholarship year",
    detail:
      "A scholarship year, active in SMART FK UII, BAPIN-ISMKI, and Seni.Bicara.",
    dots: ["Beasiswa Unggulan Awardee"],
    dotCount: null,
  },
  {
    year: "2024",
    title: "Certificates, papers, world stages",
    detail:
      "20 certifications and first international stages. Four 2024 publications: gut axis and leukemia, colonoscopy AI, RAAS and hypertension. Speaker and mentor, KampusInovatif.id and INTIMATE SMART FK UII.",
    dots: [
      "ePoster, ENDO 2024, Seoul",
      "Poster, ICKSH 2024",
      "Oral presentation, MYHAM 2024",
      "Gold Medal, ISIF 2024",
    ],
    dotCount: "4 award items in 2024",
  },
  {
    year: "2025",
    title: "A peak year, and a lab is born",
    detail:
      "Most Outstanding Student, a new lab, and a summer school abroad. DaivanLabs founded June 2025. Summer school at Chulalongkorn (AASP-PECT). Amomum cardamomum breast cancer publication (2025).",
    dots: [
      "Most Outstanding Student UII 2025",
      "3rd Most Outstanding Student LLDIKTI V 2025",
      "Gold Medal and Special Award, IIF 2025",
      "Gold Medal, ISIF 2025",
      "Gold Medal, IICYMS 2025",
      "Gold Medal, WRCSO 2025",
      "Gold Medal, WSEEC 2025",
      "Silver Medal, I2ASPO 2025",
      "Silver Medal, BISF 2025",
      "Silver Medal, JISF 2025",
      "Travel Grant, ICDM 2025",
    ],
    dotCount: "11 award items in 2025",
  },
  {
    year: "2026",
    title: "Clinic and congress",
    detail:
      "Clinical clerkship (koas). Poster presenter at Hypertension Seoul 2026.",
    dots: [
      "BPA and hormone disorders",
      "Echinometra lucunter in NSCLC",
      "Amomum cardamomum in breast cancer",
      "Lytechinus variegatus in obesity",
      "miRNA in endometrial cancer",
    ],
    dotCount: null,
  },
];

/* Bead-expand round (docs/journey-bead-expand/01-spec.md, 02-hint-spec.md):
   the 2024, 2025 and 2026 award lists open from a glowing bead with an
   inline expanding card. Every other station keeps its dot list byte for
   byte. */
const BEAD_YEARS = new Set(["2024", "2025", "2026"]);
/* Hint pill wording beside each bead; swap the word in one place. */
const BEAD_HINT_TEXT = "tap me";
/* Scopus quartile badges for the 2026 paper rows (user-directed facts).
   Only 2026 items carry quartiles; 2024/2025 items get none. */
const BEAD_QUARTILES: Record<string, string> = {
  "BPA and hormone disorders": "Q2",
  "Echinometra lucunter in NSCLC": "Q3",
  "Amomum cardamomum in breast cancer": "Q1",
  "Lytechinus variegatus in obesity": "Q3",
  "miRNA in endometrial cancer": "Q1",
};

const REVEAL_CSS = `
.mvM-armed .mvM-reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 600ms ease, transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}
.mvM-armed.mvM-in .mvM-reveal {
  opacity: 1;
  transform: translateY(0);
}
.journey-lantern-a,
.journey-lantern-b,
.journey-lantern-c {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  will-change: transform, opacity;
}
.journey-lantern-a {
  width: 1100px;
  height: 1100px;
  top: -6%;
  left: -8%;
  animation: journey-lantern-a 28s ease-in-out infinite alternate, journey-lantern-pulse 6s ease-in-out infinite;
}
@keyframes journey-lantern-a {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(70px, 70px, 0);
  }
}
.journey-lantern-b {
  width: 1300px;
  height: 1300px;
  bottom: -12%;
  right: -10%;
  animation: journey-lantern-b 36s ease-in-out infinite alternate, journey-lantern-pulse 7s ease-in-out infinite;
  animation-delay: 0s, -3.5s;
}
@keyframes journey-lantern-b {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-60px, -60px, 0);
  }
}
.journey-lantern-c {
  width: 800px;
  height: 800px;
  top: 38%;
  right: 2%;
  animation: journey-lantern-c 24s ease-in-out infinite alternate;
}
@keyframes journey-lantern-c {
  from {
    transform: translate3d(0, -40px, 0);
  }
  to {
    transform: translate3d(0, 40px, 0);
  }
}
/* Lantern pulse (pulse-rings spec 2): drift owns transform, pulse
   owns opacity, so the two animations never fight. Shared by both
   blue lanterns; C keeps drift only. Opacity 0.8 to 1 is a breath,
   never a blink, so the section never flashes back toward black. */
@keyframes journey-lantern-pulse {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
}
.journey-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto 48px auto;
  column-gap: 24px;
  position: relative;
}
.journey-line {
  grid-column: 1 / -1;
  grid-row: 2;
  align-self: center;
  height: 0;
  border-top: 2px dashed rgba(255, 255, 255, 0.35);
  transform-origin: left center;
  position: relative;
}
.mvM-armed .journey-line {
  transform: scaleX(0);
}
/* Scroll-driven draw: the inline scaleX (section progress) wins
   over the armed rule above once the effect runs. */
.journey-node-active .journey-node-dot,
.journey-station-active .journey-node-mobile {
  animation: journey-pulse 2s ease-in-out infinite;
}
@keyframes journey-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(8, 89, 212, 0.45);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(8, 89, 212, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(8, 89, 212, 0);
  }
}
.journey-node {
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.journey-node-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #0859D4;
  border: 2px solid #FAFAFA;
  box-sizing: border-box;
  flex-shrink: 0;
}
.mvM-armed .journey-node-dot {
  opacity: 0;
  transform: scale(0.4);
}
.mvM-armed.mvM-in .journey-node-dot {
  opacity: 1;
  transform: scale(1);
  transition:
    transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 300ms ease;
}
.journey-node-mobile {
  display: none;
}
@media (max-width: 1100px) {
  .journey-grid {
    display: block;
  }
  .journey-line,
  .journey-node {
    display: none;
  }
  .journey-station {
    position: relative;
    padding-left: 40px;
    padding-bottom: 48px;
    margin: 0;
  }
  .journey-station:last-child {
    padding-bottom: 0;
  }
  .journey-station::before {
    content: "";
    position: absolute;
    left: 7px;
    top: 14px;
    bottom: 0;
    border-left: 2px dashed rgba(255, 255, 255, 0.35);
  }
  .journey-station:last-child::before {
    top: 0;
    bottom: auto;
    height: 14px;
  }
  .mvM-armed .journey-station::before {
    transform: scaleY(var(--journey-progress, 0));
    transform-origin: top;
  }
  .journey-node-mobile {
    display: block;
    position: absolute;
    left: 0;
    top: 6px;
  }
}
/* Bead on the route (spec 2): 16px, same fill/border as node dots. */
.journey-bead {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #0859D4;
  border: 2px solid #FAFAFA;
  box-sizing: border-box;
  pointer-events: none;
  position: absolute;
}
.journey-bead-desktop {
  /* Grid-area placement: the bead is a direct .journey-grid child, so
     its containing block is the route row (grid-row 2, 48px tall) and
     top 50% centers it on the route. This keeps it OUTSIDE
     .journey-line, whose scaleX(progress) draw transform used to squash
     the bead horizontally and scale its left offset by progress. */
  grid-column: 1 / -1;
  grid-row: 2;
  top: 50%;
  transform: translate(-50%, -50%);
}
.journey-bead-mobile {
  left: 7px;
  transform: translate(-50%, -50%);
}
.mvM-armed:not(.mvM-in) .journey-bead {
  opacity: 0;
}
/* One-shot arrival ring (spec 2.5), separate from the 2s pulse. */
.journey-bead-ring {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  animation: journey-bead-ring 450ms ease-out forwards;
}
.journey-bead-ring-desktop {
  left: 50%;
  top: 50%;
}
.journey-bead-ring-mobile {
  left: 0;
  top: 6px;
  animation-name: journey-bead-ring-mobile;
}
@keyframes journey-bead-ring {
  from {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
    box-shadow: 0 0 0 0 rgba(8, 89, 212, 0.45);
  }
  to {
    transform: translate(-50%, -50%) scale(1.9);
    opacity: 0;
    box-shadow: 0 0 0 14px rgba(8, 89, 212, 0);
  }
}
@keyframes journey-bead-ring-mobile {
  from {
    transform: scale(1);
    opacity: 0.6;
    box-shadow: 0 0 0 0 rgba(8, 89, 212, 0.45);
  }
  to {
    transform: scale(1.9);
    opacity: 0;
    box-shadow: 0 0 0 14px rgba(8, 89, 212, 0);
  }
}
/* Year numeral pop on bead arrival (spec 2.4). */
.journey-year-pop {
  animation: journey-bead-pop 450ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes journey-bead-pop {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}
/* Station seals (spec 3). */
.journey-seal {
  flex-shrink: 0;
}
.journey-seal-active {
  animation: journey-seal-snap 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes journey-seal-snap {
  from {
    transform: scale(1.25);
  }
  to {
    transform: scale(1);
  }
}
.journey-seal path,
.journey-seal circle,
.journey-seal ellipse,
.journey-seal rect {
  transition: fill 300ms ease, stroke 300ms ease;
}
/* Stage lights (spec 4). */
.journey-well {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(ellipse 70% 45% at 50% 28%, rgba(255, 255, 255, 0.10) 0%, rgba(8, 89, 212, 0.07) 45%, rgba(255, 255, 255, 0) 70%);
  transition: opacity 800ms ease;
}
.mvM-armed:not(.mvM-in) .journey-well {
  opacity: 0 !important;
}
.journey-glow {
  position: absolute;
  left: -13px;
  width: 40px;
  top: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255, 255, 255, 0.10) 0%, rgba(8, 89, 212, 0.07) 50%, rgba(255, 255, 255, 0) 70%);
  opacity: 1;
}
/* Contour Drift rings (balanced-package spec 2): one 2400px SVG as a
   direct .journey-grid child, so its negative z-index stays inside
   the wrapper stacking context. Desktop anchor sits 120px beyond
   the grid's right edge; only the left arcs cross the content. */
.journey-rings {
  position: absolute;
  left: calc(100% + 120px);
  top: 50%;
  z-index: -2;
  pointer-events: none;
  transition: transform 800ms ease-out;
}
.mvM-armed:not(.mvM-in) .journey-rings {
  opacity: 0;
}
/* Ring march (pulse-rings spec 4b): concentric circles cannot show
   rotation, so the animation is marching dashes. Dashoffset lives
   on the child circles and never touches the SVG opacity gate or
   the scroll scale on the SVG transform. Odd rings run reversed. */
.journey-rings circle {
  stroke-dasharray: 60 40;
  animation: journey-ring-march 12s linear infinite;
}
.journey-rings .journey-ring-1,
.journey-rings .journey-ring-3,
.journey-rings .journey-ring-5 {
  animation-direction: reverse;
}
@keyframes journey-ring-march {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -100;
  }
}
/* Instruments (balanced-package spec 3): in-flow block after the
   dotCount; draw-on runs only under the active class, and the base
   style has no dash array, so deactivation fades back to a fully
   drawn outline instead of erasing. */
.journey-instrument {
  display: block;
  margin-top: 16px;
  transition: opacity 300ms ease;
}
.journey-instrument path,
.journey-instrument circle,
.journey-instrument ellipse,
.journey-instrument rect {
  transition: fill 300ms ease, stroke 300ms ease;
}
.journey-instrument-active svg * {
  stroke-dasharray: 100;
  animation: journey-instrument-draw 700ms ease-out forwards;
}
@keyframes journey-instrument-draw {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}
/* Step Forward (balanced-package spec 4): the wrapper carries the
   step transform so the article's reveal transform is untouched.
   Above-route stations step down toward the route, below-route
   stations step up. No transition delay: the wrapper must not
   inherit the article's reveal delay. */
.journey-step {
  transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.journey-station-active .journey-step-top {
  transform: translateY(12px);
}
.journey-station-active .journey-step-bottom {
  transform: translateY(-12px);
}
@media (max-width: 1100px) {
  .journey-bead-desktop,
  .journey-bead-ring-desktop,
  .journey-well {
    display: none;
  }
  /* Rings re-anchor to the 7px vertical line at half size; only the
     four largest rings show on mobile. */
  .journey-rings {
    left: 7px;
    width: 1200px;
    height: 1200px;
  }
  .journey-ring-0,
  .journey-ring-1,
  .journey-ring-2 {
    display: none;
  }
  /* Mobile lanterns: A and B shrink with halved drift; C is dropped,
     the stacked layout has no right gutter for it. */
  .journey-lantern-a {
    width: 700px;
    height: 700px;
    top: -4%;
    left: -20%;
    animation: journey-lantern-a-mobile 28s ease-in-out infinite alternate, journey-lantern-pulse 6s ease-in-out infinite;
  }
  @keyframes journey-lantern-a-mobile {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(35px, 35px, 0);
    }
  }
  .journey-lantern-b {
    width: 900px;
    height: 900px;
    bottom: -8%;
    right: -25%;
    animation: journey-lantern-b-mobile 36s ease-in-out infinite alternate, journey-lantern-pulse 7s ease-in-out infinite;
    animation-delay: 0s, -3.5s;
  }
  @keyframes journey-lantern-b-mobile {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(-30px, -30px, 0);
    }
  }
  .journey-lantern-c {
    display: none;
  }
  /* Step Forward mobile: every active wrapper steps 8px left toward
     the vertical line, regardless of top/bottom. */
  .journey-station-active .journey-step-top,
  .journey-station-active .journey-step-bottom {
    transform: translateX(-8px);
  }
}
@media (min-width: 1101px) {
  .journey-bead-mobile,
  .journey-bead-ring-mobile,
  .journey-glow {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .mvM-armed .mvM-reveal {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .journey-lantern-a,
  .journey-lantern-b,
  .journey-lantern-c {
    animation: none !important;
  }
  .mvM-armed .journey-line {
    transform: none !important;
    transition: none !important;
  }
  .mvM-armed .journey-node-dot {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .journey-node-active .journey-node-dot,
  .journey-station-active .journey-node-mobile {
    animation: none !important;
  }
  .mvM-armed .journey-station::before {
    transform: none !important;
    transition: none !important;
  }
  .journey-bead {
    display: none !important;
  }
  .journey-seal-active {
    animation: none !important;
  }
  .journey-seal path,
  .journey-seal circle,
  .journey-seal ellipse,
  .journey-seal rect {
    transition: none !important;
  }
  .journey-well {
    opacity: 0.3 !important;
    transition: none !important;
  }
  .journey-glow {
    opacity: 0.3 !important;
    transition: none !important;
  }
  .journey-year-pop {
    animation: none !important;
  }
  .journey-bead-ring {
    animation: none !important;
  }
  /* Balanced package: rings park at the middle scale, instruments
     render fully drawn with no draw animation, the step never
     moves (the branch sets activeIdx to 4, so without this the
     2026 wrapper would step). */
  .journey-rings {
    transform: translate(-50%, -50%) scale(1.08) !important;
    transition: none !important;
  }
  .journey-rings circle {
    animation: none !important;
  }
  .journey-instrument-active svg * {
    animation: none !important;
  }
  .journey-instrument,
  .journey-instrument path,
  .journey-instrument circle,
  .journey-instrument ellipse,
  .journey-instrument rect {
    transition: none !important;
  }
  .journey-step {
    transform: none !important;
    transition: none !important;
  }
}
`;

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [beadTop, setBeadTop] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  /* Bead-expand round: one station expanded at a time. seenBeads hides the
     "tap me" hint permanently after a bead's first open. */
  const [expandedBead, setExpandedBead] = useState<string | null>(null);
  const [seenBeads, setSeenBeads] = useState<Set<string>>(() => new Set());
  const toggleBead = (year: string) => {
    const opening = expandedBead !== year;
    if (opening) {
      setSeenBeads((prev) => {
        const next = new Set(prev);
        next.add(year);
        return next;
      });
    }
    setExpandedBead(opening ? year : null);
  };

  /* Latest progress for async re-measures (transitionend) that must not
     capture a stale render closure. */
  const progressRef = useRef(0);
  progressRef.current = progress;

  /* Mobile bead position (spec 2.3): interpolate the measured mobile
     node centers by the bead index from progress. Shared by the
     scroll/resize update below and the expandedBead layout effect. */
  const measureBeadTop = (p: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const grid = section.querySelector(".journey-grid");
    if (!grid) {
      setBeadTop((prev) => (prev === null ? prev : null));
      return;
    }
    const gridRect = grid.getBoundingClientRect();
    const centers: number[] = [];
    grid.querySelectorAll(".journey-node-mobile").forEach((dot) => {
      const r = dot.getBoundingClientRect();
      centers.push(r.top + 8 - gridRect.top);
    });
    if (centers.length !== 5) {
      setBeadTop((prev) => (prev === null ? prev : null));
      return;
    }
    const b = beadStateFromProgress(p).beadIndex;
    const i0 = Math.floor(b);
    const i1 = Math.min(4, Math.ceil(b));
    const top = centers[i0] + (b - i0) * (centers[i1] - centers[i0]);
    setBeadTop((prev) =>
      prev === null || Math.abs(prev - top) >= 0.5 ? top : prev,
    );
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.classList.add("mvM-armed");
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      section.classList.add("mvM-in");
      setProgress(1);
      setActiveIdx(4);
      return;
    }
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "undefined") {
      section.classList.add("mvM-in");
      setInView(true);
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              section.classList.add("mvM-in");
              setInView(true);
              observer?.disconnect();
            }
          });
        },
        { threshold: 0.15 },
      );
      observer.observe(section);
    }
    // Scroll-driven route: section progress from the bounding rect,
    // clamped 0 to 1, plus the station nearest the viewport center.
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      setProgress((prev) => (Math.abs(prev - p) < 0.005 ? prev : p));
      let best = -1;
      if (rect.bottom > 0 && rect.top < vh) {
        let bestDist = Infinity;
        section.querySelectorAll(".journey-station").forEach((el, idx) => {
          const r = el.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - vh / 2);
          if (d < bestDist) {
            bestDist = d;
            best = idx;
          }
        });
      }
      setActiveIdx((prev) => (prev === best ? prev : best));
      // Mobile bead position (spec 2.3): interpolate the measured
      // mobile node centers by the same bead index. Runs inside the
      // existing throttled update only; no new listener.
      measureBeadTop(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, []);

  /* The traveling bead interpolates the measured mobile node centers,
     but those only recompute on scroll/resize. Opening or closing a
     bead card moves the nodes below it (up to ~350px) with no scroll
     event, so re-measure when the expanded bead changes. Two passes:
     once right after commit, and again when the card's grid
     expand/collapse transition ends, because the centers keep moving
     for the whole animation and the commit-time read captures
     start-of-transition geometry. progressRef keeps the async pass on
     live progress. Deps are intentionally [expandedBead] only. */
  useLayoutEffect(() => {
    const measure = () => measureBeadTop(progressRef.current);
    measure();
    const section = sectionRef.current;
    if (!section) return;
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "grid-template-rows") measure();
    };
    section.addEventListener("transitionend", onTransitionEnd);
    return () => section.removeEventListener("transitionend", onTransitionEnd);
  }, [expandedBead]);

  const { beadIndex, arrivalIdx } = beadStateFromProgress(progress);

  /* Contour Drift scale (balanced-package spec 2.2): window-quantized
     from the existing progress state, no new state or listener. */
  const ringWindow = Math.min(4, Math.floor(progress * 5));
  const ringScale = 1 + 0.04 * ringWindow;

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      aria-labelledby="manifesto-heading"
      className="dark-section"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #111111 0%, #0E1626 100%)",
        color: PAPER,
        fontFamily: DISPLAY,
        padding: "130px 24px",
      }}
    >
      <style>{REVEAL_CSS}</style>
      <div
        aria-hidden="true"
        className="journey-lantern-a"
        style={{
          background:
            "radial-gradient(circle, rgba(8, 89, 212, 0.40) 0%, rgba(8, 89, 212, 0.22) 30%, rgba(8, 89, 212, 0) 55%)",
        }}
      />
      <div
        aria-hidden="true"
        className="journey-lantern-b"
        style={{
          background:
            "radial-gradient(circle, rgba(8, 89, 212, 0.35) 0%, rgba(8, 89, 212, 0) 55%)",
        }}
      />
      <div
        aria-hidden="true"
        className="journey-lantern-c"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0) 60%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1160, margin: "0 auto" }}>
        <div className={`sec-slide from-right${inView ? " in" : ""}`}>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: LABEL,
            margin: "0 0 24px",
          }}
        >
          Journey
        </p>
        <h2
          id="manifesto-heading"
          className="mvM-reveal"
          style={{
            fontSize: "clamp(48px, 7vw, 72px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            fontWeight: 700,
            margin: "0 0 24px",
            maxWidth: 900,
            color: PAPER,
          }}
        >
          The journey so far.
        </h2>
        <p
          className="mvM-reveal"
          style={{
            fontSize: 18,
            lineHeight: 1.65,
            color: BODY,
            maxWidth: 680,
            margin: "0 0 80px",
            transitionDelay: "80ms",
          }}
        >
          From starting medicine at UII in 2022 to the clinic and a Seoul congress poster in 2026.
        </p>
        </div>
        <div
          className="journey-grid"
          style={{ "--journey-progress": progress } as CSSProperties}
        >
          <svg
            aria-hidden="true"
            className="journey-rings"
            width={2400}
            height={2400}
            viewBox="0 0 2400 2400"
            style={{
              transform: `translate(-50%, -50%) scale(${ringScale})`,
            }}
          >
            {[300, 400, 500, 600, 700, 850, 1000].map((r, idx) => (
              <circle
                key={r}
                className={`journey-ring-${idx}`}
                cx={1200}
                cy={1200}
                r={r}
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
          {STATIONS.map((_, i) => (
            <div
              key={`well-${i}`}
              aria-hidden="true"
              className="journey-well"
              style={{
                left: `calc(${i} * ((100% - 96px) / 5 + 24px))`,
                width: "calc((100% - 96px) / 5)",
                opacity: activeIdx === i ? 1 : 0.3,
              }}
            />
          ))}
          <div
            aria-hidden="true"
            className="journey-line"
            style={{ transform: `scaleX(${progress})` }}
          />
          <span
            aria-hidden="true"
            className="journey-bead journey-bead-desktop"
            style={{
              left: `calc(${beadIndex} * ((100% - 96px) / 5 + 24px) + (100% - 96px) / 10)`,
            }}
          />
          {beadTop !== null && (
            <span
              aria-hidden="true"
              className="journey-bead journey-bead-mobile"
              style={{ top: beadTop }}
            />
          )}
          {STATIONS.map((station, i) => {
            const onTop = i % 2 === 0;
            return (
              <Fragment key={station.year}>
                <div
                  aria-hidden="true"
                  className={
                    activeIdx === i
                      ? "journey-node journey-node-active"
                      : "journey-node"
                  }
                  style={{ gridColumn: i + 1 }}
                >
                  <span
                    aria-hidden="true"
                    className="journey-node-dot"
                    style={{ transitionDelay: `${300 + i * 150}ms` }}
                  />
                  {arrivalIdx === i && progress > 0 && (
                    <span
                      aria-hidden="true"
                      className="journey-bead-ring journey-bead-ring-desktop"
                    />
                  )}
                </div>
                <article
                  className={
                    activeIdx === i
                      ? "mvM-reveal journey-station journey-station-active"
                      : "mvM-reveal journey-station"
                  }
                  style={{
                    gridColumn: i + 1,
                    gridRow: onTop ? 1 : 3,
                    alignSelf: onTop ? "end" : "start",
                    paddingBottom: onTop ? 28 : 0,
                    paddingTop: onTop ? 0 : 28,
                    minWidth: 0,
                    transitionDelay: `${200 + i * 150}ms`,
                  }}
                >
                  {activeIdx === i && (
                    <div aria-hidden="true" className="journey-glow" />
                  )}
                  <span
                    aria-hidden="true"
                    className="journey-node-dot journey-node-mobile"
                    style={{ transitionDelay: `${300 + i * 150}ms` }}
                  />
                  {arrivalIdx === i && progress > 0 && (
                    <span
                      aria-hidden="true"
                      className="journey-bead-ring journey-bead-ring-mobile"
                    />
                  )}
                  <div
                    className={
                      onTop
                        ? "journey-step journey-step-top"
                        : "journey-step journey-step-bottom"
                    }
                  >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      margin: "0 0 12px",
                    }}
                  >
                    <p
                      className={
                        arrivalIdx === i
                          ? "journey-year journey-year-pop"
                          : "journey-year"
                      }
                      style={{
                        fontFamily: MONO,
                        fontSize: "clamp(28px, 3vw, 40px)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: PAPER,
                        margin: 0,
                      }}
                    >
                      {station.year}
                    </p>
                    <JourneySeal index={i} active={activeIdx === i} />
                  </div>
                  <h3
                    style={{
                      fontSize: "clamp(22px, 2vw, 28px)",
                      lineHeight: 1.15,
                      letterSpacing: "-0.01em",
                      fontWeight: 700,
                      color: PAPER,
                      margin: "0 0 12px",
                    }}
                  >
                    {station.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 16,
                      lineHeight: 1.65,
                      color: BODY,
                      margin: 0,
                    }}
                  >
                    {station.detail}
                  </p>
                  {station.dots.length > 0 &&
                    (BEAD_YEARS.has(station.year) ? (
                      <BeadExpand
                        items={station.dots.map((dot, k) => ({
                          id: `${station.year}-${k}`,
                          title: dot,
                          quartile: BEAD_QUARTILES[dot],
                        }))}
                        year={station.year}
                        expanded={expandedBead === station.year}
                        onToggle={() => toggleBead(station.year)}
                        hintText={BEAD_HINT_TEXT}
                        hintVisible={!seenBeads.has(station.year)}
                        hintSide={station.year === "2026" ? "left" : "right"}
                        hintDelay={
                          station.year === "2024"
                            ? "0s"
                            : station.year === "2025"
                              ? "0.7s"
                              : "1.4s"
                        }
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          marginTop: 16,
                        }}
                      >
                        {station.dots.map((dot) => (
                          <span
                            key={dot}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              fontSize: 14,
                              lineHeight: 1.6,
                              color: BODY,
                            }}
                          >
                            <span
                              aria-hidden="true"
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: BLUE,
                                flexShrink: 0,
                              }}
                            />
                            {dot}
                          </span>
                        ))}
                      </div>
                    ))}
                  {station.dotCount && (
                    <p
                      style={{
                        fontFamily: MONO,
                        fontSize: 12,
                        letterSpacing: "0.04em",
                        color: LABEL,
                        margin: "10px 0 0",
                      }}
                    >
                      {station.dotCount}
                    </p>
                  )}
                  <JourneyInstrument index={i} active={activeIdx === i} />
                  </div>
                </article>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
