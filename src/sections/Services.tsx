/**
 * Services.tsx - Onlines home-servicios, translated for DaivanLabs.
 * Dark section (#010101, white text) with a 3-column grid on desktop
 * and a single column on mobile. Every column is a fact from the old
 * site and CV only: no Onlines service copy, no client names, no
 * invented DOI, journal, or numbers.
 */

const DISPLAY =
  "'Inter', 'Inter Display', Arial, -apple-system, 'Segoe UI', sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const COLUMNS: {
  number: string;
  title: string;
  lines: string[];
}[] = [
  {
    number: "01",
    title: "Research",
    lines: [
      "Systematic reviews of clinical questions, from PCOS and cancer to the gut microbiome.",
      "Pharmacovigilance: disproportionality and time-to-onset analysis of FAERS reports.",
      "In silico drug discovery, with collaborators, for tuberculosis and breast cancer.",
    ],
  },
  {
    number: "02",
    title: "Tools",
    lines: [
      "DaivanLabs, founded June 2025. Code for Cure: code, healthcare tools, connections.",
      "StrokeSense AI Lab: interactive stroke education with an AI-assisted lab.",
      "StrokeSense: education-first stroke learning, built for the public.",
    ],
  },
  {
    number: "03",
    title: "Teaching and mentoring",
    lines: [
      "Speaker and mentor at KampusInovatif.id, September 2024 to February 2025.",
      "Scientific division, SMART FK UII, including scientific essay mentoring.",
      "Public speaking education at Seni.Bicara.",
    ],
  },
];

export default function Services() {
  return (
    <section
      aria-labelledby="services-heading"
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
          gap: 80px;
        }
        @media (max-width: 900px) {
          .svc-grid {
            grid-template-columns: 1fr;
            gap: 56px;
          }
        }
      `}</style>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <p
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
          {COLUMNS.map((column) => (
            <div
              key={column.number}
              style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                paddingTop: 24,
              }}
            >
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#98989C",
                  margin: "0 0 16px",
                }}
              >
                {column.number} / {column.title}
              </p>
              <h3
                style={{
                  fontSize: "clamp(28px, 3vw, 42px)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  fontWeight: 700,
                  margin: "0 0 20px",
                }}
              >
                {column.title}
              </h3>
              {column.lines.map((line) => (
                <p
                  key={line}
                  style={{
                    fontSize: 17,
                    lineHeight: 1.65,
                    color: "#D8D8D0",
                    margin: "0 0 16px",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
