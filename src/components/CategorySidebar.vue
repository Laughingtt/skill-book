<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
  selected: { type: String, default: '全部' },
})

const emit = defineEmits(['select'])
</script>

<template>
  <aside class="category-sidebar">
    <div class="section-header">
      <span class="section-label">分类</span>
      <div class="section-rule"></div>
    </div>
    <ul class="category-list">
      <li
        v-for="cat in categories"
        :key="cat"
        @click="emit('select', cat)"
        :class="['category-item', { 'category-item--active': selected === cat }]"
      >
        {{ cat }}
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.category-sidebar {
  width: 220px;
  flex-shrink: 0;
}

.section-header {
  margin-bottom: 16px;
}

.section-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #6b6560;
}

.section-rule {
  width: 12px;
  height: 1px;
  background-color: #6b6560;
  margin-top: 8px;
}

.category-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.category-item {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #0a0a0a;
  padding: 8px 0 8px 12px;
  margin-bottom: 10px;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

.category-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.category-item--active {
  font-weight: 500;
  border-left-color: #c4553a;
  padding-left: 16px;
}
</style>
