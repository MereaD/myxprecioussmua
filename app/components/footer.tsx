'use client'
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t" style={{ borderColor: "#e8ddd4" }}>
      <div style={{ maxWidth: "672px", margin: "0 auto" }} className="px-6 py-8">

        {/* ── Top row: brand + nav ── */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <p
            className="text-sm tracking-[0.2em] text-[#ce9261] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}
          >
            Myxprecioussmua
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 md:gap-6">
            <Link href="/Spotlight" className="py-2 text-xs tracking-[0.15em] uppercase text-[#a3836c] hover:text-[#d3cac2] transition-colors duration-200" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>Spotlight</Link>
            <Link href="/Bridal" className="py-2 text-xs tracking-[0.15em] uppercase text-[#a3836c] hover:text-[#d3cac2] transition-colors duration-200" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>Bridal</Link>
            <Link href="/Collab" className="py-2 text-xs tracking-[0.15em] uppercase text-[#a3836c] hover:text-[#d3cac2] transition-colors duration-200" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>Collab</Link>
            <Link href="/Contact" className="py-2 text-xs tracking-[0.15em] uppercase text-[#a3836c] hover:text-[#d3cac2] transition-colors duration-200" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>Contact</Link>
          </nav>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center justify-center gap-3 mt-7 mb-6">
          <div className="h-px w-8 bg-[#c9a96e]/30" />
          <span className="text-[#c9a96e]/50 text-xs">✦</span>
          <div className="h-px w-8 bg-[#c9a96e]/30" />
        </div>

        {/* ── Socials ── */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/myxprecioussmua?igsh=MTVibG4xbjhybGFpag=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="group"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                border: "1px solid rgba(201,169,110,0.3)",
                background: "transparent",
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(201,169,110,0.1)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.7)";
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.3)";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="#c9a96e" stroke="none" />
              </svg>
            </div>
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@myxprecioussmua?_r=1&_t=ZS-97eSU1OBV45"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="group"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                border: "1px solid rgba(201,169,110,0.3)",
                background: "transparent",
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(201,169,110,0.1)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.7)";
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.3)";
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#c9a96e">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.16 8.16 0 0 0 4.78 1.52V7.03a4.85 4.85 0 0 1-1.01-.34Z" />
              </svg>
            </div>
          </a>
        </div>

        {/* ── Legal links ── */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <Link
            href="/Privacy-policy"
            className="py-2 text-xs tracking-[0.12em] uppercase transition-colors duration-200"
            style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, color: "#a3836c" }}
            onMouseOver={e => (e.currentTarget.style.color = "#c9a96e")}
            onMouseOut={e => (e.currentTarget.style.color = "#a3836c")}
          >
            Privacy Policy
          </Link>
          <span style={{ color: "rgba(201,169,110,0.35)", fontSize: "0.6rem" }}>✦</span>
          <Link
            href="/Terms&Conditions"
            className="py-2 text-xs tracking-[0.12em] uppercase transition-colors duration-200"
            style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, color: "#a3836c" }}
            onMouseOver={e => (e.currentTarget.style.color = "#c9a96e")}
            onMouseOut={e => (e.currentTarget.style.color = "#a3836c")}
          >
            Terms &amp; Conditions
          </Link>
        </div>

        {/* ── Copyright ── */}
        <p
          className="text-center text-xs text-[#b09070]"
          style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.1em" }}
        >
          © Myxprecioussmua — All rights reserved
        </p>

      </div>
    </footer>
  );
}