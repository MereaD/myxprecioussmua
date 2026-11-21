import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { deleteBooking, getBooking, getBookings, saveBooking } from "@/lib/store";
import { BOOKING_STATUS, type BookingStatus } from "@/lib/booking";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ bookings: await getBookings() });
}

// PATCH { id, status?, adminNotes? }
export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id, status, adminNotes } = await req.json();
    const booking = typeof id === "string" ? await getBooking(id) : null;
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    if (status !== undefined) {
      if (!(status in BOOKING_STATUS)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      booking.status = status as BookingStatus;
    }
    if (adminNotes !== undefined) booking.adminNotes = String(adminNotes).slice(0, 2000);

    await saveBooking(booking);
    return NextResponse.json({ booking });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update the booking" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await req.json();
    if (typeof id !== "string") return NextResponse.json({ error: "Invalid booking" }, { status: 400 });
    await deleteBooking(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete the booking" }, { status: 500 });
  }
}
