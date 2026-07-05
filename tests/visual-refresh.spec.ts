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

test("desktop homepage exposes the refreshed hero and real evidence", async ({
  page
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Practical systems for real online work."
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
