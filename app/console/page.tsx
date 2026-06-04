import {
  ArrowLeft,
  Sparkles
} from "lucide-react";
import SignalDashboard from "./signal-dashboard";

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

      <SignalDashboard />
    </main>
  );
}
