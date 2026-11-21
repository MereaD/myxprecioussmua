"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/Bridal", label: "Bridal" },
  { href: "/Occasion", label: "Occasion" },
  { href: "/Portfolio", label: "Portfolio" },
  { href: "/Spotlight", label: "Spotlight" },
  { href: "/Collab", label: "Collab" },
  { href: "/Contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openedOn, setOpenedOn] = useState(pathname);

  // Close the menu after navigating.
  if (menuOpen && pathname !== openedOn) setMenuOpen(false);

  // On the home page the bar sits clear over the hero photo until you scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll and allow Escape while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setOpenedOn(pathname);
    setMenuOpen(o => !o);
  };

  const overHero = pathname === "/" && !scrolled && !menuOpen;
  const isActive = (href: string) => pathname === href;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400&display=swap');

        .site-nav {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 50;
          transition: background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
          border-bottom: 1px solid rgba(201, 169, 110, 0.22);
          background-color: rgba(28, 20, 14, 0.94);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
        }
        .site-nav.over-hero {
          background-color: transparent;
          border-color: transparent;
          box-shadow: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
        /* Soft shade at the top of the hero so the links stay readable on any photo */
        .site-nav.over-hero::before {
          content: '';
          position: absolute;
          inset: 0 0 -32px 0;
          background: linear-gradient(to bottom, rgba(20, 12, 6, 0.55), transparent);
          pointer-events: none;
        }

        .site-nav-link {
          position: relative;
          display: inline-block;
          padding: 8px 0;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.74rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(250, 246, 241, 0.82);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .site-nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 2px;
          height: 1px;
          background: #c9a96e;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .site-nav-link:hover { color: #fff; }
        .site-nav-link:hover::after,
        .site-nav-link[aria-current="page"]::after { transform: scaleX(1); }
        .site-nav-link[aria-current="page"] { color: #e8c99a; }

        /* display comes from the Tailwind classes (hidden lg:inline-flex) */
        .site-nav-cta {
          align-items: center;
          height: 40px;
          padding: 0 22px;
          border-radius: 999px;
          border: 1px solid rgba(201, 169, 110, 0.75);
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #faf6f1;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
        }
        .site-nav-cta:hover {
          background: linear-gradient(135deg, #c9a96e, #a07840);
          border-color: transparent;
        }

        .site-nav a:focus-visible,
        .site-nav button:focus-visible,
        .site-menu a:focus-visible {
          outline: 1px solid #e8c99a;
          outline-offset: 4px;
          border-radius: 2px;
        }

        .site-burger {
          position: relative;
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          cursor: pointer;
        }
        .site-burger span {
          position: absolute;
          left: 9px;
          right: 9px;
          height: 1px;
          background: #faf6f1;
          transition: transform 0.3s ease, top 0.3s ease, width 0.3s ease;
        }
        .site-burger span:nth-child(1) { top: 15px; }
        .site-burger span:nth-child(2) { top: 24px; left: 17px; }
        .site-burger.is-open span:nth-child(1) { top: 20px; transform: rotate(45deg); }
        .site-burger.is-open span:nth-child(2) { top: 20px; left: 9px; transform: rotate(-45deg); }

        /* Full-screen mobile menu */
        .site-menu {
          position: fixed;
          inset: 0;
          z-index: 40;
          display: flex;
          flex-direction: column;
          padding: 96px 28px 32px;
          background: #1c140e;
          overflow-y: auto;
          transition: opacity 0.35s ease, visibility 0s linear 0.35s;
          opacity: 0;
          visibility: hidden;
        }
        .site-menu.is-open {
          opacity: 1;
          visibility: visible;
          transition: opacity 0.35s ease, visibility 0s;
        }
        .site-menu-link {
          display: flex;
          align-items: baseline;
          gap: 16px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(201, 169, 110, 0.14);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2rem;
          line-height: 1.1;
          color: #faf6f1;
          text-decoration: none;
          opacity: 0;
          transform: translateY(12px);
          transition: color 0.2s ease;
        }
        .site-menu.is-open .site-menu-link {
          animation: siteMenuIn 0.45s ease forwards;
        }
        .site-menu-link small {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: #c9a96e;
        }
        .site-menu-link[aria-current="page"] { color: #e8c99a; font-style: italic; }
        @media (min-width: 1024px) {
          .site-menu { display: none; }
        }
        @keyframes siteMenuIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .site-menu, .site-menu-link, .site-nav, .site-burger span { transition: none; animation: none !important; }
          .site-menu-link { opacity: 1; transform: none; }
        }
      `}</style>

      <nav className={`site-nav ${overHero ? "over-hero" : ""}`} aria-label="Main">
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 md:px-8">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex-shrink-0" aria-label="Myxprecioussmua home">
            <Image src="/logov2.png" alt="Myxprecioussmua" width={96} height={58} className="h-14 w-auto object-contain" priority />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="site-nav-link" aria-current={isActive(link.href) ? "page" : undefined}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <Link href="/Request-Appointment" className="site-nav-cta hidden lg:inline-flex">
            Request appointment
          </Link>

          {/* Mobile and tablet */}
          <button
            className={`site-burger relative z-10 lg:hidden ${menuOpen ? "is-open" : ""}`}
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div id="site-menu" className={`site-menu ${menuOpen ? "is-open" : ""}`} inert={!menuOpen}>
        <ul>
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="site-menu-link"
                style={{ animationDelay: `${0.05 + i * 0.05}s` }}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                <small>0{i + 1}</small>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/Request-Appointment"
          onClick={() => setMenuOpen(false)}
          className="mt-8 flex h-12 items-center justify-center rounded-full text-xs uppercase"
          style={{
            fontFamily: "'Jost', sans-serif",
            letterSpacing: "0.2em",
            background: "linear-gradient(135deg, #c9a96e, #a07840)",
            color: "#faf6f1",
            textDecoration: "none",
          }}
        >
          Request appointment
        </Link>

        <div className="mt-auto pt-10 text-sm" style={{ fontFamily: "'Jost', sans-serif", color: "rgba(250,246,241,0.6)" }}>
          <p className="mb-1 text-[0.65rem] uppercase tracking-[0.2em] text-[#c9a96e]">Get in touch</p>
          <a href="mailto:myxprecioussmua@outlook.com" className="block py-1 text-[#faf6f1]/80">myxprecioussmua@outlook.com</a>
          <a href="tel:07496837465" className="block py-1 text-[#faf6f1]/80">07496837465</a>
          <p className="mt-3">Milton Keynes · Available to travel</p>
        </div>
      </div>
    </>
  );
}
