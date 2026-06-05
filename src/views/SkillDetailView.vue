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

const route = useRoute()
const router = useRouter()
const skill = ref(null)
const content = ref('')
const rawMd = ref('')
const loading = ref(true)
const error = ref(null)
const showDeleteConfirm = ref(false)
const { skills, fetchSkills, updateSkillFromMd, deleteSkill } = useSkills()
const { query, clearSearch } = useSearch()
const { isBookmarked, toggleBookmark } = useBookmarks()
const { getStatus, setStatus, clearStatus } = useSkillStatus()
const { trackView } = useUsageTracker()
const { getNote, saveNote, hasNote } = useSkillNotes()
const { computeRelations } = useSkillGraph()

const editing = ref(false)
const editContent = ref('')
const saving = ref(false)
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

// Preview body only (strip frontmatter from editContent for preview)
const previewBody = computed(() => {
  if (!editContent.value) return ''
  const { content: body } = parseFrontmatter(editContent.value)
  return body
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
        const fmLines = [`slug: ${found.slug}`, `name: ${found.name}`]
        if (found.category) fmLines.push(`category: ${found.category}`)
        if (found.tags?.length) fmLines.push(`tags: [${found.tags.join(', ')}]`)
        if (found.description) fmLines.push(`description: ${found.description}`)
        if (found.install) fmLines.push(`install: "${found.install}"`)
        if (found.source) fmLines.push(`source: "${found.source}"`)
        rawMd.value = `---\n${fmLines.join('\n')}\n---\n\n${found.content || ''}`
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

    // Track this view
    trackView(slug)
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

function startContentEdit() {
  editContent.value = rawMd.value
  editing.value = true
}

function cancelContentEdit() {
  editing.value = false
  editContent.value = ''
}

async function saveContentEdit() {
  saving.value = true
  try {
    const updated = await updateSkillFromMd(route.params.slug, editContent.value)
    if (updated) {
      // Update local state from the saved skill
      skill.value = updated
      content.value = updated.content || ''
      // Rebuild rawMd from saved data
      const fmLines = [`slug: ${updated.slug}`, `name: ${updated.name}`]
      if (updated.category) fmLines.push(`category: ${updated.category}`)
      if (updated.tags?.length) fmLines.push(`tags: [${updated.tags.join(', ')}]`)
      if (updated.description) fmLines.push(`description: ${updated.description}`)
      if (updated.install) fmLines.push(`install: "${updated.install}"`)
      if (updated.source) fmLines.push(`source: "${updated.source}"`)
      rawMd.value = `---\n${fmLines.join('\n')}\n---\n\n${updated.content || ''}`
    }
    editing.value = false
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
  <SubNav
    v-model:query="query"
    @go-home="goHome"
  />

  <div v-if="loading" class="flex items-center justify-center py-20">
    <span style="font-family: 'DM Sans', sans-serif; font-size: 14px; color: #6b6560;">加载中...</span>
  </div>

  <div v-else-if="error" class="flex items-center justify-center py-20">
    <div class="text-center">
      <p style="font-family: 'DM Sans', sans-serif; font-size: 16px; color: #6b6560; margin-bottom: 16px;">{{ error }}</p>
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
    <section style="background: #faf9f6;">
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
        <h1 style="font-family: 'Crimson Pro', serif; font-size: 44px; font-weight: 600; color: #0a0a0a; letter-spacing: -0.02em; line-height: 1.15; margin-top: 24px; writing-mode: horizontal-tb; white-space: normal; word-break: break-word;">
          {{ skill.name }}
        </h1>

        <!-- Description -->
        <p style="font-family: 'DM Sans', sans-serif; font-size: 18px; color: #6b6560; line-height: 1.6; max-width: 600px; margin-top: 12px;">
          {{ skill.description }}
        </p>

        <!-- Tags -->
        <p v-if="skill.tags?.length" style="font-family: 'DM Sans', sans-serif; font-size: 12px; color: #6b6560; margin-top: 16px;">
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
        <div style="width: 60px; height: 2px; background: #c4553a; margin-top: 20px;"></div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 12px; margin-top: 20px;">
          <button v-if="!editing" @click="startContentEdit" class="action-btn action-btn--edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            编辑
          </button>
          <button v-if="editing" @click="saveContentEdit" class="action-btn action-btn--save" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
          <button v-if="editing" @click="cancelContentEdit" class="action-btn action-btn--cancel">
            取消
          </button>
          <button v-if="!editing" @click="showDeleteConfirm = true" class="action-btn action-btn--delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            删除
          </button>
        </div>
      </div>
    </section>

    <!-- Content Section — white, narrow reading column -->
    <section style="background: #ffffff;">
      <div :class="editing ? 'max-w-[1200px]' : 'max-w-[720px]'" class="mx-auto px-[22px] py-16">
        <!-- Preview mode -->
        <MarkdownRenderer v-if="!editing" :source="content" />

        <!-- Edit mode: split panes -->
        <div v-if="editing" class="detail-edit-area">
          <div class="detail-edit-panes">
            <div class="detail-edit-pane">
              <div class="detail-edit-pane-header">编辑</div>
              <textarea
                v-model="editContent"
                class="detail-edit-textarea"
                placeholder="编辑 Markdown 内容..."
                spellcheck="false"
              ></textarea>
            </div>
            <div class="detail-edit-pane">
              <div class="detail-edit-pane-header">预览</div>
              <div class="detail-edit-preview">
                <MarkdownRenderer v-if="editContent" :source="editContent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Start Section (collapsible) -->
    <section v-if="!editing && quickStartContent" style="background: #f3f1ec;">
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
    <section v-if="!editing && skill.commands?.length" style="background: #ffffff;">
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
    <section v-if="!editing && relatedSkills.length" style="background: #faf9f6;">
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
    <section v-if="!editing && graphData.nodes.length > 1" style="background: #faf9f6;">
      <div class="max-w-[720px] mx-auto px-[22px] py-10">
        <h4 style="font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #8a8a87; margin: 0 0 12px;">关联图谱</h4>
        <SkillGraphView
          :nodes="graphData.nodes"
          :edges="graphData.edges"
          :current-slug="skill.slug"
          @navigate="slug => router.push({ name: 'skill-detail', params: { slug } })"
        />
      </div>
    </section>

    <!-- My Notes -->
    <section v-if="!editing" style="background: #f3f1ec;">
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

  </template>
  </div>
</template>

<style scoped>
.detail-edit-area {
  margin-top: var(--spacing-4);
}

.detail-edit-panes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4);
  min-height: 500px;
}

.detail-edit-pane {
  display: flex;
  flex-direction: column;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.detail-edit-pane-header {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  background: var(--color-surface-alt);
  border-bottom: 1px solid var(--color-border);
}

.detail-edit-textarea {
  flex: 1;
  width: 100%;
  min-height: 480px;
  padding: var(--spacing-4);
  font-family: 'DM Mono', 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  border: none;
  background: var(--color-surface);
  color: var(--color-text);
  resize: none;
  tab-size: 2;
  outline: none;
}

.detail-edit-preview {
  flex: 1;
  padding: var(--spacing-4);
  overflow-y: auto;
  background: var(--color-surface);
  min-height: 480px;
}

@media (max-width: 768px) {
  .detail-edit-panes {
    grid-template-columns: 1fr;
  }
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #6b6560;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
}

.back-btn:hover {
  color: #c4553a;
}

.category-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #c4553a;
  margin-top: 24px;
}

.back-link {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: #c4553a;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.back-link:hover {
  text-decoration: underline;
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

.action-btn--save {
  background: #dcfce7;
  color: #16a34a;
  border-color: #86efac;
}

.action-btn--save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn--cancel {
  background: var(--color-surface-alt);
  color: var(--color-text-secondary);
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
  border-color: #c4553a;
  color: #c4553a;
}

.bookmark-btn--active {
  border-color: #c4553a;
  color: #c4553a;
  background: rgba(196, 85, 58, 0.08);
}

.bookmark-btn--active svg {
  fill: #c4553a;
  stroke: #c4553a;
}

/* Scenario pills */
.scenario-pill {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 12px;
  background: rgba(196, 85, 58, 0.08);
  color: #c4553a;
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
  color: #8a8a87;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.quickstart-toggle:hover {
  color: #c4553a;
}

.quickstart-content {
  margin-top: 12px;
  padding: 16px 20px;
  background: #ffffff;
  border-radius: 8px;
  border-left: 3px solid #c4553a;
}

/* Command Cards */
.cmd-section-title {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #8a8a87;
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
  background: #0a0a0a;
  border-left: 3px solid #c4553a;
  border-radius: 0;
}

.cmd-card__label {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #8a8a87;
  white-space: nowrap;
}

.cmd-card__code {
  font-family: 'DM Mono', Menlo, monospace;
  font-size: 13px;
  color: #faf9f6;
  flex: 1;
  overflow-x: auto;
}

.cmd-card__copy {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 500;
  padding: 3px 8px;
  background: rgba(250, 249, 246, 0.1);
  color: #faf9f6;
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
  color: #4caf7d;
  border-color: #4caf7d;
}

/* Related Skills */
.related-title {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #8a8a87;
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
  background: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.related-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.related-card__category {
  font-family: 'DM Sans', sans-serif;
  font-size: 9px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #c4553a;
}

.related-card__name {
  font-family: 'Crimson Pro', serif;
  font-size: 14px;
  font-weight: 600;
  color: #0a0a0a;
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
  color: #8a8a87;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.notes-toggle:hover {
  color: #c4553a;
}

.notes-indicator {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4caf7d;
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
  color: #0a0a0a;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 8px;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
}

.notes-textarea:focus {
  border-color: #c4553a;
}

.notes-textarea::placeholder {
  color: #8a8a87;
}

.notes-hint {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  color: #8a8a87;
  margin: 6px 0 0;
}
</style>
