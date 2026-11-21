// Builds invoice files in the browser. The libraries are loaded on demand,
// so they only download when someone actually exports.
import { BUSINESS, invoiceTotals, longDate, money, type Invoice } from "./invoice";

const INK: [number, number, number] = [44, 31, 20];
const BROWN: [number, number, number] = [122, 92, 70];
const GOLD: [number, number, number] = [201, 169, 110];
const LINE: [number, number, number] = [232, 221, 212];

const statusLabel = { draft: "Draft", sent: "Due", paid: "Paid" } as const;

function filename(inv: Invoice, ext: string) {
  const client = inv.client.name.replace(/[^\w -]/g, "").trim().replace(/\s+/g, "-");
  return `${inv.number}${client ? `-${client}` : ""}.${ext}`;
}

// ── PDF ──────────────────────────────────────────────────────────────────────

export async function buildInvoicePdf(inv: Invoice): Promise<ArrayBuffer> {
  const { jsPDF } = await import("jspdf");
  const { autoTable } = await import("jspdf-autotable");
  const t = invoiceTotals(inv);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 20; // margin
  let y = 26;

  // Header: business on the left, invoice details on the right
  doc.setFont("times", "bold").setFontSize(24).setTextColor(...INK);
  doc.text(BUSINESS.name, M, y);
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...BROWN);
  doc.text([BUSINESS.tagline, BUSINESS.email, BUSINESS.phone], M, y + 6);

  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(...GOLD);
  doc.text("INVOICE", W - M, y - 6, { align: "right" });
  doc.setFont("times", "bold").setFontSize(16).setTextColor(...INK);
  doc.text(inv.number, W - M, y, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...BROWN);
  const meta = [`Issued ${longDate(inv.issueDate)}`, `Due ${longDate(inv.dueDate)}`];
  if (inv.eventDate) meta.push(`Appointment ${longDate(inv.eventDate)}`);
  doc.text(meta, W - M, y + 6, { align: "right" });

  y += 26;
  doc.setDrawColor(...GOLD).setLineWidth(0.4).line(M, y, W - M, y);
  y += 10;

  // Bill to
  doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(...GOLD);
  doc.text("BILL TO", M, y, { charSpace: 1 });
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...INK);
  doc.text(inv.client.name, M, y + 6);
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...BROWN);
  const clientLines = [
    ...inv.client.address.split("\n").filter(Boolean),
    inv.client.email,
    inv.client.phone,
  ].filter(Boolean);
  doc.text(clientLines, M, y + 11.5);
  y += 14 + clientLines.length * 4.2;

  // Line items
  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M },
    head: [["Description", "Qty", "Unit price", "Amount"]],
    body: inv.items.map(i => [i.description, String(i.quantity), money(i.unitPrice), money(i.quantity * i.unitPrice)]),
    theme: "plain",
    styles: { font: "helvetica", fontSize: 9.5, textColor: INK, cellPadding: { top: 3.2, bottom: 3.2, left: 3, right: 3 } },
    headStyles: { fillColor: INK, textColor: [250, 246, 241], fontStyle: "bold", fontSize: 8.5 },
    columnStyles: {
      1: { halign: "right", cellWidth: 16 },
      2: { halign: "right", cellWidth: 30 },
      3: { halign: "right", cellWidth: 30 },
    },
    didParseCell: data => {
      if (data.section === "head" && data.column.index > 0) data.cell.styles.halign = "right";
    },
    didDrawCell: data => {
      if (data.section === "body") {
        doc.setDrawColor(...LINE).setLineWidth(0.2);
        doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
      }
    },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // Totals
  const labelX = W - M - 62;
  const row = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal").setFontSize(bold ? 11 : 9.5).setTextColor(...(bold ? INK : BROWN));
    doc.text(label, labelX, y);
    doc.setTextColor(...INK).text(value, W - M, y, { align: "right" });
    y += bold ? 8 : 6;
  };
  row("Subtotal", money(t.subtotal));
  if (t.discount) row("Discount", `-${money(t.discount)}`);
  if (t.discount) row("Total", money(t.total));
  if (t.deposit) row("Deposit paid", `-${money(t.deposit)}`);
  doc.setDrawColor(...INK).setLineWidth(0.3).line(labelX, y - 2.5, W - M, y - 2.5);
  y += 3;
  row(inv.status === "paid" ? "Paid in full" : "Balance due", money(inv.status === "paid" ? 0 : t.balance), true);
  y += 6;

  // Payment details and notes
  const block = (title: string, body: string) => {
    if (!body.trim()) return;
    if (y > 250) {
      doc.addPage();
      y = 24;
    }
    doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(...GOLD);
    doc.text(title.toUpperCase(), M, y, { charSpace: 1 });
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...BROWN);
    const lines = doc.splitTextToSize(body, W - M * 2);
    doc.text(lines, M, y + 5.5);
    y += 10 + lines.length * 4.2;
  };
  block("Payment details", inv.paymentDetails);
  block("Notes", inv.notes);

  // Footer
  const H = doc.internal.pageSize.getHeight();
  doc.setFont("times", "italic").setFontSize(10).setTextColor(...BROWN);
  doc.text("Thank you for choosing Myxprecioussmua.", W / 2, H - 14, { align: "center" });

  doc.setProperties({ title: `Invoice ${inv.number}`, author: BUSINESS.name });
  return doc.output("arraybuffer");
}

// ── Word (.docx) ─────────────────────────────────────────────────────────────

export async function buildInvoiceDocx(inv: Invoice): Promise<ArrayBuffer> {
  const d = await import("docx");
  const t = invoiceTotals(inv);
  const INK_HEX = "2C1F14";
  const BROWN_HEX = "7A5C46";
  const GOLD_HEX = "A07840";
  const none = { style: d.BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const noBorders = { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none };
  const hairline = { style: d.BorderStyle.SINGLE, size: 4, color: "E8DDD4" };

  const run = (text: string, opts: { bold?: boolean; size?: number; color?: string; font?: string; italics?: boolean } = {}) =>
    new d.TextRun({ text, bold: opts.bold, italics: opts.italics, size: opts.size ?? 19, color: opts.color ?? BROWN_HEX, font: opts.font ?? "Calibri" });
  const para = (children: InstanceType<typeof d.TextRun>[], opts: { align?: (typeof d.AlignmentType)[keyof typeof d.AlignmentType]; after?: number } = {}) =>
    new d.Paragraph({ children, alignment: opts.align, spacing: { after: opts.after ?? 40 } });
  const label = (text: string) => para([run(text.toUpperCase(), { bold: true, size: 15, color: GOLD_HEX })], { after: 60 });
  const lines = (values: string[], align?: (typeof d.AlignmentType)[keyof typeof d.AlignmentType]) =>
    values.filter(Boolean).map(v => para([run(v)], { align }));

  const meta = [`Issued ${longDate(inv.issueDate)}`, `Due ${longDate(inv.dueDate)}`];
  if (inv.eventDate) meta.push(`Appointment ${longDate(inv.eventDate)}`);

  const header = new d.Table({
    width: { size: 100, type: d.WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [
      new d.TableRow({
        children: [
          new d.TableCell({
            width: { size: 60, type: d.WidthType.PERCENTAGE },
            children: [
              para([run(BUSINESS.name, { bold: true, size: 44, color: INK_HEX, font: "Georgia" })], { after: 80 }),
              ...lines([BUSINESS.tagline, BUSINESS.email, BUSINESS.phone]),
            ],
          }),
          new d.TableCell({
            width: { size: 40, type: d.WidthType.PERCENTAGE },
            children: [
              para([run("INVOICE", { bold: true, size: 18, color: GOLD_HEX })], { align: d.AlignmentType.RIGHT }),
              para([run(inv.number, { bold: true, size: 30, color: INK_HEX, font: "Georgia" })], { align: d.AlignmentType.RIGHT, after: 80 }),
              ...lines(meta, d.AlignmentType.RIGHT),
            ],
          }),
        ],
      }),
    ],
  });

  const cell = (text: string, opts: { head?: boolean; right?: boolean; width: number }) =>
    new d.TableCell({
      width: { size: opts.width, type: d.WidthType.PERCENTAGE },
      shading: opts.head ? { type: d.ShadingType.CLEAR, color: "auto", fill: INK_HEX } : undefined,
      margins: { top: 90, bottom: 90, left: 110, right: 110 },
      borders: { top: none, left: none, right: none, bottom: opts.head ? none : hairline },
      children: [
        para([run(text, { bold: opts.head, color: opts.head ? "FAF6F1" : INK_HEX, size: opts.head ? 17 : 19 })], {
          align: opts.right ? d.AlignmentType.RIGHT : d.AlignmentType.LEFT,
          after: 0,
        }),
      ],
    });
  const widths = [52, 12, 18, 18];

  const items = new d.Table({
    width: { size: 100, type: d.WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [
      new d.TableRow({
        tableHeader: true,
        children: ["Description", "Qty", "Unit price", "Amount"].map((h, i) => cell(h, { head: true, right: i > 0, width: widths[i] })),
      }),
      ...inv.items.map(
        item =>
          new d.TableRow({
            children: [item.description, String(item.quantity), money(item.unitPrice), money(item.quantity * item.unitPrice)].map(
              (v, i) => cell(v, { right: i > 0, width: widths[i] })
            ),
          })
      ),
    ],
  });

  const totalRows: [string, string, boolean][] = [["Subtotal", money(t.subtotal), false]];
  if (t.discount) totalRows.push(["Discount", `-${money(t.discount)}`, false], ["Total", money(t.total), false]);
  if (t.deposit) totalRows.push(["Deposit paid", `-${money(t.deposit)}`, false]);
  totalRows.push([inv.status === "paid" ? "Paid in full" : "Balance due", money(inv.status === "paid" ? 0 : t.balance), true]);

  const totals = new d.Table({
    width: { size: 45, type: d.WidthType.PERCENTAGE },
    alignment: d.AlignmentType.RIGHT,
    borders: noBorders,
    rows: totalRows.map(
      ([l, v, bold]) =>
        new d.TableRow({
          children: [
            new d.TableCell({
              borders: { top: bold ? { style: d.BorderStyle.SINGLE, size: 6, color: INK_HEX } : none, bottom: none, left: none, right: none },
              margins: { top: 60, bottom: 60 },
              children: [para([run(l, { bold, color: bold ? INK_HEX : BROWN_HEX, size: bold ? 22 : 19 })], { after: 0 })],
            }),
            new d.TableCell({
              borders: { top: bold ? { style: d.BorderStyle.SINGLE, size: 6, color: INK_HEX } : none, bottom: none, left: none, right: none },
              margins: { top: 60, bottom: 60 },
              children: [para([run(v, { bold, color: INK_HEX, size: bold ? 22 : 19 })], { align: d.AlignmentType.RIGHT, after: 0 })],
            }),
          ],
        })
    ),
  });

  const textBlock = (title: string, body: string) =>
    body.trim() ? [para([], { after: 200 }), label(title), ...body.split("\n").map(l => para([run(l)]))] : [];

  const document = new d.Document({
    creator: BUSINESS.name,
    title: `Invoice ${inv.number}`,
    sections: [
      {
        properties: { page: { margin: { top: 1000, bottom: 1000, left: 1100, right: 1100 } } },
        children: [
          header,
          new d.Paragraph({
            border: { bottom: { style: d.BorderStyle.SINGLE, size: 8, color: "C9A96E", space: 1 } },
            spacing: { before: 200, after: 300 },
          }),
          label("Bill to"),
          para([run(inv.client.name, { bold: true, size: 22, color: INK_HEX })]),
          ...lines([...inv.client.address.split("\n"), inv.client.email, inv.client.phone]),
          para([], { after: 240 }),
          items,
          para([], { after: 200 }),
          totals,
          ...textBlock("Payment details", inv.paymentDetails),
          ...textBlock("Notes", inv.notes),
          para([], { after: 400 }),
          para([run("Thank you for choosing Myxprecioussmua.", { italics: true, font: "Georgia" })], { align: d.AlignmentType.CENTER }),
        ],
      },
    ],
  });

  return d.Packer.toArrayBuffer(document);
}

// ── Download helper ──────────────────────────────────────────────────────────

export async function downloadInvoice(inv: Invoice, format: "pdf" | "docx") {
  const data = format === "pdf" ? await buildInvoicePdf(inv) : await buildInvoiceDocx(inv);
  const type =
    format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename(inv, format);
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export { statusLabel };
