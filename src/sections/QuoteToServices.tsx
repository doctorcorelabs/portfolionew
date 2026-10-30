/**
 * QuoteToServices.tsx - scroll-driven dot-field transition zone between
 * the white Quote section and the black Services section (#010101).
 *
 * The zone is a plain block of 100svh plus a per-breakpoint scroll
 * runway (765px mobile, 935px tablet, 1190px desktop). A sticky
 * viewport-height child pins while the runway scrolls; progress
 * 0..1 is a pure rAF-throttled function of scroll position through
 * the runway, so scrolling back reverses every phase exactly.
 *
 * The canvas renderer (QuoteInkTransition) is a pure function of the
 * progress prop; this wrapper owns pinning, progress mapping, and
 * the reduced-motion gate. No z-index anywhere, no
 * stacking context, no scroll-jacking, no new dependencies.
 *
 * Reduced motion: renders nothing at all, so the page keeps the
 * hard cut with zero layout difference versus before.
 */

import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { QuoteInkTransition } from "./QuoteInkTransition/QuoteInkTransition";

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

const ZONE_STYLE = `
.q2s-wrap {
  position: relative;
  height: calc(100svh + 1190px);
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
    height: calc(100svh + 935px);
  }
}
@media (max-width: 720px) {
  .q2s-wrap {
    height: calc(100svh + 765px);
  }
}
`;

export default function QuoteToServices(): ReactElement | null {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
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
          <QuoteInkTransition progress={progress} />
        </div>
      </div>
    </>
  );
}
