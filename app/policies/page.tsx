import { FileCheck2, ShieldAlert, ShieldCheck } from "lucide-react";
import SiteNav from "../site-nav";

const acceptableUse = [
  "No regulated finance activities or specialized licensed products.",
  "No restricted-market operations or illegal marketplaces.",
  "No anonymous access resale, abuse infrastructure, spam, phishing, malware, or account-data harvesting.",
  "No submission of passwords, sensitive keys, card details, or sensitive access materials unless a written project scope defines the secure handling method."
];

export default function PoliciesPage() {
  return (
    <main className="subpage">
      <SiteNav />

      <section className="subpage-hero" aria-labelledby="policies-title">
        <p className="eyebrow">policies</p>
        <h1 id="policies-title">Public policies and acceptable use.</h1>
        <p className="lead">
          These simple policies describe how NX Warden, operated by
          NexusWarden Technology LLC, presents its services, handles inquiries,
          and limits the type of work it accepts.
        </p>
      </section>

      <section className="policy-stack" aria-label="NX Warden public policies">
        <article className="policy-card" id="privacy">
          <ShieldCheck aria-hidden="true" size={28} strokeWidth={1.8} />
          <div>
            <p className="eyebrow">privacy policy</p>
            <h2>Inquiry data is used to respond to project requests.</h2>
            <p>
              NX Warden may collect the name, email address, project type, and
              message submitted through the contact form. This information is
              used to review and respond to the inquiry. NX Warden does not sell
              inquiry data. NexusWarden Technology LLC operates the NX Warden
              public site and business intake process.
            </p>
            <p>
              Visitors should not submit passwords, sensitive keys, card
              details, or highly sensitive access materials through public forms.
            </p>
          </div>
        </article>

        <article className="policy-card" id="terms">
          <FileCheck2 aria-hidden="true" size={28} strokeWidth={1.8} />
          <div>
            <p className="eyebrow">service boundaries</p>
            <h2>Projects begin with written scope and reviewable boundaries.</h2>
            <p>
              Public website content is informational and does not create a
              client relationship by itself. Paid work should be described in a
              written scope that lists deliverables, access needs, timelines,
              data handling expectations, and handoff requirements.
            </p>
            <p>
              NX Warden provides cloud automation, operations documentation,
              dashboard, website, and workflow support. It does not provide
              regulated finance activities, fund handling, credit products, or
              regulated services.
            </p>
            <p>
              Uptime targets, incident response, and ongoing maintenance are
              defined only when a written agreement includes those obligations.
              Otherwise, public examples and demos are informational.
            </p>
          </div>
        </article>

        <article className="policy-card" id="acceptable-use">
          <ShieldAlert aria-hidden="true" size={28} strokeWidth={1.8} />
          <div>
            <p className="eyebrow">acceptable use policy</p>
            <h2>NX Warden does not accept restricted or high-risk use cases.</h2>
            <ul>
              {acceptableUse.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </article>
      </section>
    </main>
  );
}
