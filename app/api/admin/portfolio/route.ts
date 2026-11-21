import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/admin";
import { cloudinary, cloudinarySettings } from "@/lib/cloudinary";
import {
  getPortfolioEntries,
  savePortfolioEntries,
  type CloudinaryAsset,
  type PortfolioEntry,
} from "@/lib/store";

const CATEGORIES = ["", "Glam", "Bridal", "Editorial"];

interface UploadedAsset extends CloudinaryAsset {
  url: string;
}

function isOurUpload(a: unknown): a is UploadedAsset {
  const asset = a as UploadedAsset;
  const cloud = cloudinarySettings.cloudName;
  return (
    typeof asset?.publicId === "string" &&
    asset.publicId.length > 0 &&
    (asset.resourceType === "image" || asset.resourceType === "video") &&
    typeof asset.url === "string" &&
    asset.url.startsWith(`https://res.cloudinary.com/${cloud}/`)
  );
}

/** Serve photos in the best format and size for each browser. */
function optimised(url: string) {
  return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ entries: await getPortfolioEntries() });
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await req.json();
    const rawPhotos: unknown[] = Array.isArray(body.photos) ? body.photos : [];
    if (rawPhotos.length === 0 || !rawPhotos.every(isOurUpload)) {
      return NextResponse.json({ error: "Add at least one photo" }, { status: 400 });
    }
    if (body.video && !isOurUpload(body.video)) {
      return NextResponse.json({ error: "Invalid video" }, { status: 400 });
    }
    const photos = rawPhotos as UploadedAsset[];
    const video = body.video ? (body.video as UploadedAsset) : undefined;
    const category = CATEGORIES.includes(body.category) ? body.category : "";

    const entry: PortfolioEntry = {
      id: randomUUID(),
      srcs: photos.map(p => optimised(p.url)),
      ...(video ? { video: video.url } : {}),
      alt: String(body.alt ?? "").slice(0, 120) || "Makeup look by Myxprecioussmua",
      note: String(body.note ?? "").slice(0, 120),
      category,
      tall: Boolean(body.tall),
      assets: [...photos, ...(video ? [video] : [])].map(a => ({
        publicId: a.publicId,
        resourceType: a.resourceType,
      })),
      createdAt: new Date().toISOString(),
    };

    const entries = await getPortfolioEntries();
    await savePortfolioEntries([entry, ...entries]);
    return NextResponse.json({ entry });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save portfolio item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await req.json();
    const entries = await getPortfolioEntries();
    const entry = entries.find(e => e.id === id);
    if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await savePortfolioEntries(entries.filter(e => e.id !== id));

    // Remove the files from Cloudinary too; a failure here only leaves an orphaned file.
    await Promise.allSettled(
      entry.assets.map(a =>
        cloudinary.uploader.destroy(a.publicId, { resource_type: a.resourceType, invalidate: true })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 });
  }
}
