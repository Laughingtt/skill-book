---
slug: aionui
name: AionUI
category: UI/UX设计与前端美化
tags: [ai, ui, component, generation]
description: AI驱动的用户界面组件生成
install: "从 GitHub Releases 下载桌面应用（macOS/Windows/Linux）"
source: "https://github.com/iOfficeAI/AionUi"
---

# AionUI — AI Agent 统一桌面协作平台

## 简介

AionUI（AionUi）是一款免费、开源、跨平台的 AI Agent 桌面协作应用。它将多个命令行 AI 工具（Claude Code、Codex、Gemini CLI、Qwen Code、OpenClaw 等）统一到一个图形化桌面环境中，让 AI Agent 像数字同事一样在你的电脑上协同工作。

与单一 AI 聊天工具不同，AionUI 的核心定位是 **"一个桌面，所有 Agent 协作"**：

- **内置 Agent 引擎**：安装即用，无需额外配置 CLI 工具，通过 Google 账号或 API Key 即可启动
- **多 Agent 模式**：自动检测已安装的 CLI Agent，将它们纳入统一管理界面
- **团队编排**：Leader-Teammate 模式，多个 Agent 协调分工完成复杂任务
- **本地优先**：所有数据存储在本地 SQLite，不上传任何服务器；支持 Ollama 完全离线运行
- **24/7 自动化**：Cron 定时任务，Agent 在你离开时持续工作

AionUI 采用 Apache 2.0 许可证，支持 macOS、Windows、Linux 三大平台，GitHub 星标超过 27,000。

## 核心功能

### 1. 内置 Agent — 零配置启动

AionUI 自带完整的 AI Agent 引擎（Aion CLI），安装后即可使用，无需额外安装任何 CLI 工具。支持 Google 账号一键登录，自动关联 Gemini 模型。

### 2. 多 Agent 统一管理

自动检测本机已安装的 CLI Agent，目前支持 13+ 种：

| Agent | 说明 |
|---|---|
| Claude Code | Anthropic 官方编程 Agent |
| Codex | OpenAI 编程 Agent |
| Gemini CLI | Google 命令行 AI |
| Qwen Code | 通义灵码编程助手 |
| OpenClaw | 开源 Agent 工具 |
| Hermes Agent | 多功能 Agent |
| OpenCode | 开源代码 Agent |
| Kimi CLI | 月之暗面命令行工具 |

安装对应 CLI 后，AionUI 自动识别，无需手动配置。

### 3. 团队模式（Team Mode）

通过 ACP（Agent Communication Protocol）实现 Leader-Teammate 编排：

- **Leader Agent** 接收用户任务，拆解为子任务
- **Teammate Agent** 各自执行分配的子任务
- 多个 Agent 并行工作，独立上下文窗口互不干扰
- 结果汇总回 Leader，统一交付

### 4. 统一 MCP 配置

配置一次 MCP（Model Context Protocol）服务，自动同步到所有 Agent。无需为每个 Agent 单独维护 `mcp.json`：

- 支持标准 stdio 和 SSE 传输方式
- JSON 配置导入 + 一键添加
- 自动连接测试与状态监控
- 批量启用/禁用服务

### 5. Office 文档原生生成

通过内置 OfficeCLI 引擎，直接生成可编辑的 Office 文档：

| 文档类型 | 格式 | 特性 |
|---|---|---|
| PPT 演示文稿 | `.pptx` | 支持 Morph 动画切换，连贯故事叙述 |
| Word 文档 | `.docx` | 生产级文档编辑，排版就绪 |
| Excel 表格 | `.xlsx` / `.csv` | 自动格式化、图表生成、数据分析 |
| PDF 文档 | `.pdf` | 原生导出 |

所有文件在本地生成，无需上传云端或使用第三方服务。

### 6. 定时任务（Cron Scheduling）

用自然语言设置定时任务，AionUI 自动转换为 Cron 表达式：

- 标准 Cron 表达式
- 固定间隔执行
- 一次性触发
- 任务绑定到对话，保持上下文连续性
- 结果推送到 Telegram、飞书、钉钉
- 防止系统休眠，确保任务按时执行

### 7. 远程访问

- **WebUI 模式**：通过浏览器远程访问本地 AionUI
- **消息渠道集成**：通过 Telegram、Slack、Discord、飞书发送指令
- **VPS 部署**：在服务器上运行 AionCore 后端，实现 24/7 在线

### 8. AI 图像生成与编辑

支持 Gemini 2.5 Flash 等模型的图像生成能力，在工作流中直接创建和编辑图片。

### 9. 技能市场（Skills Marketplace）

浏览和安装社区技能扩展 Agent 能力，或创建并分享自己的技能：

- PPT Creator、Excel Pro、Academic Paper
- Beautiful Mermaid、UI/UX Pro Max（57 种风格、95 种配色）
- 3D Game、Story Roleplay、Planner
- 支持自定义技能创建

### 10. 预览面板

内置文件预览，支持 Office 文档、Markdown、代码、媒体文件等格式。

## 安装与启动

### 系统要求

- macOS 10.15+ / Windows 10+ / Linux（现代发行版）
- 网络连接（使用云端模型时）；本地模型可离线运行

### 下载安装

**方式一：GitHub Releases 下载（推荐）**

访问 [GitHub Releases](https://github.com/iOfficeAI/AionUi/releases) 下载对应平台安装包：

- macOS：`.dmg` 文件
- Windows：`.exe` 文件
- Linux：`.AppImage` 或 `.deb` 文件

**方式二：Homebrew 安装（macOS 推荐）**

```bash
brew install aionui
```

**方式三：从源码构建**

```bash
git clone https://github.com/iOfficeAI/AionUi.git
cd AionUi
npm install
npm run build
```

### 首次启动配置

1. 启动 AionUI，进入欢迎界面
2. 选择 Agent 模式：
   - **内置 Agent**：默认模式，无需额外安装
   - **多 Agent 模式**：自动检测已安装的 CLI Agent
3. 配置认证：
   - **Google 账号登录**（推荐）：自动关联 Gemini 模型
   - **API Key 配置**：支持 Gemini、Anthropic、OpenAI、DeepSeek、Zhipu 等 30+ 平台
   - **本地模型**：配置 Ollama 实现完全离线运行

### 数据存储位置

所有对话和配置保存在本地：

| 平台 | 路径 |
|---|---|
| macOS | `~/Library/Application Support/AionUi/` |
| Windows | `%APPDATA%/AionUi/` |
| Linux | `~/.config/AionUi/` |

## 使用方法

### 基本对话

启动后选择一个 Agent，直接在对话窗口输入指令：

```
帮我整理桌面上的文件，按类型分类
→ Agent 自动扫描目录、创建文件夹、移动文件
```

```
生成一份季度销售报告的 PPT
→ Agent 调用 OfficeCLI 生成 .pptx 文件，支持 Morph 动画
```

### 多 Agent 并行会话

1. 创建多个会话，每个绑定不同 Agent
2. 各会话独立上下文，互不干扰
3. 可在不同 Agent 间切换继续对话

### 团队模式协作

```
用户：开发一个完整的 Web 应用，包含前端、后端和数据库设计
→ Leader Agent 拆解任务：
  - Claude Code：负责后端 API 开发
  - Codex：负责前端界面实现
  - Gemini CLI：负责数据库 Schema 设计
→ 各 Teammate 并行执行，结果汇总交付
```

### 定时任务设置

用自然语言描述定时任务：

```
每天早上 9 点，总结昨天的 Git 提交记录
→ AionUI 自动生成 Cron 表达式，绑定对话上下文
→ 每日自动执行，结果推送到对话窗口
```

```
每周一早上 8 点生成销售周报
→ 自动执行，结果可推送到飞书/钉钉
```

### MCP 服务配置

1. 进入设置 → MCP 配置
2. 添加 MCP 服务（JSON 配置或一键导入）
3. 自动测试连接，验证可用性
4. 配置自动同步到所有 Agent

```
配置 filesystem MCP 后：
用户：帮我整理桌面文件
→ Agent 调用 filesystem MCP 扫描、分类、移动文件
```

### 远程控制

通过 Telegram/Slack/Discord 发送指令：

```
在 Telegram 中发送：帮我检查服务器日志中的错误
→ 家中的 AionUI Agent 执行任务，结果回传到 Telegram
```

## 组件类型与内置助手

AionUI 内置 21 个专业助手，覆盖常见办公和开发场景：

| 助手 | 用途 | 输出格式 |
|---|---|---|
| PPT Creator | 演示文稿创建 | `.pptx`（Morph 动画） |
| Word Creator | 文档撰写 | `.docx` |
| Excel Creator | 表格与数据分析 | `.xlsx` / `.csv` |
| Word Form Creator | 表单文档 | `.docx` |
| UI/UX Pro Max | UI 设计（57 种风格、95 种配色） | 设计稿 |
| Beautiful Mermaid | 流程图、时序图 | Mermaid 图表 |
| Dashboard Creator | 数据看板设计 | 可视化面板 |
| 3D Game | 单文件游戏原型 | HTML 游戏 |
| Academic Paper | 学术论文排版 | 结构化文档 |
| Story Roleplay | 故事创作与角色扮演 | 文本 |
| Planning with Files | 基于文件的项目规划 | 规划文档 |
| Financial Model | 财务模型构建 | `.xlsx` |
| Cowork | 自动化任务执行 | 多格式 |

## 与开发工作流集成

### 与 Claude Code 协同

AionUI 不替代 Claude Code，而是将其纳入统一管理：

- 自动检测已安装的 Claude Code
- 在 GUI 中管理 Claude Code 会话
- MCP 配置一次，Claude Code 自动同步
- 与其他 Agent 并行协作

### 与现有工具链共存

- **零冲突**：AionUI 自动检测并复用已安装的 CLI 工具，不覆盖配置
- **统一 MCP**：一处配置，所有 Agent 共享
- **Git 集成**：Agent 可直接操作本地 Git 仓库
- **文件管理**：批量重命名、自动分类、智能文件整理

### VPS 部署

v2.1.0 引入 Rust 后端（AionCore），支持无头部署：

```bash
# 在服务器上运行 AionCore 后端
aionui-backend --work-dir /data/aionui

# 通过浏览器 WebUI 远程访问
# 或通过 @aionui/web-host 部署前端
```

开放 `/api/` 和 `/ws` 端点，支持自定义前端集成。

## 最佳实践

1. **从内置 Agent 开始**：首次使用建议先用内置 Agent 熟悉界面，再逐步接入外部 CLI Agent
2. **统一 MCP 配置**：在 AionUI 中集中管理 MCP 服务，避免为每个 Agent 单独配置
3. **善用定时任务**：将重复性工作（日报、代码审查、备份）设为 Cron 任务，释放手动操作时间
4. **团队模式处理复杂任务**：多步骤任务使用 Team Mode，让 Leader 拆解、Teammate 并行执行
5. **本地模型降本**：对隐私敏感或成本敏感场景，配置 Ollama 使用本地模型
6. **远程访问提效**：通过 Telegram/飞书远程发送指令，不在电脑前也能驱动 Agent 工作
7. **技能市场扩展能力**：按需安装社区技能，快速获得专业领域能力（财务建模、学术写作等）
8. **API Key 轮换**：AionUI 支持同一平台多 API Key 自动轮换，应对速率限制

## 示例项目

### 示例 1：自动化周报生成

```
设置定时任务：每周五下午 5 点
指令：汇总本周 Git 提交记录，生成项目周报 Word 文档
→ AionUI 自动执行，生成 .docx 文件，推送到飞书
```

### 示例 2：多 Agent 协作开发

```
用户：为电商平台开发用户管理模块
→ Leader (Claude Code) 拆解：
  - Codex：实现前端用户界面
  - Gemini CLI：设计数据库 Schema
  - Claude Code：编写后端 API + 集成测试
→ 并行执行，代码自动提交到 Git
```

### 示例 3：数据分析与报告

```
用户：分析这份销售数据，生成 Excel 报表和 PPT 汇报
→ Agent 调用 Excel Creator：生成 .xlsx（含图表、自动格式化）
→ Agent 调用 PPT Creator：生成 .pptx（Morph 动画切换）
→ 两个文件均在本地生成，可直接编辑
```

### 示例 4：远程运维

```
通过 Telegram 发送：检查服务器 Nginx 日志中的 5xx 错误
→ 家中 AionUI Agent 执行命令，分析日志
→ 结果回传到 Telegram 对话
```

## 常见问题

**Q：没有安装任何 CLI 工具，能用 AionUI 吗？**
A：可以。AionUI 自带内置 Agent 引擎，通过 Google 登录或 API Key 即可使用。

**Q：AionUI 会和已安装的 Claude Code 冲突吗？**
A：不会。AionUI 自动检测并复用已安装的 CLI 工具，不覆盖配置，不重复安装。

**Q：数据安全吗？**
A：所有数据存储在本地 SQLite，不上传任何服务器。使用 Ollama 本地模型可实现完全离线运行。

**Q：支持哪些 AI 模型平台？**
A：支持 30+ 平台，包括 Gemini、Anthropic、OpenAI、DeepSeek、Zhipu、Dashscope、SiliconFlow、Ollama 等。中国大陆用户可使用 Dashscope、Zhipu 等国内平台。

**Q：如何切换模型？**
A：不同 Agent 使用各自默认模型，可在会话间切换 Agent 来间接切换模型。同一会话内也可切换模型。

**Q：Electron 应用内存占用高吗？**
A：Electron 应用确实有一定内存开销。如果只使用单一 Agent，直接在终端运行 CLI 更轻量。AionUI 的价值在于多 Agent 协同、GUI 管理、定时任务和 Office 生成等场景。
