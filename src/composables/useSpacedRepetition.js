import { ref, computed } from 'vue'

const STORAGE_KEY = 'skill-book-review-schedule'

const INTERVALS = [1, 3, 7, 14, 30]

// Singleton state
const reviewSchedule = ref({})

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) reviewSchedule.value = JSON.parse(raw)
  } catch {
    reviewSchedule.value = {}
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewSchedule.value))
}

// Initialize on first import
loadFromStorage()

export function useSpacedRepetition() {
  const createReviewPlan = (slug) => {
    if (reviewSchedule.value[slug]) return
    const now = Date.now()
    reviewSchedule.value = {
      ...reviewSchedule.value,
      [slug]: {
        nextReviewAt: now + INTERVALS[0] * 24 * 60 * 60 * 1000,
        interval: INTERVALS[0],
        reviewCount: 0,
        lastReviewedAt: null
      }
    }
    persist()
  }

  const markReviewed = (slug) => {
    const plan = reviewSchedule.value[slug]
    if (!plan) return
    const now = Date.now()
    const currentIdx = INTERVALS.indexOf(plan.interval)
    const nextInterval = currentIdx < INTERVALS.length - 1 ? INTERVALS[currentIdx + 1] : INTERVALS[INTERVALS.length - 1]
    reviewSchedule.value = {
      ...reviewSchedule.value,
      [slug]: {
        nextReviewAt: now + nextInterval * 24 * 60 * 60 * 1000,
        interval: nextInterval,
        reviewCount: plan.reviewCount + 1,
        lastReviewedAt: now
      }
    }
    persist()
  }

  const markForgotten = (slug) => {
    const plan = reviewSchedule.value[slug]
    if (!plan) return
    const now = Date.now()
    reviewSchedule.value = {
      ...reviewSchedule.value,
      [slug]: {
        nextReviewAt: now + INTERVALS[0] * 24 * 60 * 60 * 1000,
        interval: INTERVALS[0],
        reviewCount: plan.reviewCount,
        lastReviewedAt: now
      }
    }
    persist()
  }

  const removePlan = (slug) => {
    if (!reviewSchedule.value[slug]) return
    const updated = { ...reviewSchedule.value }
    delete updated[slug]
    reviewSchedule.value = updated
    persist()
  }

  const dueReviews = computed(() => {
    const now = Date.now()
    return Object.entries(reviewSchedule.value)
      .filter(([, plan]) => plan.nextReviewAt <= now)
      .map(([slug, plan]) => ({ slug, ...plan }))
  })

  return {
    reviewSchedule,
    INTERVALS,
    createReviewPlan,
    markReviewed,
    markForgotten,
    removePlan,
    dueReviews
  }
}
