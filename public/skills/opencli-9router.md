---
slug: opencli-9router
name: OpenCLI / 9Router
category: 效率工具与自动化
tags: [cli, router, api, terminal, model]
description: 终端环境下的AI调用或API路由管理工具
install: "npm install -g 9router && 9router"
source: "https://github.com/decolua/9router"
---

# OpenCLI / 9Router

## 简介

OpenCLI / 9Router 是一个开源的智能 AI 路由网关，它将你的 CLI/IDE 工具（Claude Code、Codex、Cursor、Cline、Copilot 等）通过一个 OpenAI 兼容的端点连接到 60+ AI 提供商。其核心价值在于 **3 层智能回退机制**——当订阅额度耗尽时自动切换到廉价或免费提供商，确保你永远不需要因为配额限制而中断编码工作。

9Router 基于 Next.js 构建，采用 SSE（Server-Sent Events）流式架构，内置格式翻译层，可在 OpenAI、Claude、Gemini、Cursor、Kiro、Vertex 等不同 API 格式之间透明转换。同时集成 RTK Token 压缩和 Caveman Mode，可节省 20%-65% 的 Token 消耗。

## 9Router 核心概念

### 智能 3 层回退（3-Tier Smart Fallback）

9Router 的核心路由策略将提供商分为三个优先层级：

| 层级 | 类型 | 示例提供商 | 特点 |
|------|------|-----------|------|
| Tier 1 | 订阅提供商 | Claude Code、OpenAI Codex、GitHub Copilot | 你已有的付费订阅，优先使用 |
| Tier 2 | 廉价提供商 | GLM ($0.60/1M)、MiniMax ($0.20/1M)、Kimi ($9/月) | 极低成本，推理能力优秀 |
| Tier 3 | 免费提供商 | Kiro AI、iFlow、Qwen、OpenCode Free | 零成本，无限使用 |

当 Tier 1 的配额耗尽或返回 429/503 错误时，9Router 自动将请求路由到 Tier 2；若 Tier 2 也失败，则降级到 Tier 3 的免费提供商。整个过程对调用方完全透明。

### 格式翻译（Format Translation）

不同 AI 提供商使用不同的 API 格式，9Router 在中间层自动翻译：

- **源格式**：OpenAI、OpenAI-Responses、Claude、Gemini
- **目标格式**：根据提供商动态选择
- **翻译模块**：`open-sse/translator/` 负责请求和响应的双向转换

你的 CLI 工具只需要对接 OpenAI 格式，9Router 会在后端处理所有格式差异。

### Combo 配置

Combo 是 9Router 中定义回退链的命名配置。例如：

- **maximize-claude**：Claude Opus 4.7 (主) → GLM-5.1 (廉价备) → Kiro Claude Sonnet 4.5 (免费兜底)
- **free-forever**：仅使用免费提供商，实现 $0/月编码
- **cost-optimized**：优先使用最低成本提供商，仅在需要质量时升级

你可以在 Dashboard 中创建无限个 Combo，根据不同场景灵活切换。

### RTK Token 压缩 & Caveman Mode

| 功能 | 原理 | 节省幅度 |
|------|------|---------|
| RTK Token Saver | 自动压缩 tool_result 内容（git diff、grep、ls、tree 等输出），发送前精简 | 20%-40% 输入 Token |
| Caveman Mode | 注入简洁风格系统提示，LLM 回复保持技术实质但极度精简 | 高达 65% 输出 Token |

两者默认开启，可组合使用，配合免费提供商可实现真正的 $0/月 AI 编码。

## 项目结构规范

9Router 的代码仓库遵循 Next.js App Router 约定，将路由、API、SSE 处理核心和数据持久层清晰分离：

```
9router/
├── src/
│   ├── app/
│   │   └── api/                    # Next.js API 路由层
│   │       ├── auth/               # 认证与登录
│   │       ├── settings/           # 全局设置
│   │       ├── v1/                 # OpenAI 兼容 API (v1)
│   │       ├── v1beta/             # 实验性 API 端点
│   │       ├── providers/          # 提供商管理
│   │       ├── provider-nodes/     # 提供商节点配置
│   │       ├── oauth/              # OAuth 流程
│   │       ├── keys/               # API Key 管理
│   │       ├── models/alias/       # 模型别名映射
│   │       ├── combos/             # Combo 配置管理
│   │       ├── pricing/            # 价格查询
│   │       ├── usage/              # 用量统计
│   │       ├── sync/cloud/         # 云同步
│   │       └── cli-tools/          # CLI 工具集成
│   ├── sse/
│   │   ├── handlers/
│   │   │   └── chat.js             # SSE 聊天请求入口
│   │   └── services/
│   │       └── model.js            # 模型选择逻辑
│   ├── lib/
│   │   ├── localDb.js              # 主状态数据库
│   │   ├── usageDb.js              # 用量数据库
│   │   └── initCloudSync.js        # 云同步初始化
│   ├── proxy.js                    # 代理与安全层
│   └── shared/
│       ├── services/               # 共享服务（云同步调度等）
│       └── utils/                  # 共享工具（API Key 等）
├── open-sse/                       # 核心路由与执行引擎
│   ├── handlers/
│   │   └── chatCore.js             # 聊天请求核心处理器
│   ├── executors/                  # 提供商专用执行器
│   │   ├── default.js              # 默认执行器
│   │   ├── antigravity.js          # Antigravity 执行器
│   │   ├── gemini-cli.js           # Gemini CLI 执行器
│   │   ├── github.js               # GitHub Copilot 执行器
│   │   ├── kiro.js                 # Kiro AI 执行器
│   │   ├── codex.js                # OpenAI Codex 执行器
│   │   └── cursor.js               # Cursor IDE 执行器
│   ├── services/
│   │   ├── provider.js             # 提供商选择与调度
│   │   ├── model.js                # 模型匹配逻辑
│   │   └── accountFallback.js      # 账户回退决策引擎
│   ├── translator/                 # 格式翻译层
│   │   ├── index.js                # 翻译注册表
│   │   ├── request/                # 请求格式转换器
│   │   ├── response/               # 响应格式转换器
│   │   └── formats.js              # 格式定义
│   └── utils/
│       ├── stream.js               # 流式传输工具
│       ├── streamHandler.js        # 流处理器
│       ├── usageTracking.js        # 用量追踪
│       └── proxyFetch.js           # 代理请求工具
├── docs/
│   └── ARCHITECTURE.md             # 架构文档
├── .env.example                    # 环境变量模板
└── package.json
```

## 路由定义与配置

### 请求生命周期

当 CLI 工具向 `/v1/chat/completions` 发送请求时：

1. **请求入口**：`src/app/api/v1/` 接收 OpenAI 格式请求
2. **SSE 处理**：`src/sse/handlers/chat.js` 建立 SSE 连接
3. **核心调度**：`open-sse/handlers/chatCore.js` 执行主逻辑
4. **提供商选择**：`open-sse/services/provider.js` 根据 Combo 配置选择提供商
5. **模型匹配**：`open-sse/services/model.js` 确定目标模型
6. **格式翻译**：`open-sse/translator/` 将请求转换为目标提供商格式
7. **执行器调用**：`open-sse/executors/` 中的专用执行器发送请求
8. **回退决策**：若失败，`open-sse/services/accountFallback.js` 决定是否降级
9. **响应翻译**：将提供商响应转回 OpenAI 格式
10. **流式输出**：通过 SSE 返回给客户端

### 环境变量配置

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `JWT_SECRET` | 随机生成 | Dashboard 认证 Cookie 的 JWT 签名密钥 |
| `INITIAL_PASSWORD` | `123456` | 首次登录密码 |
| `DATA_DIR` | `~/.9router` | 主数据目录（SQLite 数据库位置） |
| `PORT` | `20128` | 服务端口 |
| `HOSTNAME` | 框架默认 | 绑定主机（Docker 默认 `0.0.0.0`） |
| `NODE_ENV` | 运行时默认 | 设为 `production` 用于部署 |
| `BASE_URL` | — | 服务端内部基础 URL |
| `CLOUD_URL` | — | 云同步端点基础 URL |
| `HTTP_PROXY` / `HTTPS_PROXY` | — | 出站代理配置 |
| `ENABLE_REQUEST_LOGS` | `false` | 启用请求日志 |

### 数据存储

| 文件 | 位置 | 用途 |
|------|------|------|
| 主数据库 | `$DATA_DIR/db/data.sqlite` | 提供商配置、Combo、设置 |
| 用量数据库 | `~/.9router/usage.json` | Token 用量追踪 |
| 日志文件 | `~/.9router/log.txt` | 运行日志 |

## 安装与使用

### 快速安装

```bash
# 全局安装
npm install -g 9router

# 启动服务
9router

# 输出：
# ✓ 9Router installed globally
# Server: localhost:20128
# Dashboard: localhost:20128/dashboard
# Ready to route ✓
```

### 连接提供商

1. 打开 Dashboard：`http://localhost:20128/dashboard`
2. 进入 Providers 页面
3. 按层级添加提供商：
   - **免费层**：Kiro AI（OAuth 登录）、OpenCode Free（无需认证）、iFlow
   - **廉价层**：GLM、MiniMax、Kimi（API Key）
   - **订阅层**：Claude Code、OpenAI Codex、GitHub Copilot（OAuth）

### 配置 CLI 工具

将你的工具指向 9Router 的 OpenAI 兼容端点：

**Claude Code**：
```bash
# 在 Claude Code 设置中配置
Endpoint: http://localhost:20128/v1
API Key: [从 Dashboard 复制]
Model: kr/claude-sonnet-4.5
```

**OpenAI Codex**：
```bash
export OPENAI_BASE_URL=http://localhost:20128/v1
export OPENAI_API_KEY=[从 Dashboard 复制]
```

**Cursor IDE**：
在 Settings → Models 中设置 Base URL 为 `http://localhost:20128/v1`

**Cline / Kilo Code / Roo**：
在扩展设置中将 API Base URL 设为 `http://localhost:20128/v1`

### 从源码运行

```bash
git clone https://github.com/decolua/9router.git
cd 9router
cp .env.example .env
npm install

# 开发模式
PORT=20128 NEXT_PUBLIC_BASE_URL=http://localhost:20128 npm run dev

# 生产模式
npm run build
PORT=20128 HOSTNAME=0.0.0.0 NEXT_PUBLIC_BASE_URL=http://localhost:20128 npm run start
```

### Docker 部署

```bash
docker build -t 9router .
docker run -d \
  -p 20128:20128 \
  -e JWT_SECRET=your-secret \
  -e INITIAL_PASSWORD=your-password \
  -v ~/.9router:/root/.9router \
  9router
```

## 实际示例

### 场景一：$0/月无限编码

创建一个 "free-forever" Combo：

```
Tier 1 (免费):  Kiro AI → claude-sonnet-4.5 (免费无限)
Tier 2 (免费):  OpenCode Free → big-pickle (无需认证)
Tier 3 (免费):  iFlow → if/kimi-k2-thinking (免费兜底)
```

配置后，所有请求走免费提供商，配额自动轮换，无需任何付费。

### 场景二：最大化订阅价值

已有 Claude Pro 订阅，创建 "maximize-claude" Combo：

```
Tier 1 (订阅):  Claude Code → claude-opus-4.7 (优先用完订阅额度)
Tier 2 (廉价):  glm/glm-4.7 (仅 $0.60/1M tokens)
Tier 3 (免费):  kr/claude-sonnet-4.5 (Kiro 免费兜底)
```

日常编码优先消耗订阅额度，耗尽后自动切换到极低成本的 GLM，最终以 Kiro 免费层保底。

### 场景三：团队共享路由

在 VPS 上部署 9Router，团队成员共享：

```bash
# 在 VPS 上
docker run -d -p 20128:20128 \
  -e JWT_SECRET=team-secret \
  -e INITIAL_PASSWORD=team-pass \
  -v /data/9router:/root/.9router \
  9router

# 每个成员配置
Endpoint: http://your-vps:20128/v1
API Key: [从 Dashboard 获取]
```

多账户支持允许在同一提供商下配置多个账号，9Router 自动轮询负载均衡，当一个账号限额时自动切换到下一个。

### 场景四：启用 Token 节省

```
# RTK 自动压缩 tool_result（默认开启）
Without RTK: 47K tokens 发送到 LLM
With RTK:    28K tokens 发送到 LLM  (节省 40%，同样上下文，同样结果)

# Caveman Mode（5 级强度）
# 在 Dashboard 中设置 Caveman 强度
Level 1: 温和精简 (~20% 节省)
Level 3: 适度精简 (~40% 节省)
Level 5: 极致精简 (~65% 节省)
```

## 与其他 CLI 框架/路由工具对比

| 对比维度 | 9Router | OpenRouter | LiteLLM | 直接使用 API |
|----------|---------|------------|---------|-------------|
| 本地部署 | 支持（自托管） | 仅云服务 | 支持 | 不适用 |
| 免费提供商 | 8+ 内置免费层 | 有限 | 无 | 无 |
| 3 层智能回退 | 原生支持 | 无 | 简单回退 | 无 |
| OAuth 自动刷新 | 支持 | N/A | 部分支持 | 手动 |
| 格式翻译 | OpenAI/Claude/Gemini/Cursor/Kiro | OpenAI 格式 | OpenAI 格式 | 单一格式 |
| RTK Token 压缩 | 内置 | 无 | 无 | 无 |
| Caveman Mode | 内置 | 无 | 无 | 无 |
| 可视化 Dashboard | 内置 | Web 面板 | 无 | 无 |
| MITM Bridge | 支持（IDE 订阅拦截） | 无 | 无 | 无 |
| 多账户负载均衡 | 支持 | 无 | 有限 | 无 |
| CLI 工具集成 | 10+ 内置 | 有限 | 有限 | 手动配置 |
| 价格 | 免费开源 | 按量计费 | 免费开源 | 按 API 计费 |

## 最佳实践

### 1. 回退链设计

- **始终配置免费兜底**：即使你主要使用付费提供商，也应在 Tier 3 配置 Kiro AI 或 OpenCode Free，确保编码永不中断
- **按成本排序**：Tier 1 放最贵的订阅、Tier 2 放极低成本 API、Tier 3 放免费提供商
- **为不同场景创建不同 Combo**：日常编码用 "cost-optimized"，关键任务用 "maximize-quality"

### 2. Token 优化

- **开启 RTK**：默认已开启，它会无损压缩 git diff、grep、ls、tree 等工具输出
- **根据场景调整 Caveman 强度**：编码任务用 Level 3-5，文档生成用 Level 1-2
- **组合使用**：RTK + Caveman + 免费提供商 = 理论上 $0/月无限编码

### 3. 安全配置

- **修改默认密码**：`INITIAL_PASSWORD` 默认为 `123456`，部署后立即修改
- **设置 JWT_SECRET**：生产环境务必设置强密钥
- **限制网络访问**：9Router 默认监听 localhost，VPS 部署时通过防火墙限制访问
- **保护 DATA_DIR**：数据库包含 OAuth 令牌和 API Key，确保目录权限正确

### 4. 多账户策略

- 同一提供商配置多个账号可实现 **轮询负载均衡**
- 适合团队共享场景，有效倍增可用配额
- OAuth 令牌自动刷新，无需手动重新登录

### 5. 监控与调试

- 在 Dashboard 中实时查看 Token 用量和配额倒计时
- 设置 `ENABLE_REQUEST_LOGS=true` 开启详细请求日志
- 检查 `~/.9router/log.txt` 排查问题
- 使用 `/api/usage/` 端点获取用量统计

### 6. 云同步与远程访问

- 启用 Cloud Sync 后可通过 Cloudflare Edge Tunnel 从任意位置访问
- 适合在多台设备间同步提供商配置和 Combo 设置
- 远程使用时设置 `BASE_URL` 和 `CLOUD_URL` 环境变量
