import { expect, test } from "@playwright/test";
import { sellingModels, modelPath } from "../../src/lib/selling-models";
import { modelSellingContent } from "../../src/lib/model-selling-content";

for (const model of sellingModels) {
  test(`${model.slug}: public HTML, metadata, model content and working disclosures`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await context.newPage();
    const path = modelPath(model);
    const content = modelSellingContent[model.slug];
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe(path);
    await expect(page.locator("h1")).toHaveText(`Sell your ${model.shortName} in Bangalore`);
    await expect(page).toHaveTitle(`Sell Used ${model.shortName} in Bangalore | Zapiboo`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://www.zapiboo.com${path}`,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      content.description,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      `https://www.zapiboo.com${path}`,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index, follow/);
    await expect(page.getByText(content.identity.text, { exact: true })).toBeVisible();
    const schemas = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap((text) => JSON.parse(text));
    const services = schemas.filter((schema) => schema["@type"] === "Service");
    expect(services).toHaveLength(1);
    expect(services[0].url).toBe(`https://www.zapiboo.com${path}`);
    const breadcrumb = schemas.find((schema) => schema["@type"] === "BreadcrumbList");
    expect(breadcrumb.itemListElement).toHaveLength(3);
    expect(breadcrumb.itemListElement[2].item).toBe(`https://www.zapiboo.com${path}`);
    const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
    expect(faq.mainEntity).toHaveLength(content.faqs.length);
    for (const { question, answer } of content.faqs) {
      await page.getByText(question, { exact: true }).click();
      await expect(page.getByText(answer, { exact: true })).toBeVisible();
      expect(faq.mainEntity).toContainEqual({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      });
    }
    await expect(
      page.getByRole("link", { name: `Book a ${model.shortName} inspection`, exact: true }).first(),
    ).toHaveAttribute("href", `/pickup?vehicle=${model.category}`);
    const directory = page.getByRole("navigation", { name: "Sell by model", exact: true });
    for (const item of sellingModels)
      await expect(
        directory.getByRole("link", { name: item.shortName, exact: true }),
      ).toHaveAttribute("href", modelPath(item));
    expect(
      await page
        .locator("footer")
        .evaluate((footer) => footer.previousElementSibling?.getAttribute("aria-labelledby")),
    ).toBe("sell-by-model-title");
    await context.close();
  });
}

test("model URLs are in the sitemap, unknown models return 404, and the car redirect is exact", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const model of sellingModels)
    expect(xml).toContain(`https://www.zapiboo.com${modelPath(model)}</loc>`);
  for (const path of [
    "/sell-used-car/not-a-model",
    "/sell-used-bike/honda-city",
    "/sell-used-scooter/maruti-swift",
  ]) {
    expect((await request.get(path)).status()).toBe(404);
  }
  const redirect = await request.get("/sell-used-car", { maxRedirects: 0 });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers().location).toBe("/sell-used-car-bangalore");
});

test("model directory works from the homepage and category pages without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  for (const path of [
    "/",
    "/sell-used-car-bangalore",
    "/sell-used-bike-bangalore",
    "/sell-used-scooter-bangalore",
  ]) {
    await page.goto(path);
    await page
      .getByRole("navigation", { name: "Sell by model", exact: true })
      .getByRole("link", { name: "Maruti Swift", exact: true })
      .click();
    await expect(page).toHaveURL(/\/sell-used-car\/maruti-swift$/);
    await expect(page.locator("h1")).toHaveText("Sell your Maruti Swift in Bangalore");
  }
  await context.close();
});

for (const slug of ["maruti-swift", "royal-enfield-classic-350", "honda-activa"] as const) {
  const model = sellingModels.find((item) => item.slug === slug)!;
  test(`${slug}: responsive layout and booking category handoff`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/rest/v1/vehicle_categories?*", (route) =>
      route.fulfill({
        json: [
          { id: "car", name: "Car", image_url: null },
          { id: "bike", name: "Bike", image_url: null },
          { id: "scooter", name: "Scooter", image_url: null },
        ],
      }),
    );
    await page.route("**/rest/v1/vehicle_subcategories?*", (route) =>
      route.fulfill({ json: [{ id: "type", name: "Test type", image_url: null }] }),
    );
    await page.goto(modelPath(model));
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.locator("h1")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    expect(errors).toEqual([]);
    await page.screenshot({ path: `test-results/${slug}-desktop.png`, fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `test-results/${slug}-mobile.png`, fullPage: true });
    await page
      .getByRole("region", { name: "Sell by model", exact: true })
      .screenshot({ path: `test-results/${slug}-model-directory.png` });
    await page
      .getByRole("link", { name: `Book a ${model.shortName} inspection`, exact: true })
      .first()
      .click();
    await expect(
      page.getByRole("heading", { name: "What type of vehicle?", exact: true }),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => JSON.parse(sessionStorage.getItem("zapiboo-pickup-draft") || "{}")),
      )
      .toMatchObject({ vehicleType: model.category, vehicleCategoryId: model.category });
  });
}
