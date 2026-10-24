/**
 * Quote.tsx - Onlines home-quote-block, translated for DaivanLabs.
 * Scroll-driven PINNED word-by-word paint, matching the reference
 * structure measured in docs/motion/02-onlines-visual-forensics.md
 * section 3 (the pinned quote findings):
 *
 * - Outer wrapper height: 100svh + 1875px of scroll runway + 240px of
 *   separation padding (120px top and bottom), i.e. 100svh + 2115px.
 *   On narrow screens (max-width 1023px) the reference drops to
 *   1125px of runway + 70px padding top and bottom, i.e. 100svh + 1265px.
 * - Inner child: position sticky, top 0, min-height 100svh with
 *   overflow visible, so the content stays pinned while the
 *   visitor scrolls through the runway and no second scrollbar
 *   appears (no inner scroll container anywhere in this file).
 * - The H1 claim is split into 20 word spans. Each word starts pale
 *   grey and flips to full ink as scroll progress advances, with a
 *   0.35s color transition per word. Progress maps to words over the
 *   first 90 percent of the runway: word i (0-indexed) paints when
 *   progress >= ((i + 1) / 20) * 0.9, so the last word lands at
 *   progress 0.9. Scrolling back up unpaints words in reverse.
 * - The mission line fades in only near the end of the runway:
 *   opacity 0 at progress <= 0.9, ramping linearly to 1 at progress 1.
 * - The dashed vertical rule draws in step with progress (its height
 *   is progress * 100 percent of the content block), the top square
 *   node sits at the rule start, and the bottom node travels with the
 *   rule tip.
 * - Wording and bold key phrases are exactly the v2 claim; words are
 *   plain inline spans, so on narrow screens they wrap normally and
 *   the mapping still works by word index.
 * - prefers-reduced-motion: the plain static quote renders instead
 *   (fully ink words, mission visible, no tall wrapper, no pinning),
 *   so content is never trapped behind scroll.
 */

import { useEffect, useRef, useState } from "react";

const INK = "#010101";
const GRAPHITE = "#3C3C38";
const MARGIN_GREY = "#6F6F68";
const PALE = "#D6D6D6";
const BLUE = "#0859D4";
const DISPLAY =
  "'Inter', 'Inter Display', Arial, -apple-system, 'Segoe UI', sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/** The H1 claim, split by word. bold marks the v2 bold key phrases. */
const WORDS: { text: string; bold: boolean }[] = [
  { text: "I", bold: false },
  { text: "am", bold: false },
  { text: "a", bold: false },
  { text: "medical", bold: false },
  { text: "student", bold: false },
  { text: "and", bold: false },
  { text: "researcher", bold: false },
  { text: "in", bold: false },
  { text: "Indonesia.", bold: false },
  { text: "I", bold: false },
  { text: "study", bold: false },
  { text: "health", bold: true },
  { text: "questions", bold: true },
  { text: "and", bold: false },
  { text: "build", bold: false },
  { text: "tools", bold: true },
  { text: "around", bold: false },
  { text: "them,", bold: false },
  { text: "through", bold: false },
  { text: "DaivanLabs.", bold: false },
];

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export default function Quote() {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const [cursorLit, setCursorLit] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

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

  useEffect(() => {
    if (reducedMotion) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = wrapper.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      setProgress(runway > 0 ? clamp01(-rect.top / runway) : 1);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  const missionOpacity = progress <= 0.9 ? 0 : (progress - 0.9) / 0.1;

  /* Dot-field entrance: both dot layers fade from opacity 0 to
     full over the first 10 percent of scroll progress, then stay
     full. The cursor-lit fade (instant on, 600ms out) is unchanged
     and multiplies on top of this entrance factor. */
  const dotEntrance = progress < 0.1 ? progress / 0.1 : 1;

  /* Dot field cursor plumbing, same geometry as Contact (14px
     pitch, 0.4px dots, 20 percent base, 44 percent lit, 350px field
     mask, 50px lit halo, 600ms fade-out). Coordinates are relative
     to the sticky child, which is the layer the dots live in. */
  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const node = stickyRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--qdot-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--qdot-y", `${event.clientY - rect.top}px`);
    setCursorLit(true);
  };

  const claim = (
    <h1
      id="quote-heading"
      style={{
        fontSize: "clamp(34px, 4.5vw, 64px)",
        lineHeight: 1.05,
        letterSpacing: "-0.02em",
        fontWeight: 700,
        margin: "0 0 32px",
        maxWidth: 960,
      }}
    >
      {WORDS.map((word, i) => {
        const painted =
          reducedMotion || progress >= ((i + 1) / WORDS.length) * 0.9;
        return (
          <span key={`w-${i}`}>
            <span
              style={{
                color: painted ? INK : PALE,
                /* Inactive words carry a light outline stroke, as
                   in the reference; the exact stroke color is
                   UNVERIFIED, so this is a subtle reading of it. */
                WebkitTextStroke: painted
                  ? undefined
                  : "1px rgba(1, 1, 1, 0.15)",
                fontWeight: word.bold ? 700 : undefined,
                transition: reducedMotion ? undefined : "color 0.35s",
              }}
            >
              {word.text}
            </span>
            {i < WORDS.length - 1 ? " " : ""}
          </span>
        );
      })}
    </h1>
  );

  const mission = (
    <p
      style={{
        fontSize: 18,
        lineHeight: 1.65,
        color: GRAPHITE,
        maxWidth: 640,
        margin: 0,
        opacity: reducedMotion ? 1 : missionOpacity,
        transform:
          reducedMotion || missionOpacity >= 1
            ? "none"
            : `translateY(${(1 - missionOpacity) * 14}px)`,
      }}
    >
      Founder, DaivanLabs.{" "}
      <span style={{ color: BLUE }}>Code for Cure:</span> code that becomes
      healthcare tools, and connections that carry them further, toward
      sustainable health systems for Indonesia.
    </p>
  );

  const rule = (drawn: number) => (
    <>
      {/* Dashed vertical rule, drawn in step with scroll progress. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 5,
          top: 0,
          bottom: 0,
          width: 0,
        }}
      >
        <div
          style={{
            height: `${drawn * 100}%`,
            borderLeft: "1px dashed rgba(18, 18, 19, 0.2)",
          }}
        />
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: -5,
          width: 10,
          height: 10,
          background: "#FFFFFF",
          border: "1px solid #98989C",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: `calc(${drawn * 100}% - 5px)`,
          width: 10,
          height: 10,
          background: "#FFFFFF",
          border: "1px solid #98989C",
        }}
      />
    </>
  );

  const body = (drawn: number) => (
    <div
      style={{
        maxWidth: 1160,
        margin: "0 auto",
        width: "100%",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ position: "relative", paddingLeft: 32 }}>
        {rule(drawn)}
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: MARGIN_GREY,
            margin: "0 0 24px",
          }}
        >
          DaivanLabs, in one sentence
        </p>
        {claim}
        {mission}
      </div>
    </div>
  );

  /* Reduced motion: plain static quote, no tall wrapper, no pinning. */
  if (reducedMotion) {
    return (
      <section
        aria-labelledby="quote-heading"
        style={{
          background: "#FFFFFF",
          color: INK,
          fontFamily: DISPLAY,
          padding: "130px 24px",
        }}
      >
        {body(1)}
      </section>
    );
  }

  /* Pinned scroll-driven quote. */
  return (
    <section
      ref={wrapperRef}
      aria-labelledby="quote-heading"
      className="q-pin-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setCursorLit(false)}
      style={{
        background: "#FFFFFF",
        color: INK,
        fontFamily: DISPLAY,
      }}
    >
      <style>{`
        .q-pin-wrap {
          height: calc(100svh + 1875px + 240px);
        }
        .q-pin-sticky {
          position: sticky;
          top: 0;
          /* min-height, not height, and no inner scrollbar: the
             old height + overflow-y auto pair rendered a second
             scrollbar beside the page scrollbar ("2 scroll") and
             trapped wheel scrolling inside the pinned section.
             Now the child grows past viewport height when needed
             and only the page scrollbar exists. */
          min-height: 100svh;
          display: flex;
          align-items: center;
          padding: 120px 24px;
          box-sizing: border-box;
          overflow: visible;
        }
        .q-dot-base,
        .q-dot-lit {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-size: 14px 14px;
          background-repeat: repeat;
          z-index: 0;
        }
        .q-dot-base {
          background-image: radial-gradient(circle, rgba(0, 0, 0, 0.2) 0.4px, transparent 0.5px);
          -webkit-mask-image: radial-gradient(circle 350px at var(--qdot-x, 50%) var(--qdot-y, 50%), rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
          mask-image: radial-gradient(circle 350px at var(--qdot-x, 50%) var(--qdot-y, 50%), rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
        }
        .q-dot-lit {
          background-image: radial-gradient(circle, rgba(0, 0, 0, 0.44) 0.4px, transparent 0.5px);
          -webkit-mask-image: radial-gradient(circle 50px at var(--qdot-x, 50%) var(--qdot-y, 50%), rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 100%);
          mask-image: radial-gradient(circle 50px at var(--qdot-x, 50%) var(--qdot-y, 50%), rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 100%);
        }
        /* Active layer: slow breathe on the dot-field base only
           (opacity 0.85 to 1, 8s ease-in-out infinite alternate).
           Words are untouched; the lit layer keeps its cursor-only
           behavior. The wrapper above carries the entrance fade,
           so this animation never fights it. */
        .q-dot-breathe {
          animation: q-dot-breathe 8s ease-in-out infinite alternate;
        }
        @keyframes q-dot-breathe {
          from { opacity: 0.85; }
          to { opacity: 1; }
        }
        @media (max-width: 1023px) {
          .q-pin-wrap {
            height: calc(100svh + 1125px + 140px);
          }
          .q-pin-sticky {
            padding: 70px 24px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .q-pin-wrap {
            height: auto;
          }
          .q-pin-sticky {
            position: static;
            height: auto;
            min-height: auto;
            overflow: visible;
          }
          .q-dot-breathe {
            animation: none;
          }
        }
      `}</style>
      <div ref={stickyRef} className="q-pin-sticky">
        {/* Entrance opacity lives on the wrapper so the breathe
            animation on the inner dot layer never overrides it:
            animations beat inline opacity on the same element. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            opacity: dotEntrance,
          }}
        >
          <div aria-hidden="true" className="q-dot-base q-dot-breathe" />
        </div>
        <div
          aria-hidden="true"
          className="q-dot-lit"
          style={{
            opacity: cursorLit ? dotEntrance : 0,
            transition: `opacity ${cursorLit ? 0 : 600}ms ease`,
          }}
        />
        {body(progress)}
      </div>
    </section>
  );
}
