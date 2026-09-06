import { test, expect } from '@playwright/test';

const pages = [
  ['/', /Sell your used car or bike in Bangalore/],
  ['/sell-used-car', /Sell your used car in Bangalore/],
  ['/materials', /Used vehicle price guide/],
  ['/pickup', /Booking/],
  ['/contact', /./],
  ['/privacy', /Privacy policy/],
  ['/terms', /Terms of service/],
  ['/auth', /Welcome back/],
  ['/admin/login', /./],
] as const;

for (const [path, heading] of pages) {
  test(`SSR HTML and metadata: ${path}`, async ({ browser, request }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).toMatch(/private|no-store/);
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(path);
    await expect(page.locator('h1').first()).toHaveText(heading);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('head title')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    expect(new URL((await page.locator('link[rel="canonical"]').getAttribute('href'))!).href).toBe(`https://www.zapiboo.com${path}`);
    expect(new URL((await page.locator('meta[property="og:url"]').getAttribute('content'))!).href).toBe(`https://www.zapiboo.com${path}`);
    if (path.startsWith('/auth') || path.startsWith('/admin')) await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    for (const schema of schemas) expect(() => JSON.parse(schema)).not.toThrow();
    await context.close();
  });

  test(`Hydration and images: ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error' && /hydration|didn't match|does not match|server rendered/i.test(message.text())) errors.push(message.text()); });
    await page.goto(path, { waitUntil: 'networkidle' });
    await expect(page.locator('h1').first()).toHaveText(heading);
    expect(errors).toEqual([]);
    await page.locator('img').evaluateAll(async images => { await Promise.all(images.map(image => { image.loading = 'eager'; return image.decode().catch(() => {}); })); });
    const broken = await page.locator('img').evaluateAll(images => images.filter(image => !(image as HTMLImageElement).complete || !(image as HTMLImageElement).naturalWidth).map(image => image.getAttribute('src')));
    expect(broken).toEqual([]);
  });
}

test('private routes redirect before returning protected content', async ({ request }) => {
  for (const [path, destination] of [['/account', '/auth'], ['/admin/dashboard', '/admin/login']]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toContain(destination);
    expect(await response.text()).not.toMatch(/<h1[^>]*>Dashboard<\/h1>/);
  }
});

test('sitemap, robots, and genuine 404 response', async ({ request, page }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const [path] of pages.slice(0, 7)) expect(xml).toContain(`https://www.zapiboo.com${path}</loc>`);
  expect(xml).not.toContain('/admin');
  expect(xml).not.toContain('/account');
  expect(xml).not.toContain('/auth');
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Sitemap: https://www.zapiboo.com/sitemap.xml');
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('mobile menu and client navigation retain site layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('footer')).toBeVisible();
});

test('booking first step and saved query parameters work', async ({ page }) => {
  await page.route('**/rest/v1/vehicle_categories?*', route => route.fulfill({ json: [{ id: 'car', name: 'Car', image_url: null }] }));
  await page.route('**/rest/v1/vehicle_subcategories?*', route => route.fulfill({ json: [{ id: 'sedan', name: 'Sedan', image_url: null }] }));
  await page.goto('/pickup?pincode=560043');
  await expect(page.getByRole('heading', { name: 'Booking', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Car/ }).first().click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sedan', exact: true })).toBeVisible();
});

test('authentication tabs work without submitting real credentials', async ({ page }) => {
  await page.goto('/auth');
  await page.getByRole('tab', { name: 'Create account' }).click();
  await expect(page.getByRole('heading', { name: 'Create your account', exact: true })).toBeVisible();
  await page.getByRole('tab', { name: /Sign in/ }).click();
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
});

test('invalid OAuth callback returns to sign-in', async ({ request }) => {
  const response = await request.get('/auth/callback?next=https://evil.example', { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  expect(new URL(response.headers().location).pathname).toBe('/auth');
});
