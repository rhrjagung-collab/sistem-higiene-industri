/* SIHI — vanilla renderer: tabs, search, status filter, CSV export. No dependencies. */
(function () {
  "use strict";

  var CHIP = {
    "Tercapai": "ok", "Sesuai": "ok", "Memenuhi syarat": "ok", "Tersedia": "ok", "Selesai": "ok",
    "Berjalan": "warn", "Dalam proses": "warn", "Perlu perbaikan": "warn", "Perlu pengendalian": "warn",
    "Perlu pemantauan": "warn", "Perlu kalibrasi": "warn", "Belum sesuai": "bad"
  };

  function chip(v) {
    var cls = CHIP[v] || "warn";
    return '<span class="chip ' + cls + '">' + esc(v) + "</span>";
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---- tab definitions ------------------------------------------------ */
  var TABS = [
    { id: "ringkasan", label: "Ringkasan", custom: true },
    { id: "seg", label: "Bahaya & SEG",
      title: "Register Identifikasi Bahaya & Similar Exposure Group (SEG)",
      note: "Kode bahaya: F = Fisik, K = Kimia, B = Biologi, E = Ergonomi, P = Psikologi.",
      cols: ["Area / Unit Kerja", "SEG", "Bahaya", "Metode / Cara Sampling", "Frekuensi", "Acuan / NAB"],
      center: [2, 4], rows: SIHI_DATA.seg },
    { id: "alat", label: "Peralatan & Kalibrasi",
      title: "Register Peralatan Pengukuran & Kalibrasi",
      note: "Semua alat dikalibrasi minimal 1 tahun sekali oleh lembaga kalibrasi terakreditasi KAN.",
      cols: ["Peralatan", "Fungsi / Parameter", "Merk / Model", "No. Seri", "Kal. Terakhir", "Kal. Berikutnya", "Status"],
      center: [3, 4, 5, 6], statusCol: 6, rows: SIHI_DATA.alat },
    { id: "hasil", label: "Hasil Pengukuran",
      title: "Hasil Pengukuran Lingkungan Kerja — Semester I 2026",
      note: "Kebisingan diukur per SNI 7231:2009 (gerinda, Workshop Teknik); pencahayaan per SNI 7062:2019 & SNI 6197:2011 (Ruang Rapat, 9 titik).",
      cols: ["Area / SEG", "Faktor", "Parameter", "Hasil", "Satuan", "NAB / Acuan", "Kesimpulan"],
      center: [3, 4], statusCol: 6, rows: SIHI_DATA.hasil },
    { id: "action", label: "Action Tracker",
      title: "Action Tracker — Pemantauan Tindak Lanjut (CAR FRM-HIMU-02)",
      note: "Setiap temuan HIRADC/pengukuran dievaluasi melalui Permintaan Tindakan Perbaikan.",
      cols: ["Sumber Temuan", "Uraian Temuan", "Tingkat Risiko", "Tindakan Perbaikan", "PIC", "Target", "Status"],
      center: [2, 5, 6], statusCol: 6, rows: SIHI_DATA.action },
    { id: "mcu", label: "Rekap MCU",
      title: "Rekap Pemeriksaan Kesehatan Tenaga Kerja (MCU) — Agregat & Anonim",
      note: "Data disajikan agregat tanpa identitas individu (Permenaker No. PER-02/MEN/1980).",
      cols: ["Unit Kerja", "Diperiksa", "Normal", "Perlu Perhatian", "Rekomendasi"],
      center: [1, 2, 3], rows: SIHI_DATA.mcu },
    { id: "promosi", label: "Promosi Kesehatan",
      title: "Register Promosi Kesehatan & Keselamatan Kerja — 2026",
      note: "Pelaksanaan sesuai Program K3 Tahunan (PROG-K3-2026).",
      cols: ["Kegiatan", "Sasaran", "Media / Metode", "Jadwal", "PIC"],
      center: [3], rows: SIHI_DATA.promosi },
    { id: "peraturan", label: "Peraturan & Capaian",
      title: "Register Peraturan K3 Lingkup Kampus & Capaian Penerapannya",
      note: "Hanya peraturan yang berlaku langsung pada aktivitas kampus; capaian dipantau berkala (FRM-HIMU-01).",
      cols: ["Peraturan", "Pasal / Ketentuan Kunci", "Kewajiban yang Diimplementasikan", "Capaian", "Bukti / Referensi"],
      center: [3], statusCol: 3, rows: SIHI_DATA.peraturan }
  ];

  var active = TABS[0];
  var q = "";
  var status = "";

  function setActive(tab) {
    active = tab; q = ""; status = "";
    document.getElementById("q").value = "";
    if (history.replaceState) history.replaceState(null, "", "#" + tab.id);
    renderTabs(); render();
  }

  function chipCol(tab, ri) {
    return tab.statusCol != null ? tab.rows[ri][tab.statusCol] : null;
  }

  function statusOptions(tab) {
    if (tab.statusCol == null) return [];
    var seen = {};
    tab.rows.forEach(function (r) { seen[r[tab.statusCol]] = 1; });
    return Object.keys(seen);
  }

  function rowFiltered(tab, ri) {
    var r = tab.rows[ri];
    if (status && chipCol(tab, ri) !== status) return false;
    if (!q) return true;
    return r.join(" \u0001 ").toLowerCase().indexOf(q.toLowerCase()) !== -1;
  }

  function renderTable(tab) {
    var html = '<table><caption>' + esc(tab.title) + "</caption><thead><tr>";
    tab.cols.forEach(function (c, i) {
      html += "<th" + (tab.center && tab.center.indexOf(i) !== -1 ? ' class="center"' : "") + ">" + esc(c) + "</th>";
    });
    html += "</tr></thead><tbody>";
    var shown = 0;
    tab.rows.forEach(function (row, ri) {
      if (!rowFiltered(tab, ri)) return;
      shown += 1;
      html += "<tr>";
      row.forEach(function (v, ci) {
        var cls = tab.center && tab.center.indexOf(ci) !== -1 ? " center" : "";
        if (tab.statusCol === ci) html += '<td class="center">' + chip(v) + "</td>";
        else html += '<td class="' + cls.trim() + '">' + esc(v) + "</td>";
      });
      html += "</tr>";
    });
    html += "</tbody></table>";
    if (tab.note) html += '<p class="note">' + esc(tab.note) + "</p>";
    return { html: html, shown: shown };
  }

  function renderSummary() {
    var totalB = 0, low = 0, mod = 0;
    SIHI_DATA.rekapHiradc.forEach(function (r) {
      totalB += r.bahaya; low += r.residualLow; mod += r.residualMod;
    });
    var open = SIHI_DATA.action.filter(function (a) { return a[6] !== "Selesai"; }).length;
    var exceed = SIHI_DATA.hasil.filter(function (h) {
      return /Perlu/.test(h[6]) || /Belum/.test(h[6]);
    }).length;
    var html = '<div class="kpi-strip">';
    html += '<div class="kpi"><b>' + totalB + "</b><span>bahaya teridentifikasi (4 area HIRADC)</span></div>";
    html += '<div class="kpi"><b>' + (low + mod) + "</b><span>residual risk Low/Moderate (Low " + low + ", Moderate " + mod + ")</span></div>";
    html += '<div class="kpi"><b>' + exceed + "</b><span>hasil ukur perlu tindak lanjut</span></div>";
    html += '<div class="kpi"><b>' + open + "/" + SIHI_DATA.action.length + "</b><span>CAR masih berjalan</span></div>";
    html += "</div>";
    html += '<div class="summary-grid">';
    html += '<div><table><caption>Rekap HIRADC per area (residual)</caption><thead><tr>' +
            "<th>Area</th><th>Bahaya</th><th>Awal tertinggi</th><th>Residual Low</th><th>Residual Moderate</th></tr></thead><tbody>";
    SIHI_DATA.rekapHiradc.forEach(function (r) {
      html += "<tr><td>" + esc(r.area) + '</td><td class="num">' + r.bahaya + '</td><td class="center">' + esc(r.awalTertinggi) +
              '</td><td class="num">' + r.residualLow + '</td><td class="num">' + r.residualMod + "</td></tr>";
    });
    html += '</tbody></table></div>';
    html += '<div><table><caption>Temuan kunci lingkungan kerja (Semester I 2026)</caption><thead><tr>' +
            "<th>Faktor & lokasi</th><th>Hasil</th><th>Acuan</th><th>Kesimpulan</th></tr></thead><tbody>";
    SIHI_DATA.temuanKunci.forEach(function (r) {
      html += "<tr><td>" + esc(r.faktor) + "</td><td>" + esc(r.hasil) + "</td><td>" + esc(r.acuan) + "</td><td>" + chip(r.status) + "</td></tr>";
    });
    html += "</tbody></table></div></div>";
    html += '<p class="note">Sumber: 01_HIRADC_UPNVJ_2026.xlsx; LAP-HIMU-01; 03_Register_Sistem_Informasi_Higiene_Industri.xlsx. '
          + "Kebisingan gerinda diukur per SNI 7231:2009; pencahayaan ruang rapat per SNI 7062:2019 &amp; SNI 6197:2011.</p>";
    return { html: html, shown: SIHI_DATA.rekapHiradc.length + SIHI_DATA.temuanKunci.length };
  }

  function render() {
    var view = document.getElementById("view");
    var out = active.custom ? renderSummary() : renderTable(active);
    view.innerHTML = out.html;
    document.getElementById("count").textContent = out.shown + " baris ditampilkan";

    var sel = document.getElementById("status");
    var opts = statusOptions(active);
    sel.style.display = opts.length ? "" : "none";
    sel.innerHTML = '<option value="">Semua</option>' + opts.map(function (o) {
      return '<option' + (o === status ? " selected" : "") + ">" + esc(o) + "</option>";
    }).join("");
  }

  function renderTabs() {
    var nav = document.getElementById("tabs");
    nav.innerHTML = "";
    TABS.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = t.label;
      if (t === active) b.className = "active";
      b.addEventListener("click", function () { setActive(t); });
      nav.appendChild(b);
    });
  }

  document.getElementById("q").addEventListener("input", function (e) {
    q = e.target.value.trim(); render();
  });
  document.getElementById("status").addEventListener("change", function (e) {
    status = e.target.value; render();
  });
  document.getElementById("csv").addEventListener("click", function () {
    var lines = [];
    if (active.custom) {
      lines.push(["Rekap HIRADC"].concat(["Area", "Bahaya", "Awal tertinggi", "Residual Low", "Residual Moderate"]).join(";"));
      SIHI_DATA.rekapHiradc.forEach(function (r) { lines.push([r.area, r.bahaya, r.awalTertinggi, r.residualLow, r.residualMod].join(";")); });
      lines.push("");
      lines.push(["Temuan kunci"].concat(["Faktor", "Hasil", "Acuan", "Status"]).join(";"));
      SIHI_DATA.temuanKunci.forEach(function (r) { lines.push(r.join(";")); });
    } else {
      lines.push(active.cols.join(";"));
      active.rows.forEach(function (r, ri) {
        if (rowFiltered(active, ri)) lines.push(r.join(";"));
      });
    }
    var blob = new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sihi_" + active.id + ".csv";
    document.body.appendChild(a); a.click(); a.remove();
  });

  var initial = (location.hash || "").replace("#", "");
  active = TABS.find(function (t) { return t.id === initial; }) || TABS[0];
  renderTabs();
  render();
})();
