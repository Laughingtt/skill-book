---
slug: git-smart-commit
name: Git Smart Commit
category: 代码维护与质量
tags: [git, commit, conventional-commits, atomic, layer]
description: 规范化智能提交技能，按架构分层自动拆分为符合Conventional Commits规范的多个原子提交
install: "复制 SKILL.md 到 .claude/skills/git-smart-commit/ 或通过 openskills 安装"
source: "https://github.com/alirezarezvani/claude-code-tresor"
---

# Git Smart Commit -- 规范化智能提交技能

## 简介

Git Smart Commit 是一款面向 Claude Code 的 AI 辅助提交技能，源自 [claude-code-tresor](https://github.com/alirezarezvani/claude-code-tresor) 项目的 `git-commit-helper` 技能。它能够自动分析你的 `git diff`，按照架构分层将多文件修改拆分为多个符合 Conventional Commits 规范的原子提交，让提交历史清晰、语义化、机器可读。

传统手动提交常常面临以下问题：

- 提交信息模糊（如 `fix stuff`、`update`）
- 多个不相关改动混合在一次提交中
- 缺乏统一格式，难以自动生成 Changelog
- 无法与语义化版本（SemVer）自动关联

Git Smart Commit 通过 AI 分析代码变更的语义，自动生成结构化提交消息，并按架构层（Config、API、UI、Database 等）将变更拆分为独立原子提交，彻底解决上述痛点。

## 核心功能

### 1. 语义化提交消息生成

自动分析 `git diff --staged` 的内容，识别变更类型并生成符合 Conventional Commits 规范的提交消息：

- **类型自动识别**：根据文件变更内容判断是 `feat`、`fix`、`refactor`、`docs` 等
- **Scope 自动推断**：根据文件路径和模块归属推断 scope（如 `auth`、`api`、`ui`）
- **描述语义化**：生成祈使语气的简洁描述，而非模糊的"fix bug"

### 2. 按架构分层原子提交

当多个文件同时修改时，自动按架构层拆分为多个独立提交：

```
同时修改了配置、数据库和前端代码
→ /smart-commit

commit 1: feat(config): add database connection pool settings
commit 2: feat(api): add user authentication endpoints
commit 3: feat(ui): add login form component
```

每个提交只包含同一架构层的变更，确保提交历史的原子性和可追溯性。

### 3. 自动暂存（Auto-Staging）

技能会自动执行 `git add` 将对应文件暂存到正确的提交中，无需手动 `git add` 每个文件。

### 4. 安全控制

通过 Claude Code 的权限系统，严格限制可执行的 Git 操作：

| 允许的操作 | 禁止的操作 |
|---|---|
| `git status` | `git push` |
| `git diff` | `git reset` |
| `git add` | `git revert` |
| `git commit` | `git clean` |
| `Read`（读取文件） | `git rebase` |
| | `git merge` |
| | `git checkout` |

禁止 `push`、`reset`、`rebase` 等危险操作，确保不会意外破坏代码仓库。

## 安装与使用

### 安装方式

**方式一：通过 openskills 安装**

```bash
openskills install alirezarezvani/claude-code-tresor
```

**方式二：手动复制**

```bash
# 创建技能目录
mkdir -p .claude/skills/git-smart-commit

# 从仓库复制 SKILL.md
cp skills/development/git-commit-helper/SKILL.md .claude/skills/git-smart-commit/
```

**方式三：通过 zsh 函数（HelgeSverre 方案）**

将以下函数添加到 `~/.zshrc`：

```bash
smart-commit() {
  local context="${1:-}"
  local prompt="Analyze git changes and create logical, atomic commits using conventional commits format."

  if [ -n "$context" ]; then
    prompt="$prompt Context: $context"
  fi

  claude "$prompt" \
    --allowedTools "Bash(git status)" \
    "Bash(git diff:)" "Bash(git add:)" \
    "Bash(git commit:)" "Read" \
    --disallowedTools "Bash(git push:)" \
    "Bash(git reset:)" "Bash(git revert:)" \
    "Bash(git clean:)" "Bash(git rebase:)" \
    "Bash(git merge:)" "Bash(git checkout:)"
}
```

然后在终端执行 `source ~/.zshrc` 使其生效。

### 使用方式

在 Claude Code 中：

- `/smart-commit` -- 触发智能提交
- `commit by layer` -- 按架构分层提交
- 直接输入 `git commit` 且未提供消息时，技能自动激活
- 询问"我的提交消息应该写什么？"时，技能自动激活

在终端中使用 zsh 函数：

```bash
# 基本用法
smart-commit

# 带上下文提示
smart-commit "完成用户认证功能"
```

## 提交消息格式

### Conventional Commits 规范

提交消息遵循 [Conventional Commits v1.0.0](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>
                                    ← 空行
<body>
                                    ← 空行
<footer>
```

各部分说明：

| 部分 | 必填 | 说明 |
|---|---|---|
| `type` | 是 | 变更类型 |
| `scope` | 否 | 影响范围，如模块名、包名 |
| `subject` | 是 | 简短描述，不超过 50 字符 |
| `body` | 否 | 详细说明变更的"是什么"和"为什么" |
| `footer` | 否 | 破坏性变更说明、Issue 关联等 |

### 提交类型（Type）

| 类型 | 说明 | SemVer 影响 |
|---|---|---|
| `feat` | 新功能 | MINOR（次版本号） |
| `fix` | 修复 Bug | PATCH（修订号） |
| `docs` | 文档变更 | 无 |
| `style` | 代码格式（不影响逻辑） | 无 |
| `refactor` | 代码重构（不修复 Bug 也不新增功能） | 无 |
| `perf` | 性能优化 | 无 |
| `test` | 测试新增或修复 | 无 |
| `build` | 构建系统或外部依赖变更 | 无 |
| `ci` | CI/CD 配置变更 | 无 |
| `chore` | 其他不涉及源码的变更 | 无 |
| `revert` | 回退之前的提交 | 无 |

包含 `BREAKING CHANGE` 或 `!` 标记的提交对应 MAJOR（主版本号）。

### Scope（范围）

Scope 用于指定提交影响的模块或区域：

```bash
# 组件名
feat(UserCard): add avatar display

# 模块名
fix(auth): resolve token expiration issue

# 包名
chore(api): update dependencies

# 区域
docs(readme): update installation guide
```

常见 scope 示例：`auth`、`api`、`ui`、`database`、`config`、`deps`、`admin`、`mobile`

### Subject（描述）规则

- 使用祈使语气："add" 而非 "added" 或 "adds"
- 首字母小写（type 之后）
- 不以句号结尾
- 不超过 50 个字符

```
# 好的示例
add user authentication
fix memory leak in component
update API documentation

# 不好的示例
added user authentication    ← 过去时
fixes bug                    ← 太模糊
Update API docs.             ← 大写开头 + 句号
```

### Body（正文）规则

- 解释"做了什么"和"为什么这样做"，而非"怎么做的"
- 每行不超过 72 个字符
- 多项变更使用列表形式

### Footer（页脚）规则

- 破坏性变更：`BREAKING CHANGE: <描述>`
- Issue 关联：`Closes #123`、`Fixes #456`
- 协作者：`Co-authored-by: name <email>`

### 完整示例

**功能新增：**

```
feat(auth): add JWT-based user authentication

- Implement login/logout functionality
- Add token management service
- Include auth guards for protected routes
- Add unit tests for auth service

Closes #42
```

**Bug 修复：**

```
fix(components): resolve memory leak in UserList

Fixed subscription not being cleaned up in useEffect,
causing memory leak when component unmounts.

Closes #156
```

**破坏性变更：**

```
feat(api)!: update user API response format

Changed response structure to include metadata
for better pagination and filtering support.

BREAKING CHANGE: User API now returns { data, metadata }
instead of direct array. Update client code accordingly.
```

**代码重构：**

```
refactor(api): extract database logic into repository pattern

Moved database queries from controllers to repository classes
for better separation of concerns and testability.

No functional changes or API modifications.
```

**性能优化：**

```
perf(queries): optimize user data fetching

- Implement query batching to eliminate N+1 queries
- Add database indices on frequently queried columns
- Cache user profile data with 5-minute TTL

Performance improvement: 80ms -> 12ms average response time
```

## 工作流集成

### 与 Husky + Commitlint 集成

Husky 提供 Git Hooks，Commitlint 校验提交消息格式，两者配合可以在本地强制执行 Conventional Commits 规范：

```bash
# 安装依赖
npm install -D @commitlint/cli @commitlint/config-conventional husky

# 初始化 Husky
npx husky init

# 添加 commit-msg 钩子
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

创建 `commitlint.config.js`：

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 50],
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'perf', 'test', 'build', 'ci', 'chore'
    ]]
  }
}
```

### 与 Semantic Release 集成

Semantic Release 根据 Conventional Commits 自动决定版本号、生成 Changelog 并发布：

```bash
npm install -D semantic-release @semantic-release/changelog @semantic-release/git
```

版本号自动推导规则：

| 提交类型 | 版本变更 |
|---|---|
| `feat:` | MINOR（1.1.0 -> 1.2.0） |
| `fix:` | PATCH（1.1.0 -> 1.1.1） |
| `feat!:` 或 `BREAKING CHANGE` | MAJOR（1.1.0 -> 2.0.0） |

### 与 CI/CD 集成

在 GitHub Actions 中校验提交消息：

```yaml
name: CI
on: [push, pull_request]

jobs:
  commitlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      - run: npm install -D @commitlint/cli @commitlint/config-conventional
      - run: npx commitlint --from ${{ github.event.pull_request.base.sha }} --to ${{ github.sha }}
```

### 与 Pre-commit Hook 集成

Git Smart Commit 可以与 `prepare-commit-msg` 钩子配合：

```bash
#!/bin/sh
# .git/hooks/prepare-commit-msg

# 如果没有提供提交消息，让技能自动建议
if [ -z "$2" ]; then
  echo "# Suggested commit message (edit as needed)" > "$1"
fi
```

### 与代码审查集成

Git Smart Commit 可与 Tresor 中的 `code-reviewer` 技能和 `/review` 命令联动：

```bash
# 1. 编写代码
# 2. code-reviewer 标记问题
# 3. 修复问题
# 4. 暂存变更
# 5. git-commit-helper 生成提交消息
git commit  # 使用建议的消息
```

## 配置选项

### 自定义提交类型

编辑 SKILL.md 添加团队特定类型：

```yaml
deploy: 部署相关
migrate: 数据库迁移
hotfix: 生产环境热修复
wip: 开发中（Work In Progress）
```

### 自定义 Scope

配置技能识别你的项目结构：

```yaml
Common scopes: auth, api, ui, database, admin, mobile, payment, notification
```

### 自定义消息模板

定制团队的消息格式：

```bash
# 标准格式
feat(scope): subject

# 自定义格式（含 JIRA 编号）
[JIRA-123] feat(scope): subject
```

### 沙箱配置

如需网络访问（如获取 GitHub Issue 详情）：

```json
{
  "network": {
    "allowedDomains": [
      "api.github.com"
    ]
  }
}
```

## 最佳实践

### 1. 保持原子性提交

每次提交只包含一个逻辑变更。如果修改了多个不相关的文件，使用 `/smart-commit` 按架构层拆分：

```
# 不好的做法：所有变更混在一起
git add .
git commit -m "update stuff"

# 好的做法：按层拆分
/smart-commit
→ feat(config): add database connection pool settings
→ feat(api): add user authentication endpoints
→ feat(ui): add login form component
```

### 2. 使用祈使语气

提交描述应当以祈使语气书写，想象它在完成这句话："This commit will..."

```
# 好的做法
add user authentication
fix memory leak in component

# 不好的做法
added user authentication    ← 过去时
fixes bug                    ← 第三人称
```

### 3. 描述"是什么"和"为什么"

Body 应该解释变更的动机和影响，而非实现细节：

```
# 好的做法
feat(auth): implement rate limiting on login endpoint

Prevent brute force attacks by limiting login attempts
to 5 per minute per IP address.

# 不好的做法
feat(auth): implement rate limiting on login endpoint

Added a HashMap to store IP addresses and timestamps,
then check if count exceeds threshold.
```

### 4. 始终关联 Issue

在 Footer 中引用相关 Issue，保持可追溯性：

```
Closes #42
Fixes #156
Refs JIRA-789
```

### 5. 标记破坏性变更

任何不向后兼容的变更必须标记：

```
# 使用 ! 标记
feat(api)!: change user endpoint response format

# 或在 Footer 中说明
BREAKING CHANGE: User API now returns { data, metadata }
instead of direct array.
```

### 6. 提交前审查

在让技能生成提交消息之前，先检查暂存内容：

```bash
git diff --staged --name-only   # 查看变更文件列表
git diff --staged               # 查看详细变更
```

### 7. 修正不当提交消息

如果提交消息不够好，可以使用 `--amend` 修正：

```bash
# 提交了不好的消息
git commit -m "fix stuff"

# 让技能重新生成
git commit --amend
```

### 常见模式速查

**前端变更：**

```
feat(ui): add responsive navigation menu
fix(components): resolve prop validation warning
style(css): update button hover effects
```

**后端变更：**

```
feat(api): add user pagination endpoint
fix(database): resolve connection pool exhaustion
perf(queries): add database indices for user lookups
```

**基础设施变更：**

```
ci: add automated deployment pipeline
build: update dependencies to latest versions
chore(docker): optimize container image size
```

## 常见问题

### Q: 技能没有被自动触发怎么办？

在 `CLAUDE.md` 中添加指令，确保技能在提交时被加载：

```markdown
## 提交规范
执行 git commit 时，加载 git-smart-commit 技能生成 Conventional Commits 格式的提交消息。
```

或者使用 Claude Code 的 Hook 机制，在检测到 git commit 命令时自动注入提示。

### Q: 多文件修改时如何确保正确拆分？

技能会按以下规则分析变更：

1. 执行 `git diff --staged --name-only` 查看变更文件列表
2. 执行 `git diff --staged` 查看详细变更内容
3. 按文件路径和变更语义分类（新文件 -> feat，修改文件 -> fix/refactor/feat，删除文件 -> chore/refactor，测试文件 -> test，文档 -> docs）
4. 分析变更内容：改了什么、为什么改、影响范围、是否有破坏性变更
5. 按架构层分组，生成多个原子提交

### Q: 如何与现有 commitlint 配置兼容？

Git Smart Commit 生成的消息天然符合 `@commitlint/config-conventional` 规则。如果你有自定义规则，可以在 SKILL.md 中配置对应的类型和格式，确保生成消息通过校验。

### Q: 技能会执行 git push 吗？

不会。技能的权限被严格限制，禁止执行 `push`、`reset`、`revert`、`clean`、`rebase`、`merge`、`checkout` 等危险操作。所有提交仅在本地创建，需要你手动 push。

### Q: 如何处理已经提交但消息不规范的历史记录？

可以使用 `git rebase -i` 配合 `reword` 命令修改历史提交消息，然后再让技能重新生成。但请注意，rebase 会改写历史，不要在已推送的分支上操作。

### Q: 支持非 JavaScript 项目吗？

支持。Git Smart Commit 基于 Git 操作，与编程语言无关。无论是 Python、Go、Rust 还是 Java 项目，只要使用 Git 进行版本控制，都可以使用此技能。

### Q: 如何在 monorepo 中使用？

在 monorepo 中，scope 可以用来标识包名或模块名：

```
feat(auth-service): add OAuth2 support
fix(payment-gateway): resolve timeout issue
docs(api-gateway): update endpoint documentation
```

建议在 SKILL.md 中配置你的 monorepo 包结构，以便技能更准确地推断 scope。
