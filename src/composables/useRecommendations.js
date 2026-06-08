import { computed } from 'vue'
import { useSkills } from './useSkills'
import { useSkillStatus } from './useSkillStatus'
import { useBookmarks } from './useBookmarks'
import { useUsageTracker } from './useUsageTracker'

export function computeRecommendations(skills, statuses, bookmarks, stats) {
  const started = new Set(Object.keys(statuses))
  const masteredSlugs = new Set(
    Object.entries(statuses).filter(([, s]) => s === 'mastered').map(([slug]) => slug)
  )
  const bookmarkedSlugs = new Set(bookmarks)

  // Build interest profile from mastered + bookmarked skills
  const interestTags = new Map()
  const interestCategories = new Map()
  const interestScenarios = new Map()

  for (const skill of skills) {
    const weight = (masteredSlugs.has(skill.slug) ? 3 : 0) + (bookmarkedSlugs.has(skill.slug) ? 2 : 0)
    if (weight === 0) continue
    for (const tag of (skill.tags || [])) {
      interestTags.set(tag, (interestTags.get(tag) || 0) + weight)
    }
    if (skill.category) {
      interestCategories.set(skill.category, (interestCategories.get(skill.category) || 0) + weight)
    }
    for (const sc of (skill.scenarios || [])) {
      interestScenarios.set(sc, (interestScenarios.get(sc) || 0) + weight)
    }
  }

  // Also consider recently used scenarios
  for (const [slug, stat] of Object.entries(stats)) {
    if (stat.lastScenario) {
      interestScenarios.set(stat.lastScenario, (interestScenarios.get(stat.lastScenario) || 0) + 1)
    }
  }

  // Score unstarted skills
  const candidates = skills
    .filter(s => !started.has(s.slug))
    .map(skill => {
      let score = 0
      for (const tag of (skill.tags || [])) {
        score += (interestTags.get(tag) || 0) * 0.5
      }
      score += (interestCategories.get(skill.category) || 0) * 1.0
      for (const sc of (skill.scenarios || [])) {
        score += (interestScenarios.get(sc) || 0) * 0.5
      }
      // Bonus for skills whose prerequisites are met
      const prereqs = skill.prerequisites || []
      if (prereqs.length > 0 && prereqs.every(p => masteredSlugs.has(p))) {
        score += 2
      }
      // Freshness bonus: skills with no prerequisites get small boost
      if (prereqs.length === 0) score += 0.5
      return { ...skill, score }
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)

  return candidates.slice(0, 6)
}

export function useRecommendations() {
  const { skills } = useSkills()
  const { statuses } = useSkillStatus()
  const { bookmarks } = useBookmarks()
  const { stats } = useUsageTracker()

  const recommendations = computed(() => {
    return computeRecommendations(skills.value, statuses.value, bookmarks.value, stats.value)
  })

  return { recommendations }
}
