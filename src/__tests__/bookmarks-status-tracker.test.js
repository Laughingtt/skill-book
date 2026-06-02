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

describe('useBookmarks', () => {
  let useBookmarks

  beforeEach(() => {
    vi.clearAllMocks()
    Object.keys(storage).forEach(k => delete storage[k])
    // Re-import to reset singleton
    vi.resetModules()
  })

  it('should toggle bookmark on and off', async () => {
    const mod = await import('../composables/useBookmarks')
    useBookmarks = mod.useBookmarks
    const { toggleBookmark, bookmarks, isBookmarked } = useBookmarks()

    expect(isBookmarked('test-slug').value).toBe(false)

    toggleBookmark('test-slug')
    expect(bookmarks.value).toContain('test-slug')
    expect(isBookmarked('test-slug').value).toBe(true)

    toggleBookmark('test-slug')
    expect(bookmarks.value).not.toContain('test-slug')
    expect(isBookmarked('test-slug').value).toBe(false)
  })

  it('should persist bookmarks to localStorage', async () => {
    const mod = await import('../composables/useBookmarks')
    useBookmarks = mod.useBookmarks
    const { toggleBookmark } = useBookmarks()

    toggleBookmark('persist-test')
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'skill-book-bookmarks',
      JSON.stringify(['persist-test'])
    )
  })

  it('should load bookmarks from localStorage', async () => {
    storage['skill-book-bookmarks'] = JSON.stringify(['existing-slug'])
    const mod = await import('../composables/useBookmarks')
    useBookmarks = mod.useBookmarks
    const { bookmarks, isBookmarked } = useBookmarks()

    expect(bookmarks.value).toContain('existing-slug')
    expect(isBookmarked('existing-slug').value).toBe(true)
  })
})

describe('useSkillStatus', () => {
  let useSkillStatus

  beforeEach(() => {
    vi.clearAllMocks()
    Object.keys(storage).forEach(k => delete storage[k])
    vi.resetModules()
  })

  it('should set and get skill status', async () => {
    const mod = await import('../composables/useSkillStatus')
    useSkillStatus = mod.useSkillStatus
    const { setStatus, getStatus } = useSkillStatus()

    expect(getStatus('my-skill')).toBeNull()

    setStatus('my-skill', 'learning')
    expect(getStatus('my-skill')).toBe('learning')
  })

  it('should clear status when set to null', async () => {
    const mod = await import('../composables/useSkillStatus')
    useSkillStatus = mod.useSkillStatus
    const { setStatus, getStatus } = useSkillStatus()

    setStatus('my-skill', 'mastered')
    expect(getStatus('my-skill')).toBe('mastered')

    setStatus('my-skill', null)
    expect(getStatus('my-skill')).toBeNull()
  })

  it('should compute statusStats', async () => {
    const mod = await import('../composables/useSkillStatus')
    useSkillStatus = mod.useSkillStatus
    const { setStatus, statusStats } = useSkillStatus()

    setStatus('a', 'todo')
    setStatus('b', 'learning')
    setStatus('c', 'mastered')
    setStatus('d', 'learning')

    expect(statusStats.value).toEqual({ todo: 1, learning: 2, mastered: 1 })
  })

  it('should reject invalid status values', async () => {
    const mod = await import('../composables/useSkillStatus')
    useSkillStatus = mod.useSkillStatus
    const { setStatus, getStatus } = useSkillStatus()

    setStatus('my-skill', 'invalid')
    expect(getStatus('my-skill')).toBeNull()
  })

  it('should persist status to localStorage', async () => {
    const mod = await import('../composables/useSkillStatus')
    useSkillStatus = mod.useSkillStatus
    const { setStatus } = useSkillStatus()

    setStatus('my-skill', 'todo')
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'skill-book-skill-status',
      JSON.stringify({ 'my-skill': 'todo' })
    )
  })
})

describe('useUsageTracker', () => {
  let useUsageTracker

  beforeEach(() => {
    vi.clearAllMocks()
    Object.keys(storage).forEach(k => delete storage[k])
    vi.resetModules()
  })

  it('should track views and increment count', async () => {
    const mod = await import('../composables/useUsageTracker')
    useUsageTracker = mod.useUsageTracker
    const { trackView, getViewCount } = useUsageTracker()

    expect(getViewCount('my-skill')).toBe(0)

    trackView('my-skill')
    expect(getViewCount('my-skill')).toBe(1)

    trackView('my-skill')
    expect(getViewCount('my-skill')).toBe(2)
  })

  it('should record lastViewedAt timestamp', async () => {
    const mod = await import('../composables/useUsageTracker')
    useUsageTracker = mod.useUsageTracker
    const { trackView, getLastViewed } = useUsageTracker()

    expect(getLastViewed('my-skill')).toBeNull()

    trackView('my-skill')
    const lastViewed = getLastViewed('my-skill')
    expect(lastViewed).not.toBeNull()
    expect(new Date(lastViewed).getTime()).toBeLessThanOrEqual(Date.now())
  })

  it('should compute recentlyViewed with all tracked slugs', async () => {
    const mod = await import('../composables/useUsageTracker')
    useUsageTracker = mod.useUsageTracker
    const { trackView, recentlyViewed } = useUsageTracker()

    trackView('first')
    trackView('second')
    trackView('third')

    expect(recentlyViewed.value.length).toBe(3)
    const slugs = recentlyViewed.value.map(r => r.slug)
    expect(slugs).toContain('first')
    expect(slugs).toContain('second')
    expect(slugs).toContain('third')
  })

  it('should limit recentlyViewed to 5 items', async () => {
    const mod = await import('../composables/useUsageTracker')
    useUsageTracker = mod.useUsageTracker
    const { trackView, recentlyViewed } = useUsageTracker()

    for (let i = 0; i < 8; i++) {
      trackView(`skill-${i}`)
    }

    expect(recentlyViewed.value.length).toBe(5)
  })

  it('should find stale learning skills (7+ days without viewing)', async () => {
    const mod = await import('../composables/useUsageTracker')
    useUsageTracker = mod.useUsageTracker
    const { trackView, getStaleLearning } = useUsageTracker()

    // Track a view for 'stale-skill' with an old timestamp
    const stats = { 'stale-skill': { views: 1, lastViewedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() } }
    storage['skill-book-usage-stats'] = JSON.stringify(stats)

    // Re-import to pick up the stored data
    vi.resetModules()
    const mod2 = await import('../composables/useUsageTracker')
    const { getStaleLearning: getStale } = mod2.useUsageTracker()

    const statuses = { 'stale-skill': 'learning' }
    const stale = getStale(statuses)
    expect(stale.length).toBe(1)
    expect(stale[0].slug).toBe('stale-skill')
  })

  it('should not find stale skills that were recently viewed', async () => {
    const mod = await import('../composables/useUsageTracker')
    useUsageTracker = mod.useUsageTracker
    const { trackView, getStaleLearning } = useUsageTracker()

    trackView('fresh-skill')

    const statuses = { 'fresh-skill': 'learning' }
    const stale = getStaleLearning(statuses)
    expect(stale.length).toBe(0)
  })

  it('should persist usage stats to localStorage', async () => {
    const mod = await import('../composables/useUsageTracker')
    useUsageTracker = mod.useUsageTracker
    const { trackView } = useUsageTracker()

    trackView('persist-skill')
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'skill-book-usage-stats',
      expect.any(String)
    )
    const saved = JSON.parse(localStorageMock.setItem.mock.calls.find(c => c[0] === 'skill-book-usage-stats')[1])
    expect(saved['persist-skill'].views).toBe(1)
  })
})
