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
