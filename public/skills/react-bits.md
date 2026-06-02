---
slug: react-bits
name: React Bits
category: UI/UX设计与前端美化
tags: [react, animation, component, interaction, opensource]
description: 开源React动画组件库，提供70+种动画组件，npm install后直接复制代码使用
install: "npm install react-bits 或配置 MCP: npx -y reactbits-mcp-server"
source: "https://github.com/DavidHDev/react-bits"
---

# React Bits

## 简介

React Bits 是目前 GitHub 上增长最快的 React 动画组件库，由 David Haz 创建并维护，已获得 40K+ Stars。它提供 130+ 个精心设计的动画、交互式 UI 组件，涵盖文字动画、背景特效、交互动画和 UI 组件四大类别。每个组件都提供 JS/TS + CSS/Tailwind 四种代码变体，采用复制粘贴（copy-paste）模式，无需安装庞大的 npm 包，直接将代码复制到项目中即可使用。

核心理念是提供"statement pieces"——那些放到网站上就能让人眼前一亮的组件，如 3D Ballpit、Hyperspeed 背景等。所有组件都拥有丰富的可配置 props，支持实时预览和参数调节。

## 核心功能

- **130+ 动画组件**：文字动画、背景特效、交互动画、UI 组件四大分类
- **四种代码变体**：JS + CSS / TS + CSS / JS + Tailwind / TS + Tailwind，适配任意技术栈
- **复制粘贴模式**：无需安装依赖包，直接复制源码到项目，完全拥有代码控制权
- **CLI 快速安装**：支持 shadcn CLI 和 jsrepo 一键安装组件
- **MCP 服务器**：提供 MCP Server，可在 AI 编码工具中直接搜索和使用组件
- **可视化编辑器**：三个免费在线工具（Background Studio、Shape Magic、Texture Lab）可交互调整参数并导出代码
- **AI 友好**：与 Cursor、Copilot、v0 等 AI 编码工具深度集成
- **丰富 Props**：每个组件提供大量可配置属性，支持实时预览调节
- **响应式设计**：所有组件适配 320px 到 4K 分辨率
- **无障碍支持**：支持暗色模式和 reduced-motion 偏好

## 安装与使用

### 方式一：CLI 安装（推荐）

React Bits 支持 shadcn CLI 快速安装，自动处理依赖：

```bash
# 通过 shadcn CLI 安装组件（TS + Tailwind 版本）
npx shadcn@latest add @react-bits/BlurText-TS-TW

# 安装 CSS 版本
npx shadcn@latest add @react-bits/BlurText-TS-CSS

# JS 版本
npx shadcn@latest add @react-bits/BlurText-JS-TW
npx shadcn@latest add @react-bits/BlurText-JS-CSS
```

也可通过 jsrepo 安装：

```bash
npx jsrepo add github/DavidHDev/react-bits/BlurText
```

### 方式二：手动复制粘贴

1. 访问 [reactbits.dev](https://reactbits.dev)
2. 选择需要的组件
3. 在页面上选择技术栈（JS/TS + CSS/Tailwind）
4. 复制代码到项目
5. 安装组件所需的依赖（如 motion、gsap 等）

### 方式三：MCP 服务器

在 AI 编码工具中配置 MCP 服务器，直接通过对话搜索和使用组件：

```bash
# 直接运行
npx -y reactbits-dev-mcp-server

# 或安装后运行
npm install -g reactbits-dev-mcp-server
```

Claude Desktop 配置（`claude_desktop_config.json`）：

```json
{
  "mcpServers": {
    "reactbits": {
      "command": "npx",
      "args": ["reactbits-dev-mcp-server"],
      "env": {
        "GITHUB_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

Cursor 配置（`.cursorrules`）：

```json
{
  "mcpServers": {
    "reactbits": {
      "command": "npx",
      "args": ["reactbits-dev-mcp-server"]
    }
  }
}
```

MCP 服务器提供以下工具：
- `list_components`：列出所有组件，支持按分类和样式过滤
- `get_component`：获取指定组件的代码和文档
- `search_components`：按名称搜索组件
- `get_component_demo`：获取组件使用示例
- `list_categories`：列出所有组件分类

## 组件分类与示例

### 文字动画（Text Animations）

提供 20+ 种文字特效组件，适合标题、Hero 区域等场景：

| 组件 | 说明 |
|------|------|
| SplitText | 文字逐字拆分动画 |
| BlurText | 模糊渐显文字效果 |
| ShinyText | 闪光文字效果 |
| GradientText | 渐变色文字 |
| DecryptedText | 解密/乱码渐显效果 |
| GlitchText | 故障风格文字 |
| ScrollReveal | 滚动触发文字显现 |
| ScrollVelocity | 滚动速度驱动文字动画 |
| CountUp | 数字递增动画 |
| FuzzyText | 模糊抖动文字 |
| CircularText | 环形排列文字 |
| RotatingText | 旋转切换文字 |
| ScrambledText | 乱码渐变文字 |
| TrueFocus | 聚焦高亮文字 |

```jsx
// SplitText - 逐字动画
import SplitText from './components/SplitText';

function Hero() {
  return (
    <SplitText
      text="Hello World"
      className="text-4xl font-bold"
      delay={50}
      animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
      animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
      threshold={0.1}
      rootMargin="-50px"
    />
  );
}

// DecryptedText - 解密效果
import DecryptedText from './components/DecryptedText';

function SecretMessage() {
  return (
    <DecryptedText
      text="Classified Information"
      speed={50}
      maxIterations={10}
      characters="ABCD1234!@#$"
      className="text-2xl"
      parentClassName="decrypt-container"
      encryptedClassName="encrypted"
    />
  );
}
```

### 背景特效（Backgrounds）

提供 40+ 种沉浸式背景效果，适合全屏背景、Hero 区域：

| 组件 | 说明 |
|------|------|
| Hyperspeed | 超速线条动态背景 |
| Aurora | 极光效果 |
| Beams | 光束射线效果 |
| Lightning | 闪电效果 |
| Particles | 粒子系统 |
| Ballpit | 3D 球池交互背景（Three.js） |
| Iridescence | 彩虹光泽效果 |
| Waves | 波浪效果 |
| Aurora | 柔和极光 |
| Liquid Chrome | 液态金属效果 |
| Balatro | Balatro 风格背景 |
| Galaxy | 星系效果 |
| Grid Distortion | 网格扭曲 |
| Letter Glitch | 字母故障效果 |
| Ripple Grid | 涟漪网格 |
| Dot Field | 点阵场 |
| Shape Grid | 形状网格 |
| Color Bends | 色彩弯曲 |
| Silky | 丝绸流动效果 |
| Floating Lines | 浮动线条 |

```jsx
// Aurora - 极光背景
import Aurora from './components/Aurora';

function Page() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Aurora
        colorStops={['#3A29FF', '#FF94B4', '#FF3232']}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1>Content over Aurora</h1>
      </div>
    </div>
  );
}

// Particles - 粒子背景
import Particles from './components/Particles';

function ParticlePage() {
  return (
    <Particles
      particleColors={['#ffffff', '#ffd700']}
      particleCount={200}
      particleSpread={10}
      speed={0.1}
      particleBaseSize={100}
      moveParticlesOnHover
      alphaParticles
      disableAnimations
    />
  );
}
```

### 交互动画（Animations）

提供 25+ 种交互式动画效果，适合鼠标跟随、点击反馈等场景：

| 组件 | 说明 |
|------|------|
| Magnet | 磁性吸附效果 |
| ClickSpark | 点击火花效果 |
| SplashCursor | 水花光标 |
| BlobCursor | 斑点光标 |
| GhostCursor | 幽灵光标 |
| StarBorder | 星光边框 |
| ElectricBorder | 电流边框 |
| AnimatedContent | 动画内容容器 |
| FadeContent | 渐显内容 |
| GlareHover | 眩光悬浮 |
| TiltedCard | 倾斜卡片 |
| SpotlightCard | 聚光灯卡片 |
| PixelTrail | 像素轨迹 |
| ImageTrail | 图片轨迹 |
| Ribbons | 丝带效果 |
| MetaBalls | 元球效果 |
| MagicRings | 魔法光环 |
| Antigravity | 反重力效果 |
| MetallicPaint | 金属漆效果 |
| Crosshair | 准星效果 |

```jsx
// Magnet - 磁性吸附
import Magnet from './components/Magnet';

function MagneticButton() {
  return (
    <Magnet padding={50} disabled={false} strength={0.5}>
      <button className="magnetic-btn">Hover Me</button>
    </Magnet>
  );
}

// ClickSpark - 点击火花
import ClickSpark from './components/ClickSpark';

function SparkPage() {
  return (
    <ClickSpark
      sparkColor="#fff"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <div className="content">
        <p>Click anywhere for spark effect</p>
      </div>
    </ClickSpark>
  );
}
```

### UI 组件（Components）

提供 30+ 种功能性 UI 组件，适合导航、卡片、列表等场景：

| 组件 | 说明 |
|------|------|
| Dock | macOS 风格 Dock 栏 |
| AnimatedList | 动画列表 |
| TiltedCard | 3D 倾斜卡片 |
| SpotlightCard | 聚光灯卡片 |
| ProfileCard | 个人资料卡片 |
| CardSwap | 卡片切换 |
| Carousel | 轮播组件 |
| PillNav | 胶囊导航 |
| GooeyNav | 粘性导航 |
| StaggeredMenu | 交错菜单 |
| InfiniteMenu | 无限菜单 |
| BubbleMenu | 气泡菜单 |
| ChromaGrid | 色彩网格 |
| Masonry | 瀑布流布局 |
| ModelViewer | 3D 模型查看器 |
| CircularGallery | 环形画廊 |
| GlassSurface | 毛玻璃表面 |
| Counter | 计数器 |
| Stepper | 步进器 |
| ElasticSlider | 弹性滑块 |

```jsx
// Dock - macOS 风格 Dock
import Dock from './components/Dock';

function AppDock() {
  const items = [
    { icon: <HomeIcon />, label: 'Home', onClick: () => {} },
    { icon: <SearchIcon />, label: 'Search', onClick: () => {} },
    { icon: <SettingsIcon />, label: 'Settings', onClick: () => {} },
  ];

  return (
    <Dock
      items={items}
      panelHeight={68}
      baseItemSize={50}
      magnification={0.5}
    />
  );
}

// AnimatedList - 动画列表
import AnimatedList from './components/AnimatedList';

function ListDemo() {
  const items = ['React', 'Vue', 'Angular', 'Svelte', 'Solid'];

  return (
    <AnimatedList
      items={items}
      onItemSelect={(item, index) => console.log(item, index)}
      showGradients={true}
      enableArrowNavigation={true}
      displayScrollbar={true}
    />
  );
}
```

## 配置选项

### 技术栈选择

每个组件页面都提供四种代码变体切换：

- **JS + CSS**：纯 JavaScript + 原生 CSS，适合不使用 TypeScript 和 Tailwind 的项目
- **TS + CSS**：TypeScript + 原生 CSS，类型安全但不用 Tailwind
- **JS + Tailwind**：JavaScript + Tailwind CSS，快速样式开发
- **TS + Tailwind**：TypeScript + Tailwind CSS，推荐组合

### 常见依赖

不同组件可能需要以下依赖，安装组件时 CLI 会自动处理：

```bash
# 动画库（最常用）
npm install motion

# GSAP 动画
npm install gsap

# Three.js 3D 效果（Ballpit、ModelViewer 等）
npm install three @react-three/fiber

# OGL 3D 轻量引擎
npm install ogl
```

### Reduced Motion 支持

组件尊重用户的 `prefers-reduced-motion` 系统偏好，在辅助功能设置中开启减少动画后，组件会自动降级或禁用动画效果。

## 最佳实践

1. **按需复制**：只复制需要的组件代码，避免引入不必要的依赖。每个组件都是独立的，不会引入整个库
2. **优先使用 CLI**：通过 shadcn CLI 安装可自动处理依赖关系，减少手动配置错误
3. **选择合适的技术栈**：如果项目已使用 Tailwind，选择 Tailwind 变体；否则 CSS 变体更轻量
4. **利用可视化编辑器**：在 reactbits.dev 上使用交互式参数调节，找到满意效果后再复制代码
5. **注意性能**：背景类组件（如 Particles、Ballpit）计算量较大，避免在页面中堆叠多个；移动端考虑降低粒子数量
6. **组合使用**：背景组件 + 文字动画 + UI 组件可以组合出完整的 Hero 区域效果
7. **自定义修改**：代码完全在你的项目中，可以根据需求自由修改，不受库版本限制
8. **MCP 加速开发**：在 AI 编码工具中配置 MCP 服务器，通过自然语言描述直接获取组件代码
9. **关注依赖版本**：部分组件依赖 motion（原 framer-motion），确保版本兼容

## 常见问题

### Q: React Bits 是 npm 包吗？需要 `npm install react-bits` 吗？

A: React Bits 的核心使用方式是**复制粘贴**，不是传统的 npm 包安装。虽然存在 `react-bits` 的 npm 包，但官方推荐的方式是通过 shadcn CLI 安装单个组件，或直接从 reactbits.dev 复制代码到项目中。这样你完全拥有代码控制权，无需担心库版本升级带来的破坏性变更。

### Q: 组件需要哪些依赖？

A: 依赖因组件而异。大多数动画组件需要 `motion`（原 framer-motion），部分需要 `gsap`，3D 类组件需要 `three` 和 `@react-three/fiber`。通过 CLI 安装时依赖会自动处理，手动复制时页面会标注所需依赖。

### Q: 可以在 Next.js 中使用吗？

A: 完全支持。React Bits 组件兼容 Next.js、Vite、CRA 等所有现代 React 框架。部分使用客户端 API 的组件需要添加 `'use client'` 指令。

### Q: 免费还是付费？

A: 130+ 个基础组件完全免费开源（MIT + Commons Clause 许可）。React Bits Pro 是付费版本，提供额外的 100+ 组件、158+ UI Blocks 和 8+ 完整页面模板，适合需要更多预制内容的团队。

### Q: 有 Vue 或 Svelte 版本吗？

A: 有官方移植版本：Vue 版本在 [vue-bits.dev](https://vue-bits.dev)，Svelte 版本在 [sveltebits.xyz](https://sveltebits.xyz)。

### Q: 如何在 AI 编码工具中使用？

A: 配置 React Bits MCP 服务器后，可以在 Cursor、Claude Desktop 等工具中直接通过自然语言搜索和获取组件代码。例如："给我一个发光按钮组件"或"列出所有背景动画组件"。

### Q: 组件支持服务端渲染（SSR）吗？

A: 大部分组件支持 SSR，但涉及 DOM 操作、Canvas、WebGL 的组件（如光标效果、3D 组件）需要在客户端渲染，需使用动态导入或 `'use client'` 标记。
