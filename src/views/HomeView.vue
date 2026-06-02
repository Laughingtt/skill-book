<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSkills } from '../composables/useSkills'
import { useSearch, setSearchSkills } from '../composables/useSearch'
import { useFilters } from '../composables/useFilters'
import { useScenarios } from '../composables/useScenarios'
import { useBookmarks } from '../composables/useBookmarks'
import { useSkillStatus } from '../composables/useSkillStatus'
import { useUsageTracker } from '../composables/useUsageTracker'
import SubNav from '../components/SubNav.vue'
import CategorySidebar from '../components/CategorySidebar.vue'
import TagCloud from '../components/TagCloud.vue'
import SkillCard from '../components/SkillCard.vue'
import SkillFormModal from '../components/SkillFormModal.vue'

const router = useRouter()
const { skills, loading, error, categories, allTags, fetchSkills, addSkill, getSkillBySlug } = useSkills()
setSearchSkills(skills)

const showCreateModal = ref(false)

function handleCreateSave(skillData) {
  addSkill(skillData)
  showCreateModal.value = false
}

onMounted(fetchSkills)

const { query: searchQuery, results: searchResults } = useSearch()
const { selectedCategory, selectedTags, filtered, toggleCategory, toggleTag, clearFilters } = useFilters(searchResults)
const { selectedScenario, allScenarios, filterByScenario, toggleScenario, clearScenario } = useScenarios()

function clearAllFilters() {
  clearFilters()
  clearScenario()
}

// Pipeline: skills → search → category/tag filter → scenario filter → displayed
const scenarioFiltered = filterByScenario(filtered)
const displayedSkills = scenarioFiltered

// Personal sections data
const { bookmarks } = useBookmarks()
const { statuses, statusStats } = useSkillStatus()
const { recentlyViewed, getStaleLearning } = useUsageTracker()

const bookmarkedSkills = computed(() => {
  return bookmarks.value.map(slug => getSkillBySlug(slug)).filter(Boolean)
})

const recentSkills = computed(() => {
  return recentlyViewed.value.map(r => getSkillBySlug(r.slug)).filter(Boolean)
})

const staleSkills = computed(() => {
  return getStaleLearning(statuses.value).map(s => getSkillBySlug(s.slug)).filter(Boolean)
})

function goToSkill(slug) {
  router.push({ name: 'skill-detail', params: { slug } })
}
</script>

<template>
  <div>
  <SubNav
    :search-query="searchQuery"
    @update:search-query="searchQuery = $event"
  />

  <div v-if="loading" class="flex items-center justify-center py-20">
    <span style="font-family: 'DM Sans', sans-serif; font-size: 14px; color: #6b6560;">加载中...</span>
  </div>

  <div v-else-if="error" class="flex items-center justify-center py-20">
    <span style="font-family: 'DM Sans', sans-serif; font-size: 14px; color: #c4553a;">加载失败: {{ error }}</span>
  </div>

  <div v-else>
    <!-- Hero Section -->
    <section class="w-full" style="background: #faf9f6;">
      <div class="max-w-[980px] mx-auto px-[22px] pt-10 pb-12">
        <h1 style="font-family: 'Crimson Pro', serif; font-size: 48px; font-weight: 600; color: #0a0a0a; line-height: 1.1; letter-spacing: -0.02em;">
          Skill Book
        </h1>
        <p style="font-family: 'DM Sans', sans-serif; font-size: 16px; color: #6b6560; margin-top: 8px;">
          探索和管理你的技能知识库
        </p>
        <div style="width: 60px; height: 2px; background: #c4553a; margin-top: 16px;"></div>
        <button @click="showCreateModal = true" class="new-skill-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          添加技能
        </button>
      </div>
    </section>

    <!-- Personal Dashboard -->
    <section v-if="!loading" class="w-full" style="background: #f3f1ec;">
      <div class="max-w-[980px] mx-auto px-[22px] py-10">

        <!-- Progress Stats -->
        <div class="progress-card">
          <h3 class="progress-card__title">学习进度</h3>
          <div class="progress-stats">
            <div class="progress-stat">
              <span class="progress-stat__dot progress-stat__dot--todo"></span>
              <span class="progress-stat__count">{{ statusStats.todo }}</span>
              <span class="progress-stat__label">待尝试</span>
            </div>
            <div class="progress-stat">
              <span class="progress-stat__dot progress-stat__dot--learning"></span>
              <span class="progress-stat__count">{{ statusStats.learning }}</span>
              <span class="progress-stat__label">学习中</span>
            </div>
            <div class="progress-stat">
              <span class="progress-stat__dot progress-stat__dot--mastered"></span>
              <span class="progress-stat__count">{{ statusStats.mastered }}</span>
              <span class="progress-stat__label">已掌握</span>
            </div>
            <div class="progress-stat progress-stat--total">
              <span class="progress-stat__count">{{ skills.length }}</span>
              <span class="progress-stat__label">总计</span>
            </div>
          </div>
          <div v-if="skills.length" class="progress-bar">
            <div class="progress-bar__fill" :style="{ width: `${(statusStats.mastered / skills.length) * 100}%` }"></div>
            <div class="progress-bar__learning" :style="{ width: `${(statusStats.learning / skills.length) * 100}%`, left: `${(statusStats.mastered / skills.length) * 100}%` }"></div>
          </div>
        </div>

        <!-- My Bookmarks -->
        <div v-if="bookmarkedSkills.length" class="personal-section">
          <h3 class="personal-section__title">我的收藏</h3>
          <div class="personal-section__scroll">
            <div
              v-for="skill in bookmarkedSkills"
              :key="skill.slug"
              class="mini-card"
              @click="goToSkill(skill.slug)"
            >
              <span class="mini-card__category">{{ skill.category }}</span>
              <span class="mini-card__name">{{ skill.name }}</span>
            </div>
          </div>
        </div>
        <div v-else class="personal-section__empty">
          <p>收藏常用skill，快速访问</p>
        </div>

        <!-- Review Reminders -->
        <div v-if="staleSkills.length" class="personal-section">
          <h3 class="personal-section__title">该复习了 <span class="personal-section__badge">{{ staleSkills.length }}</span></h3>
          <div class="personal-section__scroll">
            <div
              v-for="skill in staleSkills"
              :key="skill.slug"
              class="mini-card mini-card--stale"
              @click="goToSkill(skill.slug)"
            >
              <span class="mini-card__category">{{ skill.category }}</span>
              <span class="mini-card__name">{{ skill.name }}</span>
            </div>
          </div>
        </div>

        <!-- Recently Viewed -->
        <div v-if="recentSkills.length" class="personal-section">
          <h3 class="personal-section__title">最近查看</h3>
          <div class="personal-section__scroll">
            <div
              v-for="skill in recentSkills"
              :key="skill.slug"
              class="mini-card"
              @click="goToSkill(skill.slug)"
            >
              <span class="mini-card__category">{{ skill.category }}</span>
              <span class="mini-card__name">{{ skill.name }}</span>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Main Layout -->
    <div class="max-w-[1200px] mx-auto px-[22px] py-10 flex gap-10">
      <!-- Left Sidebar -->
      <aside class="w-[220px] shrink-0 sticky top-[72px] self-start">
        <CategorySidebar
          :categories="categories"
          :selected="selectedCategory"
          @select="toggleCategory"
        />
        <TagCloud
          :tags="allTags"
          :selected-tags="selectedTags"
          @toggle="toggleTag"
        />
        <!-- Scenario Filter -->
        <div v-if="allScenarios(skills).length" class="mt-8">
          <h3 style="font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #8a8a87; margin-bottom: 10px;">
            使用场景
          </h3>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            <span
              v-for="scenario in allScenarios(skills)"
              :key="scenario"
              @click="toggleScenario(scenario)"
              :class="[
                'scenario-tag',
                selectedScenario === scenario ? 'scenario-tag--active' : ''
              ]"
            >{{ scenario }}</span>
          </div>
        </div>
      </aside>

      <!-- Right Content -->
      <main class="flex-1 min-w-0">
        <!-- Results Count & Clear -->
        <div class="flex items-center justify-between mb-6">
          <p style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: #6b6560;">
            <span style="font-family: 'Crimson Pro', serif; font-weight: 600;">{{ displayedSkills.length }}</span> 个技能
          </p>
          <button
            v-if="selectedCategory !== '全部' || selectedTags.length > 0 || searchQuery || selectedScenario"
            @click="clearAllFilters(); searchQuery = ''"
            class="clear-filter-btn"
          >
            清除筛选
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="displayedSkills.length === 0" class="text-center py-20">
          <p style="font-family: 'DM Sans', sans-serif; font-size: 16px; color: #6b6560;">
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
    @save="handleCreateSave"
  />
  </div>
</template>

<style scoped>
.clear-filter-btn {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #c4553a;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.clear-filter-btn:hover {
  text-decoration: underline;
}

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

.new-skill-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #faf9f6;
  background: #c4553a;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s ease;
}

.new-skill-btn:hover {
  background: #b44a31;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(196, 85, 58, 0.2);
}

/* Progress Card */
.progress-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.progress-card__title {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #8a8a87;
  margin: 0 0 12px;
}

.progress-stats {
  display: flex;
  gap: 24px;
  align-items: center;
}

.progress-stat {
  display: flex;
  align-items: center;
  gap: 6px;
}

.progress-stat__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.progress-stat__dot--todo { background: #e5a84b; }
.progress-stat__dot--learning { background: #5b8dd9; }
.progress-stat__dot--mastered { background: #4caf7d; }

.progress-stat__count {
  font-family: 'Crimson Pro', serif;
  font-size: 20px;
  font-weight: 600;
  color: #0a0a0a;
}

.progress-stat__label {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: #6b6560;
}

.progress-stat--total {
  margin-left: auto;
  padding-left: 16px;
  border-left: 1px solid rgba(0,0,0,0.08);
}

.progress-bar {
  height: 4px;
  background: rgba(0,0,0,0.06);
  border-radius: 2px;
  margin-top: 12px;
  position: relative;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: #4caf7d;
  border-radius: 2px;
  transition: width 0.3s ease;
  position: absolute;
  left: 0;
}

.progress-bar__learning {
  height: 100%;
  background: #5b8dd9;
  border-radius: 2px;
  transition: width 0.3s ease, left 0.3s ease;
  position: absolute;
}

/* Personal Sections */
.personal-section {
  margin-bottom: 16px;
}

.personal-section__title {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #8a8a87;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.personal-section__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 10px;
  font-weight: 600;
  color: #ffffff;
  background: #c4553a;
  border-radius: 9px;
}

.personal-section__scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.personal-section__empty {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #8a8a87;
  padding: 8px 0;
  margin-bottom: 16px;
}

/* Mini Card */
.mini-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.mini-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.mini-card--stale {
  border-left: 3px solid #e5a84b;
}

.mini-card__category {
  font-family: 'DM Sans', sans-serif;
  font-size: 9px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #c4553a;
}

.mini-card__name {
  font-family: 'Crimson Pro', serif;
  font-size: 15px;
  font-weight: 600;
  color: #0a0a0a;
}

.scenario-tag {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.04);
  color: #6b6560;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.scenario-tag:hover {
  background: rgba(196, 85, 58, 0.08);
  color: #c4553a;
}

.scenario-tag--active {
  background: rgba(196, 85, 58, 0.12);
  color: #c4553a;
  font-weight: 500;
}
</style>
