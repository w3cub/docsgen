#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'widget', 'src');
const SRC_FILE = path.join(SRC_DIR, 'widgets.json');
// source/conf/widget-config.json
const OUT_FILE = path.join(ROOT, 'source', 'conf', 'widget-config.json');

function readJson(file){
  try{ return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch(e){ console.error('Failed to read/parse', file, e.message); process.exitCode = 1; throw e; }
}

function isIncludeString(v){
  return typeof v === 'string' && v.startsWith('file:');
}

function resolveIncludes(obj, baseDir){
  if (Array.isArray(obj)) return obj.map(v => resolveIncludes(v, baseDir));
  if (obj && typeof obj === 'object'){
    const res = {};
    for (const k of Object.keys(obj)) res[k] = resolveIncludes(obj[k], baseDir);
    return res;
  }
  if (isIncludeString(obj)){
    const rel = obj.slice(5);
    const p = path.join(baseDir, rel);
    try{ return fs.readFileSync(p, 'utf8'); }
    catch(e){ console.error('Failed to read include file', p, e.message); return ''; }
  }
  return obj;
}

function build(){
  console.log('[widget-builder] building', SRC_FILE, '→', OUT_FILE);
  const cfg = readJson(SRC_FILE);
  const resolved = resolveIncludes(cfg, SRC_DIR);
  const json = JSON.stringify(resolved, null, 2) + '\n';

  try{
    if (fs.existsSync(OUT_FILE)){
      const bak = OUT_FILE + '.bak';
      fs.copyFileSync(OUT_FILE, bak);
      console.log('[widget-builder] backup created:', bak);
    }
  }catch(e){ console.warn('[widget-builder] backup failed', e.message); }

  fs.writeFileSync(OUT_FILE, json, 'utf8');
  console.log('[widget-builder] wrote', OUT_FILE);
}

if (require.main === module){
  const args = process.argv.slice(2);
  const watch = args.indexOf('--watch') !== -1;
  build();
  if (watch){
    console.log('[widget-builder] watching', SRC_DIR);
    try{
      fs.watch(SRC_DIR, { recursive: true }, function(){
        // debounce simple
        if (global.__wb_timer) clearTimeout(global.__wb_timer);
        global.__wb_timer = setTimeout(build, 150);
      });
    }catch(e){ console.error('[widget-builder] watch unsupported on this platform', e.message); }
  }
}
