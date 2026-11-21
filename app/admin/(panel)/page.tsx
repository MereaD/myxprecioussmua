import Link from "next/link";
import { getBookings, getCoupons, getOpenAvailability, getPortfolioEntries, todayISO } from "@/lib/store";
import { formatDate, formatTime } from "@/lib/time";
import { BOOKING_STATUS, serviceLabel } from "@/lib/booking";
import { PageHeader } from "../ui";

export default async function AdminDashboard() {
  const [days, coupons, entries, bookings] = await Promise.all([
    getOpenAvailability(),
    getCoupons(),
    getPortfolioEntries(),
    getBookings(),
  ]);

  const today = todayISO();
  const liveCoupons = coupons.filter(c => c.active && (!c.expiresAt || c.expiresAt >= today));
  const slotCount = days.reduce((n, d) => n + d.times.length, 0);
  const newRequests = bookings.filter(b => b.status === "new").length;
  const upcoming = bookings
    .filter(b => b.date >= today && (b.status === "new" || b.status === "confirmed"))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 6);

  const stats = [
    {
      href: "/admin/bookings",
      label: "New requests",
      value: newRequests,
      detail: newRequests === 0 ? "All caught up" : "Waiting for your reply",
    },
    {
      href: "/admin/availability",
      label: "Open days",
      value: days.length,
      detail: days.length === 0 ? "Clients can request any date" : `${slotCount} times still free`,
    },
    {
      href: "/admin/coupons",
      label: "Live coupons",
      value: liveCoupons.length,
      detail: `${coupons.length} in total`,
    },
    {
      href: "/admin/media",
      label: "Portfolio uploads",
      value: entries.length,
      detail: "Shown first on the Portfolio page",
    },
  ];

  return (
    <>
      <PageHeader title="Overview" description="Bookings and what clients currently see on the website." />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <Link
            key={s.href}
            href={s.href}
            className="admin-card group block no-underline transition-colors hover:border-[var(--a-border-strong)]"
          >
            <p className="admin-hint">{s.label}</p>
            <p className="admin-title mt-1 text-[2.4rem] leading-none tabular-nums">{s.value}</p>
            <p className="admin-hint mt-2 !text-[0.8rem]">{s.detail}</p>
          </Link>
        ))}
      </div>

      <section className="admin-card !p-0">
        <div className="flex items-center justify-between border-b border-[var(--a-border)] px-5 py-4">
          <h2 className="admin-section-title">Upcoming appointments</h2>
          <Link href="/admin/bookings" className="admin-link text-sm">All bookings</Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="admin-hint px-5 py-6">No upcoming appointments yet.</p>
        ) : (
          <ul>
            {upcoming.map(b => (
              <li
                key={b.id}
                className="flex flex-wrap items-center gap-x-6 gap-y-1 border-b border-[var(--a-border)] px-5 py-3 last:border-0"
              >
                <span className="w-[200px] text-sm font-medium tabular-nums">
                  {formatDate(b.date)} · {formatTime(b.time)}
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  {b.fullName} <span className="text-[var(--a-muted)]">· {serviceLabel(b)}</span>
                </span>
                <span className={`admin-tag ${b.status === "new" ? "admin-tag-new" : "admin-tag-success"}`}>
                  {BOOKING_STATUS[b.status].label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
