import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  MessageSquare,
  PhoneCall,
  X,
  Info,
  ChevronRight,
  Clock,
  AlertCircle,
} from 'lucide-react';

import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
interface RealOrder {
  id: number;
  customer: string;
  phone: string;
  address: string;
  status: string;
}

// Maps the real backend statuses to display info.
// allowed_status in backend/app.py: "Nouveau", "Confirmé", "Ne répond pas", "Expédiée"
const STATUS_INFO: Record<string, { label: string; color: string; description: string }> = {
  'Nouveau': {
    label: 'Order Received',
    color: 'text-volt',
    description: 'Your order has been received and is awaiting confirmation.',
  },
  'Confirmé': {
    label: 'Confirmed',
    color: 'text-emerald-400',
    description: 'Your order has been confirmed and is being prepared.',
  },
  'Ne répond pas': {
    label: 'Attempting Contact',
    color: 'text-amber-400',
    description: 'We tried to reach you to confirm your order but couldn\'t get through. Please check your phone or contact us.',
  },
  'Expédiée': {
    label: 'Shipped',
    color: 'text-sky-400',
    description: 'Your order is on its way to you.',
  },
};

export default function TrackingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrder, setActiveOrder] = useState<RealOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    if (!/^\d+$/.test(trimmed)) {
      setErrorMsg('Please enter a valid numeric Order ID.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setActiveOrder(null);

    try {
      const res = await fetch(`http://127.0.0.1:5000/orders/${trimmed}`);
      if (res.status === 404) {
        setErrorMsg(`No order found with ID "${trimmed}". Double-check your order confirmation.`);
        setIsLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      setActiveOrder(data);
    } catch (err) {
      console.error('Failed to fetch order:', err);
      setErrorMsg('Could not reach the server. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const statusInfo = activeOrder ? STATUS_INFO[activeOrder.status] : null;

  return (
    <div className="bg-ink text-bone min-h-screen font-sans flex flex-col selection:bg-volt selection:text-ink">
      <Nav />

      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 md:px-10 max-w-[1000px] mx-auto w-full">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 mt-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-volt animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-ash uppercase">Order Status</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-display font-black tracking-tight text-bone uppercase mb-4">
            Track Your Order
          </h1>
          <p className="text-sm sm:text-base text-ash max-w-lg mx-auto font-medium">
            Enter your Order ID (from your checkout confirmation) to check its current status.
          </p>
        </motion.div>

        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center bg-white/[0.02] border border-white/10 hover:border-white/20 focus-within:border-volt/50 rounded-2xl p-1.5 transition-all duration-300 backdrop-blur-md">
              <Search className="w-5 h-5 text-ash ml-4 flex-shrink-0" />
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter Order ID (e.g. 1, 2, 3...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 outline-0 py-3 px-4 text-sm sm:text-base text-bone placeholder:text-ash/60 focus:ring-0 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-volt text-ink font-mono font-bold text-xs uppercase px-6 py-3 rounded-xl hover:bg-bone transition-all duration-300 cursor-pointer shadow-lg shadow-volt/10 disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Track'}
              </button>
            </div>
            {errorMsg && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-xs text-rose-400 font-medium flex items-center gap-1.5 justify-center"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {errorMsg}
              </motion.p>
            )}
          </form>
        </div>

        {/* Order result */}
        <AnimatePresence mode="wait">
          {activeOrder && statusInfo && (
            <motion.div
              key={activeOrder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Status card */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 sm:p-8 backdrop-blur-md">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-44 h-44 rounded-full bg-volt/10 blur-[60px]" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-ash">Current Status</span>
                    <h2 className={`text-2xl sm:text-3xl font-display font-black uppercase mt-1 ${statusInfo.color}`}>
                      {statusInfo.label}
                    </h2>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-mono uppercase tracking-widest text-ash">Order ID</span>
                    <p className="text-lg font-bold text-bone font-mono mt-1">#{activeOrder.id}</p>
                  </div>
                </div>

                <p className="text-sm text-ash leading-relaxed">{statusInfo.description}</p>
              </div>

              {/* Order details card */}
              <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <div className="h-8 w-8 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt">
                    <Info className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold font-display uppercase tracking-wider text-bone">Order Details</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="text-xs font-mono text-ash uppercase block mb-1">Customer</span>
                    <p className="text-bone font-medium">{activeOrder.customer}</p>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-ash uppercase block mb-1">Phone</span>
                    <p className="text-bone font-medium">{activeOrder.phone}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-xs font-mono text-ash uppercase block mb-1">Delivery Address</span>
                    <p className="text-bone font-medium leading-relaxed">{activeOrder.address}</p>
                  </div>
                </div>
              </div>

              {/* Generic decorative "what happens next" panel — NOT tied to real per-order data */}
              <div className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 sm:p-8">
                <h3 className="text-lg font-bold font-display uppercase tracking-wider text-bone mb-6 border-b border-white/5 pb-4">
                  What Happens Next
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt">
                      <Clock className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-ash leading-relaxed">We confirm your order and contact you if needed</p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt">
                      <Package className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-ash leading-relaxed">Your items are prepared and packed for shipping</p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt">
                      <Truck className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-ash leading-relaxed">Your order ships to the address on file</p>
                  </div>
                </div>
              </div>

              {/* Support actions */}
              <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-ash block mb-2 text-center">Need Assistance?</span>

                <button
                  onClick={() => setShowSupportModal(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-volt/30 text-bone hover:text-volt transition-all duration-300 cursor-pointer flex items-center justify-between text-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-white/[0.05] group-hover:bg-volt/10 flex items-center justify-center text-ash group-hover:text-volt transition-all">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="font-semibold tracking-wide">Live Chat Assistance</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ash group-hover:text-volt transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => setShowSupportModal(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-volt/30 text-bone hover:text-volt transition-all duration-300 cursor-pointer flex items-center justify-between text-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-white/[0.05] group-hover:bg-volt/10 flex items-center justify-center text-ash group-hover:text-volt transition-all">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <span className="font-semibold tracking-wide">Contact Support</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ash group-hover:text-volt transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state before any search */}
        {!activeOrder && !isLoading && !errorMsg && (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="h-14 w-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-ash mx-auto mb-6">
              <MapPin className="w-6 h-6 stroke-[1.5]" />
            </div>
            <p className="text-sm text-ash leading-relaxed">
              Enter your Order ID above to see your order's current status.
            </p>
          </div>
        )}

      </main>

      <Footer />

      {/* Support Modal */}
      <AnimatePresence>
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowSupportModal(false);
                setSupportSubmitted(false);
              }}
              className="fixed inset-0 bg-ink/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative max-w-md w-full bg-zinc border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
            >
              <button
                onClick={() => {
                  setShowSupportModal(false);
                  setSupportSubmitted(false);
                }}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/[0.05] border border-white/5 hover:bg-white/[0.1] text-ash hover:text-bone flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {!supportSubmitted ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-2xl bg-volt/10 text-volt flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-display uppercase text-bone">NK. Support</h3>
                      <p className="text-[10px] font-mono text-volt uppercase tracking-wider">We're here to help</p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSupportSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-mono text-ash uppercase mb-1.5">Subject</label>
                      <select className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-sm text-bone focus:outline-none focus:border-volt/50 transition-colors">
                        <option value="delivery" className="bg-ink text-bone">Inquire about delivery timeline</option>
                        <option value="address" className="bg-ink text-bone">Modify delivery details</option>
                        <option value="damaged" className="bg-ink text-bone">Damaged or missing items</option>
                        <option value="returns" className="bg-ink text-bone">Exchange / Return procedures</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-ash uppercase mb-1.5">Order ID</label>
                      <input
                        type="text"
                        defaultValue={activeOrder ? String(activeOrder.id) : ''}
                        disabled
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-sm text-ash font-mono focus:outline-none cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-ash uppercase mb-1.5">Message</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Detail your request..."
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-sm text-bone placeholder:text-ash/40 focus:outline-none focus:border-volt/50 transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 mt-2 bg-volt text-ink font-mono font-bold uppercase text-xs rounded-xl hover:bg-bone transition-all duration-300 cursor-pointer shadow-lg shadow-volt/5"
                    >
                      Send Message
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="h-14 w-14 rounded-full bg-volt/10 text-volt flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold font-display uppercase text-bone mb-2">Message Sent</h3>
                  <p className="text-xs text-ash leading-relaxed mb-6">
                    Thanks for reaching out. Our team will get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setShowSupportModal(false);
                      setSupportSubmitted(false);
                    }}
                    className="px-6 py-3 border border-white/10 hover:border-white/25 text-bone text-xs font-mono uppercase rounded-xl transition-all cursor-pointer bg-white/[0.01]"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
