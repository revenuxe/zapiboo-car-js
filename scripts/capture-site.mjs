import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.SITE_URL || 'http://127.0.0.1:4173';
const label = process.env.CAPTURE_LABEL || 'before';
const directory = `.validation/${label}`;
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    for (const path of ['/', '/sell-used-car', '/materials', '/pickup', '/contact', '/privacy', '/terms', '/auth', '/admin/login']) {
      await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise(resolve => setTimeout(resolve, 40));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(800);
      const name = `${width}-${path.replaceAll('/', '-') || 'home'}`;
      await page.screenshot({ path: `${directory}/${name}.png`, fullPage: true });
      const snapshot = await page.evaluate(() => ({
        text: document.body.innerText,
        headings: [...document.querySelectorAll('h1,h2,h3')].map(el => ({ text: el.textContent, tag: el.tagName })),
        links: [...document.querySelectorAll('a')].map(el => ({ text: el.textContent, href: el.getAttribute('href') })),
        images: [...document.querySelectorAll('img')].map(el => ({ alt: el.alt, width: el.width, height: el.height, loaded: el.complete && el.naturalWidth > 0 })),
      }));
      await writeFile(`${directory}/${name}.json`, JSON.stringify(snapshot, null, 2));
      console.log(`${label}: ${width} ${path}`);
    }
    await page.close();
  }
} finally { await browser.close(); }
