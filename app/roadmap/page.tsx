import {
  ArrowRight,
  BookOpenCheck,
  CalendarCheck,
  ClipboardCheck,
  Compass,
  Layers3
} from "lucide-react";
import SiteNav from "../site-nav";
import GlassCard from "../components/glass-card";
import PageHero from "../components/page-hero";
import PageShell from "../components/page-shell";
import SectionHeader from "../components/section-header";
import SiteFooter from "../components/site-footer";

const lastUpdated = "September 1, 2026";

const roadmap = [
  {
    phase: "Released",
    icon: ClipboardCheck,
    items: [
      "Approved primary and secondary customer profiles",
      "Three bounded service-offer definitions",
      "Public website and protected inquiry flow",
      "Internal sanitized Operations Clarity Audit sample",
      "ProofPack v1.0 — Released"
    ]
  },
  {
    phase: "Active Development",
    icon: Compass,
    items: [
      "Service-offer validation",
      "Public sample deliverables",
      "Customer discovery interviews",
      "Recorded replies, objections, and willingness-to-pay evidence"
    ]
  },
  {
    phase: "Exploratory",
    icon: Layers3,
    items: [
      "Refine scopes from observed customer problems",
      "Publish additional sanitized templates when evidence supports them",
      "Improve intake only after real inquiry patterns emerge",
      "Keep ProofPack product validation on its own track"
    ]
  }
];

const operatingEvidence = [
  {
    title: "Public website",
    detail: "Brand, services, policies, and business boundaries are available for review."
  },
  {
    title: "Contact path",
    detail: "Direct email and a verified form path support project inquiries without sensitive first-message details."
  },
  {
    title: "Work samples",
    detail: "Public-safe screenshots and templates show approach without exposing protected systems."
  },
  {
    title: "Read-only operations demo",
    detail: "The public console demonstrates signal language while keeping control actions locked."
  },
  {
    title: "Documentation pack",
    detail: "Decision notes and runbook-style records support reviewable handoff habits."
  }
];

export default function RoadmapPage() {
  return (
    <PageShell className="subpage subpage-v2 roadmap-page">
      <SiteNav />

      <PageHero
        eyebrow="roadmap"
        id="roadmap-title"
        title="Validate the offers before expanding the product surface."
        description={
          <>
            <p>
              NX Warden is testing whether the approved audience experiences the
              stated operations problems and will pay for bounded help. The next
              evidence comes from honest interviews, public samples, and real
              inquiry patterns, not assumed customer outcomes.
            </p>
            <p>
              ProofPack is a separate local-first product. Its product roadmap
              does not define or inflate NX Warden service claims.
            </p>
            <p className="last-updated">
              <CalendarCheck aria-hidden="true" size={16} strokeWidth={2.1} />
              Last updated: {lastUpdated}
            </p>
          </>
        }
      />

      <section className="subpage-section content-band" aria-labelledby="current-evidence-title">
        <SectionHeader
          eyebrow="current operating evidence"
          id="current-evidence-title"
          title="What is available to review now."
        />
        <div className="evidence-grid">
          {operatingEvidence.map((item) => (
            <GlassCard className="evidence-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="subpage-section content-band" aria-label="Roadmap phases">
        <div className="roadmap-grid">
          {roadmap.map((phase) => {
            const Icon = phase.icon;

            return (
              <GlassCard className="roadmap-card" key={phase.phase}>
                <div className="roadmap-card-head">
                  <Icon aria-hidden="true" size={28} strokeWidth={1.8} />
                  <h2>{phase.phase}</h2>
                </div>
                <ul>
                  {phase.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="split-band content-band" aria-labelledby="roadmap-note-title">
        <div>
          <p className="eyebrow">operating principle</p>
          <h2 id="roadmap-note-title">No overpromising, no pretend scale.</h2>
        </div>
        <div className="text-panel">
          <p>
            The roadmap is intentionally plain. NX Warden is validating three
            bounded service offers around operational clarity, focused
            improvements, and maintainable handoff systems.
          </p>
          <p>
            Website or product development should follow observed customer
            problems. Public samples remain clearly labeled, and ProofPack stays
            a separate local-first product rather than a service engagement.
          </p>
          <a className="secondary-link" href="/work/">
            View work samples
            <ArrowRight aria-hidden="true" size={17} strokeWidth={2.1} />
          </a>
        </div>
      </section>

      <section className="subpage-section content-band roadmap-note" aria-labelledby="roadmap-review-title">
        <BookOpenCheck aria-hidden="true" size={30} strokeWidth={1.8} />
        <div>
          <p className="eyebrow">review posture</p>
          <h2 id="roadmap-review-title">Evidence first, expansion later.</h2>
          <p>
            The next useful step is collecting public-safe evidence through
            discovery interviews, inquiry records, rejection reasons, paid
            willingness, and clearly labeled samples. Nothing here claims
            completed customer work, revenue, or outcomes that do not exist.
          </p>
        </div>
      </section>
      <SiteFooter />
    </PageShell>
  );
}
