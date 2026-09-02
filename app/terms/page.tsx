import type { Metadata } from "next";
import { FileCheck2 } from "lucide-react";
import PageHero from "../components/page-hero";
import PageShell from "../components/page-shell";
import SiteFooter from "../components/site-footer";
import SiteNav from "../site-nav";

export const metadata: Metadata = {
  title: "Terms | NX Warden",
  description: "Current website, ProofPack request-access, and scoped-service boundaries for NX Warden.",
  alternates: { canonical: "https://nxwarden.com/terms/" }
};

export default function TermsPage() {
  return (
    <PageShell className="subpage subpage-v2 policy-detail-page terms-page">
      <SiteNav />
      <PageHero
        eyebrow="terms"
        id="terms-title"
        title="Current terms for an early request-access product."
        description={<p>Short boundaries that match how NX Warden and ProofPack operate today.</p>}
      />
      <section className="terms-panel content-band" aria-labelledby="terms-current-title">
        <FileCheck2 aria-hidden="true" size={28} strokeWidth={1.8} />
        <div>
          <h2 id="terms-current-title">Informational website and request access</h2>
          <p>
            This website is informational. ProofPack v1.0.0 is Released and
            access remains provided by request, with the package and its
            documentation defining the available workflow.
          </p>
          <p>
            Users remain responsible for the accuracy of source material,
            human review of generated output, lawful use, and any decision to
            publish or share a bundle. ProofPack does not certify facts or compliance.
          </p>
          <p>
            NX Warden service work begins only through a separately agreed,
            bounded scope. Public examples and fictional demonstrations do not
            create a client relationship or promise an outcome.
          </p>
        </div>
      </section>
      <SiteFooter />
    </PageShell>
  );
}
