import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'


const links =['Accueil','Products','Etat de commande','Trafis de livraison','Contactez-nous']
export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // On non-home pages, always render with solid dark background
  const isSolid = !isHome || scrolled

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: isSolid ? 'rgba(5,5,5,0.97)' : 'transparent',
        backdropFilter: isSolid ? 'blur(20px)' : 'none',
        borderBottom: isSolid ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="font-display font-black text-2xl tracking-[-0.02em] text-bone">
          NK<span className="text-volt">.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href={l === 'Products' ? '/products' : '#'}
              className="volt-underline text-sm font-medium tracking-wide text-ash hover:text-bone transition-colors duration-200"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {l}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
          <button className="hidden md:flex items-center gap-2 text-sm text-ash hover:text-bone transition-colors duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <button className="hidden md:flex items-center gap-2 text-sm text-ash hover:text-bone transition-colors duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
          <a
            href="#"
            className="hidden md:inline-flex items-center px-5 py-2 text-xs font-semibold tracking-[0.12em] uppercase bg-volt text-ink hover:bg-bone transition-colors duration-200"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            Shop Now
          </a>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-bone transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-4 h-0.5 bg-bone transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-bone transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-400"
        style={{ maxHeight: menuOpen ? '400px' : '0', background: 'rgba(5,5,5,0.98)' }}
      >
        <div className="px-6 py-6 flex flex-col gap-5 border-t border-white/5">
          {links.map((l) => (
            <a
              key={l}
              href={l === 'Products' ? '/products' : '#'}
              className="font-display font-bold text-3xl tracking-tight text-bone"
            >
              {l}
            </a>
          ))}
          <a href="#" className="inline-flex items-center gap-2 text-volt text-sm font-mono mt-2">
            Shop Now →
          </a>
        </div>
      </div>
    </header>
  )
}
