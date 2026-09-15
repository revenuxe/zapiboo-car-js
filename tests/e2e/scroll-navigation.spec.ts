import { test, expect } from '@playwright/test';

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test.describe(`${viewport.width}px navigation`, () => {
    test.use({ viewport });

    test('opens a page from the footer at the top', async ({ page }) => {
      await page.goto('/terms');
      const link = page.locator('footer a[href="/privacy"]').first();
      await link.scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
      await link.click();
      await expect(page).toHaveURL(/\/privacy$/);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    });

    test('opens the thank-you page at the top after a repair booking', async ({ page }) => {
      await page.route('**/rest/v1/leads*', route => route.fulfill({ status: 201, json: null }));
      await page.goto('/repair/services/bike-general-service');
      await page.locator('input[name="model"]').fill('Honda Activa');
      await page.locator('input[name="name"]').fill('Arjun Kumar');
      await page.locator('input[name="phone"]').fill('9876543210');
      await page.locator('input[name="locality"]').fill('Indiranagar');
      await page.getByRole('button', { name: 'Choose preferred date' }).click();
      await page.locator('[role="gridcell"] button:not([disabled])').first().click();
      await page.getByRole('button', { name: /Morning/ }).click();
      await page.getByRole('button', { name: 'Book now' }).scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
      await page.getByRole('button', { name: 'Book now' }).click();
      await expect(page).toHaveURL(/\/repair\/booking-confirmed\?id=/);
      await page.waitForTimeout(150);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    });

    test('resets scroll when advancing and returning to a booking step', async ({ page }) => {
      await page.route('**/rest/v1/vehicle_categories?*', route => route.fulfill({ json: [{ id: 'car', name: 'Car', image_url: null }] }));
      await page.route('**/rest/v1/vehicle_subcategories?*', route => route.fulfill({ json: [{ id: 'sedan', name: 'Sedan', image_url: null }] }));
      await page.goto('/pickup');
      await page.getByRole('button', { name: /Car/ }).first().click();
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Sedan', exact: true })).toBeVisible();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await page.getByRole('button', { name: 'Back', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeVisible();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    });
  });
}
