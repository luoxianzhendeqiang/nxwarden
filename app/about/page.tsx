import { Building2, FileCheck2, ShieldCheck, Sparkles } from "lucide-react";
import SiteNav from "../site-nav";
import GlassCard from "../components/glass-card";
import PageHero from "../components/page-hero";
import PageShell from "../components/page-shell";
import SiteFooter from "../components/site-footer";

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
    body: "NX Warden does not provide regulated finance activities or licensed fund-movement products."
  }
];

export default function AboutPage() {
  return (
    <PageShell className="subpage subpage-v2 about-page">
      <SiteNav />

      <PageHero
        eyebrow="about nx warden"
        id="about-title"
        title="A small cloud automation and operations studio."
        description={<p>
          NX Warden is the public-facing cloud automation and operations studio
          operated by NexusWarden Technology LLC, a Wyoming limited liability
          company.
        </p>}
      />

      <section className="subpage-section content-band" aria-label="Company facts">
        <div className="subpage-grid">
          {facts.map((fact) => {
            const Icon = fact.icon;

            return (
              <GlassCard className="info-card" key={fact.title}>
                <Icon aria-hidden="true" size={26} strokeWidth={1.8} />
                <h2>{fact.title}</h2>
                <p>{fact.body}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="split-band content-band" aria-labelledby="about-focus-title">
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
            client funds and does not provide regulated finance products that
            require specialized licensing.
          </p>
        </div>
      </section>

      <section className="split-band content-band founder-note" aria-labelledby="founder-note-title">
        <div>
          <p className="eyebrow">founder / operator note</p>
          <h2 id="founder-note-title">Systems are only useful when someone can maintain them.</h2>
        </div>
        <div className="text-panel">
          <p>
            NX Warden is intentionally small and practical. The work is less
            about flashy launch theater and more about making a website,
            workflow, dashboard, or runbook easier to understand the next time
            something changes.
          </p>
          <p>
            A good handoff should answer simple questions: what exists, why it
            exists, where the public surface lives, what should be watched, and
            what should stay out of public view.
          </p>
        </div>
      </section>
      <SiteFooter />
    </PageShell>
  );
}
