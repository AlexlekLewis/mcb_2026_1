/* eslint-disable @typescript-eslint/no-require-imports */
const {
  fullUrl,
  newPageExpectations,
  normaliseAsset,
  writeJson,
  withBrowser,
} = require("./shared.cjs");

(async () => {
  const pages = Object.keys(newPageExpectations);
  const results = [];
  await withBrowser(async (browser) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });

    for (const route of pages) {
      const page = await context.newPage();
      await page.goto(fullUrl(route), { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(750);

      const assets = await page.evaluate(() => {
        const urls = [];
        document.querySelectorAll("img").forEach((img) => {
          if (img.currentSrc || img.src) urls.push(img.currentSrc || img.src);
        });
        document.querySelectorAll("*").forEach((el) => {
          const bg = window.getComputedStyle(el).backgroundImage;
          if (bg && bg !== "none") {
            const matches = [...bg.matchAll(/url\\([\"']?([^\"')]+)[\"']?\\)/g)];
            matches.forEach((match) => urls.push(match[1]));
          }
        });
        return urls;
      });

      const normalised = [...new Set(assets.map(normaliseAsset).filter(Boolean))];
      const expected = newPageExpectations[route].hero;
      const heroMatches = normalised.filter((asset) => asset.includes(expected));
      results.push({
        route,
        expectedHero: expected,
        productAssets: normalised.filter((asset) => /product-unique|assets|images/.test(asset)),
        pass: heroMatches.length > 0,
      });
      await page.close();
    }
  });

  const heroByPage = Object.fromEntries(results.map((item) => [item.route, item.expectedHero]));
  const duplicateExpectedHeroes = Object.entries(
    Object.values(heroByPage).reduce((acc, hero) => {
      acc[hero] = (acc[hero] || 0) + 1;
      return acc;
    }, {})
  ).filter(([, count]) => count > 1);

  const summary = {
    check: "unique-new-page-images",
    passed: results.every((item) => item.pass) && duplicateExpectedHeroes.length === 0,
    duplicateExpectedHeroes,
    results,
  };
  writeJson("qa-unique-images.json", summary);
  console.log(JSON.stringify(summary, null, 2));
  process.exit(summary.passed ? 0 : 1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
