import { ClerkFailed, ClerkLoading, SignIn } from "@clerk/nextjs";
import { ThemeToggle } from "../../theme-toggle";

export default function AdminSignInPage() {
  return (
    <main className="admin-auth">
      <section className="admin-auth-visual" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/ojono.png" alt="" />
        <div className="absolute inset-x-0 bottom-0 z-10 p-12 text-[#faf6f1]">
          <p className="admin-eyebrow !text-[#e8c99a]">Myxprecioussmua</p>
          <p className="admin-title mt-3 max-w-md !text-[#faf6f1] text-[2.6rem] leading-[1.1]">
            Studio admin
          </p>
          <p className="mt-3 max-w-sm text-sm text-[#faf6f1]/75">
            Manage availability, coupon codes and portfolio media for the website.
          </p>
        </div>
      </section>

      <section className="admin-auth-panel relative">
        <ThemeToggle className="absolute right-5 top-5" />
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <p className="admin-eyebrow">Myxprecioussmua</p>
            <h1 className="admin-title mt-2 text-[2.2rem] leading-tight">Sign in</h1>
            <p className="admin-hint mt-1">This area is for the studio team only.</p>
          </div>

          <ClerkLoading>
            <div className="admin-card animate-pulse !p-8">
              <div className="mb-4 h-10 rounded-lg bg-[var(--a-sunken)]" />
              <div className="mb-4 h-10 rounded-lg bg-[var(--a-sunken)]" />
              <div className="h-10 rounded-lg bg-[var(--a-border)]" />
            </div>
          </ClerkLoading>

          {/* Shown when Clerk's script can't load, e.g. blocked by an ad blocker or privacy setting. */}
          <ClerkFailed>
            <div className="admin-notice admin-notice-error">
              <p className="mb-1 font-medium">Sign-in couldn&apos;t load</p>
              <p>
                Something in this browser is blocking the sign-in service. Turn off ad blockers or
                privacy shields for this site, or try another browser, then reload.
              </p>
            </div>
          </ClerkFailed>

          <SignIn
            path="/admin/sign-in"
            routing="path"
            withSignUp={false}
            fallbackRedirectUrl="/admin"
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "!w-full !min-w-0 !max-w-full !shadow-none !rounded-xl border border-[var(--a-border)]",
                card: "!shadow-none !w-full !min-w-0 !px-5",
                header: "!hidden",
                formFieldInput: "!border !border-[var(--a-border-strong)] !shadow-none",
                socialButtonsBlockButton: "!border !border-[var(--a-border-strong)] !shadow-none",
                footer: "!bg-[var(--a-sunken)]",
              },
            }}
          />
        </div>
      </section>
    </main>
  );
}
