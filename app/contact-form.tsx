"use client";

import { FormEvent, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type Status = "idle" | "submitting" | "success" | "error";

const projectTypes = [
  "Company site",
  "Cloud infrastructure",
  "Media automation",
  "Monitoring",
  "AI workflow"
];

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createBrowserClient(url, key);
}

function getFriendlyError(message: string) {
  if (/failed to fetch|network|fetch|load failed|timeout|dns/i.test(message)) {
    return "The intake line cannot reach Supabase yet. Please email ceo@nxwarden.com while the database link is being verified.";
  }

  if (/permission|row-level|rls|policy|not exposed|schema cache/i.test(message)) {
    return "The database is reachable, but the submissions table needs its Supabase SQL policy applied.";
  }

  return message || "The signal line is offline for a moment. Please email ceo@nxwarden.com instead.";
}

export default function ContactForm() {
  const supabase = useMemo(() => getSupabaseClient(), []);
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
      const { error } = await supabase.from("site_submissions").insert(payload);
      errorMessage = error?.message ?? "";
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
