import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// Same list as /api/validate-coupon — kept in sync so booking emails
// always reflect a genuinely verified coupon status.
const VALID_COUPONS = ["GLAM10", "BRIDE2026"];

export async function POST(req: Request) {
  try {
    const {
      fullName,
      email,
      phone,
      serviceType,
      trialChoice,
      occasion,
      date,
      timeHour,
      timeMinute,
      timePeriod,
      appointmentType,
      location,
      peopleCount,
      additionalInfo,
      couponCode,
    } = await req.json();

    const normalizedCoupon = couponCode ? String(couponCode).trim().toUpperCase() : "";
    const couponApplied = normalizedCoupon ? VALID_COUPONS.includes(normalizedCoupon) : false;

    const formattedTime =
      timeHour && timeMinute && timePeriod
        ? `${timeHour}:${timeMinute} ${timePeriod}`
        : "Not specified";

    const formattedDate = date
      ? new Date(date).toLocaleDateString("en-GB", {
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
      from: "Myxprecioussmua <noreply@myxprecioussmua.com>",
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

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}