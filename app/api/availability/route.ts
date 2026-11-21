import { NextResponse } from "next/server";
import { getTakenSlots, getUpcomingAvailability, todayISO } from "@/lib/store";

export const dynamic = "force-dynamic";

// Public: what the booking form can offer.
// - restricted: the admin has published availability, so only `days` can be requested
// - days: published days and the times on them that are still free
// - taken: already-requested slots (date and time only, no client details)
export async function GET() {
  const today = todayISO();
  const [published, taken] = await Promise.all([getUpcomingAvailability(), getTakenSlots()]);
  const days = published
    .map(d => ({ ...d, times: d.times.filter(t => !taken.has(`${d.date} ${t}`)) }))
    .filter(d => d.times.length > 0);

  return NextResponse.json({
    restricted: published.length > 0,
    days,
    taken: [...taken].filter(s => s >= today).sort(),
  });
}
