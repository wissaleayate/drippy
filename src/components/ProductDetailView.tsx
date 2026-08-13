import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  BadgeCheck,
  Heart,
} from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import type { Translations } from '../context/LanguageContext';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  product_uuid: string;
  username: string;
  rating: number;
  fit: 'True to Size' | 'Runs Small' | 'Runs Large';
  comment: string;
  created_at: string;
  verified_purchase?: boolean;
  images?: string[];
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

const FIT_LABEL_MAP: Record<string, 'pdv_true_to_size' | 'pdv_runs_small' | 'pdv_runs_large'> = {
  'True to Size': 'pdv_true_to_size',
  'Runs Small': 'pdv_runs_small',
  'Runs Large': 'pdv_runs_large',
}

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
  const { user, toggleWishlist, isInWishlist } = useAuth();
  const { t, isRTL } = useLang();

  const [isVerifiedBuyer, setIsVerifiedBuyer] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);

  useEffect(() => {
    if (!user || !product) {
      setIsVerifiedBuyer(false);
      setCheckingPurchase(false);
      return;
    }
    setCheckingPurchase(true);
    fetch(`http://127.0.0.1:5000/users/${user.id}/purchases`)
      .then((res) => res.json())
      .then((purchasedUuids: string[]) => {
        setIsVerifiedBuyer(purchasedUuids.includes(product.id));
      })
      .catch((err) => {
        console.error('Failed to check purchase history:', err);
        setIsVerifiedBuyer(false);
      })
      .finally(() => setCheckingPurchase(false));
  }, [user, product]);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newFit, setNewFit] = useState<Review['fit']>('True to Size');
  const [newComment, setNewComment] = useState('');
  const [reviewPhotos, setReviewPhotos] = useState<File[]>([]);
  const [reviewPhotoPreviews, setReviewPhotoPreviews] = useState<string[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');
  const reviewFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!product) return;
    setIsLoadingReviews(true);
    fetch(`http://127.0.0.1:5000/reviews/product/${product.id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error('Failed to load reviews:', err))
      .finally(() => setIsLoadingReviews(false));
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const storageKey = 'drippy_recently_viewed';
    try {
      const existing: string[] = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
      const withoutCurrent = existing.filter((id) => id !== product.id);
      const updated = [product.id, ...withoutCurrent].slice(0, 10);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  }, [product]);

  if (!product) return null;

  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
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
    if (!selectedSize) { setErrorMsg(t.pdv_select_size_err); return; }
    setErrorMsg('');
    onAddToCart(product, selectedSize);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2200);
  };

  const handleReviewPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setReviewPhotos((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setReviewPhotoPreviews((p) => [...p, ev.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeReviewPhoto = (index: number) => {
    setReviewPhotos((prev) => prev.filter((_, i) => i !== index));
    setReviewPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setReviewMsg(t.pdv_share_experience);
      return;
    }
    if (!user) return;

    setIsSubmittingReview(true);
    setReviewMsg('');

    const formData = new FormData();
    formData.append('product_uuid', product.id);
    formData.append('username', user.name ?? 'Anonymous');
    formData.append('rating', String(newRating));
    formData.append('fit', newFit);
    formData.append('comment', newComment);
    formData.append('user_id', user.id);
    reviewPhotos.forEach((file) => formData.append('images', file));

    try {
      const res = await fetch('http://127.0.0.1:5000/reviews', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded ${res.status}`);
      }
      const created: Review = await res.json();
      setReviews((prev) => [created, ...prev]);
      setNewComment('');
      setNewRating(5);
      setNewFit('True to Size');
      setReviewPhotos([]);
      setReviewPhotoPreviews([]);
      setReviewMsg(t.pdv_review_posted);
      setTimeout(() => setReviewMsg(''), 3000);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setReviewMsg(err instanceof Error ? err.message : t.pdv_review_error);
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
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
        >
          {/* Close */}
          <button
            onClick={onClose}
            aria-label={t.cart_close}
            className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-4 z-30 h-10 w-10 flex items-center justify-center rounded-full bg-white/[0.02] border border-white/5 text-ash hover:text-bone shadow-md hover:scale-105 transition-all cursor-pointer`}
          >
            <X className="w-5 h-5" aria-hidden="true" />
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
                  <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} bg-rose-650 text-white font-black px-3 py-1 rounded-full text-xs tracking-wider shadow`}>
                    {t.pdv_save} {Math.round(product.originalPrice - product.price)} DA
                  </div>
                )}

                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImg((i) => (i - 1 + gallery.length) % gallery.length)}
                      aria-label={t.pdv_prev_image}
                      className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-white/[0.02] border border-white/5 text-bone shadow hover:scale-105 transition-all cursor-pointer`}
                    >
                      {isRTL ? <ChevronRight className="w-4 h-4" aria-hidden="true" /> : <ChevronLeft className="w-4 h-4" aria-hidden="true" />}
                    </button>
                    <button
                      onClick={() => setActiveImg((i) => (i + 1) % gallery.length)}
                      aria-label={t.pdv_next_image}
                      className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-white/[0.02] border border-white/5 text-bone shadow hover:scale-105 transition-all cursor-pointer`}
                    >
                      {isRTL ? <ChevronLeft className="w-4 h-4" aria-hidden="true" /> : <ChevronRight className="w-4 h-4" aria-hidden="true" />}
                    </button>
                  </>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto scrollbar-none">
                  {gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      aria-label={`${t.pdv_image} ${i + 1}`}
                      aria-pressed={activeImg === i}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImg === i ? 'border-volt scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-90'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${i + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="md:w-[48%] p-7 md:p-9 flex flex-col overflow-y-auto max-h-[90vh] md:max-h-none">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-volt bg-volt/10 px-2.5 py-1 rounded-lg uppercase tracking-wider font-mono">
                  {product.brand}
                </span>
                <span className="text-xs font-semibold text-ash capitalize">{t.pdv_for} {product.category}</span>
              </div>

              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-[22px] font-bold text-bone tracking-tight leading-snug">
                  {product.name}
                </h2>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (!user) {
                        toast.error('Please log in to save items to your wishlist.');
                        return;
                      }
                      const wasSaved = isInWishlist(product.id);
                      toggleWishlist(product.id);
                      toast.success(wasSaved ? 'Removed from wishlist' : 'Saved to wishlist');
                    }}
                    aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                    className="p-2 rounded-xl border border-white/10 bg-white/[0.02] text-ash hover:text-bone hover:border-white/20 transition-all duration-200 cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} aria-hidden="true" />
                  </button>

                  <button
                    onClick={handleShare}
                    aria-label={t.pdv_share}
                    className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-mono font-bold ${
                      copied
                        ? 'bg-volt/10 border-volt/30 text-volt'
                        : 'bg-white/[0.02] border-white/10 text-ash hover:text-bone hover:border-white/20'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>{t.pdv_copied}</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{t.pdv_share}</span>
                        </>
                      )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Stars rating={avgRating} size={16} />
                <span className="text-sm font-bold text-bone">{avgRating.toFixed(1)}</span>
                <span className="text-white/10">|</span>
                <span className="text-xs text-ash">{reviews.length} {t.pdv_reviews}</span>
              </div>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl font-black text-bone font-mono">{product.price.toLocaleString()} DA</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-ash line-through font-mono">{product.originalPrice.toLocaleString()} DA</span>
                )}
                <span className={`text-xs font-bold ml-1 ${product.inStock ? 'text-emerald-450' : 'text-rose-455'}`}>
                  {product.inStock ? t.pdv_in_stock : t.pdv_out_of_stock}
                </span>
              </div>

              <p className="text-sm text-ash leading-relaxed mb-6 border-b border-white/5 pb-6">
                {product.description}
              </p>

              {/* ── Fit Summary ─────────────────────────── */}
              <div className="mb-6">
                <p className="text-xs font-bold text-ash uppercase tracking-wider mb-3 font-mono">{t.pdv_fit_summary}</p>
                {reviews.length === 0 ? (
                  <p className="text-xs text-ash">{t.pdv_fit_no_feedback}</p>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {fitSummary.map(({ label, pct }) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-bone w-28 shrink-0">
                          {FIT_LABEL_MAP[label] ? t[FIT_LABEL_MAP[label]] : label}
                        </span>
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
                  <span className="text-xs font-bold text-bone uppercase tracking-wider">{t.pdv_select_size}</span>
                  <span className="text-xs text-ash">{t.pdv_standard_fit}</span>
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
                    <><Check className="w-5 h-5 stroke-[2.5]" /><span>{t.pdv_added}</span></>
                  ) : (
                    <><ShoppingCart className="w-4 h-4" /><span>{product.inStock ? t.pdv_add_to_bag : t.pdv_out_of_stock}</span></>
                  )}
              </button>

              <div className="grid grid-cols-3 gap-2 text-[10px] text-ash font-semibold tracking-wide uppercase text-center border-t border-white/5 pt-4">
                <div className="flex flex-col items-center gap-1"><Truck className="w-4 h-4 text-volt" /><span>{t.pdv_free_shipping}</span></div>
                <div className="flex flex-col items-center gap-1"><RefreshCw className="w-4 h-4 text-volt" /><span>{t.pdv_returns}</span></div>
                <div className="flex flex-col items-center gap-1"><ShieldCheck className="w-4 h-4 text-volt" /><span>{t.pdv_secure_pay}</span></div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM: Reviews ─────────────────────────────────────────── */}
          <div className="border-t border-white/5 px-6 md:px-10 py-10 bg-zinc-950/40">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-bone tracking-tight">{t.pdv_customer_reviews}</h3>
                <p className="text-xs text-ash mt-0.5">{reviews.length} {t.pdv_reviews_for}</p>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-2.5 shadow-xs">
                <Stars rating={avgRating} size={14} />
                <span className="text-sm font-black text-bone">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-ash">/ 5</span>
              </div>
            </div>

            {/* ── Write a Review Form (with photo upload merged in) ────── */}
            <div className="mb-8 p-6 bg-white/[0.01] border border-white/5 rounded-2xl">
              <h4 className="text-sm font-bold text-bone mb-4">{t.pdv_write_review}</h4>
              {!user ? (
                <p className="text-xs text-ash">
                  {t.pdv_login_to_review} <Link to="/login" className="text-volt underline">{t.pdv_login}</Link> {t.pdv_to_review_suffix}
                </p>
              ) : checkingPurchase ? (
                <p className="text-xs text-ash">Checking your purchase history…</p>
              ) : !isVerifiedBuyer ? (
                <div className="flex items-center gap-2.5 py-3 px-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-ash shrink-0" />
                  <p className="text-xs text-ash">
                    {t.pdv_verified_only}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-ash uppercase tracking-wider">{t.pdv_your_rating}</span>
                    <div className="flex items-center gap-1" role="group" aria-label={t.pdv_your_rating}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          type="button"
                          key={n}
                          onClick={() => setNewRating(n)}
                          aria-label={`${n} ${t.pdv_stars}`}
                          aria-pressed={n <= newRating}
                          className="cursor-pointer tap-target"
                        >
                          <Star className={`w-5 h-5 ${n <= newRating ? 'fill-volt text-volt' : 'text-white/10 fill-white/10'}`} aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-ash uppercase tracking-wider">{t.pdv_how_fit}</span>
                    <div className="flex flex-wrap gap-2">
                      {(['True to Size', 'Runs Small', 'Runs Large'] as const).map((f) => (
                        <button
                          type="button"
                          key={f}
                          onClick={() => setNewFit(f)}
                          className={`tap-target px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            newFit === f
                              ? 'bg-volt border-volt text-ink font-bold'
                              : 'bg-white/[0.02] border-white/5 text-bone hover:border-white/10'
                          }`}
                        >
                          {FIT_LABEL_MAP[f] ? t[FIT_LABEL_MAP[f]] : f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t.pdv_share_experience}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
                  />

                  {/* Photo upload, merged into the review form */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-ash uppercase tracking-wider">Add Photos (optional)</span>
                    <button
                      type="button"
                      onClick={() => reviewFileInputRef.current?.click()}
                      className="self-start inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 text-bone text-xs font-mono font-bold rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Choose Photos
                    </button>
                    <input
                      ref={reviewFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleReviewPhotoSelect}
                    />
                    {reviewPhotoPreviews.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-1">
                        {reviewPhotoPreviews.map((src, i) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-zinc group">
                            <img src={src} alt={`review-upload-${i}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeReviewPhoto(i)}
                              className="absolute top-1 right-1 h-5 w-5 rounded-full bg-ink/80 text-bone flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              aria-label="Remove photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {reviewMsg && <p className="text-xs font-semibold text-volt">{reviewMsg}</p>}

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="self-start tap-target px-5 py-2.5 bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider rounded-xl hover:bg-bone transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingReview ? t.pdv_posting : t.pdv_post_review}
                  </button>
                </form>
              )}
            </div>

            {/* Review Cards */}
            {isLoadingReviews ? (
              <p className="text-sm text-ash">{t.pdv_loading_reviews}</p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-ash">{t.pdv_no_reviews}</p>
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

                    {review.images && review.images.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-4">
                        {review.images.map((img, idx) => (
                          <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-zinc border border-white/5">
                            <img
                              src={img}
                              alt={`Review photo ${idx + 1}`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${FIT_COLORS[review.fit]}`}>
                        {FIT_LABEL_MAP[review.fit] ? t[FIT_LABEL_MAP[review.fit] as keyof Translations] as string : review.fit}
                      </span>
                      {review.verified_purchase && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          <BadgeCheck className="w-3 h-3" />
                          {t.pdv_verified_purchase}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
