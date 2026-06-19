const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8"
};

const supportedActions = new Set([
  "restart-service",
  "trigger-automation",
  "update-configuration"
]);

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init.headers || {})
    }
  });
}

function cleanNodeId(value) {
  const nodeId = String(value || "").trim().slice(0, 80);
  return /^[a-zA-Z0-9_.-]+$/.test(nodeId) ? nodeId : "";
}

export async function onRequestPost({ params, request }) {
  const nodeId = cleanNodeId(params.id);

  if (!nodeId) {
    return json({ error: "Invalid node identifier." }, { status: 400 });
  }

  const contentLength = Number(request.headers.get("Content-Length") || 0);

  if (Number.isFinite(contentLength) && contentLength > 4_096) {
    return json({ error: "Request body is too large." }, { status: 413 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, { status: 400 });
  }

  const action = String(body?.action || "").trim();

  if (!supportedActions.has(action)) {
    return json(
      {
        error: "Unsupported mock action.",
        supported_actions: Array.from(supportedActions)
      },
      { status: 400 }
    );
  }

  return json(
    {
      ok: false,
      armed: false,
      mode: "mock",
      node_id: nodeId,
      requested_action: action,
      error: "Protected actions are not armed.",
      requirements: [
        "Protected identity boundary",
        "Device trust",
        "per-user authorization",
        "audited action path"
      ],
      timestamp: new Date().toISOString()
    },
    { status: 423 }
  );
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: jsonHeaders });
}
