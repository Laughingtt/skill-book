import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const skillsDir = path.join(__dirname, '..', 'public', 'skills')

const files = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'))

const index = []
const warnings = []

for (const file of files) {
  const content = fs.readFileSync(path.join(skillsDir, file), 'utf-8')
  const { data } = matter(content)

  if (!data.name || !data.slug) {
    warnings.push(`${file}: missing required frontmatter field (name or slug)`)
    continue
  }

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

const outputPath = path.join(skillsDir, 'index.json')
fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf-8')
console.log(`Generated index.json with ${index.length} skills`)
if (warnings.length > 0) {
  console.warn(`\nWarnings:`)
  warnings.forEach(w => console.warn(`  - ${w}`))
}