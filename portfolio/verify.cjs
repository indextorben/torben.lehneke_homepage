const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const projects = require('./projects.cjs');
const origin = process.env.PORTFOLIO_TEST_URL || 'http://localhost:3000';
const out = path.join(__dirname, '..', 'tmp', 'portfolio-review');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true });
  const failures = [];
  try {
    const context = await browser.newContext({ locale: 'de-DE', reducedMotion: 'reduce' });
    await context.addInitScript(() => {
      localStorage.setItem('site_language', 'de');
      localStorage.setItem('theme', 'dark');
    });
    const page = await context.newPage();
    page.on('pageerror', error => failures.push(error.message));
    const routes = ['/', ...projects.filter(p=>p.detailPath).map(p => `/${p.detailPath}`)];
    for (const route of routes) {
      for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(origin + route, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
        const target = route === '/' ? '#referenzen' : await page.locator('.showcase-hero').count() ? '.showcase-hero' : 'main > .hero';
        await page.locator(target).scrollIntoViewIfNeeded();
        if (await page.locator(`${target} .portfolio-image`).count()) await page.locator(`${target} .portfolio-image`).first().evaluate(img => img.decode());
        if (route === '/') await page.locator('.portfolio-image').evaluateAll(images => Promise.all(images.map(img => img.decode())));
        const result = await page.evaluate(() => {
          const width = document.documentElement.clientWidth;
          const broken = [...document.querySelectorAll('.portfolio-image, .portfolio-icon img')].filter(img => img.complete && !img.naturalWidth).map(img => img.src);
          const oversize = [...document.querySelectorAll('.work-card, .case-art, .case-study, .site-header, .case-end')].filter(el => {
            const r = el.getBoundingClientRect(); return r.left < -1 || r.right > width + 1;
          }).map(el => el.className);
          const brand = document.querySelector('.site-header .brand').getBoundingClientRect();
          const actions = document.querySelector('.header-actions').getBoundingClientRect();
          return { overflow: document.documentElement.scrollWidth > width + 1, broken, oversize, headerOverlap: brand.right > actions.left + 1 };
        });
        if (result.overflow || result.broken.length || result.oversize.length || result.headerOverlap) failures.push({ route, width, ...result });
        if (width === 390 || width === 1440) {
          // Consent UI is tested by the existing site; hide only for design captures.
          const captureStyle = await page.addStyleTag({ content: '.cookie-banner,.site-header{visibility:hidden!important}' });
          await page.locator(target).screenshot({ path: path.join(out, `${route === '/' ? 'overview' : route.split('/')[2]}-${width}.png`) });
          await captureStyle.evaluate(element => element.remove());
        }
        await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), `${route} light theme overflow at ${width}`);
      }
      if (route === '/') {
        assert.equal(await page.locator('.work-card').count(), projects.filter(p => p.featured).length);
        await page.locator('.work-card').first().focus();
        await page.keyboard.press('Enter');
        await page.waitForURL('**/apps/beework/index.html');
        await page.goto(origin + route);
      } else {
        const p = projects.find(p => route.includes(`/${p.id}/`));
        assert.ok((await page.locator('.site-header .portfolio-icon img').getAttribute('src')).endsWith(p.icon));
        assert.equal(await page.locator('h1').count(), 1);
        assert.equal(await page.locator('.case-chapters article').count(), 3);
      }
      const hasLanguageSwitch = await page.locator('#langToggle').count();
      if (hasLanguageSwitch) await page.locator('#langToggle').click();
      else await page.evaluate(() => { document.documentElement.lang = 'en'; });
      await page.waitForFunction(() => document.documentElement.lang === 'en');
      assert.equal(await page.locator('[data-portfolio-de]').first().textContent(), await page.locator('[data-portfolio-de]').first().getAttribute('data-portfolio-en'));
      if (hasLanguageSwitch) await page.locator('#langToggle').click();
      else await page.evaluate(() => { document.documentElement.lang = 'de'; });
      await page.waitForFunction(() => document.documentElement.lang === 'de');
      const missingAnchors = await page.evaluate(() => [...document.querySelectorAll('.case-end a[href^="#"], .portfolio-back')].filter(a => a.hash && a.pathname === location.pathname && !document.getElementById(a.hash.slice(1))).map(a => a.href));
      assert.deepEqual(missingAnchors, []);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(origin + route);
      await page.locator('.nav-toggle').click();
      assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'), 'true');
      assert.ok(await page.locator('#navMenu').isVisible());
      await page.locator('.nav-toggle').click();
      console.log(`Checked ${route}: five widths, images, header, language and links`);
    }
    const nojs = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await nojs.newPage();
    await staticPage.goto(origin);
    assert.equal(await staticPage.locator('.work-card').count(), 3);
    await staticPage.goto(`${origin}/apps/cmdfind/index.html`);
    assert.equal(await staticPage.locator('.case-chapters article').count(), 3);
    assert.ok(await staticPage.locator('.showcase-topline a').isVisible());
    console.log('Static content is available without JavaScript.');
    assert.deepEqual(failures, [], JSON.stringify(failures, null, 2));
    console.log(`All portfolio browser checks passed. Screenshots: ${out}`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
