"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Archive,
  Bot,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Cloud,
  Code2,
  Database,
  FileClock,
  Filter,
  Gauge,
  GitBranch,
  Globe2,
  HardDrive,
  KeyRound,
  Lock,
  MailCheck,
  MonitorCheck,
  Play,
  RadioTower,
  RotateCcw,
  Server,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TerminalSquare,
  Wrench,
  X
} from "lucide-react";

type Tone = "green" | "gold" | "blue" | "red" | "purple";

type MapNode = {
  endpoint: string;
  health: "online" | "offline" | "attention";
  icon: typeof Globe2;
  id: string;
  lastCheck: string;
  name: string;
  nextAction: string;
  provider: string;
  region: string;
  riskNote: string;
  signal: string;
  status: string;
  visibility: string;
};

type MissionEvent = {
  detail: string;
  id: string;
  label: string;
  phase: string;
  time: string;
};

type DecisionLog = {
  detail: string;
  id: string;
  label: string;
  phase: string;
};

type ApiNode = {
  created_at?: string;
  id: string;
  latest?: unknown;
  name: string;
  provider?: string | null;
  region?: string | null;
  visibility?: string | null;
};

type ApiTelemetry = {
  cpu_percent?: number | null;
  created_at?: string | null;
  disk_percent?: number | null;
  id?: number | null;
  memory_percent?: number | null;
  node_id?: string | null;
  node_name?: string | null;
  online_users?: number | null;
  provider?: string | null;
  region?: string | null;
  temperature_c?: number | null;
  visibility?: string | null;
};

type HealthPayload = {
  mode?: string;
  timestamp?: string;
};

type NodeSignal = {
  cpu: number | null;
  disk: number | null;
  id: string;
  lastSeen: string;
  memory: number | null;
  name: string;
  observedChecks: number | null;
  provider: string;
  region: string;
  status: string;
  temperature: number | null;
  visibility: string;
};

type TrendPoint = {
  cpu: number;
  disk: number;
  label: string;
  memory: number;
};

type TelemetryState = {
  backendLabel: string;
  lastIngest: string;
  lastUpdate: string;
  mode: "live" | "mock";
  nodes: NodeSignal[];
  protectionLabel: string;
  trend: TrendPoint[];
};

const consoleTabs = [
  { id: "signal", label: "Signal" },
  { id: "map", label: "Map" },
  { id: "loops", label: "Loops" },
  { id: "memory", label: "Memory" },
  { id: "gate", label: "Gate" },
  { id: "telemetry", label: "Telemetry" },
  { id: "control", label: "Control" }
];

const fallbackTelemetryNodes: NodeSignal[] = [
  {
    cpu: 18,
    disk: 28,
    id: "edge-node-01",
    lastSeen: "18:24:31",
    memory: 32,
    name: "edge-node-01",
    observedChecks: 56,
    provider: "Sample edge",
    region: "Public-safe sample",
    status: "Online",
    temperature: 41,
    visibility: "protected"
  },
  {
    cpu: 42,
    disk: 36,
    id: "archive-node-01",
    lastSeen: "18:24:28",
    memory: 48,
    name: "archive-node-01",
    observedChecks: 38,
    provider: "Sample archive",
    region: "Public-safe sample",
    status: "Online",
    temperature: 47,
    visibility: "protected"
  },
  {
    cpu: 26,
    disk: 49,
    id: "workflow-node-01",
    lastSeen: "18:24:29",
    memory: 44,
    name: "workflow-node-01",
    observedChecks: 34,
    provider: "Sample workflow",
    region: "Public-safe sample",
    status: "Online",
    temperature: 38,
    visibility: "protected"
  }
];

const mockTrend: TrendPoint[] = [
  { label: "18:00", cpu: 22, memory: 54, disk: 23 },
  { label: "20:00", cpu: 31, memory: 47, disk: 20 },
  { label: "22:00", cpu: 27, memory: 50, disk: 24 },
  { label: "00:00", cpu: 62, memory: 43, disk: 26 },
  { label: "02:00", cpu: 41, memory: 48, disk: 25 },
  { label: "04:00", cpu: 66, memory: 51, disk: 27 },
  { label: "06:00", cpu: 52, memory: 44, disk: 30 },
  { label: "08:00", cpu: 49, memory: 43, disk: 28 },
  { label: "10:00", cpu: 45, memory: 39, disk: 24 },
  { label: "12:00", cpu: 37, memory: 33, disk: 18 },
  { label: "14:00", cpu: 42, memory: 35, disk: 21 },
  { label: "18:00", cpu: 63, memory: 51, disk: 38 }
];

const initialTelemetry: TelemetryState = {
  backendLabel: "mock",
  lastIngest: "18:24:31",
  lastUpdate: "Just now",
  mode: "mock",
  nodes: fallbackTelemetryNodes,
  protectionLabel: "protected intake",
  trend: mockTrend,
};

const truthSources = [
  {
    label: "Observation API",
    value: "Public-safe",
    detail: "Only low-sensitivity sample metrics and checks are shown when the API is reachable.",
    tone: "green" as Tone
  },
  {
    label: "Visual mock",
    value: "Architecture only",
    detail: "Map nodes explain the intended system shape and are never counted as live machines.",
    tone: "blue" as Tone
  },
  {
    label: "Local diagnostics",
    value: "Recorded evidence",
    detail: "Mobile diagnostics describe completed local tests, not a live phone connection.",
    tone: "gold" as Tone
  }
];

const mobileConnectivityDiagnostics = [
  {
    label: "Mobile profile",
    value: "Starts / latency present",
    detail: "Real browsing is still failing on the test phone."
  },
  {
    label: "Server path",
    value: "HTTP 204 verified",
    detail: "The repaired secure transport path completed a controlled request."
  },
  {
    label: "Repair state",
    value: "Compatibility layer aligned",
    detail: "The required connection compatibility layer and bootstrap resolver are present."
  },
  {
    label: "Current blocker",
    value: "Mobile routing matrix",
    detail: "Device routing, name resolution, and mobile-network variants still need matrix testing."
  },
  {
    label: "Edge listener",
    value: "Not primary cause",
    detail: "Listener, certificate timing, and server-side transport posture passed prior checks."
  },
  {
    label: "Connectivity warnings",
    value: "Non-blocking",
    detail: "Basic reachability warnings do not explain browser resolution failure."
  }
];

const domainMailDiagnostics = [
  {
    label: "Receive path",
    value: "Existing route preserved",
    detail: "The current inbound route remains unchanged during local hardening."
  },
  {
    label: "Send path",
    value: "Not armed",
    detail: "No outbound sender, test message, or delivery cutover was performed."
  },
  {
    label: "Mail readiness UI",
    value: "Built locally",
    detail: "The frontend and Worker bundle are available for review before approval."
  },
  {
    label: "Sender boundary",
    value: "Protected setting only",
    detail: "Sensitive sender settings are never returned to the browser."
  },
  {
    label: "Mail posture",
    value: "Unchanged",
    detail: "No routing, mailbox, or Cloudflare resource was modified."
  },
  {
    label: "Administration",
    value: "Protected workflow",
    detail: "Mailbox creation and delivery tests remain outside this public console."
  }
];

const pulseCards = [
  {
    icon: Activity,
    label: "Mission Pulse",
    value: "Observation",
    body: "Public edge is online, protected systems are sealed, and no write actions are armed.",
    tone: "green" as Tone
  },
  {
    icon: ShieldCheck,
    label: "Access Posture",
    value: "Read only",
    body: "Cloudflare protects the edge. Control actions remain outside this public layer.",
    tone: "blue" as Tone
  },
  {
    icon: Server,
    label: "Infrastructure Map",
    value: "4 layers",
    body: "Public Edge, Pages, Access Boundary, and Protected Systems are shown as a high-level topology.",
    tone: "gold" as Tone
  },
  {
    icon: FileClock,
    label: "Telemetry Phase",
    value: "Phase 2",
    body: "Sample signals and structured history stay inside the observation layer.",
    tone: "purple" as Tone
  }
];

const infrastructureNodes: MapNode[] = [
  {
    endpoint: "nxwarden.com",
    health: "online",
    icon: Globe2,
    id: "public-edge",
    lastCheck: "Public domain confirmed on Cloudflare Pages",
    name: "Public Edge",
    nextAction: "Keep this as the clean public surface for NX Warden.",
    provider: "Public edge",
    region: "Global",
    riskNote: "Public content is safe to expose; no control actions belong here.",
    signal: "Visitor-facing entry",
    status: "Online",
    visibility: "Public"
  },
  {
    endpoint: "nxwarden.pages.dev / nxwarden.com",
    health: "online",
    icon: Cloud,
    id: "cloudflare-pages",
    lastCheck: "Current public release recorded",
    name: "Cloudflare Pages",
    nextAction: "Use Pages plus Functions as the observation edge.",
    provider: "Public edge",
    region: "Global",
    riskNote: "Pages should receive public UI and observation endpoints, not machine-control access data.",
    signal: "Edge deployment",
    status: "Serving",
    visibility: "Public"
  },
  {
    endpoint: "Future Cloudflare Access boundary",
    health: "attention",
    icon: ShieldCheck,
    id: "access-boundary",
    lastCheck: "Not wired by design",
    name: "Access Boundary",
    nextAction: "Create protected /control only after the observation layer is stable.",
    provider: "Access boundary",
    region: "Global",
    riskNote: "Auth is not armed. Keep the current console read-only and harmless.",
    signal: "Safety gate",
    status: "Planned",
    visibility: "Gate"
  },
  {
    endpoint: "Protected service group",
    health: "online",
    icon: Server,
    id: "protected-systems",
    lastCheck: "Represented as static topology plus telemetry signals",
    name: "Protected Systems",
    nextAction: "Only heartbeat data should enter this public console.",
    provider: "Protected group",
    region: "Redacted scope",
    riskNote: "Protected services need Access before any future action layer is connected.",
    signal: "Sealed systems",
    status: "Sealed",
    visibility: "Protected"
  }
];

const protectedServices: MapNode[] = [
  {
    endpoint: "Protected compute group",
    health: "online",
    icon: Cloud,
    id: "edge-hosting",
    lastCheck: "Telemetry sample available",
    name: "Edge Hosting",
    nextAction: "Send only lightweight heartbeat data from hosted service scripts.",
    provider: "Protected app",
    region: "Redacted scope",
    riskNote: "Do not expose shell logs, internal paths, or control actions.",
    signal: "Sample compute",
    status: "Observed",
    visibility: "Protected"
  },
  {
    endpoint: "Regional compute group",
    health: "online",
    icon: Server,
    id: "regional-hosting",
    lastCheck: "Telemetry sample available",
    name: "Regional Hosting",
    nextAction: "Keep automation and file services behind current service rules.",
    provider: "Protected app",
    region: "Redacted scope",
    riskNote: "Ingest should stay token and Turnstile protected.",
    signal: "Sample compute",
    status: "Observed",
    visibility: "Protected"
  },
  {
    endpoint: "Fleet monitor field",
    health: "online",
    icon: Gauge,
    id: "fleet-monitor",
    lastCheck: "Dashboard visual source",
    name: "Fleet Monitor",
    nextAction: "Map monitor data into normalized telemetry later.",
    provider: "Monitor group",
    region: "Redacted scope",
    riskNote: "Public metric labels should stay bland and non-sensitive.",
    signal: "Fleet monitor",
    status: "Watching",
    visibility: "Monitored"
  },
  {
    endpoint: "Protected connectivity group",
    health: "online",
    icon: RadioTower,
    id: "connectivity",
    lastCheck: "No direct control wired",
    name: "Connectivity Layer",
    nextAction: "Keep protected routing domains on the approved posture.",
    provider: "Connectivity group",
    region: "Redacted scope",
    riskNote: "Never expose live connectivity access data in this console.",
    signal: "Network layer",
    status: "Sealed",
    visibility: "Protected"
  },
  {
    endpoint: "Protected media endpoint",
    health: "attention",
    icon: MonitorCheck,
    id: "media-library",
    lastCheck: "Known reachable through public domain",
    name: "Media Library",
    nextAction: "Confirm Access rules before exposing deeper controls.",
    provider: "Media group",
    region: "Redacted scope",
    riskNote: "Archive mounts should stay read-only for library scans.",
    signal: "Media library",
    status: "Protected",
    visibility: "Protected"
  },
  {
    endpoint: "Protected archive storage",
    health: "attention",
    icon: Archive,
    id: "archive-storage",
    lastCheck: "Archive policy still needs final retention decision",
    name: "Archive Storage",
    nextAction: "Confirm cleanup and retention before R2 Phase 2.",
    provider: "Storage group",
    region: "Redacted scope",
    riskNote: "R2 media sync stays deferred and closed by default.",
    signal: "Storage flow",
    status: "Connected",
    visibility: "Protected"
  },
  {
    endpoint: "Protected automation worker",
    health: "online",
    icon: Bot,
    id: "message-automation",
    lastCheck: "Download flow known",
    name: "Message Automation",
    nextAction: "Expose only heartbeat, not task controls.",
    provider: "Automation group",
    region: "Redacted scope",
    riskNote: "Downloads and cache deletion should not be controlled from public UI.",
    signal: "Automation loop",
    status: "Watching",
    visibility: "Protected"
  },
  {
    endpoint: "organizers / sync scripts",
    health: "online",
    icon: Code2,
    id: "scripts",
    lastCheck: "Read-only map item",
    name: "Scripts",
    nextAction: "Promote scripts into a protected action layer later.",
    provider: "Script group",
    region: "Redacted scope",
    riskNote: "No write actions are armed in Phase 2.",
    signal: "Automation layer",
    status: "Mapped",
    visibility: "Protected"
  }
];

const mapNodes = [...infrastructureNodes, ...protectedServices];

const flows = [
  {
    icon: Cloud,
    title: "Downloads -> Rename -> Archive -> Media library",
    detail: "A guarded media loop cleans noisy filenames, archives completed files, then waits for a selected library scan.",
    signal: "Observed"
  },
  {
    icon: Bot,
    title: "Sample signal -> Observation edge -> Latest state -> History",
    detail: "Telemetry enters through a protected intake and becomes a current status signal plus structured history.",
    signal: "Phase 2"
  },
  {
    icon: GitBranch,
    title: "Website -> GitHub -> Cloudflare Pages",
    detail: "Public changes move through GitHub main, local build checks, and a Pages release.",
    signal: "Live"
  }
];

const risks = [
  {
    icon: KeyRound,
    label: "Auth not wired",
    detail: "Console is public and read-only until Cloudflare Access is chosen.",
    nodeIds: ["access-boundary"],
    tone: "gold" as Tone
  },
  {
    icon: ShieldAlert,
    label: "Protected systems exposed?",
    detail: "Review Access rules before adding any control-plane route.",
    nodeIds: ["protected-systems", "media-library"],
    tone: "red" as Tone
  },
  {
    icon: Database,
    label: "Backup policy missing",
    detail: "System history, runbooks, service configuration, and archive retention need a simple backup policy.",
    nodeIds: ["scripts"],
    tone: "gold" as Tone
  },
  {
    icon: Archive,
    label: "Archive path",
    detail: "Archive cleanup rules need a final naming and retention decision.",
    nodeIds: ["archive-storage"],
    tone: "blue" as Tone
  },
  {
    icon: TerminalSquare,
    label: "Browser automation optional",
    detail: "Browser automation is currently unavailable and does not block observation workflows.",
    nodeIds: [],
    tone: "purple" as Tone
  },
  {
    icon: Smartphone,
    label: "Mobile routing pending",
    detail: "Mobile name resolution, routing, and network variants still require the phone test matrix.",
    nodeIds: ["connectivity"],
    tone: "gold" as Tone
  }
];

const decisionLogs: DecisionLog[] = [
  {
    detail: "The public console can observe signals, but every real command stays behind a future Access policy and explicit authorization model.",
    id: "read-only",
    label: "Keep console read-only until Cloudflare Access is wired.",
    phase: "phase 2 / safety"
  },
  {
    detail: "Repository edits, builds, deployment checks, and browser verification remain sufficient even when optional desktop automation is unavailable.",
    id: "automation-optional",
    label: "Treat optional browser automation as non-blocking.",
    phase: "phase 2 / workflow"
  },
  {
    detail: "Desktop and mobile screenshots are part of release validation so layout regressions are caught before publishing.",
    id: "visual-validation",
    label: "Use browser checks as the visual validation fallback.",
    phase: "phase 2 / quality"
  },
  {
    detail: "Signals and system memory must become trustworthy before any action endpoint can be armed.",
    id: "observe-first",
    label: "Build observation layer before protected actions.",
    phase: "phase 3 / boundary"
  },
  {
    detail: "Future object storage requires closed buckets, signed URLs, lifecycle cleanup, upload caps, and no public listings.",
    id: "defer-r2",
    label: "Defer R2 media sync until signed URL and lifecycle rules exist.",
    phase: "future / storage"
  },
  {
    detail: "The secure transport path is repaired and verified. Mobile routing and network variants remain a device-side test.",
    id: "mobile-rescue",
    label: "Mobile diagnostics phase: server path fixed; device routing tests pending.",
    phase: "mobile rescue / diagnostics"
  }
];

const missionEvents: MissionEvent[] = [
  {
    detail: "The latest source update reached the public release branch after local build validation.",
    id: "source-update",
    label: "Latest source update recorded",
    phase: "phase 2",
    time: "release trail"
  },
  {
    detail: "Static export and Pages Functions compiled without TypeScript or route errors.",
    id: "release-validation",
    label: "Release validation passed",
    phase: "phase 2",
    time: "build gate"
  },
  {
    detail: "Cloudflare Pages received the current public observation surface.",
    id: "edge-updated",
    label: "Public edge updated",
    phase: "phase 2",
    time: "edge deploy"
  },
  {
    detail: "Signal, Map, Loops, Memory, Gate, Telemetry, and the unarmed Control shell are available.",
    id: "surface-active",
    label: "Observation surface active",
    phase: "phase 3",
    time: "mission state"
  },
  {
    detail: "Optional browser automation does not block builds, verification, deployment, or telemetry reads.",
    id: "browser-optional",
    label: "Browser automation optional / unavailable",
    phase: "phase 2",
    time: "known limit"
  },
  {
    detail: "The server path completed a controlled request. The remaining investigation is isolated to mobile routing, profile identity, or carrier behavior.",
    id: "mobile-rescue-phase",
    label: "Mobile diagnostics phase recorded",
    phase: "diagnostics",
    time: "device test pending"
  }
];

const alertNodeIds = new Set(risks.flatMap((risk) => risk.nodeIds));

const accessPosture = [
  {
    label: "Public Edge",
    value: "Protected by Cloudflare"
  },
  {
    label: "Console",
    value: "Public read-only"
  },
  {
    label: "Protected Systems",
    value: "Sealed, no direct exposure"
  },
  {
    label: "Protected Actions",
    value: "Not armed"
  }
];

const logs = [
  {
    icon: RadioTower,
    label: "Latest public release",
    value: "Recorded"
  },
  {
    icon: Code2,
    label: "Previous stable release",
    value: "Recorded"
  },
  {
    icon: CheckCircle2,
    label: "Release validation",
    value: "Passed"
  },
  {
    icon: TerminalSquare,
    label: "Browser automation",
    value: "Optional / unavailable"
  }
];

function numberOrNull(value: unknown) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function percent(value: number | null) {
  return typeof value === "number" ? `${Math.round(value)}%` : "--";
}

function metric(value: number | null) {
  return typeof value === "number" ? String(Math.round(value)) : "--";
}

function formatClock(value: string) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function formatDateTime(value: string) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function average(nodes: NodeSignal[], key: "cpu" | "disk" | "memory") {
  const values = nodes
    .map((node) => node[key])
    .filter((value): value is number => typeof value === "number");

  if (!values.length) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function normalizeTelemetry(row: ApiTelemetry, fallback?: ApiNode): NodeSignal | null {
  const id = String(row.node_id || fallback?.id || "").trim();

  if (!id) {
    return null;
  }

  return {
    cpu: numberOrNull(row.cpu_percent),
    disk: numberOrNull(row.disk_percent),
    id,
    lastSeen: row.created_at || fallback?.created_at || "",
    memory: numberOrNull(row.memory_percent),
    name: String(row.node_name || fallback?.name || id),
    observedChecks: numberOrNull(row.online_users),
    provider: "Public-safe sample",
    region: "Redacted scope",
    status: "Online",
    temperature: numberOrNull(row.temperature_c),
    visibility: String(row.visibility || fallback?.visibility || "protected")
  };
}

function stateFromApi(
  health: HealthPayload,
  nodesPayload: { nodes?: ApiNode[] },
  recentPayload: { telemetry?: ApiTelemetry[] }
): TelemetryState {
  const latestNodes = new Map<string, NodeSignal>();

  for (const node of nodesPayload.nodes || []) {
    if (node.latest) {
      const latest = normalizeTelemetry(node.latest as ApiTelemetry, node);
      if (latest) {
        latestNodes.set(latest.id, latest);
      }
    }
  }

  for (const row of recentPayload.telemetry || []) {
    const latest = normalizeTelemetry(row);
    if (latest && !latestNodes.has(latest.id)) {
      latestNodes.set(latest.id, latest);
    }
  }

  const nodes = Array.from(latestNodes.values());

  if (!nodes.length) {
    return {
      ...initialTelemetry,
      backendLabel: health.mode === "live" ? "visual fallback" : "offline fallback",
      lastUpdate: health.timestamp || initialTelemetry.lastUpdate,
      protectionLabel: "protected intake"
    };
  }

  const recentRows = (recentPayload.telemetry || []).slice(0, 12).reverse();
  const trend = recentRows.length
    ? recentRows.map((row, index) => ({
        cpu: numberOrNull(row.cpu_percent) ?? nodes[index % nodes.length]?.cpu ?? 0,
        disk: numberOrNull(row.disk_percent) ?? nodes[index % nodes.length]?.disk ?? 0,
        label: row.created_at ? formatClock(row.created_at).slice(0, 5) : `${index + 1}`,
        memory: numberOrNull(row.memory_percent) ?? nodes[index % nodes.length]?.memory ?? 0
      }))
    : mockTrend;

  const lastIngest = nodes.reduce((latest, node) => {
    if (!latest) {
      return node.lastSeen;
    }

    return new Date(node.lastSeen).getTime() > new Date(latest).getTime()
      ? node.lastSeen
      : latest;
  }, "");

  return {
    backendLabel: "live telemetry",
    lastIngest,
    lastUpdate: health.timestamp || lastIngest,
    mode: "live",
    nodes,
    protectionLabel: "protected intake",
    trend
  };
}

function Sparkline({
  color,
  points
}: {
  color: string;
  points: number[];
}) {
  const path = points
    .map((value, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 100;
      const y = 36 - (Math.max(0, Math.min(100, value)) / 100) * 30;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg className="mini-sparkline" viewBox="0 0 100 40" aria-hidden="true">
      <polyline points={path} fill="none" stroke={color} strokeWidth="2.2" />
    </svg>
  );
}

function HeartbeatTrend({ trend }: { trend: TrendPoint[] }) {
  const series = [
    { color: "#64aaff", field: "cpu" as const, label: "CPU %" },
    { color: "#bb78ff", field: "memory" as const, label: "Memory %" },
    { color: "#f1c77a", field: "disk" as const, label: "Disk %" }
  ];

  return (
    <div className="trend-chart" aria-label="Heartbeat trend for 24 hours">
      <div className="trend-legend">
        {series.map((item) => (
          <span key={item.label}>
            <i style={{ borderColor: item.color }} aria-hidden="true" />
            {item.label}
          </span>
        ))}
      </div>
      <svg viewBox="0 0 520 240" role="img" aria-label="CPU, memory, and disk trend">
        <g className="trend-grid">
          {[0, 25, 50, 75, 100].map((value) => {
            const y = 205 - value * 1.6;
            return (
              <g key={value}>
                <line x1="44" x2="500" y1={y} y2={y} />
                <text x="8" y={y + 4}>
                  {value}%
                </text>
              </g>
            );
          })}
        </g>
        {series.map((item) => {
          const points = trend
            .map((point, index) => {
              const x = 48 + (index / Math.max(trend.length - 1, 1)) * 452;
              const y = 205 - Math.max(0, Math.min(100, point[item.field])) * 1.6;
              return `${x.toFixed(2)},${y.toFixed(2)}`;
            })
            .join(" ");

          return (
            <polyline
              fill="none"
              key={item.label}
              points={points}
              stroke={item.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
          );
        })}
        <g className="trend-axis">
          {trend.filter((_, index) => index % 3 === 0).map((point, index) => (
            <text key={`${point.label}-${index}`} x={48 + index * 136} y="230">
              {point.label}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default function SignalDashboard() {
  const [selectedNodeId, setSelectedNodeId] = useState(infrastructureNodes[0].id);
  const [providerFilter, setProviderFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryState>(initialTelemetry);
  const selectedNode =
    mapNodes.find((node) => node.id === selectedNodeId) ?? infrastructureNodes[0];
  const selectedEvent =
    missionEvents.find((event) => event.id === selectedEventId) ?? null;
  const providerOptions = useMemo(
    () => Array.from(new Set(protectedServices.map((node) => node.provider))).sort(),
    []
  );
  const regionOptions = useMemo(
    () => Array.from(new Set(protectedServices.map((node) => node.region))).sort(),
    []
  );
  const filteredProtectedServices = useMemo(
    () =>
      protectedServices.filter(
        (node) =>
          (providerFilter === "all" || node.provider === providerFilter) &&
          (regionFilter === "all" || node.region === regionFilter) &&
          (statusFilter === "all" || node.health === statusFilter)
      ),
    [providerFilter, regionFilter, statusFilter]
  );
  const SelectedIcon = selectedNode.icon;

  useEffect(() => {
    const controller = new AbortController();

    async function loadTelemetry() {
      try {
        const [healthResponse, nodesResponse, recentResponse] = await Promise.all([
          fetch("/api/health", { signal: controller.signal }),
          fetch("/api/nodes", { signal: controller.signal }),
          fetch("/api/telemetry/recent?limit=24", { signal: controller.signal })
        ]);

        if (!healthResponse.ok || !nodesResponse.ok || !recentResponse.ok) {
          throw new Error("Telemetry API unavailable.");
        }

        const [health, nodesPayload, recentPayload] = await Promise.all([
          healthResponse.json() as Promise<HealthPayload>,
          nodesResponse.json() as Promise<{ nodes?: ApiNode[] }>,
          recentResponse.json() as Promise<{ telemetry?: ApiTelemetry[] }>
        ]);

        setTelemetry(stateFromApi(health, nodesPayload, recentPayload));
      } catch {
        if (!controller.signal.aborted) {
          setTelemetry(initialTelemetry);
        }
      }
    }

    loadTelemetry();

    return () => controller.abort();
  }, []);

  const stats = useMemo(() => {
    const activeNodes = telemetry.nodes.filter((node) => node.status !== "Offline").length;
    const observedChecks = telemetry.nodes.reduce(
      (sum, node) => sum + (node.observedChecks || 0),
      0
    );

    return {
      activeNodes,
      averageCpu: average(telemetry.nodes, "cpu"),
      averageDisk: average(telemetry.nodes, "disk"),
      averageMemory: average(telemetry.nodes, "memory"),
      configuredNodes: telemetry.nodes.length,
      observedChecks
    };
  }, [telemetry.nodes]);

  const summaryCards = [
    {
      color: "#5ee37d",
      detail: `/ ${stats.configuredNodes} sample signals`,
      label: "Demo signals",
      spark: telemetry.trend.map((point) => point.cpu / 2),
      value: String(stats.activeNodes)
    },
    {
      color: "#64aaff",
      detail: "Sample average",
      label: "CPU (avg)",
      spark: telemetry.trend.map((point) => point.cpu),
      value: percent(stats.averageCpu)
    },
    {
      color: "#bb78ff",
      detail: "Sample average",
      label: "Memory (avg)",
      spark: telemetry.trend.map((point) => point.memory),
      value: percent(stats.averageMemory)
    },
    {
      color: "#f1c77a",
      detail: "Sample average",
      label: "Disk (avg)",
      spark: telemetry.trend.map((point) => point.disk),
      value: percent(stats.averageDisk)
    },
    {
      color: "#59d4e8",
      detail: "Not customer data",
      label: "Observed checks",
      spark: telemetry.trend.map((point) => Math.min(100, point.cpu + 12)),
      value: String(stats.observedChecks)
    },
    {
      color: "#f5f1e8",
      detail: telemetry.mode === "live" ? "Public-safe API signal" : "visual fallback",
      label: "Last ingest",
      spark: telemetry.trend.map((point) => point.disk + 8),
      value: formatClock(telemetry.lastIngest)
    }
  ];

  return (
    <>
      <nav className="console-tabs mode-switch" aria-label="Mission modes">
        {consoleTabs.map((tab) => (
          <a href={`#${tab.id}`} key={tab.id}>
            <span className="tab-light" aria-hidden="true" />
            {tab.label}
          </a>
        ))}
      </nav>

      <section
        className="console-section"
        id="signal"
        aria-labelledby="signal-title"
      >
        <div className="console-section-head">
          <div>
            <p className="eyebrow">signal</p>
            <h2 id="signal-title">Public-safe observation layer.</h2>
          </div>
          <p>
            This cockpit remains read-only. It watches public-safe status,
            sample telemetry, and history signals without exposing a control surface.
          </p>
        </div>

        <div className="pulse-grid">
          {pulseCards.map((card) => {
            const Icon = card.icon;

            return (
              <article className={`pulse-card tone-${card.tone}`} key={card.label}>
                <div className="pulse-card-top">
                  <Icon aria-hidden="true" size={24} strokeWidth={1.9} />
                  <span>{card.label}</span>
                </div>
                <strong>{card.value}</strong>
                <p>{card.body}</p>
              </article>
            );
          })}
        </div>

        <div className="truth-source-strip" aria-label="Console evidence sources">
          {truthSources.map((source) => (
            <article className={`truth-source tone-${source.tone}`} key={source.label}>
              <span>{source.label}</span>
              <strong>{source.value}</strong>
              <p>{source.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="console-section telemetry-cockpit"
        id="telemetry"
        aria-labelledby="telemetry-title"
      >
        <div className="console-panel telemetry-command">
          <div className="telemetry-command-head">
            <div>
              <p className="eyebrow">telemetry center / public-safe demo</p>
              <h2 id="telemetry-title">Sample telemetry from the observation layer.</h2>
            </div>
            <div className="backend-badges" aria-label="Telemetry backend status">
              <span>
                <Database aria-hidden="true" size={15} strokeWidth={2} />
                Backend {telemetry.backendLabel}
              </span>
              <span>
                <ShieldCheck aria-hidden="true" size={15} strokeWidth={2} />
                {telemetry.protectionLabel}
              </span>
              <span>
                <Activity aria-hidden="true" size={15} strokeWidth={2} />
                Last update {formatDateTime(telemetry.lastUpdate)}
              </span>
            </div>
          </div>

          <div className="metric-rack">
            {summaryCards.map((card) => (
              <article className="metric-card" key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <p>{card.detail}</p>
                <Sparkline color={card.color} points={card.spark} />
              </article>
            ))}
          </div>
        </div>

        <div className="telemetry-main-grid">
          <section className="console-panel node-heartbeat" aria-labelledby="node-heartbeat-title">
            <div className="panel-title">
              <p className="eyebrow">sample telemetry</p>
              <h2 id="node-heartbeat-title">Demo signals</h2>
            </div>
            <div className="node-table-scroll">
              <table className="node-table">
                <thead>
                  <tr>
                    <th>Signal</th>
                    <th>Category</th>
                    <th>Scope</th>
                    <th>CPU</th>
                    <th>Memory</th>
                    <th>Disk</th>
                    <th>Temp</th>
                    <th>Observed checks</th>
                    <th>Last seen</th>
                  </tr>
                </thead>
                <tbody>
                  {telemetry.nodes.map((node, index) => (
                    <tr key={node.id}>
                      <td>
                        <span className="status-dot" aria-hidden="true" />
                        Sample signal {index + 1}
                      </td>
                      <td>{node.provider}</td>
                      <td>{node.region}</td>
                      <td>{percent(node.cpu)}</td>
                      <td>{percent(node.memory)}</td>
                      <td>{percent(node.disk)}</td>
                      <td>{node.temperature === null ? "--" : `${metric(node.temperature)}C`}</td>
                      <td>{metric(node.observedChecks)}</td>
                      <td>{formatClock(node.lastSeen)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="table-note">
              Showing {stats.activeNodes} of {stats.configuredNodes} sample signals. Data is
              {telemetry.mode === "live"
                ? " public-safe observation API output, not customer data"
                : " a clearly labeled visual fallback"}.
            </p>
          </section>

          <section className="console-panel trend-panel-v2" aria-labelledby="trend-title">
            <div className="panel-title">
              <p className="eyebrow">demo signal trend (24h)</p>
              <h2 id="trend-title">Sample drift</h2>
            </div>
            <HeartbeatTrend trend={telemetry.trend} />
          </section>
        </div>

        <div className="telemetry-lower-grid">
          <section className="console-panel compact-panel" aria-labelledby="recent-trail-title">
            <div className="panel-title mini-title">
              <p className="eyebrow">recent trail</p>
              <a href="#memory">View all</a>
            </div>
            <h3 id="recent-trail-title">Latest system events</h3>
            <div className="mission-list">
              {[
                "Sample telemetry signal accepted",
                "Sample status state refreshed",
                "Observation endpoint healthy",
                "Demo signal snapshot normalized",
                "Public observation release active"
              ].map((item, index) => (
                <div className="mission-list-row" key={item}>
                  <Activity aria-hidden="true" size={15} strokeWidth={2} />
                  <span>{item}</span>
                  <em>{index < 2 ? formatClock(telemetry.lastIngest) : "recent"}</em>
                </div>
              ))}
            </div>
          </section>

          <section className="console-panel compact-panel" aria-labelledby="risk-title">
            <div className="panel-title mini-title">
              <p className="eyebrow">risk radar</p>
              <a href="#memory">View all</a>
            </div>
            <h3 id="risk-title">Before control</h3>
            <div className="mission-list">
              {risks.map((risk) => {
                const Icon = risk.icon;

                return (
                  <div className={`mission-list-row tone-${risk.tone}`} key={risk.label}>
                    <Icon aria-hidden="true" size={15} strokeWidth={2} />
                    <span>{risk.label}</span>
                    <em>{risk.detail}</em>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="console-panel compact-panel system-memory-card" aria-labelledby="system-memory-title">
            <div className="panel-title mini-title">
              <p className="eyebrow">system memory</p>
              <a href="#memory">View all</a>
            </div>
            <h3 id="system-memory-title">Decision log</h3>
            <div className="mission-list">
              {decisionLogs.slice(0, 4).map((decision) => (
                <div className="mission-list-row" key={decision.id}>
                  <Sparkles aria-hidden="true" size={15} strokeWidth={2} />
                  <span>{decision.label}</span>
                  <em>{decision.phase}</em>
                </div>
              ))}
            </div>
          </section>

          <section className="console-panel compact-panel" aria-labelledby="access-posture-title">
            <div className="panel-title mini-title">
              <p className="eyebrow">access posture</p>
              <a href="#gate">View all</a>
            </div>
            <h3 id="access-posture-title">Current protection</h3>
            <div className="access-list">
              {accessPosture.map((item) => (
                <div key={item.label}>
                  <ShieldCheck aria-hidden="true" size={18} strokeWidth={1.9} />
                  <span>
                    <strong>{item.label}</strong>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section
          className="console-panel connectivity-diagnostics"
          aria-labelledby="connectivity-diagnostics-title"
        >
          <div className="diagnostics-heading">
            <div>
              <p className="eyebrow">local diagnostics / mobile rescue</p>
              <h2 id="connectivity-diagnostics-title">Connectivity Diagnostics</h2>
            </div>
            <span>
              <Lock aria-hidden="true" size={15} strokeWidth={2} />
              No public profiles
            </span>
          </div>
          <p className="diagnostics-intro">
            This card records public-safe test outcomes only. It does not reveal
            infrastructure addresses, routing details, sensitive access data,
            connection hints, subscription links, or protected configuration files.
          </p>
          <div className="diagnostics-grid">
            {mobileConnectivityDiagnostics.map((item) => (
              <article key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
          <div className="diagnostics-matrix" aria-label="Mobile test matrix preview">
            <div>
              <span>Networks</span>
              <strong>Wi-Fi / mobile data</strong>
            </div>
            <div>
              <span>Profiles</span>
              <strong>Baseline / compatibility / guarded bootstrap</strong>
            </div>
            <div>
              <span>Next evidence</span>
              <strong>Name resolution, browsing, exit check, and redacted logs</strong>
            </div>
          </div>
        </section>

        <section
          className="console-panel domain-mail-diagnostics"
          aria-labelledby="domain-mail-diagnostics-title"
        >
          <div className="diagnostics-heading">
            <div>
              <p className="eyebrow">local audit / domain mail</p>
              <h2 id="domain-mail-diagnostics-title">Domain Mail Diagnostics</h2>
            </div>
            <span>
              <MailCheck aria-hidden="true" size={15} strokeWidth={2} />
              Mail settings unchanged
            </span>
          </div>
          <p className="diagnostics-intro">
            This is a public-safe readiness summary. Addresses, provider access data,
            routing destinations, DNS records, and administrative controls are
            intentionally omitted.
          </p>
          <div className="diagnostics-grid">
            {domainMailDiagnostics.map((item) => (
              <article key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="architecture-cost-grid">
          <aside className="console-panel architecture-layers" aria-label="NX Warden architecture layers">
            <div className="panel-title">
              <p className="eyebrow">architecture layers</p>
              <h2>NX Warden three-layer model</h2>
            </div>
            <ol>
              <li>
                <span>Layer 1</span>
                <strong>Public Edge</strong>
                <p>Pages + Workers edge on nxwarden.com.</p>
              </li>
              <li>
                <span>Layer 2</span>
                <strong>Observation Layer</strong>
                <p>Telemetry, signals, memory, risk radar.</p>
              </li>
              <li>
                <span>Layer 3</span>
                <strong>Protected Actions</strong>
                <p>Future protected actions and automation.</p>
              </li>
            </ol>
          </aside>

          <aside className="console-panel cost-guard-v2" aria-label="Cost guard">
            <div className="panel-title">
              <p className="eyebrow">cost guard</p>
              <h2>Phase 2 principles</h2>
            </div>
            <ul>
              <li>Only small structured telemetry is retained.</li>
              <li>Only the latest heartbeat state is cached.</li>
              <li>R2 media sync is intentionally deferred.</li>
              <li>No public file serving is enabled.</li>
              <li>No write actions exist in console.</li>
              <li>Monitor usage and keep it lean.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="console-grid mission-grid" aria-label="Mission Control">
        <div className="console-panel map-panel" id="map">
          <div className="panel-title">
            <p className="eyebrow">map</p>
            <h2>Infrastructure Map</h2>
          </div>
          <div className="map-filters" aria-label="Infrastructure filters">
            <span className="filter-title">
              <Filter aria-hidden="true" size={16} strokeWidth={2} />
              Signal filters
            </span>
            <label>
              <span>Category</span>
              <select
                aria-label="Filter map by category"
                onChange={(event) => setProviderFilter(event.target.value)}
                value={providerFilter}
              >
                <option value="all">All categories</option>
                {providerOptions.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Scope</span>
              <select
                aria-label="Filter map by scope"
                onChange={(event) => setRegionFilter(event.target.value)}
                value={regionFilter}
              >
                <option value="all">All scopes</option>
                {regionOptions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Status</span>
              <select
                aria-label="Filter map by status"
                onChange={(event) => setStatusFilter(event.target.value)}
                value={statusFilter}
              >
                <option value="all">All signals</option>
                <option value="online">Online</option>
                <option value="attention">Attention</option>
                <option value="offline">Offline</option>
              </select>
            </label>
            <button
              className="filter-reset"
              onClick={() => {
                setProviderFilter("all");
                setRegionFilter("all");
                setStatusFilter("all");
              }}
              type="button"
            >
              <RotateCcw aria-hidden="true" size={15} strokeWidth={2} />
              Reset
            </button>
          </div>
          <div className="infrastructure-shell">
            <div className="infrastructure-map" aria-label="Connected infrastructure nodes">
              <div className="map-spine" aria-hidden="true" />
              <div className="trunk-nodes">
                {infrastructureNodes.map((node) => {
                  const Icon = node.icon;
                  const isSelected = node.id === selectedNode.id;

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`map-node trunk-node health-${node.health}${isSelected ? " active" : ""}${alertNodeIds.has(node.id) ? " has-alert" : ""}`}
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      type="button"
                    >
                      <span className="node-icon">
                        <Icon aria-hidden="true" size={20} strokeWidth={1.9} />
                      </span>
                      <span>
                        <small>{node.signal}</small>
                        <strong>{node.name}</strong>
                      </span>
                      <em>{node.status}</em>
                      {alertNodeIds.has(node.id) ? (
                        <span className="node-alert">Risk signal</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="private-branches" aria-label="Protected system branches">
                {filteredProtectedServices.map((service) => {
                  const Icon = service.icon;
                  const isSelected = service.id === selectedNode.id;

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`map-node branch-node health-${service.health}${isSelected ? " active" : ""}${alertNodeIds.has(service.id) ? " has-alert" : ""}`}
                      key={service.id}
                      onClick={() => setSelectedNodeId(service.id)}
                      type="button"
                    >
                      <span className="branch-line" aria-hidden="true" />
                      <span className="node-icon">
                        <Icon aria-hidden="true" size={20} strokeWidth={1.9} />
                      </span>
                      <span>
                        <small>{service.visibility}</small>
                        <strong>{service.name}</strong>
                      </span>
                      <em>{service.status}</em>
                      {alertNodeIds.has(service.id) ? (
                        <span className="node-alert">Risk signal</span>
                      ) : null}
                    </button>
                  );
                })}
                {!filteredProtectedServices.length ? (
                  <div className="map-empty">
                    No nodes match this signal filter.
                  </div>
                ) : null}
              </div>
            </div>

            <aside className="service-detail mission-detail" aria-live="polite">
              <div className="detail-topline">
                <span className="row-icon">
                  <SelectedIcon aria-hidden="true" size={20} strokeWidth={1.9} />
                </span>
                <div>
                  <p className="eyebrow">focus node</p>
                  <h3>{selectedNode.name}</h3>
                </div>
              </div>
              <dl className="detail-list">
                <div>
                  <dt>Status</dt>
                  <dd>{selectedNode.status}</dd>
                </div>
                <div>
                  <dt>Visibility</dt>
                  <dd>{selectedNode.visibility}</dd>
                </div>
                <div>
                  <dt>Endpoint</dt>
                  <dd>{selectedNode.endpoint}</dd>
                </div>
                <div>
                  <dt>Last check</dt>
                  <dd>{selectedNode.lastCheck}</dd>
                </div>
                <div>
                  <dt>Risk note</dt>
                  <dd>{selectedNode.riskNote}</dd>
                </div>
                <div>
                  <dt>Next action</dt>
                  <dd>{selectedNode.nextAction}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>

        <div className="console-panel" id="loops">
          <div className="panel-title">
            <p className="eyebrow">loops</p>
            <h2>Operating loops</h2>
          </div>
          <div className="flow-list">
            {flows.map((flow) => {
              const Icon = flow.icon;

              return (
                <article className="flow-row" key={flow.title}>
                  <Icon aria-hidden="true" size={20} strokeWidth={1.9} />
                  <div>
                    <span className="flow-signal">{flow.signal}</span>
                    <strong>{flow.title}</strong>
                    <p>{flow.detail}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="console-panel timeline-panel" id="memory">
          <div className="panel-title">
            <p className="eyebrow">memory</p>
            <h2>Recent mission trail</h2>
          </div>
          <div className="timeline-list">
            {missionEvents.map((event) => (
              <article className="timeline-item" key={event.id}>
                <span className="timeline-dot">
                  <CheckCircle2 aria-hidden="true" size={17} strokeWidth={2} />
                </span>
                <button
                  aria-label={`Open details for ${event.label}`}
                  onClick={() => setSelectedEventId(event.id)}
                  type="button"
                >
                  <span>{event.phase}</span>
                  <strong>{event.label}</strong>
                  <p>{event.detail}</p>
                  <em>{event.time}</em>
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="console-panel risk-panel">
          <div className="panel-title">
            <p className="eyebrow">risk radar</p>
            <h2>Open questions before control.</h2>
          </div>
          <div className="risk-grid">
            {risks.map((risk) => {
              const Icon = risk.icon;

              return (
                <article className={`risk-card tone-${risk.tone}`} key={risk.label}>
                  <Icon aria-hidden="true" size={20} strokeWidth={1.9} />
                  <strong>{risk.label}</strong>
                  <p>{risk.detail}</p>
                  {risk.nodeIds.length ? (
                    <a
                      href="#map"
                      onClick={() => setSelectedNodeId(risk.nodeIds[0])}
                    >
                      Focus signal
                    </a>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>

        <aside
          className="console-panel memory-panel black-box-memory"
          aria-labelledby="memory-title"
        >
          <Sparkles aria-hidden="true" size={26} strokeWidth={1.8} />
          <div>
            <p className="eyebrow">system memory</p>
            <h2 id="memory-title">Black-box decision log.</h2>
            <div className="decision-stack">
              {decisionLogs.map((decision) => (
                <details key={decision.id}>
                  <summary>
                    <span>{decision.label}</span>
                    <ChevronDown aria-hidden="true" size={16} strokeWidth={2} />
                  </summary>
                  <p>{decision.detail}</p>
                  <em>{decision.phase}</em>
                </details>
              ))}
            </div>
          </div>
        </aside>

        <div className="console-panel logs-panel">
          <div className="panel-title">
            <p className="eyebrow">signals</p>
            <h2>Current trail</h2>
          </div>
          <div className="log-list">
            {logs.map((log) => {
              const Icon = log.icon;

              return (
                <div className="log-row" key={log.label}>
                  <Icon aria-hidden="true" size={18} strokeWidth={2} />
                  <span>{log.label}</span>
                  <strong>{log.value}</strong>
                </div>
              );
            })}
          </div>
        </div>

        <aside
          className="console-panel console-lock"
          id="gate"
          aria-label="Gate note"
        >
          <ShieldCheck aria-hidden="true" size={26} strokeWidth={1.8} />
          <div>
            <p className="eyebrow">gate</p>
            <h2>Public prototype. Protected action layer later.</h2>
            <p>
              Login, write actions, and machine commands stay out of this layer
              until Cloudflare Access and a real authorization model are chosen.
            </p>
          </div>
          <Lock aria-hidden="true" size={18} strokeWidth={2.1} />
        </aside>

        <section
          className="console-panel control-panel"
          id="control"
          aria-labelledby="control-title"
        >
          <div className="control-heading">
            <div className="panel-title">
              <p className="eyebrow">control / phase 3 preview</p>
              <h2 id="control-title">Interactive shell, deliberately unarmed.</h2>
            </div>
            <span className="control-lock-state">
              <Lock aria-hidden="true" size={15} strokeWidth={2} />
              Access + mTLS required before arming
            </span>
          </div>
          <p className="control-intro">
            These controls define the future command surface without sending,
            storing, or executing a machine action. The Worker placeholder always
            returns a locked response.
          </p>
          <div className="control-node-grid">
            {telemetry.nodes.map((node, index) => (
              <article className="control-node-card" key={node.id}>
                <div className="control-node-head">
                  <span className="status-dot heartbeat-dot" aria-hidden="true" />
                  <div>
                    <strong>Sample signal {index + 1}</strong>
                    <span>{node.provider} / {node.region}</span>
                  </div>
                  <em>Read only</em>
                </div>
                <div className="control-metrics">
                  <span>CPU {percent(node.cpu)}</span>
                  <span>MEM {percent(node.memory)}</span>
                  <span>DISK {percent(node.disk)}</span>
                </div>
                <div className="control-actions" aria-label={`Mock actions for sample signal ${index + 1}`}>
                  <button
                    disabled
                    title="Mock only. Requires Cloudflare Access, mTLS, authorization, and an armed command worker."
                    type="button"
                  >
                    <RotateCcw aria-hidden="true" size={16} strokeWidth={2} />
                    Restart service
                  </button>
                  <button
                    disabled
                    title="Mock only. No automation script is connected to the public console."
                    type="button"
                  >
                    <Play aria-hidden="true" size={16} strokeWidth={2} />
                    Trigger automation
                  </button>
                  <button
                    disabled
                    title="Mock only. Configuration writes are not implemented."
                    type="button"
                  >
                    <Settings2 aria-hidden="true" size={16} strokeWidth={2} />
                    Update configuration
                  </button>
                </div>
                <code>/api/node/sample-signal/action</code>
              </article>
            ))}
          </div>
        </section>

        <aside className="console-panel layer-map" aria-label="NX Warden layers">
          <CircleAlert aria-hidden="true" size={24} strokeWidth={1.9} />
          <div>
            <p className="eyebrow">three-layer path</p>
            <ol>
              <li>
                <strong>Layer 1: Public Edge</strong>
                <span>Homepage, service map, contact line.</span>
              </li>
              <li>
                <strong>Layer 2: Read-only Console</strong>
                <span>Signals, risks, logs, service memory.</span>
              </li>
              <li>
                <strong>Layer 3: Protected Actions Layer</strong>
                <span>Access-gated controls, scripts, sync, reports.</span>
              </li>
            </ol>
          </div>
        </aside>
      </section>

      {selectedEvent ? (
        <div className="event-modal-backdrop" role="presentation">
          <section
            aria-labelledby="event-modal-title"
            aria-modal="true"
            className="event-modal"
            role="dialog"
          >
            <button
              aria-label="Close event details"
              className="event-modal-close"
              onClick={() => setSelectedEventId(null)}
              type="button"
            >
              <X aria-hidden="true" size={18} strokeWidth={2} />
            </button>
            <p className="eyebrow">mission trail / {selectedEvent.phase}</p>
            <h2 id="event-modal-title">{selectedEvent.label}</h2>
            <p>{selectedEvent.detail}</p>
            <dl>
              <div>
                <dt>State</dt>
                <dd>Recorded</dd>
              </div>
              <div>
                <dt>Marker</dt>
                <dd>{selectedEvent.time}</dd>
              </div>
              <div>
                <dt>Control effect</dt>
                <dd>None / observation only</dd>
              </div>
            </dl>
          </section>
        </div>
      ) : null}
    </>
  );
}
