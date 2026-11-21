"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { tooLarge, uploadToCloudinary } from "@/lib/upload";
import { EmptyState, Notice, PageHeader } from "../../ui";

const ROOT = "myxprecioussmua";

interface Folder {
  name: string;
  path: string;
}

interface FileItem {
  publicId: string;
  resourceType: "image" | "video";
  url: string;
  bytes: number;
  format?: string;
  createdAt: string;
}

function formatSize(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export default function LibraryPage() {
  const [path, setPath] = useState(ROOT);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFolder, setNewFolder] = useState("");
  const [progress, setProgress] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(
    (target: string) =>
      fetch(`/api/admin/folders?path=${encodeURIComponent(target)}`)
        .then(async res => {
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || "Couldn't open that folder");
          setFolders(json.folders);
          setFiles(json.files);
        })
        .catch(err => {
          setFolders([]);
          setFiles([]);
          setMessage({ kind: "error", text: err instanceof Error ? err.message : "Couldn't open that folder" });
        })
        .finally(() => setLoading(false)),
    []
  );

  useEffect(() => {
    load(path);
  }, [path, load]);

  const open = (target: string) => {
    setMessage(null);
    setLoading(true);
    setPath(target);
  };

  const createFolder = async () => {
    const name = newFolder.trim();
    if (!name) return;
    setMessage(null);
    const res = await fetch("/api/admin/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: `${path}/${name}` }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMessage({ kind: "error", text: json.error || "Couldn't create the folder" });
      return;
    }
    setNewFolder("");
    setMessage({ kind: "ok", text: `Folder "${name}" created.` });
    load(path);
  };

  const deleteFolder = async (folder: Folder) => {
    if (!confirm(`Delete the folder "${folder.name}"? It must be empty.`)) return;
    setMessage(null);
    const res = await fetch("/api/admin/folders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder: folder.path }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMessage({ kind: "error", text: json.error || "Couldn't delete the folder" });
      return;
    }
    setMessage({ kind: "ok", text: `Folder "${folder.name}" deleted.` });
    load(path);
  };

  const upload = async (list: FileList | null) => {
    const chosen = Array.from(list ?? []);
    if (fileInput.current) fileInput.current.value = "";
    if (chosen.length === 0) return;

    const big = chosen.map(tooLarge).filter(Boolean);
    if (big.length > 0) {
      setMessage({ kind: "error", text: `Too large: ${big.join(", ")}` });
      return;
    }

    setMessage(null);
    try {
      for (const [i, file] of chosen.entries()) {
        setProgress(`Uploading ${i + 1} of ${chosen.length}…`);
        await uploadToCloudinary(file, file.type.startsWith("video/") ? "video" : "image", path);
      }
      setMessage({ kind: "ok", text: `Uploaded ${chosen.length} file${chosen.length === 1 ? "" : "s"}.` });
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof Error ? err.message : "Upload failed" });
    } finally {
      setProgress(null);
      load(path);
    }
  };

  const deleteFile = async (file: FileItem) => {
    if (!confirm("Delete this file from Cloudinary? Anywhere it's used on the site will break.")) return;
    setMessage(null);
    const res = await fetch("/api/admin/folders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: { publicId: file.publicId, resourceType: file.resourceType } }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMessage({ kind: "error", text: json.error || "Couldn't delete the file" });
      return;
    }
    setFiles(prev => prev.filter(f => f.publicId !== file.publicId));
  };

  const copyLink = async (file: FileItem) => {
    await navigator.clipboard.writeText(file.url);
    setCopied(file.publicId);
    setTimeout(() => setCopied(c => (c === file.publicId ? null : c)), 1500);
  };

  // Breadcrumb: myxprecioussmua / clients / 2026
  const crumbs = path.split("/").map((name, i, parts) => ({
    name: i === 0 ? "All media" : name,
    path: parts.slice(0, i + 1).join("/"),
  }));
  const busy = progress !== null;

  return (
    <>
      <PageHeader
        title="Library"
        description="Your Cloudinary media. Create folders, upload photos and videos into them, and copy links to use elsewhere."
      />

      <nav aria-label="Folder path" className="mb-4 flex flex-wrap items-center gap-1 text-sm">
        {crumbs.map((c, i) => (
          <span key={c.path} className="flex items-center gap-1">
            {i > 0 && <span className="text-[var(--a-muted)]">/</span>}
            {i === crumbs.length - 1 ? (
              <span className="font-medium">{c.name}</span>
            ) : (
              <button className="text-[var(--a-gold-deep)] underline-offset-4 hover:underline" onClick={() => open(c.path)}>
                {c.name}
              </button>
            )}
          </span>
        ))}
      </nav>

      <div className="admin-card mb-6 flex flex-wrap items-end gap-3">
        <div className="min-w-[180px] flex-1">
          <label className="admin-label" htmlFor="folder-name">New folder here</label>
          <input
            id="folder-name"
            className="admin-input"
            placeholder="e.g. Weddings 2026"
            value={newFolder}
            maxLength={50}
            onChange={e => setNewFolder(e.target.value)}
            onKeyDown={e => e.key === "Enter" && createFolder()}
          />
        </div>
        <button className="admin-btn-ghost" onClick={createFolder} disabled={!newFolder.trim()}>
          Create folder
        </button>
        <label className={`admin-btn ${busy ? "pointer-events-none opacity-50" : ""}`}>
          {busy ? progress : "Upload files"}
          <input
            ref={fileInput}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            disabled={busy}
            onChange={e => upload(e.target.files)}
          />
        </label>
      </div>

      <Notice message={message} />

      {loading ? (
        <p className="admin-hint">Loading…</p>
      ) : (
        <>
          {folders.length > 0 && (
            <>
              <h2 className="admin-section-title mb-3">Folders</h2>
              <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {folders.map(f => (
                  <div
                    key={f.path}
                    className="admin-card group flex items-center gap-2 !p-0 transition-colors hover:border-[var(--a-border-strong)]"
                  >
                    <button className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-4 text-left" onClick={() => open(f.path)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className="shrink-0 text-[var(--a-gold-deep)]" aria-hidden="true">
                        <path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
                      </svg>
                      <span className="truncate text-sm font-medium">{f.name}</span>
                    </button>
                    <button
                      className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--a-muted)] opacity-60 transition hover:bg-[var(--a-danger-bg)] hover:text-[var(--a-danger)] hover:opacity-100 group-hover:opacity-100"
                      aria-label={`Delete folder ${f.name}`}
                      title="Delete folder"
                      onClick={() => deleteFolder(f)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 className="admin-section-title mb-3">Files</h2>
          {files.length === 0 ? (
            <EmptyState title={folders.length === 0 ? "This folder is empty" : "No files directly in this folder"}>
              Use Upload files to add photos or videos here.
            </EmptyState>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {files.map(file => (
                <article key={file.publicId} className="admin-card overflow-hidden !p-0">
                  {file.resourceType === "video" ? (
                    <video src={file.url} className="aspect-square w-full bg-black object-cover" muted controls preload="metadata" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={file.url.replace("/image/upload/", "/image/upload/c_fill,w_400,h_400,f_auto,q_auto/")}
                      alt=""
                      className="aspect-square w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-3">
                    <p className="truncate text-sm font-medium" title={file.publicId}>{file.publicId.split("/").pop()}</p>
                    <p className="admin-hint mb-3 !text-[0.78rem]">
                      {file.format?.toUpperCase()} · {formatSize(file.bytes)}
                    </p>
                    <div className="flex gap-2">
                      <button className="admin-btn-ghost admin-btn-sm flex-1" onClick={() => copyLink(file)}>
                        {copied === file.publicId ? "Copied" : "Copy link"}
                      </button>
                      <button className="admin-btn-ghost admin-btn-sm admin-danger" onClick={() => deleteFile(file)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
