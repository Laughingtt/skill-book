import { ref, computed } from 'vue'

const STORAGE_KEY = 'skill-book-bookmarks'

// Singleton state
const bookmarks = ref([])

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) bookmarks.value = JSON.parse(raw)
  } catch {
    bookmarks.value = []
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks.value))
}

// Initialize on first import
loadFromStorage()

export function useBookmarks() {
  const isBookmarked = (slug) => {
    return computed(() => bookmarks.value.includes(slug))
  }

  const toggleBookmark = (slug) => {
    const idx = bookmarks.value.indexOf(slug)
    if (idx === -1) {
      bookmarks.value = [...bookmarks.value, slug]
    } else {
      bookmarks.value = bookmarks.value.filter(s => s !== slug)
    }
    saveToStorage()
  }

  const clearBookmark = (slug) => {
    bookmarks.value = bookmarks.value.filter(s => s !== slug)
    saveToStorage()
  }

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    clearBookmark
  }
}
