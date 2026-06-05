<script setup>
import GlobalNav from './components/GlobalNav.vue'
import FooterBar from './components/FooterBar.vue'
import CommandPalette from './components/CommandPalette.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#faf9f6]">
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
