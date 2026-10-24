const EMAIL = "daivanfebrijuansetiya@gmail.com";

const indexLinks = [
  { label: "Research", href: "#research" },
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Honors", href: "#honors" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

// Elsewhere contains only links verified live at build time: the
// StrokeSense AI Lab site and the doctorcorelabs GitHub organisation.
const elsewhereLinks = [
  { label: "StrokeSense AI Lab", href: "https://strokesenseai.daivanlabs.com" },
  { label: "GitHub - doctorcorelabs", href: "https://github.com/doctorcorelabs" },
];

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.brand}>DaivanLabs.</p>
      <p style={styles.line}>
        Research and healthcare tools from Indonesia. Code for Cure.
      </p>
      <div style={styles.columns}>
        <nav aria-label="Footer index" style={styles.column}>
          <h3 style={styles.columnHeading}>Index</h3>
          <ul style={styles.list}>
            {indexLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} style={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div style={styles.column}>
          <h3 style={styles.columnHeading}>Contact</h3>
          <a href={`mailto:${EMAIL}`} style={styles.link}>
            {EMAIL}
          </a>
        </div>
        <nav aria-label="Elsewhere" style={styles.column}>
          <h3 style={styles.columnHeading}>Elsewhere</h3>
          <ul style={styles.list}>
            {elsewhereLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.link}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p style={styles.copyright}>
        &copy; 2026 Daivan Febri Juan Setiya - DaivanLabs. All rights reserved.
      </p>
      <p style={styles.smallPrint}>
        Ad maiora natus sum - born for greater things.
      </p>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    background: "#0A0A0A",
    color: "#FFFFFF",
    padding: "72px 24px 40px",
  },
  brand: {
    margin: "0 0 12px",
    fontSize: "clamp(48px, 8vw, 96px)",
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: "-0.03em",
  },
  line: {
    margin: "0 0 48px",
    fontSize: 18,
    lineHeight: 1.6,
    color: "#D8D8D0",
  },
  columns: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 32,
    borderTop: "1px solid #3C3C38",
    paddingTop: 32,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  columnHeading: {
    margin: 0,
    fontFamily: "IBM Plex Mono, ui-monospace, monospace",
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#6F6F68",
  },
  list: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  link: {
    color: "#FFFFFF",
    textDecoration: "none",
    overflowWrap: "anywhere",
  },
  copyright: {
    margin: "48px 0 8px",
    fontFamily: "IBM Plex Mono, ui-monospace, monospace",
    fontSize: 13,
    lineHeight: 1.6,
    color: "#D8D8D0",
  },
  smallPrint: {
    margin: 0,
    fontFamily: "IBM Plex Mono, ui-monospace, monospace",
    fontSize: 13,
    fontStyle: "italic",
    lineHeight: 1.6,
    color: "#6F6F68",
  },
};
