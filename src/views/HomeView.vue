<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSkills } from '../composables/useSkills'
import { useSearch, setSearchSkills } from '../composables/useSearch'
import { useFilters } from '../composables/useFilters'
import { useScenarios } from '../composables/useScenarios'
import { useBookmarks } from '../composables/useBookmarks'
import { useSkillStatus } from '../composables/useSkillStatus'
import { useUsageTracker } from '../composables/useUsageTracker'
import { useSort } from '../composables/useSort'
import { readFromURL, syncToURL } from '../composables/useURLSync'
import SubNav from '../components/SubNav.vue'
import CategorySidebar from '../components/CategorySidebar.vue'
import TagCloud from '../components/TagCloud.vue'
import SkillCard from '../components/SkillCard.vue'
import SkillFormModal from '../components/SkillFormModal.vue'

const router = useRouter()
const { skills, loading, error, categories, allTags, fetchSkills, addSkill } = useSkills()
setSearchSkills(skills)

const showCreateModal = ref(false)

function handleCreateSave(skillData) {
  addSkill(skillData)
  showCreateModal.value = false
}

onMounted(() => {
  fetchSkills().then(() => {
    // Apply URL state after skills are loaded
    const urlState = readFromURL()
    if (urlState.category) selectedCategory.value = urlState.category
    if (urlState.tags.length) selectedTags.value = urlState.tags
    if (urlState.scenario) selectedScenario.value = urlState.scenario
    if (urlState.q) query.value = urlState.q
  })
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})

function handlePopState() {
  const urlState = readFromURL()
  if (urlState.category !== null) selectedCategory.value = urlState.category
  else selectedCategory.value = '全部'
  selectedTags.value = urlState.tags
  if (urlState.scenario !== null) selectedScenario.value = urlState.scenario
  else selectedScenario.value = null
  if (urlState.q !== '') query.value = urlState.q
  else query.value = ''
}

const { query, results: searchResults, clearSearch } = useSearch()
const { selectedCategory, selectedTags, filtered, toggleCategory, toggleTag, clearFilters } = useFilters(searchResults)
const { selectedScenario, allScenarios, filterByScenario, toggleScenario, clearScenario } = useScenarios()

function clearAllFilters() {
  clearFilters()
  clearScenario()
  clearSearch()
}

function handleCategorySelect(cat) {
  toggleCategory(cat)
  // 点击"全部"时同时清空搜索
  if (cat === '全部') {
    clearSearch()
  }
}

const scenarioFiltered = filterByScenario(filtered)
const { sortMode, setSortMode, sorted } = useSort()
const displayedSkills = computed(() => sorted(scenarioFiltered.value))

// Personal data for Hero summary panel
const { bookmarks } = useBookmarks()
const { statuses: skillStatuses, statusStats } = useSkillStatus()
const { recentlyViewed, getStaleLearning } = useUsageTracker()

// Sync filter state to URL
watch(
  [selectedCategory, selectedTags, selectedScenario, query],
  () => {
    syncToURL({
      category: selectedCategory.value,
      tags: selectedTags.value,
      scenario: selectedScenario.value,
      q: query.value,
    })
  },
  { deep: true }
)

const staleCount = computed(() => (getStaleLearning(skillStatuses.value || {}) || []).length)
const recentCount = computed(() => (recentlyViewed.value || []).length)
</script>

<template>
  <div>
  <SubNav v-model:query="query" @go-home="clearSearch()" />

  <div v-if="loading" class="flex items-center justify-center py-20">
    <span style="font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--color-text-secondary);">加载中...</span>
  </div>

  <div v-else-if="error" class="flex items-center justify-center py-20">
    <span style="font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--color-accent);">加载失败: {{ error }}</span>
  </div>

  <div v-else>
    <!-- Hero Section: two-column layout -->
    <section class="hero-section">
      <div class="hero-inner">
        <!-- Left: Title -->
        <div class="hero-left">
          <h1 class="hero-title">Skill Book</h1>
          <p class="hero-subtitle">探索和管理你的技能知识库</p>
          <div class="hero-rule"></div>
          <button @click="showCreateModal = true" class="new-skill-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            添加技能
          </button>
        </div>
        <!-- Right: Personal summary panel -->
        <div class="hero-panel" @click="router.push({ name: 'my-space' })">
          <div class="panel-ring-row">
            <div class="panel-ring">
              <svg viewBox="0 0 36 36">
                <circle class="ring-bg" cx="18" cy="18" r="15.5" />
                <circle class="ring-fill ring-fill--mastered" cx="18" cy="18" r="15.5" :stroke-dasharray="`${statusStats.mastered / Math.max(skills.length, 1) * 97.4} 97.4`" />
                <circle class="ring-fill ring-fill--learning" cx="18" cy="18" r="15.5" :stroke-dasharray="`${statusStats.learning / Math.max(skills.length, 1) * 97.4} 97.4`" :stroke-dashoffset="`-${statusStats.mastered / Math.max(skills.length, 1) * 97.4}`" />
              </svg>
              <span class="panel-ring-num">{{ statusStats.mastered }}</span>
            </div>
            <div class="panel-ring-legend">
              <span class="legend-item"><i class="legend-dot legend-dot--mastered"></i>已掌握 {{ statusStats.mastered }}</span>
              <span class="legend-item"><i class="legend-dot legend-dot--learning"></i>学习中 {{ statusStats.learning }}</span>
              <span class="legend-item"><i class="legend-dot legend-dot--todo"></i>待尝试 {{ statusStats.todo }}</span>
            </div>
          </div>
          <div class="panel-stats">
            <span class="panel-stat">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {{ bookmarks.length }}
            </span>
            <span class="panel-stat">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ recentCount }}
            </span>
            <span v-if="staleCount" class="panel-stat panel-stat--alert">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              {{ staleCount }}
            </span>
          </div>
          <span class="panel-link">查看详情 →</span>
        </div>
      </div>
    </section>

    <!-- Main Layout -->
    <div class="max-w-[1200px] mx-auto px-[22px] py-10 flex gap-10">
      <!-- Left Sidebar (no personal modules) -->
      <aside class="w-[220px] shrink-0 sticky top-[72px] self-start">
        <CategorySidebar
          :categories="categories"
          :selected="selectedCategory"
          @select="handleCategorySelect"
        />
        <TagCloud
          :tags="allTags"
          :selected-tags="selectedTags"
          @toggle="toggleTag"
        />
        <!-- Scenario Filter -->
        <div v-if="allScenarios(skills).length" class="mt-8">
          <h3 style="font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-text-tertiary); margin-bottom: 10px;">
            使用场景
          </h3>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            <span
              v-for="scenario in allScenarios(skills)"
              :key="scenario"
              @click="toggleScenario(scenario)"
              :class="['scenario-tag', selectedScenario === scenario ? 'scenario-tag--active' : '']"
            >{{ scenario }}</span>
          </div>
        </div>
      </aside>

      <!-- Right Content -->
      <main class="flex-1 min-w-0">
        <!-- Results Count & Sort -->
        <div class="flex items-center justify-between mb-6">
          <p style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--color-text-secondary);">
            <span style="font-family: 'Crimson Pro', serif; font-weight: 600;">{{ displayedSkills.length }}</span> 个技能
          </p>
          <div class="flex items-center gap-4">
            <select
              :value="sortMode"
              @change="setSortMode($event.target.value)"
              class="sort-select"
            >
              <option value="default">默认排序</option>
              <option value="name-asc">名称 A-Z</option>
              <option value="name-desc">名称 Z-A</option>
              <option value="views-desc">查看频率 高→低</option>
              <option value="views-asc">查看频率 低→高</option>
              <option value="recent-desc">最近查看</option>
              <option value="recent-asc">最近查看 旧→新</option>
              <option value="status">学习状态</option>
            </select>
            <button
              v-if="selectedCategory !== '全部' || selectedTags.length > 0 || query || selectedScenario"
              @click="clearAllFilters()"
              class="clear-filter-btn"
            >
              清除筛选
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="displayedSkills.length === 0" class="text-center py-20">
          <p style="font-family: 'DM Sans', sans-serif; font-size: 16px; color: var(--color-text-secondary);">
            未找到匹配的技能
          </p>
        </div>

        <!-- Skill Cards Grid -->
        <div v-else class="grid grid-cols-2 gap-6">
          <div
            v-for="(skill, index) in displayedSkills"
            :key="skill.slug"
            class="card-stagger"
            :style="{ animationDelay: `${index * 60}ms` }"
          >
            <SkillCard :skill="skill" />
          </div>
        </div>
      </main>
    </div>
  </div>

  <SkillFormModal
    v-model="showCreateModal"
    :categories="categories.filter(c => c !== '全部')"
    :existing-slugs="skills.map(s => s.slug)"
    @save="handleCreateSave"
  />
  </div>
</template>

<style scoped>
/* ── Hero Section ── */

.hero-section {
  width: 100%;
  background: var(--color-bg);
}

.hero-inner {
  max-width: 980px;
  margin: 0 auto;
  padding: 40px 22px 48px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 40px;
}

.hero-left {
  flex: 1;
}

.hero-title {
  font-family: 'Crimson Pro', serif;
  font-size: 48px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}

.hero-subtitle {
  font-family: 'DM Sans', sans-serif;
  font-size: 16px;
  color: var(--color-text-secondary);
  margin: 8px 0 0;
}

.hero-rule {
  width: 60px;
  height: 2px;
  background: var(--color-accent);
  margin-top: 16px;
}

/* ── Hero Right Panel ── */

.hero-panel {
  flex-shrink: 0;
  width: 220px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 18px 20px;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}

.hero-panel:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.panel-ring-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.panel-ring {
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.panel-ring svg {
  width: 48px;
  height: 48px;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: var(--color-border);
  stroke-width: 3;
}

.ring-fill {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dasharray 0.4s ease, stroke-dashoffset 0.4s ease;
}

.ring-fill--mastered { stroke: var(--color-success, #4caf7d); }
.ring-fill--learning { stroke: var(--color-info, #5b8dd9); }

.panel-ring-num {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Crimson Pro', serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.panel-ring-legend {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.legend-item {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-dot--mastered { background: var(--color-success, #4caf7d); }
.legend-dot--learning { background: var(--color-info, #5b8dd9); }
.legend-dot--todo { background: var(--color-warning, #e5a84b); }

.panel-stats {
  display: flex;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
  margin-bottom: 10px;
}

.panel-stat {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.panel-stat svg {
  opacity: 0.5;
}

.panel-stat--alert {
  color: var(--color-accent);
}

.panel-stat--alert svg {
  opacity: 1;
  color: var(--color-warning, #e5a84b);
  stroke: var(--color-warning, #e5a84b);
}

.panel-link {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: var(--color-accent);
  font-weight: 500;
}

/* ── Buttons ── */

.new-skill-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-inverse);
  background: var(--color-accent);
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s ease;
}

.new-skill-btn:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-accent);
}

.clear-filter-btn {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: var(--color-accent);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.clear-filter-btn:hover {
  text-decoration: underline;
}

.sort-select {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: var(--color-text-secondary);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s ease;
}

.sort-select:hover {
  border-color: var(--color-border-strong);
}

.sort-select:focus {
  border-color: var(--color-accent);
}

/* ── Scenario Tags ── */

.scenario-tag {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 12px;
  background: var(--color-bg-recessed);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.scenario-tag:hover {
  background: var(--color-bg-accent);
  color: var(--color-accent);
}

.scenario-tag--active {
  background: var(--color-accent-muted);
  color: var(--color-accent);
  font-weight: 500;
}

/* ── Card Animation ── */

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-stagger {
  animation: cardFadeIn 0.45s ease-out both;
}
</style>
