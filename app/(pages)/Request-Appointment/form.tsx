'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type ServiceType = 'bridal' | 'occasion' | ''
type TrialChoice = 'yes' | 'no' | null
type AppointmentType = 'studio' | 'mobile' | ''
type CouponStatus = 'idle' | 'checking' | 'valid' | 'invalid'

export default function BookingPage() {
  const [serviceType, setServiceType] = useState<ServiceType>('')
  const [trialChoice, setTrialChoice] = useState<TrialChoice>(null)
  const [peopleCount, setPeopleCount] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('')

  const [couponCode, setCouponCode] = useState('')
  const [couponStatus, setCouponStatus] = useState<CouponStatus>('idle')

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    occasion: '',
    date: '',
    timeHour: '',
    timeMinute: '',
    timePeriod: '',
    location: '',
    additionalInfo: '',
  })

  const handleServiceChange = (val: ServiceType) => {
    setServiceType(val)
    setTrialChoice(null)
  }

  const handleTrialChange = (val: 'yes' | 'no') => {
    setTrialChoice(val)
  }

  const adjustPeople = (delta: number) => {
    setPeopleCount(prev => Math.max(1, Math.min(20, prev + delta)))
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleTimeChange = (
    field: 'timeHour' | 'timeMinute' | 'timePeriod',
    value: string
  ) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // Debounced server-side coupon check
  useEffect(() => {
    const trimmed = couponCode.trim()

    if (!trimmed) {
      setCouponStatus('idle')
      return
    }

    setCouponStatus('checking')

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch('/api/validate-coupon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: trimmed }),
        })
        const json = await res.json()
        setCouponStatus(json.valid ? 'valid' : 'invalid')
      } catch {
        setCouponStatus('invalid')
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [couponCode])

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          serviceType,
          trialChoice,
          appointmentType,
          peopleCount,
          couponCode: couponCode.trim().toUpperCase(),
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Something went wrong')
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const showTrialBox = serviceType !== ''
  const isTrialOnly = trialChoice === 'yes'
  const isFullForm = trialChoice === 'no'

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
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fade-up   { animation: fadeUp 0.7s ease both; }
        .delay-1   { animation-delay: 0.12s; }
        .delay-2   { animation-delay: 0.24s; }
        .slide-in  { animation: slideDown 0.35s ease both; }

        .booking-input {
          width: 100%;
          background: #fdf8f2;
          border: 1px solid #e8ddd4;
          border-radius: 10px;
          padding: 12px 16px;
          font-family: 'Lora', Georgia, serif;
          font-size: 14px;
          color: #2c1f14;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          appearance: none;
          -webkit-appearance: none;
          box-sizing: border-box;
        }
        .booking-input:focus {
          border-color: #c9a96e;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.12);
          background: #fff;
        }
        .booking-input::placeholder {
          color: #9a8470;
          font-style: italic;
        }

        .booking-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c9a96e' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 38px !important;
          cursor: pointer;
        }
        .booking-select option { font-family: sans-serif; }

        .time-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c9a96e' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 26px !important;
          cursor: pointer;
          text-align: center;
        }

        .radio-opt input[type="radio"] {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }
        .radio-face {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 11px 16px;
          border: 1px solid #e8ddd4;
          border-radius: 10px;
          background: #fff;
          font-family: 'Lora', Georgia, serif;
          font-size: 13px;
          color: #5a4435;
          transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
          cursor: pointer;
          user-select: none;
        }
        .radio-opt input[type="radio"]:checked + .radio-face {
          border-color: #c9a96e;
          background: linear-gradient(135deg, rgba(201,169,110,0.1), rgba(201,169,110,0.05));
          color: #2c1f14;
        }
        .radio-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1.5px solid #c9a96e;
          flex-shrink: 0;
          transition: background 0.2s ease;
          display: inline-block;
        }
        .radio-opt input[type="radio"]:checked + .radio-face .radio-dot {
          background: #c9a96e;
        }

        .people-row {
          display: flex;
          align-items: center;
          background: #fdf8f2;
          border: 1px solid #e8ddd4;
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .people-row:focus-within {
          border-color: #c9a96e;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.12);
          background: #fff;
        }
        .people-btn {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 20px;
          color: #c9a96e;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
        }
        .people-btn:hover { background: rgba(201,169,110,0.1); }

        .people-display {
          flex: 1;
          text-align: center;
          font-family: 'Lora', Georgia, serif;
          font-size: 14px;
          color: #2c1f14;
          pointer-events: none;
          padding: 12px 8px;
        }

        .fee-row { transition: background 0.2s ease; }
        .fee-row:hover { background: rgba(201,169,110,0.05) !important; }

        .cta-btn {
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        .cta-btn:hover {
          box-shadow: 0 6px 28px rgba(201,169,110,0.4) !important;
          transform: translateY(-1px);
        }
        .cta-btn:active { transform: translateY(0); }

        .coupon-input-wrap { position: relative; }
        .coupon-tick {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #00a86b;
          font-size: 16px;
          font-weight: bold;
          pointer-events: none;
        }
        .coupon-spinner {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(201,169,110,0.25);
          border-top-color: #c9a96e;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }

        @media (max-width: 560px) {
          .two-col-grid { grid-template-columns: 1fr !important; }
          .form-card-inner { padding: 28px 20px 36px !important; }
          .time-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        }
      `}</style>

      <div className="grain-overlay min-h-screen relative" style={{ backgroundColor: '#faf6f1' }}>

        {/* Top gold bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #c9a96e, #e8c99a, #c9a96e)' }} />

        <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">

          {/* ── HEADER ── */}
          <header className="text-center mb-12 fade-up">
            <p
              className="text-xs tracking-[0.3em] text-[#c9a96e] uppercase mb-4"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
            >
              Myxprecioussmua
            </p>
            <h1
              className="leading-tight text-[#2c1f14] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: 'clamp(2rem, 6vw, 2.8rem)' }}
            >
              Book Your
              <br />
              <em style={{ fontWeight: 400 }}>Appointment</em>
            </h1>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px w-12 bg-[#c9a96e]/40" />
              <span className="text-[#c9a96e] text-xs">✦</span>
              <div className="h-px w-12 bg-[#c9a96e]/40" />
            </div>
          </header>

          {/* ── FORM CARD ── */}
          <div
            className="rounded-2xl border fade-up delay-1"
            style={{
              background: '#fff',
              borderColor: '#e8ddd4',
              boxShadow: '0 2px 24px rgba(44,31,20,0.04)',
            }}
          >
            <div className="form-card-inner px-10 py-10">

              {submitted ? (
                /* ── SUCCESS STATE ── */
                <div className="text-center py-12 slide-in">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 text-xl"
                    style={{
                      background: 'rgba(201,169,110,0.12)',
                      border: '1px solid rgba(201,169,110,0.3)',
                      color: '#c9a96e',
                    }}
                  >
                    ✦
                  </div>
                  <h2
                    className="text-[#2c1f14] mb-3"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontStyle: 'italic', fontSize: '1.9rem' }}
                  >
                    Thank you, lovely!
                  </h2>
                  <p
                    className="text-sm text-[#7a5c46] leading-relaxed"
                    style={{ fontFamily: "'Lora', Georgia, serif", lineHeight: 1.9 }}
                  >
                    Your request has been received.<br />
                    I'll be in touch shortly to confirm your booking details.
                  </p>
                </div>
              ) : (
                <>
                  {/* ── YOUR DETAILS ── */}
                  <SectionDivider label="Your Details" />

                  <div className="mb-6">
                    <FieldLabel>Full Name <Req /></FieldLabel>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="booking-input"
                    />
                  </div>

                  <div className="two-col-grid mb-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                    <div>
                      <FieldLabel>Email Address <Req /></FieldLabel>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="hello@example.com"
                        className="booking-input"
                      />
                    </div>
                    <div>
                      <FieldLabel>Phone Number <Req /></FieldLabel>
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+44 7700 000000"
                        className="booking-input"
                      />
                    </div>
                  </div>

                  {/* ── SERVICE ── */}
                  <SectionDivider label="Your Service" />

                  <div className="mb-6">
                    <FieldLabel>Make-up Service <Req /></FieldLabel>
                    <select
                      value={serviceType}
                      onChange={e => handleServiceChange(e.target.value as ServiceType)}
                      className="booking-input booking-select"
                    >
                      <option value="" disabled>Select a service…</option>
                      <option value="bridal">Bridal</option>
                      <option value="occasion">Occasion</option>
                    </select>
                  </div>

                  {/* ── TRIAL REVEAL BOX ── */}
                  {showTrialBox && (
                    <div
                      className="rounded-xl border mb-6 slide-in"
                      style={{
                        background: 'linear-gradient(135deg, #fdf8f2, #faf3ea)',
                        borderColor: 'rgba(201,169,110,0.3)',
                        padding: '22px 24px',
                      }}
                    >
                      <p
                        className="text-[#2c1f14] mb-4 flex items-center gap-2"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: '1.15rem' }}
                      >
                        <span style={{ color: 'rgba(201,169,110,0.7)', fontSize: '13px' }}>✦</span>
                        Are you interested in a Trial?
                      </p>
                      <div className="flex gap-3">
                        {(['yes', 'no'] as const).map(val => (
                          <label key={val} className="radio-opt flex-1 relative cursor-pointer">
                            <input
                              type="radio"
                              name="trial"
                              value={val}
                              checked={trialChoice === val}
                              onChange={() => handleTrialChange(val)}
                            />
                            <div className="radio-face">
                              <div className="radio-dot" />
                              {val === 'yes' ? "Yes, I'd like a trial" : 'No, continue booking'}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── FULL FORM (Trial: No) ── */}
                  {isFullForm && (
                    <div className="slide-in">
                      <div className="mb-6">
                        <FieldLabel>What is the Occasion? <Req /></FieldLabel>
                        <input
                          name="occasion"
                          value={form.occasion}
                          onChange={handleChange}
                          placeholder="e.g. Wedding, Birthday, Prom…"
                          className="booking-input"
                        />
                      </div>
                    </div>
                  )}

                  {/* ── DATE & LOCATION — shown for both trial and full ── */}
                  {(isFullForm || isTrialOnly) && (
                    <div className="slide-in">
                      <SectionDivider label="Date & Location" />

                      <div className="mb-6">
                        <FieldLabel>Date <Req /></FieldLabel>
                        <input
                          name="date"
                          type="date"
                          value={form.date}
                          onChange={handleChange}
                          className="booking-input"
                        />
                      </div>

                      <div className="mb-6">
                        <FieldLabel>Time <Req /></FieldLabel>
                        <div className="time-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.9fr', gap: '12px' }}>
                          <select
                            value={form.timeHour}
                            onChange={e => handleTimeChange('timeHour', e.target.value)}
                            className="booking-input time-select"
                          >
                            <option value="" disabled>Hour</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                              <option key={h} value={h}>{h}</option>
                            ))}
                          </select>
                          <select
                            value={form.timeMinute}
                            onChange={e => handleTimeChange('timeMinute', e.target.value)}
                            className="booking-input time-select"
                          >
                            <option value="" disabled>Min</option>
                            {['00', '15', '30', '45'].map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <select
                            value={form.timePeriod}
                            onChange={e => handleTimeChange('timePeriod', e.target.value)}
                            className="booking-input time-select"
                          >
                            <option value="" disabled>—</option>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-6">
                        <FieldLabel>Appointment Type <Req /></FieldLabel>
                        <div className="flex gap-3">
                          {([
                            { val: 'studio', text: 'Studio Appointment' },
                            { val: 'mobile', text: 'Mobile Service (I come to you)' },
                          ] as const).map(opt => (
                            <label key={opt.val} className="radio-opt flex-1 relative cursor-pointer">
                              <input
                                type="radio"
                                name="appointmentType"
                                value={opt.val}
                                checked={appointmentType === opt.val}
                                onChange={() => setAppointmentType(opt.val)}
                              />
                              <div className="radio-face">
                                <div className="radio-dot" />
                                {opt.text}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {appointmentType === 'mobile' && (
                        <div className="mb-6 slide-in">
                          <FieldLabel>Where Should I Meet You? <Req /></FieldLabel>
                          <input
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="Address or Postcode..."
                            className="booking-input"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── MAKE-UP PARTY — full form only ── */}
                  {isFullForm && (
                    <div className="slide-in">
                      <SectionDivider label="Make-up Party" />

                      <div className="mb-6">
                        <FieldLabel>Number of People Requiring Make-up</FieldLabel>
                        <div className="people-row">
                          <button type="button" className="people-btn" onClick={() => adjustPeople(-1)}>−</button>
                          <div className="people-display">{peopleCount} {peopleCount === 1 ? 'person' : 'people'}</div>
                          <button type="button" className="people-btn" onClick={() => adjustPeople(1)}>+</button>
                        </div>
                      </div>

                      <div className="mb-6">
                        <FieldLabel>Additional Information</FieldLabel>
                        <textarea
                          name="additionalInfo"
                          value={form.additionalInfo}
                          onChange={handleChange}
                          rows={5}
                          placeholder="Share any details — skin concerns, inspo images, special requests, allergies…"
                          className="booking-input"
                          style={{ resize: 'vertical', lineHeight: 1.75 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* ── COUPON ── */}
                  {(isFullForm || isTrialOnly) && (
                    <div className="mb-6 slide-in">
                      <FieldLabel>Coupon Code</FieldLabel>
                      <div className="coupon-input-wrap">
                        <input
                          name="couponCode"
                          value={couponCode}
                          onChange={e => setCouponCode(e.target.value)}
                          placeholder="Enter code (optional)"
                          className="booking-input"
                          style={{ paddingRight: couponStatus !== 'idle' ? '44px' : undefined }}
                        />
                        {couponStatus === 'checking' && <div className="coupon-spinner" />}
                        {couponStatus === 'valid' && <span className="coupon-tick">✓</span>}
                      </div>
                      {couponStatus === 'invalid' && (
                        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '12px', color: '#c0614a', fontStyle: 'italic', marginTop: '6px' }}>
                          Coupon not recognised.
                        </p>
                      )}
                      {couponStatus === 'valid' && (
                        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '12px', color: '#00a86b', fontStyle: 'italic', marginTop: '6px' }}>
                          Coupon applied ✦
                        </p>
                      )}
                    </div>
                  )}

                  {/* ── SUBMIT ── */}
                  {(isFullForm || isTrialOnly) && (
                    <div className="mt-8 slide-in">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="cta-btn w-full py-4 rounded-full text-xs uppercase tracking-[0.2em]"
                        style={{
                          background: loading
                            ? 'linear-gradient(135deg, #d4b87e, #b08850)'
                            : 'linear-gradient(135deg, #c9a96e, #a07840)',
                          color: '#faf6f1',
                          fontFamily: "'Jost', sans-serif",
                          fontWeight: 300,
                          border: 'none',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          boxShadow: '0 4px 18px rgba(201,169,110,0.28)',
                          letterSpacing: '0.2em',
                          opacity: loading ? 0.8 : 1,
                        }}
                      >
                        {loading ? 'Sending…' : 'Submit Request ✦'}
                      </button>

                      {error && (
                        <p
                          className="text-center mt-3 text-xs"
                          style={{ fontFamily: "'Lora', Georgia, serif", color: '#c0614a', fontStyle: 'italic' }}
                        >
                          {error}
                        </p>
                      )}

                      <p
                        className="text-center mt-4 text-xs text-[#a08060]"
                        style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', lineHeight: 1.8 }}
                      >
                        By submitting you agree to the{' '}
                        <Link
                          href="/Terms&Conditions"
                          target='_blank'
                          className="underline underline-offset-4 transition-colors duration-200"
                          style={{ color: '#c9a96e' }}
                        >
                          Terms &amp; Conditions
                        </Link>
                        .<br />
                        A £35 non-refundable booking fee secures your date.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Small helper components ── */

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-8">
      <div className="h-px flex-1" style={{ background: 'rgba(201,169,110,0.2)' }} />
      <span
        className="text-xs uppercase tracking-[0.28em] whitespace-nowrap"
        style={{ color: '#c9a96e', fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
      >
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: 'rgba(201,169,110,0.2)' }} />
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block mb-2 text-xs uppercase tracking-[0.2em]"
      style={{ color: '#8a6850', fontFamily: "'Jost', sans-serif", fontWeight: 500 }}
    >
      {children}
    </label>
  )
}

function Req() {
  return <span style={{ color: '#c9a96e', marginLeft: '3px' }}>*</span>
}