---
slug: animation-generation
name: Animation Generation
category: 内容创作与自媒体
tags: [animation, video, motion, generation, lottie, css]
description: AI辅助生成动画效果，支持CSS动画、Lottie动画和SVG动画
install: "npx skills add nicobailon/animation-generation --skill animation-generation"
source: "https://github.com/nicobailon/animation-generation"
---

# Animation Generation — AI 辅助动画生成技能

## 简介

Animation Generation 是一项 AI 驱动的动画生成技能，能够根据自然语言描述自动产出生产级的动画代码和素材。无论是 CSS 关键帧动画、Lottie JSON 动画、SVG 动画还是 GSAP 时间线动画，只需用文字描述你想要的动效，AI 即可生成可直接集成到项目中的代码。

传统动画制作流程需要掌握 After Effects、Rive 等专业工具，学习曲线陡峭，单角色动画制作成本可达数百美元且耗时数周。本技能将动画创作门槛降至最低——**描述即生成**，从想法到可用的动画代码只需几秒。

核心能力：

- **自然语言驱动画生成**：用文字描述动效意图，AI 输出生产级代码
- **多格式输出**：CSS Keyframes、Lottie JSON、SVG SMIL、GSAP Timeline
- **迭代优化**：生成后可继续用自然语言微调（"更弹一些"、"加滚动触发"）
- **框架适配**：自动适配 React、Vue、Svelte 等前端框架

## 支持的动画类型

| 类型 | 格式 | 适用场景 | 复杂度 |
|------|------|----------|--------|
| CSS 动画 | Keyframes / Transitions | UI 微交互、加载动画、悬浮效果 | 简单到中等 |
| Lottie 动画 | JSON / .lottie | 品牌动画、空状态插画、图标动画 | 中等到复杂 |
| SVG 动画 | SMIL / CSS 驱动 | 图标动效、路径描边、变形动画 | 中等 |
| GSAP 动画 | JavaScript | 时间线编排、滚动驱动、复杂序列 | 中等到复杂 |
| Canvas 动画 | JavaScript | 粒子效果、物理模拟、数据可视化 | 复杂 |

## 安装与使用

### 安装

```bash
npx skills add nicobailon/animation-generation --skill animation-generation
```

### 基本用法

安装技能后，直接在对话中描述动画需求即可：

```
请生成一个脉冲式加载动画，蓝色圆形，持续跳动
```

```
为按钮添加悬浮时的缩放弹跳效果
```

```
创建一个 SVG 路径描边动画，模拟手写签名效果
```

### 迭代微调

首次生成后可继续优化：

```
让弹跳效果更明显，添加缓出曲线
```

```
改为滚动触发，进入视口时播放
```

## CSS 动画生成

CSS 动画适合简单到中等复杂度的 UI 微交互，无需 JavaScript 依赖，浏览器原生渲染性能最优。

### 关键帧动画（Keyframes）

```css
/* 脉冲加载动画 */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.pulse-loader {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3b82f6;
  animation: pulse 1.5s ease-in-out infinite;
}
```

### 过渡动画（Transitions）

```css
/* 按钮悬浮缩放 */
.btn-bounce {
  padding: 12px 24px;
  background: #c4553a;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s ease;
}

.btn-bounce:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 24px rgba(196, 85, 58, 0.3);
}
```

### 变换动画（Transforms）

```css
/* 卡片翻转效果 */
.card-flip-container {
  perspective: 1000px;
}

.card-flip {
  width: 300px;
  height: 200px;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.card-flip:hover {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}
```

### 交错动画（Staggered）

```css
/* 列表项逐个出现 */
@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.list-item {
  animation: slideInUp 0.4s ease-out both;
}

.list-item:nth-child(1) { animation-delay: 0.05s; }
.list-item:nth-child(2) { animation-delay: 0.1s; }
.list-item:nth-child(3) { animation-delay: 0.15s; }
.list-item:nth-child(4) { animation-delay: 0.2s; }
.list-item:nth-child(5) { animation-delay: 0.25s; }
```

## Lottie 动画生成

Lottie 是基于 JSON 的轻量级动画格式，源自 After Effects 的 Bodymovin 导出插件。相比 GIF 或视频，Lottie 文件体积极小（通常几 KB 到几十 KB），支持矢量缩放，是品牌动画和插画动画的首选方案。

### Lottie JSON 结构概览

```json
{
  "v": "5.7.0",
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 200,
  "h": 200,
  "assets": [],
  "layers": [
    {
      "ty": 4,
      "nm": "Shape Layer",
      "ip": 0,
      "op": 60,
      "ks": {
        "o": { "a": 0, "k": 100 },
        "r": { "a": 0, "k": 0 },
        "p": { "a": 0, "k": [100, 100, 0] },
        "s": { "a": 1, "k": [
          { "t": 0, "s": [100, 100, 100], "e": [120, 120, 100] },
          { "t": 30, "s": [120, 120, 100], "e": [100, 100, 100] },
          { "t": 60, "s": [100, 100, 100] }
        ]}
      },
      "shapes": []
    }
  ]
}
```

### Web 端集成

**使用 dotLottie Player（推荐）：**

```html
<!-- 引入 dotLottie Web Component -->
<script src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs" type="module"></script>

<!-- 使用自定义元素 -->
<dotlottie-player
  src="/animations/loading.lottie"
  autoplay
  loop
  style="width: 200px; height: 200px;"
></dotlottie-player>
```

**使用 @lottiefiles/dotlottie-web（编程式控制）：**

```javascript
import { DotLottie } from '@lottiefiles/dotlottie-web';

const animation = new DotLottie({
  canvas: document.getElementById('lottie-canvas'),
  src: '/animations/loading.lottie',
  autoplay: true,
  loop: true,
});

// 编程控制
animation.play();
animation.pause();
animation.setSpeed(1.5);
```

### React 集成

```jsx
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function LoadingAnimation() {
  return (
    <DotLottieReact
      src="/animations/loading.lottie"
      autoplay
      loop
      style={{ width: 200, height: 200 }}
    />
  );
}
```

### 移动端集成

- **iOS**：使用 `Lottie` Swift 库（Airbnb 开源）
- **Android**：使用 `lottie-android` 库
- **Flutter**：使用 `lottie` 包，支持网络和本地资源加载
- **React Native**：使用 `lottie-react-native`

### Lottie vs dotLottie 格式

| 特性 | Lottie JSON | dotLottie (.lottie) |
|------|-------------|---------------------|
| 文件大小 | 较大（纯文本 JSON） | 更小（ZIP 压缩，可小 50%-80%） |
| 多动画支持 | 单文件单动画 | 单文件支持多动画 |
| 主题/动态替换 | 有限 | 原生支持主题和状态 |
| 兼容性 | 广泛 | 新格式，逐步普及 |

## SVG 动画

SVG 动画适合图标动效、路径描边、形状变形等场景。三种实现方式各有适用场景。

### SMIL 动画（SVG 原生）

SMIL 是 SVG 规范内置的动画语法，无需 CSS 或 JavaScript，可独立运行，适合作为 `<img>` 标签或背景图使用的动画 SVG。

```xml
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- 圆形脉冲 -->
  <circle cx="100" cy="100" r="30" fill="#c4553a">
    <animate
      attributeName="r"
      values="30;40;30"
      dur="1.5s"
      repeatCount="indefinite"
    />
    <animate
      attributeName="opacity"
      values="1;0.6;1"
      dur="1.5s"
      repeatCount="indefinite"
    />
  </circle>

  <!-- 路径描边动画 -->
  <path
    d="M 20 100 C 60 20, 140 20, 180 100"
    fill="none"
    stroke="#3b82f6"
    stroke-width="3"
    stroke-dasharray="300"
    stroke-dashoffset="300"
  >
    <animate
      attributeName="stroke-dashoffset"
      from="300"
      to="0"
      dur="2s"
      fill="freeze"
    />
  </path>
</svg>
```

**SMIL 核心元素：**

| 元素 | 用途 |
|------|------|
| `<animate>` | 动画化任意 SVG 属性 |
| `<animateTransform>` | 动画化 transform（旋转、缩放、平移） |
| `<animateMotion>` | 沿路径运动 |
| `<set>` | 在特定时间设置属性值（无过渡） |

### CSS 驱动的 SVG 动画

将 CSS 动画应用于 SVG 元素，获得更灵活的时序控制和缓动函数。

```css
/* SVG 路径描边动画 */
.signature-path {
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  animation: draw 3s ease-out forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

/* SVG 图标悬浮变色 */
.icon-svg {
  transition: fill 0.3s ease, transform 0.3s ease;
}

.icon-svg:hover {
  fill: #c4553a;
  transform: scale(1.1);
  transform-origin: center;
}
```

### JavaScript 驱动的 SVG 动画

对于复杂交互（点击触发、状态联动），使用 GSAP 或原生 Web Animations API。

## 提示词技巧

AI 动画生成的效果高度依赖提示词质量。以下技巧可显著提升输出精度。

### 基本结构

```
[动画类型] + [目标元素] + [运动描述] + [时间参数] + [缓动函数]
```

### 高效提示词示例

```
# 好：具体、可度量
生成一个 CSS 关键帧动画，让卡片从下方 30px 处淡入滑出，
持续 0.4 秒，使用 ease-out 缓动，延迟 0.1 秒

# 差：模糊、缺少参数
做一个卡片动画
```

### 常用提示词模板

| 场景 | 提示词模板 |
|------|-----------|
| 页面进入 | "元素从 [方向] [距离] 滑入，透明度从 0 到 1，持续 [时间]" |
| 悬浮反馈 | "悬浮时 [缩放比例] 放大，[阴影描述]，过渡 [时间] [缓动]" |
| 加载状态 | "脉冲/旋转/弹跳加载动画，[颜色]，循环播放" |
| 滚动触发 | "进入视口时触发 [动画描述]，滚动进度 0%-100% 映射动画进度" |
| 交错序列 | "[数量] 个元素依次出现，间隔 [延迟]，从 [方向] [距离] 滑入" |
| 形状变形 | "SVG 从 [形状A] 变形为 [形状B]，持续 [时间]，保持顶点数一致" |

### 迭代优化提示词

```
让动画更弹一些（overshoot）          → 添加 cubic-bezier(0.34, 1.56, 0.64, 1)
减慢到 0.8 秒                      → 调整 duration
加一个滚动触发                      → 改用 GSAP ScrollTrigger
移动端减小幅度                      → 添加 @media 响应式适配
减少运动偏好用户禁用动画            → 添加 prefers-reduced-motion 媒体查询
```

## 与前端框架集成

### React

```jsx
// 使用 CSS Modules + 关键帧
import styles from './Animation.module.css';

function FadeInCard({ children }) {
  return (
    <div className={styles.fadeInCard}>
      {children}
    </div>
  );
}

// GSAP + useGSAP hook（推荐）
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

function AnimatedList({ items }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.list-item', {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {items.map((item) => (
        <div key={item.id} className="list-item">{item.text}</div>
      ))}
    </div>
  );
}
```

### Vue 3

```vue
<template>
  <!-- 内置 Transition 组件 -->
  <Transition name="slide-fade">
    <div v-if="show" class="panel">内容</div>
  </Transition>

  <!-- 列表过渡 -->
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">{{ item.text }}</li>
  </TransitionGroup>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}
.slide-fade-enter-from {
  transform: translateY(20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.list-enter-active {
  transition: all 0.4s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
</style>
```

### Svelte

```svelte
<script>
  import { fade, fly, slide } from 'svelte/transition';
  let visible = true;
</script>

<button on:click={() => visible = !visible}>切换</button>

{#if visible}
  <div transition:fly={{ y: 20, duration: 400 }}>
    滑入内容
  </div>
{/if}
```

## 性能优化

动画性能直接影响用户体验，以下是确保 60fps 流畅渲染的关键原则。

### 只动画 transform 和 opacity

```css
/* 好：GPU 加速属性，跳过布局和绘制阶段 */
.animated {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* 差：触发布局重排（Layout Thrashing） */
.animated-bad {
  transition: top 0.3s ease, width 0.3s ease, margin 0.3s ease;
}
```

浏览器渲染管线：**JavaScript → Style → Layout → Paint → Composite**

- `transform` 和 `opacity` 只触发 Composite 阶段
- `top`/`left`/`width`/`height` 触发 Layout + Paint，性能差

### 使用 will-change 提示浏览器

```css
/* 在动画即将开始前添加，动画结束后移除 */
.will-animate {
  will-change: transform, opacity;
}
```

注意：不要滥用 `will-change`，每个声明都会创建独立的合成层，过多层反而降低性能。

### 避免布局抖动（Layout Thrashing）

```javascript
// 差：读写交替，强制同步布局
items.forEach((item) => {
  const height = item.offsetHeight; // 读 → 触发布局
  item.style.height = height + 10 + 'px'; // 写 → 使布局失效
});

// 好：批量读取，批量写入
const heights = items.map((item) => item.offsetHeight); // 批量读
items.forEach((item, i) => {
  item.style.height = heights[i] + 10 + 'px'; // 批量写
});
```

### 使用 contain 属性隔离重绘范围

```css
.isolated-animation {
  contain: layout style paint;
}
```

### requestAnimationFrame 替代 setTimeout

```javascript
// 差：不与屏幕刷新同步
setInterval(animate, 16);

// 好：与浏览器刷新率同步
function animate() {
  updateAnimation();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

### 尊重用户偏好

```css
/* 为偏好减少运动的用户禁用动画 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 最佳实践

### 选择合适的动画技术

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| 简单 UI 过渡（悬浮、聚焦） | CSS Transitions | 零 JS 依赖，浏览器优化最优 |
| 循环加载动画 | CSS Keyframes | 声明式、可暂停、GPU 友好 |
| 品牌插画/空状态 | Lottie / dotLottie | 矢量缩放、文件小、跨平台 |
| 图标微交互 | SVG + CSS / SMIL | 可内联、CSS 可控 |
| 滚动驱动动画 | GSAP + ScrollTrigger | 精确控制触发点和进度映射 |
| 复杂时间线序列 | GSAP Timeline | 时间线编排、暂停/反转/跳转 |
| 粒子/物理效果 | Canvas + requestAnimationFrame | 像素级控制、高性能批量渲染 |

### 动画设计原则

1. **有目的性**：每个动画都应服务于功能目标（引导注意力、提供反馈、建立空间关系），避免纯装饰
2. **克制时长**：UI 微交互 150-300ms，页面过渡 300-500ms，复杂编排不超过 1s
3. **自然缓动**：使用 ease-out 进入、ease-in 退出，避免 linear（机械感强）
4. **一致性**：全站统一的缓动函数和时长规范，建议定义 CSS 变量
5. **可访问性**：始终提供 `prefers-reduced-motion` 回退方案

### CSS 变量统一管理动画参数

```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --ease-out: cubic-bezier(0.33, 1, 0.68, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn {
  transition: transform var(--duration-fast) var(--ease-bounce),
              opacity var(--duration-fast) var(--ease-out);
}
```

### 调试工具

- **Chrome DevTools**：Animations 面板可逐帧检查、调整播放速度
- **Firefox Performance**：录制动画帧率，检测掉帧
- **Lighthouse**：审计动画性能指标
- **GSAP DevTools**：可视化调试 GSAP 时间线（需 GSAP Club 许可）

### 常见陷阱

| 陷阱 | 解决方案 |
|------|---------|
| 动画太多导致页面卡顿 | 限制同时运行的动画数量，使用 Intersection Observer 仅动画可见元素 |
| `box-shadow` 动画性能差 | 改用伪元素 + opacity 过渡模拟阴影 |
| Lottie JSON 文件过大 | 使用 dotLottie 压缩格式，或简化 After Effects 图层 |
| SVG 动画在 Safari 表现异常 | 添加 `transform-origin` 显式声明，使用 `transform-box: fill-box` |
| 移动端动画掉帧 | 减少同时动画元素数，降低阴影复杂度，使用 `translate3d(0,0,0)` 强制 GPU 层 |
