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
import { useLang } from '../../context/LanguageContext';

type ApiProduct = {
  uuid: string;
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

  const gallery = (raw as any).gallery && (raw as any).gallery.length > 0 ? (raw as any).gallery : [image];
  return {
    id: raw.uuid,
    name: raw.name,
    brand: raw.brand,
    category,
    price: raw.price,
    image: image.startsWith('http') || image.startsWith('/') ? image : `/images/${image}`,
    gallery,
    inStock: (raw.stock ?? 1) > 0,
    stock: raw.stock ?? 0,
    description: raw.description ?? '',
    sizes: raw.sizes ?? ['S', 'M', 'L'],
    featured: raw.featured ?? false,
    rating: raw.rating ?? 0,
    reviewsCount: raw.reviewsCount ?? 0,
  };
}

export default function ProductsPage() {
  const { t } = useLang();
  const [searchParams] = useSearchParams();
  const requestedCategory = searchParams.get('category');
  const requestedSearch = searchParams.get('search') ?? '';
  const requestedDepartment = searchParams.get('department');
  const requestedOpenUuid = searchParams.get('open');
  const urlCategory: Category =
    requestedCategory === 'men' || requestedCategory === 'women' || requestedCategory === 'children'
      ? requestedCategory
      : 'all';
  const [selectedCategory, setSelectedCategory] = useState<Category>(urlCategory);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: requestedSearch,
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
    setFilters((prev) => ({
      ...prev,
      department: requestedDepartment ?? 'all',
    }));
  }, [urlCategory, requestedDepartment]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchQuery: requestedSearch }));
  }, [requestedSearch]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/products')
      .then((response) => {
        if (!response.ok) throw new Error(`Server responded ${response.status}`);
        return response.json() as Promise<ApiProduct[]>;
      })
      .then((data) => {
        const normalized = data.map(normalizeProduct);
        setProducts(normalized);
        if (requestedOpenUuid) {
          const match = normalized.find((p) => p.id === requestedOpenUuid);
          if (match) setDetailProduct(match);
        }
      })
      .finally(() => setIsLoadingProducts(false));
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;

        // Department filter from URL (sneakers / clothes / accessories)
        if (filters.department && filters.department !== 'all') {
          if (!product.name.toLowerCase().includes(filters.department) &&
              !product.description.toLowerCase().includes(filters.department) &&
              !(product as unknown as Record<string, unknown>).department?.toString().toLowerCase().includes(filters.department) &&
              product.brand.toLowerCase() !== filters.department) {
            // fall back to category-name matching for sneakers → shoes
            const deptMap: Record<string, string[]> = {
              sneakers: ['sneaker', 'shoe', 'kick', 'trainer', 'boot'],
              clothes: ['cloth', 'shirt', 'pant', 'jacket', 'hoodie', 'top', 'dress', 'wear'],
              accessories: ['accessory', 'accessories', 'bag', 'cap', 'hat', 'belt', 'watch', 'socks'],
            };
            const keywords = deptMap[filters.department] ?? [filters.department];
            const productText = `${product.name} ${product.description} ${product.brand}`.toLowerCase();
            if (!keywords.some((kw) => productText.includes(kw))) return false;
          }
        }

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
    setFilters({ searchQuery: '', brand: 'All', maxPrice: 50000, size: 'All', sortBy: 'featured', department: 'all' });
    setSelectedCategory('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-ink text-bone" id="app-root-container">
      <Nav />

      <div className="sticky top-14 z-20 backdrop-blur-md dr-border border-b" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-10 flex items-center justify-between">
          <div className="hidden lg:flex items-center gap-5 text-xs font-semibold text-ash">
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-volt" />{t.pp_free_shipping}</span>
            <span>•</span>
            <span>{t.pp_est_delivery}</span>
          </div>
          <button onClick={openCart} className="relative flex items-center justify-center h-8 px-3 rounded-xl border border-white/5 hover:border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer ml-auto">
            <ShoppingBag className="w-3.5 h-3.5 text-bone" />
            <span className="text-xs font-semibold text-bone ml-1.5 hidden sm:inline">{t.pp_bag}</span>
            {cartItemCount > 0 && <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-volt text-[9px] font-black text-ink shadow-md animate-bounce">{cartItemCount}</span>}
          </button>
        </div>
      </div>

      <main className="flex-grow pb-20 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-6 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-bone font-display tracking-tight uppercase mb-3">{t.pp_heading}</h2>
            <p className="text-sm text-ash font-medium max-w-xl mx-auto">{t.pp_subheading}</p>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-6 flex justify-center overflow-x-auto">
          <div className="inline-flex bg-white/[0.02] p-1 rounded-xl gap-0.5 border border-white/5 backdrop-blur-md whitespace-nowrap">
            {(['all', 'men', 'women', 'children'] as const).map((category) => (
              <button key={category} onClick={() => setSelectedCategory(category)} className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${selectedCategory === category ? 'bg-volt text-ink shadow-sm font-extrabold' : 'text-ash hover:text-bone hover:bg-white/[0.04]'}`}>
                {category === 'all' ? t.pp_all : category === 'men' ? t.pp_men : category === 'women' ? t.pp_women : t.pp_children}
              </button>
            ))}
          </div>
        </div>

        <FilterBar filters={filters} setFilters={setFilters} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} totalResults={filteredProducts.length} products={products} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {isLoadingProducts ? <div className="text-center py-16 text-ash text-sm">{t.pp_loading}</div> : productsError ? <div className="text-center py-16 text-rose-400 text-sm">{t.pp_error}</div> : (
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-8">
                  {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onQuickView={setDetailProduct} onAddToCart={addToCart} />)}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center py-16 px-4 sm:px-6 max-w-md mx-auto">
                  <div className="h-14 w-14 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center text-ash mb-5"><ShoppingBag className="w-6 h-6 stroke-[1.5]" /></div>
                  <h3 className="text-base font-bold text-bone mb-2">{t.pp_no_products}</h3>
                  <p className="text-sm text-ash leading-relaxed mb-5">{t.pp_no_products_sub}</p>
                  <button onClick={resetFilters} className="px-4 py-2.5 rounded-xl bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all cursor-pointer">{t.pp_clear_filters}</button>
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
