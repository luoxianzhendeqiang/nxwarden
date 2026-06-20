"use client";

import { FormEvent, useState } from "react";
import Script from "next/script";

type Status = "idle" | "submitting" | "success" | "error";

const projectTypes = [
  "Company site",
  "Cloud operations",
  "Automation workflow",
  "Internal dashboard",
  "Documentation",
  "AI-assisted workflow"
];

// Public Turnstile site key for the nxwarden-contact-production widget.
const turnstileSiteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAADoUGDAGkH7tbk_G";

function getFriendlyError(message: string) {
  if (/D1 database binding is missing/i.test(message)) {
    return "The D1 intake database is not bound yet. Please email ceo@nxwarden.com while the binding is being verified.";
  }

  if (/failed to fetch|network|fetch|load failed|timeout|dns/i.test(message)) {
    return "The intake line is offline for a moment. Please email ceo@nxwarden.com instead.";
  }

  if (/turnstile|cloudflare/i.test(message)) {
    return "The Cloudflare safety check did not complete. Please refresh and try once more.";
  }

  return message || "The inquiry line is offline for a moment. Please email ceo@nxwarden.com instead.";
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    if (String(data.get("website") ?? "").trim()) {
      setStatus("success");
      setMessage("Received. I will read it soon.");
      form.reset();
      return;
    }

    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim() || null,
      project_type: String(data.get("projectType") ?? "Company site"),
      message: String(data.get("message") ?? "").trim(),
      source: "nxwarden.com public inquiry",
      cf_turnstile_response: String(data.get("cf-turnstile-response") ?? "")
    };

    let errorMessage = "";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...payload,
          website: String(data.get("website") ?? "")
        })
      });
      const result = await response.json().catch(() => ({}));
      errorMessage = response.ok ? "" : String(result.error ?? "Unable to send inquiry.");
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "";
    }

    if (errorMessage) {
      setStatus("error");
      setMessage(getFriendlyError(errorMessage));
      (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
      return;
    }

    setStatus("success");
    setMessage("Received. I will read it soon.");
    form.reset();
    (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            <span>Name</span>
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" />
          </label>
        </div>

        <label>
          <span>Project</span>
          <select name="projectType" defaultValue="Company site">
            {projectTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>

        <label className="hidden-field" aria-hidden="true">
          <span>Website</span>
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>

        <label>
          <span>Project details</span>
          <textarea
            name="message"
            rows={5}
            minLength={8}
            maxLength={2000}
            required
          />
        </label>

        <div className="turnstile-shell" aria-label="Cloudflare Turnstile challenge">
          <div
            className="cf-turnstile"
            data-sitekey={turnstileSiteKey}
            data-theme="dark"
            data-size="flexible"
          />
        </div>

        <div className="form-footer">
          <button className="button primary" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending" : "Send inquiry"}
          </button>
          {message ? (
            <p className={`form-status ${status}`} role={status === "error" ? "alert" : "status"}>
              {message}
            </p>
          ) : null}
        </div>
      </form>
    </>
  );
}
