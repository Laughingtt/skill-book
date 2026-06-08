import { describe, it, expect, beforeEach, vi } from 'vitest'

const store = {}
vi.stubGlobal('localStorage', {
  getItem: vi.fn(key => store[key] || null),
  setItem: vi.fn((key, val) => { store[key] = val }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
})

const { useAgentBridge } = await import('../composables/useAgentBridge.js')

const mockSkills = [
  { slug: 'systematic-debugging', name: 'Systematic Debugging', category: 'Dev', tags: ['debugging'], scenarios: ['debugging', 'bug-fix'], description: 'Systematic debugging process', commands: [{ name: '开始调试', cmd: '/debug' }] },
  { slug: 'frontend-design', name: 'Frontend Design', category: 'Design', tags: ['design', 'css'], scenarios: ['design', 'ui-creation'], description: 'Frontend design skill', commands: [{ name: '生成页面', cmd: '/design' }] },
  { slug: 'tdd', name: 'TDD', category: 'Quality', tags: ['testing'], scenarios: ['testing', 'code-quality'], description: 'TDD workflow', commands: [{ name: '启动TDD', cmd: '/tdd' }] },
]

describe('useAgentBridge', () => {
  let bridge

  beforeEach(() => {
    vi.clearAllMocks()
    bridge = useAgentBridge()
  })

  describe('querySkills', () => {
    it('finds skills matching a scenario', () => {
      const results = bridge.querySkills({ scenario: 'debugging' }, mockSkills)
      expect(results.map(r => r.slug)).toContain('systematic-debugging')
      expect(results.map(r => r.slug)).not.toContain('frontend-design')
    })

    it('finds skills by tags', () => {
      const results = bridge.querySkills({ tags: ['design'] }, mockSkills)
      expect(results.map(r => r.slug)).toEqual(['frontend-design'])
    })

    it('combines scenario and tag filters', () => {
      const results = bridge.querySkills({ scenario: 'testing', tags: ['testing'] }, mockSkills)
      expect(results.map(r => r.slug)).toEqual(['tdd'])
    })

    it('returns empty array for no matches', () => {
      const results = bridge.querySkills({ scenario: 'nonexistent' }, mockSkills)
      expect(results).toEqual([])
    })
  })

  describe('formatSkillForAgent', () => {
    it('formats a skill as a structured system prompt fragment', () => {
      const skill = mockSkills[0]
      const prompt = bridge.formatSkillForAgent(skill)
      expect(prompt).toContain('Systematic Debugging')
      expect(prompt).toContain('systematic-debugging')
      expect(prompt).toContain('Systematic debugging process')
      expect(prompt).toContain('/debug')
      expect(prompt).toContain('debugging')
    })
  })

  describe('recordFeedback and getQualityScore', () => {
    it('returns null when no feedback exists for a skill', () => {
      expect(bridge.getQualityScore('unknown')).toBeNull()
    })

    it('computes quality score from feedback entries', () => {
      bridge.recordFeedback('test-skill', 'success')
      bridge.recordFeedback('test-skill', 'success')
      bridge.recordFeedback('test-skill', 'failed')
      // 2 out of 3 success = 67%
      expect(bridge.getQualityScore('test-skill')).toBe(67)
    })
  })
})
