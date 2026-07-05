import { Menu, TerminalSquare } from "lucide-react";

const links = [
  { href: "/services/", label: "Services" },
  { href: "/work/", label: "Work" },
  { href: "/roadmap/", label: "Roadmap" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
  { href: "/policies/", label: "Policies" }
];

export default function SiteNav() {
  return (
    <header className="site-nav" aria-label="Primary">
      <a className="site-brand" href="/" aria-label="NX Warden home">
        <span className="brand-mark">
          <img src="/assets/nxwarden-icon-512.png" alt="" />
        </span>
        <span>NX Warden</span>
      </a>
      <nav className="site-nav__desktop">
        {links.map((link) => (
          <a href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
        <a className="site-nav__console" href="/console/">
          <TerminalSquare aria-hidden="true" size={15} />
          Console
        </a>
      </nav>
      <details className="site-nav__mobile">
        <summary aria-label="Open navigation">
          <Menu aria-hidden="true" size={21} />
        </summary>
        <nav aria-label="Mobile">
          {links.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
          <a href="/console/">Console</a>
        </nav>
      </details>
    </header>
  );
}
