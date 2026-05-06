/* eslint-disable @typescript-eslint/no-require-imports */
const {
  changedPages,
  fullUrl,
  newPageExpectations,
  writeJson,
  withBrowser,
} = require("./shared.cjs");

const pageTextRules = {
  "/awnings": {
    mustInclude: ["Outdoor Products Melbourne", "Zipscreens", "Roller Shutters", "Straight Drop", "Auto Awnings", "Fixed Guide"],
    mustExclude: ["Window Awnings", "Outdoor Shutters"],
  },
  "/blinds": {
    mustInclude: ["Smart Drapes", "Custom Made-to-Measure Blinds Melbourne"],
    mustExclude: ["Soft Vertical Drapes"],
  },
  "/curtains": {
    mustInclude: ["Double Curtains", "Gathered Curtains", "S-Fold"],
    mustExclude: [],
  },
  "/security": {
    mustInclude: ["Privacy Grille", "Window Grilles", "Security Side Panels", "Aluminium Mesh"],
    mustExclude: ["Window Security Screens"],
  },
  "/shutters": {
    mustInclude: ["PVC Shutters", "Modern Look", "Aluminium Shutters"],
    mustExclude: ["Polymer/PVC", "Cyclone"],
  },
  ...Object.fromEntries(
    Object.entries(newPageExpectations).map(([route, expectation]) => [
      route,
      { mustInclude: expectation.requiredText, mustExclude: ["Window Awnings", "Outdoor Shutters"] },
    ])
  ),
};

(async () => {
  const results = [];
  await withBrowser(async (browser) => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

    for (const route of changedPages) {
      await page.goto(fullUrl(route), { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);
      const text = await page.locator("body").innerText();
      const rule = pageTextRules[route] || { mustInclude: [], mustExclude: [] };
      const missing = rule.mustInclude.filter((term) => !text.includes(term));
      const forbidden = rule.mustExclude.filter((term) => text.includes(term));
      const h1 = (await page.locator("h1").first().textContent().catch(() => "") || "").trim();

      results.push({
        route,
        h1,
        missing,
        forbidden,
        pass: missing.length === 0 && forbidden.length === 0,
      });
    }

    await page.close();
  });

  const summary = {
    check: "image-context-and-copy-accuracy",
    passed: results.every((item) => item.pass),
    failures: results.filter((item) => !item.pass),
    results,
  };
  writeJson("qa-context.json", summary);
  console.log(JSON.stringify(summary, null, 2));
  process.exit(summary.passed ? 0 : 1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
