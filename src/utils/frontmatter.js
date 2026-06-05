/**
 * Lightweight browser-compatible frontmatter parser.
 * Extracts YAML-like metadata between --- delimiters.
 * Supports: string values, inline arrays [a, b, c], multi-line values (|),
 * and object arrays (- name: x / cmd: y).
 */
export function parseFrontmatter(raw) {
  const trimmed = raw.trimStart()
  if (!trimmed.startsWith('---')) {
    return { data: {}, content: raw }
  }

  const firstClose = trimmed.indexOf('---', 3)
  if (firstClose === -1) {
    return { data: {}, content: raw }
  }

  const fmStr = trimmed.slice(3, firstClose).trim()
  const body = trimmed.slice(firstClose + 3).trimStart()

  const data = {}
  const lines = fmStr.split('\n')

  let i = 0
  while (i < lines.length) {
    const trimmedLine = lines[i].trim()
    if (!trimmedLine) { i++; continue }

    // Object array item: starts with "- "
    if (trimmedLine.startsWith('- ')) {
      // Find which key this array belongs to (the most recent key)
      const lastKey = Object.keys(data).find(k => Array.isArray(data[k]) && data[k]._parsing)
      if (lastKey) {
        const obj = parseObjArrayItem(lines, i)
        data[lastKey].push(obj.item)
        i = obj.nextLine
        continue
      }
      i++
      continue
    }

    const colonIdx = trimmedLine.indexOf(':')
    if (colonIdx === -1) { i++; continue }

    const key = trimmedLine.slice(0, colonIdx).trim()
    let val = trimmedLine.slice(colonIdx + 1).trim()

    // Multi-line value with |
    if (val === '|' || val === '|+') {
      const multiline = []
      i++
      while (i < lines.length) {
        const nextLine = lines[i]
        // Lines belonging to the multi-line block must be indented
        if (nextLine && (nextLine.startsWith('  ') || nextLine.startsWith('\t'))) {
          multiline.push(nextLine.replace(/^[\t ]{1,2}/, ''))
          i++
        } else {
          break
        }
      }
      data[key] = multiline.join('\n')
      continue
    }

    // Empty value after colon — might be an object array
    if (val === '') {
      // Check if next non-empty line starts with "- "
      let nextI = i + 1
      while (nextI < lines.length && !lines[nextI].trim()) nextI++
      if (nextI < lines.length && lines[nextI].trim().startsWith('- ')) {
        // This is an object array
        const arr = []
        arr._parsing = true
        data[key] = arr
        i++
        continue
      }
      data[key] = ''
      i++
      continue
    }

    // Remove surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }

    // Parse YAML inline arrays: [a, b, c]
    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(s => s !== '')
    } else {
      data[key] = val
    }
    i++
  }

  // Clean up _parsing markers
  for (const key of Object.keys(data)) {
    if (Array.isArray(data[key]) && data[key]._parsing) {
      delete data[key]._parsing
    }
  }

  return { data, content: body }
}

/**
 * Parse a single object array item starting with "- "
 * Returns { item: {key: value, ...}, nextLine: number }
 */
function parseObjArrayItem(lines, startLine) {
  const item = {}
  // First line: "- key: value"
  const firstLine = lines[startLine].trim().slice(2) // remove "- "
  const colonIdx = firstLine.indexOf(':')
  if (colonIdx !== -1) {
    const key = firstLine.slice(0, colonIdx).trim()
    let val = firstLine.slice(colonIdx + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    item[key] = val
  }

  let i = startLine + 1
  while (i < lines.length) {
    const line = lines[i]
    // Check if it's a continuation (indented) or a new array item / top-level key
    if (!line || !line.match(/^[\t ]{2,}/)) break // not indented = end of this item
    const trimmed = line.trim()
    if (trimmed.startsWith('- ')) break // new array item

    const ci = trimmed.indexOf(':')
    if (ci !== -1) {
      const key = trimmed.slice(0, ci).trim()
      let val = trimmed.slice(ci + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      item[key] = val
    }
    i++
  }

  return { item, nextLine: i }
}
