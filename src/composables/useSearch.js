import { ref, computed, watch } from 'vue'
import Fuse from 'fuse.js'

// Singleton state — shared search query across all views
const query = ref('')
const searchQuery = ref('')
let debounceTimer = null
let debounceWatchSetup = false

export function useSearch() {
  // Setup debounce watch once
  if (!debounceWatchSetup) {
    debounceWatchSetup = true
    watch(query, (val) => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        searchQuery.value = val
      }, 300)
    })
  }

  // Skills are injected via setSkills to avoid calling useSkills at module level
  const fuse = computed(() => {
    if (!_skills) return new Fuse([], { keys: ['name'], threshold: 0.3 })
    return new Fuse(_skills.value, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'description', weight: 1.5 },
        { name: 'tags', weight: 1 },
        { name: 'category', weight: 0.5 },
      ],
      threshold: 0.3,
      ignoreLocation: true,
    })
  })

  const results = computed(() => {
    if (!searchQuery.value.trim()) return _skills ? _skills.value : []
    return fuse.value.search(searchQuery.value).map(r => r.item)
  })

  return { query, results }
}

// Internal skills ref — set by the first component that calls this
let _skills = null

export function setSearchSkills(skills) {
  _skills = skills
}
