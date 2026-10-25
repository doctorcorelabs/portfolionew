# Mobile/tablet mirror: synthesis analisis (base cbfeb35)

5 analis selesai 25 Okt 2026. Dokumen ini bekal fixer; angka dari source, bukan asumsi.

## Scale-down murni: DITOLAK
Render stage desktop lalu CSS transform scale: base 1440 -> 390 = 0.271 (caption 2.7px),
768 = 0.533 (5.3px); base 1160 -> 390 = 0.336 (3.4px), 768 = 0.662 (6.6px).
Hanya 1024/base-1160 (0.883) terbaca, tapi percuma: layout native 1024 sudah muat s=1.00.
Alasan struktural: posisi % ikut mengecil dengan V, tapi lebar kartu terbaca tidak.

## Lantai skala terbaca
Kartu teks s >= 0.80, tile logo s >= 0.67, Cochrane s >= 0.64, helix s >= 0.50.
Di bawah lantai = gagal walau geometri muat.

## HP 390: cermin penuh MUSTAHIL; mirror-max = 5 item
Muat (anchor desktop, ukuran terbaca): docking 0.80 + Scopus 0.67 + Cochrane 0.64
(stack atas) + notify 0.80 (bersih VH >= ~730) + faers XOR poster 0.80 (satu saja).
TIDAK MUAT: review (vs stack s <= 0.46, vs docking s <= 0.565), helix (0.41),
search (0.565), posterwindow (0.725), awards (vs poster 0.365, vs faers 0.674),
Elsevier+PubMed berpasangan (overlap 7px di lantai), gutaxis (0.367), desk
(di rentang x poster), stickers (tabrak label, 0.615), microscope (65% di belakang word).
Catatan: stack mobile sekarang memuat 6 item; collage melayang HP memuat LEBIH SEDIKIT
item daripada stack. Review (item paling identitas) tidak bisa ikut collage melayang HP.

## Tablet 768 (portrait): slot sekarang sudah muat s=1.00; yang bisa gabung
Bisa gabung: stickers 1.00, notify 1.00, posterwindow 0.90 bersih (1.00 = tuck frame
6px rest / 14px worst), microscope 1.00 dengan word tuck 68px (35%).
TIDAK BISA: review (berbagi tepi 36% dengan Scopus; s <= 0.53 tanpa Scopus),
search (sama), helix (0.69-0.82), gutaxis (0.72), desk (0.71).
Awards kondisional: s=0.86 hanya bila poster tetap kanan-atas (di portrait VH >= 790
poster pindah kanan-bawah, jadi awards tidak ikut di 768).
Rekomendasi: PERTAHANKAN slot 741-1000; JANGAN impor anchor laptop 62%/36%
(lebih buruk: atas s ~= 0.85, bawah gagal).

## Tablet 1024 (landscape VH 768): set terlihat muat s=1.00; yang bisa gabung
Bisa gabung: stickers 1.00; poster-new 1.00 (tuck frame 12px + gap word worst 8px)
atau 0.95 (gap bersih 18px); review-new HANYA VH >= 850 (di VH 768: overlap label
15px x 147px, gate load-bearing, jangan dipaksa); awards 1.00 dengan poster-old
atau 0.90 dengan poster-new (gap 17px; 0.95 -> gap 4px dimakan tilt);
posterwindow 0.80 (tuck 78px) atau 0.90 (tuck 114px) HANYA dengan poster-new
(tabrakan head-on dengan poster-old); notify 1.00 (hairline: tuck word 5px rest /
13px worst, graze vs faers 1px worst; bersih VH >= 850 = gate shipped);
desk 0.90 TANPA awards + poster-new 0.95 (gap 10px), atau 0.95 dengan poster-old
(gap 8px, ~4px net, marjinal). Desk XOR awards.
TIDAK BISA: search (s <= 0.315 vs review-new), helix (s <= 0.11 vs slot Scopus 28%),
gutaxis (s <= 0.22 vs Elsevier), microscope (skala apapun: bottom 61% stage di
dalam rentang y word).
Di VH >= 850: review-new lepas dari label (gap 22px), poster-new lepas dari frame.

## Chips/pills: tetap sembunyi di HP dan tablet
Sembunyi <= 1160px + hover:none + reduced-motion; pill sembunyi ekstra <= 900px.
Companion rearrangement (1161-1400) sudah revert di bawah 1161 dan tidak bisa
dipakai ulang di tablet: Seoul 0.80 tabrak poster-new di 1024; 0.70 hanya lepas
~1px rest dan bersentuhan di drift; StrokeSense 0.45 lebih buruk di tablet
(parkir di atas glyph word karena word ~850px dalam frame 976px); converge parkir
di tepi frame dan tabrak kartu atas/bawah di stage pendek. Payoff sempit: iPad
touch tidak akan melihatnya sama sekali.
Pill di tablet: Code for Cure pill (bottom 30% right 14%) BISA kembali (lepas dari
poster-old/new di y dan dari bottom row di x); Seoul pill TIDAK (59%/32% mendarat
di review-old 1024); FAERS pill hanya portrait tinggi (gate 1090).
HP: chips/pills WAJIB sembunyi (tanpa hover converge mati; stage auto-height membuat
anchor fraksional tak bermakna; pill nowrap 150-190px overflow di 390; margin sisi
word ~60-70px < lebar chip/pill).

## Frame/label/gate
Glyph word: jangan pernah tertutup (collage z0, frame z1). Tuck label ink dan
tuck border frame: diterima (kelas yang sudah ada). Handle 10px jangan di bawah
tepi kartu opaque.
Gate dipertahankan persis apa adanya (notify 850, stickers 950, microscope 800,
helix 750, Cochrane 750, FAERS pill 1090): tablet landscape = cermin parsial,
tablet portrait = cermin penuh. Item kembali tanpa gate (gutaxis, search, desk,
awards) butuh validasi stage pendek segar. HP: gate tetap di luar stack.

## Keputusan desain (menunggu user untuk HP)
Tablet: settled seperti di atas. HP: fork - (A) collage melayang mirror-max
(5 item, sisanya tetap stack di bawah) vs (B) stack tetap tapi urutan diubah
mengikuti kuadran desktop (atas dulu: docking, review, logo; lalu bawah: faers,
Elsevier, PubMed, awards, poster).
