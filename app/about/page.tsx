import { Building2, FileCheck2, ShieldCheck, Sparkles } from "lucide-react";
import SiteNav from "../site-nav";

const facts = [
  {
    icon: Building2,
    title: "Company",
    body: "NX Warden is operated by NexusWarden Technology LLC, a Wyoming limited liability company."
  },
  {
    icon: Sparkles,
    title: "Operating Model",
    body: "Founder-led, remote-first, and focused on practical software automation work."
  },
  {
    icon: FileCheck2,
    title: "Deliverables",
    body: "Websites, cloud operations setup, internal dashboards, documentation, and runbooks."
  },
  {
    icon: ShieldCheck,
    title: "Boundaries",
    body: "NX Warden does not provide regulated financial products or licensed fund-movement services."
  }
];

export default function AboutPage() {
  return (
    <main className="subpage">
      <SiteNav />

      <section className="subpage-hero" aria-labelledby="about-title">
        <p className="eyebrow">about nx warden</p>
        <h1 id="about-title">A small cloud automation and operations studio.</h1>
        <p className="lead">
          NX Warden is the public-facing cloud automation and operations studio
          operated by NexusWarden Technology LLC, a Wyoming limited liability
          company.
        </p>
      </section>

      <section className="subpage-section" aria-label="Company facts">
        <div className="subpage-grid">
          {facts.map((fact) => {
            const Icon = fact.icon;

            return (
              <article className="info-card" key={fact.title}>
                <Icon aria-hidden="true" size={26} strokeWidth={1.8} />
                <h2>{fact.title}</h2>
                <p>{fact.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="split-band" aria-labelledby="about-focus-title">
        <div>
          <p className="eyebrow">focus</p>
          <h2 id="about-focus-title">Practical systems that stay understandable.</h2>
        </div>
        <div className="text-panel">
          <p>
            NX Warden works on the connective tissue of a small digital
            operation: the company website, domain setup, workflow automation,
            service visibility, documentation, and simple reporting surfaces.
          </p>
          <p>
            The studio helps independent creators, small online businesses, and
            technical operators turn useful but scattered digital work into
            clearer websites, workflows, dashboards, and operating notes.
          </p>
          <p>
            The business is a software operations studio. It does not hold
            client funds and does not provide regulated financial products or
            services that require financial licensing.
          </p>
        </div>
      </section>
    </main>
  );
}
