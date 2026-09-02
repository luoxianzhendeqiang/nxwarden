import type { Metadata } from "next";
import { ArrowRight, BookOpenCheck, ShieldCheck, TerminalSquare } from "lucide-react";
import GlassCard from "../../../components/glass-card";
import PageHero from "../../../components/page-hero";
import PageShell from "../../../components/page-shell";
import SectionHeader from "../../../components/section-header";
import SiteFooter from "../../../components/site-footer";
import SiteNav from "../../../site-nav";

export const metadata: Metadata = {
  title: "ProofPack v1.0.0 Documentation | NX Warden",
  description:
    "Public documentation for ProofPack v1.0.0 and its released local-first evidence workflow.",
  alternates: {
    canonical: "https://nxwarden.com/products/proofpack/docs/"
  }
};

const commands = [
  ["version", ".\\.venv\\Scripts\\python.exe generator.py --version"],
  ["init", ".\\.venv\\Scripts\\python.exe generator.py init --output projects\\my-project"],
  ["doctor", ".\\.venv\\Scripts\\python.exe generator.py doctor --project examples\\fictional\\acme-relay"],
  ["check", ".\\.venv\\Scripts\\python.exe generator.py check --project examples\\fictional\\acme-relay"],
  ["build", ".\\.venv\\Scripts\\python.exe generator.py build --project examples\\fictional\\acme-relay"],
  ["preview", ".\\.venv\\Scripts\\python.exe generator.py preview --project examples\\fictional\\acme-relay"]
] as const;

const outputs = [
  "proofpack.html",
  "proofpack.md",
  "compliance_checklist.json",
  "artifact_manifest.json",
  "build_report.json",
  "build_report.md",
  "checksums.sha256",
  "artifacts/"
];

export default function ProofPackDocsPage() {
  return (
    <PageShell className="subpage subpage-v2 proofpack-docs-page">
      <SiteNav />

      <PageHero
        eyebrow="ProofPack v1.0.0 · Released · Documentation"
        id="proofpack-docs-title"
        title="Local-first evidence, documented plainly."
        description={
          <p>
            This compact guide describes the implemented ProofPack v1.0.0
            workflow. Distribution is public documentation plus request access;
            there is no public ZIP or public source repository.
          </p>
        }
        actions={
          <>
            <a className="button primary" href="/contact/">
              Request ProofPack
              <ArrowRight aria-hidden="true" size={17} strokeWidth={2.1} />
            </a>
            <a className="button secondary" href="/products/proofpack/">
              Product overview
            </a>
          </>
        }
      />

      <section className="subpage-section content-band docs-section" aria-labelledby="docs-overview-title">
        <SectionHeader
          eyebrow="01"
          id="docs-overview-title"
          title="Overview"
          description={
            <p>
              ProofPack compiles operator-supplied structured inputs and
              reviewed artifacts into a local evidence bundle. It validates
              the project and scans projected public text and artifact names;
              it does not invent, attest, certify, notarize, or independently
              verify facts.
            </p>
          }
        />
      </section>

      <section className="split-band content-band docs-section" aria-labelledby="docs-access-title">
        <div>
          <p className="eyebrow">02</p>
          <h2 id="docs-access-title">Request access and prerequisites</h2>
        </div>
        <div className="text-panel">
          <p>
            After receiving the ProofPack package from NX Warden, extract it to
            a local working folder. You need Python 3.10 or newer and Jinja2
            from the included <code>requirements.txt</code>.
          </p>
          <pre><code>{`python -m venv .venv
.\\.venv\\Scripts\\python.exe -m pip install -r requirements.txt
.\\.venv\\Scripts\\python.exe generator.py --version`}</code></pre>
        </div>
      </section>

      <section className="subpage-section content-band docs-section" aria-labelledby="docs-quick-start-title">
        <SectionHeader
          eyebrow="03"
          id="docs-quick-start-title"
          title="Quick start"
          description={
            <p>
              Use the included fictional Acme Relay project to inspect the
              complete workflow without using customer or NX Warden operating data.
            </p>
          }
        />
        <pre className="docs-code-block"><code>{`.\\.venv\\Scripts\\python.exe generator.py doctor --project examples\\fictional\\acme-relay
.\\.venv\\Scripts\\python.exe generator.py check --project examples\\fictional\\acme-relay
.\\.venv\\Scripts\\python.exe generator.py build --project examples\\fictional\\acme-relay --generated-at 2030-01-02T03:04:05+00:00
.\\.venv\\Scripts\\python.exe generator.py preview --project examples\\fictional\\acme-relay`}</code></pre>
      </section>

      <section className="subpage-section content-band docs-section" aria-labelledby="docs-commands-title">
        <SectionHeader eyebrow="04" id="docs-commands-title" title="Commands" />
        <div className="docs-command-list">
          {commands.map(([name, command]) => (
            <GlassCard className="docs-command" key={name}>
              <TerminalSquare aria-hidden="true" size={20} strokeWidth={1.8} />
              <strong>{name}</strong>
              <code>{command}</code>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="split-band content-band docs-section" aria-labelledby="docs-inputs-title">
        <div>
          <p className="eyebrow">05</p>
          <h2 id="docs-inputs-title">Inputs</h2>
        </div>
        <div className="text-panel">
          <p>
            A project supplies structured seed data, service notes, boundaries,
            roadmap and founder/operator notes, plus an artifacts folder. Stage
            only material already reviewed as safe for the intended audience.
          </p>
          <p>
            ProofPack does not read the repository-level private quarantine
            while building a public project.
          </p>
        </div>
      </section>

      <section className="subpage-section content-band docs-section" aria-labelledby="docs-outputs-title">
        <SectionHeader
          eyebrow="06"
          id="docs-outputs-title"
          title="Outputs"
          description={<p>The build command writes these local bundle entries.</p>}
        />
        <div className="docs-output-grid">
          {outputs.map((output) => <code key={output}>{output}</code>)}
        </div>
      </section>

      <section className="split-band content-band docs-section" aria-labelledby="docs-privacy-title">
        <div>
          <p className="eyebrow">07</p>
          <h2 id="docs-privacy-title">Privacy model</h2>
        </div>
        <div className="text-panel">
          <ShieldCheck aria-hidden="true" size={28} strokeWidth={1.8} />
          <p>
            ProofPack runs locally and writes to a local project folder. It does
            not upload source material or generated bundles. Publishing and
            sharing remain deliberate operator actions.
          </p>
        </div>
      </section>

      <section className="subpage-section content-band docs-section" aria-labelledby="docs-demo-title">
        <SectionHeader
          eyebrow="08"
          id="docs-demo-title"
          title="Fictional demo"
          description={
            <p>
              Acme Relay is fictional and is not a customer or client
              engagement. Its identities, domains, timestamps, infrastructure,
              and artifacts are documentation-safe demonstration data.
            </p>
          }
        />
      </section>

      <section className="split-band content-band docs-section" aria-labelledby="docs-limitations-title">
        <div>
          <p className="eyebrow">09</p>
          <h2 id="docs-limitations-title">Limitations</h2>
        </div>
        <div className="text-panel">
          <p>
            A passing scan only means configured checks did not find a known
            pattern. Binary artifacts require human review. ProofPack is not an
            auditor, attestation service, compliance certification, or substitute
            for qualified review.
          </p>
        </div>
      </section>

      <section className="subpage-section content-band docs-section" aria-labelledby="docs-security-title">
        <SectionHeader
          eyebrow="10"
          id="docs-security-title"
          title="Security reporting"
          description={
            <p>
              Report a reproducible security issue through the NX Warden contact
              path. Use fictional inputs when possible and do not send passwords,
              API tokens, private keys, or raw credentials by email.
            </p>
          }
        />
      </section>

      <section className="split-band content-band docs-section" aria-labelledby="docs-versioning-title">
        <div>
          <p className="eyebrow">11</p>
          <h2 id="docs-versioning-title">Versioning</h2>
        </div>
        <div className="text-panel">
          <BookOpenCheck aria-hidden="true" size={28} strokeWidth={1.8} />
          <p>
            These docs cover ProofPack v1.0.0, released through public
            documentation and request access. The package remains local-first;
            no public ZIP download or public source repository is available.
          </p>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
