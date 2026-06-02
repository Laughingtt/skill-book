---
slug: webapp-testing
name: Webapp Testing
category: 安全与测试
tags: [testing, browser, playwright, e2e, accessibility, visual, webapp]
description: Anthropic官方Web应用测试技能，通过Playwright在真实浏览器中测试本地应用
install: "npx skills add https://github.com/anthropics/skills --skill webapp-testing"
source: "https://www.skills.sh/anthropics/skills/webapp-testing"
---

# Webapp Testing

## 简介

Webapp Testing 是 Anthropic 官方发布的 Claude Code 技能，提供完整的本地 Web 应用测试工具集。它基于 Playwright 浏览器自动化框架，让 AI Agent（如 Claude）能够直接在真实浏览器中执行测试，覆盖前端功能验证、UI 行为调试、截图捕获和浏览器控制台日志分析等场景。

与传统的 Playwright 测试不同，该技能的核心设计理念是**AI 驱动测试**：Claude 接收到测试需求后，会自动判断应用类型（静态 HTML / 动态应用），选择合适的测试策略，编写并执行 Playwright Python 脚本，最终输出测试结果和截图证据。整个过程无需人工编写测试代码。

该技能包含三个核心组件：

- **SKILL.md**：完整的测试策略指导文档（约 4KB，96 行），包含决策树和最佳实践
- **scripts/with_server.py**：服务器生命周期管理脚本（105 行），支持单服务器和多服务器场景
- **示例脚本**：三个参考实现（元素发现、静态 HTML 自动化、控制台日志捕获）

## 前置条件

### 安装 Playwright

```bash
# 安装 Playwright Python 包
pip install playwright

# 安装浏览器二进制文件（Chromium、Firefox、WebKit）
playwright install

# 如果只需 Chromium，可单独安装
playwright install chromium
```

### 系统依赖

在 Linux CI 环境中，可能需要额外安装系统依赖：

```bash
playwright install-deps
# 或针对特定浏览器
playwright install-deps chromium
```

### 安装技能

```bash
npx skills add https://github.com/anthropics/skills --skill webapp-testing
```

### 环境要求

- Python 3.8+
- 本地运行的 Web 应用（开发服务器）
- 对于动态应用，需确保服务器启动命令可用（如 `npm run dev`、`python server.py`）

## E2E测试详解

### 决策树：选择测试策略

该技能提供了一个系统化的决策树，帮助 AI Agent 自动选择最佳测试方式：

```
用户测试任务 → 是否为静态 HTML？
├─ 是 → 直接读取 HTML 文件以识别选择器
│ ├─ 成功 → 使用选择器编写 Playwright 脚本
│ └─ 失败/不完整 → 按动态应用处理（见下方）
│
└─ 否（动态 Web 应用） → 服务器是否已运行？
 ├─ 否 → 运行 python scripts/with_server.py --help
 │  然后使用该辅助脚本 + 编写简化的 Playwright 脚本
 │
 └─ 是 → 侦察-行动模式：
  1. 导航并等待 networkidle
  2. 截图或检查 DOM
  3. 从渲染状态识别选择器
  4. 使用发现的选择器执行操作
```

### 静态 HTML 测试

对于纯静态 HTML 文件，无需启动服务器，直接使用 `file://` 协议：

```python
from playwright.sync_api import sync_playwright
import os

html_file_path = os.path.abspath('test.html')
file_url = f'file://{html_file_path}'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    page.goto(file_url)
    page.screenshot(path='output/static_page.png')
    browser.close()
```

### 单服务器动态应用测试

使用 `with_server.py` 自动管理服务器生命周期：

```bash
# 先查看帮助
python scripts/with_server.py --help

# 启动单个服务器并运行测试
python scripts/with_server.py \
  --server "npm run dev" --port 5173 \
  -- python my_test.py
```

测试脚本只需包含 Playwright 逻辑，服务器启动和关闭由辅助脚本自动处理：

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:5173')  # 端口已就绪
    page.wait_for_load_state('networkidle')

    # 执行测试操作
    page.locator('button', has_text='提交').click()
    page.screenshot(path='output/after_submit.png')
    browser.close()
```

### 多服务器全栈应用测试

对于前后端分离的应用（如 FastAPI 后端 + Vue 前端）：

```bash
python scripts/with_server.py \
  --server "cd backend && python api.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python test_fullstack.py
```

`with_server.py` 会按顺序启动所有服务器，通过端口轮询确认每个服务就绪后再执行测试脚本，测试完成后自动清理所有进程。

### 侦察-行动模式

当面对不熟悉的应用时，遵循"先侦察、后行动"的模式：

```python
# 第一步：侦察 - 检查渲染后的 DOM 状态
page.goto('http://localhost:5173')
page.wait_for_load_state('networkidle')

# 截取全页面截图用于分析
page.screenshot(path='/tmp/inspect.png', full_page=True)

# 获取页面内容和交互元素
content = page.content()
buttons = page.locator('button').all()
links = page.locator('a').all()
inputs = page.locator('input').all()

# 第二步：识别 - 从渲染状态中发现选择器
for i, button in enumerate(buttons):
    text = button.inner_text() if button.is_visible() else "[hidden]"
    print(f"  [{i}] {text}")

# 第三步：行动 - 使用发现的选择器执行操作
page.locator('button', has_text='登录').click()
```

### 元素发现

该技能提供了 `element_discovery.py` 参考脚本，用于系统化发现页面中的交互元素：

```python
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')

    # 发现所有按钮
    buttons = page.locator('button').all()
    print(f"发现 {len(buttons)} 个按钮：")
    for i, button in enumerate(buttons):
        text = button.inner_text() if button.is_visible() else "[hidden]"
        print(f"  [{i}] {text}")

    # 发现所有链接
    links = page.locator('a').all()
    for i, link in enumerate(links):
        href = link.get_attribute('href')
        text = link.inner_text()
        print(f"  [{i}] {text} -> {href}")

    # 发现所有输入框
    inputs = page.locator('input').all()
    for i, input_field in enumerate(inputs):
        input_type = input_field.get_attribute('type')
        input_name = input_field.get_attribute('name')
        print(f"  [{i}] type={input_type}, name={input_name}")
```

## 可访问性测试

### 为什么需要可访问性测试

全球约 16% 的人口存在不同程度的残障，但大多数 Web 产品仍无法满足基本可访问性标准。美国 ADA 法案和欧盟《欧洲可访问性法案》均要求网站必须可访问。自动化可访问性测试能够将合规检查前移至开发阶段，大幅降低后期修复成本。

### axe-core 集成

Playwright 通过 `@axe-core/playwright` 包与 axe-core 引擎集成，可自动检测 WCAG 违规项：

```bash
# 安装 axe-core Playwright 包
npm install -D @axe-core/playwright
```

基础扫描示例：

```javascript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('不应存在 WCAG A 或 AA 级违规', async ({ page }) => {
  await page.goto('http://localhost:5173');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

### 创建可复用的 Axe Fixture

将 axe-core 配置封装为 Playwright fixture，确保所有测试使用一致的扫描标准：

```javascript
// fixtures/axe.fixture.ts
import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type AxeFixture = {
  makeAxeBuilder: () => AxeBuilder;
};

export const test = base.extend<AxeFixture>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .exclude('#third-party-widget')  // 排除不可控的第三方内容
      .exclude('[id^="google_ads_iframe_"]');

    await use(makeAxeBuilder);
  }
});

export { expect } from '@playwright/test';
```

在测试中使用：

```javascript
import { test, expect } from './fixtures/axe.fixture';

test('首页无可访问性违规', async ({ page, makeAxeBuilder }) => {
  await page.goto('/');
  const results = await makeAxeBuilder().analyze();
  expect(results.violations).toEqual([]);
});
```

### WCAG 合规标准

axe-core 支持检查以下标准：

| 标准 | 说明 |
|------|------|
| WCAG 2.0 Level A / AA | 基础可访问性要求 |
| WCAG 2.1 Level A / AA | 增加移动端和低视力场景要求 |
| WCAG 2.2 | 最新标准，增加更多认知障碍相关要求 |
| Section 508 | 美国联邦可访问性标准 |
| EN 301 549 | 欧洲ICT可访问性标准 |

### 常见可访问性问题

axe-core 能自动检测的典型违规包括：

- 图片缺少 alt 属性
- 表单控件缺少关联标签
- 标题层级跳跃（如 H1 后直接 H4）
- 颜色对比度不足
- 交互元素缺少键盘可访问性
- ARIA 属性使用错误
- 重复的 ID 属性

### 局限性

自动化测试只能发现约 30%-50% 的可访问性问题。手动测试仍不可替代，特别是对于屏幕阅读器体验、键盘导航流程、内容可理解性等主观性检查。

## 视觉回归测试

### 原理

视觉回归测试通过截图对比检测 UI 的意外变化。Playwright 内置了截图比较功能，无需额外工具即可开始：

```javascript
import { test, expect } from '@playwright/test';

test('首页视觉回归检查', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');

  // 全页面截图对比
  await expect(page).toHaveScreenshot('homepage.png');

  // 单个元素截图对比
  const navbar = page.locator('nav');
  await expect(navbar).toHaveScreenshot('navbar.png');
});
```

### 基线管理

首次运行时，Playwright 会自动生成基线截图并保存在测试文件同级的 `__screenshots__/` 目录中。后续运行时，新截图与基线进行像素级对比：

```
tests/
  homepage.spec.ts
  __screenshots__/
    homepage.spec.ts-snapshots/
      homepage-linux-chromium.png    # 基线截图
```

更新基线：

```bash
# 当 UI 变更是预期行为时，更新基线截图
npx playwright test --update-snapshots
```

### 配置阈值

在 `playwright.config.ts` 中调整对比敏感度：

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,   // 允许 1% 像素差异
      threshold: 0.2,             // 像素对比阈值
    },
  },
  use: {
    viewport: { width: 1280, height: 720 },  // 固定视口确保一致性
  },
});
```

### 视觉测试最佳实践

1. **按功能/页面组织测试**：将视觉测试放在独立目录，便于单独执行和维护
2. **使用描述性截图命名**：如 `checkout-payment-desktop.png`，一目了然
3. **分离视觉测试与功能测试**：视觉测试独立标记，避免功能测试失败触发不必要的截图更新
4. **版本控制基线截图**：将基线图提交到 Git，所有基线更新通过 PR 审核
5. **按稳定性配置阈值**：静态页面使用严格阈值，动态内容区域放宽设置
6. **CI 环境使用固定视口**：避免不同机器的字体和渲染差异导致误报
7. **使用 Docker 容器**：在 CI 中使用 `mcr.microsoft.com/playwright` 官方镜像，确保渲染环境一致

## 与AI Agent集成

### Claude 如何使用该技能

当用户向 Claude Code 提出测试需求时，Claude 会：

1. **触发检测**：识别到 Web 应用测试相关任务，加载 webapp-testing 技能
2. **上下文加载**：SKILL.md 内容（4KB，96 行）加载到上下文窗口
3. **策略选择**：根据决策树判断应用类型，选择静态/动态测试策略
4. **脚本编写**：自动生成 Playwright Python 脚本
5. **资源访问**：按需引用辅助脚本和示例，优先使用 `--help` 而非读取源码
6. **执行验证**：运行测试脚本，分析输出和截图

### 黑盒脚本使用原则

该技能强调一个关键实践：**不要将大型脚本源码读入上下文窗口**。辅助脚本被设计为黑盒工具：

- 先运行 `--help` 了解能力
- 直接调用脚本而非阅读源码
- 仅在无法通过 `--help` 解决时才读取源码

这避免了大型脚本文件占用 AI Agent 宝贵的上下文窗口。

### 控制台日志捕获

在 AI Agent 测试流程中，捕获浏览器控制台日志对于调试至关重要：

```python
from playwright.sync_api import sync_playwright

console_logs = []

def handle_console_message(msg):
    console_logs.append(f"[{msg.type}] {msg.text}")
    print(f"Console: [{msg.type}] {msg.text}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # 在导航前设置事件处理器
    page.on("console", handle_console_message)
    page.on("pageerror", lambda err: console_logs.append(f"[pageerror] {err}"))

    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')

    # 执行操作并分析控制台输出
    page.locator('button', has_text='提交').click()
    browser.close()

# 分析日志中的错误
errors = [log for log in console_logs if '[error]' in log or '[pageerror]' in log]
if errors:
    print(f"发现 {len(errors)} 个控制台错误")
```

### 跨浏览器测试

AI Agent 可自动在多浏览器上验证应用行为：

```python
with sync_playwright() as p:
    for browser_type in [p.chromium, p.firefox, p.webkit]:
        browser = browser_type.launch(headless=True)
        page = browser.new_page()
        page.goto('http://localhost:5173')
        page.screenshot(path=f'output/{browser_type.name}_homepage.png')
        browser.close()
```

## 测试策略

### 测试金字塔

Web 应用测试应遵循金字塔模型，从底到顶逐层覆盖：

| 层级 | 类型 | 数量 | 速度 | 范围 |
|------|------|------|------|------|
| 底层 | 单元测试 | 多 | 快 | 单个函数/组件 |
| 中层 | 集成测试 | 中 | 中 | 模块间交互 |
| 上层 | E2E 测试 | 少 | 慢 | 完整用户流程 |
| 顶层 | 视觉/可访问性测试 | 精选 | 中 | UI 渲染与合规 |

### 应该测试什么

**优先覆盖的关键路径**：

- 用户注册/登录流程
- 核心业务流程（下单、支付、数据提交）
- 表单验证和错误提示
- 导航和页面跳转
- 数据展示的准确性

**不要测试的内容**：

- 第三方服务的外部链接
- 不可控的第三方组件内容
- 浏览器原生行为（如滚动条样式）
- 纯 CSS 动画的中间帧

### 测试隔离原则

每个测试应该独立运行，不依赖其他测试的状态：

```python
# 正确：每个测试自行准备数据
def test_create_todo(page):
    page.goto('http://localhost:5173')
    page.fill('#todo-input', 'Buy milk')
    page.click('#add-button')
    assert page.locator('.todo-item').count() == 1

# 错误：依赖前一个测试创建的数据
def test_delete_todo(page):
    # 如果前一个测试失败，这个测试也会失败
    page.click('.todo-item:first-child .delete-button')
```

## 常用测试模式

### Page Object Model（页面对象模型）

将页面逻辑抽象为类，与测试脚本分离，提高可维护性和复用性：

```python
# models/search_page.py
class SearchPage:
    def __init__(self, page):
        self.page = page
        self.search_input = page.locator('[aria-label="搜索"]')
        self.search_button = page.locator('button', has_text='搜索')
        self.results = page.locator('.search-result')

    def navigate(self):
        self.page.goto('http://localhost:5173/search')

    def search(self, text):
        self.search_input.fill(text)
        self.search_button.click()

    def get_result_count(self):
        return self.results.count()
```

在测试中使用：

```python
from models.search_page import SearchPage

page = browser.new_page()
search_page = SearchPage(page)
search_page.navigate()
search_page.search('Playwright 测试')
assert search_page.get_result_count() > 0
```

### Playwright Fixtures

使用 fixture 管理测试环境和页面对象，避免在每个测试中手动创建实例：

```javascript
// fixtures/test.fixture.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});
```

测试代码变得简洁直观：

```javascript
import { test, expect } from './fixtures/test.fixture';

test('登录后跳转到仪表盘', async ({ loginPage, dashboardPage }) => {
  await loginPage.login('user@example.com', 'password');
  await expect(dashboardPage.heading).toBeVisible();
});
```

### 并行执行

Playwright 默认利用可用 CPU 核心并行运行测试：

```bash
# 本地运行，自动使用所有 CPU 核心
npx playwright test

# 指定 worker 数量
npx playwright test --workers=4
```

在配置中区分本地和 CI 环境：

```javascript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 1 : undefined,  // CI 用单 worker 保稳定
});
```

### 测试分片（Sharding）

对于大型测试套件，可将测试分散到多台机器并行执行：

```bash
# 将测试分为 4 个分片
npx playwright test --shard=1/4
npx playwright test --shard=2/4
npx playwright test --shard=3/4
npx playwright test --shard=4/4
```

## CI/CD集成

### GitHub Actions 基础配置

```yaml
name: Playwright Tests
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  playwright-tests:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: lts

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload test results
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14
```

### GitHub Actions 分片配置

利用 matrix 策略实现多机并行测试，配合 blob 报告合并：

```yaml
jobs:
  playwright-tests:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: lts

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}

      - name: Upload blob report
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: blob-report-${{ matrix.shardIndex }}
          path: blob-report
          retention-days: 1

  merge-reports:
    if: ${{ !cancelled() }}
    needs: [playwright-tests]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: lts

      - name: Install dependencies
        run: npm ci

      - name: Download all blob reports
        uses: actions/download-artifact@v4
        with:
          path: blob-report
          pattern: blob-report-*
          merge-multiple: true

      - name: Merge reports
        run: npx playwright merge-reports --reporter html ./blob-report

      - name: Upload merged HTML report
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
          retention-days: 14
```

### GitLab CI 配置

GitLab CI 的 `parallel` 关键字使分片配置更加简洁：

```yaml
stages:
  - test
  - report

playwright-tests:
  stage: test
  image: mcr.microsoft.com/playwright:v1.52.0-noble
  parallel: 7
  script:
    - npm ci
    - npx playwright test --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
  artifacts:
    when: always
    paths:
      - blob-report
    expire_in: 1 day

merge-reports:
  stage: report
  when: always
  image: mcr.microsoft.com/playwright:v1.52.0-noble
  dependencies:
    - playwright-tests
  script:
    - npm ci
    - npx playwright merge-reports --reporter html ./blob-report
  artifacts:
    when: always
    paths:
      - playwright-report
    expire_in: 14 days
```

### 使用 Docker 容器

在 CI 中使用官方 Playwright Docker 镜像，避免每次安装浏览器：

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.52.0-noble
```

## 常见问题

### 服务器启动失败

**现象**：`with_server.py` 报告"Server failed to start"

**原因**：端口被占用、启动命令错误、超时时间过短

**解决方案**：

```bash
# 检查端口是否被占用
lsof -i :5173

# 手动验证启动命令是否正常工作
npm run dev

# 增加超时时间
python scripts/with_server.py --server "npm run dev" --port 5173 --timeout 60 -- python test.py
```

### 元素未找到

**现象**：`page.locator()` 返回空列表或找不到元素

**原因**：未等待正确加载状态，或选择器不匹配

**解决方案**：

```python
# 确保等待 networkidle
page.wait_for_load_state('networkidle')

# 通过截图确认页面实际状态
page.screenshot(path='debug.png')

# 使用更精确的选择器
page.get_by_role('button', name='提交')    # 优先
page.locator('text=提交')                    # 次选
page.locator('#submit-btn')                  # 最后
```

### 测试不稳定（Flaky Tests）

**现象**：测试时过时不过，无明显规律

**原因**：竞态条件、网络延迟、时序问题

**解决方案**：

```python
# 使用显式等待而非固定超时
page.wait_for_selector('.result', state='visible')

# 使用 Playwright 的 Web First 断言（自动等待和重试）
# 正确
await expect(page.get_by_text('操作成功')).to_be_visible()
# 错误
expect(await page.get_by_text('操作成功').is_visible()).to_be(True)

# 在失败时捕获调试信息
try:
    page.locator('.result').click(timeout=5000)
except Exception:
    page.screenshot(path='failure_debug.png')
    print(page.content())
    raise
```

### 控制台错误未捕获

**现象**：JavaScript 错误发生但未出现在控制台日志中

**原因**：事件处理器在导航之后才设置

**解决方案**：

```python
# 必须在 page.goto() 之前设置事件监听
page.on("console", handle_console)
page.on("pageerror", handle_page_error)  # 捕获未处理的异常

page.goto('http://localhost:5173')
```

### 截图质量问题

**现象**：截图截断或尺寸不对

**原因**：视口未设置、截图时机不对

**解决方案**：

```python
# 设置固定视口确保一致性
page = browser.new_page(viewport={'width': 1920, 'height': 1080})

# 使用 full_page=True 捕获完整页面
page.screenshot(path='output.png', full_page=True)

# 等待加载完成后再截图
page.wait_for_load_state('networkidle')
```

### 动态应用中 DOM 检查时机错误

**现象**：`page.locator('button').all()` 返回不完整的元素列表

**原因**：在 JavaScript 渲染完成前就检查 DOM

**解决方案**：

```python
# 错误：可能在 JS 执行前就检查
page.goto('http://localhost:5173')
buttons = page.locator('button').all()  # 可能遗漏动态渲染的元素

# 正确：等待 JS 执行完成
page.goto('http://localhost:5173')
page.wait_for_load_state('networkidle')
buttons = page.locator('button').all()  # 获取所有元素
```
