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
