import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getCoupons, saveCoupons, normalizeCode, type Coupon } from "@/lib/store";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ coupons: await getCoupons() });
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { coupons } = await req.json();
    if (!Array.isArray(coupons)) {
      return NextResponse.json({ error: "Invalid coupon list" }, { status: 400 });
    }

    const seen = new Set<string>();
    const cleaned: Coupon[] = [];
    for (const c of coupons) {
      const code = normalizeCode(String(c?.code ?? ""));
      if (!/^[A-Z0-9_-]{2,30}$/.test(code)) {
        return NextResponse.json(
          { error: `"${code || "(blank)"}" is not a valid code. Use 2–30 letters, numbers, - or _.` },
          { status: 400 }
        );
      }
      if (seen.has(code)) {
        return NextResponse.json({ error: `${code} is listed twice.` }, { status: 400 });
      }
      seen.add(code);

      const expiresAt = typeof c.expiresAt === "string" && /^\d{4}-\d{2}-\d{2}$/.test(c.expiresAt)
        ? c.expiresAt
        : undefined;
      cleaned.push({
        code,
        description: String(c.description ?? "").slice(0, 120),
        active: Boolean(c.active),
        ...(expiresAt ? { expiresAt } : {}),
      });
    }

    await saveCoupons(cleaned);
    return NextResponse.json({ coupons: cleaned });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save coupons" }, { status: 500 });
  }
}
