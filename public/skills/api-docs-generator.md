---
slug: api-docs-generator
name: API Docs Generator
category: 代码维护与质量
tags: [api, documentation, openapi, swagger, endpoint, sdk]
description: 自动生成API文档技能，包含OpenAPI/Swagger规范、端点文档、SDK使用示例
install: "复制 SKILL.md 到 .claude/skills/api-documentation-generator/"
source: "https://github.com/luongnv89/claude-howto"
---

# API Docs Generator -- 自动化 API 文档生成技能

## 简介

API Docs Generator 是一款面向开发者的自动化 API 文档生成技能，能够从源代码中提取接口信息，自动生成结构完整、格式规范的 API 文档。无论是 REST API、GraphQL 还是 JavaScript/Python 库，该技能都能根据代码注释和类型定义产出高质量的文档输出，包括 OpenAPI/Swagger 规范、端点详细文档、多语言 SDK 示例、认证指南和错误码参考等。

核心价值：

- **消除文档债务**：不再手动编写和维护 API 文档，代码变更后重新运行即可同步更新
- **多格式输出**：支持 OpenAPI 3.0 规范、JSDoc、Python docstrings、Sphinx/pdoc 等主流格式
- **多语言 SDK 示例**：自动生成 cURL、JavaScript、Python 等语言的调用示例
- **保持一致性**：统一文档结构，避免不同开发者书写风格差异导致的混乱

## 核心功能

### 1. OpenAPI/Swagger 规范生成

从路由文件中提取 JSDoc 注释，自动生成符合 OpenAPI 3.0 规范的 JSON/YAML 文件：

```javascript
/**
 * @swagger
 * /users:
 *   get:
 *     summary: 获取用户列表
 *     tags: [Users]
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: 用户列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/users', getUsers);
```

生成命令：

```bash
npx swagger-jsdoc -d swaggerDef.js routes/*.js -o openapi.json
```

### 2. JSDoc 文档生成（JavaScript 库）

为 JavaScript/TypeScript 库自动生成 HTML 参考文档：

```javascript
/**
 * 将两个数字相加
 * @param {number} a - 第一个数字
 * @param {number} b - 第二个数字
 * @returns {number} 两数之和
 * @example
 * add(2, 3); // 返回 5
 */
function add(a, b) {
  return a + b;
}
```

生成命令：

```bash
npx jsdoc src/ -d docs/ -r
```

### 3. Python 文档生成

从 Python docstrings 生成 HTML 文档：

```python
def add(a: int, b: int) -> int:
    """将两个数字相加。

    Args:
        a: 第一个数字
        b: 第二个数字

    Returns:
        两数之和

    Example:
        >>> add(2, 3)
        5
    """
    return a + b
```

生成命令：

```bash
# 使用 pdoc
pdoc --html --output-dir docs/ mypackage/

# 使用 Sphinx
sphinx-apidoc -o docs/source mypackage/
cd docs && make html
```

### 4. 端点文档生成

为每个 API 端点生成完整的文档结构，包含描述、参数表、响应示例和 SDK 调用示例。

## 安装与使用

### 安装

```bash
mkdir -p .claude/skills/api-documentation-generator
cp SKILL.md .claude/skills/api-documentation-generator/
```

### 基本使用

触发 "Generate docs for my API" 指令，AI 会自动扫描项目中的路由文件并生成文档：

```
输入："Generate docs for my API"
  → AI 扫描 app/api/ 目录
  → 识别路由定义和参数类型
  → 生成 OpenAPI 规范文件
  → 生成端点文档 + SDK 示例
  → 输出 Markdown 文档
```

### 依赖安装

```bash
# Node.js 项目
npm install swagger-jsdoc swagger-ui-express jsdoc

# Python 项目
pip install pdoc sphinx sphinx-rtd-theme
```

## 支持的文档格式

| API 类型 | 推荐工具 | 输出格式 |
|----------|----------|----------|
| REST API | OpenAPI/Swagger | 交互式 API 文档 |
| GraphQL | GraphQL Schema | Schema 文档 |
| JavaScript 库 | JSDoc | HTML 参考文档 |
| TypeScript 项目 | TypeDoc | HTML 参考文档 |
| Python 库 | Sphinx/pdoc | HTML 参考文档 |
| Java 库 | Javadoc | HTML 参考文档 |

## 生成流程与配置

### 文档生成流程

```
1. 识别 API 类型 → 选择合适的文档工具
2. 扫描源代码 → 提取路由、参数、响应定义
3. 解析注释 → 从 JSDoc/docstrings 提取描述信息
4. 生成规范 → 输出 OpenAPI JSON/YAML
5. 生成端点文档 → 参数表、响应示例、错误码
6. 生成 SDK 示例 → cURL、JavaScript、Python
7. 组织输出目录 → 结构化文档目录
```

### 输出目录结构

```
docs/
├── api/
│   ├── openapi.json          # OpenAPI 规范文件
│   ├── index.html            # 交互式 API 文档
│   └── endpoints/            # 端点详细文档
│       ├── users.md
│       ├── orders.md
│       └── auth.md
├── reference/
│   ├── classes/              # 类文档
│   ├── functions/            # 函数文档
│   └── types/                # 类型定义文档
└── guides/
    ├── authentication.md     # 认证指南
    └── examples.md           # 使用示例
```

### OpenAPI 基础配置

```javascript
// swaggerDef.js
module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'API 描述信息',
  },
  servers: [
    { url: 'https://api.example.com', description: '生产环境' },
    { url: 'http://localhost:3000', description: '开发环境' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
```

## 实际示例

### 端点文档示例

以下是一个完整的端点文档生成示例：

```markdown
## GET /api/v1/users/:id

### 描述
根据用户 ID 获取用户详细信息

### 参数

| 参数名 | 位置 | 类型 | 必填 | 描述 |
|--------|------|------|------|------|
| id | path | string | 是 | 用户唯一标识 |
| fields | query | string | 否 | 返回字段过滤 |

### 响应

**200 OK**

```json
{
  "id": "usr_123",
  "name": "张三",
  "email": "zhangsan@example.com",
  "created_at": "2025-01-15T10:30:00Z"
}
```

**404 Not Found**

```json
{
  "error": "USER_NOT_FOUND",
  "message": "用户不存在"
}
```

### SDK 示例

**cURL**

```bash
curl -X GET "https://api.example.com/api/v1/users/usr_123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**JavaScript**

```javascript
const user = await fetch('/api/v1/users/usr_123', {
  headers: { 'Authorization': 'Bearer token' }
}).then(r => r.json());
```

**Python**

```python
import requests

response = requests.get(
    'https://api.example.com/api/v1/users/usr_123',
    headers={'Authorization': 'Bearer token'}
)
user = response.json()
```
```

### OpenAPI 规范示例

```yaml
openapi: 3.0.0
info:
  title: 用户管理 API
  version: 1.0.0
  description: 用户注册、登录、信息管理接口文档
servers:
  - url: https://api.example.com
paths:
  /users:
    get:
      summary: 获取用户列表
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: 用户列表
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
    post:
      summary: 创建用户
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUser'
      responses:
        '201':
          description: 用户创建成功
        '400':
          description: 请求参数错误
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        email:
          type: string
    CreateUser:
      type: object
      required:
        - name
        - email
      properties:
        name:
          type: string
        email:
          type: string
```

## 与框架集成

### Express + swagger-jsdoc

```javascript
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

const specs = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'My API', version: '1.0.0' },
  },
  apis: ['./routes/*.js'],  // 扫描路由文件中的 JSDoc 注释
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(3000);
```

### Fastify + fastify-swagger

```javascript
const fastify = require('fastify')({ logger: true });

fastify.register(require('@fastify/swagger'), {
  openapi: {
    info: { title: 'My API', version: '1.0.0' },
  },
});

fastify.register(require('@fastify/swagger-ui'), {
  routePrefix: '/documentation',
});

fastify.get('/users', {
  schema: {
    description: '获取用户列表',
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    },
  },
}, async (request, reply) => {
  return [{ id: '1', name: '张三' }];
});

fastify.listen({ port: 3000 });
```

### NestJS + @nestjs/swagger

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API 描述信息')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();

// user.controller.ts
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('用户')
@Controller('users')
export class UserController {
  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  @ApiResponse({ status: 200, description: '返回用户列表' })
  findAll() {
    return [];
  }
}
```

## 最佳实践

1. **文档与代码同步**：接口变更后立即重新生成文档，避免文档与实现脱节。可集成到 CI/CD 流水线中自动执行
2. **注释先行**：在编写路由代码时同步添加 JSDoc/docstrings 注释，而非事后补写
3. **完整的错误码文档**：每个端点都应包含所有可能的错误响应，附带错误码和解决方案
4. **提供真实示例**：SDK 示例应使用真实的 URL 和数据结构，避免抽象占位符
5. **版本化文档**：对 API 文档进行版本管理，与代码版本保持对应，方便迁移和回溯
6. **认证文档独立成章**：将认证方式（Bearer Token、API Key、OAuth2 等）单独整理为认证指南
7. **使用 Schema 引用**：在 OpenAPI 规范中通过 `$ref` 引用共享的 Schema 定义，减少重复并保持一致性
8. **交互式文档**：搭配 Swagger UI 或 Redoc 提供在线可测试的交互式文档体验
9. **输入验证文档化**：记录参数的验证规则（必填、格式、范围），帮助调用方正确使用
10. **定期审计**：使用 API 文档审计工具检查文档质量，发现缺失的描述、空响应 Schema 等问题

## 常见问题

**Q: 生成的 OpenAPI 规范验证失败怎么办？**

使用 `swagger-cli validate openapi.json` 检查规范文件的有效性。常见原因包括：缺少必需字段（`info`、`paths`）、Schema 引用路径错误、响应码格式不正确等。

**Q: 如何处理需要认证的端点？**

在 OpenAPI 规范的 `components.securitySchemes` 中定义认证方式，然后在端点级别通过 `security` 字段引用。文档生成时会在每个受保护端点标注认证要求，SDK 示例中也会自动包含认证 Header。

**Q: 支持从现有代码反向生成文档吗？**

支持。对于 Express 项目，`swagger-jsdoc` 可以从路由文件的 JSDoc 注释中提取信息；对于 NestJS，`@nestjs/swagger` 通过装饰器自动生成；Python 项目可通过 `pdoc` 或 `sphinx-apidoc` 从 docstrings 反向生成。

**Q: 文档生成后如何部署？**

静态文档（Markdown/HTML）可直接部署到 GitHub Pages、Vercel 或任意静态托管服务。交互式文档（Swagger UI）需搭配 Node.js 服务运行，或使用 Redoc 的纯静态部署方案。

**Q: 多语言 SDK 示例如何维护？**

推荐使用 OpenAPI Generator 从 OpenAPI 规范自动生成各语言 SDK，而非手动编写示例。命令：`npx @openapitools/openapi-generator-cli generate -i openapi.json -g python -o ./sdk-python`。

**Q: 如何在 CI/CD 中自动化文档生成？**

在构建流水线中添加文档生成步骤，生成后自动发布。例如 GitHub Actions 中：

```yaml
- name: Generate API Docs
  run: npx swagger-jsdoc -d swaggerDef.js routes/*.js -o docs/api/openapi.json
- name: Deploy Docs
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./docs
```
