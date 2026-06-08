import { describe, it, expect } from 'vitest'

const { computeLearningPath, findNextSkill } = await import('../composables/useLearningPath.js')

const sampleSkills = [
  { slug: 'git-basics', name: 'Git Basics', category: 'Dev', tags: ['git'], prerequisites: [] },
  { slug: 'git-smart-commit', name: 'Smart Commit', category: 'Dev', tags: ['git', 'commit'], prerequisites: ['git-basics'] },
  { slug: 'code-refactor', name: 'Code Refactor', category: 'Dev', tags: ['refactor'], prerequisites: ['git-basics'] },
  { slug: 'deploy-to-vercel', name: 'Deploy Vercel', category: 'DevOps', tags: ['deploy'], prerequisites: ['git-smart-commit'] },
  { slug: 'tdd', name: 'TDD', category: 'Quality', tags: ['testing'], prerequisites: [] },
  { slug: 'frontend-design', name: 'Frontend Design', category: 'Design', tags: ['design'], prerequisites: [] },
]

const sampleStatuses = {
  'git-basics': 'mastered',
  'tdd': 'learning',
}

describe('computeLearningPath', () => {
  it('returns empty array when target skill has no prerequisites', () => {
    const path = computeLearningPath('frontend-design', sampleSkills, sampleStatuses)
    expect(path).toEqual([])
  })

  it('returns all prerequisites in topological order for a deep chain', () => {
    const path = computeLearningPath('deploy-to-vercel', sampleSkills, sampleStatuses)
    // git-basics already mastered → not in path; git-smart-commit NOT mastered → in path
    expect(path.map(s => s.slug)).toEqual(['git-smart-commit'])
  })

  it('includes unmet prerequisites even if user has not started them', () => {
    const path = computeLearningPath('deploy-to-vercel', sampleSkills, {})
    expect(path.map(s => s.slug)).toEqual(['git-basics', 'git-smart-commit'])
  })

  it('returns empty array for unknown slug', () => {
    const path = computeLearningPath('nonexistent', sampleSkills, sampleStatuses)
    expect(path).toEqual([])
  })
})

describe('findNextSkill', () => {
  it('recommends skills whose prerequisites are met', () => {
    const next = findNextSkill(sampleSkills, sampleStatuses)
    const slugs = next.map(s => s.slug)
    expect(slugs).toContain('git-smart-commit')
    expect(slugs).toContain('code-refactor')
    expect(slugs).not.toContain('deploy-to-vercel')
  })

  it('recommends skills with no prerequisites even without any statuses', () => {
    const next = findNextSkill(sampleSkills, {})
    const slugs = next.map(s => s.slug)
    expect(slugs).toContain('git-basics')
    expect(slugs).toContain('tdd')
    expect(slugs).toContain('frontend-design')
  })
})
