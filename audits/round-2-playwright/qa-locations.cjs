/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { chromium, request } = require("playwright");

const baseUrl = process.env.BASE_URL || "http://localhost:3010";
const outDir = __dirname;

const newProductSamples = [
  { slug: "straight-drop-awnings", title: "Straight Drop Awnings" },
  { slug: "auto-awnings", title: "Auto Awnings" },
  { slug: "fixed-guide-awnings", title: "Fixed Guide Awnings" },
  { slug: "motorised-outdoor-blinds", title: "Motorised Outdoor Blinds" },
  { slug: "wire-guide-awnings", title: "Wire Guide Awnings" },
  { slug: "double-curtains", title: "Double Curtains" },
  { slug: "gathered-curtains", title: "Gathered Curtains" },
];

function writeJson(name, data) {
  fs.writeFileSync(path.join(outDir, name), JSON.stringify(data, null, 2) + "\n");
}

async function pool(items, limit, worker) {
  const results = [];
  let index = 0;
  async function next() {
    const current = index++;
    if (current >= items.length) return;
    results[current] = await worker(items[current], current);
    await next();
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next));
  return results;
}

(async () => {
  const api = await request.newContext({ baseURL: baseUrl });
  const sitemapResponse = await api.get("/sitemap.xml");
  const sitemap = await sitemapResponse.text();
  const locationPaths = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+(\/locations\/[^<]+)<\/loc>/g)]
    .map((match) => match[1])
    .filter((route) => /^\/locations\/[^/]+$/.test(route));

  const retiredPattern = /\b(Outdoor Blinds Melbourne|Window Awnings|Outdoor Shutters)\b/i;
  const stripApprovedSpecialty = (body) => body.replace(/\bMotorised Outdoor Blinds\b/g, "Motorised Specialty");
  const routeChecks = await pool(locationPaths, 18, async (route) => {
    const response = await api.get(route);
    const body = await response.text();
    const retiredTerm = stripApprovedSpecialty(body).match(retiredPattern)?.[0] || null;
    return {
      route,
      status: response.status(),
      retiredTerm,
      pass: response.status() < 400 && !retiredTerm,
    };
  });

  const preferredSuburbs = ["preston", "clyde", "mount-eliza"];
  const availableSuburbs = locationPaths.map((route) => route.split("/").pop());
  const sampleSuburbs = preferredSuburbs.filter((slug) => availableSuburbs.includes(slug));
  while (sampleSuburbs.length < 3 && availableSuburbs[sampleSuburbs.length]) {
    const fallback = availableSuburbs[sampleSuburbs.length];
    if (!sampleSuburbs.includes(fallback)) sampleSuburbs.push(fallback);
  }

  const productChecks = [];
  const redirectChecks = [];
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    for (const suburb of sampleSuburbs) {
      for (const product of newProductSamples) {
        const route = `/locations/${suburb}/${product.slug}`;
        const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(300);
        const h1 = (await page.locator("h1").first().textContent().catch(() => "") || "").trim();
        const body = await page.locator("body").innerText();
        productChecks.push({
          route,
          status: response ? response.status() : null,
          h1,
          pass: Boolean(
            response &&
            response.status() < 400 &&
            h1.includes(product.title) &&
            h1.toLowerCase().includes(suburb.replace(/-/g, " ")) &&
            !retiredPattern.test(stripApprovedSpecialty(body))
          ),
        });
      }
    }

    const redirectTargets = {
      "outdoor-blinds": "awnings",
      "window-awnings": "auto-awnings",
      "outdoor-shutters": "aluminium-shutters",
    };
    for (const [from, to] of Object.entries(redirectTargets)) {
      const route = `/locations/${sampleSuburbs[0]}/${from}`;
      await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      const finalPath = new URL(page.url()).pathname;
      redirectChecks.push({
        from: route,
        expected: `/locations/${sampleSuburbs[0]}/${to}`,
        finalPath,
        pass: finalPath === `/locations/${sampleSuburbs[0]}/${to}`,
      });
    }
  } finally {
    await browser.close();
    await api.dispose();
  }

  const summary = {
    check: "location-template-sweep",
    locationPageCount: locationPaths.length,
    sampleSuburbs,
    passed:
      routeChecks.every((item) => item.pass) &&
      productChecks.every((item) => item.pass) &&
      redirectChecks.every((item) => item.pass),
    failures: {
      routes: routeChecks.filter((item) => !item.pass),
      products: productChecks.filter((item) => !item.pass),
      redirects: redirectChecks.filter((item) => !item.pass),
    },
    productChecks,
    redirectChecks,
  };

  writeJson("qa-locations.json", summary);
  console.log(JSON.stringify(summary, null, 2));
  process.exit(summary.passed ? 0 : 1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
