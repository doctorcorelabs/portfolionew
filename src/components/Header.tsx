import { useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <style>{`
        /* Dotted-underline hover motif (site-wide 1px square-tile
           motif): a repeating-gradient rule under each nav link
           that draws left-to-right over 300ms on hover and on
           keyboard focus. The wordmark and the fixed CTA are
           untouched; only nav links carry this treatment. */
        .onlines-nav a.hdr-nav-link {
          background-image: repeating-linear-gradient(to right, ${BLUE} 0 1px, transparent 1px 4px);
          background-size: 0% 1px;
          background-repeat: no-repeat;
          background-position: 0 100%;
          padding-bottom: 3px;
          transition: background-size 300ms ease, color 300ms ease;
        }
        .onlines-nav a.hdr-nav-link:hover,
        .onlines-nav a.hdr-nav-link:focus-visible {
          background-size: 100% 1px;
          color: ${BLUE};
        }
        @media (prefers-reduced-motion: reduce) {
          .onlines-nav a.hdr-nav-link {
            transition: none;
          }
          .hdr-cta-pulse {
            animation: none;
          }
        }
        /* Soft glow pulse for the fixed CTA pill only: the shadow
           breathes from transparent to a soft blue glow over 5s,
           ease-in-out, infinite alternate. Slow enough to read as
           breathing, never flashing. Wordmark and nav links get no
           pulse. */
        @keyframes hdr-cta-glow {
          from {
            box-shadow: 0 0 0 rgba(8, 89, 212, 0);
          }
          to {
            box-shadow: 0 0 24px rgba(8, 89, 212, 0.45);
          }
        }
        .hdr-cta-pulse {
          animation: hdr-cta-glow 5s ease-in-out infinite alternate;
        }
        /* Wordmark and fixed CTA sizes live here (not inline) so the
           narrow-phone rule below can override them. Desktop values
           are unchanged: wordmark 20px, CTA 14px with 10px 18px. */
        .hdr-logo {
          font-size: 20px;
        }
        .hdr-cta-pulse {
          font-size: 14px;
          padding: 10px 18px;
        }
        /* Mobile menu button and panel: hidden by default, shown only
           at 720px and below. The button sits in its own row under the
           logo row so the fixed CTA (top band) never covers it. */
        .hdr-menu-btn {
          display: none;
        }
        .hdr-mobile-nav {
          display: none;
        }
        @media (max-width: 720px) {
          .onlines-nav { display: none; }
          .onlines-cta-spacer { display: none; }
          .hdr-menu-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            min-height: 44px;
            padding: 0 24px;
            background: #ffffff;
            border: 0;
            border-top: 1px solid ${HAIRLINE};
            color: ${INK};
            cursor: pointer;
            font-family: 'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif;
            font-size: 15px;
            font-weight: 600;
            text-align: left;
          }
          .hdr-menu-btn:focus-visible {
            outline: 2px solid ${BLUE};
            outline-offset: -2px;
          }
          .hdr-mobile-nav {
            display: block;
            border-top: 1px solid ${HAIRLINE};
          }
          .hdr-mobile-nav a.hdr-mobile-link {
            display: flex;
            align-items: center;
            min-height: 44px;
            padding: 0 24px;
            color: ${GREY};
            font-family: 'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif;
            font-size: 15px;
            text-decoration: none;
          }
        }
        /* Belt and braces: a menu opened on a phone must vanish if the
           viewport is widened past the phone breakpoint. */
        @media (min-width: 721px) {
          .hdr-menu-btn { display: none; }
          .hdr-mobile-nav { display: none; }
        }
        /* Narrow phones 320-400px: shrink the wordmark and the CTA pill
           so the fixed CTA clears the wordmark tail with a positive gap.
           At 320px: logo right about 137px, CTA left about 146px. */
        @media (max-width: 400px) {
          .hdr-logo { font-size: 18px; }
          .hdr-cta-pulse { font-size: 12px; padding: 8px 12px; }
        }
        /* Tablets 721-1023px: taller nav tap targets (about 37px) while
           keeping the dotted underline 3px below the text. */
        @media (min-width: 721px) and (max-width: 1023px) {
          .onlines-nav a.hdr-nav-link {
            padding: 8px 0 11px;
            background-position: 0 calc(100% - 8px);
          }
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
            className="hdr-logo"
            style={{
              fontFamily: "'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif",
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
              columnGap: 24,
              rowGap: 8,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hdr-nav-link"
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
        <button
          type="button"
          className="hdr-menu-btn"
          aria-expanded={menuOpen}
          aria-controls="hdr-mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span
            aria-hidden="true"
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            <span style={{ display: "block", width: 18, height: 2, background: INK }} />
            <span style={{ display: "block", width: 18, height: 2, background: INK }} />
            <span style={{ display: "block", width: 18, height: 2, background: INK }} />
          </span>
          Menu
        </button>
        {menuOpen && (
          <nav
            id="hdr-mobile-nav"
            aria-label="Mobile"
            className="hdr-mobile-nav"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hdr-mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <a
        href={`mailto:${EMAIL}`}
        className="hdr-cta-pulse"
        style={{
          position: "fixed",
          top: 14,
          right: "max(16px, calc((100vw - 1160px) / 2))",
          zIndex: 100,
          background: BLUE,
          color: "#ffffff",
          fontFamily: "'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Start a conversation
      </a>
    </>
  );
}
