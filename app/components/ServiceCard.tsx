import Link from "next/link";

interface ServiceCard {
  title: string;
  subtitle?: string;
  description: string;
  image: string;        // e.g. "/bridal-service.jpg"
  href?: string;
}

const services: ServiceCard[] = [
  {
    title: "Bridal",
    description: "Bridal trial and special day service",
    image: "/IMG-20260507-WA0014.jpg",
    href: "/Bridal",
  },
  {
    title: "Occasion",
    description: "Prom, graduation, parties, baby showers etc",
    image: "/IMG-20260602-WA0007.jpg",
    href: "/Occasion",
  },
  {
    title: "Collaboration",
    description: "Content creation, photo-shoot, commercial etc.",
    image: "/remi2.png",
    href: "/Collab",
  },
];

export default function ServicesCards() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lora:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400&display=swap');

        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sv-fade-up   { animation: fadeUp 0.7s ease both; }
        .sv-delay-1   { animation-delay: 0.1s; }
        .sv-delay-2   { animation-delay: 0.22s; }
        .sv-delay-3   { animation-delay: 0.34s; }

        /* ── Section ── */
        .sv-section {
          width: 100%;
          background-color: #faf6f1;
          padding: 80px 40px 96px;
        }

        /* ── Header ── */
        .sv-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .sv-eyebrow {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 12px;
        }
        .sv-heading {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: 2.6rem;
          color: #2c1f14;
          line-height: 1.1;
          margin-bottom: 0;
        }
        .sv-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 20px;
        }
        .sv-divider-line {
          height: 1px;
          width: 48px;
          background: rgba(201,169,110,0.4);
        }
        .sv-divider-star {
          color: #c9a96e;
          font-size: 0.65rem;
        }

        /* ── Grid ── */
        .sv-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1100px;
          margin: 0 auto;
        }

        /* ── Card ── */
        .sv-card {
          position: relative;
          display: block;
          text-decoration: none;
          overflow: hidden;
          aspect-ratio: 3/4;
          background: #e8ddd4;
          cursor: pointer;
        }

        /* Cover image */
        .sv-card-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          display: block;
          transition: transform 0.55s ease;
        }
        .sv-card:hover .sv-card-img { transform: scale(1.06); }

        /* Gradient overlay — always visible, deepens on hover */
        .sv-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(20, 10, 5, 0.88) 0%,
            rgba(20, 10, 5, 0.35) 45%,
            rgba(20, 10, 5, 0.08) 100%
          );
          transition: opacity 0.35s ease;
        }

        /* Thin gold top-edge accent line */
        .sv-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #c9a96e, transparent);
          z-index: 3;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .sv-card:hover::before { opacity: 1; }

        /* Text content */
        .sv-card-body {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 28px 24px 32px;
          z-index: 2;
        }

        .sv-card-category {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.58rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 10px;
          display: block;
        }

        .sv-card-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: 1.85rem;
          line-height: 1.05;
          color: #faf6f1;
          margin-bottom: 10px;
        }
        .sv-card-title span {
          display: block;
          font-weight: 400;
          font-size: 1.5rem;
          color: rgba(250,246,241,0.75);
        }

        /* Thin divider inside card */
        .sv-card-rule {
          width: 32px;
          height: 1px;
          background: rgba(201,169,110,0.5);
          margin-bottom: 10px;
          transition: width 0.35s ease;
        }
        .sv-card:hover .sv-card-rule { width: 56px; }

        .sv-card-desc {
          font-family: 'Lora', Georgia, serif;
          font-style: italic;
          font-size: 0.78rem;
          line-height: 1.7;
          color: rgba(250,246,241,0.65);
          transition: color 0.3s ease;
        }
        .sv-card:hover .sv-card-desc { color: rgba(250,246,241,0.85); }

        /* Arrow badge — appears on hover */
        .sv-card-arrow {
          position: absolute;
          top: 20px; right: 20px;
          width: 34px; height: 34px;
          border-radius: 50%;
          background: rgba(201,169,110,0.15);
          border: 1px solid rgba(201,169,110,0.4);
          display: flex; align-items: center; justify-content: center;
          color: #c9a96e;
          font-size: 0.8rem;
          z-index: 3;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .sv-card:hover .sv-card-arrow {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── CTA ── */
        .sv-cta-wrap {
          display: flex;
          justify-content: center;
          margin-top: 56px;
        }
        .sv-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: #faf6f1;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 14px 40px;
          border-radius: 999px;
          box-shadow: 0 4px 18px rgba(201,169,110,0.28);
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        .sv-cta-btn:hover {
          box-shadow: 0 8px 32px rgba(201,169,110,0.45);
          transform: translateY(-1px);
        }
        .sv-cta-btn:active { transform: translateY(0); }

        /* ── MOBILE ── */
        @media (max-width: 900px) {
          .sv-grid {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          /* Third card spans full width */
          .sv-card:last-child {
            grid-column: 1 / -1;
            aspect-ratio: 16/9;
          }
          .sv-heading { font-size: 2.1rem; }
        }

        @media (max-width: 600px) {
          .sv-section { padding: 56px 20px 72px; }
          .sv-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .sv-card { aspect-ratio: 4/5; }
          .sv-card:last-child {
            grid-column: auto;
            aspect-ratio: 4/5;
          }
          .sv-heading { font-size: 1.9rem; }
          .sv-card-title { font-size: 1.6rem; }
          .sv-card-title span { font-size: 1.3rem; }
        }
      `}</style>

      <section id="services" className="sv-section">

        {/* ── Header ── */}
        <div className="sv-header sv-fade-up">
          <p className="sv-eyebrow">How can I be of service</p>
          <h2 className="sv-heading">Our Services</h2>
          <div className="sv-divider">
            <div className="sv-divider-line" />
            <span className="sv-divider-star">✦</span>
            <div className="sv-divider-line" />
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="sv-grid">
          {services.map((svc, i) => (
            <Link
              key={svc.title}
              href={svc.href ?? "/Services"}
              className={`sv-card sv-fade-up sv-delay-${i + 1}`}
            >
              {/* Cover image */}
              <img className="sv-card-img" src={svc.image} alt={svc.title} />

              {/* Overlay */}
              <div className="sv-card-overlay" />

              {/* Hover arrow */}
              <div className="sv-card-arrow">→</div>

              {/* Text */}
              <div className="sv-card-body">
                <h3 className="sv-card-title">
                  {svc.title}
                </h3>
                <div className="sv-card-rule" />
                <p className="sv-card-desc">{svc.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── CTA ── 
        <div className="sv-cta-wrap sv-fade-up">
          <Link href="/Booking" className="sv-cta-btn">
            See our services ✦
          </Link>
        </div>
*/}
      </section>
    </>
  );
}