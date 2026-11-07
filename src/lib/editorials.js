// Terminus's own editorials, one Markdown file per station in
// src/data/editorials/<item key>.md. Loaded only when opened.
const FILES = import.meta.glob('../data/editorials/*.md', { query: '?raw', import: 'default' })

const LOADERS = new Map(Object.entries(FILES).map(([path, load]) => [path.split('/').pop().replace(/\.md$/, ''), load]))

export function hasEditorial(key) {
  return LOADERS.has(key)
}

export function editorialHref(key) {
  return `#editorial/${encodeURIComponent(key)}`
}

export async function loadEditorial(key) {
  const load = LOADERS.get(key)
  return load ? load() : null
}

// A small Markdown reader for our own files: headings (#, ##, ###),
// paragraphs, "-" lists, "1." lists, fenced code, tables, "> " notes,
// inline `code` / **bold**, and folded sections:
//   :::hidden Title shown on the fold
//   ...any of the above...
//   :::
export function parseMarkdown(text) {
  const blocks = []
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i++
      continue
    }
    const fold = line.match(/^:::hidden\s*(.*)/)
    if (fold) {
      const inner = []
      i++
      let inCode = false
      while (i < lines.length && !(lines[i].trim() === ':::' && !inCode)) {
        if (lines[i].startsWith('```')) inCode = !inCode
        inner.push(lines[i++])
      }
      i++
      blocks.push({ type: 'hidden', title: fold[1] || 'Hidden', blocks: parseMarkdown(inner.join('\n')) })
      continue
    }
    const fence = line.match(/^```(\w*)/)
    if (fence) {
      const code = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++])
      i++
      blocks.push({ type: 'code', lang: fence[1] || 'text', text: code.join('\n') })
      continue
    }
    const h = line.match(/^(#{1,3})\s+(.*)/)
    if (h) {
      blocks.push({ type: `h${h[1].length}`, text: h[2] })
      i++
      continue
    }
    if (/^\s*-\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line)
      const items = []
      while (i < lines.length && (/^\s*-\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]) || /^\s{2,}\S/.test(lines[i]))) {
        if (/^\s{2,}\S/.test(lines[i]) && !/^\s*(-|\d+\.)\s+/.test(lines[i])) items[items.length - 1] += ' ' + lines[i].trim()
        else items.push(lines[i].replace(/^\s*(-|\d+\.)\s+/, ''))
        i++
      }
      blocks.push({ type: ordered ? 'ol' : 'ul', items })
      continue
    }
    if (line.trim().startsWith('|')) {
      const rows = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
        // Skip the |---|---| line under the header.
        if (!cells.every((c) => /^:?-+:?$/.test(c))) rows.push(cells)
        i++
      }
      blocks.push({ type: 'table', head: rows[0] || [], rows: rows.slice(1) })
      continue
    }
    if (line.startsWith('> ')) {
      const q = []
      while (i < lines.length && lines[i].startsWith('> ')) q.push(lines[i++].slice(2))
      blocks.push({ type: 'note', text: q.join(' ') })
      continue
    }
    const para = []
    while (i < lines.length && lines[i].trim() && !/^(```|#{1,3}\s|\s*-\s|\s*\d+\.\s|> |\s*\||:::)/.test(lines[i])) para.push(lines[i++].trim())
    if (!para.length) para.push(lines[i++].trim()) // a stray ":::" line: show it as text, never loop
    blocks.push({ type: 'p', text: para.join(' ') })
  }
  return blocks
}
