"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const projectTypes = [
  "Company site",
  "Cloud infrastructure",
  "Media automation",
  "Monitoring",
  "AI workflow"
];

function getFriendlyError(message: string) {
  if (/D1 database binding is missing/i.test(message)) {
    return "The D1 intake database is not bound yet. Please email ceo@nxwarden.com while the binding is being verified.";
  }

  if (/failed to fetch|network|fetch|load failed|timeout|dns/i.test(message)) {
    return "The intake line is offline for a moment. Please email ceo@nxwarden.com instead.";
  }

  return message || "The signal line is offline for a moment. Please email ceo@nxwarden.com instead.";
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
      source: "nxwarden.com"
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
      errorMessage = response.ok ? "" : String(result.error ?? "Unable to send signal.");
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "";
    }

    if (errorMessage) {
      setStatus("error");
      setMessage(getFriendlyError(errorMessage));
      return;
    }

    setStatus("success");
    setMessage("Received. I will read it soon.");
    form.reset();
  }

  return (
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
        <span>Signal</span>
        <textarea
          name="message"
          rows={5}
          minLength={8}
          maxLength={2000}
          required
        />
      </label>

      <div className="form-footer">
        <button className="button primary" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending" : "Send signal"}
        </button>
        {message ? (
          <p className={`form-status ${status}`} role={status === "error" ? "alert" : "status"}>
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
