"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Script from "next/script";

type Status = "idle" | "submitting" | "success" | "error";
type TurnstileStatus = "loading" | "ready" | "verified" | "failed";
type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme: "dark";
      size: "flexible";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
      "timeout-callback": () => void;
    }
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const projectTypes = [
  "Company site",
  "Cloud operations",
  "Automation workflow",
  "Internal dashboard",
  "Documentation",
  "AI-assisted workflow"
];

// Public Turnstile site key for the NX Warden contact widget.
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
  const [scriptReady, setScriptReady] = useState(false);
  const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatus>("loading");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const turnstileUnavailable = turnstileStatus === "failed";
  const canSubmit = status !== "submitting" && Boolean(turnstileToken);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!scriptReady && !turnstileToken) {
        setTurnstileStatus("failed");
      }
    }, 12000);

    return () => window.clearTimeout(timer);
  }, [scriptReady, turnstileToken]);

  useEffect(() => {
    if (!scriptReady || !turnstileRef.current || widgetIdRef.current) {
      return;
    }

    if (!window.turnstile) {
      setTurnstileStatus("failed");
      return;
    }

    try {
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        theme: "dark",
        size: "flexible",
        callback: (token) => {
          setTurnstileToken(token);
          setTurnstileStatus("verified");
          setMessage("");
          setStatus("idle");
        },
        "expired-callback": () => {
          setTurnstileToken("");
          setTurnstileStatus("ready");
        },
        "error-callback": () => {
          setTurnstileToken("");
          setTurnstileStatus("failed");
        },
        "timeout-callback": () => {
          setTurnstileToken("");
          setTurnstileStatus("failed");
        }
      });
      setTurnstileStatus("ready");
    } catch {
      setTurnstileStatus("failed");
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [scriptReady]);

  function resetTurnstile() {
    setTurnstileToken("");
    setTurnstileStatus(scriptReady ? "ready" : "loading");
    if (widgetIdRef.current) {
      window.turnstile?.reset(widgetIdRef.current);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!turnstileToken) {
      setStatus("error");
      setMessage("Please complete the Cloudflare safety check before sending, or email us directly if the widget does not load.");
      return;
    }

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
      cf_turnstile_response: turnstileToken
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
      resetTurnstile();
      return;
    }

    setStatus("success");
    setMessage("Received. I will read it soon.");
    form.reset();
    resetTurnstile();
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => {
          setScriptReady(true);
          setTurnstileStatus("ready");
        }}
        onError={() => {
          setScriptReady(false);
          setTurnstileStatus("failed");
        }}
      />
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-intro">
          <p className="eyebrow">verified form</p>
          <h3>Secondary inquiry path</h3>
          <p>
            Use this form when the Cloudflare verification widget loads normally.
            If verification is unavailable, email NX Warden directly instead.
          </p>
        </div>

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
          {turnstileUnavailable ? (
            <div className="turnstile-fallback-panel" role="status">
              <strong>Verification is unavailable in this browser.</strong>
              <p>
                The form remains protected, but the primary contact path is email.
                Please send the inquiry directly instead.
              </p>
            </div>
          ) : (
            <div ref={turnstileRef} className="turnstile-widget" />
          )}
          <p className={`turnstile-note ${turnstileUnavailable ? "warning" : ""}`}>
            {turnstileUnavailable
              ? "The safety check could not load here. Direct email is the reliable fallback."
              : "Cloudflare verification is required before the form can send. If the verification widget does not load, you can email us directly."}
          </p>
          <div className="fallback-contact" aria-label="Fallback contact options">
            <a href="mailto:ceo@nxwarden.com?subject=NX%20Warden%20Inquiry">
              Open email client
            </a>
            <a href="mailto:ceo@nxwarden.com">ceo@nxwarden.com</a>
            <a href="mailto:info@nxwarden.com">info@nxwarden.com</a>
          </div>
        </div>

        <div className="form-footer">
          {turnstileUnavailable ? (
            <a className="button primary" href="mailto:ceo@nxwarden.com?subject=NX%20Warden%20Inquiry">
              Use email instead
            </a>
          ) : (
            <button className="button primary" type="submit" disabled={!canSubmit}>
              {status === "submitting" ? "Sending" : "Send inquiry"}
            </button>
          )}
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
