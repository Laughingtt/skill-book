<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useCommandPalette } from '../composables/useCommandPalette'

const { isOpen, query, highlightedIndex, filteredCommands, toggle, close, moveHighlight } = useCommandPalette()

const searchInput = ref(null)
const copiedSlug = ref(null)

// Auto-focus input when palette opens
watch(isOpen, async (val) => {
  if (val) {
    await nextTick()
    searchInput.value?.focus()
  }
})

// Copy a command to clipboard and close
async function copyAndClose(cmd) {
  try {
    await navigator.clipboard.writeText(cmd.commandCmd)
    copiedSlug.value = cmd.commandCmd
    setTimeout(() => {
      copiedSlug.value = null
    }, 800)
  } catch {
    // Fallback: silent fail
  }
  close()
}

// Global keyboard handler
function handleKeydown(e) {
  // Ctrl+K or Cmd+K to toggle
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    toggle()
    return
  }

  // Only handle the rest when palette is open
  if (!isOpen.value) return

  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    moveHighlight(1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    moveHighlight(-1)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const cmds = filteredCommands.value
    if (cmds.length > 0 && highlightedIndex.value >= 0 && highlightedIndex.value < cmds.length) {
      copyAndClose(cmds[highlightedIndex.value])
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="cmd-palette">
      <div
        v-if="isOpen"
        class="cmd-overlay"
        @click.self="close"
      >
        <div class="cmd-panel">
          <!-- Search Input -->
          <div class="cmd-search">
            <svg class="cmd-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref="searchInput"
              v-model="query"
              type="text"
              class="cmd-input"
              placeholder="搜索命令..."
              autocomplete="off"
              spellcheck="false"
            />
            <kbd class="cmd-kbd-hint">Esc</kbd>
          </div>

          <!-- Command List -->
          <div class="cmd-list">
            <div
              v-for="(cmd, i) in filteredCommands"
              :key="`${cmd.skillSlug}-${cmd.commandCmd}-${i}`"
              class="cmd-item"
              :class="{ 'cmd-item--active': i === highlightedIndex }"
              @click="copyAndClose(cmd)"
              @mouseenter="highlightedIndex = i"
            >
              <div class="cmd-item-info">
                <span class="cmd-item-skill">{{ cmd.skillName }}</span>
                <span class="cmd-item-name">{{ cmd.commandName }}</span>
              </div>
              <code class="cmd-item-code">{{ cmd.commandCmd }}</code>
            </div>

            <div v-if="filteredCommands.length === 0" class="cmd-empty">
              没有找到匹配的命令
            </div>
          </div>

          <!-- Footer -->
          <div class="cmd-footer">
            <span>↑↓ 导航</span>
            <span class="cmd-footer-sep">·</span>
            <span>↵ 复制</span>
            <span class="cmd-footer-sep">·</span>
            <span>Esc 关闭</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cmd-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  padding-top: 15vh;
}

.cmd-panel {
  width: 560px;
  max-width: calc(100vw - 2rem);
  max-height: 420px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Search area */
.cmd-search {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border);
}

.cmd-search-icon {
  width: 18px;
  height: 18px;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.cmd-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  line-height: 1.4;
}

.cmd-input::placeholder {
  color: var(--color-text-tertiary);
}

.cmd-kbd-hint {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-tertiary);
  background: var(--color-bg-recessed);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 2px 6px;
  flex-shrink: 0;
}

/* Command list */
.cmd-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2) 0;
}

.cmd-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-5);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}

.cmd-item:hover {
  background: var(--color-bg-accent);
}

.cmd-item--active {
  background: var(--color-bg-accent);
}

.cmd-item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.cmd-item-skill {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cmd-item-name {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.cmd-item-code {
  font-family: 'DM Mono', var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-accent);
  background: var(--color-bg-recessed);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
  flex-shrink: 0;
}

.cmd-empty {
  padding: var(--space-8) var(--space-5);
  text-align: center;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}

/* Footer */
.cmd-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border-top: 1px solid var(--color-border);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.cmd-footer-sep {
  opacity: 0.4;
}

/* Transition: fade-in + scale-in */
.cmd-palette-enter-active {
  transition: opacity var(--duration-base) var(--ease-out),
              transform var(--duration-base) var(--ease-out);
}

.cmd-palette-leave-active {
  transition: opacity var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}

.cmd-palette-enter-from {
  opacity: 0;
}

.cmd-palette-enter-from .cmd-panel {
  transform: scale(0.96) translateY(-8px);
  opacity: 0;
}

.cmd-palette-enter-to .cmd-panel {
  transform: scale(1) translateY(0);
  opacity: 1;
}

.cmd-palette-leave-from {
  opacity: 1;
}

.cmd-palette-leave-to {
  opacity: 0;
}

.cmd-palette-leave-to .cmd-panel {
  transform: scale(0.96) translateY(-8px);
  opacity: 0;
}
</style>
