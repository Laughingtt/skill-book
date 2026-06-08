<script setup>
import { computed } from 'vue'
import { useSkillSync } from '../composables/useSkillSync'

const { lastSyncAt } = useSkillSync()

const syncLabel = computed(() => {
  if (!lastSyncAt.value) return ''
  const daysAgo = (Date.now() - new Date(lastSyncAt.value).getTime()) / (24 * 60 * 60 * 1000)
  if (daysAgo > 7) return 'sync-stale'
  return 'sync-fresh'
})
</script>

<template>
  <nav class="global-nav">
    <router-link to="/" class="nav-title">
      SKILL BOOK
    </router-link>
    <div class="nav-accent">
      <span class="accent-dot" />
      <span v-if="syncLabel" class="sync-dot" :class="syncLabel" :title="syncLabel === 'sync-fresh' ? '数据已同步' : '同步数据已过期'"></span>
    </div>
  </nav>
</template>

<style scoped>
.global-nav {
  height: 48px;
  background: var(--color-bg-dark);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--color-border);
}

.nav-title {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: var(--color-text-inverse);
  opacity: 0.7;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.nav-title:hover {
  opacity: 1;
}

.nav-accent {
  display: flex;
  align-items: center;
  gap: 6px;
}

.accent-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-accent);
  opacity: 0.6;
}

.sync-dot {
  display: inline-block; width: 6px; height: 6px; border-radius: 50%;
}
.sync-fresh { background: var(--color-success, #4caf7d); }
.sync-stale { background: var(--color-warning, #e5a84b); }
</style>
