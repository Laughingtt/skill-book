# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Skill Book is a static Vue 3 SPA for browsing, searching, and managing a catalog of AI/CLI skills. Skills are stored as Markdown files with YAML frontmatter in `public/skills/`. There is no backend — all data lives in those `.md` files plus user-created skills persisted to `localStorage`.

## Commands

```bash
npm run dev            # Start Vite dev server (includes skill-api dev middleware)
npm run build:skills   # Rebuild public/skills/index.json from .md frontmatter
npm run build          # Full production build (runs build:skills as prebuild hook)
npm run preview        # Preview production build locally
npm test               # Run tests once (vitest)
npm run test:watch     # Run tests in watch mode (vitest)
```

Tests live in `src/__tests__/`. Run a single test file with `npx vitest run src/__tests__/filename.test.js`.

## Architecture

### Dual Persistence Model

This is the critical architectural concept: skills persist in two places with different lifecycles.

- **Static (build time)**: `public/skills/*.md` → `npm run build:skills` → `public/skills/index.json`. Read-only in production. The build script (`scripts/build-skills.js`) extracts frontmatter via `gray-matter`.
- **User data (runtime)**: `localStorage` key `skill-book-skills`. User-created/edited skills are stored here and merged on top of static data on load. In dev mode, writes also go to `.md` files via the dev API (below).
- **Dev API (dev server only)**: `scripts/vite-plugin-skill-api.js` is a Vite middleware that provides `GET/POST/DELETE /api/skills` endpoints. `POST` writes/updates a `.md` file and auto-rebuilds `index.json`. `DELETE` removes a `.md` file and rebuilds. This only exists during `npm run dev` — production has no backend; `fetch` calls to `/api/skills` silently fail.

### Data Flow

1. **Build time**: `scripts/build-skills.js` scans `public/skills/*.md`, extracts frontmatter, writes `public/skills/index.json` (array of `{name, slug, category, tags, description}`).
2. **Runtime load**: `useSkills` composable fetches `/skills/index.json`, then merges user skills from `localStorage`.
3. **Detail view**: `SkillDetailView` fetches `/skills/{slug}.md` as raw text, parses frontmatter with the browser-side parser in `src/utils/frontmatter.js`, and renders the body via `markdown-it`.

### Routing

Hash-based routing (`createWebHashHistory`) — required for static file hosting. Two routes:

| Path | View | Purpose |
|---|---|---|
| `/` | `HomeView` | Browse, search, filter, create skills |
| `/skill/:slug` | `SkillDetailView` | Read skill detail + markdown content |

### Composables (state management)

All composables use **singleton module-level state** — the `ref`s are declared outside the function, so all components share the same instance.

- **`useSkills.js`** — Holds `skills` ref (single source of truth). Exposes `addSkill`/`updateSkill`/`updateSkillContent`/`updateSkillFromMd`/`deleteSkill`, which write through to both `localStorage` and the dev API. Derives `categories` and `allTags` computeds. Tracks user-owned slugs via `userSlugs` Set.
- **`useSearch.js`** — Wraps `fuse.js` with 300ms debounced search. **Must be initialized** by calling `setSearchSkills(skillsRef)` once (done in `HomeView`), which injects the skills ref into the module-level `_skills` variable. Search weights: name (2), description (1.5), tags (1), category (0.5).
- **`useFilters.js`** — Category selection (single) + tag selection (multi, AND logic). Operates on already-searched results.
- **`useGithubImport.js`** — Imports skills from GitHub repos. Calls Tavily API to extract repo content, then DeepSeek API to generate frontmatter. API keys stored in `localStorage` (`skill-book-deepseek-api-key`, `skill-book-tavily-api-key`).

### Browser-side Frontmatter Parser

`src/utils/frontmatter.js` is a lightweight parser (no YAML library dependency). It handles `---` delimiters, string values with quote stripping, and inline arrays `[a, b, c]`. It does **not** support nested objects, multiline values, or YAML anchors. This is intentional — skill frontmatter is flat and simple.

### Design System

All tokens in `src/assets/styles/tokens.css` via CSS custom properties on `:root`. Dark mode via `prefers-color-scheme: dark` media query (inverts the entire palette). Typography: Crimson Pro (display/headings) + DM Sans (body). Accent: burnt terracotta (`#c4553a`). The file also defines reusable CSS classes (`.card`, `.btn-*`, `.reveal*`, `.container-editorial`, animation keyframes, stagger delays). Tailwind CSS 4 is loaded via `@tailwindcss/vite` plugin.

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

## Testing

Tests use Vitest with `vi.fn()` mocks for `localStorage` and `fetch`. Composables with module-level state require careful `beforeEach` resets. Import composables **after** `vi.stubGlobal` calls so mocks are in place.
