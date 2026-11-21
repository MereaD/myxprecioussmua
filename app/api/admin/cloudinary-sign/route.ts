import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import {
  cloudinary,
  cloudinaryConfigured,
  cloudinarySettings,
  isManagedFolder,
  PORTFOLIO_FOLDER,
} from "@/lib/cloudinary";

// Signs a direct browser → Cloudinary upload, so large videos never pass through
// Vercel (which caps request bodies at 4.5 MB) and the API secret stays on the server.
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!cloudinaryConfigured()) {
    return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 500 });
  }

  // folder: "" uploads to the top level of the Cloudinary media library (no folder).
  const body = await req.json().catch(() => ({}));
  const folder = body.folder ?? PORTFOLIO_FOLDER;
  if (folder !== "" && !isManagedFolder(folder)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const params: { timestamp: number; folder?: string } = folder ? { timestamp, folder } : { timestamp };
  const signature = cloudinary.utils.api_sign_request(params, cloudinarySettings.apiSecret);

  return NextResponse.json({
    ...params,
    signature,
    apiKey: cloudinarySettings.apiKey,
    cloudName: cloudinarySettings.cloudName,
  });
}
