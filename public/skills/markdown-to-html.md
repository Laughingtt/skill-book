---
slug: markdown-to-html
name: Markdown to HTML
category: 效率工具与自动化
tags: [markdown, html, conversion, rendering, styling]
description: 将Markdown文档转换为精美排版的HTML页面，支持多种样式主题
install: "npx skills add alchaincyf/huashu-md-html"
source: "https://github.com/alchaincyf/huashu-md-html"
---

# Markdown to HTML（花叔的 md/html 双向流水线）

## 简介

花叔的「md/html/docx 多向流水线」skill，实现「md 是源代码，html/docx 是产物」的工作流理念。核心能力包括：

1. **万物 → md**：用 Microsoft markitdown 把任意文件（PDF/DOCX/PPTX/XLSX/HTML/图片/音频/YouTube/EPub/ZIP）转成干净的 markdown
2. **md → 精美 html**：用 Pandoc + 4 套精挑模板把 md 加工成出色的 html
3. **html → md**：用 html-to-markdown + trafilatura 把 html 或 URL 无损转回 md
4. **md → 出版社级 docx**：用 python-docx 把 md 加工成专业排版的 docx

每个能力都封装成一个命令，每套主题都过了反 AI slop 检查清单——没有紫渐变、没有 emoji 当图标、没有 `#0D1117` 深蓝底，配色克制，有出版社品位。

## 支持的样式主题

### 主题速选表

| 想做什么 | 选哪个主题 |
|---------|-----------|
| 写一篇深度 essay/博客文章 | `article` |
| 做一份技术报告/白皮书/调研 | `report` |
| 把 md 改成纯阅读模式（公众号回流） | `reading` |
| 做长文档/教程/橙皮书章节（需要导航） | `interactive` |

### 1. article — Tufte 编辑型

**哲学锚点**：Tufte CSS 启发，Pentagram 信息建筑学派的克制风格

**关键参数**：
| 项 | 值 |
|---|---|
| 正文字 | et-book / Source Han Serif（衬线） |
| accent | 赤陶橙 #b04a1a |
| 底色 | 象牙白 #fffaf3（暖色调，不刺眼） |
| 行高 | 1.78（中文最舒适区间） |
| 最大宽度 | 720px（单栏黄金宽度） |
| 字号 | 17px（桌面）/ 16px（移动）/ 18px（≥1200px） |

**签名细节**：
- h2 上方有一条细水平线（章节分隔的安静方式）
- blockquote 左侧 4px 赤陶橙竖条 + 浅米底
- hr 用 30% 宽的细线（不是顶到边的粗黑线）
- 选中文字背景是 oklab 调过的赤陶橙稀释色

**适合内容**：1500-5000 字的 essay、思考型/观点型文章、单独发布、深度阅读内容

### 2. report — 出版社白皮书型

**哲学锚点**：信息密度优先但不堆砌，表格友好（这是它的 hero element）

**关键参数**：
| 项 | 值 |
|---|---|
| 正文字 | Inter + 思源宋（混排） |
| accent | 森林绿 #2c5e3f（去饱和） |
| 底色 | 米白 #fbfaf6 |
| 行高 | 1.8 |
| 主内容宽 | 780px |

**签名细节**：
- 表格有完整的样式：表头底色 + 斑马纹 + 悬停高亮
- 代码块是深底（与文档浅底形成对比）
- 数据密集型内容的首选

**适合内容**：技术报告、白皮书、调研文档、数据表格多的内容

### 3. reading — Medium 极简阅读型

**哲学锚点**：极致克制（每个像素都要 earn its place），单栏窄体、大字号、慷慨留白

**关键参数**：
| 项 | 值 |
|---|---|
| 正文字 | Charter / Iowan Old Style / 思源宋（衬线） |
| accent | 暖橙 #c75a30 |
| 底色 | 暖米 #fbfaf7 |
| 行高 | 1.85（最舒缓的阅读节奏） |
| 最大宽度 | 680px（最窄，最沉浸） |
| 字号 | 19px（桌面）/ 17px（移动）/ 20px（≥1400px） |

**签名细节**：
- hr 是三个点的居中分隔（不是横线）
- 第一段字号比正文大 12%
- blockquote 左侧 3px 暖橙条 + 衬线斜体
- 链接默认黑色，下划线是暖橙

**适合内容**：公众号回流、纯阅读模式、给老板/客户邮件附件用的「看一眼版」

### 4. interactive — 长文导航型

**哲学锚点**：长文档需要侧边栏导航，折叠节让长内容可收纳

**关键参数**：
| 项 | 值 |
|---|---|
| 正文字 | Inter + 思源宋（混排） |
| accent | 森林绿 #2c5e3f |
| 底色 | 米白 #fbfaf6 |
| 主内容宽 | 780px |
| 侧边栏宽 | 280px |

**签名细节**：
- 大屏幕（≥1024px）：grid 布局，左 TOC sticky 跟随滚动
- TOC 用 `::before` 加上「目录」的小标题
- 折叠节可点击，summary 前有可旋转的小三角
- h2 自动 scroll-margin-top

**适合内容**：橙皮书长章节、教程、技术参考手册、5000 字+ 的深度文档

## 安装与使用

### 安装

```bash
npx skills add alchaincyf/huashu-md-html
```

跨 agent 通用——Claude Code、Cursor、Codex、OpenClaw、Hermes 都能装。

### 基本用法

**能力 1：万物 → md**
```
把这份 PDF 转成 markdown
把这个 DOCX 转成 md
把这个 YouTube 视频转成文字稿
把这个网页 URL 转成 md
```

**能力 2：md → 精美 html**
```
把 article.md 转成 html，用 article 主题
把 report.md 转成 html，用 report 主题
把这个 md 文件做成可阅读的 html 页面
```

**能力 3：html → md**
```
把这个网页转成 markdown
把这篇博客文章归档成 md
把这个 html 文件转回 md
```

**能力 4：md → 出版社级 docx**
```
把这份 md 转成可以投稿的 docx
把这个 md 文件做成出版社审校格式
```

## 转换示例

### 示例 1：深度文章转换

**输入 Markdown**：
```markdown
# 人工智能的哲学思考

## 什么是智能

智能是一个复杂的概念，涉及**认知能力**、**学习能力**和**适应能力**。

> 真正的智能不仅仅是计算能力，更是对世界的理解。

### 智能的层次

1. 反应式智能
2. 记忆式智能
3. 推理式智能
```

**输出 HTML（article 主题）**：
- 赤陶橙 accent 贯穿全文
- h2 上方有细水平线分隔
- blockquote 左侧 4px 竖条 + 浅米底
- 衬线字体，象牙白底色
- 单栏 720px 宽度，行高 1.78

### 示例 2：技术报告转换

**输入 Markdown**：
```markdown
# 2024 年度技术调研报告

## 调研方法

| 方法 | 样本量 | 有效率 |
|------|--------|--------|
| 问卷 | 1000 | 85% |
| 访谈 | 50 | 100% |

## 代码示例

```python
def analyze_data(data):
    return process(data)
```
```

**输出 HTML（report 主题）**：
- 表格有完整样式：表头底色 + 斑马纹
- 代码块深底色，与文档浅底形成对比
- 森林绿 accent，信息密度优先

### 示例 3：长文档转换

**输入 Markdown**：
```markdown
# 橙皮书：AI Agent 完全指南

## 第一章：Agent 基础

### 1.1 什么是 Agent

Agent 是能够自主执行任务的 AI 系统...

### 1.2 Agent 的类型

<details>
<summary>补充阅读：Agent 分类详解</summary>

详细内容...
</details>

## 第二章：Agent 架构
```

**输出 HTML（interactive 主题）**：
- 左侧固定 TOC 导航
- 折叠节可点击展开
- 大屏幕 grid 布局
- 适合在章节间跳转

## 样式自定义

### 设计原则

继承自 huashu-design 的反 AI slop 原则：

- **反 AI slop**：不用紫渐变、emoji 作图标、圆角+左 border accent、SVG 画人物
- **配色是出版社品位**：一组克制色 + 单个 accent 贯穿全场
- **字体有特点**：衬线 display + sans body，避免 Inter/Roboto 打天下
- **一处 120%，其他 80%**：每套模板都有一个签名细节
- **自包含**：单 CSS 文件，不依赖 CDN（除非用户开 KaTeX）

### 排版约定

- 中英文混排时不加空格（盘古之白禁用）
- 「」引号 + 不过度使用
- 加粗只用于真正的关键句（约 10 处/文）
- 破折号（——）≤2 处/文
- 代码字 JetBrains Mono
- 语法高亮用 Pandoc 内置 pygments

## 支持的 Markdown 扩展

| 特性 | 语法 | 说明 |
|------|------|------|
| 标题 | `# H1` 到 `###### H6` | 完整支持 |
| 加粗/斜体 | `**bold**`, `*italic*` | 完整支持 |
| 代码块 | ` ```lang ` | 语法高亮（pygments） |
| 行内代码 | `` `code` `` | JetBrains Mono 字体 |
| 表格 | GitHub 风格表格 | report 主题优化 |
| 图片 | `![alt](url)` | 居中嵌入 + 图说 |
| 链接 | `[text](url)` | accent 色下划线 |
| 引用块 | `> quote` | 左侧竖条 + 浅底 |
| 列表 | `-` 无序, `1.` 有序 | 完整支持 |
| 脚注 | `[^1]` | Pandoc 原生支持 |
| 数学公式 | `$inline$`, `$$block$$` | KaTeX 渲染（可选） |
| 折叠节 | `<details><summary>` | interactive 主题优化 |
| YAML 元数据 | frontmatter | 支持标题、作者、日期 |

## 最佳实践

### 1. 选择正确的主题

- **article**：深度思考、观点输出、博客文章
- **report**：数据密集、表格多、正式报告
- **reading**：纯阅读、公众号回流、邮件附件
- **interactive**：长教程、技术手册、多章节文档

### 2. 内容组织建议

- 使用清晰的标题层级（H1 → H2 → H3）
- 每节控制在 500-1000 字
- 长文档使用 `<details>` 折叠补充内容
- 表格控制在 5-7 列以内

### 3. 排版细节

- 第一段可以稍长，作为导语
- 关键句用加粗，但每篇不超过 10 处
- 引用块用于真正需要强调的内容
- 代码块标注语言以获得语法高亮

### 4. 工作流建议

```
原始文档（PDF/DOCX/网页）
    ↓ 能力 1：万物 → md
干净 Markdown（源文件）
    ↓ 能力 2：md → 精美 html
发布 HTML（网页/公众号）
    或
    ↓ 能力 4：md → 出版社级 docx
投稿/出版 DOCX
```

### 5. URL 输入的两条路径

URL 既能走能力 1（markitdown）也能走能力 3（trafilatura），产出质量差异：

- **markitdown**：适合结构化文档（PDF、DOCX、PPTX），保留更多格式
- **trafilatura**：适合网页/博客，提取正文更干净，适合归档

## 依赖工具

脚本启动时自动检测，缺失时给出明确安装命令：

| 工具 | 用途 | 安装 |
|------|------|------|
| Pandoc | md → html 核心 | `brew install pandoc` |
| markitdown | 万物 → md | `pip install markitdown` |
| html-to-markdown | html → md | `pip install html-to-markdown` |
| python-docx | md → docx | `pip install python-docx` |

## 相关资源

- [GitHub 仓库](https://github.com/alchaincyf/huashu-md-html)
- [花叔设计哲学](https://github.com/alchaincyf/huashu-design)
- [主题详解](https://github.com/alchaincyf/huashu-md-html/blob/main/references/md-to-html-themes.md)
