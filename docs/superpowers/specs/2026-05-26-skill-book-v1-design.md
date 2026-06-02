# Skill Book V1 MVP Design Spec

## Overview

Skill Book is a Vue3 SPA for browsing and searching skill knowledge articles. Markdown files in `/public/skills/` serve as the data source, parsed at build time into a lightweight index for fast search and filtering, with full content loaded on demand for detail views. The UI follows the Apple design language defined in `docs/DESIGN.md`.

## Architecture

```
Vite (dev/build)
  → Build script scans /public/skills/*.md → parses frontmatter → generates /public/skills/index.json
  → Vue3 SPA
    → Vue Router: / (Home) + /skill/:slug (Detail)
    → Composables: useSkills(), useSearch(), useFilters()
    → Views: HomeView, SkillDetailView
    → Components: SearchBar, CategorySidebar, TagCloud, SkillCard, MarkdownRenderer
```

### Data Flow

1. App mounts → `useSkills()` fetches `/skills/index.json` (lightweight: name, slug, category, tags, description)
2. `useSearch()` builds a fuse.js search index from the loaded data
3. `useFilters()` filters results by selected category (single-select) and tags (multi-select)
4. SkillDetailView fetches the full `.md` file → `markdown-it` renders it
5. Standalone Node script (`scripts/build-skills.js`) generates index.json — run as `npm run build:skills` or via Vite's `build.start` hook

### Why Build-Time Index

- First page only needs lightweight metadata — no need to load full Markdown content
- Search index is fast on small JSON payload
- Detail pages load full .md on demand

## Tech Stack

- Vue 3.5+ (Composition API + `<script setup>`)
- Vite 6.x
- Vue Router 4 (hash mode for static deployment)
- TailwindCSS 4 (Apple design tokens as CSS custom properties)
- gray-matter (frontmatter parsing at build time)
- markdown-it (runtime Markdown rendering)
- fuse.js (fuzzy search)
- Inter font (Google Fonts, open-source SF Pro alternative)

## Directory Structure

```
skill-book/
├── public/
│   └── skills/              # Markdown source files
│       ├── index.json        # Build-time generated index
│       ├── vue-skill.md
│       └── python-skill.md
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── tokens.css    # Apple design tokens → CSS custom properties
│   ├── components/
│   │   ├── GlobalNav.vue
│   │   ├── SubNav.vue
│   │   ├── SearchBar.vue
│   │   ├── CategorySidebar.vue
│   │   ├── TagCloud.vue
│   │   ├── SkillCard.vue
│   │   └── MarkdownRenderer.vue
│   ├── composables/
│   │   ├── useSkills.js
│   │   ├── useSearch.js
│   │   └── useFilters.js
│   ├── router/
│   │   └── index.js
│   ├── views/
│   │   ├── HomeView.vue
│   │   └── SkillDetailView.vue
│   ├── App.vue
│   └── main.js
├── scripts/
│   └── build-skills.js       # Standalone Node script, runs via `npm run build:skills` or as prebuild hook
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## UI Layout

### Home Page

```
┌─────────────────────────────────────────────────┐
│ Global Nav (black 44px)                          │
├─────────────────────────────────────────────────┤
│ Sub Nav (frosted glass, "Skill Book" + search)   │
├──────────┬──────────────────────────────────────┤
│ Sidebar   │ Main Content                         │
│ 240px     │                                      │
│           │ ┌──────────┐ ┌──────────┐ ┌────────┐│
│ Categories│ │ SkillCard│ │ SkillCard│ │SkillCrd││
│  · All    │ │ 18px r   │ │ 18px r   │ │18px r  ││
│  · Code   │ │ 1px bdr  │ │ 1px bdr  │ │1px bdr ││
│  · Debug  │ └──────────┘ └──────────┘ └────────┘│
│  · Design │ ┌──────────┐ ┌──────────┐ ┌────────┐│
│           │ │ SkillCard│ │ SkillCard│ │SkillCrd││
│ Tag Cloud │ └──────────┘ └──────────┘ └────────┘│
│  #vue     │                                      │
│  #python  │                                      │
│  #agent   │                                      │
├──────────┴──────────────────────────────────────┤
│ Footer (parchment bg)                            │
└─────────────────────────────────────────────────┘
```

### Skill Detail Page

- Hero section: Dark tile background, skill name (display-lg 40px/600), description
- Content area: White/parchment alternating tiles, Markdown rendered
- Use cases, examples displayed as separate tiles

### SkillCard Component (store-utility-card pattern)

- White background, 18px border-radius, 1px hairline border
- Top: icon/thumbnail area (centered)
- Middle: skill name (17px/600), short description (17px/400)
- Bottom: tag pills (pill border-radius), category text
- No shadow (Apple principle: shadows only for product imagery)

## Design Tokens

From DESIGN.md, implemented as CSS custom properties in `tokens.css`:

| Token | Value |
|-------|-------|
| Primary color | `#0066cc` (Action Blue) |
| Background white | `#fff` |
| Background parchment | `#f5f5f7` |
| Text primary | `#1d1d1f` |
| Text secondary | `#6e6e73` |
| Border hairline | `rgba(0,0,0,0.08)` |
| Radius card | `18px` |
| Radius pill | `9999px` |
| Font body | Inter, 17px/400 |
| Font display | Inter, 600 weight, negative letter-spacing |
| Nav height | 44px (global), 52px (sub) |

## Search & Filtering

### Search (fuse.js)

- Search fields: `name` (weight 2), `description` (weight 1.5), `tags` (weight 1), `category` (weight 0.5)
- Threshold: 0.3 (lenient, supports fuzzy matching)
- Input debounce: 300ms
- Search results highlight matched text

### Filter Pipeline

```
Raw list → category filter (single-select) → tag filter (multi-select, intersection) → search filter → sort by name
```

### Interaction Details

- Search bar in SubNav, globally visible
- Category sidebar: click to select, highlight current
- Tag cloud: click to toggle, selected tags highlighted
- Clear all filters action available
- URL does not reflect filter state (V1 simplification)

## Skill Markdown Format

Files in `/public/skills/` follow this structure:

```markdown
---
name: vue-skill
slug: vue-skill
category: 编码
tags: [vue, frontend, component]
description: Vue3 组件开发技能指南
---

# Vue Skill

## 描述
...

## 用法
...

## 使用场景
...

## 示例
...

## 安装
...
```

Frontmatter fields: `name`, `slug`, `category`, `tags` (array), `description`. Body is standard Markdown rendered by markdown-it.

## V1 MVP Scope

### In Scope

- Skill list browsing with card grid layout
- Fuzzy search (fuse.js)
- Category filtering (single-select)
- Tag filtering (multi-select)
- Skill detail page with Markdown rendering
- Apple design language (colors, typography, components, animations)
- Responsive layout (desktop primary, basic mobile)
- Build-time index generation

### Out of Scope (Future)

- Favorites/bookmarks
- Learning progress tracking
- Dark mode
- Skill ratings
- URL-based filter state
- PWA/offline support
- User authentication
- Backend API
