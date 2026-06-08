# Skill Book 框架深度调研分析报告

> 日期：2026-06-08 | 版本：v1.0 | 作者：AI 辅助研究

---

## 目录

1. [框架概述](#1-框架概述)
2. [架构深度分析](#2-架构深度分析)
3. [如何保持最新并同步 Skill](#3-如何保持最新并同步-skill)
4. [如何让框架具备学习与使用能力](#4-如何让框架具备学习与使用能力)
5. [适用场景分析](#5-适用场景分析)
6. [优化空间与改进方案](#6-优化空间与改进方案)
7. [端到端 Agent 集成方案](#7-端到端-agent-集成方案)
8. [实施路线图](#8-实施路线图)

---

## 1. 框架概述

Skill Book 是一个**静态 Vue 3 SPA**，用于浏览、搜索和管理 AI/CLI Skill 目录。Skill 以 Markdown + YAML Frontmatter 形式存储，通过构建时脚本生成索引，运行时从 localStorage 合并用户数据。

### 1.1 核心数据

| 维度 | 数值 |
|------|------|
| 技术栈 | Vue 3.5 + Vite 6 + TailwindCSS 4 + Vue Router 4 (Hash) |
| Skill 数量 | 52 个 Markdown 文件 |
| Composables | 16 个状态管理模块 |
| 路由 | 3 个（首页、详情、我的空间） |
| 组件 | 14 个 UI 组件 |
| 测试文件 | 8 个测试套件 |

### 1.2 技术架构总览

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (SPA)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Vue Router│  │  Pinia   │  │  Composables (16)    │  │
│  │ (Hash)   │  │  (none)  │  │  - useSkills         │  │
│  │          │  │          │  │  - useSearch (fuse)   │  │
│  │ /        │  │  Uses    │  │  - useFilters         │  │
│  │ /skill/  │  │  module- │  │  - useBookmarks       │  │
│  │ /my      │  │  level   │  │  - useSkillStatus     │  │
│  └──────────┘  │  refs    │  │  - useSpacedRepetition│  │
│                └──────────┘  │  - useGithubImport    │  │
│                              │  - useCommandPalette  │  │
│                              │  - ...more            │  │
│                              └──────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                    Data Layer                            │
│  ┌──────────────────┐  ┌─────────────────────────────┐ │
│  │  localStorage    │  │  Static Files               │ │
│  │  - skills        │  │  /skills/index.json         │ │
│  │  - bookmarks     │  │  /skills/{slug}.md          │ │
│  │  - statuses      │  │                             │ │
│  │  - notes         │  │  Build-time:                │ │
│  │  - usage-stats   │  │  scripts/build-skills.js    │ │
│  │  - review-sched  │  │  → extracts frontmatter     │ │
│  │  - settings      │  │  → generates index.json     │ │
│  └──────────────────┘  └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│                    Dev Only                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │  vite-plugin-skill-api.js                        │  │
│  │  GET    /api/skills/:slug  → read .md file       │  │
│  │  POST   /api/skills       → write .md + rebuild  │  │
│  │  DELETE /api/skills/:slug → delete .md + rebuild │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. 架构深度分析

### 2.1 双持久化模型（核心设计）

这是框架最重要的架构决策：

```
静态 Skill（构建时）              用户 Skill（运行时）
┌──────────────────┐           ┌──────────────────┐
│ public/skills/   │           │ localStorage     │
│   *.md 文件       │           │ skill-book-skills│
│        ↓          │           │        ↓          │
│ build-skills.js  │           │ JSON 格式存储     │
│        ↓          │           │        ↓          │
│  index.json      │──merge──→│  useSkills        │
└──────────────────┘           └──────────────────┘
```

**优点**：
- 静态文件可直接通过 HTTP 访问（无需后端）
- 用户修改不污染原始文件
- 支持离线使用（PWA + CacheFirst）

**缺点**：
- 用户创建的 Skill 只在 localStorage 中，换设备丢失
- 开发模式下的 .md 文件写回与生产模式不一致
- 没有版本控制/冲突解决机制

### 2.2 数据流管道

```
skills (全部)
   ↓
useSearch (fuse.js, 权重: name=2, desc=1.5, tags=1, category=0.5)
   ↓
useFilters (分类 + 标签 AND 逻辑)
   ↓
useScenarios (场景过滤)
   ↓
useSort (8 种排序模式)
   ↓
displayedSkills (最终展示)
```

### 2.3 状态管理模式

所有 composable 采用**单例模块级状态**：

```javascript
// 模式：ref 在模块顶层声明，所有调用方共享
const skills = ref([])  // ← 模块级，单例
export function useSkills() { ... }
```

**优点**：无需 Pinia/Vuex，组件间自然共享状态
**缺点**：测试需要 `beforeEach` 重置；SSR 不友好（但本项目是纯 SPA）

### 2.4 浏览器端 Frontmatter 解析器

`src/utils/frontmatter.js` 是一个约 150 行的自定义轻量解析器：
- 支持：字符串值、内联数组 `[a, b, c]`、多行值 `|`、对象数组
- **不支持**：嵌套对象、YAML 锚点、流式映射
- 设计意图：Skill 的 frontmatter 结构简单，避免引入 YAML 库增加包体积

### 2.5 PWA 缓存策略

```javascript
// vite.config.js 中的 workbox 配置
/skills/index.json  → StaleWhileRevalidate  // 先返回缓存，后台更新
/skills/*.md        → CacheFirst (30天)      // 优先缓存，减少请求
Google Fonts        → StaleWhileRevalidate / CacheFirst
```

---

## 3. 如何保持最新并同步 Skill

这是你的核心需求之一。当前框架的更新机制存在以下问题：

### 3.1 现状问题

1. **静态 Skill 完全手动维护**：`public/skills/*.md` 文件需要手动添加/编辑，然后运行 `npm run build:skills`
2. **用户 Skill 孤立**：通过 UI 创建的 Skill 只存在 localStorage 中，不与任何远程源同步
3. **无版本概念**：Skill 没有版本号、更新时间、变更日志
4. **无上游追踪**：Skill 来自 GitHub 仓库（如 anthropics/skills），但没有机制追踪上游更新
5. **GitHub Import 是一次性的**：`useGithubImport` 只做初始导入，不做后续同步

### 3.2 推荐方案：分层更新架构

```
┌──────────────────────────────────────────────────────┐
│                  Skill 更新架构                        │
│                                                       │
│  Layer 1: 官方 Skill 源（自动同步）                    │
│  ┌─────────────────────────────────────────────┐     │
│  │  GitHub Raw API                             │     │
│  │  github.com/anthropics/skills               │     │
│  │  github.com/obra/superpowers                │     │
│  │  ...更多上游仓库                              │     │
│  │        ↓                                     │     │
│  │  定时检查 → 对比 version/sha → 自动 PR       │     │
│  └─────────────────────────────────────────────┘     │
│                                                       │
│  Layer 2: 社区精选层（审核 + 质量控制）                │
│  ┌─────────────────────────────────────────────┐     │
│  │  skill-book 仓库自身                          │     │
│  │  public/skills/*.md（Git 版本控制）           │     │
│  │        ↓                                     │     │
│  │  人工审核 → 质量评分 → 合并入主分支            │     │
│  └─────────────────────────────────────────────┘     │
│                                                       │
│  Layer 3: 用户个人层（本地优先）                       │
│  ┌─────────────────────────────────────────────┐     │
│  │  localStorage + 可选云同步                    │     │
│  │        ↓                                     │     │
│  │  用户笔记/状态/自定义 Skill                    │     │
│  └─────────────────────────────────────────────┘     │
│                                                       │
│  Layer 4: 动态发现层（社区贡献）                       │
│  ┌─────────────────────────────────────────────┐     │
│  │  GitHub Topics / awesome-lists              │     │
│  │  npm 关键词搜索                              │     │
│  │        ↓                                     │     │
│  │  自动发现 → 质量预筛选 → 提交审核             │     │
│  └─────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────┘
```

### 3.3 具体实现方案

#### 方案 A：Git Submodule + CI 自动同步（推荐）

```yaml
# .github/workflows/sync-skills.yml
name: Sync Upstream Skills
on:
  schedule:
    - cron: '0 8 * * *'  # 每天执行
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check upstream repos
        run: |
          # 从配置文件中读取上游仓库列表
          for repo in $(cat upstream-repos.json | jq -r '.[].url'); do
            # 获取最新 release/tag
            latest=$(gh release view --repo $repo --json tagName -q '.tagName')
            # 与本地记录的版本对比
            # 如果有更新，创建 PR
          done
```

#### 方案 B：Skill Registry 服务（中期方案）

```javascript
// 新增: src/composables/useSkillRegistry.js
export function useSkillRegistry() {
  const registryUrl = 'https://skill-registry.example.com/api'

  async function checkUpdates() {
    // 获取本地所有 skill 的 slug + version
    // POST /api/check-updates
    // 返回有更新的 skill 列表
  }

  async function pullUpdate(slug) {
    // GET /api/skills/:slug/latest
    // 下载最新 .md 内容
    // 对比本地版本，合并冲突
  }

  async function publishSkill(slug) {
    // POST /api/skills (提交到注册中心)
  }

  return { checkUpdates, pullUpdate, publishSkill }
}
```

#### 方案 C：增强 GithubImport 为持续同步

在现有 `useGithubImport.js` 基础上扩展：

```javascript
// 增强 useGithubImport.js
async function syncFromGithub(skillSlug) {
  // 1. 读取 skill 的 source 字段（GitHub URL）
  // 2. 获取上游仓库的最新 commit SHA
  // 3. 与本地记录的 lastSyncSha 对比
  // 4. 若有更新，重新 fetch content + AI summarize
  // 5. 保留用户的 notes/status/bookmarks
  // 6. 合并 frontmatter（上游字段覆盖，用户字段保留）
}
```

### 3.4 Skill 质量评分机制

```javascript
// 每个 Skill 增加质量元数据
{
  "slug": "frontend-design",
  "quality": {
    "score": 8.5,           // 综合评分 0-10
    "completeness": 9,      // 文档完整度
    "usability": 8,         // 可用性（命令是否可执行）
    "freshness": 7,         // 新鲜度（距上次更新时间）
    "communityRating": 8.2, // 社区评分
    "verifiedAt": "2026-05-01",
    "lastSyncAt": "2026-06-07",
    "sourceSha": "abc123def"
  }
}
```

---

## 4. 如何让框架具备学习与使用能力

### 4.1 当前已有的学习功能

框架已经内置了较完善的学习追踪体系：

| 功能 | Composables | 说明 |
|------|-------------|------|
| 三态学习标记 | `useSkillStatus` | todo / learning / mastered |
| 浏览追踪 | `useUsageTracker` | 浏览次数 + 最近查看时间 |
| 遗忘提醒 | `useUsageTracker.getStaleLearning()` | learning 状态 7 天未查看 → 提醒 |
| 间隔复习 | `useSpacedRepetition` | [1, 3, 7, 14, 30] 天间隔 |
| 个人笔记 | `useSkillNotes` | 每个 Skill 独立的 Markdown 笔记 |
| 收藏管理 | `useBookmarks` | 收藏列表 |
| 活动热力图 | `useStats` | 90 天 GitHub 风格热力图 |
| 学习概览 | `MySpaceView` | 进度环形图 + 分类展示 |

### 4.2 缺失的学习能力

1. **没有学习路径/课程**：Skill 之间没有前置依赖关系
2. **没有实践验证**：无法确认用户是否真的"掌握"了 Skill
3. **没有智能推荐**：不会根据用户行为推荐下一个要学的 Skill
4. **没有使用记录**：除了 view count，不知道用户实际使用了 Skill 多少次
5. **知识图谱不完整**：`useSkillGraph` 只做关联推荐，不做学习路径规划

### 4.3 推荐增强方案

#### 4.3.1 学习路径引擎

```javascript
// 新增: src/composables/useLearningPath.js
export function useLearningPath() {
  // 基于 Skill 的 related/prerequisites 字段生成学习路径
  function generatePath(targetSlug, currentStatuses) {
    // 拓扑排序：从 prerequisites 推导学习顺序
    // 输出：阶段 1 → 阶段 2 → 阶段 3 → 目标 Skill
  }

  // 根据用户当前水平推荐下一步
  function recommendNext(currentStatuses, interests) {
    // 基于协同过滤：相似用户学了什么
    // 基于内容：tag/category 关联度
  }
}
```

#### 4.3.2 实践追踪（"使用即学习"）

```javascript
// 增强 useUsageTracker.js
function trackUsage(slug, context) {
  // context = {
  //   scenario: 'debugging',     // 使用场景
  //   project: 'my-react-app',   // 项目名称
  //   duration: 45,              // 使用时长（分钟）
  //   outcome: 'success',        // 结果
  //   notes: '解决了 SSR 问题'   // 简要记录
  // }
}
```

#### 4.3.3 智能推荐系统

```javascript
// 新增: src/composables/useRecommendations.js
export function useRecommendations() {
  const recommendations = computed(() => {
    // 输入信号：
    // 1. 用户的 statuses（学习状态分布）
    // 2. 用户的 usageStats（使用频率和场景）
    // 3. 用户的 bookmarks（兴趣偏好）
    // 4. 当前项目上下文（如果有）

    // 推荐策略：
    // - 相似 Skill（同 category + 高 tag 重叠 + 未学习）
    // - 互补 Skill（不同 category 但场景互补）
    // - 进阶 Skill（prerequisites 已掌握）
    // - 热门 Skill（社区高频使用 + 用户未涉及）
  })
}
```

---

## 5. 适用场景分析

### 5.1 场景矩阵

| 场景 | 适用度 | 说明 |
|------|--------|------|
| **个人 Skill 知识库** | ⭐⭐⭐⭐⭐ | 核心场景，完美匹配 |
| **团队 Skill 共享** | ⭐⭐⭐ | 需要增加后端/同步能力 |
| **AI Agent 技能目录** | ⭐⭐⭐⭐ | 可作为 Agent 的技能注册中心 |
| **技术文档站** | ⭐⭐⭐ | 受限于静态架构，大规模内容需优化 |
| **在线教育/课程平台** | ⭐⭐ | 缺少课程结构、测验、进度跟踪 |
| **CLI 工具命令手册** | ⭐⭐⭐⭐ | CommandPalette + 命令复制功能很好用 |
| **开源项目文档** | ⭐⭐⭐ | 静态部署方便，但协作编辑不足 |

### 5.2 最佳适用场景

#### 场景 1：个人 AI 编程助手的技能目录（核心场景）

```
用户 → Skill Book → 浏览/搜索 Skill → 获取命令 → 在 Claude Code 中使用
                           ↓
                    学习追踪 → 间隔复习 → 逐步掌握
```

**适合原因**：
- Skill 格式（Markdown + Frontmatter）与 Claude Code Skill 格式高度兼容
- 学习追踪帮助系统性掌握大量 Skill
- 命令面板（Ctrl+K）快速查找和复制命令

#### 场景 2：端到端 Agent 的技能注册中心（扩展场景）

```
Agent → Skill Book API → 查询适用 Skill → 加载 Skill 指令 → 执行任务
                            ↓
                      记录使用结果 → 更新 Skill 质量评分
```

### 5.3 不太适合的场景

- **大规模文档站**（1000+ 文档）：需要服务端渲染和搜索索引
- **实时协作编辑**：无后端，无冲突解决
- **商业 SaaS 知识库**：缺少权限管理、审计、分析

---

## 6. 优化空间与改进方案

### 6.1 架构层面

| 问题 | 方案 | 优先级 |
|------|------|--------|
| 单例 composable 测试困难 | 引入 provide/inject 或简单的 store factory | 中 |
| 无后端，数据无法跨设备 | 增加可选的后端同步层（GitHub Gist / Cloudflare KV） | 高 |
| 前端 frontmatter 解析器功能有限 | 使用 `js-yaml` 的浏览器精简版或保持现状（设计意图） | 低 |
| PWA 更新不可控 | 增加"检查更新"按钮和更新日志 | 中 |

### 6.2 数据层面

| 问题 | 方案 | 优先级 |
|------|------|--------|
| Skill 无版本/质量元数据 | 在 frontmatter 中增加 `version`, `quality`, `lastVerified` | **高** |
| 用户数据仅 localStorage | 增加 JSON 导出/导入 + GitHub Gist 同步 | **高** |
| 无数据验证 | 增加 Skill Schema 验证（slug 格式、必填字段） | 中 |
| Index.json 全量加载 | 52 个 Skill 目前还好，超过 200 需要分页/懒加载 | 低 |

### 6.3 功能层面

| 功能 | 说明 | 优先级 |
|------|------|--------|
| **Skill 更新检查** | 自动检测上游仓库更新 | **高** |
| **Skill 质量评分** | 社区评分 + 自动质量检测 | **高** |
| **学习路径推荐** | 基于前置条件和用户水平推荐 | 中 |
| **使用记录** | 记录"何时在何项目使用了何 Skill" | 中 |
| **导出分享** | 将单个 Skill 导出为独立 HTML | 中 |
| **Skill Diff** | 本地修改 vs 上游版本的差异对比 | 中 |
| **批量操作** | 批量标记状态、批量导出 | 低 |
| **i18n** | 多语言 Skill 支持 | 低 |

### 6.4 性能层面

| 问题 | 当前状态 | 优化方案 |
|------|----------|----------|
| index.json 大小 | ~52 个 Skill，约 50KB | 超过 200 时考虑分页 |
| Markdown 渲染 | markdown-it 客户端渲染 | 可预渲染为 HTML 缓存 |
| Fuse.js 搜索 | 每次都重建 Fuse 实例 | 可缓存 Fuse 索引 |
| 首屏加载 | Vue SPA + Tailwind | 已使用 PWA 缓存，可增加 SSR 预渲染 |

### 6.5 测试覆盖

当前有 8 个测试文件，覆盖了主要的 composable 和流程。建议增加：

- `useSkills.js` 的 CRUD 完整测试
- `useSpacedRepetition` 的间隔逻辑测试
- `useSkillGraph` 的评分算法测试
- E2E 测试（Playwright 已有依赖）

---

## 7. 端到端 Agent 集成方案

### 7.1 目标架构

你的核心需求是让 Skill Book 成为 End-to-End Agent 的核心组件：

```
┌──────────────────────────────────────────────────────────┐
│                    End-to-End Agent                       │
│                                                           │
│  ┌────────────┐  ┌────────────┐  ┌───────────────────┐  │
│  │ Task Input │→│ Skill      │→│ Execution Engine  │  │
│  │ (用户需求)  │  │ Selector   │  │ (Claude Code/API) │  │
│  └────────────┘  └────────────┘  └───────────────────┘  │
│                        ↓                      ↓           │
│              ┌─────────────────┐    ┌───────────────┐    │
│              │   Skill Book    │    │  Tool Output  │    │
│              │  (知识库+管理)   │    │  (执行结果)    │    │
│              └─────────────────┘    └───────────────┘    │
│                        ↓                      ↓           │
│              ┌─────────────────────────────────────┐     │
│              │        Feedback Loop                 │     │
│              │  记录使用 → 更新评分 → 优化推荐       │     │
│              └─────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘
```

### 7.2 Skill Book 作为 Agent 技能注册中心

```javascript
// 新增: src/composables/useAgentBridge.js
export function useAgentBridge() {
  // 1. Agent 通过 URL/API 查询 Skill
  // GET /api/skills?scenario=debugging&tags=react

  // 2. 获取 Skill 完整指令
  // GET /api/skills/:slug → 返回 Markdown（包含 system prompt）

  // 3. Agent 执行后反馈
  // POST /api/feedback { slug, outcome, duration, notes }

  // 4. 动态更新 Skill 质量评分
  // 基于使用频率、成功率、用户反馈自动调整评分
}
```

### 7.3 动态 Skill 加载

```javascript
// 让 Agent 能动态发现和加载 Skill
class SkillLoader {
  async loadForTask(taskDescription) {
    // 1. 用 taskDescription 搜索匹配的 Skill
    // 2. 按 scenario → tags → description 相关性排序
    // 3. 返回 top-3 匹配的 Skill 完整内容
    // 4. Agent 将 Skill 内容注入到 system prompt
  }

  async executeWithSkill(skill, context) {
    // 1. 加载 Skill 的 commands
    // 2. 在 Agent 执行环境中注册工具
    // 3. 执行任务
    // 4. 记录使用结果到 Skill Book
  }
}
```

---

## 8. 实施路线图

### Phase 1: 基础增强（2-4 周）

**目标**：让 Skill 可更新、可同步、可评分

```
□ Skill Schema 扩展
  - frontmatter 增加 version, source, lastVerified, quality 字段
  - build-skills.js 适配新字段
  - 现有 52 个 Skill 补充元数据

□ 上游追踪机制
  - 创建 upstream-repos.json 配置文件
  - 实现 GitHub API 检查更新脚本
  - 增加 Skill 的 sourceSha / lastSyncAt 字段

□ 数据导出/导入
  - JSON 导出（包含所有用户数据）
  - JSON 导入（合并策略）
  - GitHub Gist 同步（可选）
```

### Phase 2: 学习增强（2-4 周）

**目标**：从"浏览工具"升级为"学习平台"

```
□ 学习路径引擎
  - Skill 增加 prerequisites 字段
  - 实现拓扑排序学习路径生成
  - UI 展示学习路径图

□ 智能推荐
  - 基于协同过滤和内容推荐
  - HomeView 增加"为你推荐"区域
  - 根据当前场景推荐相关 Skill

□ 使用记录增强
  - 增加"使用记录"功能（何时、何项目、何场景）
  - 统计面板增加使用频率图表
```

### Phase 3: Agent 集成（4-8 周）

**目标**：成为端到端 Agent 系统的核心组件

```
□ Agent Bridge API
  - 标准化 Agent 查询接口
  - Skill 内容注入协议
  - 使用反馈收集

□ 动态 Skill 发现
  - 从 GitHub Topics 自动发现新 Skill
  - AI 辅助质量预筛选
  - 社区投票/评分

□ 质量闭环
  - 使用频率 → 质量评分
  - 用户反馈 → 改进建议
  - 自动淘汰低质量 Skill
```

### Phase 4: 生态扩展（长期）

```
□ Skill Registry 公共服务
  - 社区可提交 Skill
  - 自动质量检查（frontmatter 完整性、命令可执行性）
  - 审核流程

□ 多端同步
  - Web 端 ↔ CLI 端数据同步
  - 团队共享空间

□ 分析仪表盘
  - 学习进度趋势
  - Skill 生态健康度
  - 用户行为分析
```

---

## 总结

Skill Book 是一个**架构清晰、功能务实**的 Skill 管理工具。它的核心优势在于：

1. **零后端依赖**：静态文件 + localStorage 的极简架构，部署成本为零
2. **完善的学习追踪**：已内置状态标记、间隔复习、浏览追踪、热力图
3. **优秀的搜索体验**：fuse.js 模糊搜索 + 分类/标签/场景多维度过滤
4. **Skill 格式标准化**：Markdown + YAML Frontmatter 与 Claude Code Skill 生态系统兼容

要满足你的核心需求，**最关键的三步**是：

1. **建立上游追踪机制**（Phase 1）→ 让 Skill 自动保持最新
2. **增加学习路径和推荐**（Phase 2）→ 从"管理工具"变成"学习平台"
3. **构建 Agent Bridge**（Phase 3）→ 让 Skill Book 成为端到端 Agent 的知识引擎

这三个阶段完成后，Skill Book 将从一个静态的 Skill 浏览器，升级为一个**动态的、自我进化的 AI Agent 技能生态系统**。
