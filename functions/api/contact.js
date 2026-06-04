const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8"
};

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init.headers || {})
    }
  });
}

function cleanText(value, maxLength) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function isEmail(value) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) {
    return json({ error: "D1 database binding is missing." }, { status: 500 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, { status: 400 });
  }

  if (cleanText(body.website, 120)) {
    return json({ ok: true });
  }

  const name = cleanText(body.name, 120);
  const email = cleanText(body.email, 180) || null;
  const projectType = cleanText(body.project_type, 80) || "Company site";
  const message = cleanText(body.message, 2000);

  if (!name) {
    return json({ error: "Name is required." }, { status: 400 });
  }

  if (!isEmail(email)) {
    return json({ error: "Email address looks invalid." }, { status: 400 });
  }

  if (message.length < 8) {
    return json({ error: "Signal needs at least 8 characters." }, { status: 400 });
  }

  await env.DB.prepare(
    `insert into contact_submissions
      (name, email, project_type, message, source, user_agent, ip_hint)
     values (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      name,
      email,
      projectType,
      message,
      "nxwarden.com",
      request.headers.get("User-Agent") || null,
      request.headers.get("CF-Connecting-IP") || null
    )
    .run();

  return json({ ok: true });
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: jsonHeaders });
}
