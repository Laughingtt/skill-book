## Why

Skill Book 当前已具备浏览、搜索、学习追踪等基础功能，但在"查 skill"和"用 skill"两个核心场景上存在明显缺口：场景筛选因数据缺失形同虚设；执行命令需多次跳转；学过的 skill 缺乏复习节奏；缺乏全局视角了解自己的使用模式；skill 之间没有关联发现机制。同时存在若干已实现但损坏或未完成的功能（数据导入丢数据、Dark Mode 半成品、排序缺失等）。本次变更旨在系统性地补齐这些缺口，让 Skill Book 从"能看"升级为"好用"。

## What Changes

### 🔴 P0 — 修复已有但坏掉的功能

- **修复场景筛选数据缺失**：`index.json` 构建脚本未包含 `scenarios`、`commands`、`quickstart` 字段，导致首页场景过滤器永远为空。修复 `build-skills.js` 和 `vite-plugin-skill-api.js` 使其输出完整字段。
- **修复数据导入不完整**：`DataPanel.vue` 的 `importData()` 未恢复 `usageStats` 和 `userSkills`，导致导出再导入丢数据。
- **修复 SkillFormModal 编辑模式死代码**：编辑模式已接线但从未被触发，清理或激活。

### 🟠 P1 — 命令速查面板 (Command Palette)

- 新增全局命令速查面板，`⌘K` / `Ctrl+K` 快捷键唤起。
- 聚合所有 skill 的 `commands`，支持模糊搜索命令名和命令内容。
- 一键复制命令到剪贴板，显示所属 skill 名称。
- 从任何页面均可唤起，无需跳转到详情页。

### 🟡 P2 — 间隔复习系统 (Spaced Repetition)

- 基于现有 `useSkillStatus` 和 `useUsageTracker` 数据，新增间隔复习调度。
- 采用简化艾宾浩斯曲线：学习后 1天→3天→7天→14天→30天 提醒复习。
- My Space 页面新增"今日复习"区域，展示到期需复习的 skill。
- 复习操作：标记"已复习"重置间隔，或调整状态（learning→mastered）。

### 🟢 P3 — 使用统计与热力图

- 新增 `useStats` composable，聚合 `useUsageTracker` 数据生成日维度统计。
- My Space 页面新增 GitHub 风格贡献热力图，展示每日查看 skill 的活跃度。
- 新增排序功能：按名称、查看频率、最近查看、状态排序 skill 列表。

### 🔵 P4 — Skill 关系图谱

- 在 skill frontmatter 中新增可选 `related` 字段（手动声明关联 skill slug 列表）。
- 改进现有 Related Skills 算法：结合手动声明 + 分类/标签重叠 + 场景重叠综合评分。
- Skill 详情页新增可视化关系图（SVG 力导向布局），展示 skill 间的关联。

### 🟣 P5 — URL 状态同步

- 将筛选状态（分类、标签、场景、搜索词）同步到 URL hash 参数。
- 支持通过 URL 分享筛选结果，浏览器前进/后退有效。
- 首次加载时从 URL 恢复筛选状态。

### ⚪ P6 — PWA 离线支持

- 添加 Service Worker 缓存策略，使应用可离线访问。
- 添加 `manifest.json`，支持添加到主屏幕。
- 缓存 `index.json` 和已访问的 `.md` 文件。

### ⚫ P7 — Dark Mode 完善

- 将组件中硬编码的颜色值替换为 CSS 自定义属性引用。
- 新增手动切换 Dark/Light 模式的开关（不依赖系统偏好）。
- 在 `useSettings` composable 中持久化主题偏好。

## Capabilities

### New Capabilities

- `command-palette`: 全局命令速查面板 — 聚合搜索所有 skill 命令，快捷键唤起，一键复制
- `spaced-repetition`: 间隔复习调度 — 基于艾宾浩斯曲线的复习提醒与进度追踪
- `usage-heatmap`: 使用统计热力图 — 日维度活跃度可视化与排序功能
- `skill-graph`: Skill 关系图谱 — 手动关联声明 + 自动关联发现 + 可视化展示
- `url-state-sync`: URL 状态同步 — 筛选状态与 URL 双向绑定，支持分享与导航
- `pwa-offline`: PWA 离线支持 — Service Worker 缓存与安装清单
- `dark-mode-toggle`: Dark Mode 完善 — CSS 变量化 + 手动切换 + 偏好持久化

### Modified Capabilities

- `skill-data-model`: 扩展 frontmatter schema 新增 `related` 字段；修复 `index.json` 构建脚本输出 `scenarios`/`commands`/`quickstart`
- `data-import-export`: 修复导入逻辑，完整恢复 `usageStats` 和 `userSkills`
- `skill-form`: 清理 SkillFormModal 编辑模式死代码，或激活为可用功能

## Impact

- **构建脚本**：`scripts/build-skills.js` 和 `scripts/vite-plugin-skill-api.js` 需修改以输出完整字段
- **数据模型**：skill frontmatter 新增 `related` 字段，`index.json` schema 扩展
- **新增 composables**：`useCommandPalette`、`useSpacedRepetition`、`useStats`、`useSettings`
- **修改 composables**：`useScenarios`（数据源修复后自动生效）、`useUsageTracker`（为热力图提供日维度数据）
- **修改组件**：`DataPanel.vue`（修复导入）、`SkillFormModal.vue`（清理/激活编辑模式）、所有组件（CSS 变量化）
- **新增组件**：`CommandPalette.vue`、`UsageHeatmap.vue`、`SkillGraphView.vue`、`ThemeToggle.vue`
- **修改视图**：`MySpaceView.vue`（新增复习区、热力图）、`HomeView.vue`（排序、URL 同步）、`SkillDetailView.vue`（关系图、related 字段）
- **新增文件**：`public/manifest.json`、`public/sw.js`（Service Worker）
- **依赖**：可能新增轻量 SVG 力导向图库（如 d3-force 或纯手写简单布局）
- **无破坏性变更**：所有修改向后兼容，`related` 字段为可选
