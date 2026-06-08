import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage
const store = {}
const localStorageMock = {
  getItem: vi.fn(key => store[key] || null),
  setItem: vi.fn((key, val) => { store[key] = val }),
  removeItem: vi.fn(key => { delete store[key] }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
}
vi.stubGlobal('localStorage', localStorageMock)
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const { useSkillSync } = await import('../composables/useSkillSync.js')

describe('useSkillSync', () => {
  let sync

  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
    sync = useSkillSync()
  })

  describe('exportData', () => {
    it('exports all localStorage keys into a single JSON blob', () => {
      store['skill-book-skills'] = JSON.stringify([{ slug: 'test', name: 'Test' }])
      store['skill-book-bookmarks'] = JSON.stringify(['test'])
      store['skill-book-skill-status'] = JSON.stringify({ test: 'learning' })
      store['skill-book-skill-notes'] = JSON.stringify({ test: '# note' })
      store['skill-book-usage-stats'] = JSON.stringify({ test: { views: 5 } })
      store['skill-book-review-schedule'] = JSON.stringify({ test: { nextReviewAt: 123 } })

      const blob = sync.exportData()
      const parsed = JSON.parse(blob)

      expect(parsed.skills).toEqual([{ slug: 'test', name: 'Test' }])
      expect(parsed.bookmarks).toEqual(['test'])
      expect(parsed.statuses).toEqual({ test: 'learning' })
      expect(parsed.notes).toEqual({ test: '# note' })
      expect(parsed.usageStats).toEqual({ test: { views: 5 } })
      expect(parsed.reviewSchedule).toEqual({ test: { nextReviewAt: 123 } })
      expect(parsed.exportedAt).toBeDefined()
      expect(parsed.version).toBe(1)
    })
  })

  describe('importData', () => {
    it('merges imported data into localStorage without overwriting existing user fields', () => {
      store['skill-book-skills'] = JSON.stringify([{ slug: 'existing', name: 'Existing', description: 'mine' }])
      store['skill-book-bookmarks'] = JSON.stringify(['existing'])

      const importBlob = JSON.stringify({
        version: 1,
        skills: [{ slug: 'imported', name: 'Imported' }],
        bookmarks: ['imported'],
        statuses: { imported: 'todo' },
        exportedAt: new Date().toISOString(),
      })

      const result = sync.importData(importBlob)
      expect(result.added).toBe(1)
      expect(result.skipped).toBe(0)

      const skills = JSON.parse(store['skill-book-skills'])
      expect(skills.length).toBe(2)
      expect(skills.find(s => s.slug === 'existing').description).toBe('mine')
    })

    it('returns error for invalid JSON', () => {
      const result = sync.importData('not valid json{{{')
      expect(result.error).toBe('无效的 JSON 格式')
    })

    it('skips skills whose slug already exists in localStorage', () => {
      store['skill-book-skills'] = JSON.stringify([{ slug: 'existing', name: 'Existing' }])
      const importBlob = JSON.stringify({
        version: 1,
        skills: [{ slug: 'existing', name: 'Should Not Overwrite' }],
      })
      const result = sync.importData(importBlob)
      expect(result.skipped).toBe(1)
      expect(result.added).toBe(0)
    })
  })
})
