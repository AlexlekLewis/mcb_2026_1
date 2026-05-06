/* eslint-disable @typescript-eslint/no-require-imports */
const {
  changedPages,
  fullUrl,
  retiredRoutes,
  writeJson,
  withBrowser,
} = require("./shared.cjs");

const requiredLinks = [
  "/awnings/straight-drop-awnings",
  "/awnings/auto-awnings",
  "/awnings/fixed-guide-awnings",
  "/awnings/motorised-outdoor-blinds",
  "/awnings/wire-guide-awnings",
  "/shutters/roller-shutters",
  "/blinds/soft-vertical-drapes",
  "/curtains/double-curtains",
  "/curtains/gathered-curtains",
];

const forbiddenLinks = [
  "/awnings/outdoor-blinds",
  "/awnings/window-awnings",
  "/shutters/outdoor-shutters",
];

(async () => {
  const results = {};
  await withBrowser(async (browser) => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(fullUrl("/"), { waitUntil: "networkidle" });

    const links = [];
    for (const label of ["Blinds", "Curtains", "Plantation Shutters", "Security", "Outdoor"]) {
      await page.getByRole("link", { name: label, exact: true }).first().hover();
      await page.waitForTimeout(150);
      links.push(
        ...(await page.$$eval("a[href]", (anchors) =>
          anchors.map((anchor) => ({
            text: anchor.textContent.trim().replace(/\s+/g, " "),
            href: anchor.getAttribute("href"),
          }))
        ))
      );
    }

    const allHrefSet = new Set(links.map((link) => link.href));
    const missingRequired = requiredLinks.filter((href) => !allHrefSet.has(href));
    const presentForbidden = forbiddenLinks.filter((href) => allHrefSet.has(href));
    const presentForbiddenLabels = links
      .filter((link) => ["Outdoor Blinds", "Window Awnings", "Outdoor Shutters"].includes(link.text))
      .map((link) => `${link.text} -> ${link.href}`);

    const routeChecks = [];
    for (const route of requiredLinks.concat(changedPages)) {
      const response = await page.goto(fullUrl(route), { waitUntil: "domcontentloaded" });
      routeChecks.push({
        route,
        status: response ? response.status() : null,
        pass: Boolean(response && response.status() < 400),
      });
    }

    const redirects = [];
    for (const [from, to] of Object.entries(retiredRoutes)) {
      const response = await page.goto(fullUrl(from), { waitUntil: "domcontentloaded" });
      const finalPath = new URL(page.url()).pathname;
      redirects.push({
        from,
        expected: to,
        finalPath,
        status: response ? response.status() : null,
        pass: finalPath === to,
      });
    }

    const outdoorText = await page.goto(fullUrl("/awnings"), { waitUntil: "domcontentloaded" })
      .then(() => page.locator("body").innerText());
    const forbiddenOutdoorText = ["Outdoor Blinds Melbourne", "Window Awnings", "Outdoor Shutters"].filter((term) =>
      new RegExp(`\\b${term}\\b`, "i").test(outdoorText)
    );

    results.links = { missingRequired, presentForbidden, presentForbiddenLabels };
    results.routeChecks = routeChecks;
    results.redirects = redirects;
    results.forbiddenOutdoorText = forbiddenOutdoorText;
    await page.close();
  });

  const summary = {
    check: "navigation-correctness",
    passed:
      !results.links.missingRequired.length &&
      !results.links.presentForbidden.length &&
      !results.links.presentForbiddenLabels.length &&
      !results.forbiddenOutdoorText.length &&
      results.routeChecks.every((item) => item.pass) &&
      results.redirects.every((item) => item.pass),
    results,
  };
  writeJson("qa-navigation.json", summary);
  console.log(JSON.stringify(summary, null, 2));
  process.exit(summary.passed ? 0 : 1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
