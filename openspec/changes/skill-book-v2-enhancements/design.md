## Context

Skill Book 是一个 Vue 3 静态 SPA，技能数据存储在 `public/skills/*.md`（构建时）和 `localStorage`（运行时）。当前已有 9 个 composables 管理状态，3 个视图页面，10 个组件。应用已具备基础浏览、搜索、学习追踪功能，但存在三类问题：(1) 已实现但损坏的功能（场景筛选空壳、数据导入丢数据）；(2) "查 skill"和"用 skill"场景的关键缺口（命令速查、复习节奏、全局统计）；(3) 工程质量遗留（Dark Mode 半成品、无排序、无 URL 同步、无离线支持）。

当前数据流：`skills → useSearch → useFilters → useScenarios → displayedSkills`，所有 composable 使用模块级单例状态。

## Goals / Non-Goals

**Goals:**

- 修复已损坏功能，让现有特性真正可用（场景筛选、数据导入）
- 实现"用 skill"的关键快捷路径：命令速查面板，从任何页面一键搜索并复制命令
- 建立学习闭环：间隔复习系统，让学过的 skill 不被遗忘
- 提供全局视角：使用热力图和排序，让用户了解自己的学习模式
- 补齐工程基础：URL 状态同步、PWA 离线、Dark Mode 完善

**Non-Goals:**

- 不做后端服务 — 保持纯静态 SPA 架构
- 不做多用户/协作功能 — 个人工具定位
- 不做 skill 自动发现/推荐引擎 — 关联发现仅基于显式声明和元数据重叠
- 不做移动端原生适配 — 响应式布局即可
- 不做 AI 对话/交互功能 — 当前 GitHub 导入已用 AI，不再扩展 AI 场景
- 不替换 Fuse.js 搜索引擎 — 当前方案够用

## Decisions

### D1: index.json 构建脚本统一输出完整字段

**决定**：修改 `build-skills.js` 和 `vite-plugin-skill-api.js` 中的 `rebuildIndex()`，使 `index.json` 包含 `scenarios`、`commands`（完整对象数组，不仅是 cmd 字符串）、`quickstart`、`install`、`source` 字段。

**理由**：当前 `index.json` 只包含 `name/slug/category/tags/description`，导致首页无法渲染场景筛选器，命令速查面板也无法从 index 获取命令数据。完整字段输出后，首页和命令面板均可直接使用 index 数据，无需逐个加载 `.md` 文件。

**替代方案**：
- A) 首页按需加载 `.md` 文件获取命令和场景 → 增加网络请求，慢
- B) 单独构建 `commands-index.json` → 增加构建复杂度和数据一致性风险
- C) 完整字段输出到 `index.json`（选择此方案）→ 一次加载，所有页面可用

**注意**：`commands` 当前在 `build-skills.js` 中被扁平化为 `commands: data.commands.map(c => c.cmd)`，丢失了 `name` 字段。需改为完整对象数组输出：`commands: data.commands`。

### D2: 命令速查面板采用全局模态层 + Fuse.js 搜索

**决定**：新增 `CommandPalette.vue` 组件，挂载在 `App.vue` 根层级（Teleport to body），`⌘K`/`Ctrl+K` 全局快捷键唤起。内部使用独立的 Fuse.js 实例搜索命令，搜索范围覆盖命令名（`command.name`）、命令内容（`command.cmd`）和所属 skill 名称。

**理由**：
- 全局模态层确保从任何页面均可唤起，无需组件间事件传递
- 复用 Fuse.js（项目已有依赖），无需引入新搜索库
- 数据源直接从 `useSkills` 的 `skills` ref 提取，无需额外 API

**替代方案**：
- A) 路由级组件 → 需要页面跳转，打断工作流
- B) 使用 cmdk 等 npm 库 → 增加依赖，样式定制困难
- C) 全局模态层 + Fuse.js（选择此方案）→ 轻量、可控、风格统一

**数据结构**：从 skills 数组展平为命令条目数组：
```js
commandEntries = skills.flatMap(skill =>
  (skill.commands || []).map(cmd => ({
    skillSlug: skill.slug,
    skillName: skill.name,
    commandName: cmd.name,
    commandCmd: cmd.cmd,
  }))
)
```

### D3: 间隔复习采用简化艾宾浩斯曲线，数据存 localStorage

**决定**：新增 `useSpacedRepetition` composable，内部维护 `reviewSchedule` 映射（`slug → { nextReviewAt, interval, reviewCount, lastReviewedAt }`）。间隔序列：1→3→7→14→30 天。每次标记"已复习"后，`interval` 推进到下一级，`nextReviewAt` 重新计算。标记"未记住"则回退到 1 天间隔。

**数据存储**：localStorage key `skill-book-review-schedule`，格式 `{ [slug]: ReviewEntry }`。

**与现有状态的关系**：
- `useSkillStatus` 的 `mastered` 状态的 skill 不再出现复习提醒（已掌握）
- `todo` 状态的 skill 首次标记"开始学习"时创建复习计划
- `learning` 状态的 skill 如果没有复习计划，自动创建

**替代方案**：
- A) 使用 SM-2 算法（Anki 同款）→ 复杂度高，需要用户评分（0-5），个人工具过重
- B) 简化固定间隔（选择此方案）→ 零配置，自动调度，够用

### D4: 热力图使用纯 SVG 渲染，无第三方库

**决定**：`UsageHeatmap.vue` 组件使用纯 SVG `<rect>` 元素渲染 GitHub 风格热力图，数据由 `useStats` composable 从 `useUsageTracker` 的 `stats` 中按日聚合。

**理由**：
- 热力图本质是 7×N 的矩形网格，SVG 完全胜任
- 不引入 d3 或 chart.js 等重依赖
- 与项目现有 SVG 进度环风格一致（MySpaceView 中的环形图）

**数据结构**：`useStats` 提供 `heatmapData` computed，返回 `{ date: string, count: number }[]` 最近 90 天数据。

### D5: Skill 关系图谱采用简化力导向布局，纯 SVG

**决定**：新增 `SkillGraphView.vue`，使用简化的力导向算法（迭代式节点排斥 + 边吸引），纯 SVG 渲染。不依赖 d3-force。

**理由**：
- Skill 关系图节点数通常 < 50，简单力导向足够
- 避免 d3-force 的 50KB+ 体积
- 可复用热力图的纯 SVG 方案经验

**关联发现算法**：
1. 手动声明（`related` 字段）→ 权重 3
2. 同 category → 权重 1
3. 标签重叠数 → 每个重叠标签权重 0.5
4. 场景重叠数 → 每个重叠场景权重 0.5
5. 总分 ≥ 2 的 skill 对建立边

### D6: URL 状态同步使用 hash 查询参数

**决定**：在 `HomeView.vue` 中使用 `URLSearchParams` 读写 `window.location.hash` 的查询部分。格式：`#/?category=xxx&tags=a,b&scenario=yyy&q=search`。

**理由**：
- 项目已使用 `createWebHashHistory`，URL 格式为 `#/path`
- hash 查询参数无需服务端支持，兼容静态托管
- 浏览器原生 `popstate` 事件处理前进/后退

**替代方案**：
- A) 使用 vue-router query → 与 hash history 配合良好，但需在路由定义中声明
- B) 直接操作 `location.hash`（选择此方案）→ 更灵活，不受路由定义约束

### D7: PWA 使用 Vite PWA Plugin (vite-plugin-pwa)

**决定**：使用 `vite-plugin-pwa` 自动生成 Service Worker 和 manifest.json。缓存策略：`index.html` 和 `index.json` 使用 StaleWhileRevalidate，`.md` 文件使用 CacheFirst，静态资源使用 CacheFirst。

**理由**：
- 手写 Service Worker 工作量大，易出错
- `vite-plugin-pwa` 是 Vite 生态标准方案，自动处理预缓存和更新通知
- 支持多种缓存策略配置

### D8: Dark Mode 使用 CSS 变量 + 手动切换 + localStorage 持久化

**决定**：新增 `useSettings` composable 管理 `theme` 状态（`'light' | 'dark' | 'system'`），默认 `'system'`。在 `<html>` 元素上添加 `data-theme="dark"` 属性，CSS 使用 `[data-theme="dark"]` 选择器覆盖变量。优先级：手动选择 > 系统偏好。

**理由**：
- 当前 `tokens.css` 已有 `@media (prefers-color-scheme: dark)` 媒体查询，但组件硬编码颜色
- 先将硬编码颜色替换为 CSS 变量引用，再用 `[data-theme]` 属性切换，比媒体查询更可控
- `useSettings` 可扩展管理其他用户偏好（如语言、排序偏好等）

### D9: 排序功能在 useFilters 之后新增 useSort composable

**决定**：新增 `useSort` composable，支持按 `name-asc`、`name-desc`、`views-desc`、`views-asc`、`recent-desc`、`recent-asc`、`status` 排序。默认按原有顺序（index.json 顺序）。

**数据流更新**：`skills → useSearch → useFilters → useScenarios → useSort → displayedSkills`

**理由**：
- 排序是独立的关注点，不应混入 useFilters
- 作为 composable 符合项目架构模式
- 排序需要访问 `useUsageTracker` 和 `useSkillStatus` 的数据

## Risks / Trade-offs

- **[index.json 体积增大]** → 包含 commands/quickstart 后 index.json 可能翻倍。缓解：gzip 压缩后差异不大（纯文本 JSON），且只加载一次。
- **[命令速查面板性能]** → 大量命令时搜索可能卡顿。缓解：Fuse.js 对 < 1000 条目性能足够；添加 150ms 输入防抖。
- **[力导向布局计算成本]** → 节点多时布局计算可能阻塞主线程。缓解：Skill 数量通常 < 100，可接受；超过 200 时添加节点数量上限。
- **[PWA 缓存更新延迟]** → 用户可能看不到最新的 skill 数据。缓解：使用 StaleWhileRevalidate 策略，后台更新后提示刷新。
- **[间隔复习与使用追踪的耦合]** → 复习系统依赖 useUsageTracker 的 lastViewedAt，但复习行为本身也会 trackView。缓解：新增 `trackReview` 方法区分"复习查看"和"普通浏览"。
- **[URL 状态与 composable 单例冲突]** → composable 使用模块级单例状态，URL 初始化和 composable 初始化顺序需要协调。缓解：在 `useFilters`/`useScenarios`/`useSearch` 中添加 `initFromURL()` 方法，由 HomeView 在 mount 时调用。
- **[Dark Mode 改动面广]** → 需要修改几乎所有组件的硬编码颜色。缓解：分批进行，先替换 tokens.css 中已定义的变量，再逐步处理组件级样式。
