# NX Warden Telemetry Center

Phase 2 connects the public `/console/` observation layer to Cloudflare-native telemetry primitives and adds Turnstile verification to public write intake. It stays read-only from the browser and does not add login, machine control, R2 media sync, public file serving, or download automation.

## Architecture

- Cloudflare Pages serves the public site and `/console/`.
- Cloudflare Pages Functions provide the API under `/api/*`.
- D1 stores structured telemetry history, audit logs, and system events.
- KV stores the latest node status cache for fast reads.
- R2 is intentionally deferred to a later phase.

## API Contract

```text
GET  /api/health
GET  /api/health?verbose=1
GET  /api/nodes
GET  /api/telemetry/recent?limit=10
POST /api/telemetry/ingest
```

`POST /api/telemetry/ingest` requires both `INGEST_TOKEN` and a Cloudflare Turnstile token.

The default health response is public-safe and only returns `ok`, `service`,
`mode`, and `timestamp`. Detailed binding and security state is available from
`/api/health?verbose=1` only when an internal bearer token or
`X-Internal-Token` is supplied. The current fallback internal token is
`INGEST_TOKEN`.

`INGEST_TOKEN` can be supplied through either:

```text
Authorization: Bearer <token>
X-Ingest-Token: <token>
```

Turnstile can be supplied through either:

```text
cf_turnstile_response
cf-turnstile-response
turnstile_token
X-Turnstile-Token
```

Example payload:

```json
{
  "node_id": "xueer",
  "node": {
    "name": "Xueer VPS",
    "provider": "CloudCone",
    "region": "LA",
    "visibility": "private"
  },
  "cpu_percent": 8,
  "memory_percent": 43,
  "disk_percent": 14,
  "temperature_c": null,
  "online_users": 4,
  "cf_turnstile_response": "<turnstile-token>"
}
```

## Bindings

```text
D1 binding: DB
D1 database: nxwarden-db
KV binding: NXWARDEN_TELEMETRY_KV
KV namespace id: 888ce639a51d49cdaf9be8ed515c7ebb
Latest cache key: node:{node_id}:latest
```

Apply or update the D1 schema:

```bash
npx wrangler d1 execute nxwarden-db --remote --file d1/schema.sql
```

Set the ingest secret for Cloudflare Pages:

```bash
npx wrangler pages secret put INGEST_TOKEN --project-name nxwarden
```

Set the Turnstile secret for Cloudflare Pages:

```bash
npx wrangler pages secret put TURNSTILE_SECRET_KEY --project-name nxwarden
```

Do not commit real ingest tokens or Turnstile secrets to the repository or expose them in frontend code.

For Phase 2 testing, the frontend falls back to Cloudflare's always-pass test
sitekey. TODO before real public ingest: replace
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` with a matched
production Turnstile widget key pair.

## Console Behavior

`/console/` fetches `/api/health`, `/api/nodes`, and `/api/telemetry/recent?limit=24`. If the API is unavailable or no real node data is present, the UI falls back to mock telemetry while preserving the read-only dashboard shell.

The Phase 2 Telemetry Center shows:

- active nodes
- CPU / memory / disk averages
- temperature and online users
- last ingest time
- backend mode: mock / live
- 24-hour heartbeat trend
- risk radar, system memory, and access posture

## Cost Guard

- D1 stores small structured telemetry only.
- KV stores latest heartbeat cache only.
- R2 media sync is intentionally deferred.
- No public file serving or download automation is enabled yet.
- No write actions exist in `/console/`.

## R2 Phase 2 Guardrails

R2 should only be added after Telemetry Center is stable.

1. Default private bucket, no public listing.
2. All downloads use short-lived signed URLs.
3. Daily upload cap, for example 2GB or 5GB per day.
4. Lifecycle policy deletes temporary cache after 7 or 14 days.
5. Hash file names so original sources are not exposed.
6. Store only files NX Warden has rights to retain.
7. Frontend shows indexes only, never raw bucket listing.
8. Worker adds rate limiting and token checks.
