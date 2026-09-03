import assert from "node:assert/strict";
import test from "node:test";

import { scanText } from "./public-output-scan.mjs";

test("fictional credential fixtures exercise the public-output detector", () => {
  const findings = scanText(
    "example-root-password-not-a-secret at documentation host 192.0.2.10"
  );

  assert.equal(findings.length, 2);
  assert.match(findings[0], /fictional root credential/i);
  assert.match(findings[1], /documentation IP address/i);
});

test("ordinary public copy remains clean", () => {
  assert.deepEqual(scanText("ProofPack packages selected operating evidence."), []);
});

test("stale ProofPack release-candidate claims are rejected", () => {
  const findings = scanText(
    "ProofPack v1.0.0 Release Candidate — Launching"
  );

  assert.equal(findings.length, 2);
  assert.match(findings[0], /stale ProofPack release-candidate status/i);
  assert.match(findings[1], /stale ProofPack launching status/i);
});

test("unsupported public release labels remain rejected", () => {
  const findings = scanText("ProofPack v1.0.0 — Initial Public Release");

  assert.equal(findings.length, 1);
  assert.match(findings[0], /unsupported public release label/i);
});
