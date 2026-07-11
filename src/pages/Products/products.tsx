import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { type Product, type Category, type FilterState } from '../../types';
import ProductCard from '../../components/ProductCard';
import FilterBar from '../../components/FilterBar';
import ProductDetailView from '../../components/ProductDetailView';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';

function normalizeProduct(raw: any): Product {
  const hasRealImage = typeof raw.image === 'string' && raw.image.startsWith('http');
  return {
    id: raw.id,
    name: raw.name,
    brand: raw.brand,
    category: raw.category,
    price: raw.price,
    image: hasRealImage ? raw.image : `/images/${raw.image}`,
    stock: raw.stock ?? 99,
    inStock: (raw.stock ?? 1) > 0,
    description: raw.description ?? '',
    sizes: raw.sizes ?? ['S', 'M', 'L'],
    featured: raw.featured ?? false,
    rating: raw.rating ?? 0,
  };
}

export default function Product() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    brand: 'All',
    maxPrice: 50000,
    size: 'All',
    sortBy: 'featured',
  });

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const { cart, addToCart, openCart } = useCart();
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/products')
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProducts(data.map(normalizeProduct));
        setIsLoadingProducts(false);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        setProductsError('Could not load products. Is the backend running?');
        setIsLoadingProducts(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        selectedCategory !== 'all' &&
        product.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

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

      if (filters.brand !== 'All' && product.brand !== filters.brand) {
        return false;
      }

      if (product.price > filters.maxPrice) {
        return false;
      }

      if (filters.size !== 'All' && !product.sizes.includes(filters.size)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low-to-high') {
        return a.price - b.price;
      }
      if (filters.sortBy === 'price-high-to-low') {
        return b.price - a.price;
      }
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      const aFeatured = a.featured ? 1 : 0;
      const bFeatured = b.featured ? 1 : 0;
      return bFeatured - aFeatured;
    });
  }, [selectedCategory, filters, products]);

  return (
    <div className="min-h-screen flex flex-col bg-ink text-bone" id="app-root-container">
      <Nav />

      <div className="sticky top-16 z-20 bg-ink/90 backdrop-blur-md border-b border-white/5" id="main-header">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-ash">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-volt" />
              Free shipping above 15,000 DA
            </span>
            <span>•</span>
            <span>Est. Delivery: 2-3 Days</span>
          </div>
          <button
            onClick={openCart}
            className="relative flex items-center justify-center h-9 px-4 rounded-xl border border-white/5 hover:border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer ml-auto"
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

      <main className="flex-grow pb-24 pt-28" id="main-layout">
        <div className="max-w-7xl mx-auto px-6 pt-4 pb-8 text-center" id="hero-section">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h2 className="text-5xl sm:text-7xl font-black text-bone font-display tracking-tight uppercase mb-4">
              Our Collections
            </h2>
            <p className="text-sm sm:text-base text-ash font-medium max-w-xl mx-auto">
              Discover clean silhouettes, functional designs, and premium organic fabrics tailored for the modern closet.
            </p>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto px-6 mb-8 flex justify-center" id="categories-container">
          <div className="inline-flex bg-white/[0.02] p-1.5 rounded-2xl gap-1 border border-white/5 backdrop-blur-md">
            {(['all', 'men', 'women', 'children'] as const).map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-volt text-ink shadow-sm font-extrabold'
                      : 'text-ash hover:text-bone hover:bg-white/[0.04]'
                  }`}
                >
                  {cat === 'all' ? 'All Products' : cat}
                </button>
              );
            })}
          </div>
        </div>

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          totalResults={filteredProducts.length}
        />

        <div className="max-w-7xl mx-auto px-6" id="products-catalog-section">
          {isLoadingProducts ? (
            <div className="text-center py-20 text-ash text-sm">Loading products…</div>
          ) : productsError ? (
            <div className="text-center py-20 text-rose-400 text-sm">{productsError}</div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setDetailProduct(p)}
                      onAddToCart={(p) => addToCart(p)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-20 px-6 max-w-md mx-auto"
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
                        maxPrice: 50000,
                        size: 'All',
                        sortBy: 'featured',
                      });
                      setSelectedCategory('all');
                    }}
                    className="px-5 py-3 rounded-xl bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all duration-300 cursor-pointer shadow-md shadow-volt/5"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {detailProduct && (
          <ProductDetailView
            product={detailProduct}
            onClose={() => setDetailProduct(null)}
            onAddToCart={(p, size) => addToCart(p, size)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}