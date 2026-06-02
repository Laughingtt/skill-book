---
slug: shadcn-ui
name: shadcn/ui Skill
category: UI/UX设计与前端美化
tags: [shadcn, ui, component, design-system, tailwind, react]
description: shadcn/ui官方技能，管理组件的添加、搜索、修复、样式调整与组合，提供项目上下文与用法示例
install: "npx skills add https://github.com/shadcn/ui --skill shadcn"
source: "https://www.skills.sh/shadcn/ui/shadcn"
---

## 简介

shadcn/ui 不是一个传统的组件库——它是构建你自己的组件库的方法。与传统组件库（如 MUI、Ant Design）不同，shadcn/ui 不会作为 NPM 包安装到 `node_modules` 中，而是通过 CLI 将组件源码直接复制到你的项目中。你对代码拥有完全的控制权，可以自由修改、扩展和重构，无需担心破坏上游依赖。

**传统组件库的痛点：**

- 安装一个 NPM 包，导入组件，样式覆盖困难
- 需要自定义时，不得不写 wrapper 或 hack 样式
- 不同组件库的 API 风格不统一
- 升级时可能破坏你的自定义代码

**shadcn/ui 的解决方式：**

- 组件源码直接复制到你的项目中，你就是代码的主人
- 需要修改按钮行为？直接编辑 `button.tsx`
- 所有组件共享一致的、可组合的接口
- 基于 Radix UI / Base UI 的无头组件 + Tailwind CSS 样式

## 核心特性

- **开放代码（Open Code）**：组件源码直接存在于你的项目中，不是黑盒依赖。你可以自由阅读、修改和扩展每一行代码
- **可组合性（Composition）**：所有组件共享一致的 API 接口。`<Dialog>` 里有 `<DialogContent>`，`<DropdownMenu>` 里有 `<DropdownMenuItem>`，模式统一可预测
- **CSS 变量主题系统**：通过 `--primary`、`--background`、`--radius` 等语义化 token 管理主题，修改一处即可全局生效
- **代码分发平台**：shadcn/ui 不仅是组件集合，还定义了组件的 schema 和 CLI 分发机制，支持第三方 registry
- **AI 友好**：开放的代码和一致的 API 使得 AI 工具能够理解、生成和修改组件
- **美观的默认样式**：精心设计的默认风格，包含多种视觉预设（Vega、Nova、Maia、Lyra、Mira 等）
- **无障碍访问（Accessibility）**：底层基于 Radix UI / Base UI 的无头组件，内置键盘导航、焦点管理和 ARIA 属性

## 安装与配置

### 方式一：使用 shadcn/create（推荐新项目）

访问 [ui.shadcn.com/create](https://ui.shadcn.com/create)，在可视化界面中选择配置（组件库、视觉风格、基础颜色、主题、图标库、字体等），然后复制生成的命令执行。

### 方式二：使用 CLI 初始化新项目

```bash
# 初始化 Next.js 项目
pnpm dlx shadcn@latest init -t next

# 初始化 Vite 项目
pnpm dlx shadcn@latest init -t vite

# 初始化其他框架
pnpm dlx shadcn@latest init -t react-router
pnpm dlx shadcn@latest init -t astro
pnpm dlx shadcn@latest init -t start

# Laravel 项目需先创建 Laravel 项目
laravel new my-app
npx shadcn@latest init
```

### 方式三：在已有项目中添加

```bash
# 在现有项目根目录运行
pnpm dlx shadcn@latest init
```

`init` 命令会：

1. 安装必要依赖（`class-variance-authority`、`clsx`、`tailwind-merge`、`lucide-react` 等）
2. 创建 `lib/utils.ts`，包含 `cn()` 工具函数
3. 配置 CSS 变量到 `globals.css`
4. 生成 `components.json` 配置文件

### init 常用选项

```bash
# 指定底层组件库（Radix UI 或 Base UI）
pnpm dlx shadcn@latest init --base radix
pnpm dlx shadcn@latest init --base base

# 使用预设配置
pnpm dlx shadcn@latest init --preset a1Dg5eFl

# Monorepo 项目
pnpm dlx shadcn@latest init -t next --monorepo

# 使用默认配置跳过确认
pnpm dlx shadcn@latest init --defaults

# 强制覆盖已有配置
pnpm dlx shadcn@latest init --force

# 不使用 CSS 变量
pnpm dlx shadcn@latest init --no-css-variables
```

### 手动安装依赖

如果不想用 CLI 初始化，可以手动添加：

```bash
pnpm add shadcn class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
```

创建 `lib/utils.ts`：

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

在项目根目录创建 `components.json`：

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

## 常用命令与示例

### 添加组件

```bash
# 添加单个组件
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add table

# 同时添加多个组件
pnpm dlx shadcn@latest add button dialog input label

# 添加所有可用组件
pnpm dlx shadcn@latest add --all

# 预览变更但不写入文件
pnpm dlx shadcn@latest add button --dry-run

# 覆盖已有组件文件
pnpm dlx shadcn@latest add button --overwrite

# 指定安装路径
pnpm dlx shadcn@latest add button --path ./src/components/ui

# 在 monorepo 中指定工作目录
pnpm dlx shadcn@latest add button -c ./apps/web
```

### 查看文档与信息

```bash
# 查看项目信息（框架、版本、已安装组件、CSS 变量等）
pnpm dlx shadcn@latest info

# 在 CLI 中查看组件文档、示例和 API
pnpm dlx shadcn@latest docs combobox
pnpm dlx shadcn@latest docs dialog
pnpm dlx shadcn@latest docs data-table
```

### diff 命令

```bash
# 比较本地组件与 registry 版本的差异
pnpm dlx shadcn@latest diff

# 比较特定组件
pnpm dlx shadcn@latest diff button

# 在 add 时查看 diff
pnpm dlx shadcn@latest add button --diff
```

### 预设管理

```bash
# 查看当前项目预设信息
pnpm dlx shadcn@latest preset info

# 通过预设代码获取 create URL
pnpm dlx shadcn@latest preset url a2r6bw

# 在浏览器中打开预设
pnpm dlx shadcn@latest preset open a2r6bw
```

### 组件使用示例

```tsx
// 基础按钮
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <div className="flex gap-4">
      <Button>默认按钮</Button>
      <Button variant="secondary">次要按钮</Button>
      <Button variant="destructive">危险按钮</Button>
      <Button variant="outline">边框按钮</Button>
      <Button variant="ghost">幽灵按钮</Button>
      <Button variant="link">链接按钮</Button>
      <Button size="sm">小按钮</Button>
      <Button size="lg">大按钮</Button>
      <Button size="icon">图标按钮</Button>
    </div>
  )
}
```

```tsx
// 对话框
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">打开对话框</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认操作</DialogTitle>
          <DialogDescription>
            此操作不可撤销，确定要继续吗？
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline">取消</Button>
          <Button>确认</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

## 组件管理

### 添加组件

组件通过 `add` 命令安装，源码会被复制到 `components/ui/` 目录下（路径由 `components.json` 中的 `aliases.ui` 决定）。

```bash
# 常用组件列表
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add table
pnpm dlx shadcn@latest add tabs
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add sidebar
pnpm dlx shadcn@latest add command
pnpm dlx shadcn@latest add data-table
pnpm dlx shadcn@latest add chart
```

### 从第三方 Registry 添加

```bash
# 添加第三方 registry 中的组件
pnpm dlx shadcn@latest add @clerk/nextjs-quickstart
pnpm dlx shadcn@latest add https://example.com/r/my-component.json
```

### 更新组件

shadcn/ui 没有自动更新机制。更新流程：

1. 使用 `diff` 命令查看本地组件与 registry 的差异
2. 评估差异，决定是否更新
3. 使用 `--overwrite` 重新安装

```bash
# 查看所有组件的差异
pnpm dlx shadcn@latest diff

# 查看特定组件差异
pnpm dlx shadcn@latest diff button

# 覆盖更新（注意：会覆盖你的自定义修改！）
pnpm dlx shadcn@latest add button --overwrite
```

### 删除组件

直接删除对应的组件文件即可：

```bash
rm components/ui/button.tsx
```

同时记得清理项目中对该组件的引用。

## 样式自定义

### CSS 变量主题系统

shadcn/ui 使用 CSS 变量管理主题。所有颜色 token 都定义为 `--变量名` 的语义化对：

- `--background` / `--foreground`：页面背景与文字
- `--card` / `--card-foreground`：卡片背景与文字
- `--popover` / `--popover-foreground`：弹出层背景与文字
- `--primary` / `--primary-foreground`：主色调与文字
- `--secondary` / `--secondary-foreground`：次要色调与文字
- `--muted` / `--muted-foreground`：弱化背景与文字
- `--accent` / `--accent-foreground`：强调色与文字
- `--destructive` / `--destructive-foreground`：危险色与文字
- `--border`：边框颜色
- `--input`：输入框边框颜色
- `--ring`：焦点环颜色
- `--radius`：全局圆角大小

### 修改主题颜色

在 `globals.css` 中修改 `:root` 和 `.dark` 下的 CSS 变量：

```css
@import "tailwindcss";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... */
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  /* ... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  /* ... */
}
```

### 添加自定义颜色

在 `@theme inline` 和 CSS 变量中添加新的品牌色：

```css
@theme inline {
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
}

:root {
  --brand: oklch(0.7 0.15 250);
  --brand-foreground: oklch(1 0 0);
}

.dark {
  --brand: oklch(0.6 0.15 250);
  --brand-foreground: oklch(0.145 0 0);
}
```

然后可以在组件中使用 `bg-brand text-brand-foreground`。

### 使用 Tailwind 类自定义

组件接受 `className` 属性，通过 `cn()` 工具函数合并类名：

```tsx
// 直接传 className 覆盖样式
<Button className="rounded-full font-semibold">
  圆角按钮
</Button>

// cn() 函数会自动处理类名冲突
// cn("p-4", className) — 允许外部覆盖
// cn(className, "p-4") — 强制使用 p-4
```

### 创建包装组件（推荐做法）

不直接修改 `components/ui/` 下的组件，而是创建包装组件：

```tsx
// components/custom-button.tsx
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomButtonProps extends ButtonProps {
  // 添加自定义属性
}

export function CustomButton({ className, ...props }: CustomButtonProps) {
  return (
    <Button
      className={cn("rounded-full font-semibold", className)}
      {...props}
    />
  )
}
```

这样做的好处是：`components/ui/button.tsx` 保持原样，你随时可以用 `shadcn diff` 比较差异，也可以用 `--overwrite` 安全更新。

### 使用 CVA 添加变体

shadcn/ui 内部使用 `class-variance-authority`（CVA）管理变体。你可以直接在组件的 `cva()` 调用中添加新变体：

```tsx
// components/ui/button.tsx 中已有的 cva 定义
const buttonVariants = cva("inline-flex items-center ...", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground ...",
      destructive: "bg-destructive text-destructive-foreground ...",
      outline: "border border-input ...",
      // 添加自定义变体
      brand: "bg-brand text-brand-foreground hover:bg-brand/90",
    },
    // ...
  },
})
```

### 视觉预设（Presets）

shadcn/ui 提供多种视觉预设，每种有不同的间距和风格特征：

| 预设 | 特点 |
|------|------|
| **Vega** | 经典 shadcn/ui 风格，简洁、中性 |
| **Nova** | 减少内边距，适合数据密集的紧凑布局 |
| **Maia** | 柔和圆润，大间距曲线设计 |
| **Lyra** | 棱角分明，与等宽字体搭配极佳 |
| **Mira** | 超紧凑，为密集专业界面设计 |

```bash
# 使用预设初始化
pnpm dlx shadcn@latest init --preset <code>

# 在 shadcn/create 上可视化选择预设
```

### 基础颜色

支持的基础颜色：`neutral`、`stone`、`zinc`、`mauve`、`olive`、`mist`、`taupe`。在 `components.json` 中通过 `tailwind.baseColor` 配置，初始化后不可更改。

## 最佳实践

1. **不要像使用 MUI/Chakra 那样使用 shadcn/ui**。你不是在安装一个黑盒库，你是把代码复制进项目。把组件源码当作你自己的代码来对待

2. **创建包装组件而非直接修改 UI 组件**。将自定义逻辑放在包装组件中，保持 `components/ui/` 下的组件尽量原样，便于用 `shadcn diff` 跟踪上游更新

3. **使用 CSS 变量而非硬编码颜色**。`--primary`、`--background` 等 token 是主题系统的核心，用 Tailwind 的 `bg-primary` 而不是 `bg-blue-500`

4. **利用 `cn()` 函数合并类名**。`cn("p-4", className)` 允许外部覆盖，`cn(className, "p-4")` 强制使用默认值

5. **定期运行 `shadcn diff` 检查更新**。虽然组件代码在你项目中，但上游可能修复了 bug 或改进了无障碍支持

6. **在修改前备份配置文件**。每次修改 Tailwind 配置或 `globals.css` 前，先做备份

7. **服务端/客户端边界要清晰**。在 Next.js App Router 中，注意 `"use client"` 指令，交互组件放在客户端，数据获取放在服务端

8. **生产构建测试**。本地开发正常不代表生产也正常，部署前务必运行 `npm run build && npm run preview` 验证

9. **使用 `--dry-run` 预览**。添加组件前先用 `--dry-run` 查看将要写入的文件，避免意外覆盖

10. **利用 `shadcn docs` 命令**。在终端中直接查看组件文档、示例和 API，无需切换到浏览器

## 常见问题

### Q: CLI 命令 `shadcn-ui` 找不到？

CLI 已从 `shadcn-ui` 更名为 `shadcn`。使用新命令：

```bash
# 错误
npx shadcn-ui@latest add button

# 正确
npx shadcn@latest add button
```

### Q: 组件安装后样式不生效？

1. 检查 `globals.css` 是否正确导入了 Tailwind CSS 和 shadcn 样式
2. 确认 `components.json` 中的 `tailwind.css` 路径指向正确的 CSS 文件
3. 检查 Tailwind CSS 的 `content` 配置是否包含了组件目录
4. 运行 `npm run build` 确认生产构建是否正常

### Q: Tailwind v4 中自定义主题不生效？

Tailwind v4 的配置方式有变化：

1. 将 `:root` 和 `.dark` 从 `@layer base` 中移出
2. 在 `@theme` 中使用 `inline` 选项：`@theme inline { ... }`
3. 颜色值需要包裹在 `hsl()` 或使用 `oklch()` 格式
4. 从 `@theme` 中移除 `hsl()` 包裹，只保留原始值

### Q: 如何更新已有组件而不丢失自定义修改？

1. 先运行 `shadcn diff button` 查看差异
2. 手动合并上游更改到你的组件中
3. 或者：将自定义逻辑放在包装组件中，`components/ui/` 下的原组件用 `--overwrite` 更新

### Q: 在 monorepo 中如何使用？

使用 `-c` 选项指定工作目录：

```bash
pnpm dlx shadcn@latest init -t next --monorepo
pnpm dlx shadcn@latest add button -c ./apps/web
```

### Q: 如何切换 CSS 变量和内联 Tailwind 类？

这是初始化时的选项，初始化后无法直接切换。需要删除并重新安装组件：

```bash
# 使用 CSS 变量（默认，推荐）
pnpm dlx shadcn@latest init --css-variables

# 不使用 CSS 变量，生成内联 Tailwind 颜色类
pnpm dlx shadcn@latest init --no-css-variables
```

### Q: 路径别名 `@/` 不生效？

确保 `tsconfig.json` 中配置了路径映射：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

或者使用 `package.json#imports` 的 `#` 别名，并在 `components.json` 中对应修改。

### Q: 组件安装时权限错误？

```bash
# macOS/Linux：修复目录权限
sudo chown -R $USER:$USER components/

# 或者不要使用 sudo 运行 npx
```

### Q: 暗色模式如何实现？

shadcn/ui 的暗色模式通过 `.dark` 类名切换 CSS 变量实现。使用 `next-themes` 等库来管理主题切换：

```bash
pnpm add next-themes
```

```tsx
// providers/theme-provider.tsx
import { ThemeProvider } from "next-themes"

export function ThemeProviderWrapper({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
```
