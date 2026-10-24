import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { researchItems } from "../data/content";

/**
 * Works: Onlines section 7 (home-portfolio) translated to a research
 * portfolio. A plain editorial index list: rows separated by hairlines,
 * NOT cards, NOT a grid of tiles. One idea per row, generous whitespace,
 * mono metadata, blue accent only on interactive hover.
 *
 * Hero-scale visual layers (decorative, no new facts):
 * - A giant outlined index numeral (01-09) beside each row: display
 *   type with transparent fill and a 1px grey outline, faint,
 *   aria-hidden. Rows gain left padding to make room for it.
 * - One vertical dashed route line on the left of the list,
 *   connecting all 9 rows, drawing top-to-bottom (scaleY) when the
 *   list scrolls into view.
 * - A per-row visual tag under the description: the row type taken
 *   from its existing meta label, in mono, plus one tiny abstract
 *   CSS glyph for that type (circle, diamond, triangle, square).
 *   Shapes only, no images, no new facts.
 * - A traveler dot on the route line: a 10px blue dot that rides the
 *   dashed line from top to bottom and back, decorative only.
 * - The section header rides a "sec-slide from-right" wrapper; the
 *   slide CSS lives in src/styles/section-slide.css, owned elsewhere.
 *
 * Integrity rules enforced here:
 * - The FAERS row shows ONLY N = 6,601 and the verified framing. NO ROR
 *   values appear in this file at all. The forest plot lives on the
 *   research detail page, not here.
 * - Old-site publications use their verbatim titles, year, and type only.
 *   No journal, DOI, or author list is invented for them, because none is
 *   recorded in the sources.
 * - The cerclage row carries NO result numbers.
 * - StrokeSense rows carry the honesty note: upload results are AI
 *   interpretation, not MediaPipe measurement, and FAST output is an
 *   Observation Sheet with no score and no diagnosis.
 */

const INK = "#010101";
const GRAPHITE = "#1d1d1f";
const MUTED = "#98989c";
const HAIRLINE = "#e0e0e0";
const PAPER = "#ffffff";

const DISPLAY =
  "'Inter Display', Inter, -apple-system, 'Segoe UI', Roboto, sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

function byId(id: string) {
  const item = researchItems.find((entry) => entry.id === id);
  if (!item) throw new Error(`researchItems is missing id: ${id}`);
  return item;
}

type WorkRow = {
  index: string;
  meta: string;
  title: string;
  line: string;
  href: string;
  linkLabel: string;
};

/* Featured rows come from content.ts (single source of truth). */
const faers = byId("faers-resistant-hypertension");
const aiLab = byId("strokesense-ai-lab");
const strokesense = byId("strokesense-education-first");
const cerclage = byId("cerclage-twin-pregnancies");

const featuredRows: WorkRow[] = [
  {
    index: "01",
    meta: "2026 - Poster",
    title: faers.shortTitle,
    line: "Poster ABST-000034, Hypertension Seoul 2026. 6,601 FAERS reports analysed.",
    href: "/research/faers-resistant-hypertension",
    linkLabel: "Read the study",
  },
  {
    index: "02",
    meta: "2026 - Live tool",
    title: aiLab.shortTitle,
    line: "Interactive stroke education with an AI-assisted lab. Upload results are AI interpretation of images, not MediaPipe measurement. FAST output is an Observation Sheet with no score and no diagnosis.",
    href: "/research/strokesense-ai-lab",
    linkLabel: "Explore the project",
  },
  {
    index: "03",
    meta: "2026 - Web project",
    title: strokesense.shortTitle,
    line: "Interactive stroke education, framed for learning only. No diagnostic claims are made for this project.",
    href: "/research/strokesense-education-first",
    linkLabel: "Explore the project",
  },
  {
    index: "04",
    meta: "2026 - Manuscript in progress",
    title: cerclage.shortTitle,
    line: "Systematic review and meta-analysis. Table 1 deep analysis completed 18 Oct 2026. No result numbers are published yet.",
    href: "/research/cerclage-twin-pregnancies",
    linkLabel: "Read the study",
  },
];

/*
 * Old-site publications, defined locally because they are not in
 * content.ts. Titles are verbatim from the old-site CV (CV.md lines 39
 * to 43). Year and type are as recorded in research/01. The English
 * version of the gut-axis paper is listed separately below, matching
 * the old-site source, which carries both versions. Detail slugs below
 * match the ids in src/data/content.ts oldPublications.
 */
const archiveRows: WorkRow[] = [
  {
    index: "05",
    meta: "2025 - Journal research",
    title:
      "Exploration of Amomum cardamomum Seed-Derived Compounds: LC-MS Profiling, Network Pharmacology, and Computational Analyses for Innovative Multi-Targeted Breast Cancer Therapy",
    line: "Breast cancer therapy from seed-derived compounds, studied computationally.",
    href: "/research/amomum-cardamomum-breast-cancer-therapy",
    linkLabel: "Read the study",
  },
  {
    index: "06",
    meta: "2024 - Systematic review",
    title:
      "Peran Microbiome Gut Axis Dalam Perkembangan Dan Kekambuhan Chronic Myeloid Leukemia: Systematic Review",
    line: "Gut microbiome axis in the development and relapse of chronic myeloid leukemia.",
    href: "/research/gut-axis-chronic-myeloid-leukemia",
    linkLabel: "Read the study",
  },
  {
    index: "07",
    meta: "2024 - Systematic review",
    title:
      "A Comparative Analysis Of Colonoscopy With Computer-Aided Detection And Standard Colonoscopy In The Detection Of Colorectal Adenomas And Polyps: A Systematic Review",
    line: "Computer-aided detection versus standard colonoscopy for adenoma and polyp detection.",
    href: "/research/colonoscopy-computer-aided-detection",
    linkLabel: "Read the study",
  },
  {
    index: "08",
    meta: "2024 - Systematic review",
    title:
      "The role of the microbiome gut axis in the development and relapse of chronic myeloid leukemia: Systematic review",
    line: "English version of the same gut-axis CML review.",
    href: "/research/gut-axis-chronic-myeloid-leukemia-en",
    linkLabel: "Read the study",
  },
  {
    index: "09",
    meta: "2024 - Conference paper, IC-CVD",
    title:
      "The Significant Roles of The Renin-Angiotensin-Aldosterone System Metabolism on the Development of Hypertension",
    line: "Renin-angiotensin-aldosterone system metabolism in the development of hypertension.",
    href: "/research/raas-hypertension-ic-cvd",
    linkLabel: "Read the study",
  },
];

const rows: WorkRow[] = [...featuredRows, ...archiveRows];

/* Row type, taken from the existing meta label ("2026 - Poster" ->
   "Poster"). No new facts: the tag only repeats what meta says. */
function tagFor(meta: string): string {
  const parts = meta.split(" - ");
  return parts.length > 1 ? parts[parts.length - 1] : meta;
}

/* One abstract glyph class per row type. Shapes only. */
function glyphFor(tag: string): string {
  if (tag === "Poster" || tag === "Systematic review") return "wk-glyph-circle";
  if (tag === "Live tool" || tag === "Conference paper, IC-CVD")
    return "wk-glyph-triangle";
  if (tag === "Web project" || tag === "Journal research")
    return "wk-glyph-square";
  return "wk-glyph-diamond";
}

export default function Works() {
  const listRef = useRef<HTMLOListElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerIn, setHeaderIn] = useState(false);

  /* Header slide-in: "in" is added once the header enters view.
     Under reduced motion the header is shown at once, with no
     observer wait, so content never depends on animation. */
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.matchMedia !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setHeaderIn(true);
      return;
    }
    const header = headerRef.current;
    if (!header) return;
    if (typeof IntersectionObserver === "undefined") {
      setHeaderIn(true);
      return;
    }
    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHeaderIn(true);
            headerObserver.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );
    headerObserver.observe(header);
    return () => headerObserver.disconnect();
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const rows = Array.from(list.querySelectorAll(".wk-row"));
    /* The route line lives in the wrapper around the list, so the
       draw class goes on the wrapper, not the list itself. */
    const wrapper = list.parentElement;
    if (typeof IntersectionObserver === "undefined") {
      rows.forEach((row) => row.classList.add("wk-in"));
      wrapper?.classList.add("wk-route-in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("wk-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    rows.forEach((row) => observer.observe(row));
    /* The route line draws once when the list itself enters view. */
    const routeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            wrapper?.classList.add("wk-route-in");
            routeObserver.disconnect();
          }
        });
      },
      { threshold: 0.05 },
    );
    routeObserver.observe(list);
    return () => {
      observer.disconnect();
      routeObserver.disconnect();
    };
  }, []);

  return (
    <section
      aria-labelledby="works-heading"
      style={{
        background: PAPER,
        color: INK,
        fontFamily: DISPLAY,
        padding: "80px 24px 200px",
      }}
    >
      <style>{`
        @keyframes wkRise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .wk-row { opacity: 0; position: relative; z-index: 2; transition: background-color 300ms cubic-bezier(0.22, 1, 0.36, 1); }
        /* Giant outlined index numeral, decorative only. */
        @keyframes wkGiantIn {
          from { opacity: 0; transform: translateY(calc(-50% + 14px)); }
          to { opacity: 1; transform: translateY(-50%); }
        }
        .wk-giant {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          font-size: clamp(64px, 9vw, 120px);
          line-height: 1;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: transparent;
          -webkit-text-stroke: 1px #D8D8D8;
          pointer-events: none;
          opacity: 0;
        }
        .wk-row.wk-in .wk-giant {
          animation: wkGiantIn 600ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        /* Vertical dashed route line through the list. */
        .wk-route {
          position: absolute;
          left: 70px;
          top: 0;
          bottom: 0;
          width: 0;
          border-left: 1px dashed rgba(1, 1, 1, 0.25);
          pointer-events: none;
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 1200ms cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 0;
        }
        .wk-route-in .wk-route {
          transform: scaleY(1);
        }
        /* Traveler dot riding the dashed route line, top to bottom
           and back. It sits above the line (z-index 1) and below row
           content (rows carry z-index 2). Geometrically it never
           overlaps row text, which starts at 150px padding (88px on
           mobile) while the dot rides at 70px (34px on mobile). */
        @keyframes wkTravel {
          from { top: 0%; }
          to { top: 100%; }
        }
        .wk-traveler {
          position: absolute;
          left: 70px;
          top: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #0859D4;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 1;
          animation: wkTravel 14s ease-in-out infinite alternate;
        }
        /* Per-row visual tag: mono type label plus a tiny glyph. */
        .wk-tag {
          display: block;
          margin-top: 14px;
          font-family: ${MONO};
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${MUTED};
        }
        .wk-glyph {
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
        }
        .wk-glyph-circle {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid #0859D4;
          box-sizing: border-box;
        }
        .wk-glyph-square {
          width: 10px;
          height: 10px;
          border: 2px solid #0859D4;
          box-sizing: border-box;
        }
        .wk-glyph-diamond {
          width: 10px;
          height: 10px;
          border: 2px solid #0859D4;
          box-sizing: border-box;
          transform: rotate(45deg);
        }
        .wk-glyph-triangle {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 10px solid #0859D4;
        }
        @media (max-width: 700px) {
          .wk-row { padding-left: 88px !important; }
          .wk-giant { font-size: 56px; }
          .wk-route { left: 34px; }
          .wk-traveler { left: 34px; }
        }
        .wk-row:hover, .wk-row:focus-within { background-color: #EFF4FE; }
        .wk-row.wk-in { animation: wkRise 500ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .wk-index { transition: color 300ms cubic-bezier(0.22, 1, 0.36, 1); }
        .wk-row:hover .wk-index, .wk-row:focus-within .wk-index { color: #0859D4; }
        .wk-arrow {
          display: inline-block;
          margin-left: 6px;
          color: #0859D4;
          opacity: 0;
          transform: translateX(8px);
          transition: opacity 300ms cubic-bezier(0.22, 1, 0.36, 1), transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .wk-row:hover .wk-arrow, .wk-row:focus-within .wk-arrow, .wk-link:hover .wk-arrow, .wk-link:focus-visible .wk-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        .wk-title { transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1); }
        /* Site-wide dotted motif (docs/deep/05): 1px square tiles
           from a repeating gradient under the section title. */
        .wk-dotted-rule {
          width: 160px;
          height: 1px;
          background-image: repeating-linear-gradient(to right, rgba(1, 1, 1, 0.55) 0 1px, transparent 1px 4px);
          background-size: 4px 1px;
          background-repeat: repeat-x;
        }
        .wk-row:hover .wk-title { transform: translateX(4px); }
        .wk-link {
          text-decoration: none;
          background-image: linear-gradient(#0859d4, #0859d4);
          background-size: 0% 1px;
          background-repeat: no-repeat;
          background-position: 0 100%;
          transition: background-size 300ms cubic-bezier(0.22, 1, 0.36, 1), color 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .wk-row:hover .wk-link, .wk-link:hover {
          background-size: 100% 1px;
          color: #0859d4;
        }
        @media (prefers-reduced-motion: reduce) {
          .wk-row { opacity: 1 !important; animation: none !important; transform: none !important; transition: none; }
          .wk-giant { animation: none !important; opacity: 1; transform: translateY(-50%); color: #E8E8E8; -webkit-text-stroke: 0; }
          .wk-route { transition: none; transform: none; }
          .wk-traveler { animation: none !important; top: 0; }
          .wk-index { transition: none; }
          .wk-arrow { transition: none; transform: none; }
          .wk-row:hover .wk-arrow, .wk-row:focus-within .wk-arrow { opacity: 1; transform: none; }
          .wk-title { transition: none; }
          .wk-row:hover .wk-title { transform: none; }
          .wk-link { transition: none; background-size: 100% 1px; }
        }
      `}</style>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div
          ref={headerRef}
          className={`sec-slide from-right${headerIn ? " in" : ""}`}
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
          Portfolio
        </p>
        <h2
          id="works-heading"
          style={{
            margin: "0 0 24px",
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            fontWeight: 700,
          }}
        >
          Selected works.
        </h2>
        <div
          aria-hidden="true"
          className="wk-dotted-rule"
          style={{ margin: "0 0 56px" }}
        />
        </div>
        <div style={{ position: "relative" }}>
          <div aria-hidden="true" className="wk-route" />
          <div aria-hidden="true" className="wk-traveler" />
          <ol
            ref={listRef}
            style={{ listStyle: "none", margin: 0, padding: 0 }}
          >
            {rows.map((row, rowIndex) => (
            <li
              key={row.index}
              className="wk-row"
              style={{
                borderTop: `1px solid ${HAIRLINE}`,
                padding: "32px 0 32px 150px",
                display: "flex",
                flexWrap: "wrap",
                gap: "16px 32px",
                alignItems: "baseline",
                animationDelay: `${rowIndex * 60}ms`,
              }}
            >
              <span
                aria-hidden="true"
                className="wk-giant"
                style={{ animationDelay: `${rowIndex * 60}ms` }}
              >
                {row.index}
              </span>
              <span
                className="wk-index"
                style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  color: MUTED,
                  minWidth: 32,
                }}
              >
                {row.index}
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: MUTED,
                  minWidth: 220,
                }}
              >
                {row.meta}
              </span>
              <span style={{ flex: "1 1 320px", minWidth: 0 }}>
                <span
                  className="wk-title"
                  style={{
                    display: "block",
                    fontSize: 28,
                    lineHeight: 1.15,
                    letterSpacing: "-0.01em",
                    fontWeight: 700,
                  }}
                >
                  {row.title}
                </span>
                <span
                  style={{
                    display: "block",
                    marginTop: 12,
                    fontSize: 17,
                    lineHeight: 1.6,
                    color: GRAPHITE,
                    maxWidth: 680,
                  }}
                >
                  {row.line}
                </span>
                <span className="wk-tag" aria-hidden="true">
                  <span
                    aria-hidden="true"
                    className={`wk-glyph ${glyphFor(tagFor(row.meta))}`}
                  />
                  {tagFor(row.meta)}
                </span>
              </span>
              <Link
                to={row.href}
                className="wk-link"
                style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: INK,
                  whiteSpace: "nowrap",
                  paddingBottom: 3,
                }}
              >
                {row.linkLabel}{" "}
                <span className="wk-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
          <li
            aria-hidden="true"
            style={{ borderTop: `1px solid ${HAIRLINE}` }}
          />
          </ol>
        </div>
        <p
          style={{
            margin: "40px 0 0",
            maxWidth: 680,
            fontFamily: MONO,
            fontSize: 12,
            lineHeight: 1.7,
            color: MUTED,
          }}
        >
          FAERS results are hypothesis-generating: they measure reporting
          disproportionality, not clinical risk or causality. Old-site
          publications above are listed exactly as recorded on
          daivanlabs.com. No journal name, DOI, or full author list is
          recorded for them in the sources, so none is shown.
        </p>
      </div>
    </section>
  );
}
