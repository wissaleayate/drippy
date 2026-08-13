import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, Plus, Minus, CheckCircle2, ArrowRight, Printer, Copy, Check, X, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

function formatDA(n: number) {
  return `${n.toLocaleString('en-US', { maximumFractionDigits: 0 })} DA`;
}

interface OrderResponse {
  id: number;
  uuid: string;
  customer: string;
  phone: string;
  address: string;
  wilaya?: string;
  delivery_type?: string;
  shipping_price?: number;
  status: string;
}

const ALGERIA_WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', "M'Sila", 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
  'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
  'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane', "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès",
  "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
];

interface ApiDeliveryRate {
  wilaya: string;
  home_price: number;
  pickup_price: number;
  delivery_time: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  wilaya?: string;
}

export default function CartUI() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, clearCart, toastMessage, showToast } = useCart();
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const formTopRef = useRef<HTMLDivElement>(null);

  // Push a history entry when the cart opens so the browser back button closes it
  useEffect(() => {
    if (isCartOpen) {
      window.history.pushState({ cartOpen: true }, '');
    }
  }, [isCartOpen]);

  // Listen for the browser back button and close the cart instead of leaving
  useEffect(() => {
    const handlePopState = () => {
      if (isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isCartOpen, closeCart]);

  // Lock background page scroll while the cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isCartOpen]);

  // Pre-fill checkout from the logged-in user's saved delivery info
  const [hasPrefilled, setHasPrefilled] = useState(false);

  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerWilaya, setCustomerWilaya] = useState('');
  const [deliveryType, setDeliveryType] = useState<'home' | 'pickup'>('home');
  const [deliveryRates, setDeliveryRates] = useState<ApiDeliveryRate[]>([]);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');

  // State to hold the created order from the backend for the receipt
  const [createdOrder, setCreatedOrder] = useState<OrderResponse | null>(null);
  const [orderKeyCopied, setOrderKeyCopied] = useState(false);

  const handleCopyOrderKey = async () => {
    if (!createdOrder) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(createdOrder.uuid);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = createdOrder.uuid;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setOrderKeyCopied(true);
      setTimeout(() => setOrderKeyCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy order key:', err);
      showToast('Could not copy. Order Key: ' + createdOrder.uuid);
    }
  };

  useEffect(() => {
    if (!isCartOpen) return;
    fetch('http://127.0.0.1:5000/delivery-rates')
      .then((res) => res.json())
      .then((data: ApiDeliveryRate[]) => setDeliveryRates(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Failed to load delivery rates:', err));
  }, [isCartOpen]);

  useEffect(() => {
    if (!isCartOpen || hasPrefilled) return;
    if (user) {
      setCustomerName((prev) => prev || user.name);
      if (user.deliveryInfo) {
        setCustomerPhone((prev) => prev || user.deliveryInfo!.phone);
        setCustomerWilaya((prev) => prev || user.deliveryInfo!.wilaya);
        setDeliveryType(user.deliveryInfo!.deliveryType || 'home');
      }
    }
    setHasPrefilled(true);
  }, [isCartOpen, user, hasPrefilled]);

  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const selectedRate = deliveryRates.find((r) => r.wilaya === customerWilaya);
  const shippingFee = cartItemCount === 0
    ? 0
    : selectedRate
    ? (deliveryType === 'pickup' ? selectedRate.pickup_price : selectedRate.home_price)
    : 500; // fallback if wilaya not chosen yet or has no rate set

  const cartTotal = cartSubtotal + shippingFee;

  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail.trim() || !emailRegex.test(customerEmail.trim())) {
      setFormErrors((f) => ({ ...f, email: 'Please enter a valid email first' }));
      return;
    }
    setFormErrors((f) => ({ ...f, email: undefined }));
    setOtpError('');
    setIsSendingOtp(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customerEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send code');
      setOtpSent(true);
      showToast('Verification code sent to your email');
    } catch (err) {
      console.error('Failed to send OTP:', err);
      setOtpError(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) {
      setOtpError('Enter the code sent to your email');
      return;
    }
    setIsVerifyingOtp(true);
    setOtpError('');
    try {
      const res = await fetch('http://127.0.0.1:5000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customerEmail, code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      setIsEmailVerified(true);
      showToast('Email verified!');
    } catch (err) {
      console.error('Failed to verify OTP:', err);
      setOtpError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Algerian mobile numbers: 10 digits, start with 0 (05/06/07)
    const phoneRegex = /^0[5-7][0-9]{8}$/;

    if (!customerName.trim()) {
      errors.name = 'Name is required';
    }

    if (!customerPhone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(customerPhone.trim())) {
      errors.phone = 'Enter a valid phone number';
    }

    if (!customerEmail.trim() || !emailRegex.test(customerEmail.trim())) {
      errors.email = 'Please enter a valid email to receive your receipt';
    } else if (!isEmailVerified) {
      errors.email = 'Please verify your email before checking out';
    }

    if (!customerWilaya) {
      errors.wilaya = 'Please select your wilaya';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      showToast('Please fix the highlighted fields');
      return;
    }

    setIsSubmittingOrder(true);

    const backendItems = cart.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      brand: item.product.brand,
      price: item.product.price,
      quantity: item.quantity,
      size: item.size
    }));

    try {
      const res = await fetch('http://127.0.0.1:5000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerName,
          phone: customerPhone,
          email: customerEmail,
          address: '',
          wilaya: customerWilaya,
          delivery_type: deliveryType,
          items: backendItems,
          user_id: user ? user.id : null,
        }),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const data: OrderResponse = await res.json();

      setCreatedOrder(data);
      setIsCheckoutSuccess(true);

      if (user) {
        const storageKey = `drippy_purchases_${user.id}`;
        const existing: string[] = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
        const newIds = cart.map((item) => item.product.id);
        const merged = Array.from(new Set([...existing, ...newIds]));
        localStorage.setItem(storageKey, JSON.stringify(merged));
      }

      clearCart();
      closeCart();
      setCustomerName('');
      setCustomerPhone('');
      setCustomerWilaya('');
      setDeliveryType('home');
      setCustomerEmail('');
      setFormErrors({});
      setIsEmailVerified(false);
      setOtpSent(false);
      setOtpCode('');
      setOtpError('');
    } catch (err) {
      console.error('Order failed:', err);
      showToast('Order failed. Is the backend running?');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const getReceiptItems = () => {
    if (!createdOrder || !createdOrder.items) return [];
    try {
      return JSON.parse(createdOrder.items);
    } catch (e) {
      return [];
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
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-zinc text-bone px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold border border-white/10 backdrop-blur-md print:hidden"
          >
            <div className="h-2 w-2 rounded-full bg-volt animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden print:hidden" role="dialog" aria-modal="true" aria-label={t.cart_title}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity"
            />

            <div className="absolute inset-y-0 end-0 max-w-full flex ps-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-screen max-w-sm bg-zinc border-s border-white/10 shadow-2xl flex flex-col text-bone max-h-screen h-full overscroll-contain"
              >
                <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-volt" />
                    <h3 className="text-sm font-bold text-bone">{t.cart_title}</h3>
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-volt/10 text-volt">
                      {cartItemCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link
                      to="/products"
                      onClick={closeCart}
                      className="px-3 py-2 rounded-lg border border-volt text-volt text-[10px] font-bold tracking-wider uppercase hover:bg-volt/10 transition-colors cursor-pointer inline-block"
                    >
                      {t.cart_start_shopping}
                    </Link>
                    <button
                      onClick={() => navigate(-1)}
                      aria-label="Close shopping bag"
                      className="p-1.5 rounded-lg text-ash hover:text-bone hover:bg-white/[0.05] transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
                  <div ref={formTopRef} />

                  <div className="p-4 space-y-4">
                    {cart.length > 0 ? (
                      cart.map((item) => (
                        <div key={item.id} className="flex gap-3 pb-4 border-b border-white/[0.03]">
                          <div className="h-16 w-14 rounded-lg overflow-hidden bg-ink/50 border border-white/5 flex-shrink-0">
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
                              <span className="text-[10px] font-semibold text-ash">{t.cart_brand} {item.product.brand}</span>
                              <div className="mt-1">
                                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-white/[0.05] text-bone">
                                  {t.cart_size} {item.size}
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
                      <div className="flex flex-col items-center justify-center text-center h-full max-w-xs mx-auto py-10">
                        <div className="h-12 w-12 rounded-full bg-volt/10 text-volt flex items-center justify-center mb-4">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold text-bone mb-1">{t.cart_empty}</h4>
                        <p className="text-xs text-ash leading-relaxed">
                          {t.cart_empty_sub}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {cart.length > 0 && (
                  <div className="p-4 border-t border-white/5 bg-white/[0.01] space-y-3 shrink-0 max-h-[65vh] overflow-y-auto overscroll-contain">
                    <div className="space-y-1 text-xs font-medium text-ash">
                      <div className="flex justify-between">
                        <span>{t.cart_subtotal}</span>
                        <span className="text-bone font-bold font-mono">{formatDA(cartSubtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t.cart_shipping}</span>
                        {customerWilaya ? (
                          <span className="text-bone font-bold font-mono">{formatDA(shippingFee)}</span>
                        ) : (
                          <span className="text-ash font-mono text-[10px]">Select wilaya</span>
                        )}
                      </div>
                      <div className="pt-2.5 border-t border-white/5 flex justify-between text-sm font-bold text-bone">
                        <span>{t.cart_total}</span>
                        <span className="text-sm text-volt font-black font-mono">{formatDA(cartTotal)}</span>
                      </div>
                    </div>

                    {Object.keys(formErrors).length > 0 && (
                      <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div className="text-[11px] text-rose-300 leading-relaxed">
                          Please fix the highlighted field{Object.keys(formErrors).length > 1 ? 's' : ''} below.
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div>
                        <input
                          type="text"
                          placeholder={t.cart_name_placeholder}
                          value={customerName}
                          onChange={(e) => {
                            setCustomerName(e.target.value);
                            if (formErrors.name) setFormErrors((f) => ({ ...f, name: undefined }));
                          }}
                          className={`w-full px-3 py-2 rounded-lg bg-white/[0.03] border text-xs text-bone placeholder:text-ash focus:outline-none focus:border-volt/50 ${formErrors.name ? 'border-rose-500/60' : 'border-white/10'}`}
                        />
                        {formErrors.name && <p className="text-[10px] text-rose-400 mt-1">{formErrors.name}</p>}
                      </div>

                      <div>
                        <div className="flex gap-1.5">
                          <input
                            type="email"
                            placeholder="Email (for your receipt)"
                            value={customerEmail}
                            disabled={isEmailVerified}
                            onChange={(e) => {
                              setCustomerEmail(e.target.value);
                              if (formErrors.email) setFormErrors((f) => ({ ...f, email: undefined }));
                              if (isEmailVerified) setIsEmailVerified(false);
                              if (otpSent) { setOtpSent(false); setOtpCode(''); }
                            }}
                            className={`flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border text-xs text-bone placeholder:text-ash focus:outline-none focus:border-volt/50 disabled:opacity-60 ${formErrors.email ? 'border-rose-500/60' : 'border-white/10'}`}
                          />
                          {!isEmailVerified && (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={isSendingOtp}
                              className="px-3 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-bone text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                            >
                              {isSendingOtp ? 'Sending...' : otpSent ? 'Resend' : 'Send Code'}
                            </button>
                          )}
                          {isEmailVerified && (
                            <span className="px-3 py-2 rounded-lg bg-volt/10 border border-volt/30 text-volt text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                              <Check className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>
                        {formErrors.email && <p className="text-[10px] text-rose-400 mt-1">{formErrors.email}</p>}

                        {otpSent && !isEmailVerified && (
                          <div className="flex gap-1.5 mt-1.5">
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="6-digit code"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                              maxLength={6}
                              className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={isVerifyingOtp}
                              className="px-3 py-2 rounded-lg bg-volt text-ink text-[10px] font-bold uppercase tracking-wider hover:bg-bone transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                            >
                              {isVerifyingOtp ? 'Checking...' : 'Verify'}
                            </button>
                          </div>
                        )}
                        {otpError && <p className="text-[10px] text-rose-400 mt-1">{otpError}</p>}
                      </div>

                      <div>
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder={t.cart_phone_placeholder}
                          value={customerPhone}
                          onChange={(e) => {
                            setCustomerPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10));
                            if (formErrors.phone) setFormErrors((f) => ({ ...f, phone: undefined }));
                          }}
                          maxLength={10}
                          className={`w-full px-3 py-2 rounded-lg bg-white/[0.03] border text-xs text-bone placeholder:text-ash focus:outline-none focus:border-volt/50 ${formErrors.phone ? 'border-rose-500/60' : 'border-white/10'}`}
                        />
                        {formErrors.phone && <p className="text-[10px] text-rose-400 mt-1">{formErrors.phone}</p>}
                      </div>

                      <div>
                        <select
                          value={customerWilaya}
                          onChange={(e) => {
                            setCustomerWilaya(e.target.value);
                            if (formErrors.wilaya) setFormErrors((f) => ({ ...f, wilaya: undefined }));
                          }}
                          className={`w-full px-3 py-2 rounded-lg bg-white/[0.03] border text-xs text-bone focus:outline-none focus:border-volt/50 ${formErrors.wilaya ? 'border-rose-500/60' : 'border-white/10'}`}
                        >
                          <option value="" className="bg-zinc">Select your wilaya</option>
                          {ALGERIA_WILAYAS.map((w) => (
                            <option key={w} value={w} className="bg-zinc">{w}</option>
                          ))}
                        </select>
                        {formErrors.wilaya && <p className="text-[10px] text-rose-400 mt-1">{formErrors.wilaya}</p>}
                      </div>

                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDeliveryType('home')}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            deliveryType === 'home'
                              ? 'bg-volt border-volt text-ink'
                              : 'bg-white/[0.03] border-white/10 text-bone hover:border-white/20'
                          }`}
                        >
                          Home Delivery
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryType('pickup')}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            deliveryType === 'pickup'
                              ? 'bg-volt border-volt text-ink'
                              : 'bg-white/[0.03] border-white/10 text-bone hover:border-white/20'
                          }`}
                        >
                          Pickup Point
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={isSubmittingOrder}
                      className="w-full py-3 rounded-xl bg-volt text-ink text-xs font-mono font-bold tracking-wider uppercase hover:bg-bone transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-volt/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{isSubmittingOrder ? t.cart_placing : t.cart_checkout}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}