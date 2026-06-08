// scripts/sync-upstream.js
// 检查上游仓库更新 + 拉取有效 Skill 文件（带 frontmatter 验证）
// Usage:
//   node scripts/sync-upstream.js              → check SHAs only
//   node scripts/sync-upstream.js --fetch       → fetch valid skills (safe, skips unchanged)
//   node scripts/sync-upstream.js --fetch --force → force re-download all
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const configPath = path.join(__dirname, '..', 'upstream-repos.json')
const skillsDir = path.join(__dirname, '..', 'public', 'skills')
const statePath = path.join(__dirname, '..', '.sync-state.json')

// ── files to NEVER import as skills ──
const SKIP_FILES = new Set([
  'README.md', 'readme.md', 'AGENTS.md', 'agents.md',
  'CONTRIBUTING.md', 'CHANGELOG.md', 'LICENSE.md',
  '_template.md', '_sections.md', 'SKILL.md', // bare SKILL.md (no dir context) is likely a repo root file
])

function loadSyncState() {
  try { if (fs.existsSync(statePath)) return JSON.parse(fs.readFileSync(statePath, 'utf-8')) } catch {}
  return {}
}

function saveSyncState(state) {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf-8')
}

// ── Parse minimal frontmatter from raw markdown ──
function parseFrontmatter(raw) {
  const trimmed = raw.trimStart()
  if (!trimmed.startsWith('---')) return null
  const closeIdx = trimmed.indexOf('---', 3)
  if (closeIdx === -1) return null
  const fmStr = trimmed.slice(3, closeIdx)
  const data = {}
  for (const line of fmStr.split('\n')) {
    const ci = line.indexOf(':')
    if (ci === -1) continue
    const key = line.slice(0, ci).trim()
    let val = line.slice(ci + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    // Simple array: [a, b, c]
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
    }
    data[key] = val
  }
  return data
}

// ── Check if a file is a valid skill ──
function isValidSkill(frontmatter, filename) {
  if (!frontmatter) return false
  if (!frontmatter.slug || !frontmatter.name) return false
  // Reject known non-skill files by filename
  if (SKIP_FILES.has(filename)) return false
  if (filename.startsWith('_')) return false
  return true
}

// ── GitHub API helpers ──
async function checkRepo(owner, repo, branch) {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`
  const res = await fetch(url, {
    headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'skill-book-sync' },
  })
  if (!res.ok) return null
  const data = await res.json()
  return { owner, repo, latestSha: data.sha, committedAt: data.commit.committer.date }
}

async function listRepoFiles(owner, repo, branch, skillsPath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  const res = await fetch(url, {
    headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'skill-book-sync' },
  })
  if (!res.ok) return []
  const data = await res.json()
  const prefix = skillsPath ? `${skillsPath}/` : ''

  return (data.tree || [])
    .filter(f => {
      if (!f.path.endsWith('.md')) return false
      if (!f.path.startsWith(prefix)) return false
      const filename = path.basename(f.path)
      if (SKIP_FILES.has(filename)) return false
      if (filename.startsWith('_')) return false
      return true
    })
    .map(f => ({ path: f.path, sha: f.sha }))
}

async function fetchFileContent(owner, repo, branch, filePath) {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`
  const res = await fetch(url, { headers: { 'User-Agent': 'skill-book-sync' } })
  if (!res.ok) return null
  return await res.text()
}

// ── Main sync logic ──
async function fetchSkills(owner, repo, branch, skillsPath, force = false) {
  const syncState = loadSyncState()
  const repoKey = `${owner}/${repo}`
  const files = await listRepoFiles(owner, repo, branch, skillsPath)

  const report = { added: [], updated: [], skipped: [], errors: [], unchanged: 0 }
  const localSkills = loadLocalSkills()

  for (const file of files) {
    const filename = path.basename(file.path)
    const fileStateKey = `${repoKey}/${file.path}`

    // Skip if unchanged (unless --force)
    if (!force && syncState[fileStateKey] === file.sha) {
      report.unchanged++
      continue
    }

    // Fetch content
    const raw = await fetchFileContent(owner, repo, branch, file.path)
    if (!raw) {
      report.errors.push({ file: filename, reason: 'fetch failed' })
      continue
    }

    // Validate frontmatter
    const fm = parseFrontmatter(raw)
    if (!isValidSkill(fm, filename)) {
      report.skipped.push({ file: filename, reason: 'invalid frontmatter (missing slug/name)' })
      continue
    }

    const slug = fm.slug
    const targetPath = path.join(skillsDir, `${slug}.md`)

    // Check if local skill exists and has manual edits
    if (localSkills.has(slug) && !force) {
      const existing = fs.readFileSync(targetPath, 'utf-8')
      if (existing === raw) {
        syncState[fileStateKey] = file.sha
        report.unchanged++
        continue
      }
      // Content differs — flag as updated but don't overwrite if user-edited
      report.updated.push({ slug, file: filename, reason: 'content differs from upstream' })
    } else {
      report.added.push({ slug, file: filename })
    }

    // Write file (add new, or update if force)
    if (!localSkills.has(slug) || force) {
      fs.writeFileSync(targetPath, raw, 'utf-8')
    }

    syncState[fileStateKey] = file.sha
  }

  saveSyncState(syncState)
  return report
}

function loadLocalSkills() {
  const slugs = new Map()
  const files = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'))
  for (const f of files) {
    try {
      const raw = fs.readFileSync(path.join(skillsDir, f), 'utf-8')
      const fm = parseFrontmatter(raw)
      if (fm && fm.slug) slugs.set(fm.slug, f)
    } catch {}
  }
  return slugs
}

function rebuildIndex() {
  const files = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'))
  const index = []
  for (const file of files) {
    const raw = fs.readFileSync(path.join(skillsDir, file), 'utf-8')
    const fm = parseFrontmatter(raw)
    if (!fm || !fm.slug || !fm.name) continue
    index.push({
      name: fm.name, slug: fm.slug,
      category: fm.category || '',
      tags: Array.isArray(fm.tags) ? fm.tags : (fm.tags ? [fm.tags] : []),
      description: fm.description || '',
      scenarios: Array.isArray(fm.scenarios) ? fm.scenarios : (fm.scenarios ? [fm.scenarios] : []),
      ...(fm.commands && { commands: fm.commands }),
      ...(fm.install && { install: fm.install }),
      ...(fm.source && { source: fm.source }),
      ...(fm.related && { related: Array.isArray(fm.related) ? fm.related : [fm.related] }),
      ...(fm.version && { version: fm.version }),
      ...(fm.prerequisites && { prerequisites: Array.isArray(fm.prerequisites) ? fm.prerequisites : [fm.prerequisites] }),
      ...(fm.quality && { quality: fm.quality }),
      ...(fm.lastVerified && { lastVerified: fm.lastVerified }),
      ...(fm.deprecated && { deprecated: fm.deprecated }),
    })
  }
  fs.writeFileSync(path.join(skillsDir, 'index.json'), JSON.stringify(index, null, 2), 'utf-8')
  return index.length
}

// ── CLI ──
const args = process.argv.slice(2)
const mode = args.includes('--fetch') ? 'fetch' : 'check'
const force = args.includes('--force')

async function main() {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  const allResults = []

  for (const repo of config.repos) {
    if (!repo.enabled) continue
    console.log(`\n${'='.repeat(55)}`)
    console.log(`  ${repo.owner}/${repo.repo}  (branch: ${repo.branch})`)
    console.log(`${'='.repeat(55)}`)

    const info = await checkRepo(repo.owner, repo.repo, repo.branch)
    if (!info) {
      console.log(`  ❌ Failed to fetch repo info`)
      continue
    }
    console.log(`  Latest commit: ${info.latestSha.slice(0, 7)}  (${info.committedAt})`)

    if (mode === 'fetch') {
      console.log(`  Scanning for skills in: ${repo.skillsPath || '(root)'}`)
      const report = await fetchSkills(repo.owner, repo.repo, repo.branch, repo.skillsPath, force)
      console.log(`  ── Results ──`)
      console.log(`  ✅ Added:    ${report.added.length}`)
      if (report.added.length) report.added.forEach(s => console.log(`     + ${s.slug}  (${s.file})`))
      console.log(`  ⚠️  Updated:  ${report.updated.length}`)
      if (report.updated.length) report.updated.forEach(s => console.log(`     ~ ${s.slug}  (${s.file}) — ${s.reason}`))
      console.log(`  ⏭️  Skipped:  ${report.skipped.length}`)
      if (report.skipped.length) report.skipped.forEach(s => console.log(`     - ${s.file}: ${s.reason}`))
      console.log(`  ⏭️  Unchanged: ${report.unchanged}`)
      console.log(`  ❌ Errors:   ${report.errors.length}`)
      allResults.push({ owner: repo.owner, repo: repo.repo, ...report })
    } else {
      allResults.push({ owner: repo.owner, repo: repo.repo, latestSha: info.latestSha })
    }
  }

  if (mode === 'fetch') {
    const count = rebuildIndex()
    const totalAdded = allResults.reduce((sum, r) => sum + (r.added?.length || 0), 0)
    const totalUpdated = allResults.reduce((sum, r) => sum + (r.updated?.length || 0), 0)
    console.log(`\n${'='.repeat(55)}`)
    console.log(`  Index rebuilt: ${count} skills total`)
    console.log(`  New: ${totalAdded}  |  Updated: ${totalUpdated}`)
    console.log(`${'='.repeat(55)}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
