import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import CartUI from './components/CartUI'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import FeaturedProduct from './components/FeaturedProduct'
import ProductGrid from './components/ProductGrid'
import BrandStatement from './components/BrandStatement'
import Categories from './components/Categories'
import Footer from './components/Footer'
import ProductsPage from './pages/Products/products'
import TrackingPage from './pages/tracking/track'
import ShippingPage from './pages/shipping/Shiping'
import ContactPage from './pages/Contact/contact'
import AdminPage from './pages/Admin/admin';
function Home() {
  return (
    <div className="bg-ink text-bone min-h-screen">
      <Nav />
      <Hero />
      <Marquee />
      <Categories/>
      <FeaturedProduct />
      <ProductGrid />
      <BrandStatement />
    
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <CartUI />
    </CartProvider>
  )
}