const EMAIL = "daivanfebrijuansetiya@gmail.com";

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" style={styles.section}>
      <p style={styles.kicker}>FIG. 09 - CONTACT</p>
      <h2 id="contact-heading" style={styles.giant}>
        together.
      </h2>
      <p style={styles.body}>
        Have a research question, an academic project, or an idea for a
        healthcare tool? The clearest way to start is one email that says what
        the work is, who it is for, and where it currently stands.
        Collaboration, supervision conversations, and project discussions are
        all welcome through that door.
      </p>
      <a href={`mailto:${EMAIL}`} style={styles.button}>
        {EMAIL}
      </a>
      <p style={styles.small}>
        Based in Indonesia. Replies go to the address above, which is the
        contact published on this site.
      </p>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: "#F2F2EF",
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
    margin: "0 0 32px",
    fontSize: "clamp(64px, 12vw, 160px)",
    fontWeight: 900,
    lineHeight: 0.95,
    letterSpacing: "-0.03em",
  },
  body: {
    margin: "0 0 32px",
    maxWidth: 620,
    fontSize: 18,
    lineHeight: 1.65,
    color: "#3C3C38",
  },
  button: {
    display: "inline-block",
    background: "#0A0A0A",
    color: "#FFFFFF",
    padding: "16px 24px",
    fontSize: 16,
    fontWeight: 600,
    textDecoration: "none",
    overflowWrap: "anywhere",
  },
  small: {
    margin: "24px 0 0",
    fontFamily: "IBM Plex Mono, ui-monospace, monospace",
    fontSize: 13,
    lineHeight: 1.6,
    color: "#6F6F68",
  },
};
