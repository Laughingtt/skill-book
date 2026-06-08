import { ref, computed } from 'vue'

const STORAGE_KEY = 'skill-book-usage-stats'

// Singleton state
const stats = ref({})

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) stats.value = JSON.parse(raw)
  } catch {
    stats.value = {}
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats.value))
}

// Initialize on first import
loadFromStorage()

export function useUsageTracker() {
  const trackView = (slug) => {
    const current = stats.value[slug] || { views: 0, lastViewedAt: null }
    stats.value = {
      ...stats.value,
      [slug]: {
        views: current.views + 1,
        lastViewedAt: new Date().toISOString()
      }
    }
    saveToStorage()
  }

  // ── V2: 丰富上下文的使用追踪 ──
  const trackUsage = (slug, context = {}) => {
    const current = stats.value[slug] || { views: 0, lastViewedAt: null, usageLog: [] }
    const usageEntry = {
      at: new Date().toISOString(),
      scenario: context.scenario || '',
      project: context.project || '',
      duration: context.duration || 0,
      outcome: context.outcome || '',
      notes: context.notes || '',
    }
    const usageLog = [...(current.usageLog || []), usageEntry].slice(-50)
    stats.value = {
      ...stats.value,
      [slug]: {
        ...current,
        views: current.views + 1,
        lastViewedAt: new Date().toISOString(),
        usageLog,
        lastScenario: context.scenario || current.lastScenario || '',
        lastProject: context.project || current.lastProject || '',
        totalDuration: (current.totalDuration || 0) + (context.duration || 0),
      }
    }
    saveToStorage()
  }

  const getUsageFrequency = (slug) => {
    const s = stats.value[slug]
    if (!s || !s.usageLog) return 0
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    return s.usageLog.filter(e => new Date(e.at).getTime() > thirtyDaysAgo).length
  }

  const getTopScenarios = (slug) => {
    const s = stats.value[slug]
    if (!s || !s.usageLog) return []
    const counts = {}
    s.usageLog.forEach(e => {
      if (e.scenario) counts[e.scenario] = (counts[e.scenario] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([s]) => s)
  }

  const getViewCount = (slug) => {
    return stats.value[slug]?.views || 0
  }

  const getLastViewed = (slug) => {
    return stats.value[slug]?.lastViewedAt || null
  }

  // Top 5 recently viewed slugs (sorted by lastViewedAt desc)
  const recentlyViewed = computed(() => {
    return Object.entries(stats.value)
      .filter(([, s]) => s.lastViewedAt)
      .sort(([, a], [, b]) => new Date(b.lastViewedAt) - new Date(a.lastViewedAt))
      .slice(0, 5)
      .map(([slug, s]) => ({ slug, ...s }))
  })

  // Skills marked 'learning' that haven't been viewed in 7+ days
  // Note: needs useSkillStatus data, so we accept it as a parameter
  const getStaleLearning = (skillStatuses) => {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const stale = []
    for (const [slug, status] of Object.entries(skillStatuses)) {
      if (status !== 'learning') continue
      const s = stats.value[slug]
      if (!s || !s.lastViewedAt) {
        // Never viewed but marked learning — counts as stale
        stale.push({ slug, views: s?.views || 0, lastViewedAt: null })
        continue
      }
      if (new Date(s.lastViewedAt) < sevenDaysAgo) {
        stale.push({ slug, ...s })
      }
    }
    return stale
  }

  const clearStats = (slug) => {
    const updated = { ...stats.value }
    delete updated[slug]
    stats.value = updated
    saveToStorage()
  }

  return {
    stats,
    trackView,
    trackUsage,
    getUsageFrequency,
    getTopScenarios,
    getViewCount,
    getLastViewed,
    recentlyViewed,
    getStaleLearning,
    clearStats
  }
}