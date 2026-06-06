import { describe, it, expect, beforeEach, vi } from 'vitest'

const storage = {}
const localStorageMock = {
  getItem: vi.fn((key) => storage[key] || null),
  setItem: vi.fn((key, val) => { storage[key] = val }),
  removeItem: vi.fn((key) => { delete storage[key] }),
  clear: vi.fn(() => { Object.keys(storage).forEach(k => delete storage[k]) }),
}

vi.stubGlobal('localStorage', localStorageMock)

describe('deleteSkill cleanup', () => {
  let useSkills

  beforeEach(async () => {
    vi.clearAllMocks()
    Object.keys(storage).forEach(k => delete storage[k])

    // Pre-populate localStorage with related data
    storage['skill-book-bookmarks'] = JSON.stringify(['delete-me', 'keep-me'])
    storage['skill-book-skill-status'] = JSON.stringify({ 'delete-me': 'learning', 'keep-me': 'mastered' })
    storage['skill-book-skill-notes'] = JSON.stringify({ 'delete-me': 'Some notes', 'keep-me': 'Other notes' })
    storage['skill-book-usage-stats'] = JSON.stringify({ 'delete-me': { views: 5, lastViewedAt: '2026-01-01' }, 'keep-me': { views: 3, lastViewedAt: '2026-01-02' } })
    storage['skill-book-review-schedule'] = JSON.stringify({ 'delete-me': { nextReviewAt: '2026-01-05', interval: 3, reviewCount: 1, lastReviewedAt: '2026-01-02' } })
    storage['skill-book-skills'] = JSON.stringify([])

    vi.resetModules()
    const mod = await import('../composables/useSkills')
    useSkills = mod.useSkills
  })

  it('should clean up bookmarks when deleting a skill', async () => {
    const { skills, addSkill, deleteSkill } = useSkills()

    // Add the skill so it exists
    await addSkill({ name: 'Delete Me', slug: 'delete-me', category: 'Test', tags: [], description: 'To delete' })
    await deleteSkill('delete-me')

    // Check bookmarks cleanup
    const bm = JSON.parse(storage['skill-book-bookmarks'] || '[]')
    expect(bm).not.toContain('delete-me')
    expect(bm).toContain('keep-me')
  })

  it('should clean up skill status when deleting a skill', async () => {
    const { skills, addSkill, deleteSkill } = useSkills()

    await addSkill({ name: 'Delete Me', slug: 'delete-me', category: 'Test', tags: [], description: 'To delete' })
    await deleteSkill('delete-me')

    const st = JSON.parse(storage['skill-book-skill-status'] || '{}')
    expect(st['delete-me']).toBeUndefined()
    expect(st['keep-me']).toBe('mastered')
  })

  it('should clean up notes when deleting a skill', async () => {
    const { skills, addSkill, deleteSkill } = useSkills()

    await addSkill({ name: 'Delete Me', slug: 'delete-me', category: 'Test', tags: [], description: 'To delete' })
    await deleteSkill('delete-me')

    const nt = JSON.parse(storage['skill-book-skill-notes'] || '{}')
    expect(nt['delete-me']).toBeUndefined()
    expect(nt['keep-me']).toBe('Other notes')
  })

  it('should clean up usage stats when deleting a skill', async () => {
    const { skills, addSkill, deleteSkill } = useSkills()

    await addSkill({ name: 'Delete Me', slug: 'delete-me', category: 'Test', tags: [], description: 'To delete' })
    await deleteSkill('delete-me')

    const us = JSON.parse(storage['skill-book-usage-stats'] || '{}')
    expect(us['delete-me']).toBeUndefined()
    expect(us['keep-me']).toBeDefined()
  })

  it('should clean up review schedule when deleting a skill', async () => {
    const { skills, addSkill, deleteSkill } = useSkills()

    await addSkill({ name: 'Delete Me', slug: 'delete-me', category: 'Test', tags: [], description: 'To delete' })
    await deleteSkill('delete-me')

    const rs = JSON.parse(storage['skill-book-review-schedule'] || '{}')
    expect(rs['delete-me']).toBeUndefined()
  })
})
