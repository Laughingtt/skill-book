import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'skill-book-settings'

function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

const settings = ref(loadSettings())

// Default theme is 'system'
if (!settings.value.theme) {
  settings.value.theme = 'system'
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
}

// Media query listener for system theme changes
let mediaQuery = null
let systemDark = ref(false)

if (typeof window !== 'undefined') {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemDark.value = mediaQuery.matches
  mediaQuery.addEventListener('change', (e) => {
    systemDark.value = e.matches
  })
}

export function useSettings() {
  const theme = computed({
    get: () => settings.value.theme || 'system',
    set: (val) => {
      settings.value = { ...settings.value, theme: val }
      persist()
    }
  })

  const effectiveTheme = computed(() => {
    if (settings.value.theme === 'dark') return 'dark'
    if (settings.value.theme === 'light') return 'light'
    return systemDark.value ? 'dark' : 'light'
  })

  function setTheme(t) {
    settings.value = { ...settings.value, theme: t }
    persist()
  }

  return {
    theme,
    effectiveTheme,
    setTheme,
    settings,
  }
}
