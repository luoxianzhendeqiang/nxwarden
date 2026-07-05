import type { ReactNode } from "react";
import Reveal from "./reveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: ReactNode;
  actions?: ReactNode;
  id: string;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  actions,
  id
}: PageHeroProps) {
  return (
    <section className="page-hero" aria-labelledby={id}>
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h1 id={id}>{title}</h1>
        <div className="page-hero__description">{description}</div>
        {actions ? <div className="page-hero__actions">{actions}</div> : null}
      </Reveal>
    </section>
  );
}
