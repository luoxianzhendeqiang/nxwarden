import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  FileArchive,
  FolderTree,
  ShieldCheck
} from "lucide-react";
import GlassCard from "../../components/glass-card";
import PageHero from "../../components/page-hero";
import PageShell from "../../components/page-shell";
import SectionHeader from "../../components/section-header";
import SiteFooter from "../../components/site-footer";
import SiteNav from "../../site-nav";

export const metadata: Metadata = {
  title: "ProofPack — Local-first Operating Evidence | NX Warden",
  description:
    "ProofPack is a local-first operating evidence compiler for turning reviewed technical work into a structured, checksum-backed evidence bundle.",
  alternates: {
    canonical: "https://nxwarden.com/products/proofpack/"
  },
  openGraph: {
    title: "ProofPack — Local-first Operating Evidence | NX Warden",
    description:
      "Compile reviewed technical work into a local, structured operating evidence bundle.",
    url: "https://nxwarden.com/products/proofpack/",
    type: "website"
  }
};

const releaseArtifactSha256 =
  "66832f2d038bab61ccdbc60a2305337393a39fc6a4391a3c7605cd4f2c937cec";

const evidenceFlow = [
  {
    title: "Collect intentionally",
    body: "Choose the logs, commands, checks, and deployment artifacts that belong in the evidence bundle."
  },
  {
    title: "Compile locally",
    body: "Build the bundle in the operator's environment instead of uploading the private workspace to a hosted service."
  },
  {
    title: "Review before sharing",
    body: "Inspect the report, manifest, selected artifacts, and checksums as one bounded package."
  }
];

const exampleContents = [
  "Fictional service inventory and deployment notes",
  "Fictional health-check and verification artifacts",
  "Generated report, manifest, selected artifacts, and checksums",
  "No customer systems, credentials, outcomes, or private operating data"
];

export default function ProofPackPage() {
  return (
    <PageShell className="subpage subpage-v2 proofpack-page">
      <SiteNav />

      <PageHero
        eyebrow="ProofPack v1.0.0 · Released"
        id="proofpack-title"
        title="Operating evidence, packaged."
        description={
          <>
            <p>
              A local-first compiler for turning operating work into structured,
              shareable evidence.
            </p>
            <p>
              Turn logs, commands, checks and deployment artifacts into a
              structured evidence bundle — locally.
            </p>
          </>
        }
        actions={
          <>
            <a className="button primary" href="/contact/">
              Request ProofPack
              <ArrowRight aria-hidden="true" size={17} strokeWidth={2.1} />
            </a>
            <a className="button secondary" href="/products/proofpack/docs/">
              Read Documentation
            </a>
            <a className="button secondary" href="#acme-relay-example">
              View Example
            </a>
          </>
        }
      />

      <section className="split-band content-band" aria-labelledby="proofpack-principle-title">
        <div>
          <p className="eyebrow">product principle</p>
          <h2 id="proofpack-principle-title">Backstage stays backstage.</h2>
        </div>
        <div className="text-panel">
          <ShieldCheck aria-hidden="true" size={28} strokeWidth={1.8} />
          <p>
            ProofPack packages the evidence you choose to share without turning
            your private operating environment into the deliverable.
          </p>
          <p className="proofpack-principle-line">
            Your work happened once. Its evidence should remain useful.
          </p>
        </div>
      </section>

      <section className="subpage-section content-band" aria-labelledby="proofpack-flow-title">
        <SectionHeader
          eyebrow="local-first workflow"
          id="proofpack-flow-title"
          title="Choose the evidence. Compile the package. Review the result."
          description={
            <p>
              ProofPack v1 keeps the operating workspace and the public-facing
              evidence package as separate things.
            </p>
          }
        />
        <div className="proofpack-flow-grid">
          {evidenceFlow.map((item, index) => (
            <GlassCard className="proofpack-flow-card" key={item.title}>
              <span>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="split-band content-band proofpack-output" aria-labelledby="proofpack-output-title">
        <div>
          <p className="eyebrow">v1 output</p>
          <h2 id="proofpack-output-title">A small, reviewable evidence bundle.</h2>
          <p>
            The current compiler produces a report, machine-readable manifest,
            selected evidence artifacts, and a checksum index.
          </p>
        </div>
        <div className="proofpack-tree-panel" data-testid="proofpack-output-tree">
          <div className="proofpack-tree-panel__head">
            <FolderTree aria-hidden="true" size={21} strokeWidth={1.8} />
            <span>Generated bundle</span>
          </div>
          <div className="proofpack-tree-rows" aria-label="ProofPack v1 output structure">
            <div className="proofpack-tree-row">
              <span>Manifest</span>
              <code>artifact_manifest.json</code>
            </div>
            <div className="proofpack-tree-row">
              <span>Report</span>
              <code>build_report.md</code>
            </div>
            <div className="proofpack-tree-row">
              <span>Evidence</span>
              <code>artifacts/</code>
            </div>
            <div className="proofpack-tree-row">
              <span>Checksums</span>
              <code>checksums.sha256</code>
            </div>
          </div>
        </div>
      </section>

      <section className="split-band content-band proofpack-release" aria-labelledby="proofpack-release-title">
        <div>
          <p className="eyebrow">release evidence</p>
          <h2 id="proofpack-release-title">Released with a reviewable evidence trail.</h2>
        </div>
        <div className="text-panel">
          <p>
            ProofPack v1.0.0 is released through public documentation and
            request access.
          </p>
          <p className="proofpack-release__hash-label">
            Release artifact SHA-256:
          </p>
          <code className="proofpack-release__hash">{releaseArtifactSha256}</code>
          <p>
            This SHA-256 identifies an internally retained v1.0.0 release
            artifact. No public ZIP download is currently available.
          </p>
        </div>
      </section>

      <section
        className="subpage-section content-band proofpack-example"
        id="acme-relay-example"
        aria-labelledby="acme-relay-title"
      >
        <SectionHeader
          eyebrow="fictional example · not a customer engagement"
          id="acme-relay-title"
          title="Acme Relay shows the v1 package — with fictional data only."
          description={
            <p>
              Acme Relay is a deliberately fictional operating scenario built
              from documentation-safe names, domains, timestamps, and artifacts.
              It demonstrates the package shape, not a customer outcome.
            </p>
          }
        />
        <div className="proofpack-example-grid">
          <GlassCard className="proofpack-example-card">
            <FileArchive aria-hidden="true" size={30} strokeWidth={1.8} />
            <h3>Fictional Acme Relay bundle</h3>
            <ul>
              {exampleContents.map((item) => (
                <li key={item}>
                  <CheckCircle2 aria-hidden="true" size={17} strokeWidth={2} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
          <div className="text-panel proofpack-example-note">
            <p className="eyebrow">public-safe boundary</p>
            <h3>Example evidence, not customer work.</h3>
            <p>
              The public example contains no real operator credentials, private
              infrastructure, customer identifiers, testimonials, revenue, or
              claimed outcomes.
            </p>
            <a className="secondary-link" href="/work/">
              Review public-safe work samples
              <ArrowRight aria-hidden="true" size={17} strokeWidth={2.1} />
            </a>
          </div>
        </div>
      </section>

      <section className="subpage-section content-band proofpack-inquiry" aria-labelledby="proofpack-inquiry-title">
        <div>
          <p className="eyebrow">ProofPack v1.0.0 · Released</p>
          <h2 id="proofpack-inquiry-title">Start with the evidence you need to make useful.</h2>
        </div>
        <a className="button primary fit-button" href="/contact/">
          Request ProofPack
          <ArrowRight aria-hidden="true" size={17} strokeWidth={2.1} />
        </a>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
