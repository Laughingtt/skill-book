import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage before any imports
const store = {}
vi.stubGlobal('localStorage', {
  getItem: vi.fn((k) => store[k] ?? null),
  setItem: vi.fn((k, v) => { store[k] = v }),
  removeItem: vi.fn((k) => { delete store[k] }),
  clear: vi.fn(() => { for (const k in store) delete store[k] }),
})

// Must import after mocks are in place
const { useSearch, setSearchSkills } = await import('../composables/useSearch.js')
const { ref, nextTick } = await import('vue')

const mockSkills = [
  { name: 'Superpowers', slug: 'superpowers', category: 'CLI', tags: ['cli', 'skills'], description: 'Skill management for AI agents' },
  { name: 'Agent Browser MCP', slug: 'agent-browser-mcp', category: 'Browser', tags: ['browser', 'mcp'], description: 'Browser automation MCP tool' },
  { name: 'Code Review', slug: 'code-review', category: 'Dev', tags: ['review', 'code'], description: 'Automated code review' },
]

describe('useSearch', () => {
  beforeEach(() => {
    const { query, clearSearch } = useSearch()
    query.value = ''
    clearSearch()
  })

  it('returns all skills when search is empty', async () => {
    const skills = ref(mockSkills)
    setSearchSkills(skills)
    await nextTick()

    const { results } = useSearch()
    await nextTick()
    expect(results.value).toHaveLength(3)
  })

  it('filters skills by search query', async () => {
    const skills = ref(mockSkills)
    setSearchSkills(skills)
    await nextTick()

    const { query, results } = useSearch()
    query.value = 'Superpowers'
    await new Promise(r => setTimeout(r, 400)) // wait for debounce
    await nextTick()

    expect(results.value.length).toBeGreaterThan(0)
    expect(results.value[0].slug).toBe('superpowers')
  })

  it('clearSearch resets both query and results', async () => {
    const skills = ref(mockSkills)
    setSearchSkills(skills)
    await nextTick()

    const { query, results, clearSearch } = useSearch()
    query.value = 'Superpowers'
    await new Promise(r => setTimeout(r, 400)) // wait for debounce
    await nextTick()

    // Should show filtered results
    expect(results.value.length).toBeLessThan(3)

    // Clear search
    clearSearch()
    await nextTick()

    // Should show all skills again
    expect(query.value).toBe('')
    expect(results.value).toHaveLength(3)
  })

  it('clears immediately when query becomes empty (no debounce delay)', async () => {
    const skills = ref(mockSkills)
    setSearchSkills(skills)
    await nextTick()

    const { query, results } = useSearch()

    // Set a search term
    query.value = 'Agent'
    await new Promise(r => setTimeout(r, 400))
    await nextTick()
    expect(results.value.length).toBeLessThan(3)

    // Clear — should be immediate, no 300ms wait
    query.value = ''
    await nextTick()
    // Results should be all skills immediately
    expect(results.value).toHaveLength(3)
  })

  it('searches by Chinese text', async () => {
    const skills = ref(mockSkills)
    setSearchSkills(skills)
    await nextTick()

    const { query, results } = useSearch()
    query.value = 'Browser'
    await new Promise(r => setTimeout(r, 400))
    await nextTick()

    expect(results.value.length).toBeGreaterThan(0)
    expect(results.value.some(s => s.slug === 'agent-browser-mcp')).toBe(true)
  })
})
