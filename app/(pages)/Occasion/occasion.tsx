import Link from "next/link";

interface PortfolioItem {
  id: number;
  image: string;
  alt: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  imageLeft: boolean;
}

const fees = [
  { label: "Early Morning (6am – 8am)", amount: "+£15" },
  { label: "Saturday & Sunday", amount: "+£20" },
  { label: "After 6pm", amount: "+£10" },
  { label: "Same Day Booking", amount: "+£15" },
  { label: "Travel Outside Milton Keynes", amount: "Quoted individually" },
];

{/*const portfolioItems: PortfolioItem[] = [
  
  {
    id: 2,
    image: "/Ophelia2.jpg",
    alt: "Soft glam makeup look",
    title: "Soft Glam",
    description: "Whatever the occasion, let's get you looking polished, feeling confident and camera-ready.",
    cta: "Book Now",
    href: "/Request-Appointment",
    imageLeft: false,
  },
  
];
*/}
export default function Gallery() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lora:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400&display=swap');

        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .g-fade-up { animation: fadeUp 0.7s ease both; }
        .g-delay-1 { animation-delay: 0.1s; }
        .g-delay-2 { animation-delay: 0.25s; }
        .g-delay-3 { animation-delay: 0.4s; }

        /* ── Wrapper ── */
        .gallery-section {
          width: 100%;
          background-color: #faf6f1;
        }

        /* ── Header (bridal-style) ── */
        .gallery-topbar {
          height: 4px;
          width: 100%;
          background: linear-gradient(to right, #c9a96e, #e8c99a, #c9a96e);
        }
        .gallery-banner {
          width: 100%;
          background-color: #faf6f1;
          padding: 64px 24px 52px;
          text-align: center;
        }
        .gallery-banner-eyebrow {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 16px;
        }
        .gallery-banner-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: 2.8rem;
          line-height: 1.15;
          color: #2c1f14;
          margin-bottom: 20px;
        }
        .gallery-banner-title em {
          font-weight: 400;
          font-style: italic;
        }
        .gallery-banner-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 0 auto 28px;
        }
        .gallery-banner-divider .line {
          height: 1px;
          width: 48px;
          background: rgba(201,169,110,0.4);
        }
        .gallery-banner-divider .star {
          color: #c9a96e;
          font-size: 0.75rem;
        }
        .gallery-banner-sub {
          font-family: 'Lora', Georgia, serif;
          font-size: 0.88rem;
          line-height: 1.85;
          color: #7a5c46;
          max-width: 400px;
          margin: 0 auto;
        }

        /* ── Items ── */
        .gallery-items {
          display: flex;
          flex-direction: column;
          max-width: 900px;
          margin: 0 auto;
          padding: 64px 40px 64px;
        }

        /* ── Single item ── */
        .gallery-item {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 56px;
          min-height: 280px;
        }
        .gallery-item.img-left  { justify-content: flex-start; }
        .gallery-item.img-right { justify-content: flex-end; }

        /* ── Image ── */
        .gallery-img-wrap {
          position: relative;
          width: 48%;
          aspect-ratio: 4/3;
          flex-shrink: 0;
          z-index: 1;
        }
        .gallery-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          display: block;
        }

        /* ── Card ── */
        .gallery-card {
          position: absolute;
          background-color: #9a7b6e;
          padding: 32px 28px;
          width: 52%;
          z-index: 2;
          text-align: center;
        }
        .gallery-item.img-left .gallery-card {
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
        .gallery-item.img-right .gallery-card {
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }

        .gallery-card-eyebrow {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(250,246,241,0.65);
          margin-bottom: 8px;
        }
        .gallery-card-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: 1.4rem;
          color: #faf6f1;
          line-height: 1.2;
          margin-bottom: 12px;
        }
        .gallery-card-text {
          font-family: 'Lora', Georgia, serif;
          font-style: italic;
          font-size: 0.8rem;
          line-height: 1.8;
          color: rgba(250,246,241,0.85);
          margin-bottom: 20px;
        }
        .gallery-card-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid rgba(250,246,241,0.55);
          color: #faf6f1;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 10px 24px;
          border-radius: 999px;
          transition: background 0.22s ease, border-color 0.22s ease;
        }
        .gallery-card-btn:hover {
          background: rgba(250,246,241,0.12);
          border-color: rgba(250,246,241,0.85);
        }

        /* Gold corner accent */
        .gallery-img-accent {
          position: absolute;
          width: 40px;
          height: 40px;
          z-index: 3;
          pointer-events: none;
        }
        .gallery-item.img-left .gallery-img-accent {
          bottom: -8px;
          left: -8px;
          border-bottom: 2px solid #c9a96e;
          border-left: 2px solid #c9a96e;
        }
        .gallery-item.img-right .gallery-img-accent {
          bottom: -8px;
          right: -8px;
          border-bottom: 2px solid #c9a96e;
          border-right: 2px solid #c9a96e;
        }

        /* ── Bottom CTA ── */
        .gallery-cta-wrap {
          display: flex;
          justify-content: center;
          padding: 0 24px 64px;
        }
        .gallery-cta-btn {
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
        .gallery-cta-btn:hover {
          box-shadow: 0 8px 32px rgba(201,169,110,0.45);
          transform: translateY(-1px);
        }
        .gallery-cta-btn:active { transform: translateY(0); }

        /* ── Fees & Booking sections ── */
        .gallery-extra-wrap {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 24px 64px;
        }
        .gallery-extra-heading {
          text-align: center;
          margin-bottom: 28px;
        }
        .gallery-extra-eyebrow {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 10px;
        }
        .gallery-extra-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: 2rem;
          color: #2c1f14;
        }
        .gallery-fees-card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(4px);
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          border: 1px solid #e8ddd4;
          overflow: hidden;
          margin-bottom: 64px;
        }
        .gallery-fee-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 24px;
          transition: background 0.2s ease;
        }
        @media (max-width: 480px) {
          .gallery-fee-row { padding: 14px 16px; }
        }
        .gallery-fee-row:hover {
          background: rgba(201,169,110,0.05);
        }
        .gallery-fee-label {
          font-family: 'Lora', Georgia, serif;
          font-size: 0.9rem;
          color: #5a4435;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .gallery-fee-dot {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: rgba(201,169,110,0.5);
          flex-shrink: 0;
          display: inline-block;
        }
        .gallery-fee-amount {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: 1rem;
          color: #c9a96e;
          flex-shrink: 0;
          text-align: right;
          white-space: nowrap;
        }
        .gallery-fee-note {
          padding: 12px 24px;
          text-align: center;
          background: linear-gradient(135deg, #fdf8f2, #faf3ea);
          border-top: 1px solid #e8ddd4;
        }
        .gallery-fee-note p {
          font-family: 'Lora', Georgia, serif;
          font-style: italic;
          font-size: 0.75rem;
          color: #a08060;
        }
        .gallery-booking-card {
          border-radius: 14px;
          border: 1px solid rgba(201,169,110,0.3);
          background: linear-gradient(135deg, #fdf8f2, #faf3ea);
          padding: 28px;
          text-align: center;
        }
        .gallery-booking-icon {
          color: #c9a96e;
          font-size: 1.1rem;
          display: block;
          margin-bottom: 12px;
        }
        .gallery-booking-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: 1.4rem;
          color: #2c1f14;
          margin-bottom: 12px;
        }
        .gallery-booking-text {
          font-family: 'Lora', Georgia, serif;
          font-size: 0.9rem;
          line-height: 1.95;
          color: #7a5c46;
          margin-bottom: 20px;
        }
        .gallery-booking-text strong {
          color: #2c1f14;
        }
        .gallery-booking-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .gallery-booking-divider .line {
          height: 1px;
          width: 40px;
          background: rgba(201,169,110,0.3);
        }
        .gallery-booking-divider .star {
          color: rgba(201,169,110,0.4);
          font-size: 0.7rem;
        }
        .gallery-booking-tc {
          font-family: 'Lora', Georgia, serif;
          font-size: 0.75rem;
          color: #a08060;
          line-height: 1.7;
          margin-bottom: 24px;
        }
        .gallery-booking-tc a {
          color: #c9a96e;
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: color 0.2s ease;
        }
        .gallery-booking-tc a:hover {
          color: #a07840;
        }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .gallery-items { padding: 40px 20px 40px; }
          .gallery-item {
            flex-direction: column;
            align-items: stretch;
            min-height: unset;
            margin-bottom: 40px;
          }
          .gallery-item.img-left,
          .gallery-item.img-right { justify-content: unset; }
          .gallery-img-wrap { width: 75%; }
          .gallery-item.img-left  .gallery-img-wrap { align-self: flex-start; }
          .gallery-item.img-right .gallery-img-wrap { align-self: flex-end; }
          .gallery-card {
            position: relative;
            width: 80%;
            top: unset; left: unset; right: unset;
            transform: none;
            margin-top: -32px;
          }
          .gallery-item.img-left  .gallery-card { align-self: flex-end;  transform: none; }
          .gallery-item.img-right .gallery-card { align-self: flex-start; transform: none; }
          .gallery-img-accent { display: none; }
        }
      `}</style>

      <div style={{ backgroundColor: '#faf6f1' }}>
      {/* Top gold gradient bar — matches Bridal page */}
      <div className="gallery-topbar" />

      {/* Header sits outside section so it's truly full-width with no padding */}
      <div className="gallery-banner g-fade-up">
        <p className="gallery-banner-eyebrow">Myxprecioussmua</p>
        <h1 className="gallery-banner-title">
          Occasion
          <br />
          <em>Make-up</em>
        </h1>
        <div className="gallery-banner-divider">
          <div className="line" />
          <span className="star">✦</span>
          <div className="line" />
        </div>
        <p className="gallery-banner-sub p-5">
            A Special Occasstion is the perfect opportunity to treat yourselves to a professional makeover.
        </p>

        <p className="gallery-banner-sub">
          I take pride in creating flawless, bespoke looks that enhance
          your natural beauty and makes you feel your most confident.
          <br /><br />
          Feel free to bring your inspo photos, I have a varity of colors, shimmers, glitters and lashes to help create your perfect look.
        </p>

        <p className="gallery-banner-sub" > Every look is designed to photograph beautifully, to last day and night.  </p>
      </div>

      <section className="gallery-section">

       {/* <div className="gallery-items">
          {portfolioItems.map((item: PortfolioItem, i: number) => (
            <div
              key={item.id}
              className={`gallery-item g-fade-up ${item.imageLeft ? "img-left" : "img-right"}`}
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className="gallery-img-wrap">
                <img src={item.image} alt={item.alt} />
                <div className="gallery-img-accent" />
              </div>

              <div className="gallery-card">
                <p className="gallery-card-eyebrow">Myxprecioussmua</p>
                <h3 className="gallery-card-title">{item.title}</h3>
                <p className="gallery-card-text">{item.description}</p>
                <Link href={item.href} className="gallery-card-btn">
                  {item.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        */}

<div className="flex items-center justify-center gap-2">
  <span
    className="text-lg text-bold text-[#a08060]"
    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
  >
    starting from
  </span>
  <span
    className="font-medium"
    style={{ color: "#c9a96e", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.5rem" }}
  >
    £70
  </span>
</div>
        {/* ── ADDITIONAL FEES ── */}
        <div className="gallery-extra-wrap g-fade-up">
          <div className="gallery-extra-heading">
            <h2 className="gallery-extra-title">Additional Fees</h2>
          </div>

          <div className="gallery-fees-card">
            {fees.map((fee, i) => (
              <div
                key={i}
                className="gallery-fee-row"
                style={{ borderBottom: i < fees.length - 1 ? "1px solid #e8ddd4" : "none" }}
              >
                <span className="gallery-fee-label">
                  <span className="gallery-fee-dot" />
                  {fee.label}
                </span>
                <span className="gallery-fee-amount">{fee.amount}</span>
              </div>
            ))}
            <div className="gallery-fee-note">
              <p>
                The following fees are added to your service price where applicable and may be
                combined. All additional fees will be confirmed on the invoice.
              </p>
            </div>
          </div>

          {/* ── SECURING YOUR DATE ── */}
          <div className="gallery-booking-card">
            <span className="gallery-booking-icon">✦</span>
            <h3 className="gallery-booking-title">Securing Your Date</h3>
            <p className="gallery-booking-text">
              A <strong>£35 non-refundable booking fee</strong> is required to hold your date. The
              remaining balance, including any applicable fees, is due to be paid before your
              booked date.
            </p>

            <div className="gallery-booking-divider">
              <div className="line" />
              <span className="star">✦</span>
              <div className="line" />
            </div>

            <p className="gallery-booking-tc">
              By booking with me, you confirm and agree to the{" "}
              <Link href="/Terms&Conditions">Terms &amp; Conditions</Link>.
            </p>

            <Link href="/Request-Appointment" className="gallery-cta-btn">
              Request Appointment ✦
            </Link>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}