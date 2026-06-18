/* Generator for Horizon blog: individual post pages + blog index + full sitemap.
   Reads blog posts from content.json (or the defaults in cms-shared.js).
   Run:  node build-blog.js   (also regenerates sitemap.xml) */
const fs = require("fs");
const path = require("path");
const bs = require("./build-services.js");                 // nav/footer/GA helpers + SERVICES
global.window = global.window || {};
require("./cms-shared.js");                                // sets window.HPXCMS
const CMS = global.window.HPXCMS;
const OUT = __dirname, ORIGIN = "https://horizonphysician.com";
const esc = bs.esc;
const FALLBACK = '<div class="blog-img-fallback"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>';

function posts() {
  try {
    var c = JSON.parse(fs.readFileSync(path.join(OUT, "content.json"), "utf8"));
    if (c.sections && c.sections.blog && c.sections.blog.length) return c.sections.blog;
  } catch (e) {}
  return CMS.BLOG_DEFAULTS;
}
function slug(p) { return CMS.slugify(p.title); }
function paras(body) { return String(body || "").split(/\n\n+/).map(function (t) { return "<p>" + esc(t.trim()).replace(/\n/g, "<br>") + "</p>"; }).join(""); }
function isoDate(d) { var t = new Date(d); return isNaN(t.getTime()) ? "" : t.toISOString().slice(0, 10); }
function head(title, desc, url, image, type, extraSchema) {
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/png" href="/logo.png">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
${bs.GA_TAG}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="service.css?v=3">
${extraSchema ? '<script type="application/ld+json">' + JSON.stringify(extraSchema) + "</script>" : ""}`;
}
function imgFull(im) { return im ? (im.indexOf("http") === 0 ? im : ORIGIN + "/" + im) : ORIGIN + "/og-image.png"; }

function postPage(p, idx, all) {
  var s = slug(p), url = ORIGIN + "/blog-" + s + ".html";
  var related = all.filter(function (_, i) { return i !== idx; }).slice(0, 3);
  var pub = isoDate(p.date);
  var article = {
    "@context": "https://schema.org", "@type": "BlogPosting", "headline": p.title, "description": p.excerpt,
    "image": imgFull(p.image), "author": { "@type": "Organization", "name": "Horizon Physician Services LLC" },
    "publisher": { "@type": "Organization", "name": "Horizon Physician Services LLC", "logo": { "@type": "ImageObject", "url": ORIGIN + "/logo.png" } },
    "url": url, "mainEntityOfPage": url
  };
  if (pub) { article.datePublished = pub; article.dateModified = pub; }
  var crumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": ORIGIN + "/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": ORIGIN + "/blog.html" },
    { "@type": "ListItem", "position": 3, "name": p.title, "item": url }
  ] };
  var img = p.image ? `<img class="article-img" src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" decoding="async">` : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
${head(p.title, p.excerpt, url, imgFull(p.image), "article", [article, crumb])}
</head>
<body>
${bs.navHtml()}
<header class="svc-hero"><div class="container">
  <div class="crumb"><a href="index.html">Home</a> &nbsp;/&nbsp; <a href="blog.html">Blog</a> &nbsp;/&nbsp; ${esc(p.tag || "Article")}</div>
  <span class="eyebrow">${esc(p.tag || "Article")}</span>
  <h1 style="max-width:840px;">${esc(p.title)}</h1>
  <p class="lead" style="margin-bottom:0;">${esc(p.date || "")}${p.author ? " &nbsp;·&nbsp; " + esc(p.author) : ""}</p>
</div></header>
<article class="section-pad"><div class="container article-wrap">
  ${img}
  <div class="article-body">${paras(p.body)}</div>
</div></article>
${related.length ? `<section class="section-pad tint"><div class="container">
  <div class="label">More Articles</div><h2 class="h2" style="margin-bottom:28px;">Related reading</h2>
  <div class="grid cols-3 related">${related.map(function (r) { return `<a href="blog-${slug(r)}.html">${esc(r.title)}</a>`; }).join("")}</div>
</div></section>` : ""}
<section class="section-pad"><div class="container"><div class="cta-band">
  <h2>Ready to strengthen your revenue cycle?</h2>
  <p>Schedule a free consultation with Horizon Physician Services and put these ideas to work.</p>
  <a class="btn btn-primary btn-lg" href="index.html#final-cta">Schedule a Consultation</a>
</div></div></section>
${bs.footerHtml()}
</body>
</html>`;
}

function indexPage(all) {
  var url = ORIGIN + "/blog.html";
  var blogSchema = { "@context": "https://schema.org", "@type": "Blog", "name": "Horizon Physician Services Blog", "url": url,
    "description": "Insights on medical billing, coding, denial management, and revenue cycle strategy for healthcare providers.",
    "publisher": { "@type": "Organization", "name": "Horizon Physician Services LLC", "logo": { "@type": "ImageObject", "url": ORIGIN + "/logo.png" } },
    "blogPost": all.map(function (p) { return { "@type": "BlogPosting", "headline": p.title, "url": ORIGIN + "/blog-" + slug(p) + ".html", "datePublished": isoDate(p.date) || undefined }; }) };
  var crumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": ORIGIN + "/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": url } ] };
  var cards = all.map(function (p) {
    var s = slug(p);
    var img = p.image ? `<img class="blog-img" src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" decoding="async">` : FALLBACK;
    return `<a class="bcard" href="blog-${s}.html">${img}<div class="bcard-body"><span class="blog-tag">${esc(p.tag || "Article")}</span><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><div class="blog-meta">${esc(p.date || "")}${p.author ? " · " + esc(p.author) : ""}</div></div></a>`;
  }).join("");
  return `<!DOCTYPE html>
<html lang="en">
<head>
${head("Medical Billing & RCM Blog | Horizon Physician Services", "Practical guidance on medical billing, coding, denial management, and revenue cycle strategy for healthcare providers.", url, ORIGIN + "/og-image.png", "website", [blogSchema, crumb])}
</head>
<body>
${bs.navHtml()}
<header class="svc-hero"><div class="container">
  <div class="crumb"><a href="index.html">Home</a> &nbsp;/&nbsp; Blog</div>
  <span class="eyebrow">Insights &amp; Resources</span>
  <h1>From the <span class="accent">Horizon Blog</span></h1>
  <p class="lead">Practical guidance on medical billing, coding, denial management, and revenue cycle strategy for healthcare providers.</p>
</div></header>
<section class="section-pad"><div class="container">
  <div class="blog-index-grid">${cards}</div>
</div></section>
${bs.footerHtml()}
</body>
</html>`;
}

function buildSitemap(all) {
  var today = new Date().toISOString().slice(0, 10);
  var urls = [{ loc: ORIGIN + "/", pri: "1.0", freq: "weekly" }];
  bs.SERVICES.forEach(function (s) { urls.push({ loc: ORIGIN + "/" + s.slug + ".html", pri: "0.9", freq: "monthly" }); });
  urls.push({ loc: ORIGIN + "/blog.html", pri: "0.8", freq: "weekly" });
  all.forEach(function (p) { urls.push({ loc: ORIGIN + "/blog-" + slug(p) + ".html", pri: "0.7", freq: "monthly" }); });
  var body = urls.map(function (u) { return `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.pri}</priority></url>`; }).join("\n");
  fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
}

var all = posts();
var written = [];
all.forEach(function (p, i) { fs.writeFileSync(path.join(OUT, "blog-" + slug(p) + ".html"), postPage(p, i, all)); written.push("blog-" + slug(p) + ".html"); });
fs.writeFileSync(path.join(OUT, "blog.html"), indexPage(all));
buildSitemap(all);
console.log("Generated blog.html + " + written.length + " posts:\n  " + written.join("\n  "));
console.log("Rebuilt sitemap.xml (" + (1 + bs.SERVICES.length + 1 + all.length) + " URLs)");
