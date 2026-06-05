import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage before importing composables
const storage = {}
const localStorageMock = {
  getItem: vi.fn((key) => storage[key] || null),
  setItem: vi.fn((key, val) => { storage[key] = val }),
  removeItem: vi.fn((key) => { delete storage[key] }),
  clear: vi.fn(() => { Object.keys(storage).forEach(k => delete storage[k]) }),
}

vi.stubGlobal('localStorage', localStorageMock)

describe('useSpacedRepetition', () => {
  let useSpacedRepetition

  beforeEach(() => {
    vi.clearAllMocks()
    Object.keys(storage).forEach(k => delete storage[k])
    // Re-import to reset singleton
    vi.resetModules()
  })

  it('should create review plan with interval=1', async () => {
    const mod = await import('../composables/useSpacedRepetition')
    useSpacedRepetition = mod.useSpacedRepetition
    const { createReviewPlan, reviewSchedule } = useSpacedRepetition()

    createReviewPlan('test-skill')

    expect(reviewSchedule.value['test-skill']).toBeDefined()
    expect(reviewSchedule.value['test-skill'].interval).toBe(1)
    expect(reviewSchedule.value['test-skill'].reviewCount).toBe(0)
    expect(reviewSchedule.value['test-skill'].lastReviewedAt).toBeNull()
    expect(reviewSchedule.value['test-skill'].nextReviewAt).toBeGreaterThan(Date.now())
  })

  it('should skip creating plan if already exists', async () => {
    const mod = await import('../composables/useSpacedRepetition')
    useSpacedRepetition = mod.useSpacedRepetition
    const { createReviewPlan, reviewSchedule } = useSpacedRepetition()

    createReviewPlan('existing-skill')
    const firstPlan = { ...reviewSchedule.value['existing-skill'] }

    // Create again - should be skipped
    createReviewPlan('existing-skill')

    expect(reviewSchedule.value['existing-skill']).toEqual(firstPlan)
  })

  it('should advance interval 1->3->7->14->30->30(cap)', async () => {
    const mod = await import('../composables/useSpacedRepetition')
    useSpacedRepetition = mod.useSpacedRepetition
    const { createReviewPlan, markReviewed, reviewSchedule } = useSpacedRepetition()

    createReviewPlan('interval-skill')
    expect(reviewSchedule.value['interval-skill'].interval).toBe(1)

    markReviewed('interval-skill')
    expect(reviewSchedule.value['interval-skill'].interval).toBe(3)
    expect(reviewSchedule.value['interval-skill'].reviewCount).toBe(1)

    markReviewed('interval-skill')
    expect(reviewSchedule.value['interval-skill'].interval).toBe(7)
    expect(reviewSchedule.value['interval-skill'].reviewCount).toBe(2)

    markReviewed('interval-skill')
    expect(reviewSchedule.value['interval-skill'].interval).toBe(14)
    expect(reviewSchedule.value['interval-skill'].reviewCount).toBe(3)

    markReviewed('interval-skill')
    expect(reviewSchedule.value['interval-skill'].interval).toBe(30)
    expect(reviewSchedule.value['interval-skill'].reviewCount).toBe(4)

    // Should cap at 30
    markReviewed('interval-skill')
    expect(reviewSchedule.value['interval-skill'].interval).toBe(30)
    expect(reviewSchedule.value['interval-skill'].reviewCount).toBe(5)
  })

  it('should reset to interval=1 on markForgotten', async () => {
    const mod = await import('../composables/useSpacedRepetition')
    useSpacedRepetition = mod.useSpacedRepetition
    const { createReviewPlan, markReviewed, markForgotten, reviewSchedule } = useSpacedRepetition()

    createReviewPlan('forgotten-skill')
    markReviewed('forgotten-skill')
    markReviewed('forgotten-skill')
    expect(reviewSchedule.value['forgotten-skill'].interval).toBe(7)

    markForgotten('forgotten-skill')
    expect(reviewSchedule.value['forgotten-skill'].interval).toBe(1)
    expect(reviewSchedule.value['forgotten-skill'].lastReviewedAt).not.toBeNull()
  })

  it('should remove plan', async () => {
    const mod = await import('../composables/useSpacedRepetition')
    useSpacedRepetition = mod.useSpacedRepetition
    const { createReviewPlan, removePlan, reviewSchedule } = useSpacedRepetition()

    createReviewPlan('remove-skill')
    expect(reviewSchedule.value['remove-skill']).toBeDefined()

    removePlan('remove-skill')
    expect(reviewSchedule.value['remove-skill']).toBeUndefined()
  })

  it('should show due reviews for overdue entries', async () => {
    // Set up a schedule with an overdue entry
    const now = Date.now()
    const pastDue = now - 24 * 60 * 60 * 1000 // 1 day ago
    const futureDue = now + 7 * 24 * 60 * 60 * 1000 // 7 days from now

    storage['skill-book-review-schedule'] = JSON.stringify({
      'overdue-skill': {
        nextReviewAt: pastDue,
        interval: 3,
        reviewCount: 2,
        lastReviewedAt: now - 4 * 24 * 60 * 60 * 1000
      },
      'future-skill': {
        nextReviewAt: futureDue,
        interval: 7,
        reviewCount: 1,
        lastReviewedAt: now - 7 * 24 * 60 * 60 * 1000
      }
    })

    const mod = await import('../composables/useSpacedRepetition')
    useSpacedRepetition = mod.useSpacedRepetition
    const { dueReviews } = useSpacedRepetition()

    expect(dueReviews.value.length).toBe(1)
    expect(dueReviews.value[0].slug).toBe('overdue-skill')
    expect(dueReviews.value[0].interval).toBe(3)
    expect(dueReviews.value[0].reviewCount).toBe(2)
  })

  it('should persist to localStorage', async () => {
    const mod = await import('../composables/useSpacedRepetition')
    useSpacedRepetition = mod.useSpacedRepetition
    const { createReviewPlan } = useSpacedRepetition()

    createReviewPlan('persist-skill')

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'skill-book-review-schedule',
      expect.any(String)
    )
    const saved = JSON.parse(localStorageMock.setItem.mock.calls.find(c => c[0] === 'skill-book-review-schedule')[1])
    expect(saved['persist-skill']).toBeDefined()
    expect(saved['persist-skill'].interval).toBe(1)
  })

  it('should load from localStorage on init', async () => {
    const existingData = {
      'loaded-skill': {
        nextReviewAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
        interval: 3,
        reviewCount: 1,
        lastReviewedAt: Date.now() - 24 * 60 * 60 * 1000
      }
    }
    storage['skill-book-review-schedule'] = JSON.stringify(existingData)

    const mod = await import('../composables/useSpacedRepetition')
    useSpacedRepetition = mod.useSpacedRepetition
    const { reviewSchedule } = useSpacedRepetition()

    expect(reviewSchedule.value['loaded-skill']).toBeDefined()
    expect(reviewSchedule.value['loaded-skill'].interval).toBe(3)
  })
})
