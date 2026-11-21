import { NextResponse } from "next/server";
import { getUpcomingAvailability } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ days: await getUpcomingAvailability() });
}
