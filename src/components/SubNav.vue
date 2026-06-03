<script setup>
import SearchBar from './SearchBar.vue'

defineProps({
  searchQuery: { type: String, default: '' },
})

const emit = defineEmits(['update:searchQuery'])
</script>

<template>
  <div class="sub-nav">
    <h1 class="sub-nav-title">
      Skill Book
    </h1>
    <div class="sub-nav-search">
      <SearchBar
        :model-value="searchQuery"
        @update:model-value="emit('update:searchQuery', $event)"
      />
    </div>
    <div class="subnav-actions">
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
  background: rgba(250, 249, 246, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.sub-nav-title {
  font-family: 'Crimson Pro', serif;
  font-size: 24px;
  font-weight: 600;
  color: #0a0a0a;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1;
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
  color: #6b6560;
  transition: all 0.15s ease;
}

.subnav-my-link:hover {
  background: rgba(196, 85, 58, 0.08);
  color: #c4553a;
}
</style>
