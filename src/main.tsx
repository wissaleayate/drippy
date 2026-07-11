import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import ProductsPage from './pages/Products/products'
import TrackingPage from './pages/tracking/track'
import ShippingPage from './pages/shipping/Shiping'
import ContactPage from './pages/Contact/contact'
import './index.css'
import Home from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/contact" element={<ContactPage />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
