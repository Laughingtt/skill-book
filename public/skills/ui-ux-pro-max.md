---
slug: ui-ux-pro-max
name: UI/UX Pro Max
category: UI/UX设计与前端美化
tags: [design, ui, ux, palette, banner, presentation, chartjs]
description: 内置161种产品类型对应的专业调色板和设计策略，支持banner设计和HTML演示文稿
install: "npx skills add nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max"
source: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill"
---

# UI/UX Pro Max

## 简介

UI/UX Pro Max 是一款专业级 AI 设计智能技能，为 AI 编程助手提供可搜索、精心策划的 UI/UX 设计知识库。该技能内置 **161 种产品类型推理规则**、**67 种 UI 风格**、**161 种行业配色方案**、**57 种字体搭配**、**99 条 UX 指南** 以及 **25 种图表类型**，覆盖 15 种主流技术栈。

v2.0 的旗舰功能是 **设计系统生成器（Design System Generator）**——一个 AI 驱动的推理引擎，能够分析项目需求并在数秒内生成完整的定制化设计系统。

## 核心功能

### 设计资源库

| 资源类型 | 数量 | 说明 |
|---------|------|------|
| UI 风格 | 67 种 | Glassmorphism、Claymorphism、Minimalism、Brutalism、Neumorphism、Bento Grid、Dark Mode、AI-Native UI 等 |
| 配色方案 | 161 种 | 与产品类型 1:1 对应的行业专属配色 |
| 字体搭配 | 57 种 | 精选 Google Fonts 组合，含导入代码 |
| 图表类型 | 25 种 | 仪表盘和数据分析场景推荐 |
| UX 指南 | 99 条 | 最佳实践、反模式、可访问性规则 |
| 推理规则 | 161 条 | 行业专属设计系统生成逻辑 |

### 支持的技术栈

| 分类 | 技术栈 |
|------|--------|
| Web (HTML) | HTML + Tailwind（默认） |
| React 生态 | React、Next.js、shadcn/ui |
| Vue 生态 | Vue、Nuxt.js、Nuxt UI |
| Angular | Angular |
| PHP | Laravel（Blade、Livewire、Inertia.js） |
| 其他 Web | Svelte、Astro |
| iOS | SwiftUI |
| Android | Jetpack Compose |
| 跨平台 | React Native、Flutter |

## 安装与使用

### 前置要求

Python 3.x 是搜索脚本的运行依赖。

```bash
# 检查 Python 是否已安装
python3 --version

# macOS
brew install python3

# Ubuntu/Debian
sudo apt update && sudo apt install python3

# Windows
winget install Python.Python.3
```

### 安装方式

```bash
# 通过 Claude Code 技能管理器安装
npx skills add nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max

# 或使用 x-cmd 安装
x skill add --skill-dir .claude/skills nextlevelbuilder/ui-ux-pro-max-skill
```

### 技能模式（自动激活）

支持平台：Claude Code、Cursor、Windsurf、Codex CLI、Continue、Gemini CLI、OpenCode、Qoder、Warp、Augment 等。

技能会在你请求 UI/UX 工作时自动激活，只需自然对话：

```
为我的 SaaS 产品构建落地页
```

## 设计系统构建

### 设计系统生成器

v2.0 核心功能，通过多域搜索生成完整设计系统：

```
┌─────────────────────────────────────────────────────────────────┐
│  MULTI-DOMAIN SEARCH (5 parallel searches)                      │
│  • 产品类型匹配 (161 categories)                                  │
│  • 风格推荐 (67 styles)                                          │
│  • 配色方案选择 (161 palettes)                                    │
│  • 落地页模式 (24 patterns)                                       │
│  • 字体搭配 (57 font combinations)                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  REASONING ENGINE                                               │
│  • 匹配产品 → UI 类别规则                                         │
│  • 应用风格优先级 (BM25 排序)                                     │
│  • 过滤行业反模式                                                 │
│  • 处理决策规则 (JSON 条件)                                       │
└─────────────────────────────────────────────────────────────────┘
```

### 命令行使用

```bash
# 生成设计系统
python3 skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]

# 持久化设计系统
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"

# 指定页面类型
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "dashboard"

# 按技术栈查询
python3 skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack react-native

# 按领域查询
python3 skills/ui-ux-pro-max/scripts/search.py "minimalism dark mode" --domain style
python3 skills/ui-ux-pro-max/scripts/search.py "search loading animation" --domain ux
```

## 配色方案匹配

### 工作流程

```
输入："为 SaaS 数据分析平台优化配色"
    ↓
AI 匹配产品类型：Data Analytics SaaS
    ↓
推荐调色板：深蓝 #1e293b, 靛蓝 #6366f1, 翡翠绿 #10b981
    ↓
应用到界面组件
```

### 配色原则

1. **核心色彩**：保持 2-4 种主色，确保视觉一致性
2. **色彩和谐**：遵循色彩理论，避免随机配色破坏设计流畅性
3. **可访问性**：确保对比度符合 WCAG 标准
4. **品牌一致性**：配色需传达品牌调性与目标用户需求

## 组件设计模式

### 优先级规则分类

| 优先级 | 类别 | 说明 |
|--------|------|------|
| P1 | 可访问性 (Accessibility) | WCAG 合规、屏幕阅读器支持、键盘导航 |
| P2 | 响应式 (Responsive) | 移动优先、断点策略、触控友好 |
| P3 | 性能 (Performance) | 图片优化、懒加载、代码分割 |
| P4 | 风格选择 (Style Selection) | 风格匹配、一致性、深色模式适配 |
| P5 | 布局响应 (Layout & Responsive) | 网格系统、弹性布局、间距规范 |

### 组件设计检查清单

- [ ] 状态清晰（hover、active、disabled、focus）
- [ ] 图标风格一致
- [ ] 主操作按钮突出
- [ ] 表单控件符合系统规范
- [ ] 加载状态有明确反馈
- [ ] 错误状态有清晰提示

## 响应式设计策略

### 断点系统

```css
/* 移动优先断点 */
/* Mobile: < 640px (默认) */
/* Tablet: >= 640px (sm) */
/* Desktop: >= 1024px (lg) */
/* Large Desktop: >= 1280px (xl) */
```

### 响应式原则

1. **移动优先**：从最小屏幕开始设计，逐步增强
2. **触控友好**：触控目标至少 44x44px
3. **弹性布局**：使用 Flexbox 和 Grid 实现自适应
4. **图片响应式**：使用 srcset 和懒加载
5. **字体缩放**：使用 clamp() 实现流体排版

## 可访问性指南

### WCAG 核心要求

| 级别 | 对比度要求 | 适用场景 |
|------|-----------|---------|
| AA | 4.5:1（普通文本） | 最低合规标准 |
| AA | 3:1（大文本） | 标题、重要信息 |
| AAA | 7:1（普通文本） | 增强可访问性 |
| AAA | 4.5:1（大文本） | 高对比度需求 |

### 可访问性检查清单

- [ ] 所有图片有替代文本
- [ ] 表单字段有关联标签
- [ ] 键盘可完全导航
- [ ] 焦点状态可见
- [ ] 颜色不作为唯一信息传达方式
- [ ] 动画可暂停/关闭
- [ ] 屏幕阅读器测试通过

## 最佳实践

### 设计系统命名规范

```css
/* 推荐：语义化命名 */
--color-primary
--color-secondary
--color-surface
--color-text-primary
--spacing-md
--radius-lg

/* 避免：具体值命名 */
--color-blue-500
--spacing-16px
```

### 性能优化建议

1. **图片优化**：使用 WebP/AVIF 格式，适当尺寸
2. **字体加载**：使用 font-display: swap，预加载关键字体
3. **CSS 优化**：关键 CSS 内联，非关键样式延迟加载
4. **JavaScript**：代码分割，第三方脚本异步加载
5. **渲染优化**：减少重排，使用 transform/opacity 动画

### UX 反模式避免

- 避免过度使用模态框
- 避免隐藏关键操作
- 避免不一致的交互模式
- 避免忽略加载状态
- 避免无意义的动画

## 使用场景

### 适用场景

- 已有设计需要专业级打磨
- 从零构建产品界面
- Banner 和营销页面设计
- HTML 演示文稿制作（含 Chart.js 图表）
- 产品配色方案匹配
- 设计系统搭建
- 响应式布局优化
- 可访问性合规检查

### 示例用法

#### 落地页设计

```
输入："为 AI 写作助手 SaaS 设计落地页，风格现代简约"
→ AI 匹配产品类型：AI Writing SaaS
→ 推荐风格：Minimalism + Dark Mode
→ 生成完整落地页代码
```

#### Banner 设计

```
输入："为黑色星期五活动设计 Banner"
→ AI 生成专业 Banner HTML
→ 包含响应式布局和动效
→ 配色方案自动匹配电商促销场景
```

#### 仪表盘设计

```
输入："为金融科技平台设计数据分析仪表盘"
→ AI 匹配产品类型：Fintech Dashboard
→ 推荐图表类型：折线图、K线图、饼图
→ 生成 Chart.js 配置代码
```

## 常见问题

### Q: 如何选择合适的 UI 风格？

A: 技能会根据产品类型自动推荐最佳风格。你也可以指定偏好：
```
"使用 Glassmorphism 风格设计用户卡片"
```

### Q: 支持深色模式吗？

A: 完全支持。技能包含深色模式配色规则，会自动生成亮/暗两套方案。

### Q: 如何确保设计符合品牌调性？

A: 在提示中描述品牌特征，技能会匹配相应的配色和风格：
```
"为高端奢侈品电商设计，品牌调性优雅奢华"
```

### Q: 生成的代码可以直接使用吗？

A: 是的，生成的代码是生产就绪的，包含完整的样式和交互逻辑。

### Q: 如何更新到最新版本？

```bash
# 查看可用版本
npx skills list nextlevelbuilder/ui-ux-pro-max-skill

# 更新到最新版
npx skills update nextlevelbuilder/ui-ux-pro-max-skill
```

## 相关资源

- [GitHub 仓库](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [在线演示](https://ui-ux-pro-max-skill.nextlevelbuilder.io)
- [Smithery 技能页面](https://smithery.ai/skills/nextlevelbuilder/ui-ux-pro-max)
