import { useEffect, useState } from 'react'
import { Link } from 'react-router'

type Banner = {
  eyebrow: string
  title: string
  outline: string
  description: string
  cta: string
  ctaLink: string
  image: string
  badge: string
}

const fallbackBanners: Banner[] = [
  {
    eyebrow: 'New Balance / Collection 01',
    title: 'STEP',
    outline: 'INTO STYLE',
    description: "Born drippy, built different. The season\u2019s sharpest sneakers, selected for the rotation.",
    cta: 'Explore drop',
    ctaLink: '/products',
    image: 'https://i.pinimg.com/736x/ca/7b/fa/ca7bfa7018e8440cbde42ac63e29ecd3.jpg',
    badge: 'New drop',
  },
  {
    eyebrow: 'ASICS / Performance archive',
    title: 'MOVE',
    outline: 'WITH INTENT',
    description: 'Technical comfort meets a pared-back silhouette, built for city miles and late nights.',
    cta: 'Shop ASICS',
    ctaLink: '/products',
    image: 'https://i.pinimg.com/736x/ef/06/da/ef06dad5580e06dd1aa559b04645b0f1.jpg',
    badge: 'Limited edit',
  },
  {
    eyebrow: 'Drippy / Essential rotation',
    title: 'OWN',
    outline: 'THE ROOM',
    description: 'Quiet confidence, loud details. Discover pairs chosen to make every look intentional.',
    cta: 'View all pairs',
    ctaLink: '/products',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1800&q=85',
    badge: 'Curated now',
  },
]

type ApiPromotion = {
  uuid: string
  tag: string
  subtitle: string
  title_line1: string
  title_line2: string
  description: string
  button_text: string
  button_link: string
  image: string
}

function normalizePromotion(p: ApiPromotion): Banner {
  return {
    eyebrow: p.subtitle,
    title: p.title_line1,
    outline: p.title_line2,
    description: p.description,
    cta: p.button_text,
    ctaLink: p.button_link || '/products',
    image: p.image,
    badge: p.tag,
  }
}

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const goTo = (index: number) => setActiveIndex((index + banners.length) % banners.length)

  useEffect(() => {
    fetch('http://127.0.0.1:5000/promotions')
      .then((res) => res.json())
      .then((data: ApiPromotion[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data.map(normalizePromotion))
          setActiveIndex(0)
        }
      })
      .catch((err) => {
        console.error('Failed to load promotions, using defaults:', err)
      })
  }, [])

  useEffect(() => {
    if (isPaused) return
    const timer = window.setInterval(() => goTo(activeIndex + 1), 2500)
    return () => window.clearInterval(timer)
  }, [activeIndex, isPaused, banners.length])

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(300px, 46vw, 520px)', marginTop: 0 }}
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) =>
        !event.currentTarget.contains(event.relatedTarget) && setIsPaused(false)
      }
    >
      {/* ── Slides ────────────────────────────────────────────────────────────── */}
      {banners.map((banner, index) => {
        const isActive = index === activeIndex
        return (
          <article
            key={`${banner.title}-${index}`}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
              isActive ? 'z-10 opacity-100' : 'z-0 opacity-0'
            }`}
          >
            {/* Background image */}
            <img
              src={banner.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: 'brightness(.52) contrast(1.08)' }}
            />

            {/*
              Gradient overlay — fixed black-based (NOT theme tokens).
              This hero is a "dark scrim over photo" section by design, in both
              light and dark site themes — the photo doesn't get lighter when
              the rest of the site does, so the scrim must stay dark too.
            */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Slide counter – top right, clear of fixed nav (56 px) */}
            <div className="absolute right-5 top-16 font-mono text-[10px] tracking-[.2em] text-white/50 sm:right-8 sm:top-[62px]">
              0{index + 1}&thinsp;/&thinsp;0{banners.length}
            </div>

            {/* Content block */}
            <div className="absolute inset-x-0 bottom-0 px-5 pb-7 sm:px-8 sm:pb-9 md:max-w-xl md:px-10 md:pb-11">
              {/* Eyebrow + badge */}
              <div className="mb-2 flex items-center gap-2.5">
                <span className="font-mono text-[9px] uppercase tracking-[.18em] text-white/60 sm:text-[10px]">
                  {banner.eyebrow}
                </span>
                <span className="flex items-center gap-1 rounded-full border border-volt/30 bg-volt/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-volt">
                  <span className="h-1.5 w-1.5 rounded-full bg-volt animate-pulse" />
                  {banner.badge}
                </span>
              </div>

              {/* Headline — fixed white, always sits on the dark-scrimmed photo */}
              <h1 className="font-display font-black leading-[.82] tracking-tight text-white"
                style={{ fontSize: 'clamp(2rem, 7vw, 5.5rem)' }}>
                {banner.title}
              </h1>
              <p
                className="font-display font-black leading-none tracking-tight"
                style={{
                  fontSize: 'clamp(2rem, 7vw, 5.5rem)',
                  color: 'transparent',
                  WebkitTextStroke: '1.5px rgba(255,255,255,.65)',
                }}
              >
                {banner.outline}
              </p>

              {/* Description + CTA */}
              <div className="mt-3 flex flex-col items-start gap-3 sm:mt-4 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-xs text-xs leading-relaxed text-white/70 sm:text-sm sm:max-w-sm">
                  {banner.description}
                </p>
                <Link
                  to={banner.ctaLink}
                  tabIndex={isActive ? 0 : -1}
                  className="inline-flex shrink-0 items-center gap-2 bg-volt px-4 py-2 text-[10px] font-bold uppercase tracking-[.14em] text-ink transition-colors hover:bg-bone sm:px-5 sm:py-2.5 sm:text-xs"
                >
                  {banner.cta}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </article>
        )
      })}

      {/* ── Dot indicators ──────────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-4 right-4 z-20 flex gap-1.5 sm:bottom-5 sm:right-6 md:bottom-6 md:right-10"
        role="tablist"
        aria-label="Choose promotion"
      >
        {banners.map((banner, index) => (
          <button
            key={`${banner.title}-dot-${index}`}
            type="button"
            role="tab"
            aria-label={`Go to promotion ${index + 1}`}
            aria-selected={index === activeIndex}
            onClick={() => goTo(index)}
            className={`h-1 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-volt ${
              index === activeIndex ? 'w-8 bg-volt' : 'w-2 bg-white/35 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
