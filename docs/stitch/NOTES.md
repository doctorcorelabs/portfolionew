# Stitch design reference - hero screen

## Status

REFERENSI desain saja. File-file di folder ini BUKAN kode produksi dan TIDAK boleh ditempel mentah ke situs. Kode produksi dibangun ulang di repo mengikuti arah MANUSKRIP dan data riset asli yang terverifikasi.

## Project

- Title: DaivanLabs Portfolio Rebuild
- Project name: projects/990638472795320411
- Project id: 990638472795320411
- Visibility: PRIVATE
- Dibuat: 2026-10-24 lewat klien MCP yang sudah ada di ~/workspace/custom-connectors/custom.stitch/bin/client.py (tanpa key tertulis di file mana pun).

## Screen

- Screen id: TIDAK TERSEDIA. Dua kali pemanggilan generate_screen_from_text (model default, lalu GEMINI_3_8_FLASH) melewati batas waktu klien sekitar 45 detik dengan pesan "MCP request did not complete".
- list_screens untuk project ini berulang kali mengembalikan objek kosong, dan get_project tidak mengembalikan screenInstances. Karena itu get_screen tidak dapat dijalankan (tidak ada screen id).
- Yang berhasil diambil: file thumbnail project lewat download_file, yang ternyata berisi screenshot halaman penuh hasil generate. Itulah file hero-screenshot.png di folder ini.
- Thumbnail file: projects/990638472795320411/files/9ea2ccd8dca040219663cebe43ea5028 (PNG 2560 x 3548, 820.477 byte).
- Design theme hasil generate tersimpan di design-theme.json (nama tema Stitch: Archival Research Press, mode LIGHT, headline dan body NEWSREADER, label SPACE_MONO, surface #faf9f6, aksen merah sekunder #b51a1e).

## Prompt yang dipakai

editorial research portfolio hero, one giant lowercase word research with a full stop, white paper background, black ink typography, one small red evidence marker, stepped survival curve line, minimal, no generic dashboard cards. Device: DESKTOP.

## Yang cocok dipakai sebagai referensi

- Kata raksasa "research." dengan titik, latar kertas terang, tipografi tinta hitam, dan satu penanda merah sebagai aksen.
- Kurva survival bertangga di panel kanan atas dengan pita interval dan penanda median.
- Label mono kecil, garis rambut pemisah, dan kolom abstrak, metodologi, dan daftar publikasi di bawah hero.
- Ritme editorial: satu pesan per viewport, banyak ruang kosong.

## PERINGATAN: isi screenshot adalah filler buatan Stitch

Seluruh teks, angka, institusi, dan sitasi di screenshot (misalnya onkologi, Harvard-MIT, N = 1.420, HR 0.42, DOI dan ISSN yang tercetak) adalah hasil karangan model Stitch, BUKAN data Daivan. Jangan menyalin angka, nama institusi, atau sitasi apa pun dari screenshot ini ke situs produksi. Data produksi hanya dari manuskrip, poster final, dan sumber terverifikasi.

## File HTML

- hero-screen.html TIDAK tersedia. HTML screen hanya bisa diunduh lewat get_screen dengan screen id, dan screen id tidak pernah dikembalikan server pada percobaan ini. Jangan mengarang HTML dari screenshot; bangun hero dari komponen produksi repo.
- Bila generate diulang di lain waktu dan screen id muncul, ambil HTML lewat get_screen lalu download_file atas html_code.name, dan perbarui catatan ini.

## Riwayat percobaan

1. list_projects: 4 project lama ditemukan, tidak ada project DaivanLabs Portfolio Rebuild.
2. create_project: berhasil, projects/990638472795320411.
3. generate_screen_from_text (model default): timeout klien sekitar 50 detik.
4. list_screens: kosong, dicek ulang setelah jeda 60 detik, tetap kosong.
5. generate_screen_from_text (GEMINI_3_8_FLASH): timeout klien sekitar 50 detik.
6. list_screens setelah jeda 90 detik: tetap kosong, tetapi get_project menunjukkan updateTime berubah dan thumbnailScreenshot terisi, sehingga screenshot diambil lewat download_file atas file thumbnail tersebut.
