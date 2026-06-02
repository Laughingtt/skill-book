---
slug: dependency-audit
name: Dependency Audit
category: 代码维护与质量
tags: [dependency, security, vulnerability, audit, npm-audit, pip-audit]
description: 依赖安全检测技能，扫描漏洞、未使用包、过时版本和供应链风险
install: "npx antigravity-awesome-skills 或复制 SKILL.md 到 .claude/skills/dependency-audit/"
source: "https://github.com/sickn33/antigravity-awesome-skills"
---

# Dependency Audit（依赖安全检测）

## 简介

依赖安全检测是现代软件开发中不可或缺的安全实践。随着项目依赖第三方包数量激增（平均 JavaScript 项目有超过 1000 个传递依赖），供应链攻击已成为主要威胁。本技能帮助开发者系统性地识别、评估和修复依赖中的安全漏洞、许可证风险和过时版本。

### 为什么依赖审计至关重要

- **供应链攻击激增**：Log4Shell（CVE-2021-44228）等事件影响数百万应用
- **传递依赖风险**：你直接安装的 40 个包，实际可能引入 600+ 传递依赖
- **合规要求**：企业需要确保许可证合规性和 SBOM（软件物料清单）
- **安全左移**：在开发阶段发现问题，而非生产环境

## 核心功能

### 1. 漏洞扫描

检测已知安全漏洞（CVE），按严重程度分类：

| 严重级别 | 说明 | 处理优先级 |
|---------|------|-----------|
| Critical | 可被远程利用，导致系统完全沦陷 | 立即修复 |
| High | 可导致数据泄露或服务中断 | 24小时内 |
| Moderate | 需特定条件才能利用 | 一周内 |
| Low | 影响有限或利用难度高 | 计划修复 |

### 2. 许可证合规检查

识别所有依赖的许可证类型，检测潜在冲突：

- **宽松许可证**：MIT、Apache-2.0、BSD（可商用）
- **弱 Copyleft**：LGPL、MPL（需动态链接）
- **强 Copyleft**：GPL、AGPL（传染性，需开源）
- **专有/无许可证**：需人工审核

### 3. 过时版本检测

识别可更新的依赖包：

- **Major 版本过时**：可能有破坏性变更
- **Minor/Patch 过时**：通常包含安全修复
- **已弃用包**：建议迁移到替代方案

### 4. 供应链风险评估

- 检测恶意包特征（如 typosquatting）
- 识别维护者变更风险
- 检查包的下载量和维护活跃度

## 支持的生态系统

| 生态系统 | 审计工具 | 自动修复 |
|---------|---------|---------|
| Node.js (npm/yarn/pnpm/bun) | `npm audit` / `yarn audit` | Yes |
| Python (pip) | `pip-audit` / `safety check` | Manual |
| Rust (Cargo) | `cargo audit` | Yes |
| Go | `govulncheck ./...` | Manual |
| PHP (Composer) | `composer audit` | Manual |
| Ruby (Bundler) | `bundle audit` | Manual |
| Swift (CocoaPods) | `pod audit` | Manual |

## 安装与使用

### 安装技能

```bash
# 通过 npx 安装
npx antigravity-awesome-skills

# 或手动安装
mkdir -p .claude/skills/dependency-audit
cp dependency-audit/SKILL.md .claude/skills/dependency-audit/
```

### 基本使用

执行技能后，AI 会自动检测项目类型并运行对应的审计工具：

```
输入：运行依赖审计
→ 检测到 Node.js 项目
→ 运行 npm audit
→ 发现 3 个高危漏洞、5 个中危漏洞
→ 生成修复建议报告
```

### 命令行参数

```bash
# 基本审计
npm audit

# JSON 格式输出（适合 CI/CD）
npm audit --json

# 仅检查生产依赖
npm audit --production

# 设置严重级别阈值
npm audit --audit-level=high

# 自动修复（安全更新）
npm audit fix

# 强制修复（可能包含破坏性变更）
npm audit fix --force
```

## 审计流程

### 标准审计流程

```
1. 项目检测
   ├── 识别包管理器（npm/pip/cargo 等）
   ├── 读取依赖清单文件
   └── 解析依赖树

2. 漏洞扫描
   ├── 连接漏洞数据库（GitHub Advisory、OSV 等）
   ├── 匹配已知 CVE
   └── 计算严重程度

3. 结果分析
   ├── 分类漏洞严重程度
   ├── 识别传递依赖路径
   └── 评估实际影响范围

4. 修复建议
   ├── 提供安全版本号
   ├── 建议替代包
   └── 生成修复优先级列表

5. 报告输出
   ├── 控制台摘要
   ├── JSON 详细报告
   └── 可选 HTML 报告
```

### Python 项目审计

```bash
# 安装 pip-audit
pip install pip-audit

# 扫描当前环境
pip-audit

# 扫描 requirements 文件
pip-audit -r requirements.txt

# JSON 格式输出
pip-audit --format json -o vulnerabilities.json

# 自动修复
pip-audit --fix
```

### Rust 项目审计

```bash
# 安装 cargo-audit
cargo install cargo-audit

# 运行审计
cargo audit

# 自动修复
cargo audit fix
```

### Go 项目审计

```bash
# 安装 govulncheck
go install golang.org/x/vuln/cmd/govulncheck@latest

# 运行审计
govulncheck ./...
```

## 漏洞分类与处理

### 常见漏洞类型

| 漏洞类型 | 说明 | 典型影响 |
|---------|------|---------|
| 原型污染 | JavaScript 对象原型被篡改 | 任意代码执行 |
| ReDoS | 正则表达式拒绝服务 | 服务瘫痪 |
| SSRF | 服务端请求伪造 | 内网渗透 |
| 路径遍历 | 任意文件读写 | 数据泄露 |
| 命令注入 | 执行任意系统命令 | 系统沦陷 |

### 漏洞处理策略

**1. 直接升级**
```bash
# 升级到安全版本
npm update vulnerable-package
# 或指定版本
npm install vulnerable-package@4.17.21
```

**2. 使用替代包**
```bash
# 移除有漏洞的包
npm uninstall vulnerable-package
# 安装替代方案
npm install alternative-package
```

**3. 使用 overrides/resolutions**
```json
// package.json
{
  "overrides": {
    "vulnerable-package": "4.17.21"
  }
}
```

**4. 临时缓解（不推荐）**
```javascript
// 在代码中添加防护逻辑
if (userInput && typeof userInput === 'object') {
  Object.freeze(userInput); // 防止原型污染
}
```

### 处理无法修复的漏洞

当漏洞无可用修复时：

1. **评估实际风险**：漏洞是否在代码路径中被使用？
2. **添加例外说明**：记录接受风险的原因
3. **设置监控**：关注后续安全公告
4. **隔离依赖**：考虑使用 `npm shrinkwrap` 锁定版本

## 许可证合规

### 许可证检查工具

```bash
# 安装 license-checker
npm install -g license-checker

# 生成许可证报告
license-checker --json > licenses.json

# 仅检查生产依赖
license-checker --production

# 排除特定许可证
license-checker --exclude 'MIT,Apache-2.0'
```

### 许可证兼容性矩阵

| 你的许可证 | 可使用的依赖许可证 |
|-----------|------------------|
| MIT | MIT, Apache-2.0, BSD, ISC |
| Apache-2.0 | MIT, Apache-2.0, BSD |
| GPL-3.0 | MIT, Apache-2.0, BSD, LGPL, GPL |
| 专有软件 | MIT, Apache-2.0, BSD（需法律审核） |

### 企业合规要求

```bash
# 生成 SBOM（软件物料清单）
npx @cyclonedx/cdxgen -o sbom.json

# SPDX 格式
npx @cyclonedx/cdxgen -o sbom.spdx
```

## 实际示例

### 示例 1：Node.js 项目审计

```bash
$ npm audit

# npm audit report
lodash  <=4.17.20
Severity: high
Prototype Pollution in lodash - https://github.com/advisories/GHSA-...
fix available via `npm audit fix`
node_modules/lodash

axios  <1.6.0
Severity: high
Axios SSRF Vulnerability - https://github.com/advisories/GHSA-...
fix available via `npm audit fix`
node_modules/axios

3 high severity vulnerabilities
```

**修复操作：**
```bash
$ npm audit fix

added 2 packages, removed 1 package, changed 3 packages
3 vulnerabilities fixed
```

### 示例 2：Python 项目审计

```bash
$ pip-audit -r requirements.txt

Name        Version    ID          Description
requests    2.28.0     PYSEC-2023  Requests vulnerability...
django      4.1.0      CVE-2023    Django SQL injection...

Found 2 vulnerabilities
```

### 示例 3：过滤高危漏洞

```bash
# 仅显示高危和严重漏洞
npm audit | grep -E "(High|Critical)" -B3 -A10

# 或使用 awk
npm audit --color=always | awk -v RS= -v ORS="\n\n" '/\nSeverity:[^\n]+(high|critical)/'
```

## CI/CD 集成

### GitHub Actions 配置

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    # 每天午夜运行
    - cron: '0 0 * * *'

jobs:
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --audit-level=high
        continue-on-error: true

      - name: Run Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  python-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install pip-audit
          pip install -r requirements.txt

      - name: Run pip-audit
        run: pip-audit --strict
```

### GitLab CI 配置

```yaml
# .gitlab-ci.yml
dependency_scanning:
  stage: test
  image: node:20
  script:
    - npm ci
    - npm audit --audit-level=moderate --json > audit-report.json
  artifacts:
    reports:
      dependency_scanning: audit-report.json
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

### pre-commit Hook

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: npm-audit
        name: npm audit
        entry: npm audit --audit-level=high
        language: system
        pass_filenames: false
        stages: [commit]
```

## 最佳实践

### 1. 定期审计

- **每日**：CI/CD 自动扫描
- **每周**：人工审查新漏洞报告
- **每月**：全面依赖健康检查
- **每季度**：许可证合规审计

### 2. 依赖管理策略

```bash
# 使用精确版本号（避免 ^ 或 ~）
"dependencies": {
  "express": "4.18.2"  # 精确版本
}

# 定期更新依赖
npm outdated
npm update

# 使用 Dependabot 或 Renovate 自动化更新
```

### 3. 安全配置

```json
// package.json
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix",
    "audit:report": "npm audit --json | npx npm-audit-html"
  }
}
```

### 4. 漏洞响应流程

```
发现漏洞
    ↓
评估严重程度
    ↓
┌─────────────────────────────────────┐
│ Critical/High → 立即修复（24h内）    │
│ Moderate      → 计划修复（1周内）    │
│ Low           → 下个版本迭代         │
└─────────────────────────────────────┘
    ↓
验证修复效果
    ↓
更新文档记录
```

### 5. 依赖选择原则

- 优先选择维护活跃的包
- 检查下载量和社区活跃度
- 审查安全历史记录
- 避免过大的依赖树

## 常见问题

### Q1: npm audit 显示漏洞但无法修复？

**原因**：可能是传递依赖冲突或包已弃用。

**解决方案**：
```bash
# 查看完整依赖路径
npm ls vulnerable-package

# 使用 overrides 强制版本
npm pkg set overrides.vulnerable-package=4.17.21

# 或使用 resolutions（yarn）
```

### Q2: 如何处理开发依赖的漏洞？

开发依赖通常不会部署到生产环境，但仍需评估：

```bash
# 仅检查生产依赖
npm audit --production

# 开发依赖漏洞可降低优先级
# 但需注意 CI/CD 环境风险
```

### Q3: 审计报告太长如何筛选？

```bash
# 按严重程度筛选
npm audit --audit-level=high

# JSON 格式便于处理
npm audit --json | jq '.vulnerabilities | to_entries | .[] | select(.value.severity == "high")'

# 生成 HTML 报告
npm audit --json | npx npm-audit-html -o report.html
```

### Q4: 如何处理误报？

```bash
# 创建 .npmrc 忽略特定漏洞
# （不推荐，仅用于已评估风险的情况）

# 或使用 npm audit --omit=dev 排除开发依赖
```

### Q5: 私有仓库如何审计？

```bash
# 指定私有仓库地址
npm audit --registry=https://your-private-registry.com

# 确保认证配置正确
npm config set //your-private-registry.com/:_authToken ${TOKEN}
```

## 参考资源

- [npm audit 官方文档](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities)
- [pip-audit GitHub](https://github.com/pypa/pip-audit)
- [cargo-audit 文档](https://docs.rs/cargo-audit)
- [GitHub Advisory Database](https://github.com/advisories)
- [OSV 漏洞数据库](https://osv.dev)
- [SPDX 许可证列表](https://spdx.org/licenses/)
