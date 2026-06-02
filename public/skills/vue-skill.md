---
name: Vue3 组件开发
slug: vue-skill
category: 编码开发与工程规范
tags: [vue, frontend, component]
description: 使用 Vue3 Composition API 构建可复用组件的完整技能指南
---

# Vue3 组件开发

## 简介

Vue3 组件开发技能涵盖使用 Composition API 和 `<script setup>` 语法构建现代化 Vue 组件的所有核心知识。Vue3 的 Composition API 相比 Options API 带来了革命性的改进：逻辑按功能关注点组织而非分散在 data、methods、computed 中，代码可复用性大幅提升，TypeScript 集成更加自然。

在 AI 辅助开发时代，Vue 的单文件组件（SFC）和精心策划的生态系统（Vue Router、Pinia、Nuxt、Vite）为 AI 代理提供了更一致的代码生成模式，减少了架构决策的混乱。本技能指南将帮助你掌握 Vue3 开发的核心模式与最佳实践。

## 核心功能

- **Composition API + `<script setup>`**：更简洁的组件编写方式，自动暴露变量到模板，减少样板代码约 30%
- **响应式系统**：`ref`、`reactive`、`computed`、`watch`、`watchEffect` 构成完整的响应式原语
- **Composables（组合式函数）**：可复用的有状态逻辑封装，替代 Vue2 的 Mixins，更透明、更灵活
- **Pinia 状态管理**：官方推荐的状态管理库，完整的 TypeScript 支持，Composition API 风格定义 Store
- **VueUse 工具集**：200+ 实用 Composables，覆盖传感器、状态、动画、工具等场景
- **Vite 构建工具**：极速 HMR、Rollup 生产构建、Tree Shaking 优化

## 安装与使用

### 创建新项目

```bash
npm create vite@latest my-app -- --template vue
cd my-app
npm install
npm run dev
```

### 添加核心依赖

```bash
# 状态管理
npm install pinia

# 路由
npm install vue-router

# 实用工具集
npm install @vueuse/core

# TypeScript 支持（如需）
npm install -D typescript vue-tsc
```

### 安装 Vue Agent Skills（AI 辅助开发）

```bash
# 安装 Anthony Fu 的 Vue Skills 集合
npx skills add antfu/skills --skill='vue'

# 安装 Vue.js AI 官方技能集
npx skills add vuejs-ai/skills
```

可用的 Agent Skills 包括：

| Skill | 覆盖内容 |
|---|---|
| vue | Vue 3 Composition API、script setup 宏、响应式系统 |
| vue-best-practices | Vue 3 + TypeScript 最佳实践 |
| vue-router-best-practices | Vue Router 模式与约定 |
| vue-testing-best-practices | Vue 测试约定 |
| pinia | Composition API 风格的类型安全状态管理 |
| vite | 配置、插件、SSR、库模式 |
| vitest | 基于 Vite 的单元测试 |
| vueuse-functions | 200+ Vue 组合式工具函数 |

## Vue 3 开发模式

### Composition API 与 `<script setup>`

`<script setup>` 是 Composition API 的编译时语法糖，所有顶层声明自动暴露给模板：

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 响应式状态
const count = ref(0)
const message = ref<string>('Hello Vue 3')

// 计算属性
const doubled = computed(() => count.value * 2)

// 方法
function increment() {
  count.value++
}

// 生命周期
onMounted(() => {
  console.log('组件已挂载')
})
</script>

<template>
  <div>
    <h2>{{ message }}</h2>
    <p>Count: {{ count }}, Doubled: {{ doubled }}</p>
    <button @click="increment">+1</button>
  </div>
</template>
```

### 响应式系统详解

Vue 3 提供多种响应式原语，选择合适的原语对性能至关重要：

```typescript
import { ref, reactive, shallowRef, shallowReactive, computed, triggerRef, markRaw } from 'vue'

// === ref：基础响应式引用 ===
const count = ref(0)
count.value++ // 触发更新

// === reactive：深层响应式对象 ===
const state = reactive({
  user: { name: 'Alice', age: 25 },
  items: [1, 2, 3]
})
state.user.name = 'Bob' // 触发更新（深层追踪）

// === shallowRef：浅层响应式（性能优化） ===
// 仅 .value 访问是响应式的，内部属性变更不触发更新
const hugeList = shallowRef<Item[]>([])
hugeList.value.push(newItem)  // ❌ 不触发更新
hugeList.value = [...hugeList.value, newItem]  // ✅ 触发更新
triggerRef(hugeList)  // ✅ 手动触发更新

// === shallowReactive：浅层响应式对象 ===
// 仅根级属性是响应式的
const config = shallowReactive({ theme: 'dark', nested: { color: 'red' } })
config.theme = 'light'  // ✅ 触发更新
config.nested.color = 'blue'  // ❌ 不触发更新

// === markRaw：标记对象永不转为响应式 ===
const chartInstance = markRaw(new Chart(ctx, config))
```

**选择指南：**

| 场景 | 推荐 API | 原因 |
|---|---|---|
| 基本值（字符串、数字、布尔） | `ref` | 简单直观 |
| 对象/数组（需要深层响应） | `reactive` 或 `ref` | 按团队偏好统一 |
| 大型数据结构（1000+ 项） | `shallowRef` | 避免深层响应式开销 |
| 第三方库实例 | `shallowRef` + `markRaw` | 避免不必要的代理 |
| 派生状态 | `computed` | 自动缓存，依赖追踪 |

### watch 与 watchEffect

```typescript
import { ref, watch, watchEffect } from 'vue'

const userId = ref(1)
const searchQuery = ref('')

// watch：明确指定监听源，可获取新旧值
watch(userId, async (newId, oldId) => {
  if (newId !== oldId) {
    await fetchUserData(newId)
  }
}, { immediate: true }) // 立即执行一次

// watch：监听多个源
watch([userId, searchQuery], ([id, query]) => {
  searchUsers(id, query)
})

// watchEffect：自动追踪依赖，适合副作用
watchEffect(() => {
  console.log(`用户 ${userId.value} 搜索: ${searchQuery.value}`)
  // 自动追踪内部使用的所有响应式依赖
})

// 性能优化：防抖 watch
import { useDebounceFn } from '@vueuse/core'
watch(searchQuery, useDebounceFn((query) => {
  searchAPI(query)
}, 300))
```

### Props 与 Emits

```vue
<script setup lang="ts">
// 定义 Props（带类型与默认值）
interface Props {
  title: string
  count?: number
  items?: string[]
  status?: 'active' | 'inactive'
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => [],
  status: 'active'
})

// 定义 Emits
const emit = defineEmits<{
  update: [value: string]
  delete: [id: number]
}>()

// 使用 defineModel（Vue 3.4+）实现双向绑定
const modelValue = defineModel<string>({ required: true })
</script>

<template>
  <div>
    <h3>{{ title }}</h3>
    <p>Count: {{ count }}</p>
    <input :value="modelValue" @input="modelValue = ($event.target as HTMLInputElement).value" />
    <button @click="emit('update', 'new value')">Update</button>
  </div>
</template>
```

### Composables（组合式函数）

Composables 是 Vue 3 代码复用的核心模式，命名约定以 `use` 开头：

```typescript
// composables/useCounter.ts
import { ref, computed, type Ref, type MaybeRefOrGetter, toValue } from 'vue'

export function useCounter(initialValue: MaybeRefOrGetter<number> = 0) {
  const count = ref(toValue(initialValue))

  const doubled = computed(() => count.value * 2)

  function increment(delta = 1) {
    count.value += delta
  }

  function decrement(delta = 1) {
    count.value -= delta
  }

  function reset() {
    count.value = toValue(initialValue)
  }

  return { count, doubled, increment, decrement, reset }
}
```

```typescript
// composables/useFetch.ts
import { ref, watchEffect, toValue, type Ref } from 'vue'

export function useFetch<T>(url: string | Ref<string> | (() => string)) {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<Error | null>(null)
  const loading = ref(false)

  watchEffect(() => {
    data.value = null
    error.value = null
    loading.value = true

    fetch(toValue(url))
      .then(res => res.json())
      .then(json => {
        data.value = json
        loading.value = false
      })
      .catch(err => {
        error.value = err
        loading.value = false
      })
  })

  return { data, error, loading }
}
```

**Composables 契约：**

1. 命名以 `use` 开头（如 `useCounter`、`useFetch`）
2. 输入参数接受 `MaybeRef` / `MaybeRefOrGetter` 以提升灵活性
3. 返回包含响应式引用的对象，使用解构获取
4. 在 `setup()` 或 `<script setup>` 中同步调用（不能在条件语句中调用）
6. 如有副作用（事件监听、定时器），在 `onUnmounted` 中清理

### Pinia 状态管理

Pinia 是 Vue 3 官方推荐的状态管理方案，推荐使用 Composition API 风格定义 Store：

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUserInfo, login, logout } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => userInfo.value?.name ?? 'Guest')

  // Actions
  async function loginAction(credentials: LoginParams) {
    const res = await login(credentials)
    token.value = res.token
    userInfo.value = res.user
  }

  async function fetchUserInfo() {
    const info = await getUserInfo()
    userInfo.value = info
  }

  function logoutAction() {
    token.value = ''
    userInfo.value = null
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    userName,
    loginAction,
    fetchUserInfo,
    logoutAction
  }
})
```

**状态管理选择指南：**

| 场景 | 推荐方案 |
|---|---|
| 组件内部状态 | `ref` / `reactive` |
| 父子组件通信 | Props + Emits / defineModel |
| 跨层级组件通信 | Provide / Inject |
| 多组件共享逻辑 | Composables |
| 全局共享状态（认证、购物车等） | Pinia |
| 需要持久化、DevTools 集成 | Pinia + 插件 |

## 代码示例

### 带验证的表单组件

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface FormData {
  email: string
  password: string
}

const form = ref<FormData>({ email: '', password: '' })

const errors = computed(() => {
  const errs: Partial<Record<keyof FormData, string>> = {}
  if (form.value.email && !form.value.email.includes('@')) {
    errs.email = '请输入有效的邮箱地址'
  }
  if (form.value.password && form.value.password.length < 8) {
    errs.password = '密码至少 8 个字符'
  }
  return errs
})

const isValid = computed(() =>
  form.value.email.includes('@') &&
  form.value.password.length >= 8 &&
  Object.keys(errors.value).length === 0
)

const emit = defineEmits<{ submit: [data: FormData] }>()

function handleSubmit() {
  if (isValid.value) {
    emit('submit', { ...form.value })
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>邮箱</label>
      <input v-model="form.email" type="email" placeholder="email@example.com" />
      <span v-if="errors.email" class="error">{{ errors.email }}</span>
    </div>
    <div>
      <label>密码</label>
      <input v-model="form.password" type="password" />
      <span v-if="errors.password" class="error">{{ errors.password }}</span>
    </div>
    <button type="submit" :disabled="!isValid">提交</button>
  </form>
</template>
```

### 异步数据加载 Composable

```typescript
// composables/useAsyncData.ts
import { ref, shallowRef, type Ref } from 'vue'

interface AsyncDataResult<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
  refresh: () => Promise<void>
}

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  options: { immediate?: boolean } = {}
): AsyncDataResult<T> {
  const data = shallowRef<T | null>(null) as Ref<T | null>
  const error = ref<Error | null>(null)
  const loading = ref(false)

  async function refresh() {
    loading.value = true
    error.value = null
    try {
      data.value = await fetcher()
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      loading.value = false
    }
  }

  if (options.immediate !== false) {
    refresh()
  }

  return { data, error, loading, refresh }
}
```

### 动态组件与异步组件

```vue
<script setup lang="ts">
import { shallowRef, defineAsyncComponent } from 'vue'

// 异步组件（懒加载）
const HeavyChart = defineAsyncComponent(() =>
  import('@/components/HeavyChart.vue')
)

// 动态组件切换
type TabName = 'home' | 'settings' | 'profile'
const currentTab = shallowRef<TabName>('home')

const tabs = {
  home: defineAsyncComponent(() => import('@/views/HomeView.vue')),
  settings: defineAsyncComponent(() => import('@/views/SettingsView.vue')),
  profile: defineAsyncComponent(() => import('@/views/ProfileView.vue'))
}
</script>

<template>
  <nav>
    <button v-for="(_, tab) in tabs" :key="tab"
      :class="{ active: currentTab === tab }"
      @click="currentTab = tab">
      {{ tab }}
    </button>
  </nav>
  <component :is="tabs[currentTab]" />
</template>
```

## 配置选项

### Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    // Tree Shaking 优化
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'utils': ['@vueuse/core']
        }
      }
    },
    // 剥除 console.log
    minify: 'terser',
    terserOptions: {
      compress: {
        pure_funcs: ['console.log']
      }
    }
  }
})
```

### TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "noEmit": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 项目目录结构

```
src/
├── api/              # API 接口层
│   └── modules/      # 按业务模块拆分
├── assets/           # 静态资源
│   ├── images/
│   └── styles/
├── components/       # 全局通用组件
│   ├── base/         # 基础组件（Button、Input 等）
│   └── business/     # 业务通用组件
├── composables/      # 组合式函数
│   ├── useAuth.ts
│   └── useRequest.ts
├── layouts/          # 页面布局组件
├── router/           # 路由配置
│   └── modules/      # 路由模块
├── stores/           # Pinia 状态管理
│   └── modules/
├── types/            # 全局类型定义
├── utils/            # 工具函数
├── views/            # 页面组件
├── App.vue
└── main.ts
```

## 最佳实践

### 1. 始终使用 Composition API + `<script setup lang="ts">`

```vue
<!-- ✅ 推荐 -->
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<!-- ❌ 避免 Options API -->
<script>
export default {
  data() { return { count: 0 } }
}
</script>
```

### 2. SFC 标签顺序：`<script>` → `<template>` → `<style>`

逻辑优先，模板其次，样式最后，符合阅读习惯。

### 3. 优先使用 VueUse，避免重复造轮子

```typescript
// ✅ 使用 VueUse
import { useLocalStorage, useMouse, useDebounceFn } from '@vueuse/core'

const token = useLocalStorage('auth-token', '')
const { x, y } = useMouse()
const search = useDebounceFn(fetchResults, 300)

// ❌ 自己实现
const token = ref(localStorage.getItem('auth-token') ?? '')
watch(token, v => localStorage.setItem('auth-token', v))
```

### 4. 大型数据结构使用 shallowRef

```typescript
// ✅ 大列表用 shallowRef
const items = shallowRef<Item[]>([])
items.value = [...items.value, newItem] // 替换整个数组触发更新

// ❌ 大列表用 ref（深层响应式开销大）
const items = ref<Item[]>([])
```

### 5. 使用 Pinia 而非 Vuex

Pinia 提供更简洁的 API、完整的 TypeScript 推断、Composition API 风格，且无需 mutations。

### 6. Composables 中分离业务逻辑与响应式

```typescript
// ✅ 纯函数处理业务逻辑，Composable 只做响应式包装
// counterLogic.ts
export function calculateNextCount(current: number, delta: number): number {
  return (current + delta) % 100
}

// useCounter.ts
import { ref } from 'vue'
import { calculateNextCount } from './counterLogic'

export function useCounter() {
  const count = ref(0)
  function increment(delta = 1) {
    count.value = calculateNextCount(count.value, delta)
  }
  return { count, increment }
}
```

### 7. 避免在 reactive 对象上解构

```typescript
// ❌ 解构会丢失响应性
const state = reactive({ name: 'Alice', age: 25 })
const { name } = state // name 不是响应式的

// ✅ 使用 toRefs
const { name, age } = toRefs(state) // 保持响应性
```

### 8. 组件通信方式选择

- **Props / Emits**：父子组件，最基础的方式
- **defineModel**：双向绑定（Vue 3.4+）
- **Provide / Inject**：跨层级传递，避免 Prop Drilling
- **Pinia Store**：全局共享状态
- **Event Bus**：避免使用，用 Pinia 或 Composables 替代

### 9. 性能优化清单

- 使用 `computed` 缓存派生状态
- 大数据集使用 `shallowRef` / `shallowReactive`
- 路由级组件懒加载：`() => import('./views/HeavyView.vue')`
- 使用 `defineAsyncComponent` 懒加载重型组件
- 用 `markRaw()` 标记第三方库实例，避免不必要的代理
- 防抖昂贵的 watch 回调
- Vite 生产构建启用 Tree Shaking

## 常见问题

### Q: ref 和 reactive 该用哪个？

**推荐统一使用 `ref`**。`ref` 适用于所有类型（基本值和对象），API 一致（都通过 `.value` 访问），从 Composable 返回时不会丢失响应性。`reactive` 适合不需要返回的局部对象状态。团队应统一选择，避免混用造成混乱。

### Q: 什么时候用 shallowRef？

当数据量大（1000+ 项的数组、深层嵌套对象）或持有第三方库实例（ECharts、Mapbox GL 等）时，使用 `shallowRef` 避免深层响应式代理的性能开销。修改内部属性后需替换整个 `.value` 或调用 `triggerRef()` 手动触发更新。

### Q: Composable 和 Pinia Store 怎么选？

- **Composable**：封装可复用的有状态逻辑（鼠标位置、窗口大小、表单验证），不一定是全局共享状态
- **Pinia Store**：全局共享状态（用户认证、购物车、应用配置），需要 DevTools 集成、持久化、SSR 支持

简单规则：小应用和功能级状态用 Composable，跨组件/页面的全局状态用 Pinia。

### Q: 为什么不能在条件语句中调用 Composable？

Composable 内部可能注册生命周期钩子（`onMounted`、`onUnmounted` 等），这些钩子依赖当前组件实例。在条件语句中调用会导致钩子注册到错误的组件实例或完全丢失。应在 `<script setup>` 顶层同步调用所有 Composable。

### Q: 如何处理 Prop Drilling？

三种方案按优先级选择：
1. **Provide / Inject**：跨 2-3 层传递，最轻量
2. **Composable + 模块级状态**：多个组件共享同一实例
3. **Pinia Store**：全局状态，最完整

### Q: Vue 3 的 Vapor Mode 是什么？

Vapor Mode 是 Vue 的实验性编译策略，跳过虚拟 DOM，将模板直接编译为原生 DOM 操作，类似 Svelte 的方式。目前仍处于实验阶段，不建议生产使用。关注 Vue 官方动态获取最新进展。

### Q: AI 代理生成 Vue 代码时如何保证质量？

1. 安装 Vue Agent Skills（`npx skills add antfu/skills --skill='vue'`）
2. 在提示词前缀 `use vue skill` 引导 AI 遵循规范
3. 建立项目级 `.claude/skills/` 目录，定义团队编码标准
4. 代码审查时重点检查：是否使用 Composition API、是否优先使用 VueUse、是否正确使用 shallowRef
