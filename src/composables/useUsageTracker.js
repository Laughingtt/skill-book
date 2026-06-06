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
    getViewCount,
    getLastViewed,
    recentlyViewed,
    getStaleLearning,
    clearStats
  }
}