---
name: UI 设计系统
slug: design-skill
category: UI/UX设计与前端美化
tags: [design, system, component]
description: 构建一致性 UI 设计系统的核心原则、Token 体系与组件规范
---

# UI 设计系统

## 简介

UI 设计系统（Design System）是一套由设计 Token、组件规范、交互模式和文档组成的完整体系，旨在为团队建立一致的视觉语言和开发标准。在 AI 辅助开发时代，设计系统的重要性更加凸显——它为 AI 编码助手提供了明确的约束和参考，避免生成千篇一律的"AI 风格"界面。

当前主流的 AI 编码工具（如 Claude Code、Cursor、Codex）都支持通过 Skill 文件加载设计规范。将设计系统以结构化方式注入 AI 上下文，可以显著提升生成界面的品质和一致性。Anthropic 官方的 `frontend-design` Skill、社区维护的 `Impeccable`、`UI/UX Pro Max` 以及 `TypeUI` 等工具，都是围绕设计系统理念构建的 AI 辅助方案。

## 核心功能

### 1. 设计 Token 体系

设计 Token 是设计系统的原子级变量，将颜色、间距、字号等视觉决策抽象为可复用的变量，实现跨平台、跨工具的一致性传播。

Token 分为三个层级：

```
全局 Token（Primitive）  → 原始值定义，如颜色色值、间距数值
  → 别名 Token（Semantic）  → 语义化引用，关联用途，如 primary-action、error-foreground
    → 组件 Token（Component）  → 组件内部变量，如 button-bg、card-radius
```

**全局 Token** 定义所有可用的原始值：

```css
:root {
  /* 颜色 */
  --blue-500: #0066cc;
  --red-500: #dc2626;
  --gray-100: #f3f4f6;
  --gray-900: #111827;

  /* 间距 */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-pill: 9999px;

  /* 字号 */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;

  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
}
```

**别名 Token** 赋予语义含义，实现主题切换：

```css
:root {
  /* 语义颜色 */
  --color-primary: var(--blue-500);
  --color-danger: var(--red-500);
  --color-bg: var(--gray-100);
  --color-text: var(--gray-900);

  /* 语义间距 */
  --spacing-inline: var(--space-sm);
  --spacing-stack: var(--space-md);

  /* 语义圆角 */
  --radius-card: var(--radius-lg);
  --radius-button: var(--radius-md);
}

/* 暗色主题只需覆盖别名 Token */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: var(--gray-900);
    --color-text: var(--gray-100);
  }
}
```

**组件 Token** 限定在组件作用域内：

```css
:root {
  --button-bg: var(--color-primary);
  --button-radius: var(--radius-button);
  --button-padding: var(--spacing-inline) var(--space-md);
  --card-bg: var(--color-bg);
  --card-radius: var(--radius-card);
  --card-shadow: var(--shadow-md);
}
```

### 2. 组件规范

组件规范定义每个组件的结构、状态和交互行为：

- **结构**：HTML 语义化标签、ARIA 属性、插槽定义
- **状态**：默认、悬停、聚焦、激活、禁用、加载
- **变体**：尺寸（sm/md/lg）、颜色（primary/secondary/danger）、风格（filled/outlined/ghost）
- **交互**：点击、键盘导航、焦点管理、动画过渡

### 3. 主题与多品牌支持

通过 Token 别名机制，一套组件可适配多个品牌或主题：

```css
/* 品牌 A */
.brand-a {
  --color-primary: #c4553a;  /* 赤陶色 */
  --font-heading: 'Crimson Pro', serif;
}

/* 品牌 B */
.brand-b {
  --color-primary: #2563eb;  /* 品牌蓝 */
  --font-heading: 'Inter', sans-serif;
}
```

### 4. 无障碍（Accessibility）

设计系统必须内建无障碍支持：

- 颜色对比度满足 WCAG AA 标准（4.5:1 正文，3:1 大文本）
- 焦点状态可见且清晰
- 支持减少动画偏好（`prefers-reduced-motion`）
- 语义化 HTML 和 ARIA 标注
- 键盘可操作所有交互

## 安装与使用

### 方式一：Anthropic 官方 frontend-design Skill

这是 Anthropic 官方维护的设计 Skill，每周超过 11 万次安装，覆盖 Claude Code、Codex 和 Gemini CLI：

```bash
npx skills add --skill frontend-design
```

使用时直接向 AI 描述需求，Skill 会自动加载设计约束：

```
"为生产力应用构建着陆页，排版优先，暗色编辑风格。"
"创建音乐播放器界面，极繁主义，90年代硬件灵感。"
```

### 方式二：Impeccable Skill

Impeccable 是社区最活跃的设计 Skill 之一，提供 23 个命令和 27 条确定性反模式检测规则：

```bash
npx skills add pbakaus/impeccable
```

核心命令：

| 命令 | 功能 |
|------|------|
| `/typeset` | 优化排版与字体 |
| `/colorize` | 调整配色方案 |
| `/animate` | 添加动画效果 |
| `/layout` | 优化布局结构 |
| `/bolder` | 增强视觉冲击力 |
| `/quieter` | 降低视觉噪音 |
| `/delight` | 添加微交互细节 |
| `/extract` | 提取可复用组件和 Token |
| `/adapt` | 适配不同设备/场景 |
| `/onboard` | 设计引导流程和空状态 |

### 方式三：TypeUI 设计 Skill

TypeUI 提供 67 个精心策划的设计风格 Skill，支持一键拉取：

```bash
# 拉取 Paper 风格
npx typeui.sh pull paper

# 拉取 Bento 风格
npx typeui.sh pull bento

# 拉取 Neobrutalism 风格
npx typeui.sh pull neobrutalism

# 拉取 Glassmorphism 风格
npx typeui.sh pull glassmorphism
```

可用风格包括：Paper、Neumorphism、Bento、Artistic、Neobrutalism、Glassmorphism、Bold、Cafe、Dramatic、Refined、Energetic 等。

### 方式四：UI/UX Pro Max Skill

提供可搜索的设计数据库，包含 57 种 UI 风格、95 套配色、56 种字体搭配和 98 条 UX 准则：

```bash
# 在 Claude Code 中安装
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill

# 生成设计系统
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "saas dashboard" --design-system -p "MyApp"
```

### 方式五：Designer Skills Collection

包含 63 个设计 Skill 和 27 个命令，覆盖研究、系统、策略、UI、交互设计、原型测试和设计运营：

```bash
git clone https://github.com/marieclairedean/designer-skills-collection
cp -r designer-skills-collection/skills ~/.claude/skills/
```

## 使用方法与示例

### 示例一：从零构建设计 Token 体系

1. 定义全局 Token（颜色、间距、字号、圆角、阴影）
2. 创建语义别名（关联用途而非原始值）
3. 为每个组件定义组件 Token
4. 编写暗色主题覆盖
5. 使用 Style Dictionary 或 Theo 编译为多平台输出

```bash
# 使用 Style Dictionary 编译 Token
npx style-dictionary build --config=./tokens/config.json
```

### 示例二：在项目中应用设计系统

```css
/* 正确：使用语义 Token */
.card {
  background: var(--card-bg);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  padding: var(--space-md);
}

/* 错误：硬编码原始值 */
.card {
  background: #f3f4f6;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}
```

### 示例三：配合 AI Skill 生成界面

在 Claude Code 中安装设计 Skill 后，通过自然语言描述需求：

```
"使用我们的设计系统 Token 构建一个用户设置页面，
包含头像上传、个人信息表单和通知偏好设置。
遵循 --color-primary 和 --radius-card 等已有 Token。"
```

AI 会自动引用项目中的 Token 定义，确保生成代码与设计系统一致。

### 示例四：设计审查与反模式检测

使用 Impeccable 的审查功能：

```
"审查这个页面的设计质量，检查排版、配色和布局问题。"
```

Skill 会自动检测常见反模式：过度使用 Inter/Roboto 字体、紫色渐变、通用卡片网格、缺少焦点状态等。

## 配置选项

### Token 组织方式

| 方式 | 适用场景 | 说明 |
|------|----------|------|
| 单文件 | 小型项目 | 所有 Token 在一个 CSS 文件中 |
| 按类别分文件 | 中型项目 | `tokens-colors.css`、`tokens-spacing.css` 等 |
| 按层级分文件 | 大型项目 | `primitive.css`、`semantic.css`、`component.css` |
| 按主题分文件 | 多品牌 | `theme-light.css`、`theme-dark.css`、`theme-brand-a.css` |

### W3C Design Tokens 社区标准

2026 年推荐使用 W3C Design Tokens 格式（JSON）作为 Token 的单一数据源，再通过工具编译为各平台输出：

```json
{
  "color": {
    "primary": {
      "$value": "#0066cc",
      "$type": "color",
      "$description": "品牌主色"
    },
    "danger": {
      "$value": "#dc2626",
      "$type": "color",
      "$description": "错误/危险状态色"
    }
  },
  "spacing": {
    "md": {
      "$value": "1rem",
      "$type": "dimension",
      "$description": "标准间距"
    }
  }
}
```

### 响应式 Token

为不同断点定义 Token 变体：

```css
:root {
  --font-size-body: var(--text-base);
  --grid-columns: 4;
  --container-max: 640px;
}

@media (min-width: 768px) {
  :root {
    --font-size-body: var(--text-lg);
    --grid-columns: 8;
    --container-max: 768px;
  }
}

@media (min-width: 1024px) {
  :root {
    --grid-columns: 12;
    --container-max: 1024px;
  }
}
```

### 无障碍 Token

```css
:root {
  --focus-ring: 2px solid var(--color-primary);
  --focus-ring-offset: 2px;
  --min-touch-target: 44px;
  --motion-duration: 200ms;
  --motion-easing: ease-out;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-duration: 0ms;
  }
}
```

## 最佳实践

1. **Token 优先**：永远不要在组件中硬编码颜色值、间距或字号，始终使用 Token。如果现有 Token 不够用，先添加新 Token 再引用。

2. **语义化命名**：Token 名称应表达用途而非外观。用 `--color-danger` 而非 `--red-500`，用 `--spacing-stack` 而非 `--space-16`。

3. **三层抽象**：保持 Primitive → Semantic → Component 的层级关系。组件 Token 引用语义 Token，语义 Token 引用原始 Token。避免跨层引用。

4. **渐进式采用**：不必一次性建立完整系统。从颜色和间距 Token 开始，逐步扩展到排版、阴影、动画等。

5. **单一数据源**：使用 W3C Design Tokens JSON 格式作为 Token 的唯一定义源，通过 Style Dictionary 等工具编译为 CSS、iOS、Android 等多平台输出。

6. **AI Skill 配合**：将设计 Token 和组件规范写入项目的 `CLAUDE.md` 或 Skill 文件，让 AI 编码助手自动遵循设计约束，避免生成与系统不一致的代码。

7. **自动化检查**：通过 CI/CD 流水线或 Git Hooks 执行设计系统检查——对比度检测、Token 使用合规性、组件命名规范等。确定性检查优于文档约束。

8. **文档与示例**：每个组件都应有使用示例、变体展示和交互说明。Storybook 是常用的组件文档工具。

9. **版本管理**：设计系统应独立版本管理，使用语义化版本号（SemVer），让消费方明确升级影响。

10. **品牌与产品分离**：Impeccable Skill 的品牌模式（营销、作品集、编辑类）和产品模式（应用 UI、仪表盘、内部工具）需要不同的设计策略，不要混用。

## 常见问题

### Q：Token 层级太多，维护成本高怎么办？

保持精简。大多数项目只需要 Primitive + Semantic 两层。Component Token 仅在需要组件级主题化时才添加。层级过多会导致选择困难和命名混乱，反而削弱系统化收益。

### Q：AI 生成的界面总是千篇一律，如何改善？

安装 `frontend-design` 或 `Impeccable` 等 Skill，它们会禁止 AI 使用 Inter/Roboto 等过度使用的字体，禁止紫色渐变等陈词滥调，强制 AI 在生成前明确选择设计方向。同时将项目的设计 Token 写入 Skill 文件，让 AI 遵循你的品牌规范。

### Q：设计系统和组件库有什么区别？

设计系统是更大的概念，包含设计原则、Token 体系、组件规范、交互模式、文案指南和文档。组件库只是设计系统的可执行部分——即代码实现的组件集合。设计系统指导组件库的构建，组件库是设计系统的落地实现。

### Q：如何让设计 Token 在 Figma 和代码之间保持同步？

使用 Style Dictionary 或 Tokens Studio 等工具，以 W3C Design Tokens JSON 格式作为单一数据源。设计师在 Figma 中编辑 Token，通过插件导出 JSON；工程师从 JSON 编译出 CSS 自定义属性、Tailwind 配置等。双向同步确保设计与代码始终一致。

### Q：暗色模式如何处理？

只需在 `@media (prefers-color-scheme: dark)` 或 `.dark-theme` 选择器中覆盖语义 Token 的值。由于组件引用的是语义 Token 而非原始值，主题切换会自动级联到所有组件，无需逐个修改。

### Q：多个 AI 设计 Skill 会不会冲突？

不会。不同 Skill 侧重不同层面——`frontend-design` 负责审美方向，`Impeccable` 负责反模式检测和微调，`Vercel Web Design Guidelines` 负责无障碍和性能审查。它们互补而非冲突，各自为 AI 输出增加不同维度的质量保障。

### Q：小型项目需要完整的设计系统吗？

不需要。从最基础的 Token 开始（颜色、间距、字号），写在 `:root` 中即可。随着项目成长再逐步扩展。关键是建立"使用 Token 而非硬编码"的习惯，这比系统规模更重要。
