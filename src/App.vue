<script setup>
import { watch, onMounted } from 'vue'
import GlobalNav from './components/GlobalNav.vue'
import FooterBar from './components/FooterBar.vue'
import CommandPalette from './components/CommandPalette.vue'
import { useSettings } from './composables/useSettings'

const { effectiveTheme } = useSettings()

function applyTheme() {
  document.documentElement.setAttribute('data-theme', effectiveTheme.value)
}

onMounted(applyTheme)
watch(effectiveTheme, applyTheme)
</script>

<template>
  <div class="min-h-screen flex flex-col" style="background: var(--color-bg);">
    <GlobalNav />
    <div class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <FooterBar />
    <CommandPalette />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
