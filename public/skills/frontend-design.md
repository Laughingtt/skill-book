---
slug: frontend-design
name: Frontend Design
category: UI/UX设计与前端美化
tags: [frontend, design, react, tailwind, shadcn, page-generation]
description: 快速生成符合设计规范的前端页面，支持React/Tailwind/shadcn/ui
install: "npx skills add https://github.com/anthropics/skills --skill frontend-design"
source: "https://github.com/anthropics/skills"
---

# Frontend Design — AI 驱动的前端设计技能

## 简介

Frontend Design 是 Anthropic 官方发布的前端设计技能，旨在帮助 AI 生成**独特、生产级别**的前端界面，而非千篇一律的"AI 风格"页面。

传统 AI 生成前端页面时存在严重的**分布趋同**问题：Inter 字体、紫色渐变白底、千篇一律的卡片布局——这些是模型训练数据统计中心的产物，而非有意的设计选择。Frontend Design 技能通过注入设计思维框架和美学准则，打破这种趋同，让 AI 输出真正具有设计感和辨识度的界面。

**核心价值：**

- 摆脱 AI 生成界面的"模板感"，产出有辨识度的设计
- 支持从极简主义到极繁主义的多种美学方向
- 内建设计思维流程，确保每次生成都有明确的设计意图
- 兼容 React / Tailwind CSS / shadcn/ui 等主流技术栈

## 核心功能

| 功能 | 说明 |
|------|------|
| 设计思维引导 | 在编码前明确目的、调性、约束和差异化方向 |
| 排版系统 | 独特字体选择与搭配，避免 Inter/Roboto 等泛用字体 |
| 色彩与主题 | CSS 变量驱动的主题系统，支持大胆配色方案 |
| 动效设计 | CSS 动画优先，React 项目推荐 Motion 库 |
| 空间构图 | 非对称布局、网格突破、留白与密度的精准控制 |
| 视觉细节 | 渐变网格、噪点纹理、几何图案、装饰边框等氛围营造 |
| 响应式适配 | 移动优先的布局策略，断点系统设计 |
| 暗色模式 | 基于 CSS 变量的主题切换，OKLCH 色彩空间支持 |

## 安装与使用

### 安装

```bash
npx skills add https://github.com/anthropics/skills --skill frontend-design
```

或通过 Claude Code 插件页面直接安装。

### 基本使用流程

1. **描述需求** — 告诉 AI 你要构建什么（组件、页面、应用）
2. **提供上下文** — 说明目的、受众、技术约束
3. **AI 设计思考** — 技能自动引导 AI 进行设计思维分析
4. **生成代码** — AI 按照设计方向产出独特的前端代码
5. **迭代优化** — 根据预览效果调整设计方向

### 使用示例

```
输入："构建一个音乐播放器界面"
→ AI 分析：目的（音乐消费）、调性（暗色氛围感）、差异化（黑胶唱片视觉隐喻）
→ 生成：深色主题 + 暖色调点缀 + 旋转唱片动画 + 非对称布局
```

```
输入："设计一个项目管理仪表盘"
→ AI 分析：目的（数据监控）、调性（专业精致）、差异化（编辑式排版 + 数据可视化叙事）
→ 生成：杂志式排版 + 精细数据图表 + 克制动效 + 高对比度排版
```

## 设计思维框架

技能在编码前强制执行四步设计思考：

### 1. 目的（Purpose）

- 这个界面解决什么问题？
- 目标用户是谁？
- 核心交互路径是什么？

### 2. 调性（Tone）

选择一个**极端**的美学方向，而非安全的中间地带：

| 方向 | 特征 | 适用场景 |
|------|------|----------|
| 极简精致 | 大量留白、精确排版、微妙细节 | 奢侈品、高端产品 |
| 极繁主义 | 密集信息、丰富纹理、视觉冲击 | 创意机构、艺术项目 |
| 复古未来 | 怀旧元素 + 现代技术感 | 科技产品、游戏 |
| 有机自然 | 柔和曲线、自然色调、流动感 | 健康、环保、生活方式 |
| 编辑杂志 | 强排版、网格系统、内容驱动 | 新闻、博客、出版 |
| 粗野主义 | 原始感、大胆色块、打破规则 | 实验性项目、独立品牌 |
| 玩具趣味 | 圆角、鲜艳色彩、游戏化元素 | 儿童产品、休闲应用 |

**关键原则：大胆的极繁主义和精致的极简主义都有效——重要的是意图性，而非强度。**

### 3. 约束（Constraints）

- 技术框架（React / Vue / 原生 HTML）
- 性能要求（首屏加载、动画帧率）
- 无障碍标准（WCAG 等级）
- 浏览器兼容性

### 4. 差异化（Differentiation）

- 什么让这个设计**令人难忘**？
- 如何避免与同类产品雷同？
- 哪个视觉隐喻可以贯穿整个设计？

## 布局设计

### Flexbox 布局模式

```css
/* 经典侧边栏 + 主内容区 */
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  flex: 0 0 260px;
  border-right: 1px solid var(--border);
}

.main-content {
  flex: 1;
  overflow-y: auto;
}

/* 居中卡片布局 */
.centered-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
```

### CSS Grid 布局模式

```css
/* 响应式仪表盘网格 */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

/* 杂志式非对称布局 */
.magazine-layout {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: var(--spacing-md);
}

.hero-article {
  grid-row: span 2;
}
```

### 响应式断点策略

```css
/* 移动优先断点系统 */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

/* Tailwind 断点对应 */
/* sm: @media (min-width: 640px) */
/* md: @media (min-width: 768px) */
/* lg: @media (min-width: 1024px) */
/* xl: @media (min-width: 1280px) */
```

### 空间构图原则

技能鼓励**打破常规**的布局方式：

- **非对称构图** — 避免一切居中、一切等距的"安全"布局
- **元素重叠** — 利用 z-index 和负 margin 创造层次感
- **对角线流动** — 引导视线沿非水平方向移动
- **网格突破** — 让关键元素溢出网格容器
- **极端留白或极端密度** — 根据调性选择，避免中间地带

## 样式系统

### CSS 变量与 Design Tokens

采用三层 Token 架构确保设计一致性：

```css
:root {
  /* 第一层：原始值 */
  --blue-500: #3b82f6;
  --spacing-4: 1rem;

  /* 第二层：语义 Token */
  --color-primary: var(--blue-500);
  --space-md: var(--spacing-4);

  /* 第三层：组件 Token */
  --button-bg: var(--color-primary);
  --button-padding: var(--space-md);
  --input-border: var(--color-border);
}
```

### OKLCH 色彩空间（Tailwind v4 推荐）

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.7 0.15 260);
  --accent: oklch(0.65 0.2 30);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.75 0.15 260);
}
```

OKLCH 相比 HSL/HEX 的优势：明度感知更均匀，调整饱和度和色相时不会产生意外的明度变化。

### Tailwind CSS 主题映射

```css
/* Tailwind v4 风格 */
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-accent: var(--accent);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --font-display: "Playfair Display", serif;
  --font-body: "Source Sans 3", sans-serif;
}
```

### shadcn/ui 集成

```bash
# 初始化 shadcn/ui
npx shadcn-ui@latest init

# 按需添加组件
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add card
```

shadcn/ui 的核心优势：

- **非库模式** — 组件代码直接复制到项目中，完全可控
- **Radix UI 基础** — 内置无障碍支持（键盘导航、ARIA 属性）
- **Tailwind 样式** — 与设计 Token 系统无缝集成
- **可定制性** — 修改 `components/ui/` 下的源码即可自定义

### 排版系统

技能要求选择**独特且有性格**的字体：

```css
:root {
  /* 展示字体 — 用于标题，追求辨识度 */
  --font-display: "Playfair Display", "DM Serif Display", serif;

  /* 正文字体 — 用于长文阅读，追求舒适度 */
  --font-body: "Source Sans 3", "IBM Plex Sans", sans-serif;

  /* 等宽字体 — 用于代码和数据显示 */
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
}
```

**字体选择原则：**

- 绝对避免 Inter、Roboto、Arial、system-ui 等泛用字体
- 展示字体与正文字体形成对比（衬线 + 无衬线搭配）
- 不要在多次生成中收敛到同一选择（如反复使用 Space Grotesk）
- 根据项目调性选择：编辑风格用衬线、科技风格用几何无衬线、手作风格用手写体

### 色彩策略

```css
:root {
  /* 主色调 — 占据视觉主导 */
  --color-dominant: oklch(0.2 0.02 260);

  /* 强调色 — 少量使用，制造焦点 */
  --color-accent: oklch(0.7 0.25 30);

  /* 中性色 — 支撑信息层次 */
  --color-neutral: oklch(0.5 0.01 260);
}
```

**色彩原则：**

- 主色 + 锐利强调色胜过 timid 的均匀分布色板
- 绝对避免紫色渐变白底这一 AI 生成标志
- 每次生成选择不同的色彩方向
- 暗色主题和亮色主题交替使用

## 组件设计模式

### 容器-展示分离模式

```jsx
// 容器组件 — 处理逻辑和数据
function UserDashboardContainer() {
  const { data, isLoading } = useUserData();
  if (isLoading) return <DashboardSkeleton />;
  return <UserDashboardPresentation user={data} />;
}

// 展示组件 — 纯视觉渲染
function UserDashboardPresentation({ user }) {
  return (
    <div className="dashboard-grid">
      <ProfileCard user={user} />
      <ActivityFeed activities={user.activities} />
    </div>
  );
}
```

### 复合组件模式

```jsx
// 父组件管理状态，子组件通过 context 共享
function Card({ children, className }) {
  return (
    <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className }) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>;
};

Card.Content = function CardContent({ children, className }) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
};
```

### 受控组件模式

```jsx
function SearchInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
    />
  );
}
```

### 错误边界模式

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI onReset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
```

## 动效设计

### CSS 动画优先（HTML 项目）

```css
/* 页面加载交错动画 */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stagger-item:nth-child(1) { animation-delay: 0ms; }
.stagger-item:nth-child(2) { animation-delay: 80ms; }
.stagger-item:nth-child(3) { animation-delay: 160ms; }

.stagger-item {
  animation: fadeSlideUp 0.5s ease-out both;
}
```

### Motion 库（React 项目推荐）

```jsx
import { motion, AnimatePresence } from "motion/react";

function PageTransition({ children }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### 动效原则

- **一次精心编排的页面加载动画**（交错 reveal + animation-delay）比零散的微交互更有冲击力
- 滚动触发动画增加叙事感
- 悬停状态要有惊喜感（不只是颜色变化）
- 尊重 `prefers-reduced-motion` 无障碍偏好

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 视觉细节与氛围营造

技能鼓励创造**有深度和氛围**的背景，而非纯色填充：

| 技术 | 效果 | CSS 实现 |
|------|------|----------|
| 渐变网格 | 流动的色彩氛围 | `background: radial-gradient(...)` 多层叠加 |
| 噪点纹理 | 复古质感 | SVG filter 或 `url("data:image/svg+xml,...")` |
| 几何图案 | 结构感 | CSS `background-image` 重复图案 |
| 透明度层叠 | 深度与层次 | `backdrop-filter: blur()` + 半透明色 |
| 装饰边框 | 精致感 | `border-image` 或 SVG 边框 |
| 颗粒叠加 | 胶片质感 | 伪元素 + noise SVG |
| 自定义光标 | 互动趣味 | `cursor: url(...)` |

```css
/* 氛围背景示例 */
.atmospheric-bg {
  background:
    radial-gradient(ellipse at 20% 50%, oklch(0.3 0.1 280 / 0.5), transparent 50%),
    radial-gradient(ellipse at 80% 20%, oklch(0.4 0.15 30 / 0.3), transparent 40%),
    var(--color-dominant);
}

/* 噪点纹理叠加 */
.grain-overlay::after {
  content: "";
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
}
```

## 性能优化

### 渲染优化

```jsx
// React.memo — 避免不必要的重渲染
const ExpensiveCard = React.memo(function ExpensiveCard({ data }) {
  return <Card>{/* 复杂渲染逻辑 */}</Card>;
});

// useMemo — 缓存计算结果
const sortedItems = useMemo(
  () => items.sort((a, b) => a.priority - b.priority),
  [items]
);

// useCallback — 稳定回调引用
const handleClick = useCallback((id) => {
  setSelected(id);
}, []);
```

### 代码分割

```jsx
// React.lazy — 路由级懒加载
const Dashboard = React.lazy(() => import("./Dashboard"));
const Settings = React.lazy(() => import("./Settings"));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### CSS 性能

- 使用 `content-visibility: auto` 延迟屏幕外元素渲染
- 避免大面积 `box-shadow` 和 `filter`，改用伪元素 + `will-change`
- Tailwind CSS 本身通过 PurgeCSS 自动移除未使用的样式
- 动画优先使用 `transform` 和 `opacity`（GPU 加速属性）

### 图片与资源

- 使用 `<picture>` + `srcset` 提供响应式图片
- WebP/AVIF 格式优先，JPEG 兜底
- 关键图片添加 `fetchpriority="high"`
- 装饰图片添加 `loading="lazy"`

## 最佳实践

### 设计一致性

1. **先建 Token 系统，再生成组件** — 每个组件引用同一套 CSS 变量，避免第五个组件开始"走样"
2. **语义化命名** — 使用 `--color-action-primary` 而非 `--blue-500`，换色时只改一处
3. **组件变体通过 Token 切换** — 暗色模式、品牌切换只需替换变量值

### AI 生成质量控制

1. **明确调性方向** — 不要说"好看的设计"，要说"暗色氛围感 + 暖色调点缀 + 黑胶唱片隐喻"
2. **拒绝泛用选择** — 如果 AI 输出 Inter + 紫色渐变，要求重新生成
3. **每次生成追求不同** — 同一需求可以产出截然不同的设计方向
4. **匹配复杂度与愿景** — 极繁设计需要精细代码，极简设计需要精确间距

### 无障碍设计

- 色彩对比度至少 4.5:1（正文）和 3:1（大文本）
- 所有交互元素支持键盘导航
- 图片提供 `alt` 文本
- 动画尊重 `prefers-reduced-motion`
- 使用语义化 HTML 标签（`<nav>`、`<main>`、`<article>`）

### 项目结构

```
app/
├── components/
│   ├── ui/           # shadcn/ui 基础组件
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── card.tsx
│   └── features/     # 业务组件
├── lib/
│   └── utils.ts      # cn() 等工具函数
├── styles/
│   └── globals.css   # CSS 变量 + Tailwind 导入
└── hooks/            # 自定义 Hooks
```

## 常见问题

### Q: 为什么 AI 总是生成 Inter + 紫色渐变？

这是大模型的"分布趋同"问题——训练数据中这类设计出现频率最高，模型倾向于输出统计中心的结果。Frontend Design 技能通过设计思维框架和反模式清单打破这种趋同。

### Q: 如何确保多次生成的风格一致？

在 SKILL.md 或项目配置中定义设计 Token 系统（色彩、字体、间距变量），每次生成时引用同一套 Token。语义化 Token（如 `--color-primary`）比原始值（如 `--blue-500`）更易维护一致性。

### Q: shadcn/ui 和传统 UI 库（MUI、Chakra）有什么区别？

shadcn/ui 不是传统意义上的"库"——组件代码直接复制到你的项目中，你拥有完全控制权。没有 Provider 包裹、没有版本锁定、没有覆盖样式的 API 斗争。修改 `components/ui/button.tsx` 即可自定义，就像修改自己的代码一样。

### Q: Tailwind v4 有什么需要注意的变化？

- 使用 `@import "tailwindcss"` 替代 `@tailwind` 指令
- 色彩推荐使用 OKLCH 格式（感知均匀性更好）
- 使用 `size-*` 工具类替代 `w-* h-*` 组合
- 动画库从 `tailwindcss-animate` 迁移到 `tw-animate-css`
- 使用 `@theme inline` 映射 CSS 变量到 Tailwind 类

### Q: 如何在极简设计中避免"空洞感"？

极简不等于空白。关键在于：
- 排版精确到像素级（行高、字间距、段落间距）
- 微妙的纹理和阴影增加深度
- 有限的强调色制造视觉焦点
- 动效克制但精致（如 200ms 的 hover 过渡）

### Q: 生成的代码如何适配暗色模式？

使用 CSS 变量定义两套色值，通过 `.dark` 类或 `prefers-color-scheme` 媒体查询切换：

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
}
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
```

组件中使用 `var(--background)` 而非硬编码色值，暗色模式自动生效。
