/**
 * Registry varian canvas DEV-only untuk rebuild portfolio riset.
 *
 * Satu-satunya sumber daftar isi canvas di src/dev/. Tiap entri punya id
 * stabil (tidak pernah diganti setelah dipakai, karena layout tersimpan di
 * localStorage dirujuk dengan id ini), nama terbaca manusia, komponen,
 * dimensi preview sebenarnya, dan posisi awal.
 *
 * Menambah varian cukup menambah satu entri di sini. Kode kamera dan
 * gesture di CanvasPage.tsx tidak perlu diubah. Varian baru mendapat id
 * dan nama baru; varian lama dipertahankan.
 *
 * Lebar preview mengikuti container Onlines 1160px (research/03 bagian 13).
 * Data semua varian 100 persen sintetis dari synthetic-data.ts. Tidak ada
 * angka riset asli, data pasien, data pengguna asli, atau kredensial.
 * Komponen di sini adalah wrapper tuning di tuned-wrappers.tsx, yang
 * meneruskan nilai DialKit sebagai props ke komponen presentasi.
 * Komponen presentasi tidak mengimpor dialkit.
 */

import type { ComponentType } from "react";
import {
  MotionFooterCtaRaksasaEntrance,
  MotionFooterCtaRaksasaHover,
  MotionFooterCtaRaksasaReveal,
  MotionHeroEditorialRaksasaEntrance,
  MotionHeroEditorialRaksasaHover,
  MotionHeroEditorialRaksasaReveal,
  MotionHeroManifestoDuaKolomEntrance,
  MotionHeroManifestoDuaKolomHover,
  MotionHeroManifestoDuaKolomReveal,
  MotionKartuRisetIndeksBarisEntrance,
  MotionKartuRisetIndeksBarisHover,
  MotionKartuRisetIndeksBarisReveal,
  MotionVizForestPlotEntrance,
  MotionVizForestPlotHover,
  MotionVizForestPlotReveal,
} from "./motion-wrappers";
import {
  TunedFooterCtaRaksasa,
  TunedHeroEditorialRaksasa,
  TunedHeroManifestoDuaKolom,
  TunedKartuRisetIndeksBaris,
  TunedVizForestPlot,
} from "./tuned-wrappers";

export interface CanvasItem {
  id: string;
  name: string;
  component: ComponentType;
  width: number;
  height: number;
  initialPosition: { x: number; y: number };
}

export const canvasItems: CanvasItem[] = [
  {
    id: "hero-editorial-raksasa",
    name: "Hero - editorial raksasa",
    component: TunedHeroEditorialRaksasa,
    width: 1160,
    height: 600,
    initialPosition: { x: 60, y: 60 },
  },
  {
    id: "hero-manifesto-dua-kolom",
    name: "Hero - manifesto dua kolom",
    component: TunedHeroManifestoDuaKolom,
    width: 1160,
    height: 600,
    initialPosition: { x: 1340, y: 60 },
  },
  {
    id: "kartu-riset-indeks-baris",
    name: "Kartu riset - indeks baris",
    component: TunedKartuRisetIndeksBaris,
    width: 1160,
    height: 520,
    initialPosition: { x: 60, y: 900 },
  },
  {
    id: "viz-forest-plot",
    name: "Visualisasi - forest plot",
    component: TunedVizForestPlot,
    width: 1160,
    height: 560,
    initialPosition: { x: 60, y: 1620 },
  },
  {
    id: "footer-cta-raksasa",
    name: "Footer - ajakan raksasa",
    component: TunedFooterCtaRaksasa,
    width: 1160,
    height: 420,
    initialPosition: { x: 60, y: 2380 },
  },

  // Varian motion (task 14/15): 3 per varian dasar, baris baru di bawah
  // kartu dasar supaya tidak menimpa layout tersimpan. Id baru stabil.
  {
    id: "hero-editorial-raksasa-entrance",
    name: "Hero - editorial raksasa - entrance",
    component: MotionHeroEditorialRaksasaEntrance,
    width: 1160,
    height: 600,
    initialPosition: { x: 60, y: 3000 },
  },
  {
    id: "hero-editorial-raksasa-hover",
    name: "Hero - editorial raksasa - hover",
    component: MotionHeroEditorialRaksasaHover,
    width: 1160,
    height: 600,
    initialPosition: { x: 60, y: 3680 },
  },
  {
    id: "hero-editorial-raksasa-reveal",
    name: "Hero - editorial raksasa - reveal",
    component: MotionHeroEditorialRaksasaReveal,
    width: 1160,
    height: 600,
    initialPosition: { x: 60, y: 4360 },
  },
  {
    id: "hero-manifesto-dua-kolom-entrance",
    name: "Hero - manifesto dua kolom - entrance",
    component: MotionHeroManifestoDuaKolomEntrance,
    width: 1160,
    height: 600,
    initialPosition: { x: 60, y: 5040 },
  },
  {
    id: "hero-manifesto-dua-kolom-hover",
    name: "Hero - manifesto dua kolom - hover",
    component: MotionHeroManifestoDuaKolomHover,
    width: 1160,
    height: 600,
    initialPosition: { x: 60, y: 5720 },
  },
  {
    id: "hero-manifesto-dua-kolom-reveal",
    name: "Hero - manifesto dua kolom - reveal",
    component: MotionHeroManifestoDuaKolomReveal,
    width: 1160,
    height: 600,
    initialPosition: { x: 60, y: 6400 },
  },
  {
    id: "kartu-riset-indeks-baris-entrance",
    name: "Kartu riset - indeks baris - entrance",
    component: MotionKartuRisetIndeksBarisEntrance,
    width: 1160,
    height: 520,
    initialPosition: { x: 60, y: 7080 },
  },
  {
    id: "kartu-riset-indeks-baris-hover",
    name: "Kartu riset - indeks baris - hover",
    component: MotionKartuRisetIndeksBarisHover,
    width: 1160,
    height: 520,
    initialPosition: { x: 60, y: 7760 },
  },
  {
    id: "kartu-riset-indeks-baris-reveal",
    name: "Kartu riset - indeks baris - reveal",
    component: MotionKartuRisetIndeksBarisReveal,
    width: 1160,
    height: 520,
    initialPosition: { x: 60, y: 8440 },
  },
  {
    id: "viz-forest-plot-entrance",
    name: "Visualisasi - forest plot - entrance",
    component: MotionVizForestPlotEntrance,
    width: 1160,
    height: 560,
    initialPosition: { x: 60, y: 9120 },
  },
  {
    id: "viz-forest-plot-hover",
    name: "Visualisasi - forest plot - hover",
    component: MotionVizForestPlotHover,
    width: 1160,
    height: 560,
    initialPosition: { x: 60, y: 9800 },
  },
  {
    id: "viz-forest-plot-reveal",
    name: "Visualisasi - forest plot - reveal",
    component: MotionVizForestPlotReveal,
    width: 1160,
    height: 560,
    initialPosition: { x: 60, y: 10480 },
  },
  {
    id: "footer-cta-raksasa-entrance",
    name: "Footer - ajakan raksasa - entrance",
    component: MotionFooterCtaRaksasaEntrance,
    width: 1160,
    height: 420,
    initialPosition: { x: 60, y: 11160 },
  },
  {
    id: "footer-cta-raksasa-hover",
    name: "Footer - ajakan raksasa - hover",
    component: MotionFooterCtaRaksasaHover,
    width: 1160,
    height: 420,
    initialPosition: { x: 60, y: 11840 },
  },
  {
    id: "footer-cta-raksasa-reveal",
    name: "Footer - ajakan raksasa - reveal",
    component: MotionFooterCtaRaksasaReveal,
    width: 1160,
    height: 420,
    initialPosition: { x: 60, y: 12520 },
  },
];
