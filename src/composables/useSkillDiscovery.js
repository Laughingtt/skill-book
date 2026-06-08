import { ref } from 'vue'

const discovering = ref(false)
const discoveredSkills = ref([])
const discoveryError = ref(null)

export function useSkillDiscovery() {
  function filterByQuality(skills, { minScore = 5 } = {}) {
    return skills.filter(s => {
      const q = s.quality
      if (!q || q.score === undefined) return true
      return q.score >= minScore
    })
  }

  function getStaleSkills(skills, { freshnessThreshold = 5, daysThreshold = 180 } = {}) {
    const now = Date.now()
    return skills.filter(s => {
      const q = s.quality
      if (!q) return false
      if (q.freshness !== undefined && q.freshness < freshnessThreshold) return true
      if (s.lastVerified) {
        const verifiedAt = new Date(s.lastVerified).getTime()
        const ageInDays = (now - verifiedAt) / (24 * 60 * 60 * 1000)
        if (ageInDays > daysThreshold) return true
      }
      return false
    }).map(s => ({
      ...s,
      reason: `上次验证: ${s.lastVerified || '未知'}`,
    }))
  }

  function computeDynamicScore(skill, usageStats = {}, feedbackLog = []) {
    let score = 5 // base

    // Quality data adjustments
    if (skill.quality) {
      score += ((skill.quality.score || 5) - 5) * 0.3
    }

    // Usage-based adjustment
    const stats = usageStats[skill.slug]
    if (stats) {
      const views = stats.views || 0
      if (views > 10) score += 1
      if (views > 50) score += 1

      // Recent usage bonus
      if (stats.lastViewedAt) {
        const daysSinceView = (Date.now() - new Date(stats.lastViewedAt).getTime()) / (24 * 60 * 60 * 1000)
        if (daysSinceView < 7) score += 1
        if (daysSinceView > 90) score -= 1
      }
    }

    // Feedback-based adjustment
    const feedback = (feedbackLog || []).filter(f => f.slug === skill.slug)
    if (feedback.length > 0) {
      const successRate = feedback.filter(f => f.outcome === 'success').length / feedback.length
      score += (successRate - 0.5) * 2
    }

    return Math.max(0, Math.min(10, Math.round(score * 10) / 10))
  }

  return {
    discovering,
    discoveredSkills,
    discoveryError,
    filterByQuality,
    getStaleSkills,
    computeDynamicScore,
  }
}
