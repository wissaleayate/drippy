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

interface RateRow {
  state: string;
  homePrice: string;
  pickupPrice: string;
  deliveryTime: string;
}

const RATE_DATA: RateRow[] = [
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

const FAQ_DATA: FAQItem[] = [
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 1 to 2 business days for major metropolitan hubs (like Algiers or Blida), and 3 to 5 business days for regional and southern provinces. Order dispatch occurs within 24 hours of confirmation.'
  },
  {
    question: 'How can I track my order?',
    answer: 'Once dispatched, you will receive an SMS and email with a secure tracking link. You can also head over to our tracking portal and input your Order ID (e.g. DP-98231) to view real-time courier coordinates.'
  },
  {
    question: 'Can I change my delivery address?',
    answer: 'Yes, address modifications are permitted up to 2 hours post-confirmation. Please reach out to our concierge immediately via WhatsApp or phone with your Order ID to apply changes.'
  },
  {
    question: 'What happens if I miss my delivery?',
    answer: 'Our elite courier service will attempt a second delivery on the following business day. You will receive a notification call prior to the courier arriving to align on convenient times.'
  }
];

export default function ShippingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [supportMessage, setSupportMessage] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Simulate premium real-time loading feedback on search typing
  useEffect(() => {
    if (!searchQuery) return;
    setIsTyping(true);
    const handler = setTimeout(() => setIsTyping(false), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filtered rates computed on demand
  const filteredRates = RATE_DATA.filter((rate) =>
    rate.state.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setToastMsg('Message sent successfully. Our concierge will contact you.');
    setSupportMessage('');
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="bg-ink text-bone min-h-screen font-sans flex flex-col selection:bg-volt selection:text-ink">
      {/* Sticky Premium Navbar */}
      <Nav />

      {/* Main Container */}
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto w-full">
        
        {/* 1. Hero Section - Animated entry */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 mt-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-4">
            <Truck className="w-3.5 h-3.5 text-volt" />
            <span className="text-[10px] font-mono tracking-widest text-ash uppercase">Global Logistics</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-display font-black tracking-tight text-bone uppercase mb-4">
            Shipping & Delivery
          </h1>
          <p className="text-sm sm:text-base text-ash max-w-lg mx-auto font-medium leading-relaxed">
            Find delivery fees, shipping methods and estimated delivery times across all regions.
          </p>
        </motion.section>

        {/* 2. Interactive Search Bar - Sticky container */}
        <div className="max-w-4xl mx-auto mb-12 sticky top-20 z-30">
          <div className="relative flex items-center bg-zinc/90 border border-white/5 focus-within:border-volt/35 rounded-2xl p-1.5 shadow-2xl backdrop-blur-lg transition-all duration-300">
            <Search className="w-5 h-5 text-ash ml-4 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search delivery tariff by state/province (e.g. Algiers, Oran, Blida)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 outline-0 py-3.5 px-4 text-sm sm:text-base text-bone placeholder:text-ash/55 focus:ring-0 focus:outline-none"
              id="state-search-input"
            />
            
            {/* Real-time typing spinner / loading indicators */}
            <div className="absolute right-4 flex items-center gap-2">
              {isTyping && (
                <div className="h-4 w-4 border-2 border-volt/20 border-t-volt rounded-full animate-spin" />
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-mono text-ash hover:text-bone uppercase bg-white/[0.03] border border-white/5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. Delivery Rates Table & Grid */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-bone flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-volt" />
                Delivery Tariffs By Region
              </h3>
              <span className="text-xs font-mono text-ash">{filteredRates.length} entries shown</span>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-ash font-mono uppercase tracking-wider bg-white/[0.02]">
                    <th className="py-4 px-6">State / Province</th>
                    <th className="py-4 px-4 text-center">Home Delivery Price</th>
                    <th className="py-4 px-4 text-center">Pickup Point Price</th>
                    <th className="py-4 px-6 text-right">Est. Delivery Time</th>
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
                          <td className="py-4.5 px-6 font-semibold text-bone group-hover:text-volt transition-colors flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-ash group-hover:text-volt transition-colors" />
                            {rate.state}
                          </td>
                          <td className="py-4.5 px-4 text-center font-mono text-bone font-bold">
                            {rate.homePrice}
                          </td>
                          <td className="py-4.5 px-4 text-center font-mono text-ash">
                            {rate.pickupPrice}
                          </td>
                          <td className="py-4.5 px-6 text-right text-ash font-medium">
                            {rate.deliveryTime}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-16 text-center text-ash text-xs sm:text-sm">
                          <AlertCircle className="w-8 h-8 text-ash/30 mx-auto mb-3" />
                          No regions found matching "{searchQuery}".
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
        <section className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-black uppercase text-bone">Shipping Methods</h2>
            <p className="text-xs font-mono uppercase tracking-widest text-volt mt-1">Tailored for convenience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Home Delivery Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-8 hover:border-volt/30 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-volt/5 blur-3xl group-hover:bg-volt/10 transition-all" />
              <div>
                <div className="h-12 w-12 rounded-2xl bg-volt/10 text-volt flex items-center justify-center mb-6">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display uppercase tracking-wider text-bone mb-3">
                  Home Delivery
                </h3>
                <p className="text-sm text-ash leading-relaxed mb-6">
                  Experience seamless home drop-offs with signature confirmation. Every package is packed in custom climate-sealed containers.
                </p>
                
                <ul className="space-y-3 text-xs sm:text-sm text-ash font-medium">
                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-volt" />
                    Delivered directly to your door address
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-volt" />
                    Next-day express delivery in primary hubs
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-volt" />
                    Secured handling & signature confirmation
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-ash">BEST FOR:</span>
                <span className="text-volt font-bold">Premium convenience</span>
              </div>
            </motion.div>

            {/* Pickup Point Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-8 hover:border-volt/30 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-volt/5 blur-3xl group-hover:bg-volt/10 transition-all" />
              <div>
                <div className="h-12 w-12 rounded-2xl bg-volt/10 text-volt flex items-center justify-center mb-6">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display uppercase tracking-wider text-bone mb-3">
                  Pickup Point
                </h3>
                <p className="text-sm text-ash leading-relaxed mb-6">
                  Collect your items from one of our partner courier offices at your leisure. A budget-friendly, secured shipping alternative.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-ash font-medium">
                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-volt" />
                    Pick up from nearest delivery center
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-volt" />
                    Lower shipping costs across all regions
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-volt" />
                    Flexible pickup times (Held securely for 7 days)
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-ash">BEST FOR:</span>
                <span className="text-volt font-bold">Cost-efficiency</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 5. Shipping Policy Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-black uppercase text-bone">Shipping Policy</h2>
            <p className="text-xs font-mono uppercase tracking-widest text-volt mt-1">Transparency is key</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Policy Card 1: Processing Time */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex gap-4">
              <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-volt flex-shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-bone mb-2">Processing Time</h4>
                <p className="text-xs sm:text-sm text-ash leading-relaxed">
                  Orders placed before 2:00 PM are packaged and dispatched same-day. Orders placed afterwards are processed next business morning.
                </p>
              </div>
            </div>

            {/* Policy Card 2: Delivery window */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex gap-4">
              <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-volt flex-shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-bone mb-2">Delivery Time</h4>
                <p className="text-xs sm:text-sm text-ash leading-relaxed">
                  Home delivery shipments arrive within 1 to 4 days depending on state proximity. Standard courier tracking begins upon handover.
                </p>
              </div>
            </div>

            {/* Policy Card 3: Free shipping condition */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex gap-4">
              <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-volt flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-bone mb-2">Free Shipping Conditions</h4>
                <p className="text-xs sm:text-sm text-ash leading-relaxed">
                  patrons receive complimentary standard shipping on orders exceeding $150. Applied automatically during secure checkout.
                </p>
              </div>
            </div>

            {/* Policy Card 4: Returns */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex gap-4">
              <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-volt flex-shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-bone mb-2">Easy Returns & Exchanges</h4>
                <p className="text-xs sm:text-sm text-ash leading-relaxed">
                  We offer a complimentary 30-day return policy. Items must be unworn and returned in their original packaging sleeve.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 6. FAQ Section - Interactive accordion */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-black uppercase text-bone">Frequently Asked Questions</h2>
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
                    className="w-full py-5 px-6 flex items-center justify-between text-left hover:bg-white/[0.02] cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-bone flex items-center gap-3">
                      <HelpCircle className="w-4.5 h-4.5 text-ash" />
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-ash"
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

        {/* 7. Contact Support Concierge Card */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
            {/* Accent glowing circle */}
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-volt/10 blur-[60px]" />
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
              <div className="max-w-md text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-display font-black text-volt uppercase mb-2">
                  Have Custom Shipping Needs?
                </h3>
                <p className="text-sm text-ash leading-relaxed">
                  Our elite concierge team is ready to coordinate custom delivery terms, bulk shipments, and regional delivery routing.
                </p>
              </div>

              {/* Message inputs form & triggers */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <button
                  onClick={() => {
                    setToastMsg('Connecting with concierge via WhatsApp...');
                    setTimeout(() => setToastMsg(''), 3000);
                  }}
                  className="px-6 py-4 rounded-xl bg-emerald-600/90 text-white font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp Concierge
                </button>
                <a
                  href="mailto:concierge@drippyfootwear.com?subject=Delivery Inquiry"
                  className="px-6 py-4 rounded-xl bg-white/[0.04] border border-white/5 text-bone font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 hover:bg-white/[0.08] hover:border-white/15 transition-all text-center"
                >
                  <Mail className="w-4 h-4" />
                  Email Support
                </a>
              </div>
            </div>

            {/* Quick message input form below */}
            <div className="mt-8 pt-8 border-t border-white/5 max-w-xl mx-auto lg:mx-0">
              <form onSubmit={handleSupportSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Drop a quick message to our concierge..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  required
                  className="w-full bg-white/[0.02] border border-white/5 focus:border-volt/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-bone focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 bg-volt text-ink font-mono font-bold text-xs uppercase rounded-xl hover:bg-bone transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  Send
                  <ExternalLink className="w-3 h-3" />
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Area */}
      <Footer />

      {/* Global Toast Alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-zinc text-bone border border-white/10 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md"
          >
            <div className="h-2 w-2 rounded-full bg-volt animate-ping" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
