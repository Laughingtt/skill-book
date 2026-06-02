# Skill Book V2 — 个人Skill管理闭环设计

> 日期: 2026-06-03
> 状态: Draft
> 范囲: 四个功能域，纯静态架构优先

## 背景与问题

Skill Book V1是一个skill目录浏览工具：用户可以搜索、筛选、阅读skill详情。核心断裂在于：

- **用户发现了skill但没持续用**——从"知道"到"真正用起来"全链路断裂
- 目标用户是AI新手/学习者，以个人使用为主
- 当前缺少"我的"概念、缺少使用引导、缺少进度反馈

V2的目标：构建 **发现 → 收藏 → 使用 → 追踪** 的完整闭环，让skill从"可阅读的目录"变成"可使用的个人工具库"。

## 技术约束

- **纯静态部署**：所有用户数据存localStorage，无后端依赖
- **向后兼容**：新增frontmatter字段均为可选，旧skill文件不受影响
- **架构预留**：composable设计上预留后端升级接口，未来可切换到云同步
- **现有架构延续**：composable单例模式、skill .md + index.json数据管线、Vite dev API

---

## 功能域 1：收藏与整理体系

### 目标
让用户拥有"我的skill库"，不再是纯浏览。一进应用就看到最相关的skill。

### 数据模型

```js
// localStorage keys
skill-book-bookmarks       // string[] — 收藏的skill slug列表
skill-book-skill-status    // { [slug]: 'todo' | 'learning' | 'mastered' }
skill-book-skill-notes     // { [slug]: string } — 每个skill的个人笔记（markdown）
skill-book-usage-stats     // { [slug]: { views: number, lastViewedAt: string } }
```

### 新增composable

**`useBookmarks.js`**
- `bookmarks`: `ref<string[]>` — 收藏的slug列表
- `isBookmarked(slug)`: `computed` — 判断是否已收藏
- `toggleBookmark(slug)`: 切换收藏状态
- 从localStorage读取/写入

**`useSkillStatus.js`**
- `statuses`: `ref<{[slug]: string}>` — 所有skill的状态
- `getStatus(slug)`: 获取单个状态
- `setStatus(slug, status)`: 设置状态（todo/learning/mastered）
- `statusStats`: `computed` — 各状态数量统计

**`useSkillNotes.js`**
- `getNote(slug)`: 获取笔记
- `saveNote(slug, content)`: 保存笔记
- `hasNote(slug)`: 是否有笔记

**`useUsageTracker.js`**
- `trackView(slug)`: 记录一次查看（递增views，更新lastViewedAt）
- `getViewCount(slug)`: 获取查看次数
- `getLastViewed(slug)`: 获取最后查看时间
- `recentlyViewed`: `computed` — 最近查看的skill列表（按lastViewedAt排序，取前5）
- `staleLearning`: `computed` — 标记为learning且7天未查看的skill

### UI变更

1. **首页 — "我的收藏"快捷区**
   - Hero区下方，横向滚动的skill卡片
   - 显示已收藏的skill，点击跳转详情
   - 无收藏时显示引导文案"收藏常用skill，快速访问"

2. **首页 — 进度统计卡片**
   - 显示"已掌握 X / 学习中 Y / 待尝试 Z / 总计 N"
   - 带进度条可视化

3. **首页 — "该复习了"区块**
   - 标记为learning且7天未查看的skill
   - 无过期skill时隐藏此区块

4. **首页 — "最近查看"区块**
   - 最近5个浏览过的skill卡片
   - 无浏览记录时隐藏

5. **SkillCard — 收藏按钮**
   - 右上角心形图标，toggle交互
   - 已收藏时实心+主题色

6. **SkillDetailView — 状态选择器**
   - 顶部标题下方，三个状态徽章（待尝试/学习中/已掌握）
   - 当前状态高亮，点击切换

7. **SkillDetailView — "我的笔记"区块**
   - 详情内容下方，可折叠编辑区
   - textarea输入，markdown预览

---

## 功能域 2：更好发现与分析

### 目标
让新手能按场景找到skill，知道什么时候该用什么。

### 数据模型扩展

skill frontmatter新增可选字段：

```yaml
scenarios: [debugging, code-review, deployment]  # 使用场景标签
commands:                                          # 常用命令模板
  - name: "安装skill"
    cmd: "npx skills add my-skill"
  - name: "在Claude Code中使用"
    cmd: "/my-skill"
```

向后兼容——旧skill文件缺少这些字段时，相关UI区块不显示。

### 新增composable

**`useScenarios.js`**
- `allScenarios`: `computed` — 从所有skill中提取去重的scenarios列表
- `selectedScenario`: `ref<string|null>` — 当前选中的场景
- `filterByScenario(skills)`: 根据选中场景筛选skill列表

### UI变更

1. **Sidebar — 场景筛选**
   - Category筛选下方新增"使用场景"区块
   - 列出所有scenarios标签，点击筛选
   - 选中时与category/tag筛选联动（AND逻辑）

2. **SkillDetailView — "何时使用"区块**
   - 详情内容中，如果skill有scenarios字段，显示场景标签
   - 每个场景标签可点击跳转到该场景的筛选结果

3. **SkillDetailView — 相关推荐**
   - 详情页底部，显示同category+同tag的3-5个其他skill
   - 排除当前skill自身

4. **命令复制按钮**
   - SkillDetailView中install字段旁边加复制按钮
   - 点击复制到剪贴板，显示✓反馈，2秒后恢复

---

## 功能域 3：快速使用与集成

### 目标
让skill从"可阅读"变成"可直接用"，减少从发现到使用的摩擦。

### 功能

1. **命令卡片**
   - 如果skill有`commands`字段，在详情页以命令卡片形式展示
   - 每条命令显示名称+命令内容，带一键复制按钮
   - 视觉上区别于普通代码块（带主题色左边框）

2. **代码块复制增强**
   - MarkdownRenderer中所有`<pre>`代码块加复制按钮（右上角）
   - 使用Clipboard API，复制后按钮变✓，2秒后恢复
   - 不影响现有markdown渲染性能

3. **Quick Start**
   - skill详情页hero区下方新增折叠式"快速开始"区块
   - 内容优先取frontmatter的`quickstart`字段
   - 如无quickstart，从install字段自动生成简易指引

---

## 功能域 4：使用追踪与反馈

### 目标
让用户看到自己的学习进度，形成持续使用的动力。

### 功能

1. **查看统计**（已在useUsageTracker中定义）
   - 自动记录每次打开skill详情的时间（trackView在SkillDetailView的onMounted中调用）
   - 数据存localStorage的`skill-book-usage-stats`

2. **进度总览**（已在首页进度统计卡片中定义）
   - 首页显示各状态数量和进度条
   - 基于useSkillStatus的statusStats computed

3. **复习提醒**（已在首页"该复习了"区块中定义）
   - useUsageTracker的staleLearning computed提供数据
   - 7天未查看的"学习中"skill显示提醒

4. **最近活跃**
   - 首页显示最近7天浏览过的skill列表
   - 基于useUsageTracker的recentlyViewed computed

---

## 实现优先级

分三个阶段交付：

### Phase 1 — "我的Skill库"基础
- useBookmarks + 收藏按钮 + "我的收藏"区块
- useSkillStatus + 状态选择器 + 进度统计卡片
- useUsageTracker + trackView + 最近查看区块
- 命令复制按钮 + 代码块复制增强

### Phase 2 — 场景化发现
- frontmatter扩展（scenarios/commands字段）
- useScenarios + 场景筛选sidebar
- "何时使用"区块 + 相关推荐
- 命令卡片 + Quick Start

### Phase 3 — 学习闭环
- useSkillNotes + "我的笔记"编辑区
- 复习提醒区块
- 数据导出/导入（JSON格式，方便备份和迁移）

---

## 新增skill .md模板

```yaml
---
slug: my-skill
name: My Skill
category: Category Name
tags: [tag1, tag2]
scenarios: [debugging, code-review]
description: Short description
install: "npx skills add my-skill"
source: "https://..."
commands:
  - name: "安装"
    cmd: "npx skills add my-skill"
  - name: "使用"
    cmd: "/my-skill"
quickstart: |
  1. 安装: `npx skills add my-skill`
  2. 在对话中输入 `/my-skill` 开始使用
---

# My Skill

详细说明内容...
```

## 架构影响

- **无破坏性变更**：所有新字段可选，旧skill文件无需修改
- **新增4个composable**：与现有useSkills/useSearch/useFilters同层
- **localStorage新增4个key**：与现有`skill-book-skills`隔离
- **build-skills.js**：需扩展以提取`scenarios`和`commands`字段到index.json（commands只提取cmd字符串数组用于搜索索引，完整对象在详情页从.md解析）
- **frontmatter.js**：需扩展以解析`commands`（YAML对象数组 `[{name, cmd}]`）和`quickstart`（多行字符串 `|` 语法）。当前解析器只处理单行key:value和内联数组`[a,b,c]`，需要增加：①多行值（`|` 后缩进块）②对象数组（`- name: x\n  cmd: y`格式）

### 筛选管线集成

当前管线: `skills → useSearch → useFilters → displayedSkills`

扩展后: `skills → useSearch → useFilters → useScenarios.filterByScenario() → displayedSkills`

`useScenarios`接收`useFilters.filtered`的输出作为输入，返回场景筛选后的结果。这样场景筛选与category/tag筛选形成AND逻辑，且不侵入现有composable。

### useUsageTracker与useSkills的协作

`recentlyViewed`和`staleLearning`返回的是slug+stats数据，需要与`useSkills.skills`关联获取完整skill对象。方案：`useUsageTracker`提供slug列表和排序信息，UI层通过`useSkills.getSkillBySlug(slug)`获取完整对象。composable之间不直接依赖，保持与现有架构一致。
