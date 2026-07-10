import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: '40M+', label: 'Runners Worldwide' },
  { value: '180+', label: 'Countries' },
  { value: '50yr', label: 'Of Innovation' },
  { value: '99%', label: 'Return Rate' },
]

export default function BrandStatement() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-40" style={{ background: '#080808' }}>
      {/* Background text watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="font-display font-black text-center leading-none"
          style={{
            fontSize: 'clamp(100px, 25vw, 400px)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(200,255,0,0.04)',
            letterSpacing: '-0.04em',
            whiteSpace: 'nowrap',
          }}
        >
          FUTURE
        </span>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Label */}
        <div className="flex items-center gap-4 mb-10">
          <span className="w-8 h-px bg-volt" />
          <span className="text-volt text-xs tracking-[0.25em] uppercase" style={{ fontFamily: 'DM Mono, monospace' }}>
            Our Mission
          </span>
        </div>

        {/* Main statement */}
        <div className="max-w-4xl mb-16">
          <h2
            className="font-display font-black text-bone leading-tight"
            style={{
              fontSize: 'clamp(36px, 6vw, 96px)',
              letterSpacing: '-0.025em',
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(40px)',
              transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            WE DON'T MAKE SHOES.
          </h2>
          <h2
            className="font-display font-black leading-tight"
            style={{
              fontSize: 'clamp(36px, 6vw, 96px)',
              letterSpacing: '-0.025em',
              color: 'transparent',
              WebkitTextStroke: '2px rgba(245,245,240,0.5)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(40px)',
              transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s',
            }}
          >
            WE MAKE ATHLETES.
          </h2>
          <p
            className="text-ash text-base leading-relaxed mt-6 max-w-lg"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(20px)',
              transition: 'all 0.8s ease 0.35s',
            }}
          >
            Every design begins with a single question: how do we make you faster, stronger, more unstoppable? From the track to the street, we engineer for the edge.
          </p>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-16"
          style={{
            background: 'linear-gradient(to right, rgba(200,255,0,0.4), rgba(200,255,0,0.05), transparent)',
            width: visible ? '100%' : '0',
            transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s',
          }}
        />

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(30px)',
                transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${0.3 + i * 0.1}s`,
              }}
            >
              <p className="stat-number text-volt" style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>
                {s.value}
              </p>
              <p className="text-ash text-sm mt-2 tracking-wide" style={{ fontFamily: 'DM Mono, monospace' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
