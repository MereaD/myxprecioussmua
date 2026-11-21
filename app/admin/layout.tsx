import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { themeScript } from "./theme-toggle";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin · Myxprecioussmua",
  robots: { index: false, follow: false },
};

// Clerk is only mounted here, so it never loads on the public site.
// Its colours point at the admin theme variables, so sign-in follows light/dark mode.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/admin/sign-in"
      signInFallbackRedirectUrl="/admin"
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorPrimary: "var(--a-ink)",
          colorPrimaryForeground: "var(--a-bg)",
          colorForeground: "var(--a-ink)",
          colorMutedForeground: "var(--a-muted)",
          colorBackground: "var(--a-surface)",
          colorInput: "var(--a-surface)",
          colorInputForeground: "var(--a-ink)",
          colorNeutral: "var(--a-ink)",
          colorDanger: "var(--a-danger)",
          colorBorder: "var(--a-border-strong)",
          borderRadius: "8px",
          fontFamily: "Jost, system-ui, sans-serif",
          fontSize: "15px",
        },
      }}
    >
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <div className="admin-root">{children}</div>
    </ClerkProvider>
  );
}
