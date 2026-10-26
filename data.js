/* Data register SIHI — embedded so the app runs from file:// (local-first).
   Sumber: 01_HIRADC · 02_Register Peraturan · 03_Register SIHI · 04_Register B3/APD (Rev.1, 27 Oktober 2026). */
const SIHI_DATA = {

  rekapHiradc: [
    { area: "Laboratorium", bahaya: 6, awalTertinggi: "High (9)", residualLow: 3, residualMod: 3 },
    { area: "Workshop / Bengkel", bahaya: 5, awalTertinggi: "High (9)", residualLow: 2, residualMod: 3 },
    { area: "Fasilitas & Gedung", bahaya: 6, awalTertinggi: "Extremely High (12)", residualLow: 2, residualMod: 4 },
    { area: "Kantor / Administrasi", bahaya: 6, awalTertinggi: "Moderate (6)", residualLow: 4, residualMod: 2 }
  ],

  temuanKunci: [
    { faktor: "Kebisingan (gerinda, Workshop Teknik)", hasil: "Leq 95,6 dBA; TWA 89,6 dBA", acuan: "NAB 85 dBA (Permenaker 5/2018)", status: "Perlu pengendalian" },
    { faktor: "Pencahayaan (Ruang Rapat FIKES, 24 m²)", hasil: "Erata 280,6 lux; 9 titik (SNI 7062:2019)", acuan: "250 lux (SNI 6197:2011)", status: "Memenuhi syarat" },
    { faktor: "Tekanan panas (ruang server)", hasil: "WBGT 29,4 °C", acuan: "28 °C (kerja 75%)", status: "Perlu pengendalian" },
    { faktor: "Ergonomi (perakitan workshop)", hasil: "Skor REBA 7", acuan: "≤ 4", status: "Perlu perbaikan" },
    { faktor: "Kimia (toluena, analis lab)", hasil: "32 ppm", acuan: "50 ppm (TWA)", status: "Memenuhi syarat" },
    { faktor: "Biologi (bioaerosol, lab mikrobiologi)", hasil: "420 CFU/m³", acuan: "500 CFU/m³", status: "Memenuhi syarat" }
  ],

  seg: [
    ["Laboratorium Kes. Masyarakat", "Teknisi laboratorium", "K, B", "Direct reading & impinger; swab permukaan", "6 bulan", "Permenaker 5/2018; Permenkes 70/2016"],
    ["Laboratorium Kes. Masyarakat", "Mahasiswa praktikum", "K, B, E", "Observasi & kuesioner ergonomi", "6 bulan", "Permenaker 5/2018 (ergonomi)"],
    ["Laboratorium Kimia", "Analis kimia", "K", "Adsorbent tube + air pump (NIOSH/HSE)", "3 bulan", "Permenaker 5/2018 (NAB kimia)"],
    ["Workshop / Bengkel", "Operator mesin & gerinda", "F", "Sound level meter & dosimeter (SNI 7231:2009)", "3 bulan", "NAB kebisingan 85 dBA (8 jam)"],
    ["Workshop / Bengkel", "Operator las", "F, K", "Lux meter; personal sampling asap las", "6 bulan", "Permenaker 5/2018"],
    ["Workshop / Bengkel", "Pekerja pengangkatan", "E", "Asesmen REBA & kuesioner", "6 bulan", "Permenaker 5/2018"],
    ["Fasilitas & Gedung", "Teknisi listrik & ketinggian", "F", "Observasi prosedur & izin kerja", "Insidental", "Permenaker 9/2016; Permenaker 11/2026"],
    ["Fasilitas & Gedung", "Petugas kebersihan", "K, E", "Kuesioner & observasi postur", "6 bulan", "Permenaker 5/2018"],
    ["Kantor / Administrasi", "Staf administrasi & dosen", "E, P", "Kuesioner ergonomi & stres kerja", "12 bulan", "Permenaker 5/2018; PP 50/2012"]
  ],

  alat: [
    ["Sound Level Meter", "Kebisingan (dBA)", "Larson Davis / 831", "SLM-2021-045", "10 Feb 2026", "10 Feb 2027", "Tersedia"],
    ["Noise Dosimeter", "Pajanan kebisingan personal (dosis)", "3M Quest / Edge 5", "DOS-2022-011", "05 Mar 2026", "05 Mar 2027", "Tersedia"],
    ["Lux Meter", "Intensitas pencahayaan (lux)", "Extech / LT300", "LUX-2020-007", "18 Jan 2026", "18 Jan 2027", "Tersedia"],
    ["Heat Stress Meter (WBGT)", "Tekanan panas (WBGT °C)", "Kestrel / 5400", "WBGT-2023-002", "22 Apr 2026", "22 Apr 2027", "Tersedia"],
    ["Air Sampling Pump (Low Volume)", "Zat kimia di udara (personal)", "SKC / AirChek 52", "AP-LV-2021-014", "01 Feb 2026", "01 Feb 2027", "Tersedia"],
    ["Air Sampling Pump (High Volume)", "Debu partikulat (TSP)", "SKC / Leland Legacy", "AP-HV-2020-003", "12 Jan 2026", "12 Jan 2027", "Perlu kalibrasi"],
    ["Gas Detector (Direct Reading)", "CO, H2S, O2 (%LEL)", "Dräger / X-am 2500", "GD-2022-009", "20 Mar 2026", "20 Mar 2027", "Tersedia"],
    ["Personal Sampler (Passive Dosimeter)", "VOC / pelarut organik", "3M / 3500", "PD-2023-006", "15 Apr 2026", "15 Apr 2027", "Tersedia"],
    ["Air Microbial Sampler", "Bioaerosol (CFU/m³)", "Sartorius / MD8", "BIO-2021-021", "08 Feb 2026", "08 Feb 2027", "Tersedia"],
    ["Anemometer", "Kecepatan aliran udara (m/s)", "Testo / 405i", "ANM-2023-010", "02 Mar 2026", "02 Mar 2027", "Tersedia"],
    ["Goniometer / Inclinometer", "Sudut postur (ergonomi)", "Baseline / 12-1057", "ERG-2022-004", "30 Jan 2026", "30 Jan 2027", "Tersedia"]
  ],

  hasil: [
    ["Workshop Teknik — sumber gerinda", "Fisik", "Kebisingan Leq (5 siklus)", "95,6", "dBA", "85 dBA (8 jam)", "Perlu pengendalian"],
    ["Workshop Teknik — operator gerinda", "Fisik", "TWA 8 jam (pajanan 2 jam/hari)", "89,6", "dBA", "85 dBA", "Perlu pengendalian"],
    ["Ruang Rapat FIKES (24 m²) — Erata 9 titik", "Fisik", "Pencahayaan", "280,6", "lux", "250 lux (SNI 6197:2011)", "Memenuhi syarat"],
    ["Ruang Rapat FIKES", "Fisik", "Keseragaman Emin/Erata", "0,93", "rasio", "≥ 0,6", "Memenuhi syarat"],
    ["Kantor — ruang server", "Fisik", "WBGT", "29,4", "°C", "28 °C (kerja 75%)", "Perlu pengendalian"],
    ["Lab Kimia — analis (personal)", "Kimia", "Toluena di udara", "32", "ppm", "50 ppm", "Memenuhi syarat"],
    ["Lab Kimia — area penimbangan", "Kimia", "Debu total", "1,8", "mg/m³", "10 mg/m³", "Memenuhi syarat"],
    ["Lab Mikrobiologi", "Biologi", "Bioaerosol", "420", "CFU/m³", "500 CFU/m³ (pedoman)", "Memenuhi syarat"],
    ["Lab Mikrobiologi — air keran", "Biologi", "Total coliform", "0", "MPN/100mL", "0/100 mL", "Memenuhi syarat"],
    ["Workshop — perakitan", "Ergonomi", "Skor REBA", "7", "skor", "risiko sedang (≤4)", "Perlu perbaikan"],
    ["Kantor — seluruh staf", "Psikologi", "Skor stres kerja", "Sedang", "kategori", "rendah", "Perlu pemantauan"]
  ],

  action: [
    ["HIRADC — Fasilitas", "Prosedur izin kerja pada ketinggian belum formal", "Extremely High", "Menerbitkan SOP kerja ketinggian & formulir izin kerja", "K3 & Fasilitas", "30 Nov 2026", "Dalam proses"],
    ["HIRADC — Fasilitas", "LOTO pekerjaan listrik belum terdokumentasi", "Extremely High", "Penerapan prosedur LOTO & pelatihan personel", "Teknisi Listrik", "15 Des 2026", "Dalam proses"],
    ["Pengukuran", "Kebisingan gerinda Leq 95,6 dBA (TWA 89,6 dBA) melebihi NAB 85 dBA", "High", "Peredaman & penutupan sumber; rotasi kerja + APD pendengaran", "Workshop", "20 Des 2026", "Dalam proses"],
    ["Pengukuran", "Skor REBA perakitan 7 (risiko sedang)", "Moderate", "Perbaikan stasiun kerja & meja tinggi dapat disetel", "Workshop", "31 Des 2026", "Dalam proses"],
    ["Evaluasi Kesesuaian", "Manual SMK3 belum tersedia", "High", "Penyusunan manual SMK3 & audit internal", "Tim K3", "31 Mar 2027", "Dalam proses"],
    ["Evaluasi Kesesuaian", "Label sekunder bahan kimia belum seragam", "Moderate", "Standarisasi label & pelatihan penanganan B3", "Laboratorium", "30 Nov 2026", "Selesai"],
    ["Register B3", "Kalibrasi pompa high volume kadaluarsa", "Moderate", "Kalibrasi ulang ke lembaga terakreditasi", "Laboratorium", "01 Nov 2026", "Dalam proses"]
  ],

  mcu: [
    ["Laboratorium", 12, 10, "2 (peningkatan tekanan darah)", "Pemantauan & rujukan klinis; evaluasi beban kerja"],
    ["Workshop / Bengkel", 9, 7, "2 (penurunan fungsi pendengaran ringan)", "Penguatan penggunaan APD & pengendalian kebisingan"],
    ["Fasilitas & Gedung", 8, 8, "—", "Lanjutkan pengendalian yang ada"],
    ["Kantor / Administrasi", 24, 20, "4 (keluhan muskuloskeletal)", "Perbaikan ergonomi workstation & micro-break"],
    ["Dosen & Tendik Lain", 30, 28, "2 (peningkatan kolesterol)", "Program kesehatan & gaya hidup"]
  ],

  promosi: [
    ["Sosialisasi Kode Etik Profesi HI", "Praktisi & calon praktisi HI", "Pertemuan & dokumen", "Semester I", "Tim HI"],
    ["Pelatihan penggunaan APD yang benar", "Teknisi laboratorium & workshop", "Demonstrasi & simulasi", "Semester I", "Tim K3"],
    ["Kampanye ergonomi workstation & peregangan", "Staf administrasi & dosen", "Poster, video, micro-break", "Semester I & II", "Tim K3"],
    ["Penyuluhan penanganan B3 & tumpahan", "Petugas laboratorium", "Simulasi & leaflet", "Semester II", "Laboratorium"],
    ["Simulasi tanggap darurat & evakuasi", "Seluruh warga kampus", "Drill evakuasi & APAR", "Semester II", "K3 & Fasilitas"],
    ["Pemeriksaan kesehatan & konseling", "Pegawai berisiko (lab, workshop, fasilitas)", "MCU & konseling", "Semester II", "Unit Kesehatan"],
    ["Publikasi bulletin K3 & keselamatan", "Seluruh warga kampus", "Buletin, media sosial, website", "Berkelanjutan", "Tim K3"]
  ],

  peraturan: [
    ["UU No. 1/1970", "Pasal 3 (syarat K3); Pasal 7 (penyediaan APD)", "APD praktikum & pengendalian sumber bahaya gedung", "Tercapai", "Register APD (04); HIRADC"],
    ["PP No. 50/2012", "Pasal 5 (kewajiban SMK3); Pasal 8–10", "Manual SMK3, HIRADC, audit internal & review", "Berjalan", "HIRADC; PROG-K3-2026"],
    ["Permenaker No. 5/2018", "Pasal 2–3 & Lampiran (NAB lingkungan kerja)", "Pengukuran kebisingan gerinda & pencahayaan ruang", "Berjalan", "LAP-HIMU-01; 03_Register"],
    ["Permenaker No. 15/2008", "Pasal 4–6 (kotak P3K & petugas P3K)", "Kotak P3K tiap lantai/lab; petugas P3K terlatih", "Tercapai", "Daftar P3K; sertifikat petugas"],
    ["Permenaker No. PER-02/1980", "Pasal 2 (MCU sebelum kerja, berkala, khusus)", "MCU tahunan pegawai berisiko", "Tercapai (2026)", "Rekap MCU (03_Register)"],
    ["Kepmenakertrans No. KEP.186/1999", "UPK: petugas pemadam kelas A–D; pemeliharaan APAR", "Petugas Kelas D terlatih; APAR tiap titik + refill berkala", "Tercapai", "Sertifikat Kelas D; kartu inspeksi APAR"],
    ["UU 1/1970 jo. PP 50/2012 (APD)", "Pasal 7 (APD); penggunaan APD sesuai risiko", "APD praktikum tersedia & dipakai", "Tercapai", "Register APD (04)"],
    ["Permenkes No. 70/2016", "Pasal 4 (standar kesehatan lingkungan kerja)", "Pemantauan pencahayaan & lingkungan kerja", "Berjalan", "LAP-HIMU-01"],
    ["Kepmenakertrans No. KEP.209/2008", "SKKNI Higiene Industri", "Kompetensi pengelola program HI kampus", "Tercapai", "Sertifikat kompetensi"],
    ["Permenaker No. 9/2016", "K3 pekerjaan pada ketinggian", "SOP & izin kerja ketinggian pemeliharaan gedung", "Perlu perbaikan", "HIRADC Fasilitas; CAR"]
  ]
};
