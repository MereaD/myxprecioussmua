"use client"
import Link from "next/link";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: "◈",
      title: "Information We Collect",
      body: [
        "Any information that you provide to us whilst using this website will be collected, stored and used when dealing with your enquiry or providing our make-up services as requested by you. This may include (but is not limited to) name, email address and telephone number.",
        "From time to time we may send you newsletters or inform you of new services and events. You may unsubscribe at any time by contacting us at myxprecioussmua@outlook.com",
        "This also applies to other forms of contact including texting, emails, phone calls and messaging apps. We will also send you appointment information and reminders via text, email or via a messaging app.",
        "We will only share your data with a third party that you have requested or agreed to in advance. Any medical information held will only be used in connection with your appointment — the correct medical information is required to carry out your appointment safely.",
        "Any personal data collected will be treated as confidential in line with the principles of the Data Protection Act 1998. All data is stored in a secure environment with relevant security protocols.",
      ],
    },
    {
      icon: "◇",
      title: "Why We Collect This Information",
      body: [
        "We collect this data from you in order to provide and operate makeup services and ongoing customer service. This information is also used for our internal records.",
      ],
    },
    {
      icon: "◉",
      title: "Deleting Your Data",
      body: [
        "If you no longer wish for us to hold your data, please contact us at precious@gmail.com and we will remove your information promptly.",
      ],
    },
    {
      icon: "✦",
      title: "Cookies",
      body: [
        "Cookies are small pieces of data stored on a site visitor's browser, usually used to keep track of their movements and actions on a site. We use cookies on our website to improve your browsing experience.",
      ],
    },
    {
      icon: "◆",
      title: "General",
      body: [
        "Our Privacy Policy should be read in conjunction with our Terms and Conditions. We reserve the right to modify both of these policies at any time without notice — therefore we request that they are reviewed frequently.",
        "Changes and clarifications will take effect immediately upon their posting on the website. If we make material changes to this policy, we will notify you here that it has been updated, so that you are aware of what information we collect, how we use it, and under what circumstances we use and/or disclose it.",
      ],
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lora:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400&display=swap');

        * { box-sizing: border-box; }

        .grain-overlay::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .delay-1 { animation-delay: 0.12s; }
        .delay-2 { animation-delay: 0.24s; }

        .privacy-page {
          min-height: 100vh;
          background-color: #faf6f1;
          display: flex;
          flex-direction: column;
        }

        .privacy-topbar {
          height: 4px;
          width: 100%;
          background: linear-gradient(to right, #c9a96e, #e8c99a, #c9a96e);
          flex-shrink: 0;
        }

        .privacy-inner {
          position: relative;
          z-index: 10;
          flex: 1;
          max-width: 720px;
          margin: 0 auto;
          width: 100%;
          padding: 72px 24px 80px;
        }

        /* ── Header ── */
        .privacy-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .privacy-eyebrow {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.68rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 14px;
        }
        .privacy-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: clamp(2rem, 6vw, 2.9rem);
          color: #2c1f14;
          line-height: 1.1;
        }
        .privacy-title em {
          font-weight: 400;
        }
        .privacy-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 18px 0 20px;
        }
        .privacy-divider-line {
          height: 1px;
          width: 48px;
          background: rgba(201,169,110,0.4);
        }
        .privacy-divider-star {
          color: #c9a96e;
          font-size: 0.65rem;
        }
        .privacy-intro {
          font-family: 'Lora', Georgia, serif;
          font-style: italic;
          font-size: 0.9rem;
          line-height: 1.8;
          color: #7a5c46;
          max-width: 440px;
          margin: 0 auto;
        }

        /* ── Sections ── */
        .privacy-sections {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .privacy-card {
          background: white;
          border: 1px solid #e8ddd4;
          border-radius: 20px;
          padding: 28px 32px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .privacy-card:hover {
          border-color: rgba(201,169,110,0.35);
          box-shadow: 0 4px 18px rgba(201,169,110,0.07);
        }

        .privacy-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }
        .privacy-card-icon {
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(201,169,110,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c9a96e;
          font-size: 0.75rem;
        }
        .privacy-card-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: 1.2rem;
          color: #2c1f14;
          letter-spacing: 0.01em;
        }

        .privacy-card-rule {
          height: 1px;
          background: linear-gradient(to right, rgba(201,169,110,0.25), transparent);
          margin-bottom: 16px;
        }

        .privacy-card-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .privacy-card-body p {
          font-family: 'Lora', Georgia, serif;
          font-size: 0.875rem;
          line-height: 1.85;
          color: #7a5c46;
          margin: 0;
        }
        .privacy-card-body a {
          color: #c9a96e;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.2s ease;
        }
        .privacy-card-body a:hover {
          color: #a07840;
        }

        /* ── Last updated ── */
        .privacy-updated {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 48px;
        }
        .privacy-updated-line {
          height: 1px;
          width: 32px;
          background: rgba(201,169,110,0.3);
        }
        .privacy-updated-text {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #b09070;
        }

        /* ── Footer ── */
        .privacy-footer {
          position: relative;
          z-index: 10;
          border-top: 1px solid #e8ddd4;
        }
        .privacy-footer-inner {
          max-width: 720px;
          margin: 0 auto;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .privacy-footer-brand {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: 0.85rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #2c1f14;
        }
        .privacy-footer-nav {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px 20px;
        }
        .footer-link {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7a5c46;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-link:hover { color: #c9a96e; }
        .privacy-footer-copy {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: #b09070;
        }

        /* ── Mobile ── */
        @media (max-width: 600px) {
          .privacy-inner {
            padding: 48px 16px 60px;
          }
          .privacy-card {
            padding: 22px 20px;
          }
          .privacy-card-title {
            font-size: 1.05rem;
          }
          .privacy-card-body p {
            font-size: 0.84rem;
          }
        }
      `}</style>

      <div className="grain-overlay privacy-page">

        {/* Gold top bar */}
        <div className="privacy-topbar" />

        <main className="privacy-inner">

          {/* Header */}
          <header className="privacy-header fade-up">
            <p className="privacy-eyebrow">Myxprecioussmua</p>
            <h1 className="privacy-title">
              Privacy
              <br />
              <em>Policy</em>
            </h1>
            <div className="privacy-divider">
              <div className="privacy-divider-line" />
              <span className="privacy-divider-star">✦</span>
              <div className="privacy-divider-line" />
            </div>
            <p className="privacy-intro">
              We take your privacy seriously. This policy explains what information
              we record and how it is used.
            </p>
          </header>

          {/* Section cards */}
          <div className="privacy-sections fade-up delay-1">
            {sections.map((section, i) => (
              <div key={i} className="privacy-card">
                <div className="privacy-card-header">
                  <div className="privacy-card-icon">{section.icon}</div>
                  <h2 className="privacy-card-title">{section.title}</h2>
                </div>
                <div className="privacy-card-rule" />
                <div className="privacy-card-body">
                  {section.body.map((para, j) => {
                    // Linkify the email address
                    if (para.includes("precious@gmail.com")) {
                      const parts = para.split("precious@gmail.com");
                      return (
                        <p key={j}>
                          {parts[0]}
                          <a href="mailto:precious@gmail.com">precious@gmail.com</a>
                          {parts[1]}
                        </p>
                      );
                    }
                    return <p key={j}>{para}</p>;
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Last updated note */}
          <div className="privacy-updated fade-up delay-2">
            <div className="privacy-updated-line" />
            <p className="privacy-updated-text">Last reviewed — 20th june 2026</p>
            <div className="privacy-updated-line" />
          </div>

        </main>

        {/* Footer */}
        <footer className="privacy-footer">
          <div className="privacy-footer-inner">
            <p className="privacy-footer-brand">Myxprecioussmua</p>
            <nav className="privacy-footer-nav">
              <Link href="/Spotlight" className="footer-link">Spotlight</Link>
              <Link href="/Bridal" className="footer-link">Bridal</Link>
              <Link href="/Collab" className="footer-link">Collab</Link>
              <Link href="/Request-Appointment" className="footer-link">Booking</Link>
              <Link href="/Contact" className="footer-link">Contact</Link>
            </nav>
            <p className="privacy-footer-copy">© Myxprecioussmua — All rights reserved</p>
          </div>
        </footer>

      </div>
    </>
  );
}