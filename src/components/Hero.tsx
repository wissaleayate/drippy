import { useEffect, useState } from 'react'
import { Link } from 'react-router'

type Banner = {
  eyebrow: string
  title: string
  outline: string
  description: string
  cta: string
  image: string
  badge: string
}

const banners: Banner[] = [
  {
    eyebrow: 'New Balance / Collection 01',
    title: 'STEP',
    outline: 'INTO STYLE',
    description: 'Born drippy, built different. The season’s sharpest sneakers, selected for the rotation.',
    cta: 'Explore drop',
    image: 'https://i.pinimg.com/736x/ca/7b/fa/ca7bfa7018e8440cbde42ac63e29ecd3.jpg',
    badge: 'New drop',
  },
  {
    eyebrow: 'ASICS / Performance archive',
    title: 'MOVE',
    outline: 'WITH INTENT',
    description: 'Technical comfort meets a pared-back silhouette, built for city miles and late nights.',
    cta: 'Shop ASICS',
    image: 'https://i.pinimg.com/736x/ef/06/da/ef06dad5580e06dd1aa559b04645b0f1.jpg',
    badge: 'Limited edit',
  },
  {
    eyebrow: 'Drippy / Essential rotation',
    title: 'OWN',
    outline: 'THE ROOM',
    description: 'Quiet confidence, loud details. Discover pairs chosen to make every look intentional.',
    cta: 'View all pairs',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1800&q=85',
    badge: 'Curated now',
  },
]

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const goTo = (index: number) => setActiveIndex((index + banners.length) % banners.length)

  useEffect(() => {
    if (isPaused) return
    const timer = window.setInterval(() => goTo(activeIndex + 1), 5000)
    return () => window.clearInterval(timer)
  }, [activeIndex, isPaused])

  return (
    <section className="w-full bg-ink px-3 pb-3 pt-20 sm:px-6 md:px-10 md:pb-6 md:pt-24">
      <div
        className="relative mx-auto h-[550px] max-w-[1400px] overflow-hidden rounded-2xl border border-bone/10 bg-carbon shadow-2xl shadow-black/30 md:h-[600px]"
        aria-roledescription="carousel"
        aria-label="Featured promotions"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => !event.currentTarget.contains(event.relatedTarget) && setIsPaused(false)}
      >
        {banners.map((banner, index) => {
          const isActive = index === activeIndex
          return (
            <article
              key={banner.title}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-all duration-700 ease-out motion-reduce:transition-none ${isActive ? 'z-10 translate-x-0 opacity-100' : 'z-0 translate-x-3 opacity-0'}`}
            >
              <img src={banner.image} alt="" className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[7000ms] ${isActive ? 'scale-100' : 'scale-105'}`} style={{ filter: 'brightness(.58) contrast(1.1)' }} />
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/20" />
              <div className="absolute right-0 top-0 h-24 w-24 border-b border-l border-volt/70 sm:h-32 sm:w-32" />
              <div className="absolute right-4 top-4 font-mono text-xs tracking-[.2em] text-volt sm:right-6 sm:top-6">0{index + 1} / 0{banners.length}</div>

              <div className="absolute inset-x-4 bottom-5 rounded-xl border border-bone/15 bg-ink/45 px-5 py-6 shadow-xl backdrop-blur-md sm:inset-x-6 sm:bottom-7 sm:max-w-2xl sm:px-8 md:left-10 md:bottom-10 md:px-10">
                <div className="mb-5 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[.2em] text-ash sm:text-xs">
                  <span>{banner.eyebrow}</span>
                  <span className="flex shrink-0 items-center gap-2 text-volt"><span className="h-1.5 w-1.5 rounded-full bg-volt animate-pulse" />{banner.badge}</span>
                </div>
                <h1 className="font-display text-6xl font-black leading-[.78] tracking-tight text-bone sm:text-7xl md:text-8xl lg:text-9xl">{banner.title}</h1>
                <p className="font-display text-4xl font-black leading-none tracking-tight sm:text-5xl md:text-6xl" style={{ color: 'transparent', WebkitTextStroke: '1px rgba(240,230,204,.8)' }}>{banner.outline}</p>
                <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <p className="max-w-sm text-sm leading-relaxed text-bone/70">{banner.description}</p>
                  <Link to="/products" tabIndex={isActive ? 0 : -1} className="inline-flex shrink-0 items-center gap-3 bg-volt px-6 py-3 text-xs font-semibold uppercase tracking-[.14em] text-ink transition-colors hover:bg-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt">
                    {banner.cta}<span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          )
        })}

        <div className="absolute bottom-6 left-6 z-20 flex gap-2 md:bottom-10 md:left-10" role="tablist" aria-label="Choose promotion">
          {banners.map((banner, index) => <button key={banner.title} type="button" role="tab" aria-label={`Go to promotion ${index + 1}`} aria-selected={index === activeIndex} onClick={() => goTo(index)} className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-volt ${index === activeIndex ? 'w-9 bg-volt' : 'w-1.5 bg-bone/50 hover:bg-bone'}`} />)}
        </div>
        <div className="absolute bottom-6 right-6 z-20 flex gap-2 md:bottom-10 md:right-10">
          <button type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Previous promotion" className="grid h-10 w-10 place-items-center rounded-full border border-bone/25 bg-ink/45 text-bone backdrop-blur-md transition hover:border-volt hover:text-volt">‹</button>
          <button type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Next promotion" className="grid h-10 w-10 place-items-center rounded-full border border-bone/25 bg-ink/45 text-bone backdrop-blur-md transition hover:border-volt hover:text-volt">›</button>
        </div>
      </div>
    </section>
  )
}