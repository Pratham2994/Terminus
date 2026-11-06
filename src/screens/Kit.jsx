import { useState } from 'react'
import { KIT } from '../kit/content'

const KEY = 'terminus.kit'

function initial() {
  try {
    const v = localStorage.getItem(KEY)
    return KIT.some((c) => c.id === v) ? v : KIT[0].id
  } catch {
    return KIT[0].id
  }
}

export default function Kit() {
  const [id, setId] = useState(initial)
  const chapter = KIT.find((c) => c.id === id)

  const pick = (next) => {
    setId(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* ignore */
    }
  }

  return (
    <section className="kit" aria-labelledby="kit-title">
      <header className="page-head">
        <h1 id="kit-title">C++ kit</h1>
      </header>
      <nav className="kit-tabs" aria-label="Kit chapters">
        {KIT.map((c) => (
          <button key={c.id} aria-current={c.id === id ? 'true' : undefined} onClick={() => pick(c.id)}>
            {c.title}
          </button>
        ))}
      </nav>

      <article className="kit-body">
        <p className="kit-intro">{chapter.intro}</p>
        {chapter.blocks.map((b) => (
          <section key={b.h} className="kit-block">
            <h2>{b.h}</h2>
            {b.p && <p>{b.p}</p>}
            {b.table && (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {b.table[0].map((c) => (
                        <th key={c}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.table.slice(1).map((r) => (
                      <tr key={r[0]}>
                        {r.map((c, i) => (
                          <td key={i} className={i === 0 && chapter.id === 'bits' ? 'mono' : undefined}>
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {b.code && (
              <pre>
                <code>{b.code}</code>
              </pre>
            )}
          </section>
        ))}
      </article>
    </section>
  )
}
