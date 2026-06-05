import { describe, it, expect } from 'vitest'
import { parseFrontmatter } from '../utils/frontmatter'

describe('parseFrontmatter — related field', () => {
  it('should parse related as an inline array of slugs', () => {
    const md = `---
slug: my-skill
name: My Skill
related: [git-smart-commit, playwright-cli, code-review]
---
Content here`
    const { data } = parseFrontmatter(md)
    expect(data.related).toEqual(['git-smart-commit', 'playwright-cli', 'code-review'])
  })

  it('should parse related as an empty array', () => {
    const md = `---
slug: my-skill
name: My Skill
related: []
---
Content here`
    const { data } = parseFrontmatter(md)
    expect(data.related).toEqual([])
  })

  it('should return undefined when related field is missing', () => {
    const md = `---
slug: my-skill
name: My Skill
---
Content here`
    const { data } = parseFrontmatter(md)
    expect(data.related).toBeUndefined()
  })

  it('should parse both related and tags arrays correctly', () => {
    const md = `---
slug: my-skill
name: My Skill
tags: [tag1, tag2]
related: [slug-a, slug-b]
---
Content here`
    const { data } = parseFrontmatter(md)
    expect(data.tags).toEqual(['tag1', 'tag2'])
    expect(data.related).toEqual(['slug-a', 'slug-b'])
  })
})
