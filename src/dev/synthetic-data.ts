/**
 * Data canvas 100 persen SINTETIS untuk rebuild portfolio riset.
 *
 * Aturan yang mengikat file ini (dari research/13-canvas-dialkit-plan.md):
 * - Setiap judul atau venue mengandung penanda fiktif ("Data Sintetis",
 *   "Contoh", atau nama venue fiktif) supaya tidak tertukar dengan karya asli.
 * - DILARANG menyalin angka riset asli mana pun, termasuk angka FAERS dan
 *   angka studi hipertensi pemilik portfolio. Semua angka di sini dibulatkan
 *   dan dibuat-buat sebagai contoh bentuk data.
 * - DILARANG data pasien, data pengguna asli, dan kredensial dalam bentuk
 *   apa pun. File ini hanya diimpor dari src/dev/.
 * - Venue selalu fiktif. Tidak ada nama jurnal, kongres, universitas,
 *   rumah sakit, atau peneliti asli di dalam file ini.
 */

export interface KaryaSintetis {
  id: string;
  nomor: string;
  judul: string;
  tahun: number;
  jenisStudi: string;
  venue: string;
  status: string;
  sampel: number;
  tag: string[];
  adaGambar: boolean;
}

export interface BarisForestSintetis {
  label: string;
  estimasi: number;
  bawah: number;
  atas: number;
}

export const karyaSintetis: KaryaSintetis[] = [
  {
    id: "sintetis-01",
    nomor: "01",
    judul:
      "Analisis Contoh tentang Pola Preskripsi pada Fasilitas Kesehatan Tingkat Pertama (Data Sintetis)",
    tahun: 2026,
    jenisStudi: "Kohort retrospektif",
    venue: "Jurnal Contoh Nusantara",
    status: "Terbit",
    sampel: 1200,
    tag: ["Farmakovigilans Contoh", "Layanan Primer"],
    adaGambar: true,
  },
  {
    id: "sintetis-02",
    nomor: "02",
    judul:
      "Telaah Sistematis Contoh tentang Intervensi Edukasi Kesehatan di Komunitas Perkotaan dan Dampaknya terhadap Perilaku Pencarian Layanan serta Kepatuhan Peserta Selama Dua Belas Bulan Pengamatan Berturut-turut (Data Sintetis)",
    tahun: 2025,
    jenisStudi: "Telaah sistematis",
    venue: "Jurnal Contoh Nusantara",
    status: "Dalam telaah",
    sampel: 850,
    tag: ["Edukasi Kesehatan Contoh"],
    adaGambar: false,
  },
  {
    id: "sintetis-03",
    nomor: "03",
    judul:
      "Uji Acak Terkendali Contoh tentang Alat Skrining Digital Berbasis Kuesioner (Data Sintetis)",
    tahun: 2025,
    jenisStudi: "Uji acak terkendali",
    venue: "Prosiding Contoh Ilmu Kesehatan",
    status: "Terbit",
    sampel: 640,
    tag: [
      "Alat Digital Contoh",
      "Skrining",
      "Kuesioner",
      "Implementasi",
    ],
    adaGambar: true,
  },
  {
    id: "sintetis-04",
    nomor: "04",
    judul:
      "Meta-analisis Contoh tentang Tiga Pendekatan Edukasi Pasien (Data Sintetis)",
    tahun: 2024,
    jenisStudi: "Meta-analisis",
    venue: "Jurnal Contoh Nusantara",
    status: "Terbit",
    sampel: 2100,
    tag: ["Meta-analisis Contoh", "Edukasi Pasien"],
    adaGambar: true,
  },
  {
    id: "sintetis-05",
    nomor: "05",
    judul:
      "Studi Kasus Contoh tentang Alur Rujukan Antar Fasilitas (Data Sintetis)",
    tahun: 2024,
    jenisStudi: "Studi kasus",
    venue: "Prosiding Contoh Ilmu Kesehatan",
    status: "Pratinjau",
    sampel: 120,
    tag: ["Rujukan Contoh", "Alur Layanan"],
    adaGambar: true,
  },
  {
    id: "sintetis-06",
    nomor: "06",
    judul:
      "Survei Contoh tentang Literasi Kesehatan Remaja di Kota Fiktif (Data Sintetis)",
    tahun: 2023,
    jenisStudi: "Survei potong lintang",
    venue: "Jurnal Contoh Nusantara",
    status: "Terbit",
    sampel: 980,
    tag: ["Literasi Contoh", "Remaja"],
    adaGambar: true,
  },
];

/**
 * Lima baris forest plot sintetis. Estimasi dan interval dibulatkan sebagai
 * contoh bentuk data. Baris terakhir sengaja melewati garis nol (nilai 1)
 * supaya garis nol dan label teruji. Angka-angka ini BUKAN hasil riset.
 */
export const forestPlotSintetis: BarisForestSintetis[] = [
  { label: "Studi Contoh A", estimasi: 1.45, bawah: 1.1, atas: 1.9 },
  { label: "Studi Contoh B", estimasi: 1.2, bawah: 0.9, atas: 1.6 },
  { label: "Studi Contoh C", estimasi: 0.85, bawah: 0.6, atas: 1.2 },
  { label: "Studi Contoh D", estimasi: 1.75, bawah: 1.35, atas: 2.3 },
  { label: "Studi Contoh E", estimasi: 1.05, bawah: 0.75, atas: 1.5 },
];

export const tahapanMetodeSintetis: string[] = [
  "Pertanyaan",
  "Pencarian literatur",
  "Skrining",
  "Analisis",
  "Sintesis",
];
