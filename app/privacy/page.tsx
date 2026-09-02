import type { Metadata } from "next";
import { Database, Laptop, ShieldCheck } from "lucide-react";
import GlassCard from "../components/glass-card";
import PageHero from "../components/page-hero";
import PageShell from "../components/page-shell";
import SiteFooter from "../components/site-footer";
import SiteNav from "../site-nav";

export const metadata: Metadata = {
  title: "Privacy | NX Warden",
  description: "How NX Warden handles website inquiries and describes ProofPack's local-first data boundary.",
  alternates: { canonical: "https://nxwarden.com/privacy/" }
};

const items = [
  {
    icon: Database,
    title: "Website inquiries",
    body: "An inquiry can include your name, email address, project type, and message. NX Warden uses that information to review and respond to the request. Do not submit passwords, private keys, API tokens, card details, or raw credentials."
  },
  {
    icon: ShieldCheck,
    title: "Website operation",
    body: "Cloudflare and website infrastructure may process ordinary request, delivery, and security data needed to operate and protect this site. This page does not claim that the public website collects or processes nothing."
  },
  {
    icon: Laptop,
    title: "ProofPack local-first boundary",
    body: "ProofPack runs in the operator's local environment on operator-supplied files. It does not upload source material or generated bundles; publishing or sharing remains an operator decision."
  }
];

export default function PrivacyPage() {
  return (
    <PageShell className="subpage subpage-v2 policy-detail-page">
      <SiteNav />
      <PageHero
        eyebrow="privacy"
        id="privacy-title"
        title="Privacy boundaries for the website and ProofPack."
        description={<p>NexusWarden Technology LLC operates NX Warden and its public inquiry paths.</p>}
      />
      <section className="policy-detail-grid content-band" aria-label="Privacy details">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <GlassCard className="policy-detail-card" key={item.title}>
              <Icon aria-hidden="true" size={25} strokeWidth={1.8} />
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </GlassCard>
          );
        })}
      </section>
      <SiteFooter />
    </PageShell>
  );
}
