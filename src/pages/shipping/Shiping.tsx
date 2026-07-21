import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  RotateCcw,
  MessageSquare,
  Mail,
  ChevronDown,
  HelpCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { useLang } from '../../context/LanguageContext';

interface RateRow {
  state: string;
  homePrice: string;
  pickupPrice: string;
  deliveryTime: string;
}

interface ApiDeliveryRate {
  uuid: string;
  wilaya: string;
  home_price: number;
  pickup_price: number;
  delivery_time: string;
}

const FALLBACK_RATE_DATA: RateRow[] = [
  { state: 'Algiers', homePrice: '500 DA', pickupPrice: '300 DA', deliveryTime: '1 - 2 Days' },
  { state: 'Oran', homePrice: '700 DA', pickupPrice: '450 DA', deliveryTime: '2 - 3 Days' },
  { state: 'Constantine', homePrice: '750 DA', pickupPrice: '500 DA', deliveryTime: '2 - 3 Days' },
  { state: 'Annaba', homePrice: '800 DA', pickupPrice: '550 DA', deliveryTime: '3 - 4 Days' },
  { state: 'Sétif', homePrice: '700 DA', pickupPrice: '450 DA', deliveryTime: '2 - 3 Days' },
  { state: 'Blida', homePrice: '600 DA', pickupPrice: '400 DA', deliveryTime: '1 - 2 Days' },
  { state: 'Tlemcen', homePrice: '850 DA', pickupPrice: '600 DA', deliveryTime: '3 - 4 Days' },
  { state: 'Batna', homePrice: '800 DA', pickupPrice: '550 DA', deliveryTime: '3 - 4 Days' },
  { state: 'Bejaia', homePrice: '750 DA', pickupPrice: '500 DA', deliveryTime: '2 - 3 Days' },
  { state: 'Ghardaïa', homePrice: '950 DA', pickupPrice: '700 DA', deliveryTime: '4 - 5 Days' },
];

interface FAQItem {
  question: string;
  answer: string;
}

export default function ShippingPage() {
  const { t, isRTL } = useLang();
  const [searchQuery, setSearchQuery] = useState('');
  const [rateData, setRateData] = useState<RateRow[]>(FALLBACK_RATE_DATA);
  const [isTyping, setIsTyping] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [supportMessage, setSupportMessage] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const FAQ_DATA: FAQItem[] = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 1 to 2 business days for major metropolitan hubs (like Algiers or Blida), and 3 to 5 business days for regional and southern provinces. Order dispatch occurs within 24 hours of confirmation.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Once dispatched, you will receive an SMS and email with a secure tracking link. You can also head over to our tracking portal and input your Order ID to view real-time courier coordinates.',
    },
    {
      question: 'Can I change my delivery address?',
      answer: 'Yes, address modifications are permitted up to 2 hours post-confirmation. Please reach out to our concierge immediately via WhatsApp or phone with your Order ID to apply changes.',
    },
    {
      question: 'What happens if I miss my delivery?',
      answer: 'Our elite courier service will attempt a second delivery on the following business day. You will receive a notification call prior to the courier arriving to align on convenient times.',
    },
  ];

  useEffect(() => {
    fetch('http://127.0.0.1:5000/delivery-rates')
      .then((res) => res.json())
      .then((data: ApiDeliveryRate[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setRateData(
            data.map((r) => ({
              state: r.wilaya,
              homePrice: `${r.home_price} DA`,
              pickupPrice: `${r.pickup_price} DA`,
              deliveryTime: r.delivery_time,
            }))
          );
        }
      })
      .catch((err) => {
        console.error('Failed to load delivery rates, using defaults:', err);
      });
  }, []);

  useEffect(() => {
    if (!searchQuery) return;
    setIsTyping(true);
    const handler = setTimeout(() => setIsTyping(false), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredRates = rateData.filter((rate) =>
    rate.state.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setToastMsg(t.ship_toast_sent);
    setSupportMessage('');
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="bg-ink text-bone min-h-screen font-sans flex flex-col selection:bg-volt selection:text-ink">
      <Nav />

      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto w-full">

        {/* 1. Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-16 mt-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-4">
            <Truck className="w-3.5 h-3.5 text-volt" aria-hidden="true" />
            <span className="text-[10px] font-mono tracking-widest text-ash uppercase">{t.ship_eyebrow}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black tracking-tight text-bone uppercase mb-4">
            {t.ship_heading}
          </h1>
          <p className="text-sm sm:text-base text-ash max-w-lg mx-auto font-medium leading-relaxed">
            {t.ship_subheading}
          </p>
        </motion.section>

        {/* 2. Search Bar */}
        <div className="max-w-4xl mx-auto mb-10 sm:mb-12 sticky top-20 z-30">
          <div className={`relative flex items-center bg-zinc/90 border border-white/5 focus-within:border-volt/35 rounded-2xl p-1.5 shadow-2xl backdrop-blur-lg transition-all duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Search className="w-5 h-5 text-ash ml-4 flex-shrink-0" aria-hidden="true" />
            <input
              type="search"
              placeholder={t.ship_search_placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 outline-0 py-3.5 px-4 text-sm sm:text-base text-bone placeholder:text-ash/55 focus:ring-0 focus:outline-none"
              aria-label={t.ship_search_placeholder}
            />
            <div className="absolute right-4 flex items-center gap-2">
              {isTyping && <div className="h-4 w-4 border-2 border-volt/20 border-t-volt rounded-full animate-spin" aria-hidden="true" />}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="tap-target text-xs font-mono text-ash hover:text-bone uppercase bg-white/[0.03] border border-white/5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                  aria-label={t.ship_clear}
                >
                  {t.ship_clear}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. Delivery Rates Table */}
        <section className="max-w-4xl mx-auto mb-16 sm:mb-20">
          <div className="bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
            <div className={`p-5 sm:p-6 border-b border-white/5 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-bone flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-volt" aria-hidden="true" />
                {t.ship_table_title}
              </h3>
              <span className="text-xs font-mono text-ash">{filteredRates.length} {t.ship_entries}</span>
            </div>

            <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-ash font-mono uppercase tracking-wider bg-white/[0.02]">
                    <th className="py-4 px-3 sm:px-6" scope="col">{t.ship_col_state}</th>
                    <th className="py-4 px-3 sm:px-4 text-center" scope="col">{t.ship_col_home}</th>
                    <th className="hidden sm:table-cell py-4 px-4 text-center" scope="col">{t.ship_col_pickup}</th>
                    <th className="py-4 px-3 sm:px-6 text-right" scope="col">{t.ship_col_time}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  <AnimatePresence mode="popLayout">
                    {filteredRates.length > 0 ? (
                      filteredRates.map((rate) => (
                        <motion.tr
                          layout
                          key={rate.state}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="py-4 px-3 sm:px-6 font-semibold text-bone group-hover:text-volt transition-colors">
                            <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <MapPin className="w-3.5 h-3.5 text-ash group-hover:text-volt transition-colors flex-shrink-0" aria-hidden="true" />
                              {rate.state}
                            </span>
                          </td>
                          <td className="py-4 px-3 sm:px-4 text-center font-mono text-bone font-bold">
                            {rate.homePrice}
                          </td>
                          <td className="hidden sm:table-cell py-4 px-4 text-center font-mono text-ash">
                            {rate.pickupPrice}
                          </td>
                          <td className="py-4 px-3 sm:px-6 text-right text-ash font-medium">
                            {rate.deliveryTime}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-16 text-center text-ash text-xs sm:text-sm">
                          <AlertCircle className="w-8 h-8 text-ash/30 mx-auto mb-3" aria-hidden="true" />
                          {t.ship_no_results}
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 4. Shipping Methods Cards */}
        <section className="max-w-4xl mx-auto mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase text-bone">{t.ship_methods_title}</h2>
            <p className="text-xs font-mono uppercase tracking-widest text-volt mt-1">{t.ship_methods_subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Home Delivery Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-8 hover:border-volt/30 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-volt/5 blur-3xl group-hover:bg-volt/10 transition-all" aria-hidden="true" />
              <div>
                <div className="h-12 w-12 rounded-2xl bg-volt/10 text-volt flex items-center justify-center mb-6">
                  <Truck className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold font-display uppercase tracking-wider text-bone mb-3">
                  {t.ship_home_title}
                </h3>
                <p className="text-sm text-ash leading-relaxed mb-6">
                  {t.ship_home_desc}
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-ash font-medium">
                  {[t.ship_home_feat1, t.ship_home_feat2, t.ship_home_feat3].map((feat) => (
                    <li key={feat} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-volt flex-shrink-0" aria-hidden="true" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-ash">{t.ship_home_best}</span>
                <span className="text-volt font-bold">{t.ship_home_best_val}</span>
              </div>
            </motion.div>

            {/* Pickup Point Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-8 hover:border-volt/30 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-volt/5 blur-3xl group-hover:bg-volt/10 transition-all" aria-hidden="true" />
              <div>
                <div className="h-12 w-12 rounded-2xl bg-volt/10 text-volt flex items-center justify-center mb-6">
                  <MapPin className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold font-display uppercase tracking-wider text-bone mb-3">
                  {t.ship_pickup_title}
                </h3>
                <p className="text-sm text-ash leading-relaxed mb-6">
                  {t.ship_pickup_desc}
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-ash font-medium">
                  {[t.ship_pickup_feat1, t.ship_pickup_feat2, t.ship_pickup_feat3].map((feat) => (
                    <li key={feat} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-volt flex-shrink-0" aria-hidden="true" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-ash">{t.ship_pickup_best}</span>
                <span className="text-volt font-bold">{t.ship_pickup_best_val}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 5. Shipping Policy Section */}
        <section className="max-w-4xl mx-auto mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase text-bone">{t.ship_policy_title}</h2>
            <p className="text-xs font-mono uppercase tracking-widest text-volt mt-1">{t.ship_policy_subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {[
              { icon: <Clock className="w-4 h-4" />, title: t.ship_policy_proc_title, desc: t.ship_policy_proc_desc },
              { icon: <Truck className="w-4 h-4" />, title: t.ship_policy_del_title, desc: t.ship_policy_del_desc },
              { icon: <ShieldCheck className="w-4 h-4" />, title: t.ship_policy_free_title, desc: t.ship_policy_free_desc },
              { icon: <RotateCcw className="w-4 h-4" />, title: t.ship_policy_ret_title, desc: t.ship_policy_ret_desc },
            ].map((card) => (
              <div key={card.title} className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 sm:p-6 flex gap-4">
                <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-volt flex-shrink-0">
                  {card.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-bone mb-2">{card.title}</h4>
                  <p className="text-xs sm:text-sm text-ash leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. FAQ Section */}
        <section className="max-w-4xl mx-auto mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase text-bone">{t.ship_faq_title}</h2>
            <p className="text-xs font-mono uppercase tracking-widest text-volt mt-1">General logistics inquiries</p>
          </div>

          <div className="space-y-4">
            {FAQ_DATA.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className={`w-full py-5 px-6 flex items-center justify-between text-left hover:bg-white/[0.02] cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-bone flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-ash flex-shrink-0" aria-hidden="true" />
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-ash flex-shrink-0"
                      aria-hidden="true"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-ash leading-relaxed border-t border-white/[0.02]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. Contact Support */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-volt/10 blur-[60px]" aria-hidden="true" />

            <div className={`flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`max-w-md text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-volt uppercase mb-2">
                  {t.ship_custom_title}
                </h3>
                <p className="text-sm text-ash leading-relaxed">
                  {t.ship_custom_desc}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <button
                  onClick={() => {
                    setToastMsg('Connecting with concierge via WhatsApp...');
                    setTimeout(() => setToastMsg(''), 3000);
                  }}
                  className="px-6 py-4 rounded-xl bg-emerald-600/90 text-white font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all cursor-pointer shadow-lg shadow-emerald-500/10 tap-target"
                >
                  <MessageSquare className="w-4 h-4" aria-hidden="true" />
                  {t.ship_whatsapp}
                </button>
                <a
                  href="mailto:concierge@drippyfootwear.com?subject=Delivery Inquiry"
                  className="px-6 py-4 rounded-xl bg-white/[0.04] border border-white/5 text-bone font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 hover:bg-white/[0.08] hover:border-white/15 transition-all text-center tap-target"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  {t.ship_email_support}
                </a>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 max-w-xl mx-auto lg:mx-0">
              <form onSubmit={handleSupportSubmit} className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <label htmlFor="ship-message" className="sr-only">{t.ship_message_placeholder}</label>
                <input
                  id="ship-message"
                  type="text"
                  placeholder={t.ship_message_placeholder}
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  required
                  className="w-full bg-white/[0.02] border border-white/5 focus:border-volt/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-bone focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 sm:px-5 bg-volt text-ink font-mono font-bold text-xs uppercase rounded-xl hover:bg-bone transition-colors cursor-pointer flex items-center gap-1.5 tap-target whitespace-nowrap"
                >
                  {t.ship_send}
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Global Toast Alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-zinc text-bone border border-white/10 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md"
            role="status"
            aria-live="polite"
          >
            <div className="h-2 w-2 rounded-full bg-volt animate-ping" aria-hidden="true" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
