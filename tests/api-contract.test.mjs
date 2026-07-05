import assert from "node:assert/strict";
import test from "node:test";
import { onRequestGet as getHealth } from "../functions/api/health.js";
import { onRequestPost as postContact } from "../functions/api/contact.js";
import { onRequestPost as postAction } from "../functions/api/node/[id]/action.js";

function contactRequest(turnstileToken) {
  return new Request("https://nxwarden.test/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Visual contract probe",
      email: null,
      project_type: "Company site",
      message: "This request must not be accepted.",
      website: "",
      ...(turnstileToken
        ? { cf_turnstile_response: turnstileToken }
        : {})
    })
  });
}

test("public health response stays safe", async () => {
  const response = await getHealth({
    request: new Request("https://nxwarden.test/api/health"),
    env: {}
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.service, "nxwarden-telemetry");
  assert.equal(body.bindings, undefined);
});

test("contact rejects a missing Turnstile token", async () => {
  const response = await postContact({
    request: contactRequest(""),
    env: { DB: {}, TURNSTILE_SECRET_KEY: "unit-test-secret" }
  });

  assert.equal(response.status, 403);
});

test("contact rejects an invalid Turnstile token", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        success: false,
        "error-codes": ["invalid-input-response"]
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  try {
    const response = await postContact({
      request: contactRequest("invalid-probe"),
      env: { DB: {}, TURNSTILE_SECRET_KEY: "unit-test-secret" }
    });
    assert.equal(response.status, 403);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("node action remains locked", async () => {
  const response = await postAction({
    params: { id: "edge-node-01" },
    request: new Request("https://nxwarden.test/api/node/edge-node-01/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "restart-service" })
    })
  });
  const body = await response.json();

  assert.equal(response.status, 423);
  assert.equal(body.armed, false);
});
