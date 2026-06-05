# NX Warden

NX Warden is a luminous personal company site for infrastructure systems, media automation, monitoring, and AI workflows.

Contact: `ceo@nxwarden.com`

## Versions

- Dynamic Next.js version: `app/`
- Original static version kept for comparison: `index.html`, `styles.css`, `script.js`
- Generated hero asset: `public/assets/blackhole-hero.png`
- Reserved operator entry: `/login/`

## Local Development

```bash
npm install
npm run dev
```

Production static export:

```bash
npm run build
```

The exported site is written to `out/` and deployed to Cloudflare Pages.

## Cloudflare D1

The public contact form writes to the Cloudflare D1 table `contact_submissions` through the Pages Function at `/api/contact`.

Telemetry Center also uses D1 for small structured observation records:

- `nodes`
- `telemetry`
- `audit_logs`
- `system_events`

Database:

```text
Name: nxwarden-db
Binding: DB
ID: e11978a6-ebc5-487e-847a-d5c99a4ab5cf
```

Initialize or update the schema:

```bash
npx wrangler d1 execute nxwarden-db --remote --file d1/schema.sql
```

The app intentionally has no user authentication. Anonymous visitors can submit the form, but cannot read submissions from the public site.

## Telemetry Center

`/console/` reads from Cloudflare Pages Functions and falls back to mock telemetry when the API is unavailable.

Routes:

```text
GET  /api/health
GET  /api/nodes
GET  /api/telemetry/recent
POST /api/telemetry/ingest
```

The ingest route is protected by the server-side `INGEST_TOKEN` secret and Cloudflare Turnstile verification. The public contact form also posts through Turnstile. See `TELEMETRY_CENTER.md` for the API contract, KV cache key format, and R2 Phase 2 guardrails.

## Cloudflare R2

R2 is optional for the current homepage, but it is the right place for future blog images, Markdown source files, downloads, and generated media. The reference blog project uses R2 for file/object storage while D1 stores relational data; NX Warden follows the same split once R2 is enabled.

Planned bucket:

```text
Name: nxwarden-assets
Binding: NXWARDEN_ASSETS
```

Current account state:

```text
Bucket created on 2026-06-04.
```

If the bucket ever needs to be recreated, use:

```bash
npx wrangler r2 bucket create nxwarden-assets
```

The production binding is configured in `wrangler.toml`. See `wrangler.r2.example.toml` as a copyable reference.

## Cloudflare Pages

Project: `nxwarden`

```bash
npx wrangler pages deploy out --project-name nxwarden --branch main --commit-dirty=true
```

The D1 binding is configured in `wrangler.toml`.

Custom domain DNS records:

```text
nxwarden.com      CNAME    nxwarden.pages.dev    Proxied
www.nxwarden.com  CNAME    nxwarden.pages.dev    Proxied
```

Root records use `@` in the Cloudflare DNS name field.
