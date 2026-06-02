---
slug: claude-design
name: Claude Design
category: UI/UX设计与前端美化
tags: [design, claude, output, visual]
description: 在Claude中直接获得更好的设计输出
install: "访问 claude.ai/design 上传 DESIGN.md（无需安装）"
source: "https://github.com/VoltAgent/awesome-claude-design"
---

# Claude Design

## 简介

Claude Design 是 Anthropic 于 2026 年 4 月推出的设计专用工作区。与在聊天窗口中生成一次性界面不同，它为每个项目维护一套持久的设计系统——包含 tokens、组件和可交付的预览资源，而不是仅仅在对话中输出色板。

它有三个核心功能面：

- **设计系统（Design System）**——通过 `DESIGN.md` 文件或上传品牌资产，为项目建立持久的 tokens/组件库，后续所有界面生成自动遵循该系统
- **原型（Prototype）**——从文字描述、截图、Figma `.fig` 文件、代码仓库 URL 或抓取的线上页面生成线框图或高保真原型
- **营销物料（Collateral）**——生成演示文稿、落地页、轮播图、品牌视频等一次性视觉内容

Claude Design 的关键优势在于：它会在生成前主动提问（商业模式、转化点、布局偏好等），引导你建立充分的上下文，而非直接输出千篇一律的"安全"设计。它还支持生成三个变体供你选择，这是它最聪明的 UX 决策之一。

## DESIGN.md 文件

### 什么是 DESIGN.md

`DESIGN.md` 是一个纯文本 Markdown 文件，用 AI 代理能直接执行的格式描述品牌的视觉语言。这个概念最早由 Google Stitch 引入，Google Labs 已将其标准化为开源规范。

可以将它类比为：

| 文件 | 谁来读 | 定义什么 |
|---|---|---|
| `AGENTS.md` | 编码代理 | 如何构建项目 |
| `DESIGN.md` | 设计代理 | 项目的外观和感觉 |

### 文件结构

根据 Google Labs 的官方规范，`DESIGN.md` 包含两个部分：

1. **YAML 前置数据（可选）**——机器可读的设计 tokens：精确的十六进制色值、字号、间距值、圆角和组件样式
2. **Markdown 正文**——人类可读的设计原则与使用说明，解释这些值为什么存在以及如何应用

Tokens 是规范值（"是什么"），正文提供应用上下文（"为什么"和"何时"）。两者配合才能让 AI 生成真正符合品牌的设计。

### 核心内容板块

一个完整的 `DESIGN.md` 通常包含以下板块：

**色彩（Colors）**
- 主色板（Primary）、辅助色板（Secondary）、中性色板（Neutral）
- 语义色（Semantic）：success、warning、error、info
- 精确的十六进制值 + 使用指引
- 示例：`primary.900 — 仅用于屏幕上最高强调的操作，每屏不超过一个`

**排版（Typography）**
- 字体族（Font family）
- 排版层级：display、headline、body、label、caption
- 每个层级的字号、字重、行高
- 按用途命名而非仅按尺寸：`display/xl — 仅用于页面标题`、`body/md — 默认段落文本`

**间距与布局（Spacing & Layout）**
- 基本单位（通常 4px 或 8px）
- 间距刻度值：4, 8, 16, 24, 32, 48px
- 网格系统与页面结构

**组件（Components）**
- 按钮：主按钮/次按钮/幽灵按钮的状态与样式
- 卡片：圆角、阴影、边框
- 输入框：边框、焦点状态、错误状态
- 导航：布局模式、折叠行为

**阴影与层级（Elevation）**
- 各层级的阴影值
- 深度提示规则

**设计原则（Design Principles）**
- 产品的视觉调性描述
- 何时打破规则的说明

**禁止事项（Don'ts）**
- 明确列出不要做的事情
- 示例："不要使用全大写文本"、"不要嵌套卡片"、"不要使用超过两个主色"

### 最小模板

```markdown
---
colors:
  primary: "#1A73E8"
  primary-dark: "#1557B0"
  secondary: "#34A853"
  background: "#FFFFFF"
  surface: "#F8F9FA"
  error: "#EA4335"
  text-primary: "#202124"
  text-secondary: "#5F6368"
typography:
  heading-1:
    font: Inter
    size: 32px
    weight: 700
  heading-2:
    font: Inter
    size: 24px
    weight: 600
  body:
    font: Inter
    size: 16px
    weight: 400
  caption:
    font: Inter
    size: 12px
    weight: 400
spacing:
  base: 8px
  values: [4, 8, 16, 24, 32, 48]
components:
  button-border-radius: 8px
  card-border-radius: 12px
  card-shadow: "0 1px 3px rgba(0,0,0,0.12)"
  input-border: "1px solid #DADCE0"
---

# 设计原则

本产品追求简洁、专业、值得信赖的视觉体验。主色 #1A73E8 用于关键操作和链接，不要在同一视图中出现两个主色按钮。卡片使用 12px 圆角和细微阴影传达层级感。

## 不要做的事

- 不要使用全大写文本
- 不要嵌套卡片组件
- 不要在浅色背景上使用低对比度的灰色文字
```

### 从现有代码库生成 DESIGN.md

如果你已有现成的代码库，可以用 Claude Code 自动提取：

```
分析这个文件夹，生成完整的设计系统文档。包括字体、色彩、图形风格、组件模式、语调、布局规范。标记缺失的部分。保存为 DESIGN.md。
```

## 使用方法

### 方式 A：从设计系统开始

1. 访问 `claude.ai/design/#org`
2. 点击 **Create new design system**
3. 在 **Set up your design system** 页面上传 `DESIGN.md` 到 **Add assets**
4. Claude 会自动生成完整的设计系统

### 方式 B：从原型开始

1. 访问 Claude Design 仪表板
2. 创建新原型
3. 在聊天中附加 `DESIGN.md` 文件
4. 输入："根据这个 DESIGN.md 创建设计系统"

无论哪种方式，Claude 都会在几分钟内生成一个完整的启动包：

```
README.md
colors_and_type.css
preview/
index.html
SKILL.md
```

一个 Markdown 文件即可生成生产就绪的设计包，无需模板，无需手动配置。

### 上传品牌资产

除了 `DESIGN.md`，你还可以上传以下资产来构建设计系统：

- **代码库**——包含组件库和样式的 React/Vue 项目
- **Figma 文件**——`.fig` 格式的设计文件
- **演示文稿或文档**——PPT、PDF 等反映品牌视觉的材料
- **单独资产**——Logo、色板文件、字体样本
- **线上网站**——通过 Web Capture 工具直接抓取

### 编写有效的设计提示词

好的设计提示词包含四个锁定要素：**目标、布局、内容、约束**。

```
为 [产品名] 构建定价页面。3个定价层，年付/月付切换，移动端粘性 CTA。移动端优先响应式。使用 Primary Button 组件。与我们现有首页的语调保持一致。
```

**核心原则：原则性描述优于指令性描述。** 越是逐条规定具体的 alpha 值和 token 模式，输出反而越趋同——Claude 会退回到训练数据中的安全模式。用启发式、描述性的语言表达设计意图，能迫使 Claude 深入探索问题空间，产生更有创意和针对性的输出。

## 设计输出类型

### UI 布局

生成完整的页面布局，包括导航、内容区域、侧边栏、页脚等。Claude Design 会根据设计系统中的间距和网格规则自动对齐。

### 色彩方案

基于 `DESIGN.md` 中定义的色板，自动应用主色、辅助色、语义色。每个界面都保持品牌一致性，不会出现随机颜色。

### 排版系统

严格遵循定义的排版层级——display 用于超大标题、headline 用于章节标题、body 用于正文、label 用于表单标签。不会在不同页面间出现字号漂移。

### 间距与组件

按钮的圆角、卡片的阴影、输入框的边框——所有组件样式从设计系统的 tokens 中取值，确保全局统一。

### 多变体输出

Claude Design 的一大特色：每个原型默认生成三个变体，让你选择最接近意图的方向，再在此基础上迭代。这比单次输出减少了大量来回调整。

## 与其他设计工具集成

### Google Stitch

`DESIGN.md` 概念源自 Google Stitch，两者完全兼容。你可以：
- 在 Google Stitch 中生成 UI 原型和 `DESIGN.md`
- 将 Stitch 生成的 `DESIGN.md` 导入 Claude Design
- 实现从 Stitch 设计到 Claude Code 代码的完整工作流

### Claude Code

Claude Design 支持一键交接到 Claude Code：
- 设计完成后选择 **Send to Claude Code**
- Claude Code 自动读取设计系统的 tokens 和组件定义
- 继续用代码实现设计稿

你还可以在项目根目录的 `CLAUDE.md` 中添加引用：

```markdown
## Design System
本项目使用 DESIGN.md 中定义的设计系统。
生成或修改任何 UI 组件时，始终参照此文件。
- 仅使用 DESIGN.md 中定义的色彩、字体和间距值
- 不要发明新值或使用框架默认值
- 组件状态（hover、focus、active、disabled）匹配 DESIGN.md 中的模式
```

### Figma

- 支持上传 `.fig` 文件作为设计系统源
- 可将 Claude Design 的输出导出到 Figma 继续编辑
- 通过 Figma MCP 服务器实现双向协作

### awesome-claude-design 仓库

`VoltAgent/awesome-claude-design` 提供了 68+ 个现成的 `DESIGN.md` 文件，涵盖：

- AI 与 LLM 平台（ChatGPT、Gemini、Perplexity 等）
- 开发者工具与 IDE（VS Code、Linear、Vercel 等）
- 后端与 DevOps（Supabase、Railway、Docker 等）
- 生产力与 SaaS（Notion、Stripe、Airtable 等）
- 设计与创意工具（Figma、Canva、Framer 等）
- 金融与加密货币（Coinbase、Revolut 等）
- 电商与零售（Shopify、Amazon 等）

直接复制一个到项目中，告诉 AI "按这个风格构建页面"，即可获得与该品牌视觉一致的高质量 UI。

## 最佳实践

### 1. 先原则后 Token

不要只列色值和字号。先写一段产品视觉调性的描述，再列出具体的 tokens。AI 读懂了"为什么"才能正确应用"是什么"。

### 2. 用描述性语言而非指令性规定

```
# 不好（过于指令性）
按钮使用 8px 圆角，bg #1A73E8，白色文字，hover 时 bg #1557B0

# 好（原则性描述）
主按钮传达确定性——实心填充、明确的圆角、高对比度。它出现在每个视图的关键操作位置，每屏不超过一个主按钮。
```

### 3. 明确禁止事项

`DESIGN.md` 中最有价值的部分之一是"Don'ts"板块。告诉 AI 不要做什么，比告诉它要做什么更能减少偏差。

### 4. 诊断循环

生成三个界面 → 检查偏差 → 将缺失的约束添加到 `DESIGN.md` → 重新生成。这个循环比一次写完美的 `DESIGN.md` 更高效。

### 5. 竞品参考收集

在 Claude Code 的 skill 文件夹中按功能分类存放竞品截图（hero 区、导航栏、卡片布局等），Claude 在生成时会参考这些视觉素材，输出更贴近目标风格。

### 6. 节省 Token 的技巧

- 先在 Google Stitch 中生成基础 `DESIGN.md`（免费），再导入 Claude Design 完善
- 简单调整任务切换到更轻量的模型，节省 Pro 额度
- 设计系统一旦建立，后续生成自动引用，无需重复描述

## 示例

### 示例 1：没有 DESIGN.md vs 有 DESIGN.md

**没有 DESIGN.md：**

提示："设计一个现代 SaaS 定价页面"
输出：千篇一律的渐变背景、紫色主色调、通用卡片布局——与任何品牌无关的安全模板

**有 DESIGN.md：**

提示："设计一个定价页面，遵循我们的设计系统"
输出：品牌色自动应用、排版层级精确匹配、按钮和卡片样式统一、间距遵循 8px 刻度——从第一个像素开始就是你的品牌

### 示例 2：用 DESIGN.md 生成落地页

```
1. 从 awesome-claude-design 仓库复制 Linear 风格的 DESIGN.md
2. 访问 claude.ai/design 创建新原型
3. 附加 DESIGN.md，输入：
   "为项目管理工具构建落地页。包含 hero 区、功能展示、定价、页脚。
    移动端优先，使用我们的设计系统组件。"
4. Claude 生成三个变体
5. 选择最接近的方向，点击编辑微调
6. 交接到 Claude Code 生成代码
```

### 示例 3：从现有代码库提取设计系统

```
# 在 Claude Code 中
> 分析 src/ 目录，提取所有设计 tokens（色彩、字号、间距、圆角、阴影），
  生成 DESIGN.md 文件。标记任何不一致的地方。

# 然后在 Claude Design 中
> 上传生成的 DESIGN.md → 建立设计系统 → 后续所有界面保持一致
```

## 常见问题

### Claude Design 和 DESIGN.md 是什么关系？

DESIGN.md 是基础——一个可移植的设计系统合约。Claude Design 是消费这个合约的工具之一。有了 DESIGN.md，Claude Design 的输出会更精准、更一致。但 DESIGN.md 不依赖 Claude Design，它同样可以被 Google Stitch、Cursor、Claude Code 等任何 AI 代理读取。

### 我需要付费才能使用吗？

Claude Design 目前为研究预览版，面向 Pro、Max、Team、Enterprise 订阅用户开放。但 DESIGN.md 本身只是一个 Markdown 文件，免费可用。你可以在 Claude Code 中免费使用 DESIGN.md 来指导 UI 生成。

### DESIGN.md 应该放在项目哪里？

放在项目根目录即可。AI 编码代理（Claude Code、Cursor 等）会自动读取项目根目录下的 `DESIGN.md`。你也可以在 `CLAUDE.md` 中显式引用它。

### 上传代码库到 Claude Design 安全吗？

如果你的代码库是专有的，上传意味着将代码发送给 Anthropic。请评估你的安全策略后再决定。

### 为什么我的设计输出看起来千篇一律？

最常见的原因是提示词过于指令性。Claude 会模式匹配训练数据中的安全设计模式。解决方案：用启发式、描述性的语言表达设计意图，添加竞品参考截图，在 `DESIGN.md` 中加入明确的"Don'ts"板块。

### 我可以同时使用多个设计系统吗？

可以。Claude Design 支持在一个组织下维护多个设计系统，适用于不同品牌或产品线。

### DESIGN.md 和 Figma 设计系统有什么区别？

DESIGN.md 是纯文本的、可版本控制的、AI 原生格式。Figma 是视觉化的、交互式的设计工具。两者互补：可以从 Figma 导出设计规范到 DESIGN.md，也可以将 DESIGN.md 的输出导入 Figma 继续编辑。Claude Design 支持直接上传 Figma 文件作为设计系统源。
