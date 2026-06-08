// scripts/sync-upstream.js
// 检查上游仓库更新 + 拉取 Skill 文件
// Usage: node scripts/sync-upstream.js           → check only
//        node scripts/sync-upstream.js --fetch   → check + download .md files
//        node scripts/sync-upstream.js --json    → output JSON for API
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const configPath = path.join(__dirname, '..', 'upstream-repos.json')
const skillsDir = path.join(__dirname, '..', 'public', 'skills')
const statePath = path.join(__dirname, '..', '.sync-state.json')

function loadSyncState() {
  try {
    if (fs.existsSync(statePath)) return JSON.parse(fs.readFileSync(statePath, 'utf-8'))
  } catch {}
  return {}
}

function saveSyncState(state) {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf-8')
}

async function checkRepo(owner, repo, branch) {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`
  const res = await fetch(url, {
    headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'skill-book-sync' },
  })
  if (!res.ok) {
    console.error(`  Failed to fetch ${owner}/${repo}: HTTP ${res.status}`)
    return null
  }
  const data = await res.json()
  return { owner, repo, latestSha: data.sha, committedAt: data.commit.committer.date }
}

async function listRepoFiles(owner, repo, branch, skillsPath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  const res = await fetch(url, {
    headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'skill-book-sync' },
  })
  if (!res.ok) {
    console.error(`  Failed to list files for ${owner}/${repo}: HTTP ${res.status}`)
    return []
  }
  const data = await res.json()
  const prefix = skillsPath ? `${skillsPath}/` : ''
  return (data.tree || [])
    .filter(f => f.path.startsWith(prefix) && f.path.endsWith('.md'))
    .map(f => ({ path: f.path, sha: f.sha, url: f.url }))
}

async function fetchFileContent(owner, repo, branch, filePath) {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'skill-book-sync' },
  })
  if (!res.ok) return null
  return await res.text()
}

async function fetchSkills(owner, repo, branch, skillsPath, force = false) {
  const syncState = loadSyncState()
  const repoKey = `${owner}/${repo}`
  const files = await listRepoFiles(owner, repo, branch, skillsPath)

  const results = { pulled: [], skipped: [], errors: [] }

  for (const file of files) {
    const filename = path.basename(file.path)
    const targetPath = path.join(skillsDir, filename)
    const fileStateKey = `${repoKey}/${file.path}`

    // Skip if file hasn't changed
    if (!force && syncState[fileStateKey] === file.sha) {
      results.skipped.push(filename)
      continue
    }

    console.log(`    Fetching: ${filename}`)
    const content = await fetchFileContent(owner, repo, branch, file.path)
    if (!content) {
      results.errors.push({ file: filename, reason: 'Failed to fetch' })
      continue
    }

    // Extract slug from frontmatter to use as filename
    let targetFilename = filename
    try {
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
      if (fmMatch) {
        const slugMatch = fmMatch[1].match(/^slug:\s*(.+)$/m)
        if (slugMatch) {
          targetFilename = `${slugMatch[1].trim()}.md`
        }
      }
    } catch {}

    const finalPath = path.join(skillsDir, targetFilename)
    fs.writeFileSync(finalPath, content, 'utf-8')
    syncState[fileStateKey] = file.sha
    results.pulled.push({ file: filename, savedAs: targetFilename })
  }

  saveSyncState(syncState)
  return results
}

// Rebuild index after fetch
function rebuildIndex() {
  // Dynamic import of build logic — simple inline version for speed
  const files = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'))
  const index = []
  for (const file of files) {
    const content = fs.readFileSync(path.join(skillsDir, file), 'utf-8')
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (!fmMatch) continue
    const fm = {}
    for (const line of fmMatch[1].split('\n')) {
      const ci = line.indexOf(':')
      if (ci === -1) continue
      const key = line.slice(0, ci).trim()
      let val = line.slice(ci + 1).trim()
      if (val.startsWith('[') && val.endsWith(']')) {
        val = JSON.stringify(val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')))
      }
      fm[key] = val.startsWith('[') ? JSON.parse(val) : val.replace(/^["']|["']$/g, '')
    }
    if (!fm.name || !fm.slug) continue
    index.push(fm)
  }
  fs.writeFileSync(path.join(skillsDir, 'index.json'), JSON.stringify(index, null, 2), 'utf-8')
  return index.length
}

const args = process.argv.slice(2)
const mode = args.includes('--fetch') ? 'fetch' : args.includes('--json') ? 'json' : 'check'
const force = args.includes('--force')

async function main() {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  const allResults = []

  for (const repo of config.repos) {
    if (!repo.enabled) continue
    console.log(`Checking ${repo.owner}/${repo.repo}...`)
    const info = await checkRepo(repo.owner, repo.repo, repo.branch)
    if (!info) continue

    console.log(`  Latest: ${info.latestSha.slice(0, 7)} (${info.committedAt})`)
    const result = { owner: repo.owner, repo: repo.repo, latestSha: info.latestSha, committedAt: info.committedAt }

    if (mode === 'fetch') {
      result.files = await fetchSkills(repo.owner, repo.repo, repo.branch, repo.skillsPath, force)
    }

    allResults.push(result)
  }

  if (mode === 'fetch') {
    const count = rebuildIndex()
    console.log(`\nDone. Index rebuilt with ${count} skills.`)
  }

  if (mode === 'json') {
    console.log('__JSON_OUTPUT__')
    console.log(JSON.stringify(allResults, null, 2))
  }
}

main().catch(e => { console.error(e); process.exit(1) })
