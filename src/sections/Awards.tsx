const ink = "#0A0A0A";
const paper = "#FFFFFF";
const graphite = "#3C3C38";
const marginGrey = "#6F6F68";
const hairline = "#D8D8D0";
const red = "#C8102E";
const mono = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
const display = "Archivo, Inter, -apple-system, 'Segoe UI', sans-serif";

const awards = [
  {
    title: "Most Outstanding Student 2025",
    giver: "Universitas Islam Indonesia",
    year: "2025",
  },
  {
    title: "Gold Medal, International Science and Invention Fair (ISIF)",
    giver: "International science and invention competition",
    year: "2025",
  },
  {
    title: "Gold Medal, World Robotics and Computer Science Olympiad (WRCSO)",
    giver: "International robotics and computer science competition",
    year: "2025",
  },
  {
    title: "Beasiswa Unggulan Awardee",
    giver: "Ministry of Education, Culture, Research, and Technology",
    year: "2023",
  },
];

export default function Awards() {
  return (
    <section
      aria-label="Honors and awards"
      style={{
        background: paper,
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
          FIG. 06 - Honors
        </p>
        <h2
          style={{
            margin: "16px 0 8px",
            fontSize: "clamp(56px, 10vw, 120px)",
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
          }}
        >
          honors<span style={{ color: red }}>.</span>
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
          A short strip of recognition for academic work. Each entry names the
          awarding body and the year, and nothing more.
        </p>
        <div style={{ borderTop: `1px solid ${hairline}` }}>
          {awards.map((award) => (
            <div
              key={award.title}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 16,
                alignItems: "baseline",
                padding: "20px 0",
                borderBottom: `1px solid ${hairline}`,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 700,
                    lineHeight: 1.3,
                  }}
                >
                  {award.title}
                </p>
                <p
                  style={{
                    margin: "6px 0 0",
                    fontFamily: mono,
                    fontSize: 13,
                    color: marginGrey,
                  }}
                >
                  {award.giver}
                </p>
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: mono,
                  fontSize: 14,
                  fontWeight: 500,
                  color: ink,
                }}
              >
                {award.year}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
