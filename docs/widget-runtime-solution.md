# 前端智能静态化方案


## Prompt:
一个网站智能静态化修改，如何处理widget 功能，我不想每次更新都重新编译，修改量太大了，能否用引入一个js固定的形式，js内容支持编译注入网站，比如某个位置要插入一个广告，某个位置要添加一个分享按钮等……比如突然间google广告又说要添加一个弹窗要求用户允许

## Response:
你这个本质是在做一套「**可运行时注入的前端能力层（Widget Runtime Layer）**」，目标是：**避免重新构建静态站点，同时能动态插入功能（广告 / 按钮 / 弹窗 / AB test 等）**。

可以做，而且这是很多大站（广告系统 / 增长系统 / 灰度系统）的标准做法 👍  
我给你一个工程化可落地的方案（适合你现在 Vue + Node + SSR / 静态混合体系）。

* * *

一、核心思路（重点）
==========

你说的方向是对的：  
👉 **引入一个固定 JS + 动态配置驱动**

整体架构：

```
HTML（静态页面）
  ↓
<script src="widget-runtime.js"></script>   ← 固定入口
  ↓
从服务端拉 JSON（或本地缓存）
  ↓
解析规则 → 动态插入组件 / DOM
```

* * *

二、系统拆分（建议这样设计）
==============

1️⃣ Runtime（前端注入引擎）
-------------------

一个全站统一加载的 JS：

```
<script src="https://cdn.xxx.com/widget-runtime.js"></script>
```

它负责：

*   拉取配置（JSON）
*   匹配当前页面
*   执行注入逻辑
*   生命周期管理

* * *

2️⃣ 配置中心（核心）
------------

你可以设计一套 JSON 协议（你之前已经在做类似系统，其实可以复用 👇）

```
{
  "widgets": [
    {
      "id": "ad-banner-1",
      "match": {
        "path": "/blog/*"
      },
      "inject": {
        "selector": "#article-end",
        "position": "beforeend"
      },
      "type": "html",
      "content": "<div>广告代码</div>"
    },
    {
      "id": "share-btn",
      "match": {
        "path": "/post/*"
      },
      "type": "script",
      "src": "https://cdn.xxx.com/share.js"
    }
  ]
}
```

* * *

3️⃣ 注入能力（关键设计点）
---------------

你至少需要支持这几种类型：

### ✅ HTML 注入

```
el.insertAdjacentHTML('beforeend', html)
```

* * *

### ✅ JS 动态加载

```
const script = document.createElement('script')
script.src = config.src
document.body.appendChild(script)
```

* * *

### ✅ 样式注入

```
const style = document.createElement('style')
style.innerHTML = css
document.head.appendChild(style)
```

* * *

### ✅ Vue / 组件挂载（高级玩法）

你甚至可以：

```
createApp(WidgetComponent).mount(el)
```

👉 这样可以远程“发组件”

* * *

三、避免重新编译的关键策略
=============

1️⃣ 不写死 DOM，改用「锚点 + 规则匹配」
-------------------------

比如：

```
<div data-widget="article-end"></div>
```

或者用 selector：

```
"selector": ".article-content > p:nth-child(3)"
```

* * *

2️⃣ 使用 MutationObserver（非常关键）
-----------------------------

因为你的页面可能是 SPA（Nuxt / Vue）

```
const observer = new MutationObserver(() => {
  runWidgets()
})
observer.observe(document.body, { childList: true, subtree: true })
```

👉 页面切换也能生效

* * *

3️⃣ 支持缓存 + 远程更新
---------------

```
localStorage.setItem('widget-config', json)
```

*   定时更新：

```
setInterval(fetchConfig, 5 * 60 * 1000)
```

* * *

四、解决你提到的关键问题
============

❓“Google 广告突然要求弹窗”
------------------

你可以这样做：

### 后台加一条配置：

```
{
  "id": "consent-popup",
  "type": "script",
  "src": "https://consent.google.com/script.js",
  "match": { "path": "*" }
}
```

👉 所有页面立刻生效  
👉 不需要重新构建

* * *

五、进阶能力（强烈建议你做）
==============

1️⃣ 条件执行（你之前提到过）
----------------

```
"condition": {
  "country": ["US", "JP"],
  "device": "mobile",
  "login": false
}
```

* * *

2️⃣ AB Test
-----------

```
"experiment": {
  "key": "ad_test",
  "ratio": 0.5
}
```

* * *

3️⃣ 延迟执行
--------

```
"delay": 3000
```

* * *

4️⃣ 优先级控制
---------

```
"priority": 10
```

* * *

5️⃣ 去重机制（很重要）
-------------

```
if (window.__widget_loaded[id]) return
```

* * *

六、架构升级建议（适合你现在的系统）
==================

你现在已经有：

👉 JSON 动态加载系统（你之前提到的）

建议直接升级为：

「前端策略引擎」
--------

模块拆分：

```
/runtime
  loader.ts        // 拉配置
  matcher.ts       // 匹配规则
  injector.ts      // 注入逻辑
  sandbox.ts       // JS隔离（可选）
  tracker.ts       // 埋点
```

* * *

七、安全问题（必须注意）
============

⚠️ 你在执行远程 JS，相当于“远程代码执行”

必须加：

### 1️⃣ 域名白名单

```
if (!allowList.includes(new URL(src).host)) return
```

* * *

### 2️⃣ CSP（内容安全策略）

* * *

### 3️⃣ 沙箱（进阶）

```
iframe sandbox
```

* * *

八、给你一个最小实现 Demo
===============

```
(async function () {
  const res = await fetch('/widget-config.json')
  const { widgets } = await res.json()

  widgets.forEach(w => {
    if (!match(w.match)) return

    const el = document.querySelector(w.inject?.selector || 'body')
    if (!el) return

    if (w.type === 'html') {
      el.insertAdjacentHTML(w.inject.position || 'beforeend', w.content)
    }

    if (w.type === 'script') {
      const s = document.createElement('script')
      s.src = w.src
      document.body.appendChild(s)
    }
  })
})()
```

* * *

九、总结（给你一个决策结论）
==============

你这个需求：

✅ **完全可以用“固定 JS + 远程配置”解决**  
✅ 不需要重新构建  
✅ 可支持广告 / 分享 / 弹窗 / AB test / 实验  
✅ 可扩展成一个“前端运营系统”

* * *

如果你想继续深入
========

我可以帮你直接设计一套完整方案（偏你现在项目）：

*   ✔ Vue / Nuxt 插件接入方式
*   ✔ 后台管理 UI（拖拽式配置 widget）
*   ✔ JSON schema 设计（带类型校验）
*   ✔ JS 沙箱（防止污染全局）
*   ✔ 灰度发布 + 回滚机制

你可以直接说一句：  
👉「帮我设计一套生产级 widget 系统」

## Prompt:
帮我设计一套生产级 widget 系统

## Response:
好，这个我给你直接按「**能上线、能扩展、能控风险**」的标准来设计一套完整方案。你现在的技术栈（Vue / Nuxt / Node）完全可以无缝接入，而且还能复用你现有的 JSON 动态系统。

下面是一个**生产级 Widget Runtime System（前端运营引擎）设计**。

* * *

一、系统目标（先定边界）
============

你这套系统必须解决：

*   ✅ 不重新构建静态站
*   ✅ 支持广告 / 弹窗 / 分享 / AB test / 实验
*   ✅ 支持精准投放（页面 / 用户 / 地域 / 设备）
*   ✅ 可灰度 / 可回滚 / 可监控
*   ✅ 不污染主工程（解耦）
*   ✅ 安全可控（防远程 JS 风险）

* * *

二、总体架构
======

```
                ┌──────────────────────┐
                │   Widget Admin UI    │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │  Config Service(API) │
                └─────────┬────────────┘
                          │
        CDN缓存(JSON)      ▼
                ┌──────────────────────┐
                │   widget-runtime.js  │  ← 注入入口（核心）
                └─────────┬────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   Matcher           Injector           Sandbox
   (规则匹配)        (执行注入)         (安全隔离)

                          │
                          ▼
                   用户浏览器页面
```

* * *

三、核心模块设计
========

1️⃣ Runtime（浏览器执行引擎）
--------------------

全站引入：

```
<script src="https://cdn.xxx.com/widget-runtime.min.js"></script>
```

* * *

### Runtime 内部结构：

```
runtime/
  index.ts
  loader.ts         // 拉配置
  matcher.ts        // 匹配规则
  injector.ts       // 注入执行
  scheduler.ts      // 延迟/优先级/队列
  sandbox.ts        // JS隔离
  store.ts          // 状态缓存
  tracker.ts        // 埋点
```

* * *

2️⃣ 配置协议（核心设计）
--------------

👉 建议用 **JSON Schema + 版本化**

### 示例（生产级）

```
{
  "version": "1.0.0",
  "widgets": [
    {
      "id": "google-consent",
      "enabled": true,

      "match": {
        "path": ["/", "/blog/*"],
        "device": ["mobile", "desktop"],
        "country": ["JP", "US"]
      },

      "trigger": {
        "type": "onload",
        "delay": 1000
      },

      "inject": {
        "selector": "body",
        "position": "beforeend"
      },

      "type": "script",
      "src": "https://consent.google.com/script.js",

      "priority": 10,

      "experiment": {
        "key": "consent_v2",
        "ratio": 0.5
      },

      "once": true
    }
  ]
}
```

* * *

四、Matcher（规则引擎）
===============

支持维度：
-----

```
type MatchRule = {
  path?: string[]        // /blog/*
  query?: Record<string, string>
  device?: ('mobile' | 'desktop')[]
  country?: string[]
  login?: boolean
  timeRange?: [number, number]
}
```

* * *

### 核心逻辑：

```
function match(rule, context) {
  return (
    matchPath(rule.path, context.path) &&
    matchDevice(rule.device) &&
    matchCountry(rule.country)
  )
}
```

* * *

五、Injector（注入系统）
================

支持类型（必须分层）
----------

### 1️⃣ HTML

```
insertAdjacentHTML
```

* * *

### 2️⃣ Script

```
loadScript(src)
```

* * *

### 3️⃣ Style

```
injectCSS(css)
```

* * *

### 4️⃣ Component（推荐你做）

```
mountVueComponent(el, componentUrl)
```

👉 支持远程组件（微前端能力）

* * *

六、Scheduler（调度系统）
=================

控制：

*   延迟执行
*   优先级
*   并发控制

```
queue.sort((a, b) => b.priority - a.priority)
```

* * *

支持：

```
"trigger": {
  "type": "onload | idle | visible",
  "delay": 3000
}
```

* * *

七、SPA 支持（Nuxt 必须）
=================

用 MutationObserver
------------------

```
const observer = new MutationObserver(() => {
  rerunWidgets()
})
```

* * *

或 Hook Router（更优）
-----------------

Nuxt：

```
router.afterEach(() => {
  runtime.refresh()
})
```

* * *

八、Sandbox（安全体系 ⚠️重点）
====================

你这个系统最大风险：**远程 JS 注入**

* * *

分级策略：
-----

### 🟢 低风险（推荐默认）

*   HTML / CSS 注入

* * *

### 🟡 中风险

*   Script（限制域名）

```
const allowList = ['cdn.xxx.com', 'google.com']
```

* * *

### 🔴 高风险（强隔离）

👉 iframe sandbox

```
<iframe sandbox="allow-scripts"></iframe>
```

* * *

### 进阶（你可以后面做）

*   JS Proxy 沙箱（类似 qiankun）

* * *

九、缓存 & 热更新
==========

1️⃣ 本地缓存
--------

```
localStorage.setItem('widget_config', json)
```

* * *

2️⃣ ETag / 版本控制
---------------

```
if (config.version === local.version) skip
```

* * *

3️⃣ 实时更新（可选）
------------

*   WebSocket
*   SSE

* * *

十、埋点 & 监控（必须）
=============

```
tracker.emit('widget_loaded', { id })
tracker.emit('widget_error', { error })
```

* * *

你可以统计：

*   展示率
*   点击率
*   错误率

* * *

十一、后台系统（Admin）
==============

你可以做一个：

Widget 管理后台
-----------

功能：

*   创建 widget
*   可视化选择位置（selector）
*   AB test 配置
*   发布 / 灰度 / 回滚
*   实时预览

* * *

十二、灰度发布（生产必备）
=============

```
"rollout": {
  "percentage": 20
}
```

```
if (Math.random() > 0.2) return
```

* * *

十三、去重 & 生命周期
============

```
if (window.__WIDGETS__[id]) return
window.__WIDGETS__[id] = true
```

* * *

支持：

*   once
*   destroy
*   re-run

* * *

十四、和你现有系统结合（重点）
===============

你之前已经有：

✅ JSON 动态加载系统  
✅ 条件控制 / 延迟执行思路

👉 直接升级为：

👉「前端策略执行引擎」
============

把你现在系统扩展为：

*   widget = 一种策略
*   页面加载 = 执行策略
*   JSON = DSL（领域语言）

* * *

十五、给你一个生产级 Runtime 核心代码骨架
=========================

```
class WidgetRuntime {
  async init() {
    this.config = await loadConfig()
    this.run()
  }

  run() {
    const ctx = getContext()

    const queue = this.config.widgets
      .filter(w => w.enabled)
      .filter(w => match(w.match, ctx))
      .sort(byPriority)

    queue.forEach(w => this.schedule(w))
  }

  schedule(widget) {
    setTimeout(() => {
      this.execute(widget)
    }, widget.trigger?.delay || 0)
  }

  execute(widget) {
    if (widget.once && this.loaded(widget.id)) return

    injector.run(widget)

    this.markLoaded(widget.id)
  }
}
```

* * *

十六、最终结论
=======

你要做的不是“插 JS”这么简单，而是：

👉 一套「前端运行时策略系统（Frontend Runtime Engine）」
=========================================

它本质上 =

*   广告系统 + AB Test + CMS + 微前端 的结合体

* * *

如果你下一步想继续做
==========

我可以帮你把这一套**直接落地到你项目级别**：

比如：

*   ✔ 给你一份 **完整 TypeScript 类型定义**
*   ✔ 帮你设计 **数据库表结构（MySQL / Prisma）**
*   ✔ 写一个 **Nuxt 插件版 runtime**
*   ✔ 做一个 **可视化拖拽 widget 编辑器**
*   ✔ 或者：支持你那个「JSON 脚本系统」直接升级


