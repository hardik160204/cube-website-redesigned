# Cube Software website: launch checklist

✅ done and checked · 🔧 to do on launch day (new Vercel + GitHub) · ⚠️ needs your decision

---

## 1. Before you push this code anywhere ⚠️ (important)

This version adds database tables and a new "waiting for confirmation" state for demo bookings. **Apply the database
update to Supabase first**, or the demo booking form will fail:

- Supabase → SQL Editor → New query → paste all of `server/supabase/schema.sql` → Run. It is safe to run again.
- (Or run the server locally once with `server/.env` pointing at the live database: it applies the file on start.)

---

## 2. Launch day, in this order 🔧

1. **GitHub (new repository)**
   - Create it as **private** and push this code.
   - Settings → Code security: turn on **Secret scanning**, **Push protection**, **Dependabot alerts** and **Dependabot security updates**.
2. **Vercel (new project)**
   - Import the repository with framework preset "Other" (`vercel.json` already holds the build and routing settings).
   - Use Node.js 22 or newer.
3. **Environment variables** (Vercel → Settings → Environment Variables → Production). Copy the values from the current Vercel project. Never put them in the code.

   | Name | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `SITE_URL` | `https://cube-software.com` (no www) |
   | `DATABASE_URL`, `DB_CA_CERT` | as now (Supabase) |
   | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | as now |
   | `APP_SECRET` | **the same value as now.** A new one makes every admin re-enrol their authenticator app, and breaks unsubscribe links in emails already sent. |
   | `CRON_SECRET` | as now (the nightly clean-up) |
   | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | the mailbox **info@cube-software.com**. Google Workspace: `smtp.gmail.com`, 587, `false`, info@…, an *app password*. Microsoft 365: `smtp.office365.com`, 587, `false`. |
   | `MAIL_FROM` | `Cube Software <info@cube-software.com>` |
   | `SALES_EMAILS` | who gets new demo requests and enquiries |
   | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | free Upstash Redis, for limits against bots. Easiest: Vercel → Storage → Redis (Upstash), which adds `KV_REST_API_URL` / `KV_REST_API_TOKEN` itself; those work too. |

4. **Domain**
   - Vercel → Domains: add `cube-software.com` and `www.cube-software.com`.
   - At your domain registrar, add the DNS records Vercel shows (usually an A record `76.76.21.21` for cube-software.com and a CNAME `cname.vercel-dns.com` for www).
   - Make www redirect to cube-software.com. Either:
     - choose "Redirect to cube-software.com (308)" for www in Vercel → Domains, or
     - add the redirect to `vercel.json` (section 4 below). We do this together tomorrow.
5. **Email delivery** (so mail from info@ doesn't land in spam). DNS records for cube-software.com:
   - SPF: one TXT record, e.g. `v=spf1 include:_spf.google.com ~all` (Google) or `v=spf1 include:spf.protection.outlook.com ~all` (Microsoft).
   - DKIM: switch it on in Google Admin or Microsoft 365 and add the record it gives you.
   - DMARC: TXT on `_dmarc`: `v=DMARC1; p=none; rua=mailto:info@cube-software.com`.
6. **First checks after the deploy**
   - `https://cube-software.com/robots.txt`: its Sitemap line must show cube-software.com.
   - `https://cube-software.com/sitemap.xml` lists the pages.
   - Right-click a page → View page source: the `<title>` is that page's own title.
   - `https://www.cube-software.com` goes to `https://cube-software.com`.
   - Book a demo with your own email. Confirm it in the dashboard (✓). The confirmation from info@ arrives, and its Unsubscribe link works.
   - Re-run Mozilla Observatory (developer.mozilla.org/observatory) and Lighthouse (Chrome DevTools) on the new address.
7. **Google & Bing** (dashboard → Google & SEO; the steps are written there)
   - Paste the Google Analytics Measurement ID.
   - Verify Search Console (HTML file or meta tag) and submit `sitemap.xml`.
   - In Bing Webmaster Tools, "Import from Google Search Console".
   - Press "Send all pages now" (IndexNow).
8. **Security switches**
   - Vercel → Firewall: turn on **Bot Protection** (free managed rules). Use Attack Challenge Mode only during an attack.
   - Supabase → Authentication: turn on leaked-password protection.
9. **Old address.** Once `SITE_URL` is cube-software.com, the old `*.vercel.app` address automatically tells search engines not to index it. You can delete the old Vercel project when the new one is live.

---

## 3. Needs your decision ⚠️

- **Numbers that disagree.** Make these match what you can prove:
  - "10000+ Active Users" (home, Cloud Contact Center: your edits) vs "5,000+" (About page).
  - Uptime: "99.5% Uptime SLA\*" (home) vs "99.9% Uptime Guarantee\*" (Cloud Contact Center) vs "99.9% SLA" (Pricing).
- **Named testimonials.** Rajesh Kumar (Yatra) and Amitabh Sen (Religare) are quoted by name. Keep them only with their written permission.
- **Promises to keep only if you deliver them:**
  - "Free Lead Management System" (Cloud Contact Center feature list)
  - "Zero Downtime Migration" (pricing guarantees)
  - "Disclaimer: Extra charges applicable for toll free numbers" is good; keep such notes wherever there are extra charges.
- **Refund Policy.** The built-in text is a careful draft. Check it matches how you bill and refund (dashboard → Legal pages).
- **Meet our team** (switched off now). The default bios name the wrong people ("Anita", "Ravi") and claim "Fortune 500 clients". Fix them in Team & social links before switching the page on.
- **Big picture upload.** "AutoDialer1.png" (1.1 MB, used by one of your site edits) slows pages. Re-upload a compressed copy (under 200 KB) and pick it in the same spot.
- **Google Fonts.** The fonts load from Google, which sees visitors' IP addresses. Self-hosting the fonts later removes that (optional).

---

## 4. vercel.json for tomorrow (www → cube-software.com)

Add this as a top-level key in `vercel.json`. It only acts once www.cube-software.com points at the new Vercel project.

```json
"redirects": [
  {
    "source": "/:path*",
    "has": [{ "type": "host", "value": "www.cube-software.com" }],
    "destination": "https://cube-software.com/:path*",
    "permanent": true
  }
]
```

Nothing else in `vercel.json` changes for the new address. The CSP's database host (`dvnugtzuljdqjgmdgqve.supabase.co`) changes only if you move to a new Supabase project.

---

## 5. What was checked (7 November 2026)

| Check | Result |
|---|---|
| Secrets in GitHub: every version of every file in the git history | ✅ No keys, passwords or private keys. The old `backend/.env` only pointed at a local database with no password. |
| Secrets in the website the browser downloads (built files) | ✅ None. The website only talks to its own `/api`; keys live only in Vercel's environment variables. |
| npm audit: server and the Vercel function | ✅ 0 vulnerabilities |
| npm audit: website | ✅ The parts that ship are fixed: React Router updated to 7.18.4, unused `axios` and `zod` removed. 52 findings remain, all inside the build tooling (react-scripts / webpack-dev-server), which never reaches visitors. Moving the build to Vite later clears them. |
| OWASP ZAP 2.17 (crawl + active attack scan, local copy) | ✅ 0 High. 3 Medium, accepted, explained below. 1 Low, a false alarm (timestamps in the JavaScript). |
| Mozilla Observatory (security headers, current live site) | ✅ **A+ (115/100)**, 12 of 12 tests passed |
| Lighthouse (home, Cloud Contact Center, Contact) | ✅ Accessibility 100 · Best Practices 100 · SEO 100. Performance: desktop 79–95, phone 39–59 |
| Accessibility (axe, WCAG 2.1 AA, every page) | ✅ The only issue was faint grey text; fixed. Skip-to-content link added; menus work by keyboard |
| Links (every page and menu) | ✅ 53 internal links, none broken. LinkedIn blocks automated checks but opens normally. |
| Server tests | ✅ 48 of 48 |
| Your site edits | ✅ The live database is unchanged; every edit still applies |

**ZAP's three Mediums, kept on purpose**

- **`img-src https:` (any https picture).** Site edits, blog posts and newsletters can use picture links, and pictures can't run code.
- **`style-src 'unsafe-inline'`.** React's animations set styles inline. Scripts are still strictly limited.
- **No integrity hash on the Google Fonts stylesheet.** Google serves different files to different browsers, so it can't carry one. Self-hosting the fonts removes this.

**Phone speed.** Pages now load only when opened (25% less JavaScript up front), and the footer logo went from 1.6 MB to 8 KB. The home page stays heavier because it draws everything in the browser and runs several animations. The next big step would be pre-rendering pages: a larger project, optional.
