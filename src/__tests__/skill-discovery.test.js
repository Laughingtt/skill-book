import { describe, it, expect } from 'vitest'

const { useSkillDiscovery } = await import('../composables/useSkillDiscovery.js')

const mockSkills = [
  { slug: 'a', name: 'Skill A', quality: { score: 8, completeness: 9, usability: 8, freshness: 7 } },
  { slug: 'b', name: 'Skill B', quality: { score: 3, completeness: 2, usability: 4, freshness: 8 } },
  { slug: 'c', name: 'Skill C', quality: { score: 6, completeness: 6, usability: 6, freshness: 6 } },
]

const mockStats = {
  a: { views: 30, lastViewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  b: { views: 2, lastViewedAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString() },
}

const mockFeedback = [
  { slug: 'a', outcome: 'success', at: new Date().toISOString() },
  { slug: 'a', outcome: 'success', at: new Date().toISOString() },
  { slug: 'b', outcome: 'failed', at: new Date().toISOString() },
]

describe('useSkillDiscovery', () => {
  const { filterByQuality, getStaleSkills, computeDynamicScore } = useSkillDiscovery()

  describe('filterByQuality', () => {
    it('returns only skills above the quality threshold', () => {
      const result = filterByQuality(mockSkills, { minScore: 5 })
      expect(result.map(r => r.slug)).toEqual(['a', 'c'])
    })

    it('returns empty array when no skills meet threshold', () => {
      const result = filterByQuality(mockSkills, { minScore: 9 })
      expect(result).toEqual([])
    })

    it('passes through skills without quality data', () => {
      const noQuality = [{ slug: 'x', name: 'X' }]
      const result = filterByQuality(noQuality, { minScore: 5 })
      expect(result).toEqual(noQuality)
    })
  })

  describe('getStaleSkills', () => {
    it('identifies skills with low freshness scores', () => {
      const stale = getStaleSkills(mockSkills, { freshnessThreshold: 5 })
      // No skill has freshness < 5 in this dataset
      expect(stale).toEqual([])
    })

    it('returns empty when no skills have quality data', () => {
      const noQuality = [{ slug: 'x', name: 'X' }]
      const stale = getStaleSkills(noQuality, { freshnessThreshold: 5 })
      expect(stale).toEqual([])
    })
  })

  describe('computeDynamicScore', () => {
    it('boosts score for frequently used skills with recent views', () => {
      const score = computeDynamicScore(mockSkills[0], mockStats, mockFeedback)
      // Skill A: quality 8, high views, recent usage, 100% feedback success → should be > 5
      expect(score).toBeGreaterThan(5)
    })

    it('penalizes skills with old last viewed dates and failed feedback', () => {
      const score = computeDynamicScore(mockSkills[1], mockStats, mockFeedback)
      // Skill B: quality 3, low views, old last view, 0% feedback success → lower
      expect(score).toBeLessThan(6)
    })
  })
})
