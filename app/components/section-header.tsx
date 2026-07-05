import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  id: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  id
}: SectionHeaderProps) {
  return (
    <header className="section-header">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {description ? (
        <div className="section-header__description">{description}</div>
      ) : null}
    </header>
  );
}
