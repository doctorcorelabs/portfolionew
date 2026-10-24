/**
 * Affiliations: the Onlines monochrome logo wall, translated honestly.
 * Institutions are shown as TEXT wordmarks only. No institution logo is
 * fabricated, and no Onlines client logo is copied. Each wordmark carries
 * a small label stating the real relationship, so nothing reads as an
 * endorsement or a client relationship.
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
        <ul
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
          {affiliations.map((entry) => (
            <li key={entry.name} style={{ maxWidth: 260 }}>
              <span
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
