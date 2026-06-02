---
slug: vercel-composition-patterns
name: Vercel Composition Patterns
category: 编码开发与工程规范
tags: [react, composition, compound-components, patterns, vercel]
description: Vercel官方React组合模式技能，用复合组件替代boolean prop泛滥的架构方案
install: "npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-composition-patterns"
source: "https://www.skills.sh/vercel-labs/agent-skills/vercel-composition-patterns"
---

## 简介

React 组合模式（Composition Patterns）是一套由 Vercel 官方总结的组件架构最佳实践，核心目标是**用组合替代配置**，解决组件 API 随需求增长而失控的问题。

在 React 开发中，最常见的架构退化路径是：组件最初只有几个 props，随着需求迭代不断添加 `showX`、`hasY`、`isZ` 这类布尔属性，最终演变成一个拥有 14+ props 的"上帝组件"。Vercel 组合模式提供了一套系统化的方案，通过复合组件（Compound Components）、Context Provider、显式变体（Explicit Variants）等模式，从根本上消除 boolean prop 泛滥的问题，让组件 API 保持简洁、灵活、可扩展。

这套模式按优先级分为四个层级：

| 优先级 | 类别 | 影响程度 | 前缀 |
|--------|------|----------|------|
| 1 | 组件架构 | HIGH | `architecture-` |
| 2 | 状态管理 | MEDIUM | `state-` |
| 3 | 实现模式 | MEDIUM | `patterns-` |
| 4 | React 19 API | MEDIUM | `react19-` |

---

## 核心概念

### 复合组件（Compound Components）

复合组件是组合模式的核心。它将一个复杂组件拆分为多个协作的子组件，子组件通过共享的 Context 隐式获取状态，而非通过 props 逐层传递。消费者只需组合自己需要的部分。

**核心特征：**
- 父组件提供 Context，管理共享状态
- 子组件通过 Context 读取状态和操作，无需 prop drilling
- 消费者自由组合子组件，无需关心内部条件逻辑
- 新增子组件不影响现有 API

### Render Props

Render Props 是一种通过函数 prop 共享逻辑的模式。子组件接收一个返回 React 元素的函数，由该函数决定渲染内容。虽然灵活，但在组合模式中，Render Props 被视为**应避免的模式**——优先使用 `children` 或复合组件替代 `renderX` 类 props。

### Context Provider

Context Provider 是复合组件的底层支撑机制。通过 React Context API，父组件向所有子组件注入共享状态、操作方法和元信息，避免 prop drilling。在 React 19 中，`use()` API 进一步简化了 Context 的消费方式。

---

## 反模式：Boolean Props

### 为什么 Boolean Props 是反模式

Boolean props 在设计工具（如 Figma）中看起来很自然——设计师可以轻松切换 `hasIcon`、`showLabel` 等开关。但在代码中，它们会引发一系列问题：

**1. 状态冲突——不可能的组合**

当多个 boolean props 控制同一关注点时，会产生逻辑上互斥但语法上合法的组合：

```jsx
// 哪个样式应该生效？primary？warning？还是 danger？
<Button primary warning danger>Click Me</Button>
```

组件内部不得不通过优先级判断来处理冲突，实现细节因此泄漏到 API 层面。

**2. API 膨胀——Prop Soup**

一个 Dialog 组件可能演变成这样：

```jsx
<Dialog
  showTitle={true}
  titleText="确认删除"
  showDescription={true}
  descriptionText="此操作不可撤销"
  showCloseButton={true}
  closeButtonPosition="top-right"
  showFooter={true}
  footerContent={<Actions />}
  isLoading={false}
  hasError={false}
  // 每次新需求都加更多 props...
/>
```

14 个 props 还不是终点——下一个需求可能再加 3 个。

**3. 灵活性丧失**

Boolean props 将组件结构硬编码。消费者无法自定义布局、替换子区域或添加新部分，除非组件作者添加更多 props。

**4. TypeScript 类型爆炸**

多个 boolean props 的组合导致类型定义变成复杂的联合类型（Union Types），难以维护和理解。

### Boolean Props 检查清单

当你发现以下信号时，说明 boolean props 正在伤害你的组件：

- 同一关注点有 2 个以上 boolean props（如 `primary` + `secondary` + `danger`）
- 组件内部有大量 `if (propA && !propB)` 形式的条件判断
- 新需求总是通过添加 boolean prop 实现
- Props 数量超过 8 个
- 消费者需要查阅文档才能知道哪些组合是合法的

---

## 组合模式详解

### 模式一：复合组件替代单体组件

**Before：单体组件 + Render Props**

```jsx
// 单体组件，通过 renderX props 控制各区域渲染
function Accordion({ items, renderHeader, renderContent, defaultOpen }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen ?? 0);

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <div onClick={() => setOpenIndex(index)}>
            {renderHeader ? renderHeader(item, index === openIndex) : item.title}
          </div>
          {index === openIndex && (
            <div>
              {renderContent ? renderContent(item) : item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 使用：render props 导致嵌套回调，可读性差
<Accordion
  items={data}
  renderHeader={(item, isOpen) => <CustomHeader item={item} isOpen={isOpen} />}
  renderContent={(item) => <CustomContent item={item} />}
/>
```

**After：复合组件 + 共享 Context**

```jsx
// 创建 Context
const AccordionContext = createContext(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Must be used within Accordion');
  return ctx;
}

// Root 组件：管理状态，提供 Context
function Accordion({ defaultIndex = 0, children }) {
  const [openIndex, setOpenIndex] = useState(defaultIndex);
  return (
    <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
      <div>{children}</div>
    </AccordionContext.Provider>
  );
}

// 子组件：通过 Context 获取状态
function Item({ children, index }) {
  const { openIndex, setOpenIndex } = useAccordion();
  const isOpen = openIndex === index;
  return (
    <div>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { isOpen, index, setOpenIndex })
          : child
      )}
    </div>
  );
}

function Trigger({ children, isOpen, index, setOpenIndex }) {
  return (
    <button onClick={() => setOpenIndex(index)} aria-expanded={isOpen}>
      {children}
    </button>
  );
}

function Content({ children, isOpen }) {
  return isOpen ? <div role="region">{children}</div> : null;
}

// 附加到父组件
Accordion.Item = Item;
Accordion.Trigger = Trigger;
Accordion.Content = Content;

// 使用：声明式组合，清晰直观
<Accordion defaultIndex={0}>
  <Accordion.Item index={0}>
    <Accordion.Trigger>第一部分</Accordion.Trigger>
    <Accordion.Content>第一部分的内容</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item index={1}>
    <Accordion.Trigger>第二部分</Accordion.Trigger>
    <Accordion.Content>第二部分的内容</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

**关键改进：**
- 消费者只组合需要的部分，没有隐藏的条件逻辑
- 状态、操作和元信息由父 Provider 依赖注入
- 同一组件结构可复用于多种场景
- 新增子组件（如 `Accordion.Icon`）不影响现有 API

### 模式二：显式变体替代 Boolean Props

**Before：Boolean Props 控制变体**

```jsx
// 多个 boolean props 控制外观，容易冲突
<Button primary large disabled loading icon="check" />
```

**After：显式变体 + 组合**

```jsx
// 单一 variant prop + 子组件组合
<Button variant="primary" size="large" disabled>
  <Button.Icon name="check" />
  <Button.Loader />
  提交
</Button>
```

**变体类型定义：**

```typescript
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  children?: React.ReactNode;
}
```

单一 `variant` prop 消除了不可能状态——TypeScript 会在编译时阻止无效组合。

### 模式三：Context Provider 管理共享状态

**Before：Prop Drilling**

```jsx
function Card({ title, description, isCollapsed, onToggle, isExpandable, variant, size }) {
  return (
    <div className={`card card--${variant} card--${size}`}>
      <CardHeader title={title} isCollapsed={isCollapsed} onToggle={onToggle} />
      <CardBody description={description} isCollapsed={isCollapsed} />
    </div>
  );
}
```

**After：Context Provider 注入**

```jsx
// 定义 Context 接口
interface CardContextValue {
  state: {
    isCollapsed: boolean;
    isExpanded: boolean;
    variant: 'default' | 'outline' | 'ghost';
    size: 'default' | 'sm' | 'lg';
  };
  actions: {
    setIsCollapsed: (collapsed: boolean) => void;
    setIsExpanded: (expanded: boolean) => void;
    onDismiss?: () => void;
  };
  meta: {
    isExpandable: boolean;
    isDismissible: boolean;
  };
}

const CardContext = createContext<CardContextValue | null>(null);

// Root 组件提供 Context
function Card({ variant = 'default', size = 'default', children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <CardContext.Provider value={{
      state: { isCollapsed, isExpanded, variant, size },
      actions: { setIsCollapsed, setIsExpanded },
      meta: { isExpandable: true, isDismissible: false },
    }}>
      <div className={`card card--${variant} card--${size}`}>
        {children}
      </div>
    </CardContext.Provider>
  );
}

// 子组件通过 Context 消费
function CardHeader() {
  const { state, actions } = useContext(CardContext);
  return (
    <div onClick={() => actions.setIsCollapsed(!state.isCollapsed)}>
      {/* 渲染逻辑 */}
    </div>
  );
}

// 使用
<Card variant="outline" size="lg">
  <Card.Header />
  <Card.Body>内容</Card.Body>
  <Card.Footer>操作</Card.Footer>
</Card>
```

**Context 接口设计原则：**
- 将 Context 值分为 `state`、`actions`、`meta` 三部分
- `state` 包含响应式数据
- `actions` 包含修改状态的方法
- `meta` 包含只读的配置信息
- 这种结构便于拆分 Context 以优化重渲染性能

### 模式四：用 children 替代 renderX Props

**Before：renderX Props**

```jsx
<List
  renderItem={(item) => <CustomItem item={item} />}
  renderEmpty={() => <EmptyState />}
  renderLoading={() => <Spinner />}
/>
```

**After：children + 子组件**

```jsx
<List>
  <List.Items>{items.map(item => <CustomItem key={item.id} item={item} />)}</List.Items>
  <List.Empty><EmptyState /></List.Empty>
  <List.Loading><Spinner /></List.Loading>
</List>
```

children 是 React 最自然的组合方式，与 JSX 声明式风格一致，避免了回调嵌套。

---

## React 19 变更影响

React 19 引入了多项影响组合模式实现的 API 变更：

### 1. `use()` 替代 `useContext`

React 19 新增 `use()` API，可以消费 Context，且支持在条件语句和循环中调用——这是 `useContext` 做不到的：

```jsx
// Before：useContext 不能在条件语句中调用
function Header({ showTheme }) {
  // 必须在组件顶层调用，无法条件化
  const theme = useContext(ThemeContext);
  if (!showTheme) return null;
  return <h1 style={{ color: theme.color }}>标题</h1>;
}

// After：use() 可以在条件语句中调用
function Header({ showTheme }) {
  if (!showTheme) return null;
  const theme = use(ThemeContext);  // 合法！
  return <h1 style={{ color: theme.color }}>标题</h1>;
}
```

**对复合组件的影响：** 子组件可以更灵活地消费 Context，减少不必要的组件拆分。

### 2. `forwardRef` 废弃

React 19 中函数组件不再需要 `forwardRef`，`ref` 作为普通 prop 传递：

```jsx
// Before：需要 forwardRef 包裹
const Input = forwardRef((props, ref) => (
  <input ref={ref} {...props} />
));

// After：ref 作为普通 prop
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

**对复合组件的影响：** 子组件的 ref 转发更简洁，复合组件的 API 实现更简单。

### 3. Context 作为 Provider

React 19 中 `<Context>` 本身可以直接作为 Provider 使用，不再需要 `<Context.Provider>`：

```jsx
// Before
<ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>

// After
<ThemeContext value={theme}>{children}</ThemeContext>
```

### 4. 迁移建议

| 旧模式 | React 19 新模式 | 迁移优先级 |
|--------|----------------|-----------|
| `useContext(Context)` | `use(Context)` | 中 |
| `forwardRef((props, ref) => ...)` | `function Comp({ ref, ...props })` | 高 |
| `<Context.Provider value={v}>` | `<Context value={v}>` | 低 |
| `renderX` props | `children` + 子组件 | 高 |

---

## 最佳实践

### 1. 避免 Boolean Props，使用显式变体

```typescript
// Bad
interface ButtonProps {
  primary?: boolean;
  secondary?: boolean;
  danger?: boolean;
  large?: boolean;
  small?: boolean;
}

// Good
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}
```

### 2. 用 children 替代 renderX Props

```jsx
// Bad
<Component renderHeader={() => <Header />} />

// Good
<Component>
  <Component.Header />
</Component>
```

### 3. 设计 Context 接口时分离关注点

```typescript
// Good：state / actions / meta 三层分离
interface ContextValue<T> {
  state: T;
  actions: Actions;
  meta: { loading: boolean; error: Error | null };
}
```

### 4. 复合组件的子组件通过 Object Attachment 挂载

```jsx
// Good：命名空间清晰
Accordion.Item = Item;
Accordion.Trigger = Trigger;
Accordion.Content = Content;

// 使用时一目了然
<Accordion>
  <Accordion.Item>
    <Accordion.Trigger>...</Accordion.Trigger>
    <Accordion.Content>...</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

### 5. 拆分 Context 优化重渲染

当 Context 值频繁变化时，将高频变化的部分拆分为独立 Context：

```jsx
// 拆分前：任何状态变化都导致所有消费者重渲染
<CardContext.Provider value={{ isCollapsed, variant, setIsCollapsed }}>

// 拆分后：只有 isCollapsed 变化时才触发相关消费者重渲染
<CardStateContext.Provider value={{ isCollapsed }}>
  <CardActionContext.Provider value={{ setIsCollapsed }}>
    <CardConfigContext.Provider value={{ variant }}>
      {children}
    </CardConfigContext.Provider>
  </CardActionContext.Provider>
</CardStateContext.Provider>
```

### 6. 保持子组件的独立性

每个子组件应该只负责自己的渲染逻辑，不依赖兄弟组件的存在：

```jsx
// Good：即使没有 Trigger，Content 也能正常工作
<Accordion>
  <Accordion.Item index={0}>
    <Accordion.Content>始终可见的内容</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

### 7. 无障碍性（Accessibility）

组合模式必须保持无障碍性：

- 使用语义化 HTML（`role`、`aria-expanded`、`aria-controls`）
- 键盘导航支持（Enter/Space 触发、Tab 切换）
- Focus 管理在复合组件间正确传递
- 屏幕阅读器能正确识别组件关系

---

## 迁移指南

### 步骤一：识别需要迁移的组件

寻找以下信号：
- Props 数量超过 8 个
- 存在 2 个以上控制同一关注点的 boolean props
- 组件内部有复杂的条件渲染逻辑
- `renderX` 类 props 超过 2 个

### 步骤二：拆分为复合组件

以 Dialog 组件为例：

**迁移前：**

```jsx
<Dialog
  showTitle={true}
  titleText="确认"
  showDescription={true}
  descriptionText="确定要删除吗？"
  showCloseButton={true}
  showFooter={true}
  onConfirm={handleConfirm}
  onCancel={handleCancel}
/>
```

**迁移后：**

```jsx
<Dialog.Root onConfirm={handleConfirm} onCancel={handleCancel}>
  <Dialog.Title>确认</Dialog.Title>
  <Dialog.Description>确定要删除吗？</Dialog.Description>
  <Dialog.CloseButton />
  <Dialog.Footer>
    <Button variant="secondary" onClick={handleCancel}>取消</Button>
    <Button variant="danger" onClick={handleConfirm}>删除</Button>
  </Dialog.Footer>
</Dialog.Root>
```

### 步骤三：创建 Context 和 Provider

```jsx
const DialogContext = createContext(null);

function DialogRoot({ open, onOpenChange, children }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {open && <div role="dialog" aria-modal="true">{children}</div>}
    </DialogContext.Provider>
  );
}
```

### 步骤四：实现子组件

```jsx
function DialogTitle({ children }) {
  return <h2>{children}</h2>;
}

function DialogDescription({ children }) {
  return <p>{children}</p>;
}

function DialogCloseButton() {
  const { onOpenChange } = use(DialogContext);
  return <button onClick={() => onOpenChange(false)}>X</button>;
}

function DialogFooter({ children }) {
  return <div className="dialog-footer">{children}</div>;
}
```

### 步骤五：挂载子组件并导出

```jsx
const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Title: DialogTitle,
  Description: DialogDescription,
  CloseButton: DialogCloseButton,
  Footer: DialogFooter,
});

export { Dialog };
```

### 步骤六：渐进式迁移策略

不需要一次性迁移所有组件。推荐策略：

1. **新组件直接使用组合模式**——从今天开始，新写的组件不再使用 boolean props
2. **痛点优先**——先迁移 props 最多、条件逻辑最复杂的组件
3. **保持向后兼容**——迁移期间保留旧 API，标记为 `@deprecated`
4. **逐步清理**——确认所有消费者迁移完成后，移除旧 API

```jsx
// 迁移期间保持兼容
function Dialog(props) {
  // 旧 API：boolean props
  if (props.showTitle !== undefined) {
    console.warn('Dialog: showTitle is deprecated, use Dialog.Title instead');
    return <LegacyDialog {...props} />;
  }
  // 新 API：复合组件
  return <DialogRoot {...props} />;
}
```

### 迁移对照表

| 旧模式 | 新模式 | 示例 |
|--------|--------|------|
| `renderHeader={() => <Header />}` | `<Component.Header />` | 子组件组合 |
| `<Button primary large />` | `<Button variant="primary" size="large" />` | 显式变体 |
| `showX={true}` + `xText="..."` | `<Component.X>...</Component.X>` | children 组合 |
| `forwardRef` | `({ ref, ...props })` | React 19 ref prop |
| `useContext(Ctx)` | `use(Ctx)` | React 19 use() API |
| `<Ctx.Provider value={v}>` | `<Ctx value={v}>` | React 19 Context Provider |

---

## 参考资源

- [Vercel Academy: Component Composition Patterns](https://vercel.com/academy/nextjs-foundations/component-composition-patterns)
- [Vercel Academy: Compound Components and Advanced Composition](https://vercel.com/academy/shadcn-ui/compound-components-and-advanced-composition)
- [Vercel Agent Skills: composition-patterns](https://github.com/vercel-labs/agent-skills/tree/main/skills/composition-patterns)
- [React v19 官方发布说明](https://react.dev/blog/2024/12/05/react-19)
- [patterns.dev: Compound Pattern](https://www.patterns.dev/react/compound-pattern)
