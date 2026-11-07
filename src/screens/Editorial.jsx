import { useEffect, useState } from 'react'
import { Check, ChevronLeft, Copy } from 'lucide-react'
import { ITEM_BY_KEY } from '../lib/sheet'
import { loadEditorial, parseMarkdown } from '../lib/editorials'
import { LineBadge, LinkSet, kindText } from './bits'

// `code`, **bold** and [text](https://link) inside a line.
function Inline({ text }) {
  const out = []
  const re = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g
  let last = 0
  let m
  while ((m = re.exec(text))) {
    out.push(text.slice(last, m.index))
    if (m[1] !== undefined) out.push(<code key={m.index} className="inline-code">{m[1]}</code>)
    else if (m[2] !== undefined) out.push(<strong key={m.index}>{m[2]}</strong>)
    else
      out.push(
        <a key={m.index} href={m[4]} target="_blank" rel="noopener noreferrer">
          {m[3]}
        </a>,
      )
    last = m.index + m[0].length
  }
  out.push(text.slice(last))
  return out
}

// A code block with a Copy button, so code can go straight into an online compiler.
function CodeBlock({ lang, text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }
  return (
    <div className="ed-code-wrap">
      <pre className="ed-code" data-lang={lang}>
        <code>{text}</code>
      </pre>
      <button type="button" className="ed-copy" onClick={copy} aria-label={copied ? 'Copied' : 'Copy code'}>
        {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

function Blocks({ blocks }) {
  return blocks.map((b, i) => {
    if (b.type === 'h1') return null
    if (b.type === 'h2') return <h2 key={i}>{b.text}</h2>
    if (b.type === 'h3') return <h3 key={i}>{b.text}</h3>
    if (b.type === 'code') return <CodeBlock key={i} lang={b.lang} text={b.text} />
    if (b.type === 'hidden')
      return (
        <details key={i} className="ed-hidden">
          <summary>
            <Inline text={b.title} />
          </summary>
          <div className="ed-hidden-body">
            <Blocks blocks={b.blocks} />
          </div>
        </details>
      )
    if (b.type === 'ul' || b.type === 'ol') {
      const List = b.type
      return (
        <List key={i}>
          {b.items.map((it, j) => (
            <li key={j}>
              <Inline text={it.text} />
              {it.sub.length > 0 && (
                <ul>
                  {it.sub.map((s, k) => (
                    <li key={k}>
                      <Inline text={s} />
                    </li>
                  ))}
                </ul>
              )}
              {it.more.map((m, k) => (
                <span key={k} className="ed-li-more">
                  <Inline text={m} />
                </span>
              ))}
            </li>
          ))}
        </List>
      )
    }
    if (b.type === 'table')
      return (
        <div key={i} className="table-wrap">
          <table>
            <thead>
              <tr>
                {b.head.map((h, j) => (
                  <th key={j}>
                    <Inline text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, j) => (
                <tr key={j}>
                  {r.map((c, k) => (
                    <td key={k}>
                      <Inline text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    if (b.type === 'note')
      return (
        <p key={i} className="ed-note">
          <Inline text={b.text} />
        </p>
      )
    return (
      <p key={i}>
        <Inline text={b.text} />
      </p>
    )
  })
}

export default function Editorial({ itemKey, onBack }) {
  const item = ITEM_BY_KEY.get(itemKey)
  const [blocks, setBlocks] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let live = true
    setBlocks(null)
    loadEditorial(itemKey)
      .then((text) => live && (text ? setBlocks(parseMarkdown(text)) : setError('There is no editorial for this station yet.')))
      .catch(() => live && setError('Could not load the editorial.'))
    return () => {
      live = false
    }
  }, [itemKey])

  if (!item) return <p className="notice">Unknown station.</p>

  return (
    <article className="editorial" style={{ '--c': item.line.color }} aria-labelledby="ed-title">
      <button className="back" onClick={onBack}>
        <ChevronLeft size={18} aria-hidden="true" /> Back
      </button>
      <header className="ed-head">
        <LineBadge line={item.line} size="lg" />
        <div>
          <h1 id="ed-title">{item.label}</h1>
          <p className="ed-meta">
            Terminus editorial • {item.line.name} • {item.section} • {kindText(item)}
          </p>
        </div>
      </header>
      <LinkSet item={item} hideOwn />

      {error ? (
        <p className="notice">{error}</p>
      ) : !blocks ? (
        <div className="skeleton" aria-busy="true">
          <i className="sk sk-block" />
          <i className="sk sk-block sk-tall" />
        </div>
      ) : (
        <div className="ed-body">
          <Blocks blocks={blocks} />
        </div>
      )}
    </article>
  )
}
