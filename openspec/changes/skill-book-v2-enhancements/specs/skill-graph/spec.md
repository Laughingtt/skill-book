## ADDED Requirements

### Requirement: Skill frontmatter related 字段
Skill 的 YAML frontmatter SHALL 支持可选 `related` 字段，值为关联 skill 的 slug 数组。格式：`related: [slug-a, slug-b, slug-c]`。

#### Scenario: 声明关联 skill
- **WHEN** skill 的 frontmatter 包含 `related: [git-smart-commit, code-review]`
- **THEN** 系统 SHALL 识别该 skill 与 git-smart-commit 和 code-review 存在手动声明的关联关系

#### Scenario: 无 related 字段
- **WHEN** skill 的 frontmatter 不包含 `related` 字段
- **THEN** 系统 SHALL 视该 skill 无手动声明的关联，不影响自动关联发现

### Requirement: 关联发现综合评分算法
系统 SHALL 综合以下因素计算 skill 间的关联分数：手动声明（权重 3）、同 category（权重 1）、标签重叠（每个重叠标签权重 0.5）、场景重叠（每个重叠场景权重 0.5）。总分 ≥ 2 的 skill 对 SHALL 建立关联边。

#### Scenario: 手动声明关联
- **WHEN** skill A 的 `related` 字段包含 skill B 的 slug
- **THEN** A→B 的关联分数 SHALL 包含手动声明权重 3

#### Scenario: 自动发现关联
- **WHEN** skill A 和 skill B 同 category 且有 2 个重叠标签
- **THEN** A→B 的关联分数 SHALL 为 1 + 2×0.5 = 2，达到阈值，建立关联边

#### Scenario: 关联分数不足
- **WHEN** skill A 和 skill B 同 category 但无标签和场景重叠
- **THEN** A→B 的关联分数 SHALL 为 1，未达阈值 2，不建立关联边

### Requirement: Skill 详情页关联可视化
Skill 详情页 SHALL 新增"关联图谱"区域，使用 SVG 力导向布局渲染当前 skill 及其关联 skill 的关系图。当前 skill SHALL 在中心位置，关联 skill 围绕分布。节点显示 skill 名称，边表示关联关系。

#### Scenario: 有关联 skill 时显示图谱
- **WHEN** 当前 skill 存在关联 skill（手动声明或自动发现）
- **THEN** 详情页 SHALL 显示关联图谱区域，中心为当前 skill，关联 skill 为周围节点

#### Scenario: 无关联 skill 时不显示图谱
- **WHEN** 当前 skill 无任何关联 skill
- **THEN** 详情页 SHALL NOT 显示关联图谱区域

#### Scenario: 点击关联节点导航
- **WHEN** 用户点击图谱中某个关联 skill 的节点
- **THEN** 系统 SHALL 导航到该 skill 的详情页

### Requirement: 关联图谱交互
图谱 SHALL 支持鼠标拖拽节点调整位置，鼠标悬停节点显示 skill 名称和关联分数 tooltip。

#### Scenario: 拖拽节点
- **WHEN** 用户按住鼠标拖拽图谱中某个节点
- **THEN** 该节点 SHALL 跟随鼠标移动，关联边随之调整

#### Scenario: 悬停节点提示
- **WHEN** 用户将鼠标悬停在图谱中某个关联 skill 节点上
- **THEN** SHALL 显示 tooltip，内容为 skill 名称和与当前 skill 的关联分数

### Requirement: related 字段包含在 index.json
`index.json` 构建脚本 SHALL 将 `related` 字段包含在输出中。`vite-plugin-skill-api.js` 的 `rebuildIndex()` 函数 SHALL 同样输出 `related` 字段。

#### Scenario: 构建脚本输出 related
- **WHEN** 运行 `npm run build:skills`
- **THEN** 生成的 `index.json` 中每个 skill 条目 SHALL 包含 `related` 数组（若 frontmatter 中有声明）或空数组

### Requirement: 浏览器端 frontmatter 解析器支持 related
`src/utils/frontmatter.js` SHALL 支持解析 `related` 字段（字符串数组格式，与 `tags` 和 `scenarios` 格式相同）。

#### Scenario: 解析 related 字段
- **WHEN** skill 的 .md 文件 frontmatter 包含 `related: [slug-a, slug-b]`
- **THEN** 浏览器端 frontmatter 解析器 SHALL 正确解析为 `{ related: ['slug-a', 'slug-b'] }`
