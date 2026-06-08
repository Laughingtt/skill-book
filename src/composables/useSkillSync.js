import { ref } from 'vue'

const STORAGE_KEYS = {
  skills: 'skill-book-skills',
  bookmarks: 'skill-book-bookmarks',
  statuses: 'skill-book-skill-status',
  notes: 'skill-book-skill-notes',
  usageStats: 'skill-book-usage-stats',
  reviewSchedule: 'skill-book-review-schedule',
}

const syncing = ref(false)
const lastSyncAt = ref(null)
const syncError = ref(null)

export function useSkillSync() {
  function exportData() {
    const data = { version: 1, exportedAt: new Date().toISOString() }
    for (const [key, storageKey] of Object.entries(STORAGE_KEYS)) {
      try {
        const raw = localStorage.getItem(storageKey)
        data[key] = raw ? JSON.parse(raw) : (storageKey.includes('skills') || storageKey.includes('bookmarks') ? [] : {})
      } catch {
        data[key] = storageKey.includes('skills') || storageKey.includes('bookmarks') ? [] : {}
      }
    }
    return JSON.stringify(data, null, 2)
  }

  function importData(jsonString) {
    let data
    try {
      data = JSON.parse(jsonString)
    } catch {
      syncError.value = '无效的 JSON 格式'
      return { added: 0, skipped: 0, error: '无效的 JSON 格式' }
    }

    let added = 0
    let skipped = 0

    if (data.skills && Array.isArray(data.skills)) {
      const existingRaw = localStorage.getItem(STORAGE_KEYS.skills)
      const existing = existingRaw ? JSON.parse(existingRaw) : []
      const slugMap = new Map(existing.map(s => [s.slug, s]))

      for (const imported of data.skills) {
        if (slugMap.has(imported.slug)) {
          skipped++
        } else {
          slugMap.set(imported.slug, imported)
          added++
        }
      }
      localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify([...slugMap.values()]))
    }

    // Merge bookmarks (union)
    if (data.bookmarks && Array.isArray(data.bookmarks)) {
      const existingBm = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookmarks) || '[]')
      const merged = [...new Set([...existingBm, ...data.bookmarks])]
      localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(merged))
    }

    // Merge statuses (imported as base, existing overrides)
    if (data.statuses) {
      const existingSt = JSON.parse(localStorage.getItem(STORAGE_KEYS.statuses) || '{}')
      const merged = { ...data.statuses, ...existingSt }
      localStorage.setItem(STORAGE_KEYS.statuses, JSON.stringify(merged))
    }

    // Merge notes (existing overrides)
    if (data.notes) {
      const existingNt = JSON.parse(localStorage.getItem(STORAGE_KEYS.notes) || '{}')
      const merged = { ...data.notes, ...existingNt }
      localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(merged))
    }

    // Merge usage stats (existing overrides)
    if (data.usageStats) {
      const existingUs = JSON.parse(localStorage.getItem(STORAGE_KEYS.usageStats) || '{}')
      const merged = { ...data.usageStats, ...existingUs }
      localStorage.setItem(STORAGE_KEYS.usageStats, JSON.stringify(merged))
    }

    // Merge review schedule (existing overrides)
    if (data.reviewSchedule) {
      const existingRs = JSON.parse(localStorage.getItem(STORAGE_KEYS.reviewSchedule) || '{}')
      const merged = { ...data.reviewSchedule, ...existingRs }
      localStorage.setItem(STORAGE_KEYS.reviewSchedule, JSON.stringify(merged))
    }

    lastSyncAt.value = new Date().toISOString()
    syncing.value = false
    syncError.value = null
    return { added, skipped }
  }

  // ── V2: 上游远程同步 ──

  async function checkUpstreamUpdates() {
    syncing.value = true
    syncError.value = null
    try {
      const res = await fetch('/api/skills/sync/check', { method: 'POST' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || err.error || `HTTP ${res.status}`)
      }
      const data = await res.json()
      lastSyncAt.value = new Date().toISOString()
      return data
    } catch (e) {
      syncError.value = e.message
      // API not available (production) — return graceful fallback
      return { ok: false, output: 'Sync API 仅在开发模式下可用。生产环境请运行: node scripts/sync-upstream.js --fetch' }
    } finally {
      syncing.value = false
    }
  }

  async function pullFromUpstream() {
    syncing.value = true
    syncError.value = null
    try {
      const res = await fetch('/api/skills/sync', { method: 'POST' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || err.error || `HTTP ${res.status}`)
      }
      const data = await res.json()
      lastSyncAt.value = new Date().toISOString()
      return data
    } catch (e) {
      syncError.value = e.message
      return { ok: false, error: e.message }
    } finally {
      syncing.value = false
    }
  }

  return {
    syncing,
    lastSyncAt,
    syncError,
    exportData,
    importData,
    checkUpstreamUpdates,
    pullFromUpstream,
  }
}
