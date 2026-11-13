// Optional local QA tools live under ignored data/video-tools, never in the app bundle.
import fs from 'node:fs/promises';
import { chromium } from '../data/video-tools/node_modules/playwright/index.mjs';
const site = process.env.FRONTIER_QA_URL ?? 'http://localhost:3100';
const out = 'results/design';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const results = [];
try {
  for (const width of [320, 360, 390, 450, 768, 1024, 1280, 1440, 1536, 1920]) {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion });
      await context.addInitScript(() => localStorage.setItem('frontier-intro-seen', 'yes'));
      const page = await context.newPage();
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.goto(site, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForFunction(() => /Block|unavailable/.test(document.querySelector('.height-label')?.textContent ?? ''), null, { timeout: 45000 });
      await page.evaluate(() => document.fonts.ready);
      const metrics = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, font: getComputedStyle(document.querySelector('h1')).fontFamily, targets: [...document.querySelectorAll('button')].filter(el => { const r = el.getBoundingClientRect(); return r.width && r.height && (r.width < 24 || r.height < 24); }).map(el => el.textContent) }));
      if ([390, 1440].includes(width)) await page.screenshot({ path: `${out}/world-${width}-${reducedMotion}.png`, fullPage: true });
      results.push({ width, reducedMotion, ...metrics, errors });
      await context.close();
    }
  }
  await fs.writeFile(`${out}/responsive.json`, JSON.stringify({ site, checkedAt: new Date().toISOString(), results }, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
