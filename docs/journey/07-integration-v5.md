# Integrasi v5 - journey + hero devices di semua section

## Ringkasan
v5 mengganti Manifesto dari method explainer menjadi visualisasi perjalanan
dari CV, menerapkan bahasa visual hero ke semua section linear, dan
memperbaiki dua bug laporan user (double scroll quote, judul gelap tak
terlihat). Semua 15 agen selesai; browser task referensi juga kembali.

## Keputusan integrasi (parent)
- G1 (Services h3 gelap di kartu biru): DIPERBAIKI. `color: #FFFFFF`
  ditambahkan ke `.svc-card-title`. Akar masalah sama dengan bug
  screenshot: aturan global h1-h6 memaksa gelap dan mengalahkan
  inheritance dari kartu.
- G2 (pill Services tak terjangkau di touch): DIPERBAIKI. Pill kini
  tampil penuh di `@media (hover: none)`.
- G3 akurasi (Gold Medal ISIF 2024 hilang dari journey): DIPERBAIKI.
  Dot keempat ditambahkan ke stasiun 2024, label diubah menjadi
  "4 award items in 2024", detail stasiun menyebut medali tersebut.
  Fakta terverifikasi di CV.md dan content.ts.
- G4 (konflik sumber, 5 item tanpa tahun): DIPUTUSKAN mengikuti CV.md
  (konservatif, footnote "no recorded year"). content.ts memang memberi
  tahun 2024 pada kelima item itu lewat grouping situs lama, tapi CV.md
  adalah sumber otoritatif dan tidak mencatat tahunnya. Mengikuti
  content.ts berarti mengarang tahun.
- G3 motion (smooth scroll vs reduced-motion): TIDAK PERLU PERBAIKAN.
  `global.css` sudah punya `html { scroll-behavior: auto; }` di blok
  reduced-motion; temuan QA ternyata sudah terpenuhi.
- Chip Profile yang menjorok 14px ke kiri frame: DIBIARKAN. Masih di
  dalam padding section 24px, tidak ada overflow viewport, dan konsisten
  dengan gaya stiker overlap dua chip lainnya.
- Deviasi token motion (Manifesto pop 450ms vs spec 350ms, stagger
  150ms vs 80ms, draw 1400ms vs 800ms; Affiliations pop 500ms; route
  fade 400ms vs 300ms spec): DITERIMA. Perbedaan milidetik dalam
  rentang feel yang sama, bukan pelanggaran sistem.
- Deviasi desain journey: yang dibangun adalah rute horizontal dengan
  stasiun selang-seling atas/bawah, bukan rute berliku vertikal di
  docs/journey/02-design.md. Agen build tidak sempat membaca 02 saat
  bekerja (polling), dan hasil horizontal lebih bersih untuk 5 stasiun.
  02 tetap tersimpan sebagai referensi, bukan spesifikasi yang dilanggar
  secara diam-diam.

## Temuan browser task (referensi, transisi antar section)
Referensi TIDAK punya efek transisi global: tidak ada crossfade tema,
tidak ada blending background, tidak ada scroll-lock. Tiap section
diganti dengan hard cut; dramanya ada DI DALAM section (quote pin +
word-paint, kartu kolase melayang). Implikasi untuk situs ini: progress
hairline dan route fade+rise v5 sebenarnya sudah MELEBIHI referensi,
tapi dipertahankan sebagai orientasi (bukan tiruan efek referensi).
Yang belum terverifikasi dari still frame: parallax hero, entrance
kartu services/contact, marquee logo, smooth-scroll library.

## Verifikasi akhir
- `npx tsc --noEmit`: bersih.
- `npm run build`: lolos.
- Grep src: em dash 0, pola terlarang (marquee, scroll-lock,
  cursor none) 0 setelah keyframe `mv-marquee` mati di motion.css
  dihapus (tidak pernah direferensikan di mana pun, jadi penghapusan
  tidak mengubah visual).
- Grep dist: string dialkit 0.
- Cek numerik FAERS: 10 nilai tak terverifikasi dicocokkan ke dist,
  15 hit, SEMUANYA literal CSS (opacity, gradient stop, rgba alpha,
  durasi) dengan konteks termasking, tanpa struktur drug/outcome/CI.
  Bukan kebocoran. Nilai-nilai itu sendiri tidak ditulis di dokumen
  ini maupun di laporan mana pun.
- Masih terutang cek visual di browser live (bukan dari sandbox):
  rute journey di lebar desktop sempit, judul Services pasca G1,
  quote di viewport sangat pendek (landscape ponsel).
