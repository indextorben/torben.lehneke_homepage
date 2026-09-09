const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const scenes = require('./showcases.cjs');
const origin = process.env.PORTFOLIO_TEST_URL || 'http://localhost:3000';
const output = path.join(__dirname, '..', 'tmp', 'portfolio-review');
fs.mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch({channel:'chrome'});
  const errors = [];
  const metrics = [];
  try {
    const context = await browser.newContext({ locale: 'de-DE' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    // Reproduce the actual repeated overlay across documents, then verify both storage paths.
    await page.goto(origin, { waitUntil: 'networkidle' });
    assert.ok(await page.locator('.cookie-banner').isVisible(), 'First visit presents the notice');
    assert.equal(await page.evaluate(() => sessionStorage.getItem('site_notice_shown')), 'true');
    await page.goto(`${origin}/apps/beework/index.html`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.cookie-banner').isVisible(), false, 'No repeated notice without choosing');
    await page.goBack({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.cookie-banner').isVisible(), false, 'Back navigation does not restore the notice');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.cookie-banner').isVisible(), false);
    await page.evaluate(() => window.cookieConsent.open());
    await page.locator('[data-cookie-essential]').click();
    const saved = await page.evaluate(() => localStorage.getItem('cookie_consent'));
    assert.equal(JSON.parse(saved).statistics, false);
    assert.equal(JSON.parse(saved).marketing, false);
    const second = await context.newPage();
    await second.goto(`${origin}/apps/beefocus/index.html`, { waitUntil: 'networkidle' });
    assert.equal(await second.locator('.cookie-banner').isVisible(), false, 'Persisted choice works in another tab');
    await second.close();
    for (const id of Object.keys(scenes)) {
      for (const width of [320, 390, 768, 1366, 1920, 2560, 3440]) {
        const height = width >= 2560 ? 1440 : width <= 390 ? 844 : 1080;
        await page.setViewportSize({ width, height });
        await page.goto(`${origin}/apps/${id}/index.html`, { waitUntil: 'networkidle' });
        assert.equal(await page.locator('.cookie-banner').isVisible(), false);
        assert.equal(await page.locator('h1').count(), 1);
        const layout = await page.evaluate(() => {
          const hero = document.querySelector('.hero-stage').getBoundingClientRect();
          const brand = document.querySelector('.site-header .brand').getBoundingClientRect();
          const actions = document.querySelector('.header-actions').getBoundingClientRect();
          return { width: innerWidth, visualWidth: hero.width, overflow: document.documentElement.scrollWidth > innerWidth + 1, headerOverlap: brand.right > actions.left, enhanced: document.body.classList.contains('story-enhanced') };
        });
        assert.equal(layout.overflow, false, `${id} overflow ${width}`);
        assert.equal(layout.headerOverlap, false, `${id} header ${width}`);
        if (width >= 1920) assert.ok(layout.visualWidth > width * .43, `${id}: visual too small at ${width}`);
        if (width > 760) assert.ok(layout.enhanced, `${id}: motion not mounted`);
        if (width <= 390) assert.equal(await page.locator('.story-stage').isVisible(), false);
        metrics.push({ id, ...layout });
        if ([390,1920,2560,3440].includes(width)) await page.screenshot({ path: path.join(output, `showcase-${id}-${width}.png`) });
        if (width === 1920) {
          const startTransform = await page.locator('.hero-stage .device').evaluate(e => getComputedStyle(e).transform);
          await page.evaluate(() => window.scrollTo(0, 450));
          await page.waitForTimeout(700);
          assert.notEqual(await page.locator('.hero-stage .device').evaluate(e => getComputedStyle(e).transform), startTransform, `${id}: no hero scroll transformation`);
          for (const index of [...scenes[id].steps.keys(), 0]) {
            await page.locator('.story-step').nth(index).evaluate(el => {
              window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + el.clientHeight / 2 - innerHeight / 2, behavior: 'instant' });
            });
            await page.waitForTimeout(750);
            assert.equal(await page.locator('.product-story').getAttribute('data-active-step'), String(index), `${id} screen ${index}`);
            const stage = await page.locator('.story-stage').boundingBox();
            assert.ok(stage.y >= 70 && stage.y < 180, `${id}: sticky visual left viewport: ${stage.y}`);
            const opacity = await page.locator('.story-device .screen-state').nth(index).evaluate(e => Number(getComputedStyle(e).opacity));
            assert.ok(opacity > .9, `${id} screen ${index} invisible`);
            if (index === 1) await page.screenshot({ path: path.join(output, `showcase-${id}-sticky.png`) });
          }
          await page.locator('#langToggle').click();
          await page.waitForFunction(() => document.documentElement.lang === 'en');
          assert.equal(await page.locator('.showcase-title h1 span').first().textContent(), scenes[id].headline[0].en);
          await page.locator('#langToggle').click();
        }
        if (width === 390) {
          await page.locator('.nav-toggle').click();
          assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'), 'true');
          await page.locator('.nav-toggle').click();
        }
      }
      console.log(`${id}: seven viewport widths, forward/backward scroll scenes and navigation passed`);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${origin}/apps/beework/index.html`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('body').evaluate(e=>e.classList.contains('story-enhanced')), false);
    assert.ok(await page.locator('.step-mobile').first().isVisible());
    const nojs = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await nojs.newPage();
    await staticPage.goto(`${origin}/apps/beefocus/index.html`);
    assert.ok(await staticPage.locator('h1').isVisible());
    assert.ok(await staticPage.locator('.step-mobile').first().isVisible());
    assert.equal(await staticPage.locator('.story-step').count(), 4);
    // Missing GSAP still leaves every feature and visual accessible.
    const offline = await browser.newContext();
    await offline.route('**/portfolio/vendor/**', route => route.abort());
    const fallback = await offline.newPage();
    await fallback.goto(`${origin}/apps/cmdfind/index.html`);
    assert.ok(await fallback.locator('.step-mobile').first().isVisible());
    assert.deepEqual(errors, [], JSON.stringify(errors));
    fs.writeFileSync(path.join(output, 'showcase-metrics.json'), JSON.stringify(metrics, null, 2));
    console.log('Showcase checks passed: no console errors; reduced motion, no-JS, missing GSAP and notice persistence passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
