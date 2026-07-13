import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
export default function Hero() {
  const [loaded, setLoaded] = useState(false)
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-ink flex items-end">
      {/* Background image */}
      <div
        className="absolute inset-0"
        onMouseEnter={() => setIsCategorySelectorOpen(true)}
        onMouseLeave={() => setIsCategorySelectorOpen(false)}
        onFocusCapture={() => setIsCategorySelectorOpen(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsCategorySelectorOpen(false)
        }}
      >
        <img
          ref={imgRef}
          src="https://i.pinimg.com/736x/ca/7b/fa/ca7bfa7018e8440cbde42ac63e29ecd3.jpg"
          alt="New balance 1906A"
          className="w-full h-full object-cover object-center"
          style={{
            filter: 'brightness(0.35) contrast(1.2)',
            transform: 'scale(1.04)',
            transition: 'transform 8s ease-out',
          }}
          onLoad={(e) => {
            ;(e.target as HTMLImageElement).style.transform = 'scale(1)'
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />

        {/* Interactive category selector */}
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center bg-ink/70 backdrop-blur-sm transition-opacity duration-500 ease-out ${
            isCategorySelectorOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="flex flex-col items-center gap-3 px-6 text-center sm:flex-row sm:gap-4">
            {[
              { label: 'Men', to: '/products?category=men' },
              { label: 'Women', to: '/products?category=women' },
              { label: 'Children', to: '/products?category=children' },
            ].map((category, index) => (
              <Link
                key={category.label}
                to={category.to}
                className={`rounded-full border border-bone/30 bg-bone/10 px-8 py-3 font-mono text-xs uppercase tracking-[0.18em] text-bone shadow-lg shadow-ink/30 backdrop-blur-md transition-all duration-500 ease-out hover:border-[#a78bfa] hover:bg-[#7c3aed] hover:text-white focus-visible:border-[#a78bfa] focus-visible:bg-[#7c3aed] focus-visible:text-white focus-visible:outline-none ${
                  isCategorySelectorOpen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}
                style={{ transitionDelay: `${120 + index * 90}ms` }}
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Volt accent line */}
      <div
        className="absolute top-0 right-0 w-px bg-volt"
        style={{
          height: loaded ? '45%' : '0',
          transition: 'height 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
          transitionDelay: '0.3s',
        }}
      />
      <div
        className="absolute top-0 right-0 h-px bg-volt"
        style={{
          width: loaded ? '18%' : '0',
          transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)',
          transitionDelay: '0.2s',
        }}
      />

      {/* Label top-left */}
      <div
        className="absolute top-24 left-6 md:left-10 text-ash text-xs tracking-[0.2em] uppercase"
        style={{
          fontFamily: 'DM Mono, monospace',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'none' : 'translateY(12px)',
          transition: 'all 0.8s ease 0.4s',
        }}
      >
        SS / 2025 — Collection 01
      </div>

      {/* Season badge top-right */}
      <div
        className="absolute top-24 right-6 md:right-10 flex items-center gap-2"
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease 0.6s',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-volt animate-pulse" />
        <span className="text-xs text-ash tracking-[0.15em] uppercase" style={{ fontFamily: 'DM Mono, monospace' }}>
          New Drop
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-16 md:pb-20">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <p
            className="text-volt text-sm tracking-[0.3em] uppercase mb-4"
            style={{
              fontFamily: 'DM Mono, monospace',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'none' : 'translateY(20px)',
              transition: 'all 0.7s ease 0.3s',
            }}
          >
            New Balance 
          </p>

          {/* Headline */}
          <h1
            className="font-display font-black text-bone leading-none"
            style={{
              fontSize: 'clamp(72px, 12vw, 180px)',
              letterSpacing: '-0.02em',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'none' : 'translateY(40px)',
              transition: 'all 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s',
            }}
          >
            BORN
          </h1>
          <h1
            className="font-display font-black leading-none"
            style={{
              fontSize: 'clamp(72px, 12vw, 180px)',
              letterSpacing: '-0.02em',
              color: 'transparent',
              WebkitTextStroke: '2px #f5f5f0',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'none' : 'translateY(40px)',
              transition: 'all 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.28s',
            }}
          >
            TO RUN
          </h1>

          {/* Sub + CTA row */}
          <div
            className="mt-8 flex flex-col sm:flex-row items-start sm:items-end gap-6"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'none' : 'translateY(24px)',
              transition: 'all 0.8s ease 0.5s',
            }}
          >
            <p className="text-ash text-base leading-relaxed max-w-xs">
              Born drippy , built different Top tier sneakers only
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-3 px-8 py-4 bg-volt  text-ink text-sm font-semibold tracking-[0.1em] uppercase hover:bg-bone transition-colors duration-300"
              >
                Explore
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-0 right-10 hidden md:flex flex-col items-center gap-2 pb-4"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1s ease 1s',
          }}
        >
          <div
            className="w-px bg-volt"
            style={{
              height: '48px',
              animation: 'marquee 1.5s ease-in-out infinite alternate',
              transformOrigin: 'top',
              animationName: 'grow',
            }}
          />
          <span className="text-ash text-xs tracking-[0.2em] rotate-90 mt-4" style={{ fontFamily: 'DM Mono, monospace' }}>
            SCROLL
          </span>
        </div>
      </div>
    </section>
  )
}
