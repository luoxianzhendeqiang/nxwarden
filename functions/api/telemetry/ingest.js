import { verifyTurnstile } from "../_shared/turnstile.js";

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

function cleanText(value, maxLength) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function cleanNodeId(value) {
  const id = cleanText(value, 80);
  return /^[a-zA-Z0-9_.-]+$/.test(id) ? id : "";
}

function cleanVisibility(value) {
  const visibility = cleanText(value, 24).toLowerCase();
  return ["public", "private", "monitored", "experimental", "gate"].includes(visibility)
    ? visibility
    : "private";
}

function optionalPercent(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return null;
  }

  return Math.max(0, Math.min(100, numeric));
}

function optionalTemperature(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return null;
  }

  return Math.max(-50, Math.min(150, numeric));
}

function optionalUsers(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return null;
  }

  return Math.max(0, Math.floor(numeric));
}

function requestToken(request) {
  const bearer = request.headers.get("Authorization") || "";

  if (bearer.startsWith("Bearer ")) {
    return bearer.slice(7).trim();
  }

  return request.headers.get("X-Ingest-Token") || "";
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) {
    return json({ error: "D1 database binding is missing." }, { status: 500 });
  }

  if (!env.INGEST_TOKEN) {
    return json({ error: "INGEST_TOKEN is not configured." }, { status: 503 });
  }

  if (requestToken(request) !== env.INGEST_TOKEN) {
    return json({ error: "Unauthorized ingest request." }, { status: 401 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, { status: 400 });
  }

  const turnstile = await verifyTurnstile({ body, env, request });

  if (!turnstile.ok) {
    return json(
      {
        error: turnstile.error,
        details: turnstile.details || undefined
      },
      { status: turnstile.status }
    );
  }

  const nodeId = cleanNodeId(body.node_id || body.node?.id);

  if (!nodeId) {
    return json({ error: "node_id is required and may only contain letters, numbers, dots, dashes, and underscores." }, { status: 400 });
  }

  const node = body.node || {};
  const nodeName = cleanText(node.name || body.node_name || nodeId, 120) || nodeId;
  const provider = cleanText(node.provider || body.provider, 80) || null;
  const region = cleanText(node.region || body.region, 80) || null;
  const visibility = cleanVisibility(node.visibility || body.visibility);
  const createdAt = cleanText(body.created_at, 40) || new Date().toISOString();
  const telemetry = {
    node_id: nodeId,
    node_name: nodeName,
    provider,
    region,
    visibility,
    cpu_percent: optionalPercent(body.cpu_percent),
    memory_percent: optionalPercent(body.memory_percent),
    disk_percent: optionalPercent(body.disk_percent),
    temperature_c: optionalTemperature(body.temperature_c),
    online_users: optionalUsers(body.online_users),
    created_at: createdAt
  };

  await env.DB.prepare(
    `insert into nodes (id, name, provider, region, visibility)
     values (?, ?, ?, ?, ?)
     on conflict(id) do update set
       name = excluded.name,
       provider = excluded.provider,
       region = excluded.region,
       visibility = excluded.visibility`
  )
    .bind(nodeId, nodeName, provider, region, visibility)
    .run();

  const insertResult = await env.DB.prepare(
    `insert into telemetry
       (node_id, cpu_percent, memory_percent, disk_percent, temperature_c, online_users, created_at)
     values (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      nodeId,
      telemetry.cpu_percent,
      telemetry.memory_percent,
      telemetry.disk_percent,
      telemetry.temperature_c,
      telemetry.online_users,
      telemetry.created_at
    )
    .run();

  const telemetryId = insertResult.meta?.last_row_id || null;
  const latest = {
    ...telemetry,
    id: telemetryId
  };
  const kv = env.NXWARDEN_TELEMETRY_KV || env.TELEMETRY_KV || null;

  if (kv) {
    await kv.put(`node:${nodeId}:latest`, JSON.stringify(latest));
  }

  await env.DB.prepare(
    `insert into audit_logs (source, event_type, message)
     values (?, ?, ?)`
  )
    .bind("telemetry-ingest", "telemetry.received", `Telemetry received for ${nodeId}`)
    .run();

  await env.DB.prepare(
    `insert into system_events (source, event_type, message, severity)
     values (?, ?, ?, ?)`
  )
    .bind("telemetry-ingest", "node.heartbeat", `Heartbeat stored for ${nodeId}`, "info")
    .run();

  return json({
    ok: true,
    node: {
      id: nodeId,
      name: nodeName,
      provider,
      region,
      visibility
    },
    telemetry: latest,
    cached: Boolean(kv)
  });
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: jsonHeaders });
}
