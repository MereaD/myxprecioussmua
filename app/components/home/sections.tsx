"use client";
// Home page sections (the live home page uses the Signature mix; see signature-home.tsx). Editorial (`Ed…`) sections must sit inside a
// `.ed` wrapper and Noir (`Nr…`) sections inside `.nr`; styles live in ./styles.ts.
// Scroll reveals are switched on once per page with useReveal().
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FAQS, HERO_IMAGE, PROMISE, REVIEW, SERVICES, STEPS, WORK } from "./content";
import { useScrollProgress } from "./motion";

const d = (s: string) => ({ ["--d" as string]: s }) as React.CSSProperties;

export const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* ═════════════════════════════ Editorial ═════════════════════════════ */

const MARQUEE = ["Bridal", "Occasion", "Editorial", "Prom", "Graduation", "Content creation", "Brand campaigns", "Baby showers"];

export function EdHero() {
  return (
    <section className="ed-hero">
      <div className="ed-wrap ed-hero-grid">
        <div>
          <p className="ed-kicker" data-reveal style={d("0.1s")}>Makeup artist · Milton Keynes</p>
          <h1 className="ed-serif ed-h1">
            <span data-reveal="mask" style={d("0.15s")}><span>Creating stunning</span></span>
            <span data-reveal="mask" style={d("0.3s")}><span><em>soft glam</em></span></span>
            <span data-reveal="mask" style={d("0.45s")}><span>looks.</span></span>
          </h1>
          <p className="ed-lede" data-reveal style={d("0.6s")}>
            Enhancing natural beauty and helping you feel confident for every occasion, from your wedding morning to your prom night.
          </p>
          <div className="ed-actions" data-reveal style={d("0.75s")}>
            <Link href="/Request-Appointment" className="ed-btn">Request appointment <Arrow /></Link>
            <Link href="/Portfolio" className="ed-link">View portfolio</Link>
          </div>
          <div className="ed-facts" data-reveal style={d("0.9s")}>
            <span><b>From £70</b> · Bridal previews</span>
            <span><b>1.5–2 hrs</b> · Per look</span>
            <span><b>Travel</b> · Available</span>
          </div>
        </div>

        <div className="ed-hero-media">
          <div className="ed-frame" data-reveal="clip" style={d("0.2s")}>
            <Image src={HERO_IMAGE} alt="Bride in soft glam makeup" fill priority sizes="(max-width: 980px) 90vw, 40vw" className="object-cover object-[45%_center]" />
          </div>
          <div className="ed-badge" data-reveal style={d("1s")} aria-hidden="true">
            <svg className="ed-badge-ring" viewBox="0 0 120 120">
              <defs><path id="edCircle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
              <text style={{ fontFamily: "Jost, sans-serif", fontSize: "9.5px", letterSpacing: "1.5px", fill: "#7a5c46", textTransform: "uppercase" }}>
                <textPath href="#edCircle" textLength="286" lengthAdjust="spacing">Soft glam · Bridal · Occasion · Editorial ·</textPath>
              </text>
            </svg>
            <span className="ed-serif">✦</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EdMarquee() {
  return (
    <div className="ed-marquee ed-serif" aria-hidden="true">
      <div className="ed-marquee-track">
        {[0, 1].map(copy => (
          <div key={copy} className="ed-marquee-item">
            {MARQUEE.map(m => (
              <span key={m} style={{ display: "contents" }}>
                {m} <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EdServices() {
  const [service, setService] = useState(0);

  // Desktop: hovering a service opens it and a click goes to its page.
  // Phones and tablets have no hover (and no photo panel), so the first tap opens
  // the service and the next tap goes to its page.
  const onTap = (e: React.MouseEvent, i: number) => {
    const tapToOpen = !matchMedia("(hover: hover)").matches || matchMedia("(max-width: 980px)").matches;
    if (tapToOpen && service !== i) {
      e.preventDefault();
      setService(i);
    }
  };

  return (
    <section className="ed-section">
      <div className="ed-wrap">
        <div className="ed-head">
          <div>
            <p className="ed-kicker" data-reveal>Services</p>
            <h2 className="ed-serif ed-h2" data-reveal style={d("0.1s")}>How I can <em>help</em></h2>
          </div>
          <p data-reveal style={d("0.2s")}>Every look is bespoke, built around you and designed to photograph beautifully and last day and night.</p>
        </div>

        <div className="ed-services">
          <div>
            {SERVICES.map((s, i) => (
              <Link
                key={s.title}
                href={s.href}
                className="ed-svc"
                data-active={service === i}
                aria-expanded={service === i}
                // Mouse and keyboard only: a tap also fires enter/focus first, which
                // would open the row and let the same tap navigate away.
                onPointerEnter={e => e.pointerType === "mouse" && setService(i)}
                onFocus={e => e.currentTarget.matches(":focus-visible") && setService(i)}
                onClick={e => onTap(e, i)}
                data-reveal
                style={d(`${i * 0.12}s`)}
              >
                <div className="ed-svc-row">
                  <span className="ed-svc-num">0{i + 1}</span>
                  <span className="ed-serif ed-svc-title">{s.title}</span>
                  <span className="ed-svc-arrow"><Arrow /></span>
                </div>
                <div className="ed-svc-body">
                  <div>
                    <p>{s.blurb}</p>
                    <small>{s.price}</small>
                    <div className="ed-svc-thumb">
                      <Image src={s.image} alt="" fill sizes="90vw" className="object-cover object-top" />
                    </div>
                    <span className="ed-svc-more">Explore {s.title.toLowerCase()} <Arrow /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="ed-svc-media" data-reveal>
            {SERVICES.map((s, i) => (
              <figure key={s.title} data-active={service === i}>
                <Image src={s.image} alt={`${s.title} makeup`} fill sizes="35vw" className="object-cover object-top" />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function EdWork() {
  const strip = useRef<HTMLDivElement>(null);
  const scrollStrip = (dir: 1 | -1) =>
    strip.current?.scrollBy({ left: dir * strip.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section className="ed-section ed-work">
      <div className="ed-wrap ed-head">
        <div>
          <p className="ed-kicker" data-reveal>Recent work</p>
          <h2 className="ed-serif ed-h2" data-reveal style={d("0.1s")}>Looks I&apos;ve <em>loved</em></h2>
        </div>
        <div className="ed-actions" data-reveal style={d("0.2s")}>
          <div className="ed-strip-nav">
            <button className="ed-round" onClick={() => scrollStrip(-1)} aria-label="Scroll back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <button className="ed-round" onClick={() => scrollStrip(1)} aria-label="Scroll forward">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
          <Link href="/Portfolio" className="ed-link">Full portfolio <Arrow /></Link>
        </div>
      </div>
      <div className="ed-strip" ref={strip}>
        {WORK.map((w, i) => (
          <Link key={w.src} href="/Portfolio" className="ed-card" data-reveal style={d(`${i * 0.08}s`)}>
            <div className="ed-card-img">
              <Image src={w.src} alt={w.alt} fill sizes="(max-width: 640px) 72vw, 26vw" className="object-cover object-top" />
            </div>
            <p><span>{w.label}</span><span>0{i + 1}</span></p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function EdReview() {
  return (
    <section className="ed-section">
      <div className="ed-wrap ed-review">
        <div className="ed-review-img" data-reveal>
          <div data-reveal="clip" style={d("0.15s")}>
            <Image src={REVIEW.image} alt={`${REVIEW.name} on her wedding day`} fill sizes="(max-width: 980px) 90vw, 35vw" className="object-cover object-top" />
          </div>
        </div>
        <figure>
          <span className="ed-serif ed-quote-mark" data-reveal aria-hidden="true">&ldquo;</span>
          <blockquote className="ed-serif ed-quote" data-reveal style={d("0.1s")}>{REVIEW.quote}</blockquote>
          <figcaption className="ed-cite" data-reveal style={d("0.2s")}>
            {REVIEW.name}
            <span>{REVIEW.detail}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function EdProcess() {
  return (
    <section className="ed-section" style={{ paddingTop: 0 }}>
      <div className="ed-wrap">
        <div className="ed-head">
          <div>
            <p className="ed-kicker" data-reveal>The process</p>
            <h2 className="ed-serif ed-h2" data-reveal style={d("0.1s")}>Easy from <em>start to finish</em></h2>
          </div>
        </div>
        <div className="ed-steps">
          <span className="ed-steps-line" data-reveal="line" />
          {STEPS.map((s, i) => (
            <div key={s.title} className="ed-step" data-reveal style={d(`${0.2 + i * 0.15}s`)}>
              <span className="ed-serif ed-step-num">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EdCta({ style }: { style?: React.CSSProperties }) {
  return (
    <section className="ed-section" style={{ paddingTop: 0, ...style }}>
      <div className="ed-wrap">
        <div className="ed-cta" data-reveal>
          <span className="ed-cta-glow" aria-hidden="true" />
          <div style={{ position: "relative" }}>
            <p className="ed-kicker" style={{ color: "#e8c99a" }}>Bookings open</p>
            <h2 className="ed-serif ed-h2">Your date. <em>Your look.</em></h2>
          </div>
          <div style={{ position: "relative" }}>
            <p>A £35 booking fee secures your date. Tell me about your day and I&apos;ll be in touch within 24 to 48 hours.</p>
            <div className="ed-actions">
              <Link href="/Request-Appointment" className="ed-btn">Request appointment <Arrow /></Link>
              <Link href="/Contact" className="ed-link">Ask a question</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════ Noir ═══════════════════════════════ */

const HEADLINE = ["Creating", "stunning", "soft", "glam", "looks"];
const promiseWords = PROMISE.split(" ");

/** `next` is the id of the section the scroll cue jumps to. */
export function NrHero({ next }: { next: string }) {
  const hero = useRef<HTMLElement>(null);

  // Gentle parallax: the photo drifts against the pointer.
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !hero.current) return;
    const r = hero.current.getBoundingClientRect();
    hero.current.style.setProperty("--mx", `${((e.clientX - r.left) / r.width - 0.5) * -18}px`);
    hero.current.style.setProperty("--my", `${((e.clientY - r.top) / r.height - 0.5) * -12}px`);
  };

  return (
    <section className="nr-hero" ref={hero} onPointerMove={onPointerMove}>
      <div className="nr-hero-img" aria-hidden="true">
        <div>
          <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" className="object-cover object-[42%_center] md:object-center" />
        </div>
      </div>
      <div className="nr-hero-content">
        <p className="nr-kicker nr-fade" style={{ animationDelay: "0.2s" }}>Makeup artist · Milton Keynes</p>
        <h1 className="nr-serif nr-h1">
          {HEADLINE.map((w, i) => (
            <span key={w} className={`nr-word ${w === "soft" || w === "glam" ? "is-gold" : ""}`} style={{ animationDelay: `${0.35 + i * 0.14}s` }}>
              {w}
            </span>
          ))}
        </h1>
        <p className="nr-lede nr-fade" style={{ animationDelay: "1.2s" }}>
          Enhancing natural beauty and helping you feel confident for every occasion. Available to travel.
        </p>
        <div className="nr-hero-actions nr-fade" style={{ animationDelay: "1.4s" }}>
          <Link href="/Request-Appointment" className="nr-btn">Request appointment <Arrow /></Link>
          <Link href="/Portfolio" className="nr-ghost">View portfolio</Link>
        </div>
      </div>
      <a href={`#${next}`} className="nr-cue nr-fade" style={{ animationDelay: "1.8s" }}>
        Scroll
        <span />
      </a>
    </section>
  );
}

export function NrPromise({ id }: { id?: string }) {
  const promise = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(0);

  // The promise lights up word by word as it scrolls through the middle of the screen.
  useScrollProgress(promise, p => {
    const t = Math.min(1, Math.max(0, (p - 0.2) / 0.45));
    const n = Math.round(t * promiseWords.length);
    setLit(prev => (prev === n ? prev : n));
  });

  return (
    <section className="nr-promise" id={id} ref={promise}>
      <div className="nr-wrap">
        <p className="nr-serif" aria-label={PROMISE}>
          {promiseWords.map((w, i) => (
            <span key={i} aria-hidden="true" className={`${i < lit ? "is-lit" : ""} ${/absolutely|amazing/.test(w) ? "is-gold" : ""}`}>
              {w}{" "}
            </span>
          ))}
        </p>
        <p className="nr-sign" data-reveal>Precious, Myxprecioussmua</p>
      </div>
    </section>
  );
}

export function NrServices() {
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // Whichever service panel crosses the middle of the screen drives the pinned photo.
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.index))),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    panels.current.forEach(p => p && io.observe(p));
    return () => io.disconnect();
  }, []);

  return (
    <section className="nr-services">
      <div className="nr-wrap nr-svc-grid">
        <div className="nr-svc-pin">
          <div className="nr-svc-frame">
            {SERVICES.map((s, i) => (
              <figure key={s.title} data-active={active === i}>
                <Image src={s.image} alt={`${s.title} makeup`} fill sizes="45vw" className="object-cover object-top" />
              </figure>
            ))}
            <span className="nr-svc-count">0{active + 1} / 0{SERVICES.length}</span>
          </div>
        </div>
        <div>
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="nr-svc-panel"
              data-index={i}
              data-active={active === i}
              ref={el => { panels.current[i] = el; }}
            >
              <div className="nr-svc-mobile-img" data-reveal="zoom">
                <Image src={s.image} alt={`${s.title} makeup`} fill sizes="90vw" className="object-cover object-top" />
              </div>
              <span className="num" data-reveal>0{i + 1} — Service</span>
              <h3 data-reveal style={d("0.1s")}>{s.title}</h3>
              <p data-reveal style={d("0.2s")}>{s.blurb}</p>
              <div className="nr-svc-price" data-reveal style={d("0.3s")}>{s.price}</div>
              <div data-reveal style={d("0.4s")}>
                <Link href={s.href} className="nr-textlink">Explore {s.title.toLowerCase()} <Arrow /></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NrGallery() {
  return (
    <section className="nr-section">
      <div className="nr-wrap">
        <div className="nr-head">
          <div>
            <p className="nr-kicker" data-reveal>Portfolio</p>
            <h2 className="nr-serif nr-h2" data-reveal style={d("0.1s")}>Recent <em>work</em></h2>
          </div>
          <div data-reveal style={d("0.2s")}>
            <Link href="/Portfolio" className="nr-textlink">See every look <Arrow /></Link>
          </div>
        </div>
        <div className="nr-gallery">
          {WORK.map((w, i) => (
            <Link key={w.src} href="/Portfolio" className="nr-tile" data-reveal="zoom" style={d(`${(i % 3) * 0.12}s`)}>
              <figure style={{ margin: 0 }}>
                <Image src={w.src} alt={w.alt} width={600} height={800} sizes="(max-width: 980px) 50vw, 33vw" />
                <figcaption>{w.label}</figcaption>
              </figure>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NrReview() {
  return (
    <section className="nr-section nr-review">
      <div className="nr-wrap">
        <div className="nr-avatar" data-reveal="zoom">
          <Image src={REVIEW.image} alt={REVIEW.name} fill sizes="96px" className="object-cover object-top" />
        </div>
        <blockquote className="nr-serif" data-reveal style={d("0.1s")}>&ldquo;{REVIEW.quote}&rdquo;</blockquote>
        <cite data-reveal style={d("0.2s")}>
          {REVIEW.name}
          <span>{REVIEW.detail}</span>
        </cite>
      </div>
    </section>
  );
}

export function NrFaq() {
  const [faq, setFaq] = useState<number | null>(0);
  return (
    <section className="nr-section">
      <div className="nr-wrap nr-faq-grid">
        <div className="nr-head" style={{ display: "block" }}>
          <p className="nr-kicker" data-reveal>Good to know</p>
          <h2 className="nr-serif nr-h2" data-reveal style={d("0.1s")}>Before your <em>appointment</em></h2>
        </div>
        <div>
          {FAQS.map((f, i) => {
            const open = faq === i;
            return (
              <div key={f.q} className="nr-faq-item" data-open={open} data-reveal style={d(`${i * 0.08}s`)}>
                <button className="nr-faq-q" aria-expanded={open} onClick={() => setFaq(open ? null : i)}>
                  {f.q}
                  <span className="nr-faq-icon" aria-hidden="true" />
                </button>
                <div className="nr-faq-a">
                  <div><p>{f.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function NrCta() {
  return (
    <section className="nr-cta">
      <div className="nr-cta-bg" aria-hidden="true">
        <Image src="/mummy.jpg" alt="" fill sizes="100vw" className="object-cover object-[center_30%]" />
      </div>
      <div>
        <p className="nr-kicker" data-reveal>Bookings open</p>
        <h2 className="nr-serif nr-h2" data-reveal style={{ ...d("0.1s"), margin: "16px 0 22px" }}>
          Let&apos;s create <em>your look</em>
        </h2>
        <p data-reveal style={d("0.2s")}>A £35 booking fee secures your date. I typically reply within 24 to 48 hours.</p>
        <div className="nr-hero-actions" data-reveal style={d("0.3s")}>
          <Link href="/Request-Appointment" className="nr-btn">Request appointment <Arrow /></Link>
          <Link href="/Contact" className="nr-ghost">Ask a question</Link>
        </div>
      </div>
    </section>
  );
}
