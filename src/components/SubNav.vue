<script setup>
import SearchBar from './SearchBar.vue'
import ThemeToggle from './ThemeToggle.vue'

defineProps({
  query: { type: String, default: '' },
})

const emit = defineEmits(['update:query', 'go-home'])
</script>

<template>
  <div class="sub-nav">
    <a class="sub-nav-title" @click.prevent="emit('go-home')">
      Skill Book
    </a>
    <div class="sub-nav-search">
      <SearchBar
        :model-value="query"
        @update:model-value="emit('update:query', $event)"
        @clear-and-home="emit('go-home')"
      />
    </div>
    <div class="subnav-actions">
      <ThemeToggle />
      <router-link :to="{ name: 'my-space' }" class="subnav-my-link" title="我的空间">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.sub-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: var(--color-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--color-border);
}

.sub-nav-title {
  font-family: 'Crimson Pro', serif;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.sub-nav-title:hover {
  opacity: 0.7;
}

.sub-nav-search {
  margin-left: auto;
}

.subnav-actions {
  margin-left: 12px;
  display: flex;
  align-items: center;
}

.subnav-my-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: var(--color-text-secondary);
  transition: all 0.15s ease;
}

.subnav-my-link:hover {
  background: var(--color-bg-accent);
  color: var(--color-accent);
}
</style>