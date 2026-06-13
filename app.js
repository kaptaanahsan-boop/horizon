/* ════════════════════════════════════════════════════════════════
   Horizon Physician Services — self-contained CMS engine
   Full add / remove / edit for every section + blog + contact.
   No server required. Edits live in the browser; Export content.json
   and publish to make them permanent for all visitors.
   ════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var LS_CONTENT = "hpx_content_v2";
  var LS_LEADS   = "hpx_leads_v1";
  var LS_SESSION = "hpx_admin_session";
  var DEFAULT_PW = "horizon2026";

  /* ─── small helpers ─── */
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function loadLS(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function saveLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function copy(o) { return JSON.parse(JSON.stringify(o)); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function escAttr(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
  function leads() { return loadLS(LS_LEADS) || []; }

  /* ─── icon library (for services) ─── */
  var ICONS = {
    "File / Billing": '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    "Code": '<svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    "Dollar / AR": '<svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    "Phone": '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6.07 6.07l.52-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    "X / Denial": '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>',
    "Shield": '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    "Collections": '<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    "Chart / RCM": '<svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    "Heart": '<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    "Check": '<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    "Clock": '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    "Users": '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
  };
  var LI_SVG = '<svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>';
  var QUOTE_SVG = '<svg viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>';
  var BLOG_FALLBACK = '<div class="blog-img-fallback"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>';

  /* ─── default blog posts (no static HTML; rendered from here) ─── */
  var BLOG_DEFAULTS = [
    { title: "5 Root Causes of Claim Denials (and How to Stop Them)", tag: "Denial Management", date: "June 2, 2026", author: "Horizon Team", image: "",
      excerpt: "Most denials trace back to a handful of preventable errors. Here's how to fix them upstream before they cost you revenue.",
      body: "Claim denials quietly erode practice revenue, and the frustrating part is that most of them are preventable. After reviewing thousands of denied claims, we consistently see the same root causes.\n\nEligibility and benefits not verified. Submitting a claim without confirming active coverage is the single most common denial driver. A 30-second verification at check-in prevents it.\n\nCoding errors and mismatches. Incorrect, outdated, or mismatched ICD-10 and CPT codes trigger automatic rejections. Certified coders and real-time scrubbing catch these before submission.\n\nMissing or late authorizations. Many payers require prior authorization for specific services. Track requirements by payer and obtain authorizations before the encounter.\n\nTimely filing limits. Claims that age past the payer's filing window are denied outright with no appeal. Systematic follow-up keeps every claim moving.\n\nIncomplete documentation. Claims must be supported by clear clinical documentation. Aligning documentation with billed services protects both revenue and compliance.\n\nFix these five at the source and most practices see their denial rate drop sharply within the first two months." },
    { title: "Understanding Days in AR: The Metric That Predicts Cash Flow", tag: "AR Management", date: "May 21, 2026", author: "Horizon Team", image: "",
      excerpt: "Days in accounts receivable is the clearest early warning sign of revenue cycle trouble. Here's how to read and improve it.",
      body: "Days in AR measures the average time it takes to collect payment after a service is rendered. It is one of the most revealing indicators of revenue cycle health.\n\nA healthy benchmark for most practices is under 40 days. When that number climbs, it signals that claims are sitting unpaid longer than they should, which directly tightens cash flow.\n\nTo improve days in AR, work aging buckets proactively, prioritize high-value and near-timely-filing claims, and resolve denials quickly rather than letting them pile up. Transparent monthly reporting keeps the metric visible so problems are caught early.\n\nThe practices with the healthiest finances treat days in AR as a number to watch every single month, not a figure they discover at year end." },
    { title: "Personal Injury Billing: What Makes It Different", tag: "PI Billing", date: "May 8, 2026", author: "Horizon Team", image: "",
      excerpt: "Liens, letters of protection, attorney coordination — personal injury billing is a specialty of its own. Here's what to know.",
      body: "Personal injury and workers' compensation billing operate on a different set of rules than standard insurance billing, and treating them the same way leaves money on the table.\n\nLien management. PI cases often involve medical liens that must be tracked and protected through settlement. Missing a lien can mean never getting paid.\n\nLetters of protection. These agreements tie payment to case resolution, which requires careful documentation and follow-through over months or even years.\n\nAttorney coordination. Successful PI billing depends on consistent communication with attorneys, accurate records, and timely responses to case requests.\n\nBecause PI billing is so nuanced, it rewards specialized expertise. Practices that handle PI cases with a dedicated, trained process recover significantly more of what they are owed." }
  ];

  /* ════════ STATE ════════ */
  var content = blankContent();
  var defaults = {};      // scraped-from-DOM defaults per section
  var originals = {};     // inline-edit originals (index -> innerHTML)
  var editNodes = [];     // inline-editable nodes
  var work = {};          // working copies during admin editing
  var editing = false;

  function blankContent() {
    return { text: {}, brand: {}, contact: {}, social: {}, sections: {}, password: null };
  }
  function getPw() { return content.password || DEFAULT_PW; }
  function persist() { saveLS(LS_CONTENT, content); }
  function effective(sec) { return content.sections[sec] ? copy(content.sections[sec]) : copy(defaults[sec] || []); }

  /* ════════ SCRAPE DEFAULTS FROM STATIC DOM ════════ */
  function txt(el) { return el ? el.textContent.trim() : ""; }
  function scrapeDefaults() {
    defaults.stats = $all("#statsGrid .stat-card").map(function (c) {
      var span = $(".num span", c), num = $(".num", c);
      var suffix = num ? num.textContent.replace(span ? span.textContent : "", "").trim() : "";
      return { value: span ? span.textContent.trim() : "", suffix: suffix, label: txt($(".lbl", c)), sublabel: txt($(".sublbl", c)) };
    });
    defaults.services = $all("#servicesGrid .service-card").map(function (c) {
      return { icon: ($(".service-icon", c) || {}).innerHTML || "", title: txt($("h3", c)), desc: txt($("p", c)) };
    });
    defaults.why = $all("#whyGrid .why-card").map(function (c) {
      return { num: txt($(".why-num", c)), title: txt($("h3", c)), desc: txt($("p", c)) };
    });
    defaults.process = $all("#processSteps .step").map(function (c) {
      return { emoji: txt($(".step-icon", c)), badge: txt($(".step-num-badge", c)), title: txt($(".step-title", c)), desc: txt($(".step-desc", c)) };
    });
    defaults.team = $all("#teamGrid .team-card").map(function (c) {
      var img = $("img", c), li = $(".team-linkedin", c);
      return { photo: img ? img.getAttribute("src") : "", badge: txt($(".team-photo-badge", c)), name: txt($(".team-name", c)),
               title: txt($(".team-title", c)), bio: txt($(".team-bio", c)), linkedin: li ? (li.getAttribute("href") || "") : "" };
    });
    defaults.testimonials = $all("#testiGrid .testi-card").map(function (c) {
      var t = txt($(".testi-text", c)).replace(/^["“]|["”]$/g, "");
      return { rating: 5, text: t, name: txt($(".testi-name", c)), spec: txt($(".testi-spec", c)), avatar: txt($(".testi-avatar", c)) };
    });
    defaults.faq = $all("#faqWrap .faq-item").map(function (c) {
      return { q: txt($(".faq-q span", c)), a: txt($(".faq-a-inner", c)) };
    });
    defaults.blog = copy(BLOG_DEFAULTS);

    defaults.contact = {
      phone: txt($('[data-c="phone"]')) || "+1 (800) 000-0000",
      email: txt($('[data-c="email"]')) || "info@horizonphysicianservices.com",
      hours: txt($('[data-c="hours"]')) || "Mon – Fri, 8 AM – 6 PM EST",
      address: ($('[data-c="address"]') ? $('[data-c="address"]').innerHTML : "") || "[City, State, ZIP]<br>United States"
    };
    defaults.social = { linkedin: "", facebook: "", twitter: "" };
    var logo = $(".nav-logo img");
    defaults.brand = { navy: "#0B1F4B", teal: "#0E9A8C", logo: "", company: "Horizon Physician Services LLC" };
    defaults._logoSrc = logo ? logo.getAttribute("src") : "logo.png";
  }

  /* ════════ LIVE RENDER (data -> page) ════════ */
  function stars(r) { var h = ""; for (var s = 1; s <= 5; s++) h += '<span class="star" style="opacity:' + (s <= r ? 1 : .25) + '">★</span>'; return h; }

  function renderStats(arr) {
    var g = $("#statsGrid"); if (!g) return;
    g.innerHTML = arr.map(function (s) {
      return '<div class="stat-card"><div class="num"><span>' + esc(s.value) + '</span>' + esc(s.suffix) +
        '</div><div class="lbl">' + esc(s.label) + '</div><div class="sublbl">' + esc(s.sublabel) + '</div></div>';
    }).join("");
  }
  function renderServices(arr) {
    var g = $("#servicesGrid"); if (!g) return;
    g.innerHTML = arr.map(function (s) {
      return '<div class="service-card"><div class="service-icon">' + (s.icon || "") + '</div><h3>' + esc(s.title) +
        '</h3><p>' + esc(s.desc) + '</p><a class="link-btn" href="#">Learn More</a></div>';
    }).join("");
  }
  function renderWhy(arr) {
    var g = $("#whyGrid"); if (!g) return;
    g.innerHTML = arr.map(function (s) {
      return '<div class="why-card"><div class="why-num">' + esc(s.num) + '</div><h3>' + esc(s.title) + '</h3><p>' + esc(s.desc) + '</p></div>';
    }).join("");
  }
  function renderProcess(arr) {
    var g = $("#processSteps"); if (!g) return;
    g.innerHTML = arr.map(function (s, i) {
      return '<div class="step go" id="pstep' + i + '"><div class="step-ring-wrap"><div class="step-circle">' + (i + 1) +
        '</div></div><div class="step-body"><div class="step-icon">' + esc(s.emoji) + '</div><div class="step-num-badge">' + esc(s.badge) +
        '</div><div class="step-title">' + esc(s.title) + '</div><p class="step-desc">' + esc(s.desc) + '</p></div></div>';
    }).join("");
    var tr = $("#processTrack"); if (tr) tr.classList.add("go");
  }
  function renderTeam(arr) {
    var g = $("#teamGrid"); if (!g) return;
    g.innerHTML = arr.map(function (s) {
      var li = s.linkedin && s.linkedin !== "#"
        ? '<a class="team-linkedin" href="' + escAttr(s.linkedin) + '" target="_blank" rel="noopener">' + LI_SVG + ' Connect on LinkedIn</a>' : "";
      return '<div class="team-card"><div class="team-photo-wrap"><div class="team-photo-badge">' + esc(s.badge) +
        '</div><img src="' + escAttr(s.photo) + '" alt="' + escAttr(s.name) + '"></div><div class="team-card-body"><div class="team-name">' +
        esc(s.name) + '</div><div class="team-title">' + esc(s.title) + '</div><p class="team-bio">' + esc(s.bio) + '</p>' + li + '</div></div>';
    }).join("");
  }
  function renderTesti(arr) {
    var g = $("#testiGrid"); if (!g) return;
    g.innerHTML = arr.map(function (s) {
      return '<div class="testi-card"><div class="testi-quote-icon">' + QUOTE_SVG + '</div><div class="stars">' + stars(+s.rating || 5) +
        '</div><p class="testi-text">"' + esc(s.text) + '"</p><div class="testi-author"><div class="testi-avatar">' + esc(s.avatar) +
        '</div><div><div class="testi-name">' + esc(s.name) + '</div><div class="testi-spec">' + esc(s.spec) + '</div></div></div></div>';
    }).join("");
  }
  function renderFaq(arr) {
    var g = $("#faqWrap"); if (!g) return;
    g.innerHTML = arr.map(function (s, i) {
      return '<div class="faq-item' + (i === 0 ? " open" : "") + '"><button class="faq-q" onclick="toggleFaq(this)"><span>' +
        esc(s.q) + '</span><div class="faq-icon">+</div></button><div class="faq-a"' + (i === 0 ? ' style="max-height:600px;"' : "") +
        '><div class="faq-a-inner">' + esc(s.a) + '</div></div></div>';
    }).join("");
  }
  function renderBlog(arr) {
    var g = $("#blogGrid"); if (!g) return;
    g.innerHTML = arr.map(function (p, i) {
      var img = p.image ? '<img class="blog-img" src="' + escAttr(p.image) + '" alt="' + escAttr(p.title) + '">' : BLOG_FALLBACK;
      return '<div class="blog-card">' + img + '<div class="blog-body"><span class="blog-tag">' + esc(p.tag || "Article") +
        '</span><h3>' + esc(p.title) + '</h3><p class="blog-excerpt">' + esc(p.excerpt) + '</p><div class="blog-meta"><span>' +
        esc(p.date) + '</span><span class="dot"></span><span>' + esc(p.author) + '</span></div>' +
        '<button class="blog-readmore" onclick="HPX.openReader(' + i + ')">Read article →</button></div></div>';
    }).join("");
  }
  var RENDERERS = { stats: renderStats, services: renderServices, why: renderWhy, process: renderProcess,
                    team: renderTeam, testimonials: renderTesti, faq: renderFaq, blog: renderBlog };
  function renderLive(sec) { if (RENDERERS[sec]) RENDERERS[sec](effective(sec)); }

  /* ════════ CONTACT / BRAND BINDING ════════ */
  function contactVal(k) { return (content.contact && content.contact[k] != null) ? content.contact[k] : (defaults.contact ? defaults.contact[k] : ""); }
  function socialVal(k) { return (content.social && content.social[k] != null) ? content.social[k] : ""; }
  function bindContact() {
    $all('[data-c="phone"]').forEach(function (e) { e.textContent = contactVal("phone"); });
    $all('[data-c="email"]').forEach(function (e) { e.textContent = contactVal("email"); });
    $all('[data-c="hours"]').forEach(function (e) { e.textContent = contactVal("hours"); });
    $all('[data-c="address"]').forEach(function (e) { e.innerHTML = contactVal("address"); });
    var mail = $("[data-cta-mail]"); if (mail) mail.setAttribute("href", "mailto:" + contactVal("email"));
    var tel = $("[data-cta-tel]"); if (tel) tel.setAttribute("href", "tel:" + contactVal("phone").replace(/[^\d+]/g, ""));
    [["linkedin"], ["facebook"], ["twitter"]].forEach(function (a) {
      var k = a[0], el = $('[data-s="' + k + '"]'); if (el) el.setAttribute("href", socialVal(k) || "#");
    });
  }
  function shade(hex, pct) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    var f = pct < 0 ? 0 : 255, t = Math.abs(pct);
    r = Math.round((f - r) * t + r); g = Math.round((f - g) * t + g); b = Math.round((f - b) * t + b);
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }
  function applyBrand() {
    var b = content.brand || {}, root = document.documentElement.style;
    if (b.navy) {
      root.setProperty("--navy", b.navy); root.setProperty("--navy-dark", shade(b.navy, -0.35));
      root.setProperty("--navy-mid", shade(b.navy, 0.18)); root.setProperty("--text-dark", shade(b.navy, -0.15));
    }
    if (b.teal) {
      root.setProperty("--teal", b.teal); root.setProperty("--teal-dark", shade(b.teal, -0.25));
      root.setProperty("--teal-light", shade(b.teal, 0.18)); root.setProperty("--teal-pale", shade(b.teal, 0.88));
    }
    if (b.logo) $all(".nav-logo img").forEach(function (img) { img.src = b.logo; });
    if (b.company) $all(".nav-logo img").forEach(function (img) { img.alt = b.company; });
  }

  /* ════════ APPLY EVERYTHING ════════ */
  function applyAll() {
    applyText();
    ["stats", "services", "why", "process", "team", "testimonials", "faq"].forEach(function (sec) {
      if (content.sections[sec]) renderLive(sec);
    });
    renderBlog(effective("blog"));   // blog always rendered
    bindContact();
    applyBrand();
  }

  /* ════════ INLINE TEXT EDITING ════════ */
  var SEL = [
    "#hero .hero-badge", "#hero .hero-headline", "#hero .hero-sub", "#hero .hero-ctas .btn", "#hero .trust-item",
    "#services .section-header .label", "#services .section-header h2", "#services .section-header .text-lead",
    "#about .label", "#about .about-content h2", "#about .about-lead", "#about .about-content > p",
    "#about .mvv-card h4", "#about .mvv-card p", "#about .about-badge .n", "#about .about-badge .l", "#about .about-img-inner p",
    "#why .section-header .label", "#why .section-header h2", "#why .section-header .text-lead",
    "#process .section-header .label", "#process .section-header h2", "#process .section-header .text-lead",
    "#leadership .section-header .label", "#leadership .section-header h2", "#leadership .section-header .text-lead",
    "#testimonials .section-header .label", "#testimonials .section-header h2", "#testimonials .section-header .text-lead",
    "#blog .section-header .label", "#blog .section-header h2", "#blog .section-header .text-lead",
    "#faq .section-header .label", "#faq .section-header h2", "#faq .section-header .text-lead",
    "#final-cta .label", "#final-cta h2", "#final-cta .text-lead",
    "#footer .footer-brand p", "#footer .footer-col h4"
  ].join(",");

  function indexNodes() {
    editNodes = $all(SEL);
    editNodes.forEach(function (n, i) { n.setAttribute("data-hpx-edit", i); if (!(i in originals)) originals[i] = n.innerHTML; });
  }
  function applyText() { Object.keys(content.text || {}).forEach(function (i) { if (editNodes[i]) editNodes[i].innerHTML = content.text[i]; }); }
  function setEditable(on) {
    editNodes.forEach(function (n) {
      if (on) { n.setAttribute("contenteditable", "true"); n.addEventListener("blur", onEditBlur); n.addEventListener("keydown", onEditKey); }
      else { n.removeAttribute("contenteditable"); n.removeEventListener("blur", onEditBlur); n.removeEventListener("keydown", onEditKey); }
    });
  }
  function onEditKey(e) { if (e.key === "Escape") e.target.blur(); }
  function onEditBlur(e) { content.text[e.target.getAttribute("data-hpx-edit")] = e.target.innerHTML; persist(); }
  function toggleEdit() {
    editing = !editing;
    document.body.classList.toggle("hpx-editing", editing);
    $("#hpxEditBar").classList.toggle("show", editing);
    $("#hpxFab").classList.toggle("show", !editing && isAuthed());
    var b = $("#hpxEditToggle"); if (b) b.textContent = editing ? "✔ Stop Editing" : "✏️ Start Editing the Page";
    setEditable(editing);
    if (editing) { closeOverlay("hpxAdmin"); toast("Editing on — click any text to change it"); }
    else { persist(); toast("Saved in this browser"); }
  }

  /* ════════ OVERLAYS / TOAST ════════ */
  function toast(m) { var t = $("#hpxToast"); t.textContent = m; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 2400); }
  function openOverlay(id) { $("#" + id).classList.add("open"); document.body.style.overflow = "hidden"; }
  function closeOverlay(id) { $("#" + id).classList.remove("open"); if (!$(".hpx-modal-overlay.open")) document.body.style.overflow = ""; }

  /* ════════ AUTH ════════ */
  function isAuthed() { return sessionStorage.getItem(LS_SESSION) === "1"; }
  function openAdmin() {
    if (!isAuthed()) { openOverlay("hpxLogin"); setTimeout(function () { var p = $("#hpxLoginPw"); if (p) p.focus(); }, 50); return; }
    showPane("pages"); renderLeads(); openOverlay("hpxAdmin");
  }
  function login(e) {
    e.preventDefault();
    if ($("#hpxLoginPw").value === getPw()) {
      sessionStorage.setItem(LS_SESSION, "1"); $("#hpxLoginErr").style.display = "none"; $("#hpxLoginPw").value = "";
      closeOverlay("hpxLogin"); $("#hpxFab").classList.add("show"); openAdmin();
    } else { $("#hpxLoginErr").style.display = "block"; }
    return false;
  }
  function logout() { sessionStorage.removeItem(LS_SESSION); if (editing) toggleEdit(); closeOverlay("hpxAdmin"); $("#hpxFab").classList.remove("show"); toast("Logged out"); }

  /* ════════ ADMIN EDITOR PANES ════════ */
  // field schema per section
  var SCHEMA = {
    stats:        { title: "Stat", fields: [ ["value", "Value (e.g. 10, 1M, 95)", "text"], ["suffix", "Suffix (+, %)", "text"], ["label", "Label", "text"], ["sublabel", "Sub-label", "text"] ],
                    blank: { value: "0", suffix: "+", label: "New stat", sublabel: "" } },
    services:     { title: "Service", fields: [ ["icon", "Icon", "icon"], ["title", "Title", "text"], ["desc", "Description", "textarea"] ],
                    blank: { icon: ICONS["Check"], title: "New Service", desc: "Describe this service." } },
    why:          { title: "Reason", fields: [ ["num", "Number badge", "text"], ["title", "Title", "text"], ["desc", "Description", "textarea"] ],
                    blank: { num: "00", title: "New reason", desc: "Why this matters." } },
    process:      { title: "Step", fields: [ ["emoji", "Emoji/Icon", "text"], ["badge", "Badge (e.g. Step 01)", "text"], ["title", "Title", "text"], ["desc", "Description", "textarea"] ],
                    blank: { emoji: "✅", badge: "Step", title: "New step", desc: "What happens here." } },
    team:         { title: "Member", fields: [ ["photo", "Photo", "image"], ["name", "Name", "text"], ["title", "Title", "text"], ["badge", "Badge (e.g. CEO)", "text"], ["bio", "Biography", "textarea"], ["linkedin", "LinkedIn URL", "text"] ],
                    blank: { photo: "", name: "New Member", title: "Title", badge: "Team", bio: "Short biography.", linkedin: "" } },
    testimonials: { title: "Review", fields: [ ["rating", "Star rating", "rating"], ["text", "Testimonial", "textarea"], ["name", "Client name", "text"], ["spec", "Specialty / location", "text"], ["avatar", "Avatar initials", "text"] ],
                    blank: { rating: 5, text: "Their experience…", name: "Client name", spec: "Specialty · State", avatar: "AB" } },
    faq:          { title: "Question", fields: [ ["q", "Question", "text"], ["a", "Answer", "textarea"] ],
                    blank: { q: "New question?", a: "The answer." } },
    blog:         { title: "Post", fields: [ ["image", "Cover image", "image"], ["title", "Title", "text"], ["tag", "Category tag", "text"], ["date", "Date", "text"], ["author", "Author", "text"], ["excerpt", "Excerpt (card preview)", "textarea"], ["body", "Full article", "bigtext"] ],
                    blank: { image: "", title: "New Post", tag: "Article", date: "", author: "Horizon Team", excerpt: "Short summary.", body: "Write your article here.\n\nUse blank lines between paragraphs." } }
  };
  var PANE_ID = { stats: "hpxPaneStats", services: "hpxPaneServices", why: "hpxPaneWhy", process: "hpxPaneProcess",
                  team: "hpxPaneTeam", testimonials: "hpxPaneReviews", faq: "hpxPaneFaq", blog: "hpxPaneBlog" };

  function fieldInput(sec, i, f) {
    var key = f[0], label = f[1], type = f[2], val = work[sec][i][key];
    var idf = 'data-f="' + i + ':' + key + '"';
    var h = '<div class="hpx-field"><label>' + esc(label) + '</label>';
    if (type === "textarea") h += '<textarea ' + idf + ' rows="3">' + esc(val) + '</textarea>';
    else if (type === "bigtext") h += '<textarea ' + idf + ' rows="8">' + esc(val) + '</textarea>';
    else if (type === "rating") {
      h += '<select ' + idf + '>';
      for (var r = 5; r >= 1; r--) h += '<option value="' + r + '"' + ((+val || 5) === r ? " selected" : "") + '>' + r + " ★</option>";
      h += '</select>';
    } else if (type === "icon") {
      h += '<select ' + idf + '><option value="__keep__">— current icon —</option>';
      Object.keys(ICONS).forEach(function (n) { h += '<option value="' + esc(n) + '">' + esc(n) + '</option>'; });
      h += '</select>';
    } else if (type === "image") {
      var prev = val ? '<img class="hpx-thumb" src="' + escAttr(val) + '">' : '<span class="hpx-note">No image</span>';
      h += '<div style="display:flex;align-items:center;gap:10px;">' + prev +
        '<input type="file" accept="image/*" onchange="HPX.itemImg(\'' + sec + '\',' + i + ',\'' + key + '\',event)">' +
        (val ? '<button class="hpx-icobtn del" title="Remove image" onclick="HPX.itemImg(\'' + sec + '\',' + i + ',\'' + key + '\',null)">🗑</button>' : "") + '</div>';
    } else h += '<input type="text" ' + idf + ' value="' + escAttr(val) + '">';
    return h + '</div>';
  }
  function renderEditor(sec) {
    var pane = $("#" + PANE_ID[sec]); if (!pane) return;
    var sch = SCHEMA[sec], arr = work[sec];
    var html = '<div class="hpx-callout">Add, remove, reorder, or edit each ' + esc(sch.title.toLowerCase()) +
      '. Click <strong>Save</strong> at the bottom to apply changes to the live page.</div>';
    arr.forEach(function (item, i) {
      html += '<div class="hpx-item"><div class="hpx-item-head"><span class="t">' + esc(sch.title) + ' ' + (i + 1) + '</span>' +
        '<span class="hpx-item-tools">' +
        '<button class="hpx-icobtn" title="Move up" onclick="HPX.itemMove(\'' + sec + '\',' + i + ',-1)">↑</button>' +
        '<button class="hpx-icobtn" title="Move down" onclick="HPX.itemMove(\'' + sec + '\',' + i + ',1)">↓</button>' +
        '<button class="hpx-icobtn del" title="Delete" onclick="HPX.itemDel(\'' + sec + '\',' + i + ')">🗑</button>' +
        '</span></div>';
      sch.fields.forEach(function (f) { html += fieldInput(sec, i, f); });
      html += '</div>';
    });
    html += '<button class="hpx-additem" onclick="HPX.itemAdd(\'' + sec + '\')">＋ Add ' + esc(sch.title) + '</button>';
    html += '<div class="hpx-savebar"><button class="hpx-btn hpx-btn-primary" onclick="HPX.saveSection(\'' + sec + '\')">Save ' +
      esc(sch.title) + 's</button><span class="sv">' + arr.length + ' item' + (arr.length === 1 ? "" : "s") + '</span></div>';
    pane.innerHTML = html;
  }
  function syncEditor(sec) {
    var pane = $("#" + PANE_ID[sec]); if (!pane) return;
    $all("[data-f]", pane).forEach(function (el) {
      var p = el.getAttribute("data-f").split(":"), i = +p[0], key = p[1];
      if (el.value === "__keep__") return;                       // icon: keep current
      if (key === "icon") { work[sec][i].icon = ICONS[el.value] || work[sec][i].icon; return; }
      if (work[sec][i]) work[sec][i][key] = el.value;
    });
  }
  function buildEditor(sec) { work[sec] = effective(sec); renderEditor(sec); }

  function itemAdd(sec) { syncEditor(sec); work[sec].push(copy(SCHEMA[sec].blank)); renderEditor(sec); }
  function itemDel(sec, i) { syncEditor(sec); if (!confirm("Delete this item?")) return; work[sec].splice(i, 1); renderEditor(sec); }
  function itemMove(sec, i, d) {
    syncEditor(sec); var j = i + d; if (j < 0 || j >= work[sec].length) return;
    var t = work[sec][i]; work[sec][i] = work[sec][j]; work[sec][j] = t; renderEditor(sec);
  }
  function itemImg(sec, i, key, ev) {
    syncEditor(sec);
    if (ev == null) { work[sec][i][key] = ""; renderEditor(sec); return; }
    var f = ev.target.files[0]; if (!f) return;
    var rd = new FileReader(); rd.onload = function () { work[sec][i][key] = rd.result; renderEditor(sec); }; rd.readAsDataURL(f);
  }
  function saveSection(sec) {
    syncEditor(sec); content.sections[sec] = copy(work[sec]); persist(); renderLive(sec);
    toast(SCHEMA[sec].title + "s saved");
  }

  /* ── contact & brand editors ── */
  function buildContact() {
    var pane = $("#hpxPaneContact"); if (!pane) return;
    var c = content.contact || {}, s = content.social || {};
    function v(o, k, sec) { return (o && o[k] != null) ? o[k] : (defaults[sec] ? defaults[sec][k] : ""); }
    pane.innerHTML =
      '<div class="hpx-callout">These details appear in the call-to-action band and the footer across the whole site.</div>' +
      '<div class="hpx-field"><label>Phone</label><input id="ct_phone" value="' + escAttr(v(c, "phone", "contact")) + '"></div>' +
      '<div class="hpx-field"><label>Email</label><input id="ct_email" value="' + escAttr(v(c, "email", "contact")) + '"></div>' +
      '<div class="hpx-field"><label>Address (use a comma; line breaks added automatically)</label><input id="ct_address" value="' + escAttr((v(c, "address", "contact") || "").replace(/<br\s*\/?>/gi, ", ")) + '"></div>' +
      '<div class="hpx-field"><label>Office hours</label><input id="ct_hours" value="' + escAttr(v(c, "hours", "contact")) + '"></div>' +
      '<hr style="border:none;border-top:1px solid var(--gray-100);margin:18px 0;">' +
      '<div class="hpx-field"><label>LinkedIn URL</label><input id="so_linkedin" value="' + escAttr(s.linkedin || "") + '" placeholder="https://linkedin.com/company/…"></div>' +
      '<div class="hpx-field"><label>Facebook URL</label><input id="so_facebook" value="' + escAttr(s.facebook || "") + '" placeholder="https://facebook.com/…"></div>' +
      '<div class="hpx-field"><label>X / Twitter URL</label><input id="so_twitter" value="' + escAttr(s.twitter || "") + '" placeholder="https://x.com/…"></div>' +
      '<div class="hpx-savebar"><button class="hpx-btn hpx-btn-primary" onclick="HPX.saveContact()">Save Contact Info</button></div>';
  }
  function saveContact() {
    content.contact = {
      phone: $("#ct_phone").value, email: $("#ct_email").value, hours: $("#ct_hours").value,
      address: ($("#ct_address").value || "").replace(/\s*,\s*/g, "<br>")
    };
    content.social = { linkedin: $("#so_linkedin").value.trim(), facebook: $("#so_facebook").value.trim(), twitter: $("#so_twitter").value.trim() };
    persist(); bindContact(); toast("Contact info saved");
  }
  function buildBrand() {
    var pane = $("#hpxPaneBrand"); if (!pane) return;
    var b = content.brand || {};
    var logoSrc = b.logo || defaults._logoSrc;
    pane.innerHTML =
      '<div class="hpx-callout">Brand colors and logo apply across the entire site instantly.</div>' +
      '<div class="hpx-field"><label>Company name</label><input id="br_company" value="' + escAttr(b.company || defaults.brand.company) + '"></div>' +
      '<div class="hpx-field"><label>Brand colors</label><div class="hpx-swatch-row">' +
      '<div class="hpx-swatch"><input type="color" id="br_navy" value="' + (b.navy || "#0B1F4B") + '"><span>Primary</span></div>' +
      '<div class="hpx-swatch"><input type="color" id="br_teal" value="' + (b.teal || "#0E9A8C") + '"><span>Accent</span></div>' +
      '<button class="hpx-btn hpx-btn-ghost" style="padding:8px 14px;" onclick="HPX.resetColors()">Reset</button></div></div>' +
      '<div class="hpx-field"><label>Logo</label><div class="hpx-imgprev">' + (logoSrc ? '<img src="' + escAttr(logoSrc) + '">' : '<span class="hpx-note">No logo</span>') +
      '</div><input type="file" accept="image/*" onchange="HPX.uploadLogo(event)"></div>' +
      '<hr style="border:none;border-top:1px solid var(--gray-100);margin:18px 0;">' +
      '<div class="hpx-field"><label>Change admin password</label><input type="password" id="br_pw" placeholder="New password (blank = keep current)"></div>' +
      '<div class="hpx-savebar"><button class="hpx-btn hpx-btn-primary" onclick="HPX.saveBrand()">Save Branding</button></div>';
  }
  function saveBrand() {
    content.brand = content.brand || {};
    content.brand.company = $("#br_company").value;
    content.brand.navy = $("#br_navy").value;
    content.brand.teal = $("#br_teal").value;
    var np = $("#br_pw"); if (np && np.value) content.password = np.value;
    persist(); applyBrand(); toast("Branding saved");
  }
  function resetColors() {
    if (content.brand) { delete content.brand.navy; delete content.brand.teal; }
    var root = document.documentElement.style;
    ["--navy", "--navy-dark", "--navy-mid", "--text-dark", "--teal", "--teal-dark", "--teal-light", "--teal-pale"].forEach(function (v) { root.removeProperty(v); });
    persist(); buildBrand(); toast("Colors reset");
  }
  function uploadLogo(ev) {
    var f = ev.target.files[0]; if (!f) return;
    var rd = new FileReader(); rd.onload = function () { content.brand = content.brand || {}; content.brand.logo = rd.result; persist(); applyBrand(); buildBrand(); toast("Logo updated"); };
    rd.readAsDataURL(f);
  }

  /* ════════ PANE SWITCHING ════════ */
  function showPane(pane) {
    $all(".hpx-tab").forEach(function (t) { t.classList.toggle("active", t.getAttribute("data-pane") === pane); });
    $all(".hpx-pane").forEach(function (p) { p.classList.toggle("active", p.getAttribute("data-pane") === pane); });
    var sec = (pane === "reviews") ? "testimonials" : pane;
    if (SCHEMA[sec]) buildEditor(sec);
    else if (pane === "contact") buildContact();
    else if (pane === "brand") buildBrand();
    else if (pane === "leads") renderLeads();
  }

  /* ════════ BLOG READER ════════ */
  function openReader(i) {
    var p = effective("blog")[i]; if (!p) return;
    $("#hpxReaderTitle").textContent = p.title;
    $("#hpxReaderMeta").textContent = [p.tag, p.date, p.author].filter(Boolean).join("  ·  ");
    var img = $("#hpxReaderImg");
    if (p.image) { img.src = p.image; img.style.display = ""; } else { img.style.display = "none"; }
    $("#hpxReaderBody").innerHTML = String(p.body || "").split(/\n\n+/).map(function (para) {
      return "<p>" + esc(para.trim()).replace(/\n/g, "<br>") + "</p>";
    }).join("");
    openOverlay("hpxReader");
  }

  /* ════════ LEADS ════════ */
  function submitLead(e) {
    e.preventDefault(); var f = e.target, d = {};
    ["name", "practice", "email", "phone", "interest", "message"].forEach(function (k) { d[k] = (f.elements[k] ? f.elements[k].value : "").trim(); });
    d.date = new Date().toISOString();
    var list = leads(); list.unshift(d); saveLS(LS_LEADS, list);
    f.reset(); f.style.display = "none"; $("#hpxConsultSuccess").style.display = "block"; return false;
  }
  function renderLeads() {
    var w = $("#hpxLeadsWrap"); if (!w) return; var list = leads();
    if (!list.length) { w.innerHTML = '<div class="hpx-leads-empty">No consultation requests yet.</div>'; return; }
    w.innerHTML = list.map(function (l) {
      var dt = new Date(l.date);
      return '<div class="hpx-lead"><div class="lh"><span class="nm">' + esc(l.name || "—") + '</span><span class="dt">' + dt.toLocaleString() +
        '</span></div><div class="meta">' + esc(l.practice || "") + (l.interest ? " · " + esc(l.interest) : "") + '</div><div class="meta">' +
        esc(l.email || "") + (l.phone ? " · " + esc(l.phone) : "") + '</div>' + (l.message ? '<div class="msg">"' + esc(l.message) + '"</div>' : "") + '</div>';
    }).join("");
  }
  function exportLeads() {
    var list = leads(); if (!list.length) { toast("No leads to export"); return; }
    var cols = ["date", "name", "practice", "email", "phone", "interest", "message"];
    var csv = cols.join(",") + "\n" + list.map(function (l) { return cols.map(function (c) { return '"' + String(l[c] || "").replace(/"/g, '""') + '"'; }).join(","); }).join("\n");
    download(csv, "horizon-leads.csv", "text/csv");
  }
  function clearLeads() { if (!confirm("Delete all stored consultation requests?")) return; saveLS(LS_LEADS, []); renderLeads(); toast("Leads cleared"); }

  /* ════════ EXPORT / IMPORT / RESET ════════ */
  function download(data, name, type) {
    var blob = new Blob([data], { type: type || "application/json" }), a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function exportContent() { download(JSON.stringify(content, null, 2), "content.json", "application/json"); toast("Content exported"); }
  function importContent(ev) {
    var f = ev.target.files[0]; if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      try { content = Object.assign(blankContent(), JSON.parse(rd.result)); persist(); applyAll(); toast("Content imported"); }
      catch (e) { toast("Invalid content file"); }
    };
    rd.readAsText(f);
  }
  function resetAll() {
    if (!confirm("Reset ALL content back to the original site? Your edits in this browser will be removed.")) return;
    Object.keys(originals).forEach(function (i) { if (editNodes[i]) editNodes[i].innerHTML = originals[i]; });
    content = blankContent(); localStorage.removeItem(LS_CONTENT);
    var root = document.documentElement.style;
    ["--navy", "--navy-dark", "--navy-mid", "--text-dark", "--teal", "--teal-dark", "--teal-light", "--teal-pale"].forEach(function (v) { root.removeProperty(v); });
    ["stats", "services", "why", "process", "team", "testimonials", "faq"].forEach(renderLive);  // restore from defaults
    renderBlog(defaults.blog); bindContact(); applyBrand();
    if ($(".hpx-tab.active")) showPane($(".hpx-tab.active").getAttribute("data-pane"));
    toast("Content reset to original");
  }

  /* ════════ CONSULTATION MODAL + CTA WIRING ════════ */
  function openConsult() {
    if (editing) return;
    $("#hpxConsultForm").style.display = ""; $("#hpxConsultSuccess").style.display = "none"; openOverlay("hpxConsult");
  }
  function wireCTAs() {
    [".nav-cta .btn", ".mobile-menu .btn", "#hero .hero-ctas .btn-primary", "#final-cta .cta-actions .btn-primary"].forEach(function (s) {
      $all(s).forEach(function (el) { el.addEventListener("click", function (e) { e.preventDefault(); if (!editing) openConsult(); }); });
    });
  }
  function wireTabs() {
    $all(".hpx-tab").forEach(function (t) { t.addEventListener("click", function () { showPane(t.getAttribute("data-pane")); }); });
    $all(".hpx-modal-overlay").forEach(function (ov) { ov.addEventListener("click", function (e) { if (e.target === ov) closeOverlay(ov.id); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") $all(".hpx-modal-overlay.open").forEach(function (o) { closeOverlay(o.id); });
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) { e.preventDefault(); openAdmin(); }
    });
  }

  /* ════════ PUBLIC API ════════ */
  window.HPX = {
    openAdmin: openAdmin, closeAdmin: function () { closeOverlay("hpxAdmin"); }, closeLogin: function () { closeOverlay("hpxLogin"); },
    login: login, logout: logout, toggleEdit: toggleEdit,
    itemAdd: itemAdd, itemDel: itemDel, itemMove: itemMove, itemImg: itemImg, saveSection: saveSection,
    saveContact: saveContact, saveBrand: saveBrand, resetColors: resetColors, uploadLogo: uploadLogo,
    openReader: openReader, closeReader: function () { closeOverlay("hpxReader"); },
    openConsult: openConsult, closeConsult: function () { closeOverlay("hpxConsult"); }, submitLead: submitLead,
    exportLeads: exportLeads, clearLeads: clearLeads, exportContent: exportContent, importContent: importContent, resetAll: resetAll
  };

  /* ════════ BOOT ════════ */
  function ready() {
    scrapeDefaults();
    indexNodes();
    applyAll();
    wireCTAs();
    wireTabs();
    if (location.hash === "#admin" || /[?&]admin/.test(location.search)) openAdmin();
    if (isAuthed()) $("#hpxFab").classList.add("show");
  }
  function boot() {
    var stored = loadLS(LS_CONTENT);
    if (stored) { content = Object.assign(blankContent(), stored); ready(); }
    else {
      fetch("content.json", { cache: "no-store" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (obj) { if (obj) content = Object.assign(blankContent(), obj); })
        .catch(function () {})
        .finally(ready);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
