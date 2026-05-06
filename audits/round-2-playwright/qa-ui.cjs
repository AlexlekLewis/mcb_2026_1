/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");
const {
  changedPages,
  fullUrl,
  writeJson,
  withBrowser,
} = require("./shared.cjs");

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

function slug(route) {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-");
}

(async () => {
  const results = [];
  await withBrowser(async (browser) => {
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport });

      for (const route of changedPages) {
        const page = await context.newPage();
        await page.goto(fullUrl(route), { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(750);

        const metrics = await page.evaluate(() => {
          const brokenImages = [...document.images]
            .filter((img) => img.complete && img.naturalWidth === 0)
            .map((img) => img.currentSrc || img.src || img.alt);
          const visibleH1 = [...document.querySelectorAll("h1")].some((el) => {
            const box = el.getBoundingClientRect();
            return box.width > 0 && box.height > 0;
          });
          const ctaCount = [...document.querySelectorAll("a,button")]
            .filter((el) => /quote|measure|call/i.test(el.textContent || ""))
            .length;
          return {
            horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
            brokenImages,
            visibleH1,
            ctaCount,
            heroHasImage: [...document.querySelectorAll("img")].some((img) => {
              const rect = img.getBoundingClientRect();
              return rect.top < window.innerHeight && rect.width > 200 && rect.height > 120 && Boolean(img.currentSrc || img.src);
            }),
          };
        });

        const screenshotName = `${viewport.name}-${slug(route)}.png`;
        await page.screenshot({
          path: path.join(__dirname, screenshotName),
          fullPage: true,
        });

        results.push({
          route,
          viewport: viewport.name,
          screenshot: screenshotName,
          metrics,
          pass:
            metrics.horizontalOverflow <= 1 &&
            metrics.brokenImages.length === 0 &&
            metrics.visibleH1 &&
            metrics.ctaCount > 0 &&
            metrics.heroHasImage,
        });
        await page.close();
      }

      await context.close();
    }
  });

  const summary = {
    check: "ui-design-quality",
    passed: results.every((item) => item.pass),
    failures: results.filter((item) => !item.pass),
    results,
  };
  writeJson("qa-ui.json", summary);
  console.log(JSON.stringify(summary, null, 2));
  process.exit(summary.passed ? 0 : 1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
