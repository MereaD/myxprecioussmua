import Link from "next/link";
import { getCoupons, getPortfolioEntries, getUpcomingAvailability, todayISO } from "@/lib/store";
import { formatDate, formatTime } from "@/lib/time";
import { PageHeader } from "../ui";

export default async function AdminDashboard() {
  const [days, coupons, entries] = await Promise.all([
    getUpcomingAvailability(),
    getCoupons(),
    getPortfolioEntries(),
  ]);

  const today = todayISO();
  const liveCoupons = coupons.filter(c => c.active && (!c.expiresAt || c.expiresAt >= today));
  const slotCount = days.reduce((n, d) => n + d.times.length, 0);
  const nextDays = days.slice(0, 5);

  const stats = [
    {
      href: "/admin/availability",
      label: "Open days",
      value: days.length,
      detail: days.length === 0 ? "Clients can request any date" : `${slotCount} appointment times`,
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
      <PageHeader title="Overview" description="What clients currently see on the website." />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
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
          <h2 className="admin-section-title">Next available days</h2>
          <Link href="/admin/availability" className="admin-link text-sm">Manage</Link>
        </div>
        {nextDays.length === 0 ? (
          <p className="admin-hint px-5 py-6">
            No days published. The booking form currently lets clients choose any date and time.
          </p>
        ) : (
          <ul>
            {nextDays.map(d => (
              <li
                key={d.date}
                className="flex flex-wrap items-center gap-x-6 gap-y-1 border-b border-[var(--a-border)] px-5 py-3 last:border-0"
              >
                <span className="w-[150px] text-sm font-medium">{formatDate(d.date)}</span>
                <span className="admin-hint tabular-nums">{d.times.map(formatTime).join(" · ")}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
