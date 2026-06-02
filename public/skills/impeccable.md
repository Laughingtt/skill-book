---
slug: impeccable
name: Impeccable
category: UI/UX设计与前端美化
tags: [design, polish, audit, animate, adapt, frontend, impeccable, visual]
description: 前端视觉品质全方位技能包，覆盖打磨、审计、动画、适配、优化、色彩化等20+子技能
install: "npx skills add https://github.com/pbakaus/impeccable --skill impeccable"
source: "https://www.skills.sh/pbakaus/impeccable/impeccable"
---

# Impeccable

## 简介

Impeccable 是由 Paul Bakaus（jQuery UI 创始人、前 Google Chrome DevTools 产品负责人）创建的开源 AI 设计技能，旨在解决 AI 编码工具生成 UI 时千篇一律的问题。所有大语言模型都从相同的模板学习，导致生成的界面总是出现同样的特征：Inter 字体、紫色渐变、卡片嵌套卡片、彩色背景上的灰色文字、bounce/elastic 弹性动画——这些被称为"AI slop"。

Impeccable 不是组件库，不是设计系统，也不是 CSS 主题。它是一个**词汇层**，位于你的意图和 AI 执行之间，赋予 AI 真正的设计词汇和判断力。项目在 GitHub 上已获得超过 31,000 颗星，实测可将前端视觉品质提升 59%，且无需更换模型。

核心思路：你无法要求 AI "增加更多垂直韵律"，如果你不知道这个词存在。Impeccable 正是填补这个词汇鸿沟。

## 核心功能

### 7 大设计领域参考文件

Impeccable 内置 7 个领域深度参考指南，每个都包含具体的技术指令和最佳实践：

| 领域 | 覆盖内容 |
|------|----------|
| **Typography（排版）** | 字体配对、模块化比例尺、OpenType 特性、流体排版 |
| **Color & Contrast（色彩与对比）** | OKLCH 色彩空间、着色中性色、暗色模式、无障碍对比度 |
| **Spatial Design（空间设计）** | 间距系统、网格布局、视觉层级 |
| **Motion Design（动效设计）** | 缓动曲线、交错动画、减少动效偏好 |
| **Interaction Design（交互设计）** | 表单状态、焦点样式、加载模式 |
| **Responsive Design（响应式设计）** | 移动优先、流体设计、容器查询 |
| **UX Writing（UX 文案）** | 按钮标签、错误消息、空状态文案 |

### 23 个子命令

所有命令通过 `/impeccable` 统一入口访问：

| 命令 | 功能 |
|------|------|
| `/impeccable init` | 一次性初始化：收集设计上下文，生成 PRODUCT.md 和 DESIGN.md |
| `/impeccable craft` | 完整的"规划-构建"流程，含视觉迭代 |
| `/impeccable shape` | 在写代码前规划 UX/UI 方案 |
| `/impeccable document` | 从现有项目代码生成 DESIGN.md |
| `/impeccable extract` | 提取可复用组件和设计 Token 到设计系统 |
| `/impeccable audit` | 技术质量检查：无障碍、性能、响应式 |
| `/impeccable critique` | UX 设计审查：层级、清晰度、情感共鸣 |
| `/impeccable polish` | 最终打磨：设计系统对齐、上线就绪 |
| `/impeccable bolder` | 让平淡设计更大胆、更有冲击力 |
| `/impeccable quieter` | 让设计更安静内敛，适合专注型界面 |
| `/impeccable distill` | 去除冗余，提炼设计核心 |
| `/impeccable harden` | 硬化设计：空状态、边界情况、错误处理、国际化 |
| `/impeccable onboard` | 新用户引导流程设计 |
| `/impeccable animate` | 添加有目的的动画和微交互 |
| `/impeccable colorize` | 色彩方案优化与主题配色调整 |
| `/impeccable typeset` | 排版优化：字体层级、比例尺、间距 |
| `/impeccable layout` | 布局调整：间距、网格、视觉层级 |
| `/impeccable delight` | 添加愉悦细节，提升用户好感 |
| `/impeccable overdrive` | 超驱动模式：着色器、弹簧物理、滚动驱动动画 |
| `/impeccable clarify` | 优化标签、微文案和 UX 消息 |
| `/impeccable adapt` | 多端多分辨率适配 |
| `/impeccable optimize` | 渲染性能和视觉加载优化 |
| `/impeccable live` | 浏览器内实时迭代：选取元素，获取三种变体 |

### 反模式（Anti-Patterns）库

这是 Impeccable 最具独创性的部分——明确告诉 AI **不要做什么**，直接对抗训练数据偏见：

- 不要使用过度使用的字体（Inter、Arial、系统默认字体）
- 不要在彩色背景上使用灰色文字
- 不要使用纯黑/纯灰（始终着色处理）
- 不要把所有内容包裹在卡片中，或卡片嵌套卡片
- 不要使用 bounce/elastic 弹性缓动（感觉过时）
- 不要使用紫色渐变和玻璃拟态
- 不要在每个标题上方放圆角方形图标

## 安装与使用

### 方式一：CLI 安装器（推荐）

从项目根目录运行：

```bash
npx impeccable skills install
```

此命令自动检测你的 AI 工具，并将编译好的构建写入正确位置（如 `.claude/skills/`、`.cursor/skills/`）。支持 Cursor、Claude Code、GitHub Copilot、Gemini CLI、Codex CLI 等所有主流工具。

更新时运行：

```bash
npx impeccable skills update
```

检查是否需要更新：

```bash
npx impeccable skills check
```

### 方式二：Claude Code 插件市场

```bash
/plugin marketplace add pbakaus/impeccable
```

然后在 Claude Code 中打开 `/plugin`，从 Discover 标签页安装。

### 方式三：npx skills 通用安装

```bash
npx skills add pbakaus/impeccable --skill impeccable
```

注意：此方式安装的是所有工具共享的构建版本，而非针对你的工具编译的版本，推荐优先使用方式一。

### 方式四：从仓库手动复制

```bash
git clone https://github.com/pbakaus/impeccable.git
cd impeccable

# Claude Code（项目级）
cp -r dist/claude-code/.claude your-project/

# Claude Code（全局）
cp -r dist/claude-code/.claude/ ~/.claude/

# Cursor（需切换到 Nightly 频道并启用 Agent Skills）
cp -r dist/cursor/.cursor your-project/
```

### 支持的 AI 工具

| 工具 | 安装位置 | 备注 |
|------|----------|------|
| Claude Code | `.claude/skills/` | 支持插件市场安装 |
| Cursor | `.cursor/skills/` | 需 Nightly 频道 + Agent Skills |
| Gemini CLI | `.gemini/skills/` | 需 preview 版本 |
| Codex CLI | `.agents/skills/` | 使用 `$impeccable` 语法 |
| VS Code Copilot | `.github/skills/` | — |
| Kiro | `.kiro/skills/` | — |
| OpenCode | — | — |
| Trae | `~/.trae/skills/` | — |

## 使用方法与示例

### 第一步：初始化项目

这是最重要的步骤。没有上下文的设计必然产生通用输出：

```
/impeccable init
```

`init` 会运行简短的发现访谈，询问：
- **Register（注册类型）**：是品牌界面（营销站、落地页、作品集，设计即产品）还是产品界面（应用 UI、仪表盘、工具，设计服务于产品）？Register 决定所有下游默认值——字体、动效能量、色彩密度等
- **目标用户**：谁在使用这个产品？
- **品牌个性**：产品应该传达什么感觉？
- **反参考**：你绝对不想看起来像什么？

完成后生成两个关键文件：
- **PRODUCT.md**：承载策略（谁、什么、为什么），包含 register、用户、品牌个性、反参考、设计原则
- **DESIGN.md**：承载视觉系统（颜色、排版、组件），遵循 Google Stitch DESIGN.md 六段式格式

### 第二步：捕获视觉系统

`init` 结束时会建议运行 `/impeccable document`，建议选择"是"。它会扫描你的 CSS 自定义属性、Tailwind 配置、CSS-in-JS 主题等，提取颜色和排版，生成 DESIGN.md。

### 第三步：开始设计工作

**直接描述需求：**

```
/impeccable redo this hero section
```

当不确定用哪个命令时，直接用自然语言描述，Impeccable 会自动选择合适的方案。

**使用具体命令：**

```
/impeccable audit blog              # 审计博客页面
/impeccable critique landing        # UX 设计审查落地页
/impeccable polish settings         # 上线前最终打磨设置页
/impeccable harden checkout         # 硬化结账流程
/impeccable typeset the header      # 优化头部排版
/impeccable bolder hero             # 让 hero 更大胆
/impeccable colorize the dashboard  # 优化仪表盘配色
```

**典型工作流链：**

```
/impeccable audit → /impeccable layout → /impeccable typeset → /impeccable polish
```

先审计发现问题，再修复布局，然后优化排版，最后打磨上线。

**从零开始构建：**

```
/impeccable craft
```

`craft` 将发现访谈串联为完整构建流程，含实时视觉迭代。支持利用 GPT Image 2 等图像生成能力预览设计方向。

**浏览器内实时迭代（Live Mode）：**

```
/impeccable live
```

在运行中的开发服务器上选取任意元素，留下评论或标注，获取三种生产级变体，通过 HMR 热替换预览。选择满意的变体后直接写回源码。

**固定常用命令为快捷方式：**

```
/impeccable pin audit    # 创建 /audit 快捷方式
/impeccable pin polish   # 创建 /polish 快捷方式
```

固定后可直接使用 `/audit`、`/polish` 等短命令。

## 配置选项

### PRODUCT.md

项目根目录的 PRODUCT.md 是 Impeccable 的主要驱动文件，包含：

- **Register**：`brand`（设计即产品）或 `product`（设计服务于产品）
- **Users**：目标用户描述
- **Voice**：品牌语调
- **Anti-references**：不想参考的设计方向
- **Design principles**：设计原则

Register 的选择至关重要：
- **Brand register**：营销站、落地页、作品集——允许编辑式字体、高动效能量、大胆色彩
- **Product register**：应用 UI、仪表盘、工具——使用产品级字体、克制动效、功能优先色彩

指定 Register 后，`/impeccable typeset` 不会在仪表盘上推编辑杂志字体，也不会在营销页上推产品级默认值。

### DESIGN.md

项目根目录的 DESIGN.md 承载视觉系统，遵循 Google Stitch 六段式格式：
1. Colors
2. Typography
3. Elevation
4. Components
5. Do's
6. Don'ts

可通过 `/impeccable document` 从现有代码自动生成，也可手动编写。每次命令执行前都会读取此文件。

### CLI 检测器

Impeccable 包含独立 CLI，无需 AI 工具即可检测反模式：

```bash
npx impeccable detect src/
```

检测器覆盖 41 条确定性规则，包括：
- AI slop 检测：侧边条纹边框、紫色渐变、bounce 缓动、暗色发光
- 通用设计质量：行长度、拥挤间距、小触控目标、跳过标题层级

支持 JSON 输出和退出码，适合集成到 CI/CD 流水线：

```bash
npx impeccable detect src/ --format json
```

### Chrome 扩展

可从 Chrome Web Store 安装 Impeccable Chrome 扩展，在任意页面上运行检测器覆盖层——你的预发布环境、竞品网站、浏览器中的任何页面。

## 最佳实践

1. **始终先运行 `/impeccable init`**：没有上下文的设计必然是通用的。初始化只需几分钟，但影响所有后续命令的输出质量。

2. **从已有内容迭代，而非从空白开始**：AI 编码工具在从零创建时最弱。先提供方向——Figma 设计稿、手绘草图照片、或让 `/impeccable craft` 生成预览。

3. **链式使用命令**：不要只运行一个命令就停止。典型流程是 audit → layout → typeset → polish，每一步建立在上一步的基础上。

4. **使用聚焦参数**：大多数命令接受可选的区域参数，如 `/impeccable audit header`、`/impeccable polish checkout-form`。精准聚焦让 AI 不会触碰已经正常工作的部分。

5. **善用 Live Mode**：当编辑更容易"指出来"而非"说出来"时，使用 `/impeccable live` 在浏览器中直接选取元素迭代。

6. **定期运行 detect**：将 `npx impeccable detect src/` 加入 CI 流水线，在 PR 检查中捕获 AI slop。

7. **保持 PRODUCT.md 和 DESIGN.md 更新**：当项目方向变化时，重新运行 `/impeccable init` 更新上下文。这两个文件不会被更新命令覆盖。

8. **区分 Brand 和 Product register**：营销页面和工具型应用的设计需求截然不同，正确设置 Register 可避免不合适的默认值。

## 常见问题

**Q：Impeccable 和 Anthropic 官方的 frontend-design 技能有什么区别？**

A：Impeccable 在 Anthropic 官方 frontend-design 技能（27.7 万安装量）基础上构建，增加了 7 个领域深度参考文件、23 个精确控制命令、以及显式反模式库。官方技能是起点，Impeccable 是完整的设计系统层。

**Q：Impeccable 支持哪些 AI 编码工具？**

A：支持 Claude Code、Cursor（需 Nightly 频道）、Gemini CLI（需 preview 版本）、Codex CLI、VS Code Copilot、Kiro、OpenCode、Pi、Trae、Rovo Dev、Qoder 等。构建系统将单一源格式编译为各工具的专用方言。

**Q：Codex CLI 的命令语法不同吗？**

A：是的。Codex 使用 `/prompts:audit`、`/prompts:polish` 等语法，而非 `/impeccable audit`。也可通过 `/skills` 或输入 `$impeccable` 访问。

**Q：安装后看不到 `/impeccable` 命令怎么办？**

A：重新加载你的 AI 工具。安装后需要重启才能识别新技能。如果使用 Cursor，确保已切换到 Nightly 频道并在设置中启用 Agent Skills。

**Q：PRODUCT.md 和 DESIGN.md 会被更新覆盖吗？**

A：不会。运行 `npx impeccable skills update` 只更新技能文件，你的 PRODUCT.md 和 DESIGN.md 永远不会被覆盖。

**Q：可以在已有项目上使用吗？**

A：完全可以。在已有项目上运行 `/impeccable init`，然后 `/impeccable document` 会扫描现有代码提取设计 Token。之后使用 audit、polish 等命令逐步改进。

**Q：Impeccable 是免费的吗？**

A：是的，Impeccable 完全免费且开源，代码托管在 GitHub：https://github.com/pbakaus/impeccable

**Q：实测效果如何？**

A：根据 Tessl 基准测试，Impeccable 在聚合评分上达到 0.82/1.00，相比基线提升 1.59 倍。OKLCH 色彩使用从 0 提升到 12/12 测试场景全覆盖。整体视觉品质提升约 59%，且无需更换底层模型。
