/**
 * Services.tsx - Onlines home-servicios, translated for DaivanLabs.
 * Dark section (#010101, white text) with a 3-column grid on desktop
 * and a single column on mobile. Every column is a fact from the old
 * site and CV only: no Onlines service copy, no client names, no
 * invented DOI, journal, or numbers.
 *
 * Card treatment (measured from the reference, docs/deep/03):
 * each column is a tall FLAT accent-blue card (#0859D4, radius
 * 10px) with a CSS halftone dot layer at 50 percent opacity in
 * multiply blend mode over the flat fill - not a gradient, and the
 * texture is a slow seamless pan: the halftone layer shifts one
 * full 6px tile over 24s on a linear infinite loop, so the loop
 * restarts invisibly. This background-position animation is the
 * one allowed exception to the no-background-animation rule, and
 * it is off under prefers-reduced-motion. Four 10px white corner
 * ticks echo the hero selection handles: faint at rest, full
 * opacity on card hover/focus. A dotted rule of 1px
 * square tiles sits under each title line (repeating gradient on
 * an inline title span). A transparent white-outline pill button
 * sits at the card bottom-left and stays invisible until its card
 * is hovered or focused; on reveal only its opacity/visibility
 * changes over 0.3s, its fill never changes. There is no card lift
 * and no shadow change on hover. Pill destinations are existing
 * internal pages only: Research to /research, Teaching and
 * mentoring to /experience; Tools has no pill.
 *
 * Motion (scoped to this file, scroll-triggered, runs once):
 * the three cards stagger-reveal on scroll (0.6s rise from 40px),
 * each top hairline draws left-to-right, then the card title and
 * lines fade up in sequence. Fully static under
 * prefers-reduced-motion.
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const DISPLAY =
  "'Inter', 'Inter Display', Arial, -apple-system, 'Segoe UI', sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const COLUMNS: {
  number: string;
  title: string;
  lines: string[];
  /** Absent on the Tools card: the owner asked for no pill there. */
  href?: string;
  pillLabel?: string;
}[] = [
  {
    number: "01",
    title: "Research",
    lines: [
      "Systematic reviews of clinical questions, from PCOS and cancer to the gut microbiome and endocrine disruption.",
      "Pharmacovigilance: disproportionality and time-to-onset analysis of FAERS reports.",
      "In silico drug discovery, with collaborators, for tuberculosis, breast cancer, obesity, and lung cancer.",
    ],
    href: "/research",
    pillLabel: "View research",
  },
  {
    number: "02",
    title: "Tools",
    lines: [
      "DaivanLabs, founded June 2025. Code for Cure: code, healthcare tools, connections.",
    ],
  },
  {
    number: "03",
    title: "Teaching and mentoring",
    lines: [
      "Speaker and mentor at KampusInovatif.id, September 2024 to February 2025.",
      "Scientific division, SMART FK UII, including scientific essay mentoring.",
      "Mentor for international competition delegation teams at the Faculty of Medicine, Universitas Islam Indonesia, and for Beasiswa Unggulan and Mahasiswa Berprestasi (Pilmapres) programs.",
    ],
    href: "/experience",
    pillLabel: "View experience",
  },
];

const TRAVELERS = ["REVIEW", "CODE", "MENTOR"];

const MOTIFS = [
  <svg key="funnel" width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="6" cy="6" r="1.5" fill="#FFFFFF" />
    <circle cx="13" cy="6" r="1.5" fill="#FFFFFF" />
    <circle cx="20" cy="6" r="1.5" fill="#FFFFFF" />
    <circle cx="27" cy="6" r="1.5" fill="#FFFFFF" />
    <circle cx="34" cy="6" r="1.5" fill="#FFFFFF" />
    <circle cx="9.5" cy="13" r="1.5" fill="#FFFFFF" />
    <circle cx="16.5" cy="13" r="1.5" fill="#FFFFFF" />
    <circle cx="23.5" cy="13" r="1.5" fill="#FFFFFF" />
    <circle cx="30.5" cy="13" r="1.5" fill="#FFFFFF" />
    <circle cx="13" cy="20" r="1.5" fill="#FFFFFF" />
    <circle cx="20" cy="20" r="1.5" fill="#FFFFFF" />
    <circle cx="27" cy="20" r="1.5" fill="#FFFFFF" />
    <circle cx="16.5" cy="27" r="1.5" fill="#FFFFFF" />
    <circle cx="23.5" cy="27" r="1.5" fill="#FFFFFF" />
    <circle cx="20" cy="34" r="1.5" fill="#FFFFFF" />
  </svg>,
  <svg key="brackets" width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
    <path d="M14 10 L8 20 L14 30" stroke="#FFFFFF" strokeWidth="1" fill="none" />
    <path d="M26 10 L32 20 L26 30" stroke="#FFFFFF" strokeWidth="1" fill="none" />
    <path d="M20 16 V24 M16 20 H24" stroke="#FFFFFF" strokeWidth="1" fill="none" />
  </svg>,
  <svg key="arcs" width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="12" cy="20" r="2" fill="#FFFFFF" />
    <path d="M18 14 A 8.5 8.5 0 0 1 18 26" stroke="#FFFFFF" strokeWidth="1" fill="none" />
    <path d="M24 8 A 17 17 0 0 1 24 32" stroke="#FFFFFF" strokeWidth="1" fill="none" />
  </svg>,
];

export default function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const chipRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [started, setStarted] = useState(false);
  const [parked, setParked] = useState<Array<{ x: number; y: number }> | null>(null);

  type TravelerGeom = {
    docks: Array<{ x: number; y: number }>;
    chipW: number[];
    chipH: number[];
    gridTop: number;
    stacked: boolean;
    sectionW: number;
    sectionH: number;
    containerLeft: number;
    containerRight: number;
    cardTops: number[];
    cardBottoms: number[];
  };
  type TravelerChipState = {
    x: number;
    y: number;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    legStart: number;
    legDur: number;
    dwellUntil: number;
    phase: "dwell" | "leg" | "dock";
    isDockTarget: boolean;
  };
  const simRef = useRef<{
    geom: TravelerGeom | null;
    chips: TravelerChipState[];
    dockedChip: number | null;
    running: boolean;
    clock: number;
    lastTs: number | null;
    raf: number | null;
    startedFlag: boolean;
    startTimeout: number | null;
    resizeTimeout: number | null;
    stackedMode: boolean | null;
  }>({
    geom: null,
    chips: [],
    dockedChip: null,
    running: false,
    clock: 0,
    lastTs: null,
    raf: null,
    startedFlag: false,
    startTimeout: null,
    resizeTimeout: null,
    stackedMode: null,
  });
  const visibleRef = useRef(false);
  const reducedRef = useRef(false);
  const SPEEDS = [70, 90, 110];
  const STAGGER = [0, 350, 700];

  const easeBezier = (p: number): number => {
    const x1 = 0.22;
    const y1 = 1;
    const x2 = 0.36;
    const y2 = 1;
    const sampleX = (t: number) =>
      3 * x1 * t * (1 - t) * (1 - t) + 3 * x2 * t * t * (1 - t) + t * t * t;
    const sampleY = (t: number) =>
      3 * y1 * t * (1 - t) * (1 - t) + 3 * y2 * t * t * (1 - t) + t * t * t;
    const sampleDX = (t: number) =>
      3 * (1 - t) * (1 - t) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t * t * (1 - x2);
    let t = p;
    for (let i = 0; i < 4; i++) {
      const dx = sampleDX(t);
      if (Math.abs(dx) < 1e-6) break;
      t -= (sampleX(t) - p) / dx;
    }
    if (t < 0 || t > 1) {
      let lo = 0;
      let hi = 1;
      while (hi - lo > 1e-4) {
        const mid = (lo + hi) / 2;
        if (sampleX(mid) < p) lo = mid;
        else hi = mid;
      }
      t = (lo + hi) / 2;
    }
    return sampleY(t);
  };

  const measure = (): TravelerGeom | null => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const container = containerRef.current;
    if (!section || !grid || !container) return null;
    const sRect = section.getBoundingClientRect();
    const gRect = grid.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    const cardRects: DOMRect[] = [];
    for (const el of cardRefs.current) {
      if (!el) return null;
      cardRects.push(el.getBoundingClientRect());
    }
    if (cardRects.length !== 3) return null;
    const chipW: number[] = [];
    const chipH: number[] = [];
    for (const el of chipRefs.current) {
      const r = el?.getBoundingClientRect();
      chipW.push(r ? r.width : 60);
      chipH.push(r ? r.height : 28);
    }
    if (chipW.length !== 3) return null;
    const stacked = window.innerWidth <= 1023;
    const gridTop = gRect.top - sRect.top;
    const docks = cardRects.map((cr, i) => {
      const cx = cr.left - sRect.left + cr.width / 2;
      const cy = !stacked
        ? gridTop - 40
        : i === 0
          ? gridTop - 40
          : cr.top - sRect.top - 22.5;
      return { x: cx - chipW[i] / 2, y: cy - chipH[i] / 2 };
    });
    return {
      docks,
      chipW,
      chipH,
      gridTop,
      stacked,
      sectionW: sRect.width,
      sectionH: sRect.height,
      containerLeft: cRect.left - sRect.left,
      containerRight: cRect.right - sRect.left,
      cardTops: cardRects.map((cr) => cr.top - sRect.top),
      cardBottoms: cardRects.map((cr) => cr.bottom - sRect.top),
    };
  };

  const boundsFor = (geom: TravelerGeom, i: number) => ({
    minX: 36,
    maxX: Math.max(36, geom.sectionW - geom.chipW[i] - 36),
    minY: 12,
    maxY: Math.max(12, geom.sectionH - geom.chipH[i] - 12),
  });

  const pickFree = (geom: TravelerGeom, i: number): { x: number; y: number } => {
    const b = boundsFor(geom, i);
    const w = geom.chipW[i];
    const h = geom.chipH[i];
    const clampPt = (x: number, y: number) => ({
      x: Math.min(Math.max(x, b.minX), b.maxX),
      y: Math.min(Math.max(y, b.minY), b.maxY),
    });
    const uniform = () =>
      clampPt(
        b.minX + Math.random() * Math.max(0, b.maxX - b.minX),
        b.minY + Math.random() * Math.max(0, b.maxY - b.minY),
      );
    const r = Math.random();
    if (r < 0.5) {
      const headBottom = geom.gridTop - h - 4;
      if (headBottom - b.minY > 8) {
        return clampPt(
          b.minX + Math.random() * Math.max(0, b.maxX - b.minX),
          b.minY + Math.random() * (headBottom - b.minY),
        );
      }
    } else if (r < 0.8) {
      if (!geom.stacked) {
        const bands: Array<[number, number]> = [];
        const leftEnd = geom.containerLeft - w - 4;
        if (leftEnd > b.minX) bands.push([b.minX, leftEnd]);
        const rightStart = geom.containerRight + 4;
        if (b.maxX > rightStart) bands.push([rightStart, b.maxX]);
        if (bands.length > 0) {
          const band = bands[Math.floor(Math.random() * bands.length)];
          return clampPt(
            band[0] + Math.random() * (band[1] - band[0]),
            b.minY + Math.random() * Math.max(0, b.maxY - b.minY),
          );
        }
      } else {
        const gaps: Array<[number, number]> = [];
        for (let j = 0; j < geom.cardBottoms.length - 1; j++) {
          const y0 = geom.cardBottoms[j] + 4;
          const y1 = geom.cardTops[j + 1] - h - 4;
          if (y1 > y0) gaps.push([y0, y1]);
        }
        if (gaps.length > 0) {
          const gap = gaps[Math.floor(Math.random() * gaps.length)];
          return clampPt(
            b.minX + Math.random() * Math.max(0, b.maxX - b.minX),
            gap[0] + Math.random() * (gap[1] - gap[0]),
          );
        }
      }
    }
    return uniform();
  };

  const pickTarget = (geom: TravelerGeom, i: number): { x: number; y: number; dock: boolean } => {
    const sim = simRef.current;
    if (sim.dockedChip === null && Math.random() < 0.4) {
      // Reserve the dock at pick time: until this reservation clears,
      // no other chip may pick a dock target, so two chips can never
      // be en route to their docks at once.
      sim.dockedChip = i;
      return { x: geom.docks[i].x, y: geom.docks[i].y, dock: true };
    }
    return { ...pickFree(geom, i), dock: false };
  };

  const startLeg = (i: number, now: number) => {
    const sim = simRef.current;
    const geom = sim.geom;
    if (!geom) return;
    const chip = sim.chips[i];
    if (!chip) return;
    const target = pickTarget(geom, i);
    const dist = Math.hypot(target.x - chip.x, target.y - chip.y);
    chip.fromX = chip.x;
    chip.fromY = chip.y;
    chip.toX = target.x;
    chip.toY = target.y;
    chip.legStart = now;
    chip.legDur = Math.max(100, (dist / SPEEDS[i]) * 1000);
    chip.phase = "leg";
    chip.isDockTarget = target.dock;
  };

  const updateChips = (now: number) => {
    const sim = simRef.current;
    if (!sim.geom) return;
    sim.chips.forEach((chip, i) => {
      if (chip.phase === "leg") {
        const p = Math.min(1, Math.max(0, (now - chip.legStart) / chip.legDur));
        const e = easeBezier(p);
        chip.x = chip.fromX + (chip.toX - chip.fromX) * e;
        chip.y = chip.fromY + (chip.toY - chip.fromY) * e;
        if (p >= 1) {
          if (chip.isDockTarget && sim.dockedChip === i) {
            sim.dockedChip = i;
            const card = cardRefs.current[i];
            if (card) card.classList.add("svc-docked");
            chip.phase = "dock";
            chip.dwellUntil = now + 900;
          } else {
            chip.phase = "dwell";
            chip.dwellUntil = now + 150 + Math.random() * 450;
          }
        }
      } else if (now >= chip.dwellUntil) {
        if (chip.phase === "dock") {
          const card = cardRefs.current[i];
          if (card) card.classList.remove("svc-docked");
          // Clear only if this chip still owns the reservation, so an
          // expiry never admits a new dock while another chip is lit.
          if (sim.dockedChip === i) sim.dockedChip = null;
        }
        startLeg(i, now);
      }
      const el = chipRefs.current[i];
      if (el) el.style.transform = `translate3d(${chip.x}px, ${chip.y}px, 0)`;
    });
  };

  const loopTick = (ts: number) => {
    const sim = simRef.current;
    if (sim.raf === null) return;
    if (sim.lastTs !== null) {
      sim.clock += ts - sim.lastTs;
      updateChips(sim.clock);
    }
    sim.lastTs = ts;
    sim.raf = requestAnimationFrame(loopTick);
  };

  const startRaf = () => {
    const sim = simRef.current;
    if (sim.raf !== null) return;
    sim.lastTs = null;
    sim.raf = requestAnimationFrame(loopTick);
  };

  const stopRaf = () => {
    const sim = simRef.current;
    if (sim.raf !== null) cancelAnimationFrame(sim.raf);
    sim.raf = null;
    sim.lastTs = null;
  };

  const startLoop = () => {
    const sim = simRef.current;
    if (sim.startedFlag) return;
    const geom = sim.geom ?? measure();
    if (!geom) return;
    sim.geom = geom;
    sim.startedFlag = true;
    setStarted(true);
    sim.chips = geom.docks.map((d, i) => ({
      x: d.x,
      y: d.y,
      fromX: d.x,
      fromY: d.y,
      toX: d.x,
      toY: d.y,
      legStart: 0,
      legDur: 100,
      dwellUntil: STAGGER[i],
      phase: "dwell",
      isDockTarget: false,
    }));
    sim.chips.forEach((chip, i) => {
      const el = chipRefs.current[i];
      if (el) el.style.transform = `translate3d(${chip.x}px, ${chip.y}px, 0)`;
    });
    if (sim.running) startRaf();
  };

  const armStart = () => {
    const sim = simRef.current;
    if (sim.startedFlag || sim.startTimeout !== null || reducedRef.current) return;
    sim.startTimeout = window.setTimeout(() => {
      sim.startTimeout = null;
      if (!sim.running) return;
      startLoop();
    }, 1600);
  };

  const applyMeasure = (mode: "mount" | "resize") => {
    const geom = measure();
    if (!geom) return;
    const sim = simRef.current;
    const prevStacked = sim.stackedMode;
    sim.geom = geom;
    sim.stackedMode = geom.stacked;
    if (reducedRef.current) {
      setParked(geom.docks);
      return;
    }
    if (!sim.startedFlag) {
      geom.docks.forEach((d, i) => {
        const el = chipRefs.current[i];
        if (el) el.style.transform = `translate3d(${d.x}px, ${d.y}px, 0)`;
      });
      return;
    }
    if (prevStacked !== null && prevStacked !== geom.stacked) {
      sim.dockedChip = null;
      cardRefs.current.forEach((card) => {
        if (card) card.classList.remove("svc-docked");
      });
      sim.chips = geom.docks.map((d, i) => ({
        x: d.x,
        y: d.y,
        fromX: d.x,
        fromY: d.y,
        toX: d.x,
        toY: d.y,
        legStart: 0,
        legDur: 100,
        dwellUntil: sim.clock + STAGGER[i],
        phase: "dwell",
        isDockTarget: false,
      }));
      sim.chips.forEach((chip, i) => {
        const el = chipRefs.current[i];
        if (el) el.style.transform = `translate3d(${chip.x}px, ${chip.y}px, 0)`;
      });
    } else if (mode === "resize") {
      sim.chips.forEach((chip, i) => {
        const b = boundsFor(geom, i);
        chip.x = Math.min(Math.max(chip.x, b.minX), b.maxX);
        chip.y = Math.min(Math.max(chip.y, b.minY), b.maxY);
        const el = chipRefs.current[i];
        if (el) el.style.transform = `translate3d(${chip.x}px, ${chip.y}px, 0)`;
      });
    }
  };

  useEffect(() => {
    const rm =
      typeof window !== "undefined" &&
      typeof window.matchMedia !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedRef.current = rm;
    setReducedMotion(rm);
  }, []);

  useEffect(() => {
    visibleRef.current = visible;
    if (visible && !reducedRef.current) armStart();
  }, [visible]);

  useEffect(() => {
    const sim = simRef.current;
    const onResize = () => {
      if (sim.resizeTimeout !== null) window.clearTimeout(sim.resizeTimeout);
      sim.resizeTimeout = window.setTimeout(() => {
        sim.resizeTimeout = null;
        applyMeasure("resize");
      }, 150);
    };
    window.addEventListener("resize", onResize);
    if (reducedMotion) {
      applyMeasure("mount");
      return () => {
        window.removeEventListener("resize", onResize);
        if (sim.resizeTimeout !== null) window.clearTimeout(sim.resizeTimeout);
      };
    }
    applyMeasure("mount");
    const section = sectionRef.current;
    let observer: IntersectionObserver | null = null;
    if (section && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          const inView = entries[0].isIntersecting;
          sim.running = inView;
          if (inView) {
            if (sim.startedFlag) startRaf();
            else if (visibleRef.current) armStart();
          } else {
            stopRaf();
          }
        },
        { threshold: 0.1 },
      );
      observer.observe(section);
    } else {
      sim.running = true;
      if (visibleRef.current) armStart();
    }
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", onResize);
      stopRaf();
      if (sim.startTimeout !== null) window.clearTimeout(sim.startTimeout);
      if (sim.resizeTimeout !== null) window.clearTimeout(sim.resizeTimeout);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="services-heading"
      className={visible ? "svc-anim svc-visible" : "svc-anim"}
      style={{
        position: "relative",
        background: "#010101",
        color: "#FFFFFF",
        fontFamily: DISPLAY,
        padding: "130px 24px",
      }}
    >
      <style>{`
        .svc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          align-items: stretch;
        }
        @media (max-width: 1400px) {
          .svc-card {
            min-height: 470px;
          }
        }
        @media (max-width: 1023px) {
          .svc-grid {
            grid-template-columns: 1fr;
            gap: 45px;
          }
          .svc-card {
            min-height: 350px;
          }
          .svc-card-title {
            font-size: 28px;
          }
        }
        .svc-card {
          display: flex;
          flex-direction: column;
          min-height: 520px;
          height: 100%;
          box-sizing: border-box;
          padding: 32px 32px 36px;
          border-radius: 10px;
          color: #FFFFFF;
          background: #0859D4;
        }
        /* Halftone texture over the flat fill: 1px dots on a 6px
           tile, 50 percent opacity, multiply blend. It sits above
           the background but below the text (children are raised
           with z-index), so the text stays clean. Active motion:
           the layer pans exactly one full tile (0 0 to 6px 6px)
           over 24s linear infinite, so the loop is seamless.
           This is the one allowed background-position exception. */
        .svc-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 10px;
          background-image: radial-gradient(circle, #000000 1px, transparent 1.5px);
          background-size: 6px 6px;
          opacity: 0.5;
          mix-blend-mode: multiply;
          pointer-events: none;
          animation: svc-pan 24s linear infinite;
          transition: opacity 0.6s ease;
        }
        .svc-card > * {
          position: relative;
          z-index: 1;
        }
        /* Hero-frame corner ticks: 10px white squares, fully
           inside the card corners, faint at rest, full opacity on
           card hover/focus-within. Never intercept pointer events.
           Defined after the child rule above so absolute wins. */
        .svc-tick {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #FFFFFF;
          opacity: 0.35;
          pointer-events: none;
          z-index: 2;
          transition: opacity 0.3s ease;
        }
        .svc-card:hover .svc-tick,
        .svc-card:focus-within .svc-tick {
          opacity: 1;
        }
        .svc-travelers {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .svc-chip {
          position: absolute;
          left: 0;
          top: 0;
          display: inline-block;
          white-space: nowrap;
          font-family: ${MONO};
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.6);
          background: rgba(1, 1, 1, 0.5);
          padding: 6px 10px;
          border-radius: 0;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .svc-chip.svc-chip-on {
          opacity: 1;
        }
        @media (max-width: 1023px) {
          .svc-chip {
            padding: 5px 9px;
          }
        }
        .svc-motif {
          position: absolute;
          top: 32px;
          right: 32px;
          width: 40px;
          height: 40px;
          pointer-events: none;
          z-index: 2;
          opacity: 0.35;
          transition: opacity 0.6s ease;
        }
        .svc-card.svc-docked .svc-motif {
          opacity: 1;
          transition: opacity 0.4s ease-out;
        }
        .svc-card.svc-docked::after {
          opacity: 0.65;
          transition: opacity 0.4s ease;
        }
        .svc-card.svc-docked .svc-tick {
          opacity: 1;
          transition: opacity 0.4s ease-out;
        }
        /* Dotted title rule: 1px square tiles from a repeating
           gradient, applied to an inline span so a wrapped title
           gets one rule per line. */
        .svc-card-title {
          font-size: 36px;
          /* Explicit light color: the global h1-h6 rule forces dark
             #1D1D1F and beats the card's inherited white. */
          color: #FFFFFF;
        }
        .svc-dotted-title {
          background-image: repeating-linear-gradient(to right, rgba(255, 255, 255, 0.9) 0 1px, transparent 1px 4px);
          background-size: 4px 1px;
          background-repeat: repeat-x;
          background-position: 0 100%;
          padding-bottom: 6px;
        }
        .svc-pill {
          align-self: flex-start;
          margin-top: auto;
          padding-top: 48px;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .svc-pill a {
          display: inline-block;
          padding: 10px 22px;
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 999px;
          background: transparent;
          color: #FFFFFF;
          font-family: ${MONO};
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
        }
        .svc-card:hover .svc-pill,
        .svc-card:focus-within .svc-pill {
          opacity: 1;
          visibility: visible;
        }
        /* Touch has no hover, and a hidden link cannot receive
           focus, so the pill must be visible on touch devices. */
        @media (hover: none) {
          .svc-pill {
            opacity: 1;
            visibility: visible;
          }
        }
        .svc-pill a:focus-visible {
          outline: 2px solid #FFFFFF;
          outline-offset: 3px;
        }
        .svc-anim .svc-head { opacity: 0; transform: translateY(20px); }
        .svc-anim .svc-col { opacity: 0; transform: translateY(40px); }
        .svc-anim .svc-title { opacity: 0; transform: translateY(14px); }
        .svc-anim .svc-line { opacity: 0; transform: translateY(14px); }
        .svc-anim.svc-visible .svc-head {
          animation: svc-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0s forwards;
        }
        .svc-anim.svc-visible .svc-col {
          animation: svc-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .svc-anim.svc-visible .svc-title {
          animation: svc-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .svc-anim.svc-visible .svc-line {
          animation: svc-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .svc-hairline {
          position: absolute;
          top: 0;
          left: 0;
          height: 1px;
          width: 0;
          background: rgba(255, 255, 255, 0.35);
        }
        .svc-anim.svc-visible .svc-hairline {
          animation: svc-draw 0.8s ease forwards;
        }
        @keyframes svc-rise {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes svc-pan {
          from { background-position: 0 0; }
          to { background-position: 6px 6px; }
        }
        @keyframes svc-draw {
          to { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .svc-anim .svc-head,
          .svc-anim .svc-col,
          .svc-anim .svc-title,
          .svc-anim .svc-line {
            opacity: 1;
            transform: none;
            animation: none;
          }
          .svc-hairline {
            width: 100%;
            animation: none;
          }
          .svc-pill {
            transition: none;
          }
          .svc-tick {
            opacity: 1;
            transition: none;
          }
          .svc-card::after {
            animation: none;
          }
          .svc-chip {
            animation: none;
          }
          .svc-motif {
            opacity: 1;
            transition: none;
          }
          .svc-card.svc-docked::after {
            opacity: 0.5;
          }
        }
      `}</style>
      <div className="svc-travelers" aria-hidden="true">
        {TRAVELERS.map((label, i) => {
          const pos = parked && parked[i] ? parked[i] : { x: 0, y: 0 };
          return (
            <span
              key={label}
              ref={(el) => {
                chipRefs.current[i] = el;
              }}
              className={`svc-chip${started && !reducedMotion ? " svc-chip-on" : ""}`}
              data-chip={label}
              style={
                reducedMotion && parked
                  ? {
                      transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
                      opacity: 1,
                      transition: "none",
                    }
                  : undefined
              }
            >
              {label}
            </span>
          );
        })}
      </div>
      <div style={{ maxWidth: 1160, margin: "0 auto" }} ref={containerRef}>
        <div className={visible ? "sec-slide from-left in" : "sec-slide from-left"}>
        <p
          className="svc-head"
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#98989C",
            margin: "0 0 16px",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              background: "#0859D4",
              marginRight: 10,
              verticalAlign: "middle",
            }}
          />
          What I do
        </p>
        <h2
          id="services-heading"
          className="svc-head"
          style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            fontWeight: 700,
            margin: "0 0 80px",
            /* Explicit: same global h2 trap as Manifesto - the
               global dark title color beats section inheritance. */
            color: "#FFFFFF",
          }}
        >
          Three ways of working.
        </h2>
        </div>
        <div className="svc-grid" ref={gridRef}>
          {COLUMNS.map((column, columnIndex) => {
            const base = 0.1 + columnIndex * 0.15;
            return (
              <div
                key={column.number}
                ref={(el) => {
                  cardRefs.current[columnIndex] = el;
                }}
                className="svc-col svc-card"
                style={{
                  position: "relative",
                  animationDelay: `${base}s`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="svc-hairline"
                  style={{ animationDelay: `${base}s` }}
                />
                <span aria-hidden="true" className="svc-tick" style={{ top: 10, left: 10 }} />
                <span aria-hidden="true" className="svc-tick" style={{ top: 10, right: 10 }} />
                <span aria-hidden="true" className="svc-tick" style={{ bottom: 10, left: 10 }} />
                <span aria-hidden="true" className="svc-tick" style={{ bottom: 10, right: 10 }} />
                <span aria-hidden="true" className="svc-motif">
                  {MOTIFS[columnIndex]}
                </span>
                <p
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.75)",
                    margin: "0 0 16px",
                  }}
                >
                  {column.number} / {column.title}
                </p>
                <h3
                  className="svc-title svc-card-title"
                  style={{
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    fontWeight: 700,
                    margin: "0 0 20px",
                    animationDelay: `${base + 0.15}s`,
                  }}
                >
                  <span className="svc-dotted-title">{column.title}</span>
                </h3>
                {column.lines.map((line, lineIndex) => (
                  <p
                    key={line}
                    className="svc-line"
                    style={{
                      fontSize: 17,
                      lineHeight: 1.65,
                      color: "rgba(255, 255, 255, 0.8)",
                      margin: "0 0 16px",
                      animationDelay: `${base + 0.3 + lineIndex * 0.1}s`,
                    }}
                  >
                    {line}
                  </p>
                ))}
                {column.href && column.pillLabel ? (
                  <div className="svc-pill">
                    <Link to={column.href} aria-label={column.pillLabel}>
                      View
                    </Link>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
