import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lora:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400&display=swap');

        .hero {
          position: relative;
          width: 100%;
          /* Full screen: the nav floats over the top of the photo */
          height: 100vh;
          height: 100svh;
          min-height: 620px;
          overflow: hidden;
          background: #1c140e;
          color: #faf6f1;
        }

        /* Slow push-in on the photo */
        .hero-media {
          position: absolute;
          inset: 0;
          animation: heroZoom 18s ease-out both;
        }
        @keyframes heroZoom {
          from { transform: scale(1.08); }
          to   { transform: scale(1); }
        }

        /* Shading: darker on the left and bottom where the text sits, so the face stays bright */
        .hero-shade {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(to top, rgba(20, 12, 6, 0.85) 0%, rgba(20, 12, 6, 0.25) 42%, transparent 65%),
            linear-gradient(to right, rgba(20, 12, 6, 0.55) 0%, rgba(20, 12, 6, 0.15) 45%, transparent 70%);
        }

        .hero-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 56px 56px;
        }
        .hero-inner { max-width: 560px; }

        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 22px;
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          font-size: 0.7rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #e8c99a;
        }
        .hero-eyebrow::before {
          content: '';
          width: 36px;
          height: 1px;
          background: rgba(232, 201, 154, 0.7);
        }

        .hero-headline {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: clamp(2.7rem, 6vw, 4.6rem);
          line-height: 1.02;
          letter-spacing: -0.01em;
          margin-bottom: 22px;
        }
        .hero-headline em {
          font-weight: 400;
          color: #e8c99a;
        }

        .hero-sub {
          font-family: 'Lora', Georgia, serif;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(250, 246, 241, 0.82);
          max-width: 420px;
          margin-bottom: 34px;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px 24px;
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          height: 52px;
          padding: 0 30px;
          border-radius: 999px;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: #faf6f1;
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          font-size: 0.74rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 0 10px 30px rgba(160, 120, 64, 0.35);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .hero-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 36px rgba(160, 120, 64, 0.5);
        }
        .hero-cta svg { transition: transform 0.25s ease; }
        .hero-cta:hover svg { transform: translateX(3px); }

        .hero-link {
          position: relative;
          padding: 6px 0;
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          font-size: 0.74rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #faf6f1;
          text-decoration: none;
        }
        .hero-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: rgba(250, 246, 241, 0.5);
          transform-origin: left;
          transition: background 0.25s ease;
        }
        .hero-link:hover::after { background: #e8c99a; }

        .hero-cta:focus-visible,
        .hero-link:focus-visible,
        .hero-scroll:focus-visible {
          outline: 1px solid #e8c99a;
          outline-offset: 4px;
        }

        /* Scroll cue, bottom right */
        .hero-scroll {
          position: absolute;
          right: 40px;
          bottom: 40px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: rgba(250, 246, 241, 0.6);
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          text-decoration: none;
          writing-mode: vertical-rl;
        }
        .hero-scroll-line {
          position: relative;
          width: 1px;
          height: 48px;
          overflow: hidden;
          background: rgba(250, 246, 241, 0.2);
        }
        .hero-scroll-line::after {
          content: '';
          position: absolute;
          left: 0;
          top: -50%;
          width: 1px;
          height: 50%;
          background: #e8c99a;
          animation: heroScroll 2.2s ease-in-out infinite;
        }
        @keyframes heroScroll {
          to { top: 100%; }
        }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-in { animation: heroFadeUp 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
        .hero-d1 { animation-delay: 0.15s; }
        .hero-d2 { animation-delay: 0.3s; }
        .hero-d3 { animation-delay: 0.45s; }
        .hero-d4 { animation-delay: 0.6s; }

        @media (prefers-reduced-motion: reduce) {
          .hero-media, .hero-in, .hero-scroll-line::after { animation: none; }
        }

        /* ── Phones ── */
        @media (max-width: 640px) {
          .hero { min-height: 560px; }
          .hero-shade {
            background:
              linear-gradient(to top, rgba(20, 12, 6, 0.92) 0%, rgba(20, 12, 6, 0.45) 45%, transparent 70%);
          }
          .hero-content { padding: 0 20px 44px; }
          .hero-eyebrow { font-size: 0.62rem; gap: 10px; margin-bottom: 16px; }
          .hero-eyebrow::before { width: 24px; }
          .hero-headline { font-size: clamp(2.3rem, 10.5vw, 2.9rem); margin-bottom: 16px; }
          .hero-sub { font-size: 0.92rem; margin-bottom: 26px; }
          .hero-actions { gap: 14px 20px; }
          .hero-cta { height: 48px; padding: 0 24px; }
          .hero-scroll { display: none; }
        }
      `}</style>

      <section className="hero" aria-label="Introduction">
        <div className="hero-media">
          <Image
            src="/ojono.png"
            alt="Bride in soft glam makeup by Myxprecioussmua"
            fill
            sizes="100vw"
            className="object-cover object-[40%_center] md:object-center"
            priority
          />
        </div>
        <div className="hero-shade" />

        <div className="hero-content">
          <div className="hero-inner">
            <p className="hero-eyebrow hero-in hero-d1">Makeup artist · Milton Keynes</p>

            <h1 className="hero-headline hero-in hero-d2">
              Creating stunning
              <br />
              <em>soft glam</em> looks
            </h1>

            <p className="hero-sub hero-in hero-d3">
              Enhancing natural beauty and helping you feel confident for every occasion.
            </p>

            <div className="hero-actions hero-in hero-d4">
              <Link href="/Request-Appointment" className="hero-cta">
                Request appointment
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link href="/Portfolio" className="hero-link">
                View portfolio
              </Link>
            </div>
          </div>
        </div>

        <a href="#services" className="hero-scroll hero-in hero-d4" aria-label="Scroll to services">
          Scroll
          <span className="hero-scroll-line" />
        </a>
      </section>
    </>
  );
}
