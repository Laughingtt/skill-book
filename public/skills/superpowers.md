---
slug: superpowers
name: Superpowers
category: 编码开发与工程规范
tags: [quality, process, workflow, tdd, debugging, review]
description: 通过流程化引导规范AI编程，提升代码交付质量的技能包
install: "/plugin marketplace add obra/superpowers-marketplace"
source: "https://github.com/obra/superpowers"
---

# Superpowers — AI 编程代理的结构化开发方法论

## 简介

Superpowers 是由 Jesse Vincent 创建的一套完整的 AI 编程代理技能框架与软件开发方法论。它不是单一的提示词模板，而是一组可组合的技能（Skills），通过结构化引导强制 AI 代理遵循严格的工程流程，从而将"氛围编程"（Vibe Coding）转变为可预测、可验证、可审查的专业级开发实践。

核心理念：**AI 代理缺少的不是能力，而是纪律。** Superpowers 通过将工程最佳实践编码为自动触发的技能，让 Claude Code、Codex CLI、Cursor、Gemini CLI 等代理从"快速代码生成器"转变为"有条理的开发伙伴"。

### 与标准 AI 编程的对比

| 维度 | 标准 AI 编程 | Superpowers 工作流 |
|------|-------------|-------------------|
| 起点 | 直接开始写代码 | 苏格拉底式头脑风暴，验证设计后再动手 |
| 规划 | 无规划或一次性模糊计划 | 详细的实施计划，每个任务 2-5 分钟，包含精确文件路径 |
| 测试 | 事后补写，经常不完整 | 严格的 TDD：先写失败测试，再写生产代码 |
| 长上下文 | 渐进漂移，遗忘初始指令 | 每个任务分派独立子代理，无上下文漂移 |
| 代码审查 | 无 | 每个任务后自动审查，关键问题阻断进度 |
| 隔离 | 直接在主分支修改 | 隔离的 Git Worktree，独立分支 |
| 自主性 | 10-15 分钟后质量下降 | 可连续数小时自主工作不偏离计划 |

## 核心功能

### 1. 技能发现与自动激活（Skill Discovery）

Superpowers 技能在代理启动时自动注册。当代理开始一项任务时，会自动检查是否有适用的技能。如果有，必须使用——这不是建议，而是强制要求。`using-superpowers` 技能作为框架入口，确保每个任务都不会遗漏最佳实践。

### 2. 头脑风暴（Brainstorming）

通过苏格拉底式提问引导，在写任何代码之前澄清真实需求：
- 探索你可能没考虑到的替代方案
- 将设计方案分段呈现，便于消化和确认
- 保存设计文档供后续参考

**触发方式**：需求不明确时自动激活，或通过 `/superpowers:brainstorming` 手动触发

### 3. 实施计划编写（Writing Plans）

将批准的设计分解为可执行的小任务：
- 每个步骤 2-5 分钟，精确到文件路径和代码片段
- 包含验证命令和预期结果
- 绝不允许占位符（无 TBD、TODO、"后续实现"）
- 遵循 YAGNI（你不会需要它）和 DRY 原则
- 自动自检：覆盖度扫描、占位符扫描、类型一致性检查

**触发关键词**："制定计划"、"planning"、"make a plan"

### 4. 子代理驱动开发（Subagent-Driven Development）

Superpowers 最强大的模式——从"好习惯"升级为"架构创新"：
- 为主计划中的每个任务分派一个全新的子代理
- 子代理不继承会话上下文，避免累积混乱
- 两阶段审查：先检查规格合规性，再检查代码质量
- 支持选择最经济的模型处理机械性任务（如 Haiku）
- 连续执行，不在任务间暂停请示，仅在阻塞时停止

**适用场景**：有独立任务的计划执行，需要并行处理的场景

### 5. 测试驱动开发（TDD）

执行"铁律"：**没有失败测试，就没有生产代码。**

严格的 RED-GREEN-REFACTOR 循环：
1. **RED** — 编写描述期望行为的失败测试
2. **GREEN** — 编写让测试通过的最小代码
3. **REFACTOR** — 在测试通过的前提下清理、消除重复
4. **COMMIT** — 绿灯时提交

核心原则：如果你没有看到测试失败，你就不确定它测试的是否正确。违反规则的精神就是违反规则本身。先于测试编写的生产代码会被删除。

### 6. 系统化调试（Systematic Debugging）

四阶段根本原因分析方法：
1. **根本原因调查** — 隔离问题，检查最近变更
2. **模式分析** — 识别错误模式和触发条件
3. **假设验证** — 构建可测试的假设并逐一验证
4. **实施修复** — 基于证据而非猜测修复问题

**触发关键词**："debug"、"bug"、"不工作"、"报错"

### 7. 代码审查（Code Review）

双向审查机制：
- **请求审查**（requesting-code-review）：对照计划审查，按严重程度报告问题，关键问题阻断进度
- **接收审查**（receiving-code-review）：技术严谨地验证反馈，不做表演性同意或盲目实施

### 8. 完成前验证（Verification Before Completion）

在声称工作完成之前，必须：
- 运行验证命令并确认输出
- 证据先于断言——没有证明就不能说"完成了"
- 检查所有测试是否通过
- 确认与计划规格一致

### 9. Git Worktree 隔离（Using Git Worktrees）

在设计批准后自动创建隔离工作空间：
- 在新分支上工作，保持主分支稳定
- 实验失败时轻松清理
- 支持并行开发多个功能

### 10. 开发分支完成（Finishing a Development Branch）

任务完成时自动激活：
- 验证所有测试通过
- 提供选项：合并 / 创建 PR / 保留分支 / 放弃
- 清理 Worktree

## 安装与配置

### Claude Code

**方式一：官方插件市场（推荐）**

```
/plugin install superpowers@claude-plugins-official
```

**方式二：Superpowers 市场**

```bash
# 注册市场
/plugin marketplace add obra/superpowers-marketplace

# 安装插件
/plugin install superpowers@superpowers-marketplace
```

安装后重启 Claude Code，看到 `SessionStart:startup hook succeeded: Success` 即表示激活成功。

### Codex CLI

```
# 打开插件搜索
# 搜索 "Superpowers"
# 选择 Install Plugin
```

### Cursor

在 Cursor Agent 聊天中：

```
/add-plugin superpowers
```

或在插件市场中搜索 "superpowers"。

### Gemini CLI

```bash
gemini extensions install obra/superpowers
```

### GitHub Copilot CLI

```bash
# 注册市场后安装插件
```

### OpenCode

```
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md
```

### 验证安装

安装完成后，在对话中描述你想构建的功能。如果 Superpowers 正常工作，代理会在写代码之前先提问澄清需求——头脑风暴技能会自动激活。

## 可用技能列表与分类

### 测试类

| 技能 | 斜杠命令 | 说明 |
|------|---------|------|
| test-driven-development | `/superpowers:test-driven-development` | 强制 RED-GREEN-REFACTOR TDD 工作流 |
| verification-before-completion | `/superpowers:verification-before-completion` | 完成前强制验证，证据先于断言 |

### 调试类

| 技能 | 斜杠命令 | 说明 |
|------|---------|------|
| systematic-debugging | `/superpowers:systematic-debugging` | 四阶段系统化根本原因分析 |

### 协作类

| 技能 | 斜杠命令 | 说明 |
|------|---------|------|
| brainstorming | `/superpowers:brainstorming` | 苏格拉底式头脑风暴，澄清需求 |
| requesting-code-review | `/superpowers:requesting-code-review` | 请求代码审查，按严重程度报告 |
| receiving-code-review | `/superpowers:receiving-code-review` | 接收代码审查反馈，技术严谨验证 |

### 工作流类

| 技能 | 斜杠命令 | 说明 |
|------|---------|------|
| writing-plans | `/superpowers:writing-plans` | 将设计分解为可执行的实施计划 |
| executing-plans | `/superpowers:executing-plans` | 在当前会话中逐步执行计划 |
| subagent-driven-development | `/superpowers:subagent-driven-development` | 子代理并行执行，两阶段审查 |
| using-git-worktrees | `/superpowers:using-git-worktrees` | Git Worktree 隔离工作空间 |
| finishing-a-development-branch | `/superpowers:finishing-a-development-branch` | 分支完成后的合并/PR/清理 |

### 元技能类

| 技能 | 斜杠命令 | 说明 |
|------|---------|------|
| using-superpowers | `/superpowers:using-superpowers` | 框架入口，确保技能被正确发现和使用 |
| writing-skills | `/superpowers:writing-skills` | 创建和编辑自定义技能 |
| dispatching-parallel-agents | `/superpowers:dispatching-parallel-agents` | 分派并行代理处理独立任务 |

## 使用方法

### 标准开发工作流

Superpowers 的真正力量来自多个技能的组合。以下是完整的标准开发流程：

```
1. 头脑风暴 (brainstorming)
   ↓ 通过问答澄清真实需求

2. 设计文档
   ↓ 分段呈现设计方案，等待确认

3. 编写计划 (writing-plans)
   ↓ 分解为 2-5 分钟的小任务，精确到文件路径

4. Git Worktree (using-git-worktrees)
   ↓ 创建隔离工作空间，在新分支上开发

5. 子代理执行 (subagent-driven-development)
   ↓ 每个任务分派独立子代理
   ↓ 两阶段审查：规格合规 + 代码质量

6. TDD (test-driven-development)
   ↓ 强制 RED-GREEN-REFACTOR 循环

7. 代码审查 (requesting-code-review)
   ↓ 质量关卡，关键问题阻断

8. 完成分支 (finishing-a-development-branch)
   ↓ 验证、合并/PR、清理
```

### 斜杠命令触发

技能可以通过斜杠命令手动触发：

```
/superpowers:brainstorming          # 开始头脑风暴
/superpowers:writing-plans          # 编写实施计划
/superpowers:executing-plans        # 执行已有计划
/superpowers:test-driven-development # 启动 TDD 流程
/superpowers:systematic-debugging   # 系统化调试
/superpowers:requesting-code-review # 请求代码审查
/superpowers:verification-before-completion # 完成前验证
```

### 关键词自动触发

Superpowers 技能也通过关键词自动激活：

| 技能 | 触发关键词 |
|------|-----------|
| brainstorming | 需求不明确时自动触发 |
| test-driven-development | "TDD"、"test-driven"、"先写测试" |
| systematic-debugging | "debug"、"bug"、"不工作"、"报错" |
| writing-plans | "制定计划"、"planning" |
| verification-before-completion | 即将声称完成时自动触发 |

### 实战示例：用 Superpowers 构建用户认证系统

**第 1 步：头脑风暴**
- 代理提问：需要支持哪些认证方式？是否需要 OAuth？密码策略是什么？
- 你回答后，代理呈现设计方案
- 你逐段确认，最终批准设计

**第 2 步：编写计划**
- 代理生成包含 10-15 个任务的详细计划
- 每个任务有精确的文件路径、代码片段、验证命令
- 你审核计划，调整后批准

**第 3 步：子代理执行**
- 每个任务由独立的子代理执行
- 完成后自动审查：先检查是否与规格一致，再检查代码质量
- 关键问题阻断，小问题记录后继续

**第 4 步：TDD 循环**
- 子代理先编写失败测试
- 确认测试失败（证明测试有效）
- 编写最小实现代码使测试通过
- 重构清理

**第 5 步：审查与完成**
- 自动代码审查
- 验证所有测试通过
- 提交代码，提供合并选项

## 技能开发指南

Superpowers 包含 `writing-skills` 元技能，帮助你创建自定义技能。

### 技能基本结构

```
my-skill/
├── SKILL.md          # 技能主文件，包含指令和流程
└── resources/        # 支持文件（参考文档、模板等）
```

### SKILL.md 编写要点

1. **明确的触发条件**：描述什么时候应该使用这个技能，代理据此决定是否自动加载
2. **简洁的上下文预览**：代理在技能列表中看到的摘要，用于判断是否加载
3. **结构化的流程**：按步骤描述执行过程，避免模糊指令
4. **具体示例**：包含输入输出示例，帮助代理理解成功标准
5. **禁止事项**：明确列出不应做的事情，比正面指令更有效

### 创建步骤

1. 使用 `/superpowers:writing-skills` 启动技能创建流程
2. 描述你希望技能做什么
3. 代理会帮你生成 SKILL.md 和相关资源
4. 在子代理上测试技能——使用真实场景而非知识竞赛式测试
5. 迭代改进，确保技能在压力场景下依然有效

### 技能组合

技能可以自然组合——Claude 可以同时使用多个技能。这种可组合性是框架最强大的特性之一：

- 头脑风暴 + 编写计划 = 从想法到可执行路线图
- TDD + 系统化调试 = 测试驱动的故障排查
- 子代理开发 + 代码审查 = 自动化质量保证流水线

### 跨代理兼容

Superpowers 技能以纯 Markdown 编写，与宿主代理无关。同一套技能可在 Claude Code、Codex CLI、Cursor、Gemini CLI 等多个平台上运行。每个平台通过薄薄的清单文件（`.claude-plugin/`、`.cursor-plugin/`、`.codex-plugin/` 等）指向相同的 Markdown 内容。

## 最佳实践

1. **不要抗拒头脑风暴阶段** — 感觉很慢，但提问的几分钟会省下大量返工时间
2. **用真实任务测试，不要用"Hello World"** — Superpowers 在真实复杂度中才显现价值
3. **信任 TDD 流程** — 第一次看到代理先写失败测试再写最小实现时，你会感受到区别
4. **审核计划再执行** — 计划文档是你的恢复机制，如果会话中断，未勾选的复选框是下次会话唯一的状态日志
5. **让子代理自主工作** — 不要在任务间频繁检查，子代理会在真正阻塞时停下来
6. **优先使用子代理驱动开发** — 比内联执行（executing-plans）质量更高，尤其在大项目中
7. **在 CLAUDE.md 中定制行为** — Superpowers 会优先遵循你项目中的 CLAUDE.md 或 AGENTS.md 中的直接指令
8. **简单任务无需全流程** — 单行修改不需要完整的七阶段工作流，Superpowers 在多文件功能和完整构建中表现最佳

## 常见问题

### Superpowers 会增加 Token 消耗吗？

短期来看是的，技能加载和结构化流程会增加初始 Token 用量。但长期来看，通过减少返工、避免方向性错误、降低调试成本，总 Token 消耗反而更低。Superpowers v5 已支持为机械性任务选择最经济的模型（如 Haiku），进一步控制成本。

### 安装后代理没有自动触发技能怎么办？

1. 确认重启了 Claude Code
2. 检查是否看到 `SessionStart:startup hook succeeded` 提示
3. 尝试手动触发：`/superpowers:using-superpowers`
4. 描述一个具体的构建任务，而非泛泛提问

### executing-plans 和 subagent-driven-development 如何选择？

- **subagent-driven-development**（推荐）：每个任务分派独立子代理，上下文干净，适合大多数场景。需要支持子代理的平台（如 Claude Code）。
- **executing-plans**：在当前会话中逐步执行，有人工检查点。适合不支持子代理的平台，或需要更紧密人工监督的场景。

### 与 GSD、Spec-Kit、BMAD 等框架有何不同？

Superpowers 的核心差异是**强制 TDD**——这是其他框架不具备的。此外，子代理驱动开发、两阶段代码审查、自动技能发现也是独特优势。GSD 侧重上下文工程和环境管理，Spec-Kit 侧重规格驱动，而 Superpowers 是完整的工程方法论。

### 可以只使用部分技能吗？

可以。每个技能可以独立使用，但完整工作流能发挥最大价值。你可以在 CLAUDE.md 中添加指令来定制哪些技能优先适用。Superpowers 会优先遵循你的项目指令而非内部默认行为。

### 技能会自动更新吗？

Superpowers 更新取决于所使用的宿主平台。Claude Code 支持自动插件更新，其他平台可能需要手动更新。v5 版本已废弃旧的斜杠命令（`/brainstorm`、`/write-plan`、`/execute-plan`），改为技能原生斜杠命令格式（`/superpowers:brainstorming` 等）。

### 上下文窗口会成为瓶颈吗？

对于大型代码库，这确实是个问题。Superpowers 通过子代理架构缓解了这一压力——每个子代理从干净的上下文开始，只关注一个任务。主会话只负责协调，不承载实现细节。但在极长会话中，仍需注意上下文管理。
