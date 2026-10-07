import { NextResponse } from "next/server";

// Keep your valid coupon codes here — server-side only, never exposed to the client.
const VALID_COUPONS = ["DIASPORA26", "OCTOBER50"];

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ valid: false });
    }

    const normalized = code.trim().toUpperCase();
    const valid = VALID_COUPONS.includes(normalized);

    return NextResponse.json({ valid, code: normalized });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { valid: false, error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}