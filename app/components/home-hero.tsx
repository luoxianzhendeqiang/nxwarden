import {
  ArrowRight,
  BookOpen,
  Globe2,
  Layers3,
  Workflow
} from "lucide-react";
import SiteNav from "../site-nav";

const orbitCards = [
  {
    index: "01 / system",
    title: "Business Website",
    body: "A clear public home for services, policies, and project intake.",
    icon: Globe2,
    tone: "violet",
    position: "top"
  },
  {
    index: "02 / operations",
    title: "Dashboard Layer",
    body: "Read-only service signals, risk notes, and maintenance memory.",
    icon: Layers3,
    tone: "gold",
    position: "right"
  },
  {
    index: "03 / documentation",
    title: "Runbook Trail",
    body: "Plain notes that make systems easier to maintain.",
    icon: BookOpen,
    tone: "blue",
    position: "bottom"
  },
  {
    index: "04 / automation",
    title: "Automation Setup",
    body: "Repeatable routines for files, publishing, reports, and handoffs.",
    icon: Workflow,
    tone: "violet",
    position: "left"
  }
] as const;

export default function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="hero-title">
      <img
        className="home-hero__image"
        data-testid="home-orbit-field"
        src="/assets/nxwarden-orbit-field.png"
        alt=""
      />
      <div className="home-hero__shade" aria-hidden="true" />
      <SiteNav />

      <div className="home-hero__copy" id="top">
        <p className="eyebrow">cloud automation and operations studio</p>
        <h1 id="hero-title">
          <span>Turn scattered</span>
          <span>systems into</span>
          <span>a clear</span>
          <span>operations layer.</span>
        </h1>
        <p className="home-hero__lead">
          NX Warden helps independent developers, solo founders, and founder-led
          micro-SaaS businesses turn scattered websites, cloud services,
          automations, monitoring, and runbooks into a clear, maintainable
          operations layer.
        </p>
        <div className="home-hero__actions" aria-label="Site actions">
          <a className="button primary" href="/services/">
            View Services
            <ArrowRight aria-hidden="true" size={17} />
          </a>
          <a className="button ghost" href="/contact/">
            Send Inquiry
            <ArrowRight aria-hidden="true" size={17} />
          </a>
          <a className="button ghost" href="/work/">
            View Work
            <ArrowRight aria-hidden="true" size={17} />
          </a>
        </div>
      </div>

      <div className="home-hero__orbit" aria-label="NX Warden service layers">
        {orbitCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              className={`orbit-card orbit-card--${card.position} orbit-card--${card.tone}`}
              key={card.title}
            >
              <span className="orbit-card__icon">
                <Icon aria-hidden="true" size={25} strokeWidth={1.8} />
              </span>
              <span className="orbit-card__copy">
                <span>{card.index}</span>
                <strong>{card.title}</strong>
                <p>{card.body}</p>
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
