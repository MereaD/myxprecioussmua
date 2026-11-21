import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getAvailability, saveAvailability, todayISO, type AvailableDay } from "@/lib/store";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ days: await getAvailability() });
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { days } = await req.json();
    if (!Array.isArray(days)) {
      return NextResponse.json({ error: "Invalid availability" }, { status: 400 });
    }

    const today = todayISO();
    const byDate = new Map<string, Set<string>>();
    for (const d of days) {
      const date = String(d?.date ?? "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json({ error: `"${date}" is not a valid date` }, { status: 400 });
      }
      // Past days are dropped so the list doesn't grow forever.
      if (date < today) continue;

      const times = byDate.get(date) ?? new Set<string>();
      for (const t of Array.isArray(d.times) ? d.times : []) {
        const time = String(t);
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
          return NextResponse.json({ error: `"${time}" is not a valid time` }, { status: 400 });
        }
        times.add(time);
      }
      byDate.set(date, times);
    }

    const cleaned: AvailableDay[] = [...byDate.entries()]
      .map(([date, times]) => ({ date, times: [...times].sort() }))
      .sort((a, b) => a.date.localeCompare(b.date));

    await saveAvailability(cleaned);
    return NextResponse.json({ days: cleaned });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save availability" }, { status: 500 });
  }
}
