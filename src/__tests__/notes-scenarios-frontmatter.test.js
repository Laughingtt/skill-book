import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage before importing composables
const storage = {}
const localStorageMock = {
  getItem: vi.fn((key) => storage[key] || null),
  setItem: vi.fn((key, val) => { storage[key] = val }),
  removeItem: vi.fn((key) => { delete storage[key] }),
  clear: vi.fn(() => { Object.keys(storage).forEach(k => delete storage[k]) }),
}

vi.stubGlobal('localStorage', localStorageMock)

describe('useSkillNotes', () => {
  let useSkillNotes

  beforeEach(() => {
    vi.clearAllMocks()
    Object.keys(storage).forEach(k => delete storage[k])
    vi.resetModules()
  })

  it('should save and retrieve a note', async () => {
    const mod = await import('../composables/useSkillNotes')
    useSkillNotes = mod.useSkillNotes
    const { saveNote, getNote } = useSkillNotes()

    expect(getNote('my-skill')).toBe('')

    saveNote('my-skill', 'This is my note')
    expect(getNote('my-skill')).toBe('This is my note')
  })

  it('should detect when a note exists', async () => {
    const mod = await import('../composables/useSkillNotes')
    useSkillNotes = mod.useSkillNotes
    const { saveNote, hasNote } = useSkillNotes()

    expect(hasNote('my-skill')).toBe(false)

    saveNote('my-skill', 'some content')
    expect(hasNote('my-skill')).toBe(true)
  })

  it('should remove note when saved as empty', async () => {
    const mod = await import('../composables/useSkillNotes')
    useSkillNotes = mod.useSkillNotes
    const { saveNote, getNote, hasNote } = useSkillNotes()

    saveNote('my-skill', 'content')
    expect(hasNote('my-skill')).toBe(true)

    saveNote('my-skill', '')
    expect(hasNote('my-skill')).toBe(false)
    expect(getNote('my-skill')).toBe('')
  })

  it('should remove note when saved as whitespace', async () => {
    const mod = await import('../composables/useSkillNotes')
    useSkillNotes = mod.useSkillNotes
    const { saveNote, hasNote } = useSkillNotes()

    saveNote('my-skill', '   ')
    expect(hasNote('my-skill')).toBe(false)
  })

  it('should persist notes to localStorage', async () => {
    const mod = await import('../composables/useSkillNotes')
    useSkillNotes = mod.useSkillNotes
    const { saveNote } = useSkillNotes()

    saveNote('my-skill', 'persisted note')
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'skill-book-skill-notes',
      JSON.stringify({ 'my-skill': 'persisted note' })
    )
  })

  it('should load notes from localStorage', async () => {
    storage['skill-book-skill-notes'] = JSON.stringify({ 'existing-skill': 'existing note' })
    const mod = await import('../composables/useSkillNotes')
    useSkillNotes = mod.useSkillNotes
    const { getNote, hasNote } = useSkillNotes()

    expect(getNote('existing-skill')).toBe('existing note')
    expect(hasNote('existing-skill')).toBe(true)
  })
})

describe('useScenarios', () => {
  let useScenarios

  beforeEach(() => {
    vi.resetModules()
  })

  it('should extract all unique scenarios from skills', async () => {
    const mod = await import('../composables/useScenarios')
    useScenarios = mod.useScenarios
    const { allScenarios } = useScenarios()

    const skills = { value: [
      { slug: 'a', scenarios: ['debugging', 'testing'] },
      { slug: 'b', scenarios: ['debugging', 'deployment'] },
      { slug: 'c', scenarios: [] },
      { slug: 'd' }, // no scenarios field
    ]}

    const result = allScenarios(skills)
    expect(result).toEqual(['debugging', 'deployment', 'testing'])
  })

  it('should filter skills by selected scenario', async () => {
    const mod = await import('../composables/useScenarios')
    useScenarios = mod.useScenarios
    const { toggleScenario, filterByScenario } = useScenarios()

    const skills = { value: [
      { slug: 'a', scenarios: ['debugging'] },
      { slug: 'b', scenarios: ['deployment'] },
      { slug: 'c', scenarios: ['debugging', 'testing'] },
    ]}

    toggleScenario('debugging')
    const filtered = filterByScenario(skills)
    expect(filtered.value.length).toBe(2)
    expect(filtered.value.map(s => s.slug)).toContain('a')
    expect(filtered.value.map(s => s.slug)).toContain('c')
  })

  it('should return all skills when no scenario selected', async () => {
    const mod = await import('../composables/useScenarios')
    useScenarios = mod.useScenarios
    const { filterByScenario } = useScenarios()

    const skills = { value: [
      { slug: 'a', scenarios: ['debugging'] },
      { slug: 'b', scenarios: ['deployment'] },
    ]}

    const filtered = filterByScenario(skills)
    expect(filtered.value.length).toBe(2)
  })

  it('should toggle scenario selection off', async () => {
    const mod = await import('../composables/useScenarios')
    useScenarios = mod.useScenarios
    const { toggleScenario, selectedScenario } = useScenarios()

    toggleScenario('debugging')
    expect(selectedScenario.value).toBe('debugging')

    toggleScenario('debugging')
    expect(selectedScenario.value).toBeNull()
  })
})

describe('frontmatter extended parsing', () => {
  it('should parse multi-line values with |', async () => {
    const { parseFrontmatter } = await import('../utils/frontmatter')
    const raw = `---
name: test
quickstart: |
  Step 1: install
  Step 2: configure
---
content here`
    const { data, content } = parseFrontmatter(raw)
    expect(data.name).toBe('test')
    expect(data.quickstart).toContain('Step 1: install')
    expect(data.quickstart).toContain('Step 2: configure')
    expect(content).toBe('content here')
  })

  it('should parse object arrays', async () => {
    const { parseFrontmatter } = await import('../utils/frontmatter')
    const raw = `---
name: test
commands:
  - name: "安装"
    cmd: "npm install"
  - name: "运行"
    cmd: "npm start"
---
content`
    const { data } = parseFrontmatter(raw)
    expect(data.name).toBe('test')
    expect(Array.isArray(data.commands)).toBe(true)
    expect(data.commands.length).toBe(2)
    expect(data.commands[0].name).toBe('安装')
    expect(data.commands[0].cmd).toBe('npm install')
    expect(data.commands[1].cmd).toBe('npm start')
  })

  it('should parse inline arrays', async () => {
    const { parseFrontmatter } = await import('../utils/frontmatter')
    const raw = `---
name: test
tags: [a, b, c]
---
content`
    const { data } = parseFrontmatter(raw)
    expect(data.tags).toEqual(['a', 'b', 'c'])
  })

  it('should handle missing frontmatter gracefully', async () => {
    const { parseFrontmatter } = await import('../utils/frontmatter')
    const raw = 'Just content, no frontmatter'
    const { data, content } = parseFrontmatter(raw)
    expect(data).toEqual({})
    expect(content).toBe('Just content, no frontmatter')
  })
})
