import { ref, computed } from 'vue'
import Fuse from 'fuse.js'
import { useSkills } from './useSkills'

// Singleton state
const isOpen = ref(false)
const query = ref('')
const highlightedIndex = ref(0)

// Fuse instance for fuzzy search
let fuseInstance = null

export function useCommandPalette() {
  const { skills } = useSkills()

  // Flatten all skill commands into array of { skillSlug, skillName, commandName, commandCmd }
  const commandEntries = computed(() => {
    const entries = []
    for (const skill of skills.value) {
      if (!skill.commands || !Array.isArray(skill.commands)) continue

      for (const cmd of skill.commands) {
        // Handle both string and object formats
        let commandName, commandCmd
        if (typeof cmd === 'string') {
          commandName = '命令'
          commandCmd = cmd
        } else if (cmd && typeof cmd === 'object') {
          commandName = cmd.name || '命令'
          commandCmd = cmd.cmd || ''
        } else {
          continue
        }

        entries.push({
          skillSlug: skill.slug,
          skillName: skill.name,
          commandName,
          commandCmd
        })
      }
    }
    return entries
  })

  // Create/update Fuse instance when commandEntries changes
  const fuse = computed(() => {
    const data = commandEntries.value
    if (!data || !data.length) return null
    return new Fuse(data, {
      keys: [
        { name: 'commandCmd', weight: 2 },
        { name: 'commandName', weight: 1.5 },
        { name: 'skillName', weight: 1 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
    })
  })

  // Filter commands based on query
  const filteredCommands = computed(() => {
    const q = query.value
    const entries = commandEntries.value

    if (!q || !q.trim()) {
      // Return all entries sorted by skillName
      return [...entries].sort((a, b) => a.skillName.localeCompare(b.skillName))
    }

    if (!fuse.value) return entries

    // Return Fuse.js search results mapped to items
    return fuse.value.search(q.trim()).map(r => r.item)
  })

  // Open the command palette
  function open() {
    isOpen.value = true
    query.value = ''
    highlightedIndex.value = 0
  }

  // Close the command palette
  function close() {
    isOpen.value = false
    query.value = ''
    highlightedIndex.value = 0
  }

  // Toggle the command palette
  function toggle() {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  // Move highlight up or down
  function moveHighlight(dir) {
    const max = filteredCommands.value.length - 1
    if (max < 0) {
      highlightedIndex.value = 0
      return
    }

    let next = highlightedIndex.value + dir
    if (next < 0) next = max
    else if (next > max) next = 0
    highlightedIndex.value = next
  }

  return {
    isOpen,
    query,
    highlightedIndex,
    commandEntries,
    filteredCommands,
    open,
    close,
    toggle,
    moveHighlight
  }
}
