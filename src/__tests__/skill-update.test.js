import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const store = {}
vi.stubGlobal('localStorage', {
  getItem: vi.fn(key => store[key] || null),
  setItem: vi.fn((key, val) => { store[key] = val }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
})

const { useSkillUpdate } = await import('../composables/useSkillUpdate.js')

describe('useSkillUpdate', () => {
  let updater

  beforeEach(() => {
    vi.clearAllMocks()
    updater = useSkillUpdate()
  })

  describe('parseGithubUrl', () => {
    it('extracts owner and repo from GitHub URL', () => {
      const result = updater.parseGithubUrl('https://github.com/anthropics/skills')
      expect(result).toEqual({ owner: 'anthropics', repo: 'skills' })
    })

    it('handles trailing slash', () => {
      const result = updater.parseGithubUrl('https://github.com/vercel-labs/agent-skills/')
      expect(result).toEqual({ owner: 'vercel-labs', repo: 'agent-skills' })
    })

    it('returns null for invalid URLs', () => {
      expect(updater.parseGithubUrl('https://example.com/foo')).toBeNull()
      expect(updater.parseGithubUrl('not-a-url')).toBeNull()
      expect(updater.parseGithubUrl('')).toBeNull()
    })
  })

  describe('fetchReadme', () => {
    it('fetches README from GitHub raw URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('# Test README\nSome content'),
      })
      const content = await updater.fetchReadme('anthropics', 'skills')
      expect(content).toBe('# Test README\nSome content')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/anthropics/skills/main/README.md',
        expect.any(Object)
      )
    })

    it('returns null on fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false })
      const content = await updater.fetchReadme('bad', 'repo')
      expect(content).toBeNull()
    })
  })

  describe('getLatestCommit', () => {
    it('fetches latest commit SHA from GitHub API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ sha: 'abc123def', commit: { committer: { date: '2026-06-07T20:21:33Z' } } }]),
      })
      const commit = await updater.getLatestCommit('anthropics', 'skills')
      expect(commit).toEqual({ sha: 'abc123def', date: '2026-06-07T20:21:33Z' })
    })

    it('returns null on empty response', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
      const commit = await updater.getLatestCommit('empty', 'repo')
      expect(commit).toBeNull()
    })
  })
})
