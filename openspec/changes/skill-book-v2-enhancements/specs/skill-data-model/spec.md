## MODIFIED Requirements

### Requirement: index.json 构建输出完整字段
`build-skills.js` 生成的 `index.json` SHALL 包含以下字段：`name`、`slug`、`category`、`tags`、`description`、`scenarios`（数组）、`commands`（完整对象数组，包含 `name` 和 `cmd`）、`quickstart`（字符串，可选）、`install`（字符串，可选）、`source`（字符串，可选）、`related`（字符串数组，可选）。

#### Scenario: 构建包含 scenarios
- **WHEN** skill 的 frontmatter 包含 `scenarios: [git-workflow, code-review]`
- **THEN** `index.json` 中该 skill 条目 SHALL 包含 `"scenarios": ["git-workflow", "code-review"]`

#### Scenario: 构建包含完整 commands
- **WHEN** skill 的 frontmatter 包含 `commands: [{ name: "安装", cmd: "npx skills add x" }]`
- **THEN** `index.json` 中该 skill 条目 SHALL 包含 `"commands": [{ "name": "安装", "cmd": "npx skills add x" }]`，而非仅 cmd 字符串

#### Scenario: 构建包含 quickstart
- **WHEN** skill 的 frontmatter 包含 `quickstart: "快速开始指南..."`
- **THEN** `index.json` 中该 skill 条目 SHALL 包含 `"quickstart": "快速开始指南..."`

#### Scenario: 构建包含 related
- **WHEN** skill 的 frontmatter 包含 `related: [git-smart-commit, code-review]`
- **THEN** `index.json` 中该 skill 条目 SHALL 包含 `"related": ["git-smart-commit", "code-review"]`

#### Scenario: 可选字段缺失时输出空值
- **WHEN** skill 的 frontmatter 不包含 `scenarios`、`commands`、`quickstart`、`related` 字段
- **THEN** `index.json` 中该 skill 条目 SHALL 输出 `"scenarios": []`、`"commands": []`、不包含 `quickstart` 和 `related` 字段（省略空值）

### Requirement: vite-plugin-skill-api rebuildIndex 输出完整字段
`vite-plugin-skill-api.js` 中的 `rebuildIndex()` 函数 SHALL 与 `build-skills.js` 输出相同字段结构，确保开发模式和构建模式一致。

#### Scenario: 开发模式重建 index 包含完整字段
- **WHEN** 在开发模式下创建或删除 skill，触发 `rebuildIndex()`
- **THEN** 重建的 `index.json` SHALL 包含 `scenarios`、`commands`、`quickstart`、`related` 字段，格式与 `build-skills.js` 输出一致

### Requirement: vite-plugin-skill-api POST 保存 frontmatter 扩展字段
`vite-plugin-skill-api.js` 的 POST 处理 SHALL 支持保存 `scenarios`、`commands`、`quickstart`、`related` 字段到 `.md` 文件的 frontmatter。

#### Scenario: 保存包含 scenarios 和 commands 的 skill
- **WHEN** 通过 POST API 创建 skill，frontmatter 包含 `scenarios` 和 `commands`
- **THEN** 生成的 `.md` 文件 frontmatter SHALL 包含 `scenarios` 和 `commands` 字段

#### Scenario: 保存包含 related 的 skill
- **WHEN** 通过 POST API 创建 skill，frontmatter 包含 `related: ["slug-a"]`
- **THEN** 生成的 `.md` 文件 frontmatter SHALL 包含 `related` 字段

### Requirement: 浏览器端 frontmatter 解析器支持新字段
`src/utils/frontmatter.js` SHALL 支持解析 `related` 字段（字符串数组格式，与 `tags` 格式相同）。`commands` 字段的对象数组解析 SHALL 正确处理。

#### Scenario: 解析 related 数组
- **WHEN** frontmatter 包含 `related: [slug-a, slug-b]`
- **THEN** 解析结果 SHALL 包含 `{ related: ['slug-a', 'slug-b'] }`

#### Scenario: 解析 commands 对象数组
- **WHEN** frontmatter 包含 `commands` 对象数组（`- name: "x"\n  cmd: "y"` 格式）
- **THEN** 解析结果 SHALL 包含 `{ commands: [{ name: 'x', cmd: 'y' }] }`
