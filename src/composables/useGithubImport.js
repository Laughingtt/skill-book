import { ref } from 'vue'

const STORAGE_KEY_API = 'skill-book-deepseek-api-key'
const STORAGE_KEY_TAVILY = 'skill-book-tavily-api-key'

function getStoredApiKey() {
  return localStorage.getItem(STORAGE_KEY_API) || ''
}

function getStoredTavilyApiKey() {
  return localStorage.getItem(STORAGE_KEY_TAVILY) || ''
}

export function useGithubImport() {
  const importing = ref(false)
  const importError = ref(null)
  const apiKey = ref(getStoredApiKey())
  const tavilyApiKey = ref(getStoredTavilyApiKey())

  function saveApiKey(key) {
    apiKey.value = key
    localStorage.setItem(STORAGE_KEY_API, key)
  }

  function saveTavilyApiKey(key) {
    tavilyApiKey.value = key
    localStorage.setItem(STORAGE_KEY_TAVILY, key)
  }

  function parseGithubUrl(url) {
    const trimmed = url.trim().replace(/\/+$/, '')
    const match = trimmed.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) throw new Error('无效的 GitHub 仓库地址，格式应为 https://github.com/owner/repo')
    return { owner: match[1], repo: match[2] }
  }

  async function fetchReadmeViaTavily(owner, repo) {
    const key = tavilyApiKey.value
    if (!key) throw new Error('请先配置 Tavily API Key')

    const res = await fetch('https://api.tavily.com/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        urls: `https://github.com/${owner}/${repo}`,
        extract_depth: 'advanced',
        format: 'markdown',
        include_images: false,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`Tavily API 请求失败: ${err.detail || `HTTP ${res.status}`}`)
    }

    const data = await res.json()
    if (!data.results?.[0]?.raw_content) {
      throw new Error('Tavily 未返回有效内容，请检查仓库地址是否正确')
    }
    return data.results[0].raw_content
  }

  async function summarizeWithAI(readme, owner, repo) {
    const key = apiKey.value
    if (!key) throw new Error('请先配置 DeepSeek API Key')

    const prompt = `你是一个技能文档分析专家。请根据以下 GitHub 仓库的 README 内容，提取这个技能的关键信息。

仓库地址: https://github.com/${owner}/${repo}
重要：name 字段必须使用仓库的原始英文名称 "${repo}"，不要翻译成中文。
重要：category 字段必须从以下已有分类中选择最合适的（必须完全匹配其中一个）：
编码开发与工程规范、数据分析与可视化、文档与知识管理、UI/UX设计与前端美化、内容创作与自媒体、沟通与协作、效率工具与自动化、学习与研究、安全与测试、云服务与基础设施、代码维护与质量、营销与增长、浏览器与文档处理

请严格按以下 JSON 格式返回，不要包含任何其他文字：
{
  "name": "${repo}",
  "description": "技能描述（2-3句话，说明用途和核心能力，中文）",
  "category": "从上述分类列表中选择最合适的一个",
  "tags": ["标签1", "标签2", "标签3"],
  "install": "安装命令（如有，否则空字符串）",
  "source": "https://github.com/${owner}/${repo}",
  "usage_summary": "用中文总结这个 skill 的使用方法，格式为 Markdown，包含以下章节：\\n\\n## 如何使用本 Skill\\n\\n### 适用场景\\n（列出 2-3 个典型使用场景）\\n\\n### 基本用法\\n（最核心的使用步骤和命令）\\n\\n### 关键配置\\n（重要的配置项或参数说明）\\n\\n### 注意事项\\n（使用时需要注意的要点）\\n\\n总结要简洁实用，帮助用户快速上手，不要重复 README 中已有的详细内容"
}

README 内容：
---
${readme.slice(0, 12000)}`

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
        max_tokens: 8192,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`DeepSeek API 请求失败: ${err.error?.message || `HTTP ${res.status}`}`)
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || ''

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error(`AI 返回格式异常，无法解析。返回内容: ${content.slice(0, 200)}`)

    try {
      return JSON.parse(jsonMatch[0])
    } catch {
      throw new Error('AI 返回的 JSON 格式无效')
    }
  }

  async function importFromGithub(url) {
    importError.value = null
    importing.value = true
    try {
      const { owner, repo } = parseGithubUrl(url)
      const readme = await fetchReadmeViaTavily(owner, repo)
      const skillData = await summarizeWithAI(readme, owner, repo)

      const slug = repo
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      // Compose content: AI usage summary first, then original README
      const usageSummary = skillData.usage_summary || ''
      const content = (usageSummary ? usageSummary + '\n\n---\n\n' : '') + readme.trim()

      return {
        name: repo,
        slug,
        category: skillData.category || '',
        tags: Array.isArray(skillData.tags) ? skillData.tags : [],
        description: skillData.description || '',
        install: skillData.install || '',
        source: skillData.source || `https://github.com/${owner}/${repo}`,
        content,
      }
    } catch (e) {
      importError.value = e.message
      throw e
    } finally {
      importing.value = false
    }
  }

  return { importing, importError, apiKey, saveApiKey, tavilyApiKey, saveTavilyApiKey, importFromGithub }
}
