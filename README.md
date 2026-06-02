# Skill Book

AI 技能知识库浏览器 — 探索、搜索和管理你的技能目录。

## 快速开始

```bash
npm install
npm run dev        # 启动开发服务器
npm run build      # 生产构建
```

## 项目结构

```
public/skills/       # 技能 Markdown 文件（含 YAML frontmatter）
scripts/             # 构建脚本（生成 index.json）
src/
  assets/styles/     # 设计 Token（CSS 变量 + Tailwind）
  components/        # Vue 组件
  composables/       # useSkills / useSearch / useFilters
  router/            # Vue Router 配置
  utils/             # 浏览器端 frontmatter 解析器
  views/             # 页面视图
```

## 添加技能

在 `public/skills/` 下创建 `.md` 文件，格式如下：

```yaml
---
slug: my-skill
name: 技能名称
category: 分类
tags: [标签1, 标签2]
description: 简短描述
install: "npx skills add ..."
source: "https://..."
---
```

运行 `npm run build:skills` 重新生成索引。

## 技能目录

> 点击技能名称可在应用中查看详情，点击 📄 查看源文件。

| 技能名称 | 描述 | 链接 |
|---|---|---|
| Agent Teams / Agency-Agents | AI角色团队协同开发，一次配齐架构师、数据库优化师、前端、代码审查和测试等专家角色 | [打开](#/skill/agency-agents) [📄](public/skills/agency-agents.md) |
| Agent Browser MCP | MCP服务器提供浏览器自动化能力，使用语义元素定位器而非CSS选择器 | [打开](#/skill/agent-browser-mcp) [📄](public/skills/agent-browser-mcp.md) |
| Agent Browser | AI Agent浏览器自动化CLI，支持网页导航、表单填写、按钮点击、截图和数据提取 | [打开](#/skill/agent-browser) [📄](public/skills/agent-browser.md) |
| Agent Skills（谷歌工程纪律包） | 轻量灵活约束AI行为的工程纪律技能包，覆盖开发全流程 | [打开](#/skill/agent-skills-google) [📄](public/skills/agent-skills-google.md) |
| AI Prompt Optimizer | 写不好Prompt时让AI帮你优化的提示词优化工具 | [打开](#/skill/ai-prompt-optimizer) [📄](public/skills/ai-prompt-optimizer.md) |
| AionUI | AI驱动的用户界面组件生成 | [打开](#/skill/aionui) [📄](public/skills/aionui.md) |
| Animation Generation | AI辅助生成动画效果，支持CSS动画、Lottie动画和SVG动画 | [打开](#/skill/animation-generation) [📄](public/skills/animation-generation.md) |
| API Docs Generator | 自动生成API文档技能，包含OpenAPI/Swagger规范、端点文档、SDK使用示例 | [打开](#/skill/api-docs-generator) [📄](public/skills/api-docs-generator.md) |
| Awesome Design MD | 收集顶级网站的DESIGN.md设计规范文件，58+品牌风格，每个附带可视化预览HTML | [打开](#/skill/awesome-design-md) [📄](public/skills/awesome-design-md.md) |
| Baoyu Skill | 快速生成不同艺术风格的概念图 | [打开](#/skill/baoyu-skill) [📄](public/skills/baoyu-skill.md) |
| Caveman Review | 压缩通信模式代码审查，减少~75%token用量同时保持完整技术准确性 | [打开](#/skill/caveman-review) [📄](public/skills/caveman-review.md) |
| CC Connect | 特定平台或服务之间的连接器工具 | [打开](#/skill/cc-connect) [📄](public/skills/cc-connect.md) |
| Claude Design | 在Claude中直接获得更好的设计输出 | [打开](#/skill/claude-design) [📄](public/skills/claude-design.md) |
| Code Refactor | 遗留代码重构技能，基于Fowler和Feathers的著作，分析优先、安全增量变换 | [打开](#/skill/code-refactor) [📄](public/skills/code-refactor.md) |
| Software Copyright / Patent Disclosure | 软件著作权申请与专利信息披露辅助技能 | [打开](#/skill/copyright-patent-skill) [📄](public/skills/copyright-patent-skill.md) |
| Dependency Audit | 依赖安全检测技能，扫描漏洞、未使用包、过时版本和供应链风险 | [打开](#/skill/dependency-audit) [📄](public/skills/dependency-audit.md) |
| Deploy to Vercel | Vercel官方部署技能，一键将应用部署到Vercel平台的自动化部署流程 | [打开](#/skill/deploy-to-vercel) [📄](public/skills/deploy-to-vercel.md) |
| UI 设计系统 | 构建一致性 UI 设计系统的核心原则、Token 体系与组件规范 | [打开](#/skill/design-skill) [📄](public/skills/design-skill.md) |
| Design Spells | 微交互灵感图鉴，收录APP中的微动效（如加载动画、输入反馈） | [打开](#/skill/design-spells) [📄](public/skills/design-spells.md) |
| Floracat Diagram | AI辅助生成Mermaid、PlantUML等格式的图表和流程图 | [打开](#/skill/floracat-diagram) [📄](public/skills/floracat-diagram.md) |
| Frontend Design | 快速生成符合设计规范的前端页面，支持React/Tailwind/shadcn/ui | [打开](#/skill/frontend-design) [📄](public/skills/frontend-design.md) |
| Git Smart Commit | 规范化智能提交技能，按架构分层自动拆分为符合Conventional Commits规范的多个原子提交 | [打开](#/skill/git-smart-commit) [📄](public/skills/git-smart-commit.md) |
| GPT Imager | 为文章、视频或报告生成配图和图片素材 | [打开](#/skill/gpt-imager) [📄](public/skills/gpt-imager.md) |
| GStack | 基于23项专业技能串联从设计到部署的完整研发链路，内置CEO战略审查、架构评审、OWASP安全扫描 | [打开](#/skill/gstack) [📄](public/skills/gstack.md) |
| guizang-ppt-skill | PPT制作技能 | [打开](#/skill/guizang-ppt-skill) [📄](public/skills/guizang-ppt-skill.md) |
| PPT Master / HTML PPT Skill | 快速制作PPT演示文稿，支持HTML格式或PPTX格式输出 | [打开](#/skill/html-ppt-skill) [📄](public/skills/html-ppt-skill.md) |
| Humanizer-ZH | 让AI写的文案更像人话，减少机器翻译感的中文文案自然化处理工具 | [打开](#/skill/humanizer-zh) [📄](public/skills/humanizer-zh.md) |
| hyperframes | Hyperframes 技能 | [打开](#/skill/hyperframes) [📄](public/skills/hyperframes.md) |
| Impeccable | 前端视觉品质全方位技能包，覆盖打磨、审计、动画、适配、优化、色彩化等20+子技能 | [打开](#/skill/impeccable) [📄](public/skills/impeccable.md) |
| Karpathy's Guidelines | Andrej Karpathy的4条AI编程行为规则：先思考、简洁优先、手术式改动、目标驱动执行 | [打开](#/skill/karpathy-guidelines) [📄](public/skills/karpathy-guidelines.md) |
| Markdown to HTML | 将Markdown文档转换为精美排版的HTML页面，支持多种样式主题 | [打开](#/skill/markdown-to-html) [📄](public/skills/markdown-to-html.md) |
| Marketing Skills | Corey Haines营销技能包，18个子技能覆盖SEO审计、文案写作、内容策略、邮件序列、CRO优化等 | [打开](#/skill/marketing-skills) [📄](public/skills/marketing-skills.md) |
| MattPocock Skills | 前端大神Matt Pocock的28个实战Skills，专治氛围编程四大通病，遵循TDD/DDD等工程原则 | [打开](#/skill/mattpocock-skills) [📄](public/skills/mattpocock-skills.md) |
| BB Browser / OpenClaw | 提供独立浏览器实例，支持托管浏览器和扩展中继两种模式的浏览器自动化工具 | [打开](#/skill/openclaw-browser) [📄](public/skills/openclaw-browser.md) |
| OpenCLI / 9Router | 终端环境下的AI调用或API路由管理工具 | [打开](#/skill/opencli-9router) [📄](public/skills/opencli-9router.md) |
| OpenSpec | OpenSpec 规范技能 | [打开](#/skill/openspec) [📄](public/skills/openspec.md) |
| Playwright MCP | 通过MCP协议集成Playwright，让AI自动调用进行浏览器操作和端到端自动化测试 | [打开](#/skill/playwright-mcp) [📄](public/skills/playwright-mcp.md) |
| React Bits | 开源React动画组件库，提供70+种动画组件，npm install后直接复制代码使用 | [打开](#/skill/react-bits) [📄](public/skills/react-bits.md) |
| Remotion Best Practices | Remotion官方最佳实践，深度掌握动画、时间轴、音频、字幕和3D的正确编码方式 | [打开](#/skill/remotion-best-practices) [📄](public/skills/remotion-best-practices.md) |
| shadcn/ui Skill | shadcn/ui官方技能，管理组件的添加、搜索、修复、样式调整与组合，提供项目上下文与用法示例 | [打开](#/skill/shadcn-ui) [📄](public/skills/shadcn-ui.md) |
| Skill Creator / Find-Skill | 自己创建新技能或寻找现成技能的技能管理与搜索工具 | [打开](#/skill/skill-creator-find) [📄](public/skills/skill-creator-find.md) |
| Skill Creator (Official) | Anthropic官方技能创建器，交互式创建、修改和优化Agent Skills，支持性能评估与触发精度调优 | [打开](#/skill/skill-creator-official) [📄](public/skills/skill-creator-official.md) |
| Sleek Design Mobile Apps | Sleek移动应用设计技能，AI辅助设计移动端界面、创建屏幕和构建UI | [打开](#/skill/sleek-design-mobile-apps) [📄](public/skills/sleek-design-mobile-apps.md) |
| Superpowers | 通过流程化引导规范AI编程，提升代码交付质量的技能包 | [打开](#/skill/superpowers) [📄](public/skills/superpowers.md) |
| UI/UX Pro Max | 内置161种产品类型对应的专业调色板和设计策略，支持banner设计和HTML演示文稿 | [打开](#/skill/ui-ux-pro-max) [📄](public/skills/ui-ux-pro-max.md) |
| Vercel Composition Patterns | Vercel官方React组合模式技能，用复合组件替代boolean prop泛滥的架构方案 | [打开](#/skill/vercel-composition-patterns) [📄](public/skills/vercel-composition-patterns.md) |
| Vercel React Best Practices | Vercel官方React最佳实践，57条性能规则覆盖React/Next.js核心优化策略 | [打开](#/skill/vercel-react-best-practices) [📄](public/skills/vercel-react-best-practices.md) |
| Vue3 组件开发 | 使用 Vue3 Composition API 构建可复用组件的完整技能指南 | [打开](#/skill/vue-skill) [📄](public/skills/vue-skill.md) |
| Webapp Testing | Anthropic官方Web应用测试技能，通过Playwright在真实浏览器中测试本地应用 | [打开](#/skill/webapp-testing) [📄](public/skills/webapp-testing.md) |
| NotebookLM Skill / Zread | 在终端批量分析文档或深入理解GitHub仓库的CLI工具 | [打开](#/skill/zread-notebooklm) [📄](public/skills/zread-notebooklm.md) |

## 技术栈

Vue 3 · Vue Router · Vite · Tailwind CSS 4 · markdown-it · fuse.js
