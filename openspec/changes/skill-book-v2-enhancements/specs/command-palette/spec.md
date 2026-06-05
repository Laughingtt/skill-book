## ADDED Requirements

### Requirement: 命令速查面板全局唤起
系统 SHALL 提供全局命令速查面板，用户在任何页面按下 `⌘K`（macOS）或 `Ctrl+K`（Windows/Linux）快捷键时 SHALL 弹出面板。按下 `Escape` 键或点击面板外部区域 SHALL 关闭面板。

#### Scenario: 用户按快捷键打开面板
- **WHEN** 用户在任意页面按下 `⌘K` 或 `Ctrl+K`
- **THEN** 命令速查面板 SHALL 以模态层形式弹出，搜索输入框自动获得焦点

#### Scenario: 用户关闭面板
- **WHEN** 面板已打开且用户按下 `Escape` 键
- **THEN** 面板 SHALL 关闭，焦点返回之前的活动元素

#### Scenario: 用户点击面板外部关闭
- **WHEN** 面板已打开且用户点击面板遮罩层区域
- **THEN** 面板 SHALL 关闭

### Requirement: 命令模糊搜索
系统 SHALL 聚合所有 skill 的 commands 字段，展平为命令条目列表。用户在搜索框输入时，SHALL 使用 Fuse.js 进行模糊搜索，搜索权重为：命令内容（权重 2）、命令名称（权重 1.5）、所属 skill 名称（权重 1）。

#### Scenario: 搜索匹配命令
- **WHEN** 用户在命令面板搜索框输入 "commit"
- **THEN** 系统 SHALL 展示所有命令内容或名称包含 "commit" 的条目，按相关度排序

#### Scenario: 搜索为空时显示全部命令
- **WHEN** 搜索框为空
- **THEN** 系统 SHALL 显示所有命令条目，按所属 skill 名称字母排序

#### Scenario: 搜索无匹配结果
- **WHEN** 用户输入的搜索词无任何匹配
- **THEN** 系统 SHALL 显示"未找到匹配命令"提示

### Requirement: 一键复制命令
每个命令条目 SHALL 显示所属 skill 名称、命令名称、完整命令内容。用户点击命令条目或按 `Enter` 键（当命令高亮时）SHALL 将命令内容复制到剪贴板，显示复制成功提示，并关闭面板。

#### Scenario: 点击复制命令
- **WHEN** 用户点击某条命令条目
- **THEN** 该命令的 `cmd` 字段内容 SHALL 被复制到系统剪贴板，显示"已复制"提示，面板关闭

#### Scenario: 键盘导航并复制
- **WHEN** 用户使用上下方向键高亮某条命令后按下 `Enter`
- **THEN** 高亮命令的 `cmd` 字段内容 SHALL 被复制到系统剪贴板，显示"已复制"提示，面板关闭

### Requirement: 键盘导航
面板 SHALL 支持键盘导航：上下方向键在搜索结果中移动高亮，`Enter` 执行复制，`Escape` 关闭面板。

#### Scenario: 上下键导航
- **WHEN** 面板显示搜索结果且用户按下 `↓` 键
- **THEN** 高亮 SHALL 移动到下一条命令；若已在最后一条，则高亮保持在最后一条

#### Scenario: 上键循环
- **WHEN** 高亮在第一条命令且用户按下 `↑` 键
- **THEN** 高亮 SHALL 移动到最后一条命令（循环）

### Requirement: 面板挂载在应用根层级
CommandPalette 组件 SHALL 通过 Teleport 挂载到 `<body>`，作为全局模态层存在，不受路由切换影响。面板打开时 SHALL 在页面内容上方显示半透明遮罩层。

#### Scenario: 路由切换后面板仍然可用
- **WHEN** 用户在 Skill 详情页按 `⌘K` 打开命令面板
- **THEN** 面板 SHALL 正常弹出并展示所有命令，当前路由不受影响
