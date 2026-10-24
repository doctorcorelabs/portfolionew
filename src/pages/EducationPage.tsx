import { Link } from "react-router-dom";

/**
 * Education page, ONLINES styling: container 1160px, Inter display type,
 * JetBrains Mono year labels, hairline separators, blue only for links.
 * All entries are recorded exactly as in the old site (EducationPage.jsx,
 * Education.jsx, and CV.md). The degree line is kept as recorded; current
 * status is stated in a separate note and does not rewrite it.
 */

const INK = "#010101";
const GREY = "#555555";
const HAIRLINE = "#e0e0e0";
const BLUE = "#0859D4";
const LIGHT = "#f5f5f7";

const DISPLAY = "'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

type Entry = {
  institution: string;
  program: string;
  period: string;
  detail: string;
  notes: string[];
};

const ENTRIES: Entry[] = [
  {
    institution: "Islamic University of Indonesia",
    program: "Bachelor of Medicine",
    period: "2021 - Present",
    detail:
      "Undergraduate, Faculty of Medicine. Current GPA 3.91/4.0 as recorded.",
    notes: [
      "Most Outstanding Student UII 2025",
      "Awardee, Beasiswa Unggulan, Ministry of Education, Culture, Research, and Technology, 2023",
    ],
  },
  {
    institution: "Chulalongkorn University",
    program: "Summer School Program",
    period: "2025",
    detail:
      "Intensive training in Pharmaceutical and Clinical Development (AASP-PECT / CPDT). Selected participant for the intensive summer program.",
    notes: ["International program", "Pharmaceutical and Clinical Development"],
  },
  {
    institution: "SMAN 1 Blora",
    program: "Senior High School",
    period: "Graduated",
    detail: "Top 3 Student.",
    notes: ["3rd Most Outstanding Student based on the Final Student Examination"],
  },
];

const SKILL_LEVELS: { skill: string; level: string }[] = [
  { skill: "Systematic Review", level: "95%" },
  { skill: "Meta-Analysis", level: "90%" },
  { skill: "Clinical Diagnostics", level: "85%" },
  { skill: "Public Health", level: "90%" },
];

const KNOWLEDGE_MAP: string[] = [
  "World Health Organization (WHO)",
  "Stanford University",
  "The Johns Hopkins University",
  "University of Colorado Boulder",
];

export default function EducationPage() {
  return (
    <main
      style={{
        background: "#ffffff",
        color: INK,
        fontFamily: DISPLAY,
        padding: "80px 24px 130px",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: GREY,
            margin: "0 0 16px",
          }}
        >
          Education
        </p>
        <h1
          style={{
            fontSize: "clamp(56px, 9vw, 96px)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            fontWeight: 700,
            margin: "0 0 24px",
          }}
        >
          Education.
        </h1>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.65,
            color: GREY,
            maxWidth: 640,
            margin: "0 0 32px",
          }}
        >
          The academic path behind the research: medicine at Universitas Islam
          Indonesia, a summer school in pharmaceutical and clinical development
          at Chulalongkorn University, and senior high school at SMAN 1 Blora.
        </p>
        <p
          style={{
            background: LIGHT,
            borderLeft: `2px solid ${BLUE}`,
            padding: "16px 20px",
            fontSize: 16,
            lineHeight: 1.65,
            color: INK,
            maxWidth: 680,
            margin: "0 0 80px",
          }}
        >
          Current status note: since 5 October 2026, Daivan is a clinical
          clerk (koas) on surgery rotation. This note is separate from the
          degree line above, which is kept exactly as recorded on the old
          site.
        </p>

        <div style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          {ENTRIES.map((entry) => (
            <article
              key={entry.institution}
              style={{
                borderBottom: `1px solid ${HAIRLINE}`,
                padding: "32px 0",
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                gap: "24px",
              }}
            >
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: GREY,
                  margin: 0,
                }}
              >
                {entry.period}
              </p>
              <div>
                <h2
                  style={{
                    fontSize: 28,
                    letterSpacing: "-0.02em",
                    fontWeight: 700,
                    margin: "0 0 4px",
                  }}
                >
                  {entry.institution}
                </h2>
                <p
                  style={{
                    fontFamily: MONO,
                    fontSize: 13,
                    color: GREY,
                    margin: "0 0 16px",
                  }}
                >
                  {entry.program}
                </p>
                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.65,
                    maxWidth: 680,
                    margin: "0 0 16px",
                  }}
                >
                  {entry.detail}
                </p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 20,
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: GREY,
                  }}
                >
                  {entry.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <section style={{ marginTop: 80 }}>
          <h2
            style={{
              fontSize: 32,
              letterSpacing: "-0.02em",
              fontWeight: 700,
              margin: "0 0 8px",
            }}
          >
            Knowledge map.
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: GREY,
              maxWidth: 640,
              margin: "0 0 24px",
            }}
          >
            Certificate providers recorded on the old site. The full list of
            certificates lives on the certifications page.
          </p>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              borderTop: `1px solid ${HAIRLINE}`,
            }}
          >
            {KNOWLEDGE_MAP.map((provider) => (
              <li
                key={provider}
                style={{
                  borderBottom: `1px solid ${HAIRLINE}`,
                  padding: "16px 0",
                  fontSize: 17,
                  lineHeight: 1.6,
                }}
              >
                {provider}
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 24, fontSize: 15, lineHeight: 1.65 }}>
            <Link to="/certifications" style={{ color: BLUE }}>
              See all certifications
            </Link>
          </p>
          <h3
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              margin: "48px 0 8px",
            }}
          >
            Self-assessed skills, as recorded on the old site.
          </h3>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              borderTop: `1px solid ${HAIRLINE}`,
            }}
          >
            {SKILL_LEVELS.map((entry) => (
              <li
                key={entry.skill}
                style={{
                  borderBottom: `1px solid ${HAIRLINE}`,
                  padding: "16px 0",
                  fontSize: 17,
                  lineHeight: 1.6,
                }}
              >
                {entry.skill} - {entry.level}
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.65, color: GREY }}>
            These percentages are self-assessments from the old site, not
            measured scores.
          </p>
        </section>

        <p style={{ marginTop: 80, fontSize: 15, lineHeight: 1.65 }}>
          <Link to="/" style={{ color: BLUE }}>
            Back to the homepage
          </Link>
          {" | "}
          <Link to="/experience" style={{ color: BLUE }}>
            Experience
          </Link>
        </p>
      </div>
    </main>
  );
}
