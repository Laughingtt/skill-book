## MODIFIED Requirements

### Requirement: SkillFormModal 编辑模式激活
`SkillFormModal.vue` 的编辑模式 SHALL 被激活为可用功能。当从 Skill 详情页点击"编辑"按钮时，SHALL 打开 SkillFormModal 编辑模态框（而非当前的内联编辑器），预填充 skill 的所有字段。

#### Scenario: 从详情页编辑 skill
- **WHEN** 用户在 Skill 详情页点击"编辑"按钮
- **THEN** SkillFormModal SHALL 以编辑模式打开，预填充 skill 的 name、slug、category、tags、description、install、source 字段

#### Scenario: 编辑模式下 slug 不可修改
- **WHEN** SkillFormModal 以编辑模式打开
- **THEN** slug 字段 SHALL 为只读状态，不可修改

#### Scenario: 提交编辑更新 skill
- **WHEN** 用户在编辑模式下修改字段并提交
- **THEN** 系统 SHALL 调用 `useSkills.updateSkill()` 保存修改，关闭模态框，详情页显示更新后的内容

### Requirement: SkillFormModal 支持扩展字段
`SkillFormModal` SHALL 支持编辑 `scenarios`（场景标签）、`commands`（命令列表）、`related`（关联 skill）字段。

#### Scenario: 编辑 scenarios
- **WHEN** 用户在 SkillFormModal 中编辑 scenarios 字段
- **THEN** SHALL 显示场景标签输入区域，支持添加和删除场景标签

#### Scenario: 编辑 commands
- **WHEN** 用户在 SkillFormModal 中编辑 commands 字段
- **THEN** SHALL 显示命令列表编辑区域，每条命令包含 name 和 cmd 两个输入框，支持添加和删除命令条目

#### Scenario: 编辑 related
- **WHEN** 用户在 SkillFormModal 中编辑 related 字段
- **THEN** SHALL 显示关联 skill 输入区域，支持从已有 skill 列表中选择关联 skill

### Requirement: 移除详情页内联编辑器
Skill 详情页的内联编辑器（edit textarea + live preview 分栏）SHALL 被移除，编辑功能统一由 SkillFormModal 提供。详情页的"编辑"按钮 SHALL 打开 SkillFormModal 而非切换内联编辑模式。

#### Scenario: 点击编辑按钮打开模态框
- **WHEN** 用户在详情页点击"编辑"按钮
- **THEN** SkillFormModal SHALL 打开，详情页内容不变（不再切换为内联编辑模式）

#### Scenario: 删除内联编辑状态
- **WHEN** SkillDetailView 加载
- **THEN** SHALL NOT 包含 `isEditing` 状态和内联编辑/预览分栏 UI
