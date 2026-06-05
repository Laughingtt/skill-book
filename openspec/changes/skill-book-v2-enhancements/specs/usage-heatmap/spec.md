## ADDED Requirements

### Requirement: 日维度使用统计
系统 SHALL 通过 `useStats` composable 从 `useUsageTracker` 的 `stats` 数据中聚合生成日维度统计。对于每个日期，SHALL 计算该日查看 skill 的总次数。统计范围 SHALL 为最近 90 天。

#### Scenario: 聚合每日查看次数
- **WHEN** `useUsageTracker` 中存在 `lastViewedAt` 在某天的多条记录
- **THEN** `useStats` SHALL 为该日期计算总查看次数

#### Scenario: 无查看记录的日期
- **WHEN** 某天没有任何 skill 查看记录
- **THEN** 该日期的查看次数 SHALL 为 0

### Requirement: GitHub 风格热力图渲染
系统 SHALL 在 My Space 页面渲染 GitHub 风格的贡献热力图，展示最近 90 天的每日 skill 查看活跃度。热力图 SHALL 使用 7 行（周一至周日）× N 列（周数）的 SVG 矩形网格。每个矩形代表一天，颜色深浅表示查看次数。

#### Scenario: 渲染热力图
- **WHEN** 用户访问 My Space 页面
- **THEN** 页面 SHALL 显示最近 90 天的热力图，每天一个矩形格子，颜色从浅到深表示 0→1→2→4→8+ 次查看

#### Scenario: 热力图颜色等级
- **WHEN** 某天查看次数为 0
- **THEN** 矩形 SHALL 使用最浅色（`var(--color-heatmap-0)`）
- **WHEN** 某天查看次数为 1
- **THEN** 矩形 SHALL 使用 `var(--color-heatmap-1)`
- **WHEN** 某天查看次数为 2-3
- **THEN** 矩形 SHALL 使用 `var(--color-heatmap-2)`
- **WHEN** 某天查看次数为 4-7
- **THEN** 矩形 SHALL 使用 `var(--color-heatmap-3)`
- **WHEN** 某天查看次数 ≥ 8
- **THEN** 矩形 SHALL 使用 `var(--color-heatmap-4)`

### Requirement: 热力图悬停提示
用户鼠标悬停在热力图某天的矩形上时，SHALL 显示 tooltip 提示该日期和查看次数。

#### Scenario: 悬停查看详情
- **WHEN** 用户将鼠标悬停在热力图某矩形上
- **THEN** SHALL 显示 tooltip，内容为"YYYY-MM-DD: N 次查看"

### Requirement: 热力图月份标签
热力图顶部 SHALL 显示月份标签，标识每个月份的起始位置。

#### Scenario: 月份标签显示
- **WHEN** 热力图渲染
- **THEN** 每个月份的起始周列上方 SHALL 显示月份名称（如"1月"、"2月"）

### Requirement: Skill 列表排序
系统 SHALL 提供排序功能，用户可按以下维度对 skill 列表排序：名称（A-Z / Z-A）、查看频率（高→低 / 低→高）、最近查看（近→远 / 远→近）、学习状态（mastered→learning→todo）。默认排序为 index.json 原始顺序。

#### Scenario: 按名称排序
- **WHEN** 用户选择"名称 A-Z"排序
- **THEN** skill 列表 SHALL 按 name 字段字母升序排列

#### Scenario: 按查看频率排序
- **WHEN** 用户选择"查看频率 高→低"排序
- **THEN** skill 列表 SHALL 按 viewCount 降序排列，未查看的 skill 排在最后

#### Scenario: 按最近查看排序
- **WHEN** 用户选择"最近查看"排序
- **THEN** skill 列表 SHALL 按 lastViewedAt 降序排列，从未查看的 skill 排在最后

#### Scenario: 按学习状态排序
- **WHEN** 用户选择"学习状态"排序
- **THEN** skill 列表 SHALL 按 mastered→learning→todo→无状态 顺序排列

### Requirement: 排序 UI 控件
HomeView 页面 SHALL 在 skill 卡片网格上方显示排序下拉选择器。排序选择 SHALL 持久化到 `useSettings` composable，页面刷新后保持用户选择的排序方式。

#### Scenario: 排序选择器交互
- **WHEN** 用户点击排序下拉选择器并选择某个排序选项
- **THEN** skill 列表 SHALL 立即按所选方式重新排序，无需刷新页面

#### Scenario: 排序偏好持久化
- **WHEN** 用户选择排序方式后刷新页面
- **THEN** 排序方式 SHALL 从 localStorage 恢复，列表按之前选择的方式排序
