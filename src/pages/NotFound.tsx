import { usePageTitle } from "../hooks/usePageTitle";

/**
 * Halaman 404 gaya MANUSKRIP: kertas putih, tinta hitam, satu aksen merah
 * pena editor, tanpa kartu, tanpa sudut membulat, tanpa ikon.
 * Tautan memakai anchor biasa supaya halaman ini tetap jalan tanpa router.
 */
export default function NotFound() {
  usePageTitle(
    "404 - Halaman tidak ditemukan | DaivanLabs",
    "Halaman yang dicari tidak ada di portfolio riset DaivanLabs. Kembali ke beranda untuk melihat riset dan tools.",
  );

  return (
    <main
      style={{
        backgroundColor: "#FFFFFF",
        color: "#0A0A0A",
        fontFamily: "Archivo, system-ui, sans-serif",
        margin: "0 auto",
        maxWidth: "720px",
        minHeight: "100vh",
        padding: "64px 24px",
      }}
    >
      <p
        style={{
          color: "#6F6F68",
          fontFamily: "IBM Plex Mono, ui-monospace, monospace",
          fontSize: "13px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        FIG. 404 - Halaman tidak ditemukan
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
        404<span style={{ color: "#C8102E" }}>.</span>
      </h1>

      <p
        style={{
          fontFamily: "Instrument Serif, Georgia, serif",
          fontSize: "24px",
          fontStyle: "italic",
          margin: "24px 0 0",
        }}
      >
        Naskah ini tidak ada di arsip.
      </p>

      <p style={{ fontSize: "17px", lineHeight: 1.65, margin: "24px 0 0" }}>
        Alamat yang dibuka tidak mengarah ke halaman mana pun di portfolio ini.
        Kemungkinan tautannya sudah berubah atau salah ketik.
      </p>

      <p style={{ borderTop: "1px solid #D8D8D0", marginTop: "40px", paddingTop: "24px" }}>
        <a
          href="/"
          style={{
            color: "#0A0A0A",
            fontWeight: 700,
            textDecoration: "underline",
            textDecorationColor: "#C8102E",
            textUnderlineOffset: "4px",
          }}
        >
          Kembali ke beranda
        </a>
      </p>
    </main>
  );
}
