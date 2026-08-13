import { useLang } from '../context/LanguageContext'

const BASE_PRODUCT_NAMES = [
  'Air Max Ultra',
  'React Infinity',
  'Zoom Pegasus',
  'Vaporfly Next%',
  'Free Run 5.0',
  'Invincible Run',
]

export default function Marquee() {
  const { t } = useLang()
  const sep = t.marquee_sep

  // Build item list: name, sep, name, sep …
  const baseItems: string[] = []
  BASE_PRODUCT_NAMES.forEach((name) => {
    baseItems.push(name)
    baseItems.push(sep)
  })

  // Duplicate so the second copy seamlessly follows the first
  const items = [...baseItems, ...baseItems]

  return (
    <div
      className="w-full overflow-hidden border-y py-3"
      style={{ borderColor: 'var(--marquee-border)', background: 'var(--marquee-bg)' }}
      aria-hidden="true"
    >
      <div
        className="flex whitespace-nowrap animate-marquee"
        style={{ willChange: 'transform' }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className={`mx-4 font-display font-bold text-xs tracking-[0.1em] uppercase ${
              item === sep ? 'text-volt text-[10px]' : 'text-ash'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}