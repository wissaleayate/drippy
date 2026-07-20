import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Package,
  Truck,
  RotateCcw,
  CreditCard,
  ChevronDown,
  Send,
  CheckCircle2,
} from 'lucide-react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { useLang } from '../../context/LanguageContext';

// ── Component ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const { t, isRTL } = useLang();

  // Form state
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Dynamic data using translations
  const INFO_CARDS = [
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Address',
      title: 'Find Us',
      value: '27 Rue des Martyrs\nAlgiers, Algeria 16000',
      accent: false,
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Phone',
      title: 'Call Us',
      value: '+213 (0) 23 45 67 89\nMon–Sat, 9 AM – 6 PM',
      accent: false,
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      title: 'Write Us',
      value: 'support@nk-store.dz\nReply within 24h',
      accent: true,
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Hours',
      title: 'Working Hours',
      value: 'Mon – Sat: 9 AM – 6 PM\nSunday: Closed',
      accent: false,
    },
  ];

  const SUPPORT_CARDS = [
    {
      icon: <Package className="w-6 h-6" />,
      title: t.contact_support_orders,
      description: t.contact_support_orders_desc,
      cta: t.contact_support_orders_cta,
      href: '/tracking',
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: t.contact_support_shipping,
      description: t.contact_support_shipping_desc,
      cta: t.contact_support_shipping_cta,
      href: '/shipping',
    },
    {
      icon: <RotateCcw className="w-6 h-6" />,
      title: t.contact_support_returns,
      description: t.contact_support_returns_desc,
      cta: t.contact_support_returns_cta,
      href: '#',
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: t.contact_support_payments,
      description: t.contact_support_payments_desc,
      cta: t.contact_support_payments_cta,
      href: '#',
    },
  ];

  const FAQ_DATA = [
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 3–5 business days for most wilayat. Express delivery (1–2 days) is available for Algiers, Oran, and Constantine. All orders are dispatched within 24 hours on business days.',
    },
    {
      question: 'Can I return or exchange a product?',
      answer: 'Yes. We offer free returns and exchanges within 30 days of delivery, provided the item is unworn, in its original box with tags attached. Simply initiate your return through the portal or email support.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept cash on delivery (COD), CIB/Edahabia debit cards, and BaridiMob. All card transactions are processed securely via 3D Secure.',
    },
    {
      question: 'How do I track my order?',
      answer: 'Use the Track Order page and enter your order ID or tracking number. Real-time updates are pushed to your order timeline as your package moves through our logistics network.',
    },
    {
      question: 'Are the shoes 100% authentic?',
      answer: 'Every product on NK Store is 100% authentic and sourced directly from authorised distributors. We do not carry replica or unauthorised merchandise.',
    },
    {
      question: 'Do you ship outside Algeria?',
      answer: 'International shipping is currently in beta for select countries (France, Tunisia, Morocco). Contact support for a manual quote if your country is not yet listed.',
    },
  ];

  const SOCIALS = [
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      name: 'Twitter / X',
      href: '#',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: '#',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: '#',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
  ];

  const SUBJECTS = [
    'Order Issue',
    'Shipping & Delivery',
    'Return / Exchange',
    'Payment Problem',
    'Product Inquiry',
    'Other',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1400);
  };

  return (
    <div className="bg-ink text-bone min-h-screen font-sans flex flex-col selection:bg-volt selection:text-ink">
      <Nav />

      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto w-full">

        {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-20 mt-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-volt animate-pulse" aria-hidden="true" />
            <span className="text-[10px] font-mono tracking-widest text-ash uppercase">{t.contact_eyebrow}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black tracking-tight text-bone uppercase mb-5">
            {t.contact_heading.split('\n').map((line, i) => (
              <span key={i}>
                {i === 1 ? <span className="text-volt">{line}</span> : line}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>
          <p className="text-sm sm:text-base text-ash max-w-md mx-auto font-medium leading-relaxed">
            {t.contact_subheading}
          </p>
        </motion.section>

        {/* ── 2. Info Cards ────────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 sm:mb-20"
          aria-label="Contact information"
        >
          {INFO_CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-default
                ${card.accent
                  ? 'bg-volt/[0.04] border-volt/20 hover:border-volt/40 hover:bg-volt/[0.07]'
                  : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04]'
                }`}
            >
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse justify-between' : 'justify-between'} mb-4`}>
                <div className={`p-2 rounded-xl transition-colors duration-300
                  ${card.accent ? 'bg-volt/10 text-volt' : 'bg-white/[0.05] text-ash group-hover:text-bone'}`}
                  aria-hidden="true"
                >
                  {card.icon}
                </div>
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-ash/50">{card.label}</span>
              </div>
              <h3 className={`font-display font-black text-lg uppercase tracking-wide mb-2
                ${card.accent ? 'text-volt' : 'text-bone'}`}
              >
                {card.title}
              </h3>
              <p className="text-sm text-ash leading-relaxed whitespace-pre-line">{card.value}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* ── 3. Form + Map ────────────────────────────────────────────────── */}
        <section className={`grid grid-cols-1 lg:grid-cols-5 gap-8 mb-20 sm:mb-24 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 sm:p-8 md:p-10"
          >
            <div className={`flex items-center gap-3 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="h-2 w-2 rounded-full bg-volt" aria-hidden="true" />
              <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-wider text-bone">
                {t.contact_send_heading}
              </h2>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center py-16 gap-5 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <div className="w-16 h-16 rounded-full bg-volt/10 border border-volt/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-volt" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display font-black text-2xl uppercase text-bone mb-1">{t.contact_success_title}</p>
                    <p className="text-sm text-ash max-w-xs">{t.contact_success_sub}</p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-widest border border-white/10 hover:border-volt/40 hover:text-volt text-ash rounded-xl transition-all duration-200"
                  >
                    {t.contact_send_another}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5"
                  noValidate
                >
                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="contact-name" className="text-[10px] font-mono tracking-[0.18em] uppercase text-ash">
                        {t.contact_name}
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder={t.contact_name_placeholder}
                        autoComplete="name"
                        className="bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.14] focus:border-volt/40 rounded-xl px-4 py-3 text-sm text-bone placeholder:text-ash/50 outline-none transition-all duration-200 focus:bg-white/[0.05]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="contact-email" className="text-[10px] font-mono tracking-[0.18em] uppercase text-ash">
                        {t.contact_email}
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.14] focus:border-volt/40 rounded-xl px-4 py-3 text-sm text-bone placeholder:text-ash/50 outline-none transition-all duration-200 focus:bg-white/[0.05]"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-subject" className="text-[10px] font-mono tracking-[0.18em] uppercase text-ash">
                      {t.contact_subject}
                    </label>
                    <div className="relative">
                      <select
                        id="contact-subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full appearance-none bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.14] focus:border-volt/40 rounded-xl px-4 py-3 text-sm text-bone outline-none transition-all duration-200 focus:bg-white/[0.05] cursor-pointer"
                        style={{ paddingInlineEnd: '2.5rem' }}
                      >
                        <option value="" style={{ background: '#111' }}>{t.contact_subject_placeholder}</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s} style={{ background: '#111' }}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-ash pointer-events-none"
                        style={{ insetInlineEnd: '1rem' }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-message" className="text-[10px] font-mono tracking-[0.18em] uppercase text-ash">
                      {t.contact_message}
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder={t.contact_message_placeholder}
                      className="bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.14] focus:border-volt/40 rounded-xl px-4 py-3 text-sm text-bone placeholder:text-ash/50 outline-none transition-all duration-200 focus:bg-white/[0.05] resize-none leading-relaxed"
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={sending}
                    whileTap={{ scale: 0.98 }}
                    className="mt-1 flex items-center justify-center gap-3 w-full py-4 bg-volt text-ink font-mono font-bold text-xs uppercase tracking-[0.15em] rounded-xl hover:bg-bone transition-colors duration-200 disabled:opacity-60 cursor-pointer tap-target"
                  >
                    {sending ? (
                      <>
                        <span className="h-4 w-4 border-2 border-ink/20 border-t-ink rounded-full animate-spin" aria-hidden="true" />
                        {t.contact_submitting}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" aria-hidden="true" />
                        {t.contact_submit}
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Map / Visual */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Map placeholder */}
            <div className="flex-1 min-h-[240px] sm:min-h-[260px] bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden relative group">
              <div
                className="absolute inset-0 opacity-[0.04]"
                aria-hidden="true"
                style={{
                  backgroundImage: 'linear-gradient(#c8ff00 1px, transparent 1px), linear-gradient(90deg, #c8ff00 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-volt/10 border border-volt/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-volt" aria-hidden="true" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-volt animate-ping" aria-hidden="true" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-volt" aria-hidden="true" />
                </div>
                <div className="text-center">
                  <p className="font-display font-black text-base uppercase text-bone tracking-wide">Algiers, Algeria</p>
                  <p className="text-xs text-ash font-mono mt-1">27 Rue des Martyrs</p>
                </div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest bg-volt text-ink rounded-lg hover:bg-bone transition-colors duration-200"
                  aria-label="Open location in Google Maps"
                >
                  {t.contact_open_maps}
                </a>
              </div>
            </div>

            {/* Social links card */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6">
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-ash mb-4">{t.contact_follow_us}</p>
              <div className="grid grid-cols-2 gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-volt/30 hover:text-volt text-ash transition-all duration-200 group"
                  >
                    <span className="transition-colors duration-200">{s.icon}</span>
                    <span className="text-xs font-medium text-bone/70 group-hover:text-bone transition-colors">{s.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── 4. Support Cards ─────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 sm:mb-24"
        >
          <div className={`flex items-center gap-3 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="h-2 w-2 rounded-full bg-volt" aria-hidden="true" />
            <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-wider text-bone">
              {t.contact_how_help}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUPPORT_CARDS.map((card, i) => (
              <motion.a
                key={card.title}
                href={card.href}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.07 * i, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:border-volt/25 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="p-2.5 w-fit rounded-xl bg-white/[0.05] text-ash group-hover:text-volt group-hover:bg-volt/10 transition-all duration-300 mb-5" aria-hidden="true">
                  {card.icon}
                </div>
                <h3 className="font-display font-black text-lg uppercase tracking-wide text-bone mb-2">{card.title}</h3>
                <p className="text-xs text-ash leading-relaxed flex-1 mb-5">{card.description}</p>
                <span className="text-[10px] font-mono font-bold tracking-[0.15em] uppercase text-volt flex items-center gap-1.5 transition-all duration-200">
                  {card.cta}
                  <span className="group-hover:translate-x-1 transition-transform duration-200 rtl-flip" aria-hidden="true">→</span>
                </span>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* ── 5. FAQ ───────────────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-4">
              <span className="text-[10px] font-mono tracking-widest text-ash uppercase">{t.contact_quick_answers}</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-bone">
              {t.contact_faq_title}
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-white/[0.05]" role="list">
            {FAQ_DATA.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="py-1" role="listitem">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left group cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className={`text-sm sm:text-base font-medium pr-6 transition-colors duration-200 ${isRTL ? 'text-right pr-0 pl-6' : ''} ${isOpen ? 'text-volt' : 'text-bone group-hover:text-volt'}`}>
                      {item.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className={`flex-shrink-0 transition-colors duration-200 ${isOpen ? 'text-volt' : 'text-ash'}`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className={`pb-5 text-sm text-ash leading-relaxed ${isRTL ? 'pl-0 pr-10' : 'pr-10'}`}>
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ── 6. CTA Banner ───────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 md:p-14 text-center mb-4"
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] pointer-events-none"
            aria-hidden="true"
            style={{ background: 'radial-gradient(ellipse, rgba(200,255,0,0.07) 0%, transparent 70%)' }}
          />
          <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-ash mb-3">{t.contact_still_questions}</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-bone mb-4">
            {t.contact_one_message_away}
          </h2>
          <p className="text-sm text-ash max-w-sm mx-auto mb-8 leading-relaxed">
            {t.contact_concierge_desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@nk-store.dz"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-volt text-ink font-mono font-bold text-xs uppercase tracking-[0.15em] rounded-xl hover:bg-bone transition-colors duration-200 tap-target"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              {t.contact_email_support}
            </a>
            <a
              href="tel:+21323456789"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-transparent border border-white/10 text-bone font-mono font-bold text-xs uppercase tracking-[0.15em] rounded-xl hover:border-volt/40 hover:text-volt transition-all duration-200 tap-target"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              {t.contact_call_us}
            </a>
          </div>
        </motion.section>

      </main>

      <Footer />
    </div>
  );
}
