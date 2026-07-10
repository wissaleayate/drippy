import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import FeaturedProduct from './components/FeaturedProduct'
import ProductGrid from './components/ProductGrid'
import BrandStatement from './components/BrandStatement'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import ProductsPage from './pages/Products/products'

function Home() {
  return (
    <div className="bg-ink text-bone min-h-screen">
      <Nav />
      <Hero />
      <Marquee />
      <FeaturedProduct />
      <ProductGrid />
      <BrandStatement />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductsPage />} />
    </Routes>
  )
}
