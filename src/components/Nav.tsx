import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../imports/drippy logo.png'
import { ShoppingBag, User, ChevronDown, Package, LogOut, UserCircle2, Search, Sun, Moon } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Order Status', path: '/tracking' },
  { label: 'Delivery Trading', path: '/shipping' },
  { label: 'Contact Us', path: '/contact' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { cart, openCart } = useCart()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0)

  const isSolid = true

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  function handleLogout() {
    setDropdownOpen(false)
    setMenuOpen(false)
    logout()
    toast.success('You\'ve been logged out.')
    navigate('/')
  }

  // Initials avatar
  const initials = user
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : ''

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
          <div className="hidden md:flex items-center relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                  placeholder="Search products..."
                  className="w-44 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
                />
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 text-sm text-ash hover:text-bone transition-colors duration-200 cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

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

          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-xl border border-white/10 hover:border-volt/40 text-ash hover:text-volt transition-all duration-200 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Auth: logged out → Login button */}
          {!user && (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-[0.10em] uppercase border border-white/10 text-bone hover:border-volt/50 hover:text-volt rounded-xl transition-all duration-200"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              <User className="w-3.5 h-3.5" />
              Login
            </Link>
          )}

          {/* Auth: logged in → Avatar + dropdown */}
          {user && (
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 hover:border-volt/40 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200 cursor-pointer"
              >
                {/* Avatar circle */}
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-volt text-[10px] font-black text-ink select-none">
                  {initials}
                </span>
                <span className="text-xs font-semibold text-bone max-w-[80px] truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className={`w-3 h-3 text-ash transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-white/10 bg-zinc shadow-xl overflow-hidden z-50">
                  {/* User info */}
                  <div className="px-4 py-3.5 border-b border-white/5">
                    <p className="text-xs font-bold text-bone truncate">{user.name}</p>
                    <p className="text-[11px] text-ash truncate mt-0.5">{user.email}</p>
                  </div>

                  <div className="py-1.5">
                    <Link
                      to="/tracking"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ash hover:text-bone hover:bg-white/[0.04] transition-colors"
                    >
                      <UserCircle2 className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      to="/tracking"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ash hover:text-bone hover:bg-white/[0.04] transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                  </div>

                  <div className="border-t border-white/5 py-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-white/[0.04] transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

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

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-400"
        style={{ maxHeight: menuOpen ? '500px' : '0', background: 'rgba(26,14,5,0.98)' }}
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

          {/* Mobile auth */}
          {!user ? (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-2 text-ash text-sm font-mono border-t border-white/5 pt-4 mt-1"
            >
              <User className="w-4 h-4" />
              Login / Register
            </Link>
          ) : (
            <div className="border-t border-white/5 pt-4 mt-1 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-volt text-xs font-black text-ink">
                  {initials}
                </span>
                <div>
                  <p className="text-sm font-bold text-bone">{user.name}</p>
                  <p className="text-xs text-ash">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-rose-400 text-sm font-mono cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
