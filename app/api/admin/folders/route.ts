import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import {
  cloudinary,
  cloudinaryConfigured,
  cloudinaryError,
  isManagedFolder,
  MEDIA_ROOT,
} from "@/lib/cloudinary";

interface CloudinaryResource {
  public_id: string;
  resource_type: "image" | "video" | "raw";
  secure_url: string;
  bytes: number;
  format?: string;
  created_at: string;
  asset_folder?: string;
}

function notConfigured() {
  return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 500 });
}

/** Files directly inside a folder. Works for both dynamic-folder and older fixed-folder accounts. */
async function listFiles(path: string): Promise<CloudinaryResource[]> {
  try {
    const res = await cloudinary.api.resources_by_asset_folder(path, { max_results: 200 });
    return res.resources as unknown as CloudinaryResource[];
  } catch {
    const lists = await Promise.all(
      (["image", "video"] as const).map(resource_type =>
        cloudinary.api.resources({ type: "upload", prefix: `${path}/`, resource_type, max_results: 200 })
      )
    );
    // Prefix search also returns files in sub-folders, so keep only this folder's own files.
    return lists
      .flatMap(l => l.resources as CloudinaryResource[])
      .filter(r => r.public_id.slice(0, r.public_id.lastIndexOf("/")) === path);
  }
}

/** Every folder path under MEDIA_ROOT, a few levels deep, for folder pickers. */
async function allFolders(path: string, depth = 0): Promise<string[]> {
  if (depth > 3) return [];
  let children: { path: string }[] = [];
  try {
    children = (await cloudinary.api.sub_folders(path, { max_results: 500 })).folders;
  } catch {
    return [];
  }
  const nested = await Promise.all(children.map(c => allFolders(c.path, depth + 1)));
  return children.flatMap((c, i) => [c.path, ...nested[i]]);
}

// GET /api/admin/folders?path=myxprecioussmua/clients → sub-folders and files in that folder
// GET /api/admin/folders?tree=1 → every folder path, for pickers
export async function GET(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!cloudinaryConfigured()) return notConfigured();

  const params = new URL(req.url).searchParams;
  if (params.get("tree")) {
    const paths = await allFolders(MEDIA_ROOT);
    return NextResponse.json({ folders: paths.sort((a, b) => a.localeCompare(b)) });
  }

  const path = params.get("path") || MEDIA_ROOT;
  if (!isManagedFolder(path)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }

  try {
    let folders: { name: string; path: string }[] = [];
    try {
      const res = await cloudinary.api.sub_folders(path, { max_results: 500 });
      folders = res.folders;
    } catch (error) {
      // The top folder doesn't exist until something is created; make it on first visit.
      if (path !== MEDIA_ROOT) throw error;
      await cloudinary.api.create_folder(MEDIA_ROOT);
    }

    const files = (await listFiles(path))
      .filter(r => r.resource_type === "image" || r.resource_type === "video")
      .map(r => ({
        publicId: r.public_id,
        resourceType: r.resource_type,
        url: r.secure_url,
        bytes: r.bytes,
        format: r.format,
        createdAt: r.created_at,
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return NextResponse.json({
      path,
      folders: folders.map(f => ({ name: f.name, path: f.path })).sort((a, b) => a.name.localeCompare(b.name)),
      files,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: cloudinaryError(error, "Couldn't open that folder") }, { status: 500 });
  }
}

// POST { path } → create a folder
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!cloudinaryConfigured()) return notConfigured();

  const { path } = await req.json().catch(() => ({}));
  if (!isManagedFolder(path) || path === MEDIA_ROOT) {
    return NextResponse.json(
      { error: "Folder names can use letters, numbers, spaces, - and _ (up to 50 characters)." },
      { status: 400 }
    );
  }

  try {
    await cloudinary.api.create_folder(path);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: cloudinaryError(error, "Couldn't create the folder") }, { status: 500 });
  }
}

// DELETE { folder } → delete an empty folder, or { file: { publicId, resourceType } } → delete a file
export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!cloudinaryConfigured()) return notConfigured();

  const body = await req.json().catch(() => ({}));

  try {
    if (body.folder !== undefined) {
      if (!isManagedFolder(body.folder) || body.folder === MEDIA_ROOT) {
        return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
      }
      await cloudinary.api.delete_folder(body.folder);
      return NextResponse.json({ success: true });
    }

    const file = body.file;
    if (typeof file?.publicId !== "string" || !["image", "video"].includes(file.resourceType)) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }
    await cloudinary.uploader.destroy(file.publicId, { resource_type: file.resourceType, invalidate: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    const message = cloudinaryError(error, "Couldn't delete");
    return NextResponse.json(
      { error: /not empty/i.test(message) ? "Empty the folder first: delete its files and sub-folders." : message },
      { status: 500 }
    );
  }
}
