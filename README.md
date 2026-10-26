# SIHI — Sistem Informasi Higiene Industri (UPN "Veteran" Jakarta)

Dashboard register program higiene industri: bahaya & SEG, peralatan & kalibrasi,
hasil pengukuran lingkungan kerja, action tracker (CAR), rekap MCU, promosi
kesehatan, dan capaian peraturan K3 lingkup kampus.

Vanilla HTML/CSS/JS — tanpa framework, tanpa build step. Data tertanam di
`data.js` sehingga aplikasi berjalan **lokal** (bisa dibuka langsung dari file),
dan siap dipublikasikan ke **GitHub** serta **Vercel** tanpa perubahan apa pun.

## Menjalankan lokal

Opsi 1 — langsung:

```
buka sihi/index.html di browser (double-click)
```

Opsi 2 — via server lokal:

```
cd sihi
python -m http.server 8080
# http://localhost:8080
```

## Push ke GitHub

```
cd sihi
git init
git add .
git commit -m "SIHI: register higiene industri UPNVJ (local-first)"
git branch -M main
git remote add origin https://github.com/<username>/sihi-upnvj.git
git push -u origin main
```

## Deploy ke Vercel

Opsi A — CLI:

```
npm i -g vercel
cd sihi
vercel --prod
```

Opsi B — dashboard: import repository GitHub di vercel.com, framework preset
**Other**, tanpa build command, output directory `./` (statis). Selesai.

## Struktur

```
sihi/
├── index.html   # kerangka halaman
├── styles.css   # styling institusional (navy/lime, tanpa framework)
├── app.js       # tab, pencarian, filter status, ekspor CSV
├── data.js      # data register (tertanam, local-first)
└── README.md
```

## Pembaruan data

Edit `data.js` (array `SIHI_DATA`), simpan, refresh browser — dan push ulang
untuk memperbarui situs. Sumber resmi data tetap berkas Excel register
(`03_Register_Sistem_Informasi_Higiene_Industri.xlsx`).

---
Dibuat oleh: Agung Raharjo, SKM., MKM. · Direview oleh: Dr. Agus Joko Susanto, SKM, MKKK · Disetujui oleh: Dr. Sri Yani, SKM., M.Sc.
