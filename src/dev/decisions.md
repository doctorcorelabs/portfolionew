# Keputusan canvas - rebuild portfolio riset

## Arah v2 - Onlines

- V2 mengganti arah visual canvas dari MANUSKRIP ke sistem Onlines
  (research/03-onlines-layout.md bagian 13): Inter + JetBrains Mono,
  tinta #010101, kertas #FFFFFF, abu #F5F5F7, garis #E0E0E0, aksen biru
  #0859D4 untuk aksen kecil, container 1160px, kotak seleksi dashed,
  radius 0.
- Semua varian v1 di-skin ulang ke token Onlines. Nilai tuning v1 TIDAK
  dibawa ke v2: varian harus di-tune ulang di sesi dev sebelum ada yang
  dipilih.
- Status: BELUM ADA varian v2 yang terpilih.

Status: BELUM ADA varian yang terpilih. Dokumen ini adalah tempat keputusan
per kelompok dicatat saat sesi tuning selesai, mengikuti WORKFLOW.md
langkah e dan research/13-canvas-dialkit-plan.md bagian 5.

Format tiap keputusan: varian terpilih, alasan utama, varian yang dibuang
dan alasannya, nilai mentah hasil Copy dari panel DialKit, tanggal.

## Hero

- Belum diputuskan.

## Kartu riset

- Belum diputuskan.

## Visualisasi

- Belum diputuskan.

## Footer

- Belum diputuskan.

## Catatan penguncian

- Nilai final wajib ditulis sebagai token eksplisit di source komponen
  produksi dan nilai bawaan props, bukan dibaca dari preset DialKit atau
  localStorage di runtime produksi.
- Data canvas 100 persen sintetis. Tidak ada angka riset asli, data
  pasien, data pengguna asli, atau kredensial di file ini maupun di
  registry.

## Motion v2 - Onlines (task 14/15)

- Token motion: entrance dan reveal 0.8s, hover 0.3s, easing
  cubic-bezier(0.22,1,0.36,1), naik entrance 24px, angkat hover
  -4px, langkah stagger reveal 0.08s. File: motion.tsx (token,
  keyframes, class), components.tsx (prop motion di 5 komponen),
  motion-wrappers.tsx (15 varian), registry.tsx (15 entri baru
  dengan id stabil, baris baru di bawah kartu dasar).
- Tiap varian dasar mendapat 3 varian motion: entrance (fade +
  rise), hover (lift halus), reveal (anak muncul berurutan).
  Varian motion memakai nilai bawaan komponen, bukan slider
  DialKit, supaya tidak tabrakan id persist dengan varian dasar.
- Status: motion variants ADDED, NONE SELECTED yet. Nilai produksi
  masih harus dikunci sebagai token eksplisit di source setelah
  tuning, mengikuti aturan penguncian di atas.
