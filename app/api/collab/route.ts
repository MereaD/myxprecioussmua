import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const collabLabels: Record<string, string> = {
  editorial: "Editorial Shoot",
  "film-tv": "Film / TV",
  brand: "Brand Campaign",
  event: "Event",
  runway: "Runway",
  content: "Content Creation",
};

export async function POST(req: Request) {
  try {
    const { brandName, collabType, projectDetails, dates, location, budget } =
      await req.json();

    const typeLabel = collabLabels[collabType] || collabType || "Not specified";

    const data = await resend.emails.send({
      from: "Myxprecioussmua <hello@myxprecioussmua.com>",
      to: ["myxprecioussmua@outlook.com"],
      subject: `New Collab Inquiry — ${brandName}${typeLabel ? ` (${typeLabel})` : ""}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2c1f14;">
          <div style="background: linear-gradient(135deg, #c9a96e, #a07840); padding: 24px 32px;">
            <h1 style="color: #faf6f1; font-size: 1.4rem; margin: 0; font-weight: 500; letter-spacing: 0.05em;">
              New Collaboration Inquiry
            </h1>
            <p style="color: rgba(250,246,241,0.8); font-size: 0.85rem; margin: 6px 0 0; font-family: sans-serif;">
              Received via myxprecioussmua.com
            </p>
          </div>

          <div style="padding: 32px; background: #faf6f1;">

            <h2 style="font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a96e; font-family: sans-serif; font-weight: 400; margin: 0 0 16px;">
              Brand Details
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; color: #7a5c46; font-size: 0.85rem; width: 40%;">Brand/Company</td><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; font-size: 0.85rem;">${brandName || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #7a5c46; font-size: 0.85rem;">Type of Collaboration</td><td style="padding: 8px 0; font-size: 0.85rem;">${typeLabel}</td></tr>
            </table>

            <h2 style="font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a96e; font-family: sans-serif; font-weight: 400; margin: 0 0 16px;">
              Dates & Location
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; color: #7a5c46; font-size: 0.85rem; width: 40%;">Dates</td><td style="padding: 8px 0; border-bottom: 1px solid #e8ddd4; font-size: 0.85rem;">${dates || "Not specified"}</td></tr>
              <tr><td style="padding: 8px 0; color: #7a5c46; font-size: 0.85rem;">Location</td><td style="padding: 8px 0; font-size: 0.85rem;">${location || "Not specified"}</td></tr>
            </table>

            <h2 style="font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a96e; font-family: sans-serif; font-weight: 400; margin: 0 0 16px;">
              Budget
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
              <tr><td style="padding: 8px 0; color: #7a5c46; font-size: 0.85rem; width: 40%;">Budget</td><td style="padding: 8px 0; font-size: 0.85rem;">${budget || "Not specified"}</td></tr>
            </table>

            <h2 style="font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a96e; font-family: sans-serif; font-weight: 400; margin: 0 0 16px;">
              Project Details
            </h2>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0 0 4px;">${(projectDetails || "").replace(/\n/g, "<br/>")}</p>

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