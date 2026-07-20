import React, { useState, useRef, useEffect } from 'react';
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
  Camera,
  Share2,
} from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Review {
  id: number;
  product_uuid: string;
  username: string;
  rating: number;
  fit: 'True to Size' | 'Runs Small' | 'Runs Large';
  comment: string;
  created_at: string;
}

const FIT_COLORS: Record<Review['fit'], string> = {
  'True to Size': 'bg-volt/10 text-volt border-volt/25',
  'Runs Small': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Runs Large': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
};

function buildFitSummary(reviews: Review[]) {
  const total = reviews.length;
  const counts = { 'True to Size': 0, 'Runs Small': 0, 'Runs Large': 0 };
  reviews.forEach((r) => {
    if (r.fit in counts) counts[r.fit]++;
  });
  if (total === 0) {
    return [
      { label: 'True to Size', pct: 0 },
      { label: 'Runs Small', pct: 0 },
      { label: 'Runs Large', pct: 0 },
    ];
  }
  return [
    { label: 'True to Size', pct: Math.round((counts['True to Size'] / total) * 100) },
    { label: 'Runs Small', pct: Math.round((counts['Runs Small'] / total) * 100) },
    { label: 'Runs Large', pct: Math.round((counts['Runs Large'] / total) * 100) },
  ];
}

// Extra gallery images per product (lifestyle shots)
const EXTRA_GALLERY = [
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
];

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

interface ProductDetailViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize: string) => void;
}

export default function ProductDetailView({ product, onClose, onAddToCart }: ProductDetailViewProps) {
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newFit, setNewFit] = useState<Review['fit']>('True to Size');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    if (!product) return;
    setIsLoadingReviews(true);
    fetch(`http://127.0.0.1:5000/reviews/product/${product.id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error('Failed to load reviews:', err))
      .finally(() => setIsLoadingReviews(false));
  }, [product]);

  if (!product) return null;

  const gallery = [product.image, ...EXTRA_GALLERY];
  const fitSummary = buildFitSummary(reviews);
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleShare = () => {
    const shareUrl = `${window.location.protocol}//${window.location.host}/products/uuid/${product.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setReviewMsg('Please write a short comment.');
      return;
    }
    setIsSubmittingReview(true);
    setReviewMsg('');
    try {
      const res = await fetch('http://127.0.0.1:5000/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_uuid: product.id,
          username: user?.name ?? 'Anonymous',
          rating: newRating,
          fit: newFit,
          comment: newComment,
        }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const created: Review = await res.json();
      setReviews((prev) => [created, ...prev]);
      setNewComment('');
      setNewRating(5);
      setNewFit('True to Size');
      setReviewMsg('Thanks! Your review was posted.');
      setTimeout(() => setReviewMsg(''), 3000);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setReviewMsg('Could not submit review. Is the backend running?');
    } finally {
      setIsSubmittingReview(false);
    }
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

                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="absolute top-4 left-4 bg-rose-650 text-white font-black px-3 py-1 rounded-full text-xs tracking-wider shadow">
                    SAVE ${Math.round(product.originalPrice - product.price)}
                  </div>
                )}

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
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-volt bg-volt/10 px-2.5 py-1 rounded-lg uppercase tracking-wider font-mono">
                  {product.brand}
                </span>
                <span className="text-xs font-semibold text-ash capitalize">for {product.category}</span>
              </div>

              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-[22px] font-bold text-bone tracking-tight leading-snug">
                  {product.name}
                </h2>

                <button
                  onClick={handleShare}
                  className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-mono font-bold shrink-0 ${
                    copied
                      ? 'bg-volt/10 border-volt/30 text-volt'
                      : 'bg-white/[0.02] border-white/10 text-ash hover:text-bone hover:border-white/20'
                  }`}
                  title="Copy product link"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>SHARE</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Stars rating={avgRating} size={16} />
                <span className="text-sm font-bold text-bone">{avgRating.toFixed(1)}</span>
                <span className="text-white/10">|</span>
                <span className="text-xs text-ash">{reviews.length} reviews</span>
              </div>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl font-black text-bone font-mono">${product.price.toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-ash line-through font-mono">${product.originalPrice.toFixed(2)}</span>
                )}
                <span className={`text-xs font-bold ml-1 ${product.inStock ? 'text-emerald-450' : 'text-rose-455'}`}>
                  {product.inStock ? '✓ In Stock' : 'Out of Stock'}
                </span>
              </div>

              <p className="text-sm text-ash leading-relaxed mb-6 border-b border-white/5 pb-6">
                {product.description}
              </p>

              {/* ── Fit Summary (now real data) ─────────────────────────── */}
              <div className="mb-6">
                <p className="text-xs font-bold text-ash uppercase tracking-wider mb-3 font-mono">Customer Fit Summary</p>
                {reviews.length === 0 ? (
                  <p className="text-xs text-ash">No fit feedback yet. Be the first to leave a review below.</p>
                ) : (
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
                )}
              </div>

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
                {errorMsg && (
                  <p className="text-rose-455 text-xs font-bold mt-2">{errorMsg}</p>
                )}
              </div>

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

              <div className="grid grid-cols-3 gap-2 text-[10px] text-ash font-semibold tracking-wide uppercase text-center border-t border-white/5 pt-4">
                <div className="flex flex-col items-center gap-1"><Truck className="w-4 h-4 text-volt" /><span>Free Shipping</span></div>
                <div className="flex flex-col items-center gap-1"><RefreshCw className="w-4 h-4 text-volt" /><span>30-Day Returns</span></div>
                <div className="flex flex-col items-center gap-1"><ShieldCheck className="w-4 h-4 text-volt" /><span>Secure Pay</span></div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM: Reviews ─────────────────────────────────────────── */}
          <div className="border-t border-white/5 px-6 md:px-10 py-10 bg-zinc-950/40">
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

            {/* ── Write a Review Form ─────────────────────────────────── */}
            <div className="mb-8 p-6 bg-white/[0.01] border border-white/5 rounded-2xl">
              <h4 className="text-sm font-bold text-bone mb-4">Write a Review</h4>
              {!user ? (
                <p className="text-xs text-ash">
                  Please <Link to="/login" className="text-volt underline">log in</Link> to leave a review.
                </p>
              ) : (
                <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-ash uppercase tracking-wider">Your Rating</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          type="button"
                          key={n}
                          onClick={() => setNewRating(n)}
                          className="cursor-pointer"
                        >
                          <Star className={`w-5 h-5 ${n <= newRating ? 'fill-volt text-volt' : 'text-white/10 fill-white/10'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-ash uppercase tracking-wider">How did it fit?</span>
                    <div className="flex flex-wrap gap-2">
                      {(['True to Size', 'Runs Small', 'Runs Large'] as const).map((f) => (
                        <button
                          type="button"
                          key={f}
                          onClick={() => setNewFit(f)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            newFit === f
                              ? 'bg-volt border-volt text-ink font-bold'
                              : 'bg-white/[0.02] border-white/5 text-bone hover:border-white/10'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
                  />

                  {reviewMsg && <p className="text-xs font-semibold text-volt">{reviewMsg}</p>}

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="self-start px-5 py-2.5 bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider rounded-xl hover:bg-bone transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Posting...' : 'Post Review'}
                  </button>
                </form>
              )}
            </div>

            {/* Review Cards */}
            {isLoadingReviews ? (
              <p className="text-sm text-ash">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-ash">No reviews yet for this product. Be the first to share your experience!</p>
            ) : (
              <div className="flex flex-col gap-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-volt/10 text-volt font-black text-sm border-2 border-white/5">
                          {review.username.slice(0, 1).toUpperCase()}
                        </span>
                        <div>
                          <span className="text-sm font-bold text-bone block">{review.username}</span>
                          <span className="text-[11px] text-ash font-mono">{review.created_at}</span>
                        </div>
                      </div>
                      <Stars rating={review.rating} size={14} />
                    </div>

                    <p className="text-sm text-ash leading-relaxed mb-4">{review.comment}</p>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${FIT_COLORS[review.fit]}`}>
                        {review.fit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
