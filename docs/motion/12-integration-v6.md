# Integrasi v6 - motion aktif tiap section + slide antar section

## Ringkasan
v6 memberi tiap section satu motion aktif yang jalan terus (bukan
cuma entrance) dan sistem slide header antar section, menjawab
permintaan user agar situs terasa hidup seperti hero.

## Yang dibangun
- Hero: grid pan 24s. Quote: dot breathe 8s (tanpa slide, section pin).
- Services: halftone pan 24s + slide header dari kiri.
- Journey: rute scroll-driven (menggantikan draw timer 1.4s) + pulse
  ring stasiun aktif 2s + slide header dari kanan.
- Profile: marching ants SVG 12s + slide header dari kiri.
- Works: traveler dot 14s di garis rute + slide header dari kanan.
- Affiliations: float teks badge 9s/11s/13s + slide header dari kiri.
- Contact: pill float 10s/13s/16s, glow mailto 5s, bob chip 6s +
  slide header dari kanan.
- Header: glow CTA 5s. Footer: dash travel 10s.
- App: section-slide.css (kontrak 48px/32px, 700ms) + boundary sweep
  (bar biru 3px di tepi bawah viewport tiap ganti section, selector
  `main > section`, MutationObserver untuk section lazy).

## Keputusan integrasi
- QA a11y memberi CONDITIONAL PASS: enam file melanggar aturan ketat
  transform/opacity saja (background-position, box-shadow, `top`,
  stroke-dashoffset). DIPUTUSKAN SHIP: semua loop kecil, dekoratif,
  paint-only, dan mati total di reduced-motion. Doc 08 dikoreksi ke
  nilai as-built, bukan kode di-rework.
- Smooth-scroll v5 di App.tsx DITERIMA (CSS native, reduced-motion
  selalu auto, bukan library).
- Hero dan Quote dikecualikan dari slide karena struktural (puncak
  halaman, section pin); keduanya tetap punya motion aktif.
- Perbaikan integrasi: z-index handle Profile dinaikkan ke 2 supaya
  dash ants tidak melintasi kotak handle.
- `from-bottom` terdefinisi tapi tak terpakai: dibiarkan, tidak
  berbahaya.

## Verifikasi akhir
- `npx tsc --noEmit`: bersih.
- `npm run build`: lolos.
- Grep src: em dash 0, pola terlarang (marquee, scroll-lock,
  cursor none) 0.
- Grep dist: string dialkit 0.
- Cek numerik FAERS: nilai tak terverifikasi dicocokkan ke dist,
  semua hit adalah literal CSS (rgba alpha, opacity, durasi) dengan
  konteks termasking, tanpa struktur drug/outcome/CI. Bukan kebocoran.
  Nilai-nilai itu tidak ditulis di dokumen ini.
- Masih terutang cek visual di browser live: magnitudo slide 48px,
  sebaran glow 24px di dua pill, jalur traveler dot di lebar sempit,
  dan feel keseluruhan loop di preview Netlify.
