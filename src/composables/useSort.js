import { ref } from 'vue'
import { useUsageTracker } from './useUsageTracker'
import { useSkillStatus } from './useSkillStatus'

const STORAGE_KEY = 'skill-book-sort-mode'

// Singleton state
const sortMode = ref(loadSortMode())

function loadSortMode() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return raw
  } catch {}
  return 'default'
}

function saveSortMode(mode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {}
}

export function useSort() {
  const setSortMode = (mode) => {
    sortMode.value = mode
    saveSortMode(mode)
  }

  const sorted = (skills) => {
    if (!skills || skills.length === 0) return skills
    const mode = sortMode.value

    // Create a copy to avoid mutating the original
    const result = [...skills]

    switch (mode) {
      case 'name-asc':
        return result.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'zh-CN'))
      case 'name-desc':
        return result.sort((a, b) => (b.name || '').localeCompare(a.name || '', 'zh-CN'))
      case 'views-desc':
      case 'views-asc': {
        const { getViewCount } = useUsageTracker()
        const multiplier = mode === 'views-desc' ? -1 : 1
        return result.sort((a, b) => multiplier * (getViewCount(a.slug) - getViewCount(b.slug)))
      }
      case 'recent-desc':
      case 'recent-asc': {
        const { getLastViewed } = useUsageTracker()
        const multiplier = mode === 'recent-desc' ? -1 : 1
        return result.sort((a, b) => {
          const aTime = getLastViewed(a.slug) ? new Date(getLastViewed(a.slug)).getTime() : 0
          const bTime = getLastViewed(b.slug) ? new Date(getLastViewed(b.slug)).getTime() : 0
          return multiplier * (aTime - bTime)
        })
      }
      case 'status': {
        const { getStatus } = useSkillStatus()
        const statusOrder = { mastered: 0, learning: 1, todo: 2 }
        return result.sort((a, b) => {
          const aStatus = getStatus(a.slug)
          const bStatus = getStatus(b.slug)
          const aOrder = aStatus ? statusOrder[aStatus] ?? 3 : 3
          const bOrder = bStatus ? statusOrder[bStatus] ?? 3 : 3
          return aOrder - bOrder
        })
      }
      default:
        return result
    }
  }

  return {
    sortMode,
    setSortMode,
    sorted
  }
}
