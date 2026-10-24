/**
 * Wrapper tuning DialKit untuk canvas DEV-only, gaya v2 Onlines.
 * Nilai bawaan dan aksen mengalir dari components.tsx (token Onlines).
 *
 * Pola yang dipakai (dari research/13-canvas-dialkit-plan.md bagian 3.1):
 * wrapper hidup di src/dev/, memanggil useDialKit, lalu meneruskan nilai
 * sebagai props ke komponen presentasi di components.tsx. Komponen
 * presentasi tidak pernah mengimpor dialkit, dan nilai final nanti dikunci
 * dengan mengganti nilai bawaan props menjadi token, bukan dengan membaca
 * preset DialKit di runtime produksi.
 *
 * Persist hanya kenyamanan sesi tuning. Nilai final hidup di source.
 * DialKit di sini TANPA prop productionEnabled, supaya panel hanya muncul
 * di mode dev (DialRoot dirender oleh CanvasPage.tsx, juga dev-only).
 */

import { useDialKit } from "dialkit";
import type { TransitionConfig } from "dialkit";
import {
  FooterCtaRaksasa,
  HeroEditorialRaksasa,
  HeroManifestoDuaKolom,
  KartuRisetIndeksBaris,
  VizForestPlot,
  footerDefaults,
  heroDefaults,
  kartuDefaults,
  manifestoDefaults,
  vizDefaults,
} from "./components";

function springDuration(value: TransitionConfig | undefined, fallback: number): number {
  if (
    value &&
    value.type === "spring" &&
    "visualDuration" in value &&
    typeof value.visualDuration === "number"
  ) {
    return value.visualDuration;
  }
  return fallback;
}

export function TunedHeroEditorialRaksasa() {
  const values = useDialKit(
    "Hero",
    {
      kataRaksasaSize: [heroDefaults.kataRaksasaSize, 96, 320, 4],
      headlineSize: [heroDefaults.headlineSize, 36, 112, 2],
      headlineLineHeight: [heroDefaults.headlineLineHeight, 0.9, 1.3, 0.01],
      headlineTracking: [heroDefaults.headlineTracking, -0.05, 0.02, 0.005],
      headlineIndent: [heroDefaults.headlineIndent, 0, 240, 4],
      heroGap: [heroDefaults.heroGap, 0, 96, 2],
      heroPaddingTop: [heroDefaults.heroPaddingTop, 32, 200, 4],
      heroPaddingBottom: [heroDefaults.heroPaddingBottom, 32, 200, 4],
      metaSize: [heroDefaults.metaSize, 11, 18, 0.5],
      aksen: heroDefaults.aksen,
      reveal: { type: "spring", visualDuration: 0.5, bounce: 0.15 },
    },
    { id: "daivanlabs-rebuild-hero", persist: true },
  );
  return (
    <div style={{ transitionDuration: `${springDuration(values.reveal, 0.5)}s` }}>
      <HeroEditorialRaksasa
        kataRaksasaSize={values.kataRaksasaSize}
        headlineSize={values.headlineSize}
        headlineLineHeight={values.headlineLineHeight}
        headlineTracking={values.headlineTracking}
        headlineIndent={values.headlineIndent}
        heroGap={values.heroGap}
        heroPaddingTop={values.heroPaddingTop}
        heroPaddingBottom={values.heroPaddingBottom}
        metaSize={values.metaSize}
        aksen={values.aksen}
      />
    </div>
  );
}

export function TunedHeroManifestoDuaKolom() {
  const values = useDialKit(
    "Hero manifesto",
    {
      headlineSize: [manifestoDefaults.headlineSize, 36, 112, 2],
      heroGap: [manifestoDefaults.heroGap, 0, 96, 2],
      heroPaddingTop: [manifestoDefaults.heroPaddingTop, 32, 200, 4],
      heroPaddingBottom: [manifestoDefaults.heroPaddingBottom, 32, 200, 4],
      metaSize: [manifestoDefaults.metaSize, 11, 18, 0.5],
      aksen: manifestoDefaults.aksen,
    },
    { id: "daivanlabs-rebuild-hero-manifesto", persist: true },
  );
  return (
    <HeroManifestoDuaKolom
      headlineSize={values.headlineSize}
      heroGap={values.heroGap}
      heroPaddingTop={values.heroPaddingTop}
      heroPaddingBottom={values.heroPaddingBottom}
      metaSize={values.metaSize}
      aksen={values.aksen}
    />
  );
}

export function TunedKartuRisetIndeksBaris() {
  const values = useDialKit(
    "Kartu Riset",
    {
      rowPaddingY: [kartuDefaults.rowPaddingY, 8, 48, 1],
      judulSize: [kartuDefaults.judulSize, 16, 32, 1],
      judulLineHeight: [kartuDefaults.judulLineHeight, 1.05, 1.5, 0.05],
      metaSize: [kartuDefaults.metaSize, 11, 16, 0.5],
      nomorSize: [kartuDefaults.nomorSize, 24, 80, 2],
      borderWidth: [kartuDefaults.borderWidth, 0, 3, 0.5],
      hoverShiftX: [kartuDefaults.hoverShiftX, 0, 20, 1],
      hover: { type: "spring", visualDuration: 0.35, bounce: 0.2 },
    },
    { id: "daivanlabs-rebuild-kartu-riset", persist: true },
  );
  return (
    <KartuRisetIndeksBaris
      rowPaddingY={values.rowPaddingY}
      judulSize={values.judulSize}
      judulLineHeight={values.judulLineHeight}
      metaSize={values.metaSize}
      nomorSize={values.nomorSize}
      borderWidth={values.borderWidth}
      hoverShiftX={values.hoverShiftX}
    />
  );
}

export function TunedVizForestPlot() {
  const values = useDialKit(
    "Visualisasi",
    {
      sectionPaddingY: [vizDefaults.sectionPaddingY, 40, 180, 4],
      strokeWidth: [vizDefaults.strokeWidth, 0.75, 4, 0.25],
      ciStrokeWidth: [vizDefaults.ciStrokeWidth, 1, 5, 0.25],
      pointRadius: [vizDefaults.pointRadius, 2, 10, 0.5],
      rowHeight: [vizDefaults.rowHeight, 28, 72, 2],
      labelSize: [vizDefaults.labelSize, 11, 17, 0.5],
      angkaSize: [vizDefaults.angkaSize, 11, 17, 0.5],
      showGrid: vizDefaults.showGrid,
      aksenGrafik: vizDefaults.aksenGrafik,
      drawIn: { type: "spring", visualDuration: 0.6, bounce: 0.1 },
    },
    { id: "daivanlabs-rebuild-viz", persist: true },
  );
  return (
    <VizForestPlot
      sectionPaddingY={values.sectionPaddingY}
      strokeWidth={values.strokeWidth}
      ciStrokeWidth={values.ciStrokeWidth}
      pointRadius={values.pointRadius}
      rowHeight={values.rowHeight}
      labelSize={values.labelSize}
      angkaSize={values.angkaSize}
      showGrid={values.showGrid}
      aksenGrafik={values.aksenGrafik}
    />
  );
}

export function TunedFooterCtaRaksasa() {
  const values = useDialKit(
    "Footer",
    {
      ctaSize: [footerDefaults.ctaSize, 36, 128, 2],
      ctaLineHeight: [footerDefaults.ctaLineHeight, 0.9, 1.3, 0.01],
      footerPaddingTop: [footerDefaults.footerPaddingTop, 40, 180, 4],
      footerPaddingBottom: [footerDefaults.footerPaddingBottom, 24, 120, 4],
      linkSize: [footerDefaults.linkSize, 12, 18, 0.5],
      linkGap: [footerDefaults.linkGap, 4, 28, 1],
      borderWidth: [footerDefaults.borderWidth, 0, 3, 0.5],
      linkHover: { type: "spring", visualDuration: 0.3, bounce: 0.15 },
    },
    { id: "daivanlabs-rebuild-footer", persist: true },
  );
  return (
    <FooterCtaRaksasa
      ctaSize={values.ctaSize}
      ctaLineHeight={values.ctaLineHeight}
      footerPaddingTop={values.footerPaddingTop}
      footerPaddingBottom={values.footerPaddingBottom}
      linkSize={values.linkSize}
      linkGap={values.linkGap}
      borderWidth={values.borderWidth}
    />
  );
}
