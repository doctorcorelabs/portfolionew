import { usePageTitle } from "../hooks/usePageTitle";

import { useEffect } from "react";

function useMvReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".mv-rv"));
    if (els.length === 0) return;
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("mv-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("mv-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -4% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const MV_CSS = `
.mv-rv {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 600ms ease, transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}
.mv-rv.mv-in {
  opacity: 1;
  transform: none;
}
.mv-link {
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0% 1px;
  background-repeat: no-repeat;
  background-position: 0 100%;
  transition: background-size 350ms ease;
  text-decoration: none;
}
.mv-link:hover, .mv-link:focus-visible {
  background-size: 100% 1px;
}
@media (prefers-reduced-motion: reduce) {
  .mv-rv {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .mv-link {
    transition: none;
  }
}
`;

/**
 * Halaman 404 gaya MANUSKRIP: kertas putih, tinta hitam, satu aksen merah
 * pena editor, tanpa kartu, tanpa sudut membulat, tanpa ikon.
 * Tautan memakai anchor biasa supaya halaman ini tetap jalan tanpa router.
 */
export default function NotFound() {
  useMvReveal();
  usePageTitle(
    "404 - Page not found | DaivanLabs",
    "The page you are looking for is not in the DaivanLabs research portfolio. Go back home to browse research and tools.",
  );

  return (
    <main
      style={{
        backgroundColor: "#FFFFFF",
        color: "#010101",
        fontFamily: "'Inter', system-ui, sans-serif",
        margin: "0 auto",
        maxWidth: "720px",
        minHeight: "100vh",
        padding: "64px 24px",
      }}
    >
      <style>{MV_CSS}</style>
      <p
        style={{
          color: "#666666",
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: "13px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        404 - Page not found
      </p>

      <h1
          data-mv
        style={{
          fontSize: "clamp(72px, 16vw, 160px)",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          lineHeight: 0.95,
          margin: "24px 0 0",
        }}
      >
        404<span style={{ color: "#0859D4" }}>.</span>
      </h1>

      <p
        data-mv
        style={{
          fontFamily: "'Inter', Georgia, serif",
          fontSize: "24px",
          fontStyle: "italic",
          margin: "24px 0 0",
          transitionDelay: "80ms",
        }}
      >
        This page is not in the archive.
      </p>

      <p data-mv style={{ fontSize: "17px", lineHeight: 1.65, margin: "24px 0 0", transitionDelay: "160ms" }}>
        The address you opened does not point to any page in this
        portfolio. The link may have changed or been mistyped.
      </p>

      <p style={{ borderTop: "1px solid #E0E0E0", marginTop: "40px", paddingTop: "24px" }}>
        <a
          href="/"
          className="mv-link"
          style={{
            color: "#010101",
            fontWeight: 700,
          }}
        >
          Back to home
        </a>
      </p>
    </main>
  );
}
