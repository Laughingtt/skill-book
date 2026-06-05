<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'clear-and-home'])

const hasValue = computed(() => props.modelValue && props.modelValue.length > 0)

function onInput(e) {
  emit('update:modelValue', e.target.value)
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    clearAndHome()
  }
  if (e.key === 'Enter' && !props.modelValue.trim()) {
    // 搜索框已清空时按回车 → 返回全部列表
    e.preventDefault()
    clearAndHome()
  }
}

function clear() {
  emit('update:modelValue', '')
  emit('clear-and-home')
}

function clearAndHome() {
  emit('update:modelValue', '')
  emit('clear-and-home')
}
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
      @input="onInput"
      @keydown="onKeydown"
      placeholder="搜索技能..."
      class="search-input"
    />
    <button v-if="hasValue" class="search-clear" @click="clear" title="清除搜索">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
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
  color: var(--color-text-secondary);
  pointer-events: none;
  transition: color 0.3s ease;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 32px 0 36px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: var(--color-text-primary);
  background: var(--color-bg-recessed);
  border: 1px solid transparent;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: var(--color-text-secondary);
  opacity: 0.7;
}

.search-input:hover {
  background: var(--color-bg-accent);
}

.search-input:focus {
  border-color: var(--color-accent);
  background: var(--color-bg);
  box-shadow: 0 0 0 3px var(--color-accent-muted);
}

.search-wrapper:focus-within .search-icon {
  color: var(--color-accent);
}

.search-clear {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-accent);
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  border-radius: 50%;
  transition: all 0.15s ease;
}

.search-clear svg {
  width: 12px;
  height: 12px;
}

.search-clear:hover {
  color: var(--color-accent);
  background: var(--color-accent-muted);
}
</style>