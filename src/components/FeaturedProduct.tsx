import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

export default function FeaturedProduct() {
  const { t } = useLang()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState(0)

  const sizes = ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12']
  const colors = ['#e8e0d4', '#c8ff00', '#e85d3a', '#0066cc']

  return (
    <section className="bg-carbon py-12 sm:py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <span className="w-6 h-px bg-volt" />
          <span className="text-volt text-xs tracking-[0.25em] uppercase" style={{ fontFamily: 'DM Mono, monospace' }}>
            {t.feat_eyebrow}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 items-center">
          {/* Image */}
          <div className="relative group">
            <div className="absolute -inset-4 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: 'radial-gradient(ellipse at 40% 60%, rgba(200,255,0,0.08), transparent 70%)' }} />
            <div className="absolute top-3 sm:top-5 left-3 sm:left-5 z-10 font-display font-black text-6xl sm:text-7xl md:text-8xl select-none pointer-events-none" style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.06)', lineHeight: 1 }}>001</div>
            <div className="relative overflow-hidden bg-zinc aspect-[4/3]">
              <img
                src="https://i.pinimg.com/736x/ef/06/da/ef06dad5580e06dd1aa559b04645b0f1.jpg"
                alt='ASICS GEL-1130'
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                style={{ filter: 'contrast(1.05) brightness(0.9)' }}
              />
              <div className="absolute top-0 left-0 right-0 h-px bg-volt/30" />
            </div>
            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 px-3 py-1.5 text-xs tracking-[0.15em] uppercase bg-ink border border-volt/40 text-volt" style={{ fontFamily: 'DM Mono, monospace' }}>
              {t.feat_badge}
            </div>
          </div>

          {/* Info */}
          <div className="lg:pl-10 xl:pl-16 mt-2 lg:mt-0">
            <p className="text-ash text-xs tracking-[0.2em] uppercase mb-2" style={{ fontFamily: 'DM Mono, monospace' }}>
              {t.feat_eyebrow}
            </p>
            <h2 className="font-display font-black text-bone leading-none mb-1" style={{ fontSize: 'clamp(30px, 4vw, 68px)', letterSpacing: '-0.02em' }}>
              PEGASUS
            </h2>
            <h2 className="font-display font-black leading-none mb-5 sm:mb-6" style={{ fontSize: 'clamp(30px, 4vw, 68px)', letterSpacing: '-0.02em', color: 'transparent', WebkitTextStroke: '1.5px rgba(245,245,240,0.4)' }}>
              ULTRA X
            </h2>
            <p className="text-ash text-sm leading-relaxed max-w-sm mb-5 sm:mb-6">
              Reactfoam midsole delivers exceptional energy return with every stride. A precision-engineered outsole grips any surface. Built for those who refuse to slow down.
            </p>

            <div className="flex items-baseline gap-3 mb-5 sm:mb-6 flex-wrap">
              <span className="font-display font-black text-volt text-2xl sm:text-3xl">27,900 DA</span>
              <span className="text-ash text-sm line-through" style={{ fontFamily: 'DM Mono, monospace' }}>32,000 DA</span>
              <span className="px-2 py-0.5 text-xs bg-volt/10 text-volt border border-volt/30" style={{ fontFamily: 'DM Mono, monospace' }}>{t.feat_discount}</span>
            </div>

            <div className="mb-4 sm:mb-5">
              <p className="text-xs text-ash tracking-[0.15em] uppercase mb-2" style={{ fontFamily: 'DM Mono, monospace' }}>{t.feat_color}</p>
              <div className="flex items-center gap-2.5">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className="w-6 h-6 rounded-full transition-all duration-200 cursor-pointer"
                    style={{ background: c, outline: selectedColor === i ? `2px solid ${c}` : '2px solid transparent', outlineOffset: '3px' }}
                    aria-label={`Color ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="mb-5 sm:mb-6">
              <p className="text-xs text-ash tracking-[0.15em] uppercase mb-2" style={{ fontFamily: 'DM Mono, monospace' }}>{t.feat_size}</p>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className="px-3 py-1.5 text-xs border transition-all duration-200 cursor-pointer"
                    style={{ fontFamily: 'DM Mono, monospace', borderColor: selectedSize === s ? '#f5a623' : 'rgba(255,255,255,0.1)', color: selectedSize === s ? '#f5a623' : '#888', background: selectedSize === s ? 'rgba(200,255,0,0.08)' : 'transparent' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/products" className="flex-1 sm:flex-none px-6 sm:px-8 py-3 text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300 text-center" style={{ background: '#f5a623', color: '#050505' }}>
                {t.feat_cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
