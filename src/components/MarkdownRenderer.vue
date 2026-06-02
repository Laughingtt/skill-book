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
  color: #0a0a0a;
  letter-spacing: -0.02em;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #c4553a;
}

.editorial-md :deep(h2) {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 24px;
  font-weight: 600;
  color: #0a0a0a;
  letter-spacing: -0.01em;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.editorial-md :deep(h3) {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 17px;
  font-weight: 600;
  color: #0a0a0a;
  letter-spacing: 0.02em;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.editorial-md :deep(p) {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #0a0a0a;
  line-height: 1.75;
  margin-bottom: 1.25rem;
}

.editorial-md :deep(code) {
  font-family: 'DM Mono', Menlo, monospace;
  font-size: 14px;
  background: rgba(196, 85, 58, 0.08);
  color: #c4553a;
  padding: 2px 6px;
  border-radius: 4px;
}

.editorial-md :deep(pre) {
  background: #0a0a0a;
  color: #faf9f6;
  padding: 20px 24px;
  border-radius: 0;
  border-left: 3px solid #c4553a;
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
  background: #c4553a;
}

.editorial-md :deep(li) {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.75;
  color: #0a0a0a;
  margin-bottom: 0.4rem;
}

.editorial-md :deep(blockquote) {
  border-left: 3px solid #c4553a;
  padding-left: 1.25rem;
  margin: 1.5rem 0;
  color: #6b6560;
  font-style: italic;
}

.editorial-md :deep(blockquote p) {
  color: #6b6560;
  font-style: italic;
}

.editorial-md :deep(a) {
  color: #c4553a;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.15s ease;
}

.editorial-md :deep(a:hover) {
  color: #a3442e;
}

.editorial-md :deep(strong) {
  font-weight: 600;
  color: #0a0a0a;
}

.editorial-md :deep(hr) {
  border: none;
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
  margin: 2rem 0;
}

.editorial-md :deep(em) {
  font-style: italic;
  color: #6b6560;
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
  color: #6b6560;
  border-bottom: 2px solid rgba(0, 0, 0, 0.08);
  padding: 0.5rem 0.75rem 0.5rem 0;
  text-align: left;
}

.editorial-md :deep(td) {
  padding: 0.625rem 0.75rem 0.625rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  color: #0a0a0a;
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
  color: #faf9f6;
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
  color: #4caf7d;
  border-color: #4caf7d;
}
</style>
