import {
  ArrowLeft,
  RadioTower,
  ShieldCheck,
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

      <section className="mission-header" aria-labelledby="mission-title">
        <div className="mission-copy">
          <p className="eyebrow">public-safe operations demo</p>
          <h1 aria-label="NX WARDEN / MISSION CONTROL" id="mission-title">
            <span className="title-line">NX WARDEN /</span>
            <span className="title-line">MISSION</span>
            <span className="title-line">CONTROL</span>
          </h1>
          <div className="mission-lines" aria-label="Mission state">
            <span>Read-only operations dashboard active.</span>
            <span>No write actions armed.</span>
            <span>Public edge online.</span>
            <span>Protected details sealed.</span>
          </div>
        </div>

        <aside className="mission-status" aria-label="Current operating state">
          <div className="mission-radar">
            <span className="console-ring" aria-hidden="true" />
            <div>
              <Sparkles aria-hidden="true" size={18} strokeWidth={2} />
              <strong>Observation only</strong>
              <p>No commands are wired into this public layer.</p>
            </div>
          </div>
          <div className="mission-chips" aria-label="Mission control chips">
            <span>
              <RadioTower aria-hidden="true" size={15} strokeWidth={2.1} />
              EDGE: ONLINE
            </span>
            <span>
              <ShieldCheck aria-hidden="true" size={15} strokeWidth={2.1} />
              CONTROL: READ ONLY
            </span>
            <span>
              <Sparkles aria-hidden="true" size={15} strokeWidth={2.1} />
              AUTH: NOT ARMED
            </span>
          </div>
        </aside>
      </section>

      <aside className="public-observation-note" aria-label="Public observation layer notice">
        <ShieldCheck aria-hidden="true" size={18} strokeWidth={2} />
        <p>
          This console shows public-safe system signals only. Sensitive access
          details, internal paths, protected setup details, and machine controls
          are not exposed.
        </p>
      </aside>

      <SignalDashboard />
    </main>
  );
}
