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

function requestToken(request) {
  const bearer = request.headers.get("Authorization") || "";

  if (bearer.startsWith("Bearer ")) {
    return bearer.slice(7).trim();
  }

  return request.headers.get("X-Internal-Token") || "";
}

export function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const verbose = url.searchParams.get("verbose") === "1";
  const publicHealth = {
    ok: true,
    service: "nxwarden-telemetry",
    mode: "live",
    timestamp: new Date().toISOString()
  };

  if (!verbose) {
    return json(publicHealth);
  }

  const internalToken = env.INTERNAL_STATUS_TOKEN || env.INGEST_TOKEN;

  if (!internalToken || requestToken(request) !== internalToken) {
    return json({ error: "Unauthorized health detail request." }, { status: 401 });
  }

  return json({
    ...publicHealth,
    bindings: {
      d1: Boolean(env.DB),
      kv: Boolean(env.NXWARDEN_TELEMETRY_KV || env.TELEMETRY_KV),
      ingestToken: Boolean(env.INGEST_TOKEN),
      turnstile: Boolean(env.TURNSTILE_SECRET_KEY)
    },
    security: {
      turnstileMode: String(env.TURNSTILE_SECRET_KEY || "").startsWith("1x000")
        ? "test"
        : env.TURNSTILE_SECRET_KEY
          ? "production"
          : "missing",
      ingestRequiresTurnstile: true
    }
  });
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: jsonHeaders });
}
