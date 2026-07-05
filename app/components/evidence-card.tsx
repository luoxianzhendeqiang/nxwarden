import { ArrowUpRight } from "lucide-react";

type EvidenceCardProps = {
  href: string;
  image: string;
  eyebrow: string;
  title: string;
  description: string;
};

export default function EvidenceCard({
  href,
  image,
  eyebrow,
  title,
  description
}: EvidenceCardProps) {
  return (
    <a className="evidence-card-v2" data-testid="evidence-card" href={href}>
      <span className="evidence-card-v2__media">
        <img src={image} alt="" loading="lazy" />
      </span>
      <span className="evidence-card-v2__copy">
        <span className="eyebrow">{eyebrow}</span>
        <strong>{title}</strong>
        <span>{description}</span>
      </span>
      <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2} />
    </a>
  );
}
