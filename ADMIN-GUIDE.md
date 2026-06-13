# Horizon Physician Services — Admin Guide

Your site has a full built-in content manager. No server or database needed — everything runs inside `index.html` + `app.js`.

## Logging in
Open the site and do any one of these:
- Click the **Admin** link in the footer, or
- Add `#admin` to the URL (e.g. `horizonphysician.com/#admin`), or
- Press **Ctrl/Cmd + Shift + A**.

**Default password:** `horizon2026` — change it under the **Branding** tab right away (it's visible in your public GitHub repo until you do).

## What you can manage (every tab)
- **Pages & Text** — turn on inline editing to click and edit any fixed text directly on the page: hero headline, section intros, About copy, footer text, mission/vision/values.
- **Stats** — add / remove / reorder / edit the headline number cards (value, suffix, label, sub-label).
- **Services** — add / remove / reorder services; pick an icon, edit title and description.
- **Why Us** — add / remove / edit the "why choose us" cards.
- **Process** — add / remove / reorder workflow steps (emoji, badge, title, description).
- **Team** — add / remove team members: upload a photo, set name, title, badge, bio, and LinkedIn URL.
- **Reviews** — add / remove testimonials, set star rating, client name and specialty.
- **Blog** — add / remove posts: cover image, title, category, date, author, excerpt, and full article. Posts open in an in-page reader. (Comes with 3 starter posts you can edit or delete.)
- **FAQ** — add / remove / edit questions and answers.
- **Contact** — set phone, email, address, office hours, and social links once; they update across the CTA band and footer everywhere.
- **Branding** — company name, brand colors, logo upload, and the admin password.
- **Leads** — consultation requests submitted through the site; export to CSV.

In every section editor: **＋ Add** creates a new item, **↑ ↓** reorder, **🗑** deletes, and **Save** applies it to the live page. Add/remove/reorder buttons auto-save your typed text first.

## How publishing works (important)
Your edits save **instantly in this browser** so you see them right away. To make them permanent for **all visitors**:

1. In the admin, open **Publish → Export Content File**. This downloads `content.json`.
2. Put that `content.json` in your project folder next to `index.html`.
3. Push it live:
   ```
   git add .
   git commit -m "Update site content"
   git push
   ```
   Vercel auto-redeploys and everyone sees the changes. The site loads `content.json` automatically.

To move edits between computers, use **Export** on one and **Import** on the other.
**Reset All Content** restores the original site.

## Files
- `index.html` — page structure, styles, and the admin UI shell.
- `app.js` — the content-management engine. **Both files must be deployed together.**
- `content.json` — (optional) your published content. Created when you Export.

> Note: this is a no-server setup, so the consultation form captures leads locally (viewable under the Leads tab) rather than emailing them automatically. If you later want submissions emailed, that can be added with a small form service.
