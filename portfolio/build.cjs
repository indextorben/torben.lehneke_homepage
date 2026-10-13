/* Deterministic static rendering: node portfolio/build.cjs [--check].
 * Generated blocks are marked; all existing content outside them is preserved.
 * No bundler, client framework or runtime data fetch is required.
 */
const fs = require('node:fs');
const path = require('node:path');
const projects = require('./projects.cjs');
const {normalizeProject} = require('./project-model.cjs');
const showcase = require('./showcase-components.cjs');
const root = path.resolve(__dirname, '..');
const check = process.argv.includes('--check');
// Serve the existing GSAP version locally; a CDN outage must not hide content.
const vendor = path.join(root, 'portfolio', 'vendor');
if (!check) {
  fs.mkdirSync(vendor, { recursive: true });
  for (const name of ['gsap.min.js', 'ScrollTrigger.min.js']) {
    fs.copyFileSync(require.resolve(`gsap/dist/${name}`), path.join(vendor, name));
  }
}
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const local = (value, tag = 'span', cls = '') => `<${tag}${cls ? ` class="${cls}"` : ''} data-portfolio-de="${esc(value.de)}" data-portfolio-en="${esc(value.en)}">${esc(value.de)}</${tag}>`;
const t = (de, en) => ({ de, en });
const block = (name, html) => `<!-- portfolio:${name}:start -->\n${html}\n<!-- portfolio:${name}:end -->`;
const replaceBlock = (html, name, content) => html.replace(new RegExp(`<!-- portfolio:${name}:start -->[\\s\\S]*?<!-- portfolio:${name}:end -->`), block(name, content));
const icon = (p, prefix) => p.icon ? `<span class="portfolio-icon${p.iconCrop ? ' portfolio-icon-crop' : ''}" aria-hidden="true"><img src="${prefix}${p.icon}" width="64" height="64" alt="" /></span>` : '';
const tags = p => `<ul class="portfolio-tags" aria-label="Plattformen">${p.tags.map(tag => `<li>${esc(tag)}</li>`).join('')}</ul>`;
const picture = (p, prefix, lazy = false) => `<img class="portfolio-image" src="${prefix}${p.heroImage}" width="1536" height="1024" alt="${esc(p.visualAlt.de)}" data-portfolio-alt-de="${esc(p.visualAlt.de)}" data-portfolio-alt-en="${esc(p.visualAlt.en)}" ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async" />`;
function save(file, html) {
  const current = fs.readFileSync(path.join(root, file), 'utf8');
  if (current === html) return;
  if (check) throw new Error(`${file} needs regeneration: node portfolio/build.cjs`);
  fs.writeFileSync(path.join(root, file), html);
  console.log(`Rendered ${file}`);
}
function wire(html, prefix) {
  html = html.replace(/(src="(?:\.\.\/\.\.\/)?script\.js)\?v=\d+/g, '$1?v=14');
  html = html.replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/gsap@[^/]+\/dist\//g, `${prefix}portfolio/vendor/`);
  if (!html.includes('portfolio/portfolio.css')) html = html.replace('</head>', `  <link rel="stylesheet" href="${prefix}portfolio/portfolio.css?v=1" />\n</head>`);
  if (!html.includes('portfolio/portfolio.js')) html = html.replace('</body>', `  <script src="${prefix}portfolio/portfolio.js?v=1" defer></script>\n</body>`);
  html = html.replace(/portfolio\/portfolio\.(css|js)\?v=\d+/g, 'portfolio/portfolio.$1?v=2');
  return html;
}
// Find a complete nested div, rather than truncating it at the first closing tag.
function divAt(html, index) {
  const tokens = /<div\b[^>]*>|<\/div\s*>/g;
  tokens.lastIndex = index;
  let depth = 0;
  for (let match; (match = tokens.exec(html));) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (!depth) return html.slice(index, tokens.lastIndex);
  }
  throw new Error('Unbalanced div');
}
const featured = projects.filter(p => p.featured).map(normalizeProject).sort((a,b)=>Number(b.type==='website')-Number(a.type==='website'));
const overview = `<div class="container">
  <div class="portfolio-heading">
    <div>${local(t('06 / REFERENZEN & EIGENE PROJEKTE', '06 / REFERENCES & OWN PROJECTS'), 'p', 'portfolio-kicker')}<h2>${local(t('Referenzen', 'References'))}<span class="portfolio-heading-dot">.</span></h2></div>
    ${local(t('Neben Kundenwebsites entwickle ich eigene Apps und Tools. Diese Projekte zeigen meine technische Arbeit – mein Hauptangebot bleibt deine Website.', 'Alongside client websites I develop my own apps and tools. These projects showcase my technical work — my main service remains your website.'), 'p', 'portfolio-heading-copy')}
  </div>
  <div class="portfolio-grid" aria-label="Projektübersicht">
  ${featured.map((p, i) => `<a class="work-card" data-project-type="${p.type}" href="${esc(p.href)}" style="--project-accent:${p.accentColor}" aria-label="${esc(p.name)} – Projekt ansehen">
    <div class="work-art">${picture(p, '', true)}<span class="work-index">0${i + 1} / ${esc(p.name)}</span>${local(p.visualCredit, 'span', 'work-art-caption')}</div>
    <div class="work-copy"><div class="work-identity">${icon(p, '')}<div>${local(p.category, 'p', 'portfolio-kicker')}<h3>${p.name}</h3></div><span class="work-arrow" aria-hidden="true">↗</span></div>
      ${local(p.title, 'p', 'work-title')}${local(p.description, 'p', 'work-description')}
      ${tags(p)}<div class="work-bottom">${local(p.status, 'span', 'work-status')}${local(t('Projekt ansehen', 'View project'), 'span', 'work-cta')}</div>
    </div></a>`).join('\n')}
  </div>
</div>`;
let home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (home.includes('portfolio:overview:start')) home = replaceBlock(home, 'overview', overview);
else home = home.replace(/(<section\b[^>]*id="referenzen"[^>]*>)[\s\S]*?(<\/section>)/, `$1\n${block('overview', overview)}\n$2`);
save('index.html', wire(home, ''));
for (const p of projects) {
  if(p.type==='website')continue; // Customer case studies keep their own layout and route.
  const file = p.detailPath;
  let html = fs.readFileSync(path.join(root, file), 'utf8');
  const showcaseContent = showcase.render(p);
  if (showcaseContent) html = html.replace(/\s*<!-- portfolio:showcase:start -->[\s\S]*?<!-- portfolio:showcase:end -->\s*/, '\n');
  if (!html.includes('data-portfolio-project=')) html = html.replace(/<body\b/, `<body data-portfolio-project="${p.id}" style="--project-accent:${p.accentColor}"`);
  else html = html.replace(/(<body\b[^>]*style=")[^"]*/, `$1--project-accent:${p.accentColor}`);
  // Both header and footer use the same canonical icon.
  html = html.replace(/<(span|img)\b[^>]*class="brand-mark[^\"]*"[^>]*>(?:[^<]*<\/span>)?/g, block('icon', icon(p, '../../')));
  html = html.replace(/<!-- portfolio:icon:start -->[\s\S]*?<!-- portfolio:icon:end -->/g, block('icon', icon(p, '../../')));
  const identity = `<a class="portfolio-back" href="../../index.html#referenzen">${local(t('← Alle Projekte', '← All projects'))}</a><div class="case-identity">${icon(p, '../../')}<div><p class="case-project-name">${p.name}</p>${local(p.category, 'p', 'portfolio-kicker')}</div></div>${tags(p)}`;
  if (html.includes('portfolio:identity:start')) html = replaceBlock(html, 'identity', identity);
  else html = html.replace(/(<div class="hero-copy[^\"]*">)/, `$1\n${block('identity', identity)}\n`);
  const visual = `<div class="hero-visual portfolio-hero-visual"><figure class="case-art">${picture(p, '../../')}<figcaption>${local(t('Produktvisualisierung · KI-generiert', 'Product visualisation · AI-generated'))}</figcaption></figure></div>`;
  const story = `<section class="section case-study" id="projekt" aria-label="Case Study"><div class="container">
    <div class="case-facts"><div>${local(t('Projekt', 'Project'), 'span', 'portfolio-kicker')}<strong>${p.name}</strong></div><div>${local(t('Status', 'Status'), 'span', 'portfolio-kicker')}${local(p.status, 'strong')}</div><div>${local(t('Schwerpunkte', 'Focus'), 'span', 'portfolio-kicker')}<strong>${p.tags.join(' · ')}</strong></div></div>
    <div class="case-story"><div class="case-intro">${local(t('Über das Projekt', 'About the project'), 'p', 'portfolio-kicker')}${local(p.title, 'h2')}${local(p.about, 'p')}<ul class="case-highlights">${p.highlights.map(v => local(v, 'li')).join('')}</ul></div>
      <div class="case-chapters"><article><span class="chapter-number">01</span><div>${local(t('Die Herausforderung', 'The challenge'), 'h3')}${local(p.challenge, 'p')}</div></article><article><span class="chapter-number">02</span><div>${local(t('Der Lösungsansatz', 'The approach'), 'h3')}${local(p.solution, 'p')}</div></article><article><span class="chapter-number">03</span><div>${local(t('Ergebnis & Projektstand', 'Outcome & project status'), 'h3')}${local(p.outcome, 'p')}</div></article></div>
    </div><div class="case-tech">${local(t('Plattformen & Integrationen', 'Platforms & integrations'), 'h3')}<ul class="portfolio-tags">${p.technologies.map(v => `<li>${esc(v)}</li>`).join('')}</ul></div>
  </div></section>`;
  if (html.includes('portfolio:visual:start')) {
    html = replaceBlock(html, 'visual', visual);
    html = replaceBlock(html, 'story', story);
  } else {
    const start = html.indexOf('<div class="hero-visual');
    if (start < 0) throw new Error(`Missing hero visual: ${file}`);
    const originalVisual = divAt(html, start).replace('aria-hidden="true"', '');
    html = html.slice(0, start) + block('visual', visual) + html.slice(start + divAt(html, start).length);
    const heroEnd = html.indexOf('</section>', start) + '</section>'.length;
    // Original screenshots, explanatory terminal and product annotations stay available.
    const gallery = `<section class="section case-existing"><div class="container">${local(t('Einblicke ins Produkt', 'Inside the product'), 'h2')}${originalVisual}</div></section>`;
    html = html.slice(0, heroEnd) + '\n' + block('story', story) + '\n' + gallery + html.slice(heroEnd);
  }
  const end = `<section class="section case-end"><div class="container"><div>${local(t('Weiter entdecken', 'Keep exploring'), 'p', 'portfolio-kicker')}${local(t('Gute Werkzeuge machen den Unterschied.', 'Good tools make a difference.'), 'h2')}</div><div class="hero-actions"><a class="btn btn-primary" href="${p.cta.href}">${local(p.cta.label)}</a><a class="btn btn-ghost" href="../../index.html#referenzen">${local(t('Alle Projekte', 'All projects'))}</a></div></div></section>`;
  if (html.includes('portfolio:end:start')) html = replaceBlock(html, 'end', end);
  else html = html.replace('</main>', `${block('end', end)}\n</main>`);
  if (showcaseContent) {
    html = html.replace(/href="#overview"/g, 'href="#showcase-top"');
    if (!html.includes('data-showcase=')) html = html.replace('<body ', `<body data-showcase="${showcase.scenes[p.id].theme}" `);
    // Retain the previous introduction without repeating a second hero in the story.
    if (!html.includes('class="project-context-wrap"')) {
      html = html.replace(/<section class="hero\b[\s\S]*?<\/section>/, old => `<details class="project-context-wrap"><summary>${local(t('Projektbeschreibung & ursprüngliches Produktvisual', 'Project description & original product visual'))}</summary>${old.replace('class="hero ', 'class="project-context ').replace(/<h1\b/g, '<h2').replace(/<\/h1>/g, '</h2')}</details>`);
    }
    if (!html.includes('class="project-visual-archive"')) html = html.replace(/<section class="section case-existing"[\s\S]*?<\/section>/, old => `<details class="project-visual-archive"><summary>${local(t('Weitere Produktansichten', 'More product views'))}</summary>${old}</details>`);
    html = html.replace(/(<main\b[^>]*>)\s*/, `$1\n${block('showcase', showcaseContent)}\n`);
    // The hero is lightweight DOM/CSS. Defer retained raster galleries, including
    // original hero images now located in disclosure sections.
    html = html.replace(/(<main\b[^>]*>)([\s\S]*?)(<\/main>)/, (_match, open, content, close) => open + content.replace(/<img\b[^>]*>/g, image => {
      if (/width="64"/.test(image)) return image;
      image = image.replace(/\s+fetchpriority="high"/g, '').replace(/[ \t]+(?=\r?\n)/g, '');
      return /\bloading=/.test(image) ? image : image.replace(/\s*\/?>$/, ' loading="lazy" />');
    }) + close);
    if (!html.includes('portfolio/showcase.css')) html = html.replace('</head>', '  <link rel="stylesheet" href="../../portfolio/showcase.css?v=1" />\n</head>');
    if (!html.includes('portfolio/showcase.js')) html = html.replace('</body>', '  <script type="module" src="../../portfolio/showcase.js?v=1"></script>\n</body>');
  }
  save(file, wire(html, '../../'));
}
console.log(check ? 'Portfolio static output is current.' : 'Portfolio rendered.');
