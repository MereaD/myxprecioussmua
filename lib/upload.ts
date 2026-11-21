// Browser-side helper for the admin pages: uploads one file straight to Cloudinary
// using a signature from /api/admin/cloudinary-sign.

export interface UploadedFile {
  publicId: string;
  resourceType: "image" | "video";
  url: string;
}

// Cloudinary free-plan limits for a single (non-chunked) upload.
export const MAX_IMAGE_MB = 10;
export const MAX_VIDEO_MB = 100;

export function tooLarge(file: File) {
  const limit = file.type.startsWith("video/") ? MAX_VIDEO_MB : MAX_IMAGE_MB;
  return file.size > limit * 1024 * 1024 ? `${file.name} (max ${limit} MB)` : null;
}

export async function uploadToCloudinary(
  file: File,
  resourceType: "image" | "video",
  folder?: string
): Promise<UploadedFile> {
  // folder: undefined → the portfolio folder; "" → no folder (top level of Cloudinary).
  const signRes = await fetch("/api/admin/cloudinary-sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(folder === undefined ? {} : { folder }),
  });
  const sign = await signRes.json();
  if (!signRes.ok) throw new Error(sign.error || "Couldn't start the upload");

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", sign.apiKey);
  body.append("timestamp", String(sign.timestamp));
  if (sign.folder) body.append("folder", sign.folder);
  body.append("signature", sign.signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/${resourceType}/upload`, {
    method: "POST",
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || `Upload of ${file.name} failed`);
  return { publicId: json.public_id, resourceType, url: json.secure_url };
}
