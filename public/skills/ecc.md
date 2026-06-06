---
slug: ecc
name: ECC
category: 编码开发与工程规范
tags:
  - AI编码助手
  - 多编辑器配置
  - 开发规范
  - 自动化配置
description: >-
  ECC 是一个通用的 AI 编码助手配置管理中心，为 Claude、Cursor、VS Code、Gemini 等多种编辑器提供统一的
  agents、commands、rules 与 skills 预设，帮助开发团队快速对齐编码规范和工程实践。
install: >-
  git clone https://github.com/affaan-m/ECC.git && cd ECC && bash install.sh 
  (Linux/Mac) 或  .\install.ps1 (Windows)
source: 'https://github.com/affaan-m/ECC'
---
## 如何使用本 Skill

### 适用场景
- 需要跨不同 AI 编辑器维持一致的编码风格和项目规范
- 快速为新项目或团队统一集成 AI 辅助开发环境
- 希望通过预设的 commands、rules、skills 提升日常开发效率

### 基本用法
1. 克隆仓库至本地
2. 根据你的操作系统执行 `install.sh` 或 `install.ps1` 进行初始化
3. 在你的 AI 编辑器（如 VS Code、Cursor、Claude 等）的对应配置目录中引用本项目的 `.agents`、`.rules`、`commands` 等内容
4. 按需调整 `.env` 文件以适配你的环境

### 关键配置
- `.env` / `.env.example`：环境变量配置，用于连接各类 API
- `agent.yaml`：主智能体定义，可控制行为与权限
- `commands/`、`rules/`、`skills/`：可按编辑器或项目需求选择性启用或自定义
- 各编辑器专属目录（`.vscode/`、`.cursor/`、`.claude/` 等）提供开箱即用的集成

### 注意事项
- 不同编辑器的配置目录需手动或通过脚本链接，确保路径正确
- 修改公共配置前建议先备份，或利用 Git 分支管理个人/团队定制
- 部分功能依赖对应的 AI 编辑器插件或扩展，请提前安装

---

## Navigation Menu

# Search code, repositories, users, issues, pull requests...

# Provide feedback

We read every piece of feedback, and take your input very seriously.

# Saved searches

## Use saved searches to filter your results more quickly

To see all available qualifiers, see our [documentation](https://docs.github.com/search-github/github-code-search/understanding-github-code-search-syntax).

### Uh oh!

There was an error while loading. Please reload this page.

There was an error while loading. Please reload this page.

# affaan-m/ECC

## Folders and files

| Name | | Name | Last commit message | Last commit date |
| --- | --- | --- | --- | --- |
| Latest commit   History[1,999 Commits](/affaan-m/ECC/commits/main/)   1,999 Commits | | |
| [.agents](/affaan-m/ECC/tree/main/.agents ".agents") | | [.agents](/affaan-m/ECC/tree/main/.agents ".agents") |  |  |
| [.claude-plugin](/affaan-m/ECC/tree/main/.claude-plugin ".claude-plugin") | | [.claude-plugin](/affaan-m/ECC/tree/main/.claude-plugin ".claude-plugin") |  |  |
| [.claude](/affaan-m/ECC/tree/main/.claude ".claude") | | [.claude](/affaan-m/ECC/tree/main/.claude ".claude") |  |  |
| [.codebuddy](/affaan-m/ECC/tree/main/.codebuddy ".codebuddy") | | [.codebuddy](/affaan-m/ECC/tree/main/.codebuddy ".codebuddy") |  |  |
| [.codex-plugin](/affaan-m/ECC/tree/main/.codex-plugin ".codex-plugin") | | [.codex-plugin](/affaan-m/ECC/tree/main/.codex-plugin ".codex-plugin") |  |  |
| [.codex](/affaan-m/ECC/tree/main/.codex ".codex") | | [.codex](/affaan-m/ECC/tree/main/.codex ".codex") |  |  |
| [.cursor](/affaan-m/ECC/tree/main/.cursor ".cursor") | | [.cursor](/affaan-m/ECC/tree/main/.cursor ".cursor") |  |  |
| [.gemini](/affaan-m/ECC/tree/main/.gemini ".gemini") | | [.gemini](/affaan-m/ECC/tree/main/.gemini ".gemini") |  |  |
| [.github](/affaan-m/ECC/tree/main/.github ".github") | | [.github](/affaan-m/ECC/tree/main/.github ".github") |  |  |
| [.kiro](/affaan-m/ECC/tree/main/.kiro ".kiro") | | [.kiro](/affaan-m/ECC/tree/main/.kiro ".kiro") |  |  |
| [.opencode](/affaan-m/ECC/tree/main/.opencode ".opencode") | | [.opencode](/affaan-m/ECC/tree/main/.opencode ".opencode") |  |  |
| [.qwen](/affaan-m/ECC/tree/main/.qwen ".qwen") | | [.qwen](/affaan-m/ECC/tree/main/.qwen ".qwen") |  |  |
| [.trae](/affaan-m/ECC/tree/main/.trae ".trae") | | [.trae](/affaan-m/ECC/tree/main/.trae ".trae") |  |  |
| [.vscode](/affaan-m/ECC/tree/main/.vscode ".vscode") | | [.vscode](/affaan-m/ECC/tree/main/.vscode ".vscode") |  |  |
| [.zed](/affaan-m/ECC/tree/main/.zed ".zed") | | [.zed](/affaan-m/ECC/tree/main/.zed ".zed") |  |  |
| [agents](/affaan-m/ECC/tree/main/agents "agents") | | [agents](/affaan-m/ECC/tree/main/agents "agents") |  |  |
| [assets](/affaan-m/ECC/tree/main/assets "assets") | | [assets](/affaan-m/ECC/tree/main/assets "assets") |  |  |
| [commands](/affaan-m/ECC/tree/main/commands "commands") | | [commands](/affaan-m/ECC/tree/main/commands "commands") |  |  |
| [config](/affaan-m/ECC/tree/main/config "config") | | [config](/affaan-m/ECC/tree/main/config "config") |  |  |
| [contexts](/affaan-m/ECC/tree/main/contexts "contexts") | | [contexts](/affaan-m/ECC/tree/main/contexts "contexts") |  |  |
| [docs](/affaan-m/ECC/tree/main/docs "docs") | | [docs](/affaan-m/ECC/tree/main/docs "docs") |  |  |
| [ecc2](/affaan-m/ECC/tree/main/ecc2 "ecc2") | | [ecc2](/affaan-m/ECC/tree/main/ecc2 "ecc2") |  |  |
| [examples](/affaan-m/ECC/tree/main/examples "examples") | | [examples](/affaan-m/ECC/tree/main/examples "examples") |  |  |
| [hooks](/affaan-m/ECC/tree/main/hooks "hooks") | | [hooks](/affaan-m/ECC/tree/main/hooks "hooks") |  |  |
| [integrations/aura](/affaan-m/ECC/tree/main/integrations/aura "This path skips through empty directories") | | [integrations/aura](/affaan-m/ECC/tree/main/integrations/aura "This path skips through empty directories") |  |  |
| [legacy-command-shims](/affaan-m/ECC/tree/main/legacy-command-shims "legacy-command-shims") | | [legacy-command-shims](/affaan-m/ECC/tree/main/legacy-command-shims "legacy-command-shims") |  |  |
| [manifests](/affaan-m/ECC/tree/main/manifests "manifests") | | [manifests](/affaan-m/ECC/tree/main/manifests "manifests") |  |  |
| [mcp-configs](/affaan-m/ECC/tree/main/mcp-configs "mcp-configs") | | [mcp-configs](/affaan-m/ECC/tree/main/mcp-configs "mcp-configs") |  |  |
| [plugins](/affaan-m/ECC/tree/main/plugins "plugins") | | [plugins](/affaan-m/ECC/tree/main/plugins "plugins") |  |  |
| [research](/affaan-m/ECC/tree/main/research "research") | | [research](/affaan-m/ECC/tree/main/research "research") |  |  |
| [rules](/affaan-m/ECC/tree/main/rules "rules") | | [rules](/affaan-m/ECC/tree/main/rules "rules") |  |  |
| [schemas](/affaan-m/ECC/tree/main/schemas "schemas") | | [schemas](/affaan-m/ECC/tree/main/schemas "schemas") |  |  |
| [scripts](/affaan-m/ECC/tree/main/scripts "scripts") | | [scripts](/affaan-m/ECC/tree/main/scripts "scripts") |  |  |
| [skills](/affaan-m/ECC/tree/main/skills "skills") | | [skills](/affaan-m/ECC/tree/main/skills "skills") |  |  |
| [src/llm](/affaan-m/ECC/tree/main/src/llm "This path skips through empty directories") | | [src/llm](/affaan-m/ECC/tree/main/src/llm "This path skips through empty directories") |  |  |
| [tests](/affaan-m/ECC/tree/main/tests "tests") | | [tests](/affaan-m/ECC/tree/main/tests "tests") |  |  |
| [.env.example](/affaan-m/ECC/blob/main/.env.example ".env.example") | | [.env.example](/affaan-m/ECC/blob/main/.env.example ".env.example") |  |  |
| [.gitignore](/affaan-m/ECC/blob/main/.gitignore ".gitignore") | | [.gitignore](/affaan-m/ECC/blob/main/.gitignore ".gitignore") |  |  |
| [.markdownlint.json](/affaan-m/ECC/blob/main/.markdownlint.json ".markdownlint.json") | | [.markdownlint.json](/affaan-m/ECC/blob/main/.markdownlint.json ".markdownlint.json") |  |  |
| [.mcp.json](/affaan-m/ECC/blob/main/.mcp.json ".mcp.json") | | [.mcp.json](/affaan-m/ECC/blob/main/.mcp.json ".mcp.json") |  |  |
| [.npmignore](/affaan-m/ECC/blob/main/.npmignore ".npmignore") | | [.npmignore](/affaan-m/ECC/blob/main/.npmignore ".npmignore") |  |  |
| [.prettierrc](/affaan-m/ECC/blob/main/.prettierrc ".prettierrc") | | [.prettierrc](/affaan-m/ECC/blob/main/.prettierrc ".prettierrc") |  |  |
| [.tool-versions](/affaan-m/ECC/blob/main/.tool-versions ".tool-versions") | | [.tool-versions](/affaan-m/ECC/blob/main/.tool-versions ".tool-versions") |  |  |
| [.yarnrc.yml](/affaan-m/ECC/blob/main/.yarnrc.yml ".yarnrc.yml") | | [.yarnrc.yml](/affaan-m/ECC/blob/main/.yarnrc.yml ".yarnrc.yml") |  |  |
| [AGENTS.md](/affaan-m/ECC/blob/main/AGENTS.md "AGENTS.md") | | [AGENTS.md](/affaan-m/ECC/blob/main/AGENTS.md "AGENTS.md") |  |  |
| [CHANGELOG.md](/affaan-m/ECC/blob/main/CHANGELOG.md "CHANGELOG.md") | | [CHANGELOG.md](/affaan-m/ECC/blob/main/CHANGELOG.md "CHANGELOG.md") |  |  |
| [CLAUDE.md](/affaan-m/ECC/blob/main/CLAUDE.md "CLAUDE.md") | | [CLAUDE.md](/affaan-m/ECC/blob/main/CLAUDE.md "CLAUDE.md") |  |  |
| [CODE\_OF\_CONDUCT.md](/affaan-m/ECC/blob/main/CODE_OF_CONDUCT.md "CODE_OF_CONDUCT.md") | | [CODE\_OF\_CONDUCT.md](/affaan-m/ECC/blob/main/CODE_OF_CONDUCT.md "CODE_OF_CONDUCT.md") |  |  |
| [COMMANDS-QUICK-REF.md](/affaan-m/ECC/blob/main/COMMANDS-QUICK-REF.md "COMMANDS-QUICK-REF.md") | | [COMMANDS-QUICK-REF.md](/affaan-m/ECC/blob/main/COMMANDS-QUICK-REF.md "COMMANDS-QUICK-REF.md") |  |  |
| [CONTRIBUTING.md](/affaan-m/ECC/blob/main/CONTRIBUTING.md "CONTRIBUTING.md") | | [CONTRIBUTING.md](/affaan-m/ECC/blob/main/CONTRIBUTING.md "CONTRIBUTING.md") |  |  |
| [EVALUATION.md](/affaan-m/ECC/blob/main/EVALUATION.md "EVALUATION.md") | | [EVALUATION.md](/affaan-m/ECC/blob/main/EVALUATION.md "EVALUATION.md") |  |  |
| [LICENSE](/affaan-m/ECC/blob/main/LICENSE "LICENSE") | | [LICENSE](/affaan-m/ECC/blob/main/LICENSE "LICENSE") |  |  |
| [README.md](/affaan-m/ECC/blob/main/README.md "README.md") | | [README.md](/affaan-m/ECC/blob/main/README.md "README.md") |  |  |
| [README.zh-CN.md](/affaan-m/ECC/blob/main/README.zh-CN.md "README.zh-CN.md") | | [README.zh-CN.md](/affaan-m/ECC/blob/main/README.zh-CN.md "README.zh-CN.md") |  |  |
| [REPO-ASSESSMENT.md](/affaan-m/ECC/blob/main/REPO-ASSESSMENT.md "REPO-ASSESSMENT.md") | | [REPO-ASSESSMENT.md](/affaan-m/ECC/blob/main/REPO-ASSESSMENT.md "REPO-ASSESSMENT.md") |  |  |
| [RULES.md](/affaan-m/ECC/blob/main/RULES.md "RULES.md") | | [RULES.md](/affaan-m/ECC/blob/main/RULES.md "RULES.md") |  |  |
| [SECURITY.md](/affaan-m/ECC/blob/main/SECURITY.md "SECURITY.md") | | [SECURITY.md](/affaan-m/ECC/blob/main/SECURITY.md "SECURITY.md") |  |  |
| [SOUL.md](/affaan-m/ECC/blob/main/SOUL.md "SOUL.md") | | [SOUL.md](/affaan-m/ECC/blob/main/SOUL.md "SOUL.md") |  |  |
| [SPONSORING.md](/affaan-m/ECC/blob/main/SPONSORING.md "SPONSORING.md") | | [SPONSORING.md](/affaan-m/ECC/blob/main/SPONSORING.md "SPONSORING.md") |  |  |
| [SPONSORS.md](/affaan-m/ECC/blob/main/SPONSORS.md "SPONSORS.md") | | [SPONSORS.md](/affaan-m/ECC/blob/main/SPONSORS.md "SPONSORS.md") |  |  |
| [TROUBLESHOOTING.md](/affaan-m/ECC/blob/main/TROUBLESHOOTING.md "TROUBLESHOOTING.md") | | [TROUBLESHOOTING.md](/affaan-m/ECC/blob/main/TROUBLESHOOTING.md "TROUBLESHOOTING.md") |  |  |
| [VERSION](/affaan-m/ECC/blob/main/VERSION "VERSION") | | [VERSION](/affaan-m/ECC/blob/main/VERSION "VERSION") |  |  |
| [WORKING-CONTEXT.md](/affaan-m/ECC/blob/main/WORKING-CONTEXT.md "WORKING-CONTEXT.md") | | [WORKING-CONTEXT.md](/affaan-m/ECC/blob/main/WORKING-CONTEXT.md "WORKING-CONTEXT.md") |  |  |
| [agent.yaml](/affaan-m/ECC/blob/main/agent.yaml "agent.yaml") | | [agent.yaml](/affaan-m/ECC/blob/main/agent.yaml "agent.yaml") |  |  |
| [commitlint.config.js](/affaan-m/ECC/blob/main/commitlint.config.js "commitlint.config.js") | | [commitlint.config.js](/affaan-m/ECC/blob/main/commitlint.config.js "commitlint.config.js") |  |  |
| [ecc\_dashboard.py](/affaan-m/ECC/blob/main/ecc_dashboard.py "ecc_dashboard.py") | | [ecc\_dashboard.py](/affaan-m/ECC/blob/main/ecc_dashboard.py "ecc_dashboard.py") |  |  |
| [eslint.config.js](/affaan-m/ECC/blob/main/eslint.config.js "eslint.config.js") | | [eslint.config.js](/affaan-m/ECC/blob/main/eslint.config.js "eslint.config.js") |  |  |
| [install.ps1](/affaan-m/ECC/blob/main/install.ps1 "install.ps1") | | [install.ps1](/affaan-m/ECC/blob/main/install.ps1 "install.ps1") |  |  |
| [install.sh](/affaan-m/ECC/blob/main/install.sh "install.sh") | | [install.sh](/affaan-m/ECC/blob/main/install.sh "install.sh") |  |  |
| [package-lock.json](/affaan-m/ECC/blob/main/package-lock.json "package-lock.json") | | [package-lock.json](/affaan-m/ECC/blob/main/package-lock.json "package-lock.json") |  |  |
| [package.json](/affaan-m/ECC/blob/main/package.json "package.json") | | [package.json](/affaan-m/ECC/blob/main/package.json "package.json") |  |  |
| [pyproject.toml](/affaan-m/ECC/blob/main/pyproject.toml "pyproject.toml") | | [pyproject.toml](/affaan-m/ECC/blob/main/pyproject.toml "pyproject.toml") |  |  |
| [the-longform-guide.md](/affaan-m/ECC/blob/main/the-longform-guide.md "the-longform-guide.md") | | [the-longform-guide.md](/affaan-m/ECC/blob/main/the-longform-guide.md "the-longform-guide.md") |  |  |
| [the-security-guide.md](/affaan-m/ECC/blob/main/the-security-guide.md "the-security-guide.md") | | [the-security-guide.md](/affaan-m/ECC/blob/main/the-security-guide.md "the-security-guide.md") |  |  |
| [the-shortform-guide.md](/affaan-m/ECC/blob/main/the-shortform-guide.md "the-shortform-guide.md") | | [the-shortform-guide.md](/affaan-m/ECC/blob/main/the-shortform-guide.md "the-shortform-guide.md") |  |  |
| [yarn.lock](/affaan-m/ECC/blob/main/yarn.lock "yarn.lock") | | [yarn.lock](/affaan-m/ECC/blob/main/yarn.lock "yarn.lock") |  |  |
| View all files | | |

## Latest commit

## History

## Repository files navigation

**Language:** English | [Português (Brasil)](/affaan-m/ECC/blob/main/docs/pt-BR/README.md) | [简体中文](/affaan-m/ECC/blob/main/README.zh-CN.md) | [繁體中文](/affaan-m/ECC/blob/main/docs/zh-TW/README.md) | [日本語](/affaan-m/ECC/blob/main/docs/ja-JP/README.md) | [한국어](/affaan-m/ECC/blob/main/docs/ko-KR/README.md) | [Türkçe](/affaan-m/ECC/blob/main/docs/tr/README.md) | [Русский](/affaan-m/ECC/blob/main/docs/ru/README.md) | [Tiếng Việt](/affaan-m/ECC/blob/main/docs/vi-VN/README.md) | [ไทย](/affaan-m/ECC/blob/main/docs/th/README.md) | [Deutsch](/affaan-m/ECC/blob/main/docs/de-DE/README.md)

# ECC

[![ECC - the harness-native operator system for agentic work](/affaan-m/ECC/raw/main/assets/hero.png)](/affaan-m/ECC/blob/main/assets/hero.png)

![ECC - the harness-native operator system for agentic work](/affaan-m/ECC/raw/main/assets/hero.png)

[![Stars](https://camo.githubusercontent.com/9ab2c0d5048e035817aa6d87e5a8f574a74fbb223dc343b974989ff1c2a0b9e2/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f73746172732f61666661616e2d6d2f4543433f7374796c653d666c6174)](https://github.com/affaan-m/ECC/stargazers)
[![Forks](https://camo.githubusercontent.com/33a5979991b05c0db1b1fcde6da576ebb0e81554256d88dba83406a1fe2c48b7/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f666f726b732f61666661616e2d6d2f4543433f7374796c653d666c6174)](https://github.com/affaan-m/ECC/network/members)
[![Contributors](https://camo.githubusercontent.com/5a0d83fabc720cc81aa3c6732e5760bde825d566dcf467ede3019fd3a2535630/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f636f6e7472696275746f72732f61666661616e2d6d2f4543433f7374796c653d666c6174)](https://github.com/affaan-m/ECC/graphs/contributors)
[![npm ecc-universal](https://camo.githubusercontent.com/47fd911de57265a968e4165c8e0bbebc20c2ce62b636edd6008a585b44ecd404/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f64772f6563632d756e6976657273616c3f6c6162656c3d6563632d756e6976657273616c2532307765656b6c79253230646f776e6c6f616473266c6f676f3d6e706d)](https://www.npmjs.com/package/ecc-universal)
[![npm ecc-agentshield](https://camo.githubusercontent.com/74b8bb5c17964a9a0e92dff3f47a8da9262c3d212d2cb6e6f2d852dcf2758ebb/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f64772f6563632d6167656e74736869656c643f6c6162656c3d6563632d6167656e74736869656c642532307765656b6c79253230646f776e6c6f616473266c6f676f3d6e706d)](https://www.npmjs.com/package/ecc-agentshield)
[![GitHub App Install](https://camo.githubusercontent.com/ba16ba26bcd7ffae77ea785ec304580ad59a3c742fdf539a40af3ffd0fed361a/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4769744875622532304170702d313530253230696e7374616c6c732d3265613434663f6c6f676f3d676974687562)](https://github.com/marketplace/ecc-tools)
[![License](https://camo.githubusercontent.com/7013272bd27ece47364536a221edb554cd69683b68a46fc0ee96881174c4214c/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542d626c75652e737667)](/affaan-m/ECC/blob/main/LICENSE)
[![Shell](https://camo.githubusercontent.com/47d7f79e8524602f5b32c57347c8302258c70edb254c31655ab99452165cfcc0/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d5368656c6c2d3445414132353f6c6f676f3d676e752d62617368266c6f676f436f6c6f723d7768697465)](https://camo.githubusercontent.com/47d7f79e8524602f5b32c57347c8302258c70edb254c31655ab99452165cfcc0/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d5368656c6c2d3445414132353f6c6f676f3d676e752d62617368266c6f676f436f6c6f723d7768697465)
[![TypeScript](https://camo.githubusercontent.com/10350e1c35e1cdfee8ae471db125c23bd37448d6fec75b7baf39edb6f351482a/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d547970655363726970742d3331373843363f6c6f676f3d74797065736372697074266c6f676f436f6c6f723d7768697465)](https://camo.githubusercontent.com/10350e1c35e1cdfee8ae471db125c23bd37448d6fec75b7baf39edb6f351482a/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d547970655363726970742d3331373843363f6c6f676f3d74797065736372697074266c6f676f436f6c6f723d7768697465)
[![Python](https://camo.githubusercontent.com/75f630e9fdd61ed09f6651d5e22192b7b90dd55b80d52f70145b2f5e693e6197/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d507974686f6e2d3337373641423f6c6f676f3d707974686f6e266c6f676f436f6c6f723d7768697465)](https://camo.githubusercontent.com/75f630e9fdd61ed09f6651d5e22192b7b90dd55b80d52f70145b2f5e693e6197/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d507974686f6e2d3337373641423f6c6f676f3d707974686f6e266c6f676f436f6c6f723d7768697465)
[![Go](https://camo.githubusercontent.com/166dcd0f9ef7af21be18a1c8b5a39b1c8bf5aa881032a24e0fa1f566196d6a92/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d476f2d3030414444383f6c6f676f3d676f266c6f676f436f6c6f723d7768697465)](https://camo.githubusercontent.com/166dcd0f9ef7af21be18a1c8b5a39b1c8bf5aa881032a24e0fa1f566196d6a92/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d476f2d3030414444383f6c6f676f3d676f266c6f676f436f6c6f723d7768697465)
[![Java](https://camo.githubusercontent.com/79f88e1f86ed963337905d6efe3a263af5f2e297b3f2f2a51f2dbc95f77d64aa/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d4a6176612d4544384230303f6c6f676f3d6f70656e6a646b266c6f676f436f6c6f723d7768697465)](https://camo.githubusercontent.com/79f88e1f86ed963337905d6efe3a263af5f2e297b3f2f2a51f2dbc95f77d64aa/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d4a6176612d4544384230303f6c6f676f3d6f70656e6a646b266c6f676f436f6c6f723d7768697465)
[![Perl](https://camo.githubusercontent.com/5b8542cc58a252055e3d55d8d08c6164afad743f44b05a6d0b1bd1d3979f6743/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d5065726c2d3339343537453f6c6f676f3d7065726c266c6f676f436f6c6f723d7768697465)](https://camo.githubusercontent.com/5b8542cc58a252055e3d55d8d08c6164afad743f44b05a6d0b1bd1d3979f6743/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d5065726c2d3339343537453f6c6f676f3d7065726c266c6f676f436f6c6f723d7768697465)
[![Markdown](https://camo.githubusercontent.com/7ccf587ad1350a6018f00f16cfa83000bbc186e4f713e0fd63ed79f43dd6e1d9/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d4d61726b646f776e2d3030303030303f6c6f676f3d6d61726b646f776e266c6f676f436f6c6f723d7768697465)](https://camo.githubusercontent.com/7ccf587ad1350a6018f00f16cfa83000bbc186e4f713e0fd63ed79f43dd6e1d9/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d4d61726b646f776e2d3030303030303f6c6f676f3d6d61726b646f776e266c6f676f436f6c6f723d7768697465)

![Stars](https://camo.githubusercontent.com/9ab2c0d5048e035817aa6d87e5a8f574a74fbb223dc343b974989ff1c2a0b9e2/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f73746172732f61666661616e2d6d2f4543433f7374796c653d666c6174)
![Forks](https://camo.githubusercontent.com/33a5979991b05c0db1b1fcde6da576ebb0e81554256d88dba83406a1fe2c48b7/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f666f726b732f61666661616e2d6d2f4543433f7374796c653d666c6174)
![Contributors](https://camo.githubusercontent.com/5a0d83fabc720cc81aa3c6732e5760bde825d566dcf467ede3019fd3a2535630/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f636f6e7472696275746f72732f61666661616e2d6d2f4543433f7374796c653d666c6174)
![npm ecc-universal](https://camo.githubusercontent.com/47fd911de57265a968e4165c8e0bbebc20c2ce62b636edd6008a585b44ecd404/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f64772f6563632d756e6976657273616c3f6c6162656c3d6563632d756e6976657273616c2532307765656b6c79253230646f776e6c6f616473266c6f676f3d6e706d)
![npm ecc-agentshield](https://camo.githubusercontent.com/74b8bb5c17964a9a0e92dff3f47a8da9262c3d212d2cb6e6f2d852dcf2758ebb/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f64772f6563632d6167656e74736869656c643f6c6162656c3d6563632d6167656e74736869656c642532307765656b6c79253230646f776e6c6f616473266c6f676f3d6e706d)
![GitHub App Install](https://camo.githubusercontent.com/ba16ba26bcd7ffae77ea785ec304580ad59a3c742fdf539a40af3ffd0fed361a/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4769744875622532304170702d313530253230696e7374616c6c732d3265613434663f6c6f676f3d676974687562)
![License](https://camo.githubusercontent.com/7013272bd27ece47364536a221edb554cd69683b68a46fc0ee96881174c4214c/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542d626c75652e737667)
![Shell](https://camo.githubusercontent.com/47d7f79e8524602f5b32c57347c8302258c70edb254c31655ab99452165cfcc0/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d5368656c6c2d3445414132353f6c6f676f3d676e752d62617368266c6f676f436f6c6f723d7768697465)
![TypeScript](https://camo.githubusercontent.com/10350e1c35e1cdfee8ae471db125c23bd37448d6fec75b7baf39edb6f351482a/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d547970655363726970742d3331373843363f6c6f676f3d74797065736372697074266c6f676f436f6c6f723d7768697465)
![Python](https://camo.githubusercontent.com/75f630e9fdd61ed09f6651d5e22192b7b90dd55b80d52f70145b2f5e693e6197/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d507974686f6e2d3337373641423f6c6f676f3d707974686f6e266c6f676f436f6c6f723d7768697465)
![Go](https://camo.githubusercontent.com/166dcd0f9ef7af21be18a1c8b5a39b1c8bf5aa881032a24e0fa1f566196d6a92/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d476f2d3030414444383f6c6f676f3d676f266c6f676f436f6c6f723d7768697465)
![Java](https://camo.githubusercontent.com/79f88e1f86ed963337905d6efe3a263af5f2e297b3f2f2a51f2dbc95f77d64aa/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d4a6176612d4544384230303f6c6f676f3d6f70656e6a646b266c6f676f436f6c6f723d7768697465)
![Perl](https://camo.githubusercontent.com/5b8542cc58a252055e3d55d8d08c6164afad743f44b05a6d0b1bd1d3979f6743/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d5065726c2d3339343537453f6c6f676f3d7065726c266c6f676f436f6c6f723d7768697465)
![Markdown](https://camo.githubusercontent.com/7ccf587ad1350a6018f00f16cfa83000bbc186e4f713e0fd63ed79f43dd6e1d9/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2d4d61726b646f776e2d3030303030303f6c6f676f3d6d61726b646f776e266c6f676f436f6c6f723d7768697465)

**182K+ stars** | **28K+ forks** | **170+ contributors** | **12+ language ecosystems** | **Cross-harness agent workflows**

**Language / 语言 / 語言 / Dil / Язык / Ngôn ngữ**

[**English**](/affaan-m/ECC/blob/main/README.md) | [Português (Brasil)](/affaan-m/ECC/blob/main/docs/pt-BR/README.md) | [简体中文](/affaan-m/ECC/blob/main/README.zh-CN.md) | [繁體中文](/affaan-m/ECC/blob/main/docs/zh-TW/README.md) | [日本語](/affaan-m/ECC/blob/main/docs/ja-JP/README.md) | [한국어](/affaan-m/ECC/blob/main/docs/ko-KR/README.md)
| [Türkçe](/affaan-m/ECC/blob/main/docs/tr/README.md) | [Русский](/affaan-m/ECC/blob/main/docs/ru/README.md) | [Tiếng Việt](/affaan-m/ECC/blob/main/docs/vi-VN/README.md) | [ไทย](/affaan-m/ECC/blob/main/docs/th/README.md) | [Deutsch](/affaan-m/ECC/blob/main/docs/de-DE/README.md)

**The harness-native operator system for agentic work. Built from real-world multi-harness engineering workflows.**

Not just configs. A complete system: skills, instincts, memory optimization, continuous learning, security scanning, and research-first development. Production-ready agents, skills, hooks, rules, MCP configurations, and legacy command shims evolved over 10+ months of intensive daily use building real products.

Works across **Codex**, **Claude Code**, **Cursor**, **OpenCode**, **Gemini**, **Zed**, **GitHub Copilot**, and other AI agent harnesses.

ECC v2.0.0-rc.1 adds the public Hermes operator story on top of that reusable layer: start with the [Hermes setup guide](/affaan-m/ECC/blob/main/docs/HERMES-SETUP.md), then review the [rc.1 release notes](/affaan-m/ECC/blob/main/docs/releases/2.0.0-rc.1/release-notes.md) and [cross-harness architecture](/affaan-m/ECC/blob/main/docs/architecture/cross-harness.md).

|  |  |  |  |
| --- | --- | --- | --- |
| [**ECC Pro**  Private repos · GitHub App · $19/seat/mo](https://ecc.tools/pricing) | [**Sponsor**  Fund the OSS · From $5/mo](https://github.com/sponsors/affaan-m) | [**Community**   Discussions · Q&A · Show & Tell](https://github.com/affaan-m/ECC/discussions) | [**GitHub App**  Install · PR audits · Free tier](https://github.com/apps/ecc-tools) |

**OSS stays free.** This repo is MIT-licensed forever. ECC Pro is the hosted GitHub App for private repos. [Sponsors](https://github.com/sponsors/affaan-m) and [Pro subscribers](https://ecc.tools/pricing) fund the work — that's why a single maintainer ships weekly across 7 harnesses.

## The Guides

This repo is the raw code only. The guides explain everything.

|  |  |  |
| --- | --- | --- |
| [The Shorthand Guide to ECC](https://x.com/affaanmustafa/status/2012378465664745795) | [The Longform Guide to ECC](https://x.com/affaanmustafa/status/2014040193557471352) | [The Shorthand Guide to Everything Agentic Security](https://x.com/affaanmustafa/status/2033263813387223421) |
| **Shorthand Guide** Setup, foundations, philosophy. **Read this first.** | **Longform Guide** Token optimization, memory persistence, evals, parallelization. | **Security Guide** Attack vectors, sandboxing, sanitization, CVEs, AgentShield. |

![The Shorthand Guide to ECC](/affaan-m/ECC/raw/main/assets/images/guides/shorthand-guide.png)
![The Longform Guide to ECC](/affaan-m/ECC/raw/main/assets/images/guides/longform-guide.png)
![The Shorthand Guide to Everything Agentic Security](/affaan-m/ECC/raw/main/assets/images/security/security-guide-header.png)

| Topic | What You'll Learn |
| --- | --- |
| Token Optimization | Model selection, system prompt slimming, background processes |
| Memory Persistence | Hooks that save/load context across sessions automatically |
| Continuous Learning | Auto-extract patterns from sessions into reusable skills |
| Verification Loops | Checkpoint vs continuous evals, grader types, pass@k metrics |
| Parallelization | Git worktrees, cascade method, when to scale instances |
| Subagent Orchestration | The context problem, iterative retrieval pattern |

## What's New

### v2.0.0-rc.1 — Surface Refresh, Operator Workflows, and ECC 2.0 Alpha (Apr 2026)

`ecc_dashboard.py`
`npm run dashboard`
`brand-voice`
`social-graph-ranker`
`connections-optimizer`
`customer-billing-ops`
`ecc-tools-cost-audit`
`google-workspace-ops`
`project-flow-ops`
`workspace-surface-audit`
`manim-video`
`remotion-video-creation`
`nestjs-patterns`
`ito-market-intelligence`
`ito-basket-compare`
`ito-trade-planner`
`ito-data-atlas-agent`
`prediction-market-oracle-research`
`prediction-market-risk-review`
`parallel-execution-optimizer`
`benchmark-optimization-loop`
`data-throughput-accelerator`
`latency-critical-systems`
`recursive-decision-ledger`
`ecc2/`
`dashboard`
`start`
`sessions`
`status`
`stop`
`resume`
`daemon`
`ecc status --markdown --write status.md`
`ecc work-items upsert ...`
`ecc work-items sync-github --repo owner/repo`
`ecc status --exit-code`

### v1.9.0 — Selective Install & Language Expansion (Mar 2026)

`install-plan.js`
`install-apply.js`
`typescript-reviewer`
`pytorch-build-resolver`
`java-build-resolver`
`java-reviewer`
`kotlin-reviewer`
`kotlin-build-resolver`
`pytorch-patterns`
`documentation-lookup`
`bun-runtime`
`nextjs-turbopack`
`mcp-server-patterns`

### v1.8.0 — Harness Performance System (Mar 2026)

`ECC_HOOK_PROFILE=minimal|standard|strict`
`ECC_DISABLED_HOOKS=...`
`/harness-audit`
`/loop-start`
`/loop-status`
`/quality-gate`
`/model-route`

### v1.7.0 — Cross-Platform Expansion & Presentation Builder (Feb 2026)

`AGENTS.md`
`frontend-slides`
`article-writing`
`content-engine`
`market-research`
`investor-materials`
`investor-outreach`

### v1.6.0 — Codex CLI, AgentShield & Marketplace (Feb 2026)

`/codex-setup`
`codex.md`
`search-first`
`swift-actor-persistence`
`swift-protocol-di-testing`
`regex-vs-llm-structured-text`
`content-hash-cache-pattern`
`cost-aware-llm-pipeline`
`skill-stocktake`
`/security-scan`

### v1.4.1 — Bug Fix (Feb 2026)

`parse_instinct_file()`
`/instinct-import`

### v1.4.0 — Multi-Language Rules, Installation Wizard & PM2 (Feb 2026)

`configure-ecc`
`/pm2`
`/multi-plan`
`/multi-execute`
`/multi-backend`
`/multi-frontend`
`/multi-workflow`
`common/`
`typescript/`
`python/`
`golang/`

### v1.3.0 — OpenCode Plugin Support (Feb 2026)

`llms.txt`

### v1.2.0 — Unified Commands & Skills (Feb 2026)

`/sessions`

See the full changelog in [Releases](https://github.com/affaan-m/ECC/releases).

## Quick Start

Get up and running in under 2 minutes:

### Pick one path only

Most Claude Code users should use exactly one install path:

`/plugin install`
`install.sh --profile full`
`npx ecc-install --profile full`

If you already layered multiple installs and things look duplicated, skip straight to [Reset / Uninstall ECC](#reset--uninstall-ecc).

### Low-context / no-hooks path

If hooks feel too global or you only want ECC's rules, agents, commands, and core workflow skills, skip the plugin and use the minimal manual profile:

This profile intentionally excludes `hooks-runtime`.

`hooks-runtime`

If you want the normal core profile but need hooks off, use:

Add hooks later only if you want runtime enforcement:

### Find the right components first

If you are not sure which ECC profile or component to install, ask the packaged advisor from any project:

It returns matching components, related profiles, and preview/install commands. Use the preview command before installing if you want to inspect the exact file plan.

For production ML/MLOps workflows, keep the install opt-in and component-scoped:

### Step 1: Install the Plugin (Recommended)

NOTE: The plugin is convenient, but the OSS installer below is still the most reliable path if your Claude Code build has trouble resolving self-hosted marketplace entries.

### Naming + Migration Note

ECC now has three public identifiers, and they are not interchangeable:

`affaan-m/ECC`
`ecc@ecc`
`ecc-universal`

This is intentional. Anthropic marketplace/plugin installs are keyed by a canonical plugin identifier, so ECC uses `ecc@ecc` to keep tool names and slash-command namespaces short enough for strict Desktop/API validators. Older posts may still show the former long marketplace identifier; treat that as a legacy alias only. Separately, the npm package stayed on `ecc-universal`, so npm installs and marketplace installs intentionally use different names.

`ecc@ecc`
`ecc-universal`

### Step 2: Install Rules Only If You Need Them

WARNING: **Important:** Claude Code plugins cannot distribute `rules` automatically.

`rules`

If you already installed ECC via `/plugin install`, **do not run `./install.sh --profile full`, `.\install.ps1 --profile full`, or `npx ecc-install --profile full` afterward**. The plugin already loads ECC skills, commands, and hooks. Running the full installer after a plugin install copies those same surfaces into your user directories and can create duplicate skills plus duplicate runtime behavior.

`/plugin install`
`./install.sh --profile full`
`.\install.ps1 --profile full`
`npx ecc-install --profile full`

For plugin installs, manually copy only the `rules/` directories you want under `~/.claude/rules/ecc/`. Start with `rules/common` plus one language or framework pack you actually use. Do not copy every rules directory unless you explicitly want all of that context in Claude.

`rules/`
`~/.claude/rules/ecc/`
`rules/common`

Use the full installer only when you are doing a fully manual ECC install instead of the plugin path.

If your local Claude setup was wiped or reset, that does not mean you need to repurchase ECC. Start with `node scripts/ecc.js list-installed`, then run `node scripts/ecc.js doctor` and `node scripts/ecc.js repair` before reinstalling anything. That usually restores ECC-managed files without rebuilding your setup. If the problem is account or marketplace access for ECC Tools, handle billing/account recovery separately.

`node scripts/ecc.js list-installed`
`node scripts/ecc.js doctor`
`node scripts/ecc.js repair`

For manual install instructions see the README in the `rules/` folder. When copying rules manually, copy the whole language directory (for example `rules/common` or `rules/golang`), not the files inside it, so relative references keep working and filenames do not collide.

`rules/`
`rules/common`
`rules/golang`

### Fully manual install (Fallback)

Use this only if you are intentionally skipping the plugin path:

If you choose this path, stop there. Do not also run `/plugin install`.

`/plugin install`

### Reset / Uninstall ECC

If ECC feels duplicated, intrusive, or broken, do not keep reinstalling it on top of itself.

`~/.claude/rules/ecc/`

Then remove ECC-managed files:

You can also use the lifecycle wrapper:

ECC only removes files recorded in its install-state. It will not delete unrelated files it did not install.

If you stacked methods, clean up in this order:

### Step 3: Start Using

**That's it!** You now have access to 63 agents, 249 skills, and 79 legacy command shims.

### Dashboard GUI

Launch the desktop dashboard to visually explore ECC components:

**Features:**

### Multi-model commands require additional setup

WARNING: `multi-*` commands are **not** covered by the base plugin/rules install above.

`multi-*`

To use `/multi-plan`, `/multi-execute`, `/multi-backend`, `/multi-frontend`, and `/multi-workflow`, you must also install the `ccg-workflow` runtime.

`/multi-plan`
`/multi-execute`
`/multi-backend`
`/multi-frontend`
`/multi-workflow`
`ccg-workflow`

Initialize it with `npx ccg-workflow`.

`npx ccg-workflow`

That runtime provides the external dependencies these commands expect, including:

`~/.claude/bin/codeagent-wrapper`
`~/.claude/.ccg/prompts/*`

Without `ccg-workflow`, these `multi-*` commands will not run correctly.

`ccg-workflow`
`multi-*`

## Cross-Platform Support

This plugin now fully supports **Windows, macOS, and Linux**, alongside tight integration across major IDEs (Cursor, Zed, OpenCode, Antigravity) and CLI harnesses. All hooks and scripts have been rewritten in Node.js for maximum compatibility.

### Package Manager Detection

The plugin automatically detects your preferred package manager (npm, pnpm, yarn, or bun) with the following priority:

`CLAUDE_PACKAGE_MANAGER`
`.claude/package-manager.json`
`packageManager`
`~/.claude/package-manager.json`

To set your preferred package manager:

Or use the `/setup-pm` command in Claude Code.

`/setup-pm`

### Hook Runtime Controls

Use runtime flags to tune strictness or disable specific hooks temporarily:

Windows PowerShell:

## What's Inside

This repo is a **Claude Code plugin** - install it directly or copy components manually.

`ECC/
|-- .claude-plugin/ # Plugin and marketplace manifests
| |-- plugin.json # Plugin metadata and component paths
| |-- marketplace.json # Marketplace catalog for /plugin marketplace add
|
|-- agents/ # 63 specialized subagents for delegation
| |-- planner.md # Feature implementation planning
| |-- architect.md # System design decisions
| |-- tdd-guide.md # Test-driven development
| |-- code-reviewer.md # Quality and security review
| |-- security-reviewer.md # Vulnerability analysis
| |-- build-error-resolver.md
| |-- e2e-runner.md # Playwright E2E testing
| |-- refactor-cleaner.md # Dead code cleanup
| |-- doc-updater.md # Documentation sync
| |-- docs-lookup.md # Documentation/API lookup
| |-- chief-of-staff.md # Communication triage and drafts
| |-- loop-operator.md # Autonomous loop execution
| |-- harness-optimizer.md # Harness config tuning
| |-- cpp-reviewer.md # C++ code review
| |-- cpp-build-resolver.md # C++ build error resolution
| |-- fsharp-reviewer.md # F# functional code review
| |-- go-reviewer.md # Go code review
| |-- go-build-resolver.md # Go build error resolution
| |-- python-reviewer.md # Python code review
| |-- database-reviewer.md # Database/Supabase review
| |-- typescript-reviewer.md # TypeScript/JavaScript code review
| |-- java-reviewer.md # Java/Spring Boot code review
| |-- java-build-resolver.md # Java/Maven/Gradle build errors
| |-- kotlin-reviewer.md # Kotlin/Android/KMP code review
| |-- kotlin-build-resolver.md # Kotlin/Gradle build errors
| |-- harmonyos-app-resolver.md # HarmonyOS/ArkTS app development
| |-- rust-reviewer.md # Rust code review
| |-- rust-build-resolver.md # Rust build error resolution
| |-- pytorch-build-resolver.md # PyTorch/CUDA training errors
| |-- mle-reviewer.md # Production ML pipeline, eval, serving, and monitoring review
|
|-- skills/ # Workflow definitions and domain knowledge
| |-- coding-standards/ # Language best practices
| |-- clickhouse-io/ # ClickHouse analytics, queries, data engineering
| |-- backend-patterns/ # API, database, caching patterns
| |-- frontend-patterns/ # React, Next.js patterns
| |-- frontend-slides/ # HTML slide decks and PPTX-to-web presentation workflows (NEW)
| |-- article-writing/ # Long-form writing in a supplied voice without generic AI tone (NEW)
| |-- content-engine/ # Multi-platform social content and repurposing workflows (NEW)
| |-- market-research/ # Source-attributed market, competitor, and investor research (NEW)
| |-- investor-materials/ # Pitch decks, one-pagers, memos, and financial models (NEW)
| |-- investor-outreach/ # Personalized fundraising outreach and follow-up (NEW)
| |-- continuous-learning/ # Legacy v1 Stop-hook pattern extraction
| |-- continuous-learning-v2/ # Instinct-based learning with confidence scoring
| |-- iterative-retrieval/ # Progressive context refinement for subagents
| |-- strategic-compact/ # Manual compaction suggestions (Longform Guide)
| |-- tdd-workflow/ # TDD methodology
| |-- security-review/ # Security checklist
| |-- eval-harness/ # Verification loop evaluation (Longform Guide)
| |-- verification-loop/ # Continuous verification (Longform Guide)
| |-- videodb/ # Video and audio: ingest, search, edit, generate, stream (NEW)
| |-- golang-patterns/ # Go idioms and best practices
| |-- golang-testing/ # Go testing patterns, TDD, benchmarks
| |-- cpp-coding-standards/ # C++ coding standards from C++ Core Guidelines (NEW)
| |-- cpp-testing/ # C++ testing with GoogleTest, CMake/CTest (NEW)
| |-- django-patterns/ # Django patterns, models, views (NEW)
| |-- django-security/ # Django security best practices (NEW)
| |-- django-tdd/ # Django TDD workflow (NEW)
| |-- django-verification/ # Django verification loops (NEW)
| |-- laravel-patterns/ # Laravel architecture patterns (NEW)
| |-- laravel-security/ # Laravel security best practices (NEW)
| |-- laravel-tdd/ # Laravel TDD workflow (NEW)
| |-- laravel-verification/ # Laravel verification loops (NEW)
| |-- python-patterns/ # Python idioms and best practices (NEW)
| |-- python-testing/ # Python testing with pytest (NEW)
| |-- quarkus-patterns/ # Java Quarkus patterns (NEW)
| |-- quarkus-security/ # Quarkus security (NEW)
| |-- quarkus-tdd/ # Quarkus TDD (NEW)
| |-- quarkus-verification/ # Quarkus verification (NEW)
| |-- springboot-patterns/ # Java Spring Boot patterns (NEW)
| |-- springboot-security/ # Spring Boot security (NEW)
| |-- springboot-tdd/ # Spring Boot TDD (NEW)
| |-- springboot-verification/ # Spring Boot verification (NEW)
| |-- configure-ecc/ # Interactive installation wizard (NEW)
| |-- security-scan/ # AgentShield security auditor integration (NEW)
| |-- java-coding-standards/ # Java coding standards (NEW)
| |-- jpa-patterns/ # JPA/Hibernate patterns (NEW)
| |-- postgres-patterns/ # PostgreSQL optimization patterns (NEW)
| |-- nutrient-document-processing/ # Document processing with Nutrient API (NEW)
| |-- docs/examples/project-guidelines-template.md # Template for project-specific skills
| |-- database-migrations/ # Migration patterns (Prisma, Drizzle, Django, Go) (NEW)
| |-- api-design/ # REST API design, pagination, error responses (NEW)
| |-- deployment-patterns/ # CI/CD, Docker, health checks, rollbacks (NEW)
| |-- docker-patterns/ # Docker Compose, networking, volumes, container security (NEW)
| |-- e2e-testing/ # Playwright E2E patterns and Page Object Model (NEW)
| |-- content-hash-cache-pattern/ # SHA-256 content hash caching for file processing (NEW)
| |-- cost-aware-llm-pipeline/ # LLM cost optimization, model routing, budget tracking (NEW)
| |-- regex-vs-llm-structured-text/ # Decision framework: regex vs LLM for text parsing (NEW)
| |-- swift-actor-persistence/ # Thread-safe Swift data persistence with actors (NEW)
| |-- swift-protocol-di-testing/ # Protocol-based DI for testable Swift code (NEW)
| |-- search-first/ # Research-before-coding workflow (NEW)
| |-- skill-stocktake/ # Audit skills and commands for quality (NEW)
| |-- liquid-glass-design/ # iOS 26 Liquid Glass design system (NEW)
| |-- foundation-models-on-device/ # Apple on-device LLM with FoundationModels (NEW)
| |-- swift-concurrency-6-2/ # Swift 6.2 Approachable Concurrency (NEW)
| |-- mle-workflow/ # Production ML data contracts, evals, deployment, monitoring (NEW)
| |-- perl-patterns/ # Modern Perl 5.36+ idioms and best practices (NEW)
| |-- perl-security/ # Perl security patterns, taint mode, safe I/O (NEW)
| |-- perl-testing/ # Perl TDD with Test2::V0, prove, Devel::Cover (NEW)
| |-- autonomous-loops/ # Autonomous loop patterns: sequential pipelines, PR loops, DAG orchestration (NEW)
| |-- plankton-code-quality/ # Write-time code quality enforcement with Plankton hooks (NEW)
|
|-- commands/ # Maintained slash-entry compatibility; prefer skills/
| |-- plan.md # /plan - Implementation planning
| |-- code-review.md # /code-review - Quality review
| |-- build-fix.md # /build-fix - Fix build errors
| |-- refactor-clean.md # /refactor-clean - Dead code removal
| |-- quality-gate.md # /quality-gate - Verification gate
| |-- learn.md # /learn - Extract patterns mid-session (Longform Guide)
| |-- learn-eval.md # /learn-eval - Extract, evaluate, and save patterns (NEW)
| |-- checkpoint.md # /checkpoint - Save verification state (Longform Guide)
| |-- setup-pm.md # /setup-pm - Configure package manager
| |-- go-review.md # /go-review - Go code review (NEW)
| |-- go-test.md # /go-test - Go TDD workflow (NEW)
| |-- go-build.md # /go-build - Fix Go build errors (NEW)
| |-- skill-create.md # /skill-create - Generate skills from git history (NEW)
| |-- instinct-status.md # /instinct-status - View learned instincts (NEW)
| |-- instinct-import.md # /instinct-import - Import instincts (NEW)
| |-- instinct-export.md # /instinct-export - Export instincts (NEW)
| |-- evolve.md # /evolve - Cluster instincts into skills
| |-- prune.md # /prune - Delete expired pending instincts (NEW)
| |-- pm2.md # /pm2 - PM2 service lifecycle management (NEW)
| |-- multi-plan.md # /multi-plan - Multi-agent task decomposition (NEW)
| |-- multi-execute.md # /multi-execute - Orchestrated multi-agent workflows (NEW)
| |-- multi-backend.md # /multi-backend - Backend multi-service orchestration (NEW)
| |-- multi-frontend.md # /multi-frontend - Frontend multi-service orchestration (NEW)
| |-- multi-workflow.md # /multi-workflow - General multi-service workflows (NEW)
| |-- sessions.md # /sessions - Session history management
| |-- test-coverage.md # /test-coverage - Test coverage analysis
| |-- update-docs.md # /update-docs - Update documentation
| |-- update-codemaps.md # /update-codemaps - Update codemaps
| |-- python-review.md # /python-review - Python code review (NEW)
|-- legacy-command-shims/ # Opt-in archive for retired shims such as /tdd and /eval
| |-- tdd.md # /tdd - Prefer the tdd-workflow skill
| |-- e2e.md # /e2e - Prefer the e2e-testing skill
| |-- eval.md # /eval - Prefer the eval-harness skill
| |-- verify.md # /verify - Prefer the verification-loop skill
| |-- orchestrate.md # /orchestrate - Prefer dmux-workflows or multi-workflow
|
|-- rules/ # Always-follow guidelines (copy to ~/.claude/rules/ecc/)
| |-- README.md # Structure overview and installation guide
| |-- common/ # Language-agnostic principles
| | |-- coding-style.md # Immutability, file organization
| | |-- git-workflow.md # Commit format, PR process
| | |-- testing.md # TDD, 80% coverage requirement
| | |-- performance.md # Model selection, context management
| | |-- patterns.md # Design patterns, skeleton projects
| | |-- hooks.md # Hook architecture, TodoWrite
| | |-- agents.md # When to delegate to subagents
| | |-- security.md # Mandatory security checks
| |-- typescript/ # TypeScript/JavaScript specific
| |-- python/ # Python specific
| |-- golang/ # Go specific
| |-- swift/ # Swift specific
| |-- php/ # PHP specific (NEW)
| |-- arkts/ # HarmonyOS / ArkTS specific
|
|-- hooks/ # Trigger-based automations
| |-- README.md # Hook documentation, recipes, and customization guide
| |-- hooks.json # All hooks config (PreToolUse, PostToolUse, Stop, etc.)
| |-- memory-persistence/ # Session lifecycle hooks (Longform Guide)
| |-- strategic-compact/ # Compaction suggestions (Longform Guide)
|
|-- scripts/ # Cross-platform Node.js scripts (NEW)
| |-- lib/ # Shared utilities
| | |-- utils.js # Cross-platform file/path/system utilities
| | |-- package-manager.js # Package manager detection and selection
| |-- hooks/ # Hook implementations
| | |-- session-start.js # Load context on session start
| | |-- session-end.js # Save state on session end
| | |-- pre-compact.js # Pre-compaction state saving
| | |-- suggest-compact.js # Strategic compaction suggestions
| | |-- evaluate-session.js # Extract patterns from sessions
| |-- setup-package-manager.js # Interactive PM setup
|
|-- tests/ # Test suite (NEW)
| |-- lib/ # Library tests
| |-- hooks/ # Hook tests
| |-- run-all.js # Run all tests
|
|-- contexts/ # Dynamic system prompt injection contexts (Longform Guide)
| |-- dev.md # Development mode context
| |-- review.md # Code review mode context
| |-- research.md # Research/exploration mode context
|
|-- examples/ # Example configurations and sessions
| |-- CLAUDE.md # Example project-level config
| |-- user-CLAUDE.md # Example user-level config
| |-- saas-nextjs-CLAUDE.md # Real-world SaaS (Next.js + Supabase + Stripe)
| |-- go-microservice-CLAUDE.md # Real-world Go microservice (gRPC + PostgreSQL)
| |-- django-api-CLAUDE.md # Real-world Django REST API (DRF + Celery)
| |-- laravel-api-CLAUDE.md # Real-world Laravel API (PostgreSQL + Redis) (NEW)
| |-- rust-api-CLAUDE.md # Real-world Rust API (Axum + SQLx + PostgreSQL) (NEW)
|
|-- mcp-configs/ # MCP server configurations
| |-- mcp-servers.json # GitHub, Supabase, Vercel, Railway, etc.
|
|-- ecc_dashboard.py # Desktop GUI dashboard (Tkinter)
|
|-- assets/ # Assets for dashboard
| |-- images/
| |-- ecc-logo.png
|
|-- marketplace.json # Self-hosted marketplace config (for /plugin marketplace add)`

## Ecosystem Tools

### Skill Creator

Two ways to generate Claude Code skills from your repository:

#### Option A: Local Analysis (Built-in)

Use the `/skill-create` command for local analysis without external services:

`/skill-create`

This analyzes your git history locally and generates SKILL.md files.

#### Option B: GitHub App (Advanced)

For advanced features (10k+ commits, auto-PRs, team sharing):

[Install GitHub App](https://github.com/apps/skill-creator) | [ecc.tools](https://ecc.tools)

Both options create:

### AgentShield — Security Auditor

Built at the Claude Code Hackathon (Cerebral Valley x Anthropic, Feb 2026). 1282 tests, 98% coverage, 102 static analysis rules.

Scan your Claude Code configuration for vulnerabilities, misconfigurations, and injection risks.

**What it scans:** CLAUDE.md, settings.json, MCP configs, hooks, agent definitions, and skills across 5 categories — secrets detection (14 patterns), permission auditing, hook injection analysis, MCP server risk profiling, and agent config review.

**The `--opus` flag** runs three Claude Opus 4.6 agents in a red-team/blue-team/auditor pipeline. The attacker finds exploit chains, the defender evaluates protections, and the auditor synthesizes both into a prioritized risk assessment. Adversarial reasoning, not just pattern matching.

`--opus`

**Output formats:** Terminal (color-graded A-F), JSON (CI pipelines), Markdown, HTML. Exit code 2 on critical findings for build gates.

Use `/security-scan` in Claude Code to run it, or add to CI with the [GitHub Action](https://github.com/affaan-m/agentshield).

`/security-scan`

[GitHub](https://github.com/affaan-m/agentshield) | [npm](https://www.npmjs.com/package/ecc-agentshield)

### Continuous Learning v2

The instinct-based learning system automatically learns your patterns:

See `skills/continuous-learning-v2/` for full documentation.
Keep `continuous-learning/` only when you explicitly want the legacy v1 Stop-hook learned-skill flow.

`skills/continuous-learning-v2/`
`continuous-learning/`

## Requirements

### Claude Code CLI Version

**Minimum version: v2.1.0 or later**

This plugin requires Claude Code CLI v2.1.0+ due to changes in how the plugin system handles hooks.

Check your version:

### Important: Hooks Auto-Loading Behavior

WARNING: **For Contributors:** Do NOT add a `"hooks"` field to `.claude-plugin/plugin.json`. This is enforced by a regression test.

`"hooks"`
`.claude-plugin/plugin.json`

Claude Code v2.1+ **automatically loads** `hooks/hooks.json` from any installed plugin by convention. Explicitly declaring it in `plugin.json` causes a duplicate detection error:

`hooks/hooks.json`
`plugin.json`
`Duplicate hooks file detected: ./hooks/hooks.json resolves to already-loaded file`

**History:** This has caused repeated fix/revert cycles in this repo ([#29](https://github.com/affaan-m/ECC/issues/29), [#52](https://github.com/affaan-m/ECC/issues/52), [#103](https://github.com/affaan-m/ECC/issues/103)). The behavior changed between Claude Code versions, leading to confusion. We now have a regression test to prevent this from being reintroduced.

## Installation

### Option 1: Install as Plugin (Recommended)

The easiest way to use this repo - install as a Claude Code plugin:

Or add directly to your `~/.claude/settings.json`:

`~/.claude/settings.json`

This gives you instant access to all commands, agents, skills, and hooks.

**Note:** The Claude Code plugin system does not support distributing `rules` via plugins ([upstream limitation](https://code.claude.com/docs/en/plugins-reference)). You need to install rules manually:

`rules`

### Option 2: Manual Installation

If you prefer manual control over what's installed:

#### Install hooks

Do not copy the raw repo `hooks/hooks.json` into `~/.claude/settings.json` or `~/.claude/hooks/hooks.json`. That file is plugin/repo-oriented and is meant to be installed through the ECC installer or loaded as a plugin, so raw copying is not a supported manual install path.

`hooks/hooks.json`
`~/.claude/settings.json`
`~/.claude/hooks/hooks.json`

Use the installer to install only the Claude hook runtime so command paths are rewritten correctly:

That writes resolved hooks to `~/.claude/hooks/hooks.json` and leaves any existing `~/.claude/settings.json` untouched.

`~/.claude/hooks/hooks.json`
`~/.claude/settings.json`

If you installed ECC via `/plugin install`, do not copy those hooks into `settings.json`. Claude Code v2.1+ already auto-loads plugin `hooks/hooks.json`, and duplicating them in `settings.json` causes duplicate execution and cross-platform hook conflicts.

`/plugin install`
`settings.json`
`hooks/hooks.json`
`settings.json`

Windows note: the Claude config directory is `%USERPROFILE%\\.claude`, not `~/claude`.

`%USERPROFILE%\\.claude`
`~/claude`

#### Configure MCPs

Claude plugin installs intentionally do not auto-enable ECC's bundled MCP server definitions. This avoids overlong plugin MCP tool names on strict third-party gateways while keeping manual MCP setup available.

Use Claude Code's `/mcp` command or CLI-managed MCP setup for live Claude Code server changes. Use `/mcp` for Claude Code runtime disables; Claude Code persists those choices in `~/.claude.json`.

`/mcp`
`/mcp`
`~/.claude.json`

For repo-local MCP access, copy desired MCP server definitions from `mcp-configs/mcp-servers.json` into a project-scoped `.mcp.json`.

`mcp-configs/mcp-servers.json`
`.mcp.json`

If you already run your own copies of ECC-bundled MCPs, set:

ECC-managed install and Codex sync flows will skip or remove those bundled servers instead of re-adding duplicates. `ECC_DISABLED_MCPS` is an ECC install/sync filter, not a live Claude Code toggle.

`ECC_DISABLED_MCPS`

**Important:** Replace `YOUR_*_HERE` placeholders with your actual API keys.

`YOUR_*_HERE`

## Key Concepts

### Agents

Subagents handle delegated tasks with limited scope. Example:

### Skills

Skills are the primary workflow surface. They can be invoked directly, suggested automatically, and reused by agents. ECC still ships maintained `commands/` during migration, while retired short-name shims live under `legacy-command-shims/` for explicit opt-in only. New workflow development should land in `skills/` first.

`commands/`
`legacy-command-shims/`
`skills/`

### Hooks

Hooks fire on tool events. Example - warn about console.log:

### Rules

Rules are always-follow guidelines, organized into `common/` (language-agnostic) + language-specific directories:

`common/`
`rules/
common/ # Universal principles (always install)
typescript/ # TS/JS specific patterns and tools
python/ # Python specific patterns and tools
golang/ # Go specific patterns and tools
swift/ # Swift specific patterns and tools
php/ # PHP specific patterns and tools
arkts/ # HarmonyOS / ArkTS patterns and constraints`

See [`rules/README.md`](/affaan-m/ECC/blob/main/rules/README.md) for installation and structure details.

`rules/README.md`

## Which Agent Should I Use?

Not sure where to start? Use this quick reference. Skills are the canonical workflow surface; maintained slash entries stay available for command-first workflows.

| I want to... | Use this surface | Agent used |
| --- | --- | --- |
| Plan a new feature | `/ecc:plan "Add auth"` | planner |
| Design system architecture | `/ecc:plan` + architect agent | architect |
| Write code with tests first | `tdd-workflow` skill | tdd-guide |
| Review code I just wrote | `/code-review` | code-reviewer |
| Fix a failing build | `/build-fix` | build-error-resolver |
| Run end-to-end tests | `e2e-testing` skill | e2e-runner |
| Find security vulnerabilities | `/security-scan` | security-reviewer |
| Remove dead code | `/refactor-clean` | refactor-cleaner |
| Update documentation | `/update-docs` | doc-updater |
| Review Go code | `/go-review` | go-reviewer |
| Review Python code | `/python-review` | python-reviewer |
| Review F# code | *(invoke `fsharp-reviewer` directly)* | fsharp-reviewer |
| Review TypeScript/JavaScript code | *(invoke `typescript-reviewer` directly)* | typescript-reviewer |
| Develop HarmonyOS apps | *(invoke `harmonyos-app-resolver` directly)* | harmonyos-app-resolver |
| Audit database queries | *(auto-delegated)* | database-reviewer |
| Review production ML changes | `mle-workflow` skill + `mle-reviewer` agent | mle-reviewer |

`/ecc:plan "Add auth"`
`/ecc:plan`
`tdd-workflow`
`/code-review`
`/build-fix`
`e2e-testing`
`/security-scan`
`/refactor-clean`
`/update-docs`
`/go-review`
`/python-review`
`fsharp-reviewer`
`typescript-reviewer`
`harmonyos-app-resolver`
`mle-workflow`
`mle-reviewer`

### Common Workflows

Slash forms below are shown where they remain part of the maintained command surface. Retired short-name shims such as `/tdd` and `/eval` live in `legacy-command-shims/` for explicit opt-in only.

`/tdd`
`/eval`
`legacy-command-shims/`

**Starting a new feature:**

`/ecc:plan "Add user authentication with OAuth"
→ planner creates implementation blueprint
tdd-workflow skill → tdd-guide enforces write-tests-first
/code-review → code-reviewer checks your work`

**Fixing a bug:**

`tdd-workflow skill → tdd-guide: write a failing test that reproduces it
→ implement the fix, verify test passes
/code-review → code-reviewer: catch regressions`

**Preparing for production:**

`/security-scan → security-reviewer: OWASP Top 10 audit
e2e-testing skill → e2e-runner: critical user flow tests
/test-coverage → verify 80%+ coverage`

## FAQ

This shows all available agents, commands, and skills from the plugin.

This is the most common issue. **Do NOT add a `"hooks"` field to `.claude-plugin/plugin.json`.** Claude Code v2.1+ automatically loads `hooks/hooks.json` from installed plugins. Explicitly declaring it causes duplicate detection errors. See [#29](https://github.com/affaan-m/ECC/issues/29), [#52](https://github.com/affaan-m/ECC/issues/52), [#103](https://github.com/affaan-m/ECC/issues/103).

`"hooks"`
`.claude-plugin/plugin.json`
`hooks/hooks.json`

Yes. ECC does not hardcode Anthropic-hosted transport settings. It runs locally through Claude Code's normal CLI/plugin surface, so it works with:

`ANTHROPIC_BASE_URL`
`ANTHROPIC_AUTH_TOKEN`

Minimal example:

If your gateway remaps model names, configure that in Claude Code rather than in ECC. ECC's hooks, skills, commands, and rules are model-provider agnostic once the `claude` CLI is already working.

`claude`

Official references:

Too many MCP servers eat your context. Each MCP tool description consumes tokens from your 200k window, potentially reducing it to ~70k. SessionStart context is capped at 8000 characters by default; lower it with `ECC_SESSION_START_MAX_CHARS=4000` or disable it with `ECC_SESSION_START_CONTEXT=off` for local-model or low-context setups.

`ECC_SESSION_START_MAX_CHARS=4000`
`ECC_SESSION_START_CONTEXT=off`

**Fix:** Disable unused MCPs from Claude Code with `/mcp`. Claude Code writes those runtime choices to `~/.claude.json`; `.claude/settings.json` and `.claude/settings.local.json` are not reliable toggles for already-loaded MCP servers.

`/mcp`
`~/.claude.json`
`.claude/settings.json`
`.claude/settings.local.json`

Keep under 10 MCPs enabled and under 80 tools active.

Yes. Use Option 2 (manual installation) and copy only what you need:

Each component is fully independent.

Yes. ECC is cross-platform:

`.cursor/`
`.gemini/GEMINI.md`
`.opencode/`
`.github/copilot-instructions.md`
`.vscode/settings.json`
`.github/prompts/`
`.agent/`
`.zed/settings.json`

See [CONTRIBUTING.md](/affaan-m/ECC/blob/main/CONTRIBUTING.md). The short version:

`skills/your-skill-name/SKILL.md`
`agents/your-agent.md`

## Running Tests

The plugin includes a comprehensive test suite:

## Contributing

**Contributions are welcome and encouraged.**

This repo is meant to be a community resource. If you have:

Please contribute! See [CONTRIBUTING.md](/affaan-m/ECC/blob/main/CONTRIBUTING.md) for guidelines.

### Ideas for Contributions

### Community Ecosystem Notes

These are not bundled with ECC and are not audited by this repo, but they are worth knowing about if you are exploring the broader Claude Code skills ecosystem:

## Cursor IDE Support

ECC provides Cursor IDE support with hooks, rules, agents, skills, commands, and MCP configs adapted for Cursor's project layout.

### Quick Start (Cursor)

### What's Included

| Component | Count | Details |
| --- | --- | --- |
| Hook Events | 15 | sessionStart, beforeShellExecution, afterFileEdit, beforeMCPExecution, beforeSubmitPrompt, and 10 more |
| Hook Scripts | 16 | Thin Node.js scripts delegating to `scripts/hooks/` via shared adapter |
| Rules | 34 | 9 common (alwaysApply) + 25 language-specific (TypeScript, Python, Go, Swift, PHP) |
| Agents | 48 | `.cursor/agents/ecc-*.md` when installed; prefixed to avoid collisions with user or marketplace agents |
| Skills | Shared + Bundled | `.cursor/skills/` for translated additions |
| Commands | Shared | `.cursor/commands/` if installed |
| MCP Config | Shared | `.cursor/mcp.json` if installed |

`scripts/hooks/`
`.cursor/agents/ecc-*.md`
`.cursor/skills/`
`.cursor/commands/`
`.cursor/mcp.json`

### Cursor Loading Notes

ECC does not install root `AGENTS.md` into `.cursor/`. Cursor treats nested `AGENTS.md` files as directory context, so copying ECC's repo identity into a host project would pollute that project.

`AGENTS.md`
`.cursor/`
`AGENTS.md`

Cursor-native loading behavior can vary by Cursor build. ECC installs agents as `.cursor/agents/ecc-*.md`; if your Cursor build does not expose project agents, those files still work as explicit reference definitions instead of hidden global prompt context.

`.cursor/agents/ecc-*.md`

### Hook Architecture (DRY Adapter Pattern)

Cursor has **more hook events than Claude Code** (20 vs 8). The `.cursor/hooks/adapter.js` module transforms Cursor's stdin JSON to Claude Code's format, allowing existing `scripts/hooks/*.js` to be reused without duplication.

`.cursor/hooks/adapter.js`
`scripts/hooks/*.js`
`Cursor stdin JSON → adapter.js → transforms → scripts/hooks/*.js
(shared with Claude Code)`

Key hooks:

### Rules Format

Cursor rules use YAML frontmatter with `description`, `globs`, and `alwaysApply`:

`description`
`globs`
`alwaysApply`

## Codex macOS App + CLI Support

ECC provides **first-class Codex support** for both the macOS app and CLI, with a reference configuration, Codex-specific AGENTS.md supplement, and shared skills.

### Quick Start (Codex App + CLI)

The sync script safely merges ECC MCP servers into your existing `~/.codex/config.toml` using an **add-only** strategy — it never removes or modifies your existing servers. Run with `--dry-run` to preview changes, or `--update-mcp` to force-refresh ECC servers to the latest recommended config.

`~/.codex/config.toml`
`--dry-run`
`--update-mcp`

For Context7, ECC uses the canonical Codex section name `[mcp_servers.context7]` while still launching the `@upstash/context7-mcp` package. If you already have a legacy `[mcp_servers.context7-mcp]` entry, `--update-mcp` migrates it to the canonical section name.

`[mcp_servers.context7]`
`@upstash/context7-mcp`
`[mcp_servers.context7-mcp]`
`--update-mcp`

Codex macOS app:

`AGENTS.md`
`.codex/config.toml`
`.codex/agents/*.toml`
`.codex/config.toml`
`model`
`model_provider`
`.codex/config.toml`
`~/.codex/config.toml`
`.codex/agents/`

### What's Included

| Component | Count | Details |
| --- | --- | --- |
| Config | 1 | `.codex/config.toml` — top-level approvals/sandbox/web\_search, MCP servers, notifications, profiles |
| AGENTS.md | 2 | Root (universal) + `.codex/AGENTS.md` (Codex-specific supplement) |
| Skills | 32 | `.agents/skills/` — SKILL.md + agents/openai.yaml per skill |
| MCP Servers | 6 | GitHub, Context7, Exa, Memory, Playwright, Sequential Thinking (7 with Supabase via `--update-mcp` sync) |
| Profiles | 2 | `strict` (read-only sandbox) and `yolo` (full auto-approve) |
| Agent Roles | 3 | `.codex/agents/` — explorer, reviewer, docs-researcher |

`.codex/config.toml`
`.codex/AGENTS.md`
`.agents/skills/`
`--update-mcp`
`strict`
`yolo`
`.codex/agents/`

### Skills

Skills at `.agents/skills/` are auto-loaded by Codex:

`.agents/skills/`

Canonical Anthropic skills such as `claude-api`, `frontend-design`, and `skill-creator` are intentionally not re-bundled here. Install those from [`anthropics/skills`](https://github.com/anthropics/skills) when you want the official versions.

`claude-api`
`frontend-design`
`skill-creator`
`anthropics/skills`

| Skill | Description |
| --- | --- |
| agent-introspection-debugging | Debug agent behavior, routing, and prompt boundaries |
| agent-sort | Sort agent catalogs and assignment surfaces |
| api-design | REST API design patterns |
| article-writing | Long-form writing from notes and voice references |
| backend-patterns | API design, database, caching |
| brand-voice | Source-derived writing style profiles from real content |
| bun-runtime | Bun as runtime, package manager, bundler, and test runner |
| coding-standards | Universal coding standards |
| content-engine | Platform-native social content and repurposing |
| crosspost | Multi-platform content distribution across X, LinkedIn, Threads |
| deep-research | Multi-source research with synthesis and source attribution |
| dmux-workflows | Multi-agent orchestration using tmux pane manager |
| documentation-lookup | Up-to-date library and framework docs via Context7 MCP |
| e2e-testing | Playwright E2E tests |
| eval-harness | Eval-driven development |
| everything-claude-code | Development conventions and patterns for the project |
| exa-search | Neural search via Exa MCP for web, code, company research |
| fal-ai-media | Unified media generation for images, video, and audio |
| frontend-patterns | React/Next.js patterns |
| frontend-slides | HTML presentations, PPTX conversion, visual style exploration |
| investor-materials | Decks, memos, models, and one-pagers |
| investor-outreach | Personalized outreach, follow-ups, and intro blurbs |
| market-research | Source-attributed market and competitor research |
| mcp-server-patterns | Build MCP servers with Node/TypeScript SDK |
| nextjs-turbopack | Next.js 16+ and Turbopack incremental bundling |
| product-capability | Translate product goals into scoped capability maps |
| security-review | Comprehensive security checklist |
| strategic-compact | Context management |
| tdd-workflow | Test-driven development with 80%+ coverage |
| verification-loop | Build, test, lint, typecheck, security |
| video-editing | AI-assisted video editing workflows with FFmpeg and Remotion |
| x-api | X/Twitter API integration for posting and analytics |

### Key Limitation

Codex does **not yet provide Claude-style hook execution parity**. ECC enforcement there is instruction-based via `AGENTS.md`, optional `model_instructions_file` overrides, and sandbox/approval settings.

`AGENTS.md`
`model_instructions_file`

### Multi-Agent Support

Current Codex builds support stable multi-agent workflows.

`features.multi_agent = true`
`.codex/config.toml`
`[agents.<name>]`
`.codex/agents/`
`/agent`

ECC ships three sample role configs:

| Role | Purpose |
| --- | --- |
| `explorer` | Read-only codebase evidence gathering before edits |
| `reviewer` | Correctness, security, and missing-test review |
| `docs_researcher` | Documentation and API verification before release/docs changes |

`explorer`
`reviewer`
`docs_researcher`

## Zed Support

ECC provides Zed project support through a conservative `.zed` adapter for project-local settings, flattened rules, agents, commands, and skills.

`.zed`

The adapter writes ECC-managed files under `.zed/` and keeps BYOK/OpenRouter credentials out of the repo. Configure Zed account or API keys through Zed's own settings UI or your local user settings.

`.zed/`

## OpenCode Support

ECC provides **full OpenCode support** including plugins and hooks.

### Quick Start

The configuration is automatically detected from `.opencode/opencode.json`.

`.opencode/opencode.json`

### Feature Parity

| Feature | Claude Code | OpenCode | Status |
| --- | --- | --- | --- |
| Agents | PASS: 63 agents | PASS: 12 agents | **Claude Code leads** |
| Commands | PASS: 79 commands | PASS: 35 commands | **Claude Code leads** |
| Skills | PASS: 249 skills | PASS: 37 skills | **Claude Code leads** |
| Hooks | PASS: 8 event types | PASS: 11 events | **OpenCode has more!** |
| Rules | PASS: 29 rules | PASS: 13 instructions | **Claude Code leads** |
| MCP Servers | PASS: 14 servers | PASS: Full | **Full parity** |
| Custom Tools | PASS: Via hooks | PASS: 6 native tools | **OpenCode is better** |

### Hook Support via Plugins

OpenCode's plugin system is MORE sophisticated than Claude Code with 20+ event types:

| Claude Code Hook | OpenCode Plugin Event |
| --- | --- |
| PreToolUse | `tool.execute.before` |
| PostToolUse | `tool.execute.after` |
| Stop | `session.idle` |
| SessionStart | `session.created` |
| SessionEnd | `session.deleted` |

`tool.execute.before`
`tool.execute.after`
`session.idle`
`session.created`
`session.deleted`

**Additional OpenCode events**: `file.edited`, `file.watcher.updated`, `message.updated`, `lsp.client.diagnostics`, `tui.toast.show`, and more.

`file.edited`
`file.watcher.updated`
`message.updated`
`lsp.client.diagnostics`
`tui.toast.show`

### Maintained Slash Entries

| Command | Description |
| --- | --- |
| `/plan` | Create implementation plan |
| `/code-review` | Review code changes |
| `/build-fix` | Fix build errors |
| `/refactor-clean` | Remove dead code |
| `/learn` | Extract patterns from session |
| `/checkpoint` | Save verification state |
| `/quality-gate` | Run the maintained verification gate |
| `/update-docs` | Update documentation |
| `/update-codemaps` | Update codemaps |
| `/test-coverage` | Analyze coverage |
| `/go-review` | Go code review |
| `/go-test` | Go TDD workflow |
| `/go-build` | Fix Go build errors |
| `/python-review` | Python code review (PEP 8, type hints, security) |
| `/multi-plan` | Multi-model collaborative planning |
| `/multi-execute` | Multi-model collaborative execution |
| `/multi-backend` | Backend-focused multi-model workflow |
| `/multi-frontend` | Frontend-focused multi-model workflow |
| `/multi-workflow` | Full multi-model development workflow |
| `/pm2` | Auto-generate PM2 service commands |
| `/sessions` | Manage session history |
| `/skill-create` | Generate skills from git |
| `/instinct-status` | View learned instincts |
| `/instinct-import` | Import instincts |
| `/instinct-export` | Export instincts |
| `/evolve` | Cluster instincts into skills |
| `/promote` | Promote project instincts to global scope |
| `/projects` | List known projects and instinct stats |
| `/prune` | Delete expired pending instincts (30d TTL) |
| `/learn-eval` | Extract and evaluate patterns before saving |
| `/setup-pm` | Configure package manager |
| `/harness-audit` | Audit harness reliability, eval readiness, and risk posture |
| `/loop-start` | Start controlled agentic loop execution pattern |
| `/loop-status` | Inspect active loop status and checkpoints |
| `/quality-gate` | Run quality gate checks for paths or entire repo |
| `/model-route` | Route tasks to models by complexity and budget |

`/plan`
`/code-review`
`/build-fix`
`/refactor-clean`
`/learn`
`/checkpoint`
`/quality-gate`
`/update-docs`
`/update-codemaps`
`/test-coverage`
`/go-review`
`/go-test`
`/go-build`
`/python-review`
`/multi-plan`
`/multi-execute`
`/multi-backend`
`/multi-frontend`
`/multi-workflow`
`/pm2`
`/sessions`
`/skill-create`
`/instinct-status`
`/instinct-import`
`/instinct-export`
`/evolve`
`/promote`
`/projects`
`/prune`
`/learn-eval`
`/setup-pm`
`/harness-audit`
`/loop-start`
`/loop-status`
`/quality-gate`
`/model-route`

### Plugin Installation

**Option 1: Use directly**

**Option 2: Install as npm package**

Then add to your `opencode.json`:

`opencode.json`

That npm plugin entry enables ECC's published OpenCode plugin module (hooks/events and plugin tools).
It does **not** automatically add ECC's full command/agent/instruction catalog to your project config.

For the full ECC OpenCode setup, either:

`.opencode/`
`instructions`
`agent`
`command`
`opencode.json`

### Documentation

`.opencode/MIGRATION.md`
`.opencode/README.md`
`.opencode/instructions/INSTRUCTIONS.md`
`llms.txt`

## GitHub Copilot Support

ECC provides **GitHub Copilot support** for VS Code via Copilot Chat's native instruction and prompt file system — no extra tooling required.

### What's Included

| Component | File | Purpose |
| --- | --- | --- |
| Core instructions | `.github/copilot-instructions.md` | Always-loaded rules: coding style, security, testing, git workflow |
| VS Code settings | `.vscode/settings.json` | Per-task instruction files for code gen, test gen, review, and commit messages |
| Plan prompt | `.github/prompts/plan.prompt.md` | Phased implementation planning |
| TDD prompt | `.github/prompts/tdd.prompt.md` | Red-Green-Improve cycle |
| Code review prompt | `.github/prompts/code-review.prompt.md` | Quality and security review |
| Security review prompt | `.github/prompts/security-review.prompt.md` | Deep OWASP-aligned security analysis |
| Build fix prompt | `.github/prompts/build-fix.prompt.md` | Systematic build and CI error resolution |
| Refactor prompt | `.github/prompts/refactor.prompt.md` | Dead code cleanup and simplification |

`.github/copilot-instructions.md`
`.vscode/settings.json`
`.github/prompts/plan.prompt.md`
`.github/prompts/tdd.prompt.md`
`.github/prompts/code-review.prompt.md`
`.github/prompts/security-review.prompt.md`
`.github/prompts/build-fix.prompt.md`
`.github/prompts/refactor.prompt.md`

### Quick Start (GitHub Copilot)

The files are already in place — open any repo that contains this project and GitHub Copilot Chat will automatically pick up `.github/copilot-instructions.md`.
The committed `.vscode/settings.json` enables `chat.promptFiles` so VS Code can load the reusable prompts from `.github/prompts/`.

`.github/copilot-instructions.md`
`.vscode/settings.json`
`chat.promptFiles`
`.github/prompts/`

To use the workflow prompts in Copilot Chat:

`/`
`plan`
`tdd`
`code-review`

### How It Works

GitHub Copilot in VS Code reads two types of files automatically:

`.github/copilot-instructions.md`
`.github/prompts/*.prompt.md`

The **`.vscode/settings.json`** adds per-task instruction overlays so Copilot receives the right context depending on whether you are generating code, writing tests, reviewing a selection, or drafting a commit message.

`.vscode/settings.json`

### Feature Coverage

| ECC Feature | Copilot equivalent |
| --- | --- |
| Coding standards | Always-on via `copilot-instructions.md` |
| Security checklist | Always-on + `security-review` prompt |
| Testing / TDD | Always-on + `tdd` prompt |
| Implementation planning | `plan` prompt |
| Code review | `code-review` prompt |
| Build error resolution | `build-fix` prompt |
| Refactoring | `refactor` prompt |
| Commit message format | Per-task instruction in `settings.json` |
| Hooks / automation | Not supported (Copilot has no hook system) |
| Agents / delegation | Not supported (Copilot has no subagent API) |

`copilot-instructions.md`
`security-review`
`tdd`
`plan`
`code-review`
`build-fix`
`refactor`
`settings.json`

### Limitations

GitHub Copilot does not have a hook system or a subagent API, so ECC's hook automations (auto-format, TypeScript check, session persistence, dev-server guard) and agent delegation are unavailable. The instruction and prompt layer still brings the full ECC coding philosophy — standards, security, TDD, and workflow — into every Copilot Chat session.

## Cross-Tool Feature Parity

ECC is the **first plugin to maximize every major AI coding tool**. Here's how each harness compares:

| Feature | Claude Code | Cursor IDE | Codex CLI | OpenCode | GitHub Copilot |
| --- | --- | --- | --- | --- | --- |
| **Agents** | 63 | Shared (AGENTS.md) | Shared (AGENTS.md) | 12 | N/A |
| **Commands** | 79 | Shared | Instruction-based | 35 | 6 prompts |
| **Skills** | 249 | Shared | 10 (native format) | 37 | Via instructions |
| **Hook Events** | 8 types | 15 types | None yet | 11 types | None |
| **Hook Scripts** | 20+ scripts | 16 scripts (DRY adapter) | N/A | Plugin hooks | N/A |
| **Rules** | 34 (common + lang) | 34 (YAML frontmatter) | Instruction-based | 13 instructions | 1 always-on file |
| **Custom Tools** | Via hooks | Via hooks | N/A | 6 native tools | N/A |
| **MCP Servers** | 14 | Shared (mcp.json) | 7 (auto-merged via TOML parser) | Full | N/A |
| **Config Format** | settings.json | hooks.json + rules/ | config.toml | opencode.json | copilot-instructions.md + settings.json |
| **Context File** | CLAUDE.md + AGENTS.md | AGENTS.md | AGENTS.md | AGENTS.md | copilot-instructions.md |
| **Secret Detection** | Hook-based | beforeSubmitPrompt hook | Sandbox-based | Hook-based | Instruction-based |
| **Auto-Format** | PostToolUse hook | afterFileEdit hook | N/A | file.edited hook | N/A |
| **Version** | Plugin | Plugin | Reference config | 2.0.0-rc.1 | Instruction layer |

**Key architectural decisions:**

`.github/copilot-instructions.md`
`AGENTS.md`
`model_instructions_file`

## Background

I've been using Claude Code since the experimental rollout. Won the Anthropic x Forum Ventures hackathon in Sep 2025 with [@DRodriguezFX](https://x.com/DRodriguezFX) — built [zenith.chat](https://zenith.chat) entirely using Claude Code.

These configs are battle-tested across multiple production applications.

## Token Optimization

Claude Code usage can be expensive if you don't manage token consumption. These settings significantly reduce costs without sacrificing quality.

### Recommended Settings

Add to `~/.claude/settings.json`:

`~/.claude/settings.json`

| Setting | Default | Recommended | Impact |
| --- | --- | --- | --- |
| `model` | opus | **sonnet** | ~60% cost reduction; handles 80%+ of coding tasks |
| `MAX_THINKING_TOKENS` | 31,999 | **10,000** | ~70% reduction in hidden thinking cost per request |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | 95 | **50** | Compacts earlier — better quality in long sessions |
| `ECC_CONTEXT_MONITOR_COST_WARNINGS` | on | **off for subscription users** | Suppresses agent-facing API-rate estimate warnings while keeping context/scope/loop warnings |

`model`
`MAX_THINKING_TOKENS`
`CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`
`ECC_CONTEXT_MONITOR_COST_WARNINGS`

Switch to Opus only when you need deep architectural reasoning:

`/model opus`

### Daily Workflow Commands

| Command | When to Use |
| --- | --- |
| `/model sonnet` | Default for most tasks |
| `/model opus` | Complex architecture, debugging, deep reasoning |
| `/clear` | Between unrelated tasks (free, instant reset) |
| `/compact` | At logical task breakpoints (research done, milestone complete) |
| `/cost` | Monitor token spending during session |

`/model sonnet`
`/model opus`
`/clear`
`/compact`
`/cost`

If you use a Claude subscription and the context monitor's API-rate estimates are not useful, set `ECC_CONTEXT_MONITOR_COST_WARNINGS=off`. This only suppresses the agent-facing cost warnings; it does not disable context exhaustion, scope, or loop warnings.

`ECC_CONTEXT_MONITOR_COST_WARNINGS=off`

### Strategic Compaction

The `strategic-compact` skill (included in this plugin) suggests `/compact` at logical breakpoints instead of relying on auto-compaction at 95% context. See `skills/strategic-compact/SKILL.md` for the full decision guide.

`strategic-compact`
`/compact`
`skills/strategic-compact/SKILL.md`

**When to compact:**

**When NOT to compact:**

### Context Window Management

**Critical:** Don't enable all MCPs at once. Each MCP tool description consumes tokens from your 200k window, potentially reducing it to ~70k.

`/mcp`
`~/.claude.json`
`ECC_DISABLED_MCPS`

### Agent Teams Cost Warning

Agent Teams spawns multiple context windows. Each teammate consumes tokens independently. Only use for tasks where parallelism provides clear value (multi-module work, parallel reviews). For simple sequential tasks, subagents are more token-efficient.

## WARNING: Important Notes

### Token Optimization

Hitting daily limits? See the **[Token Optimization Guide](/affaan-m/ECC/blob/main/docs/token-optimization.md)** for recommended settings and workflow tips.

Quick wins:

Use `/clear` between unrelated tasks, `/compact` at logical breakpoints, and `/cost` to monitor spending.

`/clear`
`/compact`
`/cost`

### Customization

These configs work for my workflow. You should:

## Community Projects

Projects built on or inspired by ECC:

| Project | Description |
| --- | --- |
| [EVC](https://github.com/SaigonXIII/evc) | Marketing agent workspace — 42 commands for content operators, brand governance, and multi-channel publishing. [Visual overview](https://saigonxiii.github.io/evc). |
| [trading-skills](https://github.com/VictorVVedtion/trading-skills) | 68 trading-themed Claude Code skills with pre-trade review prompts and risk gates inspired by market operators. |

Built something with ECC? Open a PR to add it here.

## Sponsors

This project is free and open source. Sponsors help keep it maintained and growing.

[**Become a Sponsor**](https://github.com/sponsors/affaan-m) | [Sponsor Tiers](/affaan-m/ECC/blob/main/SPONSORS.md) | [Sponsorship Program](/affaan-m/ECC/blob/main/SPONSORING.md)

## Star History

[![Star History Chart](https://camo.githubusercontent.com/17589e705dc9b9e877e7e45acb7281c298fdc5a55f3e86d61fa1acf10677493a/68747470733a2f2f6170692e737461722d686973746f72792e636f6d2f7376673f7265706f733d61666661616e2d6d2f45434326747970653d44617465)](https://star-history.com/#affaan-m/ECC&Date)

![Star History Chart](https://camo.githubusercontent.com/17589e705dc9b9e877e7e45acb7281c298fdc5a55f3e86d61fa1acf10677493a/68747470733a2f2f6170692e737461722d686973746f72792e636f6d2f7376673f7265706f733d61666661616e2d6d2f45434326747970653d44617465)

## Links

## License

MIT - Use freely, modify as needed, contribute back if you can.

**Star this repo if it helps. Read both guides. Build something great.**

## About

The agent harness performance optimization system. Skills, instincts, memory, security, and research-first development for Claude Code, Codex, Opencode, Cursor and beyond.

### Topics

### Resources

### License

### Code of conduct

### Contributing

### Security policy

### Uh oh!

There was an error while loading. Please reload this page.

There was an error while loading. Please reload this page.

### Stars

### Watchers

### Forks

## [Releases 13](/affaan-m/ECC/releases)

## Sponsor this project

### Uh oh!

There was an error while loading. Please reload this page.

There was an error while loading. Please reload this page.

## [Packages 0](/users/affaan-m/packages?repo_name=ECC)

### Uh oh!

There was an error while loading. Please reload this page.

There was an error while loading. Please reload this page.

### Uh oh!

There was an error while loading. Please reload this page.

There was an error while loading. Please reload this page.

## [Contributors](/affaan-m/ECC/graphs/contributors)

### Uh oh!

There was an error while loading. Please reload this page.

There was an error while loading. Please reload this page.

## Languages

## Footer

### Footer navigation
