---
slug: sleek-design-mobile-apps
name: Sleek Design Mobile Apps
category: UI/UX设计与前端美化
tags: [mobile, design, app, ui, screens, sleek]
description: Sleek移动应用设计技能，AI辅助设计移动端界面、创建屏幕和构建UI
install: "npx skills add https://github.com/sleekdotdesign/agent-skills --skill sleek-design-mobile-apps"
source: "https://www.skills.sh/sleekdotdesign/agent-skills/sleek-design-mobile-apps"
---

# Sleek Design Mobile Apps

## 简介

[Sleek](https://sleek.design) 是一款专为移动应用设计的AI驱动设计工具。与通用型UI生成器不同，Sleek 专注于移动端——每一个布局、组件和交互模式都遵循移动端设计规范：iOS Human Interface Guidelines、Material Design、原生导航模式、精确的设备尺寸和触控目标大小。生成的结果看起来像真正的原生应用，而非被裁剪到手机宽度的网页。

Sleek 通过 REST API 提供服务，AI 代理可以通过该 API 创建项目、用自然语言描述需求、获取渲染后的屏幕组件（含完整的 HTML/CSS 代码）。整个工作流从"设计一个登录页"到轮询异步生成过程、获取最终组件代码，全部通过标准 HTTP 请求完成。

**前置条件**：
- Sleek Pro 及以上计划（API 访问受限）
- 环境变量 `SLEEK_API_KEY`（在 [API Keys 页面](https://sleek.design/dashboard/api-keys) 创建）
- 仅允许访问 `https://sleek.design`

## 核心设计原则

### Mobile-First（移动优先）

移动端设计不是桌面设计的缩小版。Sleek 遵循以下移动优先原则：

- **拇指区域优先**：核心操作放置在屏幕底部拇指易触区域，次要操作置于顶部
- **单手操作**：关键交互元素（主按钮、导航）设计为单手可完成，避免强迫用户双手操作
- **内容优先**：减少装饰性元素，让内容占据主要空间，移动屏幕寸土寸金

### 触控目标规范

触控目标是移动可用性的基石，设计时必须遵循平台规范：

| 平台 | 最小触控目标 | 推荐间距 |
|------|-------------|---------|
| iOS (HIG) | 44 x 44 pt | 至少 1px |
| Android (Material 3) | 48 x 48 dp | 至少 8dp |
| WCAG 2.2 AA | 24 x 24 CSS px | 需充足间距 |
| WCAG 2.2 AAA | 44 x 44 CSS px | 含在尺寸内 |
| NN/g 推荐 | 1 x 1 cm | 至少 2mm |

**实践要点**：
- 视觉大小可以小于触控区域——通过 `padding` 扩大可点击范围而不改变外观
- 关键操作（提交、支付、确认）使用超过最小值的触控目标
- 相邻可交互元素之间至少保持 8px/8dp 间距
- 成人手指平均宽度约 10-14mm，设计时以此为参考

### 导航模式

移动端常见三种导航模式，选择取决于应用复杂度：

- **底部标签栏（Tab Bar）**：3-5 个核心功能区，适合大多数应用（iOS 常见）
- **侧边抽屉（Drawer）**：辅助功能和设置项，不占用主屏幕空间
- **底部导航（Bottom Navigation）**：Material Design 风格，功能与 Tab Bar 类似

Sleek 生成的设计自动遵循平台导航惯例，无需手动指定导航类型。

## 屏幕设计流程

使用 Sleek API 设计移动应用屏幕的完整流程如下：

### 1. 创建项目

```
POST /api/v1/projects
Authorization: Bearer $SLEEK_API_KEY
Content-Type: application/json

{ "name": "My New App" }
```

每个项目拥有独立的主题、样式和设计系统。如果需要多种设计变体，为每种变体创建独立项目。

### 2. 发送聊天消息描述需求

```
POST /api/v1/projects/:id/chat/messages
Authorization: Bearer $SLEEK_API_KEY

{
  "message": {
    "text": "创建一个健身追踪应用，包含首页仪表盘、训练记录和个人设置页面"
  }
}
```

**提示技巧**：
- 直接传递用户的原始需求，Sleek 的 AI 能够理解自然语言
- 不需要预先拆分为多个屏幕——发送完整意图，让 Sleek 决定创建哪些屏幕
- 可以附带 `imageUrls`（仅限 HTTPS）提供视觉参考
- 使用 `target.screenId` 可以针对特定屏幕进行编辑

聊天消息默认异步执行，返回 `runId` 后需轮询状态：

```
GET /api/v1/projects/:id/chat/runs/:runId
```

轮询策略：初始间隔 2 秒，10 秒后回退至 5 秒，最多等待 5 分钟。运行状态生命周期：`queued` -> `running` -> `completed | failed`。

也可使用 `?wait=true` 同步等待（最长 300 秒），超时则回退到轮询模式。

**注意**：每个项目同一时间只允许一个活跃运行。若收到 `409 CONFLICT`，需等待当前运行完成。

### 3. 获取截图展示结果

每次产生 `screen_created` 或 `screen_updated` 操作的聊天运行完成后，**必须截取截图并展示给用户**：

```
POST /api/v1/screenshots
Authorization: Bearer $SLEEK_API_KEY

{
  "componentIds": ["cmp_xyz"],
  "background": "transparent",
  "format": "png",
  "scale": 2
}
```

截图支持参数：`format`（png/webp）、`scale`（1-3 倍像素比）、`gap`（组件间距）、`padding`（各方向内边距）、`radius`（圆角半径）、`background`（背景色）、`showDots`（背景网格点）。

**重要**：始终使用 `background: "transparent"` 除非用户明确要求特定背景色。

### 4. 获取组件代码

当需要将设计落地为代码时，获取组件的 HTML 代码：

```
GET /api/v1/projects/:id/components/:componentId
```

组件代码是完整的 HTML 文档，可直接保存为 `.html` 文件，无需构建步骤。

## 常用UI模式

### 引导页（Onboarding）

引导页的目标是让用户快速理解应用价值并完成首次操作。最佳实践：

- 控制在 3-5 屏以内，过长的引导会导致用户流失
- 使用进度指示器让用户了解剩余步骤
- 展示核心价值而非罗列功能
- 允许跳过——老用户不需要重复引导
- 在展示价值之后再请求权限（推送、定位等）
- 尽可能延迟账号注册，让用户先体验产品

**Sleek 提示示例**：
> "为冥想应用设计一个3屏引导流程，使用宁静的蓝绿色调，展示核心功能：每日冥想、呼吸练习和睡眠引导"

### 登录/注册页（Login/Signup）

登录页看似简单，却是转化率的关键瓶颈。设计要点：

- 提供社交登录选项（Apple、Google、微信等），减少输入摩擦
- 密码字段提供显示/隐藏切换
- 明确区分登录与注册入口
- 保持用户登录状态，避免频繁重新登录
- 表单验证即时反馈，而非提交后才报错

**Sleek 提示示例**：
> "设计一个简洁的登录页，支持手机号和邮箱登录，包含微信和Apple第三方登录，使用温暖的配色"

### 信息流/首页（Feed/Home）

首页是用户与应用建立"关系"的地方——用户会反复回到这里，通常带着明确目标：

- 优先展示最相关的内容，使用卡片式布局
- 下拉刷新是用户的本能期待
- 无限滚动需配合加载状态指示
- 搜索功能应显眼且易触达
- 浮动操作按钮（FAB）用于核心创建操作

**Sleek 提示示例**：
> "设计一个社交应用的首页信息流，包含故事栏、动态卡片（图片+文字）、点赞评论交互，底部标签栏导航"

### 个人中心（Profile）

个人中心兼顾身份展示和功能入口：

- 头像和用户名是最重要的视觉锚点
- 设置项使用分组列表，每组 3-5 项
- 危险操作（退出登录、注销账号）放置在底部并使用警示色
- 统计数据（关注数、粉丝数等）使用突出排版

**Sleek 提示示例**：
> "设计一个电商应用的个人中心，顶部显示用户头像和等级，中间展示订单状态快捷入口，底部是功能列表"

### 设置页（Settings）

设置页的关键是清晰和可发现性：

- 按功能分组（账号、通知、隐私、关于）
- 使用开关控件（Toggle）替代复选框
- 当前状态应一目了然（如"深色模式：开"）
- 版本号放在页面底部
- 高级选项可折叠，避免信息过载

## 与Sleek平台集成

### API 密钥与权限

API 密钥在 [Sleek Dashboard](https://sleek.design/dashboard/api-keys) 创建，创建时仅显示一次完整密钥。每个密钥可配置独立的作用域：

| 作用域 | 功能 |
|--------|------|
| `projects:read` | 列出/获取项目 |
| `projects:write` | 创建/删除项目 |
| `components:read` | 列出项目组件 |
| `chats:read` | 获取聊天运行状态 |
| `chats:write` | 发送聊天消息 |
| `screenshots` | 渲染组件截图 |

**安全实践**：仅为当前任务分配所需的最小权限，优先使用短期或可撤销的密钥。

### 完整 API 端点一览

| 方法 | 路径 | 所需权限 | 说明 |
|------|------|---------|------|
| `GET` | `/api/v1/projects` | `projects:read` | 列出项目 |
| `POST` | `/api/v1/projects` | `projects:write` | 创建项目 |
| `GET` | `/api/v1/projects/:id` | `projects:read` | 获取项目 |
| `DELETE` | `/api/v1/projects/:id` | `projects:write` | 删除项目 |
| `GET` | `/api/v1/projects/:id/components` | `components:read` | 列出组件 |
| `GET` | `/api/v1/projects/:id/components/:cid` | `components:read` | 获取组件 |
| `POST` | `/api/v1/projects/:id/chat/messages` | `chats:write` | 发送消息 |
| `GET` | `/api/v1/projects/:id/chat/runs/:rid` | `chats:read` | 轮询运行 |
| `POST` | `/api/v1/screenshots` | `screenshots` | 渲染截图 |

### 图标系统

Sleek 使用 [Iconify](https://iconify.design) 图标，格式为 `prefix:name`（如 `solar:heart-bold`、`material-symbols:search-rounded`、`lucide:settings`）。常用图标集包括 Solar、Hugeicons、Material Symbols 和 MDI。

获取图标 SVG：
```
GET https://api.iconify.design/{prefix}/{name}.svg
```

实现时应使用与 HTML 代码中完全相同的图标，不要替换为其他图标集。对于 React Native / Expo，使用 `react-native-svg` 的 `SvgXml` 组件渲染。

### 字体处理

组件 HTML 通过 `<link>` 标签引入 Google Fonts。在原生框架实现时，提取 `<head>` 中的字体族名称和字重，保持一致。

### 导出选项

- **Figma**：一键导出为原生可编辑图层（无需插件）
- **HTML**：直接保存为 `.html` 文件
- **React + Tailwind CSS**：生成可用代码

### 版本管理

每个组件携带 `versions[]` 数组和 `activeVersion` 编号。默认使用 `versions[i].version === activeVersion` 对应的代码。用户可通过 pin 块指定历史版本：

```
- component cmp_abc: version ver_001
- component cmp_def: version ver_002
```

截图时通过 `componentVersionOverrides` 和 `themeVersionOverrides` 参数指定版本。

## 设计规范与最佳实践

### 间距系统

移动端设计应使用一致的间距比例系统（4px 或 8px 基数）：

| 用途 | 推荐间距 |
|------|---------|
| 元素内部间距 | 4-8px |
| 同组元素间距 | 8-12px |
| 不同组间距 | 16-24px |
| 区块间距 | 24-32px |
| 屏幕边距 | 16-20px |

### 移动端排版

- **正文字号**：最小 14-16px，低于此值难以阅读
- **标题字号**：18-34px，根据层级递减
- **行高**：正文 1.4-1.6 倍字号，标题 1.1-1.3 倍
- **字重对比**：标题用粗体（600-700），正文用常规（400），通过对比建立层级
- **每行字符数**：30-40 个中文字符 / 40-70 个英文字符为最佳阅读范围

### 配色

- **主色**：1 个品牌色，贯穿应用核心交互元素
- **辅助色**：2-3 个，用于区分功能区域
- **中性色**：深浅灰阶用于文本、背景和边框
- **警示色**：红色系用于错误和危险操作
- **深色模式**：不是简单反转，需降低对比度、提升层级区分度

### 移动端特有考量

- **状态栏**：为状态栏预留空间，避免内容被遮挡
- **底部安全区域**：iPhone 底部 Home 指示器区域需额外 padding
- **手势冲突**：避免在滑动区域放置可点击元素
- **加载状态**：使用骨架屏（Skeleton Screen）而非转圈动画
- **空状态**：设计友好的空状态页面，引导用户产生内容

## 响应式与适配

### 屏幕尺寸适配

移动设备屏幕尺寸差异巨大，设计时需考虑：

| 设备类型 | 典型尺寸（逻辑像素） | 设计基准 |
|----------|-------------------|---------|
| 小屏手机 | 320 x 568 (iPhone SE) | 最小兼容 |
| 标准手机 | 375 x 812 (iPhone 14) | 主力设计尺寸 |
| 大屏手机 | 414 x 896 (iPhone 14 Plus) | 宽度利用 |
| 折叠屏 | 360-600 x 800+ | 动态适配 |
| 平板 | 768 x 1024+ | 独立布局 |

Sleek 生成的设计以标准手机尺寸为基准，遵循平台原生设计规范。

### 安全区域（Safe Area）

iOS 设备的安全区域包括顶部刘海/灵动岛和底部 Home 指示器：

- **顶部**：避开状态栏和刘海区域，通常预留 44-47pt
- **底部**：避开 Home 指示器，通常预留 34pt
- **横屏**：左右两侧均有安全区域
- 使用 `env(safe-area-inset-*)` CSS 变量处理

### 适配策略

- **弹性布局**：使用 Flexbox 代替固定尺寸，让内容自然流动
- **相对单位**：使用 `rem`、`em`、`%` 代替 `px`，配合根字号缩放
- **断点设计**：至少定义手机（<600px）和平板（>=600px）两个断点
- **图片适配**：提供 1x、2x、3x 资源，通过 `srcset` 按设备像素比加载
- **文字缩放**：支持系统级字体大小设置，确保布局不被破坏

### 组件与图标适配

- 组件列表和获取接口支持 `inlineIcons` 查询参数（默认 `false`）
- 默认模式：图标渲染为 `<iconify-icon>` Web 组件，HTML 引入 Iconify 脚本
- 传入 `?inlineIcons=true`：生成自包含 SVG，适用于不支持脚本运行的环境

## 示例项目

### 示例一：冥想应用

```
1. POST /api/v1/projects  { "name": "Calm Meditation" }
2. POST /api/v1/projects/:id/chat/messages
   {
     "message": {
       "text": "设计一个冥想应用，包含：首页显示今日推荐冥想和呼吸练习入口，冥想播放页带有圆形进度动画，个人统计页展示连续打卡天数和总时长。使用深蓝色和薰衣草紫的配色，整体风格宁静优雅"
     }
   }
3. 轮询运行状态直至 completed
4. POST /api/v1/screenshots  { "componentIds": [...], "background": "transparent" }
```

### 示例二：电商应用

```
1. POST /api/v1/projects  { "name": "ShopFlow" }
2. POST /api/v1/projects/:id/chat/messages
   {
     "message": {
       "text": "设计一个时尚电商应用，包含：商品首页（轮播Banner+分类导航+推荐商品瀑布流），商品详情页（大图+价格+规格选择+加购按钮），购物车页面。使用黑白主色调搭配珊瑚色强调色"
     }
   }
3. 轮询运行状态直至 completed
4. POST /api/v1/screenshots  { "componentIds": [...], "background": "transparent" }
5. 获取组件代码用于前端实现
```

### 示例三：迭代编辑已有屏幕

```
POST /api/v1/projects/:id/chat/messages
{
  "message": {
    "text": "把首页的推荐区域改为横向滚动卡片，增加一个限时秒杀模块"
  },
  "target": {
    "screenId": "screen_home_001"
  }
}
```

## 常见错误与排查

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| 401 UNAUTHORIZED | API 密钥缺失/无效/过期 | 检查 `SLEEK_API_KEY` 环境变量 |
| 403 FORBIDDEN | 密钥权限不足或计划不支持 | 确认密钥作用域和账户计划 |
| 409 CONFLICT | 项目已有活跃运行 | 等待当前运行完成后再发送 |
| 202 无 result | 异步运行尚未完成 | 继续轮询直到 `completed` |
| `out_of_credits` | 组织额度耗尽 | 充值或等待额度刷新 |
| `execution_failed` | AI 执行出错 | 简化描述后重试 |
| 截图使用 screenId | screenId 和 componentId 不同 | 始终使用 operations 中的 componentId |
| 版本号混淆 | `version`（数字）vs `id`（字符串） | 固定版本时匹配 `id`（如 `ver_001`） |

## 安装与使用

```bash
# 安装技能
npx skills add https://github.com/sleekdotdesign/agent-skills --skill sleek-design-mobile-apps

# 设置 API 密钥
export SLEEK_API_KEY="your-api-key-here"
```

安装后，AI 代理会自动识别与移动应用设计相关的请求，调用 Sleek API 完成从描述到渲染的全流程。支持 OpenClaw、Claude Code、Cursor、Codex 等所有兼容 HTTP API 的 AI 代理。
