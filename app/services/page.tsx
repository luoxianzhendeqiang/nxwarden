import {
  BarChart3,
  Bot,
  Cloud,
  FileText,
  Globe2,
  ListChecks,
  MonitorCheck,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import SiteNav from "../site-nav";

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
    outOfScope: "Guaranteed uptime unless a written agreement defines the service level."
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
      "NX Warden builds practical cloud systems, automation workflows, read-only dashboards, monitoring surfaces, and runbooks for small online operations."
  },
  {
    question: "Who is NX Warden for?",
    answer:
      "It is built for independent creators, small online businesses, solo operators, and small technical teams that need clearer systems without heavy overhead."
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
    <main className="subpage">
      <SiteNav />

      <section className="subpage-hero" aria-labelledby="services-title">
        <p className="eyebrow">services</p>
        <h1 id="services-title">Cloud operations work for small online businesses.</h1>
        <p className="lead">
          NX Warden focuses on practical deliverables: public websites, workflow
          automation, internal dashboards, status visibility, documentation, and
          maintainable handoff notes. The studio is operated by NexusWarden
          Technology LLC.
        </p>
      </section>

      <section className="subpage-section" aria-label="Service lines">
        <div className="service-detail-grid">
          {serviceLines.map((service) => {
            const Icon = service.icon;

            return (
              <article className="service-detail-card" key={service.title}>
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
              </article>
            );
          })}
        </div>
      </section>

      <section className="subpage-section engagement-section" aria-labelledby="engagement-title">
        <div className="section-head compact-head">
          <p className="eyebrow">engagement model</p>
          <h2 id="engagement-title">A small, written path from inquiry to handoff.</h2>
        </div>
        <div className="engagement-grid">
          {engagementModel.map((item) => (
            <article className="engagement-card" key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <p className="engagement-note">
          First inquiries should describe goals and constraints only. Sensitive
          access details should wait until there is written scope and an agreed
          secure handling method.
        </p>
      </section>

      <section className="split-band" aria-labelledby="service-process-title">
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

      <section className="subpage-section" aria-labelledby="limits-title">
        <div className="section-head compact-head">
          <p className="eyebrow">service boundaries</p>
          <h2 id="limits-title">What NX Warden does not do.</h2>
        </div>
        <div className="limits-grid">
          {limits.map((item) => (
            <article className="limit-card" key={item}>
              <ShieldCheck aria-hidden="true" size={22} strokeWidth={2} />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="subpage-section faq-section" aria-labelledby="faq-title">
        <div className="section-head compact-head">
          <p className="eyebrow">faq</p>
          <h2 id="faq-title">Clear answers before a scoped inquiry.</h2>
        </div>
        <div className="faq-grid">
          {faqs.map((item) => (
            <article className="faq-card" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
