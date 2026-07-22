import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../imports/drippy logo.png'
import { ShoppingBag, User, ChevronDown, Package, LogOut, UserCircle2, Search, Sun, Moon, Globe } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLang, type Language } from '../context/LanguageContext'
import toast from 'react-hot-toast'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [langOpen, setLangOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)
  const { cart, openCart } = useCart()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang, t, isRTL } = useLang()
  const navigate = useNavigate()
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0)

  const links = [
    { label: t.nav_home, path: '/' },
    { label: t.nav_products, path: '/products' },
    { label: t.nav_order_status, path: '/tracking' },
    { label: t.nav_delivery, path: '/shipping' },
    { label: t.nav_contact, path: '/contact' },
  ]

  const LANG_OPTIONS: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿' },
  ]

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
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
      setMenuOpen(false)
    }
  }

  function handleLogout() {
    setDropdownOpen(false)
    setMenuOpen(false)
    logout()
    toast.success(lang === 'ar' ? 'تم تسجيل الخروج.' : lang === 'fr' ? 'Déconnexion réussie.' : "You've been logged out.")
    navigate('/')
  }

  const initials = user
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : ''

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: 'rgba(26,14,5,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(245,166,35,0.10)',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <img src={logo} alt="Drippy" className="h-28 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.path}
              className="volt-underline text-sm font-medium tracking-wide text-ash hover:text-bone transition-colors duration-200 whitespace-nowrap"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="flex items-center relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                  placeholder={t.nav_search_placeholder}
                  className="w-28 sm:w-44 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
                />
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="tap-target flex items-center justify-center text-ash hover:text-bone transition-colors duration-200 cursor-pointer"
                aria-label={t.nav_search_placeholder}
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cart */}
          <button
            onClick={openCart}
            className="tap-target relative flex items-center justify-center text-ash hover:text-bone transition-colors duration-200"
            aria-label={t.cart_title}
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-volt text-[9px] font-black text-ink">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="tap-target flex items-center justify-center w-8 h-8 rounded-xl border border-white/10 hover:border-volt/40 text-ash hover:text-volt transition-all duration-200 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language Switcher */}
          <div className="relative hidden sm:block" ref={langRef}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="tap-target flex items-center gap-1.5 px-2 py-1.5 rounded-xl border border-white/10 hover:border-volt/40 text-ash hover:text-volt transition-all duration-200 cursor-pointer"
              aria-label={t.nav_language}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono uppercase font-bold">{lang}</span>
            </button>
            {langOpen && (
              <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-40 rounded-2xl border border-white/10 bg-zinc shadow-xl overflow-hidden z-50`}>
                {LANG_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => { setLang(opt.code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer ${
                      lang === opt.code
                        ? 'bg-volt/10 text-volt font-bold'
                        : 'text-ash hover:text-bone hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>{opt.flag}</span>
                    <span className={opt.code === 'ar' ? 'font-sans' : 'font-mono'}>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth: logged out */}
          {!user && (
            <Link
              to="/login"
              className="hidden md:inline-flex tap-target items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-[0.10em] uppercase border border-white/10 text-bone hover:border-volt/50 hover:text-volt rounded-xl transition-all duration-200"
              style={{ fontFamily: 'DM Mono, monospace' }}
            >
              <User className="w-3.5 h-3.5" />
              {t.nav_login}
            </Link>
          )}

          {/* Auth: logged in */}
          {user && (
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="tap-target flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 hover:border-volt/40 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200 cursor-pointer"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-volt text-[10px] font-black text-ink select-none">
                  {initials}
                </span>
                <span className="text-xs font-semibold text-bone max-w-[80px] truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className={`w-3 h-3 text-ash transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-52 rounded-2xl border border-white/10 bg-zinc shadow-xl overflow-hidden z-50`}>
                  <div className="px-4 py-3.5 border-b border-white/5">
                    <p className="text-xs font-bold text-bone truncate">{user.name}</p>
                    <p className="text-[11px] text-ash truncate mt-0.5">{user.email}</p>
                  </div>
                <div className="py-1.5">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ash hover:text-bone hover:bg-white/[0.04] transition-colors">
                      <UserCircle2 className="w-4 h-4" />{t.nav_profile}
                    </Link>
                    <Link to="/tracking" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ash hover:text-bone hover:bg-white/[0.04] transition-colors">
                      <Package className="w-4 h-4" />{t.nav_my_orders}
                    </Link>
                  </div>
                  <div className="border-t border-white/5 py-1.5">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-white/[0.04] transition-colors cursor-pointer">
                      <LogOut className="w-4 h-4" />{t.nav_logout}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <Link
            to="/products"
            className="hidden md:inline-flex tap-target items-center px-4 xl:px-5 py-2 text-xs font-semibold tracking-[0.12em] uppercase bg-volt text-ink hover:bg-bone transition-colors duration-200 whitespace-nowrap"
            style={{ fontFamily: 'DM Mono, monospace' }}
          >
            {t.nav_shop_now}
          </Link>

          {/* Hamburger */}
          <button
            className="lg:hidden tap-target flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span className={`block w-6 h-0.5 bg-bone transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-4 h-0.5 bg-bone transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-bone transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-400"
        style={{ maxHeight: menuOpen ? '600px' : '0', background: 'rgba(26,14,5,0.98)' }}
      >
        <div className="px-5 py-6 flex flex-col gap-5 border-t border-white/5">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.nav_search_placeholder}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
              />
            </div>
            <button type="submit" className="px-4 py-2.5 bg-volt text-ink text-xs font-mono font-bold rounded-xl">
              →
            </button>
          </form>

          {links.map((l) => (
            <Link
              key={l.label}
              to={l.path}
              onClick={() => setMenuOpen(false)}
              className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-bone"
            >
              {l.label}
            </Link>
          ))}

          {/* Mobile language switcher */}
          <div className="flex gap-2 flex-wrap">
            {[
              { code: 'en' as Language, flag: '🇬🇧', label: 'EN' },
              { code: 'fr' as Language, flag: '🇫🇷', label: 'FR' },
              { code: 'ar' as Language, flag: '🇩🇿', label: 'AR' },
            ].map((opt) => (
              <button
                key={opt.code}
                onClick={() => setLang(opt.code)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                  lang === opt.code ? 'bg-volt/10 border-volt/40 text-volt' : 'border-white/10 text-ash hover:text-bone'
                }`}
              >
                {opt.flag} {opt.label}
              </button>
            ))}
          </div>

          <Link to="/products" onClick={() => setMenuOpen(false)} className="inline-flex items-center gap-2 text-volt text-sm font-mono mt-1">
            {t.nav_shop_now} →
          </Link>

          {/* Mobile auth */}
          {!user ? (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-2 text-ash text-sm font-mono border-t border-white/5 pt-4 mt-1"
            >
              <User className="w-4 h-4" />
              {t.nav_login}
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
                {t.nav_logout}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
