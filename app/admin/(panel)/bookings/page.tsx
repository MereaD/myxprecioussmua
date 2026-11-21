"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BOOKING_STATUS, serviceLabel, type Booking, type BookingStatus } from "@/lib/booking";
import { formatDate, formatTime } from "@/lib/time";
import { EmptyState, Notice, PageHeader } from "../../ui";

type Filter = "upcoming" | "new" | "past" | "all";
type Message = { kind: "ok" | "error"; text: string } | null;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "new", label: "Needs reply" },
  { id: "past", label: "Past" },
  { id: "all", label: "All" },
];

const TONE_CLASS = { new: "admin-tag-new", success: "admin-tag-success", muted: "admin-tag-muted", neutral: "" } as const;

function StatusTag({ status }: { status: BookingStatus }) {
  const s = BOOKING_STATUS[status];
  return <span className={`admin-tag ${TONE_CLASS[s.tone]}`}>{s.label}</span>;
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="admin-hint !text-[0.78rem]">{label}</dt>
      <dd className="mt-0.5 text-sm">{children}</dd>
    </div>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("upcoming");
  const [openId, setOpenId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then(r => r.json())
      .then(json => setBookings(json.bookings ?? []))
      .catch(() => setMessage({ kind: "error", text: "Couldn't load bookings." }))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("en-CA");
  const byDate = (a: Booking, b: Booking) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);

  const visible = bookings
    .filter(b => {
      if (filter === "new") return b.status === "new";
      if (filter === "upcoming") return b.date >= today && (b.status === "new" || b.status === "confirmed");
      if (filter === "past") return b.date < today || b.status === "completed";
      return true;
    })
    .sort(filter === "past" || filter === "all" ? (a, b) => byDate(b, a) : byDate);

  const newCount = bookings.filter(b => b.status === "new").length;
  const confirmedUpcoming = bookings.filter(b => b.status === "confirmed" && b.date >= today).length;
  const weekEnd = new Date(`${today}T12:00:00`);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const thisWeekEnd = weekEnd.toLocaleDateString("en-CA");
  const thisWeek = bookings.filter(b => b.status === "confirmed" && b.date >= today && b.date <= thisWeekEnd).length;

  const update = async (b: Booking, patch: { status?: BookingStatus; adminNotes?: string }, okText: string) => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b.id, ...patch }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update");
      setBookings(prev => prev.map(x => (x.id === b.id ? json.booking : x)));
      setMessage({ kind: "ok", text: okText });
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof Error ? err.message : "Failed to update" });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (b: Booking) => {
    if (!confirm(`Delete ${b.fullName}'s request? This can't be undone.`)) return;
    setBusy(true);
    const res = await fetch("/api/admin/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b.id }),
    });
    setBusy(false);
    if (res.ok) {
      setBookings(prev => prev.filter(x => x.id !== b.id));
      setOpenId(null);
      setMessage({ kind: "ok", text: "Booking deleted." });
    } else {
      setMessage({ kind: "error", text: "Couldn't delete the booking." });
    }
  };

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Appointment requests from the website. New and confirmed requests hold their time slot, so nobody else can request it."
      />

      <div className="admin-stats mb-6 grid gap-4 sm:grid-cols-3">
        <div className="admin-card">
          <p className="admin-hint">Needs reply</p>
          <p className="admin-title mt-1 text-[2rem] leading-none tabular-nums">{newCount}</p>
        </div>
        <div className="admin-card">
          <p className="admin-hint">Confirmed, upcoming</p>
          <p className="admin-title mt-1 text-[2rem] leading-none tabular-nums">{confirmedUpcoming}</p>
        </div>
        <div className="admin-card">
          <p className="admin-hint">Next 7 days</p>
          <p className="admin-title mt-1 text-[2rem] leading-none tabular-nums">{thisWeek}</p>
        </div>
      </div>

      <Notice message={message} />

      <div className="mb-4 overflow-x-auto">
        <div className="admin-tabs" role="group" aria-label="Filter bookings">
          {FILTERS.map(f => (
            <button key={f.id} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
              {f.id === "new" && newCount > 0 && <span className="ml-1.5 tabular-nums text-[var(--a-gold-deep)]">{newCount}</span>}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="admin-hint">Loading…</p>
      ) : visible.length === 0 ? (
        <EmptyState title={filter === "new" ? "You're all caught up" : "No bookings here"}>
          New requests from the Request Appointment form appear here, as well as in your email.
        </EmptyState>
      ) : (
        <div className="admin-card overflow-hidden !p-0">
          {visible.map(b => {
            const open = openId === b.id;
            const note = notes[b.id] ?? b.adminNotes;
            return (
              <div key={b.id} className="border-b border-[var(--a-border)] last:border-0">
                <button
                  className="flex w-full flex-wrap items-center gap-x-5 gap-y-1 px-5 py-3.5 text-left transition-colors hover:bg-[var(--a-sunken)]"
                  onClick={() => setOpenId(open ? null : b.id)}
                  aria-expanded={open}
                >
                  <span className="w-[150px] shrink-0">
                    <span className="block text-sm font-medium">{b.date ? formatDate(b.date) : "No date"}</span>
                    <span className="admin-hint !text-[0.8rem] tabular-nums">{b.time ? formatTime(b.time) : "No time"}</span>
                  </span>
                  <span className="min-w-[140px] flex-1">
                    <span className="block text-sm font-medium">{b.fullName}</span>
                    <span className="admin-hint !text-[0.8rem]">
                      {serviceLabel(b)}
                      {b.peopleCount > 1 ? ` · ${b.peopleCount} people` : ""}
                    </span>
                  </span>
                  <StatusTag status={b.status} />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={`text-[var(--a-muted)] transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {open && (
                  <div className="border-t border-[var(--a-border)] bg-[var(--a-sunken)]/50 px-5 py-5">
                    <dl className="mb-5 grid gap-4 sm:grid-cols-3">
                      <Detail label="Email"><a className="admin-link" href={`mailto:${b.email}`}>{b.email}</a></Detail>
                      <Detail label="Phone">{b.phone ? <a className="admin-link" href={`tel:${b.phone}`}>{b.phone}</a> : "—"}</Detail>
                      <Detail label="Requested">{new Date(b.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</Detail>
                      <Detail label="Service">{serviceLabel(b)}</Detail>
                      <Detail label="Appointment">
                        {b.appointmentType === "mobile" ? "Mobile (at client's location)" : b.appointmentType === "studio" ? "Studio" : "—"}
                      </Detail>
                      <Detail label="People">{b.peopleCount}</Detail>
                      {b.appointmentType === "mobile" && <Detail label="Location">{b.location || "—"}</Detail>}
                      {b.couponCode && (
                        <Detail label="Coupon">
                          {b.couponCode} <span className={b.couponApplied ? "text-[var(--a-success)]" : "admin-danger"}>({b.couponApplied ? "valid" : "not valid"})</span>
                        </Detail>
                      )}
                    </dl>

                    {b.additionalInfo && (
                      <div className="mb-5">
                        <p className="admin-hint mb-1 !text-[0.78rem]">Message from client</p>
                        <p className="whitespace-pre-line rounded-lg border border-[var(--a-border)] bg-[var(--a-surface)] px-4 py-3 text-sm">{b.additionalInfo}</p>
                      </div>
                    )}

                    <div className="mb-5">
                      <label className="admin-label" htmlFor={`notes-${b.id}`}>Private notes</label>
                      <textarea
                        id={`notes-${b.id}`}
                        rows={2}
                        className="admin-input !h-auto py-2.5"
                        placeholder="Only visible here, e.g. deposit received, skin type, look agreed."
                        value={note}
                        onChange={e => setNotes(prev => ({ ...prev, [b.id]: e.target.value }))}
                      />
                      {note !== b.adminNotes && (
                        <button className="admin-btn-ghost admin-btn-sm mt-2" disabled={busy} onClick={() => update(b, { adminNotes: note }, "Notes saved.")}>
                          Save notes
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 border-t border-[var(--a-border)] pt-4">
                      {b.status === "new" && (
                        <>
                          <button className="admin-btn admin-btn-sm" disabled={busy} onClick={() => update(b, { status: "confirmed" }, `${b.fullName}'s booking confirmed.`)}>
                            Confirm
                          </button>
                          <button className="admin-btn-ghost admin-btn-sm" disabled={busy} onClick={() => update(b, { status: "declined" }, "Request declined. Its time slot is free again.")}>
                            Decline
                          </button>
                        </>
                      )}
                      {b.status === "confirmed" && (
                        <>
                          <button className="admin-btn admin-btn-sm" disabled={busy} onClick={() => update(b, { status: "completed" }, "Marked as completed.")}>
                            Mark completed
                          </button>
                          <button className="admin-btn-ghost admin-btn-sm" disabled={busy} onClick={() => update(b, { status: "cancelled" }, "Booking cancelled. Its time slot is free again.")}>
                            Cancel booking
                          </button>
                        </>
                      )}
                      {(b.status === "declined" || b.status === "cancelled") && (
                        <button className="admin-btn-ghost admin-btn-sm" disabled={busy} onClick={() => update(b, { status: "new" }, "Moved back to Needs reply.")}>
                          Reopen
                        </button>
                      )}
                      <Link href={`/admin/invoices?booking=${b.id}`} className="admin-btn-ghost admin-btn-sm no-underline">
                        Create invoice
                      </Link>
                      <a className="admin-btn-ghost admin-btn-sm no-underline" href={`mailto:${b.email}?subject=${encodeURIComponent("Your appointment with Myxprecioussmua")}`}>
                        Email client
                      </a>
                      <button className="admin-btn-ghost admin-btn-sm admin-danger ml-auto" disabled={busy} onClick={() => remove(b)}>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
