import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const INK = "#010101";
const GREY = "#1d1d1f";
const BLUE = "#0859D4";
const HAIRLINE = "#e0e0e0";
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
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 721px)");
    const onChange = () => {
      if (query.matches) setMenuOpen(false);
    };
    onChange();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return (
    <>
      <style>{`
        /* Dotted-underline hover motif (site-wide 1px square-tile
           motif): a repeating-gradient rule under each nav link
           that draws left-to-right over 300ms on hover and on
           keyboard focus. The wordmark is untouched; only nav
           links carry this treatment. */
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
        }
        /* Wordmark size lives here (not inline). Desktop value
           unchanged: wordmark 20px. */
        .hdr-logo {
          font-size: 20px;
        }
        /* Mobile menu button and panel: hidden by default, shown only
           at 720px and below. The button sits in its own row under the
           logo row. */
        .hdr-menu-btn {
          display: none;
        }
        .hdr-mobile-nav {
          display: none;
        }
        @media (max-width: 720px) {
          .onlines-nav { display: none; }
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
          .hdr-mobile-nav a.hdr-mobile-link + a.hdr-mobile-link {
            border-top: 1px solid ${HAIRLINE};
          }
          .hdr-mobile-nav a.hdr-mobile-link:hover {
            color: ${BLUE};
          }
          .hdr-mobile-nav a.hdr-mobile-link:focus-visible {
            outline: 2px solid ${BLUE};
            outline-offset: -2px;
          }
        }
        /* Belt and braces: a menu opened on a phone must vanish if the
           viewport is widened past the phone breakpoint. */
        @media (min-width: 721px) {
          .hdr-menu-btn { display: none; }
          .hdr-mobile-nav { display: none; }
        }
        /* Tablets 721-1160px: taller nav tap targets (about 44px) while
           keeping the dotted underline 3px below the text. */
        @media (min-width: 721px) and (max-width: 1160px) {
          .onlines-nav a.hdr-nav-link {
            padding: 12px 0 13px;
            background-position: 0 calc(100% - 10px);
          }
        }
        /* Safety band 721-800px: slightly smaller links and gaps so the
           single row fits with slack at the narrow end. The !important
           flags are required because the nav font size and gap are set
           inline below. */
        @media (min-width: 721px) and (max-width: 800px) {
          .onlines-nav a.hdr-nav-link {
            font-size: 14px !important;
          }
          .onlines-nav {
            column-gap: 20px !important;
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
              flexWrap: "nowrap",
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
          {menuOpen ? "Close" : "Menu"}
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
    </>
  );
}
