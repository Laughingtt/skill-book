import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const skillsDir = path.join(__dirname, '..', 'public', 'skills')

function rebuildIndex() {
  const files = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'))
  const index = []
  for (const file of files) {
    const content = fs.readFileSync(path.join(skillsDir, file), 'utf-8')
    const { data } = matter(content)
    if (!data.name || !data.slug) continue
    index.push({
      name: data.name,
      slug: data.slug,
      category: data.category || '',
      tags: data.tags || [],
      description: data.description || '',
      scenarios: data.scenarios || [],
      ...(data.commands && { commands: data.commands }),
      ...(data.quickstart && { quickstart: data.quickstart }),
      ...(data.install && { install: data.install }),
      ...(data.source && { source: data.source }),
      ...(data.related && { related: data.related }),
    })
  }
  fs.writeFileSync(path.join(skillsDir, 'index.json'), JSON.stringify(index, null, 2), 'utf-8')
  return index.length
}

export default function skillApiPlugin() {
  return {
    name: 'skill-api',
    configureServer(server) {
      server.middlewares.use('/api/skills', async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost')
        const pathname = url.pathname

        // GET /api/skills/:slug — return .md file content
        if (req.method === 'GET' && pathname.match(/^\/[a-z0-9-]+$/)) {
          const slug = pathname.slice(1)
          const filePath = path.join(skillsDir, `${slug}.md`)
          if (!fs.existsSync(filePath)) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'skill not found' }))
            return
          }
          const content = fs.readFileSync(filePath, 'utf-8')
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
          res.end(content)
          return
        }

        // POST /api/skills — create or update a skill .md file
        if (req.method === 'POST' && pathname === '/') {
          try {
            const chunks = []
            for await (const chunk of req) chunks.push(chunk)
            const body = JSON.parse(Buffer.concat(chunks).toString())
            const { slug, frontmatter, content } = body

            if (!slug || !frontmatter?.name) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'slug and frontmatter.name are required' }))
              return
            }

            const fm = {
              slug,
              name: frontmatter.name,
              ...(frontmatter.category && { category: frontmatter.category }),
              ...(frontmatter.tags?.length && { tags: frontmatter.tags }),
              ...(frontmatter.description && { description: frontmatter.description }),
              ...(frontmatter.install && { install: frontmatter.install }),
              ...(frontmatter.source && { source: frontmatter.source }),
              ...(frontmatter.scenarios?.length && { scenarios: frontmatter.scenarios }),
              ...(frontmatter.commands?.length && { commands: frontmatter.commands }),
              ...(frontmatter.quickstart && { quickstart: frontmatter.quickstart }),
              ...(frontmatter.related?.length && { related: frontmatter.related }),
            }

            const mdContent = matter.stringify(content || '', fm)
            const filePath = path.join(skillsDir, `${slug}.md`)
            fs.writeFileSync(filePath, mdContent, 'utf-8')

            const count = rebuildIndex()
            console.log(`[skill-api] Saved ${slug}.md, index now has ${count} skills`)

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, slug, indexCount: count }))
          } catch (e) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: e.message }))
          }
          return
        }

        // DELETE /api/skills/:slug — delete a skill .md file
        if (req.method === 'DELETE' && pathname.match(/^\/[a-z0-9-]+$/)) {
          try {
            const slug = pathname.slice(1)
            if (!slug || /[^a-z0-9-]/.test(slug)) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'invalid slug' }))
              return
            }

            const filePath = path.join(skillsDir, `${slug}.md`)
            if (!fs.existsSync(filePath)) {
              res.statusCode = 404
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'skill not found' }))
              return
            }

            fs.unlinkSync(filePath)
            const count = rebuildIndex()
            console.log(`[skill-api] Deleted ${slug}.md, index now has ${count} skills`)

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, slug, indexCount: count }))
          } catch (e) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: e.message }))
          }
          return
        }

        // GET /api/skills/leaderboard — proxy npx skills find for popular queries
        if (req.method === 'GET' && pathname === '/leaderboard') {
          try {
            res.setHeader('Content-Type', 'application/json')
            const { execSync } = await import('child_process')

            const queries = ['react', 'next', 'design', 'testing', 'python', 'cli', 'deploy']
            const allSkills = new Map()

            for (const q of queries) {
              try {
                const stdout = execSync(`npx skills find "${q}"`, {
                  encoding: 'utf-8',
                  timeout: 20000,
                  env: { ...process.env, CI: 'true' },
                })
                const lines = stdout.split('\n')
                for (const line of lines) {
                  const match = line.match(/^(.+?@.+?)\s+([\d.]+[KMB]?)\s+installs/)
                  if (match) {
                    const name = match[1]
                    const installs = match[2]
                    const urlMatch = line.match(/https:\/\/skills\.sh\/[^\s]+/)
                    const url = urlMatch ? urlMatch[0] : ''
                    if (!allSkills.has(name)) {
                      allSkills.set(name, { name, installs, url })
                    }
                  }
                }
              } catch {}
            }

            const skills = [...allSkills.values()]
            skills.sort((a, b) => {
              const parseVal = (v) => {
                if (!v || typeof v !== 'string') return 0
                const num = parseFloat(v)
                if (isNaN(num)) return 0
                if (v.endsWith('B')) return num * 1e9
                if (v.endsWith('M')) return num * 1e6
                if (v.endsWith('K')) return num * 1e3
                return num
              }
              return parseVal(b.installs) - parseVal(a.installs)
            })

            res.end(JSON.stringify({ skills: skills.slice(0, 50), updatedAt: new Date().toISOString() }))
          } catch (e) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: e.message }))
          }
          return
        }

        next()
      })
    },
  }
}
