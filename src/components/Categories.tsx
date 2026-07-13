import { Link } from 'react-router'

const audiences = [
  { name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1000&q=85' },
  { name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85' },
  { name: 'Children', slug: 'children', image: 'https://images.unsplash.com/photo-1519238360530-d9d35a9c6854?auto=format&fit=crop&w=1000&q=85' },
]

const departments = [
  { name: 'Sneakers', slug: 'sneakers' },
  { name: 'Clothes', slug: 'clothes' },
  { name: 'Accessories', slug: 'accessories' },
]

export default function Categories() {
  return (
    <section className="bg-carbon px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-col justify-between gap-5 md:mb-14 md:flex-row md:items-end">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-volt">Find your style</p>
            <h2 className="font-display text-5xl font-black uppercase leading-[0.85] text-bone md:text-7xl">Shop by<br />category</h2>
          </div>
          <Link to="/products" className="group inline-flex w-fit items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-bone transition-colors hover:text-volt">
            View all products <span className="text-lg transition-transform group-hover:translate-x-1">&#8594;</span>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {audiences.map((audience) => (
            <article key={audience.name} className="group relative flex h-[450px] items-center justify-center overflow-hidden bg-zinc md:h-[590px]">
              <img src={audience.image} alt={`${audience.name}'s collection`} className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-ink/20" />

              <div className="relative z-10 flex w-full max-w-[23rem] flex-col items-center px-6">
                <h3 className="mb-8 font-display text-6xl font-black uppercase leading-none tracking-wide text-white drop-shadow-lg md:text-7xl">{audience.name}</h3>
                <nav aria-label={`${audience.name} categories`} className="flex w-full flex-col gap-4">
                  {departments.map((department) => (
                    <Link
                      key={department.slug}
                      to={`/products?category=${audience.slug}&department=${department.slug}`}
                      className="rounded-full bg-bone px-6 py-3.5 text-center text-base font-semibold text-ink shadow-lg transition duration-300 hover:scale-[1.02] hover:bg-volt focus-visible:bg-volt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink md:text-lg"
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
