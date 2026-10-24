const ink = "#0A0A0A";
const paper = "#FFFFFF";
const archive = "#F2F2EF";
const graphite = "#3C3C38";
const marginGrey = "#6F6F68";
const hairline = "#D8D8D0";
const red = "#C8102E";
const mono = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
const display = "Archivo, Inter, -apple-system, 'Segoe UI', sans-serif";

const affiliations = [
  {
    name: "Universitas Islam Indonesia",
    context: "Bachelor of Medicine, 2021 to present",
    role: "Place of study",
  },
  {
    name: "Chulalongkorn University",
    context: "Summer School Program, Pharmaceutical and Clinical Development (AASP-PECT), 2025",
    role: "Place of study",
  },
  {
    name: "World Health Organization",
    context: "Courses completed, 2024",
    role: "Course provider",
  },
  {
    name: "Beasiswa Unggulan",
    context: "Scholarship awardee, Ministry of Education, Culture, Research, and Technology, since 2023",
    role: "Scholarship program",
  },
  {
    name: "Korean Society of Hypertension",
    context: "Hypertension Seoul 2026, poster ABST-000034 accepted",
    role: "Congress",
  },
];

export default function Affiliations() {
  return (
    <section
      aria-label="Study and affiliation"
      style={{
        background: archive,
        color: ink,
        fontFamily: display,
        padding: "72px 24px",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <p
          style={{
            margin: 0,
            fontFamily: mono,
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: marginGrey,
          }}
        >
          FIG. 07 - Affiliation
        </p>
        <h2
          style={{
            margin: "16px 0 8px",
            fontSize: "clamp(48px, 8vw, 104px)",
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
          }}
        >
          where I study<span style={{ color: red }}>.</span>
        </h2>
        <p
          style={{
            margin: "0 0 40px",
            maxWidth: 560,
            fontSize: 18,
            lineHeight: 1.65,
            color: graphite,
          }}
        >
          Places of study and affiliation. This is a personal portfolio, so
          these institutions are not clients, and they are not presented as
          clients anywhere on this page.
        </p>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 0,
            borderTop: `1px solid ${hairline}`,
            borderLeft: `1px solid ${hairline}`,
          }}
        >
          {affiliations.map((item) => (
            <li
              key={item.name}
              style={{
                background: paper,
                padding: "24px",
                borderRight: `1px solid ${hairline}`,
                borderBottom: `1px solid ${hairline}`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: mono,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: red,
                }}
              >
                {item.role}
              </p>
              <p
                style={{
                  margin: "12px 0 6px",
                  fontSize: 20,
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                {item.name}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: graphite,
                }}
              >
                {item.context}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
