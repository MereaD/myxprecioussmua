// Booking requests from the website's Request Appointment form.

export type BookingStatus = "new" | "confirmed" | "completed" | "declined" | "cancelled";

export interface Booking {
  id: string;
  createdAt: string;
  status: BookingStatus;
  fullName: string;
  email: string;
  phone: string;
  serviceType: "bridal" | "occasion" | "";
  trialChoice: "yes" | "no" | null;
  occasion: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM, 24-hour
  appointmentType: "studio" | "mobile" | "";
  location: string;
  peopleCount: number;
  additionalInfo: string;
  couponCode: string;
  couponApplied: boolean;
  adminNotes: string;
}

export const BOOKING_STATUS: Record<BookingStatus, { label: string; tone: "new" | "success" | "muted" | "neutral" }> = {
  new: { label: "New", tone: "new" },
  confirmed: { label: "Confirmed", tone: "success" },
  completed: { label: "Completed", tone: "neutral" },
  declined: { label: "Declined", tone: "muted" },
  cancelled: { label: "Cancelled", tone: "muted" },
};

/** Requests that still hold their time slot, so nobody else can request it. */
export const holdsSlot = (b: Pick<Booking, "status">) => b.status === "new" || b.status === "confirmed";

export function serviceLabel(b: Pick<Booking, "serviceType" | "trialChoice" | "occasion">) {
  if (b.serviceType === "bridal") return b.trialChoice === "yes" ? "Bridal trial" : "Bridal";
  if (b.serviceType === "occasion") return b.occasion ? `Occasion · ${b.occasion}` : "Occasion";
  return "Not specified";
}
