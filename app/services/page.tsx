import {
  BarChart3,
  Cloud,
  FileText,
  Globe2,
  ListChecks,
  Sparkles
} from "lucide-react";
import SiteNav from "../site-nav";

const serviceLines = [
  {
    icon: Cloud,
    title: "Cloud Infrastructure Setup",
    points: [
      "Domain and hosting setup",
      "Edge deployment and basic availability checks",
      "Service documentation and safe handoff notes"
    ]
  },
  {
    icon: ListChecks,
    title: "Automation Workflow Design",
    points: [
      "File organization and naming routines",
      "Publishing and reporting workflows",
      "Repeatable operating checklists"
    ]
  },
  {
    icon: Globe2,
    title: "Website & Domain Operations",
    points: [
      "Public company pages",
      "Contact and inquiry flows",
      "Professional metadata, policy pages, and launch notes"
    ]
  },
  {
    icon: BarChart3,
    title: "Internal Dashboards & Monitoring",
    points: [
      "Read-only service status surfaces",
      "Risk notes and timeline views",
      "Lightweight operations summaries"
    ]
  },
  {
    icon: FileText,
    title: "Documentation & Runbooks",
    points: [
      "Deployment notes",
      "Maintenance routines",
      "Decision logs and ownership boundaries"
    ]
  },
  {
    icon: Sparkles,
    title: "AI-Assisted Workflow Tooling",
    points: [
      "Research and drafting surfaces",
      "Structured prompts and review loops",
      "Human-reviewed automation support"
    ]
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
          automation, internal dashboards, status visibility, and documentation.
          The studio is operated by NexusWarden Technology LLC.
        </p>
      </section>

      <section className="subpage-section" aria-label="Service lines">
        <div className="service-list">
          {serviceLines.map((service) => {
            const Icon = service.icon;

            return (
              <article className="service-line" key={service.title}>
                <Icon aria-hidden="true" size={28} strokeWidth={1.8} />
                <div>
                  <h2>{service.title}</h2>
                  <ul>
                    {service.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="split-band" aria-labelledby="service-process-title">
        <div>
          <p className="eyebrow">project rhythm</p>
          <h2 id="service-process-title">Scoped, documented, and reviewable.</h2>
        </div>
        <div className="text-panel">
          <p>
            Every project starts with a written scope: what will be built, what
            access is needed, what data is handled, and what handoff notes should
            exist when the work is complete.
          </p>
          <p>
            Public deliverables are written for clients and reviewers. Private
            operational details stay out of the public website unless there is a
            clear business reason to publish them.
          </p>
        </div>
      </section>
    </main>
  );
}
