import { Mail, ShieldCheck } from "lucide-react";
import ContactForm from "../contact-form";
import SiteNav from "../site-nav";

export default function ContactPage() {
  return (
    <main className="subpage">
      <SiteNav />

      <section className="subpage-hero" aria-labelledby="contact-page-title">
        <p className="eyebrow">contact</p>
        <h1 id="contact-page-title">Send a project inquiry.</h1>
        <p className="lead">
          Use this page for business website, cloud operations, dashboard,
          automation, and documentation requests. Do not submit passwords,
          payment details, or private access tokens through this form.
        </p>
      </section>

      <section className="contact contact-page" aria-label="Project inquiry form">
        <div className="contact-copy">
          <p className="eyebrow">business intake</p>
          <h2>Start with scope, not secrets.</h2>
          <p>
            A useful inquiry explains the business goal, current tools, desired
            outcome, timeline, and any review requirements. If the form is not
            available, email the intake address directly.
          </p>
          <a className="contact-email" href="mailto:ceo@nxwarden.com">
            <Mail aria-hidden="true" size={18} strokeWidth={2.1} />
            ceo@nxwarden.com
          </a>
          <p className="small-note">
            <ShieldCheck aria-hidden="true" size={16} strokeWidth={2.1} />
            NX Warden does not ask for client credentials until a written scope
            and access method are agreed.
          </p>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
