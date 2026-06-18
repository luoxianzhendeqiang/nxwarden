import SiteNav from "../site-nav";

export default function LoginPage() {
  return (
    <main>
      <section className="login-screen" aria-labelledby="login-title">
        <img className="hero-bg" src="/assets/blackhole-hero.png" alt="" />
        <div className="hero-shade" aria-hidden="true" />

        <SiteNav />

        <div className="login-shell">
          <div className="login-copy">
            <p className="eyebrow">operator access</p>
            <h1 id="login-title">CONSOLE</h1>
            <p className="lead">
              A future private workspace for authenticated operations. Public
              visitors can use the read-only demo or the project inquiry form.
            </p>
          </div>

          <div className="login-panel">
            <button className="button primary" type="button" disabled>
              Private access coming later
            </button>
            <a className="button ghost" href="/console/">
              View read-only demo
            </a>
            <a className="button ghost" href="/contact/">
              Contact NX Warden
            </a>
            <p className="login-note">
              No login form is active on the public site. Future access should
              be protected by an identity gate before any private actions exist.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
