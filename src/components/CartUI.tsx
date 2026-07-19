import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, Plus, Minus, CheckCircle2, ArrowRight, Printer } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

function formatDA(n: number) {
  return `${n.toLocaleString('en-US', { maximumFractionDigits: 0 })} DA`;
}

interface OrderResponse {
  id: number;
  customer: string;
  phone: string;
  address: string;
  status: string;
  items: string; // JSON string of items
  total_price: number;
  created_at: string;
}

export default function CartUI() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, clearCart, toastMessage, showToast } = useCart();

  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  
  // State to hold the created order from the backend for the receipt
  const [createdOrder, setCreatedOrder] = useState<OrderResponse | null>(null);

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

    // Format the items from our React state cart context to send to the backend
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
          address: customerAddress,
          items: backendItems, // Sending items now!
        }),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const data: OrderResponse = await res.json();
      
      // Store the response details to display on the receipt
      setCreatedOrder(data);
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

  // Function to print only the receipt
  const handlePrintReceipt = () => {
    window.print();
  };

  // Helper to parse items safely
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
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-zinc text-bone px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold border border-white/10 backdrop-blur-md print:hidden"
          >
            <div className="h-2 w-2 rounded-full bg-volt animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden print:hidden">
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
                        type="tel"
                        inputMode="numeric"
                        placeholder="Phone Number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={15}
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

      {/* Success Modal + Printable Receipt (Le Bon) */}
      <AnimatePresence>
        {isCheckoutSuccess && createdOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutSuccess(false)}
              className="fixed inset-0 bg-ink/85 backdrop-blur-sm print:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative max-w-xl w-full bg-zinc border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl z-10 overflow-hidden text-bone print:border-none print:bg-white print:text-black print:p-0 print:shadow-none"
            >
              {/* Top Accent Bar (hidden when printing) */}
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-volt to-bone print:hidden" />
              
              {/* Success Header (hidden when printing) */}
              <div className="text-center mb-6 print:hidden">
                <div className="h-12 w-12 bg-volt/10 text-volt rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-lg font-black text-bone tracking-tight mb-1">
                  Order Received!
                </h3>
                <p className="text-xs text-ash">
                  Thank you for shopping at NK. Your print receipt (Bon) is ready.
                </p>
              </div>

              {/* ================================================================= */}
              {/* THE RECEIPT / BON (Beautiful printable paper format) */}
              {/* ================================================================= */}
              <div id="receipt-paper" className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mb-6 print:border-black print:border-2 print:p-4 print:text-black print:bg-white">
                <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4 print:border-black">
                  <div>
                    <h2 className="text-xl font-black text-bone tracking-wider print:text-black">NK STORE</h2>
                    <p className="text-[10px] text-ash uppercase tracking-wider print:text-black">Order Receipt / Bon d'achat</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-volt print:text-black">Order N°: #{createdOrder.id}</p>
                    <p className="text-[10px] text-ash font-mono print:text-black">{createdOrder.created_at}</p>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-4 text-xs mb-6 border-b border-white/5 pb-4 print:border-black">
                  <div>
                    <span className="text-[10px] text-ash block uppercase font-mono print:text-black">Customer Details</span>
                    <strong className="text-bone print:text-black">{createdOrder.customer}</strong>
                    <span className="block text-ash print:text-black">{createdOrder.phone}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-ash block uppercase font-mono print:text-black">Ship to</span>
                    <p className="text-ash leading-snug print:text-black">{createdOrder.address}</p>
                  </div>
                </div>

                {/* Products Purchased Table */}
                <div className="space-y-3 mb-6">
                  <span className="text-[10px] text-ash block uppercase font-mono mb-2 print:text-black">Purchased Items</span>
                  {getReceiptItems().map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs pb-2.5 border-b border-white/[0.03] print:border-gray-200">
                      <div>
                        <p className="font-bold text-bone print:text-black">{item.name}</p>
                        <p className="text-[10px] text-ash print:text-black">
                          Brand: {item.brand} | Size: {item.size}
                        </p>
                      </div>
                      <div className="text-right font-mono">
                        <p className="text-bone print:text-black">
                          {item.quantity} x {formatDA(item.price)}
                        </p>
                        <p className="text-[11px] font-bold text-volt print:text-black">
                          {formatDA(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals Section */}
                <div className="border-t border-white/10 pt-4 flex flex-col items-end gap-1.5 text-xs font-mono print:border-black">
                  <div className="flex justify-between w-full max-w-xs text-ash print:text-black">
                    <span>Subtotal:</span>
                    <span>{formatDA(createdOrder.total_price)}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-xs text-ash print:text-black">
                    <span>Shipping:</span>
                    <span>{createdOrder.total_price > 15000 ? 'FREE' : '500 DA'}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-xs text-sm font-bold text-bone pt-2 border-t border-white/5 print:text-black print:border-black">
                    <span>Total Paid:</span>
                    <span className="text-volt print:text-black">{formatDA(createdOrder.total_price > 15000 ? createdOrder.total_price : createdOrder.total_price + 500)}</span>
                  </div>
                </div>
              </div>
              {/* ================================================================= */}

              {/* Action Buttons */}
              <div className="flex gap-3 print:hidden">
                <button
                  onClick={handlePrintReceipt}
                  className="flex-1 py-3 bg-white/[0.05] border border-white/10 text-bone hover:bg-white/10 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Receipt (Bon)
                </button>
                <button
                  onClick={() => setIsCheckoutSuccess(false)}
                  className="flex-1 py-3 bg-volt text-ink rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all duration-300 cursor-pointer shadow-md shadow-volt/5"
                >
                  Close Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
