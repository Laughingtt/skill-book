## MODIFIED Requirements

### Requirement: 导入数据完整恢复
`DataPanel.vue` 的 `importData()` 函数 SHALL 完整恢复所有导出的数据，包括 `bookmarks`、`skillStatus`、`skillNotes`、`usageStats`、`userSkills`。合并策略：现有数据优先（不覆盖已有条目），缺失条目从备份补充。

#### Scenario: 导入恢复 usageStats
- **WHEN** 导入的备份文件包含 `usageStats` 数据
- **THEN** 系统 SHALL 将 `usageStats` 合并到 localStorage key `skill-book-usage-stats`，现有条目不被覆盖，新条目从备份补充

#### Scenario: 导入恢复 userSkills
- **WHEN** 导入的备份文件包含 `userSkills` 数据
- **THEN** 系统 SHALL 将 `userSkills` 合并到 localStorage key `skill-book-skills`，现有 skill 不被覆盖，新 skill 从备份补充

#### Scenario: 导入恢复 reviewSchedule
- **WHEN** 导入的备份文件包含 `reviewSchedule` 数据（间隔复习系统新增）
- **THEN** 系统 SHALL 将 `reviewSchedule` 合并到 localStorage key `skill-book-review-schedule`，现有条目不被覆盖

#### Scenario: 导入后 composable 状态更新
- **WHEN** 数据导入完成并调用 `location.reload()`
- **THEN** 所有 composable SHALL 从 localStorage 重新加载最新数据，包括 `usageStats`、`userSkills`、`reviewSchedule`

### Requirement: 导出数据包含所有用户数据
`DataPanel.vue` 的 `exportData()` 函数 SHALL 导出所有用户数据，包括 `bookmarks`、`skillStatus`、`skillNotes`、`usageStats`、`userSkills`、`reviewSchedule`（如有）、`settings`（如有）。

#### Scenario: 导出包含 reviewSchedule
- **WHEN** 用户点击"导出备份"
- **THEN** 导出的 JSON SHALL 包含 `reviewSchedule` 字段（从 localStorage key `skill-book-review-schedule` 读取）

#### Scenario: 导出包含 settings
- **WHEN** 用户点击"导出备份"
- **THEN** 导出的 JSON SHALL 包含 `settings` 字段（从 localStorage key `skill-book-settings` 读取）

### Requirement: 备份版本升级
导出数据的 `version` 字段 SHALL 升级为 `2`，以区分包含 `reviewSchedule` 和 `settings` 的新格式。导入时 SHALL 兼容 `version: 1` 的旧备份（缺失新字段时使用默认值）。

#### Scenario: 导入旧版备份兼容
- **WHEN** 导入 `version: 1` 的备份文件（不包含 `reviewSchedule` 和 `settings`）
- **THEN** 系统 SHALL 正常导入已有字段，不报错，`reviewSchedule` 和 `settings` 使用默认值

#### Scenario: 导入新版备份
- **WHEN** 导入 `version: 2` 的备份文件（包含所有字段）
- **THEN** 系统 SHALL 完整恢复所有数据
