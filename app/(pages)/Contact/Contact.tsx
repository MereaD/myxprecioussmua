'use client'
import { useState } from "react";
import Footer from "@/app/components/footer"

const contactReasons = [
  { id: "bridal", label: "Bridal Enquiry", icon: "◇" },
  { id: "collab", label: "Collaboration", icon: "◈" },
  { id: "general", label: "General Question", icon: "✦" },
  { id: "pricing", label: "Pricing & Availability", icon: "◎" },
];

const initialForm = {
  name: "",
  email: "",
  reason: "",
  message: "",
};

export default function ContactMe() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selectReason = (id: string) => {
    setForm((prev) => ({ ...prev, reason: prev.reason === id ? "" : id }));
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

        @keyframes successPop {
          0%   { opacity: 0; transform: scale(0.92) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .success-pop { animation: successPop 0.45s ease both; }

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

        .reason-chip {
          cursor: pointer;
          border: 1px solid #e8ddd4;
          border-radius: 999px;
          padding: 8px 16px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          color: #7a5c46;
          background: white;
          transition: all 0.22s ease;
        }
        .reason-chip:hover {
          border-color: rgba(201,169,110,0.45);
          color: #2c1f14;
          background: rgba(201,169,110,0.04);
        }
        .reason-chip.selected {
          border-color: #c9a96e;
          background: linear-gradient(135deg, rgba(201,169,110,0.14), rgba(201,169,110,0.05));
          color: #2c1f14;
        }
        .reason-chip.selected .chip-icon { color: #c9a96e; }

        .submit-btn {
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        .submit-btn:hover {
          box-shadow: 0 6px 28px rgba(201,169,110,0.4);
          transform: translateY(-1px);
        }
        .submit-btn:active { transform: translateY(0); }

        .info-card {
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .info-card:hover {
          border-color: rgba(201,169,110,0.4) !important;
          background: rgba(201,169,110,0.05) !important;
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
      `}</style>

      <div className="grain-overlay min-h-screen relative flex flex-col" style={{ backgroundColor: "#faf6f1" }}>

        {/* Top gold bar */}
        <div className="h-1 w-full flex-shrink-0" style={{ background: "linear-gradient(to right, #c9a96e, #e8c99a, #c9a96e)" }} />

        <div className="relative z-10 flex-1 max-w-2xl mx-auto w-full px-6 py-16">

          {/* ── HEADER ── */}
          <header className="text-center mb-14 fade-up">
            <p
              className="text-xs tracking-[0.3em] text-[#c9a96e] uppercase mb-4"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
            >
              Myxprecioussmua
            </p>
            <h1
              className="leading-tight text-[#2c1f14] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: "2.8rem" }}
            >
              Contact
              <br />
              <em style={{ fontWeight: 400 }}>Me</em>
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
              Whether it's a question, an idea, or just a hello — my inbox is always open.
            </p>
          </header>

          {/* ── INFO CARDS + FORM ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

            {/* Left — contact details */}
            <div className="flex flex-col gap-4 fade-up delay-1">

              {/* Email */}
              <div
                className="info-card rounded-2xl border px-6 py-5 flex items-start gap-4"
                style={{ background: "linear-gradient(135deg, #fdf8f2, #faf3ea)", borderColor: "#e8ddd4" }}
              >
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs"
                  style={{ background: "rgba(201,169,110,0.12)", color: "#c9a96e" }}
                >
                  ✉
                </div>
                <div>
                  <p
                    className="text-xs uppercase tracking-widest text-[#c9a96e] mb-1"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.12em" }}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:myxprecioussmua@outlook.com"
                    className="text-sm text-[#5a4435] transition-colors duration-200 hover:text-[#c9a96e]"
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                  >
                    myxprecioussmua@outlook.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div
                className="info-card rounded-2xl border px-6 py-5 flex items-start gap-4"
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

              {/* Reason chips */}
              <div
                className="rounded-2xl border px-6 py-5 flex-1"
                style={{ borderColor: "rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.04)" }}
              >
                <p
                  className="text-xs uppercase tracking-widest text-[#c9a96e] mb-3"
                  style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.12em" }}
                >
                  I'm reaching out about…
                </p>
                <div className="flex flex-wrap gap-2">
                  {contactReasons.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => selectReason(r.id)}
                      className={`reason-chip ${form.reason === r.id ? "selected" : ""}`}
                    >
                      <span
                        className="chip-icon"
                        style={{
                          color: form.reason === r.id ? "#c9a96e" : "rgba(201,169,110,0.45)",
                          fontSize: "0.65rem",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {r.icon}
                      </span>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Response note */}
              <div
                className="rounded-2xl border px-6 py-4"
                style={{ borderColor: "rgba(201,169,110,0.15)", background: "transparent" }}
              >
                <p
                  className="text-xs text-[#a08060] leading-relaxed"
                  style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic" }}
                >
                  ✦ &nbsp;I typically respond within 24–48 hours.
                </p>
              </div>

            </div>

            {/* Right — form */}
            <div className="fade-up delay-2">
              {submitted ? (
                <div
                  className="success-pop h-full rounded-2xl border px-8 py-10 flex flex-col items-center justify-center text-center"
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
                    onClick={() => { setSubmitted(false); setForm(initialForm); }}
                    className="mt-6 text-xs underline underline-offset-4 transition-colors duration-200"
                    style={{ color: "#c9a96e", fontFamily: "'Jost', sans-serif", fontWeight: 300, background: "none", border: "none", cursor: "pointer" }}
                    onMouseOver={e => (e.currentTarget.style.color = "#a07840")}
                    onMouseOut={e => (e.currentTarget.style.color = "#c9a96e")}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-[#e8ddd4] px-6 py-7 flex flex-col gap-4">

                  {/* Name */}
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest text-[#c9a96e] mb-2"
                      style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.12em" }}
                    >
                      Your Name
                    </label>
                    <input
                      className="contact-input"
                      type="text"
                      name="name"
                      placeholder="First and last name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest text-[#c9a96e] mb-2"
                      style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.12em" }}
                    >
                      Email Address
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

                  {/* Reason — echoes left panel selection */}
                  {form.reason && (
                    <div>
                      <label
                        className="block text-xs uppercase tracking-widest text-[#c9a96e] mb-2"
                        style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.12em" }}
                      >
                        Topic
                      </label>
                      <div
                        className="contact-input flex items-center justify-between"
                        style={{ cursor: "default" }}
                      >
                        <span style={{ color: "#5a4435" }}>
                          {contactReasons.find((r) => r.id === form.reason)?.label}
                        </span>
                        <button
                          onClick={() => setForm((p) => ({ ...p, reason: "" }))}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#c9a96e",
                            cursor: "pointer",
                            fontSize: "0.72rem",
                            fontFamily: "'Jost', sans-serif",
                          }}
                        >
                          change
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message */}
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
                      placeholder="What's on your mind?"
                      rows={form.reason ? 4 : 6}
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

       < Footer/>

      </div>
    </>
  );
}