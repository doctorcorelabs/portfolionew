/**
 * ResearchIndex: the /research page, a hairline-separated index of ALL
 * research. Featured items come from researchItems in src/data/content.ts
 * and link to their detail pages. Old-site key projects and old-site
 * publications are defined locally here from the old-site source (CV.md
 * and the old-site content audit); they have no detail page, so they
 * render as index rows without a link, never with a fake one.
 *
 * Honesty rules:
 * - Publication titles are verbatim from the old-site source. No journal,
 *   DOI, or author list is shown for them, because none is recorded in
 *   that source.
 * - The CML gut axis review appears in the old-site source in both an
 *   Indonesian and an English version; both are listed, and the English
 *   version is marked as such instead of being presented as a separate
 *   study. Its year is recorded as 2024 in the old Awards page.
 * - No result numbers, journals, DOIs, or links are invented anywhere
 *   on this page.
 */

import React from "react";
import { Link } from "react-router-dom";
import { researchItems, researchFocus, methodologies } from "../data/content";

const INK = "#010101";
const GRAPHITE = "#1D1D1F";
const MARGIN_GREY = "#666666";
const HAIRLINE = "#E0E0E0";

const DISPLAY = "'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

type KeyProject = {
  title: string;
  role: string;
  detail: string;
};

const keyProjects: KeyProject[] = [
  {
    title: "Dietary Impacts on PCOS",
    role: "Head of Research",
    detail: "Review research, 2024.",
  },
  {
    title: "Bisphenol A and Cancer",
    role: "Systematic review",
    detail:
      "Two Faculty of Medicine UII grants, 2024: bisphenol A in canned and plastic food and beverage, and bisphenol A on cancers.",
  },
  {
    title: "TB Drug Discovery",
    role: "Research collaborator",
    detail: "In silico drug discovery study, 2024.",
  },
  {
    title: "Gut Axis and Leukemia",
    role: "Systematic review",
    detail:
      "Microbiome gut axis in chronic myeloid leukemia development and relapse.",
  },
];

type OldPublication = {
  title: string;
  year: string;
  type: string;
  note?: string;
};

const oldPublications: OldPublication[] = [
  {
    title:
      "Exploration of Amomum cardamomum Seed-Derived Compounds: LC-MS Profiling, Network Pharmacology, and Computational Analyses for Innovative Multi-Targeted Breast Cancer Therapy",
    year: "2025",
    type: "Journal research",
  },
  {
    title:
      "Peran Microbiome Gut Axis Dalam Perkembangan Dan Kekambuhan Chronic Myeloid Leukemia: Systematic Review",
    year: "2024",
    type: "Systematic review",
  },
  {
    title:
      "A Comparative Analysis Of Colonoscopy With Computer-Aided Detection And Standard Colonoscopy In The Detection Of Colorectal Adenomas And Polyps: A Systematic Review",
    year: "2024",
    type: "Systematic review",
  },
  {
    title:
      "The role of the microbiome gut axis in the development and relapse of chronic myeloid leukemia: Systematic review",
    year: "2024",
    type: "Systematic review",
    note:
      "English version of the same review listed above, as it appears in the old-site source (year recorded as 2024 in the old Awards page).",
  },
  {
    title:
      "The Significant Roles of The Renin-Angiotensin-Aldosterone System Metabolism on the Development of Hypertension",
    year: "2024",
    type: "Conference paper, The 4th International Conference on Cardiovascular Diseases (IC-CVD)",
  },
];


/* Local scroll-reveal wrapper. Pairs with .mv-reveal in motion.css:
   hidden until the element is 15 percent in view, then stays visible.
   Falls back to visible immediately when IntersectionObserver is absent,
   and prefers-reduced-motion forces everything visible via motion.css. */
function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`mv-reveal${visible ? " is-visible" : ""}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

const rowStyle: React.CSSProperties = {
  borderTop: `1px solid ${HAIRLINE}`,
  padding: "20px 0",
};

const metaStyle: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: MARGIN_GREY,
  margin: "0 0 8px",
  overflowWrap: "anywhere",
};

const titleStyle: React.CSSProperties = {
  fontFamily: DISPLAY,
  fontSize: 22,
  fontWeight: 800,
  letterSpacing: "-0.02em",
  lineHeight: 1.25,
  color: INK,
  margin: "0 0 8px",
};

const bodyStyle: React.CSSProperties = {
  fontFamily: DISPLAY,
  fontSize: 16,
  lineHeight: 1.65,
  color: GRAPHITE,
  maxWidth: 680,
  margin: 0,
};

export default function ResearchIndex() {
  return (
    <main
      style={{
        background: "#FFFFFF",
        color: INK,
        fontFamily: DISPLAY,
        padding: "72px 24px",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <Reveal>
        <nav
          aria-label="Breadcrumb"
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: MARGIN_GREY,
            margin: "0 0 24px",
          }}
        >
          <Link to="/" style={{ color: INK, display: "inline-block", padding: "12px 12px 12px 0" }}>
            Home
          </Link>{" "}
          / Research
        </nav>

        <p style={metaStyle}>Index</p>
        <h1
          style={{
            fontSize: "clamp(40px, 7vw, 84px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontWeight: 900,
            margin: "0 0 24px",
          }}
        >
          Research.
        </h1>
        <p
          style={{
            ...bodyStyle,
            fontSize: 18,
            marginBottom: 48,
          }}
        >
          Every study, tool, and publication in one index: featured work
          first, then the key projects and publications recorded on the old
          site. Entries link to a detail page only where one exists.
          Five new 2026 publications, in Scopus-indexed journals, on BPA
          endocrine disruption, marine peptides, and miRNA diagnostics,
          appear as featured research above.
        </p>
        </Reveal>

        <Reveal>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "0 0 8px",
          }}
        >
          Featured research
        </h2>
        <div style={{ marginBottom: 56 }}>
          {researchItems.map((item, itemIndex) => (
            <Reveal key={item.id} delay={(itemIndex % 4) * 90}>
            <article style={rowStyle}>
              <p style={metaStyle}>
                {item.kicker} | {item.status} | {item.year ?? "Year not recorded"}
                {item.scopusJournal
                  ? ` | Scopus-indexed journal${item.scopusQuartile ? ` (${item.scopusQuartile})` : ""}`
                  : ""}
              </p>
              <h3 style={titleStyle}>
                <Link
                  to={`/research/${item.id}`}
                  style={{ color: INK, textDecoration: "underline", display: "inline-block", padding: "8px 0" }}
                >
                  {item.shortTitle}
                </Link>
              </h3>
              <p style={bodyStyle}>{item.description}</p>
              <p
                style={{
                  ...bodyStyle,
                  fontFamily: MONO,
                  fontSize: 12,
                  marginTop: 8,
                  overflowWrap: "anywhere",
                }}
              >
                {item.venue} | {item.role}
              </p>
            </article>
            </Reveal>
          ))}
        </div>
        </Reveal>

        <Reveal>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "0 0 8px",
          }}
        >
          Key projects from the old site
        </h2>
        <div style={{ marginBottom: 56 }}>
          {keyProjects.map((project, projectIndex) => (
            <Reveal key={project.title} delay={(projectIndex % 4) * 90}>
            <article style={rowStyle}>
              <p style={metaStyle}>{project.role}</p>
              <h3 style={titleStyle}>{project.title}</h3>
              <p style={bodyStyle}>{project.detail}</p>
            </article>
            </Reveal>
          ))}
        </div>
        </Reveal>

        <Reveal>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "0 0 8px",
          }}
        >
          Publications from the old site
        </h2>
        <p
          style={{
            ...bodyStyle,
            fontSize: 15,
            marginBottom: 8,
          }}
        >
          Titles are verbatim from the old-site source. No journal, DOI, or
          full author list is shown for these entries, because none is
          recorded in that source.
        </p>
        <div style={{ marginBottom: 24 }}>
          {oldPublications.map((pub, pubIndex) => (
            <Reveal key={pub.title} delay={(pubIndex % 4) * 90}>
            <article style={rowStyle}>
              <p style={metaStyle}>
                {pub.type} | {pub.year}
              </p>
              <h3 style={titleStyle}>{pub.title}</h3>
              {pub.note ? <p style={bodyStyle}>{pub.note}</p> : null}
            </article>
            </Reveal>
          ))}
        </div>
        </Reveal>

        <Reveal>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "0 0 8px",
          }}
        >
          Focus and methods
        </h2>
        <p style={{ ...bodyStyle, fontSize: 15, marginBottom: 8 }}>
          Research focus clusters and methodologies as recorded on the old
          site.
        </p>
        <div style={{ marginBottom: 24 }}>
          {researchFocus.map((focus, focusIndex) => (
            <Reveal key={focus.name} delay={(focusIndex % 4) * 90}>
            <article style={rowStyle}>
              <p style={metaStyle}>Focus</p>
              <h3 style={titleStyle}>{focus.name}</h3>
              <p style={bodyStyle}>{focus.topics}</p>
            </article>
            </Reveal>
          ))}
          <Reveal>
            <article style={rowStyle}>
            <p style={metaStyle}>Methodologies</p>
            <h3 style={titleStyle}>How the work is done</h3>
            <p style={bodyStyle}>{methodologies.join(", ")}.</p>
          </article>
          </Reveal>
        </div>
        </Reveal>

        <p style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: 20 }}>
          <Link to="/" style={{ color: INK, display: "inline-block", padding: "12px 0" }}>
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
