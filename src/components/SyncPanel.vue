<script setup>
import { ref } from 'vue'
import { useSkillSync } from '../composables/useSkillSync'

const emit = defineEmits(['close'])
const { syncing, lastSyncAt, syncError, exportData, importData } = useSkillSync()
const activeTab = ref('export')
const importText = ref('')
const importResult = ref(null)
const copyDone = ref(false)

function handleExport() {
  const blob = exportData()
  const url = URL.createObjectURL(new Blob([blob], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `skill-book-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

async function handleCopy() {
  const blob = exportData()
  try {
    await navigator.clipboard.writeText(blob)
    copyDone.value = true
    setTimeout(() => { copyDone.value = false }, 2000)
  } catch { /* clipboard not available */ }
}

function handleImport() {
  importResult.value = importData(importText.value)
}
</script>

<template>
  <div class="sync-panel-overlay" @click.self="emit('close')">
    <div class="sync-panel">
      <div class="sync-panel__header">
        <h3 class="sync-panel__title">数据同步</h3>
        <button class="sync-panel__close" @click="emit('close')">&times;</button>
      </div>

      <div class="sync-panel__tabs">
        <button :class="['sync-tab', activeTab === 'export' && 'sync-tab--active']" @click="activeTab = 'export'">导出</button>
        <button :class="['sync-tab', activeTab === 'import' && 'sync-tab--active']" @click="activeTab = 'import'">导入</button>
      </div>

      <div v-if="activeTab === 'export'" class="sync-panel__body">
        <p class="sync-desc">导出所有数据（Skill、书签、学习状态、笔记、使用记录）为 JSON 文件。</p>
        <div class="sync-actions">
          <button class="btn btn-accent" @click="handleExport">下载 JSON</button>
          <button class="btn btn-ghost" @click="handleCopy">
            {{ copyDone ? '✓ 已复制' : '复制到剪贴板' }}
          </button>
        </div>
        <p v-if="lastSyncAt" class="sync-meta">上次同步: {{ new Date(lastSyncAt).toLocaleString('zh-CN') }}</p>
      </div>

      <div v-if="activeTab === 'import'" class="sync-panel__body">
        <p class="sync-desc">粘贴之前导出的 JSON 数据。已有数据不会被覆盖。</p>
        <textarea
          v-model="importText"
          class="sync-textarea"
          placeholder="粘贴 JSON 数据..."
          rows="6"
        ></textarea>
        <button class="btn btn-accent" @click="handleImport" :disabled="!importText.trim()">导入</button>
        <p v-if="importResult" class="sync-result">
          导入完成: {{ importResult.added }} 项新增, {{ importResult.skipped }} 项跳过
        </p>
        <p v-if="syncError" class="sync-error">{{ syncError }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sync-panel-overlay {
  position: fixed; inset: 0; z-index: var(--z-modal, 1000);
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
}
.sync-panel {
  background: var(--color-bg-elevated); border-radius: 14px;
  padding: 24px 28px; max-width: 420px; width: 90%;
  box-shadow: var(--shadow-xl);
}
.sync-panel__header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.sync-panel__title {
  font-family: 'Crimson Pro', serif; font-size: 20px; font-weight: 600;
  color: var(--color-text-primary); margin: 0;
}
.sync-panel__close {
  background: none; border: none; font-size: 20px;
  color: var(--color-text-tertiary); cursor: pointer;
  padding: 0; line-height: 1;
}
.sync-panel__tabs { display: flex; gap: 4px; margin-bottom: 16px; }
.sync-tab {
  font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
  padding: 4px 12px; border-radius: 6px; border: 1px solid var(--color-border);
  background: transparent; color: var(--color-text-secondary); cursor: pointer;
  transition: all 0.15s ease;
}
.sync-tab--active { background: var(--color-accent); color: var(--color-text-inverse); border-color: var(--color-accent); }
.sync-panel__body { display: flex; flex-direction: column; gap: 12px; }
.sync-desc { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--color-text-secondary); margin: 0; line-height: 1.5; }
.sync-actions { display: flex; gap: 8px; }
.sync-meta { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--color-text-tertiary); }
.sync-textarea {
  width: 100%; font-family: 'DM Mono', Menlo, monospace; font-size: 12px;
  padding: 10px 12px; border: 1px solid var(--color-border-strong);
  border-radius: 8px; background: var(--color-bg-recessed);
  color: var(--color-text-primary); resize: vertical; outline: none;
  box-sizing: border-box;
}
.sync-textarea:focus { border-color: var(--color-accent); }
.sync-result { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--color-success, #4caf7d); }
.sync-error { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--color-accent); }
</style>
