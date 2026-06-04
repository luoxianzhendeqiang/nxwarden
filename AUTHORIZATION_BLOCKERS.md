# Authorization Blockers

This project is deployed and builds successfully, but a few account-side actions still need owner access.

## Current Green State

- Cloudflare Pages project: `nxwarden`
- Production URL: `https://nxwarden.pages.dev`
- Custom domains:
  - `https://nxwarden.com`
  - `https://www.nxwarden.com`
- Latest verified result: both custom domains return `200 OK`.
- Local branch: `main`
- Local commit: run `git log --oneline -1`

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

The local repository is initialized and committed, with remote set to:

```text
https://github.com/luoxianzhendeqiang/nxwarden.git
```

Push is blocked because:

- No existing `nxwarden` repository was found for `luoxianzhendeqiang`.
- Local GitHub HTTPS credentials are unavailable in unattended mode.
- The available GitHub connector can read repositories and write files to an existing repository, but does not expose repository creation in this session.

To finish GitHub:

1. Create a GitHub repository named `nxwarden` under `luoxianzhendeqiang`.
2. Authenticate Git locally with GitHub Credential Manager, GitHub CLI, or a scoped token.
3. Push:

```bash
git push -u origin main
```

## Vercel

Vercel deployment is optional for comparison because Cloudflare Pages is already live.

Vercel CLI was not authenticated locally. It started the device login flow and then hit a network `socket hang up`.

To deploy on Vercel after login:

```bash
npx vercel --prod
```

If the Vercel project should use the custom domain instead of Cloudflare Pages, move DNS only after confirming the Vercel deployment works. The current production domain already points to Cloudflare Pages.
