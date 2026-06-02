---
slug: skill-creator-find
name: Skill Creator/ Find-Skill
category: 效率工具与自动化
tags:
  - skill
  - creator
  - search
  - management
  - marketplace
description: 自己创建新技能或寻找现成技能的技能管理与搜索工具
install: brew install find-skill 或 pipx install find-skill
source: 'https://github.com/fockus/claude-skill-find-skill'
---

# Skill Creator / Find-Skill（技能创建与发现）

## 简介

Skill Creator / Find-Skill 是一个集**技能创建**与**技能发现**于一体的元技能（meta-skill）工具。它解决了一个核心问题：当你需要某个能力时，是应该自己从零创建一个技能，还是去社区寻找已有的现成技能？

这个工具将两个互补的工作流整合在一起：

- **Skill Creator**：Anthropic 官方提供的元技能，用于从零创建、迭代改进和评估 Claude 技能。它引导你完成从需求捕获到测试评估的完整技能构建流程。
- **Find-Skill**：基于 Vercel 的开放技能生态系统（skills.sh），帮助你在社区中搜索、发现和安装已有的高质量技能，避免重复造轮子。

## 核心功能

### 技能创建（Skill Creator）

- **需求捕获**：通过结构化访谈理解你的意图，明确技能的触发条件、输出格式和成功标准
- **SKILL.md 生成**：自动生成符合规范的技能文件，包含 YAML frontmatter（name、description）和 Markdown 指令
- **渐进式披露**：支持三级加载架构——元数据（始终加载）、SKILL.md 正文（触发时加载）、捆绑资源（按需加载）
- **测试与评估**：创建测试用例，运行带技能和不带技能的对比实验，生成量化基准报告
- **迭代改进**：基于用户反馈和量化指标持续优化技能，直到满意为止
- **描述优化**：自动优化技能描述的触发准确性，确保 Claude 在正确场景下调用技能

### 技能发现（Find-Skill）

- **排行榜查询**：优先检查 skills.sh 排行榜，发现经过社区验证的热门技能
- **CLI 搜索**：通过 `npx skills find` 命令在开放技能生态中搜索
- **质量验证**：检查安装量、来源信誉度（vercel-labs、anthropics 等可信源），避免推荐低质量技能
- **一键安装**：找到合适技能后直接通过 CLI 安装到你的代理环境中
- **分类浏览**：支持 Web 开发、测试、DevOps、文档、代码质量、设计、效率等分类检索

## 安装与使用

### 安装方式

```bash
# 方式一：通过 Homebrew 安装
brew install find-skill

# 方式二：通过 pipx 安装
pipx install find-skill

# 方式三：通过 npx 直接使用（推荐，无需全局安装）
npx skills find <查询关键词>
```

### 安装 Skill Creator 元技能

```bash
# 从 Anthropic 官方仓库安装 skill-creator
npx skills add anthropics/skills --skill skill-creator

# 或直接在 Claude Code 中使用
# 对 Claude 说："Help me build a skill using skill-creator"
```

### 安装 Find-Skill 技能

```bash
# 从 Vercel Labs 安装 find-skills
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## 使用方法与示例

### 一、创建新技能

#### 基本流程

1. **描述需求**：用自然语言告诉 Claude 你想要什么技能
2. **需求访谈**：Skill Creator 会追问细节——触发条件、输出格式、边界情况
3. **生成草稿**：自动生成 SKILL.md 文件
4. **测试验证**：创建测试用例并运行对比实验
5. **迭代改进**：根据反馈优化技能
6. **描述优化**：优化触发描述，确保技能在正确时机被调用

#### 示例：创建 API 文档生成技能

```
用户：我需要一个自动生成 API 文档的技能

Skill Creator：
  → 这个技能应该在什么场景下触发？
  → 期望的输出格式是什么？（Markdown / OpenAPI / HTML）
  → 需要支持哪些输入源？（代码注释 / TypeScript 类型 / Postman 集合）
  → 是否需要设置测试用例来验证？

用户：从 TypeScript 类型定义生成 Markdown API 文档，触发条件是
      用户提到"API 文档"或"接口文档"

Skill Creator：
  → 生成 SKILL.md 草稿
  → 保存到 .claude/skills/ 目录
  → 创建 2-3 个测试用例
  → 运行带技能 vs 不带技能的对比实验
  → 展示结果供用户评审
```

#### SKILL.md 文件结构

```
my-skill/
├── SKILL.md          # 必需 - 包含 frontmatter 和指令
│   ├── YAML frontmatter（name、description 必填）
│   └── Markdown 指令正文
└── 捆绑资源（可选）
    ├── scripts/      # 可执行脚本，用于确定性/重复性任务
    ├── references/   # 按需加载的参考文档
    └── assets/       # 输出中使用的模板、图标等
```

#### SKILL.md frontmatter 示例

```yaml
---
name: api-doc-generator
description: >
  从 TypeScript 类型定义自动生成 Markdown API 文档。
  当用户提到 API 文档、接口文档、API reference，
  或需要从代码生成文档时使用此技能。
---
```

> **提示**：description 是技能触发的关键机制。建议写得稍微"主动"一些，
> 明确列出所有应该触发的场景，因为 Claude 倾向于"少触发"而非"多触发"。

### 二、发现和安装现有技能

#### 搜索技能

```bash
# 搜索 React 性能优化相关技能
npx skills find react performance

# 搜索 PR 审查相关技能
npx skills find pr review

# 搜索变更日志相关技能
npx skills find changelog

# 搜索部署相关技能
npx skills find deploy docker
```

#### 浏览技能排行榜

访问 [skills.sh](https://skills.sh/) 查看按安装量排名的热门技能。知名技能源包括：

| 来源 | 说明 |
|------|------|
| `anthropics/skills` | Anthropic 官方技能（PDF、DOCX、XLSX、PPTX、skill-creator 等） |
| `vercel-labs/agent-skills` | Vercel 官方技能（React 最佳实践、前端设计、find-skills 等） |
| `microsoft/skills` | 微软官方技能 |

#### 安装技能

```bash
# 安装特定技能
npx skills add vercel-labs/agent-skills@react-best-practices

# 全局安装（用户级别，所有项目可用）
npx skills add -g anthropics/skills --skill frontend-design

# 跳过确认提示
npx skills add -y vercel-labs/agent-skills@find-skills
```

#### 检查和更新已安装技能

```bash
# 检查当前项目的技能状态
npx skills check

# 更新所有已安装技能到最新版本
npx skills update
```

### 三、创建自己的技能并发布

```bash
# 初始化新技能项目
npx skills init my-custom-skill

# 编辑 SKILL.md 文件，添加指令和 frontmatter
# 测试技能后发布到 GitHub
# 其他用户即可通过 npx skills add 安装
```

## 配置选项

### 技能存放位置

| 环境 | 路径 |
|------|------|
| Claude Code（项目级） | `.claude/skills/` |
| Claude Code（用户级） | `~/.config/claude-code/skills/` |
| Claude.ai | 设置 → Capabilities → Skills |
| Claude API | 通过 Skills API 上传 |

### 测试与评估配置

Skill Creator 的评估流程支持以下配置：

- **测试用例数量**：建议 2-3 个起步，逐步扩展
- **对比基线**：新技能对比无技能基线；改进技能对比旧版本
- **评估维度**：定性评审（用户反馈）+ 定量指标（通过率、耗时、token 用量）
- **迭代次数**：持续迭代直到用户满意或反馈全部为空

### 描述优化配置

- **评估查询集**：20 个查询（8-10 个应触发 + 8-10 个不应触发）
- **训练/测试分割**：60% 训练集 + 40% 保留测试集
- **每次查询运行次数**：3 次（确保触发率可靠）
- **最大优化迭代**：5 次

## 最佳实践

### 技能创建

1. **先搜索再创建**：在创建新技能前，先用 Find-Skill 搜索是否已有类似技能，避免重复劳动
2. **描述要具体且主动**：在 description 中明确列出所有触发场景，包括用户可能使用的不同表述方式
3. **保持 SKILL.md 精简**：正文控制在 500 行以内，超出部分拆分到 references/ 目录
4. **解释"为什么"而非"必须"**：用原因解释代替大写 MUST/NEVER，LLM 理解原理后表现更好
5. **捆绑重复脚本**：如果多个测试用例都独立写了类似的辅助脚本，说明应该将其放入 scripts/ 目录
6. **渐进式披露**：利用三级加载机制，只在需要时加载详细参考文档
7. **测试用例要真实**：使用用户实际会说的自然语言，包含具体文件路径、上下文背景，而非抽象请求

### 技能发现

1. **优先看排行榜**：skills.sh 排行榜上的技能经过大量用户验证，质量更有保障
2. **验证来源信誉**：优先选择 vercel-labs、anthropics 等知名来源的技能
3. **检查安装量**：安装量是技能质量的重要指标，低安装量的技能需谨慎
4. **按需安装**：只在需要时安装技能，避免安装过多不常用的技能影响上下文效率
5. **定期更新**：使用 `npx skills update` 保持技能为最新版本

### 技能描述编写

好的描述示例：
```
从 TypeScript 类型定义自动生成 Markdown API 文档。当用户提到 API 文档、
接口文档、API reference，或需要从代码生成文档时使用此技能，即使用户
没有明确说"API 文档"但暗示了类似需求也应触发。
```

不好的描述示例：
```
生成 API 文档
```

## 常见问题

### Q: Skill Creator 和 Find-Skill 应该什么时候用？

当你的需求可能已有社区解决方案时，先用 Find-Skill 搜索。只有在确认没有现成技能、或现有技能不满足需求时，才用 Skill Creator 从零创建。

### Q: 创建的技能保存在哪里？

技能默认保存在项目的 `.claude/skills/` 目录下。使用 `-g` 标志可以安装到用户级别（`~/.config/claude-code/skills/`），使其在所有项目中可用。

### Q: 技能触发不准确怎么办？

使用 Skill Creator 的描述优化功能。它会生成 20 个测试查询（包含应触发和不应触发的边界情况），通过多轮迭代自动优化 description 字段，提高触发准确性。

### Q: 如何评估技能质量？

Skill Creator 提供完整的评估流程：
- **定性评估**：通过可视化评审界面查看每个测试用例的输出，直接给出反馈
- **定量评估**：自动生成 benchmark.json，包含通过率、耗时、token 用量的均值和标准差
- **对比基线**：同时运行带技能和不带技能（或新旧版本）的对比实验

### Q: 搜索不到相关技能怎么办？

1. 尝试不同的关键词组合（英文效果通常更好）
2. 直接访问 skills.sh 网站按分类浏览
3. 如果确实没有现成技能，可以用 `npx skills init` 创建自己的技能
4. 也可以直接让 Claude 帮你完成任务，不一定需要技能

### Q: 技能支持哪些代理平台？

Skills CLI（`npx skills`）支持多种 AI 编码代理：Claude Code、OpenAI Codex、Gemini CLI、Cursor、Windsurf、GitHub Copilot 等。安装时会自动适配目标代理的技能目录结构。

### Q: SKILL.md 正文太长怎么办？

遵循渐进式披露原则：
- SKILL.md 正文控制在 500 行以内
- 超出部分放入 `references/` 目录，在正文中注明何时需要读取
- 大型参考文件（>300 行）添加目录索引
- 多领域支持时按变体组织（如 `references/aws.md`、`references/gcp.md`）
