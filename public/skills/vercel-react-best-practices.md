---
slug: vercel-react-best-practices
name: Vercel React Best Practices
category: 编码开发与工程规范
tags: [react, nextjs, best-practices, performance, vercel]
description: Vercel官方React最佳实践，57条性能规则覆盖React/Next.js核心优化策略
install: "npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices"
source: "https://www.skills.sh/vercel-labs/agent-skills/vercel-react-best-practices"
---

## 简介

Vercel React Best Practices 是 Vercel 工程团队基于十余年生产环境经验总结的 React/Next.js 性能优化规则集。该规则集包含 70 条可执行的优化规则，按影响程度从 CRITICAL 到 LOW 分为 8 个优先级类别，每条规则均附带错误示例与正确示例的代码对比。

**核心理念：性能优化必须按层级顺序进行。** 如果请求瀑布流（waterfall）导致 600ms 等待时间，那么优化 `useMemo` 调用毫无意义；如果页面多加载了 300KB JavaScript，微优化循环也不会产生可感知的效果。性能问题还会复合叠加——今天发布的小退化会变成每个用户会话的长期税负，直到有人偿还技术债。

因此，该框架从两个最关键的问题入手：

1. **消除异步瀑布流** — 异步工作意外地变成顺序执行
2. **减少客户端包体积** — 大型客户端包随时间不断膨胀

然后依次处理服务端性能、客户端数据获取、重渲染优化、渲染性能、JavaScript 性能和高级模式。

### 规则类别总览

| 优先级 | 类别 | 影响等级 | 前缀 | 规则数 |
|--------|------|----------|------|--------|
| 1 | 消除瀑布流 | CRITICAL | `async-` | 6 |
| 2 | 包体积优化 | CRITICAL | `bundle-` | 6 |
| 3 | 服务端性能 | HIGH | `server-` | 10 |
| 4 | 客户端数据获取 | MEDIUM-HIGH | `client-` | 4 |
| 5 | 重渲染优化 | MEDIUM | `rerender-` | 15 |
| 6 | 渲染性能 | MEDIUM | `rendering-` | 11 |
| 7 | JavaScript 性能 | LOW-MEDIUM | `js-` | 14 |
| 8 | 高级模式 | LOW | `advanced-` | 4 |

---

## Server Components 最佳实践

React Server Components（RSC）是 Next.js App Router 的默认组件类型。理解何时使用服务端组件、何时使用客户端组件是性能优化的基础。

### 服务端组件 vs 客户端组件的选择原则

**使用 Server Components 的场景：**
- 数据获取（直接访问数据库、API，无需额外网络请求）
- 访问后端资源（文件系统、环境变量、数据库连接）
- 保留敏感信息在服务端（API 密钥、访问令牌）
- 减少客户端 JavaScript 包体积（组件代码不会发送到浏览器）
- 使用大型依赖库进行数据处理（解析、转换等）

**使用 Client Components 的场景：**
- 交互性（`onClick`、`onChange` 等事件处理）
- 使用 React Hooks（`useState`、`useEffect`、`useReducer`）
- 浏览器专属 API（`localStorage`、`geolocation`）
- 依赖客户端状态的 UI

### 组合模式

```
// 推荐模式：Server Component 作为容器，Client Component 嵌入交互部分
// app/page.tsx (Server Component)
import { DataList } from './DataList'        // Server Component
import { SearchFilter } from './SearchFilter' // Client Component

export default async function Page() {
  const data = await fetchData() // 服务端直接获取数据
  return (
    <div>
      <h1>数据列表</h1>
      <SearchFilter />  {/* 客户端交互组件 */}
      <DataList data={data} />  {/* 服务端渲染组件 */}
    </div>
  )
}
```

### 关键规则

- **`server-dedup-props`**：避免在 Server Components 中传递重复的 props，将数据获取下沉到真正需要的组件
- **`server-hoist-static-io`**：将静态 I/O 操作提升到模块顶层，避免每次请求重复执行
- **`server-no-shared-module-state`**：不要在模块级别维护可变状态，Server Components 可能被多个请求共享
- **`server-serialization`**：注意 Server → Client 边界的数据序列化成本，避免传递大型数据结构

### 常见错误：将 Provider 放在根布局

```
// 错误：ThemeProvider 包裹整个应用，导致所有子组件变成客户端组件
// app/layout.tsx
import ThemeProvider from './ThemeProvider' // "use client"

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>  {/* 整棵树变成客户端组件 */}
      {children}
    </ThemeProvider>
  )
}

// 正确：将 Provider 下推到真正需要的最小布局
// app/dashboard/layout.tsx
import ThemeProvider from './ThemeProvider'

export default function DashboardLayout({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
```

---

## 数据获取策略

### 消除异步瀑布流（CRITICAL 优先级）

异步瀑布流是性能问题的头号杀手。当多个异步操作本可并行却因代码结构变成顺序执行时，等待时间成倍增加。

**规则 `async-parallel`：并行化独立的异步操作**

```
// 错误：顺序等待，总耗时 = A + B
async function loadPage() {
  const user = await getUser()      // 200ms
  const posts = await getPosts()    // 300ms
  return { user, posts }            // 总计 500ms
}

// 正确：并行执行，总耗时 = max(A, B)
async function loadPage() {
  const [user, posts] = await Promise.all([
    getUser(),
    getPosts()
  ])
  return { user, posts }            // 总计 300ms
}
```

**规则 `async-cheap-condition-before-await`：将廉价条件判断放在 await 之前**

```
// 错误：先 await 再判断
async function handleRequest(id: string) {
  const data = await fetchData(id)  // 即使不需要也等待
  if (!data) return null
  return process(data)
}

// 正确：先判断再 await
async function handleRequest(id: string) {
  if (!id) return null              // 廉价判断先行
  const data = await fetchData(id)
  return process(data)
}
```

**规则 `async-defer-await`：延迟 await 到真正需要结果时**

```
// 错误：过早 await 阻塞后续代码
async function Page() {
  const analytics = await getAnalytics()  // 阻塞
  const config = await getConfig()        // 被阻塞
  return <Dashboard analytics={analytics} config={config} />
}

// 正确：先启动所有 Promise，最后统一 await
async function Page() {
  const analyticsPromise = getAnalytics()  // 立即启动
  const configPromise = getConfig()        // 立即启动
  const [analytics, config] = await Promise.all([
    analyticsPromise, configPromise
  ])
  return <Dashboard analytics={analytics} config={config} />
}
```

**规则 `async-dependencies`：处理有依赖关系的异步操作**

当操作 B 依赖操作 A 的结果时，无法简单并行化。此时应使用 Suspense 边界将依赖链拆分为可流式传输的独立区块。

**规则 `async-api-routes`：避免从 Server Components 调用 Route Handlers**

```
// 错误：Server Component 调用 Route Handler，产生额外的服务器请求
async function Page() {
  const res = await fetch('/api/data')  // 服务器 → 服务器，额外网络往返
  const data = await res.json()
  return <List data={data} />
}

// 正确：Server Component 直接访问数据源
async function Page() {
  const data = await db.query('SELECT * FROM items')  // 直接访问
  return <List data={data} />
}
```

### 服务端并行数据获取

**规则 `server-parallel-fetching` 和 `server-parallel-nested-fetching`**

在 Server Components 中，利用 `Promise.all` 并行获取数据，包括嵌套组件中的数据获取：

```
// 布局和页面并行获取
// app/layout.tsx
export default async function Layout({ children }) {
  const nav = await getNavigation()  // 与页面数据并行
  return <Nav data={nav}>{children}</Nav>
}

// app/page.tsx
export default async function Page() {
  const content = await getPageContent()  // 与布局数据并行
  return <Content data={content} />
}
```

Next.js 自动并行化布局和页面的数据获取，无需手动 `Promise.all`。

### 客户端数据获取

**规则 `client-swr-dedup`：使用 SWR 自动去重请求**

```
// 正确：SWR 自动去重、缓存、重新验证
import useSWR from 'swr'

function Profile() {
  const { data } = useSWR('/api/user', fetcher)
  return <div>{data?.name}</div>
}

// 多个组件使用相同 key，SWR 只发一次请求
function Avatar() {
  const { data } = useSWR('/api/user', fetcher) // 复用缓存
  return <img src={data?.avatar} />
}
```

---

## Streaming 与 Suspense

Streaming 是 React Server Components 的核心能力之一，允许服务端将 UI 分块逐步发送到客户端，用户可以立即看到部分页面内容，而不必等待所有数据加载完成。

### 基本原理

传统 SSR 是"全有或全无"——服务端必须等待所有数据获取完成后才能发送任何 HTML。Streaming 打破了这个限制：

1. 服务端立即发送页面外壳（shell）——导航栏、布局等静态内容
2. 被 Suspense 包裹的异步组件显示 fallback UI
3. 当异步数据就绪后，服务端流式传输替换内容
4. 多个独立的 Suspense 边界并行流式传输

### 使用 Suspense 边界

**规则 `async-suspense-boundaries`：用 Suspense 边界拆分慢速区块**

```
// 错误：顶层 await 阻塞整个页面
async function DashboardPage() {
  const analytics = await getAnalytics()  // 慢请求，阻塞整个页面
  const recentPosts = await getRecentPosts()
  return (
    <div>
      <Header />
      <AnalyticsChart data={analytics} />
      <PostList posts={recentPosts} />
    </div>
  )
}

// 正确：Suspense 边界让页面外壳立即显示
import { Suspense } from 'react'

function DashboardPage() {
  return (
    <div>
      <Header />  {/* 立即显示 */}
      <Suspense fallback={<ChartSkeleton />}>
        <AsyncAnalytics />  {/* 流式加载 */}
      </Suspense>
      <Suspense fallback={<ListSkeleton />}>
        <AsyncPostList />  {/* 流式加载，与 Analytics 并行 */}
      </Suspense>
    </div>
  )
}

async function AsyncAnalytics() {
  const analytics = await getAnalytics()
  return <AnalyticsChart data={analytics} />
}

async function AsyncPostList() {
  const posts = await getRecentPosts()
  return <PostList posts={posts} />
}
```

### loading.tsx 约定

Next.js 提供了 `loading.tsx` 文件约定，自动为路由段创建 Suspense 边界：

```
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return <DashboardSkeleton />
}

// app/dashboard/page.tsx
export default async function Dashboard() {
  const data = await fetchDashboardData()  // 自动被 Suspense 包裹
  return <DashboardContent data={data} />
}
```

### Streaming 的注意事项

- **不要在页面顶层使用 `await`**：顶层 await 会阻塞整个页面的流式传输，包括不依赖该数据的部分
- **多个 Suspense 边界并行流式传输**：将独立的慢速数据获取拆分到不同的 Suspense 边界中
- **Suspense fallback 应该轻量**：避免在 fallback 中使用重量级组件或数据获取
- **避免将所有内容放在一个 Suspense 中**：粒度越细，流式传输效果越好

---

## 路由优化

### App Router 核心模式

Next.js App Router 采用基于目录的路由约定，`/app` 目录下的 `page.tsx`、`layout.tsx`、`loading.tsx` 等特殊文件默认为 Server Components。

### 路由段自动代码分割

App Router 的每个路由段自动进行代码分割，用户只下载当前访问页面所需的 JavaScript。嵌套布局允许共享 UI（导航栏、侧边栏）只渲染一次，导航时不会重新获取或重新渲染。

### 布局与页面的数据获取分离

```
// app/layout.tsx — 布局数据在导航间持久化
export default async function Layout({ children }) {
  const navData = await getNavData()
  return (
    <nav>{/* 导航 */}</nav>
    <main>{children}</main>
  )
}

// app/dashboard/page.tsx — 页面数据独立获取
export default async function Dashboard() {
  const dashboardData = await getDashboardData()
  return <DashboardView data={dashboardData} />
}
```

布局和页面的数据获取自动并行执行，无需手动优化。

### 预取（Prefetching）

当 `<Link>` 组件进入用户视口时，Next.js 会在后台预取目标路由的代码。这使得导航几乎瞬间完成。可通过 `prefetch={false}` 关闭不需要的预取。

### 规则 `server-after-nonblocking`：使用 `after` API 执行非阻塞操作

```
import { after } from 'next/server'

export default async function Page() {
  const data = await getData()

  // 非阻塞：日志、分析等操作不阻塞响应
  after(async () => {
    await logAnalytics()
    await updateCache()
  })

  return <Content data={data} />
}
```

---

## 缓存策略

Next.js 提供四层缓存机制，理解每一层的作用和配置方式是性能优化的关键。

### 四层缓存体系

| 缓存类型 | 位置 | 机制 | 持续时间 | 用途 |
|----------|------|------|----------|------|
| Request Memoization | 服务端（内存） | 函数返回值缓存 | 单次请求生命周期 | 同一渲染周期内复用数据 |
| Data Cache | 服务端（持久化） | 数据缓存 | 持久化（可重新验证） | 跨用户和构建共享数据 |
| Full Route Cache | 服务端（持久化） | HTML + RSC Payload | 持久化（可重新验证） | 加速整页渲染 |
| Router Cache | 客户端（内存） | RSC Payload | 会话期或基于时间 | 加速客户端导航 |

### 1. Request Memoization（请求记忆化）

在同一服务端渲染周期内，对相同 URL 的 `fetch` 请求自动去重。React 自动维护此缓存，无需手动配置。

```
// 这两个组件在同一渲染树中，fetch 只执行一次
async function UserProfile() {
  const user = await fetch('/api/user')  // 实际请求
  return <Profile data={user} />
}

async function UserAvatar() {
  const user = await fetch('/api/user')  // 命中缓存，无网络请求
  return <Avatar data={user} />
}
```

**注意**：仅对 `GET` 请求生效，请求完成后缓存即清除。

### 2. Data Cache（数据缓存）

跨请求和部署持久化存储获取的数据。默认情况下，`fetch` 请求会被缓存。

```
// 默认缓存（静态渲染）
const data = await fetch('https://api.example.com/data')

// 禁用缓存（动态渲染）
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store'
})

// 定时重新验证（ISR）
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 }  // 每小时重新验证
})

// 按标签重新验证
const data = await fetch('https://api.example.com/data', {
  next: { tags: ['products'] }
})
```

### 3. Full Route Cache（完整路由缓存）

在构建时将路由渲染为 HTML 和 RSC Payload 并缓存。静态页面只需构建一次，即可服务多个用户。

- 静态路由：构建时生成并缓存
- 动态路由：每次请求时重新渲染，不缓存
- ISR 路由：构建时生成，按间隔或按需重新验证

### 4. Router Cache（路由缓存）

客户端内存缓存，存储已访问路由的 RSC Payload。默认缓存时间：
- 静态路由：5 分钟
- 动态路由：30 秒

```
// 刷新路由缓存
import { useRouter } from 'next/navigation'

function RefreshButton() {
  const router = useRouter()
  return <button onClick={() => router.refresh()}>刷新</button>
}
```

### 重新验证策略

**基于时间的重新验证（ISR）：**

```
// 每 60 秒后台重新验证
export const revalidate = 60

export default async function Page() {
  const data = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 }
  })
  return <PostList data={data} />
}
```

**按需重新验证：**

```
// 使用 revalidatePath
import { revalidatePath } from 'next/cache'

async function updatePost() {
  await updatePostInDB()
  revalidatePath('/posts')  // 清除 /posts 路由缓存
}

// 使用 revalidateTag（更精细）
import { revalidateTag } from 'next/cache'

async function updateProduct() {
  await updateProductInDB()
  revalidateTag('products')  // 清除所有标记为 'products' 的缓存
}
```

### 规则 `server-cache-react` 和 `server-cache-lru`

```
// server-cache-react：使用 React cache 函数记忆化服务端操作
import { cache } from 'react'

const getUser = cache(async (id: string) => {
  const user = await db.user.findUnique({ where: { id } })
  return user
})

// 同一请求内多次调用 getUser(id) 只执行一次数据库查询

// server-cache-lru：对非 fetch 数据使用 LRU 缓存
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, Data>({ max: 500, ttl: 1000 * 60 * 5 })
```

---

## 渲染优化

### 渲染策略选择

| 策略 | 适用场景 | 数据特征 | 性能特点 |
|------|----------|----------|----------|
| SSG | 博客、文档、营销页 | 静态、不频繁更新 | 极快，CDN 分发 |
| ISR | 电商产品页、新闻列表 | 定期更新 | 接近 SSG 速度 + 自动更新 |
| SSR | 用户仪表盘、个性化页面 | 实时、个性化 | 每次请求渲染 |
| CSR | 管理后台、编辑器 | 高交互、无需 SEO | 客户端渲染 |
| PPR | 混合页面 | 静态外壳 + 动态内容 | 静态即时 + 动态流式 |

### Partial Prerendering（PPR）

PPR 是 Next.js 的实验性功能，允许在同一页面中混合静态和动态内容。静态部分在构建时预渲染，动态部分在请求时通过 Suspense 流式传输。

```
// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div>
      {/* 静态外壳：构建时预渲染 */}
      <Header />
      <Navigation />

      {/* 动态内容：请求时流式传输 */}
      <Suspense fallback={<UserSkeleton />}>
        <UserProfile />  {/* 个性化数据 */}
      </Suspense>

      <Suspense fallback={<FeedSkeleton />}>
        <ActivityFeed />  {/* 实时数据 */}
      </Suspense>
    </div>
  )
}
```

### 规则 `rendering-hydration-no-flicker`：避免水合闪烁

```
// 错误：客户端渲染导致闪烁
function ThemeToggle() {
  const [theme, setTheme] = useState('light')  // 初始值与服务端不一致
  useEffect(() => {
    setTheme(localStorage.getItem('theme'))  // 水合后切换，产生闪烁
  }, [])
  return <div className={theme}>...</div>
}

// 正确：使用 suppressHydrationWarning 或 CSS 变量方案
function ThemeToggle() {
  return <div suppressHydrationWarning>...</div>
}
```

### 规则 `rendering-resource-hints`：使用资源提示

```
// 在 layout.tsx 中预连接关键域名
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link rel="preconnect" href="https://api.example.com" />
        <link rel="dns-prefetch" href="https://cdn.example.com" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 规则 `rendering-activity`：使用 Activity 组件保持 UI 状态

React 的 `<Activity>` 组件可以在导航间保留 UI 状态，避免切换标签页时丢失滚动位置、表单输入等。

---

## 常见反模式与修复

### 1. 顶层 await 阻塞流式传输

```
// 反模式
async function Page() {
  const slowData = await slowFetch()  // 阻塞整个页面
  return <PageContent data={slowData} />
}

// 修复：使用 Suspense 边界
function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SlowDataComponent />
    </Suspense>
  )
}
```

### 2. Barrel Import 增加包体积

**规则 `bundle-barrel-imports`**

```
// 反模式：barrel import 导入整个库
import { Button, Modal, Tooltip, Dropdown } from 'ui-library'

// 修复：具名路径导入
import { Button } from 'ui-library/button'
import { Modal } from 'ui-library/modal'
```

### 3. 在 Server Component 中传递大型数据到 Client Component

```
// 反模式：序列化大量数据跨越服务端-客户端边界
async function Page() {
  const allProducts = await db.products.findMany()  // 10000 条记录
  return <ClientProductList products={allProducts} />  // 全部序列化发送
}

// 修复：只传递必要字段，或让客户端组件自行获取
async function Page() {
  const products = await db.products.findMany({
    select: { id: true, name: true, price: true }  // 只选需要的字段
  })
  return <ClientProductList products={products} />
}
```

### 4. useEffect 驱动数据获取

```
// 反模式：useEffect 中获取数据
function Profile() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(setUser)
  }, [])
  // 问题：客户端瀑布流、加载闪烁、无 SEO
}

// 修复：Server Component 直接获取
async function Profile() {
  const user = await getUser()
  return <ProfileView user={user} />
}
```

### 5. 不必要的重渲染

**规则 `rerender-lazy-state-init`：惰性初始化状态**

```
// 反模式：每次渲染都执行昂贵计算
function Component() {
  const [data, setData] = useState(JSON.parse(localStorage.getItem('config')))
  // 每次渲染都解析 JSON
}

// 修复：使用惰性初始化
function Component() {
  const [data, setData] = useState(() => JSON.parse(localStorage.getItem('config')))
  // 只在初始化时执行一次
}
```

**规则 `rerender-move-effect-to-event`：将副作用从 useEffect 移到事件处理**

```
// 反模式：effect 中更新状态
function Cart() {
  const [items, setItems] = useState([])
  useEffect(() => {
    setItems(loadItems())  // 每次挂载都触发
  }, [])
}

// 修复：在事件中更新
function Cart() {
  const [items, setItems] = useState([])
  const handleAdd = (item) => {
    setItems(prev => [...prev, item])  // 只在用户操作时触发
  }
}
```

### 6. 条件导入未优化

**规则 `bundle-conditional`**

```
// 反模式：两个分支的代码都打包
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    const { lightProcess } = await import('./light')  // 两个都打包
    return lightProcess(userId)
  }
  const { heavyProcess } = await import('./heavy')
  return heavyProcess(userId)
}

// 修复：确保条件导入只加载需要的分支
// Next.js 自动处理动态 import 的代码分割
```

### 7. 第三方脚本阻塞渲染

**规则 `bundle-defer-third-party`**

```
// 反模式：同步加载第三方脚本
<Script src="https://analytics.example.com/script.js" />

// 修复：延迟加载非关键脚本
<Script src="https://analytics.example.com/script.js" strategy="lazyOnload" />
// 或使用 afterInteractive
<Script src="https://analytics.example.com/script.js" strategy="afterInteractive" />
```

---

## 性能检查清单

### CRITICAL（必须立即修复）

- [ ] 检查是否存在顺序 `await` 可改为 `Promise.all` 并行执行（`async-parallel`）
- [ ] 廉价条件判断是否在 `await` 之前执行（`async-cheap-condition-before-await`）
- [ ] `await` 是否延迟到真正需要结果时（`async-defer-await`）
- [ ] Server Components 是否直接调用 Route Handlers（`async-api-routes`）
- [ ] 是否存在 barrel import 导致包体积膨胀（`bundle-barrel-imports`）
- [ ] 是否使用动态 import 进行代码分割（`bundle-dynamic-imports`）
- [ ] 第三方脚本是否延迟加载（`bundle-defer-third-party`）
- [ ] 条件分支的代码是否正确按需加载（`bundle-conditional`）

### HIGH（高优先级）

- [ ] Server Components 中是否存在重复 props 传递（`server-dedup-props`）
- [ ] 静态 I/O 是否提升到模块顶层（`server-hoist-static-io`）
- [ ] 是否存在模块级可变状态（`server-no-shared-module-state`）
- [ ] 服务端数据获取是否并行化（`server-parallel-fetching`）
- [ ] 是否使用 React `cache` 记忆化服务端操作（`server-cache-react`）
- [ ] 非阻塞操作是否使用 `after` API（`server-after-nonblocking`）
- [ ] Server → Client 边界是否传递了不必要的大数据（`server-serialization`）

### MEDIUM（中等优先级）

- [ ] 客户端数据获取是否使用 SWR 去重（`client-swr-dedup`）
- [ ] 事件监听器是否正确去重（`client-event-listeners`）
- [ ] 滚动事件是否使用 passive 监听器（`client-passive-event-listeners`）
- [ ] `useState` 是否使用惰性初始化（`rerender-lazy-state-init`）
- [ ] `useMemo`/`useCallback` 依赖是否正确（`rerender-dependencies`）
- [ ] 派生状态是否使用 `useMemo` 而非 `useState` + `useEffect`（`rerender-derived-state`）
- [ ] 是否存在可从 `useEffect` 移到事件处理的副作用（`rerender-move-effect-to-event`）
- [ ] 是否使用 `useTransition` 处理非紧急状态更新（`rerender-transitions`）
- [ ] 是否使用 `useDeferredValue` 延迟非关键渲染（`rerender-use-deferred-value`）
- [ ] 瞬态值是否使用 `useRef` 而非 `useState`（`rerender-use-ref-transient-values`）
- [ ] 是否存在内联组件定义导致不必要的重渲染（`rerender-no-inline-components`）
- [ ] 水合是否出现闪烁（`rendering-hydration-no-flicker`）
- [ ] 是否使用资源提示（preconnect、dns-prefetch）（`rendering-resource-hints`）

### LOW（优化阶段）

- [ ] DOM/CSS 操作是否批量执行（`js-batch-dom-css`）
- [ ] 查找操作是否使用 Map/Set 替代数组（`js-set-map-lookups`）
- [ ] 循环中是否存在可提前退出的条件（`js-early-exit`）
- [ ] 属性访问是否缓存到局部变量（`js-cache-property-access`）
- [ ] 是否使用 `requestIdleCallback` 处理低优先级任务（`js-request-idle-callback`）
- [ ] 事件处理器是否使用 ref 存储（`advanced-event-handler-refs`）
- [ ] 应用是否只初始化一次（`advanced-init-once`）

---

## 使用方式

### 安装技能

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### 在 AI 编码助手中使用

安装后，AI 编码助手（Claude Code、Cursor 等）会自动在编写、审查或重构 React/Next.js 代码时参考这些规则。

### 渐进式采纳建议

不要试图一次性应用所有规则。推荐按优先级逐步采纳：

1. **第一周**：只启用 CRITICAL 规则（消除瀑布流 + 包体积优化）
2. **第二周**：加入 HIGH 规则（服务端性能）
3. **第三周起**：逐步加入 MEDIUM 和 LOW 规则

每加入一批规则后，运行测试和构建确认无回归：

```bash
npm run lint
npm run build
```

### 查看单条规则详情

每条规则在 GitHub 仓库中都有独立的 Markdown 文件，包含错误示例、正确示例和详细解释：

```
https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices/rules/
```

规则文件命名格式为 `{前缀}-{规则名}.md`，例如 `async-parallel.md`、`bundle-barrel-imports.md`。
