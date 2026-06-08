<script setup>
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
