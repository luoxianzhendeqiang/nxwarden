# Authorization Blockers

This project is deployed, builds successfully, and is pushed to GitHub. No Cloudflare D1 blocker is currently open.

## Current Green State

- Cloudflare Pages project: `nxwarden`
- Production URL: `https://nxwarden.pages.dev`
- Custom domains:
  - `https://nxwarden.com`
  - `https://www.nxwarden.com`
- Contact email: `ceo@nxwarden.com`
- Reserved login page: `https://nxwarden.com/login/`
- D1 database: `nxwarden-db`
- D1 binding: `DB`
- Contact API: `https://nxwarden.com/api/contact` accepts `POST`
- Latest verified result: both custom domains return `200 OK`.
- Local branch: `main`
- Local commit: run `git log --oneline -1`
- GitHub repository: `https://github.com/luoxianzhendeqiang/nxwarden`

## Cloudflare D1

The Supabase intake path was replaced by Cloudflare Pages Functions + D1.

Database:

```text
Name: nxwarden-db
ID: e11978a6-ebc5-487e-847a-d5c99a4ab5cf
Binding: DB
```

Verified:

- Local Pages dev POST returned `{ "ok": true }`.
- Production POST to `https://nxwarden.com/api/contact` returned `{ "ok": true }`.
- Remote D1 query confirmed the inserted row, then the test row was deleted.

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
