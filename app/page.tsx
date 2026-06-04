import {
  Activity,
  ArrowUpRight,
  Bot,
  Clapperboard,
  Gauge,
  House,
  Server,
  Wrench
} from "lucide-react";
import ContactForm from "./contact-form";

const systems = [
  {
    index: "01",
    icon: Server,
    title: "Cloud Homebase",
    body: "Personal dashboards, service maps, reverse proxies, TLS, and uptime visibility."
  },
  {
    index: "02",
    icon: Clapperboard,
    title: "Media Automation",
    body: "Download queues, OneDrive archives, filename cleanup, and Jellyfin-ready libraries."
  },
  {
    index: "03",
    icon: Activity,
    title: "Monitoring Field",
    body: "Kuma, Komari, alerts, and simple rituals that keep VPS fleets understandable."
  },
  {
    index: "04",
    icon: Bot,
    title: "AI Workflows",
    body: "Research, notes, lightweight tools, and repeatable workflows for fast decisions."
  }
];

const serviceLinks = [
  {
    icon: House,
    label: "Homepage",
    href: "https://home1.54614614.xyz",
    detail: "Service map",
    status: "Public"
  },
  {
    icon: Clapperboard,
    label: "Jellyfin",
    href: "https://jellyfin.54614614.xyz",
    detail: "Media library",
    status: "Private"
  },
  {
    icon: Gauge,
    label: "Status",
    href: "https://kuma.54614614.xyz/status/xueer",
    detail: "Uptime board",
    status: "Monitored"
  },
  {
    icon: Wrench,
    label: "Tools",
    href: "https://tools.54614614.xyz",
    detail: "Utility bench",
    status: "Experimental"
  }
];

const audienceSignals = [
  "Scattered tools",
  "Messy files",
  "Half-running servers",
  "No calm dashboard"
];

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <img className="hero-bg" src="/assets/blackhole-hero.png" alt="" />
        <div className="hero-shade" aria-hidden="true" />

        <header className="nav" aria-label="Primary">
          <a className="brand" href="#top" aria-label="NX Warden home">
            <span className="brand-mark">
              <img src="/assets/nxwarden-icon-512.png" alt="" />
            </span>
            <span>NX Warden</span>
          </a>
          <nav className="nav-links">
            <a href="#systems">Systems</a>
            <a href="#work">Work</a>
            <a href="#contact">Contact</a>
            <a className="nav-login" href="/login/">
              Console
            </a>
          </nav>
        </header>

        <div className="hero-copy" id="top">
          <p className="eyebrow">private infrastructure studio</p>
          <h1 id="hero-title">SYSTEMS I BUILD</h1>
          <p className="lead">
            I design personal cloud systems, automation pipelines, and quiet web
            experiences that keep running after the first launch.
          </p>
          <div className="actions" aria-label="Site actions">
            <a className="button primary" href="#systems">
              Explore systems
            </a>
            <a className="button ghost" href="#contact">
              Start a build
            </a>
          </div>
        </div>

        <div className="orbit-panel panel-top">
          <span>black hole 03</span>
          <strong>Public Edge</strong>
          <p>A luminous homepage for work, systems, and useful experiments.</p>
        </div>
        <div className="orbit-panel panel-left">
          <span>01 / content engine</span>
          <strong>Self-Media Workflow</strong>
          <p>Downloads, archives, metadata, and publishing loops.</p>
        </div>
        <div className="orbit-panel panel-right">
          <span>02 / signal field</span>
          <strong>AI Intel Source</strong>
          <p>Research surfaces, automation notes, and decision memory.</p>
        </div>
        <div className="orbit-panel panel-bottom">
          <span>03 / decision core</span>
          <strong>Startup Thinking</strong>
          <p>Product taste, durable systems, and fast iteration.</p>
        </div>
      </section>

      <section className="systems" id="systems" aria-labelledby="systems-title">
        <div className="section-head">
          <p className="eyebrow">what i can do</p>
          <h2 id="systems-title">
            A calm operating layer for small teams and personal labs.
          </h2>
        </div>

        <div className="system-grid">
          {systems.map((system) => {
            const Icon = system.icon;

            return (
              <article className="system-card" key={system.title}>
                <div className="card-signal">
                  <span>{system.index}</span>
                  <Icon aria-hidden="true" size={26} strokeWidth={1.8} />
                </div>
                <h3>{system.title}</h3>
                <p>{system.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="work" id="work" aria-labelledby="work-title">
        <div>
          <p className="eyebrow">build trail</p>
          <h2 id="work-title">
            From raw servers to a useful digital company surface.
          </h2>
        </div>
        <ol className="timeline">
          <li>
            <span>Deploy</span>
            <p>Ship a clean public website on the edge.</p>
          </li>
          <li>
            <span>Connect</span>
            <p>
              Keep private services on VPS infrastructure where long-running
              automation belongs.
            </p>
          </li>
          <li>
            <span>Observe</span>
            <p>
              Watch availability, storage flows, and naming hygiene before
              complexity grows.
            </p>
          </li>
        </ol>
      </section>

      <section className="audience" aria-labelledby="audience-title">
        <div className="audience-copy">
          <p className="eyebrow">who it is for</p>
          <h2 id="audience-title">
            For people with useful systems that have outgrown memory.
          </h2>
          <p>
            When tools scatter, files lose names, servers keep running without a
            map, and automation lives in half-finished scripts, NX Warden turns
            the pile into a quiet operating layer.
          </p>
        </div>
        <div className="audience-signals" aria-label="Common symptoms">
          {audienceSignals.map((signal) => (
            <span key={signal}>{signal}</span>
          ))}
        </div>
      </section>

      <section className="portal" aria-labelledby="portal-title">
        <div className="portal-copy">
          <p className="eyebrow">service constellation</p>
          <h2 id="portal-title">Public edge in front. Private machines behind it.</h2>
        </div>
        <div className="portal-links" aria-label="Service links">
          {serviceLinks.map((service) => {
            const Icon = service.icon;

            return (
              <a href={service.href} key={service.label}>
                <span className="service-icon">
                  <Icon aria-hidden="true" size={24} strokeWidth={1.9} />
                </span>
                <span className="service-copy">
                  <strong>{service.label}</strong>
                  <span>{service.detail}</span>
                </span>
                <span className="service-status">{service.status}</span>
                <span className="service-open">
                  Open
                  <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.2} />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="contact-copy">
          <p className="eyebrow">nxwarden.com</p>
          <h2 id="contact-title">
            A small company page with room to become a real operating system.
          </h2>
          <p>
            The public site can stay serverless. The heavy work can stay on the
            machines that already know how to move files, run containers, and
            keep watch.
          </p>
          <a className="contact-email" href="mailto:ceo@nxwarden.com">
            ceo@nxwarden.com
          </a>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
