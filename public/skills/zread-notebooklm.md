---
slug: zread-notebooklm
name: NotebookLM Skill / Zread
category: 效率工具与自动化
tags: [reading, analysis, document, notebooklm, codebase, llms-txt]
description: 在终端批量分析文档或深入理解GitHub仓库的CLI工具
install: "npx skills add tianxiao1430-jpg/zai-skills"
source: "https://github.com/tianxiao1430-jpg/zai-skills"
---

# NotebookLM Skill / Zread（资料阅读与代码库分析）

## 简介

Zread 是 Z.AI 平台推出的核心 MCP（Model Context Protocol）服务器之一，专为 AI 编码助手（如 Claude Code、Cline、Cursor、OpenCode 等）提供开源仓库的深度代码理解与文档检索能力。它由 zread.ai 驱动，让 AI 助手能够直接浏览 GitHub 仓库结构、搜索文档、阅读源码，无需本地克隆整个项目。

本技能（zread-expert）来自 [zai-skills](https://github.com/tianxiao1430-jpg/zai-skills) 技能集，是 Z.AI MCP 生态的三大支柱之一（Vision、Search、Zread），提供资深架构师级别的代码库分析、结构审计和语义搜索能力。

**与 Google NotebookLM 的关系：** Google NotebookLM 是一个基于源文档的 AI 研究助手，通过 RAG（检索增强生成）架构将回答锚定在用户上传的文档中，支持生成音频播客、思维导图、学习指南等。Zread 则将类似的"深度阅读与理解"理念应用到代码库场景——让 AI 助手像阅读文档一样深入理解开源项目的代码与架构。两者都强调"基于源材料的精准理解"，但 Zread 专注于代码仓库，NotebookLM 专注于通用文档。

## 核心功能

### Zread MCP 三大原子能力

| 工具 | 功能 | 典型用途 |
|------|------|----------|
| **`search_doc`** | 在 GitHub 仓库的文档中进行语义搜索 | 查找 API 用法、配置说明、特定功能文档 |
| **`get_repo_structure`** | 查看 GitHub 仓库或子目录的结构 | 了解项目层级、定位核心模块、规划阅读路径 |
| **`read_file`** | 读取 GitHub 仓库中单个文件的完整内容 | 深入阅读源码实现、理解具体逻辑 |

### zread-expert 技能增强

zread-expert 在 Zread MCP 基础工具之上，提供高级指令和结构化分析框架：

- **架构师级代码库分析** — 自动识别项目架构模式、核心模块与依赖关系
- **结构审计** — 系统性评估代码组织、模块划分与设计模式
- **语义搜索** — 基于意图的代码与文档检索，而非简单关键词匹配
- **多步骤深度分析** — 组合使用 structure -> search -> read 完成从宏观到微观的递进式理解

### Z.AI 生态协同

Zread 与 Z.AI 的其他 MCP 服务器形成完整工作流：

| MCP 服务器 | 能力 | 与 Zread 的配合 |
|------------|------|-----------------|
| **Vision MCP** | 图像/视频分析、OCR、UI 转代码 | 分析 UI 截图后用 Zread 查找对应实现代码 |
| **Web Search MCP** | 实时网络搜索、信息检索 | 搜索技术方案后用 Zread 深入分析相关开源项目 |
| **Web Reader MCP** | 网页内容提取、Markdown 转换 | 读取文档页面后用 Zread 对照源码验证 |
| **Zread MCP** | 代码库结构、文档搜索、源码阅读 | 核心代码理解能力 |

## 安装与使用

### 前置条件

1. 拥有 Z.AI 账号并订阅 GLM Coding Plan（Lite / Pro / Max）
2. 获取 API Key：访问 [Z.AI Console](https://z.ai/manage-apikey/apikey-list) 生成

### 安装 zai-skills 技能集

```bash
# 安装全部技能（推荐）
npx skills add tianxiao1430-jpg/zai-skills

# 或仅安装 zread-expert
npx skills add tianxiao1430-jpg/zai-skills --skill zread-expert
```

### 配置 Zread MCP 服务器

**Claude Code（一键安装）：**

```bash
claude mcp add -s user -t http zread https://api.z.ai/api/mcp/zread/mcp --header "Authorization: Bearer your_api_key"
```

**Claude Code（手动配置 `.claude.json`）：**

```json
{
  "mcpServers": {
    "zread": {
      "type": "http",
      "url": "https://api.z.ai/api/mcp/zread/mcp",
      "headers": {
        "Authorization": "Bearer your_api_key"
      }
    }
  }
}
```

**Cline / VS Code：**

```json
{
  "mcpServers": {
    "zread": {
      "type": "streamableHttp",
      "url": "https://api.z.ai/api/mcp/zread/mcp",
      "headers": {
        "Authorization": "Bearer your_api_key"
      }
    }
  }
}
```

**OpenCode：**

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "zread": {
      "type": "remote",
      "url": "https://api.z.ai/api/mcp/zread/mcp",
      "headers": {
        "Authorization": "Bearer your_api_key"
      }
    }
  }
}
```

**SSE 方式（兼容旧版客户端）：**

```
https://api.z.ai/api/mcp/zread/sse?Authorization=your_api_key
```

> 将 `your_api_key` 替换为你在 Z.AI Console 获取的 API Key。

## 使用方法与示例

### 场景一：快速了解新项目

当你需要快速上手一个陌生的开源项目时：

```
用户：帮我分析 facebook/react 的目录结构

助手执行流程：
1. [调用 get_repo_structure] 获取仓库顶层结构
2. [调用 search_doc] 搜索核心概念文档
3. [调用 read_file] 读取关键入口文件

输出示例：
📦 facebook/react 项目结构
├── packages/
│   ├── react/          # React 核心包
│   ├── react-dom/      # DOM 渲染器
│   ├── react-reconciler/ # Fiber 调度器
│   └── scheduler/      # 任务调度
├── scripts/            # 构建与发布脚本
└── fixtures/           # 测试与示例

核心模块说明：
- react-reconciler 是 Fiber 架构的核心，负责协调虚拟 DOM...
```

### 场景二：深入理解源码实现

当你需要理解某个具体功能的实现原理时：

```
用户：React 的 useEffect 是怎么实现的？

助手执行流程：
1. [调用 search_doc] 搜索 "useEffect implementation"
2. [调用 get_repo_structure] 定位相关子目录
3. [调用 read_file] 读取核心实现文件

输出示例：
🔍 useEffect 实现分析
核心文件：packages/react-reconciler/src/ReactFiberHooks.js
实现原理：
1. mountEffect -> mountEffectImpl -> pushEffect
2. 通过链表管理 effect 队列
3. commit 阶段执行 effect 回调
4. 依赖数组变化时重新注册 effect
```

### 场景三：Issue 排查与历史分析

```
用户：这个库有哪些未解决的严重 Bug？

助手执行流程：
1. [调用 search_doc] 搜索 "known issues" "breaking changes"
2. [调用 read_file] 读取 CHANGELOG 和 issue 模板
3. 综合分析输出

输出示例：
📋 未解决的关键问题
- #12345: SSR 场景下内存泄漏（影响：高）
- #67890: TypeScript 类型定义不完整（影响：中）
- 建议关注 v18.x 分支的修复进展...
```

### 场景四：准备贡献代码

```
用户：我想给 vercel/next.js 提 PR，需要注意什么？

助手执行流程：
1. [调用 get_repo_structure] 了解项目组织
2. [调用 search_doc] 搜索 "contributing" "code of conduct"
3. [调用 read_file] 读取 CONTRIBUTING.md

输出示例：
📝 贡献指南
- Fork 后在 feature 分支开发
- 遵循 Conventional Commits 规范
- 需要添加测试用例
- 代码风格：Prettier + ESLint
- PR 模板要求填写 Changeset...
```

### 场景五：配合 Orchestrator 处理复杂任务

```
用户：我想做一个类似 Notion 的在线文档编辑器，应该怎么设计？

助手（zai-orchestrator 协调）：
1. Search Expert → 调研现有方案（ProseMirror, TipTap, Slate.js）
2. Zread Expert → 分析 AppFlowy 等开源项目架构
3. Vision Expert → 如果有 UI 参考图，分析界面布局

输出：完整技术方案 + 推荐技术栈 + 核心代码示例
```

## 配置选项

### 技能依赖关系

```
┌─────────────────────────────────────────┐
│       zai-orchestrator（大脑）           │
│  协调 Vision + Search + Zread 解决复杂任务 │
└─────────────┬───────────────────────────┘
              │ 依赖
              ▼
┌─────────────────────────┐
│  vision-expert  search-expert  │
└─────────────┬───────────┘
              │
              ▼
        ┌──────────────┐
        │ zread-expert │
        └──────────────┘
```

- `zread-expert` 可独立使用，无需其他技能
- `zai-orchestrator` 需要安装全部三个 expert 技能

### 技能组合建议

| 任务类型 | 推荐技能组合 |
|----------|-------------|
| 代码分析 | zread-expert |
| 技术调研 | search-expert |
| UI 转代码 | vision-expert |
| 复杂项目 | 全部 4 个技能 |
| 全栈开发 | orchestrator + 全部 expert |

### 自定义技能

编辑 `SKILL.md` 文件可自定义每个技能的行为，添加领域知识、示例和偏好设置。

### 配额说明

Zread MCP 的调用配额包含在 GLM Coding Plan 中：

| 计划 | 搜索 + 阅读总次数 | Vision 理解时长 |
|------|-------------------|-----------------|
| Lite | 100 次 | 5 小时 |
| Pro | 1,000 次 | 5 小时 |
| Max | 4,000 次 | 5 小时 |

## 最佳实践

1. **先结构后细节** — 使用 `get_repo_structure` 了解项目全貌，再用 `search_doc` 定位，最后 `read_file` 深入。避免盲目阅读单个文件。

2. **精准指定仓库路径** — 使用 `owner/repo` 格式（如 `vercel/next.js`），必要时指定子目录缩小范围，提高搜索精度。

3. **组合使用三个工具** — 单独使用 `read_file` 效果有限，配合 `search_doc` 先定位再阅读，效率更高。

4. **利用触发词快速调用** — 在对话中使用"分析仓库"、"代码审计"、"zread"、"架构分析"等触发词，AI 助手会自动激活 zread-expert 技能。

5. **复杂任务交给 Orchestrator** — 涉及多步骤、多信息源的任务（如技术选型、全栈开发），使用 zai-orchestrator 自动协调多个技能。

6. **结合 Google NotebookLM 使用** — 对于非代码类文档（PDF、论文、网页），先用 NotebookLM 生成摘要和播客，再用 Zread 对照开源实现深入理解，形成"文档理解 + 代码验证"的完整工作流。

7. **注意 API Key 安全** — 不要将 API Key 提交到版本控制，使用环境变量或安全的配置管理方式。

## 常见问题

### Q: 没有 Z.AI 账号可以使用吗？

不可以。Zread MCP 是 Z.AI GLM Coding Plan 的专属服务，需要有效的 API Key 才能调用。访问 [z.ai](https://z.ai) 注册并订阅 Coding Plan。

### Q: 支持哪些 AI 编码客户端？

支持所有兼容 MCP 协议的客户端，包括：Claude Code、Cline（VS Code）、Cursor、OpenCode、Crush、Roo Code、Kilo Code、Goose 等。

### Q: Zread 和 Web Reader 有什么区别？

- **Zread** — 专注于 GitHub 代码仓库，提供结构浏览、文档搜索、源码阅读
- **Web Reader** — 专注于网页内容提取，将任意 URL 转为结构化 Markdown

两者互补：Web Reader 读取文档页面，Zread 深入代码实现。

### Q: 可以分析私有仓库吗？

目前 Zread MCP 主要支持公开的 GitHub 仓库。私有仓库的访问取决于 Z.AI 平台的后续更新。

### Q: 如何更新技能？

重新运行安装命令即可：

```bash
npx skills add tianxiao1430-jpg/zai-skills
```

### Q: 连接超时怎么办？

1. 检查网络连接是否正常
2. 确认防火墙未拦截 `api.z.ai` 域名
3. 验证 API Key 是否有效且有充足余额
4. 增大客户端的超时设置

### Q: API Key 无效报错？

1. 确认 Key 复制完整，无多余空格
2. 检查 Key 是否已激活
3. 确认 Key 对应的账户余额充足
4. 验证 Authorization header 格式正确：`Bearer your_api_key`

### Q: zread-expert 和直接使用 Zread MCP 有什么区别？

直接使用 Zread MCP 只能调用三个基础工具（search_doc、get_repo_structure、read_file）。zread-expert 技能在基础工具之上增加了结构化分析框架、架构师级分析指令和多步骤工作流编排，输出更系统、更深入。
