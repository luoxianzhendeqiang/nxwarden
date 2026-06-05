"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Archive,
  Bot,
  CheckCircle2,
  CircleAlert,
  Cloud,
  Code2,
  Database,
  FileClock,
  Gauge,
  GitBranch,
  Globe2,
  HardDrive,
  KeyRound,
  Lock,
  MonitorCheck,
  RadioTower,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Wrench
} from "lucide-react";

type Tone = "green" | "gold" | "blue" | "red" | "purple";

type MapNode = {
  endpoint: string;
  icon: typeof Globe2;
  id: string;
  lastCheck: string;
  name: string;
  nextAction: string;
  riskNote: string;
  signal: string;
  status: string;
  visibility: string;
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
  onlineUsers: number | null;
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
  { id: "telemetry", label: "Telemetry" }
];

const mockNodes: NodeSignal[] = [
  {
    cpu: 18,
    disk: 28,
    id: "cloudcone-hk-01",
    lastSeen: "18:24:31",
    memory: 32,
    name: "cloudcone-hk-01",
    onlineUsers: 56,
    provider: "CloudCone",
    region: "Hong Kong",
    status: "Online",
    temperature: 41,
    visibility: "private"
  },
  {
    cpu: 42,
    disk: 36,
    id: "racknerd-us-01",
    lastSeen: "18:24:28",
    memory: 48,
    name: "racknerd-us-01",
    onlineUsers: 38,
    provider: "RackNerd",
    region: "Los Angeles",
    status: "Online",
    temperature: 47,
    visibility: "private"
  },
  {
    cpu: 26,
    disk: 49,
    id: "racknerd-eu-01",
    lastSeen: "18:24:29",
    memory: 44,
    name: "racknerd-eu-01",
    onlineUsers: 34,
    provider: "RackNerd",
    region: "Frankfurt",
    status: "Online",
    temperature: 38,
    visibility: "private"
  },
  {
    cpu: 12,
    disk: 21,
    id: "komari-agent",
    lastSeen: "18:23:58",
    memory: 29,
    name: "komari-agent",
    onlineUsers: 5,
    provider: "KoMari",
    region: "fleet",
    status: "Online",
    temperature: null,
    visibility: "monitored"
  },
  {
    cpu: 9,
    disk: 18,
    id: "telegram-bot",
    lastSeen: "18:23:43",
    memory: 35,
    name: "telegram-bot",
    onlineUsers: 1,
    provider: "Scripts",
    region: "DC03",
    status: "Online",
    temperature: null,
    visibility: "private"
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
  nodes: mockNodes,
  protectionLabel: "protected intake",
  trend: mockTrend,
};

const pulseCards = [
  {
    icon: Activity,
    label: "Mission Pulse",
    value: "Observation",
    body: "Public edge is online, private plane is sealed, and no write actions are armed.",
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
    body: "Public Edge, Pages, Access Boundary, and Private Plane read as one topology.",
    tone: "gold" as Tone
  },
  {
    icon: FileClock,
    label: "Telemetry Phase",
    value: "Phase 2",
    body: "Latest heartbeat and structured history stay available through the observation layer.",
    tone: "purple" as Tone
  }
];

const infrastructureNodes: MapNode[] = [
  {
    endpoint: "nxwarden.com",
    icon: Globe2,
    id: "public-edge",
    lastCheck: "Production domain confirmed on Cloudflare Pages",
    name: "Public Edge",
    nextAction: "Keep this as the clean public surface for NX Warden.",
    riskNote: "Public content is safe to expose; no control actions belong here.",
    signal: "Visitor-facing entry",
    status: "Online",
    visibility: "Public"
  },
  {
    endpoint: "nxwarden.pages.dev / nxwarden.com",
    icon: Cloud,
    id: "cloudflare-pages",
    lastCheck: "Current public release recorded",
    name: "Cloudflare Pages",
    nextAction: "Use Pages plus Functions as the observation edge.",
    riskNote: "Pages should receive public UI and observation endpoints, not machine-control secrets.",
    signal: "Edge deployment",
    status: "Serving",
    visibility: "Public"
  },
  {
    endpoint: "Future Cloudflare Access boundary",
    icon: ShieldCheck,
    id: "access-boundary",
    lastCheck: "Not wired by design",
    name: "Access Boundary",
    nextAction: "Create protected /control only after the observation layer is stable.",
    riskNote: "Auth is not armed. Keep the current console read-only and harmless.",
    signal: "Safety gate",
    status: "Planned",
    visibility: "Gate"
  },
  {
    endpoint: "Private VPS, agents, media, scripts",
    icon: Server,
    id: "private-plane",
    lastCheck: "Represented as static topology plus telemetry signals",
    name: "Private Plane",
    nextAction: "Only heartbeat data should enter this public console.",
    riskNote: "Private services need Access before any future control plane is connected.",
    signal: "Sealed services",
    status: "Sealed",
    visibility: "Private"
  }
];

const privateServices: MapNode[] = [
  {
    endpoint: "CloudCone nodes",
    icon: Cloud,
    id: "cloudcone",
    lastCheck: "Telemetry sample available",
    name: "CloudCone",
    nextAction: "Send only lightweight heartbeat data from VPS scripts.",
    riskNote: "Do not expose SSH, shell logs, or control actions.",
    signal: "VPS provider",
    status: "Observed",
    visibility: "Private"
  },
  {
    endpoint: "RackNerd / DC03 nodes",
    icon: Server,
    id: "racknerd",
    lastCheck: "Telemetry sample available",
    name: "RackNerd",
    nextAction: "Keep Telegram bot and AList behind current service rules.",
    riskNote: "Ingest should stay token and Turnstile protected.",
    signal: "VPS provider",
    status: "Observed",
    visibility: "Private"
  },
  {
    endpoint: "Komari monitor field",
    icon: Gauge,
    id: "komari",
    lastCheck: "Dashboard visual source",
    name: "KoMari",
    nextAction: "Map Komari data into normalized telemetry later.",
    riskNote: "Public metric labels should stay bland and non-sensitive.",
    signal: "Fleet monitor",
    status: "Watching",
    visibility: "Monitored"
  },
  {
    endpoint: "sing-box / proxy nodes",
    icon: RadioTower,
    id: "sing-box",
    lastCheck: "No direct control wired",
    name: "Sing-box",
    nextAction: "Keep proxy traffic domains DNS-only when needed.",
    riskNote: "Never expose live proxy credentials in this console.",
    signal: "Network layer",
    status: "Sealed",
    visibility: "Private"
  },
  {
    endpoint: "Protected media endpoint",
    icon: MonitorCheck,
    id: "jellyfin",
    lastCheck: "Known reachable through public domain",
    name: "Jellyfin",
    nextAction: "Confirm Access rules before exposing deeper controls.",
    riskNote: "OneDrive mount should stay read-only for library scans.",
    signal: "Media library",
    status: "Protected",
    visibility: "Private"
  },
  {
    endpoint: "Protected archive storage",
    icon: Archive,
    id: "onedrive",
    lastCheck: "Archive policy still needs final retention decision",
    name: "OneDrive",
    nextAction: "Confirm cleanup and retention before R2 Phase 2.",
    riskNote: "R2 media sync stays deferred and private by default.",
    signal: "Storage flow",
    status: "Connected",
    visibility: "Private"
  },
  {
    endpoint: "Private automation worker",
    icon: Bot,
    id: "telegram-bot",
    lastCheck: "Download flow known",
    name: "Telegram Bot",
    nextAction: "Expose only heartbeat, not task controls.",
    riskNote: "Downloads and cache deletion should not be controlled from public UI.",
    signal: "Automation loop",
    status: "Watching",
    visibility: "Private"
  },
  {
    endpoint: "organizers / sync scripts",
    icon: Code2,
    id: "scripts",
    lastCheck: "Read-only map item",
    name: "Scripts",
    nextAction: "Promote scripts into a protected control plane later.",
    riskNote: "No write actions are armed in Phase 2.",
    signal: "Automation layer",
    status: "Mapped",
    visibility: "Private"
  }
];

const mapNodes = [...infrastructureNodes, ...privateServices];

const flows = [
  {
    icon: Cloud,
    title: "Downloads -> Rename -> Archive -> Jellyfin",
    detail: "Telegram media enters a guarded loop: download, clean numeric prefixes, archive to OneDrive, then wait for a selected Jellyfin scan.",
    signal: "Observed"
  },
  {
    icon: Bot,
    title: "Node heartbeat -> Observation edge -> Latest state -> History",
    detail: "Telemetry enters through a protected intake and becomes a current status signal plus structured history.",
    signal: "Phase 2"
  },
  {
    icon: GitBranch,
    title: "Website -> GitHub -> Cloudflare Pages",
    detail: "Public changes move through GitHub main, local build checks, and a Pages production deployment.",
    signal: "Live"
  }
];

const risks = [
  {
    icon: KeyRound,
    label: "Auth not wired",
    detail: "Console is public and read-only until Cloudflare Access is chosen.",
    tone: "gold" as Tone
  },
  {
    icon: ShieldAlert,
    label: "Private services exposed?",
    detail: "Review Access rules before adding any control-plane route.",
    tone: "red" as Tone
  },
  {
    icon: Database,
    label: "Backup policy missing",
    detail: "System history, runbooks, VPS config, and archive retention need a simple backup policy.",
    tone: "gold" as Tone
  },
  {
    icon: Archive,
    label: "OneDrive archive path",
    detail: "Archive cleanup rules need a final naming and retention decision.",
    tone: "blue" as Tone
  },
  {
    icon: TerminalSquare,
    label: "Browser automation optional",
    detail: "Browser automation is currently unavailable and does not block observation workflows.",
    tone: "purple" as Tone
  }
];

const decisionLogs = [
  "Decision: Keep console read-only until Cloudflare Access is wired.",
  "Decision: Treat optional browser automation as non-blocking.",
  "Decision: Use Playwright as visual validation fallback.",
  "Decision: Build observation layer before control plane.",
  "Decision: Defer R2 media sync until signed URL and lifecycle rules exist."
];

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
    label: "Private Plane",
    value: "Sealed, no direct exposure"
  },
  {
    label: "Control Plane",
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
    onlineUsers: numberOrNull(row.online_users),
    provider: String(row.provider || fallback?.provider || "Unknown"),
    region: String(row.region || fallback?.region || "Unknown"),
    status: "Online",
    temperature: numberOrNull(row.temperature_c),
    visibility: String(row.visibility || fallback?.visibility || "private")
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
      backendLabel: health.mode === "live" ? "live api / visual mock" : "mock",
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
    backendLabel: "live",
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
  const [telemetry, setTelemetry] = useState<TelemetryState>(initialTelemetry);
  const selectedNode =
    mapNodes.find((node) => node.id === selectedNodeId) ?? infrastructureNodes[0];
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
    const onlineUsers = telemetry.nodes.reduce(
      (sum, node) => sum + (node.onlineUsers || 0),
      0
    );

    return {
      activeNodes,
      averageCpu: average(telemetry.nodes, "cpu"),
      averageDisk: average(telemetry.nodes, "disk"),
      averageMemory: average(telemetry.nodes, "memory"),
      configuredNodes: telemetry.nodes.length,
      onlineUsers
    };
  }, [telemetry.nodes]);

  const summaryCards = [
    {
      color: "#5ee37d",
      detail: `/ ${stats.configuredNodes} configured`,
      label: "Active nodes",
      spark: telemetry.trend.map((point) => point.cpu / 2),
      value: String(stats.activeNodes)
    },
    {
      color: "#64aaff",
      detail: "All nodes average",
      label: "CPU (avg)",
      spark: telemetry.trend.map((point) => point.cpu),
      value: percent(stats.averageCpu)
    },
    {
      color: "#bb78ff",
      detail: "All nodes average",
      label: "Memory (avg)",
      spark: telemetry.trend.map((point) => point.memory),
      value: percent(stats.averageMemory)
    },
    {
      color: "#f1c77a",
      detail: "All nodes average",
      label: "Disk (avg)",
      spark: telemetry.trend.map((point) => point.disk),
      value: percent(stats.averageDisk)
    },
    {
      color: "#59d4e8",
      detail: "Across all nodes",
      label: "Online users",
      spark: telemetry.trend.map((point) => Math.min(100, point.cpu + 12)),
      value: String(stats.onlineUsers)
    },
    {
      color: "#f5f1e8",
      detail: telemetry.mode === "live" ? "UTC edge signal" : "visual fallback",
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
            <h2 id="signal-title">Observation layer, now reading edge telemetry.</h2>
          </div>
          <p>
            This cockpit remains read-only. It watches public-safe status,
            heartbeat, and history signals without exposing a control surface.
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
      </section>

      <section
        className="console-section telemetry-cockpit"
        id="telemetry"
        aria-labelledby="telemetry-title"
      >
        <div className="console-panel telemetry-command">
          <div className="telemetry-command-head">
            <div>
              <p className="eyebrow">telemetry center</p>
              <h2 id="telemetry-title">Real-time heartbeat from your nodes.</h2>
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
              <p className="eyebrow">node heartbeat</p>
              <h2 id="node-heartbeat-title">Active nodes</h2>
            </div>
            <div className="node-table-scroll">
              <table className="node-table">
                <thead>
                  <tr>
                    <th>Node</th>
                    <th>Provider</th>
                    <th>Location</th>
                    <th>CPU</th>
                    <th>Memory</th>
                    <th>Disk</th>
                    <th>Temp</th>
                    <th>Online users</th>
                    <th>Last seen</th>
                  </tr>
                </thead>
                <tbody>
                  {telemetry.nodes.map((node) => (
                    <tr key={node.id}>
                      <td>
                        <span className="status-dot" aria-hidden="true" />
                        {node.name}
                      </td>
                      <td>{node.provider}</td>
                      <td>{node.region}</td>
                      <td>{percent(node.cpu)}</td>
                      <td>{percent(node.memory)}</td>
                      <td>{percent(node.disk)}</td>
                      <td>{node.temperature === null ? "--" : `${metric(node.temperature)}C`}</td>
                      <td>{metric(node.onlineUsers)}</td>
                      <td>{formatClock(node.lastSeen)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="table-note">
              Showing {stats.activeNodes} of {stats.configuredNodes} nodes. Data is
              {telemetry.mode === "live" ? " from the observation backend" : " visual mock data"}.
            </p>
          </section>

          <section className="console-panel trend-panel-v2" aria-labelledby="trend-title">
            <div className="panel-title">
              <p className="eyebrow">heartbeat trend (24h)</p>
              <h2 id="trend-title">Signal drift</h2>
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
                "Telemetry signal accepted",
                "Latest heartbeat state refreshed",
                "Observation endpoint healthy",
                "Nodes snapshot normalized",
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
              {decisionLogs.slice(0, 4).map((decision, index) => (
                <div className="mission-list-row" key={decision}>
                  <Sparkles aria-hidden="true" size={15} strokeWidth={2} />
                  <span>{decision}</span>
                  <em>{`phase2 / ${index + 1}`}</em>
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
                <strong>Control Plane</strong>
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
                      className={`map-node trunk-node${isSelected ? " active" : ""}`}
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
                    </button>
                  );
                })}
              </div>

              <div className="private-branches" aria-label="Private plane branches">
                {privateServices.map((service) => {
                  const Icon = service.icon;
                  const isSelected = service.id === selectedNode.id;

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`map-node branch-node${isSelected ? " active" : ""}`}
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
                    </button>
                  );
                })}
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
            {[
              "Latest source update recorded",
              "Release validation passed",
              "Production edge updated",
              "Observation surface active",
              "Browser automation optional / unavailable"
            ].map((item) => (
              <article className="timeline-item" key={item}>
                <span className="timeline-dot">
                  <CheckCircle2 aria-hidden="true" size={17} strokeWidth={2} />
                </span>
                <div>
                  <span>phase 2</span>
                  <strong>{item}</strong>
                  <p>Observation layer remains public and read-only.</p>
                </div>
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
            <ol>
              {decisionLogs.map((decision) => (
                <li key={decision}>{decision}</li>
              ))}
            </ol>
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
            <h2>Public prototype. Protected control plane later.</h2>
            <p>
              Login, write actions, and machine commands stay out of this layer
              until Cloudflare Access and a real authorization model are chosen.
            </p>
          </div>
          <Lock aria-hidden="true" size={18} strokeWidth={2.1} />
        </aside>

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
                <strong>Layer 3: Protected Control Plane</strong>
                <span>Access-gated controls, scripts, sync, reports.</span>
              </li>
            </ol>
          </div>
        </aside>
      </section>
    </>
  );
}
