<script setup>
import { ref } from 'vue'
import { useBookmarks } from '../composables/useBookmarks'
import { useSkillStatus } from '../composables/useSkillStatus'
import { useSkillNotes } from '../composables/useSkillNotes'
import { useUsageTracker } from '../composables/useUsageTracker'

const showPanel = ref(false)

function exportData() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    bookmarks: JSON.parse(localStorage.getItem('skill-book-bookmarks') || '[]'),
    skillStatus: JSON.parse(localStorage.getItem('skill-book-skill-status') || '{}'),
    skillNotes: JSON.parse(localStorage.getItem('skill-book-skill-notes') || '{}'),
    usageStats: JSON.parse(localStorage.getItem('skill-book-usage-stats') || '{}'),
    userSkills: JSON.parse(localStorage.getItem('skill-book-skills') || '[]'),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `skill-book-backup-${new Date().toISOString().slice(0,10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importData(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      if (data.version !== 1) {
        alert('不支持的备份格式')
        return
      }
      // Merge: don't overwrite existing data, add new entries
      if (data.bookmarks?.length) {
        const existing = JSON.parse(localStorage.getItem('skill-book-bookmarks') || '[]')
        const merged = [...new Set([...existing, ...data.bookmarks])]
        localStorage.setItem('skill-book-bookmarks', JSON.stringify(merged))
      }
      if (data.skillStatus && Object.keys(data.skillStatus).length) {
        const existing = JSON.parse(localStorage.getItem('skill-book-skill-status') || '{}')
        localStorage.setItem('skill-book-skill-status', JSON.stringify({ ...data.skillStatus, ...existing }))
      }
      if (data.skillNotes && Object.keys(data.skillNotes).length) {
        const existing = JSON.parse(localStorage.getItem('skill-book-skill-notes') || '{}')
        localStorage.setItem('skill-book-skill-notes', JSON.stringify({ ...data.skillNotes, ...existing }))
      }
      alert('导入成功！刷新页面查看更新。')
      location.reload()
    } catch {
      alert('导入失败：文件格式错误')
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="data-panel">
    <button @click="showPanel = !showPanel" class="data-panel__toggle">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      数据管理
    </button>
    <div v-if="showPanel" class="data-panel__content">
      <button @click="exportData" class="data-panel__btn data-panel__btn--export">
        导出备份
      </button>
      <label class="data-panel__btn data-panel__btn--import">
        导入备份
        <input type="file" accept=".json" @change="importData" style="display:none" />
      </label>
    </div>
  </div>
</template>

<style scoped>
.data-panel {
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
}

.data-panel__toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: #8a8a87;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.data-panel__toggle:hover {
  color: #c4553a;
}

.data-panel__content {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.data-panel__btn {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  background: transparent;
  color: #6b6560;
}

.data-panel__btn:hover {
  border-color: #c4553a;
  color: #c4553a;
}

.data-panel__btn--import {
  cursor: pointer;
}
</style>
