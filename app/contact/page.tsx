import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import ContactForm from "../contact-form";
import SiteNav from "../site-nav";
import GlassCard from "../components/glass-card";
import PageHero from "../components/page-hero";
import PageShell from "../components/page-shell";
import SectionHeader from "../components/section-header";
import SiteFooter from "../components/site-footer";

const directContacts = [
  {
    label: "Founder inbox",
    href: "mailto:ceo@nxwarden.com?subject=NX%20Warden%20Inquiry",
    value: "ceo@nxwarden.com",
    note: "Best for scoped project inquiries and reviewer follow-up."
  },
  {
    label: "General intake",
    href: "mailto:info@nxwarden.com?subject=NX%20Warden%20Inquiry",
    value: "info@nxwarden.com",
    note: "Use this if the safety check is unavailable or the form cannot send."
  }
];

export default function ContactPage() {
  return (
    <PageShell className="subpage subpage-v2 contact-view">
      <SiteNav />

      <PageHero
        eyebrow="contact"
        id="contact-page-title"
        title="Start with the operations problem."
        description={<p>
          Ask about an Operations Clarity Audit, Operations Foundation Sprint,
          Runbook &amp; Handoff System, or a bounded website, workflow, or dashboard
          project. Do not submit sensitive login, billing, or access details.
        </p>}
      />

      <section className="subpage-section content-band contact-priority" aria-labelledby="direct-contact-title">
        <SectionHeader
          eyebrow="direct contact"
          id="direct-contact-title"
          title="Email is the primary contact path."
        />
        <div className="direct-contact-grid">
          {directContacts.map((contact) => (
            <GlassCard className="direct-contact-card" key={contact.value}>
              <span>{contact.label}</span>
              <a href={contact.href}>
                <Mail aria-hidden="true" size={18} strokeWidth={2.1} />
                {contact.value}
              </a>
              <p>{contact.note}</p>
            </GlassCard>
          ))}
          <GlassCard className="direct-contact-card action-card">
            <span>email client</span>
            <a href="mailto:ceo@nxwarden.com?cc=info@nxwarden.com&subject=NX%20Warden%20Inquiry">
              Open email client
              <ArrowRight aria-hidden="true" size={17} strokeWidth={2.1} />
            </a>
            <p>
              Start with project type, goal, timeline, and review needs. Do not
              send sensitive access details in the first message.
            </p>
          </GlassCard>
        </div>
      </section>

      <section
        className="split-band content-band proofpack-request-guide"
        data-testid="proofpack-request-guide"
        aria-labelledby="proofpack-request-title"
      >
        <div>
          <p className="eyebrow">ProofPack · request access</p>
          <h2 id="proofpack-request-title">Looking for ProofPack?</h2>
          <p>
            ProofPack v1.0.0 is Released through public documentation and
            request access. Email the primary intake path to
            describe the local evidence workflow you want to evaluate.
          </p>
        </div>
        <div className="text-panel">
          <dl className="proofpack-request-fields">
            <div><dt>Product</dt><dd>ProofPack v1.0.0 · Released</dd></div>
            <div><dt>Use case</dt><dd>What completed technical work should become reviewable evidence?</dd></div>
            <div><dt>Environment</dt><dd>Optional: operating system and Python version.</dd></div>
            <div><dt>Evidence to package</dt><dd>Optional: describe artifact categories, not private files.</dd></div>
          </dl>
          <p className="small-note">
            <ShieldCheck aria-hidden="true" size={16} strokeWidth={2.1} />
            Please do not send secrets or credentials by email.
          </p>
          <a className="secondary-link" href="mailto:ceo@nxwarden.com?subject=ProofPack%20v1.0.0%20Request%20Access">
            Request ProofPack by email
            <ArrowRight aria-hidden="true" size={17} strokeWidth={2.1} />
          </a>
        </div>
      </section>

      <section className="contact contact-page" aria-label="Project inquiry form">
        <div className="contact-copy">
          <p className="eyebrow">secondary form path</p>
          <h2>Use the form if verification loads normally.</h2>
          <p>
            A useful inquiry explains the operating problem, current tools,
            desired outcome, timeline, and review requirements. The Operations
            Clarity Audit is the no-credentials-first starting point when the
            current setup or priority is unclear. If Cloudflare verification is
            unavailable, email the intake addresses directly. NX Warden is
            operated by NexusWarden Technology LLC.
          </p>
          <ul className="inquiry-guide" aria-label="Useful inquiry details">
            <li>Project type: choose one service offer, a bounded project, or Not sure yet.</li>
            <li>Current tools: where the work lives today and what feels scattered.</li>
            <li>Desired outcome: what should be organized, automated, monitored, or documented.</li>
          </ul>
          <a className="contact-email" href="mailto:ceo@nxwarden.com?subject=NX%20Warden%20Inquiry">
            <Mail aria-hidden="true" size={18} strokeWidth={2.1} />
            ceo@nxwarden.com
          </a>
          <p className="small-note">
            <ShieldCheck aria-hidden="true" size={16} strokeWidth={2.1} />
            NX Warden does not ask for sensitive access materials until a written scope
            and access method are agreed.
          </p>
        </div>
        <ContactForm />
      </section>
      <SiteFooter />
    </PageShell>
  );
}
