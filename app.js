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
    { id: "wizard", label: "Buat Laporan Pengukuran", custom: "wizard" },
    { id: "action", label: "Action Tracker",
      title: "Action Tracker — Pemantauan Tindak Lanjut (CAR FRM-HIMU-02)",
      note: "Setiap temuan HIRADC/pengukuran dievaluasi melalui Permintaan Tindakan Perbaikan.",
      cols: ["Sumber Temuan", "Uraian Temuan", "Tingkat Risiko", "Tindakan Perbaikan", "PIC", "Target", "Status"],
      center: [2, 5, 6], statusCol: 6, rows: SIHI_DATA.action },
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
    return { html: html, shown: SIHI_DATA.rekapHiradc.length + SIHI_DATA.temuanKunci.length };
  }

  /* ---- wizard: buat laporan hasil pengukuran ---- */
  var METODE = {
    "Kebisingan": "SNI 7231:2009 (sampling berdasarkan aktivitas pekerjaan)",
    "Pencahayaan": "SNI 7062:2019 & SNI 6197:2011 (bagian < 3 m2, titik = temu dua diagonal bagian)",
    "Zat kimia": "OSHA / NIOSH / HSE method",
    "Biologi": "Metode mikrobiologi standar (air, bioaerosol, makanan)",
    "Ergonomi": "Observasi postur & skor RULA / REBA, kuesioner",
    "Psikososial": "Kuesioner stres kerja"
  };

  function renderWizard() {
    var opts = Object.keys(METODE).map(function (f) { return "<option>" + f + "</option>"; }).join("");
    var units = ["lux", "dBA", "ppm", "mg/m\u00b3", "CFU/m\u00b3", "skor", "\u00b0C"].map(function (u) { return "<option>" + u + "</option>"; }).join("");
    var html = '<div class="wiz">'
      + '<h3>Buat laporan hasil pengukuran lingkungan kerja</h3>'
      + '<p class="note">Isi data pengukuran, tambahkan titik ukur, lalu buat laporan yang siap dicetak. Nilai rata-rata, minimum, maksimum, dan kesimpulan terhadap NAB dihitung otomatis.</p>'
      + '<div class="wiz-grid">'
      + '<div><label>Faktor pengukuran</label><select id="w_faktor">' + opts + "</select></div>"
      + '<div><label>Tanggal pengukuran</label><input type="date" id="w_tanggal"></div>'
      + '<div><label>Lokasi / Area / SEG</label><input type="text" id="w_lokasi" placeholder="cth. Workshop Teknik - operator gerinda"></div>'
      + '<div><label>Alat ukur</label><input type="text" id="w_alat" placeholder="cth. Sound Level Meter LD 831"></div>'
      + '<div><label>Petugas</label><input type="text" id="w_petugas" value="Agung Raharjo, SKM., MKM."></div>'
      + '<div><label>Satuan hasil</label><select id="w_satuan">' + units + "</select></div>"
      + '<div><label>NAB - angka (untuk kesimpulan otomatis)</label><input type="number" step="any" id="w_nab" placeholder="cth. 85"></div>'
      + '<div><label>NAB - acuan teks</label><input type="text" id="w_nabtxt" placeholder="cth. 85 dBA (8 jam) - Permenaker No. 5/2018"></div>'
      + "</div>"
      + '<table class="wiz-titik"><caption>Titik ukur</caption><thead><tr><th style="width:36px">No</th>'
      + "<th>Titik / Keterangan</th><th style=\"width:160px\">Hasil</th></tr></thead><tbody id=\"w_rows\"></tbody></table>"
      + '<p><button type="button" id="w_add">+ Tambah titik</button> '
      + '<button type="button" id="w_make" class="primary">Buat laporan</button></p>'
      + '<div id="reportArea"></div></div>';
    return { html: html, shown: 0 };
  }

  function addRow(titik, hasil) {
    var tb = document.getElementById("w_rows");
    var tr = document.createElement("tr");
    var n = tb.children.length + 1;
    tr.innerHTML = "<td class=\"center\">" + n + "</td>"
      + '<td><input type="text" class="w_t" value="' + (titik || "") + '" placeholder="cth. Titik A / posisi telinga operator"></td>'
      + '<td><input type="number" step="any" class="w_h" value="' + (hasil || "") + '"></td>';
    tb.appendChild(tr);
  }

  function wizardReport() {
    var f = document.getElementById("w_faktor").value;
    var tgl = document.getElementById("w_tanggal").value || "-";
    var lok = document.getElementById("w_lokasi").value || "-";
    var alat = document.getElementById("w_alat").value || "-";
    var pet = document.getElementById("w_petugas").value || "-";
    var sat = document.getElementById("w_satuan").value;
    var nab = parseFloat(document.getElementById("w_nab").value);
    var nabtxt = document.getElementById("w_nabtxt").value || "-";
    var rows = [], vals = [];
    document.querySelectorAll("#w_rows tr").forEach(function (tr) {
      var t = tr.querySelector(".w_t").value || ("Titik " + (rows.length + 1));
      var h = parseFloat(tr.querySelector(".w_h").value);
      if (isNaN(h)) return;
      rows.push({ t: t, h: h });
      vals.push(h);
    });
    if (!vals.length) { alert("Tambahkan minimal satu titik ukur dengan nilai hasil."); return; }

    var mean = vals.reduce(function (a, b) { return a + b; }, 0) / vals.length;
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    var uni = min > 0 ? (min / mean) : null;
    var okNab = !isNaN(nab);

    var kes = rows.map(function (r) {
      if (!okNab) return "Penilaian manual";
      return r.h <= nab ? "Memenuhi syarat" : "Melebihi NAB";
    });
    var nOK = kes.filter(function (k) { return k === "Memenuhi syarat"; }).length;

    var html = '<div id="reportArea" class="report">';
    html += '<h3>Laporan Hasil Pengukuran ' + esc(f) + '</h3>';
    html += "<table><tbody>"
      + "<tr><td>Instansi</td><td>UPN \u201cVeteran\u201d Jakarta \u2013 Fakultas Ilmu Kesehatan</td></tr>"
      + "<tr><td>Metode pengukuran</td><td>" + esc(METODE[f]) + "</td></tr>"
      + "<tr><td>Tanggal pengukuran</td><td>" + esc(tgl) + "</td></tr>"
      + "<tr><td>Lokasi / Area / SEG</td><td>" + esc(lok) + "</td></tr>"
      + "<tr><td>Alat ukur</td><td>" + esc(alat) + "</td></tr>"
      + "<tr><td>Petugas</td><td>" + esc(pet) + "</td></tr>"
      + "</tbody></table>";
    html += "<table><thead><tr><th>No</th><th>Titik / Keterangan</th><th>Hasil (" + esc(sat) + ")</th><th>Kesimpulan</th></tr></thead><tbody>";
    rows.forEach(function (r, i) {
      html += "<tr><td class=\"center\">" + (i + 1) + "</td><td>" + esc(r.t) + '</td><td class="num">' + r.h + '</td><td class="center">' + esc(kes[i]) + "</td></tr>";
    });
    html += "</tbody></table>";
    html += "<table><tbody>"
      + '<tr><td>Rata-rata</td><td class="num">' + mean.toFixed(2).replace(".", ",") + " " + esc(sat) + "</td></tr>"
      + '<tr><td>Minimum</td><td class="num">' + min + " " + esc(sat) + "</td></tr>"
      + '<tr><td>Maksimum</td><td class="num">' + max + " " + esc(sat) + "</td></tr>"
      + '<tr><td>Keseragaman Emin/Erata</td><td class="num">' + (uni ? uni.toFixed(2).replace(".", ",") : "-") + "</td></tr>"
      + "<tr><td>NAB / Acuan</td><td>" + esc(nabtxt) + "</td></tr>"
      + "</tbody></table>";
    html += "<p><b>Kesimpulan:</b> ";
    if (okNab) {
      html += nOK + " dari " + rows.length + " titik memenuhi syarat. "
        + (nOK === rows.length
           ? "Seluruh titik berada dalam batas NAB; lanjutkan pemantauan berkala."
           : (rows.length - nOK) + " titik melebihi NAB dan wajib ditindaklanjuti melalui pengendalian (hierarki pengendalian) serta dicatat pada Action Tracker / CAR.");
    } else {
      html += "Hasil di atas disajikan sebagai bahan penilaian manual terhadap acuan " + esc(nabtxt) + ".";
    }
    html += "</p>";
    html += '<p class="sign">Penyusun: Agung Raharjo, SKM., MKM. (Pakar Higiene Industri) &middot; '
      + "Direview oleh: Dr. Agus Joko Susanto, SKM, MKKK &middot; Disetujui oleh: Dr. Sri Yani, SKM., M.Sc. &middot; UPN \"Veteran\" Jakarta</p>";
    html += '<p><button type="button" onclick="window.print()">Cetak / Simpan PDF</button></p>';
    html += "</div>";
    document.getElementById("reportArea").outerHTML = html;
  }

  function bindWizard() {
    document.getElementById("w_add").addEventListener("click", function () { addRow("", ""); });
    document.getElementById("w_make").addEventListener("click", wizardReport);
    addRow("Titik A", "");
    addRow("Titik B", "");
  }

  function render() {
    document.querySelector(".bar").style.display = active.custom ? "none" : "";
    var view = document.getElementById("view");
    var out;
    if (active.custom === "wizard") { out = renderWizard(); }
    else if (active.custom) { out = renderSummary(); }
    else { out = renderTable(active); }
    view.innerHTML = out.html;
    document.getElementById("count").textContent = active.custom ? "" : out.shown + " baris ditampilkan";
    if (active.custom === "wizard") bindWizard();

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
    if (active.custom) { alert("Ekspor CSV tersedia pada tab register."); return; }
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
