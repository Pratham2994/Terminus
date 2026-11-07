// Parses Striver's A2Z sheet (src/data/a2z.txt) into lines (topics),
// sections and stations (items). Format of the text file:
//   #Topic name
//   @Section name
//   T|minutes|slug|Label   (theory lesson)
//   P|minutes|slug|Label   (practice problem)
import raw from '../data/a2z.txt?raw'
import linksRaw from '../data/links.txt?raw'
import { editorialHref, hasEditorial } from './editorials'

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

// LeetCode problems in the sheet that need LeetCode Premium. They are never
// used as the place to solve; they are listed last, marked Premium.
const LEETCODE_PREMIUM = new Set([
  'buildings-with-an-ocean-view', 'plus-one-linked-list', 'longest-substring-with-at-most-k-distinct-characters',
  'minimum-window-subsequence', 'find-the-celebrity', 'boundary-of-binary-tree', 'inorder-successor-in-bst',
  'largest-bst-subtree', 'minimum-cost-to-connect-sticks', 'number-of-distinct-islands', 'alien-dictionary',
  'minimize-max-distance-to-gas-station', 'number-of-islands-ii', 'connecting-cities-with-minimum-cost',
  'implement-trie-ii-prefix-tree', 'longest-word-with-all-prefixes', 'number-of-distinct-substrings-in-a-string',
  'maximum-size-subarray-sum-equals-k', 'median-of-a-row-wise-sorted-matrix',
])

// Free resources from src/data/links.txt, one line per item in sheet order.
const BLOG_BASE = 'https://takeuforward.org/blogs/data-structure-and-algorithm/'
{
  const rows = linksRaw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
  SHEET.items.forEach((it, i) => {
    const [slug, blog = '', yt = '', lc = '', flag = ''] = (rows[i] || '').split('|')
    // A line that does not belong to this item is ignored, not misapplied.
    if (slug !== it.slug) return
    it.editorial = blog ? (blog.startsWith('~') ? BLOG_BASE + blog.slice(1) : `https://takeuforward.org${blog}`) : null
    it.video = yt ? `https://www.youtube.com/watch?v=${yt}` : null
    it.leetcode = lc && !LEETCODE_PREMIUM.has(lc) ? `https://leetcode.com/problems/${lc}/` : null
    it.leetcodePremium = lc && LEETCODE_PREMIUM.has(lc) ? `https://leetcode.com/problems/${lc}/` : null
    it.plusOnly = flag === 'P'
  })
}

// Every free link for an item, in the order to use them.
// A lesson: the free editorial, the video, then takeUforward's lesson page
// (which can sit behind Plus). A problem: where to solve it (LeetCode before
// takeUforward's practice page, which has limited credits; a Plus-only page
// is left out), then the editorial, then the video. With nothing free at
// all, a web search for the problem.
export function resources(item) {
  const out = []
  const editorial = item.editorial && { kind: 'editorial', label: 'Editorial', site: 'free', href: item.editorial }
  const video = item.video && { kind: 'video', label: 'Video', site: 'YouTube', href: item.video }
  if (item.lesson) {
    out.push(editorial, video, { kind: 'lesson', label: 'Lesson', site: 'takeUforward', href: strivLink(item) })
  } else {
    if (item.leetcode) out.push({ kind: 'problem', label: 'Problem', site: 'LeetCode', href: item.leetcode })
    else if (!item.plusOnly) out.push({ kind: 'problem', label: 'Problem', site: 'takeUforward', href: strivLink(item) })
    // Our own editorial, for problems with nothing free besides the problem.
    if (hasEditorial(item.key)) out.push({ kind: 'own', label: 'Editorial', site: 'Terminus', href: editorialHref(item.key), internal: true })
    out.push(editorial, video)
    if (item.leetcodePremium) out.push({ kind: 'premium', label: 'LeetCode', site: 'Premium', href: item.leetcodePremium })
  }
  const list = out.filter(Boolean)
  // Nothing free outside Terminus: add a web search, so Start has somewhere to go.
  if (!list.some((r) => !r.internal && r.kind !== 'premium')) {
    const q = encodeURIComponent(`${item.label} problem`)
    const search = { kind: 'search', label: 'Search', site: 'web', href: `https://www.google.com/search?q=${q}` }
    const premiumAt = list.findIndex((r) => r.kind === 'premium')
    list.splice(premiumAt === -1 ? list.length : premiumAt, 0, search)   // before any Premium link
  }
  return list
}

// The link Start opens: the first free outside resource.
export function primaryLink(item) {
  return resources(item).find((r) => !r.internal && r.kind !== 'premium')?.href || strivLink(item)
}

export function strivLink(item) {
  const slug = encodeURIComponent(item.slug).replace(/'/g, '%27')
  return item.lesson
    ? `https://takeuforward.org/learning/dsa/${slug}?source=strivers-a2z-dsa-sheet`
    : `https://takeuforward.org/practice/dsa/${slug}`
}
