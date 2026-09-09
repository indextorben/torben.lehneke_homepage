const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
const origin = process.env.PORTFOLIO_TEST_URL || 'http://localhost:3000';
const output = path.join(__dirname,'../tmp/home-review');
fs.mkdirSync(output,{recursive:true});
const sections=['.hero','#website-vorteile','#leistungen','#webdesign','#ueberuns','#ablauf','#referenzen','#bewertungen','#zertifizierungen','#faq','#kontakt','.site-footer'];
const sizes=[[320,812],[390,844],[768,1024],[1366,768],[1440,900],[1920,1080],[2560,1440],[3440,1440]];
const documents=['impressum.html','datenschutz.html','404.html','apps/deskpilot/index.html','apps/ledger/index.html','apps/beefocus/datenschutz.html','apps/beefocus/nutzungsbedingungen.html','apps/beework/nutzungsbedingungen.html','apps/deskpilot/datenschutz.html','apps/deskpilot/agb.html'];
async function position(page,selector,center=false) {
  await page.locator(selector).evaluate((el,center)=>scrollTo({top:el.getBoundingClientRect().top+scrollY+(center?el.clientHeight/2-innerHeight/2:-110),behavior:'instant'}),center);
  await page.waitForTimeout(550);
}
async function layout(page,label) {
  const result=await page.evaluate(()=>{
    const r=el=>el?.getBoundingClientRect();
    const brand=r(document.querySelector('.site-header .brand')), actions=r(document.querySelector('.header-actions'));
    return {overflow:document.documentElement.scrollWidth>innerWidth+1,headerOverlap:!!brand&&!!actions&&brand.right>actions.left+1,broken:[...document.images].filter(i=>i.getAttribute('src')&&i.complete&&!i.naturalWidth).map(i=>i.src)};
  });
  assert.equal(result.overflow,false,`${label}: overflow`);
  assert.equal(result.headerOverlap,false,`${label}: header overlap`);
  assert.deepEqual(result.broken,[],`${label}: broken images`);
}
(async()=>{
  const browser=await chromium.launch();
  const errors=[],metrics=[];
  try{
    const context=await browser.newContext({locale:'de-DE'});
    await context.addInitScript(()=>sessionStorage.setItem('site_notice_shown','true'));
    const page=await context.newPage();
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    for(const [width,height] of sizes){
      await page.setViewportSize({width,height});
      await page.goto(origin,{waitUntil:'networkidle'});
      assert.equal(await page.locator('h1').count(),1);
      assert.equal(await page.locator('.cookie-banner').isVisible(),false);
      const initial=await page.evaluate(()=>({width:innerWidth,container:document.querySelector('.hero-grid').clientWidth,visual:document.querySelector('.studio-scene').clientWidth,heading:parseFloat(getComputedStyle(document.querySelector('h1')).fontSize)}));
      if(width<=980)assert.equal(await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>/vendor\/|experience\/motion/.test(r.name)).length),0,'Mobile should not download animation libraries');
      if(width>=1920){assert.ok(initial.container>width*.78);assert.ok(initial.visual>width*.4);}
      assert.equal(await page.locator('.hero .website-device').count(),3);
      assert.equal(await page.locator('#ablauf .step').count(),6);
      assert.match(await page.locator('h1').innerText(),/Websites/);
      assert.equal(await page.locator('.hero-actions .btn-ghost').getAttribute('href'),'#referenzen');
      assert.equal(await page.locator('.window-editor,.window-terminal,.window-server').count(),0);
      metrics.push(initial);
      for(const selector of sections){
        await position(page,selector);
        await layout(page,`${width} ${selector}`);
        assert.equal(await page.locator(selector).evaluate(e=>getComputedStyle(e).visibility),'visible');
        if([390,1920,2560,3440].includes(width))await page.screenshot({path:path.join(output,`after-${width}-${selector.replace(/[.#]/g,'')}.png`)});
      }
      // All illustrations remain within the viewport when their chapter is active.
      if(width>980){
        for(const index of [0,1,2,3,4,5,2,0]){
          await position(page,`[data-service-step="${index}"]`,true);
          assert.equal(await page.locator('.service-story').getAttribute('data-active-service'),String(index));
          const panel=await page.locator(`[data-service-panel="${index}"]`).boundingBox();
          assert.ok(panel.y>=70&&panel.y+panel.height<=height-10,`${width} service ${index} clipped: ${JSON.stringify(panel)}`);
          assert.ok(await page.locator(`[data-service-panel="${index}"]`).evaluate(e=>Number(getComputedStyle(e).opacity)>.95));
          if([1920,3440].includes(width)&&index===2)await page.screenshot({path:path.join(output,`after-${width}-sticky-editor.png`)});
        }
        await position(page,'.hero');
        const before=await page.locator('.website-scene .device-desktop').evaluate(e=>getComputedStyle(e).transform);
        await page.evaluate(()=>scrollTo({top:450,behavior:'instant'}));await page.waitForTimeout(750);
        assert.notEqual(await page.locator('.website-scene .device-desktop').evaluate(e=>getComputedStyle(e).transform),before);
      }else{
        assert.equal(await page.locator('.service-stage').isVisible(),false);
        assert.equal(await page.locator('.service-inline:visible').count(),6);
        await page.locator('.nav-toggle').click();assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'),'true');
        await page.locator('#navMenu a[href="#faq"]').click();assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'),'false');
      }
      await position(page,'#faq');
      await page.locator('#faq1-btn').click();assert.ok(await page.locator('#faq1').isVisible());
      await page.locator('#name').fill('Design Test');
      await page.locator('#langToggle').click();await page.waitForFunction(()=>document.documentElement.lang==='en');
      assert.equal(await page.locator('.studio-title-accent').textContent(),'that make you visible.');
      assert.equal(await page.locator('.hero-actions .btn-ghost').innerText(),'View projects');
      assert.match(await page.locator('.subheadline').innerText(),/websites/);
      await page.locator('#langToggle').click();await page.waitForFunction(()=>document.documentElement.lang==='de');
      assert.equal(await page.locator('.studio-title-accent').textContent(),'die dich sichtbar machen.');
      assert.equal(await page.locator('.hero-actions .btn-ghost').innerText(),'Referenzen ansehen');
      assert.equal(await page.locator('#name').inputValue(),'Design Test','Language switch must preserve input');
      await position(page,'#faq');
      await page.locator('#faq1-btn').click();assert.equal(await page.locator('#faq1').isVisible(),false,'FAQ still bound after language switch');
      await page.locator('#faq2-btn').focus();await page.keyboard.press('Enter');assert.ok(await page.locator('#faq2').isVisible());
      await page.locator('#themeToggle').click();await layout(page,`${width} light`);
      if(width===1920){await position(page,'.hero');await page.screenshot({path:path.join(output,'after-light-hero.png')});}
      await page.locator('#themeToggle').click();
      await page.locator('#name').fill('');await page.locator('#contactForm button[type="submit"]').click();
      assert.ok((await page.locator('#err-name').textContent()).length>0,'Form validation still works');
      // Do not send test messages to the real Formspree endpoint.
      console.log(`Home ${width}×${height}: all sections, scene states, language, FAQ, form, theme and navigation passed.`);
    }
    for(const file of documents){
      for(const width of [390,1920,2560,3440]){
        await page.setViewportSize({width,height:width>=2560?1440:width===390?844:1080});
        await page.goto(`${origin}/${file}`,{waitUntil:'networkidle'});
        assert.equal(await page.locator('h1').count(),1,file);
        if(width>=1920&&await page.locator('.legal-layout').count())assert.ok(await page.locator('.legal-layout').evaluate(e=>e.clientWidth)>=1600,`${file}: legal layout still capped by a parent container`);
        const height=await page.evaluate(()=>document.documentElement.scrollHeight);
        for(let y=0;y<height;y+=800){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(40);await layout(page,`${file} ${width} at ${y}`);}
        await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(450);
        if(width===3440||width===390)await page.screenshot({path:path.join(output,`after-${width}-${file.replaceAll('/','-')}.png`)});
      }
      console.log(`Document ${file}: mobile and three large desktop widths passed.`);
    }
    for(const mode of ['reduced','nojs','missing-gsap']){
      const fallback=await browser.newContext({viewport:{width:1920,height:1080},reducedMotion:mode==='reduced'?'reduce':'no-preference',javaScriptEnabled:mode!=='nojs'});
      await fallback.addInitScript(()=>sessionStorage.setItem('site_notice_shown','true'));
      if(mode==='missing-gsap')await fallback.route('**/vendor/*.js',r=>r.fulfill({status:200,contentType:'text/javascript',body:''}));
      const p=await fallback.newPage();await p.goto(origin,{waitUntil:'networkidle'});
      assert.equal(await p.locator('.service-stage').isVisible(),false,mode);
      assert.equal(await p.locator('.service-inline:visible').count(),6,mode);
      for(const selector of sections){await position(p,selector);await layout(p,mode+selector);}
      await fallback.close();
    }
    // Reconfiguration also cleans up, rather than keeping hidden desktop timelines alive.
    await page.setViewportSize({width:1920,height:1080});await page.goto(origin,{waitUntil:'networkidle'});
    assert.ok(await page.locator('body').evaluate(e=>e.classList.contains('home-motion')));
    await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(350);
    assert.equal(await page.locator('.service-stage').isVisible(),false);
    await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(500);
    assert.equal(await page.locator('.service-stage').isVisible(),true);
    await position(page,'[data-service-step="3"]',true);assert.equal(await page.locator('.service-story').getAttribute('data-active-service'),'3');
    fs.writeFileSync(path.join(output,'metrics.json'),JSON.stringify(metrics,null,2));
    assert.deepEqual(errors,[],`Console/page errors: ${JSON.stringify(errors)}`);
    console.log('Experience checks passed, including reduced motion, no-JS, missing GSAP and live preference changes.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
