<script setup>
import { useSettings } from '../composables/useSettings'

const { theme, setTheme } = useSettings()

const options = [
  { value: 'light', label: '☀️', title: '浅色' },
  { value: 'system', label: '💻', title: '跟随系统' },
  { value: 'dark', label: '🌙', title: '深色' },
]
</script>

<template>
  <div class="theme-toggle">
    <button
      v-for="opt in options"
      :key="opt.value"
      :class="['theme-toggle__btn', { 'theme-toggle__btn--active': theme === opt.value }]"
      :title="opt.title"
      @click="setTheme(opt.value)"
    >{{ opt.label }}</button>
  </div>
</template>

<style scoped>
.theme-toggle {
  display: flex;
  gap: 2px;
  background: var(--color-bg-recessed);
  border-radius: var(--radius-md);
  padding: 2px;
}

.theme-toggle__btn {
  font-size: 14px;
  line-height: 1;
  padding: 4px 8px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
  transition: background 150ms ease;
}

.theme-toggle__btn--active {
  background: var(--color-bg-elevated);
  box-shadow: var(--shadow-sm);
}
</style>
