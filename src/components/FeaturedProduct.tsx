import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

interface ApiProduct {
  uuid: string
  name: string
  brand: string
  category: string
  price: number
  image?: string
  description?: string
  sizes?: string[]
  featured?: boolean
}

export default function FeaturedProduct() {
  const { t } = useLang()
  const [selectedSize, setSelectedSize] = useState('')
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('http://127.0.0.1:5000/products')
      .then((res) => res.json())
      .then((data: ApiProduct[]) => {
        const featuredList = data.filter((p) => p.featured)
        setProducts(featuredList.length > 0 ? featuredList : data)
      })
      .catch((err) => console.error('Failed to load featured products:', err))
      .finally(() => setIsLoading(false))
  }, [])

  const product = products[currentIndex]

  const goNext = () => {
    setSelectedSize('')
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const goPrev = () => {
    setSelectedSize('')
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  if (isLoading || !product) return null

  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L']

  return (
    <section className="bg-carbon py-12 sm:py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <span className="w-6 h-px bg-volt" />
            <span className="text-volt text-xs tracking-[0.25em] uppercase" style={{ fontFamily: 'DM Mono, monospace' }}>
              {t.feat_eyebrow}
            </span>
          </div>

          {products.length > 1 && (
            <div className="flex items-center gap-2 text-xs text-ash font-mono">
              <span>{currentIndex + 1} / {products.length}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 items-center">
          {/* Image */}
          <div className="relative group">
            <div className="absolute -inset-4 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: 'radial-gradient(ellipse at 40% 60%, rgba(200,255,0,0.08), transparent 70%)' }} />
            <div className="absolute top-3 sm:top-5 left-3 sm:left-5 z-10 font-display font-black text-6xl sm:text-7xl md:text-8xl select-none pointer-events-none" style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.06)', lineHeight: 1 }}>
              {String(currentIndex + 1).padStart(3, '0')}
            </div>
            <div className="relative overflow-hidden bg-zinc aspect-[4/3]">
              <img
                key={product.uuid}
                src={product.image}
                alt={product.name}
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

            {products.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  aria-label="Previous product"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-ink/70 border border-white/10 text-bone hover:bg-ink hover:border-volt/40 transition-all cursor-pointer backdrop-blur-sm"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={goNext}
                  aria-label="Next product"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-ink/70 border border-white/10 text-bone hover:bg-ink hover:border-volt/40 transition-all cursor-pointer backdrop-blur-sm"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}
          </div>

          {/* Info */}
          <div className="lg:pl-10 xl:pl-16 mt-2 lg:mt-0">
            <p className="text-ash text-xs tracking-[0.2em] uppercase mb-2" style={{ fontFamily: 'DM Mono, monospace' }}>
              {product.brand}
            </p>
            <h2 className="font-display font-black text-bone leading-none mb-5 sm:mb-6" style={{ fontSize: 'clamp(30px, 4vw, 68px)', letterSpacing: '-0.02em' }}>
              {product.name}
            </h2>
            <p className="text-ash text-sm leading-relaxed max-w-sm mb-5 sm:mb-6">
              {product.description}
            </p>

            <div className="flex items-baseline gap-3 mb-5 sm:mb-6 flex-wrap">
              <span className="font-display font-black text-volt text-2xl sm:text-3xl">{product.price.toLocaleString()} DA</span>
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
              <Link to={`/products?open=${product.uuid}`} className="flex-1 sm:flex-none px-6 sm:px-8 py-3 text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300 text-center" style={{ background: '#f5a623', color: '#050505' }}>
               {t.feat_cta}
              </Link>

              {products.length > 1 && (
                <div className="flex sm:hidden items-center gap-2">
                  <button
                    onClick={goPrev}
                    aria-label="Previous product"
                    className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 text-bone hover:border-volt/40 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={goNext}
                    aria-label="Next product"
                    className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 text-bone hover:border-volt/40 transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}