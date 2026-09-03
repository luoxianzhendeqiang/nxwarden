import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/products/proofpack/",
  "/products/proofpack/docs/",
  "/services/",
  "/work/",
  "/roadmap/",
  "/about/",
  "/contact/",
  "/policies/",
  "/privacy/",
  "/security/",
  "/terms/",
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

type PaintedTextMetrics = {
  box: { x: number; y: number; width: number; height: number };
  lineCount: number;
};

async function getPaintedTextMetrics(
  locator: import("@playwright/test").Locator,
  phrase?: string
): Promise<PaintedTextMetrics> {
  return locator.evaluate((node, requestedPhrase) => {
    const range = document.createRange();

    if (requestedPhrase) {
      const textNodes: Text[] = [];
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      let current = walker.nextNode();
      let combinedText = "";

      while (current) {
        textNodes.push(current as Text);
        combinedText += current.textContent ?? "";
        current = walker.nextNode();
      }

      const startIndex = combinedText
        .toLocaleLowerCase()
        .indexOf(requestedPhrase.toLocaleLowerCase());
      if (startIndex < 0) {
        throw new Error(`Could not find phrase: ${requestedPhrase}`);
      }

      const endIndex = startIndex + requestedPhrase.length;
      let cursor = 0;
      let startNode: Text | null = null;
      let endNode: Text | null = null;
      let startOffset = 0;
      let endOffset = 0;

      for (const textNode of textNodes) {
        const length = textNode.textContent?.length ?? 0;
        if (!startNode && startIndex >= cursor && startIndex < cursor + length) {
          startNode = textNode;
          startOffset = startIndex - cursor;
        }
        if (!endNode && endIndex > cursor && endIndex <= cursor + length) {
          endNode = textNode;
          endOffset = endIndex - cursor;
          break;
        }
        cursor += length;
      }

      if (!startNode || !endNode) {
        throw new Error(`Could not map phrase range: ${requestedPhrase}`);
      }
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);
    } else {
      range.selectNodeContents(node);
    }

    const rect = range.getBoundingClientRect();
    const lineTops: number[] = [];
    for (const fragment of Array.from(range.getClientRects())) {
      if (fragment.width <= 0 || fragment.height <= 0) continue;
      if (!lineTops.some((top) => Math.abs(top - fragment.top) <= 2)) {
        lineTops.push(fragment.top);
      }
    }

    return {
      box: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      },
      lineCount: lineTops.length
    };
  }, phrase);
}

function expectRectanglesNotToOverlap(
  first: PaintedTextMetrics["box"],
  second: PaintedTextMetrics["box"]
) {
  const overlaps = !(
    first.x + first.width <= second.x ||
    second.x + second.width <= first.x ||
    first.y + first.height <= second.y ||
    second.y + second.height <= first.y
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

test("desktop homepage work heading clears the complete timeline", async ({
  page
}) => {
  for (const viewport of desktopViewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const section = page.locator("section.work");
    const heading = page.getByRole("heading", {
      level: 2,
      name: "Small systems, written down and kept understandable."
    });
    const timeline = section.locator("ol.timeline");
    const handoff = timeline.getByText("Handoff", { exact: true });

    await expect(heading).toHaveText(
      "Small systems, written down and kept understandable."
    );
    await expect(timeline.locator("li")).toHaveCount(5);
    await expect(handoff).toBeVisible();

    const [sectionBox, timelineBox, headingText, lastWord, handoffText] =
      await Promise.all([
        section.boundingBox(),
        timeline.boundingBox(),
        getPaintedTextMetrics(heading),
        getPaintedTextMetrics(heading, "understandable."),
        getPaintedTextMetrics(handoff, "handoff")
      ]);

    expect(sectionBox).not.toBeNull();
    expect(timelineBox).not.toBeNull();
    expect(headingText.lineCount).toBeGreaterThanOrEqual(3);
    expect(headingText.lineCount).toBeLessThanOrEqual(4);
    expect(headingText.box.y + headingText.box.height).toBeLessThan(
      timelineBox!.y
    );
    expectRectanglesNotToOverlap(headingText.box, timelineBox!);
    expectRectanglesNotToOverlap(lastWord.box, handoffText.box);

    expect(headingText.box.x).toBeGreaterThanOrEqual(sectionBox!.x - 1);
    expect(headingText.box.x + headingText.box.width).toBeLessThanOrEqual(
      sectionBox!.x + sectionBox!.width + 1
    );

    const clipping = await heading.evaluate((node) => {
      const styles = getComputedStyle(node);
      return {
        overflowX: styles.overflowX,
        overflowY: styles.overflowY,
        wordBreak: styles.wordBreak
      };
    });
    expect(["hidden", "clip"]).not.toContain(clipping.overflowX);
    expect(["hidden", "clip"]).not.toContain(clipping.overflowY);
    expect(clipping.wordBreak).not.toBe("break-all");

    const timelineContained = await timeline.evaluate((node) => {
      const list = node.getBoundingClientRect();
      return Array.from(node.querySelectorAll("li")).every((item) => {
        const range = document.createRange();
        range.selectNodeContents(item);
        const text = range.getBoundingClientRect();
        return (
          text.left >= list.left - 1 &&
          text.right <= list.right + 1 &&
          text.top >= list.top - 1 &&
          text.bottom <= list.bottom + 1
        );
      });
    });
    expect(timelineContained).toBe(true);
    await expectNoHorizontalOverflow(page);
  }
});

test("mobile homepage keeps work heading and timeline in one stable column", async ({
  page
}) => {
  for (const viewport of mobileViewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const section = page.locator("section.work");
    const heading = section.locator("h2");
    const timeline = section.locator("ol.timeline");
    const [headingText, timelineBox] = await Promise.all([
      getPaintedTextMetrics(heading),
      timeline.boundingBox()
    ]);

    expect(timelineBox).not.toBeNull();
    await expect(heading).toHaveText(
      "Small systems, written down and kept understandable."
    );
    await expect(timeline.locator("li")).toHaveCount(5);
    await expect(timeline.getByText("Handoff", { exact: true })).toBeVisible();
    expect(headingText.box.y + headingText.box.height).toBeLessThan(
      timelineBox!.y
    );
    await expectNoHorizontalOverflow(page);
  }
});

test("homepage micro-polish metrics stay within the approved ranges", async ({
  page
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const desktopMetrics = await page.evaluate(() => {
    const systems = document.querySelector<HTMLElement>(".home-page > .systems")!;
    const systemsHeading = systems.querySelector<HTMLElement>("h2")!;
    const trustCopy = document.querySelector<HTMLElement>(".trust-copy")!;
    const trustGrid = document.querySelector<HTMLElement>(".trust-grid")!;
    const evidenceMedia = document.querySelector<HTMLElement>(
      ".evidence-card-v2__media"
    )!;
    const evidenceBody = document.querySelector<HTMLElement>(
      ".evidence-card-v2__copy > span:last-child"
    )!;
    const contactForm = document.querySelector<HTMLElement>(
      ".home-page > .contact .contact-form"
    )!;
    const footer = document.querySelector<HTMLElement>(".home-page .site-footer")!;
    const footerBrand = footer.querySelector<HTMLElement>("strong")!;
    const trustCopyBox = trustCopy.getBoundingClientRect();
    const trustGridBox = trustGrid.getBoundingClientRect();

    return {
      sectionPadding: Number.parseFloat(getComputedStyle(systems).paddingTop),
      headingSize: Number.parseFloat(getComputedStyle(systemsHeading).fontSize),
      trustIsStacked: trustCopyBox.bottom < trustGridBox.top,
      evidenceMediaWidth: evidenceMedia.getBoundingClientRect().width,
      evidenceBodySize: Number.parseFloat(getComputedStyle(evidenceBody).fontSize),
      contactFormWidth: contactForm.getBoundingClientRect().width,
      footerFontSize: Number.parseFloat(getComputedStyle(footer).fontSize),
      footerBrandSize: Number.parseFloat(getComputedStyle(footerBrand).fontSize),
      footerMarginTop: Number.parseFloat(getComputedStyle(footer).marginTop)
    };
  });

  expect(desktopMetrics.sectionPadding).toBeGreaterThanOrEqual(82);
  expect(desktopMetrics.sectionPadding).toBeLessThanOrEqual(88);
  expect(desktopMetrics.headingSize).toBeGreaterThanOrEqual(76);
  expect(desktopMetrics.headingSize).toBeLessThanOrEqual(79);
  expect(desktopMetrics.trustIsStacked).toBe(true);
  expect(desktopMetrics.evidenceMediaWidth).toBeGreaterThanOrEqual(104);
  expect(desktopMetrics.evidenceMediaWidth).toBeLessThanOrEqual(112);
  expect(desktopMetrics.evidenceBodySize).toBeGreaterThanOrEqual(13);
  expect(desktopMetrics.contactFormWidth).toBeGreaterThanOrEqual(520);
  expect(desktopMetrics.contactFormWidth).toBeLessThanOrEqual(560);
  expect(desktopMetrics.footerFontSize).toBeGreaterThanOrEqual(14);
  expect(desktopMetrics.footerBrandSize).toBeGreaterThanOrEqual(16);
  expect(desktopMetrics.footerMarginTop).toBeGreaterThanOrEqual(54);
  expect(desktopMetrics.footerMarginTop).toBeLessThanOrEqual(60);

  for (const [selector, phrase] of [
    ["#audience-title", "founder-operators"],
    ["#portal-title", "public-safe"],
    ["#contact-title", "scoped project"]
  ] as const) {
    const metrics = await getPaintedTextMetrics(page.locator(selector), phrase);
    expect(metrics.lineCount, `${phrase} should stay on one painted line`).toBe(1);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const mobileMetrics = await page.evaluate(() => {
    const systems = document.querySelector<HTMLElement>(".home-page > .systems")!;
    const systemsHeading = systems.querySelector<HTMLElement>("h2")!;
    const evidenceMedia = document.querySelector<HTMLElement>(
      ".evidence-card-v2__media"
    )!;
    return {
      sectionPadding: Number.parseFloat(getComputedStyle(systems).paddingTop),
      headingSize: Number.parseFloat(getComputedStyle(systemsHeading).fontSize),
      evidenceMediaWidth: evidenceMedia.getBoundingClientRect().width
    };
  });

  expect(mobileMetrics.sectionPadding).toBeGreaterThanOrEqual(56);
  expect(mobileMetrics.sectionPadding).toBeLessThanOrEqual(62);
  expect(mobileMetrics.headingSize).toBeGreaterThanOrEqual(34);
  expect(mobileMetrics.headingSize).toBeLessThanOrEqual(36);
  expect(mobileMetrics.evidenceMediaWidth).toBeGreaterThanOrEqual(72);
  expect(mobileMetrics.evidenceMediaWidth).toBeLessThanOrEqual(80);
  await expectNoHorizontalOverflow(page);
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

test("ProofPack product page presents the approved v1 offer and safe CTA path", async ({
  page
}) => {
  await page.goto("/products/proofpack/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Operating evidence, packaged."
    })
  ).toBeVisible();
  await expect(
    page.getByText(/ProofPack v1\.0\.0.*Released/i).first()
  ).toBeVisible();
  await expect(page.getByText(/a local-first compiler for turning operating work into structured, shareable evidence/i)).toBeVisible();
  await expect(page.getByText(/turn logs, commands, checks and deployment artifacts into a structured evidence bundle — locally\./i)).toBeVisible();

  const hero = page.locator(".page-hero");
  const getProofPack = hero.getByRole("link", { name: "Request ProofPack" });
  const viewExample = hero.getByRole("link", { name: "View Example" });
  await expect(getProofPack).toHaveAttribute("href", "/contact/");
  await expect(viewExample).toHaveAttribute("href", "#acme-relay-example");

  await expect(page.getByRole("heading", { name: "Backstage stays backstage." })).toBeVisible();
  await expect(page.getByText(/packages the evidence you choose to share without turning your private operating environment into the deliverable/i)).toBeVisible();
  await expect(page.getByText("Your work happened once. Its evidence should remain useful.")).toBeVisible();

  const outputTree = page.getByTestId("proofpack-output-tree");
  await expect(outputTree).toContainText("Manifest");
  await expect(outputTree).toContainText("Report");
  await expect(outputTree).toContainText("Evidence");
  await expect(outputTree).toContainText("Checksums");
  await expect(outputTree).toContainText("artifact_manifest.json");
  await expect(outputTree).toContainText("build_report.md");
  await expect(outputTree).toContainText("artifacts/");
  await expect(outputTree).toContainText("checksums.sha256");
  await expect(
    page.getByText(/internally retained v1\.0\.0 release artifact/i)
  ).toBeVisible();
  await expect(
    page.getByText(/No public ZIP download is currently available/i)
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Acme Relay shows the v1 package — with fictional data only."
    })
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("ProofPack documentation describes only implemented request-access behavior", async ({
  page
}) => {
  await page.goto("/products/proofpack/docs/");

  for (const heading of [
    "Overview",
    "Request access and prerequisites",
    "Quick start",
    "Commands",
    "Inputs",
    "Outputs",
    "Privacy model",
    "Fictional demo",
    "Limitations",
    "Security reporting",
    "Versioning"
  ]) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }

  await expect(
    page.getByText(/After receiving the ProofPack package from NX Warden/i)
  ).toBeVisible();
  const docs = page.locator("main");
  for (const command of ["init", "check", "build", "preview", "doctor"]) {
    await expect(docs.getByText(new RegExp(`generator\\.py ${command}`)).first()).toBeVisible();
  }
  await expect(docs.getByText(/generator\.py --version/).first()).toBeVisible();
  for (const output of [
    "proofpack.html",
    "proofpack.md",
    "compliance_checklist.json",
    "artifact_manifest.json",
    "build_report.json",
    "build_report.md",
    "checksums.sha256",
    "artifacts/"
  ]) {
    await expect(docs.getByText(output, { exact: true }).first()).toBeVisible();
  }
  await expect(docs).not.toContainText(/download ProofPack|GitHub repository/i);
  await expect(docs).toContainText(/ProofPack v1\.0\.0.*Released/i);
  await expect(docs).not.toContainText(/Release Candidate|Launching/i);
});

test("ProofPack is integrated without presenting fictional work as customer work", async ({
  page
}) => {
  await page.goto("/");
  await expect(page.locator(".site-nav__desktop").getByRole("link", { name: "Products" })).toHaveAttribute(
    "href",
    "/products/proofpack/"
  );
  const homeProduct = page.locator("section").filter({
    has: page.getByRole("heading", { name: "ProofPack", exact: true })
  });
  await expect(homeProduct).toContainText(/local-first operating evidence compiler/i);
  await expect(homeProduct).toContainText(/ProofPack v1\.0\.0.*Released/i);
  await expect(homeProduct.getByRole("link", { name: "Explore ProofPack" })).toHaveAttribute(
    "href",
    "/products/proofpack/"
  );

  await page.goto("/products/proofpack/#acme-relay-example");
  const example = page.locator("#acme-relay-example");
  await expect(example).toContainText(/fictional/i);
  await expect(example).toContainText(/not a customer engagement/i);

  await page.goto("/work/");
  const proofPackSample = page.locator("section").filter({
    has: page.getByRole("heading", { name: "ProofPack fictional example" })
  });
  await expect(proofPackSample).toContainText(/Acme Relay/i);
  await expect(proofPackSample).toContainText(/fictional/i);
  await expect(proofPackSample).toContainText(/not customer work/i);

  await page.goto("/roadmap/");
  await expect(page.getByText("ProofPack v1.0 — Released", { exact: true })).toBeVisible();
  await expect(page.locator("main")).not.toContainText(/ProofPack v1\.0\.0 Release Candidate|Launching/i);
  await expect(
    page.locator(".page-hero__description").getByText(/ProofPack is a separate local-first product/i)
  ).toBeVisible();
});

test("ProofPack metadata, public discovery files, links, and basic semantics are valid", async ({
  page,
  request
}) => {
  const response = await page.goto("/products/proofpack/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("ProofPack — Local-first Operating Evidence | NX Warden");
  await expect(page.locator("link[rel='canonical']")).toHaveAttribute(
    "href",
    "https://nxwarden.com/products/proofpack/"
  );
  await expect(page.locator("meta[name='description']")).toHaveAttribute(
    "content",
    /local-first operating evidence compiler/i
  );

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const sitemapText = await sitemap.text();
  for (const route of [
    "/products/proofpack/",
    "/products/proofpack/docs/",
    "/privacy/",
    "/security/",
    "/terms/"
  ]) {
    expect(sitemapText).toContain(`https://nxwarden.com${route}`);
  }
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("https://nxwarden.com/sitemap.xml");

  for (const href of ["/contact/", "/work/"]) {
    const linkedResponse = await request.get(href);
    expect(linkedResponse.status(), `${href} should resolve`).toBe(200);
  }

  const semanticIssues = await page.evaluate(() => {
    const ids = Array.from(document.querySelectorAll<HTMLElement>("[id]")).map(
      (node) => node.id
    );
    const duplicateIds = ids.filter(
      (id, index) => id && ids.indexOf(id) !== index
    );
    const imagesWithoutAlt = Array.from(document.images).filter(
      (image) => !image.hasAttribute("alt")
    ).length;
    const brokenLabelReferences = Array.from(
      document.querySelectorAll<HTMLElement>("[aria-labelledby]")
    ).filter((node) => {
      const references = node.getAttribute("aria-labelledby")?.split(/\s+/) ?? [];
      return references.some((id) => !document.getElementById(id));
    }).length;

    return {
      duplicateIds: Array.from(new Set(duplicateIds)),
      imagesWithoutAlt,
      brokenLabelReferences
    };
  });
  expect(semanticIssues).toEqual({
    duplicateIds: [],
    imagesWithoutAlt: 0,
    brokenLabelReferences: 0
  });

  const missingRoute = await page.goto("/products/not-a-real-product/");
  expect(missingRoute?.status()).toBe(404);
});

test("company surfaces distinguish the product, services, and fictional work", async ({
  page
}) => {
  await page.goto("/about/");
  await expect(page.getByText("NexusWarden Technology LLC").first()).toBeVisible();
  await expect(page.getByText(/NX Warden is the operating brand/i)).toBeVisible();
  await expect(page.getByText(/ProofPack v1\.0\.0.*Released/i)).toBeVisible();
  for (const offer of [
    "Operations Clarity Audit",
    "Operations Foundation Sprint",
    "Runbook & Handoff System"
  ]) {
    await expect(page.getByText(offer, { exact: true })).toBeVisible();
  }

  await page.goto("/work/");
  for (const label of [
    "Product development",
    "Internal infrastructure",
    "Client / service work",
    "Fictional demonstration"
  ]) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
  await expect(page.getByText(/Acme Relay is a fictional demonstration, not a customer or client engagement/i)).toBeVisible();

  await page.goto("/roadmap/");
  for (const category of ["Released", "Active Development", "Exploratory"]) {
    await expect(page.getByRole("heading", { name: category, exact: true })).toBeVisible();
  }
  await expect(page.getByText("ProofPack v1.0 — Released", { exact: true })).toBeVisible();
});

test("contact gives a safe ProofPack request-access handoff", async ({ page }) => {
  await page.goto("/contact/");
  const guide = page.getByTestId("proofpack-request-guide");
  await expect(guide.getByRole("heading", { name: "Looking for ProofPack?" })).toBeVisible();
  for (const detail of ["Product", "Use case", "Environment", "Evidence to package"]) {
    await expect(guide.getByText(detail, { exact: true })).toBeVisible();
  }
  await expect(guide.getByText(/do not send secrets or credentials by email/i)).toBeVisible();
  await expect(page.locator(".contact-priority").getByRole("link", { name: "ceo@nxwarden.com" })).toBeVisible();
  await expect(page.locator("form.contact-form")).toBeVisible();
});

test("policy pages match the current request-access model", async ({ page }) => {
  await page.goto("/policies/");
  for (const link of ["Privacy", "Security", "Terms"]) {
    await expect(page.getByRole("link", { name: link, exact: true })).toBeVisible();
  }

  await page.goto("/privacy/");
  await expect(page.getByText(/website inquiries/i)).toBeVisible();
  await expect(page.getByText(/local-first/i)).toBeVisible();

  await page.goto("/security/");
  await expect(page.getByText(/responsible disclosure/i).first()).toBeVisible();
  await expect(page.getByText(/does not provide compliance certification/i)).toBeVisible();

  await page.goto("/terms/");
  const terms = page.locator("main");
  await expect(terms.getByText(/request access/i)).toBeVisible();
  await expect(terms.getByText(/does not certify facts or compliance/i)).toBeVisible();
  await expect(terms).not.toContainText(/subscription|service level agreement|refund policy|enterprise warranty|paid licen[cs]ing/i);
});

test("ProofPack request CTA and output stay readable at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/products/proofpack/");

  const request = page.locator(".page-hero").getByRole("link", { name: "Request ProofPack" });
  const requestBox = await request.boundingBox();
  expect(requestBox).not.toBeNull();
  expect(requestBox!.height).toBeGreaterThanOrEqual(44);
  await expect(page.getByTestId("proofpack-output-tree")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

for (const viewport of mobileViewports) {
  for (const route of publicRoutes) {
    test(`mobile route ${route} fits at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
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
    });
  }
}

for (const viewport of desktopViewports) {
  for (const route of publicRoutes) {
    test(`desktop route ${route} fits at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(route);
      await expect(page.getByLabel("NX Warden home")).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });
  }
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
        band.locator(":scope > .text-panel, :scope > .deliverable-panel")
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
