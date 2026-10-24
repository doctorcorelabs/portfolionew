const EMAIL = "daivanfebrijuansetiya@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/daivan-febri-juan-setiya/";
const ORCID = "https://orcid.org/0009-0000-2528-8459";
const INSTAGRAM = "https://www.instagram.com/ddaiivan/";

const pageLinks = [
  { label: "Research", href: "/research" },
  { label: "Awards", href: "/awards" },
  { label: "Experience", href: "/experience" },
  { label: "Education", href: "/education" },
  { label: "Certifications", href: "/certifications" },
  { label: "Contact", href: "/#contact" },
];

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <p style={styles.line}>
          DaivanLabs. - Research and healthcare tools from Indonesia. Code
          for Cure.
        </p>
        <p style={styles.line}>
          &copy; 2026 Daivan Febri Juan Setiya
        </p>
        <p style={styles.line}>
          Faculty of Medicine, Universitas Islam Indonesia
        </p>
        <nav aria-label="Footer" style={styles.nav}>
          {pageLinks.map((link) => (
            <a key={link.label} href={link.href} style={styles.link}>
              {link.label}
            </a>
          ))}
          <a href={`mailto:${EMAIL}`} style={styles.link}>
            {EMAIL}
          </a>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            style={styles.link}
          >
            LinkedIn
          </a>
          <a href={ORCID} target="_blank" rel="noreferrer" style={styles.link}>
            ORCID
          </a>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" style={styles.link}>
            Instagram
          </a>
        </nav>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    background: "#FFFFFF",
    color: "rgba(66, 66, 66, 0.6)",
    borderTop: "1px solid #E0E0E0",
    padding: "40px 24px",
  },
  inner: {
    maxWidth: 1160,
    margin: "0 auto",
  },
  line: {
    margin: "0 0 12px",
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    lineHeight: 1.7,
  },
  nav: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px 24px",
    marginTop: 24,
  },
  link: {
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(66, 66, 66, 0.6)",
    textDecoration: "none",
    overflowWrap: "anywhere",
  },
};
