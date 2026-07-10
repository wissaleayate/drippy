import { useState, useMemo, useEffect } from 'react';

import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  X,
  ArrowRight,
} from 'lucide-react';
import { type Product, type Category, type FilterState } from '../../types';
import { PRODUCTS } from '../../data/product';
import ProductCard from '../../components/ProductCard';
import FilterBar from '../../components/FilterBar';
import ProductDetailView from '../../components/ProductDetailView';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

interface CartItem {
  id: string; // Unique for cart (combination of product.id + size)
  product: Product;
  quantity: number;
  size: string;
}

export default function Product() {
  // Navigation & Category States
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  // Filter States
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    brand: 'All',
    maxPrice: 250,
    size: 'All',
    sortBy: 'featured',
  });

  // Modal & Cart Drawer States
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter & Sort Logic using useMemo for high performance
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // 2. Search Query Filter (Title, description, brand, category)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesTitle = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesBrand && !matchesCat) {
          return false;
        }
      }

      // 3. Brand Filter
      if (filters.brand !== 'All' && product.brand !== filters.brand) {
        return false;
      }

      // 4. Max Price Filter
      if (product.price > filters.maxPrice) {
        return false;
      }

      // 5. Size Filter
      if (filters.size !== 'All' && !product.sizes.includes(filters.size)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // 6. Sort Logic
      if (filters.sortBy === 'price-low-to-high') {
        return a.price - b.price;
      }
      if (filters.sortBy === 'price-high-to-low') {
        return b.price - a.price;
      }
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // 'featured'
      const aFeatured = a.featured ? 1 : 0;
      const bFeatured = b.featured ? 1 : 0;
      return bFeatured - aFeatured;
    });
  }, [selectedCategory, filters]);

  // Toast helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Add to Cart handler
  const handleAddToCart = (product: Product, size: string = '') => {
    // If no size is supplied (from direct card add), pick the first available size
    const finalSize = size || product.sizes[0] || 'Free Size';
    const cartItemId = `${product.id}-${finalSize}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prevCart, { id: cartItemId, product, quantity: 1, size: finalSize }];
    });

    showToast(`Added ${product.name} (${finalSize}) to your bag`);
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (itemId: string, name: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    showToast(`Removed ${name} from your bag`);
  };

  // Cart pricing math
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const shippingFee = cartSubtotal > 150 || cartSubtotal === 0 ? 0 : 9.99;
  const estimatedTax = cartSubtotal * 0.08;
  const cartTotal = cartSubtotal + shippingFee + estimatedTax;

  const handleCheckout = () => {
    setIsCheckoutSuccess(true);
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ink text-bone" id="app-root-container">
      {/* NK. Brand Navigation */}
      <Nav />

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-zinc text-bone px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold border border-white/10 backdrop-blur-md"
            id="toast-notification"
          >
            <div className="h-2 w-2 rounded-full bg-volt animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart + Info Header Strip (below Nav) */}
      <div className="sticky top-16 z-20 bg-ink/90 backdrop-blur-md border-b border-white/5" id="main-header">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-ash">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-volt" />
              Free shipping above $150
            </span>
            <span>•</span>
            <span>Est. Delivery: 2-3 Days</span>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center h-9 px-4 rounded-xl border border-white/5 hover:border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer ml-auto"
            id="header-cart-btn"
          >
            <ShoppingBag className="w-4 h-4 text-bone" />
            <span className="text-xs font-semibold text-bone ml-2 hidden sm:inline">Bag</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-volt text-[10px] font-black text-ink shadow-md animate-bounce">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-grow pb-24 pt-28" id="main-layout">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 pt-4 pb-8 text-center" id="hero-section">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h2 className="text-5xl sm:text-7xl font-black text-bone font-display tracking-tight uppercase mb-4" id="my-products-title">
              Our Collections
            </h2>
            <p className="text-sm sm:text-base text-ash font-medium max-w-xl mx-auto">
              Discover clean silhouettes, functional designs, and premium organic fabrics tailored for the modern closet.
            </p>
          </motion.div>
        </div>

        {/* Categories Tab Bar Selector (Men, Women, Children) */}
        <div className="max-w-5xl mx-auto px-6 mb-8 flex justify-center" id="categories-container">
          <div className="inline-flex bg-white/[0.02] p-1.5 rounded-2xl gap-1 border border-white/5 backdrop-blur-md">
            {(['all', 'men', 'women', 'children'] as const).map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-volt text-ink shadow-sm font-extrabold'
                      : 'text-ash hover:text-bone hover:bg-white/[0.04]'
                  }`}
                  id={`category-tab-${cat}`}
                >
                  {cat === 'all' ? 'All Products' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Bar (Search with Brand, Price, Size dropdown toggles) */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          totalResults={filteredProducts.length}
        />

        {/* Products Grid Output */}
        <div className="max-w-7xl mx-auto px-6" id="products-catalog-section">
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
                id="products-grid"
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setDetailProduct(p)}
                    onAddToCart={(p) => handleAddToCart(p)}
                  />
                ))}
              </motion.div>
            ) : (
              /* Beautiful Empty Search Results */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-20 px-6 max-w-md mx-auto"
                id="empty-results-view"
              >
                <div className="h-16 w-16 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center text-ash mb-6">
                  <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-bone mb-2">No Products Found</h3>
                <p className="text-sm text-ash leading-relaxed mb-6">
                  We couldn't find any items matching your exact filters. Try adjusting your keyword search or resetting active filters.
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      searchQuery: '',
                      brand: 'All',
                      maxPrice: 250,
                      size: 'All',
                      sortBy: 'featured',
                    });
                    setSelectedCategory('all');
                  }}
                  className="px-5 py-3 rounded-xl bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all duration-300 cursor-pointer shadow-md shadow-volt/5"
                  id="empty-reset-btn"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Area */}
      <Footer />

      {/* Product Detail View (Shein-inspired) */}
      <AnimatePresence>
        {detailProduct && (
          <ProductDetailView
            product={detailProduct}
            onClose={() => setDetailProduct(null)}
            onAddToCart={(p, size) => handleAddToCart(p, size)}
          />
        )}
      </AnimatePresence>

      {/* Side Shopping Cart Bag Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-overlay">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity"
            />

            {/* Panel */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-screen max-w-md bg-zinc border-l border-white/10 shadow-2xl flex flex-col text-bone"
                id="cart-drawer-content"
              >
                {/* Drawer Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-volt" />
                    <h3 className="text-base font-bold text-bone">Shopping Bag</h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-volt/10 text-volt">
                      {cartItemCount}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="h-9 w-9 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-ash hover:text-bone transition-colors cursor-pointer"
                    id="close-cart-btn"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Drawer Body (Items List) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-6 border-b border-white/[0.03]" id={`cart-item-${item.id}`}>
                        <div className="h-20 w-16 rounded-xl overflow-hidden bg-ink/50 border border-white/5 flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-xs font-bold text-bone line-clamp-1">{item.product.name}</h4>
                              <button
                                onClick={() => handleRemoveFromCart(item.id, item.product.name)}
                                className="text-ash hover:text-rose-400 transition-colors cursor-pointer"
                                id={`remove-item-btn-${item.id}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-[10px] font-semibold text-ash">Brand: {item.product.brand}</span>
                            <div className="mt-1">
                              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-white/[0.05] text-bone">
                                Size: {item.size}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-white/5 rounded-lg p-0.5 bg-white/[0.02]">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, -1)}
                                className="p-1 rounded-md text-ash hover:text-bone hover:bg-white/[0.05] transition-all cursor-pointer"
                                id={`decrease-qty-btn-${item.id}`}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-bone px-2.5">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, 1)}
                                className="p-1 rounded-md text-ash hover:text-bone hover:bg-white/[0.05] transition-all cursor-pointer"
                                id={`increase-qty-btn-${item.id}`}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-xs font-bold text-bone font-mono">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    /* Cart Empty State */
                    <div className="flex flex-col items-center justify-center text-center h-full max-w-xs mx-auto">
                      <div className="h-12 w-12 rounded-full bg-volt/10 text-volt flex items-center justify-center mb-4">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-bone mb-1">Your bag is empty</h4>
                      <p className="text-xs text-ash leading-relaxed mb-6">
                        Explore our curation and find comfortable silhouettes designed to last.
                      </p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="px-4 py-2.5 rounded-lg border border-volt text-volt text-[11px] font-bold tracking-wider uppercase hover:bg-volt/10 transition-colors cursor-pointer"
                        id="start-shopping-btn"
                      >
                        Start Shopping
                      </button>
                    </div>
                  )}
                </div>

                {/* Drawer Footer Summary (Totals & Checkout) */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-white/5 bg-white/[0.01] space-y-4">
                    <div className="space-y-1.5 text-xs font-medium text-ash">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="text-bone font-bold font-mono">${cartSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Shipping</span>
                        {shippingFee === 0 ? (
                          <span className="text-volt font-bold font-mono">FREE</span>
                        ) : (
                          <span className="text-bone font-bold font-mono">${shippingFee.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Sales Tax (8%)</span>
                        <span className="text-bone font-bold font-mono">${estimatedTax.toFixed(2)}</span>
                      </div>
                      <div className="pt-3 border-t border-white/5 flex justify-between text-sm font-bold text-bone">
                        <span>Total Amount</span>
                        <span className="text-base text-volt font-black font-mono">${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full py-3.5 rounded-2xl bg-volt text-ink text-xs font-mono font-bold tracking-wider uppercase hover:bg-bone transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-volt/5"
                      id="checkout-btn"
                    >
                      <span>Proceed to Secure Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Checkout Success Modal */}
      <AnimatePresence>
        {isCheckoutSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="checkout-success-modal">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutSuccess(false)}
              className="fixed inset-0 bg-ink/85 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative max-w-md w-full bg-zinc border border-white/10 rounded-3xl p-8 text-center shadow-2xl z-10 overflow-hidden text-bone"
              id="checkout-success-body"
            >
              {/* Confetti visual effects */}
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-volt to-bone" />

              <div className="h-16 w-16 bg-volt/10 text-volt rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 stroke-[2]" />
              </div>

              <h3 className="text-xl font-black text-bone tracking-tight mb-2">
                Order Received successfully!
              </h3>
              <p className="text-sm text-ash leading-relaxed mb-6">
                Thank you for shopping at NK. We have sent a confirmation details invoice to your email, and we are preparing your curated products for packing.
              </p>

              <button
                onClick={() => setIsCheckoutSuccess(false)}
                className="w-full py-3 bg-volt text-ink rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all duration-300 cursor-pointer shadow-md shadow-volt/5"
                id="close-success-btn"
              >
                Continue Browsing
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


