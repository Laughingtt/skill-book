import { ref, computed } from 'vue'

// Singleton state
const selectedScenario = ref(null)

export function useScenarios() {
  const allScenarios = (skills) => {
    const scenarios = new Set()
    skills.value.forEach(s => {
      if (Array.isArray(s.scenarios)) {
        s.scenarios.forEach(sc => scenarios.add(sc))
      }
    })
    return Array.from(scenarios).sort()
  }

  const filterByScenario = (skills) => {
    if (!selectedScenario.value) return skills
    return computed(() => {
      return skills.value.filter(s =>
        Array.isArray(s.scenarios) && s.scenarios.includes(selectedScenario.value)
      )
    })
  }

  const toggleScenario = (scenario) => {
    if (selectedScenario.value === scenario) {
      selectedScenario.value = null
    } else {
      selectedScenario.value = scenario
    }
  }

  const clearScenario = () => {
    selectedScenario.value = null
  }

  return {
    selectedScenario,
    allScenarios,
    filterByScenario,
    toggleScenario,
    clearScenario
  }
}
