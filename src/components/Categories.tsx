import { useLang } from '../context/LanguageContext'
import { Link } from 'react-router'

export default function Categories() {
  const { t } = useLang()

  const audiences = [
    { nameKey: t.cat_men, slug: 'men', image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1000&q=85' },
    { nameKey: t.cat_women, slug: 'women', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85' },
    { nameKey: t.cat_children, slug: 'children', image: 'https://images.unsplash.com/photo-1519238360530-d9d35a9c6854?auto=format&fit=crop&w=1000&q=85' },
  ]

  const departments = [
    { name: t.cat_sneakers, slug: 'sneakers' },
    { name: t.cat_clothes, slug: 'clothes' },
    { name: t.cat_accessories, slug: 'accessories' },
  ]

  return (
    <section className="bg-carbon px-4 sm:px-6 py-12 sm:py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-3 sm:gap-4 md:mb-10 md:flex-row md:items-end">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-volt">{t.cat_eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase leading-[0.85] text-bone md:text-6xl">
              {t.cat_heading.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h2>
          </div>
          <Link to="/products" className="group inline-flex w-fit items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] text-bone transition-colors hover:text-volt">
            {t.cat_view_all} <span className="text-base transition-transform group-hover:translate-x-1">&#8594;</span>
          </Link>
        </div>

        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {audiences.map((audience) => (
            <article key={audience.slug} className="group relative flex h-[300px] sm:h-[360px] items-center justify-center overflow-hidden bg-zinc md:h-[460px]">
              <img src={audience.image} alt={audience.nameKey} className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 ease-out group-hover:scale-105" />
              {/*
                Fixed black-based scrim (NOT theme tokens) — this card is a
                photo with text/buttons on top, always dark-scrimmed regardless
                of site theme, same reasoning as Hero.tsx.
              */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/15" />

              <div className="relative z-10 flex w-full max-w-[20rem] flex-col items-center px-5">
                <h3 className="mb-4 sm:mb-6 font-display text-4xl sm:text-5xl font-black uppercase leading-none tracking-wide text-white drop-shadow-lg md:text-6xl">
                  {audience.nameKey}
                </h3>
                <nav aria-label={`${audience.nameKey} categories`} className="flex w-full flex-col gap-2 sm:gap-3">
                  {departments.map((department) => (
                    <Link
                      key={department.slug}
                      to={`/products?category=${audience.slug}&department=${department.slug}`}
                      className="rounded-full bg-white px-5 py-2 sm:py-2.5 text-center text-xs sm:text-sm font-semibold text-[#111827] shadow-lg transition duration-300 hover:scale-[1.02] hover:bg-volt hover:text-ink focus-visible:bg-volt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      {department.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
