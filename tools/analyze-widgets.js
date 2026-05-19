#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SRC = path.join(process.cwd(), 'widget', 'src', 'widgets.json');
function readJson(p){
  try{ return JSON.parse(fs.readFileSync(p,'utf8')); }
  catch(e){ console.error('read failed', e.message); process.exit(1); }
}

const cfg = readJson(SRC);
const widgets = Array.isArray(cfg.widgets) ? cfg.widgets : [];

const tagMap = new Map();
widgets.forEach(w => {
  const tags = Array.isArray(w.tags) && w.tags.length ? w.tags : ['untagged'];
  tags.forEach(t => {
    if (!tagMap.has(t)) tagMap.set(t, []);
    tagMap.get(t).push(w.id || (w.content||'unnamed'));
  });
});

console.log('\nWidget tags summary:\n');
[...tagMap.entries()].sort().forEach(([tag, list]) => {
  console.log(tag + ': (' + list.length + ')');
  list.forEach(id => console.log('  - ' + id));
  console.log('');
});

console.log('Total widgets:', widgets.length, '\n');
