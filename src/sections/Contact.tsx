const EMAIL = "daivanfebrijuansetiya@gmail.com";

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" style={styles.section}>
      <div style={styles.inner}>
        <h2 id="contact-heading" style={styles.giant}>
          Let&apos;s build together.
        </h2>
        <p style={styles.body}>
          Collaboration, supervision conversations, and project discussions
          are welcome. Send one email describing the work, who it is for,
          and its current status.
        </p>
        <a href={`mailto:${EMAIL}`} style={styles.action}>
          {EMAIL}
        </a>
        <p style={styles.links}>
          <a href="https://www.linkedin.com/in/daivan-febri-juan-setiya/" target="_blank" rel="noreferrer" style={styles.link}>
            LinkedIn
          </a>
          {" | "}
          <a href="https://orcid.org/0009-0000-2528-8459" target="_blank" rel="noreferrer" style={styles.link}>
            ORCID
          </a>
          {" | "}
          <a href="https://www.instagram.com/ddaiivan/" target="_blank" rel="noreferrer" style={styles.link}>
            Instagram
          </a>
        </p>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: "#F5F5F7",
    color: "#010101",
    padding: "130px 24px 200px",
  },
  inner: {
    maxWidth: 1160,
    margin: "0 auto",
  },
  giant: {
    margin: "0 0 40px",
    fontFamily: "'Inter Display', Inter, Arial, sans-serif",
    fontSize: "clamp(56px, 13vw, 200px)",
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: "-0.02em",
    overflowWrap: "break-word",
  },
  body: {
    margin: "0 0 40px",
    maxWidth: 620,
    fontFamily: "'Inter Display', Inter, Arial, sans-serif",
    fontSize: 18,
    lineHeight: 1.65,
    color: "#1D1D1F",
  },
  links: {
    margin: "32px 0 0",
    fontFamily: "'Inter Display', Inter, Arial, sans-serif",
    fontSize: 16,
    color: "#1D1D1F",
  },
  link: {
    color: "#0859D4",
    textDecoration: "none",
  },
  action: {
    display: "inline-block",
    fontFamily: "'Inter Display', Inter, Arial, sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: "#0859D4",
    textDecoration: "none",
    overflowWrap: "anywhere",
  },
};
