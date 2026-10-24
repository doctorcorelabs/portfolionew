/**
 * Services.tsx - Onlines home-servicios, translated for DaivanLabs.
 * Dark section (#010101, white text) with a 3-column grid on desktop
 * and a single column on mobile. Every column is a fact from the old
 * site and CV only: no Onlines service copy, no client names, no
 * invented DOI, journal, or numbers.
 *
 * Card treatment: each column is a tall blue gradient card (white
 * text, rounded corners, dotted rule under the heading, soft gradient
 * texture). A white outline pill button sits at the card bottom-left
 * and stays invisible until its card is hovered or focused; the
 * hovered/focused card's pill renders bright and solid while the
 * other cards' pills stay invisible. There is no card lift and no
 * shadow change on hover. Pill destinations are existing internal
 * pages only: Research to /research, Tools to
 * /research/strokesense-ai-lab, Teaching and mentoring to /experience.
 *
 * Motion (scoped to this file, scroll-triggered, runs once):
 * the three cards stagger-reveal on scroll, each top hairline draws
 * left-to-right, then the card title and lines fade up in sequence.
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
      "Systematic reviews of clinical questions, from PCOS and cancer to the gut microbiome.",
      "Pharmacovigilance: disproportionality and time-to-onset analysis of FAERS reports.",
      "In silico drug discovery, with collaborators, for tuberculosis and breast cancer.",
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
          gap: 24px;
          align-items: stretch;
        }
        @media (max-width: 900px) {
          .svc-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        .svc-card {
          display: flex;
          flex-direction: column;
          min-height: 480px;
          height: 100%;
          box-sizing: border-box;
          padding: 32px 32px 36px;
          border-radius: 16px;
          color: #FFFFFF;
          background:
            radial-gradient(120% 60% at 15% 0%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 55%),
            radial-gradient(90% 50% at 100% 100%, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0) 60%),
            linear-gradient(160deg, #0B63E5 0%, #0859D4 52%, #0649A8 100%);
        }
        @media (max-width: 900px) {
          .svc-card {
            min-height: 0;
          }
        }
        .svc-dotted-rule {
          border: 0;
          border-top: 1px dotted rgba(255, 255, 255, 0.55);
          margin: 0 0 24px;
        }
        .svc-pill {
          align-self: flex-start;
          margin-top: auto;
          padding-top: 48px;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.25s ease, visibility 0.25s ease;
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
          transition: background-color 0.25s ease, color 0.25s ease;
        }
        .svc-card:hover .svc-pill,
        .svc-card:focus-within .svc-pill {
          opacity: 1;
          visibility: visible;
        }
        .svc-card:hover .svc-pill a,
        .svc-card:focus-within .svc-pill a {
          background: #FFFFFF;
          border-color: #FFFFFF;
          color: #0859D4;
        }
        .svc-pill a:focus-visible {
          outline: 2px solid #FFFFFF;
          outline-offset: 3px;
        }
        .svc-anim .svc-head { opacity: 0; transform: translateY(20px); }
        .svc-anim .svc-col { opacity: 0; transform: translateY(20px); }
        .svc-anim .svc-title { opacity: 0; transform: translateY(14px); }
        .svc-anim .svc-line { opacity: 0; transform: translateY(14px); }
        .svc-anim.svc-visible .svc-head {
          animation: svc-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0s forwards;
        }
        .svc-anim.svc-visible .svc-col {
          animation: svc-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
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
          .svc-pill,
          .svc-pill a {
            transition: none;
          }
        }
      `}</style>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
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
          }}
        >
          Three ways of working.
        </h2>
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
                  className="svc-title"
                  style={{
                    fontSize: "clamp(28px, 3vw, 42px)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    fontWeight: 700,
                    margin: "0 0 20px",
                    animationDelay: `${base + 0.15}s`,
                  }}
                >
                  {column.title}
                </h3>
                <hr aria-hidden="true" className="svc-dotted-rule" />
                {column.lines.map((line, lineIndex) => (
                  <p
                    key={line}
                    className="svc-line"
                    style={{
                      fontSize: 17,
                      lineHeight: 1.65,
                      color: "rgba(255, 255, 255, 0.9)",
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
