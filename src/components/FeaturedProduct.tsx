import { useState } from 'react'
const sizes = ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12']
const colors = ['#e8e0d4', '#c8ff00', '#e85d3a', '#0066cc']

export default function FeaturedProduct() {
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAdd = () => {
    if (!selectedSize) return
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <section className="bg-carbon py-20 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-12">
          <span className="w-8 h-px bg-volt" />
          <span className="text-volt text-xs tracking-[0.25em] uppercase" style={{ fontFamily: 'DM Mono, monospace' }}>
            Featured Drop
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-center">
          {/* Image side */}
          <div className="relative group">
            {/* Background accent */}
            <div
              className="absolute -inset-4 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: 'radial-gradient(ellipse at 40% 60%, rgba(200,255,0,0.08), transparent 70%)' }}
            />

            {/* Model number */}
            <div
              className="absolute top-6 left-6 z-10 font-display font-black text-8xl md:text-9xl select-none pointer-events-none"
              style={{
                color: 'transparent',
                WebkitTextStroke: '1px rgba(255,255,255,0.06)',
                lineHeight: 1,
              }}
            >
              001
            </div>

            <div className="relative overflow-hidden bg-zinc aspect-[4/3]">
              <img
                src="https://i.pinimg.com/736x/ef/06/da/ef06dad5580e06dd1aa559b04645b0f1.jpg"
                alt='ASICS GEL-1130 "Black Carbon"'
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                style={{ filter: 'contrast(1.05) brightness(0.9)' }}
              />
              {/* Top overlay bar */}
              <div className="absolute top-0 left-0 right-0 h-px bg-volt/30" />
            </div>

            {/* Tag */}
            <div
              className="absolute bottom-6 right-6 px-4 py-2 text-xs tracking-[0.15em] uppercase bg-ink border border-volt/40 text-volt"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              Limited Edition
            </div>
          </div>

          {/* Info side */}
          <div className="lg:pl-16 xl:pl-24">
            <p className="text-ash text-xs tracking-[0.2em] uppercase mb-3" style={{ fontFamily: 'DM Mono, monospace' }}>
              Air Max Series — 2025
            </p>
            <h2 className="font-display font-black text-bone leading-none mb-2" style={{ fontSize: 'clamp(48px, 6vw, 88px)', letterSpacing: '-0.02em' }}>
              PEGASUS
            </h2>
            <h2
              className="font-display font-black leading-none mb-8"
              style={{
                fontSize: 'clamp(48px, 6vw, 88px)',
                letterSpacing: '-0.02em',
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(245,245,240,0.4)',
              }}
            >
              ULTRA X
            </h2>

            <p className="text-ash text-sm leading-relaxed max-w-sm mb-8">
              Reactfoam midsole delivers exceptional energy return with every stride. A precision-engineered outsole grips any surface. Built for those who refuse to slow down.
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="font-display font-black text-volt text-4xl">$279</span>
              <span className="text-ash text-sm line-through" style={{ fontFamily: 'DM Mono, monospace' }}>$320</span>
              <span className="px-2 py-0.5 text-xs bg-volt/10 text-volt border border-volt/30" style={{ fontFamily: 'DM Mono, monospace' }}>
                −13%
              </span>
            </div>

            {/* Color selection */}
            <div className="mb-6">
              <p className="text-xs text-ash tracking-[0.15em] uppercase mb-3" style={{ fontFamily: 'DM Mono, monospace' }}>
                Color
              </p>
              <div className="flex items-center gap-3">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className="w-7 h-7 rounded-full transition-all duration-200"
                    style={{
                      background: c,
                      outline: selectedColor === i ? `2px solid ${c}` : '2px solid transparent',
                      outlineOffset: '3px',
                    }}
                    aria-label={`Color ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div className="mb-8">
              <p className="text-xs text-ash tracking-[0.15em] uppercase mb-3" style={{ fontFamily: 'DM Mono, monospace' }}>
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className="px-4 py-2 text-xs border transition-all duration-200"
                    style={{
                      fontFamily: 'DM Mono, monospace',
                      borderColor: selectedSize === s ? '#f5a623' : 'rgba(255,255,255,0.1)',
                      color: selectedSize === s ? '#f5a623' : '#888',
                      background: selectedSize === s ? 'rgba(200,255,0,0.08)' : 'transparent',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleAdd}
                className="flex-1 sm:flex-none px-10 py-4 text-sm font-semibold tracking-[0.1em] uppercase transition-all duration-300"
                style={{
                  background: addedToCart ? '#f5a623' : (selectedSize ? '#f5a623' : 'rgba(200,255,0,0.15)'),
                  color: '#050505',
                  opacity: selectedSize ? 1 : 0.5,
                  cursor: selectedSize ? 'pointer' : 'not-allowed',
                }}
              >
                {addedToCart ? '✓ Added' : 'Add to Bag'}
              </button>
              <button className="p-4 border border-white/10 hover:border-volt/40 transition-colors duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
