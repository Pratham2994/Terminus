import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
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
          {blocks.map((b, i) => {
            if (b.type === 'h1') return null
            if (b.type === 'h2') return <h2 key={i}>{b.text}</h2>
            if (b.type === 'h3') return <h3 key={i}>{b.text}</h3>
            if (b.type === 'code')
              return (
                <pre key={i} className="ed-code" data-lang={b.lang}>
                  <code>{b.text}</code>
                </pre>
              )
            if (b.type === 'ul' || b.type === 'ol') {
              const List = b.type
              return (
                <List key={i}>
                  {b.items.map((t, j) => (
                    <li key={j}>
                      <Inline text={t} />
                    </li>
                  ))}
                </List>
              )
            }
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
          })}
        </div>
      )}
    </article>
  )
}
