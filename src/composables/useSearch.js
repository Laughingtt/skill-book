import { ref, computed, watch } from 'vue'
import Fuse from 'fuse.js'

// Single search query — no debounce split, no timing bugs
const query = ref('')

// Skills data — synced from useSkills
const _skills = ref([])

export function useSearch() {
  const fuse = computed(() => {
    const data = _skills.value
    if (!data || !data.length) return null
    return new Fuse(data, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'description', weight: 1.5 },
        { name: 'tags', weight: 1 },
        { name: 'category', weight: 0.5 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
    })
  })

  const results = computed(() => {
    const data = _skills.value
    const q = query.value
    if (!q || !q.trim()) return data || []
    if (!fuse.value) return data || []
    return fuse.value.search(q.trim()).map(r => r.item)
  })

  function clearSearch() {
    query.value = ''
  }

  return { query, results, clearSearch }
}

export function setSearchSkills(skillsRef) {
  watch(skillsRef, (val) => {
    _skills.value = val
  }, { immediate: true, deep: true })
}