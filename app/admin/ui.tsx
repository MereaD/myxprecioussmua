// Small building blocks shared by the admin pages.

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="admin-page-header">
      <div className="max-w-xl">
        <h1 className="admin-title text-[2.1rem] leading-tight">{title}</h1>
        {description && <p className="admin-hint mt-1.5">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </header>
  );
}

export function Notice({ message }: { message: { kind: "ok" | "error"; text: string } | null }) {
  if (!message) return null;
  return (
    <p role="status" className={`admin-notice mb-5 ${message.kind === "error" ? "admin-notice-error" : "admin-notice-ok"}`}>
      {message.text}
    </p>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--a-border-strong)] px-6 py-10 text-center">
      <p className="admin-section-title">{title}</p>
      {children && <p className="admin-hint mx-auto mt-1 max-w-sm">{children}</p>}
    </div>
  );
}
