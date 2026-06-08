import { ref } from 'vue'

const STORAGE_KEY_API = 'skill-book-deepseek-api-key'

function getStoredApiKey() {
  return localStorage.getItem(STORAGE_KEY_API) || ''
}

export function useSkillUpdate() {
  const updating = ref(false)
  const updateError = ref(null)
  const updateDiff = ref(null)
  const apiKey = ref(getStoredApiKey())

  function parseGithubUrl(url) {
    if (!url) return null
    const trimmed = url.trim().replace(/\/+$/, '')
    const match = trimmed.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) return null
    return { owner: match[1], repo: match[2] }
  }

  async function fetchReadme(owner, repo, branch = 'main') {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'skill-book-update' } })
      if (!res.ok) return null
      return await res.text()
    } catch {
      return null
    }
  }

  async function getLatestCommit(owner, repo, branch = 'main') {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1&sha=${branch}`
    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'skill-book-update' },
      })
      if (!res.ok) return null
      const data = await res.json()
      if (!data.length) return null
      return { sha: data[0].sha, date: data[0].commit.committer.date }
    } catch {
      return null
    }
  }

  async function analyzeWithAI(readme, skillName, repo) {
    const key = apiKey.value
    if (!key) throw new Error('请先配置 DeepSeek API Key')

    const prompt = `你是一个技能文档更新分析专家。以下是技能"${skillName}"对应 GitHub 仓库(${repo})的最新 README 内容。

请提取以下信息并用中文总结：
1. 这个 Skill 的核心功能和使用场景
2. 安装命令（如有）
3. 常用命令和使用方法
4. 关键配置项
5. 最新变更/更新内容

请以 Markdown 格式输出一个完整的"如何使用本 Skill"章节，结构如下：

## 如何使用本 Skill

### 适用场景
（列出 2-3 个典型使用场景）

### 安装
\`\`\`bash
（安装命令）
\`\`\`

### 基本用法
（最核心的使用步骤和命令）

### 常用命令
（如有 CLI 命令，列出主要命令和说明）

### 注意事项
（使用时需要注意的要点）

README 内容：
---
${readme.slice(0, 10000)}`

    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-pro',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
        max_tokens: 4096,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`DeepSeek API 请求失败: ${err.error?.message || `HTTP ${res.status}`}`)
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content || ''
  }

  async function checkForUpdate(skill) {
    updating.value = true
    updateError.value = null
    updateDiff.value = null

    try {
      const source = skill.source
      if (!source) throw new Error('该 Skill 未配置 source（GitHub 地址），无法自动更新')

      const parsed = parseGithubUrl(source)
      if (!parsed) throw new Error(`无法解析 GitHub 地址: ${source}`)

      const { owner, repo } = parsed

      // Get latest commit
      const commit = await getLatestCommit(owner, repo)
      if (!commit) throw new Error(`无法获取仓库 ${owner}/${repo} 的更新信息`)

      // Check if already up to date
      if (skill.sourceSha === commit.sha) {
        updating.value = false
        return { upToDate: true, sha: commit.sha, date: commit.date }
      }

      // Fetch README
      const readme = await fetchReadme(owner, repo)
      if (!readme) throw new Error(`无法获取 ${owner}/${repo} 的 README`)

      // Analyze with AI
      const aiSummary = await analyzeWithAI(readme, skill.name, repo)

      updateDiff.value = {
        sha: commit.sha,
        date: commit.date,
        source,
        aiSummary,
      }

      return {
        upToDate: false,
        sha: commit.sha,
        date: commit.date,
        diff: updateDiff.value,
      }
    } catch (e) {
      updateError.value = e.message
      throw e
    } finally {
      updating.value = false
    }
  }

  function clearDiff() {
    updateDiff.value = null
    updateError.value = null
  }

  return {
    updating,
    updateError,
    updateDiff,
    apiKey,
    parseGithubUrl,
    fetchReadme,
    getLatestCommit,
    analyzeWithAI,
    checkForUpdate,
    clearDiff,
  }
}
