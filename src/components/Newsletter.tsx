import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setEmail('')
  }

  return (
    <section
      className="relative overflow-hidden py-24 md:py-36"
      style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0d120a 50%, #050505 100%)' }}
    >
      {/* Volt glow backdrop */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(ellipse, rgba(200,255,0,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Geometric accent lines */}
      <div className="absolute top-0 left-0 w-px h-24 bg-volt/30" />
      <div className="absolute top-0 left-0 h-px w-24 bg-volt/30" />
      <div className="absolute bottom-0 right-0 w-px h-24 bg-volt/30" />
      <div className="absolute bottom-0 right-0 h-px w-24 bg-volt/30" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <p
            className="text-volt text-xs tracking-[0.3em] uppercase mb-6"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            Stay in the Loop
          </p>

          <h2
            className="font-display font-black text-bone mb-4 leading-none"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)', letterSpacing: '-0.02em' }}
          >
            FIRST ACCESS.
          </h2>
          <h2
            className="font-display font-black mb-6 leading-none"
            style={{
              fontSize: 'clamp(40px, 6vw, 80px)',
              letterSpacing: '-0.02em',
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(245,245,240,0.35)',
            }}
          >
            ALWAYS.
          </h2>

          <p className="text-ash text-sm leading-relaxed mb-10">
            Drop alerts, exclusive member pricing, and early access to limited releases — before anyone else.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-3 py-4">
              <span className="w-3 h-3 rounded-full bg-volt" />
              <p className="text-volt font-semibold tracking-wide" style={{ fontFamily: 'DM Mono, monospace' }}>
                You're in. Watch your inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-5 py-4 text-sm bg-zinc border border-white/10 text-bone placeholder-ash focus:outline-none focus:border-volt/60 transition-colors duration-200"
                style={{ fontFamily: 'DM Mono, monospace' }}
              />
              <button
                type="submit"
                className="px-8 py-4 text-xs font-semibold tracking-[0.15em] uppercase bg-volt text-ink hover:bg-bone transition-colors duration-200 whitespace-nowrap"
              >
                Join the Drop
              </button>
            </form>
          )}

          <p className="text-ash/50 text-xs mt-5 tracking-wide" style={{ fontFamily: 'DM Mono, monospace' }}>
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}
