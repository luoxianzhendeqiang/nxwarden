import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Cloud,
  FileText,
  Globe2,
  LayoutDashboard,
  Mail,
  ShieldCheck,
  Workflow
} from "lucide-react";
import ContactForm from "./contact-form";
import SiteNav from "./site-nav";

const services = [
  {
    index: "01",
    icon: Cloud,
    title: "Cloud Systems",
    body: "Public websites, edge hosting, status checks, and clear launch notes for small operations."
  },
  {
    index: "02",
    icon: Workflow,
    title: "Workflow Automation",
    body: "Repeatable intake, publishing, file organization, reporting, and operations routines."
  },
  {
    index: "03",
    icon: LayoutDashboard,
    title: "Internal Dashboards",
    body: "Read-only status views that help small teams understand services, tasks, risks, and history."
  },
  {
    index: "04",
    icon: Globe2,
    title: "Website & Domain Operations",
    body: "Professional public pages, metadata, contact paths, policy pages, and release checklists."
  },
  {
    index: "05",
    icon: BarChart3,
    title: "Monitoring",
    body: "Lightweight signals for public health, recent changes, and operational follow-up."
  },
  {
    index: "06",
    icon: ClipboardList,
    title: "Documentation & Runbooks",
    body: "Plain-language operating notes so useful systems can be maintained after launch."
  }
];

const workSteps = [
  {
    label: "Discover",
    text: "Clarify the current tools, rough edges, desired outcome, and review requirements."
  },
  {
    label: "Set up",
    text: "Put the website, dashboard, workflow, or operating surface in a stable starting shape."
  },
  {
    label: "Automate",
    text: "Turn repeated steps into reviewable routines that stay understandable."
  },
  {
    label: "Document",
    text: "Leave behind runbooks, checklists, and service notes that make the system understandable."
  },
  {
    label: "Handoff",
    text: "Summarize what changed, what to watch, and where future work should begin."
  }
];

const boundaries = [
  "No regulated finance activities or specialized licensed products.",
  "No restricted-market operations.",
  "No public network-access resale or anonymous access products.",
  "No handling of sensitive access materials unless the project scope and retention rules are documented."
];

const demoSignals = [
  {
    icon: Globe2,
    title: "Public Site",
    detail: "Clear company positioning, service pages, and safe contact paths."
  },
  {
    icon: BarChart3,
    title: "Operations Demo",
    detail: "A public-safe, read-only view of what an internal dashboard can become."
  },
  {
    icon: ShieldCheck,
    title: "Trust Boundaries",
    detail: "Policies and service limits written plainly for reviewers and future buyers."
  },
  {
    icon: FileText,
    title: "Runbook Habit",
    detail: "Decisions, deployment notes, and maintenance routines captured as work happens."
  }
];

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <img className="hero-bg" src="/assets/blackhole-hero.png" alt="" />
        <div className="hero-shade" aria-hidden="true" />

        <SiteNav />

        <div className="hero-copy" id="top">
          <p className="eyebrow">cloud automation and operations studio</p>
          <h1 id="hero-title">
            <span className="title-line">Practical</span>
            <span className="title-line">systems</span>
            <span className="title-line">for real</span>
            <span className="title-line">online work.</span>
          </h1>
          <p className="lead">
            NX Warden builds practical cloud systems, automation workflows, and
            internal dashboards for independent creators and small online
            businesses.
          </p>
          <div className="actions" aria-label="Site actions">
            <a className="button primary" href="/services/">
              View Services
            </a>
            <a className="button ghost" href="/contact/">
              Send Inquiry
            </a>
            <a className="button ghost" href="/work/">
              View Work
            </a>
          </div>
          <a className="secondary-link" href="/console/">
            View operations demo
            <ArrowRight aria-hidden="true" size={17} strokeWidth={2.1} />
          </a>
        </div>

        <div className="orbit-panel panel-top">
          <span>company surface</span>
          <strong>Business Website</strong>
          <p>A clear public home for services, policies, and project intake.</p>
        </div>
        <div className="orbit-panel panel-left">
          <span>01 / workflow</span>
          <strong>Automation Setup</strong>
          <p>Repeatable routines for files, publishing, reports, and handoffs.</p>
        </div>
        <div className="orbit-panel panel-right">
          <span>02 / operations</span>
          <strong>Dashboard Layer</strong>
          <p>Read-only service signals, risk notes, and maintenance memory.</p>
        </div>
        <div className="orbit-panel panel-bottom">
          <span>03 / documentation</span>
          <strong>Runbook Trail</strong>
          <p>Plain notes that make systems easier to maintain.</p>
        </div>
      </section>

      <section className="systems" id="services" aria-labelledby="services-title">
        <div className="section-head">
          <p className="eyebrow">what nx warden does</p>
          <h2 id="services-title">
            Useful operations work without unnecessary complexity.
          </h2>
        </div>

        <div className="system-grid">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article className="system-card" key={service.title}>
                <div className="card-signal">
                  <span>{service.index}</span>
                  <Icon aria-hidden="true" size={26} strokeWidth={1.8} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="work" id="work" aria-labelledby="work-title">
        <div>
          <p className="eyebrow">how we work</p>
          <h2 id="work-title">Small systems, written down and kept understandable.</h2>
        </div>
        <ol className="timeline">
          {workSteps.map((step) => (
            <li key={step.label}>
              <span>{step.label}</span>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="audience" aria-labelledby="audience-title">
        <div className="audience-copy">
          <p className="eyebrow">built for</p>
          <h2 id="audience-title">
            For creators and operators whose tools need a clearer home.
          </h2>
          <p>
            NX Warden is for small online businesses, solo founders, and
            independent creators who need a practical website, reliable
            workflows, simple status visibility, and documentation that survives
            busy weeks.
          </p>
        </div>
        <div className="audience-signals" aria-label="Common needs">
          <span>Business website and domain operations</span>
          <span>Workflow automation and file organization</span>
          <span>Read-only operations dashboards</span>
          <span>Documentation and maintenance runbooks</span>
        </div>
      </section>

      <section className="portal" aria-labelledby="portal-title">
        <div className="portal-copy">
          <p className="eyebrow">operations demo</p>
          <h2 id="portal-title">A public-safe preview of the dashboard approach.</h2>
        </div>
        <div className="portal-links" aria-label="Public-safe demo signals">
          {demoSignals.map((signal) => {
            const Icon = signal.icon;

            return (
              <a href={signal.title === "Operations Demo" ? "/console/" : "/services/"} key={signal.title}>
                <span className="service-icon">
                  <Icon aria-hidden="true" size={24} strokeWidth={1.9} />
                </span>
                <span className="service-copy">
                  <strong>{signal.title}</strong>
                  <span>{signal.detail}</span>
                </span>
                <span className="service-status">Public-safe</span>
                <span className="service-open">
                  Open
                  <ArrowRight aria-hidden="true" size={16} strokeWidth={2.2} />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="trust" aria-labelledby="trust-title">
        <div className="trust-copy">
          <p className="eyebrow">trust boundaries</p>
          <h2 id="trust-title">What NX Warden does not do.</h2>
          <p>
            NX Warden is a software automation and cloud operations studio. It
            does not offer regulated finance activities or operate restricted businesses.
          </p>
        </div>
        <div className="trust-grid">
          {boundaries.map((boundary) => (
            <article className="boundary-card" key={boundary}>
              <CheckCircle2 aria-hidden="true" size={22} strokeWidth={2} />
              <p>{boundary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="contact-copy">
          <p className="eyebrow">nxwarden.com</p>
          <h2 id="contact-title">Start with a scoped project inquiry.</h2>
          <p>
            Tell NX Warden what needs to be organized, automated, monitored, or
            published. If the form is unavailable, email the business intake
            address directly.
          </p>
          <a className="contact-email" href="mailto:ceo@nxwarden.com">
            <Mail aria-hidden="true" size={18} strokeWidth={2.1} />
            ceo@nxwarden.com
          </a>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
