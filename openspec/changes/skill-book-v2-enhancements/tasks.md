## 1. P0 — 修复已有但坏掉的功能

- [ ] 1.1 修改 `scripts/build-skills.js`：`index.push()` 中增加 `scenarios`、`commands`（完整对象数组而非仅 cmd 字符串）、`quickstart`、`install`、`source`、`related` 字段输出；可选字段缺失时省略或输出空数组
- [ ] 1.2 修改 `scripts/vite-plugin-skill-api.js` 的 `rebuildIndex()`：与 `build-skills.js` 输出对齐，增加 `scenarios`、`commands`、`quickstart`、`install`、`source`、`related` 字段
- [ ] 1.3 修改 `scripts/vite-plugin-skill-api.js` 的 POST 处理：frontmatter 构建增加 `scenarios`、`commands`、`quickstart`、`related` 字段保存
- [ ] 1.4 修改 `src/utils/frontmatter.js`：确保解析器支持 `related` 字段（字符串数组格式，与 tags 相同）和 `commands` 对象数组格式
- [ ] 1.5 修改 `src/components/DataPanel.vue` 的 `importData()`：增加 `usageStats`、`userSkills`、`reviewSchedule`、`settings` 的合并恢复逻辑
- [ ] 1.6 修改 `src/components/DataPanel.vue` 的 `exportData()`：增加 `reviewSchedule`、`settings` 字段导出，`version` 升级为 2
- [ ] 1.7 修改 `importData()` 兼容 `version: 1` 旧备份：缺失新字段时使用默认值不报错
- [ ] 1.8 运行 `npm run build:skills` 重新生成 `index.json`，验证 scenarios/commands/quickstart 字段正确输出
- [ ] 1.9 验证首页场景筛选器现在能正确显示场景选项并过滤 skill

## 2. P1 — 命令速查面板 (Command Palette)

- [ ] 2.1 新建 `src/composables/useCommandPalette.js`：管理面板开关状态（`isOpen` ref）、命令条目展平逻辑（从 skills 提取 commands）、Fuse.js 搜索实例（权重：commandCmd=2, commandName=1.5, skillName=1）、搜索结果 computed、键盘高亮索引 ref
- [ ] 2.2 新建 `src/components/CommandPalette.vue`：Teleport to body 的模态层，包含搜索输入框、命令列表、遮罩层；支持 `⌘K`/`Ctrl+K` 全局快捷键、`Escape` 关闭、上下键导航、`Enter` 复制
- [ ] 2.3 实现命令复制功能：点击命令条目或 Enter 键时，使用 `navigator.clipboard.writeText()` 复制 `cmd` 内容，显示"已复制"提示（toast），关闭面板
- [ ] 2.4 在 `App.vue` 中引入 `CommandPalette` 组件，确保全局可用
- [ ] 2.5 添加命令面板样式：模态遮罩、搜索框、命令列表项、高亮状态、复制提示动画
- [ ] 2.6 测试：验证快捷键唤起/关闭、搜索匹配、键盘导航、复制功能

## 3. P2 — 间隔复习系统 (Spaced Repetition)

- [ ] 3.1 新建 `src/composables/useSpacedRepetition.js`：`reviewSchedule` ref（slug→ReviewEntry 映射）、localStorage key `skill-book-review-schedule` 持久化、间隔序列 [1,3,7,14,30]
- [ ] 3.2 实现 `createReviewPlan(slug)`：为 learning 状态 skill 创建复习计划，nextReviewAt=now+1天，interval=1，reviewCount=0
- [ ] 3.3 实现 `markReviewed(slug)`：更新 lastReviewedAt、reviewCount+1、interval 推进到下一级、nextReviewAt 重新计算
- [ ] 3.4 实现 `markForgotten(slug)`：interval 回退到 1，nextReviewAt=now+1天
- [ ] 3.5 实现 `dueReviews` computed：筛选 nextReviewAt ≤ 当前日期的 skill 列表
- [ ] 3.6 在 `useSkillStatus.js` 的 `setStatus` 中集成：状态变为 `learning` 时自动调用 `createReviewPlan`（若无计划），状态变为 `mastered` 时删除复习计划
- [ ] 3.7 修改 `MySpaceView.vue`：新增"今日复习"区域，展示 `dueReviews` 列表，每条显示 skill 名称、间隔天数、复习次数、"已复习"和"未记住"按钮
- [ ] 3.8 添加"今日无需复习 🎉"空状态提示
- [ ] 3.9 测试：验证复习计划创建、间隔推进、回退、mastered 清除、页面刷新持久化

## 4. P3 — 使用统计与热力图

- [ ] 4.1 新建 `src/composables/useStats.js`：从 `useUsageTracker.stats` 聚合日维度数据，`heatmapData` computed 返回最近 90 天 `{ date, count }[]`
- [ ] 4.2 新建 `src/components/UsageHeatmap.vue`：纯 SVG 渲染 GitHub 风格热力图，7行×N列矩形网格，颜色等级 0→1→2→3→4 对应 CSS 变量
- [ ] 4.3 在 `tokens.css` 中新增热力图颜色变量：`--color-heatmap-0` 到 `--color-heatmap-4`，浅色和深色主题分别定义
- [ ] 4.4 实现热力图悬停 tooltip：显示日期和查看次数
- [ ] 4.5 实现热力图月份标签：在顶部显示月份名称
- [ ] 4.6 修改 `MySpaceView.vue`：在"学习进度"区域下方新增热力图区域
- [ ] 4.7 新建 `src/composables/useSort.js`：`sortMode` ref（默认 `'default'`），支持 `name-asc`/`name-desc`/`views-desc`/`views-asc`/`recent-desc`/`recent-asc`/`status` 排序模式，`sorted(skills)` computed
- [ ] 4.8 修改 `HomeView.vue`：在 skill 卡片网格上方添加排序下拉选择器，数据流更新为 `skills → search → filters → scenarios → sort → displayedSkills`
- [ ] 4.9 排序偏好持久化到 `useSettings` composable
- [ ] 4.10 测试：验证热力图渲染、tooltip、排序功能

## 5. P4 — Skill 关系图谱

- [ ] 5.1 修改 `src/utils/frontmatter.js`：确保 `related` 字段解析正确（已在 1.4 完成，此处验证）
- [ ] 5.2 新建 `src/composables/useSkillGraph.js`：`computeRelations(currentSlug, skills)` 函数，实现综合评分算法（手动声明权重3、同category权重1、标签重叠×0.5、场景重叠×0.5），返回关联边列表
- [ ] 5.3 新建 `src/components/SkillGraphView.vue`：SVG 力导向布局渲染，简化迭代式算法（节点排斥+边吸引），节点显示 skill 名称，边表示关联
- [ ] 5.4 实现图谱交互：鼠标拖拽节点、悬停 tooltip 显示 skill 名称和关联分数、点击节点导航到 skill 详情页
- [ ] 5.5 修改 `SkillDetailView.vue`：新增"关联图谱"区域，当存在关联 skill 时显示 SkillGraphView 组件
- [ ] 5.6 测试：验证关联发现算法、图谱渲染、交互功能

## 6. P5 — URL 状态同步

- [ ] 6.1 新建 `src/composables/useURLSync.js`：`syncToURL(state)` 函数将筛选状态写入 `location.hash` 查询参数，`readFromURL()` 函数从 URL 解析筛选状态，`onPopState` 监听器
- [ ] 6.2 修改 `HomeView.vue`：mount 时调用 `readFromURL()` 恢复筛选状态；筛选状态变化时调用 `syncToURL()` 更新 URL；注册 `popstate` 事件监听
- [ ] 6.3 实现 URL 参数编码/解码：中文和特殊字符使用 `encodeURIComponent`/`decodeURIComponent`
- [ ] 6.4 测试：验证 URL 同步、浏览器前进/后退、分享链接恢复筛选状态

## 7. P6 — PWA 离线支持

- [ ] 7.1 安装 `vite-plugin-pwa` 依赖：`npm install -D vite-plugin-pwa`
- [ ] 7.2 修改 `vite.config.js`：引入 `VitePWA` 插件，配置缓存策略（index.html/index.json: StaleWhileRevalidate, .md: CacheFirst, 静态资源: CacheFirst 30天）
- [ ] 7.3 配置 manifest：应用名称 "Skill Book"、standalone 显示模式、192px 和 512px 图标、主题色和背景色
- [ ] 7.4 在 `src/main.js` 或 `App.vue` 中注册 Service Worker（仅生产环境）
- [ ] 7.5 实现缓存更新通知：检测到新版本时在页面底部显示提示条，点击刷新
- [ ] 7.6 准备应用图标：生成 192px 和 512px PNG 图标放入 `public/` 目录
- [ ] 7.7 测试：验证离线访问、缓存更新、添加到主屏幕

## 8. P7 — Dark Mode 完善

- [ ] 8.1 新建 `src/composables/useSettings.js`：`theme` ref（`'light'|'dark'|'system'`，默认 `'system'`），localStorage key `skill-book-settings` 持久化，`effectiveTheme` computed（根据 system 偏好解析实际主题），`prefersColorScheme` 媒体查询监听
- [ ] 8.2 修改 `tokens.css`：将 `@media (prefers-color-scheme: dark)` 中的变量定义复制到 `[data-theme="dark"]` 选择器下，确保手动切换和系统偏好都能生效
- [ ] 8.3 在 `App.vue` 中集成 `useSettings`：watch `effectiveTheme` 变化，更新 `<html>` 元素的 `data-theme` 属性
- [ ] 8.4 新建 `src/components/ThemeToggle.vue`：主题切换控件，支持浅色/深色/跟随系统三个选项
- [ ] 8.5 在 `SubNav.vue` 或 `GlobalNav.vue` 中放置 ThemeToggle 组件
- [ ] 8.6 逐组件替换硬编码颜色为 CSS 变量引用：扫描所有 `.vue` 文件中的硬编码颜色值（`#faf9f6`、`#0a0a0a`、`#c4553a`、`#8a8a87`、`#6b6560` 等），替换为对应的 CSS 自定义属性
- [ ] 8.7 在 `tokens.css` 中新增热力图颜色变量（浅色和深色主题分别定义）
- [ ] 8.8 测试：验证手动切换主题、跟随系统、刷新持久化、所有组件颜色正确

## 9. SkillFormModal 编辑模式重构

- [ ] 9.1 修改 `SkillFormModal.vue`：激活编辑模式，当 `skill` prop 传入时预填充所有字段（name、slug、category、tags、description、install、source、scenarios、commands、related）
- [ ] 9.2 编辑模式下 slug 字段设为只读
- [ ] 9.3 新增 scenarios 编辑区域：标签输入，支持添加/删除场景标签
- [ ] 9.4 新增 commands 编辑区域：命令列表，每条包含 name 和 cmd 输入框，支持添加/删除命令条目
- [ ] 9.5 新增 related 编辑区域：从已有 skill 列表中选择关联 skill（多选下拉或标签选择器）
- [ ] 9.6 修改 `SkillDetailView.vue`：移除内联编辑器（isEditing 状态、edit textarea、preview 分栏），"编辑"按钮改为打开 SkillFormModal
- [ ] 9.7 修改 `HomeView.vue`：支持从详情页打开 SkillFormModal 编辑模式（通过事件或路由参数传递 skill 数据）
- [ ] 9.8 测试：验证编辑模式预填充、字段修改保存、详情页编辑按钮行为
