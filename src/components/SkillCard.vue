<script setup>
import { useRouter } from 'vue-router'
import { useBookmarks } from '../composables/useBookmarks'
import { useSkillStatus } from '../composables/useSkillStatus'

defineProps({
  skill: { type: Object, required: true },
})

const router = useRouter()
const { isBookmarked, toggleBookmark } = useBookmarks()
const { getStatus } = useSkillStatus()

function navigateTo(slug) {
  router.push({ name: 'skill-detail', params: { slug } })
}

function onBookmarkClick(e, slug) {
  e.stopPropagation()
  toggleBookmark(slug)
}

const statusLabel = { todo: '待尝试', learning: '学习中', mastered: '已掌握' }
</script>

<template>
  <div class="skill-card" @click="navigateTo(skill.slug)">
    <button
      class="skill-card__bookmark"
      :class="{ 'skill-card__bookmark--active': isBookmarked(skill.slug).value }"
      @click="onBookmarkClick($event, skill.slug)"
      :aria-label="isBookmarked(skill.slug).value ? '取消收藏' : '收藏'"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
    <div class="skill-card__header-row">
      <span class="skill-card__category">{{ skill.category }}</span>
      <span v-if="getStatus(skill.slug)" class="skill-card__status" :class="`skill-card__status--${getStatus(skill.slug)}`">
        {{ statusLabel[getStatus(skill.slug)] }}
      </span>
    </div>
    <h3 class="skill-card__name">{{ skill.name }}</h3>
    <p class="skill-card__description">{{ skill.description }}</p>
    <span class="skill-card__tags">{{ (skill.tags || []).join(' · ') }}</span>
  </div>
</template>

<style scoped>
.skill-card {
  position: relative;
  background: var(--color-bg-elevated);
  border: none;
  border-bottom: 1px solid var(--color-border);
  border-radius: 0;
  padding: 28px 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.skill-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.skill-card:active {
  transform: scale(0.98);
  box-shadow: none;
}

.skill-card__header-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.skill-card__category {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-accent);
}

.skill-card__name {
  font-family: 'Crimson Pro', serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin: 0 0 8px;
}

.skill-card__description {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.skill-card__tags {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.skill-card__bookmark {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-tertiary);
  transition: color 0.2s ease, transform 0.2s ease;
}

.skill-card__bookmark svg {
  width: 18px;
  height: 18px;
}

.skill-card__bookmark:hover {
  color: var(--color-accent);
  transform: scale(1.1);
}

.skill-card__bookmark--active {
  color: var(--color-accent);
}

.skill-card__bookmark--active svg {
  fill: var(--color-accent);
  stroke: var(--color-accent);
}

.skill-card__status {
  font-family: 'DM Sans', sans-serif;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 2px 8px;
  border-radius: 4px;
  color: var(--color-text-inverse);
  white-space: nowrap;
  flex-shrink: 0;
}

.skill-card__status--todo {
  background: var(--color-warning, #e5a84b);
}

.skill-card__status--learning {
  background: var(--color-info, #5b8dd9);
}

.skill-card__status--mastered {
  background: var(--color-success, #4caf7d);
}
</style>
