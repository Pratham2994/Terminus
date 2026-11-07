// Pieces shared by the Ride, the station sheet and the Notes tab.

export const RESULT_TEXT = {
  alone: 'Solved alone',
  hint: 'Needed a hint',
  solution: 'Needed the solution',
  clean: 'Review: clean',
  struggled: 'Review: struggled',
  forgot: 'Review: forgot',
}

export function hasNote(a) {
  return Boolean(a && (a.pattern || a.key_idea || a.mistake || a.complexity || a.approach))
}

// "T O(n) • S O(1)" -> { time: 'O(n)', space: 'O(1)' }
export function splitComplexity(text) {
  const out = { time: '', space: '' }
  if (!text) return out
  for (const part of text.split('•')) {
    const p = part.trim()
    if (p.startsWith('T ')) out.time = p.slice(2).trim()
    else if (p.startsWith('S ')) out.space = p.slice(2).trim()
    else if (!out.time) out.time = p
  }
  return out
}

// One note, read only.
export function NoteView({ note }) {
  const { time, space } = splitComplexity(note.complexity)
  return (
    <dl className="note-view">
      {note.pattern && (
        <div>
          <dt>Pattern</dt>
          <dd>
            <span className="pill">{note.pattern}</span>
          </dd>
        </div>
      )}
      {note.key_idea && (
        <div>
          <dt>Key idea</dt>
          <dd>{note.key_idea}</dd>
        </div>
      )}
      {note.approach && (
        <div>
          <dt>Approach</dt>
          <dd>
            <pre className="approach">{note.approach}</pre>
          </dd>
        </div>
      )}
      {note.mistake && (
        <div>
          <dt>Mistake</dt>
          <dd>{note.mistake}</dd>
        </div>
      )}
      {(time || space) && (
        <div>
          <dt>Complexity</dt>
          <dd className="mono">
            {time && <>Time {time}</>}
            {time && space && ' • '}
            {space && <>Space {space}</>}
          </dd>
        </div>
      )}
    </dl>
  )
}
