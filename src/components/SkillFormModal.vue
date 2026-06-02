<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useGithubImport } from '../composables/useGithubImport'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  skill: { type: Object, default: null },
  categories: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'save'])

const { importing, importError, apiKey, saveApiKey, tavilyApiKey, saveTavilyApiKey, importFromGithub } = useGithubImport()

// GitHub import state
const githubUrl = ref('')
const showGithubImport = ref(false)
const showApiKeyConfig = ref(false)
const apiKeyInput = ref(apiKey.value)
const tavilyApiKeyInput = ref(tavilyApiKey.value)

// Form state
const form = ref({
  name: '',
  slug: '',
  category: '',
  tags: '',
  description: '',
  install: '',
  source: '',
})

const errors = ref({})
const slugManuallyEdited = ref(false)
const categoryInput = ref('')
const importContent = ref('')

const isEditMode = computed(() => !!props.skill)
const modalTitle = computed(() => isEditMode.value ? '编辑技能' : '添加技能')

// Tag pills derived from comma-separated input
const tagPills = computed(() => {
  return form.value.tags
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)
})

// Auto-generate slug from name
function onNameInput() {
  if (!slugManuallyEdited.value) {
    form.value.slug = form.value.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '')
  }
}

function onSlugInput() {
  slugManuallyEdited.value = true
}

// Sync category: prefer dropdown selection, but allow custom input
const resolvedCategory = computed(() => {
  if (form.value.category) return form.value.category
  return categoryInput.value.trim()
})

// Reset form to blank
function resetForm() {
  form.value = {
    name: '',
    slug: '',
    category: '',
    tags: '',
    description: '',
    install: '',
    source: '',
  }
  errors.value = {}
  slugManuallyEdited.value = false
  categoryInput.value = ''
  githubUrl.value = ''
  importContent.value = ''
  importError.value = null
}

// GitHub import handler
async function handleGithubImport() {
  if (!githubUrl.value.trim()) return
  try {
    const skillData = await importFromGithub(githubUrl.value)
    form.value.name = skillData.name
    form.value.slug = skillData.slug
    form.value.description = skillData.description
    form.value.tags = Array.isArray(skillData.tags) ? skillData.tags.join(', ') : ''
    form.value.install = skillData.install || ''
    form.value.source = skillData.source || ''
    importContent.value = skillData.content || ''
    if (skillData.category) {
      const match = props.categories.find(c => c === skillData.category)
      if (match) {
        form.value.category = match
      } else {
        // Fuzzy match: find closest existing category
        const fuzzy = props.categories.find(c =>
          c.includes(skillData.category) || skillData.category.includes(c)
        )
        if (fuzzy) {
          form.value.category = fuzzy
        } else {
          form.value.category = skillData.category
        }
      }
    }
    slugManuallyEdited.value = true
  } catch {
    // importError is set by composable
  }
}

function handleSaveApiKey() {
  saveApiKey(apiKeyInput.value.trim())
}

function handleSaveTavilyApiKey() {
  saveTavilyApiKey(tavilyApiKeyInput.value.trim())
}

// Populate form from skill prop
function populateForm(skill) {
  if (!skill) {
    resetForm()
    return
  }
  form.value = {
    name: skill.name || '',
    slug: skill.slug || '',
    category: skill.category || '',
    tags: Array.isArray(skill.tags) ? skill.tags.join(', ') : (skill.tags || ''),
    description: skill.description || '',
    install: skill.install || '',
    source: skill.source || '',
  }
  slugManuallyEdited.value = !!skill.slug
  categoryInput.value = ''
  errors.value = {}
}

// Watch visibility to reset/populate
watch(() => props.modelValue, (visible) => {
  if (visible) {
    populateForm(props.skill)
    // Sync API key inputs with stored values
    apiKeyInput.value = apiKey.value
    tavilyApiKeyInput.value = tavilyApiKey.value
    nextTick(() => {
      const firstInput = document.querySelector('.modal-form input[name="name"]')
      firstInput?.focus()
    })
  }
})

// Validate
function validate() {
  const errs = {}
  if (!form.value.name.trim()) errs.name = '请输入技能名称'
  if (!form.value.slug.trim()) errs.slug = '请输入技能标识'
  if (!resolvedCategory.value) errs.category = '请选择或输入分类'
  if (!form.value.description.trim()) errs.description = '请输入技能描述'
  errors.value = errs
  return Object.keys(errs).length === 0
}

function handleSave() {
  if (!validate()) return
  emit('save', {
    name: form.value.name.trim(),
    slug: form.value.slug.trim(),
    category: resolvedCategory.value,
    tags: tagPills.value,
    description: form.value.description.trim(),
    install: form.value.install.trim(),
    source: form.value.source.trim(),
    ...(importContent.value && { content: importContent.value }),
  })
}

function handleClose() {
  emit('update:modelValue', false)
}

function handleOverlayClick(e) {
  if (e.target === e.currentTarget) {
    handleClose()
  }
}

function handleKeydown(e) {
  if (e.key === 'Escape') {
    handleClose()
  }
}
</script>

<template>
  <Transition name="modal">
    <div
      v-if="modelValue"
      class="modal-overlay"
      @click="handleOverlayClick"
      @keydown.escape="handleKeydown"
    >
      <div class="modal-container" role="dialog" aria-modal="true" :aria-label="modalTitle">
        <!-- Header -->
        <header class="modal-header">
          <h2 class="modal-title">{{ modalTitle }}</h2>
          <button class="modal-close" @click="handleClose" aria-label="关闭">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <!-- Accent rule -->
        <div class="modal-accent-rule"></div>

        <!-- GitHub Import Section (only in create mode) -->
        <div v-if="!isEditMode" class="github-import-section">
          <button type="button" class="github-import-toggle" @click="showGithubImport = !showGithubImport">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            从 GitHub 导入
            <svg class="toggle-chevron" :class="{ 'toggle-chevron--open': showGithubImport }" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4.5L6 7.5L9 4.5"/></svg>
          </button>

          <Transition name="collapse">
            <div v-if="showGithubImport" class="github-import-body">
              <!-- API Key config -->
              <div class="github-import-row">
                <input
                  type="url"
                  class="field-input github-url-input"
                  v-model="githubUrl"
                  placeholder="输入 GitHub 仓库地址，例如 https://github.com/owner/repo"
                  :disabled="importing"
                  autocomplete="off"
                />
                <button
                  type="button"
                  class="btn btn-accent github-import-btn"
                  @click="handleGithubImport"
                  :disabled="importing || !githubUrl.trim()"
                >
                  <span v-if="importing" class="import-spinner"></span>
                  <span v-else>导入</span>
                </button>
                <button type="button" class="github-key-btn" @click="showApiKeyConfig = !showApiKeyConfig" title="配置 API Key">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3m0 12l-4-4m4 4l4-4"/><path d="M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17"/></svg>
                </button>
              </div>

              <!-- API Key config panel -->
              <Transition name="collapse">
                <div v-if="showApiKeyConfig" class="github-key-config">
                  <!-- Tavily API Key (first, required for content fetch) -->
                  <label class="field-label">Tavily API Key</label>
                  <div class="github-import-row">
                    <input
                      type="password"
                      class="field-input"
                      v-model="tavilyApiKeyInput"
                      placeholder="tvly-..."
                      autocomplete="off"
                    />
                    <button type="button" class="btn btn-ghost" @click="handleSaveTavilyApiKey">保存</button>
                  </div>
                  <span v-if="tavilyApiKey" class="field-hint" style="margin-top:4px;">已配置 Key</span>

                  <!-- DeepSeek API Key (second, required for AI summarization) -->
                  <label class="field-label" style="margin-top:12px;">DeepSeek API Key</label>
                  <div class="github-import-row">
                    <input
                      type="password"
                      class="field-input"
                      v-model="apiKeyInput"
                      placeholder="sk-..."
                      autocomplete="off"
                    />
                    <button type="button" class="btn btn-ghost" @click="handleSaveApiKey">保存</button>
                  </div>
                  <span v-if="apiKey" class="field-hint" style="margin-top:4px;">已配置 Key</span>
                </div>
              </Transition>

              <!-- Error message -->
              <div v-if="importError" class="github-import-error">
                {{ importError }}
              </div>
            </div>
          </Transition>
        </div>

        <!-- Form -->
        <form class="modal-form" @submit.prevent="handleSave">
          <!-- Name -->
          <div class="field">
            <label class="field-label" for="skill-name">名称</label>
            <input
              id="skill-name"
              name="name"
              type="text"
              class="field-input"
              v-model="form.name"
              @input="onNameInput"
              placeholder="例如：数据透视表"
              autocomplete="off"
            />
            <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
          </div>

          <!-- Slug -->
          <div class="field">
            <div class="field-label-row">
              <label class="field-label" for="skill-slug">标识 (Slug)</label>
              <span class="field-hint">{{ slugManuallyEdited ? '自定义' : '自动生成' }}</span>
            </div>
            <input
              id="skill-slug"
              name="slug"
              type="text"
              class="field-input"
              v-model="form.slug"
              @input="onSlugInput"
              placeholder="例如：data-pivot-table"
              autocomplete="off"
            />
            <span v-if="errors.slug" class="field-error">{{ errors.slug }}</span>
          </div>

          <!-- Category -->
          <div class="field">
            <label class="field-label" for="skill-category">分类</label>
            <div class="category-field">
              <select
                id="skill-category"
                class="field-select"
                v-model="form.category"
              >
                <option value="" disabled>选择分类...</option>
                <option
                  v-for="cat in categories"
                  :key="cat"
                  :value="cat"
                >{{ cat }}</option>
                <option value="__custom__">自定义分类...</option>
              </select>
              <input
                v-if="form.category === '__custom__'"
                type="text"
                class="field-input field-input--sub"
                v-model="categoryInput"
                placeholder="输入新分类名称"
                autocomplete="off"
              />
            </div>
            <span v-if="errors.category" class="field-error">{{ errors.category }}</span>
          </div>

          <!-- Tags -->
          <div class="field">
            <label class="field-label" for="skill-tags">标签</label>
            <input
              id="skill-tags"
              type="text"
              class="field-input"
              v-model="form.tags"
              placeholder="用逗号分隔，例如：数据分析, Excel, 自动化"
              autocomplete="off"
            />
            <div v-if="tagPills.length" class="tag-pills">
              <span v-for="tag in tagPills" :key="tag" class="tag-pill">{{ tag }}</span>
            </div>
          </div>

          <!-- Description -->
          <div class="field">
            <label class="field-label" for="skill-description">描述</label>
            <textarea
              id="skill-description"
              class="field-textarea"
              v-model="form.description"
              placeholder="描述这个技能的用途和特点..."
              rows="4"
            ></textarea>
            <span v-if="errors.description" class="field-error">{{ errors.description }}</span>
          </div>

          <!-- Install -->
          <div class="field">
            <label class="field-label" for="skill-install">安装命令 <span class="field-optional">选填</span></label>
            <input
              id="skill-install"
              type="text"
              class="field-input"
              v-model="form.install"
              placeholder="例如：npm install @scope/skill-name"
              autocomplete="off"
            />
          </div>

          <!-- Source -->
          <div class="field">
            <label class="field-label" for="skill-source">来源链接 <span class="field-optional">选填</span></label>
            <input
              id="skill-source"
              type="url"
              class="field-input"
              v-model="form.source"
              placeholder="https://..."
              autocomplete="off"
            />
          </div>
        </form>

        <!-- Footer -->
        <footer class="modal-footer">
          <button type="button" class="btn btn-ghost" @click="handleClose">取消</button>
          <button type="button" class="btn btn-accent" @click="handleSave">保存</button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ── Overlay ──────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: var(--space-5);
}

/* ── Container ────────────────────────────────── */
.modal-container {
  position: relative;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

/* ── Header ───────────────────────────────────── */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px 0;
}

.modal-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-out);
}

.modal-close:hover {
  background: var(--color-bg-recessed);
  color: var(--color-text-primary);
}

/* ── Accent Rule ──────────────────────────────── */
.modal-accent-rule {
  width: 40px;
  height: 2px;
  background: var(--color-accent);
  border-radius: var(--radius-pill);
  margin: 16px 32px 0;
}

/* ── Form ─────────────────────────────────────── */
.modal-form {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Field ────────────────────────────────────── */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.field-label {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-tertiary);
}

.field-hint {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  color: var(--color-accent);
  letter-spacing: 0.02em;
}

.field-optional {
  font-weight: 400;
  text-transform: none;
  font-size: 11px;
  letter-spacing: 0;
  color: var(--color-text-tertiary);
  opacity: 0.7;
}

.field-input,
.field-select,
.field-textarea {
  width: 100%;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  transition: border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
  outline: none;
}

.field-input::placeholder,
.field-select::placeholder,
.field-textarea::placeholder {
  color: var(--color-text-tertiary);
  opacity: 0.6;
}

.field-input:focus,
.field-select:focus,
.field-textarea:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-muted);
}

.field-textarea {
  min-height: 100px;
  resize: vertical;
  line-height: 1.6;
}

.field-select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%238a8a87' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
  cursor: pointer;
}

.field-input--sub {
  margin-top: 8px;
}

.field-error {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-accent);
  line-height: 1.4;
}

/* ── Category field ───────────────────────────── */
.category-field {
  display: flex;
  flex-direction: column;
}

/* ── Tag Pills ────────────────────────────────── */
.tag-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.tag-pill {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  color: var(--color-accent);
  background: var(--color-accent-muted);
  border-radius: var(--radius-pill);
  padding: 3px 10px;
  letter-spacing: 0.01em;
  line-height: 1.5;
}

/* ── Footer ───────────────────────────────────── */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 32px 28px;
  border-top: 1px solid var(--color-border);
}

/* ── Vue Transitions ──────────────────────────── */
.modal-enter-active {
  transition: opacity var(--duration-base) var(--ease-out);
}

.modal-enter-active .modal-container {
  transition: opacity var(--duration-base) var(--ease-out),
              transform var(--duration-base) var(--ease-out);
}

.modal-leave-active {
  transition: opacity var(--duration-fast) var(--ease-out);
}

.modal-leave-active .modal-container {
  transition: opacity var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from .modal-container {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to .modal-container {
  opacity: 0;
  transform: translateY(8px) scale(0.99);
}

/* ── GitHub Import Section ────────────────────── */
.github-import-section {
  padding: 16px 32px 0;
}

.github-import-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-tertiary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 0;
  transition: color var(--duration-fast) var(--ease-out);
}

.github-import-toggle:hover {
  color: var(--color-text-primary);
}

.toggle-chevron {
  transition: transform var(--duration-fast) var(--ease-out);
}

.toggle-chevron--open {
  transform: rotate(180deg);
}

.github-import-body {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.github-import-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.github-url-input {
  flex: 1;
}

.github-import-btn {
  padding: 10px 20px;
  white-space: nowrap;
}

.github-key-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-out);
}

.github-key-btn:hover {
  background: var(--color-bg-recessed);
  color: var(--color-text-primary);
}

.github-key-config {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 14px;
  background: var(--color-bg-recessed);
  border-radius: var(--radius-md);
}

.github-key-config .field-input {
  flex: 1;
}

.github-key-config .github-import-row {
  gap: 8px;
}

.github-key-config .btn-ghost {
  padding: 10px 16px;
  white-space: nowrap;
}

.github-import-error {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-accent);
  line-height: 1.4;
  background: var(--color-accent-muted);
  border-radius: var(--radius-md);
  padding: 8px 12px;
}

.import-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid var(--color-text-inverse);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Collapse Transition ──────────────────────── */
.collapse-enter-active {
  transition: all var(--duration-base) var(--ease-out);
  overflow: hidden;
}

.collapse-leave-active {
  transition: all var(--duration-fast) var(--ease-out);
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 200px;
}

/* ── Responsive ───────────────────────────────── */
@media (max-width: 480px) {
  .modal-container {
    max-width: 100%;
    border-radius: var(--radius-lg);
  }

  .modal-header {
    padding: 20px 20px 0;
  }

  .modal-accent-rule {
    margin-left: 20px;
    margin-right: 20px;
  }

  .modal-form {
    padding: 20px;
  }

  .modal-footer {
    padding: 12px 20px 20px;
  }

  .modal-title {
    font-size: 22px;
  }
}
</style>
