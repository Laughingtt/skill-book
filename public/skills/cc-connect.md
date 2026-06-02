---
slug: cc-connect
name: CC Connect
category: 效率工具与自动化
tags: [connector, integration, platform, service]
description: 特定平台或服务之间的连接器工具
install: "npm install -g cc-connect 或 brew install cc-connect"
source: "https://github.com/chenhg5/cc-connect"
---

# CC Connect（AI Agent 消息平台桥接器）

## 简介

CC Connect 是一个开源的桥接工具，将本地 AI 编程助手连接到主流消息平台。通过它，你可以在飞书、钉钉、微信、Telegram、Slack、Discord 等平台上远程控制 Claude Code、Codex、Cursor Agent、Gemini CLI 等 AI 编程助手，实现随时随地编程协作。

**核心价值**：无需公网 IP，无需内网穿透，在手机上发消息就能让电脑上的 AI Agent 帮你写代码、修 bug、查日志。

## 支持的平台与服务

### 支持的 AI Agent（10+）

| Agent | 说明 |
|-------|------|
| Claude Code | Anthropic 官方 CLI，推荐首选 |
| Codex | OpenAI 编程助手 |
| Cursor Agent | Cursor 编辑器内置 Agent |
| Gemini CLI | Google Gemini 命令行工具 |
| Kimi CLI | 月之暗面 Kimi 命令行工具 |
| Qoder CLI | 代码生成工具 |
| OpenCode | 开源代码助手 |
| iFlow CLI | 工作流自动化工具 |
| Pi | Inflection AI 助手 |
| Devin | 自主 AI 开发者 |
| ACP 协议 | 支持任何兼容 Agent Client Protocol 的 Agent |

### 支持的消息平台（12+）

| 平台 | 连接方式 | 需要公网 IP |
|------|----------|-------------|
| 飞书/Lark | WebSocket | 否 |
| WPS 协作 | WebSocket | 否 |
| 钉钉 | Stream 模式 | 否 |
| Telegram | Long Polling | 否 |
| Slack | Socket Mode | 否 |
| Discord | Gateway WebSocket | 否 |
| 企业微信 | Webhook/长连接 | 部分需要 |
| 微博 | WebSocket | 否 |
| LINE | Webhook | 是 |
| QQ | WebSocket | 否 |
| QQ 官方机器人 | WebSocket | 否 |
| 微信个人号 (ilink) | 长连接 | 否 |

## 安装与配置

### 安装方式

**方式一：npm 安装（推荐）**

```bash
npm install -g cc-connect
```

**方式二：Homebrew 安装（macOS/Linux）**

```bash
brew install cc-connect
```

**方式三：下载二进制文件**

从 [GitHub Releases](https://github.com/chenhg5/cc-connect/releases) 下载对应平台的可执行文件。

**方式四：从源码编译**

```bash
git clone https://github.com/chenhg5/cc-connect
cd cc-connect
go build -o cc-connect ./cmd/cc-connect
```

### 配置文件位置

- 默认路径：`~/.cc-connect/config.toml`
- 本地路径：当前目录下的 `config.toml`
- 自定义路径：`cc-connect --config /path/to/config.toml`

首次运行会自动生成配置模板。

### Web UI 配置（推荐新手）

```bash
cc-connect web
```

在浏览器中可视化创建项目、添加平台、管理服务商，无需手动编辑 TOML 文件。

**注意**：`cc-connect web` 仅用于配置，不会启动服务。配置完成后需单独运行 `cc-connect` 启动服务。

## 连接器类型

### 单项目配置结构

```toml
[[projects]]
name = "my-project"

[projects.agent]
type = "claudecode"  # 或 codex, cursor, gemini, qoder, opencode, iflow

[projects.agent.options]
work_dir = "/path/to/project"
mode = "default"     # default/acceptEdits/plan/yolo
provider = "anthropic"

[[projects.platforms]]
type = "feishu"      # 或 telegram, slack, discord, dingtalk, wecom 等

[projects.platforms.options]
# 平台特定配置
```

### 多项目架构

一个 cc-connect 进程可同时管理多个项目，每个项目独立配置 Agent + 平台组合：

```toml
[[projects]]
name = "project-alpha"
[projects.agent]
type = "claudecode"
[projects.agent.options]
work_dir = "/projects/alpha"
[[projects.platforms]]
type = "feishu"

[[projects]]
name = "project-beta"
[projects.agent]
type = "gemini"
[projects.agent.options]
work_dir = "/projects/beta"
[[projects.platforms]]
type = "telegram"
```

## 使用方法

### 启动服务

**前台运行（调试用）**

```bash
cc-connect
```

**后台服务运行（长期运行）**

```bash
# 安装为系统服务
cc-connect daemon install --config ~/.cc-connect/config.toml

# 启动服务
cc-connect daemon start

# 停止服务
cc-connect daemon stop

# 查看状态
cc-connect daemon status
```

**Windows 系统**

Windows 不支持 `daemon` 命令，直接运行即可：

```bash
cc-connect
```

保持终端窗口打开，服务会持续运行。

### 聊天命令大全

在消息平台中发送以下斜杠命令控制 Agent：

**会话管理**

| 命令 | 说明 |
|------|------|
| `/new [name]` | 创建新会话 |
| `/list` | 列出所有会话 |
| `/switch <id>` | 切换会话 |
| `/current` | 显示当前会话信息 |
| `/history [n]` | 查看最近 n 条历史消息 |
| `/stop` | 停止当前执行 |

**权限控制**

| 命令 | 说明 |
|------|------|
| `/mode` | 查看当前权限模式 |
| `/mode <name>` | 切换权限模式 |
| `/allow <tool>` | 预先批准某个工具 |

**工作目录**

| 命令 | 说明 |
|------|------|
| `/dir` | 查看当前工作目录与历史 |
| `/dir <路径>` | 切换到指定目录 |
| `/dir <序号>` | 按历史序号切换 |
| `/dir -` | 返回上一个目录 |
| `/cd <路径>` | `/dir` 的兼容别名 |

**模型与推理**

| 命令 | 说明 |
|------|------|
| `/model` | 查看或切换模型 |
| `/reasoning` | 切换推理强度 |
| `/provider` | 切换服务商 |
| `/effort` | 调整努力程度 |

**其他**

| 命令 | 说明 |
|------|------|
| `/quiet` | 切换思考/工具进度消息显示 |
| `/help` | 显示帮助信息 |
| `/memory` | 读写 Agent 记忆文件 |
| `/shell <cmd>` | 执行 shell 命令 |
| `/ps <msg>` | 向忙碌会话发送消息 |

### 四种权限模式

| 模式 | 行为 | 适用场景 |
|------|------|----------|
| `default` | 每个工具调用都要批准 | 日常开发，保持控制 |
| `acceptEdits` | 文件编辑自动批准，其他工具需批准 | 信任编辑，控制其他 |
| `plan` | 只做规划，不执行，等批准 | 复杂任务，先看方案 |
| `yolo` | 所有操作自动批准 | 可信环境，放手执行 |

配置文件中设置默认模式：

```toml
[projects.agent.options]
mode = "acceptEdits"
# 也可预先批准特定工具
allowed_tools = ["Read", "Grep", "Glob"]
```

## 数据同步模式

### 多 Agent 编排（中继模式）

在群聊中绑定多个机器人，让不同 Agent 协作：

```toml
[[projects]]
name = "multi-agent-demo"
[[projects.platforms]]
type = "feishu"
[projects.platforms.options]
# 群聊配置

# 绑定多个 Agent
[[projects.binds]]
agent = "claudecode"
[[projects.binds]]
agent = "gemini"
```

同一个对话中，可以问 Claude 后再听 Gemini 的见解。

### 定时任务

自然语言创建 cron 任务：

```
/cron add "每天早上6点总结 GitHub trending"
```

或使用 CLI：

```bash
cc-connect cron add "0 6 * * *" "总结 GitHub trending"
```

### 语音与图片支持

**语音消息（STT）**

发送语音消息，cc-connect 自动转文字。需配置：

```toml
[speech]
provider = "openai"  # 或 groq
api_key = "sk-xxx"
```

需要安装 `ffmpeg`。

**图片支持**

发送截图或图片，Agent 可接收处理。

**Agent 回传附件**

当 Agent 生成截图、图表、PDF 等文件时，可主动发回聊天：

```bash
# Agent 执行
cc-connect send --image /path/to/screenshot.png
cc-connect send --file /path/to/report.pdf
```

配置文件控制：

```toml
[projects.agent.options]
attachment_send = "auto"  # auto/manual/off
```

## 实际示例

### 飞书配置示例

```toml
[[projects]]
name = "my-project"

[projects.agent]
type = "claudecode"

[projects.agent.options]
work_dir = "/Users/dev/my-project"
mode = "acceptEdits"

[[projects.platforms]]
type = "feishu"

[projects.platforms.options]
app_id = "cli_xxx"
app_secret = "xxx"
# 可选：限制访问用户
allow_from = "ou_xxx"
```

**CLI 快速配置**

```bash
cc-connect feishu setup
```

扫码授权后自动写入配置。

### Telegram 配置示例

```toml
[[projects]]
name = "telegram-bot"

[projects.agent]
type = "claudecode"

[projects.agent.options]
work_dir = "/home/dev/project"

[[projects.platforms]]
type = "telegram"

[projects.platforms.options]
token = "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
```

**获取 Token**

1. 在 Telegram 中找 @BotFather
2. 发送 `/newbot`
3. 按提示创建机器人
4. 获取 bot token

### Slack 配置示例

```toml
[[projects]]
name = "slack-workspace"

[projects.agent]
type = "claudecode"

[[projects.platforms]]
type = "slack"

[projects.platforms.options]
bot_token = "xoxb-xxx"
app_token = "xapp-xxx"
```

**权限要求**

- `message.im`, `app_mention`, `chat:write`
- `im:history`, `im:read`, `im:write`
- `app_mentions:read`

### 钉钉配置示例

```toml
[[projects]]
name = "dingtalk-project"

[projects.agent]
type = "claudecode"

[[projects.platforms]]
type = "dingtalk"

[projects.platforms.options]
app_id = "dingxxx"
app_secret = "xxx"
```

## 故障排除

### 常见问题

**1. Claude Code 拒绝作为子进程启动**

在 Claude Code 会话中运行 cc-connect 时，需取消环境变量：

```bash
unset CLAUDECODE && cc-connect
```

或在新终端窗口中运行。

**2. macOS 提示"无法验证开发者"**

移除隔离属性：

```bash
xattr -d com.apple.quarantine cc-connect
```

**3. 飞书机器人无响应**

检查权限配置：
- 确保 `im.message.receive_v1` 事件订阅已启用
- 确保 `im:message:send_as_bot` 权限已授予

**4. Telegram 连接超时**

检查网络是否能访问 `api.telegram.org`，可能需要代理。

**5. 会话列表为空**

使用 `/new` 创建新会话，或检查配置文件中的项目是否正确加载。

### 调试模式

启用详细日志：

```toml
[log]
level = "debug"
```

查看日志输出定位问题。

### 重置会话

```bash
# 在聊天中
/new

# 或删除会话数据
rm -rf ~/.cc-connect/sessions/
```

## 相关资源

- [GitHub 仓库](https://github.com/chenhg5/cc-connect)
- [安装指南](https://github.com/chenhg5/cc-connect/blob/main/INSTALL.md)
- [使用文档](https://github.com/chenhg5/cc-connect/blob/main/docs/usage.md)
- [配置示例](https://github.com/chenhg5/cc-connect/blob/main/config.example.toml)
- [Discord 社区](https://discord.gg/cc-connect)
- [Telegram 群组](https://t.me/cc_connect)
