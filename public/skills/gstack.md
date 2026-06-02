---
slug: gstack
name: GStack
category: 编码开发与工程规范
tags: [fullstack, pipeline, audit, ceo, architecture, security, owasp]
description: 基于23项专业技能串联从设计到部署的完整研发链路，内置CEO战略审查、架构评审、OWASP安全扫描
install: "git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup"
source: "https://github.com/garrytan/gstack"
---

# GStack

## 简介

GStack 是 Y Combinator 总裁 Garry Tan 开源的 Claude Code 技能包，将单个 AI 编程助手转变为一个完整的虚拟工程团队。它包含 23 个专业技能和 8 个高级工具，每个技能对应一个明确的角色——CEO 做产品战略审查、工程经理锁定架构、设计师捕捉 AI 糟粕、安全官执行 OWASP + STRIDE 审计、QA 主管打开真实浏览器测试、发布工程师一键推送 PR。

核心理念：**角色而非提示词**。每个斜杠命令让 Claude 切换到特定角色的操作模式，拥有独立的优先级和约束条件，确保输出更聚焦、更一致。

GStack 不只是一堆工具的集合，它是一个**流程**——技能按 Sprint 的顺序运行：

```
Think → Plan → Build → Review → Test → Ship → Reflect
```

每个技能的输出自动成为下一个技能的输入。`/office-hours` 写的设计文档会被 `/plan-ceo-review` 读取，`/plan-eng-review` 编写的测试计划会被 `/qa` 使用，`/review` 发现的 bug 会在 `/ship` 中验证修复。没有任何环节会遗漏。

## 核心功能

### 思考阶段（Think）

| 技能 | 角色 | 功能 |
|------|------|------|
| `/office-hours` | YC Office Hours | 六个强制性问题重新定义产品，在写代码之前挑战你的假设和前提 |
| `/plan-ceo-review` | CEO / 创始人 | 重新审视问题，发现需求中隐藏的 10 星级产品。四种模式：扩展、选择性扩展、保持范围、缩减 |

### 规划阶段（Plan）

| 技能 | 角色 | 功能 |
|------|------|------|
| `/plan-eng-review` | 工程经理 | 锁定架构、数据流、ASCII 图、边界条件、测试矩阵 |
| `/plan-design-review` | 高级设计师 | 对每个设计维度评分 0-10，AI 糟粕检测，交互式逐项审查 |
| `/plan-devex-review` | 开发体验负责人 | DX 审计：开发者画像、TTHW 基准测试、摩擦点追踪，20-45 个强制性问题 |
| `/autoplan` | 审查流水线 | 一条命令自动运行 CEO → 设计 → 工程 → DX 审查，仅提交品味决策供你审批 |
| `/spec` | 规格作者 | 五阶段（为什么/范围/技术/草稿/文件）将模糊意图转化为精确可执行规格 |

### 构建阶段（Build）

| 技能 | 角色 | 功能 |
|------|------|------|
| `/design-consultation` | 设计合伙人 | 从零构建设计系统，调研现有方案，提出创意风险 |
| `/design-shotgun` | 设计探索者 | 生成 4-6 个 AI 原型变体，在浏览器中对比展示，收集反馈迭代，品味记忆学习 |
| `/design-html` | 设计工程师 | 将原型转化为生产级 HTML/CSS，Pretext 计算布局，自动检测 React/Svelte/Vue |

### 审查阶段（Review）

| 技能 | 角色 | 功能 |
|------|------|------|
| `/review` | 主任工程师 | 发现通过 CI 但会在生产环境爆炸的 bug，自动修复明显问题 |
| `/design-review` | 会写代码的设计师 | 同 `/plan-design-review` 审计后直接修复，原子提交，前后截图对比 |
| `/devex-review` | DX 测试员 | 实际测试你的引导流程，与规划阶段评分对比 |
| `/investigate` | 调试员 | 系统化根因调试，铁律：未经调查不得修复，3 次失败后停止 |

### 测试阶段（Test）

| 技能 | 角色 | 功能 |
|------|------|------|
| `/qa` | QA 主管 | 用真实浏览器测试应用，发现并修复 bug，自动生成回归测试 |
| `/qa-only` | QA 报告员 | 同 `/qa` 方法论但只出报告，不修改代码 |
| `/cso` | 首席安全官 | OWASP Top 10 + STRIDE 威胁建模，17 项误报排除，8/10+ 置信度门槛 |

### 发布阶段（Ship）

| 技能 | 角色 | 功能 |
|------|------|------|
| `/ship` | 发布工程师 | 同步 main、运行测试、审计覆盖率、推送、创建 PR，无测试框架时自动引导搭建 |
| `/land-and-deploy` | 发布工程师 | 合并 PR，等待 CI 和部署，验证生产环境健康 |
| `/canary` | SRE | 部署后监控循环，关注控制台错误、性能回归、页面故障 |
| `/benchmark` | 性能工程师 | 页面加载时间、Core Web Vitals、资源体积基准，PR 前后对比 |

### 反思阶段（Reflect）

| 技能 | 角色 | 功能 |
|------|------|------|
| `/retro` | 工程经理 | 团队周回顾，每人细分、交付连续性、测试健康趋势 |
| `/document-release` | 技术文档工程师 | 自动更新所有项目文档，Diataxis 覆盖率图 |
| `/document-generate` | 文档作者 | 基于 Diataxis 框架生成缺失文档（参考/教程/操作指南/说明） |
| `/learn` | 记忆管理 | 跨会话管理 gstack 学到的模式、陷阱和偏好，随时间越来越了解你的代码库 |

### 高级工具

| 技能 | 功能 |
|------|------|
| `/codex` | 独立的 OpenAI Codex CLI 第二意见，三种模式：审查（通过/失败门控）、对抗挑战、开放咨询。与 `/review` 交叉对比 |
| `/browse` | 真实 Chromium 浏览器，~100ms/命令，截图、点击、视觉验证 |
| `/pair-agent` | 跨 Agent 协调：Claude Code + OpenClaw/Hermes/Codex 共享同一浏览器 |
| `/careful` | 安全护栏：在破坏性命令（rm -rf、DROP TABLE、force-push）前警告 |
| `/freeze` | 编辑锁：限制文件编辑到一个目录，防止调试时误改无关代码 |
| `/guard` | `/careful` + `/freeze` 组合，生产环境最大安全 |
| `/unfreeze` | 解除 `/freeze` 限制 |
| `/gstack-upgrade` | 自更新：检测全局/本地安装，同步更新，显示变更内容 |

## 安装与使用

### 前置要求

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Git](https://git-scm.com/)
- [Bun](https://bun.sh/) v1.0+
- Windows 用户还需 [Node.js](https://nodejs.org/)（Bun 在 Windows 上有 Playwright 管道传输的已知问题）

### 安装步骤

在 Claude Code 中粘贴以下命令，Claude 会自动完成安装：

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
```

安装完成后，在项目的 `CLAUDE.md` 中添加 gstack 路由配置：

```markdown
## gstack
Use /browse from gstack for all web browsing. Never use mcp__claude-in-chrome__* tools.
Available skills: /office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review,
/design-consultation, /design-shotgun, /design-html, /review, /ship, /land-and-deploy,
/canary, /benchmark, /browse, /open-gstack-browser, /qa, /qa-only, /design-review,
/setup-browser-cookies, /setup-deploy, /setup-gbrain, /sync-gbrain, /retro, /investigate,
/document-release, /document-generate, /codex, /cso, /autoplan, /pair-agent, /careful, /freeze,
/guard, /unfreeze, /gstack-upgrade, /learn.
```

### 团队模式（推荐）

在项目仓库内运行以下命令，切换到团队模式，确保团队成员自动获得 gstack，无本地文件、无版本漂移：

```bash
~/.claude/skills/gstack/bin/gstack-team-init required
```

将 `required` 替换为 `optional` 可改为提示而非强制。

### 多 Agent 平台支持

gstack 不仅限于 Claude Code，还支持 10 种 AI 编程 Agent。安装时自动检测已安装的 Agent：

```bash
./setup --host <name>
```

| Agent | 参数 | 安装路径 |
|-------|------|----------|
| OpenAI Codex CLI | `--host codex` | `~/.codex/skills/gstack-*/` |
| Cursor | `--host cursor` | `~/.cursor/skills/gstack-*/` |
| OpenCode | `--host opencode` | `~/.config/opencode/skills/gstack-*/` |
| Factory Droid | `--host factory` | `~/.factory/skills/gstack-*/` |
| Slate | `--host slate` | `~/.slate/skills/gstack-*/` |
| Kiro | `--host kiro` | `~/.kiro/skills/gstack-*/` |

### 卸载

```bash
cd ~/.claude/skills/gstack && ./uninstall
```

使用 `--keep-state` 保留配置和分析数据，`--force` 跳过确认。卸载后需手动从项目 `CLAUDE.md` 中移除 `## gstack` 部分。

## 使用方法与示例

### 全流程示例：从想法到上线

```
你：我想做一个日程摘要应用
你：/office-hours
Claude：[提出6个关于痛点的问题——要具体例子，不要假设]
你：多个 Google 日历、过时的活动信息、错误的地点，准备太耗时...
Claude：我要对你的框架提出挑战。你说的"日程摘要应用"，
       实际上描述的是一个个人参谋长 AI。
       [提取5个你没想到的能力]
       [挑战4个前提——你同意、不同意或调整]
       [生成3种实现方案及工作量估算]
       建议：明天先交付最窄的切面，从真实使用中学习。
       [写设计文档 → 自动传递给下游技能]

你：/plan-ceo-review
Claude：[读取设计文档，挑战范围，执行10节审查]

你：/plan-eng-review
Claude：[ASCII 数据流图、状态机、错误路径、测试矩阵]

你：批准计划，退出规划模式。
Claude：[跨11个文件编写2,400行代码，约8分钟]

你：/review
Claude：[自动修复] 2个问题。[询问] 竞态条件 → 你批准修复

你：/qa https://staging.myapp.com
Claude：[打开真实浏览器，点击流程，发现并修复一个 bug]

你：/ship
Claude：测试：42 → 51（+9新增）。PR：github.com/you/app/pull/42
```

### 快速命令参考

| 场景 | 命令 |
|------|------|
| 新想法先想清楚 | `/office-hours` |
| 全自动规划 | `/autoplan` |
| 只做代码审查 | `/review` |
| 安全审计 | `/cso` |
| 测试线上网站 | `/qa https://your-app.com` |
| 端到端交付功能 | `/autoplan` → 实现 → `/ship` |
| 先规划再决定 | `/office-hours` → `/autoplan`（保存计划，不实现） |

### 审查类型选择指南

| 构建对象 | 规划阶段（编码前） | 审查阶段（上线后） |
|----------|-------------------|-------------------|
| 面向终端用户（UI/Web/移动端） | `/plan-design-review` | `/design-review` |
| 面向开发者（API/CLI/SDK/文档） | `/plan-devex-review` | `/devex-review` |
| 架构（数据流/性能/测试） | `/plan-eng-review` | `/review` |
| 以上全部 | `/autoplan`（自动检测适用哪些） | — |

## 配置选项

### gstack-config 配置工具

```bash
# 启用连续检查点模式（自动 WIP 提交，防止崩溃丢失）
gstack-config set checkpoint_mode continuous

# 启用检查点推送（默认仅本地，开启后推送到远程）
gstack-config set checkpoint_push true

# 关闭遥测
gstack-config set telemetry off

# 命令前缀切换（短命令 vs 命名空间命令）
cd ~/.claude/skills/gstack && ./setup --no-prefix   # /qa
cd ~/.claude/skills/gstack && ./setup --prefix       # /gstack-qa

# 启用自动升级
# 在 ~/.gstack/config.yaml 中设置 auto_upgrade: true
```

### 检查点模式

开启连续检查点后，技能会自动以 `WIP:` 前缀提交你的工作，附带结构化的 `[gstack-context]` 正文（决策、剩余工作、失败方案）。`/context-restore` 读取这些提交重建会话状态。`/ship` 在创建 PR 前会过滤压缩 WIP 提交（保留非 WIP 提交），确保 bisect 干净。

### GBrain 持久化知识库

GBrain 为 AI Agent 提供跨会话的持久记忆。配置路径：

```bash
# 快速初始化（本地 PGLite）
gbrain init

# 或通过 gstack 技能
/setup-gbrain --switch

# 同步代码到 gbrain
/sync-gbrain            # 增量同步（默认）
/sync-gbrain --full     # 完整重建索引
/sync-gbrain --dry-run  # 预览模式
```

每个仓库可设置三种信任等级：`read-write`（读写）、`read-only`（只读）、`deny`（拒绝）。

### 浏览器配置

```bash
# 导入真实浏览器 Cookie（Chrome/Arc/Brave/Edge）
/setup-browser-cookies

# 配置部署平台（供 /land-and-deploy 使用）
/setup-deploy
```

## 最佳实践

1. **始终从 `/office-hours` 开始**。在写任何代码之前，先让 AI 挑战你的产品假设。这是最有价值的单个步骤，能避免方向性错误导致的返工。

2. **使用 `/autoplan` 而非手动逐个调用审查**。一条命令自动运行 CEO → 设计 → 工程 → DX 审查，只把需要人类品味的决策提交给你。

3. **启用 `/guard` 保护生产环境**。在调试或修改生产代码时，`/guard`（= `/careful` + `/freeze`）防止破坏性操作和误改无关代码。

4. **利用 `/codex` 获取第二意见**。让 OpenAI 的 Codex CLI 独立审查同一个 diff，当 `/review`（Claude）和 `/codex`（OpenAI）同时审查同一分支时，可获得交叉模型分析。

5. **测试是安全网，不是负担**。`/ship` 在项目没有测试框架时会自动引导搭建。每次 `/qa` 修复 bug 都会生成回归测试。目标：100% 测试覆盖。

6. **并行 Sprint 效率翻倍**。配合 [Conductor](https://conductor.build) 运行多个 Claude Code 会话——一个做 `/office-hours`，一个做 `/review`，一个实现功能，一个在 staging 上跑 `/qa`。10-15 个并行 Sprint 是当前实际可行的上限。

7. **用 `/learn` 积累项目知识**。gstack 会跨会话学习你的代码库模式、陷阱和偏好。定期用 `/learn` 审查和修剪学到的内容，让它越来越精准。

8. **文档自动保持同步**。`/ship` 会自动调用 `/document-release`，确保 README、ARCHITECTURE、CONTRIBUTING 等文档始终与代码同步。

9. **部署后用 `/canary` 监控**。发布不是终点，`/canary` 在部署后持续监控控制台错误、性能回归和页面故障。

10. **语音输入友好**。gstack 技能支持语音触发——说"run a security check"、"test the website"、"do an engineering review"即可激活对应技能。

## 常见问题

### Q: 技能不显示怎么办？

确认插件已加载：
```bash
ls ~/.claude/skills/gstack/SKILL.md
```
确认项目 `CLAUDE.md` 包含 gstack 部分。重启 Claude Code 会话。

### Q: `/browse` 报错怎么办？

重新构建浏览器模块：
```bash
cd ~/.claude/skills/gstack && bun install && bun run build
```

### Q: 安装过期了怎么办？

运行 `/gstack-upgrade`，或在 `~/.gstack/config.yaml` 中设置 `auto_upgrade: true` 自动升级。

### Q: Windows 用户有什么注意事项？

gstack 在 Windows 11 上通过 Git Bash 或 WSL 运行。需要同时安装 Bun 和 Node.js（Bun 在 Windows 上有 Playwright 管道传输的已知问题）。未开启开发者模式时，`setup` 会回退到文件复制而非符号链接，因此每次 `git pull` 后需重新运行 `./setup`。

### Q: gstack 和 Superpowers、GSD 有什么区别？

- **gstack** 约束**谁做什么决策**——角色系统决定从什么视角思考问题
- **Superpowers** 约束**AI 如何写代码**——七阶段流水线，强制 TDD 和子任务委派
- **GSD** 约束**AI 写代码的条件**——每个任务 200K 干净上下文窗口

三者理论上可叠加使用。gstack 适合需要多角色联合审查的全栈项目；如果只需 AI 写库函数，Superpowers 或 GSD 更直接。

### Q: `/review` 和 `/codex` 有什么区别？

`/review` 是 Claude 内部的主任工程师审查。`/codex` 调用 OpenAI 的 Codex CLI 提供独立的第二意见。当两者都审查过同一分支时，会产生交叉模型分析，显示哪些发现重叠、哪些是各自独有的。

### Q: 如何在 OpenClaw 中使用 gstack？

在 OpenClaw Agent 中粘贴安装命令即可。然后在 `AGENTS.md` 中添加"Coding Tasks"部分，说明生成 Claude Code 会话时使用 gstack 技能。自然语言即可调度：安全审计说"Run /cso"，代码审查说"Run /review"，端到端交付说"Run /autoplan, implement the plan, then run /ship"。

### Q: 遥测数据安全吗？

遥测默认**关闭**，需手动开启。数据存储在 Supabase，schema 在 `supabase/migrations/` 目录公开可查。行级安全策略拒绝所有直接访问，遥测通过验证的 Edge Functions 流入，强制 schema 检查和字段长度限制。可用 `gstack-config set telemetry off` 随时关闭。
