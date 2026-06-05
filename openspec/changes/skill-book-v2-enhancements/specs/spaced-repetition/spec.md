## ADDED Requirements

### Requirement: 复习计划自动创建
系统 SHALL 为每个状态为 `learning` 的 skill 自动创建复习计划。复习计划包含：`nextReviewAt`（下次复习日期）、`interval`（当前间隔天数）、`reviewCount`（已复习次数）、`lastReviewedAt`（上次复习日期）。间隔序列 SHALL 为 [1, 3, 7, 14, 30] 天。

#### Scenario: skill 状态变为 learning 时自动创建计划
- **WHEN** 用户将某 skill 状态设置为 `learning`，且该 skill 没有复习计划
- **THEN** 系统 SHALL 自动创建复习计划，`nextReviewAt` 设为当前时间 + 1 天，`interval` 设为 1，`reviewCount` 设为 0

#### Scenario: 已有复习计划的 skill 不重复创建
- **WHEN** skill 状态变为 `learning` 但已有复习计划
- **THEN** 系统 SHALL 保留现有复习计划不变

### Requirement: 复习到期提醒
系统 SHALL 计算当前日期与 `nextReviewAt` 的差值，当 `nextReviewAt ≤ 当前日期` 时，该 skill SHALL 出现在"今日复习"列表中。

#### Scenario: 复习到期
- **WHEN** 某个 learning 状态的 skill 的 `nextReviewAt` 为今天或更早
- **THEN** 该 skill SHALL 出现在 My Space 页面的"今日复习"区域

#### Scenario: 复习未到期
- **WHEN** 某个 learning 状态的 skill 的 `nextReviewAt` 在未来
- **THEN** 该 skill SHALL NOT 出现在"今日复习"区域

### Requirement: 标记已复习
用户点击"已复习"按钮时，系统 SHALL 更新复习计划：`lastReviewedAt` 设为当前时间，`reviewCount` 加 1，`interval` 推进到序列中的下一级，`nextReviewAt` 设为当前时间 + 新 interval。若已达到最大间隔（30天），则保持 30 天间隔循环。

#### Scenario: 首次复习推进间隔
- **WHEN** skill 复习计划 interval=1（1天间隔），用户点击"已复习"
- **THEN** `interval` SHALL 变为 3，`nextReviewAt` SHALL 变为当前时间 + 3 天，`reviewCount` SHALL 变为 1

#### Scenario: 达到最大间隔后循环
- **WHEN** skill 复习计划 interval=30（已达最大间隔），用户点击"已复习"
- **THEN** `interval` SHALL 保持 30，`nextReviewAt` SHALL 变为当前时间 + 30 天，`reviewCount` SHALL 加 1

### Requirement: 标记未记住回退间隔
用户点击"未记住"按钮时，系统 SHALL 将 `interval` 回退到序列第一级（1天），`nextReviewAt` 设为当前时间 + 1 天。

#### Scenario: 复习时标记未记住
- **WHEN** skill 复习计划 interval=14，用户点击"未记住"
- **THEN** `interval` SHALL 变为 1，`nextReviewAt` SHALL 变为当前时间 + 1 天

### Requirement: mastered 状态自动清除复习计划
当 skill 状态变为 `mastered` 时，系统 SHALL 删除该 skill 的复习计划。

#### Scenario: skill 变为 mastered
- **WHEN** 用户将某 skill 状态从 `learning` 改为 `mastered`
- **THEN** 该 skill 的复习计划 SHALL 被删除，不再出现在复习提醒中

### Requirement: 复习数据持久化
复习计划数据 SHALL 持久化到 localStorage，key 为 `skill-book-review-schedule`。格式为 JSON 对象 `{ [slug]: { nextReviewAt, interval, reviewCount, lastReviewedAt } }`。

#### Scenario: 页面刷新后复习计划保留
- **WHEN** 用户刷新页面
- **THEN** 所有复习计划 SHALL 从 localStorage 恢复，"今日复习"列表正确显示

### Requirement: My Space 今日复习区域
My Space 页面 SHALL 新增"今日复习"区域，展示所有到期需复习的 skill 列表。每个 skill 条目显示名称、当前间隔天数、已复习次数，以及"已复习"和"未记住"两个操作按钮。

#### Scenario: 有到期复习的 skill
- **WHEN** 存在 `nextReviewAt ≤ 当前日期` 的 learning 状态 skill
- **THEN** My Space 页面 SHALL 显示"今日复习"区域，列出所有到期 skill

#### Scenario: 无到期复习的 skill
- **WHEN** 没有到期的复习 skill
- **THEN** "今日复习"区域 SHALL 显示"今日无需复习 🎉"提示
