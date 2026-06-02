<script setup>
defineProps({
  tags: { type: Array, default: () => [] },
  selectedTags: { type: Array, default: () => [] },
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <div class="tag-cloud">
    <div class="section-header">
      <span class="section-label">标签</span>
      <div class="section-rule"></div>
    </div>
    <div class="tag-list">
      <span
        v-for="tag in tags"
        :key="tag"
        @click="emit('toggle', tag)"
        :class="['tag-item', { 'tag-item--active': selectedTags.includes(tag) }]"
      >
        <span v-if="selectedTags.includes(tag)" class="tag-dot">&bull;</span>
        <span class="tag-hash">#</span>{{ tag }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.tag-cloud {
  margin-top: 40px;
}

.section-header {
  margin-bottom: 14px;
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

.tag-list {
  display: flex;
  flex-wrap: wrap;
  row-gap: 8px;
  column-gap: 6px;
}

.tag-item {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #6b6560;
  cursor: pointer;
  transition: color 0.2s ease, text-decoration 0.2s ease;
  white-space: nowrap;
}

.tag-item:hover {
  color: #c4553a;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 0.5px;
}

.tag-item--active {
  color: #c4553a;
  font-weight: 500;
  text-decoration: none;
}

.tag-item--active:hover {
  text-decoration: underline;
}

.tag-dot {
  margin-right: 2px;
  font-size: 10px;
}

.tag-hash {
  /* Part of the tag text, no extra styling */
}
</style>
