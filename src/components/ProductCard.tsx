import { motion } from 'motion/react';
import { Star, Eye, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useLang } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  key?: string | number;
}

export default function ProductCard({ product, onQuickView, onAddToCart }: ProductCardProps) {
  const { t } = useLang();
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group relative bg-white/[0.02] rounded-2xl border border-white/5 hover:border-volt/30 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer backdrop-blur-md focus-visible:ring-2 focus-visible:ring-volt focus-visible:outline-none"
      id={`product-card-${product.id}`}
      onClick={() => onQuickView(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-10/11 bg-[#221407] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {!product.inStock && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-ink/90 text-bone backdrop-blur-xs">
              {t.pc_sold_out}
            </span>
          )}
          {product.featured && product.inStock && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-volt text-ink backdrop-blur-xs">
              {t.pc_featured}
            </span>
          )}
          {hasDiscount && product.inStock && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-600 text-bone backdrop-blur-xs">
              -{discountPercent}% {t.pc_off}
            </span>
          )}
        </div>

        {/* Action Button Hover Overlay */}
        <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc border border-white/10 text-bone hover:text-volt hover:scale-110 active:scale-95 transition-all duration-200"
            aria-label={`View details for ${product.name}`}
            id={`quick-view-btn-${product.id}`}
          >
            <Eye className="w-4 h-4" aria-hidden="true" />
          </button>
          {product.inStock && (
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-volt text-ink hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg shadow-volt/20"
              aria-label={`Add ${product.name} to cart`}
              id={`add-to-cart-btn-${product.id}`}
            >
              <ShoppingCart className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Info Container */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Brand */}
        <div className="text-xs font-semibold text-ash tracking-wider uppercase mb-1.5 font-mono">
          {product.brand}
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-bone group-hover:text-volt transition-colors duration-200 mb-2 line-clamp-1">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4" aria-label={`${product.rating} out of 5 stars, ${product.reviewsCount} reviews`}>
          <div className="flex items-center text-volt" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating) ? 'fill-current' : 'text-white/10'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-bone" aria-hidden="true">{product.rating}</span>
          <span className="text-[11px] text-white/10" aria-hidden="true">|</span>
          <span className="text-[11px] text-ash font-medium" aria-hidden="true">{product.reviewsCount} {t.pc_reviews}</span>
        </div>

        {/* Bottom Section: Price & Size Info */}
        <div className="mt-auto pt-3 border-t border-white/5 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-ash leading-none mb-1">{t.pc_price}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-bone font-mono">{product.price.toLocaleString('fr-DZ')} DA</span>
              {hasDiscount && (
                <span className="text-xs text-ash line-through font-mono">{product.originalPrice?.toLocaleString('fr-DZ')} DA</span>
              )}
            </div>
          </div>

          {/* Sizes Tag */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-medium text-ash leading-none mb-1">{t.pc_sizes}</span>
            <div className="flex gap-1 max-w-[100px] overflow-hidden flex-wrap justify-end">
              {product.sizes.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/[0.04] text-bone border border-white/5"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
