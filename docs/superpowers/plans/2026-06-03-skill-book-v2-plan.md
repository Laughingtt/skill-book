# Skill Book V2 Implementation Plan

> Based on: docs/superpowers/specs/2026-06-03-skill-book-v2-design.md

## Phase 1 — "我的Skill库"基础

### Task 1: useBookmarks composable
- Create `src/composables/useBookmarks.js`
- Singleton pattern (module-level ref), localStorage key `skill-book-bookmarks`
- Exports: `bookmarks`, `isBookmarked(slug)`, `toggleBookmark(slug)`
- Read from localStorage on init, write on every change

### Task 2: useSkillStatus composable
- Create `src/composables/useSkillStatus.js`
- Singleton pattern, localStorage key `skill-book-skill-status`
- Exports: `statuses`, `getStatus(slug)`, `setStatus(slug, status)`, `statusStats`
- `statusStats` returns `{ todo: N, learning: N, mastered: N, total: N }`

### Task 3: useUsageTracker composable
- Create `src/composables/useUsageTracker.js`
- Singleton pattern, localStorage key `skill-book-usage-stats`
- Exports: `trackView(slug)`, `getViewCount(slug)`, `getLastViewed(slug)`, `recentlyViewed`, `staleLearning`
- `recentlyViewed`: top 5 by lastViewedAt (returns slug+stats objects)
- `staleLearning`: learning status + lastViewedAt > 7 days ago (cross-references useSkillStatus)

### Task 4: Bookmark button on SkillCard
- Modify `src/components/SkillCard.vue`
- Add heart icon top-right corner, toggle interaction
- Uses `useBookmarks.isBookmarked` and `toggleBookmark`
- Prevent click propagation (bookmark toggle vs card navigation)

### Task 5: Status selector on SkillDetailView
- Modify `src/views/SkillDetailView.vue`
- Three status badges below title: 待尝试 / 学习中 / 已掌握
- Uses `useSkillStatus.getStatus` and `setStatus`
- Active badge highlighted with accent color

### Task 6: Home page — "我的收藏" section
- Modify `src/views/HomeView.vue`
- Horizontal scrollable card strip below hero
- Shows bookmarked skills, uses `useBookmarks.bookmarks` + `useSkills.getSkillBySlug`
- Empty state: "收藏常用skill，快速访问"

### Task 7: Home page — Progress stats + Recently viewed + Review reminders
- Modify `src/views/HomeView.vue`
- Progress stats card: "已掌握 X / 学习中 Y / 待尝试 Z / 总计 N" with progress bar
- "最近查看" section: top 5 recently viewed skills
- "该复习了" section: stale learning skills (hidden when empty)

### Task 8: Code block copy button in MarkdownRenderer
- Modify `src/components/MarkdownRenderer.vue`
- Add copy button to all `<pre>` blocks via post-render DOM manipulation
- Use Clipboard API, show ✓ feedback for 2s

### Task 9: Install command copy button on SkillDetailView
- Modify `src/views/SkillDetailView.vue`
- Copy button next to install field display
- Same Clipboard API pattern as code block copy

### Task 10: Tests for new composables
- Create `src/__tests__/bookmarks-status-tracker.test.js`
- Test useBookmarks: toggle, isBookmarked, localStorage persistence
- Test useSkillStatus: setStatus, getStatus, statusStats
- Test useUsageTracker: trackView, recentlyViewed, staleLearning
- Mock localStorage and Date.now()

---

## Phase 2 — 场景化发现

### Task 11: Extend build-skills.js for scenarios
- Modify `scripts/build-skills.js`
- Add `scenarios` to index.json output: `scenarios: data.scenarios || []`

### Task 12: Extend frontmatter.js for new fields
- Modify `src/utils/frontmatter.js`
- Add multi-line value parsing (`|` syntax)
- Add object array parsing (`- name: x\n  cmd: y`)
- Keep backward compatibility with existing simple parsing

### Task 13: useScenarios composable
- Create `src/composables/useScenarios.js`
- Exports: `allScenarios`, `selectedScenario`, `filterByScenario(skills)`
- `allScenarios`: computed from skills data
- Integration point: HomeView calls filterByScenario after useFilters

### Task 14: Scenario filter in sidebar
- Modify `src/components/CategorySidebar.vue` (or add ScenarioFilter component)
- New "使用场景" section below categories
- Tags listed, click to filter, AND logic with existing filters

### Task 15: "何时使用" section on SkillDetailView
- Modify `src/views/SkillDetailView.vue`
- Show scenario tags if skill has `scenarios` field
- Tags clickable → navigate to home with scenario filter active

### Task 16: Related skills on SkillDetailView
- Modify `src/views/SkillDetailView.vue`
- Bottom section: 3-5 skills with same category + overlapping tags
- Exclude current skill, sort by tag overlap count

### Task 17: Command cards on SkillDetailView
- Modify `src/views/SkillDetailView.vue`
- If skill has `commands` field, render as styled command cards
- Each card: name label + command text + copy button
- Accent left border, visually distinct from code blocks

### Task 18: Quick Start section on SkillDetailView
- Modify `src/views/SkillDetailView.vue`
- Collapsible section below hero
- Content from `quickstart` frontmatter field, or auto-generated from `install`
- Default collapsed, click to expand

### Task 19: Update sample skills with new frontmatter fields
- Add `scenarios`, `commands`, `quickstart` to 3-5 existing skill .md files
- Run `npm run build:skills` to verify

---

## Phase 3 — 学习闭环

### Task 20: useSkillNotes composable
- Create `src/composables/useSkillNotes.js`
- Singleton pattern, localStorage key `skill-book-skill-notes`
- Exports: `getNote(slug)`, `saveNote(slug, content)`, `hasNote(slug)`

### Task 21: "我的笔记" editor on SkillDetailView
- Modify `src/views/SkillDetailView.vue`
- Collapsible section below content, textarea + markdown preview
- Auto-save on blur (debounced 500ms)

### Task 22: Data export/import
- Add export/import buttons to settings or footer area
- Export: bundle all localStorage data into a single JSON file download
- Import: file input, merge with existing data (non-destructive)
- Keys to export: bookmarks, skill-status, skill-notes, usage-stats, skills (user-created)

### Task 23: Final testing and polish
- Full integration test of all features
- Verify localStorage data integrity
- Test empty states, edge cases
- Verify mobile responsiveness of new sections
- Production build verification
