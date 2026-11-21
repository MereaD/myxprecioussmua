"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { MAX_IMAGE_MB, MAX_VIDEO_MB, uploadToCloudinary, type UploadedFile } from "@/lib/upload";
import { EmptyState, Notice, PageHeader } from "../../ui";

interface Entry {
  id: string;
  srcs: string[];
  video?: string;
  alt: string;
  note?: string;
  category?: string;
  tall?: boolean;
  createdAt: string;
}

const ROOT = "myxprecioussmua";
const PORTFOLIO_FOLDER = `${ROOT}/portfolio`;
const NO_FOLDER = "";

/** "myxprecioussmua/clients/2026" → "clients / 2026" */
const folderLabel = (path: string) => path.slice(ROOT.length + 1).split("/").join(" / ");

export default function MediaPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState<string[]>([]);
  const [folder, setFolder] = useState(PORTFOLIO_FOLDER);
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [category, setCategory] = useState("Glam");
  const [note, setNote] = useState("");
  const [alt, setAlt] = useState("");
  const [tall, setTall] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  const previews = useMemo(() => photos.map(f => URL.createObjectURL(f)), [photos]);
  useEffect(() => () => previews.forEach(u => URL.revokeObjectURL(u)), [previews]);

  useEffect(() => {
    fetch("/api/admin/portfolio")
      .then(r => r.json())
      .then(json => setEntries(json.entries ?? []))
      .catch(() => setMessage({ kind: "error", text: "Couldn't load portfolio items." }))
      .finally(() => setLoading(false));

    fetch("/api/admin/folders?tree=1")
      .then(r => r.json())
      .then(json => setFolders(json.folders ?? []))
      .catch(() => setFolders([]));
  }, []);

  // The portfolio folder is always offered, even before Cloudinary has created it.
  const folderOptions = [...new Set([PORTFOLIO_FOLDER, ...folders])].sort((a, b) => a.localeCompare(b));

  const resetForm = () => {
    setPhotos([]);
    setVideo(null);
    setNote("");
    setAlt("");
    setTall(false);
    if (photoInput.current) photoInput.current.value = "";
    if (videoInput.current) videoInput.current.value = "";
  };

  const tooBig = [
    ...photos.filter(f => f.size > MAX_IMAGE_MB * 1024 * 1024).map(f => `${f.name} (photos max ${MAX_IMAGE_MB} MB)`),
    ...(video && video.size > MAX_VIDEO_MB * 1024 * 1024 ? [`${video.name} (videos max ${MAX_VIDEO_MB} MB)`] : []),
  ];

  const publish = async () => {
    if (photos.length === 0 || tooBig.length > 0) return;
    setMessage(null);
    const total = photos.length + (video ? 1 : 0);
    try {
      const uploadedPhotos: UploadedFile[] = [];
      for (const [i, file] of photos.entries()) {
        setProgress(`Uploading ${i + 1} of ${total}…`);
        uploadedPhotos.push(await uploadToCloudinary(file, "image", folder));
      }
      let uploadedVideo: UploadedFile | undefined;
      if (video) {
        setProgress(`Uploading video (${total} of ${total}), this can take a minute…`);
        uploadedVideo = await uploadToCloudinary(video, "video", folder);
      }

      setProgress("Saving…");
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: uploadedPhotos, video: uploadedVideo, category, note, alt, tall }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");

      setEntries(prev => [json.entry, ...prev]);
      resetForm();
      setMessage({ kind: "ok", text: "Added to the Portfolio page." });
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof Error ? err.message : "Upload failed" });
    } finally {
      setProgress(null);
    }
  };

  const remove = async (entry: Entry) => {
    if (!confirm("Remove this item from the Portfolio? Its files are deleted from Cloudinary too.")) return;
    setMessage(null);
    const res = await fetch("/api/admin/portfolio", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: entry.id }),
    });
    if (res.ok) {
      setEntries(prev => prev.filter(e => e.id !== entry.id));
      setMessage({ kind: "ok", text: "Removed from the Portfolio." });
    } else {
      const json = await res.json().catch(() => ({}));
      setMessage({ kind: "error", text: json.error || "Failed to delete" });
    }
  };

  const busy = progress !== null;

  return (
    <>
      <PageHeader
        title="Portfolio"
        description="Each upload becomes one item on the Portfolio page. The first photo is the cover, extra photos can be swiped through, and a video plays in the viewer."
      />

      <Notice message={message} />

      <h2 className="admin-section-title mb-3">New portfolio item</h2>
      <div className="admin-card mb-10 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="admin-label" htmlFor="photos">Photos</label>
            <input
              id="photos"
              ref={photoInput}
              type="file"
              accept="image/*"
              multiple
              disabled={busy}
              onChange={e => setPhotos(Array.from(e.target.files ?? []))}
              className="admin-input"
            />
            <p className="admin-hint mt-1.5 !text-[0.8rem]">Required. Up to {MAX_IMAGE_MB} MB each.</p>
            {previews.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {previews.map((src, i) => (
                  <div key={src} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-16 w-16 rounded-lg border border-[var(--a-border)] object-cover" />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white">Cover</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="admin-label" htmlFor="video">Video</label>
            <input
              id="video"
              ref={videoInput}
              type="file"
              accept="video/*"
              disabled={busy}
              onChange={e => setVideo(e.target.files?.[0] ?? null)}
              className="admin-input"
            />
            <p className="admin-hint mt-1.5 !text-[0.8rem]">Optional. Up to {MAX_VIDEO_MB} MB.</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="admin-label" htmlFor="category">Category</label>
            <select id="category" className="admin-input" value={category} onChange={e => setCategory(e.target.value)} disabled={busy}>
              <option value="Glam">Glam</option>
              <option value="Bridal">Bridal</option>
              <option value="Editorial">Editorial</option>
              <option value="">None</option>
            </select>
          </div>
          <div>
            <label className="admin-label" htmlFor="folder">Save files to</label>
            <select id="folder" className="admin-input" value={folder} onChange={e => setFolder(e.target.value)} disabled={busy}>
              {folderOptions.map(f => (
                <option key={f} value={f}>{folderLabel(f)}</option>
              ))}
              <option value={NO_FOLDER}>No folder</option>
            </select>
            <p className="admin-hint mt-1.5 !text-[0.8rem]">
              Cloudinary folder. Create new ones in the <a href="/admin/library" className="admin-link">Library</a>.
            </p>
          </div>
          <div>
            <label className="admin-label" htmlFor="note">Caption</label>
            <input id="note" className="admin-input" placeholder="e.g. Prom" value={note} onChange={e => setNote(e.target.value)} disabled={busy} />
          </div>
          <div>
            <label className="admin-label" htmlFor="alt">Image description</label>
            <input id="alt" className="admin-input" placeholder="e.g. Soft glam bridal look" value={alt} onChange={e => setAlt(e.target.value)} disabled={busy} />
            <p className="admin-hint mt-1.5 !text-[0.8rem]">Read aloud to visitors using screen readers.</p>
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-[var(--a-ink-2)]">
          <input type="checkbox" checked={tall} onChange={e => setTall(e.target.checked)} disabled={busy} />
          Show as a tall tile in the grid
        </label>

        {tooBig.length > 0 && <p className="admin-notice admin-notice-error">Too large: {tooBig.join(", ")}</p>}

        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--a-border)] pt-4">
          <button className="admin-btn" onClick={publish} disabled={busy || photos.length === 0 || tooBig.length > 0}>
            {busy ? "Uploading…" : "Add to Portfolio"}
          </button>
          {progress && <span className="admin-hint">{progress}</span>}
        </div>
      </div>

      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="admin-section-title">Uploaded items</h2>
        <p className="admin-hint !text-[0.8rem]">Shown before the photos built into the site.</p>
      </div>
      {loading ? (
        <p className="admin-hint">Loading…</p>
      ) : entries.length === 0 ? (
        <EmptyState title="Nothing uploaded yet">Items you add above will appear here and on the Portfolio page.</EmptyState>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {entries.map(entry => (
            <article key={entry.id} className="admin-card overflow-hidden !p-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={entry.srcs[0]} alt={entry.alt} className="aspect-[4/5] w-full object-cover" loading="lazy" />
              <div className="p-3">
                <p className="truncate text-sm font-medium">{entry.note || "Untitled"}</p>
                <p className="admin-hint mb-3 !text-[0.78rem]">
                  {[entry.category, `${entry.srcs.length} photo${entry.srcs.length === 1 ? "" : "s"}`, entry.video && "video"]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <button className="admin-btn-ghost admin-btn-sm admin-danger w-full" onClick={() => remove(entry)}>
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
