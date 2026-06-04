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

## Supabase

The public contact form writes to `public.site_submissions`.

1. Confirm the Supabase project URL in `.env` and `env.production`.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Keep service role keys out of this repository.

The app intentionally has no user authentication. Anonymous visitors can submit the form, but cannot read submissions.
If the Supabase URL is unreachable, the form falls back to a friendly email prompt instead of exposing the raw browser fetch error.

## Cloudflare Pages

Project: `nxwarden`

```bash
npx wrangler pages deploy out --project-name nxwarden --branch main --commit-dirty=true
```

Custom domain DNS records:

```text
nxwarden.com      CNAME    nxwarden.pages.dev    Proxied
www.nxwarden.com  CNAME    nxwarden.pages.dev    Proxied
```

Root records use `@` in the Cloudflare DNS name field.
