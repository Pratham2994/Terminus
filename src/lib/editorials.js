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
      // A list. Each item: { text, more: [extra paragraphs], sub: [sub-bullets] }.
      // Inside an item, indented lines continue it: "   - x" is a sub-bullet,
      // other indented text continues the current paragraph, and an indented
      // line after a blank line starts a new paragraph of the same item.
      const ordered = /^\s*\d+\./.test(line)
      const top = ordered ? /^\d+\.\s+/ : /^-\s+/
      const items = []
      let gap = false
      while (i < lines.length) {
        const l = lines[i]
        if (!l.trim()) {
          // Keep going only if the list goes on after the blank line(s).
          let j = i
          while (j < lines.length && !lines[j].trim()) j++
          if (j < lines.length && (top.test(lines[j]) || /^\s{2,}\S/.test(lines[j]))) {
            gap = true
            i = j
            continue
          }
          break
        }
        const item = items[items.length - 1]
        if (top.test(l) || (!items.length && /^\s*(-|\d+\.)\s+/.test(l))) {
          items.push({ text: l.replace(/^\s*(-|\d+\.)\s+/, ''), more: [], sub: [] })
        } else if (item && /^\s{2,}-\s+/.test(l)) {
          item.sub.push(l.replace(/^\s*-\s+/, ''))
        } else if (item && /^\s{2,}\S/.test(l)) {
          const t = l.trim()
          if (item.sub.length && !gap) item.sub[item.sub.length - 1] += ' ' + t
          else if (gap || item.sub.length) item.more.push(t)
          else if (item.more.length) item.more[item.more.length - 1] += ' ' + t
          else item.text += ' ' + t
        } else break
        gap = false
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
