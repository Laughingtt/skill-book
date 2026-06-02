<script setup>
import { ref, onMounted } from 'vue'
import { useSkills } from '../composables/useSkills'
import { useSearch, setSearchSkills } from '../composables/useSearch'
import { useFilters } from '../composables/useFilters'
import SubNav from '../components/SubNav.vue'
import CategorySidebar from '../components/CategorySidebar.vue'
import TagCloud from '../components/TagCloud.vue'
import SkillCard from '../components/SkillCard.vue'
import SkillFormModal from '../components/SkillFormModal.vue'

const { skills, loading, error, categories, allTags, fetchSkills, addSkill } = useSkills()
setSearchSkills(skills)

const showCreateModal = ref(false)

function handleCreateSave(skillData) {
  addSkill(skillData)
  showCreateModal.value = false
}

onMounted(fetchSkills)

const { query: searchQuery, results: searchResults } = useSearch()
const { selectedCategory, selectedTags, filtered, toggleCategory, toggleTag, clearFilters } = useFilters(searchResults)

const displayedSkills = filtered
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
      </aside>

      <!-- Right Content -->
      <main class="flex-1 min-w-0">
        <!-- Results Count & Clear -->
        <div class="flex items-center justify-between mb-6">
          <p style="font-family: 'DM Sans', sans-serif; font-size: 13px; color: #6b6560;">
            <span style="font-family: 'Crimson Pro', serif; font-weight: 600;">{{ displayedSkills.length }}</span> 个技能
          </p>
          <button
            v-if="selectedCategory !== '全部' || selectedTags.length > 0 || searchQuery"
            @click="clearFilters(); searchQuery = ''"
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
</style>
