# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Skill Book is a static Vue 3 SPA for browsing, searching, and managing a catalog of AI/CLI skills. Skills are stored as Markdown files with YAML frontmatter in `public/skills/`. There is no backend — all data lives in those `.md` files plus user-created skills persisted to `localStorage`.

## Commands

```bash
npm run dev            # Start Vite dev server
npm run build:skills   # Rebuild public/skills/index.json from .md frontmatter
npm run build          # Full production build (runs build:skills as prebuild hook)
npm run preview        # Preview production build locally
```

## Architecture

### Data Pipeline

1. **Build time**: `scripts/build-skills.js` scans `public/skills/*.md`, extracts frontmatter via `gray-matter`, and writes `public/skills/index.json` (an array of `{name, slug, category, tags, description}`).
2. **Runtime load**: `useSkills` composable fetches `/skills/index.json` to populate the skill list. User-created skills are merged from `localStorage` key `skill-book-skills`.
3. **Detail view**: `SkillDetailView` fetches `/skills/{slug}.md` as raw text, parses frontmatter with the browser-side parser in `src/utils/frontmatter.js`, and renders the body via `markdown-it`.

### Routing

Hash-based routing (`createWebHashHistory`) — required for static file hosting. Three routes:

| Path | View | Purpose |
|---|---|---|
| `/` | `HomeView` | Browse, search, filter, create skills |
| `/skill/:slug` | `SkillDetailView` | Read skill detail + markdown content |
| `/skill/:slug/edit` | `SkillEditView` | Edit skill metadata (lazy-loaded) |

### Composables (state management)

- **`useSkills.js`** — Singleton pattern. Fetches `index.json` once, holds the `skills` ref array (the single source of truth), exposes `addSkill`/`updateSkill`/`deleteSkill` which write through to `localStorage`. Also derives `categories` and `allTags`. User edits merge on top of static data on load.
- **`useSearch.js`** — Wraps `fuse.js` with 300ms debounced search across name (weight 2), description (1.5), tags (1), category (0.5).
- **`useFilters.js`** — Category selection (single) + tag selection (multi, AND logic). Operates on already-searched results.

### Key Components

- `GlobalNav` / `SubNav` — Persistent top navigation bars
- `CategorySidebar` + `TagCloud` — Left sidebar filters on HomeView
- `SkillCard` — Card in the home grid, links to detail view
- `SkillFormModal` — Shared modal form used for both create (HomeView) and edit (SkillDetailView/SkillEditView). Emits `save` with form data; parent handles the CRUD call.
- `MarkdownRenderer` — Renders markdown with editorial styling (Crimson Pro headings, DM Sans body, burnt terracotta accent)
- `SearchBar` — Search input used in SubNav

### Design Tokens

All tokens in `src/assets/styles/tokens.css` via CSS custom properties on `:root`. Dark mode via `prefers-color-scheme: dark` media query. Typography: Crimson Pro (display) + DM Sans (body). Accent: burnt terracotta (`#c4553a`). Includes full spacing, shadow, radius, transition, and z-index scales.

## Adding a New Skill

Create a `.md` file in `public/skills/` with YAML frontmatter:

```yaml
---
slug: my-skill
name: My Skill
category: Category Name
tags: [tag1, tag2]
description: Short description
install: "npx skills add ..."
source: "https://..."
---
```

Then run `npm run build:skills` to regenerate the index. The category will automatically appear in the sidebar filter.
