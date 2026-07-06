"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

interface PortfolioImage {
  id: number;
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
//                     (cover image shows in the grid; video plays in lightbox)
const images: PortfolioImage[] = [
  { id: 1,  srcs: ["/betty1.jpg", "/betty2.jpg"],    video: "betty-video.mp4",                                          alt: "Soft glam look",     note: "",     category: "",      tall: true },
  { id: 2,  srcs: ["/remi.png", "/remi2.png", "/remi3.png"],                         alt: "Bridal makeup",      note: "",              category: "Glam"              },
  { id: 3,  srcs: ["/ojono-pic.jpg",   "/IMG-20260507-WA0014.jpg"],    alt: "Bridal look",     note: "Weeding Look",      category: "Bridal", tall: true },
  { id: 4,  srcs: ["/IMG-20260602-WA0007.jpg"],                                              alt: "",      note: "Prom",        category: "Glam"           },
  { id: 5,  srcs: ["/Danielle.png"],   video:"VID-20260630-WA0014.mp4",                                           alt: "Natural glam",       note: "",   category: "Glam"                },
 { id: 6,  srcs: ["/mummy.jpg"],   video: "mummyvideo.mp4",                      alt: "Soft glam",          note: "",       category: "Glam",      tall: true },
  //{ id: 7,  srcs: ["/portfolio-7.jpg"],                                              alt: "Bridal party",       note: "Bridal party of four",             category: "Bridal"              },
//  { id: 8,  srcs: ["/portfolio-8.jpg"],                                              alt: "Creative makeup",    note: "Creative collab with Nia Studios", category: "Editorial",          video: "/portfolio-8-reel.mp4" },
  //{ id: 9,  srcs: ["/portfolio-9.jpg"],                                              alt: "Prom glam",          note: "Prom ready ✨",                     category: "Glam"                },
  //{ id: 10, srcs: ["/portfolio-10.jpg", "/portfolio-10b.jpg"],                       alt: "Monochromatic look", note: "Monochromatic — inspired by dusk", category: "Editorial", tall: true },
  //{ id: 11, srcs: ["/portfolio-11.jpg"],                                             alt: "Soft bridal",        note: "Soft bridal — her dream look",     category: "Bridal"              },
 // { id: 12, srcs: ["/portfolio-12.jpg"],                                             alt: "Glam night out",     note: "Night out glam",                   category: "Glam"                },
];

const CATEGORIES = ["All", "Glam", "Bridal", "Editorial"];

export default function Portfolio() {
  const [active, setActive]       = useState("All");
  const [lightbox, setLightbox]   = useState<PortfolioImage | null>(null);
  const [photoIdx, setPhotoIdx]   = useState(0);
  const [showVideo, setShowVideo] = useState(false); // true = show video tab in lightbox
  const videoRef = useRef<HTMLVideoElement>(null);

  const filtered = active === "All" ? images : images.filter(img => img.category === active);

  const openLightbox = (img: PortfolioImage, idx = 0) => {
    setLightbox(img);
    setPhotoIdx(idx);
    setShowVideo(false);
  };
  const closeLightbox = useCallback(() => {
    setLightbox(null);
    setPhotoIdx(0);
    setShowVideo(false);
  }, []);

  const navigateEntry = useCallback((dir: 1 | -1) => {
    if (!lightbox) return;
    const idx = filtered.findIndex(i => i.id === lightbox.id);
    const next = filtered[(idx + dir + filtered.length) % filtered.length];
    setLightbox(next);
    setPhotoIdx(0);
    setShowVideo(false);
  }, [lightbox, filtered]);

  const navigatePhoto = useCallback((dir: 1 | -1) => {
    if (!lightbox) return;
    setPhotoIdx(prev => (prev + dir + lightbox.srcs.length) % lightbox.srcs.length);
  }, [lightbox]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") {
        if (lightbox && !showVideo && lightbox.srcs.length > 1) navigatePhoto(1);
        else navigateEntry(1);
      }
      if (e.key === "ArrowLeft") {
        if (lightbox && !showVideo && lightbox.srcs.length > 1) navigatePhoto(-1);
        else navigateEntry(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeLightbox, navigateEntry, navigatePhoto, lightbox, showVideo]);

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  // Pause video when switching away from video tab
  useEffect(() => {
    if (!showVideo && videoRef.current) {
      videoRef.current.pause();
    }
  }, [showVideo]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lora:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400&display=swap');
        * { box-sizing: border-box; }

        .pf-page { width: 100%; background-color: #faf6f1; }

        .pf-banner {
          width: 100%;
          background-color: #c4958a;
          padding: 52px 24px 56px;
          text-align: center;
        }
        .pf-banner-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: 2rem;
          color: #faf6f1;
          letter-spacing: 0.08em;
          margin-bottom: 20px;
        }
        .pf-banner-divider {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; margin-bottom: 20px;
        }
        .pf-banner-line { height: 1px; width: 40px; background: rgba(250,246,241,0.35); }
        .pf-banner-star { color: rgba(250,246,241,0.6); font-size: 0.6rem; }
        .pf-banner-sub {
          font-family: 'Lora', Georgia, serif;
          font-size: 0.88rem; line-height: 1.85;
          color: rgba(250,246,241,0.88);
          max-width: 420px; margin: 0 auto;
        }

        .pf-filters {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; flex-wrap: wrap;
          padding: 40px 24px 0;
        }
        .pf-pill {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 8px 22px;
          border-radius: 999px;
          border: 1px solid rgba(201,169,110,0.4);
          color: #7a5c46;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pf-pill:hover { border-color: #c9a96e; color: #2c1f14; }
        .pf-pill.active {
          background: linear-gradient(135deg, #c9a96e, #a07840);
          border-color: transparent;
          color: #faf6f1;
        }

        /* ══ DESKTOP masonry grid ══ */
        .pf-grid {
          columns: 3;
          column-gap: 16px;
          padding: 40px 40px 64px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .pf-grid-item {
          break-inside: avoid;
          margin-bottom: 16px;
          position: relative;
          cursor: pointer;
          overflow: hidden;
          background: #e8ddd4;
        }
        .pf-grid-item img {
          width: 100%;
          display: block;
          transition: transform 0.45s ease;
          object-fit: cover;
          object-position: top;
        }
        .pf-grid-item:hover img { transform: scale(1.04); }

        .pf-grid-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(44,31,20,0.72) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 16px;
        }
        .pf-grid-item:hover .pf-grid-overlay { opacity: 1; }
        .pf-grid-note {
          font-family: 'Lora', Georgia, serif;
          font-style: italic;
          font-size: 0.78rem;
          color: rgba(250,246,241,0.9);
          line-height: 1.5;
          margin-bottom: 4px;
        }
        .pf-grid-category {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a96e;
        }
        .pf-expand-icon {
          position: absolute;
          top: 12px; right: 12px;
          width: 28px; height: 28px;
          border-radius: 50%;
          background: rgba(250,246,241,0.15);
          border: 1px solid rgba(250,246,241,0.35);
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          color: #faf6f1;
          font-size: 0.7rem;
        }
        .pf-grid-item:hover .pf-expand-icon { opacity: 1; }

        /* ══ MOBILE feed ══ */
        .pf-feed { display: none; }

        @media (max-width: 768px) {
          .pf-grid { display: none; }
          .pf-feed {
            display: flex;
            flex-direction: column;
            gap: 0;
            padding: 24px 0 64px;
          }
          .pf-feed-item {
            position: relative;
            width: 100%;
            background: #e8ddd4;
            cursor: pointer;
          }
          .pf-feed-item img {
            width: 100%;
            aspect-ratio: 1/1;
            object-fit: cover;
            object-position: top;
            display: block;
          }
          .pf-feed-caption {
            padding: 12px 16px 20px;
            border-bottom: 1px solid #e8ddd4;
          }
          .pf-feed-caption-category {
            font-family: 'Jost', sans-serif;
            font-weight: 300;
            font-size: 0.62rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #c9a96e;
            margin-bottom: 4px;
          }
          .pf-feed-caption-note {
            font-family: 'Lora', Georgia, serif;
            font-style: italic;
            font-size: 0.82rem;
            line-height: 1.6;
            color: #7a5c46;
          }
          .pf-filters { padding: 24px 16px 0; gap: 8px; }
          .pf-pill { font-size: 0.65rem; padding: 7px 16px; }
          .pf-banner-title { font-size: 1.6rem; }
        }

        /* badges (multi-photo & video) */
        .pf-multi-badge, .pf-video-badge {
          position: absolute;
          top: 10px; left: 10px;
          background: rgba(20,10,5,0.55);
          border: 1px solid rgba(201,169,110,0.5);
          color: #c9a96e;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 999px;
          z-index: 3;
          display: flex; align-items: center; gap: 4px;
        }
        /* when both badges needed, stack them */
        .pf-video-badge + .pf-multi-badge,
        .pf-multi-badge + .pf-video-badge {
          top: 34px;
        }

        /* ══ LIGHTBOX ══ */
        .pf-lightbox {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(20, 10, 5, 0.94);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: lbFadeIn 0.2s ease;
        }
        @keyframes lbFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .pf-lb-inner {
          position: relative;
          max-width: 720px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pf-lb-img-wrap {
          width: 100%;
          max-height: 75vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pf-lb-img-wrap img {
          width: 100%;
          height: 100%;
          max-height: 75vh;
          object-fit: contain;
          display: block;
        }
        /* Video player in lightbox */
        .pf-lb-video-wrap {
          width: 100%;
          max-height: 75vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }
        .pf-lb-video-wrap video {
          width: 100%;
          max-height: 75vh;
          display: block;
          outline: none;
        }

        /* Photo / Video toggle tabs */
        .pf-lb-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 12px;
          border: 1px solid rgba(201,169,110,0.3);
          border-radius: 999px;
          overflow: hidden;
        }
        .pf-lb-tab {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 7px 20px;
          background: transparent;
          border: none;
          color: rgba(250,246,241,0.5);
          cursor: pointer;
          transition: all 0.2s;
        }
        .pf-lb-tab.active {
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: #faf6f1;
        }

        .pf-lb-caption {
          margin-top: 16px;
          text-align: center;
        }
        .pf-lb-note {
          font-family: 'Lora', Georgia, serif;
          font-style: italic;
          font-size: 0.88rem;
          color: rgba(250,246,241,0.8);
          margin-bottom: 4px;
        }
        .pf-lb-category {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.62rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c9a96e;
        }
        .pf-lb-close {
          position: absolute;
          top: -48px; right: 0;
          background: none; border: none; cursor: pointer;
          color: rgba(250,246,241,0.7);
          font-size: 1.4rem;
          line-height: 1;
          transition: color 0.2s;
        }
        .pf-lb-close:hover { color: #faf6f1; }
        .pf-lb-arrow {
          position: fixed;
          top: 50%; transform: translateY(-50%);
          background: rgba(250,246,241,0.08);
          border: 1px solid rgba(250,246,241,0.15);
          color: rgba(250,246,241,0.7);
          width: 44px; height: 44px;
          border-radius: 50%;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        .pf-lb-arrow:hover { background: rgba(250,246,241,0.16); color: #faf6f1; }
        .pf-lb-arrow.prev { left: 20px; }
        .pf-lb-arrow.next { right: 20px; }
        .pf-lb-counter {
          position: absolute;
          bottom: -36px;
          left: 50%; transform: translateX(-50%);
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: rgba(250,246,241,0.4);
          white-space: nowrap;
        }
        .pf-lb-dots {
          display: flex; align-items: center; justify-content: center;
          gap: 6px; margin-top: 14px;
        }
        .pf-lb-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(250,246,241,0.25);
          border: none; cursor: pointer; padding: 0;
          transition: background 0.2s;
        }
        .pf-lb-dot.active { background: #c9a96e; }

        .pf-cta-wrap {
          display: flex; justify-content: center;
          padding: 0 24px 64px;
        }
        .pf-cta-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: #faf6f1;
          font-family: 'Jost', sans-serif;
          font-weight: 300; font-size: 0.75rem;
          letter-spacing: 0.2em; text-transform: uppercase;
          text-decoration: none;
          padding: 14px 40px;
          border-radius: 999px;
          box-shadow: 0 4px 18px rgba(201,169,110,0.28);
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        .pf-cta-btn:hover { box-shadow: 0 8px 32px rgba(201,169,110,0.45); transform: translateY(-1px); }
        .pf-cta-btn:active { transform: translateY(0); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pf-fade-up { animation: fadeUp 0.6s ease both; }
      `}</style>

      <div className="pf-page">

        {/* ── Banner ── */}
        <div className="pf-banner pf-fade-up">
          <h1 className="pf-banner-title">Portfolio</h1>
          <div className="pf-banner-divider">
            <div className="pf-banner-line" />
            <span className="pf-banner-star">✦</span>
            <div className="pf-banner-line" />
          </div>
          <p className="pf-banner-sub">
            A collection of looks created with love
          </p>
        </div>

        {/* ── Filter pills ── */}
        <div className="pf-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`pf-pill${active === cat ? " active" : ""}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ══ DESKTOP masonry grid ══ */}
        <div className="pf-grid">
          {filtered.map((img, i) => (
            <div
              key={img.id}
              className="pf-grid-item pf-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => openLightbox(img, 0)}
            >
              <img src={img.srcs[0]} alt={img.alt} loading="lazy" />
              {img.video && (
                <div className="pf-video-badge">▶ Video</div>
              )}
              {img.srcs.length > 1 && (
                <div className="pf-multi-badge">+{img.srcs.length} photos</div>
              )}
              <div className="pf-grid-overlay">
                {img.note && <p className="pf-grid-note">{img.note}</p>}
                {img.category && <span className="pf-grid-category">{img.category}</span>}
              </div>
              <div className="pf-expand-icon">⤢</div>
            </div>
          ))}
        </div>

        {/* ══ MOBILE feed ══ */}
        <div className="pf-feed">
          {filtered.map((img) => (
            <div key={img.id} className="pf-feed-item" onClick={() => openLightbox(img, 0)}>
              <img src={img.srcs[0]} alt={img.alt} loading="lazy" />
              <div className="pf-feed-caption">
                {img.category && (
                  <p className="pf-feed-caption-category">
                    {img.category}
                    {img.srcs.length > 1 ? ` · ${img.srcs.length} photos` : ""}
                    {img.video ? " · Video" : ""}
                  </p>
                )}
                {img.note && <p className="pf-feed-caption-note">{img.note}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* ── Book CTA ── */}
        <div className="pf-cta-wrap">
          <Link href="/Request-Appointment" className="pf-cta-btn">
            Request Appointment ✦
          </Link>
        </div>

      </div>

      {/* ══ LIGHTBOX ══ */}
      {lightbox && (
        <div className="pf-lightbox" onClick={closeLightbox}>
          <div className="pf-lb-inner" onClick={e => e.stopPropagation()}>
            <button className="pf-lb-close" onClick={closeLightbox}>✕</button>

            {/* Photo / Video tabs — only shown when entry has both */}
            {lightbox.video && (
              <div className="pf-lb-tabs">
                <button
                  className={`pf-lb-tab${!showVideo ? " active" : ""}`}
                  onClick={() => setShowVideo(false)}
                >
                  Photos
                </button>
                <button
                  className={`pf-lb-tab${showVideo ? " active" : ""}`}
                  onClick={() => setShowVideo(true)}
                >
                  ▶ Video
                </button>
              </div>
            )}

            {/* Media area */}
            {showVideo && lightbox.video ? (
              <div className="pf-lb-video-wrap">
                <video
                  ref={videoRef}
                  src={lightbox.video}
                  controls
                  playsInline
                  autoPlay
                />
              </div>
            ) : (
              <div className="pf-lb-img-wrap">
                <img src={lightbox.srcs[photoIdx]} alt={lightbox.alt} />
              </div>
            )}

            {(lightbox.note || lightbox.category) && (
              <div className="pf-lb-caption">
                {lightbox.note && <p className="pf-lb-note">{lightbox.note}</p>}
                {lightbox.category && <span className="pf-lb-category">{lightbox.category}</span>}
              </div>
            )}

            {/* Dot indicators — only for photo view with multiple photos */}
            {!showVideo && lightbox.srcs.length > 1 && (
              <div className="pf-lb-dots">
                {lightbox.srcs.map((_, i) => (
                  <button
                    key={i}
                    className={`pf-lb-dot${i === photoIdx ? " active" : ""}`}
                    onClick={() => setPhotoIdx(i)}
                  />
                ))}
              </div>
            )}

            <span className="pf-lb-counter">
              {showVideo
                ? `Video · ${filtered.findIndex(i => i.id === lightbox.id) + 1} of ${filtered.length}`
                : lightbox.srcs.length > 1
                  ? `${photoIdx + 1} / ${lightbox.srcs.length} · ${filtered.findIndex(i => i.id === lightbox.id) + 1} of ${filtered.length}`
                  : `${filtered.findIndex(i => i.id === lightbox.id) + 1} / ${filtered.length}`
              }
            </span>
          </div>

          {/* Arrows: navigate photos when in photo view with multiple; otherwise navigate entries */}
          <button
            className="pf-lb-arrow prev"
            onClick={e => {
              e.stopPropagation();
              if (!showVideo && lightbox.srcs.length > 1) navigatePhoto(-1);
              else navigateEntry(-1);
            }}
          >
            ‹
          </button>
          <button
            className="pf-lb-arrow next"
            onClick={e => {
              e.stopPropagation();
              if (!showVideo && lightbox.srcs.length > 1) navigatePhoto(1);
              else navigateEntry(1);
            }}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}