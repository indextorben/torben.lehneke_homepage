// Regression for actual input delivery. scrollTo() alone cannot prove native scrolling.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const origin=process.env.PORTFOLIO_TEST_URL||'http://localhost:3000';
const routes=['/','/apps/beework/index.html','/apps/beefocus/index.html','/apps/cmdfind/index.html'];
const y=p=>p.evaluate(()=>scrollY);
const pause=p=>p.waitForTimeout(450);
// "Zum Dokumentanfang" ist plattformabhaengig: Ctrl+Home gilt unter Windows/Linux,
// macOS verwendet Cmd+Pfeil-oben. Ein festes Ctrl+Home laesst die Pruefung auf macOS
// scheitern, obwohl die Tastatureingabe der Seite funktioniert.
const TOP_KEY=process.platform==='darwin'?'Meta+ArrowUp':'Control+Home';
(async()=>{
  const browser=await chromium.launch({channel:process.env.TEST_BROWSER_CHANNEL||'chrome',ignoreDefaultArgs:['--hide-scrollbars']});
  const watchdog=setTimeout(()=>{console.error('Native-scroll suite exceeded its time limit');void browser.close();},240000);
  try{
    const context=await browser.newContext({viewport:{width:1920,height:1080}});
    await context.addInitScript(()=>sessionStorage.setItem('site_notice_shown','true'));
    const page=await context.newPage();
    for(const route of routes){
      await page.goto(origin+route,{waitUntil:'networkidle'});
      await page.mouse.move(1100,650);
      const start=await y(page);await page.mouse.wheel(0,650);await pause(page);
      assert.ok(await y(page)>start+250,`${route} wheel blocked`);
      const wheel=await y(page);
      // Small, continuous wheel deltas model trackpad input without dispatchEvent mocks.
      for(let i=0;i<12;i++){await page.mouse.wheel(0,24);await page.waitForTimeout(16);}await pause(page);
      assert.ok(await y(page)>wheel+100,`${route} trackpad deltas blocked`);
      await page.locator('body').click({position:{x:10,y:400}});
      const keyboard=await y(page);await page.keyboard.press('PageDown');await pause(page);
      assert.ok(await y(page)>keyboard+200,`${route} PageDown blocked`);
      await page.keyboard.press('PageUp');await pause(page);assert.ok(await y(page)<keyboard+150,`${route} PageUp blocked`);
      await page.keyboard.press(TOP_KEY);await pause(page);
      // Drag the real classic scrollbar thumb (Chromium headless also exposes its gutter).
      const root=await page.evaluate(()=>({viewport:innerHeight,height:document.scrollingElement.scrollHeight,width:innerWidth}));
      const thumb=Math.max(20,root.viewport*root.viewport/root.height);
      await page.mouse.move(root.width-7,thumb/2);await page.mouse.down();await page.mouse.move(root.width-7,400,{steps:12});await page.mouse.up();await pause(page);
      assert.ok(await y(page)>500,`${route} scrollbar drag blocked`);
      console.log(`${route}: wheel, trackpad-like input, PageUp/Down and scrollbar drag passed.`);
    }
    console.log('Checking search close and back navigation.');
    await page.goto(origin,{waitUntil:'networkidle'});
    await page.locator('.search-btn').click();await page.keyboard.press('Escape');await page.waitForTimeout(500);
    await page.mouse.move(1100,650);await page.mouse.wheel(0,600);await pause(page);assert.ok(await y(page)>200,'Search left scroll locked');
    await page.goto(origin+routes[1]);await page.goBack({waitUntil:'networkidle'});
    const restored=await y(page);await page.mouse.wheel(0,600);await pause(page);assert.ok(await y(page)>restored+200,'Back navigation locked');
    console.log('Search close and back navigation passed.');
    // Traverse every section using native wheel input, including sticky boundaries.
    for(const width of [1920,2560,3440]){
      await page.setViewportSize({width,height:width===1920?1080:1440});
      for(const route of routes){
        console.log(`Traversing ${width} ${route}`);
        await page.goto(origin+route,{waitUntil:'networkidle'});
        await page.mouse.move(width*.65,500);
        let reached=false;
        for(let step=0;step<100;step++){
          const state=await page.evaluate(()=>({y:scrollY,max:document.scrollingElement.scrollHeight-innerHeight,overflow:document.documentElement.scrollWidth>innerWidth+1}));
          assert.equal(state.overflow,false,`${width} ${route}: horizontal overflow`);
          if(state.y>=state.max-3){reached=true;break;}
          await page.mouse.wheel(0,650);
          // Chromium delivers wheel scrolling asynchronously, especially while decoding galleries.
          try{await page.waitForFunction(previous=>scrollY>previous,state.y,{timeout:2000});}
          catch(error){console.error({width,route,step,state,current:await page.evaluate(()=>({y:scrollY,max:document.scrollingElement.scrollHeight-innerHeight,hit:document.elementFromPoint(innerWidth*.65,500)?.outerHTML.slice(0,150)}))});throw error;}
          await page.waitForTimeout(100);
        }
        assert.ok(reached,`${width} ${route}: footer not reached`);
        await page.keyboard.press(TOP_KEY);await pause(page);
        assert.ok(await y(page)<5,`${width} ${route}: cannot return to top`);
        console.log(`${width} ${route}: native wheel traversal to footer and keyboard return passed.`);
        if(route!=='/' && width===1920){
          await page.goto(origin,{waitUntil:'networkidle'});
          await page.goBack({waitUntil:'networkidle'});
          await page.mouse.move(width*.65,500);
          const previous=await y(page);await page.mouse.wheel(0,400);await pause(page);
          assert.ok(await y(page)>previous+200,`${route}: Back restored a blocked viewport`);
        }
      }
    }
    const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    await mobile.addInitScript(()=>sessionStorage.setItem('site_notice_shown','true'));
    const phone=await mobile.newPage();const cdp=await mobile.newCDPSession(phone);
    for(const route of routes){
      await phone.goto(origin+route,{waitUntil:'networkidle'});
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:190,y:650}]});
      for(const y of [610,550,490,420,340,260,190]){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:190,y}]});await phone.waitForTimeout(30);}
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(phone);
      assert.ok(await y(phone)>200,`${route} touch scrolling blocked`);
      await phone.locator('.nav-toggle').click();await phone.locator('.nav-toggle').click();
      assert.notEqual(await phone.evaluate(()=>getComputedStyle(document.body).overflowY),'hidden');
      console.log(`${route}: real touch input and menu cleanup passed.`);
    }
  }finally{clearTimeout(watchdog);await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
