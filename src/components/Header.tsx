import { Link } from "react-router-dom";

const INK = "#010101";
const GREY = "#1d1d1f";
const BLUE = "#0859D4";
const HAIRLINE = "#e0e0e0";
const EMAIL = "daivanfebrijuansetiya@gmail.com";

const NAV_LINKS = [
  { to: "/research", label: "Research" },
  { to: "/awards", label: "Awards" },
  { to: "/experience", label: "Experience" },
  { to: "/education", label: "Education" },
  { to: "/certifications", label: "Certifications" },
  { to: "/#contact", label: "Contact" },
];

export default function Header() {
  return (
    <>
      <style>{`
        .onlines-nav a:hover { color: ${BLUE}; }
        @media (max-width: 720px) {
          .onlines-nav { display: none; }
          .onlines-cta-spacer { display: none; }
        }
      `}</style>
      <header
        style={{
          background: "#ffffff",
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <Link
            to="/"
            style={{
              fontFamily: "'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: INK,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            DaivanLabs.
          </Link>
          <nav
            aria-label="Primary"
            className="onlines-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontFamily: "'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif",
                  fontSize: 15,
                  color: GREY,
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div
            className="onlines-cta-spacer"
            aria-hidden="true"
            style={{ width: 200, flexShrink: 0 }}
          />
        </div>
      </header>
      <a
        href={`mailto:${EMAIL}`}
        style={{
          position: "fixed",
          top: 14,
          right: "max(16px, calc((100vw - 1160px) / 2))",
          zIndex: 100,
          background: BLUE,
          color: "#ffffff",
          fontFamily: "'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif",
          fontSize: 14,
          fontWeight: 600,
          padding: "10px 18px",
          textDecoration: "none",
        }}
      >
        Start a conversation
      </a>
    </>
  );
}
