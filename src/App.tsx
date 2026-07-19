import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import CartUI from './components/CartUI';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import FeaturedProduct from './components/FeaturedProduct';
import ProductGrid from './components/ProductGrid';
import BrandStatement from './components/BrandStatement';
import Categories from './components/Categories';
import Footer from './components/Footer';
import ProductsPage from './pages/Products/products';
import TrackingPage from './pages/tracking/track';
import ShippingPage from './pages/shipping/Shiping';
import ContactPage from './pages/Contact/contact';
import AdminPage from './pages/Admin/admin';
import ProductDetailsPage from './pages/ProductDetails/ProductDetails';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminTracking from "./pages/tracking/AdminTracking";
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; 
  const bypassForDevelopment = true; 

  if (!isAdmin && !bypassForDevelopment) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

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
  );
}

export default function App() {
  return (
    <AuthProvider>
    <ThemeProvider>
    <CartProvider>
      {/* Toaster is now inside the Provider and the main App component */}
      <Toaster position="top-right" />
      
      <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/tracking" 
            element={
              <AdminRoute>
                <AdminTracking />
              </AdminRoute>
            } 
          />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Route for Shareable Links */}
          <Route path="/products/uuid/:id" element={<ProductDetailsPage />} />
        </Routes>
      <CartUI />
    </CartProvider>
    </ThemeProvider>
    </AuthProvider>
  );
}
