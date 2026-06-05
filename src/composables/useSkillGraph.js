/**
 * useSkillGraph — computes skill relationship graph data
 *
 * Scoring algorithm:
 *   - Manual declaration via `related` field: weight 3 per entry
 *   - Same `category`: weight 1
 *   - Tag overlap: weight 0.5 per overlapping tag
 *   - Scenario overlap: weight 0.5 per overlapping scenario
 *   - Threshold: total score >= 2 creates an edge
 *
 * Returns: { nodes: [{id, name, category}], edges: [{source, target, score}] }
 *   nodes[0] is always the current skill (center)
 */

export function computeRelations(currentSlug, skills) {
  if (!currentSlug || !skills || !skills.length) {
    return { nodes: [], edges: [] }
  }

  const current = skills.find(s => s.slug === currentSlug)
  if (!current) {
    return { nodes: [], edges: [] }
  }

  // Build nodes: current skill first, then others
  const nodes = [
    { id: current.slug, name: current.name, category: current.category || '' }
  ]

  const otherSkills = skills.filter(s => s.slug !== currentSlug)
  for (const s of otherSkills) {
    nodes.push({ id: s.slug, name: s.name, category: s.category || '' })
  }

  // Compute edges
  const edges = []
  const currentTags = current.tags || []
  const currentScenarios = current.scenarios || []
  const currentRelated = current.related || []

  for (const s of otherSkills) {
    let score = 0

    // Manual declaration via `related` field
    if (currentRelated.includes(s.slug)) {
      score += 3
    }
    // Also check if the other skill declares current as related
    const sRelated = s.related || []
    if (sRelated.includes(currentSlug)) {
      score += 3
    }

    // Same category
    if (s.category && current.category && s.category === current.category) {
      score += 1
    }

    // Tag overlap
    const sTags = s.tags || []
    const tagOverlap = sTags.filter(t => currentTags.includes(t)).length
    score += tagOverlap * 0.5

    // Scenario overlap
    const sScenarios = s.scenarios || []
    const scenarioOverlap = sScenarios.filter(sc => currentScenarios.includes(sc)).length
    score += scenarioOverlap * 0.5

    // Threshold
    if (score >= 2) {
      edges.push({ source: currentSlug, target: s.slug, score })
    }
  }

  // Sort edges by score descending
  edges.sort((a, b) => b.score - a.score)

  // Filter nodes: keep current + only nodes that appear in edges
  const connectedSlugs = new Set()
  for (const e of edges) {
    connectedSlugs.add(e.source)
    connectedSlugs.add(e.target)
  }

  const filteredNodes = nodes.filter(n => connectedSlugs.has(n.id))

  return { nodes: filteredNodes, edges }
}

export function useSkillGraph() {
  return { computeRelations }
}
