import { ref, computed, isRef } from 'vue'

const selectedScenario = ref(null)

/**
 * Extract unique scenarios from skills.
 * Accepts either a plain array, a ref, or an object with .value (auto-unwraps).
 */
export function allScenarios(skillsInput) {
  const skills = isRef(skillsInput) ? skillsInput.value : (Array.isArray(skillsInput) ? skillsInput : (skillsInput?.value || []))
  const scenarioSet = new Set()
  skills.forEach(skill => {
    if (Array.isArray(skill.scenarios)) {
      skill.scenarios.forEach(s => { if (s) scenarioSet.add(s) })
    }
  })
  return [...scenarioSet].sort()
}

/**
 * Filter skills by selected scenario.
 * Returns a computed ref for reactivity (same as original API).
 * Accepts either a computed ref, a plain ref, or an object with .value.
 */
export function filterByScenario(skillsInput) {
  return computed(() => {
    const skills = isRef(skillsInput) ? skillsInput.value : (Array.isArray(skillsInput) ? skillsInput : (skillsInput?.value || []))
    if (!selectedScenario.value) return skills
    return skills.filter(skill =>
      Array.isArray(skill.scenarios) && skill.scenarios.includes(selectedScenario.value)
    )
  })
}

export function toggleScenario(scenario) {
  selectedScenario.value = selectedScenario.value === scenario ? null : scenario
}

export function clearScenario() {
  selectedScenario.value = null
}

export function useScenarios() {
  return {
    selectedScenario,
    allScenarios,
    filterByScenario,
    toggleScenario,
    clearScenario
  }
}
