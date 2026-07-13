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

const mobileViewports = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 430, height: 932 }
];

const desktopViewports = [
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 }
];

async function expectNoHorizontalOverflow(
  page: import("@playwright/test").Page
) {
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

async function expectNoElementOverlap(
  first: import("@playwright/test").Locator,
  second: import("@playwright/test").Locator
) {
  const [firstBox, secondBox] = await Promise.all([
    first.boundingBox(),
    second.boundingBox()
  ]);

  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();

  const overlaps = !(
    firstBox!.x + firstBox!.width <= secondBox!.x ||
    secondBox!.x + secondBox!.width <= firstBox!.x ||
    firstBox!.y + firstBox!.height <= secondBox!.y ||
    secondBox!.y + secondBox!.height <= firstBox!.y
  );
  expect(overlaps).toBe(false);
}

test("desktop homepage exposes the refreshed hero and real evidence", async ({
  page
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Turn scattered systems into a clear operations layer."
    })
  ).toBeVisible();
  await expect(page.getByTestId("home-orbit-field")).toBeVisible();
  await expect(page.getByTestId("evidence-band")).toBeVisible();
  await expect(page.getByTestId("evidence-card")).toHaveCount(4);
  await expect(page.getByText("Fictional customer")).toHaveCount(0);
  await expectNoHorizontalOverflow(page);

  await page.screenshot({
    path: "test-results/nxwarden-home-desktop.png",
    fullPage: true
  });
});

test("homepage positioning alignment names primary and secondary ICPs", async ({
  page
}) => {
  await page.goto("/");

  await expect(
    page.locator(".home-hero__lead")
  ).toContainText(
    /independent developers, solo founders, and founder-led micro-SaaS businesses/i
  );
  await expect(
    page.locator(".audience-copy")
  ).toContainText(
    /small technical studios and small technical teams without dedicated DevOps/i
  );
});

test("services positioning alignment puts offers before supporting capabilities", async ({
  page
}) => {
  await page.goto("/services/");

  const mainText = (await page.locator("main").innerText()).toLowerCase();
  const capabilitiesIndex = mainText.indexOf("supporting capabilities");

  expect(capabilitiesIndex).toBeGreaterThan(-1);
  for (const offer of [
    "Operations Clarity Audit",
    "Operations Foundation Sprint",
    "Runbook & Handoff System"
  ]) {
    const offerIndex = mainText.indexOf(offer.toLowerCase());
    expect(offerIndex).toBeGreaterThan(-1);
    expect(offerIndex).toBeLessThan(capabilitiesIndex);
  }

  const auditCard = page
    .locator("section[aria-labelledby='service-offers-title']")
    .locator("article")
    .filter({ hasText: "Operations Clarity Audit" });
  await expect(auditCard).toContainText(/no-credentials-first/i);
  await expect(auditCard).toContainText(/system inventory/i);
  await expect(auditCard).toContainText(/risk-priority map/i);
  await expect(auditCard).toContainText(/missing-documentation list/i);
  await expect(auditCard).toContainText(/30-day action plan/i);
});

test("contact positioning alignment exposes approved project types", async ({
  page
}) => {
  await page.goto("/contact/");

  await expect(page.locator("select[name='projectType'] option")).toHaveText([
    "Operations Clarity Audit",
    "Operations Foundation Sprint",
    "Runbook & Handoff System",
    "Website / workflow / dashboard project",
    "Not sure yet"
  ]);
});

test("work sample positioning alignment labels sanitized audit deliverable", async ({
  page
}) => {
  await page.goto("/work/");

  const sample = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Operations Clarity Audit sample" })
  });
  await expect(sample).toContainText(/internal.*sanitized sample/i);
  await expect(sample).toContainText(/not a customer engagement/i);
  await expect(sample).toContainText("System inventory");
  await expect(sample).toContainText("Risk-priority map");
  await expect(sample).toContainText("Missing-documentation list");
  await expect(sample).toContainText("30-day action plan");
});

test("roadmap positioning alignment separates validation and ProofPack", async ({
  page
}) => {
  await page.goto("/roadmap/");

  await expect(page.getByText(/service-offer validation/i)).toBeVisible();
  await expect(page.getByText(/public sample deliverables/i)).toBeVisible();
  await expect(page.getByText(/customer discovery interviews/i)).toBeVisible();
  await expect(
    page.getByText(/ProofPack is a separate local-first product/i)
  ).toBeVisible();
});

for (const viewport of mobileViewports) {
  test(`mobile routes fit at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const route of publicRoutes) {
      await page.goto(route);
      await expect(page.getByLabel("NX Warden home")).toBeVisible();
      await expectNoHorizontalOverflow(page);

      if (viewport.width === 390 && route === "/") {
        await page.screenshot({
          path: "test-results/nxwarden-home-mobile.png",
          fullPage: true
        });
      }

      if (viewport.width === 390 && route === "/console/") {
        await page.screenshot({
          path: "test-results/nxwarden-console-mobile.png",
          fullPage: true
        });
      }
    }
  });
}

for (const viewport of desktopViewports) {
  test(`desktop routes fit at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const route of publicRoutes) {
      await page.goto(route);
      await expect(page.getByLabel("NX Warden home")).toBeVisible();
      await expectNoHorizontalOverflow(page);
    }
  });
}

test("reduced motion keeps content visible and neutralizes transforms", async ({
  page
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.getByTestId("home-orbit-field")).toBeVisible();
  await expect(page.getByTestId("evidence-band")).toBeVisible();

  const heroMotion = await page.getByTestId("home-orbit-field").evaluate((node) => {
    const styles = getComputedStyle(node);
    return { animationName: styles.animationName, transform: styles.transform };
  });
  expect(heroMotion.animationName).toBe("none");
  expect(heroMotion.transform).toBe("none");

  const cardMotion = await page.locator(".orbit-card").first().evaluate((node) => {
    const styles = getComputedStyle(node);
    return { animationName: styles.animationName, transform: styles.transform };
  });
  expect(cardMotion.animationName).toBe("none");
  expect(cardMotion.transform).toBe("none");
});

test("hero card hover does not shift its layout box", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const card = page.locator(".orbit-card").first();
  const before = await card.boundingBox();
  await card.hover();
  const after = await card.boundingBox();
  expect(after).toEqual(before);
});

test("split-band headings never overlap their content panels", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const route of ["/roadmap/", "/about/"]) {
    await page.goto(route);

    const bands = page.locator(".split-band");
    const count = await bands.count();
    for (let index = 0; index < count; index += 1) {
      const band = bands.nth(index);
      await expectNoElementOverlap(
        band.locator(":scope > div:first-child h2"),
        band.locator(":scope > .text-panel")
      );
    }
  }
});

test("incomplete subpage grids do not render fake empty cells", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const route of ["/services/", "/roadmap/", "/about/"]) {
    await page.goto(route);
    const grids = page.locator(
      ".service-detail-grid, .evidence-grid, .roadmap-grid, .subpage-grid"
    );
    const count = await grids.count();

    for (let index = 0; index < count; index += 1) {
      const surface = await grids.nth(index).evaluate((node) => {
        const styles = getComputedStyle(node);
        return {
          backgroundColor: styles.backgroundColor,
          backgroundImage: styles.backgroundImage
        };
      });
      expect(surface.backgroundColor).toBe("rgba(0, 0, 0, 0)");
      expect(surface.backgroundImage).toBe("none");
    }
  }
});

test("contact remains email-first and keeps the protected secondary form", async ({
  page
}) => {
  await page.goto("/contact/");

  await expect(
    page
      .locator(".contact-priority")
      .getByRole("link", { name: "ceo@nxwarden.com" })
  ).toBeVisible();
  await expect(page.locator("form.contact-form")).toBeVisible();
  await expect(page.locator(".turnstile-shell")).toBeVisible();
});

test("console remains public-safe and all control actions stay disabled", async ({
  page
}) => {
  await page.goto("/console/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "NX WARDEN / MISSION CONTROL"
    })
  ).toBeVisible();
  await expect(page.getByText("CONTROL: READ ONLY")).toBeVisible();

  const controls = page.locator(".control-actions button");
  const count = await controls.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    await expect(controls.nth(index)).toBeDisabled();
  }

  await page.screenshot({
    path: "test-results/nxwarden-console-desktop.png",
    fullPage: true
  });
});
