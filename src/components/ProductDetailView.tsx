import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  X,
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Camera,
  ThumbsUp,
} from 'lucide-react';
import { Product } from '../types';

// ─── Mock review data generator ──────────────────────────────────────────────
interface ReviewPhoto {
  url: string;
  alt: string;
}

interface Review {
  id: string;
  avatar: string;
  name: string;
  rating: number;
  text: string;
  size: string;
  fit: 'True to Size' | 'Runs Small' | 'Runs Large';
  date: string;
  verified: boolean;
  photos: ReviewPhoto[];
  helpful: number;
}

const FIT_COLORS: Record<Review['fit'], string> = {
  'True to Size': 'bg-volt/10 text-volt border-volt/25',
  'Runs Small': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Runs Large': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
};

// Deterministic mock reviews per product
function buildReviews(product: Product): Review[] {
  const pool: Review[] = [
    {
      id: 'r1',
      avatar: 'https://i.pravatar.cc/48?img=1',
      name: 'Sophie M.',
      rating: 5,
      text: `Absolutely love this piece! The fabric feels premium and the fit is exactly as described. I wear a size M normally and the M fits perfectly. Would 100% recommend to anyone looking for quality.`,
      size: product.sizes[1] ?? product.sizes[0],
      fit: 'True to Size',
      date: 'Jan 14, 2025',
      verified: true,
      photos: [
        { url: product.image, alt: 'Customer photo 1' },
        { url: `https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=70`, alt: 'Customer photo 2' },
      ],
      helpful: 34,
    },
    {
      id: 'r2',
      avatar: 'https://i.pravatar.cc/48?img=5',
      name: 'James K.',
      rating: 4,
      text: `Great quality overall. Stitching is clean and the material holds up well after multiple washes. Slightly smaller than expected — I'd recommend sizing up if you're between sizes.`,
      size: product.sizes[0],
      fit: 'Runs Small',
      date: 'Feb 3, 2025',
      verified: true,
      photos: [],
      helpful: 18,
    },
    {
      id: 'r3',
      avatar: 'https://i.pravatar.cc/48?img=12',
      name: 'Aiko T.',
      rating: 5,
      text: `This exceeded my expectations! The colour matches the photos perfectly and the sizing is spot on. Fast delivery too. My third purchase from this brand and they never disappoint.`,
      size: product.sizes[Math.min(2, product.sizes.length - 1)],
      fit: 'True to Size',
      date: 'Mar 21, 2025',
      verified: true,
      photos: [
        { url: `https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=70`, alt: 'Customer photo' },
      ],
      helpful: 52,
    },
    {
      id: 'r4',
      avatar: 'https://i.pravatar.cc/48?img=20',
      name: 'Marcus D.',
      rating: 3,
      text: `Decent product but runs a bit large on me. I ordered my usual size and it felt quite roomy. Still a nice buy for the price, just order a size down if you prefer a slim fit.`,
      size: product.sizes[product.sizes.length - 1],
      fit: 'Runs Large',
      date: 'Apr 7, 2025',
      verified: false,
      photos: [],
      helpful: 9,
    },
    {
      id: 'r5',
      avatar: 'https://i.pravatar.cc/48?img=33',
      name: 'Priya R.',
      rating: 5,
      text: `Perfect! I bought this as a gift and the recipient absolutely loved it. The packaging was beautiful and the product quality is impressive for the price point. Will be back!`,
      size: product.sizes[1] ?? product.sizes[0],
      fit: 'True to Size',
      date: 'May 2, 2025',
      verified: true,
      photos: [
        { url: product.image, alt: 'Gift unboxing' },
        { url: `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=70`, alt: 'Detail shot' },
        { url: `https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=400&q=70`, alt: 'Styled photo' },
      ],
      helpful: 41,
    },
  ];
  return pool;
}

function buildFitSummary(reviews: Review[]) {
  const total = reviews.length;
  const counts = { 'True to Size': 0, 'Runs Small': 0, 'Runs Large': 0 };
  reviews.forEach((r) => counts[r.fit]++);
  return [
    { label: 'True to Size', pct: Math.round((counts['True to Size'] / total) * 100) },
    { label: 'Runs Small', pct: Math.round((counts['Runs Small'] / total) * 100) },
    { label: 'Runs Large', pct: Math.round((counts['Runs Large'] / total) * 100) },
  ];
}

// Extra gallery images per product (unsplash lifestyle shots)
const EXTRA_GALLERY = [
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
];

// ─── Star renderer ────────────────────────────────────────────────────────────
function Stars({ rating, size = 4 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={`${i <= Math.floor(rating) ? 'fill-volt text-volt' : i - 0.5 <= rating ? 'fill-volt/50 text-volt/50' : 'text-white/10 fill-white/10'}`}
        />
      ))}
    </span>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface ProductDetailViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize: string) => void;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProductDetailView({ product, onClose, onAddToCart }: ProductDetailViewProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!product) return null;

  const gallery = [product.image, ...EXTRA_GALLERY];
  const reviews = buildReviews(product);
  const fitSummary = buildFitSummary(reviews);
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  const handleAdd = () => {
    if (!selectedSize) { setErrorMsg('Please select a size first'); return; }
    setErrorMsg('');
    onAddToCart(product, selectedSize);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setUploadedPhotos((p) => [...p, ev.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="product-detail-modal">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-ink/80 backdrop-blur-sm"
      />

      {/* Sheet */}
      <div className="flex min-h-full items-start justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-5xl bg-zinc border border-white/10 rounded-3xl shadow-2xl overflow-hidden mt-4 mb-12 text-bone"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-30 h-10 w-10 flex items-center justify-center rounded-full bg-white/[0.02] border border-white/5 text-ash hover:text-bone shadow-md hover:scale-105 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ── TOP: Gallery + Info ─────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row">

            {/* Gallery */}
            <div className="md:w-[52%] flex flex-col bg-zinc-950/20">
              {/* Main image */}
              <div className="relative aspect-[4/4.5] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImg}
                    src={gallery[activeImg]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover object-center"
                  />
                </AnimatePresence>

                {/* Discount badge */}
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="absolute top-4 left-4 bg-rose-650 text-white font-black px-3 py-1 rounded-full text-xs tracking-wider shadow">
                    SAVE ${Math.round(product.originalPrice - product.price)}
                  </div>
                )}

                {/* Prev/Next arrows */}
                <button
                  onClick={() => setActiveImg((i) => (i - 1 + gallery.length) % gallery.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-white/[0.02] border border-white/5 text-bone shadow hover:scale-105 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveImg((i) => (i + 1) % gallery.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-white/[0.02] border border-white/5 text-bone shadow hover:scale-105 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 p-3 overflow-x-auto scrollbar-none">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImg === i ? 'border-volt scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-90'
                    }`}
                  >
                    <img src={img} alt={`thumb-${i}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-[48%] p-7 md:p-9 flex flex-col overflow-y-auto max-h-[90vh] md:max-h-none">
              {/* Brand + category */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-volt bg-volt/10 px-2.5 py-1 rounded-lg uppercase tracking-wider font-mono">
                  {product.brand}
                </span>
                <span className="text-xs font-medium text-ash capitalize">for {product.category}</span>
              </div>

              {/* Title */}
              <h2 className="text-[22px] font-bold text-bone tracking-tight leading-snug mb-3">
                {product.name}
              </h2>

              {/* Rating bar */}
              <div className="flex items-center gap-2 mb-4">
                <Stars rating={avgRating} size={16} />
                <span className="text-sm font-bold text-bone">{avgRating.toFixed(1)}</span>
                <span className="text-white/10">|</span>
                <span className="text-xs text-ash">{product.reviewsCount} reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl font-black text-bone font-mono">${product.price.toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-ash line-through font-mono">${product.originalPrice.toFixed(2)}</span>
                )}
                <span className={`text-xs font-bold ml-1 ${product.inStock ? 'text-emerald-450' : 'text-rose-455'}`}>
                  {product.inStock ? '✓ In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-ash leading-relaxed mb-6 border-b border-white/5 pb-6">
                {product.description}
              </p>

              {/* ── Fit Summary ─────────────────────────────────────────── */}
              <div className="mb-6">
                <p className="text-xs font-bold text-ash uppercase tracking-wider mb-3 font-mono">Customer Fit Summary</p>
                <div className="flex flex-col gap-2.5">
                  {fitSummary.map(({ label, pct }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-bone w-28 shrink-0">{label}</span>
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                          className={`h-full rounded-full ${
                            label === 'True to Size' ? 'bg-volt' :
                            label === 'Runs Small' ? 'bg-amber-500' : 'bg-sky-500'
                          }`}
                        />
                      </div>
                      <span className="text-xs font-bold text-bone w-9 text-right font-mono">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-bone uppercase tracking-wider">Select Size</span>
                  <span className="text-xs text-ash">Standard fit</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSelectedSize(s); setErrorMsg(''); }}
                      className={`h-10 min-w-[42px] px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-volt border-volt text-ink shadow-md font-bold'
                          : 'bg-white/[0.02] border-white/5 text-bone hover:border-volt/30 hover:bg-volt/5'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {errorMsg && <p className="text-rose-455 text-xs font-bold mt-2">{errorMsg}</p>}
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-bold shadow-md transition-all cursor-pointer mb-4 font-mono uppercase text-xs tracking-wider ${
                  !product.inStock
                    ? 'bg-zinc-800 border border-white/5 text-ash cursor-not-allowed'
                    : successMsg
                    ? 'bg-emerald-650 text-white shadow-emerald-500/10'
                    : 'bg-volt text-ink hover:bg-bone shadow-volt/10'
                }`}
              >
                {successMsg ? (
                  <><Check className="w-5 h-5 stroke-[2.5]" /><span>Added to Bag!</span></>
                ) : (
                  <><ShoppingCart className="w-4 h-4" /><span>{product.inStock ? 'Add to Shopping Bag' : 'Out of Stock'}</span></>
                )}
              </button>

              {/* Assurances */}
              <div className="grid grid-cols-3 gap-2 text-[10px] text-ash font-semibold tracking-wide uppercase text-center border-t border-white/5 pt-4">
                <div className="flex flex-col items-center gap-1"><Truck className="w-4 h-4 text-volt" /><span>Free Shipping</span></div>
                <div className="flex flex-col items-center gap-1"><RefreshCw className="w-4 h-4 text-volt" /><span>30-Day Returns</span></div>
                <div className="flex flex-col items-center gap-1"><ShieldCheck className="w-4 h-4 text-volt" /><span>Secure Pay</span></div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM: Reviews ─────────────────────────────────────────── */}
          <div className="border-t border-white/5 px-6 md:px-10 py-10 bg-zinc-950/40">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-bone tracking-tight">Customer Reviews</h3>
                <p className="text-xs text-ash mt-0.5">{reviews.length} reviews for this product</p>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-2.5 shadow-xs">
                <Stars rating={avgRating} size={14} />
                <span className="text-sm font-black text-bone">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-ash">/ 5</span>
              </div>
            </div>

            {/* Review Cards */}
            <div className="flex flex-col gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-xs"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/5"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-bone">{review.name}</span>
                          {review.verified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-volt bg-volt/10 border border-volt/20 px-2.5 py-0.5 rounded-full">
                              <BadgeCheck className="w-3 h-3" />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-ash font-mono">{review.date}</span>
                      </div>
                    </div>
                    <Stars rating={review.rating} size={14} />
                  </div>

                  {/* Review text */}
                  <p className="text-sm text-ash leading-relaxed mb-4">{review.text}</p>

                  {/* Size + Fit tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-[11px] font-semibold bg-white/[0.03] text-bone px-2.5 py-1 rounded-full">
                      Size: {review.size}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${FIT_COLORS[review.fit]}`}>
                      {review.fit}
                    </span>
                  </div>

                  {/* Review photos */}
                  {review.photos.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-4">
                      {review.photos.map((photo, idx) => (
                        <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-zinc border border-white/5">
                          <img
                            src={photo.url}
                            alt={photo.alt}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Helpful */}
                  <button className="flex items-center gap-1.5 text-[11px] text-ash hover:text-volt transition-colors font-medium cursor-pointer">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              ))}
            </div>

            {/* Upload your photos CTA */}
            <div className="mt-8 p-6 bg-white/[0.01] border-2 border-dashed border-white/10 rounded-2xl text-center">
              <Camera className="w-8 h-8 text-ash/30 mx-auto mb-2" />
              <p className="text-sm font-bold text-bone mb-1">Share your look</p>
              <p className="text-xs text-ash mb-4">Upload real photos of the product and help other shoppers!</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-volt text-ink text-xs font-mono font-bold rounded-xl hover:bg-bone transition-colors shadow-sm cursor-pointer shadow-volt/5"
              >
                <Camera className="w-3.5 h-3.5" />
                Upload Photos
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Uploaded photos preview */}
              {uploadedPhotos.length > 0 && (
                <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {uploadedPhotos.map((src, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-zinc">
                      <img src={src} alt={`upload-${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
