<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { parseFrontmatter } from '../utils/frontmatter'
import SubNav from '../components/SubNav.vue'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import { useSearch } from '../composables/useSearch'
import { useSkills } from '../composables/useSkills'
import { useBookmarks } from '../composables/useBookmarks'
import { useSkillStatus } from '../composables/useSkillStatus'
import { useUsageTracker } from '../composables/useUsageTracker'
import { useSkillNotes } from '../composables/useSkillNotes'
import { useSkillGraph } from '../composables/useSkillGraph'
import SkillGraphView from '../components/SkillGraphView.vue'
import SkillFormModal from '../components/SkillFormModal.vue'

const route = useRoute()
const router = useRouter()
const skill = ref(null)
const content = ref('')
const rawMd = ref('')
const loading = ref(true)
const error = ref(null)
const showDeleteConfirm = ref(false)
const showEditModal = ref(false)
const editingSkill = ref(null)
const { skills, fetchSkills, updateSkill, deleteSkill, categories } = useSkills()
const { query, clearSearch } = useSearch()
const { isBookmarked, toggleBookmark } = useBookmarks()
const { getStatus, setStatus, clearStatus } = useSkillStatus()
const { trackUsage } = useUsageTracker()
const { getNote, saveNote, hasNote } = useSkillNotes()
const { computeRelations } = useSkillGraph()

function buildRawMd(skillObj) {
  const fmLines = [`slug: ${skillObj.slug}`, `name: ${skillObj.name}`]
  if (skillObj.category) fmLines.push(`category: ${skillObj.category}`)
  if (skillObj.tags?.length) fmLines.push(`tags: [${skillObj.tags.join(', ')}]`)
  if (skillObj.description) fmLines.push(`description: ${skillObj.description}`)
  if (skillObj.install) fmLines.push(`install: "${skillObj.install}"`)
  if (skillObj.source) fmLines.push(`source: "${skillObj.source}"`)
  if (skillObj.scenarios?.length) fmLines.push(`scenarios: [${skillObj.scenarios.join(', ')}]`)
  if (skillObj.commands?.length) {
    fmLines.push('commands:')
    skillObj.commands.forEach(cmd => {
      fmLines.push(`  - name: "${cmd.name}"`)
      fmLines.push(`    cmd: "${cmd.cmd}"`)
    })
  }
  if (skillObj.quickstart) fmLines.push(`quickstart: |\n  ${skillObj.quickstart.split('\n').join('\n  ')}`)
  if (skillObj.related?.length) fmLines.push(`related: [${skillObj.related.join(', ')}]`)
  return `---\n${fmLines.join('\n')}\n---\n\n${skillObj.content || ''}`
}

const copiedCmd = ref(null)
const showQuickStart = ref(false)
const showNotes = ref(false)
const noteContent = ref('')

// Related skills: same category + overlapping tags
const relatedSkills = computed(() => {
  if (!skill.value) return []
  const current = skill.value
  return skills.value
    .filter(s => s.slug !== current.slug)
    .map(s => ({
      ...s,
      overlap: (s.category === current.category ? 1 : 0) +
        (s.tags || []).filter(t => (current.tags || []).includes(t)).length
    }))
    .filter(s => s.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 5)
})

// Skill relationship graph
const graphData = computed(() => {
  if (!skill.value) return { nodes: [], edges: [] }
  return computeRelations(skill.value.slug, skills.value)
})

// Quick start content
const quickStartContent = computed(() => {
  if (!skill.value) return ''
  if (skill.value.quickstart) return skill.value.quickstart
  if (skill.value.install) {
    return `1. 安装: \` ${skill.value.install}\`\n2. 开始使用此skill`
  }
  return ''
})

function goHome() {
  clearSearch()
  router.push('/')
}

function handleSearch(val) {
  query.value = val
  router.push('/')
}

async function loadSkill(slug) {
  loading.value = true
  error.value = null
  skill.value = null
  content.value = ''
  rawMd.value = ''
  try {
    // Try local API first (dev server with vite-plugin-skill-api)
    let loaded = false
    const apiRes = await fetch(`/api/skills/${slug}`)
    if (apiRes.ok) {
      const raw = await apiRes.text()
      const { data, content: body } = parseFrontmatter(raw)
      skill.value = data
      content.value = body
      rawMd.value = raw
      loaded = true
    }

    // Fallback: static .md file (production)
    if (!loaded) {
      const res = await fetch(`/skills/${slug}.md`)
      if (res.ok) {
        const raw = await res.text()
        const { data, content: body } = parseFrontmatter(raw)
        skill.value = data
        content.value = body
        rawMd.value = raw
        loaded = true
      }
    }

    // Last fallback: user-created skill in localStorage (no .md file)
    if (!loaded) {
      const found = skills.value.find(s => s.slug === slug)
      if (found) {
        skill.value = found
        content.value = found.content || ''
        // Reconstruct rawMd from user skill data
        rawMd.value = buildRawMd(found)
      } else {
        throw new Error(`Skill not found: ${slug}`)
      }
    }

    // Overlay user edits from the skills array (which includes localStorage merges)
    const userVersion = skills.value.find(s => s.slug === slug)
    if (userVersion && skill.value) {
      skill.value = { ...skill.value, ...userVersion }
      if (userVersion.content) {
        content.value = userVersion.content
      }
    }

    // Track this view with context
    trackUsage(slug, {
      scenario: skill.value?.scenarios?.[0] || '',
      project: '',
      duration: 0,
      outcome: 'viewed',
    })
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSkills()
  loadSkill(route.params.slug)
  initNote(route.params.slug)
})

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    loadSkill(newSlug)
    initNote(newSlug)
  }
})

function initNote(slug) {
  noteContent.value = getNote(slug)
  showNotes.value = hasNote(slug)
}

let noteTimer = null
function onNoteInput() {
  clearTimeout(noteTimer)
  noteTimer = setTimeout(() => {
    saveNote(route.params.slug, noteContent.value)
  }, 500)
}

function toggleNotes() {
  showNotes.value = !showNotes.value
}

function handleDelete() {
  const slug = route.params.slug
  deleteSkill(slug)
  showDeleteConfirm.value = false
  goHome()
}

async function copyCommand(cmd) {
  try {
    await navigator.clipboard.writeText(cmd)
    copiedCmd.value = cmd
    setTimeout(() => { copiedCmd.value = null }, 2000)
  } catch {
    copiedCmd.value = null
  }
}

function openEditModal() {
  editingSkill.value = skill.value ? { ...skill.value } : null
  showEditModal.value = true
}

function handleEditSave(updatedSkill) {
  updateSkill(route.params.slug, updatedSkill)
  showEditModal.value = false
  loadSkill(route.params.slug)
}
</script>

<template>
  <div>
  <SubNav
    v-model:query="query"
    @go-home="goHome"
  />

  <div v-if="loading" class="flex items-center justify-center py-20">
    <span style="font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--color-text-secondary);">加载中...</span>
  </div>

  <div v-else-if="error" class="flex items-center justify-center py-20">
    <div class="text-center">
      <p style="font-family: 'DM Sans', sans-serif; font-size: 16px; color: var(--color-text-secondary); margin-bottom: 16px;">{{ error }}</p>
      <button
        @click="goHome"
        class="back-link"
      >
        返回首页
      </button>
    </div>
  </div>

  <template v-else>
    <!-- Hero Section — warm off-white editorial header -->
    <section style="background: var(--color-bg);">
      <div class="max-w-[980px] mx-auto px-[22px] pt-8 pb-14">
        <!-- Back Button -->
        <button
          @click="goHome"
          class="back-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          返回列表
        </button>

        <!-- Category Label -->
        <p class="category-label">
          {{ skill.category }}
        </p>

        <!-- Skill Name -->
        <h1 style="font-family: 'Crimson Pro', serif; font-size: 44px; font-weight: 600; color: var(--color-text-primary); letter-spacing: -0.02em; line-height: 1.15; margin-top: 24px; writing-mode: horizontal-tb; white-space: normal; word-break: break-word;">
          {{ skill.name }}
        </h1>

        <!-- Description -->
        <p style="font-family: 'DM Sans', sans-serif; font-size: 18px; color: var(--color-text-secondary); line-height: 1.6; max-width: 600px; margin-top: 12px;">
          {{ skill.description }}
        </p>

        <!-- Quality Detail (V2) -->
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

        <!-- Tags -->
        <p v-if="skill.tags?.length" style="font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--color-text-secondary); margin-top: 16px;">
          <template v-for="(tag, i) in skill.tags" :key="tag">
            <span>{{ tag }}</span><span v-if="i < skill.tags.length - 1"> · </span>
          </template>
        </p>

        <!-- Scenarios / When to Use -->
        <div v-if="skill.scenarios?.length" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 6px;">
          <span
            v-for="scenario in skill.scenarios"
            :key="scenario"
            class="scenario-pill"
          >{{ scenario }}</span>
        </div>

        <!-- Status Selector -->
        <div class="status-selector">
          <button
            class="status-badge"
            :class="{ 'status-badge--active': getStatus(skill.slug) === 'todo' }"
            @click="setStatus(skill.slug, getStatus(skill.slug) === 'todo' ? null : 'todo')"
          >待尝试</button>
          <button
            class="status-badge"
            :class="{ 'status-badge--active': getStatus(skill.slug) === 'learning' }"
            @click="setStatus(skill.slug, getStatus(skill.slug) === 'learning' ? null : 'learning')"
          >学习中</button>
          <button
            class="status-badge"
            :class="{ 'status-badge--active': getStatus(skill.slug) === 'mastered' }"
            @click="setStatus(skill.slug, getStatus(skill.slug) === 'mastered' ? null : 'mastered')"
          >已掌握</button>
        </div>

        <!-- Bookmark Toggle -->
        <button
          class="bookmark-btn"
          :class="{ 'bookmark-btn--active': isBookmarked(skill.slug).value }"
          @click="toggleBookmark(skill.slug)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {{ isBookmarked(skill.slug).value ? '已收藏' : '收藏' }}
        </button>

        <!-- Decorative Rule -->
        <div style="width: 60px; height: 2px; background: var(--color-accent); margin-top: 20px;"></div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 12px; margin-top: 20px;">
          <button @click="openEditModal" class="action-btn action-btn--edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            编辑
          </button>
          <button @click="showDeleteConfirm = true" class="action-btn action-btn--delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            删除
          </button>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section style="background: var(--color-bg-elevated);">
      <div class="max-w-[720px] mx-auto px-[22px] py-16">
        <MarkdownRenderer :source="content" />
      </div>
    </section>

    <!-- Quick Start Section (collapsible) -->
    <section v-if="quickStartContent" style="background: var(--color-bg-recessed);">
      <div class="max-w-[720px] mx-auto px-[22px] py-8">
        <button @click="showQuickStart = !showQuickStart" class="quickstart-toggle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline :points="showQuickStart ? '6 9 12 15 18 9' : '9 18 15 12 9 6'" />
          </svg>
          快速开始
        </button>
        <div v-if="showQuickStart" class="quickstart-content">
          <MarkdownRenderer :source="quickStartContent" />
        </div>
      </div>
    </section>

    <!-- Command Cards Section -->
    <section v-if="skill.commands?.length" style="background: var(--color-bg-elevated);">
      <div class="max-w-[720px] mx-auto px-[22px] py-8">
        <h4 class="cmd-section-title">常用命令</h4>
        <div class="cmd-cards">
          <div v-for="(cmd, i) in skill.commands" :key="i" class="cmd-card">
            <span class="cmd-card__label">{{ cmd.name || `命令 ${i+1}` }}</span>
            <code class="cmd-card__code">{{ cmd.cmd }}</code>
            <button @click="copyCommand(cmd.cmd)" class="cmd-card__copy" :class="{ 'cmd-card__copy--done': copiedCmd === cmd.cmd }">
              {{ copiedCmd === cmd.cmd ? '✓' : '复制' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Skills -->
    <section v-if="relatedSkills.length" style="background: var(--color-bg);">
      <div class="max-w-[720px] mx-auto px-[22px] py-10">
        <h4 class="related-title">相关技能</h4>
        <div class="related-grid">
          <div v-for="s in relatedSkills" :key="s.slug" class="related-card" @click="router.push({ name: 'skill-detail', params: { slug: s.slug } })">
            <span class="related-card__category">{{ s.category }}</span>
            <span class="related-card__name">{{ s.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Skill Relationship Graph -->
    <section v-if="graphData.nodes.length > 1" style="background: var(--color-bg);">
      <div class="max-w-[720px] mx-auto px-[22px] py-10">
        <h4 style="font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-text-tertiary); margin: 0 0 12px;">关联图谱</h4>
        <SkillGraphView
          :nodes="graphData.nodes"
          :edges="graphData.edges"
          :current-slug="skill.slug"
          @navigate="slug => router.push({ name: 'skill-detail', params: { slug } })"
        />
      </div>
    </section>

    <!-- My Notes -->
    <section style="background: var(--color-bg-recessed);">
      <div class="max-w-[720px] mx-auto px-[22px] py-8">
        <button @click="toggleNotes" class="notes-toggle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline :points="showNotes ? '6 9 12 15 18 9' : '9 18 15 12 9 6'" />
          </svg>
          我的笔记
          <span v-if="hasNote(skill.slug)" class="notes-indicator"></span>
        </button>
        <div v-if="showNotes" class="notes-editor">
          <textarea
            v-model="noteContent"
            @input="onNoteInput"
            class="notes-textarea"
            placeholder="记录使用心得、注意事项、常用配置..."
            rows="5"
          ></textarea>
          <p class="notes-hint">自动保存 · 支持 Markdown 格式</p>
        </div>
      </div>
    </section>

    <!-- Delete Confirmation -->
    <div v-if="showDeleteConfirm" class="delete-confirm-overlay" @click="showDeleteConfirm = false">
      <div class="delete-confirm-box" @click.stop>
        <p class="delete-confirm-text">确定要删除这个技能吗？此操作不可撤销。</p>
        <div class="delete-confirm-actions">
          <button class="btn btn-ghost" @click="showDeleteConfirm = false">取消</button>
          <button class="btn btn-accent" @click="handleDelete">确认删除</button>
        </div>
      </div>
    </div>

    <SkillFormModal
      v-model="showEditModal"
      :skill="editingSkill"
      :categories="categories.filter(c => c !== '全部')"
      :existing-slugs="skills.filter(s => s.slug !== route.params.slug).map(s => s.slug)"
      @save="handleEditSave"
    />

  </template>
  </div>
</template>

<style scoped>
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: var(--color-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
}

.back-btn:hover {
  color: var(--color-accent);
}

.category-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-accent);
  margin-top: 24px;
}

.back-link {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: var(--color-accent);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.back-link:hover {
  text-decoration: underline;
}

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

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 16px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: transparent;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.action-btn--edit {
  color: var(--color-text-secondary);
}
.action-btn--edit:hover {
  background: var(--color-bg-recessed);
  border-color: var(--color-ink-muted);
}

.action-btn--delete {
  color: var(--color-accent);
  border-color: var(--color-border-accent);
}
.action-btn--delete:hover {
  background: var(--color-bg-accent);
  border-color: var(--color-accent);
}

.delete-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.delete-confirm-box {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  padding: 28px 32px;
  box-shadow: var(--shadow-xl);
  max-width: 380px;
  text-align: center;
}

.delete-confirm-text {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--color-text-primary);
  line-height: 1.5;
  margin-bottom: 20px;
}

.delete-confirm-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.status-selector {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.status-badge {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.status-badge:hover {
  border-color: var(--color-ink-muted);
}

.status-badge--active {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-bg-accent);
}

.bookmark-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  margin-top: 12px;
}

.bookmark-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.bookmark-btn--active {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-bg-accent);
}

.bookmark-btn--active svg {
  fill: var(--color-accent);
  stroke: var(--color-accent);
}

/* Scenario pills */
.scenario-pill {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 12px;
  background: var(--color-bg-accent);
  color: var(--color-accent);
}

/* Quick Start */
.quickstart-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-tertiary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.quickstart-toggle:hover {
  color: var(--color-accent);
}

.quickstart-content {
  margin-top: 12px;
  padding: 16px 20px;
  background: var(--color-bg-elevated);
  border-radius: 8px;
  border-left: 3px solid var(--color-accent);
}

/* Command Cards */
.cmd-section-title {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-tertiary);
  margin: 0 0 12px;
}

.cmd-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cmd-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: var(--color-bg-dark);
  border-left: 3px solid var(--color-accent);
  border-radius: 0;
}

.cmd-card__label {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

.cmd-card__code {
  font-family: 'DM Mono', Menlo, monospace;
  font-size: 13px;
  color: var(--color-text-inverse);
  flex: 1;
  overflow-x: auto;
}

.cmd-card__copy {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 500;
  padding: 3px 8px;
  background: rgba(250, 249, 246, 0.1);
  color: var(--color-text-inverse);
  border: 1px solid rgba(250, 249, 246, 0.15);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.cmd-card__copy:hover {
  background: rgba(250, 249, 246, 0.2);
}

.cmd-card__copy--done {
  color: var(--color-success, #4caf7d);
  border-color: var(--color-success, #4caf7d);
}

/* Related Skills */
.related-title {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-tertiary);
  margin: 0 0 12px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
}

.related-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 14px;
  background: var(--color-bg-elevated);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.related-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.related-card__category {
  font-family: 'DM Sans', sans-serif;
  font-size: 9px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-accent);
}

.related-card__name {
  font-family: 'Crimson Pro', serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

/* Notes Editor */
.notes-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-tertiary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.notes-toggle:hover {
  color: var(--color-accent);
}

.notes-indicator {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success, #4caf7d);
}

.notes-editor {
  margin-top: 12px;
}

.notes-textarea {
  width: 100%;
  min-height: 120px;
  padding: 14px 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-primary);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-strong);
  border-radius: 8px;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
}

.notes-textarea:focus {
  border-color: var(--color-accent);
}

.notes-textarea::placeholder {
  color: var(--color-text-tertiary);
}

.notes-hint {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  color: var(--color-text-tertiary);
  margin: 6px 0 0;
}
</style>
