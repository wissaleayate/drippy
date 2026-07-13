
import Nav from './components/Nav'
import Hero from './components/Hero'
import Categories from './components/Categories'
import Marquee from './components/Marquee'
import FeaturedProduct from './components/FeaturedProduct'

import BrandStatement from './components/BrandStatement'
import Footer from './components/Footer'


export default function Home() {
  return (
    <div className="bg-ink text-bone min-h-screen">
      <Nav />
      <Hero />
      <Marquee />
      <Categories />
      <FeaturedProduct />
      
      <BrandStatement />
   
      <Footer />
    </div>
  )
}

