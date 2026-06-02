---
slug: agent-browser
name: Agent Browser
category: 浏览器与文档处理
tags: [browser, automation, navigation, forms, screenshot, extraction, testing]
description: AI Agent浏览器自动化CLI，支持网页导航、表单填写、按钮点击、截图和数据提取
install: "npx skills add https://github.com/vercel-labs/agent-browser --skill agent-browser"
source: "https://www.skills.sh/vercel-labs/agent-browser/agent-browser"
---

Agent Browser 是由 Vercel Labs 开发的浏览器自动化 CLI 工具，专为 AI Agent 设计。它让 AI 能够像人类一样与网站交互，支持页面导航、表单填写、按钮点击、截图、数据提取和 Web 应用测试。

## 简介

Agent Browser 是一款革命性的浏览器自动化工具，与传统浏览器自动化工具（如 Playwright、Puppeteer）不同，它从底层设计就考虑了 AI Agent 的使用场景。其核心创新是 **Ref 引用系统** —— 通过快照获取页面的可访问性树，每个交互元素都会分配一个稳定的引用标识（如 `@e1`、`@e2`），AI 可以直接使用这些引用进行操作，无需编写复杂的 CSS 选择器或 XPath。

### 为什么选择 Agent Browser？

- **Token 效率极高**：文本输出仅使用约 200-400 tokens，而完整 DOM 需要 3000-5000 tokens，节省 93% 的上下文窗口
- **确定性交互**：Ref 引用指向快照中的确切元素，无需 DOM 重新查询
- **原生 Rust 性能**：命令解析开销低于 1 毫秒，非 Node.js 包装器
- **零 MCP 开销**：作为 CLI 工具，无需 JSON Schema 或工具定义，避免 MCP 服务器的 token 开销

## 核心特性

### 1. Ref 引用系统

Agent Browser 的核心创新是 Ref 引用系统。执行 `snapshot -i` 命令时，返回紧凑的可访问性树：

```
- heading "Example Domain" [ref=e1]
- link "More information..." [ref=e2]
- button "Submit" [ref=e3]
- textbox "Email" [ref=e4]
```

每个元素都有唯一的 ref 标识符，后续操作直接使用：

```bash
agent-browser click @e3      # 点击提交按钮
agent-browser fill @e4 "user@example.com"  # 填写邮箱
```

### 2. 50+ 完整命令集

| 类别 | 命令示例 | 说明 |
|------|----------|------|
| 导航 | `open`, `back`, `forward`, `reload` | 页面导航控制 |
| 交互 | `click`, `fill`, `type`, `hover`, `check` | 元素操作 |
| 信息 | `snapshot`, `get url`, `get title`, `text` | 获取页面信息 |
| 等待 | `wait --load`, `wait --url`, `wait --text` | 智能等待 |
| 截图 | `screenshot`, `screenshot --fullpage` | 视觉捕获 |
| 网络 | `network requests`, `route`, `intercept` | 网络监控 |
| 存储 | `cookies`, `localStorage`, `state` | 数据持久化 |
| 标签 | `tab new`, `tab select`, `tab close` | 多标签管理 |

### 3. 会话与认证管理

支持多种认证持久化方式：

- **Chrome Profile 复用**：直接使用现有 Chrome 的登录状态
- **会话持久化**：自动保存/恢复 cookies 和 localStorage
- **认证保险库**：本地加密存储凭据，按名称登录
- **状态文件**：加载/保存完整的浏览器状态 JSON

### 4. 多浏览器引擎支持

- **Chrome/Chromium**（默认）：通过 CDP 协议直接控制
- **Lightpanda**：轻量级浏览器引擎
- **Safari**（iOS Simulator）：通过 WebDriver 控制，用于真实移动端测试

### 5. 云浏览器集成

支持多个云浏览器提供商，适用于无本地浏览器的环境：

- **Browserless**：企业级云浏览器基础设施
- **Browserbase**：专为 AI Agent 设计的远程浏览器
- **Browser Use Cloud**：AI 浏览器自动化云服务
- **Kernel**：支持隐身模式和持久化配置文件
- **AWS Bedrock AgentCore**：AWS 托管的云浏览器会话

## 安装与配置

### 全局安装（推荐）

```bash
# npm 安装（全平台）
npm install -g agent-browser

# 首次使用需下载 Chromium
agent-browser install

# macOS 也可使用 Homebrew
brew install agent-browser
```

### 快速试用（无需安装）

```bash
npx agent-browser install
npx agent-browser open example.com
```

### 从源码构建

需要 Node.js 24+、pnpm 11+ 和 Rust：

```bash
git clone https://github.com/vercel-labs/agent-browser
cd agent-browser
pnpm install
pnpm build
```

### Linux 系统依赖

在 Linux 上需要安装系统依赖：

```bash
# Ubuntu/Debian
sudo apt-get install -y \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libdrm2 libxkbcommon0 libxcomposite1 \
  libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2

# Fedora/RHEL
sudo dnf install -y nss atk at-spi2-atk cups-libs \
  libdrm libxkbcommon libXcomposite libXdamage \
  libXfixes libXrandr alsa-lib
```

### 配置文件

创建 `agent-browser.json` 设置持久默认值：

```json
{
  "$schema": "https://agent-browser.dev/schema.json",
  "headed": false,
  "screenshotDir": "./screenshots",
  "defaultTimeout": 25000
}
```

配置文件优先级（从低到高）：
1. `~/.agent-browser/config.json`
2. `./agent-browser.json`
3. 环境变量 `AGENT_BROWSER_*`

## 使用方法与示例

### 基础工作流

```bash
# 1. 打开页面
agent-browser open https://example.com

# 2. 获取交互元素快照
agent-browser snapshot -i

# 3. 使用 ref 进行交互
agent-browser click @e2
agent-browser fill @e3 "search text"

# 4. 截图保存
agent-browser screenshot result.png

# 5. 关闭浏览器
agent-browser close
```

### 页面导航

```bash
# 打开 URL
agent-browser open https://github.com

# 等待页面加载完成
agent-browser wait --load networkidle

# 导航历史
agent-browser back
agent-browser forward
agent-browser reload

# 获取当前 URL
agent-browser get url
```

### 表单填写

```bash
# 打开登录页面
agent-browser open https://app.example.com/login
agent-browser wait --load networkidle

# 获取表单元素
agent-browser snapshot -i
# 输出示例：
# - textbox "Email" [ref=e1]
# - textbox "Password" [ref=e2]
# - button "Sign In" [ref=e3]

# 填写表单
agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "SecureP@ssw0rd!"
agent-browser click @e3

# 等待登录完成
agent-browser wait --url "/dashboard"
```

### 下拉选择与复选框

```bash
# 下拉选择
agent-browser select @e5 "Option Value"

# 复选框
agent-browser check @e6    # 勾选
agent-browser uncheck @e7  # 取消勾选

# 单选按钮
agent-browser click @e8    # 选择单选选项
```

### 文件上传

```bash
agent-browser upload @e10 /path/to/file.pdf
```

### 截图与视觉验证

```bash
# 基础截图
agent-browser screenshot page.png

# 全页截图
agent-browser screenshot --fullpage full.png

# 带标注的截图（元素编号覆盖）
agent-browser screenshot --annotate annotated.png

# 指定元素截图
agent-browser screenshot --selector "#main-content" element.png
```

### 数据提取

```bash
# 获取页面文本内容
agent-browser text

# 获取特定元素文本
agent-browser text --selector ".product-title"

# 获取结构化数据
agent-browser snapshot -u  # 包含链接 URL

# 网络请求监控
agent-browser network requests --filter "api"
```

### 多标签页管理

```bash
# 新建标签页
agent-browser tab new --url https://docs.example.com

# 标签页会返回 ID，如 t2
agent-browser tab select t2

# 为标签页设置标签名
agent-browser tab label t2 docs

# 使用标签名切换
agent-browser tab select docs

# 关闭标签页
agent-browser tab close t2
```

### 批量命令执行

避免每命令进程启动开销：

```bash
# 单次调用执行多命令
agent-browser batch \
  'open https://example.com' \
  'wait --load networkidle' \
  'snapshot -i' \
  'screenshot result.png' \
  'close'
```

### 命令链式调用

使用 `&&` 链接命令，浏览器通过后台守护进程保持：

```bash
agent-browser open example.com && \
agent-browser snapshot -i && \
agent-browser click @e1 && \
agent-browser screenshot clicked.png
```

## 与 AI Agent 集成

### Claude Code 集成

```bash
# 安装为 Claude Code 技能
npx skills add https://github.com/vercel-labs/agent-browser --skill agent-browser
```

安装后，在项目或全局指令文件中添加：

```markdown
# CLAUDE.md 或 AGENTS.md

Use agent-browser for all browser automation tasks. Run `agent-browser --help` to see available commands.

Workflow:
1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs
3. `agent-browser click @eN` / `fill @eN "text"` - Interact using refs
4. Re-snapshot after page changes
```

### AI Agent 最佳工作流

```bash
# 1. 使用 --json 获取机器可读输出
agent-browser snapshot -i --json

# 2. 解析 JSON 获取元素引用
# 3. 使用引用执行操作
agent-browser click @e1

# 4. 验证操作结果
agent-browser snapshot -i --json
```

### 自我验证循环

Agent Browser 特别适合 AI Agent 的自我验证场景：

1. AI 构建前端组件
2. Agent Browser 打开应用
3. AI 与界面交互测试
4. 验证行为符合预期
5. 如有问题，修复代码并重新测试

这种验证循环无需人工干预，AI 可以自主完成从开发到测试的全流程。

### 可观测性仪表板

启动本地监控仪表板：

```bash
# 仪表板自动在端口 4848 运行
# 访问 http://localhost:4848
```

仪表板显示：
- 实时浏览器视口
- 命令活动流
- 会话状态
- AI 聊天面板（需设置 `AI_GATEWAY_API_KEY`）

## 最佳实践

### 1. 始终使用 Ref 而非选择器

```bash
# 推荐：使用 ref
agent-browser click @e3

# 不推荐：使用 CSS 选择器（脆弱）
agent-browser click --selector "#submit-btn"
```

Ref 引用来自快照，具有确定性，不会因 DOM 结构变化而失效。

### 2. 页面变化后重新快照

```bash
agent-browser click @e1    # 触发页面变化
agent-browser wait --load networkidle
agent-browser snapshot -i  # 重新获取快照
# 现在使用新的 ref
```

### 3. 使用会话持久化避免重复登录

```bash
# 首次登录
agent-browser open https://app.example.com --session-name myapp
# ... 执行登录流程 ...

# 后续使用，自动恢复登录状态
agent-browser open https://app.example.com --session-name myapp
```

### 4. 合理使用等待策略

```bash
# 等待网络空闲
agent-browser wait --load networkidle

# 等待特定 URL
agent-browser wait --url "/success"

# 等待文本出现
agent-browser wait --text "Welcome"
```

### 5. 使用批处理提高效率

```bash
# 单次 CLI 调用执行多步骤
agent-browser batch \
  'open https://example.com/form' \
  'fill @e1 "John Doe"' \
  'fill @e2 "john@example.com"' \
  'click @e3' \
  'screenshot result.png'
```

### 6. 调试时使用有头模式

```bash
agent-browser open example.com --headed
```

### 7. 使用语义定位器作为备选

当 ref 不可用时，可使用语义定位器：

```bash
# 按角色和名称查找
agent-browser click button --name "Submit"
agent-browser fill textbox --name "Email" "user@example.com"

# 精确匹配
agent-browser click link --name "Documentation" --exact
```

## 常见问题与限制

### Q: 与 Playwright MCP 相比有何优势？

**Agent Browser 优势**：
- Token 效率高 93%，适合长自动化会话
- CLI 接口，无 MCP Schema 开销
- Ref 系统比选择器更稳定
- 适合 AI Agent 自主验证场景

**Playwright MCP 优势**：
- 网络拦截更强大
- 多标签处理更完善
- PDF 生成支持
- 更好的等待逻辑
- 深度调试能力（堆快照、Lighthouse 审计）

### Q: Windows 平台支持情况？

Agent Browser 在 Windows 上存在一些已知问题：
- Socket 文件处理问题
- 守护进程启动兼容性
- Git Bash 路径处理
- PowerShell 语法问题

建议在 Windows 上使用 WSL 或等待官方修复。

### Q: 如何处理动态内容？

使用等待策略确保内容加载完成：

```bash
agent-browser wait --load networkidle
agent-browser wait --text "Loading complete"
```

对于 AJAX 内容，可能需要多次快照：

```bash
agent-browser snapshot -i
# 如果目标元素未出现，等待后重试
agent-browser wait --time 2
agent-browser snapshot -i
```

### Q: 如何处理弹窗和对话框？

默认情况下，`alert` 和 `beforeunload` 对话框会自动关闭。`confirm` 和 `prompt` 需要显式处理：

```bash
# 禁用自动处理
agent-browser open example.com --no-auto-dialog

# 处理对话框
agent-browser dialog accept
agent-browser dialog dismiss --text "response text"
```

### Q: 如何在无头环境（CI/CD）中使用？

Agent Browser 默认无头运行，适合 CI/CD 环境。也可使用云浏览器提供商：

```bash
# 使用 Browserless
agent-browser open example.com -p browserless

# 使用 Browserbase
BROWSERBASE_API_KEY=your-key agent-browser open example.com -p browserbase
```

### Q: 如何处理认证？

多种方式可选：

```bash
# 1. 使用现有 Chrome 配置文件
agent-browser open app.com --profile "Profile 1"

# 2. 会话持久化
agent-browser open app.com --session-name mysession

# 3. 认证保险库
agent-browser auth save github --url https://github.com/login
agent-browser auth login github

# 4. 直接设置请求头
agent-browser open api.example.com --headers '{"Authorization": "Bearer token"}'
```

### Q: 支持哪些浏览器？

- **Chrome/Chromium**：完全支持，通过 CDP 协议
- **Lightpanda**：实验性支持
- **Safari**：仅限 iOS Simulator，通过 WebDriver

### Q: 如何获取更多帮助？

```bash
# 查看所有命令
agent-browser --help

# 查看特定命令帮助
agent-browser snapshot --help

# 加载核心技能文档
agent-browser skills get core

# 加载完整命令参考
agent-browser skills get core --full

# 查看专用技能
agent-browser skills list
agent-browser skills get electron    # Electron 应用
agent-browser skills get slack       # Slack 自动化
agent-browser skills get dogfood     # 探索性测试
```

## 相关资源

- [官方网站](https://agent-browser.dev)
- [GitHub 仓库](https://github.com/vercel-labs/agent-browser)
- [SkillzWave 技能页面](https://www.skills.sh/vercel-labs/agent-browser)
- [Awesome MCP Servers](https://mcpservers.org/agent-skills/vercel/agent-browser)
