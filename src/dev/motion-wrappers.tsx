/**
 * Varian motion canvas DEV-only untuk 5 komponen presentasi.
 *
 * Tiap komponen dasar mendapat 3 varian motion, semuanya lewat prop
 * motion di components.tsx (token di motion.tsx):
 * - entrance: fade + rise, 0.8s, cubic-bezier(0.22,1,0.36,1)
 * - hover: lift halus -4px, transisi 0.3s, easing yang sama
 * - reveal: blok anak muncul berurutan, langkah stagger 0.08s
 *
 * Varian motion memakai nilai bawaan komponen, bukan slider DialKit,
 * supaya motion bisa dibandingkan apa adanya tanpa tabrakan id
 * persist DialKit dengan varian dasar. Setelah satu motion terpilih,
 * prop motion itu diteruskan ke wrapper tuning dan nilainya dikunci
 * sebagai token di produksi. Komponen presentasi tidak mengimpor
 * dialkit, dan tidak ada data sintetis yang diubah di sini.
 */

import {
  FooterCtaRaksasa,
  HeroEditorialRaksasa,
  HeroManifestoDuaKolom,
  KartuRisetIndeksBaris,
  VizForestPlot,
} from "./components";

export function MotionHeroEditorialRaksasaEntrance() {
  return <HeroEditorialRaksasa motion="entrance" />;
}
export function MotionHeroEditorialRaksasaHover() {
  return <HeroEditorialRaksasa motion="hover" />;
}
export function MotionHeroEditorialRaksasaReveal() {
  return <HeroEditorialRaksasa motion="reveal" />;
}

export function MotionHeroManifestoDuaKolomEntrance() {
  return <HeroManifestoDuaKolom motion="entrance" />;
}
export function MotionHeroManifestoDuaKolomHover() {
  return <HeroManifestoDuaKolom motion="hover" />;
}
export function MotionHeroManifestoDuaKolomReveal() {
  return <HeroManifestoDuaKolom motion="reveal" />;
}

export function MotionKartuRisetIndeksBarisEntrance() {
  return <KartuRisetIndeksBaris motion="entrance" />;
}
export function MotionKartuRisetIndeksBarisHover() {
  return <KartuRisetIndeksBaris motion="hover" />;
}
export function MotionKartuRisetIndeksBarisReveal() {
  return <KartuRisetIndeksBaris motion="reveal" />;
}

export function MotionVizForestPlotEntrance() {
  return <VizForestPlot motion="entrance" />;
}
export function MotionVizForestPlotHover() {
  return <VizForestPlot motion="hover" />;
}
export function MotionVizForestPlotReveal() {
  return <VizForestPlot motion="reveal" />;
}

export function MotionFooterCtaRaksasaEntrance() {
  return <FooterCtaRaksasa motion="entrance" />;
}
export function MotionFooterCtaRaksasaHover() {
  return <FooterCtaRaksasa motion="hover" />;
}
export function MotionFooterCtaRaksasaReveal() {
  return <FooterCtaRaksasa motion="reveal" />;
}
