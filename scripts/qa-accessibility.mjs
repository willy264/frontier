import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const site=process.env.FRONTIER_QA_URL;
assert(site, 'Set FRONTIER_QA_URL to the preview');
let browser;
try { browser=await chromium.launch({channel:'msedge'}); } catch { browser=await chromium.launch(); }
const evidence=[];
try {
 for (const width of [390,1440]) {
  const context=await browser.newContext({viewport:{width,height:1000}});
  await context.addInitScript(()=>{ localStorage.setItem('frontier-intro-seen','yes'); window.__cls=0; window.__interactions=[]; new PerformanceObserver(list=>{for(const e of list.getEntries()) if(e.interactionId) window.__interactions.push(e.duration);}).observe({type:"event",durationThreshold:16,buffered:true}); new PerformanceObserver(list=>{for(const e of list.getEntries()) if(!e.hadRecentInput) window.__cls+=e.value;}).observe({type:'layout-shift',buffered:true}); });
  const page=await context.newPage(); await page.goto(site); await page.waitForFunction(()=>document.querySelector('.height-label')?.textContent.includes('Block'),null,{timeout:45000});
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
  const icons=await page.evaluate(()=>({icon:document.querySelector('link[rel="icon"]')?.href,manifest:document.querySelector('link[rel="manifest"]')?.href,og:document.querySelector('meta[property="og:image"]')?.content,cls:window.__cls}));
  const assets=[]; for(const [kind,url] of Object.entries(icons)) if(kind!=='cls') { assert(url,`Missing ${kind}`); const r=await context.request.get(url); assets.push({kind,url,status:r.status()}); }
  await page.getByRole('button',{name:'How to play',exact:true}).first().focus(); await page.keyboard.press('Enter'); assert(await page.locator('dialog').isVisible()); await page.keyboard.press('Escape'); assert(!await page.locator('dialog').isVisible());
  const ports=[];
  for(const name of ['Bitcoin Isle','Solana Reef','Base Harbor','Tron Bay','NEAR Capital']) {
   const button=page.getByRole('button',{name:new RegExp(` ${name}, `)}); await button.focus(); await page.keyboard.press('Enter');
   const visible=await button.evaluate(el=>{const r=el.getBoundingClientRect(),v=el.closest('.sea-map__viewport').getBoundingClientRect();return r.left>=v.left&&r.right<=v.right;}); ports.push({name,visible});
  }
  const routeControls=page.getByRole('button',{name:/^\d+ blocks from .+ to .+$/});
  const routeKeyboard=[];
  for(let index=0;index<await routeControls.count();index++) {
   const route=routeControls.nth(index); await route.focus(); await page.keyboard.press('Enter');
   const selected=await route.getAttribute('aria-pressed')==='true'; assert(selected,'Keyboard route selection failed');
   routeKeyboard.push({name:await route.getAttribute('aria-label'),selected});
  }
  assert.equal(routeKeyboard.length,5,'Expected five keyboard-operable routes');
  await page.getByRole('button',{name:/ Bitcoin Isle, /}).click();
  await page.evaluate(()=>{ document.activeElement?.blur(); scrollTo(0,0); });
  await page.screenshot({path:`results/design/verified-${width}.png`,fullPage:true});
  const stageTop = await page.locator('.world-stage').evaluate(el=>el.getBoundingClientRect().top + scrollY);
  await page.route('**/*',r=>r.request().method()==='POST' ? r.abort() : r.continue());
  await page.locator('.height-label').getByText('Can’t reach testnet. Retrying…',{exact:true}).waitFor({timeout:45000});
  const failedStageTop = await page.locator('.world-stage').evaluate(el=>el.getBoundingClientRect().top + scrollY);
  assert(Math.abs(stageTop-failedStageTop)<1,'RPC failure moved the map');
  await page.getByRole('button',{name:'Economy',exact:true}).click(); await page.getByText('Can’t reach testnet. Retrying…',{exact:true}).waitFor({timeout:45000});
  const interactionDurations=await page.evaluate(()=>window.__interactions);
  evidence.push({width,interactionDurations,routeKeyboard,violations:axe.violations,assets,cls:icons.cls,ports,errorState:true,errorLayoutShift:Math.abs(stageTop-failedStageTop),keyboardDialog:true}); await context.close();
 }
 await fs.writeFile('results/design/accessibility.json',JSON.stringify({site,evidence},null,2));
 if(evidence.some(e=>e.violations.length||e.cls>.1||e.assets.some(a=>a.status!==200)||e.ports.some(p=>!p.visible))) process.exitCode=1;
 console.log(JSON.stringify(evidence.map(e=>({...e,violations:e.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))})),null,2));
} finally {await browser.close();}
