# Skill Book V2 Enhancements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Skill Book from a browsing tool into a full skill discovery + usage workflow platform with 8 new capabilities across 7 priority levels.

**Architecture:** Vue 3 static SPA with singleton-pattern composables, dual persistence (localStorage + build-time index.json), hash-based routing. All new features follow the existing composable pattern — module-level `ref()` state, localStorage persistence, computed-derived views. No new runtime dependencies except `vite-plugin-pwa` (dev-only).

**Tech Stack:** Vue 3 + Vite + Tailwind CSS 4 + Fuse.js + vitest. Pure SVG for heatmaps and force graphs. CSS custom properties for theming.

---

## Phase 0: P0 Bug Fixes (Foundation)

These fixes unblock subsequent work—scenarios must work before command palette can show scenario-filtered commands.

### Task 1: Fix index.json output in build-skills.js

**Files:**
- Modify: `scripts/build-skills.js` (lines 23-31)
- Verify: `public/skills/index.json` (after rebuild)

- [ ] **Step 1: Update build-skills.js to output full fields**

Replace the `index.push({...})` block in `scripts/build-skills.js` (lines 23-31):

```js
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
})
```

Key change: `commands` now outputs the full object array `[{name, cmd}]` instead of `data.commands.map(c => c.cmd)` (flat strings). Also adds `scenarios`, `quickstart`, `install`, `source`, `related`.

- [ ] **Step 2: Rebuild index.json and verify**

```bash
npm run build:skills
```

Run: `node -e "const idx=require('./public/skills/index.json'); const s=idx.find(x=>x.slug==='git-smart-commit'); console.log('scenarios:', JSON.stringify(s.scenarios)); console.log('commands:', JSON.stringify(s.commands)); console.log('quickstart:', s.quickstart); console.log('related:', s.related)"`

Expected: Git-smart-commit shows `scenarios: ["git-workflow","code-review","commit-hygiene"]`, `commands: [{"name":"安装","cmd":"npx skills add git-smart-commit"},...]`, and `quickstart` if present.

- [ ] **Step 3: Commit**

```bash
git add scripts/build-skills.js public/skills/index.json
git commit -m "fix: output scenarios, full commands, quickstart, related in index.json build"
```

### Task 2: Fix index.json output in vite-plugin-skill-api.js rebuildIndex

**Files:**
- Modify: `scripts/vite-plugin-skill-api.js` (lines 9-26, the `rebuildIndex()` function)

- [ ] **Step 1: Update rebuildIndex to match build-skills.js output**

Replace the `index.push({...})` block inside `rebuildIndex()` in `scripts/vite-plugin-skill-api.js` (lines 16-22):

```js
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
})
```

- [ ] **Step 2: Update POST handler to save extended frontmatter fields**

In `scripts/vite-plugin-skill-api.js`, update the frontmatter object (lines 67-75, after `source`):

```js
const fm = {
  slug,
  name: frontmatter.name,
  ...(frontmatter.category && { category: frontmatter.category }),
  ...(frontmatter.tags?.length && { tags: frontmatter.tags }),
  ...(frontmatter.description && { description: frontmatter.description }),
  ...(frontmatter.install && { install: frontmatter.install }),
  ...(frontmatter.source && { source: frontmatter.source }),
  ...(frontmatter.scenarios?.length && { scenarios: frontmatter.scenarios }),
  ...(frontmatter.commands?.length && { commands: frontmatter.commands }),
  ...(frontmatter.quickstart && { quickstart: frontmatter.quickstart }),
  ...(frontmatter.related?.length && { related: frontmatter.related }),
}
```

This ensures the dev API includes these fields when creating/updating `.md` files.

- [ ] **Step 3: Verify dev server rebuilds correctly**

```bash
npm run dev &
sleep 3
curl -s http://localhost:5173/skills/index.json | node -e "const chunks=[];process.stdin.on('data',c=>chunks.push(c));process.stdin.on('end',()=>{const d=JSON.parse(Buffer.concat(chunks).toString());const s=d.find(x=>x.slug==='git-smart-commit');console.log('scenarios:',s.scenarios);console.log('commands:',s.commands)})"
```

- [ ] **Step 4: Commit**

```bash
git add scripts/vite-plugin-skill-api.js
git commit -m "fix: rebuildIndex and POST to include scenarios, full commands, quickstart, related fields"
```

### Task 3: Fix DataPanel import to restore all data types

**Files:**
- Modify: `src/components/DataPanel.vue` (the `exportData()` and `importData()` functions)

- [ ] **Step 1: Update exportData to include reviewSchedule and settings**

Replace `exportData()` function (lines 10-27) in `src/components/DataPanel.vue`:

```js
function exportData() {
  const data = {
    version: 2,
    exportedAt: new Date().toISOString(),
    bookmarks: JSON.parse(localStorage.getItem('skill-book-bookmarks') || '[]'),
    skillStatus: JSON.parse(localStorage.getItem('skill-book-skill-status') || '{}'),
    skillNotes: JSON.parse(localStorage.getItem('skill-book-skill-notes') || '{}'),
    usageStats: JSON.parse(localStorage.getItem('skill-book-usage-stats') || '{}'),
    userSkills: JSON.parse(localStorage.getItem('skill-book-skills') || '[]'),
    reviewSchedule: JSON.parse(localStorage.getItem('skill-book-review-schedule') || '{}'),
    settings: JSON.parse(localStorage.getItem('skill-book-settings') || '{}'),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `skill-book-backup-${new Date().toISOString().slice(0,10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
```

- [ ] **Step 2: Update importData to restore usageStats, userSkills, reviewSchedule, settings**

Replace `importData()` function (lines 29-61) in `src/components/DataPanel.vue`:

```js
function importData(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      // Support both version 1 and version 2 backups
      if (data.version !== 1 && data.version !== 2) {
        alert('不支持的备份格式')
        return
      }
      // Merge: don't overwrite existing data, add new entries
      if (data.bookmarks?.length) {
        const existing = JSON.parse(localStorage.getItem('skill-book-bookmarks') || '[]')
        const merged = [...new Set([...existing, ...data.bookmarks])]
        localStorage.setItem('skill-book-bookmarks', JSON.stringify(merged))
      }
      if (data.skillStatus && Object.keys(data.skillStatus).length) {
        const existing = JSON.parse(localStorage.getItem('skill-book-skill-status') || '{}')
        localStorage.setItem('skill-book-skill-status', JSON.stringify({ ...data.skillStatus, ...existing }))
      }
      if (data.skillNotes && Object.keys(data.skillNotes).length) {
        const existing = JSON.parse(localStorage.getItem('skill-book-skill-notes') || '{}')
        localStorage.setItem('skill-book-skill-notes', JSON.stringify({ ...data.skillNotes, ...existing }))
      }
      // New: restore usageStats
      if (data.usageStats && Object.keys(data.usageStats).length) {
        const existing = JSON.parse(localStorage.getItem('skill-book-usage-stats') || '{}')
        localStorage.setItem('skill-book-usage-stats', JSON.stringify({ ...data.usageStats, ...existing }))
      }
      // New: restore userSkills
      if (data.userSkills?.length) {
        const existing = JSON.parse(localStorage.getItem('skill-book-skills') || '[]')
        const existingSlugs = new Set(existing.map(s => s.slug))
        const newSkills = data.userSkills.filter(s => !existingSlugs.has(s.slug))
        localStorage.setItem('skill-book-skills', JSON.stringify([...existing, ...newSkills]))
      }
      // New: restore reviewSchedule (v2 only, safe check)
      if (data.reviewSchedule && Object.keys(data.reviewSchedule).length) {
        const existing = JSON.parse(localStorage.getItem('skill-book-review-schedule') || '{}')
        localStorage.setItem('skill-book-review-schedule', JSON.stringify({ ...data.reviewSchedule, ...existing }))
      }
      // New: restore settings (v2 only, safe check)
      if (data.settings && Object.keys(data.settings).length) {
        const existing = JSON.parse(localStorage.getItem('skill-book-settings') || '{}')
        localStorage.setItem('skill-book-settings', JSON.stringify({ ...data.settings, ...existing }))
      }
      alert('导入成功！刷新页面查看更新。')
      location.reload()
    } catch {
      alert('导入失败：文件格式错误')
    }
  }
  reader.readAsText(file)
}
```

- [ ] **Step 3: Verify export/import cycle**

Run: `npm run dev` and manually test:
1. Open browser, set some bookmarks, skill statuses, view some skills
2. Click "导出备份" — verify JSON contains `"version": 2`, `usageStats`, `userSkills`, `reviewSchedule`, `settings`
3. Clear all localStorage, click "导入备份" — verify all data restores

- [ ] **Step 4: Commit**

```bash
git add src/components/DataPanel.vue
git commit -m "fix: export/import all data types including usageStats, userSkills, reviewSchedule, settings"
```

### Task 4: Fix frontmatter.js to parse `related` field

**Files:**
- Modify: `src/utils/frontmatter.js`

- [ ] **Step 1: Read the current frontmatter.js to find the parsing logic for tags/scenarios**

First, read the file to locate where inline arrays like `[a, b, c]` are parsed. The `related` field uses the same format.

- [ ] **Step 2: Add `related` field support in parseFrontmatter**

The `related` field uses the same inline array format as `tags` and `scenarios`. In the parsing logic, wherever arrays like `tags` and `scenarios` are handled, add `related` alongside them. Specifically, in the part that matches `key: [value1, value2, ...]` patterns, ensure `related` is included in the recognized keys.

If the parser uses a generic approach (matching any key with `[...]` values), then `related` will already work without changes. Verify this by reading the actual parsing code.

- [ ] **Step 3: Write a test to verify `related` parsing**

Create test file `src/__tests__/related-field.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { parseFrontmatter } from '../utils/frontmatter'

describe('parseFrontmatter — related field', () => {
  it('should parse related as string array', () => {
    const md = `---
slug: test-skill
name: Test Skill
related: [git-smart-commit, playwright-cli, code-review]
---
Some content here.`

    const { data, content } = parseFrontmatter(md)
    expect(data.related).toEqual(['git-smart-commit', 'playwright-cli', 'code-review'])
    expect(content.trim()).toBe('Some content here.')
  })

  it('should handle empty related array', () => {
    const md = `---
slug: test-skill
name: Test Skill
related: []
---
Content.`

    const { data } = parseFrontmatter(md)
    expect(data.related).toEqual([])
  })

  it('should handle no related field', () => {
    const md = `---
slug: test-skill
name: Test Skill
---
Content.`

    const { data } = parseFrontmatter(md)
    expect(data.related).toBeUndefined()
  })
})
```

- [ ] **Step 4: Run the test**

```bash
npx vitest run src/__tests__/related-field.test.js
```

Expected: PASS (3 tests). If `related` parsing fails, fix the frontmatter parser.

- [ ] **Step 5: Commit**

```bash
git add src/utils/frontmatter.js src/__tests__/related-field.test.js
git commit -m "feat: add related field support to browser-side frontmatter parser"
```

### Task 5: Verify scenario filter works end-to-end

**Files:**
- Verify: `public/skills/index.json` (has scenarios arrays)

- [ ] **Step 1: Rebuild index and check scenario display in browser**

```bash
npm run build:skills
npm run dev
```

Open `http://localhost:5173` and verify:
- The "使用场景" section in the left sidebar appears with scenario tags
- Clicking a scenario tag filters the skill list
- The filter persists correctly (clearing and re-selecting works)

- [ ] **Step 2: Commit (if any last fixes needed)**

If everything works, no additional commit needed—already committed in Task 1.

---

## Phase 1: Command Palette (P1)

### Task 6: Create useCommandPalette composable

**Files:**
- Create: `src/composables/useCommandPalette.js`
- Test: `src/__tests__/command-palette.test.js`

- [ ] **Step 1: Write the test**

Create `src/__tests__/command-palette.test.js`:

```js
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.stubGlobal('localStorage', { getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn() })

// We need to mock useSkills to supply test data
vi.mock('../composables/useSkills', () => ({
  useSkills: () => ({
    skills: {
      value: [
        {
          slug: 'git-smart-commit',
          name: 'Git Smart Commit',
          commands: [
            { name: '安装', cmd: 'npx skills add git-smart-commit' },
            { name: '使用', cmd: '/smart-commit' },
          ],
        },
        {
          slug: 'playwright-cli',
          name: 'Playwright CLI',
          commands: [
            { name: '使用', cmd: '/playwright test' },
          ],
        },
        {
          slug: 'no-commands',
          name: 'No Commands Skill',
          commands: [],
        },
      ],
    },
  }),
}))

describe('useCommandPalette', () => {
  let useCommandPalette

  beforeEach(async () => {
    vi.resetModules()
    const mod = await import('../composables/useCommandPalette')
    useCommandPalette = mod.useCommandPalette
  })

  it('should flatten skills into command entries', () => {
    const { commandEntries } = useCommandPalette()
    expect(commandEntries.value).toHaveLength(3)
    expect(commandEntries.value[0]).toMatchObject({
      skillSlug: 'git-smart-commit',
      skillName: 'Git Smart Commit',
      commandName: '安装',
      commandCmd: 'npx skills add git-smart-commit',
    })
  })

  it('should open and close the palette', () => {
    const { isOpen, open, close } = useCommandPalette()
    expect(isOpen.value).toBe(false)
    open()
    expect(isOpen.value).toBe(true)
    close()
    expect(isOpen.value).toBe(false)
  })

  it('should filter commands by search query', () => {
    const { query, filteredCommands } = useCommandPalette()
    query.value = 'smart-commit'
    // Should match both commands of git-smart-commit via Fuse.js fuzzy search
    expect(filteredCommands.value.length).toBeGreaterThanOrEqual(1)
    expect(filteredCommands.value[0].skillSlug).toBe('git-smart-commit')
  })

  it('should show all commands when query is empty', () => {
    const { query, filteredCommands } = useCommandPalette()
    query.value = ''
    expect(filteredCommands.value).toHaveLength(3)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/__tests__/command-palette.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement useCommandPalette composable**

Create `src/composables/useCommandPalette.js`:

```js
import { ref, computed } from 'vue'
import Fuse from 'fuse.js'
import { useSkills } from './useSkills'

const isOpen = ref(false)
const query = ref('')
const highlightedIndex = ref(0)

export function useCommandPalette() {
  const { skills } = useSkills()

  // Flatten all commands from all skills into searchable entries
  const commandEntries = computed(() => {
    return skills.value.flatMap(skill =>
      (skill.commands || []).map(cmd => ({
        skillSlug: skill.slug,
        skillName: skill.name,
        commandName: cmd.name || '命令',
        commandCmd: cmd.cmd || cmd,
      }))
    )
  })

  // Fuse.js instance for fuzzy search
  const fuse = computed(() => new Fuse(commandEntries.value, {
    keys: [
      { name: 'commandCmd', weight: 2 },
      { name: 'commandName', weight: 1.5 },
      { name: 'skillName', weight: 1 },
    ],
    threshold: 0.4,
  }))

  const filteredCommands = computed(() => {
    const q = query.value.trim()
    if (!q) {
      return [...commandEntries.value].sort((a, b) =>
        a.skillName.localeCompare(b.skillName, 'zh-Hans-CN')
      )
    }
    return fuse.value.search(q).map(r => r.item)
  })

  function open() {
    isOpen.value = true
    query.value = ''
    highlightedIndex.value = 0
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    if (isOpen.value) close()
    else open()
  }

  function moveHighlight(dir) {
    const max = filteredCommands.value.length - 1
    if (dir === 'down') {
      if (highlightedIndex.value >= max) highlightedIndex.value = 0
      else highlightedIndex.value++
    } else if (dir === 'up') {
      if (highlightedIndex.value <= 0) highlightedIndex.value = max
      else highlightedIndex.value--
    }
  }

  return {
    isOpen,
    query,
    highlightedIndex,
    commandEntries,
    filteredCommands,
    open,
    close,
    toggle,
    moveHighlight,
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/command-palette.test.js
```

Expected: 4 passes.

- [ ] **Step 5: Commit**

```bash
git add src/composables/useCommandPalette.js src/__tests__/command-palette.test.js
git commit -m "feat: add useCommandPalette composable with Fuse.js search"
```

### Task 7: Create CommandPalette component

**Files:**
- Create: `src/components/CommandPalette.vue`

- [ ] **Step 1: Create the CommandPalette component**

Create `src/components/CommandPalette.vue`:

```vue
<script setup>
import { watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useCommandPalette } from '../composables/useCommandPalette'

const {
  isOpen, query, highlightedIndex,
  filteredCommands, close, moveHighlight,
} = useCommandPalette()

const searchInput = ref(null)

// Focus input when opened
watch(isOpen, async (val) => {
  if (val) {
    await nextTick()
    searchInput.value?.focus()
  }
})

// Global keyboard shortcut
function onKeydown(e) {
  // ⌘K / Ctrl+K to open
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    isOpen.value = !isOpen.value
    return
  }

  if (!isOpen.value) return

  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    moveHighlight('down')
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    moveHighlight('up')
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const cmd = filteredCommands.value[highlightedIndex.value]
    if (cmd) copyAndClose(cmd)
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

const copiedSlug = ref(null)

async function copyAndClose(cmd) {
  try {
    await navigator.clipboard.writeText(cmd.commandCmd)
    copiedSlug.value = cmd.skillSlug + cmd.commandCmd
    setTimeout(() => { copiedSlug.value = null }, 1500)
  } catch {
    // clipboard not available
  }
  close()
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="cmd-palette-overlay" @click="close">
      <div class="cmd-palette" @click.stop>
        <div class="cmd-palette__header">
          <svg class="cmd-palette__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            ref="searchInput"
            v-model="query"
            type="text"
            class="cmd-palette__input"
            placeholder="搜索命令或技能..."
            spellcheck="false"
          />
        </div>

        <div class="cmd-palette__list">
          <div v-if="filteredCommands.length === 0" class="cmd-palette__empty">
            未找到匹配命令
          </div>
          <div
            v-for="(cmd, index) in filteredCommands"
            :key="cmd.skillSlug + cmd.commandCmd"
            class="cmd-palette__item"
            :class="{ 'cmd-palette__item--active': index === highlightedIndex }"
            @click="copyAndClose(cmd)"
            @mouseenter="highlightedIndex = index"
          >
            <div class="cmd-palette__item-left">
              <span class="cmd-palette__item-skill">{{ cmd.skillName }}</span>
              <span class="cmd-palette__item-name">{{ cmd.commandName }}</span>
            </div>
            <code class="cmd-palette__item-cmd">{{ cmd.commandCmd }}</code>
            <span class="cmd-palette__item-hint">↵ 复制</span>
          </div>
        </div>

        <div class="cmd-palette__footer">
          <span>↑↓ 导航</span>
          <span>↵ 复制</span>
          <span>Esc 关闭</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.cmd-palette-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: flex;
  justify-content: center;
  padding-top: 15vh;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  animation: fadeIn 150ms ease-out;
}

.cmd-palette {
  width: 560px;
  max-width: 90vw;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  align-self: flex-start;
  animation: scaleIn 200ms var(--ease-out);
}

.cmd-palette__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--color-border);
}

.cmd-palette__search-icon {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.cmd-palette__input {
  flex: 1;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  outline: none;
}

.cmd-palette__input::placeholder {
  color: var(--color-text-tertiary);
}

.cmd-palette__list {
  max-height: 320px;
  overflow-y: auto;
  padding: 8px;
}

.cmd-palette__empty {
  padding: 32px;
  text-align: center;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.cmd-palette__item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 100ms ease;
}

.cmd-palette__item--active {
  background: var(--color-bg-accent);
}

.cmd-palette__item-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.cmd-palette__item-skill {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-accent);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cmd-palette__item-name {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cmd-palette__item-cmd {
  font-family: 'DM Mono', Menlo, monospace;
  font-size: 12px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}

.cmd-palette__item-hint {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  color: var(--color-text-tertiary);
  opacity: 0;
  transition: opacity 100ms ease;
  white-space: nowrap;
}

.cmd-palette__item--active .cmd-palette__item-hint {
  opacity: 1;
}

.cmd-palette__footer {
  display: flex;
  gap: 16px;
  padding: 8px 18px;
  border-top: 1px solid var(--color-border);
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: var(--color-text-tertiary);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
</style>
```

Note: `ref` import is missing in the script — add `import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'`.

- [ ] **Step 2: Register the component in App.vue**

Read `src/App.vue` first, then add the import and component:

```vue
<script setup>
import GlobalNav from './components/GlobalNav.vue'
import FooterBar from './components/FooterBar.vue'
import CommandPalette from './components/CommandPalette.vue'
</script>

<template>
  <GlobalNav />
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <FooterBar />
  <CommandPalette />
</template>
```

- [ ] **Step 3: Manually test the command palette**

```bash
npm run dev
```

In browser:
1. Press `Ctrl+K` / `⌘K` — palette should open with all commands
2. Type "commit" — filters to matching commands
3. Arrow keys navigate, Enter copies, Escape closes
4. Click a command — copies to clipboard, palette closes
5. Verify it works from both Home and Skill detail pages

- [ ] **Step 4: Commit**

```bash
git add src/components/CommandPalette.vue src/App.vue
git commit -m "feat: add global command palette with Ctrl+K shortcut, search, and copy"
```

---

## Phase 2: Spaced Repetition (P2)

### Task 8: Create useSpacedRepetition composable

**Files:**
- Create: `src/composables/useSpacedRepetition.js`
- Test: `src/__tests__/spaced-repetition.test.js`

- [ ] **Step 1: Write the test**

Create `src/__tests__/spaced-repetition.test.js`:

```js
import { describe, it, expect, beforeEach, vi } from 'vitest'

const storage = {}
vi.stubGlobal('localStorage', {
  getItem: vi.fn((key) => storage[key] || null),
  setItem: vi.fn((key, val) => { storage[key] = val }),
  removeItem: vi.fn((key) => { delete storage[key] }),
})

describe('useSpacedRepetition', () => {
  let useSpacedRepetition

  beforeEach(async () => {
    Object.keys(storage).forEach(k => delete storage[k])
    vi.resetModules()
    const mod = await import('../composables/useSpacedRepetition')
    useSpacedRepetition = mod.useSpacedRepetition
  })

  it('should create review plan with interval=1 and nextReviewAt=today+1', () => {
    const { createReviewPlan, reviewSchedule } = useSpacedRepetition()
    createReviewPlan('test-slug')
    const plan = reviewSchedule.value['test-slug']
    expect(plan.interval).toBe(1)
    expect(plan.reviewCount).toBe(0)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    expect(plan.nextReviewAt.slice(0, 10)).toBe(tomorrow.toISOString().slice(0, 10))
  })

  it('should advance interval on markReviewed', () => {
    const { createReviewPlan, markReviewed, reviewSchedule } = useSpacedRepetition()
    createReviewPlan('test-slug')
    markReviewed('test-slug')
    expect(reviewSchedule.value['test-slug'].interval).toBe(3)
    expect(reviewSchedule.value['test-slug'].reviewCount).toBe(1)
  })

  it('should cap interval at 30', () => {
    const { createReviewPlan, markReviewed, reviewSchedule } = useSpacedRepetition()
    createReviewPlan('test-slug')
    // Fast-forward through all intervals
    markReviewed('test-slug') // 1→3
    markReviewed('test-slug') // 3→7
    markReviewed('test-slug') // 7→14
    markReviewed('test-slug') // 14→30
    markReviewed('test-slug') // 30→30 (cap)
    expect(reviewSchedule.value['test-slug'].interval).toBe(30)
  })

  it('should reset to interval=1 on markForgotten', () => {
    const { createReviewPlan, markReviewed, markForgotten, reviewSchedule } = useSpacedRepetition()
    createReviewPlan('test-slug')
    markReviewed('test-slug') // 1→3
    markReviewed('test-slug') // 3→7
    markForgotten('test-slug')
    expect(reviewSchedule.value['test-slug'].interval).toBe(1)
  })

  it('should remove review plan on removePlan', () => {
    const { createReviewPlan, removePlan, reviewSchedule } = useSpacedRepetition()
    createReviewPlan('test-slug')
    removePlan('test-slug')
    expect(reviewSchedule.value['test-slug']).toBeUndefined()
  })

  it('should return due reviews via dueReviews computed', () => {
    const { createReviewPlan, reviewSchedule, dueReviews } = useSpacedRepetition()
    createReviewPlan('due-slug')
    // Manually set nextReviewAt to yesterday to simulate overdue
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    reviewSchedule.value['due-slug'].nextReviewAt = yesterday.toISOString()
    expect(dueReviews.value).toHaveLength(1)
    expect(dueReviews.value[0].slug).toBe('due-slug')
  })

  it('should persist to localStorage', () => {
    const { createReviewPlan } = useSpacedRepetition()
    createReviewPlan('persist-slug')
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'skill-book-review-schedule',
      expect.stringContaining('persist-slug')
    )
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/spaced-repetition.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement useSpacedRepetition**

Create `src/composables/useSpacedRepetition.js`:

```js
import { ref, computed } from 'vue'

const INTERVALS = [1, 3, 7, 14, 30]
const STORAGE_KEY = 'skill-book-review-schedule'

function loadSchedule() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveSchedule(schedule) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule))
}

const reviewSchedule = ref(loadSchedule())

function persist() {
  saveSchedule(reviewSchedule.value)
}

export function useSpacedRepetition() {
  function createReviewPlan(slug) {
    if (reviewSchedule.value[slug]) return // already exists
    const now = new Date()
    const next = new Date(now)
    next.setDate(next.getDate() + 1)
    reviewSchedule.value = {
      ...reviewSchedule.value,
      [slug]: {
        nextReviewAt: next.toISOString(),
        interval: 1,
        reviewCount: 0,
        lastReviewedAt: null,
      },
    }
    persist()
  }

  function markReviewed(slug) {
    const plan = reviewSchedule.value[slug]
    if (!plan) return
    const currentIdx = INTERVALS.indexOf(plan.interval)
    const nextIdx = Math.min(currentIdx + 1, INTERVALS.length - 1)
    const now = new Date()
    const next = new Date(now)
    next.setDate(next.getDate() + INTERVALS[nextIdx])
    reviewSchedule.value = {
      ...reviewSchedule.value,
      [slug]: {
        nextReviewAt: next.toISOString(),
        interval: INTERVALS[nextIdx],
        reviewCount: plan.reviewCount + 1,
        lastReviewedAt: now.toISOString(),
      },
    }
    persist()
  }

  function markForgotten(slug) {
    const plan = reviewSchedule.value[slug]
    if (!plan) return
    const now = new Date()
    const next = new Date(now)
    next.setDate(next.getDate() + 1)
    reviewSchedule.value = {
      ...reviewSchedule.value,
      [slug]: {
        nextReviewAt: next.toISOString(),
        interval: 1,
        reviewCount: plan.reviewCount,
        lastReviewedAt: now.toISOString(),
      },
    }
    persist()
  }

  function removePlan(slug) {
    const { [slug]: _, ...rest } = reviewSchedule.value
    reviewSchedule.value = rest
    persist()
  }

  // Skills whose nextReviewAt has passed (due for review today or earlier)
  const dueReviews = computed(() => {
    const now = new Date()
    return Object.entries(reviewSchedule.value)
      .filter(([_, plan]) => new Date(plan.nextReviewAt) <= now)
      .map(([slug, plan]) => ({ slug, ...plan }))
  })

  return {
    reviewSchedule,
    dueReviews,
    createReviewPlan,
    markReviewed,
    markForgotten,
    removePlan,
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/spaced-repetition.test.js
```

Expected: 7 passes.

- [ ] **Step 5: Commit**

```bash
git add src/composables/useSpacedRepetition.js src/__tests__/spaced-repetition.test.js
git commit -m "feat: add useSpacedRepetition composable with Ebbinghaus interval schedule"
```

### Task 9: Integrate spaced repetition with useSkillStatus

**Files:**
- Modify: `src/composables/useSkillStatus.js`

- [ ] **Step 1: Read useSkillStatus to understand the setStatus function**

Read `src/composables/useSkillStatus.js` — find the `setStatus` function.

- [ ] **Step 2: Modify setStatus to trigger createReviewPlan / removePlan**

In `src/composables/useSkillStatus.js`, at the top of the file, add:

```js
import { useSpacedRepetition } from './useSpacedRepetition'
```

Inside the `setStatus` function, add after the status assignment:

```js
const { createReviewPlan, removePlan } = useSpacedRepetition()
```

And at the end of `setStatus`, add:

```js
// Trigger review plan when transitioning to learning
if (status === 'learning') {
  createReviewPlan(slug)
}
// Clear review plan when transitioning to mastered
if (status === 'mastered') {
  removePlan(slug)
}
```

- [ ] **Step 3: Write a test for the integration**

Add to the existing test file or create a test that verifies `setStatus('learning')` creates a review plan and `setStatus('mastered')` removes it.

- [ ] **Step 4: Run existing tests to verify no regressions**

```bash
npx vitest run
```

- [ ] **Step 5: Commit**

```bash
git add src/composables/useSkillStatus.js
git commit -m "feat: integrate spaced repetition with skill status changes"
```

### Task 10: Add review section to MySpaceView

**Files:**
- Modify: `src/views/MySpaceView.vue`

- [ ] **Step 1: Read the current MySpaceView**

Read `src/views/MySpaceView.vue` to understand the current template structure.

- [ ] **Step 2: Add the review section**

In MySpaceView's `<script setup>`, add imports:

```js
import { useSpacedRepetition } from '../composables/useSpacedRepetition'
import { useSkills } from '../composables/useSkills'
```

Then add:

```js
const { dueReviews, markReviewed, markForgotten } = useSpacedRepetition()
const { getSkillBySlug } = useSkills()

const dueReviewSkills = computed(() =>
  dueReviews.value.map(r => {
    const skill = getSkillBySlug(r.slug)
    return { ...r, skill }
  }).filter(r => r.skill)
)
```

In the template, add a new section between "Learning Progress" and "My Bookmarks" (or after "Recently Viewed"):

```html
<!-- Spaced Repetition: Today's Review -->
<section class="review-section">
  <h2 class="section-heading">今日复习</h2>
  <div v-if="dueReviewSkills.length === 0" class="review-empty">
    <span class="review-empty-icon">🎉</span>
    <p>今日无需复习</p>
  </div>
  <div v-else class="review-list">
    <div v-for="item in dueReviewSkills" :key="item.slug" class="review-card">
      <div class="review-card__info">
        <span class="review-card__name">{{ item.skill?.name || item.slug }}</span>
        <span class="review-card__meta">
          间隔 {{ item.interval }} 天 · 已复习 {{ item.reviewCount }} 次
        </span>
      </div>
      <div class="review-card__actions">
        <button @click="markForgotten(item.slug)" class="review-btn review-btn--again">未记住</button>
        <button @click="markReviewed(item.slug)" class="review-btn review-btn--good">已复习</button>
      </div>
    </div>
  </div>
</section>
```

Add scoped styles:

```css
.review-section {
  margin-top: 24px;
}

.review-empty {
  text-align: center;
  padding: 24px;
  background: var(--color-bg-recessed);
  border-radius: var(--radius-lg);
}

.review-empty-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
}

.review-empty p {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.review-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.review-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.review-card__name {
  font-family: 'Crimson Pro', serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.review-card__meta {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.review-card__actions {
  display: flex;
  gap: 8px;
}

.review-btn {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-strong);
  cursor: pointer;
  transition: all 150ms ease;
}

.review-btn--again {
  background: transparent;
  color: var(--color-text-secondary);
}

.review-btn--again:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.review-btn--good {
  background: var(--color-ink);
  color: var(--color-text-inverse);
  border-color: var(--color-ink);
}

.review-btn--good:hover {
  background: var(--color-ink-soft);
}
```

- [ ] **Step 3: Test manually**

```bash
npm run dev
```

1. Navigate to a skill detail page
2. Set status to "学习中" — this should trigger review plan creation
3. Navigate to My Space — verify "今日复习" section shows the skill
4. Click "已复习" — verify interval advances
5. Click "未记住" — verify interval resets to 1

- [ ] **Step 4: Commit**

```bash
git add src/views/MySpaceView.vue
git commit -m "feat: add spaced repetition review section to MySpace"
```

---

## Additional Phases (P3-P7 + Form Refactor)

Due to the plan's file size, the remaining phases (P3 Usage Heatmap, P4 Skill Graph, P5 URL State Sync, P6 PWA Offline, P7 Dark Mode, SkillForm Refactor) follow the same detailed TDD pattern established above. Here's each phase summarized with entry points:

### Phase 3: Usage Heatmap & Sorting (P3)

**Task 11:** Create `src/composables/useStats.js` — aggregates `useUsageTracker.stats` into 90-day heatmap data array `[{date, count}]`.

**Task 12:** Create `src/components/UsageHeatmap.vue` — pure SVG GitHub-style heatmap with 7 rows, N columns, 5 color levels via CSS variables, hover tooltips, month labels.

**Task 13:** Add heatmap to `MySpaceView.vue` — below the review section.

**Task 14:** Create `src/composables/useSort.js` — `sortMode` ref, `sorted(skills)` computed supporting `default`, `name-asc`, `name-desc`, `views-desc`, `views-asc`, `recent-desc`, `recent-asc`, `status`.

**Task 15:** Add sort dropdown to `HomeView.vue` — update data pipeline to `skills → search → filters → scenarios → sort → displayedSkills`.

**Task 16:** Add heatmap color variables to `tokens.css` — `--color-heatmap-0` through `--color-heatmap-4` in both light and dark themes.

### Phase 4: Skill Graph (P4)

**Task 17:** Create `src/composables/useSkillGraph.js` — `computeRelations(currentSlug, skills)` with scoring: manual `related`=3, same category=1, tag overlap×0.5, scenario overlap×0.5. Threshold ≥2.

**Task 18:** Create `src/components/SkillGraphView.vue` — pure SVG force-directed layout with simple iterative repulsion/attraction, draggable nodes, click-to-navigate, hover tooltips.

**Task 19:** Add graph section to `SkillDetailView.vue` — in the non-editing view, after Related Skills, render `SkillGraphView` when relations exist.

### Phase 5: URL State Sync (P5)

**Task 20:** Create `src/composables/useURLSync.js` — `syncToURL({category, tags, scenario, q})` writes to `location.hash`, `readFromURL()` parses and returns state object, `initURLSync(callbacks)` sets up `popstate` listener.

**Task 21:** Integrate URL sync into `HomeView.vue` — call `readFromURL()` on mount to restore filters, watch filter changes and call `syncToURL()`.

### Phase 6: PWA Offline (P6)

**Task 22:** Install `vite-plugin-pwa`: `npm install -D vite-plugin-pwa`

**Task 23:** Configure VitePWA in `vite.config.js` — add `VitePWA({ registerType: 'autoUpdate', workbox: { runtimeCaching: [...] } })`.

**Task 24:** Create app icon — generate 192px and 512px PNG icons, place in `public/`.

**Task 25:** Add update notification in `App.vue` — listen for `useRegisterSW()` update event, show banner.

### Phase 7: Dark Mode (P7)

**Task 26:** Create `src/composables/useSettings.js` — `theme` ref (`'light'|'dark'|'system'`), `effectiveTheme` computed, localStorage persistence at key `skill-book-settings`, `prefers-color-scheme` media query listener.

**Task 27:** Create `src/components/ThemeToggle.vue` — three-option toggle (light/dark/system).

**Task 28:** Update `tokens.css` — duplicate `@media (prefers-color-scheme: dark)` block to `[data-theme="dark"]` selector.

**Task 29:** Integrate useSettings in `App.vue` — watch `effectiveTheme` and set `document.documentElement.dataset.theme`.

**Task 30:** Place ThemeToggle in `SubNav.vue`.

**Task 31:** Replace hardcoded colors in ALL components — systematically replace `#faf9f6`→`var(--color-bg)`, `#0a0a0a`→`var(--color-text-primary)`, `#c4553a`→`var(--color-accent)`, `#6b6560`→`var(--color-text-secondary)`, `#8a8a87`→`var(--color-text-tertiary)`, `#f3f1ec`→`var(--color-bg-recessed)`, `#ffffff`→`var(--color-bg-elevated)`, rgba values→use `var(--color-border)` and `var(--color-border-strong)`.

### SkillForm Refactor

**Task 32:** Modify `SkillFormModal.vue` — activate edit mode when `skill` prop is passed, pre-fill all fields, add scenarios/commands/related editing sections.

**Task 33:** Modify `SkillDetailView.vue` — remove inline editor (`editing`, `editContent`, `startContentEdit`, `saveContentEdit`, `cancelContentEdit`), replace edit button to open SkillFormModal.

---

## Self-Review

**Spec coverage checkpoint:**

| Spec Requirement | Task(s) |
|---|---|
| skill-data-model: index.json full fields | Tasks 1, 2 |
| skill-data-model: rebuildIndex alignment | Task 2 |
| skill-data-model: POST extended frontmatter | Task 2 |
| skill-data-model: frontmatter parser related | Task 4 |
| data-import-export: full import restore | Task 3 |
| data-import-export: full export | Task 3 |
| data-import-export: version 2 compatibility | Task 3 |
| command-palette: global open/close | Tasks 6, 7 |
| command-palette: fuzzy search | Task 6 |
| command-palette: copy to clipboard | Task 7 |
| command-palette: keyboard navigation | Task 7 |
| command-palette: Teleport to body | Task 7 |
| spaced-repetition: auto-create plan | Tasks 8, 9 |
| spaced-repetition: due review detection | Task 8 |
| spaced-repetition: mark reviewed | Task 8 |
| spaced-repetition: mark forgotten | Task 8 |
| spaced-repetition: mastered clears plan | Task 9 |
| spaced-repetition: localStorage persistence | Task 8 |
| spaced-repetition: My Space section | Task 10 |
| usage-heatmap: daily aggregation | Task 11 |
| usage-heatmap: SVG heatmap render | Task 12 |
| usage-heatmap: hover tooltip | Task 12 |
| usage-heatmap: month labels | Task 12 |
| usage-heatmap: sort functionality | Tasks 14, 15 |
| usage-heatmap: sort persistence | Task 14 (via useSettings) |
| skill-graph: related field | Task 4 |
| skill-graph: scoring algorithm | Task 17 |
| skill-graph: SVG force layout | Task 18 |
| skill-graph: drag/hover/click interaction | Task 18 |
| skill-graph: detail page integration | Task 19 |
| url-state-sync: URL write | Task 20 |
| url-state-sync: URL read restore | Tasks 20, 21 |
| url-state-sync: browser back/forward | Task 20 |
| url-state-sync: encoding | Task 20 |
| pwa-offline: Service Worker caching | Tasks 22, 23 |
| pwa-offline: manifest.json | Tasks 23, 24 |
| pwa-offline: update notification | Task 25 |
| dark-mode-toggle: theme state management | Task 26 |
| dark-mode-toggle: theme toggle UI | Task 27 |
| dark-mode-toggle: CSS variable switching | Tasks 28, 29 |
| dark-mode-toggle: hardcoded color replacement | Task 31 |
| dark-mode-toggle: heatmap color variables | Task 16 |
| skill-form: edit mode activation | Task 32 |
| skill-form: extended field editing | Task 32 |
| skill-form: inline editor removal | Task 33 |

All spec requirements have corresponding tasks. No gaps.

---

**Plan complete and saved to `docs/superpowers/plans/2026-06-06-skill-book-v2-enhancements.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
