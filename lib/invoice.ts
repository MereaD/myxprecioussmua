// Invoice model and maths, shared by the admin page, the API and the PDF/Word exports.

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number; // pounds
}

export interface Invoice {
  id: string;
  number: string; // e.g. INV-0007
  status: "draft" | "sent" | "paid";
  issueDate: string; // YYYY-MM-DD
  dueDate: string;
  eventDate?: string;
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: InvoiceItem[];
  discount: number; // pounds off the subtotal
  depositPaid: number; // pounds already paid, e.g. the £35 booking fee
  notes: string;
  paymentDetails: string;
  updatedAt: string;
}

export const BUSINESS = {
  name: "Myxprecioussmua",
  tagline: "Makeup artistry · Milton Keynes",
  email: "myxprecioussmua@outlook.com",
  phone: "07496837465",
};

/** Services and fees from the website, for adding line items quickly. */
export const PRICE_LIST: InvoiceItem[] = [
  { description: "Bridal makeup", quantity: 1, unitPrice: 0 },
  { description: "Bridal preview (trial)", quantity: 1, unitPrice: 70 },
  { description: "Occasion makeup", quantity: 1, unitPrice: 70 },
  { description: "Early morning fee (6am – 8am)", quantity: 1, unitPrice: 15 },
  { description: "Weekend fee", quantity: 1, unitPrice: 20 },
  { description: "After 6pm fee", quantity: 1, unitPrice: 10 },
  { description: "Same day booking fee", quantity: 1, unitPrice: 15 },
  { description: "Travel outside Milton Keynes", quantity: 1, unitPrice: 0 },
];

const round = (n: number) => Math.round(n * 100) / 100;

export function invoiceTotals(inv: Pick<Invoice, "items" | "discount" | "depositPaid">) {
  const subtotal = round(inv.items.reduce((sum, i) => sum + (i.quantity || 0) * (i.unitPrice || 0), 0));
  const discount = round(Math.min(Math.max(inv.discount || 0, 0), subtotal));
  const total = round(subtotal - discount);
  const deposit = round(Math.max(inv.depositPaid || 0, 0));
  const balance = round(total - deposit);
  return { subtotal, discount, total, deposit, balance };
}

export const money = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

/** "2026-12-05" → "5 December 2026" */
export const longDate = (d: string) =>
  new Date(`${d}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

/** The next number after the highest existing one, e.g. INV-0007 → INV-0008. */
export function nextInvoiceNumber(existing: { number: string }[]) {
  const highest = existing.reduce((max, inv) => {
    const n = Number(inv.number.match(/(\d+)\s*$/)?.[1] ?? 0);
    return Math.max(max, n);
  }, 0);
  return `INV-${String(highest + 1).padStart(4, "0")}`;
}
