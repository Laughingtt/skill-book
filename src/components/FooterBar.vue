<script setup>
import DataPanel from './DataPanel.vue'
</script>

<template>
  <footer class="bg-[#0a0a0a] border-t border-[rgba(255,255,255,0.06)] py-8 px-[22px]">
    <div class="max-w-[980px] mx-auto flex items-center justify-between">
      <span
        class="font-['DM_Sans'] text-[11px] tracking-[0.15em] text-[rgba(255,255,255,0.4)]"
      >
        Skill Book
      </span>
      <span
        class="font-['DM_Sans'] text-[11px] tracking-[0.15em] text-[rgba(255,255,255,0.25)]"
      >
        技能知识库
      </span>
      <DataPanel />
    </div>
  </footer>
</template>
