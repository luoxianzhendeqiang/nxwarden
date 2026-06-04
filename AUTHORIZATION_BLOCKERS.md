# Authorization Blockers

This project is deployed, builds successfully, and is pushed to GitHub. A few account-side actions still need owner access.

## Current Green State

- Cloudflare Pages project: `nxwarden`
- Production URL: `https://nxwarden.pages.dev`
- Custom domains:
  - `https://nxwarden.com`
  - `https://www.nxwarden.com`
- Contact email: `ceo@nxwarden.com`
- Latest verified result: both custom domains return `200 OK`.
- Local branch: `main`
- Local commit: run `git log --oneline -1`
- GitHub repository: `https://github.com/luoxianzhendeqiang/nxwarden`

## Supabase

Current `.env` and `env.production` point to:

```text
NEXT_PUBLIC_SUPABASE_URL=https://hjkvkaybcdcnvxacibkp.supabase.co
```

That host currently returns `NXDOMAIN` from public DNS, including `1.1.1.1`.

To finish Supabase:

1. Open the Supabase project dashboard.
2. Copy the exact Project URL from Project Settings.
3. Replace `NEXT_PUBLIC_SUPABASE_URL` in `.env` and `env.production`.
4. Run `supabase/schema.sql` in the Supabase SQL editor.
5. Rebuild and redeploy:

```bash
npm run build
npx wrangler pages deploy out --project-name nxwarden --branch main --commit-dirty=true
```

The current public key is a publishable key and is safe for browser use. Do not commit service role keys.

## GitHub

GitHub push is complete.

```text
https://github.com/luoxianzhendeqiang/nxwarden.git
```

GitHub email privacy is off and `ceo@nxwarden.com` is verified, so repository commits can use:

```text
Luo <ceo@nxwarden.com>
```

## Vercel

Vercel deployment is optional for comparison because Cloudflare Pages is already live.

Vercel CLI was not authenticated locally. It started the device login flow and then hit a network `socket hang up`.

To deploy on Vercel after login:

```bash
npx vercel --prod
```

If the Vercel project should use the custom domain instead of Cloudflare Pages, move DNS only after confirming the Vercel deployment works. The current production domain already points to Cloudflare Pages.
