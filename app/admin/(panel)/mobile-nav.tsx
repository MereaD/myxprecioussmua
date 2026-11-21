"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminNav } from "./nav";

/**
 * Phone and small-tablet navigation: a top bar with a menu button that opens
 * the admin sidebar as a drawer from the left.
 */
export function MobileNav({
  brand,
  actions,
  drawerFooter,
}: {
  brand: React.ReactNode;
  actions: React.ReactNode;
  drawerFooter: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [openedOn, setOpenedOn] = useState(pathname);

  // Close after navigating to another page.
  if (open && pathname !== openedOn) setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const toggle = () => {
    setOpenedOn(pathname);
    setOpen(o => !o);
  };

  // The drawer sits outside the bar: the bar's backdrop blur would otherwise
  // become the drawer's positioning box and trap it inside the bar.
  return (
    <>
    <div className="admin-mobile-bar">
      <div className="flex items-center gap-3 px-3 py-2.5">
        <button
          type="button"
          className="admin-btn-ghost admin-btn-sm !h-9 !w-9 !p-0"
          onClick={toggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="admin-drawer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
        <div className="min-w-0 flex-1">{brand}</div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </div>

      <div
        className={`admin-drawer-backdrop ${open ? "is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        id="admin-drawer"
        className={`admin-drawer ${open ? "is-open" : ""}`}
        aria-label="Admin menu"
        inert={!open}
      >
        <div className="mb-6 flex items-center justify-between px-2.5">
          {brand}
          <button
            type="button"
            className="admin-btn-ghost admin-btn-sm !h-8 !w-8 !p-0"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <AdminNav />
        <div className="mt-auto border-t border-[var(--a-border)] pt-4">{drawerFooter}</div>
      </aside>
    </>
  );
}
