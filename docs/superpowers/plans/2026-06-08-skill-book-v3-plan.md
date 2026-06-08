# Skill Book V3 — Per-Skill GitHub Update + Leaderboard

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace bulk-sync with per-skill GitHub-based intelligent update, and add a skill leaderboard page sourced from skills.sh.

**Architecture:** Two independent subsystems. Feature 1 (Update): user clicks "check update" on a skill detail page → fetches repo README via GitHub API → DeepSeek analyzes changes → shows diff → user confirms merge. Feature 2 (Leaderboard): new `/leaderboard` route → dev API proxies `npx skills find` searches → parsed and cached → rendered as ranked table. Cleanup removes all bulk-sync artifacts from V2.

**Tech Stack:** Vue 3.5 + Vite 6 + TailwindCSS 4 + Vitest + DeepSeek API (existing) + GitHub API

**Data Source:** `npx skills find <query>` provides structured output: `owner/repo@skill`, install count, skills.sh URL

---

## File Structure Map

```
New files:
  src/composables/useSkillUpdate.js        — Per-skill GitHub README fetch + DeepSeek analysis
  src/composables/useLeaderboard.js        — Leaderboard data fetching, caching, ranking
  src/views/LeaderboardView.vue            — Leaderboard page UI
  src/__tests__/skill-update.test.js       — useSkillUpdate tests
  src/__tests__/leaderboard.test.js        — useLeaderboard tests

Modified files:
  scripts/vite-plugin-skill-api.js         — Remove /sync, /sync/check; add /leaderboard endpoint
  src/composables/useSkillSync.js          — Remove checkUpstreamUpdates(), pullFromUpstream()
  src/components/SyncPanel.vue             — Remove "上游更新" tab
  src/views/SkillDetailView.vue            — Add "检查更新" button + update diff UI
  src/router/index.js                      — Add /leaderboard route
  src/components/GlobalNav.vue             — Add leaderboard nav link

Deleted files:
  scripts/sync-upstream.js                 — Bulk sync (replaced by per-skill update)
  upstream-repos.json                      — Bulk config (no longer needed)
  .sync-state.json                         — Bulk sync state
```

---

## Phase 0: Cleanup — Remove Bulk Sync Artifacts

### Task 0.1: 删除批量同步相关文件

**Files:**
- Delete: `scripts/sync-upstream.js`
- Delete: `upstream-repos.json`
- Delete: `.sync-state.json`

- [ ] **Step 1: 删除文件**

```bash
rm scripts/sync-upstream.js
rm upstream-repos.json
rm -f .sync-state.json
```

- [ ] **Step 2: 提交**

```bash
git add -u scripts/sync-upstream.js upstream-repos.json .sync-state.json
git commit -m "chore: remove bulk sync artifacts (scripts/sync-upstream.js, upstream-repos.json, .sync-state.json)"
```

---

### Task 0.2: 清理 vite-plugin-skill-api.js 中的 sync 端点

**Files:**
- Modify: `scripts/vite-plugin-skill-api.js`

- [ ] **Step 1: 删除 /sync 和 /sync/check 两个端点**

Read `scripts/vite-plugin-skill-api.js`, remove the two sync endpoint blocks:

Remove the entire block from `// POST /api/skills/sync — trigger upstream sync` through the `return` before the `/sync/check` comment, AND the entire `// POST /api/skills/sync/check` block through its `return`.

In the file, these two blocks start at approximately line 137 and line 165. Remove everything from the comment `// POST /api/skills/sync — trigger upstream sync` through the `}` closing the `/sync/check` block (just before `next()`).

The remaining code should have `next()` directly after the DELETE handler's closing `}`.

- [ ] **Step 2: 验证文件语法**

Run: `node -c scripts/vite-plugin-skill-api.js`
Expected: no output (syntax OK)

- [ ] **Step 3: 提交**

```bash
git add scripts/vite-plugin-skill-api.js
git commit -m "chore: remove /api/skills/sync and /sync/check endpoints from dev API"
```

---

### Task 0.3: 简化 useSkillSync.js

**Files:**
- Modify: `src/composables/useSkillSync.js`

- [ ] **Step 1: 移除 checkUpstreamUpdates() 和 pullFromUpstream() 方法**

Read `src/composables/useSkillSync.js`. Remove the entire `// ── V2: 上游远程同步 ──` section (the `checkUpstreamUpdates` and `pullFromUpstream` async functions), and remove them from the return object.

The return object should become:
```javascript
  return {
    syncing,
    lastSyncAt,
    syncError,
    exportData,
    importData,
  }
```

- [ ] **Step 2: 运行测试确认无回归**

Run: `npx vitest run src/__tests__/skill-sync.test.js`
Expected: 4 tests PASS

- [ ] **Step 3: 提交**

```bash
git add src/composables/useSkillSync.js
git commit -m "chore: remove checkUpstreamUpdates and pullFromUpstream from useSkillSync"
```

---

### Task 0.4: 简化 SyncPanel.vue — 移除"上游更新" tab

**Files:**
- Modify: `src/components/SyncPanel.vue`

- [ ] **Step 1: 移除上游更新 tab 和相关逻辑**

Read `src/components/SyncPanel.vue`. Make these changes:

**Script section:** Remove `checkUpstreamUpdates` and `pullFromUpstream` from the destructured `useSkillSync()` call. Remove all variables under `// ── 上游同步状态 ──` comment (`upstreamStatus`, `upstreamResult`, `checkingUpstream`, `pullingUpstream`). Remove `handleCheckUpstream` and `handlePullUpstream` functions. Remove the `ref` for `activeTab` change — keep `activeTab` defaulting to `'export'`.

**Template section:** Remove the "上游更新" tab button from the tab bar. Remove the entire `<!-- ── Tab: 上游更新 ── -->` div block.

The tabs should be:
```html
<div class="sync-panel__tabs">
  <button :class="['sync-tab', activeTab === 'export' && 'sync-tab--active']" @click="activeTab = 'export'">导出</button>
  <button :class="['sync-tab', activeTab === 'import' && 'sync-tab--active']" @click="activeTab = 'import'">导入</button>
</div>
```

**Style section:** Remove `.upstream-log` and `.upstream-log pre` CSS rules.

- [ ] **Step 2: 生产构建验证**

Run: `npm run build`
Expected: Build succeeds, no errors

- [ ] **Step 3: 提交**

```bash
git add src/components/SyncPanel.vue
git commit -m "chore: remove upstream update tab from SyncPanel"
```

---

## Phase 1: Per-Skill GitHub Intelligent Update

### Task 1.1: useSkillUpdate composable + TDD

**Files:**
- Create: `src/composables/useSkillUpdate.js`
- Create: `src/__tests__/skill-update.test.js`

- [ ] **Step 1: 编写失败测试**

Create `src/__tests__/skill-update.test.js`:

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const store = {}
vi.stubGlobal('localStorage', {
  getItem: vi.fn(key => store[key] || null),
  setItem: vi.fn((key, val) => { store[key] = val }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
})

const { useSkillUpdate } = await import('../composables/useSkillUpdate.js')

describe('useSkillUpdate', () => {
  let updater

  beforeEach(() => {
    vi.clearAllMocks()
    updater = useSkillUpdate()
  })

  describe('parseGithubUrl', () => {
    it('extracts owner and repo from GitHub URL', () => {
      const result = updater.parseGithubUrl('https://github.com/anthropics/skills')
      expect(result).toEqual({ owner: 'anthropics', repo: 'skills' })
    })

    it('returns null for invalid URLs', () => {
      expect(updater.parseGithubUrl('https://example.com/foo')).toBeNull()
      expect(updater.parseGithubUrl('not-a-url')).toBeNull()
    })
  })

  describe('fetchReadme', () => {
    it('fetches README content from GitHub raw API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('# Test README\nSome content'),
      })
      const content = await updater.fetchReadme('anthropics', 'skills')
      expect(content).toBe('# Test README\nSome content')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/anthropics/skills/main/README.md',
        expect.any(Object)
      )
    })

    it('returns null on fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false })
      const content = await updater.fetchReadme('bad', 'repo')
      expect(content).toBeNull()
    })
  })

  describe('getLatestCommit', () => {
    it('fetches latest commit SHA from GitHub API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ sha: 'abc123def' }]),
      })
      const commit = await updater.getLatestCommit('anthropics', 'skills')
      expect(commit).toEqual({ sha: 'abc123def' })
    })
  })
})
```

- [ ] **Step 2: 运行测试确认 RED**

Run: `npx vitest run src/__tests__/skill-update.test.js`
Expected: FAIL — module not found

- [ ] **Step 3: 实现 useSkillUpdate.js**

Create `src/composables/useSkillUpdate.js`:

```javascript
import { ref } from 'vue'

const STORAGE_KEY_API = 'skill-book-deepseek-api-key'

function getStoredApiKey() {
  return localStorage.getItem(STORAGE_KEY_API) || ''
}

export function useSkillUpdate() {
  const updating = ref(false)
  const updateError = ref(null)
  const updateDiff = ref(null)
  const apiKey = ref(getStoredApiKey())

  function parseGithubUrl(url) {
    if (!url) return null
    const trimmed = url.trim().replace(/\/+$/, '')
    const match = trimmed.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) return null
    return { owner: match[1], repo: match[2] }
  }

  async function fetchReadme(owner, repo, branch = 'main') {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'skill-book-update' } })
      if (!res.ok) return null
      return await res.text()
    } catch {
      return null
    }
  }

  async function getLatestCommit(owner, repo, branch = 'main') {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1&sha=${branch}`
    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'skill-book-update' },
      })
      if (!res.ok) return null
      const data = await res.json()
      if (!data.length) return null
      return { sha: data[0].sha, date: data[0].commit.committer.date }
    } catch {
      return null
    }
  }

  async function analyzeWithAI(readme, skillName, repo) {
    const key = apiKey.value
    if (!key) throw new Error('请先配置 DeepSeek API Key')

    const prompt = `你是一个技能文档更新分析专家。以下是技能"${skillName}"对应 GitHub 仓库(${repo})的最新 README 内容。

请提取以下信息并用中文总结：
1. 这个 Skill 的核心功能和使用场景
2. 安装命令（如有）
3. 常用命令和使用方法
4. 关键配置项
5. 最新变更/更新内容

请以 Markdown 格式输出一个完整的"如何使用本 Skill"章节，结构如下：

## 如何使用本 Skill

### 适用场景
（列出 2-3 个典型使用场景）

### 安装
\`\`\`bash
（安装命令）
\`\`\`

### 基本用法
（最核心的使用步骤和命令）

### 常用命令
（如有 CLI 命令，列出主要命令和说明）

### 注意事项
（使用时需要注意的要点）

README 内容：
---
${readme.slice(0, 10000)}`

    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-pro',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
        max_tokens: 4096,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`DeepSeek API 请求失败: ${err.error?.message || `HTTP ${res.status}`}`)
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content || ''
  }

  async function checkForUpdate(skill) {
    updating.value = true
    updateError.value = null
    updateDiff.value = null

    try {
      const source = skill.source
      if (!source) throw new Error('该 Skill 未配置 source（GitHub 地址），无法自动更新')

      const parsed = parseGithubUrl(source)
      if (!parsed) throw new Error(`无法解析 GitHub 地址: ${source}`)

      const { owner, repo } = parsed

      // Get latest commit
      const commit = await getLatestCommit(owner, repo)
      if (!commit) throw new Error(`无法获取仓库 ${owner}/${repo} 的更新信息`)

      // Check if already up to date
      if (skill.sourceSha === commit.sha) {
        updating.value = false
        return { upToDate: true, sha: commit.sha, date: commit.date }
      }

      // Fetch README
      const readme = await fetchReadme(owner, repo)
      if (!readme) throw new Error(`无法获取 ${owner}/${repo} 的 README`)

      // Analyze with AI
      const aiSummary = await analyzeWithAI(readme, skill.name, repo)

      updateDiff.value = {
        sha: commit.sha,
        date: commit.date,
        source,
        aiSummary,
        currentContent: skill.content || '',
      }

      return {
        upToDate: false,
        sha: commit.sha,
        date: commit.date,
        diff: updateDiff.value,
      }
    } catch (e) {
      updateError.value = e.message
      throw e
    } finally {
      updating.value = false
    }
  }

  function clearDiff() {
    updateDiff.value = null
    updateError.value = null
  }

  return {
    updating,
    updateError,
    updateDiff,
    apiKey,
    parseGithubUrl,
    fetchReadme,
    getLatestCommit,
    analyzeWithAI,
    checkForUpdate,
    clearDiff,
  }
}
```

- [ ] **Step 4: 运行测试确认 GREEN**

Run: `npx vitest run src/__tests__/skill-update.test.js`
Expected: PASS (parseGithubUrl + fetchReadme + getLatestCommit tests pass)

- [ ] **Step 5: 提交**

```bash
git add src/composables/useSkillUpdate.js src/__tests__/skill-update.test.js
git commit -m "feat: add useSkillUpdate for per-skill GitHub README fetch and DeepSeek analysis"
```

---

### Task 1.2: SkillDetailView — "检查更新"按钮 + Diff UI

**Files:**
- Modify: `src/views/SkillDetailView.vue`

- [ ] **Step 1: 添加 import 和 composable 调用**

Add to `<script setup>` imports in `src/views/SkillDetailView.vue`:

```javascript
import { useSkillUpdate } from '../composables/useSkillUpdate'
```

Add composable call alongside existing ones:

```javascript
const { updating, updateError, updateDiff, checkForUpdate, clearDiff } = useSkillUpdate()
```

Add state variables:

```javascript
const showUpdateDiff = ref(false)
const updateResult = ref(null)
```

- [ ] **Step 2: 添加"检查更新"按钮**

In the Hero Section action buttons area (near the "编辑" and "删除" buttons), add after the edit button:

```html
<button
  v-if="skill.source"
  @click="handleCheckUpdate"
  :disabled="updating"
  class="action-btn action-btn--update"
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
  {{ updating ? '检查中...' : '检查更新' }}
</button>
```

Add `handleCheckUpdate` function:

```javascript
async function handleCheckUpdate() {
  updateResult.value = null
  try {
    const result = await checkForUpdate(skill.value)
    if (result.upToDate) {
      updateResult.value = { type: 'info', message: '已是最新版本' }
    } else {
      showUpdateDiff.value = true
    }
  } catch (e) {
    updateResult.value = { type: 'error', message: e.message }
  }
}
```

- [ ] **Step 3: 添加 Update Diff 展示区域**

After the "我的笔记" section, add:

```html
<!-- Update Diff Modal -->
<div v-if="showUpdateDiff && updateDiff" class="update-diff-overlay" @click.self="showUpdateDiff = false">
  <div class="update-diff-box">
    <div class="update-diff-header">
      <h3>发现更新</h3>
      <button @click="showUpdateDiff = false; clearDiff()">&times;</button>
    </div>
    <p class="update-diff-meta">
      仓库: {{ updateDiff.source }}<br/>
      最新提交: {{ updateDiff.sha.slice(0, 7) }} ({{ new Date(updateDiff.date).toLocaleString('zh-CN') }})
    </p>
    <div class="update-diff-content">
      <MarkdownRenderer :source="updateDiff.aiSummary" />
    </div>
    <div class="update-diff-actions">
      <button class="btn btn-ghost" @click="showUpdateDiff = false; clearDiff()">关闭</button>
    </div>
  </div>
</div>
```

- [ ] **Step 4: 添加 CSS**

Add to `<style scoped>`:

```css
.action-btn--update {
  color: var(--color-info, #5b8dd9);
  border-color: var(--color-info, #5b8dd9);
}
.action-btn--update:hover {
  background: rgba(91, 141, 217, 0.08);
}

.update-diff-overlay {
  position: fixed; inset: 0; z-index: var(--z-modal, 1000);
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
}
.update-diff-box {
  background: var(--color-bg-elevated); border-radius: 14px;
  padding: 24px 28px; max-width: 640px; width: 90%; max-height: 80vh;
  overflow-y: auto; box-shadow: var(--shadow-xl);
}
.update-diff-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
}
.update-diff-header h3 {
  font-family: 'Crimson Pro', serif; font-size: 20px; font-weight: 600;
  color: var(--color-text-primary); margin: 0;
}
.update-diff-header button {
  background: none; border: none; font-size: 24px;
  color: var(--color-text-tertiary); cursor: pointer;
}
.update-diff-meta {
  font-family: 'DM Sans', sans-serif; font-size: 12px;
  color: var(--color-text-secondary); margin: 0 0 16px; line-height: 1.6;
}
.update-diff-content {
  background: var(--color-bg-recessed); border-radius: 8px;
  padding: 16px 20px; margin-bottom: 16px;
}
.update-diff-actions { display: flex; gap: 8px; justify-content: flex-end; }
```

- [ ] **Step 5: 构建验证**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 6: 提交**

```bash
git add src/views/SkillDetailView.vue
git commit -m "feat: add check-for-update button and AI-generated diff modal to SkillDetailView"
```

---

## Phase 2: Skill Leaderboard

### Task 2.1: Leaderboard API endpoint (dev only)

**Files:**
- Modify: `scripts/vite-plugin-skill-api.js`

- [ ] **Step 1: 添加 /api/leaderboard 端点**

在 `scripts/vite-plugin-skill-api.js` 中，在 DELETE handler 之后、`next()` 之前，添加：

```javascript
// GET /api/leaderboard — proxy npx skills find for popular queries
if (req.method === 'GET' && pathname === '/leaderboard') {
  try {
    res.setHeader('Content-Type', 'application/json')
    const { execSync } = await import('child_process')

    const queries = ['react', 'next', 'design', 'testing', 'python', 'cli', 'deploy']
    const allSkills = new Map()

    for (const q of queries) {
      try {
        const stdout = execSync(`npx skills find "${q}"`, {
          encoding: 'utf-8',
          timeout: 20000,
          env: { ...process.env, CI: 'true' },
        })
        // Parse: owner/repo@skill  installs  \n  URL
        const lines = stdout.split('\n')
        for (const line of lines) {
          const match = line.match(/^(.+?@.+?)\s+([\d.]+[KMB]?)\s+installs/)
          if (match) {
            const name = match[1]
            const installs = match[2]
            const urlMatch = line.match(/https:\/\/skills\.sh\/[^\s]+/)
            const url = urlMatch ? urlMatch[0] : ''
            if (!allSkills.has(name)) {
              allSkills.set(name, { name, installs, url })
            }
          }
        }
      } catch {}
    }

    const skills = [...allSkills.values()]
    // Sort by install count (parse K/M/B suffixes)
    skills.sort((a, b) => {
      const parseVal = (v) => {
        if (!v) return 0
        const num = parseFloat(v)
        if (v.endsWith('B')) return num * 1e9
        if (v.endsWith('M')) return num * 1e6
        if (v.endsWith('K')) return num * 1e3
        return num
      }
      return parseVal(b.installs) - parseVal(a.installs)
    })

    res.end(JSON.stringify({ skills: skills.slice(0, 50), updatedAt: new Date().toISOString() }))
  } catch (e) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: e.message }))
  }
  return
}
```

- [ ] **Step 2: 测试端点**

Run: `curl -s http://localhost:5175/api/skills/leaderboard | head -100`
(Need dev server running)
Expected: JSON with `skills` array and `updatedAt` timestamp

- [ ] **Step 3: 提交**

```bash
git add scripts/vite-plugin-skill-api.js
git commit -m "feat: add /api/skills/leaderboard endpoint using npx skills find"
```

---

### Task 2.2: useLeaderboard composable + TDD

**Files:**
- Create: `src/composables/useLeaderboard.js`
- Create: `src/__tests__/leaderboard.test.js`

- [ ] **Step 1: 编写测试**

Create `src/__tests__/leaderboard.test.js`:

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'

const store = {}
vi.stubGlobal('localStorage', {
  getItem: vi.fn(key => store[key] || null),
  setItem: vi.fn((key, val) => { store[key] = val }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
})

const { useLeaderboard, parseInstalls } = await import('../composables/useLeaderboard.js')

describe('parseInstalls', () => {
  it('parses K suffix', () => expect(parseInstalls('458.9K')).toBe(458900))
  it('parses M suffix', () => expect(parseInstalls('1.2M')).toBe(1200000))
  it('parses plain number', () => expect(parseInstalls('500')).toBe(500))
  it('returns 0 for empty', () => expect(parseInstalls(null)).toBe(0))
})

describe('useLeaderboard', () => {
  let lb

  beforeEach(() => {
    vi.clearAllMocks()
    lb = useLeaderboard()
  })

  it('initializes with empty skills array', () => {
    expect(lb.skills.value).toEqual([])
    expect(lb.loading.value).toBe(false)
  })

  it('has a fetchLeaderboard method', () => {
    expect(typeof lb.fetchLeaderboard).toBe('function')
  })
})
```

- [ ] **Step 2: 运行测试确认 RED**

Run: `npx vitest run src/__tests__/leaderboard.test.js`
Expected: FAIL

- [ ] **Step 3: 实现 useLeaderboard.js**

Create `src/composables/useLeaderboard.js`:

```javascript
import { ref, computed } from 'vue'

const CACHE_KEY = 'skill-book-leaderboard-cache'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export function parseInstalls(val) {
  if (!val || typeof val !== 'string') return 0
  const num = parseFloat(val)
  if (isNaN(num)) return 0
  if (val.endsWith('B')) return num * 1e9
  if (val.endsWith('M')) return num * 1e6
  if (val.endsWith('K')) return num * 1e3
  return num
}

// Singleton state
const skills = ref([])
const loading = ref(false)
const error = ref(null)
const lastUpdated = ref(null)

export function useLeaderboard() {
  function loadFromCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (!raw) return false
      const cached = JSON.parse(raw)
      if (Date.now() - cached.timestamp > CACHE_TTL) return false
      skills.value = cached.skills || []
      lastUpdated.value = cached.timestamp
      return true
    } catch { return false }
  }

  function saveToCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        skills: data,
        timestamp: Date.now(),
      }))
    } catch {}
  }

  async function fetchLeaderboard() {
    // Return cached data if fresh
    if (loadFromCache()) return

    loading.value = true
    error.value = null

    try {
      const res = await fetch('/api/skills/leaderboard')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      skills.value = data.skills || []
      lastUpdated.value = data.updatedAt || new Date().toISOString()
      saveToCache(data.skills || [])
    } catch (e) {
      error.value = e.message
      // Try stale cache on error
      try {
        const raw = localStorage.getItem(CACHE_KEY)
        if (raw) {
          const cached = JSON.parse(raw)
          skills.value = cached.skills || []
          lastUpdated.value = cached.timestamp
        }
      } catch {}
    } finally {
      loading.value = false
    }
  }

  const hotSkills = computed(() => {
    return [...skills.value]
      .sort((a, b) => parseInstalls(b.installs) - parseInstalls(a.installs))
      .slice(0, 20)
  })

  return {
    skills,
    hotSkills,
    loading,
    error,
    lastUpdated,
    fetchLeaderboard,
    parseInstalls,
  }
}
```

- [ ] **Step 4: 运行测试确认 GREEN**

Run: `npx vitest run src/__tests__/leaderboard.test.js`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/composables/useLeaderboard.js src/__tests__/leaderboard.test.js
git commit -m "feat: add useLeaderboard composable with caching and ranking"
```

---

### Task 2.3: LeaderboardView 页面 + 路由

**Files:**
- Create: `src/views/LeaderboardView.vue`
- Modify: `src/router/index.js`
- Modify: `src/components/GlobalNav.vue`

- [ ] **Step 1: 创建 LeaderboardView.vue**

Create `src/views/LeaderboardView.vue`:

```vue
<script setup>
import { onMounted } from 'vue'
import { useLeaderboard, parseInstalls } from '../composables/useLeaderboard'
import SubNav from '../components/SubNav.vue'

const { hotSkills, loading, error, lastUpdated, fetchLeaderboard } = useLeaderboard()

onMounted(fetchLeaderboard)

function formatInstalls(val) {
  const n = parseInstalls(val)
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toString()
}
</script>

<template>
  <div>
    <SubNav />
    <div class="lb-page">
      <header class="lb-header">
        <h1 class="lb-title">Skill 排行榜</h1>
        <p class="lb-subtitle">来自 skills.sh 的实时数据 · 按安装量排序</p>
        <div class="lb-rule"></div>
        <p v-if="lastUpdated" class="lb-updated">
          更新于 {{ new Date(lastUpdated).toLocaleString('zh-CN') }}
          <span class="lb-cache-hint">（每 30 分钟刷新）</span>
        </p>
      </header>

      <div v-if="loading" class="lb-loading">加载中...</div>
      <div v-else-if="error" class="lb-error">
        <p>加载排行榜失败: {{ error }}</p>
        <p class="lb-error-hint">排行榜功能需要开发服务器支持。生产环境请访问 <a href="https://skills.sh" target="_blank">skills.sh</a></p>
      </div>
      <div v-else class="lb-table-wrap">
        <table class="lb-table">
          <thead>
            <tr>
              <th class="lb-col-rank">#</th>
              <th class="lb-col-name">Skill</th>
              <th class="lb-col-installs">安装量</th>
              <th class="lb-col-link">来源</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(skill, i) in hotSkills" :key="skill.name" class="lb-row">
              <td class="lb-col-rank">
                <span v-if="i < 3" class="lb-rank-badge" :class="`lb-rank--${i + 1}`">{{ i + 1 }}</span>
                <span v-else class="lb-rank-num">{{ i + 1 }}</span>
              </td>
              <td class="lb-col-name">
                <span class="lb-skill-name">{{ skill.name }}</span>
              </td>
              <td class="lb-col-installs">{{ formatInstalls(skill.installs) }}</td>
              <td class="lb-col-link">
                <a v-if="skill.url" :href="skill.url" target="_blank" class="lb-ext-link">查看 →</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lb-page {
  max-width: 800px; margin: 0 auto; padding: 0 22px 80px;
}
.lb-header { padding-top: 40px; }
.lb-title {
  font-family: 'Crimson Pro', serif; font-size: 40px; font-weight: 600;
  color: var(--color-text-primary); line-height: 1.1; letter-spacing: -0.02em; margin: 0;
}
.lb-subtitle {
  font-family: 'DM Sans', sans-serif; font-size: 15px;
  color: var(--color-text-secondary); margin: 6px 0 0;
}
.lb-rule {
  width: 60px; height: 2px; background: var(--color-accent); margin-top: 16px;
}
.lb-updated {
  font-family: 'DM Sans', sans-serif; font-size: 12px;
  color: var(--color-text-tertiary); margin-top: 12px;
}
.lb-cache-hint { color: var(--color-text-tertiary); font-style: italic; }
.lb-loading, .lb-error { padding: 40px 0; text-align: center; }
.lb-error p { font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--color-text-secondary); }
.lb-error-hint { font-size: 12px !important; color: var(--color-text-tertiary) !important; margin-top: 8px; }
.lb-table-wrap { margin-top: 32px; }
.lb-table { width: 100%; border-collapse: collapse; }
.lb-table th {
  font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--color-text-tertiary); text-align: left;
  padding: 0 0 12px; border-bottom: 1px solid var(--color-border);
}
.lb-col-rank { width: 40px; }
.lb-col-installs { width: 100px; }
.lb-col-link { width: 80px; text-align: right; }
.lb-row td {
  padding: 14px 0; border-bottom: 1px solid var(--color-border);
}
.lb-row:hover { background: var(--color-bg-accent); }
.lb-rank-badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border-radius: 50%;
  font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700;
  color: white;
}
.lb-rank--1 { background: #f5a623; }
.lb-rank--2 { background: #9b9b9b; }
.lb-rank--3 { background: #cd7f32; }
.lb-rank-num {
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  color: var(--color-text-tertiary);
}
.lb-skill-name {
  font-family: 'DM Mono', Menlo, monospace; font-size: 13px;
  color: var(--color-text-primary); word-break: break-all;
}
.lb-ext-link {
  font-family: 'DM Sans', sans-serif; font-size: 12px;
  color: var(--color-accent); text-decoration: none;
}
.lb-ext-link:hover { text-decoration: underline; }
</style>
```

- [ ] **Step 2: 添加路由**

Modify `src/router/index.js`, add to routes array:

```javascript
{
  path: '/leaderboard',
  name: 'leaderboard',
  component: () => import('../views/LeaderboardView.vue'),
},
```

- [ ] **Step 3: GlobalNav 添加导航链接**

Modify `src/components/GlobalNav.vue`, add a nav link:

```html
<router-link to="/leaderboard" class="nav-link">排行榜</router-link>
```

Add to `<style scoped>`:
```css
.nav-link {
  font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500;
  letter-spacing: 0.1em; color: var(--color-text-inverse); opacity: 0.5;
  text-decoration: none; margin-left: 16px; transition: opacity 0.2s;
}
.nav-link:hover, .nav-link.router-link-active { opacity: 1; }
```

- [ ] **Step 4: 全量测试 + 构建**

Run: `npx vitest run`
Expected: all tests pass

Run: `npm run build`
Expected: build succeeds

- [ ] **Step 5: 提交**

```bash
git add src/views/LeaderboardView.vue src/router/index.js src/components/GlobalNav.vue
git commit -m "feat: add leaderboard page with skills.sh ranking data"
```

---

## Self-Review

- [x] **Spec coverage:**
  - Phase 0: 删除 bulk sync 文件 ✓ (Task 0.1), 清理 API 端点 ✓ (Task 0.2), 简化 useSkillSync ✓ (Task 0.3), 简化 SyncPanel ✓ (Task 0.4)
  - Feature 1: useSkillUpdate composable ✓ (Task 1.1), SkillDetailView 更新按钮 + Diff ✓ (Task 1.2)
  - Feature 2: Leaderboard API ✓ (Task 2.1), useLeaderboard composable ✓ (Task 2.2), LeaderboardView 页面 ✓ (Task 2.3)
- [x] **Placeholder scan:** 无 TBD/TODO/占位符
- [x] **Type consistency:**
  - `parseGithubUrl(url)` → `{owner, repo} | null` ✓ (used in Task 1.1, 1.2)
  - `fetchReadme(owner, repo, branch?)` → `string | null` ✓
  - `checkForUpdate(skill)` → `{upToDate, sha, date, diff?}` ✓
  - `parseInstalls(val)` → `number` ✓ (used in Task 2.2, 2.3)
  - `fetchLeaderboard()` → void (populates skills ref) ✓
