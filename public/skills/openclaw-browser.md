---
slug: openclaw-browser
name: BB Browser / OpenClaw
category: 效率工具与自动化
tags: [browser, automation, mcp, monitoring, scraping, screenshot]
description: 提供独立浏览器实例，支持托管浏览器和扩展中继两种模式的浏览器自动化工具
install: "npm install -g openclaw && openclaw onboard"
source: "https://github.com/openclaw/openclaw"
---

# BB Browser / OpenClaw 浏览器自动化

## 简介

OpenClaw（昵称 "Molty"）是一个开源的个人 AI 助手，在 GitHub 上拥有超过 68,000 星标。其浏览器自动化功能让 AI 能够像人类一样操作网页——点击按钮、填写表单、抓取数据、截图保存，实现真正的"AI 代你操作浏览器"。

与传统浏览器自动化工具（Puppeteer、Playwright、Selenium）不同，OpenClaw 在自动化之上增加了 AI 层：

- **自然语言控制**：用"去竞争对手网站获取产品 Y 的价格"代替编写 CSS 选择器
- **自适应导航**：即使网站布局变化，AI 也能找到正确的操作路径
- **智能提取**：用自然语言描述你想要的数据，而非硬编码提取规则
- **错误恢复**：当页面加载失败或按钮位置变化时，AI 会自动适应而非崩溃

## 核心功能

### 1. 托管浏览器模式（Managed Browser）

OpenClaw 管理的独立 Chromium 浏览器实例，拥有独立的用户数据目录，与你的日常浏览器完全隔离。

**特点**：
- 安全隔离，不影响个人浏览器数据
- 支持无头模式（headless）运行
- 适合数据采集、自动化测试、后台任务
- 无需安装浏览器扩展

### 2. 用户会话模式（Existing Session）

通过 Chrome DevTools MCP 连接到你已登录的 Chrome 浏览器会话。

**特点**：
- 利用已有的登录状态
- 适合需要访问已登录账户的自动化任务
- 需要用户在场批准连接请求
- 支持 Chrome、Brave、Edge 等 Chromium 内核浏览器

### 3. 远程 CDP 模式

连接到远程 CDP 端点（如 Browserless 等云服务）。

**特点**：
- 适合云端部署
- 支持大规模并发任务
- 无需本地浏览器

### 4. 浏览器扩展中继（Extension Relay）

通过安装 OpenClaw 浏览器扩展，让 AI 控制你当前打开的浏览器标签页。

**特点**：
- 直接操作已登录的网页
- 实时控制，即时反馈
- 适合需要保持登录状态的复杂操作

## 安装与配置

### 快速安装

```bash
# 安装 OpenClaw
npm install -g openclaw

# 启动入门向导
openclaw onboard
```

### 启用浏览器插件

如果 `openclaw browser` 命令不可用，需要在配置文件中启用：

编辑 `~/.openclaw/openclaw.json`：

```json5
{
  plugins: {
    allow: ["telegram", "browser"],
  },
}
```

或者添加根级 `browser` 配置块也会自动激活浏览器插件：

```json5
{
  browser: {
    enabled: true,
    headless: false,
  },
}
```

### 浏览器配置选项

```json5
// ~/.openclaw/openclaw.json
{
  browser: {
    headless: false,        // 是否无头模式
    noSandbox: false,       // 是否禁用沙箱
    executablePath: "/usr/bin/google-chrome",  // 自定义浏览器路径
    defaultProfile: "openclaw",  // 默认配置文件
  },
}
```

## 使用方法与示例

### 基础命令

```bash
# 查看可用配置文件
openclaw browser profiles

# 诊断浏览器状态
openclaw browser --browser-profile openclaw doctor
openclaw browser --browser-profile openclaw doctor --deep

# 查看当前状态
openclaw browser --browser-profile openclaw status

# 启动浏览器
openclaw browser --browser-profile openclaw start

# 打开网页
openclaw browser --browser-profile openclaw open https://example.com

# 获取页面快照
openclaw browser --browser-profile openclaw snapshot

# 截图保存
openclaw browser screenshot --output result.png
```

### 标签页管理

```bash
# 列出所有标签页
openclaw browser tabs

# 打开新标签页
openclaw browser open https://github.com --new-tab

# 聚焦到指定标签页
openclaw browser focus --tab-id 2

# 关闭标签页
openclaw browser close --tab-id 3
```

### 页面操作示例

```bash
# 完整的自动化流程示例

# 1. 启动浏览器
openclaw browser --browser-profile openclaw start

# 2. 打开目标网页
openclaw browser open https://example.com/login

# 3. 等待页面加载
openclaw browser wait "#login-form" --timeout-ms 10000

# 4. 获取页面快照，了解页面结构
openclaw browser snapshot
# 输出示例：
#  1. Username input <input name="username">
#  2. Password input <input name="password" type="password">
#  3. Login button <button type="submit">Login</button>

# 5. 填写表单
openclaw browser type 1 "myusername"
openclaw browser type 2 "mypassword"

# 6. 点击登录
openclaw browser click 3

# 7. 等待跳转完成
openclaw browser wait --url "/dashboard" --load networkidle

# 8. 截图保存结果
openclaw browser screenshot --output dashboard.png
```

### 创建自定义配置文件

```bash
# 创建新的浏览器配置文件
openclaw browser create-profile --name work --color "#FF5A36"

# 创建连接到现有 Chrome 会话的配置文件
openclaw browser create-profile --name chrome-live --driver existing-session

# 创建远程 CDP 配置文件
openclaw browser create-profile --name remote --cdp-url ws://remote-host:9222

# 删除配置文件
openclaw browser delete-profile --name work
```

### 使用用户会话模式

连接到你已登录的 Chrome 浏览器：

**前置条件**：
- Chrome 146 或更新版本
- 在 Chrome 地址栏输入 `chrome://inspect/#devices`
- 开启"允许来自此设备的远程调试"

**配置示例**：

```json5
// ~/.openclaw/openclaw.json
{
  browser: {
    profiles: {
      user: {
        driver: "existing-session",
        userDataDir: "~/.config/google-chrome/Default",  // 可选，指定用户数据目录
      },
    },
  },
}
```

**验证连接**：

```bash
openclaw browser --browser-profile user status
```

### 安装浏览器扩展中继

```bash
# 安装扩展
openclaw browser extension install

# 安装后，在 Chrome 扩展管理页面加载解压的扩展
# chrome://extensions/ -> 开启开发者模式 -> 加载已解压的扩展程序
# 填入授权 token 后即可使用
```

## 配置选项详解

### 全局配置

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `browser.enabled` | boolean | true | 是否启用浏览器功能 |
| `browser.headless` | boolean | false | 是否使用无头模式 |
| `browser.noSandbox` | boolean | false | 是否禁用沙箱（容器环境可能需要） |
| `browser.executablePath` | string | - | 自定义浏览器可执行文件路径 |
| `browser.defaultProfile` | string | "openclaw" | 默认使用的配置文件 |

### 配置文件类型

| 类型 | Driver | 说明 |
|------|--------|------|
| 托管浏览器 | 默认 | OpenClaw 管理的独立浏览器实例 |
| 现有会话 | `existing-session` | 连接到已运行的 Chrome 会话 |
| 远程 CDP | `cdpUrl` | 连接到远程 CDP 端点 |

### 代理配置

大规模数据采集时可配置代理轮换：

```json5
{
  browser: {
    proxy: {
      enabled: true,
      rotation: "round_robin",
      proxies: [
        { host: "proxy1.example.com:8080" },
        { host: "proxy2.example.com:8080" },
        { host: "proxy3.example.com:8080" },
      ],
      user_agent_rotation: true,
      request_delay_ms: 2000,
    },
  },
}
```

## 最佳实践

### 1. 选择合适的浏览器模式

| 场景 | 推荐模式 |
|------|----------|
| 数据采集、爬虫 | 托管浏览器（openclaw profile） |
| 操作已登录账户 | 用户会话模式或扩展中继 |
| 云端部署 | 远程 CDP 模式 |
| 自动化测试 | 托管浏览器 + 无头模式 |

### 2. 安全建议

- **敏感网站**：建议手动登录，不要将凭证交给 AI
- **使用独立配置文件**：为自动化任务创建专用的浏览器配置文件
- **限制权限**：在 `nodeHost.browserProxy.allowProfiles` 中设置允许的配置文件白名单
- **加密连接**：远程 CDP 优先使用 HTTPS/WSS 加密端点

### 3. 自动化工作流设计

```
[启动浏览器] → [打开目标页面] → [获取页面快照] → [执行操作] → [验证结果] → [截图/提取数据]
```

**关键步骤**：
1. 操作前先获取快照，了解页面结构
2. UI 变化后重新获取快照
3. 使用 `wait` 命令等待页面加载完成
4. 遇到登录/验证码/2FA 时，报告为需要人工干预

### 4. 与其他工具集成

OpenClaw 浏览器功能可与其他能力组合：

**浏览器 + AI 分析**：
```
[抓取竞品价格页面] → [AI 分析定价策略] → [生成竞争分析报告] → [发送到 Telegram]
```

**浏览器 + 数据库**：
```
[从 5 个平台抓取产品数据] → [存入数据库] → [AI 检测趋势和异常] → [生成周报]
```

**浏览器 + 通知**：
```
[监控竞品新文章] → [检测到新内容] → [AI 总结] → [发送到 Discord 频道]
```

## 常见问题

### Q: `openclaw browser` 命令不存在？

检查 `~/.openclaw/openclaw.json` 中的 `plugins.allow` 配置，确保包含 `"browser"` 或存在根级 `browser` 配置块。

### Q: 浏览器启动失败？

1. 运行诊断命令：`openclaw browser doctor --deep`
2. 检查 `executablePath` 是否指向有效的浏览器
3. 在容器环境中可能需要设置 `noSandbox: true`

### Q: 无法连接到用户会话？

1. 确认 Chrome 版本 >= 146
2. 确认已开启 `chrome://inspect/#devices` 中的远程调试选项
3. 检查是否有其他 DevTools 连接占用

### Q: 扩展中继显示红色感叹号？

1. 通过命令行安装扩展：`openclaw browser extension install`
2. 在 Chrome 扩展页面加载解压的扩展
3. 确保填入正确的授权 token

### Q: 如何处理需要登录的网站？

两种方案：
1. **用户会话模式**：连接到你已登录的 Chrome 会话
2. **扩展中继**：在已登录的标签页上启用扩展

对于需要 MFA/验证码的网站，建议人工完成验证后再让 AI 接管。

### Q: 无头模式下截图为空白？

某些网站在无头模式下行为不同，可尝试：
1. 设置完整的 User-Agent
2. 添加 `--disable-gpu` 参数
3. 使用有头模式进行调试

## 相关资源

- [OpenClaw 官方文档](https://docs.openclaw.ai/tools/browser)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol)
- [ClawHub 技能市场](https://clawhub.ai)

> **安全提示**：浏览器自动化功能强大，请负责任地使用。遵守网站的 robots.txt 和服务条款，避免对目标网站造成过大负载。敏感账户建议手动操作，不要将凭证交给 AI。
