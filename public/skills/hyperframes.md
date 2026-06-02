---
slug: hyperframes
name: hyperframes
category: 内容创作与自媒体
tags:
  - 视频生成
  - HTML转视频
  - AI代理
description: >-
  HyperFrames 是一个开源框架，能将 HTML、CSS、媒体和可寻址动画转换为确定性的 MP4 视频。它既可以通过 AI
  编码代理的技能一键生成视频，也支持 CLI 本地使用，适合快速创作产品介绍、宣传片等视频内容。
source: 'https://github.com/heygen-com/hyperframes'
---
## 如何使用本 Skill

### 适用场景
- 借助 AI 编码代理（如 Claude Code、Cursor）用自然语言描述需求，快速生成产品介绍、社交媒体短视频或广告片。
- 将已有的 HTML/CSS 动画或网页设计转化为高质量 MP4，用于演示、分享或嵌入其他项目。
- 在自动化流程中批量产出视频，例如定期生成数据可视化动画或动态报告。

### 基本用法
1. **AI 代理模式**：在支持的编码代理中安装 HyperFrames 技能，使用 `/hyperframes` 指令描述想要的视频内容，代理会自动规划、编写 HTML、配置动画与媒体，并渲染出 MP4。
2. **CLI 手动模式**：确保已安装 Node.js 22+ 和 FFmpeg，编写符合 HyperFrames 规范的 HTML 文件，然后运行渲染命令输出视频。

### 关键配置
- 运行环境需满足 **Node.js 22+** 与 **FFmpeg**，后者必须可从命令行直接调用。
- 可选配置环境变量（参考 `.env.example`），例如 API 密钥，以启用高级功能。
- HTML 需遵循 HyperFrames 的特定属性约定来实现可寻址动画和媒体嵌入，细节查阅官方文档。

### 注意事项
- 渲染具有确定性：相同的输入永远产生完全一样的输出，便于版本控制和调试。
- 确保 HTML 代码遵守框架的语法限制，避免使用不支持的 CSS 特性导致渲染失败或非预期结果。
- 如果使用 AI 代理，建议参考官方 Showcase 和设计指南，以获得更准确的视频效果。

---

## Navigation Menu

# Search code, repositories, users, issues, pull requests...

# Provide feedback

We read every piece of feedback, and take your input very seriously.

# Saved searches

## Use saved searches to filter your results more quickly

To see all available qualifiers, see our [documentation](https://docs.github.com/search-github/github-code-search/understanding-github-code-search-syntax).

# heygen-com/hyperframes

## Folders and files

| Name | | Name | Last commit message | Last commit date |
| --- | --- | --- | --- | --- |
| Latest commit   History[1,498 Commits](/heygen-com/hyperframes/commits/main/)   1,498 Commits | | |
| [.claude-plugin](/heygen-com/hyperframes/tree/main/.claude-plugin ".claude-plugin") | | [.claude-plugin](/heygen-com/hyperframes/tree/main/.claude-plugin ".claude-plugin") |  |  |
| [.claude](/heygen-com/hyperframes/tree/main/.claude ".claude") | | [.claude](/heygen-com/hyperframes/tree/main/.claude ".claude") |  |  |
| [.codex-plugin](/heygen-com/hyperframes/tree/main/.codex-plugin ".codex-plugin") | | [.codex-plugin](/heygen-com/hyperframes/tree/main/.codex-plugin ".codex-plugin") |  |  |
| [.cursor-plugin](/heygen-com/hyperframes/tree/main/.cursor-plugin ".cursor-plugin") | | [.cursor-plugin](/heygen-com/hyperframes/tree/main/.cursor-plugin ".cursor-plugin") |  |  |
| [.github](/heygen-com/hyperframes/tree/main/.github ".github") | | [.github](/heygen-com/hyperframes/tree/main/.github ".github") |  |  |
| [assets](/heygen-com/hyperframes/tree/main/assets "assets") | | [assets](/heygen-com/hyperframes/tree/main/assets "assets") |  |  |
| [docs](/heygen-com/hyperframes/tree/main/docs "docs") | | [docs](/heygen-com/hyperframes/tree/main/docs "docs") |  |  |
| [examples](/heygen-com/hyperframes/tree/main/examples "examples") | | [examples](/heygen-com/hyperframes/tree/main/examples "examples") |  |  |
| [packages](/heygen-com/hyperframes/tree/main/packages "packages") | | [packages](/heygen-com/hyperframes/tree/main/packages "packages") |  |  |
| [registry](/heygen-com/hyperframes/tree/main/registry "registry") | | [registry](/heygen-com/hyperframes/tree/main/registry "registry") |  |  |
| [scripts](/heygen-com/hyperframes/tree/main/scripts "scripts") | | [scripts](/heygen-com/hyperframes/tree/main/scripts "scripts") |  |  |
| [skills](/heygen-com/hyperframes/tree/main/skills "skills") | | [skills](/heygen-com/hyperframes/tree/main/skills "skills") |  |  |
| [.editorconfig](/heygen-com/hyperframes/blob/main/.editorconfig ".editorconfig") | | [.editorconfig](/heygen-com/hyperframes/blob/main/.editorconfig ".editorconfig") |  |  |
| [.env.example](/heygen-com/hyperframes/blob/main/.env.example ".env.example") | | [.env.example](/heygen-com/hyperframes/blob/main/.env.example ".env.example") |  |  |
| [.fallowrc.jsonc](/heygen-com/hyperframes/blob/main/.fallowrc.jsonc ".fallowrc.jsonc") | | [.fallowrc.jsonc](/heygen-com/hyperframes/blob/main/.fallowrc.jsonc ".fallowrc.jsonc") |  |  |
| [.gitattributes](/heygen-com/hyperframes/blob/main/.gitattributes ".gitattributes") | | [.gitattributes](/heygen-com/hyperframes/blob/main/.gitattributes ".gitattributes") |  |  |
| [.gitignore](/heygen-com/hyperframes/blob/main/.gitignore ".gitignore") | | [.gitignore](/heygen-com/hyperframes/blob/main/.gitignore ".gitignore") |  |  |
| [.oxfmtrc.json](/heygen-com/hyperframes/blob/main/.oxfmtrc.json ".oxfmtrc.json") | | [.oxfmtrc.json](/heygen-com/hyperframes/blob/main/.oxfmtrc.json ".oxfmtrc.json") |  |  |
| [.oxlintrc.json](/heygen-com/hyperframes/blob/main/.oxlintrc.json ".oxlintrc.json") | | [.oxlintrc.json](/heygen-com/hyperframes/blob/main/.oxlintrc.json ".oxlintrc.json") |  |  |
| [.prettierignore](/heygen-com/hyperframes/blob/main/.prettierignore ".prettierignore") | | [.prettierignore](/heygen-com/hyperframes/blob/main/.prettierignore ".prettierignore") |  |  |
| [ADOPTERS.md](/heygen-com/hyperframes/blob/main/ADOPTERS.md "ADOPTERS.md") | | [ADOPTERS.md](/heygen-com/hyperframes/blob/main/ADOPTERS.md "ADOPTERS.md") |  |  |
| [AGENTS.md](/heygen-com/hyperframes/blob/main/AGENTS.md "AGENTS.md") | | [AGENTS.md](/heygen-com/hyperframes/blob/main/AGENTS.md "AGENTS.md") |  |  |
| [CLAUDE.md](/heygen-com/hyperframes/blob/main/CLAUDE.md "CLAUDE.md") | | [CLAUDE.md](/heygen-com/hyperframes/blob/main/CLAUDE.md "CLAUDE.md") |  |  |
| [CODE\_OF\_CONDUCT.md](/heygen-com/hyperframes/blob/main/CODE_OF_CONDUCT.md "CODE_OF_CONDUCT.md") | | [CODE\_OF\_CONDUCT.md](/heygen-com/hyperframes/blob/main/CODE_OF_CONDUCT.md "CODE_OF_CONDUCT.md") |  |  |
| [CONTRIBUTING.md](/heygen-com/hyperframes/blob/main/CONTRIBUTING.md "CONTRIBUTING.md") | | [CONTRIBUTING.md](/heygen-com/hyperframes/blob/main/CONTRIBUTING.md "CONTRIBUTING.md") |  |  |
| [CREDITS.md](/heygen-com/hyperframes/blob/main/CREDITS.md "CREDITS.md") | | [CREDITS.md](/heygen-com/hyperframes/blob/main/CREDITS.md "CREDITS.md") |  |  |
| [DESIGN.md](/heygen-com/hyperframes/blob/main/DESIGN.md "DESIGN.md") | | [DESIGN.md](/heygen-com/hyperframes/blob/main/DESIGN.md "DESIGN.md") |  |  |
| [DOCS\_GUIDELINES.md](/heygen-com/hyperframes/blob/main/DOCS_GUIDELINES.md "DOCS_GUIDELINES.md") | | [DOCS\_GUIDELINES.md](/heygen-com/hyperframes/blob/main/DOCS_GUIDELINES.md "DOCS_GUIDELINES.md") |  |  |
| [Dockerfile.test](/heygen-com/hyperframes/blob/main/Dockerfile.test "Dockerfile.test") | | [Dockerfile.test](/heygen-com/hyperframes/blob/main/Dockerfile.test "Dockerfile.test") |  |  |
| [LICENSE](/heygen-com/hyperframes/blob/main/LICENSE "LICENSE") | | [LICENSE](/heygen-com/hyperframes/blob/main/LICENSE "LICENSE") |  |  |
| [README.md](/heygen-com/hyperframes/blob/main/README.md "README.md") | | [README.md](/heygen-com/hyperframes/blob/main/README.md "README.md") |  |  |
| [SECURITY.md](/heygen-com/hyperframes/blob/main/SECURITY.md "SECURITY.md") | | [SECURITY.md](/heygen-com/hyperframes/blob/main/SECURITY.md "SECURITY.md") |  |  |
| [bun.lock](/heygen-com/hyperframes/blob/main/bun.lock "bun.lock") | | [bun.lock](/heygen-com/hyperframes/blob/main/bun.lock "bun.lock") |  |  |
| [commitlint.config.js](/heygen-com/hyperframes/blob/main/commitlint.config.js "commitlint.config.js") | | [commitlint.config.js](/heygen-com/hyperframes/blob/main/commitlint.config.js "commitlint.config.js") |  |  |
| [knip.config.ts](/heygen-com/hyperframes/blob/main/knip.config.ts "knip.config.ts") | | [knip.config.ts](/heygen-com/hyperframes/blob/main/knip.config.ts "knip.config.ts") |  |  |
| [lefthook.yml](/heygen-com/hyperframes/blob/main/lefthook.yml "lefthook.yml") | | [lefthook.yml](/heygen-com/hyperframes/blob/main/lefthook.yml "lefthook.yml") |  |  |
| [package.json](/heygen-com/hyperframes/blob/main/package.json "package.json") | | [package.json](/heygen-com/hyperframes/blob/main/package.json "package.json") |  |  |
| View all files | | |

## Latest commit

## History

## Repository files navigation

![HyperFrames](/heygen-com/hyperframes/raw/main/docs/logo/light.svg)

![HyperFrames](/heygen-com/hyperframes/raw/main/docs/logo/light.svg)

[![npm version](https://camo.githubusercontent.com/b8643453515dfda8f49c33fd1bdfae98c4c77456d7c08f4c8f91bee2304b2d09/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f68797065726672616d65732e7376673f7374796c653d666c6174)](https://www.npmjs.com/package/hyperframes)
[![npm downloads](https://camo.githubusercontent.com/eb7798624e2ddb93aefb878000f8002187b81e5fb11e3d4b40db7a9085b359dd/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f646d2f68797065726672616d65732e7376673f7374796c653d666c6174)](https://www.npmjs.com/package/hyperframes)
[![License](https://camo.githubusercontent.com/b29de0acdfd19013f1f02689b15c933e4a6c145be9efa718288f88ba3280b1c5/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d417061636865253230322e302d626c75652e737667)](/heygen-com/hyperframes/blob/main/LICENSE)
[![Node.js](https://camo.githubusercontent.com/21df03c5ec135a4f3c1cc7b0c236c82f962fb52b8ce79012d54f10dc441c47a4/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6e6f64652d25334525334432322d627269676874677265656e)](https://nodejs.org)
[![Discord](https://camo.githubusercontent.com/397741123d69503a0a224452a3629154669e9a870686f0c21c68527c7d8faa07/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446973636f72642d4a6f696e2d3538363546323f6c6f676f3d646973636f7264266c6f676f436f6c6f723d7768697465)](https://discord.gg/EbK98HBPdk)

![npm version](https://camo.githubusercontent.com/b8643453515dfda8f49c33fd1bdfae98c4c77456d7c08f4c8f91bee2304b2d09/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f68797065726672616d65732e7376673f7374796c653d666c6174)
![npm downloads](https://camo.githubusercontent.com/eb7798624e2ddb93aefb878000f8002187b81e5fb11e3d4b40db7a9085b359dd/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f646d2f68797065726672616d65732e7376673f7374796c653d666c6174)
![License](https://camo.githubusercontent.com/b29de0acdfd19013f1f02689b15c933e4a6c145be9efa718288f88ba3280b1c5/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d417061636865253230322e302d626c75652e737667)
![Node.js](https://camo.githubusercontent.com/21df03c5ec135a4f3c1cc7b0c236c82f962fb52b8ce79012d54f10dc441c47a4/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6e6f64652d25334525334432322d627269676874677265656e)
![Discord](https://camo.githubusercontent.com/397741123d69503a0a224452a3629154669e9a870686f0c21c68527c7d8faa07/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446973636f72642d4a6f696e2d3538363546323f6c6f676f3d646973636f7264266c6f676f436f6c6f723d7768697465)

**Write HTML. Render video. Built for agents.**

[Quickstart](https://hyperframes.heygen.com/quickstart) |
[Showcase](https://hyperframes.heygen.com/showcase) |
[Playground](https://www.hyperframes.dev/) |
[Catalog](https://hyperframes.heygen.com/catalog/blocks/data-chart) |
[Docs](https://hyperframes.heygen.com/introduction) |
[Discord](https://discord.gg/EbK98HBPdk)

[![HyperFrames demo: HTML code on the left transforms into a rendered video on the right](https://camo.githubusercontent.com/58d14bd8fe5428a03b15429ad1bc46ab09b0183c50e99a10eadae502b3d57e90/68747470733a2f2f7374617469632e68657967656e2e61692f68797065726672616d65732d6f73732f646f63732f696d616765732f68666769662d313238302e77656270)](https://camo.githubusercontent.com/58d14bd8fe5428a03b15429ad1bc46ab09b0183c50e99a10eadae502b3d57e90/68747470733a2f2f7374617469632e68657967656e2e61692f68797065726672616d65732d6f73732f646f63732f696d616765732f68666769662d313238302e77656270)

![HyperFrames demo: HTML code on the left transforms into a rendered video on the right](https://camo.githubusercontent.com/58d14bd8fe5428a03b15429ad1bc46ab09b0183c50e99a10eadae502b3d57e90/68747470733a2f2f7374617469632e68657967656e2e61692f68797065726672616d65732d6f73732f646f63732f696d616765732f68666769662d313238302e77656270)

HyperFrames is an open-source framework for turning HTML, CSS, media, and seekable animations into deterministic MP4 videos. Use it locally with the CLI, from AI coding agents with skills, or as the rendering core behind hosted authoring workflows.

## Quick Start

### With an AI coding agent

Install the HyperFrames skills, then describe the video you want:

Try a prompt like:

Using `/hyperframes`, create a 10-second product intro with a fade-in title, a background video, and subtle background music.

`/hyperframes`

The skills teach agents the HyperFrames production loop: plan the video, write valid HTML, wire seekable animations, add media, lint, preview, and render. They work with Claude Code, Cursor, Gemini CLI, Codex, and other coding agents that support skills.

For visual design handoff workflows, see the [Claude Design guide](https://hyperframes.heygen.com/guides/claude-design) and [Open Design guide](https://hyperframes.heygen.com/guides/open-design).

### Manually with the CLI

**Requirements:** Node.js 22+, FFmpeg

## What You Can Build

Need ideas? Browse the [Showcase](https://hyperframes.heygen.com/showcase) for finished videos you can watch, read, run, and remix.

## How It Works

Define a video as HTML. Add data attributes for timing and tracks. Use GSAP, CSS, Lottie, Three.js, Anime.js, WAAPI, or your own frame adapter for seekable animation.

Preview instantly in the browser. Render locally or in Docker. The renderer seeks each frame in headless Chrome and encodes the result with FFmpeg, so the same input produces the same video.

## HyperFrames Stack

HyperFrames is the open-source rendering engine, plus a growing set of tools around HTML-native video creation.

| Piece | Status | What it does |
| --- | --- | --- |
| CLI | Available | Scaffold, preview, lint, inspect, and render local video projects |
| Core / Engine / Producer | Available | Parse compositions, drive headless Chrome, encode video, and mix audio |
| Catalog | Available | Reusable blocks and components for transitions, overlays, captions, charts, maps, and effects |
| Agent skills | Available | Teach coding agents the video-production patterns that generic web docs miss |
| Studio | Available, evolving | Browser surface for previewing and editing compositions |
| AWS Lambda rendering | Available | Deploy a distributed render stack and drive renders from your laptop or CI |
| [hyperframes.dev](https://www.hyperframes.dev/) | Available | Community playground for previewing, iterating, sharing, and rendering HTML-native video projects |
| Design.HTML | In development | Visualize a brand identity and turn it into reusable, video-ready HyperFrames compositions |

## Catalog

Install ready-to-use blocks and components:

Browse the catalog at [hyperframes.heygen.com/catalog](https://hyperframes.heygen.com/catalog/blocks/data-chart).

## Why HyperFrames?

`index.html`

## HyperFrames vs Remotion

HyperFrames is inspired by [Remotion](https://www.remotion.dev). Both tools render video with headless Chrome and FFmpeg. The main difference is the authoring model: Remotion's bet is React components; HyperFrames' bet is plain HTML that humans and agents can both write easily.

|  | **HyperFrames** | **Remotion** |
| --- | --- | --- |
| Authoring | HTML + CSS + seekable animation | React components |
| Build step | None; `index.html` plays as-is | Bundler required |
| Agent handoff | Plain HTML files | JSX / React project |
| Library-clock animations | Seekable, frame-accurate via adapters | Wall-clock animation patterns need care |
| Distributed rendering | Local and AWS Lambda render paths | Remotion Lambda, mature cloud renderer |
| License | Apache 2.0 | Source-available Remotion License |

`index.html`

Read the full comparison in the [HyperFrames vs Remotion guide](https://hyperframes.heygen.com/guides/hyperframes-vs-remotion).

## Documentation

Full documentation: [hyperframes.heygen.com/introduction](https://hyperframes.heygen.com/introduction)

## Packages

| Package | Description |
| --- | --- |
| [`hyperframes`](/heygen-com/hyperframes/blob/main/packages/cli) | CLI for creating, previewing, linting, and rendering compositions |
| [`@hyperframes/core`](/heygen-com/hyperframes/blob/main/packages/core) | Types, parsers, generators, linter, runtime, and frame adapters |
| [`@hyperframes/engine`](/heygen-com/hyperframes/blob/main/packages/engine) | Seekable page-to-video capture engine using Puppeteer and FFmpeg |
| [`@hyperframes/producer`](/heygen-com/hyperframes/blob/main/packages/producer) | Full rendering pipeline for capture, encode, and audio mix |
| [`@hyperframes/studio`](/heygen-com/hyperframes/blob/main/packages/studio) | Browser-based composition editor UI |
| [`@hyperframes/player`](/heygen-com/hyperframes/blob/main/packages/player) | Embeddable `<hyperframes-player>` web component |
| [`@hyperframes/shader-transitions`](/heygen-com/hyperframes/blob/main/packages/shader-transitions) | WebGL shader transitions for compositions |
| [`@hyperframes/aws-lambda`](/heygen-com/hyperframes/blob/main/packages/aws-lambda) | AWS Lambda SDK and deployment surface for distributed renders |

`hyperframes`
`@hyperframes/core`
`@hyperframes/engine`
`@hyperframes/producer`
`@hyperframes/studio`
`@hyperframes/player`
`<hyperframes-player>`
`@hyperframes/shader-transitions`
`@hyperframes/aws-lambda`

## Community

HyperFrames is used in production at [HeyGen](https://www.heygen.com), with community examples from teams like [tldraw](https://tldraw.com), [TanStack](https://tanstack.com), and others in [ADOPTERS.md](/heygen-com/hyperframes/blob/main/ADOPTERS.md). Open a PR if your team is using HyperFrames.

## Development Note

The repo uses [Git LFS](https://git-lfs.com) for golden regression-test baselines under `packages/producer/tests/**/output.mp4` (about 240 MB of `.mp4` files). If you're cloning the full repo for development, install Git LFS first:

`packages/producer/tests/**/output.mp4`
`.mp4`

If you only need source files, you can skip LFS content:

## License

[Apache 2.0](/heygen-com/hyperframes/blob/main/LICENSE)

## About

Write HTML. Render video. Built for agents.

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

## [Releases 177](/heygen-com/hyperframes/releases)

## [Packages 0](/orgs/heygen-com/packages?repo_name=hyperframes)

### Uh oh!

There was an error while loading. Please reload this page.

There was an error while loading. Please reload this page.

### Uh oh!

There was an error while loading. Please reload this page.

There was an error while loading. Please reload this page.

## [Contributors](/heygen-com/hyperframes/graphs/contributors)

### Uh oh!

There was an error while loading. Please reload this page.

There was an error while loading. Please reload this page.

## Languages

## Footer

### Footer navigation
