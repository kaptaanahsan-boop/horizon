/* ════════════════════════════════════════════════════════════════
   Horizon Physician Services — PUBLIC SITE ENGINE
   Renders content from the published content.json (or local edits),
   runs the consultation form, blog reader, and lead capture.
   All editing happens in the separate admin (admin.html).
   ════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var C = window.HPXCMS;
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function loadLS(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function saveLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function leads() { return loadLS(C.LS_LEADS) || []; }

  var content = { text: {}, sections: {}, contact: {}, social: {}, brand: {} };
  var defaults = {};

  /* ── apply ── */
  function applyText() {
    C.TEXTMAP.forEach(function (t) {
      if (content.text && content.text[t.k] != null) {
        var el = $(t.sel); if (!el) return;
        if (t.type === "html") el.innerHTML = content.text[t.k]; else el.textContent = content.text[t.k];
      }
    });
  }
  function effSection(sec) { return content.sections[sec] || defaults.sections[sec] || []; }
  function renderSection(sec) {
    var grid = $("#" + C.SCHEMA[sec].grid); if (!grid) return;
    grid.innerHTML = C.T[sec](effSection(sec));
    if (sec === "process") { var tr = $("#processTrack"); if (tr) tr.classList.add("go"); }
  }
  function renderOverrides() {
    C.SECTION_ORDER.forEach(function (sec) { if (content.sections[sec]) renderSection(sec); });
    renderSection("blog"); // always render (no static blog markup)
  }
  function cVal(k) { return (content.contact && content.contact[k] != null) ? content.contact[k] : (defaults.contact ? defaults.contact[k] : ""); }
  function sVal(k) { return (content.social && content.social[k] != null) ? content.social[k] : ""; }
  function bindContact() {
    $all('[data-c="phone"]').forEach(function (e) { e.textContent = cVal("phone"); });
    $all('[data-c="email"]').forEach(function (e) { e.textContent = cVal("email"); });
    $all('[data-c="hours"]').forEach(function (e) { e.textContent = cVal("hours"); });
    $all('[data-c="address"]').forEach(function (e) { e.innerHTML = cVal("address"); });
    var mail = $("[data-cta-mail]"); if (mail) mail.setAttribute("href", "mailto:" + cVal("email"));
    var tel = $("[data-cta-tel]"); if (tel) tel.setAttribute("href", "tel:" + String(cVal("phone")).replace(/[^\d+]/g, ""));
    ["linkedin", "facebook", "twitter"].forEach(function (k) { var el = $('[data-s="' + k + '"]'); if (el) el.setAttribute("href", sVal(k) || "#"); });
  }
  function applyBrand() {
    var b = content.brand || {}, root = document.documentElement.style;
    if (b.navy) { root.setProperty("--navy", b.navy); root.setProperty("--navy-dark", C.shade(b.navy, -0.35)); root.setProperty("--navy-mid", C.shade(b.navy, 0.18)); root.setProperty("--text-dark", C.shade(b.navy, -0.15)); }
    if (b.teal) { root.setProperty("--teal", b.teal); root.setProperty("--teal-dark", C.shade(b.teal, -0.25)); root.setProperty("--teal-light", C.shade(b.teal, 0.18)); root.setProperty("--teal-pale", C.shade(b.teal, 0.88)); }
    if (b.logo) $all(".nav-logo img").forEach(function (img) { img.src = b.logo; });
    if (b.company) $all(".nav-logo img").forEach(function (img) { img.alt = b.company; });
  }
  function applyAll() { applyText(); renderOverrides(); bindContact(); applyBrand(); }

  /* ── overlays ── */
  function openOverlay(id) { var e = $("#" + id); if (e) { e.classList.add("open"); document.body.style.overflow = "hidden"; } }
  function closeOverlay(id) { var e = $("#" + id); if (e) e.classList.remove("open"); if (!$(".hpx-modal-overlay.open")) document.body.style.overflow = ""; }

  /* ── consultation ── */
  function openConsult() { var f = $("#hpxConsultForm"); if (f) f.style.display = ""; var s = $("#hpxConsultSuccess"); if (s) s.style.display = "none"; openOverlay("hpxConsult"); }
  function submitLead(e) {
    e.preventDefault(); var f = e.target, d = {};
    ["name", "practice", "email", "phone", "interest", "message"].forEach(function (k) { d[k] = (f.elements[k] ? f.elements[k].value : "").trim(); });
    d.date = new Date().toISOString();
    var list = leads(); list.unshift(d); saveLS(C.LS_LEADS, list);
    f.reset(); f.style.display = "none"; var s = $("#hpxConsultSuccess"); if (s) s.style.display = "block"; return false;
  }
  function wireCTAs() {
    [".nav-cta .btn", ".mobile-menu .btn", "#hero .hero-ctas .btn-primary", "#final-cta .cta-actions .btn-primary"].forEach(function (s) {
      $all(s).forEach(function (el) { el.addEventListener("click", function (e) { e.preventDefault(); openConsult(); }); });
    });
  }

  /* ── blog reader ── */
  function openReader(i) {
    var p = effSection("blog")[i]; if (!p) return;
    $("#hpxReaderTitle").textContent = p.title;
    $("#hpxReaderMeta").textContent = [p.tag, p.date, p.author].filter(Boolean).join("  ·  ");
    var img = $("#hpxReaderImg");
    if (p.image) { img.src = p.image; img.style.display = ""; } else { img.style.display = "none"; }
    $("#hpxReaderBody").innerHTML = String(p.body || "").split(/\n\n+/).map(function (para) { return "<p>" + C.esc(para.trim()).replace(/\n/g, "<br>") + "</p>"; }).join("");
    openOverlay("hpxReader");
  }

  function wire() {
    $all(".hpx-modal-overlay").forEach(function (ov) { ov.addEventListener("click", function (e) { if (e.target === ov) closeOverlay(ov.id); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") $all(".hpx-modal-overlay.open").forEach(function (o) { closeOverlay(o.id); }); });
  }

  window.HPX = {
    openConsult: openConsult, closeConsult: function () { closeOverlay("hpxConsult"); }, submitLead: submitLead,
    openReader: openReader, closeReader: function () { closeOverlay("hpxReader"); }
  };

  function ready() { applyAll(); wireCTAs(); wire(); }
  function boot() {
    defaults = C.scrape(document);
    var stored = loadLS(C.LS_CONTENT);
    if (stored) { content = Object.assign({ text: {}, sections: {}, contact: {}, social: {}, brand: {} }, stored); ready(); }
    else {
      fetch("content.json", { cache: "no-store" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (obj) { if (obj) content = Object.assign({ text: {}, sections: {}, contact: {}, social: {}, brand: {} }, obj); })
        .catch(function () {})
        .finally(ready);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
