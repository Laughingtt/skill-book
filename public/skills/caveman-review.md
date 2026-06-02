---
slug: caveman-review
name: Caveman Review
category: 代码维护与质量
tags: [review, compress, communication, token-optimization, caveman]
description: 压缩通信模式代码审查，减少~75%token用量同时保持完整技术准确性
install: "npx skills add https://github.com/juliusbrussee/caveman --skill caveman"
source: "https://www.skills.sh/juliusbrussee/caveman/caveman"
---

# Caveman Review

Caveman超压缩通信技能，以"穴居人"风格表达技术内容，减少约75%token用量同时保持完整技术准确性。

## 简介

Caveman是由19岁开发者Julius Brussee创建的Claude Code技能，核心理念是"why use many token when few token do trick"（为何用多词，少词足矣）。它通过让AI以"穴居人"风格回复，大幅削减输出token消耗。

### 为什么Token优化对AI编程至关重要

在使用Claude Code等AI编程助手时，token消耗直接影响：

- **成本控制**：API调用按token计费，减少75%输出token意味着显著成本节省
- **上下文窗口**：长对话会快速消耗上下文限制，压缩输出延长有效对话轮次
- **响应速度**：更少的输出token意味着更快的响应时间
- **会话持久性**：在复杂代码审查任务中，节省的token可用于更多轮次的分析

实际测试数据显示，Caveman可减少约65-75%的输出token，同时保持100%技术准确性。

## 压缩原理

Caveman的压缩不是简单的"少说话"，而是一套系统性的语言压缩规则：

### 核心压缩规则

| 压缩类型 | 删除内容 | 示例 |
|---------|---------|------|
| 冠词 | a, an, the | "the component" → "component" |
| 填充词 | just, really, basically, actually, simply | "basically just" → (删除) |
| 客套话 | sure, certainly, of course, happy to | "Sure, I can help" → (删除) |
| 犹豫词 | perhaps, maybe, I think, might want to | "you might want to" → (直接建议) |
| 冗余解释 | 重复描述已知信息 | 只保留关键信息 |

### 与"简洁"的本质区别

普通"简洁"模式只是缩短句子，Caveman则采用结构化压缩：

**普通简洁模式**：
```
Your component re-renders because you create a new object reference each render.
Use useMemo to fix this.
```

**Caveman模式**：
```
New object ref each render. Inline object prop = new ref = re-render. useMemo.
```

Caveman使用因果链式表达（A = B = C），删除所有过渡词，保留技术核心。

## 三种压缩强度详解

### Lite（轻量级）

删除填充词和客套话，保持完整句子结构。

**BEFORE（正常模式，69 tokens）**：
```
The reason your React component is re-rendering is likely because you're creating
a new object reference on each render cycle. I'd recommend using useMemo to
memoize the object.
```

**AFTER - Lite（约45 tokens）**：
```
Your component re-renders because you create a new object reference each render.
Wrap it in useMemo.
```

### Full（完整模式，默认）

标准Caveman风格，使用碎片化表达和因果链。

**AFTER - Full（19 tokens）**：
```
New object ref each render. Inline object prop = new ref = re-render. Wrap in useMemo.
```

### Ultra（极限模式）

电报式表达，最大化压缩，适合快速扫描。

**AFTER - Ultra（约12 tokens）**：
```
Inline obj prop → new ref → re-render. useMemo.
```

### 强度对比表

| 强度 | Token节省 | 可读性 | 适用场景 |
|-----|----------|-------|---------|
| Lite | ~35% | 高 | 团队协作、需要解释背景 |
| Full | ~65% | 中 | 日常开发、代码审查 |
| Ultra | ~75% | 低 | 快速迭代、个人项目 |

## 文言文模式

文言文（Wenyan）是Caveman独有的中文压缩模式，利用古汉语天然的简洁特性实现更高效的压缩。

### 文言文压缩原理

古汉语具有以下token优化特性：
- 单字词为主，无冠词和填充词
- 语法结构紧凑，省略主语常见
- 文言虚词（之、乎、者、也）token效率高

### Wenyan-lite（文言轻量）

保留部分现代表达，适度压缩。

**现代中文**：
```
你的组件频繁重绘是因为每次渲染都创建新的对象引用。建议用useMemo包装。
```

**Wenyan-lite**：
```
組件頻重繪，以每繪新生對象參照故。以 useMemo 包之。
```

### Wenyan-full（文言完整）

标准文言风格，最大化古典简洁。

**Wenyan-full**：
```
物出新參照，致重繪。useMemo Wrap之。
```

### Wenyan-ultra（文言极限）

极致压缩，保留技术术语。

**Wenyan-ultra**：
```
新參照→重繪。useMemo Wrap。
```

### 数据库连接池示例

**问题**：解释数据库连接池

| 模式 | 输出 |
|-----|------|
| Lite | Connection pooling reuses open connections instead of creating new ones per request. Avoids repeated handshake overhead. |
| Full | Pool reuse open DB connections. No new connection per request. Skip handshake overhead. |
| Ultra | Pool = reuse DB conn. Skip handshake → fast under load. |
| Wenyan-full | 池reuse open connection。不每req新開。skip handshake overhead。 |
| Wenyan-ultra | 池reuse conn。skip handshake → fast。 |

## 使用方法

### 安装

```bash
# Claude Code
claude plugin marketplace add JuliusBrussee/caveman && claude plugin install caveman@caveman

# Codex CLI
codex plugins add JuliusBrussee/caveman

# Gemini CLI
gemini extensions install https://github.com/JuliusBrussee/caveman

# Cursor / Windsurf / Cline / Copilot
npx skills add JuliusBrussee/caveman -a cursor
npx skills add JuliusBrussee/caveman -a windsurf
npx skills add JuliusBrussee/caveman -a cline
npx skills add JuliusBrussee/caveman -a github-copilot

# 通用安装
npx skills add https://github.com/juliusbrussee/caveman --skill caveman
```

### 基本命令

```bash
# 激活Caveman模式
/caveman              # 默认full强度
/caveman lite         # 轻量级
/caveman full         # 完整模式
/caveman ultra        # 极限模式
/caveman wenyan       # 文言文模式
/caveman wenyan-lite  # 文言轻量
/caveman wenyan-full  # 文言完整
/caveman wenyan-ultra # 文言极限

# 关闭Caveman
stop caveman
normal mode
```

### 代码审查专用命令

```bash
# 压缩式代码审查
/caveman-review       # 审查当前diff

# 压缩式提交信息
/caveman-commit       # 生成简洁commit message（≤50字符标题，why over what）

# 查看token节省统计
/caveman-stats        # 当前会话统计
/caveman-stats --share # 生成可分享的统计行
```

### 压缩记忆文件

```bash
# 压缩CLAUDE.md等记忆文件，减少~46%输入token
# 代码/URL/路径保持原样，仅压缩自然语言部分
/caveman-compress CLAUDE.md
/caveman-compress TODO.md
```

## 实际代码审查示例

### 场景：审查一个认证中间件bug

**正常模式审查（约150 tokens）**：
```
I've reviewed the authentication middleware and found a potential bug. On line 42,
the token expiry check is using a less-than operator (`<`) instead of less-than-or-equal
(`<=`). This means tokens that expire exactly at the current timestamp will still be
considered valid, which could be a security issue.

The fix is straightforward - just change the `<` to `<=` on line 42. This ensures
that tokens expiring at the exact moment of the check are properly rejected.

Would you like me to make this change for you?
```

**Caveman Full模式审查（约35 tokens）**：
```
Bug in auth middleware. Token expiry check use `<` not `<=`. Fix:

L42: `<` → `<=`

Same fix. 75% less word. Brain still big.
```

**Caveman Ultra模式审查（约20 tokens）**：
```
L42: 🔴 bug: `<` should be `<=`. Token expiry bypass.
```

### Token对比统计

| 审查场景 | 正常模式 | Caveman Full | Caveman Ultra | 节省率 |
|---------|---------|-------------|---------------|-------|
| 单文件bug修复 | 150 | 35 | 20 | 77-87% |
| PR多文件审查 | 500 | 120 | 80 | 76-84% |
| 架构建议 | 800 | 200 | N/A | 75% |
| 安全漏洞报告 | 600 | 150 | N/A | 75% |

### 代码审查输出格式

Caveman Review使用标准化一行式输出：

```
L<行号>: <emoji> <severity>: <problem>. <fix>.
```

**严重程度标记**：
- `🔴 bug:` - 破坏性行为，会导致事故
- `🟡 risk:` - 可运行但脆弱（竞态、缺少null检查、吞掉错误）
- `🔵 nit:` - 风格、命名、微优化（作者可忽略）
- `❓ q:` - 真正的问题，非建议

**示例输出**：
```
L23: 🟡 risk: no retry on 429. Wrap in withBackoff(3).
L45: 🔴 bug: user null. Add guard.
L102: 🔵 nit: var → const. Never reassigned.
L78: ❓ q: why sync instead of async here?
```

**禁止出现的模式**：
```
❌ "I noticed that..." / "It seems like..." / "You might want to consider..."
❌ "This is just a suggestion but..." — 用 nit: 代替
❌ "Great work!" / "Looks good overall but..." — 最多开头说一次
❌ 重述代码做了什么 — 审查者能读diff
❌ 犹豫词（"perhaps", "maybe", "I think"）— 不确定用 q:
```

## 最佳实践

### 适用场景

- **代码审查**：快速定位问题，减少沟通噪音
- **大规模重构**：长对话中节省token用于更多分析
- **个人项目**：快速迭代，最大化效率
- **团队协作**：配合`/caveman-stats`展示节省效果

### 不适用场景

- **新功能设计**：需要完整上下文和解释
- **新文件创建**：需要详细代码和注释
- **跨文件重构**：需要架构说明
- **安全漏洞报告**：需要完整解释和CVE参考
- **新人指导**：需要详细"为什么"解释

### 强度选择建议

```
快速迭代/个人项目 → Ultra
日常开发/代码审查 → Full
团队协作/需要背景 → Lite
中文环境 → Wenyan-full
```

### 配合其他工具

```bash
# cavecrew子代理：比vanilla模式节省~60% token
# cavecrew-investigator: 定位代码
# cavecrew-builder: 1-2文件编辑
# cavecrew-reviewer: diff审查

# MCP中间件：压缩MCP工具描述
caveman-shrink
```

## 注意事项

### 何时退出Caveman模式

遇到以下情况应切换回正常模式：

1. **安全发现**：CVE级别漏洞需要完整解释和参考
2. **架构分歧**：需要理由而非一行建议
3. **新人指导**：作者需要理解"为什么"
4. **复杂多步骤**：需要详细操作说明

使用 `stop caveman` 或 `normal mode` 退出。

### Token节省的实际范围

Caveman主要压缩**输出token**，对以下部分无影响：

- 系统提示词（约2K tokens）
- 输入上下文（代码、文件内容）
- 模型内部推理（reasoning models）

实际节省取决于输出/输入比例。典型代码审查场景中，输出约占30-40%总token，因此总体节省约20-30%。在长对话中效果更显著，因为累积的输出token比例更高。

### 与Reasoning模型的交互

对于Claude 4等具有扩展思考能力的模型，Caveman只压缩可见输出，不压缩内部推理过程。如需进一步优化：

- 设置effort level限制推理深度
- 定期总结旧对话轮次
- 在检索上下文前进行裁剪

### 状态栏显示

安装后Claude Code会显示节省统计：

```
[CAVEMAN] ⛏ 12.4k
```

可通过环境变量控制：

```bash
export CAVEMAN_STATUSLINE_SAVINGS=0  # 关闭显示
```

## 相关资源

- [GitHub仓库](https://github.com/JuliusBrussee/caveman)
- [SKILL.md源文件](https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md)
- [安装文档](https://github.com/JuliusBrussee/caveman/blob/main/INSTALL.md)
- [Token优化分析](https://bartoszgaca.pl/en/news/claude-code-token-optimization-caveman-2026-en)
