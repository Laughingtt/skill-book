import { ref, computed } from 'vue'

export function useFilters(skills) {
  const selectedCategory = ref('全部')
  const selectedTags = ref([])

  const filtered = computed(() => {
    let result = skills.value

    if (selectedCategory.value !== '全部') {
      result = result.filter(s => s.category === selectedCategory.value)
    }

    if (selectedTags.value.length > 0) {
      result = result.filter(s =>
        selectedTags.value.every(tag => s.tags?.includes(tag))
      )
    }

    return result
  })

  function toggleCategory(category) {
    selectedCategory.value = category
  }

  function toggleTag(tag) {
    const idx = selectedTags.value.indexOf(tag)
    if (idx === -1) {
      selectedTags.value = [...selectedTags.value, tag]
    } else {
      selectedTags.value = selectedTags.value.filter(t => t !== tag)
    }
  }

  function clearFilters() {
    selectedCategory.value = '全部'
    selectedTags.value = []
  }

  return { selectedCategory, selectedTags, filtered, toggleCategory, toggleTag, clearFilters }
}