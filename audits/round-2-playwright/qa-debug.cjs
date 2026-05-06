/* eslint-disable @typescript-eslint/no-require-imports */
const {
  changedPages,
  fullUrl,
  writeJson,
  withBrowser,
} = require("./shared.cjs");

(async () => {
  const results = [];
  await withBrowser(async (browser) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });

    for (const route of changedPages) {
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];

      page.on("console", (msg) => {
        if (["error", "warning"].includes(msg.type())) {
          consoleErrors.push({ type: msg.type(), text: msg.text() });
        }
      });
      page.on("pageerror", (error) => pageErrors.push(error.message));

      const response = await page.goto(fullUrl(route), { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(750);
      const title = await page.title();
      const h1 = await page.locator("h1").first().textContent().catch(() => "");
      const bodyText = await page.locator("body").innerText();
      const nextError = /Application error|Unhandled Runtime Error|404|This page could not be found/i.test(bodyText);

      results.push({
        route,
        status: response ? response.status() : null,
        title,
        h1: (h1 || "").trim(),
        consoleErrors,
        pageErrors,
        nextError,
        pass: Boolean(response && response.status() < 400 && !consoleErrors.length && !pageErrors.length && !nextError),
      });
      await page.close();
    }
  });

  const summary = {
    check: "debug-page-health",
    passed: results.every((item) => item.pass),
    failures: results.filter((item) => !item.pass),
    results,
  };
  writeJson("qa-debug.json", summary);
  console.log(JSON.stringify(summary, null, 2));
  process.exit(summary.passed ? 0 : 1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
