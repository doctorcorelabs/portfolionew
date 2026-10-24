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
];
