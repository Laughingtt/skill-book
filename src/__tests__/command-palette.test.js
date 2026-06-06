import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage before any imports
const store = {}
vi.stubGlobal('localStorage', {
  getItem: vi.fn((k) => store[k] ?? null),
  setItem: vi.fn((k, v) => { store[k] = v }),
  removeItem: vi.fn((k) => { delete store[k] }),
  clear: vi.fn(() => { for (const k in store) delete store[k] }),
})

// Mock useSkills to provide controllable test data
const mockSkillsRef = { value: [] }

vi.mock('../composables/useSkills.js', () => ({
  useSkills: () => ({
    skills: mockSkillsRef,
    loading: { value: false },
    error: { value: null },
    fetchSkills: vi.fn(),
    addSkill: vi.fn(),
    updateSkill: vi.fn(),
    updateSkillFromMd: vi.fn(),
    deleteSkill: vi.fn(),
    categories: { value: ['全部'] },
    allTags: { value: [] },
    getSkillBySlug: vi.fn(),
  }),
}))

// Must import after mocks are in place
const { useCommandPalette } = await import('../composables/useCommandPalette.js')

const testSkills = [
  {
    slug: 'git-smart-commit',
    name: 'Git Smart Commit',
    category: 'Dev',
    tags: ['git', 'commit'],
    commands: [
      { name: '智能提交', cmd: 'git add -A && claude /commit' },
      { name: '查看日志', cmd: 'git log --oneline' },
    ],
  },
  {
    slug: 'code-review',
    name: 'Code Review',
    category: 'Dev',
    tags: ['review'],
    commands: [
      { name: '审查代码', cmd: '/review' },
    ],
  },
  {
    slug: 'deploy-tool',
    name: 'Deploy Tool',
    category: 'Ops',
    tags: ['deploy'],
    commands: [
      'deploy --production',  // string format
      { name: '回滚', cmd: 'deploy --rollback' },
    ],
  },
  {
    slug: 'no-commands-skill',
    name: 'No Commands',
    category: 'Misc',
    tags: [],
    // no commands field
  },
]

describe('useCommandPalette', () => {
  let palette

  beforeEach(() => {
    // Reset skills and palette state
    mockSkillsRef.value = [...testSkills]

    palette = useCommandPalette()
    palette.close()
  })

  describe('commandEntries', () => {
    it('flattens all skill commands into entries', () => {
      const entries = palette.commandEntries.value
      // 2 + 1 + 2 = 5 commands total
      expect(entries).toHaveLength(5)
    })

    it('handles object commands with name and cmd', () => {
      const entries = palette.commandEntries.value
      const gitEntries = entries.filter(e => e.skillSlug === 'git-smart-commit')
      expect(gitEntries).toHaveLength(2)
      expect(gitEntries[0].commandName).toBe('智能提交')
      expect(gitEntries[0].commandCmd).toBe('git add -A && claude /commit')
      expect(gitEntries[1].commandName).toBe('查看日志')
      expect(gitEntries[1].commandCmd).toBe('git log --oneline')
    })

    it('handles string commands as { name: "命令", cmd: string }', () => {
      const entries = palette.commandEntries.value
      const deployStringEntry = entries.find(
        e => e.skillSlug === 'deploy-tool' && e.commandName === '命令'
      )
      expect(deployStringEntry).toBeDefined()
      expect(deployStringEntry.commandCmd).toBe('deploy --production')
    })

    it('includes skillSlug and skillName in each entry', () => {
      const entries = palette.commandEntries.value
      for (const entry of entries) {
        expect(entry).toHaveProperty('skillSlug')
        expect(entry).toHaveProperty('skillName')
        expect(entry).toHaveProperty('commandName')
        expect(entry).toHaveProperty('commandCmd')
      }
    })

    it('skips skills without commands', () => {
      const entries = palette.commandEntries.value
      const noCmdEntries = entries.filter(e => e.skillSlug === 'no-commands-skill')
      expect(noCmdEntries).toHaveLength(0)
    })
  })

  describe('isOpen', () => {
    it('starts closed', () => {
      expect(palette.isOpen.value).toBe(false)
    })

    it('open() opens the palette', () => {
      palette.open()
      expect(palette.isOpen.value).toBe(true)
    })

    it('close() closes the palette', () => {
      palette.open()
      palette.close()
      expect(palette.isOpen.value).toBe(false)
    })

    it('toggle() opens when closed', () => {
      palette.toggle()
      expect(palette.isOpen.value).toBe(true)
    })

    it('toggle() closes when open', () => {
      palette.open()
      palette.toggle()
      expect(palette.isOpen.value).toBe(false)
    })

    it('open() resets query and highlightedIndex', () => {
      palette.query.value = 'test'
      palette.highlightedIndex.value = 3
      palette.open()
      expect(palette.query.value).toBe('')
      expect(palette.highlightedIndex.value).toBe(0)
    })

    it('close() resets query and highlightedIndex', () => {
      palette.query.value = 'test'
      palette.highlightedIndex.value = 3
      palette.close()
      expect(palette.query.value).toBe('')
      expect(palette.highlightedIndex.value).toBe(0)
    })
  })

  describe('filteredCommands', () => {
    it('returns all commands sorted by skillName when query is empty', () => {
      const filtered = palette.filteredCommands.value
      expect(filtered).toHaveLength(5)
      // Sorted by skillName: Code Review, Deploy Tool, Git Smart Commit
      expect(filtered[0].skillName).toBe('Code Review')
      expect(filtered[1].skillName).toBe('Deploy Tool')
      expect(filtered[2].skillName).toBe('Deploy Tool')
      expect(filtered[3].skillName).toBe('Git Smart Commit')
      expect(filtered[4].skillName).toBe('Git Smart Commit')
    })

    it('filters commands by query matching commandCmd', async () => {
      palette.query.value = 'commit'
      await new Promise(r => setTimeout(r, 50))

      const filtered = palette.filteredCommands.value
      expect(filtered.length).toBeGreaterThan(0)
      // Should match "git add -A && claude /commit"
      const hasCommit = filtered.some(e => e.commandCmd.includes('commit'))
      expect(hasCommit).toBe(true)
    })

    it('filters commands by query matching commandName', async () => {
      palette.query.value = '审查'
      await new Promise(r => setTimeout(r, 50))

      const filtered = palette.filteredCommands.value
      expect(filtered.length).toBeGreaterThan(0)
      const hasReview = filtered.some(e => e.commandName === '审查代码')
      expect(hasReview).toBe(true)
    })

    it('filters commands by query matching skillName', async () => {
      palette.query.value = 'Deploy'
      await new Promise(r => setTimeout(r, 50))

      const filtered = palette.filteredCommands.value
      expect(filtered.length).toBeGreaterThan(0)
      const allDeploy = filtered.every(e => e.skillName === 'Deploy Tool')
      expect(allDeploy).toBe(true)
    })

    it('returns empty array for non-matching query', async () => {
      palette.query.value = 'zzzznonexistent'
      await new Promise(r => setTimeout(r, 50))

      const filtered = palette.filteredCommands.value
      expect(filtered).toHaveLength(0)
    })
  })

  describe('moveHighlight', () => {
    it('moves highlight down', () => {
      palette.query.value = ''
      palette.highlightedIndex.value = 0
      palette.moveHighlight(1)
      expect(palette.highlightedIndex.value).toBe(1)
    })

    it('moves highlight up', () => {
      palette.query.value = ''
      palette.highlightedIndex.value = 2
      palette.moveHighlight(-1)
      expect(palette.highlightedIndex.value).toBe(1)
    })

    it('wraps from bottom to top', () => {
      palette.query.value = ''
      const max = palette.filteredCommands.value.length - 1
      palette.highlightedIndex.value = max
      palette.moveHighlight(1)
      expect(palette.highlightedIndex.value).toBe(0)
    })

    it('wraps from top to bottom', () => {
      palette.query.value = ''
      const max = palette.filteredCommands.value.length - 1
      palette.highlightedIndex.value = 0
      palette.moveHighlight(-1)
      expect(palette.highlightedIndex.value).toBe(max)
    })

    it('resets to 0 when no commands', async () => {
      palette.query.value = 'zzzznonexistent'
      await new Promise(r => setTimeout(r, 50))
      palette.highlightedIndex.value = 5
      palette.moveHighlight(1)
      expect(palette.highlightedIndex.value).toBe(0)
    })
  })
})
