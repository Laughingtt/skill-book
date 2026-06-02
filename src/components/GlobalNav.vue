<script setup>
</script>

<template>
  <nav class="global-nav">
    <router-link to="/" class="nav-title">
      SKILL BOOK
    </router-link>
    <div class="nav-accent">
      <span class="accent-dot" />
    </div>
  </nav>
</template>

<style scoped>
.global-nav {
  height: 48px;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.nav-title {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.nav-title:hover {
  opacity: 1;
}

.nav-accent {
  display: flex;
  align-items: center;
  gap: 6px;
}

.accent-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #c4553a;
  opacity: 0.6;
}
</style>
