import { useState } from 'react'

const categories = ['All', 'Running', 'Lifestyle', 'Training', 'Basketball']

const products = [
  {
    id: 1,
    name: 'Vaporfly Next%',
    category: 'Running',
    price: '$259',
    tag: 'Best Seller',
    img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=640&fit=crop&auto=format',
    accent: '#c8ff00',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 2,
    name: 'Air Force 1 Shadow',
    category: 'Lifestyle',
    price: '$189',
    tag: 'New',
    img: 'https://images.unsplash.com/photo-1623788975845-7d3e0adbae7c?w=800&h=1000&fit=crop&auto=format',
    accent: '#e8e0d4',
    span: 'col-span-1 row-span-2',
  },
  {
    id: 3,
    name: 'Zoom Pegasus 41',
    category: 'Running',
    price: '$139',
    tag: null,
    img: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=640&fit=crop&auto=format',
    accent: '#e85d3a',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 4,
    name: 'React Infinity Run',
    category: 'Running',
    price: '$179',
    tag: 'Limited',
    img: 'https://images.unsplash.com/photo-1600185365778-7875a359b924?w=800&h=640&fit=crop&auto=format',
    accent: '#c8ff00',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 5,
    name: 'Free Run Flyknit',
    category: 'Training',
    price: '$129',
    tag: null,
    img: 'https://images.unsplash.com/photo-1557461761-c7c2b7a5fa97?w=800&h=640&fit=crop&auto=format',
    accent: '#888',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 6,
    name: 'Invincible Run 3',
    category: 'Running',
    price: '$229',
    tag: 'New Drop',
    img: 'https://images.unsplash.com/photo-1746206673199-5b75dcec1018?w=800&h=640&fit=crop&auto=format',
    accent: '#c8ff00',
    span: 'col-span-1 row-span-1',
  },
]

export default function ProductGrid() {
  const [active, setActive] = useState('All')
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const filtered = active === 'All' ? products : products.filter((p) => p.category === active)

  return (
    <section className="bg-ink py-20 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="w-8 h-px bg-volt" />
              <span className="text-volt text-xs tracking-[0.25em] uppercase" style={{ fontFamily: 'DM Mono, monospace' }}>
                Collections
              </span>
            </div>
            <h2
              className="font-display font-black text-bone leading-none"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', letterSpacing: '-0.02em' }}
            >
              THE LINEUP
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className="px-4 py-2 text-xs tracking-[0.12em] uppercase transition-all duration-200"
                style={{
                  fontFamily: 'DM Mono, monospace',
                  background: active === c ? '#c8ff00' : 'transparent',
                  color: active === c ? '#050505' : '#888',
                  border: `1px solid ${active === c ? '#c8ff00' : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="product-card group relative bg-zinc cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ aspectRatio: p.span.includes('row-span-2') ? '3/4' : '4/3' }}
            >
              {/* Image */}
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                style={{ filter: 'brightness(0.8) contrast(1.05)' }}
              />

              {/* Overlay */}
              <div
                className="overlay absolute inset-0 flex flex-col justify-end p-5"
                style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.9) 30%, rgba(5,5,5,0.2) 70%, transparent)' }}
              >
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-ash text-xs mb-1" style={{ fontFamily: 'DM Mono, monospace' }}>
                    {p.category}
                  </p>
                  <p className="font-display font-bold text-bone text-xl tracking-tight">{p.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-volt font-semibold" style={{ fontFamily: 'DM Mono, monospace' }}>
                      {p.price}
                    </span>
                    <button className="text-xs text-ink bg-volt px-3 py-1.5 tracking-wide uppercase hover:bg-bone transition-colors duration-200">
                      Add →
                    </button>
                  </div>
                </div>
              </div>

              {/* Static bottom bar (always visible) */}
              <div
                className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-4 group-hover:opacity-0 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.7), transparent)' }}
              >
                <p className="font-display font-bold text-bone text-lg tracking-tight">{p.name}</p>
                <span className="text-ash text-sm" style={{ fontFamily: 'DM Mono, monospace' }}>{p.price}</span>
              </div>

              {/* Tag badge */}
              {p.tag && (
                <div
                  className="absolute top-4 left-4 px-3 py-1 text-xs tracking-[0.12em] uppercase"
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    background: p.accent,
                    color: p.accent === '#c8ff00' ? '#050505' : '#050505',
                  }}
                >
                  {p.tag}
                </div>
              )}

              {/* Volt corner accent on hover */}
              <div
                className="absolute top-0 right-0 w-px transition-all duration-500"
                style={{
                  height: hoveredId === p.id ? '30%' : '0',
                  background: p.accent,
                }}
              />
              <div
                className="absolute top-0 right-0 h-px transition-all duration-500"
                style={{
                  width: hoveredId === p.id ? '20%' : '0',
                  background: p.accent,
                  transitionDelay: '0.05s',
                }}
              />
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-10 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-3 text-sm text-ash hover:text-volt transition-colors duration-200 tracking-[0.15em] uppercase border-b border-ash/20 hover:border-volt pb-1"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            View All Products
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
