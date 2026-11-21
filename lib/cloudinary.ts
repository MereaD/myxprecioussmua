import { v2 as cloudinary } from "cloudinary";

// Accepts either CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
// (the format shown in the Cloudinary console) or the three separate variables.
function fromUrl(value: string | undefined) {
  const match = value?.trim().match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  return match ? { apiKey: match[1], apiSecret: match[2], cloudName: match[3] } : null;
}

const url = fromUrl(process.env.CLOUDINARY_URL);

export const cloudinarySettings = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || url?.cloudName || "",
  apiKey: process.env.CLOUDINARY_API_KEY || url?.apiKey || "",
  apiSecret: process.env.CLOUDINARY_API_SECRET || url?.apiSecret || "",
};

cloudinary.config({
  cloud_name: cloudinarySettings.cloudName,
  api_key: cloudinarySettings.apiKey,
  api_secret: cloudinarySettings.apiSecret,
  secure: true,
});

/** Everything the admin manages lives under this folder in Cloudinary. */
export const MEDIA_ROOT = "myxprecioussmua";
export const PORTFOLIO_FOLDER = `${MEDIA_ROOT}/portfolio`;

export function cloudinaryConfigured() {
  return Boolean(cloudinarySettings.cloudName && cloudinarySettings.apiKey && cloudinarySettings.apiSecret);
}

/** A folder path the admin may touch: MEDIA_ROOT or something inside it, with safe names. */
export function isManagedFolder(path: unknown): path is string {
  if (typeof path !== "string") return false;
  if (path === MEDIA_ROOT) return true;
  if (!path.startsWith(`${MEDIA_ROOT}/`)) return false;
  return path
    .slice(MEDIA_ROOT.length + 1)
    .split("/")
    .every(part => /^[A-Za-z0-9 _-]{1,50}$/.test(part) && part.trim() === part);
}

/** Pulls the message out of a Cloudinary SDK error, which isn't always an Error instance. */
export function cloudinaryError(error: unknown, fallback: string) {
  const e = error as { error?: { message?: string }; message?: string };
  return e?.error?.message || e?.message || fallback;
}

export { cloudinary };
