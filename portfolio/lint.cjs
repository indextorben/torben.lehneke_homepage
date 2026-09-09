// Dependency-free syntax and project-integrity checks for this static site.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
function scripts(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith('.') || ['node_modules', 'tmp'].includes(entry.name)) return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? scripts(file) : /\.(c?js)$/.test(file) ? [file] : [];
  });
}
for (const file of scripts(root)) execFileSync(process.execPath, ['--check', file]);
const projects = require('./projects.cjs');
const {normalizeProject}=require('./project-model.cjs');
assert.equal(new Set(projects.map(p => p.id)).size, projects.length, 'Project IDs must be unique');
const icons=projects.map(p=>p.icon).filter(Boolean);
assert.equal(new Set(icons).size, icons.length, 'Each project needs its own icon');
for (const p of projects) {
  normalizeProject(p);
  assert.match(p.accentColor, /^#[0-9a-f]{6}$/i);
  for (const asset of [p.icon, p.heroImage].filter(Boolean)) assert.ok(fs.existsSync(path.join(root, asset)), `Missing ${asset}`);
  for (const key of (p.type==='website'?['description']:['category', 'status', 'title', 'description', 'about', 'challenge', 'solution', 'outcome', 'visualAlt'])) {
    assert.ok(p[key].de && p[key].en, `${p.id}.${key} needs German and English copy`);
  }
  if(!p.detailPath)continue;
  const html = fs.readFileSync(path.join(root, p.detailPath), 'utf8');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${p.id}: exactly one h1`);
  if(p.type!=='website')assert.ok(!/class="brand-mark/.test(html), `${p.id}: generic brand mark remains`);
  for (const match of html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
    const target = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|\/)/.test(target)) continue;
    assert.ok(fs.existsSync(path.resolve(root, path.dirname(p.detailPath), decodeURIComponent(target))), `${p.id}: missing local resource ${target}`);
  }
}
console.log('JavaScript syntax, project metadata, local links and assets passed.');
