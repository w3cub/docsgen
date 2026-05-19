# widget 模块化说明

此目录用于把 `public/conf/widget-config.json` 拆分为可维护的模块文件，使用 `tools/build-widget-config.js` 将模块拼装回最终的 JSON。

结构：
- `widget/src/widgets.json` — 主描述文件，`content` 字段支持 `file:...` 引用到同目录下的文件。
- `widget/src/*.js|.html` — 对应的内联脚本或 HTML 片段。

使用方法：

- 构建一次：
  - `npm run build:widgets` 或 `pnpm run build:widgets`
- 监听并自动构建：
  - `npm run watch:widgets`
  - 或使用 `gulp`：`npm run gulp`（需先 `npm install`）

编辑流程：
1. 在 `widget/src/` 中编辑或新增文件（`.js` / `.html`）。
2. 在 `widget/src/widgets.json` 中把对应 widget 的 `content` 值改为 `file:your-file.js`。
3. 运行构建命令，输出写回 `public/conf/widget-config.json`（构建脚本会首先生成 `.bak` 备份）。

标签与分析
- 每个 widget 条目现在支持 `tags` 字段（字符串数组），用于给 widget 打标签方便分类与筛选，例如 `"tags": ["ads","lazy"]`。
- 新增 `tools/analyze-widgets.js`：运行后会输出按 tag 分组的 widget 列表，方便快速查看哪些文件属于广告、analytics、consent 等。

示例：

```bash
# 汇总 tags
node tools/analyze-widgets.js
```
