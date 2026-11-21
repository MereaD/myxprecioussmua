'use client'
import { useState } from "react";
import Link from "next/link";

const testimonials = [
  {
    name: "Amara O.",
    date: "March 2024",
    quote:
      "I felt like the most beautiful version of myself. Every detail was perfect — from the trial to the morning of the wedding. Truly stress-free.",
    look: "Soft Glam",
  },
];

const fees = [
  { label: "Early Morning (6am – 8am)", amount: "+£15" },
  { label: "Saturday & Sunday", amount: "+£20" },
  { label: "After 6pm", amount: "+£10" },
  { label: "Same Day Booking", amount: "+£15" },
  { label: "Travel Outside Milton Keynes", amount: "Quoted individually" },
];

export default function BridalPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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
        .delay-4  { animation-delay: 0.48s; }

        @keyframes testimonialIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .testimonial-enter {
          animation: testimonialIn 0.4s ease both;
        }

        .fee-row {
          transition: background 0.2s ease;
        }
        .fee-row:hover {
          background: rgba(201,169,110,0.05) !important;
        }

        .cta-btn {
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        .cta-btn:hover {
          box-shadow: 0 6px 28px rgba(201,169,110,0.4);
          transform: translateY(-1px);
        }
      `}</style>

      <div className="grain-overlay min-h-screen relative" style={{ backgroundColor: "#faf6f1" }}>

        {/* Top gold gradient bar — matches T&C */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(to right, #c9a96e, #e8c99a, #c9a96e)" }} />

        <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">

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
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 500,
                fontSize: "2.8rem",
              }}
            >
              Bridal
              <br />
              <em style={{ fontWeight: 400 }}>Make-up</em>
            </h1>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px w-12 bg-[#c9a96e]/40" />
              <span className="text-[#c9a96e] text-xs">✦</span>
              <div className="h-px w-12 bg-[#c9a96e]/40" />
            </div>
            
          </header>

          {/* ── PERSONAL MESSAGE ── */}
          <section className="mb-10 fade-up delay-1">
            <div
              className="rounded-2xl border px-8 py-9 text-center"
              style={{ background: "linear-gradient(135deg, #fdf8f2, #faf3ea)", borderColor: "#e8ddd4" }}
            >
              <span className="text-[#c9a96e] text-lg block mb-4">✦</span>
              <h2
                className="text-[#2c1f14] mb-4"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: "1.6rem",
                }}
              >
                Congratulations on the new chapter
              </h2>
              <p
                className="text-sm text-[#7a5c46] leading-relaxed"
                style={{ fontFamily: "'Lora', Georgia, serif", lineHeight: 1.95 }}
              >
                I'm so grateful to be considered for your special day. My goal is to make everything
                outside the makeup feel easy and stress-free — from booking and pricing to communication —
                so we can focus on what truly matters:{" "}
                <em>you feeling and looking absolutely amazing.</em>
              </p>
            </div>
          </section>

          {/* ── TESTIMONIALS ── */}
          <section className="mb-10 fade-up delay-2">
            <div className="text-center mb-8">
              <p
                className="text-xs tracking-[0.3em] text-[#c9a96e] uppercase mb-3"
                style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
              >
                Spotlight
              </p>
              <h2
                className="text-[#2c1f14]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: "2rem" }}
              >
                What My Client Said
              </h2>
            </div>

            {/* Card */}
            <div
              key={activeTestimonial}
              className="testimonial-enter rounded-2xl border px-8 py-8 mb-5"
              style={{ background: "linear-gradient(135deg, #fdf8f2, #faf3ea)", borderColor: "#e8ddd4" }}
            >
              <span
                className="text-4xl leading-none block mb-4"
                style={{ color: "#c9a96e", fontFamily: "'Cormorant Garamond', Georgia, serif", opacity: 0.45 }}
              >
                "
              </span>
              <p
                className="text-base text-[#5a4435] leading-relaxed mb-6"
                style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic" }}
              >
                {testimonials[activeTestimonial].quote}
              </p>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p
                    className="text-[#2c1f14]"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: "1rem" }}
                  >
                    {testimonials[activeTestimonial].name}
                  </p>
                  <p
                    className="text-xs mt-0.5 text-[#a08060]"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
                  >
                    {testimonials[activeTestimonial].date}
                  </p>
                </div>
                <span
                  className="text-xs px-3 py-1 rounded-full tracking-widest uppercase"
                  style={{
                    background: "rgba(201,169,110,0.1)",
                    color: "#c9a96e",
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                    border: "1px solid rgba(201,169,110,0.28)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {testimonials[activeTestimonial].look}
                </span>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  style={{
                    width: i === activeTestimonial ? "28px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    background: i === activeTestimonial ? "#c9a96e" : "rgba(201,169,110,0.28)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </section>

          {/* ── SECTION DIVIDER ── */}
          <div className="flex items-center justify-center gap-3 my-12">
            <div className="h-px flex-1 bg-[#c9a96e]/20" />
            <span className="text-[#c9a96e]/40 text-xs">✦</span>
            <div className="h-px flex-1 bg-[#c9a96e]/20" />
          </div>

          {/* ── BRIDAL PREVIEW ── */}
          <section className="mb-10 fade-up delay-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-[#e8ddd4] px-6 py-7">
              <div className="flex items-start gap-5">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm"
                  style={{ background: "rgba(201,169,110,0.12)", color: "#c9a96e" }}
                >
                  ◇
                </div>
                <div className="flex-1">
                  <h3
                    className="text-[#2c1f14] mb-2"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: "1.4rem" }}
                  >
                    Bridal Preview (Trial)
                  </h3>
                  <p
                    className="text-sm text-[#7a5c46] leading-relaxed mb-5"
                    style={{ fontFamily: "'Lora', Georgia, serif", lineHeight: 1.9 }}
                  >
                    A bridal preview is the perfect opportunity for us to create your ideal look together.
                    Should you choose to book me for your wedding day after your preview, the same makeup
                    pricing and any applicable fees will apply.
                  </p>
                  <div
                    className="inline-flex items-baseline gap-2 px-5 py-2 rounded-full border"
                    style={{
                      background: "linear-gradient(135deg, #fdf8f2, #faf3ea)",
                      borderColor: "rgba(201,169,110,0.35)",
                    }}
                  >
                    <span
                      className="text-xs text-[#a08060]"
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
                </div>
              </div>
            </div>
          </section>

          {/* ── ADDITIONAL FEES ── */}
          <section className="mb-10 fade-up delay-3">
            <div className="text-center mb-8">
           
              <h2
                className="text-[#2c1f14]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: "2rem" }}
              >
                Additional Fees
              </h2>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-[#e8ddd4] overflow-hidden">
              {fees.map((fee, i) => (
                <div
                  key={i}
                  className="fee-row flex items-center justify-between gap-4 px-4 sm:px-6 py-4"
                  style={{ borderBottom: i < fees.length - 1 ? "1px solid #e8ddd4" : "none" }}
                >
                  <span
                    className="text-sm text-[#5a4435] flex items-center gap-3 min-w-0"
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                  >
                    <span className="w-1 h-1 rounded-full bg-[#c9a96e]/50 flex-shrink-0 inline-block" />
                    {fee.label}
                  </span>
                  <span
                    className="text-sm font-medium shrink-0 text-right whitespace-nowrap"
                    style={{ color: "#c9a96e", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1rem" }}
                  >
                    {fee.amount}
                  </span>
                </div>
              ))}
              <div
                className="px-6 py-3 text-center"
                style={{ background: "linear-gradient(135deg, #fdf8f2, #faf3ea)", borderTop: "1px solid #e8ddd4" }}
              >
                <p
                  className="text-xs text-[#a08060]"
                  style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic" }}
                >
                  The following fess are added to your service price where applicable and may be combined. All additional fees will be confirmed on the invoice. 
                </p>
              </div>
            </div>
          </section>

          {/* ── BOOKING INFO ── */}
          <section className="mb-12 fade-up delay-4">
            <div
              className="rounded-xl border px-7 py-7 text-center"
              style={{ background: "linear-gradient(135deg, #fdf8f2, #faf3ea)", borderColor: "rgba(201,169,110,0.3)" }}
            >
              <span className="text-[#c9a96e] text-lg block mb-3">✦</span>
              <h3
                className="text-[#2c1f14] mb-3"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: "1.4rem" }}
              >
                Securing Your Date
              </h3>
              <p
                className="text-sm text-[#7a5c46] leading-relaxed mb-5"
                style={{ fontFamily: "'Lora', Georgia, serif", lineHeight: 1.95 }}
              >
                A{" "}
                <strong style={{ color: "#2c1f14" }}>£35 non-refundable booking fee</strong>{" "}
                is required to hold your date. The remaining balance, including any applicable fees,
                is due to be paid before your booked date.
              </p>

              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-10 bg-[#c9a96e]/30" />
                <span className="text-[#c9a96e]/40 text-xs">✦</span>
                <div className="h-px w-10 bg-[#c9a96e]/30" />
              </div>

              <p
                className="text-xs text-[#a08060] leading-relaxed mb-6"
                style={{ fontFamily: "'Lora', Georgia, serif" }}
              >
                By booking with me, you confirm and agree to the{" "}
                <Link
                  href="/Terms&Conditions"
                  className="underline underline-offset-4 transition-colors duration-200"
                  style={{ color: "#c9a96e" }}
                  onMouseOver={e => (e.currentTarget.style.color = "#a07840")}
                  onMouseOut={e => (e.currentTarget.style.color = "#c9a96e")}
                >
                  Terms &amp; Conditions
                </Link>
                .
              </p>

              <Link
                href="/Request-Appointment"
                className="cta-btn inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm uppercase tracking-widest"
                style={{
                  background: "linear-gradient(135deg, #c9a96e, #a07840)",
                  color: "#faf6f1",
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.15em",
                  boxShadow: "0 4px 18px rgba(201,169,110,0.28)",
                  textDecoration: "none",
                }}
              >
                Request Appointment ✦
              </Link>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="text-center mt-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#c9a96e]/30" />
              <span className="text-[#c9a96e]/50 text-xs">✦</span>
              <div className="h-px w-8 bg-[#c9a96e]/30" />
            </div>
            <p
              className="text-xs text-[#b09070]"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.1em" }}
            >
              © Myxprecioussmua — All rights reserved
            </p>
          </footer>

        </div>
      </div>
    </>
  );
}