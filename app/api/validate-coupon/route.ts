import { NextResponse } from "next/server";
import { isValidCoupon, normalizeCode } from "@/lib/store";

// Coupon codes are managed from /admin/coupons and checked server-side only.
export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ valid: false });
    }

    const normalized = normalizeCode(code);
    const valid = await isValidCoupon(normalized);

    return NextResponse.json({ valid, code: normalized });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { valid: false, error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
