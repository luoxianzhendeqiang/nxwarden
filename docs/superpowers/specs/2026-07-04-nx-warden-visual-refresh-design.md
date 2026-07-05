# NX Warden Visual System Refresh Design

Date: 2026-07-04

## Objective

Refresh the NX Warden public website into a premium, credible cloud operations studio experience while preserving its existing content, legal posture, contact behavior, and public-safe console boundaries.

The approved direction uses a shared visual system with targeted page refactoring. It is not a full rewrite and does not add new product features.

## Design Direction

The site will use a deep black and navy foundation with restrained purple-blue energy, warm gold highlights, off-white typography, and denser translucent surfaces. The visual reference is a cinematic black-hole scene with oversized editorial typography and product cards arranged around the focal field.

The result should feel:

- credible before decorative;
- visually distinctive without looking like a game interface;
- technical without exposing private infrastructure;
- premium without relying on fictional customers or inflated claims;
- consistent across public pages and the read-only console.

Existing public copy remains substantially unchanged. Copy edits are limited to line breaks, short labels, and minor wording needed for layout clarity. Legal entity references and trust-safe statements are not reinterpreted.

## Implementation Approach

Use shared visual primitives and targeted page refactoring.

- Keep the existing Next.js application, routes, form behavior, and static export model.
- Introduce a small set of shared presentation components rather than rebuilding every page independently.
- Refactor the homepage most heavily because it defines the new identity.
- Recompose subpages around the shared system while retaining their current information and intent.
- Keep the console implementation isolated from public marketing components where its operational density requires different layout rules.
- Avoid unrelated changes to backend APIs, Cloudflare resources, telemetry behavior, or deployment configuration.

## Visual Tokens

The shared visual system will define named tokens for:

- near-black and deep navy page backgrounds;
- off-white primary text and muted blue-gray secondary text;
- warm gold primary accents;
- electric blue and restrained violet signal accents;
- translucent surface fills with controlled blur;
- gold, indigo, and neutral borders;
- status colors that remain readable without relying on color alone;
- compact radii no greater than 8px for cards and controls;
- consistent desktop and mobile spacing scales;
- discrete heading sizes at responsive breakpoints rather than continuous viewport-width scaling.

Letter spacing remains zero. Decorative gradients are limited to the generated hero image and subtle surface lighting; the interface will not add floating gradient orbs or bokeh decoration.

## Homepage

### Navigation

The existing brand and route structure remain. The navigation is placed over the hero field with a restrained bottom divider.

- NX Warden remains the strongest brand signal.
- Services, Work, Roadmap, About, Contact, and Policies remain directly accessible.
- Console remains visually distinct but is not presented as an unlocked control surface.
- The mobile header exposes a clear menu and Console entry without horizontal overflow.

### Hero Composition

The first viewport uses a full-bleed generated bitmap visual, not an SVG or CSS illustration.

- The left side contains the current positioning label, large headline, supporting copy, and existing primary actions.
- The headline remains the dominant first-viewport object and uses deliberate line breaks.
- The right side contains the black-hole focal field with purple-blue energy and warm gold light.
- Four product cards orbit the visual field: Business Website, Dashboard Layer, Runbook Trail, and Automation Setup.
- The cards use Lucide icons, compact labels, concise existing descriptions, and distinct accent colors.
- Cards never cover the headline, primary calls to action, or the black-hole focal center.
- The first viewport leaves a visible hint of the evidence section below on desktop and mobile.

### Evidence Band

The bottom hero band uses real public proof rather than fictional customer logos.

Approved proof sources:

- public company surface;
- read-only Console;
- contact or inquiry path;
- public work sample where spacing permits.

Each item uses a real public-safe screenshot thumbnail, a short factual caption, and a link to its corresponding public route. The band must not imply third-party endorsement, customer volume, or work that did not occur.

On mobile, proof items become a stable single-column stack or a controlled horizontal scroller with visible focus states. No auto-scrolling carousel is used.

## Shared Components

The refresh introduces focused components with presentation-only responsibilities:

- `PageShell`: shared background, page width, and section spacing.
- `SiteNav`: desktop and mobile navigation behavior.
- `PageHero`: subpage title, eyebrow, summary, and optional actions.
- `SectionHeader`: consistent section hierarchy.
- `GlassCard`: shared surface, border, and hover behavior for independent items only.
- `SignalBadge`: status and category labels with text plus color.
- `EvidenceCard`: public screenshot, caption, and destination.
- `Reveal`: small client-side progressive reveal behavior with reduced-motion support.
- `SiteFooter`: consistent legal and route context.

Components will not contain page-specific business facts. Page modules provide their own content through explicit props or local data structures.

No card is placed inside another decorative card. Full page sections remain unframed bands with constrained inner content.

## Subpage Treatment

### Services

Preserve current services and descriptions. Use a clear page hero followed by a dense service grid with icons, deliverables, and restrained actions. Avoid marketing-style oversized empty sections.

### Work

Lead with public-safe evidence and process. Real screenshots receive stronger visual priority than abstract claims. Existing disclaimers and factual boundaries remain visible.

### Roadmap

Present roadmap stages as an ordered signal trail rather than decorative cards. Current and future work must remain clearly distinguishable.

### About

Preserve the legal relationship between NX Warden and NexusWarden Technology LLC. Improve readability and founder/studio context without inventing history, clients, revenue, or operating claims.

### Contact

Change presentation only.

- Direct email remains the primary resilient contact path.
- Existing Turnstile integration, fallback behavior, endpoint, and validation remain unchanged.
- Form success and failure states remain explicit and accessible.
- No secret or environment details appear in the UI.

### Policies

Improve scanning through clear headings, restrained section separators, and compact policy navigation. Policy meaning is unchanged.

### Console

Retain the Mission Control identity and operational density while aligning navigation, typography, borders, and accent colors with the refreshed public site.

- Console remains public-safe, read-only, and locked.
- No control action becomes enabled.
- No private paths, raw commit hashes, credentials, ports, IP addresses, or internal deployment details are introduced.
- Existing telemetry fallback behavior and API contracts are outside this visual refresh scope.

## Motion

Motion is medium intensity and supports hierarchy rather than spectacle.

- Hero background uses a very small positional shift or scale change.
- Product cards use slow, low-amplitude drift with varied timing.
- Sections reveal once through a lightweight `Reveal` component.
- Evidence cards and controls use short hover and focus transitions.
- Status lights may use a restrained pulse.

No heavy animation framework is required. CSS handles continuous and hover motion; the client component only observes section visibility.

When `prefers-reduced-motion: reduce` is active, continuous motion and reveal transforms are disabled. Content remains visible and fully usable.

## Responsive Behavior

Desktop uses an asymmetric hero with text on the left and the visual field on the right. Product cards occupy reserved positions with stable dimensions.

Tablet reduces headline and card density while maintaining the two-part composition where space permits.

Mobile changes structure rather than shrinking the desktop scene:

- text and actions appear first;
- the hero image receives its own stable aspect-ratio region;
- product cards move below the focal image as a single column or compact two-column grid;
- proof items stack or use controlled horizontal scrolling;
- navigation and Console context remain visible;
- no element creates horizontal page overflow;
- text does not overlap imagery or adjacent controls.

## Accessibility

- Maintain semantic heading order and landmark structure.
- Preserve visible keyboard focus for navigation, cards, and actions.
- Provide meaningful alt text for evidence images and decorative treatment for non-informational background imagery.
- Use sufficient text and border contrast over translucent surfaces.
- Do not communicate status through color alone.
- Keep touch targets usable on mobile.
- Verify layouts at desktop and mobile zoom-safe widths.

## Public Safety And Trust

The refresh must not introduce:

- fictional customers, partner logos, endorsements, or usage metrics;
- private infrastructure diagrams, IP addresses, ports, credentials, or node names;
- proxy, VPN, SingBox, Hysteria2, banking, Mercury, or financial application language;
- internal file paths, raw deployment details, or secret configuration state;
- unlocked Console actions or implied machine control;
- changes to DNS, MX, Email Routing, mail services, Cloudflare resource bindings, LinkedIn, ProofPack, router configuration, or VPS services.

The evidence band uses only existing public-safe assets and factual captions.

## Validation

Implementation is complete only after all of the following pass:

1. `npm run build` completes successfully.
2. A public-output scan finds no forbidden infrastructure details, credentials, raw secrets, or stale legal entity language.
3. Desktop Playwright checks cover the homepage and all public routes.
4. Mobile Playwright checks confirm navigation visibility, readable text, stable hero composition, and no horizontal overflow.
5. Contact verification confirms the current email path, Turnstile widget, fallback, and form states still render.
6. Console verification confirms public-safe wording and disabled control actions.
7. Major links and calls to action resolve to the intended routes.
8. Visual screenshots confirm the generated hero asset loads and proof thumbnails are not broken.
9. `TELEMETRY_CENTER.md` remains unstaged unless separately authorized.

## Delivery Boundary

After implementation and validation, only visual-refresh files are committed with the message `Refresh NX Warden visual system`. Deployment targets the existing Cloudflare Pages project only after the build, scan, and visual checks pass.

A deployment record will be written to `C:\ATool\docs\NX_WARDEN_VISUAL_REFRESH_DEPLOYMENT.md` after production verification.
