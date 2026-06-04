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

## Cloudflare R2

R2 is optional for the current homepage, but it is the right place for future blog images, Markdown source files, downloads, and generated media. The reference blog project uses R2 for file/object storage while D1 stores relational data; NX Warden follows the same split once R2 is enabled.

Planned bucket:

```text
Name: nxwarden-assets
Binding: ASSETS
```

Current account state:

```text
R2 is not enabled yet. Wrangler returns: Please enable R2 through the Cloudflare Dashboard. [code: 10042]
```

After R2 is enabled in the Cloudflare Dashboard, create the bucket and copy the example binding into `wrangler.toml`:

```bash
npx wrangler r2 bucket create nxwarden-assets
```

See `wrangler.r2.example.toml` for the binding block.

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
