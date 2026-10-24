import { useEffect, useRef, useState } from "react";

/**
 * Affiliations: the Onlines monochrome logo wall, translated honestly.
 * Institutions are shown as TEXT wordmarks only. No institution logo is
 * fabricated, and no Onlines client logo is copied. Each wordmark carries
 * a small label stating the real relationship, so nothing reads as an
 * endorsement or a client relationship.
 *
 * Stamp treatment (hero selection-frame language): each affiliation
 * is a dashed-frame badge with small square corner ticks, like the
 * hero selection box handles. Badges pop in with the overshoot curve
 * on reveal, in a stagger. On hover/focus-within the dashed border
 * solidifies and the wordmark darkens; there is no lift, no shadow
 * change, and no scale on hover, and no content depends on hover.
 */

const INK = "#010101";
const MUTED = "#98989c";
const PAPER = "#ffffff";
const HAIRLINE = "#e0e0e0";

const DISPLAY =
  "'Inter Display', Inter, -apple-system, 'Segoe UI', Roboto, sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const affiliations = [
  {
    name: "Universitas Islam Indonesia",
    relation: "Place of study",
  },
  {
    name: "Chulalongkorn University",
    relation: "Place of study",
  },
  {
    name: "World Health Organization",
    relation: "Course provider",
  },
  {
    name: "UNITAR",
    relation: "Course provider",
  },
  {
    name: "The Johns Hopkins University",
    relation: "Course provider",
  },
  {
    name: "Ministry of Education",
    relation: "Scholarship program, Beasiswa Unggulan",
  },
  {
    name: "Korean Society of Hypertension",
    relation: "Congress, Hypertension Seoul 2026",
  },
];

export default function Affiliations() {
  const stripRef = useRef<HTMLUListElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerIn, setHeaderIn] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    if (typeof IntersectionObserver === "undefined") {
      setHeaderIn(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHeaderIn(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const items = Array.from(strip.querySelectorAll(".af-item"));
    if (typeof IntersectionObserver === "undefined") {
      items.forEach((item) => item.classList.add("af-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("af-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-label="Study and affiliation"
      style={{
        background: PAPER,
        color: INK,
        fontFamily: DISPLAY,
        padding: "80px 24px 130px",
        borderTop: `1px solid ${HAIRLINE}`,
      }}
    >
      <style>{`
        @keyframes afPop {
          from { opacity: 0; transform: scale(0.8) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes afFloat {
          from { transform: translateY(0); }
          to { transform: translateY(-3px); }
        }
        /* Gentle float on the badge TEXT only. The corner ticks stay
           direct children of the badge so their corner placement is
           unchanged, and the pop entrance stays on the outer badge,
           so the two transforms never fight. */
        .af-float {
          display: block;
          animation: afFloat 11s ease-in-out infinite alternate;
        }
        .af-item {
          opacity: 0;
          position: relative;
          box-sizing: border-box;
          border: 1px dashed rgba(18, 18, 19, 0.2);
          padding: 20px 22px;
          transition: border-color 250ms ease;
        }
        .af-item.af-in { animation: afPop 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .af-item:hover,
        .af-item:focus-within {
          border-style: solid;
          border-color: #010101;
        }
        .af-mark { color: #4a4a4a; transition: color 250ms ease; }
        .af-item:hover .af-mark,
        .af-item:focus-within .af-mark { color: #010101; }
        @media (prefers-reduced-motion: reduce) {
          .af-item { opacity: 1 !important; animation: none !important; transform: none !important; transition: none; }
          .af-mark { transition: none; }
          .af-float { animation: none !important; transform: none; }
        }
      `}</style>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        {/* Slide classes are owned by src/styles/section-slide.css;
            this wrapper adds no margin or padding of its own. */}
        <div
          ref={headerRef}
          className={headerIn ? "sec-slide from-left in" : "sec-slide from-left"}
        >
        <p
          style={{
            margin: "0 0 24px",
            fontFamily: MONO,
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          Affiliation
        </p>
        <p
          style={{
            margin: "0 0 64px",
            maxWidth: 680,
            fontSize: 18,
            lineHeight: 1.6,
            color: INK,
          }}
        >
          These are places of study and affiliation, not clients, and they
          are not presented as clients anywhere on this site.
        </p>
        </div>
        <ul
          ref={stripRef}
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: "48px 80px",
            alignItems: "flex-start",
          }}
        >
          {affiliations.map((entry, entryIndex) => (
            <li
              key={entry.name}
              className="af-item"
              style={{ maxWidth: 260, animationDelay: `${entryIndex * 70}ms` }}
            >
              {[
                { top: -5, left: -5 },
                { top: -5, right: -5 },
                { bottom: -5, left: -5 },
                { bottom: -5, right: -5 },
              ].map((tick, tickIndex) => (
                <span
                  key={tickIndex}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    width: 10,
                    height: 10,
                    background: "#ffffff",
                    border: "1px solid #98989c",
                    boxSizing: "border-box",
                    ...tick,
                  }}
                />
              ))}
              <span
                className="af-float"
                style={{
                  display: "block",
                  animationDuration: `${[9, 11, 13][entryIndex % 3]}s`,
                }}
              >
              <span
                className="af-mark"
                style={{
                  display: "block",
                  fontFamily: MONO,
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  lineHeight: 1.4,
                }}
              >
                {entry.name}
              </span>
              <span
                style={{
                  display: "block",
                  marginTop: 8,
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: MUTED,
                  lineHeight: 1.6,
                }}
              >
                {entry.relation}
              </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
