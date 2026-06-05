const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8"
};

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init.headers || {})
    }
  });
}

export function onRequestGet({ env }) {
  return json({
    ok: true,
    service: "nxwarden-telemetry",
    mode: "live",
    bindings: {
      d1: Boolean(env.DB),
      kv: Boolean(env.NXWARDEN_TELEMETRY_KV || env.TELEMETRY_KV),
      ingestToken: Boolean(env.INGEST_TOKEN)
    },
    timestamp: new Date().toISOString()
  });
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: jsonHeaders });
}
