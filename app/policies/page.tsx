import { ArrowRight, FileCheck2, ShieldAlert, ShieldCheck } from "lucide-react";
import SiteNav from "../site-nav";
import GlassCard from "../components/glass-card";
import PageHero from "../components/page-hero";
import PageShell from "../components/page-shell";
import SiteFooter from "../components/site-footer";

const policies = [
  {
    icon: ShieldCheck,
    eyebrow: "privacy",
    title: "Privacy",
    href: "/privacy/",
    body: "How website inquiries are handled and how ProofPack keeps its evidence workflow local-first."
  },
  {
    icon: ShieldAlert,
    eyebrow: "security",
    title: "Security",
    href: "/security/",
    body: "Responsible disclosure, safe reporting, and the limits of automated checks."
  },
  {
    icon: FileCheck2,
    eyebrow: "terms",
    title: "Terms",
    href: "/terms/",
    body: "Short, current boundaries for this informational website, request access, and scoped services."
  }
];

export default function PoliciesPage() {
  return (
    <PageShell className="subpage subpage-v2 policies-page">
      <SiteNav />

      <PageHero
        eyebrow="policies"
        id="policies-title"
        title="Public policies, kept proportional."
        description={
          <p>
            These concise pages describe how NX Warden handles website inquiries,
            responsible disclosure, request access, and current service boundaries.
          </p>
        }
      />

      <section className="policy-stack content-band" aria-label="NX Warden public policies">
        {policies.map((policy) => {
          const Icon = policy.icon;
          return (
            <GlassCard className="policy-card" key={policy.href}>
              <Icon aria-hidden="true" size={28} strokeWidth={1.8} />
              <div>
                <p className="eyebrow">{policy.eyebrow}</p>
                <h2>{policy.title}</h2>
                <p>{policy.body}</p>
                <a className="secondary-link" href={policy.href}>
                  {policy.title}
                  <ArrowRight aria-hidden="true" size={17} strokeWidth={2.1} />
                </a>
              </div>
            </GlassCard>
          );
        })}
      </section>
      <SiteFooter />
    </PageShell>
  );
}
