import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/admin";
import { getInvoices, saveInvoices } from "@/lib/store";
import type { Invoice, InvoiceItem } from "@/lib/invoice";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const text = (v: unknown, max: number) => String(v ?? "").slice(0, max);
const amount = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
};

function clean(raw: Partial<Invoice>): Invoice | string {
  const number = text(raw.number, 30).trim();
  if (!number) return "Give the invoice a number.";
  if (!raw.issueDate || !DATE.test(raw.issueDate)) return "Choose an issue date.";
  if (!raw.dueDate || !DATE.test(raw.dueDate)) return "Choose a due date.";
  if (!text(raw.client?.name, 120).trim()) return "Add the client's name.";

  const items: InvoiceItem[] = (Array.isArray(raw.items) ? raw.items : [])
    .slice(0, 50)
    .map(i => ({
      description: text(i?.description, 200),
      quantity: Math.max(0, amount(i?.quantity)),
      unitPrice: Math.max(0, amount(i?.unitPrice)),
    }))
    .filter(i => i.description.trim());
  if (items.length === 0) return "Add at least one line item.";

  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : randomUUID(),
    number,
    status: raw.status === "sent" || raw.status === "paid" ? raw.status : "draft",
    issueDate: raw.issueDate,
    dueDate: raw.dueDate,
    ...(raw.eventDate && DATE.test(raw.eventDate) ? { eventDate: raw.eventDate } : {}),
    client: {
      name: text(raw.client?.name, 120).trim(),
      email: text(raw.client?.email, 160).trim(),
      phone: text(raw.client?.phone, 40).trim(),
      address: text(raw.client?.address, 400),
    },
    items,
    discount: Math.max(0, amount(raw.discount)),
    depositPaid: Math.max(0, amount(raw.depositPaid)),
    notes: text(raw.notes, 1000),
    paymentDetails: text(raw.paymentDetails, 600),
    updatedAt: new Date().toISOString(),
  };
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ invoices: await getInvoices() });
}

// PUT { invoice } → create or update
export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { invoice } = await req.json();
    const cleaned = clean(invoice ?? {});
    if (typeof cleaned === "string") return NextResponse.json({ error: cleaned }, { status: 400 });

    const invoices = await getInvoices();
    if (invoices.some(i => i.number === cleaned.number && i.id !== cleaned.id)) {
      return NextResponse.json({ error: `Invoice ${cleaned.number} already exists.` }, { status: 400 });
    }
    const next = invoices.some(i => i.id === cleaned.id)
      ? invoices.map(i => (i.id === cleaned.id ? cleaned : i))
      : [cleaned, ...invoices];

    await saveInvoices(next);
    return NextResponse.json({ invoice: cleaned });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save the invoice" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await req.json();
    const invoices = await getInvoices();
    await saveInvoices(invoices.filter(i => i.id !== id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete the invoice" }, { status: 500 });
  }
}
