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

1. **Build time**: `scripts/build-skills.js` scans `public/skills/*.md`, extracts frontmatter, writes `public/skills/index.json` (array of `{name, slug, category, tags, description, scenarios, commands}`).
2. **Runtime load**: `useSkills` composable fetches `/skills/index.json`, then merges user skills from `localStorage`.
3. **Detail view**: `SkillDetailView` fetches `/skills/{slug}.md` as raw text, parses frontmatter with the browser-side parser in `src/utils/frontmatter.js`, and renders the body via `markdown-it`.
4. **Filter pipeline**: `skills → useSearch → useFilters → useScenarios → displayedSkills`

### Routing

Hash-based routing (`createWebHashHistory`) — required for static file hosting. Two routes:

| Path | View | Purpose |
|---|---|---|
| `/` | `HomeView` | Browse, search, filter, create skills |
| `/skill/:slug` | `SkillDetailView` | Read skill detail + markdown content |

### Composables (state management)

All composables use **singleton module-level state** — the `ref`s are declared outside the function, so all components share the same instance.

- **`useSkills.js`** — Holds `skills` ref (single source of truth). Exposes `addSkill`/`updateSkill`/`updateSkillContent`/`updateSkillFromMd`/`deleteSkill`/`getSkillBySlug`, which write through to both `localStorage` and the dev API. Derives `categories` and `allTags` computeds. Tracks user-owned slugs via `userSlugs` Set.
- **`useSearch.js`** — Wraps `fuse.js` with 300ms debounced search. **Must be initialized** by calling `setSearchSkills(skillsRef)` once (done in `HomeView`), which injects the skills ref into the module-level `_skills` variable. Search weights: name (2), description (1.5), tags (1), category (0.5).
- **`useFilters.js`** — Category selection (single) + tag selection (multi, AND logic). Operates on already-searched results.
- **`useBookmarks.js`** — Single favorites list. `bookmarks` ref (slug array), `isBookmarked(slug)`, `toggleBookmark(slug)`. localStorage key: `skill-book-bookmarks`.
- **`useSkillStatus.js`** — Per-skill status marking: `todo` / `learning` / `mastered`. `statuses` ref, `getStatus`, `setStatus` (pass `null` to clear), `statusStats` computed. localStorage key: `skill-book-skill-status`.
- **`useUsageTracker.js`** — View counting and recency tracking. `trackView(slug)`, `getViewCount`, `getLastViewed`, `recentlyViewed` (top 5), `getStaleLearning(statuses)` (learning + 7+ days without view). localStorage key: `skill-book-usage-stats`.
- **`useScenarios.js`** — Scenario filtering. `allScenarios(skills)` extracts unique scenarios, `selectedScenario` ref, `filterByScenario(skills)` returns filtered computed, `toggleScenario`/`clearScenario`. Pipeline position: after useFilters, before displayedSkills.
- **`useGithubImport.js`** — Imports skills from GitHub repos. Calls Tavily API to extract repo content, then DeepSeek API to generate frontmatter. API keys stored in `localStorage` (`skill-book-deepseek-api-key`, `skill-book-tavily-api-key`).
- **`useSkillNotes.js`** — Per-skill personal notes (markdown). `getNote`, `saveNote`, `hasNote`. localStorage key: `skill-book-skill-notes`. Empty notes are auto-removed.

### Browser-side Frontmatter Parser

`src/utils/frontmatter.js` is a lightweight parser (no YAML library dependency). It handles `---` delimiters, string values with quote stripping, inline arrays `[a, b, c]`, multi-line values (`|` syntax), and object arrays (`- name: x\n  cmd: y` format). It does **not** support nested objects deeper than one level, YAML anchors, or flow-style mappings. This is intentional — skill frontmatter is flat and simple.

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
scenarios: [debugging, code-review, deployment]
commands:
  - name: "安装"
    cmd: "npx skills add my-skill"
  - name: "使用"
    cmd: "/my-skill"
install: "npx skills add ..."
source: "https://..."
---
```

Then run `npm run build:skills` to regenerate the index. The category will automatically appear in the sidebar filter.

## Testing

Tests use Vitest with `vi.fn()` mocks for `localStorage` and `fetch`. Composables with module-level state require careful `beforeEach` resets. Import composables **after** `vi.stubGlobal` calls so mocks are in place.
