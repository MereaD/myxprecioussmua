"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const icon = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const LINKS = [
  { href: "/admin", label: "Overview", icon: icon("M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z") },
  { href: "/admin/availability", label: "Availability", icon: icon("M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z") },
  { href: "/admin/coupons", label: "Coupons", icon: icon("M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Zm10-2v12") },
  { href: "/admin/invoices", label: "Invoices", icon: icon("M7 3h8l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8 0v4h4M9.5 12h5M9.5 16h5") },
  { href: "/admin/media", label: "Portfolio", icon: icon("M4 5h16v14H4zM4 15l4.5-4.5 4 4L15 12l5 5M15.5 8.5h.01") },
  { href: "/admin/library", label: "Library", icon: icon("M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z") },
];

export function AdminNav({ direction = "column" }: { direction?: "column" | "row" }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin"
      className={direction === "column" ? "flex flex-col gap-1" : "flex gap-1 overflow-x-auto px-3 pb-2"}
    >
      {LINKS.map(link => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link key={link.href} href={link.href} className="admin-nav-link" aria-current={active ? "page" : undefined}>
            {link.icon}
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
