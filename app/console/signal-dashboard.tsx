"use client";

import { useState } from "react";
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

type Service = {
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

const consoleTabs = [
  "Overview",
  "Services",
  "Flows",
  "Logs",
  "Access"
];

const pulseCards = [
  {
    icon: Activity,
    label: "System Pulse",
    value: "Reachable",
    body: "All public services report a usable public surface. Private services stay marked for access review.",
    tone: "green" as Tone
  },
  {
    icon: HardDrive,
    label: "Storage Flow",
    value: "Connected",
    body: "OneDrive archive is present as a system path. Next layer should verify selected Jellyfin scan folders.",
    tone: "gold" as Tone
  },
  {
    icon: Server,
    label: "Service Map",
    value: "5 tracked",
    body: "Homepage, Jellyfin, Status, Tools, and OneDrive Archive now have detail signals.",
    tone: "blue" as Tone
  },
  {
    icon: FileClock,
    label: "Automation Trail",
    value: "ceea657",
    body: "Last stable console shell shipped to main before the Signal Dashboard layer.",
    tone: "gold" as Tone
  }
];

const services: Service[] = [
  {
    endpoint: "nxwarden.com / home1.54614614.xyz",
    icon: Globe2,
    id: "homepage",
    lastCheck: "Production deploy verified after ceea657",
    name: "Homepage",
    nextAction: "Keep Console entry visible and migrate future public links to 614451.xyz.",
    riskNote: "Public edge is healthy; old 54614614 links should be phased out before renewal.",
    signal: "Cloudflare Pages",
    status: "Online",
    visibility: "Public"
  },
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
    endpoint: "kuma.54614614.xyz/status/xueer",
    icon: Gauge,
    id: "status",
    lastCheck: "Public status page reviewed",
    name: "Status",
    nextAction: "Add 614451 endpoints once the new domain migration starts.",
    riskNote: "Status page is public by design; sensitive monitor names should stay bland.",
    signal: "Uptime Kuma",
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
  },
  {
    endpoint: "Xue archive path for TG downloads",
    icon: Archive,
    id: "archive",
    lastCheck: "rclone chunk size fixed to 80M on DC03",
    name: "OneDrive Archive",
    nextAction: "Confirm final folder policy for Xue and Luo before automating larger cleanup.",
    riskNote: "Archive paths are working, but retention and backup policy are not confirmed.",
    signal: "Xue archive flow",
    status: "Connected",
    visibility: "Private"
  }
];

const flows = [
  {
    icon: Cloud,
    title: "Downloads -> Rename -> Archive -> Jellyfin",
    detail: "Telegram media is downloaded, numeric prefixes are cleaned, files move into OneDrive, and Jellyfin scans selected folders later.",
    signal: "Observed"
  },
  {
    icon: Bot,
    title: "Notes -> AI Intel -> Decision Memory",
    detail: "Research fragments, deployment choices, and operating notes should become durable memory instead of vanishing into chat.",
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
    value: "Console shell committed and pushed"
  },
  {
    icon: CheckCircle2,
    label: "npm run build passed",
    time: "latest",
    value: "Static export includes /console"
  },
  {
    icon: RadioTower,
    label: "Cloudflare Pages production deployed",
    time: "latest",
    value: "Production deploy served from nxwarden.com"
  },
  {
    icon: Code2,
    label: "/console route created",
    time: "previous",
    value: "Read-only layer began as inner control room"
  },
  {
    icon: TerminalSquare,
    label: "Computer Use native pipe path unavailable",
    time: "known issue",
    value: "Repo edits and CLI remain the main workflow"
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
    label: "Private services require access rules",
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

const logs = [
  {
    icon: RadioTower,
    label: "Latest deploy",
    value: "Cloudflare Pages production deployed"
  },
  {
    icon: Code2,
    label: "Latest stable commit",
    value: "ceea657"
  },
  {
    icon: CheckCircle2,
    label: "Build check",
    value: "npm run build passed"
  },
  {
    icon: TerminalSquare,
    label: "Computer Use",
    value: "native pipe path unavailable"
  }
];

export default function SignalDashboard() {
  const [selectedServiceId, setSelectedServiceId] = useState(services[0].id);
  const selectedService =
    services.find((service) => service.id === selectedServiceId) ?? services[0];
  const SelectedIcon = selectedService.icon;

  return (
    <>
      <nav className="console-tabs" aria-label="Console sections">
        {consoleTabs.map((tab) => (
          <a href={`#${tab.toLowerCase()}`} key={tab}>
            <span className="tab-light" aria-hidden="true" />
            {tab}
          </a>
        ))}
      </nav>

      <section
        className="console-section"
        id="overview"
        aria-labelledby="overview-title"
      >
        <div className="console-section-head">
          <div>
            <p className="eyebrow">overview</p>
            <h2 id="overview-title">System state, reduced to signals.</h2>
          </div>
          <p>
            This layer is intentionally read-only: enough structure to reveal the
            product, no risky controls before access rules exist.
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

      <section className="console-grid" aria-label="Signal Dashboard">
        <div className="console-panel services-panel" id="services">
          <div className="panel-title">
            <p className="eyebrow">services</p>
            <h2>Service map</h2>
          </div>
          <div className="service-dashboard">
            <div className="service-table" aria-label="Tracked services">
              {services.map((service) => {
                const Icon = service.icon;
                const isSelected = service.id === selectedService.id;

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`console-row service-button${isSelected ? " active" : ""}`}
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    type="button"
                  >
                    <span className="row-icon">
                      <Icon aria-hidden="true" size={20} strokeWidth={1.9} />
                    </span>
                    <span>
                      <strong>{service.name}</strong>
                      <small>{service.signal}</small>
                    </span>
                    <span className="row-scope">{service.visibility}</span>
                    <span className="row-status">{service.status}</span>
                  </button>
                );
              })}
            </div>

            <aside className="service-detail" aria-live="polite">
              <div className="detail-topline">
                <span className="row-icon">
                  <SelectedIcon aria-hidden="true" size={20} strokeWidth={1.9} />
                </span>
                <div>
                  <p className="eyebrow">detail drawer</p>
                  <h3>{selectedService.name}</h3>
                </div>
              </div>
              <dl className="detail-list">
                <div>
                  <dt>Status</dt>
                  <dd>{selectedService.status}</dd>
                </div>
                <div>
                  <dt>Visibility</dt>
                  <dd>{selectedService.visibility}</dd>
                </div>
                <div>
                  <dt>Endpoint</dt>
                  <dd>{selectedService.endpoint}</dd>
                </div>
                <div>
                  <dt>Last check</dt>
                  <dd>{selectedService.lastCheck}</dd>
                </div>
                <div>
                  <dt>Risk note</dt>
                  <dd>{selectedService.riskNote}</dd>
                </div>
                <div>
                  <dt>Next action</dt>
                  <dd>{selectedService.nextAction}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>

        <div className="console-panel" id="flows">
          <div className="panel-title">
            <p className="eyebrow">flows</p>
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

        <div className="console-panel timeline-panel" id="logs">
          <div className="panel-title">
            <p className="eyebrow">logs</p>
            <h2>Recent timeline</h2>
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
          className="console-panel memory-panel"
          aria-labelledby="memory-title"
        >
          <Sparkles aria-hidden="true" size={26} strokeWidth={1.8} />
          <div>
            <p className="eyebrow">system memory</p>
            <h2 id="memory-title">A place for decisions to stop evaporating.</h2>
            <p>
              Deployment notes, service paths, script rituals, cert decisions,
              archive rules, and recovery steps will eventually live here as a
              durable operating memory for NX Warden.
            </p>
          </div>
        </aside>

        <aside
          className="console-panel console-lock"
          id="access"
          aria-label="Access note"
        >
          <ShieldCheck aria-hidden="true" size={26} strokeWidth={1.8} />
          <div>
            <p className="eyebrow">access posture</p>
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
