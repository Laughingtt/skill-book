---
slug: deploy-to-vercel
name: Deploy to Vercel
category: 云服务与基础设施
tags: [deploy, vercel, hosting, ci, production, cloud]
description: Vercel官方部署技能，一键将应用部署到Vercel平台的自动化部署流程
scenarios: [deployment, ci-cd, production-release]
commands:
  - name: "部署到Vercel"
    cmd: "vercel --prod"
install: "npx skills add https://github.com/vercel-labs/agent-skills --skill deploy-to-vercel"
source: "https://www.skills.sh/vercel-labs/agent-skills/deploy-to-vercel"
---

# Deploy to Vercel

Vercel官方部署技能，通过AI Agent自动化完成Vercel平台部署流程，支持CI/CD集成、环境变量管理、域名配置等完整的生产环境部署能力。

## 简介

Deploy to Vercel技能让AI Agent能够自动化执行Vercel平台的完整部署流程。该技能由Vercel Labs官方维护，与平台最新功能保持同步，支持：

- **命令行部署**：通过Vercel CLI执行完整的部署生命周期
- **项目链接与管理**：自动处理项目与Vercel账户的关联
- **环境变量配置**：跨环境（开发/预览/生产）的变量管理
- **域名与SSL**：自定义域名绑定与自动SSL证书配置
- **CI/CD集成**：与GitHub Actions、GitLab CI等流水线无缝集成

## 前置条件

### 1. 安装Vercel CLI

```bash
# 使用npm安装
npm install -g vercel

# 使用pnpm安装（推荐）
pnpm i -g vercel

# 使用yarn安装
yarn global add vercel

# 验证安装
vercel --version
```

### 2. 账户认证

```bash
# 登录Vercel账户
vercel login

# 查看当前登录状态
vercel whoami
```

支持多种登录方式：GitHub、GitLab、Bitbucket、Email或SSO。

### 3. 项目链接

```bash
# 单项目链接
vercel link

# Monorepo仓库链接
vercel link --repo
```

链接后会在项目根目录创建`.vercel/`文件夹，包含`project.json`（单项目）或`repo.json`（monorepo）。

### 4. 获取部署凭证（CI/CD必需）

```bash
# 创建部署令牌
# 访问 https://vercel.com/account/tokens 创建

# 获取项目ID和组织ID
cat .vercel/project.json
```

CI/CD环境需要三个关键凭证：
- `VERCEL_TOKEN`：部署令牌
- `VERCEL_ORG_ID`：组织ID
- `VERCEL_PROJECT_ID`：项目ID

## 部署流程

### 标准部署流程

```
初始化 → 配置 → 构建 → 部署 → 验证
```

### 1. 初始化项目

```bash
# 拉取项目环境信息
vercel pull

# 拉取特定环境
vercel pull --environment=production
vercel pull --environment=preview
```

### 2. 本地开发与测试

```bash
# 启动本地开发服务器（模拟Vercel环境）
vercel dev

# 指定端口
vercel dev --port 3000

# 使用环境变量运行
vercel env run -- npm run dev
```

### 3. 预览部署

```bash
# 部署到预览环境
vercel deploy

# 查看构建日志
vercel deploy --logs

# 部署并输出URL到文件
vercel > deployment-url.txt
```

预览部署会生成唯一URL，如`my-app-abc123.vercel.app`，适合测试和PR预览。

### 4. 生产部署

```bash
# 部署到生产环境
vercel deploy --prod

# 跳过域名自动分配（先部署后手动提升）
vercel --prod --skip-domain

# 手动提升到生产
vercel promote [deployment-id]
```

### 5. 验证部署

```bash
# 测试部署端点
vercel curl / --deployment <deployment-url>

# 查看部署日志
vercel logs --deployment <deployment-id>

# 查看生产环境错误日志
vercel logs --environment production --level error --since 5m
```

## 常用命令与示例

### 部署命令

```bash
# 基础部署
vercel                          # 预览部署
vercel deploy                   # 同上（显式）
vercel --prod                   # 生产部署

# 指定路径
vercel [path-to-project]        # 部署指定目录
vercel --cwd ./apps/web         # 切换工作目录

# 预构建部署（本地构建后上传）
vercel build                    # 本地构建
vercel deploy --prebuilt        # 部署构建产物

# 带元数据部署
vercel deploy --meta KEY=value  # 添加部署元数据
vercel deploy --target=staging  # 部署到自定义环境
```

### 项目管理

```bash
# 列出所有部署
vercel list

# 按元数据筛选
vercel list --meta KEY=value

# 查看项目信息
vercel project ls
vercel inspect [deployment-url]
```

### 环境管理

```bash
# 列出环境变量
vercel env ls

# 添加环境变量
vercel env add DATABASE_URL production
vercel env add API_KEY preview

# 删除环境变量
vercel env rm DATABASE_URL production

# 拉取环境变量到本地
vercel env pull .env.local
```

### 域名管理

```bash
# 添加域名
vercel domains add example.com

# 列出域名
vercel domains ls

# 查看域名详情
vercel domains inspect example.com

# DNS记录管理
vercel dns ls example.com
vercel dns add example.com www CNAME cname.vercel-dns.com
```

## 环境变量管理

### 环境类型

Vercel支持三种环境：

| 环境 | 用途 | 触发条件 |
|------|------|----------|
| Production | 生产环境 | main分支合并/`--prod`部署 |
| Preview | 预览环境 | PR/分支推送 |
| Development | 开发环境 | 本地`vercel dev` |

### 配置方式

**方式一：CLI命令**

```bash
# 添加到生产环境
vercel env add NEXT_PUBLIC_API_URL production
# 输入值: https://api.example.com

# 添加到预览环境
vercel env add DATABASE_URL preview

# 批量添加（管道）
echo -n "my-secret-value" | vercel env add SECRET_KEY production
```

**方式二：vercel.json配置**

```json
{
  "env": {
    "NODE_ENV": "production",
    "API_VERSION": "v2"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "https://api.example.com"
    }
  }
}
```

**方式三：本地.env文件**

```bash
# 拉取远程环境变量到本地
vercel env pull .env.local

# .env.local示例
DATABASE_URL=postgresql://localhost:5432/mydb
API_SECRET_KEY=local-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 系统环境变量

Vercel自动注入以下系统变量：

```bash
VERCEL_ENV              # production | preview | development
VERCEL_URL              # 当前部署URL（如 my-app.vercel.app）
VERCEL_BRANCH_URL       # Git分支URL
VERCEL_PROJECT_ID       # 项目ID
VERCEL_DEPLOYMENT_ID    # 部署ID
VERCEL_REGION           # 运行区域（如 cdg1）
VERCEL_GIT_PROVIDER     # Git提供商（github/gitlab/bitbucket）
VERCEL_GIT_REPO_SLUG    # 仓库名称
VERCEL_GIT_COMMIT_SHA   # 提交SHA
```

### 环境变量最佳实践

```javascript
// 根据环境动态配置
const getApiUrl = () => {
  switch (process.env.VERCEL_ENV) {
    case 'production':
      return 'https://api.example.com';
    case 'preview':
      return 'https://api-staging.example.com';
    default:
      return 'http://localhost:3000/api';
  }
};

// 使用VERCEL_URL构建完整URL
const getSiteUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};
```

## 域名与SSL配置

### 添加自定义域名

**步骤一：添加域名**

```bash
# 在已链接项目中
vercel domains add example.com

# 添加www子域名
vercel domains add www.example.com

# 查看所有域名
vercel domains ls
```

**步骤二：配置DNS**

根据域名类型配置DNS记录：

**Apex域名（如example.com）**

```
类型: A
名称: @
值: 76.76.21.21
```

**子域名（如www.example.com）**

```
类型: CNAME
名称: www
值: cname.vercel-dns.com
```

**查看DNS配置要求**

```bash
vercel domains inspect example.com
```

**步骤三：验证域名**

DNS配置后，Vercel会自动验证并配置SSL证书。验证可能需要几分钟到48小时（取决于DNS传播）。

### SSL证书

Vercel自动为所有域名配置SSL证书：

- **自动配置**：添加域名后自动申请Let's Encrypt证书
- **自动续期**：证书到期前自动续期
- **强制HTTPS**：默认将HTTP重定向到HTTPS

### 域名别名配置

```json
// vercel.json
{
  "alias": ["myapp.com", "www.myapp.com"]
}
```

### 重定向配置

```json
// vercel.json
{
  "redirects": [
    {
      "source": "/blog/:slug",
      "destination": "/posts/:slug",
      "permanent": true
    }
  ]
}
```

## CI/CD集成

### GitHub Actions集成

**预览部署工作流**（非main分支）

```yaml
# .github/workflows/vercel-preview.yml
name: Vercel Preview Deployment

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

on:
  push:
    branches-ignore:
      - main

jobs:
  Deploy-Preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
```

**生产部署工作流**（main分支）

```yaml
# .github/workflows/vercel-production.yml
name: Vercel Production Deployment

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

on:
  push:
    branches:
      - main

jobs:
  Deploy-Production:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**配置GitHub Secrets**

在GitHub仓库Settings → Secrets and variables → Actions中添加：

- `VERCEL_TOKEN`：Vercel部署令牌
- `VERCEL_ORG_ID`：组织ID（从`.vercel/project.json`获取）
- `VERCEL_PROJECT_ID`：项目ID（从`.vercel/project.json`获取）

### GitLab CI集成

```yaml
# .gitlab-ci.yml
stages:
  - deploy

deploy_preview:
  stage: deploy
  except:
    - main
  script:
    - npm install --global vercel
    - vercel pull --yes --environment=preview --token=$VERCEL_TOKEN
    - vercel build --token=$VERCEL_TOKEN
    - vercel deploy --prebuilt --token=$VERCEL_TOKEN

deploy_production:
  stage: deploy
  only:
    - main
  script:
    - npm install --global vercel
    - vercel pull --yes --environment=production --token=$VERCEL_TOKEN
    - vercel build --prod --token=$VERCEL_TOKEN
    - vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN
```

### 高级CI/CD模式

**测试后部署**

```yaml
# 先部署预览环境，运行测试，再部署生产
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test

  deploy-preview:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref != 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Preview
        run: |
          npm i -g vercel
          vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
          vercel build --token=${{ secrets.VERCEL_TOKEN }}
          vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }} > url.txt
      - name: Run E2E tests against preview
        run: npm run test:e2e -- --base-url=$(cat url.txt)

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Production
        run: |
          npm i -g vercel
          vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
          vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
          vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 框架特定配置

### Next.js

Next.js是Vercel的原生框架，零配置即可部署。

```json
// vercel.json（可选）
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next"
}
```

**Next.js特定功能支持**

- 自动识别App Router和Pages Router
- 支持ISR（增量静态再生）
- 支持Edge Runtime
- 自动配置Next.js Image Optimization

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['example.com'],
  },
  // 指定输出模式
  output: 'standalone', // 或 'export' 用于静态导出
};

module.exports = nextConfig;
```

### Nuxt

Nuxt 3项目同样零配置部署。

```json
// vercel.json（可选）
{
  "framework": "nuxtjs"
}
```

**Nuxt配置示例**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 服务端渲染模式
  ssr: true,

  // 路由规则
  routeRules: {
    '/admin/**': { ssr: false },  // 客户端渲染
    '/blog/**': { isr: 3600 },    // ISR每小时重新生成
  },

  // Nitro配置（Vercel适配器）
  nitro: {
    preset: 'vercel-edge',
  },
});
```

### Vue (Vite)

纯Vue项目使用Vite构建。

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

**SPA路由配置**

```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### React (Create React App)

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "create-react-app"
}
```

### 静态站点

```json
// vercel.json
{
  "outputDirectory": "public"
}
```

### Monorepo配置

```json
// 根目录vercel.json
{
  "buildCommand": "cd apps/web && npm run build",
  "outputDirectory": "apps/web/.next"
}
```

或使用Vercel的Turbo模式：

```bash
# 链接monorepo
vercel link --repo
```

## 常见问题与故障排除

### 1. 构建失败：Module Not Found

**原因**：文件系统大小写敏感问题

**解决方案**：

```bash
# 本地检查导入路径大小写
# Vercel使用大小写敏感的文件系统

# 确保导入路径与实际文件名一致
// 错误: import Component from './MyComponent'
// 正确: import Component from './myComponent'（如果文件名是小写）
```

### 2. 环境变量未生效

**检查清单**：

1. 确认变量已添加到正确环境（production/preview/development）
2. 前端变量需要`NEXT_PUBLIC_`前缀（Next.js）
3. 重新部署以应用新变量

```bash
# 检查环境变量
vercel env ls

# 重新拉取
vercel env pull .env.local
```

### 3. Node.js版本不兼容

**解决方案**：

```json
// package.json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

或在项目设置中指定Node.js版本。

### 4. 构建超时

**解决方案**：

1. 优化依赖，减少`node_modules`大小
2. 使用`vercel build --prod`本地测试构建时间
3. 考虑使用预构建模式

```bash
# 本地构建测试
vercel build --prod
```

### 5. 404错误

**原因**：SPA路由未正确配置

**解决方案**：

```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 6. 部署保护问题

**解决方案**：

```bash
# 使用vercel curl绕过部署保护
vercel curl / --deployment <preview-url>
```

### 7. 清除构建缓存

```bash
# 通过CLI
vercel --force

# 或在Vercel Dashboard中点击"Clear Build Cache"
```

### 8. 本地构建成功但Vercel失败

**调试步骤**：

```bash
# 1. 使用vercel build模拟Vercel环境
vercel build

# 2. 检查package.json中的scripts
{
  "scripts": {
    "build": "next build"  // 确保命令正确
  }
}

# 3. 检查依赖是否完整
npm ci  # 使用ci而非install确保一致性
```

### 9. 函数超时

**解决方案**：

```json
// vercel.json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 60  // 最大执行时间（秒）
    }
  }
}
```

### 10. 查看详细错误日志

```bash
# 查看部署日志
vercel logs [deployment-url]

# 查看实时日志
vercel logs [deployment-url] --follow

# 按错误级别筛选
vercel logs --environment production --level error --since 10m
```

## 最佳实践

### 部署策略

1. **预览先行**：所有PR先部署预览环境测试
2. **原子部署**：每次部署生成唯一URL，可快速回滚
3. **环境隔离**：严格区分开发/预览/生产环境变量

### 安全建议

1. **令牌管理**：使用环境变量存储`VERCEL_TOKEN`，不要硬编码
2. **敏感变量**：生产环境变量使用Vercel Dashboard或CLI添加，不要提交到代码库
3. **部署保护**：为预览环境启用密码保护

### 性能优化

1. **边缘函数**：使用Edge Runtime减少延迟
2. **ISR策略**：对动态内容使用增量静态再生
3. **图片优化**：使用Vercel Image Optimization或Next.js Image组件

### 监控与告警

```bash
# 设置部署状态通知
# 在Vercel Dashboard → Settings → Notifications

# 使用repository_dispatch触发后续操作
on:
  repository_dispatch:
    types: [vercel.deployment.success]
```

## 参考资源

- [Vercel CLI官方文档](https://vercel.com/docs/cli)
- [Vercel部署指南](https://vercel.com/docs/deployments/overview)
- [GitHub Actions集成](https://vercel.com/docs/git/vercel-for-github)
- [环境变量文档](https://vercel.com/docs/environment-variables)
- [故障排除指南](https://vercel.com/docs/deployments/troubleshoot-a-build)
