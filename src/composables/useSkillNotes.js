import { ref } from 'vue'

const STORAGE_KEY = 'skill-book-skill-notes'

// Singleton state
const notes = ref({})

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) notes.value = JSON.parse(raw)
  } catch {
    notes.value = {}
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value))
}

// Initialize on first import
loadFromStorage()

export function useSkillNotes() {
  const getNote = (slug) => {
    return notes.value[slug] || ''
  }

  const saveNote = (slug, content) => {
    if (!content || !content.trim()) {
      // Remove empty notes
      const updated = { ...notes.value }
      delete updated[slug]
      notes.value = updated
    } else {
      notes.value = { ...notes.value, [slug]: content }
    }
    saveToStorage()
  }

  const hasNote = (slug) => {
    return !!(notes.value[slug] && notes.value[slug].trim())
  }

  const deleteNote = (slug) => {
    const updated = { ...notes.value }
    delete updated[slug]
    notes.value = updated
    saveToStorage()
  }

  return {
    notes,
    getNote,
    saveNote,
    hasNote,
    deleteNote
  }
}
