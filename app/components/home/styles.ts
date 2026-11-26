// Styles for the home page demo sections (Editorial `ed-` and Noir `nr-`).
// Each set is scoped under its wrapper class, `.ed` or `.nr`.

export const edCss = `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lora:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap');

        .ed { --ease: cubic-bezier(0.2, 0.7, 0.2, 1); background: #faf6f1; color: #2c1f14; overflow-x: clip; }
        .ed-wrap { max-width: 1240px; margin: 0 auto; padding: 0 40px; }
        .ed-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .ed-kicker {
          font-family: 'Jost', sans-serif; font-weight: 500;
          font-size: 0.7rem; letter-spacing: 0.26em; text-transform: uppercase; color: #a07840;
        }

        /* ── Reveal system ── */
        .ed [data-reveal] {
          opacity: 0; transform: translateY(28px);
          transition: opacity 1s var(--ease), transform 1s var(--ease);
          transition-delay: var(--d, 0s);
        }
        .ed [data-reveal].is-in { opacity: 1; transform: none; }
        /* headline lines rise out of a mask */
        .ed [data-reveal="mask"] { opacity: 1; transform: none; display: block; overflow: hidden; padding-bottom: 0.06em; }
        .ed [data-reveal="mask"] > span {
          display: block; transform: translateY(105%);
          transition: transform 1.1s var(--ease); transition-delay: var(--d, 0s);
        }
        .ed [data-reveal="mask"].is-in > span { transform: none; }
        /* images unveil from the bottom while settling from a slight zoom.
           The clip sits on the image, not the frame: a clipped frame would never
           count as visible, so its reveal would never start. */
        .ed [data-reveal="clip"] { opacity: 1; transform: none; }
        .ed [data-reveal="clip"] > img {
          clip-path: inset(100% 0 0 0); transform: scale(1.18);
          transition: clip-path 1.4s var(--ease), transform 2.2s var(--ease);
          transition-delay: var(--d, 0s);
        }
        .ed [data-reveal="clip"].is-in > img { clip-path: inset(0 0 0 0); transform: scale(1); }
        @media (min-width: 641px) { .ed-h1 > span { white-space: nowrap; } }
        /* lines that draw across */
        .ed [data-reveal="line"] { opacity: 1; transform: scaleX(0); transform-origin: left; transition: transform 1.4s var(--ease); transition-delay: var(--d, 0s); }
        .ed [data-reveal="line"].is-in { transform: scaleX(1); }

        /* ── Buttons ── */
        .ed-btn {
          display: inline-flex; align-items: center; gap: 12px;
          height: 54px; padding: 0 30px; border-radius: 999px;
          background: #2c1f14; color: #faf6f1;
          font-family: 'Jost', sans-serif; font-size: 0.74rem; letter-spacing: 0.2em; text-transform: uppercase;
          text-decoration: none; transition: background 0.35s var(--ease);
        }
        .ed-btn svg { transition: transform 0.35s var(--ease); }
        .ed-btn:hover { background: #a07840; }
        .ed-btn:hover svg { transform: translateX(4px); }
        .ed-link {
          position: relative; display: inline-flex; align-items: center; gap: 10px; padding: 6px 0;
          font-family: 'Jost', sans-serif; font-size: 0.74rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: #2c1f14; text-decoration: none;
        }
        .ed-link::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: currentColor;
          transform-origin: right; transition: transform 0.5s var(--ease);
        }
        .ed-link:hover::after { transform: scaleX(0); }
        .ed a:focus-visible, .ed button:focus-visible { outline: 2px solid #a07840; outline-offset: 4px; }

        /* ── Hero ── */
        .ed-hero { padding: 120px 0 96px; }
        .ed-hero-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 64px; align-items: end; }
        .ed-h1 { font-weight: 500; font-size: clamp(3rem, 5.6vw, 5.4rem); line-height: 0.98; letter-spacing: -0.02em; margin: 26px 0 30px; }
        .ed-h1 em { font-weight: 400; color: #a07840; }
        .ed-lede { font-family: 'Lora', Georgia, serif; font-size: 1.05rem; line-height: 1.75; color: #7a5c46; max-width: 440px; margin-bottom: 36px; }
        .ed-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 32px; }
        .ed-facts { display: flex; flex-wrap: wrap; gap: 10px 28px; margin-top: 56px; padding-top: 24px; border-top: 1px solid #e8ddd4; }
        .ed-facts span { font-family: 'Jost', sans-serif; font-size: 0.74rem; letter-spacing: 0.12em; text-transform: uppercase; color: #7a5c46; }
        .ed-facts b { font-weight: 500; color: #2c1f14; }
        .ed-hero-media { position: relative; }
        .ed-frame { position: relative; aspect-ratio: 4 / 5; overflow: hidden; border-radius: 200px 200px 4px 4px; background: #e8ddd4; }
        .ed-badge {
          position: absolute; left: -46px; bottom: 48px; width: 132px; height: 132px; z-index: 2;
          border-radius: 50%; background: #faf6f1; display: grid; place-items: center;
          box-shadow: 0 18px 40px rgba(44, 31, 20, 0.12);
        }
        .ed-badge-ring { position: absolute; top: 8px; left: 8px; width: calc(100% - 16px); height: calc(100% - 16px); animation: edSpin 22s linear infinite; }
        .ed-badge span { font-size: 1.6rem; color: #a07840; }
        @keyframes edSpin { to { transform: rotate(360deg); } }

        /* ── Marquee ── */
        .ed-marquee { background: #1c140e; color: #faf6f1; overflow: hidden; padding: 26px 0; }
        .ed-marquee-track { display: flex; width: max-content; animation: edMarquee 38s linear infinite; }
        .ed-marquee:hover .ed-marquee-track { animation-play-state: paused; }
        .ed-marquee-item { display: flex; align-items: center; gap: 40px; padding-right: 40px; font-size: clamp(1.6rem, 3vw, 2.4rem); font-style: italic; white-space: nowrap; }
        .ed-marquee-item i { font-style: normal; font-size: 0.9rem; color: #c9a96e; }
        @keyframes edMarquee { to { transform: translateX(-50%); } }

        /* ── Section headings ── */
        .ed-section { padding: 120px 0; }
        .ed-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 56px; }
        .ed-h2 { font-weight: 500; font-size: clamp(2.4rem, 5vw, 4rem); line-height: 1; letter-spacing: -0.01em; margin-top: 16px; }
        .ed-h2 em { font-weight: 400; color: #a07840; }
        .ed-head p { font-family: 'Lora', Georgia, serif; color: #7a5c46; max-width: 360px; line-height: 1.75; }

        /* ── Services: list + crossfading image ── */
        .ed-services { display: grid; grid-template-columns: 1fr 0.8fr; gap: 72px; align-items: start; }
        .ed-svc { display: block; border-top: 1px solid #e8ddd4; padding: 28px 0; color: inherit; text-decoration: none; }
        .ed-svc:last-child { border-bottom: 1px solid #e8ddd4; }
        .ed-svc-row { display: grid; grid-template-columns: 56px 1fr auto; align-items: baseline; gap: 16px; }
        .ed-svc-num { font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.15em; color: #a07840; }
        .ed-svc-title { font-size: clamp(2rem, 4vw, 3.1rem); line-height: 1; transition: color 0.4s var(--ease), transform 0.5s var(--ease); }
        .ed-svc[data-active="true"] .ed-svc-title { color: #a07840; transform: translateX(10px); font-style: italic; }
        .ed-svc-arrow { width: 44px; height: 44px; border-radius: 50%; border: 1px solid #e8ddd4; display: grid; place-items: center; transition: background 0.4s var(--ease), color 0.4s var(--ease), border-color 0.4s var(--ease); }
        .ed-svc[data-active="true"] .ed-svc-arrow { background: #2c1f14; border-color: #2c1f14; color: #faf6f1; }
        .ed-svc-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.6s var(--ease); }
        .ed-svc[data-active="true"] .ed-svc-body { grid-template-rows: 1fr; }
        .ed-svc-body > div { overflow: hidden; padding-left: 72px; }
        .ed-svc-body p { font-family: 'Lora', Georgia, serif; color: #7a5c46; line-height: 1.75; max-width: 440px; padding-top: 14px; }
        .ed-svc-body small { display: block; margin-top: 10px; font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase; color: #2c1f14; }
        .ed-svc-thumb { display: none; }
        .ed-svc-more { display: none; align-items: center; gap: 10px; margin-top: 16px; padding-bottom: 4px; border-bottom: 1px solid currentColor; font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: #2c1f14; }
        .ed-svc-title, .ed-svc-arrow { -webkit-tap-highlight-color: transparent; }
        .ed-svc { -webkit-tap-highlight-color: transparent; }
        .ed-svc-media { position: sticky; top: 104px; aspect-ratio: 4 / 5; overflow: hidden; border-radius: 4px; background: #e8ddd4; }
        .ed-svc-media figure { position: absolute; inset: 0; margin: 0; opacity: 0; transform: scale(1.06); transition: opacity 0.8s var(--ease), transform 1.4s var(--ease); }
        .ed-svc-media figure[data-active="true"] { opacity: 1; transform: scale(1); }

        /* ── Work strip ── */
        .ed-work { background: #f0e8de; }
        .ed-strip { --edge: max(40px, calc((100% - 1240px) / 2 + 40px)); display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding: 0 var(--edge) 8px; scroll-padding: 0 var(--edge); }
        .ed-strip::-webkit-scrollbar { display: none; }
        .ed-card { flex: 0 0 clamp(240px, 26vw, 340px); scroll-snap-align: start; color: inherit; text-decoration: none; }
        .ed-card-img { position: relative; aspect-ratio: 3 / 4; overflow: hidden; border-radius: 4px; background: #e8ddd4; }
        .ed-card-img img { transition: transform 1.2s var(--ease) !important; }
        .ed-card:hover .ed-card-img img { transform: scale(1.06) !important; }
        .ed-card p { display: flex; justify-content: space-between; margin-top: 12px; font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: #7a5c46; }
        .ed-strip-nav { display: flex; gap: 10px; }
        .ed-round { width: 48px; height: 48px; border-radius: 50%; border: 1px solid #d8c8b8; background: transparent; color: #2c1f14; cursor: pointer; display: grid; place-items: center; transition: background 0.3s var(--ease), color 0.3s var(--ease); }
        .ed-round:hover { background: #2c1f14; color: #faf6f1; }

        /* ── Review ── */
        .ed-review { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 88px; align-items: center; }
        .ed-review-img { position: relative; }
        .ed-review-img::before { content: ''; position: absolute; inset: 24px -24px -24px 24px; border: 1px solid #c9a96e; border-radius: 4px; }
        .ed-review-img > div { position: relative; aspect-ratio: 4 / 5; overflow: hidden; border-radius: 4px; }
        .ed-quote-mark { font-size: 6rem; line-height: 0.6; color: #c9a96e; display: block; height: 48px; }
        .ed-quote { font-size: clamp(1.6rem, 2.6vw, 2.25rem); line-height: 1.35; font-style: italic; margin: 8px 0 32px; }
        .ed-cite { font-family: 'Jost', sans-serif; font-size: 0.74rem; letter-spacing: 0.2em; text-transform: uppercase; }
        .ed-cite span { display: block; margin-top: 6px; color: #a07840; letter-spacing: 0.14em; }

        /* ── Process ── */
        .ed-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; position: relative; padding-top: 48px; }
        .ed-steps-line { position: absolute; top: 0; left: 0; right: 0; height: 1px; background: #c9a96e; }
        .ed-step-num { font-size: 4.2rem; line-height: 1; color: #c9a96e; font-style: italic; }
        .ed-step h3 { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 500; font-size: 1.7rem; margin: 18px 0 10px; }
        .ed-step p { font-family: 'Lora', Georgia, serif; color: #7a5c46; line-height: 1.75; }

        /* ── Closing CTA ── */
        .ed-cta { position: relative; overflow: hidden; border-radius: 8px; background: #1c140e; color: #faf6f1; padding: 96px 64px; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 48px; align-items: center; }
        .ed-cta .ed-h2 em { color: #e8c99a; }
        .ed-cta p { font-family: 'Lora', Georgia, serif; color: rgba(250, 246, 241, 0.75); line-height: 1.75; margin-bottom: 28px; }
        .ed-cta .ed-btn { background: linear-gradient(135deg, #c9a96e, #a07840); }
        .ed-cta .ed-btn:hover { background: #faf6f1; color: #2c1f14; }
        .ed-cta .ed-link { color: #faf6f1; }
        .ed-cta-glow { position: absolute; right: -120px; top: -120px; width: 420px; height: 420px; border-radius: 50%; background: radial-gradient(circle, rgba(201, 169, 110, 0.35), transparent 65%); animation: edFloat 9s ease-in-out infinite alternate; }
        @keyframes edFloat { to { transform: translate(-60px, 80px) scale(1.15); } }

        /* ── Tablet ── */
        @media (max-width: 980px) {
          .ed-hero-grid, .ed-services, .ed-review, .ed-cta { grid-template-columns: 1fr; }
          .ed-hero { padding-top: 104px; }
          .ed-hero-media { max-width: 520px; }
          .ed-badge { left: auto; right: -12px; bottom: -32px; }
          .ed-svc-media { display: none; }
          .ed-svc-thumb { display: block; position: relative; aspect-ratio: 16 / 10; overflow: hidden; border-radius: 4px; margin-top: 18px; }
          .ed-svc-more { display: inline-flex; }
          .ed-review { gap: 56px; }
          .ed-review-img { max-width: 420px; }
        }
        /* ── Phones ── */
        @media (max-width: 640px) {
          .ed-wrap { padding: 0 20px; }
          .ed-hero { padding: 96px 0 64px; }
          .ed-h1 { font-size: clamp(2.8rem, 13vw, 3.6rem); margin: 18px 0 22px; }
          .ed-lede { font-size: 0.98rem; }
          .ed-facts { margin-top: 36px; gap: 8px 20px; }
          .ed-badge { width: 104px; height: 104px; right: 8px; }
          .ed-section { padding: 80px 0; }
          .ed-head { margin-bottom: 36px; }
          .ed-svc-row { grid-template-columns: 36px 1fr auto; }
          .ed-svc-body > div { padding-left: 52px; }
          .ed-svc-arrow { width: 38px; height: 38px; }
          .ed-strip { padding: 0 20px 8px; scroll-padding: 0 20px; gap: 14px; }
          .ed-card { flex-basis: 72vw; }
          .ed-strip-nav { display: none; }
          .ed-steps { grid-template-columns: 1fr; gap: 36px; }
          .ed-cta { padding: 64px 24px; border-radius: 0; margin: 0 -20px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ed *, .ed *::before, .ed *::after { animation: none !important; transition: none !important; }
          .ed [data-reveal], .ed [data-reveal] > span, .ed [data-reveal] img { opacity: 1 !important; transform: none !important; clip-path: none !important; }
        }
      `;

export const nrCss = `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lora:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap');

        .nr {
          --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
          --bg: #1c140e; --bg-2: #241911; --line: rgba(232, 201, 154, 0.16);
          --cream: #faf6f1; --muted: rgba(250, 246, 241, 0.62); --gold: #c9a96e; --gold-l: #e8c99a;
          background: var(--bg); color: var(--cream); overflow-x: clip;
        }
        .nr-wrap { max-width: 1240px; margin: 0 auto; padding: 0 40px; }
        .nr-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .nr-kicker { font-family: 'Jost', sans-serif; font-weight: 400; font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold-l); }

        /* ── Reveal system ── */
        .nr [data-reveal] {
          opacity: 0; transform: translateY(32px); filter: blur(6px);
          transition: opacity 1.1s var(--ease), transform 1.1s var(--ease), filter 1.1s var(--ease);
          transition-delay: var(--d, 0s);
        }
        .nr [data-reveal].is-in { opacity: 1; transform: none; filter: none; }
        .nr [data-reveal="zoom"] { transform: scale(0.94); filter: none; }
        .nr [data-reveal="zoom"].is-in { transform: none; }

        /* ── Buttons ── */
        .nr-btn {
          display: inline-flex; align-items: center; gap: 12px; height: 54px; padding: 0 30px; border-radius: 999px;
          background: linear-gradient(135deg, #c9a96e, #a07840); color: var(--cream);
          font-family: 'Jost', sans-serif; font-size: 0.74rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none;
          box-shadow: 0 12px 34px rgba(160, 120, 64, 0.3);
          transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
        }
        .nr-btn svg { transition: transform 0.4s var(--ease); }
        .nr-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 44px rgba(160, 120, 64, 0.45); }
        .nr-btn:hover svg { transform: translateX(4px); }
        .nr-ghost {
          display: inline-flex; align-items: center; height: 54px; padding: 0 28px; border-radius: 999px;
          border: 1px solid rgba(250, 246, 241, 0.35); color: var(--cream);
          font-family: 'Jost', sans-serif; font-size: 0.74rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none;
          transition: background 0.4s var(--ease), border-color 0.4s var(--ease);
        }
        .nr-ghost:hover { background: rgba(250, 246, 241, 0.08); border-color: var(--gold-l); }
        .nr a:focus-visible, .nr button:focus-visible { outline: 2px solid var(--gold-l); outline-offset: 4px; }

        /* ── Hero ── */
        .nr-hero { position: relative; height: 100vh; height: 100svh; min-height: 640px; overflow: hidden; display: grid; place-items: center; text-align: center; }
        .nr-hero-img { position: absolute; inset: -30px; transform: translate(var(--mx, 0px), var(--my, 0px)); transition: transform 1.2s var(--ease); }
        .nr-hero-img > div { position: absolute; inset: 0; animation: nrZoom 14s var(--ease) both; }
        @keyframes nrZoom { from { transform: scale(1.15); } to { transform: scale(1); } }
        .nr-hero::after {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at center, rgba(28, 20, 14, 0.25) 0%, rgba(28, 20, 14, 0.75) 75%),
            linear-gradient(to top, #1c140e 0%, transparent 35%);
        }
        .nr-hero-content { position: relative; z-index: 2; padding: 0 24px; max-width: 980px; }
        .nr-h1 { font-weight: 500; font-size: clamp(3rem, 8.5vw, 7.6rem); line-height: 0.98; letter-spacing: -0.02em; margin: 24px 0 26px; }
        .nr-word {
          display: inline-block; margin: 0 0.12em; opacity: 0; filter: blur(14px); transform: translateY(0.25em);
          animation: nrWord 1.3s var(--ease) forwards;
        }
        .nr-word.is-gold { font-style: italic; font-weight: 400; color: var(--gold-l); }
        @keyframes nrWord { to { opacity: 1; filter: blur(0); transform: none; } }
        .nr-lede { font-family: 'Lora', Georgia, serif; font-size: 1.05rem; line-height: 1.75; color: var(--muted); max-width: 520px; margin: 0 auto 36px; }
        .nr-hero-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; }
        .nr-fade { opacity: 0; animation: nrFadeUp 1.2s var(--ease) forwards; }
        @keyframes nrFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        .nr-cue { position: absolute; left: 50%; bottom: 28px; z-index: 2; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 10px; color: var(--muted); font-family: 'Jost', sans-serif; font-size: 0.62rem; letter-spacing: 0.3em; text-transform: uppercase; text-decoration: none; }
        .nr-cue span { position: relative; width: 1px; height: 44px; background: rgba(250, 246, 241, 0.2); overflow: hidden; }
        .nr-cue span::after { content: ''; position: absolute; left: 0; top: -40%; width: 1px; height: 40%; background: var(--gold-l); animation: nrCue 2.2s ease-in-out infinite; }
        @keyframes nrCue { to { top: 100%; } }

        /* ── Promise ── */
        .nr-promise { padding: 160px 0; }
        .nr-promise p { font-size: clamp(1.9rem, 4.2vw, 3.6rem); line-height: 1.22; letter-spacing: -0.01em; max-width: 1060px; }
        .nr-promise p span { color: rgba(250, 246, 241, 0.16); transition: color 0.5s var(--ease); }
        .nr-promise p span.is-lit { color: var(--cream); }
        .nr-promise p span.is-lit.is-gold { color: var(--gold-l); font-style: italic; }
        .nr-sign { margin-top: 40px; display: flex; align-items: center; gap: 16px; font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.24em; text-transform: uppercase; color: var(--muted); }
        .nr-sign::before { content: ''; width: 48px; height: 1px; background: var(--gold); }

        /* ── Services: pinned photo, scrolling text ── */
        .nr-services { border-top: 1px solid var(--line); }
        .nr-svc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
        .nr-svc-pin { position: sticky; top: 64px; height: calc(100vh - 64px); display: flex; align-items: center; }
        .nr-svc-frame { position: relative; width: 100%; aspect-ratio: 4 / 5; max-height: 78vh; overflow: hidden; border-radius: 4px; background: var(--bg-2); }
        .nr-svc-frame figure { position: absolute; inset: 0; margin: 0; opacity: 0; transform: scale(1.08); clip-path: inset(0 0 100% 0); transition: opacity 0.9s var(--ease), transform 1.6s var(--ease), clip-path 1.1s var(--ease); }
        .nr-svc-frame figure[data-active="true"] { opacity: 1; transform: scale(1); clip-path: inset(0 0 0 0); }
        .nr-svc-count { position: absolute; left: 20px; bottom: 18px; z-index: 2; font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.24em; color: var(--cream); mix-blend-mode: difference; }
        .nr-svc-panel { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 80px 0; }
        .nr-svc-panel .num { font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.24em; color: var(--gold); }
        .nr-svc-panel h3 { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 500; font-size: clamp(3rem, 6vw, 5.4rem); line-height: 1; margin: 18px 0 24px; transition: color 0.6s var(--ease); color: rgba(250, 246, 241, 0.3); }
        .nr-svc-panel[data-active="true"] h3 { color: var(--cream); }
        .nr-svc-panel p { font-family: 'Lora', Georgia, serif; font-size: 1.05rem; line-height: 1.8; color: var(--muted); max-width: 440px; margin-bottom: 26px; }
        .nr-svc-price { font-family: 'Jost', sans-serif; font-size: 0.74rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold-l); margin-bottom: 26px; }
        .nr-textlink { display: inline-flex; align-items: center; gap: 10px; color: var(--cream); font-family: 'Jost', sans-serif; font-size: 0.74rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; padding-bottom: 6px; border-bottom: 1px solid rgba(250, 246, 241, 0.3); transition: border-color 0.4s var(--ease), gap 0.4s var(--ease); }
        .nr-textlink:hover { border-color: var(--gold-l); gap: 16px; }
        .nr-svc-mobile-img { display: none; }

        /* ── Gallery ── */
        .nr-section { padding: 140px 0; }
        .nr-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 56px; }
        .nr-h2 { font-weight: 500; font-size: clamp(2.6rem, 5.5vw, 4.6rem); line-height: 1; letter-spacing: -0.01em; margin-top: 16px; }
        .nr-h2 em { font-weight: 400; color: var(--gold-l); }
        .nr-gallery { columns: 3; column-gap: 18px; }
        .nr-tile { position: relative; display: block; break-inside: avoid; margin-bottom: 18px; overflow: hidden; border-radius: 4px; background: var(--bg-2); }
        .nr-tile img { width: 100%; height: auto; aspect-ratio: 3 / 4; object-fit: cover; object-position: top; display: block; transition: transform 1.4s var(--ease), filter 0.8s var(--ease); filter: saturate(0.9); }
        .nr-tile:hover img { transform: scale(1.06); filter: saturate(1.05); }
        .nr-tile figcaption { position: absolute; left: 0; right: 0; bottom: 0; padding: 40px 18px 16px; background: linear-gradient(to top, rgba(28, 20, 14, 0.85), transparent); font-family: 'Jost', sans-serif; font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase; opacity: 0; transform: translateY(10px); transition: opacity 0.5s var(--ease), transform 0.5s var(--ease); }
        .nr-tile:hover figcaption, .nr-tile:focus-visible figcaption { opacity: 1; transform: none; }

        /* ── Review ── */
        .nr-review { background: var(--bg-2); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); text-align: center; }
        .nr-avatar { position: relative; width: 96px; height: 96px; margin: 0 auto 36px; border-radius: 50%; overflow: hidden; outline: 1px solid var(--gold); outline-offset: 6px; }
        .nr-review blockquote { font-size: clamp(1.6rem, 3vw, 2.5rem); line-height: 1.35; font-style: italic; max-width: 900px; margin: 0 auto 32px; }
        .nr-review cite { font-style: normal; font-family: 'Jost', sans-serif; font-size: 0.74rem; letter-spacing: 0.22em; text-transform: uppercase; }
        .nr-review cite span { display: block; margin-top: 8px; color: var(--gold-l); }

        /* ── FAQ ── */
        .nr-faq-grid { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 80px; align-items: start; }
        .nr-faq-item { border-top: 1px solid var(--line); }
        .nr-faq-item:last-child { border-bottom: 1px solid var(--line); }
        .nr-faq-q { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 26px 0; background: none; border: none; color: var(--cream); cursor: pointer; text-align: left; font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(1.3rem, 2.2vw, 1.7rem); }
        .nr-faq-icon { position: relative; flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--line); transition: background 0.4s var(--ease), border-color 0.4s var(--ease); }
        .nr-faq-icon::before, .nr-faq-icon::after { content: ''; position: absolute; left: 50%; top: 50%; width: 12px; height: 1px; background: var(--gold-l); transform: translate(-50%, -50%); transition: transform 0.4s var(--ease); }
        .nr-faq-icon::after { transform: translate(-50%, -50%) rotate(90deg); }
        .nr-faq-item[data-open="true"] .nr-faq-icon { background: var(--gold); border-color: var(--gold); }
        .nr-faq-item[data-open="true"] .nr-faq-icon::before, .nr-faq-item[data-open="true"] .nr-faq-icon::after { background: var(--bg); }
        .nr-faq-item[data-open="true"] .nr-faq-icon::after { transform: translate(-50%, -50%) rotate(0deg); }
        .nr-faq-a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.6s var(--ease); }
        .nr-faq-item[data-open="true"] .nr-faq-a { grid-template-rows: 1fr; }
        .nr-faq-a > div { overflow: hidden; }
        .nr-faq-a p { font-family: 'Lora', Georgia, serif; color: var(--muted); line-height: 1.8; max-width: 560px; padding-bottom: 26px; }

        /* ── Closing CTA ── */
        .nr-cta { position: relative; overflow: hidden; min-height: 80vh; display: grid; place-items: center; text-align: center; padding: 120px 24px; }
        .nr-cta-bg { position: absolute; inset: 0; }
        .nr-cta::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, var(--bg) 0%, rgba(28, 20, 14, 0.7) 35%, rgba(28, 20, 14, 0.8) 100%); }
        .nr-cta > div:last-child { position: relative; z-index: 2; }
        .nr-cta p { font-family: 'Lora', Georgia, serif; color: var(--muted); line-height: 1.75; max-width: 440px; margin: 0 auto 32px; }

        /* ── Tablet ── */
        @media (max-width: 980px) {
          .nr-svc-grid, .nr-faq-grid { grid-template-columns: 1fr; gap: 0; }
          .nr-svc-pin { display: none; }
          .nr-svc-panel { min-height: auto; padding: 72px 0 0; }
          .nr-svc-panel h3 { color: var(--cream); }
          .nr-svc-mobile-img { display: block; position: relative; aspect-ratio: 4 / 5; max-width: 480px; overflow: hidden; border-radius: 4px; margin-bottom: 28px; }
          .nr-services { padding-bottom: 96px; }
          .nr-gallery { columns: 2; }
          .nr-faq-grid .nr-head { margin-bottom: 32px; }
        }
        /* ── Phones ── */
        @media (max-width: 640px) {
          .nr-wrap { padding: 0 20px; }
          .nr-h1 { font-size: clamp(2.6rem, 12.5vw, 3.4rem); }
          .nr-lede { font-size: 0.96rem; }
          .nr-promise { padding: 104px 0; }
          .nr-section { padding: 96px 0; }
          .nr-gallery { column-gap: 10px; }
          .nr-tile { margin-bottom: 10px; }
          .nr-tile figcaption { opacity: 1; transform: none; padding: 28px 10px 10px; font-size: 0.6rem; }
          .nr-cta { min-height: 70vh; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nr *, .nr *::before, .nr *::after { animation: none !important; transition: none !important; }
          .nr [data-reveal], .nr-word, .nr-fade { opacity: 1 !important; transform: none !important; filter: none !important; }
          .nr-promise p span { color: var(--cream); }
        }
      `;
