"use client";
import { useEffect, useState } from "react";
import { EmptyState, Notice, PageHeader } from "../../ui";

interface Coupon {
  code: string;
  description: string;
  active: boolean;
  expiresAt?: string;
}

const blank: Coupon = { code: "", description: "", active: true, expiresAt: "" };

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [draft, setDraft] = useState<Coupon>(blank);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/coupons")
      .then(r => r.json())
      .then(json => setCoupons(json.coupons ?? []))
      .catch(() => setMessage({ kind: "error", text: "Couldn't load coupons." }))
      .finally(() => setLoading(false));
  }, []);

  // Every change is saved straight away, so the list always matches what clients see.
  const persist = async (next: Coupon[], okText: string) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coupons: next }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");
      setCoupons(json.coupons);
      setMessage({ kind: "ok", text: okText });
      return true;
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof Error ? err.message : "Failed to save" });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const addCoupon = async () => {
    const code = draft.code.trim().toUpperCase();
    if (!code) return;
    if (coupons.some(c => c.code === code)) {
      setMessage({ kind: "error", text: `${code} already exists.` });
      return;
    }
    const ok = await persist([{ ...draft, code }, ...coupons], `${code} added.`);
    if (ok) setDraft(blank);
  };

  const toggle = (code: string) => {
    const next = coupons.map(c => (c.code === code ? { ...c, active: !c.active } : c));
    const nowActive = next.find(c => c.code === code)?.active;
    persist(next, `${code} ${nowActive ? "turned on" : "paused"}.`);
  };

  const remove = (code: string) => {
    if (!confirm(`Delete ${code}? Clients will no longer be able to use it.`)) return;
    persist(coupons.filter(c => c.code !== code), `${code} deleted.`);
  };

  const today = new Date().toLocaleDateString("en-CA");

  return (
    <>
      <PageHeader
        title="Coupons"
        description={<>Codes clients can enter on the booking form. Paused or expired codes show as &ldquo;not recognised&rdquo;.</>}
      />

      <h2 className="admin-section-title mb-3">New coupon</h2>
      <div className="admin-card mb-8 grid gap-4 sm:grid-cols-[1fr_1.4fr_1fr_auto] sm:items-end">
        <div>
          <label className="admin-label" htmlFor="code">Code</label>
          <input
            id="code"
            className="admin-input uppercase"
            placeholder="SUMMER20"
            value={draft.code}
            onChange={e => setDraft({ ...draft, code: e.target.value.toUpperCase().replace(/\s/g, "") })}
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="description">Note (optional)</label>
          <input
            id="description"
            className="admin-input"
            placeholder="e.g. 20% off occasion makeup"
            value={draft.description}
            onChange={e => setDraft({ ...draft, description: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="expires">Last day (optional)</label>
          <input
            id="expires"
            type="date"
            min={today}
            className="admin-input"
            value={draft.expiresAt}
            onChange={e => setDraft({ ...draft, expiresAt: e.target.value })}
          />
        </div>
        <button className="admin-btn" onClick={addCoupon} disabled={saving || !draft.code.trim()}>
          Add coupon
        </button>
      </div>

      <Notice message={message} />

      <h2 className="admin-section-title mb-3">All coupons</h2>
      {loading ? (
        <p className="admin-hint">Loading…</p>
      ) : coupons.length === 0 ? (
        <EmptyState title="No coupons yet">Create one above and share the code with clients.</EmptyState>
      ) : (
        <div className="admin-card overflow-x-auto !p-0">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--a-border)] text-[var(--a-muted)]">
                <th className="px-5 py-3 font-medium">Code</th>
                <th className="px-5 py-3 font-medium">Note</th>
                <th className="px-5 py-3 font-medium">Ends</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => {
                const expired = Boolean(c.expiresAt && c.expiresAt < today);
                const status = expired ? "Expired" : c.active ? "Active" : "Paused";
                return (
                  <tr key={c.code} className="border-b border-[var(--a-border)] last:border-0">
                    <td className="px-5 py-3 font-medium tracking-wide">{c.code}</td>
                    <td className="px-5 py-3 text-[var(--a-ink-2)]">{c.description || <span className="text-[var(--a-muted)]">—</span>}</td>
                    <td className="px-5 py-3 tabular-nums text-[var(--a-ink-2)]">
                      {c.expiresAt ? new Date(`${c.expiresAt}T12:00:00`).toLocaleDateString("en-GB") : <span className="text-[var(--a-muted)]">No end date</span>}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`admin-tag ${status === "Active" ? "admin-tag-success" : "admin-tag-muted"}`}>{status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button className="admin-btn-ghost admin-btn-sm" onClick={() => toggle(c.code)} disabled={saving || expired}>
                          {c.active ? "Pause" : "Resume"}
                        </button>
                        <button className="admin-btn-ghost admin-btn-sm admin-danger" onClick={() => remove(c.code)} disabled={saving}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
