---
slug: awesome-design-md
name: Awesome Design MD / Design MD Collection
category: UI/UX设计与前端美化
tags: [design, style-guide, brand, apple, stripe, vercel, design-system]
description: 收集顶级网站的DESIGN.md设计规范文件，58+品牌风格，每个附带可视化预览HTML
install: "git clone 仓库，复制 DESIGN.md 到项目根目录（无需安装）"
source: "https://github.com/VoltAgent/awesome-design-md"
---

# Awesome Design MD / Design MD Collection（设计规范库）

## 简介

Awesome Design MD 是由 VoltAgent 维护的开源项目，GitHub 星标超过 86k，全球排名前 150。它收集了 58+ 顶级网站的设计系统文档，以纯文本 Markdown 格式呈现，让 AI 编码代理能够生成视觉一致、媲美大厂的高质量 UI。

### 什么是 DESIGN.md？

DESIGN.md 是由 Google Stitch 首次引入的概念——一种纯文本设计系统文档，AI 代理可以直接读取并据此生成一致的 UI。它本质上就是一份 Markdown 文件，不需要 Figma 导出、不需要 JSON Schema、不需要任何特殊工具。只需将它放入项目根目录，任何 AI 编码代理（Claude Code、Cursor、Windsurf 等）或 Google Stitch 都能立即理解你的 UI 应有的外观和感受。

Markdown 是 LLM 最擅长阅读的格式，因此无需额外解析或配置。

### 为什么需要 DESIGN.md？

每个 AI 编码会话都是从零开始的。Claude Code、Cursor、Copilot——它们都不会记住你昨天的品牌色。你可以反复输入"匹配现有风格"，但模型仍然会从上下文中推断规则，而且推断错误的概率远高于正确。一位开发者在 Reddit 上这样描述："你要求生成一个现代仪表盘，每次拿到的都是一模一样的默认 Tailwind 蓝色。"DESIGN.md 的出现正是为了解决这个问题——用一个文件让 AI 代理从"猜测"变为"确知"。

### DESIGN.md 与其他项目文件的关系

| 文件 | 读者 | 定义内容 |
|------|------|----------|
| `AGENTS.md` | 编码代理 | 项目如何构建 |
| `DESIGN.md` | 设计代理 | 项目应该看起来怎样、感觉如何 |
| `CLAUDE.md` | Claude Code | 持久化上下文与项目约定 |
| `SKILL.md` | 技能代理 | 任务执行的工作流程 |

三者配合使用，可以让 AI 代理同时理解项目的工程逻辑、视觉规范和任务流程。

## 核心功能

### 1. 真实品牌设计系统的深度还原

每个 DESIGN.md 文件都不是简单的颜色和字体列表，而是包含完整的设计深度——分析过的模式、设计令牌（Tokens）和规则，用于高质量 UI 生成，而非表面的样式输出。这些文件基于公开可见的 CSS 值提取，项目不声称拥有任何网站的视觉标识所有权。

### 2. 双层文件结构

遵循 Google Stitch 开源规范（Apache-2.0 许可），每个 DESIGN.md 文件包含两层：

- **YAML 前置元数据（Tokens 层）**：机器可读的设计令牌——精确的十六进制色值、字体大小、间距值、圆角半径和组件样式。Token 是规范性值，供代理直接执行。编码代理不需要知道 primary 是"温暖的金毛猎犬橙色"，它只需要一个十六进制值如 `#855300`——精确、无歧义、可直接执行。
- **Markdown 正文（Prose 层）**：人类可读的设计原理说明——解释这些值为什么存在以及如何应用。用于在 Token 未覆盖的边缘情况下指导判断。例如"品牌个性是乐观、可信、活跃"或"永远不要拥挤元素"这类指令无法被令牌化，但可以引导代理做出符合系统的设计决策。

```
---
# YAML 前置元数据 —— 设计令牌（机器可读）
colors:
  primary: "#1a3a52"
  background: "#f7f3ec"
typography:
  headline:
    fontFamily: "Inter"
    fontSize: 48
    fontWeight: 700
spacing:
  scale: [4, 8, 16, 24, 32]
---

## Overview         <- Markdown 正文 —— 设计原理（人类可读）
## Colors
## Typography
## Layout
## Elevation & Depth
## Shapes
## Components
## Do's and Don'ts
```

### 3. 完整的九大设计规范章节

每个 DESIGN.md 文件遵循 Stitch DESIGN.md 格式，包含以下扩展章节：

| 序号 | 章节 | 捕获内容 |
|------|------|----------|
| 1 | Visual Theme & Atmosphere | 氛围、密度、设计哲学 |
| 2 | Color Palette & Roles | 语义名称 + 十六进制 + 功能角色 |
| 3 | Typography Rules | 字体族、完整层级表 |
| 4 | Component Stylings | 按钮、卡片、输入框、导航及各种状态 |
| 5 | Layout Principles | 间距刻度、网格、留白哲学 |
| 6 | Depth & Elevation | 阴影系统、表面层级 |
| 7 | Do's and Don'ts | 设计护栏与反模式 |
| 8 | Responsive Behavior | 断点、触控目标、折叠策略 |
| 9 | Agent Prompt Guide | 快速色彩参考、即用提示词 |

### 4. 可视化预览

每个品牌目录包含三个文件：

| 文件 | 用途 |
|------|------|
| `DESIGN.md` | 设计系统（代理读取的内容） |
| `preview.html` | 可视化目录——色板、字体层级、按钮、卡片等 |
| `preview-dark.html` | 暗色模式下的同一可视化目录 |

### 5. 丰富的品牌集合

涵盖多个分类的 58+ 品牌设计系统：

- **AI & LLM 平台**：Claude/Anthropic（温暖赤陶色调与编辑式布局）、OpenAI 等
- **开发者工具 & IDE**：Vercel（黑白精准 + Geist 字体）、Linear（极简紫色点缀）、Supabase 等
- **后端、数据库 & DevOps**：Stripe（标志性紫色渐变与优雅排版）等
- **生产力 & SaaS**：Notion（教育内容风格）、Airtable 等
- **设计 & 创意工具**：Figma、Canva 等
- **金融科技 & 加密货币**：Coinbase 等
- **电商 & 零售**：Airbnb（温暖珊瑚色与圆润 UI 元素）、Shopify 等
- **媒体 & 消费科技**：Spotify、Netflix 等
- **汽车**：Tesla 等
- **复古 Web**：怀旧系列——从 90 年代网站提取的 DESIGN.md，让 AI 代理构建时代准确的复古 UI

## 安装与使用

### 前置条件

无需安装任何依赖包，不需要 npm、pip 或其他包管理器。只需 Git 和一个文本编辑器。

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/VoltAgent/awesome-design-md.git

# 进入目录
cd awesome-design-md

# 查看可用品牌
ls design-md/
```

### 快速开始

```bash
# 第一步：选择一个品牌风格（以 Vercel 为例）
# 在浏览器中打开 preview.html 查看视觉效果
open design-md/vercel/preview.html

# 第二步：复制 DESIGN.md 到你的项目根目录
cp design-md/vercel/DESIGN.md /your-project/DESIGN.md

# 第三步：告诉 AI 代理参考该文件
```

### 使用 curl 获取单个文件

如果你只需要某一个品牌的 DESIGN.md，无需克隆整个仓库：

```bash
# 直接下载特定品牌的 DESIGN.md
curl -o DESIGN.md https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/stripe/DESIGN.md
```

## 使用方法与示例

### 基础用法：让 AI 代理使用设计规范

将 DESIGN.md 放入项目根目录后，在提示 AI 时明确引用该文件：

```
请参考项目根目录的 DESIGN.md，
按照其中的设计规范来构建这个界面
```

### 精确用法：指定具体设计细节

```
我已在根目录提供了 DESIGN.md，请按照其中的色彩语义（Color Semantic）
和排版惯例，重构目前的侧边栏组件，
确保渐变效果与文档描述一致
```

### 在 CLAUDE.md 中集成

为了让 Claude Code 在每个会话自动加载设计规范，在项目的 `CLAUDE.md` 中添加引用：

```markdown
# CLAUDE.md

## Design System

本项目使用 DESIGN.md 作为设计系统参考。
所有 UI 生成必须遵循 DESIGN.md 中定义的令牌和规则。
```

### 与不同 AI 工具配合

| 工具 | 使用方式 |
|------|----------|
| Claude Code | 将 DESIGN.md 放入项目根目录，在 CLAUDE.md 中引用 |
| Cursor | 将 DESIGN.md 放入项目根目录，在提示中用 `@DESIGN.md` 引用 |
| Windsurf | 将 DESIGN.md 放入项目根目录，代理自动读取 |
| Google Stitch | 直接导入 DESIGN.md 文件 |
| Lovable / Bolt | 上传 DESIGN.md 到项目上下文 |

### 使用 Google Stitch CLI 集成

Google Labs 提供了官方 CLI 工具 `@google/design.md`，支持验证、对比和导出操作：

```bash
# 验证 DESIGN.md 文件的结构正确性
npx @google/design.md lint DESIGN.md

# 对比两个版本的令牌级差异（检测回归）
npx @google/design.md diff DESIGN.md DESIGN-v2.md

# 导出为 Tailwind 主题配置
npx @google/design.md export --format tailwind DESIGN.md

# 导出为 W3C DTCG tokens.json 格式
npx @google/design.md export --format dtcg DESIGN.md

# 输出完整格式规范（用于注入代理提示上下文）
npx @google/design.md spec
```

注意：Windows 用户在 `package.json` 脚本中调用时，请使用 `designmd` 别名而非 `design.md`，因为 `.md` 后缀会与 Markdown 文件关联冲突。

### 自定义设计系统

你可以基于现有品牌进行定制化修改：

```
我喜欢 Notion 设计系统的结构，
但我想用我的品牌色：深海军蓝背景、金色点缀、白色文字。
请据此调整并保存为 brand_design.md
```

AI 会重写整个文件，保留 Notion 级别的结构和质量，同时使用你的视觉标识。之后保存到项目中，所有后续输出都会遵循相同规则。

### 典型使用场景

1. **快速原型开发**：启动新项目时，选择一个品牌风格作为起点，让 AI 代理生成符合该风格的完整 UI
2. **品牌一致性**：在团队协作中，通过 DESIGN.md 确保所有人使用相同的设计令牌
3. **Vibe Coding 加速**：在快速编码流程中，用可复用的设计指令加速 UI 生成
4. **视觉 QA**：用 DESIGN.md 作为验收标准，检查 AI 生成的 UI 是否符合规范
5. **跨项目复用**：将同一份 DESIGN.md 复制到不同项目中，保持设计语言一致
6. **设计到代码流水线**：配合 Figma 变量与 CSS 令牌对齐，让 MCP Server、Claude Code 和 Codex CLI 使用同一套设计语言

### 不同品牌的推荐场景

| 品牌 | 风格特点 | 推荐场景 |
|------|----------|----------|
| Apple | 高端简约、大量留白 | 产品落地页、品牌官网 |
| Stripe | 紫色渐变、优雅排版 | 金融/商务场景、支付页面 |
| Vercel | 黑白精准、Geist 字体 | 开发者工具、技术文档站 |
| Linear | 极简紫色点缀 | 项目管理、SaaS 产品 |
| Notion | 温暖实用、层次分明 | 教育内容、知识管理 |
| Claude/Anthropic | 温暖赤陶色调 | 思考型产品、AI 工具 |
| Airbnb | 温暖珊瑚色、圆润 UI | 旅行、社区、共享经济 |
| Uber | 高对比度 | 视频图形、深色模式 UI |

## 配置选项

### DESIGN.md 文件内部结构

遵循 Google Stitch 开源规范，DESIGN.md 的 Token 类型和格式如下：

| 类型 | 格式 | 示例 |
|------|------|------|
| Color | `#` + 十六进制 (sRGB) | `"#1A1C1E"` |
| Dimension | 数字 + 单位（`px`、`em`、`rem`） | `48px`、`-0.02em` |
| Token Reference | `{path.to.token}` | `{colors.primary}` |
| Typography | 包含 `fontFamily`、`fontSize`、`fontWeight`、`lineHeight`、`letterSpacing`、`fontFeature`、`fontVariation` 等的对象 | 见下方示例 |

### Token 分类

| 分类 | 捕获内容 |
|------|----------|
| Colors | 十六进制调色板、语义角色 |
| Typography | 字体族、大小、字重、行高、字间距 |
| Spacing | 用于 padding/margin/gap 的刻度令牌 |
| Rounded Corners | 圆角半径刻度 |
| Components | 命名组件及其属性映射 |

### 章节顺序

`##` 标题章节可以省略，但存在的章节必须按以下顺序排列：

1. Overview
2. Colors
3. Typography
4. Layout
5. Elevation & Depth
6. Shapes
7. Components
8. Do's and Don'ts

### 亮色/暗色模式

每个品牌提供 `preview.html`（亮色）和 `preview-dark.html`（暗色）两个预览文件。DESIGN.md 本身同时包含亮色和暗色模式的设计令牌，AI 代理可以根据需要选择使用。

### CLI Lint 规则

Google 官方 CLI 的 `lint` 命令运行 7 条验证规则：

| 规则 | 检查内容 |
|------|----------|
| `broken-ref` | Token 引用指向不存在的令牌（如 `{colors.primary}` 未定义） |
| `missing-primary` | 缺少必需的 primary 颜色定义 |
| `contrast-ratio` | 文字色与背景色的 WCAG AA 对比度 |
| `orphaned-tokens` | 已定义但从未被引用的令牌 |
| `token-summary` | 令牌统计摘要 |
| `missing-sections` | 缺少推荐章节 |
| `section-order` | 章节排列顺序是否符合规范 |

### 导出格式

CLI 的 `export` 命令支持以下输出格式：

| 格式 | 说明 |
|------|------|
| `tailwind` | 生成 `theme.extend` 格式，可直接用于 `tailwind.config.js` |
| `css-tailwind` | 生成 `@theme { ... }` CSS 块，使用 `--color-`、`--font-`、`--text-` 等前缀 |
| `dtcg` | W3C Design Tokens Community Group 标准格式 |

## 最佳实践

### 1. 始终将 DESIGN.md 放在项目根目录

放在根目录可以确保无论 AI 代理在哪个子目录工作，都能找到该文件。这与 `CLAUDE.md` / `AGENTS.md` 的约定一致。

### 2. 在提示中明确引用 DESIGN.md

不要假设 AI 代理会自动发现该文件。在首次提示时明确指出：

```
使用项目根目录的 DESIGN.md 作为所有样式决策的依据
```

### 3. 利用 Do's and Don'ts 章节作为护栏

DESIGN.md 中的 Do's and Don'ts 章节是防止 AI 生成不符合品牌规范 UI 的关键。在提示中特别强调：

```
严格遵循 DESIGN.md 中 Do's and Don'ts 章节的设计护栏
```

### 4. 先预览再选用

在决定使用哪个品牌风格前，先用浏览器打开 `preview.html` 和 `preview-dark.html` 查看实际效果，确保风格与你的项目匹配。

### 5. 定制而非直接复制

直接使用品牌设计系统可以快速启动，但最佳实践是基于现有系统进行定制：

- 保留结构和方法论
- 替换为你自己的品牌色、字体和间距
- 在 Prose 层添加你自己的设计原理

### 6. 与 AGENTS.md 配合使用

在 `AGENTS.md` 中添加对 DESIGN.md 的引用，确保编码代理也了解设计规范的存在：

```markdown
## Design System

本项目的视觉规范定义在 DESIGN.md 中。
所有 UI 相关的代码生成必须遵循 DESIGN.md 中的令牌和规则。
```

### 7. 版本控制你的设计系统

将 DESIGN.md 纳入 Git 版本控制，这样可以追踪设计系统的变更历史，也便于团队协作和设计评审。使用 `npx @google/design.md diff` 可以对比令牌级变更，检测回归。

### 8. 迭代优化

DESIGN.md 不是一次性文件。随着项目演进，持续优化其中的令牌和规则。每次发现 AI 代理生成不符合预期的 UI 时，检查是否需要在 DESIGN.md 中补充更精确的描述。

### 9. 使用 Token Reference 保持一致性

在 DESIGN.md 中使用 Token 引用（如 `{colors.primary}`）而非硬编码值，确保设计令牌的一致性和可维护性。

### 10. 保持文件精简

建议将 DESIGN.md 控制在 300 行以内。聚焦于具体的令牌值——精确的十六进制色值、语义颜色名称、字体族与字号层级、间距值、圆角半径和阴影定义。保持简洁且数值化——"8px"是有用的，"圆角"则不是。

### 11. 使用 CLI 验证

在提交 DESIGN.md 变更前，运行 lint 检查确保结构正确、对比度达标、引用完整：

```bash
npx @google/design.md lint DESIGN.md
```

## 常见问题

### Q: DESIGN.md 和传统设计系统（Figma、Storybook）有什么区别？

传统设计系统服务于人类设计师和开发者，依赖视觉工具（Figma）或代码（tokens.json、CSS 变量）。DESIGN.md 是纯文本，无工具依赖，专门为 AI 代理优化——模型可以直接解析，无需编译、转换或设计工具许可证。两者可以共存：设计团队继续使用 Figma，同时导出 DESIGN.md 供 AI 代理使用。DESIGN.md 不是设计系统的替代品，而是设计系统的 AI 可读层——它捕获令牌级规则供 AI 机械执行，最好作为完整设计系统的伴侣而非替代。

### Q: 我需要设计经验才能使用吗？

不需要。设计系统本身已经承载了设计知识，你只需要选择一个适合你项目的品牌风格。你可以直接使用，也可以让 AI 帮你定制。

### Q: DESIGN.md 会自动同步到其他项目吗？

不会。DESIGN.md 是静态文件，需要手动复制到每个项目。如果需要在多个项目间共享，建议创建一个内部的设计系统仓库作为单一来源。

### Q: 支持哪些 AI 编码代理？

所有能读取项目文件的 AI 编码代理都支持，包括但不限于：Claude Code、Cursor、Windsurf、Google Stitch、Lovable、Bolt 等。Markdown 是 LLM 最自然理解的格式。

### Q: 如何验证 AI 生成的 UI 是否符合 DESIGN.md？

可以使用 Google Labs 提供的 CLI 验证工具 `npx @google/design.md lint`，对文件进行结构化检查，包括 Token 引用完整性、WCAG AA 对比度、孤立令牌、章节顺序等。也可以对比 `preview.html` 进行视觉检查。

### Q: 可以混合多个品牌的设计系统吗？

技术上可以，但不推荐。每个 DESIGN.md 是一个完整的设计系统，混合使用可能导致视觉不一致。更好的做法是选择一个基础风格，然后在 Prose 层添加你的定制修改。

### Q: DESIGN.md 规范的成熟度如何？

DESIGN.md 规范由 Google Labs 开源（Apache-2.0 许可），目前处于 alpha 阶段，格式、Schema 和 CLI 仍在演进中。但核心概念已被广泛采用，awesome-design-md 仓库本身已获得 86k+ 星标，Google Stitch 作为参考消费者持续推动规范发展。

### Q: 如何贡献新的品牌设计系统？

参见仓库中的 `CONTRIBUTING.md`。在提交 PR 之前，请先开 Issue 讨论你的想法并获得维护者的反馈。注意：目前仓库不接受对已有 DESIGN.md 的 PR 修改，以维护现有集合的质量。所有 DESIGN.md 文件均基于公开可见的 CSS 值提取，项目不声称拥有任何网站的视觉标识所有权。

### Q: DESIGN.md 与框架有关吗？

无关。DESIGN.md 定义的是视觉规则，不是实现细节。AI 代理会根据规则在任何框架（React、Vue、Svelte 等）中应用这些规则。使用 `npx @google/design.md export --format tailwind` 可以自动生成 Tailwind 主题配置。

### Q: 如何将 DESIGN.md 与 Figma 工作流结合？

将 Figma 变量与 CSS 令牌对齐，确保 MCP Server、Claude Code 和 Codex CLI 使用同一套设计语言。可以从 Figma 导出令牌值，写入 DESIGN.md 的 YAML 前置元数据，实现设计工具与 AI 代理的双向一致性。
