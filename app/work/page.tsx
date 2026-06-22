import {
  ArrowRight,
  ClipboardList,
  FileCheck2,
  LayoutDashboard,
  MonitorCheck,
  ShieldCheck,
  Workflow
} from "lucide-react";
import SiteNav from "../site-nav";

const samples = [
  {
    icon: LayoutDashboard,
    title: "Read-only operations dashboard",
    body: "A public-safe dashboard shell that separates live signals, visual mock data, risk notes, and decision memory."
  },
  {
    icon: MonitorCheck,
    title: "Contact form safety check",
    body: "A production Turnstile contact path with clear inquiry guidance and no sensitive data requested up front."
  },
  {
    icon: Workflow,
    title: "Workflow automation map",
    body: "A small process map showing how repeated steps move from intake to setup, automation, documentation, and handoff."
  },
  {
    icon: ClipboardList,
    title: "Runbook handoff template",
    body: "A practical handoff format for launch notes, ownership boundaries, review cadence, and maintenance reminders."
  }
];

const deliverables = [
  "Small business website setup checklist",
  "Dashboard structure and status language",
  "Workflow automation map",
  "Runbook handoff template",
  "Policy and contact flow review",
  "Public launch verification checklist"
];

export default function WorkPage() {
  return (
    <main className="subpage">
      <SiteNav />

      <section className="subpage-hero" aria-labelledby="work-title">
        <p className="eyebrow">work samples</p>
        <h1 id="work-title">Operating evidence without exposing sensitive systems.</h1>
        <p className="lead">
          These examples are public-safe samples and internal operating
          artifacts, not customer data. They show how NX Warden turns scattered
          digital work into clearer systems, dashboards, and handoff notes.
        </p>
      </section>

      <section className="subpage-section" aria-labelledby="samples-title">
        <div className="section-head compact-head">
          <p className="eyebrow">public-safe proof</p>
          <h2 id="samples-title">Evidence a reviewer can inspect.</h2>
        </div>
        <div className="proof-grid">
          {samples.map((sample) => {
            const Icon = sample.icon;

            return (
              <article className="proof-card" key={sample.title}>
                <Icon aria-hidden="true" size={28} strokeWidth={1.8} />
                <h2>{sample.title}</h2>
                <p>{sample.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="split-band" aria-labelledby="deliverables-title">
        <div>
          <p className="eyebrow">example deliverables</p>
          <h2 id="deliverables-title">Small artifacts that make operations easier to review.</h2>
        </div>
        <div className="deliverable-panel">
          {deliverables.map((item) => (
            <div className="deliverable-row" key={item}>
              <FileCheck2 aria-hidden="true" size={19} strokeWidth={2} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="subpage-section sample-boundary" aria-labelledby="boundary-title">
        <ShieldCheck aria-hidden="true" size={30} strokeWidth={1.8} />
        <div>
          <p className="eyebrow">public boundary</p>
          <h2 id="boundary-title">What stays out of public work samples.</h2>
          <p>
            Public examples do not include real operational addresses, sensitive
            setup details, customer data, unverified testimonials, unverified
            customer logos, or restricted system diagrams. NX Warden shows structure,
            process, and safe evidence.
          </p>
          <a className="secondary-link" href="/console/">
            View operations demo
            <ArrowRight aria-hidden="true" size={17} strokeWidth={2.1} />
          </a>
        </div>
      </section>
    </main>
  );
}
