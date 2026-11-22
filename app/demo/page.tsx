import Image from "next/image";
import Link from "next/link";

const DESIGNS = [
  {
    href: "/demo/editorial",
    letter: "A",
    name: "Editorial",
    tone: "Light · cream and gold",
    text: "A magazine-style layout: headline lines rise into place, the photo unveils under an arch, a slow marquee of services, hover-to-preview services and a swipeable strip of recent work.",
    image: "/ojono.png",
    position: "45% center",
    theme: "light",
  },
  {
    href: "/demo/noir",
    letter: "B",
    name: "Noir",
    tone: "Dark · espresso and gold",
    text: "A cinematic, full-screen opening with a drifting photo, a promise that lights up word by word as you scroll, a pinned photo that changes with each service, and smooth-opening questions.",
    image: "/mummy.jpg",
    position: "center 30%",
    theme: "dark",
  },
  {
    href: "/demo/signature",
    letter: "C",
    name: "Signature",
    tone: "Noir opening · Editorial body",
    text: "The best of both: Noir's cinematic opening and smooth-opening questions, with Editorial's services, recent work, Ojono's review, the process and the booking panel.",
    image: "/IMG-20260602-WA0007.jpg",
    position: "center 25%",
    theme: "dark",
  },
];

export default function DemoIndex() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Lora:wght@400&family=Jost:wght@400;500&display=swap');

        .dm { --ease: cubic-bezier(0.2, 0.7, 0.2, 1); min-height: 100vh; background: #faf6f1; color: #2c1f14; padding: 56px 40px 64px; }
        .dm-head { max-width: 1240px; margin: 0 auto 40px; display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 16px 40px; }
        .dm-kicker { font-family: 'Jost', sans-serif; font-weight: 500; font-size: 0.7rem; letter-spacing: 0.26em; text-transform: uppercase; color: #a07840; }
        .dm-title { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 500; font-size: clamp(2.6rem, 6vw, 4.4rem); line-height: 1; margin-top: 14px; }
        .dm-title em { font-weight: 400; color: #a07840; }
        .dm-note { font-family: 'Lora', Georgia, serif; color: #7a5c46; line-height: 1.75; max-width: 380px; }
        .dm-grid { max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 1100px) { .dm-grid { grid-template-columns: 1fr 1fr; } }
        .dm-card {
          position: relative; display: flex; flex-direction: column; justify-content: flex-end;
          min-height: 640px; border-radius: 8px; overflow: hidden; color: #faf6f1; text-decoration: none;
          opacity: 0; transform: translateY(30px); animation: dmIn 1.1s var(--ease) forwards;
        }
        .dm-card:nth-child(2) { animation-delay: 0.15s; }
        .dm-card:nth-child(3) { animation-delay: 0.3s; }
        .dm-body { padding: 32px !important; }
        @keyframes dmIn { to { opacity: 1; transform: none; } }
        .dm-card-img { position: absolute; inset: 0; transition: transform 1.6s var(--ease); }
        .dm-card:hover .dm-card-img { transform: scale(1.05); }
        .dm-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(20, 12, 6, 0.92) 0%, rgba(20, 12, 6, 0.35) 50%, rgba(20, 12, 6, 0.1) 100%); transition: background 0.6s var(--ease); }
        .dm-card[data-theme="light"]::after { background: linear-gradient(to top, rgba(250, 246, 241, 0.97) 0%, rgba(250, 246, 241, 0.6) 45%, rgba(250, 246, 241, 0) 75%); }
        .dm-card[data-theme="light"] { color: #2c1f14; }
        .dm-body { position: relative; z-index: 2; padding: 40px; }
        .dm-letter { display: inline-grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; border: 1px solid currentColor; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.3rem; margin-bottom: 20px; }
        .dm-name { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 500; font-size: clamp(2.4rem, 4vw, 3.4rem); line-height: 1; }
        .dm-tone { display: block; margin: 10px 0 18px; font-family: 'Jost', sans-serif; font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase; color: #c9a96e; }
        .dm-card[data-theme="light"] .dm-tone { color: #a07840; }
        .dm-text { font-family: 'Lora', Georgia, serif; font-size: 0.95rem; line-height: 1.75; opacity: 0.82; max-width: 440px; margin-bottom: 28px; }
        .dm-open { display: inline-flex; align-items: center; gap: 12px; height: 50px; padding: 0 26px; border-radius: 999px; background: #faf6f1; color: #2c1f14; font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; transition: gap 0.4s var(--ease), background 0.4s var(--ease); }
        .dm-card[data-theme="light"] .dm-open { background: #2c1f14; color: #faf6f1; }
        .dm-card:hover .dm-open { gap: 18px; }
        .dm-card:focus-visible { outline: 2px solid #a07840; outline-offset: 4px; }
        .dm-back { display: inline-block; margin-top: 40px; font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: #7a5c46; }
        .dm-foot { max-width: 1240px; margin: 0 auto; }
        @media (max-width: 860px) {
          .dm { padding: 40px 16px 48px; }
          .dm-grid { grid-template-columns: 1fr; }
          .dm-card { min-height: 520px; }
          .dm-body { padding: 28px 24px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dm-card { animation: none; opacity: 1; transform: none; }
          .dm-card-img, .dm-open { transition: none; }
        }
      `}</style>

      <main className="dm">
        <header className="dm-head">
          <div>
            <p className="dm-kicker">Myxprecioussmua · Home page demos</p>
            <h1 className="dm-title">Three directions, <em>one brand</em></h1>
          </div>
          <p className="dm-note">
            All three use the site&apos;s real photos, prices, review and colours. Open each one and scroll slowly to see the animations.
          </p>
        </header>

        <div className="dm-grid">
          {DESIGNS.map(d => (
            <Link key={d.href} href={d.href} className="dm-card" data-theme={d.theme}>
              <div className="dm-card-img">
                <Image src={d.image} alt="" fill priority sizes="(max-width: 860px) 100vw, 50vw" className="object-cover" style={{ objectPosition: d.position }} />
              </div>
              <div className="dm-body">
                <span className="dm-letter">{d.letter}</span>
                <h2 className="dm-name">{d.name}</h2>
                <span className="dm-tone">{d.tone}</span>
                <p className="dm-text">{d.text}</p>
                <span className="dm-open">
                  Open design {d.letter}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="dm-foot">
          <Link href="/" className="dm-back">← Back to the current home page</Link>
        </div>
      </main>
    </>
  );
}
