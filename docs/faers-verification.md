# Verifikasi ROR FAERS ABST-000034

Tanggal verifikasi: 24 Oktober 2026.
Status keseluruhan: unverified. Alasannya ada di bagian 4. Tiga dari lima nilai ROR terpetakan lengkap sampai CI 95 persen, dua baris belum bisa dibuktikan, dan tidak satu pun baris yang punya jumlah kasus kejadian yang terbukti.

## 1. Metode

- Poster final diekstrak dengan `pdftotext -layout` dan `pdftotext -bbox`, lalu kolom poster direkonstruksi berdasarkan koordinat kata, karena teks poster satu slide 16:9 tidak terbaca lurus dalam urutan linear.
- Abstrak diekstrak dari `Lecture-Abstract-ABST-000034-DRAFT.pdf`.
- Naskah presentasi 7 menit diekstrak dari `naskah-presentasi-7-menit-ABST-000034.docx` (teks dokumen Word).
- Lembar Q&A `lembar-QA-poster-ABST-000034.md` dipakai sebagai pemeriksaan silang, terutama untuk paradoks background dan status koreksi multiple testing.
- Varian poster asterisk (`poster-asterisk/ABST-000034_Daivan_Febri_Juan_Setiya_v3_asterisk.pdf`) ikut diperiksa dan nilainya identik dengan v3 untuk kelima ROR.
- Sumber kebenaran yang dipakai: folder `~/workspace/goals/hypertension-seoul-2026-congress-trip/files/`. Manuskrip dan Tabel 2 tidak ada di folder itu, dan tidak ada di folder goal lain yang diperiksa. Itu adalah batas utama verifikasi ini.

## 2. Hasil per baris

### Finerenone, endocrine adverse events, ROR 1.03, CI 0.54 sampai 1.99: verified (pemetaan dan CI)

- Poster panel SO WHAT: finerenone, no endocrine signal, ROR 1.03.
- Abstrak Results: spironolactone endocrine ROR 10.85, finerenone no endocrine signal ROR 1.03.
- Naskah presentasi: ROR 1.03, CI 0.54 sampai 1.99, CI melewati satu.
- Comparator: global background. Perhatian: blok poster yang sama juga memuat kalimat "lower reporting odds vs spironolactone". Kalimat itu merujuk pada estimasi head-to-head yang berbeda, odds ratio endokrin 0.13 (CI 0.06 sampai 0.28, p < 0.001, 87 persen lebih rendah), yang menjelaskan angka minus 87 persen di panel EVIDENCE poster. Jangan samakan 0.13 itu dengan ROR global 1.03.
- Jumlah kasus kejadian: tidak ditemukan di dokumen yang tersedia, jadi `cases` bernilai null.

### Sacubitril/valsartan (ARNI), orthostatic hypotension, ROR 6.06, CI 5.06 sampai 7.24: verified (pemetaan dan CI)

- Poster panel SO WHAT: ARNI, orthostatic hypotension, ROR 6.06, median onset 68 hari.
- Abstrak Results: sama, ROR 6.06, median onset 68 hari.
- Naskah presentasi: ROR 6.06, CI 5.06 sampai 7.24.
- Comparator: global background.
- Jumlah kasus kejadian: tidak ditemukan di dokumen yang tersedia, jadi `cases` bernilai null.

### Aprocitentan, peripheral edema, ROR 9.00, CI 3.31 sampai 24.46: verified (pemetaan dan CI)

- Poster panel SO WHAT: aprocitentan, exploratory n = 17, edema, delayed onset, no electrolyte signal, ROR 9.00.
- Abstrak Results: aprocitentan peripheral edema signal ROR 9.00, strictly sentinel and exploratory, wide confidence intervals.
- Naskah presentasi: ROR 9.00, CI 3.31 sampai 24.46, lebar, mencerminkan hanya 17 laporan.
- Comparator: global background. Baris ini wajib selalu dilabeli sentinel dan exploratory.
- Jumlah kasus kejadian total: tidak ditemukan. Naskah presentasi menyebut median time-to-onset edema aprocitentan 152 hari "rests on only 3 cases". Angka 3 itu adalah subset kasus dengan tanggal valid untuk analisis time-to-onset, bukan total kasus edema, sehingga tidak dipakai sebagai `cases`.

### Finerenone, hyperkalemia, ROR 5.47: unverified (CI dan jumlah kasus tidak ada)

- Yang terbukti: obat, outcome, dan comparator. Poster panel SO WHAT: finerenone hyperkalemia ROR 5.47 vs background, monitor serum K+. Naskah presentasi: finerenone hyperkalemia ROR 5.47 against the global background, dikontraskan dengan 0.68 head-to-head versus spironolactone, dan disebut background artifact, bukan biologi.
- Yang hilang: tidak ada CI 95 persen untuk 5.47 di poster, abstrak, naskah presentasi, maupun lembar Q&A. Tidak ada jumlah kasus kejadian hiperkalemia finerenone di dokumen-dokumen itu.
- Bukti bahwa tabelnya ada tetapi tidak tersedia: lembar Q&A menyebut sinyal renal finerenone ROR 4.60 dengan 396 kasus dari Tabel 2 manuskrip. Manuskrip dan Tabel 2 itu tidak ada di folder goal, sehingga CI dan jumlah kasus 5.47 tidak bisa dipulihkan dari sumber yang ada.

### Sacubitril/valsartan (ARNI), hyperkalemia, ROR 0.50: unverified (tidak terkoroborasi)

- Satu-satunya bukti: poster mencetak "(ROR 0.50)" di blok ARNI, di bawah kalimat "lower hyperkalemia reporting". Nilai yang sama muncul di poster v3 dan varian asterisk.
- Tidak ada koroborasi: abstrak, naskah presentasi, dan lembar Q&A tidak pernah menyebut ROR hiperkalemia ARNI. Naskah presentasi tidak menyebut hiperkalemia ARNI sama sekali.
- Alasan tambahan untuk tidak percaya begitu saja: angka 0.50 juga muncul sebagai batas bawah CI dari estimasi yang berbeda, yaitu head-to-head hyperkalemia finerenone versus spironolactone ROR 0.68 (CI 0.50 sampai 0.93, p = 0.017). Sampai Tabel 2 manuskrip diperiksa, 0.50 tidak boleh diplot sebagai ROR mandiri ARNI.

## 3. Angka-angka terkait yang sengaja tidak masuk ke lima baris

- Spironolactone endocrine ROR 10.85 (CI 5.75 sampai 20.48): pembanding global, dari abstrak dan naskah presentasi.
- Finerenone versus spironolactone head-to-head endocrine OR 0.13 (CI 0.06 sampai 0.28, p < 0.001): sumber angka minus 87 persen di panel EVIDENCE poster.
- Finerenone versus spironolactone head-to-head hyperkalemia ROR 0.68 (CI 0.50 sampai 0.93, p = 0.017): menurut lembar Q&A, nilai p ini belum dikoreksi multiple testing (koreksi BH-FDR hanya diterapkan di tier global).
- Angka-angka ini dicatat di `faers-verified.json` sebagai `relatedEstimatesNotInRows` supaya tidak tertukar dengan lima baris utama.

## 4. Apa yang kurang, dan apa yang harus dilakukan sebelum baris ini tampil sebagai forest plot

1. Manuskrip lengkap dengan Tabel 2 (atau tabel hasil disproportionality yang setara), untuk mengambil CI 5.47, jumlah kasus kejadian per baris, dan konfirmasi atau koreksi nilai 0.50 ARNI.
2. Konfirmasi dari Tabel 2 apakah 0.50 ARNI adalah ROR global yang sah, salah letak batas CI, atau salah ketik poster. Bila Tabel 2 tidak memuatnya, baris 0.50 harus dihapus dari plot dan poster perlu errata.
3. Jumlah kasus kejadian per baris untuk kelima baris, karena saat ini semua `cases` bernilai null. Ukuran kohort (finerenone 258, spironolactone 1,639, eplerenone 347, ARNI 1,061, aprocitentan 17, background 3,279, total analisis 6,601 dari 7,519 laporan) bukan pengganti jumlah kasus kejadian dan tidak boleh dilabeli sebagai kasus.
4. Sampai tiga hal itu terpenuhi, file `src/data/faers-verified.json` berstatus `unverified` secara keseluruhan, dan komponen forest plot hanya boleh merender tiga baris berstatus verified dengan catatan bahwa jumlah kasus belum terverifikasi, atau menunda plot sampai Tabel 2 tersedia. Baris 5.47 dan 0.50 tidak boleh dirender sebagai titik forest plot.

## 5. Catatan kejujuran yang wajib menyertai tampilan apa pun dari data ini

- ROR mengukur disproporsionalitas pelaporan di FAERS, bukan risiko klinis, bukan insidens, dan bukan kausalitas. Analisis FAERS bersifat hypothesis-generating.
- Aprocitentan bersifat sentinel dan exploratory (n = 17) dan tidak mendukung klaim komparatif.
- Time-to-onset memakai tanggal penerimaan laporan FDA sebagai proksi tanggal kejadian (time-to-report), dan perbandingan Weibull antar obat bersifat deskriptif tanpa uji formal, sesuai lembar Q&A.
- Poster v3 sendiri mencantumkan limitations: no denominator, under-reporting, not causality.
