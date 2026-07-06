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
      subject: `New Collab Inquiry - ${brandName}${typeLabel ? ` (${typeLabel})` : ""}`,
      html: `
        <h2>New Collaboration Inquiry</h2>

        <p><strong>Brand/Company:</strong> ${brandName}</p>
        <p><strong>Type:</strong> ${typeLabel}</p>
        <p><strong>Dates:</strong> ${dates || "Not specified"}</p>
        <p><strong>Location:</strong> ${location || "Not specified"}</p>
        <p><strong>Budget:</strong> ${budget || "Not specified"}</p>

        <hr />

        <p><strong>Project Details:</strong></p>
        <p>${(projectDetails || "").replace(/\n/g, "<br/>")}</p>
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