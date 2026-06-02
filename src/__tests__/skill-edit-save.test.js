import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'

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
const { useSkills } = await import('../composables/useSkills.js')
const { parseFrontmatter } = await import('../utils/frontmatter.js')

describe('updateSkillFromMd — 编辑完整 .md 文件', () => {
  let skillsModule

  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
    skillsModule = useSkills()
  })

  it('解析完整 .md 文本，更新元数据和内容', async () => {
    // Setup: skill in skills array (as if loaded from index.json)
    skillsModule.skills.value = [
      { slug: 'my-skill', name: 'My Skill', category: 'Original', tags: ['old'], description: 'Old desc', install: '', source: '' },
    ]

    // API call mock
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) })

    const rawMd = `---
slug: my-skill
name: Updated Name
category: New Category
tags: [new, fresh]
description: New description
---

# Updated Title

New body content here.`

    const result = await skillsModule.updateSkillFromMd('my-skill', rawMd)

    expect(result).not.toBeNull()
    expect(result.name).toBe('Updated Name')
    expect(result.category).toBe('New Category')
    expect(result.tags).toEqual(['new', 'fresh'])
    expect(result.description).toBe('New description')
    expect(result.content).toBe('# Updated Title\n\nNew body content here.')
    // slug preserved from original
    expect(result.slug).toBe('my-skill')
  })

  it('保存到 localStorage 和 API', async () => {
    skillsModule.skills.value = [
      { slug: 'test-skill', name: 'Test', category: 'Cat', tags: [], description: 'Desc' },
    ]

    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) })

    const rawMd = `---
slug: test-skill
name: Changed
category: Cat
tags: [a]
description: Changed desc
---

Changed body`

    await skillsModule.updateSkillFromMd('test-skill', rawMd)

    // localStorage saved
    expect(localStorageMock.setItem).toHaveBeenCalledWith('skill-book-skills', expect.any(String))
    const saved = JSON.parse(store['skill-book-skills'])
    expect(saved[0].name).toBe('Changed')
    expect(saved[0].content).toBe('Changed body')

    // API called
    expect(mockFetch).toHaveBeenCalledWith('/api/skills', expect.objectContaining({ method: 'POST' }))
  })

  it('返回 null 如果 slug 不存在', async () => {
    skillsModule.skills.value = []
    const result = await skillsModule.updateSkillFromMd('nonexistent', '---\n---\nbody')
    expect(result).toBeNull()
  })

  it('只更新 frontmatter 中存在的字段，保留其他字段', async () => {
    skillsModule.skills.value = [
      { slug: 'my-skill', name: 'My Skill', category: 'Original', tags: ['old'], description: 'Old desc', install: 'npm i foo', source: 'https://foo.com' },
    ]

    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) })

    // Edit only changes name and description, install/source stay unchanged
    const rawMd = `---
slug: my-skill
name: New Name
category: Original
tags: [old]
description: New desc
---

Body text`

    const result = await skillsModule.updateSkillFromMd('my-skill', rawMd)

    expect(result.name).toBe('New Name')
    expect(result.description).toBe('New desc')
    // Preserved fields
    expect(result.install).toBe('npm i foo')
    expect(result.source).toBe('https://foo.com')
  })
})