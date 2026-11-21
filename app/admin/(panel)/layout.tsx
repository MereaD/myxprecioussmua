import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { checkAdmin } from "@/lib/admin";
import { redis } from "@/lib/redis";
import { cloudinaryConfigured } from "@/lib/cloudinary";
import { AdminNav } from "./nav";
import { ThemeToggle } from "../theme-toggle";

function Brand() {
  return (
    <Link href="/admin" className="block no-underline">
      <span className="admin-title block text-[1.35rem] leading-none">Myxprecioussmua</span>
      <span className="admin-eyebrow mt-1.5 block !text-[0.65rem]">Studio admin</span>
    </Link>
  );
}

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await checkAdmin();
  if (admin.status === "signed-out") redirect("/admin/sign-in");

  if (admin.status === "forbidden") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="admin-card w-full max-w-sm !p-8">
          <p className="admin-eyebrow mb-3">Myxprecioussmua</p>
          <h1 className="admin-title mb-2 text-3xl">No access</h1>
          <p className="admin-hint mb-6">
            {admin.email ?? "This account"} isn&apos;t an admin. Ask the site owner to give your
            account the admin role, then sign in again.
          </p>
          <SignOutButton redirectUrl="/admin/sign-in">
            <button className="admin-btn w-full">Sign out</button>
          </SignOutButton>
        </div>
      </main>
    );
  }

  const missing = [
    !redis && "Upstash Redis",
    !cloudinaryConfigured() && "Cloudinary",
  ].filter(Boolean);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="mb-8 px-2.5">
          <Brand />
        </div>
        <AdminNav />
        <div className="mt-auto flex flex-col gap-3 border-t border-[var(--a-border)] pt-4">
          <a href="/" target="_blank" rel="noreferrer" className="admin-nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
            </svg>
            View website
          </a>
          <div className="flex items-center gap-3 px-2.5">
            <UserButton />
            <span className="min-w-0 flex-1 truncate text-sm text-[var(--a-muted)]">{admin.email}</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <div className="admin-mobile-bar">
        <div className="flex items-center justify-between px-4 py-3">
          <Brand />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
        <AdminNav direction="row" />
      </div>

      <main className="admin-main">
        <div className="admin-content">
          {missing.length > 0 && (
            <p className="admin-notice admin-notice-error mb-6">
              {missing.join(" and ")} {missing.length > 1 ? "aren't" : "isn't"} connected, so changes
              can&apos;t be saved. Add the environment variables in Vercel and redeploy.
            </p>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
