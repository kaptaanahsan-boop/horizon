# Horizon Physician Services — Admin Guide

Your site now has a built-in, self-contained content manager. No server or database is required — everything runs inside `index.html`.

## Logging in
Open the site and do any one of these:
- Click the small **Admin** link in the footer (bottom-right of the page), or
- Add `#admin` to the URL (e.g. `yoursite.com/index.html#admin`), or
- Press **Ctrl/Cmd + Shift + A**.

**Default password:** `horizon2026`
Change it under the **Branding** tab → "Change Admin Password".

## What you can edit
- **Edit Content** – Click "Start Editing the Page", then click directly on any headline, paragraph, service, bio, FAQ, footer, or contact detail to type changes. Click outside a block to save it. While editing, leadership photos show a "change photo" overlay — click to upload a new image. Click **Done Editing** when finished.
- **Stats** – The four headline numbers (value, suffix, label, sub-label).
- **Team** – LinkedIn URLs for the CEO and CFO (photos are changed in Edit mode).
- **Reviews** – Star rating (1–5) for each testimonial.
- **Branding** – Brand colors (navy + teal), logo image, and the admin password.
- **Leads** – Consultation requests submitted through the site. Export them to CSV.

## How saving works (important)
Your edits are saved **instantly in your browser**. They are visible to you on this device right away.

To publish changes so **every visitor** sees them:
1. Go to **Save / Publish → Export Content File**. This downloads `content.json`.
2. Upload that `content.json` next to `index.html` on your web host.
3. The site automatically loads it on every visit.

To move edits between computers, use **Export** on one and **Import** on the other.

**Reset All Content** restores the original site text and design.

## The consultation form
Every "Schedule a Consultation" / "Book Consultation" button opens a contact form. Submissions are stored in the browser and appear under the **Leads** tab, where you can export them to CSV.

> Note: Because this is a no-server setup, the form does not auto-email you — leads are captured locally. If you later want submissions emailed automatically, that requires a small backend or a form service (e.g. Formspree), which can be added.
