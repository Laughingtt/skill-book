// scripts/discover-skills.js
// Search GitHub Topics for new potential skills
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const configPath = path.join(__dirname, '..', 'upstream-repos.json')

const TOPICS = ['claude-skill', 'ai-skill', 'agent-skill', 'claude-code-plugin']

async function searchGitHubTopic(topic) {
  const url = `https://api.github.com/search/repositories?q=topic:${topic}+stars:>10&sort=stars&per_page=10`
  const res = await fetch(url, {
    headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'skill-book-discover' },
  })
  if (!res.ok) return []
  const data = await res.json()
  return (data.items || []).map(repo => ({
    fullName: repo.full_name,
    url: repo.html_url,
    stars: repo.stargazers_count,
    description: repo.description,
    topics: repo.topics,
    updatedAt: repo.updated_at,
  }))
}

async function main() {
  console.log('Discovering skills from GitHub Topics...')
  const allResults = []

  for (const topic of TOPICS) {
    console.log(`  Searching topic: ${topic}`)
    const repos = await searchGitHubTopic(topic)
    allResults.push(...repos)
  }

  // Dedupe by fullName
  const seen = new Set()
  const unique = allResults.filter(r => {
    if (seen.has(r.fullName)) return false
    seen.add(r.fullName)
    return true
  })

  // Sort by stars descending
  unique.sort((a, b) => b.stars - a.stars)

  // Output as JSON
  console.log(JSON.stringify(unique.slice(0, 30), null, 2))
  console.log(`\nFound ${unique.length} unique repos across ${TOPICS.length} topics`)
}

main().catch(e => { console.error(e); process.exit(1) })
