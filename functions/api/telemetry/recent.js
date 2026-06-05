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

function readLimit(request) {
  const url = new URL(request.url);
  const parsed = Number(url.searchParams.get("limit") || 10);

  if (!Number.isFinite(parsed)) {
    return 10;
  }

  return Math.max(1, Math.min(50, Math.floor(parsed)));
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) {
    return json({ error: "D1 database binding is missing." }, { status: 500 });
  }

  const limit = readLimit(request);
  const result = await env.DB.prepare(
    `select
       telemetry.id,
       telemetry.node_id,
       nodes.name as node_name,
       nodes.provider,
       nodes.region,
       nodes.visibility,
       telemetry.cpu_percent,
       telemetry.memory_percent,
       telemetry.disk_percent,
       telemetry.temperature_c,
       telemetry.online_users,
       telemetry.created_at
     from telemetry
     left join nodes on nodes.id = telemetry.node_id
     order by telemetry.created_at desc
     limit ?`
  )
    .bind(limit)
    .all();

  return json({
    ok: true,
    telemetry: result.results || [],
    limit,
    timestamp: new Date().toISOString()
  });
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: jsonHeaders });
}
