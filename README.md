# DaivanLabs - Research Portfolio

Portfolio riset Daivan Febri Juan Setiya, dibangun dari nol sebagai situs
baru untuk menggantikan daivanlabs.com yang lama. Bahasa visual: MANUSKRIP
(The Annotated Journal) - halaman kertas putih, tinta hitam, satu aksen
merah pena editor, tipografi raksasa, dan visualisasi riset sebagai konten
utama, bukan dekorasi.

Repo ini hanya berisi build situs. Koneksi ke Netlify diurus user secara
terpisah; tidak ada kredensial, API key, atau secret apa pun di repo ini.

## Stack

- React 19 + TypeScript + Vite
- react-router-dom untuk routing
- Font self-host via Fontsource: Archivo, Instrument Serif, IBM Plex Mono
- DialKit 2.0.2 sebagai devDependency saja, untuk tuning UI di canvas dev
  (route `#canvas`, DEV-only, tidak ikut bundle produksi)
- motion sebagai dependency runtime untuk animasi

## Perintah

```bash
npm install
npm run dev      # server dev Vite, default http://localhost:5173
npm run build    # typecheck + build produksi ke dist/
npm run preview  # pratinjau hasil build produksi
```

## Deploy

Konfigurasi Netlify ada di `netlify.toml`: build `npm run build`, publish
`dist/`, SPA fallback ke `/index.html`, header keamanan dasar, dan cache
immutable untuk `/assets/*`. Deploy Preview per pull request aktif lewat
pengaturan site di Netlify.

## Aturan kerja

- DialKit dan route canvas tidak pernah masuk produksi. Verifikasi akhir
  sebelum rilis: build lolos dan grep `dist/` menghasilkan 0 string
  `dialkit`, `DialRoot`, dan `dial-panel`.
- Data di canvas selalu sintetis. Tidak ada data pasien, data pribadi,
  atau kredensial di preview maupun di repo.
- Angka riset yang tampil di situs hanya angka yang sudah terverifikasi
  dari naskah atau poster final. Angka berstatus draft tidak dirender.
- Tanpa em dash di copy situs maupun di dokumen proyek ini.
