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
    title: "Homepage proof",
    image: "/assets/proof/home-proof.png",
    shows: "A public website surface with positioning, services, operating boundaries, and inquiry paths.",
    safe: "It shows the public brand and service language a reviewer can inspect.",
    excluded: "Sensitive access details, operational addresses, and restricted diagrams are intentionally excluded."
  },
  {
    icon: MonitorCheck,
    title: "Contact form safety check",
    image: "/assets/proof/contact-proof.png",
    shows: "A production contact path with direct email fallback and Cloudflare verification.",
    safe: "It asks for scope, goals, and review needs instead of sensitive setup material.",
    excluded: "Secrets, login material, card details, and private access instructions are not requested."
  },
  {
    icon: LayoutDashboard,
    title: "Read-only operations demo",
    image: "/assets/proof/console-proof.png",
    shows: "A locked Mission Control demo for status, risks, evidence sources, and decision memory.",
    safe: "It is public-safe and read-only, with no command path exposed.",
    excluded: "Protected service details, sensitive access material, and machine controls are not shown."
  },
  {
    icon: Workflow,
    title: "Roadmap and work sample proof",
    image: "/assets/proof/work-sample-proof.png",
    shows: "A public-safe work sample surface with templates, runbooks, and reviewable deliverables.",
    safe: "It demonstrates process and handoff style without claiming unverified scale.",
    excluded: "Customer data, testimonials, and unsupported operating history are intentionally absent."
  },
  {
    icon: ClipboardList,
    title: "Runbook handoff template",
    image: "",
    shows: "A practical handoff format for launch notes, ownership boundaries, review cadence, and maintenance reminders.",
    safe: "It can be reviewed as a template before any sensitive project material is shared.",
    excluded: "Passwords, restricted access material, and private setup values are not part of public samples."
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
                {sample.image ? (
                  <img className="proof-image" src={sample.image} alt="" />
                ) : (
                  <div className="proof-placeholder" aria-hidden="true">
                    <Icon size={34} strokeWidth={1.8} />
                  </div>
                )}
                <div className="proof-card-body">
                  <div className="proof-title-row">
                    <Icon aria-hidden="true" size={24} strokeWidth={1.8} />
                    <h2>{sample.title}</h2>
                  </div>
                  <dl className="proof-facts">
                    <div>
                      <dt>Shows</dt>
                      <dd>{sample.shows}</dd>
                    </div>
                    <div>
                      <dt>Public-safe</dt>
                      <dd>{sample.safe}</dd>
                    </div>
                    <div>
                      <dt>Excluded</dt>
                      <dd>{sample.excluded}</dd>
                    </div>
                  </dl>
                </div>
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
