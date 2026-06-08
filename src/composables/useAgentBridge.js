import { ref } from 'vue'

const STORAGE_KEY = 'skill-book-agent-feedback'

// Singleton feedback log
const feedbackLog = ref([])

function loadFeedback() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) feedbackLog.value = JSON.parse(raw)
  } catch { feedbackLog.value = [] }
}
loadFeedback()

function persistFeedback() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbackLog.value))
}

export function useAgentBridge() {
  /**
   * Query skills by scenario, tags, and/or free-text.
   * Returns skills ranked by match relevance.
   */
  function querySkills(query, skills) {
    const { scenario, tags, search } = query
    let results = [...skills]

    if (scenario) {
      results = results.filter(s =>
        (s.scenarios || []).some(sc => sc.toLowerCase().includes(scenario.toLowerCase()))
      )
    }

    if (tags && tags.length > 0) {
      results = results.filter(s =>
        tags.some(t => (s.tags || []).some(st => st.toLowerCase().includes(t.toLowerCase())))
      )
    }

    if (search) {
      const q = search.toLowerCase()
      results = results.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }

    // Sort by: scenario match priority
    return results.sort((a, b) => {
      const aScenario = scenario && (a.scenarios || []).some(s => s === scenario) ? 2 : 0
      const bScenario = scenario && (b.scenarios || []).some(s => s === scenario) ? 2 : 0
      return bScenario - aScenario
    }).slice(0, 5)
  }

  /**
   * Format a skill into a system-prompt-ready fragment for Agent injection.
   */
  function formatSkillForAgent(skill) {
    const parts = [
      `## Skill: ${skill.name}`,
      `Slug: ${skill.slug}`,
      `Category: ${skill.category}`,
    ]
    if (skill.description) parts.push(`Description: ${skill.description}`)
    if (skill.tags?.length) parts.push(`Tags: ${skill.tags.join(', ')}`)
    if (skill.scenarios?.length) parts.push(`Scenarios: ${skill.scenarios.join(', ')}`)
    if (skill.commands?.length) {
      parts.push('Commands:')
      skill.commands.forEach(cmd => {
        parts.push(`  - ${cmd.name}: \`${cmd.cmd}\``)
      })
    }
    if (skill.quickstart) parts.push(`Quickstart:\n${skill.quickstart}`)
    return parts.join('\n')
  }

  /**
   * Record agent execution feedback for quality scoring.
   */
  function recordFeedback(slug, outcome) {
    const entry = {
      slug,
      outcome, // 'success' | 'failed' | 'partial'
      at: new Date().toISOString(),
    }
    feedbackLog.value = [...feedbackLog.value, entry].slice(-500)
    persistFeedback()
  }

  /**
   * Get quality score based on feedback history for a skill.
   * Returns null if no feedback exists.
   */
  function getQualityScore(slug) {
    const entries = feedbackLog.value.filter(e => e.slug === slug)
    if (entries.length === 0) return null
    const successCount = entries.filter(e => e.outcome === 'success').length
    return Math.round((successCount / entries.length) * 100)
  }

  return {
    querySkills,
    formatSkillForAgent,
    recordFeedback,
    getQualityScore,
    feedbackLog,
  }
}
