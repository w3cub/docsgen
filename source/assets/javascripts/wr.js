/**
 * Widget Runtime System v3.0.0
 * 改进点：
 *  1. dependsOn 支持异步等待 + 超时
 *  2. 配置缓存改用 ETag / Last-Modified，真正避免重复下载
 *  3. inline-script 支持 async function
 *  4. SPA 路由区分 once / everyRoute
 *  5. 统一错误上报钩子 WR_ON_ERROR
 *  6. 支持运行时 enable/disable widget
 *  7. 完整 TypeScript-style JSDoc
 */

(async function WidgetRuntime() {
  'use strict';

  /* ─── 常量 ──────────────────────────────────────────── */
  const VERSION     = '3.0.0';
  const CONFIG_URL  = window.WR_CONFIG_URL  || '/conf/widget-config.json';
  const DEP_TIMEOUT = window.WR_DEP_TIMEOUT || 8000;   // 依赖等待超时 ms
  const CACHE_KEY   = '__wr_cfg_v3';
  const ETAG_KEY    = '__wr_etag_v3';
  const LOADED_KEY  = '__wr_loaded_v3';

  /** @type {Record<string, true>} 已完成注入的 widget id */
  window[LOADED_KEY] = window[LOADED_KEY] || {};

  /** @type {Record<string, Function[]>} 依赖等待回调队列 */
  const _waitQueue = {};

  /* ─── 错误上报 ───────────────────────────────────────── */
  function reportError(widgetId, err) {
    console.error('[WR]', widgetId, err);
    if (typeof window.WR_ON_ERROR === 'function') {
      try { window.WR_ON_ERROR({ widgetId, error: err, ts: Date.now() }); } catch (_) {}
    }
  }

  /* ─── 配置加载（ETag 缓存）───────────────────────────── */
  async function loadConfig() {
    const cached  = safeJSON(localStorage.getItem(CACHE_KEY));
    const etag    = localStorage.getItem(ETAG_KEY) || '';

    try {
      const headers = etag ? { 'If-None-Match': etag } : {};
      const res = await fetch(CONFIG_URL, { cache: 'no-cache', headers });

      // 服务端返回 304 → 直接用缓存
      if (res.status === 304 && cached) {
        console.log('[WR] config from cache (304)');
        return cached;
      }

      if (!res.ok) throw new Error('HTTP ' + res.status);

      const data    = await res.json();
      const newEtag = res.headers.get('ETag') || res.headers.get('Last-Modified') || '';

      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      if (newEtag) localStorage.setItem(ETAG_KEY, newEtag);

      return data;

    } catch (e) {
      console.warn('[WR] fetch failed, using cache:', e.message);
      return cached || { widgets: [] };
    }
  }

  function safeJSON(str) {
    try { return str ? JSON.parse(str) : null; } catch { return null; }
  }

  /* ─── 规则匹配 ───────────────────────────────────────── */
  function matchRule(rule = {}) {
    const path = location.pathname;

    if (rule.path) {
      const hit = rule.path.some(p =>
        p === '*' ||
        p === path ||
        (p.endsWith('*') && path.startsWith(p.slice(0, -1)))
      );
      if (!hit) return false;
    }

    if (rule.device) {
      const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
      const d = isMobile ? 'mobile' : 'desktop';
      if (!rule.device.includes(d)) return false;
    }

    if (rule.timeRange) {
      const h = new Date().getHours();
      if (h < rule.timeRange[0] || h >= rule.timeRange[1]) return false;
    }

    if (rule.experiment) {
      const key    = 'wr_exp_' + rule.experiment.key;
      const stored = localStorage.getItem(key);
      const bucket = stored !== null ? +stored : Math.random();
      localStorage.setItem(key, String(bucket));
      if (bucket > (rule.experiment.ratio ?? 0.5)) return false;
    }

    return true;
  }

  /* ─── 安全校验 ───────────────────────────────────────── */
  const ALLOW = window.WR_ALLOW_ORIGINS || [];

  function isSafe(src) {
    if (!src) return false;
    if (!src.startsWith('http')) return true;
    if (!ALLOW.length) return true;
    try {
      const host = new URL(src).hostname;
      return ALLOW.some(o => host === o || host.endsWith('.' + o));
    } catch {
      return false;
    }
  }

  /* ─── 依赖系统（异步等待 + 超时）────────────────────── */

  /**
   * 标记一个 widget 已完成，并触发等待它的回调
   */
  function markLoaded(id) {
    window[LOADED_KEY][id] = true;
    const cbs = _waitQueue[id] || [];
    delete _waitQueue[id];
    cbs.forEach(cb => cb());
  }

  /**
   * 等待所有依赖就绪，超时后 reject
   * @param {string[]} deps
   * @returns {Promise<void>}
   */
  function waitForDeps(deps) {
    if (!deps || deps.length === 0) return Promise.resolve();

    const pending = deps.filter(id => !window[LOADED_KEY][id]);
    if (pending.length === 0) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('dep timeout: ' + pending.filter(id => !window[LOADED_KEY][id]).join(', ')));
      }, DEP_TIMEOUT);

      let remaining = pending.length;

      pending.forEach(id => {
        // 已经就绪（并发完成的情况）
        if (window[LOADED_KEY][id]) {
          if (--remaining === 0) { clearTimeout(timer); resolve(); }
          return;
        }
        _waitQueue[id] = _waitQueue[id] || [];
        _waitQueue[id].push(() => {
          if (--remaining === 0) { clearTimeout(timer); resolve(); }
        });
      });
    });
  }

  /* ─── 核心注入 ───────────────────────────────────────── */
  function isDuplicate(w) {
    if (window[LOADED_KEY][w.id]) return true;
    if (w.src  && document.querySelector(`script[src="${w.src}"]`))  return true;
    if (w.href && document.querySelector(`link[href="${w.href}"]`))   return true;
    return false;
  }

  function getContainer(w) {
    return w.inject?.container === 'head' ? document.head : document.body;
  }

  async function inject(w) {
    if (isDuplicate(w)) return;

    // 等待依赖（异步，带超时）
    try {
      await waitForDeps(w.dependsOn);
    } catch (e) {
      reportError(w.id, e);
      return;
    }

    // 延迟
    if (w.trigger?.delay) {
      await new Promise(r => setTimeout(r, w.trigger.delay));
    }

    const container = getContainer(w);

    try {
      switch (w.type) {

        case 'html': {
          const el = document.querySelector(w.inject?.selector || 'body');
          if (el) el.insertAdjacentHTML(w.inject?.position || 'beforeend', w.content || '');
          break;
        }

        case 'script': {
          if (!isSafe(w.src)) { console.warn('[WR] blocked unsafe src', w.src); return; }
          await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = w.src;
            if (w.attrs) Object.entries(w.attrs).forEach(([k, v]) => s.setAttribute(k, String(v)));
            s.onload  = resolve;
            s.onerror = () => reject(new Error('script load failed: ' + w.src));
            container.appendChild(s);
          });
          break;
        }

        case 'link': {
          const l = document.createElement('link');
          l.rel = 'stylesheet';
          l.href = w.href;
          container.appendChild(l);
          break;
        }

        case 'style': {
          const st = document.createElement('style');
          st.textContent = w.content || '';
          document.head.appendChild(st);
          break;
        }

        case 'inline-script': {
          // 支持 async：用 AsyncFunction
          const AsyncFn = Object.getPrototypeOf(async function(){}).constructor;
          await new AsyncFn(w.content || '')();
          break;
        }

        default:
          console.warn('[WR] unknown type:', w.type);
          return;
      }

      markLoaded(w.id);
      document.dispatchEvent(new CustomEvent('wr:injected', { detail: w }));
      console.log('[WR] ✓', w.id);

    } catch (e) {
      reportError(w.id, e);
    }
  }

  /* ─── 调度器 ─────────────────────────────────────────── */

  /**
   * @param {object} w
   * @param {'once'|'everyRoute'} [routeMode] - once: 只跑一次; everyRoute: SPA 路由变化重跑
   */
  function runWidget(w) {
    const exec = () => inject(w);

    switch (w.stage) {
      case 'head':
        exec();
        break;

      case 'domready':
        if (document.readyState !== 'loading') exec();
        else document.addEventListener('DOMContentLoaded', exec, { once: true });
        break;

      case 'load':
        if (document.readyState === 'complete') exec();
        else window.addEventListener('load', exec, { once: true });
        break;

      case 'idle':
        'requestIdleCallback' in window
          ? requestIdleCallback(exec)
          : setTimeout(exec, 1000);
        break;

      default:
        // 无 stage → 立即（异步微任务后）
        Promise.resolve().then(exec);
    }
  }

  function schedule(widgets = []) {
    widgets
      .filter(w => w.enabled !== false)
      .filter(w => matchRule(w.match))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .forEach(runWidget);
  }

  /* ─── SPA 路由监听 ───────────────────────────────────── */
  let lastPath = location.pathname;

  function onRouteChange() {
    if (location.pathname === lastPath) return;
    lastPath = location.pathname;

    const cfg = window.__WR_CONFIG;
    if (!cfg) return;

    // 只重置 everyRoute 的 widget，once 的不重跑
    const toReset = cfg.widgets.filter(w => w.routeMode !== 'once');
    toReset.forEach(w => { delete window[LOADED_KEY][w.id]; });

    schedule(toReset);
  }

  // 代理 pushState / replaceState
  ['pushState', 'replaceState'].forEach(method => {
    const orig = history[method];
    history[method] = function (...args) {
      orig.apply(this, args);
      onRouteChange();
    };
  });

  window.addEventListener('popstate', onRouteChange);

  /* ─── 公开 API ───────────────────────────────────────── */
  window.WidgetRuntime = {
    get version() { return VERSION; },

    /** 强制重新执行所有 widget */
    refresh() {
      window[LOADED_KEY] = {};
      schedule(window.__WR_CONFIG?.widgets || []);
    },

    /** 动态添加一个 widget */
    add(w) {
      window.__WR_CONFIG.widgets.push(w);
      runWidget(w);
    },

    /** 运行时禁用某个 widget（下次路由/refresh 生效） */
    disable(id) {
      const w = window.__WR_CONFIG?.widgets.find(x => x.id === id);
      if (w) w.enabled = false;
    },

    /** 运行时启用并立即执行 */
    enable(id) {
      const w = window.__WR_CONFIG?.widgets.find(x => x.id === id);
      if (!w) return;
      w.enabled = true;
      delete window[LOADED_KEY][id];
      runWidget(w);
    },

    /** 已完成注入的 id 列表 */
    get loaded() {
      return Object.keys(window[LOADED_KEY]);
    },

    /** 等待某个 widget 完成后执行回调（外部代码用） */
    waitFor(id, cb) {
      if (window[LOADED_KEY][id]) { cb(); return; }
      _waitQueue[id] = _waitQueue[id] || [];
      _waitQueue[id].push(cb);
    },
  };

  /* ─── 启动 ───────────────────────────────────────────── */
  const config = await loadConfig();
  window.__WR_CONFIG = config;

  console.log(`[WR] v${VERSION} loaded, widgets: ${config.widgets.length}`);
  schedule(config.widgets);

})();