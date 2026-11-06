// Parses Striver's A2Z sheet (src/data/a2z.txt) into lines (topics),
// sections and stations (items). Format of the text file:
//   #Topic name
//   @Section name
//   T|minutes|slug|Label   (theory lesson)
//   P|minutes|slug|Label   (practice problem)
import raw from '../data/a2z.txt?raw'

// One entry per topic, in sheet order: short code shown on the line badge, and line colour.
const LINE_STYLE = [
  ['BAS', '#9fb6cc'], // Beginner Problems
  ['SRT', '#e2554f'], // Sorting
  ['ARR', '#3fa7d6'], // Arrays
  ['HSH', '#8cc152'], // Hashing
  ['BIN', '#f06292'], // Binary Search
  ['STR', '#ab7df8'], // Strings (Basic and Medium)
  ['REC', '#26c6a6'], // Recursion
  ['LL', '#ff8a3d'], // Linked-List
  ['BIT', '#c6d03a'], // Bit Manipulation
  ['GRD', '#5c8dff'], // Greedy
  ['SW', '#ffd54f'], // Sliding Window / 2 Pointer
  ['STK', '#c08457'], // Stack / Queues
  ['BT', '#43b05c'], // Binary Trees
  ['BST', '#81d4fa'], // BST
  ['HP', '#d39be0'], // Heaps
  ['GR', '#ef7d7d'], // Graphs
  ['DP', '#19b5c9'], // Dynamic Programming
  ['TRI', '#b39b8e'], // Tries
  ['STX', '#8c96d8'], // Strings (Advanced)
  ['MTH', '#d9d4c7'], // Maths
]

// Lessons for other languages. Skipped by default because Terminus is C++ first.
export const DEFAULT_SKIPPED = [
  'learn-java',
  'learn-python',
  'java-collections',
  'python-libraries-part-1',
  'python-libraries-part-2',
]

function parse(text) {
  const lines = []
  const items = []
  const seen = new Map()
  let line = null
  let section = null
  for (const rawLine of text.split(/\r?\n/)) {
    const row = rawLine.trim()
    if (!row) continue
    if (row.startsWith('#')) {
      const [code, color] = LINE_STYLE[lines.length] || ['X', '#aaa']
      line = { index: lines.length, name: row.slice(1).trim(), code, color, sections: [], items: [] }
      lines.push(line)
      section = null
      continue
    }
    if (row.startsWith('@')) {
      section = { name: row.slice(1).trim(), items: [] }
      line.sections.push(section)
      continue
    }
    const parts = row.split('|')
    const [type, minutes, slug] = parts
    const label = parts.slice(3).join('|').trim()
    const n = (seen.get(slug) || 0) + 1
    seen.set(slug, n)
    const item = {
      key: n === 1 ? slug : `${slug}~${n}`,
      slug,
      label,
      lesson: type === 'T',
      minutes: Number(minutes) || 0,
      order: items.length,
      line,
      section: section.name,
    }
    items.push(item)
    line.items.push(item)
    section.items.push(item)
  }
  return { lines, items }
}

export const SHEET = parse(raw)
export const ITEM_BY_KEY = new Map(SHEET.items.map((it) => [it.key, it]))

export function strivLink(item) {
  const slug = encodeURIComponent(item.slug).replace(/'/g, '%27')
  return item.lesson
    ? `https://takeuforward.org/learning/dsa/${slug}?source=strivers-a2z-dsa-sheet`
    : `https://takeuforward.org/practice/dsa/${slug}`
}
