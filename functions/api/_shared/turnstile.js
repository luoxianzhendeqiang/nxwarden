const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// The matching Turnstile secret is stored only in Cloudflare Pages as
// TURNSTILE_SECRET_KEY. Do not expose it in frontend code or docs.

export function turnstileTokenFromBody(body, request) {
  return (
    String(body?.cf_turnstile_response || "").trim() ||
    String(body?.["cf-turnstile-response"] || "").trim() ||
    String(body?.turnstile_token || "").trim() ||
    String(request.headers.get("X-Turnstile-Token") || "").trim()
  );
}

export async function verifyTurnstile({ body, env, request }) {
  if (!env.TURNSTILE_SECRET_KEY) {
    return {
      error: "TURNSTILE_SECRET_KEY is not configured.",
      status: 503
    };
  }

  const token = turnstileTokenFromBody(body, request);

  if (!token) {
    return {
      error: "Cloudflare Turnstile token is required.",
      status: 403
    };
  }

  const formData = new FormData();
  formData.append("secret", env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);

  const ip = request.headers.get("CF-Connecting-IP");

  if (ip) {
    formData.append("remoteip", ip);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body: formData
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.success) {
    return {
      error: "Cloudflare Turnstile verification failed.",
      status: 403,
      details: result["error-codes"] || []
    };
  }

  return { ok: true };
}
