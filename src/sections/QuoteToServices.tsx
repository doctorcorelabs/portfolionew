/**
 * QuoteToServices.tsx - scroll-driven dot-field transition zone between
 * the white Quote section and the black Services section (#010101).
 *
 * The zone is a plain block of 100svh plus a per-breakpoint scroll
 * runway (689px mobile, 842px tablet, 1071px desktop). A sticky
 * viewport-height child pins while the runway scrolls; progress
 * 0..1 is a pure rAF-throttled function of scroll position through
 * the runway, so scrolling back reverses every phase exactly.
 *
 * The sticky is sized to the LARGE viewport (lvh, stable) rather than
 * svh, so on iPhone Safari the zone always covers the full visual
 * viewport whether the toolbar is shown or hidden. Progress travel
 * is measured from the sticky's live height, so pin timing stays
 * exact in both toolbar states.
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
  height: calc(100svh + 1071px);
  background: #FFFFFF;
  margin-bottom: -2px;
  width: calc(100% + 2px);
}
.q2s-sticky {
  position: sticky;
  top: -1px;
  height: calc(100svh + 2px);
  height: calc(100lvh + 2px);
  overflow: hidden;
  background: #FFFFFF;
}
@media (max-width: 1100px) {
  .q2s-wrap {
    height: calc(100svh + 842px);
  }
}
@media (max-width: 720px) {
  .q2s-wrap {
    height: calc(100svh + 689px);
  }
}
`;

export default function QuoteToServices(): ReactElement | null {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
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
     IntersectionObserver on the wrap. Travel is measured from live
     layout, not from window.innerHeight: the pin distance is exactly
     wrapH - stickyH + 1, because the sticky (top: -1px) unsticks when
     its bottom edge meets the wrap's bottom edge. This keeps pin
     timing exact on iPhone Safari whether the toolbar is shown or
     hidden (the visual viewport changes size, but the measured
     heights do not desync). Touch momentum works because progress
     derives from actual scroll position. */
  useEffect(() => {
    if (reducedMotion) return;
    const wrap = wrapRef.current;
    const sticky = stickyRef.current;
    if (!wrap || !sticky) return;
    let ticking = false;
    let active = false;

    const compute = () => {
      ticking = false;
      if (!active) return;
      const rect = wrap.getBoundingClientRect();
      const stickyH = sticky.getBoundingClientRect().height;
      const travel = rect.height - stickyH + 1;
      const p = travel > 0 ? clamp01(-rect.top / travel) : 0;
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
        <div ref={stickyRef} className="q2s-sticky">
          <QuoteInkTransition progress={progress} />
        </div>
      </div>
    </>
  );
}
