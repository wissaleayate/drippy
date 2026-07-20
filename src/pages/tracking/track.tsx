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
import { useLang } from '@/context/LanguageContext';

interface RealOrder {
  id: number;
  uuid: string; // <--- CHANGED FROM ID TO UUID
  customer: string;
  phone: string;
  address: string;
  status: string;
}

export default function TrackingPage() {
  const { t } = useLang();
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

    // ---> REMOVED THE NUMERIC DIGIT CHECK REGEX HERE TO ALLOW UUID CHARACTERS & HYPHENS

    setIsLoading(true);
    setErrorMsg('');
    setActiveOrder(null);

    try {
      const res = await fetch(`http://127.0.0.1:5000/orders/${trimmed}`);
      if (res.status === 404) {
        setErrorMsg(`No order found with key "${trimmed}". Double-check your unique code.`);
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

  const STATUS_INFO: Record<string, { label: string; color: string; description: string }> = {
    'Nouveau': { label: t.track_status_received, color: 'text-volt', description: t.track_status_received_desc },
    'Confirmé': { label: t.track_status_confirmed, color: 'text-emerald-400', description: t.track_status_confirmed_desc },
    'Ne répond pas': { label: t.track_status_contact, color: 'text-amber-400', description: t.track_status_contact_desc },
    'Expédiée': { label: t.track_status_shipped, color: 'text-sky-400', description: t.track_status_shipped_desc },
  };
  const statusInfo = activeOrder ? STATUS_INFO[activeOrder.status] : null;

  return (
    <div className="bg-ink text-bone min-h-screen font-sans flex flex-col selection:bg-volt selection:text-ink">
      <Nav />

      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 md:px-10 max-w-[1000px] mx-auto w-full">

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-12 mt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-volt animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-ash uppercase">{t.track_eyebrow}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black tracking-tight text-bone uppercase mb-4">{t.track_heading}</h1>
          <p className="text-sm sm:text-base text-ash max-w-lg mx-auto font-medium">{t.track_subheading}</p>
        </motion.div>

        <div className="max-w-xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center bg-white/[0.02] border border-white/10 hover:border-white/20 focus-within:border-volt/50 rounded-2xl p-1.5 transition-all duration-300 backdrop-blur-md">
              <Search className="w-5 h-5 text-ash ml-4 flex-shrink-0" />
              <input type="text" placeholder={t.track_placeholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 outline-0 py-3 px-4 text-sm sm:text-base text-bone placeholder:text-ash/60 focus:ring-0 focus:outline-none"
              />
              <button type="submit" disabled={isLoading} className="tap-target bg-volt text-ink font-mono font-bold text-xs uppercase px-4 sm:px-6 py-3 rounded-xl hover:bg-bone transition-all duration-300 cursor-pointer shadow-lg shadow-volt/10 disabled:opacity-50">
                {isLoading ? t.track_searching : t.track_btn}
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
              key={activeOrder.uuid}
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
                    <span className="text-xs font-mono uppercase tracking-widest text-ash">{t.track_status}</span>
                    <h2 className={`text-2xl sm:text-3xl font-display font-black uppercase mt-1 ${statusInfo.color}`}>{statusInfo.label}</h2>
                  </div>
                  <div className="text-left sm:text-right max-w-xs overflow-hidden">
                    <span className="text-xs font-mono uppercase tracking-widest text-ash">{t.track_unique_key}</span>
                    <p className="text-xs font-bold text-volt font-mono mt-1 break-all bg-white/[0.02] p-2 rounded-xl border border-white/5">{activeOrder.uuid}</p>
                  </div>
                </div>

                <p className="text-sm text-ash leading-relaxed">{statusInfo.description}</p>
              </div>

              {/* Order details card */}
              <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <div className="h-8 w-8 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt"><Info className="w-4 h-4" /></div>
                  <h3 className="text-lg font-bold font-display uppercase tracking-wider text-bone">{t.track_order_details}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="text-xs font-mono text-ash uppercase block mb-1">{t.track_customer}</span>
                    <p className="text-bone font-medium">{activeOrder.customer}</p>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-ash uppercase block mb-1">{t.track_phone}</span>
                    <p className="text-bone font-medium">{activeOrder.phone}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-xs font-mono text-ash uppercase block mb-1">{t.track_delivery_address}</span>
                    <p className="text-bone font-medium leading-relaxed">{activeOrder.address}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 sm:p-8">
                <h3 className="text-lg font-bold font-display uppercase tracking-wider text-bone mb-6 border-b border-white/5 pb-4">{t.track_what_next}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt"><Clock className="w-5 h-5" /></div>
                    <p className="text-xs text-ash leading-relaxed">{t.track_step1}</p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt"><Package className="w-5 h-5" /></div>
                    <p className="text-xs text-ash leading-relaxed">{t.track_step2}</p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt"><Truck className="w-5 h-5" /></div>
                    <p className="text-xs text-ash leading-relaxed">{t.track_step3}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-ash block mb-2 text-center">{t.track_need_help}</span>
                <button onClick={() => setShowSupportModal(true)} className="w-full py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-volt/30 text-bone hover:text-volt transition-all duration-300 cursor-pointer flex items-center justify-between text-sm group">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-white/[0.05] group-hover:bg-volt/10 flex items-center justify-center text-ash group-hover:text-volt transition-all"><MessageSquare className="w-4 h-4" /></div>
                    <span className="font-semibold tracking-wide">{t.track_live_chat}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ash group-hover:text-volt transition-transform group-hover:translate-x-1" />
                </button>
                <button onClick={() => setShowSupportModal(true)} className="w-full py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-volt/30 text-bone hover:text-volt transition-all duration-300 cursor-pointer flex items-center justify-between text-sm group">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-white/[0.05] group-hover:bg-volt/10 flex items-center justify-center text-ash group-hover:text-volt transition-all"><PhoneCall className="w-4 h-4" /></div>
                    <span className="font-semibold tracking-wide">{t.track_contact_support}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ash group-hover:text-volt transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!activeOrder && !isLoading && !errorMsg && (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="h-14 w-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-ash mx-auto mb-6">
              <MapPin className="w-6 h-6 stroke-[1.5]" />
            </div>
            <p className="text-sm text-ash leading-relaxed">{t.track_empty}</p>
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
                      <h3 className="text-xl font-bold font-display uppercase text-bone">{t.track_support_title}</h3>
                      <p className="text-[10px] font-mono text-volt uppercase tracking-wider">{t.track_support_subtitle}</p>
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
                      <label className="block text-xs font-mono text-ash uppercase mb-1.5">{t.track_support_subject}</label>
                      <select className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-sm text-bone focus:outline-none focus:border-volt/50 transition-colors">
                        <option value="delivery" className="bg-ink text-bone">Inquire about delivery timeline</option>
                        <option value="address" className="bg-ink text-bone">Modify delivery details</option>
                        <option value="damaged" className="bg-ink text-bone">Damaged or missing items</option>
                        <option value="returns" className="bg-ink text-bone">Exchange / Return procedures</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-ash uppercase mb-1.5">{t.track_support_order_key}</label>
                      <input
                        type="text"
                        defaultValue={activeOrder ? activeOrder.uuid : ''}
                        disabled
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-xs text-ash font-mono focus:outline-none cursor-not-allowed truncate"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-ash uppercase mb-1.5">{t.track_support_message}</label>
                      <textarea
                        rows={4}
                        required
                        placeholder={t.track_support_message + '...'}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-sm text-bone placeholder:text-ash/40 focus:outline-none focus:border-volt/50 transition-colors"
                      />
                    </div>

                    <button type="submit" className="w-full py-4 mt-2 bg-volt text-ink font-mono font-bold uppercase text-xs rounded-xl hover:bg-bone transition-all duration-300 cursor-pointer shadow-lg shadow-volt/5">
                      {t.track_support_send}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="h-14 w-14 rounded-full bg-volt/10 text-volt flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold font-display uppercase text-bone mb-2">{t.track_support_sent}</h3>
                  <p className="text-xs text-ash leading-relaxed mb-6">{t.track_support_sent_sub}</p>
                  <button onClick={() => { setShowSupportModal(false); setSupportSubmitted(false); }} className="px-6 py-3 border border-white/10 hover:border-white/25 text-bone text-xs font-mono uppercase rounded-xl transition-all cursor-pointer bg-white/[0.01]">
                    {t.track_support_close}
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
