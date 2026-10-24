/**
 * Manifesto: the dark methods block, Onlines section 5 equivalent.
 * Onlines tokens: dark #111, light text #FAFAFA, hairline on dark,
 * Inter for display, JetBrains Mono for labels, blue #0859D4 only
 * for the tiny step numbers. One idea per section, plain numbered
 * rows, no cards, no rounded corners.
 *
 * Motion (self-contained, no shared motion file):
 * - Title reveals on scroll; the 4 method rows stagger in at 80ms
 *   steps; the closing margin note fades last.
 * - A tiny local IntersectionObserver adds mvM-in to the section
 *   once it enters the viewport, then unobserves. Elements are only
 *   hidden after the effect arms the section (mvM-armed), so content
 *   never stays invisible if the observer cannot run.
 * - prefers-reduced-motion: everything is shown instantly, no motion.
 */

import { useEffect, useRef } from "react";

const DISPLAY =
  "Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const STEPS: Array<{ num: string; title: string; body: string }> = [
  {
    num: "01",
    title: "Question",
    body: "Start from the clinical question. Define who is studied, what is compared, and which outcome matters, before any analysis runs.",
  },
  {
    num: "02",
    title: "Data",
    body: "Gather and check the data with the methods, sources, inclusion rules, and gaps stated openly, not buried in a footnote.",
  },
  {
    num: "03",
    title: "Visualization",
    body: "Turn results into figures that can be read and checked: forest plots, curves, or timelines with axes, labels, and reading notes.",
  },
  {
    num: "04",
    title: "Tool",
    body: "Build findings into a tool only when the evidence supports it, with the limitations attached to the tool itself, not hidden from it.",
  },
];

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
.mvM-drift {
  animation: mvM-drift 22s ease-in-out infinite alternate;
  will-change: transform;
}
@keyframes mvM-drift {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-120px, 60px, 0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .mvM-armed .mvM-reveal {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .mvM-drift {
    animation: none !important;
  }
}
`;

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.classList.add("mvM-armed");
    if (typeof IntersectionObserver === "undefined") {
      section.classList.add("mvM-in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("mvM-in");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      aria-labelledby="manifesto-heading"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#111111",
        color: "#FAFAFA",
        fontFamily: DISPLAY,
        padding: "130px 24px",
      }}
    >
      <style>{REVEAL_CSS}</style>
      <div
        aria-hidden="true"
        className="mvM-drift"
        style={{
          position: "absolute",
          top: "-10%",
          right: "-8%",
          width: 900,
          height: 900,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(circle, rgba(8, 89, 212, 0.22) 0%, rgba(255, 255, 255, 0.08) 45%, rgba(255, 255, 255, 0) 70%)",
          filter: "blur(80px)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1160, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#98989C",
            margin: "0 0 24px",
          }}
        >
          Method
        </p>
        <h2
          id="manifesto-heading"
          className="mvM-reveal"
          style={{
            fontSize: "clamp(48px, 7vw, 72px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            fontWeight: 700,
            margin: "0 0 64px",
            maxWidth: 900,
          }}
        >
          From question to tool.
        </h2>
        <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {STEPS.map((step, i) => (
            <li
              key={step.num}
              className="mvM-reveal"
              style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.15)",
                padding: "32px 0",
                display: "flex",
                flexWrap: "wrap",
                gap: "16px 48px",
                alignItems: "baseline",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  color: "#0859D4",
                  minWidth: 40,
                }}
              >
                {step.num}
              </span>
              <span
                style={{
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  minWidth: 200,
                }}
              >
                {step.title}
              </span>
              <span
                style={{
                  fontSize: 18,
                  lineHeight: 1.65,
                  color: "#D8D8D8",
                  maxWidth: 640,
                }}
              >
                {step.body}
              </span>
            </li>
          ))}
        </ol>
        <p
          className="mvM-reveal"
          style={{
            fontFamily: MONO,
            fontSize: 13,
            lineHeight: 1.7,
            color: "#98989C",
            maxWidth: 640,
            margin: "48px 0 0",
            transitionDelay: "400ms",
          }}
        >
          [1] The order is fixed. No step is skipped to reach a tool faster.
        </p>
      </div>
    </section>
  );
}
