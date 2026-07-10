const footerLinks = {
  Collections: ['Running', 'Training', 'Lifestyle', 'Basketball', 'Collaborations'],
  Support: ['Size Guide', 'Shipping & Returns', 'Track My Order', 'Contact Us', 'Store Locator'],
  Company: ['About Us', 'Sustainability', 'Careers', 'Press', 'Investors'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Settings'],
}

const socials = [
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-carbon border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      {/* Top volt line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(to right, #c8ff00 0%, rgba(200,255,0,0.2) 40%, transparent 70%)' }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-16 pb-10">
        {/* Brand + tagline */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 mb-16">
          <div className="max-w-xs">
            <a href="#" className="font-display font-black text-4xl text-bone tracking-[-0.02em]">
              NK<span className="text-volt">.</span>
            </a>
            <p className="text-ash text-sm leading-relaxed mt-4">
              Engineered for the relentless pursuit of better. Since 1972.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="text-ash hover:text-volt transition-colors duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 md:pl-10">
            {Object.entries(footerLinks).map(([group, items]) => (
              <div key={group}>
                <p
                  className="text-bone text-xs tracking-[0.2em] uppercase mb-4"
                  style={{ fontFamily: 'DM Mono, monospace' }}
                >
                  {group}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-ash text-sm hover:text-bone transition-colors duration-200 volt-underline"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Watermark brand name */}
        <div
          className="font-display font-black text-center leading-none mb-8 select-none pointer-events-none"
          style={{
            fontSize: 'clamp(48px, 12vw, 160px)',
            letterSpacing: '-0.04em',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.04)',
          }}
          aria-hidden
        >
          JUST DO IT
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <p className="text-ash text-xs" style={{ fontFamily: 'DM Mono, monospace' }}>
            © 2025 NK Inc. All rights reserved.
          </p>
          <p className="text-ash/40 text-xs" style={{ fontFamily: 'DM Mono, monospace' }}>
            Designed with precision. Built for speed.
          </p>
        </div>
      </div>
    </footer>
  )
}
