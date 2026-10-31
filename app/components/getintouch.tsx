'use client'
import { useState } from "react";
import Link from "next/link";
import Footer from "./footer"

export default function GetInTouch() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

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
        .fade-up  { animation: fadeUp 0.7s ease both; }
        .delay-1  { animation-delay: 0.12s; }
        .delay-2  { animation-delay: 0.24s; }
        .delay-3  { animation-delay: 0.36s; }

        .contact-input {
          width: 100%;
          background: white;
          border: 1px solid #e8ddd4;
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 0.875rem;
          color: #2c1f14;
          font-family: 'Lora', Georgia, serif;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .contact-input::placeholder {
          color: #b09070;
          font-style: italic;
        }
        .contact-input:focus {
          border-color: #c9a96e;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.12);
        }

        .submit-btn {
          transition: box-shadow 0.25s ease, transform 0.25s ease, background 0.25s ease;
        }
        .submit-btn:hover {
          box-shadow: 0 6px 28px rgba(201,169,110,0.4);
          transform: translateY(-1px);
        }
        .submit-btn:active {
          transform: translateY(0);
        }

        .contact-card {
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .contact-card:hover {
          border-color: rgba(201,169,110,0.4) !important;
          background: rgba(201,169,110,0.05) !important;
        }

        @keyframes successPop {
          0%   { opacity: 0; transform: scale(0.92) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .success-pop {
          animation: successPop 0.45s ease both;
        }

        .footer-link {
          transition: color 0.2s ease;
          color: #7a5c46;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
        }
        .footer-link:hover { color: #c9a96e; }

        /* ── Layout grid: side-by-side on md+, stacked on mobile ── */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 40px;
        }

        /* ── Mobile breakpoint ── */
        @media (max-width: 640px) {
          /* Stack the two-column grid */
          .content-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-bottom: 28px;
          }

          /* Hide the decorative quote card on mobile to reduce scroll */
          .decorative-quote {
            display: none;
          }

          /* Page padding */
          .page-inner {
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-top: 40px !important;
            padding-bottom: 40px !important;
          }

          /* Header title */
          .page-title {
            font-size: 2.1rem !important;
          }

          /* Header bottom margin */
          .page-header {
            margin-bottom: 36px !important;
          }

          /* Contact info cards — slightly tighter */
          .contact-card {
            padding: 14px 16px !important;
          }

          /* Form card */
          .form-card {
            padding: 20px 16px !important;
          }

          /* Success card */
          .success-card {
            padding: 32px 20px !important;
          }

          /* Footer nav wraps on small screens */
          .footer-inner {
            flex-direction: column !important;
            align-items: center !important;
            gap: 16px !important;
          }
          .footer-nav {
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 10px 16px !important;
          }
        }

        @media (max-width: 360px) {
          .page-title {
            font-size: 1.8rem !important;
          }
        }
      `}</style>

      <div className="grain-overlay min-h-screen relative flex flex-col" style={{ backgroundColor: "#faf6f1" }}>

        {/* Top gold bar */}
        <div className="h-1 w-full flex-shrink-0" style={{ background: "linear-gradient(to right, #c9a96e, #e8c99a, #c9a96e)" }} />

        <div
          className="page-inner relative z-10 flex-1 w-full px-6 py-16"
          style={{ maxWidth: "672px", margin: "0 auto" }}
        >

          {/* ── HEADER ── */}
          <header className="page-header text-center mb-14 fade-up">
            <p
              className="text-xs tracking-[0.3em] text-[#c9a96e] uppercase mb-4"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
            >
              Myxprecioussmua
            </p>
            <h1
              className="page-title leading-tight text-[#2c1f14] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: "2.8rem" }}
            >
              Get In
              <br />
              <em style={{ fontWeight: 400 }}>Touch</em>
            </h1>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px w-12 bg-[#c9a96e]/40" />
              <span className="text-[#c9a96e] text-xs">✦</span>
              <div className="h-px w-12 bg-[#c9a96e]/40" />
            </div>
            <p
              className="mt-5 text-[#7a5c46] text-sm leading-relaxed max-w-xs mx-auto"
              style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic" }}
            >
              If you have any questions, please feel free to reach out.
            </p>
          </header>

          {/* ── CONTACT CARDS + FORM ── */}
          <div className="content-grid">

            {/* Left — contact details */}
            <div className="flex flex-col gap-4 fade-up delay-1">
              {/* Email */}
              <div
                className="contact-card rounded-2xl border px-6 py-5 flex items-start gap-4"
                style={{ background: "linear-gradient(135deg, #fdf8f2, #faf3ea)", borderColor: "#e8ddd4" }}
              >
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs"
                  style={{ background: "rgba(201,169,110,0.12)", color: "#c9a96e" }}
                >
                  ✉
                </div>
                <div style={{ minWidth: 0 }}>
                  <p
                    className="text-xs uppercase tracking-widest text-[#c9a96e] mb-1"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.12em" }}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:myxprecioussmua@outlook.com"
                    className="text-sm text-[#5a4435] transition-colors duration-200 hover:text-[#c9a96e]"
                    style={{ fontFamily: "'Lora', Georgia, serif", wordBreak: "break-all" }}
                  >
                    myxprecioussmua@outlook.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div
                className="contact-card rounded-2xl border px-6 py-5 flex items-start gap-4"
                style={{ background: "linear-gradient(135deg, #fdf8f2, #faf3ea)", borderColor: "#e8ddd4" }}
              >
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs"
                  style={{ background: "rgba(201,169,110,0.12)", color: "#c9a96e" }}
                >
                  ✆
                </div>
                <div>
                  <p
                    className="text-xs uppercase tracking-widest text-[#c9a96e] mb-1"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.12em" }}
                  >
                    Phone Number
                  </p>
                  <a
                    href="tel:07496837465"
                    className="text-sm text-[#5a4435] transition-colors duration-200 hover:text-[#c9a96e]"
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                  >
                    07496837465
                  </a>
                </div>
              </div>

              {/* Decorative quote — hidden on mobile */}
              <div
                className="decorative-quote rounded-2xl border px-6 py-5 mt-auto"
                style={{ borderColor: "rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.04)" }}
              >
                <span className="text-[#c9a96e] block mb-2 text-xs">✦</span>
                <p
                  className="text-xs text-[#a08060] leading-relaxed"
                  style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic" }}
                >
                  I typically respond within 24–48 hours. I can't wait to hear about your big day.
                </p>
              </div>
            </div>

            {/* Right — form */}
            <div className="fade-up delay-2">
              {submitted ? (
                <div
                  className="success-card success-pop rounded-2xl border px-8 py-10 flex flex-col items-center justify-center text-center"
                  style={{ background: "linear-gradient(135deg, #fdf8f2, #faf3ea)", borderColor: "rgba(201,169,110,0.35)" }}
                >
                  <span className="text-[#c9a96e] text-3xl block mb-4">✦</span>
                  <h3
                    className="text-[#2c1f14] mb-3"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: "1.5rem" }}
                  >
                    Message Sent
                  </h3>
                  <p
                    className="text-sm text-[#7a5c46] leading-relaxed"
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                  >
                    Thank you for reaching out! I'll be in touch with you very soon.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", message: "" }); }}
                    className="mt-6 text-xs underline underline-offset-4 transition-colors duration-200"
                    style={{ color: "#c9a96e", fontFamily: "'Jost', sans-serif", fontWeight: 300, background: "none", border: "none", cursor: "pointer" }}
                    onMouseOver={e => (e.currentTarget.style.color = "#a07840")}
                    onMouseOut={e => (e.currentTarget.style.color = "#c9a96e")}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <div
                  className="form-card bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-[#e8ddd4] px-6 py-7 flex flex-col gap-4"
                >
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest text-[#c9a96e] mb-2"
                      style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.12em" }}
                    >
                      Name / Business Name
                    </label>
                    <input
                      className="contact-input"
                      type="text"
                      name="name"
                      placeholder="Your name or business"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest text-[#c9a96e] mb-2"
                      style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.12em" }}
                    >
                      Email
                    </label>
                    <input
                      className="contact-input"
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest text-[#c9a96e] mb-2"
                      style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.12em" }}
                    >
                      Message
                    </label>
                    <textarea
                      className="contact-input"
                      name="message"
                      placeholder="Tell me about your special day…"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      style={{ resize: "none" }}
                    />
                  </div>
                  <button
                    className="submit-btn w-full py-3 rounded-full text-sm uppercase tracking-widest mt-1"
                    onClick={handleSubmit}
                    style={{
                      background: "linear-gradient(135deg, #c9a96e, #a07840)",
                      color: "#faf6f1",
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                      letterSpacing: "0.15em",
                      boxShadow: "0 4px 18px rgba(201,169,110,0.28)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Send Message ✦
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        < Footer />

      </div>
    </>
  );
}