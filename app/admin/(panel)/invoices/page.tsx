"use client";
import { useEffect, useState } from "react";
import {
  invoiceTotals,
  longDate,
  money,
  nextInvoiceNumber,
  PRICE_LIST,
  type Invoice,
  type InvoiceItem,
} from "@/lib/invoice";
import { EmptyState, Notice, PageHeader } from "../../ui";

type Message = { kind: "ok" | "error"; text: string } | null;

const STATUS = {
  draft: { label: "Draft", className: "admin-tag-muted" },
  sent: { label: "Sent", className: "" },
  paid: { label: "Paid", className: "admin-tag-success" },
} as const;

const isoToday = () => new Date().toLocaleDateString("en-CA");
const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-CA");
};

function newInvoice(existing: Invoice[]): Invoice {
  const latest = [...existing].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const today = isoToday();
  return {
    id: "",
    number: nextInvoiceNumber(existing),
    status: "draft",
    issueDate: today,
    dueDate: addDays(today, 7),
    client: { name: "", email: "", phone: "", address: "" },
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
    discount: 0,
    depositPaid: 35,
    notes: "",
    // Reuse the last invoice's payment details so bank info is only typed once.
    paymentDetails: latest?.paymentDetails ?? "",
    updatedAt: "",
  };
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Invoice | null>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState<"pdf" | "docx" | null>(null);
  const [message, setMessage] = useState<Message>(null);

  useEffect(() => {
    fetch("/api/admin/invoices")
      .then(r => r.json())
      .then(json => setInvoices(json.invoices ?? []))
      .catch(() => setMessage({ kind: "error", text: "Couldn't load invoices." }))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...invoices].sort((a, b) => b.number.localeCompare(a.number, undefined, { numeric: true }));

  // ── Editing helpers ──
  const set = <K extends keyof Invoice>(key: K, value: Invoice[K]) => setDraft(d => (d ? { ...d, [key]: value } : d));
  const setClient = (key: keyof Invoice["client"], value: string) =>
    setDraft(d => (d ? { ...d, client: { ...d.client, [key]: value } } : d));
  const setItem = (index: number, patch: Partial<InvoiceItem>) =>
    setDraft(d => (d ? { ...d, items: d.items.map((it, i) => (i === index ? { ...it, ...patch } : it)) } : d));
  const addItem = (item: InvoiceItem = { description: "", quantity: 1, unitPrice: 0 }) =>
    setDraft(d => {
      if (!d) return d;
      // Replace the starting blank line instead of leaving it empty above.
      const items = d.items.length === 1 && !d.items[0].description && !d.items[0].unitPrice ? [] : d.items;
      return { ...d, items: [...items, { ...item }] };
    });
  const removeItem = (index: number) => setDraft(d => (d ? { ...d, items: d.items.filter((_, i) => i !== index) } : d));

  const openNew = () => {
    setMessage(null);
    setDraft(newInvoice(invoices));
  };

  const save = async (invoice: Invoice, okText = "Invoice saved.") => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");
      setInvoices(prev =>
        prev.some(i => i.id === json.invoice.id)
          ? prev.map(i => (i.id === json.invoice.id ? json.invoice : i))
          : [json.invoice, ...prev]
      );
      if (draft && (draft.id === json.invoice.id || !draft.id)) setDraft(json.invoice);
      setMessage({ kind: "ok", text: okText });
      return true;
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof Error ? err.message : "Failed to save" });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (inv: Invoice) => {
    if (!confirm(`Delete invoice ${inv.number}? This can't be undone.`)) return;
    const res = await fetch("/api/admin/invoices", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: inv.id }),
    });
    if (res.ok) {
      setInvoices(prev => prev.filter(i => i.id !== inv.id));
      if (draft?.id === inv.id) setDraft(null);
      setMessage({ kind: "ok", text: `Invoice ${inv.number} deleted.` });
    } else {
      setMessage({ kind: "error", text: "Couldn't delete the invoice." });
    }
  };

  const exportFile = async (inv: Invoice, format: "pdf" | "docx") => {
    setExporting(format);
    try {
      const { downloadInvoice } = await import("@/lib/invoice-export");
      await downloadInvoice(inv, format);
    } catch (err) {
      console.error(err);
      setMessage({ kind: "error", text: `Couldn't create the ${format === "pdf" ? "PDF" : "Word"} file.` });
    } finally {
      setExporting(null);
    }
  };

  // ── Editor ──
  if (draft) {
    const t = invoiceTotals(draft);
    const busy = saving || exporting !== null;

    return (
      <>
        <PageHeader
          title={draft.id ? `Invoice ${draft.number}` : "New invoice"}
          description={draft.id ? `Last saved ${new Date(draft.updatedAt).toLocaleString("en-GB")}` : "Fill in the details, then save or download."}
        >
          <button className="admin-btn-ghost" onClick={() => { setDraft(null); setMessage(null); }}>
            Back to invoices
          </button>
        </PageHeader>

        <Notice message={message} />

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-6">
            {/* Details */}
            <section className="admin-card">
              <h2 className="admin-section-title mb-4">Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="admin-label" htmlFor="inv-number">Invoice number</label>
                  <input id="inv-number" className="admin-input" value={draft.number} onChange={e => set("number", e.target.value)} />
                </div>
                <div>
                  <label className="admin-label" htmlFor="inv-status">Status</label>
                  <select id="inv-status" className="admin-input" value={draft.status} onChange={e => set("status", e.target.value as Invoice["status"])}>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label" htmlFor="inv-issue">Issue date</label>
                  <input id="inv-issue" type="date" className="admin-input" value={draft.issueDate} onChange={e => set("issueDate", e.target.value)} />
                </div>
                <div>
                  <label className="admin-label" htmlFor="inv-due">Due date</label>
                  <input id="inv-due" type="date" className="admin-input" value={draft.dueDate} onChange={e => set("dueDate", e.target.value)} />
                </div>
                <div>
                  <label className="admin-label" htmlFor="inv-event">Appointment date <span className="font-normal text-[var(--a-muted)]">(optional)</span></label>
                  <input id="inv-event" type="date" className="admin-input" value={draft.eventDate ?? ""} onChange={e => set("eventDate", e.target.value || undefined)} />
                </div>
              </div>
            </section>

            {/* Client */}
            <section className="admin-card">
              <h2 className="admin-section-title mb-4">Bill to</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="admin-label" htmlFor="c-name">Client name</label>
                  <input id="c-name" className="admin-input" value={draft.client.name} onChange={e => setClient("name", e.target.value)} />
                </div>
                <div>
                  <label className="admin-label" htmlFor="c-email">Email</label>
                  <input id="c-email" type="email" className="admin-input" value={draft.client.email} onChange={e => setClient("email", e.target.value)} />
                </div>
                <div>
                  <label className="admin-label" htmlFor="c-phone">Phone</label>
                  <input id="c-phone" className="admin-input" value={draft.client.phone} onChange={e => setClient("phone", e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="admin-label" htmlFor="c-address">Address</label>
                  <textarea
                    id="c-address"
                    rows={3}
                    className="admin-input !h-auto py-2.5"
                    value={draft.client.address}
                    onChange={e => setClient("address", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Items */}
            <section className="admin-card !p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-3 pt-5">
                <h2 className="admin-section-title">Items</h2>
                <select
                  className="admin-input !h-9 !w-auto text-sm"
                  value=""
                  onChange={e => {
                    const item = PRICE_LIST[Number(e.target.value)];
                    if (item) addItem(item);
                  }}
                  aria-label="Add from price list"
                >
                  <option value="" disabled>Add from price list…</option>
                  {PRICE_LIST.map((p, i) => (
                    <option key={p.description} value={i}>
                      {p.description}{p.unitPrice ? ` · ${money(p.unitPrice)}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-y border-[var(--a-border)] text-left text-[var(--a-muted)]">
                      <th className="px-5 py-2.5 font-medium">Description</th>
                      <th className="w-20 px-2 py-2.5 text-right font-medium">Qty</th>
                      <th className="w-28 px-2 py-2.5 text-right font-medium">Unit price</th>
                      <th className="w-24 px-2 py-2.5 text-right font-medium">Amount</th>
                      <th className="w-12 py-2.5 pr-5"><span className="sr-only">Remove</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.items.map((item, i) => (
                      <tr key={i} className="border-b border-[var(--a-border)]">
                        <td className="py-2 pl-5 pr-2">
                          <input
                            className="admin-input !h-9"
                            placeholder="e.g. Bridal makeup"
                            value={item.description}
                            onChange={e => setItem(i, { description: e.target.value })}
                            aria-label={`Item ${i + 1} description`}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min={0}
                            step={1}
                            className="admin-input !h-9 text-right tabular-nums"
                            value={item.quantity}
                            onChange={e => setItem(i, { quantity: Number(e.target.value) })}
                            aria-label={`Item ${i + 1} quantity`}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            className="admin-input !h-9 text-right tabular-nums"
                            value={item.unitPrice}
                            onChange={e => setItem(i, { unitPrice: Number(e.target.value) })}
                            aria-label={`Item ${i + 1} unit price`}
                          />
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums">{money((item.quantity || 0) * (item.unitPrice || 0))}</td>
                        <td className="py-2 pr-5 text-right">
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--a-muted)] hover:bg-[var(--a-danger-bg)] hover:text-[var(--a-danger)]"
                            onClick={() => removeItem(i)}
                            aria-label={`Remove item ${i + 1}`}
                            disabled={draft.items.length === 1}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3">
                <button className="admin-btn-ghost admin-btn-sm" onClick={() => addItem()}>Add line</button>
              </div>
            </section>

            {/* Adjustments + text */}
            <section className="admin-card grid gap-4 sm:grid-cols-2">
              <div>
                <label className="admin-label" htmlFor="inv-discount">Discount (£)</label>
                <input
                  id="inv-discount"
                  type="number"
                  min={0}
                  step={0.01}
                  className="admin-input tabular-nums"
                  value={draft.discount}
                  onChange={e => set("discount", Number(e.target.value))}
                />
              </div>
              <div>
                <label className="admin-label" htmlFor="inv-deposit">Deposit already paid (£)</label>
                <input
                  id="inv-deposit"
                  type="number"
                  min={0}
                  step={0.01}
                  className="admin-input tabular-nums"
                  value={draft.depositPaid}
                  onChange={e => set("depositPaid", Number(e.target.value))}
                />
                <p className="admin-hint mt-1.5 !text-[0.8rem]">The £35 booking fee, if it was paid.</p>
              </div>
              <div className="sm:col-span-2">
                <label className="admin-label" htmlFor="inv-payment">Payment details</label>
                <textarea
                  id="inv-payment"
                  rows={3}
                  className="admin-input !h-auto py-2.5"
                  placeholder={"e.g. Bank transfer to Myxprecioussmua\nSort code 00-00-00 · Account 00000000"}
                  value={draft.paymentDetails}
                  onChange={e => set("paymentDetails", e.target.value)}
                />
                <p className="admin-hint mt-1.5 !text-[0.8rem]">New invoices start with whatever you used last time.</p>
              </div>
              <div className="sm:col-span-2">
                <label className="admin-label" htmlFor="inv-notes">Notes</label>
                <textarea
                  id="inv-notes"
                  rows={3}
                  className="admin-input !h-auto py-2.5"
                  placeholder="e.g. Please arrive with a clean, moisturised face."
                  value={draft.notes}
                  onChange={e => set("notes", e.target.value)}
                />
              </div>
            </section>
          </div>

          {/* Summary */}
          <aside className="admin-card flex flex-col gap-4 lg:sticky lg:top-6">
            <h2 className="admin-section-title">Summary</h2>
            <dl className="flex flex-col gap-2 text-sm tabular-nums">
              <div className="flex justify-between"><dt className="text-[var(--a-muted)]">Subtotal</dt><dd>{money(t.subtotal)}</dd></div>
              {t.discount > 0 && <div className="flex justify-between"><dt className="text-[var(--a-muted)]">Discount</dt><dd>−{money(t.discount)}</dd></div>}
              {t.discount > 0 && <div className="flex justify-between"><dt className="text-[var(--a-muted)]">Total</dt><dd>{money(t.total)}</dd></div>}
              {t.deposit > 0 && <div className="flex justify-between"><dt className="text-[var(--a-muted)]">Deposit paid</dt><dd>−{money(t.deposit)}</dd></div>}
              <div className="mt-1 flex items-baseline justify-between border-t border-[var(--a-border)] pt-3">
                <dt className="font-medium">{draft.status === "paid" ? "Paid in full" : "Balance due"}</dt>
                <dd className="admin-title text-2xl">{money(draft.status === "paid" ? 0 : t.balance)}</dd>
              </div>
            </dl>
            {t.balance < 0 && <p className="admin-notice admin-notice-error !py-2 text-xs">The deposit is more than the total.</p>}
            <button className="admin-btn w-full" onClick={() => save(draft)} disabled={busy}>
              {saving ? "Saving…" : "Save invoice"}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="admin-btn-ghost" onClick={() => exportFile(draft, "pdf")} disabled={busy}>
                {exporting === "pdf" ? "Creating…" : "PDF"}
              </button>
              <button className="admin-btn-ghost" onClick={() => exportFile(draft, "docx")} disabled={busy}>
                {exporting === "docx" ? "Creating…" : "Word"}
              </button>
            </div>
            <p className="admin-hint !text-[0.78rem]">Downloads use what&apos;s on screen, even before saving.</p>
          </aside>
        </div>
      </>
    );
  }

  // ── List ──
  const outstanding = invoices
    .filter(i => i.status === "sent")
    .reduce((sum, i) => sum + invoiceTotals(i).balance, 0);

  return (
    <>
      <PageHeader title="Invoices" description="Create invoices for clients and download them as PDF or Word.">
        <button className="admin-btn" onClick={openNew}>New invoice</button>
      </PageHeader>

      <Notice message={message} />

      {invoices.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="admin-card">
            <p className="admin-hint">Invoices</p>
            <p className="admin-title mt-1 text-[2rem] leading-none tabular-nums">{invoices.length}</p>
          </div>
          <div className="admin-card">
            <p className="admin-hint">Awaiting payment</p>
            <p className="admin-title mt-1 text-[2rem] leading-none tabular-nums">{invoices.filter(i => i.status === "sent").length}</p>
          </div>
          <div className="admin-card">
            <p className="admin-hint">Outstanding</p>
            <p className="admin-title mt-1 text-[2rem] leading-none tabular-nums">{money(outstanding)}</p>
          </div>
        </div>
      )}

      {loading ? (
        <p className="admin-hint">Loading…</p>
      ) : invoices.length === 0 ? (
        <EmptyState title="No invoices yet">Create your first invoice with the New invoice button.</EmptyState>
      ) : (
        <div className="admin-card overflow-x-auto !p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--a-border)] text-[var(--a-muted)]">
                <th className="px-5 py-3 font-medium">Number</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Issued</th>
                <th className="px-5 py-3 text-right font-medium">Balance</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(inv => {
                const t = invoiceTotals(inv);
                return (
                  <tr key={inv.id} className="border-b border-[var(--a-border)] last:border-0">
                    <td className="px-5 py-3">
                      <button className="font-medium hover:underline" onClick={() => { setMessage(null); setDraft(inv); }}>
                        {inv.number}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-[var(--a-ink-2)]">{inv.client.name}</td>
                    <td className="px-5 py-3 tabular-nums text-[var(--a-ink-2)]">{longDate(inv.issueDate)}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{money(inv.status === "paid" ? 0 : t.balance)}</td>
                    <td className="px-5 py-3">
                      <span className={`admin-tag ${STATUS[inv.status].className}`}>{STATUS[inv.status].label}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button className="admin-btn-ghost admin-btn-sm" onClick={() => exportFile(inv, "pdf")} disabled={exporting !== null}>PDF</button>
                        <button className="admin-btn-ghost admin-btn-sm" onClick={() => exportFile(inv, "docx")} disabled={exporting !== null}>Word</button>
                        <button className="admin-btn-ghost admin-btn-sm" onClick={() => { setMessage(null); setDraft(inv); }}>Edit</button>
                        <button className="admin-btn-ghost admin-btn-sm admin-danger" onClick={() => remove(inv)}>Delete</button>
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
