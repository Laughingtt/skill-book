---
slug: html-ppt-skill
name: PPT Master / HTML PPT Skill
category: 内容创作与自媒体
tags: [ppt, presentation, html, slide, demo]
description: 快速制作PPT演示文稿，支持HTML格式或PPTX格式输出
install: "npx skills add lewislulu/html-ppt-skill"
source: "https://github.com/lewislulu/html-ppt-skill"
---

# PPT Master / HTML PPT Skill

一款专业级的 AI AgentSkill，用于生成高质量 HTML 演示文稿。提供 **36 套主题**、**15 套完整 deck 模板**、**31 种页面布局**、**47 个动效**（27 个 CSS 动画 + 20 个 Canvas FX），以及全新的**演讲者模式**——像素级完美预览 + 逐字稿提词器 + 计时器。纯静态 HTML/CSS/JS，无需构建步骤。

## 简介

html-ppt-skill 是一个基于纯静态 HTML/CSS/JS 的演示文稿生成技能。与传统的 PowerPoint 或 Keynote 不同，它生成的演示文稿本质上是 Web 页面，可以直接在浏览器中打开和演示，也可以导出为 PDF/PNG。

核心理念：**一个主题文件 = 一种视觉风格，一个布局文件 = 一种页面类型，一个动画类名 = 一种入场效果**。所有页面共享 `assets/base.css` 中的 token 化设计系统，确保一致性与可定制性。

适用场景关键词：presentation、ppt、slides、deck、keynote、幻灯片、演讲稿、分享稿、小红书图文、pitch deck、tech sharing、technical presentation。

## 核心特性

- **36 套主题**：覆盖极简白、杂志风、暗色极客、新野兽派、毛玻璃、极光渐变等风格
- **31 种单页布局**：封面、目录、章节分隔、图文混排、数据图表、代码展示、时间线、KPI 网格等
- **15 套完整 deck 模板**：路演、产品发布、技术分享、周报、课程模块、小红书图文等开箱即用的完整模板
- **47 个动效**：27 个 CSS 入场动画 + 20 个 Canvas FX（粒子、烟花、知识图谱、星空等）
- **演讲者模式**：按 `S` 键进入，提供逐字稿提词器、计时器和像素级预览
- **键盘导航**：方向键翻页、`T` 键切换主题、`O` 键总览模式、`B` 键暂停
- **Token 化设计系统**：通过 CSS 自定义属性统一管理颜色、字体、间距、阴影
- **零构建**：纯静态文件，CDN 加载字体，直接浏览器打开即可使用
- **中文友好**：内置中文字体支持，`lang="zh-CN"` 自动切换排版

## 安装与使用

### 安装

一条命令安装，无需构建工具：

```bash
npx skills add lewislulu/html-ppt-skill
```

安装后技能目录结构：

```
html-ppt/
├── SKILL.md               # Agent 入口调度文件
├── references/            # 详细文档目录
│   ├── themes.md          # 36 主题 + 使用场景
│   ├── layouts.md         # 31 布局目录
│   ├── animations.md      # 27 CSS + 20 FX 目录
│   ├── full-decks.md      # 15 完整 deck 模板
│   ├── presenter-mode.md  # 演讲者模式 + 逐字稿指南
│   └── authoring-guide.md # 完整工作流
├── assets/
│   ├── base.css           # 共享 tokens + 基础组件（不要直接编辑）
│   ├── fonts.css          # Web 字体引入
│   ├── runtime.js         # 键盘导航 + 演讲者模式 + 总览 + 主题切换
│   ├── themes/*.css       # 36 主题 token 覆盖文件
│   └── animations/
│       ├── animations.css # 27 个命名 CSS 入场动画
│       ├── fx-runtime.js  # 进入 slide 自动初始化 [data-fx]
│       └── fx/*.js        # 20 个 Canvas FX 模块
├── templates/
│   ├── deck.html          # 最小 6 页起步模板
│   ├── theme-showcase.html   # 36 主题预览
│   ├── layout-showcase.html  # 31 布局预览
│   ├── animation-showcase.html # 47 动画预览
│   ├── full-decks-index.html  # 15 deck 画廊
│   ├── full-decks/<name>/     # 15 套完整 deck 模板
│   └── single-page/*.html     # 31 个单页布局文件
├── scripts/
│   ├── new-deck.sh        # 从 deck.html 脚手架生成新 deck
│   └── render.sh          # Headless Chrome → PNG 截图
└── examples/demo-deck/    # 完整示例 deck
```

### 基本使用流程

1. **描述需求**：向 AI 描述演示文稿的主题、受众、时长和风格偏好
2. **AI 选择主题**：根据场景自动匹配主题和布局
3. **生成 HTML**：AI 组合模板、布局、主题和内容生成完整 HTML 文件
4. **浏览器预览**：直接打开 HTML 文件查看效果
5. **迭代调整**：通过对话修改内容、切换主题、调整动画

### 使用示例

```
输入："制作一个关于 AI 技术趋势的技术分享演示文稿，面向开发者，15分钟"
→ AI 选择 tokyo-night 主题 + 技术分享布局
→ 生成包含封面、目录、3个章节、CTA、致谢的完整 deck
→ 按 T 键可切换其他暗色主题预览

输入："做一个融资路演的 pitch deck"
→ AI 选择 pitch-deck-vc 主题 + 路演 deck 模板
→ 生成问题-方案-市场-商业模式-团队-融资的结构化演示

输入："做一个小红书图文，关于咖啡探店"
→ AI 选择 xhs-post 模板（810×1080 竖版 3:4）
→ 生成适配小红书格式的图文内容
```

## 演示文稿结构

### 页面层级

每个演示文稿由 `<section class="slide">` 块组成，核心结构：

```
cover → toc → section-divider #1 → [2-4 内容页] →
section-divider #2 → [2-4 内容页] → section-divider #3 →
[2-4 内容页] → cta → thanks
```

一份 20 分钟的演讲通常包含 12-18 页幻灯片。

### 布局类型一览

| 分类 | 布局文件 | 用途 |
|------|---------|------|
| **开篇与过渡** | `cover.html` | 封面页：kicker + 大标题 + 副标题 + 标签行 |
| | `toc.html` | 目录页：2×3 编号卡片网格 |
| | `section-divider.html` | 章节分隔：大号编号 + 章节名 |
| **图文内容** | `hero-image.html` | 全幅大图 + 文字叠加 |
| | `image-split-left.html` | 左图右文分栏 |
| | `image-split-right.html` | 左文右图分栏 |
| | `gallery-3up.html` | 三列图片画廊 |
| | `media-full.html` | 全屏媒体（视频/图片） |
| **文字排版** | `text-lead.html` | 大段引文/核心观点 |
| | `bullet-list.html` | 要点列表 |
| | `two-column.html` | 双栏对比 |
| | `quote.html` | 引用块 |
| **数据展示** | `stat-highlight.html` | 单一大数字 + 副标题（支持计数动画） |
| | `kpi-grid.html` | 4 个 KPI 指标 + 涨跌标识 |
| | `table.html` | 数据表格，行悬停效果 |
| | `chart-bar.html` | Chart.js 柱状图 |
| | `chart-line.html` | Chart.js 双线图 + 填充区域 |
| | `chart-pie.html` | Chart.js 环形图 + 要点卡片 |
| | `chart-radar.html` | Chart.js 雷达图（6轴对比） |
| **代码展示** | `code-block.html` | 代码高亮块 |
| | `terminal.html` | 终端模拟器样式 |
| **流程与时间线** | `timeline.html` | 水平/垂直时间线 |
| | `process-steps.html` | 步骤流程图 |
| **结尾** | `cta.html` | 行动号召页 |
| | `thanks.html` | 致谢页 |

## 代码示例

### 最小演示文稿

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的演示文稿</title>
  <link rel="stylesheet" href="../assets/base.css">
  <link id="theme-link" rel="stylesheet" href="../assets/themes/tokyo-night.css">
  <link rel="stylesheet" href="../assets/animations/animations.css">
  <link rel="stylesheet" href="../assets/fonts.css">
</head>
<body data-themes="tokyo-night,dracula,catppuccin-mocha">
  <div class="deck">

    <!-- 封面页 -->
    <section class="slide" data-title="封面">
      <p class="kicker">技术分享</p>
      <h1 class="h1">AI 技术趋势 2026</h1>
      <p class="lede">从大模型到 Agent，AI 正在重塑一切</p>
      <div class="pill-row">
        <span class="pill">LLM</span>
        <span class="pill">Agent</span>
        <span class="pill">Multimodal</span>
      </div>
    </section>

    <!-- 目录页 -->
    <section class="slide" data-title="目录">
      <h2 class="h2">今日议程</h2>
      <div class="toc-grid">
        <div class="toc-card"><span class="toc-num">01</span>大模型演进</div>
        <div class="toc-card"><span class="toc-num">02</span>Agent 生态</div>
        <div class="toc-card"><span class="toc-num">03</span>多模态融合</div>
      </div>
    </section>

    <!-- 章节分隔 -->
    <section class="slide section-divider" data-title="01 大模型演进">
      <span class="section-num">01</span>
      <h2 class="h2">大模型演进</h2>
    </section>

    <!-- 数据展示页 -->
    <section class="slide" data-title="市场规模">
      <h2 class="h2">AI 市场规模</h2>
      <div class="stat-row">
        <div class="stat">
          <span class="counter" data-target="2400">0</span>
          <span class="stat-unit">亿</span>
          <p class="stat-label">2026 年全球 AI 市场规模</p>
        </div>
      </div>
    </section>

    <!-- 要点列表页 -->
    <section class="slide" data-title="关键趋势">
      <h2 class="h2">三大关键趋势</h2>
      <ul class="stagger-list" data-anim="stagger-list">
        <li>模型推理成本持续下降，API 价格降低 90%</li>
        <li>Agent 框架成熟，从 PoC 走向生产环境</li>
        <li>多模态能力成为标配，文本/图像/视频/代码一体化</li>
      </ul>
    </section>

    <!-- 致谢页 -->
    <section class="slide" data-title="致谢">
      <h1 class="h1">谢谢</h1>
      <p class="lede">欢迎交流与讨论</p>
      <div data-fx="confetti-cannon"></div>
    </section>

  </div>

  <script src="../assets/runtime.js"></script>
  <script src="../assets/animations/fx-runtime.js"></script>
</body>
</html>
```

### 添加 Canvas FX 特效

Canvas FX 通过 `data-fx` 属性声明式添加，进入幻灯片时自动初始化：

```html
<!-- 粒子爆裂效果 -->
<div data-fx="particle-burst"></div>

<!-- 彩纸礼炮 -->
<div data-fx="confetti-cannon"></div>

<!-- 烟花效果 -->
<div data-fx="firework"></div>

<!-- 3D 星空 -->
<div data-fx="starfield"></div>

<!-- 矩阵雨（黑客帝国风格） -->
<div data-fx="matrix-rain"></div>

<!-- 知识图谱动画 -->
<div data-fx="knowledge-graph"></div>

<!-- 神经网络可视化 -->
<div data-fx="neural-net"></div>

<!-- 星座连线 -->
<div data-fx="constellation"></div>

<!-- 轨道环 -->
<div data-fx="orbit-ring"></div>

<!-- 银河漩涡 -->
<div data-fx="galaxy-swirl"></div>

<!-- 文字瀑布 -->
<div data-fx="word-cascade"></div>

<!-- 字母爆炸（需指定文字） -->
<div data-fx="letter-explode" data-fx-text-value="EXPLODE"></div>

<!-- 链式反应 -->
<div data-fx="chain-react"></div>

<!-- 磁场效果 -->
<div data-fx="magnetic-field"></div>

<!-- 数据流 -->
<div data-fx="data-stream"></div>

<!-- 渐变色团 -->
<div data-fx="gradient-blob"></div>

<!-- 闪光拖尾 -->
<div data-fx="sparkle-trail"></div>

<!-- 冲击波 -->
<div data-fx="shockwave"></div>

<!-- 打字机效果 -->
<div data-fx="typewriter-multi" data-fx-line1="> boot..."></div>

<!-- 计数器爆炸 -->
<div data-fx="counter-explosion" data-fx-to="2400"></div>
```

### CSS 入场动画

通过 `data-anim` 属性为幻灯片元素指定入场动画：

```html
<!-- 淡入上浮 -->
<section class="slide" data-anim="fade-up">

<!-- 模糊入场 -->
<section class="slide" data-anim="blur-in">

<!-- 上升入场 -->
<section class="slide" data-anim="rise-in">

<!-- 3D 透视缩放 -->
<section class="slide" data-anim="perspective-zoom">

<!-- 3D 立方旋转 -->
<section class="slide" data-anim="cube-rotate-3d">

<!-- 列表逐项入场 -->
<ul data-anim="stagger-list">
  <li>第一项</li>
  <li>第二项</li>
  <li>第三项</li>
</ul>

<!-- 数字计数动画 -->
<span class="counter" data-target="1000">0</span>
```

### 演讲者模式与逐字稿

为每页幻灯片添加 `<div class="notes">` 即可在演讲者模式中显示逐字稿：

```html
<section class="slide" data-title="AI 趋势">
  <h2 class="h2">AI 市场趋势</h2>
  <ul>
    <li>推理成本下降 90%</li>
    <li>Agent 走向生产</li>
  </ul>
  <div class="notes">
    大家好，接下来我要分享 AI 市场的三大趋势。
    第一，模型推理成本在过去一年下降了 90%，
    这意味着更多企业能够负担 AI 的使用成本。
    第二，Agent 框架已经从实验阶段进入生产环境......
  </div>
</section>
```

按 `S` 键进入演讲者模式，或在 URL 添加 `?preview=N` 参数。

### 组合布局构建 Deck

从 `templates/single-page/` 复制布局片段组合成完整演示文稿：

```html
<!-- 步骤1：从 cover.html 复制封面布局 -->
<section class="slide" data-title="封面">
  <p class="kicker">2026 产品发布</p>
  <h1 class="h1">全新 AI 助手</h1>
  <p class="lede">让每个人都能用上 AI 的力量</p>
</section>

<!-- 步骤2：从 kpi-grid.html 复制 KPI 布局 -->
<section class="slide" data-title="核心指标">
  <h2 class="h2">核心指标</h2>
  <div class="kpi-row">
    <div class="kpi"><span class="kpi-value">10M+</span><span class="kpi-label">活跃用户</span><span class="kpi-delta up">↑ 230%</span></div>
    <div class="kpi"><span class="kpi-value">99.9%</span><span class="kpi-label">可用性</span><span class="kpi-delta up">↑ 0.1%</span></div>
    <div class="kpi"><span class="kpi-value">50ms</span><span class="kpi-label">平均响应</span><span class="kpi-delta up">↓ 80%</span></div>
    <div class="kpi"><span class="kpi-value">4.8</span><span class="kpi-label">用户评分</span><span class="kpi-delta up">↑ 0.3</span></div>
  </div>
</section>

<!-- 步骤3：从 chart-bar.html 复制图表布局 -->
<section class="slide" data-title="增长趋势">
  <h2 class="h2">用户增长趋势</h2>
  <canvas id="growth-chart"></canvas>
</section>
```

## 样式与主题

### 主题分类

所有主题通过覆盖 `assets/base.css` 中的 CSS 自定义属性实现风格切换。切换主题只需修改 `<link>` 标签的 `href`：

```html
<!-- 切换主题：修改 theme-link 的 href -->
<link id="theme-link" rel="stylesheet" href="../assets/themes/tokyo-night.css">
```

运行时按 `T` 键可循环切换 `data-themes` 属性中列出的主题：

```html
<body data-themes="tokyo-night,dracula,catppuccin-mocha,gruvbox-dark">
```

#### 浅色与专业主题

| 主题名 | 描述 | 适用场景 |
|--------|------|---------|
| `minimal-white` | 极简白，Inter 字体，强文字层级，极低阴影 | 内部汇报、技术评审、严肃话题 |
| `editorial-serif` | 杂志风 Playfair 衬线 + 奶油底 | 品牌故事、文字密度大的长文演讲 |
| `soft-pastel` | 柔和马卡龙三色渐变 | 产品发布、面向消费者、轻松话题 |
| `xiaohongshu-white` | 小红书白底 + 暖红 accent + 衬线标题 | 小红书图文、生活/美学类内容 |
| `solarized-light` | 经典低眩光配色 | 长时间观看的工作坊、教学 |
| `catppuccin-latte` | catppuccin 浅色 | 开发者、极客友好的技术分享 |
| `corporate-clean` | 纯白 + 海军蓝 accent + Inter | 董事会汇报、B2B 销售、金融保险 |
| `pitch-deck-vc` | YC 风白底 + 蓝紫渐变 + 大留白 | 融资路演、种子轮、VC meeting |
| `academic-paper` | 论文白 + 衬线正文 + 黑墨 + 蓝链接 | 学术报告、研究分享、会议论文 |
| `japanese-minimal` | 象牙白 + 朱红 accent + 极大留白 + Noto Serif | 品牌升级、匠人故事、禅意叙事 |
| `engineering-whiteprint` | 白底 + 坐标纸网格 + 海军墨线 + 等宽字 | 系统设计、API 文档、架构白皮书 |

#### 大胆与宣言主题

| 主题名 | 描述 | 适用场景 |
|--------|------|---------|
| `sharp-mono` | 纯黑白 + Archivo Black + 硬阴影 | 宣言类、极具冲击力的视觉 |
| `neo-brutalism` | 厚描边、硬阴影、明黄 accent | 创业路演、敢说敢做的调性 |
| `bauhaus` | 几何 + 红黄蓝原色 | 设计 talk、艺术史/产品美学主题 |
| `swiss-grid` | 瑞士网格 + Helvetica 感 + 12 栏底纹 | 严肃排版、设计行业 |
| `memphis-pop` | 孟菲斯波普背景点 + 大字标题 | 年轻、潮流、品牌合作 |

#### 暗色与极客主题

| 主题名 | 描述 | 适用场景 |
|--------|------|---------|
| `tokyo-night` | 深蓝紫 + 霓虹 accent | 技术分享、开发者社区 |
| `dracula` | Dracula 官方配色 | 开发者、技术大会 |
| `catppuccin-mocha` | catppuccin 暗色 | 开发者、极客友好 |
| `gruvbox-dark` | Gruvbox 暖色暗底 | 终端爱好者、复古极客 |
| `terminal-green` | 绿屏终端 + 等宽 + 发光文字 | CLI/black-hat/复古朋克 |
| `blueprint` | 蓝图工程 + 网格底纹 | 系统架构、工程蓝图 |

#### 视觉特效主题

| 主题名 | 描述 | 适用场景 |
|--------|------|---------|
| `glassmorphism` | 毛玻璃 + 多色光斑背景 | Apple 式发布会、产品特性展示 |
| `aurora` | 极光渐变 + blur + saturate | 封面 / CTA / 结语页 |
| `rainbow-gradient` | 白底 + 彩虹流动渐变 accent | 欢乐向、节日、庆祝页 |

### Token 系统变量

每个主题覆盖以下 CSS 自定义属性：

```css
:root {
  /* 颜色 */
  --bg, --bg-soft, --surface, --surface-2, --border;
  --text-1, --text-2, --text-3;
  --accent, --accent-2, --accent-3;
  --good, --warn, --bad;

  /* 渐变 */
  --grad, --grad-soft;

  /* 形态 */
  --radius, --shadow;

  /* 字体 */
  --font-sans, --font-display;
}
```

### 自定义主题

创建新的主题文件只需覆盖上述变量：

```css
/* assets/themes/my-brand.css */
:root {
  --bg: #0a0a0a;
  --bg-soft: #141414;
  --surface: #1a1a1a;
  --surface-2: #222222;
  --border: #333333;
  --text-1: #ffffff;
  --text-2: #aaaaaa;
  --text-3: #666666;
  --accent: #ff6b35;
  --accent-2: #ff8c61;
  --accent-3: #cc5529;
  --good: #22c55e;
  --warn: #f59e0b;
  --bad: #ef4444;
  --grad: linear-gradient(135deg, #ff6b35, #ff8c61);
  --grad-soft: linear-gradient(135deg, rgba(255,107,53,0.1), rgba(255,140,97,0.1));
  --radius: 12px;
  --shadow: 0 4px 24px rgba(0,0,0,0.3);
  --font-sans: 'Inter', sans-serif;
  --font-display: 'Archivo Black', sans-serif;
}
```

### 中英文混排

设置 `lang="zh-CN"` 并使用双行标题结构：

```html
<html lang="zh-CN">
<!-- ... -->
<h1 class="h1">主标题<br><span class="dim">English subtitle</span></h1>
```

`fonts.css` 会根据 `lang` 属性自动加载中文字体。

## 完整 Deck 模板

15 套开箱即用的完整演示文稿模板，每套包含 `index.html`、`style.css` 和 `README.md`：

| 模板名 | 页数 | 描述 | 适用场景 |
|--------|------|------|---------|
| `pitch-deck` | 8 | 融资路演标准结构 | 创业融资、投资路演 |
| `product-launch` | 7 | 产品发布风格 | 新品上线、功能发布 |
| `tech-sharing` | 8 | 技术分享深色主题 | 技术大会、团队分享 |
| `weekly-report` | 6 | 周报简洁风格 | 团队周会、项目汇报 |
| `xhs-post` | 8 | 小红书竖版图文（810×1080 3:4） | 小红书内容创作 |
| `course-module` | 7 | 温暖纸感 + Playfair 衬线 + 学习目标侧栏 | 教学模块、在线课程、工作坊 |
| `presenter-mode-reveal` | 6 | 演讲者模式专用，tokyo-night 默认，5 主题 T 键切换，每页带 150-300 字逐字稿 | 技术分享/演讲/课程 |
| `testing-safety-alert` | - | 红琥珀警示风格 | 安全告警、风险提示 |
| `xhs-pastel-card` | - | 柔和马卡龙慢生活 | 小红书生活类图文 |
| `dir-key-nav-minimal` | - | 方向键 8 色极简 | 极简风格演示 |

使用脚手架脚本创建新 deck：

```bash
bash scripts/new-deck.sh my-talk
# 将在 examples/my-talk/ 下创建基于 deck.html 的起始文件
```

## 导出选项

### 导出为 PNG

使用 Headless Chrome 截图脚本，默认输出 1920×1080：

```bash
bash scripts/render.sh examples/my-talk/index.html
```

小红书图文需要 3:4 竖版（1242×1660），可在 `render.sh` 中修改尺寸。

### 导出为 PDF

在 URL 后添加 `?print-pdf` 参数，利用浏览器打印功能导出 PDF：

```
# 在 Chrome 中打开
file:///path/to/presentation.html?print-pdf
# 然后 Ctrl+P 打印为 PDF
```

### Decktape 导出

使用 Decktape 工具批量截图或导出 PDF：

```bash
npx decktape reveal "presentation.html?export" output.pdf \
  --screenshots \
  --screenshots-directory "screenshots/$(date +%Y%m%d_%H%M%S)"
```

注意：`?export` 参数会禁用图表动画以确保 PDF 渲染更干净。

## 最佳实践

### 主题选择

- 技术分享 / 开发者 → `tokyo-night`、`dracula`、`catppuccin-mocha`
- 融资路演 → `pitch-deck-vc`、`corporate-clean`
- 品牌故事 → `editorial-serif`、`japanese-minimal`
- 产品发布 → `glassmorphism`、`aurora`
- 学术报告 → `academic-paper`
- 小红书 → `xiaohongshu-white`、`xhs-post` 模板
- 极简风格 → `minimal-white`、`swiss-grid`
- 复古极客 → `terminal-green`、`blueprint`

### 动画使用原则

- 每页最多选择**一个**重点动画，其余保持简洁
- 常用安全动画：`rise-in`、`blur-in`、`fade-up`、`stagger-list`、`counter-up`
- 特殊场景使用：`perspective-zoom`（3D 效果）、`cube-rotate-3d`（科技感）、`confetti-burst`（庆祝）
- Canvas FX 用于关键页（封面、结尾、数据亮点），不要每页都用

### Deck 结构建议

```
cover → toc → section-divider → 2-4 内容页 → section-divider →
2-4 内容页 → section-divider → 2-4 内容页 → cta → thanks
```

- 不要连续两页使用相同布局
- 每个章节用 `section-divider` 分隔
- 封面和结尾是最适合使用 FX 特效的位置

### 中英文排版

- 设置 `<html lang="zh-CN">`
- 双语标题使用 `<h1>中文标题<br><span class="dim">English subtitle</span></h1>`
- 长段落中文建议使用 `editorial-serif` 或 `japanese-minimal` 主题

### 演讲场景

- 任何正式演讲（技术分享/课程/路演）推荐使用 `presenter-mode-reveal` 模板
- 为每页添加 `<div class="notes">` 逐字稿
- 列出 3-5 个备选主题在 `data-themes` 中，现场可按 `T` 键切换
- 按 `S` 键进入演讲者模式查看提词器和计时器

### 避免事项

- 不要直接编辑 `assets/base.css`，应通过主题文件覆盖
- 不要在同一页混用多个 Canvas FX
- 不要连续多页使用强动画（如 `cube-rotate-3d`），会分散注意力
- 不要在小红书模板中使用横向布局，保持 3:4 竖版比例
