import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { type Category, type FilterState, type Product } from '../../types';
import ProductCard from '../../components/ProductCard';
import FilterBar from '../../components/FilterBar';
import ProductDetailView from '../../components/ProductDetailView';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';

type ApiProduct = {
  id: string | number;
  name: string;
  brand: string;
  category: string;
  price: number;
  image?: string | null;
  stock?: number;
  description?: string;
  sizes?: string[];
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
};

function normalizeProduct(raw: ApiProduct): Product {
  const category: Product['category'] =
    raw.category === 'women' || raw.category === 'children' ? raw.category : 'men';
  const image = raw.image ?? '';

  return {
    id: String(raw.id),
    name: raw.name,
    brand: raw.brand,
    category,
    price: raw.price,
    image: image.startsWith('http') || image.startsWith('/') ? image : `/images/${image}`,
    inStock: (raw.stock ?? 1) > 0,
    description: raw.description ?? '',
    sizes: raw.sizes ?? ['S', 'M', 'L'],
    featured: raw.featured ?? false,
    rating: raw.rating ?? 0,
    reviewsCount: raw.reviewsCount ?? 0,
  };
}

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const requestedCategory = searchParams.get('category');
  const urlCategory: Category =
    requestedCategory === 'men' || requestedCategory === 'women' || requestedCategory === 'children'
      ? requestedCategory
      : 'all';
  const [selectedCategory, setSelectedCategory] = useState<Category>(urlCategory);
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
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/products')
      .then((response) => {
        if (!response.ok) throw new Error(`Server responded ${response.status}`);
        return response.json() as Promise<ApiProduct[]>;
      })
      .then((data) => setProducts(data.map(normalizeProduct)))
      .catch((error: unknown) => {
        console.error('Failed to load products:', error);
        setProductsError('Could not load products. Is the backend running?');
      })
      .finally(() => setIsLoadingProducts(false));
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;

        const query = filters.searchQuery.toLowerCase().trim();
        if (
          query &&
          ![product.name, product.description, product.brand, product.category].some((value) =>
            value.toLowerCase().includes(query),
          )
        ) {
          return false;
        }

        if (filters.brand !== 'All' && product.brand !== filters.brand) return false;
        if (product.price > filters.maxPrice) return false;
        if (filters.size !== 'All' && !product.sizes.includes(filters.size)) return false;
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-low-to-high') return a.price - b.price;
        if (filters.sortBy === 'price-high-to-low') return b.price - a.price;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        return Number(b.featured) - Number(a.featured);
      });
  }, [filters, products, selectedCategory]);

  const resetFilters = () => {
    setFilters({ searchQuery: '', brand: 'All', maxPrice: 50000, size: 'All', sortBy: 'featured' });
    setSelectedCategory('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-ink text-bone" id="app-root-container">
      <Nav />

      <div className="sticky top-16 z-20 bg-ink/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-ash">
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-volt" />Free shipping above 15,000 DA</span>
            <span>•</span>
            <span>Est. Delivery: 2–3 Days</span>
          </div>
          <button onClick={openCart} className="relative flex items-center justify-center h-9 px-4 rounded-xl border border-white/5 hover:border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer ml-auto">
            <ShoppingBag className="w-4 h-4 text-bone" />
            <span className="text-xs font-semibold text-bone ml-2 hidden sm:inline">Bag</span>
            {cartItemCount > 0 && <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-volt text-[10px] font-black text-ink shadow-md animate-bounce">{cartItemCount}</span>}
          </button>
        </div>
      </div>

      <main className="flex-grow pb-24 pt-28">
        <div className="max-w-7xl mx-auto px-6 pt-4 pb-8 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <h2 className="text-5xl sm:text-7xl font-black text-bone font-display tracking-tight uppercase mb-4">Our Collections</h2>
            <p className="text-sm sm:text-base text-ash font-medium max-w-xl mx-auto">Discover clean silhouettes, functional designs, and premium organic fabrics tailored for the modern closet.</p>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto px-6 mb-8 flex justify-center">
          <div className="inline-flex bg-white/[0.02] p-1.5 rounded-2xl gap-1 border border-white/5 backdrop-blur-md">
            {(['all', 'men', 'women', 'children'] as const).map((category) => (
              <button key={category} onClick={() => setSelectedCategory(category)} className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${selectedCategory === category ? 'bg-volt text-ink shadow-sm font-extrabold' : 'text-ash hover:text-bone hover:bg-white/[0.04]'}`}>
                {category === 'all' ? 'All Products' : category}
              </button>
            ))}
          </div>
        </div>

        <FilterBar filters={filters} setFilters={setFilters} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} totalResults={filteredProducts.length} />

        <div className="max-w-7xl mx-auto px-6">
          {isLoadingProducts ? <div className="text-center py-20 text-ash text-sm">Loading products…</div> : productsError ? <div className="text-center py-20 text-rose-400 text-sm">{productsError}</div> : (
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onQuickView={setDetailProduct} onAddToCart={addToCart} />)}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center py-20 px-6 max-w-md mx-auto">
                  <div className="h-16 w-16 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center text-ash mb-6"><ShoppingBag className="w-7 h-7 stroke-[1.5]" /></div>
                  <h3 className="text-lg font-bold text-bone mb-2">No Products Found</h3>
                  <p className="text-sm text-ash leading-relaxed mb-6">Try adjusting your keyword search or resetting active filters.</p>
                  <button onClick={resetFilters} className="px-5 py-3 rounded-xl bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all cursor-pointer">Clear All Filters</button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      <Footer />
      <AnimatePresence>
        {detailProduct && <ProductDetailView product={detailProduct} onClose={() => setDetailProduct(null)} onAddToCart={addToCart} />}
      </AnimatePresence>
    </div>
  );
}
