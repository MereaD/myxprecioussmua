"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";

export interface PortfolioImage {
  id: number | string;
  srcs: string[];   // first image is the grid cover; add more for multi-photo sets
  alt: string;
  note?: string;
  category?: string;
  tall?: boolean;
  video?: string;   // optional: path to a video file e.g. "/reel-1.mp4"
}

// ── Swap these out with your real images ─────────────────────────────────────
// Single photo:       srcs: ["/photo.jpg"]
// Multiple photos:    srcs: ["/cover.jpg", "/photo-2.jpg", "/photo-3.jpg"]
// With video:         srcs: ["/cover.jpg"], video: "/reel.mp4"
//                     (cover image shows in the grid; video plays in the viewer)
// New looks can also be added from the admin area (Admin → Portfolio).
const builtInImages: PortfolioImage[] = [
  { id: 1,  srcs: ["/betty1.jpg", "/betty2.jpg"],    video: "/betty-video.mp4",                                          alt: "Soft glam look",     note: "",     category: "",      tall: true },
  { id: 2,  srcs: ["/remi.png", "/remi2.png", "/remi3.png"],                         alt: "Bridal makeup",      note: "",              category: "Glam"              },
  { id: 3,  srcs: ["/ojono-pic.jpg",   "/IMG-20260507-WA0014.jpg"],    alt: "Bridal look",     note: "Wedding look",      category: "Bridal", tall: true },
  { id: 4,  srcs: ["/IMG-20260602-WA0007.jpg"],                                              alt: "Prom makeup",      note: "Prom",        category: "Glam"           },
  { id: 5,  srcs: ["/Danielle.png"],   video:"/VID-20260630-WA0014.mp4",                                           alt: "Natural glam",       note: "",   category: "Glam"                },
  { id: 6,  srcs: ["/mummy.jpg"],   video: "/mummyvideo.mp4",                      alt: "Soft glam",          note: "",       category: "Glam",      tall: true },
  //{ id: 7,  srcs: ["/portfolio-7.jpg"],                                              alt: "Bridal party",       note: "Bridal party of four",             category: "Bridal"              },
//  { id: 8,  srcs: ["/portfolio-8.jpg"],                                              alt: "Creative makeup",    note: "Creative collab with Nia Studios", category: "Editorial",          video: "/portfolio-8-reel.mp4" },
  //{ id: 9,  srcs: ["/portfolio-9.jpg"],                                              alt: "Prom glam",          note: "Prom ready ✨",                     category: "Glam"                },
  //{ id: 10, srcs: ["/portfolio-10.jpg", "/portfolio-10b.jpg"],                       alt: "Monochromatic look", note: "Monochromatic — inspired by dusk", category: "Editorial", tall: true },
  //{ id: 11, srcs: ["/portfolio-11.jpg"],                                             alt: "Soft bridal",        note: "Soft bridal — her dream look",     category: "Bridal"              },
 // { id: 12, srcs: ["/portfolio-12.jpg"],                                             alt: "Glam night out",     note: "Night out glam",                   category: "Glam"                },
];

// Filters appear in this order when they have looks in them; any other category follows.
const CATEGORY_ORDER = ["Bridal", "Glam", "Editorial"];

/** Paths without a leading slash would load relative to /Portfolio and break. */
const asset = (src: string) => (/^(https?:)?\//.test(src) ? src : `/${src}`);

type Slide = { type: "image" | "video"; src: string; poster?: string };

function slidesFor(img: PortfolioImage): Slide[] {
  const photos: Slide[] = img.srcs.map(src => ({ type: "image", src: asset(src) }));
  return img.video ? [...photos, { type: "video", src: asset(img.video), poster: asset(img.srcs[0]) }] : photos;
}

// `uploaded` comes from Admin → Portfolio and is shown before the built-in images.
export default function Portfolio({ uploaded = [] }: { uploaded?: PortfolioImage[] }) {
  const images = useMemo(() => [...uploaded, ...builtInImages], [uploaded]);
  const [active, setActive] = useState("All");
  const [viewer, setViewer] = useState<{ entry: number; slide: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    images.forEach(img => img.category && counts.set(img.category, (counts.get(img.category) ?? 0) + 1));
    const names = [...counts.keys()].sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a), ib = CATEGORY_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
    });
    return [{ name: "All", count: images.length }, ...names.map(name => ({ name, count: counts.get(name)! }))];
  }, [images]);

  const filtered = active === "All" ? images : images.filter(img => img.category === active);
  const current = viewer ? filtered[viewer.entry] : null;
  const slides = current ? slidesFor(current) : [];
  const slide = viewer ? slides[viewer.slide] : null;

  const open = (entry: number, trigger: HTMLElement) => {
    lastTrigger.current = trigger;
    setViewer({ entry, slide: 0 });
  };

  const close = useCallback(() => {
    setViewer(null);
    lastTrigger.current?.focus();
  }, []);

  // Arrows run through every photo (and video) of a look, then on to the next look.
  const step = useCallback(
    (dir: 1 | -1) => {
      setViewer(v => {
        if (!v) return v;
        const count = slidesFor(filtered[v.entry]).length;
        const nextSlide = v.slide + dir;
        if (nextSlide >= 0 && nextSlide < count) return { ...v, slide: nextSlide };
        const entry = (v.entry + dir + filtered.length) % filtered.length;
        return { entry, slide: dir === 1 ? 0 : slidesFor(filtered[entry]).length - 1 };
      });
    },
    [filtered]
  );

  useEffect(() => {
    if (!viewer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [viewer, close, step]);

  // Move focus into the viewer when it opens.
  const isOpen = viewer !== null;
  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lora:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400&display=swap');

        .pf-page { width: 100%; background-color: #faf6f1; color: #2c1f14; }

        /* ── Header ── */
        .pf-header {
          max-width: 1180px;
          margin: 0 auto;
          padding: 56px 32px 36px;
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px 40px;
        }
        .pf-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: clamp(2.6rem, 6vw, 4.2rem);
          line-height: 1;
          letter-spacing: -0.01em;
        }
        .pf-title em { font-weight: 400; color: #a07840; }
        .pf-intro {
          font-family: 'Lora', Georgia, serif;
          font-size: 0.95rem; line-height: 1.75;
          color: #7a5c46;
          max-width: 360px;
        }

        /* ── Filters (stick under the nav while scrolling) ── */
        .pf-filters-bar {
          position: sticky;
          top: 64px;
          z-index: 20;
          background: rgba(250, 246, 241, 0.94);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-top: 1px solid #ece2d8;
          border-bottom: 1px solid #ece2d8;
        }
        .pf-filters {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          gap: 28px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .pf-filters::-webkit-scrollbar { display: none; }
        .pf-filter {
          position: relative;
          flex-shrink: 0;
          display: inline-flex; align-items: baseline; gap: 6px;
          height: 52px;
          padding: 0;
          background: none; border: none; cursor: pointer;
          font-family: 'Jost', sans-serif; font-weight: 400;
          font-size: 0.74rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: #9a8470;
          transition: color 0.2s ease;
          align-items: center;
        }
        .pf-filter sup { font-size: 0.62rem; letter-spacing: 0; color: #b8a28e; }
        .pf-filter::after {
          content: '';
          position: absolute; left: 0; right: 0; bottom: -1px;
          height: 2px; background: #a07840;
          transform: scaleX(0); transition: transform 0.25s ease;
        }
        .pf-filter:hover { color: #2c1f14; }
        .pf-filter[aria-pressed="true"] { color: #2c1f14; }
        .pf-filter[aria-pressed="true"]::after { transform: scaleX(1); }

        /* ── Masonry grid ── */
        .pf-grid {
          max-width: 1180px;
          margin: 0 auto;
          padding: 36px 32px 72px;
          columns: 3;
          column-gap: 20px;
        }
        .pf-item {
          display: block;
          width: 100%;
          break-inside: avoid;
          margin: 0 0 28px;
          padding: 0;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          animation: pfIn 0.6s ease both;
        }
        .pf-item:focus-visible { outline: 2px solid #a07840; outline-offset: 4px; }
        .pf-media {
          position: relative;
          overflow: hidden;
          background: #ece2d8;
          border-radius: 2px;
        }
        .pf-media img {
          display: block;
          width: 100%;
          height: auto;
          transition: transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1), filter 0.4s ease;
        }
        .pf-item:hover .pf-media img { transform: scale(1.035); }
        .pf-media::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(28, 20, 14, 0.35), transparent 40%);
          opacity: 0; transition: opacity 0.4s ease;
        }
        .pf-item:hover .pf-media::after { opacity: 1; }

        .pf-badges {
          position: absolute; top: 10px; right: 10px; z-index: 2;
          display: flex; gap: 6px;
        }
        .pf-badge {
          display: inline-flex; align-items: center; gap: 5px;
          height: 26px; padding: 0 9px;
          border-radius: 999px;
          background: rgba(28, 20, 14, 0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: #faf6f1;
          font-family: 'Jost', sans-serif; font-size: 0.68rem; letter-spacing: 0.04em;
        }

        .pf-caption {
          display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
          padding-top: 10px;
        }
        .pf-caption-note {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.15rem; line-height: 1.25; color: #2c1f14;
        }
        .pf-caption-cat {
          flex-shrink: 0;
          font-family: 'Jost', sans-serif; font-weight: 400;
          font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: #a07840;
        }

        .pf-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 64px 0;
          font-family: 'Lora', Georgia, serif; font-style: italic; color: #9a8470;
        }

        /* ── Closing call to action ── */
        .pf-cta {
          border-top: 1px solid #ece2d8;
          text-align: center;
          padding: 72px 24px 88px;
        }
        .pf-cta h2 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500; font-size: clamp(2rem, 4vw, 2.8rem); line-height: 1.1;
          margin-bottom: 12px;
        }
        .pf-cta h2 em { font-weight: 400; color: #a07840; }
        .pf-cta p {
          font-family: 'Lora', Georgia, serif; font-size: 0.95rem; color: #7a5c46;
          max-width: 380px; margin: 0 auto 28px; line-height: 1.7;
        }
        .pf-cta-btn {
          display: inline-flex; align-items: center; gap: 12px;
          height: 52px; padding: 0 30px; border-radius: 999px;
          background: #2c1f14; color: #faf6f1;
          font-family: 'Jost', sans-serif; font-size: 0.74rem;
          letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none;
          transition: background 0.25s ease;
        }
        .pf-cta-btn:hover { background: #a07840; }

        @keyframes pfIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Viewer ── */
        .pf-viewer {
          position: fixed; inset: 0; z-index: 1000;
          display: flex; flex-direction: column;
          background: #120c08;
          color: #faf6f1;
          animation: pfFade 0.2s ease;
        }
        @keyframes pfFade { from { opacity: 0; } to { opacity: 1; } }
        .pf-vbar {
          display: flex; align-items: center; justify-content: space-between;
          height: 60px; padding: 0 20px; flex-shrink: 0;
          font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(250, 246, 241, 0.6);
        }
        .pf-vclose, .pf-varrow {
          display: inline-flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 999px;
          border: 1px solid rgba(250, 246, 241, 0.18);
          background: rgba(250, 246, 241, 0.04);
          color: #faf6f1; cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .pf-vclose:hover, .pf-varrow:hover { background: rgba(250, 246, 241, 0.12); border-color: rgba(250, 246, 241, 0.35); }
        .pf-vclose:focus-visible, .pf-varrow:focus-visible, .pf-thumb:focus-visible { outline: 2px solid #e8c99a; outline-offset: 2px; }
        .pf-stage {
          position: relative;
          flex: 1; min-height: 0;
          display: flex; align-items: center; justify-content: center;
          padding: 0 84px;
          touch-action: pan-y;
        }
        .pf-stage img, .pf-stage video {
          max-width: 100%; max-height: 100%;
          object-fit: contain; display: block;
          animation: pfFade 0.25s ease;
        }
        .pf-stage video { background: #000; }
        .pf-varrow { position: absolute; top: 50%; transform: translateY(-50%); }
        .pf-varrow.prev { left: 20px; }
        .pf-varrow.next { right: 20px; }
        .pf-vfoot {
          flex-shrink: 0;
          padding: 16px 20px 20px;
          display: flex; flex-direction: column; align-items: center; gap: 14px;
        }
        .pf-vcaption { text-align: center; min-height: 1.4em; }
        .pf-vcaption strong {
          font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 500;
          font-size: 1.3rem; margin-right: 10px;
        }
        .pf-vcaption span {
          font-family: 'Jost', sans-serif; font-size: 0.66rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: #c9a96e;
        }
        .pf-thumbs { display: flex; gap: 8px; overflow-x: auto; max-width: 100%; padding: 2px; }
        .pf-thumb {
          position: relative; flex-shrink: 0;
          width: 56px; height: 56px; padding: 0;
          border: 1px solid transparent; border-radius: 4px; overflow: hidden;
          background: #241911; cursor: pointer; opacity: 0.5;
          transition: opacity 0.2s ease, border-color 0.2s ease;
        }
        .pf-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .pf-thumb[aria-current="true"] { opacity: 1; border-color: #e8c99a; }
        .pf-thumb:hover { opacity: 0.85; }
        .pf-thumb-play {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0, 0, 0, 0.35);
        }

        @media (max-width: 1024px) {
          .pf-grid { columns: 2; }
        }
        @media (max-width: 640px) {
          .pf-header { padding: 36px 20px 24px; }
          .pf-intro { font-size: 0.9rem; }
          .pf-filters { padding: 0 20px; gap: 22px; }
          .pf-filter { height: 48px; }
          .pf-grid { padding: 20px 14px 48px; column-gap: 12px; }
          .pf-item { margin-bottom: 20px; }
          .pf-caption { flex-direction: column; gap: 2px; padding-top: 8px; }
          .pf-caption-note { font-size: 1rem; }
          .pf-caption-cat { font-size: 0.6rem; }
          .pf-badge { height: 22px; padding: 0 7px; font-size: 0.62rem; }
          .pf-stage { padding: 0; }
          .pf-varrow { display: none; }
          .pf-vbar { padding: 0 12px; }
          .pf-cta { padding: 56px 20px 64px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pf-item, .pf-viewer, .pf-stage img, .pf-stage video { animation: none; }
          .pf-media img { transition: none; }
        }
      `}</style>

      <div className="pf-page">
        <header className="pf-header">
          <div>
            <h1 className="pf-title">
              The <em>portfolio</em>
            </h1>
          </div>
          <p className="pf-intro">
            Soft glam for brides, special occasions and shoots. Tap any look to see every photo and video.
          </p>
        </header>

        {categories.length > 2 && (
          <div className="pf-filters-bar">
            <div className="pf-filters" role="group" aria-label="Filter looks">
              {categories.map(c => (
                <button
                  key={c.name}
                  className="pf-filter"
                  aria-pressed={active === c.name}
                  onClick={() => setActive(c.name)}
                >
                  {c.name}
                  <sup>{c.count}</sup>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pf-grid">
          {filtered.length === 0 && <p className="pf-empty">No looks in this category yet.</p>}
          {filtered.map((img, i) => (
            <button
              key={`${active}-${img.id}`}
              className="pf-item"
              style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}
              onClick={e => open(i, e.currentTarget)}
              aria-label={`Open ${img.note || img.alt || "look"}${img.srcs.length > 1 ? `, ${img.srcs.length} photos` : ""}${img.video ? ", with video" : ""}`}
            >
              <div className="pf-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(img.srcs[0])} alt={img.alt} loading={i < 6 ? "eager" : "lazy"} />
                {(img.srcs.length > 1 || img.video) && (
                  <div className="pf-badges" aria-hidden="true">
                    {img.srcs.length > 1 && (
                      <span className="pf-badge">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="7" width="13" height="13" rx="2" /><path d="M4 16V5a1 1 0 0 1 1-1h11" /></svg>
                        {img.srcs.length}
                      </span>
                    )}
                    {img.video && (
                      <span className="pf-badge">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
                        Video
                      </span>
                    )}
                  </div>
                )}
              </div>
              {(img.note || img.category) && (
                <div className="pf-caption">
                  <span className="pf-caption-note">{img.note || img.alt}</span>
                  {img.category && <span className="pf-caption-cat">{img.category}</span>}
                </div>
              )}
            </button>
          ))}
        </div>

        <section className="pf-cta">
          <h2>
            Love what you <em>see?</em>
          </h2>
          <p>Tell me about your day and let&apos;s create a look that feels like you.</p>
          <Link href="/Request-Appointment" className="pf-cta-btn">
            Request appointment
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </section>
      </div>

      {/* ── Viewer ── */}
      {viewer && current && slide && (
        <div className="pf-viewer" role="dialog" aria-modal="true" aria-label={current.note || current.alt || "Portfolio look"}>
          <div className="pf-vbar">
            <span>
              {viewer.entry + 1} / {filtered.length}
              {slides.length > 1 && ` · ${slide.type === "video" ? "Video" : `Photo ${viewer.slide + 1} of ${current.srcs.length}`}`}
            </span>
            <button ref={closeRef} className="pf-vclose" onClick={close} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>

          <div
            className="pf-stage"
            onClick={e => e.target === e.currentTarget && close()}
            onTouchStart={e => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={e => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            }}
          >
            {slide.type === "video" ? (
              <video key={slide.src} src={slide.src} poster={slide.poster} controls playsInline autoPlay />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={slide.src} src={slide.src} alt={current.alt} />
            )}
            {(filtered.length > 1 || slides.length > 1) && (
              <>
                <button className="pf-varrow prev" onClick={() => step(-1)} aria-label="Previous">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
                </button>
                <button className="pf-varrow next" onClick={() => step(1)} aria-label="Next">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
                </button>
              </>
            )}
          </div>

          <div className="pf-vfoot">
            <div className="pf-vcaption">
              {current.note && <strong>{current.note}</strong>}
              {current.category && <span>{current.category}</span>}
            </div>
            {slides.length > 1 && (
              <div className="pf-thumbs">
                {slides.map((s, i) => (
                  <button
                    key={s.src}
                    className="pf-thumb"
                    aria-current={i === viewer.slide}
                    aria-label={s.type === "video" ? "Play video" : `Photo ${i + 1}`}
                    onClick={() => setViewer({ ...viewer, slide: i })}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.type === "video" ? s.poster : s.src} alt="" />
                    {s.type === "video" && (
                      <span className="pf-thumb-play">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#faf6f1"><path d="M7 4.5v15l13-7.5z" /></svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
