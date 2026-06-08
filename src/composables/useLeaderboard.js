import { ref, computed } from 'vue'

const CACHE_KEY = 'skill-book-leaderboard-cache'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export function parseInstalls(val) {
  if (!val || typeof val !== 'string') return 0
  const num = parseFloat(val)
  if (isNaN(num)) return 0
  if (val.endsWith('B')) return num * 1e9
  if (val.endsWith('M')) return num * 1e6
  if (val.endsWith('K')) return num * 1e3
  return num
}

// Singleton state
const skills = ref([])
const loading = ref(false)
const error = ref(null)
const lastUpdated = ref(null)

export function useLeaderboard() {
  function loadFromCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (!raw) return false
      const cached = JSON.parse(raw)
      if (Date.now() - cached.timestamp > CACHE_TTL) return false
      skills.value = cached.skills || []
      lastUpdated.value = cached.timestamp
      return true
    } catch { return false }
  }

  function saveToCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        skills: data,
        timestamp: Date.now(),
      }))
    } catch {}
  }

  async function fetchLeaderboard() {
    if (loadFromCache()) return

    loading.value = true
    error.value = null

    try {
      const res = await fetch('/api/skills/leaderboard')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      skills.value = data.skills || []
      lastUpdated.value = data.updatedAt || new Date().toISOString()
      saveToCache(data.skills || [])
    } catch (e) {
      error.value = e.message
      // Try stale cache on error
      try {
        const raw = localStorage.getItem(CACHE_KEY)
        if (raw) {
          const cached = JSON.parse(raw)
          skills.value = cached.skills || []
          lastUpdated.value = cached.timestamp
        }
      } catch {}
    } finally {
      loading.value = false
    }
  }

  const hotSkills = computed(() => {
    return [...skills.value]
      .sort((a, b) => parseInstalls(b.installs) - parseInstalls(a.installs))
      .slice(0, 20)
  })

  return {
    skills,
    hotSkills,
    loading,
    error,
    lastUpdated,
    fetchLeaderboard,
    parseInstalls,
  }
}
