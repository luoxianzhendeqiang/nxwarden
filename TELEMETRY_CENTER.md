# NX Warden Telemetry Center

Phase 2 connects the public `/console/` observation layer to Cloudflare-native telemetry primitives and adds Turnstile verification to public write intake. Phase 3 begins with a deliberately locked interaction shell: the interface can describe future actions, but it cannot execute machine commands. There is still no login, real machine control, R2 media sync, public file serving, or download automation.

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
POST /api/node/:id/action
```

`POST /api/telemetry/ingest` requires both `INGEST_TOKEN` and a Cloudflare Turnstile token.

`POST /api/node/:id/action` is a Phase 3 contract placeholder. It accepts only
the documented mock action names and always returns `423 Locked`. It does not
read secrets, contact a node, enqueue work, or update D1/KV.

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

Future node action payload:

```json
{
  "action": "restart-service"
}
```

Supported placeholder action names:

```text
restart-service
trigger-automation
update-configuration
```

All currently return:

```json
{
  "ok": false,
  "armed": false,
  "mode": "mock",
  "error": "Control plane is not armed."
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

The Phase 3 preview adds:

- provider, region, and health filters on the infrastructure map
- alert focus links from Risk Radar to affected map nodes
- expandable timeline events and black-box decisions
- a Control mode with disabled action buttons and explanatory tooltips
- a locked action API contract for future protected commands

On mobile, mission modes remain horizontally scrollable, map filters collapse
to one column, and the locked control cards use a single-column layout.

## Phase 2 Verification

Verified on 2026-06-07:

- D1 tables: `nodes`, `telemetry`, `audit_logs`, `system_events`
- KV key pattern: `node:{node_id}:latest`
- public health response exposes only safe service status
- missing or invalid ingest token returns `401`
- valid ingest token without valid Turnstile returns `403`
- recent telemetry queries are capped at 50 rows
- ingest request bodies are capped at 16 KiB

The current Turnstile test key pair is suitable only for Phase 2 validation.
Replace both site key and secret with a matched production widget before a
real node agent is enrolled.

## Control Plane Boundary

Cloudflare Access and mTLS are prerequisites for any future real command path:

1. Access authenticates the human operator and applies identity policy.
2. mTLS identifies an enrolled node or trusted client device.
3. A command Worker checks per-user and per-node authorization.
4. Every accepted command is written to an audit trail.
5. The node agent validates a short-lived signed command before execution.

Access and mTLS protect web management and API traffic. They do not replace
the TLS certificate used by Hysteria2 and do not proxy or accelerate its UDP
transport.

## Rate Limit Notes

No real command endpoint is armed. Before public node enrollment:

- apply a Cloudflare rate limit to telemetry ingest per source and token
- cap each node to a conservative heartbeat cadence
- reject stale timestamps and replayed request identifiers
- rotate ingest credentials per node instead of sharing one fleet token
- add command-specific limits and a manual kill switch

## Cost Guard

- D1 stores small structured telemetry only.
- KV stores latest heartbeat cache only.
- R2 media sync is intentionally deferred.
- No public file serving or download automation is enabled yet.
- `/console/` has no enabled write action.
- The mock action API is locked and performs no mutation.

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
