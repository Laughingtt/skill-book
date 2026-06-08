// scripts/sync-upstream.js
// 检查上游仓库更新，输出有变更的 skill 列表
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const configPath = path.join(__dirname, '..', 'upstream-repos.json')
const skillsDir = path.join(__dirname, '..', 'public', 'skills')

async function checkRepo(owner, repo, branch) {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'skill-book-sync',
    },
  })
  if (!res.ok) {
    console.error(`  Failed to fetch ${owner}/${repo}: HTTP ${res.status}`)
    return null
  }
  const data = await res.json()
  return { owner, repo, latestSha: data.sha, committedAt: data.commit.committer.date }
}

async function main() {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

  for (const repo of config.repos) {
    if (!repo.enabled) continue
    console.log(`Checking ${repo.owner}/${repo.repo}...`)
    const info = await checkRepo(repo.owner, repo.repo, repo.branch)
    if (info) {
      console.log(`  Latest: ${info.latestSha.slice(0, 7)} (${info.committedAt})`)
    }
  }
}

main().catch(e => { console.error(e); process.exit(1) })
