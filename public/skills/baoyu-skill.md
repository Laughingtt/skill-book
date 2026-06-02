---
slug: baoyu-skill
name: Baoyu Skill
category: UI/UX设计与前端美化
tags: [image, style, art, generation, concept]
description: 快速生成不同艺术风格的概念图
install: "npx add-skill jimliu/baoyu-skills"
source: "https://github.com/JimLiu/baoyu-skills"
---

# Baoyu Skill（宝玉技能集）

## 简介

Baoyu Skills 是由宝玉（Jim Liu）开源的一套 AI Agent 技能集，专为 Claude Code、Codex 等 AI Agent 设计，用于提升日常工作效率。该技能集涵盖内容生成、AI 图像生成和实用工具三大类别，其中最核心的能力是通过多维度参数组合（风格 x 色板 x 渲染方式 x 文字 x 氛围），快速生成不同艺术风格的图片素材。

技能集包含多个独立的子技能，按需安装即可：

| 子技能 | 功能 |
|---|---|
| `baoyu-cover-image` | 文章封面图生成，5 维度定制 |
| `baoyu-article-illustrator` | 文章配图，Type x Style x Palette 一致性 |
| `baoyu-image-gen` | 统一接口调用多家 AI 图像 API |
| `baoyu-xhs-images` | 小红书风格图片卡片生成 |
| `baoyu-comic` | 知识漫画创作 |
| `baoyu-slide-deck` | 专业幻灯片图片生成 |
| `baoyu-infographic` | 信息图生成，20 种布局 + 17 种视觉风格 |
| `baoyu-url-to-markdown` | 网页转 Markdown |
| `baoyu-post-to-x` | 发布内容到 X (Twitter) |
| `baoyu-post-to-wechat` | 发布内容到微信公众号 |

## 支持的艺术风格与维度

### baoyu-cover-image：五维度组合体系

封面图生成器提供 5 个维度的自由组合，总计可产生数千种独特搭配：

**类型（Type）**：hero（英雄式大图）、conceptual（概念式）、typography（排版式）、metaphor（隐喻式）、scene（场景式）、minimal（极简式）

**色板（Palette）**：warm（暖色）、elegant（雅致）、cool（冷色）、dark（暗色）、earth（大地色）、vivid（鲜艳）、pastel（粉彩）、mono（单色）、retro（复古）、duotone（双色调）、macaron（马卡龙）

**渲染方式（Rendering）**：flat-vector（扁平矢量）、hand-drawn（手绘）、painterly（油画笔触）、digital（数字渲染）、pixel（像素风）、chalk（粉笔风）、screen-print（丝网印刷）

**文字层次（Text）**：none（纯视觉，无文字）、title-only（仅标题，默认）、title-subtitle（标题+副标题）、text-rich（含标签的丰富文字）

**氛围层次（Mood）**：subtle（低对比度，柔和）、balanced（均衡，默认）、bold（高对比度，醒目）

### baoyu-xhs-images：12 种视觉风格

小红书图片卡片支持 Style x Layout 系统，可选风格包括：

| 风格 | 说明 |
|---|---|
| `cute` | 可爱风（默认） |
| `fresh` | 清新风 |
| `warm` | 温暖风 |
| `bold` | 大胆风 |
| `minimal` | 极简风 |
| `retro` | 复古风 |
| `pop` | 波普风 |
| `notion` | Notion 风格 |
| `chalkboard` | 黑板粉笔风 |
| `study-notes` | 学习笔记风 |
| `screen-print` | 丝网印刷风 |
| `sketch-notes` | 手绘笔记风 |

### baoyu-article-illustrator：三维组合体系

文章配图支持 Type x Style x Palette 三维自由组合：

- **Type**：infographic（信息图）、scene（场景）、flowchart（流程图）、comparison（对比图）、framework（框架图）、timeline（时间线）
- **Style**：notion、warm、minimal、blueprint、watercolor、elegant、sketch-notes、vector-illustration 等
- **Palette**：macaron、warm、neon 等，可覆盖风格的默认配色

### baoyu-slide-deck：幻灯片风格

支持的专业风格包括：blueprint、chalkboard、bold-editorial、corporate、dark-atmospheric、editorial-infographic、fantasy-animation、intuition-machine、minimal、notion、pixel-art、scientific、sketch-notes、vector-illustration、vintage、watercolor

### baoyu-infographic：信息图风格

支持 17 种视觉风格，包括 kawaii（日系可爱）、storybook-watercolor（童话水彩）、chalkboard（黑板粉笔）、cyberpunk-neon（赛博朋克霓虹）等。

## 安装与配置

### 安装整个技能集

```bash
npx skills add jimliu/baoyu-skills
```

### 只安装单个子技能（推荐）

避免安装不需要的技能，减少 AI Agent 的上下文开销：

```bash
# 封面图生成
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-cover-image

# 文章配图
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-article-illustrator

# 图像生成后端
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-image-gen

# 小红书图片卡片
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-xhs-images

# 知识漫画
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-comic

# 幻灯片
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-slide-deck

# 信息图
npx skills add https://github.com/jimliu/baoyu-skills --skill baoyu-infographic
```

### 更新技能

在 Claude Code 中使用 `/plugin` 命令更新，也可开启自动更新。

### 图像后端配置（EXTEND.md）

首次使用时，技能会引导完成偏好设置，生成 `EXTEND.md` 配置文件。配置文件存放位置有三个层级：

- **项目级**：`.baoyu-skills/<skill-name>/EXTEND.md`（仅当前项目生效）
- **XDG 级**：`${XDG_CONFIG_HOME:-$HOME/.config}/baoyu-skills/<skill-name>/EXTEND.md`
- **用户级**：`~/.baoyu-skills/<skill-name>/EXTEND.md`（所有项目生效）

关键配置项：

- `preferred_image_backend`：指定图像生成后端（auto / openai / google / dashscope / replicate / ask）
- 默认风格、默认色板、默认宽高比、语言偏好等

### 图像生成后端（baoyu-image-gen）

`baoyu-image-gen` 提供统一的图像生成接口，支持以下 AI 提供商：

| 提供商 | 说明 |
|---|---|
| OpenAI | DALL-E / GPT Image 系列 |
| Azure OpenAI | Azure 托管的 OpenAI 图像服务 |
| Google | Imagen / Gemini 图像生成 |
| OpenRouter | 多模型路由 |
| DashScope | 阿里通义万象 |
| Z.AI | GLM-Image |
| MiniMax | MiniMax 图像生成 |
| Jimeng | 即梦 AI |
| Seedream | Seedream 图像生成 |
| Replicate | Replicate 平台多模型 |

设置对应提供商的 API Key 环境变量即可启用。

## 使用方法

### 封面图生成（baoyu-cover-image）

```bash
# 基本用法 — 根据文章自动生成封面
为这篇文章生成一张封面图

# 指定维度参数
生成封面图 --type conceptual --palette dark --rendering pixel --mood bold

# 指定宽高比
生成封面图 --aspect 2.35:1    # 电影宽银幕
生成封面图 --aspect 16:9      # 宽屏（默认）
生成封面图 --aspect 1:1       # 正方形
生成封面图 --aspect 3:4       # 竖版

# 指定文字层次
生成封面图 --text title-subtitle
生成封面图 --text none        # 纯视觉，无文字

# 指定语言
生成封面图 --lang zh          # 中文标题
生成封面图 --lang ja          # 日文标题

# 快速模式（跳过确认，自动选择）
生成封面图 --quick

# 无标题别名
生成封面图 --no-title
```

### 文章配图（baoyu-article-illustrator）

```bash
# 为文章自动配图
为这篇文章配图

# 指定类型、风格、色板
为文章配图 type=infographic style=vector-illustration palette=macaron

# 指定配图密度
为文章配图 density=high       # 高密度配图
```

### 图像生成（baoyu-image-gen）

```bash
# 基本文生图
npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png

# 指定画质
npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image out.png --quality 2k

# 指定提供商
npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image out.png --provider openai

# 使用阿里通义万象
npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "一只可爱的猫" --image out.png --provider dashscope

# 使用 Replicate
npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image out.png --provider replicate
```

### 小红书图片卡片（baoyu-xhs-images）

```bash
# 生成可爱风卡片（默认）
把这个内容做成小红书图片卡片

# 指定风格
做成小红书卡片 style=sketch-notes
做成小红书卡片 style=notion
做成小红书卡片 style=retro
```

## 提示词技巧

### 1. 风格与主题匹配

选择渲染方式时考虑主题的契合度：

- **科技/未来主题**：digital + dark + bold — 数字渲染 + 暗色 + 高对比度
- **文艺/生活主题**：hand-drawn + warm + subtle — 手绘 + 暖色 + 柔和
- **数据/知识主题**：flat-vector + cool + balanced — 扁平矢量 + 冷色 + 均衡
- **复古/怀旧主题**：painterly + retro + subtle — 油画笔触 + 复古色 + 柔和
- **游戏/像素主题**：pixel + vivid + bold — 像素风 + 鲜艳 + 醒目

### 2. 色板选择指南

- `warm` — 适合生活方式、美食、旅行内容
- `cool` — 适合科技、商务、数据分析
- `pastel` — 适合母婴、教育、轻量内容
- `macaron` — 适合时尚、美妆、甜点
- `earth` — 适合自然、户外、可持续主题
- `dark` — 适合赛博朋克、悬疑、夜间主题
- `duotone` — 适合品牌视觉、极简设计

### 3. 描述越具体，效果越好

```
# 不好的提示
"一座房子"

# 好的提示
"雨后黄昏的日式木屋，屋檐滴水，远山薄雾缭绕，暖黄灯光从纸窗透出"
```

### 4. 利用预置风格快捷方式

使用 `--style` 参数可直接调用预设风格组合，一次设定多个维度，无需逐一指定 type、palette、rendering。

## 实际示例

### 示例 1：赛博朋克封面图

```
生成封面图 --type scene --palette dark --rendering digital --mood bold --aspect 2.35:1
提示词："赛博朋克城市夜景，霓虹灯牌映照在雨湿的街道上，远处巨大的全息广告投射在摩天大楼之间"
→ 生成电影宽银幕比例的暗色数字渲染场景封面
```

### 示例 2：水彩风格文章配图

```
为文章配图 type=scene style=watercolor palette=warm
提示词："山间小屋，清晨薄雾，炊烟袅袅"
→ 生成温暖水彩风格的文章场景插图
```

### 示例 3：像素风极简封面

```
生成封面图 --type minimal --palette mono --rendering pixel --text title-only
提示词："代码与咖啡"
→ 生成单色像素风格的极简封面，仅含标题文字
```

### 示例 4：手绘笔记风小红书卡片

```
做成小红书卡片 style=sketch-notes
内容：5 个提高工作效率的 AI 工具
→ 生成手绘笔记风格的系列图片卡片，适合小红书发布
```

### 示例 5：知识漫画

```
创建知识漫画，主题：TCP 三次握手
→ 生成教育风格的多格漫画，用故事化方式解释技术概念
```

### 示例 6：粉笔风信息图

```
生成信息图 style=chalkboard layout=comparison
内容：React vs Vue 框架对比
→ 生成黑板粉笔风格的对比信息图
```

## 与其他工具配合

### 与 Codex imagegen 配合

在 Codex 环境中运行时，技能会自动检测并优先使用内置的 `imagegen` 工具作为光栅图像后端，无需额外配置。

### 与 baoyu-image-gen 配合

`baoyu-image-gen` 是所有图像生成类技能的统一后端。安装后，其他技能（cover-image、article-illustrator、xhs-images、comic、slide-deck、infographic）会自动调用它来生成实际图像。

### 与 Replicate 配合

通过 `baoyu-image-gen` 的 `--provider replicate` 参数，可调用 Replicate 平台上的任意图像模型：

```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image out.png --provider replicate --model google/nano-banana
```

### 与发布技能配合

生成的图片可与 `baoyu-post-to-x`、`baoyu-post-to-wechat` 配合，实现一键发布到社交媒体。

## 最佳实践

1. **按需安装**：只安装实际需要的子技能，避免增加 AI Agent 的上下文开销。每次运行时，所有已安装技能的指令都会被注入对话上下文。

2. **优先使用预设风格**：`--style` 预设已经过精心搭配，比自己组合各维度参数更协调。不确定参数时，先用预设，再微调。

3. **善用 EXTEND.md 定制默认值**：将常用偏好（默认风格、默认后端、默认宽高比）写入 EXTEND.md，避免每次重复指定。

4. **Prompt 文件规范**：技能会为每张图生成独立的 prompt 文件（保存在 `prompts/` 目录），便于版本管理和复用。不要手动删除这些文件。

5. **禁止用代码替代位图**：技能明确要求使用 AI 图像模型生成光栅图，绝不能用 SVG、HTML、Canvas 等代码方式替代。如果无法解析到图像后端，应询问用户而非悄悄生成代码图形。

6. **宽高比选择**：根据用途选择合适的比例 — 文章封面用 16:9，社交媒体头图用 2.35:1，Instagram 用 1:1，小红书用 3:4。

7. **批量生成**：配图类技能支持批量生成，先生成所有 prompt 文件并确认后，再统一调用图像后端，效率更高。
