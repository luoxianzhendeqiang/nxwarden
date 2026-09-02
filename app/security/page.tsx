import type { Metadata } from "next";
import { Bug, CheckCircle2, ShieldAlert } from "lucide-react";
import GlassCard from "../components/glass-card";
import PageHero from "../components/page-hero";
import PageShell from "../components/page-shell";
import SiteFooter from "../components/site-footer";
import SiteNav from "../site-nav";

export const metadata: Metadata = {
  title: "Security | NX Warden",
  description: "Responsible disclosure and public security boundaries for NX Warden and ProofPack.",
  alternates: { canonical: "https://nxwarden.com/security/" }
};

export default function SecurityPage() {
  return (
    <PageShell className="subpage subpage-v2 policy-detail-page">
      <SiteNav />
      <PageHero
        eyebrow="security"
        id="security-title"
        title="Responsible disclosure without exposing more risk."
        description={
          <p>
            Send a concise responsible disclosure report to
            {" "}<a href="mailto:ceo@nxwarden.com?subject=Responsible%20Disclosure">ceo@nxwarden.com</a>.
          </p>
        }
      />
      <section className="policy-detail-grid content-band" aria-label="Security guidance">
        <GlassCard className="policy-detail-card">
          <Bug aria-hidden="true" size={25} strokeWidth={1.8} />
          <h2>What to include</h2>
          <p>
            Describe the affected public surface, reproduction steps, expected
            behavior, and observed impact. Use fictional or redacted material
            when possible.
          </p>
        </GlassCard>
        <GlassCard className="policy-detail-card">
          <ShieldAlert aria-hidden="true" size={25} strokeWidth={1.8} />
          <h2>What not to send</h2>
          <p>
            Do not email passwords, private keys, API tokens, raw credentials,
            customer data, or unnecessary infrastructure identifiers. Do not
            disrupt services or access data beyond what is needed to describe
            the issue.
          </p>
        </GlassCard>
        <GlassCard className="policy-detail-card">
          <CheckCircle2 aria-hidden="true" size={25} strokeWidth={1.8} />
          <h2>ProofPack boundary</h2>
          <p>
            ProofPack scans configured text and artifact names, but a clean scan
            does not prove a bundle is safe or complete. ProofPack does not
            provide compliance certification.
          </p>
        </GlassCard>
      </section>
      <SiteFooter />
    </PageShell>
  );
}
