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
        title="Send a project inquiry."
        description={<p>
          Use this page for business website, cloud operations, dashboard,
          automation, and documentation requests. Do not submit sensitive login,
          billing, or access details through this form.
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

      <section className="contact contact-page" aria-label="Project inquiry form">
        <div className="contact-copy">
          <p className="eyebrow">secondary form path</p>
          <h2>Use the form if verification loads normally.</h2>
          <p>
            A useful inquiry explains the business goal, current tools, desired
            outcome, timeline, and any review requirements. If Cloudflare
            verification is unavailable, email the intake addresses directly.
            NX Warden is operated by NexusWarden Technology LLC.
          </p>
          <ul className="inquiry-guide" aria-label="Useful inquiry details">
            <li>Project type: website, workflow, dashboard, monitoring, or documentation.</li>
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
