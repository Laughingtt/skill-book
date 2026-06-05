## ADDED Requirements

### Requirement: Service Worker 缓存
系统 SHALL 注册 Service Worker，实现离线缓存。缓存策略：`index.html` 和 `index.json` 使用 StaleWhileRevalidate（优先使用缓存，后台更新），`.md` 文件使用 CacheFirst（优先缓存），静态资源（JS/CSS/字体/图片）使用 CacheFirst 并设置 30 天过期。

#### Scenario: 首次访问缓存资源
- **WHEN** 用户首次访问 Skill Book
- **THEN** Service Worker SHALL 缓存 `index.html`、`index.json`、所有静态资源

#### Scenario: 离线访问已缓存页面
- **WHEN** 用户在离线状态下访问已缓存的 Skill Book 页面
- **THEN** 页面 SHALL 正常加载和显示，无网络错误

#### Scenario: 离线访问已查看的 skill 详情
- **WHEN** 用户在离线状态下访问之前已查看过的 skill 详情页
- **THEN** 该 skill 的 `.md` 内容 SHALL 从缓存加载，页面正常显示

#### Scenario: 离线访问未缓存的 skill
- **WHEN** 用户在离线状态下访问之前未查看过的 skill 详情页
- **THEN** 系统 SHALL 显示"该技能内容未缓存，需要网络连接"提示

### Requirement: Web App Manifest
系统 SHALL 提供 `manifest.json`，包含应用名称、图标、主题色、背景色、显示模式等配置。显示模式 SHALL 为 `standalone`。

#### Scenario: 添加到主屏幕
- **WHEN** 用户在移动浏览器中选择"添加到主屏幕"
- **THEN** 系统 SHALL 显示应用名称"Skill Book"和图标，添加后以独立窗口形式打开

#### Scenario: 应用图标配置
- **WHEN** `manifest.json` 被读取
- **THEN** SHALL 包含至少 192px 和 512px 两种尺寸的应用图标

### Requirement: 缓存更新通知
当 Service Worker 检测到新版本缓存可用时，SHALL 在页面底部显示"有新版本可用，点击刷新"提示。用户点击后 SHALL 刷新页面加载新版本。

#### Scenario: 检测到新版本
- **WHEN** Service Worker 在后台获取到新的 `index.json` 或 `index.html`
- **THEN** 页面底部 SHALL 显示更新提示条

#### Scenario: 用户点击刷新
- **WHEN** 用户点击更新提示条
- **THEN** 页面 SHALL 刷新并加载新版本缓存

### Requirement: 使用 vite-plugin-pwa
系统 SHALL 使用 `vite-plugin-pwa` 插件自动生成 Service Worker 和 manifest.json，而非手写。

#### Scenario: 构建时自动生成 SW
- **WHEN** 运行 `npm run build`
- **THEN** vite-plugin-pwa SHALL 自动生成 Service Worker 文件和 manifest.json，包含在构建输出中

#### Scenario: 开发模式不启用 SW
- **WHEN** 运行 `npm run dev`
- **THEN** Service Worker SHALL NOT 注册，避免开发时的缓存干扰
