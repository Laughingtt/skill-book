import { describe, it, expect, beforeEach, vi } from 'vitest'

const store = {}
vi.stubGlobal('localStorage', {
  getItem: vi.fn(key => store[key] || null),
  setItem: vi.fn((key, val) => { store[key] = val }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
})

const { useLeaderboard, parseInstalls } = await import('../composables/useLeaderboard.js')

describe('parseInstalls', () => {
  it('parses K suffix', () => expect(parseInstalls('458.9K')).toBe(458900))
  it('parses M suffix', () => expect(parseInstalls('1.2M')).toBe(1200000))
  it('parses B suffix', () => expect(parseInstalls('2B')).toBe(2000000000))
  it('parses plain number', () => expect(parseInstalls('500')).toBe(500))
  it('returns 0 for empty', () => expect(parseInstalls(null)).toBe(0))
  it('returns 0 for undefined', () => expect(parseInstalls(undefined)).toBe(0))
})

describe('useLeaderboard', () => {
  let lb

  beforeEach(() => {
    vi.clearAllMocks()
    lb = useLeaderboard()
  })

  it('initializes with empty skills array', () => {
    expect(lb.skills.value).toEqual([])
    expect(lb.loading.value).toBe(false)
  })

  it('has a fetchLeaderboard method', () => {
    expect(typeof lb.fetchLeaderboard).toBe('function')
  })

  it('hotSkills is a computed sorted by installs desc', () => {
    lb.skills.value = [
      { name: 'a@skill', installs: '10K', url: '' },
      { name: 'b@skill', installs: '1.2M', url: '' },
      { name: 'c@skill', installs: '500', url: '' },
    ]
    expect(lb.hotSkills.value[0].name).toBe('b@skill')
    expect(lb.hotSkills.value[1].name).toBe('a@skill')
    expect(lb.hotSkills.value[2].name).toBe('c@skill')
  })
})
