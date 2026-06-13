/* ════════════════════════════════════════════════════════════════
   Horizon Physician Services — SHARED CMS CORE
   Used by both the public site (site.js) and the admin (admin.js).
   Exposes window.HPXCMS with: constants, helpers, TEXTMAP, SCHEMA,
   scrape(doc) and HTML template builders.
   ════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function escAttr(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
  function copy(o) { return JSON.parse(JSON.stringify(o)); }
  function shade(hex, pct) {
    if (!/^#/.test(hex || "")) return hex;
    var n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    var f = pct < 0 ? 0 : 255, t = Math.abs(pct);
    r = Math.round((f - r) * t + r); g = Math.round((f - g) * t + g); b = Math.round((f - b) * t + b);
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }
  function stars(r) { var h = ""; r = +r || 5; for (var s = 1; s <= 5; s++) h += '<span class="star" style="opacity:' + (s <= r ? 1 : .25) + '">★</span>'; return h; }

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

  var BLOG_DEFAULTS = [
    { title: "5 Root Causes of Claim Denials (and How to Stop Them)", tag: "Denial Management", date: "June 2, 2026", author: "Horizon Team", image: "",
      excerpt: "Most denials trace back to a handful of preventable errors. Here's how to fix them upstream before they cost you revenue.",
      body: "Claim denials quietly erode practice revenue, and the frustrating part is that most of them are preventable. After reviewing thousands of denied claims, we consistently see the same root causes.\n\nEligibility and benefits not verified. Submitting a claim without confirming active coverage is the single most common denial driver. A 30-second verification at check-in prevents it.\n\nCoding errors and mismatches. Incorrect, outdated, or mismatched ICD-10 and CPT codes trigger automatic rejections. Certified coders and real-time scrubbing catch these before submission.\n\nMissing or late authorizations. Many payers require prior authorization for specific services. Track requirements by payer and obtain authorizations before the encounter.\n\nTimely filing limits. Claims that age past the payer's filing window are denied outright with no appeal. Systematic follow-up keeps every claim moving.\n\nIncomplete documentation. Claims must be supported by clear clinical documentation. Aligning documentation with billed services protects both revenue and compliance." },
    { title: "Understanding Days in AR: The Metric That Predicts Cash Flow", tag: "AR Management", date: "May 21, 2026", author: "Horizon Team", image: "",
      excerpt: "Days in accounts receivable is the clearest early warning sign of revenue cycle trouble. Here's how to read and improve it.",
      body: "Days in AR measures the average time it takes to collect payment after a service is rendered. It is one of the most revealing indicators of revenue cycle health.\n\nA healthy benchmark for most practices is under 40 days. When that number climbs, it signals that claims are sitting unpaid longer than they should, which directly tightens cash flow.\n\nTo improve days in AR, work aging buckets proactively, prioritize high-value and near-timely-filing claims, and resolve denials quickly rather than letting them pile up. Transparent monthly reporting keeps the metric visible so problems are caught early." },
    { title: "Personal Injury Billing: What Makes It Different", tag: "PI Billing", date: "May 8, 2026", author: "Horizon Team", image: "",
      excerpt: "Liens, letters of protection, attorney coordination — personal injury billing is a specialty of its own. Here's what to know.",
      body: "Personal injury and workers' compensation billing operate on a different set of rules than standard insurance billing, and treating them the same way leaves money on the table.\n\nLien management. PI cases often involve medical liens that must be tracked and protected through settlement. Missing a lien can mean never getting paid.\n\nLetters of protection. These agreements tie payment to case resolution, which requires careful documentation and follow-through over months or even years.\n\nAttorney coordination. Successful PI billing depends on consistent communication with attorneys, accurate records, and timely responses to case requests." }
  ];

  /* ─── fixed-text fields (selectors must be unique in the page) ─── */
  var TEXTMAP = [
    { g: "Hero", k: "hero_badge", label: "Hero badge", sel: "#hero .hero-badge span", type: "text" },
    { g: "Hero", k: "hero_headline", label: "Hero headline (HTML — use <br> and <span class='accent'>…</span> for the teal highlight)", sel: "#hero .hero-headline", type: "html" },
    { g: "Hero", k: "hero_sub", label: "Hero subheadline", sel: "#hero .hero-sub", type: "textarea" },
    { g: "Hero", k: "hero_cta1", label: "Hero primary button", sel: "#hero .hero-ctas .btn-primary", type: "text" },
    { g: "Hero", k: "hero_cta2", label: "Hero secondary button", sel: "#hero .hero-ctas .btn-outline-white", type: "text" },
    { g: "Hero", k: "trust1", label: "Trust badge 1", sel: "#hero .hero-trust .trust-item:nth-child(1) span", type: "text" },
    { g: "Hero", k: "trust2", label: "Trust badge 2", sel: "#hero .hero-trust .trust-item:nth-child(2) span", type: "text" },
    { g: "Hero", k: "trust3", label: "Trust badge 3", sel: "#hero .hero-trust .trust-item:nth-child(3) span", type: "text" },
    { g: "Hero", k: "trust4", label: "Trust badge 4", sel: "#hero .hero-trust .trust-item:nth-child(4) span", type: "text" },

    { g: "Services", k: "services_label", label: "Eyebrow label", sel: "#services .section-header .label", type: "text" },
    { g: "Services", k: "services_h2", label: "Heading", sel: "#services .section-header h2", type: "text" },
    { g: "Services", k: "services_lead", label: "Intro paragraph", sel: "#services .section-header .text-lead", type: "textarea" },

    { g: "About", k: "about_label", label: "Eyebrow label", sel: "#about .label", type: "text" },
    { g: "About", k: "about_h2", label: "Heading", sel: "#about .about-content h2", type: "text" },
    { g: "About", k: "about_lead", label: "Lead paragraph", sel: "#about .about-lead", type: "textarea" },
    { g: "About", k: "about_body", label: "Second paragraph", sel: "#about .about-content > p:not(.about-lead)", type: "textarea" },
    { g: "About", k: "about_mission", label: "Mission", sel: "#about .mvv-card:nth-child(1) p", type: "textarea" },
    { g: "About", k: "about_vision", label: "Vision", sel: "#about .mvv-card:nth-child(2) p", type: "textarea" },
    { g: "About", k: "about_values", label: "Core values", sel: "#about .mvv-card:nth-child(3) p", type: "textarea" },
    { g: "About", k: "about_badge_n", label: "Badge number", sel: "#about .about-badge .n", type: "text" },
    { g: "About", k: "about_badge_l", label: "Badge label (HTML)", sel: "#about .about-badge .l", type: "html" },

    { g: "Why Us", k: "why_label", label: "Eyebrow label", sel: "#why .section-header .label", type: "text" },
    { g: "Why Us", k: "why_h2", label: "Heading", sel: "#why .section-header h2", type: "text" },
    { g: "Why Us", k: "why_lead", label: "Intro paragraph", sel: "#why .section-header .text-lead", type: "textarea" },

    { g: "Process", k: "process_label", label: "Eyebrow label", sel: "#process .section-header .label", type: "text" },
    { g: "Process", k: "process_h2", label: "Heading", sel: "#process .section-header h2", type: "text" },
    { g: "Process", k: "process_lead", label: "Intro paragraph", sel: "#process .section-header .text-lead", type: "textarea" },

    { g: "Leadership", k: "lead_label", label: "Eyebrow label", sel: "#leadership .section-header .label", type: "text" },
    { g: "Leadership", k: "lead_h2", label: "Heading", sel: "#leadership .section-header h2", type: "text" },
    { g: "Leadership", k: "lead_lead", label: "Intro paragraph", sel: "#leadership .section-header .text-lead", type: "textarea" },

    { g: "Testimonials", k: "testi_label", label: "Eyebrow label", sel: "#testimonials .section-header .label", type: "text" },
    { g: "Testimonials", k: "testi_h2", label: "Heading", sel: "#testimonials .section-header h2", type: "text" },
    { g: "Testimonials", k: "testi_lead", label: "Intro paragraph", sel: "#testimonials .section-header .text-lead", type: "textarea" },

    { g: "Blog", k: "blog_label", label: "Eyebrow label", sel: "#blog .section-header .label", type: "text" },
    { g: "Blog", k: "blog_h2", label: "Heading", sel: "#blog .section-header h2", type: "text" },
    { g: "Blog", k: "blog_lead", label: "Intro paragraph", sel: "#blog .section-header .text-lead", type: "textarea" },

    { g: "FAQ", k: "faq_label", label: "Eyebrow label", sel: "#faq .section-header .label", type: "text" },
    { g: "FAQ", k: "faq_h2", label: "Heading", sel: "#faq .section-header h2", type: "text" },
    { g: "FAQ", k: "faq_lead", label: "Intro paragraph", sel: "#faq .section-header .text-lead", type: "textarea" },

    { g: "Final CTA", k: "cta_label", label: "Eyebrow label", sel: "#final-cta .label", type: "text" },
    { g: "Final CTA", k: "cta_h2", label: "Heading", sel: "#final-cta h2", type: "text" },
    { g: "Final CTA", k: "cta_lead", label: "Paragraph", sel: "#final-cta .text-lead", type: "textarea" },

    { g: "Footer", k: "footer_blurb", label: "Footer description", sel: "#footer .footer-brand p", type: "textarea" }
  ];

  /* ─── repeatable section schema ─── */
  var SCHEMA = {
    stats:        { title: "Stat", grid: "statsGrid", fields: [ ["value", "Value (e.g. 10, 1M, 95)", "text"], ["suffix", "Suffix (+, %)", "text"], ["label", "Label", "text"], ["sublabel", "Sub-label", "text"] ],
                    blank: { value: "0", suffix: "+", label: "New stat", sublabel: "" } },
    services:     { title: "Service", grid: "servicesGrid", fields: [ ["icon", "Icon", "icon"], ["title", "Title", "text"], ["desc", "Description", "textarea"] ],
                    blank: { icon: ICONS["Check"], title: "New Service", desc: "Describe this service." } },
    why:          { title: "Reason", grid: "whyGrid", fields: [ ["num", "Number badge", "text"], ["title", "Title", "text"], ["desc", "Description", "textarea"] ],
                    blank: { num: "00", title: "New reason", desc: "Why this matters." } },
    process:      { title: "Step", grid: "processSteps", fields: [ ["emoji", "Emoji/Icon", "text"], ["badge", "Badge (e.g. Step 01)", "text"], ["title", "Title", "text"], ["desc", "Description", "textarea"] ],
                    blank: { emoji: "✅", badge: "Step", title: "New step", desc: "What happens here." } },
    team:         { title: "Member", grid: "teamGrid", fields: [ ["photo", "Photo", "image"], ["name", "Name", "text"], ["title", "Title", "text"], ["badge", "Badge (e.g. CEO)", "text"], ["bio", "Biography", "textarea"], ["linkedin", "LinkedIn URL", "text"] ],
                    blank: { photo: "", name: "New Member", title: "Title", badge: "Team", bio: "Short biography.", linkedin: "" } },
    testimonials: { title: "Review", grid: "testiGrid", fields: [ ["rating", "Star rating", "rating"], ["text", "Testimonial", "textarea"], ["name", "Client name", "text"], ["spec", "Specialty / location", "text"], ["avatar", "Avatar initials", "text"] ],
                    blank: { rating: 5, text: "Their experience…", name: "Client name", spec: "Specialty · State", avatar: "AB" } },
    faq:          { title: "Question", grid: "faqWrap", fields: [ ["q", "Question", "text"], ["a", "Answer", "textarea"] ],
                    blank: { q: "New question?", a: "The answer." } },
    blog:         { title: "Post", grid: "blogGrid", fields: [ ["image", "Cover image", "image"], ["title", "Title", "text"], ["tag", "Category tag", "text"], ["date", "Date", "text"], ["author", "Author", "text"], ["excerpt", "Excerpt (card preview)", "textarea"], ["body", "Full article", "bigtext"] ],
                    blank: { image: "", title: "New Post", tag: "Article", date: "", author: "Horizon Team", excerpt: "Short summary.", body: "Write your article here.\n\nUse blank lines between paragraphs." } }
  };
  var SECTION_ORDER = ["stats", "services", "why", "process", "team", "testimonials", "faq", "blog"];

  /* ════════ HTML TEMPLATE BUILDERS (return strings) ════════ */
  var T = {
    stats: function (arr) { return arr.map(function (s) {
      return '<div class="stat-card"><div class="num"><span>' + esc(s.value) + '</span>' + esc(s.suffix) +
        '</div><div class="lbl">' + esc(s.label) + '</div><div class="sublbl">' + esc(s.sublabel) + '</div></div>'; }).join(""); },
    services: function (arr) { return arr.map(function (s) {
      return '<div class="service-card"><div class="service-icon">' + (s.icon || "") + '</div><h3>' + esc(s.title) +
        '</h3><p>' + esc(s.desc) + '</p><a class="link-btn" href="#">Learn More</a></div>'; }).join(""); },
    why: function (arr) { return arr.map(function (s) {
      return '<div class="why-card"><div class="why-num">' + esc(s.num) + '</div><h3>' + esc(s.title) + '</h3><p>' + esc(s.desc) + '</p></div>'; }).join(""); },
    process: function (arr) { return arr.map(function (s, i) {
      return '<div class="step go" id="pstep' + i + '"><div class="step-ring-wrap"><div class="step-circle">' + (i + 1) +
        '</div></div><div class="step-body"><div class="step-icon">' + esc(s.emoji) + '</div><div class="step-num-badge">' + esc(s.badge) +
        '</div><div class="step-title">' + esc(s.title) + '</div><p class="step-desc">' + esc(s.desc) + '</p></div></div>'; }).join(""); },
    team: function (arr) { return arr.map(function (s) {
      var li = (s.linkedin && s.linkedin !== "#") ? '<a class="team-linkedin" href="' + escAttr(s.linkedin) + '" target="_blank" rel="noopener">' + LI_SVG + ' Connect on LinkedIn</a>' : "";
      return '<div class="team-card"><div class="team-photo-wrap"><div class="team-photo-badge">' + esc(s.badge) +
        '</div><img src="' + escAttr(s.photo) + '" alt="' + escAttr(s.name) + '"></div><div class="team-card-body"><div class="team-name">' +
        esc(s.name) + '</div><div class="team-title">' + esc(s.title) + '</div><p class="team-bio">' + esc(s.bio) + '</p>' + li + '</div></div>'; }).join(""); },
    testimonials: function (arr) { return arr.map(function (s) {
      return '<div class="testi-card"><div class="testi-quote-icon">' + QUOTE_SVG + '</div><div class="stars">' + stars(s.rating) +
        '</div><p class="testi-text">"' + esc(s.text) + '"</p><div class="testi-author"><div class="testi-avatar">' + esc(s.avatar) +
        '</div><div><div class="testi-name">' + esc(s.name) + '</div><div class="testi-spec">' + esc(s.spec) + '</div></div></div></div>'; }).join(""); },
    faq: function (arr) { return arr.map(function (s, i) {
      return '<div class="faq-item' + (i === 0 ? " open" : "") + '"><button class="faq-q" onclick="toggleFaq(this)"><span>' +
        esc(s.q) + '</span><div class="faq-icon">+</div></button><div class="faq-a"' + (i === 0 ? ' style="max-height:600px;"' : "") +
        '><div class="faq-a-inner">' + esc(s.a) + '</div></div></div>'; }).join(""); },
    blog: function (arr) { return arr.map(function (p, i) {
      var img = p.image ? '<img class="blog-img" src="' + escAttr(p.image) + '" alt="' + escAttr(p.title) + '">' : BLOG_FALLBACK;
      return '<div class="blog-card">' + img + '<div class="blog-body"><span class="blog-tag">' + esc(p.tag || "Article") +
        '</span><h3>' + esc(p.title) + '</h3><p class="blog-excerpt">' + esc(p.excerpt) + '</p><div class="blog-meta"><span>' +
        esc(p.date) + '</span><span class="dot"></span><span>' + esc(p.author) + '</span></div>' +
        '<button class="blog-readmore" onclick="HPX.openReader(' + i + ')">Read article →</button></div></div>'; }).join(""); }
  };

  /* ════════ SCRAPE DEFAULTS FROM A DOCUMENT ════════ */
  function scrape(doc) {
    function q(sel) { return doc.querySelector(sel); }
    function qa(sel) { return Array.prototype.slice.call(doc.querySelectorAll(sel)); }
    function tx(el) { return el ? el.textContent.trim() : ""; }
    var d = { text: {}, sections: {}, contact: {}, social: {}, brand: {} };

    TEXTMAP.forEach(function (t) {
      var el = q(t.sel);
      d.text[t.k] = el ? (t.type === "html" ? el.innerHTML.trim() : el.textContent.trim()) : "";
    });

    d.sections.stats = qa("#statsGrid .stat-card").map(function (c) {
      var span = c.querySelector(".num span"), num = c.querySelector(".num");
      var suffix = num ? num.textContent.replace(span ? span.textContent : "", "").trim() : "";
      return { value: span ? span.textContent.trim() : "", suffix: suffix, label: tx(c.querySelector(".lbl")), sublabel: tx(c.querySelector(".sublbl")) };
    });
    d.sections.services = qa("#servicesGrid .service-card").map(function (c) {
      return { icon: (c.querySelector(".service-icon") || {}).innerHTML || "", title: tx(c.querySelector("h3")), desc: tx(c.querySelector("p")) };
    });
    d.sections.why = qa("#whyGrid .why-card").map(function (c) {
      return { num: tx(c.querySelector(".why-num")), title: tx(c.querySelector("h3")), desc: tx(c.querySelector("p")) };
    });
    d.sections.process = qa("#processSteps .step").map(function (c) {
      return { emoji: tx(c.querySelector(".step-icon")), badge: tx(c.querySelector(".step-num-badge")), title: tx(c.querySelector(".step-title")), desc: tx(c.querySelector(".step-desc")) };
    });
    d.sections.team = qa("#teamGrid .team-card").map(function (c) {
      var img = c.querySelector("img"), li = c.querySelector(".team-linkedin");
      return { photo: img ? img.getAttribute("src") : "", badge: tx(c.querySelector(".team-photo-badge")), name: tx(c.querySelector(".team-name")),
               title: tx(c.querySelector(".team-title")), bio: tx(c.querySelector(".team-bio")), linkedin: li ? (li.getAttribute("href") || "") : "" };
    });
    d.sections.testimonials = qa("#testiGrid .testi-card").map(function (c) {
      return { rating: 5, text: tx(c.querySelector(".testi-text")).replace(/^["“]|["”]$/g, ""), name: tx(c.querySelector(".testi-name")),
               spec: tx(c.querySelector(".testi-spec")), avatar: tx(c.querySelector(".testi-avatar")) };
    });
    d.sections.faq = qa("#faqWrap .faq-item").map(function (c) {
      return { q: tx(c.querySelector(".faq-q span")), a: tx(c.querySelector(".faq-a-inner")) };
    });
    d.sections.blog = copy(BLOG_DEFAULTS);

    d.contact = {
      phone: tx(q('[data-c="phone"]')) || "+1 (800) 000-0000",
      email: tx(q('[data-c="email"]')) || "info@horizonphysicianservices.com",
      hours: tx(q('[data-c="hours"]')) || "Mon – Fri, 8 AM – 6 PM EST",
      address: (q('[data-c="address"]') ? q('[data-c="address"]').innerHTML.trim() : "") || "[City, State, ZIP]<br>United States"
    };
    d.social = { linkedin: "", facebook: "", twitter: "" };
    var logo = q(".nav-logo img");
    d.brand = { navy: "#0B1F4B", teal: "#0E9A8C", logo: "", company: "Horizon Physician Services LLC" };
    d.logoSrc = logo ? logo.getAttribute("src") : "logo.png";
    return d;
  }

  window.HPXCMS = {
    esc: esc, escAttr: escAttr, copy: copy, shade: shade, stars: stars,
    ICONS: ICONS, LI_SVG: LI_SVG, QUOTE_SVG: QUOTE_SVG, BLOG_FALLBACK: BLOG_FALLBACK, BLOG_DEFAULTS: BLOG_DEFAULTS,
    TEXTMAP: TEXTMAP, SCHEMA: SCHEMA, SECTION_ORDER: SECTION_ORDER, T: T, scrape: scrape,
    LS_CONTENT: "hpx_content_v2", LS_LEADS: "hpx_leads_v1", DEFAULT_PW: "horizon2026"
  };
})();
