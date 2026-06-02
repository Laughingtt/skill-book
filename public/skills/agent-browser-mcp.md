---
slug: agent-browser-mcp
name: Agent Browser MCP
category: 浏览器与文档处理
tags: [browser, mcp, automation, navigate, click, screenshot, rust]
description: MCP服务器提供浏览器自动化能力，使用语义元素定位器而非CSS选择器
install: "npm install -g agent-browser && agent-browser install && npx agent-browser-mcp"
source: "https://github.com/minhlucvan/agent-browser-mcp"
---

# Agent Browser MCP -- 为 AI 代理打造的浏览器自动化服务器

## 简介

Agent Browser MCP 是一个基于模型上下文协议（Model Context Protocol，MCP）的服务器，通过 Vercel Labs 的 [agent-browser](https://github.com/vercel-labs/agent-browser) 提供浏览器自动化能力。它专为 AI 代理设计，与传统面向人类的自动化工具（如 Selenium、Puppeteer）有本质区别：

| 能力 | Agent Browser | 传统工具 |
|------|---------------|----------|
| 元素定位 | 原生无障碍语义定位器 | CSS 选择器 / XPath |
| Token 效率 | 结构化数据，最小化输出 | 冗长的 HTML / 截图 |
| 响应格式 | AI 优化，可解析 | 人类可读 |
| 错误信息 | 可操作，附带上下文 | 通用堆栈跟踪 |

底层引擎使用 Rust 编写的 CLI 客户端 + 常驻守护进程架构，通过 Chrome DevTools Protocol (CDP) 直接通信，无需 Node.js 运行守护进程，性能远超基于 Node.js 的方案。

## 核心功能

### 导航

| 工具 | 说明 |
|------|------|
| `browser_navigate` | 导航到指定 URL |
| `browser_go_back` | 浏览器后退 |
| `browser_go_forward` | 浏览器前进 |
| `browser_reload` | 刷新当前页面 |

### 页面交互

| 工具 | 说明 |
|------|------|
| `browser_click` | 点击元素（支持选择器或无障碍定位器） |
| `browser_fill` | 清空并填充文本输入框 |
| `browser_type` | 逐字符输入文本（触发键盘事件） |
| `browser_hover` | 悬停在元素上 |
| `browser_scroll` | 滚动页面或指定元素 |
| `browser_select` | 选择下拉菜单选项 |
| `browser_check` | 勾选复选框或单选按钮 |
| `browser_uncheck` | 取消勾选复选框 |
| `browser_press` | 按下键盘按键（Enter、Escape、Tab 等） |

### 数据提取

| 工具 | 说明 |
|------|------|
| `browser_get_text` | 获取元素或页面文本内容 |
| `browser_get_html` | 获取 HTML 内容（innerHTML 或 outerHTML） |
| `browser_get_attribute` | 获取元素属性值 |
| `browser_get_url` | 获取当前页面 URL |
| `browser_get_title` | 获取当前页面标题 |
| `browser_snapshot` | 获取无障碍树快照，提供 AI 友好的元素引用 |

### 元素状态检测

| 工具 | 说明 |
|------|------|
| `browser_is_visible` | 检查元素是否可见 |
| `browser_is_enabled` | 检查元素是否启用 |
| `browser_is_checked` | 检查复选框/单选按钮是否选中 |

### 截图与导出

| 工具 | 说明 |
|------|------|
| `browser_screenshot` | 截取页面或指定元素的屏幕截图 |
| `browser_pdf` | 将当前页面导出为 PDF |

### 等待操作

| 工具 | 说明 |
|------|------|
| `browser_wait_for_selector` | 等待元素状态变化（attached、detached、visible、hidden） |
| `browser_wait_for_navigation` | 等待页面导航完成 |

### Cookie 与存储

| 工具 | 说明 |
|------|------|
| `browser_get_cookies` | 获取 Cookie（可按 URL 过滤） |
| `browser_set_cookies` | 设置 Cookie（支持 domain、path、expiry 等） |
| `browser_clear_cookies` | 清除所有 Cookie |

### JavaScript 与调试

| 工具 | 说明 |
|------|------|
| `browser_evaluate` | 在浏览器上下文中执行 JavaScript |
| `browser_get_console` | 获取浏览器控制台消息 |
| `browser_get_network` | 获取浏览器发出的网络请求 |

### 会话管理

| 工具 | 说明 |
|------|------|
| `browser_new_session` | 创建隔离浏览器会话（可自定义视口大小） |
| `browser_close_session` | 关闭浏览器会话 |

## 安装与使用

### 前置条件

- **Node.js 18+** 必须安装
- **Windows 用户注意**：agent-browser 在 Windows 原生 Shell（PowerShell/CMD）下存在已知问题，建议使用 WSL（Windows Subsystem for Linux）

### 安装步骤

```bash
# 全局安装 agent-browser CLI
npm install -g agent-browser

# 下载 Chromium 浏览器引擎
agent-browser install

# Linux 用户可同时安装系统依赖
agent-browser install --with-deps

# 验证安装
agent-browser doctor
```

其他安装方式：

```bash
# macOS Homebrew
brew install agent-browser && agent-browser install

# Cargo (Rust)
cargo install agent-browser && agent-browser install
```

### 配置 MCP 客户端

#### Claude Code

```bash
claude mcp add agent-browser -- npx agent-browser-mcp
```

#### Claude Desktop

编辑 `claude_desktop_config.json`（macOS 路径：`~/Library/Application Support/Claude/`；Windows 路径：`%APPDATA%\Claude\`）：

```json
{
  "mcpServers": {
    "agent-browser": {
      "command": "npx",
      "args": ["agent-browser-mcp"]
    }
  }
}
```

#### VS Code

在 VS Code 设置（JSON）中添加：

```json
{
  "mcp": {
    "servers": {
      "agent-browser": {
        "command": "npx",
        "args": ["agent-browser-mcp"]
      }
    }
  }
}
```

#### Cursor

在 Cursor 的 MCP 设置中添加与 Claude Desktop 相同的 `mcpServers` 配置。

#### 自定义 agent-browser 路径

当 `agent-browser` 不在 PATH 中时，通过环境变量指定路径：

```json
{
  "mcpServers": {
    "agent-browser": {
      "command": "npx",
      "args": ["agent-browser-mcp"],
      "env": {
        "AGENT_BROWSER_PATH": "/path/to/agent-browser"
      }
    }
  }
}
```

## 使用方法与示例

### 基本导航与交互

```
AI 代理: 请打开 GitHub 首页并搜索 "agent-browser-mcp"

1. browser_navigate → https://github.com
2. browser_snapshot → 获取页面无障碍树，找到搜索框引用（如 @e5）
3. browser_click → 点击搜索框 @e5
4. browser_type → 输入 "agent-browser-mcp"
5. browser_press → 按下 Enter
6. browser_snapshot → 获取搜索结果
```

### 表单填写与提交

```
AI 代理: 请在登录页面填写用户名和密码

1. browser_navigate → https://example.com/login
2. browser_snapshot → 找到用户名输入框 @e1 和密码输入框 @e2
3. browser_fill → 填入用户名
4. browser_fill → 填入密码
5. browser_click → 点击登录按钮 @e3
6. browser_wait_for_navigation → 等待页面跳转完成
```

### 隔离会话并行操作

```json
// 创建两个独立会话，互不干扰
{ "name": "browser_new_session", "arguments": { "viewport": { "width": 1920, "height": 1080 } } }
// → 返回 sessionId: "session-1"

// 在会话1中操作
{ "name": "browser_navigate", "arguments": { "url": "https://site-a.com", "sessionId": "session-1" } }

// 创建第二个会话
{ "name": "browser_new_session", "arguments": { "viewport": { "width": 1280, "height": 720 } } }
// → 返回 sessionId: "session-2"

// 在会话2中操作
{ "name": "browser_navigate", "arguments": { "url": "https://site-b.com", "sessionId": "session-2" } }
```

### 数据采集与分析

```
AI 代理: 打开某电商网站，提取所有商品名称和价格

1. browser_navigate → https://shop.example.com/products
2. browser_snapshot → 获取页面结构
3. browser_get_text → 逐个提取商品信息
4. 或者使用 browser_evaluate 执行 JS 批量提取结构化数据
```

### 网络请求监控

```
AI 代理: 打开页面并检查 API 请求

1. browser_navigate → https://app.example.com
2. browser_get_network → 获取所有网络请求
3. 分析请求 URL、状态码、响应内容
```

## 选择器语法

Agent Browser 支持多种语义定位器，对 AI 代理特别友好：

### 引用定位器（推荐）

`@e1`、`@e2` -- 从 `browser_snapshot` 返回的确定性引用，无需重新查询 DOM，是最可靠的定位方式。

### 语义定位器

```
# 按角色和名称
button:has-text("Submit")
[role="button"][name="Login"]

# 按文本内容
text=Click here
:has-text("Welcome")

# 按无障碍属性
[aria-label="Search"]
[placeholder="Enter email"]

# 按 test ID
[data-testid="submit-button"]
```

### 标准 CSS 选择器

```
#email
.form-input
form > input[type="text"]
```

### 推荐工作流

1. `browser_navigate` -- 导航到目标页面
2. `browser_snapshot` -- 获取无障碍树快照及元素引用
3. AI 识别目标元素的引用编号
4. 使用引用执行操作（如 `browser_click` 点击 `@e2`）
5. 页面变化后重新获取快照

## 配置选项

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `AGENT_BROWSER_PATH` | agent-browser 可执行文件路径 | `agent-browser` |
| `AGENT_BROWSER_SESSION` | 使用隔离会话 | -- |
| `AGENT_BROWSER_SESSION_NAME` | 自动保存/恢复会话状态 | -- |
| `AGENT_BROWSER_PROFILE` | Chrome 配置文件名或路径 | -- |
| `AGENT_BROWSER_STATE` | 从 JSON 文件加载存储状态 | -- |
| `AGENT_BROWSER_PROXY` | 代理服务器 URL | -- |
| `AGENT_BROWSER_USER_AGENT` | 自定义 User-Agent | -- |
| `AGENT_BROWSER_HEADLESS` | 是否使用无头模式 | `true` |
| `AGENT_BROWSER_DEFAULT_TIMEOUT` | 操作超时时间（毫秒） | `25000` |
| `AGENT_BROWSER_IDLE_TIMEOUT_MS` | 守护进程空闲自动关闭时间 | -- |

### 安全相关环境变量

| 变量 | 说明 |
|------|------|
| `AGENT_BROWSER_ENCRYPTION_KEY` | 64 位十六进制密钥，用于 AES-256-GCM 加密会话状态 |
| `AGENT_BROWSER_CONTENT_BOUNDARIES` | 在页面输出中包裹边界标记，防止 LLM 注入 |
| `AGENT_BROWSER_MAX_OUTPUT` | 限制页面输出最大字符数，防止上下文溢出 |
| `AGENT_BROWSER_ALLOWED_DOMAINS` | 逗号分隔的允许域名列表，限制导航范围 |
| `AGENT_BROWSER_ACTION_POLICY` | 动作策略 JSON 文件路径 |
| `AGENT_BROWSER_CONFIRM_ACTIONS` | 需要确认的操作类别 |

### 配置文件优先级（由低到高）

1. `~/.agent-browser/config.json` -- 用户级默认配置
2. `./agent-browser.json` -- 项目级覆盖配置
3. `AGENT_BROWSER_*` 环境变量覆盖配置
4. CLI 标志覆盖一切

### 云浏览器提供商

支持多种云端浏览器服务：

- **Browserless**：设置 `BROWSERLESS_API_KEY`
- **Browserbase**：设置 `BROWSERBASE_API_KEY`
- **Kernel**：设置 `KERNEL_API_KEY`
- **AgentCore (AWS Bedrock)**：设置 AWS 凭证和 `AGENTCORE_REGION`

## 最佳实践

### 1. 优先使用 snapshot + 引用定位

不要依赖 CSS 选择器，先获取无障碍树快照，再使用 `@eN` 引用进行操作。这样最稳定，且不受页面结构变化影响。

### 2. 操作后重新获取快照

每次点击、填写等操作可能导致页面变化，旧引用可能失效。操作后务必重新调用 `browser_snapshot` 获取最新状态。

### 3. 使用等待操作避免竞态

页面加载和动态内容需要时间，使用 `browser_wait_for_selector` 或 `browser_wait_for_navigation` 确保元素就绪后再操作。

### 4. 利用会话隔离

并行处理多个任务时，为每个任务创建独立会话，避免 Cookie 和状态的交叉污染。

### 5. 限制输出大小

使用 `AGENT_BROWSER_MAX_OUTPUT` 限制页面输出长度，避免大量 HTML 内容消耗 LLM 上下文窗口。

### 6. 启用安全防护

在生产环境中，建议启用域名白名单（`AGENT_BROWSER_ALLOWED_DOMAINS`）、内容边界标记（`AGENT_BROWSER_CONTENT_BOUNDARIES`）和操作确认（`AGENT_BROWSER_CONFIRM_ACTIONS`）。

### 7. 利用守护进程架构

agent-browser 使用客户端-守护进程架构，守护进程在首次命令后自动启动并持续运行，后续命令执行速度极快。使用 `AGENT_BROWSER_IDLE_TIMEOUT_MS` 设置空闲自动关闭时间。

### 8. 会话状态持久化

使用 `--session-name` 选项自动保存和恢复 Cookie 及 localStorage，适合需要跨多次调用保持登录状态的场景：

```bash
agent-browser --session-name myapp open https://myapp.com
```

状态文件存储在 `~/.agent-browser/sessions/` 目录下，支持 AES-256-GCM 加密。

## 常见问题

### Q: Windows 上无法正常运行怎么办？

agent-browser 在 Windows 原生 Shell（PowerShell/CMD）下存在已知问题。建议使用 WSL（Windows Subsystem for Linux）运行。安装 WSL 后在 Linux 环境中执行 `npm install -g agent-browser && agent-browser install`。

### Q: 如何复用已有 Chrome 的登录状态？

使用 `--profile` 选项指定 Chrome 配置文件名，或使用 `--auto-connect` 自动发现正在运行的 Chrome 实例并保存状态：

```bash
# 列出可用配置文件
agent-browser profiles

# 使用 Default 配置文件
agent-browser --profile Default open https://gmail.com

# 从运行中的 Chrome 保存状态
agent-browser --auto-connect state save ./my-auth.json

# 使用保存的状态
agent-browser --state ./my-auth.json open https://app.example.com/dashboard
```

### Q: 操作超时怎么处理？

默认超时为 25 秒。可通过 `AGENT_BROWSER_DEFAULT_TIMEOUT` 环境变量调整（单位毫秒）。注意不要超过 30000 毫秒，否则可能导致 EAGAIN 错误。CLI 会自动重试瞬态错误。

### Q: 如何调试浏览器操作？

- 使用 `browser_get_console` 查看控制台消息
- 使用 `browser_get_network` 监控网络请求
- 使用 `--headed` 标志显示浏览器窗口，实时观察操作过程
- 使用 `agent-browser doctor --fix` 诊断并修复安装问题

### Q: 与 Playwright MCP 有什么区别？

Agent Browser 专为 AI 代理设计，核心区别在于：
- **语义定位器**：使用无障碍树引用（`@e1`）而非 CSS 选择器
- **Rust 引擎**：原生 Rust CLI + 守护进程，性能优于 Node.js 方案
- **Token 效率**：返回精简的结构化数据，减少上下文消耗
- **AI 优化错误信息**：错误消息包含可操作建议，便于 AI 自行修复

### Q: 如何在项目中快速集成？

最简单的方式是使用 Skills 安装：

```bash
npx skills add vercel-labs/agent-browser
```

这会自动在 `.claude/skills/agent-browser/SKILL.md` 创建发现存根，运行时通过 `agent-browser skills get core` 加载指令。适用于 Claude Code、Codex、Cursor、Gemini CLI、GitHub Copilot 等工具。
