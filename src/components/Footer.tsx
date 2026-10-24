import { useEffect, useRef, useState } from "react";

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
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      style={styles.footer}
      ref={rootRef}
      className={`footer-mv-root${inView ? " is-inview" : ""}`}
    >
      <style>{`
        .footer-mv-root .footer-mv-line {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 700ms ease, transform 700ms ease;
        }
        .footer-mv-root.is-inview .footer-mv-line {
          opacity: 1;
          transform: translateY(0);
        }
        .footer-mv-root .footer-mv-nav {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 700ms ease 270ms, transform 700ms ease 270ms;
        }
        .footer-mv-root.is-inview .footer-mv-nav {
          opacity: 1;
          transform: translateY(0);
        }
        .footer-mv-root .footer-mv-link {
          background-image: linear-gradient(currentColor, currentColor);
          background-repeat: no-repeat;
          background-position: 0 100%;
          background-size: 0% 1px;
          transition: background-size 350ms ease;
        }
        .footer-mv-root .footer-mv-link:hover {
          background-size: 100% 1px;
        }
        @media (prefers-reduced-motion: reduce) {
          .footer-mv-root .footer-mv-line,
          .footer-mv-root .footer-mv-nav,
          .footer-mv-root .footer-mv-link {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
            background-size: 100% 1px;
          }
          /* Dash travel off: the dotted rule stays static. */
          .footer-mv-root .footer-dotted-rule {
            animation: none !important;
          }
        }
        /* Dotted motif: 1px square tiles from a repeating gradient,
           matching the section title rules elsewhere on the site. */
        .footer-dotted-rule {
          width: 160px;
          height: 1px;
          background-image: repeating-linear-gradient(to right, rgba(1, 1, 1, 0.55) 0 1px, transparent 1px 4px);
          background-size: 4px 1px;
          background-repeat: repeat-x;
          /* Active motion, rule only: the 4px tile period shifts one
             full period per loop, so the dashes travel seamlessly. */
          animation: footer-dash-travel 10s linear infinite;
        }
        @keyframes footer-dash-travel {
          from { background-position-x: 0; }
          to { background-position-x: 4px; }
        }
      `}</style>
      <div style={styles.inner}>
        <div
          aria-hidden="true"
          className="footer-mv-line footer-dotted-rule"
          style={{ margin: "0 0 24px" }}
        />
        <p className="footer-mv-line" style={{ ...styles.line, transitionDelay: "0ms" }}>
          DaivanLabs. - Research and healthcare tools from Indonesia. Code
          for Cure.
        </p>
        <p className="footer-mv-line" style={{ ...styles.line, transitionDelay: "90ms" }}>
          &copy; 2026 Daivan Febri Juan Setiya
        </p>
        <p className="footer-mv-line" style={{ ...styles.line, transitionDelay: "180ms" }}>
          Faculty of Medicine, Universitas Islam Indonesia
        </p>
        <nav aria-label="Footer" style={styles.nav} className="footer-mv-nav">
          {pageLinks.map((link) => (
            <a key={link.label} href={link.href} style={styles.link} className="footer-mv-link">
              {link.label}
            </a>
          ))}
          <a href={`mailto:${EMAIL}`} style={styles.link} className="footer-mv-link">
            {EMAIL}
          </a>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            style={styles.link}
            className="footer-mv-link"
          >
            LinkedIn
          </a>
          <a href={ORCID} target="_blank" rel="noreferrer" style={styles.link} className="footer-mv-link">
            ORCID
          </a>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" style={styles.link} className="footer-mv-link">
            Instagram
          </a>
          <a
            href="#top"
            style={styles.link}
            className="footer-mv-link"
            onClick={(event) => {
              event.preventDefault();
              const reduced = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
              ).matches;
              window.scrollTo({
                top: 0,
                behavior: reduced ? "auto" : "smooth",
              });
            }}
          >
            Back to top
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
