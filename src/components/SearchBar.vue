<script setup>
defineProps({
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="search-wrapper">
    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="7" stroke-width="1.5" />
      <path d="M16 16l4.5 4.5" stroke-width="1.5" stroke-linecap="round" />
    </svg>
    <input
      type="text"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      placeholder="搜索技能..."
      class="search-input"
    />
  </div>
</template>

<style scoped>
.search-wrapper {
  position: relative;
  width: 280px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  color: #6b6560;
  pointer-events: none;
  transition: color 0.3s ease;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 14px 0 36px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #0a0a0a;
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid transparent;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #6b6560;
  opacity: 0.7;
}

.search-input:hover {
  background: rgba(0, 0, 0, 0.06);
}

.search-input:focus {
  border-color: #c4553a;
  background: rgba(250, 249, 246, 0.9);
  box-shadow: 0 0 0 3px rgba(196, 85, 58, 0.08);
}

.search-input:focus + .search-icon,
.search-wrapper:focus-within .search-icon {
  color: #c4553a;
}
</style>
