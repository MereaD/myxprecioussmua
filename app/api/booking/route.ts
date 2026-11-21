import { Resend } from "resend";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getTakenSlots, getUpcomingAvailability, isValidCoupon, saveBooking, todayISO } from "@/lib/store";
import { formatTime } from "@/lib/time";
import type { Booking } from "@/lib/booking";

const resend = new Resend(process.env.RESEND_API_KEY);

const text = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

/** Escapes client-typed text before it goes into the notification email's HTML. */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(req: Request) {
  let saved = false;
  try {
    const body = await req.json();
    const fullName = esc(text(body.fullName, 120));
    const email = text(body.email, 160);
    const phone = esc(text(body.phone, 40));
    const serviceType: Booking["serviceType"] = body.serviceType === "bridal" || body.serviceType === "occasion" ? body.serviceType : "";
    const trialChoice: Booking["trialChoice"] = body.trialChoice === "yes" || body.trialChoice === "no" ? body.trialChoice : null;
    const occasion = esc(text(body.occasion, 120));
    const date = /^\d{4}-\d{2}-\d{2}$/.test(body.date) ? body.date : "";
    const time = /^([01]\d|2[0-3]):[0-5]\d$/.test(body.time) ? body.time : "";
    const appointmentType: Booking["appointmentType"] = body.appointmentType === "studio" || body.appointmentType === "mobile" ? body.appointmentType : "";
    const location = esc(text(body.location, 300));
    const peopleCount = Math.min(20, Math.max(1, Number(body.peopleCount) || 1));
    const additionalInfo = esc(text(body.additionalInfo, 2000));
    const couponCode = body.couponCode;

    if (!fullName || !email || !date || !time) {
      return NextResponse.json({ success: false, error: "Please fill in your name, email, date and time." }, { status: 400 });
    }
    if (!/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
    }
    if (date < todayISO()) {
      return NextResponse.json({ success: false, error: "Please choose a date in the future." }, { status: 400 });
    }

    const normalizedCoupon = couponCode ? esc(String(couponCode).trim().toUpperCase().slice(0, 30)) : "";
    const couponApplied = normalizedCoupon ? await isValidCoupon(normalizedCoupon) : false;

    // Published availability limits which slots can be requested, and a slot
    // already held by another request can't be requested twice.
    const [availability, taken] = await Promise.all([getUpcomingAvailability(), getTakenSlots()]);
    const day = availability.find(d => d.date === date);
    const unavailable =
      taken.has(`${date} ${time}`) || (availability.length > 0 && (!day || !day.times.includes(time)));
    if (unavailable) {
      return NextResponse.json(
        { success: false, error: "That date or time is no longer available. Please choose another." },
        { status: 400 }
      );
    }

    // Save first, so the request reaches the admin Bookings page even if the email fails.
    await saveBooking({
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      status: "new",
      fullName,
      email,
      phone,
      serviceType,
      trialChoice,
      occasion,
      date,
      time,
      appointmentType,
      location,
      peopleCount,
      additionalInfo,
      couponCode: normalizedCoupon,
      couponApplied,
      adminNotes: "",
    });
    saved = true;

    const formattedTime = formatTime(time);

    const formattedDate = date
      ? new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Not specified";

    const serviceLabel =
      serviceType === "bridal"
        ? "Bridal"
        : serviceType === "occasion"
        ? "Occasion"
        : "Not specified";

    const trialLabel =
      trialChoice === "yes"
        ? "Yes — Trial only"
        : trialChoice === "no"
        ? "No — Full booking"
        : "Not specified";

    const appointmentLabel =
      appointmentType === "studio"
        ? "Studio Appointment"
        : appointmentType === "mobile"
        ? "Mobile Service (come to client)"
        : "Not specified";

    const data = await resend.emails.send({
      from: "Myxprecioussmua <hello@myxprecioussmua.com>",
      to: ["myxprecioussmua@outlook.com"],
      subject: `New Booking Request — ${serviceLabel}${fullName ? ` from ${fullName}` : ""}`,
      replyTo: email,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2c1f14;">
          <div style="background: linear-gradient(135deg, #c9a96e, #a07840); padding: 24px 32px;">
            <h1 style="color: #faf6f1; font-size: 1.4rem; margin: 0; font-weight: 500; letter-spacing: 0.05em;">
              New Booking Request
            </h1>
            <p style="color: rgba(250,246,241,0.8); font-size: 0.85rem; margin: 6px 0 0; font-family: sans-serif;">
              Received via myxprecioussmua.com
            </p>
          </div>

          <div style="padding: 32px; background: #faf6f1;">

            <h2 style="font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a96e; font-family: sans-serif; font-weight: 400; margin: 0 0 16px;">
              Client Details
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; color: #7a5c46; font-size: 0.85rem; width: 40%;">Full Name</td><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; font-size: 0.85rem;">${fullName || "—"}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; color: #7a5c46; font-size: 0.85rem;">Email</td><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; font-size: 0.85rem;">${email || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #7a5c46; font-size: 0.85rem;">Phone</td><td style="padding: 8px 0; font-size: 0.85rem;">${phone || "—"}</td></tr>
            </table>

            <h2 style="font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a96e; font-family: sans-serif; font-weight: 400; margin: 0 0 16px;">
              Service
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; color: #7a5c46; font-size: 0.85rem; width: 40%;">Service</td><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; font-size: 0.85rem;">${serviceLabel}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; color: #7a5c46; font-size: 0.85rem;">Trial</td><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; font-size: 0.85rem;">${trialLabel}</td></tr>
              ${occasion ? `<tr><td style="padding: 8px 0; color: #7a5c46; font-size: 0.85rem;">Occasion</td><td style="padding: 8px 0; font-size: 0.85rem;">${occasion}</td></tr>` : ""}
            </table>

            <h2 style="font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a96e; font-family: sans-serif; font-weight: 400; margin: 0 0 16px;">
              Date & Location
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; color: #7a5c46; font-size: 0.85rem; width: 40%;">Date</td><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; font-size: 0.85rem;">${formattedDate}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; color: #7a5c46; font-size: 0.85rem;">Time</td><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; font-size: 0.85rem;">${formattedTime}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; color: #7a5c46; font-size: 0.85rem;">Appointment Type</td><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; font-size: 0.85rem;">${appointmentLabel}</td></tr>
              ${appointmentType === "mobile" && location ? `<tr><td style="padding: 8px 0; color: #7a5c46; font-size: 0.85rem;">Meet At</td><td style="padding: 8px 0; font-size: 0.85rem;">${location}</td></tr>` : ""}
            </table>

            ${
              peopleCount || additionalInfo
                ? `
            <h2 style="font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a96e; font-family: sans-serif; font-weight: 400; margin: 0 0 16px;">
              Make-up Party
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
              ${peopleCount ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; color: #7a5c46; font-size: 0.85rem; width: 40%;">Number of People</td><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; font-size: 0.85rem;">${peopleCount}</td></tr>` : ""}
              ${additionalInfo ? `<tr><td style="padding: 8px 0; color: #7a5c46; font-size: 0.85rem; vertical-align: top;">Additional Info</td><td style="padding: 8px 0; font-size: 0.85rem; line-height: 1.6;">${additionalInfo.replace(/\n/g, "<br/>")}</td></tr>` : ""}
            </table>
            `
                : ""
            }

            ${
              normalizedCoupon
                ? `
            <h2 style="font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a96e; font-family: sans-serif; font-weight: 400; margin: 0 0 16px;">
              Coupon
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; color: #7a5c46; font-size: 0.85rem; width: 40%;">Code</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; font-size: 0.85rem;">${normalizedCoupon}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #7a5c46; font-size: 0.85rem;">Status</td>
                <td style="padding: 8px 0; font-size: 0.85rem; color: ${couponApplied ? "#00a86b" : "#c0614a"};">
                  ${couponApplied ? "Valid ✓" : "Invalid / not recognised"}
                </td>
              </tr>
            </table>
            `
                : ""
            }

          </div>

          <div style="padding: 16px 32px; background: #f0e8de; text-align: center;">
            <p style="font-size: 0.75rem; color: #a08060; margin: 0; font-family: sans-serif;">
              © Myxprecioussmua — myxprecioussmua.com
            </p>
          </div>
        </div>
      `,
    });
    if (data.error) console.error("Booking email failed", data.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    // The request is already saved to the admin Bookings page, so only report
    // failure if saving itself didn't happen.
    return NextResponse.json(
      saved ? { success: true } : { success: false, error: "Something went wrong. Please try again." },
      { status: saved ? 200 : 500 }
    );
  }
}