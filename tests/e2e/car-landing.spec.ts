import { test, expect } from "@playwright/test";

test("car landing page renders its content and metadata without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto("/sell-used-car-bangalore");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Sell your used car in Bangalore",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.zapiboo.com/sell-used-car-bangalore",
  );
  await expect(page.getByRole("heading", { name: "What helps explain your hatchback or sedan's value?" })).toBeVisible();
  await page
    .getByText("Does entering my car details give me an instant price?", { exact: true })
    .click();
  await expect(page.getByText("No. Booking starts an inspection request.", { exact: false })).toBeVisible();
  await context.close();
});

test("registration validation, booking handoff and draft reload", async ({ page }) => {
  await page.goto("/sell-used-car-bangalore");
  const submit = page.getByRole("button", { name: "Request My Car Inspection", exact: true }).first();
  await submit.click();
  await expect(page.getByText("Enter a registration such as", { exact: false })).toBeVisible();
  await page
    .getByLabel("Enter Your Car Registration Number", { exact: true })
    .first()
    .fill("KA 01 AB 1234");
  await submit.click();
  const registration = page.getByLabel("Registration number (optional)");
  await expect(registration).toHaveValue("KA01AB1234");
  expect(page.url()).not.toContain("KA01");
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(sessionStorage.getItem("zapiboo-pickup-draft") || "{}").registrationNumber,
      ),
    )
    .toBe("KA01AB1234");
  await registration.fill("KA02CD5678");
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(sessionStorage.getItem("zapiboo-pickup-draft") || "{}").registrationNumber,
      ),
    )
    .toBe("KA02CD5678");
  await page.reload();
  await expect(registration).toHaveValue("KA02CD5678");
});

test("manual entry preserves the entered registration and selects car", async ({ page }) => {
  await page.goto("/sell-used-car-bangalore");
  await page.getByLabel("Enter Your Car Registration Number", { exact: true }).first().fill("KA 01 AB 1234");
  await page.getByRole("link", { name: "Enter Car Details Manually" }).first().click();
  await expect(page.getByLabel("Registration number (optional)")).toHaveValue("KA01AB1234");
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(sessionStorage.getItem("zapiboo-pickup-draft") || "{}").vehicleType,
      ),
    )
    .toBe("car");
});

test("final form accepts BH registrations", async ({ page }) => {
  await page.goto("/sell-used-car-bangalore");
  await page
    .getByLabel("Enter Your Car Registration Number", { exact: true })
    .last()
    .fill("22 BH 1234 AA");
  await page.getByRole("button", { name: "Request My Car Inspection", exact: true }).last().click();
  await expect(page.getByLabel("Registration number (optional)")).toHaveValue("22BH1234AA");
});

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`car landing has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/sell-used-car-bangalore");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

for (const [label, vehicle] of [['Sell your car', 'car'], ['Sell your bike', 'bike'], ['Sell your scooter', 'scooter'], ['Sell an SUV', 'car'], ['Electric vehicles', 'car'], ['Commercial vehicles', 'commercial']]) {
  test(`homepage ${label} overrides a previous car booking`, async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => sessionStorage.setItem('zapiboo-pickup-draft', JSON.stringify({ flowVersion: 2, step: 2, vehicleType: 'car', vehicleCategoryId: 'stale-car', registrationNumber: 'KA01AB1234' })));
    await page.getByRole('main').getByRole('link', { name: label, exact: true }).click();
    await expect(page.getByRole('heading', { name: 'What type of vehicle?', exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('zapiboo-pickup-draft') || '{}'))).toMatchObject({ step: 2, vehicleType: vehicle, registrationNumber: '' });
    await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('zapiboo-pickup-draft') || '{}').vehicleCategoryId)).toMatch(/^[0-9a-f-]{36}$/);
    await page.reload();
    await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('zapiboo-pickup-draft') || '{}').vehicleType)).toBe(vehicle);
  });
}


test('registration typed on the selling page prefills a later car category selection', async ({ page }) => {
  await page.goto('/sell-used-car-bangalore');
  await page.getByLabel('Enter Your Car Registration Number', { exact: true }).first().fill('KA 03 XY 4321');
  await page.goto('/');
  await page.getByRole('main').getByRole('link', { name: 'Sell your bike', exact: true }).click();
  await expect(page.getByLabel('Registration number (optional)')).toHaveValue('');
  await page.goto('/');
  await page.getByRole('main').getByRole('link', { name: 'Sell your car', exact: true }).click();
  await expect(page.getByLabel('Registration number (optional)')).toHaveValue('KA03XY4321');
});

test('an unauthenticated admin visit settles on the login screen', async ({ page }) => {
  await page.goto('/admin/dashboard');
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole('heading', { name: 'Admin sign in' })).toBeVisible();
});

for (const width of [320, 390]) {
  test(`footer legal links stay on one line at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const footer = page.getByRole('contentinfo');
    const legalLinks = footer.getByRole('navigation', { name: 'Legal links' });
    const links = [
      legalLinks.getByRole('link', { name: 'Privacy Policy', exact: true }),
      legalLinks.getByRole('link', { name: 'Terms of Service', exact: true }),
      legalLinks.getByRole('link', { name: 'Contact', exact: true }),
    ];
    const rows = await Promise.all(links.map(link => link.evaluate(element => Math.round(element.getBoundingClientRect().top))));
    expect(new Set(rows).size).toBe(1);
    await expect(footer.getByText('9886285028')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('about, privacy and terms pages are linked and contain their key content', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('heading', { level: 1, name: /A clearer way to sell your vehicle/i })).toBeVisible();
  await expect(page.getByText('+91 9886579923')).toBeVisible();
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { name: 'Information we collect' })).toBeVisible();
  await page.goto('/terms');
  await expect(page.getByRole('heading', { name: 'Valuations and offers' })).toBeVisible();
});

test('contact page publishes consistent Bangalore local-business information', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByText('No 6, 1st Cross, Umar Nagar, Nagawara Main Road, Bangalore 560045')).toBeVisible();
  await expect(page.getByRole('link', { name: '+91 9886579923' })).toHaveAttribute('href', 'tel:+919886579923');
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(schemas.join('\n')).toContain('Nagawara Main Road');
  expect(schemas.join('\n')).toContain('+919886579923');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.zapiboo.com/contact');
});
