const PUBLIC_NODE_PROFILES = [
  { id: "edge-node-01", name: "edge-node-01", provider: "Edge provider", region: "APAC" },
  { id: "archive-node-01", name: "archive-node-01", provider: "Hosting provider", region: "North America" },
  { id: "workflow-node-01", name: "workflow-node-01", provider: "Compute provider", region: "Europe" },
  { id: "signal-node-01", name: "signal-node-01", provider: "Observation provider", region: "Global" },
  { id: "monitor-node-01", name: "monitor-node-01", provider: "Monitoring provider", region: "Regional" },
  { id: "relay-node-01", name: "relay-node-01", provider: "Network provider", region: "Multi-region" }
];

function publicProfile(seed) {
  const text = String(seed || "node");
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(index)) >>> 0;
  }

  return PUBLIC_NODE_PROFILES[hash % PUBLIC_NODE_PROFILES.length];
}

function safeNumber(value) {
  return value === null || value === undefined ? null : value;
}

function safeVisibility(value) {
  const visibility = String(value || "protected").toLowerCase();

  if (visibility === "private") {
    return "protected";
  }

  return ["public", "protected", "monitored", "experimental", "gate"].includes(visibility)
    ? visibility
    : "protected";
}

export function sanitizeTelemetry(row = {}) {
  const profile = publicProfile(row.node_id || row.node_name || row.name || row.id);

  return {
    id: row.id ?? null,
    node_id: profile.id,
    node_name: profile.name,
    provider: profile.provider,
    region: profile.region,
    visibility: safeVisibility(row.visibility),
    cpu_percent: safeNumber(row.cpu_percent),
    memory_percent: safeNumber(row.memory_percent),
    disk_percent: safeNumber(row.disk_percent),
    temperature_c: safeNumber(row.temperature_c),
    online_users: safeNumber(row.online_users),
    created_at: row.created_at ?? null
  };
}

export function sanitizeNode(node = {}) {
  const profile = publicProfile(node.id || node.name);

  return {
    id: profile.id,
    name: profile.name,
    provider: profile.provider,
    region: profile.region,
    visibility: safeVisibility(node.visibility),
    created_at: node.created_at ?? null,
    latest: node.latest ? sanitizeTelemetry(node.latest) : null
  };
}
