## ADDED Requirements

### Requirement: 主题状态管理
系统 SHALL 通过 `useSettings` composable 管理主题状态。主题选项 SHALL 包括：`'light'`（浅色）、`'dark'`（深色）、`'system'`（跟随系统）。默认值 SHALL 为 `'system'`。

#### Scenario: 初始主题为 system
- **WHEN** 用户首次访问 Skill Book，localStorage 中无主题偏好
- **THEN** 主题 SHALL 默认为 `'system'`，根据系统偏好自动选择浅色或深色

#### Scenario: 主题持久化
- **WHEN** 用户选择某个主题
- **THEN** 主题偏好 SHALL 保存到 localStorage key `skill-book-settings`，格式为 `{ theme: 'light' | 'dark' | 'system' }`

#### Scenario: 页面刷新恢复主题
- **WHEN** 用户刷新页面
- **THEN** 主题 SHALL 从 localStorage 恢复，保持用户之前的选择

### Requirement: 主题切换 UI
系统 SHALL 提供主题切换控件，用户可选择浅色、深色或跟随系统。切换控件 SHALL 放置在 GlobalNav 或 SubNav 中。

#### Scenario: 点击切换主题
- **WHEN** 用户点击主题切换按钮并选择"深色"
- **THEN** 页面 SHALL 立即切换为深色主题，无需刷新

#### Scenario: 选择跟随系统
- **WHEN** 用户选择"跟随系统"主题
- **THEN** 页面 SHALL 根据系统当前偏好显示浅色或深色，并在系统偏好变化时自动切换

### Requirement: CSS 变量主题切换
系统 SHALL 在 `<html>` 元素上设置 `data-theme` 属性（值为 `light` 或 `dark`）。CSS 样式 SHALL 使用 `[data-theme="dark"]` 选择器覆盖浅色主题变量。优先级：手动选择 > 系统偏好。

#### Scenario: 深色主题属性设置
- **WHEN** 用户选择深色主题
- **THEN** `<html>` 元素 SHALL 添加 `data-theme="dark"` 属性

#### Scenario: 浅色主题属性设置
- **WHEN** 用户选择浅色主题
- **THEN** `<html>` 元素 SHALL 添加 `data-theme="light"` 属性，或移除 `data-theme` 属性

#### Scenario: 跟随系统时动态切换
- **WHEN** 用户选择"跟随系统"且系统偏好从浅色变为深色
- **THEN** `<html>` 元素的 `data-theme` 属性 SHALL 自动更新为 `dark`

### Requirement: 组件硬编码颜色替换
所有组件中的硬编码颜色值（如 `#faf9f6`、`#0a0a0a`、`#c4553a`）SHALL 替换为 CSS 自定义属性引用（如 `var(--color-bg-primary)`、`var(--color-text-primary)`）。

#### Scenario: 背景色使用变量
- **WHEN** 组件设置背景色
- **THEN** SHALL 使用 `var(--color-bg-primary)` 而非硬编码的 `#faf9f6`

#### Scenario: 文本色使用变量
- **WHEN** 组件设置文本颜色
- **THEN** SHALL 使用 `var(--color-text-primary)` 而非硬编码的 `#0a0a0a`

#### Scenario: 强调色使用变量
- **WHEN** 组件使用强调色（如按钮、链接）
- **THEN** SHALL 使用 `var(--color-accent)` 而非硬编码的 `#c4553a`

### Requirement: tokens.css 扩展热力图颜色
`tokens.css` SHALL 新增热力图颜色变量：`--color-heatmap-0`（无活动）到 `--color-heatmap-4`（高活动），浅色和深色主题分别定义。

#### Scenario: 浅色主题热力图颜色
- **WHEN** 主题为浅色
- **THEN** 热力图 SHALL 使用浅色背景上的绿色渐变（从 `#ebedf0` 到 `#39d353`）

#### Scenario: 深色主题热力图颜色
- **WHEN** 主题为深色
- **THEN** 热力图 SHALL 使用深色背景上的绿色渐变（从 `#161b22` 到 `#39d353`）

### Requirement: 系统偏好变化监听
当用户选择"跟随系统"主题时，系统 SHALL 监听 `prefers-color-scheme` 媒体查询变化，自动切换主题。

#### Scenario: 系统偏好变化时自动切换
- **WHEN** 用户主题设置为 `'system'`，且系统偏好从浅色变为深色
- **THEN** 页面 SHALL 自动切换为深色主题，无需用户干预
