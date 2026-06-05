# NX Warden Telemetry Center

Phase 1 connects the public `/console/` observation layer to Cloudflare-native telemetry primitives. It stays read-only from the browser and does not add login, machine control, R2 media sync, public file serving, or download automation.

## Architecture

- Cloudflare Pages serves the public site and `/console/`.
- Cloudflare Pages Functions provide the API under `/api/*`.
- D1 stores structured telemetry history and audit logs.
- KV stores the latest node status cache for fast reads.
- R2 is intentionally deferred to a later phase.

## API Contract

```text
GET  /api/health
GET  /api/nodes
GET  /api/telemetry/recent?limit=10
POST /api/telemetry/ingest
```

`POST /api/telemetry/ingest` requires `INGEST_TOKEN` through either:

```text
Authorization: Bearer <token>
X-Ingest-Token: <token>
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
  "online_users": 4
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

Do not commit real ingest tokens to the repository or expose them in frontend code.

## Console Behavior

`/console/` fetches `/api/health`, `/api/nodes`, and `/api/telemetry/recent?limit=1`. If the API is unavailable, the UI falls back to mock telemetry and clearly shows `Backend mode: mock`.

The Telemetry Center card shows:

- latest node heartbeat
- latest CPU / memory / disk signal
- latest online users metric
- last ingest time
- backend mode: mock / live

## Cost Guard

- D1 stores small structured telemetry only.
- R2 media sync is intentionally deferred.
- No public file serving or download automation is enabled yet.

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
