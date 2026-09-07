import { expect, test } from "@playwright/test";
import { vehicleSellingLinks } from "../../src/lib/vehicle-selling-links";
import { vehicleSellingContent } from "../../src/lib/vehicle-selling-content";

test("old car URL permanently redirects and the sitemap lists only the canonical selling pages", async ({
  request,
}) => {
  const response = await request.get("/sell-used-car", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe("/sell-used-car-bangalore");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).not.toContain("https://www.zapiboo.com/sell-used-car</loc>");
  for (const { path } of vehicleSellingLinks)
    expect(xml).toContain(`https://www.zapiboo.com${path}</loc>`);
});

for (const { key, path } of vehicleSellingLinks) {
  const content = vehicleSellingContent[key];
  test(`${key}: server-rendered content, unique metadata, matching schema and footer navigation`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await context.newPage();
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(content.heading);
    await expect(page).toHaveTitle(content.title);
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
    for (const link of vehicleSellingLinks)
      await expect(
        page.locator("footer").getByRole("link", { name: link.label, exact: true }),
      ).toHaveAttribute("href", link.path);
    await expect(
      page.getByRole("link", { name: content.cta, exact: true }).first(),
    ).toHaveAttribute("href", `/pickup?vehicle=${content.booking}`);
    const schemas = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap((text) => JSON.parse(text));
    const services = schemas.filter((schema) => schema["@type"] === "Service");
    expect(services).toHaveLength(1);
    expect(services[0].url).toBe(`https://www.zapiboo.com${path}`);
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
    await context.close();
  });

  test(`${key}: responsive rendering, images and hydration`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(path);
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.locator("h1")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    const hero = page.getByAltText(content.imageAlt);
    await expect(hero).toBeVisible();
    await expect
      .poll(() =>
        hero.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
      )
      .toBe(true);
    expect(errors).toEqual([]);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `test-results/${key}-selling-mobile.png`, fullPage: true });
  });
}
