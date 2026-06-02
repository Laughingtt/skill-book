---
slug: agency-agents
name: Agent Teams_Agency-Agents
category: 编码开发与工程规范
tags:
  - agent
  - team
  - role
  - collaboration
  - multi-agent
description: AI角色团队协同开发，一次配齐架构师、数据库优化师、前端、代码审查和测试等专家角色
---

# Agency Agents -- AI 专家角色团队

## 简介

Agency Agents（也称为 The Agency）是由 msitarzewski 创建的开源项目，提供了 147+ 个专业化 AI Agent 角色定义，覆盖 12 个业务领域。每个角色都以 Markdown + YAML frontmatter 格式编写，包含专属的身份设定、任务使命、工作流程和交付标准，而非泛泛的通用提示词。

核心思想：与其让一个通用 AI 助手"什么都会一点"，不如配备一支专业团队——需要 API 设计时找后端架构师，需要安全审计时找安全专家，需要 UI 实现时找前端工程师。Agent 各司其职，输出质量显著提升。

项目原生支持 Claude Code，同时兼容 GitHub Copilot、Cursor、Aider、Windsurf、Gemini CLI、OpenCode、Antigravity 等 10+ 种 AI 编码工具，通过内置脚本自动转换和安装。

## 核心功能

### 12 大专业部门

| 部门 | 代表角色 | 适用场景 |
|------|---------|---------|
| Engineering | Frontend Developer、Backend Architect、Mobile App Builder、AI Engineer | 系统设计、前后端开发、移动端、AI 集成 |
| Design | UX Researcher、UI Designer、Whimsy Injector | 用户研究、界面设计、体验优化 |
| Paid Media | Ads Specialist、Analytics Expert | 广告投放、数据分析 |
| Sales | Sales Strategist、Pipeline Builder | 销售策略、漏斗优化 |
| Marketing | Content Marketer、SEO Specialist | 内容营销、搜索引擎优化 |
| Product | Product Manager、Sprint Prioritizer、Trend Researcher | 产品规划、优先级排序、趋势分析 |
| Project Management | Scrum Master、Risk Analyst | 项目管理、风险评估 |
| Testing | QA Engineer、Test Automator | 质量保证、自动化测试 |
| Support | Technical Writer、Community Manager | 技术文档、社区运营 |
| Spatial Computing | AR/VR Developer、3D Artist | 增强现实、3D 建模 |
| Specialized Domains | Blockchain Developer、Payment Integration、Legacy Modernizer | 区块链、支付集成、遗留系统现代化 |
| Finance & Game Dev | FinTech Engineer、Game Developer | 金融科技、游戏开发 |

### 角色 Agent 的结构

每个角色 `.md` 文件包含以下要素：

- **身份设定**：明确角色定位与专业领域
- **核心使命**：该角色负责解决什么问题
- **工作规则**：操作规范、代码标准、交付要求
- **成功指标**：如何衡量输出质量
- **工具权限**：可使用的工具集（如 file read/write、bash、lint 等）

### 多工具兼容

Agency Agents 内置转换脚本，自动适配不同工具的格式要求：

- **Claude Code / GitHub Copilot**：原生 `.md` 格式，复制到 `~/.claude/agents/` 或 `~/.github/agents/`
- **Cursor**：转换为 `.mdc` 规则文件
- **Aider**：编译为 `CONVENTIONS.md`
- **Windsurf**：生成 `.windsurfrules`
- **Gemini CLI / Antigravity**：转换为 `SKILL.md` 格式
- **OpenCode / OpenClaw**：原生 `.md` 格式
- **Kimi Code**：复制到 `~/.config/kimi/agents/`

## 安装与使用

### 前置条件

- 已安装 Claude Code（v2.1.32 或更高版本）
- Git 环境

### 快速安装

**方式一：使用安装脚本（推荐）**

```bash
# 克隆仓库
git clone https://github.com/msitarzewski/agency-agents.git
cd agency-agents

# Claude Code 一键安装
./scripts/install-claude.sh

# 或安装到 GitHub Copilot
./scripts/install-claude.sh --copilot

# Cursor 用户
./scripts/install-cursor.sh

# Aider 用户
./scripts/install-aider.sh
```

**方式二：手动复制单个角色**

```bash
# 复制后端架构师角色
cp engineering/backend-architect.md ~/.claude/agents/

# 复制前端开发角色
cp engineering/frontend-developer.md ~/.claude/agents/

# 复制代码审查角色
cp engineering/code-reviewer.md ~/.claude/agents/

# 复制数据库优化师角色
cp engineering/database-optimizer.md ~/.claude/agents/

# 复制测试工程师角色
cp engineering/test-automator.md ~/.claude/agents/
```

**方式三：复制全部角色**

```bash
cp -r agency-agents/ ~/.claude/agents/
```

### 验证安装

```bash
# 检查已安装的 Agent
ls ~/.claude/agents/
```

## 使用方法与示例

### 激活单个 Agent

在 Claude Code 会话中，通过自然语言引用角色名称即可激活：

```
激活 Frontend Developer 角色，帮我构建一个 React 组件
```

```
使用 Backend Architect 来设计用户认证 API
```

```
用 Code Reviewer 审查这个 PR 的代码质量
```

### 多角色协同开发

结合 Claude Code 的 Agent Teams 功能，可以同时激活多个角色进行协同工作：

**第一步：启用 Agent Teams**

```json
// settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

**第二步：组建开发团队**

```
创建一个 Agent Team：
- 用 Backend Architect 设计 API 和数据库架构
- 用 Frontend Developer 实现 UI 交互
- 用 Database Optimizer 优化查询和索引
- 用 Code Reviewer 审查代码质量
- 用 Test Automator 编写测试用例
```

**第三步：分工协作示例**

```
架构师 → 负责系统设计与技术选型，输出架构文档
数据库优化师 → 专注查询优化与索引设计，确保性能达标
前端开发 → 实现交互与 UI，保证像素级还原
代码审查 → 检查代码质量与规范，提出改进建议
测试工程师 → 编写测试用例与回归测试，保障交付质量
```

### 角色链式调用

可以将多个 Agent 按流程串联，形成完整的开发流水线：

```
1. 用 UX Researcher 定义需求和用户故事
2. 用 Software Architect 设计系统架构
3. 用 Backend Architect 实现 API 层
4. 用 Frontend Developer 实现 UI 层
5. 用 Reality Checker 验证功能是否达到生产标准
```

### 典型使用场景

- **新项目启动**：一次性配置架构师、前端、后端、测试等多角色团队
- **代码审查流水线**：让 Code Reviewer 自动检查代码质量与安全漏洞
- **性能优化**：使用 Database Optimizer 和 Performance Engineer 协同定位瓶颈
- **安全审计**：调用 Security Specialist 进行 OWASP 漏洞扫描
- **遗留系统重构**：使用 Legacy Modernizer 制定渐进式迁移方案

## 配置选项

### Agent 模型分配

不同复杂度的角色可指定不同的 Claude 模型，以平衡性能和成本：

| 模型 | 适用场景 | 典型角色 |
|------|---------|---------|
| `opus` | 深度推理——架构评审、安全审计、复杂决策 | security-auditor、architect-reviewer、software-architect |
| `sonnet` | 日常编码——编写、调试、重构 | backend-architect、frontend-developer、devops-engineer |
| `haiku` | 轻量任务——文档、搜索、依赖检查 | documentation-writer、build-engineer、seo-specialist |

编辑角色 `.md` 文件的 YAML frontmatter 中的 `model` 字段即可修改：

```yaml
---
name: Backend Architect
category: engineering
model: opus    # 可改为 sonnet、haiku 或 inherit
---
```

### 自定义角色

基于现有角色模板创建自定义 Agent：

```markdown
---
name: My Custom Agent
category: engineering
model: sonnet
---

# 自定义角色名称

## 目的
描述这个角色的专业定位和核心使命。

## 核心职责
- 职责一
- 职责二

## 工作规则
- 规则一
- 规则二

## 成功指标
- 指标一
- 指标二
```

将自定义文件保存到 `~/.claude/agents/` 目录即可在 Claude Code 中使用。

### 与 Agent Teams 深度集成

Agency Agents 的角色定义可以被 Agent Teams 的 Teammate 直接引用：

```
生成一个 Teammate，使用 security-reviewer 角色类型来审计认证模块。
```

这使得同一套角色定义既能作为子 Agent 也能作为 Agent Teams 的队友使用，实现复用。

## 最佳实践

1. **按需选择角色**：不要一次性安装全部 147+ 个角色，只复制当前项目需要的。过多角色会增加 Claude Code 的加载时间和上下文干扰。

2. **明确角色边界**：每个 Agent 只做它擅长的事。不要让 Frontend Developer 处理数据库设计，也不要让 Backend Architect 写 UI 组件。

3. **使用合适的模型**：架构决策和安全审计用 Opus，日常编码用 Sonnet，文档和搜索用 Haiku。合理分配可节省 50% 以上的 Token 消耗。

4. **角色组合优于单一通用**：将复杂任务拆分为多个专业角色并行处理，比让一个通用助手逐步完成效率更高、质量更好。

5. **先设计后实现**：先用 Architect 角色完成系统设计，再让 Builder 角色实现。设计阶段的投入会大幅减少返工。

6. **审查必不可少**：实现完成后，务必使用 Code Reviewer 进行质量审查。建议每 3-4 个构建角色配备 1 个审查角色。

7. **自定义适配项目**：基于模板创建项目专属角色，加入团队编码规范、技术栈偏好和业务约束，效果远超通用角色。

8. **与 Agent Teams 搭配使用**：对于大型项目，启用 Agent Teams 功能让多个角色真正并行工作。推荐 2-5 个 Agent 并行，超过 5 个时协调成本可能超过并行收益。

## 常见问题

**Q: Agency Agents 和 Claude Code 原生 Agent Teams 有什么区别？**

A: Agency Agents 是一套预定义的角色文件集合（Markdown 格式），定义了"谁"——每个角色的身份、使命和规则。Agent Teams 是 Claude Code 的并行协调机制，定义了"怎么协作"——多个 Agent 如何分工、通信和同步。两者互补：Agency Agents 提供角色定义，Agent Teams 提供协调框架。

**Q: 安装后 Claude Code 没有识别到角色？**

A: 确认文件已正确放置在 `~/.claude/agents/` 目录（非项目级 `.claude/agents/`），且文件格式为 `.md` + YAML frontmatter。重启 Claude Code 会话后重新尝试。

**Q: 可以在 Cursor / Copilot 中使用吗？**

A: 可以。运行对应的安装脚本（`./scripts/install-cursor.sh` 或安装到 `~/.github/agents/`），脚本会自动将角色文件转换为对应工具所需的格式。

**Q: 147+ 个角色是否需要全部安装？**

A: 不建议。按需选择与当前项目相关的角色即可。安装过多角色会增加上下文窗口的占用，降低 Claude Code 的响应效率。

**Q: 多个角色同时修改同一文件会不会冲突？**

A: 使用 Agent Teams 时，内置的任务列表和文件锁机制会避免冲突。手动使用时，建议为不同角色分配不同的文件或模块，或在 Git worktree 中隔离工作。

**Q: 如何贡献新的角色定义？**

A: 项目是开源的（MIT 许可），可以在 GitHub 上 Fork 仓库后提交 PR。每个角色需包含完整的身份设定、使命描述、工作规则和成功指标。

**Q: Token 消耗会不会很大？**

A: 多角色协同确实会增加 Token 消耗，但通过合理分配模型（Opus/Sonnet/Haiku）和按需激活角色，可以有效控制成本。实际使用中，因减少返工而节省的 Token 往往超过多角色并行带来的额外消耗。
