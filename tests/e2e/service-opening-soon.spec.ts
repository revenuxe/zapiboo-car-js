import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 375, height: 812 } });

test('contact fields stop input and open a compact notice', async ({ page }) => {
  await page.goto('/contact');
  await page.locator('#cname').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Sorry, we’re not open just yet');
  await expect(page.locator('#cname')).toHaveValue('');
  const box = await dialog.boundingBox();
  expect(box!.width).toBeLessThan(375);
  await page.getByRole('button', { name: 'Got it, thank you' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('a[href^="tel:"], a[href^="mailto:"]')).toHaveCount(0);
  await page.getByText('Phone support opening soon').click();
  await expect(dialog).toBeVisible();
});

test('WhatsApp opens the notice without leaving the website', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Sell instantly on WhatsApp' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
});

test('pickup first step continues directly to customer login', async ({ page }) => {
  let pickupWrites = 0;
  let profileWrites = 0;
  await page.route('**/rest/v1/leads*', route => {
    if (route.request().method() === 'POST') pickupWrites++;
    return route.fulfill({ json: [] });
  });
  await page.route('**/rest/v1/user_profiles*', route => {
    if (route.request().method() === 'POST') profileWrites++;
    return route.fulfill({ json: null });
  });
  await page.route('**/auth/v1/token*', route => route.fulfill({ json: {
    access_token: 'test-access-token', refresh_token: 'test-refresh-token',
    token_type: 'bearer', expires_in: 3600,
    user: { id: '22222222-2222-4222-8222-222222222222', email: 'customer@example.com',
      aud: 'authenticated', role: 'authenticated', created_at: new Date().toISOString(),
      app_metadata: { provider: 'email' }, user_metadata: { full_name: 'Test Customer', phone: '9999999999' } },
  } }));
  await page.route('**/rest/v1/vehicle_categories?*', route => route.fulfill({
    json: [{ id: '11111111-1111-4111-8111-111111111111', name: 'Car', image_url: null }],
  }));
  await page.goto('/pickup');
  await page.getByRole('button', { name: /Car/i }).first().click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sign in to continue' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /pickup address/i })).toHaveCount(0);
  await page.locator('#booking-si-email').fill('customer@example.com');
  await page.locator('#booking-si-password').fill('test-password');
  await page.getByRole('button', { name: 'Sign in and continue' }).click();
  await expect(page.getByRole('heading', { name: 'Sorry, we’re not open just yet' })).toBeVisible();
  await expect.poll(() => profileWrites).toBeGreaterThan(0);
  expect(pickupWrites).toBe(0);
});
