<div align="center">

# 📖 Skill Book

**AI 技能知识库 — 发现、搜索、管理你的 AI Skill 目录**

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[快速开始](#快速开始) · [为什么需要 Skill Book](#为什么需要-skill-book) · [功能特性](#功能特性) · [技能目录](#技能目录) · [贡献指南](#贡献指南)

</div>

---

## 为什么需要 Skill Book

AI 编程工具（Claude Code、Cursor、Copilot 等）通过 **Skill**（技能）来扩展能力——一个 Skill 就是一套结构化的提示词和工作流，让 AI 在特定领域表现得更专业、更可控。

但 Skill 越来越多，问题也随之而来：

| 痛点 | Skill Book 如何解决 |
|---|---|
| 🔍 **找不到** — Skill 散落在各处，想用的时候想不起来 | 统一收录 + 模糊搜索，输入关键词即刻定位 |
| 🏷️ **分不清** — 几十个 Skill 堆在一起，不知道哪个适合当前场景 | 分类筛选 + 标签过滤，按领域和用途精准筛选 |
| 📖 **不会用** — 找到了 Skill 但不清楚用法和适用场景 | 详情页完整渲染 Markdown，用法、场景、示例一目了然 |
| ➕ **难管理** — 自己创建的 Skill 没地方统一维护 | 内置 CRUD，用户自建 Skill 持久化到 localStorage |

**Skill Book 的核心价值：让 AI Skill 从"收藏夹里的链接"变成"随时可查、即查即用的知识库"。**

---

## 功能特性

- **🔍 模糊搜索** — 基于 fuse.js，支持按名称、描述、标签、分类搜索，300ms 防抖
- **📂 分类筛选** — 自动从 frontmatter 提取分类，单选切换
- **🏷️ 标签过滤** — 多标签 AND 逻辑筛选，精准定位
- **📄 Markdown 渲染** — 详情页完整渲染 Skill 内容，支持代码高亮
- **✏️ 自建 Skill** — 内置表单创建/编辑/删除，数据持久化到 localStorage
- **📱 响应式布局** — 桌面端优先，适配移动端
- **⚡ 零后端** — 纯静态 SPA，构建产物可直接部署到任意静态托管
- **🎨 Apple 设计语言** — 参照 Apple HIG 风格，Crimson Pro + DM Sans 字体，burnt terracotta 强调色

---

## 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 9

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/Laughingtt/skill-book.git
cd skill-book

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建（自动生成 skills index）
npm run build

# 本地预览构建产物
npm run preview
```

开发服务器启动后访问 http://localhost:5173

### 常用命令

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build:skills` | 从 `public/skills/*.md` 重新生成 `index.json` |
| `npm run build` | 完整生产构建（含 build:skills 预处理） |
| `npm run preview` | 本地预览生产构建 |
| `npm run test` | 运行测试 |
| `npm run test:watch` | 监听模式运行测试 |

---

## 项目结构

```
skill-book/
├── public/
│   └── skills/              # Skill Markdown 文件（含 YAML frontmatter）
│       ├── index.json        # 构建时自动生成的索引
│       ├── vue-skill.md
│       └── ...
├── scripts/
│   └── build-skills.js       # 构建脚本：扫描 .md → 生成 index.json
├── src/
│   ├── assets/styles/
│   │   └── tokens.css        # 设计 Token（CSS 自定义属性 + 暗色模式）
│   ├── components/
│   │   ├── GlobalNav.vue     # 顶部全局导航
│   │   ├── SubNav.vue        # 二级导航（搜索栏）
│   │   ├── SearchBar.vue     # 搜索输入框
│   │   ├── CategorySidebar.vue  # 左侧分类筛选
│   │   ├── TagCloud.vue      # 标签云筛选
│   │   ├── SkillCard.vue     # 技能卡片
│   │   ├── SkillFormModal.vue   # 创建/编辑技能表单
│   │   ├── MarkdownRenderer.vue # Markdown 渲染器
│   │   └── FooterBar.vue     # 页脚
│   ├── composables/
│   │   ├── useSkills.js      # 技能数据管理（单例，CRUD + localStorage）
│   │   ├── useSearch.js      # fuse.js 搜索封装
│   │   └── useFilters.js     # 分类 + 标签筛选
│   ├── router/
│   │   └── index.js          # Vue Router（Hash 模式）
│   ├── utils/
│   │   └── frontmatter.js    # 浏览器端 frontmatter 解析器
│   ├── views/
│   │   ├── HomeView.vue      # 首页：浏览、搜索、筛选
│   │   └── SkillDetailView.vue  # 详情页：Markdown 内容渲染
│   ├── App.vue
│   └── main.js
├── docs/                     # 设计文档与 PRD
├── index.html
├── package.json
└── vite.config.js
```

---

## 架构设计

### 数据流水线

```
构建时:  public/skills/*.md  →  gray-matter 解析  →  public/skills/index.json
运行时:  index.json 加载  →  useSkills() 持有数据  →  useSearch() 建索引  →  useFilters() 筛选
详情页:  /skills/{slug}.md  →  浏览器端 frontmatter 解析  →  markdown-it 渲染
```

**为什么用构建时索引？** 首页只需轻量元数据（name/slug/category/tags/description），无需加载全部 Markdown 内容。搜索索引基于小 JSON 负载，响应迅速。详情页按需加载完整 `.md` 文件。

### 路由

| 路径 | 视图 | 说明 |
|---|---|---|
| `#/` | HomeView | 浏览、搜索、筛选、创建技能 |
| `#/skill/:slug` | SkillDetailView | 技能详情 + Markdown 渲染 |
| `#/skill/:slug/edit` | SkillEditView | 编辑技能（懒加载） |

使用 Hash 路由（`createWebHashHistory`），兼容任意静态文件托管，无需服务端配置。

---

## 添加技能

### 1. 创建 Markdown 文件

在 `public/skills/` 下新建 `.md` 文件，包含 YAML frontmatter：

```yaml
---
slug: my-skill
name: My Skill
category: 编码
tags: [vue, frontend, component]
description: 简短描述这个技能做什么
install: "npx skills add my-skill"
source: "https://github.com/..."
---

# My Skill

## 描述
详细说明...

## 用法
使用方式...

## 使用场景
适用场景...

## 示例
代码示例...
```

### 2. 重新生成索引

```bash
npm run build:skills
```

新技能会自动出现在首页，分类也会自动加入侧边栏。

### 3. 通过界面创建

也可以在应用首页点击「+」按钮，通过表单直接创建技能（保存到 localStorage）。

---

## 技能目录

> 点击技能名称查看源文件。共收录 **51** 个技能，覆盖编码、设计、测试、部署、营销等领域。

| 技能名称 | 描述 |
|---|---|
| [Agent Teams / Agency-Agents](public/skills/agency-agents.md) | AI角色团队协同开发，一次配齐架构师、数据库优化师、前端、代码审查和测试等专家角色 |
| [Agent Browser MCP](public/skills/agent-browser-mcp.md) | MCP服务器提供浏览器自动化能力，使用语义元素定位器而非CSS选择器 |
| [Agent Browser](public/skills/agent-browser.md) | AI Agent浏览器自动化CLI，支持网页导航、表单填写、按钮点击、截图和数据提取 |
| [Agent Skills（谷歌工程纪律包）](public/skills/agent-skills-google.md) | 轻量灵活约束AI行为的工程纪律技能包，覆盖开发全流程 |
| [AI Prompt Optimizer](public/skills/ai-prompt-optimizer.md) | 写不好Prompt时让AI帮你优化的提示词优化工具 |
| [AionUI](public/skills/aionui.md) | AI驱动的用户界面组件生成 |
| [Animation Generation](public/skills/animation-generation.md) | AI辅助生成动画效果，支持CSS动画、Lottie动画和SVG动画 |
| [API Docs Generator](public/skills/api-docs-generator.md) | 自动生成API文档技能，包含OpenAPI/Swagger规范、端点文档、SDK使用示例 |
| [Awesome Design MD](public/skills/awesome-design-md.md) | 收集顶级网站的DESIGN.md设计规范文件，58+品牌风格，每个附带可视化预览HTML |
| [Baoyu Skill](public/skills/baoyu-skill.md) | 快速生成不同艺术风格的概念图 |
| [Caveman Review](public/skills/caveman-review.md) | 压缩通信模式代码审查，减少~75%token用量同时保持完整技术准确性 |
| [CC Connect](public/skills/cc-connect.md) | 特定平台或服务之间的连接器工具 |
| [Claude Design](public/skills/claude-design.md) | 在Claude中直接获得更好的设计输出 |
| [Code Refactor](public/skills/code-refactor.md) | 遗留代码重构技能，基于Fowler和Feathers的著作，分析优先、安全增量变换 |
| [Software Copyright / Patent Disclosure](public/skills/copyright-patent-skill.md) | 软件著作权申请与专利信息披露辅助技能 |
| [Dependency Audit](public/skills/dependency-audit.md) | 依赖安全检测技能，扫描漏洞、未使用包、过时版本和供应链风险 |
| [Deploy to Vercel](public/skills/deploy-to-vercel.md) | Vercel官方部署技能，一键将应用部署到Vercel平台的自动化部署流程 |
| [UI 设计系统](public/skills/design-skill.md) | 构建一致性 UI 设计系统的核心原则、Token 体系与组件规范 |
| [Design Spells](public/skills/design-spells.md) | 微交互灵感图鉴，收录APP中的微动效（如加载动画、输入反馈） |
| [Floracat Diagram](public/skills/floracat-diagram.md) | AI辅助生成Mermaid、PlantUML等格式的图表和流程图 |
| [Frontend Design](public/skills/frontend-design.md) | 快速生成符合设计规范的前端页面，支持React/Tailwind/shadcn/ui |
| [Git Smart Commit](public/skills/git-smart-commit.md) | 规范化智能提交技能，按架构分层自动拆分为符合Conventional Commits规范的多个原子提交 |
| [GPT Imager](public/skills/gpt-imager.md) | 为文章、视频或报告生成配图和图片素材 |
| [GStack](public/skills/gstack.md) | 基于23项专业技能串联从设计到部署的完整研发链路，内置CEO战略审查、架构评审、OWASP安全扫描 |
| [guizang-ppt-skill](public/skills/guizang-ppt-skill.md) | PPT制作技能 |
| [PPT Master / HTML PPT Skill](public/skills/html-ppt-skill.md) | 快速制作PPT演示文稿，支持HTML格式或PPTX格式输出 |
| [Humanizer-ZH](public/skills/humanizer-zh.md) | 让AI写的文案更像人话，减少机器翻译感的中文文案自然化处理工具 |
| [hyperframes](public/skills/hyperframes.md) | Hyperframes 技能 |
| [Impeccable](public/skills/impeccable.md) | 前端视觉品质全方位技能包，覆盖打磨、审计、动画、适配、优化、色彩化等20+子技能 |
| [Karpathy's Guidelines](public/skills/karpathy-guidelines.md) | Andrej Karpathy的4条AI编程行为规则：先思考、简洁优先、手术式改动、目标驱动执行 |
| [Markdown to HTML](public/skills/markdown-to-html.md) | 将Markdown文档转换为精美排版的HTML页面，支持多种样式主题 |
| [Marketing Skills](public/skills/marketing-skills.md) | Corey Haines营销技能包，18个子技能覆盖SEO审计、文案写作、内容策略、邮件序列、CRO优化等 |
| [MattPocock Skills](public/skills/mattpocock-skills.md) | 前端大神Matt Pocock的28个实战Skills，专治氛围编程四大通病，遵循TDD/DDD等工程原则 |
| [BB Browser / OpenClaw](public/skills/openclaw-browser.md) | 提供独立浏览器实例，支持托管浏览器和扩展中继两种模式的浏览器自动化工具 |
| [OpenCLI / 9Router](public/skills/opencli-9router.md) | 终端环境下的AI调用或API路由管理工具 |
| [OpenSpec](public/skills/openspec.md) | OpenSpec 规范技能 |
| [Playwright MCP](public/skills/playwright-mcp.md) | 通过MCP协议集成Playwright，让AI自动调用进行浏览器操作和端到端自动化测试 |
| [React Bits](public/skills/react-bits.md) | 开源React动画组件库，提供70+种动画组件，npm install后直接复制代码使用 |
| [Remotion Best Practices](public/skills/remotion-best-practices.md) | Remotion官方最佳实践，深度掌握动画、时间轴、音频、字幕和3D的正确编码方式 |
| [shadcn/ui Skill](public/skills/shadcn-ui.md) | shadcn/ui官方技能，管理组件的添加、搜索、修复、样式调整与组合，提供项目上下文与用法示例 |
| [Skill Creator / Find-Skill](public/skills/skill-creator-find.md) | 自己创建新技能或寻找现成技能的技能管理与搜索工具 |
| [Skill Creator (Official)](public/skills/skill-creator-official.md) | Anthropic官方技能创建器，交互式创建、修改和优化Agent Skills，支持性能评估与触发精度调优 |
| [Sleek Design Mobile Apps](public/skills/sleek-design-mobile-apps.md) | Sleek移动应用设计技能，AI辅助设计移动端界面、创建屏幕和构建UI |
| [Superpowers](public/skills/superpowers.md) | 通过流程化引导规范AI编程，提升代码交付质量的技能包 |
| [UI/UX Pro Max](public/skills/ui-ux-pro-max.md) | 内置161种产品类型对应的专业调色板和设计策略，支持banner设计和HTML演示文稿 |
| [Vercel Composition Patterns](public/skills/vercel-composition-patterns.md) | Vercel官方React组合模式技能，用复合组件替代boolean prop泛滥的架构方案 |
| [Vercel React Best Practices](public/skills/vercel-react-best-practices.md) | Vercel官方React最佳实践，57条性能规则覆盖React/Next.js核心优化策略 |
| [Vue3 组件开发](public/skills/vue-skill.md) | 使用 Vue3 Composition API 构建可复用组件的完整技能指南 |
| [Webapp Testing](public/skills/webapp-testing.md) | Anthropic官方Web应用测试技能，通过Playwright在真实浏览器中测试本地应用 |
| [NotebookLM Skill / Zread](public/skills/zread-notebooklm.md) | 在终端批量分析文档或深入理解GitHub仓库的CLI工具 |

---

## 技术栈

| 技术 | 用途 |
|---|---|
| [Vue 3](https://vuejs.org/) | 前端框架（Composition API + `<script setup>`） |
| [Vue Router 4](https://router.vuejs.org/) | 客户端路由（Hash 模式） |
| [Vite 6](https://vitejs.dev/) | 构建工具与开发服务器 |
| [Tailwind CSS 4](https://tailwindcss.com/) | 原子化 CSS（设计 Token 集成） |
| [markdown-it](https://github.com/markdown-it/markdown-it) | Markdown 渲染引擎 |
| [fuse.js](https://www.fusejs.io/) | 模糊搜索引擎 |
| [gray-matter](https://github.com/jonschlinkert/gray-matter) | YAML frontmatter 解析（构建时） |
| [Vitest](https://vitest.dev/) | 单元测试框架 |

---

## 部署

Skill Book 是纯静态 SPA，构建产物可直接部署到任意静态托管平台：

```bash
npm run build    # 产出 dist/ 目录
```

### Vercel（推荐）

```bash
npx vercel
```

或连接 GitHub 仓库后自动部署，框架预设选择 `Vite`。

### GitHub Pages

1. 设置 `vite.config.js` 中 `base` 为仓库名（如 `/skill-book/`）
2. 推送 `dist/` 到 `gh-pages` 分支，或使用 GitHub Actions 自动部署

### 其他平台

Netlify、Cloudflare Pages、S3 静态托管等均可，只需将 `dist/` 作为发布目录。

---

## 贡献指南

欢迎贡献！你可以通过以下方式参与：

### 提交新 Skill

1. Fork 本仓库
2. 在 `public/skills/` 下创建 `.md` 文件（遵循 [Skill 格式](#添加技能)）
3. 运行 `npm run build:skills` 更新索引
4. 提交 Pull Request

### 报告问题

- [提交 Issue](https://github.com/Laughingtt/skill-book/issues) 描述问题或建议

### 开发贡献

1. Fork 并克隆仓库
2. 创建功能分支：`git checkout -b feature/my-feature`
3. 提交更改：`git commit -m 'feat: add some feature'`
4. 推送分支：`git push origin feature/my-feature`
5. 提交 Pull Request

请确保提交前通过 `npm run build` 和 `npm run test`。

---

## 路线图

- [x] 技能浏览与卡片网格
- [x] 模糊搜索（fuse.js）
- [x] 分类 + 标签筛选
- [x] 技能详情页（Markdown 渲染）
- [x] 用户自建 Skill（localStorage CRUD）
- [x] 响应式布局
- [ ] 收藏/书签系统
- [ ] 学习进度追踪
- [ ] 暗色模式
- [ ] URL 同步筛选状态
- [ ] PWA / 离线支持
- [ ] Skill 评分与评论

---

## License

[MIT](LICENSE) © 2024-present
