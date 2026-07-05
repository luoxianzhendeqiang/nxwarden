const footerLinks = [
  ["Services", "/services/"],
  ["Work", "/work/"],
  ["About", "/about/"],
  ["Contact", "/contact/"],
  ["Policies", "/policies/"]
] as const;

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>NX Warden</strong>
        <p>Cloud Automation &amp; Operations Studio</p>
      </div>
      <nav aria-label="Footer">
        {footerLinks.map(([label, href]) => (
          <a href={href} key={href}>
            {label}
          </a>
        ))}
      </nav>
      <p>NX Warden is operated by NexusWarden Technology LLC.</p>
    </footer>
  );
}
