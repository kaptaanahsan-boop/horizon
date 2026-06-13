# Horizon Physician Services — Admin Guide

The website now has a **separate admin dashboard** on its own page. The public site no longer has any on-site editing — it just displays your content.

## Opening the admin
Go to:

```
https://horizonphysician.com/admin.html
```

Sign in with your password. **Default: `horizon2026`** — change it immediately under the **Branding** tab.

> The admin works on the live (hosted) site. Opening it from a local file won't load the live preview because browsers block file access.

## The dashboard
A normal control panel: a sidebar of sections on the left, the editor in the middle, and a **live preview** of your site on the right that refreshes every time you save.

What you can manage:

- **Pages & Text** — all fixed text: hero headline/subtext/buttons, trust badges, every section's intro, About copy, mission/vision/values, final CTA, footer description.
- **Stats** — add / remove / reorder the headline number cards.
- **Services** — add / remove / reorder; pick an icon, edit title and description.
- **Why Us** — the "why choose us" cards.
- **Process** — workflow steps (emoji, badge, title, description).
- **Team** — add / remove members: photo upload, name, title, badge, bio, LinkedIn.
- **Reviews** — testimonials with star ratings.
- **Blog** — add / remove posts (cover image, title, category, date, author, excerpt, full article). Posts open in an in-page reader on the site. Ships with 3 starter posts.
- **FAQ** — questions and answers.
- **Contact** — phone, email, address, hours, social links — updates the CTA band and footer everywhere.
- **Branding** — company name, brand colors, logo, and admin password.
- **Leads** — consultation requests from the site; export to CSV.
- **Publish** — export/import the content file; reset.

In each section: **＋ Add**, **↑ ↓** reorder, **🗑** delete, and **Save**. Saving updates the preview instantly.

## Publishing (making edits permanent for everyone)
Edits you Save are stored in your browser and show in the preview right away. To make them live for **all visitors**:

1. Go to **Publish → Export content.json**.
2. Put that `content.json` in your project folder next to `index.html`.
3. Push it live:
   ```
   git add .
   git commit -m "Update site content"
   git push
   ```
   Vercel redeploys and everyone sees the changes. The site loads `content.json` automatically.

## Files in this project
- `index.html` — the public website (structure + styles).
- `cms-shared.js` — shared content definitions used by both the site and the admin.
- `site.js` — renders the public site from your content.
- `admin.html` + `admin.js` — the standalone admin dashboard.
- `content.json` — (optional) your published content, created when you Export.
- `app.js` — deprecated/empty, no longer used (safe to ignore).

**All of these must be deployed together** — they're already in your folder, so `git add .` includes them.

> This is a no-server setup, so the consultation form stores leads in the browser (Leads tab) rather than emailing them. Email delivery can be added later with a small form service if you want.
