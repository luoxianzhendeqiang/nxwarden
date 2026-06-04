import {
  Activity,
  Archive,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  FileClock,
  Gauge,
  GitBranch,
  Globe2,
  HardDrive,
  Lock,
  MonitorCheck,
  RadioTower,
  Server,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Wrench
} from "lucide-react";

const pulseCards = [
  {
    icon: Activity,
    label: "System Pulse",
    value: "Reachable",
    body: "All public services reachable. Private services protected behind access rules.",
    tone: "green"
  },
  {
    icon: HardDrive,
    label: "Storage Flow",
    value: "Connected",
    body: "OneDrive archive connected. Media library waiting for next sync.",
    tone: "gold"
  },
  {
    icon: Server,
    label: "Service Map",
    value: "4 tracked",
    body: "Homepage, Jellyfin, Status, and Tools stay visible from the public edge.",
    tone: "blue"
  },
  {
    icon: FileClock,
    label: "Automation Trail",
    value: "816fe58",
    body: "Last build: homepage hierarchy refined. Latest commit: 816fe58.",
    tone: "gold"
  }
];

const services = [
  {
    icon: Globe2,
    name: "Homepage",
    scope: "Public",
    signal: "Cloudflare Pages",
    status: "Online"
  },
  {
    icon: MonitorCheck,
    name: "Jellyfin",
    scope: "Private",
    signal: "Media library",
    status: "Protected"
  },
  {
    icon: Gauge,
    name: "Status",
    scope: "Monitored",
    signal: "Uptime Kuma",
    status: "Watching"
  },
  {
    icon: Wrench,
    name: "Tools",
    scope: "Experimental",
    signal: "Utility bench",
    status: "Available"
  },
  {
    icon: Archive,
    name: "OneDrive Archive",
    scope: "Private",
    signal: "Xue archive flow",
    status: "Connected"
  }
];

const flows = [
  {
    icon: Cloud,
    title: "Downloads -> Rename -> Archive -> Jellyfin",
    detail: "Telegram media lands in a clean archive path before Jellyfin scans selected folders."
  },
  {
    icon: Bot,
    title: "Notes -> AI Intel -> Decision Memory",
    detail: "Research fragments become decisions instead of disappearing into chat history."
  },
  {
    icon: GitBranch,
    title: "Website -> GitHub -> Cloudflare Pages",
    detail: "Public changes move through source control, build checks, and edge deployment."
  }
];

const logs = [
  {
    icon: RadioTower,
    label: "Latest deploy",
    value: "Cloudflare Pages production check pending"
  },
  {
    icon: Code2,
    label: "Latest commit",
    value: "816fe58"
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

export default function ConsolePage() {
  return (
    <main className="console-page">
      <header className="console-nav" aria-label="Console navigation">
        <a className="brand" href="/" aria-label="NX Warden home">
          <span className="brand-mark">
            <img src="/assets/nxwarden-icon-512.png" alt="" />
          </span>
          <span>NX Warden</span>
        </a>
        <nav className="console-nav-links">
          <a href="/">
            <ArrowLeft aria-hidden="true" size={16} strokeWidth={2.2} />
            Home
          </a>
          <a className="active" href="/console/">
            Console
          </a>
        </nav>
      </header>

      <section className="console-hero" aria-labelledby="console-title">
        <div className="console-hero-copy">
          <p className="eyebrow">personal infrastructure os</p>
          <h1 id="console-title">CONSOLE</h1>
          <p className="lead">
            A read-only prototype for the operating layer behind NX Warden:
            public edge in front, private machines behind it, and memory moved
            into systems.
          </p>
        </div>

        <div className="console-orbit" aria-label="Current operating state">
          <span className="console-ring" aria-hidden="true" />
          <div>
            <Sparkles aria-hidden="true" size={18} strokeWidth={2} />
            <strong>Inner control room</strong>
            <p>Static signal only. No commands are wired yet.</p>
          </div>
        </div>
      </section>

      <section className="console-section" aria-labelledby="overview-title">
        <div className="console-section-head">
          <div>
            <p className="eyebrow">overview</p>
            <h2 id="overview-title">System state, reduced to signals.</h2>
          </div>
          <p>
            This first console layer is intentionally read-only: enough shape to
            reveal the product, no risky controls before access rules exist.
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

      <section className="console-grid" aria-label="Console details">
        <div className="console-panel services-panel">
          <div className="panel-title">
            <p className="eyebrow">services</p>
            <h2>Service map</h2>
          </div>
          <div className="service-table">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div className="console-row" key={service.name}>
                  <span className="row-icon">
                    <Icon aria-hidden="true" size={20} strokeWidth={1.9} />
                  </span>
                  <span>
                    <strong>{service.name}</strong>
                    <small>{service.signal}</small>
                  </span>
                  <span className="row-scope">{service.scope}</span>
                  <span className="row-status">{service.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="console-panel">
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
                    <strong>{flow.title}</strong>
                    <p>{flow.detail}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="console-panel logs-panel">
          <div className="panel-title">
            <p className="eyebrow">logs</p>
            <h2>Recent trail</h2>
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

        <aside className="console-panel console-lock" aria-label="Access note">
          <ShieldCheck aria-hidden="true" size={26} strokeWidth={1.8} />
          <div>
            <p className="eyebrow">access posture</p>
            <h2>Public prototype. Private controls later.</h2>
            <p>
              Login, write actions, and machine commands stay out of this layer
              until the real authorization model is chosen.
            </p>
          </div>
          <Lock aria-hidden="true" size={18} strokeWidth={2.1} />
        </aside>
      </section>
    </main>
  );
}
