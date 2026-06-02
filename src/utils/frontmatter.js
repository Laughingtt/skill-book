/**
 * Lightweight browser-compatible frontmatter parser.
 * Extracts YAML-like metadata between --- delimiters.
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

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) continue

    const colonIdx = trimmedLine.indexOf(':')
    if (colonIdx === -1) continue

    const key = trimmedLine.slice(0, colonIdx).trim()
    let val = trimmedLine.slice(colonIdx + 1).trim()

    // Remove surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }

    // Parse YAML inline arrays: [a, b, c]
    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''))
    } else {
      data[key] = val
    }
  }

  return { data, content: body }
}