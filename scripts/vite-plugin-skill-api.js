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

        next()
      })
    },
  }
}
