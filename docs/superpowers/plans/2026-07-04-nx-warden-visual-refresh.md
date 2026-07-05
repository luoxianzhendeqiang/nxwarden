# NX Warden Option B Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the NX Warden public site with a shared premium dark visual system, a generated purple-blue-gold orbital hero, real public-safe evidence, and consistent subpages without changing contact, API, console-control, or infrastructure behavior.

**Architecture:** Add focused presentation components under `app/components/` and a new `app/visual-system.css` loaded after the legacy stylesheet. Refactor the homepage and public page composition around those primitives while leaving the contact form logic, Pages Functions, and the 1,864-line dashboard behavior file unchanged. Execute in an isolated worktree, validate with Node contract tests, a public-output scanner, Playwright desktop/mobile checks, and production API probes, then squash the reviewed work into one `Refresh NX Warden visual system` commit.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript 6, Lucide React, CSS, Cloudflare Pages Functions, Node built-in test runner, Playwright Test.

---

## Scope And File Map

### Create

- `public/assets/nxwarden-orbit-field.png` - generated hero bitmap with the focal energy field on the right and dark text-safe space on the left.
- `app/visual-system.css` - visual tokens, shared component styles, refreshed page layouts, motion, and responsive overrides loaded after `globals.css`.
- `app/components/page-shell.tsx` - semantic page wrapper and optional variant class.
- `app/components/page-hero.tsx` - reusable subpage heading block.
- `app/components/section-header.tsx` - reusable section heading block.
- `app/components/glass-card.tsx` - strong dark glass article surface.
- `app/components/signal-badge.tsx` - text-plus-color status/category badge.
- `app/components/evidence-card.tsx` - public-safe proof thumbnail and factual caption.
- `app/components/reveal.tsx` - one-time IntersectionObserver reveal with reduced-motion-safe CSS.
- `app/components/site-footer.tsx` - public route and legal-context footer.
- `app/components/home-hero.tsx` - homepage-specific hero composition and four product cards.
- `app/components/evidence-band.tsx` - homepage proof strip using existing public-safe screenshots.
- `playwright.config.ts` - local and production browser-test configuration.
- `tests/visual-refresh.spec.ts` - desktop/mobile, overflow, contact, and locked-console browser checks.
- `tests/api-contract.test.mjs` - local function contract checks for health, contact rejection, and locked actions.
- `tests/public-output-scan.mjs` - post-build public HTML risk scanner.

### Modify

- `package.json` - add Playwright dev dependency and verification scripts.
- `package-lock.json` - lock the Playwright dev dependency.
- `.gitignore` - ignore Playwright outputs.
- `app/layout.tsx` - import `visual-system.css` after `globals.css` and update social image metadata to the generated hero.
- `app/site-nav.tsx` - retain all routes, add accessible mobile navigation, and use refreshed class names.
- `app/page.tsx` - compose the homepage from `HomeHero`, `EvidenceBand`, shared sections, and `SiteFooter`.
- `app/services/page.tsx` - use `PageShell`, `PageHero`, `SectionHeader`, `GlassCard`, and `SiteFooter` while preserving all current service facts.
- `app/work/page.tsx` - use shared proof and layout components while preserving current samples and boundaries.
- `app/roadmap/page.tsx` - convert the current roadmap grid to an ordered signal trail without changing phase claims.
- `app/about/page.tsx` - recompose current legal and founder content using shared primitives.
- `app/contact/page.tsx` - presentation-only composition around the unchanged `ContactForm`.
- `app/policies/page.tsx` - improve policy scanning without changing policy wording.
- `app/console/page.tsx` - align header, chips, and shell styling while preserving the dashboard and locked state.

### Explicitly Do Not Modify

- `app/contact-form.tsx`
- `app/console/signal-dashboard.tsx`
- `functions/api/contact.js`
- `functions/api/health.js`
- `functions/api/node/[id]/action.js`
- every other file under `functions/`
- `TELEMETRY_CENTER.md`
- DNS, MX, Email Routing, Cloudflare secrets, LinkedIn, financial applications, ProofPack, router audit, Scrapling labs, or VPS services.

## Task 1: Isolate Work And Add Verification Harness

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.gitignore`
- Create: `playwright.config.ts`
- Create: `tests/visual-refresh.spec.ts`
- Create: `tests/api-contract.test.mjs`
- Create: `tests/public-output-scan.mjs`

- [ ] **Step 1: Create an isolated execution worktree**

At implementation time, use the `using-git-worktrees` skill and create:

```powershell
git worktree add C:\ATool\worktrees\nxwarden-visual-refresh -b codex/nxwarden-visual-refresh
```

Expected: a clean worktree at the approved design commit. Do not copy `TELEMETRY_CENTER.md` or `.superpowers/` into it.

- [ ] **Step 2: Record the baseline**

```powershell
git status --short
npm run build
```

Expected: clean worktree and successful static export. Stop if the clean worktree contains unexpected files.

- [ ] **Step 3: Install only the browser-test development dependency**

```powershell
npm install --save-dev @playwright/test
npx playwright install chromium
```

Expected: `package.json` and `package-lock.json` change; no runtime dependency is added.

- [ ] **Step 4: Add verification scripts to `package.json`**

Use these exact script entries:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test:api": "node --test tests/api-contract.test.mjs",
    "test:public-scan": "node tests/public-output-scan.mjs",
    "test:visual": "playwright test tests/visual-refresh.spec.ts",
    "verify:visual-refresh": "npm run test:api && npm run build && npm run test:public-scan && npm run test:visual"
  }
}
```

- [ ] **Step 5: Ignore generated Playwright results**

Append to `.gitignore`:

```gitignore
playwright-report/
test-results/
```

- [ ] **Step 6: Create `playwright.config.ts`**

```ts
import { defineConfig } from "@playwright/test";

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  reporter: "list",
  use: {
    baseURL: externalBaseURL || "http://127.0.0.1:3000",
    colorScheme: "dark",
    trace: "retain-on-failure"
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: "npm run dev -- --hostname 127.0.0.1",
        url: "http://127.0.0.1:3000",
        reuseExistingServer: true,
        timeout: 120_000
      }
});
```

- [ ] **Step 7: Create local function contract tests**

Create `tests/api-contract.test.mjs`:

```js
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
    new Response(JSON.stringify({ success: false, "error-codes": ["invalid-input-response"] }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

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
```

- [ ] **Step 8: Create the public-output scanner**

Create `tests/public-output-scan.mjs`:

```js
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("out");
const forbidden = [
  /NX Warden LLC/i,
  /native pipe path/i,
  /example-root-password-not-a-secret/i,
  /192\.0\.2\.10/i,
  /SingBox/i,
  /Hysteria2/i,
  /Mercury/i,
  /proxy resale/i
];

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory()
        ? htmlFiles(target)
        : Promise.resolve(entry.name.endsWith(".html") ? [target] : []);
    })
  );
  return files.flat();
}

const failures = [];
for (const file of await htmlFiles(root)) {
  const text = await readFile(file, "utf8");
  for (const pattern of forbidden) {
    if (pattern.test(text)) failures.push(`${path.relative(root, file)}: ${pattern}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Public output risk scan passed.");
```

- [ ] **Step 9: Create browser checks before the visual implementation**

Create `tests/visual-refresh.spec.ts` with the final acceptance contract. It is expected to fail initially because the new hero and evidence selectors do not exist:

```ts
import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/services/",
  "/work/",
  "/roadmap/",
  "/about/",
  "/contact/",
  "/policies/",
  "/console/"
];

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

test("desktop homepage exposes the refreshed hero and real evidence", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Practical systems for real online work." })).toBeVisible();
  await expect(page.getByTestId("home-orbit-field")).toBeVisible();
  await expect(page.getByTestId("evidence-band")).toBeVisible();
  await expect(page.getByTestId("evidence-card")).toHaveCount(4);
  await expect(page.getByText("Fictional customer")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);

  await page.screenshot({ path: "test-results/nxwarden-home-desktop.png", fullPage: true });
});

for (const route of publicRoutes) {
  test(`mobile route ${route} has visible navigation and no overflow`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByLabel("NX Warden home")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
}

test("contact remains email-first and keeps the protected secondary form", async ({ page }) => {
  await page.goto("/contact/");

  await expect(page.getByRole("link", { name: "ceo@nxwarden.com" })).toBeVisible();
  await expect(page.locator("form.contact-form")).toBeVisible();
  await expect(page.locator(".turnstile-shell")).toBeVisible();
});

test("console remains public-safe and all control actions stay disabled", async ({ page }) => {
  await page.goto("/console/");

  await expect(page.getByRole("heading", { level: 1, name: "NX WARDEN / MISSION CONTROL" })).toBeVisible();
  await expect(page.getByText("CONTROL: READ ONLY")).toBeVisible();

  const controls = page.locator(".control-actions button");
  const count = await controls.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    await expect(controls.nth(index)).toBeDisabled();
  }

  await page.screenshot({ path: "test-results/nxwarden-console-desktop.png", fullPage: true });
});
```

- [ ] **Step 10: Run the tests and confirm the intended baseline**

```powershell
npm run test:api
npm run test:visual
```

Expected: API tests pass; visual tests fail only on the not-yet-created hero/evidence selectors.

- [ ] **Step 11: Commit the verification harness on the feature branch**

```powershell
git add package.json package-lock.json .gitignore playwright.config.ts tests/visual-refresh.spec.ts tests/api-contract.test.mjs tests/public-output-scan.mjs
git commit -m "test: add visual refresh verification"
```

## Task 2: Generate And Validate The Hero Asset

**Files:**
- Create: `public/assets/nxwarden-orbit-field.png`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Generate the bitmap with the image generation tool**

Use this production prompt:

```text
Create a premium cinematic widescreen background for NX Warden, a cloud automation and operations studio. Deep black and navy space field. A single luminous black-hole or orbital energy aperture positioned right of center, with controlled violet and electric-blue plasma trails plus restrained warm-gold highlights. Leave the left 42 percent dark and visually calm for large off-white typography. Fine technical signal lines may appear in the lower field, but no dashboard UI, cards, text, logos, people, characters, planets, bokeh, or decorative gradient orbs. Crisp focal detail, readable dark negative space, professional technology-company tone, 16:9 composition.
```

Save the generated result as `public/assets/nxwarden-orbit-field.png`.

- [ ] **Step 2: Validate the asset dimensions and content**

Use the local image viewer and verify:

- the image is nonblank;
- the focal aperture is right of center;
- the left side is dark enough for text;
- no generated text, logo, person, fake interface, or customer mark appears;
- the image remains legible when cropped to 16:10 and mobile portrait regions.

- [ ] **Step 3: Update social metadata in `app/layout.tsx`**

Change both Open Graph and Twitter image values from:

```ts
images: ["/assets/blackhole-hero.png"]
```

to:

```ts
images: ["/assets/nxwarden-orbit-field.png"]
```

Do not change organization JSON-LD or legal metadata.

- [ ] **Step 4: Build and commit the asset**

```powershell
npm run build
git add public/assets/nxwarden-orbit-field.png app/layout.tsx
git commit -m "feat: add NX Warden orbital hero asset"
```

Expected: build passes and no metadata other than social-image paths changes.

## Task 3: Add Shared Visual Components And Strong Glass Tokens

**Files:**
- Create: `app/visual-system.css`
- Create: `app/components/page-shell.tsx`
- Create: `app/components/page-hero.tsx`
- Create: `app/components/section-header.tsx`
- Create: `app/components/glass-card.tsx`
- Create: `app/components/signal-badge.tsx`
- Create: `app/components/evidence-card.tsx`
- Create: `app/components/reveal.tsx`
- Create: `app/components/site-footer.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Import the new visual layer after the legacy stylesheet**

At the top of `app/layout.tsx`:

```ts
import type { Metadata } from "next";
import "./globals.css";
import "./visual-system.css";
```

The import order is deliberate: new selectors and tokens override legacy styles without rewriting the 4,114-line existing stylesheet in this pass.

- [ ] **Step 2: Create `PageShell`**

```tsx
import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export default function PageShell({ children, className = "" }: PageShellProps) {
  return <main className={`page-shell ${className}`.trim()}>{children}</main>;
}
```

- [ ] **Step 3: Create `PageHero`**

```tsx
import type { ReactNode } from "react";
import Reveal from "./reveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: ReactNode;
  actions?: ReactNode;
  id: string;
};

export default function PageHero({ eyebrow, title, description, actions, id }: PageHeroProps) {
  return (
    <section className="page-hero" aria-labelledby={id}>
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h1 id={id}>{title}</h1>
        <div className="page-hero__description">{description}</div>
        {actions ? <div className="page-hero__actions">{actions}</div> : null}
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 4: Create `SectionHeader`**

```tsx
import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  id: string;
};

export default function SectionHeader({ eyebrow, title, description, id }: SectionHeaderProps) {
  return (
    <header className="section-header">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {description ? <div className="section-header__description">{description}</div> : null}
    </header>
  );
}
```

- [ ] **Step 5: Create `GlassCard`**

```tsx
import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export default function GlassCard({ children, className = "" }: GlassCardProps) {
  return <article className={`glass-card ${className}`.trim()}>{children}</article>;
}
```

- [ ] **Step 6: Create `SignalBadge`**

```tsx
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type SignalBadgeProps = {
  children: ReactNode;
  icon?: LucideIcon;
  tone?: "gold" | "blue" | "violet" | "green" | "neutral";
};

export default function SignalBadge({ children, icon: Icon, tone = "neutral" }: SignalBadgeProps) {
  return (
    <span className={`signal-badge signal-badge--${tone}`}>
      {Icon ? <Icon aria-hidden="true" size={14} strokeWidth={2.1} /> : null}
      {children}
    </span>
  );
}
```

- [ ] **Step 7: Create `EvidenceCard`**

```tsx
import { ArrowUpRight } from "lucide-react";

type EvidenceCardProps = {
  href: string;
  image: string;
  eyebrow: string;
  title: string;
  description: string;
};

export default function EvidenceCard({ href, image, eyebrow, title, description }: EvidenceCardProps) {
  return (
    <a className="evidence-card-v2" data-testid="evidence-card" href={href}>
      <span className="evidence-card-v2__media">
        <img src={image} alt="" loading="lazy" />
      </span>
      <span className="evidence-card-v2__copy">
        <span className="eyebrow">{eyebrow}</span>
        <strong>{title}</strong>
        <span>{description}</span>
      </span>
      <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2} />
    </a>
  );
}
```

- [ ] **Step 8: Create the lightweight `Reveal` client component**

```tsx
"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

export default function Reveal({
  children,
  className = ""
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 9: Create `SiteFooter`**

```tsx
const footerLinks = [
  ["Services", "/services/"],
  ["Work", "/work/"],
  ["About", "/about/"],
  ["Contact", "/contact/"],
  ["Policies", "/policies/"]
] as const;

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>NX Warden</strong>
        <p>Cloud Automation &amp; Operations Studio</p>
      </div>
      <nav aria-label="Footer">
        {footerLinks.map(([label, href]) => (
          <a href={href} key={href}>{label}</a>
        ))}
      </nav>
      <p>NX Warden is operated by NexusWarden Technology LLC.</p>
    </footer>
  );
}
```

- [ ] **Step 10: Define strong glass tokens and base component styles**

Start `app/visual-system.css` with:

```css
:root {
  --nx-bg: #05060b;
  --nx-bg-raised: #090b13;
  --nx-ink: #f7f3ea;
  --nx-muted: #a8afc2;
  --nx-gold: #e7b86d;
  --nx-blue: #82c9ff;
  --nx-violet: #a988ff;
  --nx-line: rgba(220, 226, 242, 0.2);
  --nx-line-gold: rgba(231, 184, 109, 0.48);
  --nx-glass: rgba(8, 10, 18, 0.8);
  --nx-glass-strong: rgba(10, 12, 22, 0.84);
  --nx-shadow: 0 22px 64px rgba(0, 0, 0, 0.48);
}

.page-shell {
  min-height: 100svh;
  overflow: clip;
  background: var(--nx-bg);
  color: var(--nx-ink);
}

.glass-card {
  border: 1px solid var(--nx-line);
  border-radius: 8px;
  background: var(--nx-glass);
  box-shadow: var(--nx-shadow), inset 0 1px rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
}

.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 520ms ease, transform 520ms ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: none;
}
```

Every card surface in the new system must stay between `rgba(8, 10, 18, 0.76)` and `rgba(10, 12, 22, 0.84)`. Do not reduce text contrast by placing body copy directly over the bright focal ring.

- [ ] **Step 11: Build and commit the shared system**

```powershell
npm run build
git add app/layout.tsx app/visual-system.css app/components/page-shell.tsx app/components/page-hero.tsx app/components/section-header.tsx app/components/glass-card.tsx app/components/signal-badge.tsx app/components/evidence-card.tsx app/components/reveal.tsx app/components/site-footer.tsx
git commit -m "feat: add shared NX Warden visual system"
```

## Task 4: Refactor Navigation And Global Page Framing

**Files:**
- Modify: `app/site-nav.tsx`
- Modify: `app/visual-system.css`

- [ ] **Step 1: Keep route data stable and add a semantic mobile menu**

Refactor `SiteNav` around the existing `links` array. The final structure must retain the existing desktop links, the Console entry, and a no-JavaScript `<details>` mobile menu:

```tsx
import { Menu, TerminalSquare } from "lucide-react";

const links = [
  { href: "/services/", label: "Services" },
  { href: "/work/", label: "Work" },
  { href: "/roadmap/", label: "Roadmap" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
  { href: "/policies/", label: "Policies" }
];

export default function SiteNav() {
  return (
    <header className="site-nav" aria-label="Primary">
      <a className="site-brand" href="/" aria-label="NX Warden home">
        <span className="brand-mark"><img src="/assets/nxwarden-icon-512.png" alt="" /></span>
        <span>NX Warden</span>
      </a>
      <nav className="site-nav__desktop">
        {links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
        <a className="site-nav__console" href="/console/">
          <TerminalSquare aria-hidden="true" size={15} /> Console
        </a>
      </nav>
      <details className="site-nav__mobile">
        <summary aria-label="Open navigation"><Menu aria-hidden="true" size={21} /></summary>
        <nav aria-label="Mobile">
          {links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
          <a href="/console/">Console</a>
        </nav>
      </details>
    </header>
  );
}
```

- [ ] **Step 2: Add navigation and footer layout rules**

In `app/visual-system.css`, define stable 44px touch targets, zero negative letter spacing, an opaque-enough dropdown surface, and mobile breakpoints at 980px and 640px. Hide the desktop navigation below 980px and display the `<details>` menu. Ensure the menu fits inside `calc(100vw - 32px)`.

- [ ] **Step 3: Verify keyboard and mobile behavior**

```powershell
npm run build
npm run test:visual -- --grep "mobile route"
```

Expected: tests may still fail on homepage evidence selectors, but navigation is visible and no route has horizontal overflow.

- [ ] **Step 4: Commit navigation framing**

```powershell
git add app/site-nav.tsx app/visual-system.css
git commit -m "feat: refresh site navigation and framing"
```

## Task 5: Refactor The Homepage Hero And Evidence Band

**Files:**
- Create: `app/components/home-hero.tsx`
- Create: `app/components/evidence-band.tsx`
- Modify: `app/page.tsx`
- Modify: `app/visual-system.css`

- [ ] **Step 1: Create `HomeHero` with the approved composition**

`app/components/home-hero.tsx` must render:

- the generated full-bleed image with `data-testid="home-orbit-field"`;
- the existing eyebrow, headline, lead, and three actions unchanged;
- four HTML product cards outside the bitmap: Business Website, Dashboard Layer, Runbook Trail, Automation Setup;
- Lucide icons `Globe2`, `Layers3`, `BookOpen`, and `Workflow`;
- no customer logos or third-party claims.

Use this data shape so presentation remains separate from copy:

```tsx
const orbitCards = [
  { index: "01 / system", title: "Business Website", body: "A clear public home for services, policies, and project intake.", icon: Globe2, tone: "violet" },
  { index: "02 / operations", title: "Dashboard Layer", body: "Read-only service signals, risk notes, and maintenance memory.", icon: Layers3, tone: "gold" },
  { index: "03 / documentation", title: "Runbook Trail", body: "Plain notes that make systems easier to maintain.", icon: BookOpen, tone: "blue" },
  { index: "04 / automation", title: "Automation Setup", body: "Repeatable routines for files, publishing, reports, and handoffs.", icon: Workflow, tone: "violet" }
] as const;
```

The component must place text and actions before decorative media in DOM order.

- [ ] **Step 2: Create the real evidence band**

Create `app/components/evidence-band.tsx` with these exact public-safe records:

```tsx
const evidence = [
  { href: "/", image: "/assets/proof/home-proof.png", eyebrow: "Public company surface", title: "Clear public positioning", description: "Services, legal identity, and direct contact context." },
  { href: "/console/", image: "/assets/proof/console-proof.png", eyebrow: "Read-only console", title: "Public-safe operations view", description: "Signals and locked controls without private infrastructure details." },
  { href: "/contact/", image: "/assets/proof/contact-proof.png", eyebrow: "Inquiry path", title: "Email-first contact", description: "Direct business email with a protected secondary form." },
  { href: "/work/", image: "/assets/proof/work-sample-proof.png", eyebrow: "Work sample", title: "Reviewable operating evidence", description: "Public-safe examples with clear scope and boundaries." }
] as const;
```

Render them through `EvidenceCard` inside a section with `data-testid="evidence-band"`.

- [ ] **Step 3: Recompose `app/page.tsx`**

Preserve the current arrays `services`, `workSteps`, `boundaries`, and `demoSignals`. The exact top-level order is `PageShell`, `HomeHero` containing `SiteNav`, `EvidenceBand`, current services section, current work section, current audience section, current operations-demo section, current trust section, current contact section, then `SiteFooter`.

Use `SectionHeader`, `GlassCard`, `SignalBadge`, and `Reveal` for existing sections without changing business statements. Keep `ContactForm` unchanged.

- [ ] **Step 4: Add stable hero dimensions and strong surfaces**

In `app/visual-system.css`:

- desktop hero height: `calc(100svh - 88px)` with a `760px` minimum and a `920px` maximum so the evidence band remains hinted at common 900-1080px viewport heights;
- background image uses `object-fit: cover` and right-biased object position;
- hero copy width is capped so it cannot cover the focal field;
- orbit cards use `--nx-glass` or `--nx-glass-strong`, not the current `rgba(12, 13, 13, 0.42)` surface;
- cards have stable widths and reserved desktop positions;
- no nested cards;
- no headline or action overlaps at 1280px, 1440px, or 1920px.

- [ ] **Step 5: Make mobile a different stable composition**

Below 640px:

- stack copy, media, orbit cards, then evidence;
- give the media a fixed aspect ratio;
- place orbit cards in one column;
- use discrete mobile heading sizes;
- do not animate background position;
- ensure all text and buttons fit at 320px width.

- [ ] **Step 6: Run homepage tests**

```powershell
npm run build
npm run test:public-scan
npm run test:visual -- --grep "desktop homepage"
```

Expected: pass; four real evidence cards are visible and no horizontal overflow exists.

- [ ] **Step 7: Commit homepage work**

```powershell
git add app/components/home-hero.tsx app/components/evidence-band.tsx app/page.tsx app/visual-system.css
git commit -m "feat: rebuild homepage around real evidence"
```

## Task 6: Refactor Services And Work

**Files:**
- Modify: `app/services/page.tsx`
- Modify: `app/work/page.tsx`
- Modify: `app/visual-system.css`

- [ ] **Step 1: Recompose `/services/` using shared primitives**

Keep `serviceLines`, `limits`, `engagementModel`, and `faqs` byte-for-byte unchanged. The exact top-level order is `PageShell` with classes `subpage-v2 services-page`, `SiteNav`, `PageHero`, service-lines section, engagement-model section, project-rhythm split band, service-boundaries section, FAQ section, then `SiteFooter`. The `PageHero` receives the existing eyebrow, title, and lead paragraph. The service-lines section uses `SectionHeader` with title `Practical deliverables with explicit boundaries.` and maps every `serviceLines` record into one `GlassCard`.

Each service item becomes one `GlassCard`; do not put its deliverable or out-of-scope blocks inside additional cards.

- [ ] **Step 2: Recompose `/work/` around public evidence**

Keep the existing work sample data and boundary copy. Replace current proof-card presentation with `EvidenceCard` only when a sample has a public image and route. Samples without an image remain one `GlassCard` with a clear `Public-safe example` badge.

Keep the public-boundary section visible after the proof grid and retain the Console link as a read-only demo destination.

- [ ] **Step 3: Add dense desktop grids and stable mobile stacks**

Use two-column desktop grids for detailed service/work items, one column below 760px, and strong dark surfaces within the approved opacity range. Keep headings smaller than the homepage hero.

- [ ] **Step 4: Verify and commit**

```powershell
npm run build
npm run test:public-scan
npm run test:visual -- --grep "mobile route /services/|mobile route /work/"
git add app/services/page.tsx app/work/page.tsx app/visual-system.css
git commit -m "feat: refresh services and work pages"
```

## Task 7: Refactor Roadmap, About, And Policies

**Files:**
- Modify: `app/roadmap/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/policies/page.tsx`
- Modify: `app/visual-system.css`

- [ ] **Step 1: Convert `/roadmap/` to an ordered signal trail**

Preserve all phase labels, statuses, dates, evidence, and review language. Render phases in an ordered list with one vertical signal line and `SignalBadge` status labels. Completed/current/future states must use text labels as well as color.

The current operating evidence remains above the roadmap. It must not be styled like customer proof.

- [ ] **Step 2: Recompose `/about/` without changing legal meaning**

Use `PageHero`, a compact fact grid of `GlassCard` components, and two unframed split bands for focus and founder/operator note. Preserve this relationship exactly:

```text
NX Warden is the public-facing cloud automation and operations studio operated by NexusWarden Technology LLC, a Wyoming limited liability company.
```

Do not add history, client count, revenue, team size, U.S. operations claims, or founder biography facts.

- [ ] **Step 3: Improve `/policies/` scanning**

Keep every policy paragraph and acceptable-use list item unchanged. Add a compact in-page anchor nav for `#privacy`, `#terms`, and `#acceptable-use`; style policy articles as full-width bands with a narrow icon column, not stacked decorative cards.

- [ ] **Step 4: Verify legal and public-risk output**

```powershell
npm run build
npm run test:public-scan
rg -n "NX Warden LLC|NexusWarden Technology LLC|operated by" out
```

Expected: no `NX Warden LLC`; canonical entity wording remains present.

- [ ] **Step 5: Commit these subpages**

```powershell
git add app/roadmap/page.tsx app/about/page.tsx app/policies/page.tsx app/visual-system.css
git commit -m "feat: refresh roadmap about and policies"
```

## Task 8: Refresh Contact Presentation Without Behavior Changes

**Files:**
- Modify: `app/contact/page.tsx`
- Modify: `app/visual-system.css`
- Verify unchanged: `app/contact-form.tsx`
- Verify unchanged: `functions/api/contact.js`

- [ ] **Step 1: Record behavior-file hashes before editing presentation**

```powershell
Get-FileHash app/contact-form.tsx -Algorithm SHA256
Get-FileHash functions/api/contact.js -Algorithm SHA256
```

Save the two hashes in the implementation notes, not in public output.

- [ ] **Step 2: Recompose only `app/contact/page.tsx`**

Use `PageShell`, `PageHero`, `SectionHeader`, `GlassCard`, `Reveal`, and `SiteFooter` while preserving:

- `ceo@nxwarden.com` as the first and primary contact action;
- `info@nxwarden.com` as the secondary address;
- the existing email-client link;
- the existing `ContactForm` component instance;
- all existing warnings about sensitive details;
- form placement as a secondary protected path.

Do not pass new props to `ContactForm` and do not wrap the Turnstile widget in another interactive component.

- [ ] **Step 3: Apply stronger form surfaces without hiding states**

In `app/visual-system.css`, style `.contact-form`, `.turnstile-shell`, and direct-contact cards with `--nx-glass-strong`. Preserve visible success, error, warning, disabled, and fallback states. Do not hide Turnstile text or fallback links.

- [ ] **Step 4: Confirm behavior files are byte-identical**

```powershell
Get-FileHash app/contact-form.tsx -Algorithm SHA256
Get-FileHash functions/api/contact.js -Algorithm SHA256
git diff -- app/contact-form.tsx functions/api/contact.js
```

Expected: hashes match Step 1 and diff is empty.

- [ ] **Step 5: Verify contact presentation and API rejection**

```powershell
npm run test:api
npm run build
npm run test:visual -- --grep "contact remains"
```

Expected: missing and invalid Turnstile tokens return 403 in contract tests.

- [ ] **Step 6: Commit contact presentation only**

```powershell
git add app/contact/page.tsx app/visual-system.css
git commit -m "feat: refresh contact presentation"
```

## Task 9: Align Console Presentation While Keeping Controls Locked

**Files:**
- Modify: `app/console/page.tsx`
- Modify: `app/visual-system.css`
- Verify unchanged: `app/console/signal-dashboard.tsx`
- Verify unchanged: `functions/api/node/[id]/action.js`

- [ ] **Step 1: Record protected behavior-file hashes**

```powershell
Get-FileHash app/console/signal-dashboard.tsx -Algorithm SHA256
Get-FileHash -LiteralPath 'functions/api/node/[id]/action.js' -Algorithm SHA256
```

- [ ] **Step 2: Update only the Console shell**

In `app/console/page.tsx`:

- retain `SignalDashboard` exactly once;
- retain the Mission Control heading and four public-safe mission lines;
- replace the three raw header chips with `SignalBadge` instances;
- align brand/navigation classes with the public visual system;
- retain the public observation note;
- do not add event handlers, command callbacks, action forms, or enabled buttons.

Use these badges:

```tsx
<SignalBadge icon={RadioTower} tone="green">EDGE: ONLINE</SignalBadge>
<SignalBadge icon={ShieldCheck} tone="blue">CONTROL: READ ONLY</SignalBadge>
<SignalBadge icon={Sparkles} tone="gold">AUTH: NOT ARMED</SignalBadge>
```

- [ ] **Step 3: Refine existing Console CSS selectors only**

In `app/visual-system.css`, override the existing `.console-page`, `.console-nav`, `.mission-header`, `.mission-status`, `.console-panel`, `.metric-card`, `.control-node-card`, and `.event-modal` surfaces. Use the stronger opacity range and preserve dense scanning layouts. Do not change tab names, data, filters, modal behavior, or disabled attributes.

- [ ] **Step 4: Confirm protected files are byte-identical**

```powershell
Get-FileHash app/console/signal-dashboard.tsx -Algorithm SHA256
Get-FileHash -LiteralPath 'functions/api/node/[id]/action.js' -Algorithm SHA256
git diff -- app/console/signal-dashboard.tsx
git diff -- ':(literal)functions/api/node/[id]/action.js'
```

Expected: hashes match Step 1 and diffs are empty.

- [ ] **Step 5: Verify locked UI and action contract**

```powershell
npm run test:api
npm run test:visual -- --grep "console remains"
```

Expected: all visible `.control-actions button` elements are disabled and `edge-node-01` action returns 423.

- [ ] **Step 6: Commit Console presentation**

```powershell
git add app/console/page.tsx app/visual-system.css
git commit -m "feat: align public console presentation"
```

## Task 10: Finish Responsive, Motion, And Accessibility Rules

**Files:**
- Modify: `app/visual-system.css`
- Modify: `tests/visual-refresh.spec.ts`

- [ ] **Step 1: Add full reduced-motion behavior**

Append:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal,
  .reveal.is-visible,
  .home-hero__media,
  .orbit-card,
  .status-dot,
  .heartbeat-dot {
    animation: none !important;
    transition-duration: 0.01ms !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
```

- [ ] **Step 2: Add a reduced-motion browser assertion**

Add to `tests/visual-refresh.spec.ts`:

```ts
test("reduced motion leaves content visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.getByTestId("evidence-band")).toBeVisible();
  const transform = await page.getByTestId("home-orbit-field").evaluate((node) =>
    getComputedStyle(node).transform
  );
  expect(transform === "none" || transform.includes("matrix(1, 0, 0, 1")).toBeTruthy();
});
```

- [ ] **Step 3: Check stable dimensions and text containment**

Verify desktop widths 1280, 1440, and 1920; mobile widths 320, 390, and 430. Confirm:

- no horizontal overflow;
- no card or button changes layout size on hover;
- every fixed-format media item has an aspect ratio;
- the longest policy and service headings wrap within their containers;
- mobile Console and Home context remain visible;
- the next homepage section is hinted in the first viewport.

- [ ] **Step 4: Run all browser checks**

```powershell
npm run test:visual
```

Expected: all tests pass and screenshots are created under `test-results/`.

- [ ] **Step 5: Commit final CSS/test refinements**

```powershell
git add app/visual-system.css tests/visual-refresh.spec.ts
git commit -m "test: harden visual refresh responsiveness"
```

## Task 11: Local Release Verification And Scope Audit

**Files:**
- Verify all visual-refresh files
- Do not modify unrelated files

- [ ] **Step 1: Run the complete local verification sequence**

```powershell
npm run verify:visual-refresh
```

Expected, in order:

- four Node API contract tests pass;
- Next static export succeeds;
- public output risk scan prints `Public output risk scan passed.`;
- all Playwright desktop/mobile checks pass.

- [ ] **Step 2: Run explicit risky-term and secret scans**

```powershell
rg -n -i "NX Warden LLC|native pipe path|SingBox|Hysteria2|Mercury|192\.0\.2\.10|example-root-password-not-a-secret" out app public
rg -n -i "api[_-]?key\s*[:=]|secret\s*[:=]|password\s*[:=]|Bearer\s+[A-Za-z0-9._-]+" out
```

Expected: no unsafe public match. Review false positives rather than weakening the scanner.

- [ ] **Step 3: Audit changed files**

```powershell
git status --short
git diff --name-only HEAD~7..HEAD
```

Expected: only files listed in this plan. Specifically confirm no change to:

```powershell
git diff HEAD~7..HEAD -- TELEMETRY_CENTER.md app/contact-form.tsx app/console/signal-dashboard.tsx functions
```

Expected: empty diff for the protected files and directory.

- [ ] **Step 4: Review screenshots visually**

Use the image viewer for:

- `test-results/nxwarden-home-desktop.png`
- `test-results/nxwarden-console-desktop.png`

Also capture and inspect a 390x844 homepage and Console screenshot. Confirm nonblank media, correct framing, no overlap, readable strong glass surfaces, and no fictional endorsements.

- [ ] **Step 5: Request code review before integration**

Use the `requesting-code-review` skill against the feature branch. Address only findings within the approved visual-refresh scope, then rerun `npm run verify:visual-refresh`.

## Task 12: Integrate, Deploy, And Verify Production

**Files:**
- Create after verification: `C:\ATool\docs\NX_WARDEN_VISUAL_REFRESH_DEPLOYMENT.md`
- Do not stage: `TELEMETRY_CENTER.md`

- [ ] **Step 1: Squash the reviewed feature branch into main**

From `C:\ATool\CADCode\nxwarden-site`, confirm unrelated user changes remain untouched, then:

```powershell
git merge --squash codex/nxwarden-visual-refresh
git status --short
```

Stage only the exact implementation files listed in this plan. Never use `git add .`.

- [ ] **Step 2: Create the approved main-branch commit**

```powershell
git commit -m "Refresh NX Warden visual system"
```

Expected: one implementation commit on main; `TELEMETRY_CENTER.md` remains modified and unstaged if it was already modified by the user.

- [ ] **Step 3: Re-run the complete gate on main before deployment**

```powershell
npm run verify:visual-refresh
git diff --check HEAD~1..HEAD
```

Do not deploy unless both commands pass.

- [ ] **Step 4: Push main**

```powershell
git push origin main
```

Expected: GitHub main contains the reviewed visual-refresh commit.

- [ ] **Step 5: Deploy the existing Pages project**

```powershell
npx wrangler pages deploy out --project-name nxwarden
```

Do not create or modify Pages projects, D1, KV, R2, DNS, MX, Email Routing, or secrets.

- [ ] **Step 6: Run production browser verification**

```powershell
$env:PLAYWRIGHT_BASE_URL='https://nxwarden.com'
npm run test:visual
Remove-Item Env:PLAYWRIGHT_BASE_URL
```

Expected: the homepage, all subpages, contact presentation, and locked Console pass on the custom domain.

- [ ] **Step 7: Verify production API contracts**

```powershell
$health = Invoke-WebRequest 'https://nxwarden.com/api/health' -SkipHttpErrorCheck
if ($health.StatusCode -ne 200) { throw "Health check failed: $($health.StatusCode)" }

$contactBase = @{
  name = 'Visual contract probe'
  email = $null
  project_type = 'Company site'
  message = 'This request must not be accepted.'
  website = ''
}

$missing = Invoke-WebRequest 'https://nxwarden.com/api/contact' -Method Post -ContentType 'application/json' -Body ($contactBase | ConvertTo-Json) -SkipHttpErrorCheck
if ($missing.StatusCode -ne 403) { throw "Missing-token check failed: $($missing.StatusCode)" }

$invalidBody = $contactBase.Clone()
$invalidBody.cf_turnstile_response = 'invalid-production-probe'
$invalid = Invoke-WebRequest 'https://nxwarden.com/api/contact' -Method Post -ContentType 'application/json' -Body ($invalidBody | ConvertTo-Json) -SkipHttpErrorCheck
if ($invalid.StatusCode -ne 403) { throw "Invalid-token check failed: $($invalid.StatusCode)" }

$action = Invoke-WebRequest 'https://nxwarden.com/api/node/edge-node-01/action' -Method Post -ContentType 'application/json' -Body '{"action":"restart-service"}' -SkipHttpErrorCheck
if ($action.StatusCode -ne 423) { throw "Locked-action check failed: $($action.StatusCode)" }
```

These probes do not submit a valid contact inquiry and do not invoke a real action.

- [ ] **Step 8: Write the deployment record outside the repository**

Create `C:\ATool\docs\NX_WARDEN_VISUAL_REFRESH_DEPLOYMENT.md` containing:

- implementation commit hash;
- Cloudflare Pages deployment URL;
- verified production routes;
- build, scanner, desktop, mobile, contact, Console, and API results;
- screenshot paths;
- confirmation that no DNS, MX, Email Routing, secrets, LinkedIn, financial applications, ProofPack, router audit, Scrapling labs, VPS services, Contact behavior, Console behavior, or `TELEMETRY_CENTER.md` changes were made.

- [ ] **Step 9: Final repository audit**

```powershell
git status --short
git show --stat --oneline HEAD
```

Expected: only pre-existing unrelated user changes remain. Report them without modifying or staging them.

## Final Acceptance Criteria

- The generated hero asset is visible and correctly framed on desktop and mobile.
- Cards use strong dark glass surfaces around `rgba(8, 10, 18, 0.76)` to `rgba(10, 12, 22, 0.84)`.
- Four real public-safe evidence thumbnails replace fictional logos or endorsements.
- All nine requested shared components exist; `PageShell`, `SiteNav`, `PageHero`, `SectionHeader`, `GlassCard`, `Reveal`, and `SiteFooter` are used on public subpages, `EvidenceCard` is used by homepage/work proof, and `SignalBadge` is used by roadmap/Console status.
- `/services/`, `/work/`, `/roadmap/`, `/about/`, `/contact/`, `/policies/`, and `/console/` share the visual system.
- Contact remains email-first; Turnstile, endpoint, and fallback behavior are unchanged.
- Console remains public-safe, read-only, locked, and exposes no enabled control.
- Motion is CSS-first with one lightweight `Reveal` component and full reduced-motion support.
- Build, risk scan, desktop/mobile Playwright, overflow, contact, Console, health, 403, and 423 checks pass.
- Deployment occurs only after every local gate passes.
- No unrelated infrastructure, account, financial, research, router, VPS, or documentation files are changed.
