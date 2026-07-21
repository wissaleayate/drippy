import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import CartUI from './components/CartUI';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import FeaturedProduct from './components/FeaturedProduct';
import ProductGrid from './components/ProductGrid';
import BrandStatement from './components/BrandStatement';
import Categories from './components/Categories';
import Footer from './components/Footer';

// Eagerly loaded auth pages (small, critical path)
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';

// Lazily loaded heavy pages
const ProductsPage = lazy(() => import('./pages/Products/products'));
const TrackingPage = lazy(() => import('./pages/tracking/track'));
const ShippingPage = lazy(() => import('./pages/shipping/Shiping'));
const ContactPage = lazy(() => import('./pages/Contact/contact'));
const AdminPage = lazy(() => import('./pages/Admin/admin'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetails/ProductDetails'));
const AdminOrders = lazy(() => import('./pages/Admin/AdminOrders'));
const AdminTracking = lazy(() => import('./pages/tracking/AdminTracking'));

function PageLoader() {
  return (
    <div className="bg-ink text-bone min-h-screen flex items-center justify-center">
      <span className="w-6 h-6 rounded-full border-2 border-volt border-t-transparent animate-spin" aria-hidden="true" />
    </div>
  );
}
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

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
      <Categories />
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
    <LanguageProvider>
    <CartProvider>
      <Toaster position="top-right" />
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
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
      </Suspense>

      <CartUI />
    </CartProvider>
    </LanguageProvider>
    </ThemeProvider>
    </AuthProvider>
  );
}
