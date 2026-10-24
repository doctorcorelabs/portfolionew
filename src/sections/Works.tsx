import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { researchItems } from "../data/content";

/**
 * Works: Onlines section 7 (home-portfolio) translated to a research
 * portfolio. A plain editorial index list: rows separated by hairlines,
 * NOT cards, NOT a grid of tiles. One idea per row, generous whitespace,
 * mono metadata, blue accent only on interactive hover.
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

export default function Works() {
  const listRef = useRef<HTMLOListElement | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const rows = Array.from(list.querySelectorAll(".wk-row"));
    if (typeof IntersectionObserver === "undefined") {
      rows.forEach((row) => row.classList.add("wk-in"));
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
    return () => observer.disconnect();
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
        .wk-row { opacity: 0; transition: background-color 300ms cubic-bezier(0.22, 1, 0.36, 1); }
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
          .wk-index { transition: none; }
          .wk-arrow { transition: none; transform: none; }
          .wk-row:hover .wk-arrow, .wk-row:focus-within .wk-arrow { opacity: 1; transform: none; }
          .wk-title { transition: none; }
          .wk-row:hover .wk-title { transform: none; }
          .wk-link { transition: none; background-size: 100% 1px; }
        }
      `}</style>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
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
        <ol ref={listRef} style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {rows.map((row, rowIndex) => (
            <li
              key={row.index}
              className="wk-row"
              style={{
                borderTop: `1px solid ${HAIRLINE}`,
                padding: "32px 0",
                display: "flex",
                flexWrap: "wrap",
                gap: "16px 32px",
                alignItems: "baseline",
                animationDelay: `${rowIndex * 60}ms`,
              }}
            >
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
