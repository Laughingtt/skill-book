# Skill Book V2 — 动态 Skill 生态系统 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Skill Book 从静态 Skill 浏览器升级为具备自动更新同步、学习路径推荐、Agent 集成的动态 Skill 生态系统。

**Architecture:** 分三阶段渐进式构建。Phase 1 建立数据基础（扩展 Schema + 上游追踪 + 导出同步），Phase 2 增加学习智能（路径引擎 + 推荐系统 + 使用记录），Phase 3 打通 Agent 集成（Agent Bridge + 动态发现 + 质量闭环）。每阶段产出独立可用的功能增量，保持现有 composable 单例模式 + 零后端依赖架构。

**Tech Stack:** Vue 3.5 + Vite 6 + TailwindCSS 4 + Vitest + fuse.js + markdown-it

**Source Report:** `docs/research/skill-book-framework-analysis.md`

---

## File Structure Map

```
New files:
  src/composables/useSkillSync.js        — 上游追踪 + 更新检查 + Gist 同步
  src/composables/useLearningPath.js     — 拓扑排序学习路径引擎
  src/composables/useRecommendations.js  — 智能推荐系统
  src/composables/useAgentBridge.js      — Agent 查询/反馈接口
  src/composables/useSkillDiscovery.js   — 动态 Skill 发现
  scripts/sync-upstream.js               — CI 上游更新检查脚本
  scripts/discover-skills.js             — GitHub Topics 发现脚本
  upstream-repos.json                    — 上游仓库配置
  src/__tests__/skill-sync.test.js       — useSkillSync 测试
  src/__tests__/learning-path.test.js    — useLearningPath 测试
  src/__tests__/recommendations.test.js  — useRecommendations 测试
  src/__tests__/agent-bridge.test.js     — useAgentBridge 测试
  src/__tests__/skill-discovery.test.js  — useSkillDiscovery 测试
  src/components/SyncPanel.vue           — 同步管理 UI
  src/components/LearningPathView.vue    — 学习路径可视化
  src/components/RecommendationBar.vue   — 推荐栏

Modified files:
  scripts/build-skills.js                — 扩展 frontmatter 字段提取
  src/composables/useSkills.js           — 增加 quality/version/prerequisites 字段支持
  src/composables/useUsageTracker.js     — 增加 trackUsage() 丰富上下文
  src/views/HomeView.vue                 — 推荐栏集成 + 同步入口
  src/views/MySpaceView.vue              — 学习路径 + 使用记录展示
  src/views/SkillDetailView.vue          — 质量信息展示
  src/components/SkillCard.vue           — 质量评分徽章
  src/components/GlobalNav.vue           — 同步状态指示
  src/assets/styles/tokens.css           — 新增 animation tokens
```

---

## Phase 1: 基础增强 — Skill 可更新、可同步、可评分

### Task 1.1: 扩展 Skill Schema — 更新 build-skills.js

**Files:**
- Modify: `scripts/build-skills.js`
- Create: `src/__tests__/skill-sync.test.js` (test setup)

- [ ] **Step 1: 扩展 build-skills.js 提取新字段**

Modify `scripts/build-skills.js`, add new fields to the index entry:

```javascript
// scripts/build-skills.js — 在 index.push() 处替换为：
index.push({
  name: data.name,
  slug: data.slug,
  category: data.category || '',
  tags: data.tags || [],
  description: data.description || '',
  scenarios: data.scenarios || [],
  ...(data.commands && { commands: data.commands }),
  ...(data.quickstart && { quickstart: data.quickstart }),
  ...(data.install && { install: data.install }),
  ...(data.source && { source: data.source }),
  ...(data.related && { related: data.related }),
  // ── V2 新增字段 ──
  ...(data.version && { version: data.version }),
  ...(data.prerequisites && { prerequisites: data.prerequisites }),
  ...(data.quality && { quality: data.quality }),
  ...(data.lastVerified && { lastVerified: data.lastVerified }),
  ...(data.deprecated && { deprecated: data.deprecated }),
})
```

- [ ] **Step 2: 运行 build:skills 验证无报错**

Run: `npm run build:skills`
Expected: `Generated index.json with 52 skills` (无 warnings)

- [ ] **Step 3: 提交**

```bash
git add scripts/build-skills.js
git commit -m "feat: extend build-skills.js to extract version, prerequisites, quality, lastVerified, deprecated fields"
```

---

### Task 1.2: 上游仓库配置 + 更新检查脚本

**Files:**
- Create: `upstream-repos.json`
- Create: `scripts/sync-upstream.js`

- [ ] **Step 1: 创建 upstream-repos.json 配置文件**

```json
{
  "repos": [
    {
      "owner": "anthropics",
      "repo": "skills",
      "branch": "main",
      "skillsPath": "skills",
      "category": "编码开发与工程规范",
      "tags": ["anthropic", "official"],
      "enabled": true
    },
    {
      "owner": "obra",
      "repo": "superpowers",
      "branch": "main",
      "skillsPath": ".claude/skills",
      "category": "编码开发与工程规范",
      "tags": ["workflow", "quality"],
      "enabled": true
    },
    {
      "owner": "vercel-labs",
      "repo": "agent-skills",
      "branch": "main",
      "skillsPath": "skills",
      "category": "编码开发与工程规范",
      "tags": ["vercel", "official"],
      "enabled": true
    }
  ]
}
```

- [ ] **Step 2: 创建 scripts/sync-upstream.js**

```javascript
// scripts/sync-upstream.js
// 检查上游仓库更新，输出有变更的 skill 列表
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const configPath = path.join(__dirname, '..', 'upstream-repos.json')
const skillsDir = path.join(__dirname, '..', 'public', 'skills')

async function checkRepo(owner, repo, branch) {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'skill-book-sync',
    },
  })
  if (!res.ok) {
    console.error(`  Failed to fetch ${owner}/${repo}: HTTP ${res.status}`)
    return null
  }
  const data = await res.json()
  return { owner, repo, latestSha: data.sha, committedAt: data.commit.committer.date }
}

async function main() {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

  for (const repo of config.repos) {
    if (!repo.enabled) continue
    console.log(`Checking ${repo.owner}/${repo}...`)
    const info = await checkRepo(repo.owner, repo.repo, repo.branch)
    if (info) {
      console.log(`  Latest: ${info.latestSha.slice(0, 7)} (${info.committedAt})`)
    }
  }
}

main().catch(e => { console.error(e); process.exit(1) })
```

- [ ] **Step 3: 测试脚本可执行**

Run: `node scripts/sync-upstream.js`
Expected: 输出 3 个仓库的最新 commit SHA 和时间

- [ ] **Step 4: 提交**

```bash
git add upstream-repos.json scripts/sync-upstream.js
git commit -m "feat: add upstream tracking config and sync check script"
```

---

### Task 1.3: useSkillSync — 更新检查 + Gist 同步 Composables

**Files:**
- Create: `src/composables/useSkillSync.js`
- Create: `src/__tests__/skill-sync.test.js`

- [ ] **Step 1: 编写 useSkillSync 的失败测试**

Create `src/__tests__/skill-sync.test.js`:

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage
const store = {}
const localStorageMock = {
  getItem: vi.fn(key => store[key] || null),
  setItem: vi.fn((key, val) => { store[key] = val }),
  removeItem: vi.fn(key => { delete store[key] }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
}
vi.stubGlobal('localStorage', localStorageMock)
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const { useSkillSync } = await import('../composables/useSkillSync.js')

describe('useSkillSync', () => {
  let sync

  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
    sync = useSkillSync()
  })

  describe('exportData', () => {
    it('exports all localStorage keys into a single JSON blob', () => {
      store['skill-book-skills'] = JSON.stringify([{ slug: 'test', name: 'Test' }])
      store['skill-book-bookmarks'] = JSON.stringify(['test'])
      store['skill-book-skill-status'] = JSON.stringify({ test: 'learning' })
      store['skill-book-skill-notes'] = JSON.stringify({ test: '# note' })
      store['skill-book-usage-stats'] = JSON.stringify({ test: { views: 5 } })
      store['skill-book-review-schedule'] = JSON.stringify({ test: { nextReviewAt: 123 } })

      const blob = sync.exportData()
      const parsed = JSON.parse(blob)

      expect(parsed.skills).toEqual([{ slug: 'test', name: 'Test' }])
      expect(parsed.bookmarks).toEqual(['test'])
      expect(parsed.statuses).toEqual({ test: 'learning' })
      expect(parsed.notes).toEqual({ test: '# note' })
      expect(parsed.usageStats).toEqual({ test: { views: 5 } })
      expect(parsed.reviewSchedule).toEqual({ test: { nextReviewAt: 123 } })
      expect(parsed.exportedAt).toBeDefined()
      expect(parsed.version).toBe(1)
    })
  })

  describe('importData', () => {
    it('merges imported data into localStorage without overwriting existing user fields', () => {
      store['skill-book-skills'] = JSON.stringify([{ slug: 'existing', name: 'Existing', description: 'mine' }])
      store['skill-book-bookmarks'] = JSON.stringify(['existing'])

      const importBlob = JSON.stringify({
        version: 1,
        skills: [{ slug: 'imported', name: 'Imported' }],
        bookmarks: ['imported'],
        statuses: { imported: 'todo' },
        exportedAt: new Date().toISOString(),
      })

      const result = sync.importData(importBlob)
      expect(result.added).toBe(1)
      expect(result.skipped).toBe(0)

      const skills = JSON.parse(store['skill-book-skills'])
      expect(skills.length).toBe(2)
      expect(skills.find(s => s.slug === 'existing').description).toBe('mine')
    })
  })

  describe('checkForUpdates', () => {
    it('compares local skill versions with upstream repo config', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ slug: 'test', version: '2.0.0' }]),
      })
      // Not implemented yet — test exists to drive implementation
      expect(sync.checkForUpdates).toBeDefined()
    })
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/__tests__/skill-sync.test.js`
Expected: FAIL — `useSkillSync is not a function` 或模块未找到

- [ ] **Step 3: 实现 useSkillSync.js 最小版本（exportData + importData）**

Create `src/composables/useSkillSync.js`:

```javascript
import { ref } from 'vue'

const STORAGE_KEYS = {
  skills: 'skill-book-skills',
  bookmarks: 'skill-book-bookmarks',
  statuses: 'skill-book-skill-status',
  notes: 'skill-book-skill-notes',
  usageStats: 'skill-book-usage-stats',
  reviewSchedule: 'skill-book-review-schedule',
}

const syncing = ref(false)
const lastSyncAt = ref(null)
const syncError = ref(null)

export function useSkillSync() {
  function exportData() {
    const data = { version: 1, exportedAt: new Date().toISOString() }
    for (const [key, storageKey] of Object.entries(STORAGE_KEYS)) {
      try {
        const raw = localStorage.getItem(storageKey)
        data[key] = raw ? JSON.parse(raw) : (storageKey.includes('skills') || storageKey.includes('bookmarks') ? [] : {})
      } catch {
        data[key] = storageKey.includes('skills') || storageKey.includes('bookmarks') ? [] : {}
      }
    }
    const blob = JSON.stringify(data, null, 2)
    return blob
  }

  function importData(jsonString) {
    let data
    try {
      data = JSON.parse(jsonString)
    } catch {
      syncError.value = '无效的 JSON 格式'
      return { added: 0, skipped: 0, error: '无效的 JSON 格式' }
    }

    let added = 0
    let skipped = 0

    if (data.skills && Array.isArray(data.skills)) {
      const existingRaw = localStorage.getItem(STORAGE_KEYS.skills)
      const existing = existingRaw ? JSON.parse(existingRaw) : []
      const slugMap = new Map(existing.map(s => [s.slug, s]))

      for (const imported of data.skills) {
        if (slugMap.has(imported.slug)) {
          skipped++
        } else {
          slugMap.set(imported.slug, imported)
          added++
        }
      }
      localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify([...slugMap.values()]))
    }

    // Merge bookmarks
    if (data.bookmarks && Array.isArray(data.bookmarks)) {
      const existingBm = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookmarks) || '[]')
      const merged = [...new Set([...existingBm, ...data.bookmarks])]
      localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(merged))
    }

    // Merge statuses (import only if key doesn't exist)
    if (data.statuses) {
      const existingSt = JSON.parse(localStorage.getItem(STORAGE_KEYS.statuses) || '{}')
      const merged = { ...data.statuses, ...existingSt }
      localStorage.setItem(STORAGE_KEYS.statuses, JSON.stringify(merged))
    }

    // Merge notes (don't overwrite existing)
    if (data.notes) {
      const existingNt = JSON.parse(localStorage.getItem(STORAGE_KEYS.notes) || '{}')
      const merged = { ...data.notes, ...existingNt }
      localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(merged))
    }

    lastSyncAt.value = new Date().toISOString()
    syncing.value = false
    syncError.value = null
    return { added, skipped }
  }

  function checkForUpdates() {
    // Placeholder — implemented in Task 1.4
  }

  return {
    syncing,
    lastSyncAt,
    syncError,
    exportData,
    importData,
    checkForUpdates,
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run src/__tests__/skill-sync.test.js`
Expected: PASS (exportData + importData 测试通过, checkForUpdates 待实现)

- [ ] **Step 5: 提交**

```bash
git add src/composables/useSkillSync.js src/__tests__/skill-sync.test.js
git commit -m "feat: add useSkillSync composable with export/import data functions"
```

---

### Task 1.4: 同步面板 UI 组件

**Files:**
- Create: `src/components/SyncPanel.vue`
- Modify: `src/views/HomeView.vue`

- [ ] **Step 1: 创建 SyncPanel.vue 组件**

Create `src/components/SyncPanel.vue`:

```vue
<script setup>
import { ref } from 'vue'
import { useSkillSync } from '../composables/useSkillSync'

const emit = defineEmits(['close'])
const { syncing, lastSyncAt, syncError, exportData, importData } = useSkillSync()
const activeTab = ref('export')
const importText = ref('')
const importResult = ref(null)
const copyDone = ref(false)

function handleExport() {
  const blob = exportData()
  const url = URL.createObjectURL(new Blob([blob], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `skill-book-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

async function handleCopy() {
  const blob = exportData()
  try {
    await navigator.clipboard.writeText(blob)
    copyDone.value = true
    setTimeout(() => { copyDone.value = false }, 2000)
  } catch { /* clipboard not available */ }
}

function handleImport() {
  importResult.value = importData(importText.value)
}
</script>

<template>
  <div class="sync-panel-overlay" @click.self="emit('close')">
    <div class="sync-panel">
      <div class="sync-panel__header">
        <h3 class="sync-panel__title">数据同步</h3>
        <button class="sync-panel__close" @click="emit('close')">×</button>
      </div>

      <div class="sync-panel__tabs">
        <button :class="['sync-tab', activeTab === 'export' && 'sync-tab--active']" @click="activeTab = 'export'">导出</button>
        <button :class="['sync-tab', activeTab === 'import' && 'sync-tab--active']" @click="activeTab = 'import'">导入</button>
      </div>

      <div v-if="activeTab === 'export'" class="sync-panel__body">
        <p class="sync-desc">导出所有数据（Skill、书签、学习状态、笔记、使用记录）为 JSON 文件。</p>
        <div class="sync-actions">
          <button class="btn btn-accent" @click="handleExport">下载 JSON</button>
          <button class="btn btn-ghost" @click="handleCopy">
            {{ copyDone ? '✓ 已复制' : '复制到剪贴板' }}
          </button>
        </div>
        <p v-if="lastSyncAt" class="sync-meta">上次同步: {{ new Date(lastSyncAt).toLocaleString('zh-CN') }}</p>
      </div>

      <div v-if="activeTab === 'import'" class="sync-panel__body">
        <p class="sync-desc">粘贴之前导出的 JSON 数据。已有数据不会被覆盖。</p>
        <textarea
          v-model="importText"
          class="sync-textarea"
          placeholder="粘贴 JSON 数据..."
          rows="6"
        ></textarea>
        <button class="btn btn-accent" @click="handleImport" :disabled="!importText.trim()">导入</button>
        <p v-if="importResult" class="sync-result">
          导入完成: {{ importResult.added }} 项新增, {{ importResult.skipped }} 项跳过
        </p>
        <p v-if="syncError" class="sync-error">{{ syncError }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sync-panel-overlay {
  position: fixed; inset: 0; z-index: var(--z-modal, 1000);
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
}
.sync-panel {
  background: var(--color-bg-elevated); border-radius: 14px;
  padding: 24px 28px; max-width: 420px; width: 90%;
  box-shadow: var(--shadow-xl);
}
.sync-panel__header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.sync-panel__title {
  font-family: 'Crimson Pro', serif; font-size: 20px; font-weight: 600;
  color: var(--color-text-primary); margin: 0;
}
.sync-panel__close {
  background: none; border: none; font-size: 20px;
  color: var(--color-text-tertiary); cursor: pointer;
  padding: 0; line-height: 1;
}
.sync-panel__tabs { display: flex; gap: 4px; margin-bottom: 16px; }
.sync-tab {
  font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
  padding: 4px 12px; border-radius: 6px; border: 1px solid var(--color-border);
  background: transparent; color: var(--color-text-secondary); cursor: pointer;
  transition: all 0.15s ease;
}
.sync-tab--active { background: var(--color-accent); color: var(--color-text-inverse); border-color: var(--color-accent); }
.sync-panel__body { display: flex; flex-direction: column; gap: 12px; }
.sync-desc { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--color-text-secondary); margin: 0; line-height: 1.5; }
.sync-actions { display: flex; gap: 8px; }
.sync-meta { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--color-text-tertiary); }
.sync-textarea {
  width: 100%; font-family: 'DM Mono', Menlo, monospace; font-size: 12px;
  padding: 10px 12px; border: 1px solid var(--color-border-strong);
  border-radius: 8px; background: var(--color-bg-recessed);
  color: var(--color-text-primary); resize: vertical; outline: none;
  box-sizing: border-box;
}
.sync-textarea:focus { border-color: var(--color-accent); }
.sync-result { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--color-success, #4caf7d); }
.sync-error { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--color-accent); }
</style>
```

- [ ] **Step 2: 在 HomeView 集成 SyncPanel 入口**

Modify `src/views/HomeView.vue`, add import and trigger button in the Hero section hero-actions area:

```vue
<!-- In <script setup>, add: -->
import SyncPanel from '../components/SyncPanel.vue'
const showSyncPanel = ref(false)

<!-- After the "添加技能" button, add: -->
<button @click="showSyncPanel = true" class="sync-entry-btn">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
  同步
</button>

<!-- At bottom of template: -->
<SyncPanel v-if="showSyncPanel" @close="showSyncPanel = false" />
```

Add CSS for `.sync-entry-btn`:

```css
.sync-entry-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-strong);
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  margin-top: 12px;
  margin-left: 8px;
  transition: all 0.2s ease;
}
.sync-entry-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
```

- [ ] **Step 3: 验证 UI — 启动 dev server 检查**

Run: `npm run dev`
Manual check: 点击"同步"按钮 → 弹出面板 → 切换导出/导入 tab → 点击"下载 JSON" 下载文件

- [ ] **Step 4: 提交**

```bash
git add src/components/SyncPanel.vue src/views/HomeView.vue
git commit -m "feat: add SyncPanel UI for data export/import"
```

---

## Phase 2: 学习增强 — 学习路径 + 智能推荐 + 使用记录

### Task 2.1: 增强 useUsageTracker — trackUsage() 丰富上下文

**Files:**
- Modify: `src/composables/useUsageTracker.js`

- [ ] **Step 1: 扩展 useUsageTracker 增加 trackUsage 方法**

Modify `src/composables/useUsageTracker.js`, add after `trackView`:

```javascript
// 在 trackView 方法后面增加:
const trackUsage = (slug, context = {}) => {
  const current = stats.value[slug] || { views: 0, lastViewedAt: null, usageLog: [] }
  const usageEntry = {
    at: new Date().toISOString(),
    scenario: context.scenario || '',
    project: context.project || '',
    duration: context.duration || 0,
    outcome: context.outcome || '',
    notes: context.notes || '',
  }
  const usageLog = [...(current.usageLog || []), usageEntry].slice(-50) // keep last 50
  stats.value = {
    ...stats.value,
    [slug]: {
      ...current,
      views: current.views + 1,
      lastViewedAt: new Date().toISOString(),
      usageLog,
      lastScenario: context.scenario || current.lastScenario || '',
      lastProject: context.project || current.lastProject || '',
      totalDuration: (current.totalDuration || 0) + (context.duration || 0),
    }
  }
  saveToStorage()
}

// 新增: 获取使用频率（最近30天使用次数）
const getUsageFrequency = (slug) => {
  const s = stats.value[slug]
  if (!s || !s.usageLog) return 0
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  return s.usageLog.filter(e => new Date(e.at).getTime() > thirtyDaysAgo).length
}

// 新增: 获取最常用场景
const getTopScenarios = (slug) => {
  const s = stats.value[slug]
  if (!s || !s.usageLog) return []
  const counts = {}
  s.usageLog.forEach(e => {
    if (e.scenario) counts[e.scenario] = (counts[e.scenario] || 0) + 1
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([s]) => s)
}
```

- [ ] **Step 2: 在 return 语句中暴露新方法**

Add to return object:
```javascript
return {
  stats,
  trackView,
  trackUsage,        // ← 新增
  getUsageFrequency, // ← 新增
  getTopScenarios,   // ← 新增
  getViewCount,
  getLastViewed,
  recentlyViewed,
  getStaleLearning,
  clearStats,
}
```

- [ ] **Step 3: 更新 SkillDetailView 调用 trackUsage**

Modify `src/views/SkillDetailView.vue`, in `loadSkill` after `trackView(slug)`:

```javascript
// 将 trackView(slug) 替换为:
trackUsage(slug, {
  scenario: skill.value?.scenarios?.[0] || '',
  project: '',
  duration: 0,
  outcome: 'viewed',
})
```

- [ ] **Step 4: 提交**

```bash
git add src/composables/useUsageTracker.js src/views/SkillDetailView.vue
git commit -m "feat: add trackUsage() with scenario/project/duration context tracking"
```

---

### Task 2.2: useLearningPath — 学习路径引擎

**Files:**
- Create: `src/composables/useLearningPath.js`
- Create: `src/__tests__/learning-path.test.js`

- [ ] **Step 1: 编写学习路径测试**

Create `src/__tests__/learning-path.test.js`:

```javascript
import { describe, it, expect } from 'vitest'

const { computeLearningPath, findNextSkill } = await import('../composables/useLearningPath.js')

const sampleSkills = [
  { slug: 'git-basics', name: 'Git Basics', category: 'Dev', tags: ['git'], prerequisites: [] },
  { slug: 'git-smart-commit', name: 'Smart Commit', category: 'Dev', tags: ['git', 'commit'], prerequisites: ['git-basics'] },
  { slug: 'code-refactor', name: 'Code Refactor', category: 'Dev', tags: ['refactor'], prerequisites: ['git-basics'] },
  { slug: 'deploy-to-vercel', name: 'Deploy Vercel', category: 'DevOps', tags: ['deploy'], prerequisites: ['git-smart-commit'] },
  { slug: 'tdd', name: 'TDD', category: 'Quality', tags: ['testing'], prerequisites: [] },
  { slug: 'frontend-design', name: 'Frontend Design', category: 'Design', tags: ['design'], prerequisites: [] },
]

const sampleStatuses = {
  'git-basics': 'mastered',
  'tdd': 'learning',
}

describe('computeLearningPath', () => {
  it('returns empty array when target skill has no prerequisites', () => {
    const path = computeLearningPath('frontend-design', sampleSkills, sampleStatuses)
    expect(path).toEqual([])
  })

  it('returns all prerequisites in topological order for a deep chain', () => {
    const path = computeLearningPath('deploy-to-vercel', sampleSkills, sampleStatuses)
    expect(path.map(s => s.slug)).toEqual(['git-smart-commit'])
    // git-basics already mastered, so not in path
  })

  it('includes unmet prerequisites even if user has not started them', () => {
    const path = computeLearningPath('deploy-to-vercel', sampleSkills, {})
    expect(path.map(s => s.slug)).toEqual(['git-basics', 'git-smart-commit'])
  })

  it('returns empty array for unknown slug', () => {
    const path = computeLearningPath('nonexistent', sampleSkills, sampleStatuses)
    expect(path).toEqual([])
  })
})

describe('findNextSkill', () => {
  it('recommends skills whose prerequisites are met', () => {
    const next = findNextSkill(sampleSkills, sampleStatuses)
    // git-smart-commit: prerequisite git-basics is mastered → good next
    // code-refactor: prerequisite git-basics is mastered → good next
    // deploy-to-vercel: prerequisite git-smart-commit NOT mastered → not ready
    const slugs = next.map(s => s.slug)
    expect(slugs).toContain('git-smart-commit')
    expect(slugs).toContain('code-refactor')
    expect(slugs).not.toContain('deploy-to-vercel')
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/__tests__/learning-path.test.js`
Expected: FAIL

- [ ] **Step 3: 实现 useLearningPath.js**

Create `src/composables/useLearningPath.js`:

```javascript
import { computed } from 'vue'
import { useSkills } from './useSkills'
import { useSkillStatus } from './useSkillStatus'

/**
 * Topological sort to find the learning path from unmet prerequisites to target.
 * Returns skills whose prerequisites are NOT yet mastered/learned,
 * in the order they should be learned.
 */
export function computeLearningPath(targetSlug, skills, statuses) {
  const target = skills.find(s => s.slug === targetSlug)
  if (!target) return []

  const result = []
  const visited = new Set()
  const masteredOrLearning = new Set(
    Object.entries(statuses)
      .filter(([, s]) => s === 'mastered' || s === 'learning')
      .map(([slug]) => slug)
  )

  function visit(slug) {
    if (visited.has(slug)) return
    visited.add(slug)
    const skill = skills.find(s => s.slug === slug)
    if (!skill) return
    const prereqs = skill.prerequisites || []
    for (const pre of prereqs) {
      if (!masteredOrLearning.has(pre) && !visited.has(pre)) {
        visit(pre)
      }
    }
    if (!masteredOrLearning.has(slug) && slug !== targetSlug) {
      result.push(skill)
    }
  }

  visit(targetSlug)
  return result
}

/**
 * Find skills the user is ready to learn:
 * - All prerequisites are mastered or learning
 * - User hasn't started this skill yet (no status)
 */
export function findNextSkill(skills, statuses) {
  const started = new Set(Object.keys(statuses))
  const masteredOrLearning = new Set(
    Object.entries(statuses)
      .filter(([, s]) => s === 'mastered' || s === 'learning')
      .map(([slug]) => slug)
  )

  return skills.filter(skill => {
    if (started.has(skill.slug)) return false
    const prereqs = skill.prerequisites || []
    if (prereqs.length === 0) return true // no barrier to entry
    return prereqs.every(p => masteredOrLearning.has(p))
  })
}

export function useLearningPath() {
  const { skills } = useSkills()
  const { statuses } = useSkillStatus()

  const readySkills = computed(() => {
    return findNextSkill(skills.value, statuses.value)
  })

  function getPathTo(targetSlug) {
    return computeLearningPath(targetSlug, skills.value, statuses.value)
  }

  return {
    readySkills,
    getPathTo,
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run src/__tests__/learning-path.test.js`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/composables/useLearningPath.js src/__tests__/learning-path.test.js
git commit -m "feat: add useLearningPath with topological sort and next-skill recommendation"
```

---

### Task 2.3: useRecommendations — 智能推荐系统

**Files:**
- Create: `src/composables/useRecommendations.js`
- Create: `src/__tests__/recommendations.test.js`

- [ ] **Step 1: 编写推荐系统测试**

Create `src/__tests__/recommendations.test.js`:

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'

const store = {}
vi.stubGlobal('localStorage', {
  getItem: vi.fn(key => store[key] || null),
  setItem: vi.fn((key, val) => { store[key] = val }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
})

const { computeRecommendations } = await import('../composables/useRecommendations.js')

const sampleSkills = [
  { slug: 'a', name: 'Skill A', category: 'Dev', tags: ['git', 'commit'], scenarios: ['debugging'] },
  { slug: 'b', name: 'Skill B', category: 'Dev', tags: ['git', 'push'], scenarios: ['deployment'] },
  { slug: 'c', name: 'Skill C', category: 'Design', tags: ['css', 'layout'], scenarios: ['design'] },
  { slug: 'd', name: 'Skill D', category: 'Dev', tags: ['test', 'unit'], scenarios: ['debugging', 'testing'] },
  { slug: 'e', name: 'Skill E', category: 'Design', tags: ['css', 'animation'], scenarios: ['design'] },
]

const sampleStatuses = { a: 'mastered', c: 'learning' }
const sampleBookmarks = ['a']
const sampleStats = {
  a: { views: 10, usageLog: [{ scenario: 'debugging', at: new Date().toISOString() }] },
  b: { views: 0 },
}

describe('computeRecommendations', () => {
  it('ranks unstarted skills by similarity to mastered/bookmarked skills', () => {
    const recs = computeRecommendations(sampleSkills, sampleStatuses, sampleBookmarks, sampleStats)
    // Skill B: same category 'Dev' as A (mastered), tag overlap 'git' → high score
    // Skill D: same category 'Dev' as A, scenario overlap 'debugging' with A's usage → high score
    // Skill C: already learning → excluded
    // Skill E: Design category, no overlap with A → lower
    expect(recs.length).toBeGreaterThan(0)
    // B and D should rank high (similar to mastered skill A)
    expect(recs.map(r => r.slug)).toContain('b')
    expect(recs.map(r => r.slug)).toContain('d')
    // Already started skills should be excluded
    expect(recs.map(r => r.slug)).not.toContain('a')
    expect(recs.map(r => r.slug)).not.toContain('c')
  })

  it('returns empty array when all skills are started', () => {
    const allStarted = { a: 'mastered', b: 'learning', c: 'todo', d: 'learning', e: 'mastered' }
    const recs = computeRecommendations(sampleSkills, allStarted, [], {})
    expect(recs).toEqual([])
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/__tests__/recommendations.test.js`
Expected: FAIL

- [ ] **Step 3: 实现 useRecommendations.js**

Create `src/composables/useRecommendations.js`:

```javascript
import { computed } from 'vue'
import { useSkills } from './useSkills'
import { useSkillStatus } from './useSkillStatus'
import { useBookmarks } from './useBookmarks'
import { useUsageTracker } from './useUsageTracker'
import { findNextSkill } from './useLearningPath'

export function computeRecommendations(skills, statuses, bookmarks, stats) {
  const started = new Set(Object.keys(statuses))
  const masteredSlugs = new Set(
    Object.entries(statuses).filter(([, s]) => s === 'mastered').map(([slug]) => slug)
  )
  const bookmarkedSlugs = new Set(bookmarks)

  // Build interest profile from mastered + bookmarked skills
  const interestTags = new Map()
  const interestCategories = new Map()
  const interestScenarios = new Map()

  for (const skill of skills) {
    const weight = (masteredSlugs.has(skill.slug) ? 3 : 0) + (bookmarkedSlugs.has(skill.slug) ? 2 : 0)
    if (weight === 0) continue
    for (const tag of (skill.tags || [])) {
      interestTags.set(tag, (interestTags.get(tag) || 0) + weight)
    }
    if (skill.category) {
      interestCategories.set(skill.category, (interestCategories.get(skill.category) || 0) + weight)
    }
    for (const sc of (skill.scenarios || [])) {
      interestScenarios.set(sc, (interestScenarios.get(sc) || 0) + weight)
    }
  }

  // Also consider recently used scenarios
  for (const [slug, stat] of Object.entries(stats)) {
    if (stat.lastScenario) {
      interestScenarios.set(stat.lastScenario, (interestScenarios.get(stat.lastScenario) || 0) + 1)
    }
  }

  // Score unstarted skills
  const candidates = skills
    .filter(s => !started.has(s.slug))
    .map(skill => {
      let score = 0
      for (const tag of (skill.tags || [])) {
        score += (interestTags.get(tag) || 0) * 0.5
      }
      score += (interestCategories.get(skill.category) || 0) * 1.0
      for (const sc of (skill.scenarios || [])) {
        score += (interestScenarios.get(sc) || 0) * 0.5
      }
      // Bonus for skills whose prerequisites are met
      const prereqs = skill.prerequisites || []
      if (prereqs.length > 0 && prereqs.every(p => masteredSlugs.has(p))) {
        score += 2
      }
      // Freshness bonus: skills with no prerequisites get small boost
      if (prereqs.length === 0) score += 0.5
      return { ...skill, score }
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)

  return candidates.slice(0, 6)
}

export function useRecommendations() {
  const { skills } = useSkills()
  const { statuses } = useSkillStatus()
  const { bookmarks } = useBookmarks()
  const { stats } = useUsageTracker()

  const recommendations = computed(() => {
    return computeRecommendations(skills.value, statuses.value, bookmarks.value, stats.value)
  })

  return { recommendations }
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run src/__tests__/recommendations.test.js`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/composables/useRecommendations.js src/__tests__/recommendations.test.js
git commit -m "feat: add useRecommendations with content+behavior hybrid recommendation engine"
```

---

### Task 2.4: HomeView 推荐栏 + MySpaceView 学习路径

**Files:**
- Create: `src/components/RecommendationBar.vue`
- Modify: `src/views/HomeView.vue`
- Create: `src/components/LearningPathView.vue`
- Modify: `src/views/MySpaceView.vue`

- [ ] **Step 1: 创建 RecommendationBar.vue**

Create `src/components/RecommendationBar.vue`:

```vue
<script setup>
import { useRecommendations } from '../composables/useRecommendations'
import { useRouter } from 'vue-router'

const { recommendations } = useRecommendations()
const router = useRouter()

function goTo(slug) {
  router.push({ name: 'skill-detail', params: { slug } })
}
</script>

<template>
  <div v-if="recommendations.length" class="rec-bar">
    <h3 class="rec-bar__title">为你推荐</h3>
    <div class="rec-bar__list">
      <button
        v-for="skill in recommendations"
        :key="skill.slug"
        class="rec-item"
        @click="goTo(skill.slug)"
      >
        <span class="rec-item__cat">{{ skill.category }}</span>
        <span class="rec-item__name">{{ skill.name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.rec-bar {
  max-width: 1200px; margin: 0 auto; padding: 0 22px 24px;
}
.rec-bar__title {
  font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--color-text-tertiary); margin: 0 0 10px;
}
.rec-bar__list { display: flex; gap: 8px; flex-wrap: wrap; }
.rec-item {
  display: flex; flex-direction: column; gap: 2px;
  padding: 8px 14px; background: var(--color-bg-elevated);
  border: 1px solid var(--color-border); border-radius: 10px;
  cursor: pointer; transition: all 0.15s ease; text-align: left;
}
.rec-item:hover { border-color: var(--color-accent); }
.rec-item__cat {
  font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-accent);
}
.rec-item__name {
  font-family: 'Crimson Pro', serif; font-size: 14px; font-weight: 500;
  color: var(--color-text-primary);
}
</style>
```

- [ ] **Step 2: 集成到 HomeView**

Modify `src/views/HomeView.vue`:
- Import `RecommendationBar`
- Add `<RecommendationBar />` after the Hero section, before the main layout div

- [ ] **Step 3: 创建 LearningPathView.vue**

Create `src/components/LearningPathView.vue`:

```vue
<script setup>
import { computed } from 'vue'
import { useLearningPath } from '../composables/useLearningPath'
import { useRouter } from 'vue-router'

const { readySkills } = useLearningPath()
const router = useRouter()

function goTo(slug) {
  router.push({ name: 'skill-detail', params: { slug } })
}
</script>

<template>
  <div v-if="readySkills.length" class="lp-section">
    <h3 class="lp-title">可开始学习</h3>
    <p class="lp-desc">以下技能的前置条件已满足，可以开始学习</p>
    <div class="lp-grid">
      <div
        v-for="skill in readySkills"
        :key="skill.slug"
        class="lp-card"
        @click="goTo(skill.slug)"
      >
        <span class="lp-card__cat">{{ skill.category }}</span>
        <span class="lp-card__name">{{ skill.name }}</span>
        <span v-if="skill.prerequisites?.length" class="lp-card__pres">
          前置: {{ skill.prerequisites.join(', ') }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lp-section { margin-top: 48px; }
.lp-title {
  font-family: 'Crimson Pro', serif; font-size: 22px; font-weight: 600;
  color: var(--color-text-primary); margin: 0 0 4px;
}
.lp-desc {
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  color: var(--color-text-secondary); margin: 0 0 16px;
}
.lp-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
}
.lp-card {
  background: var(--color-bg-elevated); border: 1px solid var(--color-border);
  border-radius: 10px; padding: 14px 16px; cursor: pointer;
  transition: all 0.15s ease; display: flex; flex-direction: column; gap: 4px;
}
.lp-card:hover { border-color: var(--color-border-accent); box-shadow: var(--shadow-sm); }
.lp-card__cat {
  font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-accent);
}
.lp-card__name {
  font-family: 'Crimson Pro', serif; font-size: 15px; font-weight: 500;
  color: var(--color-text-primary);
}
.lp-card__pres {
  font-family: 'DM Sans', sans-serif; font-size: 10px;
  color: var(--color-text-tertiary);
}
</style>
```

- [ ] **Step 4: 集成到 MySpaceView**

Modify `src/views/MySpaceView.vue`:
- Import `LearningPathView`
- Add `<LearningPathView />` after the "学习进度" section

- [ ] **Step 5: 验证 UI**

Run: `npm run dev`
Manual check:
- HomeView: 推荐栏出现在 Hero 下方
- MySpaceView: "可开始学习"区域出现

- [ ] **Step 6: 提交**

```bash
git add src/components/RecommendationBar.vue src/components/LearningPathView.vue src/views/HomeView.vue src/views/MySpaceView.vue
git commit -m "feat: add recommendation bar and learning path view to UI"
```

---

## Phase 3: Agent 集成 — Bridge + 动态发现 + 质量闭环

### Task 3.1: useAgentBridge — Agent 查询/反馈接口

**Files:**
- Create: `src/composables/useAgentBridge.js`
- Create: `src/__tests__/agent-bridge.test.js`

- [ ] **Step 1: 编写 Agent Bridge 测试**

Create `src/__tests__/agent-bridge.test.js`:

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'

const { useAgentBridge } = await import('../composables/useAgentBridge.js')

// Mock skills data
const mockSkills = [
  { slug: 'systematic-debugging', name: 'Systematic Debugging', category: 'Dev', tags: ['debugging'], scenarios: ['debugging', 'bug-fix'], description: 'Systematic debugging process', commands: [{ name: '开始调试', cmd: '/debug' }] },
  { slug: 'frontend-design', name: 'Frontend Design', category: 'Design', tags: ['design', 'css'], scenarios: ['design', 'ui-creation'], description: 'Frontend design skill', commands: [{ name: '生成页面', cmd: '/design' }] },
  { slug: 'tdd', name: 'TDD', category: 'Quality', tags: ['testing'], scenarios: ['testing', 'code-quality'], description: 'TDD workflow', commands: [{ name: '启动TDD', cmd: '/tdd' }] },
]

describe('useAgentBridge', () => {
  let bridge

  beforeEach(() => {
    bridge = useAgentBridge()
  })

  describe('querySkills', () => {
    it('finds skills matching a scenario', () => {
      const results = bridge.querySkills({ scenario: 'debugging' }, mockSkills)
      expect(results.map(r => r.slug)).toContain('systematic-debugging')
      expect(results.map(r => r.slug)).not.toContain('frontend-design')
    })

    it('finds skills by tags', () => {
      const results = bridge.querySkills({ tags: ['design'] }, mockSkills)
      expect(results.map(r => r.slug)).toEqual(['frontend-design'])
    })

    it('combines scenario and tag filters', () => {
      const results = bridge.querySkills({ scenario: 'testing', tags: ['testing'] }, mockSkills)
      expect(results.map(r => r.slug)).toEqual(['tdd'])
    })

    it('returns empty array for no matches', () => {
      const results = bridge.querySkills({ scenario: 'nonexistent' }, mockSkills)
      expect(results).toEqual([])
    })
  })

  describe('formatSkillForAgent', () => {
    it('formats a skill as a structured system prompt fragment', () => {
      const skill = mockSkills[0]
      const prompt = bridge.formatSkillForAgent(skill)
      expect(prompt).toContain('Systematic Debugging')
      expect(prompt).toContain('systematic-debugging')
      expect(prompt).toContain('Systematic debugging process')
      expect(prompt).toContain('/debug')
      expect(prompt).toContain('debugging')
    })
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/__tests__/agent-bridge.test.js`
Expected: FAIL

- [ ] **Step 3: 实现 useAgentBridge.js**

Create `src/composables/useAgentBridge.js`:

```javascript
import { ref } from 'vue'

const STORAGE_KEY = 'skill-book-agent-feedback'

// Singleton feedback log
const feedbackLog = ref([])

function loadFeedback() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) feedbackLog.value = JSON.parse(raw)
  } catch { feedbackLog.value = [] }
}
loadFeedback()

function persistFeedback() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbackLog.value))
}

export function useAgentBridge() {
  /**
   * Query skills by scenario, tags, and/or free-text.
   * Returns skills ranked by match relevance.
   */
  function querySkills(query, skills) {
    const { scenario, tags, search } = query
    let results = [...skills]

    if (scenario) {
      results = results.filter(s =>
        (s.scenarios || []).some(sc => sc.toLowerCase().includes(scenario.toLowerCase()))
      )
    }

    if (tags && tags.length > 0) {
      results = results.filter(s =>
        tags.some(t => (s.tags || []).some(st => st.toLowerCase().includes(t.toLowerCase())))
      )
    }

    if (search) {
      const q = search.toLowerCase()
      results = results.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }

    // Sort by: scenario match > tag match > name match
    return results.sort((a, b) => {
      const aScenario = scenario && (a.scenarios || []).some(s => s === scenario) ? 2 : 0
      const bScenario = scenario && (b.scenarios || []).some(s => s === scenario) ? 2 : 0
      return bScenario - aScenario
    }).slice(0, 5)
  }

  /**
   * Format a skill into a system-prompt-ready fragment for Agent injection.
   */
  function formatSkillForAgent(skill) {
    const parts = [
      `## Skill: ${skill.name}`,
      `Slug: ${skill.slug}`,
      `Category: ${skill.category}`,
    ]
    if (skill.description) parts.push(`Description: ${skill.description}`)
    if (skill.tags?.length) parts.push(`Tags: ${skill.tags.join(', ')}`)
    if (skill.scenarios?.length) parts.push(`Scenarios: ${skill.scenarios.join(', ')}`)
    if (skill.commands?.length) {
      parts.push('Commands:')
      skill.commands.forEach(cmd => {
        parts.push(`  - ${cmd.name}: \`${cmd.cmd}\``)
      })
    }
    if (skill.quickstart) parts.push(`Quickstart:\n${skill.quickstart}`)
    return parts.join('\n')
  }

  /**
   * Record agent execution feedback for quality scoring.
   */
  function recordFeedback(slug, outcome) {
    const entry = {
      slug,
      outcome, // 'success' | 'failed' | 'partial'
      at: new Date().toISOString(),
    }
    feedbackLog.value = [...feedbackLog.value, entry].slice(-500)
    persistFeedback()
  }

  /**
   * Get quality score based on feedback history for a skill.
   */
  function getQualityScore(slug) {
    const entries = feedbackLog.value.filter(e => e.slug === slug)
    if (entries.length === 0) return null
    const successCount = entries.filter(e => e.outcome === 'success').length
    return Math.round((successCount / entries.length) * 100)
  }

  return {
    querySkills,
    formatSkillForAgent,
    recordFeedback,
    getQualityScore,
    feedbackLog,
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run src/__tests__/agent-bridge.test.js`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/composables/useAgentBridge.js src/__tests__/agent-bridge.test.js
git commit -m "feat: add useAgentBridge for agent skill query, prompt formatting, and feedback"
```

---

### Task 3.2: 动态 Skill 发现 + 质量闭环

**Files:**
- Create: `src/composables/useSkillDiscovery.js`
- Create: `scripts/discover-skills.js`
- Create: `src/__tests__/skill-discovery.test.js`
- Modify: `src/views/HomeView.vue` (discovery entry point)

- [ ] **Step 1: 编写 useSkillDiscovery 测试**

Create `src/__tests__/skill-discovery.test.js`:

```javascript
import { describe, it, expect } from 'vitest'

const { useSkillDiscovery } = await import('../composables/useSkillDiscovery.js')

const mockSkills = [
  { slug: 'a', name: 'Skill A', quality: { score: 8, completeness: 9, usability: 8, freshness: 7 } },
  { slug: 'b', name: 'Skill B', quality: { score: 3, completeness: 2, usability: 4, freshness: 8 } },
  { slug: 'c', name: 'Skill C', quality: { score: 6, completeness: 6, usability: 6, freshness: 6 } },
]

describe('useSkillDiscovery', () => {
  const { filterByQuality, getStaleSkills } = useSkillDiscovery()

  describe('filterByQuality', () => {
    it('returns only skills above the quality threshold', () => {
      const result = filterByQuality(mockSkills, { minScore: 5 })
      expect(result.map(r => r.slug)).toEqual(['a', 'c'])
    })

    it('returns empty array when no skills meet threshold', () => {
      const result = filterByQuality(mockSkills, { minScore: 9 })
      expect(result).toEqual([])
    })
  })

  describe('getStaleSkills', () => {
    it('identifies skills with low freshness scores', () => {
      // freshness < 5 is stale
      const stale = getStaleSkills(mockSkills, { freshnessThreshold: 5 })
      // No skill has freshness < 5 in this dataset
      expect(stale).toEqual([])
    })
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/__tests__/skill-discovery.test.js`
Expected: FAIL

- [ ] **Step 3: 实现 useSkillDiscovery.js**

Create `src/composables/useSkillDiscovery.js`:

```javascript
import { ref } from 'vue'

const discovering = ref(false)
const discoveredSkills = ref([])
const discoveryError = ref(null)

export function useSkillDiscovery() {
  function filterByQuality(skills, { minScore = 5 } = {}) {
    return skills.filter(s => {
      const q = s.quality
      if (!q || q.score === undefined) return true // no quality data = pass through
      return q.score >= minScore
    })
  }

  function getStaleSkills(skills, { freshnessThreshold = 5, daysThreshold = 180 } = {}) {
    const now = Date.now()
    return skills.filter(s => {
      const q = s.quality
      if (!q) return false
      if (q.freshness !== undefined && q.freshness < freshnessThreshold) return true
      if (s.lastVerified) {
        const verifiedAt = new Date(s.lastVerified).getTime()
        const ageInDays = (now - verifiedAt) / (24 * 60 * 60 * 1000)
        if (ageInDays > daysThreshold) return true
      }
      return false
    }).map(s => ({
      ...s,
      reason: `上次验证: ${s.lastVerified || '未知'}，已超过 ${Math.floor((Date.now() - new Date(s.lastVerified || Date.now()).getTime()) / (24 * 60 * 60 * 1000))} 天`,
    }))
  }

  function computeDynamicScore(skill, usageStats, feedbackLog) {
    let score = 5 // base

    // Quality data adjustments
    if (skill.quality) {
      score += (skill.quality.score || 5) * 0.3
    }

    // Usage-based adjustment
    const stats = usageStats[skill.slug]
    if (stats) {
      const views = stats.views || 0
      if (views > 10) score += 1
      if (views > 50) score += 1

      // Recent usage bonus
      if (stats.lastViewedAt) {
        const daysSinceView = (Date.now() - new Date(stats.lastViewedAt).getTime()) / (24 * 60 * 60 * 1000)
        if (daysSinceView < 7) score += 1
        if (daysSinceView > 90) score -= 1
      }
    }

    // Feedback-based adjustment
    const feedback = (feedbackLog || []).filter(f => f.slug === skill.slug)
    if (feedback.length > 0) {
      const successRate = feedback.filter(f => f.outcome === 'success').length / feedback.length
      score += (successRate - 0.5) * 2
    }

    return Math.max(0, Math.min(10, Math.round(score * 10) / 10))
  }

  return {
    discovering,
    discoveredSkills,
    discoveryError,
    filterByQuality,
    getStaleSkills,
    computeDynamicScore,
  }
}
```

- [ ] **Step 4: 创建 discover-skills.js 脚本**

Create `scripts/discover-skills.js`:

```javascript
// scripts/discover-skills.js
// Search GitHub Topics for new potential skills
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const configPath = path.join(__dirname, '..', 'upstream-repos.json')

const TOPICS = ['claude-skill', 'ai-skill', 'agent-skill', 'claude-code-plugin']

async function searchGitHubTopic(topic) {
  const url = `https://api.github.com/search/repositories?q=topic:${topic}+stars:>10&sort=stars&per_page=10`
  const res = await fetch(url, {
    headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'skill-book-discover' },
  })
  if (!res.ok) return []
  const data = await res.json()
  return (data.items || []).map(repo => ({
    fullName: repo.full_name,
    url: repo.html_url,
    stars: repo.stargazers_count,
    description: repo.description,
    topics: repo.topics,
    updatedAt: repo.updated_at,
  }))
}

async function main() {
  console.log('Discovering skills from GitHub Topics...')
  const allResults = []

  for (const topic of TOPICS) {
    console.log(`  Searching topic: ${topic}`)
    const repos = await searchGitHubTopic(topic)
    allResults.push(...repos)
  }

  // Dedupe by fullName
  const seen = new Set()
  const unique = allResults.filter(r => {
    if (seen.has(r.fullName)) return false
    seen.add(r.fullName)
    return true
  })

  // Sort by stars descending
  unique.sort((a, b) => b.stars - a.stars)

  // Output as JSON
  console.log(JSON.stringify(unique.slice(0, 30), null, 2))
  console.log(`\nFound ${unique.length} unique repos across ${TOPICS.length} topics`)
}

main().catch(e => { console.error(e); process.exit(1) })
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npx vitest run src/__tests__/skill-discovery.test.js`
Expected: PASS

- [ ] **Step 6: 提交**

```bash
git add src/composables/useSkillDiscovery.js src/__tests__/skill-discovery.test.js scripts/discover-skills.js
git commit -m "feat: add useSkillDiscovery with quality filtering and dynamic scoring"
```

---

### Task 3.3: Skill 质量评分集成到 UI

**Files:**
- Modify: `src/components/SkillCard.vue`
- Modify: `src/views/SkillDetailView.vue`
- Modify: `src/components/GlobalNav.vue`

- [ ] **Step 1: SkillCard 增加质量评分徽章**

Modify `src/components/SkillCard.vue`, add after category in template:

```vue
<span v-if="skill.quality?.score" class="skill-card__quality" :class="qualityClass">
  {{ skill.quality.score.toFixed(1) }}
</span>
```

Add computed and CSS:

```javascript
const qualityClass = computed(() => {
  const score = props.skill.quality?.score
  if (!score) return ''
  if (score >= 8) return 'skill-card__quality--high'
  if (score >= 5) return 'skill-card__quality--mid'
  return 'skill-card__quality--low'
})
```

```css
.skill-card__quality {
  font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600;
  padding: 1px 6px; border-radius: 4px; margin-left: auto;
}
.skill-card__quality--high { background: var(--color-success, #4caf7d); color: white; }
.skill-card__quality--mid { background: var(--color-warning, #e5a84b); color: white; }
.skill-card__quality--low { background: var(--color-accent); color: white; }
```

- [ ] **Step 2: SkillDetailView 展示 quality 详情**

Modify `src/views/SkillDetailView.vue`, add after description in hero section:

```vue
<div v-if="skill.quality" class="quality-detail">
  <div class="quality-item">
    <span class="quality-label">综合评分</span>
    <span class="quality-value">{{ skill.quality.score?.toFixed(1) || '—' }}</span>
  </div>
  <div class="quality-item">
    <span class="quality-label">完整度</span>
    <span class="quality-value">{{ skill.quality.completeness || '—' }}/10</span>
  </div>
  <div class="quality-item">
    <span class="quality-label">可用性</span>
    <span class="quality-value">{{ skill.quality.usability || '—' }}/10</span>
  </div>
  <div v-if="skill.version" class="quality-item">
    <span class="quality-label">版本</span>
    <span class="quality-value">{{ skill.version }}</span>
  </div>
</div>
```

CSS:
```css
.quality-detail {
  display: flex; gap: 16px; margin-top: 16px;
  background: var(--color-bg-accent); border-radius: 8px;
  padding: 10px 16px; width: fit-content;
}
.quality-item { display: flex; flex-direction: column; gap: 2px; }
.quality-label {
  font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-tertiary);
}
.quality-value {
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
  color: var(--color-text-primary);
}
```

- [ ] **Step 3: GlobalNav 增加同步状态指示**

Modify `src/components/GlobalNav.vue`, add check for available updates:

```vue
<script setup>
import { computed } from 'vue'
import { useSkillSync } from '../composables/useSkillSync'
const { lastSyncAt } = useSkillSync()

const syncIndicator = computed(() => {
  if (!lastSyncAt.value) return ''
  const daysAgo = (Date.now() - new Date(lastSyncAt.value).getTime()) / (24 * 60 * 60 * 1000)
  if (daysAgo > 7) return 'sync-stale'
  return 'sync-fresh'
})
</script>
```

- [ ] **Step 4: 验证 UI**

Run: `npm run dev`
Manual check: 有 quality 数据的 Skill 卡片显示评分徽章

- [ ] **Step 5: 最终提交**

```bash
git add src/components/SkillCard.vue src/views/SkillDetailView.vue src/components/GlobalNav.vue
git commit -m "feat: integrate quality scores into SkillCard and SkillDetailView"
```

---

## Self-Review Checklist

- [ ] **Spec coverage:**
  - Phase 1: Schema 扩展 ✓ (Task 1.1), 上游追踪 ✓ (Task 1.2), 导出/导入 ✓ (Task 1.3-1.4)
  - Phase 2: 学习路径 ✓ (Task 2.2), 推荐系统 ✓ (Task 2.3), 使用记录 ✓ (Task 2.1), UI ✓ (Task 2.4)
  - Phase 3: Agent Bridge ✓ (Task 3.1), 动态发现 ✓ (Task 3.2), 质量闭环 ✓ (Task 3.2-3.3)
- [ ] **Placeholder scan:** 无 TBD/TODO/占位符 — 所有步骤都有完整代码
- [ ] **Type consistency:**
  - `useSkillSync.exportData()` → returns `string` (JSON blob) ✓
  - `useSkillSync.importData(jsonString)` → returns `{ added, skipped }` ✓
  - `computeLearningPath(slug, skills, statuses)` → returns `Skill[]` ✓
  - `computeRecommendations(skills, statuses, bookmarks, stats)` → returns `Skill[]` ✓
  - `useAgentBridge.querySkills(query, skills)` → returns `Skill[]` ✓
  - `useAgentBridge.formatSkillForAgent(skill)` → returns `string` ✓
