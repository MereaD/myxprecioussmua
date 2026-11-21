'use client'
import { useEffect, useMemo, useState } from 'react'

interface Day {
  date: string
  times: string[]
}

interface Availability {
  restricted: boolean
  days: Day[]
  taken: string[]
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// When no availability is published, clients can pick any half hour in this range.
const OPEN_FROM = 6 * 60
const OPEN_UNTIL = 20 * 60

const pad = (n: number) => String(n).padStart(2, '0')
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const toMinutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3))

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${pad(m)} ${h < 12 ? 'am' : 'pm'}`
}

function feeFor(t: string, date: string) {
  const m = toMinutes(t)
  const fees: string[] = []
  if (m >= 6 * 60 && m < 8 * 60) fees.push('+£15')
  if (m >= 18 * 60) fees.push('+£10')
  if (date === iso(new Date())) fees.push('+£15')
  return fees.join(' ')
}

export default function DateTimePicker({
  date,
  time,
  onChange,
}: {
  date: string
  time: string
  onChange: (value: { date: string; time: string }) => void
}) {
  const [data, setData] = useState<Availability | null>(null)
  const [failed, setFailed] = useState(false)
  const today = iso(new Date())
  const [month, setMonth] = useState(() => (date || today).slice(0, 7))

  useEffect(() => {
    fetch('/api/availability')
      .then(r => r.json())
      .then((json: Availability) => {
        setData(json)
        // Open on the first month that has a free day.
        if (json.restricted && json.days[0] && !date) setMonth(json.days[0].date.slice(0, 7))
      })
      .catch(() => setFailed(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const taken = useMemo(() => new Set(data?.taken ?? []), [data])
  const published = useMemo(() => new Map((data?.days ?? []).map(d => [d.date, d.times])), [data])

  const isSelectable = (d: string) => {
    if (d < today) return false
    if (data?.restricted) return published.has(d)
    return true
  }

  const timesFor = (d: string): string[] => {
    if (!d) return []
    if (data?.restricted) return published.get(d) ?? []
    const all: string[] = []
    for (let m = OPEN_FROM; m <= OPEN_UNTIL; m += 30) all.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`)
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes()
    return all.filter(t => !taken.has(`${d} ${t}`) && (d !== today || toMinutes(t) > nowMinutes + 60))
  }

  // Calendar grid for the visible month, Monday first.
  const [year, mon] = month.split('-').map(Number)
  const first = new Date(year, mon - 1, 1)
  const lead = (first.getDay() + 6) % 7
  const count = new Date(year, mon, 0).getDate()
  const cells: (string | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: count }, (_, i) => iso(new Date(year, mon - 1, i + 1))),
  ]

  const shiftMonth = (delta: number) => {
    const d = new Date(year, mon - 1 + delta, 1)
    setMonth(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`)
  }
  const atFirstMonth = month <= today.slice(0, 7)
  const lastMonth = data?.restricted ? data.days[data.days.length - 1]?.date.slice(0, 7) : undefined
  const atLastMonth = lastMonth ? month >= lastMonth : false

  const times = timesFor(date)
  const groups = [
    { label: 'Morning', times: times.filter(t => toMinutes(t) < 12 * 60) },
    { label: 'Afternoon', times: times.filter(t => toMinutes(t) >= 12 * 60 && toMinutes(t) < 17 * 60) },
    { label: 'Evening', times: times.filter(t => toMinutes(t) >= 17 * 60) },
  ].filter(g => g.times.length > 0)

  const monthLabel = first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const selectedLabel = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    : ''

  if (failed) {
    return <p className="dtp-note">We couldn&apos;t load available dates. Please refresh the page.</p>
  }
  if (data?.restricted && data.days.length === 0) {
    return (
      <p className="dtp-note">
        There are no open dates right now. Please get in touch and we&apos;ll do our best to fit you in.
      </p>
    )
  }

  return (
    <div className="dtp">
      <style>{`
        .dtp { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; }
        .dtp-panel { background: #fdf8f2; border: 1px solid #e8ddd4; border-radius: 14px; padding: 16px; }
        .dtp-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .dtp-month { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.2rem; font-weight: 500; color: #2c1f14; }
        .dtp-nav { width: 32px; height: 32px; border-radius: 999px; border: 1px solid #e8ddd4; background: #fff; color: #7a5c46; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .dtp-nav:hover:not(:disabled) { border-color: #c9a96e; color: #2c1f14; }
        .dtp-nav:disabled { opacity: 0.35; cursor: default; }
        .dtp-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; }
        .dtp-wd { font-family: 'Jost', sans-serif; font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; color: #a08060; padding: 4px 0 6px; }
        .dtp-day { position: relative; aspect-ratio: 1; border-radius: 10px; border: 1px solid transparent; background: transparent; font-family: 'Jost', sans-serif; font-size: 0.9rem; color: #2c1f14; cursor: pointer; transition: background 0.15s ease, border-color 0.15s ease; }
        .dtp-day:hover:not(:disabled) { border-color: #c9a96e; background: #fff; }
        .dtp-day:disabled { color: #cbbcae; cursor: default; }
        .dtp-day.is-open::after { content: ''; position: absolute; bottom: 5px; left: 50%; width: 4px; height: 4px; margin-left: -2px; border-radius: 999px; background: #c9a96e; }
        .dtp-day.is-today { font-weight: 500; text-decoration: underline; text-underline-offset: 3px; }
        .dtp-day.is-selected { background: #2c1f14; color: #faf6f1; border-color: #2c1f14; }
        .dtp-day.is-selected::after { background: #e8c99a; }
        .dtp-group + .dtp-group { margin-top: 14px; }
        .dtp-group-label { font-family: 'Jost', sans-serif; font-size: 0.68rem; letter-spacing: 0.16em; text-transform: uppercase; color: #a08060; margin-bottom: 8px; }
        .dtp-times { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
        .dtp-time { height: 40px; border-radius: 10px; border: 1px solid #e8ddd4; background: #fff; font-family: 'Jost', sans-serif; font-size: 0.86rem; color: #2c1f14; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1; transition: border-color 0.15s ease, background 0.15s ease; }
        .dtp-time:hover { border-color: #c9a96e; }
        .dtp-time small { font-size: 0.62rem; color: #a08060; }
        .dtp-time.is-selected { background: #2c1f14; border-color: #2c1f14; color: #faf6f1; }
        .dtp-time.is-selected small { color: #e8c99a; }
        .dtp-empty { font-family: 'Lora', Georgia, serif; font-style: italic; font-size: 0.86rem; color: #9a8470; padding: 24px 4px; text-align: center; }
        .dtp-summary { grid-column: 1 / -1; font-family: 'Lora', Georgia, serif; font-size: 0.9rem; color: #5a4435; }
        .dtp-summary strong { color: #2c1f14; font-weight: 500; }
        .dtp-note { font-family: 'Lora', Georgia, serif; font-style: italic; font-size: 0.9rem; color: #7a5c46; background: #fdf8f2; border: 1px solid #e8ddd4; border-radius: 12px; padding: 16px; }
        .dtp-times-panel { max-height: 380px; overflow-y: auto; }
        @media (max-width: 640px) {
          .dtp { grid-template-columns: 1fr; }
          .dtp-times { grid-template-columns: repeat(3, 1fr); }
          .dtp-times-panel { max-height: none; }
        }
      `}</style>

      {/* Calendar */}
      <div className="dtp-panel">
        <div className="dtp-head">
          <button type="button" className="dtp-nav" onClick={() => shiftMonth(-1)} disabled={atFirstMonth} aria-label="Previous month">‹</button>
          <span className="dtp-month" aria-live="polite">{monthLabel}</span>
          <button type="button" className="dtp-nav" onClick={() => shiftMonth(1)} disabled={atLastMonth} aria-label="Next month">›</button>
        </div>
        <div className="dtp-grid" role="grid" aria-label={monthLabel}>
          {WEEKDAYS.map(w => <div key={w} className="dtp-wd">{w}</div>)}
          {cells.map((d, i) =>
            d === null ? (
              <div key={`blank-${i}`} />
            ) : (
              <button
                key={d}
                type="button"
                disabled={!data || !isSelectable(d)}
                onClick={() => onChange({ date: d, time: '' })}
                aria-pressed={d === date}
                aria-label={new Date(`${d}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                className={[
                  'dtp-day',
                  d === date && 'is-selected',
                  d === today && 'is-today',
                  data?.restricted && published.has(d) && 'is-open',
                ].filter(Boolean).join(' ')}
              >
                {Number(d.slice(8))}
              </button>
            )
          )}
        </div>
      </div>

      {/* Times */}
      <div className="dtp-panel dtp-times-panel">
        {!date ? (
          <p className="dtp-empty">Choose a date to see available times.</p>
        ) : groups.length === 0 ? (
          <p className="dtp-empty">No times left on this day. Please pick another date.</p>
        ) : (
          groups.map(g => (
            <div key={g.label} className="dtp-group">
              <p className="dtp-group-label">{g.label}</p>
              <div className="dtp-times">
                {g.times.map(t => {
                  const fee = feeFor(t, date)
                  return (
                    <button
                      key={t}
                      type="button"
                      className={`dtp-time${t === time ? ' is-selected' : ''}`}
                      aria-pressed={t === time}
                      onClick={() => onChange({ date, time: t })}
                    >
                      {formatTime(t)}
                      {fee && <small>{fee}</small>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {date && (
        <p className="dtp-summary" aria-live="polite">
          {time ? (
            <>Your appointment: <strong>{selectedLabel} at {formatTime(time)}</strong></>
          ) : (
            <>Selected <strong>{selectedLabel}</strong>. Now choose a time.</>
          )}
          {[0, 6].includes(new Date(`${date}T12:00:00`).getDay()) && <> · Weekend fee +£20 applies.</>}
        </p>
      )}
    </div>
  )
}
