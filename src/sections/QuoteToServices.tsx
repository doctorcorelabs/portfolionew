/**
 * QuoteToServices.tsx - scroll-driven ink transition zone between the
 * white Quote section and the black Services section (#010101).
 *
 * The zone is a plain block of 100svh plus a per-breakpoint scroll
 * runway (900px mobile, 1100px tablet, 1400px desktop). A sticky
 * viewport-height child pins while the runway scrolls; progress
 * 0..1 is a pure rAF-throttled function of scroll position through
 * the runway, so scrolling back reverses every phase exactly.
 *
 * The canvas renderer (QuoteInkTransition) is a pure function of the
 * progress prop; this wrapper owns pinning, progress mapping, the
 * reduced-motion gate, and seed plumbing. No z-index anywhere, no
 * stacking context, no scroll-jacking, no new dependencies.
 *
 * Reduced motion: renders nothing at all, so the page keeps the
 * hard cut with zero layout difference versus before.
 */

import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { QuoteInkTransition } from "./QuoteInkTransition/QuoteInkTransition";
import { getSeed } from "../lib/transitionSeed";

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

interface Seed {
  x: number | null;
  y: number | null;
}

const ZONE_STYLE = `
.q2s-wrap {
  position: relative;
  height: calc(100svh + 1400px);
  background: #FFFFFF;
}
.q2s-sticky {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
  background: #FFFFFF;
}
@media (max-width: 1100px) {
  .q2s-wrap {
    height: calc(100svh + 1100px);
  }
}
@media (max-width: 720px) {
  .q2s-wrap {
    height: calc(100svh + 900px);
  }
}
`;

export default function QuoteToServices(): ReactElement | null {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [seed, setSeedState] = useState<Seed>(() => getSeed());
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  /* Reduced-motion media listener, mirroring Quote's pattern, so a
     mid-session preference change adds or removes the zone live. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    setReducedMotion(media.matches);
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    return undefined;
  }, []);

  /* Scroll progress: one passive scroll listener plus resize,
     rAF-throttled with a ticking flag, gated by an
     IntersectionObserver on the wrap. progress = clamp01(-rect.top
     / ZONE) with ZONE = rect.height - innerHeight, copied from the
     proven Quote pattern. Touch momentum works because progress
     derives from actual scroll position. */
  useEffect(() => {
    if (reducedMotion) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    let ticking = false;
    let active = false;

    const readSeed = () => {
      const next = getSeed();
      setSeedState((prev) =>
        prev.x === next.x && prev.y === next.y ? prev : next,
      );
    };

    const compute = () => {
      ticking = false;
      if (!active) return;
      const rect = wrap.getBoundingClientRect();
      const zone = rect.height - window.innerHeight;
      const p = zone > 0 ? clamp01(-rect.top / zone) : 0;
      setProgress((prev) => (prev === p ? prev : p));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        active = entries.some((e) => e.isIntersecting);
        /* The V6 seed may arrive late (Quote fires it at progress
           1.0, potentially after the zone is already visible), so
           re-read on every activation; the canvas applies seed
           changes live and stays a pure function of its props. */
        readSeed();
        onScroll();
      },
      { threshold: 0 },
    );
    io.observe(wrap);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <>
      <style>{ZONE_STYLE}</style>
      <div ref={wrapRef} className="q2s-wrap" aria-hidden="true">
        <div className="q2s-sticky">
          <QuoteInkTransition
            progress={progress}
            seedX={seed.x}
            seedY={seed.y}
          />
        </div>
      </div>
    </>
  );
}
