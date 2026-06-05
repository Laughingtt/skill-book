<script setup>
import DataPanel from './DataPanel.vue'
</script>

<template>
  <footer style="background: var(--color-bg-dark); border-top: 1px solid var(--color-border);" class="py-8 px-[22px]">
    <div class="max-w-[980px] mx-auto flex items-center justify-between">
      <span
        class="font-['DM_Sans'] text-[11px] tracking-[0.15em]"
        style="color: var(--color-text-inverse); opacity: 0.4;"
      >
        Skill Book
      </span>
      <span
        class="font-['DM_Sans'] text-[11px] tracking-[0.15em]"
        style="color: var(--color-text-inverse); opacity: 0.25;"
      >
        技能知识库
      </span>
      <DataPanel />
    </div>
  </footer>
</template>
