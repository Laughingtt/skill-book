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
</style>
