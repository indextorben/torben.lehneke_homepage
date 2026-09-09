// Local diagnostic, not a Lighthouse score or a claim about production hardware.
const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
  const browser=await chromium.launch();const results=[];
  try{
    for(const width of [390,1920,3440]){
      const context=await browser.newContext({viewport:{width,height:width===390?844:width===1920?1080:1440}});
      await context.addInitScript(()=>{
        sessionStorage.setItem('site_notice_shown','true');
        window.__designVitals={cls:0,lcp:0};
        new PerformanceObserver(list=>list.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__designVitals.cls+=e.value;})).observe({type:'layout-shift',buffered:true});
        new PerformanceObserver(list=>list.getEntries().forEach(e=>{window.__designVitals.lcp=e.startTime;})).observe({type:'largest-contentful-paint',buffered:true});
      });
      const page=await context.newPage();
      const cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');
      await page.goto(process.env.PORTFOLIO_TEST_URL||'http://localhost:3000',{waitUntil:'networkidle'});
      await page.waitForTimeout(1000);
      const before=await cdp.send('Performance.getMetrics');
      await page.waitForTimeout(1500);
      const after=await cdp.send('Performance.getMetrics');
      const metric=(data,name)=>data.metrics.find(x=>x.name===name)?.value||0;
      const vitals=await page.evaluate(()=>({...window.__designVitals,canvas:document.querySelectorAll('canvas').length,animationAssets:performance.getEntriesByType('resource').filter(r=>/vendor\/|experience\/motion/.test(r.name)).map(r=>r.name.split('/').pop())}));
      results.push({width,...vitals,idleTaskMilliseconds:Math.round((metric(after,'TaskDuration')-metric(before,'TaskDuration'))*1000),jsHeapMB:Math.round(metric(after,'JSHeapUsedSize')/1048576)});
      await context.close();
    }
    fs.mkdirSync(path.join(__dirname,'../tmp/home-review'),{recursive:true});
    fs.writeFileSync(path.join(__dirname,'../tmp/home-review/performance.json'),JSON.stringify(results,null,2));
    console.log(JSON.stringify(results,null,2));
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
