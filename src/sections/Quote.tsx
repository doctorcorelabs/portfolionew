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
 * - Inner child: position sticky, top 0, 100svh tall, so the content
 *   stays pinned while the visitor scrolls through the runway.
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
    <div style={{ maxWidth: 1160, margin: "0 auto", width: "100%" }}>
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
          height: 100svh;
          display: flex;
          align-items: center;
          padding: 120px 24px;
          box-sizing: border-box;
          overflow-y: auto;
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
            overflow: visible;
          }
        }
      `}</style>
      <div className="q-pin-sticky">{body(progress)}</div>
    </section>
  );
}
