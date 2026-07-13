import {
  BarChart3,
  Cloud,
  FileText,
  Globe2,
  ListChecks,
  MonitorCheck,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import SiteNav from "../site-nav";
import GlassCard from "../components/glass-card";
import PageHero from "../components/page-hero";
import PageShell from "../components/page-shell";
import SectionHeader from "../components/section-header";
import SiteFooter from "../components/site-footer";

const serviceOffers = [
  {
    icon: ShieldCheck,
    title: "Operations Clarity Audit",
    scope:
      "A no-credentials-first review of public pages plus client-provided screenshots, exports, and documentation. Read-only access is considered only after explicit authorization.",
    deliverables:
      "System inventory, risk-priority map, missing-documentation list, and 30-day action plan.",
    boundaries:
      "No system changes during the audit, no shared master passwords, and no long-term credential retention.",
    startingPoint:
      "Recommended starting point when the current setup is scattered, undocumented, or not yet ready for implementation."
  },
  {
    icon: Cloud,
    title: "Operations Foundation Sprint",
    scope:
      "One agreed, bounded operations improvement across a website, cloud service, workflow, monitoring surface, or related operating layer.",
    deliverables:
      "The agreed configuration, supporting documentation, and clear handoff instructions for the completed scope.",
    boundaries:
      "The customer owns the infrastructure and accounts. Work uses least privilege, excludes out-of-scope legacy problems, does not include continuous management or 24/7 response, and does not retain credentials long term.",
    startingPoint:
      "Best after an audit or when one priority and its success criteria are already clear."
  },
  {
    icon: FileText,
    title: "Runbook & Handoff System",
    scope:
      "A maintainable operating record for one agreed service, system, or workflow whose knowledge currently lives in a founder's memory or scattered notes.",
    deliverables:
      "System overview, ownership and dependency notes, operating procedures, maintenance guidance, and handoff instructions.",
    boundaries:
      "The customer retains ownership and access. Work is limited to the agreed scope, uses least privilege, does not absorb unrelated legacy issues, does not promise 24/7 support, and does not retain credentials long term.",
    startingPoint:
      "Best when work must become repeatable, reviewable, or transferable to another operator."
  }
];

const serviceLines = [
  {
    icon: Globe2,
    title: "Website and domain operations",
    solves: "A clearer public home for a small business, studio, or technical project.",
    deliverable: "A launch checklist, public pages, metadata, policy links, and contact flow review.",
    outOfScope: "Brand claims, customer logos, or business history that cannot be verified."
  },
  {
    icon: ListChecks,
    title: "Workflow automation",
    solves: "Repeated steps that live in memory, scattered notes, or manual routines.",
    deliverable: "A small workflow map, automation checklist, naming rules, and handoff notes.",
    outOfScope: "Unreviewed automation that changes live systems without approval."
  },
  {
    icon: BarChart3,
    title: "Internal dashboards",
    solves: "Operators needing a calm view of services, tasks, risks, and recent events.",
    deliverable: "A read-only dashboard shell with clear cards, filters, and status language.",
    outOfScope: "Public exposure of sensitive operational details."
  },
  {
    icon: MonitorCheck,
    title: "Monitoring and status pages",
    solves: "Small systems that need basic reachability signals and incident context.",
    deliverable: "A monitor list, status summary, alert notes, and review cadence.",
    outOfScope: "Continuous managed operations, guaranteed uptime, or 24/7 response."
  },
  {
    icon: FileText,
    title: "Documentation and runbooks",
    solves: "Useful work that becomes difficult to maintain after the initial setup.",
    deliverable: "Runbook pages, decision notes, ownership boundaries, and maintenance steps.",
    outOfScope: "Storing sensitive access material in public documents."
  },
  {
    icon: Cloud,
    title: "Cloud setup and maintenance",
    solves: "A practical baseline for hosting, deployment, policies, and public availability.",
    deliverable: "Deployment notes, environment checklist, health endpoint review, and rollback notes.",
    outOfScope: "High-risk or restricted-market operations."
  },
  {
    icon: Sparkles,
    title: "AI-assisted workflow tooling",
    solves: "Research, drafting, review loops, and operational memory that need structure.",
    deliverable: "Prompt kits, review checklists, intake templates, and human-reviewed output flows.",
    outOfScope: "Fully autonomous decisions without human review."
  }
];

const limits = [
  "Regulated finance activities or specialized licensed products.",
  "Fund handling, card handling, or client-asset holding.",
  "Restricted-market operations or illegal marketplaces.",
  "Public anonymous network access resale.",
  "Continuous managed operations, emergency response, or 24/7 on-call coverage.",
  "Handling sensitive access material without a written scope and secure method."
];

const engagementModel = [
  {
    step: "01",
    title: "Inquiry",
    text: "Start with the project type, current tools, desired outcome, timeline, and review needs."
  },
  {
    step: "02",
    title: "Scope",
    text: "Agree on deliverables, access method, data handling boundaries, and what should stay out of public view."
  },
  {
    step: "03",
    title: "Setup",
    text: "Create or improve the website, dashboard, workflow, monitor list, or documentation structure."
  },
  {
    step: "04",
    title: "Documentation",
    text: "Capture decisions, maintenance notes, review cadence, and handoff instructions in plain language."
  },
  {
    step: "05",
    title: "Handoff",
    text: "Review what changed, what to watch, and what future work should begin with."
  }
];

const faqs = [
  {
    question: "What does NX Warden do?",
    answer:
      "NX Warden turns scattered websites, cloud services, automations, monitoring, and runbooks into a clearer, maintainable operations layer through three bounded service offers."
  },
  {
    question: "Who is NX Warden for?",
    answer:
      "It is built first for independent developers, solo founders, and founder-led micro-SaaS operators. Small technical studios and small technical teams without dedicated DevOps are a secondary fit."
  },
  {
    question: "Where should a new customer start?",
    answer:
      "Start with the no-credentials-first Operations Clarity Audit when the current setup or priority is unclear. Start with a sprint or runbook engagement only when the bounded outcome is already understood."
  },
  {
    question: "Is NX Warden a regulated finance provider?",
    answer:
      "No. NX Warden is a cloud automation and operations studio, not a regulated finance provider."
  },
  {
    question: "Does NX Warden handle client billing or client funds?",
    answer:
      "No. The studio focuses on software operations, documentation, dashboards, and workflow support."
  },
  {
    question: "Can NX Warden build internal dashboards?",
    answer:
      "Yes. The first version is usually a read-only signal surface that helps organize status, risks, recent changes, and operating notes."
  },
  {
    question: "Can NX Warden help organize workflows and documentation?",
    answer:
      "Yes. Workflow maps, naming rules, runbooks, and handoff templates are a core part of the work."
  },
  {
    question: "How do inquiries work?",
    answer:
      "Send a scoped inquiry with the project type, current tools, goal, timeline, and what needs to be organized, automated, monitored, or documented."
  },
  {
    question: "What should a new inquiry include?",
    answer:
      "Include the business goal, current setup, pain points, desired deliverables, and any review or handoff needs. Do not include sensitive access details in the first message."
  }
];

export default function ServicesPage() {
  return (
    <PageShell className="subpage subpage-v2 services-page">
      <SiteNav />

      <PageHero
        eyebrow="services"
        id="services-title"
        title="A clearer operations layer for founder-run systems."
        description={<p>
          NX Warden provides bounded operations work for independent developers,
          solo founders, and founder-led micro-SaaS operators, with small
          technical studios and teams without dedicated DevOps as a secondary
          fit. The studio is operated by NexusWarden Technology LLC.
        </p>}
      />

      <section className="subpage-section content-band" aria-labelledby="service-offers-title">
        <SectionHeader
          eyebrow="service offers"
          id="service-offers-title"
          title="Three bounded ways to create operational clarity."
          description={<p>
            Each offer has a defined scope, tangible handoff, and explicit
            boundary. The audit is the safest starting point when the current
            operating picture is incomplete.
          </p>}
        />
        <div className="service-detail-grid">
          {serviceOffers.map((offer) => {
            const Icon = offer.icon;

            return (
              <GlassCard className="service-detail-card" key={offer.title}>
                <div className="service-detail-top">
                  <Icon aria-hidden="true" size={28} strokeWidth={1.8} />
                  <h2>{offer.title}</h2>
                </div>
                <dl>
                  <div>
                    <dt>Scope</dt>
                    <dd>{offer.scope}</dd>
                  </div>
                  <div>
                    <dt>Deliverables</dt>
                    <dd>{offer.deliverables}</dd>
                  </div>
                  <div>
                    <dt>Boundaries</dt>
                    <dd>{offer.boundaries}</dd>
                  </div>
                  <div>
                    <dt>Starting point</dt>
                    <dd>{offer.startingPoint}</dd>
                  </div>
                </dl>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="subpage-section content-band" aria-labelledby="service-lines-title">
        <SectionHeader
          eyebrow="supporting capabilities"
          id="service-lines-title"
          title="Supporting capabilities"
          description={<p>
            These capabilities support the three offers above. They are not a
            separate menu of unbounded products.
          </p>}
        />
        <div className="service-detail-grid">
          {serviceLines.map((service) => {
            const Icon = service.icon;

            return (
              <GlassCard className="service-detail-card" key={service.title}>
                <div className="service-detail-top">
                  <Icon aria-hidden="true" size={28} strokeWidth={1.8} />
                  <h2>{service.title}</h2>
                </div>
                <dl>
                  <div>
                    <dt>Solves</dt>
                    <dd>{service.solves}</dd>
                  </div>
                  <div>
                    <dt>Small deliverable</dt>
                    <dd>{service.deliverable}</dd>
                  </div>
                  <div>
                    <dt>Out of scope</dt>
                    <dd>{service.outOfScope}</dd>
                  </div>
                </dl>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="subpage-section content-band engagement-section" aria-labelledby="engagement-title">
        <SectionHeader
          eyebrow="engagement model"
          id="engagement-title"
          title="A small, written path from inquiry to handoff."
        />
        <div className="engagement-grid">
          {engagementModel.map((item) => (
            <GlassCard className="engagement-card" key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </GlassCard>
          ))}
        </div>
        <p className="engagement-note">
          First inquiries should describe goals and constraints only. Sensitive
          access details should wait until there is written scope and an agreed
          secure handling method.
        </p>
      </section>

      <section className="split-band content-band" aria-labelledby="service-process-title">
        <div>
          <p className="eyebrow">project rhythm</p>
          <h2 id="service-process-title">Scoped, documented, and reviewable.</h2>
        </div>
        <div className="text-panel">
          <p>
            Every project starts with a written scope: what will be built, what
            access method is needed, what data is handled, and what handoff
            notes should exist when the work is complete.
          </p>
          <p>
            Public deliverables are written for reviewers and future buyers. Sensitive
            operational details stay out of public pages unless there is a clear
            business reason to publish a safe summary.
          </p>
          <a className="button primary fit-button" href="/contact/">
            Send Inquiry
          </a>
        </div>
      </section>

      <section className="subpage-section content-band" aria-labelledby="limits-title">
        <SectionHeader
          eyebrow="service boundaries"
          id="limits-title"
          title="What NX Warden does not do."
        />
        <div className="limits-grid">
          {limits.map((item) => (
            <GlassCard className="limit-card" key={item}>
              <ShieldCheck aria-hidden="true" size={22} strokeWidth={2} />
              <p>{item}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="subpage-section content-band faq-section" aria-labelledby="faq-title">
        <SectionHeader
          eyebrow="faq"
          id="faq-title"
          title="Clear answers before a scoped inquiry."
        />
        <div className="faq-grid">
          {faqs.map((item) => (
            <GlassCard className="faq-card" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </GlassCard>
          ))}
        </div>
      </section>
      <SiteFooter />
    </PageShell>
  );
}
