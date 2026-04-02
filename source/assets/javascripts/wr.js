/**
 * Widget Runtime System v1.0.0
 * 全站动态注入引擎 · 无需重新编译
 * 
 * 使用方式：
 *   <script src="https://cdn.xxx.com/widget-runtime.js"></script>
 * 
 * 配置地址默认读取 window.WR_CONFIG_URL，否则回退到 /widget-config.json
 */

(async function WidgetRuntime() {
  'use strict';

  // ─── 配置 ───────────────────────────────────────────────
  const CONFIG_URL = window.WR_CONFIG_URL || '/conf/widget-config.json';
  const CACHE_KEY  = '__wr_cfg';
  const LOADED_KEY = '__wr_ids';

  window[LOADED_KEY] = window[LOADED_KEY] || {};

  // ─── 1. 加载配置（优先缓存，网络失败自动降级）─────────────
  async function loadConfig() {
    try {
      const local  = localStorage.getItem(CACHE_KEY);
      const cached = local ? JSON.parse(local) : null;
      const url    = CONFIG_URL + (CONFIG_URL.includes('?') ? '&' : '?') + '_v=' + (cached?.version || '0');

      const res = await fetch(url, { cache: 'no-cache' });
      if (res.status === 304) return cached;

      const data = await res.json();
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data;
    } catch (e) {
      console.warn('[WR] 网络加载失败，使用本地缓存', e.message);
      const fallback = localStorage.getItem(CACHE_KEY);
      return fallback ? JSON.parse(fallback) : { version: '0', widgets: [] };
    }
  }

  // ─── 2. 规则匹配 ─────────────────────────────────────────
  function matchRule(rule) {
    if (!rule) return true;

    // 路径匹配（支持通配符 *）
    if (rule.path) {
      const path = location.pathname;
      const hit  = rule.path.some(p =>
        p === '*' ||
        p === path ||
        (p.endsWith('*') && path.startsWith(p.slice(0, -1)))
      );
      if (!hit) return false;
    }

    // 设备类型
    if (rule.device) {
      const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
      const d = isMobile ? 'mobile' : 'desktop';
      if (!rule.device.includes(d)) return false;
    }

    // 时间范围 [startHour, endHour]（24小时制）
    if (rule.timeRange) {
      const h = new Date().getHours();
      if (h < rule.timeRange[0] || h >= rule.timeRange[1]) return false;
    }

    // AB Test 随机分流
    if (rule.experiment) {
      const key    = 'wr_exp_' + rule.experiment.key;
      const stored = localStorage.getItem(key);
      const bucket = stored !== null ? parseFloat(stored) : Math.random();
      localStorage.setItem(key, bucket);
      if (bucket > (rule.experiment.ratio || 0.5)) return false;
    }

    return true;
  }

  // ─── 3. 域名白名单校验 ───────────────────────────────────
  const ALLOW_ORIGINS = (window.WR_ALLOW_ORIGINS || []);

  function isSafeUrl(src) {
    if (!src) return false;
    if (!src.startsWith('http')) return true; // 相对路径放行
    if (ALLOW_ORIGINS.length === 0) return true; // 未配置白名单则全放行
    try {
      const host = new URL(src).hostname;
      return ALLOW_ORIGINS.some(o => host === o || host.endsWith('.' + o));
    } catch (e) {
      return false;
    }
  }

  // ─── 4. 注入执行器 ───────────────────────────────────────
  function inject(w) {
    if (window[LOADED_KEY][w.id]) return;

    const selector = w.inject?.selector || 'body';
    const el       = document.querySelector(selector);

    if (!el) {
      console.warn('[WR] 选择器未找到:', selector, '- widget:', w.id);
      return;
    }

    try {
      switch (w.type) {

        case 'html': {
          const pos = w.inject?.position || 'beforeend';
          el.insertAdjacentHTML(pos, w.content || '');
          break;
        }

        case 'script': {
          if (!isSafeUrl(w.src)) {
            console.warn('[WR] 域名不在白名单，已拦截:', w.src);
            return;
          }
          const s  = document.createElement('script');
          s.src    = w.src;
          s.async  = true;
          if (w.attrs) Object.entries(w.attrs).forEach(([k, v]) => s.setAttribute(k, v));
          document.body.appendChild(s);
          break;
        }

        case 'style': {
          const st    = document.createElement('style');
          st.id       = 'wr-style-' + w.id;
          st.innerHTML = w.content || '';
          document.head.appendChild(st);
          break;
        }

        case 'inline-script': {
          // 执行内联 JS（谨慎使用）
          const fn = new Function(w.content || '');
          fn();
          break;
        }

        default:
          console.warn('[WR] 未知类型:', w.type);
          return;
      }

      window[LOADED_KEY][w.id] = true;
      console.log('[WR] ✓ injected:', w.id);

      // 触发自定义事件，方便外部监听
      document.dispatchEvent(new CustomEvent('wr:injected', { detail: { id: w.id } }));

    } catch (e) {
      console.error('[WR] 注入失败:', w.id, e);
    }
  }

  // ─── 5. 调度器（优先级 + 延迟）──────────────────────────
  function schedule(widgets) {
    const queue = widgets
      .filter(w => w.enabled !== false)
      .filter(w => matchRule(w.match))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    queue.forEach(w => {
      const delay = w.trigger?.delay || 0;

      if (w.trigger?.type === 'visible' && w.inject?.selector) {
        // 可视区触发（IntersectionObserver）
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              inject(w);
              observer.disconnect();
            }
          });
        });
        const target = document.querySelector(w.inject.selector);
        if (target) observer.observe(target);
        else setTimeout(() => inject(w), delay);
      } else if (w.trigger?.type === 'idle') {
        // 浏览器空闲时执行
        const cb = () => inject(w);
        'requestIdleCallback' in window
          ? requestIdleCallback(cb, { timeout: 3000 })
          : setTimeout(cb, delay || 1000);
      } else {
        setTimeout(() => inject(w), delay);
      }
    });
  }

  // ─── 6. SPA 路由监听（支持 Vue Router / Nuxt / Next.js）──
  let lastPath = location.pathname;

  function onRouteChange() {
    if (location.pathname === lastPath) return;
    lastPath = location.pathname;
    window[LOADED_KEY] = {};  // 重置已注入记录
    schedule(window.__WR_CONFIG?.widgets || []);
    console.log('[WR] 路由变化，重新执行 widgets:', lastPath);
  }

  // History API 劫持
  const _push    = history.pushState.bind(history);
  const _replace = history.replaceState.bind(history);
  history.pushState    = (...args) => { _push(...args);    onRouteChange(); };
  history.replaceState = (...args) => { _replace(...args); onRouteChange(); };
  window.addEventListener('popstate', onRouteChange);

  // DOM 变化兜底（for Nuxt / SSR hydration）
  new MutationObserver(onRouteChange)
    .observe(document.body, { childList: true, subtree: false });

  // ─── 7. 对外暴露 API ─────────────────────────────────────
  window.WidgetRuntime = {
    version: '1.0.0',

    // 手动刷新（Nuxt 插件可调用）
    refresh() {
      window[LOADED_KEY] = {};
      schedule(window.__WR_CONFIG?.widgets || []);
    },

    // 运行时追加 widget
    add(widget) {
      if (!window.__WR_CONFIG) return;
      window.__WR_CONFIG.widgets.push(widget);
      schedule([widget]);
    },

    // 查看已注入列表
    get loaded() {
      return Object.keys(window[LOADED_KEY]);
    },
  };

  // ─── 8. 启动 ─────────────────────────────────────────────
  const config = await loadConfig();
  window.__WR_CONFIG = config;

  console.log('[WR] Widget Runtime v1.0.0 启动，共', config.widgets?.length || 0, '个 widget');
  schedule(config.widgets || []);

})();
