---
slug: playwright-mcp
name: Playwright MCP
category: 编码开发与工程规范
tags: [testing, browser, e2e, automation, mcp]
description: 通过MCP协议集成Playwright，让AI自动调用进行浏览器操作和端到端自动化测试
scenarios: [e2e-testing, browser-automation, ci-testing]
commands:
  - name: "启动浏览器测试"
    cmd: "claude /verify"
install: "claude mcp add playwright npx @playwright/mcp@latest"
source: "https://github.com/microsoft/playwright-mcp"
---

# Playwright MCP

## 简介

Playwright MCP 是 Microsoft 官方推出的 Model Context Protocol (MCP) 服务器，为 AI 模型提供浏览器自动化能力。它通过结构化的无障碍快照（accessibility snapshots）让 LLM 与网页交互，无需视觉模型即可理解和操作页面元素。

### 核心优势

- **结构化 DOM 访问**：通过无障碍树而非截图理解页面，更精确、更高效
- **跨客户端支持**：兼容 VS Code、Cursor、Windsurf、Claude Code、Claude Desktop 等
- **实时浏览器控制**：AI 可直接操作浏览器，执行导航、点击、表单填写等操作
- **网络请求拦截**：查看和模拟 API 响应，支持复杂的测试场景
- **状态持久化**：保存和恢复浏览器状态（cookies、localStorage）

### Playwright MCP vs Playwright CLI

| 特性 | Playwright MCP | Playwright CLI |
|------|----------------|----------------|
| 适用场景 | AI 代理驱动的自动化、探索性测试、自愈测试 | 编码代理的简洁命令行工作流 |
| 交互方式 | 通过 MCP 工具调用，持久化浏览器上下文 | 通过 CLI 命令，更节省 token |
| 优势 | 丰富的页面内省能力，支持迭代推理 | 简洁高效，避免加载大型工具 schema |

## 核心功能

### 页面导航与交互

- 打开浏览器并导航到指定 URL
- 点击、悬停、拖拽页面元素
- 填写表单、上传文件
- 键盘操作和快捷键

### 页面快照与截图

- **browser_snapshot**：捕获无障碍快照，获取页面结构化表示（推荐用于操作）
- **browser_take_screenshot**：截取页面或元素的视觉截图（用于视觉验证）

### 网络监控与模拟

- 列出页面加载以来的所有网络请求
- 查看请求/响应的详细头信息和内容
- 模拟 API 响应，设置 URL 模式匹配

### 控制台与调试

- 获取浏览器控制台输出
- 执行自定义 JavaScript 代码
- 处理弹窗对话框

### 状态管理

- 保存浏览器状态到文件（cookies、localStorage）
- 从文件恢复状态，复用登录会话
- 管理单个 cookie

## 安装与配置

### 前置要求

- Node.js 18 或更高版本
- MCP 客户端（Claude Code、VS Code、Cursor 等）

### Claude Code 安装

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

### Claude Desktop 配置

编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`（macOS）或对应配置文件：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### VS Code / Cursor 配置

方式一：通过设置界面
- 打开 `Cursor Settings` → `MCP` → `Add new MCP Server`
- 使用 command 类型，填入 `npx @playwright/mcp@latest`

方式二：直接编辑 settings.json

```json
{
  "mcp": {
    "servers": {
      "playwright": {
        "type": "stdio",
        "command": "npx",
        "args": ["@playwright/mcp@latest"]
      }
    }
  }
}
```

### 高级配置选项

```bash
# 无头模式
npx @playwright/mcp@latest --headless

# 指定浏览器
npx @playwright/mcp@latest --browser=firefox

# 设置视口大小
npx @playwright/mcp@latest --viewport-width=1920 --viewport-height=1080

# 使用存储状态（复用登录）
npx @playwright/mcp@latest --storage-state=./auth.json

# 使用配置文件
npx @playwright/mcp@latest --config=./playwright-mcp.json
```

## 可用工具列表

### 导航类工具

| 工具名称 | 功能描述 | 主要参数 |
|----------|----------|----------|
| `browser_navigate` | 导航到指定 URL | `url`（必需） |
| `browser_navigate_back` | 返回上一页 | 无 |
| `browser_tabs` | 管理浏览器标签页 | `action`（list/new/close/select） |

### 交互类工具

| 工具名称 | 功能描述 | 主要参数 |
|----------|----------|----------|
| `browser_click` | 点击页面元素 | `target`（元素选择器）, `button`（left/right/middle） |
| `browser_type` | 在元素中输入文本 | `target`, `text`, `submit`（是否按回车） |
| `browser_hover` | 悬停在元素上 | `target` |
| `browser_drag` | 拖拽元素 | `startTarget`, `endTarget` |
| `browser_select_option` | 选择下拉选项 | `target`, `values` |
| `browser_press_key` | 按下键盘按键 | `key` |
| `browser_fill_form` | 批量填写表单 | `fields`（字段数组） |
| `browser_file_upload` | 上传文件 | `paths`（文件路径数组） |
| `browser_handle_dialog` | 处理弹窗对话框 | `accept`（true/false） |

### 快照与截图工具

| 工具名称 | 功能描述 | 主要参数 |
|----------|----------|----------|
| `browser_snapshot` | 捕获无障碍快照（推荐） | `target`（可选，限定元素）, `depth` |
| `browser_take_screenshot` | 截取页面截图 | `type`（png/jpeg）, `fullPage` |

### 网络与调试工具

| 工具名称 | 功能描述 | 主要参数 |
|----------|----------|----------|
| `browser_network_requests` | 列出网络请求 | `static`（是否包含静态资源） |
| `browser_network_request` | 获取请求详情 | `index`（请求序号）, `part` |
| `browser_console_messages` | 获取控制台消息 | `level`（error/warning/info/debug） |
| `browser_evaluate` | 执行 JavaScript | `function`（JS 代码） |

### 其他工具

| 工具名称 | 功能描述 | 主要参数 |
|----------|----------|----------|
| `browser_close` | 关闭浏览器 | 无 |
| `browser_resize` | 调整浏览器窗口大小 | `width`, `height` |
| `browser_wait_for` | 等待条件 | `text`（等待文本出现）, `time` |
| `browser_run_code_unsafe` | 执行 Playwright 脚本 | `code`（Playwright 代码） |

## 使用方法与示例

### 基础导航与交互

```
让 Claude 执行：
"使用 Playwright MCP 打开 https://example.com 并截图"
```

Claude 会自动调用 `browser_navigate` 导航到页面，然后使用 `browser_take_screenshot` 截图。

### 表单填写示例

```
"打开登录页面 https://app.example.com/login，
填写用户名 test@example.com 和密码 password123，
然后点击登录按钮"
```

Claude 会：
1. 调用 `browser_navigate` 打开页面
2. 调用 `browser_snapshot` 获取页面结构
3. 调用 `browser_type` 填写用户名
4. 调用 `browser_type` 填写密码
5. 调用 `browser_click` 点击登录按钮

### 网络请求监控

```
"打开 https://api.example.com，查看所有 API 请求"
```

使用 `browser_network_requests` 列出请求，然后用 `browser_network_request` 查看详情。

### 执行复杂脚本

对于超出单个工具调用的复杂操作，使用 `browser_run_code_unsafe`：

```javascript
// Claude 会生成类似这样的代码
async (page) => {
  await page.goto('https://example.com');
  await page.fill('#username', 'test@example.com');
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  return await page.title();
}
```

### 端到端测试场景

```
"测试购物车功能：
1. 打开商品页面
2. 添加商品到购物车
3. 验证购物车数量更新
4. 进入结账流程
5. 验证价格计算正确"
```

### 复用登录状态

```bash
# 首先保存登录状态
npx @playwright/mcp@latest --storage-state=./auth.json

# 后续使用保存的状态
npx @playwright/mcp@latest --storage-state=./auth.json
```

## 与其他 MCP 工具对比

| 工具 | 特点 | 适用场景 |
|------|------|----------|
| **Playwright MCP** | Microsoft 官方，结构化无障碍快照，功能全面 | 通用浏览器自动化、E2E 测试 |
| Puppeteer MCP | 基于 Puppeteer，支持本地和远程浏览器 | 已有 Puppeteer 生态的项目 |
| Browserbase MCP | 云端浏览器，自动调试 | 需要云端执行的场景 |
| Browser-use MCP | 基于 browser-use 库 | Python 生态项目 |

### 选择建议

- **首选 Playwright MCP**：官方支持，功能最全，社区活跃（33k+ GitHub stars）
- **Puppeteer MCP**：如果项目已使用 Puppeteer
- **云端方案**：如果本地环境受限（如 WSL2 性能问题）

## 最佳实践

### 1. 优先使用 browser_snapshot

无障碍快照比截图更适合 AI 理解和操作页面：
- 提供结构化的元素信息
- 包含可操作的元素选择器
- 避免 AI 尝试从截图中"看"内容

### 2. 明确指定 "playwright mcp"

首次使用时明确提及 Playwright MCP，避免 Claude 尝试用 Bash 运行 Playwright：

```
"使用 playwright mcp 打开浏览器访问 example.com"
```

### 3. 利用存储状态复用会话

对于需要登录的操作：
- 首次登录后保存状态
- 后续使用 `--storage-state` 复用
- 避免每次都重新登录

### 4. 性能优化

- **WSL2 环境**：注意 I/O 开销，考虑云端方案
- **无头模式**：生产环境使用 `--headless`
- **减少快照深度**：使用 `depth` 参数限制快照层级

### 5. 错误处理

- 使用 `browser_wait_for` 等待元素出现
- 检查 `browser_console_messages` 排查错误
- 利用网络请求监控定位 API 问题

### 6. 安全考虑

- `browser_run_code_unsafe` 可执行任意代码，谨慎使用
- 不要在脚本中硬编码敏感信息
- 使用环境变量传递凭据

## 常见问题

### Q: 浏览器没有打开？

检查：
1. MCP 服务器是否正确配置（运行 `/mcp` 查看）
2. Node.js 版本是否 >= 18
3. 是否在正确的目录运行 Claude Code

### Q: 操作速度很慢？

可能原因：
- WSL2 虚拟化开销
- 首次启动需要下载浏览器
- 网络延迟

解决方案：
- 使用 `--headless` 模式
- 预安装浏览器：`npx playwright install`
- 考虑云端执行方案

### Q: 找不到元素？

- 使用 `browser_snapshot` 查看当前页面结构
- 检查元素是否在 iframe 中
- 使用 `browser_wait_for` 等待元素加载

### Q: 如何处理弹窗？

使用 `browser_handle_dialog`：
```
"处理出现的确认弹窗，点击确定"
```

### Q: 如何调试？

- 查看控制台消息：`browser_console_messages`
- 检查网络请求：`browser_network_requests`
- 使用 headed 模式观察浏览器行为

### Q: 与 Playwright Test 的关系？

- **Playwright Test**：用于编写和运行测试脚本
- **Playwright MCP**：让 AI 代理直接操作浏览器
- 两者可以配合使用：MCP 用于探索和调试，Test 用于正式测试

## 相关资源

- [官方文档](https://playwright.dev/docs/getting-started-mcp)
- [GitHub 仓库](https://github.com/microsoft/playwright-mcp)
- [Playwright 主项目](https://github.com/microsoft/playwright)
- [MCP 协议规范](https://modelcontextprotocol.io)
