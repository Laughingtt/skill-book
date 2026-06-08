import { describe, it, expect, vi } from 'vitest'

const store = {}
vi.stubGlobal('localStorage', {
  getItem: vi.fn(key => store[key] || null),
  setItem: vi.fn((key, val) => { store[key] = val }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
})

const { computeRecommendations } = await import('../composables/useRecommendations.js')

const sampleSkills = [
  { slug: 'a', name: 'Skill A', category: 'Dev', tags: ['git', 'commit'], scenarios: ['debugging'] },
  { slug: 'b', name: 'Skill B', category: 'Dev', tags: ['git', 'push'], scenarios: ['deployment'] },
  { slug: 'c', name: 'Skill C', category: 'Design', tags: ['css', 'layout'], scenarios: ['design'] },
  { slug: 'd', name: 'Skill D', category: 'Dev', tags: ['test', 'unit'], scenarios: ['debugging', 'testing'] },
  { slug: 'e', name: 'Skill E', category: 'Design', tags: ['css', 'animation'], scenarios: ['design'] },
]

const sampleStatuses = { a: 'mastered', c: 'learning' }
const sampleBookmarks = ['a']
const sampleStats = {
  a: { views: 10, usageLog: [{ scenario: 'debugging', at: new Date().toISOString() }] },
  b: { views: 0 },
}

describe('computeRecommendations', () => {
  it('ranks unstarted skills by similarity to mastered/bookmarked skills', () => {
    const recs = computeRecommendations(sampleSkills, sampleStatuses, sampleBookmarks, sampleStats)
    expect(recs.length).toBeGreaterThan(0)
    expect(recs.map(r => r.slug)).toContain('b')
    expect(recs.map(r => r.slug)).toContain('d')
    expect(recs.map(r => r.slug)).not.toContain('a')
    expect(recs.map(r => r.slug)).not.toContain('c')
  })

  it('returns empty array when all skills are started', () => {
    const allStarted = { a: 'mastered', b: 'learning', c: 'todo', d: 'learning', e: 'mastered' }
    const recs = computeRecommendations(sampleSkills, allStarted, [], {})
    expect(recs).toEqual([])
  })

  it('scores skills with no prerequisites higher when prerequisites unmet', () => {
    const skillsWithPrereqs = [
      { slug: 'easy', name: 'Easy', category: 'Dev', tags: [], scenarios: [], prerequisites: [] },
      { slug: 'hard', name: 'Hard', category: 'Dev', tags: [], scenarios: [], prerequisites: ['advanced'] },
    ]
    const recs = computeRecommendations(skillsWithPrereqs, {}, [], {})
    // 'easy' has no prereqs so should appear; 'hard' depends on 'advanced' which is not mastered
    expect(recs.map(r => r.slug)).toContain('easy')
    expect(recs.map(r => r.slug)).not.toContain('hard')
  })
})
