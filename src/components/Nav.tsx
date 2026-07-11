import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import logo from '../imports/drippy logo.png'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Order Status', path: '/tracking' },
  { label: 'Delivery Trading', path: '/shipping' },
  { label: 'Contact Us', path: '/contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { cart, openCart } = useCart()
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isSolid = true

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: isSolid ? 'rgba(26,14,5,0.97)' : 'transparent',
        backdropFilter: isSolid ? 'blur(20px)' : 'none',
        borderBottom: isSolid ? '1px solid rgba(245,166,35,0.10)' : 'none',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Drippy" className="h-40 w-auto object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.path}
              className="volt-underline text-sm font-medium tracking-wide text-ash hover:text-bone transition-colors duration-200"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link to="/products" className="hidden md:flex items-center gap-2 text-sm text-ash hover:text-bone transition-colors duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </Link>

          <button
            onClick={openCart}
            className="relative flex items-center gap-2 text-sm text-ash hover:text-bone transition-colors duration-200"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-volt text-[9px] font-black text-ink">
                {cartItemCount}
              </span>
            )}
          </button>

          <Link
            to="/products"
            className="hidden md:inline-flex items-center px-5 py-2 text-xs font-semibold tracking-[0.12em] uppercase bg-volt text-ink hover:bg-bone transition-colors duration-200"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            Shop Now
          </Link>

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

      <div
        className="md:hidden overflow-hidden transition-all duration-400"
        style={{ maxHeight: menuOpen ? '400px' : '0', background: 'rgba(26,14,5,0.98)' }}
      >
        <div className="px-6 py-6 flex flex-col gap-5 border-t border-white/5">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.path}
              onClick={() => setMenuOpen(false)}
              className="font-display font-bold text-3xl tracking-tight text-bone"
            >
              {l.label}
            </Link>
          ))}
          <Link to="/products" onClick={() => setMenuOpen(false)} className="inline-flex items-center gap-2 text-volt text-sm font-mono mt-2">
            Shop Now →
          </Link>
        </div>
      </div>
    </header>
  )
}