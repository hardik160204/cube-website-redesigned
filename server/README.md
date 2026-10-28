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
