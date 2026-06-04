import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage
const store = {}
vi.stubGlobal('localStorage', {
  getItem: vi.fn((k) => store[k] ?? null),
  setItem: vi.fn((k, v) => { store[k] = v }),
  removeItem: vi.fn((k) => { delete store[k] }),
  clear: vi.fn(() => { for (const k in store) delete store[k] }),
})

// Mock fetch for skills data
const mockSkills = [
  { name: 'Superpowers', slug: 'superpowers', category: 'CLI', tags: ['cli', 'skills'], description: 'Skill management for AI agents' },
  { name: 'Agent Browser MCP', slug: 'agent-browser-mcp', category: '浏览器与文本处理', tags: ['browser', 'mcp'], description: '浏览器自动化MCP工具' },
  { name: 'Code Review', slug: 'code-review', category: '编码开发', tags: ['review', 'code'], description: '自动化代码审查工具' },
  { name: 'Git Smart Commit', slug: 'git-smart-commit', category: '编码开发', tags: ['git', 'commit'], description: 'Git智能提交工具' },
  { name: 'Playwright MCP', slug: 'playwright-mcp', category: '浏览器与文本处理', tags: ['browser', 'mcp', 'testing'], description: 'Playwright浏览器测试MCP' },
]

vi.stubGlobal('fetch', vi.fn(async (url) => {
  if (url.includes('/skills/index.json')) {
    return { ok: true, json: async () => mockSkills }
  }
  return { ok: false, status: 404 }
}))

const { ref, computed, nextTick } = await import('vue')

// Import composables AFTER mocks
const { useSearch, setSearchSkills } = await import('../composables/useSearch.js')
const { useFilters } = await import('../composables/useFilters.js')
const { useBookmarks } = await import('../composables/useBookmarks.js')
const { useSkillStatus } = await import('../composables/useSkillStatus.js')

describe('搜索功能全流程测试', () => {
  let skills, query, results, clearSearch, selectedCategory, filtered, toggleCategory, clearFilters

  beforeEach(async () => {
    // Reset search state
    const search = useSearch()
    search.query.value = ''
    search.clearSearch()

    // Setup skills
    skills = ref(mockSkills)
    setSearchSkills(skills)
    await nextTick()

    // Setup search
    const s = useSearch()
    query = s.query
    results = s.results
    clearSearch = s.clearSearch

    // Setup filters
    const f = useFilters(results)
    selectedCategory = f.selectedCategory
    filtered = f.filtered
    toggleCategory = f.toggleCategory
    clearFilters = f.clearFilters
  })

  describe('场景1: 首页加载显示全部技能', () => {
    it('应显示全部5个技能', async () => {
      await nextTick()
      expect(results.value).toHaveLength(5)
      expect(filtered.value).toHaveLength(5)
    })
  })

  describe('场景2: 搜索 "superpowers" 过滤结果', () => {
    it('应只显示匹配的技能', async () => {
      query.value = 'superpowers'
      await new Promise(r => setTimeout(r, 400)) // debounce
      await nextTick()

      expect(results.value.length).toBeGreaterThan(0)
      expect(results.value.length).toBeLessThan(5)
      expect(results.value.some(s => s.slug === 'superpowers')).toBe(true)
    })
  })

  describe('场景3: 搜索后 clearSearch 恢复全部', () => {
    it('clearSearch 后应恢复全部技能', async () => {
      query.value = 'superpowers'
      await new Promise(r => setTimeout(r, 400))
      await nextTick()
      expect(results.value.length).toBeLessThan(5)

      clearSearch()
      await nextTick()

      expect(query.value).toBe('')
      expect(results.value).toHaveLength(5)
    })
  })

  describe('场景4: 清空搜索词立即生效(不等debounce)', () => {
    it('query 变空后 results 立即恢复', async () => {
      query.value = 'agent'
      await new Promise(r => setTimeout(r, 400))
      await nextTick()
      expect(results.value.length).toBeLessThan(5)

      // 直接清空 query — 不等 300ms
      query.value = ''
      await nextTick()

      // 应该立即恢复，不需要等 debounce
      expect(results.value).toHaveLength(5)
    })
  })

  describe('场景5: 搜索中文关键词', () => {
    it('搜索 "浏览器" 应返回匹配结果', async () => {
      query.value = '浏览器'
      await new Promise(r => setTimeout(r, 400))
      await nextTick()

      expect(results.value.length).toBeGreaterThan(0)
      expect(results.value.some(s => s.slug === 'agent-browser-mcp' || s.slug === 'playwright-mcp')).toBe(true)
    })
  })

  describe('场景6: 点击侧栏"全部"清搜索', () => {
    it('toggleCategory("全部") + clearSearch 后恢复全部', async () => {
      query.value = 'git'
      await new Promise(r => setTimeout(r, 400))
      await nextTick()
      expect(results.value.length).toBeLessThan(5)

      // 模拟 handleCategorySelect('全部')
      toggleCategory('全部')
      clearSearch()
      await nextTick()

      expect(selectedCategory.value).toBe('全部')
      expect(query.value).toBe('')
      expect(filtered.value).toHaveLength(5)
    })
  })

  describe('场景7: 搜索 → 进详情页 → goHome 返回', () => {
    it('goHome (clearSearch + router.push) 后搜索词清空', async () => {
      // 模拟用户在首页搜索
      query.value = 'superpowers'
      await new Promise(r => setTimeout(r, 400))
      await nextTick()
      expect(results.value.length).toBeLessThan(5)

      // 模拟用户点进详情页（搜索词仍残留）
      // 然后点 "返回列表" / "Skill Book" 标题 → goHome()
      clearSearch()
      await nextTick()

      // 验证回到首页后列表恢复全部
      expect(query.value).toBe('')
      expect(results.value).toHaveLength(5)
    })
  })

  describe('场景8: 搜索后按 Esc 清除', () => {
    it('Esc 触发 clearSearch 后恢复全部', async () => {
      query.value = 'code'
      await new Promise(r => setTimeout(r, 400))
      await nextTick()
      expect(results.value.length).toBeLessThan(5)

      // Esc → clearAndHome → clearSearch
      clearSearch()
      await nextTick()

      expect(results.value).toHaveLength(5)
    })
  })

  describe('场景9: 清空搜索框后按回车返回', () => {
    it('搜索框为空时回车触发 clearSearch', async () => {
      query.value = 'mcp'
      await new Promise(r => setTimeout(r, 400))
      await nextTick()
      expect(results.value.length).toBeLessThan(5)

      // 用户手动清空搜索框 → query = ''
      query.value = ''
      await nextTick()
      // 此时列表已经恢复（因为空搜索立即生效）
      expect(results.value).toHaveLength(5)

      // 按回车 → clearAndHome → clearSearch (二次确认)
      clearSearch()
      await nextTick()
      expect(query.value).toBe('')
      expect(results.value).toHaveLength(5)
    })
  })

  describe('场景10: 搜索 + 分类筛选组合', () => {
    it('搜索和分类可以组合使用', async () => {
      // 先选分类
      toggleCategory('编码开发')
      await nextTick()
      expect(filtered.value.length).toBeGreaterThan(0)
      const catFiltered = filtered.value.length

      // 再搜索
      query.value = 'git'
      await new Promise(r => setTimeout(r, 400))
      await nextTick()
      // 搜索结果应该在分类范围内进一步过滤
      expect(filtered.value.length).toBeLessThanOrEqual(catFiltered)

      // 清除全部
      clearFilters()
      clearSearch()
      await nextTick()
      expect(filtered.value).toHaveLength(5)
    })
  })
})
