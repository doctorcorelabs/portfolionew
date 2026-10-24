import { usePageTitle } from "../hooks/usePageTitle";

/**
 * Halaman 404 gaya MANUSKRIP: kertas putih, tinta hitam, satu aksen merah
 * pena editor, tanpa kartu, tanpa sudut membulat, tanpa ikon.
 * Tautan memakai anchor biasa supaya halaman ini tetap jalan tanpa router.
 */
export default function NotFound() {
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
        style={{
          fontFamily: "'Inter', Georgia, serif",
          fontSize: "24px",
          fontStyle: "italic",
          margin: "24px 0 0",
        }}
      >
        This page is not in the archive.
      </p>

      <p style={{ fontSize: "17px", lineHeight: 1.65, margin: "24px 0 0" }}>
        The address you opened does not point to any page in this
        portfolio. The link may have changed or been mistyped.
      </p>

      <p style={{ borderTop: "1px solid #E0E0E0", marginTop: "40px", paddingTop: "24px" }}>
        <a
          href="/"
          style={{
            color: "#010101",
            fontWeight: 700,
            textDecoration: "underline",
            textDecorationColor: "#0859D4",
            textUnderlineOffset: "4px",
          }}
        >
          Back to home
        </a>
      </p>
    </main>
  );
}
