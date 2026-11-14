// Root development dependency; this script is never imported by the Next app.
import fs from 'node:fs/promises';
import { chromium } from 'playwright';
const site = process.env.FRONTIER_QA_URL ?? 'http://localhost:3100';
const out = 'results/design';
await fs.mkdir(out, { recursive: true });
let browser;
try { browser = await chromium.launch({ channel: 'msedge', headless: true }); }
catch { browser = await chromium.launch({ headless: true }); }
const results = [];
try {
  for (const width of [320, 360, 390, 450, 768, 1024, 1280, 1440, 1536, 1920]) {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion });
      await context.addInitScript(() => localStorage.setItem('frontier-intro-seen', 'yes'));
      const page = await context.newPage();
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.goto(site, { waitUntil: 'domcontentloaded', timeout: 60000 });
      // Layout is measured once reads settle: live block height or the reserved outage status.
      // A throttled public RPC can keep the first read pending; measure layout in whichever state rendered.
      await page.waitForFunction(() => /Block|Can’t reach testnet/.test(document.querySelector('.height-label')?.textContent ?? ''), null, { timeout: 90000 }).catch(() => {});
      const label = await page.textContent('.height-label');
      const readState = /Block/.test(label) ? 'live' : /Can’t reach testnet/.test(label) ? 'outage' : 'loading';
      await page.evaluate(() => document.fonts.ready);
      const metrics = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, font: getComputedStyle(document.querySelector('h1')).fontFamily, targets: [...document.querySelectorAll('button')].filter(el => { const r = el.getBoundingClientRect(); return r.width && r.height && (r.width < 24 || r.height < 24); }).map(el => el.textContent) }));
      if ([390, 1440].includes(width)) await page.screenshot({ path: `${out}/world-${width}-${reducedMotion}.png`, fullPage: true });
      results.push({ width, reducedMotion, readState, ...metrics, errors });
      await context.close();
      // Space page loads so repeated QA visits do not trip public RPC throttling.
      await new Promise(resolve => setTimeout(resolve, 8000));
    }
  }
  await fs.writeFile(`${out}/responsive.json`, JSON.stringify({ site, checkedAt: new Date().toISOString(), results }, null, 2));
  console.log(JSON.stringify(results, null, 2));
  if (results.some(result => result.scrollWidth > result.viewport || result.errors.length || result.targets.length)) {
    console.error('Responsive QA failed: overflow, page errors, or targets below 24px.');
    process.exitCode = 1;
  }
} finally { await browser.close(); }
