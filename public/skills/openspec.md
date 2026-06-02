---
slug: openspec
name: OpenSpec
category: 编码开发与工程规范
tags:
  - spec-driven-development
  - ai-workflow
  - cli-tool
  - project-management
description: >-
  OpenSpec 是一个基于规范的 AI 原生工作流工具，帮助开发者用自然语言描述变更，自动生成提案、规范文档、设计说明和任务清单，并引导 AI
  逐步实现与归档。它适用于从个人项目到企业级应用的迭代开发，让开发流程更轻量、灵活。
install: npm install -g @fission-ai/openspec && openspec init
source: 'https://github.com/Fission-AI/OpenSpec'
---
## 如何使用本 Skill

### 适用场景
- 为新功能快速生成开发规范、任务拆解和实现方案
- 对现有项目进行迭代变更，自动生成变更提案并跟踪实现
- 与 AI 编程助手配合，将自然语言需求直接转换为可执行的开发步骤

### 基本用法
1. 全局安装后，在项目根目录执行 `openspec init` 初始化。
2. 在 AI 对话中使用 `/opsx:propose <你的想法>` 生成变更目录，包含 `proposal.md`、`specs/`、`design.md` 和 `tasks.md`。
3. 用 `/opsx:apply` 让 AI 按任务清单逐步实现。
4. 完成后使用 `/opsx:archive` 归档变更并更新主规范文件。

### 关键配置
- 可通过 `openspec config profile` 选择扩展工作流（如 `/opsx:new`、`/opsx:continue` 等），并使用 `openspec update` 应用。
- 支持多种包管理器（npm、pnpm、yarn、bun）和 nix 安装方式，详见文档。
- 需要 Node.js 20.19.0 或更高版本。

### 注意事项
- 使用时确保 AI 工具已正确配置并支持 OpenSpec 的斜杠命令（支持 25+ 款工具）。
- 生成的规范文件均存放在 `openspec/changes/` 目录下，需纳入版本控制以保证团队一致性。
- 复杂项目建议结合 `design.md` 与现有代码上下文，确保 AI 生成的实现方案可靠。

---

## Navigation Menu

# Search code, repositories, users, issues, pull requests...

# Provide feedback

We read every piece of feedback, and take your input very seriously.

# Saved searches

## Use saved searches to filter your results more quickly

To see all available qualifiers, see our [documentation](https://docs.github.com/search-github/github-code-search/understanding-github-code-search-syntax).

# Fission-AI/OpenSpec

## Folders and files

| Name | | Name | Last commit message | Last commit date |
| --- | --- | --- | --- | --- |
| Latest commit   History[598 Commits](/Fission-AI/OpenSpec/commits/main/)   598 Commits | | |
| [.changeset](/Fission-AI/OpenSpec/tree/main/.changeset ".changeset") | | [.changeset](/Fission-AI/OpenSpec/tree/main/.changeset ".changeset") |  |  |
| [.devcontainer](/Fission-AI/OpenSpec/tree/main/.devcontainer ".devcontainer") | | [.devcontainer](/Fission-AI/OpenSpec/tree/main/.devcontainer ".devcontainer") |  |  |
| [.github](/Fission-AI/OpenSpec/tree/main/.github ".github") | | [.github](/Fission-AI/OpenSpec/tree/main/.github ".github") |  |  |
| [assets](/Fission-AI/OpenSpec/tree/main/assets "assets") | | [assets](/Fission-AI/OpenSpec/tree/main/assets "assets") |  |  |
| [bin](/Fission-AI/OpenSpec/tree/main/bin "bin") | | [bin](/Fission-AI/OpenSpec/tree/main/bin "bin") |  |  |
| [docs](/Fission-AI/OpenSpec/tree/main/docs "docs") | | [docs](/Fission-AI/OpenSpec/tree/main/docs "docs") |  |  |
| [openspec](/Fission-AI/OpenSpec/tree/main/openspec "openspec") | | [openspec](/Fission-AI/OpenSpec/tree/main/openspec "openspec") |  |  |
| [schemas](/Fission-AI/OpenSpec/tree/main/schemas "schemas") | | [schemas](/Fission-AI/OpenSpec/tree/main/schemas "schemas") |  |  |
| [scripts](/Fission-AI/OpenSpec/tree/main/scripts "scripts") | | [scripts](/Fission-AI/OpenSpec/tree/main/scripts "scripts") |  |  |
| [src](/Fission-AI/OpenSpec/tree/main/src "src") | | [src](/Fission-AI/OpenSpec/tree/main/src "src") |  |  |
| [test](/Fission-AI/OpenSpec/tree/main/test "test") | | [test](/Fission-AI/OpenSpec/tree/main/test "test") |  |  |
| [.actrc](/Fission-AI/OpenSpec/blob/main/.actrc ".actrc") | | [.actrc](/Fission-AI/OpenSpec/blob/main/.actrc ".actrc") |  |  |
| [.coderabbit.yaml](/Fission-AI/OpenSpec/blob/main/.coderabbit.yaml ".coderabbit.yaml") | | [.coderabbit.yaml](/Fission-AI/OpenSpec/blob/main/.coderabbit.yaml ".coderabbit.yaml") |  |  |
| [.gitignore](/Fission-AI/OpenSpec/blob/main/.gitignore ".gitignore") | | [.gitignore](/Fission-AI/OpenSpec/blob/main/.gitignore ".gitignore") |  |  |
| [AGENTS.md](/Fission-AI/OpenSpec/blob/main/AGENTS.md "AGENTS.md") | | [AGENTS.md](/Fission-AI/OpenSpec/blob/main/AGENTS.md "AGENTS.md") |  |  |
| [CHANGELOG.md](/Fission-AI/OpenSpec/blob/main/CHANGELOG.md "CHANGELOG.md") | | [CHANGELOG.md](/Fission-AI/OpenSpec/blob/main/CHANGELOG.md "CHANGELOG.md") |  |  |
| [LICENSE](/Fission-AI/OpenSpec/blob/main/LICENSE "LICENSE") | | [LICENSE](/Fission-AI/OpenSpec/blob/main/LICENSE "LICENSE") |  |  |
| [MAINTAINERS.md](/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md "MAINTAINERS.md") | | [MAINTAINERS.md](/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md "MAINTAINERS.md") |  |  |
| [README.md](/Fission-AI/OpenSpec/blob/main/README.md "README.md") | | [README.md](/Fission-AI/OpenSpec/blob/main/README.md "README.md") |  |  |
| [README\_OLD.md](/Fission-AI/OpenSpec/blob/main/README_OLD.md "README_OLD.md") | | [README\_OLD.md](/Fission-AI/OpenSpec/blob/main/README_OLD.md "README_OLD.md") |  |  |
| [build.js](/Fission-AI/OpenSpec/blob/main/build.js "build.js") | | [build.js](/Fission-AI/OpenSpec/blob/main/build.js "build.js") |  |  |
| [eslint.config.js](/Fission-AI/OpenSpec/blob/main/eslint.config.js "eslint.config.js") | | [eslint.config.js](/Fission-AI/OpenSpec/blob/main/eslint.config.js "eslint.config.js") |  |  |
| [flake.lock](/Fission-AI/OpenSpec/blob/main/flake.lock "flake.lock") | | [flake.lock](/Fission-AI/OpenSpec/blob/main/flake.lock "flake.lock") |  |  |
| [flake.nix](/Fission-AI/OpenSpec/blob/main/flake.nix "flake.nix") | | [flake.nix](/Fission-AI/OpenSpec/blob/main/flake.nix "flake.nix") |  |  |
| [openspec-parallel-merge-plan.md](/Fission-AI/OpenSpec/blob/main/openspec-parallel-merge-plan.md "openspec-parallel-merge-plan.md") | | [openspec-parallel-merge-plan.md](/Fission-AI/OpenSpec/blob/main/openspec-parallel-merge-plan.md "openspec-parallel-merge-plan.md") |  |  |
| [package-lock.json](/Fission-AI/OpenSpec/blob/main/package-lock.json "package-lock.json") | | [package-lock.json](/Fission-AI/OpenSpec/blob/main/package-lock.json "package-lock.json") |  |  |
| [package.json](/Fission-AI/OpenSpec/blob/main/package.json "package.json") | | [package.json](/Fission-AI/OpenSpec/blob/main/package.json "package.json") |  |  |
| [pnpm-lock.yaml](/Fission-AI/OpenSpec/blob/main/pnpm-lock.yaml "pnpm-lock.yaml") | | [pnpm-lock.yaml](/Fission-AI/OpenSpec/blob/main/pnpm-lock.yaml "pnpm-lock.yaml") |  |  |
| [tsconfig.json](/Fission-AI/OpenSpec/blob/main/tsconfig.json "tsconfig.json") | | [tsconfig.json](/Fission-AI/OpenSpec/blob/main/tsconfig.json "tsconfig.json") |  |  |
| [vitest.config.ts](/Fission-AI/OpenSpec/blob/main/vitest.config.ts "vitest.config.ts") | | [vitest.config.ts](/Fission-AI/OpenSpec/blob/main/vitest.config.ts "vitest.config.ts") |  |  |
| [vitest.setup.ts](/Fission-AI/OpenSpec/blob/main/vitest.setup.ts "vitest.setup.ts") | | [vitest.setup.ts](/Fission-AI/OpenSpec/blob/main/vitest.setup.ts "vitest.setup.ts") |  |  |
| View all files | | |

## Latest commit

## History

## Repository files navigation

[![OpenSpec logo](/Fission-AI/OpenSpec/raw/main/assets/openspec_bg.png)](https://github.com/Fission-AI/OpenSpec)

![OpenSpec logo](/Fission-AI/OpenSpec/raw/main/assets/openspec_bg.png)

[![CI](https://github.com/Fission-AI/OpenSpec/actions/workflows/ci.yml/badge.svg)](https://github.com/Fission-AI/OpenSpec/actions/workflows/ci.yml)
[![npm version](https://camo.githubusercontent.com/92a019ce6fd31fc491a16699f7aa9c4335ef1524dfdfff013ff2f452ee0c0a12/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f4066697373696f6e2d61692f6f70656e737065633f7374796c653d666c61742d737175617265)](https://www.npmjs.com/package/@fission-ai/openspec)
[![License: MIT](https://camo.githubusercontent.com/a7e65aee57b11d28e4caff8b945729a66be0bb663f7f93bd24c5aa65699f148e/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c6963656e73652d4d49542d626c75652e7376673f7374796c653d666c61742d737175617265)](/Fission-AI/OpenSpec/blob/main/LICENSE)
[![Discord](https://camo.githubusercontent.com/16ee4b54d4a90482064b54dc0d6e98634e967c2c2083965d8a7ed3031401dc3e/68747470733a2f2f696d672e736869656c64732e696f2f646973636f72642f313431313635373039353633393630313135343f7374796c653d666c61742d737175617265266c6f676f3d646973636f7264266c6f676f436f6c6f723d7768697465266c6162656c3d446973636f7264267375666669783d2532306f6e6c696e65)](https://discord.gg/YctCnvvshC)

![CI](https://github.com/Fission-AI/OpenSpec/actions/workflows/ci.yml/badge.svg)
![npm version](https://camo.githubusercontent.com/92a019ce6fd31fc491a16699f7aa9c4335ef1524dfdfff013ff2f452ee0c0a12/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f4066697373696f6e2d61692f6f70656e737065633f7374796c653d666c61742d737175617265)
![License: MIT](https://camo.githubusercontent.com/a7e65aee57b11d28e4caff8b945729a66be0bb663f7f93bd24c5aa65699f148e/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c6963656e73652d4d49542d626c75652e7376673f7374796c653d666c61742d737175617265)
![Discord](https://camo.githubusercontent.com/16ee4b54d4a90482064b54dc0d6e98634e967c2c2083965d8a7ed3031401dc3e/68747470733a2f2f696d672e736869656c64732e696f2f646973636f72642f313431313635373039353633393630313135343f7374796c653d666c61742d737175617265266c6f676f3d646973636f7264266c6f676f436f6c6f723d7768697465266c6162656c3d446973636f7264267375666669783d2532306f6e6c696e65)

[![Stars](https://camo.githubusercontent.com/eb498313abafd00ced2c50720e4848b77f9698259a7b135e6c5e76d7e813c9cf/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f73746172732f46697373696f6e2d41492f4f70656e537065633f7374796c653d666c61742d737175617265266c6162656c3d5374617273)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://camo.githubusercontent.com/f7d69851f27d4a01df2825849a8347443c94e89a5d7cbabdb6a7a04cbfea8581/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f646d2f4066697373696f6e2d61692f6f70656e737065633f7374796c653d666c61742d737175617265266c6162656c3d446f776e6c6f6164732f6d6f)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://camo.githubusercontent.com/23f6dc42c098714108cc16e29333a10fe1dcb4eedd54cab134111250b6d213d5/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f636f6e7472696275746f72732f46697373696f6e2d41492f4f70656e537065633f7374796c653d666c61742d737175617265266c6162656c3d436f6e7472696275746f7273)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

![Stars](https://camo.githubusercontent.com/eb498313abafd00ced2c50720e4848b77f9698259a7b135e6c5e76d7e813c9cf/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f73746172732f46697373696f6e2d41492f4f70656e537065633f7374796c653d666c61742d737175617265266c6162656c3d5374617273)
![Downloads](https://camo.githubusercontent.com/f7d69851f27d4a01df2825849a8347443c94e89a5d7cbabdb6a7a04cbfea8581/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f646d2f4066697373696f6e2d61692f6f70656e737065633f7374796c653d666c61742d737175617265266c6162656c3d446f776e6c6f6164732f6d6f)
![Contributors](https://camo.githubusercontent.com/23f6dc42c098714108cc16e29333a10fe1dcb4eedd54cab134111250b6d213d5/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f636f6e7472696275746f72732f46697373696f6e2d41492f4f70656e537065633f7374796c653d666c61742d737175617265266c6162656c3d436f6e7472696275746f7273)`→ fluid not rigid
→ iterative not waterfall
→ easy not complex
→ built for brownfield not just greenfield
→ scalable from personal projects to enterprises`

Tip

**New workflow now available!** We've rebuilt OpenSpec with a new artifact-guided workflow.

Run `/opsx:propose "your idea"` to get started. → [Learn more here](/Fission-AI/OpenSpec/blob/main/docs/opsx.md)

`/opsx:propose "your idea"`

Follow [@0xTab on X](https://x.com/0xTab) for updates · Join the [OpenSpec Discord](https://discord.gg/YctCnvvshC) for help and questions.

## See it in action

`You: /opsx:propose add-dark-mode
AI: Created openspec/changes/add-dark-mode/
✓ proposal.md — why we're doing this, what's changing
✓ specs/ — requirements and scenarios
✓ design.md — technical approach
✓ tasks.md — implementation checklist
Ready for implementation!
You: /opsx:apply
AI: Implementing tasks...
✓ 1.1 Add theme context provider
✓ 1.2 Create toggle component
✓ 2.1 Add CSS variables
✓ 2.2 Wire up localStorage
All tasks complete!
You: /opsx:archive
AI: Archived to openspec/changes/archive/2025-01-23-add-dark-mode/
Specs updated. Ready for the next feature.`

[![OpenSpec dashboard preview](/Fission-AI/OpenSpec/raw/main/assets/openspec_dashboard.png)](/Fission-AI/OpenSpec/blob/main/assets/openspec_dashboard.png)

![OpenSpec dashboard preview](/Fission-AI/OpenSpec/raw/main/assets/openspec_dashboard.png)

## Quick Start

**Requires Node.js 20.19.0 or higher.**

Install OpenSpec globally:

Then navigate to your project directory and initialize:

Now tell your AI: `/opsx:propose <what-you-want-to-build>`

`/opsx:propose <what-you-want-to-build>`

If you want the expanded workflow (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), select it with `openspec config profile` and apply with `openspec update`.

`/opsx:new`
`/opsx:continue`
`/opsx:ff`
`/opsx:verify`
`/opsx:bulk-archive`
`/opsx:onboard`
`openspec config profile`
`openspec update`

Note

Not sure if your tool is supported? [View the full list](/Fission-AI/OpenSpec/blob/main/docs/supported-tools.md) – we support 25+ tools and growing.

Also works with pnpm, yarn, bun, and nix. [See installation options](/Fission-AI/OpenSpec/blob/main/docs/installation.md).

## Docs

→ **[Getting Started](/Fission-AI/OpenSpec/blob/main/docs/getting-started.md)**: first steps  
→ **[Workflows](/Fission-AI/OpenSpec/blob/main/docs/workflows.md)**: combos and patterns  
→ **[Commands](/Fission-AI/OpenSpec/blob/main/docs/commands.md)**: slash commands & skills  
→ **[CLI](/Fission-AI/OpenSpec/blob/main/docs/cli.md)**: terminal reference  
→ **[Supported Tools](/Fission-AI/OpenSpec/blob/main/docs/supported-tools.md)**: tool integrations & install paths  
→ **[Concepts](/Fission-AI/OpenSpec/blob/main/docs/concepts.md)**: how it all fits  
→ **[Multi-Language](/Fission-AI/OpenSpec/blob/main/docs/multi-language.md)**: multi-language support  
→ **[Customization](/Fission-AI/OpenSpec/blob/main/docs/customization.md)**: make it yours

## Community schemas

Third-party schema bundles distributed via standalone repositories — these provide opinionated workflows that integrate OpenSpec with other tools, similar to how [github/spec-kit's community extension catalog](https://github.com/github/spec-kit/tree/main/extensions) handles tool integrations.

→ **[Browse the catalog](/Fission-AI/OpenSpec/blob/main/docs/customization.md#community-schemas)** in the customization docs.

## Why OpenSpec?

AI coding assistants are powerful but unpredictable when requirements live only in chat history. OpenSpec adds a lightweight spec layer so you agree on what to build before any code is written.

### How we compare

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Thorough but heavyweight. Rigid phase gates, lots of Markdown, Python setup. OpenSpec is lighter and lets you iterate freely.

**vs. [Kiro](https://kiro.dev)** (AWS) — Powerful but you're locked into their IDE and limited to Claude models. OpenSpec works with the tools you already use.

**vs. nothing** — AI coding without specs means vague prompts and unpredictable results. OpenSpec brings predictability without the ceremony.

## Updating OpenSpec

**Upgrade the package**

**Refresh agent instructions**

Run this inside each project to regenerate AI guidance and ensure the latest slash commands are active:

## Usage Notes

**Model selection**: OpenSpec works best with high-reasoning models. We recommend Codex 5.5 and Opus 4.7 for both planning and implementation.

**Context hygiene**: OpenSpec benefits from a clean context window. Clear your context before starting implementation and maintain good context hygiene throughout your session.

## Contributing

**Small fixes** — Bug fixes, typo corrections, and minor improvements can be submitted directly as PRs.

**Larger changes** — For new features, significant refactors, or architectural changes, please submit an OpenSpec change proposal first so we can align on intent and goals before implementation begins.

When writing proposals, keep the OpenSpec philosophy in mind: we serve a wide variety of users across different coding agents, models, and use cases. Changes should work well for everyone.

**AI-generated code is welcome** — as long as it's been tested and verified. PRs containing AI-generated code should mention the coding agent and model used (e.g., "Generated with Claude Code using claude-opus-4-5-20251101").

### Development

`pnpm install`
`pnpm run build`
`pnpm test`
`pnpm run dev`
`pnpm run dev:cli`
`type(scope): subject`

## Other

OpenSpec collects anonymous usage stats.

We collect only command names and version to understand usage patterns. No arguments, paths, content, or PII. Automatically disabled in CI.

**Opt-out:** `export OPENSPEC_TELEMETRY=0` or `export DO_NOT_TRACK=1`

`export OPENSPEC_TELEMETRY=0`
`export DO_NOT_TRACK=1`

See [MAINTAINERS.md](/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) for the list of core maintainers and advisors who help guide the project.

## License

MIT

## About

Spec-driven development (SDD) for AI coding assistants.

### Topics

### Resources

### License

### Uh oh!

There was an error while loading. Please reload this page.

There was an error while loading. Please reload this page.

### Stars

### Watchers

### Forks

## [Releases 36](/Fission-AI/OpenSpec/releases)

## [Packages 0](/orgs/Fission-AI/packages?repo_name=OpenSpec)

### Uh oh!

There was an error while loading. Please reload this page.

There was an error while loading. Please reload this page.

### Uh oh!

There was an error while loading. Please reload this page.

There was an error while loading. Please reload this page.

## [Contributors](/Fission-AI/OpenSpec/graphs/contributors)

### Uh oh!

There was an error while loading. Please reload this page.

There was an error while loading. Please reload this page.

## Languages

## Footer

### Footer navigation
