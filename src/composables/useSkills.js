import { ref, computed } from 'vue'
import { parseFrontmatter } from '../utils/frontmatter'

const skills = ref([])
const loading = ref(false)
const error = ref(null)
let loaded = false
const userSlugs = new Set()

async function saveSkillToApi(skill) {
  try {
    await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: skill.slug,
        frontmatter: {
          name: skill.name,
          category: skill.category,
          tags: skill.tags,
          description: skill.description,
          install: skill.install,
          source: skill.source,
          ...(skill.scenarios?.length && { scenarios: skill.scenarios }),
          ...(skill.commands?.length && { commands: skill.commands }),
          ...(skill.quickstart && { quickstart: skill.quickstart }),
          ...(skill.related?.length && { related: skill.related }),
        },
        content: skill.content || '',
      }),
    })
  } catch {
    // API not available (production build) — skill only in localStorage
  }
}

async function deleteSkillFromApi(slug) {
  try {
    await fetch(`/api/skills/${slug}`, { method: 'DELETE' })
  } catch {
    // API not available
  }
}

export function useSkills() {
  function saveToStorage() {
    const userSkills = skills.value.filter(s => userSlugs.has(s.slug))
    localStorage.setItem('skill-book-skills', JSON.stringify(userSkills))
  }

  function loadFromStorage() {
    const stored = localStorage.getItem('skill-book-skills')
    if (!stored) return
    try {
      const storedSkills = JSON.parse(stored)
      if (!Array.isArray(storedSkills)) return
      const slugMap = new Map(skills.value.map(s => [s.slug, s]))
      for (const storedSkill of storedSkills) {
        userSlugs.add(storedSkill.slug)
        if (slugMap.has(storedSkill.slug)) {
          Object.assign(slugMap.get(storedSkill.slug), storedSkill)
        } else {
          skills.value.push(storedSkill)
        }
      }
    } catch {
      // ignore corrupted localStorage data
    }
  }

  async function fetchSkills() {
    if (loaded) return
    loading.value = true
    error.value = null
    try {
      const res = await fetch('/skills/index.json')
      if (!res.ok) throw new Error(`Failed to load skills: HTTP ${res.status}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        skills.value = data
      }
      loadFromStorage()
      loaded = true
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function addSkill(skillData) {
    if (!skillData.name) throw new Error('Skill name is required')
    const slug = skillData.slug || skillData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (!slug) throw new Error('Skill slug is required')
    const newSkill = {
      name: skillData.name,
      slug,
      category: skillData.category || '',
      tags: skillData.tags || [],
      description: skillData.description || '',
      ...(skillData.install && { install: skillData.install }),
      ...(skillData.source && { source: skillData.source }),
      ...(skillData.content && { content: skillData.content }),
      ...(skillData.scenarios?.length && { scenarios: skillData.scenarios }),
      ...(skillData.commands?.length && { commands: skillData.commands }),
      ...(skillData.quickstart && { quickstart: skillData.quickstart }),
      ...(skillData.related?.length && { related: skillData.related }),
    }
    userSlugs.add(slug)
    skills.value.push(newSkill)
    saveToStorage()
    await saveSkillToApi(newSkill)
    return newSkill
  }

  async function updateSkill(slug, skillData) {
    const index = skills.value.findIndex(s => s.slug === slug)
    if (index === -1) return null
    const existing = skills.value[index]
    const updated = { ...existing, ...skillData }
    if (!skillData.slug) {
      updated.slug = existing.slug
    }
    userSlugs.add(updated.slug)
    skills.value[index] = updated
    saveToStorage()
    await saveSkillToApi(updated)
    return updated
  }

  async function deleteSkill(slug) {
    const index = skills.value.findIndex(s => s.slug === slug)
    if (index === -1) return false
    skills.value.splice(index, 1)
    userSlugs.delete(slug)
    saveToStorage()
    await deleteSkillFromApi(slug)
    return true
  }

  async function updateSkillContent(slug, newContent) {
    const index = skills.value.findIndex(s => s.slug === slug)
    if (index === -1) return null
    skills.value[index] = { ...skills.value[index], content: newContent }
    userSlugs.add(slug)
    saveToStorage()
    await saveSkillToApi(skills.value[index])
    return skills.value[index]
  }

  async function updateSkillFromMd(slug, rawMd) {
    const index = skills.value.findIndex(s => s.slug === slug)
    if (index === -1) return null
    const { data, content: body } = parseFrontmatter(rawMd)
    const existing = skills.value[index]
    const updated = {
      ...existing,
      name: data.name || existing.name,
      category: data.category || existing.category,
      tags: data.tags || existing.tags,
      description: data.description || existing.description,
      ...(data.install && { install: data.install }),
      ...(data.source && { source: data.source }),
      ...(data.scenarios && { scenarios: data.scenarios }),
      ...(data.commands && { commands: data.commands }),
      ...(data.quickstart && { quickstart: data.quickstart }),
      ...(data.related && { related: data.related }),
      content: body,
    }
    skills.value[index] = updated
    userSlugs.add(slug)
    saveToStorage()
    await saveSkillToApi(updated)
    return updated
  }

  const categories = computed(() => {
    const cats = new Set(skills.value.map(s => s.category).filter(Boolean))
    return ['全部', ...Array.from(cats).sort()]
  })

  const allTags = computed(() => {
    const tags = new Set()
    skills.value.forEach(s => {
      if (Array.isArray(s.tags)) s.tags.forEach(t => tags.add(t))
    })
    return Array.from(tags).sort()
  })

  const getSkillBySlug = (slug) => {
    return skills.value.find(s => s.slug === slug) || null
  }

  return {
    skills,
    loading,
    error,
    fetchSkills,
    addSkill,
    updateSkill,
    updateSkillContent,
    updateSkillFromMd,
    deleteSkill,
    categories,
    allTags,
    getSkillBySlug,
  }
}
