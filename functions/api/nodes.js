import { sanitizeNode } from "./_shared/public-telemetry.js";

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

async function latestForNode(kv, nodeId) {
  if (!kv) {
    return null;
  }

  const cached = await kv.get(`node:${nodeId}:latest`);

  if (!cached) {
    return null;
  }

  try {
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

export async function onRequestGet({ env }) {
  if (!env.DB) {
    return json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  const kv = env.NXWARDEN_TELEMETRY_KV || env.TELEMETRY_KV || null;
  const result = await env.DB.prepare(
    `select id, name, provider, region, visibility, created_at
     from nodes
     order by created_at asc`
  ).all();

  const nodes = await Promise.all(
    (result.results || []).map(async (node) => ({
      ...node,
      latest: await latestForNode(kv, node.id)
    }))
  );

  return json({
    ok: true,
    nodes: nodes.map(sanitizeNode),
    timestamp: new Date().toISOString()
  });
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: jsonHeaders });
}
