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
 * internal pages only: Research to /research, Tools to
 * /research/strokesense-ai-lab, Teaching and mentoring to
 * /experience.
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
  href: string;
  pillLabel: string;
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
      "StrokeSense AI Lab: interactive stroke education with an AI-assisted lab.",
      "StrokeSense: education-first stroke learning, built for the public.",
    ],
    href: "/research/strokesense-ai-lab",
    pillLabel: "View StrokeSense AI Lab",
  },
  {
    number: "03",
    title: "Teaching and mentoring",
    lines: [
      "Speaker and mentor at KampusInovatif.id, September 2024 to February 2025.",
      "Scientific division, SMART FK UII, including scientific essay mentoring.",
      "Public speaking education at Seni.Bicara.",
    ],
    href: "/experience",
    pillLabel: "View experience",
  },
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

  return (
    <section
      ref={sectionRef}
      aria-labelledby="services-heading"
      className={visible ? "svc-anim svc-visible" : "svc-anim"}
      style={{
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
        }
      `}</style>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
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
        <div className="svc-grid">
          {COLUMNS.map((column, columnIndex) => {
            const base = 0.1 + columnIndex * 0.15;
            return (
              <div
                key={column.number}
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
                <div className="svc-pill">
                  <Link to={column.href} aria-label={column.pillLabel}>
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
