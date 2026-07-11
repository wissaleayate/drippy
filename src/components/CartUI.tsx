import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, Plus, Minus, CheckCircle2, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
function formatDA(n: number) {
  return `${n.toLocaleString('en-US', { maximumFractionDigits: 0 })} DA`;
}

export default function CartUI() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, clearCart, toastMessage, showToast } = useCart();

  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const shippingFee = cartSubtotal > 15000 || cartSubtotal === 0 ? 0 : 500;
  const estimatedTax = cartSubtotal * 0.08;
  const cartTotal = cartSubtotal + shippingFee + estimatedTax;

  const handleCheckout = async () => {
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      showToast('Please fill in your name, phone, and address');
      return;
    }

    setIsSubmittingOrder(true);

    try {
      const res = await fetch('http://127.0.0.1:5000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerName,
          phone: customerPhone,
          address: customerAddress,
        }),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      setIsCheckoutSuccess(true);
      clearCart();
      closeCart();
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
    } catch (err) {
      console.error('Order failed:', err);
      showToast('Order failed. Is the backend running?');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-zinc text-bone px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold border border-white/10 backdrop-blur-md"
          >
            <div className="h-2 w-2 rounded-full bg-volt animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity"
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-screen max-w-md bg-zinc border-l border-white/10 shadow-2xl flex flex-col text-bone"
              >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-volt" />
                    <h3 className="text-base font-bold text-bone">Shopping Bag</h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-volt/10 text-volt">
                      {cartItemCount}
                    </span>
                  </div>
                  <Link
                    to="/products"
                    onClick={closeCart}
                    className="px-4 py-2.5 rounded-lg border border-volt text-volt text-[11px] font-bold tracking-wider uppercase hover:bg-volt/10 transition-colors cursor-pointer inline-block"
                    >
                        Start Shopping
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-6 border-b border-white/[0.03]">
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
                                onClick={() => removeFromCart(item.id, item.product.name)}
                                className="text-ash hover:text-rose-400 transition-colors cursor-pointer"
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
                            <div className="flex items-center border border-white/5 rounded-lg p-0.5 bg-white/[0.02]">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 rounded-md text-ash hover:text-bone hover:bg-white/[0.05] transition-all cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-bone px-2.5">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 rounded-md text-ash hover:text-bone hover:bg-white/[0.05] transition-all cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-xs font-bold text-bone font-mono">
                              {formatDA(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center h-full max-w-xs mx-auto">
                      <div className="h-12 w-12 rounded-full bg-volt/10 text-volt flex items-center justify-center mb-4">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-bone mb-1">Your bag is empty</h4>
                      <p className="text-xs text-ash leading-relaxed">
                        Explore our curation and find comfortable silhouettes designed to last.
                      </p>
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-6 border-t border-white/5 bg-white/[0.01] space-y-4">
                    <div className="space-y-1.5 text-xs font-medium text-ash">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="text-bone font-bold font-mono">{formatDA(cartSubtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Shipping</span>
                        {shippingFee === 0 ? (
                          <span className="text-volt font-bold font-mono">FREE</span>
                        ) : (
                          <span className="text-bone font-bold font-mono">{formatDA(shippingFee)}</span>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Tax (8%)</span>
                        <span className="text-bone font-bold font-mono">{formatDA(estimatedTax)}</span>
                      </div>
                      <div className="pt-3 border-t border-white/5 flex justify-between text-sm font-bold text-bone">
                        <span>Total Amount</span>
                        <span className="text-base text-volt font-black font-mono">{formatDA(cartTotal)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
                      />
                      <input
                        type="text"
                        placeholder="Phone Number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
                      />
                      <input
                        type="text"
                        placeholder="Delivery Address"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
                      />
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={isSubmittingOrder}
                      className="w-full py-3.5 rounded-2xl bg-volt text-ink text-xs font-mono font-bold tracking-wider uppercase hover:bg-bone transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-volt/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{isSubmittingOrder ? 'Placing Order...' : 'Proceed to Secure Checkout'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {isCheckoutSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutSuccess(false)}
              className="fixed inset-0 bg-ink/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative max-w-md w-full bg-zinc border border-white/10 rounded-3xl p-8 text-center shadow-2xl z-10 overflow-hidden text-bone"
            >
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
              >
                Continue Browsing
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}