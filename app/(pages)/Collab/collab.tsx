"use client"
import { useState } from "react";
import Link from "next/link";

const collabTypes = [
  { id: "editorial", label: "Editorial Shoot", icon: "◈" },
  { id: "film-tv", label: "Film / TV", icon: "◉" },
  { id: "brand", label: "Brand Campaign", icon: "◇" },
  { id: "event", label: "Event", icon: "✦" },
  { id: "runway", label: "Runway", icon: "◆" },
  { id: "content", label: "Content Creation", icon: "◎" },
];

const initialForm = {
  brandName: "",
  collabType: "",
  projectDetails: "",
  dates: "",
  location: "",
  budget: "",
};

export default function CollabPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selectType = (id: string) => {
    setForm((prev) => ({ ...prev, collabType: prev.collabType === id ? "" : id }));
  };

  const handleSubmit = async () => {
    if (!form.brandName || !form.collabType || !form.projectDetails) return;
  
    try {
      const response = await fetch("/api/collab", {
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
        alert("Failed to send inquiry.");
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
        .delay-4  { animation-delay: 0.48s; }

        @keyframes successPop {
          0%   { opacity: 0; transform: scale(0.93) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .success-pop { animation: successPop 0.45s ease both; }

        .collab-input {
          width: 100%;
          background: white;
          border: 1px solid #e8ddd4;
          border-radius: 12px;
          padding: 13px 18px;
          font-size: 0.875rem;
          color: #2c1f14;
          font-family: 'Lora', Georgia, serif;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .collab-input::placeholder {
          color: #b09070;
          font-style: italic;
        }
        .collab-input:focus {
          border-color: #c9a96e;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.12);
        }

        .type-chip {
          cursor: pointer;
          transition: all 0.22s ease;
          border: 1px solid #e8ddd4;
          background: white;
          border-radius: 999px;
          padding: 8px 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          color: #7a5c46;
        }
        .type-chip:hover {
          border-color: rgba(201,169,110,0.5);
          color: #2c1f14;
          background: rgba(201,169,110,0.05);
        }
        .type-chip.selected {
          border-color: #c9a96e;
          background: linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.06));
          color: #2c1f14;
        }
        .type-chip.selected .chip-icon {
          color: #c9a96e;
        }

        .submit-btn {
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        .submit-btn:hover {
          box-shadow: 0 6px 28px rgba(201,169,110,0.4);
          transform: translateY(-1px);
        }
        .submit-btn:active { transform: translateY(0); }

        .collab-card {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .collab-card:hover {
          border-color: rgba(201,169,110,0.35) !important;
          box-shadow: 0 4px 18px rgba(201,169,110,0.08);
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

        /* ── Responsive grid for date/location inputs ── */
        .input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* ── Mobile breakpoint ── */
        @media (max-width: 600px) {
          .input-grid {
            grid-template-columns: 1fr;
          }

          /* Collab type cards: 2 columns on mobile, tighter padding */
          .collab-type-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
          .collab-card {
            padding: 14px 12px !important;
          }

          /* Header text */
          .page-title {
            font-size: 2.1rem !important;
          }

          /* Page padding */
          .page-inner {
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-top: 40px !important;
            padding-bottom: 40px !important;
          }

          /* Form card padding */
          .form-card {
            padding: 20px 16px !important;
          }

          /* Success card */
          .success-card {
            padding: 32px 20px !important;
          }

          /* Footer nav — wrap and center */
          .footer-inner {
            flex-direction: column !important;
            align-items: center !important;
            gap: 16px !important;
          }
          .footer-nav {
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 12px 16px !important;
          }

          /* Section header mb */
          .collab-section-header {
            margin-bottom: 16px !important;
          }

          /* Chip wrap on small screens */
          .type-chip {
            padding: 7px 11px;
            font-size: 0.73rem;
          }
        }

        /* Very small screens */
        @media (max-width: 360px) {
          .collab-type-grid {
            grid-template-columns: 1fr !important;
          }
          .page-title {
            font-size: 1.8rem !important;
          }
        }
      `}</style>

      <div
        className="grain-overlay min-h-screen relative flex flex-col"
        style={{ backgroundColor: "#faf6f1" }}
      >
        {/* Top gold bar */}
        <div
          className="h-1 w-full flex-shrink-0"
          style={{ background: "linear-gradient(to right, #c9a96e, #e8c99a, #c9a96e)" }}
        />

        <div className="page-inner relative z-10 flex-1 w-full px-6 py-16" style={{ maxWidth: "672px", margin: "0 auto" }}>

          {/* ── HEADER ── */}
          <header className="text-center mb-14 fade-up">
            <p
              className="text-xs tracking-[0.3em] text-[#c9a96e] uppercase mb-4"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
            >
              Myxprecioussmua
            </p>
            <h1
              className="page-title leading-tight text-[#2c1f14] mb-3"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 500,
                fontSize: "2.8rem",
              }}
            >
              Let's
              <br />
              <em style={{ fontWeight: 400 }}>Collaborate</em>
            </h1>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px w-12 bg-[#c9a96e]/40" />
              <span className="text-[#c9a96e] text-xs">✦</span>
              <div className="h-px w-12 bg-[#c9a96e]/40" />
            </div>
            <p
              className="mt-5 text-[#7a5c46] text-sm leading-relaxed max-w-sm mx-auto"
              style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic" }}
            >
              Tests and editorial shoots, film or TV, brand campaigns, events, runways,
              or content creation — I'd love to hear from you.
            </p>
          </header>

          {/* ── COLLAB TYPE TILES ── */}
          <section className="mb-10 fade-up delay-1">
            <div className="collab-section-header text-center mb-8">
              <p
                className="text-xs tracking-[0.3em] text-[#c9a96e] uppercase"
                style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
              >
                What are we working on?
              </p>
            </div>
            <div
              className="collab-type-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}
            >
              {collabTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => selectType(type.id)}
                  className={`collab-card rounded-2xl border px-5 py-5 text-left transition-all duration-200 ${
                    form.collabType === type.id
                      ? "border-[#c9a96e]"
                      : "border-[#e8ddd4]"
                  }`}
                  style={{
                    background:
                      form.collabType === type.id
                        ? "linear-gradient(135deg, #fdf8f2, #faf3ea)"
                        : "white",
                  }}
                >
                  <span
                    className="block text-lg mb-2"
                    style={{
                      color: form.collabType === type.id ? "#c9a96e" : "#c9a96e40",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {type.icon}
                  </span>
                  <span
                    className="text-xs uppercase tracking-widest block"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                      letterSpacing: "0.1em",
                      color: form.collabType === type.id ? "#2c1f14" : "#7a5c46",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* ── INQUIRY FORM ── */}
          <section className="fade-up delay-2">
            {submitted ? (
              <div
                className="success-card success-pop rounded-2xl border px-8 py-12 text-center"
                style={{
                  background: "linear-gradient(135deg, #fdf8f2, #faf3ea)",
                  borderColor: "rgba(201,169,110,0.35)",
                }}
              >
                <span className="text-[#c9a96e] text-3xl block mb-4">✦</span>
                <h3
                  className="text-[#2c1f14] mb-3"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 500,
                    fontSize: "1.6rem",
                  }}
                >
                  Inquiry Received
                </h3>
                <p
                  className="text-sm text-[#7a5c46] leading-relaxed max-w-xs mx-auto mb-6"
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                >
                  Thank you for reaching out! I'll review your inquiry and be in touch within 48 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm(initialForm); }}
                  className="text-xs underline underline-offset-4 transition-colors duration-200"
                  style={{
                    color: "#c9a96e",
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onMouseOver={e => (e.currentTarget.style.color = "#a07840")}
                  onMouseOut={e => (e.currentTarget.style.color = "#c9a96e")}
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <div
                className="form-card bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-[#e8ddd4] px-6 py-8 flex flex-col gap-5"
              >

                {/* Section label */}
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-px flex-1 bg-[#e8ddd4]" />
                  <p
                    className="text-xs uppercase tracking-widest text-[#c9a96e]"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.15em" }}
                  >
                    Your Inquiry
                  </p>
                  <div className="h-px flex-1 bg-[#e8ddd4]" />
                </div>

                {/* Brand name */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-widest text-[#c9a96e] mb-2"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.12em" }}
                  >
                    Brand or Company Name <span style={{ color: "#c9a96e" }}>*</span>
                  </label>
                  <input
                    className="collab-input"
                    type="text"
                    name="brandName"
                    placeholder="Your brand or company name"
                    value={form.brandName}
                    onChange={handleChange}
                  />
                </div>

                {/* Type of collaboration */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-widest text-[#c9a96e] mb-2"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.12em" }}
                  >
                    Type of Collaboration <span style={{ color: "#c9a96e" }}>*</span>
                  </label>
                  {form.collabType ? (
                    <div
                      className="collab-input flex items-center justify-between"
                      style={{ cursor: "default" }}
                    >
                      <span>
                        {collabTypes.find((t) => t.id === form.collabType)?.label}
                      </span>
                      <button
                        onClick={() => setForm((p) => ({ ...p, collabType: "" }))}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#c9a96e",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontFamily: "'Jost', sans-serif",
                        }}
                      >
                        change
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {collabTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => selectType(type.id)}
                          className={`type-chip ${form.collabType === type.id ? "selected" : ""}`}
                        >
                          <span className="chip-icon" style={{ color: "#c9a96e80", fontSize: "0.7rem" }}>
                            {type.icon}
                          </span>
                          {type.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Project details */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-widest text-[#c9a96e] mb-2"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.12em" }}
                  >
                    Project Details & Scope <span style={{ color: "#c9a96e" }}>*</span>
                  </label>
                  <textarea
                    className="collab-input"
                    name="projectDetails"
                    placeholder="Tell me about the project — concept, number of looks, team size, any references…"
                    rows={4}
                    value={form.projectDetails}
                    onChange={handleChange}
                    style={{ resize: "none" }}
                  />
                </div>

                {/* Dates + Location */}
                <div className="input-grid">
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest text-[#c9a96e] mb-2"
                      style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.12em" }}
                    >
                      Dates
                    </label>
                    <input
                      className="collab-input"
                      type="text"
                      name="dates"
                      placeholder="e.g. 12–14 Aug 2025"
                      value={form.dates}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest text-[#c9a96e] mb-2"
                      style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.12em" }}
                    >
                      Location
                    </label>
                    <input
                      className="collab-input"
                      type="text"
                      name="location"
                      placeholder="Postcode or Address"
                      value={form.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-widest text-[#c9a96e] mb-2"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.12em" }}
                  >
                    Budget{" "}
                    <span
                      style={{
                        color: "#b09070",
                        fontFamily: "'Lora', sans-serif",
                        fontStyle: "italic",
                        textTransform: "none",
                        letterSpacing: 0,
                        fontSize: "0.7rem",
                      }}
                    >
                      (if applicable)
                    </span>
                  </label>
                  <input
                    className="collab-input"
                    type="text"
                    name="budget"
                    placeholder="e.g. £500–£1,000 or TBD"
                    value={form.budget}
                    onChange={handleChange}
                  />
                </div>

                {/* Required note */}
                <p
                  className="text-xs text-[#b09070] -mt-2"
                  style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic" }}
                >
                  Fields marked <span style={{ color: "#c9a96e" }}>✦</span> are required.
                </p>

                {/* Submit */}
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
                  Send Inquiry ✦
                </button>
              </div>
            )}
          </section>

        </div>

        {/* ── FOOTER ── */}
        <footer className="relative z-10 border-t" style={{ borderColor: "#e8ddd4" }}>
          <div style={{ maxWidth: "672px", margin: "0 auto" }} className="px-6 py-8">
            <div className="footer-inner flex flex-col md:flex-row items-center justify-between gap-6">
              <p
                className="text-sm tracking-[0.2em] text-[#2c1f14] uppercase"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}
              >
                Myxprecioussmua
              </p>
              <nav className="footer-nav flex items-center gap-6">
                <Link href="/Spotlight" className="footer-link">Spotlight</Link>
                <Link href="/Bridal" className="footer-link">Bridal</Link>
                <Link href="/Collab" className="footer-link">Collab</Link>
                <Link href="/Booking" className="footer-link">Booking</Link>
                <Link href="/Contact" className="footer-link">Contact</Link>
              </nav>
            </div>
            <div className="flex items-center justify-center gap-3 mt-7 mb-4">
              <div className="h-px w-8 bg-[#c9a96e]/30" />
              <span className="text-[#c9a96e]/50 text-xs">✦</span>
              <div className="h-px w-8 bg-[#c9a96e]/30" />
            </div>
            <p
              className="text-center text-xs text-[#b09070]"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.1em" }}
            >
              © Myxprecioussmua — All rights reserved
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}