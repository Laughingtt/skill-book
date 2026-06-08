import { computed } from 'vue'
import { useSkills } from './useSkills'
import { useSkillStatus } from './useSkillStatus'

/**
 * Topological sort to find the learning path from unmet prerequisites to target.
 * Returns skills whose prerequisites are NOT yet mastered/learned,
 * in the order they should be learned.
 */
export function computeLearningPath(targetSlug, skills, statuses) {
  const target = skills.find(s => s.slug === targetSlug)
  if (!target) return []

  const result = []
  const visited = new Set()
  const masteredOrLearning = new Set(
    Object.entries(statuses)
      .filter(([, s]) => s === 'mastered' || s === 'learning')
      .map(([slug]) => slug)
  )

  function visit(slug) {
    if (visited.has(slug)) return
    visited.add(slug)
    const skill = skills.find(s => s.slug === slug)
    if (!skill) return
    const prereqs = skill.prerequisites || []
    for (const pre of prereqs) {
      if (!masteredOrLearning.has(pre) && !visited.has(pre)) {
        visit(pre)
      }
    }
    if (!masteredOrLearning.has(slug) && slug !== targetSlug) {
      result.push(skill)
    }
  }

  visit(targetSlug)
  return result
}

/**
 * Find skills the user is ready to learn:
 * - All prerequisites are mastered or learning
 * - User hasn't started this skill yet (no status)
 */
export function findNextSkill(skills, statuses) {
  const started = new Set(Object.keys(statuses))
  const masteredOrLearning = new Set(
    Object.entries(statuses)
      .filter(([, s]) => s === 'mastered' || s === 'learning')
      .map(([slug]) => slug)
  )

  return skills.filter(skill => {
    if (started.has(skill.slug)) return false
    const prereqs = skill.prerequisites || []
    if (prereqs.length === 0) return true
    return prereqs.every(p => masteredOrLearning.has(p))
  })
}

export function useLearningPath() {
  const { skills } = useSkills()
  const { statuses } = useSkillStatus()

  const readySkills = computed(() => {
    return findNextSkill(skills.value, statuses.value)
  })

  function getPathTo(targetSlug) {
    return computeLearningPath(targetSlug, skills.value, statuses.value)
  }

  return {
    readySkills,
    getPathTo,
  }
}
