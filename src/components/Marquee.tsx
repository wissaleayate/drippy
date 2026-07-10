const baseItems = [
  'Air Max Ultra',
  '★',
  'React Infinity',
  '★',
  'Zoom Pegasus',
  '★',
  'Vaporfly Next%',
  '★',
  'Free Run 5.0',
  '★',
  'Invincible Run',
  '★',
]

// Duplicate so the second copy seamlessly follows the first
const items = [...baseItems, ...baseItems]

export default function Marquee() {
  return (
    <div
      className="w-full overflow-hidden border-y py-4"
      style={{ borderColor: 'rgba(200,255,0,0.2)', background: '#0a0a0a' }}
    >
      <div
        className="flex whitespace-nowrap animate-marquee"
        style={{ willChange: 'transform' }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className={`mx-6 font-display font-bold text-sm tracking-[0.1em] uppercase ${
              item === '★' ? 'text-volt text-xs' : 'text-ash'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
