---
slug: agent-skills-google
name: Agent Skills（谷歌工程纪律包）
category: 编码开发与工程规范
tags: [engineering, discipline, review, test, security, ship]
description: 轻量灵活约束AI行为的工程纪律技能包，覆盖开发全流程
install: "/plugin marketplace add addyosmani/agent-skills"
source: "https://github.com/addyosmani/agent-skills"
---

# Agent Skills（谷歌工程纪律包）

## 简介

Agent Skills 是由 Addy Osmani（Google Chrome 工程总监、Anthropic 顾问）开源的生产级工程纪律技能包，旨在解决 AI 编码代理的核心缺陷：**AI 代理默认走最短路径，跳过规格说明、测试、安全审查和所有让软件可靠的实践环节。**

这套技能包将 Google 内部的工程实践编码为结构化的工作流，让 AI 代理在每一个开发阶段都遵循资深工程师的标准。项目在 GitHub 上获得超过 19,000 星标，已被广泛验证。

核心理念可以用一句话概括：**流程优于散文（Process over prose），可验证的退出标准优于含糊的建议。**

### 为什么需要 Agent Skills？

| 没有 Agent Skills | 有 Agent Skills |
|---|---|
| 没有规格说明就开始编码 | 先写规格，再写代码 |
| 不写测试就交付 | 测试先行，证明功能正确 |
| 跳过安全审查 | OWASP 安全审计不可跳过 |
| 代码越写越复杂 | 主动简化，清晰优于聪明 |
| 直接推送上线 | 预部署检查 + 分阶段上线 + 回滚预案 |

## 六阶段开发生命周期

Agent Skills 将软件开发生命周期映射为六个阶段，七个斜杠命令贯穿其中：

```
DEFINE  →  PLAN  →  BUILD  →  VERIFY  →  REVIEW  →  SHIP
  │         │        │         │          │          │
/spec     /plan    /build    /test     /review    /ship
  │         │        │         │          │          │
锁定需求   分解任务  增量实现   证明可行   质量关卡   安全上线
```

`/code-simplify` 横跨整个生命周期，任何阶段都可以调用。

## 23 个技能详解

### Define（定义阶段）— 锁定需求，先想清楚再动手

| 技能 | 说明 |
|---|---|
| `interview-me` | 需求访谈技能，通过苏格拉底式提问帮你澄清模糊的需求，拒绝含糊的"大概要一个XXX" |
| `idea-refine` | 想法精炼，把粗糙的创意收敛为可执行的范围 |
| `spec-driven-development` | 规格驱动开发，强制要求在写代码前输出规格文档 |

**典型流程：** 输入 `/spec 我需要一个用户认证功能，支持 OAuth 2.0` → Agent 不会直接写代码，而是先输出一份包含需求边界、依赖关系和验收标准的规格文档。

### Plan（规划阶段）— 大任务拆小，小任务拆原子

| 技能 | 说明 |
|---|---|
| `planning-and-task-breakdown` | 任务分解技能，将大特性拆成可独立交付的垂直切片，每个切片可测试、可审查 |

**典型流程：** 输入 `/plan` → Agent 读取规格文档，输出任务列表，每个任务有明确的输入/输出和验收条件。

### Build（构建阶段）— 一次只切一片，切完验证再切下一片

| 技能 | 说明 |
|---|---|
| `incremental-implementation` | 增量实现，一个垂直切片接一个，每完成一个就验证 |
| `context-engineering` | 上下文工程，控制喂给 Agent 的信息量，避免上下文窗口污染 |
| `source-driven-development` | 源码驱动开发，基于已有代码结构进行开发，而非凭空生成 |
| `doubt-driven-development` | 怀疑驱动开发，对不确定的代码主动标记和验证 |
| `frontend-ui-engineering` | 前端 UI 工程，设计 API 时自动触发 `api-and-interface-design` |
| `test-driven-development` | 测试驱动开发，红-绿-重构循环 |
| `api-and-interface-design` | API 与接口设计，遵循 Hyrum's Law 设计可靠接口 |

**典型流程：** 输入 `/build` → Agent 按 `/plan` 输出的任务列表逐个实现，每完成一个切片就运行测试验证。

### Verify（验证阶段）— 证明它工作，而不是声称它工作

| 技能 | 说明 |
|---|---|
| `browser-testing-with-devtools` | 浏览器测试与 DevTools，使用 Chrome DevTools 进行功能验证 |
| `debugging-and-error-recovery` | 调试与错误恢复，系统化的根因分析方法 |

**典型流程：** 输入 `/test` → Agent 运行测试套件，对失败用例进行根因分析，输出修复建议而非直接猜测修改。

### Review（审查阶段）— 抓住漏网之鱼

| 技能 | 说明 |
|---|---|
| `code-review-and-quality` | 代码审查与质量，以"资深工程师会批准这个 PR 吗？"为标准 |
| `code-simplification` | 代码简化，清晰优于聪明，无聊方案优于精巧方案 |
| `security-and-hardening` | 安全加固，OWASP Top 10 扫描 + 威胁建模 |
| `performance-optimization` | 性能优化，Core Web Vitals 分析与瓶颈定位 |

**典型流程：** 输入 `/review` → Agent 执行代码审查、安全扫描和性能分析，输出分类报告（Critical/High/Medium/Low）。

### Ship（交付阶段）— 快速上线的前提是安全上线

| 技能 | 说明 |
|---|---|
| `git-workflow-and-versioning` | Git 工作流与版本管理，规范的分支策略和提交信息 |
| `ci-cd-and-automation` | CI/CD 与自动化，流水线配置与部署编排 |
| `deprecation-and-migration` | 废弃与迁移，安全移除旧代码的流程 |
| `documentation-and-knowledge` | 文档与知识管理，Architecture Decision Records (ADR) |
| `shipping-and-deployment` | 上线与部署，预部署检查 + 分阶段上线 + 自动回滚 |

**典型流程：** 输入 `/ship` → Agent 执行三角色联合检查（代码审查 + 测试验证 + 安全审计），全部通过后执行部署前检查清单。

## 三个专家 Agent 角色

除了技能本身，项目还内置三个预配置的专家角色，用于针对性审查：

| 角色 | 核心标准 | 适用场景 |
|---|---|---|
| **Code Reviewer** | "资深工程师会批准这个 PR 吗？" | 代码质量审查、重构建议 |
| **Test Engineer** | Prove-It 模式——不要声称工作，要证明工作 | 覆盖率分析、边界测试 |
| **Security Auditor** | OWASP 评估 + 威胁建模 | 安全漏洞扫描、合规检查 |

## 安装与配置

### 方式一：Claude Code 插件市场安装（推荐）

在 Claude Code 会话中执行：

```bash
# 添加仓库到插件市场
/plugin marketplace add addyosmani/agent-skills

# 安装技能包
/plugin install agent-skills@addy-agent-skills
```

安装后即可使用 `/spec`、`/plan`、`/build`、`/test`、`/review`、`/ship`、`/code-simplify` 七个斜杠命令，Agent 也会根据上下文自动激活相关技能。

### 方式二：本地克隆安装（兼容所有工具）

```bash
# 克隆仓库
git clone https://github.com/addyosmani/agent-skills.git

# Claude Code 加载
claude --plugin-dir /path/to/agent-skills

# Gemini CLI 加载
gemini skills install --path skills

# Cursor 加载
# 将 SKILL.md 文件复制到 .cursor/rules/ 目录
```

### 方式三：在 CLAUDE.md 中引用

在项目的 `CLAUDE.md` 文件中添加引用：

```markdown
## Skills
- Reference: /path/to/agent-skills/skills/
```

### 方式四：单技能安装

```bash
# 只安装特定技能
mkdir -p ~/.claude/skills
cp -r /path/to/agent-skills/skills/ship/ ~/.claude/skills/ship/
```

## 使用方法与示例

### 完整开发流程示例

以下是一个从零到交付的完整工作流：

```bash
# 1. 定义需求——先想清楚
/spec 我需要一个用户认证模块，支持邮箱登录和 Google OAuth 2.0，需要记住我功能

# 2. 规划任务——拆成小步
/plan

# 3. 增量实现——一步一个脚印
/build

# 4. 测试验证——证明它工作
/test

# 5. 代码审查——资深工程师视角
/review

# 6. 代码简化——去掉不必要的复杂度
/code-simplify

# 7. 安全上线——三角色联合检查
/ship
```

### `/ship` 联合检查详解

`/ship` 是 Agent Skills 的核心命令，执行三角色联合检查：

```
输入 /ship →
  ① 代码审查 Agent → 代码质量、命名规范、架构一致性
  ② 测试 Agent → 覆盖率、边界条件、回归测试
  ③ 安全审计 Agent → OWASP Top 10、注入攻击、认证缺陷
→ 输出分类报告（Critical / High / Medium / Low）
→ Critical 和 High 级别问题必须修复才能继续
→ 通过后执行部署前检查清单
→ 分阶段上线 + 自动回滚预案
```

### 部分使用示例

不需要走完整流程，也可以单独使用某个技能：

```bash
# 只做安全审计
# Agent 自动激活 security-and-hardening 技能
请对这个认证模块做一次安全审查

# 只做代码简化
/code-simplify src/auth/oauth.ts

# 只做测试
/test

# 只做 API 设计
# Agent 自动激活 api-and-interface-design 技能
设计一个 RESTful API 接口用于用户管理
```

## 核心设计原则

### 1. 流程优于散文（Process over Prose）

技能不是写给人看的散文，而是写给 AI 执行的程序。每个字段都约束 AI 的行为边界：

```yaml
# 好的技能指令
- "运行 npm test 并验证所有测试通过"
- "检查覆盖率是否达到 80% 以上"

# 差的技能指令
- "确保测试工作正常"
- "要有好的测试覆盖"
```

### 2. 反合理化表（Anti-Rationalization Table）

这是 Agent Skills 最独特的设计。AI 代理会找借口跳过重要步骤，反合理化表预先列出这些借口并给出反驳：

| AI 可能的借口 | 反驳 |
|---|---|
| "这个改动很小，不需要测试" | 小改动引入的 bug 最多，因为没人仔细审查 |
| "安全审查太耗时了" | 修复一个生产安全事件的成本是预防的 100 倍 |
| "这段代码已经很清楚了，不需要简化" | 今天清楚不代表三个月后还清楚 |

### 3. 渐进式披露（Progressive Disclosure）

20+ 个技能不会一次性加载到上下文窗口中。每个技能的 `SKILL.md` 是入口点，支撑材料和参考清单按需加载。这样可以将 20 个技能的库压缩到 5K token 的上下文占用，避免污染 Agent 的推理空间。

### 4. 范围纪律（Scope Discipline）

Meta 技能编码了一条不可协商的规则：**只碰你被要求碰的东西。** 不要重构相邻系统，不要删除你不完全理解的代码，不要看到 TODO 就决定重写整个文件。

### 5. 五条不可协商的原则

1. **动手前先暴露假设**——默默持有的错误假设是最常见的失败模式
2. **需求冲突时停下来问**——不要猜
3. **该拒绝时就拒绝**——Agent 不是应声虫
4. **选择无聊但显而易见的方案**——聪明的代价很高
5. **只碰你被要求碰的东西**——范围蔓延是效率杀手

## 技能文件结构（SKILL.md）

每个技能遵循统一的文件结构：

```
agent-skills/
├── skills/                    # 23 个技能（22 生命周期 + 1 元技能）
│   ├── interview-me/          # Define
│   │   └── SKILL.md           # 必需：技能定义
│   ├── spec-driven-development/
│   │   ├── SKILL.md
│   │   └── scripts/           # 可选：可运行的辅助脚本
│   ├── planning-and-task-breakdown/
│   ├── incremental-implementation/
│   ├── context-engineering/
│   ├── source-driven-development/
│   ├── doubt-driven-development/
│   ├── frontend-ui-engineering/
│   ├── test-driven-development/
│   ├── api-and-interface-design/
│   ├── browser-testing-with-devtools/
│   ├── debugging-and-error-recovery/
│   ├── code-review-and-quality/
│   ├── code-simplification/
│   ├── security-and-hardening/
│   ├── performance-optimization/
│   ├── git-workflow-and-versioning/
│   ├── ci-cd-and-automation/
│   ├── deprecation-and-migration/
│   ├── documentation-and-knowledge/
│   ├── shipping-and-deployment/
│   └── meta/                  # 元技能：跨阶段规则
└── docs/
    └── skill-anatomy.md       # 技能格式规范
```

每个 `SKILL.md` 的 frontmatter 格式：

```yaml
---
name: incremental-implementation
description: Build features in small, testable increments
triggers:
  - "start implementation"
  - "begin coding"
  - "implement feature"
---
```

## 兼容性

| 工具 | 安装方式 | 状态 |
|---|---|---|
| **Claude Code** | 插件市场安装 | 完全支持 |
| **Cursor** | 复制到 `.cursor/rules/` | 完全支持 |
| **Gemini CLI** | `gemini skills install` | 完全支持 |
| **GitHub Copilot** | 复制 SKILL.md | 完全支持 |
| **Codex CLI** | 本地目录加载 | 完全支持 |
| **任何支持 Markdown 的 Agent** | 直接使用 | 完全支持 |

技能文件就是纯 Markdown，不依赖任何 SDK 或运行时，跨工具零成本迁移。

## 常见工作流

### 工作流一：新功能开发

```
/spec → /plan → /build → /test → /review → /ship
```

适用于从零开始的新功能。每个阶段都有明确的退出标准，上一个阶段不通过不进入下一个。

### 工作流二：Bug 修复

```
/test（定位问题）→ /build（修复）→ /test（回归验证）→ /review → /ship
```

修复 Bug 不需要走完整流程，但测试验证和代码审查不可跳过。

### 工作流三：安全审查

```
/review（安全审计）→ /build（修复漏洞）→ /test → /ship
```

只关注安全维度，使用 Security Auditor 角色进行 OWASP 评估。

### 工作流四：代码简化

```
/code-simplify → /test → /review → /ship
```

重构和简化现有代码，确保简化后功能不变。

### 工作流五：快速验证

```
/test → /review
```

小改动只需要测试和快速审查，不需要走完整交付流程。

## 最佳实践

1. **从 `/spec` 开始**——永远不要让 Agent 直接写代码。先定义清楚要建什么，再动手。
2. **使用 `/plan` 分解任务**——大任务不分解，Agent 就会在一个巨大的上下文中迷失。
3. **每个切片都验证**——完成一个垂直切片后立即 `/test`，不要攒到最后。
4. **不要跳过 `/review`**——即使是小改动，代码审查也能发现 60% 的缺陷。
5. **`/code-simplify` 随时可用**——不只是交付前，任何觉得代码变复杂的时候都可以调用。
6. **`/ship` 是质量关卡而非部署命令**——如果 `/ship` 报告了 Critical 问题，必须先修复。
7. **按需安装技能**——20+ 个技能全装上会增加认知负担，团队通常只需要 5-6 个核心技能。
8. **定制你自己的技能**——以 Agent Skills 为模板，根据团队规范编写专属技能。技能就是 Markdown 文件，fork 后自由修改。

## 常见问题

### Q: Agent Skills 和 CLAUDE.md 有什么区别？

CLAUDE.md 是项目级持久上下文，每次会话都会加载，用于告诉 Agent 项目的基本信息（如"这个项目用 pytest"）。Agent Skills 是按需加载的结构化工作流，只在触发时才进入上下文。两者互补：CLAUDE.md 提供背景，Agent Skills 提供流程。

### Q: 和 `.cursorrules` / 规则文件有什么区别？

规则文件主要约束代码风格和格式，Agent Skills 覆盖完整的开发生命周期，从规格定义到安全上线。规则文件是"不要做什么"，Agent Skills 是"按什么流程做什么"。

### Q: 是否必须走完整流程？

不必。每个技能可以独立使用。小改动可能只需要 `/test` + `/review`，Bug 修复可能只需要 `/test` + `/build` + `/test`。完整流程适用于新功能开发。

### Q: 技能会不会占用太多上下文窗口？

不会。渐进式披露设计确保只有当前需要的技能加载到上下文中。20 个技能的库压缩到约 5K token 的上下文占用。

### Q: 如何为团队定制技能？

Fork 仓库，修改 `skills/` 目录下的 `SKILL.md` 文件。技能格式规范见 `docs/skill-anatomy.md`。贡献技能需要满足四个标准：具体（可执行的步骤）、可验证（有退出标准）、实战检验（基于真实工作流）、最小化（只包含必要内容）。

### Q: 技能的安全风险如何？

Agent Skills 本身是纯 Markdown 文件，不包含可执行代码（`scripts/` 目录下的脚本需要人工审查）。安装第三方技能时务必检查 `SKILL.md` 内容，避免提示注入攻击。Snyk 的研究显示技能生态中 36% 存在提示注入风险，但 Agent Skills 作为官方维护的项目经过了社区审查。
