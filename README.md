# Skill Book

AI 技能知识库浏览器 — 探索、搜索和管理你的技能目录。

## 快速开始

```bash
npm install
npm run dev        # 启动开发服务器
npm run build      # 生产构建
```

## 项目结构

```
public/skills/       # 技能 Markdown 文件（含 YAML frontmatter）
scripts/             # 构建脚本（生成 index.json）
src/
  assets/styles/     # 设计 Token（CSS 变量 + Tailwind）
  components/        # Vue 组件
  composables/       # useSkills / useSearch / useFilters
  router/            # Vue Router 配置
  utils/             # 浏览器端 frontmatter 解析器
  views/             # 页面视图
```

## 添加技能

在 `public/skills/` 下创建 `.md` 文件，格式如下：

```yaml
---
slug: my-skill
name: 技能名称
category: 分类
tags: [标签1, 标签2]
description: 简短描述
install: "npx skills add ..."
source: "https://..."
---
```

运行 `npm run build:skills` 重新生成索引。

## 技术栈

Vue 3 · Vue Router · Vite · Tailwind CSS 4 · markdown-it · fuse.js
