import { ref, computed } from 'vue'
import { useSpacedRepetition } from './useSpacedRepetition'

const STORAGE_KEY = 'skill-book-skill-status'

const VALID_STATUSES = ['todo', 'learning', 'mastered']

// Singleton state
const statuses = ref({})

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) statuses.value = JSON.parse(raw)
  } catch {
    statuses.value = {}
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses.value))
}

// Initialize on first import
loadFromStorage()

export function useSkillStatus() {
  const getStatus = (slug) => {
    return statuses.value[slug] || null
  }

  const setStatus = (slug, status) => {
    if (status === null || status === undefined) {
      // Clear the status - don't trigger any review plan changes
      const updated = { ...statuses.value }
      delete updated[slug]
      statuses.value = updated
      saveToStorage()
      return
    }
    if (!VALID_STATUSES.includes(status)) return
    statuses.value = { ...statuses.value, [slug]: status }
    saveToStorage()

    // Integrate with spaced repetition
    const { createReviewPlan, removePlan } = useSpacedRepetition()
    if (status === 'learning') {
      createReviewPlan(slug)
    } else if (status === 'mastered') {
      removePlan(slug)
    }
  }

  const clearStatus = (slug) => {
    const updated = { ...statuses.value }
    delete updated[slug]
    statuses.value = updated
    saveToStorage()
  }

  const statusStats = computed(() => {
    const counts = { todo: 0, learning: 0, mastered: 0 }
    for (const status of Object.values(statuses.value)) {
      if (counts[status] !== undefined) counts[status]++
    }
    return counts
  })

  return {
    statuses,
    getStatus,
    setStatus,
    clearStatus,
    statusStats
  }
}