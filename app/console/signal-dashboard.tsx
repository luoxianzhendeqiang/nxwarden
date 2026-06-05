"use client";

import { useEffect, useState } from "react";
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

type Tone = "green" | "gold" | "blue" | "red";

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

type TelemetrySnapshot = {
  cpuPercent: number | null;
  diskPercent: number | null;
  heartbeat: string;
  lastIngest: string;
  memoryPercent: number | null;
  mode: "live" | "mock";
  nodeName: string;
  onlineUsers: number | null;
};

const consoleTabs = [
  { id: "signal", label: "Signal" },
  { id: "map", label: "Map" },
  { id: "loops", label: "Loops" },
  { id: "memory", label: "Memory" },
  { id: "gate", label: "Gate" }
];

const pulseCards = [
  {
    icon: Activity,
    label: "Mission Pulse",
    value: "Observation",
    body: "Public edge is online, private plane is sealed, and no write actions are armed.",
    tone: "green" as Tone
  },
  {
    icon: HardDrive,
    label: "Storage Flow",
    value: "Connected",
    body: "OneDrive archive exists as a system path. Folder policy still needs a final retention decision.",
    tone: "gold" as Tone
  },
  {
    icon: Server,
    label: "Infrastructure Map",
    value: "4 layers",
    body: "Public Edge, Cloudflare Pages, Access Boundary, and Private Plane now read as one topology.",
    tone: "blue" as Tone
  },
  {
    icon: FileClock,
    label: "Mission Trail",
    value: "Phase 1",
    body: "Telemetry Center now watches a Cloudflare-native backend with mock fallback.",
    tone: "gold" as Tone
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
    lastCheck: "Telemetry Center deploy pending",
    name: "Cloudflare Pages",
    nextAction: "Continue using Pages as the static public edge until control needs appear.",
    riskNote: "Pages is a good fit for public UI. It should not receive machine-control secrets.",
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
    nextAction: "Create protected /control or /console-private only after the public console is stable.",
    riskNote: "Auth is not armed. Keep the current console read-only and harmless.",
    signal: "Safety gate",
    status: "Planned",
    visibility: "Gate"
  },
  {
    endpoint: "Xueer VPS and private automation surfaces",
    icon: Server,
    id: "private-plane",
    lastCheck: "Represented as static topology only",
    name: "Private Plane",
    nextAction: "Do not expose scripts, logs, or restart controls before Access is active.",
    riskNote: "Private services need access rules before any future control plane is connected.",
    signal: "Sealed services",
    status: "Sealed",
    visibility: "Private"
  }
];

const privateServices: MapNode[] = [
  {
    endpoint: "jellyfin.54614614.xyz",
    icon: MonitorCheck,
    id: "jellyfin",
    lastCheck: "Known reachable through public domain",
    name: "Jellyfin",
    nextAction: "Confirm access rules before exposing any deeper control surfaces.",
    riskNote: "Media deletion requires write access; OneDrive mount is intentionally read-only for library scans.",
    signal: "Media library",
    status: "Protected",
    visibility: "Private"
  },
  {
    endpoint: "Xue archive path for TG downloads",
    icon: Archive,
    id: "onedrive-archive",
    lastCheck: "rclone chunk size fixed to 80M on DC03",
    name: "OneDrive Archive",
    nextAction: "Confirm final folder policy for Xue and Luo before automating larger cleanup.",
    riskNote: "Archive paths are working, but retention and backup policy are not confirmed.",
    signal: "Storage flow",
    status: "Connected",
    visibility: "Private"
  },
  {
    endpoint: "kuma.54614614.xyz/status/xueer",
    icon: Gauge,
    id: "uptime-kuma",
    lastCheck: "Public status page reviewed",
    name: "Uptime Kuma",
    nextAction: "Add 614451 endpoints once the new domain migration starts.",
    riskNote: "Status page is public by design; sensitive monitor names should stay bland.",
    signal: "Status beacon",
    status: "Watching",
    visibility: "Monitored"
  },
  {
    endpoint: "tools.54614614.xyz",
    icon: Wrench,
    id: "tools",
    lastCheck: "Utility surface reachable",
    name: "Tools",
    nextAction: "Decide whether it remains public or moves behind Access.",
    riskNote: "Experimental utilities should not expose secrets, file systems, or server commands.",
    signal: "Utility bench",
    status: "Available",
    visibility: "Experimental"
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
    title: "Notes -> AI Intel -> Decision Memory",
    detail: "Research fragments, deployment choices, and operating notes should become durable mission memory instead of vanishing into chat.",
    signal: "Planned"
  },
  {
    icon: GitBranch,
    title: "Website -> GitHub -> Cloudflare Pages",
    detail: "Public changes move through GitHub main, local build checks, and a Pages production deployment.",
    signal: "Live"
  }
];

const timeline = [
  {
    icon: GitBranch,
    label: "GitHub push to main",
    time: "latest",
    value: "Telemetry Center Phase 1 prepared for Cloudflare Pages"
  },
  {
    icon: CheckCircle2,
    label: "npm run build passed",
    time: "required",
    value: "Static export must include /console"
  },
  {
    icon: RadioTower,
    label: "Cloudflare Pages production deployed",
    time: "required",
    value: "Production should serve the Mission Control shell"
  },
  {
    icon: Code2,
    label: "/console route active",
    time: "stable",
    value: "Public observation layer stays read-only"
  },
  {
    icon: TerminalSquare,
    label: "Computer Use native pipe path unavailable",
    time: "known issue",
    value: "Repo edits and Playwright remain the main workflow"
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
    label: "Private plane requires access rules",
    detail: "Jellyfin, archive paths, and future controls need a clear boundary.",
    tone: "red" as Tone
  },
  {
    icon: Database,
    label: "Backup policy not confirmed",
    detail: "D1, runbooks, VPS config, and OneDrive retention need a simple policy.",
    tone: "gold" as Tone
  },
  {
    icon: Archive,
    label: "OneDrive archive path pending",
    detail: "Xue and Luo cleanup rules need a final naming and retention decision.",
    tone: "blue" as Tone
  },
  {
    icon: TerminalSquare,
    label: "Computer Use unavailable",
    detail: "Native pipe path is not reliable, so browser automation stays optional.",
    tone: "gold" as Tone
  }
];

const decisionLogs = [
  "Decision: Keep console read-only until Cloudflare Access is wired.",
  "Decision: Treat Computer Use as non-blocking.",
  "Decision: Use Playwright as visual validation fallback.",
  "Decision: Build observation layer before control plane."
];

const logs = [
  {
    icon: RadioTower,
    label: "Latest deploy target",
    value: "Cloudflare Pages production"
  },
  {
    icon: Code2,
    label: "Previous stable commit",
    value: "f9f12dd"
  },
  {
    icon: CheckCircle2,
    label: "Build check",
    value: "npm run build required after upgrade"
  },
  {
    icon: TerminalSquare,
    label: "Computer Use",
    value: "native pipe path unavailable"
  }
];

const mockTelemetry: TelemetrySnapshot = {
  cpuPercent: 8,
  diskPercent: 14,
  heartbeat: "Mock heartbeat ready",
  lastIngest: "Mock signal",
  memoryPercent: 43,
  mode: "mock",
  nodeName: "Xueer observation node",
  onlineUsers: 4
};

function formatPercent(value: number | null) {
  return typeof value === "number" ? `${Math.round(value)}%` : "--";
}

function formatNumber(value: number | null) {
  return typeof value === "number" ? String(value) : "--";
}

function formatTime(value: string) {
  if (!value || value === "Mock signal") {
    return value || "--";
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

export default function SignalDashboard() {
  const [selectedNodeId, setSelectedNodeId] = useState(infrastructureNodes[0].id);
  const [telemetrySnapshot, setTelemetrySnapshot] =
    useState<TelemetrySnapshot>(mockTelemetry);
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
          fetch("/api/telemetry/recent?limit=1", { signal: controller.signal })
        ]);

        if (!healthResponse.ok || !nodesResponse.ok || !recentResponse.ok) {
          throw new Error("Telemetry API unavailable.");
        }

        const [health, nodesPayload, recentPayload] = await Promise.all([
          healthResponse.json(),
          nodesResponse.json(),
          recentResponse.json()
        ]);
        const latest =
          recentPayload.telemetry?.[0] ||
          nodesPayload.nodes?.find((node: { latest?: unknown }) => node.latest)?.latest ||
          null;
        const matchedNode = latest
          ? nodesPayload.nodes?.find((node: { id: string }) => node.id === latest.node_id)
          : null;

        if (!latest) {
          setTelemetrySnapshot({
            cpuPercent: null,
            diskPercent: null,
            heartbeat: "Live backend ready, waiting for first ingest",
            lastIngest: health.timestamp || "--",
            memoryPercent: null,
            mode: "live",
            nodeName: "Awaiting telemetry node",
            onlineUsers: null
          });
          return;
        }

        setTelemetrySnapshot({
          cpuPercent: latest.cpu_percent ?? null,
          diskPercent: latest.disk_percent ?? null,
          heartbeat: "Latest signal received",
          lastIngest: latest.created_at || health.timestamp || "--",
          memoryPercent: latest.memory_percent ?? null,
          mode: "live",
          nodeName: latest.node_name || matchedNode?.name || latest.node_id,
          onlineUsers: latest.online_users ?? null
        });
      } catch {
        if (!controller.signal.aborted) {
          setTelemetrySnapshot(mockTelemetry);
        }
      }
    }

    loadTelemetry();

    return () => controller.abort();
  }, []);

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
            <h2 id="signal-title">Observation layer, armed with context.</h2>
          </div>
          <p>
            This cockpit is intentionally static: enough signal to understand the
            system, no risky controls before a real gate exists.
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

        <aside
          className="console-panel telemetry-center"
          aria-labelledby="telemetry-title"
        >
          <div className="panel-title">
            <p className="eyebrow">telemetry center</p>
            <h2 id="telemetry-title">Cloudflare-native observation backend.</h2>
          </div>
          <div className="telemetry-grid">
            <article className="telemetry-card">
              <span>latest node heartbeat</span>
              <strong>{telemetrySnapshot.nodeName}</strong>
              <p>{telemetrySnapshot.heartbeat}</p>
            </article>
            <article className="telemetry-card">
              <span>cpu / memory / disk</span>
              <strong>
                {formatPercent(telemetrySnapshot.cpuPercent)} /{" "}
                {formatPercent(telemetrySnapshot.memoryPercent)} /{" "}
                {formatPercent(telemetrySnapshot.diskPercent)}
              </strong>
              <p>Small structured telemetry only.</p>
            </article>
            <article className="telemetry-card">
              <span>online users</span>
              <strong>{formatNumber(telemetrySnapshot.onlineUsers)}</strong>
              <p>Latest presence signal from ingest cache.</p>
            </article>
            <article className="telemetry-card">
              <span>last ingest</span>
              <strong>{formatTime(telemetrySnapshot.lastIngest)}</strong>
              <p>Backend mode: {telemetrySnapshot.mode}</p>
            </article>
          </div>
          <div className="cost-guard">
            <Database aria-hidden="true" size={20} strokeWidth={1.9} />
            <p>
              Cost Guard: D1 stores small structured telemetry only. R2 media
              sync is intentionally deferred. No public file serving or download
              automation is enabled yet.
            </p>
          </div>
        </aside>
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
            {timeline.map((item) => {
              const Icon = item.icon;

              return (
                <article className="timeline-item" key={item.label}>
                  <span className="timeline-dot">
                    <Icon aria-hidden="true" size={17} strokeWidth={2} />
                  </span>
                  <div>
                    <span>{item.time}</span>
                    <strong>{item.label}</strong>
                    <p>{item.value}</p>
                  </div>
                </article>
              );
            })}
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
