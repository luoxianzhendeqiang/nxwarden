export default function LoginPage() {
  return (
    <main>
      <section className="login-screen" aria-labelledby="login-title">
        <img className="hero-bg" src="/assets/blackhole-hero.png" alt="" />
        <div className="hero-shade" aria-hidden="true" />

        <header className="nav" aria-label="Primary">
          <a className="brand" href="/" aria-label="NX Warden home">
            <span className="brand-mark">
              <img src="/assets/nxwarden-icon-512.png" alt="" />
            </span>
            <span>NX Warden</span>
          </a>
          <nav className="nav-links">
            <a href="/#systems">Systems</a>
            <a href="/#work">Work</a>
            <a href="/#contact">Contact</a>
            <a className="nav-login active" href="/login/">
              Login
            </a>
          </nav>
        </header>

        <div className="login-shell">
          <div className="login-copy">
            <p className="eyebrow">operator access</p>
            <h1 id="login-title">LOGIN</h1>
            <p className="lead">
              A quiet entry point for the private control room. Authentication
              can be connected after the public intake line is stable.
            </p>
          </div>

          <form className="login-panel">
            <label>
              <span>Email</span>
              <input type="email" value="ceo@nxwarden.com" readOnly />
            </label>
            <label>
              <span>Password</span>
              <input type="password" value="nxwarden" readOnly />
            </label>
            <button className="button primary" type="button" disabled>
              Coming soon
            </button>
            <p className="login-note">
              Public requests still go through the contact form. This door is
              reserved for a future admin dashboard.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
