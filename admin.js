/* ════════════════════════════════════════════════════════════════
   Horizon Physician Services — STANDALONE ADMIN DASHBOARD
   Separate page (admin.html). Edits content, previews live, and
   exports content.json to publish. Self-contained, no server.
   ════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var C = window.HPXCMS;
  var $ = function (s) { return document.querySelector(s); };
  function esc(s) { return C.esc(s); }
  function escAttr(s) { return C.escAttr(s); }
  function copy(o) { return C.copy(o); }
  function loadLS(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function saveLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function leads() { return loadLS(C.LS_LEADS) || []; }
  var SS = "hpx_admin_session";

  var content = loadLS(C.LS_CONTENT) || { text: {}, sections: {}, contact: {}, social: {}, brand: {}, password: null };
  if (!content.text) content.text = {}; if (!content.sections) content.sections = {};
  if (!content.contact) content.contact = {}; if (!content.social) content.social = {}; if (!content.brand) content.brand = {};
  var defaults = { text: {}, sections: {}, contact: {}, social: {}, brand: {}, logoSrc: "logo.png" };
  var work = {};
  var current = "text";
  var previewOn = true;

  function getPw() { return content.password || C.DEFAULT_PW; }
  function persist() { saveLS(C.LS_CONTENT, content); }
  function toast(m) { var t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 2200); }
  function reloadPreview() { var f = $("#previewFrame"); if (f) { try { f.contentWindow.location.reload(); } catch (e) { f.src = f.src; } } }

  function effText(k) { return content.text[k] != null ? content.text[k] : (defaults.text[k] || ""); }
  function effSection(sec) { return content.sections[sec] ? copy(content.sections[sec]) : copy(defaults.sections[sec] || []); }

  /* ════════ AUTH ════════ */
  function login(e) {
    e.preventDefault();
    if ($("#pw").value === getPw()) { sessionStorage.setItem(SS, "1"); start(); }
    else { $("#loginErr").style.display = "block"; }
    return false;
  }
  function logout() { sessionStorage.removeItem(SS); location.reload(); }

  function start() {
    $("#login").style.display = "none";
    $("#app").style.display = "flex";
    buildSidebar();
    loadDefaultsThenRender();
  }
  function loadDefaultsThenRender() {
    fetch("index.html", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.text() : ""; })
      .then(function (html) {
        if (html) { try { var doc = new DOMParser().parseFromString(html, "text/html"); defaults = C.scrape(doc); } catch (e) {} }
      })
      .catch(function () {})
      .then(function () {
        // if no local edits yet, pull any published content.json as the starting point
        if (!localStorage.getItem(C.LS_CONTENT)) {
          return fetch("content.json", { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; })
            .then(function (obj) { if (obj) { content = Object.assign({ text: {}, sections: {}, contact: {}, social: {}, brand: {}, password: null }, obj); } })
            .catch(function () {});
        }
      })
      .then(function () { buildSidebar(); go("text"); });
  }

  /* ════════ SIDEBAR ════════ */
  var NAV = [
    ["text", "Pages & Text"], ["stats", "Stats"], ["bpo", "BPO"], ["services", "Services"], ["why", "Why Us"],
    ["process", "Process"], ["team", "Team"], ["testimonials", "Reviews"], ["faq", "FAQ"],
    ["blog", "Blog"], ["contact", "Contact"], ["brand", "Branding"], ["leads", "Leads"], ["publish", "Publish"]
  ];
  function secKey(tab) { return tab; } // tab names already match SCHEMA keys for section tabs
  function buildSidebar() {
    var html = NAV.map(function (n) {
      var tab = n[0], label = n[1], cnt = "";
      if (C.SCHEMA[tab]) cnt = '<span class="count">' + effSection(tab).length + "</span>";
      else if (tab === "leads") { var l = leads().length; if (l) cnt = '<span class="count">' + l + "</span>"; }
      return '<button class="navbtn' + (tab === current ? " active" : "") + '" onclick="ADM.go(\'' + tab + '\')">' + label + cnt + "</button>";
    }).join("");
    $("#sidebar").innerHTML = html;
  }

  /* ════════ ROUTER ════════ */
  function go(tab) {
    current = tab;
    document.querySelectorAll(".navbtn").forEach(function (b) { b.classList.remove("active"); });
    buildSidebar();
    var ed = $("#editor");
    if (tab === "text") renderText(ed);
    else if (C.SCHEMA[tab]) renderSectionEditor(ed, tab);
    else if (tab === "contact") renderContact(ed);
    else if (tab === "brand") renderBrand(ed);
    else if (tab === "leads") renderLeads(ed);
    else if (tab === "publish") renderPublish(ed);
    ed.scrollTop = 0;
  }

  /* ════════ PAGES & TEXT ════════ */
  function renderText(ed) {
    var html = '<h2>Pages &amp; Text</h2><div class="sub">Edit the fixed text across the site. Repeatable items have their own tabs.</div>';
    var lastG = "";
    C.TEXTMAP.forEach(function (t) {
      if (t.g !== lastG) { html += '<div class="group-h">' + esc(t.g) + "</div>"; lastG = t.g; }
      var v = effText(t.k);
      if (t.type === "textarea" || t.type === "html") html += '<div class="hpx-field"><label>' + esc(t.label) + '</label><textarea data-tk="' + t.k + '" rows="' + (t.type === "html" ? 3 : 3) + '">' + esc(v) + "</textarea></div>";
      else html += '<div class="hpx-field"><label>' + esc(t.label) + '</label><input data-tk="' + t.k + '" value="' + escAttr(v) + '"></div>';
    });
    html += '<div class="hpx-savebar"><button class="hpx-btn hpx-btn-primary" onclick="ADM.saveText()">Save Text</button></div>';
    ed.innerHTML = html;
  }
  function saveText() {
    C.TEXTMAP.forEach(function (t) {
      var el = $('[data-tk="' + t.k + '"]'); if (!el) return;
      var v = el.value;
      if (v !== (defaults.text[t.k] || "")) content.text[t.k] = v; else delete content.text[t.k];
    });
    persist(); reloadPreview(); toast("Text saved");
  }

  /* ════════ SECTION EDITORS ════════ */
  function fieldInput(sec, i, f) {
    var key = f[0], label = f[1], type = f[2], val = work[sec][i][key], idf = 'data-f="' + i + ":" + key + '"';
    var h = '<div class="hpx-field"><label>' + esc(label) + "</label>";
    if (type === "textarea") h += '<textarea ' + idf + ' rows="3">' + esc(val) + "</textarea>";
    else if (type === "bigtext") h += '<textarea ' + idf + ' rows="9">' + esc(val) + "</textarea>";
    else if (type === "rating") { h += '<select ' + idf + ">"; for (var r = 5; r >= 1; r--) h += '<option value="' + r + '"' + ((+val || 5) === r ? " selected" : "") + ">" + r + " ★</option>"; h += "</select>"; }
    else if (type === "icon") { h += '<select ' + idf + '><option value="__keep__">— current icon —</option>'; Object.keys(C.ICONS).forEach(function (n) { h += '<option value="' + esc(n) + '">' + esc(n) + "</option>"; }); h += "</select>"; }
    else if (type === "image") {
      var prev = val ? '<img class="hpx-thumb" src="' + escAttr(val) + '">' : '<span class="hpx-note">No image</span>';
      h += '<div style="display:flex;align-items:center;gap:10px;">' + prev + '<input type="file" accept="image/*" onchange="ADM.itemImg(\'' + sec + "'," + i + ",'" + key + "',event)\">" +
        (val ? '<button class="hpx-icobtn del" onclick="ADM.itemImg(\'' + sec + "'," + i + ",'" + key + "',null)\">🗑</button>" : "") + "</div>";
    } else h += '<input type="text" ' + idf + ' value="' + escAttr(val) + '">';
    return h + "</div>";
  }
  function renderSectionEditor(ed, sec) {
    work[sec] = effSection(sec);   // initialise working copy from saved/default
    drawSection(sec);
  }
  function drawSection(sec) {
    var ed = $("#editor");
    var sch = C.SCHEMA[sec], titlePlural = sch.title + "s";
    var html = '<h2>' + esc(titlePlural) + '</h2><div class="sub">Add, remove, reorder or edit each ' + esc(sch.title.toLowerCase()) + ', then Save.</div>';
    work[sec].forEach(function (item, i) {
      html += '<div class="hpx-item"><div class="hpx-item-head"><span class="t">' + esc(sch.title) + " " + (i + 1) + '</span><span class="hpx-item-tools">' +
        '<button class="hpx-icobtn" title="Up" onclick="ADM.itemMove(\'' + sec + "'," + i + ',-1)">↑</button>' +
        '<button class="hpx-icobtn" title="Down" onclick="ADM.itemMove(\'' + sec + "'," + i + ',1)">↓</button>' +
        '<button class="hpx-icobtn del" title="Delete" onclick="ADM.itemDel(\'' + sec + "'," + i + ')">🗑</button></span></div>';
      sch.fields.forEach(function (f) { html += fieldInput(sec, i, f); });
      html += "</div>";
    });
    html += '<button class="hpx-additem" onclick="ADM.itemAdd(\'' + sec + '\')">＋ Add ' + esc(sch.title) + "</button>";
    html += '<div class="hpx-savebar"><button class="hpx-btn hpx-btn-primary" onclick="ADM.saveSection(\'' + sec + '\')">Save ' + esc(titlePlural) +
      '</button><span class="sv">' + work[sec].length + " item" + (work[sec].length === 1 ? "" : "s") + "</span></div>";
    ed.innerHTML = html;
  }
  function syncEditor(sec) {
    document.querySelectorAll("#editor [data-f]").forEach(function (el) {
      var p = el.getAttribute("data-f").split(":"), i = +p[0], key = p[1];
      if (!work[sec][i]) return;
      if (el.value === "__keep__") return;
      if (key === "icon") { work[sec][i].icon = C.ICONS[el.value] || work[sec][i].icon; return; }
      work[sec][i][key] = el.value;
    });
  }
  function itemAdd(sec) { if (!work[sec]) work[sec] = effSection(sec); syncEditor(sec); work[sec].push(copy(C.SCHEMA[sec].blank)); drawSection(sec); }
  function itemDel(sec, i) { if (!confirm("Delete this item?")) return; syncEditor(sec); work[sec].splice(i, 1); drawSection(sec); }
  function itemMove(sec, i, d) { syncEditor(sec); var j = i + d; if (j < 0 || j >= work[sec].length) return; var t = work[sec][i]; work[sec][i] = work[sec][j]; work[sec][j] = t; drawSection(sec); }
  function itemImg(sec, i, key, ev) {
    syncEditor(sec);
    if (ev == null) { work[sec][i][key] = ""; drawSection(sec); return; }
    var f = ev.target.files[0]; if (!f) return;
    var rd = new FileReader(); rd.onload = function () { work[sec][i][key] = rd.result; drawSection(sec); }; rd.readAsDataURL(f);
  }
  function saveSection(sec) { syncEditor(sec); content.sections[sec] = copy(work[sec]); persist(); reloadPreview(); buildSidebar(); toast(C.SCHEMA[sec].title + "s saved"); }

  /* ════════ CONTACT ════════ */
  function cv(k) { return content.contact[k] != null ? content.contact[k] : (defaults.contact[k] || ""); }
  function renderContact(ed) {
    var s = content.social || {};
    ed.innerHTML = '<h2>Contact Info</h2><div class="sub">Shown in the call-to-action band and footer everywhere.</div>' +
      '<div class="hpx-field"><label>Phone</label><input id="ct_phone" value="' + escAttr(cv("phone")) + '"></div>' +
      '<div class="hpx-field"><label>Email</label><input id="ct_email" value="' + escAttr(cv("email")) + '"></div>' +
      '<div class="hpx-field"><label>Address (use commas; line breaks added automatically)</label><input id="ct_address" value="' + escAttr((cv("address") || "").replace(/<br\s*\/?>/gi, ", ")) + '"></div>' +
      '<div class="hpx-field"><label>Office hours</label><input id="ct_hours" value="' + escAttr(cv("hours")) + '"></div>' +
      '<div class="group-h">Social links</div>' +
      '<p class="hpx-note" style="margin:-6px 0 12px;">LinkedIn and Instagram appear in the band above the footer. Leave a field blank to hide that button.</p>' +
      '<div class="hpx-field"><label>LinkedIn URL</label><input id="so_linkedin" value="' + escAttr(s.linkedin || "") + '" placeholder="https://linkedin.com/company/…"></div>' +
      '<div class="hpx-field"><label>Instagram URL</label><input id="so_instagram" value="' + escAttr(s.instagram || "") + '" placeholder="https://instagram.com/…"></div>' +
      '<div class="hpx-field"><label>Facebook URL</label><input id="so_facebook" value="' + escAttr(s.facebook || "") + '" placeholder="https://facebook.com/…"></div>' +
      '<div class="hpx-field"><label>X / Twitter URL</label><input id="so_twitter" value="' + escAttr(s.twitter || "") + '" placeholder="https://x.com/…"></div>' +
      '<div class="hpx-savebar"><button class="hpx-btn hpx-btn-primary" onclick="ADM.saveContact()">Save Contact Info</button></div>';
  }
  function saveContact() {
    content.contact = { phone: $("#ct_phone").value, email: $("#ct_email").value, hours: $("#ct_hours").value, address: ($("#ct_address").value || "").replace(/\s*,\s*/g, "<br>") };
    content.social = { linkedin: $("#so_linkedin").value.trim(), instagram: $("#so_instagram").value.trim(), facebook: $("#so_facebook").value.trim(), twitter: $("#so_twitter").value.trim() };
    persist(); reloadPreview(); toast("Contact info saved");
  }

  /* ════════ BRANDING ════════ */
  function renderBrand(ed) {
    var b = content.brand || {}, logoSrc = b.logo || defaults.logoSrc;
    ed.innerHTML = '<h2>Branding</h2><div class="sub">Logo, colors, company name and the admin password.</div>' +
      '<div class="hpx-field"><label>Company name</label><input id="br_company" value="' + escAttr(b.company || (defaults.brand.company || "Horizon Physician Services LLC")) + '"></div>' +
      '<div class="hpx-field"><label>Brand colors</label><div class="hpx-swatch-row">' +
      '<div class="hpx-swatch"><input type="color" id="br_navy" value="' + (b.navy || "#0B1F4B") + '"><span>Primary</span></div>' +
      '<div class="hpx-swatch"><input type="color" id="br_teal" value="' + (b.teal || "#0E9A8C") + '"><span>Accent</span></div>' +
      '<button class="hpx-btn hpx-btn-ghost" onclick="ADM.resetColors()">Reset</button></div></div>' +
      '<div class="hpx-field"><label>Logo</label><div class="hpx-imgprev">' + (logoSrc ? '<img src="' + escAttr(logoSrc) + '">' : '<span class="hpx-note">No logo</span>') +
      '</div><input type="file" accept="image/*" onchange="ADM.uploadLogo(event)"></div>' +
      '<div class="group-h">Security</div>' +
      '<div class="hpx-field"><label>Change admin password</label><input type="password" id="br_pw" placeholder="New password (blank = keep current)"></div>' +
      '<div class="hpx-savebar"><button class="hpx-btn hpx-btn-primary" onclick="ADM.saveBrand()">Save Branding</button></div>';
  }
  function saveBrand() {
    content.brand = content.brand || {};
    content.brand.company = $("#br_company").value;
    content.brand.navy = $("#br_navy").value;
    content.brand.teal = $("#br_teal").value;
    var np = $("#br_pw"); if (np && np.value) content.password = np.value;
    persist(); reloadPreview(); toast("Branding saved");
  }
  function resetColors() { delete content.brand.navy; delete content.brand.teal; persist(); reloadPreview(); renderBrand($("#editor")); toast("Colors reset"); }
  function uploadLogo(ev) { var f = ev.target.files[0]; if (!f) return; var rd = new FileReader(); rd.onload = function () { content.brand = content.brand || {}; content.brand.logo = rd.result; persist(); reloadPreview(); renderBrand($("#editor")); toast("Logo updated"); }; rd.readAsDataURL(f); }

  /* ════════ LEADS ════════ */
  function renderLeads(ed) {
    var list = leads();
    var body = list.length ? list.map(function (l) {
      var dt = new Date(l.date);
      return '<div class="hpx-lead"><div class="lh"><span class="nm">' + esc(l.name || "—") + '</span><span class="dt">' + dt.toLocaleString() +
        '</span></div><div class="meta">' + esc(l.practice || "") + (l.interest ? " · " + esc(l.interest) : "") + '</div><div class="meta">' +
        esc(l.email || "") + (l.phone ? " · " + esc(l.phone) : "") + "</div>" + (l.message ? '<div class="msg">"' + esc(l.message) + '"</div>' : "") + "</div>";
    }).join("") : '<div class="empty">No consultation requests yet.</div>';
    ed.innerHTML = '<h2>Leads</h2><div class="sub">Consultation requests submitted through the site (stored in this browser).</div>' +
      '<div style="display:flex;gap:10px;margin-bottom:16px;"><button class="hpx-btn hpx-btn-ghost" onclick="ADM.exportLeads()">⬇ Export CSV</button>' +
      '<button class="hpx-btn hpx-btn-danger" onclick="ADM.clearLeads()">Clear All</button></div>' + body;
  }
  function exportLeads() {
    var list = leads(); if (!list.length) { toast("No leads"); return; }
    var cols = ["date", "name", "practice", "email", "phone", "interest", "message"];
    var csv = cols.join(",") + "\n" + list.map(function (l) { return cols.map(function (c) { return '"' + String(l[c] || "").replace(/"/g, '""') + '"'; }).join(","); }).join("\n");
    download(csv, "horizon-leads.csv", "text/csv");
  }
  function clearLeads() { if (!confirm("Delete all stored consultation requests?")) return; saveLS(C.LS_LEADS, []); renderLeads($("#editor")); buildSidebar(); toast("Leads cleared"); }

  /* ════════ PUBLISH ════════ */
  var GH_TOKEN = "hpx_gh_token", GH_REPO = "hpx_gh_repo", GH_BRANCH = "hpx_gh_branch";
  function ghToken() { return loadLS(GH_TOKEN) || ""; }
  function ghRepo() { return loadLS(GH_REPO) || "kaptaanahsan-boop/horizon"; }
  function ghBranch() { return loadLS(GH_BRANCH) || "main"; }
  function ghHeaders() { return { "Authorization": "Bearer " + ghToken(), "Accept": "application/vnd.github+json", "Content-Type": "application/json" }; }

  function renderPublish(ed) {
    var connected = !!ghToken();
    ed.innerHTML = '<h2>Publish</h2><div class="sub">Push your saved edits live to the website — one click.</div>' +
      '<div class="hpx-callout"><strong>One-click publish.</strong> Click the button and your changes go live on your site in about a minute. No terminal needed.</div>' +
      '<button class="hpx-btn hpx-btn-primary hpx-btn-block" style="margin-bottom:8px;padding:15px;font-size:15px;" onclick="ADM.publishLive()">🚀 Publish to Live Site</button>' +
      '<p class="hpx-note" style="margin-bottom:20px;">' + (connected ? "✓ Connected to GitHub — ready to publish." : "First time: you'll be asked to connect GitHub once (steps below).") + '</p>' +
      '<div class="group-h">GitHub connection</div>' +
      '<div class="hpx-field"><label>Repository (owner/name)</label><input id="gh_repo" value="' + escAttr(ghRepo()) + '"></div>' +
      '<div class="hpx-field"><label>Branch</label><input id="gh_branch" value="' + escAttr(ghBranch()) + '"></div>' +
      '<div class="hpx-field"><label>Access token ' + (connected ? "(saved — leave blank to keep)" : "") + '</label><input id="gh_token" type="password" placeholder="github_pat_…" autocomplete="off"></div>' +
      '<button class="hpx-btn hpx-btn-ghost" onclick="ADM.saveGh()">Save GitHub Settings</button>' +
      (connected ? ' <button class="hpx-btn hpx-btn-danger" onclick="ADM.clearGh()">Disconnect</button>' : "") +
      '<div class="group-h">Backup / manual</div>' +
      '<button class="hpx-btn hpx-btn-ghost hpx-btn-block" style="margin-bottom:8px;" onclick="ADM.copyContent()">📋 Copy JSON</button>' +
      '<button class="hpx-btn hpx-btn-ghost hpx-btn-block" style="margin-bottom:12px;" onclick="ADM.exportContent()">⬇ Download content.json</button>' +
      '<textarea id="pubJson" readonly rows="3" style="font-family:monospace;font-size:11px;" onclick="this.select()">' + esc(JSON.stringify(content)) + '</textarea>' +
      '<div class="hpx-field" style="margin-top:12px;"><label>Import a content file</label><input type="file" accept="application/json,.json" onchange="ADM.importContent(event)"></div>' +
      '<div class="group-h">Danger zone</div>' +
      '<button class="hpx-btn hpx-btn-danger hpx-btn-block" onclick="ADM.resetAll()">Reset all content to original</button>';
  }
  function saveGh() {
    var r = $("#gh_repo").value.trim(); if (r) saveLS(GH_REPO, r);
    var b = $("#gh_branch").value.trim(); if (b) saveLS(GH_BRANCH, b);
    var t = $("#gh_token").value.trim(); if (t) saveLS(GH_TOKEN, t);
    toast("GitHub settings saved"); renderPublish($("#editor"));
  }
  function clearGh() { localStorage.removeItem(GH_TOKEN); toast("Disconnected"); renderPublish($("#editor")); }
  function publishLive() {
    var token = ghToken();
    if (!token) {
      token = (prompt("Connect GitHub: paste your access token (stored only in this browser).") || "").trim();
      if (!token) return;
      saveLS(GH_TOKEN, token);
    }
    var repo = ghRepo(), branch = ghBranch(), api = "https://api.github.com/repos/" + repo + "/contents/content.json";
    var b64 = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))));
    toast("Publishing…");
    function getSha() {
      // cache-buster + no-store so we always get the CURRENT file version id
      return fetch(api + "?ref=" + encodeURIComponent(branch) + "&_=" + Date.now(), { headers: ghHeaders(), cache: "no-store" })
        .then(function (r) { if (r.status === 404) return undefined; if (!r.ok) return r.json().then(function (e) { throw e; }); return r.json().then(function (j) { return j.sha; }); });
    }
    function put(sha) {
      return fetch(api, { method: "PUT", headers: ghHeaders(), body: JSON.stringify({ message: "Publish content via admin", content: b64, sha: sha, branch: branch }) })
        .then(function (r) { return r.json().then(function (jj) { return { ok: r.ok, status: r.status, body: jj }; }); });
    }
    getSha()
      .then(function (sha) {
        return put(sha).then(function (res) {
          if (res.ok) return res;
          // sha conflict (file changed since we read it) — refetch latest sha and retry once
          if (res.status === 409 || res.status === 422 || /does not match|is at/i.test(JSON.stringify(res.body))) {
            return getSha().then(function (sha2) { return put(sha2).then(function (r2) { if (!r2.ok) throw r2.body; return r2; }); });
          }
          throw res.body;
        });
      })
      .then(function () { toast("✅ Published! Your site updates in about a minute."); })
      .catch(function (e) {
        var s = JSON.stringify(e || {}), msg = (e && e.message) || "Publish failed";
        if (/bad credentials|requires authentication|401/i.test(s)) { localStorage.removeItem(GH_TOKEN); msg = "Token invalid or expired — click Publish to re-enter it."; }
        else if (/not found/i.test(s)) { msg = "Repo not found — check the Repository field (owner/name) and token access."; }
        else if (/does not match|409|422/i.test(s)) { msg = "Sync conflict — please click Publish once more."; }
        toast("❌ " + msg); renderPublish($("#editor"));
      });
  }
  function copyContent() {
    var txt = JSON.stringify(content, null, 2);
    function ok() { toast("Copied to clipboard"); }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt).then(ok, fallback); }
    else fallback();
    function fallback() { var ta = $("#pubJson"); if (ta) { ta.select(); try { document.execCommand("copy"); ok(); } catch (e) { toast("Press Cmd+C to copy"); } } }
  }
  function download(data, name, type) { var blob = new Blob([data], { type: type || "application/json" }), a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000); }
  function exportContent() { download(JSON.stringify(content, null, 2), "content.json", "application/json"); toast("content.json exported"); }
  function importContent(ev) {
    var f = ev.target.files[0]; if (!f) return; var rd = new FileReader();
    rd.onload = function () { try { content = Object.assign({ text: {}, sections: {}, contact: {}, social: {}, brand: {}, password: null }, JSON.parse(rd.result)); persist(); reloadPreview(); buildSidebar(); go(current); toast("Content imported"); } catch (e) { toast("Invalid file"); } };
    rd.readAsText(f);
  }
  function resetAll() {
    if (!confirm("Reset ALL content back to the original site? Your edits will be removed.")) return;
    content = { text: {}, sections: {}, contact: {}, social: {}, brand: {}, password: content.password || null };
    persist(); reloadPreview(); buildSidebar(); go(current); toast("Content reset");
  }

  /* ════════ PREVIEW TOGGLE ════════ */
  function togglePreview() {
    previewOn = !previewOn;
    $("#preview").classList.toggle("hidden", !previewOn);
    $("#previewBtn").textContent = previewOn ? "Hide Preview" : "Show Preview";
  }

  window.ADM = {
    login: login, logout: logout, go: go, saveText: saveText,
    itemAdd: itemAdd, itemDel: itemDel, itemMove: itemMove, itemImg: itemImg, saveSection: saveSection,
    saveContact: saveContact, saveBrand: saveBrand, resetColors: resetColors, uploadLogo: uploadLogo,
    exportLeads: exportLeads, clearLeads: clearLeads, exportContent: exportContent, copyContent: copyContent, importContent: importContent, resetAll: resetAll,
    publishLive: publishLive, saveGh: saveGh, clearGh: clearGh,
    togglePreview: togglePreview, reloadPreview: reloadPreview
  };

  if (sessionStorage.getItem(SS) === "1") start();
})();
