import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, X, ShoppingCart, Check, ShieldCheck, Truck, RefreshCw, Share2 } from 'lucide-react';
import { Product } from '../types';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize: string) => void;
}

export default function ProductQuickView({ product, onClose, onAddToCart }: ProductQuickViewProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<string>('');

  if (!product) return null;

  const gallery: string[] = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const mainImage = activeImage || gallery[0] || product.image;
  const stock = product.stock ?? 0;

  const handleShare = () => {
    const productUrl = `${window.location.origin}/products/uuid/${product.id}`;
    navigator.clipboard.writeText(productUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleAdd = () => {
    if (!selectedSize) {
      setErrorMsg('Please select a size first');
      return;
    }
    setErrorMsg('');
    onAddToCart(product, selectedSize);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="quick-view-modal">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Center content wrapper */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-4xl flex flex-col md:flex-row"
          id={`quick-view-content-${product.id}`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-500 shadow-md hover:text-gray-800 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            id="close-quick-view-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Product Image with discount overlay + gallery thumbnails */}
          <div className="relative w-full md:w-1/2 bg-gray-50 flex flex-col">
            <div className="relative aspect-10/11 md:aspect-auto md:flex-1">
              <img
                src={mainImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-5 left-5 bg-red-500 text-white font-black px-3 py-1.5 rounded-full text-xs tracking-wider uppercase shadow-md">
                  SAVE {Math.round(product.originalPrice - product.price).toLocaleString()} DA
                </div>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      mainImage === img ? 'border-indigo-600' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Product Details */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
            <div>
              {/* Brand and Category */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="text-xs font-semibold text-gray-400 capitalize">
                  for {product.category}
                </span>
              </div>

              {/* Title & Share Row */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {product.name}
                </h2>

                {/* SHARE BUTTON */}
                <button
                  onClick={handleShare}
                  className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold ${
                    copied
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                  title="Copy share link"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-2xl font-black text-gray-950">{product.price.toLocaleString()} DA</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through font-medium">
                    {product.originalPrice.toLocaleString()} DA
                  </span>
                )}
                <span className={`text-xs font-bold ml-1 ${!product.inStock ? 'text-rose-600' : stock <= 5 ? 'text-amber-500' : 'text-emerald-600'}`}>
                  {!product.inStock
                    ? 'Temporarily Out of Stock'
                    : stock <= 5
                    ? `Only ${stock} left in stock`
                    : 'In Stock & Ready to Ship'}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-100">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-800">{product.rating}</span>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-500 font-medium">{product.reviewsCount} verified customer reviews</span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Select Size Option */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Select Size
                  </span>
                  <span className="text-xs font-medium text-gray-400">
                    Standard fit
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedSize(s);
                        setErrorMsg('');
                      }}
                      className={`h-11 min-w-[44px] px-3.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-center ${
                        selectedSize === s
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md scale-102'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      id={`modal-size-${s}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {errorMsg && (
                  <p className="text-red-500 text-xs font-bold mt-2" id="size-error">
                    {errorMsg}
                  </p>
                )}
              </div>
            </div>

            {/* Actions & Perks */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex gap-3 mb-4">
                <button
                  onClick={handleAdd}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-bold shadow-md transition-all cursor-pointer ${
                    !product.inStock
                      ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                      : successMsg
                      ? 'bg-emerald-600 text-white shadow-emerald-100'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-98 shadow-indigo-100'
                  }`}
                  id="modal-add-to-cart-btn"
                >
                  {successMsg ? (
                    <>
                      <Check className="w-5 h-5 stroke-[2.5]" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>{product.inStock ? 'Add to Shopping Bag' : 'Out of Stock'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Assurances */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-gray-400 font-semibold tracking-wide uppercase text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-indigo-500" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RefreshCw className="w-4 h-4 text-indigo-500" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}