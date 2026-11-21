"use client";
import { useEffect, useState } from "react";
import { formatDate, formatTime } from "@/lib/time";
import { EmptyState, Notice, PageHeader } from "../../ui";

interface Day {
  date: string;
  times: string[];
}

// Monday first, matching UK calendars. Values are JavaScript's getDay() numbers.
const WEEKDAYS = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
];

const INTERVALS = [
  { label: "30 min", minutes: 30 },
  { label: "45 min", minutes: 45 },
  { label: "1 hour", minutes: 60 },
  { label: "1½ hours", minutes: 90 },
  { label: "2 hours", minutes: 120 },
  { label: "2½ hours", minutes: 150 },
  { label: "3 hours", minutes: 180 },
];

/** "2026-12" → "December 2026" */
function formatMonth(month: string) {
  return new Date(`${month}-01T12:00:00`).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

/** Every date in a month (as YYYY-MM-DD) that falls on one of the given weekdays. */
function datesInMonth(month: string, weekdays: number[]) {
  const [year, m] = month.split("-").map(Number);
  const count = new Date(year, m, 0).getDate();
  const dates: string[] = [];
  for (let d = 1; d <= count; d++) {
    if (weekdays.includes(new Date(year, m - 1, d).getDay())) {
      dates.push(`${month}-${String(d).padStart(2, "0")}`);
    }
  }
  return dates;
}

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const fromMinutes = (n: number) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;

/** Appointment start times from `first` to `last` (inclusive), every `every` minutes. */
function timesBetween(first: string, last: string, every: number) {
  const times: string[] = [];
  for (let t = toMinutes(first); t <= toMinutes(last); t += every) times.push(fromMinutes(t));
  return times;
}

const mergeTimes = (a: string[], b: string[]) => [...new Set([...a, ...b])].sort();

/** Edits a list of appointment start times: one at a time, or a range of working hours. */
function TimeSlots({ times, onChange }: { times: string[]; onChange: (times: string[]) => void }) {
  const [single, setSingle] = useState("");
  const [first, setFirst] = useState("09:00");
  const [last, setLast] = useState("17:00");
  const [every, setEvery] = useState(120);

  const addSingle = () => {
    if (!single) return;
    onChange(mergeTimes(times, [single]));
    setSingle("");
  };

  const range = first && last && toMinutes(first) <= toMinutes(last) ? timesBetween(first, last, every) : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {times.length === 0 && <span className="text-sm text-[var(--a-muted)]">No times yet.</span>}
        {times.map(t => (
          <span key={t} className="admin-chip">
            {formatTime(t)}
            <button aria-label={`Remove ${formatTime(t)}`} onClick={() => onChange(times.filter(x => x !== t))}>×</button>
          </span>
        ))}
        {times.length > 1 && (
          <button className="text-xs text-[var(--a-gold-deep)] underline underline-offset-4" onClick={() => onChange([])}>
            Clear all
          </button>
        )}
      </div>

      <div className="rounded-xl border border-dashed border-[var(--a-border-strong)] p-3">
        <p className="admin-label">Working hours</p>
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-xs text-[var(--a-ink-2)]">
            First appointment
            <input type="time" step={900} value={first} onChange={e => setFirst(e.target.value)} className="admin-input mt-1 w-[140px]" />
          </label>
          <label className="text-xs text-[var(--a-ink-2)]">
            Last appointment
            <input type="time" step={900} value={last} onChange={e => setLast(e.target.value)} className="admin-input mt-1 w-[140px]" />
          </label>
          <label className="text-xs text-[var(--a-ink-2)]">
            Every
            <select value={every} onChange={e => setEvery(Number(e.target.value))} className="admin-input mt-1 w-[130px]">
              {INTERVALS.map(i => (
                <option key={i.minutes} value={i.minutes}>{i.label}</option>
              ))}
            </select>
          </label>
          <button className="admin-btn-ghost" onClick={() => onChange(mergeTimes(times, range))} disabled={range.length === 0}>
            Add {range.length} time{range.length === 1 ? "" : "s"}
          </button>
        </div>
        {range.length === 0 && <p className="admin-danger mt-2 text-xs">The last appointment must be after the first.</p>}
      </div>

      <div className="flex gap-2">
        <input
          type="time"
          step={900}
          value={single}
          onChange={e => setSingle(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addSingle()}
          className="admin-input max-w-[160px]"
          aria-label="Single time to add"
        />
        <button className="admin-btn-ghost" onClick={addSingle} disabled={!single}>Add one time</button>
      </div>
    </div>
  );
}

export default function AvailabilityPage() {
  const [days, setDays] = useState<Day[]>([]);
  const [newDate, setNewDate] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  // Whole-month tool
  const [month, setMonth] = useState("");
  const [monthWeekdays, setMonthWeekdays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [monthTimes, setMonthTimes] = useState<string[]>([]);
  const [replaceExisting, setReplaceExisting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/availability")
      .then(r => r.json())
      .then(json => setDays(json.days ?? []))
      .catch(() => setMessage({ kind: "error", text: "Couldn't load availability." }))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("en-CA");
  const thisMonth = today.slice(0, 7);

  const update = (next: Day[]) => {
    setDays([...next].sort((a, b) => a.date.localeCompare(b.date)));
    setDirty(true);
    setMessage(null);
  };

  const addDay = () => {
    if (!newDate) return;
    if (days.some(d => d.date === newDate)) {
      setMessage({ kind: "error", text: "That day is already in the list." });
      return;
    }
    // Start the new day with the same times as the last day, which is the common case.
    const template = days[days.length - 1]?.times ?? [];
    update([...days, { date: newDate, times: [...template] }]);
    setEditing(newDate);
    setNewDate("");
  };

  const toggleWeekday = (value: number) =>
    setMonthWeekdays(prev => (prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]));

  const addMonth = () => {
    if (!month || monthTimes.length === 0 || monthWeekdays.length === 0) return;
    const dates = datesInMonth(month, monthWeekdays).filter(d => d >= today);
    if (dates.length === 0) {
      setMessage({ kind: "error", text: "There are no upcoming days left in that month." });
      return;
    }

    const byDate = new Map(days.map(d => [d.date, d.times]));
    for (const date of dates) {
      const existing = replaceExisting ? [] : byDate.get(date) ?? [];
      byDate.set(date, mergeTimes(existing, monthTimes));
    }
    update([...byDate.entries()].map(([date, times]) => ({ date, times })));
    setMessage({
      kind: "ok",
      text: `Added ${dates.length} day${dates.length === 1 ? "" : "s"} in ${formatMonth(month)}. Click Save changes to publish them.`,
    });
  };

  const removeMonth = (m: string) => {
    if (!confirm(`Remove every day in ${formatMonth(m)}?`)) return;
    update(days.filter(d => !d.date.startsWith(m)));
  };

  const setDayTimes = (date: string, times: string[]) =>
    update(days.map(d => (d.date === date ? { ...d, times } : d)));

  const moveDay = (from: string, to: string) => {
    if (!to || to === from) return;
    if (days.some(d => d.date === to)) {
      setMessage({ kind: "error", text: `${formatDate(to)} is already in the list. Edit that day instead.` });
      return;
    }
    update(days.map(d => (d.date === from ? { ...d, date: to } : d)));
    setEditing(to);
  };

  const removeDay = (date: string) => {
    update(days.filter(d => d.date !== date));
    if (editing === date) setEditing(null);
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");
      setDays(json.days);
      setDirty(false);
      setEditing(null);
      setMessage({ kind: "ok", text: "Saved. The booking form now shows these times." });
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof Error ? err.message : "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  // Group the list by month so a full month stays easy to scan.
  const months = [...new Set(days.map(d => d.date.slice(0, 7)))];
  const monthPreview = month && monthWeekdays.length > 0
    ? datesInMonth(month, monthWeekdays).filter(d => d >= today).length
    : 0;

  return (
    <>
      <PageHeader
        title="Availability"
        description="Clients can only request the dates and times listed here. While the list is empty, the booking form lets them pick any date and time."
      >
        <button className="admin-btn" onClick={save} disabled={saving || !dirty}>
          {saving ? "Saving…" : dirty ? "Save changes" : "All changes saved"}
        </button>
      </PageHeader>

      <Notice message={message} />

      {/* Unsaved-changes bar, so a long list never hides the save button */}
      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--a-border)] bg-[var(--a-surface)]/95 backdrop-blur">
          <div className="mx-auto flex max-w-[920px] items-center justify-between gap-4 px-4 py-3">
            <p className="text-sm text-[var(--a-ink-2)]">You have unsaved changes. Clients won&apos;t see them until you save.</p>
            <button className="admin-btn" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}

      {/* ── Whole month ── */}
      <h2 className="admin-section-title mb-3">Add a whole month</h2>
      <div className="admin-card mb-4 flex flex-col gap-5">

        <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
          <div>
            <label className="admin-label" htmlFor="month">Month</label>
            <input
              id="month"
              type="month"
              min={thisMonth}
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="admin-input"
            />
          </div>
          <div>
            <span className="admin-label">Working days</span>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map(w => {
                const on = monthWeekdays.includes(w.value);
                return (
                  <button
                    key={w.value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleWeekday(w.value)}
                    className={`h-9 w-[52px] rounded-lg border text-sm transition-colors ${
                      on
                        ? "border-[var(--a-ink)] bg-[var(--a-ink)] text-[var(--a-bg)]"
                        : "border-[var(--a-border-strong)] bg-[var(--a-surface)] text-[var(--a-muted)] hover:border-[var(--a-ink-2)]"
                    }`}
                  >
                    {w.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <span className="admin-label">Times on each day</span>
          <TimeSlots times={monthTimes} onChange={setMonthTimes} />
        </div>

        <label className="flex items-start gap-2.5 text-sm text-[var(--a-ink-2)]">
          <input type="checkbox" className="mt-0.5" checked={replaceExisting} onChange={e => setReplaceExisting(e.target.checked)} />
          <span>
            Replace times on days already listed
            <span className="admin-hint block !text-[0.8rem]">Otherwise these times are added alongside the existing ones.</span>
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--a-border)] pt-4">
          <button
            className="admin-btn"
            onClick={addMonth}
            disabled={!month || monthTimes.length === 0 || monthWeekdays.length === 0}
          >
            Add month
          </button>
          {month && (
            <span className="admin-hint">
              {monthPreview} upcoming day{monthPreview === 1 ? "" : "s"} in {formatMonth(month)}
            </span>
          )}
        </div>
      </div>

      {/* ── Single day ── */}
      <div className="admin-card mb-10 flex flex-wrap items-end gap-3">
        <div className="min-w-[180px] flex-1">
          <label className="admin-label" htmlFor="new-date">Add a single day</label>
          <input
            id="new-date"
            type="date"
            min={today}
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="admin-input"
          />
        </div>
        <button className="admin-btn-ghost" onClick={addDay} disabled={!newDate}>Add day</button>
      </div>

      {loading ? (
        <p className="admin-hint">Loading…</p>
      ) : days.length === 0 ? (
        <EmptyState title="No days added yet">Add a whole month or a single day above, then save.</EmptyState>
      ) : (
        <div className={`flex flex-col gap-10 ${dirty ? "pb-20" : ""}`}>
          {months.map(m => (
            <section key={m}>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h2 className="admin-title text-[1.6rem] leading-tight">{formatMonth(m)}</h2>
                  <p className="admin-hint !text-[0.8rem]">
                    {days.filter(d => d.date.startsWith(m)).length} days
                  </p>
                </div>
                <button className="admin-btn-ghost admin-btn-sm admin-danger" onClick={() => removeMonth(m)}>
                  Remove month
                </button>
              </div>
              <div className="admin-card overflow-hidden !p-0">
                {days.filter(d => d.date.startsWith(m)).map(day =>
                  editing === day.date ? (
                    <div key={day.date} className="flex flex-col gap-4 border-b border-[var(--a-border)] bg-[var(--a-sunken)] p-5 shadow-[inset_3px_0_0_var(--a-gold)] last:border-0">
                      <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                          <label className="admin-label" htmlFor={`date-${day.date}`}>Date</label>
                          <input
                            id={`date-${day.date}`}
                            type="date"
                            min={today}
                            value={day.date}
                            onChange={e => moveDay(day.date, e.target.value)}
                            className="admin-input w-[180px]"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button className="admin-btn-ghost admin-danger" onClick={() => removeDay(day.date)}>
                            Remove day
                          </button>
                          <button className="admin-btn" onClick={() => setEditing(null)}>Done</button>
                        </div>
                      </div>
                      <TimeSlots times={day.times} onChange={times => setDayTimes(day.date, times)} />
                    </div>
                  ) : (
                    <div
                      key={day.date}
                      className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--a-border)] px-5 py-3 last:border-0"
                    >
                      <span className="w-[140px] shrink-0 text-sm font-medium">{formatDate(day.date)}</span>
                      <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                        {day.times.length === 0 ? (
                          <span className="admin-hint">No times, so hidden from clients</span>
                        ) : (
                          day.times.map(t => (
                            <span key={t} className="admin-tag">{formatTime(t)}</span>
                          ))
                        )}
                      </div>
                      <button className="admin-btn-ghost admin-btn-sm" onClick={() => setEditing(day.date)}>Edit</button>
                    </div>
                  )
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
