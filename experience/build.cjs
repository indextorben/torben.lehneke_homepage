// Static customer-website rendering. Legal copy, contact form and real reviews are preserved.
const fs=require('node:fs'),path=require('node:path');
const {local}=require('./components.cjs');
const website=require('./content.cjs');
const root=path.resolve(__dirname,'..');
const block=(name,content)=>'<!-- experience:'+name+':start -->'+content+'<!-- experience:'+name+':end -->';
function generated(html,name,content,insert){
  const pattern=new RegExp('<!-- experience:'+name+':start -->[\\s\\S]*?<!-- experience:'+name+':end -->');
  return pattern.test(html)?html.replace(pattern,()=>block(name,content)):insert(html,block(name,content));
}
function section(html,id,edit){
  return html.replace(new RegExp('(<section[^>]*id="'+id+'"[^>]*>)([\\s\\S]*?)(</section>)'),(_,a,b,c)=>a+edit(b)+c);
}
function heading(html,id,kicker,de,en){
  return section(html,id,s=>s.replace(/(?:<p class="studio-kicker"[^>]*>[\s\S]*?<\/p>)?\s*<h2\b[^>]*>[\s\S]*?<\/h2>/,()=>local(kicker,kicker,'p','studio-kicker')+local(de,en,'h2')));
}
function home(html){
  html=html.replace(/\r\n/g,'\n');
  html=html.replace(/\s*<script src="portfolio\/vendor\/(?:gsap|ScrollTrigger)\.min\.js" defer><\/script>/g,'');
  if(!html.includes('data-experience="home"'))html=html.replace('<body ','<body data-experience="home" ');
  html=html.replace(/(<section class="hero section"[^>]*>)[\s\S]*?(<\/section>)/,(_,a,b)=>a+website.hero()+b);
  html=generated(html,'hero-baseline','<div class="container studio-baseline"><span>TORBEN LEHNEKE / NEUBRANDENBURG</span><a href="#leistungen">'+local('Deine Website beginnt hier','Your website starts here')+' ↓</a><span>WEBDESIGN / ENTWICKLUNG / BETREUUNG</span></div>',(s,b)=>s.replace('    <!-- Leistungen -->',b+'\n    <!-- Leistungen -->'));
  html=generated(html,'why',website.why(),(s,b)=>s.replace('    <!-- Leistungen -->',b+'\n    <!-- Leistungen -->'));
  html=section(html,'leistungen',()=>website.serviceContent());
  html=generated(html,'responsive',website.responsive(),(s,b)=>s.replace(/(<section[^>]*id="ueberuns")/,b+'\n$1'));
  html=section(html,'ueberuns',()=>website.about());
  html=section(html,'ablauf',()=>website.process());
  html=heading(html,'bewertungen','07 / BEEFOCUS FEEDBACK','Feedback zu meinen eigenen Apps.','Feedback on my own apps.');
  html=section(html,'bewertungen',s=>s.replace(/<p class="lead"[^>]*>[\s\S]*?<\/p>/,()=>local('Diese Stimmen beziehen sich auf BeeFocus. Sie geben Einblick in die Nutzung meiner eigenen App – nicht in beauftragte Website-Projekte.','These reviews are about BeeFocus. They offer insight into my own app, not commissioned website projects.','p','lead')));
  html=heading(html,'zertifizierungen','08 / CISCO NETWORKING ACADEMY','Technisches Wissen. Saubere Grundlage.','Technical knowledge. A solid foundation.');
  html=section(html,'zertifizierungen',s=>s.replace(/<p class="lead"[^>]*>[\s\S]*?<\/p>/,()=>local('CCNA: Introduction to Networks – ein abgeschlossener Kurs der Cisco Networking Academy. Technisches Grundlagenwissen ergänzt meine Arbeit an modernen Websites.','CCNA: Introduction to Networks — a completed Cisco Networking Academy course. Technical fundamentals complement my work on modern websites.','p','lead')));
  html=heading(html,'faq','09 / FAQ','Gute Fragen. Klare Antworten.','Good questions. Clear answers.');
  html=heading(html,'kontakt','10 / DEINE WEBSITE','Lass uns deine Website bauen.','Let’s build your website.');
  html=section(html,'kontakt',s=>s.replace(/<p class="lead"[^>]*>[\s\S]*?<\/p>/,()=>local('Was möchtest du online zeigen? Erzähl mir von deinem Vorhaben – ich melde mich mit den nächsten Schritten.','What would you like to present online? Tell me about your plans and I’ll get back to you with the next steps.','p','lead')));
  const certificate=html.match(/<section[^>]*id="zertifizierungen"[^>]*>[\s\S]*?<\/section>/)?.[0];
  if(certificate){html=html.replace(certificate,'');html=html.replace(/(<section[^>]*id="bewertungen"[^>]*>[\s\S]*?<\/section>)/,match=>match+certificate);}
  html=generated(html,'footer','<div class="container footer-wordmark" aria-hidden="true">Torben<span>Lehneke.</span></div><nav class="container footer-explore" aria-label="Weitere Bereiche"><a href="#leistungen">'+local('Leistungen','Services')+' ↗</a><a href="#referenzen">'+local('Referenzen','Projects')+' ↗</a><a href="#kontakt">'+local('Kontakt','Contact')+' ↗</a><a href="#newsletter">'+local('Newsletter','Newsletter')+' ↗</a><a href="#top">'+local('Nach oben','Back to top')+' ↑</a></nav>',(s,b)=>s.replace('<footer class="site-footer">','<footer class="site-footer">'+b));
  html=html.replace(/Schnelle IT-Lösungen für Ihr Unternehmen · IT in Neubrandenburg/g,'Professionelle Websites · Persönliche Betreuung · Neubrandenburg');
  const title='Torben Lehneke | Professionelle Websites & Webentwicklung';
  const description='Individuelle Websites für Unternehmen, Selbstständige, Vereine und Privatkunden. Webdesign, Entwicklung, Relaunch und Wartung aus Neubrandenburg.';
  html=html.replace(/<title>.*?<\/title>/,'<title>'+title+'</title>')
    .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*/g,'$1'+description)
    .replace(/(<meta (?:name|property)="(?:og:title|twitter:title)" content=")[^"]*/g,'$1'+title)
    .replace('"jobTitle": "IT-Freelancer"','"jobTitle": "Webentwickler"')
    .replace('IT-Freelancer in Neubrandenburg für App- und Webentwicklung. Beratung, Konzept, Umsetzung und Support.',description);
  for(const file of ['home.css','web.css'])if(!html.includes('experience/'+file))html=html.replace('</head>','<link rel="stylesheet" href="experience/'+file+'?v=2" />\n</head>');
  if(!html.includes('experience/home.js'))html=html.replace('</body>','<script type="module" src="experience/home.js?v=2"></script>\n</body>');
  if(!html.includes('data-experience-fallback'))html=html.replace('</head>','<noscript data-experience-fallback><style>#faq .acc-panel[hidden]{display:block}#faq .acc-icon{display:none}</style></noscript>\n</head>');
  return html;
}
function renderAll(check){
  const pages=['index.html','impressum.html','datenschutz.html','404.html','apps/beefocus/index.html','apps/beework/index.html','apps/cmdfind/index.html','apps/deskpilot/index.html','apps/ledger/index.html','apps/beefocus/datenschutz.html','apps/beefocus/nutzungsbedingungen.html','apps/beework/nutzungsbedingungen.html','apps/deskpilot/datenschutz.html','apps/deskpilot/agb.html'];
  for(const file of pages){
    const target=path.join(root,file),current=fs.readFileSync(target,'utf8'),prefix=file==='404.html'?'/':file.startsWith('apps/')?'../../':'';
    let html=file==='index.html'?home(current):current;
    if(!html.includes('experience/site.css'))html=html.replace('</head>','<link rel="stylesheet" href="'+prefix+'experience/site.css?v=1" />\n</head>');
    html=html.replace(/(src="(?:\.\.\/\.\.\/)?script\.js)(?:\?v=\d+)?/g,'$1?v=14')
      .replace(/style\.css\?v=\d+/g,'style.css?v=11')
      .replace(/experience\/((?:home|web)\.(?:css|js))\?v=\d+/g,'experience/$1?v=2')
      .replace(/portfolio\/showcase\.css\?v=\d+/g,'portfolio/showcase.css?v=3')
      .replace(/experience\/site\.css\?v=\d+/g,'experience/site.css?v=2');
    if(file==='404.html')html=html.replace('<body>','<body data-experience="error">');
    if(current!==html){if(check)throw new Error(file+': experience needs rebuilding');fs.writeFileSync(target,html);console.log('Experience: '+file);}
  }
}
module.exports={renderAll};
