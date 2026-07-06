import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const reasonLabels: Record<string, string> = {
  bridal: "Bridal Enquiry",
  collab: "Collaboration",
  general: "General Question",
  pricing: "Pricing & Availability",
};

export async function POST(req: Request) {
  try {
    const { name, email, reason, message } = await req.json();

    const reasonLabel = reason ? reasonLabels[reason] || reason : "Not specified";

    const data = await resend.emails.send({
      from: "Myxprecioussmua <hello@myxprecioussmua.com>",
      to: ["myxprecioussmua@outlook.com"],
      subject: `New Contact Form Submission${reason ? ` — ${reasonLabel}` : ""}`,
      replyTo: email,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2c1f14;">
          <div style="background: linear-gradient(135deg, #c9a96e, #a07840); padding: 24px 32px;">
            <h1 style="color: #faf6f1; font-size: 1.4rem; margin: 0; font-weight: 500; letter-spacing: 0.05em;">
              New Contact Form Submission
            </h1>
            <p style="color: rgba(250,246,241,0.8); font-size: 0.85rem; margin: 6px 0 0; font-family: sans-serif;">
              Received via myxprecioussmua.com
            </p>
          </div>

          <div style="padding: 32px; background: #faf6f1;">

            <h2 style="font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a96e; font-family: sans-serif; font-weight: 400; margin: 0 0 16px;">
              Sender Details
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; color: #7a5c46; font-size: 0.85rem; width: 40%;">Name</td><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; font-size: 0.85rem;">${name || "—"}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; color: #7a5c46; font-size: 0.85rem;">Email</td><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; font-size: 0.85rem;">${email || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #7a5c46; font-size: 0.85rem;">Reason</td><td style="padding: 8px 0; font-size: 0.85rem;">${reasonLabel}</td></tr>
            </table>

            <h2 style="font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a96e; font-family: sans-serif; font-weight: 400; margin: 0 0 16px;">
              Message
            </h2>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0 0 4px;">${(message || "").replace(/\n/g, "<br/>")}</p>

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