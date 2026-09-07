import { expect, test } from '@playwright/test';
import { vehicleSellingLinks } from '../../src/lib/vehicle-selling-links';

test('public selling pages are cacheable and do not depend on external font CSS', async ({ request }) => {
  for (const path of ['/', ...vehicleSellingLinks.map(link => link.path), '/sell-used-car/maruti-swift']) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).not.toContain('no-store');
    expect(response.headers()['cache-control']).toContain('s-maxage');
    expect(await response.text()).not.toContain('https://fonts.googleapis.com');
  }
});

for (const { path, key } of vehicleSellingLinks) {
  test(`${key}: mobile does not download or display the hero image`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const images: string[] = [];
    page.on('request', request => { if (request.resourceType() === 'image') images.push(decodeURIComponent(request.url())); });
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
    const hero = page.locator('main section').first();
    await expect(hero.locator('img')).toBeHidden();
    await page.getByRole('navigation', { name: 'Sell by model', exact: true }).scrollIntoViewIfNeeded();
    expect(images.filter(url => /vehicle-(?:car|bike|scooter|suv|commercial)|doorstep-inspection/.test(url))).toEqual([]);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await hero.scrollIntoViewIfNeeded();
    await expect(hero.locator('img')).toBeVisible();
    await expect.poll(() => hero.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    if (key === 'car') {
      await page.screenshot({ path: 'test-results/restored-car-hero-desktop.png' });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: 'test-results/restored-car-hero-mobile.png' });
      await page.getByRole('link', { name: 'Get free valuation', exact: true }).click();
      await expect(page.getByLabel('Enter Your Car Registration Number', { exact: true })).toBeInViewport();
    }
  });
}

test('model directory does not prefetch all model pages when scrolled into view', async ({ page }) => {
  const prefetched: string[] = [];
  page.on('request', request => {
    if (request.headers()['next-router-prefetch'] && /\/sell-used-(?:car|bike|scooter)\//.test(request.url())) prefetched.push(request.url());
  });
  await page.goto('/contact');
  await page.getByRole('navigation', { name: 'Sell by model', exact: true }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('navigation', { name: 'Sell by model', exact: true })).toBeVisible();
  await page.waitForTimeout(1000);
  expect(prefetched).toEqual([]);
});
