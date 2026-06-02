---
slug: mattpocock-skills
name: MattPocock Skills
category: 编码开发与工程规范
tags: [typescript, tdd, ddd, requirements, debugging, caveman, handoff]
description: 前端大神Matt Pocock的28个实战Skills，专治"氛围编程"四大通病，遵循TDD/DDD等工程原则
install: "npx skills@latest add mattpocock/skills"
source: "https://github.com/mattpocock/skills"
---

# MattPocock Skills（TypeScript 专家技能包）

## 简介

Matt Pocock 是 TypeScript 教育领域最具影响力的工程师之一，曾任职于 Vercel 和 Stately（XState 核心团队），创建了 Total TypeScript 学习平台，拥有 60,000+ 订阅者。他将自己日常使用的 `.claude` 目录以 MIT 协议开源，形成了这套技能包——**mattpocock/skills**。

这不是一套提示词模板，而是一套编码流程系统。它的核心论点是：AI 编程助手的四大通病——**需求失配、输出冗余、调试无反馈、架构熵增**——都可以通过严格的结构化流程来解决，而非依赖更好的模型。

目前该仓库已获得 100K+ GitHub Stars，是 Claude Code 生态中最受关注的技能集合。

## 核心功能

### 对齐阶段（Alignment）

| 命令 | 功能 | 说明 |
|------|------|------|
| `/grill-me` | 苏格拉底式追问 | 动手前强制需求对齐，AI 沿决策树的每个分支逐一追问，直到彻底弄清需求 |
| `/grill-with-docs` | 结合领域文档的追问 | 在追问的同时，实时更新 `CONTEXT.md` 和 `docs/adr/`（架构决策记录），确保术语一致 |
| `/prototype` | 一次性原型 | 构建可抛弃的原型来验证设计——状态/业务逻辑问题用终端应用，UI 问题用多方案切换路由 |

### 规划阶段（Planning）

| 命令 | 功能 | 说明 |
|------|------|------|
| `/to-prd` | 生成产品需求文档 | 将对话上下文合成为 PRD 并提交为 GitHub Issue，无需额外访谈 |
| `/to-issues` | 垂直切分 Issue | 将 PRD 拆解为可独立领取的垂直切片 Issue（而非水平分层），标注 AFK/HITL 和阻塞关系 |
| `/triage` | Issue 分类 | 通过状态机对新 Issue 进行分类（bug/enhancement）和流转（needs-triage → ready-for-agent → ready-for-human） |
| `/setup-matt-pocock-skills` | 项目初始化 | 在 CLAUDE.md 中生成 `## Agent skills` 配置块，创建 `docs/agents/` 目录（issue-tracker、triage-labels、domain），首次使用其他工程技能前必须运行 |

### 开发阶段（Development）

| 命令 | 功能 | 说明 |
|------|------|------|
| `/tdd` | 测试驱动开发 | 强制执行红-绿-重构循环：先写失败测试 → 确认失败原因正确 → 写最小实现通过 → 重构。一次只处理一个垂直切片 |
| `/diagnose` | 规范化调试 | 五步流程：复现 → 缩小范围 → 假设 → 验证/修复 → 回归测试。防止 AI 跳步猜测 |
| `/improve-codebase-architecture` | 架构改善 | 扫描代码库寻找"浅模块"，提出深化建议（增大接口抽象层，缩小暴露面积），并开出 RFC Issue |
| `/zoom-out` | 俯瞰上下文 | 让 Agent 退出细节，提供代码区域的宏观视角和高层解释 |
| `/request-refactor-plan` | 重构计划 | 在执行任何重构前，先输出结构化的调查报告和分步计划 |

### 效率与安全

| 命令 | 功能 | 说明 |
|------|------|------|
| `/caveman` | 超压缩通信 | 去除填充词、冠词、客套话，降低约 75% Token 消耗，适合长会话和已知需求场景 |
| `/handoff` | 会话交接 | 将当前会话压缩为紧凑的交接文档，供另一个 Agent 或会话无缝继续 |
| `/git-guardrails-claude-code` | Git 安全护栏 | 通过 PreToolUse Hook 拦截危险 Git 操作（push --force、reset --hard、clean -fd、branch -D 等） |
| `/setup-pre-commit` | 预提交钩子 | 配置 Husky + lint-staged（Prettier、类型检查、测试），确保提交质量 |

### 写作与知识管理

| 命令 | 功能 | 说明 |
|------|------|------|
| `/edit-article` | 文章编辑 | 重构段落、提升清晰度、精炼文字，适用于文档和博客 |
| `/obsidian-vault` | Obsidian 笔记 | 搜索、创建、管理 Obsidian 笔记库中的 Wikilink 和索引笔记 |
| `/write-a-skill` | 编写技能 | 创建符合规范的新 Agent Skill，包含渐进式披露和资源捆绑 |

### 生产力工具

| 命令 | 功能 | 说明 |
|------|------|------|
| `/migrate-to-shoehorn` | 类型断言迁移 | 将测试文件中的 `as` 类型断言迁移为 `@total-typescript/shoehorn` |
| `/scaffold-exercises` | 练习脚手架 | 创建含 section、problem、solution、explainer 的练习目录结构 |

## 安装与使用

### 全量安装

```bash
npx skills@latest add mattpocock/skills
```

### 按需安装（推荐）

只安装项目需要的技能，避免上下文膨胀：

```bash
# 安装单个技能
npx skills@latest add mattpocock/skills/tdd

# 安装多个技能
npx skills@latest add mattpocock/skills/tdd mattpocock/skills/to-prd mattpocock/skills/git-guardrails-claude-code
```

### 首次使用前

安装技能后，在项目根目录运行一次初始化：

```bash
# 在 Claude Code 中执行
/setup-matt-pocock-skills
```

该命令会：
1. 询问 Issue Tracker 类型（GitHub Issues / GitLab / 本地 Markdown）
2. 询问 Triage 标签词汇（bug、enhancement 等）
3. 确认领域文档布局（单上下文 `CONTEXT.md` 或多上下文 monorepo）
4. 在 `CLAUDE.md` 或 `AGENTS.md` 中写入 `## Agent skills` 配置块
5. 创建 `docs/agents/issue-tracker.md`、`triage-labels.md`、`domain.md`

## 使用方法与示例

### 完整工作流：从想法到上线

Matt Pocock 推荐的流程是一条五阶段管线，每个阶段对应一个技能：

```
grill-me → to-prd → to-issues → tdd → improve-codebase-architecture
```

#### 第一阶段：需求对齐

```
/grill-me "我想做一个用户认证模块"

→ AI 追问：认证方式？OAuth2 / JWT / Session？
→ AI 追问：Token 存储位置？Cookie / localStorage / 内存？
→ AI 追问：过期策略？Refresh Token 机制？
→ AI 追问：权限粒度？RBAC / ABAC / 简单角色？
→ 需求彻底明确后 → 进入下一阶段
```

如果项目已有领域模型，使用 `/grill-with-docs` 替代，它会在追问过程中同步更新 `CONTEXT.md` 和 ADR。

#### 第二阶段：编写 PRD

```
/to-prd

→ AI 自动将对话内容合成为产品需求文档
→ 包含：用户故事、实现决策、需修改的模块列表
→ 自动提交为 GitHub Issue
```

#### 第三阶段：拆分为 Issue

```
/to-issues

→ AI 将 PRD 拆解为垂直切片（非水平分层）

水平分层（错误）：
  1. 建数据库表
  2. 写 API
  3. 写前端
  4. 加测试

垂直切片（正确）：
  1. 用户可创建最简版账户（表 + API + UI + 测试）
  2. 用户可登录并获取 Token（表 + API + UI + 测试）
  3. Token 过期后可刷新（API + 测试）

→ 每个 Issue 标注 AFK（可自主完成）或 HITL（需人工检查点）
→ 标注 Issue 间阻塞关系
```

#### 第四阶段：TDD 实现

```
/tdd "实现用户注册功能"

→ 红：先写测试
  test('register with valid email returns user id', () => {
    const result = register('user@example.com', 'password123')
    expect(result.success).toBe(true)
    expect(result.userId).toBeDefined()
  })

→ 确认测试失败原因正确（非语法错误，而是功能未实现）

→ 绿：写最小实现让测试通过
  function register(email: string, password: string) {
    return { success: true, userId: crypto.randomUUID() }
  }

→ 重构：优化代码结构，提取验证逻辑，增强类型定义
→ 循环直到所有测试通过且代码整洁
```

#### 第五阶段：架构审视

```
/improve-codebase-architecture

→ AI 扫描代码库，寻找"浅模块"
→ 提出"深化"建议：增大抽象层，缩小暴露面积
→ 使用 LANGUAGE.md 中的精确定义（module、interface、depth、seam、adapter）
→ 开出 RFC Issue 供团队讨论
```

### 调试流程

```
/diagnose "登录页面白屏"

→ 复现：确认复现步骤和环境
→ 缩小范围：排除网络、排除 CSS、排除路由
→ 假设：可能是 AuthProvider 的 useEffect 死循环
→ 验证：添加 console.log 确认
→ 修复：修复依赖数组
→ 回归测试：运行全量测试确认无副作用
```

### 长会话压缩

```
/caveman

→ AI 响应从：
  "好的，我来帮你看一下这个问题。根据我的分析，
   你遇到的情况可能是因为组件的状态管理出现了
   一些不一致的情况..."

→ 变为：
  "状态管理不一致。组件 A 的 setState 在
   useEffect 外触发。修复：移至 useEffect 内。"

→ Token 消耗降低约 75%
```

### 会话交接

```
/handoff

→ 生成紧凑的交接文档，包含：
  - 已完成的工作
  - 当前进度
  - 未解决的问题
  - 下一步计划
→ 新 Agent 可无缝接续工作
```

## 配置选项

### 项目级配置

运行 `/setup-matt-pocock-skills` 后生成的配置结构：

```
项目根目录/
├── CLAUDE.md                    # 包含 ## Agent skills 配置块
├── CONTEXT.md                   # 领域语言定义（单上下文项目）
├── docs/
│   ├── agents/
│   │   ├── issue-tracker.md     # Issue Tracker 配置（GitHub/GitLab/本地）
│   │   ├── triage-labels.md     # Triage 标签映射
│   │   └── domain.md            # 领域文档消费规则与布局
│   └── adr/                     # 架构决策记录
└── .claude/
    ├── skills/                  # 已安装的技能 SKILL.md 文件
    ├── hooks/                   # Hook 脚本（如 git-guardrails）
    └── settings.json            # 项目级 Claude Code 设置
```

### Monorepo 配置

对于 Monorepo，使用多上下文布局：

```
项目根目录/
├── CONTEXT-MAP.md               # 指向各子项目的 CONTEXT.md
├── packages/
│   ├── frontend/
│   │   └── CONTEXT.md           # 前端领域语言
│   └── backend/
│       └── CONTEXT.md           # 后端领域语言
```

### Git Guardrails 配置范围

- **项目级**：`.claude/settings.json` — 仅当前项目生效
- **全局级**：`~/.claude/settings.json` — 所有项目生效

可自定义拦截规则，编辑 `.claude/hooks/block-dangerous-git.sh`。

## 最佳实践

### 1. 先对齐，再动手

永远不要跳过 `/grill-me` 或 `/grill-with-docs`。AI 编程最常见的失败不是代码质量差，而是**做了错误的事情**。3 分钟的追问可以省下 3 小时的返工。

### 2. 垂直切片，而非水平分层

使用 `/to-issues` 时，确保每个 Issue 是端到端的垂直切片，而非某一层的水平切分。垂直切片可以独立验证，水平切片则会产生大量半成品和交接问题。

### 3. TDD 不是可选项

在 AI 辅助编程中，TDD 的价值远超传统开发。没有测试约束，AI 会倾向于写大量无法验证的代码。`/tdd` 强制"先写失败测试"的约束，是让 AI 输出可验证代码的最可靠方式。

### 4. 按需安装，避免膨胀

不要一次性安装所有技能。每个技能都会占用上下文窗口。建议从以下三个开始：

1. `/tdd` — 在真实 Bug 修复上体验红-绿-重构
2. `/to-prd` — 讨论功能后，用它合成 PRD
3. `/git-guardrails-claude-code` — 给 Agent 上安全护栏

一周后，根据实际使用情况再添加其他技能。

### 5. 维护共享语言

`/grill-with-docs` 生成的 `CONTEXT.md` 是项目中最重要的文件之一。确保团队所有人使用相同的术语描述相同的概念。例如：

```
之前："有一个问题，当一个课程里面的章节被'真正创建'（即给了文件系统位置）的时候"
之后："有一个问题，关于 materialization cascade"
```

精确的术语节省的不仅是 Token，更是理解成本。

### 6. 使用 Caveman 模式降低成本

当你已经明确知道要做什么时，切换到 `/caveman` 模式。AI 会去除所有冗余表述，只保留技术要点。在长会话中可节省约 75% 的 Token 消耗。

## 常见问题

### Q: 这些技能只能用于 TypeScript 项目吗？

A: 技能的流程设计（TDD、需求对齐、Issue 拆分、架构改善）是语言无关的。但部分技能的默认约定偏向 TypeScript/Node 生态（如 Husky 预提交钩子、ESLint 配置、`@total-typescript/shoehorn`）。使用其他技术栈的团队可以获得大部分价值，少数技能可能需要 fork 后调整。

### Q: `/grill-me` 和 `/grill-with-docs` 怎么选？

A: 绿地项目（从零开始）用 `/grill-me`；已有代码库和领域模型的项目用 `/grill-with-docs`。后者会在追问过程中同步更新 `CONTEXT.md` 和 ADR，确保文档与决策实时同步。

### Q: `/tdd` 在大型项目中效果如何？

A: `/tdd` 在模块边界清晰的项目中效果最佳。如果代码库耦合严重、测试边界模糊，建议先运行 `/improve-codebase-architecture` 改善模块结构，再使用 `/tdd`。TDD 需要清晰的接口才能发挥最大价值。

### Q: Git Guardrails 会影响正常开发吗？

A: 不会。它只拦截危险操作（force push、reset --hard、clean -fd、branch -D 等），正常 commit、pull、merge 不受影响。如果确实需要执行被拦截的操作，可以临时移除 Hook 或编辑拦截规则。

### Q: 可以和 Claude Code 以外的工具配合使用吗？

A: 技能以 SKILL.md 格式存储，任何支持该规范的 AI 编码助手都可以使用。但部分技能（如 `/git-guardrails-claude-code`）依赖 Claude Code 的 Hook 机制，在其他工具中需要适配。

### Q: `/setup-matt-pocock-skills` 必须运行吗？

A: 如果你要使用 `/to-issues`、`/to-prd`、`/triage`、`/diagnose`、`/tdd`、`/improve-codebase-architecture` 或 `/zoom-out`，必须先运行一次初始化。它生成的配置文件告诉这些技能你的 Issue Tracker 类型、标签体系和领域文档位置。如果只用 `/grill-me`、`/caveman`、`/handoff` 等独立技能，则不需要。

### Q: 技能更新了怎么办？

A: 重新运行安装命令即可覆盖更新：

```bash
npx skills@latest add mattpocock/skills/tdd
```

建议关注 Matt Pocock 的 [AI Hero 频道](https://www.aihero.dev/skills) 获取更新日志。
