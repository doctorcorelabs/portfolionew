/**
 * Komponen presentasi untuk canvas DEV-only.
 *
 * Catatan arsitektur yang jujur: di workdir ini belum ada komponen produksi
 * di src/components/, jadi varian canvas untuk putaran pertama dirender dari
 * komponen di file ini (di bawah src/dev/). Komponen-komponen ini menerima
 * semua nilai visual lewat props dengan nilai bawaan statis, dan TIDAK
 * pernah mengimpor dialkit. Saat tugas homepage selesai, komponen terpilih
 * wajib dipindah ke komponen produksi dan registry dialihkan ke sana, baru
 * file ini boleh dihapus. Sampai saat itu, varian ini adalah kandidat
 * desain, bukan komponen produksi final.
 *
 * Semua teks di sini adalah copy sintetis atau copy arah desain, bukan
 * klaim riset. Data karya berasal dari synthetic-data.ts.
 */

import type { CSSProperties } from "react";
import {
  forestPlotSintetis,
  karyaSintetis,
} from "./synthetic-data";

const INK = "#0A0A0A";
const GRAPHITE = "#3C3C38";
const MARGIN_GREY = "#6F6F68";
const HAIRLINE = "#D8D8D0";
const PAPER = "#FFFFFF";
const ARCHIVE = "#F2F2EF";
const ACCENT_DEFAULT = "#C8102E";

export interface HeroValues {
  kataRaksasaSize: number;
  headlineSize: number;
  headlineLineHeight: number;
  headlineTracking: number;
  headlineIndent: number;
  heroGap: number;
  heroPaddingTop: number;
  heroPaddingBottom: number;
  metaSize: number;
  aksen: string;
}

export const heroDefaults: HeroValues = {
  kataRaksasaSize: 180,
  headlineSize: 64,
  headlineLineHeight: 1.02,
  headlineTracking: -0.02,
  heroGap: 28,
  headlineIndent: 72,
  heroPaddingTop: 96,
  heroPaddingBottom: 80,
  metaSize: 13,
  aksen: ACCENT_DEFAULT,
};

export function HeroEditorialRaksasa(props: Partial<HeroValues> = {}) {
  const v: HeroValues = { ...heroDefaults, ...props };
  const sectionStyle: CSSProperties = {
    background: PAPER,
    color: INK,
    padding: `${v.heroPaddingTop}px 48px ${v.heroPaddingBottom}px`,
    display: "flex",
    flexDirection: "column",
    gap: v.heroGap,
    fontFamily: "Archivo, system-ui, sans-serif",
    height: "100%",
    boxSizing: "border-box",
  };
  return (
    <section style={sectionStyle}>
      <p
        style={{
          margin: 0,
          fontFamily: "IBM Plex Mono, ui-monospace, monospace",
          fontSize: v.metaSize,
          letterSpacing: "0.08em",
          color: MARGIN_GREY,
          textTransform: "uppercase",
        }}
      >
        Fig. 00 - Portfolio contoh, data sintetis
      </p>
      <h1
        style={{
          margin: 0,
          fontSize: v.kataRaksasaSize,
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
          fontWeight: 900,
        }}
      >
        riset<span style={{ color: v.aksen }}>.</span>
      </h1>
      <h2
        style={{
          margin: 0,
          fontSize: v.headlineSize,
          lineHeight: v.headlineLineHeight,
          letterSpacing: `${v.headlineTracking}em`,
          fontWeight: 800,
        }}
      >
        Pertanyaan kesehatan
        <br />
        <span style={{ paddingLeft: v.headlineIndent }}>
          diubah jadi bukti
        </span>
        <br />
        yang bisa dibaca.
      </h2>
      <p
        style={{
          margin: 0,
          maxWidth: 560,
          fontSize: 18,
          lineHeight: 1.65,
          color: GRAPHITE,
        }}
      >
        Satu kata raksasa, satu kalimat misi, lalu bukti. Ini varian kandidat
        gaya editorial untuk hero portfolio riset, dirender dengan data
        sintetis di canvas saja.
      </p>
      <p
        style={{
          margin: 0,
          fontFamily: "IBM Plex Mono, ui-monospace, monospace",
          fontSize: v.metaSize,
          color: MARGIN_GREY,
        }}
      >
        Lab Contoh - Sejak 2025 - Data sintetis
      </p>
    </section>
  );
}

export interface ManifestoValues {
  headlineSize: number;
  heroGap: number;
  heroPaddingTop: number;
  heroPaddingBottom: number;
  metaSize: number;
  aksen: string;
}

export const manifestoDefaults: ManifestoValues = {
  headlineSize: 64,
  heroGap: 28,
  heroPaddingTop: 96,
  heroPaddingBottom: 80,
  metaSize: 13,
  aksen: ACCENT_DEFAULT,
};

export function HeroManifestoDuaKolom(props: Partial<ManifestoValues> = {}) {
  const v: ManifestoValues = { ...manifestoDefaults, ...props };
  return (
    <section
      style={{
        background: PAPER,
        color: INK,
        padding: `${v.heroPaddingTop}px 48px ${v.heroPaddingBottom}px`,
        fontFamily: "Archivo, system-ui, sans-serif",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64 }}>
        <h2
          style={{
            margin: 0,
            fontSize: v.headlineSize,
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            fontWeight: 800,
          }}
        >
          Riset yang diukur,
          <br />
          bukan yang diklaim.
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: v.heroGap }}>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.65, color: GRAPHITE }}>
            Manifesto kandidat: dari pertanyaan klinis ke data, dari data ke
            visualisasi, dari visualisasi ke alat yang bisa dipakai belajar.
            Tiga kata kunci teks di bawah ini adalah arah kerja, bukan kartu
            produk.
          </p>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.65 }}>
            Code <span style={{ color: v.aksen }}>-</span> Cure{" "}
            <span style={{ color: v.aksen }}>-</span> Connect
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "IBM Plex Mono, ui-monospace, monospace",
              fontSize: v.metaSize,
              color: MARGIN_GREY,
            }}
          >
            Indeks contoh: 06 karya sintetis - 03 jenis studi - Data sintetis
          </p>
        </div>
      </div>
    </section>
  );
}

export interface KartuValues {
  rowPaddingY: number;
  judulSize: number;
  judulLineHeight: number;
  metaSize: number;
  nomorSize: number;
  borderWidth: number;
  hoverShiftX: number;
}

export const kartuDefaults: KartuValues = {
  rowPaddingY: 22,
  judulSize: 22,
  judulLineHeight: 1.25,
  metaSize: 12.5,
  nomorSize: 44,
  borderWidth: 1,
  hoverShiftX: 6,
};

export function KartuRisetIndeksBaris(props: Partial<KartuValues> = {}) {
  const v: KartuValues = { ...kartuDefaults, ...props };
  return (
    <section
      style={{
        background: PAPER,
        color: INK,
        padding: "40px 48px",
        fontFamily: "Archivo, system-ui, sans-serif",
        height: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <p
        style={{
          margin: "0 0 24px",
          fontFamily: "IBM Plex Mono, ui-monospace, monospace",
          fontSize: v.metaSize,
          letterSpacing: "0.08em",
          color: MARGIN_GREY,
          textTransform: "uppercase",
        }}
      >
        Fig. 01 - Indeks karya, data sintetis
      </p>
      <div>
        {karyaSintetis.map((karya) => (
          <article
            key={karya.id}
            style={{
              display: "grid",
              gridTemplateColumns: `${v.nomorSize + 24}px 1fr auto`,
              gap: 24,
              alignItems: "baseline",
              padding: `${v.rowPaddingY}px 0`,
              borderTop: `${v.borderWidth}px solid ${HAIRLINE}`,
            }}
          >
            <span style={{ fontSize: v.nomorSize, fontWeight: 900, lineHeight: 1 }}>
              {karya.nomor}
            </span>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: v.judulSize,
                  lineHeight: v.judulLineHeight,
                  fontWeight: 700,
                }}
              >
                {karya.judul}
              </h3>
              <p
                style={{
                  margin: "8px 0 0",
                  fontFamily: "IBM Plex Mono, ui-monospace, monospace",
                  fontSize: v.metaSize,
                  color: MARGIN_GREY,
                }}
              >
                {karya.venue} - {karya.jenisStudi}
              </p>
            </div>
            <span
              style={{
                fontFamily: "IBM Plex Mono, ui-monospace, monospace",
                fontSize: v.metaSize,
                color: GRAPHITE,
                textAlign: "right",
              }}
            >
              {karya.tahun} - {karya.status}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export interface VizValues {
  sectionPaddingY: number;
  strokeWidth: number;
  ciStrokeWidth: number;
  pointRadius: number;
  rowHeight: number;
  labelSize: number;
  angkaSize: number;
  showGrid: boolean;
  aksenGrafik: string;
}

export const vizDefaults: VizValues = {
  sectionPaddingY: 96,
  strokeWidth: 1.5,
  ciStrokeWidth: 2,
  pointRadius: 5,
  rowHeight: 44,
  labelSize: 13,
  angkaSize: 13,
  showGrid: true,
  aksenGrafik: ACCENT_DEFAULT,
};

/**
 * Skala log sederhana untuk forest plot sintetis: domain 0,1 sampai 10
 * dipetakan ke lebar plot. Nilai di sini hanya contoh bentuk data.
 */
function logX(value: number, plotLeft: number, plotWidth: number): number {
  const lo = Math.log10(0.1);
  const hi = Math.log10(10);
  const t = (Math.log10(value) - lo) / (hi - lo);
  return plotLeft + t * plotWidth;
}

export function VizForestPlot(props: Partial<VizValues> = {}) {
  const v: VizValues = { ...vizDefaults, ...props };
  const plotLeft = 200;
  const plotWidth = 640;
  const plotRight = plotLeft + plotWidth;
  const height = forestPlotSintetis.length * v.rowHeight + 80;
  return (
    <section
      style={{
        background: ARCHIVE,
        color: INK,
        padding: `${v.sectionPaddingY}px 48px`,
        fontFamily: "Archivo, system-ui, sans-serif",
        height: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          fontFamily: "IBM Plex Mono, ui-monospace, monospace",
          fontSize: v.labelSize,
          letterSpacing: "0.08em",
          color: MARGIN_GREY,
          textTransform: "uppercase",
        }}
      >
        Fig. 02 - Forest plot, data contoh
      </p>
      <h3 style={{ margin: "0 0 24px", fontSize: 28, fontWeight: 800 }}>
        Estimasi efek, lima studi contoh
      </h3>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 1084 ${height}`}
        role="img"
        aria-label="Forest plot sintetis lima studi contoh, bukan hasil riset"
      >
        {v.showGrid ? (
          <g stroke={HAIRLINE} strokeWidth={v.strokeWidth}>
            <line x1={plotLeft} y1={8} x2={plotLeft} y2={height - 32} />
            <line x1={plotRight} y1={8} x2={plotRight} y2={height - 32} />
          </g>
        ) : null}
        <line
          x1={logX(1, plotLeft, plotWidth)}
          y1={8}
          x2={logX(1, plotLeft, plotWidth)}
          y2={height - 32}
          stroke={INK}
          strokeWidth={v.strokeWidth}
          strokeDasharray="4 4"
        />
        {forestPlotSintetis.map((baris, index) => {
          const y = 32 + index * v.rowHeight;
          const x1 = logX(baris.bawah, plotLeft, plotWidth);
          const x2 = logX(baris.atas, plotLeft, plotWidth);
          const cx = logX(baris.estimasi, plotLeft, plotWidth);
          return (
            <g key={baris.label}>
              <text
                x={8}
                y={y + 4}
                fontSize={v.labelSize}
                fontFamily="Archivo, system-ui, sans-serif"
                fill={INK}
              >
                {baris.label}
              </text>
              <line
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke={INK}
                strokeWidth={v.ciStrokeWidth}
              />
              <circle cx={cx} cy={y} r={v.pointRadius} fill={v.aksenGrafik} />
              <text
                x={plotRight + 24}
                y={y + 4}
                fontSize={v.angkaSize}
                fontFamily="IBM Plex Mono, ui-monospace, monospace"
                fill={GRAPHITE}
              >
                {baris.estimasi.toFixed(2)} ({baris.bawah.toFixed(2)} -{" "}
                {baris.atas.toFixed(2)})
              </text>
            </g>
          );
        })}
      </svg>
      <p
        style={{
          margin: "16px 0 0",
          fontFamily: "IBM Plex Mono, ui-monospace, monospace",
          fontSize: v.labelSize,
          color: MARGIN_GREY,
        }}
      >
        Garis putus-putus = nilai 1. Interval yang melewatinya sengaja ada
        sebagai kasus tepi. Ini data contoh, bukan hasil riset.
      </p>
    </section>
  );
}

export interface FooterValues {
  ctaSize: number;
  ctaLineHeight: number;
  footerPaddingTop: number;
  footerPaddingBottom: number;
  linkSize: number;
  linkGap: number;
  borderWidth: number;
}

export const footerDefaults: FooterValues = {
  ctaSize: 72,
  ctaLineHeight: 1.05,
  footerPaddingTop: 88,
  footerPaddingBottom: 48,
  linkSize: 14,
  linkGap: 10,
  borderWidth: 1,
};

export function FooterCtaRaksasa(props: Partial<FooterValues> = {}) {
  const v: FooterValues = { ...footerDefaults, ...props };
  return (
    <footer
      style={{
        background: PAPER,
        color: INK,
        borderTop: `${v.borderWidth}px solid ${HAIRLINE}`,
        padding: `${v.footerPaddingTop}px 48px ${v.footerPaddingBottom}px`,
        fontFamily: "Archivo, system-ui, sans-serif",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: v.ctaSize,
          lineHeight: v.ctaLineHeight,
          letterSpacing: "-0.02em",
          fontWeight: 800,
        }}
      >
        Mari kerjakan
        <br />
        satu studi bersama.
      </h2>
      <div
        style={{
          display: "flex",
          gap: 48,
          marginTop: 48,
          fontSize: v.linkSize,
          color: GRAPHITE,
        }}
      >
        <span>Kontak: tautan kontak di halaman final</span>
        <span>Topik contoh: farmakovigilans, edukasi kesehatan</span>
        <span>Data di halaman ini: sintetis</span>
      </div>
      <p
        style={{
          margin: `${v.linkGap + 24}px 0 0`,
          fontFamily: "IBM Plex Mono, ui-monospace, monospace",
          fontSize: v.linkSize,
          color: MARGIN_GREY,
        }}
      >
        Lab Contoh - 2026 - Halaman contoh canvas, bukan situs produksi.
      </p>
    </footer>
  );
}
