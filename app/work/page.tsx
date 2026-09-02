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
import EvidenceCard from "../components/evidence-card";
import GlassCard from "../components/glass-card";
import PageHero from "../components/page-hero";
import PageShell from "../components/page-shell";
import SectionHeader from "../components/section-header";
import SiteFooter from "../components/site-footer";

const samples = [
  {
    icon: LayoutDashboard,
    kind: "Public screenshot",
    title: "Homepage proof",
    image: "/assets/proof/home-proof.png",
    href: "/",
    shows: "A public website surface with positioning, services, operating boundaries, and inquiry paths.",
    safe: "It shows the public brand and service language a reviewer can inspect.",
    excluded: "Sensitive access details, operational addresses, and restricted diagrams are intentionally excluded."
  },
  {
    icon: MonitorCheck,
    kind: "Public screenshot",
    title: "Contact form safety check",
    image: "/assets/proof/contact-proof.png",
    href: "/contact/",
    shows: "A published contact path with direct email fallback and Cloudflare verification.",
    safe: "It asks for scope, goals, and review needs instead of sensitive setup material.",
    excluded: "Secrets, login material, card details, and private access instructions are not requested."
  },
  {
    icon: LayoutDashboard,
    kind: "Read-only demo",
    title: "Read-only operations demo",
    image: "/assets/proof/console-proof.png",
    href: "/console/",
    shows: "A locked Mission Control demo for status, risks, evidence sources, and decision memory.",
    safe: "It is public-safe and read-only, with no command path exposed.",
    excluded: "Protected service details, sensitive access material, and machine controls are not shown."
  },
  {
    icon: Workflow,
    kind: "Public-safe sample",
    title: "Roadmap and work sample proof",
    image: "/assets/proof/work-sample-proof.png",
    href: "/roadmap/",
    shows: "A public-safe work sample surface with templates, runbooks, and reviewable deliverables.",
    safe: "It demonstrates process and handoff style without claiming unverified scale.",
    excluded: "Customer data, testimonials, and unsupported operating history are intentionally absent."
  },
  {
    icon: ClipboardList,
    kind: "Internal template",
    title: "Runbook handoff template",
    image: "",
    href: "",
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

const auditSampleDeliverables = [
  "System inventory",
  "Risk-priority map",
  "Missing-documentation list",
  "30-day action plan"
];

export default function WorkPage() {
  return (
    <PageShell className="subpage subpage-v2 work-page">
      <SiteNav />

      <PageHero
        eyebrow="work samples"
        id="work-title"
        title="Operating evidence without exposing sensitive systems."
        description={<p>
          These examples are public-safe samples and internal operating
          artifacts, not customer data. They show how NX Warden turns scattered
          digital work into clearer systems, dashboards, and handoff notes.
        </p>}
      />

      <section className="work-classifications content-band" aria-labelledby="work-classifications-title">
        <div>
          <p className="eyebrow">work labels</p>
          <h2 id="work-classifications-title">Know what kind of evidence you are viewing.</h2>
        </div>
        <div className="work-classification-list" aria-label="Work classifications">
          <span>Product development</span>
          <span>Internal infrastructure</span>
          <span>Client / service work</span>
          <span>Fictional demonstration</span>
        </div>
      </section>

      <section className="subpage-section content-band" aria-labelledby="samples-title">
        <SectionHeader
          eyebrow="public-safe proof"
          id="samples-title"
          title="Evidence a reviewer can inspect."
        />
        <div className="proof-grid proof-grid-v2">
          {samples.map((sample) => {
            const Icon = sample.icon;

            if (sample.image) {
              return (
                <div className="work-evidence-item" key={sample.title}>
                  <EvidenceCard
                    href={sample.href}
                    image={sample.image}
                    eyebrow={sample.kind}
                    title={sample.title}
                    description={sample.shows}
                  />
                  <dl className="proof-facts">
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
              );
            }

            return (
              <GlassCard className="proof-card" key={sample.title}>
                <div className="proof-placeholder" aria-hidden="true">
                  <Icon size={34} strokeWidth={1.8} />
                </div>
                <div className="proof-card-body">
                  <div className="proof-title-row">
                    <Icon aria-hidden="true" size={24} strokeWidth={1.8} />
                    <div>
                      <span className="proof-kind">{sample.kind}</span>
                      <h2>{sample.title}</h2>
                    </div>
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
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="split-band content-band" aria-labelledby="audit-sample-title">
        <div>
          <p className="eyebrow">internal / sanitized sample</p>
          <h2 id="audit-sample-title">Operations Clarity Audit sample</h2>
          <p>
            This is an internal, sanitized sample created to show the delivery
            format. It is not a customer engagement and does not represent a
            customer outcome, testimonial, or operating history.
          </p>
        </div>
        <div className="deliverable-panel" aria-label="Audit sample deliverables">
          {auditSampleDeliverables.map((item) => (
            <div className="deliverable-row" key={item}>
              <FileCheck2 aria-hidden="true" size={19} strokeWidth={2} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="split-band content-band" aria-labelledby="proofpack-sample-title">
        <div>
          <p className="eyebrow">fictional product example</p>
          <h2 id="proofpack-sample-title">ProofPack fictional example</h2>
          <p>
            Acme Relay is a fictional demonstration, not a customer or client
            engagement. It was created for ProofPack v1.0.0 and is not evidence
            of a customer outcome. It is not customer work.
          </p>
        </div>
        <div className="text-panel">
          <p>
            The example shows how fictional logs, checks, deployment notes, and
            selected artifacts become a report, manifest, artifact directory,
            and checksum index without exposing a real operating environment.
          </p>
          <a className="secondary-link" href="/products/proofpack/#acme-relay-example">
            View the Acme Relay example
            <ArrowRight aria-hidden="true" size={17} strokeWidth={2.1} />
          </a>
        </div>
      </section>

      <section className="split-band content-band" aria-labelledby="deliverables-title">
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

      <section className="subpage-section content-band sample-boundary" aria-labelledby="boundary-title">
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
      <SiteFooter />
    </PageShell>
  );
}
