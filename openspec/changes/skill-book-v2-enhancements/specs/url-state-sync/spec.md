## ADDED Requirements

### Requirement: 筛选状态同步到 URL
系统 SHALL 将当前筛选状态同步到 URL hash 查询参数。参数包括：`category`（分类）、`tags`（标签，逗号分隔）、`scenario`（场景）、`q`（搜索词）。格式：`#/?category=xxx&tags=a,b&scenario=yyy&q=search`。

#### Scenario: 选择分类后 URL 更新
- **WHEN** 用户选择分类 "Git 工作流"
- **THEN** URL SHALL 更新为 `#/?category=Git%20工作流`

#### Scenario: 选择多个标签后 URL 更新
- **WHEN** 用户选择标签 "cli" 和 "automation"
- **THEN** URL SHALL 更新为 `#/?tags=cli,automation`

#### Scenario: 组合筛选 URL 更新
- **WHEN** 用户选择分类 "Git 工作流"、标签 "cli"、搜索词 "commit"
- **THEN** URL SHALL 更新为 `#/?category=Git%20工作流&tags=cli&q=commit`

#### Scenario: 清除筛选后 URL 更新
- **WHEN** 用户点击"清除筛选"
- **THEN** URL SHALL 更新为 `#/`（无查询参数）

### Requirement: 从 URL 恢复筛选状态
页面首次加载时，系统 SHALL 从 URL hash 查询参数恢复筛选状态。若 URL 包含 `category` 参数，SHALL 设置对应分类为选中状态。若 URL 包含 `tags` 参数，SHALL 解析逗号分隔的标签列表并设置为选中状态。若 URL 包含 `scenario` 参数，SHALL 设置对应场景为选中状态。若 URL 包含 `q` 参数，SHALL 设置搜索框内容。

#### Scenario: 从 URL 恢复分类筛选
- **WHEN** 用户访问 `#/?category=Git%20工作流`
- **THEN** 页面加载后 SHALL 自动选中分类 "Git 工作流"，显示该分类下的 skill

#### Scenario: 从 URL 恢复多标签筛选
- **WHEN** 用户访问 `#/?tags=cli,automation`
- **THEN** 页面加载后 SHALL 自动选中标签 "cli" 和 "automation"，显示同时包含这两个标签的 skill

#### Scenario: 从 URL 恢复搜索词
- **WHEN** 用户访问 `#/?q=commit`
- **THEN** 页面加载后 SHALL 在搜索框显示 "commit"，并显示搜索结果

#### Scenario: URL 无参数时默认状态
- **WHEN** 用户访问 `#/`（无查询参数）
- **THEN** 页面 SHALL 显示默认状态：分类为"全部"，无标签筛选，无搜索词

### Requirement: 浏览器前进/后退支持
用户使用浏览器前进/后退按钮时，系统 SHALL 根据 URL 变化更新筛选状态，实现历史导航。

#### Scenario: 后退恢复之前筛选
- **WHEN** 用户在分类 "Git 工作流" 页面点击某 skill 进入详情页，然后点击浏览器后退按钮
- **THEN** 页面 SHALL 返回分类 "Git 工作流" 的筛选状态

#### Scenario: 前进恢复之后筛选
- **WHEN** 用户从分类 "Git 工作流" 导航到分类 "测试"，然后后退到 "Git 工作流"，再点击前进按钮
- **THEN** 页面 SHALL 恢复分类 "测试" 的筛选状态

### Requirement: URL 参数编码
URL 中的中文和特殊字符 SHALL 使用 `encodeURIComponent` 进行编码，解析时使用 `decodeURIComponent` 解码。

#### Scenario: 中文分类编码
- **WHEN** 用户选择分类 "代码质量"
- **THEN** URL 中的 category 参数 SHALL 编码为 `%E4%BB%A3%E7%A0%81%E8%B4%A8%E9%87%8F`

#### Scenario: 解码中文参数
- **WHEN** 用户访问 `#/?category=%E4%BB%A3%E7%A0%81%E8%B4%A8%E9%87%8F`
- **THEN** 系统 SHALL 解码并选中分类 "代码质量"

### Requirement: 分享筛选结果
用户 SHALL 能够通过复制当前页面 URL 分享筛选结果给他人。接收者打开链接后 SHALL 看到相同的筛选状态。

#### Scenario: 分享筛选链接
- **WHEN** 用户在分类 "Git 工作流"、标签 "cli" 的筛选状态下复制 URL 并发送给他人
- **THEN** 接收者打开该 URL 后 SHALL 看到相同的分类和标签筛选结果

### Requirement: URL 状态与 composable 双向绑定
筛选状态变化时 SHALL 更新 URL，URL 变化时（如 popstate 事件）SHALL 更新 composable 状态。两者 SHALL 保持同步。

#### Scenario: composable 状态变化更新 URL
- **WHEN** `useFilters` 的 `selectedCategory` 发生变化
- **THEN** URL SHALL 自动更新对应的 `category` 参数

#### Scenario: URL 变化更新 composable 状态
- **WHEN** 浏览器触发 `popstate` 事件，URL 查询参数发生变化
- **THEN** `useFilters`、`useScenarios`、`useSearch` 的状态 SHALL 根据 URL 更新
