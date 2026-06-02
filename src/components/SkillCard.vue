<script setup>
import { useRouter } from 'vue-router'

defineProps({
  skill: { type: Object, required: true },
})

const router = useRouter()

function navigateTo(slug) {
  router.push({ name: 'skill-detail', params: { slug } })
}
</script>

<template>
  <div class="skill-card" @click="navigateTo(skill.slug)">
    <span class="skill-card__category">{{ skill.category }}</span>
    <h3 class="skill-card__name">{{ skill.name }}</h3>
    <p class="skill-card__description">{{ skill.description }}</p>
    <span class="skill-card__tags">{{ (skill.tags || []).join(' · ') }}</span>
  </div>
</template>

<style scoped>
.skill-card {
  background: #ffffff;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0;
  padding: 28px 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.skill-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.skill-card:active {
  transform: scale(0.98);
  box-shadow: none;
}

.skill-card__category {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #c4553a;
  margin-bottom: 16px;
}

.skill-card__name {
  font-family: 'Crimson Pro', serif;
  font-size: 22px;
  font-weight: 600;
  color: #0a0a0a;
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin: 0 0 8px;
}

.skill-card__description {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: #6b6560;
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
  color: #6b6560;
}
</style>
