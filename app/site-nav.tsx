import { TerminalSquare } from "lucide-react";

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
    <header className="nav" aria-label="Primary">
      <a className="brand" href="/" aria-label="NX Warden home">
        <span className="brand-mark">
          <img src="/assets/nxwarden-icon-512.png" alt="" />
        </span>
        <span>NX Warden</span>
      </a>
      <nav className="nav-links">
        {links.map((link) => (
          <a href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
        <a className="nav-login" href="/console/">
          Console
        </a>
      </nav>
      <a className="mobile-console-entry" href="/console/">
        <TerminalSquare aria-hidden="true" size={16} strokeWidth={2.1} />
        Console
      </a>
    </header>
  );
}
