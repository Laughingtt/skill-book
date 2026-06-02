---
slug: guizang-ppt-skill
name: guizang-ppt-skill
category: 内容创作与自媒体
tags:
  - PPT
  - HTML
  - 演示文稿
  - 封面生成
  - AI Agent
description: >-
  一个适配 Claude Code / Codex 等 AI Agent 环境的网页 PPT 技能，用于生成单文件 HTML 横向翻页 PPT、PPT
  配图和多平台封面。内置两套视觉风格，支持快速创建美观的演示文稿。
source: 'https://github.com/op7418/guizang-ppt-skill'
---

## 简介

归藏 PPT Skill（guizang-ppt-skill）是由前大厂 UI/UX 设计师「歸藏」开源的 AI Agent 技能，专为 Claude Code、Codex 等本地 Agent 环境设计。它能够将文章、Markdown、产品分析、演讲素材等输入，按结构化工作流生成**单文件 HTML 横向翻页 PPT**，同时支持生成 PPT 配图和多平台封面。

该项目在 GitHub 上已获得超过 14k Star，是当前最热门的 AI PPT 生成 Skill 之一。归藏将其在"一人公司：被 AI 折叠的组织"、"一种新的工作方式"等线下分享中积累的设计经验，全部沉淀进了这个 Skill。

**核心定位**：它不是 PowerPoint 的平替，而是一条"文章到演示网页"的 Agent 工作流。最终产物是 HTML 演示，不是 `.pptx` 文件。HTML 比 Markdown 表现力高（支持空间定位、横向翻页、主题色、图文排布、动效），又比原生 PPT 更适合 Agent 修改——浏览器打开即可预览，截图和导出也方便。

## 核心功能

### 两套视觉系统

- **Style A · 电子杂志 × 电子墨水**：灵感源自《Monocle》《卫报》等印刷杂志版式与 Kindle 阅读美学。封面墨色底 + 衬线大标题 + WebGL 流体背景，正文纸白底色 + 墨色正文，像摊开的印刷杂志。更适合观点表达、个人分享、叙事型演讲、行业观察、人文故事。内置 **10 种页面布局**。
- **Style B · 瑞士国际主义（Swiss Style）**：强调网格、直角、发丝线、单一高饱和锚点色。更适合产品分析、方法论、数据汇报、AI 产品发布。内置 **22 个具名锁定版式**（S01-S22），正文页只能从预设版式中选择，Agent 不临时写 CSS，而是在模板范围里选版式、填内容、做自检。

### 翻页交互

支持键盘 `←` / `→`、鼠标滚轮、触屏滑动、底部圆点跳转导航。`ESC` 键打开缩略图索引，`B` 键切换低性能静态模式。尽量接近在浏览器里翻一本真实杂志的体验。

### PPT 配图生成

在 Codex 环境中，可调用 GPT-Image 2.0 / GPT-M 2.0 生成照片、信息图、流程图、UI 情景图等配图。配图遵守四个关键规则：比例适配、语言一致、槽位对齐、保真度控制。

### 多平台封面生成

从同一份内容生成不同平台的封面图：

| 平台 | 比例 |
|---|---|
| 公众号头图 | 21:9 |
| 公众号分享卡 | 1:1 |
| 小红书封面/轮播 | 3:4 |
| 视频号横版封面 | 16:9 |

### 质量校验

- Style B 配备校验脚本：`node scripts/validate-swiss-deck.mjs path/to/index.html`，会拦住标题位置不对、图片脱离槽位、SVG 里塞文字等明显跑偏的页面。
- 两套风格共享 `references/checklist.md`，按 P0 / P1 / P2 / P3 分级进行质量检查。

## 安装与使用

### 方式一：一行命令安装（推荐）

```bash
npx skills add --skill guizang-ppt-skill
```

### 方式二：让 AI 自动安装

把下面这段话直接发给 Claude Code / Cursor / 任何有 shell 权限的 AI Agent：

> 帮我安装 `guizang-ppt-skill` 这个 Claude Code skill。请把 https://github.com/op7418/guizang-ppt-skill 克隆到 ~/.claude/skills/guizang-ppt-skill，安装完成后检查 SKILL.md、assets/、references/ 是否存在。

### 方式三：手动命令行

```bash
git clone https://github.com/op7418/guizang-ppt-skill.git ~/.claude/skills/guizang-ppt-skill
```

安装后确认目录结构：

```
~/.claude/skills/guizang-ppt-skill/
├── SKILL.md          ← Skill 主文件：工作流、原则、常见错误
├── assets/
│   ├── template.html          ← Style A 种子 HTML
│   └── template-swiss.html    ← Style B 种子 HTML
├── references/
│   ├── layouts.md             ← Style A 10 种布局骨架
│   ├── layouts-swiss.md       ← Style B 22 种版式
│   ├── swiss-layout-lock.md   ← 瑞士风版式锁定规则
│   ├── themes.md              ← Style A 5 套主题色
│   ├── themes-swiss.md        ← Style B 4 套锚点色
│   ├── components.md          ← 组件手册
│   ├── checklist.md           ← 质量检查清单
│   ├── image-prompts.md       ← 配图提示词规范
│   └── screenshot-framing.md  ← 截图再设计规范
└── scripts/
    └── validate-swiss-deck.mjs ← 瑞士风校验脚本
```

### 更新到最新版

```bash
# 方式一：重新运行安装命令
npx skills add --skill guizang-ppt-skill

# 方式二：手动更新
cd ~/.claude/skills/guizang-ppt-skill && git pull
```

## 使用方法与示例

### 触发方式

安装后，Claude Code 会在对话中自动发现并调用此 Skill。触发关键词包括：杂志风 PPT、瑞士风 PPT、Swiss Style、横向翻页演示、HTML deck 等。

### 结构化工作流（6 步）

Skill 本身是结构化工作流，Agent 会逐步引导：

**Step 1 · 需求澄清**（动手前必做）

如果只给了主题或模糊想法，Agent 会用 7 个问题逐个对齐：

1. **风格选择**：杂志风还是瑞士风？
2. **受众与场景**：行业内部 / 商业发布 / 私享会？
3. **分享时长**：15 分钟约 10 页，30 分钟约 20 页
4. **原始素材**：有没有文档、数据、旧 PPT、文章链接？
5. **图片/截图需求**：需要配图吗？放在哪？
6. **主题色**：从预设主题里选
7. **硬约束**：必须包含 XX 数据 / 不能出现 YY

**Step 2 · 风格与模板选择**

根据需求选择 Style A 或 Style B，拷贝对应种子 HTML。

**Step 3 · 大纲与节奏表**

用"叙事弧"模板搭骨架：

```
钩子(Hook)    → 1 页   : 抛一个反差/问题/硬数据让人停下来
定调(Context) → 1-2 页 : 说明背景/你是谁/为什么讲这个
主体(Core)    → 3-5 页 : 核心内容，用不同布局穿插
转折(Shift)   → 1 页   : 打破预期/提出新观点
收束(Takeaway)→ 1-2 页 : 金句/悬念问题/行动建议
```

叙事弧 + 页数规划 + 主题节奏表，三张表对齐后再进下一步。

**Step 4 · 版式选择与内容填充**

- Style A：从 10 种布局中选骨架，填入文字和图片
- Style B：从 S01-S22 中选版式，严格遵守锁定规则

**Step 5 · 配图与封面**（可选）

在 Codex 环境中可生成配图，或从同一份内容生成多平台封面。

**Step 6 · 质量自检**

对照 `checklist.md` 逐项检查，Style B 还需运行校验脚本。

### 使用示例

**示例 1：生成杂志风 PPT**

> 帮我基于这篇文章做一份杂志风 PPT，控制在 10 页左右，使用靛蓝瓷主题。

**示例 2：生成瑞士风 PPT**

> 帮我做一份瑞士风 PPT，主题是"2025 年 AI 产品趋势分析"，7 页，需要 2-3 张配图，用克莱因蓝主题。

**示例 3：生成多平台封面**

> 基于刚才的 PPT 核心观点，生成一张公众号 21:9 头图和一张小红书 3:4 封面。

**示例 4：截图再设计**

> 把这张产品截图重新设计成适合 PPT 的 16:10 配图。

### 图片管理规范

图片放在与 `index.html` 同级的 `images/` 文件夹，命名规则：

```
ppt/
├── index.html
└── images/
    ├── 01-cover.jpg
    ├── 03-figma.png
    └── 05-dashboard.png
```

- 页号补零 + 英文语义（01 不是 1，cover 不是 fengmian），方便排序和 AI 引用
- 照片用 JPG，截图用 PNG（截图带文字，PNG 保真不糊）
- 单张宽度不低于 1600px（大屏投影不糊）
- 换图时只需同名覆盖，HTML 一个字不改

## 配置选项

### Style A 主题色预设

| 主题 | 适合场景 |
|---|---|
| 墨水经典 | 通用默认、商业发布、不知道选啥 |
| 靛蓝瓷 | 科技 / 研究 / AI / 技术发布会 |
| 森林墨 | 自然 / 可持续 / 文化 / 非虚构 |
| 牛皮纸 | 怀旧 / 人文 / 文学 / 独立杂志 |
| 沙丘 | 艺术 / 设计 / 创意 / 画廊 |

切换主题只需替换 `template.html` 开头 `:root{}` 里的 6 行 CSS 变量，其他 CSS 全走 `var(--...)`。

### Style B 锚点色预设

| 主题 | 锚点色 | 适合场景 |
|---|---|---|
| 克莱因蓝 IKB | `#002FA7` | 通用默认、商业发布、AI 产品、方法论 |
| 柠檬黄 | `#FFD500` | 年轻、运动、零售、消费品、Y2K 复古 |
| 柠檬绿 | `#C5E803` | 生态、可持续、健康、Z 世代品牌 |
| 安全橙 | `#FF6B35` | 警示、新闻、工业、运动、活力主题 |

如果用户说"瑞士风 PPT"但没有指定颜色，默认推荐克莱因蓝 IKB。

### Style B 版式一览（S01-S22）

| 版式 | 用途 |
|---|---|
| S01 Index Cover | 原始索引封面 |
| S02 Vertical Timeline + KPI | 演化对比 / 年代变迁 |
| S03 Split Statement | 核心论点 / 左右分屏 |
| S04 Six Cells | 6 项概念定义 |
| S05 Three Layers | 三层架构 |
| S06 KPI Tower | 4 项数据视觉化高度差 |
| S07 H-Bar Chart | 5-10 项排名比较 |
| S08 Duo Compare | Before/After 对照 |
| S09 Dot Matrix Statement | 大引述 / statement |
| S10 Split Closing | 收束页 |
| S11 Horizontal Timeline | 4-7 步流程 |
| S12 Manifesto + Ink Banner | 阶段性结论 |
| S13 Three Forces | 3 个对等概念深化 |
| S14 Loop Form | 自学闭环 / 自动化 |
| S15 Matrix + Hero Stat | 8-12 项矩阵 + 总数据 |
| S16 Multi-card Brief | 6 项快讯小卡 |
| S17 System Diagram | 三层架构 / 生态地图 |
| S18 Why Now | 三论点 + 数据支撑 |
| S19 Four Cards | 4 项等权特性 |
| S20 Stacked KPI Ledger | 纵向账单数据 |
| S21 Tech Spec Sheet | 产品规格 / benchmark |
| S22 Hero Image | 全出血主图 |

### 平台支持

| 平台 | 状态 | 说明 |
|---|---|---|
| Claude Code | 支持 | 原生 Skill 工作流，适合生成和迭代 HTML deck |
| Codex | 支持 | 适合生成 PPT、调用图片生成能力、做浏览器视觉检查 |
| Cursor / 其他本地 Agent | 可用 | 需要能读写文件并执行 shell 命令 |
| WorkBuddy | 适配中 | 单独整理上架版本 |
| 普通 Chatbot | 不推荐 | 没有文件系统和浏览器预览时，很难稳定生成完整 deck |

## 最佳实践

### 1. 先问清楚再动手

AI 做 PPT 最容易翻车的地方，往往不在某页不好看，而在方向错。7 问澄清流程把"对齐"前置到了开头，一个 30 秒的澄清问题，能避免后面 30 分钟的版式重做。

### 2. 选择合适的风格

- 内容偏叙事、人文、观点表达 → Style A 电子杂志风
- 内容偏数据、方法论、产品分析 → Style B 瑞士国际主义风
- 不确定时 → Style A 是安全选择

### 3. 控制页数节奏

- 15 分钟分享约 10 页，30 分钟分享约 20 页
- hero 页和 non-hero 页交替，禁止连续三页相同主题
- 用叙事弧模板规划节奏，不要堆砌内容

### 4. 善用版式约束

Style B 的 22 个锁定版式不是限制，而是质量来源。AI 做设计最怕自由度过高——自由度太高，模型就会每页都发明一种新结构，最后整份 PPT 看起来像 10 个不同模板拼起来的。在有限空间里做选择，才能保证"生成到第 5 页还能像同一份东西"。

### 5. 图片管理要规范

- 严格按命名规则存放图片
- 换图用同名覆盖，不要改 HTML
- 截图用 PNG 保真，照片用 JPG 压缩
- 单张宽度不低于 1600px

### 6. 质量自检不可省略

生成完成后务必对照 `checklist.md` 逐项检查。Style B 还要运行校验脚本：

```bash
node scripts/validate-swiss-deck.mjs path/to/index.html
```

校验器会拦住居中标题、实验版式、SVG 内写字、图片脱离槽位等常见问题。

### 7. 不要自定义颜色

Skill 刻意限制了自定义 hex 值的能力——约束越严，风格越稳。自由选色很容易破坏整体风格，只允许从预设主题里选。

## 常见问题

**可以导出 PPTX 吗？**

当前核心交付是 HTML。你可以用浏览器演示、截图或录屏。如果需要 PPTX，建议把 HTML 页面作为视觉稿再转换，但这不是当前主流程。

**为什么不允许自定义颜色？**

这个 Skill 的重点是稳定产出。自由选色很容易破坏整体风格，所以只允许从预设主题里选。保护美学比给自由更重要。

**我能加自己的版式吗？**

可以。Style A 可以在 `references/layouts.md` 里扩展；Style B 更严格，需要同步更新 `template-swiss.html`、`layouts-swiss.md`、`swiss-layout-lock.md` 和校验器。

**Codex 配图是必须的吗？**

不是。没有配图也能生成 PPT。配图流程只在需要照片、信息图、UI 情景图或封面时使用。

**怎么更新到最新版？**

重新运行安装命令，或在本地 skill 目录执行 `git pull`。

**适合什么场景？**

适合：线下分享、行业内部讲话、私享会、AI 产品发布、demo day、带强烈个人风格的演讲。

不适合：大段表格数据、培训课件（信息密度不够）、需要多人协作编辑（静态 HTML）。

**为什么选择 HTML 而不是 PPTX？**

Agent 最擅长处理文本和代码。HTML/CSS 是文本，能被生成、修改、diff、预览、校验；Markdown 太弱做不了精细排版；传统 PPTX 又太封闭，Agent 直接编辑起来很麻烦。HTML deck 刚好卡在中间——比 Markdown 表现力高，又比原生 PPT 更适合 Agent 修改。PPT 不一定先是 PPTX，它可以先是一个可运行、可检查、可迭代的 HTML artifact。
