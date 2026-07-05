import EvidenceCard from "./evidence-card";

const evidence = [
  {
    href: "/",
    image: "/assets/proof/home-proof.png",
    eyebrow: "Public company surface",
    title: "Clear public positioning",
    description: "Services, legal identity, and direct contact context."
  },
  {
    href: "/console/",
    image: "/assets/proof/console-proof.png",
    eyebrow: "Read-only console",
    title: "Public-safe operations view",
    description:
      "Signals and locked controls without private infrastructure details."
  },
  {
    href: "/contact/",
    image: "/assets/proof/contact-proof.png",
    eyebrow: "Inquiry path",
    title: "Email-first contact",
    description: "Direct business email with a protected secondary form."
  },
  {
    href: "/work/",
    image: "/assets/proof/work-sample-proof.png",
    eyebrow: "Work sample",
    title: "Reviewable operating evidence",
    description: "Public-safe examples with clear scope and boundaries."
  }
] as const;

export default function EvidenceBand() {
  return (
    <section
      className="evidence-band"
      data-testid="evidence-band"
      aria-labelledby="evidence-band-title"
    >
      <header className="evidence-band__header">
        <p className="eyebrow">public operating evidence</p>
        <h2 id="evidence-band-title">Built surfaces, not borrowed logos.</h2>
        <p>
          Real public-safe pages show the company surface, inquiry path, and
          read-only operations approach.
        </p>
      </header>
      <div className="evidence-band__grid">
        {evidence.map((item) => (
          <EvidenceCard {...item} key={item.title} />
        ))}
      </div>
    </section>
  );
}
