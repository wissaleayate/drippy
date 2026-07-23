import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

const products = [
  { id: 1, nameKey: 'Vaporfly Next%', category: 'Running', categoryKey: 'grid_cat_running', price: '25,900 DA', tag: 'Best Seller', img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=640&fit=crop&auto=format', accent: '#f5a623' },
  { id: 2, nameKey: 'Air Force 1 Shadow', category: 'Lifestyle', categoryKey: 'grid_cat_lifestyle', price: '18,900 DA', tag: 'New', img: 'https://images.unsplash.com/photo-1623788975845-7d3e0adbae7c?w=800&h=1000&fit=crop&auto=format', accent: '#e8e0d4' },
  { id: 3, nameKey: 'Zoom Pegasus 41', category: 'Running', categoryKey: 'grid_cat_running', price: '13,900 DA', tag: null, img: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=640&fit=crop&auto=format', accent: '#e85d3a' },
  { id: 4, nameKey: 'React Infinity Run', category: 'Running', categoryKey: 'grid_cat_running', price: '17,900 DA', tag: 'Limited', img: 'https://images.unsplash.com/photo-1600185365778-7875a359b924?w=800&h=640&fit=crop&auto=format', accent: '#f5a623' },
  { id: 5, nameKey: 'Free Run Flyknit', category: 'Training', categoryKey: 'grid_cat_training', price: '12,900 DA', tag: null, img: 'https://images.unsplash.com/photo-1557461761-c7c2b7a5fa97?w=800&h=640&fit=crop&auto=format', accent: '#888' },
  { id: 6, nameKey: 'Invincible Run 3', category: 'Running', categoryKey: 'grid_cat_running', price: '22,900 DA', tag: 'New Drop', img: 'https://images.unsplash.com/photo-1746206673199-5b75dcec1018?w=800&h=640&fit=crop&auto=format', accent: '#f5a623' },
]

export default function ProductGrid() {
  const { t } = useLang()
  const [active, setActive] = useState('All')
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const categories = [
    { key: 'All', label: t.grid_cat_all },
    { key: 'Running', label: t.grid_cat_running },
    { key: 'Lifestyle', label: t.grid_cat_lifestyle },
    { key: 'Training', label: t.grid_cat_training },
    { key: 'Basketball', label: t.grid_cat_basketball },
  ]

  const filtered = active === 'All' ? products : products.filter((p) => p.category === active)

  return (
    <section className="bg-ink py-12 sm:py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5 mb-6 sm:mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-px bg-volt" />
              <span className="text-volt text-xs tracking-[0.25em] uppercase" style={{ fontFamily: 'DM Mono, monospace' }}>{t.grid_eyebrow}</span>
            </div>
            <h2 className="font-display font-black text-bone leading-none" style={{ fontSize: 'clamp(26px, 4vw, 58px)', letterSpacing: '-0.02em' }}>{t.grid_heading}</h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActive(c.key)}
                className="px-3 py-1.5 text-xs tracking-[0.12em] uppercase transition-all duration-200 cursor-pointer"
                style={{ fontFamily: 'DM Mono, monospace', background: active === c.key ? '#f5a623' : 'transparent', color: active === c.key ? '#050505' : '#888', border: `1px solid ${active === c.key ? '#f5a623' : 'rgba(255,255,255,0.1)'}` }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {filtered.map((p) => (
            <Link
              to="/products"
              key={p.id}
              className="product-card group relative bg-zinc cursor-pointer overflow-hidden block"
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ aspectRatio: '4/3' }}
            >
              <img src={p.img} alt={p.nameKey} loading="lazy" decoding="async" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" style={{ filter: 'brightness(0.8) contrast(1.05)' }} />

              <div className="overlay absolute inset-0 flex flex-col justify-end p-2 " style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.9) 30%, rgba(5,5,5,0.2) 70%, transparent)' }}>
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-ash text-xs mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>{p.category}</p>
                  <p className="font-display font-bold text-bone text-sm tracking-tigh">{p.nameKey}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-volt font-semibold text-[11px]" style={{ fontFamily: 'DM Mono, monospace' }}>{p.price}</span>
                    <span className="text-xs text-ink bg-volt px-2 py-1 tracking-wide uppercase">{t.grid_shop}</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-2 group-hover:opacity-0 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.7), transparent)' }}>
                <p className="font-display font-bold text-bone text-xs tracking-tight">{p.nameKey}</p>
                <span className="text-ash text-xs" style={{ fontFamily: 'DM Mono, monospace' }}>{p.price}</span>
              </div>

              {p.tag && (
                <div className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] tracking-[0.12em] uppercase" style={{ fontFamily: 'DM Mono, monospace', background: p.accent, color: '#050505' }}>
                  {p.tag}
                </div>
              )}

              <div className="absolute top-0 right-0 w-px transition-all duration-500" style={{ height: hoveredId === p.id ? '30%' : '0', background: p.accent }} />
              <div className="absolute top-0 right-0 h-px transition-all duration-500" style={{ width: hoveredId === p.id ? '20%' : '0', background: p.accent, transitionDelay: '0.05s' }} />
            </Link>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <Link to="/products" className="inline-flex items-center gap-3 text-sm text-ash hover:text-volt transition-colors duration-200 tracking-[0.15em] uppercase border-b border-ash/20 hover:border-volt pb-1" style={{ fontFamily: 'DM Mono, monospace' }}>
            {t.grid_view_all}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
