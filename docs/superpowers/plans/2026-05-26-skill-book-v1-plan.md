# Skill Book V1 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vue3 SPA that browses and searches skill knowledge articles from Markdown files, with Apple-style UI.

**Architecture:** Static SPA with build-time index generation. Vue Router handles two routes (home + detail). Composables manage data fetching, search, and filtering. TailwindCSS implements Apple design tokens.

**Tech Stack:** Vue 3.5+, Vite 6, Vue Router 4 (hash mode), TailwindCSS 4, gray-matter, markdown-it, fuse.js, Inter font

---

## File Structure

```
skill-book/
├── public/
│   └── skills/
│       ├── index.json          # Build-time generated
│       ├── vue-skill.md
│       └── python-skill.md
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── tokens.css      # Apple design tokens
│   ├── components/
│   │   ├── GlobalNav.vue
│   │   ├── SubNav.vue
│   │   ├── SearchBar.vue
│   │   ├── CategorySidebar.vue
│   │   ├── TagCloud.vue
│   │   ├── SkillCard.vue
│   │   └── MarkdownRenderer.vue
│   ├── composables/
│   │   ├── useSkills.js
│   │   ├── useSearch.js
│   │   └── useFilters.js
│   ├── router/
│   │   └── index.js
│   ├── views/
│   │   ├── HomeView.vue
│   │   └── SkillDetailView.vue
│   ├── App.vue
│   └── main.js
├── scripts/
│   └── build-skills.js
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

### Task 1: Project Scaffold & Dependencies

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/App.vue`

- [ ] **Step 1: Initialize Vite project and install dependencies**

```bash
cd /mnt/d/projects/skill-book
npm create vite@latest . -- --template vue
npm install
npm install vue-router@4 gray-matter markdown-it fuse.js
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 2: Configure Vite with TailwindCSS plugin**

Replace `vite.config.js`:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

- [ ] **Step 3: Configure TailwindCSS**

Replace `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'action-blue': '#0066cc',
        'parchment': '#f5f5f7',
        'hairline': 'rgba(0,0,0,0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '18px',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Create tokens.css with Apple design tokens**

Create `src/assets/styles/tokens.css`:

```css
@import "tailwindcss";

:root {
  --color-action-blue: #0066cc;
  --color-parchment: #f5f5f7;
  --color-text-primary: #1d1d1f;
  --color-text-secondary: #6e6e73;
  --color-bg-white: #ffffff;
  --color-bg-parchment: #f5f5f7;
  --color-border-hairline: rgba(0, 0, 0, 0.08);
  --radius-card: 18px;
  --radius-pill: 9999px;
  --nav-height: 44px;
  --subnav-height: 52px;
  --sidebar-width: 240px;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 17px;
  font-weight: 400;
  color: var(--color-text-primary);
  background-color: var(--color-bg-parchment);
  -webkit-font-smoothing: antialiased;
  margin: 0;
}
```

- [ ] **Step 5: Set up main.js with router import**

Replace `src/main.js`:

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/tokens.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

- [ ] **Step 6: Create App.vue with router-view**

Replace `src/App.vue`:

```vue
<script setup>
import GlobalNav from './components/GlobalNav.vue'
</script>

<template>
  <GlobalNav />
  <router-view />
</template>
```

- [ ] **Step 7: Update index.html with Inter font**

Replace `index.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Skill Book</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: Dev server starts at localhost:5173, no errors in console.

- [ ] **Step 9: Commit**

```bash
git add package.json vite.config.js tailwind.config.js index.html src/main.js src/App.vue src/assets/styles/tokens.css
git commit -m "feat: scaffold Vue3 project with Vite, TailwindCSS, and Apple design tokens"
```

---

### Task 2: Vue Router Setup

**Files:**
- Create: `src/router/index.js`
- Create: `src/views/HomeView.vue`
- Create: `src/views/SkillDetailView.vue`

- [ ] **Step 1: Create router with two routes**

Create `src/router/index.js`:

```js
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/skill/:slug',
      name: 'skill-detail',
      component: () => import('../views/SkillDetailView.vue'),
    },
  ],
})

export default router
```

- [ ] **Step 2: Create HomeView placeholder**

Create `src/views/HomeView.vue`:

```vue
<script setup>
</script>

<template>
  <div class="p-8">
    <h1 class="text-[40px] font-semibold tracking-tight">Skill Book</h1>
    <p class="text-[var(--color-text-secondary)] mt-2">技能知识库</p>
  </div>
</template>
```

- [ ] **Step 3: Create SkillDetailView placeholder**

Create `src/views/SkillDetailView.vue`:

```vue
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = route.params.slug
</script>

<template>
  <div class="p-8">
    <h1 class="text-[40px] font-semibold tracking-tight">Skill: {{ slug }}</h1>
  </div>
</template>
```

- [ ] **Step 4: Verify routing works**

```bash
npm run dev
```

Expected: Navigate to `http://localhost:5173/` shows "Skill Book". Navigate to `http://localhost:5173/#/skill/test` shows "Skill: test".

- [ ] **Step 5: Commit**

```bash
git add src/router/index.js src/views/HomeView.vue src/views/SkillDetailView.vue
git commit -m "feat: add Vue Router with home and skill-detail routes"
```

---

### Task 3: Build-Time Index Generator & Sample Skills

**Files:**
- Create: `scripts/build-skills.js`
- Create: `public/skills/vue-skill.md`
- Create: `public/skills/python-skill.md`
- Create: `public/skills/debug-skill.md`
- Create: `public/skills/design-skill.md`
- Modify: `package.json` (add build:skills script)

- [ ] **Step 1: Create sample skill markdown files**

Create `public/skills/vue-skill.md`:

```markdown
---
name: Vue3 组件开发
slug: vue-skill
category: 编码
tags: [vue, frontend, component]
description: 使用 Vue3 Composition API 构建可复用组件的完整技能指南
---

# Vue3 组件开发

## 描述

Vue3 组件开发技能涵盖使用 Composition API 和 `<script setup>` 语法构建现代化 Vue 组件的所有核心知识。掌握该技能后，你能够独立开发高质量、可复用的 Vue3 组件库。

## 用法

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">Count: {{ count }}, Doubled: {{ doubled }}</button>
</template>
```

## 使用场景

- 构建企业级前端应用
- 开发可复用的组件库
- 创建交互式数据可视化界面
- 搭建管理后台系统

## 示例

### 带验证的表单组件

```vue
<script setup>
import { ref, watch } from 'vue'

const email = ref('')
const error = ref('')

watch(email, (val) => {
  error.value = val && !val.includes('@') ? '请输入有效邮箱' : ''
})
</script>

<template>
  <div>
    <input v-model="email" placeholder="email@example.com" />
    <p v-if="error" class="text-red-500">{{ error }}</p>
  </div>
</template>
```

## 安装

```bash
npm create vite@latest my-app -- --template vue
cd my-app
npm install
npm run dev
```
```

Create `public/skills/python-skill.md`:

```markdown
---
name: Python 数据处理
slug: python-skill
category: 编码
tags: [python, data, pandas]
description: 使用 Python 和 Pandas 进行数据清洗、转换和分析的实战技能
---

# Python 数据处理

## 描述

Python 数据处理技能涵盖使用 Pandas、NumPy 等工具进行数据清洗、转换和分析的核心能力。适合需要处理结构化数据的开发者与数据分析师。

## 用法

```python
import pandas as pd

df = pd.read_csv('data.csv')
df_clean = df.dropna().query('amount > 100')
summary = df_clean.groupby('category')['amount'].agg(['mean', 'sum'])
print(summary)
```

## 使用场景

- 数据清洗与预处理
- 生成业务报表与统计摘要
- 数据质量检查与异常检测
- ETL 流程构建

## 示例

### 数据清洗管道

```python
import pandas as pd

def clean_pipeline(filepath):
    df = pd.read_csv(filepath)
    df = df.drop_duplicates()
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['amount'] = df['amount'].fillna(0)
    return df[df['date'].notna()]
```

## 安装

```bash
pip install pandas numpy
```
```

Create `public/skills/debug-skill.md`:

```markdown
---
name: 系统化调试
slug: debug-skill
category: 调试
tags: [debug, logging, troubleshooting]
description: 从日志分析到根因定位的系统化调试方法论与工具链
---

# 系统化调试

## 描述

系统化调试技能提供从问题发现到根因定位的结构化方法。掌握该技能后，你能够高效地排查和修复各类软件缺陷，避免盲目试错。

## 用法

1. **复现问题**：确认稳定复现路径
2. **缩小范围**：二分法定位问题区间
3. **假设验证**：提出假设 → 添加观测 → 验证/推翻
4. **修复验证**：修复后确认原问题消失且无回归

## 使用场景

- 生产环境故障排查
- 性能瓶颈定位
- 内存泄漏分析
- 并发问题调试

## 示例

### 结构化排查模板

```
问题：用户登录后偶尔出现白屏
复现率：约 30%
假设1：Token 过期 → 添加日志 → 排除（token 有效）
假设2：路由守卫异常 → 断点调试 → 确认（异步竞态）
修复：await userStore.init() 后再放行路由
验证：100次登录无白屏，回归测试通过
```

## 安装

推荐工具：Chrome DevTools, VS Code Debugger, strace, lldb
```

Create `public/skills/design-skill.md`:

```markdown
---
name: UI 设计系统
slug: design-skill
category: 设计
tags: [design, system, component]
description: 构建一致性 UI 设计系统的核心原则、Token 体系与组件规范
---

# UI 设计系统

## 描述

UI 设计系统技能涵盖从设计 Token 定义到组件规范制定的完整流程。掌握该技能后，你能够为团队建立一致的视觉语言和组件标准。

## 用法

设计 Token 层级：

```
全局 Token (颜色、间距、字号)
  → 别名 Token (语义化引用)
    → 组件 Token (组件内部变量)
```

## 使用场景

- 建立团队设计规范
- 统一多产品视觉语言
- 组件库设计与维护
- 设计-开发协作提效

## 示例

### Token 定义

```css
:root {
  /* 全局 Token */
  --blue-500: #0066cc;
  --radius-lg: 18px;

  /* 别名 Token */
  --color-action: var(--blue-500);
  --radius-card: var(--radius-lg);

  /* 组件 Token */
  --button-bg: var(--color-action);
  --button-radius: var(--radius-pill);
}
```

## 安装

推荐工具：Figma, Style Dictionary, Theo
```

- [ ] **Step 2: Create build-skills.js script**

Create `scripts/build-skills.js`:

```js
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const skillsDir = path.join(__dirname, '..', 'public', 'skills')

const files = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'))

const index = []

for (const file of files) {
  const content = fs.readFileSync(path.join(skillsDir, file), 'utf-8')
  const { data } = matter(content)
  index.push({
    name: data.name,
    slug: data.slug,
    category: data.category,
    tags: data.tags || [],
    description: data.description,
  })
}

const outputPath = path.join(skillsDir, 'index.json')
fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf-8')
console.log(`Generated index.json with ${index.length} skills`)
```

- [ ] **Step 3: Add build:scripts to package.json**

Add to `package.json` scripts section:

```json
"build:skills": "node scripts/build-skills.js",
"prebuild": "npm run build:skills"
```

- [ ] **Step 4: Run the build script and verify output**

```bash
node scripts/build-skills.js
cat public/skills/index.json
```

Expected: `index.json` containing array of 4 skill objects with name, slug, category, tags, description fields.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-skills.js public/skills/ package.json
git commit -m "feat: add build-time index generator and sample skill markdown files"
```

---

### Task 4: useSkills Composable

**Files:**
- Create: `src/composables/useSkills.js`

- [ ] **Step 1: Create useSkills composable**

Create `src/composables/useSkills.js`:

```js
import { ref, computed } from 'vue'

const skills = ref([])
const loading = ref(false)
const error = ref(null)
let loaded = false

export function useSkills() {
  async function fetchSkills() {
    if (loaded) return
    loading.value = true
    error.value = null
    try {
      const res = await fetch('/skills/index.json')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      skills.value = await res.json()
      loaded = true
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const categories = computed(() => {
    const cats = new Set(skills.value.map(s => s.category))
    return ['全部', ...cats]
  })

  const allTags = computed(() => {
    const tagSet = new Set()
    skills.value.forEach(s => s.tags?.forEach(t => tagSet.add(t)))
    return [...tagSet].sort()
  })

  return { skills, loading, error, categories, allTags, fetchSkills }
}
```

- [ ] **Step 2: Verify composable loads data**

Update `src/views/HomeView.vue` temporarily to test:

```vue
<script setup>
import { onMounted } from 'vue'
import { useSkills } from '../composables/useSkills'

const { skills, loading, error, fetchSkills } = useSkills()

onMounted(fetchSkills)
</script>

<template>
  <div class="p-8">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <h1 class="text-[40px] font-semibold tracking-tight">Skill Book</h1>
      <p class="mt-2 text-[var(--color-text-secondary)]">{{ skills.length }} skills loaded</p>
      <ul class="mt-4">
        <li v-for="s in skills" :key="s.slug">{{ s.name }} — {{ s.category }}</li>
      </ul>
    </div>
  </div>
</template>
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Expected: Home page shows "4 skills loaded" with list of skill names and categories.

- [ ] **Step 4: Commit**

```bash
git add src/composables/useSkills.js src/views/HomeView.vue
git commit -m "feat: add useSkills composable for fetching skill index"
```

---

### Task 5: useSearch & useFilters Composables

**Files:**
- Create: `src/composables/useSearch.js`
- Create: `src/composables/useFilters.js`

- [ ] **Step 1: Create useSearch composable**

Create `src/composables/useSearch.js`:

```js
import { ref, computed, watch } from 'vue'
import Fuse from 'fuse.js'

export function useSearch(skills) {
  const query = ref('')
  const searchQuery = ref('')

  let debounceTimer = null
  watch(query, (val) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      searchQuery.value = val
    }, 300)
  })

  const fuse = computed(() => {
    return new Fuse(skills.value, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'description', weight: 1.5 },
        { name: 'tags', weight: 1 },
        { name: 'category', weight: 0.5 },
      ],
      threshold: 0.3,
    })
  })

  const results = computed(() => {
    if (!searchQuery.value.trim()) return skills.value
    return fuse.value.search(searchQuery.value).map(r => r.item)
  })

  return { query, results }
}
```

- [ ] **Step 2: Create useFilters composable**

Create `src/composables/useFilters.js`:

```js
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
```

- [ ] **Step 3: Commit**

```bash
git add src/composables/useSearch.js src/composables/useFilters.js
git commit -m "feat: add useSearch and useFilters composables"
```

---

### Task 6: GlobalNav & SubNav Components

**Files:**
- Create: `src/components/GlobalNav.vue`
- Create: `src/components/SubNav.vue`

- [ ] **Step 1: Create GlobalNav component**

Create `src/components/GlobalNav.vue`:

```vue
<script setup>
</script>

<template>
  <nav class="bg-black text-white h-[44px] flex items-center px-[22px]">
    <router-link to="/" class="text-[12px] tracking-wide opacity-80 hover:opacity-100 transition-opacity">
      SKILL BOOK
    </router-link>
  </nav>
</template>
```

- [ ] **Step 2: Create SubNav component**

Create `src/components/SubNav.vue`:

```vue
<script setup>
import SearchBar from './SearchBar.vue'

defineProps({
  searchQuery: { type: String, default: '' },
})

const emit = defineEmits(['update:searchQuery'])
</script>

<template>
  <div class="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[var(--color-border-hairline)] h-[52px] flex items-center px-[22px]">
    <h1 class="text-[21px] font-semibold tracking-tight text-[var(--color-text-primary)]">
      Skill Book
    </h1>
    <div class="ml-auto">
      <SearchBar
        :model-value="searchQuery"
        @update:model-value="emit('update:searchQuery', $event)"
      />
    </div>
  </div>
</template>
```

- [ ] **Step 3: Create SearchBar component**

Create `src/components/SearchBar.vue`:

```vue
<script setup>
defineProps({
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="relative">
    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      placeholder="搜索技能..."
      class="w-64 pl-10 pr-4 py-2 rounded-full bg-[var(--color-bg-parchment)] border border-[var(--color-border-hairline)] text-[14px] focus:outline-none focus:border-[var(--color-action-blue)] transition-colors"
    />
  </div>
</template>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/GlobalNav.vue src/components/SubNav.vue src/components/SearchBar.vue
git commit -m "feat: add GlobalNav, SubNav, and SearchBar components"
```

---

### Task 7: CategorySidebar & TagCloud Components

**Files:**
- Create: `src/components/CategorySidebar.vue`
- Create: `src/components/TagCloud.vue`

- [ ] **Step 1: Create CategorySidebar component**

Create `src/components/CategorySidebar.vue`:

```vue
<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
  selected: { type: String, default: '全部' },
})

const emit = defineEmits(['select'])
</script>

<template>
  <aside class="w-[240px] shrink-0 pr-6">
    <h3 class="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">
      分类
    </h3>
    <ul class="space-y-1">
      <li
        v-for="cat in categories"
        :key="cat"
        @click="emit('select', cat)"
        :class="[
          'px-3 py-2 rounded-lg cursor-pointer text-[14px] transition-all',
          selected === cat
            ? 'bg-[var(--color-action-blue)] text-white font-medium'
            : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-parchment)]'
        ]"
      >
        {{ cat }}
      </li>
    </ul>
  </aside>
</template>
```

- [ ] **Step 2: Create TagCloud component**

Create `src/components/TagCloud.vue`:

```vue
<script setup>
defineProps({
  tags: { type: Array, default: () => [] },
  selectedTags: { type: Array, default: () => [] },
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <div class="mt-8">
    <h3 class="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">
      标签
    </h3>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="tag in tags"
        :key="tag"
        @click="emit('toggle', tag)"
        :class="[
          'inline-block px-3 py-1 rounded-full text-[13px] cursor-pointer transition-all border',
          selectedTags.includes(tag)
            ? 'bg-[var(--color-action-blue)] text-white border-[var(--color-action-blue)]'
            : 'bg-white text-[var(--color-text-primary)] border-[var(--color-border-hairline)] hover:border-[var(--color-action-blue)]'
        ]"
      >
        #{{ tag }}
      </span>
    </div>
  </div>
</template>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CategorySidebar.vue src/components/TagCloud.vue
git commit -m "feat: add CategorySidebar and TagCloud components"
```

---

### Task 8: SkillCard Component

**Files:**
- Create: `src/components/SkillCard.vue`

- [ ] **Step 1: Create SkillCard component**

Create `src/components/SkillCard.vue`:

```vue
<script setup>
defineProps({
  skill: { type: Object, required: true },
})

function navigateTo(slug) {
  window.location.hash = `#/skill/${slug}`
}
</script>

<template>
  <div
    @click="navigateTo(skill.slug)"
    class="bg-white rounded-card border border-[var(--color-border-hairline)] p-6 cursor-pointer transition-all hover:border-[var(--color-action-blue)] active:scale-[0.98]"
  >
    <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-bg-parchment)] mb-4">
      <span class="text-[20px]">{{ skill.category === '编码' ? '⌨️' : skill.category === '调试' ? '🔍' : skill.category === '设计' ? '🎨' : '📋' }}</span>
    </div>
    <h3 class="text-[17px] font-semibold text-[var(--color-text-primary)] mb-1">
      {{ skill.name }}
    </h3>
    <p class="text-[14px] text-[var(--color-text-secondary)] leading-relaxed mb-4 line-clamp-2">
      {{ skill.description }}
    </p>
    <div class="flex flex-wrap gap-1.5">
      <span
        v-for="tag in skill.tags"
        :key="tag"
        class="inline-block px-2 py-0.5 rounded-full text-[11px] bg-[var(--color-bg-parchment)] text-[var(--color-text-secondary)]"
      >
        #{{ tag }}
      </span>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SkillCard.vue
git commit -m "feat: add SkillCard component with Apple-style card design"
```

---

### Task 9: MarkdownRenderer Component

**Files:**
- Create: `src/components/MarkdownRenderer.vue`

- [ ] **Step 1: Create MarkdownRenderer component**

Create `src/components/MarkdownRenderer.vue`:

```vue
<script setup>
import { ref, watch, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'

const props = defineProps({
  source: { type: String, default: '' },
})

const rendered = ref('')
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

onMounted(() => {
  rendered.value = md.render(props.source)
})

watch(() => props.source, (val) => {
  rendered.value = md.render(val)
})
</script>

<template>
  <div class="prose prose-apple max-w-none" v-html="rendered"></div>
</template>

<style scoped>
.prose-apple :deep(h1) {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
}

.prose-apple :deep(h2) {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--color-text-primary);
}

.prose-apple :deep(h3) {
  font-size: 19px;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
}

.prose-apple :deep(p) {
  font-size: 17px;
  line-height: 1.65;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.prose-apple :deep(code) {
  font-family: 'SF Mono', Menlo, monospace;
  font-size: 15px;
  background: var(--color-bg-parchment);
  padding: 2px 6px;
  border-radius: 4px;
}

.prose-apple :deep(pre) {
  background: var(--color-text-primary);
  color: #f5f5f7;
  padding: 16px 20px;
  border-radius: 12px;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.prose-apple :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 14px;
  color: inherit;
}

.prose-apple :deep(ul),
.prose-apple :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose-apple :deep(li) {
  font-size: 17px;
  line-height: 1.65;
  margin-bottom: 0.25rem;
}

.prose-apple :deep(blockquote) {
  border-left: 3px solid var(--color-action-blue);
  padding-left: 1rem;
  margin: 1rem 0;
  color: var(--color-text-secondary);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MarkdownRenderer.vue
git commit -m "feat: add MarkdownRenderer with Apple-styled typography"
```

---

### Task 10: HomeView — Full Assembly

**Files:**
- Modify: `src/views/HomeView.vue`

- [ ] **Step 1: Implement full HomeView with all composables and components**

Replace `src/views/HomeView.vue`:

```vue
<script setup>
import { onMounted } from 'vue'
import { useSkills } from '../composables/useSkills'
import { useSearch } from '../composables/useSearch'
import { useFilters } from '../composables/useFilters'
import SubNav from '../components/SubNav.vue'
import CategorySidebar from '../components/CategorySidebar.vue'
import TagCloud from '../components/TagCloud.vue'
import SkillCard from '../components/SkillCard.vue'

const { skills, loading, error, categories, allTags, fetchSkills } = useSkills()

onMounted(fetchSkills)

const { query, results: searchResults } = useSearch(skills)
const { selectedCategory, selectedTags, filtered, toggleCategory, toggleTag, clearFilters } = useFilters(searchResults)

const displayedSkills = filtered
</script>

<template>
  <SubNav
    :search-query="query"
    @update:search-query="query = $event"
  />

  <div v-if="loading" class="flex items-center justify-center py-20">
    <span class="text-[var(--color-text-secondary)]">加载中...</span>
  </div>

  <div v-else-if="error" class="flex items-center justify-center py-20">
    <span class="text-red-500">加载失败: {{ error }}</span>
  </div>

  <div v-else class="max-w-[1200px] mx-auto px-[22px] py-8 flex gap-8">
    <div>
      <CategorySidebar
        :categories="categories"
        :selected="selectedCategory"
        @select="toggleCategory"
      />
      <TagCloud
        :tags="allTags"
        :selected-tags="selectedTags"
        @toggle="toggleTag"
      />
    </div>

    <main class="flex-1 min-w-0">
      <div class="flex items-center justify-between mb-6">
        <p class="text-[14px] text-[var(--color-text-secondary)]">
          {{ displayedSkills.length }} 个技能
        </p>
        <button
          v-if="selectedCategory !== '全部' || selectedTags.length > 0 || query"
          @click="clearFilters(); query = ''"
          class="text-[13px] text-[var(--color-action-blue)] hover:underline"
        >
          清除筛选
        </button>
      </div>

      <div v-if="displayedSkills.length === 0" class="text-center py-16">
        <p class="text-[var(--color-text-secondary)]">未找到匹配的技能</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <SkillCard
          v-for="skill in displayedSkills"
          :key="skill.slug"
          :skill="skill"
        />
      </div>
    </main>
  </div>
</template>
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Expected: Home page shows SubNav with search bar, category sidebar, tag cloud, and skill card grid. Search, category, and tag filters work.

- [ ] **Step 3: Commit**

```bash
git add src/views/HomeView.vue
git commit -m "feat: assemble HomeView with search, filter, and card grid"
```

---

### Task 11: SkillDetailView — Full Implementation

**Files:**
- Modify: `src/views/SkillDetailView.vue`

- [ ] **Step 1: Implement full SkillDetailView**

Replace `src/views/SkillDetailView.vue`:

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import matter from 'gray-matter'
import SubNav from '../components/SubNav.vue'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug

const skill = ref(null)
const content = ref('')
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(`/skills/${slug}.md`)
    if (!res.ok) throw new Error(`Skill not found: ${slug}`)
    const raw = await res.text()
    const { data, content: body } = matter(raw)
    skill.value = data
    content.value = body
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <SubNav />

  <div v-if="loading" class="flex items-center justify-center py-20">
    <span class="text-[var(--color-text-secondary)]">加载中...</span>
  </div>

  <div v-else-if="error" class="flex items-center justify-center py-20">
    <div class="text-center">
      <p class="text-red-500 mb-4">{{ error }}</p>
      <button
        @click="router.push('/')"
        class="text-[var(--color-action-blue)] hover:underline"
      >
        返回首页
      </button>
    </div>
  </div>

  <template v-else>
    <!-- Hero Section (dark tile) -->
    <div class="bg-[var(--color-text-primary)] text-white">
      <div class="max-w-[980px] mx-auto px-[22px] py-12">
        <button
          @click="router.push('/')"
          class="text-[14px] opacity-60 hover:opacity-100 transition-opacity mb-6 inline-flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回列表
        </button>
        <h1 class="text-[40px] font-semibold tracking-tight leading-tight">
          {{ skill.name }}
        </h1>
        <p class="text-[19px] opacity-80 mt-3 max-w-[600px] leading-relaxed">
          {{ skill.description }}
        </p>
        <div class="flex flex-wrap gap-2 mt-6">
          <span class="px-3 py-1 rounded-full text-[13px] bg-white/15 backdrop-blur">
            {{ skill.category }}
          </span>
          <span
            v-for="tag in skill.tags"
            :key="tag"
            class="px-3 py-1 rounded-full text-[13px] bg-white/15 backdrop-blur"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- Content Section (white tile) -->
    <div class="bg-white">
      <div class="max-w-[980px] mx-auto px-[22px] py-12">
        <MarkdownRenderer :source="content" />
      </div>
    </div>
  </template>
</template>
```

- [ ] **Step 2: Verify detail page**

Navigate to a skill card, click it, verify:
- Hero section shows skill name, description, tags on dark background
- Content section renders Markdown on white background
- Back button returns to home

- [ ] **Step 3: Commit**

```bash
git add src/views/SkillDetailView.vue
git commit -m "feat: implement SkillDetailView with hero section and markdown rendering"
```

---

### Task 12: Footer & Final Polish

**Files:**
- Create: `src/components/FooterBar.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: Create FooterBar component**

Create `src/components/FooterBar.vue`:

```vue
<script setup>
</script>

<template>
  <footer class="bg-[var(--color-bg-parchment)] border-t border-[var(--color-border-hairline)] py-6 mt-12">
    <div class="max-w-[1200px] mx-auto px-[22px] flex items-center justify-between">
      <p class="text-[12px] text-[var(--color-text-secondary)]">
        Skill Book — 技能知识库
      </p>
      <p class="text-[12px] text-[var(--color-text-secondary)]">
        Built with Vue3 + TailwindCSS
      </p>
    </div>
  </footer>
</template>
```

- [ ] **Step 2: Update App.vue to include FooterBar**

Replace `src/App.vue`:

```vue
<script setup>
import GlobalNav from './components/GlobalNav.vue'
import FooterBar from './components/FooterBar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <GlobalNav />
    <div class="flex-1">
      <router-view />
    </div>
    <FooterBar />
  </div>
</template>
```

- [ ] **Step 3: Clean up default Vite scaffold files**

```bash
rm -f src/components/HelloWorld.vue src/style.css src/assets/vue.svg public/vite.svg
```

Remove any references to deleted files in existing code.

- [ ] **Step 4: Full browser verification**

```bash
npm run dev
```

Verify:
1. Home page loads with 4 skill cards
2. Search bar filters skills as you type (with debounce)
3. Category sidebar filters by category
4. Tag cloud toggles tags (multi-select)
5. Clicking a card navigates to detail page
6. Detail page shows hero + markdown content
7. Back button on detail page returns to home
8. Footer visible at bottom
9. No console errors

- [ ] **Step 5: Commit**

```bash
git add src/components/FooterBar.vue src/App.vue
git commit -m "feat: add footer and finalize page layout"
```

---

### Task 13: Build & Production Verification

**Files:**
- None (verification only)

- [ ] **Step 1: Run build to verify production bundle**

```bash
npm run build:skills
npm run build
```

Expected: Build succeeds with no errors. `dist/` directory contains the app.

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```

Expected: App works identically to dev mode. All features functional.

- [ ] **Step 3: Final commit (if any cleanup needed)**

```bash
git add -A
git commit -m "chore: final cleanup for v1 MVP"
```
