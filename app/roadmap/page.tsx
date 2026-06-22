import { ArrowRight, BookOpenCheck, ClipboardCheck, Compass, Layers3 } from "lucide-react";
import SiteNav from "../site-nav";

const roadmap = [
  {
    phase: "Current",
    icon: ClipboardCheck,
    items: [
      "Public website and service boundary pages",
      "Inquiry flow with safety check",
      "Read-only operations demo",
      "Documentation pack and decision notes"
    ]
  },
  {
    phase: "Next",
    icon: Compass,
    items: [
      "More public service examples",
      "Reusable public templates",
      "Clearer contact workflow",
      "Founder notes about practical operations"
    ]
  },
  {
    phase: "Later",
    icon: Layers3,
    items: [
      "Lightweight client intake",
      "Dashboard templates",
      "Runbook kits",
      "Content library for small operators"
    ]
  }
];

export default function RoadmapPage() {
  return (
    <main className="subpage">
      <SiteNav />

      <section className="subpage-hero" aria-labelledby="roadmap-title">
        <p className="eyebrow">roadmap</p>
        <h1 id="roadmap-title">A practical path for the studio and its public evidence.</h1>
        <p className="lead">
          NX Warden grows through small, reviewable improvements: clearer
          service examples, better intake, reusable templates, and documentation
          that helps future work start from evidence instead of memory.
        </p>
      </section>

      <section className="subpage-section" aria-label="Roadmap phases">
        <div className="roadmap-grid">
          {roadmap.map((phase) => {
            const Icon = phase.icon;

            return (
              <article className="roadmap-card" key={phase.phase}>
                <div className="roadmap-card-head">
                  <Icon aria-hidden="true" size={28} strokeWidth={1.8} />
                  <h2>{phase.phase}</h2>
                </div>
                <ul>
                  {phase.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="split-band" aria-labelledby="roadmap-note-title">
        <div>
          <p className="eyebrow">operating principle</p>
          <h2 id="roadmap-note-title">No overpromising, no pretend scale.</h2>
        </div>
        <div className="text-panel">
          <p>
            The roadmap is intentionally plain. NX Warden is building a small
            public body of work around cloud systems, workflow automation,
            dashboards, monitoring, and runbooks.
          </p>
          <p>
            Future features should make the studio easier to evaluate and easier
            to work with, while keeping sensitive operational details out of the
            public surface.
          </p>
          <a className="secondary-link" href="/work/">
            View work samples
            <ArrowRight aria-hidden="true" size={17} strokeWidth={2.1} />
          </a>
        </div>
      </section>

      <section className="subpage-section roadmap-note" aria-labelledby="roadmap-review-title">
        <BookOpenCheck aria-hidden="true" size={30} strokeWidth={1.8} />
        <div>
          <p className="eyebrow">review posture</p>
          <h2 id="roadmap-review-title">Evidence first, expansion later.</h2>
          <p>
            The next useful step is collecting public-safe evidence: screenshots,
            work samples, templates, and founder notes that show how NX Warden
            works without claiming customers, revenue, or operational history it
            cannot verify.
          </p>
        </div>
      </section>
    </main>
  );
}
