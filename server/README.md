# Cube Software website: server and launch guide

One Node.js process serves the whole site: the React build, the API for demo bookings and enquiries, the
admin dashboard API and SEO files (`sitemap.xml`, `robots.txt`). Data, admin sign-in and images live in
Supabase.

```
frontend/          React site (built into frontend/build)
server/            this folder: Express API
server/supabase/   schema.sql: every table, to paste into the Supabase SQL editor
```

## What runs where

| Piece | Choice | Why |
|---|---|---|
| Web server | Node.js 22.13+ (tested on 24) with Express 5 | Pages, API, validation, rate limits, emails and SEO in one process |
| Database | Supabase Postgres (`DATABASE_URL`) | Managed Postgres with backups. Standard SQL only, so moving to Cube's own Postgres later is a `pg_dump` and a new `DATABASE_URL` |
| Admin sign-in | Supabase Auth | Passwords are stored and checked by Supabase; only emails on the `admins` table can open /admin |
| Images | Supabase Storage, public `media` bucket | Uploaded from the admin dashboard |
| Email | Your own SMTP via Nodemailer | Bookings and enquiries go straight to the sales inbox |

The browser never talks to Supabase directly and holds no Supabase keys. Every table has row-level security
on with no public access, so the public anon key can't read bookings or enquiries.

## Supabase setup (once)

1. Create a project at supabase.com (region: Mumbai, ap-south-1, keeps Indian visitors' data in India).
2. **SQL Editor > New query**: paste all of `server/supabase/schema.sql` and click **Run**.
3. **Authentication > Sign In / Providers**: turn off **Allow new users to sign up** (admins are added from
   the dashboard or the command below, never by sign-up).
4. Fill in `server/.env` (the file explains where each value is):
   - `SUPABASE_URL`: Project Settings > Data API
   - `SUPABASE_ANON_KEY`: Project Settings > API Keys (anon / publishable)
   - `SUPABASE_SERVICE_ROLE_KEY`: Project Settings > API Keys (service_role / secret). Server only.
   - `DATABASE_URL`: **Connect** > Transaction pooler URI (port 6543), with your database password
   - `DB_CA_FILE` (production): Project Settings > Database > SSL Configuration > download certificate
   - `APP_SECRET`: any long random string, kept secret and stable. It encrypts authenticator secrets at
     rest; changing it forces all admins to set up their authenticator again.

Supabase only provides the password check (Supabase Auth) and the database/storage. The admin's second
sign-in factor is an **authenticator app** (TOTP), handled entirely by this server — **no email, SMTP or
Supabase email template is involved**.

## Admin sign-in (password + authenticator app)

Each admin signs in with their email and password, then a 6-digit code from **Google Authenticator** or
**Microsoft Authenticator** (any TOTP app works). The first time, the sign-in screen shows a QR code to scan;
after that it just asks for the current code. No email is sent, so a forwarding-only address like info@ is
fine, and there's nothing to configure in Supabase for it.

Lost phone / locked out: reset the authenticator and set it up again at the next sign-in.
- From the dashboard: **Admins & password → Reset authenticator** (the owner can reset anyone; anyone can
  reset their own).
- From the server (if the owner can't get in): `npm run reset-authenticator -- info@cube-software.com`

## Deploying on Vercel

The same code runs on Vercel as a single project:

| Part | Where it runs on Vercel |
|---|---|
| React site (`frontend/`) | Built to `frontend/build`, served from Vercel's CDN |
| Express API (`server/`) | One Vercel Function: `api/[...path].js` |
| Database, admin sign-in, images | Supabase, exactly as on your own server |

`vercel.json` wires this together. The function's file name is Vercel's catch-all convention, so every
`/api/...` path (including `/api/admin/login`) reaches Express with its original URL — no rewrite involved.
The root `package.json` exists only so Vercel installs the API's dependencies.

### Environment variables

Set these in **Vercel → your project → Settings → Environment Variables**, for **Production** (and Preview
if you use preview deployments). They are the same values as `server/.env`:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Supabase **Connect → Transaction pooler** URI (port 6543), with your database password |
| `DB_CA_CERT` | The **contents** of Supabase's certificate (Project Settings → Database → SSL Configuration → download, then paste the whole file). Required: Vercel has no disk to read a certificate file from, and Supabase's pooler uses a self-signed chain |
| `SUPABASE_URL` | Project Settings → Data API |
| `SUPABASE_ANON_KEY` | Project Settings → API Keys (anon / publishable) |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API Keys (service_role / secret) |
| `APP_SECRET` | The same long random string as in `server/.env`. If it differs, every admin has to set up their authenticator app again |
| `SITE_URL` | `https://www.cube-software.com`, or the `*.vercel.app` URL until the domain is live |
| `CRON_SECRET` | Any long random string; Vercel sends it to the nightly clean-up |
| `SMTP_*`, `SALES_EMAILS` | Only needed for booking/enquiry emails |

Vercel sets `NODE_ENV=production` itself — don't add it. Don't set `DB_CA_FILE` on Vercel; it's the
file-path version of `DB_CA_CERT` and there's no file to point at.

### The schema is not applied automatically on Vercel

On your own server the schema runs at start-up. Serverless cold-starts constantly, so that is switched off
there (`APPLY_SCHEMA`). After changing the schema, paste `server/supabase/schema.sql` into
**Supabase → SQL Editor → Run**. It is safe to run again.

### Nightly clean-up

`vercel.json` runs a cron at 02:00 UTC that calls `/api/cron/retention`, which does the automatic deletion
(old enquiries, consent records, analytics, security log). It only works once `CRON_SECRET` is set — without
it the route answers 401 and nothing is deleted.

### What behaves differently from your own server

- **Link-preview tags.** Pages come from the CDN, so `<title>`, the description and the `og:` tags are set
  in the browser rather than in the HTML. Google renders JavaScript and reads them; Facebook, LinkedIn and
  WhatsApp previews do not. To render them on the server instead, change the last rewrite in `vercel.json`
  to send pages to the function and add `frontend/build/index.html` to that function's `includeFiles`.
- **Rate limits** are counted per function instance rather than across the whole site, so a determined
  attacker gets somewhat more attempts. Account lockout (5 wrong passwords) is in the database and is exact.

### Deploy

Pushing to GitHub deploys automatically once the project is connected. From this folder you can also run:

```bash
npx vercel          # preview deployment
npx vercel --prod   # production
```

## Pointing the site at cube-software.com

Nothing in the code hardcodes the domain — it all comes from `SITE_URL`. When you're ready to go live:

| # | Where | What to do |
|---|---|---|
| 1 | **Vercel → Settings → Domains** | Add `cube-software.com` and `www.cube-software.com`, and pick which one is primary. Vercel creates the redirect between them for you and issues the HTTPS certificate. Add the DNS records it shows you at your domain registrar |
| 2 | **Vercel → Settings → Environment Variables** | Change `SITE_URL` to `https://www.cube-software.com` (match the primary you chose), then redeploy. This drives `sitemap.xml`, `robots.txt`, canonical links, the structured data and the links inside emails |
| 3 | **`server/.env`** | Change `SITE_URL` there too, if you also run the site on your own server |
| 4 | **`vercel.json` → `redirects`** | Your own page redirects: old URLs from the current site that no longer exist. See the example below |
| 5 | **Supabase → Authentication → URL Configuration** | Set **Site URL** to the live domain (used by password-reset emails). Admin sign-in itself uses the authenticator app and needs no redirect URLs |
| 6 | **Google Search Console** | Add the domain and submit `https://www.cube-software.com/sitemap.xml` |

Page redirects go in `vercel.json`, next to the rewrites — use `redirects` (the visitor's address bar
changes, which is what you want for old URLs) rather than `rewrites` (silent, used for internal routing):

```json
"redirects": [
  { "source": "/old-services", "destination": "/services/cloud-contact-center", "permanent": true },
  { "source": "/company/about-us", "destination": "/about", "permanent": true }
]
```

`permanent: true` is a 301 and tells Google the move is final; use `false` (307) if it's temporary. The
www↔apex redirect is **not** done here — Vercel's Domains screen handles that.

## First-time setup on Cube's server

```bash
# 1. Build the website
cd frontend
npm ci            # or: yarn install --frozen-lockfile
npm run build

# 2. Install the server
cd ../server
npm ci --omit=dev
# edit .env (see "Supabase setup" above, plus SITE_URL, SMTP_* and SALES_EMAILS)

# 3. Register the MASTER admin (owner). Permanent: can't be removed, and only it can add/remove admins.
#    A strong password is generated and saved only to server/data/admin-login.txt (git-ignored, mode 600).
npm run set-owner -- info@cube-software.com

# 4. Start
npm start                 # http://localhost:5000, then open /admin
```

Without `DATABASE_URL` (development only), the server uses a local test database in `server/data/pglite`
so the site can be tried before Supabase is ready; admin sign-in and uploads need the Supabase keys.

### Managing admins from the server (secure; can't be done from the dashboard)

```bash
npm run set-owner    -- info@cube-software.com   # make this email the master admin (owner); moves ownership
npm run create-admin -- staff@cube-software.com  # add a regular admin
npm run remove-admin -- staff@cube-software.com  # remove an admin (the owner is protected and can't be removed)
```

The master admin (owner) can't be removed, from the dashboard or even directly in the database (a trigger
blocks it). Ownership only moves with `set-owner` on the server, so a stolen admin login can never take over.
After the first sign-in, change the password in the dashboard (Admins & password) and delete
`server/data/admin-login.txt`.

### Database connection: session vs transaction pooler

`DATABASE_URL` points at Supabase's connection pooler. Use the **Transaction pooler** (host
`...pooler.supabase.com`, port **6543**) — it is the most widely reachable and this server is built for it.
The **Session pooler** (port 5432) also works where your network allows it. The direct database host
(`db.<ref>.supabase.co`) needs IPv6 and usually won't connect from a home/office network.

Keep it running with a service manager: `pm2 start npm --name cube -- start` on Linux or Windows, or a
systemd unit / Windows service.

### Put HTTPS in front

Run Nginx, IIS (with URL Rewrite + ARR) or Apache on the same machine. It should terminate HTTPS (for
example with Let's Encrypt) and forward everything to `http://127.0.0.1:5000`. Example Nginx:

```nginx
server {
  listen 443 ssl http2;
  server_name www.cube-software.com;
  # ssl_certificate ... ; ssl_certificate_key ... ;
  client_max_body_size 6m;          # image uploads are up to 5 MB
  location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
server { listen 80; server_name www.cube-software.com cube-software.com; return 301 https://www.cube-software.com$request_uri; }
```

Keep port 5000 closed to the internet (firewall); only the proxy should reach it. If the proxy runs on a
different machine, set `TRUST_PROXY` in `.env` to its IP address.

### Backups

Supabase backs up the database daily (Pro plan adds point-in-time recovery). To keep your own copy, or to
move to Cube's own Postgres:

```bash
pg_dump "$DATABASE_URL" --schema=public --no-owner > cube-$(date +%F).sql
```

## Admin dashboard

Open `/admin`. From there you can:

- see and manage **demo bookings** (mark completed or cancelled; cancelling frees the slot), export CSV
- see **enquiries** from the Contact page, export CSV
- run the **demo calendar**: block or reopen single slots, add one-off slots outside the weekly hours, close
  whole days. Slots close automatically once booked or less than the minimum notice away
- see **consent records**: every cookie choice, plus the Terms & Privacy agreement time and version stored
  on each booking and enquiry (CSV export for audits)
- write, edit, hide and delete **blog posts**
- **edit any text or image on the website**: "Edit the website", click the text or image, save for that page
  or every page; undo any edit from "Site content"
- upload and delete **images**
- set the **sales team emails**, demo hours (IST), session length, notice, booking window and holidays
- add or remove **admins** and change your password

## Security in place

- Every SQL statement uses bound parameters (no string-built SQL); tested with injection payloads.
- All form input is validated on the server (length, format, allowed values); unknown fields are dropped;
  line breaks are stripped from one-line fields so they can't inject email headers.
- Admin passwords are held by Supabase Auth, and only listed admins can sign in. Sessions are random tokens stored only as hashes, in an httpOnly,
  Secure, SameSite=Strict cookie; every admin change also needs a custom header (CSRF protection).
- 5 wrong passwords lock an account for 15 minutes; sign-in and forms are rate-limited per IP.
- Uploads: images only, checked by file content (not name), random file names, 5 MB limit, stored in a
  Storage bucket that also accepts only images. SVG is refused.
- Database: row-level security on every table with no public policies; the server's database connection is
  certificate-verified in production.
- Security headers via Helmet: strict Content-Security-Policy (no inline or third-party scripts), HSTS,
  no framing, referrer policy, permissions policy.
- Errors never show stack traces; `/admin` and `/api` are excluded from search engines.
- Run `npm test` here for the automated checks, and `npm audit` before each release.

## Privacy (DPDP Act 2023)

- Cookie notice on first visit; nothing optional runs before consent; equal "Accept" and "Reject";
  choices can be changed any time from "Cookie settings" in the bottom strip.
- Google Maps (which sets Google cookies) loads only with consent.
- Each consent choice is recorded (random id, choices, notice version, time) in the `consents` table.
- Forms require ticking agreement to the Terms and Privacy Policy; the time of consent is stored with each
  booking and enquiry.
- Before launch, have the legal team review the Terms and Privacy Policy wording and confirm the grievance
  officer's name and contact details.
