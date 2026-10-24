const EMAIL = "daivanfebrijuansetiya@gmail.com";

const facts = [
  { label: "Location", value: "Indonesia" },
  { label: "University", value: "Islamic University of Indonesia" },
  { label: "Interests", value: "Research, Public Health, Cancer" },
  { label: "Email", value: EMAIL },
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" style={styles.section}>
      <p style={styles.kicker}>FIG. 08 - ABOUT</p>
      <h2 id="about-heading" style={styles.giant}>
        about.
      </h2>
      <div style={styles.layout}>
        <div style={styles.narrative}>
          <p style={styles.paragraph}>
            Guided by the principle &ldquo;Ad maiora natus sum&rdquo;, Latin for
            &ldquo;I was born for greater things&rdquo;, I see medicine as a path
            to service that lasts longer than a single consultation.
          </p>
          <p style={styles.paragraph}>
            I am a medical student at the Islamic University of Indonesia, with
            research interests in public health and cancer. My goal is to move
            beyond immediate solutions and contribute to health systems in
            Indonesia that hold up over time, through research that is careful,
            tools that are useful, and work that is finished properly.
          </p>
        </div>
        <dl style={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label} style={styles.factRow}>
              <dt style={styles.factLabel}>{fact.label}</dt>
              <dd style={styles.factValue}>
                {fact.label === "Email" ? (
                  <a href={`mailto:${EMAIL}`} style={styles.link}>
                    {EMAIL}
                  </a>
                ) : (
                  fact.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: "#FFFFFF",
    color: "#0A0A0A",
    borderTop: "1px solid #D8D8D0",
    padding: "72px 24px",
  },
  kicker: {
    margin: "0 0 16px",
    fontFamily: "IBM Plex Mono, ui-monospace, monospace",
    fontSize: 13,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#6F6F68",
  },
  giant: {
    margin: "0 0 40px",
    fontSize: "clamp(64px, 12vw, 160px)",
    fontWeight: 900,
    lineHeight: 0.95,
    letterSpacing: "-0.03em",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "7fr 3fr",
    gap: 48,
    alignItems: "start",
  },
  narrative: {
    maxWidth: 620,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  paragraph: {
    margin: 0,
    fontSize: 18,
    lineHeight: 1.65,
    color: "#3C3C38",
  },
  facts: {
    margin: 0,
    borderTop: "1px solid #D8D8D0",
  },
  factRow: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "16px 0",
    borderBottom: "1px solid #D8D8D0",
  },
  factLabel: {
    fontFamily: "IBM Plex Mono, ui-monospace, monospace",
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#6F6F68",
  },
  factValue: {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.5,
  },
  link: {
    color: "#0A0A0A",
    textDecoration: "underline",
    textDecorationColor: "#C8102E",
    textUnderlineOffset: 3,
    overflowWrap: "anywhere",
  },
};
