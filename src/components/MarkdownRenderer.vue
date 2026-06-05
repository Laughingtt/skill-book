<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'

const props = defineProps({
  source: { type: String, default: '' },
})

const rendered = ref('')
const containerRef = ref(null)
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

function addCopyButtons() {
  if (!containerRef.value) return
  const preBlocks = containerRef.value.querySelectorAll('pre')
  preBlocks.forEach(pre => {
    if (pre.querySelector('.copy-btn')) return // already has button
    const btn = document.createElement('button')
    btn.className = 'copy-btn'
    btn.textContent = '复制'
    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code')
      const text = code ? code.textContent : pre.textContent
      try {
        await navigator.clipboard.writeText(text)
        btn.textContent = '✓'
        btn.classList.add('copy-btn--done')
        setTimeout(() => {
          btn.textContent = '复制'
          btn.classList.remove('copy-btn--done')
        }, 2000)
      } catch {
        btn.textContent = '失败'
        setTimeout(() => { btn.textContent = '复制' }, 2000)
      }
    })
    pre.style.position = 'relative'
    pre.appendChild(btn)
  })
}

onMounted(async () => {
  rendered.value = md.render(props.source)
  await nextTick()
  addCopyButtons()
})

watch(() => props.source, async (val) => {
  rendered.value = md.render(val)
  await nextTick()
  addCopyButtons()
})
</script>

<template>
  <div class="editorial-md" ref="containerRef" v-html="rendered"></div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap');

.editorial-md :deep(h1) {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 32px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-accent);
}

.editorial-md :deep(h2) {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.editorial-md :deep(h3) {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: 0.02em;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.editorial-md :deep(p) {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: var(--color-text-primary);
  line-height: 1.75;
  margin-bottom: 1.25rem;
}

.editorial-md :deep(code) {
  font-family: 'DM Mono', Menlo, monospace;
  font-size: 14px;
  background: var(--color-bg-accent);
  color: var(--color-accent);
  padding: 2px 6px;
  border-radius: 4px;
}

.editorial-md :deep(pre) {
  background: var(--color-bg-dark);
  color: var(--color-text-inverse);
  padding: 20px 24px;
  border-radius: 0;
  border-left: 3px solid var(--color-accent);
  overflow-x: auto;
  margin-bottom: 1.25rem;
}

.editorial-md :deep(pre code) {
  font-family: 'DM Mono', Menlo, monospace;
  font-size: 14px;
  background: none;
  color: inherit;
  padding: 0;
  border-radius: 0;
}

.editorial-md :deep(ul),
.editorial-md :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 1.25rem;
}

.editorial-md :deep(ul) {
  list-style: none;
}

.editorial-md :deep(ul) > li {
  position: relative;
  padding-left: 0.75rem;
}

.editorial-md :deep(ul) > li::before {
  content: '';
  position: absolute;
  left: -0.5rem;
  top: 0.65em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-accent);
}

.editorial-md :deep(li) {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.75;
  color: var(--color-text-primary);
  margin-bottom: 0.4rem;
}

.editorial-md :deep(blockquote) {
  border-left: 3px solid var(--color-accent);
  padding-left: 1.25rem;
  margin: 1.5rem 0;
  color: var(--color-text-secondary);
  font-style: italic;
}

.editorial-md :deep(blockquote p) {
  color: var(--color-text-secondary);
  font-style: italic;
}

.editorial-md :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.15s ease;
}

.editorial-md :deep(a:hover) {
  color: var(--color-accent-hover);
}

.editorial-md :deep(strong) {
  font-weight: 600;
  color: var(--color-text-primary);
}

.editorial-md :deep(hr) {
  border: none;
  height: 1px;
  background: var(--color-border);
  margin: 2rem 0;
}

.editorial-md :deep(em) {
  font-style: italic;
  color: var(--color-text-secondary);
}

.editorial-md :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1.5rem 0;
}

.editorial-md :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.25rem;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 15px;
}

.editorial-md :deep(th) {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  border-bottom: 2px solid rgba(0, 0, 0, 0.08);
  padding: 0.5rem 0.75rem 0.5rem 0;
  text-align: left;
}

.editorial-md :deep(td) {
  padding: 0.625rem 0.75rem 0.625rem 0;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-primary);
  vertical-align: top;
}

.editorial-md :deep(.copy-btn) {
  position: absolute;
  top: 8px;
  right: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 10px;
  background: rgba(250, 249, 246, 0.12);
  color: var(--color-text-inverse);
  border: 1px solid rgba(250, 249, 246, 0.2);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  z-index: 1;
}

.editorial-md :deep(.copy-btn:hover) {
  background: rgba(250, 249, 246, 0.2);
  border-color: rgba(250, 249, 246, 0.35);
}

.editorial-md :deep(.copy-btn--done) {
  color: var(--color-success, #4caf7d);
  border-color: var(--color-success, #4caf7d);
}
</style>
