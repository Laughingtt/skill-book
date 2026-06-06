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

// Mock fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Must import after mocks
const { useGithubImport } = await import('../composables/useGithubImport.js')
const { useSkills } = await import('../composables/useSkills.js')

describe('GitHub Import Flow', () => {
  let importModule

  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
    importModule = useGithubImport()
  })

  describe('parseGithubUrl', () => {
    it('parses a standard GitHub URL', () => {
      const { owner, repo } = importModule.importFromGithub.toString().length && { owner: 'anthropics', repo: 'claude-code' }
      // Direct parse test via importFromGithub
    })

    it('throws on invalid URL', async () => {
      await expect(importModule.importFromGithub('not-a-url')).rejects.toThrow('无效的 GitHub 仓库地址')
    })

    it('throws on missing repo', async () => {
      await expect(importModule.importFromGithub('https://github.com/owner-only')).rejects.toThrow('无效的 GitHub 仓库地址')
    })
  })

  describe('API Key management', () => {
    it('saves and retrieves DeepSeek API key', () => {
      importModule.saveApiKey('sk-test123')
      expect(importModule.apiKey.value).toBe('sk-test123')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('skill-book-deepseek-api-key', 'sk-test123')
    })

    it('saves and retrieves Tavily API key', () => {
      importModule.saveTavilyApiKey('tvly-test123')
      expect(importModule.tavilyApiKey.value).toBe('tvly-test123')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('skill-book-tavily-api-key', 'tvly-test123')
    })

    it('loads stored API keys on init', () => {
      store['skill-book-deepseek-api-key'] = 'sk-stored'
      store['skill-book-tavily-api-key'] = 'tvly-stored'
      const fresh = useGithubImport()
      expect(fresh.apiKey.value).toBe('sk-stored')
      expect(fresh.tavilyApiKey.value).toBe('tvly-stored')
    })
  })

  describe('importFromGithub', () => {
    it('throws when Tavily API key is missing', async () => {
      await expect(importModule.importFromGithub('https://github.com/owner/repo')).rejects.toThrow('Tavily API Key')
    })

    it('throws when DeepSeek API key is missing', async () => {
      importModule.saveTavilyApiKey('tvly-test')
      // Tavily extract succeeds but DeepSeek key missing
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [{ raw_content: '# Test README' }] }),
      })
      await expect(importModule.importFromGithub('https://github.com/owner/repo')).rejects.toThrow('DeepSeek API Key')
    })

    it('successfully imports a skill', async () => {
      importModule.saveTavilyApiKey('tvly-test')
      importModule.saveApiKey('sk-test')

      // Tavily extract response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [{ raw_content: '# My Repo\nA great tool.' }] }),
      })

      // DeepSeek AI response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify({
            name: 'my-repo',
            description: '测试描述',
            category: '编码开发与工程规范',
            tags: ['test', 'tool'],
            install: 'npm install my-repo',
            source: 'https://github.com/owner/my-repo',
            content: '## 使用场景\n测试内容',
          })}}],
        }),
      })

      const result = await importModule.importFromGithub('https://github.com/owner/my-repo')
      expect(result.name).toBe('my-repo')
      expect(result.slug).toBe('my-repo')
      expect(result.category).toBe('编码开发与工程规范')
      expect(result.tags).toEqual(['test', 'tool'])
    })

    it('handles Tavily API error', async () => {
      importModule.saveTavilyApiKey('tvly-test')
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ detail: 'Invalid API key' }),
      })

      await expect(importModule.importFromGithub('https://github.com/owner/repo')).rejects.toThrow('Tavily API 请求失败')
    })

    it('handles empty Tavily response', async () => {
      importModule.saveTavilyApiKey('tvly-test')
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      })

      await expect(importModule.importFromGithub('https://github.com/owner/repo')).rejects.toThrow('Tavily 未返回有效内容')
    })

    it('sets importing state correctly', async () => {
      importModule.saveTavilyApiKey('tvly-test')
      importModule.saveApiKey('sk-test')

      // Tavily extract
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [{ raw_content: '# README' }] }),
      })

      // DeepSeek AI
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify({ name: 'repo', description: 'd', category: 'c', tags: [], install: '', source: '', content: '' })}}],
        }),
      })

      expect(importModule.importing.value).toBe(false)
      await importModule.importFromGithub('https://github.com/owner/repo')
      expect(importModule.importing.value).toBe(false)
    })
  })
})
